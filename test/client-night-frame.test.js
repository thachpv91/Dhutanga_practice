const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const STORY = { monk: { start: "a0", meterStart: 5, scenes: { a0: { place: "x" }, end: { end: true, place: "z" }, ep: { end: true, epilogue: true, place: "z" } } } };
const SPAWN = { x: 100, y: 200 };
const P = () => load(makeSandbox(), "progress.js").Progress;

// ---------- Progress.isFreeNight ----------

test("isFreeNight: arrival night at its closing scene is free", () => {
  const P_ = P();
  const cp = { arc: { mode: "arrival", chapter: "pa", history: [] } };
  assert.equal(P_.isFreeNight(cp, STORY.monk.scenes.end), true);
});

test("isFreeNight: arrival night at an ordinary scene is not free", () => {
  const P_ = P();
  const cp = { arc: { mode: "arrival", chapter: "pa", history: [] } };
  assert.equal(P_.isFreeNight(cp, STORY.monk.scenes.a0), false);
});

test("isFreeNight: epilogue is not a free night", () => {
  const P_ = P();
  const cp = { arc: { mode: "arrival", chapter: "pa", history: [] } };
  assert.equal(P_.isFreeNight(cp, STORY.monk.scenes.ep), false);
});

test("isFreeNight: legacy or unset mode at a closing scene is not free", () => {
  const P_ = P();
  assert.equal(P_.isFreeNight({ arc: { mode: "legacy", chapter: "c1", history: [] } }, STORY.monk.scenes.end), false);
  assert.equal(P_.isFreeNight({ arc: { chapter: "c1", history: [] } }, STORY.monk.scenes.end), false);
  assert.equal(P_.isFreeNight({ arc: { mode: "arrival" } }, { end: false, place: "x" }), false);
});

test("isFreeNight: null checkpoint or null scene never throws and is false", () => {
  const P_ = P();
  const cp = { arc: { mode: "arrival" } };
  assert.equal(P_.isFreeNight(null, STORY.monk.scenes.end), false);
  assert.equal(P_.isFreeNight(undefined, STORY.monk.scenes.end), false);
  assert.equal(P_.isFreeNight(cp, null), false);
  assert.equal(P_.isFreeNight(cp, undefined), false);
  assert.equal(P_.isFreeNight({}, STORY.monk.scenes.end), false);
});

// ---------- reflect: "Để sau" closes the overlay and changes nothing ----------

// Minimal DOM: enough for reflect.js to build the night-end screen and be closed by a click.
function node(tag) {
  return {
    tag, textContent: "", className: "", type: "", disabled: false, style: {}, dataset: {}, children: [], listeners: {}, parent: null,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild(c) { this.children.push(c); c.parent = this; return c; },
    append(...cs) { cs.forEach((c) => this.appendChild(c)); },
    replaceChildren(...cs) { this.children.forEach((c) => { c.parent = null; }); this.children = []; cs.forEach((c) => this.appendChild(c)); },
    addEventListener(ev, fn) { (this.listeners[ev] ||= []).push(fn); },
    setAttribute() {},
    remove() { if (this.parent) this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; },
    click() { (this.listeners.click || []).forEach((f) => f()); },
  };
}
function findButton(n, text) {
  if (n.tag === "button" && n.textContent === text) return n;
  for (const c of n.children) { const f = findButton(c, text); if (f) return f; }
  return null;
}

test("reflect: Để sau button closes the overlay and saves nothing", () => {
  const sb = makeSandbox();
  const body = node("body");
  sb.document = { visibilityState: "visible", addEventListener() {}, createElement: (t) => node(t), body };
  load(sb, "progress.js");
  const R = load(sb, "reflect.js").NightReflect;
  const P_ = sb.Progress;
  let cp = P_.create({ role: "monk", story: STORY.monk, spawn: SPAWN, day: 1 });
  let saves = 0;
  const ctx = {
    role: "monk",
    getCp: () => cp,
    setCp: (c) => { cp = c; saves++; },
    history: () => [],
    log() {}, flush: async () => {}, newNight() {}, leave() {},
  };
  R.open(ctx);
  assert.equal(body.children.length, 1, "overlay is open");
  const overlay = body.children[0];
  const later = findButton(overlay, "Để sau");
  assert.ok(later, "Để sau button is on the choice row");
  assert.equal(later.className, "rf-btn");
  const before = { cp, saves };
  later.click();
  assert.equal(body.children.length, 0, "overlay is removed");
  assert.equal(cp, before.cp, "checkpoint object is unchanged");
  assert.equal(saves, before.saves, "nothing was saved by the click");
});
