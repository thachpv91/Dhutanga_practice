// First week of a player-created monk. Robe work keeps its own material and calendar in robe.js.
window.MonkWeek = (() => {
  const K = Mind.kit;
  const ownStory = () => K.role() === "monk" && K.api()?.arrival?.();
  const journal = () => K.S.q.monkWeek || {};
  const morning = ["Sáng tinh mơ", "Buổi sáng", "Rạng sáng", "Sáng sớm", "Sáng"];
  const evening = ["Chiều tàn", "Chạng vạng", "Đầu hôm", "Canh hai", "Canh ba", "Canh tư", "Gà gáy"];
  const scene = (key, title, place, dx, dy, lines, choices) => ({ key, title, place, dx, dy, lines, choices });
  // Each choice leaves a small, specific memory. The same text is the immediate reply and the journal entry.
  const nights = [
    scene("threshold", "Tiếng bước ngoài cỏ", "graves", -36, 40, [
      "Bạn đi qua mấy ngôi mộ thấp. Cỏ sau lưng xào xạc đúng ba lần rồi im.",
    ], [
      ["observe", "Quay lại nhìn cho rõ", "Cỏ nghiêng về hai hướng. Không thấy ai trên lối nhỏ."],
      ["sit", "Chọn chỗ thoáng, ngồi xuống", "Bạn đặt tọa cụ ở chỗ nhìn rõ lối đi. Một chiếc lá khô trượt ngang mặt đất rồi dừng."],
      ["leave", "Trở ra cổng, để hôm khác", "Bạn trở ra cổng nghĩa địa. Con đường vẫn ở đó, không ai giục quay lại."],
    ]),
    scene("bell", "Tiếng chuông cuối", "hermitage", -58, 30, [
      "Tiếng chuông vừa dứt. Sư Tịnh còn giữ dùi trên tay. “Thầy nghe thấy gì sau tiếng cuối?”",
    ], [
      ["insects", "Ngồi thêm để nghe ngoài sân", "Trong khoảng lặng sau tiếng chuông, bạn nghe tiếng dế dưới bậc thềm. Sư Tịnh đặt dùi lên giá."],
      ["echo", "Hỏi vì sao chuông đã lặng mà tai còn ngân", "“Lúc đầu tôi cứ tưởng ai gõ thêm”, Sư Tịnh cười. Hai người đợi tới khi nghe rõ tiếng chân trên sỏi."],
    ]),
    scene("pond", "Vệt trăng bên ao", "ao", 30, -42, [
      "Một cánh sen dạt vào bờ. Muỗi vừa chạm nước, vệt trăng đứt thành mấy khúc. Xa hơn một sải tay, mặt ao vẫn phẳng.",
    ], [
      ["ripple", "Ngồi chờ vòng nước tới bờ", "Vòng nước chạm cọng sen rồi tan. Vệt trăng lại liền. Bạn nhận ra chỗ mình vẫn ngồi đã tối từ bao giờ."],
      ["bank", "Đi men bờ tìm một góc nhìn khác", "Qua một bụi lau, trăng đã ra khỏi bóng lá. Cũng mặt ao ấy, ở khúc này bạn thấy cả vầng trăng."],
    ]),
    scene("needle", "Đường chỉ dưới ánh đèn", "hermitage", -56, -42, () => [
      (K.S.q.robe?.step || 0) >= 4 ? "Bạn mang đường khâu của mình tới bên đèn. Một mũi hơi xiên." :
        "Sư Tịnh đưa một mảnh y thầy đang vá ra mép sáng. Một mũi chỉ hơi xiên.",
      "“Có cần tháo mũi này chăng?” Thầy đưa tay căng hai mép vải để bạn nhìn.",
    ], [
      ["seam", "Nhìn xem mép vải có hở không", "Hai mép vẫn áp sát khi kéo nhẹ. Sư Tịnh gật đầu rồi che ngọn đèn cho khỏi tạt."],
      ["ask", "Hỏi thầy chỗ nào cần khâu lại", "Thầy chỉ một đoạn khác, chỗ sợi chỉ đã bục. “Chỗ này mới cần tay mình.”"],
    ]),
    scene("use", "Mưa hắt bên hiên", "hermitage", -62, 40, () => [
      (K.S.q.robe?.step || 0) >= 5 ? "Đầu hiên lấm tấm mưa. Bạn ôm tấm y mình đã khâu, tìm chỗ khô để đặt." :
        "Mưa hắt lên chiếc chiếu trống dưới hiên. Sư Tịnh dời tấm y của thầy vào trong.",
      "Nước theo sợi dây phơi nhỏ xuống nền đất, mỗi giọt rơi vào đúng một chỗ.",
    ], [
      ["mat", "Kéo chiếu khỏi vệt nước", "Bạn kéo chiếu lui vào một gang. Dưới mép chiếu, đất vẫn còn khô."],
      ["line", "Chỉ chỗ nước theo dây nhỏ xuống", "Sư Tịnh buộc một cọng rơm vào dây. Nước men theo cọng rơm nhỏ ra ngoài mép hiên."],
    ]),
    scene("grave", "Tiếng động bên ngôi mộ", "graves", -36, 40, [
      "Một vệt tối lướt qua hàng cỏ. Tim bạn chợt đập mạnh. Phía sau không có ai.",
    ], [
      ["observe", "Quay lại quan sát", "Lá khô chạy thành nửa vòng quanh tọa cụ rồi nằm im."],
      ["walk", "Đứng dậy kinh hành", "Bạn đổi sang lối đất bằng cạnh những ngôi mộ. Tiếng lá không đi theo."],
      ["leave", "Trở về tịnh thất", "Bạn rời nghĩa địa khi sương đã đọng trên mép cỏ."],
    ]),
    scene("farewell", "Đường chưa đi hết", "gate", -50, -37, () => [
      "Sư già đặt chiếc chổi tre xuống cạnh gốc cây. “Ở đây cũng đã mấy hôm rồi. Con thấy thế nào?”",
      "“Nếu muốn, con cứ ở lại. Những con đường khác cũng không chạy đi đâu.”",
    ], [
      ["graves", "Con muốn tiếp tục ở nghĩa địa", "Bạn chọn ở lại thêm. Những đêm sau, tiếng cỏ và lối kinh hành vẫn có thể đổi khác."],
      ["hermitage", "Con muốn về tịnh thất học thêm", "Sư già gật đầu. “Ở hiên còn tấm y và mấy việc thường ngày.”"],
      ["roads", "Con muốn đi xem những nơi khác", "Sư già chỉ về phía rừng tre. “Cứ đi xem. Khi cần thì trở lại.”"],
      ["later", "Con chưa quyết định", "Bạn đi dạo thêm. Không có con đường nào đóng lại."],
    ]),
  ];
  const alms = [
    scene("house1", "Cánh cửa thứ bảy", "village", 68, -18, [
      "Sư Tịnh ôm bát qua sáu nhà đã mở cửa. Ở nhà cuối ngõ, then cửa vẫn cài. Thầy dừng một lát rồi quay bước.",
    ], [
      ["ask", "Đợi xa ngõ mới hỏi chuyện cánh cửa", "“Nhà ấy có mở cửa hay không là việc của họ.” Bạn cùng thầy trở ra, để ngõ sau lưng yên tĩnh."],
      ["watch", "Đứng bên đường, nhìn thầy đi qua", "Sư Tịnh đã qua khỏi hàng rào. Trong nhà mới có tiếng người kéo ghế."],
    ]),
    scene("house2", "Ghế tre sau hàng rào", "village", 68, -18, [
      "Sáng khác, cánh cửa cuối ngõ mở hé. Một chị vịn tay mẹ già, kê chiếc ghế tre vào chỗ có nắng.",
      "“Bữa trước má tôi trở mình đau, tới trễ mất”, chị nói với Sư Tịnh.",
    ], [
      ["space", "Đứng nép sang bên cho bà cụ bước ra", "Bà đặt được chân lên đất, hai tay còn bám ghế. Bà ngước nhìn bạn, gật đầu."],
      ["greet", "Chắp tay chào từ ngoài hàng rào", "Bà cụ ngồi yên trên ghế, đưa một tay lên ngang ngực đáp lễ."],
    ]),
    scene("house3", "Một vá cơm buổi sáng", "village", 68, -18, [
      "Chiếc ghế tre lại ở ngoài nắng. Chị con gái đem nồi cơm ra, còn bà mẹ tự cầm vá. “Bữa nay để má sớt.”",
    ], [
      ["bowl", "Dừng bên ghế, mở nắp bát", "Bà cụ tự sớt được một vá cơm vào bát bạn. Cô con gái giữ yên chiếc ghế tới khi mẹ ngồi xuống."],
      ["witness", "Nhường chỗ để bà sớt vào bát Sư Tịnh", "Bà cụ từ từ nghiêng chiếc vá vào bát Sư Tịnh. Chị con gái đỡ lấy chiếc vá rồi cả hai chắp tay."],
    ]),
  ];
  const pebble = scene("walkEnd", "Hòn sỏi cuối lối", "hermitage", -23, 195, [
    "Dưới chân là hòn sỏi trắng. Ngoái lại, bạn còn thấy vệt sáng trước hiên ở đầu đường kia.",
  ], [
    ["turn", "Dừng chân rồi quay mình về phía hiên", "Bạn dừng ở hòn sỏi, xoay người. Lần đầu nhìn từ phía này mới thấy lối đất hơi dốc."],
  ]);
  const returnVisits = {
    village: scene("return", "Buổi sáng đã hẹn", "well", -45, -28, [
      "Bên giếng, Sư Tịnh dừng chân chờ. “Thầy nhớ lối rồi.” Phía sau lưng thầy, ngõ làng vừa mở cửa.",
    ], [["met", "Chào thầy rồi cùng đi một quãng", "Bạn gặp lại Sư Tịnh đúng buổi đã hẹn bên giếng. Hai người đi tới đầu ngõ rồi mới chia tay."]]),
    yard: scene("return", "Cây chổi cạnh bậc cửa", "hermitage", -57, 34, [
      "Cây chổi tre dựa đúng bậc cửa như lời hẹn. Sư Tịnh ở đầu sân kia, đang vun lá thành một đống nhỏ.",
    ], [["swept", "Cầm chổi, quét từ bậc cửa ra sân", "Bạn quét từ bên này, Sư Tịnh vun lá từ bên kia. Hai vệt chổi gặp nhau giữa sân."]]),
  };

  const granny = scene("grannyMessage", "Bà cụ bên giếng", "well", 22, 8, [
    "Bà cụ ngồi trên bậc đá, một tay xoa đầu gối. “Định kiếm ít rau má nấu canh mà chân đau quá.”",
  ], [
    ["heard", "Hỏi thăm chân bà", "Bà xoay nhẹ đầu gối. “Đi tới gốc mít thì được, chỉ ngại đường về.”"],
    ["relay", "Ghé báo có người đang cần giúp ở giếng", "Bạn nhận lời chuyển một câu cho người trong làng, không nhận việc tự hái rau."],
    ["leave", "Chào bà rồi đi", "Bạn chào bà. Không có lời hứa nào được ghi lại."],
  ]);
  const relay = scene("grannyRelayed", "Một lời nhắn ở đầu ngõ", "village", -18, -24, [
    "Một người trong làng đang gom rổ bên hiên. Bạn nhắc rằng bà cụ ở giếng đau chân và đang cần giúp.",
  ], [
    ["yes", "Chỉ nói bà đang cần người ghé qua", "Người ấy đặt chiếc rổ xuống. “Để lát tôi qua hỏi bà cần gì.”"],
  ]);
  const grannyAfter = scene("grannyAfter", "Nồi canh bên giếng", "well", 22, 8, [
    "Bên bếp bà cụ có nồi canh nhỏ. Bà thấy bạn thì chỉ vào nồi. “Người đầu ngõ mang rau tới rồi.”",
  ], [
    ["seen", "Mừng vì bà đã có người giúp", "Bà mở vung cho hơi canh bay lên rồi lại đậy kín. Bạn không nhận vật phẩm hay công trạng hái rau."],
  ]);
  const dedication = scene("dedication", "Cuối thời ngồi bên mộ", "graves", -36, 40, [
    "Sương đã thấm đầu cỏ. Buổi ngồi khép lại, còn tiếng dế ngoài lối nhỏ.",
  ], [
    ["offered", "Hồi hướng điều lành đến những ai hữu duyên", "Bạn khẽ nói: “Xin chia sẻ điều lành này đến những ai đang chịu khổ.”"],
    ["quiet", "Khép buổi ngồi trong im lặng", "Bạn thu xếp tọa cụ trong im lặng rồi rời nghĩa địa."],
  ]);
  // Four short practice beats make the album hints honest: the card appears only after the player
  // explicitly recognizes what hindered the practice. Merely waiting or filling a timer gives nothing.
  const practiceBeats = [
    scene("practiceConfusion", "Tiếng gõ sau tịnh thất", "hermitage", -42, 48, [
      "Có tiếng lách cách sau vách. Bạn đã chắc là ai đang gõ vào cửa.",
      "Đi vòng qua mới thấy một cành khô mắc trên dây phơi, cứ chạm vách mỗi khi gió đổi.",
    ], [
      ["recognized", "Nhận ra mình đã kết luận khi chưa nhìn rõ", "Bạn ghi nhớ: vừa rồi tâm đã lấp chỗ chưa biết bằng một điều mình đoán.", "confusion_recognized"],
      ["leave", "Gỡ cành khô rồi đi tiếp", "Bạn gỡ cành cây khỏi dây phơi. Tiếng gõ dừng lại."],
    ]),
    scene("practiceAgitation", "Một vòng tâm lao xao", "ao", 28, -38, [
      "Bạn ngồi bên ao, nhưng vừa theo tiếng ếch đã nhớ đường chỉ dưới hiên, rồi lại nghĩ tới ngõ làng.",
      "Thân vẫn ở bờ ao. Tâm đã đi qua mấy nơi mà chưa dừng ở đâu.",
    ], [
      ["recognized", "Gọi đúng sự lao xao rồi trở về tiếng nước", "Bạn nhận ra sự xao động đang kéo tâm chạy hết chỗ này sang chỗ khác, rồi nghe lại tiếng nước ngay trước mặt.", "unwholesome_agitation_recognized"],
      ["walk", "Đứng dậy đi một vòng", "Bạn đi men bờ ao cho tới khi bước chân chậm lại."],
    ]),
    scene("practiceDullness", "Mắt nặng dưới mái hiên", "hermitage", -54, 36, [
      "Đầu vừa cúi xuống thì bạn giật mình. Dòng kinh trước mặt đã đọc ba lần mà không nhớ được câu nào.",
      "Không phải trời đã sáng; tâm và thân đang chìm xuống trong cơn buồn ngủ.",
    ], [
      ["recognized", "Nhận ra hôn trầm, đứng dậy kinh hành", "Bạn gọi đúng sự trì trệ đang có mặt, rửa mặt rồi đi chậm dọc hiên trước khi ngồi lại.", "dullness_recognized"],
      ["rest", "Khép sách, nghỉ cho đủ", "Bạn khép sách và thu xếp chỗ nghỉ, không cố biến mệt mỏi thành thành tích."],
    ]),
    scene("practiceDoubt", "Câu hỏi giữ chân ngoài lối", "graves", -18, 52, [
      "Bạn đứng giữa lối kinh hành và chỗ ngồi. Một câu hỏi chưa rõ khiến bạn đổi ý hết lần này sang lần khác.",
      "Câu hỏi tự nó không có lỗi; điều đang cản trở là bạn không chịu bắt đầu việc nào.",
    ], [
      ["recognized", "Ghi câu hỏi lại, nhận ra sự phân vân đang cản mình", "Bạn ghi câu hỏi để sáng mai thưa với Sư Tịnh, rồi chọn một đoạn đường ngắn và bắt đầu đi.", "hindering_doubt_recognized"],
      ["later", "Để việc tu sang hôm khác", "Bạn rời lối nhỏ. Câu hỏi vẫn còn đó để có thể hỏi lại sau."],
    ]),
  ];

  function available() {
    if (!ownStory()) return [];
    const s = journal(), api = K.api(), day = api.storyDay(), phase = api.phase();
    const out = [];
    if (s.walk === "start" && !s.walkEnd) out.push(pebble);
    if (morning.includes(phase)) {
      if (s.grannyRelayed && !s.grannyAfter && day > (s.grannyRelayDay || 0)) out.push(grannyAfter);
      else if (s.grannyMessage === "relay" && !s.grannyRelayed) out.push(relay);
      else if (day >= 2 && !s.grannyMessage) out.push(granny);
      if (["village", "yard"].includes(s.farewell) && !s.return && day > s.farewellDay) out.push(returnVisits[s.farewell]);
      const next = alms.find(c => !s[c.key]);
      if (next && day >= 2 && day > (s.almsDay || 0)) out.push(next);
    }
    if (evening.includes(phase) && s.grave && !s.dedication) out.push(dedication);
    const practice = practiceBeats.find((c, i) => day >= i + 3 && !s[c.key]);
    if (evening.includes(phase) && practice) out.push(practice);
    const tonight = nights[day - 1];
    if (evening.includes(phase) && tonight && !s[tonight.key]) out.push(tonight);
    // A missed farewell remains available on a later evening.
    if (day > 7 && evening.includes(phase) && !s.farewell) out.push(nights[6]);
    return out;
  }

  const linesOf = c => typeof c.lines === "function" ? c.lines() : c.lines;
  function target(c) {
    const p = World.PLACES[c.place];
    return { x: p.x + c.dx, y: p.y + c.dy, title: c.title, name: c.title, body: linesOf(c)[0] };
  }
  function visit(c, owner) {
    const valid = () => K.S === owner && available().includes(c);
    if (!valid()) return;
    K.showSheet({ label: c.title, lines: linesOf(c), choices: [
      ...c.choices.map(([value, label, line, observedTag], i) => ({ label, primary: i === 0, fn: () => {
        if (!valid()) return;
        const day = K.api().storyDay();
        const s = (K.S.q.monkWeek ||= {});
        s[c.key] = value;
        if (alms.includes(c)) s.almsDay = day;
        if (c.key === "farewell") s.farewellDay = day;
        if (c.key === "grannyRelayed") s.grannyRelayDay = day;
        K.save();
        Save.log(line);
        K.showSheet({ label: c.title, lines: [line], choices: [{ label: "Đi tiếp", fn: () => {
          K.closeSheet();
          const card = observedTag && window.PracticeRules?.observedCard?.(observedTag);
          if (card) K.award(card, line);
        } }] });
      } })),
      { label: "Để sau", fn: () => K.closeSheet() },
    ] });
  }
  Mind.register({
    targets: () => available().map(target),
    actors: () => available().filter(c => alms.includes(c) || ["bell", "needle", "farewell", "return"].includes(c.key))
      .map(c => ({ ...target(c), kind: "monk", label: c.key === "farewell" ? "sư già" : "Sư Tịnh", pose: alms.includes(c) ? "stand" : "sit" })),
    loop() {
      const c = available().find(c => K.near(target(c), 38));
      const owner = K.S;
      return c ? K.offer("monkWeek:" + c.key, c.title, () => visit(c, owner)) : false;
    },
  });

  function opening(day) {
    if (!ownStory() || !nights[day - 1]) return null;
    return [[
      "Gió thổi từ bụi tre về cổng nghĩa địa. Dưới mái lá có người đang giũ chiếu.",
      "Rạng sáng, bà cụ ở giếng ngồi xoa đầu gối. Một tiếng chuông lẻ vọng từ tịnh thất.",
      "Nước bên ao sen hắt lên mặt dưới của lá. Bờ đất còn đủ sáng để xuống xem.",
      "Đèn dưới hiên tịnh thất sáng ngang tầm tay. Sư Tịnh đang xem một đường khâu.",
      "Mưa mới lất phất ở đầu hiên tịnh thất, vừa đủ nghe tiếng giọt rơi.",
      "Ngoài nghĩa địa có tiếng lá chạy quanh một ngôi mộ rồi ngừng.",
      "Sư già đặt chiếc chổi cạnh gốc cây. Những con đường khác vẫn mở.",
    ][day - 1]];
  }
  function ending(day) {
    const c = nights[day - 1];
    if (!ownStory() || !c) return null;
    const choice = c.choices.find(([value]) => value === journal()[c.key]);
    return choice ? choice[2] : [
      "Gần sáng, gió ở cổng nghĩa địa dịu xuống. Một ngày mới bắt đầu trên con đường qua giếng.",
      "Chuông đã im. Ánh sớm chạm tới những bậc thềm dưới hiên.",
      "Mặt ao mờ đi trong sương. Từ làng vọng tới tiếng người gọi nhau.",
      "Bóng mái hiên ngắn dần. Trên sân lộ ra những vệt chân nhỏ của chim.",
      "Sáng ra, nước ở đầu dây phơi còn nhỏ giọt xuống đất.",
      journal().dedication === "offered" ? "Lời hồi hướng đã dứt. Nghĩa địa trở lại với tiếng dế." : "Gần sáng, sương đọng thành một hàng trên cỏ nghĩa địa.",
      "Đã bảy đêm kể từ ngày tới đây. Những việc chưa xong vẫn ở đó, không ai giục.",
    ][day - 1];
  }
  return { opening, ending };
})();
