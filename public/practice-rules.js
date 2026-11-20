// Pure game rules. Cards represent recognized situations in a simulation, never actual attainments.
window.PracticeRules = (() => {
  function selectMeditationCard({ noted = 0, lost = 0, practicedSessions = 0, longestStable = 0, kinds = [] } = {}) {
    if (noted < 1) return { card: null, reason: "Một buổi ngồi qua đi. Chưa có đủ tương tác để mở thẻ mới." };
    // No deterministic diagnosis based on every ordinary wandering thought.
    if (practicedSessions >= 2 && noted >= 3 && lost <= 1 && longestStable >= 20)
      return { card: "dinh", reason: "Nhiều lần quay về đề mục, lần này chú ý giữ được một đoạn khá ổn định." };
    if (noted >= 2 && (lost >= 4 || (lost >= 2 && lost > noted)))
      return { card: "niem", reason: "Dù xao lãng nhiều lần, người này đã nhận ra và quay về với hơi thở." };
    if (noted >= 2) return { card: "niem", reason: "Người này nhận ra tâm đi xa và trở về với đề mục." };
    return { card: null, reason: "Có một lần nhận ra xao lãng. Buổi sau có thể thử tiếp." };
  }
  // Deliberately no 'si' or 'phong_dat' based on a timer / single unobserved thought.
  const observedCard = (tag) => ({
    confusion_recognized: "si",
    unwholesome_agitation_recognized: "phong_dat",
    dullness_recognized: "hon_tram",
    hindering_doubt_recognized: "hoai_nghi",
  })[tag] || null;
  return { selectMeditationCard, observedCard };
})();
