// The player's own first nights ("player_arrival"): short, neutral scenes for a character who has a name of their own.
// Sư Tịnh, Ông Tư and Bà Sáu are NPCs the player may meet, never the player (docs/player-character-narrative-model.md).
// The monk and ghost scenes follow docs/seven-nights-open-roads-narrative.md v0.3. The villager scenes use
// docs/human-world-villager-night-script.md.
// Chapters (chapters.js): pa = the first night, pb = every ordinary night after it.
// Voice: "bạn", one or two short lines, then one small choice. Meter meaning as in story.js:
// monk "Tâm an" and villager "Lòng tin" high = good, ghost "Chấp" LOW = lighter, so the ghost endings run the other way.

Object.assign(STORY.monk.scenes, {
  pa_0: {
    time: "Chiều tàn",
    place: "gate",
    lines: [
      "Bạn tới cổng nghĩa địa khi vệt nắng cuối vừa tắt. Chiếc bát đã rửa sạch nằm trong túi bát.",
      "Ngoài cỏ có tiếng gì bước theo một quãng rồi ngừng.",
    ],
    choices: [
      { label: "Tìm một chỗ thích hợp để ngồi", delta: 0, next: "pa_end" },
      { label: "Đứng lại nghe xem tiếng gì", delta: 0, next: "pa_end" },
    ],
  },
  pa_end: {
    time: "Rạng sáng",
    place: "graves", pose: "sit",
    end: true,
    endings: [
      { max: 4, text: "Đêm đầu tiên trôi qua bằng những bước chân còn lạ. Không sao. Mai bạn sẽ quen đường hơn." },
      { max: 6, text: "Đêm yên. Bạn nghe gió, nghe chuông, và biết mình đã đặt chân đúng nơi." },
      { max: 10, text: "Trời hửng, bạn thấy lòng nhẹ như sương trên cỏ. Chuyện của làng này còn dài, và bạn mới bắt đầu." },
    ],
  },
  pb_0: {
    time: "Chạng vạng",
    place: "hermitage",
    lines: [
      "Đêm nay trời quang. Bạn ngồi dưới hiên tịnh thất, nghe sư già gõ mõ ở đằng xa.",
    ],
    choices: [
      { label: "Đi kinh hành vài vòng", delta: 1, next: "pb_end" },
      { label: "Ngồi yên một lát", delta: 0, next: "pb_end" },
    ],
  },
  pb_end: {
    time: "Rạng sáng",
    place: "hermitage", pose: "sit",
    end: true,
    endings: [
      { max: 4, text: "Đêm nay tâm bạn hơi bận. Không sao, cái gì đến rồi cũng sẽ đi." },
      { max: 6, text: "Một đêm bình thường. Bạn thấy bình thường cũng là một món quà." },
      { max: 10, text: "Rạng sáng. Chim đầu tiên kêu khi bạn mở mắt, lòng yên như mặt ao không gió." },
    ],
  },
});

Object.assign(STORY.villager.scenes, {
  // Wording from docs/human-world-villager-night-script.md §4 (Proposed). The endings are neutral on purpose:
  // the meter picks one of three lines, and none of them comments on the player.
  // First morning (owner, 2026-11-15): arrive at dawn. The well has only the old woman.
  // Neither choice ends the night. "Kết thúc đêm" waits until Đầu hôm.
  pa_0: {
    time: "Sáng tinh mơ",
    place: "village",
    lines: [
      "Bạn tới làng lúc trời vừa sáng. Sương còn trên lá, nắng mới vàng ở đầu ngõ.",
      "Nhà bên nói nhỏ: “Giếng ở đầu ngõ. Sáng nào bà cụ cũng múc nước ở đó.”",
    ],
    choices: [
      { label: "Ra giếng lấy nước", delta: 0, next: "pa_well" },
      { label: "Đi một vòng xem làng trước", delta: 0, next: "pa_lane" },
    ],
  },
  pa_lane: {
    time: "Sáng tinh mơ",
    place: "village",
    lines: [
      "Ngõ còn vắng. Tiếng chổi tre, một con gà chạy ngang, mùi khói bếp.",
      "Chưa thấy ai khác ngoài đường.",
    ],
    choices: [
      { label: "Ra giếng", delta: 0, next: "pa_well" },
      { label: "Đi dạo thêm", delta: 0, next: "pa_end" },
    ],
  },
  pa_well: {
    time: "Sáng tinh mơ",
    place: "well",
    lines: [
      "Giếng làng. Chỉ có một bà cụ đang múc nước. Cán gáo hơi lỏng.",
      "Bà cụ: “Nhà mới dọn về hả con? Uống ngụm nước đã. Giếng này ngọt lắm.”",
    ],
    choices: [
      { label: "Hỏi bà chuyện trong làng", delta: 0, next: "pa_well_talk" },
      { label: "Nhìn cái gáo trên tay bà", delta: 0, next: "pa_well_dipper" },
      { label: "Uống nước, cảm ơn rồi đi", delta: 0, next: "pa_end" },
    ],
  },
  pa_well_talk: {
    time: "Sáng tinh mơ",
    place: "well",
    lines: [
      "Bà cụ: “Làng nhỏ, chuyện cũng nhỏ. À, cây gạo ngoài kia, chạng vạng lá nó có khi sáng lên.”",
      "Bà cụ: “Thấy thì đừng sợ. Bà thấy từ hồi còn con gái.”",
    ],
    choices: [
      { label: "Cảm ơn bà, con đi dạo", delta: 1, next: "pa_end" },
    ],
  },
  pa_well_dipper: {
    time: "Sáng tinh mơ",
    place: "well",
    lines: [
      "Bà cụ: “Nó lỏng cán mấy bữa nay. Kệ, còn múc được.”",
    ],
    choices: [
      { label: "Cảm ơn bà, con đi dạo", delta: 0, next: "pa_end" },
    ],
  },
  pa_end: {
    time: "Rạng sáng",
    place: "village",
    end: true,
    endings: [
      { max: 4, text: "Đêm đầu ở làng mới. Mai trời vẫn sáng như mọi hôm." },
      { max: 6, text: "Đêm êm. Chẳng có gì to tát, và thế là đủ." },
      { max: 10, text: "Gà gáy. Ngoài ngõ đã có tiếng chổi tre." },
    ],
  },
  pb_0: {
    time: "Chạng vạng",
    place: "village",
    lines: [
      "Cơm xong, bạn ra hiên. Trăng lên sau rặng tre.",
    ],
    choices: [
      { label: "Đi dạo một vòng", delta: 1, next: "pb_end" },
      { label: "Ngồi hiên thêm chút nữa", delta: 0, next: "pb_end" },
    ],
  },
  pb_end: {
    time: "Rạng sáng",
    place: "village",
    end: true,
    endings: [
      { max: 4, text: "Một đêm nữa ở làng. Mai trời vẫn sáng như mọi hôm." },
      { max: 6, text: "Đêm êm. Chẳng có gì to tát, và thế là đủ." },
      { max: 10, text: "Gà gáy. Ngoài ngõ đã có tiếng chổi tre." },
    ],
  },
});

Object.assign(STORY.ghost.scenes, {
  pa_0: {
    time: "Chạng vạng",
    place: "graves",
    lines: [
      "Một giọt sương đọng trên ngọn cỏ. Bạn đưa tay chạm vào.",
      "Bàn tay xuyên qua, giọt nước vẫn nằm nguyên. Cuối đường, một con chó bỗng ngẩng đầu.",
    ],
    choices: [
      { label: "Theo ánh đèn đầu ngõ", delta: 0, next: "pa_end" },
      { label: "Theo tiếng nước rừng tre", delta: 0, next: "pa_end" },
      { label: "Ở lại ngắm trăng", delta: 0, next: "pa_end" },
    ],
  },
  pa_end: {
    time: "Rạng sáng",
    place: "graves",
    end: true,
    endings: [
      { max: 3, text: "Đêm đầu tiên nhẹ hơn bạn tưởng. Tiếng chuông vẫn còn đọng đâu đó." },
      { max: 6, text: "Bạn đi hết đêm mà không biết mình tìm gì. Không sao. Chỗ này còn nhiều điều để nhìn." },
      { max: 10, text: "Trời sáng, bạn vẫn còn đứng đó. Có điều gì đó giữ bạn lại, và bạn chưa biết là gì." },
    ],
  },
  pb_0: {
    time: "Chạng vạng",
    place: "graves",
    lines: [
      "Trăng lên. Bóng bạn đổ lên bia đá cũ, nhạt như hơi thở.",
    ],
    choices: [
      { label: "Lượn qua rặng tre", delta: -1, next: "pb_end" },
      { label: "Ở lại nghe gió", delta: 0, next: "pb_end" },
    ],
  },
  pb_end: {
    time: "Rạng sáng",
    place: "graves",
    end: true,
    endings: [
      { max: 3, text: "Đêm nay bạn thấy mình nhẹ, như một làn khói nghe được tiếng dế." },
      { max: 6, text: "Một đêm lặng. Bạn ngắm trăng lặn và không đòi hỏi gì hơn." },
      { max: 10, text: "Gần sáng, bạn vẫn còn nặng một điều chưa gọi được tên. Mai bạn sẽ thử lại." },
    ],
  },
});
