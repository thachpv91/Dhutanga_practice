// Profile screen for signed-in players: all characters, and for the chosen one its header, then three tabs:
// the overview (temperament, mind stats, cards, bag), the journey (the shared Sổ Hành Trình, book.js), and the
// people it has met. Guests have no people tab.
// Read-only; "Chơi tiếp" hands back to app.js.
// Later this is where appearance (clothes, hair…) will be shown and changed.
window.Profile = (() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  let hooks = {};
  let selected = null;
  let live = null; // the character being played right now (opened from the mind orb); null when opened from the picker
  const cache = new Map(); // id -> character (with data)
  let profileTab = "overview"; // the active tab; kept while the same character is shown, reset when another one is
  let tabOwner = null; // the character id that profileTab belongs to

  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }); } catch { return ""; } };
  const ago = (iso) => Social.ago(iso);

  async function fetchCharacter(id) {
    if (cache.has(id)) return cache.get(id);
    const r = await fetch("/api/characters/" + id, { credentials: "same-origin" });
    if (!r.ok) throw new Error("load failed");
    const { character } = await r.json();
    cache.set(id, character);
    return character;
  }

  function renderList() {
    const list = $("profile-list"); list.replaceChildren();
    list.hidden = !!live && live.id === "guest";
    const chars = (Save.me().characters || []);
    if (!chars.length) {
      list.appendChild(el("p", "hint", "Chưa có nhân vật nào. Quay lại và chọn một vai để tạo nhân vật đầu tiên."));
      return;
    }
    for (const c of chars) {
      const b = el("button", "profile-chip");
      b.type = "button";
      b.dataset.role = c.role;
      b.setAttribute("aria-pressed", String(c.id === selected));
      const glyph = el("span", "chip-avatar"); glyph.innerHTML = Avatar.svg(c.role, c.skin, 34);
      const txt = el("span", "chip-text");
      const nameEl = el("b", null, c.name);
      if (c.newConnections > 0) nameEl.appendChild(newDot("Có người muốn kết nối với bạn"));
      txt.appendChild(nameEl);
      txt.appendChild(el("small", null,`${ROLE_INFO[c.role] ? ROLE_INFO[c.role].name : c.role} · ${live && live.id === c.id ? "đang chơi" : ago(c.updatedAt)}`));
      b.append(glyph, txt);
      b.addEventListener("click", () => select(c.id));
      list.appendChild(b);
    }
  }

  // The gold dot: someone saved this character and it has not looked yet.
  function newDot(title) { const d = el("span", "new-dot"); d.title = title; d.setAttribute("aria-label", title); return d; }

  // The tabs under the header: the guest has no "Người quen".
  function tabsFor(id) {
    const tabs = [["overview", "Tổng quan"], ["journey", "Hành trình"]];
    if (id !== "guest") tabs.push(["people", "Người quen"]);
    return tabs;
  }

  function section(title, extra) {
    const s = el("section", "profile-sec");
    const h = el("h3", "profile-sec-title", title);
    if (extra) h.appendChild(el("span", "count", extra));
    s.appendChild(h);
    return s;
  }

  async function select(id) {
    selected = id;
    if (tabOwner !== id) { profileTab = "overview"; tabOwner = id; }
    renderList();
    const box = $("profile-detail");
    box.replaceChildren(el("p", "hint", "Đang mở…"));
    const isLive = !!live && live.id === id;
    let c;
    if (isLive) c = { id, name: live.name, role: live.role, data: { mind: live.mind, history: live.history, skin: live.skin } };
    else {
      try { c = await fetchCharacter(id); } catch { box.replaceChildren(el("p", "hint", "Chưa mở được nhân vật này, thử lại nhé.")); return; }
    }
    if (selected !== id) return;
    const summary = (Save.me().characters || []).find((x) => x.id === id) || {};
    const mind = (c.data && c.data.mind) || {};
    const history = (c.data && c.data.history) || [];
    const P = Mind.parts;
    box.replaceChildren();

    // header
    const head = el("div", "profile-head");
    head.dataset.role = c.role;
    // portrait: drawn in layers so clothes, hair and items can be changed later (skin kept in character data)
    const glyph = Avatar.node(c.role, c.data && c.data.skin, 132);
    glyph.classList.add("profile-portrait");
    const who = el("div", "profile-who");
    const nameRow = el("div", "profile-name-row");
    const nameEl = el("h2", "profile-name", c.name);
    const rename = el("button", "text-btn", "Đổi tên"); rename.type = "button";
    rename.addEventListener("click", () => {
      const input = el("input", "profile-rename"); input.maxLength = 24; input.value = c.name;
      const ok = el("button", "pill", "Lưu"); ok.type = "button";
      const cancel = el("button", "text-btn", "Hủy"); cancel.type = "button";
      const form = el("div", "profile-name-row"); form.append(input, ok, cancel);
      nameRow.replaceWith(form); input.focus(); input.select();
      const done = async () => {
        const v = input.value.replace(/\s+/g, " ").trim();
        if (!v || v === c.name) { form.replaceWith(nameRow); return; }
        try { c.name = await Save.renameCharacter(id, v); cache.set(id, c); if (live && live.id === id) live.name = c.name; } catch { alert("Chưa đổi được tên."); }
        hooks.changed && hooks.changed();
        select(id);
      };
      ok.addEventListener("click", done);
      cancel.addEventListener("click", () => form.replaceWith(nameRow));
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") done(); if (e.key === "Escape") form.replaceWith(nameRow); e.stopPropagation(); });
    });
    nameRow.append(nameEl);
    if (id !== "guest") nameRow.append(rename);
    who.appendChild(nameRow);
    who.appendChild(el("p", "rc-who", `${ROLE_INFO[c.role] ? ROLE_INFO[c.role].name : c.role}${isLive ? " · đang chơi" : ""}${id === "guest" ? " · chơi thử, chưa lưu" : ""}${summary.createdAt ? " · tạo ngày " + fmtDate(summary.createdAt) : ""}${summary.updatedAt ? " · chơi " + ago(summary.updatedAt) : ""}`));
    if (mind.carita) who.appendChild(el("p", "mind-carita", `Người này thiên về tính ${P.caritaName(mind.carita)}.`));
    head.append(glyph, who);
    box.appendChild(head);
    const actions = el("div", "profile-actions");
    const play = el("button", "primary", "Chơi tiếp"); play.type = "button";
    play.addEventListener("click", () => { close(); hooks.play && hooks.play(id); });
    const del = el("button", "text-btn", "Xóa nhân vật"); del.type = "button";
    del.addEventListener("click", async () => {
      if (!confirm(`Xóa nhân vật “${c.name}”? Thẻ, vật phẩm và nhật ký của nhân vật này sẽ mất.`)) return;
      try { await Save.deleteCharacter(id); } catch { alert("Chưa xóa được."); return; }
      cache.delete(id);
      selected = (Save.me().characters || [])[0]?.id || null;
      hooks.changed && hooks.changed();
      if (selected) select(selected); else { renderList(); $("profile-detail").replaceChildren(); }
    });
    if (isLive) {
      const back = el("button", "primary", "Quay lại chơi"); back.type = "button";
      back.addEventListener("click", close);
      actions.appendChild(back);
      if (id === "guest" && hooks.login) {
        const login = el("button", "pill", "Đăng nhập để lưu nhân vật"); login.type = "button";
        login.addEventListener("click", () => { close(); hooks.login(); });
        actions.appendChild(login);
      }
    } else if (live) {
      // looking at another character while playing: switch to it
      play.textContent = "Chơi nhân vật này";
      actions.append(play);
    } else actions.append(play, del);
    box.appendChild(actions);

    // tabs under the header; only the active tab's body is built
    const tabList = tabsFor(id);
    const tabBar = el("div", "profile-tabs"); tabBar.setAttribute("role", "tablist");
    const tabBody = el("div", "profile-tab-body"); tabBody.id = "profile-tabpanel"; tabBody.setAttribute("role", "tabpanel");
    const tabBtns = tabList.map(([k, n]) => {
      const t = el("button", "pill", n); t.type = "button"; t.dataset.tab = k;
      if (k === "people" && summary.newConnections > 0) t.appendChild(newDot("Có tin mới"));
      t.setAttribute("role", "tab"); t.setAttribute("aria-controls", "profile-tabpanel");
      t.addEventListener("click", () => { profileTab = k; drawTab(); });
      tabBar.appendChild(t); return t;
    });
    const drawTab = () => {
      tabBtns.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === profileTab)));
      tabBody.replaceChildren();
      if (profileTab === "people") { tabBody.appendChild(peopleSection(id, summary, drawTab)); markPeopleSeen(id); }
      else if (profileTab === "journey") {
        // the playing character reads the live book; any other character reads its saved mind and history
        JourneyBook.render(tabBody, { mode: isLive ? "live" : "saved", mind, history });
      }
      else overviewSections(tabBody);
    };

    // overview: the mind right now, stats, cards and the bag (the journey has its own tab)
    const overviewSections = (into) => {
      // the mind right now (only for the character in play)
      if (isLive && live.mood) {
        const now = section("Tâm lúc này");
        const row = el("div", "mood-now");
        const dot = el("span", "mood-dot"); dot.style.background = live.mood.color; dot.style.boxShadow = `0 0 16px ${live.mood.color}`;
        row.append(dot, el("b", null, live.mood.label));
        now.appendChild(row);
        if (live.suggestion) now.appendChild(el("p", "quest-tip", live.suggestion));
        const legend = document.querySelector("#mind-info .mind-legend");
        if (legend) {
          const det = el("details", "mood-legend");
          det.appendChild(el("summary", null, "Ý nghĩa các màu"));
          det.appendChild(legend.cloneNode(true));
          document.querySelectorAll("#mind-info > p.hint").forEach((p) => det.appendChild(p.cloneNode(true)));
          now.appendChild(det);
        }
        into.appendChild(now);
      }

      // stats
      const st = section("Chỉ số tâm");
      if (mind.stats) {
        const g = el("div", "stat-bars"); P.GOOD.forEach(([k, n]) => g.appendChild(P.bar(n, mind.stats[k], true)));
        const b = el("div", "stat-bars"); P.BAD.forEach(([k, n]) => b.appendChild(P.bar(n, mind.stats[k], false)));
        st.append(g, b);
        st.appendChild(el("p", "hint", "Mô phỏng để chơi, có lên có xuống, xoay quanh một mốc. Không phải thước đo tâm thật."));
      } else st.appendChild(el("p", "hint", "Chưa có chỉ số. Vào chơi một lần để biết tính cách của nhân vật này."));
      into.appendChild(st);

      // cards
      const owned = mind.cards || {};
      for (const sec of P.cardSections(owned)) {
        const cs = section(sec.title, sec.extra);
        if (sec.key === "good") {
          cs.appendChild(P.catalogButton(owned, c.role));
        }
        cs.appendChild(P.cardGrid(sec, (cid) => P.viewCard(cid, owned[cid], owned)));
        into.appendChild(cs);
      }

      // bag
      const items = (mind.items || []).filter((i) => window.Items && Items.def(i));
      const bs = section("Túi đồ", String(items.length));
      if (items.length && window.Items) { const bag = el("div", "bag"); Items.renderBag(bag, items, (iid) => Items.showDetail(iid)); bs.appendChild(bag); }
      else bs.appendChild(el("p", "hint", "Túi còn trống."));
      into.appendChild(bs);
    };

    box.append(tabBar, tabBody);
    drawTab();
  }

  // Opening the tab clears the dot: the server marks the incoming connections as seen, then the list is read again.
  function markPeopleSeen(id) {
    const c = (Save.me().characters || []).find((x) => x.id === id);
    if (!c || !(c.newConnections > 0)) return;
    Social.markSeen(id).then(() => Save.refresh()).then(() => {
      $("profile-detail").querySelectorAll('[data-tab="people"] .new-dot').forEach((d) => d.remove());
      renderList();
    }).catch(() => {});
  }

  // "Người quen": one list (quen, moi, luu, only met) with a level tag per row, then the two privacy switches.
  function peopleSection(id, summary, redraw) {
    const sec = el("section", "profile-sec people-sec");
    sec.appendChild(el("p", "hint", "Gặp ai ngoài làng thì có thể giữ kết nối. Khi cả hai cùng giữ nhau, hai bên thành Quen."));
    const list = el("div", "enc-list");
    list.appendChild(el("p", "hint", "Đang tải…"));
    sec.appendChild(list);
    Promise.all([Social.connections(id), Social.encounters(id)]).then(([conn, encs]) => {
      if (!sec.isConnected) return;
      const rows = Social.mergePeople(conn.connections, encs);
      if (!rows.length) { list.replaceChildren(el("p", "hint enc-empty", "Chưa gặp ai. Ra làng đi dạo, sẽ có người.")); return; }
      list.replaceChildren();
      let group = null, box = null;
      for (const row of rows) {
        if (row.group !== group) {
          group = row.group;
          const head = el("div", "enc-group");
          head.appendChild(el("span", null, Social.groupTitle(group)));
          list.appendChild(head);
          box = el("div", "enc-cards"); list.appendChild(box);
        }
        box.appendChild(personRow(row, id, redraw));
      }
    }).catch(() => { if (sec.isConnected) list.replaceChildren(el("p", "hint", "Chưa tải được danh sách này.")); });

    const priv = el("div", "privacy-card");
    priv.appendChild(el("h4", "privacy-title", "Quyền riêng tư"));
    priv.append(
      switchRow(id, "hideProfile", "Ẩn hồ sơ của người này với người khác", summary.hideProfile),
      switchRow(id, "hideStatus", "Ẩn trạng thái đang chơi", summary.hideStatus, "Người quen sẽ không thấy bạn đang chơi hay lần chơi cuối."),
    );
    sec.appendChild(priv);
    return sec;
  }

  // One row: name, a level tag, and a short line (status for quen; last meeting and count for only-met).
  function personRow(row, cid, redraw) {
    const b = el("button", "enc-row"); b.type = "button";
    const pic = el("span", "enc-pic");
    try { pic.appendChild(Avatar.node(row.role, null, 44)); } catch { /* portrait is optional */ }
    const body = el("span", "enc-body");
    const head = el("span", "enc-head");
    head.appendChild(el("b", null, row.name || "Người này"));
    if (row.group !== "met") {
      const tag = el("span", "lvl-tag", Social.levelLabel(row.level));
      tag.dataset.level = row.level;
      head.appendChild(tag);
    }
    const bits = [ROLE_INFO[row.role] ? ROLE_INFO[row.role].name : ""];
    if (row.group === "met") {
      const a = Social.ago(row.lastAt);
      bits.push(a === "vừa xong" ? "vừa gặp" : a ? `gặp ${a}` : "");
      if (row.count > 1) bits.push(`${row.count} lần`);
    } else if (row.archived) {
      bits.push("chuyện đã khép");
    } else if (row.group === "quen") {
      const t = Social.statusText(row.status);
      if (t) bits.push(t);
    }
    if (row.hidden) bits.push("giữ kín hồ sơ");
    const meta = el("small", "enc-meta", bits.filter(Boolean).join(" · "));
    if (row.group === "quen" && row.status && row.status.online) b.classList.add("online");
    body.append(head, meta);
    b.append(pic, body);
    b.addEventListener("click", () => showPerson(row, cid, redraw));
    return b;
  }

  // One privacy switch: optimistic; on failure it goes back and says so.
  function switchRow(id, key, text, checked, sub) {
    const label = el("label", "switch-row");
    const box = el("input"); box.type = "checkbox"; box.checked = !!checked;
    const txt = el("span", "switch-text", text);
    if (sub) txt.appendChild(el("small", null, sub));
    box.addEventListener("change", async () => {
      const want = box.checked;
      try { await Save.setFlags(id, { [key]: want }); }
      catch { box.checked = !want; alert("Chưa đổi được. Thử lại nhé."); }
    });
    label.append(box, txt);
    return label;
  }

  // A row of the people list: the other person's public profile, then the actions, shown under the list.
  // The person's public profile opens as a small sheet over the profile screen, with its own close button.
  let personSheet = null;
  function closePerson() { if (personSheet) { personSheet.remove(); personSheet = null; } document.removeEventListener("keydown", personEsc); }
  function personEsc(e) { if (e.key === "Escape") { e.stopPropagation(); closePerson(); } }
  async function showPerson(row, cid, redraw) {
    closePerson();
    const scrim = el("div", "person-scrim");
    const card = el("div", "person-card"); card.setAttribute("role", "dialog"); card.setAttribute("aria-label", row.name || "Người này");
    const x = el("button", "person-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Đóng");
    x.addEventListener("click", closePerson);
    scrim.addEventListener("click", (e) => { if (e.target === scrim) closePerson(); });
    const head = el("div", "person-head");
    const pic = el("span", "enc-pic big");
    try { pic.appendChild(Avatar.node(row.role, null, 64)); } catch { /* optional */ }
    const who = el("div", "person-who");
    who.appendChild(el("b", "person-name", row.name || "Người này"));
    const sub = [ROLE_INFO[row.role] ? ROLE_INFO[row.role].name : "", row.level ? Social.levelLabel(row.level) : "Từng gặp"].filter(Boolean).join(" · ");
    who.appendChild(el("small", null, sub));
    head.append(pic, who);
    const body = el("div", "person-body");
    body.appendChild(el("p", "hint", "Đang mở…"));
    card.append(x, head, body);
    scrim.appendChild(card);
    document.body.appendChild(scrim);
    personSheet = scrim;
    document.addEventListener("keydown", personEsc);
    const open = () => personSheet === scrim;
    const nodes = [];
    try {
      const data = await Social.fetchPublic(row.handle);
      if (!open()) return;
      if (!data) nodes.push(el("p", "hint", "Người này không còn hiện trong danh sách."));
      else nodes.push(...Social.publicNodes(Social.profileView(data)));
    } catch { nodes.push(el("p", "hint", "Chưa mở được hồ sơ này, thử lại nhé.")); }
    if (!open()) return;
    body.replaceChildren(...nodes, personActions(row, cid, () => { closePerson(); redraw(); }));
  }

  // "Giữ kết nối" / "Bỏ kết nối" for this character, plus "Chặn" and "Báo cáo" (both act on the other account).
  function personActions(row, cid, redraw) {
    const box = el("div", "enc-actions");
    const saved = row.level === "luu" || row.level === "quen";
    const conn = el("button", saved ? "pill" : "primary", saved ? "Bỏ kết nối" : "Giữ kết nối"); conn.type = "button";
    conn.addEventListener("click", async () => {
      conn.disabled = true;
      try {
        if (saved) await Social.disconnect(cid, row.handle);
        else await Social.connect(cid, row.handle);
      } catch (e) { alert(Social.connectErrorText(e)); conn.disabled = false; return; }
      hooks.connChanged && hooks.connChanged();
      redraw();
    });
    const block = el("button", "text-btn", "Chặn"); block.type = "button";
    block.addEventListener("click", async () => {
      if (!confirm(`Chặn “${row.name || "người này"}”? Hai bên sẽ không thấy hồ sơ hay gặp nhau nữa.`)) return;
      try { await Social.block(row.handle); } catch { alert("Chưa chặn được, thử lại nhé."); return; }
      hooks.connChanged && hooks.connChanged();
      redraw();
    });
    const report = el("button", "text-btn", "Báo cáo"); report.type = "button";
    report.addEventListener("click", async () => {
      const raw = prompt("Điều gì khiến bạn báo cáo người này? Ghi ngắn gọn.");
      if (raw == null) return;
      const reason = [...raw.replace(/\s+/g, " ").trim()].slice(0, 200).join("");
      if (!reason) return;
      if (!confirm("Gửi báo cáo về người này?")) return;
      try { await Social.report(row.handle, reason); } catch { alert("Chưa gửi được báo cáo, thử lại nhé."); return; }
      alert("Đã gửi báo cáo. Cảm ơn bạn.");
    });
    box.append(conn, block, report);
    return box;
  }

  // Opened from the mind orb while playing: the character in play first (guests too).
  async function openCurrent(info) {
    live = info;
    $("profile-user").textContent = Save.me().user ? Save.me().user.name || "" : "";
    $("profile").hidden = false;
    selected = info.id;
    if (Save.signedIn()) { await Save.refresh().catch(() => {}); cache.clear(); }
    renderList();
    select(info.id);
  }

  async function open(id) {
    live = null;
    if (!Save.signedIn()) return;
    cache.clear();
    await Save.refresh().catch(() => {});
    $("profile-user").textContent = Save.me().user ? Save.me().user.name || "" : "";
    $("profile").hidden = false;
    const chars = Save.me().characters || [];
    selected = id || selected || (chars[0] && chars[0].id) || null;
    if (selected && !chars.some((c) => c.id === selected)) selected = chars[0] ? chars[0].id : null;
    renderList();
    if (selected) select(selected); else $("profile-detail").replaceChildren();
  }
  function close() { $("profile").hidden = true; }

  function init(h) {
    hooks = h || {};
    $("profile-close").addEventListener("click", close);
  }
  return { init, open, openCurrent, close, isOpen: () => !$("profile").hidden, tabsFor };
})();
