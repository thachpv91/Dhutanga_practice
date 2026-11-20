// Dhutanga night – multiplayer server.
// Static files + Server-Sent Events for live presence/moments + traces in the shared store.
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const auth = require("./auth");
const social = require("./social");
const connections = require("./connections");
const events = require("./events");
const { createTracker } = require("./encounters");
const { isArchived } = require("./store");
const { createStatic } = require("./static");

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const MAX_TRACES = 500;

const ROLES = ["monk", "ghost", "villager"];
const MOMENT_TOPICS = ["chime", "sigh", "lantern", "deva"];
const TRACE_KINDS = ["offering", "chant", "sigh", "incense", "alms", "release", "vigil", "keepsake", "lamp", "bowl"];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".webp": "image/webp",
};

// ---------- state ----------
/** @type {Map<string, {res: http.ServerResponse, presence: object, lastEmit: number, lastTrace: number}>} */
// A peer may carry userId / charId / handle (signed-in players only). Those internal ids stay in this map:
// publicPeers() exposes just the opaque handle.
const peers = new Map();
let traces = [];
const tracker = createTracker({ range: 150, thresholdMs: 20000, maxGapMs: 3000 });
const CHAR_ID_RE = /^[\w-]{8,64}$/;
const SEEN_TOUCH_MS = 60000;

// Load recent traces from the shared store; a failure just means starting empty.
async function restoreTraces() {
  try { traces = [...(await auth.store.loadTraces(MAX_TRACES)), ...traces].slice(-MAX_TRACES); } // keep any left while loading
  catch (err) { console.error("load traces failed:", err.message); }
}

// ---------- helpers ----------
function cleanText(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩]/g, "")
    .trim()
    .slice(0, max);
}

// Each peer has a secret pid (only its own browser knows it) and a public sid shown to everyone else.
// Other players only ever see sids, so nobody can post as someone else.
function publicPeers() {
  return [...peers.values()].map((p) => ({ pid: p.sid, ...p.presence, handle: p.handle || null }));
}

// True while a connected peer is bound to this character ("đang chơi"). Used only by connections.js.
function isCharOnline(charId) {
  for (const p of peers.values()) if (p.charId === charId) return true;
  return false;
}

function send(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function broadcast(event, data) {
  for (const p of peers.values()) send(p.res, event, data);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 4096) {
        reject(new Error("too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("bad json"));
      }
    });
  });
}

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": MIME[".json"] });
  res.end(JSON.stringify(data));
}

// ---------- routes ----------
async function handleEvents(req, res, url) {
  const pid = cleanText(url.searchParams.get("pid"), 40) || crypto.randomUUID();
  const user = await auth.currentUser(req);
  const userId = user ? user.id : null; // guests: null
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("retry: 3000\n\n");

  const existing = peers.get(pid);
  const sid = existing?.sid ?? crypto.randomBytes(6).toString("hex");
  // Reconnecting as the same account keeps the verified character; another account starts unbound.
  const same = !!existing && existing.userId === userId;
  peers.set(pid, {
    sid,
    userId,
    charId: same ? existing.charId : null,
    handle: same ? existing.handle : null,
    boundId: same ? existing.boundId : null,
    bindSeq: 0,
    seenAt: 0,
    lastChat: 0,
    res,
    presence: existing?.presence ?? { role: null, scene: null, nick: "", x: 0.5, y: 0.95, pose: null },
    lastEmit: 0,
    lastTrace: 0,
  });

  send(res, "init", { pid, sid, peers: publicPeers(), traces: traces.slice(-60) });
  broadcast("peers", publicPeers());

  const heartbeat = setInterval(() => res.write(": keepalive\n\n"), 20000);
  req.on("close", () => {
    clearInterval(heartbeat);
    const current = peers.get(pid);
    if (current && current.res === res) {
      peers.delete(pid);
      tracker.forget(pid);
      if (current.charId) auth.store.touchSeen(current.charId).catch((err) => console.error("touch seen failed:", err.message));
      broadcast("peers", publicPeers());
    }
  });
}

// Binds the peer to one of its account's characters. The character is checked against the session's
// account (never trusted from the body alone), and the answer is cached until the id changes.
// Guests stay unbound. Failures leave the peer unbound and are retried on the next presence.
async function bindCharacter(peer, rawId) {
  const cid = typeof rawId === "string" && CHAR_ID_RE.test(rawId) ? rawId : null;
  const seq = ++peer.bindSeq;
  if (!peer.userId) {
    peer.charId = null; peer.handle = null; peer.boundId = null;
    return;
  }
  if (cid === peer.boundId) return;
  let charId = null, handle = null;
  if (cid) {
    try {
      const own = await auth.store.getCharacter(peer.userId, cid);
      // An archived (story_completed) character is never bound: no handle, no presence, no encounters.
      if (own && !isArchived(own)) {
        handle = await auth.store.ensureHandle(peer.userId, cid);
        charId = handle ? cid : null;
      }
    } catch (err) {
      console.error("bind character failed:", err.message);
    }
  }
  if (seq !== peer.bindSeq) return; // a newer presence has already started binding
  peer.charId = charId;
  peer.handle = handle;
  peer.boundId = charId ? cid : null;
}

// The 'Từng gặp' feed. Runs on each presence update and on a 1-second tick, because the client only
// posts presence when a player moves or changes state, so two standing-still players would never accumulate time.
function trackEncounters(now = Date.now()) {
  try {
    const list = [];
    const owners = new Map(); // charId -> userId, for the pairs that come back
    for (const [pid, p] of peers) {
      if (!p.userId || !p.charId) continue;
      owners.set(p.charId, p.userId);
      list.push({ key: pid, userId: p.userId, charId: p.charId, scene: p.presence.scene, x: p.presence.x * WORLD_W, y: p.presence.y * WORLD_H });
    }
    for (const [a, b] of tracker.update(list, now)) recordPair(a, owners.get(a), b, owners.get(b), now);
  } catch (err) {
    console.error("encounter tracking failed:", err.message);
  }
}

// Both directions, unless the two accounts block each other. Errors are logged; nothing waits on this.
function recordPair(charA, userA, charB, userB, now) {
  if (!userA || !userB || userA === userB) return;
  (async () => {
    if (await auth.store.isBlockedEither(userA, userB)) return;
    await auth.store.recordEncounter(charA, charB, now);
    await auth.store.recordEncounter(charB, charA, now);
  })().catch((err) => console.error("record encounter failed:", err.message));
}

async function handlePresence(req, res) {
  const body = await readJson(req);
  const peer = peers.get(body.pid);
  if (!peer) return json(res, 404, { error: "not connected" });
  peer.presence = {
    role: ROLES.includes(body.role) ? body.role : null,
    scene: cleanText(body.scene, 24) || null,
    nick: cleanText(body.nick, 24),
    x: Math.min(1, Math.max(0, Number(body.x) || 0.5)),
    y: Math.min(1, Math.max(0, Number(body.y) || 0.95)),
    pose: body.pose === "sit" ? "sit" : null,
    mood: Math.round(Math.min(1, Math.max(0, Number(body.mood) || 0.5)) * 50) / 50,
  };
  await bindCharacter(peer, body.characterId);
  const now = Date.now();
  if (peer.charId && now - peer.seenAt >= SEEN_TOUCH_MS) {
    peer.seenAt = now;
    auth.store.touchSeen(peer.charId, now).catch((err) => console.error("touch seen failed:", err.message));
  }
  trackEncounters(now);
  broadcast("peers", publicPeers());
  json(res, 200, { ok: true });
}

async function handleEmit(req, res) {
  const body = await readJson(req);
  const peer = peers.get(body.pid);
  if (!peer) return json(res, 404, { error: "not connected" });
  if (!MOMENT_TOPICS.includes(body.topic)) return json(res, 400, { error: "unknown topic" });
  const now = Date.now();
  if (now - peer.lastEmit < 4000) return json(res, 429, { error: "too fast" });
  peer.lastEmit = now;
  broadcast("moment", { topic: body.topic, from: peer.sid, x: peer.presence.x, y: peer.presence.y, role: peer.presence.role });
  json(res, 200, { ok: true });
}

// ---------- chat ----------
// Nearby chat only: a message reaches players within CHAT_RANGE world units of the speaker.
// Nothing is stored. A light filter blocks links, phone numbers and a few slurs.
const WORLD_W = 640, WORLD_H = 2000;
const CHAT_RANGE = 260;
const CHAT_MAX = 80;
const BLOCKED_TOKENS = new Set(["dm", "dmm", "dcm", "dcmm", "dkm", "vcl", "vkl", "clgt", "cmm", "ditme", "ditmemay", "fuck", "shit", "bitch", "nigger", "nigga", "cunt"]);

const BLOCKED_STEMS = ["ditme", "ditm", "ditcon", "dume", "dumay", "dcmm", "fuck", "nigger", "nigga", "bitch", "cunt"];

function foldText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase();
}
function chatRejected(text) {
  if (/https?:|www\.|\.(com|net|org|vn|io|xyz|gg|me)\b|@\w|t\.me/i.test(text)) return "links";
  if (/\d{8,}/.test(text.replace(/[\s.\-]/g, ""))) return "numbers";
  if (/(.)\1{7,}/.test(text)) return "spam";
  const folded = foldText(text);
  const raw = folded.split(/[^a-z]+/).filter(Boolean);
  // glue runs of single letters back together so "d.m" or "v c l" cannot dodge the list
  const tokens = [];
  let run = "";
  for (const t of raw) {
    if (t.length === 1) run += t;
    else { if (run) { tokens.push(run); run = ""; } tokens.push(t); }
  }
  if (run) tokens.push(run);
  if (tokens.some((t) => BLOCKED_TOKENS.has(t))) return "language";
  const letters = folded.replace(/[^a-z]/g, "");
  if (BLOCKED_STEMS.some((w) => letters.includes(w))) return "language";
  return null;
}

async function handleChat(req, res) {
  const body = await readJson(req);
  const peer = peers.get(body.pid);
  if (!peer) return json(res, 404, { error: "not connected" });
  if (!peer.presence.role) return json(res, 400, { error: "pick a role first" });
  const text = cleanText(body.text, CHAT_MAX).replace(/\s+/g, " ");
  if (!text) return json(res, 400, { error: "empty" });
  const now = Date.now();
  if (now - peer.lastChat < 1500) return json(res, 429, { error: "too fast" });
  const why = chatRejected(text);
  if (why) return json(res, 400, { error: "blocked", reason: why });
  peer.lastChat = now;
  const msg = { id: crypto.randomUUID(), from: peer.sid, role: peer.presence.role, nick: peer.presence.nick, text, at: now };
  const sx = peer.presence.x * WORLD_W, sy = peer.presence.y * WORLD_H;
  let heard = 0;
  for (const p of peers.values()) {
    const near = p === peer || Math.hypot(p.presence.x * WORLD_W - sx, p.presence.y * WORLD_H - sy) <= CHAT_RANGE;
    if (!near) continue;
    if (p !== peer) heard++;
    send(p.res, "chat", msg);
  }
  json(res, 200, { ok: true, heard });
}

async function handleTrace(req, res) {
  const body = await readJson(req);
  const peer = peers.get(body.pid);
  if (!peer) return json(res, 404, { error: "not connected" });
  if (!TRACE_KINDS.includes(body.kind)) return json(res, 400, { error: "unknown kind" });
  const now = Date.now();
  if (now - peer.lastTrace < 3000) return json(res, 429, { error: "too fast" });
  peer.lastTrace = now;
  const trace = {
    id: crypto.randomUUID(),
    kind: body.kind,
    variant: Math.max(0, Math.min(5, Number(body.variant) || 0)),
    role: ROLES.includes(body.role) ? body.role : null,
    nick: cleanText(body.nick, 24),
    at: now,
  };
  traces.push(trace);
  if (traces.length > MAX_TRACES) traces = traces.slice(-MAX_TRACES);
  auth.store.addTrace(trace).catch((err) => console.error("save trace failed:", err.message));
  broadcast("trace", trace);
  json(res, 200, { ok: true, trace });
}

const serveStatic = createStatic(PUBLIC_DIR, MIME);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    // Tiny health check for uptime pingers: no state, no disk, no SSE.
    if ((req.method === "GET" || req.method === "HEAD") && url.pathname === "/healthz") {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
      return res.end(req.method === "HEAD" ? undefined : "ok");
    }
    // Runtime flags for the client. The dev panel (?dev) is off in production unless DEV_PANEL=1.
    if (req.method === "GET" && url.pathname === "/config.js") {
      const dev = process.env.DEV_PANEL ? process.env.DEV_PANEL === "1" : process.env.NODE_ENV !== "production";
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" });
      return res.end(`window.APP_CONFIG = { dev: ${dev} };`);
    }
    // Before auth.handle: that module answers every /api/characters/... path itself.
    if (await events.handle(req, res, url)) return;
    if (await auth.handle(req, res, url)) return;
    if (await social.handle(req, res, url)) return;
    if (await connections.handle(req, res, url, { isOnline: isCharOnline })) return;
    if (req.method === "GET" && url.pathname === "/events") return await handleEvents(req, res, url);
    if (req.method === "POST" && url.pathname === "/api/presence") return await handlePresence(req, res);
    if (req.method === "POST" && url.pathname === "/api/emit") return await handleEmit(req, res);
    if (req.method === "POST" && url.pathname === "/api/trace") return await handleTrace(req, res);
    if (req.method === "POST" && url.pathname === "/api/chat") return await handleChat(req, res);
    if (req.method === "GET") return serveStatic(req, res, url);
    res.writeHead(405);
    res.end();
  } catch (err) {
    json(res, 400, { error: err.message });
  }
});

restoreTraces();
setInterval(() => trackEncounters(), 1000).unref();
server.listen(PORT, () => {
  console.log(`Một đêm đầu đà đang chạy ở http://localhost:${PORT}`);
  console.log("Mở nhiều tab hoặc nhiều máy cùng mạng LAN để chơi cùng nhau.");
  console.log(`Tài khoản lưu ở: ${auth.storeKind() === "postgres" ? "Postgres (DATABASE_URL)" : "data/accounts.json (chỉ để thử)"}`);
});
