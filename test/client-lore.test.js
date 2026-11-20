const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { makeSandbox, load } = require("./client-harness");

const PUBLIC = path.join(__dirname, "..", "public");
const read = (f) => fs.readFileSync(path.join(PUBLIC, f), "utf8");
const LORE = () => JSON.parse(JSON.stringify(load(makeSandbox(), "cetasika.js").Cetasika.LORE));

test("one short invitation line says a thẻ is a tâm sở, with no jargon beyond that", () => {
  const L = LORE();
  assert.equal(L.intro, "Mỗi thẻ là một yếu tố của tâm (tâm sở). Thu thập thẻ để mở ra những tầng truyện và thử thách mới. Thẻ cũng giúp nhân vật tu tập, từng chút thay đổi chỉ số tâm. Còn nhiều thẻ đang chờ bạn tìm ra.");
  assert.equal(L.linkLabel, "Tâm sở là gì?");
});

test("ghost intro is its own line: no stories and no stat changes promised; the other intro is unchanged", () => {
  const L = LORE();
  assert.equal(L.introGhost, "Mỗi thẻ là một yếu tố của tâm (tâm sở). Mỗi lần nhận ra một thẻ, thế giới hiện thêm một mặt của tâm. Còn nhiều thẻ đang chờ bạn tìm ra.");
  assert.equal(/truyện|chỉ số|tu tập|thử thách/iu.test(L.introGhost), false);
  assert.notEqual(L.introGhost, L.intro);
  const mind = read("mind.js");
  assert.ok(mind.includes('r === "ghost" ? L.introGhost : L.intro'));
});

test("the tooltip has two paragraphs: tâm sở, then tâm (owner-approved text)", () => {
  const ps = LORE().paragraphs;
  assert.deepEqual(ps.map((p) => p.lead), ["Tâm sở", "Tâm"]);
  assert.deepEqual(ps.map((p) => p.lead + p.rest), [
    "Tâm sở — những yếu tố nhỏ đi cùng tâm trong từng khoảnh khắc: thương, giận, nhớ, vui… Có cái làm lòng nặng và rối, có cái làm lòng nhẹ và sáng.",
    "Tâm — sự nhận thức, cái biết: biết thấy, nghe, nghĩ, cảm khi một điều gì đó đến với mình.",
  ]);
});

test("the explanation copy is plain text: no markup in the constants", () => {
  const L = LORE();
  const all = [L.intro, L.linkLabel, ...L.paragraphs.flatMap((p) => [p.lead, p.rest])].join(" ");
  assert.equal(/[<>]/.test(all), false);
});

test("headings: 'Tâm đang tu' / 'Tâm đã hiểu' for the card sections, mind headings untouched", () => {
  const mind = read("mind.js");
  assert.ok(mind.includes('title: "Tâm đang tu"'));
  assert.ok(mind.includes('title: "Tâm đã hiểu"'));
  for (const f of ["mind.js", "profile.js", "cetasika.js", "index.html"]) assert.equal(/Thẻ đang tu|Thẻ đã hiểu|Thẻ để hiểu/.test(read(f)), false, f);
  assert.ok(read("profile.js").includes('section("Chỉ số tâm")'));
  assert.ok(read("profile.js").includes('section("Tâm lúc này")'));
});

test("there is no more 'i' button or explanation sheet; the text sits inside the catalog popup", () => {
  const mind = read("mind.js");
  assert.equal(/openLore|infoButton|withInfo/.test(mind + read("profile.js")), false);
  assert.ok(mind.includes("catalog-tip") && mind.includes("catalog-what"));
  assert.equal(/innerHTML/.test(mind.slice(mind.indexOf("function openCatalog"), mind.indexOf("function catalogGroup"))), false);
});

test("popup group titles describe the tâm ('Các tâm …'), and the tooltip link is switched off for now", () => {
  const L = load(makeSandbox(), "cetasika.js").Cetasika;
  assert.equal(L.LORE.showTip, false);
  const src = read("cetasika.js");
  assert.ok(src.includes('"Các tâm làm lòng nặng và rối"'));
  assert.equal(/Các thẻ /.test(src), false);
});
