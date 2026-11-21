// Hidden mind model (a game simulation, not a measure of a real mind), mental-factor cards,
// the "dog bite" quest chain and visits from heavenly beings. See docs/he-thong-tam.md.
window.Mind = (() => {
  const KEY = "dhutanga.mind";
  const SIM_NOTE = "Mô phỏng giản lược để chơi. Hãy hỏi thầy để hiểu đúng.";
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a = 1, b = 99) => Math.max(a, Math.min(b, v));

  // ---------- cards (mental factors) ----------
  // Faces open one by one each time the player meets the factor again.
  // Definitions follow the Abhidhamma commentaries (characteristic, function, manifestation, proximate cause);
  // all of it still needs review by a Theravāda teacher.
  const CARDS = {
    san: {
      name: "Sân", good: false, pali: "dosa", plain: "Cái nóng trong lòng khi bị trái ý.",
      tip: "Khi nóng lên, thử biết “nóng, nóng” rồi thở một hơi.", where: "Có lẽ gặp ở ngõ làng.",
      cure: { card: "khong_san", text: "Không sân là pháp đối trị của Sân. Lần tới khi nóng lên, thử làm dịu nó: rửa vết thương, nói một lời hiền." },
      faces: [["Đặc tính", "Hung bạo, dữ dội."], ["Phận sự", "Lan ra như thuốc độc, đốt cháy chính chỗ nó nương."], ["Biểu hiện", "Làm hư hỏng, phá hoại."], ["Nhân gần", "Đối tượng gây bực bội."]],
    },
    hoi_han: {
      name: "Hối hận", good: false, pali: "kukkucca", plain: "Ray rứt về điều mình đã làm.",
      tip: "Biết mình đang hối, rồi làm điều tốt tiếp theo.", where: "Có lẽ gặp sau một lúc nóng giận.",
      cure: { card: "niem", text: "Đừng nuôi ray rứt. Sửa điều còn sửa được, rồi trở về với hơi thở: đó là Niệm." },
      faces: [["Đặc tính", "Hối tiếc sau khi làm."], ["Phận sự", "Sầu muộn về việc đã làm và chưa làm."], ["Biểu hiện", "Ăn năn."], ["Nhân gần", "Việc đã làm và việc chưa làm."]],
    },
    tham: {
      name: "Tham", good: false, pali: "lobha", plain: "Muốn giữ lấy cho mình.",
      tip: "Thấy mình muốn giữ, thử cho đi một chút.", where: "Có lẽ gặp khi có thứ ngon trong tay.",
      cure: { card: "khong_tham", text: "Không tham là pháp đối trị của Tham. Thử cho đi một thứ mình đang giữ." },
      faces: [["Đặc tính", "Nắm giữ đối tượng, như nhựa bẫy khỉ."], ["Phận sự", "Bám dính, như thịt bỏ vào chảo nóng."], ["Biểu hiện", "Không chịu buông."], ["Nhân gần", "Thấy thích thú nơi những gì trói buộc mình."]],
    },
    khong_san: {
      name: "Không sân", good: true, pali: "adosa", plain: "Lòng dịu lại, không chống đối.",
      tip: "Làm một việc tốt cho người vừa làm mình giận.", where: "Có lẽ gặp khi làm lành với ai đó.",
      faces: [["Đặc tính", "Không hung bạo, không chống đối."], ["Phận sự", "Dập tắt bực bội, làm dịu cơn nóng."], ["Biểu hiện", "Dễ chịu, hiền hòa như trăng rằm."], ["Nhân gần", "(đang chờ thầy duyệt)"]],
    },
    khong_tham: {
      name: "Không tham", good: true, pali: "alobha", plain: "Cho đi mà không tiếc.",
      tip: "Cho một món nhỏ, rồi để ý lòng mình nhẹ ra sao.", where: "Có lẽ gặp khi đem thứ gì đó cho người khác.",
      faces: [["Đặc tính", "Tâm không bám đối tượng, như giọt nước trên lá sen."], ["Phận sự", "Không chiếm giữ."], ["Biểu hiện", "Không dính mắc."], ["Nhân gần", "(đang chờ thầy duyệt)"]],
    },
    niem: {
      name: "Niệm", good: true, pali: "sati", plain: "Biết rõ điều đang xảy ra, ngay lúc này.",
      tip: "Khi tâm chạy đi đâu đó, chỉ cần biết 'à, mình vừa chạy đi', rồi quay về hơi thở.", where: "Có lẽ gặp khi ngồi yên với một vị sư.",
      faces: [["Đặc tính", "Không trôi nổi, không lướt qua đối tượng."], ["Phận sự", "Không quên."], ["Biểu hiện", "Canh giữ, đối diện với đối tượng."], ["Nhân gần", "Tưởng vững chắc, hoặc bốn niệm xứ."]],
    },
    hy: {
      name: "Hỷ", good: true, pali: "pīti", plain: "Niềm vui làm thân tâm nhẹ bổng.",
      tip: "Vui thì biết mình đang vui, không cần giữ lại.", where: "Có lẽ gặp vào một đêm rất đẹp.",
      faces: [["Đặc tính", "Ưa thích."], ["Phận sự", "Làm thân tâm sảng khoái."], ["Biểu hiện", "Phấn chấn."], ["Nhân gần", "Danh và sắc."]],
    },
  };
  Object.assign(CARDS, {
    bon_xen: {
      name: "Bỏn xẻn", good: false, pali: "macchariya", plain: "Tiếc của, không muốn chia cho ai.",
      tip: "Khi thấy mình tiếc, thử chia một phần nhỏ thôi.", where: "Có lẽ gặp ở nghĩa địa, nơi có người đói lâu năm.",
      cure: { card: "khong_tham", text: "Cho đi là pháp đối trị của Bỏn xẻn. Thử chia phần mình cho người đang đói." },
      faces: [["Đặc tính", "Che giấu điều mình có hoặc sẽ có."], ["Phận sự", "Không chịu để người khác cùng có."], ["Biểu hiện", "Co rút lại, keo kiệt."], ["Nhân gần", "Điều tốt của chính mình."]],
    },
    bi: {
      name: "Bi", good: true, pali: "karuṇā", plain: "Thấy người khổ thì muốn giúp họ bớt khổ.",
      tip: "Thấy ai khổ, làm một việc nhỏ cho họ đỡ hơn.", where: "Có lẽ gặp khi có ai đó đang khóc.",
      faces: [["Đặc tính", "Muốn làm vơi khổ của người khác."], ["Phận sự", "Không đành lòng trước khổ của người khác."], ["Biểu hiện", "Không làm hại."], ["Nhân gần", "Thấy người khổ không nơi nương tựa."]],
    },
    tuy_hy: {
      name: "Tùy hỷ", good: true, pali: "muditā", plain: "Vui theo niềm vui, điều tốt của người khác.",
      tip: "Thấy ai được điều tốt, thử vui cùng họ một chút.", where: "Có lẽ gặp ở nơi rất xa, rất sáng.",
      faces: [["Đặc tính", "Vui mừng với thành tựu của người khác."], ["Phận sự", "Không ganh tị."], ["Biểu hiện", "Dứt bỏ bất mãn."], ["Nhân gần", "Thấy thành tựu của người khác."]],
    },
  });
  Object.assign(CARDS, {
    dinh: {
      name: "Định (chú tâm ổn định)", good: true, pali: "ekaggatā", plain: "Trong buổi tập, tâm ít rời đề mục hơn.",
      tip: "Đừng cố nắm giữ cảm giác yên. Khi biết tâm đi xa, nhẹ nhàng quay về.",
      where: "Có thể học khi đã nhiều lần thực hành ngồi thiền chủ động.",
      faces: [["Đặc tính", "Hướng tâm vào một đối tượng."], ["Phận sự", "Giúp các pháp đồng sinh không tán loạn."], ["Biểu hiện", "Sự ổn định trên đối tượng."], ["Nhân gần", "Cần đối chiếu chú giải theo ngữ cảnh."]],
    },
    si: {
      name: "Si", good: false, pali: "moha", plain: "Không thấy rõ điều đang xảy ra trong một tình huống.",
      tip: "Dừng lại, nhìn bằng chứng; không cần tự trách.",
      where: "Có thể gặp khi một hiểu lầm được soi sáng.",
      cure: { card: "niem", text: "Ghi nhận điều chưa thấy rõ, rồi xem lại tình huống từng bước." },
      faces: [["Đặc tính", "Mờ tối trước đối tượng."], ["Phận sự", "Che lấp sự hiểu rõ."], ["Biểu hiện", "Không nhận ra điều đang diễn ra."], ["Nhân gần", "Cần thầy duyệt theo chú giải."]],
    },
    phong_dat: {
      name: "Phóng dật", good: false, pali: "uddhacca", plain: "Tâm bất thiện xao động, khó ở yên.",
      tip: "Nhận ra lao xao, không cố đuổi nó đi.",
      where: "Gặp khi truyện cho thấy tâm bị xao động theo một hướng bất thiện.",
      cure: { card: "niem", text: "Biết tâm đang lao xao, trở về với điều đang làm." },
      faces: [["Đặc tính", "Không yên ổn."], ["Phận sự", "Làm tâm xao động."], ["Biểu hiện", "Tâm không đứng vững."], ["Nhân gần", "Cần thầy duyệt theo chú giải."]],
    },
    hon_tram: {
      name: "Hôn trầm", good: false, pali: "thīna", plain: "Tâm trì trệ, thiếu sức sống khi thực hành.",
      tip: "Thử đứng dậy kinh hành, rửa mặt rồi tiếp tục.",
      where: "Có thể gặp khi tâm chìm xuống trong buổi tập.",
      cure: { card: "niem", text: "Nhận ra sự chìm xuống, thử đổi sang kinh hành phù hợp." },
      faces: [["Đặc tính", "Tâm thiếu linh hoạt."], ["Phận sự", "Làm giảm sự hăng hái."], ["Biểu hiện", "Trì trệ."], ["Nhân gần", "Cần thầy duyệt."]],
    },
    hoai_nghi: {
      name: "Hoài nghi", good: false, pali: "vicikicchā", plain: "Sự phân vân ngăn người này tiếp tục việc đang làm.",
      tip: "Ghi câu hỏi lại, tìm hiểu với thầy; rồi trở lại thực hành.",
      where: "Gặp khi sự lưỡng lự thực sự làm gián đoạn một buổi tập.",
      cure: { card: "niem", text: "Ghi nhận phân vân và tìm hiểu đúng chỗ, không chụp mũ mọi câu hỏi là bất thiện." },
      faces: [["Đặc tính", "Phân vân."], ["Phận sự", "Làm dao động quyết định."], ["Biểu hiện", "Không giải quyết được hướng đi."], ["Nhân gần", "Cần thầy duyệt."]],
    },
  });
  const CARD_ORDER = ["dinh", "si", "phong_dat", "hon_tram", "hoai_nghi", "san", "hoi_han", "tham", "bon_xen", "khong_san", "khong_tham", "niem", "hy", "bi", "tuy_hy"];

  // ---------- temperaments (Visuddhimagga, ch. III) ----------
  const CARITA = {
    tham: { name: "ưa cái đẹp, thích gọn gàng", frame: { tin: [40, 58], tan: [35, 52], niem: [28, 42], dinh: [30, 48], tue: [30, 48], tham: [52, 70], san: [20, 34], si: [24, 38] } },
    san: { name: "hăng hái, nhanh nhẹn, hơi nóng tính", frame: { tin: [30, 45], tan: [52, 70], niem: [28, 42], dinh: [22, 36], tue: [35, 50], tham: [24, 38], san: [52, 70], si: [22, 36] }, dinhMul: 0.8 },
    si: { name: "thong thả, dễ trôi theo", frame: { tin: [32, 48], tan: [24, 38], niem: [18, 30], dinh: [28, 44], tue: [24, 38], tham: [30, 44], san: [24, 38], si: [52, 70] }, niemMul: 0.6 },
    tam: { name: "hay suy tính, nghĩ nhiều", frame: { tin: [28, 42], tan: [36, 52], niem: [24, 38], dinh: [18, 32], tue: [40, 56], tham: [26, 40], san: [26, 40], si: [36, 50] }, niemMul: 0.8 },
    tin: { name: "dễ tin, dễ cảm động", frame: { tin: [56, 74], tan: [36, 52], niem: [28, 42], dinh: [32, 48], tue: [24, 38], tham: [34, 48], san: [20, 34], si: [26, 40] } },
    tri: { name: "thích hiểu rõ, hay xét đoán", frame: { tin: [24, 38], tan: [38, 54], niem: [32, 46], dinh: [32, 48], tue: [56, 74], tham: [22, 36], san: [28, 42], si: [18, 30] } },
  };
  // Frame for someone who has not taken the survey yet: no temperament name, every value near the middle.
  const NEUTRAL_FRAME = { tin: [34, 48], tan: [34, 48], niem: [26, 40], dinh: [26, 40], tue: [30, 44], tham: [28, 42], san: [24, 38], si: [26, 40] };
  const GOOD = [["tin", "Tín"], ["tan", "Tấn"], ["niem", "Niệm"], ["dinh", "Định"], ["tue", "Tuệ"]];
  const BAD = [["tham", "Tham"], ["san", "Sân"], ["si", "Si"]];

  // ---------- saved state ----------
  function fresh() { return { carita: null, stats: null, surveySkipped: false, cards: {}, quest: { step: "start", hit: false }, q: {}, items: [], deva: { pity: 0, last: 0, seen: 0 }, milestones: {}, msCounts: {}, village: { deeds: {} } }; }
  function load() {
    try { const s = JSON.parse(Save.get(KEY) || "null"); if (s && s.cards) return { ...fresh(), ...s }; } catch {}
    return fresh();
  }
  // Older saves lack the milestone maps.
  const ensure = () => { if (!S.q) S.q = {}; if (!S.milestones) S.milestones = {}; if (!S.msCounts) S.msCounts = {}; if (!S.village) S.village = {}; if (!S.village.deeds) S.village.deeds = {}; };
  let S = load();
  ensure();
  const save = () => Save.set(KEY, JSON.stringify(S));

  let api = null;          // callbacks from app.js
  let role = null;
  let open = false;        // a mind card / survey / reveal is on screen
  let cooldownUntil = 0;
  const fx = { devaAt: null, devaT: 0, flowers: [], remote: [] };

  // ---------- stats ----------
  function rollStats(carita) {
    const f = (CARITA[carita] && CARITA[carita].frame) || NEUTRAL_FRAME, st = {};
    for (const k of Object.keys(f)) st[k] = Math.round(rand(f[k][0], f[k][1]));
    return st;
  }
  // Gains shrink as the value rises: easy at first, slower near the top.
  function grow(k, amount) {
    const v = S.stats[k];
    const step = amount > 0 ? amount * (1 - v / 120) : amount * (0.4 + v / 140);
    S.stats[k] = Math.round(clamp(v + step) * 10) / 10;
  }
  // understanding a card (how many faces are open) makes it work better
  const understanding = (id) => Math.min(4, Math.max(0, ((S.cards[id] && S.cards[id].n) || 0) - 1));
  function bias() {
    if (!S.stats) return 0;
    const g = (S.stats.tin + S.stats.niem + S.stats.tue) / 3, b = (S.stats.tham + S.stats.san + S.stats.si) / 3;
    return Math.max(-0.08, Math.min(0.08, (g - b) / 400));
  }

  // ---------- generic card sheet ----------
  function showSheet({ label, lines, choices, body }) {
    open = true;
    World.stop();
    const card = $("mind-card");
    card.hidden = false;
    $("mind-label").textContent = label || "";
    const box = $("mind-lines"); box.replaceChildren();
    (lines || []).forEach((t, i) => { const p = el("p", null, t); p.style.animationDelay = i * 0.3 + "s"; box.appendChild(p); });
    const extra = $("mind-extra"); extra.replaceChildren();
    if (body) extra.appendChild(body);
    const ch = $("mind-choices"); ch.replaceChildren();
    for (const c of choices || []) {
      const b = el("button", c.primary ? "primary" : "choice", c.label);
      b.type = "button";
      if (c.tag) b.appendChild(el("span", "tag", c.tag));
      b.addEventListener("click", c.fn);
      ch.appendChild(b);
    }
  }
  function closeSheet() {
    $("mind-card").hidden = true;
    open = false;
    cooldownUntil = Date.now() + 2500;
    api && api.refresh();
  }

  // ---------- awarding a card ----------
  const MS = () => window.Milestones;
  function award(id, context, then) {
    const def = CARDS[id];
    const prev = S.cards[id];
    const step = MS().rules.cardStep(def, prev ? prev.n : 0);
    if (step.show) {
      S.cards[id] = { n: step.n, seen: [...(prev ? prev.seen : []), context].slice(-6) };
      save();
      Save.log(step.understood ? `Đã hiểu thẻ ${def.name}.` : step.n === 1 ? `Gặp thẻ ${def.name} lần đầu.` : `Gặp lại thẻ ${def.name} (lần ${step.n}).`);
      syncCardsBtn();
    }
    // Milestones wait until the card popup is closed and the story callback has run.
    const got = MS().notify("card", { id, n: step.n, good: def.good, understood: step.understood }, { quiet: true });
    const after = () => {
      if (then) then(); else if ($("mind-card").hidden) { cooldownUntil = Date.now() + 2500; api && api.refresh(); }
      if (got.length) MS().reveal(got);
    };
    if (!step.show) return after();
    showCard(id, { fresh: step.n === 1, opened: step.opened, understood: step.understood, context, then: after });
  }

  function cardNode(id, opts = {}) {
    const def = CARDS[id], R = MS().rules;
    const own = opts.own || S.cards[id] || { n: 0, seen: [] };
    const n = R.effN(def, own.n), done = R.isUnderstood(def, own.n);
    const c = el("article", "mcard " + (def.good ? "good" : "bad") + (done ? " understood" : ""));
    c.appendChild(el("div", "mcard-kind", def.good ? "Tâm đang tu" : "Tâm để hiểu"));
    if (done) c.appendChild(el("span", "mcard-badge", "Đã hiểu"));
    const cz = window.Cetasika && Cetasika.byGame(id);
    const hero = el("div", "cz-hero" + (opts.draw ? " cz-reveal" : ""));
    if (cz) hero.style.setProperty("--tint", glowOf(cz));
    hero.innerHTML = window.CetasikaArt ? CetasikaArt.svg(id, 110) : "";
    if (hero.innerHTML) c.appendChild(hero);
    c.appendChild(el("h3", "mcard-name", def.name));
    if (cz) {
      if (cz.name !== def.name) c.appendChild(el("p", "cz-chartname", `Trong bảng Vi Diệu Pháp: ${cz.name}`));
      c.appendChild(feelingLine(cz));
      if (n >= 2) c.appendChild(el("p", "cz-group", Cetasika.groupLine(cz)));
    }
    c.appendChild(el("p", "mcard-plain", def.plain));
    if (opts.context) c.appendChild(el("p", "mcard-ctx", "Lúc nãy: " + opts.context));
    c.appendChild(el("p", "mcard-tip", def.tip));
    const faces = el("dl", "mcard-faces");
    def.faces.forEach(([h, t], i) => {
      const at = R.faceUnlockN(def, i), unlocked = n >= at;
      const dt = el("dt", unlocked ? null : "locked", h);
      const dd = el("dd", unlocked ? null : "locked", unlocked ? t : `Gặp thêm ${at - n} lần để mở`);
      if (opts.opened && at === opts.opened + 1) { dt.classList.add("new"); dd.classList.add("new"); }
      faces.append(dt, dd);
    });
    c.appendChild(faces);
    if (n >= (def.good ? 5 : 3)) c.appendChild(el("p", "mcard-pali", `Tên Pāli: ${def.pali}`));
    if (done && def.cure) c.appendChild(cureNode(def, opts.owned || S.cards));
    if (n > 1) c.appendChild(el("p", "mcard-count", `Người này đã gặp ${def.name} ${n} lần: ${own.seen.slice(-3).map(shortCtx).join("; ")}.`));
    c.appendChild(el("p", "mcard-note", SIM_NOTE));
    return c;
  }
  // "Đi cùng cảm giác: vui (thọ hỷ) · bình thản (thọ xả)": plain words first, the term in brackets.
  function feelingLine(cz) {
    const p = el("p", "cz-feel");
    p.appendChild(el("span", "cz-feel-lead", "Đi cùng cảm giác: "));
    Cetasika.ORDER.filter((k) => cz.feelings.includes(k)).forEach((k, i) => {
      const f = Cetasika.FEELINGS[k];
      if (i) p.appendChild(el("span", "cz-sep", " · "));
      const w = el("span", "cz-feel-item");
      const dot = el("i", "cz-dot cz-" + k); dot.setAttribute("aria-hidden", "true");
      w.append(dot, document.createTextNode(`${f.plain} (${f.name.toLowerCase()})`));
      p.appendChild(w);
    });
    return p;
  }
  // Antidote line: the wholesome card that softens this one, and where to meet it if not yet owned.
  function cureNode(def, owned) {
    const good = CARDS[def.cure.card], box = el("div", "mcard-cure");
    box.appendChild(el("p", null, def.cure.text));
    box.appendChild(el("p", "mcard-cure-card", `Thẻ đối trị: ${good.name}` + (owned[def.cure.card] ? "." : `. Chưa gặp thẻ này. ${good.where}`)));
    return box;
  }
  const shortCtx = (s) => s.split(/[,.]/)[0].replace(/^(Bạn|Người này) /, "").toLowerCase();

  // Item helpers: S.items stays an array of id strings.
  function giveItem(id) {
    if (S.items.includes(id)) return false;
    S.items.push(id);
    Save.log(`Nhận vật phẩm: ${(window.Items && Items.def(id) && Items.def(id).name) || id}.`);
    return true;
  }
  function dropItem(id) { S.items = S.items.filter((x) => x !== id); }
  // Show the "item received" popup (if the item is new), then continue.
  function gotItem(id, then) {
    if (window.Items && Items.def(id)) { open = true; Items.showReceived(id, () => { open = !$("mind-card").hidden; if (then) then(); }); }
    else if (then) then();
  }

  function showCard(id, { fresh, opened, understood, context, then, own, owned } = {}) {
    open = true;
    const wrap = $("card-reveal");
    wrap.hidden = false;
    $("card-reveal-label").textContent = fresh ? "Bạn nhận được một thẻ mới" : understood ? "Đã hiểu thẻ này" : opened ? "Gặp lại, hiểu thêm một chút" : "Thẻ tâm sở";
    const slot = $("card-reveal-slot"); slot.replaceChildren(cardNode(id, { context, opened, own, owned, draw: !!(fresh || opened) }));
    slot.firstChild.classList.add("flip");
    $("card-reveal-ok").onclick = () => {
      wrap.hidden = true;
      open = !$("mind-card").hidden;
      if (then) then(); else if ($("mind-card").hidden) { cooldownUntil = Date.now() + 2500; api && api.refresh(); }
    };
    if (api && api.sound()) NightAudio.bell(0.5);
  }

  // ---------- survey: temperament from how you do small things ----------
  function survey(done) {
    const score = { tham: 0, san: 0, si: 0, tam: 0, tin: 0, tri: 0 };
    const pick = (k, v = 2) => { score[k] += v; };
    // 1. a choice about a situation (the answer, not the speed of tapping, shows temperament)
    step1();

    function step1() {
      showSheet({
        label: "Khảo sát tính cách",
        lines: ["Sân chùa đầy lá. Sư nhờ bạn quét giúp.", "Bạn thường làm thế nào?"],
        choices: [
          ["Quét thật kỹ từng góc, khó dừng tay", "tham"], ["Quét thật nhanh cho xong, hơi gắt tay", "san"], ["Quét lơ đãng, chỗ này chỗ kia", "si"],
          ["Quét một lúc rồi nghĩ ra việc khác, bỏ dở", "tam"], ["Quét chậm, lòng thấy trang nghiêm", "tin"], ["Chia sân từng khu, làm lần lượt", "tri"],
        ].map(([label, k]) => ({ label, fn: () => { pick(k); step2(); } }))
          .concat([{ label: "Để sau", fn: () => { S.surveySkipped = true; save(); closeSheet(); } }]),
      });
    }

    function step2() {
      showSheet({
        label: "Khảo sát tính cách",
        lines: ["Bên đường có một bông hoa vừa nở."],
        choices: [
          ["Đứng ngắm thật lâu", "tham"], ["Thấy một cánh đã héo", "san"], ["Đi qua, không để ý", "si"],
          ["Hái dâng lên Phật", "tin"], ["Nghĩ: rồi nó cũng tàn", "tri"], ["Tự hỏi hoa tên gì, từ đâu tới", "tam"],
        ].map(([label, k]) => ({ label, fn: () => { pick(k); step3(); } })),
      });
    }
    function step3() {
      showSheet({
        label: "Khảo sát tính cách",
        lines: ["Có người mời bạn một bát cơm. Trong cơm lẫn vài hạt sạn."],
        choices: [
          ["Ăn ngon, xin thêm bát nữa", "tham"], ["Nhăn mặt vì hạt sạn", "san"], ["Ăn mà không biết mùi vị", "si"],
          ["Chắp tay cảm ơn người nấu", "tin"], ["Ăn vừa đủ để sống", "tri"], ["Nghĩ xem gạo này ở đâu tới", "tam"],
        ].map(([label, k]) => ({ label, fn: () => { pick(k); result(); } })),
      });
    }
    function result() {
      const top = Math.max(...Object.values(score));
      const best = Object.keys(score).filter((k) => score[k] === top);
      const carita = best[Math.floor(Math.random() * best.length)];
      const roll = rollStats(carita);
      if (!S.carita && S.stats) {
        // first survey: the neutral numbers already shown in play are averaged with the new frame, not replaced
        for (const k of Object.keys(roll)) S.stats[k] = Math.round(((S.stats[k] ?? roll[k]) + roll[k]) / 2);
      } else if (!S.stats) S.stats = roll;
      // retaking the survey only changes the label; the numbers stay as they are
      S.carita = carita;
      save();
      showSheet({
        label: "Tính cách của người này",
        lines: [`Người này thiên về tính ${CARITA[carita].name}.`, "Mỗi người một khác, và tính cách có thể đổi dần theo cách người này sống trong game.", "Các chỉ số tâm trong game là mô phỏng để chơi, không phải thước đo tâm thật."],
        choices: [
          { label: "Xong", primary: true, fn: () => { closeSheet(); done && done(); } },
          { label: "Làm lại", fn: () => survey(done) },
        ],
      });
    }
  }

  // ---------- places and actors ----------
  const P = () => World.PLACES;
  const DOG = () => ({ x: P().village.x + 34, y: P().village.y - 46 });
  const MONK_SPOT = () => ({ x: P().graves.x - 54, y: P().graves.y + 30 });
  const questOn = () => role === "monk" || role === "villager";
  const villageArrival = () => role === "villager" && !!api?.villagerArrival?.();
  const eveningPractice = () => villageArrival() && api.darkness() >= 0.5 &&
    (api.storyDay() >= 4 || !!S.village.deeds.granny_herbs);
  const canSitWithElder = (step) => villageArrival() && api.darkness() >= 0.5 &&
    (["monk", "sit"].includes(step) || (["start", "again"].includes(step) && eveningPractice()));

  function actors() {
    const list = [];
    if (!role) return list;
    const st = S.quest.step;
    if (questOn()) {
      const d = DOG();
      list.push({ kind: "dog", x: d.x, y: d.y, facing: -1,
        angry: !villageArrival() && (st === "start" || st === "again"),
        label: st === "done" || st === "deva" || S.quest.friend || S.q.villagerWeek?.dog ? "con Vàng" : "" });
      list.push({ kind: "granny", x: P().well.x + 22, y: P().well.y + 8, facing: -1, label: "bà cụ" });
      if (["monk", "sit", "deva", "done"].includes(st) || canSitWithElder(st)) { const m = MONK_SPOT(); list.push({ kind: "monk", x: m.x, y: m.y, label: "sư già" }); }
    }
    for (const m of modules) if (m.actors) try { list.push(...m.actors()); } catch (e) { console.error(e); }
    if (fx.devaAt) list.push({ kind: "deva", x: fx.devaAt.x, y: fx.devaAt.y - 6, alpha: Math.min(1, fx.devaT / 1.6) * (fx.devaFade == null ? 1 : fx.devaFade), label: fx.devaT > 1.6 ? "chư thiên" : "" });
    return list;
  }
  function syncActors() { World.setActors(actors()); }

  // What the side quest is waiting for (also used by the Nhiệm vụ panel and the marker).
  function target() {
    if (!questOn()) return null;
    const st = S.quest.step;
    if (st === "well") return { ...P().well, name: "Giếng làng", title: "Ra giếng rửa vết cắn", body: "Vết chó cắn còn rát. Ở giếng làng có bà cụ đang múc nước." };
    if (st === "herb") return { ...P().mit, name: "Gốc mít", title: "Hái rau má ở gốc mít", body: "Bà cụ nhờ hái một nắm rau má ở gốc mít cuối làng." };
    if (st === "deliver") return { ...P().well, name: "Giếng làng", title: "Mang rau về cho bà cụ", body: "Bà cụ vẫn đứng chờ ở giếng làng." };
    if (villageArrival() && (canSitWithElder(st) || st === "deva")) {
      return { ...MONK_SPOT(), name: "Sư già", title: "Ghé chỗ vị sư ở nghĩa địa", body: "Có thể ghé ngồi với thầy hoặc đi dạo tiếp." };
    }
    if (st === "monk" && !villageArrival()) return { x: MONK_SPOT().x + 30, y: MONK_SPOT().y + 4, name: "Sư già", title: "Ghé chỗ vị sư ở nghĩa địa", body: "Giữa các ngôi mộ có một vị sư già ngồi yên. Hình như thầy đang đợi ai." };
    return null;
  }
  function questInfo() {
    const t = target();
    if (!t) return null;
    return { title: t.title, body: t.body, x: t.x, y: t.y };
  }
  // Every errand currently open (the dog chain plus the ones registered by encounters.js).
  function questList() {
    const out = [];
    const t = target();
    if (t) out.push({ title: t.title, body: t.body, x: t.x, y: t.y, name: t.name });
    if (role) for (const m of modules) if (m.targets) try { out.push(...m.targets()); } catch (e) { console.error(e); }
    // the temperament survey is an optional errand, listed last until it is taken
    if (role && !S.carita) out.push({ title: "Khảo sát tính cách (không bắt buộc)", body: S.surveySkipped ? "Đã để sau. Muốn làm lúc nào cũng được." : "Vài việc nhỏ để biết Người này thiên về tính nào. Làm lúc nào cũng được, bỏ qua cũng không sao.", survey: true, skipped: !!S.surveySkipped });
    return out;
  }
  function startSurvey() { S.surveySkipped = false; save(); survey(() => {}); }
  function skipSurvey() { S.surveySkipped = true; save(); }

  // ---------- the dog bite chain ----------
  function bite() {
    S.quest.bites = (S.quest.bites || 0) + 1; save();
    if (api.sound()) NightAudio.dog();
    api.swingMood(-0.3);
    const again = S.quest.step === "again";
    showSheet({
      label: "Ở ngõ làng",
      lines: again ? ["Con chó nhà ông Tư lại sủa ầm lên, đớp vào gót chân bạn.", "Lòng nóng bừng như lần trước."] : ["Con chó nhà ông Tư lao ra, cắn vào chân bạn.", "Đau nhói. Lòng nóng bừng lên."],
      choices: [
        { label: "Nhặt gậy đánh lại", fn: () => {
          grow("san", 4); S.quest.hit = true; S.quest.step = "well"; save();
          api.swingMood(-0.15);
          if (api.sound()) NightAudio.dog();
          showSheet({ label: "Ở ngõ làng", lines: ["Con chó kêu ăng ẳng, chạy vào nhà.", "Ông Tư chạy ra quát. Người này quát lại.", "Đi được một đoạn, lòng người này chùng xuống."], choices: [{ label: "Tiếp", fn: () => {
            closeSheet();
            award(S.cards.hoi_han ? "san" : "hoi_han", S.cards.hoi_han ? "Người này nổi nóng, đánh con chó nhà ông Tư." : "Người này đánh con chó rồi thấy lòng chùng xuống, ray rứt.", () => { cooldownUntil = Date.now() + 2500; api.toast("Vết cắn còn rát. Ra giếng làng rửa đi."); api.refresh(); });
          } }] });
        } },
        { label: "Bỏ đi, lòng còn ấm ức", fn: () => {
          grow("san", 2); S.quest.step = "again"; S.quest.againAt = Date.now() + 60000; save();
          closeSheet();
          award("san", "Người này bị chó cắn, nóng lên rồi bỏ đi, lòng còn ấm ức.", () => { cooldownUntil = Date.now() + 2500; api.toast("Lần sau đi qua ngõ này, con chó vẫn ở đó."); api.refresh(); });
        } },
        { label: "Ra giếng rửa vết thương", tag: "Đi tới giếng làng", fn: () => {
          grow("san", 1); S.quest.step = "well"; save();
          closeSheet();
          award("san", "Người này bị chó cắn, nóng lên, rồi chọn đi rửa vết thương.", () => { cooldownUntil = Date.now() + 2500; api.goTo(P().well.x, P().well.y + 14); api.refresh(); });
        } },
      ],
    });
  }

  function atWell() {
    showSheet({
      label: "Giếng làng",
      lines: ["Bà cụ múc nước, rửa vết cắn giúp bạn.", "“Gốc mít cuối làng có rau má. Hái giúp bà một nắm nhé.”"],
      choices: [
        { label: "Đi hái rau", primary: true, fn: () => { S.quest.step = "herb"; save(); closeSheet(); api.goTo(P().mit.x, P().mit.y + 18); } },
        { label: "Để lúc khác", fn: closeSheet },
      ],
    });
  }

  function atMit() {
    const area = el("div", "sweep herbs");
    let left = 6;
    for (let i = 0; i < 6; i++) {
      const b = el("button", "herb");
      b.type = "button";
      b.setAttribute("aria-label", "Nhánh rau má");
      b.style.left = rand(6, 86) + "%";
      b.style.top = rand(10, 70) + "%";
      b.addEventListener("click", () => {
        if (b.dataset.done) return; b.dataset.done = "1"; b.classList.add("picked"); left--;
        if (!left) setTimeout(picked, 400);
      });
      area.appendChild(b);
    }
    showSheet({ label: "Gốc mít", lines: ["Rau má mọc quanh gốc mít.", "Chạm để hái từng nhánh."], body: area, choices: [] });
    function picked() {
      if (giveItem("rau_ma")) { save(); closeSheet(); gotItem("rau_ma", picked2); return; }
      picked2();
    }
    function picked2() {
      showSheet({
        label: "Gốc mít",
        lines: ["Được một nắm rau má xanh mướt."],
        choices: [
          { label: "Mang về cho bà cụ", fn: () => { S.quest.step = "deliver"; S.quest.to = "granny"; save(); closeSheet(); api.goTo(P().well.x, P().well.y + 14); } },
          { label: "Giữ lại nấu canh", fn: () => {
            S.quest.step = "monk"; save();
            closeSheet();
            cooldownUntil = Date.now() + 2500; api.toast("Trên đường về, người này thấy có ánh đèn giữa nghĩa địa."); api.refresh();
          } },
        ],
      });
    }
  }

  // The herbs always go to the grandmother at the well. (Older saves with quest.to === "tu" are treated the same way.)
  function deliver() {
    grow("tham", -2 * rand(0.8, 1.2));
    api.swingMood(0.22);
    showSheet({
      label: "Giếng làng",
      lines: ["Bà cụ cười móm mém, nhận nắm rau.", "“Lành thay, con.”"],
      choices: [{ label: "Tiếp", fn: () => {
        S.quest.step = "monk"; dropItem("rau_ma"); deed("granny_herbs"); save(); closeSheet();
        afterGift();
      } }],
    });
  }
  // village memory: the day comes from the app; a deed is remembered from the next night on
  const deed = (id) => { try { window.Village && Village.record(id, villageArrival() ? api.storyDay() : api?.day?.() || 1); } catch (e) { console.error(e); } };
  function afterGift() { cooldownUntil = Date.now() + 2500; api.toast("Trời tối dần. Giữa nghĩa địa có một vị sư đang ngồi."); api.refresh(); }

  function atMonk() {
    showSheet({
      label: "Giữa các ngôi mộ",
      lines: ["Một vị sư già ngồi yên giữa các ngôi mộ.", "“Ngồi với thầy một lát?”"],
      choices: [
        { label: "Ngồi xuống", primary: true, fn: sit },
        { label: "Để sau", fn: closeSheet },
      ],
    });
  }

  // ---------- sitting: fill the orb ----------
  const THOUGHTS = [["Vết cắn còn nhức", "nhức"], ["Nhớ con chó", "nhớ"], ["Mùi cơm ở làng", "ngửi"], ["Muỗi đốt", "ngứa"], ["Lời ông Tư", "nghĩ"], ["Tiếng cú ở xa", "nghe"], ["Mình làm vậy có đúng không?", "nghĩ"], ["Chân bắt đầu tê", "tê"]];
  let sitTimer = null;
  function sit() {
    const sittingState = S;
    S.quest.step = "sit"; save(); syncActors();
    if (!S.stats) { S.stats = rollStats(S.carita); save(); }
    const st = S.stats, car = CARITA[S.carita] || {};
    const luck = rand(0.85, 1.2);
    // seconds to fill, roughly 55 to 110 depending on the person (simulation)
    const rate = ((0.75 + st.niem / 110) * (car.niemMul || 1) * (1 - st.san / 260) * (1 - st.si / 320) * luck) / 70;
    let fill = 0, secs = 0, noted = 0, lost = 0, spawned = 0;
    let lastInterruption = 0, longestStable = 0;
    const observedKinds = [];
    const box = el("div", "sit");
    const orb = el("div", "orb-meter");
    const water = el("div", "orb-water");
    orb.appendChild(water);
    const field = el("div", "thoughts");
    const info = el("div", "watch-note", "Theo dõi hơi thở. Ý nghĩ trôi tới thì chạm để ghi nhận.");
    const clock = el("div", "sit-clock", "0:00");
    box.append(field, orb, clock, info);
    const pool = THOUGHTS.filter(([line]) => !villageArrival() || S.quest.bites || line !== "Vết cắn còn nhức")
      .sort(() => Math.random() - 0.5);
    const spawn = () => {
      const [text, kind] = pool[spawned++ % pool.length];
      const b = el("button", "thought", text);
      b.type = "button";
      b.style.left = rand(4, 44) + "%";
      b.addEventListener("click", () => {
        if (b.dataset.done) return;
        b.dataset.done = "1"; noted++; observedKinds.push(kind); fill = Math.min(1, fill + 0.05);
        b.classList.add("noted"); b.textContent = `${kind}, ${kind}…`;
        info.textContent = "Ghi nhận. Quay về hơi thở.";
        setTimeout(() => b.remove(), 1100);
      });
      field.appendChild(b);
      setTimeout(() => { if (!b.dataset.done && b.isConnected) { lost++; lastInterruption = secs; fill = Math.max(0, fill - 0.035); info.textContent = "Vừa trôi theo ý nghĩ một lúc. Biết vậy là đủ, quay về."; } b.remove(); }, 8600);
    };
    const choices = [{ label: "Đứng dậy", fn: () => { stopSit(); S.quest.step = "monk"; if (villageArrival()) S.sitInterrupted = true; save(); closeSheet(); api.toast("Người này đứng dậy sớm. Lần sau thử ngồi lâu hơn một chút."); } }];
    if (api.dev()) choices.push({ label: "Tua (dev)", fn: () => { fill = 1; } });
    showSheet({ label: "Ngồi với sư", lines: ["Thầy nói khẽ: “Cứ biết hơi thở. Tâm chạy đi đâu thì biết là nó đang chạy, rồi dắt nó về.”"], body: box, choices });
    api.setPose("sit");
    spawn();
    sitTimer = setInterval(() => {
      secs++;
      longestStable = Math.max(longestStable, secs - lastInterruption);
      fill = Math.min(1, fill + rate);
      water.style.height = Math.round(fill * 100) + "%";
      orb.classList.toggle("full", fill >= 1);
      clock.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
      if (secs % 5 === 0) spawn();
      if (fill >= 1) {
        stopSit();
        setTimeout(() => {
          if (role && S === sittingState && S.quest.step === "sit") sitDone({ noted, lost, longestStable, kinds: observedKinds });
        }, 900);
      }
    }, 1000);
  }
  function stopSit() { clearInterval(sitTimer); sitTimer = null; api.setPose(null); }
  function sitDone({ noted, lost, longestStable, kinds }) {
    const sessions = (S.practiceSessions || 0) + 1;
    S.practiceSessions = sessions;
    if (villageArrival() && lost > 0) S.sitInterrupted = true;
    const result = PracticeRules.selectMeditationCard({ noted, lost, longestStable, practicedSessions: sessions, kinds });
    if (noted >= 1) grow("niem", Math.min(2, noted * 0.5));
    if (result.card === "dinh") grow("dinh", 1.5);
    // No assumed insight / reduction of delusion from simply filling a progress orb.
    api.swingMood(0.35);
    S.quest.step = "deva"; deed("sat_with_monk"); save();
    showSheet({
      label: "Ngồi với sư",
      lines: [`Người này đã ghi nhận xao lãng ${noted} lần; bỏ lỡ ${lost} lần.`, result.reason, "Quả cầu đầy chỉ đánh dấu hết buổi tập, không phải chứng nhận định hay chứng đắc."],
      choices: [{ label: "Mở mắt", primary: true, fn: () => {
        closeSheet();
        if (result.card) award(result.card, result.reason, () => devaVisit(MONK_SPOT(), true));
        else { cooldownUntil = Date.now() + 2500; devaVisit(MONK_SPOT(), true); }
      } }],
    });
  }

  // ---------- heavenly visitor ----------
  const DEVA_LINES = [
    "“Lành thay. Lòng không giận là ngọn đèn giữa đêm.”",
    "“Xưa tôi chỉ dâng một ngọn đèn ở chùa làng. Việc thiện nhỏ cũng không mất đi đâu.”",
    "“Đêm nay gió lặng. Ai ngồi yên sẽ nghe được tiếng lá rơi.”",
    "“Cứ biết từng hơi thở. Đường còn dài, mà mỗi bước đều quý.”",
  ];
  function devaVisit(spot, fromChain) {
    open = true;
    const at = { x: spot.x - 34, y: spot.y - 8 };
    fx.devaAt = at; fx.devaT = 0; fx.devaFade = null;
    fx.flowers = Array.from({ length: 46 }, () => ({ x: at.x + rand(-170, 170), y: at.y - rand(120, 520), v: rand(16, 34), s: rand(2.4, 4.4), p: rand(0, 6), c: Math.random() < 0.5 ? "255,236,240" : "255,214,150" }));
    S.deva.seen++; S.deva.pity = 0; S.deva.last = Date.now(); save();
    Save.log("Gặp chư thiên.");
    MS().notify("deva", {}); // shown once the visit's sheets close
    World.lookAt(at.y - 30, at.x);
    if (api.sound()) { NightAudio.bell(1); setTimeout(() => NightAudio.bell(0.6), 1400); }
    api.emit("deva");
    syncActors();
    const line = fromChain ? DEVA_LINES[0] : DEVA_LINES[1 + Math.floor(Math.random() * (DEVA_LINES.length - 1))];
    setTimeout(() => {
      showSheet({
        label: "Có chư thiên ghé thăm",
        lines: ["Ánh sáng tỏa khắp khu rừng. Hoa từ trên trời rơi xuống.", line, fromChain ? "Vị ấy để lại cho bạn một bông hoa mạn-đà-la." : ""].filter(Boolean),
        choices: [
          { label: "Chắp tay", primary: true, fn: () => {
            const newFlower = fromChain && giveItem("mandarava");
            grow("tin", 3 * rand(0.8, 1.2));
            if (fromChain) S.quest.step = "done";
            save();
            api.swingMood(0.3);
            closeSheet(); open = true;
            const finish = () => { devaLeave(); open = false; cooldownUntil = Date.now() + 2500; api.refresh(); };
            award("hy", fromChain ? "Thấy chư thiên hoan hỷ vì việc người này làm, lòng người này cũng vui lên." : "Một đêm đẹp, chư thiên ghé qua, lòng người này vui lên.", newFlower ? () => gotItem("mandarava", finish) : finish);
          } },
          { label: "Xem tâm vị ấy", fn: devaMind },
          { label: "Lưu khoảnh khắc", fn: () => saveMoment(line) },
        ],
      });
    }, 1800);
  }
  function devaMind() {
    const b = window.Beings && Beings.of("chu_thien");
    if (b) return beingMind(b.sheet, b.line, b.bars, b.why, devaVisitSheetBack);
    beingMind("Tâm của vị chư thiên", "Vị này tâm sáng, ít giận, thường vui.", [["Không tham", 82, true], ["Không sân", 90, true], ["Không si", 70, true], ["Tham", 14, false], ["Sân", 6, false], ["Si", 22, false]], "Theo kinh điển Phật giáo, chư thiên sinh lên cõi trời nhờ việc thiện đời trước, như bố thí, giữ giới.", devaVisitSheetBack);
  }
  function devaVisitSheetBack() {
    const fromChain = S.quest.step === "deva";
    showSheet({
      label: "Có chư thiên ghé thăm",
      lines: ["Vị ấy vẫn đứng đó, mỉm cười."],
      choices: [
        { label: "Chắp tay", primary: true, fn: () => {
          const newFlower = fromChain && giveItem("mandarava");
          grow("tin", 3 * rand(0.8, 1.2));
          if (fromChain) S.quest.step = "done";
          save(); api.swingMood(0.3);
          closeSheet(); open = true;
          const finish = () => { devaLeave(); open = false; cooldownUntil = Date.now() + 2500; api.refresh(); };
          award("hy", "Thấy chư thiên hoan hỷ, lòng người này cũng vui lên.", newFlower ? () => gotItem("mandarava", finish) : finish);
        } },
        { label: "Lưu khoảnh khắc", fn: () => saveMoment(DEVA_LINES[0]) },
      ],
    });
  }
  function devaLeave() {
    let k = 1;
    const t = setInterval(() => { k -= 0.04; fx.devaFade = Math.max(0, k); syncActors(); if (k <= 0) { clearInterval(t); fx.devaAt = null; fx.flowers = []; syncActors(); } }, 80);
    World.resetLook();
  }
  // Save a picture of the moment with a caption band.
  function saveMoment(line, title = "Gặp chư thiên") {
    const src = World.snapshot();
    if (!src) return api.toast("Chưa lưu được ảnh.");
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height + Math.round(img.width * 0.22);
      const g = c.getContext("2d");
      g.fillStyle = "#0c1211"; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0);
      const fs = Math.round(img.width * 0.04);
      g.fillStyle = "#e6c56f"; g.font = `600 ${fs * 1.2}px "Cormorant Garamond", serif`; g.textAlign = "center";
      g.fillText(title, c.width / 2, img.height + fs * 1.6);
      g.fillStyle = "#dcd5c5"; g.font = `italic ${fs * 0.8}px "Literata", serif`;
      g.fillText(line.replace(/[“”]/g, ""), c.width / 2, img.height + fs * 3, c.width * 0.92);
      g.fillStyle = "#8d9189"; g.font = `${fs * 0.6}px "Be Vietnam Pro", sans-serif`;
      g.fillText("Một Đêm Đầu Đà", c.width / 2, img.height + fs * 4.3);
      const a = document.createElement("a");
      a.href = c.toDataURL("image/jpeg", 0.9);
      a.download = "khoanh-khac-chu-thien.jpg";
      document.body.appendChild(a); a.click(); a.remove();
      api.toast("Đã lưu ảnh khoảnh khắc.");
    };
    img.src = src;
  }
  // Someone nearby met a deva: everyone sees a column of light there for a while.
  function remote(nx, ny) { fx.remote.push({ x: nx * World.W, y: ny * World.H, t: 0 }); }

  // ---------- drawing on top of the world ----------
  let lastFx = 0;
  function drawFx(ctx, v) {
    const dt = lastFx ? Math.min(0.05, v.time - lastFx) : 0.016; lastFx = v.time;
    if (fx.devaAt) {
      fx.devaT += dt;
      const a = fx.devaAt, k = Math.min(1, fx.devaT / 1.4) * (fx.devaFade == null ? 1 : fx.devaFade) * (1 - 0.55 * v.dayMix);
      ctx.globalCompositeOperation = "lighter";
      // column of light from the sky
      const col = ctx.createLinearGradient(a.x, v.camY - 40, a.x, a.y);
      col.addColorStop(0, `rgba(255,240,200,0)`); col.addColorStop(0.6, `rgba(255,236,190,${0.14 * k})`); col.addColorStop(1, `rgba(255,236,190,${0.26 * k})`);
      ctx.fillStyle = col;
      const w = 34 + Math.sin(v.time * 2) * 4;
      ctx.beginPath(); ctx.moveTo(a.x - w * 0.4, v.camY - 40); ctx.lineTo(a.x + w * 0.4, v.camY - 40); ctx.lineTo(a.x + w * 1.6, a.y); ctx.lineTo(a.x - w * 1.6, a.y); ctx.closePath(); ctx.fill();
      // rays around the figure
      for (let i = 0; i < 12; i++) {
        const ang = i * Math.PI / 6 + v.time * 0.15;
        const len = 90 + Math.sin(v.time * 1.5 + i) * 20;
        ctx.strokeStyle = `rgba(255,230,170,${0.12 * k})`; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(a.x + Math.cos(ang) * 22, a.y - 40 + Math.sin(ang) * 22); ctx.lineTo(a.x + Math.cos(ang) * len, a.y - 40 + Math.sin(ang) * len); ctx.stroke();
      }
      const glow = ctx.createRadialGradient(a.x, a.y - 30, 0, a.x, a.y - 30, 160);
      glow.addColorStop(0, `rgba(255,236,190,${0.22 * k})`); glow.addColorStop(1, "rgba(255,236,190,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(a.x, a.y - 30, 160, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      // falling mandārava flowers
      const fk = Math.min(1, fx.devaT / 1.4) * (fx.devaFade == null ? 1 : fx.devaFade);
      for (const f of fx.flowers) {
        f.y += f.v * dt; f.p += dt * 2; const fxx = f.x + Math.sin(f.p) * 10;
        if (f.y > a.y + 40) { f.y = a.y - rand(260, 520); f.x = a.x + rand(-170, 170); }
        if (f.y < v.camY - 20) continue;
        ctx.fillStyle = `rgba(${f.c},${0.85 * fk})`;
        for (let j = 0; j < 5; j++) { const pa = j * 1.2566 + f.p * 0.4; ctx.beginPath(); ctx.ellipse(fxx + Math.cos(pa) * f.s * 0.7, f.y + Math.sin(pa) * f.s * 0.7, f.s * 0.6, f.s * 0.35, pa, 0, 7); ctx.fill(); }
        ctx.fillStyle = `rgba(255,200,90,${0.9 * fk})`; ctx.beginPath(); ctx.arc(fxx, f.y, f.s * 0.28, 0, 7); ctx.fill();
      }
    }
    for (const r of fx.remote) {
      r.t += dt;
      const k = Math.max(0, Math.min(1, r.t / 1.2) * (1 - Math.max(0, r.t - 9) / 3));
      ctx.globalCompositeOperation = "lighter";
      const col = ctx.createLinearGradient(r.x, v.camY - 40, r.x, r.y);
      col.addColorStop(0, "rgba(255,240,200,0)"); col.addColorStop(1, `rgba(255,236,190,${0.3 * k})`);
      ctx.fillStyle = col; ctx.fillRect(r.x - 30, v.camY - 40, 60, r.y - v.camY + 40);
      ctx.globalCompositeOperation = "source-over";
    }
    fx.remote = fx.remote.filter((r) => r.t < 12);
    for (const m of modules) if (m.fx) try { m.fx(ctx, v, dt); } catch (e) { console.error(e); }
    // markers for the open errands (only those with a place)
    for (const t of role && !open ? questList().filter((q) => q.x != null && q.name) : []) {
      const pulse = 0.5 + 0.5 * Math.sin(v.time * 3);
      ctx.strokeStyle = `rgba(159,210,193,${0.5 + 0.4 * pulse})`; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(t.x, t.y + 6, 18 + pulse * 4, 8 + pulse * 2, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.font = '500 10px "Be Vietnam Pro", system-ui, sans-serif'; ctx.textAlign = "center";
      if (v.dayMix > 0.5) { ctx.lineWidth = 2.8; ctx.strokeStyle = "rgba(255,250,230,0.9)"; ctx.strokeText(t.name, t.x, t.y + 30); ctx.fillStyle = "#1f4a40"; }
      else ctx.fillStyle = "rgba(159,210,193,0.95)";
      ctx.fillText(t.name, t.x, t.y + 30);
    }
  }

  // ---------- proximity loop ----------
  function near(pt, r) { const p = World.getPlayer(); return Math.hypot(p.x - pt.x, p.y - pt.y) <= r; }
  // ---------- "bấm mới mở": a scene that starts a story is offered as a small button, never opened by walking near ----------
  // A module calls kit.offer(id, label, fn) every tick while the player stands in reach. The button stays while it is
  // offered and goes away when the player walks on. Only a tap opens the scene (docs/game-design-principles.md).
  let prompt = null, offeredTick = false;
  function offer(id, label, fn) {
    offeredTick = true;
    const btn = $("mind-prompt");
    if (!prompt || prompt.id !== id || prompt.label !== label) { btn.textContent = label; btn.hidden = false; }
    prompt = { id, label, fn };
    return true;
  }
  function clearPrompt() {
    if (!prompt) return;
    prompt = null;
    $("mind-prompt").hidden = true;
  }
  function tapPrompt() {
    const p = prompt;
    if (!p || !role || open || !api || api.busy()) return;
    clearPrompt();
    p.fn();
  }
  function loop() {
    offeredTick = false;
    try { step(); } finally { if (!offeredTick) clearPrompt(); }
  }
  function step() {
    syncActors();
    if (!role || open || !api || api.busy() || Date.now() < cooldownUntil) return;
    const st = S.quest.step;
    if (questOn()) {
      if (!villageArrival() && (st === "start" || (st === "again" && Date.now() > (S.quest.againAt || 0))) && near(DOG(), 30)) return bite();
      if (villageArrival() && near(MONK_SPOT(), 64)) {
        if (canSitWithElder(st)) return offer("week_sit", "Xin ngồi với sư già", atMonk);
        if (st === "deva" && api.darkness() >= 0.5) return offer("week_deva", "Nhìn lên vệt sáng", () => devaVisit(MONK_SPOT(), true));
      }
      const t = target();
      if (t && near(t, 34)) {
        if (st === "well") return atWell();
        if (st === "herb") return atMit();
        if (st === "deliver") return deliver();
        if (st === "monk" && !villageArrival()) return atMonk();
      }
      if (!villageArrival() && st === "deva" && near(MONK_SPOT(), 90)) return devaVisit(MONK_SPOT(), true);
    }
    for (const m of modules) if (m.loop) { try { if (m.loop()) return; } catch (e) { console.error(e); } }
    // random visits at night in quiet holy places, when the mind is bright
    if (api.darkness() >= 0.5 && api.mood() >= 0.62 && Date.now() - S.deva.last > 8 * 60000) {
      for (const key of ["hermitage", "gao", "ao"]) {
        if (!P()[key] || !near(P()[key], 70)) continue;
        if (Math.random() < 0.04 + S.deva.pity * 0.04) return devaVisit({ x: P()[key].x - 30, y: P()[key].y + 20 }, false);
        S.deva.pity++; save();
        break;
      }
    }
  }

  // ---------- panels ----------
  function bar(name, v, good) {
    const row = el("div", "stat");
    row.appendChild(el("span", "stat-name", name));
    const track = el("span", "stat-track");
    const fill = el("span", "stat-fill " + (good ? "good" : "bad"));
    fill.style.width = Math.round(v) + "%";
    track.appendChild(fill);
    row.appendChild(track);
    return row;
  }
  function suggestion() {
    const s = S.stats;
    // The sentence must agree with the colour the player sees (same bands as moodLabel in app.js).
    const g = api && api.mood ? api.mood() : 0.5;
    if (g < 0.12) return "Lòng đang u tối, dễ nổi nóng. Thử làm một việc tốt cho người vừa làm mình giận.";
    if (g < 0.35) return "Lòng đang bám víu, muốn giữ cho mình. Thử đem một thứ mình có cho người khác.";
    if (g < 0.46) return "Lòng đang mờ mịt. Ghé ngồi với vị sư ở nghĩa địa một lát cho tỉnh lại.";
    if (g >= 0.74) return "Lòng đang sáng và nhẹ. Cứ đi dạo và biết từng bước chân.";
    if (s.niem < 35) return "Lòng khá yên, chỉ là niệm còn yếu. Ghé ngồi với vị sư ở nghĩa địa một lát.";
    if (s.tin - s.tue > 18) return "Tin nhiều hơn hiểu. Thử đọc một bài kinh ở tịnh thất rồi suy xét.";
    if (s.tue - s.tin > 18) return "Hiểu nhiều hơn tin. Lễ Phật ở tịnh thất, ngồi yên, đừng phân tích.";
    return "Tâm đang khá cân bằng. Cứ đi dạo và biết từng bước chân.";
  }
  function renderStats(container) {
    container.replaceChildren();
    const has = Object.keys(S.cards).length > 0 && S.stats;
    container.hidden = !has;
    if (!has) return;
    if (CARITA[S.carita]) container.appendChild(el("p", "mind-carita", `Người này thiên về tính ${CARITA[S.carita].name}.`));
    const g = el("div", "stat-bars");
    GOOD.forEach(([k, n]) => g.appendChild(bar(n, S.stats[k], true)));
    container.appendChild(g);
    const b = el("div", "stat-bars");
    BAD.forEach(([k, n]) => b.appendChild(bar(n, S.stats[k], false)));
    container.appendChild(b);
    container.appendChild(el("p", "quest-tip", suggestion()));
    const btn = el("button", "pill", `Xem thẻ đã có (${Object.keys(S.cards).length})`);
    btn.type = "button"; btn.addEventListener("click", () => { $("mind-info").hidden = true; openAlbum(); });
    container.appendChild(btn);
    container.appendChild(el("p", "hint", "Chỉ số là mô phỏng để chơi, có lên có xuống, xoay quanh một mốc. Không phải thước đo tâm thật."));
  }
  // Two sections for the album and the profile: wholesome cards being practised, unwholesome ones being understood.
  function cardSections(owned) {
    const R = MS().rules, mk = (id) => {
      const def = CARDS[id], own = owned[id], n = own ? R.effN(def, own.n) : 0;
      const sub = def.good ? `gặp ${n} lần` : n >= R.UNDERSTAND_AT ? "Đã hiểu" : `hiểu ${n}/${R.UNDERSTAND_AT}`;
      return { id, own, cls: own ? (def.good ? "good" : "bad") : "empty", sub };
    };
    const good = CARD_ORDER.filter((k) => CARDS[k].good), bad = CARD_ORDER.filter((k) => !CARDS[k].good);
    const understood = bad.filter((k) => owned[k] && R.isUnderstood(CARDS[k], owned[k].n)).length;
    return [
      { key: "good", title: "Tâm đang tu", extra: "", items: good.map(mk) },
      { key: "bad", title: "Tâm đã hiểu", extra: `${understood}/${bad.length} đã hiểu`, items: bad.map(mk) },
    ];
  }
  // Feeling colours of a cetasika, for the tile glow and the band along the tile's top edge.
  const feelColor = (k) => (Cetasika.FEELINGS[k].edge && k === "kho" ? Cetasika.FEELINGS[k].edge : Cetasika.FEELINGS[k].color);
  function glowOf(cz) {
    const cs = Cetasika.ORDER.filter((k) => cz.feelings.includes(k)).map(feelColor);
    if (cs.length === 1) return `radial-gradient(circle, ${cs[0]}66 0%, ${cs[0]}00 70%)`;
    const n = cs.length, seg = 360 / n;
    const stops = cs.map((c, i) => `${c}55 ${(i * seg).toFixed(0)}deg ${((i + 1) * seg).toFixed(0)}deg`).join(", ");
    return `radial-gradient(circle, #10181a00 28%, #10181acc 100%), conic-gradient(${stops})`;
  }
  function bandOf(cz) {
    const cs = Cetasika.ORDER.filter((k) => cz.feelings.includes(k)).map(feelColor), n = cs.length;
    return `linear-gradient(90deg, ${cs.map((c, i) => `${c} ${(i * 100 / n).toFixed(1)}% ${((i + 1) * 100 / n).toFixed(1)}%`).join(", ")})`;
  }
  // Bag-like tiles for one card section (album and profile). onOpen(id) for owned ones.
  function cardGrid(sec, onOpen) {
    const grid = el("div", "album-grid cz-grid");
    for (const it of sec.items) {
      const def = CARDS[it.id], cz = window.Cetasika && Cetasika.byGame(it.id);
      const b = el("button", "cz-tile " + it.cls);
      b.type = "button";
      if (cz) { b.style.setProperty("--band", bandOf(cz)); b.style.setProperty("--tint", glowOf(cz)); }
      const art = el("span", "cz-tile-art");
      art.innerHTML = window.CetasikaArt ? (it.own ? CetasikaArt.svg(it.id, 56) : CetasikaArt.silhouette(56)) : "";
      b.appendChild(art);
      if (it.own) {
        b.appendChild(el("b", "cz-tile-name", def.name));
        b.appendChild(el("span", it.sub === "Đã hiểu" ? "cz-tile-sub cz-badge" : "cz-tile-sub", it.sub));
        b.addEventListener("click", () => onOpen(it.id));
      } else {
        b.appendChild(el("span", "cz-tile-sub", def.where));
        b.disabled = true;
      }
      grid.appendChild(b);
    }
    return grid;
  }
  // ---------- catalog popup: all 52 cards, met ones as tiles, the rest as small silhouettes ----------
  // r: the character's role ("monk" | "villager" | "ghost"), or undefined for the generic view.
  const catalogView = (owned, r) => Cetasika.catalog({
    owned, cards: CARDS, role: r,
    count: (g, own) => { const R = MS().rules; return R.effN(CARDS[g], own.n); },
  });
  // The button under "Tâm đang tu" (profile) and in the album, under the same heading. X counts the owned cards that map to a cetasika.
  function catalogButton(owned, r) {
    const b = el("button", "pill cat-open", `Xem tất cả các thẻ (${catalogView(owned, r).met}/${Cetasika.all.length})`);
    b.type = "button";
    b.addEventListener("click", () => openCatalog(owned, r));
    return b;
  }
  let catalogSheet = null;
  function closeCatalog() {
    if (catalogSheet) { catalogSheet.remove(); catalogSheet = null; }
    document.removeEventListener("keydown", catalogKey);
    tipClose = null;
  }
  function catalogKey(e) { if (e.key === "Escape") { e.stopPropagation(); if (tipClose && tipClose()) return; closeCatalog(); } }
  let tipClose = null; // closes the "Tâm sở là gì?" tooltip if it is open; returns true when it did
  function openCatalog(owned, r) {
    closeCatalog();
    owned = owned || {};
    const v = catalogView(owned, r);
    const scrim = el("div", "person-scrim catalog-scrim");
    const card = el("div", "person-card catalog-card");
    card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true"); card.setAttribute("aria-labelledby", "catalog-title");
    const x = el("button", "person-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Đóng");
    x.addEventListener("click", closeCatalog);
    scrim.addEventListener("click", (e) => { if (e.target === scrim) closeCatalog(); });
    const head = el("div", "catalog-head");
    const h = el("h2", "catalog-title", "Tất cả các thẻ"); h.id = "catalog-title";
    const L = Cetasika.LORE;
    const intro = el("p", "catalog-intro");
    intro.append(r === "ghost" ? L.introGhost : L.intro);
    const tip = el("div", "catalog-tip"); tip.hidden = true; // stays empty and hidden while LORE.showTip is false
    if (L.showTip) {
    intro.append(" ");
    const link = el("button", "text-btn catalog-what", L.linkLabel); link.type = "button";
    link.setAttribute("aria-expanded", "false");
    tip.setAttribute("role", "tooltip");
    for (const p of L.paragraphs) { const para = el("p", "lore-p"); para.append(el("b", null, p.lead), p.rest); tip.appendChild(para); }
    const setTip = (on) => { tip.hidden = !on; link.setAttribute("aria-expanded", String(on)); };
    link.addEventListener("click", (e) => { e.stopPropagation(); setTip(tip.hidden); });
    card.addEventListener("click", (e) => { if (!tip.hidden && !tip.contains(e.target) && e.target !== link) setTip(false); });
    tipClose = () => { if (tip.hidden) return false; setTip(false); return true; };
    intro.appendChild(link);
    }
    head.append(h, el("p", "catalog-progress", `Đã gặp ${v.met} / ${v.total} thẻ`), intro, tip, el("p", "hint catalog-legend", "Ô có dấu ? là thẻ chưa gặp."));
    const body = el("div", "catalog-body");
    for (const g of v.groups) body.appendChild(catalogGroup(g, owned));
    body.appendChild(el("p", "hint catalog-note", "Game sẽ thêm thẻ dần, không hẹn thời điểm nào."));
    card.append(x, head, body);
    scrim.appendChild(card);
    document.body.appendChild(scrim);
    catalogSheet = scrim;
    document.addEventListener("keydown", catalogKey);
    x.focus();
  }
  function catalogGroup(g, owned) {
    const d = el("details", "cat-group");
    d.open = g.open;
    const s = el("summary", "cat-sum");
    s.append(el("span", "cat-name", g.title), el("span", "cat-count", `${g.met}/${g.total}`));
    d.appendChild(s);
    d.appendChild(el("p", "hint cat-hint", g.hint));
    // big tiles (owned, or in-game hints) in a 3-column grid, then the compact locked ones in a 4-5 column grid
    const big = g.tiles.filter((t) => !t.compact), small = g.tiles.filter((t) => t.compact);
    if (big.length) {
      const grid = el("div", "cat-grid");
      big.forEach((t) => grid.appendChild(catalogTile(t, owned)));
      d.appendChild(grid);
    }
    if (small.length) {
      const grid = el("div", "cat-grid cat-grid-mini");
      small.forEach((t) => grid.appendChild(catalogTile(t, owned)));
      d.appendChild(grid);
    }
    return d;
  }
  function catalogTile(t, owned) {
    if (t.state === "owned") {
      const cz = Cetasika.byId(t.id);
      const b = el("button", "cz-tile " + (t.good ? "good" : "bad") + " cat-tile");
      b.type = "button";
      if (cz) { b.style.setProperty("--band", bandOf(cz)); b.style.setProperty("--tint", glowOf(cz)); }
      const art = el("span", "cz-tile-art");
      art.innerHTML = window.CetasikaArt ? CetasikaArt.svg(t.game, 56) : "";
      b.append(art, el("b", "cz-tile-name", t.name), el("span", "cz-tile-sub", t.sub));
      b.addEventListener("click", () => { closeCatalog(); showCard(t.game, { own: owned[t.game], owned }); });
      return b;
    }
    // unmet: silhouette only, never a name. In-game but not met: a large tile with the card's "where" line.
    // Not in the game yet: a compact silhouette with no text at all.
    if (t.compact) {
      const mini = el("div", "cat-mini");
      mini.setAttribute("role", "img"); mini.setAttribute("aria-label", "Thẻ chưa gặp");
      mini.innerHTML = window.CetasikaArt ? CetasikaArt.silhouette(42) : "";
      return mini;
    }
    const div = el("div", "cz-tile empty cat-tile cat-t-" + t.state);
    const art = el("span", "cz-tile-art");
    art.innerHTML = window.CetasikaArt ? CetasikaArt.silhouette(56) : "";
    div.append(art, el("span", "cz-tile-sub", t.hint));
    return div;
  }

  let albumTab = "cards";
  function openAlbum(tab) {
    if (tab === "cards" || tab === "bag") albumTab = tab;
    const panel = $("cards-panel");
    const list = $("cards-list"); list.replaceChildren();
    if (window.Items) {
      const tabs = el("div", "bag-tabs");
      [["cards", "Thẻ tâm sở"], ["bag", `Túi đồ (${S.items.filter((i) => Items.def(i)).length})`]].forEach(([k, n]) => {
        const t = el("button", "pill", n); t.type = "button"; t.setAttribute("aria-pressed", String(albumTab === k));
        t.addEventListener("click", () => openAlbum(k)); tabs.appendChild(t);
      });
      list.appendChild(tabs);
      if (albumTab === "bag") {
        list.appendChild(el("h3", "album-title", "Túi đồ"));
        const box = el("div", "bag");
        Items.renderBag(box, S.items, (id) => Items.showDetail(id));
        list.appendChild(box);
        panel.hidden = false;
        return;
      }
    }
    for (const sec of cardSections(S.cards)) {
      const h = el("h3", "album-title", sec.title);
      if (sec.extra) h.appendChild(el("span", "album-extra", sec.extra));
      if (sec.key === "good") {
        list.appendChild(h);
        list.appendChild(catalogButton(S.cards, role));
      } else list.appendChild(h);
      list.appendChild(cardGrid(sec, (id) => showCard(id)));
    }
    panel.hidden = false;
  }

  // ---------- public ----------
  function init(callbacks) {
    api = callbacks;
    backfillMilestones();
    World.setFx(drawFx);
    setInterval(loop, 250);
    $("cards-close").addEventListener("click", () => ($("cards-panel").hidden = true));
    $("cards-btn").addEventListener("click", () => openAlbum());
    $("mind-prompt").hidden = true;
    $("mind-prompt").addEventListener("click", tapPrompt);
    syncCardsBtn();
  }
  function syncCardsBtn() { $("cards-btn").hidden = !role || !Object.keys(S.cards).length; $("cards-count").textContent = String(Object.keys(S.cards).length); }
  // The survey no longer blocks the start: a new person gets neutral numbers and can take the survey from Việc đang chờ.
  function onRoleStart(r, done) {
    role = r;
    if (villageArrival() && !S.q.villagerWeek) { S.q.villagerWeek = {}; save(); }
    syncCardsBtn();
    if (!S.stats) { S.stats = rollStats(S.carita); save(); }
    return false;
  }
  function onRoleEnd() { role = null; clearPrompt(); stopSit(); $("mind-card").hidden = true; $("card-reveal").hidden = true; open = false; fx.devaAt = null; syncActors(); syncCardsBtn(); }

  const dev = {
    resetSurvey() { S.carita = null; save(); survey(); },
    dog() { S.quest = { step: "start" }; save(); const d = DOG(); World.setPlayer(d.x - 4, d.y + 60); api.toast("Đi lên một chút để gặp con chó."); },
    deva() { const p = World.getPlayer(); devaVisit({ x: p.x - 30, y: p.y }, false); },
    sitNow() { S.quest.step = "monk"; save(); const m = MONK_SPOT(); World.setPlayer(m.x + 4, m.y + 40); },
    wipe() { S = fresh(); save(); syncCardsBtn(); api.toast("Đã xóa dữ liệu tâm và thẻ."); },
  };

  // ---------- encounters registered from encounters.js ----------
  const modules = [];
  function register(m) { modules.push(m); }
  // "Xem tâm" of a being: a line, root bars, a note on why it lives where it lives.
  function beingMind(title, line, bars, why, back) {
    const box = el("div", "being");
    box.appendChild(el("p", null, line));
    const b = el("div", "stat-bars");
    bars.forEach(([n, v, good]) => b.appendChild(bar(n, v, good)));
    box.appendChild(b);
    box.appendChild(el("p", "hint", why + " " + SIM_NOTE));
    showSheet({ label: title, lines: [], body: box, choices: [{ label: "Quay lại", fn: back }] });
  }
  const kit = {
    get S() { return S; }, save, showSheet, closeSheet, award, giveItem, dropItem, gotItem, grow, near, el, rand, P, MONK_SPOT,
    role: () => role, api: () => api, setOpen: (v) => { open = v; }, cooldown: (ms) => { cooldownUntil = Date.now() + ms; },
    syncActors, saveMoment, beingMind, understanding, SIM_NOTE, offer,
  };

  // Load the progress of the character now being played (or the guest's).
  const backfillMilestones = () => { if (MS() && MS().backfill) MS().backfill(S.cards); };
  function reload() { S = load(); ensure(); backfillMilestones(); syncCardsBtn(); }

  // Read-only helpers for the profile screen (render any character's saved mind, not just the one in play).
  const parts = {
    CARDS, CARD_ORDER, GOOD, BAD, bar,
    caritaName: (k) => (CARITA[k] ? CARITA[k].name : ""),
    viewCard: (id, own, owned) => showCard(id, { own, owned, then: () => {} }),
    cardSections, cardGrid,
    catalogButton, openCatalog,
    cardStep: (id, prevN) => MS().rules.cardStep(CARDS[id], prevN),
    milestoneState: () => { ensure(); return { got: S.milestones, counts: S.msCounts, save }; },
    villageState: () => { ensure(); const v = S.village; return { deeds: v.deeds, get said() { return v.said || null; }, set said(x) { v.said = x; }, save }; },
    actors: () => actors(),
    current: () => JSON.parse(JSON.stringify(S)),
    suggestion: () => (S.stats ? suggestion() : ""),
  };

  return { soundOn: () => !api || api.sound(), register, kit, questList, parts, reload, init, onRoleStart, onRoleEnd, startSurvey, skipSurvey, isOpen: () => open, bias, questInfo, renderStats, remote, openAlbum, dev, cardsChanged: syncCardsBtn };
})();
