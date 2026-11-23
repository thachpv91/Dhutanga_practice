// Đêm 1: bé Na hides in the bamboo grove and the player follows the crying by ear (no fail, no timer).
// Same sandbox as client-peta.test.js, with a fake clock so the crying rhythm can be checked.
const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

function node() {
  return {
    hidden: false, textContent: "", className: "", type: "", style: {}, dataset: {}, children: [], listeners: {},
    classList: { add() {}, remove() {}, contains() { return false; } },
    appendChild(c) { this.children.push(c); return c; },
    append(...c) { c.forEach((x) => this.children.push(x)); },
    get firstChild() { return this.children[0]; },
    replaceChildren(...c) { this.children = c; },
    addEventListener(ev, fn) { this.listeners[ev] = fn; },
    setAttribute() {},
  };
}

// Simple layout: the grove is at (1000, 1000), so the child sits at (986, 1030).
const PLACES = () => ({
  gao: { x: 0, y: 0 }, bamboo: { x: 1000, y: 1000 }, village: { x: 200, y: 200 }, well: { x: 300, y: 300 },
  graves: { x: 400, y: 400 }, mit: { x: 500, y: 500 }, hermitage: { x: 600, y: 600 }, gate: { x: 700, y: 700 },
});
const CHILD = { x: 986, y: 1030 };
const NEUTRAL_STATS = { tin: 40, tan: 40, niem: 33, dinh: 33, tue: 37, tham: 35, san: 31, si: 33 };

const saved = (over = {}) => ({
  cards: {}, carita: null, surveySkipped: false, stats: { ...NEUTRAL_STATS },
  quest: { step: "done", hit: true }, q: {}, items: [], deva: { pity: 0, last: 0, seen: 0 },
  milestones: {}, msCounts: {}, village: { deeds: {} }, ...over,
});

const CTX = () => {
  const g = () => ({ addColorStop() {} });
  return {
    arcs: 0,
    createRadialGradient: g, createLinearGradient: g,
    beginPath() {}, arc() { this.arcs++; }, fill() {}, stroke() {}, fillRect() {}, ellipse() {}, moveTo() {}, lineTo() {}, closePath() {},
    fillText() {}, strokeText() {}, save() {}, restore() {}, translate() {}, scale() {}, quadraticCurveTo() {}, fillStyle: "", strokeStyle: "", lineWidth: 1, globalCompositeOperation: "source-over", font: "", textAlign: "",
  };
};

function boot(save, { pos = { x: 0, y: 0 }, darkness = 0.6, sound = true, role = "villager", arrival = false } = {}) {
  const sb = makeSandbox();
  const els = {};
  const toasts = [];
  const goTo = [];
  const sighs = [];
  let clock = 1_000_000;
  class FakeDate extends Date { static now() { return clock; } }
  sb.Date = FakeDate;
  let player = { x: pos.x, y: pos.y, moving: false };
  let busy = false;
  let loopFn = null;
  sb.document = { visibilityState: "visible", addEventListener() {}, getElementById: (id) => (els[id] ||= node()), createElement: () => node(), createElementNS: () => node(), querySelector: () => node(), querySelectorAll: () => [] };
  sb.performance = { now: () => clock };
  sb.setInterval = (fn, ms) => { if (ms === 250) loopFn = fn; return 0; };
  sb.clearInterval = () => {};
  sb.World = {
    PLACES: PLACES(),
    getMap: () => ({ path: [[0, 0], [1000, 0]], caveFound: false }),
    getPlayer: () => player,
    setPlayer(x, y) { player = { ...player, x, y }; },
    setActors() {}, setFx() {}, stop() {}, lookAt() {}, resetLook() {}, setView() {},
  };
  sb.NightAudio = { sigh: () => sighs.push(clock), bell() {} };
  sb.Save = { get: () => (save == null ? null : JSON.stringify(save)), set() {}, log() {} };
  load(sb, "milestones.js");
  sb.Milestones.reveal = () => {};
  load(sb, "mind.js");
  const M = sb.Mind;
  const modules = [];
  const reg = M.register;
  M.register = (m) => { modules.push(m); reg(m); };
  const api = {
    busy: () => busy, darkness: () => darkness, mood: () => 0.6, sound: () => sound,
    toast: (t) => toasts.push(t), refresh() {}, swingMood() {}, goTo: (x, y) => goTo.push([x, y]), day: () => 1, setPose() {},
    arrival: () => arrival,
  };
  M.init(api);
  load(sb, "encounters.js");
  M.onRoleStart(role, () => {});
  const enc = modules.find((m) => m.actors && m.fx);

  const $ = (id) => sb.document.getElementById(id);
  $("mind-card").hidden = true;
  $("card-reveal").hidden = true;
  return {
    sb, M, K: M.kit, enc, toasts, goTo, sighs,
    S: () => M.kit.S,
    setPos(x, y) { player = { ...player, x, y }; },
    setBusy(v) { busy = v; },
    // one 250 ms frame of the proximity loop, with the clock moved forward first
    tick(ms = 250) { clock += ms; M.kit.cooldown(-1); M.kit.setOpen(false); loopFn(); },
    run(ms) { for (let t = 0; t < ms; t += 250) this.tick(250); },
    // the scene offered nearby: its label (null when none), and a tap on it
    prompt: () => { const b = sb.document.getElementById("mind-prompt"); return b.hidden ? null : b.textContent; },
    tap() { M.kit.setOpen(false); sb.document.getElementById("mind-prompt").listeners.click(); },
    choice(label) {
      const btn = $("mind-choices").children.find((c) => c.textContent === label);
      if (!btn) throw new Error(`no choice "${label}"; have: ${$("mind-choices").children.map((c) => c.textContent).join(" | ")}`);
      btn.listeners.click();
    },
    sheetLabel: () => $("mind-label").textContent,
    sheetOpen: () => !$("mind-card").hidden,
    cryToasts: () => toasts.filter((t) => /Tiếng khóc lúc gần|Gần hơn rồi|Ngay đây/.test(t)),
    childActors: () => enc.actors().filter((a) => a.kind === "child"),
    frame(ms = 16) { const ctx = CTX(); enc.fx(ctx, { dayMix: 0, time: 0, camY: 0, viewH: 0 }, ms / 1000); return ctx; },
  };
}

const CHILD_SAVE = () => saved({ q: { tree: { step: "child" } } });

test("arrival ghost does not inherit the legacy Hạnh/Bà Sáu memory quest", () => {
  const arrivalGhost = boot(saved(), { role: "ghost", arrival: true });
  assert.equal(arrivalGhost.M.questList().some((q) => q.title === "Tiếng guốc trong sương"), false);

  const legacyGhost = boot(saved(), { role: "ghost" });
  assert.equal(legacyGhost.M.questList().some((q) => q.title === "Tiếng guốc trong sương"), true);
});

test("arrival monk does not inherit the legacy dog-bite and herb-picking quest", () => {
  const progress = saved({ quest: { step: "well", hit: false } });
  const arrivalMonk = boot(progress, { role: "monk", arrival: true });
  assert.equal(arrivalMonk.M.questList().some((q) => /rau má|vết cắn/.test(q.title)), false);

  const legacyMonk = boot(progress, { role: "monk" });
  assert.equal(legacyMonk.M.questList().some((q) => /vết cắn/.test(q.title)), true);
});

// ---------- A.1: the spirit is introduced before the errand; accepting it does not walk the player ----------
test("treeMeet: the first sheet introduces her, and the errand waits for Nghe tiếp", () => {
  const g = boot(saved({ q: { tree: { step: "none" } } }), { pos: { x: 38, y: 14 } });
  const labels = () => g.sb.document.getElementById("mind-choices").children.map((c) => c.textContent);
  g.tick();
  assert.equal(g.prompt(), "Lại gần gốc gạo", "the tree is offered, not opened");
  g.tap();
  assert.equal(g.sheetLabel(), "Gốc cây gạo");
  assert.equal(g.S().q.tree.met, true, "meeting is recorded before the errand");
  assert.equal(g.S().q.tree.step, "none");
  assert.equal(labels().includes("Đi tìm đứa bé, kẻo trời tối hẳn"), false);
  assert.equal(labels().includes("Xem tâm vị ấy"), true);
  g.choice("Nghe tiếp");
  assert.equal(labels().includes("Đi tìm đứa bé, kẻo trời tối hẳn"), true);
  g.choice("Đi tìm đứa bé, kẻo trời tối hẳn");
  assert.equal(g.S().q.tree.step, "child");
  assert.equal(g.goTo.length, 0, "the player is not led to the child");
  assert.equal(g.sheetOpen(), false, "sheet closed");
  assert.ok(g.toasts.some((t) => t === "Có tiếng khóc nhỏ vọng ra từ bụi tre. Lần theo tiếng khóc nhé."));
});

test("treeMeet: xem tâm and hỏi bà là ai return without starting the errand", () => {
  const g = boot(saved({ q: { tree: { step: "none" } } }), { pos: { x: 38, y: 14 } });
  g.tick();
  g.tap();
  g.choice("Xem tâm vị ấy");
  assert.equal(g.sheetLabel(), "Tâm của thọ thần");
  assert.equal(g.S().q.tree.step, "none");
  g.choice("Quay lại");
  assert.equal(g.sheetLabel(), "Gốc cây gạo");
  g.choice("Hỏi: bà là ai?");
  const said = g.sb.document.getElementById("mind-lines").children.map((c) => c.textContent).join(" ");
  assert.match(said, /Lâu hơn cái giếng/);
  assert.equal(g.S().q.tree.step, "none");
  g.choice("Nghe tiếp");
  assert.equal(g.S().q.tree.step, "none");
});

test("meeting the tree spirit records her in the sổ and as a milestone", () => {
  const g = boot(saved({ q: { tree: { step: "none" } } }), { pos: { x: 38, y: 14 } });
  g.tick();
  g.tap();
  const row = g.sb.Discover.entries().find((e) => e.id === "tho_than");
  assert.equal(row.state, "seen");
  assert.equal(g.sb.Milestones.has("met_tho_than"), true);
  const b = g.sb.Beings.of("tho_than");
  assert.equal(b.title, "Thọ thần");
  assert.ok(b.bars.length >= 4);
  assert.match(g.sb.Beings.portrait("tho_than"), /<svg/);
  assert.match(b.why, /chư thiên ở mặt đất/);
  assert.equal(/Jātaka/.test(b.why), false, "the meeting sheet stays the one-line why");
  const told = b.stories.map((s) => [s.title, s.source, ...s.lines].join(" ")).join("\n");
  assert.match(told, /Jātaka/);
  assert.match(told, /Tương Ưng Rừng/);
  const deva = g.sb.Beings.of("chu_thien").stories.map((s) => [s.title, s.source, ...s.lines].join(" ")).join("\n");
  assert.match(deva, /Vv 1\.9/);
  assert.match(deva, /hạt mè/);
  assert.match(deva, /kinh 3\.37/);
  const earth = g.sb.Beings.of("dia_than").stories.map((s) => s.source + " " + s.lines.join(" ")).join(" ");
  assert.match(earth, /Chưa gắn một bài kinh/);
});

// ---------- A.2: the errand target is the whole bamboo grove ----------
test("targets: the child step points at the bamboo grove, not the child's exact spot", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: 0, y: 0 } });
  const t = g.M.questList().find((q) => q.title === "Lần theo tiếng khóc");
  assert.ok(t, "errand listed");
  assert.equal(t.name, "Bụi tre");
  assert.deepEqual([t.x, t.y], [1000, 1020], "bamboo position with dy 20");
  assert.notDeepEqual([t.x, t.y], [CHILD.x, CHILD.y], "not the child's position");
});

// ---------- A.3: the child is drawn only when the player is within 90 ----------
test("actors: the child is not drawn far away and is drawn within 90", () => {
  const far = boot(CHILD_SAVE(), { pos: { x: 0, y: 0 } });
  assert.equal(far.childActors().length, 0, "far: no child");
  const near = boot(CHILD_SAVE(), { pos: { x: CHILD.x - 60, y: CHILD.y } });
  assert.equal(near.childActors().length, 1, "within 90: child drawn");
  assert.equal(near.childActors()[0].x, CHILD.x);
});

// ---------- A.4: distance hints, toast only when the level changes ----------
test("loop: a far hint is shown once no matter how often the loop runs", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: 0, y: 0 } });
  for (let i = 0; i < 6; i++) g.tick();
  assert.deepEqual(g.cryToasts(), ["Tiếng khóc lúc gần lúc xa, lẫn trong tiếng tre cọ nhau."]);
});

test("loop: moving closer changes the hint once per level, then stays quiet", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: 0, y: 0 } });
  g.tick();
  g.setPos(CHILD.x - 200, CHILD.y); // d = 200: mid
  g.run(1000);
  g.setPos(CHILD.x - 100, CHILD.y); // d = 100: close
  g.run(1000);
  assert.deepEqual(g.cryToasts(), ["Tiếng khóc lúc gần lúc xa, lẫn trong tiếng tre cọ nhau.", "Gần hơn rồi. Có tiếng nấc sau khóm tre to.", "Ngay đây. Lá tre dưới đất bị ai ngồi đè lên."]);
});

test("loop: NightAudio.sigh follows the rhythm; the interval is d/80 clamped to 0.9..3.2 s", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: 0, y: 0 } }); // far: 3.2 s between cries
  g.tick();
  assert.equal(g.sighs.length, 1, "first cry straight away");
  g.run(3000);
  assert.equal(g.sighs.length, 1, "no cry before 3.2 s");
  g.run(500);
  assert.equal(g.sighs.length, 2, "next cry at 3.2 s");
});

test("loop: no cry while the player is busy", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: 0, y: 0 } });
  g.setBusy(true);
  g.run(2000);
  assert.equal(g.sighs.length, 0);
  assert.equal(g.cryToasts().length, 0);
});

test("fx: a ripple is drawn for a cry and fades after about 1.2 s", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: 0, y: 0 } });
  g.tick(); // starts a cry
  assert.equal(g.frame(16).arcs, 1, "ripple drawn");
  g.frame(1500);
  assert.equal(g.frame(16).arcs, 0, "ripple gone after 1.2 s");
});

// ---------- finding the child and stopping the crying ----------
test("loop: arriving within 40 opens the found scene", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: CHILD.x - 20, y: CHILD.y } });
  g.tick();
  assert.equal(g.sheetLabel(), "Bụi tre");
});

test("loop: the crying stops once the child is no longer at step 'child'", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: 0, y: 0 } });
  g.tick();
  assert.equal(g.frame(16).arcs, 1, "a cry is running");
  g.S().q.tree.step = "done";
  g.tick();
  const before = g.sighs.length;
  g.run(5000);
  assert.equal(g.sighs.length, before, "no more cries");
  assert.equal(g.frame(16).arcs, 0, "no ripple");
  assert.equal(g.cryToasts().length, 1, "no more hints after the step changed");
});

test("an old save at step 'child' still plays: the child can be found by walking close", () => {
  const g = boot(CHILD_SAVE(), { pos: { x: CHILD.x - 10, y: CHILD.y + 10 } });
  g.tick();
  assert.equal(g.sheetLabel(), "Bụi tre");
  g.choice("Ngồi xuống ngang tầm, cho bé bớt sợ");
  assert.equal(g.S().q.tree.step, "follow");
});

// ---------- scenes that start a story are offered, never opened by walking near ----------
test("the tree spirit: 'Để sau' closes the scene, which stays offered and never opens by itself", () => {
  const g = boot(saved({ q: { tree: { step: "none" } } }), { pos: { x: 38, y: 14 } });
  g.tick();
  g.tap();
  g.choice("Để sau");
  for (let i = 0; i < 400; i++) g.tick(); // 100 seconds standing under the tree
  assert.equal(g.S().q.tree.step, "none");
  assert.equal(g.prompt(), "Lại gần gốc gạo", "still offered, with no waiting time");
  g.setPos(900, 900);
  g.tick();
  assert.equal(g.prompt(), null, "gone when the player walks on");
});

test("a step of an errand already taken on still opens on arrival", () => {
  const g = boot(CHILD_SAVE(), { pos: CHILD });
  g.tick();
  assert.equal(g.prompt(), null);
  assert.equal(g.sheetLabel(), "Bụi tre");
});

test("nothing is offered while the player is busy in a story scene", () => {
  const g = boot(saved({ q: { tree: { step: "none" } } }), { pos: { x: 38, y: 14 } });
  g.tick();
  assert.equal(g.prompt(), "Lại gần gốc gạo");
  g.setBusy(true);
  g.tick();
  assert.equal(g.prompt(), null);
});

// ---------- the scene in the bamboo: one line follows the temperament, and waiting is a kind choice with no card ----------
test("childFound: the second line follows the temperament; no temperament reads the neutral line; the choices are the same", () => {
  const lines = (g) => g.sb.document.getElementById("mind-lines").children.map((p) => p.textContent);
  const labels = (g) => g.sb.document.getElementById("mind-choices").children.map((c) => c.textContent);
  const neutral = boot(CHILD_SAVE(), { pos: CHILD });
  neutral.tick();
  assert.equal(lines(neutral)[1], "Bé khóc đã lâu, giọng khản đi.");
  const san = boot({ ...CHILD_SAVE(), carita: "san" }, { pos: CHILD });
  san.tick();
  assert.equal(lines(san)[1], "Tiếng khóc xoáy vào tai. Người này thấy bực, dù chưa biết bực ai.");
  assert.deepEqual(labels(san), labels(neutral));
  assert.equal(Object.keys(san.S().cards).length, 0, "the line itself gives no card");
});

test("childFound: waiting at a distance brings the child along with no card and no fear", () => {
  const g = boot(CHILD_SAVE(), { pos: CHILD });
  g.tick();
  g.choice("Đứng xa một chút, chờ bé tự nín");
  assert.equal(g.S().q.tree.step, "follow");
  assert.equal(g.S().q.tree.scared, false);
  assert.equal(Object.keys(g.S().cards).length, 0);
  assert.equal(g.sb.document.getElementById("card-reveal").hidden, true, "no card is shown");
});
