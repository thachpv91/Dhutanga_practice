// Social API: public profiles, the "Từng gặp" list, block / unblock and reports.
// Everything is addressed by the public handle. Internal character ids and user ids never leave
// the server: they are not in any response below.
const auth = require("./auth");
const { REPORT_REASON_MAX, isArchived } = require("./store");

const HANDLE_RE = /^[A-Za-z0-9_-]{8,32}$/;
const CHAR_ID_RE = /^[\w-]{8,64}$/;
const CARITA_MAX = 40;
const ITEM_MAX = 40;
const ITEMS_MAX = 6;

// The public profile: name, role, createdAt, carita and up to 6 item ids. Nothing else.
// A hidden profile only says that it is hidden, with the name and role.
// An archived (story_completed) character adds archived: true; active ones have no such key.
function publicProfile(c) {
  const archived = isArchived(c) ? { archived: true } : {};
  if (c.hide_profile) return { hidden: true, name: c.name, role: c.role, ...archived };
  const mind = c.data && typeof c.data.mind === "object" && c.data.mind ? c.data.mind : {};
  return {
    name: c.name,
    role: c.role,
    createdAt: c.created_at,
    carita: typeof mind.carita === "string" ? mind.carita.slice(0, CARITA_MAX) : null,
    items: Array.isArray(mind.items)
      ? mind.items.filter((i) => typeof i === "string").slice(0, ITEMS_MAX).map((i) => i.slice(0, ITEM_MAX))
      : [],
    ...archived,
  };
}

// Same stripping as the chat/cleanText rules: control and bidi characters out, whitespace squeezed, max 200 code points.
function cleanReason(v) {
  const s = String(v ?? "")
    .replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return [...s].slice(0, REPORT_REASON_MAX).join("");
}

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}

function readBody(req, limit = 2048) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => {
      body += c;
      if (body.length > limit) { reject(clientError("too large")); req.destroy(); }
    });
    req.on("end", () => {
      try { resolve(JSON.parse(body || "{}")); } catch { reject(clientError("bad json")); }
    });
  });
}
function clientError(message) {
  const e = new Error(message);
  e.client = true;
  return e;
}

// Signed-in JSON request guard (same rules as auth.js): JSON body for non-GET, and a session.
// Sends the error response itself and returns null when the request must stop.
async function signedIn(req, res) {
  if (req.method !== "GET" && !(req.headers["content-type"] || "").includes("application/json")) {
    json(res, 415, { error: "json only" });
    return null;
  }
  const user = await auth.currentUser(req);
  if (!user) { json(res, 401, { error: "not signed in" }); return null; }
  return user;
}

// Resolves a handle from a request body to the character row (internal use only).
async function targetFromBody(res, body) {
  const h = body && body.handle;
  if (typeof h !== "string" || !HANDLE_RE.test(h)) { json(res, 400, { error: "bad handle" }); return null; }
  const target = await auth.store.getByHandle(h);
  if (!target) { json(res, 404, { error: "not found" }); return null; }
  return target;
}

// Returns true when the request was handled.
async function handle(req, res, url) {
  const p = url.pathname;
  try {
    let m = p.match(/^\/api\/public\/([^/]+)$/);
    if (m) {
      if (req.method !== "GET") { json(res, 405, { error: "method not allowed" }); return true; }
      await publicRoute(req, res, m[1]);
      return true;
    }
    m = p.match(/^\/api\/encounters\/([\w-]{8,64})$/);
    if (m) {
      if (req.method !== "GET") { json(res, 405, { error: "method not allowed" }); return true; }
      await encountersRoute(req, res, m[1]);
      return true;
    }
    if (p === "/api/block" || p === "/api/unblock" || p === "/api/report") {
      if (req.method !== "POST") { json(res, 405, { error: "method not allowed" }); return true; }
      await actionRoute(req, res, p);
      return true;
    }
    return false;
  } catch (err) {
    if (err.client) json(res, 400, { error: err.message });
    else { console.error("social api failed:", err.message); json(res, 500, { error: "server error" }); }
    return true;
  }
}

// Anyone (guests too) can read a public profile. 404 when unknown, and also when either account blocked the other.
async function publicRoute(req, res, handleText) {
  if (!HANDLE_RE.test(handleText)) return json(res, 404, { error: "not found" });
  const c = await auth.store.getByHandle(handleText);
  if (!c) return json(res, 404, { error: "not found" });
  const viewer = await auth.currentUser(req);
  if (viewer && (await auth.store.isBlockedEither(viewer.id, c.user_id))) return json(res, 404, { error: "not found" });
  json(res, 200, publicProfile(c));
}

// Owner only. Rows: handle, name, role, hidden (their hide_profile), lastAt, count. Blocked accounts are left out.
async function encountersRoute(req, res, characterId) {
  const user = await signedIn(req, res);
  if (!user) return;
  const own = await auth.store.getCharacter(user.id, characterId);
  if (!own) return json(res, 404, { error: "not found" });
  const rows = await auth.store.listEncounters(characterId);
  const encounters = [];
  for (const r of rows) {
    if (!r.handle) continue;
    if (await auth.store.isBlockedEither(user.id, r.otherUserId)) continue;
    encounters.push({ handle: r.handle, name: r.name, role: r.role, hidden: !!r.hideProfile, lastAt: r.lastAt, count: r.count });
  }
  json(res, 200, { encounters });
}

async function actionRoute(req, res, action) {
  const user = await signedIn(req, res);
  if (!user) return;
  const body = await readBody(req, 2048);
  const target = await targetFromBody(res, body);
  if (!target) return;
  if (target.user_id === user.id) return json(res, 400, { error: "that is your own character" });

  if (action === "/api/block") {
    await auth.store.addBlock(user.id, target.user_id);
    return json(res, 200, { ok: true });
  }
  if (action === "/api/unblock") {
    await auth.store.removeBlock(user.id, target.user_id);
    return json(res, 200, { ok: true });
  }
  // /api/report
  const reason = cleanReason(body.reason);
  if (!reason) return json(res, 400, { error: "reason required" });
  const ok = await auth.store.addReport(user.id, target.id, reason, Date.now());
  json(res, ok ? 200 : 404, ok ? { ok: true } : { error: "not found" });
}

module.exports = { handle, publicProfile, cleanReason, HANDLE_RE, CHAR_ID_RE, json, readBody, signedIn, targetFromBody };
