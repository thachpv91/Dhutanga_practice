// Memory event log, browser side (Sổ Hành Trình, client half).
// Sends discovery, milestone and backfill events of a signed-in character to the server, which checks each one
// against public/event-catalog.js. Guests send nothing: log() is a silent no-op unless an account character is open,
// and guests keep their local diary as before.
window.Journey = (() => {
  const EC = window.EventCatalog;
  const BATCH_MAX = 20;
  const FLUSH_MS = 1500;
  const RETRY_MS = [5000, 15000, 60000];
  const PAGE = 200;
  const MAX_PAGES = 100;
  const LEVEL_RANK = { heard: 1, seen: 2, confirmed: 3 };
  const MARKER = EC.BACKFILL_SUBJECT;

  const queue = [];            // { charId, ev }, oldest first; an event leaves only when the server answered it
  const known = new Set();     // "charId|event_id" enqueued or answered this session
  const warned = new Set();    // reasons already reported on the console
  const doneChars = new Set(); // characters whose legacy backfill is settled this session
  const backfilling = new Map();
  let timer = null;
  let inflight = null;
  let fails = 0;               // failed sends in a row; drives the backoff
  let lv = null;               // levels cache for one character: { charId, map, loaded, loading }

  const warnOnce = (key, msg) => {
    if (warned.has(key)) return;
    warned.add(key);
    console.warn("Journey: " + msg);
  };
  // The character whose events may be recorded right now, or null (guests, no character open).
  function current() {
    try {
      if (!window.Save || !Save.signedIn() || !Save.character()) return null;
      return Save.character();
    } catch { return null; }
  }
  const stillOpen = (charId) => { const c = current(); return !!c && c.id === charId; };
  const lvSet = (map, subject, level) => {
    const cur = map.get(subject);
    if (!cur || LEVEL_RANK[level] > LEVEL_RANK[cur]) map.set(subject, level);
  };

  // ---------- event helpers (same ids as the live hooks, so a later backfill and live events de-duplicate) ----------
  function discovery(id, level) {
    const sourceType = level === "heard" ? "report" : level === "seen" ? "observation" : null;
    return { event_id: `disc:${id}:${level}`, type: "discovery", subject_id: `disc:${id}`, level, source_type: sourceType };
  }
  function milestone(id, atMs) {
    const ev = { event_id: `ms:${id}`, type: "milestone", subject_id: `ms:${id}`, source_type: "observation" };
    if (atMs !== undefined && atMs !== null) ev.client_at = atMs;
    return ev;
  }

  // ---------- queue and sending ----------
  function arm(ms) {
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; flush(false); }, ms);
  }
  const retryDelay = () => RETRY_MS[Math.min(fails, RETRY_MS.length) - 1];
  function schedule() {
    if (inflight) return;                       // the end of the running send re-arms
    if (fails) { if (!timer) arm(retryDelay()); return; }
    arm(queue.length >= BATCH_MAX ? 0 : FLUSH_MS);
  }

  // One POST. Resolves to { status, body } or null when the request never got an answer.
  async function postEvents(charId, events, keepalive) {
    try {
      const r = await fetch(`/api/characters/${encodeURIComponent(charId)}/events`, {
        method: "POST",
        credentials: "same-origin",
        keepalive: !!keepalive,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });
      const body = r.ok ? await r.json().catch(() => ({})) : null;
      return { status: r.status, ok: !!r.ok, body };
    } catch { return null; }
  }

  // Sends the oldest batch of one character. Returns { retry: true } to keep it, or { done: ids } to drop it.
  async function send(charId, events, keepalive) {
    const ids = new Set(events.map((e) => e.event_id));
    const res = await postEvents(charId, events, keepalive);
    if (!res || res.status === 429 || res.status >= 500) return { retry: true };
    if (!res.ok) { warnOnce("status:" + res.status, `batch dropped (HTTP ${res.status})`); return { done: ids }; }
    for (const r of (res.body && res.body.results) || []) {
      if (r.status === "rejected") warnOnce("reason:" + r.reason, `event rejected by server: ${r.reason}`);
    }
    return { done: ids };
  }

  function flush(keepalive) {
    clearTimeout(timer);
    timer = null;
    if (inflight) return inflight;
    if (!queue.length) return Promise.resolve();
    const charId = queue[0].charId;
    const batch = [];
    for (const it of queue) {
      if (it.charId !== charId || batch.length === BATCH_MAX) break;
      batch.push(it);
    }
    inflight = send(charId, batch.map((it) => it.ev), keepalive).then((out) => {
      inflight = null;
      if (out.retry) { fails++; arm(retryDelay()); return; }
      fails = 0;
      for (let i = queue.length - 1; i >= 0; i--) {
        if (queue[i].charId === charId && out.done.has(queue[i].ev.event_id)) queue.splice(i, 1);
      }
      if (queue.length) schedule();
    }).catch(() => { inflight = null; fails++; arm(retryDelay()); });
    return inflight;
  }

  // Queues one event for the open account character. Returns true when it was queued.
  function log(ev) {
    try {
      const c = current();
      if (!c || !ev) return false;
      const check = EC.validate(ev);
      if (!check.ok) { warnOnce("local:" + check.reason, `event not sent, invalid: ${check.reason}`); return false; }
      const key = c.id + "|" + ev.event_id;
      if (known.has(key)) return true;
      known.add(key);
      queue.push({ charId: c.id, ev });
      if (ev.type === "discovery" && lv && lv.charId === c.id) lvSet(lv.map, ev.subject_id, ev.level);
      schedule();
      return true;
    } catch { return false; }
  }

  // ---------- reading ----------
  async function getEvents(charId, opts = {}) {
    try {
      const parts = [];
      if (opts.after !== undefined) parts.push("after=" + encodeURIComponent(opts.after));
      if (opts.limit !== undefined) parts.push("limit=" + encodeURIComponent(opts.limit));
      if (opts.type !== undefined) parts.push("type=" + encodeURIComponent(opts.type));
      const qs = parts.length ? "?" + parts.join("&") : "";
      const r = await fetch(`/api/characters/${encodeURIComponent(charId)}/events${qs}`, { credentials: "same-origin" });
      if (!r.ok) return null;
      const body = await r.json();
      if (!body || !Array.isArray(body.events)) return null;
      return { events: body.events, next: body.next === undefined ? null : body.next };
    } catch { return null; }
  }
  // Reads every page of one type, oldest first. onEvents returns false to stop early. Resolves false when a page fails.
  async function walk(charId, type, onEvents) {
    let after = 0;
    for (let i = 0; i < MAX_PAGES; i++) {
      const page = await getEvents(charId, { after, limit: PAGE, type });
      if (!page) return false;
      if (onEvents(page.events) === false) return true;
      if (!page.events.length || page.next === null) return true;
      after = page.next;
    }
    return true;
  }
  async function list(opts) {
    const c = current();
    if (!c) return null;
    return getEvents(c.id, opts || {});
  }

  // Highest level per subject_id ("disc:<id>") for the open character: heard < seen < confirmed.
  async function levels() {
    try {
      const c = current();
      if (!c) return new Map();
      if (!lv || lv.charId !== c.id) lv = { charId: c.id, map: new Map(), loaded: false, loading: null };
      const cache = lv;
      if (!cache.loaded && !cache.loading) {
        cache.loading = walk(cache.charId, "discovery", (events) => {
          for (const e of events) if (e.level) lvSet(cache.map, e.subject_id, e.level);
        }).then((ok) => { cache.loaded = ok; cache.loading = null; }, () => { cache.loading = null; });
      }
      if (cache.loading) await cache.loading;
      for (const it of queue) {
        if (it.charId === cache.charId && it.ev.type === "discovery") lvSet(cache.map, it.ev.subject_id, it.ev.level);
      }
      return stillOpen(cache.charId) ? new Map(cache.map) : new Map();
    } catch { return new Map(); }
  }

  // ---------- legacy backfill (once per character) ----------
  // Deterministic events for what the old save already shows: Sổ khám phá (seen/heard) and reached milestones.
  // Save.history (free text) is never turned into events.
  function legacyEvents() {
    const out = [];
    if (window.Discover && Discover.entries) {
      for (const e of Discover.entries()) {
        if (e.state === "seen" || e.state === "heard") out.push(discovery(e.id, e.state));
      }
    }
    if (window.Milestones && Milestones.list) {
      for (const m of Milestones.list()) out.push(milestone(m.id, m.at));
    }
    return out;
  }
  async function postAll(charId, events) {
    for (let i = 0; i < events.length; i += BATCH_MAX) {
      const res = await postEvents(charId, events.slice(i, i + BATCH_MAX), false);
      if (!res || !res.ok || !res.body || !Array.isArray(res.body.results)) return false;
    }
    return true;
  }
  async function runBackfill(charId) {
    let marked = false;
    const read = await walk(charId, "action", (events) => {
      if (events.some((e) => e.subject_id === MARKER)) { marked = true; return false; }
      return true;
    });
    if (!read) return false;
    if (marked) return true;
    if (!stillOpen(charId)) return false;
    let events;
    try { events = legacyEvents(); } catch { return false; }
    if (!stillOpen(charId)) return false;
    if (!(await postAll(charId, events))) return false;
    const marker = { event_id: MARKER, type: "action", subject_id: MARKER, source_type: "observation" };
    return postAll(charId, [marker]);
  }
  // Runs once per character. A failure leaves no marker, so the next opening tries again.
  function backfillLegacy() {
    try {
      const c = current();
      if (!c) return Promise.resolve(false);
      const charId = c.id;
      if (doneChars.has(charId)) return Promise.resolve(true);
      if (backfilling.has(charId)) return backfilling.get(charId);
      const p = runBackfill(charId).then((ok) => { if (ok) doneChars.add(charId); return ok; }, () => false)
        .finally(() => backfilling.delete(charId));
      backfilling.set(charId, p);
      return p;
    } catch { return Promise.resolve(false); }
  }

  // Called when a signed-in character is started. Safe to call again: each step runs once per character.
  function onCharacterOpened() {
    try {
      if (!current()) return Promise.resolve(false);
      return backfillLegacy().catch(() => false).then(() => levels()).then(() => true, () => false);
    } catch { return Promise.resolve(false); }
  }

  try {
    window.addEventListener("pagehide", () => { flush(true); });
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(true); });
  } catch {}

  return { log, flush, list, levels, backfillLegacy, onCharacterOpened, discovery, milestone };
})();
