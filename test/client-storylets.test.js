// Storylets (việc trong đêm): pure selection rules, then the module part driven by hand in a sandbox
// (same pattern as client-card-logic.test.js). Arrays and objects made inside the vm are compared through JSON.
const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const J = (x) => JSON.parse(JSON.stringify(x));

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

const DEF = (over) => ({
  id: "x", kind: "side", weight: 1, roles: ["villager"], needs: [], phases: [], place: "village", placeName: "Ngõ làng",
  radius: 60, title: "t", body: "b", scene: { label: "L", lines: { default: ["d"] }, choices: [] }, ...over,
});

// The pure part only; the module half is loaded with a stub Mind so the file can run.
function pure() {
  const sb = makeSandbox();
  sb.Mind = { kit: {}, register() {} };
  load(sb, "storylets.js");
  return sb.Storylets;
}

const NEUTRAL_STATS = { tin: 40, tan: 40, niem: 33, dinh: 33, tue: 37, tham: 35, san: 31, si: 33 };
const saved = (over = {}) => ({
  cards: {}, carita: null, surveySkipped: false, stats: { ...NEUTRAL_STATS },
  quest: { step: "done", hit: true }, q: {}, items: [], deva: { pity: 0, last: 0, seen: 0 },
  milestones: {}, msCounts: {}, village: { deeds: {} }, ...over,
});
const PLACES = () => ({
  village: { x: 200, y: 200, name: "Ngõ làng" }, hermitage: { x: 600, y: 600, name: "Tịnh thất" },
  ao: { x: 50, y: 50, name: "Ao sen" }, gao: { x: -500, y: -500 }, bamboo: { x: 100, y: 100 }, well: { x: 300, y: 300 },
  graves: { x: 400, y: 400 }, mit: { x: 500, y: 500 }, gate: { x: 700, y: 700 },
});

// A sandbox with mind.js, milestones.js and storylets.js loaded; the test drives the loop by hand.
function boot({ save = saved(), role = "villager", phase = "Chiều tàn", day = 1, runId = "run-1", pos = { x: 0, y: 0 } } = {}) {
  const sb = makeSandbox();
  const els = {};
  const logs = [], toasts = [];
  const now = { phase, day, runId };
  let player = { x: pos.x, y: pos.y, moving: false };
  let loopFn = null;
  sb.document = { visibilityState: "visible", addEventListener() {}, getElementById: (id) => (els[id] ||= node()), createElement: () => node(), createElementNS: () => node(), querySelector: () => node(), querySelectorAll: () => [] };
  sb.performance = { now: () => Date.now() };
  sb.setInterval = (fn, ms) => { if (ms === 250) loopFn = fn; return 0; };
  sb.clearInterval = () => {};
  sb.World = {
    PLACES: PLACES(), getMap: () => ({ path: [[0, 0], [1000, 0]], caveFound: false }),
    getPlayer: () => player, setPlayer(x, y) { player = { ...player, x, y }; },
    setActors() {}, setFx() {}, stop() {}, lookAt() {}, resetLook() {}, setView() {},
  };
  sb.Save = { get: () => (save == null ? null : JSON.stringify(save)), set() {}, log: (t) => logs.push(t) };
  load(sb, "milestones.js");
  sb.Milestones.reveal = () => {};
  load(sb, "mind.js");
  const M = sb.Mind;
  M.init({
    busy: () => false, darkness: () => 0, mood: () => 0.6, sound: () => false,
    toast: (t) => toasts.push(t), refresh() {}, swingMood() {}, goTo() {}, day: () => now.day,
    phase: () => now.phase, runId: () => now.runId, setPose() {},
  });
  load(sb, "storylets.js");
  M.onRoleStart(role, () => {});
  const $ = (id) => sb.document.getElementById(id);
  $("mind-card").hidden = true;
  $("card-reveal").hidden = true;
  return {
    sb, M, logs, toasts,
    S: () => M.kit.S,
    setPos(x, y) { player = { ...player, x, y }; },
    set(over) { Object.assign(now, over); },
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
    lines: () => $("mind-lines").children.map((p) => p.textContent),
  };
}

// ---------- pure: eligibility ----------
test("eligible: role, phase, once, cooldown and needs decide who can be offered", () => {
  const S = pure();
  const defs = [
    DEF({ id: "a" }),
    DEF({ id: "monk_only", roles: ["monk"] }),
    DEF({ id: "night", phases: ["Canh hai"] }),
    DEF({ id: "once", once: true }),
    DEF({ id: "cool", cooldownDays: 2 }),
    DEF({ id: "needs", needs: ["a"] }),
    DEF({ id: "any", phases: [] }),
  ];
  const ids = (ctx) => S.eligible(defs, ctx).map((d) => d.id).join(",");
  const ctx = (over) => ({ role: "villager", phase: "Sáng", day: 5, state: { done: {}, tonight: { runId: null, ids: [] } }, ...over });
  assert.equal(ids(ctx({})), "a,once,cool,any", "nothing done yet: needs waits for a");
  assert.equal(ids(ctx({ phase: null })), "", "no phase, nothing offered");
  assert.equal(ids(ctx({ phase: "Canh hai" })), "a,night,once,cool,any", "declaration order is kept");
  const done = { a: { n: 1, lastDay: 5 }, once: { n: 1, lastDay: 5 }, cool: { n: 1, lastDay: 4 } };
  assert.equal(ids(ctx({ state: { done, tonight: { runId: null, ids: [] } } })), "a,needs,any", "once is finished; cool is within 2 days");
  assert.equal(ids(ctx({ day: 6, state: { done, tonight: { runId: null, ids: [] } } })), "a,cool,needs,any", "cool is back after 2 days");
  assert.equal(ids(ctx({ role: "monk" })), "monk_only", "role must match");
});

// ---------- pure: the tonight offer ----------
test("offered: at most two side errands a night, mains always kept, stable for one seed", () => {
  const S = pure();
  const sides = ["s1", "s2", "s3", "s4"].map((id) => DEF({ id }));
  const main = DEF({ id: "m1", kind: "main" });
  const ctx = (over = {}) => ({ role: "villager", phase: "Sáng", day: 1, state: { done: {}, tonight: { runId: null, ids: [] } }, ...over });
  const pick = (c, seed, defs) => S.offered(defs, c, seed).map((d) => d.id);

  const first = pick(ctx(), "run-1", [main, ...sides]);
  assert.equal(first.filter((id) => id.startsWith("s")).length, 2, "exactly two side errands");
  assert.equal(first[0], "m1", "the main errand comes first");
  assert.equal(first.length, 3);
  assert.equal(pick(ctx(), "run-1", [main, ...sides]).join(","), first.join(","), "same seed, same picks");

  const seen = new Set();
  for (let i = 0; i < 20; i++) seen.add(pick(ctx(), "seed" + i, sides).join(","));
  assert.ok(seen.size > 1, "another seed gives another pair");

  const manyMains = [DEF({ id: "m1", kind: "main" }), DEF({ id: "m2", kind: "main" }), DEF({ id: "m3", kind: "main" })];
  assert.equal(pick(ctx(), "run-1", [...manyMains, ...sides]).filter((id) => id.startsWith("m")).length, 3, "mains are not limited");
});

test("offered: the side quota shrinks with what is already done tonight, and another run starts fresh", () => {
  const S = pure();
  const sides = ["s1", "s2", "s3"].map((id) => DEF({ id }));
  const main = DEF({ id: "m1", kind: "main" });
  const ctx = (tonight) => ({ role: "villager", phase: "Sáng", day: 1, state: { done: {}, tonight }});
  const pick = (c, seed) => S.offered([main, ...sides], c, seed).map((d) => d.id);

  const one = pick(ctx({ runId: "run-1", ids: ["s9"] }), "run-1");
  assert.equal(one.filter((id) => id.startsWith("s")).length, 1, "one already done: one more side at most");
  const two = pick(ctx({ runId: "run-1", ids: ["s9", "s8"] }), "run-1");
  assert.deepEqual(two, ["m1"], "two done: no more sides, the main stays");
  const old = pick(ctx({ runId: "old", ids: ["s9", "s8"] }), "run-1");
  assert.equal(old.filter((id) => id.startsWith("s")).length, 2, "a record from another run is ignored");
  const doneOne = pick(ctx({ runId: "run-1", ids: ["s1"] }), "run-1");
  assert.equal(doneOne.includes("s1"), false, "an errand already completed tonight is not offered again");
});

// ---------- pure: lines, complete, tonightFor ----------
test("lines: a temperament variant when there is one, otherwise the default", () => {
  const S = pure();
  const d = DEF({ scene: { label: "L", lines: { default: ["d1"], tham: ["t1"] }, choices: [] } });
  assert.deepEqual(J(S.lines(d, "tham")), ["t1"]);
  assert.deepEqual(J(S.lines(d, "san")), ["d1"]);
  assert.deepEqual(J(S.lines(d, null)), ["d1"]);
});

test("complete: returns a new state, leaves the old one alone, and resets tonight on a new run", () => {
  const S = pure();
  const before = { done: { x: { n: 1, lastDay: 2 } }, tonight: { runId: "old", ids: ["x"] } };
  const snap = JSON.stringify(before);
  const d = DEF({ id: "y" });
  const after = S.complete(before, d, "new", 7);
  assert.equal(JSON.stringify(before), snap, "old state is not changed");
  assert.deepEqual(J(after.tonight), { runId: "new", ids: ["y"] }, "tonight starts over for the new run");
  assert.deepEqual(J(after.done.y), { n: 1, lastDay: 7 });
  assert.deepEqual(J(after.done.x), { n: 1, lastDay: 2 });
  const again = S.complete(after, d, "new", 8);
  assert.deepEqual(J(again.done.y), { n: 2, lastDay: 8 });
  assert.deepEqual(J(again.tonight.ids), ["y"], "the same id is not added twice");
  const same = S.complete({ done: {}, tonight: { runId: "r", ids: ["a"] } }, DEF({ id: "b" }), "r", 1);
  assert.deepEqual(J(same.tonight.ids), ["a", "b"], "same run keeps earlier ids");
});

test("tonightFor: a record of another run reads as empty", () => {
  const S = pure();
  assert.deepEqual(J(S.tonightFor({ tonight: { runId: "a", ids: ["q"] } }, "b")), { runId: "b", ids: [] });
  assert.deepEqual(J(S.tonightFor({ tonight: { runId: "a", ids: ["q"] } }, "a")), { runId: "a", ids: ["q"] });
});

// ---------- pure: night range, errand steps, later visits ----------
test("eligible: fromDay / untilDay limit a storylet to some nights", () => {
  const S = pure();
  const defs = [DEF({ id: "early", untilDay: 2 }), DEF({ id: "mid", fromDay: 3, untilDay: 4 }), DEF({ id: "late", fromDay: 5 })];
  const ids = (day) => S.eligible(defs, { role: "villager", phase: "Sáng", day, state: { done: {} } }).map((d) => d.id).join(",");
  assert.equal(ids(1), "early");
  assert.equal(ids(2), "early");
  assert.equal(ids(3), "mid");
  assert.equal(ids(4), "mid");
  assert.equal(ids(5), "late");
  assert.equal(ids(9), "late");
});

test("eligible: needsQuest reads the step of an errand kept elsewhere; a missing errand counts as 'none'", () => {
  const S = pure();
  const defs = [DEF({ id: "after_na", needsQuest: { tree: ["thank", "done"] } }), DEF({ id: "before_peta", needsQuest: { peta: ["none"] } })];
  const ids = (quests) => S.eligible(defs, { role: "villager", phase: "Sáng", day: 1, state: { done: {} }, quests }).map((d) => d.id).join(",");
  assert.equal(ids(undefined), "before_peta");
  assert.equal(ids({ tree: { step: "child" } }), "before_peta");
  assert.equal(ids({ tree: { step: "done" }, peta: { step: "rice" } }), "after_na");
  assert.equal(ids({ tree: { step: "thank" }, peta: {} }), "after_na,before_peta");
});

test("offered: a finished main errand does not use up a side slot", () => {
  const S = pure();
  const defs = [DEF({ id: "m1", kind: "main" }), DEF({ id: "s1" }), DEF({ id: "s2" }), DEF({ id: "s3" })];
  const ctx = (ids) => ({ role: "villager", phase: "Sáng", day: 1, state: { done: {}, tonight: { runId: "r", ids } } });
  const sides = (ids) => S.offered(defs, ctx(ids), "r").filter((d) => d.kind === "side").length;
  assert.equal(sides(["m1"]), 2, "main done: both side slots are still open");
  assert.equal(sides(["m1", "s1"]), 1, "main and one side done: one slot left");
  assert.equal(sides(["m1", "s1", "s2"]), 0);
  assert.equal(sides(["gone_from_defs"]), 1, "an id no longer in the list counts as a side errand");
});

test("lines: later visits use the 'again' lines, the last one from then on; without them the first lines stay", () => {
  const S = pure();
  const d = DEF({ scene: { lines: { default: ["first"], tham: ["first, tham"] }, again: [["second"], ["third and after"]], choices: [] } });
  assert.deepEqual(J(S.lines(d, "tham", 0)), ["first, tham"]);
  assert.deepEqual(J(S.lines(d, "tham")), ["first, tham"], "no count given reads as the first visit");
  assert.deepEqual(J(S.lines(d, "tham", 1)), ["second"]);
  assert.deepEqual(J(S.lines(d, null, 2)), ["third and after"]);
  assert.deepEqual(J(S.lines(d, null, 7)), ["third and after"]);
  assert.deepEqual(J(S.lines(DEF({}), null, 3)), ["d"]);
});

// ---------- module: the errands in the game loop ----------
test("module: a legacy character (phase null) gets no targets and no sheet", () => {
  const g = boot({ phase: null, pos: { x: 610, y: 600 } });
  assert.equal(g.M.questList().some((q) => ["Tiếng chuông chiều", "Ao sen", "Một buổi sáng bình thường"].includes(q.title)), false);
  g.tick();
  assert.equal(g.sheetOpen(), false);
  assert.equal(g.logs.length, 0);
});

test("module: a villager near the place in the right phase is offered the errand; a tap opens it", () => {
  const g = boot({ pos: { x: 610, y: 600 } });
  g.tick();
  assert.equal(g.sheetOpen(), false, "walking near does not open the scene");
  assert.equal(g.prompt(), "Đứng nghe chuông");
  g.tap();
  assert.equal(g.prompt(), null, "the button goes away once the scene is open");
  assert.equal(g.sheetOpen(), true);
  assert.equal(g.sheetLabel(), "Tịnh thất");
  assert.deepEqual(g.lines(), ["Tiếng chuông chiều ngân lên từ tịnh thất, chậm và thưa.", "Chim bay về tổ. Không có việc gì phải làm."]);
  assert.deepEqual(g.choiceLabels(), ["Đứng nghe thêm một lúc", "Đi tiếp"]);
});

test("module: a temperament variant of the lines is used when the character has one", () => {
  const g = boot({ save: saved({ carita: "tham" }), pos: { x: 610, y: 600 } });
  g.tick();
  g.tap();
  assert.deepEqual(g.lines(), ["Tiếng chuông chiều ngân lên, chậm và thưa.", "Người này muốn đứng nghe mãi, chưa muốn đi đâu."]);
});

test("module: a choice with a log writes one journal line, completes the errand, and waits for a new run and cooldown", () => {
  const g = boot({ pos: { x: 610, y: 600 } });
  g.tick();
  g.tap();
  g.choice("Đứng nghe thêm một lúc");
  assert.deepEqual(g.logs, ["Đã đứng nghe tiếng chuông chiều ở tịnh thất."]);
  assert.equal(g.sheetOpen(), false);
  assert.equal(g.S().q.storylets.done.chuong_chieu.n, 1);
  assert.equal(g.S().q.storylets.done.chuong_chieu.lastDay, 1);
  assert.deepEqual(J(g.S().q.storylets.tonight), { runId: "run-1", ids: ["chuong_chieu"] });
  g.tick();
  assert.equal(g.prompt(), null, "same run: not offered again");
  assert.equal(g.logs.length, 1, "the log is written once");
  g.set({ runId: "run-2", day: 2 });
  g.tick();
  assert.equal(g.prompt(), null, "new run, but the cooldown of 2 days still holds");
  g.set({ runId: "run-3", day: 3 });
  g.tick();
  assert.equal(g.prompt(), "Đứng nghe chuông", "after 2 days it is offered again");
});

test("module: 'Đi tiếp' closes the errand without completing it; it never reopens by itself, and the button leaves when the player walks on", () => {
  const g = boot({ pos: { x: 610, y: 600 } });
  g.tick();
  g.tap();
  g.choice("Đi tiếp");
  assert.equal(g.sheetOpen(), false);
  assert.equal(g.logs.length, 0, "no journal line");
  assert.equal(g.S().q.storylets.done.chuong_chieu, undefined, "not completed");
  for (let i = 0; i < 400; i++) g.tick();
  assert.equal(g.sheetOpen(), false, "standing there never reopens the scene");
  assert.equal(g.prompt(), "Đứng nghe chuông", "the button is still there for a change of mind");
  g.setPos(2000, 2000);
  g.tick();
  assert.equal(g.prompt(), null, "walking away removes the button");
});

test("module: targets list the errands open for the phase; the morning has two side errands at once", () => {
  const g = boot({ phase: "Chạng vạng" });
  const t = g.M.questList().find((q) => q.title === "Tiếng chuông chiều");
  assert.ok(t, "the bell errand is listed at dusk");
  assert.equal(t.name, "Tịnh thất");
  assert.equal(t.x, 600 + 26, "marker sits beside the place");
  assert.equal(g.M.questList().some((q) => q.title === "Ao sen"), false, "the pond is for the morning");

  const m = boot({ phase: "Sáng sớm" });
  const titles = m.M.questList().map((q) => q.title);
  assert.ok(titles.includes("Ao sen"), titles.join(" | "));
  assert.ok(titles.includes("Một buổi sáng bình thường"), titles.join(" | "));
  assert.equal(titles.includes("Tiếng chuông chiều"), false);

  const quiet = boot({ phase: "Gà gáy" });
  const qt = quiet.M.questList().map((q) => q.title);
  assert.equal(qt.some((t) => ["Tiếng chuông chiều", "Ao sen", "Một buổi sáng bình thường"].includes(t)), false, "no storylet at cockcrow");
});

test("module: a monk gets none of the villager storylets", () => {
  const g = boot({ role: "monk", pos: { x: 610, y: 600 } });
  assert.equal(g.M.questList().some((q) => q.title === "Tiếng chuông chiều"), false);
  g.tick();
  assert.equal(g.sheetOpen(), false);
});
