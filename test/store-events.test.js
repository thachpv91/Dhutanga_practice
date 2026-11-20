const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createStore, MAX_EVENTS } = require("../store");

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "events-"));
  const accountsFile = path.join(dir, "accounts.json");
  const s = createStore({ accountsFile, tracesFile: path.join(dir, "traces.json") });
  return { s, accountsFile };
}
const person = (s, name) => s.upsertUser("sub:" + name, { name });
const char = (s, user, name) => s.createCharacter(user.id, name, "monk", {});
// A normalized event, as the route hands it to the store.
const ev = (id, extra = {}) => ({
  event_id: id, type: "discovery", subject_id: "disc:cho", level: "seen", source_type: "observation",
  source_actor_id: null, place_id: null, story_id: null, payload: {}, client_at: null, save_version: null, ...extra,
});
const action = (id) => ev(id, { type: "action", subject_id: "walk:gate" });

test("addEvents: created, then duplicate on the same event_id (idempotent)", async () => {
  const { s } = setup();
  const u = await person(s, "a");
  const c = await char(s, u, "C");
  assert.deepStrictEqual(await s.addEvents(c.id, [ev("ev.one"), ev("ev.two")], 1000), [
    { event_id: "ev.one", status: "created" }, { event_id: "ev.two", status: "created" },
  ]);
  assert.deepStrictEqual(await s.addEvents(c.id, [ev("ev.one")], 2000), [{ event_id: "ev.one", status: "duplicate" }]);
  const all = await s.listEvents(c.id, { limit: 200 });
  assert.equal(all.length, 2, "duplicate did not add a row");
  assert.equal(all[0].at, 1000, "first write keeps its time");
});

test("addEvents: the same event_id on two characters is two separate events", async () => {
  const { s } = setup();
  const u = await person(s, "a");
  const c1 = await char(s, u, "C1");
  const c2 = await char(s, u, "C2");
  assert.equal((await s.addEvents(c1.id, [ev("ev.same")], 1))[0].status, "created");
  assert.equal((await s.addEvents(c2.id, [ev("ev.same")], 1))[0].status, "created");
  assert.equal((await s.listEvents(c1.id)).length, 1);
  assert.equal((await s.listEvents(c2.id)).length, 1);
});

test("addEvents: refuses unknown and archived characters at the data layer", async () => {
  const { s } = setup();
  const u = await person(s, "a");
  const c = await char(s, u, "C");
  await assert.rejects(s.addEvents("missing-char-id", [ev("ev.x")], 1), (e) => e.storeCode === "NOT_FOUND");
  await s.setCharacterStatus(u.id, c.id, "story_completed");
  await assert.rejects(s.addEvents(c.id, [ev("ev.y")], 1), (e) => e.storeCode === "ARCHIVED");
  assert.equal((await s.listEvents(c.id)).length, 0, "nothing written");
});

test("listEvents: ascending seq, paging with after, limit clamp, type filter", async () => {
  const { s } = setup();
  const u = await person(s, "a");
  const c = await char(s, u, "C");
  const batch = [];
  for (let i = 0; i < 5; i++) batch.push(ev("ev.d" + i));
  batch.push(action("ev.a1"));
  await s.addEvents(c.id, batch, 1);

  const page1 = await s.listEvents(c.id, { limit: 2 });
  assert.deepStrictEqual(page1.map((e) => e.event_id), ["ev.d0", "ev.d1"]);
  const page2 = await s.listEvents(c.id, { after: page1[1].seq, limit: 2 });
  assert.deepStrictEqual(page2.map((e) => e.event_id), ["ev.d2", "ev.d3"]);
  const rest = await s.listEvents(c.id, { after: page2[1].seq, limit: 200 });
  assert.deepStrictEqual(rest.map((e) => e.event_id), ["ev.d4", "ev.a1"]);
  assert.ok(page1[0].seq < page2[0].seq && page2[1].seq < rest[0].seq);

  const actions = await s.listEvents(c.id, { type: "action" });
  assert.deepStrictEqual(actions.map((e) => e.event_id), ["ev.a1"]);
  assert.equal((await s.listEvents(c.id, { limit: 0 })).length, 6, "bad limit falls back to default 100");
  assert.equal((await s.listEvents(c.id, { limit: 100000 })).length, 6, "limit above 200 is clamped, not an error");
  assert.equal((await s.listEvents(c.id, { after: -5 })).length, 6, "bad after falls back to 0");
});

test("listEvents: rows carry no internal ids beyond event_id and seq", async () => {
  const { s } = setup();
  const u = await person(s, "a");
  const c = await char(s, u, "C");
  await s.addEvents(c.id, [ev("ev.shape", { place_id: "gate", payload: { where: "x" }, client_at: 5, save_version: 2 })], 77);
  const [row] = await s.listEvents(c.id);
  assert.deepStrictEqual(Object.keys(row).sort(), [
    "at", "client_at", "event_id", "level", "payload", "place_id", "save_version", "seq", "source_actor_id", "source_type", "story_id", "subject_id", "type",
  ].sort());
  assert.equal(row.at, 77);
  assert.equal(row.place_id, "gate");
  assert.deepStrictEqual(row.payload, { where: "x" });
  assert.equal(JSON.stringify(row).includes(c.id), false, "character id is not in the row");
  assert.equal(JSON.stringify(row).includes(u.id), false, "user id is not in the row");
});

test("cap: over 3000 prunes the oldest plain actions, never milestone, discovery or meta:backfilled", async () => {
  const { s } = setup();
  const u = await person(s, "a");
  const c = await char(s, u, "C");
  // oldest first: the backfill marker, a milestone, a discovery, then many actions
  await s.addEvents(c.id, [ev("ev.backfill", { type: "action", subject_id: "meta:backfilled" }), ev("ev.ms", { type: "milestone", subject_id: "ms:first_card", source_type: "observation" }), ev("ev.disc")], 1);
  for (let i = 0; i < MAX_EVENTS; i += 20) {
    const batch = [];
    for (let j = 0; j < 20; j++) batch.push(action(`ev.act.${i + j}`));
    await s.addEvents(c.id, batch, 2);
  }
  const all = await collect(s, c.id);
  assert.equal(all.length, MAX_EVENTS, "capped at 3000");
  const ids = all.map((e) => e.event_id);
  assert.ok(ids.includes("ev.backfill"), "backfill marker kept");
  assert.ok(ids.includes("ev.ms"), "milestone kept");
  assert.ok(ids.includes("ev.disc"), "discovery kept");
  assert.ok(!ids.includes("ev.act.0"), "oldest plain action dropped");
  assert.ok(ids.includes("ev.act.2999"), "newest action kept");
  assert.equal(ids.length, MAX_EVENTS);
  assert.equal(all[0].event_id, "ev.backfill", "order preserved");
});

test("cap: discoveries and milestones are accepted even when nothing else can be pruned", async () => {
  const { s } = setup();
  const u = await person(s, "a");
  const c = await char(s, u, "C");
  for (let i = 0; i < MAX_EVENTS + 5; i += 20) {
    const batch = [];
    for (let j = 0; j < 20 && i + j < MAX_EVENTS + 5; j++) batch.push(ev(`ev.disc.${i + j}`, { level: "heard", source_type: "report" }));
    await s.addEvents(c.id, batch, 1);
  }
  const res = await s.addEvents(c.id, [ev("ev.late", { type: "milestone", subject_id: "ms:night_1", source_type: "observation" })], 2);
  assert.deepStrictEqual(res, [{ event_id: "ev.late", status: "created" }]);
  assert.equal((await collect(s, c.id)).length, MAX_EVENTS + 6, "soft cap: nothing protected is dropped");
});

test("deleteCharacter removes its events and leaves others alone", async () => {
  const { s, accountsFile } = setup();
  const u = await person(s, "a");
  const a = await char(s, u, "A");
  const b = await char(s, u, "B");
  await s.addEvents(a.id, [ev("ev.keep")], 1);
  await s.addEvents(b.id, [ev("ev.gone")], 1);
  await s.deleteCharacter(u.id, b.id);
  assert.deepStrictEqual((await s.listEvents(b.id)), []);
  assert.deepStrictEqual((await s.listEvents(a.id)).map((e) => e.event_id), ["ev.keep"]);
  await new Promise((r) => setTimeout(r, 700)); // the file store writes after a short debounce
  const onDisk = JSON.parse(fs.readFileSync(accountsFile, "utf8"));
  assert.equal(onDisk.events.some((e) => e.character_id === b.id), false, "no orphan rows on disk");
});

async function collect(s, charId) {
  const out = [];
  let after = 0;
  for (;;) {
    const page = await s.listEvents(charId, { after, limit: 200 });
    if (!page.length) break;
    out.push(...page);
    after = page[page.length - 1].seq;
  }
  return out;
}
