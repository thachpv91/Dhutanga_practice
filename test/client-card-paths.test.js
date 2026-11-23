// Album hints must name a path the current role can actually walk.
const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

function boot() {
  const sb = makeSandbox();
  sb.document = {
    visibilityState: "visible", addEventListener() {},
    getElementById: () => ({ hidden: true, textContent: "", className: "", style: {}, children: [], classList: { add() {} }, appendChild(c) { return c; }, replaceChildren() {}, addEventListener() {} }),
    createElement: () => ({ className: "", textContent: "", style: {}, children: [], classList: { add() {} }, appendChild(c) { return c; }, append() {}, setAttribute() {} }),
    createElementNS: () => ({ setAttribute() {} }),
  };
  load(sb, "cetasika.js");
  load(sb, "milestones.js");
  load(sb, "mind.js");
  return sb;
}

const NO_QUEST = "Vai này chưa có nhiệm vụ nhận thẻ này.";

test("album hints follow the role, and a role without a quest is told so", () => {
  const sb = boot();
  const sections = (role) => sb.Mind.parts.cardSections({}, role);
  const item = (role, id) => sections(role).flatMap((s) => s.items).find((it) => it.id === id);
  const monk = sections("monk");
  assert.deepEqual(Array.from(monk, (s) => s.title), ["Tâm sở tịnh hảo", "Tâm sở tợ tha", "Tâm sở bất thiện"]);
  assert.deepEqual(Array.from(monk.find((s) => s.key === "variable").items, (it) => it.id), ["dinh", "hy"]);
  assert.match(monk.find((s) => s.key === "variable").note, /quy ước của game/);

  assert.match(item("monk", "si").hint, /từ đêm ba/);
  assert.match(item("monk", "phong_dat").hint, /bờ ao/);
  assert.match(item("monk", "hon_tram").hint, /mái hiên/);
  assert.match(item("monk", "hoai_nghi").hint, /kinh hành cạnh mộ/);
  assert.match(item("monk", "khong_tham").hint, /phần cơm của mình/);
  assert.match(item("monk", "bi").hint, /rừng tre/);
  assert.match(item("monk", "hy").hint, /phấn chấn/);
  assert.equal(item("monk", "khong_san").hint, NO_QUEST);
  assert.equal(item("monk", "hoi_han").hint, NO_QUEST);
  assert.equal(item("monk", "niem").hint, NO_QUEST);
  assert.equal(item("monk", "dinh").hint, NO_QUEST);

  assert.match(item("villager", "khong_san").hint, /con Vàng/);
  assert.match(item("villager", "niem").hint, /nghĩa địa/);
  assert.match(item("villager", "dinh").hint, /buổi tập/);
  assert.equal(item("villager", "si").hint, NO_QUEST);
  assert.equal(item("villager", "hoi_han").hint, NO_QUEST);

  assert.match(item("ghost", "hoi_han").hint, /hiên ông Tư/);
  assert.match(item("ghost", "tham").hint, /cái thú/);
  assert.match(item("ghost", "bon_xen").hint, /tường tịnh thất/);
  for (const id of ["san", "khong_san", "khong_tham", "niem", "hy", "bi", "tuy_hy", "dinh", "si", "phong_dat", "hon_tram", "hoai_nghi"]) {
    assert.equal(item("ghost", id).hint, NO_QUEST, id);
  }

  const cat = sb.Cetasika.catalog({ owned: {}, cards: sb.Mind.parts.CARDS, role: "ghost" });
  const hints = cat.groups.flatMap((g) => g.tiles).filter((t) => t.state === "hint").map((t) => t.hint);
  assert.ok(hints.includes(item("ghost", "bon_xen").hint));
  assert.equal(hints.includes(item("villager", "niem").hint), false, "a ghost is not pointed at the meditation quest");
  assert.ok(hints.includes(NO_QUEST));
});

test("an owned unwholesome card shows how many faces were read", () => {
  const sb = boot();
  const owned = { san: { n: 2, seen: ["Đã quát."] } };
  const san = sb.Mind.parts.cardSections(owned, "villager")
    .find((s) => s.key === "bad").items.find((it) => it.id === "san");
  assert.match(san.sub, /đã xem \d\/4 mặt|Đã xem đủ các mặt thẻ/);
  const hy = sb.Mind.parts.cardSections({ hy: { n: 2, seen: ["Phấn chấn."] } }, "villager")
    .flatMap((s) => s.items).find((it) => it.id === "hy");
  assert.equal(hy.cls, "variable");
  assert.equal(hy.sub, "gặp 2 lần");
});
