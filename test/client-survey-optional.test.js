const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

// Minimal DOM node: enough for mind.js to build its sheets without a browser.
function node() {
  return {
    hidden: false, textContent: "", className: "", type: "", style: {}, dataset: {}, children: [],
    classList: { add() {}, remove() {}, contains() { return false; } },
    appendChild(c) { this.children.push(c); return c; },
    replaceChildren(...c) { this.children = c; },
    addEventListener() {}, setAttribute() {},
  };
}

// saved: the stored save object for this character, or null for a brand-new one.
function setup(saved) {
  const sb = makeSandbox();
  const els = {};
  sb.document = { visibilityState: "visible", addEventListener() {}, getElementById: (id) => (els[id] ||= node()), createElement: () => node() };
  sb.setInterval = () => 0;
  sb.clearInterval = () => {};
  sb.World = {
    PLACES: { well: { x: 10, y: 20 }, mit: { x: 30, y: 40 }, village: { x: 50, y: 60 }, graves: { x: 70, y: 80 } },
    stop() {}, setActors() {}, setFx() {}, getPlayer: () => ({ x: 0, y: 0 }), setPlayer() {},
  };
  const stored = [];
  sb.Save = { get: () => (saved == null ? null : JSON.stringify(saved)), set: (k, v) => stored.push([k, v]) };
  load(sb, "mind.js");
  sb.__stored = stored;
  return sb;
}

const KEYS = ["tin", "tan", "niem", "dinh", "tue", "tham", "san", "si"];
const NEUTRAL = { tin: [34, 48], tan: [34, 48], niem: [26, 40], dinh: [26, 40], tue: [30, 44], tham: [28, 42], san: [24, 38], si: [26, 40] };
const SURVEY_TITLE = "Khảo sát tính cách (không bắt buộc)";

test("new person: onRoleStart does not block, opens no survey and sets 8 numeric stats", () => {
  const sb = setup(null);
  const M = sb.Mind;
  assert.equal(M.onRoleStart("monk", () => {}), false);
  assert.equal(M.isOpen(), false);
  assert.equal(sb.pendingTimers(), 0);
  const p = M.parts.current();
  assert.equal(p.carita, null);
  assert.deepEqual(Object.keys(p.stats).sort(), [...KEYS].sort());
  for (const k of KEYS) assert.equal(typeof p.stats[k], "number");
  assert.ok(sb.__stored.length >= 1, "new stats are saved");
});

test("new person: neutral stats stay inside the neutral frame (no temperament roll)", () => {
  for (let i = 0; i < 40; i++) {
    const sb = setup(null);
    sb.Mind.onRoleStart("villager", () => {});
    const st = sb.Mind.parts.current().stats;
    for (const k of KEYS) assert.ok(st[k] >= NEUTRAL[k][0] && st[k] <= NEUTRAL[k][1], `${k}=${st[k]} outside ${NEUTRAL[k]}`);
  }
});

test("new person: questList ends with the optional survey while playing", () => {
  const sb = setup(null);
  const M = sb.Mind;
  assert.equal(M.questList().length, 0, "no errands before a role starts");
  M.onRoleStart("monk", () => {});
  const list = M.questList();
  const last = list[list.length - 1];
  assert.equal(last.title, SURVEY_TITLE);
  assert.equal(last.survey, true);
  assert.equal(last.skipped, false);
  assert.equal(last.x, undefined, "survey has no place on the map");
  // the marker filter in the world skips it (it needs x and name)
  assert.equal(list.filter((q) => q.x != null && q.name).some((q) => q.survey), false);
});

test("skipSurvey marks the errand skipped and startSurvey clears it again", () => {
  const sb = setup(null);
  const M = sb.Mind;
  M.onRoleStart("monk", () => {});
  M.skipSurvey();
  let last = M.questList().at(-1);
  assert.equal(last.skipped, true);
  assert.match(last.body, /Đã để sau/);
  assert.equal(sb.__stored.at(-1)[1].includes('"surveySkipped":true'), true, "skip is saved");

  M.startSurvey();
  assert.equal(M.isOpen(), true, "survey sheet opens");
  last = M.questList().at(-1);
  assert.equal(last.skipped, false);
});

test("person who already has a temperament: nothing changes and no errand is listed", () => {
  const saved = {
    cards: {}, carita: "san", surveySkipped: false,
    stats: { tin: 40, tan: 60, niem: 33, dinh: 28, tue: 40, tham: 30, san: 60, si: 30 },
  };
  const sb = setup(saved);
  const M = sb.Mind;
  assert.equal(M.onRoleStart("monk", () => {}), false);
  assert.equal(M.isOpen(), false);
  assert.equal(sb.pendingTimers(), 0);
  const p = M.parts.current();
  assert.equal(p.carita, "san");
  assert.deepEqual(p.stats, saved.stats);
  assert.equal(M.questList().some((q) => q.survey), false);
  assert.equal(sb.__stored.length, 0, "nothing is written for an existing person");
});
