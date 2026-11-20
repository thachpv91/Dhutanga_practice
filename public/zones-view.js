// Hang Vọng Tâm — walkable overlay on the zone graph in zones.js.
// Art brief: beautiful and slightly uneasy. Base hue is cold slate blue-green.
// One warm accent: the lamp. Light falls from the mouth (upper area of the tall map)
// and from the lamp in the player's hand. Focal point is that warm lamp on dark stone.
// Motifs: stone floor, pebble trail, still pool, stone bridge, shelter niche with old ash,
// carved wall, light shaft, deep threshold. No grass, trees, flowers, or horror faces.
//
// Flag is off unless the page is opened with ?zones or localStorage dhutanga.zones = "1".
// ?zones-preview opens the map on its own, for looking, and does not require the flag.
window.ZonesView = (() => {
  const ID = "hang_vong_tam";
  // Sheet copied from the Hang Vọng Tâm realm (prototype). Drawing functions read only this.
  const R = {
    ambient: { mode: "dark", color: "#04090d", strength: 0.62, holes: 1, bloom: 0.18, lift: ["#a9c8a0", 0.05] },
    key: { dir: [1, 1], color: "#a9c8a0", strength: 0.16 },
    ground: { base: "#172d36", path: "#344348", pathTop: "#59605a" },
    stone: { base: "#293b43", dark: "#1a2830", light: "#3f5660", line: "#101a20" },
    wood: { base: "#3a3a33", dark: "#1a1a17", light: "#55554b" },
    leaf: { base: "#2a3d33", dark: "#1c2a24", light: "#3f5a48" },
    water: { bank: "#101a20", edge: "#14262c", shallow: "#19424a", deep: "#0a1c22", sheen: "#9fd0c824", ripple: "#62a2a366" },
    moss: "#2f4a3e",
    void: "#04080b",
    shadow: { contact: "#00000066", cast: "#00000026" },
    accent: { lamp: "#f7d285", glow: "#e4b659", ember: "#e4874a", mote: "#9fd2c1" },
  };

  let root = null, canvas, ctx, shade, frame = 0, previous = 0, time = 0;
  let pos = [200, 1400], dest = [], at = "cua", goal = "cua", heading = 1, moving = false, after = null;
  let note = null, focusBefore = null, oldOverflow = "", opts = {}, rocks = [], ripples = [];
  let openZone = null, preview = false, fps = 0, fpsN = 0, fpsT = 0;
  // Extra depth below the mouth (the map itself ends near y 1500) so the follow-cam
  // can keep the player around 58% of the screen. Without it the camera clamps, and
  // the "Xem" button sits on top of the character and the place name.
  const WORLD = { x: -20, y: 20, w: 440, h: 1840 };

  function rgba(hex, a) {
    const n = parseInt(hex.slice(1, 7), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const zone = () => (window.Zones ? Zones.zone(ID) : null);
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  function enabled() {
    try {
      const search = (typeof location !== "undefined" && location.search) || "";
      const q = new URLSearchParams(search);
      if (q.has("zones")) return q.get("zones") !== "0";
      return typeof localStorage !== "undefined" && localStorage.getItem("dhutanga.zones") === "1";
    } catch (e) { return false; }
  }
  const isOpen = () => !!root;
  const zoneId = () => openZone;

  function itemCtx() {
    const hasItem = opts.hasItem || (() => false);
    const hasStory = opts.hasStory || (() => false);
    return { hasItem, hasStory };
  }
  function mind() {
    const K = window.Mind && Mind.kit;
    if (!K || !K.S || !K.role || !K.role()) return null;
    return K;
  }
  function remember(fn) {
    const K = mind();
    if (!K) return;
    let changed = false;
    try { changed = !!fn(K.S); } catch (e) { return; }
    if (changed) { try { K.save(); } catch (e) { /* a failed save must not trap the player in the cave */ } }
  }

  function ellipse(x, y, rx, ry, color, rot) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, 0, Math.PI * 2); ctx.fill();
  }
  function poly(pts, color) {
    ctx.fillStyle = color; ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath(); ctx.fill();
  }
  function stroke(pts, color, w) {
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  }
  function blobPath(x, y, rx, ry, grow, phase) {
    ctx.beginPath();
    for (let i = 0; i <= 32; i++) {
      const t = (i / 32) * Math.PI * 2;
      const k = 1 + 0.08 * Math.sin(t * 3 + phase) + 0.05 * Math.sin(t * 5 + phase * 2) + (grow || 0);
      const px = x + Math.cos(t) * rx * k, py = y + Math.sin(t) * ry * k;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
  }
  function shadow(x, y, rx) {
    const [dx, dy] = R.key.dir;
    ellipse(x + dx * rx * 0.35, y + 3, rx * 1.05, rx * 0.36, R.shadow.cast);
    ellipse(x, y + 1, rx * 0.8, rx * 0.28, R.shadow.contact);
  }
  function boulder(x, y, s, seed) {
    const T = R.stone, r = rng(seed), w = 38 * s, h = 50 * s;
    shadow(x, y + 2, w * 0.7);
    ctx.fillStyle = T.base; ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 1.15, y - h * 0.6, x - w * 0.4, y - h * 0.88);
    ctx.quadraticCurveTo(x + w * 0.25, y - h * (1.05 + r() * 0.1), x + w * 0.85, y - h * 0.68);
    ctx.quadraticCurveTo(x + w * 1.15, y - h * 0.3, x + w * 0.95, y); ctx.closePath(); ctx.fill();
    ellipse(x + w * 0.55, y - h * 0.3, w * 0.42, h * 0.32, T.dark, 0.3);
    ellipse(x - w * 0.15, y - h * 0.72, w * 0.58, h * 0.2, T.light, -0.3);
    ellipse(x - w * 0.45, y - h * 0.8, w * 0.3, h * 0.1, R.moss, -0.4);
    stroke([[x + w * 0.1, y - h], [x + w * 0.25, y - h * 0.6], [x + w * 0.05, y - h * 0.24]], T.line, 1);
  }
  function spire(x, y, h, w) {
    const T = R.stone;
    shadow(x, y, w);
    poly([[x - w, y], [x - w * 0.2, y - h], [x + w * 0.25, y - h], [x + w, y]], T.base);
    poly([[x + w * 0.15, y], [x + w * 0.1, y - h * 0.95], [x + w * 0.25, y - h], [x + w, y]], T.dark);
    stroke([[x - w * 0.8, y - 2], [x - w * 0.18, y - h + 2]], T.light, 1.4);
  }
  function edgePts(z, e) {
    return [[z.nodes[e.a].x, z.nodes[e.a].y], ...(e.via || []), [z.nodes[e.b].x, z.nodes[e.b].y]];
  }
  function drawPaths(z) {
    for (const e of z.edges) {
      const p = edgePts(z, e);
      stroke(p, R.ground.path, e.w);
      stroke(p, R.ground.pathTop, Math.max(8, e.w * 0.42));
      const r = rng(e.a.charCodeAt(0) * 17 + e.b.length);
      for (let i = 1; i < p.length; i++) {
        const ax = p[i - 1][0], ay = p[i - 1][1], bx = p[i][0], by = p[i][1];
        const len = Math.hypot(bx - ax, by - ay) || 1;
        const steps = Math.max(1, Math.round(len / 22));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
          const side = (r() - 0.5) * e.w * 0.7;
          const nx = -(by - ay) / len, ny = (bx - ax) / len;
          ellipse(x + nx * side, y + ny * side, 1.4 + r(), 1 + r() * 0.6, r() < 0.5 ? R.stone.light : R.stone.dark);
        }
      }
    }
  }
  function pond(x, y, rx, ry, lights) {
    const W = R.water;
    blobPath(x, y, rx + 10, ry + 8, 0.12, 1); ctx.fillStyle = W.bank; ctx.fill();
    blobPath(x, y, rx, ry, 0.04, 2); ctx.fillStyle = W.edge; ctx.fill();
    blobPath(x, y, rx * 0.86, ry * 0.82, 0, 2);
    const g = ctx.createLinearGradient(x, y - ry, x, y + ry);
    g.addColorStop(0, W.shallow); g.addColorStop(1, W.deep);
    ctx.fillStyle = g; ctx.fill();
    ctx.save(); blobPath(x, y, rx * 0.86, ry * 0.82, 0, 2); ctx.clip();
    ellipse(x + rx * 0.15, y - ry * 0.15, rx * 0.28, ry * 0.16, W.sheen);
    ctx.strokeStyle = W.ripple; ctx.lineWidth = 0.8;
    const ph = (time * 0.35) % 1;
    ctx.globalAlpha = 1 - ph;
    ctx.beginPath(); ctx.ellipse(x - rx * 0.2, y + ry * 0.1, 3 + ph * 14, 1.4 + ph * 5, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1; ctx.restore();
    if (lights) lights.push({ x, y, r: rx * 1.6, a: 0.28 });
  }
  function niche(x, y, lights) {
    const S = R.stone;
    boulder(x - 26, y + 4, 0.55, 11);
    boulder(x + 28, y + 2, 0.6, 12);
    ctx.fillStyle = S.dark; ctx.beginPath();
    ctx.moveTo(x - 22, y); ctx.lineTo(x - 22, y - 26); ctx.quadraticCurveTo(x, y - 52, x + 22, y - 26); ctx.lineTo(x + 22, y); ctx.fill();
    const g = ctx.createLinearGradient(x, y - 46, x, y);
    g.addColorStop(0, R.void); g.addColorStop(1, S.dark);
    ctx.fillStyle = g; ctx.beginPath();
    ctx.moveTo(x - 15, y); ctx.lineTo(x - 15, y - 22); ctx.quadraticCurveTo(x, y - 42, x + 15, y - 22); ctx.lineTo(x + 15, y); ctx.fill();
    ellipse(x, y - 3, 11, 3.2, S.light);
    ellipse(x + 3, y - 4, 2.2, 1.3, R.accent.ember);
    lights.push({ x, y: y - 8, r: 36, a: 0.35 });
  }
  function carved(x, y) {
    const T = R.stone;
    boulder(x, y + 6, 0.85, 9);
    ctx.fillStyle = T.dark;
    ctx.fillRect(x - 16, y - 46, 34, 40);
    for (let col = 0; col < 3; col++) {
      const cx = x - 10 + col * 10;
      for (let row = 0; row < 4; row++) stroke([[cx, y - 40 + row * 8], [cx + 5, y - 36 + row * 8]], T.light, 1.2);
    }
  }
  function bridge(z) {
    const e = z.edges.find((ed) => ed.a === "ho" && ed.b === "dai");
    if (!e) return;
    const p = edgePts(z, e);
    stroke(p, R.stone.dark, 18);
    stroke(p, R.stone.base, 12);
    stroke(p, R.stone.light, 2);
  }
  function threshold(n, lights) {
    const g = ctx.createRadialGradient(n.x, n.y, 4, n.x, n.y, 48);
    g.addColorStop(0, R.void); g.addColorStop(1, rgba(R.void, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, 48, 0, Math.PI * 2); ctx.fill();
    poly([[n.x - 18, n.y + 8], [n.x - 14, n.y - 28], [n.x - 8, n.y - 28], [n.x - 10, n.y + 8]], R.stone.base);
    poly([[n.x + 10, n.y + 8], [n.x + 8, n.y - 28], [n.x + 16, n.y - 28], [n.x + 18, n.y + 8]], R.stone.dark);
    lights.push({ x: n.x + Math.sin(time * 1.1) * 1.5, y: n.y - 10, r: 28, a: 0.25 });
  }
  function player(lights) {
    const x = pos[0], y = pos[1], bob = moving ? Math.sin(time * 6) * 1.1 : 0;
    shadow(x, y, 10);
    const hold = itemCtx().hasItem("den_nho") || itemCtx().hasItem("den_dau");
    poly([[x - 7, y - 4 - bob], [x + 7, y - 4 - bob], [x + 9, y + 2], [x - 8, y + 2]], R.wood.base);
    ellipse(x, y - 16 - bob, 5.5, 5.5, R.wood.light);
    const lx = x + heading * 12, ly = y - 12 - bob;
    stroke([[x + heading * 3, y - 8 - bob], [lx, ly]], R.wood.dark, 1.4);
    poly([[lx - 3, ly - 5], [lx + 3, ly - 5], [lx + 3, ly + 3], [lx - 3, ly + 3]], R.accent.lamp);
    lights.push({ x: lx, y: ly, r: hold ? 108 : 74, a: hold ? 0.9 : 0.62 });
  }
  function lightPass(lights, cam) {
    const A = R.ambient, W = canvas.width, H = canvas.height;
    const s = shade.getContext("2d");
    s.setTransform(1, 0, 0, 1, 0, 0);
    s.globalCompositeOperation = "source-over";
    s.clearRect(0, 0, W, H);
    s.fillStyle = rgba(A.color, A.strength);
    s.fillRect(0, 0, W, H);
    s.globalCompositeOperation = "destination-out";
    for (const l of lights) {
      const sx = (l.x - cam.x) * cam.k, sy = (l.y - cam.y) * cam.k, sr = Math.max(1, l.r * cam.k);
      const g = s.createRadialGradient(sx, sy, 0, sx, sy, sr);
      g.addColorStop(0, `rgba(0,0,0,${l.a * A.holes})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      s.fillStyle = g; s.beginPath(); s.arc(sx, sy, sr, 0, Math.PI * 2); s.fill();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(shade, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = rgba(A.lift[0], A.lift[1]);
    ctx.fillRect(0, 0, W, H);
    const key = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(W, H));
    key.addColorStop(0, rgba(R.key.color, R.key.strength));
    key.addColorStop(1, rgba(R.key.color, 0));
    ctx.fillStyle = key; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
  }

  function insideNode() {
    const z = zone();
    if (!z) return null;
    let best = null, bestD = Infinity;
    for (const [id, n] of Object.entries(z.nodes)) {
      const d = Math.hypot(pos[0] - n.x, pos[1] - n.y);
      if (d <= n.r * 0.75 && d < bestD) { best = id; bestD = d; }
    }
    return best;
  }
  function nearestNode() {
    const z = zone();
    let best = at, bestD = Infinity;
    for (const [id, n] of Object.entries(z.nodes)) {
      const d = Math.hypot(pos[0] - n.x, pos[1] - n.y);
      if (d < bestD) { best = id; bestD = d; }
    }
    return best;
  }
  function pathPoints(ids) {
    const z = zone();
    const pts = [];
    for (let i = 0; i < ids.length - 1; i++) {
      const a = ids[i], b = ids[i + 1];
      const e = z.edges.find((ed) => (ed.a === a && ed.b === b) || (ed.a === b && ed.b === a));
      let seg = edgePts(z, e);
      if (e.a !== a) seg = seg.slice().reverse();
      if (i) seg = seg.slice(1);
      pts.push(...seg);
    }
    return pts;
  }
  function markHere(id) {
    remember((S) => Zones.markNode(S, ID, id, Date.now()));
    if (id === "dai") remember((S) => Zones.markGate(S, "hang.light", Date.now()));
  }
  function arrive() {
    at = goal;
    moving = false;
    markHere(at);
    const fn = after; after = null;
    if (fn) fn();
  }
  function begin(from, nodeId, then) {
    const path = Zones.route(ID, from, nodeId, itemCtx());
    if (!path) return false;
    at = from;
    goal = nodeId;
    after = then || null;
    if (path.length === 1) { arrive(); return true; }
    dest = pathPoints(path);
    while (dest.length && dist(dest[0], pos) < 6) dest.shift();
    if (!dest.length) arrive();
    return true;
  }
  function go(nodeId) {
    const z = zone();
    const here = insideNode() || nearestNode();
    if (begin(here, nodeId)) return true;
    const behind = nodeId === "hanh_lang" || nodeId === "nguong";
    if (!behind) return false;
    const look = z.landmarks.find((l) => l.id === "hanh_lang_dau");
    if (here === "dai") { showLook(look); return true; }
    return begin(here, "dai", () => showLook(look));
  }
  function landmarkHere() {
    const id = insideNode();
    if (!id) return null;
    const list = zone().landmarks.filter((l) => l.node === id);
    if (!list.length) return null;
    const K = mind();
    const marks = K && K.S.zones && K.S.zones.marks;
    return list.find((l) => !(marks && marks[ID + ":" + l.id])) || list[0];
  }
  function lookText(l) {
    if (l.gate === "hang.light" && Zones.canPass(ID, zone().edges.find((e) => e.gate === "hang.light"), itemCtx(), "dai")) {
      return "Hành lang hẹp. Đèn soi vừa đủ thấy vách đá hai bên.";
    }
    return l.look;
  }
  function showLook(l) {
    if (!l || !root) return;
    note = l;
    remember((S) => Zones.markLandmark(S, ID, l.id, Date.now()));
    root.querySelector(".zone-note p").textContent = lookText(l);
    root.querySelector(".zone-note").hidden = false;
    root.querySelector(".zone-note button").focus();
  }
  function hideLook() {
    note = null;
    if (root) root.querySelector(".zone-note").hidden = true;
  }
  function leave() {
    const z = zone();
    const here = insideNode();
    const exit = (z.exits.find((e) => e.at === here) || z.exits.find((e) => e.at === z.entry)).to;
    const done = opts.onClose;
    close();
    if (done) done(exit);
  }
  function placeRocks() {
    const r = rng(41), out = [];
    for (let i = 0; i < 36; i++) {
      const x = WORLD.x + 24 + r() * (WORLD.w - 48);
      const y = 50 + r() * 1460;
      if (Zones.isWalkable(ID, x, y)) continue;
      const n = Zones.nearestWalkable(ID, x, y);
      if (Math.hypot(n.x - x, n.y - y) < 18) continue;
      out.push([x, y, 0.4 + r() * 0.5, i + 3]);
    }
    return out;
  }
  function camera(viewW, viewH, scale) {
    let x = pos[0] - viewW / scale / 2;
    let y = pos[1] - viewH / scale * 0.58;
    const maxX = WORLD.w - viewW / scale;
    const maxY = WORLD.h - viewH / scale;
    x = maxX <= 0 ? WORLD.x + maxX / 2 : Math.max(WORLD.x, Math.min(WORLD.x + maxX, x));
    y = maxY <= 0 ? WORLD.y + maxY / 2 : Math.max(WORLD.y, Math.min(WORLD.y + maxY, y));
    return { x, y };
  }
  function draw(now) {
    const dt = Math.min(0.05, (now - (previous || now)) / 1000);
    previous = now; time += dt;
    if (dest.length) {
      moving = true;
      const target = dest[0], d = dist(pos, target), step = 110 * dt;
      if (d <= step) { heading = target[0] >= pos[0] ? 1 : -1; pos = [target[0], target[1]]; dest.shift(); }
      else {
        heading = target[0] >= pos[0] ? 1 : -1;
        pos = [pos[0] + (target[0] - pos[0]) / d * step, pos[1] + (target[1] - pos[1]) / d * step];
      }
      const clamped = Zones.nearestWalkable(ID, pos[0], pos[1]);
      pos = [clamped.x, clamped.y];
      const stood = insideNode();
      if (stood) { at = stood; markHere(stood); }
      if (!dest.length) arrive();
    } else moving = false;

    const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; shade.width = pw; shade.height = ph; }
    const scale = Math.min(1.1, Math.max(0.72, w / 420));
    const cam = camera(w, h, scale);
    const lights = [];
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = R.void; ctx.fillRect(0, 0, w, h);
    ctx.setTransform(dpr, 0, 0, dpr, -cam.x * scale * dpr, -cam.y * scale * dpr);
    ctx.scale(scale, scale);
    const z = zone();
    blobPath(200, 960, 230, 900, 0.05, 1.2); ctx.fillStyle = R.ground.base; ctx.fill();
    drawPaths(z);
    bridge(z);
    const ho = z.nodes.ho, hoc = z.nodes.hoc, vach = z.nodes.vach, nguong = z.nodes.nguong, cua = z.nodes.cua, khe = z.nodes.khe_sang;
    pond(ho.x + 8, ho.y + 6, 58, 40, lights);
    niche(hoc.x, hoc.y, lights);
    carved(vach.x + 8, vach.y);
    threshold(nguong, lights);
    for (const [x, y, s, seed] of rocks) boulder(x, y, s, seed);
    spire(330, 470, 70, 10);
    spire(70, 360, 90, 12);
    const day = opts.darkness != null && opts.darkness < 0.4;
    lights.push({ x: cua.x, y: cua.y - 20, r: day ? 240 : 150, a: day ? 0.55 : 0.32 });
    lights.push({ x: khe.x + 10, y: khe.y - 16, r: day ? 160 : 90, a: day ? 0.45 : 0.22 });
    const r = rng(7);
    for (let i = 0; i < 10; i++) {
      const mx = 40 + r() * 320, my = 200 + r() * 1100;
      ellipse(mx + Math.sin(time * 0.2 + i) * 6, my + Math.sin(time * 0.15 + i) * 4, 0.9, 0.9, rgba(R.accent.mote, 0.35));
    }
    for (const rip of ripples) {
      const age = (now - rip.t) / 1000;
      if (age > 0.7) continue;
      ctx.strokeStyle = rgba(R.accent.glow, 0.45 * (1 - age / 0.7));
      ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(rip.x, rip.y, 6 + age * 36, 0, Math.PI * 2); ctx.stroke();
    }
    ripples = ripples.filter((rip) => now - rip.t < 700);
    const here = landmarkHere();
    if (here) {
      const n = z.nodes[here.node];
      ctx.strokeStyle = rgba(R.accent.glow, 0.55);
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(n.x, n.y + 4, 16, 7, 0, 0, Math.PI * 2); ctx.stroke();
    }
    player(lights);
    lightPass(lights, { x: cam.x, y: cam.y, k: scale * dpr });
    if (here) {
      const n = z.nodes[here.node];
      const sx = (n.x - cam.x) * scale, sy = (n.y - cam.y) * scale + 28;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = "13px system-ui"; ctx.textAlign = "center";
      ctx.fillStyle = R.stone.dark; ctx.fillText(n.name, sx + 1, sy + 1);
      ctx.fillStyle = R.accent.glow; ctx.fillText(n.name, sx, sy);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = 0; i < 12; i++) {
      const x = (i + 0.2) * (w / 12);
      ctx.fillStyle = i % 2 ? R.stone.dark : R.void;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 18, 28 + (i % 3) * 10); ctx.lineTo(x + 36, 0); ctx.fill();
    }
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.72);
    vg.addColorStop(0, rgba(R.void, 0)); vg.addColorStop(1, rgba(R.void, 0.5));
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);

    const stood = insideNode();
    root.querySelector(".zone-location").textContent = stood ? z.nodes[stood].name : "Lối đá";
    const btn = root.querySelector(".zone-interact");
    btn.hidden = !here || !!note;
    btn.textContent = here ? "Xem · " + z.nodes[here.node].name : "";
    const exitBtn = root.querySelector(".zone-exit-here");
    exitBtn.hidden = !(stood && stood !== z.entry && z.exits.some((e) => e.at === stood));
    if (preview) {
      fpsN++; const sec = now / 1000;
      if (sec - fpsT >= 0.5) { fps = Math.round(fpsN / (sec - fpsT)); fpsN = 0; fpsT = sec; }
      root.querySelector(".zone-fps").textContent = fps ? fps + " fps" : "";
    }
    frame = requestAnimationFrame(draw);
  }

  function onPointer(e) {
    if (note) return;
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(1.1, Math.max(0.72, canvas.clientWidth / 420));
    const cam = camera(canvas.clientWidth, canvas.clientHeight, scale);
    const x = (e.clientX - rect.left) / scale + cam.x;
    const y = (e.clientY - rect.top) / scale + cam.y;
    ripples.push({ x, y, t: previous || performance.now() });
    const z = zone();
    let pick = null, pickD = Infinity;
    for (const [id, n] of Object.entries(z.nodes)) {
      const d = Math.hypot(x - n.x, y - n.y);
      if (d <= n.r + 36 && d < pickD) { pick = id; pickD = d; }
    }
    if (!pick) {
      const spot = Zones.nearestWalkable(ID, x, y);
      pick = spot.node || nearestNode();
    }
    go(pick);
  }
  function onKey(e) {
    if (e.key === "Escape") { e.stopPropagation(); if (note) hideLook(); else leave(); }
    if (e.key !== "Tab" || !root) return;
    const buttons = [...root.querySelectorAll("button")].filter((b) => !b.hidden && !b.closest("[hidden]"));
    if (!buttons.length) return;
    const i = buttons.indexOf(document.activeElement);
    e.preventDefault();
    buttons[(i + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
  }

  function close() {
    if (!root) return;
    cancelAnimationFrame(frame);
    root.remove(); root = null; openZone = null; note = null; dest = [];
    document.body.style.overflow = oldOverflow;
    if (window.World && World.setPaused) World.setPaused(false);
    if (focusBefore && focusBefore.focus) focusBefore.focus();
  }
  function open(options) {
    if (root || !zone()) return;
    opts = options || {};
    preview = !!opts.preview;
    const z = zone();
    const entry = z.nodes[z.entry];
    pos = [entry.x, entry.y]; at = z.entry; goal = z.entry; dest = []; moving = false; after = null;
    rocks = placeRocks(); ripples = []; previous = 0; time = 0;
    openZone = ID;
    focusBefore = document.activeElement;
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (window.World && World.setPaused) World.setPaused(true);
    remember((S) => { Zones.addVisit(S, ID); Zones.markNode(S, ID, z.entry, Date.now()); return true; });
    root = document.createElement("section");
    root.className = "zone-map";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Hang Vọng Tâm");
    root.innerHTML = '<canvas aria-label="Chạm lối đá để đi"></canvas>'
      + '<header><div><small>MIỀN ĐÁ</small><h1>Hang Vọng Tâm</h1><span class="zone-location"></span></div>'
      + '<button type="button" class="zone-leave">Ra ngoài</button></header>'
      + '<button type="button" class="zone-interact" hidden></button>'
      + '<div class="zone-note" hidden><p></p><button type="button">Đi tiếp</button></div>'
      + '<aside><span>Chạm lối đá để đi. Chạm Xem để đứng nhìn.</span>'
      + '<span><button type="button" class="zone-exit-here" hidden>Ra lối này</button>'
      + (preview ? '<button type="button" class="zone-day">Ánh ngày / đêm</button> <span class="zone-fps"></span>' : "")
      + "</span></aside>";
    document.body.append(root);
    canvas = root.querySelector("canvas");
    ctx = canvas.getContext("2d");
    shade = document.createElement("canvas");
    root.querySelector(".zone-leave").onclick = leave;
    root.querySelector(".zone-exit-here").onclick = leave;
    root.querySelector(".zone-interact").onclick = () => { const l = landmarkHere(); if (l) showLook(l); };
    root.querySelector(".zone-note button").onclick = hideLook;
    const dayBtn = root.querySelector(".zone-day");
    if (dayBtn) dayBtn.onclick = () => { opts.darkness = opts.darkness < 0.4 ? 0.66 : 0.1; };
    canvas.addEventListener("pointerdown", onPointer);
    root.addEventListener("keydown", onKey);
    root.querySelector(".zone-leave").focus();
    frame = requestAnimationFrame(draw);
    // Preview only: ?zones-preview&walk=ho starts a walk so the route can be seen.
    try {
      const walkTo = preview && new URLSearchParams(location.search).get("walk");
      if (walkTo && zone().nodes[walkTo]) go(walkTo);
    } catch (e) { /* preview option */ }
  }
  function enter() {
    const K = mind();
    const api = K && K.api ? K.api() : null;
    open({
      darkness: api && api.darkness ? api.darkness() : 0.66,
      hasItem: (id) => !!(K && K.S.items && K.S.items.includes(id)),
      hasStory: () => false,
      onClose: (exit) => {
        const hang = window.World && World.PLACES && World.PLACES.hang;
        if (!hang || !exit) return;
        const x = hang.x + (exit.dx || 0), y = hang.y + (exit.dy || 0);
        if (World.setPlayer) World.setPlayer(x, y);
      },
    });
  }

  try {
    if (typeof location !== "undefined" && new URLSearchParams(location.search).has("zones-preview")) {
      const start = () => open({ preview: true, darkness: 0.66 });
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
      else start();
    }
  } catch (e) { /* preview is optional */ }

  return { enabled, isOpen, zoneId, open, close, enter };
})();
