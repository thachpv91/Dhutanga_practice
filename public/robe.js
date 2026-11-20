// A five-day playable robe-making arc. No achievement claim; the robe is simply a useful item.
// See docs/kich-ban-vong-ngay.md. Dhutanga details require monastic review.
(() => {
  const K = Mind.kit;
  const roleOk = () => K.role() === "monk";
  const currentDay = () => K.api() && K.api().day ? K.api().day() : 1;
  const Q = () => (K.S.q.robe = K.S.q.robe || { step: 0, readyDay: 1 });
  const phases = [
    { place: "gate", title: "Mảnh vải bên đường", teaser: "Tìm hiểu một mảnh vải cũ mắc trên gai, trước khi nhặt.", lines: ["Một mảnh vải cũ vướng vào bụi gai.", "Nó có thật sự bị bỏ đi, hay ai vừa để quên?"], choice: "Quan sát rồi nhặt mảnh vải", end: "Sư gỡ mảnh vải ra khỏi gai, gấp lại cẩn thận." },
    { place: "well", title: "Giặt mảnh vải", teaser: "Đưa vải cũ ra giếng, nhúng, vò rồi xả sạch.", lines: ["Nước giếng mát lạnh. Vải còn bùn đất.", "Giặt vội thì vẫn còn vết bẩn."], choice: "Nhúng, vò, xả rồi phơi", end: "Nước chảy trong dần, mảnh vải được phơi dưới hiên." },
    { place: "hermitage", title: "Nhuộm màu đất", teaser: "Chuẩn bị màu nhuộm phù hợp và làm khô tấm vải.", lines: ["Mảnh vải đã khô, sắc vải loang lổ.", "Sư già chỉ chỗ chuẩn bị màu đất giản dị."], choice: "Nhuộm rồi phơi vải", end: "Vải có màu đất trầm. Không cần phải thật đẹp." },
    { place: "hermitage", title: "Khâu những mũi đầu tiên", teaser: "Xếp các mảnh, luồn kim và bắt đầu khâu.", lines: ["Kim đi qua hai lớp vải. Một mũi hơi lệch.", "Đôi tay chậm lại để đường kim không làm rách vải."], choice: "Xếp vải, luồn kim, khâu lại", end: "Những mũi kim đầu tiên đã nằm yên trên vạt vải." },
    { place: "hermitage", title: "Mũi khâu cuối", teaser: "Hoàn thành tấm y màu đất và nhìn lại quá trình làm.", lines: ["Mũi khâu cuối cùng nối hai mép vải.", "Thầy nhắc: một tấm y dùng để che thân, không phải để khoe thành tựu."], choice: "Khâu mũi cuối, giũ y", end: "Một tấm y màu đất đã hoàn thành. Sư gấp lại đặt trong tịnh thất." },
  ];
  const pt = (phase) => World.PLACES[phase.place];
  const near = (place) => place && K.near(place, 52);
  // Step 1 happens at a real scrap of cloth lying by the road near the cemetery gate (drawn by world.js as kind "cloth").
  const clothSpot = () => { const g = World.PLACES.gate; return g ? { x: g.x + 56, y: g.y + 34 } : null; };
  const clothOut = () => roleOk() && (Q().step || 0) === 0;
  // where the current step happens: the cloth itself for step 1, the usual place for the others
  const spotOf = (step, phase) => (step === 0 ? clothSpot() : pt(phase));
  let cooldown = 0;
  function open() {
    const q = Q(), step = Math.max(0, Math.min(4, q.step || 0)), phase = phases[step];
    const day = currentDay();
    if (day < (q.readyDay || 1)) return;
    K.showSheet({
      label: phase.title,
      lines: phase.lines,
      choices: [
        { label: phase.choice, primary: true, fn: () => {
          q.step = step + 1;
          q.readyDay = day + 1;
          K.save(); K.closeSheet();
          cooldown = Date.now() + 5000;
          if (step === 0) {
            // the scrap goes into the bag: something to carry to the well tomorrow
            K.giveItem("manh_vai_cu"); K.save();
            K.setOpen(true);
            K.gotItem("manh_vai_cu", () => { K.setOpen(false); K.cooldown(2500); K.api().toast(phase.end + " Hôm sau mới đến bước tiếp theo."); });
          } else if (step === 4) {
            // Finishing the robe is not a certification of spiritual attainment.
            K.dropItem("manh_vai_cu"); K.giveItem("y_mau_dat"); K.save();
            K.setOpen(true);
            K.gotItem("y_mau_dat", () => { K.setOpen(false); K.cooldown(2500); });
          } else K.api().toast(phase.end + " Hôm sau mới đến bước tiếp theo.");
        } },
        { label: "Để hôm khác", fn: () => { cooldown = Date.now() + 60000; K.closeSheet(); } },
      ],
    });
  }
  Mind.register({
    targets() {
      if (!roleOk()) return [];
      const q = Q();
      if (q.step >= phases.length) return [];
      const phase = phases[q.step || 0];
      const place = spotOf(q.step || 0, phase);
      if (!place) return [];
      const ready = currentDay() >= (q.readyDay || 1);
      const stand = (q.step || 0) === 0 ? { x: place.x, y: place.y + 14 } : { x: place.x + 20, y: place.y + 20 };
      return [{
        title: phase.title,
        body: ready ? phase.teaser : "Đã làm xong phần hôm nay. Sang ngày mới để tiếp tục tấm y.",
        x: stand.x, y: stand.y,
        name: phase.title,
      }];
    },
    loop() {
      if (!roleOk() || Date.now() < cooldown) return false;
      const q = Q();
      if (q.step >= phases.length || currentDay() < (q.readyDay || 1)) return false;
      const phase = phases[q.step || 0];
      const here = spotOf(q.step || 0, phase);
      if (!(q.step ? near(here) : here && K.near(here, 40))) return false;
      open();
      return true;
    },
    // the scrap of cloth is really lying there until it is picked up
    actors() {
      const s = clothOut() ? clothSpot() : null;
      return s ? [{ kind: "cloth", x: s.x, y: s.y, label: "mảnh vải" }] : [];
    },
  });
})();
