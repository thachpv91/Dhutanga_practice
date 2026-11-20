const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const C = () => load(makeSandbox(), "cetasika.js").Cetasika;
const GAME_IDS = ["san", "hoi_han", "tham", "khong_san", "khong_tham", "niem", "hy", "bon_xen", "bi", "tuy_hy"];
const by = (c, name) => c.all.find((e) => e.name === name);
const count = (c, f) => c.all.filter(f).length;

test("52 entries with unique ids", () => {
  const c = C();
  assert.equal(c.all.length, 52);
  assert.equal(new Set(c.all.map((e) => e.id)).size, 52);
});

test("group and part counts follow the chart", () => {
  const c = C();
  const g = (k) => count(c, (e) => e.group === k);
  assert.deepEqual([g("bien_hanh"), g("biet_canh"), g("bat_thien"), g("tinh_hao")], [7, 6, 14, 25]);
  const p = (grp, k) => count(c, (e) => e.group === grp && e.part === k);
  assert.deepEqual(["si", "tham", "san", "hon", "nghi"].map((k) => p("bat_thien", k)), [4, 3, 4, 2, 1]);
  assert.deepEqual(["bien_hanh", "gioi", "vo_luong", "tue"].map((k) => p("tinh_hao", k)), [19, 3, 2, 1]);
});

test("feeling colours follow the chart legend", () => {
  const f = C().FEELINGS;
  assert.equal(f.hy.color, "#f39cc2", "thọ hỷ / vui is pink, not red");
  assert.equal(f.xa.color, "#00afef");
  assert.equal(f.uu.color, "#f48635");
  assert.equal(f.kho.color, "#96989b");
  assert.equal(f.lac.color, "#ed3338", "red is thọ lạc");
});

test("feelings per rule", () => {
  const c = C();
  assert.deepEqual([...by(c, "Sân").feelings], ["uu"]);
  assert.deepEqual([...by(c, "Hoài nghi").feelings], ["xa"]);
  assert.deepEqual([...by(c, "Hỷ").feelings], ["hy"]);
  assert.deepEqual([...by(c, "Xúc").feelings], ["hy", "xa", "uu", "kho", "lac"]);
  assert.deepEqual([...by(c, "Tầm").feelings], ["hy", "xa", "uu"]);
  assert.deepEqual([...by(c, "Tham").feelings], ["hy", "xa"]);
  assert.deepEqual([...by(c, "Bi").feelings], ["hy", "xa"]);
  assert.deepEqual([...by(c, "Hôn trầm").feelings], ["hy", "xa", "uu"]);
});

test("biệt cảnh chart order", () => {
  const c = C();
  assert.deepEqual(Array.from(c.all.filter((e) => e.group === "biet_canh"), (e) => e.name), ["Tầm", "Tứ", "Thắng giải", "Cần", "Hỷ", "Dục"]);
});

test("every game card id maps to an entry", () => {
  const c = C();
  for (const id of GAME_IDS) assert.ok(c.byGame(id), id);
  assert.equal(c.byGame("san").name, "Sân");
  assert.equal(c.byGame("bon_xen").name, "Lận");
  assert.equal(c.byGame("khong_san").name, "Vô sân");
  assert.equal(c.byGame("tuy_hy").name, "Tùy hỷ");
});

test("token draws one arc per feeling, dashed when unlit", () => {
  const c = C();
  const arcs = (s) => (s.match(/class="cz-arc/g) || []).length;
  const xuc = c.token(by(c, "Xúc"), { size: 96, lit: true });
  assert.match(xuc, /^<svg/);
  assert.equal(arcs(xuc), 5);
  assert.equal(arcs(c.token("san", { size: 96 })), 1);
  assert.equal(arcs(c.token(by(c, "Tham"), { size: 96 })), 2);
  const off = c.token(by(c, "Xúc"), { size: 96, lit: false });
  assert.equal(arcs(off), 0);
  assert.match(off, /stroke-dasharray/);
  assert.match(off, /\?/);
  assert.ok(!/>Xúc</.test(c.token(by(c, "Xúc"), { size: 30 })), "no text under 40");
});

test("groups() keeps chart order", () => {
  const c = C();
  const g = c.groups();
  assert.deepEqual(Array.from(g, (x) => x.key), ["bien_hanh", "biet_canh", "bat_thien", "tinh_hao"]);
  assert.deepEqual(Array.from(g[2].parts, (p) => p.key), ["si", "tham", "san", "hon", "nghi"]);
  assert.deepEqual(Array.from(g[3].parts, (p) => p.items.length), [19, 3, 2, 1]);
  assert.equal(g[0].parts.length, 1);
  assert.equal(g[0].parts[0].items[0].name, "Xúc");
});

test("faint unlit token keeps the chart's feeling colours, dimmed, with no question mark", () => {
  const C = load(makeSandbox(), "cetasika.js").Cetasika;
  const svg = C.token(C.byName("Sân"), { size: 40, lit: false, faint: true });
  assert.match(svg, /cz-faint/);
  assert.match(svg, /cz-uu/);
  assert.doesNotMatch(svg, />\?</);
  assert.doesNotMatch(C.token(C.byName("Sân"), { size: 40, lit: false }), /cz-uu/);
});
