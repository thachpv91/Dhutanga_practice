// Social helpers shared by the info card and chat panel (app.js) and the profile (profile.js): public profiles, the
// "Từng gặp" list, block and report, and the connections ("Giữ kết nối", Quen). The pure functions take their inputs
// as arguments, so tests can load this file alone.
window.Social = (() => {
  const CACHE_MS = 60000;
  const ITEM_CHIPS = 6;
  const cache = new Map(); // handle -> { at, p }

  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  // dd/mm/yyyy in the player's local time; "" for a bad date.
  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  // "vừa xong", "N phút trước", "N giờ trước", "N ngày trước"; "" for a bad date.
  function ago(iso, now = Date.now()) {
    const t = new Date(iso).getTime();
    if (!iso || isNaN(t)) return "";
    const mins = Math.round((now - t) / 60000);
    if (mins < 1) return "vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const h = Math.round(mins / 60);
    if (h < 24) return `${h} giờ trước`;
    return `${Math.round(h / 24)} ngày trước`;
  }

  const defaults = () => ({
    defOf: (id) => (window.Items && Items.def(id)) || null,
    caritaName: (k) => (window.Mind && Mind.parts ? Mind.parts.caritaName(k) : ""),
  });

  // What the card (and the profile's view of someone) shows of a public profile: the lines and up to 6 item names.
  // A hidden profile gives only a gentle line. Unknown item ids are skipped. Null in, null out.
  function profileView(p, opts = defaults()) {
    if (!p || typeof p !== "object") return null;
    if (p.hidden) return { hidden: true, lines: ["Người này giữ kín hồ sơ."], items: [] };
    const lines = [];
    if (p.createdAt && fmtDate(p.createdAt)) lines.push(`Chơi từ ngày ${fmtDate(p.createdAt)}.`);
    const carita = p.carita ? opts.caritaName(p.carita) : "";
    if (carita) lines.push(`Người này thiên về tính ${carita}.`);
    if (p.archived) lines.push("Chuyện của nhân vật này đã khép.");
    const items = [];
    for (const id of Array.isArray(p.items) ? p.items : []) {
      if (items.length >= ITEM_CHIPS) break;
      const d = opts.defOf(id);
      if (d && d.name) items.push(d.name);
    }
    return { hidden: false, lines, items };
  }

  // DOM nodes for a profileView result (empty array for null).
  function publicNodes(view) {
    const nodes = [];
    if (!view) return nodes;
    for (const t of view.lines) nodes.push(el("p", "info-line", t));
    if (view.items.length) {
      const row = el("div", "item-chips");
      for (const n of view.items) row.appendChild(el("span", "item-chip", n));
      nodes.push(row);
    }
    return nodes;
  }

  // View rows for the "Từng gặp" list. Rows without a handle are dropped.
  function encounterRows(list, { now = Date.now(), roleName = (r) => r } = {}) {
    return (Array.isArray(list) ? list : []).filter((e) => e && e.handle).map((e) => {
      const a = ago(e.lastAt, now);
      return {
        handle: e.handle,
        name: e.name || "",
        role: e.role,
        roleName: roleName(e.role),
        hidden: !!e.hidden,
        lastText: a === "vừa xong" ? "vừa gặp" : a ? `gặp lần cuối ${a}` : "",
        countText: `${e.count || 1} lần`,
      };
    });
  }

  async function api(method, url, body) {
    const r = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin" });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(data.error || "request failed"), { status: r.status });
    return data;
  }

  // One public profile per handle, kept about a minute. 404 (unknown or blocked) resolves to null; other
  // failures reject and are not cached.
  function fetchPublic(handle) {
    const hit = cache.get(handle);
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.p;
    const p = api("GET", "/api/public/" + encodeURIComponent(handle)).catch((e) => {
      if (e.status === 404) return null;
      cache.delete(handle);
      throw e;
    });
    cache.set(handle, { at: Date.now(), p });
    return p;
  }

  const encounters = (characterId) => api("GET", "/api/encounters/" + encodeURIComponent(characterId)).then((d) => d.encounters || []);
  const block = (handle) => api("POST", "/api/block", { handle });
  const report = (handle, reason) => api("POST", "/api/report", { handle, reason });

  // ---------- connections: "Giữ kết nối", "Quen" ----------
  // Levels from the server: "quen" (both saved), "luu" (only I saved), "moi" (only they saved me); none is not listed.
  const CONN_CACHE_MS = 5000;
  const connCache = new Map(); // charId -> { at, p }
  const LEVEL_LABEL = { quen: "Quen", luu: "Đã lưu", moi: "Muốn kết nối với bạn" };
  const GROUP_TITLE = { quen: "Quen", moi: "Muốn kết nối với bạn", luu: "Đã lưu", met: "Từng gặp" };
  const GROUP_ORDER = ["quen", "moi", "luu", "met"];

  // "Quen", "Đã lưu", "Muốn kết nối với bạn"; "" for no level.
  function levelLabel(level) { return LEVEL_LABEL[level] || ""; }

  // Heading of one group in the merged list.
  function groupTitle(group) { return GROUP_TITLE[group] || ""; }

  // "đang chơi", "chơi lần cuối 5 phút trước"; "" for a null status (hidden, or not quen).
  function statusText(status, now = Date.now()) {
    if (!status) return "";
    if (status.online) return "đang chơi";
    const a = ago(status.lastSeenAt, now);
    return a ? `chơi lần cuối ${a}` : "";
  }

  // One list from connections and encounters: quen (online first), then moi, luu, and only-met ("met").
  // Each handle appears once; a connection row wins over an encounter row. Rows without a handle are dropped.
  function mergePeople(connections, encounters) {
    const rows = [];
    const seen = new Set();
    for (const c of Array.isArray(connections) ? connections : []) {
      if (!c || !c.handle || seen.has(c.handle) || !["quen", "moi", "luu"].includes(c.level)) continue;
      seen.add(c.handle);
      rows.push({ handle: c.handle, name: c.name || "", role: c.role, hidden: !!c.hidden, group: c.level, level: c.level, status: c.status || null, archived: !!c.archived, lastAt: null, count: 0 });
    }
    for (const e of Array.isArray(encounters) ? encounters : []) {
      if (!e || !e.handle || seen.has(e.handle)) continue;
      seen.add(e.handle);
      rows.push({ handle: e.handle, name: e.name || "", role: e.role, hidden: !!e.hidden, group: "met", level: null, status: null, lastAt: e.lastAt || null, count: e.count || 1 });
    }
    const rank = (r) => GROUP_ORDER.indexOf(r.group);
    const online = (r) => (r.status && r.status.online ? 0 : 1);
    return rows.sort((a, b) => rank(a) - rank(b) || (a.group === "quen" ? online(a) - online(b) : 0));
  }

  // The line shown when a connect or disconnect call fails.
  function connectErrorText(err) {
    const m = err && err.message;
    if (m === "not met yet") return "Cần gặp nhau ngoài làng một lúc đã.";
    if (m === "too many connections") return "Danh sách đã đầy.";
    return "Chưa làm được, thử lại nhé.";
  }

  // Signed-in only. Connect / disconnect answer { ok, level }; they drop the cached list.
  const mutate = (method, url, body, charId) => api(method, url, body).finally(() => connCache.delete(charId));
  const connect = (charId, handle) => mutate("POST", "/api/connect", { characterId: charId, handle }, charId);
  const disconnect = (charId, handle) => mutate("POST", "/api/disconnect", { characterId: charId, handle }, charId);

  // { connections, newCount } for one of my characters. Kept 5 seconds so a quick reopen does not refetch.
  function connections(charId) {
    const hit = connCache.get(charId);
    if (hit && Date.now() - hit.at < CONN_CACHE_MS) return hit.p;
    const p = api("GET", "/api/connections/" + encodeURIComponent(charId)).then((d) => ({ connections: d.connections || [], newCount: d.newCount || 0 }));
    connCache.set(charId, { at: Date.now(), p });
    p.catch(() => { if (connCache.get(charId) && connCache.get(charId).p === p) connCache.delete(charId); });
    return p;
  }

  // Marks the incoming connections of this character as looked at.
  const markSeen = (charId) => mutate("POST", "/api/connections/" + encodeURIComponent(charId) + "/seen", {}, charId);

  return {
    fmtDate, ago, profileView, publicNodes, encounterRows, fetchPublic, encounters, block, report, api,
    levelLabel, groupTitle, statusText, mergePeople, connectErrorText,
    connect, disconnect, connections, markSeen,
  };
})();
