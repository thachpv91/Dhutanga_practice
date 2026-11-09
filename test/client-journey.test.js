const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const CHAR = { id: "c1", name: "A", role: "monk", data: { progress: { v: 1, runId: "r1", role: "monk", sceneId: "a1", meter: 6 }, mind: { cards: {} } } };
const DISCOVER_IDS = [
  "cho", "su_gia", "chu_thien", "tho_than", "be_na", "ba_ngoai",
  "dia_than", "hang", "day_hang", "ao_trang", "thien_cung", "xe_ngua",
];
const MILESTONE_IDS = [
  "first_card", "first_bad", "first_good", "understood_san", "understood_hoi_han", "understood_tham", "understood_bon_xen",
  "night_1", "night_7", "night_30", "night_100", "first_dedicate", "first_deva", "cave_found",
  "promise_kept", "want_more", "palace_stay",
];

// A signed-in session with CHAR open (signed = false: a guest). route(call) answers any other request.
async function session({ signed = true, route } = {}) {
  const sb = makeSandbox();
  sb.__route = async (c) => {
    if (c.url === "/api/me") return { status: 200, body: signed ? { user: { name: "u" }, account: {} } : { user: null } };
    if (c.url === "/api/characters/c1" && c.method === "GET") return { status: 200, body: { character: CHAR } };
    return route ? route(c) : { status: 200, body: {} };
  };
  load(sb, "event-catalog.js");
  load(sb, "save.js");
  load(sb, "journey.js");
  await sb.Save.refresh();
  if (signed) await sb.Save.openCharacter("c1");
  sb.calls.length = 0;
  return sb;
}
// Answers every POST as created (or duplicate for ids listed in dup).
const created = (dup = []) => (c) => {
  if (c.method !== "POST") return { status: 200, body: {} };
  return { status: 200, body: { results: c.body.events.map((e) => ({ event_id: e.event_id, status: dup.includes(e.event_id) ? "duplicate" : "created" })) } };
};
const posts = (sb) => sb.calls.filter((c) => c.method === "POST");
const sentEvents = (sb) => posts(sb).flatMap((p) => p.body.events);

// ---------- guest and gating ----------

test("guest: no calls from log, milestone hooks, or onCharacterOpened", async () => {
  const sb = await session({ signed: false });
  assert.equal(sb.Journey.log(sb.Journey.discovery("cho", "seen")), false);
  load(sb, "milestones.js");
  sb.Milestones.notify("card", { id: "san", good: false, understood: false }, { quiet: true });
  await sb.Journey.onCharacterOpened();
  await sb.advance(60000);
  assert.equal(sb.calls.length, 0);
});

// ---------- queue, batching, debounce ----------

test("one event waits about 1.5 s, then goes out with the exact discovery shape", async () => {
  const sb = await session({ route: created() });
  assert.equal(sb.Journey.log(sb.Journey.discovery("cho", "heard")), true);
  await sb.advance(1400);
  assert.equal(posts(sb).length, 0);
  await sb.advance(200);
  assert.equal(posts(sb).length, 1);
  assert.equal(posts(sb)[0].url, "/api/characters/c1/events");
  assert.equal(posts(sb)[0].keepalive, false);
  assert.deepEqual(posts(sb)[0].body.events[0], {
    event_id: "disc:cho:heard", type: "discovery", subject_id: "disc:cho", level: "heard", source_type: "report",
  });
});

test("batches never exceed 20 events", async () => {
  const sb = await session({ route: created() });
  for (let i = 0; i < 45; i++) sb.Journey.log(sb.Journey.milestone("m" + i));
  await sb.advance(2000);
  assert.deepEqual(posts(sb).map((p) => p.body.events.length), [20, 20, 5]);
  assert.equal(new Set(sentEvents(sb).map((e) => e.event_id)).size, 45);
});

test("same event_id in one session is queued once", async () => {
  const sb = await session({ route: created() });
  sb.Journey.log(sb.Journey.discovery("hang", "seen"));
  sb.Journey.log(sb.Journey.discovery("hang", "seen"));
  await sb.advance(2000);
  assert.equal(sentEvents(sb).length, 1);
  sb.Journey.log(sb.Journey.discovery("hang", "seen"));
  await sb.advance(2000);
  assert.equal(sentEvents(sb).length, 1, "answered ids are not sent again");
});

test("the same event_id for another character is sent to that character", async () => {
  const sb = await session({ route: created() });
  const prev = sb.__route;
  sb.__route = async (c) => (c.url === "/api/characters/c2" && c.method === "GET"
    ? { status: 200, body: { character: { id: "c2", name: "B", role: "monk", data: {} } } }
    : prev(c));
  sb.Journey.log(sb.Journey.discovery("hang", "seen"));
  await sb.advance(2000);
  await sb.Save.openCharacter("c2");
  sb.calls.length = 0;
  assert.equal(sb.Journey.log(sb.Journey.discovery("hang", "seen")), true);
  await sb.advance(2000);
  assert.equal(posts(sb).length, 1);
  assert.equal(posts(sb)[0].url, "/api/characters/c2/events");
});

// ---------- server answers ----------

test("duplicate counts as done; rejected is dropped with one warning; neither is resent", async () => {
  const sb = await session({ route: created(["disc:cho:seen"]) });
  const warn = console.warn;
  const msgs = [];
  console.warn = (...a) => msgs.push(a.join(" "));
  try {
    sb.Journey.log(sb.Journey.discovery("cho", "seen"));
    sb.Journey.log(sb.Journey.discovery("su_gia", "seen"));
    sb.Journey.log(sb.Journey.milestone("first_card"));
    await sb.advance(2000);
    assert.equal(sentEvents(sb).length, 3);
    // rejected case: the server refuses a milestone id it does not know
    sb.__route = async (c) => (c.method === "POST"
      ? { status: 200, body: { results: c.body.events.map((e) => ({ event_id: e.event_id, status: "rejected", reason: "not in catalog" })) } }
      : { status: 200, body: {} });
    sb.calls.length = 0;
    sb.Journey.log(sb.Journey.milestone("zz_unknown"));
    sb.Journey.log(sb.Journey.milestone("zz_other"));
    await sb.advance(2000);
    assert.equal(posts(sb).length, 1);
    assert.equal(msgs.filter((m) => m.includes("not in catalog")).length, 1, "one warning per reason");
    await sb.advance(120000);
    assert.equal(posts(sb).length, 1, "rejected events are not retried");
  } finally {
    console.warn = warn;
  }
});

test("403 (archived) drops the batch without retry", async () => {
  const sb = await session({ route: (c) => (c.method === "POST" ? { status: 403, body: {} } : { status: 200, body: {} }) });
  const warn = console.warn;
  console.warn = () => {};
  try {
    sb.Journey.log(sb.Journey.milestone("first_card"));
    await sb.advance(2000);
    await sb.advance(120000);
    assert.equal(posts(sb).length, 1);
  } finally { console.warn = warn; }
});

test("429 and 5xx keep the batch and retry with backoff 5 s, 15 s, 60 s", async () => {
  const script = [429, 500, 200];
  const sb = await session({
    route: (c) => {
      if (c.method !== "POST") return { status: 200, body: {} };
      const status = script.length > 1 ? script.shift() : script[0];
      if (status !== 200) return { status, body: {} };
      return { status: 200, body: { results: c.body.events.map((e) => ({ event_id: e.event_id, status: "created" })) } };
    },
  });
  const warn = console.warn;
  console.warn = () => {};
  try {
    sb.Journey.log(sb.Journey.discovery("cho", "seen"));
    await sb.advance(1500);
    assert.equal(posts(sb).length, 1);
    await sb.advance(4900);          // t = 6400
    assert.equal(posts(sb).length, 1);
    await sb.advance(100);           // t = 6500: first retry, same batch
    assert.equal(posts(sb).length, 2);
    assert.deepEqual(posts(sb)[1].body.events.map((e) => e.event_id), ["disc:cho:seen"]);
    await sb.advance(14900);         // t = 21400
    assert.equal(posts(sb).length, 2);
    await sb.advance(100);           // t = 21500: second retry succeeds
    assert.equal(posts(sb).length, 3);
    await sb.advance(120000);
    assert.equal(posts(sb).length, 3, "nothing left to send");
  } finally { console.warn = warn; }
});

test("a network error keeps the batch for a retry", async () => {
  let fail = true;
  const sb = await session({
    route: (c) => {
      if (c.method !== "POST") return { status: 200, body: {} };
      if (fail) throw new Error("offline");
      return { status: 200, body: { results: c.body.events.map((e) => ({ event_id: e.event_id, status: "created" })) } };
    },
  });
  sb.Journey.log(sb.Journey.milestone("first_card"));
  await sb.advance(1500);
  fail = false;
  await sb.advance(5000);
  assert.equal(sentEvents(sb).length, 2);
});

test("pagehide flushes with keepalive", async () => {
  const sb = await session({ route: created() });
  sb.Journey.log(sb.Journey.milestone("first_card"));
  sb.fire("pagehide");
  await sb.advance(0);
  assert.equal(posts(sb).length, 1);
  assert.equal(posts(sb)[0].keepalive, true);
});

// ---------- event helpers and catalog ----------

test("every helper output validates against the catalog, and invalid levels do not", () => {
  const sb = makeSandbox();
  load(sb, "event-catalog.js");
  load(sb, "save.js");
  load(sb, "journey.js");
  const J = sb.Journey, EC = sb.EventCatalog;
  for (const id of DISCOVER_IDS) {
    for (const level of ["heard", "seen"]) {
      const ev = J.discovery(id, level);
      assert.equal(EC.validate(ev).ok, true, `${id} ${level}`);
    }
    assert.equal(EC.validate(J.discovery(id, "confirmed")).ok, false);
  }
  for (const id of MILESTONE_IDS) {
    assert.equal(EC.validate(J.milestone(id)).ok, true, id);
    assert.equal(EC.validate(J.milestone(id, 1700000000000)).ok, true, id + " with client_at");
  }
  assert.equal(J.milestone("first_card", 1700000000000).client_at, 1700000000000);
  assert.equal("client_at" in J.milestone("first_card"), false);
});

// ---------- levels projection ----------

test("levels() keeps the highest level per subject and includes later logs", async () => {
  const sb = await session({
    route: (c) => {
      if (c.method === "GET" && c.url.includes("type=discovery")) {
        return c.url.includes("after=0")
          ? { status: 200, body: { events: [
              { seq: 1, subject_id: "disc:cho", level: "heard" },
              { seq: 2, subject_id: "disc:cho", level: "seen" },
              { seq: 3, subject_id: "disc:hang", level: "heard" },
            ], next: 3 } }
          : { status: 200, body: { events: [], next: null } };
      }
      return { status: 200, body: {} };
    },
  });
  const m = await sb.Journey.levels();
  assert.deepEqual(Object.fromEntries(m), { "disc:cho": "seen", "disc:hang": "heard" });
  sb.Journey.log(sb.Journey.discovery("hang", "seen"));
  const m2 = await sb.Journey.levels();
  assert.equal(m2.get("disc:hang"), "seen");
  // heard never lowers a level
  sb.Journey.log(sb.Journey.discovery("cho", "heard"));
  assert.equal((await sb.Journey.levels()).get("disc:cho"), "seen");
});

// ---------- legacy backfill ----------

async function backfillSession(opts = {}) {
  const state = { marker: !!opts.marker, postFail: !!opts.postFail, actionReads: 0 };
  const sb = await session({
    route: (c) => {
      if (c.method === "GET" && c.url.includes("type=action")) {
        state.actionReads++;
        return { status: 200, body: { events: state.marker ? [{ seq: 1, subject_id: "meta:backfilled", type: "action" }] : [], next: state.marker ? 1 : null } };
      }
      if (c.method === "POST") {
        if (state.postFail) return { status: 500, body: {} };
        return { status: 200, body: { results: c.body.events.map((e) => ({ event_id: e.event_id, status: "created" })) } };
      }
      return { status: 200, body: {} };
    },
  });
  sb.Discover = { entries: () => [
    { id: "cho", state: "seen" },
    { id: "hang", state: "heard" },
    { id: "be_na", state: "unknown" },
  ] };
  sb.Milestones = { list: () => [{ id: "first_card", at: 1700000000000 }] };
  return { sb, state };
}

test("backfill: marker present -> no POST", async () => {
  const { sb, state } = await backfillSession({ marker: true });
  assert.equal(await sb.Journey.backfillLegacy(), true);
  assert.equal(state.actionReads, 1);
  assert.equal(posts(sb).length, 0);
});

test("backfill: marker absent -> legacy events first, then the marker", async () => {
  const { sb } = await backfillSession({ marker: false });
  assert.equal(await sb.Journey.backfillLegacy(), true);
  const bodies = posts(sb).map((p) => p.body.events);
  assert.equal(bodies.length, 2);
  assert.deepEqual(bodies[0].map((e) => e.event_id), ["disc:cho:seen", "disc:hang:heard", "ms:first_card"]);
  assert.equal(bodies[0][2].client_at, 1700000000000);
  assert.deepEqual(bodies[1], [{ event_id: "meta:backfilled", type: "action", subject_id: "meta:backfilled", source_type: "observation" }]);
  // runs once per character: a second call sends nothing
  assert.equal(await sb.Journey.backfillLegacy(), true);
  assert.equal(posts(sb).length, 2);
});

test("backfill: a failed write leaves no marker, so the next opening retries", async () => {
  const { sb, state } = await backfillSession({ marker: false, postFail: true });
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.equal(await sb.Journey.backfillLegacy(), false);
    const markers = () => posts(sb).filter((p) => p.body.events.some((e) => e.event_id === "meta:backfilled")).length;
    assert.equal(markers(), 0);
    state.postFail = false;
    assert.equal(await sb.Journey.backfillLegacy(), true);
    assert.equal(markers(), 1);
  } finally { console.warn = warn; }
});

test("backfill never reads Save.history or the history key", async () => {
  const { sb } = await backfillSession({ marker: false });
  let touched = false;
  const history = sb.Save.history, get = sb.Save.get;
  sb.Save.history = (...a) => { touched = true; return history(...a); };
  sb.Save.get = (k, ...a) => { if (String(k).includes("history")) touched = true; return get(k, ...a); };
  await sb.Journey.backfillLegacy();
  assert.equal(touched, false);
});

test("onCharacterOpened primes the levels after backfill", async () => {
  const seen = [];
  const { sb } = await backfillSession({ marker: false });
  const route = sb.__route;
  sb.__route = async (c) => {
    if (c.method === "GET" && c.url.includes("type=discovery")) seen.push(c.url);
    return route(c);
  };
  await sb.Journey.onCharacterOpened();
  assert.equal(seen.length, 1);
});

// ---------- hooks produce events the catalog accepts ----------

test("every Milestones hook yields an event the server catalog accepts", async () => {
  const sb = await session({ route: created() });
  load(sb, "milestones.js");
  const M = sb.Milestones, q = { quiet: true };
  M.notify("card", { id: "san", good: false, understood: false }, q);
  M.notify("card", { id: "tham", good: false, understood: true }, q);
  M.notify("card", { id: "niem", good: true }, q);
  for (let i = 0; i < 100; i++) M.notify("night", {}, q);
  for (let i = 0; i < 3; i++) M.notify("newnight", {}, q);
  M.notify("promise", {}, q);
  M.notify("dedicate", {}, q);
  M.notify("deva", {}, q);
  M.notify("cave", {}, q);
  M.notify("palace", { outcome: "stay" }, q);
  await sb.advance(5000);
  const sent = sentEvents(sb);
  const subjects = sent.map((e) => e.subject_id).sort();
  for (const e of sent) assert.equal(sb.EventCatalog.validate(e).ok, true, e.event_id);
  for (const id of ["first_card", "first_bad", "first_good", "understood_tham", "night_1", "night_7", "night_30", "night_100",
    "want_more", "promise_kept", "first_dedicate", "first_deva", "cave_found", "palace_stay"]) {
    assert.ok(subjects.includes("ms:" + id), id);
  }
  assert.ok(sent.every((e) => e.client_at === undefined || Number.isSafeInteger(e.client_at)));
});

test("every Discover hook yields an event the server catalog accepts", async () => {
  const sb = await session({ route: created() });
  const tick = { fn: null };
  sb.setInterval = (fn) => { tick.fn = fn; return 1; };
  sb.Mind = {
    register() {},
    kit: {
      S: { quest: { bites: 0, step: "none" }, items: [], deva: { seen: 0 }, q: {} },
      save() {}, api: () => null, role: () => "monk", darkness: () => 0, mood: () => 0.5,
    },
  };
  sb.World = { PLACES: {}, getPlayer: () => ({ x: 0, y: 0 }) };
  load(sb, "encounters.js");
  const D = sb.Discover, K = sb.Mind.kit;
  // rumour() marks each entry heard once: 12 calls cover all 12 entries
  for (let i = 0; i < DISCOVER_IDS.length; i++) assert.ok(D.rumour());
  assert.equal(D.rumour(), null);
  // seen through entries(): the cho entry (its condition is set)
  K.S.quest.bites = 1;
  D.entries();
  // seen through the periodic track() tick: the cave hang, then the su_gia entry
  K.S.q.cave = { found: true };
  tick.fn();
  K.S.quest.step = "sit";
  tick.fn();
  await sb.advance(5000);
  const sent = sentEvents(sb);
  const ids = new Set(sent.map((e) => e.event_id));
  for (const id of DISCOVER_IDS) assert.ok(ids.has(`disc:${id}:heard`), id + " heard");
  for (const id of ["cho", "hang", "su_gia"]) assert.ok(ids.has(`disc:${id}:seen`), id + " seen");
  for (const e of sent) assert.equal(sb.EventCatalog.validate(e).ok, true, e.event_id);
});
