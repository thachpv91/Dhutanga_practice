// Client: role picker, place-driven story engine, live presence (SSE) and shared traces.
(() => {
  const RECENT_MS = 12 * 60 * 60 * 1000; // "đêm nay" = last 12 hours
  const ARRIVE_DIST = 46;
  const STORE_KEY = "dhutanga.completed";
  const MEM_KEY = "dhutanga.memory";   // things remembered across nights (clues, kindnesses)
  const PROGRESS_KEY = "dhutanga.progress"; // checkpoint of the night in progress, per character
  const RUNS_KEY = "dhutanga.runs";    // how many nights have been finished
  const FIND_DIST = 34;
  const IDLE_HINT_MS = 9000; // standing still this long shows the "go this way" hint
  const DARKNESS = {
    "Chiều tàn": 0.42, "Chạng vạng": 0.55, "Đầu hôm": 0.6, "Canh hai": 0.66,
    "Canh ba": 0.7, "Canh tư": 0.64, "Gà gáy": 0.55, "Rạng sáng": 0.45, "Sáng sớm": 0.1, "Sáng": 0.08,
  };

  // How far from the character each role can look around (world units). The monk sits in the
  // dark and only sees what is close; the ghost drifts everywhere.
  const LOOK_RANGE = { monk: 420, villager: 700, ghost: Infinity };

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  const state = {
    pid: makeId(),
    sid: "",     // our public id (what other players see), assigned by the server
    connected: false,
    role: null,
    sceneId: null,
    sceneOpen: false,
    meter: 0,
    nick: "",
    peers: [],
    traces: [],
    liveFlags: new Set(),
    soundOn: false,
    lastGesture: 0,
    lastSent: { t: 0, x: -1, y: -1, key: "" },
    completed: loadCompleted(),
    vars: new Set(),      // per-night variables + remembered keys
    found: new Set(),     // finds already examined tonight
    leftScene: false,       // stepped out of the story to wander; the scene waits where it was
    detour: null,           // { place } e.g. the monk walking to the hermitage to read
    lowSince: 0, lastSuggest: 0,
    moodShift: 0,           // temporary swing of the mind colour (decays back to the baseline)
    readTonight: new Set(), // books read tonight (each calms the mind once per night)
    cp: null,               // current checkpoint (Progress shape): runId, day, endedRunId...
    findTarget: null,     // find the player is walking towards
    findOpen: null,       // { find, step } while the card is showing
    lastTouch: Date.now(),
    nudging: false,
  };

  function loadMem() {
    try { return new Set(JSON.parse(Save.get(MEM_KEY) || "[]")); } catch { return new Set(); }
  }
  function remember(key) {
    state.vars.add(key);
    const mem = loadMem(); mem.add(key);
    Save.set(MEM_KEY, JSON.stringify([...mem]));
  }
  const clueCount = () => [...loadMem()].filter((k) => k.startsWith("c_")).length;
  const runCount = () => Number(Save.get(RUNS_KEY)) || 0;

  function makeId() {
    try { return crypto.randomUUID(); } catch { return "p" + Math.random().toString(36).slice(2) + Date.now().toString(36); }
  }
  function loadCompleted() {
    try { return JSON.parse(Save.get(STORE_KEY) || "{}") || {}; } catch { return {}; }
  }
  function saveCompleted() {
    Save.set(STORE_KEY, JSON.stringify(state.completed));
  }

  // ---------- night checkpoint ----------
  let lastCpJson = "", lastPos = "", lastPosAt = 0;
  const POS_SAVE_MS = 20000; // position alone is saved at most this often (each save sends the whole character)
  const cpJson = (cp) => JSON.stringify(cp, (k, v) => (k === "savedAt" || k === "x" || k === "y" ? undefined : v));
  function loadCheckpoint() {
    try { return JSON.parse(Save.get(PROGRESS_KEY) || "null"); } catch { return null; }
  }
  function saveProgress() {
    if (!state.role || !state.cp) return;
    const p = World.getPlayer();
    const nightVars = [...state.vars].filter((k) => !loadMem().has(k)); // account memory is saved elsewhere
    state.cp = Progress.snapshot(state.cp, { sceneId: state.sceneId, meter: state.meter, found: state.found, readTonight: state.readTonight, x: p.x, y: p.y, nightVars });
    const json = cpJson(state.cp);
    const pos = state.cp.x + "," + state.cp.y;
    if (json === lastCpJson && (pos === lastPos || Date.now() - lastPosAt < POS_SAVE_MS)) return;
    lastCpJson = json; lastPos = pos; lastPosAt = Date.now();
    Save.set(PROGRESS_KEY, JSON.stringify(state.cp));
  }
  const endingFor = (scene) => scene.endings.find((e) => state.meter <= e.max) || scene.endings[scene.endings.length - 1];
  // Records the finished night once per runId; rendering the ending only reads state.
  function completeRun(scene) {
    const r = Progress.complete(state.cp, Chapters.bandOf(scene, state.meter)); // the band decides how the next night begins
    if (!r.first) return;
    state.cp = r.cp;
    const ending = endingFor(scene);
    if (ending.trace) leaveTrace(ending.trace);
    state.completed[state.role] = true;
    saveCompleted();
    Save.set(RUNS_KEY, String(runCount() + 1));
    Save.log(`Đi qua một đêm (${ROLE_INFO[state.role].name.toLowerCase()}).`);
    lastCpJson = "";
    saveProgress();
  }

  const currentScene = () => (state.role ? STORY[state.role].scenes[state.sceneId] : null);
  const currentPose = () => {
    const sc = currentScene();
    if (state.mindPose) return state.mindPose;
    return sc && state.sceneOpen && sc.pose === "sit" ? "sit" : null;
  };

  // ---------- network ----------
  function post(url, body) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pid: state.pid, ...body }),
    }).then((r) => r.json().catch(() => ({}))).catch(() => ({ error: "offline" }));
  }

  function sendPresence(force) {
    if (!state.connected) return;
    const p = World.getPlayer();
    const cid = Save.character() ? Save.character().id : null; // null for guest / trial play
    const key = `${state.role}|${state.sceneId}|${currentPose()}|${state.nick}|${Math.round(moodValue() * 25)}|${cid}`;
    const now = Date.now();
    const movedEnough = Math.abs(p.nx - state.lastSent.x) > 0.004 || Math.abs(p.ny - state.lastSent.y) > 0.002;
    if (!force && key === state.lastSent.key && (!movedEnough || now - state.lastSent.t < 350)) return;
    state.lastSent = { t: now, x: p.nx, y: p.ny, key };
    post("/api/presence", {
      role: state.role, scene: state.sceneId, nick: state.nick,
      x: state.role ? p.nx : 0.5, y: state.role ? p.ny : 0.99, pose: currentPose(),
      mood: state.role ? moodValue() : 0.5, characterId: cid,
    });
  }

  function connect() {
    const es = new EventSource("/events?pid=" + encodeURIComponent(state.pid));
    es.addEventListener("init", (e) => {
      const data = JSON.parse(e.data);
      state.connected = true;
      state.sid = data.sid || "";
      state.peers = data.peers;
      state.traces = data.traces;
      sendPresence(true);
      onPeers();
      renderTraces();
    });
    es.addEventListener("peers", (e) => {
      state.peers = JSON.parse(e.data);
      onPeers();
    });
    es.addEventListener("trace", (e) => {
      state.traces.push(JSON.parse(e.data));
      state.traces = state.traces.slice(-60);
      renderTraces();
      pushView();
    });
    es.addEventListener("moment", (e) => onMoment(JSON.parse(e.data)));
    es.addEventListener("chat", (e) => onChat(JSON.parse(e.data)));
    es.onerror = () => {
      state.connected = false;
      $("presence-count").textContent = "Mất kết nối, đang thử lại…";
    };
  }

  // ---------- flags: what other players did tonight ----------
  function flags() {
    const now = Date.now();
    const set = new Set(state.liveFlags);
    for (const t of state.traces) if (now - t.at < RECENT_MS) set.add(t.kind);
    return set;
  }
  const passes = (item, f) =>
    (!item.if || f.has(item.if)) && (!item.unless || !f.has(item.unless)) &&
    (!item.ifv || state.vars.has(item.ifv)) && (!item.unlessv || !state.vars.has(item.unlessv)) &&
    (!item.needLow || monkLow());

  // ---------- sky dial: sun by day, moon by night, plus the name of the hour ----------
  // hour: on a 24h clock continued past midnight (24 = midnight, 30 = 6am next day) so the sky moves smoothly.
  const CLOCK = {
    "Sáng sớm": { h: 6.4, hint: "khoảng 6 giờ sáng" },
    "Sáng": { h: 8.5, hint: "buổi sáng" },
    "Chiều tàn": { h: 17.2, hint: "khoảng 17 giờ" },
    "Chạng vạng": { h: 18.4, hint: "mặt trời vừa lặn" },
    "Đầu hôm": { h: 20, hint: "khoảng 19 giờ" },
    "Canh hai": { h: 22, hint: "khoảng 21 đến 23 giờ" },
    "Canh ba": { h: 24.6, hint: "quanh nửa đêm" },
    "Canh tư": { h: 26.6, hint: "khoảng 1 đến 3 giờ sáng" },
    "Gà gáy": { h: 28.6, hint: "gần sáng" },
    "Rạng sáng": { h: 29.7, hint: "trời hửng sáng" },
  };
  const sky = { h: 20, target: 20, raf: null, name: "" };
  function drawSky() {
    const cv = $("sky-canvas"), g = cv.getContext("2d");
    const w = cv.width, hgt = cv.height, h = sky.h;
    g.clearRect(0, 0, w, hgt);
    const day = h >= 6 && h <= 18 || h >= 30;
    const base = hgt - 10;
    // arc path of the sky
    g.strokeStyle = "rgba(240,234,215,0.6)"; g.lineWidth = 1.2; g.setLineDash([3, 4]);
    g.beginPath(); g.ellipse(w / 2, base, w / 2 - 14, base - 8, 0, Math.PI, 0); g.stroke(); g.setLineDash([]);
    // horizon
    g.strokeStyle = "rgba(240,234,215,0.8)"; g.beginPath(); g.moveTo(4, base); g.lineTo(w - 4, base); g.stroke();
    // body position: u in [0,1] across the visible part of its journey
    let hh = h >= 30 ? h - 24 : h;
    let u, isSun;
    if (hh >= 6 && hh <= 18) { u = (hh - 6) / 12; isSun = true; }
    else { const nh = hh < 6 ? hh + 24 : hh; u = Math.max(0, Math.min(1, (nh - 18) / 12)); isSun = false; }
    const ang = Math.PI * (1 - u);
    const rx = w / 2 - 14, ry = base - 8;
    const x = w / 2 + Math.cos(ang) * rx, y = base - Math.sin(ang) * ry;
    // twilight tint near the horizon
    const low = 1 - Math.sin(Math.PI * u);
    if (isSun) {
      const col = low > 0.55 ? "#ffb25a" : "#ffe27a";
      const gl = g.createRadialGradient(x, y, 0, x, y, 20); gl.addColorStop(0, col + "cc"); gl.addColorStop(1, col + "00");
      g.fillStyle = gl; g.beginPath(); g.arc(x, y, 20, 0, 7); g.fill();
      g.fillStyle = col; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill();
      g.strokeStyle = col; g.lineWidth = 1.2;
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.beginPath(); g.moveTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10); g.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13); g.stroke(); }
    } else {
      const gl = g.createRadialGradient(x, y, 0, x, y, 20); gl.addColorStop(0, "rgba(190,215,255,0.5)"); gl.addColorStop(1, "rgba(190,215,255,0)");
      g.fillStyle = gl; g.beginPath(); g.arc(x, y, 20, 0, 7); g.fill();
      g.fillStyle = "#e8eefc"; g.beginPath(); g.arc(x, y, 7.5, 0, 7); g.fill();
      g.fillStyle = "rgba(20,32,52,0.95)"; g.beginPath(); g.arc(x + 3.6, y - 1.2, 6.4, 0, 7); g.fill(); // crescent
      g.fillStyle = "rgba(255,255,255,0.8)";
      [[-24, -12], [22, -20], [-10, -22], [30, -8]].forEach(([dx, dy], i) => { g.fillRect(w / 2 + dx, base + dy * 0.9, 1.4, 1.4); }); // a few stars
    }
  }
  function updateSky(sc) {
    const name = state.devTime || (sc ? sc.time : null);
    const clock = name && CLOCK[name];
    $("sky").hidden = !state.role || !clock;
    if (!clock) return;
    $("sky-name").textContent = name;
    $("sky-hint").textContent = clock.hint;
    sky.target = clock.h;
    if (sky.raf) return;
    const step = () => {
      const d = sky.target - sky.h;
      if (Math.abs(d) < 0.02) { sky.h = sky.target; drawSky(); sky.raf = null; return; }
      sky.h += d * 0.08; drawSky(); sky.raf = requestAnimationFrame(step);
    };
    sky.raf = requestAnimationFrame(step);
  }

  // A monk whose mind is unsettled (craving, anger, confusion) is nudged toward the hermitage books.
  const monkLow = () => state.role === "monk" && moodValue() < 0.46;

  // Darkness comes from the scene's time of day, unless the dev panel forces a value.
  function currentDarkness(sc) {
    if (state.devDark != null) return state.devDark;
    return sc ? DARKNESS[sc.time] ?? 0.8 : 0.78;
  }

  // Mist replaces the visible meter: heavier when the character is troubled, thinner as it clears.
  // Monk and villager: higher meter = calmer. Ghost: lower "Chấp" = lighter.
  function mistLevel() {
    if (!state.role) return 0.4;
    const m = state.meter / 10;
    return state.role === "ghost" ? 0.15 + m * 0.85 : 1 - m * 0.85;
  }

  function pushView() {
    const sc = currentScene();
    NightAudio.setDay(currentDarkness(sc) < 0.3);
    NightAudio.setNight(currentDarkness(sc) >= 0.5);
    $("app").classList.toggle("day", currentDarkness(sc) < 0.3);
    updateSky(sc);
    if (state.role) updateMood();
    World.setView({
      mist: mistLevel(),
      lookRange: state.role ? LOOK_RANGE[state.role] : Infinity,
      role: state.role,
      pose: currentPose(),
      darkness: currentDarkness(sc),
      flags: flags(),
      marker: state.detour && !state.sceneOpen ? state.detour.place : sc && !state.sceneOpen ? sc.place : null,
      anchor: state.sceneOpen && !$("sheet").classList.contains("collapsed") ? 0.3 : 0.5,
    });
  }

  // ---------- presence ----------
  // Tell the player when another real person steps into the night.
  const knownRoles = new Map();
  let peersPrimed = false;
  function announceNewcomers() {
    for (const p of state.peers) {
      if (p.pid === state.sid || !p.role) continue;
      if (peersPrimed && knownRoles.get(p.pid) !== p.role && state.role) {
        const info = ROLE_INFO[p.role];
        const who = p.nick ? `${p.nick} (${info.name.toLowerCase()})` : `Một ${info.name.toLowerCase()}`;
        toast(`${who} vừa bước vào đêm này. Họ là người chơi thật.`);
      }
      knownRoles.set(p.pid, p.role);
    }
    for (const id of [...knownRoles.keys()]) if (!state.peers.some((p) => p.pid === id)) knownRoles.delete(id);
    peersPrimed = true;
  }

  function onPeers() {
    announceNewcomers();
    const others = state.peers.filter((p) => p.pid !== state.sid && p.role);
    World.setOthers(others);
    const total = state.peers.length - 1;
    const counts = { monk: 0, ghost: 0, villager: 0 };
    others.forEach((p) => counts[p.role]++);
    const parts = [];
    const narrow = window.matchMedia("(max-width: 480px)").matches;
    if (counts.monk) parts.push(`${counts.monk} ${narrow ? "sư" : "nhà sư"}`);
    if (counts.ghost) parts.push(`${counts.ghost} ${narrow ? "ma" : "hồn ma"}`);
    if (counts.villager) parts.push(`${counts.villager} ${narrow ? "dân" : "người dân"}`);
    $("presence-count").textContent = total <= 0
      ? (window.matchMedia("(max-width: 480px)").matches ? "Bạn ở đây một mình" : "Bạn đang ở đây một mình")
      : parts.length ? `${window.matchMedia("(max-width: 480px)").matches ? "Có" : "Đêm nay có"} ${parts.join(", ")}` : `${total} người đang xem`;
  }

  const MOMENT_TEXT = {
    chime: "Có tiếng chuông nhỏ vang lên đâu đó giữa các ngôi mộ.",
    sigh: "Có tiếng thở dài, rất gần, mà không thấy ai.",
    lantern: "Một đốm đèn lồng lay động sau bụi tre.",
    deva: "Có ánh sáng lạ tỏa xuống ở phía xa, như có chư thiên vừa ghé.",
  };

  let toastTimer = null;
  function toast(text) {
    const t = $("toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3800);
  }

  function onMoment(m) {
    if (m.topic === "deva") {
      if (m.from !== state.sid && state.role) { Mind.remote(m.x ?? 0.5, m.y ?? 0.5); toast(MOMENT_TEXT.deva); }
      return;
    }
    World.ripple(m.x ?? 0.5, m.y ?? 0.5, m.topic);
    if (state.soundOn) {
      if (m.topic === "chime") NightAudio.bell(m.from === state.sid ? 1 : 0.7);
      if (m.topic === "sigh") NightAudio.sigh();
    }
    if (m.from === state.sid) return;
    state.liveFlags.add(m.topic);
    pushView();
    toast(MOMENT_TEXT[m.topic]);
    if (state.sceneOpen) {
      $("whispers").appendChild(el("p", null, MOMENT_TEXT[m.topic]));
      while ($("whispers").children.length > 2) $("whispers").firstChild.remove();
    }
  }

  // ---------- traces ----------
  function traceSentence(t) {
    const info = ROLE_INFO[t.role];
    const who = t.nick ? `${t.nick} (${info ? info.name.toLowerCase() : "ai đó"})` : info ? "Một " + info.name.toLowerCase() : "Ai đó";
    const list = TRACE_TEXT[t.kind] || [""];
    return `${who} ${list[t.variant] || list[0]}.`;
  }
  function timeAgo(at) {
    const mins = Math.round((Date.now() - at) / 60000);
    if (mins < 1) return "vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.round(hours / 24)} ngày trước`;
  }
  function renderTraces() {
    const list = $("trace-list");
    list.replaceChildren();
    const recent = [...state.traces].reverse().slice(0, 30);
    for (const t of recent) {
      const li = el("li");
      li.dataset.role = t.role || "";
      li.appendChild(el("span", "dot"));
      const body = el("div");
      body.appendChild(document.createTextNode(traceSentence(t)));
      body.appendChild(el("span", "when", timeAgo(t.at)));
      li.appendChild(body);
      list.appendChild(li);
    }
    $("trace-empty").hidden = recent.length > 0;
    const tonight = state.traces.filter((t) => Date.now() - t.at < RECENT_MS).length;
    $("traces-count").textContent = String(tonight);
  }
  async function leaveTrace(trace) {
    const res = await post("/api/trace", { ...trace, role: state.role, nick: state.nick });
    if (res.error && !state.connected) {
      state.traces.push({ ...trace, role: state.role, nick: state.nick, at: Date.now(), id: makeId() });
      renderTraces();
      pushView();
    }
  }

  // ---------- picker ----------
  function renderPicker() {
    const runs = runCount();
    const note = $("night-note");
    note.hidden = runs === 0;
    if (runs) note.textContent = `Đây là đêm thứ ${runs + 1} bạn ở lại nghĩa địa. Có những điều của đêm trước vẫn còn ở đó.`;
    $("picker").hidden = false;
    $("sheet").hidden = true;
    $("walk-bar").hidden = true;
    $("role-chip").hidden = true;
    state.moodShift = 0;
    updateMood();
    syncChatButton();
    delete $("app").dataset.role;
    const list = $("role-list");
    list.replaceChildren();
    for (const role of Object.keys(ROLE_INFO)) {
      const info = ROLE_INFO[role];
      const card = el("button", "role-card");
      card.type = "button";
      card.dataset.role = role;
      const glyph = el("div", "glyph");
      glyph.appendChild(el("span"));
      card.append(glyph, el("div", "rc-name", info.name), el("div", "rc-who", info.who), el("div", "rc-blurb", info.blurb));
      if (state.completed[role]) card.appendChild(el("div", "rc-done", "Đã đi qua đêm này"));
      card.addEventListener("click", () => playNew(role));
      list.appendChild(card);
    }
    renderAccount();
    pushView();
  }

  // ---------- account & characters (playing without an account always works) ----------
  const ago = (iso) => (iso ? timeAgo(new Date(iso).getTime()) : "");
  function loginButtons(box) {
    const me = Save.me();
    if (me.google) {
      const g = el("button", "primary google-btn", "Đăng nhập bằng Google");
      g.type = "button";
      g.addEventListener("click", () => { Save.flush().finally(() => { location.href = "/auth/google"; }); });
      box.appendChild(g);
    }
    if (me.devLogin) {
      const d = el("button", "pill", "Đăng nhập thử (chỉ trên máy chạy thử)");
      d.type = "button";
      d.addEventListener("click", async () => {
        const name = ($("nick").value || "").trim() || prompt("Tên tài khoản thử:", "Người thử") || "";
        if (!name) return;
        await Save.devLogin(name); state.completed = loadCompleted(); renderPicker();
      });
      box.appendChild(d);
    }
    if (!me.google && !me.devLogin) box.appendChild(el("p", "hint", "Đăng nhập chưa được bật trên máy chủ này."));
  }
  function renderAccount() {
    const me = Save.me();
    const box = $("account"); box.replaceChildren();
    const chars = $("char-list"); chars.replaceChildren();
    if (!me.user) {
      chars.hidden = true;
      box.appendChild(el("p", "hint", "Chơi ngay không cần đăng nhập. Khi muốn giữ lại nhân vật, thẻ và vật phẩm để chơi tiếp lần sau, hãy đăng nhập."));
      const row = el("div", "account-actions"); loginButtons(row); box.appendChild(row);
      $("new-title").textContent = "Chơi ngay";
      $("nick-label").textContent = "Tên hiển thị (không bắt buộc)";
      $("nick").placeholder = "Một người lạ";
      return;
    }
    const head = el("div", "account-head");
    if (me.user.picture) { const img = el("img", "avatar"); img.src = me.user.picture; img.alt = ""; img.referrerPolicy = "no-referrer"; head.appendChild(img); }
    head.appendChild(el("span", "account-name", `Xin chào, ${me.user.name || "bạn"}`));
    const prof = el("button", "pill", "Nhân vật của tôi"); prof.type = "button";
    prof.addEventListener("click", () => Profile.open());
    head.appendChild(prof);
    const out = el("button", "text-btn", "Đăng xuất"); out.type = "button";
    out.addEventListener("click", async () => { await Save.logout(); Mind.reload(); state.completed = loadCompleted(); renderPicker(); });
    head.appendChild(out);
    box.appendChild(head);
    if (me.storage === "file") box.appendChild(el("p", "hint", "Máy chủ đang lưu tài khoản vào file thử, dữ liệu có thể mất khi máy chủ khởi động lại."));
    // progress played as a guest on this device can be moved into the account
    const g = Save.guestProgress();
    if (g) {
      const imp = el("div", "quest-tip");
      imp.appendChild(el("p", null, `Trên máy này có một lần chơi thử (${ROLE_INFO[g.role].name.toLowerCase()}, ${g.cards} thẻ, ${g.items} vật phẩm). Lưu thành một nhân vật trong tài khoản?`));
      const b = el("button", "pill", "Lưu thành nhân vật"); b.type = "button";
      b.addEventListener("click", async () => {
        b.disabled = true;
        try { await Save.importGuest(($("nick").value || "").trim() || "Nhân vật đầu tiên"); await Save.refresh(); Mind.reload(); state.completed = loadCompleted(); toast("Đã lưu lần chơi thử thành nhân vật."); }
        catch (e) { toast(e.message === "too many characters" ? "Tài khoản đã đủ số nhân vật." : "Chưa lưu được, thử lại nhé."); }
        renderPicker();
      });
      imp.appendChild(b);
      box.appendChild(imp);
    }
    const list = me.characters || [];
    chars.hidden = !list.length;
    if (list.length) chars.appendChild(el("h2", "label new-title", "Nhân vật của bạn"));
    for (const c of list) {
      const info = ROLE_INFO[c.role];
      const card = el("div", "char-card");
      card.dataset.role = c.role;
      const glyph = el("div", "glyph"); glyph.appendChild(el("span"));
      const body = el("button", "char-body");
      body.type = "button";
      body.title = "Xem hồ sơ nhân vật";
      body.addEventListener("click", () => Profile.open(c.id));
      const nm = el("div", "rc-name", c.name);
      if (c.newConnections > 0) nm.appendChild(el("span", "new-dot"));
      body.appendChild(nm);
      body.appendChild(el("div", "rc-who", `${info ? info.name : c.role} · ${c.cards || 0} thẻ · ${c.items || 0} vật phẩm${c.updatedAt ? " · " + ago(c.updatedAt) : ""}`));
      const go = el("button", "primary", "Chơi tiếp"); go.type = "button";
      go.addEventListener("click", () => playCharacter(c.id));
      const del = el("button", "text-btn", "Xóa"); del.type = "button";
      del.addEventListener("click", async () => {
        if (!confirm(`Xóa nhân vật “${c.name}”? Thẻ, vật phẩm và nhật ký của nhân vật này sẽ mất.`)) return;
        await Save.deleteCharacter(c.id).catch(() => toast("Chưa xóa được."));
        renderPicker();
      });
      const actions = el("div", "char-actions"); actions.append(go, del);
      card.append(glyph, body, actions);
      chars.appendChild(card);
    }
    $("new-title").textContent = "Tạo nhân vật mới";
    $("nick-label").textContent = "Tên nhân vật (bắt buộc), rồi chọn vai bên dưới";
    $("nick").placeholder = "Ví dụ: Thầy Minh Tâm, Bà Tư, Bóng áo trắng";
  }
  async function playNew(role) {
    const typed = ($("nick").value || "").replace(/\s+/g, " ").trim().slice(0, 24);
    if (!Save.signedIn()) { Save.setGuestRole(role, typed); Mind.reload(); return startRole(role); }
    // a new character needs a name: the one typed in the box becomes the character's name
    if (!typed) {
      const input = $("nick");
      input.classList.add("need");
      input.scrollIntoView({ block: "center", behavior: "smooth" });
      setTimeout(() => input.focus(), 250);
      $("nick-label").textContent = `Đặt tên cho ${ROLE_INFO[role].name.toLowerCase()} của bạn trước nhé`;
      return;
    }
    const name = typed;
    try { await Save.createCharacter(name, role); }
    catch (e) { toast(e.message === "too many characters" ? "Tài khoản đã đủ 12 nhân vật. Xóa bớt một nhân vật để tạo mới." : "Chưa tạo được nhân vật, thử lại nhé."); return; }
    $("nick").value = "";
    Mind.reload();
    startRole(role);
  }
  Profile.init({
    // from the profile: play a character (leaving the one in play first, if any)
    play: async (id) => { if (state.role) await leaveRole(); playCharacter(id); },
    changed: () => { if (!state.role) renderPicker(); },
    // from the profile's "Người quen": connect or disconnect changed who is a quen
    connChanged: () => refreshQuen(),
    login: () => { if (Save.me().google) Save.flush().finally(() => { location.href = "/auth/google"; }); else { leaveRole(); toast("Đăng nhập ở màn hình chọn vai, rồi lưu lần chơi này thành nhân vật."); } },
  });
  async function playCharacter(id) {
    try { await Save.openCharacter(id); } catch { toast("Chưa mở được nhân vật này."); return; }
    Mind.reload();
    startRole(Save.character().role);
  }

  function startRole(role) {
    state.nick = Save.character() ? Save.character().name : $("nick").value.replace(/\s+/g, " ").trim().slice(0, 24);
    state.completed = loadCompleted();
    state.role = role;
    refreshQuen();
    const spawn = World.SPAWN[role];
    const plan = Progress.decide(loadCheckpoint(), role, STORY[role], spawn, { minX: 12, maxX: World.W - 12, minY: 60, maxY: World.H }, { mem: loadMem() });
    state.cp = plan.cp;
    state.sceneId = plan.cp.sceneId;
    state.sceneOpen = false;
    state.meter = plan.cp.meter;
    state.liveFlags.clear();
    state.vars = new Set([...loadMem(), ...plan.cp.vars]);
    state.found = new Set(plan.cp.found);
    state.readTonight = new Set(plan.cp.readTonight);
    state.leftScene = false; state.detour = null; state.lowSince = 0;
    state.findTarget = null;
    closeFind(true);
    refreshFinds();
    $("whispers").replaceChildren();
    if (!state.soundOn) toggleSound(true);
    $("picker").hidden = true;
    syncChatButton();
    $("app").dataset.role = role;
    $("role-chip").hidden = false;
    $("role-chip").textContent = ROLE_INFO[role].name;
    state.moodShift = 0;
    updateMood();
    $("meter-name").textContent = ROLE_INFO[role].meter;
    $("gesture").textContent = ROLE_INFO[role].gesture.label;
    $("gesture-walk").textContent = ROLE_INFO[role].gesture.label;
    World.setPlayer(plan.cp.x, plan.cp.y);
    lastCpJson = "";
    saveProgress();
    pushView();
    sendPresence(true);
    // signed-in character only (a guest is a no-op): legacy backfill once per character, then prime the levels
    try { window.Journey && Journey.onCharacterOpened(); } catch {}
    // first time ever: a short survey of temperament before the night begins
    const begin = () => {
      if (!Mind.onRoleStart(role, () => { if (state.role === role) showWalkOrScene(); })) showWalkOrScene();
      if (announce) setTimeout(() => { if (state.role === role) toast(announce); }, 700);
    };
    // a new night names its chapter once ("Đêm 2 · Theo thầy tu tập"); a night in progress is not announced again
    const chapterId = plan.cp.arc.chapter;
    const chapterTitle = chapterId === "c1" ? "" : Chapters.title(role, chapterId);
    const chapterLine = chapterTitle ? `Đêm ${plan.cp.day} · ${chapterTitle}` : "";
    $("role-chip").title = chapterLine; // hover/long-press on the role chip; the toast below shows it once, for a new night
    const announce = plan.mode === "newnight" ? chapterLine : "";
    const back = plan.cp.returnFrom;
    const nudge = window.NightReflect && NightReflect.nudgeLine ? NightReflect.nudgeLine(plan.cp) : null;
    if (back && window.NightReflect && NightReflect.showAway) {
      // narrative only; shown once, cleared when the player presses start
      NightReflect.showAway({
        role, away: back, now: Date.now(), runId: plan.cp.runId, nudge,
        onStart: () => {
          if (state.role !== role) return;
          const { returnFrom, ...rest } = state.cp;
          state.cp = rest; lastCpJson = ""; saveProgress();
          begin();
        },
      });
    } else {
      begin();
      if (nudge) setTimeout(() => { if (state.role === role) toast(nudge); }, announce ? 4800 : 1500);
    }
  }

  function leaveRole() {
    lastPosAt = 0; saveProgress();
    Mind.onRoleEnd();
    const closing = Save.closeCharacter().then(() => Save.refresh()).then(() => { if (!state.role) renderPicker(); });
    state.mindPose = null;
    stopWatch();
    closeFind(true);
    World.setFinds([]);
    state.role = null;
    state.sceneId = null;
    state.sceneOpen = false;
    World.stop();
    World.setQuen(new Set());
    sendPresence(true);
    renderPicker();
    return closing;
  }

  // ---------- place-driven flow ----------
  function distanceToPlace() {
    const sc = currentScene();
    if (!sc) return Infinity;
    const place = World.PLACES[sc.place];
    const p = World.getPlayer();
    return Math.hypot(p.x - place.x, p.y - place.y);
  }

  function showWalkBar() {
    const sc = currentScene();
    state.sceneOpen = false;
    $("sheet").hidden = true;
    $("walk-bar").hidden = false;
    if (state.detour) {
      $("walk-time").textContent = "Đọc kinh cho lòng vững";
      $("walk-text").textContent = `Đi tới ${World.PLACES[state.detour.place].name}`;
    } else {
      $("walk-time").textContent = sc.time;
      $("walk-text").textContent = `Đi tới ${World.PLACES[sc.place].name}`;
    }
    pushView();
  }
  function showWalkOrScene() {
    if (!state.detour && !state.leftScene && distanceToPlace() <= ARRIVE_DIST) return openScene();
    showWalkBar();
  }
  // Step out of the story to walk around freely. The scene stays pending.
  function wander() {
    if (!state.role || state.findOpen) return;
    state.leftScene = true;
    showWalkBar();
  }
  const targetPlace = () => (state.detour ? World.PLACES[state.detour.place] : currentScene() ? World.PLACES[currentScene().place] : null);

  function startDetour(placeKey) {
    state.detour = { place: placeKey };
    state.leftScene = true;
    state.findTarget = null;
    showWalkBar();
    toast("Thầy đứng dậy, đi về tịnh thất đọc kinh.");
  }
  function endDetour(message) {
    if (!state.detour) return;
    state.detour = null;
    state.leftScene = true; // stay free until the player walks back to the pending scene
    showWalkBar();
    if (message) toast(message);
  }

  function openScene() {
    state.sceneOpen = true;
    World.stop();
    $("walk-bar").hidden = true;
    $("sheet").hidden = false;
    setCollapsed(false);
    renderScene();
    pushView();
    sendPresence(true);
  }

  function setCollapsed(collapsed) {
    $("sheet").classList.toggle("collapsed", collapsed);
    $("sheet-handle").setAttribute("aria-expanded", String(!collapsed));
    pushView();
  }

  // ---------- story ----------
  function renderMeter() {
    $("meter-fill").style.width = (state.meter / 10) * 100 + "%";
    $("meter").setAttribute("aria-label", `${ROLE_INFO[state.role].meter}: ${state.meter} trên 10`);
  }

  function renderScene() {
    const scene = currentScene();
    const f = flags();
    $("time-label").textContent = scene.time;
    renderMeter();
    const lines = $("lines");
    lines.replaceChildren();
    const choices = $("choices");
    choices.replaceChildren();
    $("sheet-body").scrollTop = 0;

    NightAudio.setDay((DARKNESS[scene.time] ?? 0.8) < 0.3);
    if ((scene.time === "Sáng sớm" || scene.time === "Gà gáy") && state.roosterFor !== state.sceneId && state.soundOn) {
      state.roosterFor = state.sceneId;
      setTimeout(() => NightAudio.rooster(), 900);
    }
    if (scene.end && scene.epilogue) return renderEpilogue(scene);
    if (scene.end) { completeRun(scene); return renderEnding(scene); }
    if (scene.watch) return renderWatch(scene);

    let i = 0;
    for (const line of scene.lines) {
      const item = typeof line === "string" ? { text: line } : line;
      if (!passes(item, f)) continue;
      const p = el("p", item.if ? "shared" : null, item.text);
      p.style.animationDelay = i++ * 0.3 + "s";
      lines.appendChild(p);
    }
    for (const c of scene.choices) {
      if (!passes(c, f)) continue;
      const b = el("button", "choice", c.label);
      b.type = "button";
      if (c.trace) b.appendChild(el("span", "tag", "Để lại dấu vết cho người khác"));
      else if (c.emit) b.appendChild(el("span", "tag", "Người khác sẽ nghe thấy"));
      b.addEventListener("click", () => (c.detour ? startDetour(c.detour) : choose(c)));
      choices.appendChild(b);
    }
  }

  function choose(c) {
    state.meter = Math.max(0, Math.min(10, state.meter + (c.delta || 0)));
    swingByDelta(c.delta);
    if (c.trace) leaveTrace(c.trace);
    if (c.emit) gesture(c.emit, true);
    if (c.set) state.vars.add(c.set);
    if (c.remember) remember(c.remember);
    state.sceneId = c.next;
    saveProgress();
    $("whispers").replaceChildren();
    showWalkOrScene();
    sendPresence(true);
  }

  // ---------- finds: things lying around the graveyard ----------
  const visibleFinds = () => FINDS.filter((f) => (f.role === state.role || f.role === "any") && !state.found.has(f.id) && (state.devAllFinds || (f.minRuns || 0) <= runCount()));
  function refreshFinds() { World.setFinds(state.role ? visibleFinds().map((f) => ({ id: f.id, role: f.role, x: f.x, y: f.y })) : []); }
  function nearestFind(x, y) {
    let best = null, bd = 34;
    for (const f of visibleFinds()) { const d = Math.hypot(f.x - x, f.y - y); if (d < bd) { bd = d; best = f; } }
    return best;
  }
  function openFind(f) {
    state.findTarget = null;
    World.stop();
    state.findOpen = { find: f, step: f.start };
    $("walk-bar").hidden = true;
    $("find-card").hidden = false;
    renderFind();
    pushView();
  }
  function renderFind() {
    const { find, step } = state.findOpen;
    const st = find.steps[step];
    if (st.room) return openRoom(find, st.room === true ? "ruin" : st.room);
    if (st.clue) remember(st.clue);
    const lines = $("find-lines"); lines.replaceChildren();
    st.lines.forEach((t, i) => { const p = el("p", null, t); p.style.animationDelay = i * 0.3 + "s"; lines.appendChild(p); });
    const box = $("find-choices"); box.replaceChildren();
    for (const c of st.choices) {
      const b = el("button", "choice", c.label);
      b.type = "button";
      if (c.trace) b.appendChild(el("span", "tag", "Để lại dấu vết cho người khác"));
      b.addEventListener("click", () => {
        state.meter = Math.max(0, Math.min(10, state.meter + (c.delta || 0)));
        swingByDelta(c.delta);
        if (c.trace) leaveTrace(c.trace);
        if (c.next) { state.findOpen.step = c.next; renderFind(); pushView(); }
        else { if (!find.repeat) state.found.add(find.id); closeFind(false); }
      });
      box.appendChild(b);
    }
  }
  function openRoom(find, kind = "ruin") {
    $("find-card").hidden = true;
    Room.open({
      flipped: loadMem().has("c_anh"), // the photo stays turned over once you have seen it
      hasWife: loadMem().has("c_vo"),  // the sealed envelope can only be opened once you know who wrote it
      onLore: (key) => remember(key),
      kind,
      books: kind === "hermit" ? HERMIT_BOOKS : [],
      readKeys: [...loadMem()].filter((k) => k.startsWith("k_")),
      // reading calms the mind once per night; what you read is remembered for good
      onRead: (key) => {
        const first = !state.readTonight.has(key);
        remember(key);
        // finishing a book or bowing at the altar: a bright, moonlike swing even on re-reads
        swingMood(key === "k_altar" ? 0.2 : 0.35);
        if (state.detour) endDetour("Đọc xong, lòng thầy vững lại. Quay về chỗ cũ khi nào thầy muốn: nút Nhiệm vụ sẽ chỉ đường.");
        if (first) { state.readTonight.add(key); state.meter = Math.max(0, Math.min(10, state.meter + goodDelta(1))); pushView(); }
        return first;
      },
      onPhoto: () => { remember("c_anh"); state.meter = Math.min(10, state.meter + 1); },
      onClose: () => { if (!find.repeat) state.found.add(find.id); closeFind(false); },
    });
  }
  function closeFind(silent) {
    state.findOpen = null;
    $("find-card").hidden = true;
    if (silent) return;
    refreshFinds();
    pushView();
    showWalkOrScene();
  }

  // ---------- mind colour ----------
  // Baseline comes from the hidden meter (for the ghost, less attachment = better). Choices, reading and
  // sitting swing it for a while, then it eases back. Black -> red -> amber -> yellow -> moon white.
  function moodBase() {
    const m = state.meter / 10;
    return state.role === "ghost" ? 1 - m : m;
  }
  function moodValue() { return Math.max(0, Math.min(1, moodBase() + state.moodShift + Mind.bias())); }
  // For the ghost a higher meter (attachment) is worse, so its sign is flipped.
  const goodDelta = (d) => (state.role === "ghost" ? -d : d);
  const swingByDelta = (d) => { const g = goodDelta(d || 0); swingMood(g * (g < 0 ? 0.09 : 0.05)); };
  function swingMood(amount) { state.moodShift = Math.max(-0.4, Math.min(0.45, state.moodShift + amount)); updateMood(); }
  function moodLabel(g) { return g < 0.12 ? "Sân, u tối" : g < 0.35 ? "Tham, chấp" : g < 0.46 ? "Mê mờ" : g < 0.74 ? "Tín, hoan hỷ" : "Sáng, thấy rõ"; }
  function updateMood() {
    const orb = $("mind");
    if (!state.role) { orb.hidden = true; World.setView({ mood: null }); return; }
    orb.hidden = false;
    const g = moodValue();
    const [r, gg, b] = World.moodRgb(g);
    orb.style.setProperty("--mind", `rgb(${r},${gg},${b})`);
    orb.style.setProperty("--mind-dark", `rgb(${Math.round(r * 0.45)},${Math.round(gg * 0.45)},${Math.round(b * 0.45)})`);
    orb.style.setProperty("--glow", String(Math.max(0, (g - 0.5) / 0.5)));
    orb.classList.toggle("moon", g >= 0.78);
    $("mind-name").textContent = moodLabel(g);
    World.setView({ mood: g });
  }
  // Tapping the mind orb opens the character's profile: mind now, stats, cards, bag, diary.
  $("mind").addEventListener("click", () => {
    if (!state.role) return;
    const ch = Save.character();
    const g = moodValue();
    const [r, gg, b] = World.moodRgb(g);
    Profile.openCurrent({
      id: ch ? ch.id : "guest",
      name: ch ? ch.name : state.nick || "Khách",
      role: state.role,
      mind: Mind.parts.current(),
      history: Save.history(),
      mood: { label: moodLabel(g), color: `rgb(${r},${gg},${b})` },
      suggestion: Mind.parts.suggestion(),
    });
  });
  $("mind-info-close").addEventListener("click", () => { $("mind-info").hidden = true; });
  // a swing of mood fades back toward the baseline over about half a minute
  setInterval(() => {
    if (state.role === "monk" && !state.detour) {
      const now = Date.now();
      if (moodValue() < 0.4) {
        if (!state.lowSince) state.lowSince = now;
        else if (now - state.lowSince > 9000 && now - state.lastSuggest > 120000) {
          state.lastSuggest = now;
          toast("Lòng thầy đang xao động. Tịnh thất có kinh để đọc cho lòng vững lại. Mở Nhiệm vụ để được chỉ đường.");
        }
      } else state.lowSince = 0;
    }
    if (!state.role) return;
    if (Math.abs(state.moodShift) > 0.004) { state.moodShift *= 0.992; updateMood(); } else if (state.moodShift !== 0) { state.moodShift = 0; updateMood(); }
  }, 200);

  // ---------- sit-and-note mini-game ----------
  // No score shown: thoughts drift by, tap one to note it and return to the breath.
  let watchTimer = null;
  function stopWatch() { clearInterval(watchTimer); watchTimer = null; }

  function renderWatch(scene) {
    stopWatch();
    const w = scene.watch;
    const lines = $("lines");
    lines.appendChild(el("p", null, w.intro));
    const box = el("div", "watch");
    const ring = el("div", "breath");
    const field = el("div", "thoughts");
    const note = el("div", "watch-note", "Chạm vào ý nghĩ để ghi nhận");
    box.append(field, ring, note);
    lines.appendChild(box);
    const skip = el("button", "text-btn watch-skip", "Tua");
    skip.type = "button";
    $("choices").appendChild(skip);

    let left = w.seconds, returned = 0, spawned = 0;
    const pool = [...w.thoughts].sort(() => Math.random() - 0.5);
    const finish = () => {
      stopWatch();
      const idx = returned >= 6 ? 2 : returned >= 3 ? 1 : 0;
      const res = [...w.results].reverse().find((r) => returned >= r.min) || w.results[0];
      box.remove(); skip.remove();
      lines.appendChild(el("p", null, `Trong buổi ngồi, thầy đã quay về ${returned} lần.`));
      lines.appendChild(el("p", "ending", res.text));
      state.meter = Math.max(0, Math.min(10, state.meter + w.delta[idx]));
      pushView();
      const go = el("button", "choice", "Tiếp tục ngồi tới canh tư");
      go.type = "button";
      go.addEventListener("click", () => { state.sceneId = w.next; $("whispers").replaceChildren(); showWalkOrScene(); sendPresence(true); });
      $("choices").appendChild(go);
    };
    const spawn = () => {
      const t = pool[spawned++ % pool.length];
      const b = el("button", "thought", t.text);
      b.type = "button";
      b.style.left = 6 + Math.random() * 38 + "%";
      b.addEventListener("click", () => {
        if (b.dataset.done) return;
        b.dataset.done = "1"; returned++; swingMood(0.05);
        b.classList.add("noted");
        b.textContent = `${t.kind}, ${t.kind}…`;
        note.textContent = "Ghi nhận. Quay về hơi thở.";
        setTimeout(() => b.remove(), 1200);
      });
      field.appendChild(b);
      setTimeout(() => b.remove(), 9000);
    };
    spawn();
    watchTimer = setInterval(() => {
      left -= 1;
      if (left % 4 === 0 && left > 4) spawn();
      if (left <= 0) finish();
    }, 1000);
    skip.addEventListener("click", finish);
  }

  function renderEpilogue(scene) {
    const f = flags();
    const lines = $("lines");
    let i = 0;
    for (const line of scene.lines) {
      const item = typeof line === "string" ? { text: line } : line;
      if (!passes(item, f)) continue;
      const p = el("p", i === scene.lines.length - 1 ? "ending" : null, item.text);
      p.style.animationDelay = i++ * 0.4 + "s";
      lines.appendChild(p);
    }
    remember("epilogue_done");
    addEndButtons();
  }

  // End of a night: the reflection is the main way on; picking another role stays as a quiet option.
  function addEndButtons() {
    const reflect = el("button", "choice primary", "Quán xét cuối đêm");
    reflect.type = "button";
    reflect.addEventListener("click", openReflection);
    $("choices").appendChild(reflect);
    const again = el("button", "choice rf-secondary", "Chọn một vai khác");
    again.type = "button";
    again.addEventListener("click", leaveRole);
    $("choices").appendChild(again);
  }

  function openReflection() {
    if (!state.role || !(window.NightReflect && NightReflect.open)) return;
    const role = state.role;
    NightReflect.open({
      role,
      getCp: () => state.cp,
      setCp: (cp) => { state.cp = cp; lastCpJson = ""; saveProgress(); },
      history: () => Save.history(),
      log: (t) => Save.log(t),
      flush: () => { lastCpJson = ""; saveProgress(); return Save.flush(); },
      newNight: () => { if (state.role === role) { lastCpJson = ""; saveProgress(); startRole(role); } },
      leave: () => leaveRole(),
    });
  }

  function renderEnding(scene) {
    const ending = endingFor(scene);
    const lines = $("lines");
    lines.appendChild(el("p", "ending", ending.text));
    const roles = ["monk", "ghost", "villager"];
    if (roles.every((r) => state.completed[r])) {
      const box = el("div", "true-ending");
      TRUE_ENDING.forEach((t) => box.appendChild(el("p", null, t)));
      lines.appendChild(box);
      if (clueCount() >= CLUE_TOTAL) {
        const hb = el("div", "true-ending");
        HANH_REVEAL.forEach((t) => hb.appendChild(el("p", null, t)));
        lines.appendChild(hb);
      }
    } else {
      const left = roles.filter((r) => !state.completed[r]).map((r) => ROLE_INFO[r].name.toLowerCase());
      lines.appendChild(el("p", "left-hint", `Còn ${left.join(" và ")} chưa đi qua đêm này. Mỗi đôi mắt thấy một phần khác.`));
    }
    const n = clueCount();
    if (n < CLUE_TOTAL) {
      lines.appendChild(el("p", "left-hint", n === 0
        ? "Quanh nghĩa địa còn nhiều thứ bị bỏ quên, những đốm sáng nhỏ trên đất. Hãy kéo màn hình để nhìn quanh. Có một câu chuyện nằm trong đó."
        : `Bạn đã nhặt được ${n} trong ${CLUE_TOTAL} mảnh về cô bé Hạnh. Còn những mảnh nằm đâu đó trong nghĩa địa, ở chỗ mỗi vai mới thấy.`));
    }
    if (state.role === "monk" && roles.every((r) => state.completed[r])) {
      const up = el("button", "choice", "Đi lên đồi, về tịnh thất");
      up.type = "button";
      up.addEventListener("click", () => {
        state.sceneId = "t1";
        $("whispers").replaceChildren();
        showWalkOrScene();
        sendPresence(true);
      });
      $("choices").appendChild(up);
    }
    addEndButtons();
  }

  // ---------- gestures & sound ----------
  async function gesture(topic, fromChoice) {
    const now = Date.now();
    if (!fromChoice && now - state.lastGesture < 4000) return;
    state.lastGesture = now;
    for (const id of ["gesture", "gesture-walk"]) {
      $(id).disabled = true;
      setTimeout(() => ($(id).disabled = false), 4000);
    }
    sendPresence(true);
    const res = await post("/api/emit", { topic });
    if (res.error && !state.connected) {
      const p = World.getPlayer();
      World.ripple(p.nx, p.ny, topic);
    }
  }

  function toggleSound(force) {
    state.soundOn = typeof force === "boolean" ? force : !state.soundOn;
    if (state.soundOn) NightAudio.start(); else NightAudio.stop();
    const btn = $("sound-toggle");
    btn.setAttribute("aria-pressed", String(state.soundOn));
    btn.setAttribute("aria-label", state.soundOn ? "Tắt âm thanh" : "Bật âm thanh");
  }

  // ---------- nearby chat ----------
  const chat = { open: false, muted: false, unread: 0, log: [], lastSent: 0, tab: "near" }; // tab: "near" (Quanh đây) or "friends" (Người quen)
  const chatWho = (m) => (m.from === state.sid ? "Bạn" : m.nick || ROLE_INFO[m.role]?.name || "Ai đó");

  function renderChat() {
    const ol = $("chat-log");
    ol.replaceChildren();
    for (const m of chat.log.slice(-40)) {
      const li = el("li", m.sys ? "sys" : m.from === state.sid ? "me" : null);
      if (m.sys) li.textContent = m.text;
      else {
        li.dataset.role = m.role || "";
        li.appendChild(el("span", "who", chatWho(m)));
        li.appendChild(document.createTextNode(m.text));
      }
      ol.appendChild(li);
    }
    ol.scrollTop = ol.scrollHeight;
  }
  function chatNote(text) { $("chat-note").textContent = text || ""; }

  function onChat(m) {
    if (!state.role) return;
    if (chat.muted && m.from !== state.sid) return;
    chat.log.push(m);
    if (chat.log.length > 100) chat.log.shift();
    World.say(m.from === state.sid ? "me" : m.from, m.text, m.role);
    if (chat.open) { if (chat.tab === "near") renderChat(); } // on the friends tab the line is kept in the log, shown when "Quanh đây" opens
    else if (m.from !== state.sid) { chat.unread++; updateChatBadge(); toast(`${chatWho(m)}: ${m.text}`); }
  }
  function updateChatBadge() {
    $("chat-badge").hidden = chat.unread === 0;
    $("chat-badge").textContent = String(chat.unread);
  }
  function openChat(open) {
    chat.open = open;
    $("chat-panel").hidden = !open;
    if (open) { chat.unread = 0; updateChatBadge(); showChatTab(chat.tab); if (chat.tab === "near") setTimeout(() => $("chat-input").focus(), 50); }
  }
  $("chat-btn").addEventListener("click", () => openChat(!chat.open));
  $("chat-close").addEventListener("click", () => openChat(false));

  // ---------- the chat panel's second tab: "Người quen" (signed in, playing a saved character) ----------
  const friendsAvailable = () => connCharId() !== null;
  let friendsSeq = 0; // a late answer for an earlier load is dropped
  function showChatTab(tab) {
    if (tab === "friends" && !friendsAvailable()) tab = "near";
    chat.tab = tab;
    const friends = tab === "friends";
    $("chat-tabs").hidden = !friendsAvailable();
    $("chat-tab-near").setAttribute("aria-selected", String(!friends));
    $("chat-tab-friends").setAttribute("aria-selected", String(friends));
    $("chat-head-label").hidden = friends;
    $("chat-near").hidden = friends;
    $("chat-friends").hidden = !friends;
    if (friends) refreshFriends(); else renderChat();
  }
  $("chat-tab-near").addEventListener("click", () => showChatTab("near"));
  $("chat-tab-friends").addEventListener("click", () => showChatTab("friends"));
  // Quen connections of the character being played; a row gets "Đi tới chỗ bạn" only when that person is online here.
  async function refreshFriends() {
    const cid = connCharId();
    const list = $("chat-friends-list");
    const note = $("chat-friends-note");
    if (!cid) return;
    const seq = ++friendsSeq;
    note.textContent = "Đang tải…";
    try {
      const d = await Social.connections(cid);
      if (seq !== friendsSeq) return;
      const rows = (d.connections || []).filter((r) => r.level === "quen");
      list.replaceChildren();
      note.textContent = "";
      if (!rows.length) list.appendChild(el("li", "sys", "Chưa có người quen. Gặp ai đó ngoài làng, bấm Giữ kết nối, và khi họ cũng giữ lại thì thành quen."));
      for (const r of rows) list.appendChild(friendRow(r));
    } catch {
      if (seq === friendsSeq) note.textContent = "Chưa tải được danh sách, thử lại nhé.";
    }
  }
  function friendRow(r) {
    const li = el("li", "friend-row");
    const text = el("div", "friend-text");
    const meta = [ROLE_INFO[r.role] ? ROLE_INFO[r.role].name : "", r.archived ? "chuyện đã khép" : Social.statusText(r.status)].filter(Boolean).join(" · ");
    text.append(el("b", null, r.name || "Người này"), el("small", null, meta));
    li.appendChild(text);
    // An archived person is never online here, so no "Đi tới chỗ bạn".
    const peer = !r.archived && r.status && r.status.online ? state.peers.find((p) => p.handle === r.handle && p.pid !== state.sid) : null;
    if (peer) {
      const go = el("button", "pill", "Đi tới chỗ bạn"); go.type = "button";
      go.addEventListener("click", () => { openChat(false); state.findTarget = null; World.walkTo(peer.x * World.W + 24, peer.y * World.H + 6); });
      li.appendChild(go);
    }
    return li;
  }
  setInterval(() => { if (chat.open && chat.tab === "friends") refreshFriends(); }, 30000);
  $("chat-mute").addEventListener("click", () => {
    chat.muted = !chat.muted;
    $("chat-mute").setAttribute("aria-pressed", String(chat.muted));
    $("chat-mute").textContent = chat.muted ? "Bật chat" : "Tắt chat";
    chatNote(chat.muted ? "Bạn đang không nhận tin nhắn của người khác." : "");
  });
  $("chat-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = $("chat-input").value.replace(/\s+/g, " ").trim();
    if (!text || !state.role) return;
    if (Date.now() - chat.lastSent < 1500) { chatNote("Chậm một chút nhé."); return; }
    chat.lastSent = Date.now();
    $("chat-input").value = "";
    const res = await post("/api/chat", { text });
    if (res.error === "blocked") { chatNote(res.reason === "links" ? "Không gửi được đường dẫn." : res.reason === "numbers" ? "Không gửi được dãy số dài." : "Tin nhắn này không gửi được."); return; }
    if (res.error) { chatNote("Chưa gửi được, thử lại nhé."); return; }
    chatNote(res.heard === 0 ? "Chưa có ai ở gần để nghe thấy. Lại gần người khác nhé." : "");
  });
  function syncChatButton() { $("quest-btn").hidden = !state.role; if (!state.role) $("quest-panel").hidden = true; $("chat-btn").hidden = !state.role; $("zoom-ctl").hidden = !state.role; if (!state.role) openChat(false); }
  $("nick").addEventListener("input", () => $("nick").classList.remove("need"));
  $("zoom-in").addEventListener("click", () => World.zoomBy(1.25));
  $("zoom-out").addEventListener("click", () => World.zoomBy(0.8));

  // ---------- look around & map ----------
  window.addEventListener("lookchange", (e) => { $("look-back").hidden = !e.detail.on; });
  $("look-back").addEventListener("click", () => World.resetLook());

  const ROLE_DOT = { monk: "#d08a4d", ghost: "#9fd2c1", villager: "#e6c56f" };
  let mapTimer = null;
  function drawMap() {
    const cv = $("minimap");
    const r = cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (cv.width !== Math.round(r.width * dpr) || cv.height !== Math.round(r.height * dpr)) {
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    }
    const m = World.getMap();
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = r.width, h = r.height;
    const sx = w / m.W, sy = h / m.H;
    g.clearRect(0, 0, w, h);
    g.fillStyle = "#0a100f"; g.fillRect(0, 0, w, h);
    // path
    g.strokeStyle = "rgba(160,150,130,0.35)"; g.lineWidth = 5; g.lineJoin = "round"; g.lineCap = "round";
    g.beginPath(); m.path.forEach(([x, y], i) => (i ? g.lineTo(x * sx, y * sy) : g.moveTo(x * sx, y * sy))); g.stroke();
    // limited sight: dim what this role cannot see from where they stand
    const inRange = (y) => Math.abs(y - m.player.y) <= m.range + 140;
    if (isFinite(m.range)) {
      const y0 = (m.player.y - m.range - 140) * sy, y1 = (m.player.y + m.range + 140) * sy;
      g.fillStyle = "rgba(4,7,8,0.72)";
      g.fillRect(0, 0, w, Math.max(0, y0)); g.fillRect(0, Math.min(h, y1), w, h);
    }
    // places
    g.font = '500 10px "Be Vietnam Pro", system-ui, sans-serif';
    g.textAlign = "left"; g.textBaseline = "middle";
    const now = performance.now() / 1000;
    for (const [key, p] of Object.entries(m.PLACES)) {
      const ps = window.Discover && state.role ? Discover.placeState(key) : { visited: true, live: false };
      const px = p.x * sx, py = p.y * sy;
      const right = px < w * 0.55;
      g.textAlign = right ? "left" : "right";
      if (ps.live) {
        // something may happen here right now
        const pulse = 0.5 + 0.5 * Math.sin(now * 4);
        g.strokeStyle = `rgba(159,210,193,${0.35 + 0.5 * pulse})`; g.lineWidth = 1.4;
        g.beginPath(); g.arc(px, py, 6 + pulse * 3, 0, 7); g.stroke();
      }
      if (!ps.visited) {
        g.fillStyle = "rgba(220,213,197,0.35)";
        g.beginPath(); g.arc(px, py, 3, 0, 7); g.fill();
        g.font = '600 12px "Be Vietnam Pro", system-ui, sans-serif';
        g.fillStyle = ps.live ? "rgba(159,210,193,0.95)" : "rgba(220,213,197,0.55)";
        g.fillText("?", px + (right ? 8 : -8), py);
        g.font = '500 10px "Be Vietnam Pro", system-ui, sans-serif';
        continue;
      }
      g.fillStyle = "rgba(230,197,111,0.85)";
      g.beginPath(); g.arc(px, py, 3, 0, 7); g.fill();
      g.fillStyle = ps.live ? "rgba(159,210,193,0.95)" : "rgba(220,213,197,0.8)";
      g.fillText(p.name, px + (right ? 8 : -8), py);
    }
    // others (only when within sight)
    for (const o of m.others) {
      if (!inRange(o.y)) continue;
      g.fillStyle = ROLE_DOT[o.role] || "#dcd5c5";
      g.beginPath(); g.arc(o.x * sx, o.y * sy, 3.2, 0, 7); g.fill();
    }
    // things left lying around (only those within sight)
    g.fillStyle = "rgba(220,213,197,0.75)";
    for (const f of m.finds) {
      if (!inRange(f.y)) continue;
      const fx = f.x * sx, fy = f.y * sy;
      g.beginPath(); g.moveTo(fx, fy - 3.5); g.lineTo(fx + 2.5, fy); g.lineTo(fx, fy + 3.5); g.lineTo(fx - 2.5, fy); g.closePath(); g.fill();
    }
    // the spot picked on the map (to look at or walk to)
    if (state.mapPick) {
      const px2 = state.mapPick.x * sx, py2 = state.mapPick.y * sy;
      g.strokeStyle = "#e6c56f"; g.lineWidth = 1.6;
      g.beginPath(); g.arc(px2, py2, 6.5, 0, 7); g.moveTo(px2 - 10, py2); g.lineTo(px2 + 10, py2); g.moveTo(px2, py2 - 10); g.lineTo(px2, py2 + 10); g.stroke();
    }
    // you
    g.strokeStyle = "#dcd5c5"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(m.player.x * sx, m.player.y * sy, 5, 0, 7); g.stroke();
    // current view window
    g.strokeStyle = "rgba(220,213,197,0.45)"; g.lineWidth = 1; g.setLineDash([4, 3]);
    g.strokeRect(m.camX * sx, m.camY * sy, m.viewW * sx, m.viewH * sy); g.setLineDash([]);
  }
  function openMap() {
    $("map-panel").hidden = false;
    state.mapPick = null;
    $("map-look").disabled = $("map-go").disabled = true;
    $("map-hint").textContent = state.role === "monk"
      ? "Chạm vào một chỗ để chọn, rồi nhìn sang đó hoặc đi tới đó. Thầy ngồi trong bóng tối nên chỉ thấy được quanh mình."
      : "Chạm vào một chỗ để chọn, rồi nhìn sang đó hoặc đi tới đó.";
    requestAnimationFrame(drawMap);
    clearInterval(mapTimer);
    mapTimer = setInterval(drawMap, 400);
  }
  function closeMap() { $("map-panel").hidden = true; clearInterval(mapTimer); }
  $("map-btn").addEventListener("click", openMap);
  $("map-close").addEventListener("click", closeMap);
  // Tapping the map only picks a spot. Then "Nhìn sang đó" moves the camera, "Đi tới đó" walks the character there.
  $("minimap").addEventListener("click", (e) => {
    const r = $("minimap").getBoundingClientRect();
    const m = World.getMap();
    state.mapPick = { x: ((e.clientX - r.left) / r.width) * m.W, y: ((e.clientY - r.top) / r.height) * m.H };
    $("map-look").disabled = $("map-go").disabled = false;
    drawMap();
  });
  $("map-look").addEventListener("click", () => {
    if (!state.mapPick) return;
    World.lookAt(state.mapPick.y, state.mapPick.x);
    closeMap();
  });
  $("map-go").addEventListener("click", () => {
    const pick = state.mapPick;
    if (!pick) return;
    closeMap();
    if (state.sceneOpen) wander();
    else if (!state.leftScene) state.leftScene = true;
    state.findTarget = nearestFind(pick.x, pick.y);
    if (state.findTarget) World.walkTo(state.findTarget.x, state.findTarget.y + 8);
    else World.walkTo(pick.x, pick.y);
    toast("Thầy đi từ từ tới đó. Chạm vào cảnh để dừng hoặc đổi hướng.");
  });

  window.addEventListener("owl", (e) => {
    if (!state.role || currentDarkness(currentScene()) < 0.5) return;
    if (state.soundOn) NightAudio.owl(e.detail.pan);
  });

  window.addEventListener("crow", (e) => {
    if (!state.role || currentDarkness(currentScene()) < 0.5) return;
    if (state.soundOn) NightAudio.crow(e.detail.pan, e.detail.n);
  });

  // ---------- dev panel: open the game with ?dev to test any time of day or scene ----------
  if (new URLSearchParams(location.search).has("dev") && !(window.APP_CONFIG && window.APP_CONFIG.dev === false)) {
    const panel = el("div", "dev-panel");
    const toggle = el("button", "pill dev-toggle", "DEV");
    toggle.type = "button";
    const body = el("div", "dev-body");
    body.hidden = true;
    toggle.addEventListener("click", () => { body.hidden = !body.hidden; refreshDev(); });
    const row = (label) => { const r = el("div", "dev-row"); r.appendChild(el("span", "dev-label", label)); body.appendChild(r); return r; };
    const btn = (parent, text, fn) => { const b = el("button", "dev-btn", text); b.type = "button"; b.addEventListener("click", fn); parent.appendChild(b); return b; };

    const times = row("Giờ");
    [["Sáng sớm", 0.1], ["Sáng", 0.08], ["Chiều tàn", 0.42], ["Chạng vạng", 0.55], ["Canh hai", 0.66], ["Canh ba", 0.7], ["Rạng sáng", 0.45]].forEach(([n, d]) =>
      btn(times, n, () => { state.devDark = d; state.devTime = n; pushView(); }));
    btn(times, "Tự động", () => { state.devDark = null; state.devTime = null; pushView(); });

    const roles = row("Vai");
    ["monk", "ghost", "villager"].forEach((r) => btn(roles, ROLE_INFO[r].name, () => { if (state.role) leaveRole(); startRole(r); refreshDev(); }));

    const jump = row("Cảnh");
    const sel = el("select", "dev-select");
    jump.appendChild(sel);
    btn(jump, "Nhảy tới", () => {
      if (!state.role || !sel.value) return;
      closeFind(true); stopWatch();
      state.sceneId = sel.value;
      state.sceneOpen = false;
      const sc = currentScene();
      const place = World.PLACES[sc.place];
      World.setPlayer(place.x, place.y + 8);
      showWalkOrScene();
      sendPresence(true);
    });

    const data = row("Dữ liệu");
    btn(data, "Mở khóa hết", () => {
      state.completed = { monk: true, ghost: true, villager: true }; saveCompleted();
      ["c_non", "c_dep", "c_bat", "c_vo", "c_anh"].forEach(remember);
      Save.set(RUNS_KEY, "3");
      toast("Đã mở khóa: 3 vai xong, đủ 5 manh mối.");
    });
    btn(data, "Hiện hết vật", () => { state.devAllFinds = !state.devAllFinds; refreshFinds(); toast(state.devAllFinds ? "Hiện tất cả vật bị bỏ quên" : "Ẩn bớt theo số đêm"); });
    btn(data, "Xóa dữ liệu", () => {
      [STORE_KEY, MEM_KEY, RUNS_KEY, PROGRESS_KEY].forEach((k) => Save.remove(k));
      state.completed = {}; state.vars = new Set(); toast("Đã xóa dữ liệu đã lưu.");
    });

    const mind = row("Tâm và thẻ");
    btn(mind, "Khảo sát lại", () => Mind.dev.resetSurvey());
    btn(mind, "Tới chỗ chó", () => { if (state.role) { closeFind(true); state.leftScene = true; showWalkBar(); Mind.dev.dog(); } });
    btn(mind, "Tới chỗ sư", () => { if (state.role) { closeFind(true); state.leftScene = true; showWalkBar(); Mind.dev.sitNow(); } });
    btn(mind, "Gọi chư thiên", () => state.role && Mind.dev.deva());
    btn(mind, "Xem thẻ", () => Mind.openAlbum());
    btn(mind, "Xóa tâm", () => Mind.dev.wipe());

    const odd = row("Chuyện lạ, nơi chốn");
    const jumpTo = (key, dy = 40) => { const p = World.PLACES[key]; if (!state.role || !p) return; closeFind(true); state.leftScene = true; showWalkBar(); World.setPlayer(p.x, p.y + dy); };
    btn(odd, "Gốc gạo", () => jumpTo("gao", 60));
    btn(odd, "Bụi tre", () => jumpTo("bamboo", 60));
    btn(odd, "Ao sen", () => jumpTo("ao", 70));
    btn(odd, "Hang đá", () => jumpTo("hang", 70));
    btn(odd, "Tháp cổ", () => jumpTo("thap", 70));
    btn(odd, "Cổng làng", () => jumpTo("gate", 70));
    btn(odd, "Xe ngựa", () => window.Cart && Cart.spawn());
    btn(odd, "Xe sa lầy", () => window.Cart && Cart.stuck());
    btn(odd, "Cho đủ vật phẩm", () => { const S = Mind.kit.S; for (const id of ["mandarava", "den_nho", "rau_ma"]) if (!S.items.includes(id)) S.items.push(id); Mind.kit.save(); toast("Đã thêm hoa mạn-đà-la, ngọn đèn, rau má."); });

    const fx = row("Hiệu ứng");
    btn(fx, "Cú", () => window.dispatchEvent(new CustomEvent("owl", { detail: { pan: 0 } })));
    btn(fx, "Quạ", () => window.dispatchEvent(new CustomEvent("crow", { detail: { pan: 0, n: 3 } })));
    btn(fx, "Chó", () => NightAudio.dog());
    btn(fx, "Gà", () => NightAudio.rooster());
    btn(fx, "Nhà hoang", () => Room.open({ onPhoto() {}, onClose() {} }));
    btn(fx, "Vào tịnh thất", () => openRoom(FINDS.find((f) => f.id === "f_hermit"), "hermit"));
    btn(fx, "Dịch tới tịnh thất", () => {
      if (!state.role) return;
      const p = World.PLACES.hermitage;
      closeFind(true);
      state.leftScene = true;
      World.setPlayer(p.x, p.y + 36);
      showWalkBar();
    });

    function refreshDev() {
      sel.replaceChildren();
      if (!state.role) { sel.appendChild(el("option", null, "(chọn vai trước)")); sel.firstChild.value = ""; return; }
      for (const id of Object.keys(STORY[state.role].scenes)) {
        const o = el("option", null, `${id} · ${STORY[state.role].scenes[id].time}`);
        o.value = id; if (id === state.sceneId) o.selected = true;
        sel.appendChild(o);
      }
    }
    panel.append(toggle, body);
    $("app").appendChild(panel);
    refreshDev();
  }

  // ---------- info card: tap a person, NPC, place or thing on the map ----------
  // Shows only what this character has already found out (Discover). Nothing unmet is named.
  const INFO_DISC = { dog: "cho", monk: "su_gia", deva: "chu_thien", treegod: "tho_than", child: "be_na", peta: "ba_ngoai", earthgod: "dia_than" };
  const UNKNOWN_LINE = "Chưa biết gì nhiều về chỗ này.";
  function infoContent(hit) {
    if (hit.kind === "player") {
      const g = typeof hit.mood === "number" ? hit.mood : 0.5;
      const [r, gg, b] = World.moodRgb(g);
      return {
        title: hit.name,
        lines: [ROLE_INFO[hit.role] ? ROLE_INFO[hit.role].name : "", hit.pose === "sit" ? "Đang ngồi thiền." : "Đang đi quanh đây."],
        mood: { label: `Màu tâm của người này: ${moodLabel(g)}`, color: `rgb(${r},${gg},${b})` },
      };
    }
    if (hit.kind === "place") {
      const here = window.Discover ? Discover.entries().filter((e) => e.place === hit.id) : [];
      const known = here.find((e) => e.state === "seen") || here.find((e) => e.state === "heard");
      if (known) return { title: hit.name, lines: [known.state === "seen" ? known.hint : known.rumour] };
      const visited = window.Discover && Discover.placeState(hit.id).visited;
      return { title: hit.name, lines: [visited ? "Đã từng ghé qua đây." : UNKNOWN_LINE] };
    }
    if (hit.kind === "actor") {
      const id = INFO_DISC[hit.actorKind];
      const e = id && window.Discover ? Discover.entries().find((x) => x.id === id) : null;
      if (e && e.state === "seen") return { title: e.title, lines: [e.hint] };
      if (e && e.state === "heard") return { title: hit.name, lines: [e.rumour] };
      return { title: hit.name, lines: ["Chưa biết gì nhiều về người này."] };
    }
    return { title: hit.name, lines: ["Một thứ quen thuộc trong nghĩa địa."] };
  }
  // Where "Đi tới" walks: beside the thing, not on top of it.
  function infoSpot(hit) {
    if (hit.kind === "actor") return { x: hit.x + 26, y: hit.y + 6 };
    if (hit.kind === "player") return { x: hit.x + 24, y: hit.y + 6 };
    if (hit.kind === "place") return { x: hit.x, y: hit.y + 6 };
    return { x: hit.x, y: hit.y + 8 };
  }
  const infoScrim = el("div", "info-scrim");
  const infoCard = el("section", "info-card");
  infoScrim.hidden = true; infoCard.hidden = true;
  infoCard.setAttribute("aria-label", "Thông tin");
  $("app").append(infoScrim, infoCard);
  let openCard = null; // the hit whose card is showing; late profile answers for another card are dropped
  function closeInfoCard() { infoScrim.hidden = true; infoCard.hidden = true; openCard = null; }

  // Only other players have an info card for now, and it is two steps: tapping (or hovering, with a mouse) a
  // player shows a small "i" badge beside them; tapping the badge opens the card. Anything else just walks,
  // so a tap on a grave or a tree never throws a popup.
  const infoBadge = el("button", "info-badge", "i");
  infoBadge.type = "button"; infoBadge.hidden = true; infoBadge.setAttribute("aria-label", "Xem thông tin người này");
  $("app").appendChild(infoBadge);
  let badgeFor = null, badgeTimer = null, badgeHide = null;
  function placeBadge() {
    const pos = badgeFor && World.otherPos(badgeFor.id);
    if (!pos) { hideInfoBadge(); return; }
    const sp = World.screenPos(pos.x, pos.y);
    const r = $("world").getBoundingClientRect(), a = $("app").getBoundingClientRect();
    infoBadge.style.left = Math.round(r.left - a.left + sp.x + 14) + "px";
    infoBadge.style.top = Math.round(r.top - a.top + sp.y - 34) + "px";
  }
  function hideInfoBadge() { clearInterval(badgeTimer); clearTimeout(badgeHide); badgeTimer = null; badgeFor = null; infoBadge.hidden = true; }
  function showInfoBadge(hit, autoHideMs) {
    if (badgeFor && badgeFor.id === hit.id && !infoBadge.hidden) { clearTimeout(badgeHide); } else {
      badgeFor = hit; placeBadge(); infoBadge.hidden = false;
      clearInterval(badgeTimer); badgeTimer = setInterval(placeBadge, 100);
    }
    clearTimeout(badgeHide);
    badgeHide = setTimeout(hideInfoBadge, autoHideMs || 6000);
  }
  infoBadge.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!badgeFor) return;
    const hit = badgeFor; hideInfoBadge(); openInfoCard(hit);
  });
  // a mouse hovering over a player shows the badge too; it stays while the pointer is on the badge itself
  $("world").addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || !state.role) return;
    const r = $("world").getBoundingClientRect();
    const [wx, wy] = World.clientToWorld ? World.clientToWorld(e.clientX, e.clientY) : [null, null];
    if (wx == null) return;
    const hit = World.pick(wx, wy);
    if (hit && hit.kind === "player") showInfoBadge(hit, 2500);
  });
  infoScrim.addEventListener("click", closeInfoCard); // tapping outside the card closes it without walking
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !infoCard.hidden) closeInfoCard(); });
  // Block / report act on the account behind the player's character; the server answers by handle only.
  async function blockPlayer(hit) {
    if (!confirm(`Chặn “${hit.name}”? Hai bên sẽ không thấy hồ sơ hay gặp nhau nữa.`)) return;
    try { await Social.block(hit.handle); closeInfoCard(); toast("Đã chặn người này."); }
    catch { toast("Chưa chặn được, thử lại nhé."); }
  }
  async function reportPlayer(hit) {
    const raw = prompt("Điều gì khiến bạn báo cáo người này? Ghi ngắn gọn.");
    if (raw == null) return;
    const reason = [...raw.replace(/\s+/g, " ").trim()].slice(0, 200).join("");
    if (!reason) return;
    if (!confirm("Gửi báo cáo về người này?")) return;
    try { await Social.report(hit.handle, reason); closeInfoCard(); toast("Đã gửi báo cáo. Cảm ơn bạn."); }
    catch { toast("Chưa gửi được báo cáo, thử lại nhé."); }
  }
  // ---------- connections: the card's "Giữ kết nối", and the gold dots on the map ----------
  const CONN_NOTE = { quen: "Đã quen", luu: "Đã lưu", moi: "Người này muốn kết nối với bạn" };
  const isSaved = (level) => level === "luu" || level === "quen";
  // Only a signed-in viewer playing a saved character (never a guest) gets the connect row.
  const connCharId = () => (Save.signedIn() && Save.character() ? Save.character().id : null);
  // The row: the level as a small note, and one button that saves or unsaves.
  function paintConn(box, card, cid, level) {
    box.replaceChildren();
    if (CONN_NOTE[level]) box.appendChild(el("span", "info-line conn-note", CONN_NOTE[level]));
    const btn = el("button", "pill", isSaved(level) ? "Bỏ kết nối" : "Giữ kết nối"); btn.type = "button";
    btn.addEventListener("click", () => changeConn(card, cid, box, level));
    box.appendChild(btn);
  }
  async function changeConn(card, cid, box, level) {
    const hit = card.hit;
    const was = isSaved(level);
    box.querySelector("button").disabled = true;
    try {
      const r = was ? await Social.disconnect(cid, hit.handle) : await Social.connect(cid, hit.handle);
      level = r.level || null;
      toast(was ? `Đã bỏ kết nối với ${hit.name}.` : level === "quen" ? `Đã quen với ${hit.name}.` : `Đã giữ kết nối với ${hit.name}.`);
    } catch (e) {
      toast(Social.connectErrorText(e));
      if (openCard === card) paintConn(box, card, cid, level);
      return;
    }
    refreshQuen();
    if (openCard === card) paintConn(box, card, cid, level);
  }
  // Loads the current level of this person for the open card; a failed load just shows no row.
  function loadConn(card, box, cid) {
    Social.connections(cid).then((d) => {
      if (openCard !== card) return;
      const row = (d.connections || []).find((r) => r.handle === card.hit.handle);
      paintConn(box, card, cid, row ? row.level : null);
    }).catch(() => {});
  }
  // Gold dots on the map: connections who are online now and have a status (a null status never gets a dot).
  async function refreshQuen() {
    const cid = connCharId();
    if (!cid) { World.setQuen(new Set()); return; }
    try {
      const d = await Social.connections(cid);
      if (connCharId() !== cid) return; // the character changed while this was loading
      World.setQuen(new Set((d.connections || []).filter((r) => r.level === "quen" && r.status && r.status.online).map((r) => r.handle)));
    } catch { /* keep the dots we have */ }
  }
  setInterval(refreshQuen, 45000);

  function openInfoCard(hit) {
    const c = infoContent(hit);
    const body = [el("p", "info-title", c.title)];
    for (const t of c.lines) if (t) body.push(el("p", "info-line", t));
    if (c.mood) {
      const line = el("p", "info-line");
      const dot = el("span", "info-dot");
      dot.style.background = c.mood.color;
      line.append(dot, c.mood.label);
      body.push(line);
    }
    // a signed-in player's public profile (guests and unknown players get nothing extra)
    const card = { hit };
    openCard = card;
    const cid = hit.kind === "player" && hit.handle ? connCharId() : null;
    if (cid) {
      const connBox = el("div", "info-conn");
      body.push(connBox);
      loadConn(card, connBox, cid);
    }
    if (hit.kind === "player" && hit.handle) {
      const slot = el("div", "info-slot");
      body.push(slot);
      Social.fetchPublic(hit.handle).then((data) => {
        if (openCard !== card || infoCard.hidden) return;
        slot.replaceChildren(...Social.publicNodes(Social.profileView(data)));
      }).catch(() => {});
    }
    const close = el("button", "pill", "Đóng"); close.type = "button";
    const go = el("button", "primary", "Đi tới"); go.type = "button";
    const spot = infoSpot(hit);
    close.addEventListener("click", closeInfoCard);
    go.addEventListener("click", () => { closeInfoCard(); state.findTarget = null; World.walkTo(spot.x, spot.y); });
    const actions = el("div", "info-actions");
    actions.append(close, go);
    if (hit.kind === "player" && hit.handle && Save.signedIn()) {
      const more = el("div", "info-more");
      const block = el("button", "text-btn", "Chặn"); block.type = "button";
      const report = el("button", "text-btn", "Báo cáo"); report.type = "button";
      block.addEventListener("click", () => blockPlayer(hit));
      report.addEventListener("click", () => reportPlayer(hit));
      more.append(block, report);
      body.push(more);
    }
    infoCard.replaceChildren(...body, actions);
    infoScrim.hidden = false; infoCard.hidden = false;
    close.focus({ preventScroll: true });
  }

  // ---------- boot ----------
  // fromKey: the keyboard (desktop) is walking; same rules as a tap on the ground, except it never snaps to a nearby find.
  const onWorldTap = (x, y, fromKey) => {
    if (!state.role) return;
    if (fromKey) { closeInfoCard(); hideInfoBadge(); }
    state.sideTarget = null;
    if (state.findOpen || Mind.isOpen()) return;
    // a tap on someone or something opens its card instead of walking (while a story sheet is open, the tap folds it first)
    if (!fromKey && !(state.sceneOpen && !$("sheet").classList.contains("collapsed"))) {
      const hit = World.pick(x, y);
      if (hit && hit.kind === "player") { showInfoBadge(hit); return; }
      hideInfoBadge();
    }
    if (state.sceneOpen) {
      // tapping the world while reading folds the sheet so the scene is visible
      if (!$("sheet").classList.contains("collapsed")) { setCollapsed(true); return; }
      // sheet already folded: tapping the ground steps out of the story to wander (a lying-around thing is walked to)
      const near = fromKey ? null : nearestFind(x, y);
      state.leftScene = true;
      showWalkBar();
      state.findTarget = near;
      if (near) World.walkTo(near.x, near.y + 8); else World.walkTo(x, y, fromKey);
      return;
    }
    const hit = fromKey ? null : nearestFind(x, y);
    state.findTarget = hit;
    if (hit) World.walkTo(hit.x, hit.y + 8); else World.walkTo(x, y, fromKey);
  };
  World.init($("world"), onWorldTap);

  $("walk-btn").addEventListener("click", () => {
    const sc = currentScene();
    if (!sc) return;
    state.findTarget = null;
    const place = targetPlace();
    World.walkTo(place.x, place.y + 6);
  });
  $("sheet-handle").addEventListener("click", () => setCollapsed(!$("sheet").classList.contains("collapsed")));
  $("explore").addEventListener("click", () => { wander(); toast("Bạn có thể đi dạo khắp nơi. Nút Nhiệm vụ cho biết việc đang chờ."); });

  // ---------- quest panel: what is waiting, and a way back ----------
  function renderQuest() {
    const sc = currentScene();
    if (!sc) return;
    const place = World.PLACES[sc.place];
    $("quest-title").textContent = state.detour ? "Đi tịnh thất đọc kinh" : sc.end ? "Đêm đã xong" : `Đi tới ${place.name}`;
    const first = (sc.lines || []).find((l) => typeof l === "string") || "";
    $("quest-body").textContent = state.detour
      ? `Thầy đang đi về ${World.PLACES[state.detour.place].name} để đọc vài trang kinh. Đọc xong thầy quay lại ${place.name}, nơi câu chuyện đang chờ.`
      : sc.end ? "Câu chuyện đêm nay đã khép lại." : `${sc.time}. ${first.length > 160 ? first.slice(0, 157) + "…" : first}`;
    $("quest-go").hidden = !!sc.end;
    $("quest-go").textContent = state.detour ? "Đưa tôi tới tịnh thất" : "Đưa tôi tới đó";
    const low = monkLow() && !state.detour;
    $("quest-tip").hidden = !low;
    $("quest-tip").textContent = "Lòng thầy đang xao động, thiếu vững tin. Trong tịnh thất có kệ kinh và bàn thờ Đức Phật; đọc vài trang có thể giúp tâm vững lại.";
    $("quest-tip-go").hidden = !low;
    $("quest-cancel").hidden = !state.detour;
    $("quest-save").hidden = Save.signedIn() || !(Save.me().google || Save.me().devLogin);
    // every errand and rumour that is open right now, each with a way there
    const sides = Mind.questList();
    $("quest-side").hidden = !sides.length;
    const box = $("quest-side-list"); box.replaceChildren();
    for (const q of sides.slice(0, 6)) {
      const item = el("div", "side-item");
      item.appendChild(el("p", "quest-title side", q.title));
      item.appendChild(el("p", "hint", q.body));
      if (q.x != null) {
        const go = el("button", "pill", "Đưa tôi tới đó"); go.type = "button";
        go.addEventListener("click", () => { $("quest-panel").hidden = true; goTo(q.x, q.y); });
        item.appendChild(go);
      }
      box.appendChild(item);
    }
  }
  // ---------- discovery book: unknown → heard of → met ----------
  let questTab = "tasks";
  function setQuestTab(t) {
    questTab = t;
    $("qtab-tasks").setAttribute("aria-pressed", String(t === "tasks"));
    $("qtab-book").setAttribute("aria-pressed", String(t === "book"));
    $("quest-tasks").hidden = t !== "tasks";
    $("quest-book").hidden = t !== "book";
    if (t === "book") renderBook();
  }
  function renderBook() {
    if (!window.Discover) return;
    const box = $("quest-book"); box.replaceChildren();
    const { seen, total } = Discover.count();
    box.appendChild(el("p", "book-progress", `Đã khám phá ${seen}/${total}`));
    const bar = el("div", "book-bar"); const fill = el("span"); fill.style.width = (seen / total) * 100 + "%"; bar.appendChild(fill); box.appendChild(bar);
    box.appendChild(el("p", "hint", "Ô có dấu ? là điều còn chưa biết. Bắt chuyện với người qua đường để nghe thêm tin đồn."));
    const grid = el("div", "book-grid");
    for (const e of Discover.entries()) {
      const item = el("div", "book-item " + e.state);
      const place = World.PLACES[e.place];
      if (e.state === "unknown") {
        item.appendChild(el("b", null, "?"));
        item.appendChild(el("p", null, e.hint));
      } else {
        item.appendChild(el("b", null, e.title));
        item.appendChild(el("p", null, e.state === "seen" ? `Đã gặp · ${place ? place.name : ""}` : e.hint));
        if (e.state === "heard") {
          item.appendChild(el("small", "book-tag", "Nghe đồn"));
          if (e.condText.length) item.appendChild(el("small", "book-conds", e.condText.join(" · ")));
          if (place) {
            const go = el("button", "text-btn", `Tới ${place.name}`); go.type = "button";
            go.addEventListener("click", () => { $("quest-panel").hidden = true; goTo(place.x, place.y + 34); });
            item.appendChild(go);
          }
        }
      }
      grid.appendChild(item);
    }
    box.appendChild(grid);
  }
  $("qtab-tasks").addEventListener("click", () => setQuestTab("tasks"));
  $("qtab-book").addEventListener("click", () => setQuestTab("book"));
  $("quest-login").addEventListener("click", () => {
    if (Save.me().google) { Save.flush().finally(() => { location.href = "/auth/google"; }); return; }
    $("quest-panel").hidden = true; leaveRole(); toast("Đăng nhập thử ở màn hình chọn vai, rồi lưu lần chơi này thành nhân vật.");
  });

  // walk somewhere outside the story (the pending scene keeps waiting)
  function goTo(x, y) {
    if (state.sceneOpen) wander();
    else state.leftScene = true;
    if ($("walk-bar").hidden && !state.sceneOpen) showWalkBar();
    state.findTarget = null;
    state.sideTarget = { x, y, t: Date.now() }; // walking to a side errand: passing the story's place does not reopen it
    World.walkTo(x, y);
  }
  const isDev = new URLSearchParams(location.search).has("dev") && !(window.APP_CONFIG && window.APP_CONFIG.dev === false);
  Mind.init({
    swingMood, toast, goTo,
    refresh: () => pushView(),
    sound: () => state.soundOn,
    darkness: () => currentDarkness(currentScene()),
    mood: () => moodValue(),
    dev: () => isDev,
    emit: (topic) => post("/api/emit", { topic }),
    setPose: (p) => { state.mindPose = p; pushView(); sendPresence(true); },
    day: () => (state.cp && state.cp.day) || 1,
    busy: () => uiBusy(),
  });

  // ---------- promises kept and village memory ----------
  // Something is on screen that a story beat should not talk over.
  function uiBusy() {
    return !!state.findOpen || !$("room").hidden || !$("picker").hidden || !$("map-panel").hidden || !$("cards-panel").hidden ||
      (state.sceneOpen && !$("sheet").classList.contains("collapsed"));
  }
  const NEAR_PROMISE = 90, NEAR_VILLAGE = 110;
  const distTo = (pt) => { const p = World.getPlayer(); return Math.hypot(p.x - pt.x, p.y - pt.y); };
  function keepPromiseNow(h) {
    state.cp = NightReflect.keepPromise(state.cp);
    lastCpJson = ""; saveProgress();
    Save.log(`Lời hẹn hôm qua đã đến, ở ${NightReflect.PLACE_LABEL[h.place] || "đây"}.`);
    Mind.kit.showSheet({
      label: "Lời hẹn hôm qua", lines: h.payoff,
      choices: [{ label: "Tiếp tục", primary: true, fn: () => Mind.kit.closeSheet() }],
    });
    try { window.Milestones && Milestones.notify("promise", {}); } catch {}
  }
  function villageSay(n) {
    const p = Mind.parts.actors().find((a) => a.kind === n.npc);
    if (p) { World.say("npc:" + n.npc, n.text, "villager"); return; }
    Mind.kit.showSheet({ label: n.who, lines: [n.text], choices: [{ label: "Tiếp tục", primary: true, fn: () => Mind.kit.closeSheet() }] });
  }
  function memoryTick() {
    if (!state.role || !state.cp || Mind.isOpen() || uiBusy() || document.querySelector(".reflect, .ms-reveal")) return;
    const due = window.NightReflect && NightReflect.promiseDue(state.cp);
    const here = (key) => World.PLACES[key] && distTo(World.PLACES[key]) <= NEAR_PROMISE;
    if (due && here(due.place)) return keepPromiseNow(due);
    if (!window.Village || state.role === "ghost") return;
    const day = state.cp.day || 1;
    for (const key of Village.places()) {
      if (!World.PLACES[key] || distTo(World.PLACES[key]) > NEAR_VILLAGE) continue;
      const n = Village.next(key, day, state.role);
      if (n) return villageSay(n);
    }
  }
  setInterval(memoryTick, 1000);
  function openQuest() {
    renderQuest();
    if (window.Discover) { const c = Discover.count(); $("book-count").textContent = `${c.seen}/${c.total}`; }
    setQuestTab(questTab);
    $("quest-panel").hidden = false;
  }
  $("quest-btn").addEventListener("click", () => ($("quest-panel").hidden ? openQuest() : ($("quest-panel").hidden = true)));
  $("quest-close").addEventListener("click", () => ($("quest-panel").hidden = true));
  $("quest-go").addEventListener("click", () => {
    const place = targetPlace();
    if (!place) return;
    $("quest-panel").hidden = true;
    if (state.sceneOpen) wander();
    state.findTarget = null;
    World.walkTo(place.x, place.y + 6);
  });
  $("quest-tip-go").addEventListener("click", () => {
    $("quest-panel").hidden = true;
    startDetour("hermitage");
    const p = World.PLACES.hermitage; World.walkTo(p.x, p.y + 6);
  });
  $("quest-cancel").addEventListener("click", () => { $("quest-panel").hidden = true; endDetour("Bỏ chuyến đọc kinh. Thầy quay lại chỗ cũ."); });
  $("sound-toggle").addEventListener("click", () => toggleSound());
  const roleGesture = () => state.role && gesture(ROLE_INFO[state.role].gesture.topic, false);
  $("gesture").addEventListener("click", roleGesture);
  $("gesture-walk").addEventListener("click", roleGesture);
  $("leave").addEventListener("click", leaveRole);
  $("traces-btn").addEventListener("click", () => ($("traces-panel").hidden = false));
  $("traces-close").addEventListener("click", () => ($("traces-panel").hidden = true));

  // arrival + presence loop
  setInterval(() => {
    if (state.role && !state.sceneOpen && !state.findOpen && !Mind.isOpen()) {
      const t = state.findTarget;
      if (t) {
        const p = World.getPlayer();
        if (Math.hypot(p.x - t.x, p.y - (t.y + 8)) <= FIND_DIST) { openFind(t); }
      } else if (state.sideTarget) {
        const p = World.getPlayer();
        if ((!p.moving && Date.now() - state.sideTarget.t > 800) || Math.hypot(p.x - state.sideTarget.x, p.y - state.sideTarget.y) < 20) state.sideTarget = null;
      } else if (!state.detour) {
        const d = distanceToPlace();
        if (state.leftScene && d > ARRIVE_DIST + 40) state.leftScene = false; // walked away: arriving again reopens the scene
        else if (!state.leftScene && d <= ARRIVE_DIST) openScene();
      }
    }
    // Stood still for a while with a destination waiting? Nudge toward it (chevrons in the world, pulsing button).
    const pp = World.getPlayer();
    const nudge = !!state.role && !state.sceneOpen && !state.findOpen && !state.findTarget && !pp.moving &&
      !$("walk-bar").hidden && $("map-panel").hidden && $("chat-panel").hidden && Date.now() - state.lastTouch > IDLE_HINT_MS;
    if (nudge !== state.nudging) {
      state.nudging = nudge;
      World.setView({ hint: nudge });
      $("walk-btn").classList.toggle("nudge", nudge);
    }
    sendPresence(false);
  }, 200);

  // keep the checkpoint fresh while walking, and write it just before the page goes away
  setInterval(saveProgress, 2000);
  const saveNow = () => { lastPosAt = 0; saveProgress(); Save.flush(true); };
  window.addEventListener("pagehide", saveNow);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveNow(); });

  // save status: one toast when it turns unsynced, one when it recovers; a line in the profile header
  const STATUS_TEXT = { saved: "Đã lưu", saving: "Đang lưu…", offline: "Chưa đồng bộ" };
  let wasOffline = false;
  Save.onStatus((s) => {
    const line = $("save-status");
    if (line) line.textContent = STATUS_TEXT[s];
    if (s === "offline" && !wasOffline) { wasOffline = true; toast("Chưa lưu được, sẽ thử lại khi có mạng."); }
    else if (s === "saved" && wasOffline) { wasOffline = false; toast("Đã lưu lại."); }
  });
  if ($("save-status")) $("save-status").textContent = STATUS_TEXT[Save.status()];

  // any touch, click or key counts as "still playing" and hides the hint
  const touch = () => { state.lastTouch = Date.now(); };
  ["pointerdown", "keydown"].forEach((ev) => window.addEventListener(ev, touch, true));
  setInterval(renderTraces, 60000);

  // ---------- desktop: keyboard walking, shortcuts, hint (see also the desktop section of style.css) ----------
  (function desktopKeys() {
    const held = new Set();
    let keyTimer = null, keyWalking = false;
    const DIRS = { w: [0, -1], arrowup: [0, -1], s: [0, 1], arrowdown: [0, 1], a: [-1, 0], arrowleft: [-1, 0], d: [1, 0], arrowright: [1, 0] };
    const typing = (el) => !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
    const modalOpen = () => !$("map-panel").hidden || !$("cards-panel").hidden || !$("traces-panel").hidden;
    const blocked = () => !state.role || !$("picker").hidden || !$("room").hidden || !$("card-reveal").hidden || modalOpen() || Mind.isOpen() || !!state.findOpen;
    function stepKeys() {
      if (!held.size || blocked()) { if (!held.size) stopKeys(); return; }
      let dx = 0, dy = 0;
      held.forEach((k) => { dx += DIRS[k][0]; dy += DIRS[k][1]; });
      if (!dx && !dy) { if (keyWalking) { World.stop(); keyWalking = false; } return; }
      const n = Math.hypot(dx, dy), p = World.getPlayer();
      keyWalking = true;
      onWorldTap(p.x + (dx / n) * 70, p.y + (dy / n) * 70, true);
    }
    function stopKeys() {
      clearInterval(keyTimer); keyTimer = null; held.clear();
      if (keyWalking) { keyWalking = false; World.stop(); }
    }
    const CLOSERS = ["map-close", "cards-close", "traces-close", "mind-info-close", "quest-close", "chat-close"];
    const PANELS = ["map-panel", "cards-panel", "traces-panel", "mind-info", "quest-panel", "chat-panel"];
    function closeTop() {
      for (let i = 0; i < PANELS.length; i++) if (!$(PANELS[i]).hidden) { $(CLOSERS[i]).click(); return true; }
      return false;
    }
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
      if (typing(e.target)) { if (k === "escape") { if (e.target.id === "chat-input") openChat(false); else e.target.blur(); } return; }
      if (k === "escape") { if (closeTop()) e.preventDefault(); return; }
      if (!state.role || !$("picker").hidden || !$("room").hidden || !$("card-reveal").hidden) return;
      if (k in DIRS) {
        e.preventDefault();
        if (e.repeat && held.has(k)) return;
        held.add(k);
        if (!keyTimer) { keyTimer = setInterval(stepKeys, 120); }
        stepKeys();
      } else if (k === "m") { e.preventDefault(); if ($("map-panel").hidden) { if (!modalOpen()) openMap(); } else closeMap(); }
      else if (k === "enter" && e.target.tagName !== "BUTTON" && !$("chat-btn").hidden) { e.preventDefault(); openChat(true); }
      else if (k === "+" || k === "=") World.zoomBy(1.25);
      else if (k === "-" || k === "_") World.zoomBy(0.8);
    });
    window.addEventListener("keyup", (e) => {
      const k = e.key.toLowerCase();
      if (!held.delete(k)) return;
      if (!held.size) stopKeys(); else stepKeys();
    });
    window.addEventListener("blur", stopKeys);

    // small dismissible hint, only where there is a keyboard and a mouse
    const hint = $("kbd-hint");
    if (!hint || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let dismissed = false;
    try { dismissed = localStorage.getItem("kbdHintDismissed") === "1"; } catch {}
    $("kbd-hint-close").addEventListener("click", () => {
      dismissed = true; hint.hidden = true;
      try { localStorage.setItem("kbdHintDismissed", "1"); } catch {}
    });
    setInterval(() => { hint.hidden = dismissed || !state.role || !$("picker").hidden; }, 800);
  })();

  renderPicker();
  connect();
  Save.refresh().then(() => {
    state.completed = loadCompleted();
    if (!state.role) renderPicker();
    const login = new URLSearchParams(location.search).get("login");
    if (login) {
      toast(login === "ok" ? "Đã đăng nhập. Nhân vật của bạn ở màn hình chọn vai." : login === "cancelled" ? "Đã hủy đăng nhập." : "Đăng nhập chưa thành công, thử lại nhé.");
      const u = new URL(location.href); u.searchParams.delete("login"); history.replaceState(null, "", u);
    }
  });
})();
