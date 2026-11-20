const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const SPAWN = { x: 100, y: 200 };
const BOUNDS = { minX: 12, maxX: 628, minY: 60, maxY: 2000 };
const ROLES = ["monk", "villager", "ghost"];

function env() {
  const sb = makeSandbox();
  for (const f of ["story.js", "story-nights.js", "story-arrival.js", "chapters.js", "progress.js"]) load(sb, f);
  return { P: sb.Progress, S: sb.STORY, C: sb.Chapters };
}
const finish = (P, S, role, cp) => {
  const scene = S[role].scenes[cp.sceneId];
  return P.complete({ ...cp, meter: 5 }, Math.max(0, scene.endings.findIndex((e) => 5 <= e.max))).cp;
};
const endOf = (story, from) => {
  const seen = new Set(), stack = [from];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    const sc = story.scenes[id];
    if (sc.end) return id;
    for (const c of sc.choices || []) if (c.next) stack.push(c.next);
    if (sc.watch) stack.push(sc.watch.next);
  }
  throw new Error("no end from " + from);
};
const NPC_NAMES = /Thầy Tịnh|Sư Tịnh|Ông Tư|ông Tư|Bà Sáu|bà Sáu|Hạnh|con Vàng/;

test("a new character starts the player's own story: night 1 is the arrival chapter in arrival mode", () => {
  const { P, S } = env();
  for (const role of ROLES) {
    const r = P.decide(null, role, S[role], SPAWN, BOUNDS);
    assert.equal(r.mode, "fresh");
    assert.equal(r.cp.arc.chapter, "pa");
    assert.equal(r.cp.arc.mode, "arrival");
    assert.equal(r.cp.sceneId, "pa_0");
    assert.equal(P.valid(r.cp, role, S[role]), true);
  }
});

test("later nights of an arrival character are the ordinary arrival nights, never the old c1/c2 chapters", () => {
  const { P, S } = env();
  for (const role of ROLES) {
    let cp = P.decide(null, role, S[role], SPAWN, BOUNDS).cp;
    const seen = [cp.arc.chapter];
    for (let night = 1; night <= 5; night++) {
      const r = P.decide(finish(P, S, role, { ...cp, sceneId: endOf(S[role], cp.sceneId) }), role, S[role], SPAWN, BOUNDS);
      assert.equal(r.mode, "newnight");
      assert.equal(r.cp.day, night + 1);
      assert.equal(r.cp.arc.mode, "arrival", "the mode is carried to every night");
      seen.push(r.cp.arc.chapter);
      assert.equal(P.valid(r.cp, role, S[role]), true);
      cp = r.cp;
    }
    assert.deepEqual(seen, ["pa", "pb", "pb", "pb", "pb", "pb"]);
  }
});

test("an old save (a valid checkpoint with no mode) is asked once; keeping the old chapters changes nothing else", () => {
  const { P, S } = env();
  const legacy = P.create({ role: "villager", story: S.villager, spawn: SPAWN, day: 3 });
  assert.equal(P.needsChoice(legacy), true);
  const kept = P.keepLegacy(legacy);
  assert.equal(P.needsChoice(kept), false);
  assert.equal(kept.arc.mode, "legacy");
  assert.equal(kept.sceneId, legacy.sceneId);
  assert.equal(kept.runId, legacy.runId);
  const resumed = P.decide(kept, "villager", S.villager, SPAWN, BOUNDS);
  assert.equal(resumed.mode, "resume");
  assert.equal(resumed.cp.arc.mode, "legacy");
});

test("a legacy character that ended a night keeps the old chapters (c2) after choosing to keep them", () => {
  const { P, S } = env();
  const first = P.keepLegacy(P.create({ role: "monk", story: S.monk, spawn: SPAWN }));
  const next = P.decide(finish(P, S, "monk", { ...first, sceneId: endOf(S.monk, first.sceneId) }), "monk", S.monk, SPAWN, BOUNDS);
  assert.equal(next.mode, "newnight");
  assert.ok(/^c2/.test(next.cp.arc.chapter));
});

test("choosing the player's own story starts a fresh arrival night, keeping day count and arc history", () => {
  const { P, S } = env();
  let legacy = P.create({ role: "ghost", story: S.ghost, spawn: SPAWN });
  legacy = finish(P, S, "ghost", { ...legacy, sceneId: endOf(S.ghost, legacy.sceneId) });
  const cp = P.switchToArrival(legacy, "ghost", S.ghost, SPAWN);
  assert.equal(cp.arc.mode, "arrival");
  assert.equal(cp.day, 2, "an ended night moves to the next day");
  assert.equal(cp.arc.chapter, "pb", "day 2 / has history -> ordinary arrival night");
  assert.deepEqual(JSON.parse(JSON.stringify(cp.arc.history)), JSON.parse(JSON.stringify(legacy.arc.history)));
  assert.notEqual(cp.runId, legacy.runId);
  assert.equal(P.valid(cp, "ghost", S.ghost), true);
  assert.equal(P.needsChoice(cp), false);
});

test("normArc keeps only known modes", () => {
  const { P } = env();
  assert.equal(P.normArc({ chapter: "pa", history: [], mode: "arrival" }).mode, "arrival");
  assert.equal(P.normArc({ chapter: "c1", history: [], mode: "legacy" }).mode, "legacy");
  assert.equal("mode" in P.normArc({ chapter: "c1", history: [], mode: "weird" }), false);
  assert.equal("mode" in P.normArc(null), false);
});

test("a new villager arrives at dawn and the well is a real visit, not the end of the night", () => {
  const { S } = env();
  const open = S.villager.scenes.pa_0;
  assert.equal(open.time, "Sáng tinh mơ");
  assert.equal(open.place, "village");
  const well = open.choices.find((c) => c.label.includes("giếng"));
  assert.ok(well, "the opening offers the well");
  assert.notEqual(well.next, "pa_end");
  const scene = S.villager.scenes[well.next];
  assert.equal(scene.place, "well");
  assert.equal(scene.end, undefined);
  assert.equal(/cả làng/.test(open.lines.join(" ")), false);
});

test("the arrival scenes never name an NPC as the player and speak to 'bạn'", () => {
  const { S, C } = env();
  for (const role of ROLES) {
    for (const ch of ["pa", "pb"]) {
      const start = C.get(role, ch).start;
      const ids = new Set(), stack = [start];
      while (stack.length) {
        const id = stack.pop();
        if (ids.has(id)) continue;
        ids.add(id);
        for (const c of S[role].scenes[id].choices || []) stack.push(c.next);
      }
      for (const id of ids) {
        const sc = S[role].scenes[id];
        const text = [...(sc.lines || []).map((l) => (typeof l === "string" ? l : l.text)), ...(sc.choices || []).map((c) => c.label), ...(sc.endings || []).map((e) => e.text)].join(" ");
        assert.equal(NPC_NAMES.test(text), false, `${role}/${id} mentions an NPC`);
      }
    }
  }
});

test("Chapters.startFor: arrival mode ignores the legacy c1/c2 plan, legacy and unset modes are unchanged", () => {
  const { C, S } = env();
  assert.equal(C.startFor("monk", { mode: "arrival", history: [] }, 1, { story: S.monk }).chapter, "pa");
  assert.equal(C.startFor("monk", { mode: "arrival", history: [] }, 2, { story: S.monk }).chapter, "pb");
  assert.equal(C.startFor("monk", { chapter: "c1", history: [] }, 1, { story: S.monk }).chapter, "c1");
  assert.equal(C.startFor("monk", { mode: "legacy", chapter: "c1", history: [{ chapter: "c1", band: 2, day: 1 }] }, 2, { story: S.monk }).chapter, "c2a");
});
