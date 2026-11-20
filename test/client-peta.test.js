// Hungry-ghost grandmother (HG27) under the card rules v0.2: Bi when the player chooses to help,
// Không tham only when the player shares their own evening rice, Tùy hỷ only when they stay to watch.
// Cards come after the closing scene, never during it. Same sandbox as client-card-logic.test.js.
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

const PLACES = () => ({
  gao: { x: -500, y: -500 }, bamboo: { x: 100, y: 100 }, village: { x: 200, y: 200 }, well: { x: 300, y: 300 },
  graves: { x: 400, y: 400 }, mit: { x: 500, y: 500 }, hermitage: { x: 600, y: 600 }, gate: { x: 700, y: 700 },
});
const NEUTRAL_STATS = { tin: 40, tan: 40, niem: 33, dinh: 33, tue: 37, tham: 35, san: 31, si: 33 };

const saved = (over = {}) => ({
  cards: {}, carita: null, surveySkipped: false, stats: { ...NEUTRAL_STATS },
  quest: { step: "done", hit: true }, q: {}, items: [], deva: { pity: 0, last: 0, seen: 0 },
  milestones: {}, msCounts: {}, village: { deeds: {} }, ...over,
});

function boot(save, { role = "villager", darkness = 0, pos = { x: 0, y: 0 }, phase = null } = {}) {
  const sb = makeSandbox();
  const els = {};
  const toasts = [];
  const logs = [];
  let curDark = darkness, curPhase = phase;
  let player = { x: pos.x, y: pos.y, moving: false };
  let loopFn = null;
  sb.document = { visibilityState: "visible", addEventListener() {}, getElementById: (id) => (els[id] ||= node()), createElement: () => node(), createElementNS: () => node(), querySelector: () => node(), querySelectorAll: () => [] };
  sb.performance = { now: () => Date.now() };
  sb.setInterval = (fn, ms) => { if (ms === 250) loopFn = fn; return 0; };
  sb.clearInterval = () => {};
  sb.World = {
    PLACES: PLACES(),
    getMap: () => ({ path: [[0, 0], [1000, 0]], caveFound: false }),
    getPlayer: () => player,
    setPlayer(x, y) { player = { ...player, x, y }; },
    setActors() {}, setFx() {}, stop() {}, lookAt() {}, resetLook() {}, setView() {},
  };
  sb.Save = { get: () => (save == null ? null : JSON.stringify(save)), set() {}, log: (m) => logs.push(m) };
  load(sb, "milestones.js");
  sb.Milestones.reveal = () => {};
  load(sb, "mind.js");
  const M = sb.Mind;
  const api = {
    busy: () => false, darkness: () => curDark, mood: () => 0.6, sound: () => false,
    toast: (t) => toasts.push(t), refresh() {}, swingMood() {}, goTo() {}, day: () => 1, setPose() {},
  };
  // only characters with a world clock have phase(); without the option the fake api stays on the legacy path
  if (phase != null) api.phase = () => curPhase;
  M.init(api);
  load(sb, "encounters.js");
  M.onRoleStart(role, () => {});

  const $ = (id) => sb.document.getElementById(id);
  $("mind-card").hidden = true;
  $("card-reveal").hidden = true;
  return {
    sb, M, K: M.kit, toasts, logs,
    S: () => M.kit.S,
    setPos(x, y) { player = { ...player, x, y }; },
    setClock(ph, dark) { curPhase = ph; curDark = dark; },
    actors: () => M.parts.actors(),
    tick() { M.kit.cooldown(-1); M.kit.setOpen(false); loopFn(); },
    // the scene offered nearby: its label (null when none), and a tap on it
    prompt: () => { const b = sb.document.getElementById("mind-prompt"); return b.hidden ? null : b.textContent; },
    tap() { M.kit.setOpen(false); sb.document.getElementById("mind-prompt").listeners.click(); },
    choiceLabels: () => $("mind-choices").children.map((c) => c.textContent),
    choice(label) {
      const btn = $("mind-choices").children.find((c) => c.textContent === label);
      if (!btn) throw new Error(`no choice "${label}"; have: ${$("mind-choices").children.map((c) => c.textContent).join(" | ")}`);
      btn.listeners.click();
    },
    sheetLabel: () => $("mind-label").textContent,
    sheetOpen: () => !$("mind-card").hidden,
    cardOpen: () => !$("card-reveal").hidden,
    cardOk() { $("card-reveal-ok").onclick(); },
    // close every card popup that is open, in order (bounded so a loop cannot hang the test)
    drainCards() { for (let i = 0; i < 5 && !$("card-reveal").hidden; i++) this.cardOk(); },
    lines: () => $("mind-lines").children.map((p) => p.textContent),
    extraChildren: () => $("mind-extra").children,
  };
}

// The grandmother's position for the meeting, and the rice well beside her.
const PETA_AT = { x: 444, y: 374 };
const GRANNY_AT = { x: 322, y: 308 };

// ---------- petaMeet: Bi only by choice ----------
function petaStory(save) {
  const g = boot(save, { darkness: 0.6, pos: PETA_AT });
  g.tick();
  assert.equal(g.sheetOpen(), false, "walking near does not open the scene");
  assert.equal(g.prompt(), "Đến gần bóng người");
  g.tap();
  assert.equal(g.sheetLabel(), "Giữa các ngôi mộ");
  g.choice("Lại gần hỏi bà cần gì");
  return g;
}

test("petaMeet: choosing to help gives Bi and moves to the rice step", () => {
  const g = petaStory(saved({ q: { peta: { step: "none" } } }));
  assert.deepEqual(g.choiceLabels(), ["Chưa biết làm sao, nhưng muốn bà bớt đói: “Để con đi hỏi.”", "Hỏi: ai cho thì bà mới ăn được?", "Nghe xong, cúi chào rồi đi"]);
  g.choice("Chưa biết làm sao, nhưng muốn bà bớt đói: “Để con đi hỏi.”");
  assert.equal(g.S().q.peta.step, "rice");
  assert.equal(g.cardOpen(), true, "the Bi card opens");
  assert.ok(g.S().cards.bi, "Bi is recorded");
  assert.equal(g.toasts.length, 0, "the rice hint waits for the card to close");
  g.drainCards();
  assert.ok(g.toasts.some((t) => t.includes("Bà cụ ở giếng")), "the hint to ask for rice is shown after the card");
});

test("petaMeet: hearing the story and leaving gives no card and keeps the step", () => {
  const g = petaStory(saved({ q: { peta: { step: "none" } } }));
  g.choice("Nghe xong, cúi chào rồi đi");
  assert.equal(g.S().q.peta.step, "none", "step unchanged");
  assert.equal(g.S().cards.bi, undefined, "no Bi card");
  assert.equal(g.cardOpen(), false, "no card popup");
  assert.equal(g.sheetOpen(), false, "sheet closed");
  assert.ok(g.S().q.peta.snooze > Date.now(), "snoozed, so she is still there when the player comes back");
});

// ---------- grannyRice: scoop step, then the share choice ----------
function riceSetup(save = saved({ q: { peta: { step: "rice" } } })) {
  const g = boot(save, { darkness: 0, pos: GRANNY_AT });
  g.tick();
  assert.equal(g.sheetLabel(), "Giếng làng");
  return g;
}

test("grannyRice: scoop step shows three muỗng and only 'Để sau' as a choice", () => {
  const g = riceSetup();
  assert.deepEqual(g.choiceLabels(), ["Để sau"]);
  const scoops = g.extraChildren()[0].children;
  assert.equal(scoops.length, 3);
  assert.ok(scoops.every((b) => b.setAttribute && b.className === "scoop"));
});

test("grannyRice: the share choices only appear after all three scoops", async () => {
  const g = riceSetup();
  const scoops = g.extraChildren()[0].children;
  scoops[0].listeners.click();
  scoops[1].listeners.click();
  await g.sb.advance(1000);
  assert.deepEqual(g.choiceLabels(), ["Để sau"], "two scoops: still scooping");
  scoops[1].listeners.click(); // a repeat tap on a picked muỗng does nothing
  await g.sb.advance(1000);
  assert.deepEqual(g.choiceLabels(), ["Để sau"], "repeat tap does not count");
  scoops[2].listeners.click();
  await g.sb.advance(500);
  assert.deepEqual(g.choiceLabels(), ["Mang bát cơm của bà cụ đi", "Sớt cả phần cơm tối của mình vào bát, tối nay nhịn một bữa cũng được"]);
});

test("grannyRice: taking her rice alone leaves q.shared falsy", async () => {
  const g = riceSetup();
  const scoops = g.extraChildren()[0].children;
  scoops.forEach((b) => b.listeners.click());
  await g.sb.advance(500);
  g.choice("Mang bát cơm của bà cụ đi");
  assert.equal(g.S().q.peta.step, "offer");
  assert.ok(!g.S().q.peta.shared, "not shared");
  assert.equal(g.S().items.includes("bat_com"), true, "the bowl is received");
});

test("grannyRice: sharing your own evening rice sets q.shared", async () => {
  const g = riceSetup();
  const scoops = g.extraChildren()[0].children;
  scoops.forEach((b) => b.listeners.click());
  await g.sb.advance(500);
  g.choice("Sớt cả phần cơm tối của mình vào bát, tối nay nhịn một bữa cũng được");
  assert.equal(g.S().q.peta.step, "offer");
  assert.equal(g.S().q.peta.shared, true);
  assert.equal(g.S().cards.khong_tham, undefined, "no card at the rice step");
});

test("grannyRice: 'Để sau' while scooping keeps the step and gives nothing", async () => {
  const g = riceSetup();
  g.choice("Để sau");
  assert.equal(g.S().q.peta.step, "rice");
  assert.equal(g.sheetOpen(), false);
  assert.equal(g.S().items.includes("bat_com"), false, "no bowl yet");
  assert.ok(g.S().q.peta.snooze > Date.now());
});

// ---------- offerRice: the closing scene first, then cards in order ----------
function offerSetup(shared) {
  const g = boot(saved({ q: { peta: { step: "offer", shared } }, items: ["bat_com"] }), { darkness: 0 });
  g.setPos(g.K.MONK_SPOT().x, g.K.MONK_SPOT().y);
  g.tick();
  assert.equal(g.sheetLabel(), "Dâng cơm");
  g.choice("Dâng cơm, cùng hồi hướng: mong bà được no, được yên");
  return g;
}

// the closing sheet arrives 3800 ms after the chant, and no card may be showing before it
async function closingSheet(g) {
  await g.sb.advance(3900);
  assert.equal(g.sheetLabel(), "Giữa các ngôi mộ");
  assert.equal(g.cardOpen(), false, "no card cuts the scene");
  assert.equal(g.S().cards.khong_tham, undefined, "no Không tham before the player chooses");
  assert.equal(g.S().cards.tuy_hy, undefined, "no Tùy hỷ before the player chooses");
  assert.ok(g.lines().some((l) => l.includes("tan vào ánh trăng")), "the scene text is kept");
  assert.deepEqual(g.choiceLabels(), ["Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà", "Chắp tay rồi đi"]);
}

test("offerRice: shared + stay gives Không tham, then Tùy hỷ, in that order", async () => {
  const g = offerSetup(true);
  await closingSheet(g);
  g.choice("Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà");
  assert.equal(g.S().q.peta.step, "done");
  assert.equal(g.cardOpen(), true, "Không tham opens first");
  assert.ok(g.S().cards.khong_tham, "Không tham recorded");
  assert.equal(g.S().cards.tuy_hy, undefined, "Tùy hỷ waits for the first card to close");
  g.cardOk();
  assert.equal(g.cardOpen(), true, "then Tùy hỷ");
  assert.ok(g.S().cards.tuy_hy, "Tùy hỷ recorded");
  g.cardOk();
  assert.equal(g.cardOpen(), false);
  assert.equal(g.S().q.peta.shared, false, "shared flag cleared after use");
});

test("offerRice: shared + hands folded gives only Không tham", async () => {
  const g = offerSetup(true);
  await closingSheet(g);
  g.choice("Chắp tay rồi đi");
  assert.equal(g.S().q.peta.step, "done");
  assert.ok(g.S().cards.khong_tham, "Không tham recorded");
  g.drainCards();
  assert.equal(g.S().cards.tuy_hy, undefined, "no Tùy hỷ");
  assert.equal(g.S().q.peta.shared, false);
});

test("offerRice: not shared + stay gives only Tùy hỷ", async () => {
  const g = offerSetup(false);
  await closingSheet(g);
  g.choice("Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà");
  assert.equal(g.S().q.peta.step, "done");
  assert.equal(g.S().cards.khong_tham, undefined, "no Không tham when only the bowl was passed on");
  assert.ok(g.cardOpen(), "Tùy hỷ opens");
  g.drainCards();
  assert.ok(g.S().cards.tuy_hy, "Tùy hỷ recorded");
});

test("offerRice: not shared + hands folded gives no card at all", async () => {
  const g = offerSetup(false);
  await closingSheet(g);
  g.choice("Chắp tay rồi đi");
  assert.equal(g.S().q.peta.step, "done");
  assert.equal(g.cardOpen(), false, "no card");
  assert.equal(g.S().cards.khong_tham, undefined);
  assert.equal(g.S().cards.tuy_hy, undefined);
  assert.equal(g.sheetOpen(), false, "sheet closed");
});

test("offerRice: the done log line is written on both branches", async () => {
  const g = offerSetup(false);
  await closingSheet(g);
  g.choice("Chắp tay rồi đi");
  assert.ok(g.logs.includes("Đã giúp bà ngoại bên mộ thấp được an."));
});

test("the whole chain: Bi, then rice with a share, then Không tham and Tùy hỷ, with the scene uncut", async () => {
  const g = boot(saved({ q: { peta: { step: "none" } } }), { darkness: 0.6, pos: PETA_AT });
  g.tick();
  g.tap();
  g.choice("Lại gần hỏi bà cần gì");
  g.choice("Chưa biết làm sao, nhưng muốn bà bớt đói: “Để con đi hỏi.”");
  g.drainCards();
  assert.equal(g.S().q.peta.step, "rice");
  g.setPos(GRANNY_AT.x, GRANNY_AT.y);
  g.tick();
  const scoops = g.extraChildren()[0].children;
  scoops.forEach((b) => b.listeners.click());
  await g.sb.advance(500);
  g.choice("Sớt cả phần cơm tối của mình vào bát, tối nay nhịn một bữa cũng được");
  assert.equal(g.S().q.peta.shared, true);
  g.setPos(g.K.MONK_SPOT().x, g.K.MONK_SPOT().y);
  g.tick();
  g.choice("Dâng cơm, cùng hồi hướng: mong bà được no, được yên");
  await closingSheet(g);
  g.choice("Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà");
  g.drainCards();
  assert.equal(g.S().q.peta.step, "done");
  assert.ok(g.S().cards.bi && g.S().cards.khong_tham && g.S().cards.tuy_hy);
});

// =====================================================================================
// The two-beats rhythm for characters with the world clock (api.phase exists):
// night: meet and ask -> morning: rice into the monk's bowl -> dusk: the grandmother is at peace.
// =====================================================================================
const ALMS_AT = { x: 212, y: 214 }; // spot.alms(): village + (12, 14)
const NIGHT = { phase: "Canh hai", darkness: 0.6 };
const MORNING = { phase: "Sáng sớm", darkness: 0 };
const DUSK_AT = { x: 444, y: 374 };
const hasPeta = (g) => g.actors().some((a) => a.kind === "peta");
// the seated monk at the graves comes from mind.js once the dog errand is finished; this quest only adds the one in the lane
const monks = (g) => g.actors().filter((a) => a.kind === "monk" && !(a.x === g.K.MONK_SPOT().x && a.y === g.K.MONK_SPOT().y));

test("two beats, meeting: the grandmother does not explain how to help; leaving gives nothing", () => {
  const g = boot(saved({ q: { peta: { step: "none" } } }), { ...NIGHT, pos: PETA_AT });
  g.tick();
  g.tap();
  const all = [];
  all.push(...g.lines());
  g.choice("Lại gần hỏi bà cần gì");
  all.push(...g.lines());
  g.choice("Hỏi: ai cho thì bà mới ăn được?");
  assert.deepEqual(g.lines(), ["“Bà không biết. Bà chỉ biết đói.”"]);
  all.push(...g.lines());
  g.choice("Quay lại");
  assert.deepEqual(g.choiceLabels().length, 3, "back at the second sheet");
  assert.ok(g.lines()[1].includes("cơm người ta để đó"));
  assert.ok(!all.join(" ").includes("hồi hướng") && !all.join(" ").includes("tiếc từng hạt"));
  g.choice("Nghe xong, cúi chào rồi đi");
  assert.equal(g.S().q.peta.step, "none");
  assert.equal(g.S().cards.bi, undefined);
  assert.equal(g.cardOpen(), false);
  assert.equal(g.sheetOpen(), false);
});

test("two beats, meeting: 'Lùi lại, để hôm khác' closes with no state change", () => {
  const g = boot(saved({ q: { peta: { step: "none" } } }), { ...NIGHT, pos: PETA_AT });
  g.tick();
  g.tap();
  g.choice("Lùi lại, để hôm khác");
  assert.equal(g.sheetOpen(), false);
  assert.equal(g.S().q.peta.step, "none");
  assert.equal(g.S().q.peta.snooze, undefined);
  assert.equal(g.cardOpen(), false);
});

test("two beats, meeting: the help choice gives Bi and step rice", () => {
  const g = boot(saved({ q: { peta: { step: "none" } } }), { ...NIGHT, pos: PETA_AT });
  g.tick();
  g.tap();
  g.choice("Lại gần hỏi bà cần gì");
  g.choice("Chưa biết làm sao, nhưng muốn bà bớt đói: “Để con đi hỏi.”");
  assert.equal(g.S().q.peta.step, "rice");
  assert.ok(g.cardOpen());
  g.drainCards();
  assert.ok(g.S().cards.bi);
  assert.ok(g.toasts.some((t) => t.includes("Bà cụ ở giếng sống ở làng lâu nhất")));
});

test("two beats, the well at night: explanation only, no rice; a second visit is one short line", () => {
  const g = boot(saved({ q: { peta: { step: "rice" } } }), { ...NIGHT, pos: GRANNY_AT });
  g.tick();
  assert.equal(g.sheetLabel(), "Giếng làng");
  assert.equal(g.extraChildren().length, 0, "no scooping at night");
  assert.deepEqual(g.choiceLabels(), ["Hỏi: vậy giờ con mang cơm ra cho sư được không?"]);
  g.choice("Hỏi: vậy giờ con mang cơm ra cho sư được không?");
  assert.ok(g.lines()[0].includes("Sáng mai sư ôm bát"));
  g.choice("Dạ, sáng mai con ra");
  assert.equal(g.S().q.peta.told, true);
  assert.equal(g.S().q.peta.step, "rice");
  assert.equal(g.S().items.includes("bat_com"), false);
  assert.equal(g.sheetOpen(), false);
  assert.ok(g.S().q.peta.snooze > Date.now());
  g.S().q.peta.snooze = 0;
  g.tick();
  assert.deepEqual(g.lines(), ["“Sáng mai nhé con. Bà để dành gạo rồi.”"]);
  g.choice("Dạ");
  assert.equal(g.S().q.peta.step, "rice");
  assert.equal(g.sheetOpen(), false);
});

test("two beats, the well in the morning: scoop, share, receive the bowl, step offer", async () => {
  const g = boot(saved({ q: { peta: { step: "rice", told: true } } }), { ...MORNING, pos: GRANNY_AT });
  g.tick();
  assert.deepEqual(g.lines()[0], "“Cơm mới chín đó con.”");
  g.extraChildren()[0].children.forEach((b) => b.listeners.click());
  await g.sb.advance(500);
  assert.ok(g.lines()[1].includes("bữa sáng"));
  assert.deepEqual(g.choiceLabels(), ["Mang bát cơm của bà cụ đi", "Sớt cả phần cơm sáng của mình vào bát, sáng nay nhịn một bữa cũng được"]);
  g.choice("Sớt cả phần cơm sáng của mình vào bát, sáng nay nhịn một bữa cũng được");
  assert.equal(g.S().q.peta.step, "offer");
  assert.equal(g.S().q.peta.shared, true);
  assert.ok(g.S().items.includes("bat_com"));
});

test("two beats, the well in the morning before being told repeats the explanation in her words", () => {
  const g = boot(saved({ q: { peta: { step: "rice" } } }), { ...MORNING, pos: GRANNY_AT });
  g.tick();
  assert.ok(g.lines()[0].startsWith("Bà cụ nghe chuyện, gật gù"));
});

test("two beats, offer at night: nothing opens at the graves nor in the lane, and no monk is listed", () => {
  const g = boot(saved({ q: { peta: { step: "offer" } }, items: ["bat_com"] }), { ...NIGHT });
  g.setPos(g.K.MONK_SPOT().x, g.K.MONK_SPOT().y);
  g.tick();
  assert.equal(g.sheetOpen(), false);
  g.setPos(ALMS_AT.x, ALMS_AT.y);
  g.tick();
  assert.equal(g.sheetOpen(), false);
  assert.equal(monks(g).length, 0);
});

test("two beats, offer in the morning: the monk is in the lane, the sheet opens there and not at the graves", () => {
  const g = boot(saved({ q: { peta: { step: "offer" } }, items: ["bat_com"] }), { ...MORNING });
  assert.equal(JSON.stringify(monks(g).map((m) => [m.x, m.y])), JSON.stringify([[ALMS_AT.x, ALMS_AT.y]]));
  g.setPos(g.K.MONK_SPOT().x, g.K.MONK_SPOT().y);
  g.tick();
  assert.equal(g.sheetOpen(), false, "the graves are not where the bowl is given any more");
  g.setPos(ALMS_AT.x, ALMS_AT.y);
  g.tick();
  assert.equal(g.sheetLabel(), "Dâng cơm");
});

function dedicate(shared) {
  const g = boot(saved({ q: { peta: { step: "offer", shared } }, items: ["bat_com"] }), { ...MORNING, pos: ALMS_AT });
  g.tick();
  g.choice("Đặt cơm vào bát, cùng hồi hướng: mong bà được no, được yên");
  assert.equal(g.sheetLabel(), "Ngõ làng");
  assert.equal(g.S().items.includes("bat_com"), false, "the bowl is given away");
  g.choice("Chắp tay tiễn sư");
  return g;
}

test("two beats, dedication with the player's own share gives Không tham, no cinematic, no Tùy hỷ", async () => {
  const g = dedicate(true);
  assert.equal(g.S().q.peta.step, "dedicated");
  assert.ok(g.cardOpen());
  assert.ok(g.S().cards.khong_tham);
  g.drainCards();
  assert.equal(g.S().cards.tuy_hy, undefined);
  assert.equal(g.S().q.peta.shared, false);
  await g.sb.advance(4000);
  assert.equal(g.sheetOpen(), false, "no cinematic in the lane");
  assert.ok(g.logs.includes("Đã đặt cơm vào bát của sư già và hồi hướng cho bà ngoại."));
  assert.ok(g.toasts.some((t) => t.includes("Chạng vạng, quay lại ngôi mộ thấp")));
  g.setClock("Canh hai", 0.6);
  assert.equal(hasPeta(g), true, "the grandmother is still at the grave");
});

test("two beats, dedication without a share gives no card", () => {
  const g = dedicate(false);
  assert.equal(g.S().q.peta.step, "dedicated");
  assert.equal(g.cardOpen(), false);
  assert.equal(g.S().cards.khong_tham, undefined);
  assert.ok(g.toasts.some((t) => t.includes("Chạng vạng, quay lại ngôi mộ thấp")));
});

function releaseAtDusk() {
  const g = boot(saved({ q: { peta: { step: "dedicated" } } }), { phase: "Sáng", darkness: 0.1, pos: DUSK_AT });
  g.tick();
  assert.equal(g.sheetOpen(), false, "nothing opens in daylight");
  assert.equal(g.S().q.peta.step, "dedicated");
  g.setClock("Hoàng hôn", 0.45);
  assert.equal(hasPeta(g), true, "she is visible at dusk");
  g.tick();
  return g;
}

test("two beats, dusk at the grave: the cinematic runs, staying gives Tùy hỷ, and the log is written once", async () => {
  const g = releaseAtDusk();
  assert.equal(g.sheetOpen(), false, "the cinematic waits for the bell");
  await g.sb.advance(3900);
  assert.equal(g.sheetLabel(), "Giữa các ngôi mộ");
  assert.equal(g.cardOpen(), false);
  assert.deepEqual(g.choiceLabels(), ["Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà", "Chắp tay rồi đi"]);
  assert.ok(!g.lines().join(" ").match(/siêu thoát|giải thoát|Lành thay/));
  g.choice("Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà");
  assert.equal(g.S().q.peta.step, "done");
  g.drainCards();
  assert.ok(g.S().cards.tuy_hy);
  assert.equal(g.logs.filter((l) => l === "Đã giúp bà ngoại bên mộ thấp được an.").length, 1);
  assert.ok(g.toasts.some((t) => t.includes("Bà không còn ở đó nữa")));
});

test("two beats, dusk at the grave: hands folded gives no card", async () => {
  const g = releaseAtDusk();
  await g.sb.advance(3900);
  g.choice("Chắp tay rồi đi");
  assert.equal(g.S().q.peta.step, "done");
  assert.equal(g.cardOpen(), false);
  assert.equal(g.S().cards.tuy_hy, undefined);
  assert.ok(g.toasts.some((t) => t.includes("Bà không còn ở đó nữa")));
});

test("two beats, the whole chain gives Bi, then Không tham, then Tùy hỷ in that order", async () => {
  const g = boot(saved({ q: { peta: { step: "none" } } }), { ...NIGHT, pos: PETA_AT });
  g.tick();
  g.tap();
  g.choice("Lại gần hỏi bà cần gì");
  g.choice("Chưa biết làm sao, nhưng muốn bà bớt đói: “Để con đi hỏi.”");
  g.drainCards();
  assert.deepEqual(Object.keys(g.S().cards), ["bi"]);
  // the well, still night: only the explanation
  g.setPos(GRANNY_AT.x, GRANNY_AT.y);
  g.tick();
  g.choice("Hỏi: vậy giờ con mang cơm ra cho sư được không?");
  g.choice("Dạ, sáng mai con ra");
  assert.equal(g.cardOpen(), false, "no card at the explanation");
  // morning: rice with a share
  g.setClock("Sáng sớm", 0);
  g.S().q.peta.snooze = 0;
  g.tick();
  g.extraChildren()[0].children.forEach((b) => b.listeners.click());
  await g.sb.advance(500);
  g.choice("Sớt cả phần cơm sáng của mình vào bát, sáng nay nhịn một bữa cũng được");
  g.setPos(ALMS_AT.x, ALMS_AT.y);
  g.tick();
  g.choice("Đặt cơm vào bát, cùng hồi hướng: mong bà được no, được yên");
  g.choice("Chắp tay tiễn sư");
  g.drainCards();
  // dusk: the grave
  g.setClock("Hoàng hôn", 0.45);
  g.setPos(DUSK_AT.x, DUSK_AT.y);
  g.tick();
  await g.sb.advance(3900);
  g.choice("Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà");
  g.drainCards();
  assert.equal(g.S().q.peta.step, "done");
  assert.deepEqual(Object.keys(g.S().cards), ["bi", "khong_tham", "tuy_hy"]);
});

test("old saves: step offer from before the two beats still works on the clock in the morning", () => {
  const g = boot(saved({ q: { peta: { step: "offer", shared: false } }, items: ["bat_com"] }), { ...MORNING, pos: ALMS_AT });
  g.tick();
  assert.equal(g.sheetLabel(), "Dâng cơm");
});

test("legacy path (no clock): the whole old single-night chain still completes in one visit", async () => {
  const g = boot(saved({ q: { peta: { step: "rice" } } }), { darkness: 0.6, pos: GRANNY_AT });
  g.tick();
  g.extraChildren()[0].children.forEach((b) => b.listeners.click());
  await g.sb.advance(500);
  g.choice("Sớt cả phần cơm tối của mình vào bát, tối nay nhịn một bữa cũng được");
  assert.ok(g.toasts.some((t) => t.includes("Đem bát cơm dâng vị sư già ở nghĩa địa.")));
  g.setPos(g.K.MONK_SPOT().x, g.K.MONK_SPOT().y);
  g.tick();
  assert.equal(g.lines()[0], "Sư già đưa hai tay nhận bát cơm.");
  g.choice("Dâng cơm, cùng hồi hướng: mong bà được no, được yên");
  await g.sb.advance(3900);
  g.choice("Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà");
  g.drainCards();
  assert.equal(g.S().q.peta.step, "done");
  assert.ok(g.S().cards.khong_tham && g.S().cards.tuy_hy);
});
