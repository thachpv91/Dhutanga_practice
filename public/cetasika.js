// The 52 cetasikas (tâm sở) as laid out on the Theravāda Abhidhamma wall chart "Bảng nêu chi pháp".
// Each one is a circle token whose ring is split into arcs: the feelings (thọ) it can arise with.
// We borrow the idea and the colours, not the picture. Study aid only; needs review by a teacher.
window.Cetasika = (() => {
  const ORDER = ["hy", "xa", "uu", "kho", "lac"];
  const FEELINGS = {
    // Colours are the five dots in the legend of the chart "Bảng nêu chi pháp":
    // thọ hỷ pink, xả blue, ưu orange, khổ gray, lạc red.
    hy: { name: "Thọ hỷ", plain: "vui", color: "#f39cc2" },
    xa: { name: "Thọ xả", plain: "bình thản", color: "#00afef" },
    uu: { name: "Thọ ưu", plain: "buồn bực", color: "#f48635" },
    kho: { name: "Thọ khổ", plain: "đau thân", color: "#96989b" },
    lac: { name: "Thọ lạc", plain: "dễ chịu nơi thân", color: "#ed3338" },
  };
  const ALL5 = ORDER.slice(), HXU = ["hy", "xa", "uu"], HX = ["hy", "xa"];
  const GROUPS = [
    { key: "bien_hanh", title: "7 sở hữu biến hành", short: "Biến hành", parts: [{ key: null, title: "", feelings: ALL5, names: ["Xúc", "Thọ", "Tưởng", "Tư", "Nhất hành", "Mạng quyền", "Tác ý"] }] },
    { key: "biet_canh", title: "6 sở hữu biệt cảnh", short: "Biệt cảnh", parts: [
      { key: null, title: "", feelings: HXU, only: { "Hỷ": ["hy"] }, names: ["Tầm", "Tứ", "Thắng giải", "Cần", "Hỷ", "Dục"] }] },
    { key: "bat_thien", title: "14 sở hữu bất thiện", short: "tâm sở bất thiện", parts: [
      { key: "si", title: "Si phần", feelings: HXU, names: ["Si", "Vô tàm", "Vô quý", "Phóng dật"] },
      { key: "tham", title: "Tham phần", feelings: HX, names: ["Tham", "Tà kiến", "Ngã mạn"] },
      { key: "san", title: "Sân phần", feelings: ["uu"], names: ["Sân", "Tật", "Lận", "Hối"] },
      { key: "hon", title: "Hôn phần", feelings: HXU, names: ["Hôn trầm", "Thụy miên"] },
      { key: "nghi", title: "Nghi phần", feelings: ["xa"], names: ["Hoài nghi"] }] },
    { key: "tinh_hao", title: "25 sở hữu tịnh hảo", short: "tâm sở tịnh hảo", parts: [
      { key: "bien_hanh", title: "Tịnh hảo biến hành", feelings: HX, names: ["Tín", "Niệm", "Tàm", "Quý", "Vô tham", "Vô sân", "Hành xả", "Tịnh thân", "Tịnh tâm", "Khinh thân", "Khinh tâm", "Nhu thân", "Nhu tâm", "Thích thân", "Thích tâm", "Thuần thân", "Thuần tâm", "Chánh thân", "Chánh tâm"] },
      { key: "gioi", title: "Giới phần", feelings: HX, names: ["Chánh ngữ", "Chánh nghiệp", "Chánh mạng"] },
      { key: "vo_luong", title: "Vô lượng phần", feelings: HX, names: ["Bi", "Tùy hỷ"] },
      { key: "tue", title: "Trí tuệ", feelings: HX, names: ["Trí tuệ"] }] },
  ];
  const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase().replace(/[^a-z]+/g, "_");
  const all = [];
  for (const g of GROUPS) for (const p of g.parts) {
    p.items = p.names.map((name) => {
      let id = slug(name);
      if (all.some((o) => o.id === id)) id += "_" + g.key;
      const e = { id, name, group: g.key, part: p.key, feelings: (p.only && p.only[name] || p.feelings).slice() };
      all.push(e);
      return e;
    });
  }
  const GAME = { dinh: "Nhất hành", si: "Si", phong_dat: "Phóng dật", hon_tram: "Hôn trầm", hoai_nghi: "Hoài nghi", san: "Sân", hoi_han: "Hối", tham: "Tham", bon_xen: "Lận", khong_san: "Vô sân", khong_tham: "Vô tham", niem: "Niệm", hy: "Hỷ", bi: "Bi", tuy_hy: "Tùy hỷ" };
  const byId = (id) => all.find((e) => e.id === id);
  const byName = (n) => all.find((e) => e.name === n);
  const byGame = (gid) => (GAME[gid] ? byName(GAME[gid]) : null);
  const resolve = (x) => (typeof x === "string" ? byId(x) || byGame(x) : x);
  const groups = () => GROUPS;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Short line for the card: "Sân phần · 14 tâm sở bất thiện".
  function groupLine(entry) {
    const g = GROUPS.find((x) => x.key === entry.group), p = g.parts.find((x) => x.items.includes(entry));
    if (g.key === "bien_hanh") return "Biến hành · 7 tâm sở đi cùng mọi tâm";
    if (g.key === "biet_canh") return "Biệt cảnh · 6 tâm sở";
    const n = g.title.split(" ")[0];
    return `${p.title} · ${n} ${g.short}`;
  }

  // SVG token. Ring: radius 42 with pathLength 100, one equal arc per feeling.
  // Ring split into one arc per feeling, in a fixed order.
  function arcsFor(e) {
    const fs = ORDER.filter((k) => e.feelings.includes(k)), k = fs.length, seg = 100 / k, gap = k > 1 ? 2.2 : 0;
    let arcs = "";
    fs.forEach((f, i) => {
      const len = +(seg - gap).toFixed(2), start = +(i * seg + gap / 2).toFixed(2);
      const common = `cx="50" cy="50" r="42" fill="none" pathLength="100" transform="rotate(-90 50 50)" stroke-dashoffset="${-start}"`;
      if (FEELINGS[f].edge) arcs += `<circle class="cz-halo" ${common} stroke="${FEELINGS[f].edge}" stroke-width="12.5" stroke-dasharray="${len} ${100 - len}"/>`;
      arcs += `<circle class="cz-arc cz-${f}" style="--i:${i}" ${common} stroke="${FEELINGS[f].color}" stroke-width="10" stroke-dasharray="${len} ${100 - len}"/>`;
    });
    return arcs;
  }

  // faint: an unmet entry still shows its feeling colours, dimmed, like a map of the road ahead.
  function token(x, { size = 96, lit = true, label, faint = false } = {}) {
    const e = resolve(x);
    const name = label != null ? label : e ? e.name : "?";
    const cls = lit ? " lit" : faint && e ? " unlit cz-faint" : " unlit";
    const base = `<svg class="cz-token${cls}" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${esc(lit ? name : "Chưa gặp")}" xmlns="http://www.w3.org/2000/svg">`;
    if (!lit && faint && e) return base + `<circle cx="50" cy="50" r="35" fill="#10181a" fill-opacity=".6"/>` + arcsFor(e) + `</svg>`;
    if (!lit || !e) {
      return base + `<circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="3" stroke-dasharray="5 5"/>` +
        (size >= 40 ? `<text x="50" y="58" text-anchor="middle" font-size="26" fill="currentColor" fill-opacity=".5">?</text>` : "") + `</svg>`;
    }
    let text = "";
    if (size >= 40) {
      const words = name.split(" ");
      const lines = words.length >= 2 ? [words[0], words.slice(1).join(" ")] : [name];
      const longest = Math.max(...lines.map((l) => l.length));
      const f = Math.max(9, Math.min(17, 54 / (longest * 0.58)));
      const y0 = 50 + f * 0.35 - (lines.length - 1) * f * 0.55;
      text = lines.map((l, i) => `<text x="50" y="${(y0 + i * f * 1.1).toFixed(1)}" text-anchor="middle" font-size="${f.toFixed(1)}" fill="#efe7d3" font-weight="600">${esc(l)}</text>`).join("");
    }
    return base + `<circle cx="50" cy="50" r="35" fill="#10181a" stroke="#ffffff" stroke-opacity=".08"/>` + arcsFor(e) + text + `</svg>`;
  }

  // ---------- catalog popup view-model ("Tất cả các thẻ") ----------
  // Pure: no DOM. Every entry becomes one tile in one of three states:
  //   owned   the character has the in-game card for it: { state, id, game, name, good, n, sub, compact: false }
  //   hint    an in-game card not met yet: { state, hint, compact: false } (the card's "where" line, no name)
  //   locked  not in the game yet: { state, compact: true } (no name, no id, no hint, no text)
  // Unmet tiles deliberately carry no id or name, so the real name cannot leak through them.
  // Plain-language group titles for this popup; the traditional names stay on the card view.
  const POPUP_TITLES = {
    bien_hanh: "Các tâm có mặt trong mọi khoảnh khắc",
    biet_canh: "Các tâm đến tùy lúc, tùy việc đang làm",
    bat_thien: "Các tâm làm lòng nặng và rối",
    tinh_hao: "Các tâm tốt đẹp, làm lòng nhẹ và sáng",
  };
  const GROUP_HINTS = {
    bien_hanh: "Những yếu tố có mặt trong mọi khoảnh khắc của tâm.",
    biet_canh: "Những yếu tố đi kèm tùy lúc, tùy việc đang làm.",
    bat_thien: "Những tâm làm lòng nặng, rối. Gặp và hiểu chúng là cách để nhẹ đi.",
    tinh_hao: "Những tâm lành, làm lòng nhẹ và sáng.",
  };
  // Game ids of the cards that exist in the game (the ones that map to a cetasika); the rest are locked.
  const GAME_IDS = Object.keys(GAME);
  // Ghosts do not train meditation, so these two cards stay locked for role "ghost" (docs/ghost-playable-campaign-bible.md §2.3).
  const GHOST_LOCKED = ["niem", "dinh"];
  // owned: saved cards by game id; cards: card definitions by game id ({ name, good, where });
  // count(gameId, savedCard) gives the number shown as "gặp N lần" (defaults to the saved n).
  // role (optional): "monk" | "villager" | "ghost"; undefined is the generic view.
  function catalog({ owned = {}, cards = {}, count = (g, o) => o.n, role } = {}) {
    const gameOf = new Map();
    for (const g of GAME_IDS) { const e = byGame(g); if (e) gameOf.set(e.id, g); }
    const tileFor = (e) => {
      const g = gameOf.get(e.id);
      if (!g || (role === "ghost" && GHOST_LOCKED.includes(g))) return { state: "locked", compact: true };
      const def = cards[g] || {};
      if (owned[g]) {
        const n = count(g, owned[g]);
        return { state: "owned", id: e.id, game: g, name: def.name || e.name, good: !!def.good, n, sub: `gặp ${n} lần`, compact: false };
      }
      return { state: "hint", hint: def.where || "", compact: false };
    };
    let met = 0;
    // Sub-groups are not shown; the tiles of a group form one list, big tiles first, compact locked ones after.
    const groups = GROUPS.map((g) => {
      const items = g.parts.flatMap((p) => p.items.map(tileFor));
      const tiles = [...items.filter((t) => !t.compact), ...items.filter((t) => t.compact)];
      const gm = tiles.filter((t) => t.state === "owned").length;
      met += gm;
      return { key: g.key, title: POPUP_TITLES[g.key] || g.title, hint: GROUP_HINTS[g.key] || "", met: gm, total: tiles.length, open: true, tiles };
    });
    return { met, total: all.length, groups };
  }

  // Explanation shown inside the "Tất cả các thẻ" popup: one short invitation line, and a "Tâm sở là gì?" link
  // that opens a small tooltip with tâm sở / tâm. Owner-approved copy for the tooltip; use exactly as written.
  const LORE = {
    intro: "Mỗi thẻ là một yếu tố của tâm (tâm sở). Thu thập thẻ để mở ra những tầng truyện và thử thách mới. Thẻ cũng giúp nhân vật tu tập, từng chút thay đổi chỉ số tâm. Còn nhiều thẻ đang chờ bạn tìm ra.",
    // Intro for role "ghost": promises no stories and no stat changes.
    introGhost: "Mỗi thẻ là một yếu tố của tâm (tâm sở). Mỗi lần nhận ra một thẻ, thế giới hiện thêm một mặt của tâm. Còn nhiều thẻ đang chờ bạn tìm ra.",
    linkLabel: "Tâm sở là gì?",
    // The "Tâm sở là gì?" link + tooltip is switched off for now: players learn by playing, the definition will
    // go into the tịnh thất / a teacher talk later. Flip to true to bring it back (code and copy are kept).
    showTip: false,
    // lead is set in bold; rest follows it as plain text
    paragraphs: [
      { lead: "Tâm sở", rest: " — những yếu tố nhỏ đi cùng tâm trong từng khoảnh khắc: thương, giận, nhớ, vui… Có cái làm lòng nặng và rối, có cái làm lòng nhẹ và sáng." },
      { lead: "Tâm", rest: " — sự nhận thức, cái biết: biết thấy, nghe, nghĩ, cảm khi một điều gì đó đến với mình." },
    ],
  };

  return { FEELINGS, ORDER, all, groups, byGame, byId, byName, token, groupLine, catalog, LORE, GAME_IDS };
})();
