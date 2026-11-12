// Storylets: "việc trong đêm" as data (see docs/kich-ban-vong-ngay.md §2 and the villager night plan).
// A storylet has conditions (role, phase of the clock, day, cooldown, needs) and a short scene.
// Conditions, all optional: phases, once, cooldownDays, needs (other storylets done), fromDay / untilDay (which
// night of the character), needsQuest ({ tree: ["done"] }: the step of an errand kept by encounters.js or mind.js).
// scene.again holds the lines of later visits: again[0] the second time, the last entry from then on.
// Only characters on the clock ("đến nơi") get them; a legacy character has phase null and sees none.
// Part 1 (window.Storylets) is pure and testable. Part 2 registers the errands with Mind (see mind.js).

// ---------- Part 1: pure logic ----------
window.Storylets = (() => {
  // FNV-1a, 32-bit: the same seed and id always give the same number.
  function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return h >>> 0;
  }

  // ctx = { role, phase, day, state, carita, quests }; quests = the saved errands (S.q), read only. state = { done: { [id]: { n, lastDay } }, tonight: { runId, ids } }
  function eligible(defs, ctx) {
    const done = (ctx.state && ctx.state.done) || {};
    if (ctx.phase == null) return [];
    return defs.filter((d) => {
      if (!(d.roles || []).includes(ctx.role)) return false;
      if (d.phases && d.phases.length && !d.phases.includes(ctx.phase)) return false;
      const rec = done[d.id];
      if (d.once && rec && rec.n > 0) return false;
      if (d.cooldownDays && rec && rec.lastDay != null && ctx.day - rec.lastDay < d.cooldownDays) return false;
      if (d.fromDay != null && ctx.day < d.fromDay) return false;
      if (d.untilDay != null && ctx.day > d.untilDay) return false;
      const quests = ctx.quests || {};
      for (const name of Object.keys(d.needsQuest || {})) {
        const stepNow = (quests[name] && quests[name].step) || "none";
        if (!d.needsQuest[name].includes(stepNow)) return false;
      }
      return (d.needs || []).every((id) => id in done);
    });
  }

  // The tonight record for this run; another run (or none) starts empty.
  function tonightFor(state, runId) {
    const t = state && state.tonight;
    return t && t.runId === runId ? t : { runId, ids: [] };
  }

  // Up to two side errands per run; main errands are always kept. Seed = runId, so one night is stable.
  function offered(defs, ctx, seed) {
    const t = tonightFor(ctx.state, seed);
    const open = eligible(defs, ctx).filter((d) => !t.ids.includes(d.id));
    const mains = open.filter((d) => d.kind === "main");
    const sides = open.filter((d) => d.kind === "side");
    // Side errands left for tonight: at most 2 per run, and at most 2 shown at once.
    // Only side errands count: finishing the main errand must not use up a side slot.
    const kindOf = {};
    for (const d of defs) kindOf[d.id] = d.kind;
    const sidesDone = t.ids.filter((id) => kindOf[id] !== "main").length;
    const quota = Math.max(0, 2 - sidesDone);
    sides.sort((a, b) => (b.weight || 1) - (a.weight || 1) || hash(String(seed) + a.id) - hash(String(seed) + b.id));
    return mains.concat(sides.slice(0, quota));
  }

  // The lines to show. On a later visit (timesDone > 0) the "again" lines when the scene has them;
  // otherwise the lines for this temperament, or the default when there is no variant.
  function lines(def, carita, timesDone) {
    const again = def.scene.again;
    if (timesDone > 0 && again && again.length) return again[Math.min(timesDone, again.length) - 1];
    const L = def.scene.lines;
    return carita && Object.prototype.hasOwnProperty.call(L, carita) ? L[carita] : L.default;
  }

  // Returns a new state; the old one is not changed.
  function complete(state, def, runId, day) {
    const s = state || {};
    const done = { ...(s.done || {}) };
    const prev = done[def.id] || { n: 0, lastDay: null };
    done[def.id] = { n: prev.n + 1, lastDay: day };
    const t = tonightFor(s, runId);
    const ids = t.ids.includes(def.id) ? t.ids.slice() : t.ids.concat([def.id]);
    return { ...s, done, tonight: { runId, ids } };
  }

  // Sample storylets for villagers (HG26 Tịnh thất, HG12 Ao sen, HG20 Ngõ làng). Draft text for the owner to rewrite.
  const DEFS = [
    {
      id: "chuong_chieu", kind: "side", weight: 1, roles: ["villager"], needs: [],
      phases: ["Chiều tàn", "Chạng vạng", "Đầu hôm"], cooldownDays: 2,
      place: "hermitage", placeName: "Tịnh thất", radius: 70,
      prompt: "Đứng nghe chuông", title: "Tiếng chuông chiều", body: "Có tiếng chuông nhỏ từ tịnh thất.",
      scene: {
        label: "Tịnh thất",
        lines: {
          default: ["Tiếng chuông chiều ngân lên từ tịnh thất, chậm và thưa.", "Chim bay về tổ. Không có việc gì phải làm."],
          tham: ["Tiếng chuông chiều ngân lên, chậm và thưa.", "Người này muốn đứng nghe mãi, chưa muốn đi đâu."],
          san: ["Tiếng chuông chiều ngân lên, chậm và thưa.", "Cơn bực dọc trong ngày dịu đi một chút."],
        },
        choices: [
          { label: "Đứng nghe thêm một lúc", log: "Đã đứng nghe tiếng chuông chiều ở tịnh thất." },
          { label: "Đi tiếp", snooze: true },
        ],
      },
    },
    {
      id: "ao_sen", kind: "side", weight: 1, roles: ["villager"], needs: [],
      phases: ["Sáng sớm", "Sáng", "Trưa", "Chiều"], cooldownDays: 2,
      place: "ao", placeName: "Ao sen", radius: 70,
      prompt: "Ngắm ao sen", title: "Ao sen", body: "Ao sen đầu làng, mặt nước phẳng lặng.",
      scene: {
        label: "Ao sen",
        lines: {
          default: ["Mặt ao phẳng lặng. Vài bông sen đã nở, vài bông còn búp.", "Bóng mây trôi chậm dưới nước."],
        },
        choices: [
          { label: "Ngắm một lúc", log: "Đã ngắm ao sen." },
          { label: "Đi tiếp", snooze: true },
        ],
      },
    },
    {
      id: "sang_thuong", kind: "side", weight: 1, roles: ["villager"], needs: [],
      phases: ["Sáng sớm", "Sáng"], cooldownDays: 2,
      place: "village", placeName: "Ngõ làng", radius: 80,
      prompt: "Dừng lại ở ngõ", title: "Một buổi sáng bình thường", body: "Khói bếp lên từ nhà ai đó.",
      scene: {
        label: "Ngõ làng",
        lines: {
          default: ["Một buổi sáng bình thường. Gà gáy ở đâu đó, khói bếp lên từ nhà ai.", "Không có gì đặc biệt, và thế là đủ."],
        },
        choices: [
          { label: "Ngồi nghe chim một lát", log: "Đã có một buổi sáng bình thường ở làng." },
          { label: "Đi tiếp", snooze: true },
        ],
      },
    },
  ];

  return { DEFS, hash, eligible, offered, lines, complete, tonightFor };
})();

// ---------- Part 2: the errands shown in Việc đang chờ and opened on arrival ----------
(() => {
  const K = Mind.kit;

  // Chỉ nhân vật đến nơi (có đồng hồ) mới có tình huống; ngoài ra phase là null và không làm gì.
  function ctx() {
    const api = K.api();
    if (!api || !api.phase) return null;
    const phase = api.phase();
    if (phase == null) return null;
    K.S.q = K.S.q || {};
    if (!K.S.q.storylets) K.S.q.storylets = { done: {}, tonight: { runId: null, ids: [] } };
    return {
      role: K.role(), phase, day: api.day(), runId: api.runId ? api.runId() : null,
      state: K.S.q.storylets, carita: K.S.carita, quests: K.S.q,
    };
  }
  const stand = (p, dx = 26, dy = 6) => ({ x: p.x + dx, y: p.y + dy });
  const openList = (c) => Storylets.offered(Storylets.DEFS, c, c.runId || "");

  function targets() {
    const c = ctx();
    if (!c) return [];
    const out = [];
    for (const d of openList(c)) {
      const p = World.PLACES[d.place];
      if (!p) continue;
      out.push({ title: d.title, body: d.body, ...stand(p), name: d.placeName });
    }
    return out;
  }

  function loop() {
    const c = ctx();
    if (!c) return false;
    for (const d of openList(c)) {
      const p = World.PLACES[d.place];
      if (!p || !K.near(p, d.radius || 60)) continue;
      // Offered as a button; only a tap opens the scene (never by walking near).
      return K.offer("storylet:" + d.id, d.prompt || d.title, () => show(d, c));
    }
    return false;
  }

  function show(d, c) {
    K.showSheet({
      label: d.scene.label,
      lines: Storylets.lines(d, c.carita, ((c.state.done || {})[d.id] || { n: 0 }).n),
      choices: d.scene.choices.map((ch) => ({ label: ch.label, fn: () => choose(d, ch, c) })),
    });
  }

  function choose(d, ch, c) {
    if (ch.snooze) {
      // Đóng, không tính là xong. Nút gợi ý vẫn còn đó khi người chơi còn đứng gần.
      K.closeSheet();
      return;
    }
    if (ch.log) Save.log(ch.log);
    if (ch.mood) K.api().swingMood(ch.mood);
    if (ch.toast) K.api().toast(ch.toast);
    K.S.q.storylets = Storylets.complete(K.S.q.storylets, d, c.runId || "", c.day);
    K.save();
    K.closeSheet();
    K.cooldown(2500);
    if (ch.card) K.award(ch.card.id, ch.card.reason);
  }

  Mind.register({ targets, loop });
})();
