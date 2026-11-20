// Memory event log API (Sổ Hành Trình): the owner posts events and reads them back.
// Only the owner ever reads these; no public route, profile or connection list includes them.
// Responses carry event ids and seq only. Internal character and user ids never appear in a response.
// The client sends what happened; the server checks it against the catalog (public/event-catalog.js)
// and sets the time itself. Titles are never sent from the server: the client shows them from the catalog.
const auth = require("./auth");
const social = require("./social");
const EC = require("./public/event-catalog");
const { isArchived, EVENT_LIST_MAX } = require("./store");

const CHAR_ID_RE = /^[\w-]{8,64}$/;
const BATCH_MAX = 20; // events per POST
const EVENTS_PER_MINUTE = 60; // per character, counted in events (a rejected event counts too)
const BODY_MAX = 64 * 1024; // 20 events of at most ~2 KB payload each, plus fields
const LIST_LIMIT_DEFAULT = 100;

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

// ---------- pure functions (unit tested without HTTP) ----------

// Owner check and archive check for one character row (null when not the owner). Returns null when allowed,
// else { status, error }. The row comes from store.getCharacter(user.id, id), which is owner-scoped.
function accessDecision(char, { write }) {
  if (!char) return { status: 404, error: "not found" };
  if (write && isArchived(char)) return { status: 403, error: "story is complete: read only" };
  return null;
}

// Body of a POST: { events: [1..20 objects] }. Returns { ok: true, events } or { ok: false, error }.
function parseBatch(body) {
  if (!isPlainObject(body)) return { ok: false, error: "bad body" };
  const list = body.events;
  if (!Array.isArray(list) || list.length < 1 || list.length > BATCH_MAX) return { ok: false, error: "events must be 1 to 20" };
  if (!list.every(isPlainObject)) return { ok: false, error: "bad event" };
  return { ok: true, events: list };
}

// Only the fields the catalog knows are copied. Anything else the client sent (for example `at`) is dropped.
function pickFields(raw) {
  const out = {};
  for (const k of EC.FIELDS) if (Object.prototype.hasOwnProperty.call(raw, k)) out[k] = raw[k];
  return out;
}

// Splits a batch into rejected events (answered at once) and events to store.
// Returns { items } in input order: { event_id, status: "rejected", reason } or { event_id, event } to be stored.
function prepareBatch(list) {
  return list.map((raw) => {
    const picked = pickFields(raw);
    const eventId = typeof picked.event_id === "string" && EC.EVENT_ID_RE.test(picked.event_id) ? picked.event_id : null;
    const check = EC.validate(picked);
    if (!check.ok) return { event_id: eventId, status: "rejected", reason: check.reason };
    return { event_id: eventId, event: EC.normalize(picked) };
  });
}

// Events to hand to the store, in order.
function toStore(items) {
  return items.filter((it) => it.event).map((it) => it.event);
}

// Final response: rejected items as they are, stored items take the store's status in the same order.
function buildResults(items, storeResults) {
  let i = 0;
  const results = items.map((it) => {
    if (it.event) {
      const r = storeResults[i++] || {};
      return { event_id: it.event_id, status: r.status === "duplicate" ? "duplicate" : "created" };
    }
    return { event_id: it.event_id, status: "rejected", reason: it.reason };
  });
  return { results };
}

// Fixed-window per-character limit in events. take() returns false (429) without recording when over.
function createRateLimiter({ limit = EVENTS_PER_MINUTE, windowMs = 60000 } = {}) {
  const hits = new Map(); // key -> [[at, n], ...]
  return {
    take(key, n, now = Date.now()) {
      const recent = (hits.get(key) || []).filter(([t]) => now - t < windowMs);
      const used = recent.reduce((sum, [, c]) => sum + c, 0);
      if (n < 1 || used + n > limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push([now, n]);
      hits.set(key, recent);
      if (hits.size > 5000) {
        for (const [k, arr] of hits) if (!arr.some(([t]) => now - t < windowMs)) hits.delete(k);
      }
      return true;
    },
  };
}

// GET query: after (digits, default 0), limit (1..200, default 100), type (a catalog type, optional).
function parseListQuery(params) {
  const afterRaw = params.get("after");
  const limitRaw = params.get("limit");
  const typeRaw = params.get("type");
  let after = 0;
  if (afterRaw !== null) {
    if (!/^\d{1,15}$/.test(afterRaw)) return { ok: false, error: "bad after" };
    after = Number(afterRaw);
  }
  let limit = LIST_LIMIT_DEFAULT;
  if (limitRaw !== null) {
    if (!/^\d{1,4}$/.test(limitRaw) || Number(limitRaw) < 1) return { ok: false, error: "bad limit" };
    limit = Math.min(Number(limitRaw), EVENT_LIST_MAX);
  }
  let type;
  if (typeRaw !== null) {
    if (!EC.TYPES.includes(typeRaw)) return { ok: false, error: "bad type" };
    type = typeRaw;
  }
  return { ok: true, query: { after, limit, type } };
}

// ---------- HTTP ----------
const limiter = createRateLimiter();

async function postRoute(req, res, charId) {
  const user = await social.signedIn(req, res);
  if (!user) return;
  const store = auth.store;
  const char = await store.getCharacter(user.id, charId);
  const denied = accessDecision(char, { write: true });
  if (denied) return social.json(res, denied.status, { error: denied.error });
  const body = await social.readBody(req, BODY_MAX);
  const batch = parseBatch(body);
  if (!batch.ok) return social.json(res, 400, { error: batch.error });
  if (!limiter.take(char.id, batch.events.length, Date.now())) {
    return social.json(res, 429, { error: "too many events, slow down" });
  }
  const items = prepareBatch(batch.events);
  const storable = toStore(items);
  let storeResults = [];
  if (storable.length) {
    try {
      storeResults = await store.addEvents(char.id, storable, Date.now());
    } catch (err) {
      if (err.storeCode === "ARCHIVED") return social.json(res, 403, { error: "story is complete: read only" });
      if (err.storeCode === "NOT_FOUND") return social.json(res, 404, { error: "not found" });
      throw err;
    }
  }
  social.json(res, 200, buildResults(items, storeResults));
}

async function getRoute(req, res, charId, url) {
  const user = await social.signedIn(req, res);
  if (!user) return;
  const char = await auth.store.getCharacter(user.id, charId);
  const denied = accessDecision(char, { write: false }); // archived characters stay readable
  if (denied) return social.json(res, denied.status, { error: denied.error });
  const parsed = parseListQuery(url.searchParams);
  if (!parsed.ok) return social.json(res, 400, { error: parsed.error });
  const events = await auth.store.listEvents(char.id, parsed.query);
  const next = events.length ? events[events.length - 1].seq : null;
  social.json(res, 200, { events, next });
}

// Returns true when the request was handled.
async function handle(req, res, url) {
  const m = url.pathname.match(/^\/api\/characters\/([\w-]{8,64})\/events$/);
  if (!m) return false;
  try {
    if (req.method === "POST") await postRoute(req, res, m[1]);
    else if (req.method === "GET") await getRoute(req, res, m[1], url);
    else social.json(res, 405, { error: "method not allowed" });
    return true;
  } catch (err) {
    if (err.client) social.json(res, 400, { error: err.message });
    else { console.error("events api failed:", err.message); social.json(res, 500, { error: "server error" }); }
    return true;
  }
}

module.exports = {
  handle,
  accessDecision, parseBatch, pickFields, prepareBatch, toStore, buildResults, createRateLimiter, parseListQuery,
  BATCH_MAX, EVENTS_PER_MINUTE,
};
