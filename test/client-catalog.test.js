const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const C = () => load(makeSandbox(), "cetasika.js").Cetasika;
// Card names and "where" hints as in public/mind.js CARDS (the in-game ones).
const CARDS = {
  san: { name: "Sân", good: false, where: "Có lẽ gặp ở ngõ làng." },
  hoi_han: { name: "Hối hận", good: false, where: "Có lẽ gặp sau một lúc nóng giận." },
  tham: { name: "Tham", good: false, where: "Có lẽ gặp khi có thứ ngon trong tay." },
  bon_xen: { name: "Bỏn xẻn", good: false, where: "Có lẽ gặp ở nghĩa địa, nơi có người đói lâu năm." },
  khong_san: { name: "Không sân", good: true, where: "Có lẽ gặp khi làm lành với ai đó." },
  khong_tham: { name: "Không tham", good: true, where: "Có lẽ gặp khi đem thứ gì đó cho người khác." },
  niem: { name: "Niệm", good: true, where: "Có lẽ gặp khi ngồi yên với một vị sư." },
  hy: { name: "Hỷ", good: true, where: "Có lẽ gặp vào một đêm rất đẹp." },
  bi: { name: "Bi", good: true, where: "Có lẽ gặp khi có ai đó đang khóc." },
  tuy_hy: { name: "Tùy hỷ", good: true, where: "Có lẽ gặp ở nơi rất xa, rất sáng." },
};
const tiles = (v) => v.groups.flatMap((g) => g.tiles);
const plain = (x) => JSON.parse(JSON.stringify(x));
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Whole-word match for a name (Vietnamese letters count as word characters).
const mentions = (text, name) => new RegExp(`(?<!\\p{L})${escRe(name)}(?!\\p{L})`, "iu").test(text);

// N = number of cards that exist in the game (mapped to a cetasika); the rest of the 52 are locked.
const N = C().GAME_IDS.length;

test(`empty collection: 0/52, the ${N} in-game cards are hints, the other ${52 - N} locked`, () => {
  const c = C();
  const v = plain(c.catalog({ owned: {}, cards: CARDS }));
  assert.equal(v.met, 0);
  assert.equal(v.total, 52);
  const ts = tiles(v);
  assert.equal(ts.length, 52);
  assert.equal(ts.filter((t) => t.state === "hint").length, N);
  assert.equal(ts.filter((t) => t.state === "locked").length, 52 - N);
  assert.equal(ts.filter((t) => t.state === "owned").length, 0);
});

test("owned cards become named tiles with a count, and count toward met", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { san: { n: 2 }, bi: { n: 1 } }, cards: CARDS }));
  assert.equal(v.met, 2);
  const owned = tiles(v).filter((t) => t.state === "owned");
  assert.deepEqual(owned.map((t) => [t.game, t.name, t.sub]).sort(), [
    ["bi", "Bi", "gặp 1 lần"],
    ["san", "Sân", "gặp 2 lần"],
  ]);
  assert.equal(owned.find((t) => t.game === "san").good, false);
});

test("the count function is applied to owned cards (e.g. capped bad cards)", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { san: { n: 9 } }, cards: CARDS, count: () => 3 }));
  assert.equal(tiles(v).find((t) => t.state === "owned").sub, "gặp 3 lần");
});

test("unmet tiles never contain the real name, id or card name", () => {
  const c = C();
  const owned = { san: { n: 1 }, niem: { n: 4 } };
  const v = plain(c.catalog({ owned, cards: CARDS }));
  const unmet = tiles(v).filter((t) => t.state !== "owned");
  assert.ok(unmet.length > 0);
  const names = [...c.all.map((e) => e.name), ...Object.values(CARDS).map((d) => d.name)];
  // the traditional group and sub-group titles must not show on unmet tiles either
  const partTitles = ["Si phần", "Tham phần", "Sân phần", "Hôn phần", "Nghi phần", "Giới phần", "Vô lượng phần", "Tịnh hảo biến hành"];
  for (const t of unmet) {
    assert.equal("name" in t, false);
    assert.equal("id" in t, false);
    assert.equal("game" in t, false);
    const text = JSON.stringify(t);
    for (const n of [...names, ...partTitles]) assert.equal(mentions(text, n), false, `"${n}" leaked in ${text}`);
  }
});

test("unmet in-game tiles show the card's where-hint; locked ones have no text at all", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { san: { n: 1 } }, cards: CARDS }));
  const hints = tiles(v).filter((t) => t.state === "hint").map((t) => t.hint);
  assert.equal(hints.length, N - 1);
  assert.ok(hints.includes("Có lẽ gặp khi ngồi yên với một vị sư."));
  const locked = tiles(v).filter((t) => t.state === "locked");
  assert.equal(locked.length, 52 - N);
  assert.ok(locked.every((t) => !("sub" in t) && !("hint" in t) && !("name" in t)));
});

test("compact flag: owned and in-game hint tiles are large, locked tiles are compact", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { san: { n: 1 } }, cards: CARDS }));
  assert.ok(tiles(v).filter((t) => t.state !== "locked").every((t) => t.compact === false));
  assert.ok(tiles(v).filter((t) => t.state === "locked").every((t) => t.compact === true));
});

test("within a group the large tiles come first, then the compact locked ones", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { bi: { n: 1 } }, cards: CARDS }));
  for (const g of v.groups) {
    const flags = g.tiles.map((t) => t.compact);
    const firstCompact = flags.indexOf(true);
    if (firstCompact >= 0) assert.ok(flags.slice(firstCompact).every(Boolean), g.key);
  }
});

test("groups keep chart order, plain titles and counts; every group opens by default", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { bi: { n: 1 }, tuy_hy: { n: 1 } }, cards: CARDS }));
  assert.deepEqual(v.groups.map((g) => g.key), ["bien_hanh", "biet_canh", "bat_thien", "tinh_hao"]);
  assert.deepEqual(v.groups.map((g) => g.total), [7, 6, 14, 25]);
  assert.deepEqual(v.groups.map((g) => g.met), [0, 0, 0, 2]);
  assert.deepEqual(v.groups.map((g) => g.open), [true, true, true, true]);
  assert.deepEqual(v.groups.map((g) => g.title), [
    "Các tâm có mặt trong mọi khoảnh khắc",
    "Các tâm đến tùy lúc, tùy việc đang làm",
    "Các tâm làm lòng nặng và rối",
    "Các tâm tốt đẹp, làm lòng nhẹ và sáng",
  ]);
  assert.ok(v.groups.every((g) => g.hint.length > 0));
  assert.equal("parts" in v.groups[2], false);
});

test("popup copy never uses the words 'tâm sở'", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { san: { n: 1 } }, cards: CARDS }));
  for (const g of v.groups) assert.equal(/tâm sở/iu.test(g.title + " " + g.hint), false, g.key);
  assert.equal(/tâm sở/iu.test(JSON.stringify(v.groups.map((g) => g.hint))), false);
});

test("owned tile keeps the cetasika id and the card's good flag", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { khong_san: { n: 1 } }, cards: CARDS }));
  const t = tiles(v).find((x) => x.state === "owned");
  assert.equal(t.id, c.byGame("khong_san").id);
  assert.equal(t.good, true);
});

test("a card that is not in cards is still shown as hint without a hint text", () => {
  const c = C();
  const v = plain(c.catalog({ owned: {}, cards: {} }));
  const hints = tiles(v).filter((t) => t.state === "hint");
  assert.equal(hints.length, N);
  assert.ok(hints.every((t) => t.hint === ""));
});

// Cards for every in-game id, so the ghost tests can check the hint text of niem and dinh too.
const ALL_CARDS = { ...CARDS, dinh: { name: "Nhất hành", good: false, where: "Có lẽ gặp ở bến nước đầu làng." } };

test("role monk, villager and undefined give the same view", () => {
  const c = C();
  const owned = { san: { n: 2 }, niem: { n: 1 } };
  const generic = plain(c.catalog({ owned, cards: ALL_CARDS }));
  assert.deepEqual(plain(c.catalog({ owned, cards: ALL_CARDS, role: "monk" })), generic);
  assert.deepEqual(plain(c.catalog({ owned, cards: ALL_CARDS, role: "villager" })), generic);
  assert.equal(generic.met, 2);
  assert.equal(tiles(generic).filter((t) => t.state === "hint").length, N - 2); // san and niem are owned
});

test("role ghost: niem and dinh are locked (no hint, not counted), the rest unchanged", () => {
  const c = C();
  const v = plain(c.catalog({ owned: {}, cards: ALL_CARDS, role: "ghost" }));
  assert.equal(v.total, 52);
  const ts = tiles(v);
  assert.equal(ts.filter((t) => t.state === "hint").length, N - 2);
  assert.equal(ts.filter((t) => t.state === "locked").length, 52 - N + 2);
  const hintTexts = ts.filter((t) => t.state === "hint").map((t) => t.hint);
  assert.equal(hintTexts.includes(ALL_CARDS.niem.where), false);
  assert.equal(hintTexts.includes(ALL_CARDS.dinh.where), false);
  assert.ok(hintTexts.includes(ALL_CARDS.hy.where));
});

test("role ghost: a saved niem or dinh does not show as owned or count toward met", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { niem: { n: 3 }, dinh: { n: 1 } }, cards: ALL_CARDS, role: "ghost" }));
  assert.equal(v.met, 0);
  assert.equal(tiles(v).filter((t) => t.state === "owned").length, 0);
});

test("role ghost: unmet tiles still never contain a real name, id or card name", () => {
  const c = C();
  const v = plain(c.catalog({ owned: { san: { n: 1 }, niem: { n: 4 } }, cards: ALL_CARDS, role: "ghost" }));
  const unmet = tiles(v).filter((t) => t.state !== "owned");
  assert.ok(unmet.length > 0);
  const names = [...c.all.map((e) => e.name), ...Object.values(ALL_CARDS).map((d) => d.name)];
  for (const t of unmet) {
    assert.equal("name" in t, false);
    assert.equal("id" in t, false);
    assert.equal("game" in t, false);
    const text = JSON.stringify(t);
    for (const n of names) assert.equal(mentions(text, n), false, `"${n}" leaked in ${text}`);
  }
});
