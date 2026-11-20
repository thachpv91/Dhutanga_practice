// World clock for the player's own story (pure logic, no DOM).
// h is game hours on a 24h scale continued past midnight: 6.2 = first dawn, 24 = midnight,
// 30 = 6am the next day, 41.2 = late afternoon of the day after.
// The character's sky follows this clock instead of the scene's time of day (legacy characters keep the scene's time).
window.Clock = (() => {
  const SECONDS_PER_HOUR = 60;   // one game hour passes every 60 seconds of play
  const NIGHT_CAP = 28.6;        // "Gà gáy": the clock stops here until the night is ended
  const DAY_CAP = 41.2;          // "Chiều tàn" of the next day: the clock stops here while the player walks around

  // Phases in order. The first morning is only the opening day; "Sáng sớm" after the night stays at 30.4.
  // The last phase repeats "Chiều tàn" at the next day's dusk.
  const PHASES = Object.freeze([
    { name: "Sáng tinh mơ", h: 6.2, dark: 0.28, hint: "trời vừa sáng" },
    { name: "Buổi sáng", h: 8.5, dark: 0.10, hint: "buổi sáng" },
    { name: "Giữa ngày", h: 12, dark: 0.05, hint: "giữa ngày" },
    { name: "Xế chiều", h: 15.2, dark: 0.16, hint: "nắng đã nghiêng" },
    { name: "Chiều tàn", h: 17.2, dark: 0.42, hint: "khoảng 17 giờ" },
    { name: "Chạng vạng", h: 18.4, dark: 0.55, hint: "mặt trời vừa lặn" },
    { name: "Đầu hôm", h: 20, dark: 0.60, hint: "khoảng 19 giờ" },
    { name: "Canh hai", h: 22, dark: 0.66, hint: "khoảng 21 đến 23 giờ" },
    { name: "Canh ba", h: 24.6, dark: 0.70, hint: "quanh nửa đêm" },
    { name: "Canh tư", h: 26.6, dark: 0.64, hint: "khoảng 1 đến 3 giờ sáng" },
    { name: "Gà gáy", h: 28.6, dark: 0.55, hint: "gần sáng" },
    { name: "Rạng sáng", h: 29.7, dark: 0.45, hint: "trời hửng sáng" },
    { name: "Sáng sớm", h: 30.4, dark: 0.10, hint: "khoảng 6 giờ sáng" },
    { name: "Sáng", h: 32.5, dark: 0.08, hint: "buổi sáng" },
    { name: "Trưa", h: 36, dark: 0.05, hint: "giữa trưa" },
    { name: "Chiều", h: 39, dark: 0.10, hint: "buổi chiều" },
    { name: "Chiều tàn", h: 41.2, dark: 0.42, hint: "khoảng 17 giờ" },
  ]);

  // h of the first phase with this name; unknown name -> null
  function hOf(name) {
    const p = PHASES.find((ph) => ph.name === name);
    return p ? p.h : null;
  }

  // name, hint and darkness at game hour h; darkness is linear between neighbouring phases
  function at(h) {
    const first = PHASES[0], last = PHASES[PHASES.length - 1];
    if (!(h > first.h)) return { name: first.name, hint: first.hint, dark: first.dark, h };
    if (h >= last.h) return { name: last.name, hint: last.hint, dark: last.dark, h };
    let i = 0;
    while (i + 1 < PHASES.length && PHASES[i + 1].h <= h) i++;
    const a = PHASES[i], b = PHASES[i + 1];
    const t = (h - a.h) / (b.h - a.h);
    return { name: a.name, hint: a.hint, dark: a.dark + (b.dark - a.dark) * t, h };
  }

  // moves h forward by dtSeconds of play, never past cap; no movement backwards, ignores negative or NaN dt
  function advance(h, dtSeconds, cap) {
    if (!(dtSeconds > 0) || !(cap >= h)) return h;
    return Math.min(cap, h + dtSeconds / SECONDS_PER_HOUR);
  }

  return { SECONDS_PER_HOUR, NIGHT_CAP, DAY_CAP, PHASES, hOf, at, advance };
})();
