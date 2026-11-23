// The first week of a villager's own story. Dates open opportunities; saved actions decide what people remember.
window.VillagerWeek = (() => {
  const K = Mind.kit;
  const q = () => K.S.q.villagerWeek || {};
  const peta = () => K.S.q.peta?.step || "none";
  const naHome = () => ["thank", "done"].includes(K.S.q.tree?.step) || !!K.S.village?.deeds?.na_home;
  const elderHelped = () => q().herbs === "delivered" || !!K.S.village?.deeds?.granny_herbs;

  const openings = {
    3: ["Ngoài giếng có tiếng gáo khua vào thành. Trời đã bớt nắng."],
    4: ["Tới khúc quanh đầu ngõ, bậc đá chìm dần vào bóng tối."],
    5: ["Cả ngõ thơm mùi nếp. Nhà ai đó đang đồ xôi."],
    6: ["Bên hiên ông Tư, lá chuối đã xếp thành chồng."],
    7: ["Chiều xuống trên con đường qua giếng. Những mái nhà đã bắt đầu thấy quen."],
  };
  function opening(night) {
    if (night === 2) {
      if (peta() === "none") return ["Ngoài ngõ có người nhắc đến tiếng khẽ bên ngôi mộ thấp. Nghe như ai kêu đói."];
      if (peta() === "dedicated") return ["Lời hồi hướng đã gửi. Trời xuống dần trên lối ra ngôi mộ thấp."];
      if (peta() === "done") return ["Chiều muộn, gió đi qua cỏ bên lối ra nghĩa địa."];
      return ["Trời sắp tối. Chuyện bên ngôi mộ thấp vẫn còn dang dở."];
    }
    return openings[night] || null;
  }

  function ending(night) {
    const s = q();
    if (night === 1) return naHome()
      ? "Bé Na đã về nhà. Ngoài bụi tre chỉ còn tiếng lá."
      : "Đêm đầu ở làng mới. Những lối nhỏ vẫn còn chờ được khám phá.";
    if (night === 2) {
      if (peta() === "done") return "Mộ thấp đã yên. Gió thổi qua cỏ như mọi đêm.";
      if (peta() === "dedicated") return "Lời hồi hướng đã gửi. Có thể ghé lại mộ thấp vào một tối khác.";
      if (["rice", "offer"].includes(peta())) return "Lời đã hứa bên mộ thấp còn chờ một buổi sáng.";
      return "Lối ra nghĩa địa vẫn ở đó. Đêm khác có thể ghé.";
    }
    if (night === 3) return elderHelped() ? "Mùi canh rau má bay từ bếp ra giếng." : "Dưới gốc mít, rau má còn đọng sương.";
    if (night === 4) return s.lamp ? "Ánh đèn phủ lên từng bậc đá ở khúc quanh." : "Khúc quanh đầu ngõ lặng trong bóng tối.";
    if (night === 5) return s.debtHeard ? "Ba bát xôi. Ông Tư nói tới đó rồi im." : "Mùi nếp còn vương trong ngõ.";
    if (night === 6) return s.xoiDelivered ? "Xôi đã đến tay người nhận. Ngoài hiên vẫn còn mấy tàu lá chuối." : "Ông Tư thu xếp lá chuối ngoài hiên.";
    if (night === 7) return s.xoiInvite ? "Ông Tư nói: “Mai ghé.” Đường qua hiên nhà ông giờ đã quen." : "Bảy đêm ở làng. Vẫn còn mấy lối nhỏ để đi.";
    return null;
  }

  const close = () => K.closeSheet();
  const choice = (label, fn, primary = false) => ({ label, fn, primary });
  const leave = () => choice("Đi tiếp", close);
  function sheet(label, lines, choices = [leave()]) {
    // A button from a previous sheet cannot finish a later step a second time.
    let used = false;
    K.showSheet({ label, lines, choices: choices.map((c) => ({ ...c, fn: () => {
      if (used) return;
      used = true;
      c.fn();
    } })) });
  }
  function record(fields, line) {
    K.S.q.villagerWeek = { ...q(), ...fields };
    K.save();
    if (line) Save.log(line);
  }
  function settle(fields, line) { record(fields, line); close(); }

  function morningTree() {
    const lines = q().gaoMorning ? ["Bóng cây gạo trải qua lối đất. Nắng len qua kẽ lá."] :
      ["Bóng lá loang trên đất. Một chiếc lá chao chậm hơn những chiếc khác."];
    const choices = [];
    if (!q().gaoMorning) choices.push(choice("Nhìn theo chiếc lá", () => settle({ gaoMorning: true }, "Đã ngắm bóng gốc gạo buổi sáng."), true));
    if (K.api().storyDay() === 1) choices.push(choice("Ngồi dưới gốc gạo đến chiều tàn", () => {
      if (!q().gaoMorning) record({ gaoMorning: true }, "Đã ngồi bên gốc gạo từ sáng đến chiều tàn.");
      close();
      K.api().waitForDusk();
    }));
    sheet("Gốc gạo", lines, [...choices, leave()]);
  }

  function visitNa() {
    const cameHome = naHome();
    const painted = K.api().storyDay() >= 6;
    const key = painted ? "naDrawing" : "naMorning";
    const lines = painted ? [
      "Na ngồi vẽ cây gạo bằng than trên tấm mo cau.",
      cameHome ? "“Còn đây là người dắt con về.”" : "“Mấy chấm này là lá sáng. Mẹ nói con vẽ nhiều quá.”",
    ] : [
      "Chị Ba giũ chiếc áo nhỏ trước cửa.",
      cameHome ? "“Na ngủ một giấc tới sáng. Giờ còn kể chuyện đom đóm.”" : "Chị gật đầu chào rồi quay lại giũ áo.",
    ];
    sheet(painted ? "Tranh của Na" : "Trước cửa nhà chị Ba", lines, [
      choice(painted ? "Ngồi xem bé vẽ một lát" : "Chào chị Ba", () => settle({ [key]: true },
        painted ? "Đã xem Na vẽ lá sáng dưới gốc gạo." : "Đã ghé qua nhà chị Ba buổi sáng."), true),
      leave(),
    ]);
  }

  function grannyHerbs() {
    const carried = q().herbs === "picked";
    sheet("Giếng làng", carried ? ["Bà cụ dọn chỗ bên nồi canh. “Con mang rau về rồi à?”"] :
      ["Bà cụ đặt chiếc thúng trống xuống. “Bà tính nấu canh rau má, mà cái chân lại đau.”"], [
      ...(carried ? [
        choice("Đưa bà cả nắm rau như đã hẹn", () => deliverHerbs(false), true),
        choice("Bớt một ít cho nồi nhà mình, đưa bà phần còn lại", () => deliverHerbs(true)),
      ] : [
        choice("Chân bà đang đau, để con hái giúp một nắm", () => settle({ herbs: "accepted" }, "Đã nhận lời hái rau má cho bà cụ."), true),
        choice("Hỏi rau má mọc ở đâu", () => sheet("Giếng làng", ["“Gốc mít cuối làng. Mọc dày như thảm.”"])),
      ]),
      leave(),
    ]);
  }
  function deliverHerbs(half) {
    record({ herbs: "delivered", herbsHalf: half }, half ? "Đã mang một phần rau má về giếng." : "Đã mang trọn nắm rau má về cho bà cụ.");
    window.Village?.record("granny_herbs", K.api().storyDay());
    sheet("Giếng làng", [half ? "Bà nhìn nắm rau rồi cười. “Chừng này cũng được một bát.”" : "“Chà, non quá. Nồi canh hôm nay ngọt phải biết.”"]);
  }
  function pickHerbs() {
    function pick(count) {
      if (count === 3) {
        record({ herbs: "picked" }, "Đã hái một nắm rau má dưới gốc mít.");
        sheet("Gốc mít", ["Nắm rau vừa một bàn tay, còn dính sương."], [choice("Cất rau, mang về giếng khi tiện", close, true)]);
        return;
      }
      const lines = ["Lá rau má mọc quanh rễ mít.", "Những lá non còn đọng nước.", "Nắm rau đã gần đủ."];
      sheet("Gốc mít", [lines[count]], [choice("Hái một nhúm rau", () => pick(count + 1), true), choice("Để sau", close)]);
    }
    pick(0);
  }

  function dipper() {
    if (dipperState(K.api().storyDay()) === "npc") {
      return sheet("Giếng làng", ["“Bà nhờ người chêm lại cán rồi. Múc nước nhẹ tay hẳn.”"], [
        choice("Múc thử một gáo", () => settle({ sawDipper: true }, "Đã nghe bà cụ kể chiếc gáo được sửa."), true), leave(),
      ]);
    }
    const repair = () => sheet("Cán gáo lỏng", ["Cán nghiêng về một bên. Có một khe nhỏ giữa cán và bầu gáo."], [
      choice("Chêm miếng nêm vào khe", () => {
        record({ dipper: "pc", sawDipper: true }, "Đã chêm lại cán gáo ở giếng làng.");
        sheet("Giếng làng", ["Bà múc thử một gáo. Lần này nước không sánh ra mép thùng."]);
      }, true), leave(),
    ]);
    sheet("Giếng làng", ["“Cái gáo theo bà bao năm. Nay lỏng cán, múc là nghiêng.”"], [
      choice("Xem chỗ cán bị lỏng", repair, true),
      ...(!q().dipperPromise ? [choice("Hẹn mai quay lại sửa", () => settle({ dipperPromise: K.api().storyDay() }, "Đã hẹn với bà cụ sẽ quay lại xem cán gáo."))] : []),
      leave(),
    ]);
  }
  const dipperState = (day) => q().dipper || (day >= (q().dipperPromise || 3) + 2 ? "npc" : null);
  const lampState = (day) => q().lamp || (day >= 6 ? "npc" : null);

  function dog() {
    const goodwill = (makingAmends) => {
      record({ dog: "calm" }, makingAmends
        ? "Đã quay lại ngồi thấp, mong con Vàng được yên, không quát thêm."
        : "Ngay lần đầu gặp, đã ngồi thấp và mong con Vàng bớt sợ.");
      close();
      K.award("khong_san", makingAmends
        ? "Người này quay lại, mong con Vàng được yên, không quát thêm và chờ nó bớt sợ."
        : "Ngay lần đầu gặp, người này ngồi thấp và mong con Vàng bớt sợ.");
    };
    const neutral = () => {
      record({ dog: "calm" }, "Đã ngồi chờ cho con Vàng quen hơi, chưa nói mình muốn nó được yên.");
      close();
    };
    if (q().dog === "barked") return sheet("Con Vàng", ["Con Vàng đứng nép sau chân ông Tư. Nó vẫn nhìn ra phía ngõ."], [
      choice("Ngồi thấp, mong nó được yên", () => goodwill(true), true),
      choice("Ngồi chờ, không nói gì thêm", neutral),
      leave(),
    ]);
    sheet("Con Vàng", [
      "Con Vàng sủa sau hàng rào.", "Ông Tư gọi: “Vàng, vô hiên. Người ta chỉ đi ngang thôi.”",
    ], [
      choice("Ngồi thấp, mong nó bớt sợ", () => goodwill(false), true),
      choice("Ngồi thấp, chờ nó quen hơi", neutral),
      choice("Quát cho nó im", () => {
        record({ dog: "barked", dogDay: K.api().storyDay() }, "Con Vàng lùi về sau hàng rào khi nghe tiếng quát.");
        sheet("Con Vàng", ["Con Vàng lùi một bước. Ông Tư lặng lẽ dắt nó vào hiên."]);
      }),
      leave(),
    ]);
  }

  function lamp() {
    const state = lampState(K.api().storyDay());
    if (state) return sheet("Khúc quanh", [state === "pc"
      ? "Ông Tư: “Tối qua có người gánh hàng về muộn, nhờ đèn mà thấy bậc đá.”"
      : "Một ngọn đèn treo trên chiếc cọc. Ông Tư đã tự tìm chỗ khuất mắt nhà bên."], [
      choice("Nhìn bậc đá dưới cọc đèn", () => settle({ sawLamp: true }, "Đã xem ngọn đèn ở khúc quanh."), true), leave(),
    ]);
    sheet("Khúc quanh", ["Ông Tư cầm chiếc đèn, ngó sang nhà bên. “Treo đâu cho sáng bậc đá mà khỏi chói mắt người ta?”"], [
      choice("Phụ ông chọn móc treo", () => sheet("Chiếc cọc ở khúc quanh", ["Móc ngoài soi được nhiều đường hơn. Móc trong khuất mắt nhà bên."], [
        choice("Treo ở móc trong", () => hangLamp("inside"), true),
        choice("Treo ở móc ngoài", () => hangLamp("outside")), leave(),
      ]), true),
      choice("Chỉ ông chỗ treo khuất nhà bên", () => {
        record({ lamp: "advised", lampHook: "inside" }, "Đã chỉ Ông Tư chỗ treo đèn ở khúc quanh.");
        sheet("Khúc quanh", ["Ông Tư tự móc đèn lên cọc. Ánh sáng rơi vừa tới bậc đá."]);
      }), leave(),
    ]);
  }
  function hangLamp(hook) {
    record({ lamp: "pc", lampHook: hook }, "Đã phụ Ông Tư treo đèn ở khúc quanh.");
    sheet("Khúc quanh", [hook === "inside" ? "Ánh đèn rọi xuống bậc đá. Ô cửa nhà bên vẫn tối dịu." : "Vòng sáng phủ rộng tới lối đất. Bậc đá hiện từng bậc một."]);
  }

  function foodSeller() {
    sheet("Giếng làng", ["Bà cụ lựa nếp. “Mùi này làm bà nhớ người bán xôi hồi trước. Xôi người ấy, nửa làng ăn chịu.”"], [
      choice("Nghe bà kể thêm", () => settle({ sellerHeard: true }, "Đã nghe bà cụ kể về người bán xôi năm trước."), true), leave(),
    ]);
  }
  function hearDebt() {
    const s = q();
    const lines = s.lamp === "pc" || s.lamp === "advised"
      ? ["“À, người coi giúp tôi cái đèn.” Ông Tư đặt đôi đũa xuống, nồi xôi còn nguyên."]
      : ["Ông Tư ngồi cạnh nồi xôi mới đồ. Đũa cầm trên tay mà chưa xới."];
    const listen = () => {
      record({ debtHeard: true, debtDay: K.api().storyDay() }, "Đã nghe Ông Tư nhắc món nợ ba bát xôi.");
      sheet("Hiên nhà ông Tư", ["“Tôi còn nợ người ta ba bát xôi. Mà người ta không còn để tôi trả.”"]);
    };
    sheet("Hiên nhà ông Tư", lines, [
      choice("Ngồi xuống bậc thềm với ông", listen, true),
      choice("Hỏi ông nấu xôi cho ai", listen), leave(),
    ]);
  }

  function xoiPrep() {
    sheet("Hiên nhà ông Tư", ["Lá chuối xếp thành một chồng trên chiếu.", "“Nhà nào thiếu bữa thì tôi mang qua. Xôi còn nóng ăn mới ngon.”"], [
      choice("Hẹn qua phụ xếp lá lúc chiều", () => settle({ xoiPromised: true }, "Đã hẹn với Ông Tư sẽ ghé phụ gói xôi."), true), leave(),
    ]);
  }
  function xoiReady() {
    const s = q();
    const send = () => sheet("Gói xôi ngoài hiên", ["Mười hai gói đã buộc lạt. Ông Tư nhấc một đầu quang gánh."], [
      choice("Xách giúp ông một nửa và đi giao", () => {
        record({ xoiDelivery: 1 }, "Đã nhận mang một phần xôi đi cùng Ông Tư.");
        sheet("Gói xôi ngoài hiên", ["Ông Tư chỉ lối qua giếng. “Ghé nhà bên đó trước. Tôi đi qua mấy nhà đầu xóm.”"]);
      }, true),
      choice("Để ông đi giao", () => settle({ xoiDelivered: "npc" }, "Đã phụ gói xôi. Ông Tư tự mang xôi đi.")), leave(),
    ]);
    if (s.xoiWrapped) return send();
    const steps = [
      ["Lá chuối còn ấm. Ông Tư đặt nắm lạt cạnh chiếc thúng.", "Gấp lá chuối"],
      ["Chiếc lá ôm vừa lòng bàn tay.", "Đặt xôi vào lá"],
      ["Hơi nếp luồn qua mép lá.", "Buộc lạt"],
    ];
    function pack(i) {
      if (i === steps.length) {
        record({ xoiWrapped: true }, "Đã phụ Ông Tư gói xôi lá chuối.");
        return send();
      }
      sheet("Gói xôi với ông Tư", [steps[i][0]], [choice(steps[i][1], () => pack(i + 1), true), leave()]);
    }
    sheet("Hiên nhà ông Tư", [s.debtHeard
      ? "“Nợ cũ thì cũ. Xôi mới còn nóng, tôi mang qua mấy nhà đang khó.”"
      : "“Tôi gói xôi đem qua mấy nhà đang khó. Ngồi phụ tôi một lát không?”"], [
      choice("Ngồi xuống phụ ông gói", () => pack(0), true), leave(),
    ]);
  }
  const xoiState = (day) => q().xoiDelivered || (day >= 7 && !q().xoiDelivery ? "npc" : null);
  function deliverXoi() {
    if (q().xoiDelivery === 1) {
      return sheet("Nhà bên giếng", ["Người trong nhà kéo cánh cửa ra. Mùi nếp ấm thoát qua mép lá."], [
        choice("Gửi mấy gói xôi rồi đi tiếp", () => settle({ xoiDelivery: 2 }, "Đã mang xôi tới nhà bên giếng."), true),
        choice("Nhờ Ông Tư mang nốt", () => settle({ xoiDelivery: null, xoiDelivered: "npc" }, "Ông Tư mang tiếp phần xôi đến các nhà.")), leave(),
      ]);
    }
    sheet("Nhà cuối xóm", ["Đứa nhỏ chạy ra đón. Từ sau cửa có người gọi nó vào lấy đĩa."], [
      choice("Đưa phần xôi còn lại", () => settle({ xoiDelivery: null, xoiDelivered: "pc" }, "Đã đi cùng Ông Tư mang xôi đến các nhà."), true),
      choice("Nhờ Ông Tư mang nốt", () => settle({ xoiDelivery: null, xoiDelivered: "npc" }, "Ông Tư mang tiếp phần xôi đến các nhà.")), leave(),
    ]);
  }
  function xoiAfter() {
    const s = q();
    const line = s.xoiWrapped ? "“Cảm ơn đã phụ ông Tư. Gói mở ra còn thơm mùi lá.”" : "“Ông Tư đi từ sớm. Xôi đã tới mấy nhà bên kia ngõ.”";
    sheet("Gói lá chuối rỗng", ["Một người gánh hàng gấp tấm lá chuối lại.", line], [
      choice("Chào rồi đi", () => settle({ sawXoi: true }, "Đã nghe người làng nhắc những gói xôi của Ông Tư."), true), leave(),
    ]);
  }
  function closeDebt() {
    sheet("Hiên nhà ông Tư", ["“Hồi nhỏ nhà tôi đói. Có người bán xôi cho tôi ăn chịu, ba lần.”", "“Tôi chưa kịp trả. Cũng chưa kịp nói cảm ơn.”"], [
      choice("Ngồi lại với ông một lát", () => {
        record({ debtClosed: true, xoiInvite: true }, "Ông Tư đã kể chuyện ba bát xôi và mời mai ghé.");
        sheet("Hiên nhà ông Tư", ["Ông nhìn ra ngõ. “Mai ghé. Tôi còn ít nếp.”"]);
      }, true),
      choice("Hỏi ông người bán xôi là ai", () => {
        record({ debtClosed: true }, "Ông Tư đã kể vì sao ông nhớ ba bát xôi.");
        sheet("Hiên nhà ông Tư", ["“Để bữa khác. Nói một lần chừng này là nhiều rồi.”"]);
      }), leave(),
    ]);
  }

  function rumours() {
    sheet("Chuyện trên đường làng", ["“Chiều qua, tôi thấy một đốm sáng sau tảng đá lớn. Đến gần chỉ nghe gió.”"], [
      choice("Hỏi đường tới tảng đá", () => {
        record({ caveHeard: true }, "Đã nghe kể về đốm sáng sau tảng đá lớn.");
        window.Discover?.hear("hang");
        sheet("Chuyện trên đường làng", ["“Men lối lên từ nghĩa địa rồi nhìn sang phía đông. Tảng đá phủ rêu, dễ nhận.”"], [
          choice("Xem đường tới tảng đá", () => { close(); K.api().goTo(K.P().hang.x, K.P().hang.y + 12); }, true), leave(),
        ]);
      }, true), leave(),
    ]);
  }
  function pagodaRumour() {
    sheet("Chuyện Tháp Cổ", ["“Đêm nào trên tháp cũng có mây. Người ta bảo có hoa trời thì trong mây mới lộ lối.”"], [
      choice("Hỏi lối lên đồi tháp", () => {
        record({ stupaHeard: true }, "Đã nghe chuyện hoa trời soi lối ở Tháp Cổ.");
        window.Discover?.hear("thien_cung");
        sheet("Chuyện Tháp Cổ", ["“Theo đường lên đồi. Tới chỗ thấy ngọn tháp phủ rêu là phải.”"], [
          choice("Xem đường lên tháp", () => { close(); K.api().goTo(K.P().thap.x, K.P().thap.y + 12); }, true), leave(),
        ]);
      }, true), leave(),
    ]);
  }
  function quietPage() {
    sheet("Một trang kinh còn mở", ["Sư già chỉ chỗ đánh dấu trên trang sách. “Nếu ngồi mà cứ buồn ngủ, con có thể đứng dậy và đi vài bước.”"], [
      choice("Đọc đoạn nói về những điều cản trở khi ngồi", () => {
        record({ hindrancesRead: true }, "Đã đọc một đoạn về năm triền cái ở tịnh thất.");
        sheet("Năm triền cái", ["Tóm ý trong game: ham muốn, bực bội, uể oải và buồn ngủ, bồn chồn và hối tiếc, cùng nghi ngờ có thể cản trở khi ngồi yên.", "Nguồn tham chiếu: Tăng Chi Bộ 5.51."]);
      }, true), leave(),
    ]);
  }

  const node = (id, place, title, show, x = 0, y = 0) => ({ id, place, title, show, x, y });
  const isDay = (phase) => ["Sáng tinh mơ", "Buổi sáng", "Giữa ngày", "Xế chiều", "Rạng sáng", "Sáng sớm", "Sáng", "Trưa", "Chiều"].includes(phase);
  // At any one location only the nearest eligible interaction is offered.
  function scenes() {
    const api = K.api();
    if (!api?.villagerArrival?.()) return [];
    const day = api.storyDay(), phase = api.phase(), daytime = isDay(phase);
    if (!phase) return [];
    const s = q(), nodes = [];
    const add = (...args) => nodes.push(node(...args));
    const evening = !daytime;
    const hasOldHerbErrand = ["well", "herb", "deliver"].includes(K.S.quest.step);

    if (day === 1 && daytime && !api.afterNight?.()) add("gao_morning", "gao", "Ngước nhìn tán gạo", morningTree);
    if (day >= 2 && day <= 5 && daytime && !s.naMorning) add("na_morning", "village", "Chào chị Ba", visitNa, -26, -37);
    if (day >= 3) {
      if (!hasOldHerbErrand && !elderHelped()) {
        if (s.herbs === "accepted") add("pick_herbs", "mit", "Hái rau má dưới gốc mít", pickHerbs);
        else add("granny_herbs", "well", s.herbs === "picked" ? "Mang rau về cho bà cụ" : "Hỏi bà cụ về nồi canh", grannyHerbs, -12, 25);
      }
      if (!s.sawDipper) add("dipper", "well", "Xem chiếc gáo", dipper, 20, -23);
      if (!s.caveHeard && !K.S.q.cave?.found && !K.S.disc?.heard?.hang) add("cave_rumour", "gate", "Hỏi chuyện tảng đá lớn", rumours, 24, 12);
    }
    if (day >= 4) {
      if (evening && (s.dog !== "calm") && s.dogDay !== day) add("dog", "village", "Làm quen con Vàng", dog, 34, -46);
      if ((evening && !lampState(day)) || (daytime && lampState(day) && !s.sawLamp)) add("lamp", "village", "Xem ngọn đèn ở khúc quanh", lamp, -38, -52);
    }
    if (day >= 5) {
      if (daytime && !s.sellerHeard) add("seller", "well", "Hỏi bà cụ về người bán xôi", foodSeller, -39, -14);
      if (evening && !s.debtHeard) add("debt", "village", "Ghé hiên ông Tư", hearDebt, 55, 15);
      if (!s.stupaHeard && !K.S.q.palace?.visits && !K.S.disc?.heard?.thien_cung) add("stupa_rumour", "hermitage", "Hỏi chuyện Tháp Cổ", pagodaRumour, 74, 25);
    }
    if (day === 6) {
      if (daytime && !s.xoiPromised) add("xoi_prep", "village", "Xem lá chuối ngoài hiên", xoiPrep, 48, 10);
      if (evening && !xoiState(day) && !s.xoiDelivery) add("xoi", "village", "Ghé phụ gói xôi", xoiReady, 47, -17);
    }
    if (s.xoiDelivery === 1) add("xoi_house1", "well", "Gửi xôi ở nhà bên giếng", deliverXoi, 36, -60);
    if (s.xoiDelivery === 2) add("xoi_house2", "village", "Gửi xôi ở nhà cuối xóm", deliverXoi, -38, 56);
    if (day >= 6 && !s.naDrawing) add("na_drawing", "village", "Xem tranh của Na", visitNa, -26, -37);
    if (day >= 7) {
      if (daytime && !s.sawXoi && xoiState(day)) add("xoi_after", "village", "Hỏi chuyện những gói xôi", xoiAfter, 64, -18);
      if (evening && s.debtHeard && !s.debtClosed && s.debtDay !== day) add("debt_end", "village", "Ngồi cùng ông Tư", closeDebt, 55, 15);
      if (day >= 8 && daytime && s.xoiInvite && !s.xoiVisited) {
        add("xoi_visit", "village", "Ghé hiên theo lời mời", () => sheet("Hiên nhà ông Tư", [
          "Một chén xôi nhỏ để sẵn bên bậc thềm.", "“Ngồi đi. Ăn lúc còn ấm.”",
        ], [choice("Ngồi ăn cùng ông", () => settle({ xoiVisited: true }, "Đã ghé hiên ăn xôi theo lời mời của Ông Tư."), true), leave()]), 55, 15);
      }
      if (K.S.sitInterrupted && !s.hindrancesRead) add("quiet_page", "hermitage", "Hỏi sư về buổi ngồi", quietPage, -25, 13);
      if (!s.gaoEvening && (phase === "Chiều" || phase === "Xế chiều" || phase === "Chiều tàn")) {
        add("gao_evening", "gao", "Ngắm bóng gốc gạo", () => sheet("Gốc gạo", ["Bóng lá phủ qua lối đất. Nắng chỉ còn trên ngọn."], [
          choice("Ngồi dưới bóng cây một lát", () => settle({ gaoEvening: true }, "Đã ngắm bóng gốc gạo lúc chiều."), true), leave(),
        ]));
      }
      if (api.darkness() >= 0.5 && !s.gaoNight) add("gao_night", "gao", "Xem đom đóm ở gốc gạo", () => sheet("Gốc gạo",
        ["Đom đóm thấp thoáng giữa các rễ cây. Lá rơi rất khẽ."], [
          choice("Ngồi dưới gốc cây một lát", () => settle({ gaoNight: true }, "Đã ngồi dưới gốc gạo trong đêm."), true), leave(),
        ]));
    }
    return nodes;
  }
  function targets() {
    return scenes().flatMap((n) => {
      const p = K.P()[n.place];
      return p ? [{ title: n.title, body: p.name, name: p.name, x: p.x + n.x, y: p.y + n.y }] : [];
    });
  }
  function loop() {
    const player = World.getPlayer();
    let best = null, bestDistance = 30;
    for (const n of scenes()) {
      const p = K.P()[n.place];
      if (!p) continue;
      const distance = Math.hypot(player.x - p.x - n.x, player.y - p.y - n.y);
      if (distance >= bestDistance) continue;
      best = n;
      bestDistance = distance;
    }
    return best ? K.offer("week:" + best.id, best.title, best.show) : false;
  }
  function actors() {
    const api = K.api();
    if (!api?.villagerArrival?.() || !lampState(api.storyDay())) return [];
    const p = K.P().village;
    return [{ kind: "weekLantern", hook: q().lampHook, x: p.x - 26, y: p.y - 57 }];
  }
  Mind.register({ actors, targets, loop });
  return { opening, ending };
})();
