const test = require("node:test");
const assert = require("node:assert/strict");
const { makeSandbox, load } = require("./client-harness");

const ROLES = ["monk", "ghost", "villager"];
const PLACES = ["village", "gate", "bamboo", "graves", "gao", "hermitage", "well", "mit", "ao", "hang", "thap"];
const TIMES = ["Sáng tinh mơ", "Sáng sớm", "Sáng", "Chiều tàn", "Chạng vạng", "Đầu hôm", "Canh hai", "Canh ba", "Canh tư", "Gà gáy", "Rạng sáng"];
const EMITS = ["chime", "sigh", "lantern"];
const FLAG_KEYS = ["if", "unless", "ifv", "unlessv", "needLow"];

function env() {
  const sb = makeSandbox();
  load(sb, "story.js");
  load(sb, "story-nights.js");
  load(sb, "story-arrival.js");
  load(sb, "chapters.js");
  return { sb, STORY: sb.STORY, Chapters: sb.Chapters, TRACE_TEXT: sb.TRACE_TEXT };
}

// every chapter id of a role (c1 + the ones in the plan)
const chapterIds = (C, role) => C.list(role);

function walk(story, start) {
  const seen = new Set();
  const stack = [start];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    const sc = story.scenes[id];
    if (!sc) continue;
    for (const c of sc.choices || []) if (c.next) stack.push(c.next);
    if (sc.watch && sc.watch.next) stack.push(sc.watch.next);
  }
  return seen;
}

test("night 1 -> c1 starts at the existing story for every role", () => {
  const { STORY, Chapters } = env();
  for (const role of ROLES) {
    const r = Chapters.startFor(role, null, 1);
    assert.equal(r.chapter, "c1");
    assert.equal(r.start, STORY[role].start);
    assert.equal(r.meterStart, STORY[role].meterStart);
    assert.ok(r.title);
  }
});

const arcWith = (chapter, band, day = 1) => ({ chapter, history: [{ chapter, band, day }] });

test("night 2 picks the c2 variant from how c1 ended", () => {
  const { Chapters } = env();
  const pick = (role, band, mem) => Chapters.startFor(role, arcWith("c1", band), 2, { mem });
  // villager: trust (high band or the alms memory) -> trust chapter, otherwise doubt chapter
  assert.equal(pick("villager", 2).chapter, "c2a");
  assert.equal(pick("villager", 0, ["v_alms"]).chapter, "c2a");
  assert.equal(pick("villager", 1, new Set(["v_alms"])).chapter, "c2a");
  assert.equal(pick("villager", 0).chapter, "c2b");
  assert.equal(pick("villager", 1).chapter, "c2b");
  // ghost: low Chấp = released
  assert.equal(pick("ghost", 0).chapter, "c2a");
  assert.equal(pick("ghost", 1).chapter, "c2b");
  assert.equal(pick("ghost", 2).chapter, "c2b");
  // monk: restless (low band) vs calm
  assert.equal(pick("monk", 0).chapter, "c2b");
  assert.equal(pick("monk", 1).chapter, "c2a");
  assert.equal(pick("monk", 2).chapter, "c2a");
  assert.equal(pick("villager", 2).title, "Theo thầy tu tập");
  assert.equal(pick("villager", 0).title, "Còn nghi ngờ");
  assert.equal(pick("ghost", 0).title, "Đêm không còn chờ");
  assert.equal(pick("ghost", 2).title, "Còn chờ");
});

test("night 2 start/meterStart come from the chapter, not from c1", () => {
  const { Chapters, STORY } = env();
  for (const role of ROLES) for (const band of [0, 1, 2]) {
    const r = Chapters.startFor(role, arcWith("c1", band), 2);
    assert.notEqual(r.start, STORY[role].start);
    assert.ok(STORY[role].scenes[r.start], `${role} ${r.chapter} start exists`);
    assert.equal(typeof r.meterStart, "number");
  }
});

test("without a recorded c1 band the middle band is assumed", () => {
  const { Chapters } = env();
  assert.equal(Chapters.startFor("villager", null, 2).chapter, "c2b");
  assert.equal(Chapters.startFor("villager", { chapter: "c1", history: [] }, 2, { mem: ["v_alms"] }).chapter, "c2a");
  assert.equal(Chapters.startFor("ghost", {}, 2).chapter, "c2b");
  assert.equal(Chapters.startFor("monk", undefined, 2).chapter, "c2a");
});

test("night 3+ rotates the two ordinary chapters, never the same twice in a row, deterministic", () => {
  const { Chapters } = env();
  for (const role of ROLES) {
    const run = () => {
      let arc = arcWith("c1", 1);
      arc = { chapter: "c2a", history: [...arc.history, { chapter: "c2a", band: 1, day: 2 }] };
      const seq = [];
      for (let day = 3; day <= 12; day++) {
        const r = Chapters.startFor(role, arc, day);
        seq.push(r.chapter);
        arc = { chapter: r.chapter, history: [...arc.history, { chapter: r.chapter, band: 1, day }] };
      }
      return seq;
    };
    const a = run(), b = run();
    assert.deepEqual(a, b);
    assert.ok(a.every((c) => c === "n1" || c === "n2"));
    for (let i = 1; i < a.length; i++) assert.notEqual(a[i], a[i - 1]);
    assert.ok(a.includes("n1") && a.includes("n2"));
    // the first ordinary night never repeats the night before it
  }
});

test("ordinary night never repeats the chapter just played, even with an odd history", () => {
  const { Chapters } = env();
  for (const prev of ["n1", "n2"]) for (let day = 3; day < 9; day++) {
    const r = Chapters.startFor("monk", { chapter: prev, history: [{ chapter: "c2a", band: 1, day: 2 }, { chapter: prev, band: 1, day: day - 1 }] }, day);
    assert.notEqual(r.chapter, prev);
  }
});

test("a player who skipped c2 (older save) still gets c2 before ordinary nights", () => {
  const { Chapters } = env();
  const r = Chapters.startFor("villager", { chapter: "c1", history: [{ chapter: "c1", band: 1, day: 3 }] }, 4);
  assert.equal(r.chapter, "c2b");
});

test("bandOf picks the index of the ending like the game does", () => {
  const { Chapters } = env();
  const sc = { endings: [{ max: 3 }, { max: 7 }, { max: 10 }] };
  assert.equal(Chapters.bandOf(sc, 0), 0);
  assert.equal(Chapters.bandOf(sc, 3), 0);
  assert.equal(Chapters.bandOf(sc, 4), 1);
  assert.equal(Chapters.bandOf(sc, 7), 1);
  assert.equal(Chapters.bandOf(sc, 8), 2);
  assert.equal(Chapters.bandOf(sc, 10), 2);
  assert.equal(Chapters.bandOf(sc, 99), 2);
});

test("every chapter graph is well formed", () => {
  const { STORY, Chapters, TRACE_TEXT } = env();
  const validTrace = (t, where) => {
    assert.ok(TRACE_TEXT[t.kind], `${where}: unknown trace kind ${t.kind}`);
    assert.ok(Number.isInteger(t.variant) && t.variant >= 0 && t.variant < TRACE_TEXT[t.kind].length, `${where}: bad trace variant`);
  };
  const reachableAll = new Set();
  for (const role of ROLES) {
    const story = STORY[role];
    const ids = chapterIds(Chapters, role);
    assert.equal(ids[0], "c1");
    assert.ok(ids.length >= 5, `${role} has c1, two c2 and two ordinary chapters`);
    const c1 = walk(story, Chapters.get(role, "c1").start);
    for (const id of ids) {
      const ch = Chapters.get(role, id);
      assert.ok(ch.title && typeof ch.meterStart === "number" && ch.meterStart >= 0 && ch.meterStart <= 10, `${role}/${id} meta`);
      assert.ok(story.scenes[ch.start], `${role}/${id} start scene exists`);
      const seen = walk(story, ch.start);
      let ends = 0;
      for (const sid of seen) {
        const sc = story.scenes[sid];
        const where = `${role}/${id}/${sid}`;
        assert.ok(sc, `${where}: scene exists`);
        reachableAll.add(sid);
        if (id !== "c1") assert.ok(!c1.has(sid), `${where}: leaks into c1`);
        assert.ok(PLACES.includes(sc.place), `${where}: place ${sc.place}`);
        assert.ok(TIMES.includes(sc.time), `${where}: time ${sc.time}`);
        for (const l of sc.lines || []) {
          if (typeof l === "string") assert.ok(l.length > 0);
          else assert.ok(typeof l.text === "string" && l.text.length > 0, `${where}: line text`);
        }
        if (sc.end) {
          ends++;
          assert.ok(!sc.epilogue, `${where}: epilogue is not a night end`);
          assert.equal(sc.endings.length, 3, `${where}: 3 endings`);
          const maxes = sc.endings.map((e) => e.max);
          assert.equal(JSON.stringify([...maxes].sort((a, b) => a - b)), JSON.stringify(maxes), `${where}: ascending`);
          assert.equal(maxes[2], 10, `${where}: last max is 10`);
          for (const e of sc.endings) { assert.ok(e.text); if (e.trace) validTrace(e.trace, where); }
          continue;
        }
        if (sc.watch) continue; // a sitting scene with its own next
        assert.ok(sc.choices && sc.choices.length >= 1, `${where}: has choices`);
        if (id !== "c1") assert.ok(sc.choices.some((c) => !FLAG_KEYS.some((k) => c[k])), `${where}: has an always-available choice`);
        for (const c of sc.choices) {
          if (c.detour) { assert.ok(PLACES.includes(c.detour), `${where}: detour`); continue; }
          assert.ok(story.scenes[c.next], `${where}: next ${c.next} exists`);
          assert.equal(typeof c.delta, "number", `${where}: delta`);
          if (id !== "c1") assert.ok(Math.abs(c.delta) <= 2, `${where}: small delta`);
          if (c.trace) validTrace(c.trace, where);
          if (c.emit) assert.ok(EMITS.includes(c.emit), `${where}: emit ${c.emit}`);
        }
      }
      assert.ok(ends >= 1, `${role}/${id} reaches an end`);
      if (id !== "c1") {
        const n = seen.size;
        // the legacy chapters are 3-5 scenes plus the end; the short placeholder arrival chapters (pa, pb) are 1-2 plus the end
        const lo = id === "pa" || id === "pb" ? 2 : 3;
        assert.ok(n >= lo && n <= 6, `${role}/${id}: ${n} scenes`);
      }
    }
  }
  // no orphan scenes: all but the hermitage epilogue (t1..t4) belong to some chapter
  for (const role of ROLES) for (const sid of Object.keys(STORY[role].scenes)) {
    if (/^t\d$/.test(sid)) continue;
    assert.ok(reachableAll.has(sid), `${role}/${sid} is not reachable from any chapter`);
  }
});

test("ordinary chapters are short: 3 scenes each", () => {
  const { STORY, Chapters } = env();
  for (const role of ROLES) for (const id of ["n1", "n2"]) {
    const ch = Chapters.get(role, id);
    assert.equal(walk(STORY[role], ch.start).size, 3, `${role}/${id}`);
  }
});

test("scene ids are unique across roles' chapters (distinct prefixes)", () => {
  const { STORY } = env();
  const all = [];
  for (const role of ROLES) all.push(...Object.keys(STORY[role].scenes).map((id) => role + ":" + id));
  assert.equal(new Set(all).size, all.length);
  // new chapters use their own prefixes, not the c1 scene names
  const c1ids = { monk: /^(a\d|m\d|m5w|t\d|end)$/, ghost: /^(g\d|end)$/, villager: /^(v\d|end)$/ };
  for (const role of ROLES) {
    const fresh = Object.keys(STORY[role].scenes).filter((id) => !c1ids[role].test(id));
    assert.ok(fresh.length >= 14, `${role}: new scenes present`);
  }
});

test("Chapters.title and unknown chapters never throw", () => {
  const { Chapters } = env();
  assert.equal(Chapters.title("villager", "c2a"), "Theo thầy tu tập");
  assert.equal(Chapters.title("villager", "zzz"), "");
  assert.equal(Chapters.get("villager", "zzz"), null);
  assert.doesNotThrow(() => Chapters.startFor("nobody", null, 5));
  assert.equal(Chapters.startFor("nobody", null, 5).start, undefined);
});
