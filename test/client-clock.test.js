const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const C = () => load(makeSandbox(), "clock.js").Clock;
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} is not ${b}`);

test("constants match the design table", () => {
  const K = C();
  assert.equal(K.SECONDS_PER_HOUR, 60);
  assert.equal(K.NIGHT_CAP, 28.6);
  assert.equal(K.DAY_CAP, 41.2);
  assert.ok(Object.isFrozen(K.PHASES));
  assert.equal(K.PHASES.length, 17);
});

test("hOf returns the hour of a phase name; the first match wins; unknown names give null", () => {
  const K = C();
  assert.equal(K.hOf("Trưa"), 36);
  assert.equal(K.hOf("Chiều"), 39);
  assert.equal(K.hOf("Sáng tinh mơ"), 6.2);
  assert.equal(K.hOf("Sáng sớm"), 30.4);
  assert.equal(K.hOf("Chiều tàn"), 17.2);
  assert.equal(K.hOf("Tối om"), null);
  assert.equal(K.hOf(undefined), null);
});

test("at names and hints each phase at its own hour", () => {
  const K = C();
  for (const ph of K.PHASES) {
    const r = K.at(ph.h);
    assert.equal(r.name, ph.name, `name at ${ph.h}`);
    assert.equal(r.hint, ph.hint, `hint at ${ph.h}`);
    close(r.dark, ph.dark);
    assert.equal(r.h, ph.h);
  }
});

test("at(41.2) is the closing phase of the day, and hours before the first phase count as the first phase", () => {
  const K = C();
  const end = K.at(41.2);
  assert.equal(end.name, "Chiều tàn");
  assert.equal(end.hint, "khoảng 17 giờ");
  assert.equal(K.at(50).name, "Chiều tàn");
  assert.equal(K.at(4).name, "Sáng tinh mơ");
  close(K.at(4).dark, 0.28);
  assert.equal(K.at(10).name, "Buổi sáng");
  assert.equal(K.at(17.2).name, "Chiều tàn");
});

test("at interpolates darkness between neighbouring phases", () => {
  const K = C();
  // midway between Chạng vạng (18.4, 0.55) and Đầu hôm (20, 0.60)
  const mid = K.at(19.2);
  assert.equal(mid.name, "Chạng vạng");
  close(mid.dark, 0.575);
  // a quarter of the way from Canh tư (26.6, 0.64) to Gà gáy (28.6, 0.55)
  close(K.at(27.1).dark, 0.64 + (0.55 - 0.64) * 0.25);
});

test("advance moves 60 seconds per game hour", () => {
  const K = C();
  close(K.advance(20, 60, 100), 21);
  close(K.advance(20, 30, 100), 20.5);
  close(K.advance(20, 0, 100), 20);
});

test("advance stops at the cap and never goes back", () => {
  const K = C();
  close(K.advance(28.5, 600, K.NIGHT_CAP), 28.6);
  close(K.advance(30, 10, 20), 30);
  close(K.advance(30, 10, 30), 30);
});

test("advance ignores negative and NaN time", () => {
  const K = C();
  close(K.advance(20, -5, 100), 20);
  close(K.advance(20, NaN, 100), 20);
  close(K.advance(20, undefined, 100), 20);
});
