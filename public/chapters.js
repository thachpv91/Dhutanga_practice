// Which scene a night starts at (pure logic, no DOM).
// A character created after the player-centric change plays arc.mode "arrival": night 1 = pa ("Đến làng"),
// every later night = pb (story-arrival.js). Older characters keep the chapters below (arc.mode "legacy" or unset).
// Each role keeps ONE scenes map in story.js / story-nights.js. A "chapter" is just a different
// start scene in that map, picked from how the earlier nights ended:
//   night 1  -> c1  (the original story)
//   night 2  -> c2a / c2b  (by the c1 ending band)
//   night 3+ -> n1 / n2  (ordinary nights, rotated, never the same one twice running)
// The ending band is the index of the chosen ending: 0 = low max, 1 = mid, 2 = high.
window.Chapters = (() => {
  const PLAN = {
    monk: {
      c1: { title: "Đêm đầu" },
      c2a: { title: "Người ngồi cạnh", start: "m2a_0", meterStart: 6 },
      c2b: { title: "Ngồi lại với cơn buồn ngủ", start: "m2b_0", meterStart: 4 },
      n1: { title: "Đêm trăng", start: "mn1_0", meterStart: 5 },
      n2: { title: "Đêm mưa phùn", start: "mn2_0", meterStart: 5 },
      pa: { title: "Đến nghĩa địa", start: "pa_0", meterStart: 5 },
      pb: { title: "Một đêm yên", start: "pb_0", meterStart: 5 },
    },
    ghost: {
      c1: { title: "Đêm đầu" },
      c2a: { title: "Đêm không còn chờ", start: "g2a_0", meterStart: 3 },
      c2b: { title: "Còn chờ", start: "g2b_0", meterStart: 7 },
      n1: { title: "Đêm trăng", start: "gn1_0", meterStart: 5 },
      n2: { title: "Đêm mưa phùn", start: "gn2_0", meterStart: 5 },
      pa: { title: "Tỉnh giữa nghĩa địa", start: "pa_0", meterStart: 5 },
      pb: { title: "Một đêm lặng", start: "pb_0", meterStart: 5 },
    },
    villager: {
      c1: { title: "Đêm đầu" },
      c2a: { title: "Theo thầy tu tập", start: "v2a_0", meterStart: 6 },
      c2b: { title: "Còn nghi ngờ", start: "v2b_0", meterStart: 4 },
      n1: { title: "Đêm trăng", start: "vn1_0", meterStart: 5 },
      n2: { title: "Đêm mưa phùn", start: "vn2_0", meterStart: 5 },
      pa: { title: "Đến làng", start: "pa_0", meterStart: 5 },
      pb: { title: "Một đêm êm", start: "pb_0", meterStart: 5 },
    },
  };
  const ORDER = ["c1", "c2a", "c2b", "n1", "n2", "pa", "pb"];
  const MIDDLE = 1;

  const storyOf = (role, opts) => (opts && opts.story) || (window.STORY && window.STORY[role]) || null;
  const has = (mem, key) => {
    if (!mem) return false;
    if (typeof mem.has === "function") return mem.has(key);
    return Array.isArray(mem) && mem.includes(key);
  };
  const history = (arc) => (arc && Array.isArray(arc.history) ? arc.history.filter((h) => h && typeof h.chapter === "string") : []);

  function get(role, chapter) {
    const plan = PLAN[role];
    if (!plan || !plan[chapter]) return null;
    if (chapter !== "c1") return { chapter, ...plan[chapter] };
    const s = storyOf(role);
    return { chapter, ...plan.c1, start: s && s.start, meterStart: s && s.meterStart };
  }
  const list = (role) => (PLAN[role] ? ORDER.filter((c) => PLAN[role][c]) : []);
  const title = (role, chapter) => (PLAN[role] && PLAN[role][chapter] ? PLAN[role][chapter].title : "");

  // index of the ending that applies at this meter (same rule the game uses to show it)
  function bandOf(scene, meter) {
    const ends = (scene && scene.endings) || [];
    const i = ends.findIndex((e) => meter <= e.max);
    return i < 0 ? Math.max(0, ends.length - 1) : i;
  }

  // Did the character walk out of the first night in a good place?
  // villager: trust (high band, or remembered the alms); ghost: released (low Chấp); monk: not restless.
  function goodFirstNight(role, band, mem) {
    if (role === "villager") return band >= 2 || has(mem, "v_alms");
    if (role === "ghost") return band <= 0;
    return band >= 1;
  }

  // -> { chapter, title, start, meterStart }
  // opts: { mem: Set|Array of account-memory keys, story: STORY[role] }
  function startFor(role, arc, day, opts) {
    const hist = history(arc);
    // the player's own story: first night "pa", every later night "pb" (no legacy c1/c2 chapters)
    if (arc && arc.mode === "arrival" && PLAN[role] && PLAN[role].pa) {
      const key = day >= 2 || hist.length ? "pb" : "pa";
      const m = PLAN[role][key];
      return { chapter: key, title: m.title, start: m.start, meterStart: m.meterStart };
    }
    let chapter = "c1";
    if (day >= 2) {
      const c2Played = hist.some((h) => /^c2/.test(h.chapter));
      if (!c2Played) {
        const c1 = hist.filter((h) => h.chapter === "c1").pop();
        const band = c1 && Number.isInteger(c1.band) ? c1.band : MIDDLE;
        chapter = goodFirstNight(role, band, opts && opts.mem) ? "c2a" : "c2b";
      } else {
        const prev = hist.length ? hist[hist.length - 1].chapter : arc && arc.chapter;
        const pref = day % 2 === 1 ? "n1" : "n2";
        chapter = pref === prev ? (pref === "n1" ? "n2" : "n1") : pref;
      }
    }
    const meta = PLAN[role] && PLAN[role][chapter];
    if (chapter === "c1" || !meta) {
      const s = storyOf(role, opts);
      return { chapter: "c1", title: title(role, "c1"), start: s ? s.start : undefined, meterStart: s ? s.meterStart : undefined };
    }
    return { chapter, title: meta.title, start: meta.start, meterStart: meta.meterStart };
  }

  return { startFor, get, list, title, bandOf, goodFirstNight };
})();
