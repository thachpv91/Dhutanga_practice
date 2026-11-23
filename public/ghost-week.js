// G01–G07. Only a choice made by this character advances an episode.
window.GhostWeek = (() => {
  const K = Mind.kit;
  const active = () => K.role() === "ghost" && !!K.api()?.arrival?.();
  const state = () => K.S.q.ghostWeek || {};
  const chapterClosed = () => active() && !!state().chapterClosed;
  const day = () => K.api().storyDay();
  const evening = () => ["Chiều tàn", "Chạng vạng", "Đầu hôm", "Canh hai", "Canh ba", "Canh tư", "Gà gáy"].includes(K.api().phase());
  const close = () => K.closeSheet();
  const choice = (label, fn, primary = false) => ({ label, fn, primary });
  function scene(label, lines, choices = []) {
    const owner = K.S;
    let used = false;
    K.showSheet({ label, lines, choices: [...choices, choice("Đi tiếp", close)].map(c => ({
      ...c, fn() {
        if (used || K.S !== owner || !active()) return;
        used = true;
        c.fn();
      },
    })) });
  }
  function record(fields, line) {
    K.S.q.ghostWeek = { ...state(), ...fields };
    K.save();
    if (line) Save.log(line);
  }
  function mark(fields, line) { record(fields, line); close(); }

  // G01. The lamp can be made safe without frightening anyone. A scare is remembered separately.
  function lamp() {
    const s = state();
    if (s.lampSafe) return scene("Đèn ngoài hiên", ["Đèn đã treo lên móc cao. Ông Tư cúi xuống buộc lại dép dưới quầng sáng."]);
    if (s.lampWarned) return scene("Mép khăn cạnh đèn", [
      "Ông Tư dừng chân. “Khét ở đâu vậy cà?” Ông quay lại, kéo chiếc khăn ra, nhấc đèn lên móc tường.",
    ], [choice("Nhìn lại chỗ đèn vừa tắt khói", () => mark({ lampSafe: true }, "Nhờ tiếng động ở mép khăn, ông Tư quay lại và dời đèn lên cao."), true)]);
    function warn() {
      record({ lampWarned: true }, "Tôi làm mép khăn sột soạt để ông Tư để ý ngọn đèn.");
      lamp();
    }
    function amend() {
      record({ motive: "amend" }, "Tôi nhận mình đã làm ông Tư sợ và muốn sửa, không nuôi day dứt.");
      scene("Muốn sửa", [
        "Bạn gọi đúng việc đã làm: mình đã khiến ông sợ.",
        "Muốn sửa khác với cứ quay lại day dứt. Bạn còn có thể báo ngọn đèn.",
      ], [choice("Báo chiếc đèn cho ông", warn, true)]);
    }
    function motive() {
      scene("Sau cánh cửa", ["Then cửa cài đánh cạch. Ông Tư còn thở dốc. Vệt đèn vẫn đổ trên chiếc khăn."], [
        choice("Mình thích cái thú ấy và muốn làm lại", () => {
          record({ motive: "delight" }, "Tôi thích cái cảm giác khiến người khác phải chạy trốn và muốn giữ nó.");
          close();
          K.award("tham", "Tôi muốn giữ lấy cái thú làm ông Tư hoảng sợ, và muốn làm lại.");
        }),
        choice("Nghe ông thở dốc, thấy day dứt", () => {
          record({ motive: "remorse_once" }, "Nghe ông Tư thở dốc, tôi thấy day dứt một lần về việc vừa làm.");
          scene("Sau cánh cửa", ["Ông Tư còn thở. Day dứt vừa chạm rồi lắng. Việc đã làm vẫn còn đó."]);
        }),
        choice("Mình chỉ định đùa một chút", () => mark({ motive: "joke" }, "Tôi dừng lại khi nghe tiếng then cửa cài.")),
        choice("Nhận là mình đã làm ông sợ, và muốn sửa", amend),
        choice("Báo chiếc đèn cho ông", warn),
      ]);
    }
    if (s.motive === "remorse_once") return scene("Lại nhớ tiếng then cửa", [
      "Bạn đã rời hiên, nhưng tiếng then cửa và hơi thở của ông Tư lại hiện ra.",
      "Day dứt về việc đã làm quay lại lần nữa.",
    ], [
      choice("Cứ quay đi quay lại với việc ấy", () => {
        record({ motive: "regret" }, "Day dứt về việc đã làm cứ quay lại.");
        close();
        K.award("hoi_han", "Tôi đã làm ông Tư hoảng sợ, rồi cứ day dứt quay đi quay lại về việc ấy.");
      }, true),
      choice("Nhận lỗi và muốn sửa", amend),
    ]);
    const choices = [choice("Làm mép khăn sột soạt cạnh ngọn đèn", warn, true)];
    if (!s.fear) choices.push(choice("Gõ khẽ vào hàng rào", () => {
      record({ fear: "startled" }, "Ông Tư giật mình, gọi con Vàng sát vào hiên.");
      scene("Tiếng gõ trong tre", ["Ông Tư giật nảy, lấy tay che đèn. “Ai đó?” Con Vàng rúc sát vào chân ông."], [choice("Báo chỗ đèn đang bén khăn", warn)]);
    }), choice("Cho bóng mình lướt qua vách", () => {
      record({ fear: "scared" }, "Ông Tư hoảng hốt chạy vào hiên khi thấy một bóng lướt qua vách.");
      motive();
    }));
    else if (s.fear === "scared" && !s.motive) choices.push(choice("Đứng lại ngoài cánh cửa", motive));
    scene("Ngoài hiên ông Tư", [s.fear ? "Ông Tư cứ ngoái ra phía rào. Con Vàng nằm thức dưới chân ông." :
      "Con Vàng ngủ sau rào. Ông Tư đặt đèn xuống bậc gạch; một góc khăn sà sát ngọn lửa."], choices);
  }

  // G02. A morning offering and an evening memory of it are two different visits.
  function offering() {
    if (state().incenseClung) return scene("Ngoài tường tịnh thất", ["Làn hương đã tan. Bóng kia không còn đứng đó."]);
    scene("Ngoài tường tịnh thất", ["Người mang cơm hé vung. Vị sư đỡ lấy bát. Một hạt cơm còn dính ở ngón tay người vừa xới.",
      "Ngoài hàng rào, một bóng gầy khác vừa dừng lại khi ngửi thấy làn hương."], [
      choice("Nhìn người mang cơm", () => mark({ offeringSeen: true }, "Qua bức tường, tôi thấy một người cẩn thận đậy bát cơm vừa dâng."), true),
      choice("Đưa tay vào làn hơi", () => {
        record({ offeringSeen: true }, "Bàn tay tôi xuyên qua hơi cơm bên tường tịnh thất.");
        scene("Một làn hơi", ["Hơi ấm vẫn bay lên giữa những ngón tay. Người mang cơm kéo chiếc vung cho kín."]);
      }),
      choice("Xem làn hương này là phần của mình", () => {
        scene("Giữ riêng làn hương", [
          "Bạn thấy khó chịu khi bóng kia cũng sắp được hưởng.",
          "Bạn muốn giữ làn hương ấy cho riêng mình.",
        ], [
          choice("Chắn trước, không để bóng kia cùng hưởng", () => {
            if (state().incenseClung) return close();
            record({ offeringSeen: true, incenseClung: true }, "Tôi xem làn hương là phần của mình và chắn không cho bóng kia cùng hưởng.");
            close();
            K.award("bon_xen", "Tôi xem hương cơm là phần của mình, khó chịu khi bóng kia cùng hưởng, và chọn ngăn họ.");
          }, true),
          choice("Đứng sang một bên", () => mark({ offeringSeen: true, incenseShared: true }, "Tôi đứng sang, không giữ làn hương cho riêng mình.")),
        ]);
      }),
    ]);
  }
  function smallDedication() {
    scene("Tiếng nói bên tường", ["Người mang cơm đã về. Vị sư khẽ nói: “Nguyện điều lành này đến được những ai hữu duyên.”"], [
      choice("Nán lại đến khi tiếng nói dứt", () => mark({ smallDedication: true }, "Tôi nghe một lời hồi hướng bên tường tịnh thất."), true),
    ]);
  }

  // G03. The player must independently see both the lost object and its owner.
  function house() {
    scene("Bậc sau nhà hoang", ["Ánh sáng lọt qua mái dột. Sau một viên gạch nghiêng có sợi chỉ đỏ vắt ngang tàu lá tre."], [
      choice("Nhìn xuống khe gạch", () => {
        record({ bagSeen: true }, "Túi vải có kim và một ống chỉ đỏ nằm dưới bậc sau nhà hoang.");
        scene("Chiếc túi khâu vá", ["Một đầu kim ló ra khỏi miệng túi. Ngoài ngõ có tiếng lục thúng, rồi tiếng ai thở dài."]);
      }, true),
    ]);
  }
  function granny() {
    const s = state();
    if (!s.grannyAsked) return scene("Bà cụ bên giếng", ["Bà lật cả cái thúng, mò những kẽ nan. “Hồi chiều bà ngồi vá ở thềm nhà cũ mà…”"], [
      choice("Nghe bà tả túi vải có cuộn chỉ đỏ", () => {
        record({ grannyAsked: true }, "Bà cụ bên giếng vừa đánh mất túi kim chỉ ở chỗ trú chân.");
        if (state().bagSeen) granny(); else close();
      }, true),
    ]);
    const hint = mode => {
      record({ bagHint: mode, hintDay: day() }, mode === "dream" ? "Trong giấc ngủ của bà cụ, tôi gợi hình chiếc lá tre cạnh túi kim chỉ." :
        "Nghe tiếng khẽ bên tai, bà cụ chợt nhớ ra bậc thềm nơi mình từng ngồi.");
      scene("Bà cụ nhớ lại", [mode === "dream" ? "Bà trở mình. Trong giấc ngủ, môi bà mấp máy: “Bậc thềm…”" :
        "Bà dừng chân. “Còn sau bậc gạch nữa!” Bà lần về phía căn nhà cũ."]);
    };
    if (evening()) return scene("Mái hiên bên giếng", ["Bà ngủ thiếp cạnh cái thúng sờn quai. Dưới bàn tay nhăn nheo vẫn còn một đầu chỉ đỏ."], [
      choice("Gợi hình chiếc lá bên bậc gạch trong mơ", () => hint("dream"), true),
    ]);
    scene("Chiếc thúng sờn quai", ["Bà cụ quờ tay vào túi áo, ngó quanh. “Chẳng lẽ bà để rơi ngoài đường?”"], [
      choice("Thì thầm hai tiếng “bậc thềm”", () => hint("whisper"), true),
    ]);
  }
  function foundBag() {
    record({ helpedGranny: true }, "Bà cụ tự tìm thấy túi kim chỉ sau bậc gạch và vá lại quai thúng.");
    scene("Bậc gạch nhà cũ", ["Bà cúi xuống nhặt túi. “Ôi, chỉ còn nguyên!” Bà xâu kim, kéo hai mép quai thúng sát lại."], [
      choice("Ở lại xem bà khâu nốt đường chỉ", () => mark({ watchedBasket: true }, "Bà kéo thử quai thúng vừa vá. Lần này quai đã chịu được sức nặng.")),
    ]);
  }

  // G04 is a free detour from the very first day. The three landmarks share one encounter location.
  function pier() {
    const s = state();
    if (!s.pier) {
      const listen = () => {
        const aside = () => scene("Một khoảng nước sáng", ["Tre chạm nhau ngay trên đầu. Tiếng kia lại vọng từ sâu trong khe, đều như một nhịp chèo."], [choice("Lắng nghe lại", listen, true)]);
        scene("Trong khe đá", ["Suối chảy qua hai hòn đá rêu. Nước vẫn chảy mà tiếng róc rách đã ngừng. Bạn nghe gì phía trong?"], [
          choice("Lần theo tiếng sỏi lăn", aside), choice("Lần theo tiếng mái chèo", () => {
            record({ pier: true }, "Từ khe suối rừng tre, tôi lần theo tiếng mái chèo tới Bờ Chìm.");
            pier();
          }, true), choice("Lần theo tiếng lá tre", aside),
        ]);
      };
      return scene("Khe suối rừng tre", ["Một vệt trăng bạc lướt dưới chân đá. Từ phía không có con thuyền nào, một mái chèo vừa khua nước."], [choice("Ghé sát khe đá nghe thử", listen, true)]);
    }
    const choices = [];
    function landmark(key, title, text) {
      choices.push(choice(title, () => {
        if (!state()[key]) record({ [key]: true }, text);
        scene(title, [text], [choice("Trở về mép bến", pier)]);
      }));
    }
    landmark("dryWell", "Ngó xuống giếng cạn", "Trời trên miệng giếng còn mây, trời dưới đáy giếng đầy sao.");
    landmark("hamlet", "Ghé xóm không khói", "Có tiếng gọi nhau về ăn cơm. Cả ba mái nhà đều vắng khói bếp.");
    landmark("pillars", "Nhìn sau ba cột đá", "Sau mỗi cột có một vạch nước cũ, cao quá đầu người.");
    if (day() >= 5 && evening() && !s.ferryman) choices.unshift(choice("Hỏi người giữ bến về mùa nước lớn", () => {
      scene("Người giữ bến", ["“Tôi nghe tiếng trẻ khóc. Đêm ấy người gọi nhau nhiều lắm. Ai lên được bờ thì tôi không thấy.”"], [
        choice("Ghi đúng lời người giữ bến", () => mark({ ferryman: true }, "Lời người giữ bến: đêm lũ có tiếng trẻ khóc. Ông không thấy ai đã qua bờ."), true),
        choice("Hỏi ông có chắc mình nhìn thấy đứa bé", () => scene("Vệt nước trên cột", ["“Tôi chỉ nghe, đâu dám chắc.” Ngón tay ông dừng lại ở vạch nước cao nhất."], [
          choice("Ghi lại điều ông đã nghe", () => mark({ ferryman: true }, "Người giữ bến chỉ nghe tiếng trẻ, chưa biết đứa trẻ là ai."), true),
        ])),
      ]);
    }, true));
    scene("Bến Không Tiếng · Bờ Chìm", ["Ba cột đá nhô khỏi mặt nước. Qua bóng cột là giếng cạn và ba mái nhà thấp."], choices);
  }
  function baSau() {
    const s = state();
    if (s.baSauMet && s.ferryman) return scene("Bà Sáu bên gốc gạo", ["“Có người nói từng nghe tiếng trẻ ở bến.” Bà quay lại rất chậm. “Đứa trẻ có lên được bờ không?”"], [
      choice("Cháu chưa biết, bà ạ", () => {
        record({ baSauAnswered: true }, "Tôi nói với bà Sáu rằng vẫn chưa ai biết đứa trẻ có lên được bờ.");
        scene("Dưới tán gạo", ["“Ừ. Khi nào biết hẵng nói bà.” Bà nhường một chỗ trên rễ cây. Hai người ngồi nhìn con đường."]);
      }, true),
    ]);
    scene("Người nhìn con đường", ["Nghe tiếng guốc, bà Sáu ngẩng lên. Tiếng chân qua rồi, bà vẫn nhìn theo.", "“Bà chờ ai ạ?” — “Một người đi đã lâu. Bà chỉ còn nhớ tiếng nước.”"], [
      choice(s.pier ? "Kể bà nghe về ba cột đá ở bến" : "Ngồi nghe bà kể về tiếng nước", () => mark({ baSauMet: true }, "Bà Sáu chờ một người và nhớ tiếng nước. Tôi chưa biết người ấy là ai."), true),
    ]);
  }

  function byGrave() {
    const s = state();
    if (s.satNearby) return scene("Lời hồi hướng bên mộ", ["Khi vị sư đứng dậy, vạt y sẫm màu vì sương. “Xin chia sẻ điều lành này đến những ai còn đang chịu khổ.”"], [
      choice("Ở lại nghe đến cuối", () => mark({ heardFull: true }, "Tôi đã nghe hết lời hồi hướng của vị sư bên ngôi mộ."), true),
    ]);
    const wait = startled => {
      record({ satNearby: true }, startled ? "Lá động, vị sư khựng lại rồi ngồi yên. Tôi ở lại cạnh ngôi mộ." : "Tôi ở lại nghe tiếng dế trong khi vị sư ngồi bên mộ.");
      scene("Một lúc sau", [startled ? "Vị sư giật nhẹ, mở mắt, khép lại hai vạt y. Một lúc lâu sau tiếng dế lại đều." :
        "Sương thấm đầu cỏ. Tiếng dế ngừng rồi nổi lên. Vị sư mở mắt."], [choice("Nán lại khi vị sư sửa y", byGrave, true)]);
    };
    scene("Vị sư bên ngôi mộ", ["Một vị sư vừa trải tọa cụ xuống cỏ. Gió lùa qua mép y; người yên lặng trong tiếng dế."], [
      choice("Ở lại nghe tiếng dế", () => wait(false), true), choice("Làm lá khô xào xạc", () => wait(true)),
    ]);
  }
  function finalDawn() {
    const memories = [];
    const s = state();
    if (s.lampSafe) memories.push("Ngọn đèn đã được dời xa chiếc khăn. Ông Tư chẳng biết ai nhắc.");
    if (s.helpedGranny) memories.push("Chiếc túi kim chỉ đã về tay bà cụ; quai thúng có một đường khâu mới.");
    if (s.pier) memories.push("Sau khe đá rừng tre còn một bến nước không có tiếng sóng.");
    if (s.baSauMet) memories.push("Bà Sáu vẫn nhìn về con đường. Có câu hỏi bạn chưa biết trả lời.");
    if (s.heardFull) memories.push("Lời hồi hướng bên mộ đã dứt; đêm chỉ bớt lạnh một chút.");
    scene("Bình minh trên tán gạo", ["Những mái nhà hiện dần sau màn sương. Con đường về phía rừng tre vẫn còn đó.", "Hôm nay bạn muốn đi đâu?"], [
      choice("Mình còn muốn khám phá", close, true),
      choice("Nhìn lại những gì đã trải qua", () => scene("Những con đường đã qua", memories.length ? memories.slice(0, 3) : [
        "Bạn đã đi qua vài con đường. Có những chuyện mới chỉ nghe một nửa.",
      ], [choice("Trở lại dưới tán gạo", finalDawn, true)])),
      choice("Khép chương bảy đêm", () => {
        record({ chapterClosed: true, chapterClosedDay: day() }, "Bảy đêm mở đầu đã khép. Những con đường khác vẫn còn mở.");
        scene("Những con đường chưa khép", [
          "Có những con đường bạn đã đi qua. Có những câu chuyện mới chỉ nghe một nửa.",
          "Trời sáng rồi. Bạn vẫn có thể tiếp tục khám phá và trở lại những việc còn dang dở.",
        ]);
      }),
    ]);
  }

  function chapterMoments(s = state()) {
    return [s.lampSafe || s.fear, s.offeringSeen || s.smallDedication, s.bagSeen || s.helpedGranny,
      s.pier, s.baSauMet, s.satNearby || s.heardFull].filter(Boolean).length;
  }

  const locations = {
    lamp: ["village", 48, 20, "Hiên ông Tư"], house: ["bamboo", 204, -160, "Bậc sau nhà hoang"],
    offering: ["hermitage", 40, 30, "Ngoài tường tịnh thất"], bag: ["well", -28, 24, "Mái hiên bên giếng"],
    creek: ["bamboo", -38, 18, "Khe suối rừng tre"], tree: ["gao", 26, 22, "Gốc gạo"], grave: ["graves", -36, 40, "Bên ngôi mộ"],
  };
  function nodes() {
    if (!active()) return [];
    const s = state(), d = day(), night = evening(), out = [];
    function add(id, place, title, run, accepted = false) {
      const [key, dx, dy, name] = locations[place], p = K.P()[key];
      if (p) out.push({ id, title, name, body: name, x: p.x + dx, y: p.y + dy, run, accepted });
    }
    if (s.bagHint && !s.helpedGranny && (s.bagHint === "whisper" || d > s.hintDay && !night)) add("found", "house", "Xem bà cụ tìm lại túi", foundBag, true);
    if (d >= 2 && !s.bagHint && (!s.grannyAsked || s.bagSeen)) add("granny", "bag", s.grannyAsked ? "Gợi chỗ túi cho bà cụ" : "Nghe bà cụ tìm đồ", granny, !!s.grannyAsked && s.bagSeen);
    if (!s.bagSeen) add("house", "house", "Nhìn dưới bậc nhà hoang", house, !!s.grannyAsked);
    if (night && !s.lampSafe) add("lamp", "lamp", s.lampWarned ? "Xem ông Tư dời đèn" : "Ghé ngọn đèn nhà ông Tư", lamp, !!s.lampWarned);
    if (d >= 2 && !s.offeringSeen && ["Sáng tinh mơ","Buổi sáng","Rạng sáng","Sáng sớm","Sáng"].includes(K.api().phase())) add("rice", "offering", "Lần theo hơi cơm", offering);
    if (s.offeringSeen && night && !s.smallDedication) add("wall", "offering", "Nghe lời bên tường", smallDedication);
    if (d >= 5 && night && (!s.baSauMet || s.ferryman && !s.baSauAnswered)) add("baSau", "tree", s.baSauMet ? "Kể bà Sáu điều đã nghe" : "Hỏi bà Sáu đang chờ ai", baSau, !!(s.baSauMet && s.ferryman));
    if (night && !s.heardFull && (d >= 6 || (s.lampSafe || s.helpedGranny) && s.smallDedication)) add("grave", "grave", s.satNearby ? "Nghe hồi hướng bên mộ" : "Đến bên vị sư ngồi ở mộ", byGrave, !!s.satNearby);
    if (!s.chapterClosed && d >= 7 && chapterMoments(s) >= 2 && ["Gà gáy","Rạng sáng","Sáng sớm","Sáng tinh mơ","Buổi sáng","Sáng"].includes(K.api().phase())) {
      add("dawn", "tree", "Dừng dưới tán gạo khi trời sáng", finalDawn);
    }
    add("creek", "creek", s.pier ? "Ghé lại Bờ Chìm" : "Lắng nghe khe suối rừng tre", pier, !!(s.baSauMet && !s.ferryman && night));
    return out;
  }
  function activeQuest() { return nodes().find(n => n.accepted) || null; }
  function loop() {
    const me = World.getPlayer();
    let nearest, min = 31;
    for (const n of nodes()) {
      const dist = Math.hypot(n.x - me.x, n.y - me.y);
      if (dist < min) { nearest = n; min = dist; }
    }
    return nearest ? K.offer("ghost_week_" + nearest.id, nearest.title, nearest.run) : false;
  }
  function actors() {
    const kinds = { lamp: ["weekLantern", ""], granny: ["granny", "bà cụ"], found: ["granny", "bà cụ"], baSau: ["ghostbot", "bà Sáu"], grave: ["monk", "vị sư"] };
    return nodes().filter(n => kinds[n.id]).map(n => ({
      kind: kinds[n.id][0], x: n.x, y: n.y, label: kinds[n.id][1], phase: 0, alpha: 0.75,
    }));
  }
  const openings = [
    "Gió qua ngôi mộ thấp. Ở cuối con đường, một con chó bỗng ngẩng đầu nhìn ánh đèn.",
    "Mùi cơm từ tịnh thất còn vương ở chân tường. Gió đưa một tiếng nói qua hàng rào.",
    "Bên giếng, bà cụ lục mãi một chiếc thúng có quai sờn. Tơ đỏ vương trên tay áo.",
    "Lá tre cọ nhau. Dưới khe đá có một nhịp khua rất đều, như tiếng chèo xa bến.",
    "Gốc gạo đổ bóng qua lối đi. Có người cứ quay mặt về phía tiếng guốc.",
    "Ở ngôi mộ phía trong, một vạt y vừa chạm cỏ. Tiếng dế dần trở lại.",
    "Sương đọng trên những gờ đá. Tiếng chuông nhỏ từ tịnh thất lẫn trong gió.",
  ];
  function opening(d) { return openings[d - 1] ? [openings[d - 1]] : null; }
  function ending(d) {
    const s = state();
    return [
      s.lampSafe ? "Chiếc đèn đã nằm trên móc cao. Con Vàng trở mình dưới hiên." : "Gió qua hàng rào. Con Vàng lắng tai một lúc rồi lại nằm xuống.",
      s.smallDedication ? "Lời hồi hướng đã dứt, tiếng người bên kia tường vẫn còn trong trí nhớ." : "Ngoài tường tịnh thất, khói bếp tan mỏng dần.",
      s.helpedGranny ? "Chiếc túi đã về tay bà cụ. Đường chỉ trên quai thúng còn mới." : "Đêm khép lại bên giếng. Tàu lá tre nằm im trên bậc gạch.",
      s.pier ? "Trong trí nhớ còn ba cột đá nhô khỏi nước ở Bờ Chìm." : "Tiếng mái chèo vẫn vọng từ trong khe tre.",
      s.baSauAnswered ? "Bà Sáu vẫn ngồi dưới gốc gạo. Câu hỏi về đêm nước lớn còn để ngỏ." : "Tiếng guốc ngoài đường gạo thưa dần.",
      s.heardFull ? "Bên ngôi mộ, lời nguyện của vị sư đã đi hết một hơi." : "Gần sáng, sương đọng thành một hàng trên cỏ nghĩa địa.",
      s.chapterClosed ? "Bảy đêm mở đầu đã khép. Những con đường khác vẫn còn mở." : "Trời sáng trên lối quen. Bạn còn có thể quay về những nơi muốn ghé.",
    ][d - 1] || null;
  }
  Mind.register({ targets: nodes, loop, actors });
  return { opening, ending, activeQuest, chapterClosed };
})();
