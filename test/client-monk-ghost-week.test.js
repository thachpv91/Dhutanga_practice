const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const PLACES = {
  gate: { x: 100, y: 100 }, graves: { x: 200, y: 200 }, hermitage: { x: 300, y: 300 },
  ao: { x: 400, y: 400 }, village: { x: 500, y: 500 }, well: { x: 600, y: 600 },
  bamboo: { x: 700, y: 700 }, gao: { x: 800, y: 800 },
};

function boot(file, role, { day = 1, phase = "Chạng vạng", q = {} } = {}) {
  const sb = makeSandbox();
  let state = { q: JSON.parse(JSON.stringify(q)), items: [], quest: { step: "done" }, village: { deeds: {} } };
  let player = { x: 0, y: 0 };
  let sheet = null;
  let offered = null;
  const logs = [];
  const awards = [];
  const modules = [];
  const api = { arrival: () => true, villagerArrival: () => role === "villager", storyDay: () => day, phase: () => phase };
  const K = {
    get S() { return state; },
    role: () => role,
    api: () => api,
    P: () => PLACES,
    save() {},
    closeSheet() { sheet = null; },
    showSheet(value) { sheet = value; },
    award(id, line) { awards.push([id, line]); },
    near(pt, radius) { return Math.hypot(player.x - pt.x, player.y - pt.y) <= radius; },
    offer(id, label, fn) { offered = { id, label, fn }; return true; },
  };
  sb.World = { PLACES, getPlayer: () => player };
  sb.Save = { log: (line) => logs.push(line) };
  sb.Mind = { kit: K, register: (m) => modules.push(m) };
  load(sb, "practice-rules.js");
  load(sb, file);

  const choices = () => (sheet?.choices || []).map((c) => c.label);
  const choose = (label) => {
    const c = (sheet?.choices || []).find((x) => x.label === label);
    if (!c) throw new Error(`missing choice ${label}; have ${choices().join(" | ")}`);
    c.fn();
  };
  const targets = () => modules[0].targets();
  const visitMonk = (title) => {
    const t = targets().find((x) => x.title === title);
    assert.ok(t, `missing target ${title}`);
    player = { x: t.x, y: t.y };
    offered = null;
    modules[0].loop();
    assert.ok(offered, `target ${title} was not offered`);
    offered.fn();
  };
  const visitGhost = (title) => {
    const t = targets().find((x) => x.title === title);
    assert.ok(t, `missing target ${title}`);
    t.run();
  };
  return {
    sb, state, logs, awards, modules, choices, choose, targets, visitMonk, visitGhost, sheet: () => sheet,
    swapState(next) { state = next; },
  };
}

test("ghost week is role/arrival gated and Bờ Chìm is available from day one", () => {
  const ghost = boot("ghost-week.js", "ghost");
  assert.ok(ghost.targets().some((t) => /khe suối|Bờ Chìm/.test(t.title)));

  const monk = boot("ghost-week.js", "monk");
  assert.equal(monk.targets().length, 0);
});

test("G01: one pang of remorse does not open Hối hận; the remorse has to come back", () => {
  const g = boot("ghost-week.js", "ghost", { day: 1, phase: "Canh hai" });
  g.visitGhost("Ghé ngọn đèn nhà ông Tư");
  g.choose("Cho bóng mình lướt qua vách");
  g.choose("Nghe ông thở dốc, thấy day dứt");
  assert.equal(g.state.q.ghostWeek.motive, "remorse_once");
  assert.deepEqual(g.awards, []);

  g.visitGhost("Ghé ngọn đèn nhà ông Tư");
  g.choose("Cứ quay đi quay lại với việc ấy");
  assert.equal(g.state.q.ghostWeek.motive, "regret");
  assert.deepEqual(g.awards, [["hoi_han", "Tôi đã làm ông Tư hoảng sợ, rồi cứ day dứt quay đi quay lại về việc ấy."]]);

  g.visitGhost("Ghé ngọn đèn nhà ông Tư");
  assert.equal(g.awards.length, 1, "reloading the porch does not grant Hối hận again");
});

test("G01: admitting the scare and wanting to repair does not open Hối hận", () => {
  const g = boot("ghost-week.js", "ghost", { day: 1, phase: "Canh hai" });
  g.visitGhost("Ghé ngọn đèn nhà ông Tư");
  g.choose("Cho bóng mình lướt qua vách");
  g.choose("Nhận là mình đã làm ông sợ, và muốn sửa");
  assert.equal(g.state.q.ghostWeek.motive, "amend");
  assert.deepEqual(g.awards, []);
  g.choose("Báo chiếc đèn cho ông");
  assert.equal(g.state.q.ghostWeek.lampWarned, true);
  assert.deepEqual(g.awards, []);
});

test("G01: wanting to repeat the scare opens Tham, not Hối hận", () => {
  const g = boot("ghost-week.js", "ghost", { day: 1, phase: "Canh hai" });
  g.visitGhost("Ghé ngọn đèn nhà ông Tư");
  g.choose("Cho bóng mình lướt qua vách");
  g.choose("Mình thích cái thú ấy và muốn làm lại");
  assert.equal(g.state.q.ghostWeek.motive, "delight");
  assert.deepEqual(g.awards, [["tham", "Tôi muốn giữ lấy cái thú làm ông Tư hoảng sợ, và muốn làm lại."]]);
});

test("G01: a saved regret does not grant the card again", () => {
  const g = boot("ghost-week.js", "ghost", { day: 1, phase: "Canh hai", q: { ghostWeek: { fear: "scared", motive: "regret" } } });
  g.visitGhost("Ghé ngọn đèn nhà ông Tư");
  assert.equal(g.choices().includes("Cứ quay đi quay lại với việc ấy"), false);
  assert.deepEqual(g.awards, []);
});

test("G03 can start on suggested night two and never gives the ghost a herb-picking action", () => {
  const g = boot("ghost-week.js", "ghost", { day: 2, q: { ghostWeek: { bagSeen: true } } });
  g.visitGhost("Nghe bà cụ tìm đồ");
  assert.equal(g.choices().some((x) => /Hái rau|Nhặt rau/.test(x)), false);
  assert.ok(g.choices().some((x) => /Nghe bà tả/.test(x)));
});

test("G02 opens Bỏn xẻn only after the ghost treats the scent as their own and blocks the other shade", () => {
  const g = boot("ghost-week.js", "ghost", { day: 2, phase: "Sáng sớm" });
  g.visitGhost("Lần theo hơi cơm");
  g.choose("Xem làn hương này là phần của mình");
  assert.deepEqual(g.awards, []);
  assert.equal(g.state.q.ghostWeek?.offeringSeen, undefined, "naming the wish does not finish the visit");
  g.choose("Chắn trước, không để bóng kia cùng hưởng");
  assert.equal(g.state.q.ghostWeek.incenseClung, true);
  assert.deepEqual(g.awards, [["bon_xen", "Tôi xem hương cơm là phần của mình, khó chịu khi bóng kia cùng hưởng, và chọn ngăn họ."]]);
  assert.equal(g.targets().some((t) => t.title === "Lần theo hơi cơm"), false);
});

test("G02: stepping aside, or leaving before the block, does not open Bỏn xẻn", () => {
  const aside = boot("ghost-week.js", "ghost", { day: 2, phase: "Sáng sớm" });
  aside.visitGhost("Lần theo hơi cơm");
  aside.choose("Xem làn hương này là phần của mình");
  aside.choose("Đứng sang một bên");
  assert.equal(aside.state.q.ghostWeek.offeringSeen, true);
  assert.deepEqual(aside.awards, []);

  const left = boot("ghost-week.js", "ghost", { day: 2, phase: "Sáng sớm" });
  left.visitGhost("Lần theo hơi cơm");
  left.choose("Xem làn hương này là phần của mình");
  left.choose("Đi tiếp");
  assert.equal(left.state.q.ghostWeek?.offeringSeen, undefined);
  assert.deepEqual(left.awards, []);
  assert.ok(left.targets().some((t) => t.title === "Lần theo hơi cơm"), "leaving the wish sheet keeps the quest");
});

test("G02: a finished cling is not offered again", () => {
  const g = boot("ghost-week.js", "ghost", { day: 2, phase: "Sáng sớm", q: { ghostWeek: { offeringSeen: true, incenseClung: true } } });
  assert.equal(g.targets().some((t) => t.title === "Lần theo hơi cơm"), false);
});

test("G07 closes only the opening chapter and all exploration nodes remain usable", () => {
  const g = boot("ghost-week.js", "ghost", {
    day: 7,
    phase: "Rạng sáng",
    q: { ghostWeek: { lampSafe: true, pier: true } },
  });
  g.visitGhost("Dừng dưới tán gạo khi trời sáng");
  assert.ok(g.choices().includes("Khép chương bảy đêm"));
  g.choose("Khép chương bảy đêm");
  assert.equal(g.state.q.ghostWeek.chapterClosed, true);
  assert.equal(g.state.q.ghostWeek.completed, undefined);
  assert.ok(g.targets().some((t) => /Bờ Chìm/.test(t.title)), "chapter close must not disable exploration");
});

test("G07 does not require the full dedication or a moral score", () => {
  const g = boot("ghost-week.js", "ghost", {
    day: 7,
    phase: "Sáng",
    q: { ghostWeek: { fear: "startled", bagSeen: true } },
  });
  assert.ok(g.targets().some((t) => t.title === "Dừng dưới tán gạo khi trời sáng"));
});

test("MN02 lets the monk relay a need but provides no harvest action or rau_ma item", () => {
  const m = boot("monk-week.js", "monk", { day: 2, phase: "Rạng sáng" });
  m.visitMonk("Bà cụ bên giếng");
  assert.equal(m.choices().some((x) => /Hái rau/.test(x)), false);
  m.choose("Ghé báo có người đang cần giúp ở giếng");
  assert.equal(m.state.q.monkWeek.grannyMessage, "relay");
  assert.deepEqual(m.state.items, []);

  m.choose("Đi tiếp");
  m.visitMonk("Một lời nhắn ở đầu ngõ");
  m.choose("Chỉ nói bà đang cần người ghé qua");
  assert.equal(m.state.q.monkWeek.grannyRelayed, "yes");
  assert.deepEqual(m.state.items, []);
});

test("MN06 gives a natural fear response and an optional dedication without an automatic card", () => {
  const m = boot("monk-week.js", "monk", { day: 6, phase: "Canh hai" });
  m.visitMonk("Tiếng động bên ngôi mộ");
  m.choose("Quay lại quan sát");
  assert.equal(m.state.q.monkWeek.grave, "observe");
  m.choose("Đi tiếp");

  m.visitMonk("Cuối thời ngồi bên mộ");
  m.choose("Hồi hướng điều lành đến những ai hữu duyên");
  assert.equal(m.state.q.monkWeek.dedication, "offered");
  assert.deepEqual(m.awards, []);
});

const PRACTICE = ["Tiếng gõ sau tịnh thất", "Lời trái ý bên ao", "Dưới mái hiên", "Lối kinh hành cạnh mộ"];

test("monk practice cards open only after the lesson about that mental process", () => {
  const cases = [
    [3, {}, "Tiếng gõ sau tịnh thất", ["Chắc có người cố quấy phá", "Đọc lời giải thích về si trong tâm bất thiện", "Đi tiếp", "Đi tiếp"], "si", "practiceConfusion"],
    [4, { practiceConfusion: "learned" }, "Lời trái ý bên ao", ["Dựng tiếp trong đầu những lời hơn thua", "Nhìn lại sự xao động vừa rồi, rồi trở về tiếng nước", "Đi tiếp", "Đi tiếp"], "phong_dat", "practiceAgitation"],
    [5, { practiceConfusion: "learned", practiceAgitation: "learned" }, "Dưới mái hiên", ["Tâm co lại, miễn cưỡng với đoạn kinh đang đọc", "Đứng dậy kinh hành", "Đi tiếp"], "hon_tram", "practiceDullness"],
    [6, { practiceConfusion: "learned", practiceAgitation: "learned", practiceDullness: "learned" }, "Lối kinh hành cạnh mộ", ["Nhìn lại sự nghi hoặc đang ngăn mình thực hành", "Đi tiếp", "Đi tiếp"], "hoai_nghi", "practiceDoubt"],
  ];
  for (const [day, monkWeek, title, labels, card, key] of cases) {
    const m = boot("monk-week.js", "monk", { day, phase: "Canh hai", q: { monkWeek } });
    m.visitMonk(title);
    for (const label of labels.slice(0, -1)) m.choose(label);
    assert.deepEqual(m.awards, [], `${card} waits until the last Đi tiếp`);
    assert.equal(m.state.q.monkWeek[key], "learned");
    m.choose("Đi tiếp");
    assert.equal(m.awards.at(-1)[0], card);
    assert.equal(m.state.q.monkWeek[key + "Card"], true);
    assert.equal(m.targets().some((t) => t.title === title), false, `${title} is not offered again`);
  }
});

test("a calm check, ordinary tiredness, a study question, or merely sitting does not open a practice card", () => {
  const calm = boot("monk-week.js", "monk", { day: 3, phase: "Canh hai" });
  calm.visitMonk("Tiếng gõ sau tịnh thất");
  calm.choose("Đi vòng ra xem cho rõ");
  calm.choose("Gỡ cành rồi đi tiếp");
  calm.choose("Đi tiếp");
  assert.equal(calm.state.q.monkWeek.practiceConfusion, "calm");
  assert.deepEqual(calm.awards, []);

  const tired = boot("monk-week.js", "monk", { day: 5, phase: "Canh hai", q: { monkWeek: { practiceConfusion: "learned", practiceAgitation: "learned" } } });
  tired.visitMonk("Dưới mái hiên");
  tired.choose("Đêm qua ngủ ít, thân đang mệt");
  tired.choose("Đi tiếp");
  assert.equal(tired.state.q.monkWeek.practiceDullness, "rested");
  assert.deepEqual(tired.awards, []);

  const asked = boot("monk-week.js", "monk", { day: 6, phase: "Canh hai", q: { monkWeek: { practiceConfusion: "learned", practiceAgitation: "learned", practiceDullness: "learned" } } });
  asked.visitMonk("Lối kinh hành cạnh mộ");
  asked.choose("Hỏi Sư Tịnh câu này nghĩa là gì với hơi thở");
  asked.choose("Đi tiếp");
  assert.equal(asked.state.q.monkWeek.practiceDoubt, "asked");
  assert.deepEqual(asked.awards, []);

  const sat = boot("monk-week.js", "monk", { day: 6, phase: "Canh hai", q: { monkWeek: { practiceConfusion: "learned", practiceAgitation: "learned", practiceDullness: "learned" } } });
  sat.visitMonk("Lối kinh hành cạnh mộ");
  sat.choose("Ngồi xuống như mọi khi");
  sat.choose("Đi tiếp");
  assert.equal(sat.state.q.monkWeek.practiceDoubt, "sat");
  assert.deepEqual(sat.awards, []);
});

test("Để sau leaves a practice beat for a later night, and a finished beat is not offered again", () => {
  const later = boot("monk-week.js", "monk", { day: 3, phase: "Canh hai" });
  later.visitMonk("Tiếng gõ sau tịnh thất");
  later.choose("Để sau");
  assert.equal(later.state.q.monkWeek, undefined);
  assert.ok(later.targets().some((t) => t.title === "Tiếng gõ sau tịnh thất"));

  const early = boot("monk-week.js", "monk", { day: 2, phase: "Canh hai" });
  for (const title of PRACTICE) assert.equal(early.targets().some((t) => t.title === title), false, title);

  const villager = boot("monk-week.js", "villager", { day: 6, phase: "Canh hai" });
  assert.equal(villager.targets().length, 0);

  const done = boot("monk-week.js", "monk", { day: 3, phase: "Canh hai", q: { monkWeek: { practiceConfusion: "learned", practiceConfusionCard: true } } });
  assert.equal(done.targets().some((t) => t.title === "Tiếng gõ sau tịnh thất"), false);
  const legacy = boot("monk-week.js", "monk", { day: 3, phase: "Canh hai", q: { monkWeek: { practiceConfusion: "recognized" } } });
  assert.equal(legacy.targets().some((t) => t.title === "Tiếng gõ sau tịnh thất"), false);
});

test("switching character before Đi tiếp does not award the practice card", () => {
  const m = boot("monk-week.js", "monk", { day: 3, phase: "Canh hai" });
  m.visitMonk("Tiếng gõ sau tịnh thất");
  m.choose("Chắc có người cố quấy phá");
  m.choose("Đọc lời giải thích về si trong tâm bất thiện");
  m.choose("Đi tiếp");
  assert.equal(m.state.q.monkWeek.practiceConfusion, "learned");
  m.swapState({ q: { monkWeek: {} }, items: [], quest: { step: "done" }, village: { deeds: {} } });
  m.choose("Đi tiếp");
  assert.deepEqual(m.awards, []);
  assert.equal(m.state.q.monkWeek.practiceConfusionCard, undefined);
});

test("clear goodwill toward con Vàng opens Không sân on the first meeting", () => {
  const v = boot("villager-week.js", "villager", { day: 4, phase: "Canh hai" });
  v.visitMonk("Làm quen con Vàng");
  v.choose("Ngồi thấp, mong nó bớt sợ");
  assert.equal(v.state.q.villagerWeek.dog, "calm");
  assert.deepEqual(v.awards, [["khong_san", "Ngay lần đầu gặp, người này ngồi thấp và mong con Vàng bớt sợ."]]);
});

test("sitting with con Vàng without wishing it well does not open Không sân", () => {
  const v = boot("villager-week.js", "villager", { day: 4, phase: "Canh hai" });
  v.visitMonk("Làm quen con Vàng");
  v.choose("Ngồi thấp, chờ nó quen hơi");
  assert.equal(v.state.q.villagerWeek.dog, "calm");
  assert.deepEqual(v.awards, []);
  assert.equal(v.targets().some((t) => t.title === "Làm quen con Vàng"), false);
});

test("leaving con Vàng keeps the meeting for another night", () => {
  const v = boot("villager-week.js", "villager", { day: 4, phase: "Canh hai" });
  v.visitMonk("Làm quen con Vàng");
  v.choose("Đi tiếp");
  assert.equal(v.state.q.villagerWeek, undefined);
  assert.ok(v.targets().some((t) => t.title === "Làm quen con Vàng"));
});

test("goodwill after having yelled still opens Không sân, and other roles never meet the dog", () => {
  const v = boot("villager-week.js", "villager", {
    day: 4,
    phase: "Canh hai",
    q: { villagerWeek: { dog: "barked", dogDay: 3 } },
  });
  v.visitMonk("Làm quen con Vàng");
  v.choose("Ngồi chờ, không nói gì thêm");
  assert.equal(v.state.q.villagerWeek.dog, "calm");
  assert.deepEqual(v.awards, []);

  const amend = boot("villager-week.js", "villager", {
    day: 4,
    phase: "Canh hai",
    q: { villagerWeek: { dog: "barked", dogDay: 3 } },
  });
  amend.visitMonk("Làm quen con Vàng");
  amend.choose("Ngồi thấp, mong nó được yên");
  assert.equal(amend.awards.at(-1)[0], "khong_san");

  assert.equal(boot("villager-week.js", "monk", { day: 4, phase: "Canh hai" }).targets().some((t) => t.title === "Làm quen con Vàng"), false);
  assert.equal(boot("villager-week.js", "ghost", { day: 4, phase: "Canh hai" }).targets().length, 0);
});

test("week scripts expose distinct opening and ending copy for monk and ghost", () => {
  const monk = boot("monk-week.js", "monk", { day: 6 });
  const ghost = boot("ghost-week.js", "ghost", { day: 7, q: { ghostWeek: { chapterClosed: true } } });
  assert.match(monk.sb.MonkWeek.opening(6).join(" "), /nghĩa địa|ngôi mộ/);
  assert.match(monk.sb.MonkWeek.ending(6), /sương|dế|nghĩa địa/);
  assert.match(ghost.sb.GhostWeek.ending(7), /con đường khác vẫn còn mở/);
});
