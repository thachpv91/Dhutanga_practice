const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const S = () => load(makeSandbox(), "social.js").Social;
// values built inside the vm sandbox have another Array prototype; copy them out before deep comparison
const plain = (v) => JSON.parse(JSON.stringify(v));

test("fmtDate gives dd/mm/yyyy and empty for a bad date", () => {
  const s = S();
  assert.equal(s.fmtDate(new Date(2026, 0, 5).toISOString()), "05/01/2026");
  assert.equal(s.fmtDate(new Date(2024, 10, 30, 12).toISOString()), "30/11/2024");
  assert.equal(s.fmtDate("not a date"), "");
});

test("ago uses the age bands and says 'vừa xong' under a minute", () => {
  const s = S();
  const now = Date.parse("2026-06-10T12:00:00Z");
  const at = (ms) => new Date(now - ms).toISOString();
  assert.equal(s.ago(at(20000), now), "vừa xong");
  assert.equal(s.ago(at(5 * 60000), now), "5 phút trước");
  assert.equal(s.ago(at(3 * 3600000), now), "3 giờ trước");
  assert.equal(s.ago(at(2 * 86400000), now), "2 ngày trước");
  assert.equal(s.ago(null, now), "");
  assert.equal(s.ago("nope", now), "");
});

test("profileView: lines, carita and items; unknown items skipped, at most 6 kept", () => {
  const s = S();
  const defs = { a: { name: "A" }, b: { name: "B" }, c: { name: "C" }, d: { name: "D" }, e: { name: "E" }, f: { name: "F" }, g: { name: "G" } };
  const opts = { defOf: (id) => (defs[id] ? { id, ...defs[id] } : null), caritaName: (k) => (k === "tham" ? "Tham" : "") };
  const view = s.profileView({
    name: "Hạnh", role: "villager", createdAt: new Date(2026, 2, 9).toISOString(), carita: "tham",
    items: ["zz", "a", "b", "c", "d", "e", "f", "g"],
  }, opts);
  assert.equal(view.hidden, false);
  assert.deepEqual(plain(view.lines), ["Chơi từ ngày 09/03/2026.", "Người này thiên về tính Tham."]);
  assert.deepEqual(plain(view.items), ["A", "B", "C", "D", "E", "F"]);
});

test("profileView: an unknown carita adds no line; a missing profile gives null", () => {
  const s = S();
  const view = s.profileView({ name: "x", role: "villager", carita: "lạ", items: [] }, { defOf: () => null, caritaName: () => "" });
  assert.deepEqual(plain(view.lines), []);
  assert.equal(s.profileView(null), null);
});

test("profileView: a hidden profile gives only the gentle line", () => {
  const s = S();
  const view = s.profileView({ hidden: true, name: "x", role: "villager" }, { defOf: () => ({ name: "A" }), caritaName: () => "Tham" });
  assert.equal(view.hidden, true);
  assert.deepEqual(plain(view.lines), ["Người này giữ kín hồ sơ."]);
  assert.deepEqual(plain(view.items), []);
});

test("encounterRows: drops rows without a handle, labels last meeting and count, marks hidden profiles", () => {
  const s = S();
  const now = Date.parse("2026-06-10T12:00:00Z");
  const rows = s.encounterRows([
    { handle: "h1aaaaaa", name: "Ana", role: "monk", hidden: false, lastAt: new Date(now - 20000).toISOString(), count: 3 },
    { handle: null, name: "Ghost", role: "monk", lastAt: new Date(now).toISOString(), count: 1 },
    { handle: "h2bbbbbb", name: "Bình", role: "villager", hidden: true, lastAt: new Date(now - 2 * 3600000).toISOString(), count: 1 },
  ], { now, roleName: (r) => (r === "monk" ? "Sư" : "Dân làng") });
  assert.equal(rows.length, 2);
  assert.deepEqual(plain(rows[0]), { handle: "h1aaaaaa", name: "Ana", role: "monk", roleName: "Sư", hidden: false, lastText: "vừa gặp", countText: "3 lần" });
  assert.equal(rows[1].hidden, true);
  assert.equal(rows[1].lastText, "gặp lần cuối 2 giờ trước");
  assert.equal(rows[1].roleName, "Dân làng");
  assert.deepEqual(plain(s.encounterRows(null)), []);
});

test("fetchPublic caches a profile for a minute, maps 404 to null, and does not cache failures", async () => {
  const sb = makeSandbox();
  load(sb, "social.js");
  const S2 = sb.Social;
  let n = 0, mode = "ok";
  sb.__route = async (call) => {
    n++;
    if (mode === "404") return { status: 404, body: { error: "not found" } };
    if (mode === "500") return { status: 500, body: { error: "server error" } };
    return { status: 200, body: { name: "Ana", role: "monk", items: [] } };
  };
  assert.equal((await S2.fetchPublic("h1aaaaaa")).name, "Ana");
  await S2.fetchPublic("h1aaaaaa");
  assert.equal(n, 1);
  mode = "404";
  assert.equal(await S2.fetchPublic("h9zzzzzz"), null);
  mode = "500";
  await assert.rejects(S2.fetchPublic("h8yyyyyy"));
  mode = "ok";
  await S2.fetchPublic("h8yyyyyy");
  assert.equal(n, 4);
});

test("a player picked on the map keeps its handle (guests have none)", () => {
  const sb = makeSandbox();
  load(sb, "world.js");
  const w = sb.World;
  w.setOthers([
    { pid: "p1", x: 0.5, y: 0.5, role: "villager", nick: "Ana", pose: null, mood: 0.5, handle: "h1aaaaaa" },
    { pid: "p2", x: 0.2, y: 0.2, role: "villager", nick: "Khách", pose: null, mood: 0.5, handle: null },
  ]);
  const hit = w.pick(0.5 * w.W, 0.5 * w.H - 22);
  assert.equal(hit.kind, "player");
  assert.equal(hit.handle, "h1aaaaaa");
  const guest = w.pick(0.2 * w.W, 0.2 * w.H - 22);
  assert.equal(guest.kind, "player");
  assert.equal(guest.handle, null);
});

test("profileView: an archived character gets the 'đã khép' line; an active one does not", () => {
  const s = S();
  const opts = { defOf: () => null, caritaName: () => "" };
  const arch = s.profileView({ name: "x", role: "monk", archived: true, items: [] }, opts);
  assert.ok(plain(arch.lines).includes("Chuyện của nhân vật này đã khép."));
  const live = s.profileView({ name: "x", role: "monk", items: [] }, opts);
  assert.ok(!plain(live.lines).includes("Chuyện của nhân vật này đã khép."));
});
