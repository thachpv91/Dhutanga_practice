const test = require("node:test");
const assert = require("node:assert");
const { levelOf, connectDecision, buildConnectionList } = require("../connection-view");

const NOW = 1_000_000;
// A row as store.listConnections() returns it, with internal ids that must never reach the output.
const row = (over = {}) => ({
  otherCharId: "CHAR_INTERNAL_" + (over.handle || "x"),
  otherUserId: "USER_INTERNAL_" + (over.handle || "x"),
  handle: "handle" + (over.handle || "x"),
  name: "Người " + (over.handle || "x"),
  role: "monk",
  hideProfile: false,
  hideStatus: false,
  lastSeenAt: 500,
  iSaved: true,
  theySaved: true,
  savedAt: 100,
  incomingUnseen: false,
  ...over,
});
const online = (ids) => (cid) => ids.includes(cid);

test("levels: quen when both saved, luu when I did, moi when they did", () => {
  assert.strictEqual(levelOf({ iSaved: true, theySaved: true }), "quen");
  assert.strictEqual(levelOf({ iSaved: true, theySaved: false }), "luu");
  assert.strictEqual(levelOf({ iSaved: false, theySaved: true }), "moi");
  assert.strictEqual(levelOf({ iSaved: false, theySaved: false }), null);
});

test("connectDecision: same account refused", () => {
  const d = connectDecision({ sameAccount: true, blocked: false, hasEncounter: true, pair: { iSaved: false, theySaved: false }, savedCount: 0 });
  assert.strictEqual(d.ok, false);
  assert.strictEqual(d.status, 400);
});

test("connectDecision: blocked (either way) refused as not found", () => {
  const d = connectDecision({ sameAccount: false, blocked: true, hasEncounter: true, pair: { iSaved: false, theySaved: true }, savedCount: 0 });
  assert.strictEqual(d.ok, false);
  assert.strictEqual(d.status, 404);
  assert.strictEqual(d.error, "not found");
});

test("connectDecision: no encounter refused", () => {
  const d = connectDecision({ sameAccount: false, blocked: false, hasEncounter: false, pair: { iSaved: false, theySaved: false }, savedCount: 0 });
  assert.strictEqual(d.ok, false);
  assert.strictEqual(d.status, 400);
});

test("connectDecision: encounter present allows a new save; already saved is an idempotent ok", () => {
  assert.deepStrictEqual(
    connectDecision({ sameAccount: false, blocked: false, hasEncounter: true, pair: { iSaved: false, theySaved: false }, savedCount: 3 }),
    { ok: true, already: false });
  assert.deepStrictEqual(
    connectDecision({ sameAccount: false, blocked: false, hasEncounter: false, pair: { iSaved: true, theySaved: false }, savedCount: 3 }),
    { ok: true, already: true });
});

test("connectDecision: 100 saved is the limit for a new save", () => {
  const d = connectDecision({ sameAccount: false, blocked: false, hasEncounter: true, pair: { iSaved: false, theySaved: true }, savedCount: 100 });
  assert.strictEqual(d.ok, false);
  assert.strictEqual(d.status, 400);
});

test("status: hidden for hide_status, even when mutual and online; isOnline not even asked", () => {
  let asked = false;
  const list = buildConnectionList([row({ handle: "h", hideStatus: true })], {
    isOnline: () => { asked = true; return true; }, now: NOW,
  });
  assert.strictEqual(list[0].level, "quen");
  assert.strictEqual(list[0].status, null);
  assert.strictEqual(asked, false);
});

test("status: null for non-mutual (luu and moi), even when the other is online", () => {
  const list = buildConnectionList([
    row({ handle: "a", iSaved: true, theySaved: false }),
    row({ handle: "b", iSaved: false, theySaved: true }),
  ], { isOnline: () => true, now: NOW });
  for (const item of list) assert.strictEqual(item.status, null, item.handle);
});

test("status: mutual and visible gives online and lastSeenAt; online means now", () => {
  const list = buildConnectionList([
    row({ handle: "on", otherCharId: "C_on", lastSeenAt: 500 }),
    row({ handle: "off", otherCharId: "C_off", lastSeenAt: 700 }),
  ], { isOnline: online(["C_on"]), now: NOW });
  const on = list.find((x) => x.handle === "on");
  const off = list.find((x) => x.handle === "off");
  assert.deepStrictEqual(on.status, { online: true, lastSeenAt: NOW });
  assert.deepStrictEqual(off.status, { online: false, lastSeenAt: 700 });
});

test("blocked accounts and the caller's own account are left out", () => {
  const list = buildConnectionList([
    row({ handle: "ok" }),
    row({ handle: "blk", otherUserId: "USER_BLOCKED" }),
    row({ handle: "mine", otherUserId: "USER_ME" }),
  ], { isOnline: () => false, now: NOW, blockedUserIds: new Set(["USER_BLOCKED"]), ownUserId: "USER_ME" });
  assert.deepStrictEqual(list.map((x) => x.handle), ["ok"]);
});

test("rows without a public handle are left out", () => {
  const list = buildConnectionList([row({ handle: null })], { now: NOW });
  assert.deepStrictEqual(list, []);
});

test("sort: mutual online, mutual by lastSeenAt, then luu, then moi", () => {
  const list = buildConnectionList([
    row({ handle: "moi", iSaved: false, theySaved: true, savedAt: 900 }),
    row({ handle: "luu", iSaved: true, theySaved: false, savedAt: 800 }),
    row({ handle: "quenOff", otherCharId: "C_off", lastSeenAt: 600 }),
    row({ handle: "quenOn", otherCharId: "C_on", lastSeenAt: 100 }),
    row({ handle: "quenOld", otherCharId: "C_old", lastSeenAt: 200 }),
  ], { isOnline: online(["C_on"]), now: NOW });
  assert.deepStrictEqual(list.map((x) => x.handle), ["quenOn", "quenOff", "quenOld", "luu", "moi"]);
});

test("sort: a mutual person with hidden status is ordered by savedAt, not by its lastSeenAt", () => {
  const list = buildConnectionList([
    row({ handle: "hidden", hideStatus: true, lastSeenAt: 999, savedAt: 5 }),
    row({ handle: "visible", lastSeenAt: 500, savedAt: 10 }),
  ], { isOnline: () => false, now: NOW });
  assert.deepStrictEqual(list.map((x) => x.handle), ["visible", "hidden"]);
});

test("output carries only public fields: no internal ids, no position or scene", () => {
  const list = buildConnectionList([row({ handle: "p", otherCharId: "CHAR_INTERNAL_p", otherUserId: "USER_INTERNAL_p" })], { isOnline: () => true, now: NOW });
  const text = JSON.stringify(list);
  for (const bad of ["CHAR_INTERNAL", "USER_INTERNAL", "otherCharId", "otherUserId", "userId", "charId", "scene", "position", "\"x\"", "\"y\""]) {
    assert.ok(!text.includes(bad), "leaked: " + bad);
  }
  assert.deepStrictEqual(Object.keys(list[0]).sort(), ["handle", "hidden", "level", "name", "role", "status"]);
  assert.deepStrictEqual(Object.keys(list[0].status).sort(), ["lastSeenAt", "online"]);
});

test("buildConnectionList: an archived quen is never online, has no status, and sorts like a hidden-status row", () => {
  let asked = [];
  const probe = (cid) => { asked.push(cid); return true; };
  // row({handle}) sets the handle to exactly that value: "arch", "liveOn", "hidden".
  const list = buildConnectionList([
    row({ handle: "arch", archived: true, lastSeenAt: 900, savedAt: 300 }),
    row({ handle: "liveOn", lastSeenAt: 800, savedAt: 100 }),
    row({ handle: "hidden", hideStatus: true, savedAt: 200 }),
  ], { isOnline: probe, now: NOW, blockedUserIds: new Set() });
  assert.deepStrictEqual(asked, ["CHAR_INTERNAL_liveOn"], "the archived one is not even checked for presence");
  const arch = list.find((x) => x.handle === "arch");
  assert.strictEqual(arch.archived, true);
  assert.strictEqual(arch.status, null, "no online, no lastSeenAt");
  assert.strictEqual(arch.level, "quen", "level unchanged");
  // online quen first; then the non-status quens (archived and hidden-status) by savedAt, newest first
  assert.deepStrictEqual(list.map((x) => x.handle), ["liveOn", "arch", "hidden"]);
});

test("buildConnectionList: active rows never get an archived key", () => {
  const list = buildConnectionList([row({ handle: "plain" })], { isOnline: online([]), now: NOW, blockedUserIds: new Set() });
  assert.strictEqual("archived" in list[0], false);
});
