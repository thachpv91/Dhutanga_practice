const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

function rules() {
  const sb = makeSandbox();
  load(sb, "practice-rules.js");
  return sb.PracticeRules;
}

test("passive meditation never awards a card", () => {
  assert.equal(rules().selectMeditationCard({ noted: 0, lost: 0, longestStable: 500, practicedSessions: 20 }).card, null);
});

test("active noticing creates a Niệm learning opportunity", () => {
  assert.equal(rules().selectMeditationCard({ noted: 3, lost: 3, longestStable: 8, practicedSessions: 1 }).card, "niem");
});

test("Định requires repeated active sessions and sustained attention", () => {
  const p = rules();
  assert.equal(p.selectMeditationCard({ noted: 3, lost: 0, longestStable: 35, practicedSessions: 1 }).card, "niem");
  assert.equal(p.selectMeditationCard({ noted: 3, lost: 0, longestStable: 10, practicedSessions: 3 }).card, "niem");
  assert.equal(p.selectMeditationCard({ noted: 3, lost: 0, longestStable: 35, practicedSessions: 3 }).card, "dinh");
});

test("Si and phóng dật only emerge from authored observed events, not ordinary stray thoughts", () => {
  const p = rules();
  assert.equal(p.observedCard("ordinary_thought"), null);
  assert.equal(p.observedCard("confusion_recognized"), "si");
  assert.equal(p.observedCard("unwholesome_agitation_recognized"), "phong_dat");
  assert.equal(p.observedCard("dullness_recognized"), "hon_tram");
  assert.equal(p.observedCard("hindering_doubt_recognized"), "hoai_nghi");
});

test("unknown tags cannot award learning cards", () => {
  assert.equal(rules().observedCard(""), null);
});
