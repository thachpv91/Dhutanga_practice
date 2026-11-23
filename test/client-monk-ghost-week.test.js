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
  const state = { q: JSON.parse(JSON.stringify(q)), items: [], quest: { step: "done" }, village: { deeds: {} } };
  let player = { x: 0, y: 0 };
  let sheet = null;
  let offered = null;
  const logs = [];
  const awards = [];
  const modules = [];
  const api = { arrival: () => true, villagerArrival: () => role === "villager", storyDay: () => day, phase: () => phase };
  const K = {
    S: state,
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
  return { sb, state, logs, awards, modules, choices, choose, targets, visitMonk, visitGhost, sheet: () => sheet };
}

test("ghost week is role/arrival gated and Bờ Chìm is available from day one", () => {
  const ghost = boot("ghost-week.js", "ghost");
  assert.ok(ghost.targets().some((t) => /khe suối|Bờ Chìm/.test(t.title)));

  const monk = boot("ghost-week.js", "monk");
  assert.equal(monk.targets().length, 0);
});

test("G01 distinguishes delight in fear from regret after frightening ông Tư", () => {
  const g = boot("ghost-week.js", "ghost", { day: 1, phase: "Canh hai" });
  g.visitGhost("Ghé ngọn đèn nhà ông Tư");
  g.choose("Cho bóng mình lướt qua vách");
  g.choose("Nghe ông thở dốc, thấy ray rứt vì đã làm quá");
  assert.equal(g.state.q.ghostWeek.motive, "regret");
  assert.equal(g.awards.at(-1)[0], "hoi_han");
});

test("G03 can start on suggested night two and never gives the ghost a herb-picking action", () => {
  const g = boot("ghost-week.js", "ghost", { day: 2, q: { ghostWeek: { bagSeen: true } } });
  g.visitGhost("Nghe bà cụ tìm đồ");
  assert.equal(g.choices().some((x) => /Hái rau|Nhặt rau/.test(x)), false);
  assert.ok(g.choices().some((x) => /Nghe bà tả/.test(x)));
});

test("G02 can reveal Bỏn xẻn only from the ghost's explicit wish to keep the offering scent", () => {
  const g = boot("ghost-week.js", "ghost", { day: 2, phase: "Sáng sớm" });
  g.visitGhost("Lần theo hơi cơm");
  g.choose("Chắn trước làn hương, không muốn bóng kia lại gần");
  assert.deepEqual(g.awards, [["bon_xen", "Tôi co lại trước một bóng đói khác, không muốn họ cùng đến gần làn hương cơm."]]);
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

test("monk practice beats award hindrance cards only after explicit recognition", () => {
  const cases = [
    [3, {}, "Tiếng gõ sau tịnh thất", "Nhận ra mình đã kết luận khi chưa nhìn rõ", "si"],
    [4, { practiceConfusion: "recognized" }, "Một vòng tâm lao xao", "Gọi đúng sự lao xao rồi trở về tiếng nước", "phong_dat"],
    [5, { practiceConfusion: "recognized", practiceAgitation: "recognized" }, "Mắt nặng dưới mái hiên", "Nhận ra hôn trầm, đứng dậy kinh hành", "hon_tram"],
    [6, { practiceConfusion: "recognized", practiceAgitation: "recognized", practiceDullness: "recognized" }, "Câu hỏi giữ chân ngoài lối", "Ghi câu hỏi lại, nhận ra sự phân vân đang cản mình", "hoai_nghi"],
  ];
  for (const [day, monkWeek, title, choice, card] of cases) {
    const m = boot("monk-week.js", "monk", { day, phase: "Canh hai", q: { monkWeek } });
    m.visitMonk(title);
    m.choose(choice);
    assert.deepEqual(m.awards, [], `${card} must wait until the consequence has been read`);
    m.choose("Đi tiếp");
    assert.equal(m.awards.at(-1)[0], card);
  }
});

test("making peace with con Vàng after shouting awards Không sân", () => {
  const v = boot("villager-week.js", "villager", {
    day: 4,
    phase: "Canh hai",
    q: { villagerWeek: { dog: "barked", dogDay: 3 } },
  });
  v.visitMonk("Làm quen con Vàng");
  v.choose("Ngồi thấp, chờ nó quen hơi");
  assert.equal(v.state.q.villagerWeek.dog, "calm");
  assert.equal(v.awards.at(-1)[0], "khong_san");
});

test("week scripts expose distinct opening and ending copy for monk and ghost", () => {
  const monk = boot("monk-week.js", "monk", { day: 6 });
  const ghost = boot("ghost-week.js", "ghost", { day: 7, q: { ghostWeek: { chapterClosed: true } } });
  assert.match(monk.sb.MonkWeek.opening(6).join(" "), /nghĩa địa|ngôi mộ/);
  assert.match(monk.sb.MonkWeek.ending(6), /sương|dế|nghĩa địa/);
  assert.match(ghost.sb.GhostWeek.ending(7), /con đường khác vẫn còn mở/);
});
