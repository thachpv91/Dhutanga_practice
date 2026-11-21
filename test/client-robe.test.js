const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

function setup(role = "monk", saved = {}) {
  const sb = makeSandbox();
  let day = 1, popup = null, prompt = null, clock = 100000;
  sb.Date = class extends Date { static now() { return clock; } };
  sb.Path2D = class { constructor(path) { this.path = path; } };
  const strokes = [];
  const ctx = new Proxy({}, { get: (_, name) => (...args) => strokes.push([name, ...args]) });
  const state = { q: saved };
  const places = { gate: { x: 10, y: 10 }, well: { x: 80, y: 90 }, hermitage: { x: 170, y: 190 } };
  let mod;
  const items = [], dropped = [], nearCalls = [];
  let nearAnswer = true;
  const k = {
    S: state, role: () => role, api: () => ({ day: () => day, toast() {} }),
    near: (pt, r) => { nearCalls.push([pt, r]); return nearAnswer; }, save() {}, closeSheet() { popup = null; }, setOpen() {}, cooldown() {},
    el: () => ({ getContext: () => ctx, setAttribute() {} }),
    offer: (_, title, fn) => { prompt = fn; return true; },
    showSheet: (p) => { popup = p; }, giveItem: (i) => items.push(i), dropItem: (i) => dropped.push(i),
    gotItem: (id, fn) => { if (fn) fn(); },
  };
  sb.Mind = { kit: k, register: (m) => { mod = m; } };
  sb.World = { PLACES: places };
  load(sb, "robe.js");
  function approach() { assert.equal(mod.loop(), true); prompt(); }
  function act() { popup.choices[0].fn(); }
  return { mod, get popup() { return popup; }, state, items, dropped, nearCalls, strokes, approach, act,
    setNear: (v) => { nearAnswer = v; }, setDay: (d) => { day = d; clock += 61000; } };
}

test("cloth stays on the thorn until the monk checks ownership and picks it up", () => {
  const g = setup();
  const [prop] = g.mod.actors(), [guide] = g.mod.targets();
  assert.equal(prop.kind, "cloth");
  assert.equal(guide.x, prop.x);
  g.setNear(false); assert.equal(g.mod.loop(), false);
  g.setNear(true); assert.equal(g.mod.loop(), true); assert.equal(g.popup, null);
  g.approach(); g.act();
  assert.equal(g.items.length, 0);
  assert.equal(g.mod.actors()[0].kind, "cloth");
  assert.match(g.popup.lines[0], /tôi bỏ/);
  g.act();
  assert.deepEqual(g.items, ["manh_vai_cu"]);
  assert.equal(g.mod.actors().length, 0);
  assert.equal(g.mod.loop(), false);
});

test("rinse, carry to the hermitage and hang are separate actions, resumable after leaving or reloading", () => {
  const g = setup("monk", { robe: { step: 1, readyDay: 2 } });
  g.setDay(2);
  const atWell = g.mod.targets()[0];
  g.approach(); assert.equal(g.mod.actors()[0].frame, "basin");
  g.act(); assert.equal(g.mod.actors()[0].frame, "mud");
  g.act(); assert.equal(g.mod.actors()[0].frame, "rinse");
  g.act(); assert.equal(g.popup, null);
  assert.deepEqual(g.state.q.robe, { step: 1, readyDay: 2, beat: 3 });
  const resumed = setup("monk", JSON.parse(JSON.stringify(g.state.q)));
  resumed.setDay(2);
  assert.notEqual(resumed.mod.targets()[0].x, atWell.x);
  resumed.approach(); resumed.popup.choices[1].fn();
  assert.equal(resumed.state.q.robe.beat, 3);
  resumed.setDay(3); resumed.approach(); resumed.act();
  assert.equal(resumed.mod.actors()[0].frame, "pale");
  assert.equal(resumed.state.q.robe.readyDay, 4);
  assert.equal(resumed.mod.loop(), false);
});

test("five manual workdays advance the material, with a single final item even on repeated input", () => {
  const g = setup();
  const frames = [];
  for (let day = 1; day <= 5; day++) {
    g.setDay(day);
    const actions = [2, 4, 2, 2, 2][day-1];
    for (let n = 0; n < actions; n++) {
      if (!g.popup) g.approach();
      frames.push(g.mod.actors()[0].frame || "scrap");
      const fn = g.popup.choices[0].fn;
      fn(); fn();
    }
    assert.equal(g.state.q.robe.step, day);
    assert.equal(g.state.q.robe.readyDay, day + 1);
  }
  assert.deepEqual(frames, ["scrap","scrap","basin","mud","rinse","bundle","pale","dye","ochre","pin","seam","hem"]);
  assert.ok(g.strokes.length > 0);
  assert.deepEqual(g.items, ["manh_vai_cu","y_mau_dat"]);
  assert.deepEqual(g.dropped, ["manh_vai_cu"]);
  assert.equal(g.mod.targets().length, 0); assert.equal(g.mod.actors().length, 0);
  assert.equal(g.mod.loop(), false);
});

test("robe work is private to the monk, including when another role has old quest data", () => {
  for (const role of ["villager","ghost"]) {
    const g = setup(role, { robe: { step: 3, readyDay: 1 } });
    assert.equal(g.mod.targets().length, 0); assert.equal(g.mod.actors().length, 0);
    assert.equal(g.mod.loop(), false);
  }
});
