// Z2: with the zones flag off, the old cave popup is unchanged.
// With the flag on, both the offer and a finished old cave open the same walkable map
// and do not grant items or cards.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
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

const PLACES = {
  gao: { x: -500, y: -500 }, bamboo: { x: 100, y: 100 }, village: { x: 200, y: 200 }, well: { x: 300, y: 300 },
  graves: { x: 400, y: 400 }, mit: { x: 500, y: 500 }, hermitage: { x: 600, y: 600 }, gate: { x: 700, y: 700 },
  ao: { x: 800, y: 800 }, thap: { x: 900, y: 900 }, hang: { x: 440, y: 760, name: "Tảng đá lớn" },
};

function boot(save, { zones = false } = {}) {
  const sb = makeSandbox();
  const els = {};
  let player = { x: 440, y: 760, moving: false };
  let loopFn = null;
  let opened = 0;
  sb.document = {
    visibilityState: "visible", addEventListener() {},
    getElementById: (id) => (els[id] ||= node()),
    createElement: () => node(), createElementNS: () => node(),
    querySelector: () => node(), querySelectorAll: () => [],
  };
  sb.performance = { now: () => Date.now() };
  sb.setInterval = (fn, ms) => { if (ms === 250) loopFn = fn; return 0; };
  sb.clearInterval = () => {};
  sb.World = {
    PLACES, getMap: () => ({ path: [[0, 0], [1000, 0]], caveFound: false }),
    getPlayer: () => player, setPlayer(x, y) { player = { ...player, x, y }; },
    setActors() {}, setFx() {}, stop() {}, lookAt() {}, resetLook() {}, setView() {},
  };
  sb.ZonesView = {
    enabled: () => zones,
    isOpen: () => false,
    zoneId: () => (zones ? "hang_vong_tam" : null),
    enter: () => { opened += 1; },
  };
  sb.Save = { get: () => JSON.stringify(save), set() {}, log() {} };
  load(sb, "milestones.js");
  sb.Milestones.reveal = () => {};
  load(sb, "mind.js");
  sb.Mind.init({
    busy: () => false, darkness: () => 0.2, mood: () => 0.5, sound: () => false,
    toast() {}, refresh() {}, swingMood() {}, goTo() {}, day: () => 1, setPose() {},
  });
  load(sb, "encounters.js");
  sb.Mind.onRoleStart("villager", () => {});
  sb.document.getElementById("mind-card").hidden = true;
  sb.document.getElementById("card-reveal").hidden = true;
  const $ = (id) => sb.document.getElementById(id);
  return {
    S: () => sb.Mind.kit.S,
    opened: () => opened,
    tick() { sb.Mind.kit.cooldown(-1); sb.Mind.kit.setOpen(false); loopFn(); },
    prompt: () => { const b = $("mind-prompt"); return b.hidden ? null : b.textContent; },
    tap() { sb.Mind.kit.setOpen(false); $("mind-prompt").listeners.click(); },
    sheetOpen: () => !$("mind-card").hidden,
    sheetLabel: () => $("mind-label").textContent,
    lines: () => $("mind-lines").children.map((p) => p.textContent),
    cardOpen: () => !$("card-reveal").hidden,
  };
}

const base = (over = {}) => ({
  cards: {}, carita: null, surveySkipped: false,
  stats: { tin: 40, tan: 40, niem: 33, dinh: 33, tue: 37, tham: 35, san: 31, si: 33 },
  quest: { step: "done", hit: true }, q: { cave: { found: true, step: "none" } },
  items: [], deva: { pity: 0, last: 0, seen: 0 }, milestones: {}, msCounts: {}, village: { deeds: {} },
  ...over,
});

test("flag off: the old cave still asks for a lamp and does not open the map", () => {
  const g = boot(base());
  g.tick();
  assert.equal(g.prompt(), "Vào hang đá");
  g.tap();
  assert.equal(g.opened(), 0);
  assert.equal(g.sheetOpen(), true);
  assert.equal(g.sheetLabel(), "Hang đá");
  assert.match(g.lines().join(" "), /Không có đèn/);
  assert.equal(g.cardOpen(), false);
  assert.deepEqual(g.S().items, []);
});

test("flag on: no lamp still enters the one cave map and changes nothing in the old quest", () => {
  const g = boot(base(), { zones: true });
  g.tick();
  assert.equal(g.prompt(), "Vào hang đá");
  g.tap();
  assert.equal(g.opened(), 1);
  assert.equal(g.sheetOpen(), false);
  assert.equal(g.cardOpen(), false);
  assert.equal(g.S().q.cave.step, "none");
  assert.equal(g.S().q.cave.found, true);
  assert.deepEqual(g.S().items, []);
});

test("flag on: a cave already finished in the old popup can still be entered", () => {
  const g = boot(base({ q: { cave: { found: true, step: "done" } }, items: ["manh_ky_uc"] }), { zones: true });
  g.tick();
  assert.equal(g.prompt(), "Vào hang đá");
  g.tap();
  assert.equal(g.opened(), 1);
  assert.equal(g.S().q.cave.step, "done");
  assert.deepEqual(g.S().items, ["manh_ky_uc"]);
});

test("flag off: a finished old cave is not offered again", () => {
  const g = boot(base({ q: { cave: { found: true, step: "done" } } }));
  g.tick();
  assert.equal(g.prompt(), null);
  assert.equal(g.opened(), 0);
});

test("flag on: the cave stays hidden until it has been found", () => {
  const g = boot(base({ q: { cave: { step: "none" } } }), { zones: true });
  g.tick();
  assert.equal(g.prompt(), "Xem tảng đá lớn");
  assert.equal(g.opened(), 0);
});

test("the page loads the zone scripts after encounters and before the app", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "public", "index.html"), "utf8");
  const at = (s) => html.indexOf(s);
  assert.ok(at('src="encounters.js"') < at('src="zones.js"'));
  assert.ok(at('src="zones.js"') < at('src="zones-view.js"'));
  assert.ok(at('src="zones-view.js"') < at('src="app.js"'));
  assert.ok(html.includes('href="zones.css"'));
});
