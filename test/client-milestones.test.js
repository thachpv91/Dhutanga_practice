const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const CARDS = {
  san: { name: "Sân", good: false }, hoi_han: { name: "Hối hận", good: false },
  tham: { name: "Tham", good: false }, bon_xen: { name: "Bỏn xẻn", good: false },
  khong_san: { name: "Không sân", good: true }, niem: { name: "Niệm", good: true },
};
function setup() {
  const sb = makeSandbox();
  const box = { cur: { got: {}, counts: {}, save() { this.saved = (this.saved || 0) + 1; } } };
  sb.Mind = { isOpen: () => false, parts: { CARDS, milestoneState: () => box.cur } };
  load(sb, "milestones.js");
  const shown = [];
  sb.Milestones.ui = { show: (item, done) => { shown.push(item.id); done && done(); } };
  return { sb, M: sb.Milestones, box, shown };
}
const ids = (arr) => Array.from(arr, (m) => m.id);
const empty = (arr) => assert.equal(arr.length, 0);

test("first card bad: first_card + first_bad, none repeated by second card", () => {
  const { M } = setup();
  const a = M.notify("card", { id: "san", n: 1, good: false, understood: false }, { quiet: true });
  assert.deepEqual(ids(a), ["first_card", "first_bad"]);
  assert.match(a[1].text, /Thấy được Sân\./);
  const b = M.notify("card", { id: "tham", n: 1, good: false, understood: false }, { quiet: true });
  empty(b);
  const c = M.notify("card", { id: "niem", n: 1, good: true, understood: false }, { quiet: true });
  assert.deepEqual(ids(c), ["first_good"]);
  assert.match(c[0].text, /Niệm/);
});

test("an annasamana card gives first_card only", () => {
  const sb = makeSandbox();
  const box = { cur: { got: {}, counts: {}, save() {} } };
  sb.Mind = { isOpen: () => false, parts: { CARDS: { hy: { name: "Hỷ", good: true, ethics: "annasamana" }, si: { name: "Si", good: false } }, milestoneState: () => box.cur } };
  load(sb, "milestones.js");
  const M = sb.Milestones;
  assert.deepEqual(ids(M.notify("card", { id: "hy", n: 1, good: true, ethics: "annasamana" }, { quiet: true })), ["first_card"]);
  for (const id of ["understood_si", "understood_phong_dat", "understood_hon_tram", "understood_hoai_nghi"]) {
    assert.equal(M.defs.find((d) => d.id === id).title, "Đã xem đủ các mặt thẻ {Tên}", id);
  }
});

test("first card good gives first_card + first_good", () => {
  const { M } = setup();
  assert.deepEqual(ids(M.notify("card", { id: "niem", n: 1, good: true }, { quiet: true })), ["first_card", "first_good"]);
});

test("bad card understood gives understood_<id> once", () => {
  const { M } = setup();
  M.notify("card", { id: "san", n: 1, good: false }, { quiet: true });
  empty(M.notify("card", { id: "san", n: 2, good: false, understood: false }, { quiet: true }));
  const r = M.notify("card", { id: "san", n: 3, good: false, understood: true }, { quiet: true });
  assert.deepEqual(ids(r), ["understood_san"]);
  assert.equal(r[0].title, "Đã xem đủ các mặt thẻ Sân");
  assert.match(r[0].text, /Tình huống đã gặp vẫn còn để đọc lại/);
  empty(M.notify("card", { id: "san", n: 3, good: false, understood: true }, { quiet: true }));
});

test("nights count cumulatively: 1, 7, 30, 100, no duplicates", () => {
  const { M } = setup();
  const got = [];
  for (let d = 1; d <= 101; d++) got.push(...ids(M.notify("night", { day: d, role: "monk" }, { quiet: true })));
  assert.deepEqual(got, ["night_1", "night_7", "night_30", "night_100"]);
  assert.equal(M.notify("night", { day: 102 }, { quiet: true }).length, 0);
});

test("meeting a being records that milestone once, with the portrait id", () => {
  const { M } = setup();
  const a = M.notify("being", { id: "met_tho_than" }, { quiet: true });
  assert.deepEqual(ids(a), ["met_tho_than"]);
  assert.equal(a[0].title, "Gặp thọ thần");
  assert.equal(a[0].being, "tho_than");
  empty(M.notify("being", { id: "met_tho_than" }, { quiet: true }));
});

test("dedicate once", () => {
  const { M } = setup();
  assert.deepEqual(ids(M.notify("dedicate", {}, { quiet: true })), ["first_dedicate"]);
  empty(M.notify("dedicate", {}, { quiet: true }));
});

test("hidden milestones are absent from list until reached", () => {
  const { M } = setup();
  assert.equal(M.list().length, 0);
  M.notify("deva", {}, { quiet: true });
  M.notify("cave", {}, { quiet: true });
  M.notify("palace", { outcome: "fade" }, { quiet: true });
  assert.deepEqual(ids(M.list()), ["first_deva", "cave_found"]);
  assert.ok(M.list().every((m) => m.hidden));
  M.notify("palace", { outcome: "stay" }, { quiet: true });
  assert.equal(M.has("palace_stay"), true);
  assert.equal(M.has("night_1"), false);
  assert.ok(M.defs.some((d) => d.id === "palace_stay" && d.hidden));
});

test("since(ts) filters by time, list oldest first", () => {
  const { M, box } = setup();
  M.notify("dedicate", {}, { quiet: true });
  box.cur.got.first_dedicate.at = 1000;
  M.notify("deva", {}, { quiet: true });
  box.cur.got.first_deva.at = 5000;
  assert.deepEqual(ids(M.list()), ["first_dedicate", "first_deva"]);
  assert.deepEqual(ids(M.since(2000)), ["first_deva"]);
  assert.deepEqual(ids(M.since(1000)), ["first_dedicate", "first_deva"]);
});

test("quiet records without reveal; non-quiet reveals; state is saved", () => {
  const { M, shown, box } = setup();
  M.notify("dedicate", {}, { quiet: true });
  assert.equal(shown.length, 0);
  const r = M.notify("deva", {});
  assert.equal(r.length, 1);
  assert.deepEqual(shown, ["first_deva"]);
  assert.ok(box.cur.saved >= 2);
});

test("state is read from Mind each call (survives Mind.reload swapping the object)", () => {
  const { M, box } = setup();
  M.notify("dedicate", {}, { quiet: true });
  assert.equal(M.has("first_dedicate"), true);
  box.cur = { got: {}, counts: {}, save() {} };
  assert.equal(M.has("first_dedicate"), false);
  assert.deepEqual(ids(M.notify("dedicate", {}, { quiet: true })), ["first_dedicate"]);
  box.cur = { got: { night_1: { at: 1, ctx: {} } }, counts: { nights: 6 }, save() {} };
  assert.deepEqual(ids(M.notify("night", { day: 7 }, { quiet: true })), ["night_7"]);
});

test("reveal queues while a popup is open, then shows in sequence", async () => {
  const { sb, M, shown } = setup();
  let open = true;
  sb.Mind.isOpen = () => open;
  M.notify("card", { id: "san", n: 1, good: false }, {});
  assert.equal(shown.length, 0);
  open = false;
  await sb.advance(2000);
  assert.deepEqual(shown, ["first_card", "first_bad"]);
});

test("backfill gives existing players the card milestones they already earned, quietly", () => {
  const { M, shown } = setup();
  const got = M.backfill({ bon_xen: { n: 1 }, niem: { n: 2 }, san: { n: 5 } });
  assert.deepEqual(ids(got).sort(), ["first_bad", "first_card", "first_good", "understood_san"].sort());
  empty(shown);
  empty(M.backfill({ bon_xen: { n: 1 }, niem: { n: 2 }, san: { n: 5 } }));
});

test("backfill with no cards records nothing", () => {
  const { M } = setup();
  empty(M.backfill({}));
  empty(M.backfill(null));
});

test("promise_kept and want_more are hidden defs", () => {
  const { M } = setup();
  for (const id of ["promise_kept", "want_more"]) {
    const d = M.defs.find((x) => x.id === id);
    assert.ok(d && d.hidden, id);
  }
});

test("promise_kept fires once, with its own title", () => {
  const { M } = setup();
  const a = M.notify("promise", {}, { quiet: true });
  assert.deepEqual(ids(a), ["promise_kept"]);
  assert.equal(a[0].title, "Lời hẹn đã đến");
  assert.match(a[0].text, /hôm qua/);
  empty(M.notify("promise", {}, { quiet: true }));
});

test("want_more fires on the 3rd new night in a session, once, and is not saved as a counter", () => {
  const { M, box } = setup();
  empty(M.notify("newnight", {}, { quiet: true }));
  empty(M.notify("newnight", {}, { quiet: true }));
  const a = M.notify("newnight", {}, { quiet: true });
  assert.deepEqual(ids(a), ["want_more"]);
  assert.equal(a[0].title, "Muốn chơi thêm");
  assert.match(a[0].text, /Tham/);
  empty(M.notify("newnight", {}, { quiet: true }));
  assert.equal(box.cur.counts.newnight, undefined);
  assert.equal(Object.keys(box.cur.counts).length, 0);
});
