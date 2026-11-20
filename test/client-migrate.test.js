const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const MIND = { cards: { a: 1 }, items: [] };
const PROG = { v: 1, runId: "r1", role: "monk", sceneId: "a1", meter: 6 };
// Legacy character: no version in data.
const LEGACY = { id: "c1", name: "A", role: "monk", data: { mind: MIND, progress: PROG } };
const CURRENT_CHAR = { id: "c2", name: "B", role: "monk", data: { mind: { cards: {} }, v: 2 } };
const FUTURE = { id: "c3", name: "C", role: "monk", data: { mind: { cards: {} }, v: 9 } };

// A signed-in session serving the given characters and one account.
async function session(chars, account = {}) {
  const sb = makeSandbox();
  sb.__route = async (c) => {
    if (c.url === "/api/me") return { status: 200, body: { user: { name: "u" }, account } };
    const m = c.url.match(/^\/api\/characters\/(\w+)$/);
    if (m && c.method === "GET") return chars[m[1]] ? { status: 200, body: { character: chars[m[1]] } } : { status: 404, body: {} };
    return { status: 200, body: {} };
  };
  load(sb, "migrate.js");
  load(sb, "save.js");
  await sb.Save.refresh();
  return sb;
}
const puts = (sb) => sb.calls.filter((c) => c.method === "PUT");

test("legacy character: stamped v 2 on open, exactly one PUT carrying v:2 and unchanged mind/progress", async () => {
  const sb = await session({ c1: LEGACY });
  await sb.Save.openCharacter("c1");
  assert.equal(sb.Save.character().kv["dhutanga.v"], "2");
  assert.equal(sb.Save.version(), 2);
  await sb.advance(2000);
  const p = puts(sb);
  assert.equal(p.length, 1);
  assert.equal(p[0].url, "/api/characters/c1");
  assert.equal(p[0].body.data.v, 2);
  assert.deepEqual(p[0].body.data.mind, MIND);
  assert.deepEqual(p[0].body.data.progress, PROG);
  assert.deepEqual(p[0].body.data.history, []);
});

test("character already at v 2: no PUT from migration", async () => {
  const sb = await session({ c2: CURRENT_CHAR });
  await sb.Save.openCharacter("c2");
  assert.equal(sb.Save.version(), 2);
  await sb.advance(5000);
  assert.equal(puts(sb).length, 0);
});

test("future version 9: left untouched, no PUT, and later saves keep v 9", async () => {
  const sb = await session({ c3: FUTURE });
  await sb.Save.openCharacter("c3");
  assert.equal(sb.Save.version(), 9);
  assert.equal(sb.Save.character().kv["dhutanga.v"], "9");
  await sb.advance(5000);
  assert.equal(puts(sb).length, 0, "no save over newer data");
  sb.Save.set("dhutanga.history", "[]");
  await sb.advance(2000);
  assert.equal(puts(sb).length, 1);
  assert.equal(puts(sb)[0].body.data.v, 9, "never downgraded");
});

test("two characters in one account migrate independently; account keys untouched", async () => {
  const account = { memory: [{ id: "m1" }], runs: 3, completed: { monk: true } };
  const other = { id: "c9", name: "D", role: "monk", data: { mind: { cards: { z: 1 } } } };
  const sb = await session({ c1: LEGACY, c9: other }, account);
  const memBefore = sb.Save.get("dhutanga.memory");
  await sb.Save.openCharacter("c1");
  await sb.Save.openCharacter("c9");
  await sb.advance(2000);
  const p = puts(sb);
  assert.equal(p.length, 2);
  assert.deepEqual(p.map((c) => c.url).sort(), ["/api/characters/c1", "/api/characters/c9"]);
  const byUrl = Object.fromEntries(p.map((c) => [c.url, c.body.data]));
  assert.equal(byUrl["/api/characters/c1"].v, 2);
  assert.deepEqual(byUrl["/api/characters/c1"].mind, MIND);
  assert.equal(byUrl["/api/characters/c9"].v, 2);
  assert.deepEqual(byUrl["/api/characters/c9"].mind, { cards: { z: 1 } });
  assert.equal(p.filter((c) => c.url === "/api/account").length, 0);
  assert.equal(sb.Save.get("dhutanga.memory"), memBefore);
  assert.equal(sb.Save.get("dhutanga.runs"), "3");
});

test("pure upgrade: copy, idempotent, never removes keys, reports steps", () => {
  const sb = makeSandbox();
  load(sb, "migrate.js");
  const M = sb.Migrate;
  assert.equal(M.CURRENT, 2);
  const input = { "dhutanga.mind": '{"cards":{}}', "dhutanga.progress": "{}", "dhutanga.history": "[]" };
  const snap = JSON.stringify(input);
  const r = M.upgrade(input);
  assert.equal(JSON.stringify(input), snap, "input not mutated");
  assert.notEqual(r.kv, input);
  assert.deepEqual([r.from, r.to, r.changed, r.future], [1, 2, true, false]);
  assert.deepEqual([...r.steps], ["1->2 stamp version"]); // sandbox arrays: copy to this realm first
  assert.equal(r.kv["dhutanga.v"], "2");
  for (const k of Object.keys(input)) assert.equal(r.kv[k], input[k]);
  const again = M.upgrade(r.kv);
  assert.equal(again.changed, false);
  assert.equal(again.steps.length, 0);
  assert.deepEqual(again.kv, r.kv);
  // account keys are never looked at or changed
  const acct = M.upgrade({ "dhutanga.memory": "[1]", "dhutanga.runs": "2" });
  assert.equal(acct.kv["dhutanga.memory"], "[1]");
  assert.equal(acct.kv["dhutanga.runs"], "2");
  // future versions are returned as they were
  const future = { "dhutanga.v": "9", "dhutanga.mind": "{}" };
  const f = M.upgrade(future);
  assert.equal(f.future, true);
  assert.equal(f.changed, false);
  assert.equal(f.kv, future);
});

test("version parsing: missing or invalid is 1", () => {
  const sb = makeSandbox();
  load(sb, "migrate.js");
  const v = sb.Migrate.version;
  assert.equal(v({}), 1);
  assert.equal(v(undefined), 1);
  assert.equal(v({ "dhutanga.v": "x" }), 1);
  assert.equal(v({ "dhutanga.v": "0" }), 1);
  assert.equal(v({ "dhutanga.v": "2" }), 2);
  assert.equal(v({ "dhutanga.v": 3 }), 3);
  assert.equal(v({ "dhutanga.v": "1.5" }), 1);
});

test("createCharacter sends data.v === Migrate.CURRENT", async () => {
  let posted;
  const sb = makeSandbox();
  sb.__route = async (c) => {
    if (c.url === "/api/me") return { status: 200, body: { user: { name: "u" }, account: {} } };
    if (c.url === "/api/characters" && c.method === "POST") { posted = c.body; return { status: 200, body: { character: { id: "n1", name: c.body.name, role: c.body.role, data: c.body.data } } }; }
    return { status: 200, body: {} };
  };
  load(sb, "migrate.js");
  load(sb, "save.js");
  await sb.Save.refresh();
  await sb.Save.createCharacter("Tên", "monk");
  assert.equal(posted.data.v, sb.Migrate.CURRENT);
  assert.equal(posted.data.v, 2);
  assert.equal(sb.Save.version(), 2);
  assert.equal(sb.Save.character().kv["dhutanga.v"], "2");
});

test("guest progress moved into an account carries v", async () => {
  let posted;
  const sb = makeSandbox();
  sb.__route = async (c) => {
    if (c.url === "/api/me") return { status: 200, body: { user: { name: "u" }, account: {} } };
    if (c.url === "/api/characters" && c.method === "POST") { posted = c.body; return { status: 200, body: { character: { id: "n", name: c.body.name, role: c.body.role, data: c.body.data } } }; }
    return { status: 200, body: {} };
  };
  load(sb, "migrate.js");
  load(sb, "save.js");
  sb.localStorage.setItem("dhutanga.mind", JSON.stringify({ cards: { a: 1 } }));
  sb.localStorage.setItem("dhutanga.progress", JSON.stringify(PROG));
  await sb.Save.refresh();
  await sb.Save.importGuest("Tên");
  assert.equal(posted.data.v, 2);
});

test("guest upgrade stamps the device copy once and is idempotent", () => {
  const sb = makeSandbox();
  load(sb, "migrate.js");
  load(sb, "save.js");
  assert.equal(sb.Save.version(), null, "no character open");
  // nothing stored: nothing stamped
  assert.equal(sb.Save.upgradeGuest(), null);
  assert.equal(sb.store.has("dhutanga.v"), false);
  sb.localStorage.setItem("dhutanga.mind", '{"cards":{"a":1}}');
  sb.localStorage.setItem("dhutanga.progress", JSON.stringify(PROG));
  const mindBefore = sb.store.get("dhutanga.mind");
  const r = sb.Save.upgradeGuest();
  assert.equal(r.changed, true);
  assert.equal(sb.store.get("dhutanga.v"), "2");
  assert.equal(sb.store.get("dhutanga.mind"), mindBefore);
  const calls = sb.calls.length;
  const again = sb.Save.upgradeGuest();
  assert.equal(again.changed, false);
  assert.equal(sb.store.get("dhutanga.v"), "2");
  assert.equal(sb.calls.length, calls);
  assert.equal(sb.Save.status(), "saved");
});
