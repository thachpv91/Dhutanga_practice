// HG04 follows one piece of cloth. Old saves contain only step and readyDay.
(() => {
  const K = Mind.kit;
  const monk = () => K.role() === "monk";
  const today = () => K.api()?.storyDay?.() || K.api()?.day?.() || 1;
  const quest = () => (K.S.q.robe ||= { step: 0, readyDay: 1 });
  // A beat is the material as the monk finds it, followed by the action that changes it.
  const phases = [
    { title: "Mảnh vải bên đường", beats: [
      ["gate", "scrap", "Một góc vải bạc màu mắc trên gai. Vải của ai bỏ lại bên đường?", "Hỏi người quét đường"],
      ["gate", "scrap", "Người quét đường ngừng tay. “Mấy mảnh ấy tôi bỏ đấy, thưa Sư. Chỗ còn lành, Sư cứ lấy dùng.” Một sợi chỉ vẫn vướng trên gai.", "Gỡ từng góc vải rồi cất vào túi"],
    ], end: "Sư gói những mảnh còn lành lại. Mai ra giếng giặt." },
    { title: "Giặt vải bên giếng", beats: [
      ["well", "basin", "Sư đặt một chậu nước bên thành giếng. Đất khô còn đóng trong nếp vải.", "Nhúng vải vào chậu"],
      ["well", "mud", "Bụi đất tan thành những vệt nâu. Một nếp gấp vẫn còn cứng giữa hai ngón tay.", "Mở nếp gấp, vò nhẹ chỗ bám đất"],
      ["well", "rinse", "Sạn nhỏ đã lắng xuống đáy chậu. Sư múc một gáo nước sạch.", "Xả tới khi nước chảy trong, vắt ráo"],
      ["hermitage", "bundle", "Vải ướt theo Sư về tới hiên. Nếu cứ để cuộn thế này, nếp trong cùng sẽ lâu khô.", "Giũ từng mảnh, vắt qua sào tre"],
    ], end: "Nước nhỏ từng giọt dưới sào. Sư để gió hong vải qua đêm." },
    { title: "Nhuộm vải dưới hiên", beats: [
      ["hermitage", "pale", "Vải trên sào đã nhẹ tay. Bên hiên có chậu nước nhuộm màu đất mà thầy đã chuẩn bị.", "Hạ vải xuống, nhúng ngập trong màu"],
      ["hermitage", "dye", "Sư nhấc một góc vải lên. Màu đã thấm sang mặt kia, chỗ đậm chỗ nhạt.", "Để ráo màu rồi trải lại lên sào"],
    ], end: "Hai mảnh màu đất lay sát nhau dưới hiên. Mai khô mới ghép được mép." },
    { title: "Mũi khâu dưới hiên", beats: [
      ["hermitage", "ochre", "Sư gỡ vải khô khỏi sào. Hai mép lành vừa đủ chồng lên nhau một đốt ngón tay.", "Xếp hai mép vải lên chiếu"],
      ["hermitage", "pin", "Đầu chỉ đã qua lỗ kim. Sư giữ nếp bằng một ngón tay rồi đưa kim qua cả hai lớp.", "Kéo chỉ, khâu dọc theo nếp gấp"],
    ], end: "Đường chỉ đã giữ được hai mép vải. Sư gài kim vào vạt để mai khâu nốt." },
    { title: "Mũi khâu cuối", beats: [
      ["hermitage", "seam", "Gần cuối đường chỉ còn một khoảng hở bằng đầu ngón tay. Sư lật trái vạt y, đưa kim qua mép còn hở.", "Khâu kín mép và thắt đầu chỉ"],
      ["hermitage", "hem", "Sư giũ nhẹ. Đường chỉ giữ hai vạt nằm sát nhau. Thầy dịch chiếc chiếu vào trong cho Sư có chỗ gấp y.", "Vuốt phẳng, gấp tấm y màu đất"],
    ], end: "Sư gấp tấm y vừa khâu, đặt vào túi để dùng." },
  ];
  const spot = (place) => {
    const p = World.PLACES[place];
    if (!p) return null;
    const dx = place === "gate" ? 56 : place === "well" ? -30 : 44;
    return { x: p.x + dx, y: p.y + (place === "gate" ? 34 : 18) };
  };

  // Draw in a small common coordinate space, for both the map prop and the close-up.
  function drawMaterial(ctx, frame, sway = 0) {
    const stroke = (d, color, width = 1) => {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(new Path2D(d));
    };
    const shape = (d, color) => { ctx.fillStyle = color; ctx.fill(new Path2D(d)); };
    const oval = (x, y, rx, ry, color) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    };
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const pale = "#d4c5a3", edge = "#796a52", ochre = "#ad6840";
    function cloth(x, y, color, fold) {
      ctx.save(); ctx.translate(x, y);
      shape("M-20 -12 Q-3 -15 17 -12 L20 10 15 9 13 12 9 10 6 12 Q-6 9 -17 12 Z", color);
      stroke("M-15 -10 Q-12 -2 -13 8 M-2 -11 Q2 0 0 7 M13 -10 L15 6", fold, 1.2);
      stroke("M-16 10 l-1 4 m4 -5 v4 m5 -4 l1 3 m15 -3 l1 3", color);
      ctx.restore();
    }
    if (frame === "scrap") {
      stroke("M-36 15 Q-18 6 -13 -15 M-22 8 L-26 -2 M-16 -4 L-8 -10 M1 15 Q9 5 22 -12 M14 -3 l-1 -7", "#977752", 2.6);
      ctx.rotate(-0.13); cloth(2, -2, pale, edge);
      shape("M-13 3 q5 -6 9 -2 l-2 3 -7 1z", "#998566");
    } else if (["basin", "mud", "rinse", "dye"].includes(frame)) {
      const water = { basin: "#829e9a", mud: "#9a8061", rinse: "#9bb2ab", dye: "#96502b" }[frame];
      shape("M-31 -4 Q-29 14 -22 17 Q0 24 23 17 Q29 12 31 -4Z", "#80604a");
      oval(0,-4,32,10,"#bc9770"); oval(0,-4,28,7,water);
      stroke("M-24 7 Q-1 17 25 7", "#513f32", 1.5);
      ctx.save(); ctx.translate(frame === "basin" ? -18 : 1,-4); ctx.rotate(-0.23); ctx.scale(.72,.72);
      cloth(0,0,frame === "dye" ? ochre : frame === "mud" ? "#b2a287" : pale,edge); ctx.restore();
      stroke("M11 -3 q6 2 12 -1 M-23 -2 q3 2 5 2", "#dfd0b7");
      if (frame === "rinse") {
        stroke("M19 -22 l13 -6", "#c5a47d", 2);
        oval(17,-21,5,2.5,"#aa865f");
        stroke("M13 -20 Q8 -15 7 -8 M15 -20 Q11 -14 10 -10", "#bbd7cb", 1.3);
      }
      if (frame === "mud") for (const x of [-7, -4, -1, 5, 8]) oval(x, 1 + Math.cos(x)*2,1.1,.6,"#705541");
    } else if (["bundle", "pale", "ochre"].includes(frame)) {
      stroke("M-30 19 l2 -40 M28 19 l2 -40 M-34 -16 Q0 -13 35 -17", "#ab916a", 2.8);
      if (frame === "bundle") {
        ctx.save();ctx.translate(0,11);ctx.scale(1,.46);cloth(0,0,"#a49e89",edge);ctx.restore();
      } else {
        ctx.save();ctx.transform(1,0,sway*.04,1,0,0);
        cloth(-4,-2,frame === "pale" ? pale : ochre,frame === "pale" ? "#b1a287" : "#824c32");
        ctx.scale(.52,.93);cloth(30,-5,frame === "pale" ? "#e7ddc5" : "#c1804c",edge);ctx.restore();
      }
    } else {
      shape("M-35 -13 L28 -17 38 13 -26 19Z","#a78a60");
      for (let x = -26; x < 28; x += 5) stroke(`M${x} -11 l7 25`,"#887251",.7);
      cloth(-2,-1,ochre,"#925534");
      shape("M-5 -13 L16 -14 L21 9 -2 11Z","#c0804e");
      stroke("M-5 -12 L-2 10","#6d452e",1.3);
      ctx.setLineDash([1.5,2]);
      stroke(frame === "pin" ? "M-4 -11 l0.4 3" : frame === "seam" ? "M-4 -11 l2 15" : "M-4 -11 l3 21","#f7d9a1",1.1);
      ctx.setLineDash([]);
      if (frame !== "hem") {
        stroke("M0 2 L13 -9","#dce3d8",1.5);
        stroke("M13 -9 C33 -18 32 4 22 1 Q16 -2 18 -5","#efe1b8",.9);
      }
    }
  }

  function illustration(frame) {
    const canvas = K.el("canvas", "robe-closeup");
    canvas.width = 480; canvas.height = 144;
    canvas.setAttribute("aria-hidden", "true"); // The scene text describes the same material change.
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.translate(240, 79); ctx.scale(2.75, 2.75);
      drawMaterial(ctx, frame);
    }
    return canvas;
  }

  let cooldown = 0;
  function open(q, phase, n) {
    const [place, frame, line, action] = phase.beats[n];
    const step = q.step || 0;
    const current = () => monk() && quest() === q && (q.step || 0) === step && (q.beat || 0) === n;
    K.showSheet({ label: phase.title, lines: [line], body: illustration(frame), choices: [
      { label: action, primary: true, fn: () => {
        if (!current()) return;
        const next = phase.beats[n + 1];
        if (next) {
          q.beat = n + 1; K.save();
          if (next[0] === place) return open(q, phase, n + 1);
          K.closeSheet(); K.api().toast("Sư mang vải vừa vắt về sào tre bên hiên tịnh thất."); return;
        }
        q.step = step + 1; delete q.beat; q.readyDay = today() + 1;
        const item = step === 0 ? "manh_vai_cu" : step === 4 ? "y_mau_dat" : null;
        if (step === 4) K.dropItem("manh_vai_cu");
        if (item) K.giveItem(item);
        K.save(); K.closeSheet();
        const finish = () => { K.setOpen(false); K.cooldown(2500); K.api().toast(phase.end); };
        if (item) { K.setOpen(true); K.gotItem(item, finish); } else finish();
      } },
      { label: "Để sau", fn: () => { cooldown = Date.now() + 5000; K.closeSheet(); } },
    ] });
  }

  Mind.register({
    targets() {
      if (!monk()) return [];
      const q = quest(), phase = phases[q.step || 0];
      if (!phase) return [];
      const [place, , line, action] = phase.beats[q.beat || 0];
      const p = spot(place);
      if (!p) return [];
      const body = today() >= (q.readyDay || 1) ? line + " " + action + "." : phases[q.step - 1]?.end || line;
      return [{ title: phase.title, body, x: p.x, y: p.y + 14, name: phase.title }];
    },
    loop() {
      if (!monk() || Date.now() < cooldown) return false;
      const q = quest(), phase = phases[q.step || 0];
      if (!phase || today() < (q.readyDay || 1)) return false;
      const n = q.beat || 0, p = spot(phase.beats[n][0]);
      if (!p || !K.near(p, 40)) return false;
      return K.offer("robe:" + q.step + ":" + n, phase.title, () => open(q, phase, n));
    },
    actors() {
      if (!monk()) return [];
      const q = quest(), phase = phases[q.step || 0];
      if (!phase) return [];
      const [place, frame] = phase.beats[q.beat || 0];
      if (q.step === 1 && today() < q.readyDay) return []; // carried to the well in the bag
      const p = spot(place);
      if (!p) return [];
      if (frame === "scrap") return [{ ...p, kind: "cloth", label: "mảnh vải" }];
      const label = { basin: "chậu giặt", mud: "nước đục", rinse: "gáo nước sạch", bundle: "sào tre", pale: "vải trên sào", dye: "chậu nhuộm", ochre: "vải màu đất", pin: "kim và chỉ", seam: "vạt y đang khâu", hem: "vạt y đã khâu" }[frame];
      return [{ ...p, kind: "robeWork", frame, label, drawMaterial }];
    },
  });
})();
