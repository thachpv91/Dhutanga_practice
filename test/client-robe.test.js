const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

function setup(role = "monk") {
  const sb = makeSandbox();
  let day = 1, popup = null, activeRole = role, clock = 100000;
  sb.Date = class extends Date { static now() { return clock; } };
  const state = { q: {} };
  const places = { gate: { x: 10, y: 10 }, well: { x: 20, y: 20 }, hermitage: { x: 30, y: 30 } };
  let mod;
  const items = [], dropped = [], nearCalls = [];
  let nearAnswer = true;
  const k = {
    S: state, role: () => activeRole, api: () => ({ day: () => day, toast() {} }),
    near: (pt, r) => { nearCalls.push([pt, r]); return nearAnswer; }, save() {}, closeSheet() {}, setOpen() {}, cooldown() {},
    showSheet: (p) => { popup = p; }, giveItem: (i) => items.push(i), dropItem: (i) => dropped.push(i),
    gotItem: (id, fn) => { if (fn) fn(); },
  };
  sb.Mind = { kit: k, register: (m) => { mod = m; } };
  sb.World = { PLACES: places };
  load(sb, "robe.js");
  return { get mod() { return mod; }, get popup() { return popup; }, state, items, dropped, nearCalls, setNear: (v) => { nearAnswer = v; }, setDay: (d) => { day = d; clock += 61000; }, setRole: (r) => { activeRole = r; } };
}

test("ghost cannot receive monk's rag-robe physical errands", () => {
  const g = setup("ghost");
  assert.equal(g.mod.targets().length, 0);
  assert.equal(g.mod.loop(), false);
});

test("robe spans multiple game days and awards a keepsake only once", () => {
  const g = setup();
  for (let d = 1; d <= 5; d++) {
    g.setDay(d);
    assert.equal(g.mod.targets().length, 1);
    assert.equal(g.mod.loop(), true);
    g.popup.choices[0].fn();
    assert.equal(g.state.q.robe.step, d);
    assert.equal(g.state.q.robe.readyDay, d + 1);
    if (d === 1) assert.deepEqual(g.items, ["manh_vai_cu"], "step 1 puts the scrap of cloth in the bag");
    else if (d < 5) assert.deepEqual(g.items, ["manh_vai_cu"]);
  }
  assert.deepEqual(g.items, ["manh_vai_cu", "y_mau_dat"], "the finished robe replaces the scrap");
  assert.deepEqual(g.dropped, ["manh_vai_cu"]);
  assert.equal(g.mod.targets().length, 0);
});

test("cannot complete several robe stages on the same game day", () => {
  const g = setup();
  assert.equal(g.mod.loop(), true);
  g.popup.choices[0].fn();
  assert.equal(g.mod.loop(), false);
  assert.match(g.mod.targets()[0].body, /Sang ngày mới/);
});

test("step 1 is a real scrap of cloth lying by the gate: it is drawn until picked up and only the monk sees it", () => {
  const g = setup();
  const cloth = g.mod.actors();
  assert.equal(cloth.length, 1);
  assert.equal(cloth[0].kind, "cloth");
  assert.equal(cloth[0].label, "mảnh vải");
  assert.ok(cloth[0].x > 10 && cloth[0].y > 10, "beside the gate, not on top of it");
  assert.equal(setup("ghost").mod.actors().length, 0);
  assert.equal(setup("villager").mod.actors().length, 0);
  g.mod.loop(); g.popup.choices[0].fn();
  assert.equal(g.mod.actors().length, 0, "picked up: nothing lies there any more");
});

test("the guide points at the cloth itself and the pickup needs the player to be next to it", () => {
  const g = setup();
  const t = g.mod.targets()[0];
  const spot = g.mod.actors()[0];
  assert.ok(Math.abs(t.x - spot.x) <= 30 && Math.abs(t.y - spot.y) <= 30, "the marker leads to the cloth");
  g.setNear(false);
  assert.equal(g.mod.loop(), false, "not near the cloth: nothing opens");
  assert.equal(g.popup, null);
  g.setNear(true);
  assert.equal(g.mod.loop(), true);
  const [pt] = g.nearCalls[g.nearCalls.length - 1];
  assert.equal(pt.x, spot.x);
  assert.equal(pt.y, spot.y);
});
