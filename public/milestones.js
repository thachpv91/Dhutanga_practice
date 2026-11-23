// Milestones (dấu mốc): private per-character markers kept inside the mind state (see docs/he-thong-tam.md 16.5),
// plus the pure rules for how a card is met (wholesome cards progress, unwholesome cards are only understood).
window.Milestones = (() => {
  const UNDERSTAND_AT = 3;
  const BAD_NAMES = { san: "Sân", hoi_han: "Hối hận", tham: "Tham", bon_xen: "Bỏn xẻn", si: "Si", phong_dat: "Phóng dật", hon_tram: "Hôn trầm", hoai_nghi: "Hoài nghi" };

  // ---------- pure card rules ----------
  // Unwholesome cards stop at UNDERSTAND_AT (old saves may hold more).
  const effN = (def, n) => (def.good ? n || 0 : Math.min(UNDERSTAND_AT, n || 0));
  const isUnderstood = (def, n) => !def.good && (n || 0) >= UNDERSTAND_AT;
  // The visit number at which face i (0..3) opens.
  const faceUnlockN = (def, i) => (def.good ? i + 2 : i < 3 ? 2 : UNDERSTAND_AT);
  // What happens when the card is met again after prevN encounters.
  function cardStep(def, prevN) {
    if (def.good) {
      const n = (prevN || 0) + 1;
      return { n, show: true, understood: false, opened: n >= 2 && n <= 5 ? n - 1 : 0 };
    }
    const prev = effN(def, prevN);
    if (prev >= UNDERSTAND_AT) return { n: UNDERSTAND_AT, show: false, understood: true, opened: 0 };
    const n = prev + 1;
    return { n, show: true, understood: n === UNDERSTAND_AT, opened: n >= 2 ? n - 1 : 0 };
  }

  // ---------- definitions ----------
  const defs = [
    { id: "first_card", title: "Lần đầu nhìn thấy tâm", text: "Lần đầu nhìn thấy tâm mình." },
    { id: "first_bad", title: "Thấy được một tâm bất thiện", text: "Thấy được {Tên}. Biết nó đang có mặt là bước đầu của niệm." },
    { id: "first_good", title: "Hạt giống thiện", text: "Một hạt giống thiện đã nảy mầm: {Tên}." },
    ...Object.keys(BAD_NAMES).map((k) => ({ id: "understood_" + k, title: "Đã xem đủ các mặt thẻ {Tên}", text: "Đã xem đủ các mặt thẻ {Tên}. Tình huống đã gặp vẫn còn để đọc lại." })),
    { id: "night_1", title: "Một đêm ở chùa", text: "Đi trọn một đêm." },
    { id: "night_7", title: "Bảy đêm ở chùa", text: "Bảy đêm đã qua, không cần liên tiếp." },
    { id: "night_30", title: "Ba mươi đêm", text: "Ba mươi đêm đã qua, không cần liên tiếp." },
    { id: "night_100", title: "Một trăm đêm", text: "Một trăm đêm đã qua, không cần liên tiếp." },
    { id: "first_dedicate", title: "Hồi hướng lần đầu", text: "Lần đầu chia phần phước của mình cho người khác." },
    { id: "first_deva", title: "Gặp chư thiên", text: "Một ánh sáng dừng lại trước người này.", hidden: true, being: "chu_thien" },
    { id: "met_tho_than", title: "Gặp thọ thần", text: "Một bà cụ hiền bước ra từ sau cây gạo.", being: "tho_than" },
    { id: "met_ba_ngoai", title: "Gặp bóng người bên mộ thấp", text: "Một bóng gầy đứng giữa nghĩa địa, nhớ nhà.", being: "ba_ngoai" },
    { id: "met_dia_than", title: "Gặp địa thần", text: "Một ông lão râu bạc hiện ra ở cổng làng.", being: "dia_than" },
    { id: "cave_found", title: "Hang đá bí mật", text: "Ngồi yên đủ lâu thì thấy được điều người vội không thấy.", hidden: true },
    { id: "promise_kept", title: "Lời hẹn đã đến", text: "Điều được hẹn hôm qua đã thật sự xảy ra.", hidden: true },
    { id: "want_more", title: "Muốn chơi thêm", text: "Thấy được mình đang muốn chơi thêm. Đó cũng là Tham.", hidden: true },
    { id: "palace_stay", title: "Ở lại thiên cung", text: "Tâm đủ dịu để ở lại nơi sáng.", hidden: true },
  ];
  const NIGHTS = [[1, "night_1"], [7, "night_7"], [30, "night_30"], [100, "night_100"]];
  const defOf = (id) => defs.find((d) => d.id === id);

  // ---------- state (always read from Mind: Mind.reload() swaps it) ----------
  let fallback = { got: {}, counts: {}, save() {} };
  function state() {
    const p = window.Mind && Mind.parts;
    const s = p && p.milestoneState ? p.milestoneState() : fallback;
    return s || fallback;
  }
  const cardName = (id) => {
    const c = window.Mind && Mind.parts && Mind.parts.CARDS && Mind.parts.CARDS[id];
    return (c && c.name) || BAD_NAMES[id] || id;
  };
  const fill = (t, name) => String(t).replace(/\{Tên\}/g, name || "");
  function view(id, rec) {
    const d = defOf(id);
    return { id, title: fill(d.title, rec.ctx && rec.ctx.name), text: fill(d.text, rec.ctx && rec.ctx.name), at: rec.at, hidden: !!d.hidden, being: d.being || "" };
  }

  function reach(s, id, name) {
    if (!defOf(id) || s.got[id]) return null;
    s.got[id] = { at: Date.now(), ctx: name ? { name } : {} };
    // memory event log (journey.js): one event per milestone, dated with its own `at`
    try { window.Journey && Journey.log(Journey.milestone(id, s.got[id].at)); } catch {}
    return view(id, s.got[id]);
  }

  // Counted in memory only: how many times "Sang đêm mới" was chosen since this page opened.
  let newNightsThisSession = 0;
  const WANT_MORE_AT = 3;

  function notify(event, data, opts) {
    const d = data || {}, s = state(), out = [];
    const add = (id, name) => { const m = reach(s, id, name); if (m) out.push(m); };
    if (event === "card" && d.id) {
      const name = cardName(d.id);
      add("first_card");
      const ethics = d.ethics || (d.good ? "sobhana" : "akusala");
      if (ethics === "sobhana") add("first_good", name);
      else if (ethics === "akusala") add("first_bad", name);
      if (ethics === "akusala" && d.understood) add("understood_" + d.id, name);
    } else if (event === "night") {
      s.counts.nights = (s.counts.nights || 0) + 1;
      for (const [n, id] of NIGHTS) if (s.counts.nights >= n) add(id);
      s.save(); // the counter changed even when nothing was reached
    } else if (event === "newnight") {
      newNightsThisSession++;
      if (newNightsThisSession >= WANT_MORE_AT) add("want_more");
    } else if (event === "promise") add("promise_kept");
    else if (event === "dedicate") add("first_dedicate");
    else if (event === "deva") add("first_deva");
    else if (event === "being" && d.id) add(d.id);
    else if (event === "cave") add("cave_found");
    else if (event === "palace") { if (d.outcome === "stay") add("palace_stay"); }
    if (out.length) s.save();
    if (out.length && !(opts && opts.quiet)) reveal(out);
    return out;
  }

  // Players who collected cards before milestones existed get them recorded once, without popups.
  function backfill(cards) {
    const all = (window.Mind && Mind.parts && Mind.parts.CARDS) || {};
    const owned = Object.keys(cards || {}).filter((id) => all[id] && cards[id] && cards[id].n > 0);
    const out = [];
    for (const id of owned) {
      const def = all[id];
      const ethics = def.ethics || (def.good ? "sobhana" : "akusala");
      out.push(...notify("card", { id, n: cards[id].n, good: def.good, ethics, understood: ethics === "akusala" && isUnderstood(def, cards[id].n) }, { quiet: true }));
    }
    return out;
  }

  const list = () => since(0);
  function since(ts) {
    const got = state().got;
    return Object.keys(got).filter((id) => defOf(id) && got[id].at >= ts).map((id) => view(id, got[id])).sort((a, b) => a.at - b.at);
  }
  const has = (id) => !!state().got[id];

  // ---------- reveal queue ----------
  const queue = [];
  let showing = false;
  // Shows the given milestones one after another, waiting while a card or sheet is on screen.
  function reveal(items, done) {
    queue.push(...items);
    if (done) queue.push({ done });
    pump();
  }
  function pump() {
    if (showing || !queue.length) return;
    if (window.Mind && Mind.isOpen && Mind.isOpen()) { setTimeout(pump, 600); return; }
    const item = queue.shift();
    if (item.done) { item.done(); pump(); return; }
    showing = true;
    api.ui.show(item, () => { showing = false; pump(); });
  }

  // ---------- reveal overlay ----------
  const NS = "http://www.w3.org/2000/svg";
  // Small lotus emblem, warm gold on dark.
  function emblem(size) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 48 48");
    svg.setAttribute("width", String(size || 56)); svg.setAttribute("height", String(size || 56));
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "ms-emblem");
    const petal = (d, o) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", d); p.setAttribute("fill", "currentColor"); p.setAttribute("fill-opacity", o); p.setAttribute("stroke", "currentColor"); p.setAttribute("stroke-width", "1"); svg.appendChild(p); };
    petal("M24 8 C31 17 31 28 24 38 C17 28 17 17 24 8 Z", "0.35");
    petal("M24 38 C20 30 12 27 5 27 C8 35 15 40 24 38 Z", "0.2");
    petal("M24 38 C28 30 36 27 43 27 C40 35 33 40 24 38 Z", "0.2");
    const base = document.createElementNS(NS, "path");
    base.setAttribute("d", "M12 42 H36"); base.setAttribute("stroke", "currentColor"); base.setAttribute("stroke-width", "1.5"); base.setAttribute("stroke-linecap", "round");
    svg.appendChild(base);
    return svg;
  }
  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function showOverlay(item, done) {
    const wrap = el("div", "ms-reveal");
    wrap.setAttribute("role", "dialog"); wrap.setAttribute("aria-modal", "true");
    const box = el("div", "ms-box");
    box.append(el("div", "ms-kicker", "Dấu mốc"), emblem(64), el("h3", "ms-title", item.title), el("p", "ms-text", item.text));
    const ok = el("button", "primary ms-ok", "Tiếp tục");
    ok.type = "button";
    ok.addEventListener("click", () => { wrap.remove(); done(); });
    box.appendChild(ok);
    wrap.appendChild(box);
    (document.querySelector(".app") || document.body).appendChild(wrap);
    try { if (window.NightAudio && NightAudio.bell && (!window.Mind || !Mind.soundOn || Mind.soundOn())) NightAudio.bell(0.4); } catch {}
    ok.focus();
  }

  const api = { notify, backfill, list, since, has, defs, reveal, emblem, rules: { cardStep, effN, isUnderstood, faceUnlockN, UNDERSTAND_AT }, ui: { show: showOverlay } };
  return api;
})();
