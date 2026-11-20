const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

test("a remembered village line counts as an active NPC bubble until it fades; chat bubbles do not", () => {
  const w = load(makeSandbox(), "world.js").World;
  assert.equal(w.npcBubbleActive(), false);
  w.say("me", "xin chào", "monk");
  w.say("some-player-id", "chào", "villager");
  assert.equal(w.npcBubbleActive(), false, "player chat bubbles do not block village memory lines");
  w.say("npc:granny", "Hôm qua cháu cho bà nắm rau…", "villager");
  assert.equal(w.npcBubbleActive(), true);
});

test("the old woman at the well and Chị Ba in the lane are no longer on top of each other", () => {
  const w = load(makeSandbox(), "world.js").World;
  const P = w.PLACES;
  const granny = { x: P.well.x + 22, y: P.well.y + 8 };      // mind.js
  const mother = { x: P.village.x + 52, y: P.village.y + 14 }; // encounters.js spot.mother
  const dist = Math.hypot(granny.x - mother.x, granny.y - mother.y);
  assert.ok(dist >= 100, `they are ${Math.round(dist)} apart; the old spots were about 20`);
});
