const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const ev = require("../events");
const { createStore, isArchived } = require("../store");

const good = (id, extra = {}) => ({
  event_id: id, type: "discovery", subject_id: "disc:cho", level: "seen", source_type: "observation", ...extra,
});

test("accessDecision: unknown or foreign character is 404; archived is 403 for writes only", () => {
  assert.deepStrictEqual(ev.accessDecision(null, { write: false }), { status: 404, error: "not found" });
  assert.deepStrictEqual(ev.accessDecision(null, { write: true }), { status: 404, error: "not found" });
  const active = { id: "c1", status: "active" };
  const archived = { id: "c2", status: "story_completed" };
  assert.equal(ev.accessDecision(active, { write: true }), null);
  assert.equal(ev.accessDecision(active, { write: false }), null);
  assert.equal(ev.accessDecision(archived, { write: false }), null, "archived can still be read");
  assert.equal(ev.accessDecision(archived, { write: true }).status, 403);
});

test("owner: another account gets no character row, so the route answers 404", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evroute-"));
  const s = createStore({ accountsFile: path.join(dir, "a.json"), tracesFile: path.join(dir, "t.json") });
  const owner = await s.upsertUser("sub:owner", { name: "o" });
  const other = await s.upsertUser("sub:other", { name: "x" });
  const c = await s.createCharacter(owner.id, "C", "monk", {});
  assert.equal(ev.accessDecision(await s.getCharacter(owner.id, c.id), { write: false }), null);
  assert.deepStrictEqual(ev.accessDecision(await s.getCharacter(other.id, c.id), { write: false }), { status: 404, error: "not found" });
  assert.ok(isArchived({ status: "story_completed" }));
});

test("parseBatch: 1 to 20 event objects, else 400", () => {
  assert.equal(ev.parseBatch(null).ok, false);
  assert.equal(ev.parseBatch([]).ok, false, "array body");
  assert.equal(ev.parseBatch({}).ok, false);
  assert.equal(ev.parseBatch({ events: [] }).ok, false, "empty");
  assert.equal(ev.parseBatch({ events: Array(21).fill(good("ev.a")) }).ok, false, "21 is too many");
  assert.equal(ev.parseBatch({ events: [1] }).ok, false, "non-object element");
  assert.equal(ev.parseBatch({ events: [null] }).ok, false);
  assert.equal(ev.parseBatch({ events: Array(20).fill(good("ev.a")) }).ok, true);
  assert.equal(ev.BATCH_MAX, 20);
});

test("prepareBatch: client at and other fields are ignored, catalog fields are kept", () => {
  const [item] = ev.prepareBatch([good("ev.at.one", { at: 1, character_id: "someone", title: "x", place_id: "gate" })]);
  assert.equal(item.status, undefined, "not rejected");
  assert.equal(item.event.at, undefined, "server sets at, not the client");
  assert.equal(item.event.place_id, "gate");
  assert.equal("character_id" in item.event, false);
  assert.equal("title" in item.event, false, "no display text from the client");
});

test("rejected events never reach the store; response order follows the input", () => {
  const list = [good("ev.ok.one"), good("ev.bad.one", { subject_id: "disc:nope" }), good("ev.ok.two", { type: "report", subject_id: "x:y" }), good("ev.ok.three")];
  const items = ev.prepareBatch(list);
  const stored = ev.toStore(items);
  assert.deepStrictEqual(stored.map((e) => e.event_id), ["ev.ok.one", "ev.ok.three"]);
  const out = ev.buildResults(items, [{ event_id: "ev.ok.one", status: "created" }, { event_id: "ev.ok.three", status: "duplicate" }]);
  assert.deepStrictEqual(out, {
    results: [
      { event_id: "ev.ok.one", status: "created" },
      { event_id: "ev.bad.one", status: "rejected", reason: "not in catalog" },
      { event_id: "ev.ok.two", status: "rejected", reason: "not in catalog" },
      { event_id: "ev.ok.three", status: "duplicate" },
    ],
  });
});

test("a rejected event with a junk event_id echoes null, not the client text", () => {
  const items = ev.prepareBatch([{ event_id: "<script>alert(1)</script>", type: "discovery" }, { type: "discovery" }]);
  const out = ev.buildResults(items, []);
  assert.deepStrictEqual(out.results.map((r) => r.event_id), [null, null]);
  assert.ok(out.results.every((r) => r.status === "rejected"));
});

test("response carries only event_id, status and reason", () => {
  const items = ev.prepareBatch([good("ev.shape.one"), good("ev.shape.two", { subject_id: "disc:nope" })]);
  const out = ev.buildResults(items, [{ event_id: "ev.shape.one", status: "created", character_id: "leak" }]);
  for (const r of out.results) {
    for (const k of Object.keys(r)) assert.ok(["event_id", "status", "reason"].includes(k), k);
  }
  assert.equal(JSON.stringify(out).includes("leak"), false);
});

test("rate limit: 60 events per minute per character, counted in events", () => {
  const rl = ev.createRateLimiter({ limit: 60, windowMs: 60000 });
  const t0 = 1_000_000;
  for (let i = 0; i < 3; i++) assert.equal(rl.take("c1", 20, t0 + i), true);
  assert.equal(rl.take("c1", 1, t0 + 10), false, "61st event in the window");
  assert.equal(rl.take("c2", 20, t0 + 10), true, "another character has its own budget");
  assert.equal(rl.take("c1", 20, t0 + 59_999), false, "still inside the window");
  assert.equal(rl.take("c1", 20, t0 + 60_000), true, "window slid past the first batch");
  assert.equal(rl.take("c1", 0, t0 + 60_001), false, "zero events is not a request");
  assert.equal(ev.EVENTS_PER_MINUTE, 60);
});

test("rate limit: a rejected take records nothing", () => {
  const rl = ev.createRateLimiter({ limit: 5, windowMs: 1000 });
  assert.equal(rl.take("k", 4, 0), true);
  assert.equal(rl.take("k", 2, 1), false);
  assert.equal(rl.take("k", 1, 2), true, "the refused batch did not count");
});

test("parseListQuery: defaults, clamp, and rejects bad values", () => {
  const q = (s) => ev.parseListQuery(new URLSearchParams(s));
  assert.deepStrictEqual(q(""), { ok: true, query: { after: 0, limit: 100, type: undefined } });
  assert.deepStrictEqual(q("after=12&limit=5&type=milestone"), { ok: true, query: { after: 12, limit: 5, type: "milestone" } });
  assert.deepStrictEqual(q("limit=500").query.limit, 200, "clamped");
  assert.equal(q("after=-1").ok, false);
  assert.equal(q("after=abc").ok, false);
  assert.equal(q("limit=0").ok, false);
  assert.equal(q("limit=2.5").ok, false);
  assert.equal(q("type=gossip").ok, false);
  assert.equal(q("type=report").ok, true, "a catalog type, even a reserved one, is a valid filter");
});
