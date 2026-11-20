const test = require("node:test");
const assert = require("node:assert");

// social.js loads auth.js, which opens the shared store at require time. Make sure that is the JSON file
// store (read only here), never a Postgres database picked up from the environment.
delete process.env.DATABASE_URL;
const { publicProfile, cleanReason } = require("../social");

const base = {
  name: "Ông Năm",
  role: "monk",
  created_at: "2026-01-02T03:04:05.000Z",
  data: {
    mind: {
      carita: "tham",
      stats: { an: 0.7, secret: "SECRET_STAT" },
      cards: { c1: { diary: "SECRET_DIARY" } },
      quest: { step: "SECRET_QUEST" },
      items: ["lamp", "bowl", "a", "b", "c", "d", "e", "f"],
      village: { deeds: { x: 1 } },
    },
  },
  user_id: "USER_INTERNAL",
  id: "CHAR_INTERNAL",
};

test("public profile: only name, role, createdAt, carita and up to 6 items", () => {
  const p = publicProfile(base);
  assert.deepStrictEqual(Object.keys(p).sort(), ["carita", "createdAt", "items", "name", "role"]);
  assert.strictEqual(p.name, "Ông Năm");
  assert.strictEqual(p.role, "monk");
  assert.strictEqual(p.createdAt, "2026-01-02T03:04:05.000Z");
  assert.strictEqual(p.carita, "tham");
  assert.deepStrictEqual(p.items, ["lamp", "bowl", "a", "b", "c", "d"]);
});

test("public profile: no stats, cards, diary, quest or internal ids in the output", () => {
  const text = JSON.stringify(publicProfile(base));
  for (const bad of ["SECRET_STAT", "SECRET_DIARY", "SECRET_QUEST", "stats", "cards", "diary", "quest", "village", "USER_INTERNAL", "CHAR_INTERNAL", "user_id", "charId", "handle"]) {
    assert.ok(!text.includes(bad), "leaked: " + bad);
  }
});

test("hidden profile: only hidden, name and role", () => {
  const p = publicProfile({ ...base, hide_profile: true });
  assert.deepStrictEqual(p, { hidden: true, name: "Ông Năm", role: "monk" });
});

test("public profile: odd or missing mind data is tolerated and never echoes objects", () => {
  const p = publicProfile({ name: "X", role: "ghost", data: { mind: { carita: { nested: "SECRET" }, items: [{ id: "SECRET" }, "ok"] } } });
  assert.strictEqual(p.carita, null);
  assert.deepStrictEqual(p.items, ["ok"]);
  const q = publicProfile({ name: "Y", role: "villager", data: null });
  assert.strictEqual(q.carita, null);
  assert.deepStrictEqual(q.items, []);
});

test("report reason: control and bidi characters stripped, whitespace squeezed, max 200", () => {
  assert.strictEqual(cleanReason("  hello\u0000‮  world\n\n  "), "hello world");
  assert.strictEqual(cleanReason(undefined), "");
  assert.strictEqual(cleanReason("a".repeat(500)).length, 200);
});

test("public profile: an archived character adds archived: true, active ones have no such key", () => {
  const arch = publicProfile({ ...base, status: "story_completed" });
  assert.strictEqual(arch.archived, true);
  assert.strictEqual(arch.name, "Ông Năm", "other fields as today");
  assert.ok(!("archived" in publicProfile({ ...base, status: "active" })));
  assert.ok(!("archived" in publicProfile(base)));
  const hidden = publicProfile({ ...base, hide_profile: true, status: "story_completed" });
  assert.deepStrictEqual(hidden, { hidden: true, name: "Ông Năm", role: "monk", archived: true });
});
