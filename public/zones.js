// Zones: walkable areas drawn as a graph of stops (nodes) and corridors (edges). Pure logic, no DOM.
// Only data for "Hang Vọng Tâm" lives here for now. Not loaded in the page yet.
// Walkable area = union of node circles and edge capsules (polyline through `via`, half-width w/2).
// Gates: `discovered` (reached the near end, saved forever in S.zones.seenGates) is separate from
// `passWhen` (checked against what the player holds, every time). Gates only block going a -> b;
// coming back b -> a is always open, so nobody gets stuck behind one.
window.Zones = (() => {
  const EPS = 1e-6;

  const HANG = {
    id: "hang_vong_tam",
    name: "Hang Vọng Tâm",
    realm: "nhan_gian",
    size: { w: 400, h: 1500 },
    palette: "hang",
    loreBasis: "fiction",
    hub: "sanh",
    entry: "cua",
    nodes: {
      cua: { x: 200, y: 1400, r: 70, name: "Cửa hang", kind: "entry" },
      sanh: { x: 200, y: 1170, r: 90, name: "Sảnh Gió", kind: "hub" },
      ho: { x: 110, y: 920, r: 70, name: "Hồ Tĩnh", kind: "scene" },
      hoc: { x: 290, y: 930, r: 60, name: "Hốc Trú", kind: "scene" },
      vach: { x: 300, y: 590, r: 60, name: "Vách Khắc", kind: "scene" },
      dai: { x: 100, y: 580, r: 60, name: "Đài Ngắm", kind: "scene" },
      khe_sang: { x: 45, y: 480, r: 40, name: "Khe Sáng", kind: "exit" },
      hanh_lang: { x: 150, y: 300, r: 40, name: "Hành lang Tiếng Vọng", kind: "scene" },
      nguong: { x: 150, y: 160, r: 40, name: "Ngưỡng Sâu", kind: "scene" },
    },
    edges: [
      { a: "cua", b: "sanh", w: 46, via: [[190, 1290]] },
      { a: "sanh", b: "ho", w: 40, via: [[150, 1040]] },
      { a: "sanh", b: "hoc", w: 40, via: [[250, 1050]] },
      { a: "sanh", b: "vach", w: 34, via: [[215, 1010], [235, 800]] }, // bậc đá thẳng lên
      { a: "ho", b: "hoc", w: 34, via: [[200, 960]] },                  // bậc nước
      { a: "ho", b: "dai", w: 30, via: [[90, 750]] },                   // cầu đá
      { a: "dai", b: "vach", w: 30, via: [[200, 540]] },                // Gờ Rêu
      { a: "vach", b: "hoc", w: 26, via: [[330, 760]] },                // hành lang hẹp
      { a: "dai", b: "khe_sang", w: 30 },
      { a: "dai", b: "hanh_lang", w: 28, via: [[120, 440]], gate: "hang.light" },
      { a: "hanh_lang", b: "nguong", w: 28 },
    ],
    exits: [
      { at: "cua", to: { world: "hang", dx: 0, dy: 30 } },
      { at: "khe_sang", to: { world: "hang", dx: 70, dy: -80 } },
    ],
    gates: {
      "hang.light": {
        near: "dai",
        previewOpen: true,
        passWhen: { anyOf: [["item:den_nho"], ["item:den_dau"], ["story:guide_cave"]] },
        notReady: "hang.hanh_lang.chua_den",
      },
    },
    landmarks: [
      { id: "cua_dau_chan", node: "cua", tier: "discoverable", look: "Có dấu chân người, đã cũ.\nĐi vào mà không thấy đi ra.\nHay họ ra bằng lối khác?" },
      { id: "cua_day_leo", node: "cua", tier: "ambient", look: "Dây leo đung đưa trong gió." },
      { id: "sanh_da_ngoi", node: "sanh", tier: "interactable", look: "Một hòn đá tròn, vừa đủ ngồi nghỉ." },
      { id: "sanh_xep_da", node: "sanh", tier: "interactable", look: "Một góc cát mịn, hợp để xếp một hòn đá." },
      { id: "ho_dom_sang", node: "ho", tier: "discoverable", look: "Mặt hồ lặng.\nDưới nước có vài đốm sáng nhỏ.", story: "hang.ho.dom_sang", disc: "hang_ho" },
      { id: "ho_da_ngoi", node: "ho", tier: "interactable", look: "Ngồi bên hồ, chỉ nhìn." },
      { id: "vach_khac", node: "vach", tier: "discoverable", look: "Vách đá có những vết khắc cũ.\nÁnh đèn bắt vào từng nét.", disc: "hang_vach" },
      { id: "vach_net_moi", node: "vach", tier: "interactable", look: "Một nét khắc còn mới." },
      { id: "hoc_tro_am", node: "hoc", tier: "discoverable", look: "Hốc đá còn than ấm.\nCó ai từng trú ở đây.", disc: "hang_hoc_tru" },
      { id: "hoc_cho_ngoi", node: "hoc", tier: "interactable", look: "Một chỗ ngồi lặng, tránh gió." },
      { id: "dai_vista", node: "dai", tier: "ambient", look: "Từ đây nhìn được cả lòng hang.", vista: { toY: 380, hold: 3 } },
      { id: "dai_den_nghieng", node: "dai", tier: "discoverable", look: "Xa xa cuối hành lang,\nmột ngọn đèn nghiêng trong gió." },
      { id: "hanh_lang_dau", node: "hanh_lang", tier: "threshold", look: "Phía trước tối quá.\nCó lẽ cần một chút ánh sáng.", gate: "hang.light" },
      { id: "nguong_nhin", node: "nguong", tier: "threshold", look: "Lối xuống sâu hơn.\nHôm nay chỉ đứng nhìn." },
      { id: "khe_sang_ra", node: "khe_sang", tier: "ambient", look: "Ánh sáng ngoài trời lọt qua khe đá." },
    ],
    storySlots: ["hang.nguong.first", "hang.hoc.su_gia"],
    futureSlots: ["hang.ben_xa", "hang.ghost_corner"],
  };

  // freeze data deeply so nobody edits it by accident
  function deepFreeze(o) {
    if (o && typeof o === "object" && !Object.isFrozen(o)) {
      Object.freeze(o);
      Object.values(o).forEach(deepFreeze);
    }
    return o;
  }
  const ZONES = deepFreeze({ [HANG.id]: HANG });

  const zone = (id) => ZONES[id] || null;

  // ---- geometry ----
  const pts = (z, e) => [[z.nodes[e.a].x, z.nodes[e.a].y], ...(e.via || []), [z.nodes[e.b].x, z.nodes[e.b].y]];
  function polyLength(p) {
    let L = 0;
    for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    return L;
  }
  const edgeLength = (z, e) => polyLength(pts(z, e));
  // closest point to (x,y) on a polyline
  function closestOnPoly(p, x, y) {
    let best = null;
    for (let i = 1; i < p.length; i++) {
      const [ax, ay] = p[i - 1], [bx, by] = p[i];
      const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
      const t = len2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2)) : 0;
      const qx = ax + dx * t, qy = ay + dy * t, d = Math.hypot(x - qx, y - qy);
      if (!best || d < best.d) best = { x: qx, y: qy, d };
    }
    return best;
  }
  const edgeKey = (e) => e.a + "-" + e.b;

  // nearest point inside the walkable area; points already inside are returned unchanged
  function nearestWalkable(zoneId, x, y) {
    const z = zone(zoneId);
    if (!z) return null;
    let best = null;
    const consider = (cx, cy, d, rad, tag) => {
      const inside = d <= rad;
      const dist = inside ? 0 : d - rad;
      if (best && dist >= best.dist) return;
      const px = inside ? x : cx + ((x - cx) * (rad - EPS)) / d;
      const py = inside ? y : cy + ((y - cy) * (rad - EPS)) / d;
      best = { dist, x: px, y: py, ...tag };
    };
    for (const [id, n] of Object.entries(z.nodes)) consider(n.x, n.y, Math.hypot(x - n.x, y - n.y), n.r, { node: id });
    for (const e of z.edges) {
      const q = closestOnPoly(pts(z, e), x, y);
      consider(q.x, q.y, q.d, e.w / 2, { edge: edgeKey(e) });
    }
    return { x: best.x, y: best.y, ...(best.node ? { node: best.node } : { edge: best.edge }) };
  }
  function isWalkable(zoneId, x, y) {
    const z = zone(zoneId);
    if (!z) return false;
    for (const n of Object.values(z.nodes)) if (Math.hypot(x - n.x, y - n.y) <= n.r + 1e-9) return true;
    for (const e of z.edges) if (closestOnPoly(pts(z, e), x, y).d <= e.w / 2 + 1e-9) return true;
    return false;
  }

  // ---- gates ----
  // token: "item:<id>" or "story:<id>", resolved through ctx = { hasItem(id), hasStory(id) }
  function tokenOk(tok, ctx) {
    const i = tok.indexOf(":");
    const kind = tok.slice(0, i), id = tok.slice(i + 1);
    if (kind === "item") return !!(ctx && ctx.hasItem && ctx.hasItem(id));
    if (kind === "story") return !!(ctx && ctx.hasStory && ctx.hasStory(id));
    return false;
  }
  // passWhen = { anyOf: [[tokens that must all hold], ...] }. Checked fresh each time, never saved.
  function passWhenOk(passWhen, ctx) {
    if (!passWhen || !passWhen.anyOf) return true;
    return passWhen.anyOf.some((group) => group.every((t) => tokenOk(t, ctx)));
  }
  // May the player walk this edge? `from` is the node they stand on (default: edge.a).
  // No ctx = gates are ignored. Gates only block a -> b; b -> a is always open.
  function canPass(zoneId, edge, ctx, from) {
    const z = zone(zoneId);
    if (!z || !edge || !edge.gate || !ctx) return true;
    if (from !== undefined && from === edge.b) return true;
    const g = z.gates[edge.gate];
    return !g || passWhenOk(g.passWhen, ctx);
  }

  // ---- graph ----
  // [{ node, edge, len }] reachable from nodeId in one step
  function neighbors(zoneId, nodeId, ctx) {
    const z = zone(zoneId);
    if (!z) return [];
    const out = [];
    for (const e of z.edges) {
      if (e.a !== nodeId && e.b !== nodeId) continue;
      if (!canPass(zoneId, e, ctx, nodeId)) continue;
      out.push({ node: e.a === nodeId ? e.b : e.a, edge: e, len: edgeLength(z, e) });
    }
    return out;
  }
  // shortest path (by edge length) as a node id list, or null
  function route(zoneId, from, to, ctx) {
    const z = zone(zoneId);
    if (!z || !z.nodes[from] || !z.nodes[to]) return null;
    const dist = { [from]: 0 }, prev = {}, done = new Set();
    for (;;) {
      let cur = null;
      for (const k of Object.keys(dist)) if (!done.has(k) && (cur === null || dist[k] < dist[cur])) cur = k;
      if (cur === null) return null;
      if (cur === to) break;
      done.add(cur);
      for (const nb of neighbors(zoneId, cur, ctx)) {
        const d = dist[cur] + nb.len;
        if (!(nb.node in dist) || d < dist[nb.node]) { dist[nb.node] = d; prev[nb.node] = cur; }
      }
    }
    const path = [to];
    while (path[0] !== from) path.unshift(prev[path[0]]);
    return path;
  }
  // number of independent loops among the edges that have no gate
  function cycles(zoneId) {
    const z = zone(zoneId);
    const parent = {};
    const find = (n) => (parent[n] === undefined || parent[n] === n ? n : (parent[n] = find(parent[n])));
    let loops = 0;
    for (const e of z.edges) {
      if (e.gate) continue;
      const ra = find(e.a), rb = find(e.b);
      if (ra === rb) loops++; else parent[ra] = rb;
    }
    return loops;
  }

  // ---- save: all helpers work on the mind state object S passed in, never on globals ----
  const BUCKETS = ["nodes", "marks", "seenGates", "visits", "stones"];
  // current view of S.zones; a fresh empty one (not written to S) when there is none
  function state(S) {
    if (S && S.zones && typeof S.zones === "object") return S.zones;
    return { v: 1, nodes: {}, marks: {}, seenGates: {}, visits: {}, stones: {} };
  }
  // create S.zones on first write only
  function ensure(S) {
    if (!S.zones || typeof S.zones !== "object") S.zones = { v: 1 };
    for (const k of BUCKETS) if (!S.zones[k] || typeof S.zones[k] !== "object") S.zones[k] = {};
    return S.zones;
  }
  // first time only: a stored timestamp is never overwritten. true when something changed.
  function markOnce(S, bucket, key, now) {
    const cur = S && S.zones && S.zones[bucket];
    if (cur && cur[key]) return false;
    ensure(S)[bucket][key] = now;
    return true;
  }
  const markNode = (S, zoneId, nodeId, now) => markOnce(S, "nodes", zoneId + ":" + nodeId, now);
  const markLandmark = (S, zoneId, id, now) => markOnce(S, "marks", zoneId + ":" + id, now);
  const markGate = (S, gateId, now) => markOnce(S, "seenGates", gateId, now);
  function addVisit(S, zoneId) {
    const z = ensure(S);
    z.visits[zoneId] = (z.visits[zoneId] || 0) + 1;
    return true;
  }

  return {
    zone, edgeLength, edgeKey, nearestWalkable, isWalkable,
    canPass, passWhenOk, neighbors, route, cycles,
    state, markNode, markLandmark, markGate, addVisit,
  };
})();
