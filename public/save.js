// Where progress is kept.
// Guests: in this browser (localStorage), exactly as before.
// Signed in: account-wide keys (story memory, nights played, roles finished) go to the account;
// per-character keys (mind, cards, items, history) go to the character being played.
window.Save = (() => {
  const ACCOUNT_KEYS = ["dhutanga.memory", "dhutanga.runs", "dhutanga.completed"];
  const CHAR_KEYS = ["dhutanga.mind", "dhutanga.history", "dhutanga.progress", "dhutanga.v"];
  // window.Migrate (public/migrate.js) is optional here: without it, saves are left as they are.
  const migrator = () => (typeof window !== "undefined" && window.Migrate) || null;
  const GUEST_ROLE = "dhutanga.guestRole";
  const GUEST_NICK = "dhutanga.guestNick";
  let me = { user: null, google: false, devLogin: false };
  let acct = {};          // account kv (strings, like localStorage)
  let char = null;        // { id, name, role, kv }

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const signedIn = () => !!me.user;

  async function api(method, url, body, keepalive) {
    const r = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin", keepalive: !!keepalive });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(data.error || "request failed"), { status: r.status });
    return data;
  }

  function accountFromServer(a) {
    acct = {
      "dhutanga.memory": JSON.stringify(Array.isArray(a.memory) ? a.memory : []),
      "dhutanga.runs": String(a.runs || 0),
      "dhutanga.completed": JSON.stringify(a.completed || {}),
    };
  }
  function accountToServer() {
    const parse = (k, d) => { try { return JSON.parse(acct[k] ?? d); } catch { return JSON.parse(d); } };
    return { memory: parse("dhutanga.memory", "[]"), runs: Number(acct["dhutanga.runs"]) || 0, completed: parse("dhutanga.completed", "{}") };
  }
  function charToServer(c = char) {
    const parse = (k, d) => { try { return JSON.parse(c.kv[k] ?? d); } catch { return JSON.parse(d); } };
    const out = { mind: parse("dhutanga.mind", "null"), history: parse("dhutanga.history", "[]") };
    const progress = parse("dhutanga.progress", "null");
    if (progress) out.progress = progress;
    const v = Number(c.kv["dhutanga.v"]);
    if (Number.isInteger(v) && v >= 1) out.v = v;
    return out;
  }

  // ---------- key/value used by the game ----------
  function get(key) {
    if (signedIn() && ACCOUNT_KEYS.includes(key)) return acct[key] ?? null;
    if (signedIn() && CHAR_KEYS.includes(key) && char) return char.kv[key] ?? null;
    return ls.get(key);
  }
  function set(key, value) {
    if (signedIn() && ACCOUNT_KEYS.includes(key)) { acct[key] = value; queueAccount(); return; }
    if (signedIn() && CHAR_KEYS.includes(key) && char) { char.kv[key] = value; queueChar(); return; }
    ls.set(key, value);
  }
  function remove(key) {
    if (signedIn() && ACCOUNT_KEYS.includes(key)) { delete acct[key]; queueAccount(); return; }
    if (signedIn() && CHAR_KEYS.includes(key) && char) { delete char.kv[key]; queueChar(); return; }
    ls.del(key);
  }
  // ---------- sync: every target stays dirty until the server confirms ----------
  const RETRY_MS = [5000, 15000, 60000];
  const retryAfter = (t) => RETRY_MS[Math.min(t.fails - 1, RETRY_MS.length - 1)];
  const targets = new Set();       // targets with unsent data (the account, plus any character being played or just left)
  const statusSubs = [];
  let lastStatus = "saved";

  // send(keepalive) -> Promise; valid() -> false drops the pending data (e.g. after logout)
  function makeTarget(delay, send, valid) {
    return { delay, send, valid, dirty: false, ver: 0, inflight: null, fails: 0, timer: null };
  }
  function status() {
    if (!signedIn()) return "saved";
    let offline = false;
    for (const t of targets) {
      if (!t.dirty) continue;
      if (t.inflight || !t.fails) return "saving";
      offline = true;
    }
    return offline ? "offline" : "saved";
  }
  function notify() {
    const s = status();
    if (s === lastStatus) return;
    lastStatus = s;
    statusSubs.forEach((cb) => { try { cb(s); } catch {} });
  }
  function mark(t) {
    t.dirty = true; t.ver++; targets.add(t);
    clearTimeout(t.timer);
    if (!t.inflight) t.timer = setTimeout(() => push(t), t.fails ? retryAfter(t) : t.delay);
    notify();
  }
  function push(t, keepalive) {
    clearTimeout(t.timer); t.timer = null;
    if (!t.dirty) return Promise.resolve();
    if (!t.valid()) { t.dirty = false; targets.delete(t); notify(); return Promise.resolve(); }
    if (t.inflight) return t.inflight; // at most one request per target; the follow-up goes out when it ends
    const sent = t.ver;
    t.inflight = t.send(keepalive).then(() => {
      t.inflight = null; t.fails = 0;
      if (t.ver === sent) { t.dirty = false; targets.delete(t); }
      else return push(t);
    }, (e) => {
      console.warn("save failed:", e.message);
      t.inflight = null; t.fails++;
      t.timer = setTimeout(() => push(t), retryAfter(t));
    }).then(notify);
    notify();
    return t.inflight;
  }

  const acctTarget = makeTarget(1200, (ka) => api("PUT", "/api/account", accountToServer(), ka), signedIn);
  const charTarget = (c) => makeTarget(1500, (ka) => api("PUT", "/api/characters/" + c.id, { data: charToServer(c) }, ka), signedIn);
  const queueAccount = () => mark(acctTarget);
  const queueChar = () => { if (char) mark(char.sync || (char.sync = charTarget(char))); };
  const pushAccount = (ka) => push(acctTarget, ka);
  const flush = (keepalive) => Promise.all([...targets].map((t) => push(t, keepalive)));
  window.addEventListener("online", () => targets.forEach((t) => { if (t.dirty && !t.inflight) push(t); }));
  window.addEventListener("pagehide", () => flush(true));
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(true); });

  // A short diary for the character: cards found, gifts, visitors, nights finished.
  function log(text) {
    let list = [];
    try { list = JSON.parse(get("dhutanga.history") || "[]"); } catch {}
    list.push({ at: Date.now(), text });
    set("dhutanga.history", JSON.stringify(list.slice(-200)));
  }
  function history() { try { return JSON.parse(get("dhutanga.history") || "[]"); } catch { return []; } }

  // ---------- account & characters ----------
  async function refresh() {
    try { me = await api("GET", "/api/me"); } catch { me = { user: null, google: false, devLogin: false }; }
    if (me.user) accountFromServer(me.account || {});
    return me;
  }
  function kvFromData(data) {
    const kv = {};
    if (data && data.mind) kv["dhutanga.mind"] = JSON.stringify(data.mind);
    if (data && data.history) kv["dhutanga.history"] = JSON.stringify(data.history);
    if (data && data.progress) kv["dhutanga.progress"] = JSON.stringify(data.progress);
    if (data && Number.isInteger(data.v)) kv["dhutanga.v"] = String(data.v);
    return kv;
  }
  // Bring a character's kv up to the current version. A save newer than this client is left alone and never saved over.
  function upgradeChar(c) {
    const M = migrator();
    if (!M) return;
    const r = M.upgrade(c.kv);
    if (r.future || !r.changed) return;
    c.kv = r.kv;
    if (char === c) queueChar();
  }
  async function openCharacter(id) {
    await flush();
    const { character } = await api("GET", "/api/characters/" + id);
    char = { id: character.id, name: character.name, role: character.role, kv: kvFromData(character.data) };
    upgradeChar(char);
    return char;
  }
  async function createCharacter(name, role, data) {
    const M = migrator();
    const payload = { ...(data || {}) };
    if (M) payload.v = M.CURRENT;
    const { character } = await api("POST", "/api/characters", { name, role, data: payload });
    char = { id: character.id, name: character.name, role: character.role, kv: kvFromData(character.data) };
    me.characters = [{ id: char.id, name: char.name, role: char.role, cards: 0, items: 0, hideProfile: false, hideStatus: false, updatedAt: new Date().toISOString() }, ...(me.characters || [])];
    return char;
  }
  async function renameCharacter(id, name) {
    const { character } = await api("PATCH", "/api/characters/" + id, { name });
    (me.characters || []).forEach((c) => { if (c.id === id) c.name = character.name; });
    if (char && char.id === id) char.name = character.name;
    return character.name;
  }
  // Privacy switches for one character ({hideProfile?, hideStatus?}); the summary in the list follows the server's answer.
  async function setFlags(id, flags) {
    await api("PATCH", "/api/characters/" + id + "/flags", flags);
    (me.characters || []).forEach((c) => { if (c.id === id) Object.assign(c, flags); });
    return flags;
  }
  async function deleteCharacter(id) {
    await api("DELETE", "/api/characters/" + id);
    if (char && char.id === id) char = null;
    me.characters = (me.characters || []).filter((c) => c.id !== id);
  }
  async function closeCharacter() { await flush(); char = null; }

  // What a guest played on this device, if anything worth saving.
  function guestProgress() {
    let mind = null, history = [];
    try { mind = JSON.parse(ls.get("dhutanga.mind") || "null"); } catch {}
    try { history = JSON.parse(ls.get("dhutanga.history") || "[]"); } catch {}
    let memory = [];
    try { memory = JSON.parse(ls.get("dhutanga.memory") || "[]"); } catch {}
    let progress = null;
    try { progress = JSON.parse(ls.get("dhutanga.progress") || "null"); } catch {}
    const runs = Number(ls.get("dhutanga.runs")) || 0;
    const hasMind = mind && (Object.keys(mind.cards || {}).length || (mind.items || []).length || mind.carita);
    if (!hasMind && !memory.length && !runs && !progress) return null;
    return { mind, history, progress, memory, runs, role: ls.get(GUEST_ROLE) || "villager", nick: ls.get(GUEST_NICK) || "", cards: Object.keys((mind && mind.cards) || {}).length, items: ((mind && mind.items) || []).length };
  }
  // Move guest progress into a new character, merge story memory into the account, then clear the device copy.
  async function importGuest(name) {
    const g = guestProgress();
    if (!g) return null;
    const c = await createCharacter(name || g.nick || "Nhân vật đầu tiên", g.role, { mind: g.mind, progress: g.progress, history: [...g.history, { at: Date.now(), text: "Chuyển từ lần chơi thử vào tài khoản." }] });
    const a = accountToServer();
    let completed = {};
    try { completed = JSON.parse(ls.get("dhutanga.completed") || "{}"); } catch {}
    accountFromServer({ memory: [...new Set([...a.memory, ...g.memory])], runs: Math.max(a.runs, g.runs), completed: { ...a.completed, ...completed } });
    queueAccount();
    await pushAccount();
    ["dhutanga.mind", "dhutanga.history", "dhutanga.progress", "dhutanga.v", "dhutanga.memory", "dhutanga.runs", "dhutanga.completed", GUEST_ROLE, GUEST_NICK].forEach(ls.del);
    char = null;
    return c;
  }

  // Version of the character being played (a number), or null when no character is open.
  function version() {
    if (!char) return null;
    const M = migrator();
    return M ? M.version(char.kv) : 1;
  }
  // Guests: stamp the device copy of the character keys to the current version. Only runs when there is something to stamp.
  // Not called for signed-in users. Returns the upgrade result, or null when nothing was done.
  function upgradeGuest() {
    const M = migrator();
    if (!M || signedIn()) return null;
    const kv = {};
    CHAR_KEYS.forEach((k) => { const val = ls.get(k); if (val !== null) kv[k] = val; });
    if (!kv["dhutanga.mind"] && !kv["dhutanga.history"] && !kv["dhutanga.progress"]) return null;
    const r = M.upgrade(kv);
    if (r.future || !r.changed) return r;
    ls.set("dhutanga.v", r.kv["dhutanga.v"]);
    return r;
  }

  async function devLogin(name) { await api("POST", "/auth/dev", { name }); return refresh(); }
  async function logout() { await flush(); await api("POST", "/auth/logout", {}); char = null; acct = {}; targets.clear(); notify(); return refresh(); }

  return {
    get, set, remove, flush, log, history, status, onStatus: (cb) => { statusSubs.push(cb); },
    refresh, me: () => me, signedIn, character: () => char,
    openCharacter, createCharacter, deleteCharacter, renameCharacter, setFlags, closeCharacter,
    guestProgress, importGuest, devLogin, logout, version, upgradeGuest,
    setGuestRole: (r, nick) => { ls.set(GUEST_ROLE, r); if (nick) ls.set(GUEST_NICK, nick); },
  };
})();
