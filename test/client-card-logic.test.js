// Card-logic fixes (checklist B1-B7): a good card is given only when the choice itself carries the motive.
// Loads milestones.js, mind.js and encounters.js in one sandbox and drives the proximity loop by hand.
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

// A saved person. quest defaults to finished so no dog or errand interferes unless a test sets it.
const saved = (over = {}) => ({
  cards: {}, carita: null, surveySkipped: false, stats: { ...NEUTRAL_STATS },
  quest: { step: "done", hit: true }, q: {}, items: [], deva: { pity: 0, last: 0, seen: 0 },
  milestones: {}, msCounts: {}, village: { deeds: {} }, ...over,
});

function boot(save, { role = "villager", darkness = 0, mood = 0.6, pos = { x: 0, y: 0 } } = {}) {
  const sb = makeSandbox();
  const els = {};
  const toasts = [], goes = [], mods = [];
  let player = { x: pos.x, y: pos.y, moving: false };
  let loopFn = null;
  sb.document = { visibilityState: "visible", addEventListener() {}, getElementById: (id) => (els[id] ||= node()), createElement: () => node(), createElementNS: () => node(), querySelector: () => node(), querySelectorAll: () => [] };
  sb.performance = { now: () => Date.now() };
  // mind.js starts its proximity loop at 250 ms; encounters.js starts another timer at 500 ms
  sb.setInterval = (fn, ms) => { if (ms === 250) loopFn = fn; return 0; };
  sb.clearInterval = () => {};
  sb.World = {
    PLACES: PLACES(),
    getMap: () => ({ path: [[0, 0], [1000, 0]], caveFound: false }),
    getPlayer: () => player,
    setPlayer(x, y) { player = { ...player, x, y }; },
    setActors() {}, setFx() {}, stop() {}, lookAt() {}, resetLook() {}, setView() {},
  };
  sb.Save = { get: () => (save == null ? null : JSON.stringify(save)), set() {}, log() {} };
  load(sb, "milestones.js");
  sb.Milestones.reveal = () => {}; // the milestone overlay is UI only; these tests check the logic
  load(sb, "mind.js");
  const M = sb.Mind;
  const api = {
    busy: () => false, darkness: () => darkness, mood: () => mood, sound: () => false,
    toast: (t) => toasts.push(t), refresh() {}, swingMood() {}, goTo: (x, y) => goes.push([x, y]), day: () => 1, setPose() {},
  };
  M.init(api);
  // capture every module registered by encounters.js (wrap register before the file runs)
  const reg = M.register;
  M.register = (m) => { mods.push(m); reg(m); };
  load(sb, "encounters.js");
  M.onRoleStart(role, () => {});

  const $ = (id) => sb.document.getElementById(id);
  // as in the page's HTML: the sheet and the card reveal start hidden
  $("mind-card").hidden = true;
  $("card-reveal").hidden = true;
  const b = {
    sb, M, K: M.kit, toasts, goes, mods, els,
    S: () => M.kit.S,
    setPos(x, y) { player = { ...player, x, y }; },
    // one pass of the proximity loop, as if 250 ms had passed and nothing was open
    tick() { M.kit.cooldown(-1); M.kit.setOpen(false); loopFn(); },
    // the scene offered nearby: its label (null when none), and a tap on it
    prompt: () => { const b = sb.document.getElementById("mind-prompt"); return b.hidden ? null : b.textContent; },
    tap() { M.kit.setOpen(false); sb.document.getElementById("mind-prompt").listeners.click(); },
    choiceLabels: () => $("mind-choices").children.map((c) => c.textContent),
    choice(label) {
      const btn = $("mind-choices").children.find((c) => c.textContent === label);
      if (!btn) throw new Error(`no choice "${label}"; have: ${b.choiceLabels().join(" | ")}`);
      btn.listeners.click();
    },
    sheetLabel: () => $("mind-label").textContent,
    sheetOpen: () => !$("mind-card").hidden,
    cardOpen: () => !$("card-reveal").hidden,
    cardOk() { $("card-reveal-ok").onclick(); },
    lines: () => $("mind-lines").children.map((p) => p.textContent),
  };
  return b;
}

// ---------- B1: the grandmother's story no longer gives Bỏn xẻn ----------
test("B1: hearing the grandmother's story gives no Bỏn xẻn; choosing to help gives Bi and opens the rice errand", () => {
  const g = boot(saved({ q: { peta: { step: "none" } } }), { darkness: 0.6, pos: { x: 444, y: 374 } });
  g.tick();
  g.tap();
  assert.equal(g.sheetLabel(), "Giữa các ngôi mộ");
  g.choice("Lại gần hỏi bà cần gì");
  g.choice("Chưa biết làm sao, nhưng muốn bà bớt đói: “Để con đi hỏi.”");
  assert.equal(g.S().q.peta.step, "rice");
  assert.equal(g.S().cards.bon_xen, undefined, "no Bỏn xẻn card");
  assert.ok(g.cardOpen(), "the Bi card opens (chosen help)");
  g.cardOk();
  assert.ok(g.S().cards.bi, "Bi is recorded");
  assert.equal(g.cardOpen(), false, "card closed");
  assert.equal(g.sheetOpen(), false, "sheet closed");
  assert.ok(g.toasts.some((t) => t.includes("Bà cụ ở giếng")), "the hint to ask for rice is shown");
  // the next step runs straight from the loop, with no award callback in between
  g.setPos(322, 308);
  g.tick();
  assert.equal(g.sheetLabel(), "Giếng làng");
});

// ---------- B2: Tùy hỷ only after comforting the child ----------
function childSetup(choiceAtFound) {
  const g = boot(saved({ q: { tree: { step: "child" } } }), { darkness: 0, pos: { x: 86, y: 130 } });
  g.tick();
  assert.equal(g.sheetLabel(), "Bụi tre");
  g.choice(choiceAtFound);
  return g;
}

test("B2: a child who was shouted at goes home with no Tùy hỷ", () => {
  const g = childSetup("Quát cho nó nín: “Về nhà ngay!”");
  assert.equal(g.S().q.tree.scared, true);
  g.cardOk(); // the Sân card from shouting
  assert.equal(g.S().q.tree.step, "follow");
  g.setPos(252, 214);
  g.tick();
  assert.equal(g.sheetLabel(), "Ngõ làng");
  assert.deepEqual(g.choiceLabels(), ["Nói nhỏ: lúc nãy lỡ to tiếng với bé", "Gật đầu rồi đi"], "no choice here leads to Tùy hỷ");
  g.choice("Gật đầu rồi đi");
  assert.equal(g.S().cards.tuy_hy, undefined, "no Tùy hỷ");
  assert.equal(g.cardOpen(), false);
  assert.equal(g.S().q.tree.step, "thank", "the rest of the errand still moves on");
  assert.equal(g.S().q.tree.scared, false, "scared flag is cleared once the child is home");
  assert.ok(g.toasts.some((t) => t.includes("chạng vạng")), "the return hint is still shown");
});

test("B2: owning up to the shouting gives no card either; the mother answers and the errand moves on", () => {
  const g = childSetup("Quát cho nó nín: “Về nhà ngay!”");
  g.cardOk();
  g.setPos(252, 214);
  g.tick();
  g.choice("Nói nhỏ: lúc nãy lỡ to tiếng với bé");
  assert.equal(g.S().cards.tuy_hy, undefined);
  assert.equal(g.S().cards.khong_san, undefined);
  assert.equal(g.cardOpen(), false);
  assert.equal(g.S().q.tree.step, "thank");
  assert.equal(g.S().q.tree.repaired, true);
  assert.ok(g.toasts.some((t) => t.includes("Về được là mừng rồi")));
});

test("B2 / R3: a comforted child at home gives Tùy hỷ only when the player chooses to stay and be glad", () => {
  const g = childSetup("Ngồi xuống ngang tầm, cho bé bớt sợ");
  g.cardOk();
  g.setPos(252, 214);
  g.tick();
  g.choice("Gật đầu chào rồi đi");
  assert.equal(g.S().cards.tuy_hy, undefined, "leaving gives no Tùy hỷ");
  assert.equal(g.cardOpen(), false);
  assert.equal(g.S().q.tree.step, "thank");
});

test("B2: a child who was comforted still gives Tùy hỷ at home", () => {
  const g = childSetup("Ngồi xuống ngang tầm, cho bé bớt sợ");
  assert.equal(g.S().q.tree.scared, false, "not scared");
  g.cardOk(); // the Bi card from comforting
  assert.equal(g.S().q.tree.step, "follow");
  g.setPos(252, 214);
  g.tick();
  g.choice("Đứng lại nhìn hai mẹ con một lát, mừng cho họ");
  assert.equal(g.cardOpen(), true, "the Tùy hỷ card opens");
  g.cardOk();
  assert.ok(g.S().cards.tuy_hy, "Tùy hỷ is recorded");
  assert.equal(g.S().q.tree.step, "thank");
});

// ---------- B3 / B6: herbs go to the grandmother; no ông Tư branch, no Không tham for the gift ----------
test("B3: giving the herbs to the grandmother gives no Không tham and goes on to the monk", () => {
  const g = boot(saved({ quest: { step: "deliver", to: "granny", hit: true }, items: ["rau_ma"] }), { pos: { x: 300, y: 300 } });
  const tham = g.S().stats.tham;
  g.tick();
  assert.equal(g.sheetLabel(), "Giếng làng");
  g.choice("Tiếp");
  assert.equal(g.S().cards.khong_tham, undefined, "no Không tham card");
  assert.equal(g.cardOpen(), false);
  assert.equal(g.S().quest.step, "monk");
  assert.equal(g.S().items.includes("rau_ma"), false, "the herbs are handed over");
  assert.ok(g.S().stats.tham < tham, "the gift still softens Tham");
  assert.ok(g.toasts.some((t) => t.includes("Trời tối dần")), "afterGift toast is shown");
});

test("B6: an old save with quest.to === 'tu' is delivered to the grandmother, not stuck", () => {
  const g = boot(saved({ quest: { step: "deliver", to: "tu", hit: true }, items: ["rau_ma"] }), { pos: { x: 300, y: 300 } });
  g.tick();
  assert.equal(g.sheetLabel(), "Giếng làng", "the grandmother's sheet, not ông Tư's");
  g.choice("Tiếp");
  assert.equal(g.S().cards.khong_san, undefined, "no Không sân card");
  assert.equal(g.S().quest.step, "monk");
});

test("B6: the errand list for an old 'tu' save points at the well, not at ông Tư", () => {
  const g = boot(saved({ quest: { step: "deliver", to: "tu", hit: true }, items: ["rau_ma"] }));
  const list = g.M.questList();
  const titles = list.map((q) => q.title);
  assert.ok(titles.includes("Mang rau về cho bà cụ"), titles.join(" | "));
  assert.equal(titles.some((t) => t.includes("ông Tư")), false, titles.join(" | "));
  const errand = list.find((q) => q.title === "Mang rau về cho bà cụ");
  assert.equal(errand.x, 300);
});

// ---------- B5 / B6: the herb patch offers no ông Tư branch; keeping the herbs gives no Tham ----------
test("B5/B6: at the herb patch the choices are granny or keep, and keeping gives no Tham card", async () => {
  const g = boot(saved({ quest: { step: "herb", hit: true } }), { pos: { x: 500, y: 500 } });
  const tham = g.S().stats.tham;
  g.tick();
  assert.equal(g.sheetLabel(), "Gốc mít");
  const herbs = g.els["mind-extra"].children[0].children;
  assert.equal(herbs.length, 6);
  for (const h of herbs) h.listeners.click();
  await g.sb.advance(500); // picked() runs after a short pause
  assert.deepEqual(g.choiceLabels(), ["Mang về cho bà cụ", "Giữ lại nấu canh"]);
  g.choice("Giữ lại nấu canh");
  assert.equal(g.S().quest.step, "monk");
  assert.equal(g.S().cards.tham, undefined, "no Tham card for keeping the herbs");
  assert.equal(g.S().stats.tham, tham, "keeping the herbs does not raise Tham");
  assert.equal(g.cardOpen(), false);
  assert.ok(g.toasts.some((t) => t.includes("ánh đèn giữa nghĩa địa")), "the lantern hint is shown");
  assert.equal(g.S().items.includes("rau_ma"), true, "the herbs stay in hand");
});

// ---------- B4: the trader's bánh đa gift gives no Không tham ----------
test("B4: giving the trader herbs for bánh đa gives no Không tham and only a cooldown", () => {
  const g = boot(saved({ items: ["rau_ma"] }), { darkness: 0, pos: { x: 0, y: 0 } });
  // the trader's stub popup: an item already "received" closes at once, like the real Items.showReceived
  g.sb.Items = { def: () => ({ name: "Bánh đa" }), showReceived: (id, cb) => cb() };
  const cart = g.mods[g.mods.length - 1]; // the cart module is the last one encounters.js registers
  g.sb.Cart.spawn();
  cart.fx({}, { dayMix: 1, time: 0 }, 0.01);
  const at = cart.targets()[0];
  g.setPos(at.x - 30, at.y - 10); // stand beside the cart
  const tham = g.S().stats.tham;
  g.tick();
  assert.equal(g.sheetLabel(), "Xe ngựa");
  g.choice("Tặng ông nắm rau má");
  assert.equal(g.S().items.includes("banh_da"), true, "bánh đa received");
  assert.equal(g.S().items.includes("rau_ma"), false, "herbs handed over");
  assert.equal(g.S().cards.khong_tham, undefined, "no Không tham card");
  assert.equal(g.cardOpen(), false);
  assert.ok(g.S().stats.tham < tham, "the trade still softens Tham");
});

// ---------- B7: the survey asks a situation, not how fast you tap ----------
test("B7: survey step 1 is a choice sheet with a 'Để sau' option, no timer and no leaves", () => {
  const g = boot(saved(), { role: "monk" });
  g.M.startSurvey();
  assert.equal(g.sheetLabel(), "Khảo sát tính cách");
  assert.deepEqual(g.lines(), ["Sân chùa đầy lá. Sư nhờ bạn quét giúp.", "Bạn thường làm thế nào?"]);
  assert.deepEqual(g.choiceLabels(), [
    "Quét thật kỹ từng góc, khó dừng tay", "Quét thật nhanh cho xong, hơi gắt tay", "Quét lơ đãng, chỗ này chỗ kia",
    "Quét một lúc rồi nghĩ ra việc khác, bỏ dở", "Quét chậm, lòng thấy trang nghiêm", "Chia sân từng khu, làm lần lượt", "Để sau",
  ]);
  assert.equal(g.els["mind-extra"].children.length, 0, "no sweeping area");
  assert.equal(g.sb.pendingTimers(), 0, "no timer runs for the survey");
});

test("B7: 'Để sau' on step 1 sets surveySkipped and saves", () => {
  const g = boot(saved(), { role: "monk" });
  g.M.startSurvey();
  g.choice("Để sau");
  assert.equal(g.S().surveySkipped, true);
  assert.equal(g.sheetOpen(), false);
  assert.equal(g.M.questList().at(-1).skipped, true);
});

test("B7: the answers alone decide the temperament; the result screen is unchanged", () => {
  const g = boot(saved(), { role: "monk" });
  g.M.startSurvey();
  g.choice("Quét chậm, lòng thấy trang nghiêm");
  g.choice("Hái dâng lên Phật");
  g.choice("Chắp tay cảm ơn người nấu");
  assert.equal(g.sheetLabel(), "Tính cách của người này");
  assert.equal(g.M.parts.current().carita, "tin");
  assert.ok(g.lines()[0].includes("dễ tin, dễ cảm động"));
});
