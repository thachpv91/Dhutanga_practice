const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createStore, MAX_ENCOUNTERS } = require("../store");

const HANDLE_FORMAT = /^[A-Za-z0-9_-]{16}$/;
const flush = () => new Promise((r) => setTimeout(r, 700));

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "social-"));
  const accountsFile = path.join(dir, "accounts.json");
  const s = createStore({ accountsFile, tracesFile: path.join(dir, "traces.json") });
  return { s, accountsFile };
}
const person = (s, name) => s.upsertUser("sub:" + name, { name });
const char = (s, user, name, extra = {}) => s.createCharacter(user.id, name, "monk", { mind: { carita: "tham", items: ["lamp"] }, ...extra });
const readFile = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

test("handles: created lazily, stable, unique per character, opaque", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const c1 = await char(s, alice, "A1");
  const c2 = await char(s, alice, "A2");
  const h1 = await s.ensureHandle(alice.id, c1.id);
  assert.match(h1, HANDLE_FORMAT);
  assert.strictEqual(await s.ensureHandle(alice.id, c1.id), h1, "stable on repeat");
  const h2 = await s.ensureHandle(alice.id, c2.id);
  assert.notStrictEqual(h1, h2, "unique per character");
  assert.ok(!h1.includes(c1.id) && h1 !== c1.id, "not derived from the internal id");
});

test("handles: another account cannot get a handle for a character it does not own", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const c1 = await char(s, alice, "A1");
  assert.strictEqual(await s.ensureHandle(bob.id, c1.id), null);
});

test("getByHandle: finds by handle only, never by internal id", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const c1 = await char(s, alice, "A1");
  const h = await s.ensureHandle(alice.id, c1.id);
  const got = await s.getByHandle(h);
  assert.strictEqual(got.id, c1.id);
  assert.strictEqual(got.user_id, alice.id);
  assert.strictEqual(got.name, "A1");
  assert.strictEqual(got.role, "monk");
  assert.strictEqual(got.hide_profile, false);
  assert.strictEqual(got.hide_status, false);
  assert.ok(typeof got.created_at === "string");
  assert.strictEqual(await s.getByHandle(c1.id), null, "internal id does not resolve");
  assert.strictEqual(await s.getByHandle("unknownhandle"), null);
  assert.strictEqual(await s.getByHandle(undefined), null);
});

test("flags: owner only, partial updates keep the other flag, summary shows them", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const c1 = await char(s, alice, "A1");
  const h = await s.ensureHandle(alice.id, c1.id);
  assert.strictEqual(await s.setFlags(bob.id, c1.id, { hideProfile: true }), false);
  assert.strictEqual(await s.setFlags(alice.id, c1.id, { hideProfile: true }), true);
  assert.strictEqual(await s.setFlags(alice.id, c1.id, { hideStatus: true }), true);
  const got = await s.getByHandle(h);
  assert.strictEqual(got.hide_profile, true, "hideProfile kept after the second, partial update");
  assert.strictEqual(got.hide_status, true);
  const [sum] = await s.listCharacters(alice.id);
  assert.strictEqual(sum.hideProfile, true);
  assert.strictEqual(sum.hideStatus, true);
  // backwards-compatible summary keys are still there
  for (const k of ["id", "name", "role", "createdAt", "updatedAt", "cards", "items", "carita"]) assert.ok(k in sum, k);
});

test("backfill: a character saved before this change gets a handle lazily", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "social-old-"));
  const accountsFile = path.join(dir, "accounts.json");
  const old = {
    users: { uA: { id: "uA", provider_sub: "sub:old", account: {} } },
    sessions: {},
    characters: { cA: { id: "cA", user_id: "uA", name: "Old", role: "ghost", data: {}, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z" } },
  };
  fs.writeFileSync(accountsFile, JSON.stringify(old));
  const s = createStore({ accountsFile, tracesFile: path.join(dir, "traces.json") });
  assert.strictEqual((await s.listCharacters("uA"))[0].hideProfile, false);
  const h = await s.ensureHandle("uA", "cA");
  assert.match(h, HANDLE_FORMAT);
  assert.strictEqual((await s.getByHandle(h)).name, "Old");
});

test("encounters: one row per direction, count and last time updated, first kept", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  assert.strictEqual(await s.recordEncounter(a1.id, b1.id, 1000), true);
  assert.strictEqual(await s.recordEncounter(b1.id, a1.id, 1000), true);
  assert.strictEqual(await s.recordEncounter(a1.id, b1.id, 2000), true);
  const [row] = await s.listEncounters(a1.id);
  assert.strictEqual(row.otherCharId, b1.id);
  assert.strictEqual(row.otherUserId, bob.id);
  assert.strictEqual(row.name, "B1");
  assert.strictEqual(row.count, 2);
  assert.strictEqual(row.firstAt, 1000);
  assert.strictEqual(row.lastAt, 2000);
  const [rowB] = await s.listEncounters(b1.id);
  assert.strictEqual(rowB.otherCharId, a1.id);
  assert.strictEqual(rowB.count, 1);
});

test("encounters: same account and self pairs are refused", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const a1 = await char(s, alice, "A1");
  const a2 = await char(s, alice, "A2");
  assert.strictEqual(await s.recordEncounter(a1.id, a2.id, 1000), false);
  assert.strictEqual(await s.recordEncounter(a1.id, a1.id, 1000), false);
  assert.deepStrictEqual(await s.listEncounters(a1.id), []);
});

test("encounters: capped at 50 per character, the oldest are dropped", async () => {
  const { s } = setup();
  const me = await person(s, "me");
  const c = await char(s, me, "Me");
  for (let i = 0; i < 55; i++) {
    const u = await person(s, "other" + i);
    const o = await char(s, u, "p" + i);
    await s.recordEncounter(c.id, o.id, 1000 + i);
  }
  const rows = await s.listEncounters(c.id);
  assert.strictEqual(rows.length, MAX_ENCOUNTERS);
  assert.strictEqual(MAX_ENCOUNTERS, 50);
  const names = new Set(rows.map((r) => r.name));
  for (let i = 0; i < 5; i++) assert.ok(!names.has("p" + i), "p" + i + " should be gone");
  assert.ok(names.has("p54"), "newest kept");
  assert.strictEqual(rows[0].name, "p54", "newest first");
});

test("deleteCharacter: removes its encounters in both directions and its reports", async () => {
  const { s, accountsFile } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const a2 = await char(s, alice, "A2");
  const b1 = await char(s, bob, "B1");
  await s.recordEncounter(a1.id, b1.id, 1000);
  await s.recordEncounter(b1.id, a1.id, 1000);
  await s.recordEncounter(a2.id, b1.id, 1000);
  await s.recordEncounter(b1.id, a2.id, 1000);
  const hB = await s.ensureHandle(bob.id, b1.id);
  assert.strictEqual(await s.addReport(alice.id, b1.id, "spam", 5), true);
  await s.deleteCharacter(bob.id, b1.id);
  assert.deepStrictEqual(await s.listEncounters(a1.id), [], "B1 gone from A1's list");
  assert.deepStrictEqual(await s.listEncounters(a2.id), [], "B1 gone from A2's list");
  assert.strictEqual(await s.getByHandle(hB), null);
  // deleting A1 removes rows where A1 is the other side too
  await s.deleteCharacter(alice.id, a1.id);
  assert.deepStrictEqual(await s.listEncounters(a1.id), []);
  await flush();
  const db = readFile(accountsFile);
  assert.strictEqual(db.reports.filter((r) => r.reported_char_id === b1.id).length, 0, "reports removed");
  assert.ok(!Object.values(db.encounters).some((e) => e.char_id === b1.id || e.other_char_id === b1.id || e.char_id === a1.id || e.other_char_id === a1.id), "no encounter rows left");
});

test("deleteCharacter: another account cannot delete your character", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  await s.deleteCharacter(bob.id, a1.id);
  assert.ok(await s.getCharacter(alice.id, a1.id), "still there");
});

test("blocks: by account, both directions, removable, self refused", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const carol = await person(s, "carol");
  assert.strictEqual(await s.isBlockedEither(alice.id, bob.id), false);
  assert.strictEqual(await s.addBlock(alice.id, bob.id), true);
  assert.strictEqual(await s.isBlockedEither(alice.id, bob.id), true);
  assert.strictEqual(await s.isBlockedEither(bob.id, alice.id), true, "the blocked side is covered too");
  assert.strictEqual(await s.isBlockedEither(carol.id, alice.id), false);
  assert.strictEqual(await s.addBlock(alice.id, alice.id), false);
  await s.removeBlock(alice.id, bob.id);
  assert.strictEqual(await s.isBlockedEither(bob.id, alice.id), false);
});

test("reports: reported account comes from the character, reason clipped to 200", async () => {
  const { s, accountsFile } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const b1 = await char(s, bob, "B1");
  assert.strictEqual(await s.addReport(alice.id, b1.id, "x".repeat(300), 5), true);
  assert.strictEqual(await s.addReport(alice.id, "missing-char-id", "r", 5), false);
  await flush();
  const db = readFile(accountsFile);
  assert.strictEqual(db.reports.length, 1);
  assert.strictEqual(db.reports[0].reported_user_id, bob.id);
  assert.strictEqual(db.reports[0].reason.length, 200);
});

test("touchSeen stores last_seen_at on the character", async () => {
  const { s, accountsFile } = setup();
  const alice = await person(s, "alice");
  const a1 = await char(s, alice, "A1");
  await s.touchSeen(a1.id, 777);
  await flush();
  assert.strictEqual(readFile(accountsFile).characters[a1.id].last_seen_at, 777);
});

// ----- archived characters (status "story_completed"): read-only, never bound, never in encounters -----
test("status: a new character is active; the summary shows it", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const c1 = await char(s, alice, "A1");
  const [sum] = await s.listCharacters(alice.id);
  assert.strictEqual(sum.status, "active");
  const got = await s.getCharacter(alice.id, c1.id);
  assert.strictEqual(got.status, "active");
});

test("setCharacterStatus: owner only, only the two known values", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const c1 = await char(s, alice, "A1");
  assert.strictEqual(await s.setCharacterStatus(bob.id, c1.id, "story_completed"), false, "not the owner");
  assert.strictEqual(await s.setCharacterStatus(alice.id, c1.id, "dead"), false, "unknown value");
  assert.strictEqual(await s.setCharacterStatus(alice.id, c1.id, undefined), false, "missing value");
  assert.strictEqual((await s.getCharacter(alice.id, c1.id)).status, "active", "nothing changed");
  assert.strictEqual(await s.setCharacterStatus(alice.id, c1.id, "story_completed"), true);
  assert.strictEqual((await s.getCharacter(alice.id, c1.id)).status, "story_completed");
  const [sum] = await s.listCharacters(alice.id);
  assert.strictEqual(sum.status, "story_completed");
  assert.strictEqual(await s.setCharacterStatus(alice.id, c1.id, "active"), true, "can be set back in the store");
});

test("isArchived: true only for story_completed", () => {
  const { isArchived } = require("../store");
  assert.strictEqual(isArchived({ status: "story_completed" }), true);
  assert.strictEqual(isArchived({ status: "active" }), false);
  assert.strictEqual(isArchived({}), false, "older rows without a status are active");
  assert.strictEqual(isArchived(null), false);
});

test("recordEncounter refuses when either character is archived", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  await s.setCharacterStatus(bob.id, b1.id, "story_completed");
  assert.strictEqual(await s.recordEncounter(a1.id, b1.id, 1000), false);
  assert.strictEqual(await s.recordEncounter(b1.id, a1.id, 1000), false);
  assert.strictEqual(await s.hasEncounter(a1.id, b1.id), false);
  await s.setCharacterStatus(bob.id, b1.id, "active");
  assert.strictEqual(await s.recordEncounter(a1.id, b1.id, 1000), true, "active again: encounters resume");
});
