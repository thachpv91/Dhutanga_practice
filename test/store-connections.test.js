const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { createStore, MAX_CONNECTIONS } = require("../store");
const { levelOf } = require("../connection-view");

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "connections-"));
  const accountsFile = path.join(dir, "accounts.json");
  const s = createStore({ accountsFile, tracesFile: path.join(dir, "traces.json") });
  return { s, accountsFile };
}
const person = (s, name) => s.upsertUser("sub:" + name, { name });
const char = (s, user, name) => s.createCharacter(user.id, name, "monk", {});
const levelFor = async (s, charId, otherId) => levelOf(await s.connectionPair(charId, otherId));

test("levels: one saved side is luu / moi, both sides is quen", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  await s.recordEncounter(a1.id, b1.id, 1000);
  assert.strictEqual(await s.addConnection(a1.id, b1.id, 2000), true);
  assert.strictEqual(await levelFor(s, a1.id, b1.id), "luu");
  assert.strictEqual(await levelFor(s, b1.id, a1.id), "moi");
  assert.strictEqual(await s.addConnection(b1.id, a1.id, 3000), true);
  assert.strictEqual(await levelFor(s, a1.id, b1.id), "quen");
  assert.strictEqual(await levelFor(s, b1.id, a1.id), "quen");
  const [rowA] = await s.listConnections(a1.id);
  assert.strictEqual(rowA.otherCharId, b1.id);
  assert.strictEqual(rowA.otherUserId, bob.id);
  assert.strictEqual(rowA.handle, null, "no handle yet: none invented here");
  assert.strictEqual(rowA.iSaved, true);
  assert.strictEqual(rowA.theySaved, true);
  assert.strictEqual(rowA.savedAt, 2000, "savedAt is my own save time");
});

test("addConnection: idempotent, keeps the first created_at", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  assert.strictEqual(await s.addConnection(a1.id, b1.id, 1000), true);
  assert.strictEqual(await s.addConnection(a1.id, b1.id, 5000), true);
  const rows = await s.listConnections(a1.id);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].savedAt, 1000);
});

test("addConnection: same account, self, and unknown characters are refused", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const a1 = await char(s, alice, "A1");
  const a2 = await char(s, alice, "A2");
  const bob = await person(s, "bob");
  const b1 = await char(s, bob, "B1");
  assert.strictEqual(await s.addConnection(a1.id, a2.id, 1), false, "same account");
  assert.strictEqual(await s.addConnection(a1.id, a1.id, 1), false, "self");
  assert.strictEqual(await s.addConnection(a1.id, "missing-char-id", 1), false, "unknown target");
  assert.strictEqual(await s.addConnection("missing-char-id", b1.id, 1), false, "unknown saver");
  assert.deepStrictEqual(await s.listConnections(a1.id), []);
});

test("removeConnection: only the caller's direction is removed", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  await s.addConnection(a1.id, b1.id, 1);
  await s.addConnection(b1.id, a1.id, 1);
  await s.removeConnection(a1.id, b1.id);
  assert.strictEqual(await levelFor(s, a1.id, b1.id), "moi", "they still saved me");
  assert.strictEqual(await levelFor(s, b1.id, a1.id), "luu", "from B1's side it is still saved");
  await s.removeConnection(b1.id, a1.id);
  assert.strictEqual(await levelFor(s, a1.id, b1.id), null);
  assert.deepStrictEqual(await s.listConnections(b1.id), []);
});

test("deleteCharacter: connections in both directions are removed", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const a2 = await char(s, alice, "A2");
  const b1 = await char(s, bob, "B1");
  await s.addConnection(a1.id, b1.id, 1);
  await s.addConnection(b1.id, a1.id, 1);
  await s.addConnection(a2.id, b1.id, 1);
  await s.deleteCharacter(bob.id, b1.id);
  assert.deepStrictEqual(await s.listConnections(a1.id), [], "B1 gone from A1's list");
  assert.deepStrictEqual(await s.listConnections(a2.id), [], "B1 gone from A2's list");
  await s.deleteCharacter(alice.id, a2.id);
  assert.deepStrictEqual(await s.listConnections(a1.id), []);
});

test("addBlock: removes connections between the two accounts only, both directions", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const carol = await person(s, "carol");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  const c1 = await char(s, carol, "C1");
  await s.addConnection(a1.id, b1.id, 1);
  await s.addConnection(b1.id, a1.id, 1);
  await s.addConnection(a1.id, c1.id, 1);
  await s.addBlock(bob.id, alice.id);
  assert.strictEqual(await levelFor(s, a1.id, b1.id), null, "alice -> bob removed");
  assert.strictEqual(await levelFor(s, b1.id, a1.id), null, "bob -> alice removed");
  assert.strictEqual(await levelFor(s, a1.id, c1.id), "luu", "other accounts untouched");
});

test("removeConnectionsBetweenUsers: direct call removes both directions", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const a2 = await char(s, alice, "A2");
  const b1 = await char(s, bob, "B1");
  await s.addConnection(a2.id, b1.id, 1);
  await s.addConnection(b1.id, a1.id, 1);
  await s.removeConnectionsBetweenUsers(alice.id, bob.id);
  assert.deepStrictEqual(await s.listConnections(a2.id), []);
  assert.deepStrictEqual(await s.listConnections(b1.id), []);
});

test("incoming unseen: counts saves I have not looked at, cleared by markIncomingSeen", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  await s.addConnection(b1.id, a1.id, 1);
  let counts = await s.countIncomingUnseen([a1.id, b1.id]);
  assert.strictEqual(counts.get(a1.id), 1);
  assert.strictEqual(counts.get(b1.id), undefined, "B1 has nothing incoming");
  const [row] = await s.listConnections(a1.id);
  assert.strictEqual(row.incomingUnseen, true);
  await s.markIncomingSeen(a1.id, 99);
  counts = await s.countIncomingUnseen([a1.id]);
  assert.strictEqual(counts.get(a1.id), undefined, "seen");
  const [seenRow] = await s.listConnections(a1.id);
  assert.strictEqual(seenRow.incomingUnseen, false);
});

test("incoming unseen: a save I return is no longer new (quen)", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  await s.addConnection(b1.id, a1.id, 1);
  assert.strictEqual((await s.countIncomingUnseen([a1.id])).get(a1.id), 1);
  await s.addConnection(a1.id, b1.id, 2);
  assert.strictEqual((await s.countIncomingUnseen([a1.id])).get(a1.id), undefined);
});

test("incoming unseen: outgoing saves never count for the saver", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  await s.addConnection(a1.id, b1.id, 1);
  assert.strictEqual((await s.countIncomingUnseen([a1.id, b1.id])).get(b1.id), 1);
  assert.strictEqual((await s.countIncomingUnseen([a1.id])).get(a1.id), undefined);
});

test("hasEncounter: either direction counts, nothing else does", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const carol = await person(s, "carol");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  const c1 = await char(s, carol, "C1");
  assert.strictEqual(await s.hasEncounter(a1.id, b1.id), false);
  await s.recordEncounter(b1.id, a1.id, 1000);
  assert.strictEqual(await s.hasEncounter(a1.id, b1.id), true);
  assert.strictEqual(await s.hasEncounter(b1.id, a1.id), true);
  assert.strictEqual(await s.hasEncounter(a1.id, c1.id), false);
});

test("cap: 100 saved connections per character, the 101st is refused", async () => {
  const { s } = setup();
  const me = await person(s, "me");
  const mine = await char(s, me, "Me");
  assert.strictEqual(MAX_CONNECTIONS, 100);
  for (let i = 0; i < MAX_CONNECTIONS; i++) {
    const u = await person(s, "p" + i);
    const o = await char(s, u, "P" + i);
    assert.strictEqual(await s.addConnection(mine.id, o.id, i), true, "slot " + i);
  }
  const extra = await person(s, "extra");
  const x = await char(s, extra, "X");
  assert.strictEqual(await s.addConnection(mine.id, x.id, 1), false);
  // an existing connection is still idempotent at the cap
  const first = (await s.listConnections(mine.id)).find((r) => r.savedAt === 0);
  assert.strictEqual(await s.addConnection(mine.id, first.otherCharId, 5), true);
  // incoming saves from others do not use up my own cap
  assert.strictEqual(await s.addConnection(x.id, mine.id, 1), true);
});

test("listConnections: a character that was deleted is dropped", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  await s.addConnection(a1.id, b1.id, 1);
  // simulate a row whose character vanished without the cascade (defence in depth)
  await s.deleteCharacter(bob.id, b1.id);
  assert.deepStrictEqual(await s.listConnections(a1.id), []);
});

// ----- archived characters: no new connections; existing ones stay but show archived with no status -----
test("addConnection refuses an archived character on either side; existing connections stay", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  await s.recordEncounter(a1.id, b1.id, 1000);
  await s.recordEncounter(b1.id, a1.id, 1000);
  assert.strictEqual(await s.addConnection(a1.id, b1.id, 2000), true);
  await s.setCharacterStatus(bob.id, b1.id, "story_completed");
  assert.strictEqual(await s.addConnection(a1.id, b1.id, 3000), false, "refused while the other side is archived");
  assert.strictEqual(await s.addConnection(b1.id, a1.id, 3000), false, "archived side cannot save");
  assert.strictEqual(await levelFor(s, a1.id, b1.id), "luu", "the existing connection row is kept");
  const c1 = await char(s, alice, "A2");
  assert.strictEqual(await s.addConnection(c1.id, b1.id, 4000), false, "a new save of an archived character is refused");
  await s.setCharacterStatus(bob.id, b1.id, "active");
  assert.strictEqual(await s.addConnection(a1.id, b1.id, 5000), true, "active again: idempotent save works");
  await s.setCharacterStatus(alice.id, a1.id, "story_completed");
  assert.strictEqual(await s.addConnection(b1.id, a1.id, 5000), false, "archived owner side refused too");
});

test("listConnections marks an archived other character; active rows have no archived key", async () => {
  const { s } = setup();
  const alice = await person(s, "alice");
  const bob = await person(s, "bob");
  const a1 = await char(s, alice, "A1");
  const b1 = await char(s, bob, "B1");
  const b2 = await char(s, bob, "B2");
  await s.recordEncounter(a1.id, b1.id, 1000);
  await s.recordEncounter(b1.id, a1.id, 1000);
  await s.recordEncounter(a1.id, b2.id, 1000);
  await s.recordEncounter(b2.id, a1.id, 1000);
  await s.addConnection(a1.id, b1.id, 2000);
  await s.addConnection(b1.id, a1.id, 2100);
  await s.addConnection(a1.id, b2.id, 2200);
  await s.addConnection(b2.id, a1.id, 2300);
  await s.setCharacterStatus(bob.id, b1.id, "story_completed");
  const rows = await s.listConnections(a1.id);
  const arch = rows.find((r) => r.otherCharId === b1.id);
  const live = rows.find((r) => r.otherCharId === b2.id);
  assert.strictEqual(arch.archived, true);
  assert.strictEqual(arch.iSaved && arch.theySaved, true, "level unchanged: still quen");
  assert.strictEqual(live.archived, false);
});
