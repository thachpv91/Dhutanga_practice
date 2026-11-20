const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { makeSandbox, load } = require("./client-harness");

const PUBLIC = path.join(__dirname, "..", "public");
const read = (f) => fs.readFileSync(path.join(PUBLIC, f), "utf8");

const PLACES = { village: { name: "Làng", x: 10, y: 20 }, graves: { name: "Nghĩa địa", x: 30, y: 40 } };
const META = [
  { id: "cho", title: "Con chó nhà ông Tư", place: "village", hint: "Ở ngõ làng.", rumour: "r1", conds: [], condText: [] },
  { id: "su_gia", title: "Vị sư già", place: "graves", hint: "Giữa mộ.", rumour: "r2", conds: [], condText: [] },
  { id: "chu_thien", title: "Chư thiên", place: "village", hint: "Ánh sáng.", rumour: "r3", conds: ["🌙", "✨"], condText: ["🌙 ban đêm", "✨ tâm sáng"] },
];

function setup() {
  const sb = makeSandbox();
  sb.World = { PLACES };
  load(sb, "book.js");
  return { sb, JB: sb.JourneyBook, V: sb.JourneyBook.views };
}
// arrays built inside the vm sandbox have another realm; compare them as plain data
const deq = (a, b) => assert.deepEqual(JSON.parse(JSON.stringify(a)), b);
const ids = (arr) => Array.from(arr, (x) => x.id);

// ---------- Nơi chốn và nhân vật ----------

test("placesView: live-like book gives seen, heard and unknown with progress", () => {
  const { V } = setup();
  const disc = { heard: { su_gia: true }, seen: { cho: 1234 }, visited: {} };
  const v = V.placesView(disc, META);
  deq(v.rows.map((r) => r.state), ["seen", "heard", "unknown"]);
  assert.equal(v.seen, 1);
  assert.equal(v.total, 3);
  assert.equal(v.rows[0].placeName, "Làng");
  assert.equal(v.rows[2].placeName, "Làng");
  deq(v.rows[2].condText, ["🌙 ban đêm", "✨ tâm sáng"]);
});

test("placesView: saved derivation is seen > heard > unknown", () => {
  const { V } = setup();
  // both seen and heard: seen wins
  assert.equal(V.stateOf({ seen: { cho: 1 }, heard: { cho: true } }, "cho"), "seen");
  // only heard
  assert.equal(V.stateOf({ seen: {}, heard: { su_gia: true } }, "su_gia"), "heard");
  // nothing recorded, or no book at all
  assert.equal(V.stateOf({ seen: {}, heard: {} }, "chu_thien"), "unknown");
  assert.equal(V.stateOf(undefined, "chu_thien"), "unknown");
  const v = V.placesView({ seen: { cho: 1 }, heard: { cho: true, su_gia: true } }, META);
  deq(v.rows.map((r) => r.state), ["seen", "heard", "unknown"]);
  assert.equal(v.seen, 1);
});

test("placesView: an empty book is all unknown and the progress is 0", () => {
  const { V } = setup();
  const v = V.placesView({ heard: {}, seen: {}, visited: {} }, META);
  assert.equal(v.seen, 0);
  assert.equal(v.total, 3);
  assert.ok(v.rows.every((r) => r.state === "unknown"));
});

// ---------- Đang theo ----------

test("closed threads come from the quest states", () => {
  const { V } = setup();
  deq(V.closedThreads({}), []);
  deq(V.closedThreads({ quest: { step: "start" }, q: {} }), []);
  deq(ids(V.closedThreads({ q: { tree: { step: "done" } } })), ["tree"]);
  deq(ids(V.closedThreads({ q: { peta: { step: "done" }, earth: { step: "done" }, cave: { step: "done" }, palace: { step: "done" } } })), ["peta", "earth", "cave", "palace"]);
  // the dog/herbs chain is done once the monk is next
  deq(ids(V.closedThreads({ quest: { step: "monk" } })), ["chain"]);
  deq(ids(V.closedThreads({ quest: { step: "deva" } })), ["chain"]);
  // not done yet: deliver / well / herb are still open
  deq(V.closedThreads({ quest: { step: "deliver" } }), []);
  deq(V.closedThreads({ q: { tree: { step: "child" } } }), []);
});

test("closed threads carry titles, one line each", () => {
  const { V } = setup();
  const [c] = V.closedThreads({ q: { tree: { step: "done" } } });
  assert.equal(c.title, "Thọ thần và bé Na");
  deq(Object.keys(c).sort(), ["id", "title"]);
});

test("open threads keep title, body and the place to walk to", () => {
  const { V } = setup();
  const out = V.openThreads([{ title: "Mang rau", body: "Ở giếng.", x: 5, y: 6, name: "Giếng" }, { title: "Hỏi thăm" }]);
  deq(out[0], { title: "Mang rau", body: "Ở giếng.", x: 5, y: 6 });
  assert.equal(out[1].body, "");
  assert.equal(out[1].x, undefined);
  deq(V.openThreads(null), []);
});

// ---------- Dòng thời gian ----------

test("timeline merges milestones and diary lines, newest first", () => {
  const { V } = setup();
  const mind = { milestones: { first_card: { at: 100, ctx: {} }, first_bad: { at: 300, ctx: { name: "Sân" } } } };
  const history = [{ at: 200, text: "giữa" }, { at: 400, text: "mới nhất" }, { at: 50, text: "cũ" }];
  const defs = [
    { id: "first_card", title: "Lần đầu", text: "Lần đầu." },
    { id: "first_bad", title: "Đã hiểu {Tên}", text: "Thấy {Tên}." },
  ];
  const t = V.timelineView(mind, history, defs);
  deq(t.items.map((i) => i.at), [400, 300, 200, 100, 50]);
  deq(t.items.map((i) => i.kind), ["diary", "milestone", "diary", "milestone", "diary"]);
  assert.equal(t.items[1].title, "Đã hiểu Sân");
  assert.equal(t.items[1].text, "Thấy Sân.");
  assert.equal(t.items[1].id, "first_bad");
});

test("a being milestone keeps the id of the portrait that opens again", () => {
  const { V } = setup();
  const defs = [{ id: "met_tho_than", title: "Gặp thọ thần", text: "Một bà cụ.", being: "tho_than" }];
  const t = V.timelineView({ milestones: { met_tho_than: { at: 5, ctx: {} } } }, [], defs);
  assert.equal(t.items[0].kind, "milestone");
  assert.equal(t.items[0].being, "tho_than");
  assert.equal(t.items[0].title, "Gặp thọ thần");
});

test("milestones are pinned: they keep their own kind, and diary lines never carry it", () => {
  const { V } = setup();
  const defs = [{ id: "m1", title: "M", text: "T" }];
  const t = V.timelineView({ milestones: { m1: { at: 10, ctx: {} } } }, [{ at: 20, text: "x" }], defs);
  assert.equal(t.items.filter((i) => i.kind === "milestone").length, 1);
  assert.equal(t.items.find((i) => i.kind === "diary").text, "x");
});

test("only the newest diary lines are kept (the last 100)", () => {
  const { V } = setup();
  const history = Array.from({ length: 150 }, (_, i) => ({ at: i + 1, text: "L" + i }));
  const t = V.timelineView({}, history, []);
  assert.equal(t.items.length, 100);
  assert.equal(t.items[0].text, "L149");
});

test("hidden milestone hint shows while a hidden milestone is unreached", () => {
  const { V } = setup();
  const defs = [{ id: "a", title: "A", text: "" }, { id: "h", title: "H", text: "", hidden: true }];
  assert.equal(V.timelineView({ milestones: { a: { at: 1, ctx: {} } } }, [], defs).hidden, true);
  assert.equal(V.timelineView({ milestones: { a: { at: 1, ctx: {} }, h: { at: 2, ctx: {} } } }, [], defs).hidden, false);
  assert.equal(V.timelineView({}, [], [{ id: "a", title: "A", text: "" }]).hidden, false);
});

test("empty timeline has no items", () => {
  const { V } = setup();
  const t = V.timelineView({}, [], [{ id: "a", title: "A", text: "" }]);
  deq(t.items, []);
  assert.equal(t.hidden, false);
});

// ---------- empty states and copy ----------

test("empty states read in friendly Vietnamese, one line each", () => {
  const { JB } = setup();
  assert.equal(JB.EMPTY.threads, "Chưa có chuyện nào đang theo. Cứ đi dạo, chuyện sẽ tìm đến.");
  assert.equal(JB.EMPTY.learned, "Chưa có bài học nào. Đọc một đoạn kinh ở tịnh thất sẽ có mục đầu tiên.");
  assert.equal(JB.EMPTY.hidden, "Còn những dấu mốc chưa lộ diện.");
  deq(JB.SECTIONS.map(([, n]) => n), ["Nơi chốn và nhân vật", "Đang theo", "Đã học", "Dòng thời gian"]);
});

test("the book module reads no globals at load and has no innerHTML", () => {
  const src = read("book.js");
  assert.equal(/innerHTML/.test(src), false);
});

// ---------- Discover.meta (real encounters.js with a stub Mind.kit) ----------

test("Discover.meta lists the entries without functions and with condition labels", () => {
  const sb = makeSandbox();
  const S = { q: {}, items: [], disc: undefined, quest: { step: "start" } };
  sb.Mind = { register() {}, kit: { S, api: () => null, role: () => null, save: () => {} } };
  sb.setInterval = () => 0;
  load(sb, "encounters.js");
  const meta = sb.Discover.meta();
  assert.equal(meta.length, 12);
  assert.equal(meta[0].id, "cho");
  assert.equal(meta.every((e) => !Object.keys(e).some((k) => typeof e[k] === "function")), true);
  const chu = meta.find((e) => e.id === "chu_thien");
  deq(chu.condText, ["🌙 ban đêm", "✨ tâm sáng"]);
  assert.equal(chu.place, "hermitage");
});

// ---------- profile tabs and the album ----------

test("profile tabs: Tổng quan · Hành trình · Người quen; guests have no Người quen", () => {
  const sb = makeSandbox();
  load(sb, "profile.js");
  deq(sb.Profile.tabsFor("guest"), [["overview", "Tổng quan"], ["journey", "Hành trình"]]);
  deq(sb.Profile.tabsFor("c1").map(([k, n]) => n), ["Tổng quan", "Hành trình", "Người quen"]);
});

test("profile.js no longer has the Dấu mốc or Nhật ký tabs", () => {
  const src = read("profile.js");
  assert.equal(/Dấu mốc|Nhật ký|"milestones"|"diary"|milestoneSection|diarySection/.test(src), false);
  assert.ok(src.includes("JourneyBook.render"));
});

test("the album has no Nhật ký tab; cards and bag stay", () => {
  const mind = read("mind.js");
  const album = mind.slice(mind.indexOf("function openAlbum"), mind.indexOf("// ---------- public ----------"));
  assert.equal(/Nhật ký|"log"/.test(album), false);
  assert.ok(album.includes('["cards", "Thẻ tâm sở"]') && album.includes('"bag"'));
});

test("the quest panel tab is the Sổ Hành Trình and it renders the shared book", () => {
  const html = read("index.html");
  assert.ok(html.includes("Sổ Hành Trình"));
  assert.equal(html.includes("Sổ khám phá"), false);
  assert.ok(html.indexOf('src="book.js"') > html.indexOf('src="encounters.js"'));
  assert.ok(html.indexOf('src="book.js"') < html.indexOf('src="app.js"'));
  assert.ok(read("app.js").includes('JourneyBook.render($("quest-book")'));
});
