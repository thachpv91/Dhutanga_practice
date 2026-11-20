// Sổ Hành Trình: one book with four views, shared by the quest panel and the profile.
//   Nơi chốn và nhân vật · Đang theo · Đã học · Dòng thời gian
// mode "live": the character being played (reads the live Discover, Mind and Save).
// mode "saved": any other character (reads only the saved mind and history passed in).
// The view-models at the bottom are pure and exposed for tests; render() is the only part that touches the DOM.
window.JourneyBook = (() => {
  const SECTIONS = [
    ["places", "Nơi chốn và nhân vật"],
    ["threads", "Đang theo"],
    ["learned", "Đã học"],
    ["timeline", "Dòng thời gian"],
  ];
  const EMPTY = {
    threads: "Chưa có chuyện nào đang theo. Cứ đi dạo, chuyện sẽ tìm đến.",
    learned: "Chưa có bài học nào. Đọc một đoạn kinh ở tịnh thất sẽ có mục đầu tiên.",
    timeline: "Chưa có gì được ghi lại. Đi dạo, gặp người và làm việc thiện, mọi điều đáng nhớ sẽ hiện ở đây.",
    hidden: "Còn những dấu mốc chưa lộ diện.",
  };
  const DIARY_MAX = 100; // newest diary lines shown in the timeline
  let section = "places"; // remembered between openings
  let showClosed = false; // "Hiện cả chuyện đã khép", remembered too

  // ---------- pure view-models ----------
  const fill = (t, name) => String(t).replace(/\{Tên\}/g, name || "");
  const time = (v) => (typeof v === "number" ? v : Date.parse(v) || 0);

  // Seen beats heard; anything else is unknown. Works on any { heard, seen, visited } book.
  function stateOf(disc, id) {
    const d = disc || {};
    if (d.seen && d.seen[id]) return "seen";
    if (d.heard && d.heard[id]) return "heard";
    return "unknown";
  }
  function placeName(key) {
    const p = window.World && World.PLACES && World.PLACES[key];
    return p ? p.name : "";
  }
  // meta: the Discover entries without functions (Discover.meta()). Rows keep the list order.
  function placesView(disc, meta) {
    const list = meta || (window.Discover && Discover.meta ? Discover.meta() : []);
    const rows = list.map((e) => ({
      id: e.id,
      title: e.title,
      place: e.place,
      placeName: placeName(e.place),
      hint: e.hint,
      rumour: e.rumour || "",
      state: stateOf(disc, e.id),
      condText: e.condText || (e.conds || []),
    }));
    return { rows, seen: rows.filter((r) => r.state === "seen").length, total: rows.length };
  }

  // A thread is closed when its quest state says the story is over. The dog/herbs chain counts as done
  // once the errands are finished and the monk is next (mind.js quest steps).
  const stepOf = (mind, key) => ((mind && mind.q && mind.q[key]) || {}).step;
  const CLOSED = [
    { id: "chain", title: "Con chó và rau trong làng", done: (m) => ["monk", "sit", "deva", "done"].includes(((m && m.quest) || {}).step) },
    { id: "tree", title: "Thọ thần và bé Na", done: (m) => stepOf(m, "tree") === "done" },
    { id: "peta", title: "Bà ngoại bên ngôi mộ thấp", done: (m) => stepOf(m, "peta") === "done" },
    { id: "earth", title: "Địa thần ở cổng làng", done: (m) => stepOf(m, "earth") === "done" },
    { id: "cave", title: "Hang đá bí mật", done: (m) => stepOf(m, "cave") === "done" },
    { id: "palace", title: "Thiên cung trên tháp cổ", done: (m) => stepOf(m, "palace") === "done" },
  ];
  function closedThreads(mind) {
    return CLOSED.filter((c) => c.done(mind || {})).map(({ id, title }) => ({ id, title }));
  }
  // open: the errands that are open right now (Mind.questList() in live mode).
  function openThreads(list) {
    return (list || []).map((q) => ({ title: q.title || "", body: q.body || "", x: q.x, y: q.y }));
  }

  // Diary lines (history, oldest first in storage) and milestones, one list newest first.
  // Milestones keep their own style (pinned); hidden is true while some hidden milestone is still unseen.
  function timelineView(mind, history, defs) {
    const got = (mind && mind.milestones) || {};
    const ds = defs || (window.Milestones && Milestones.defs) || [];
    const items = [];
    for (const d of ds) {
      const rec = got[d.id];
      if (!rec) continue;
      const name = (rec.ctx && rec.ctx.name) || "";
      items.push({ kind: "milestone", id: d.id, at: time(rec.at), title: fill(d.title, name), text: fill(d.text, name), being: d.being || "" });
    }
    for (const h of (history || []).slice(-DIARY_MAX)) items.push({ kind: "diary", at: time(h.at), text: String(h.text || "") });
    items.sort((a, b) => b.at - a.at);
    return { items, hidden: ds.some((d) => d.hidden && !got[d.id]) };
  }

  // ---------- rendering ----------
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const when = (at) => { try { return new Date(at).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }); } catch { return ""; } };

  // The live data: Discover first (it marks what is seen now), then the character's state and history.
  function liveSource() {
    try { if (window.Discover) Discover.entries(); } catch (e) { console.error(e); }
    const mind = window.Mind && Mind.parts ? Mind.parts.current() : {};
    const history = window.Save && Save.history ? Save.history() : [];
    const open = (window.Mind && Mind.questList ? Mind.questList() : []).filter((q) => !q.survey); // the optional survey is not part of the story
    return { mind, history, open };
  }

  function placesSection(d) {
    const v = placesView((d.mind || {}).disc, null);
    const box = el("div", "jb-places");
    box.appendChild(el("p", "book-progress", `Đã khám phá ${v.seen}/${v.total}`));
    const bar = el("div", "book-bar"); const fillEl = el("span"); fillEl.style.width = (v.total ? (v.seen / v.total) * 100 : 0) + "%"; bar.appendChild(fillEl); box.appendChild(bar);
    box.appendChild(el("p", "hint", d.live ? "Ô có dấu ? là điều còn chưa biết. Bắt chuyện với người qua đường để nghe thêm tin đồn." : "Ô có dấu ? là điều chưa biết."));
    const grid = el("div", "book-grid");
    for (const r of v.rows) {
      const being = r.state === "seen" && window.Beings && Beings.of(r.id);
      const item = being ? el("button", "book-item seen book-being") : el("div", "book-item " + r.state);
      if (being) {
        item.type = "button";
        item.setAttribute("aria-label", `Xem lại ${r.title}`);
        item.appendChild(Beings.thumb(r.id, 72));
        item.addEventListener("click", () => Beings.open(r.id));
      }
      if (r.state === "unknown") {
        item.appendChild(el("b", null, "?"));
        item.appendChild(el("p", null, r.hint));
      } else {
        item.appendChild(el("b", null, r.title));
        item.appendChild(el("p", null, r.state === "seen" ? `Đã gặp · ${r.placeName}` : r.hint));
        if (being) item.appendChild(el("small", "book-tag", "Xem lại"));
        if (r.state === "heard") {
          item.appendChild(el("small", "book-tag", "Nghe đồn"));
          if (r.condText.length) item.appendChild(el("small", "book-conds", r.condText.join(" · ")));
          const p = d.live && d.onGo && window.World && World.PLACES[r.place];
          if (p) {
            const go = el("button", "text-btn", `Tới ${p.name}`); go.type = "button";
            go.addEventListener("click", () => d.onGo(p.x, p.y + 34));
            item.appendChild(go);
          }
        }
      }
      grid.appendChild(item);
    }
    box.appendChild(grid);
    return box;
  }

  function threadsSection(d) {
    const wrap = el("div", "jb-threads");
    const closed = closedThreads(d.mind);
    const closedList = () => {
      const ul = el("div", "jb-closed-list");
      for (const c of closed) {
        const row = el("div", "jb-closed");
        row.append(el("span", null, c.title), el("small", "jb-closed-tag", "đã khép"));
        ul.appendChild(row);
      }
      return ul;
    };
    if (d.live) {
      if (!d.open.length) wrap.appendChild(el("p", "hint jb-empty", EMPTY.threads));
      for (const q of d.open) {
        const item = el("div", "jb-thread");
        item.appendChild(el("b", null, q.title));
        item.appendChild(el("p", "hint", q.body));
        if (q.x != null && d.onGo) {
          const go = el("button", "pill", "Đưa tôi tới đó"); go.type = "button";
          go.addEventListener("click", () => d.onGo(q.x, q.y));
          item.appendChild(go);
        }
        wrap.appendChild(item);
      }
      const label = el("label", "jb-toggle");
      const box = el("input"); box.type = "checkbox"; box.checked = showClosed;
      box.addEventListener("change", () => { showClosed = box.checked; d.redraw(); });
      label.append(box, el("span", null, "Hiện cả chuyện đã khép"));
      wrap.appendChild(label);
      if (showClosed) wrap.appendChild(closed.length ? closedList() : el("p", "hint jb-empty", "Chưa có chuyện nào đã khép."));
    } else {
      // saved characters: only the closed threads can be read from the saved state
      wrap.appendChild(closed.length ? closedList() : el("p", "hint jb-empty", EMPTY.threads));
    }
    return wrap;
  }

  // Knowledge entries come later; for now only the empty state.
  function learnedSection() {
    const box = el("div", "jb-learned");
    box.appendChild(el("p", "hint jb-empty", EMPTY.learned));
    return box;
  }

  function timelineSection(d) {
    const box = el("div", "jb-timeline-box");
    const tv = timelineView(d.mind, d.history, null);
    if (!tv.items.length) box.appendChild(el("p", "hint jb-empty", EMPTY.timeline));
    else {
      const ol = el("ol", "jb-timeline");
      for (const it of tv.items) {
        if (it.kind === "milestone") {
          const li = el("li", "ms-item jb-pinned" + (it.being ? " jb-being" : ""));
          if (it.being && window.Beings && Beings.of(it.being)) li.appendChild(Beings.thumb(it.being, 30));
          else if (window.Milestones && Milestones.emblem) li.appendChild(Milestones.emblem(30));
          const body = el("div", "ms-body");
          body.append(el("b", null, it.title), el("p", null, it.text), el("span", "when", when(it.at)));
          if (it.being && window.Beings && Beings.of(it.being)) {
            li.tabIndex = 0;
            li.setAttribute("role", "button");
            li.setAttribute("aria-label", `Xem lại ${it.title}`);
            const open = () => Beings.open(it.being);
            li.addEventListener("click", open);
            li.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
            body.appendChild(el("span", "book-tag", "Xem lại"));
          }
          li.appendChild(body);
          ol.appendChild(li);
        } else {
          const li = el("li", "jb-line");
          li.appendChild(el("span", "dot"));
          const body = el("div", null, it.text);
          body.appendChild(el("span", "when", when(it.at)));
          li.appendChild(body);
          ol.appendChild(li);
        }
      }
      box.appendChild(ol);
    }
    if (tv.hidden) box.appendChild(el("p", "hint ms-more", EMPTY.hidden));
    return box;
  }

  // opts: { mode: "live" | "saved", mind, history, onGo(x, y), section }. Saved mode ignores onGo.
  function render(container, opts) {
    const o = opts || {};
    const live = o.mode === "live";
    if (o.section && SECTIONS.some(([k]) => k === o.section)) section = o.section;
    const src = live ? liveSource() : { mind: o.mind || {}, history: o.history || [], open: [] };
    const d = { live, mind: src.mind, history: src.history, open: openThreads(src.open), onGo: live ? o.onGo : null, redraw: null };
    const tabs = el("div", "jb-tabs"); tabs.setAttribute("role", "tablist");
    const body = el("div", "jb-body"); body.setAttribute("role", "tabpanel");
    const builders = { places: placesSection, threads: threadsSection, learned: learnedSection, timeline: timelineSection };
    const btns = SECTIONS.map(([k, n]) => {
      const t = el("button", "pill jb-seg", n); t.type = "button"; t.dataset.sec = k; t.setAttribute("role", "tab");
      t.addEventListener("click", () => { section = k; draw(); });
      tabs.appendChild(t); return t;
    });
    const draw = () => {
      btns.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.sec === section)));
      body.replaceChildren(builders[section](d));
    };
    d.redraw = draw;
    container.replaceChildren(tabs, body);
    draw();
  }

  return {
    render,
    SECTIONS,
    EMPTY,
    views: { stateOf, placesView, closedThreads, openThreads, timelineView },
  };
})();
