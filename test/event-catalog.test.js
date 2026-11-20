const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const EC = require("../public/event-catalog");
const { makeSandbox, load } = require("./client-harness");

const ROOT = path.join(__dirname, "..");
const base = (extra) => ({
  event_id: "ev.test:1", type: "discovery", subject_id: "disc:cho", level: "seen", source_type: "observation", ...extra,
});
const reason = (ev) => {
  const r = EC.validate(ev);
  assert.equal(r.ok, false, "expected rejection of " + JSON.stringify(ev));
  return r.reason;
};
const ok = (ev) => assert.deepEqual(EC.validate(ev), { ok: true });

test("constants: types, source types, levels", () => {
  assert.deepEqual([...EC.TYPES], ["discovery", "report", "milestone", "action", "world_change"]);
  assert.deepEqual([...EC.SOURCE_TYPES], ["observation", "report", "evidence"]);
  assert.deepEqual([...EC.LEVELS], ["heard", "seen", "confirmed"]);
  assert.equal(EC.EVENT_ID_RE.test("ab"), false, "min 3");
  assert.equal(EC.EVENT_ID_RE.test("a".repeat(81)), false, "max 80");
  assert.equal(EC.EVENT_ID_RE.test("Abc"), false, "lowercase only");
  assert.equal(EC.EVENT_ID_RE.test("char:G03:ok_1-2.v1"), false, "uppercase rejected by the regex");
  assert.equal(EC.EVENT_ID_RE.test("g03:item_seen:v1"), true);
});

test("discovery: ids must match the Discover list, level and source pair", () => {
  ok(base());
  ok(base({ level: "heard", source_type: "report" }));
  assert.equal(reason(base({ subject_id: "disc:nope" })), "not in catalog");
  assert.equal(reason(base({ subject_id: "cho" })), "not in catalog", "missing disc: prefix");
  assert.equal(reason(base({ subject_id: "disc:" })), "not in catalog");
  assert.equal(reason(base({ level: "confirmed", source_type: "evidence" })), "bad level for discovery");
  assert.equal(reason(base({ level: "unknown" })), "bad level");
  assert.equal(reason(base({ level: "heard", source_type: "observation" })), "bad source_type for level");
  assert.equal(reason(base({ level: "seen", source_type: "report" })), "bad source_type for level");
  assert.equal(reason(base({ source_type: "rumour" })), "bad source_type");
});

test("milestone: ms: prefix, id shape, observation only", () => {
  const ms = { event_id: "ev.ms.one", type: "milestone", subject_id: "ms:first_card", source_type: "observation" };
  ok(ms);
  assert.equal(reason({ ...ms, subject_id: "first_card" }), "not in catalog");
  assert.equal(reason({ ...ms, subject_id: "ms:A" }), "not in catalog", "uppercase and too short");
  assert.equal(reason({ ...ms, subject_id: "ms:" + "a".repeat(41) }), "not in catalog", "too long");
  assert.equal(reason({ ...ms, subject_id: "ms:has-dash" }), "not in catalog");
  assert.equal(reason({ ...ms, source_type: "report" }), "bad source_type for milestone");
});

test("action: only meta:backfilled", () => {
  const act = { event_id: "ev.backfill", type: "action", subject_id: "meta:backfilled", source_type: "observation" };
  ok(act);
  assert.equal(reason({ ...act, subject_id: "meta:other" }), "not in catalog");
  assert.equal(reason({ ...act, subject_id: "walk:gate" }), "not in catalog");
});

test("report and world_change are reserved: not in catalog", () => {
  for (const type of ["report", "world_change"]) {
    assert.equal(reason({ event_id: "ev.res.one", type, subject_id: "x:y", level: "heard", source_type: "report" }), "not in catalog");
  }
});

test("unknown type, unknown field, non-object", () => {
  assert.equal(reason(base({ type: "gossip" })), "bad type");
  assert.equal(reason(base({ at: 123 })), "unknown field", "server sets at");
  assert.equal(reason(base({ character_id: "x" })), "unknown field");
  assert.equal(reason(null), "not an object");
  assert.equal(reason([base()]), "not an object");
  assert.equal(reason("ev"), "not an object");
});

test("event_id, required fields", () => {
  assert.equal(reason(base({ event_id: 5 })), "bad event_id");
  assert.equal(reason(base({ event_id: "BAD ID" })), "bad event_id");
  assert.equal(reason(base({ event_id: undefined })), "bad event_id");
  assert.equal(reason(base({ subject_id: 3 })), "bad subject_id");
});

test("string references: max 60, id-like, never a UUID", () => {
  ok(base({ place_id: "abandoned_house", story_id: "G03", source_actor_id: "npc.ferryman" }));
  ok(base({ place_id: null, story_id: null, source_actor_id: null }));
  assert.equal(reason(base({ place_id: "x".repeat(61) })), "bad place_id");
  ok(base({ story_id: "x".repeat(60) }));
  assert.equal(reason(base({ story_id: "" })), "bad story_id");
  assert.equal(reason(base({ story_id: "has space" })), "bad story_id");
  assert.equal(reason(base({ source_actor_id: 7 })), "bad source_actor_id");
  assert.equal(reason(base({ source_actor_id: "3f2b8c1e-8d4a-4b6e-9f10-1a2b3c4d5e6f" })), "bad source_actor_id", "internal uuid");
});

test("payload: plain object, at most 2048 bytes of JSON", () => {
  ok(base({ payload: { where: "under_step" } }));
  ok(base({ payload: null }));
  assert.equal(reason(base({ payload: [1] })), "bad payload");
  assert.equal(reason(base({ payload: "text" })), "bad payload");
  const small = { s: "a".repeat(2000) };
  ok(base({ payload: small }));
  assert.equal(reason(base({ payload: { s: "a".repeat(2100) } })), "payload too large");
  // multi-byte characters count as bytes, not characters
  assert.equal(reason(base({ payload: { s: "đ".repeat(1100) } })), "payload too large");
});

test("client_at and save_version are optional integers", () => {
  ok(base({ client_at: 1700000000000, save_version: 3 }));
  ok(base({ client_at: null, save_version: null }));
  assert.equal(reason(base({ client_at: -1 })), "bad client_at");
  assert.equal(reason(base({ client_at: 1.5 })), "bad client_at");
  assert.equal(reason(base({ client_at: "1700" })), "bad client_at");
  assert.equal(reason(base({ save_version: -1 })), "bad save_version");
  assert.equal(reason(base({ save_version: 2 ** 31 })), "bad save_version");
});

test("normalize fills defaults and copies only the catalog fields", () => {
  const n = EC.normalize(base({ story_id: "G03" }));
  assert.deepEqual(n, {
    event_id: "ev.test:1", type: "discovery", subject_id: "disc:cho", level: "seen", source_type: "observation",
    source_actor_id: null, place_id: null, story_id: "G03", payload: {}, client_at: null, save_version: null,
  });
});

test("DISCOVER_IDS equals the ENTRIES ids in public/encounters.js", () => {
  const src = fs.readFileSync(path.join(ROOT, "public", "encounters.js"), "utf8");
  const start = src.indexOf("const ENTRIES = [");
  const end = src.indexOf("];", start);
  assert.ok(start > 0 && end > start, "ENTRIES block found");
  const ids = [...src.slice(start, end).matchAll(/\{ id: "([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, 12);
  assert.deepEqual([...EC.DISCOVER_IDS].sort(), [...ids].sort());
});

test("every Milestones.defs id passes the milestone rule (incl. understood_*)", () => {
  const sb = makeSandbox();
  sb.Mind = { isOpen: () => false, parts: { CARDS: {}, milestoneState: () => ({ got: {}, counts: {}, save() {} }) } };
  load(sb, "milestones.js");
  const defs = sb.Milestones.defs;
  assert.ok(defs.length >= 17);
  assert.ok(defs.some((d) => d.id === "understood_hoi_han"), "generated understood ids are included");
  for (const d of defs) {
    const subject = "ms:" + d.id;
    assert.deepEqual(EC.validate({ event_id: "ev.ms." + d.id, type: "milestone", subject_id: subject, source_type: "observation" }), { ok: true }, d.id);
  }
});

test("level belongs to discoveries only", () => {
  const ms = { event_id: "ev.ms.lvl", type: "milestone", subject_id: "ms:first_card", source_type: "observation" };
  ok(ms);
  assert.equal(reason({ ...ms, level: "seen" }), "level only for discovery");
  assert.equal(reason({ event_id: "ev.act.lvl", type: "action", subject_id: "meta:backfilled", source_type: "observation", level: "seen" }), "level only for discovery");
  assert.equal(reason({ event_id: "ev.d.nolvl", type: "discovery", subject_id: "disc:cho", source_type: "observation" }), "bad level");
});
