// More beings and errands, built on Mind.kit (see mind.js):
// thọ thần and the lost child, the hungry-ghost grandmother and sharing merit, địa thần's lamp,
// the cave of hungry ghosts, the lotus pond, and the heavenly palace at the old stupa.
// Stories are short retellings in the spirit of the Vimānavatthu / Petavatthu and still need a teacher's review.
(() => {
  const K = Mind.kit;
  const P = () => World.PLACES;
  const api = () => K.api();
  const dark = () => (api() ? api().darkness() : 0);
  const dusk = () => dark() >= 0.4;
  const night = () => dark() >= 0.5;
  // null: a legacy character with no world clock (keeps the old single-night rhythm of the grandmother's errand)
  const phase = () => (api() && api().phase ? api().phase() : null);
  const morning = () => ["Sáng sớm", "Sáng"].includes(phase());
  const Q = (k) => (K.S.q[k] = K.S.q[k] || { step: "none" });
  const has = (id) => K.S.items.includes(id);
  const villageRole = () => ["monk", "villager"].includes(K.role());
  const arrivalVillager = () => !!api()?.villagerArrival?.();
  const snoozed = (q) => q.snooze && Date.now() < q.snooze;
  const snooze = (q, ms = 60000) => { q.snooze = Date.now() + ms; K.save(); };
  const toast = (t) => api() && api().toast(t);
  const deed = (id) => { try { window.Village && Village.record(id, arrivalVillager() ? api().storyDay() : api()?.day?.() || 1); } catch (e) { console.error(e); } };
  const sound = () => api() && api().sound();
  const fx = { treeT: 0, peta: null, earth: 0, sparks: [], cry: null };
  // "lần theo tiếng khóc": the crying rhythm and the distance hints (not saved; rebuilt from the step each time)
  const cryState = { next: 0, level: null };
  const cryLevel = (d) => (d > 260 ? "far" : d > 120 ? "mid" : "close");
  const CRY_TEXT = { far: "Tiếng khóc lúc gần lúc xa, lẫn trong tiếng tre cọ nhau.", mid: "Gần hơn rồi. Có tiếng nấc sau khóm tre to.", close: "Ngay đây. Lá tre dưới đất bị ai ngồi đè lên." };
  function cryTick(tq) {
    if (tq.step !== "child" || !villageRole()) { fx.cry = null; cryState.level = null; cryState.next = 0; return; }
    if (api().busy() || (Mind.isOpen && Mind.isOpen())) return;
    const p = World.getPlayer(), c = spot.child();
    const d = Math.hypot(p.x - c.x, p.y - c.y);
    const now = Date.now();
    if (now >= cryState.next) {
      cryState.next = now + Math.min(3.2, Math.max(0.9, d / 80)) * 1000;
      if (sound()) NightAudio.sigh && NightAudio.sigh();
      fx.cry = { t: 0, d };
    }
    const lv = cryLevel(d);
    if (lv !== cryState.level) { cryState.level = lv; toast(CRY_TEXT[lv]); }
  }

  const spot = {
    tree: () => ({ x: P().gao.x + 38, y: P().gao.y + 14 }),
    child: () => ({ x: P().bamboo.x - 14, y: P().bamboo.y + 30 }),
    // Chị Ba (bé Na's mother) waits on the far side of the lane, away from the well where the old woman stands
    // (they used to be ~20px apart, so their labels and speech bubbles piled on top of each other).
    mother: () => ({ x: P().village.x + 52, y: P().village.y + 14 }),
    peta: () => ({ x: P().graves.x + 44, y: P().graves.y - 26 }),
    granny: () => ({ x: P().well.x + 22, y: P().well.y + 8 }),
    // where the old monk walks past in the morning: in the lane, 40px from where chị Ba stands so the two do not overlap
    alms: () => ({ x: P().village.x + 12, y: P().village.y + 14 }),
    earth: () => ({ x: P().gate.x + 58, y: P().gate.y + 4 }),
  };
  const place = (k) => P()[k] || null;
  const stand = (pt, dx = 26, dy = 6) => ({ x: pt.x + dx, y: pt.y + dy });

  // ---------- beings the player can meet again, the way a card can be opened again ----------
  // One record per being: the mind chart, the words, and a still portrait for the sổ.
  const BEINGS = [
    {
      id: "tho_than", title: "Thọ thần", sheet: "Tâm của thọ thần", good: true, milestone: "met_tho_than",
      line: "Vị này hiền, thương người, ít giận.",
      bars: [["Không tham", 70, true], ["Không sân", 84, true], ["Không si", 60, true], ["Tham", 22, false], ["Sân", 10, false], ["Si", 30, false]],
      why: "Theo kinh điển, thọ thần là chư thiên ở mặt đất, nương nơi cây lớn, nhờ phước đời trước.",
      // Look-back only. The first meeting and "Xem tâm" stay on why, one sentence.
      // Retellings, not quotations. Teacher review before these lines are treated as doctrine.
      moreLead: "Vị ở gốc gạo là nhân vật trong làng. Chuyện dưới đây kể thọ thần, tức thiên nương cây, được nói tới trong chuyện tiền thân và trong kinh ra sao.",
      stories: [
        {
          title: "Rừng sa-la đứng cùng nhau",
          source: "Chuyện tiền thân số 74, Rukkhadhamma. Nằm trong chú giải Jātaka, không phải một bài kinh.",
          lines: [
            "Đức Phật kể chuyện này cho dòng họ Thích-ca và dòng họ Câu-ly, lúc hai bên đang tranh nước sông Rohinī.",
            "Thuở xưa Ngài sinh làm vị thiên nương cây sa-la, trong một rừng trên Hy-mã-lạp. Sakka cử một vua Tỳ-sa-môn mới. Vị vua ấy bảo các thiên ở cây và ở bụi tự chọn chỗ ở.",
            "Ngài khuyên bà con ở quanh mình, trong rừng, đừng chọn cây đứng trơ một mình. Một số không nghe, đến ở những cây lớn mọc riêng ngoài đất trống.",
            "Một trận gió lớn kéo qua. Cây đứng một mình, dù cao và rễ sâu, vẫn gãy rồi bật gốc. Rừng sa-la cành lá quấn vào nhau thì gió không lay được.",
            "Ngài muốn nói: bà con ở cùng nhau thì vững. Cây trong rừng còn vậy.",
          ],
        },
        {
          title: "Vị thiên trong khu rừng",
          source: "Tương Ưng Bộ, Tương Ưng Rừng, kinh 9.1. Kinh gọi là vị thiên trú trong khu rừng, không gọi là thọ thần của một cây trong làng.",
          lines: [
            "Một vị tỳ-kheo ở khu rừng xứ Kosala. Lúc ngồi ban ngày, tâm ông nghĩ những chuyện nhà.",
            "Vị thiên trú ở khu rừng ấy thương ông, muốn điều tốt cho ông, nên đến nói. Ông vào rừng vì muốn yên, mà tâm lại chạy ra ngoài. Hãy bỏ lòng dính chuyện người đời, thì sẽ an, hết tham.",
            "Vị tỳ-kheo nghe vậy, sinh tâm tỉnh thức.",
          ],
        },
      ],
    },
    {
      id: "ba_ngoai", title: "Ngạ quỷ", sheet: "Tâm của ngạ quỷ", good: false, milestone: "met_ba_ngoai",
      line: "Bà đói, tiếc, nhớ nhà.",
      bars: [["Tham", 80, false], ["Bỏn xẻn", 86, false], ["Si", 58, false], ["Không tham", 12, true], ["Không sân", 30, true]],
      why: "Theo kinh điển, người nặng tham và bỏn xẻn có thể sinh vào cõi ngạ quỷ, luôn đói khát.",
      moreLead: "Bà ở mộ thấp là nhân vật trong làng. Kinh kể ngạ quỷ một cách khác: đói, tiếc, và trông người thân hồi hướng.",
      stories: [
        {
          title: "Đứng ngoài bức tường",
          source: "Kinh Ngoài Bức Tường, Tiểu Tụng (Khp 7), cũng nằm trong Chuyện Ngạ Quỷ.",
          lines: [
            "Kinh kể những người đã khuất, nếu còn khổ, có thể đứng ngoài tường nhà cũ. Họ trông người thân làm phước, rồi hồi hướng cho mình.",
            "Khi nghe việc phước ấy và hoan hỷ, họ được an vui hơn. Kinh không nói mọi ngạ quỷ đều ăn được bát cơm cúng. Cũng không nói nghe một câu là hết khổ.",
          ],
        },
      ],
    },
    {
      id: "dia_than", title: "Địa thần", sheet: "Tâm của địa thần", good: true, milestone: "met_dia_than",
      line: "Vị này điềm tĩnh, ngay thẳng, thương người.",
      bars: [["Không tham", 74, true], ["Không sân", 80, true], ["Không si", 70, true], ["Tham", 18, false], ["Sân", 14, false], ["Si", 22, false]],
      why: "Theo kinh điển, địa thần là chư thiên ở mặt đất, che chở nơi mình ở.",
      moreLead: "Địa thần và thọ thần cùng là chư thiên ở mặt đất. Thọ thần nương cây. Địa thần ở nơi đất, như cổng làng trong trò chơi này.",
      stories: [
        {
          title: "Chưa có chuyện một việc làm cụ thể",
          source: "Cách gọi trong game. Chưa gắn một bài kinh kể một người làm một việc rồi sinh làm địa thần ở bãi tha ma.",
          lines: [
            "Kinh không kể câu chuyện ấy. Cảnh vị này đứng ở bãi tha ma là chuyện của làng.",
            "Muốn nghe người nào sinh lên trời nhờ việc gì, hãy gặp chư thiên rồi mở lại vị ấy trong sổ.",
          ],
        },
      ],
    },
    {
      id: "chu_thien", title: "Chư thiên", sheet: "Tâm của vị chư thiên", good: true, milestone: "first_deva",
      line: "Vị này tâm sáng, ít giận, thường vui.",
      bars: [["Không tham", 82, true], ["Không sân", 90, true], ["Không si", 70, true], ["Tham", 14, false], ["Sân", 6, false], ["Si", 22, false]],
      why: "Theo kinh điển Phật giáo, chư thiên sinh lên cõi trời nhờ việc thiện đời trước, như bố thí, giữ giới.",
      moreLead: "Trong Chuyện Thiên Cung, có người hỏi vị thiên: đời trước người đã làm việc gì mà được thân sáng và cung điện này? Vị ấy tự kể. Việc ấy thường rất nhỏ.",
      after: "Cung điện là quả của chính vị ấy. Người gặp không nhận được cung ấy. Các vị ấy không ban điều ước. Chỗ nương tựa trong kinh là Tam Bảo.",
      stories: [
        {
          title: "Nắm hạt mè",
          source: "Chuyện Thiên Cung, Vv 1.10.",
          lines: [
            "Một người phụ nữ thấy Đức Phật. Bà tin Ngài xứng đáng được cúng dường, nhưng trong tay không có gì quý, chỉ có nắm hạt mè.",
            "Bà vẫn tự tay dâng nắm mè ấy. Về sau bà sinh lên trời, thân sáng. Tôn giả Mục-kiền-liên hỏi, bà kể lại đúng việc đó.",
          ],
        },
        {
          title: "Một ngọn đèn",
          source: "Chuyện Thiên Cung, Vv 1.9.",
          lines: [
            "Một người phụ nữ thấy một chỗ rất tối. Người qua lại cần ánh sáng. Bà thắp một ngọn đèn ở đó.",
            "Bà kể với tôn giả Mục-kiền-liên: nhờ thắp đèn cho người khác thấy đường, bà sinh vào một cung điện sáng, quanh có hoa sen trắng.",
          ],
        },
        {
          title: "Tràng hoa vô ưu",
          source: "Chuyện Thiên Cung, Vv 3.10.",
          lines: [
            "Một người kết một tràng hoa vô ưu, đẹp và thơm, rồi dâng lên Đức Phật.",
            "Về sau vị ấy sinh lên trời, ở cạnh một cây san hô, hái hoa của cây ấy mà kết tràng, vừa hát vừa vui. Tôn giả Mục-kiền-liên hỏi thì vị ấy kể lại việc dâng hoa.",
          ],
        },
        {
          title: "Các vị trời đi xem thế gian",
          source: "Tăng Chi Bộ, kinh 3.37. Đây không phải chuyện một người sinh lên trời, mà là chuyện chư thiên nhìn loài người.",
          lines: [
            "Ngày mùng tám, các vị tùy tùng của Tứ Đại Thiên Vương đi khắp thế gian. Các vị xem loài người có hiếu với cha mẹ, có kính sa-môn và bà-la-môn, có kính người lớn trong nhà, có giữ ngày trai giới, có làm phước hay không.",
            "Ngày mười bốn thì các hoàng tử của bốn vị vua ấy đi. Ngày rằm thì chính bốn vị vua đi. Các vị về thưa với chư thiên cõi Ba Mươi Ba, đang họp ở giảng đường Thiện Pháp.",
            "Nếu ít người làm những việc ấy, chư thiên buồn: hàng trời sẽ vơi, hàng a-tu-la sẽ đông. Nếu nhiều người làm, chư thiên vui: hàng trời sẽ đông thêm.",
          ],
        },
      ],
    },
  ];
  const ofBeing = (id) => BEINGS.find((b) => b.id === id) || null;
  // Still portraits, in the same colours as the figures on the map. Readable again from the sổ.
  function portrait(id) {
    const u = "bn" + id;
    const halo = (c, o) =>
      `<defs><radialGradient id="${u}h"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>` +
      `<circle cx="50" cy="54" r="46" fill="url(#${u}h)"/>`;
    const art = {
      tho_than: halo("#c6e88a", 0.55) +
        `<path d="M50 36 C36 52 32 72 34 94 L66 94 C68 72 64 52 50 36 Z" fill="#e7f0c4" stroke="#6a8a48" stroke-width="1.3" stroke-linejoin="round"/>` +
        `<path d="M40 46 C32 50 30 62 36 66" fill="none" stroke="#d7e6b0" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M60 46 C68 50 70 62 64 66" fill="none" stroke="#d7e6b0" stroke-width="3" stroke-linecap="round"/>` +
        `<ellipse cx="50" cy="32" rx="8" ry="9" fill="#e8cfa8" stroke="#a88868" stroke-width="1"/>` +
        `<ellipse cx="50" cy="23" rx="7.2" ry="4.2" fill="#d8dcd0" stroke="#8a9084" stroke-width="1"/>` +
        `<ellipse cx="50" cy="17" rx="4.2" ry="3.6" fill="#eef0e6" stroke="#8a9084" stroke-width="1"/>` +
        `<ellipse cx="30" cy="46" rx="6" ry="2.4" fill="#cfe89a" stroke="#5a7a38" stroke-width=".8" transform="rotate(-28 30 46)"/>` +
        `<ellipse cx="72" cy="40" rx="6" ry="2.4" fill="#e8d98a" stroke="#7a6a30" stroke-width=".8" transform="rotate(22 72 40)"/>` +
        `<ellipse cx="24" cy="68" rx="5" ry="2" fill="#cfe89a" stroke="#5a7a38" stroke-width=".8" transform="rotate(16 24 68)"/>`,
      ba_ngoai: halo("#9fb4c8", 0.4) +
        `<path d="M50 44 C38 58 34 78 36 96 L44 88 L50 96 L56 88 L64 96 C66 76 62 58 50 44 Z" fill="#8aa0b4" stroke="#3e5164" stroke-width="1.2" stroke-linejoin="round"/>` +
        `<path d="M44 50 C36 62 34 74 38 82 M56 50 C64 62 66 74 62 82" fill="none" stroke="#c5d4e2" stroke-width="1.2" stroke-linecap="round"/>` +
        `<path d="M50 40 C54 32 62 28 66 26" fill="none" stroke="#9fb3c4" stroke-width="2.4" stroke-linecap="round"/>` +
        `<ellipse cx="66" cy="22" rx="6" ry="7" fill="#c5d4e2" stroke="#5a7084" stroke-width="1"/>` +
        `<path d="M62 16 C60 10 66 8 68 12 M66 15 C68 8 74 10 72 16 M70 16 C74 10 78 14 74 18" fill="none" stroke="#d5e0ea" stroke-width="1.1" stroke-linecap="round"/>` +
        `<rect x="63.2" y="21" width="1.3" height="1.6" fill="#1a232c"/><rect x="67.4" y="21" width="1.3" height="1.6" fill="#1a232c"/>`,
      dia_than: halo("#e6b15a", 0.45) +
        `<path d="M50 40 L32 94 L68 94 Z" fill="#8a6038" stroke="#4a3018" stroke-width="1.3" stroke-linejoin="round"/>` +
        `<path d="M38 62 H62" stroke="#6e4a2a" stroke-width="3" stroke-linecap="round"/>` +
        `<ellipse cx="50" cy="34" rx="8" ry="9" fill="#d8b48c" stroke="#8a6848" stroke-width="1"/>` +
        `<path d="M42 36 C46 58 54 58 58 36" fill="#f2efe6" stroke="#c8c2b4" stroke-width="1"/>` +
        `<path d="M41 30 C50 22 59 30 59 30 C59 26 50 22 41 26 Z" fill="#e8e6dc" stroke="#b0aea4" stroke-width="1"/>` +
        `<path d="M74 96 L74 28" stroke="#4a3320" stroke-width="2.2" stroke-linecap="round"/>` +
        `<path d="M74 26 C80 22 82 30 76 32" fill="none" stroke="#4a3320" stroke-width="2" stroke-linecap="round"/>` +
        `<ellipse cx="40" cy="52" rx="3.2" ry="3.2" fill="#d8b48c"/>`,
      chu_thien: halo("#ffe6a0", 0.6) +
        `<path d="M50 34 C34 48 30 72 34 96 L66 96 C70 72 66 48 50 34 Z" fill="#fff6dc" stroke="#e0b85a" stroke-width="1.3" stroke-linejoin="round"/>` +
        `<path d="M40 40 C22 48 20 70 30 84 M60 40 C78 48 80 70 70 84" fill="none" stroke="#ffd080" stroke-width="1.6" stroke-linecap="round"/>` +
        `<ellipse cx="50" cy="30" rx="8" ry="9" fill="#f3d9b4" stroke="#c8a078" stroke-width="1"/>` +
        `<path d="M40 26 L44 14 L50 22 L56 14 L60 26 Z" fill="#ffd76a" stroke="#b88820" stroke-width="1" stroke-linejoin="round"/>`,
    };
    return `<svg class="being-svg" viewBox="0 0 100 100" width="100" height="100" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${art[id] || ""}</svg>`;
  }
  function beingThumb(id, size) {
    const span = document.createElement("span");
    span.className = "being-thumb";
    if (size) { span.style.width = size + "px"; span.style.height = size + "px"; }
    span.innerHTML = portrait(id);
    return span;
  }
  // Stories live on the look-back card only. "Xem tâm" during a meeting stays on the one-line why.
  function beingMore(b) {
    if (!b.stories || !b.stories.length) return null;
    const box = document.createElement("div");
    box.className = "being-more";
    const head = document.createElement("h4");
    head.className = "being-more-title";
    head.textContent = "Đọc thêm";
    box.appendChild(head);
    if (b.moreLead) {
      const lead = document.createElement("p");
      lead.className = "being-lead";
      lead.textContent = b.moreLead;
      box.appendChild(lead);
    }
    for (const s of b.stories) {
      const art = document.createElement("section");
      art.className = "being-story";
      const title = document.createElement("h5");
      title.textContent = s.title;
      const src = document.createElement("p");
      src.className = "being-src";
      src.textContent = s.source;
      art.append(title, src);
      for (const line of s.lines) {
        const p = document.createElement("p");
        p.textContent = line;
        art.appendChild(p);
      }
      box.appendChild(art);
    }
    if (b.after) {
      const tail = document.createElement("p");
      tail.className = "being-lead";
      tail.textContent = b.after;
      box.appendChild(tail);
    }
    return box;
  }
  // The same card again: the portrait, the mind, then the stories gathered after the meeting.
  function openBeing(id) {
    const b = ofBeing(id);
    if (!b || !document || !document.createElement) return;
    const prev = document.querySelector ? document.querySelector(".being-reveal") : null;
    if (prev && prev.classList && prev.classList.contains("being-reveal") && prev.remove) prev.remove();
    const wrap = document.createElement("div");
    wrap.className = "card-reveal being-reveal";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", b.title);
    const label = document.createElement("p");
    label.className = "label";
    label.textContent = "Đã gặp";
    const card = document.createElement("article");
    card.className = "mcard being" + (b.good ? " good" : "") + (b.stories && b.stories.length ? " has-more" : "");
    const hero = document.createElement("div");
    hero.className = "being-hero";
    hero.innerHTML = portrait(id);
    const kind = document.createElement("div");
    kind.className = "mcard-kind";
    kind.textContent = "Tâm của vị này";
    const name = document.createElement("h3");
    name.className = "mcard-name";
    name.textContent = b.title;
    const plain = document.createElement("p");
    plain.className = "mcard-plain";
    plain.textContent = b.line;
    const bars = document.createElement("div");
    bars.className = "stat-bars";
    for (const [n, v, good] of b.bars) {
      const row = document.createElement("div");
      row.className = "stat";
      const nm = document.createElement("span");
      nm.className = "stat-name";
      nm.textContent = n;
      const track = document.createElement("span");
      track.className = "stat-track";
      const fill = document.createElement("span");
      fill.className = "stat-fill " + (good ? "good" : "bad");
      fill.style.width = Math.round(v) + "%";
      track.appendChild(fill);
      row.append(nm, track);
      bars.appendChild(row);
    }
    const why = document.createElement("p");
    why.className = "mcard-note";
    why.textContent = b.why;
    const note = document.createElement("p");
    note.className = "mcard-note";
    note.textContent = K.SIM_NOTE;
    const more = beingMore(b);
    card.append(hero, kind, name, plain, bars, why);
    if (more) card.appendChild(more);
    card.appendChild(note);
    const ok = document.createElement("button");
    ok.type = "button";
    ok.className = "primary";
    ok.textContent = "Đóng";
    const close = () => { document.removeEventListener && document.removeEventListener("keydown", onKey); wrap.remove(); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    ok.addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
    document.addEventListener("keydown", onKey);
    wrap.append(label, card, ok);
    (document.querySelector(".app") || document.body).appendChild(wrap);
    try { ok.focus(); } catch {}
  }
  window.Beings = { of: ofBeing, portrait, thumb: beingThumb, open: openBeing };

  function mindOf(id, back) {
    const b = ofBeing(id);
    K.beingMind(b.sheet, b.line, b.bars, b.why, back);
  }

  // ---------- thọ thần and bé Na ----------
  // The first sheet only introduces her. The errand waits for "Nghe tiếp", so a hasty tap
  // cannot skip her mind. The sổ keeps the portrait either way.
  function treeMeet() {
    const q = Q("tree");
    if (!q.met) {
      q.met = true;
      K.save();
      if (sound()) NightAudio.bell(0.4);
    }
    treeIntro();
  }
  function treeIntro() {
    const q = Q("tree");
    K.showSheet({
      label: "Gốc cây gạo",
      lines: [
        "Lá cây gạo sáng lên, từng chiếc một, dù trời không có gió.",
        "Một bà cụ hiền bước ra từ sau thân cây, như đã đứng đó từ lâu.",
      ],
      choices: [
        { label: "Xem tâm vị ấy", fn: () => mindOf("tho_than", treeIntro) },
        { label: "Hỏi: bà là ai?", fn: treeWho },
        { label: "Nghe tiếp", primary: true, fn: treeAsk },
        { label: "Để sau", fn: () => { snooze(q); K.closeSheet(); toast("“Ừ. Ta ở cây này. Khi nào muốn nghe thì lại.”"); } },
      ],
    });
  }
  function treeWho() {
    K.showSheet({
      label: "Gốc cây gạo",
      lines: ["“Ta ở cây này lâu rồi. Lâu hơn cái giếng.”", "“Lá sáng là ta đang thức. Người đừng sợ.”"],
      choices: [
        { label: "Nghe tiếp", primary: true, fn: treeAsk },
        { label: "Quay lại", fn: treeIntro },
      ],
    });
  }
  function treeAsk() {
    const q = Q("tree");
    K.showSheet({
      label: "Gốc cây gạo",
      lines: [
        "“Có đứa bé lạc trong bụi tre, khóc từ chiều. Ta gọi mà nó không nghe được.”",
        "“Người thì nó nghe. Đưa nó về giúp ta nhé?”",
      ],
      choices: [
        { label: "Đi tìm đứa bé, kẻo trời tối hẳn", primary: true, fn: () => { q.step = "child"; K.save(); K.closeSheet(); toast("Có tiếng khóc nhỏ vọng ra từ bụi tre. Lần theo tiếng khóc nhé."); } },
        { label: "Xem tâm vị ấy", fn: () => mindOf("tho_than", treeAsk) },
        { label: "Để sau", fn: () => { snooze(q); K.closeSheet(); toast("“Ừ. Ta trông chừng nó từ đây.”"); } },
      ],
    });
  }
  // One line of the scene in the bamboo changes with the temperament (docs/human-world-villager-night-script.md, BT-1).
  // It only colours the telling: every temperament sees the same choices, and no card comes from the line itself.
  const NA_LINE = {
    default: "Bé khóc đã lâu, giọng khản đi.",
    tham: "Người này thoáng tiếc buổi tối đầu tiên ở làng, đáng lẽ được thong thả.",
    san: "Tiếng khóc xoáy vào tai. Người này thấy bực, dù chưa biết bực ai.",
    si: "Người này đứng ngẩn ra một lúc, quên mất mình định làm gì.",
    tam: "Đầu Người này chạy đủ thứ: nhà bé ở đâu, sao lại ra đây, lỡ người ta tưởng mình dọa nó.",
    tin: "Người này nhớ lời vị ở gốc gạo, và tin là mình tìm đúng chỗ.",
    tri: "Người này để ý: đất trên tay bé còn ướt. Bé mới ngã đâu đây thôi.",
  };
  function childFound() {
    const q = Q("tree");
    if (sound()) NightAudio.sigh && NightAudio.sigh();
    K.showSheet({
      label: "Bụi tre",
      lines: ["Một bé gái ngồi thu lu sau bụi tre, khóc nấc. Hai bàn tay lấm đất.", NA_LINE[K.S.carita] || NA_LINE.default],
      choices: [
        { label: "Ngồi xuống ngang tầm, cho bé bớt sợ", primary: true, fn: () => {
          K.grow("san", -1.5); K.grow("tin", 1); q.step = "follow"; q.scared = false; K.save(); K.closeSheet(); api().swingMood(0.2);
          K.award("bi", "Người này thấy bé khóc, ngồi xuống, muốn bé bớt sợ.", () => { K.cooldown(2500); toast("“Con tên Na. Con đi theo đom đóm, rồi trời tối mất.” Bé nắm tay, đi theo về làng."); api().goTo(spot.mother().x + 24, spot.mother().y + 10); });
        } },
        { label: "Quát cho nó nín: “Về nhà ngay!”", fn: () => {
          K.grow("san", 2); q.step = "follow"; q.scared = true; K.save(); K.closeSheet(); api().swingMood(-0.15);
          K.award("san", "Người này nghe bé khóc mãi mà bực, và quát lên.", () => { K.cooldown(2500); toast("Bé khóc to hơn, nhưng vẫn lẽo đẽo theo sau, cách ba bước."); });
        } },
        // A kind choice with no card: waiting is ordinary decency, not a moment the game names.
        { label: "Đứng xa một chút, chờ bé tự nín", fn: () => {
          q.step = "follow"; q.scared = false; K.save(); K.closeSheet(); K.cooldown(2500);
          toast("Một lúc sau tiếng khóc nhỏ dần. Bé ló đầu ra, nhìn, rồi rón rén đi theo.");
        } },
      ],
    });
  }
  function childHome() {
    const q = Q("tree");
    const home = () => { q.step = "thank"; q.scared = false; deed("na_home"); K.save(); K.closeSheet(); api().swingMood(0.25); };
    const after = () => { K.cooldown(2500); toast(dusk() ? "Ở gốc cây gạo, lá lại sáng lên." : "Lúc chạng vạng, quay lại gốc cây gạo nhé."); };
    if (q.scared) {
      // The child was shouted at: no Tùy hỷ here, whatever is said next. Owning up is ordinary decency, not a card.
      return K.showSheet({
        label: "Ngõ làng",
        lines: ["Chị Ba ôm lấy con. Bé Na úp mặt vào vai mẹ, không nhìn lại.", "“…Cảm ơn đã đưa cháu về.”"],
        choices: [
          { label: "Nói nhỏ: lúc nãy lỡ to tiếng với bé", primary: true, fn: () => { q.repaired = true; home(); K.cooldown(2500); toast("“Ừ. Nó khóc dai lắm, tôi biết. Về được là mừng rồi.”"); } },
          { label: "Gật đầu rồi đi", fn: () => { home(); after(); } },
        ],
      });
    }
    K.showSheet({
      label: "Ngõ làng",
      lines: ["Chị Ba chạy ra ôm chầm lấy con, vừa khóc vừa cười. “Na! Mẹ tìm con khắp nơi.”", "“Cảm ơn nhiều lắm. Nhà mới dọn về đầu ngõ phải không?”"],
      choices: [
        // Tùy hỷ only when the player chooses to stay and be glad for them (plan rule R3), never for pressing on.
        { label: "Đứng lại nhìn hai mẹ con một lát, mừng cho họ", primary: true, fn: () => { home(); K.award("tuy_hy", "Người này đứng lại nhìn hai mẹ con gặp nhau và mừng cho họ.", after); } },
        { label: "Gật đầu chào rồi đi", fn: () => { home(); after(); } },
      ],
    });
  }
  function treeThanks() {
    const q = Q("tree");
    K.showSheet({
      label: "Gốc cây gạo",
      lines: ["“Nó về rồi. Ta nghe tiếng cửa đóng.” Một chiếc lá gạo rơi xuống, vẫn còn sáng.", "“Giữ chiếc lá này. Có những thứ, trời tối mới thấy.”"],
      choices: [{ label: "Nhận chiếc lá", primary: true, fn: () => {
        q.step = "done"; K.giveItem("la_gao"); K.save(); K.closeSheet(); K.setOpen(true);
        K.gotItem("la_gao", () => { K.setOpen(false); K.cooldown(2500); });
      } }],
    });
  }

  // Bà Sáu cannot act on living people or carry physical objects. Her quest is observation and memory.
  function ghostMemory() {
    const q = Q("ghost_memory"), step = q.step || "none";
    const next = (name) => { q.step = name; K.save(); K.closeSheet(); K.cooldown(3000); };
    const show = (lines, choices) => K.showSheet({ label: "Tiếng guốc trong sương", lines, choices });
    if (step === "none") return show(
      ["Dưới gốc gạo thấp thoáng bóng một đứa trẻ.", "Bà Sáu nghe như tiếng Hạnh gọi từ mùa nước lớn."],
      [
        { label: "Gọi tên Hạnh", fn: () => { q.called = true; next("bamboo"); toast("Không ai quay đầu. Lá gạo vẫn lay."); } },
        { label: "Dừng lại nhìn kỹ", primary: true, fn: () => { q.looked = true; next("bamboo"); toast("Đó là một đứa trẻ khác, đang về nhà."); } },
        { label: "Để đêm khác", fn: () => { snooze(q); K.closeSheet(); } },
      ]
    );
    if (step === "bamboo") return show(
      ["Bụi tre vang lên tiếng guốc lộc cộc.", "Một người mẹ nắm tay con đi qua. Họ không nghe thấy bà."],
      [
        { label: "Nhớ con đường nước lớn", fn: () => { q.called = true; next("wall"); } },
        { label: "Biết đây không phải Hạnh", primary: true, fn: () => { q.looked = true; next("wall"); } },
        { label: "Để khi khác", fn: () => { snooze(q); K.closeSheet(); } },
      ]
    );
    if (step === "wall") return show(
      ["Ngoài tường tịnh thất, tiếng kinh vọng ra rất khẽ.", "Bà chỉ có thể đứng nghe, không thể bước vào đời sống của họ."],
      [
        { label: "Ở lại nghe một đoạn", primary: true, fn: () => { q.listened = true; next("grave"); } },
        { label: "Quay về ngôi mộ cũ", fn: () => next("grave") },
      ]
    );
    return show(
      [q.looked ? "Bà vẫn nhớ tên con, nhưng không gọi người lạ bằng tên ấy nữa." : "Bà vẫn nhớ con, vẫn muốn gọi theo từng bóng người.", "Đêm nay bà có thể ngồi lại cùng nỗi nhớ đó."],
      [
        { label: "Ngồi lặng bên mộ", primary: true, fn: () => { q.step = "done"; K.save(); K.closeSheet(); K.cooldown(4000); toast("Một đêm đã khép lại, không cần ép mình buông ngay."); } },
        { label: "Để khi khác", fn: () => { snooze(q); K.closeSheet(); } },
      ]
    );
  }

  // ---------- the hungry-ghost grandmother (Kinh Ngoài Bức Tường) ----------
  function petaMeet() {
    const q = Q("peta");
    const ask = () => K.showSheet({
      label: "Giữa các ngôi mộ",
      lines: ["“Bà là bà ngoại của một nhà trong làng. Lâu lắm rồi.”", "“Bà đói. Mà cơm người ta để đó, bà không ăn được.”"],
      choices: [
        { label: "Chưa biết làm sao, nhưng muốn bà bớt đói: “Để con đi hỏi.”", primary: true, fn: () => {
          q.step = "rice"; K.save(); K.closeSheet();
          // Bi only when the player chooses to help after hearing her; leaving after the story gives no card.
          K.award("bi", "Người này nghe bà kể mình đói và muốn bà bớt khổ.", () => {
            K.cooldown(2500);
            toast("“Ừ… Bà chờ. Bà chờ quen rồi.” Bà cụ ở giếng sống ở làng lâu nhất, thử ra đó hỏi.");
          });
        } },
        { label: "Hỏi: ai cho thì bà mới ăn được?", fn: () => K.showSheet({
          label: "Giữa các ngôi mộ",
          lines: ["“Bà không biết. Bà chỉ biết đói.”"],
          choices: [{ label: "Quay lại", primary: true, fn: ask }],
        }) },
        { label: "Nghe xong, cúi chào rồi đi", fn: () => { snooze(q); K.closeSheet(); } },
      ],
    });
    K.showSheet({
      label: "Giữa các ngôi mộ",
      lines: ["Một bóng người gầy đứng bên ngôi mộ thấp. Sương đọng quanh chân bà mà cỏ không ướt.", "“Có ai còn nhớ đến bà không?”"],
      choices: [
        { label: "Lại gần hỏi bà cần gì", primary: true, fn: ask },
        { label: "Xem tâm bà", fn: () => mindOf("ba_ngoai", petaMeet) },
        { label: "Lùi lại, để hôm khác", fn: () => K.closeSheet() },
      ],
    });
  }
  // Characters with the world clock keep the monk's rule: no food after noon, so the rice is carried in the morning.
  function grannyExplain() {
    const q = Q("peta");
    if (q.told) {
      K.showSheet({
        label: "Giếng làng",
        lines: ["“Sáng mai nhé con. Bà để dành gạo rồi.”"],
        choices: [{ label: "Dạ", primary: true, fn: () => { K.closeSheet(); snooze(q, 60000); } }],
      });
      return;
    }
    K.showSheet({
      label: "Giếng làng",
      lines: ["“Mộ thấp hả… Bà ấy mất lâu rồi. Con cháu đi xa cả.”", "“Người khuất thì mình đâu đưa cơm tận tay được. Xưa giờ ông bà mình làm vầy: dâng cơm cho một vị sư, rồi gửi phần phước cho người đã mất.”"],
      choices: [{ label: "Hỏi: vậy giờ con mang cơm ra cho sư được không?", primary: true, fn: () => K.showSheet({
        label: "Giếng làng",
        lines: ["“Giờ này sư không nhận cơm đâu con. Sáng mai sư ôm bát đi ngang ngõ.”", "“Sáng ra đây, bà nấu nồi cơm mới. Con xới một bát rồi đặt vào bát của sư.”"],
        choices: [{ label: "Dạ, sáng mai con ra", primary: true, fn: () => { q.told = true; K.save(); K.closeSheet(); snooze(q, 60000); } }],
      }) }],
    });
  }
  function grannyRice() {
    const q = Q("peta");
    const clocked = phase() !== null;
    if (clocked && !morning()) return grannyExplain();
    let picked = new Set(), closed = false;
    // Short scooping step first: three taps on the rice, no fail and no score.
    const area = K.el("div", "scoop-row");
    area.style.display = "flex"; area.style.justifyContent = "center"; area.style.gap = "18px"; area.style.padding = "18px 0";
    for (let i = 0; i < 3; i++) {
      const b = K.el("button", "scoop");
      b.type = "button";
      b.setAttribute("aria-label", "Muỗng cơm");
      b.addEventListener("click", () => {
        if (picked.has(i)) return;
        picked.add(i); b.classList.add("picked");
        if (picked.size === 3) setTimeout(() => { if (!closed) choose(); }, 400);
      });
      area.appendChild(b);
    }
    const receive = (shared) => {
      q.shared = shared; q.step = "offer"; K.giveItem("bat_com"); K.save(); K.closeSheet(); K.setOpen(true);
      const msg = !clocked ? "Đem bát cơm dâng vị sư già ở nghĩa địa."
        : shared ? "“Vậy bát cơm này có hai nhà góp.” Sư già sắp đi ngang ngõ làng."
        : "Sư già sắp đi ngang ngõ làng. Đặt cơm vào bát của sư.";
      K.gotItem("bat_com", () => { K.setOpen(false); K.cooldown(2500); toast(msg); });
    };
    function choose() {
      const meal = clocked ? "sáng" : "tối";
      K.showSheet({
        label: "Giếng làng",
        lines: ["Cơm đầy bát, còn bốc khói.", `Trong túi Người này còn nắm cơm để dành cho bữa ${meal}.`],
        choices: [
          { label: "Mang bát cơm của bà cụ đi", primary: true, fn: () => receive(false) },
          { label: clocked ? "Sớt cả phần cơm sáng của mình vào bát, sáng nay nhịn một bữa cũng được" : "Sớt cả phần cơm tối của mình vào bát, tối nay nhịn một bữa cũng được", fn: () => receive(true) },
        ],
      });
    }
    K.showSheet({
      label: "Giếng làng",
      lines: [q.told ? "“Cơm mới chín đó con.”" : "Bà cụ nghe chuyện, gật gù: “Người khuất thì mình đâu đưa cơm tận tay được. Dâng cơm cho một vị sư, rồi gửi phần phước cho người đã mất.”", "Bà xới đầy một bát cơm trắng còn nóng. Chạm vào từng muỗng để xới cơm."],
      body: area,
      choices: [{ label: "Để sau", fn: () => { closed = true; snooze(q); K.closeSheet(); } }],
    });
  }
  // The release scene: the bell, the moon, the closing sheet. The legacy path runs it right after the dedication
  // (and settles Không tham there); the clocked path runs it at dusk as its own step.
  function petaScene(legacyShared) {
    const q = Q("peta");
    // After the scene: both choices close it; cards come one after another, never during the scene.
    function finish(stayed) {
      q.shared = false;
      q.step = "done"; deed("peta_fed"); K.save(); K.closeSheet(); fx.peta = null; World.resetLook();
      Save.log("Đã giúp bà ngoại bên mộ thấp được an.");
      const endCooldown = () => { K.cooldown(2500); toast("Bà không còn ở đó nữa. Chỗ bà đứng chỉ còn gió và một chiếc lá."); };
      const tuyHy = () => (stayed
        ? K.award("tuy_hy", "Người này đứng lại nhìn bà được yên và mừng cho bà.", endCooldown)
        : endCooldown());
      if (legacyShared) return K.award("khong_tham", "Người này sớt phần cơm tối của mình vào bát để gửi phước cho bà.", tuyHy);
      tuyHy();
    }
    K.setOpen(true);
    fx.peta = { t: 0 };
    if (sound()) NightAudio.bell(0.8);
    World.lookAt(spot.peta().y - 20, spot.peta().x);
    setTimeout(() => {
      K.showSheet({
        label: "Giữa các ngôi mộ",
        lines: ["Bà ngoại ngẩng lên. Lần đầu tiên, mặt bà có nét yên.", "“Bà nhận được rồi… Cảm ơn con.” Cái bóng gầy sáng dần, rồi tan vào ánh trăng."],
        choices: [
          { label: "Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà", primary: true, fn: () => finish(true) },
          { label: "Chắp tay rồi đi", fn: () => finish(false) },
        ],
      });
    }, 3800);
  }
  function offerRice() {
    const q = Q("peta");
    const clocked = phase() !== null;
    if (clocked && (q.step === "alms_given" || !has("bat_com"))) return almsFarewell();
    K.showSheet({
      label: "Dâng cơm",
      lines: [clocked ? "Sư già ôm bát đi chậm qua ngõ, mắt nhìn xuống. Thấy có người chờ, sư dừng lại." : "Sư già đưa hai tay nhận bát cơm.", "“Phước này là của con. Con muốn gửi cho ai?”"],
      choices: [{ label: clocked ? "Đặt cơm vào bát, cùng hồi hướng: mong bà được no, được yên" : "Dâng cơm, cùng hồi hướng: mong bà được no, được yên", primary: true, fn: () => {
        K.dropItem("bat_com"); K.grow("tham", -2.5); K.grow("tin", 2);
        if (sound()) NightAudio.bell(0.8);
        if (!clocked) {
          q.step = "release"; K.save(); K.closeSheet();
          petaScene(!!q.shared);
          return;
        }
        q.step = "alms_given";
        K.save();
        almsFarewell();
      } }],
    });
  }
  function almsFarewell() {
    const q = Q("peta");
    // Older checkpoints could lose the bowl after the gift but before this sheet was closed.
    if (q.step === "offer" && !has("bat_com")) { q.step = "alms_given"; K.save(); }
    K.showSheet({
      label: "Ngõ làng",
      lines: ["“Phần phước này, xin gửi tới bà ngoại bên mộ thấp. Mong bà được no, được an.”", "Sư già ôm bát đi tiếp, chậm như lúc đến."],
      choices: [{ label: "Chắp tay tiễn sư", primary: true, fn: () => {
        if (q.step !== "alms_given") return;
        const shared = !!q.shared;
        q.step = "dedicated";
        q.shared = false;
        K.save();
        K.closeSheet();
        Save.log("Đã đặt cơm vào bát của sư già và hồi hướng cho bà ngoại.");
        const after = () => { K.cooldown(2500); toast("Chạng vạng, quay lại ngôi mộ thấp xem bà thế nào."); };
        if (shared) K.award("khong_tham", "Người này sớt phần cơm sáng của mình vào bát để gửi phước cho bà.", after);
        else after();
      } }],
    });
  }
  // Dusk after the dedication: she brightens and dissolves (the legacy path plays this at once instead).
  function petaRelease() { petaScene(false); }

  // ---------- địa thần at the village gate ----------
  function earthMeet() {
    const q = Q("earth");
    fx.earth = 0;
    K.showSheet({
      label: "Cổng làng",
      lines: ["Mặt đất ấm lên. Đom đóm xếp thành vòng. Một ông lão râu tóc bạc phơ chống gậy hiện ra.", "“Người giữ lòng ngay thì đất cũng thương. Cầm lấy ngọn đèn này.”", "“Phía đông có một tảng đá lớn. Ai chịu ngồi yên bên nó sẽ thấy điều người vội không thấy. Đèn chỉ sáng khi lòng không sợ.”"],
      choices: [
        { label: "Nhận ngọn đèn", primary: true, fn: () => {
          q.step = "done"; K.giveItem("den_nho"); K.save(); K.closeSheet(); K.setOpen(true);
          K.gotItem("den_nho", () => { K.setOpen(false); K.cooldown(2500); });
        } },
        { label: "Xem tâm vị ấy", fn: () => mindOf("dia_than", earthMeet) },
      ],
    });
  }

  // ---------- the cave of hungry ghosts ----------
  const CAVE = [
    { line: "Đèn soi lên vách đá ẩm. Một bóng gầy ngồi co ro: “Xưa tôi giấu cơm, nói với sư là nhà hết gạo.”" },
    { line: "Sâu hơn, một bóng khác cúi gằm: “Cả đời tôi cân thiếu cho người nghèo. Giờ tay tôi chẳng cầm được gì.”" },
  ];
  // The cave is hidden: only a big boulder shows. Sitting quietly beside it, one feels cold air from behind and finds the opening.
  function boulderVisit() {
    const q = Q("cave");
    K.showSheet({
      label: "Tảng đá lớn",
      lines: ["Một tảng đá lớn phủ rêu, mặt đá mát lạnh. Xung quanh im ắng."],
      choices: [
        { label: "Ngồi xuống nghỉ một lát", primary: true, fn: () => {
          K.showSheet({ label: "Tảng đá lớn", lines: ["Người này ngồi tựa lưng vào đá, thở chậm lại…"], choices: [] });
          api().setPose && api().setPose("sit");
          setTimeout(() => {
            api().setPose && api().setPose(null);
            q.found = true; K.save(); syncCave();
            window.Milestones && Milestones.notify("cave", {});
            if (sound()) NightAudio.sigh && NightAudio.sigh();
            World.lookAt(place("hang").y - 30, place("hang").x);
            K.showSheet({
              label: "Tảng đá lớn",
              lines: ["Có luồng gió lạnh lùa qua khe đá sau lưng.", "Người này quay lại nhìn: sau tảng đá là một khe hở tối om, rộng vừa một người. Một cái hang!"],
              choices: [{ label: "Lại gần miệng hang", primary: true, fn: () => { World.resetLook(); caveEnter(); } }, { label: "Để lúc khác", fn: () => { World.resetLook(); snooze(q); K.closeSheet(); } }],
            });
          }, 3200);
        } },
        { label: "Đi tiếp", fn: () => { snooze(q, 90000); K.closeSheet(); } },
      ],
    });
  }
  function syncCave() {
    const found = !!Q("cave").found;
    World.setView({ caveFound: found });
    if (place("hang")) place("hang").name = found ? "Hang đá" : "Tảng đá lớn";
  }
  function caveEnter() {
    const q = Q("cave");
    if (!has("den_nho")) {
      snooze(q, 40000);
      return K.showSheet({ label: "Hang đá", lines: ["Miệng hang tối om, gió lạnh thổi ra.", "Không có đèn thì chẳng thấy gì. Người làng nói địa thần ở cổng làng có đèn cho người ngay thẳng."], choices: [{ label: "Quay ra", fn: K.closeSheet }] });
    }
    let lamp = 3, i = 0;
    const lampText = () => ["Đèn tắt.", "Đèn leo lét.", "Đèn sáng mờ.", "Đèn sáng ấm."][lamp];
    const chamber = () => {
      if (i >= CAVE.length) return deepest();
      K.showSheet({
        label: `Hang đá · ${lampText()}`,
        lines: [CAVE[i].line],
        choices: [
          { label: "Hoảng sợ, lùi lại", fn: () => { lamp--; K.grow("san", 1); step(); } },
          { label: "Biết mình đang sợ, thở một hơi", fn: () => { K.grow("niem", 1.5); step(); } },
          { label: "Thương họ, chắp tay", primary: true, fn: () => { K.grow("san", -1); K.grow("tham", -0.5); step(); } },
        ],
      });
    };
    const step = () => {
      if (lamp <= 0) {
        K.save();
        return K.showSheet({ label: "Hang đá", lines: ["Đèn tắt. Người này lần theo vách đá ra ngoài, tim đập thình thịch.", "Lần sau, thử biết nỗi sợ thay vì chạy theo nó."], choices: [{ label: "Ra ngoài", fn: () => { snooze(q, 30000); K.closeSheet(); } }] });
      }
      i++; chamber();
    };
    const deepest = () => {
      K.showSheet({
        label: `Hang đá · ${lampText()}`,
        lines: ["Cuối hang, một bóng nhỏ ngồi ôm gối, tay cầm một mảnh giấy cũ.", "“Có cô bé tên Hạnh từng làm rơi cái này ở nghĩa địa. Tôi giữ mãi, giờ đưa lại cho người.”"],
        choices: [{ label: "Nhận mảnh giấy, chắp tay", primary: true, fn: () => {
          q.step = "done"; K.giveItem("manh_ky_uc"); K.save(); K.closeSheet(); K.setOpen(true);
          K.gotItem("manh_ky_uc", () => K.award("bi", "Người này đi sâu vào hang, gặp những hồn đói mà không bỏ chạy, chỉ thấy thương.", () => K.cooldown(4000)));
        } }],
      });
    };
    K.showSheet({
      label: "Hang đá",
      lines: ["Ngọn đèn nhỏ của địa thần sáng lên. Lối vào hang hun hút."],
      choices: [{ label: "Bước vào", primary: true, fn: chamber }, { label: "Để lúc khác", fn: () => { snooze(q); K.closeSheet(); } }],
    });
  }

  // ---------- lotus pond ----------
  function pondVisit() {
    const q = Q("pond");
    snooze(q, 8 * 60000);
    if (night()) { q.moon = true; K.save(); }
    const choices = [
      { label: "Ngồi ngắm một lát", primary: true, fn: () => { K.grow("niem", 0.8); K.grow("dinh", 0.8); K.closeSheet(); api().swingMood(0.25); toast("Người này ngồi yên. Gió mát, lòng lắng xuống như mặt ao."); } },
    ];
    if (villageRole() && !has("hoa_sen")) choices.push({ label: "Hái nhẹ một đóa sen trắng", fn: () => { K.giveItem("hoa_sen"); K.save(); K.closeSheet(); K.setOpen(true); K.gotItem("hoa_sen", () => { K.setOpen(false); K.cooldown(2500); toast("Có thể dâng hoa lên bàn thờ ở tịnh thất."); }); } });
    choices.push({ label: "Đi tiếp", fn: K.closeSheet });
    K.showSheet({ label: "Ao sen", lines: night() ? ["Mặt ao lặng. Trăng in dưới nước, sen trắng khép cánh.", "Có tiếng ếch kêu đâu đó."] : ["Ao sen xanh mát. Chuồn chuồn đậu trên lá."], choices });
  }
  function offerLotus() {
    K.showSheet({
      label: "Tịnh thất",
      lines: ["Người này đặt đóa sen trắng lên bàn thờ, chắp tay đảnh lễ."],
      choices: [{ label: "Đảnh lễ ba lần", primary: true, fn: () => {
        K.dropItem("hoa_sen"); K.grow("tin", 2.5); K.save(); K.closeSheet(); api().swingMood(0.3);
        if (sound()) NightAudio.bell(0.7);
        K.award("hy", "Người này dâng hoa lên Đức Phật, lòng vui và nhẹ.", () => K.cooldown(2500));
      } }, { label: "Để sau", fn: () => { snooze(Q("lotus")); K.closeSheet(); } }],
    });
  }

  // ---------- the old stupa and the heavenly palace ----------
  function stupaVisit() {
    const q = Q("palace");
    if (!has("mandarava") || !night()) {
      snooze(q, 60000);
      return K.showSheet({ label: "Tháp cổ", lines: ["Ngọn tháp cổ phủ rêu, gạch đã sẫm màu.", "Người làng kể: đêm khuya, ai mang hoa trời thì thấy được lối lên."], choices: [{ label: "Chắp tay rồi đi", fn: K.closeSheet }] });
    }
    K.showSheet({
      label: "Tháp cổ",
      lines: ["Bông hoa mạn-đà-la trong túi sáng lên. Quanh tháp cổ hiện ra một lối sáng dẫn lên mây."],
      choices: [{ label: "Bước vào", primary: true, fn: enterPalace }, { label: "Để lúc khác", fn: () => { snooze(q); K.closeSheet(); } }],
    });
  }
  function enterPalace() {
    const q = Q("palace");
    K.closeSheet(); K.setOpen(true);
    if (!window.Palace) { K.setOpen(false); return toast("Lối lên thiên cung chưa mở được."); }
    if (sound()) NightAudio.bell(1);
    Palace.open({
      host: "Vị thiên",
      lines: ["Ánh sáng mở ra một tòa lâu đài trên mây.", "“Chào người lành. Xưa tôi chỉ quét sân chùa làng và thắp một ngọn đèn mỗi tối.”", "“Chừng ấy việc nhỏ mà thành chốn này.”"],
      steps: [{ text: "Một thiên nữ vội vàng làm đổ nước cam lồ lên áo người này.", choices: [{ label: "Bực bội, quát lên", outcome: "fade" }, { label: "Cười xòa, không sao", outcome: "stay" }] }],
      onEnd: (outcome) => {
        q.visits = (q.visits || 0) + 1;
        if (outcome === "stay") {
          q.step = "done"; K.grow("tin", 2); K.grow("san", -1); K.save();
          window.Milestones && Milestones.notify("palace", { outcome });
          setTimeout(() => { K.award("tuy_hy", "Người này thấy vị thiên an vui nhờ việc thiện nhỏ, và vui theo.", () => { K.setOpen(false); K.cooldown(4000); }); }, 400);
        } else if (outcome === "fade") {
          K.grow("san", 2); K.save();
          setTimeout(() => { K.setOpen(false); K.cooldown(4000); toast("Tòa lâu đài tan vào sương. Người này đứng một mình bên tháp cổ. Tâm nào thì cõi nấy."); api().swingMood(-0.2); }, 2400);
        } else { K.setOpen(false); K.cooldown(4000); }
        snooze(q, 5 * 60000);
      },
    });
  }

  // ---------- registration ----------
  Mind.register({
    actors() {
      const out = [];
      if (!K.role()) return out;
      const tq = Q("tree");
      if (villageRole() && dusk() && tq.step !== "done") out.push({ kind: "treegod", ...spot.tree(), alpha: 0.85, label: "thọ thần" });
      else if (villageRole() && night() && tq.step === "done") out.push({ kind: "treegod", ...spot.tree(), alpha: 0.5, label: "" });
      // the child stays hidden in the bamboo until the player is close enough to hear and see them
      if (villageRole() && tq.step === "child") { const p = World.getPlayer(), c = spot.child(); if (Math.hypot(p.x - c.x, p.y - c.y) <= 90) out.push({ kind: "child", ...c, crying: true, label: "bé Na" }); }
      if (villageRole() && tq.step === "follow") { const p = World.getPlayer(); out.push({ kind: "child", x: p.x - 16, y: p.y + 4, moving: p.moving, crying: !!tq.scared, label: "bé Na" }); }
      // Once the child is home the mother is home too at night; she only waits in the lane while the quest needs her.
      if (villageRole() && (tq.step === "follow" || tq.step === "thank" || (tq.step === "done" && !night()))) out.push({ kind: "mother", ...spot.mother(), label: "mẹ bé Na" });
      if (villageRole()) {
        const pq = Q("peta");
        if (fx.peta) out.push({ kind: "peta", ...spot.peta(), glow: Math.min(1, fx.peta.t / 3), alpha: Math.max(0, 1 - Math.max(0, fx.peta.t - 3) / 1.5), label: "bà ngoại" });
        else if ((night() || (pq.step === "dedicated" && dusk())) && pq.step !== "done" && pq.step !== "release") out.push({ kind: "peta", ...spot.peta(), label: pq.step === "none" ? "" : "bà ngoại" });
        const dogStep = K.S.quest.step;
        if (phase() !== null) {
          // the old monk passes the lane only in the morning, and only while the bowl is still to be given
          if (["offer", "alms_given"].includes(pq.step) && morning()) out.push({ kind: "monk", ...spot.alms(), label: "sư già" });
        } else if ((pq.step === "offer" || pq.step === "release") && !["monk", "sit", "deva", "done"].includes(dogStep)) out.push({ kind: "monk", ...K.MONK_SPOT(), label: "sư già" });
      }
      const eq = Q("earth");
      if (villageRole() && eq.step !== "done" && earthReady()) out.push({ kind: "earthgod", ...spot.earth(), alpha: Math.min(1, fx.earth), label: fx.earth > 0.6 ? "địa thần" : "" });
      return out;
    },
    targets() {
      const out = [];
      const tq = Q("tree"), pq = Q("peta");
      // the whole bamboo grove is the errand, not the child's exact spot: the player follows the sound
      if (villageRole() && tq.step === "child") out.push({ title: "Lần theo tiếng khóc", body: "Tiếng khóc nhỏ vọng ra từ bụi tre. Đi quanh đó và lắng nghe.", ...stand(P().bamboo, 0, 20), name: "Bụi tre" });
      if (villageRole() && tq.step === "follow") out.push({ title: "Đưa bé Na về ngõ làng", body: "Mẹ bé đang đứng chờ ở ngõ làng.", ...stand(spot.mother()), name: "Mẹ bé Na" });
      if (villageRole() && tq.step === "thank") out.push({ title: "Quay lại gốc cây gạo", body: dusk() ? "Thọ thần đang đợi ở gốc gạo." : "Thọ thần chỉ hiện ra lúc chạng vạng trở đi.", ...stand(spot.tree(), -30, 10), name: "Thọ thần" });
      if (villageRole()) {
        const clocked = phase() !== null;
        const granny = (title, body) => out.push({ title, body, ...stand(spot.granny(), -26, 10), name: "Bà cụ" });
        if (pq.step === "rice") {
          if (clocked && !pq.told) granny("Hỏi bà cụ ở giếng", "Bà sống ở làng lâu nhất. Bà có thể biết cách giúp bà ngoại.");
          else if (clocked && !morning()) granny("Sáng mai ra giếng xới cơm", night() ? "Bà cụ nấu nồi cơm mới vào buổi sáng. Kết thúc đêm rồi quay lại." : "Bà cụ nấu nồi cơm mới vào buổi sáng. Sáng mai quay lại.");
          else granny("Xới một bát cơm ở giếng làng", "Để dâng sư già rồi gửi phước cho bà ngoại.");
        }
        if (pq.step === "offer" && clocked) out.push({ title: "Đặt cơm vào bát của sư già", body: morning() ? "Sư già đang đi ngang ngõ làng." : night() ? "Sư chỉ nhận cơm buổi sáng. Kết thúc đêm rồi ra ngõ làng." : "Sư chỉ nhận cơm buổi sáng. Sáng mai ra ngõ làng.", ...stand(spot.alms(), 0, 30), name: "Sư già" });
        else if (pq.step === "offer") out.push({ title: "Dâng cơm cho sư già", body: "Sư già ngồi giữa các ngôi mộ.", ...stand(K.MONK_SPOT(), 30, 4), name: "Sư già" });
        if (pq.step === "alms_given") out.push({ title: "Lời hồi hướng ở ngõ làng", body: "Bát cơm đã được dâng. Trở lại ngõ để tiếp tục.", ...stand(spot.alms(), 0, 30) });
        if (pq.step === "dedicated") out.push({ title: "Quay lại ngôi mộ thấp", body: dusk() ? "Bà ngoại vẫn đứng đó." : "Bà chỉ hiện lúc chạng vạng. Chờ chiều tàn, hoặc sang đêm mới.", ...stand(spot.peta(), 0, 30) });
      }
      if (villageRole() && has("hoa_sen")) out.push({ title: "Dâng sen ở tịnh thất", body: "Đóa sen trắng đặt lên bàn thờ Đức Phật.", ...stand(P().hermitage, 0, 30), name: "Tịnh thất" });
      // rumours: no marker, only a hint and a way there
      if (villageRole() && tq.step === "none") out.push({ title: "Chuyện lạ ở gốc cây gạo", body: "Người làng kể lúc chạng vạng, lá cây gạo có khi sáng lên.", ...stand(P().gao, 0, 30) });
      if (K.role() === "ghost") {
        const gm = Q("ghost_memory").step || "none";
        if (gm !== "done") {
          const pt = gm === "none" ? spot.tree() : gm === "bamboo" ? spot.child() : gm === "wall" ? P().hermitage : spot.peta();
          out.push({ title: "Tiếng guốc trong sương", body: "Bà Sáu nhìn lại ký ức về Hạnh; không thể dẫn trẻ hay chạm vào người sống.", ...stand(pt, 0, 30) });
        }
      }
      if (villageRole() && pq.step === "none") out.push({ title: "Bóng người bên ngôi mộ thấp", body: "Ban đêm, có ai đó đứng mãi giữa nghĩa địa.", ...stand(spot.peta(), 0, 30) });
      if (villageRole() && place("hang") && Q("cave").step !== "done") {
        if (Q("cave").found) out.push({ title: "Hang đá sau tảng đá", body: has("den_nho") ? "Mang ngọn đèn của địa thần vào hang." : "Trong hang tối om. Cần một ngọn đèn.", ...stand(place("hang"), 0, 30), name: "Hang đá" });
        else if (has("den_nho")) out.push({ title: "Tảng đá lớn phía đông", body: "Địa thần nói: ai chịu ngồi yên bên tảng đá sẽ thấy điều người vội không thấy.", ...stand(place("hang"), 0, 30) });
      }
      if (villageRole() && has("mandarava") && Q("palace").step !== "done" && place("thap")) out.push({ title: "Tháp cổ trên đồi", body: night() ? "Hoa mạn-đà-la có thể mở lối lên thiên cung." : "Đợi đêm xuống rồi mang hoa mạn-đà-la tới tháp cổ.", ...stand(place("thap"), 0, 30), name: "Tháp cổ" });
      return out;
    },
    loop() {
      if (!K.role()) return false;
      if (!!Q("cave").found !== !!World.getMap().caveFound) syncCave();
      const near = K.near;
      const tq = Q("tree");
      if (villageRole()) cryTick(tq);
      // A scene that STARTS a story is only offered (K.offer): the player taps to open it, and "Để sau" just closes it.
      // A step of an errand the player already took on opens on arrival, as before.
      if (villageRole()) {
        if (tq.step === "none" && dusk() && near(spot.tree(), 60)) return K.offer("tree", "Lại gần gốc gạo", treeMeet);
        if (!snoozed(tq)) {
          if (tq.step === "child" && near(spot.child(), 40)) { childFound(); return true; }
          if (tq.step === "follow" && near(spot.mother(), 44)) { childHome(); return true; }
          if (tq.step === "thank" && dusk() && near(spot.tree(), 60)) { treeThanks(); return true; }
        }
      }
      if (K.role() === "ghost") {
        const gm = Q("ghost_memory");
        if (gm.step !== "done") {
          const step = gm.step || "none";
          const pt = step === "none" ? spot.tree() : step === "bamboo" ? spot.child() : step === "wall" ? P().hermitage : spot.peta();
          if ((step !== "none" || dusk()) && near(pt, 54)) return K.offer("ghost_memory", "Dừng lại lắng nghe", ghostMemory);
        }
      }
      if (villageRole()) {
        const pq = Q("peta");
        if (pq.step === "none" && night() && near(spot.peta(), 50)) return K.offer("peta", "Đến gần bóng người", petaMeet);
        if (!snoozed(pq)) {
          if (pq.step === "rice" && near(spot.granny(), 44)) {
            if (arrivalVillager()) return K.offer("peta_rice", morning() ? "Ra giếng xới cơm" : "Hỏi bà cụ cách giúp", grannyRice);
            grannyRice(); return true;
          }
          if (pq.step === "alms_given" && phase() !== null && near(spot.alms(), 50)) return K.offer("peta_farewell", "Tiếp tục lời hồi hướng", almsFarewell);
          if (pq.step === "offer" && (phase() === null ? near(K.MONK_SPOT(), 54) : morning() && near(spot.alms(), 50))) {
            if (arrivalVillager()) return K.offer("peta_alms", "Đến bên vị sư", offerRice);
            offerRice(); return true;
          }
          if (pq.step === "dedicated" && phase() !== null && dusk() && !fx.peta && near(spot.peta(), 50)) {
            if (arrivalVillager()) return K.offer("peta_release", "Trở lại bên mộ thấp", petaRelease);
            petaRelease(); return true;
          }
        }
      }
      const eq = Q("earth");
      if (eq.step !== "done" && earthReady() && near(spot.earth(), 56)) return K.offer("earth", "Dừng lại ở cổng làng", earthMeet);
      const cq = Q("cave");
      if (villageRole() && place("hang") && cq.step !== "done" && !snoozed(cq) && near(place("hang"), 50)) return cq.found ? K.offer("cave", "Vào hang đá", caveEnter) : K.offer("boulder", "Xem tảng đá lớn", boulderVisit);
      // The pond, the cave and the stupa keep their own rest time after a visit (snooze), so they are not offered again at once.
      if (place("ao") && !snoozed(Q("pond")) && near(place("ao"), 64)) return K.offer("pond", "Ra bờ ao", pondVisit);
      if (villageRole() && has("hoa_sen") && near(P().hermitage, 50)) return K.offer("lotus", "Dâng sen ở tịnh thất", offerLotus);
      if (villageRole() && place("thap") && !snoozed(Q("palace")) && near(place("thap"), 52)) return K.offer("stupa", "Xem tháp cổ", stupaVisit);
      return false;
    },
    fx(ctx, v, dt) {
      if (!K.role()) return;
      // glowing leaves drifting around the silk-cotton tree while the tree spirit is near
      if (villageRole() && dusk() && Q("tree").step !== "done") {
        const g = P().gao;
        if (fx.sparks.length < 26 && Math.random() < 0.5) fx.sparks.push({ x: g.x - 40 + Math.random() * 110, y: g.y - 70 - Math.random() * 60, v: 6 + Math.random() * 10, t: 0, life: 3 + Math.random() * 2 });
      }
      if (fx.cry) {
        // a faint ripple from the player's spot, a little brighter when the crying is near
        fx.cry.t += dt;
        const p = World.getPlayer(), k = Math.max(0, 1 - fx.cry.t / 1.2);
        if (fx.cry.t > 1.2) fx.cry = null;
        else {
          const near = 1 - Math.min(1, fx.cry.d / 260), r = Math.min(1, fx.cry.t / 1.2) * 70;
          ctx.globalCompositeOperation = "lighter";
          ctx.strokeStyle = `rgba(220,235,200,${(0.18 + 0.2 * near) * k})`; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "lighter";
      for (const s of fx.sparks) {
        s.t += dt; s.y += s.v * dt; s.x += Math.sin(s.t * 2 + s.v) * 0.3;
        const a = Math.sin(Math.PI * Math.min(1, s.t / s.life)) * (1 - 0.6 * v.dayMix);
        ctx.fillStyle = `rgba(210,240,150,${0.75 * a})`;
        ctx.beginPath(); ctx.ellipse(s.x, s.y, 2.4, 1.3, s.t, 0, 7); ctx.fill();
      }
      fx.sparks = fx.sparks.filter((s) => s.t < s.life);
      if (fx.peta) {
        fx.peta.t += dt;
        const p = spot.peta(), k = Math.min(1, fx.peta.t / 3) * Math.max(0, 1 - Math.max(0, fx.peta.t - 3.5) / 1.5);
        const g = ctx.createRadialGradient(p.x, p.y - 20, 0, p.x, p.y - 20, 90);
        g.addColorStop(0, `rgba(255,244,214,${0.45 * k})`); g.addColorStop(1, "rgba(255,244,214,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y - 20, 90, 0, 7); ctx.fill();
      }
      if (Q("earth").step !== "done" && earthReady()) {
        fx.earth = Math.min(1, fx.earth + dt * 0.5);
        const e = spot.earth();
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 60);
        g.addColorStop(0, `rgba(240,200,130,${0.2 * fx.earth})`); g.addColorStop(1, "rgba(240,200,130,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(e.x, e.y, 60, 26, 0, 0, 7); ctx.fill();
      } else fx.earth = 0;
      ctx.globalCompositeOperation = "source-over";
    },
  });
  // địa thần shows up for someone who has already done a kind deed, at dusk or night, with a fairly bright mind
  function earthReady() {
    const did = Q("tree").step === "done" || Q("peta").step === "done" || K.S.quest.step === "done" ||
      (arrivalVillager() && (Q("villagerWeek").herbs === "delivered" || Q("villagerWeek").lamp === "pc"));
    return villageRole() && did && dusk() && api() && api().mood() >= 0.5;
  }
})();

// ---------- a horse cart passing along the road now and then ----------
// An old trader drives it slowly from the village up to the hermitage (or back). Walk up to it to talk:
// hear news from the road, help push a stuck wheel, or swap a gift. Nothing is bought or sold.
(() => {
  const K = Mind.kit;
  const api = () => K.api();
  const cart = { on: false, d: 0, dir: 1, speed: 24, wait: 25 + Math.random() * 30, stuckAt: -1, stuck: false, talked: false, pause: false, phase: 0 };
  let path = null, segs = null, total = 0;
  function buildPath() {
    const m = World.getMap();
    path = m.path.map(([x, y]) => ({ x, y }));
    segs = []; total = 0;
    for (let i = 0; i < path.length - 1; i++) { const l = Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y); segs.push(l); total += l; }
  }
  function at(d) {
    let rest = Math.max(0, Math.min(total, d));
    for (let i = 0; i < segs.length; i++) {
      if (rest <= segs[i]) { const t = rest / segs[i], a = path[i], b = path[i + 1]; return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, dx: b.x - a.x, dy: b.y - a.y }; }
      rest -= segs[i];
    }
    const a = path[path.length - 2], b = path[path.length - 1];
    return { x: b.x, y: b.y, dx: b.x - a.x, dy: b.y - a.y };
  }
  const RUMOURS = [
    "“Đi ngang hang đá sau đồi, tôi nghe như có tiếng người than đói.”",
    "“Đêm rằm, người ta thấy ánh sáng quanh cái tháp cổ trên đồi.”",
    "“Ao sen đầu làng mà trăng lên thì đẹp lắm, ngồi đó lòng nhẹ hẳn.”",
    "“Cây gạo già ấy có thần đấy. Chạng vạng mà thấy lá sáng thì chớ sợ.”",
    "“Trên đường, tôi gặp một vị sư đi khất thực từ sáng sớm, chân không, mà mặt an lắm.”",
  ];
  function talk() {
    cart.pause = true;
    const S = K.S;
    S.q.cart = { ...(S.q.cart || {}), met: true }; K.save();
    const has = (id) => S.items.includes(id);
    const done = () => { cart.talked = true; cart.pause = false; cart.stuck = false; K.closeSheet(); };
    const choices = [];
    if (cart.stuck) choices.push({ label: "Ghé vai đẩy giúp", primary: true, fn: () => {
      K.grow("tan", 1.5); K.grow("tham", -0.5);
      cart.talked = true; cart.stuck = false; cart.pause = false; K.closeSheet(); api().swingMood(0.15);
      if (!has("khan_ran") && window.Items && Items.def("khan_ran")) {
        K.giveItem("khan_ran"); K.save(); K.setOpen(true);
        K.gotItem("khan_ran", () => { K.setOpen(false); K.cooldown(2500); api().toast("“Cảm ơn nhé! Cái khăn rằn này tặng người, đi đêm cho ấm.”"); });
      } else api().toast("Bánh xe lên khỏi ổ gà. Ông lái buôn cười, vẫy tay cảm ơn.");
    } });
    choices.push({ label: "Hỏi chuyện đường xa", fn: () => {
      // a rumour about something this character has not heard of yet goes into the discovery book
      const r = window.Discover && Discover.rumour();
      const lines = r ? [r.rumour, "(Đã ghi vào Sổ khám phá.)"] : [RUMOURS[Math.floor(Math.random() * RUMOURS.length)]];
      K.showSheet({ label: "Xe ngựa", lines, choices: [{ label: "Cảm ơn ông", fn: done }] });
    } });
    if (has("rau_ma") && !has("banh_da")) choices.push({ label: "Tặng ông nắm rau má", fn: () => {
      K.dropItem("rau_ma"); K.giveItem("banh_da"); K.grow("tham", -1.5); K.save(); cart.talked = true; cart.pause = false; K.closeSheet(); K.setOpen(true);
      K.gotItem("banh_da", () => K.cooldown(2500));
    } });
    choices.push({ label: "Chào ông rồi đi", fn: done });
    K.showSheet({
      label: "Xe ngựa",
      lines: cart.stuck
        ? ["Bánh xe ngựa sa xuống ổ gà. Ông lái buôn đội nón, loay hoay đẩy mãi.", "“Ai đó giúp một tay với!”"]
        : ["Chiếc xe ngựa chậm rãi đi tới, đèn treo đung đưa. Ông lái buôn ghìm cương.", "“Đi đâu mà giờ này còn ngoài đường thế?”"],
      choices,
    });
  }
  function drawCart(ctx, v, p) {
    const night = 1 - v.dayMix;
    const shade = (r, g, b) => `rgb(${Math.round(r * (1 - 0.45 * night))},${Math.round(g * (1 - 0.45 * night))},${Math.round(b * (1 - 0.4 * night))})`;
    const f = p.dx >= 0 ? 1 : -1;
    const legs = cart.on && !cart.pause && !cart.stuck ? Math.sin(cart.phase * 9) : 0;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(f, 1);
    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(4, 2, 36, 6, 0, 0, 7); ctx.fill();
    // horse (in front)
    ctx.fillStyle = shade(122, 82, 52);
    for (const [lx, ph] of [[18, 1], [22, -1], [30, -1], [34, 1]]) ctx.fillRect(lx + legs * ph * 1.6, -10, 2.4, 10);
    ctx.beginPath(); ctx.ellipse(26, -14, 11, 6, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(33, -17); ctx.lineTo(39, -27); ctx.lineTo(43, -25); ctx.lineTo(38, -14); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(42, -25, 4.2, 2.6, 0.3, 0, 7); ctx.fill();
    ctx.fillStyle = shade(60, 40, 26); ctx.fillRect(15, -18, 2, 7); // tail
    ctx.beginPath(); ctx.moveTo(34, -22); ctx.lineTo(37, -28); ctx.lineTo(35, -21); ctx.fill(); // mane
    // shafts
    ctx.strokeStyle = shade(90, 66, 40); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-2, -12); ctx.lineTo(24, -14); ctx.stroke();
    // cart body with a curved roof (mui)
    ctx.fillStyle = shade(140, 98, 58); ctx.fillRect(-26, -22, 28, 12);
    ctx.fillStyle = shade(96, 70, 44);
    ctx.beginPath(); ctx.moveTo(-28, -22); ctx.quadraticCurveTo(-12, -40, 4, -22); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = shade(70, 50, 30); ctx.lineWidth = 0.8;
    for (let k = -22; k <= 0; k += 6) { ctx.beginPath(); ctx.moveTo(k, -22); ctx.quadraticCurveTo(k + 2, -32, k + 4, -22); ctx.stroke(); }
    // sacks
    ctx.fillStyle = shade(196, 178, 130); ctx.beginPath(); ctx.ellipse(-18, -23, 5, 3.4, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(-10, -24, 4.4, 3, 0, 0, 7); ctx.fill();
    // wheels with turning spokes
    const rot = cart.phase * 2.4;
    for (const wx of [-20, -2]) {
      ctx.strokeStyle = shade(60, 44, 28); ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(wx, -6, 6.5, 0, 7); ctx.stroke();
      ctx.lineWidth = 0.9;
      for (let s = 0; s < 4; s++) { const a = rot + s * Math.PI / 4; ctx.beginPath(); ctx.moveTo(wx + Math.cos(a) * 6, -6 + Math.sin(a) * 6); ctx.lineTo(wx - Math.cos(a) * 6, -6 - Math.sin(a) * 6); ctx.stroke(); }
    }
    // driver with a conical hat
    ctx.fillStyle = shade(70, 84, 88); ctx.fillRect(4, -30, 7, 10);
    ctx.fillStyle = shade(180, 140, 100); ctx.beginPath(); ctx.arc(7.5, -33, 3, 0, 7); ctx.fill();
    ctx.fillStyle = shade(214, 196, 140); ctx.beginPath(); ctx.moveTo(1, -34); ctx.lineTo(7.5, -42); ctx.lineTo(14, -34); ctx.closePath(); ctx.fill();
    // hanging lantern
    const sw = Math.sin(v.time * 2.2) * 1.4;
    ctx.strokeStyle = shade(70, 50, 30); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-28, -24); ctx.lineTo(-30 + sw, -16); ctx.stroke();
    ctx.fillStyle = "#e6c56f"; ctx.fillRect(-32.5 + sw, -16, 5, 6);
    ctx.restore();
    if (night > 0.3) {
      ctx.globalCompositeOperation = "lighter";
      const lx = p.x + f * -30, ly = p.y - 13;
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 46);
      g.addColorStop(0, `rgba(230,180,100,${0.32 * night})`); g.addColorStop(1, "rgba(230,180,100,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, 46, 0, 7); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    if (cart.stuck && !cart.talked) {
      ctx.font = '500 9px "Be Vietnam Pro", system-ui, sans-serif'; ctx.textAlign = "center";
      ctx.fillStyle = v.dayMix > 0.5 ? "#3a2a10" : "rgba(230,197,111,0.95)";
      ctx.fillText("xe sa lầy", p.x, p.y - 50);
    }
  }
  Mind.register({
    loop() {
      if (!["monk", "villager"].includes(K.role()) || !cart.on || cart.talked || cart.pause) return false;
      const p = at(cart.d);
      if (K.near(p, 42)) { talk(); return true; }
      return false;
    },
    targets() {
      if (!["monk", "villager"].includes(K.role()) || !cart.on || cart.talked) return [];
      const p = at(cart.d);
      return [{ title: cart.stuck ? "Xe ngựa sa lầy trên đường" : "Xe ngựa đang đi qua", body: cart.stuck ? "Ông lái buôn cần người đẩy giúp." : "Lại gần để bắt chuyện với ông lái buôn.", x: p.x + 30, y: p.y + 10 }];
    },
    fx(ctx, v, dt) {
      if (!K.role()) { cart.on = false; return; }
      if (!path) buildPath();
      if (!cart.on) {
        cart.wait -= dt;
        if (cart.wait > 0) return;
        Object.assign(cart, { on: true, dir: Math.random() < 0.6 ? -1 : 1, talked: false, stuck: false, pause: false });
        cart.d = cart.dir < 0 ? total - 10 : 10; // dir -1: from the village end up toward the hermitage
        cart.stuckAt = Math.random() < 0.4 ? total * (0.25 + Math.random() * 0.5) : -1;
      }
      if (!cart.pause && !cart.stuck) {
        cart.d += cart.dir * cart.speed * dt;
        cart.phase += dt;
        if (cart.stuckAt > 0 && Math.abs(cart.d - cart.stuckAt) < 3) { cart.stuck = true; cart.stuckUntil = performance.now() + 45000; cart.stuckAt = -1; }
      }
      if (cart.stuck && !cart.pause && performance.now() > cart.stuckUntil) cart.stuck = false; // gets out by himself eventually
      if (cart.d < 0 || cart.d > total) { cart.on = false; cart.wait = 70 + Math.random() * 110; return; }
      const p = at(cart.d);
      if (p.y > v.camY - 80 && p.y < v.camY + v.viewH + 80) drawCart(ctx, v, p);
    },
  });
  window.Cart = { spawn() { cart.wait = 0; cart.on = false; }, stuck() { cart.wait = 0; cart.on = false; setTimeout(() => { cart.stuckAt = -1; cart.stuck = true; cart.stuckUntil = performance.now() + 60000; }, 50); } };
})();


// ---------- discovery book: what can be found, shown as unknown → heard of → met ----------
window.Discover = (() => {
  const K = Mind.kit;
  const q = (k) => (K.S.q && K.S.q[k]) || {};
  const api = () => K.api();
  const dark = () => (api() ? api().darkness() : 0);
  const mood = () => (api() ? api().mood() : 0.5);
  const has = (id) => K.S.items.includes(id);
  const village = () => ["monk", "villager"].includes(K.role());
  const did = () => q("tree").step === "done" || q("peta").step === "done" || K.S.quest?.step === "done" ||
    (api()?.villagerArrival?.() && (q("villagerWeek").herbs === "delivered" || q("villagerWeek").lamp === "pc"));
  // cond icons: 🌇 from dusk, 🌙 at night, ✨ bright mind, 🪔/🌸 needs an item, 🧘 sit quietly, 🤝 after a kind deed
  const ENTRIES = [
    { id: "cho", title: "Con chó nhà ông Tư", place: "village", conds: [], hint: "Ở ngõ làng, có kẻ không ưa người lạ.", rumour: "“Con chó nhà ông Tư dữ lắm, đi qua ngõ thì cẩn thận.”", seen: () => (K.S.quest.bites || 0) > 0, live: () => village() },
    { id: "su_gia", title: "Vị sư già giữa nghĩa địa", place: "graves", conds: [], hint: "Giữa các ngôi mộ, có người ngồi yên rất lâu.", rumour: "“Có một vị sư già hay ngồi giữa nghĩa địa. Ai ngồi cùng thầy thì lòng lắng xuống.”", seen: () => ["sit", "deva", "done"].includes(K.S.quest.step), live: () => K.S.quest.step === "monk" },
    { id: "chu_thien", title: "Chư thiên", place: "hermitage", conds: ["🌙", "✨"], hint: "Có đêm, ánh sáng từ trời rọi xuống khu rừng.", rumour: "“Đêm khuya ở tịnh thất hay gốc gạo, có người thấy ánh sáng từ trời xuống, hoa rơi như mưa.”", seen: () => (K.S.deva.seen || 0) > 0, live: () => dark() >= 0.5 && mood() >= 0.62 },
    { id: "tho_than", title: "Thọ thần ở gốc gạo", place: "gao", conds: ["🌇"], hint: "Một gốc cây già, lá có khi tự sáng.", rumour: "“Cây gạo già ấy có thần đấy. Chạng vạng mà thấy lá sáng thì chớ sợ.”", seen: () => { const t = q("tree"); return !!t.met || (t.step || "none") !== "none"; }, live: () => dark() >= 0.4 },
    { id: "be_na", title: "Đứa bé lạc", place: "bamboo", conds: [], hint: "Có tiếng khóc nhỏ đâu đó trong bụi tre.", rumour: "“Nhà chị Ba đầu ngõ mấy hôm nay cứ lo con bé hay chạy ra bụi tre.”", seen: () => ["follow", "thank", "done"].includes(q("tree").step), live: () => q("tree").step === "child" },
    { id: "ba_ngoai", title: "Bóng người bên mộ thấp", place: "graves", conds: ["🌙"], hint: "Ban đêm, có ai đó gầy guộc đứng mãi giữa nghĩa địa.", rumour: "“Người làng bảo đêm đêm có bóng bà cụ đứng bên ngôi mộ thấp, như chờ ai.”", seen: () => (q("peta").step || "none") !== "none", live: () => village() && dark() >= 0.5 },
    { id: "dia_than", title: "Địa thần ở cổng làng", place: "gate", conds: ["🤝", "🌇", "✨"], hint: "Có khi mặt đất ở cổng làng ấm lên lạ thường.", rumour: "“Ông bà xưa nói cổng làng có thần đất, chỉ hiện ra với người ngay thẳng, từng làm việc tốt.”", seen: () => q("earth").step === "done", live: () => did() && dark() >= 0.4 && mood() >= 0.5 },
    { id: "hang", title: "Hang bí mật", place: "hang", conds: ["🧘"], hint: "Phía đông có một tảng đá lớn, mát lạnh lạ kỳ.", rumour: "“Tảng đá lớn phía đông ấy như biết thở. Ngồi tựa vào là thấy gió lạnh sau lưng.”", seen: () => !!q("cave").found, live: () => true },
    { id: "day_hang", title: "Đáy hang", place: "hang", conds: ["🪔"], hint: "Sâu trong lòng đất có những người đói lâu năm.", rumour: "“Đi ngang hang đá sau đồi, tôi nghe như có tiếng người than đói.”", seen: () => q("cave").step === "done", live: () => !!q("cave").found && has("den_nho") },
    { id: "ao_trang", title: "Trăng dưới ao sen", place: "ao", conds: ["🌙"], hint: "Ao đầu làng, đêm xuống thì khác hẳn ban ngày.", rumour: "“Ao sen đầu làng mà trăng lên thì đẹp lắm, ngồi đó lòng nhẹ hẳn.”", seen: () => !!q("pond").moon, live: () => dark() >= 0.5 },
    { id: "thien_cung", title: "Thiên cung trên mây", place: "thap", conds: ["🌙", "🌸"], hint: "Ngọn tháp cổ trên đồi, đêm khuya có lúc ánh lên.", rumour: "“Đêm rằm, người ta thấy ánh sáng quanh cái tháp cổ trên đồi. Phải có hoa trời mới thấy lối.”", seen: () => (q("palace").visits || 0) > 0, live: () => dark() >= 0.5 && has("mandarava") },
    { id: "xe_ngua", title: "Ông lái buôn", place: "village", conds: [], hint: "Thỉnh thoảng có tiếng vó ngựa dọc con đường.", rumour: "“Có ông lái buôn đánh xe ngựa qua làng, hay dừng lại tán chuyện.”", seen: () => !!q("cart").met, live: () => true },
  ];
  const COND_TEXT = { "🌇": "từ chạng vạng", "🌙": "ban đêm", "✨": "tâm sáng", "🪔": "cần đèn", "🌸": "cần hoa trời", "🧘": "ngồi yên", "🤝": "sau một việc tốt" };
  const book = () => (K.S.disc = K.S.disc || { heard: {}, seen: {}, visited: {} });
  // memory event log (journey.js): only an account character records; guests and a missing Journey do nothing
  const journey = (id, level) => { try { window.Journey && Journey.log(Journey.discovery(id, level)); } catch {} };
  // A met being also leaves a milestone, so the timeline can open the portrait again. Quiet: the sổ toast is the notice.
  const noteBeing = (id) => {
    const b = window.Beings && Beings.of(id);
    if (!b || !b.milestone || !window.Milestones) return;
    try { Milestones.notify("being", { id: b.milestone }, { quiet: true }); } catch (e) { console.error(e); }
  };

  function state(e) {
    const b = book();
    if (e.seen()) { if (!b.seen[e.id]) { b.seen[e.id] = Date.now(); K.save(); journey(e.id, "seen"); noteBeing(e.id); } return "seen"; }
    return b.heard[e.id] ? "heard" : "unknown";
  }
  function entries() { return ENTRIES.map((e) => ({ ...e, state: state(e), condText: e.conds.map((c) => `${c} ${COND_TEXT[c]}`) })); }
  function count() { const all = entries(); return { seen: all.filter((e) => e.state === "seen").length, total: all.length }; }
  function hear(id) {
    const e = ENTRIES.find((entry) => entry.id === id);
    const b = book();
    if (!e || e.seen() || b.heard[id]) return false;
    b.heard[id] = Date.now(); K.save(); journey(id, "heard");
    return true;
  }
  function rumour() {
    const b = book();
    const pool = ENTRIES.filter((e) => !e.seen() && !b.heard[e.id]);
    if (!pool.length) return null;
    const e = pool[Math.floor(Math.random() * pool.length)];
    hear(e.id);
    return e;
  }
  // for the minimap: has the character been here, and could something happen here right now?
  function placeState(key) {
    const b = book();
    const visited = !!b.visited[key];
    const live = ENTRIES.some((e) => e.place === key && !e.seen() && (b.heard[e.id] || visited) && e.live());
    return { visited, live };
  }
  // Runs on its own timer (not only when nothing else is open), so walking past a place always counts.
  let primed = null;
  function track() {
    if (!K.role()) return;
    const b = book();
    // first pass for a character: record what was already met (and where) without a burst of toasts
    if (primed !== K.S) {
      primed = K.S;
      for (const e of ENTRIES) if (e.seen()) {
        if (!b.seen[e.id]) { b.seen[e.id] = Date.now(); journey(e.id, "seen"); noteBeing(e.id); }
        else noteBeing(e.id); // already in the sổ before this milestone existed: record it once, quietly
        if (!b.visited[e.place]) b.visited[e.place] = Date.now();
      }
      K.save();
    }
    const p = World.getPlayer();
    for (const [k, pl] of Object.entries(World.PLACES)) {
      if (!b.visited[k] && Math.hypot(p.x - pl.x, p.y - pl.y) < 80) { b.visited[k] = Date.now(); K.save(); }
    }
    for (const e of ENTRIES) {
      if (!b.seen[e.id] && e.seen()) { b.seen[e.id] = Date.now(); b.visited[e.place] = b.visited[e.place] || Date.now(); K.save(); journey(e.id, "seen"); noteBeing(e.id); api() && api().toast(`Sổ khám phá: ${e.title}.`); }
    }
  }
  setInterval(track, 500);
  // the entries without their functions (for the Sổ Hành Trình views, which also work on saved characters)
  function meta() { return ENTRIES.map(({ seen, live, ...rest }) => ({ ...rest, condText: rest.conds.map((c) => `${c} ${COND_TEXT[c]}`) })); }
  return { entries, count, hear, rumour, placeState, COND_TEXT, meta };
})();
