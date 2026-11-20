// Story data for one night at the cemetery.
// Each role has a meter (0–10). Text lines and choices may depend on "flags":
// kinds of traces left by other players tonight, or live moments heard this session.
//   line: string | { if: flag, text } | { unless: flag, text }
//   choice: { label, delta, next, trace?: {kind, variant}, emit?: topic, if?, unless? }

window.TRACE_TEXT = {
  offering: [
    "đặt nửa vắt cơm lên một ngôi mộ không tên",
  ],
  chant: [
    "tụng kinh Từ (Mettā) bằng tiếng Pāli, hồi hướng cho những người nằm đây",
    "rải tâm từ cho người đã xua đuổi mình sáng qua",
  ],
  sigh: [
    "thở dài giữa các ngôi mộ",
  ],
  incense: [
    "thắp một nén nhang ở ngôi mộ không tên",
  ],
  alms: [
    "mang cơm ra cổng nghĩa địa lúc gà gáy",
  ],
  release: [
    "nhẹ đi khi sương tan, và không còn ở lại",
  ],
  vigil: [
    "ngồi trọn đêm, không nằm xuống",
  ],
  keepsake: [
    "để một món đồ cũ ra chỗ có thể thấy",
  ],
  lamp: [
    "đặt một ngọn đèn nhỏ ở chân bụi tre",
  ],
  bowl: [
    "để lại một bát nước và nắm cơm bên đường mòn",
  ],
};

window.ROLE_INFO = {
  monk: {
    name: "Nhà sư",
    // A way of playing, not a person: Sư Tịnh, Ông Tư and Bà Sáu are NPCs the player meets (docs/player-character-narrative-model.md).
    tagline: "Tu tập, khất thực, kinh hành",
    meter: "Tâm an",
    blurb: "Một vị sư đến ở nghĩa địa đầu làng. Ngồi yên, đi kinh hành, gặp dân làng và những người đã tu lâu.",
    gesture: { topic: "chime", label: "Rung chuông nhỏ" },
  },
  ghost: {
    name: "Hồn ma",
    tagline: "Lặng lẽ quan sát, thì thầm",
    meter: "Chấp",
    blurb: "Một bóng người còn ở lại chỗ đất này. Nghe chuyện cõi khuất, nghịch một chút, lần theo điều mình còn nhớ.",
    gesture: { topic: "sigh", label: "Thở dài" },
  },
  villager: {
    name: "Người dân",
    tagline: "Sống, giúp người, giữ lời",
    meter: "Lòng tin",
    blurb: "Một người trong làng. Làm việc nhỏ, giúp người, giữ lời hứa và tò mò về những điều lạ ngoài nghĩa địa.",
    gesture: { topic: "lantern", label: "Giơ đèn lồng" },
  },
};

window.STORY = {
  monk: {
    start: "a0",
    meterStart: 5,
    scenes: {
      a0: {
        time: "Sáng sớm",
        place: "village",
        lines: [
          "Trời chưa sáng hẳn, sương còn đọng trên mái ngói. Thầy ôm bát ra ngõ, chân đất, mắt nhìn xuống. Khất thực là không xin, không nói, chỉ đứng yên trước cửa. Ai cho thì nhận, ai không cho thì đi tiếp.",
          "Ngõ có bảy nhà. Cái bụng thầy đi trước thầy nửa bước.",
        ],
        choices: [
          { unlessv: "v_h1", label: "Dừng trước nhà có tiếng trẻ con", delta: 0, next: "a1", set: "v_h1" },
          { unlessv: "v_h2", label: "Dừng trước nhà có con chó vàng ngồi chình ình ở cổng", delta: 0, next: "a2", set: "v_h2" },
          { label: "Đi tới nhà cuối ngõ, nhà thứ bảy", delta: 0, next: "a3" },
        ],
      },
      a1: {
        time: "Sáng sớm",
        place: "village",
        lines: [
          "Một đứa bé chạy ra, tay nắm chặt cục xôi to hơn cả bàn tay nó. Nó đặt vào bát bằng hai tay, nghiêm trang như đang làm đại lễ.",
          "Trong nhà, tiếng mẹ nó vọng ra: “Đừng có làm rơi! Đó là phần ăn sáng của con đó!”",
          "Đứa bé nhìn cục xôi, nhìn thầy, rồi nhìn lại cục xôi. Thầy cố nhịn cười.",
        ],
        choices: [
          { label: "Cúi đầu cảm ơn, đi tiếp", delta: 1, next: "a0" },
        ],
      },
      a2: {
        time: "Sáng sớm",
        place: "village",
        lines: [
          "Con chó vàng ngồi chặn đúng giữa cổng, nhìn thầy, nhìn bát, rồi nhìn thầy lần nữa. Nó có vẻ nghĩ đây là một cuộc thương lượng.",
          "Chủ nhà không thấy đâu. Thầy đứng yên ba phút. Con chó cũng đứng yên ba phút. Không ai nhường ai.",
        ],
        choices: [
          { label: "Mỉm cười, đi tiếp. Thầy không có gì để thương lượng", delta: 1, next: "a0" },
          { label: "Đứng thêm một lát, xem ai thắng", delta: 0, next: "a0" },
        ],
      },
      a3: {
        time: "Sáng sớm",
        place: "village",
        lines: [
          { ifv: "v_alms", text: "Nhà thứ bảy. Người đàn ông vẫn đứng ngoài ngõ, nhưng hôm nay ông không chặn. Ông nhìn cái bát rất lâu rồi quay vào nhà. Chưa phải là cho, nhưng cũng chưa phải là đuổi." },
          { unlessv: "v_alms", text: "Nhà thứ bảy. Một người đàn ông đứng chắn ngõ, tay chống nạnh: “Đi chỗ khác. Thời này sư giả nhiều lắm.”" },
          "Thầy không cãi, không giải thích. Thầy cúi đầu, quay đi.",
        ],
        choices: [
          { label: "Đi tiếp. Bát nhẹ, nhưng bước chân không nặng", delta: 1, next: "m1" },
          { label: "Đi tiếp, nhưng câu nói ấy đi theo", delta: -1, next: "m1" },
        ],
      },
      m1: {
        time: "Chiều tàn",
        place: "gate",
        lines: [
          "Cả ngày thầy đi, trong bát chỉ còn nửa vắt cơm nguội.",
          "Mặt trời xuống sau rặng tre. Câu nói ở nhà thứ bảy vẫn còn đâu đó trong ngực.",
        ],
        choices: [
          { label: "Nghĩ lại câu nói ấy, thấy nóng mặt", delta: -1, next: "m2" },
          { label: "Ghi nhận nó, rồi đặt xuống như đặt bát", delta: 1, next: "m2" },
        ],
      },
      m2: {
        time: "Chạng vạng",
        place: "gate",
        lines: [
          "Cổng nghĩa địa không có cánh. Mộ đất lẫn mộ vôi tróc lở, nhang tàn cắm xiêu vẹo.",
          "Thầy tự nhủ: không sợ. Cái bụng thầy nghe vậy, bèn kêu một tiếng dài, như phản đối.",
          "Xa xa có tiếng chó sủa, rồi im.",
          { if: "lantern", text: "Sau bụi tre, có một đốm đèn lồng vừa lay động rồi tắt. Có ai đó đang ở gần đây." },
        ],
        choices: [
          { label: "Đi chậm vào, mắt nhìn xuống đất", delta: 0, next: "m3" },
          { label: "Đi sâu vào giữa những ngôi mộ không ai thăm", delta: 1, next: "m3" },
        ],
      },
      m3: {
        time: "Đầu hôm",
        place: "graves",
        lines: [
          "Trước khi ngồi, thầy mở bát. Nửa vắt cơm đã khô cứng.",
          "Bên cạnh có một ngôi mộ thấp, không bia, cỏ mọc kín.",
          { if: "keepsake", text: "Sát mộ có chiếc nón lá cũ, mới lúc nãy chưa thấy. Ai đó vừa để nó ra chỗ này." },
          { if: "lamp", text: "Phía bụi tre có ngọn đèn nhỏ ai vừa đặt, ánh sáng ấm đủ để thấy đường." },
        ],
        choices: [
          { label: "Đặt cơm lên ngôi mộ không tên, khấn thí thực", delta: 1, next: "m4", trace: { kind: "offering", variant: 0 }, remember: "m_offered" },
          { label: "Giữ lại cho sáng mai", delta: 0, next: "m4" },
        ],
      },
      m4: {
        time: "Canh hai",
        place: "graves", pose: "sit",
        lines: [
          "Lá khô xào xạc phía sau lưng, đều đều như bước chân. Thầy đã định bụng là gió. Gió thì đâu có đi theo nhịp.",
          { if: "sigh", text: "Rồi có tiếng thở dài, rất gần. Không phải gió. Đêm nay thầy không ngồi một mình." },
          { unless: "sigh", text: "Thầy nín thở nghe. Chỉ có tiếng dế." },
          "Tim đập nhanh. Sợ là thật.",
        ],
        choices: [
          { label: "Mở mắt quay lại nhìn", delta: -1, next: "m5" },
          { label: "Biết mình đang sợ, để nỗi sợ ở đó, theo dõi hơi thở", delta: 2, next: "m5" },
          { label: "Rung chuông nhỏ một tiếng", delta: 1, next: "m5", emit: "chime" },
          { needLow: true, detour: "hermitage", label: "Lòng chưa vững. Nhớ lời trong kinh, đi về tịnh thất đọc vài trang rồi quay lại ngồi tiếp" },
        ],
      },
      m5: {
        time: "Canh ba",
        place: "graves", pose: "sit",
        lines: [
          "Cơn buồn ngủ kéo đến như nước lên. Đầu gục xuống một lần, hai lần. Lần thứ ba, trán suýt chạm đất, thầy giật mình, nhìn quanh xem có ai thấy không. May là chỉ có người chết.",
          "Hạnh ngồi không nằm. Đất ẩm và mát. Nằm xuống một chút thôi cũng chẳng ai biết.",
          { if: "bowl", text: "Cạnh lối mòn có nồi nước ai để sẵn, chạm vào còn mát. Thầy cúi đầu cảm ơn người chưa gặp." },
        ],
        choices: [
          { label: "Nằm xuống một chút", delta: -2, next: "m6" },
          { label: "Đứng dậy đi kinh hành quanh các ngôi mộ", delta: 1, next: "m6" },
          { needLow: true, detour: "hermitage", label: "Biết mình đang thiếu vững tin. Đi về tịnh thất đọc kinh, rồi quay lại ngồi tiếp" },
          { label: "Ngồi thẳng lưng, theo dõi hơi thở, ghi nhận từng ý nghĩ đi qua", delta: 0, next: "m5w" },
        ],
      },
      m5w: {
        time: "Canh ba",
        place: "graves", pose: "sit",
        watch: {
          seconds: 36,
          intro: "Thầy ngồi thẳng. Hơi vào, hơi ra. Ý nghĩ nào trôi tới thì chạm vào nó, gọi tên nó, rồi quay về hơi thở.",
          thoughts: [
            { kind: "nghĩ", text: "Mai ăn gì nhỉ? Mà mai thầy có gì để ăn đâu." },
            { kind: "nghĩ", text: "Câu nói sáng nay… lẽ ra thầy nên đáp lại thế này." },
            { kind: "muốn", text: "Một ly trà nóng. Chỉ một ly thôi." },
            { kind: "muốn", text: "Giá mà trời sáng sớm hơn một chút." },
            { kind: "đau", text: "Chân trái tê rồi. Chân phải cũng bắt đầu tê theo." },
            { kind: "đau", text: "Một con muỗi đang đậu ngay trên mũi thầy." },
            { kind: "nghe", text: "Có tiếng sột soạt sau lưng. Có thật không?" },
            { kind: "nghe", text: "Tiếng dế. Tiếng gió. Hình như có cả tiếng thở." },
          ],
          results: [
            { min: 0, text: "Tâm thầy đi chơi hơi nhiều, đi rồi mới sực nhớ là mình đang ngồi. Sực nhớ ra, thầy cười thầm. Sực nhớ ra cũng là một lần quay về." },
            { min: 3, text: "Có những ý nghĩ trôi qua, thầy chạm vào, gọi tên, rồi thả. Muỗi thì vẫn ở trên mũi, nhưng thầy đã bớt giận nó." },
            { min: 6, text: "Ý nghĩ đến rồi đi như người qua cổng. Thầy không đuổi, không mời, chỉ đứng yên làm cái cổng." },
          ],
          delta: [0, 1, 2],
          next: "m6",
        },
      },
      m6: {
        time: "Canh tư",
        place: "graves", pose: "sit",
        lines: [
          "Sương xuống. Trời chưa sáng nhưng đã bớt đen.",
          { if: "incense", text: "Có mùi nhang mới thoang thoảng từ đâu đó. Đêm nay đã có người thắp nhang ở đây." },
          "Thầy chắp tay. Còn lại một việc trước khi trời sáng.",
        ],
        choices: [
          { label: "Tụng kinh Từ (Mettā), hồi hướng cho những người nằm đây", delta: 1, next: "end", trace: { kind: "chant", variant: 0 } },
          { label: "Rải tâm từ cho người đàn ông đã xua đuổi mình", delta: 2, next: "end", trace: { kind: "chant", variant: 1 } },
        ],
      },
      end: {
        time: "Rạng sáng",
        place: "graves", pose: "sit",
        end: true,
        endings: [
          { max: 3, text: "Trời sáng. Thầy đứng dậy, chân tê, lòng còn nặng. Đêm nay tâm đã chạy theo tiếng lá, theo cơn buồn ngủ, theo câu nói sáng qua. Không sao cả. Hạnh đầu đà là để thấy mình, không phải để thắng. Đêm mai lại ngồi." },
          { max: 7, text: "Gà gáy ở xóm dưới. Có lúc thầy sợ, có lúc thầy mệt, nhưng lần nào cũng quay về được với hơi thở. Thầy đắp lại y, cầm bát, đi về phía làng. Hôm nay sẽ đi lại con đường cũ, qua cả nhà thứ bảy." },
          { max: 10, text: "Ánh sáng đầu tiên chạm vào những tấm bia vôi. Đêm qua có sợ, có buồn ngủ, có giận, và thầy thấy rõ từng thứ khi nó đến và khi nó đi. Nghĩa địa không còn là nơi đáng sợ, chỉ là một chỗ đất có nhiều người đã nằm xuống. Thầy cúi đầu chào họ rồi đi.", trace: { kind: "vigil", variant: 0 } },
        ],
      },
    },
  },

  ghost: {
    start: "g1",
    meterStart: 7,
    scenes: {
      g1: {
        time: "Chiều tàn",
        place: "gao",
        lines: [
          "Bà đứng ở chỗ đất này đã lâu lắm, lâu đến mức không còn đếm ngày.",
          "Người ta đi ngang mà không nhìn. Có ai đó cắm nhang ở mộ bên cạnh, mộ của bà thì không.",
          "Bà nhớ mẹt xôi, nhớ cái nón, nhớ con bé Hạnh đứng chờ ở cửa.",
          { ifv: "m_offered", text: "Trên mộ bên cạnh còn vệt cơm khô của đêm trước. Bà nhìn nó rất lâu." },
        ],
        choices: [
          { label: "Gọi tên con gái", delta: 1, next: "g2" },
          { label: "Ngồi xuống bên ngôi mộ thấp không bia", delta: 0, next: "g2" },
        ],
      },
      g2: {
        time: "Chạng vạng",
        place: "gao",
        lines: [
          "Một người áo nâu sồng bước vào, chân đất, tay ôm bát. Ông ta không cắm nhang, không khấn, cứ thế ngồi xuống giữa các ngôi mộ.",
          { if: "chime", text: "Một tiếng chuông nhỏ vang lên. Đã lâu lắm rồi không ai rung chuông ở đây." },
          { if: "lamp", text: "Chân bụi tre có ngọn đèn nhỏ ai vừa đặt. Ánh sáng ấm, bà không dám lại gần." },
          "Bà thấy khó chịu. Đây là chỗ của bà.",
        ],
        choices: [
          { label: "Làm lá khô xào xạc sau lưng ông ta", delta: 1, next: "g3", emit: "sigh", trace: { kind: "sigh", variant: 0 } },
          { label: "Đứng xa mà nhìn", delta: 0, next: "g3" },
        ],
      },
      g3: {
        time: "Canh hai",
        place: "graves",
        lines: [
          "Cái đói kéo đến, cái đói không có đáy, không phải của bụng.",
          { if: "offering", text: "Trên ngôi mộ thấp không bia có nửa vắt cơm. Ai đó vừa đặt xuống đêm nay. Bà nhận ra đó là mộ của mình." },
          { unless: "offering", text: "Trên các ngôi mộ chỉ có trái cây đã thâm, cúng cho người khác." },
        ],
        choices: [
          { if: "offering", label: "Lại gần vắt cơm. Có người vẫn nhớ tới bà", delta: -2, next: "g4" },
          { unless: "offering", label: "Lục tìm đĩa trái cây trên mộ người khác", delta: 1, next: "g4" },
          { label: "Chịu đói, đứng yên", delta: 0, next: "g4" },
        ],
      },
      g4: {
        time: "Canh ba",
        place: "graves",
        lines: [
          "Có một ký ức trồi lên: năm nước lớn, bà gánh xôi đi chợ sớm, nước ngập tới gối rồi tới ngực.",
          "Con bé Hạnh đứng ở cửa đợi. Bà không về.",
          { if: "lantern", text: "Phía bụi tre có ánh đèn lồng. Bà tưởng con gái mình, chạy lại, nhưng đó là một người đàn ông lạ đang run." },
        ],
        choices: [
          { label: "Muốn quay về căn nhà ấy, bằng mọi giá", delta: 1, next: "g5" },
          { label: "Lần đầu tiên tự hỏi: mình đã đi rồi sao?", delta: -2, next: "g5" },
        ],
      },
      g5: {
        time: "Canh tư",
        place: "graves",
        lines: [
          { if: "chant", text: "Từ chỗ người áo nâu ngồi, có tiếng tụng rất khẽ. Không ai tụng cho bà từ lâu lắm rồi. Mỗi câu như một bàn tay đặt lên vai." },
          { unless: "chant", text: "Đêm im lặng. Bà chờ, mà không biết mình đang chờ gì." },
        ],
        choices: [
          { if: "chant", label: "Lại gần, ngồi xuống nghe hết bài kinh", delta: -3, next: "end" },
          { if: "chant", label: "Bịt tai, quay đi", delta: 1, next: "end" },
          { unless: "chant", label: "Chờ tiếp", delta: 1, next: "end" },
          { unless: "chant", label: "Thì thầm với con gái: “Mẹ xin lỗi, mẹ không về được”", delta: -2, next: "end" },
        ],
      },
      end: {
        time: "Rạng sáng",
        place: "graves",
        end: true,
        endings: [
          { max: 3, text: "Sương tan. Bà thấy mình nhẹ đi, như mẹt xôi đã bán hết. Căn nhà, con bé, cơn nước lớn vẫn còn đó nhưng không còn kéo bà lại. Lần đầu tiên sau rất lâu, bà không đứng chờ nữa.", trace: { kind: "release", variant: 0 } },
          { max: 7, text: "Trời sáng. Bà vẫn còn ở đây, nhưng đêm qua có một lúc bà đã quên đứng chờ. Có lẽ đêm mai sẽ dễ hơn." },
          { max: 10, text: "Mặt trời lên. Bà lùi vào bóng cây gạo, vẫn nhìn về phía con đường. Một đêm nữa đã qua, và bà còn ở lại." },
        ],
      },
    },
  },

  villager: {
    start: "v1",
    meterStart: 4,
    scenes: {
      v1: {
        time: "Chiều tàn",
        place: "gate",
        lines: [
          "Sáng nay ông Tư đứng chắn ngõ, đuổi một ông sư đi. Thời buổi này sư giả nhiều, ông nói vậy với vợ.",
          "Chiều ra đồng về, ông thấy ông sư ấy đi một mình về phía nghĩa địa, chứ không phải phía chùa.",
        ],
        choices: [
          { label: "“Chắc chắn có trò gì.” Theo xem cho biết", delta: -1, next: "v2" },
          { label: "Thấy áy náy, lặng lẽ đi theo", delta: 1, next: "v2" },
        ],
      },
      v2: {
        time: "Chạng vạng",
        place: "bamboo",
        lines: [
          "Ông nấp sau bụi tre ở bờ rào nghĩa địa. Muỗi nhiều, đất lạnh.",
          "Ông sư ngồi xuống giữa các ngôi mộ, không đèn, không nhang, không ai.",
          { if: "chime", text: "Có tiếng chuông nhỏ. Ông Tư giật mình đến suýt làm rơi đèn." },
        ],
        choices: [
          { label: "Giơ đèn lồng lên cho rõ", delta: 0, next: "v3", emit: "lantern" },
          { label: "Tắt đèn, ngồi im trong bóng tối", delta: 1, next: "v3" },
        ],
      },
      v3: {
        time: "Canh hai",
        place: "bamboo",
        lines: [
          { if: "sigh", text: "Có một vệt sáng mờ trôi giữa các ngôi mộ, nhạt như hơi sương. Rồi tiếng thở dài. Ông dụi mắt mấy lần." },
          { unless: "sigh", text: "Gió lùa qua bụi tre nghe như ai đang gọi tên. Ông tự nhủ là gió." },
          "Ông sư vẫn ngồi yên.",
        ],
        choices: [
          { label: "Lắp bắp niệm Phật", delta: 1, next: "v4" },
          { label: "Chạy một mạch ra tới cổng, rồi dừng lại", delta: 0, next: "v4" },
          { label: "“Toàn chuyện bịa. Ông ta đang diễn.”", delta: -1, next: "v4" },
        ],
      },
      v4: {
        time: "Canh ba",
        place: "graves",
        lines: [
          { if: "offering", text: "Ông thấy nửa vắt cơm đặt trên ngôi mộ thấp không bia. Đó là mộ bà Sáu bán xôi, chết năm nước lớn. Hồi nhỏ ông hay ăn chịu xôi của bà, chưa trả hết." },
          { unless: "offering", text: "Ông sư không ăn gì cả. Từ trưa tới giờ ông ta chưa ăn." },
          { if: "keepsake", text: "Cạnh mộ có chiếc nón lá cũ. Ông thấy quen quen, mà không nhớ đã thấy ở đâu." },
          "Ông Tư đã bò lại gần hơn từ lúc nào, giờ ngồi ôm gối sau một ngôi mộ. Không hiểu sao chân không đi về được.",
        ],
        choices: [
          { label: "Nghĩ: người này là thật", delta: 2, next: "v5" },
          { label: "Nghĩ: chắc sáng mai ông ta sẽ xin tiền", delta: -1, next: "v5" },
        ],
      },
      v5: {
        time: "Gà gáy",
        place: "gate",
        lines: [
          { if: "chant", text: "Trước khi trời sáng, ông nghe tiếng tụng kinh rất khẽ. Ông không hiểu chữ nào, nhưng thấy cổ họng nghẹn lại." },
          "Gà gáy ở xóm. Ông sư đứng dậy.",
        ],
        choices: [
          { label: "Về nhà nấu cơm, mang ra cổng đặt vào bát ông sư", delta: 2, next: "end", trace: { kind: "alms", variant: 0 }, remember: "v_alms" },
          { label: "Thắp một nén nhang ở ngôi mộ không tên", delta: 1, next: "end", trace: { kind: "incense", variant: 0 } },
          { label: "Về ngủ, không kể với ai", delta: -1, next: "end" },
        ],
      },
      end: {
        time: "Rạng sáng",
        place: "gate",
        end: true,
        endings: [
          { max: 3, text: "Ông Tư về ngủ một giấc dài. Chuyện đêm qua ông cho là do mệt. Nhưng sáng hôm sau, khi ông sư đi ngang ngõ, ông không đứng chắn nữa." },
          { max: 7, text: "Ông Tư kể cho vợ nghe, kể lộn xộn, chỗ nhớ chỗ quên. Vợ ông cười. Ông không cãi. Đêm đó ông nằm nghĩ mãi về ngôi mộ không tên." },
          { max: 10, text: "Sáng hôm ấy cả xóm thấy ông Tư, người khó tính nhất làng, đứng ở cổng nghĩa địa với một nồi cơm còn nóng. Ông không nói gì nhiều, chỉ cúi đầu khi đặt cơm vào bát." },
        ],
      },
    },
  },
};

window.TRUE_ENDING = [
  "Bạn đã đi qua đêm này ba lần, bằng ba đôi mắt.",
  "Tiếng lá mà thầy Tịnh tưởng là bước chân, là bà Sáu đang làm ồn vì sợ mất chỗ. Vệt sáng mà ông Tư thấy, là bà đi ngang. Nửa vắt cơm trên ngôi mộ không tên là của bà, và món nợ xôi là của ông.",
  "Một đêm, ba người, không ai thấy hết.",
  "Linh tại ngã, bất linh tại ngã.",
];


// Things lying around the graveyard. role: who sees it ("any" = everyone). Tapping one walks
// the player there and opens a short card. A step may reveal a clue (kept across nights),
// and a choice may change the meter, leave a trace for others, or go to another step.
window.FINDS = [
  // ---- monk ----
  { id: "fm_unnamed", role: "monk", x: 262, y: 1042, start: "s0", steps: { s0: {
    lines: ["Ngôi mộ thấp không bia, cỏ mọc kín. Không ai nhớ tên người nằm đây, nhưng đất ở đây vẫn ẩm và mềm như mọi nơi."],
    choices: [
      { label: "Thắp một nén nhang, khấn thí thực", delta: 1, trace: { kind: "incense", variant: 0 } },
      { label: "Đứng lặng một lát rồi đi", delta: 0 },
    ] } } },
  { id: "fm_bowl", role: "monk", x: 118, y: 955, start: "s0", steps: { s0: {
    clue: "c_bat",
    lines: ["Một cái bát sứ sứt miệng nằm nghiêng trong cỏ. Đáy bát có khắc nét chữ run run: “Sáu, cho Hạnh”."],
    choices: [
      { label: "Lau sạch, đặt ngay ngắn bên mộ", delta: 1 },
      { label: "Để nguyên chỗ cũ", delta: 0 },
    ] } } },
  { id: "fm_incense", role: "monk", x: 292, y: 828, start: "s0", steps: { s0: {
    lines: ["Một bó nhang đã cháy hết cắm trước bia vôi, tro còn nguyên hình từng nén. Hôm nay là ngày giỗ của ai đó, và người ấy đã đến rồi đi."],
    choices: [
      { label: "Tụng một đoạn kinh Từ cho người nằm đây", delta: 1, trace: { kind: "chant", variant: 0 } },
      { label: "Chắp tay rồi đi", delta: 0 },
    ] } } },

  // ---- ghost ----
  { id: "fg_hat", role: "ghost", x: 150, y: 692, start: "s0", steps: {
    s0: {
      clue: "c_non",
      lines: ["Chiếc nón lá mục nằm dưới gốc gạo. Quai nón buộc bằng một nút thắt lạ, đúng kiểu bà vẫn thắt cho con gái."],
      choices: [
        { label: "Đội nón lên, như ngày xưa", delta: 1, next: "s1" },
        { label: "Lặng lẽ đặt nón ra chỗ có thể thấy", delta: 0, trace: { kind: "keepsake", variant: 0 } },
      ] },
    s1: {
      lines: ["Trong lòng nón có thêu một chữ H bằng chỉ đỏ đã phai. Bà nhớ là bà thêu, và nhớ là bà thêu cho ai."],
      choices: [
        { label: "Gỡ nón ra, ôm vào lòng", delta: 1, trace: { kind: "keepsake", variant: 0 } },
      ] } } },
  { id: "fg_sandal", role: "ghost", minRuns: 1, x: 272, y: 1236, start: "s0", steps: {
    s0: {
      clue: "c_dep",
      lines: ["Một chiếc dép nhỏ, mòn gót. Chiếc kia không biết ở đâu."],
      choices: [
        { label: "Tìm chiếc còn lại", delta: 1, next: "s1" },
        { label: "Đặt dép lên mộ, rồi đứng yên", delta: -1 },
      ] },
    s1: {
      lines: ["Không có. Nhưng bà nhớ: con bé đi một chiếc dép vào ngày nước lớn, chạy theo bà đến tận cửa. Chắc có ai đó đã nhặt chiếc kia về."],
      choices: [{ label: "Đặt chiếc này lại chỗ cũ", delta: -1 }] } } },
  { id: "fg_tray", role: "ghost", x: 132, y: 1122, start: "s0", steps: { s0: {
    lines: ["Cái mẹt tre mục, nan gãy. Bà nhớ mùi xôi gấc đỏ, nhớ nắng sớm trên mẹt, nhớ tiếng người mua xôi mặc cả mà vẫn cười."],
    choices: [
      { label: "Hít thật sâu mùi ngày cũ", delta: 1 },
      { label: "Quay đi, đừng nhớ nữa", delta: -1 },
    ] } } },

  // ---- villager ----
  { id: "fv_pot", role: "villager", x: 262, y: 1362, start: "s0", steps: { s0: {
    lines: ["Cái nồi đồng nhỏ bị bỏ quên, đáy còn dính cháy xôi. Ông nhận ra nồi của bà Sáu. Ông còn nợ bà ba bát xôi."],
    choices: [
      { label: "Nhẩm tính: ba bát, giá xôi bây giờ đã khác, chắc phải trả nhiều hơn", delta: 1 },
      { label: "Lẩm bẩm xin lỗi bà", delta: 2 },
      { label: "Múc nước suối đổ đầy nồi, đặt cạnh đường mòn cho người đi qua", delta: 1, trace: { kind: "bowl", variant: 0 } },
    ] } } },
  { id: "fv_scarf", role: "villager", minRuns: 1, x: 96, y: 1558, start: "s0", steps: { s0: {
    clue: "c_vo",
    lines: ["Chiếc khăn mỏ quạ vắt trên rào tre. Ông nhận ra màu khăn: của vợ ông.", "Mỗi năm vào ngày nước lớn, bà nấu một mâm xôi, không nói cho ai, rồi đi mất cả buổi chiều. Ông chưa bao giờ hỏi."],
    choices: [
      { label: "Lần này ông thấy muốn hỏi", delta: 2 },
      { label: "Gỡ khăn, giấu vào áo, giả như chưa thấy", delta: 0 },
    ] } } },
  { id: "fv_lamp", role: "villager", x: 232, y: 1592, start: "s0", steps: { s0: {
    lines: ["Chân bụi tre có một chỗ đất bằng, vừa đủ để đặt đèn."],
    choices: [
      { label: "Đặt ngọn đèn nhỏ lại đó cho người đi ngang", delta: 1, trace: { kind: "lamp", variant: 0 } },
      { label: "Giữ đèn, tắt đi cho đỡ sợ", delta: 0 },
    ] } } },

  // ---- everyone ----
  { id: "f_hermit", role: "any", repeat: true, x: 205, y: 296, start: "s0", steps: {
    s0: {
      lines: ["Một tịnh thất nhỏ trên đồi, mái lá, sân đất quét sạch đến lạ. Cửa khép, một ngọn đèn dầu treo hiên, và tiếng chổi quét rất khẽ từ phía sau."],
      choices: [
        { label: "Gõ cửa nhẹ", delta: 0, next: "s1" },
        { label: "Đứng chắp tay một lát rồi đi", delta: 1 },
      ] },
    s1: {
      lines: ["Từ phía sau vọng ra tiếng một người già, chậm rãi: “Cửa không cài then, con cứ vào. Kệ sách ở bên phải, đèn ở hiên. Đọc xong nhớ để sách về chỗ cũ.”"],
      choices: [
        { label: "Đẩy cửa bước vào", delta: 0, next: "s2" },
        { label: "Cúi đầu, lùi ra", delta: 0 },
      ] },
    s2: { room: "hermit", lines: [], choices: [] } } },
  { id: "f_ruin", role: "any", repeat: true, x: 335, y: 1308, start: "s0", steps: {
    s0: {
      lines: ["Nhà hoang bên rìa nghĩa địa. Cửa không còn cánh, mái dột. Trong nhà tối hơn ngoài sân."],
      choices: [
        { label: "Bước vào", delta: 0, next: "s1" },
        { label: "Đứng ngoài nhìn thôi", delta: 0 },
      ] },
    s1: { room: true, lines: [], choices: [] } } },
];

// The world is wider than the original 400 units: content built for x in 0..400 is shifted right
// by WORLD_SHIFT so there is room for scenery on both sides (and for zooming out).
window.WORLD_SHIFT = 120;
FINDS.forEach((f) => { f.x += window.WORLD_SHIFT; });

window.CLUE_TOTAL = 5;

window.HANH_REVEAL = [
  "Bạn đã nhặt đủ những thứ bị bỏ quên: cái nón thêu chữ H, chiếc dép nhỏ một bên, cái bát khắc “Sáu, cho Hạnh”, bức ảnh trước ngày nước lớn, và chiếc khăn mỏ quạ trên rào tre.",
  "Cô bé Hạnh năm ấy đứng chờ ở cửa không hề mất. Cả xóm đã nuôi em lớn, mỗi nhà một bát cơm. Em lớn lên, làm vợ người khó tính nhất xóm, và mỗi năm vào ngày nước lớn, em nấu một mâm xôi mà không nói với ai.",
  "Bà Sáu chờ con gái về. Con gái vẫn về, mỗi năm một lần, nhưng bà đứng ở gốc gạo và chưa bao giờ nhìn ra.",
  "Chỉ cần có ai đó nói cho bà biết.",
];


// After all three nights are done, the monk can go up to the hermitage at dawn.
Object.assign(STORY.monk.scenes, {
  t1: {
    time: "Sáng", place: "hermitage",
    lines: [
      "Đường lên đồi dài hơn thầy nhớ. Tịnh thất hiện ra giữa sương: mái lá, một chuông gió bằng vỏ ốc, và một vị sư già đang quét sân.",
      "Thầy Minh quét một nhát, lá rơi thêm hai chiếc. Ngài quét thêm. Lá rơi thêm.",
      "“Thầy Tịnh về rồi à,” ngài không ngẩng lên. “Con thấy cái sân này không? Ta quét ba mươi năm rồi, chưa lần nào sạch.”",
    ],
    choices: [
      { label: "Cúi chào, đỡ lấy cây chổi", delta: 1, next: "t2" },
      { label: "Hỏi: sao thầy không để lá yên?", delta: 0, next: "t2" },
    ],
  },
  t2: {
    time: "Sáng", place: "hermitage",
    lines: [
      "Thầy Minh cười, rót hai chén trà. “Ta kể con nghe chuyện cái chổi.”",
      "“Có ông thợ quét lá, quét cả đời cho sân sạch. Lúc nằm xuống, ông tính ra mình đã quét đủ lá để chất thành một quả núi. Nhưng cái ông nhớ nhất không phải quả núi, mà là những buổi sáng được ngồi nghe lá rơi.”",
      "Ngài nhấp trà. “Còn con? Đêm qua ngồi nghĩa địa, con quét được gì?”",
    ],
    choices: [
      { label: "Con không quét được gì. Con chỉ ngồi", delta: 1, next: "t3" },
      { label: "Quét được nửa đêm. Nửa kia con ngủ gật", delta: 1, next: "t3" },
    ],
  },
  t3: {
    time: "Sáng", place: "hermitage",
    lines: [
      "Thầy Minh gật đầu như chuyện đáng nghe. “Mà này, mỗi năm đến ngày nước lớn có một bà khách lên đây. Bà không xin gì, chỉ đặt một mâm xôi ở bậc cửa rồi đi, không nói tên.”",
      { ifv: "c_vo", text: "Thầy Tịnh nhớ chiếc khăn mỏ quạ trên rào tre. Mâm xôi, ngày nước lớn, người vợ lặng lẽ của ông Tư. Mọi mảnh ghép nằm chung một chỗ." },
      { unlessv: "c_vo", text: "Thầy Tịnh thấy trong ngực có điều gì đó chưa khớp. Ngài không hỏi thêm." },
      "“Ta không biết bà là ai,” thầy Minh nói. “Ta chỉ giữ mâm xôi đến trưa rồi mang ra nghĩa địa. Không biết có đúng chỗ không.”",
    ],
    choices: [
      { ifv: "c_vo", label: "“Con biết bà ấy là ai. Xin thầy cho con mang mâm xôi ra gốc cây gạo.”", delta: 2, next: "t4" },
      { unlessv: "c_vo", label: "Xin phép mang mâm xôi ra đặt ở gốc cây gạo", delta: 1, next: "t4" },
    ],
  },
  t4: {
    time: "Sáng", place: "gao", end: true, epilogue: true,
    lines: [
      "Thầy bưng mâm xuống đồi. Xôi gấc đỏ còn ấm, thơm mùi nắng, đúng mùi xôi bà Sáu từng bán.",
      "Dưới gốc cây gạo, thầy đặt mâm xuống rồi ngồi bên cạnh. Gió lay tán hoa, một cánh hoa rơi đúng vào mâm.",
      { ifv: "c_vo", text: "“Bà Sáu,” thầy nói khẽ. “Con gái bà vẫn về, mỗi năm một lần. Bà chỉ chưa nhìn thấy thôi.”" },
      { unlessv: "c_vo", text: "“Có người vẫn mang xôi cho bà,” thầy nói khẽ. “Bà không còn phải chờ trong im lặng.”" },
      "Sương tan. Một vệt sáng rất mỏng đi ngang mâm xôi, dừng lại một chút, rồi bay lên cùng nắng.",
    ],
  },
});


// Books on the hermitage shelf. Each book is a RENDERING in Vietnamese made by the game's author, working from the
// Pali structure and from Bhikkhu Sujato's English translations on SuttaCentral. They are not copies of any published
// Vietnamese translation, and they have NOT been reviewed by a Theravada teacher yet. Reading to the last page calms the
// reader once per night; what was read is remembered across nights.
// body items: "paragraph" | { h: "heading" } | { verse: ["line", ...] } | { quote: "..." }
window.HERMIT_NOTE = "Đây là bản chuyển ngữ tiếng Việt do game soạn, không phải bản dịch đã xuất bản, và chưa được vị thầy Theravāda duyệt. Muốn học kỹ, xin đọc bản dịch chính thức của các vị thầy.";
window.HERMIT_BOOKS = [
  {
    id: "k_dhammacakka", title: "Chuyển Pháp Luân", source: "Tương Ưng Bộ, SN 56.11 (Dhammacakkappavattana Sutta)",
    body: [
      { h: "Bài pháp đầu tiên" },
      "Một thời, Đức Phật ngụ gần Ba-la-nại (Bārāṇasī), trong Vườn Nai ở Isipatana. Tại đó, Ngài nói với nhóm năm vị tỳ-kheo:",
      { h: "Hai cực đoan và con đường ở giữa" },
      "“Này các tỳ-kheo, có hai cực đoan mà người xuất gia không nên theo. Hai cực đoan ấy là gì? Một là đắm mình trong dục lạc, thấp kém, thô tục, phàm phu, không cao thượng, không đem lại lợi ích. Hai là đắm mình trong khổ hạnh hành xác, đau đớn, không cao thượng, không đem lại lợi ích.",
      "Tránh xa hai cực đoan ấy, Như Lai đã chứng ngộ con đường ở giữa, con đường đem lại thấy biết, đem lại hiểu biết, đưa đến an tịnh, thắng trí, giác ngộ và Niết-bàn.",
      "Này các tỳ-kheo, con đường ở giữa ấy là gì? Chính là Bát chánh đạo: chánh kiến, chánh tư duy, chánh ngữ, chánh nghiệp, chánh mạng, chánh tinh tấn, chánh niệm, chánh định. Đó là con đường ở giữa đem lại thấy biết, đưa đến an tịnh, thắng trí, giác ngộ và Niết-bàn.",
      { h: "Bốn Sự Thật cao quý" },
      "Này các tỳ-kheo, đây là Sự Thật cao quý về khổ: sinh là khổ, già là khổ, bệnh là khổ, chết là khổ; gần người mình ghét là khổ, xa người mình thương là khổ, muốn mà không được là khổ. Nói gọn lại, năm thủ uẩn là khổ.",
      "Đây là Sự Thật cao quý về nguồn gốc của khổ: chính là khát ái dẫn đến tái sinh, đi cùng với hỷ và tham, tìm vui chỗ này chỗ kia. Đó là khát ái đối với dục lạc, khát ái muốn hiện hữu, và khát ái muốn không hiện hữu.",
      "Đây là Sự Thật cao quý về sự chấm dứt khổ: chính là sự lìa bỏ và chấm dứt hoàn toàn khát ái ấy, không còn dư sót; sự buông bỏ, sự từ bỏ, sự giải thoát, không còn bám víu.",
      "Đây là Sự Thật cao quý về con đường đưa đến chấm dứt khổ: chính là Bát chánh đạo, tức chánh kiến, chánh tư duy, chánh ngữ, chánh nghiệp, chánh mạng, chánh tinh tấn, chánh niệm, chánh định.",
      { h: "Ba vòng, mười hai hành tướng" },
      "“Đây là Sự Thật cao quý về khổ.” Về điều chưa từng nghe từ ai trước đây, nơi Ta khởi lên con mắt, trí biết, tuệ, minh và ánh sáng. “Sự Thật cao quý về khổ này cần được hiểu rõ.” Nơi Ta khởi lên con mắt, trí biết, tuệ, minh và ánh sáng. “Sự Thật cao quý về khổ này đã được hiểu rõ.” Nơi Ta khởi lên con mắt, trí biết, tuệ, minh và ánh sáng.",
      "“Đây là Sự Thật cao quý về nguồn gốc của khổ. Sự Thật này cần được từ bỏ. Sự Thật này đã được từ bỏ.” Mỗi điều ấy đều khởi lên nơi Ta như vậy.",
      "“Đây là Sự Thật cao quý về sự chấm dứt khổ. Sự Thật này cần được chứng ngộ. Sự Thật này đã được chứng ngộ.” Mỗi điều ấy đều khởi lên nơi Ta như vậy.",
      "“Đây là Sự Thật cao quý về con đường đưa đến chấm dứt khổ. Sự Thật này cần được tu tập. Sự Thật này đã được tu tập.” Mỗi điều ấy đều khởi lên nơi Ta như vậy.",
      "Này các tỳ-kheo, chừng nào sự thấy biết đúng như thật của Ta về Bốn Sự Thật cao quý này, qua ba vòng và mười hai hành tướng, chưa hoàn toàn thanh tịnh, chừng ấy Ta chưa tuyên bố trước thế gian, với chư thiên, Ma vương, Phạm thiên, với các sa-môn, bà-la-môn, với chư thiên và loài người, rằng Ta đã chứng đạt vô thượng chánh đẳng chánh giác.",
      "Nhưng khi sự thấy biết đúng như thật của Ta về Bốn Sự Thật cao quý này, qua ba vòng và mười hai hành tướng, đã hoàn toàn thanh tịnh, thì Ta mới tuyên bố trước thế gian ấy rằng Ta đã chứng đạt vô thượng chánh đẳng chánh giác.",
      "Trí và kiến khởi lên nơi Ta: ‘Giải thoát của Ta không thể lay chuyển. Đây là đời sống cuối cùng. Từ nay không còn tái sinh nữa.’”",
      { h: "Khi pháp luân lăn chuyển" },
      "Đức Phật nói như vậy. Nhóm năm vị tỳ-kheo hoan hỷ và tán thán lời dạy của Ngài.",
      "Và trong lúc bài pháp này đang được nói, nơi tôn giả Koṇḍañña khởi lên pháp nhãn không bụi nhơ, không tỳ vết: “Cái gì có bản chất sinh khởi, tất cả cái ấy đều có bản chất hoại diệt.”",
      "Khi Đức Phật chuyển bánh xe Pháp, chư thiên cõi đất cất tiếng: “Gần Ba-la-nại, trong Vườn Nai ở Isipatana, Đức Phật đã chuyển bánh xe Pháp vô thượng. Bánh xe ấy không thể bị sa-môn, bà-la-môn, chư thiên, Ma vương, Phạm thiên, hay bất cứ ai trên đời quay ngược lại.” Nghe vậy, chư thiên các cõi cao hơn lần lượt cất tiếng như thế, cho đến cõi Phạm thiên.",
      "Ngay khoảnh khắc ấy, tiếng reo vang lên tận cõi Phạm thiên. Mười nghìn thế giới rung động, chuyển rung. Và một ánh sáng bao la, tuyệt diệu hiện ra trong thế gian, vượt hơn cả hào quang của chư thiên.",
      "Rồi Đức Phật thốt lên lời cảm hứng: “Koṇḍañña đã hiểu rồi! Koṇḍañña đã hiểu rồi!” Vì vậy, tôn giả được gọi là Aññā Koṇḍañña, Koṇḍañña người đã hiểu.",
    ],
    hint: "Gợi ý của game: đêm nay thầy Tịnh không hành xác, cũng không đi tìm khoái lạc. Ngồi giữa nghĩa địa chỉ là một lát cắt rất nhỏ của con đường ở giữa.",
  },
  {
    id: "k_anatta", title: "Vô Ngã Tướng", source: "Tương Ưng Bộ, SN 22.59 (Anattalakkhaṇa Sutta)",
    body: [
      "Một thời, Đức Phật ngụ gần Ba-la-nại, trong Vườn Nai ở Isipatana. Tại đó, Ngài gọi nhóm năm vị tỳ-kheo: “Này các tỳ-kheo!” Các vị đáp: “Bạch Thế Tôn.” Đức Phật nói như sau:",
      { h: "Năm uẩn không phải là tự ngã" },
      "“Này các tỳ-kheo, sắc là vô ngã. Vì nếu sắc là tự ngã, thì sắc đã không dẫn đến bệnh khổ, và người ta có thể bắt sắc theo ý mình: ‘Mong sắc của tôi như thế này! Mong sắc của tôi đừng như thế kia!’ Nhưng vì sắc là vô ngã, nên sắc dẫn đến bệnh khổ, và không ai có thể bắt sắc theo ý mình: ‘Mong sắc của tôi như thế này! Mong sắc của tôi đừng như thế kia!’",
      "Thọ là vô ngã. Vì nếu thọ là tự ngã, thì thọ đã không dẫn đến bệnh khổ, và người ta có thể bắt thọ theo ý mình. Nhưng vì thọ là vô ngã, nên thọ dẫn đến bệnh khổ, và không ai có thể bắt thọ theo ý mình.",
      "Tưởng là vô ngã. Vì nếu tưởng là tự ngã, thì tưởng đã không dẫn đến bệnh khổ, và người ta có thể bắt tưởng theo ý mình. Nhưng vì tưởng là vô ngã, nên tưởng dẫn đến bệnh khổ, và không ai có thể bắt tưởng theo ý mình.",
      "Các hành là vô ngã. Vì nếu các hành là tự ngã, thì các hành đã không dẫn đến bệnh khổ, và người ta có thể bắt các hành theo ý mình. Nhưng vì các hành là vô ngã, nên các hành dẫn đến bệnh khổ, và không ai có thể bắt các hành theo ý mình.",
      "Thức là vô ngã. Vì nếu thức là tự ngã, thì thức đã không dẫn đến bệnh khổ, và người ta có thể bắt thức theo ý mình: ‘Mong thức của tôi như thế này! Mong thức của tôi đừng như thế kia!’ Nhưng vì thức là vô ngã, nên thức dẫn đến bệnh khổ, và không ai có thể bắt thức theo ý mình.",
      { h: "Hỏi và đáp" },
      "Các ông nghĩ thế nào, này các tỳ-kheo? Sắc là thường hay vô thường?",
      { quote: "“Bạch Thế Tôn, vô thường.”" },
      "“Nhưng cái gì vô thường, thì khổ hay lạc?”",
      { quote: "“Bạch Thế Tôn, khổ.”" },
      "“Nhưng cái gì vô thường, khổ, có bản chất hoại diệt, thì có nên xem là: ‘Cái này là của tôi, tôi là cái này, cái này là tự ngã của tôi’ chăng?”",
      { quote: "“Bạch Thế Tôn, không.”" },
      "Thọ là thường hay vô thường? Tưởng là thường hay vô thường? Các hành là thường hay vô thường? Thức là thường hay vô thường? Mỗi lần, các vị đều đáp: “Vô thường.” “Cái gì vô thường thì khổ hay lạc?” “Khổ.” “Cái gì vô thường, khổ, có bản chất hoại diệt, có nên xem là ‘Cái này là của tôi, tôi là cái này, cái này là tự ngã của tôi’ chăng?” “Bạch Thế Tôn, không.”",
      { h: "Thấy đúng như thật" },
      "“Vì vậy, này các tỳ-kheo, bất cứ sắc nào, dù quá khứ, vị lai hay hiện tại, trong hay ngoài, thô hay tế, hạ liệt hay cao thượng, xa hay gần, tất cả sắc ấy cần được thấy đúng như thật bằng chánh trí tuệ: ‘Cái này không phải của tôi, tôi không phải cái này, cái này không phải tự ngã của tôi.’",
      "Bất cứ thọ nào, bất cứ tưởng nào, bất cứ hành nào, bất cứ thức nào, dù quá khứ, vị lai hay hiện tại, trong hay ngoài, thô hay tế, hạ liệt hay cao thượng, xa hay gần, tất cả đều cần được thấy đúng như thật bằng chánh trí tuệ: ‘Cái này không phải của tôi, tôi không phải cái này, cái này không phải tự ngã của tôi.’",
      "Thấy như vậy, vị đệ tử thánh có học nhàm chán đối với sắc, nhàm chán đối với thọ, tưởng, hành, thức. Nhàm chán thì lìa tham. Lìa tham thì được giải thoát. Khi được giải thoát, vị ấy biết: ‘Ta đã giải thoát.’ Vị ấy biết rõ: ‘Sinh đã tận, phạm hạnh đã thành, việc cần làm đã làm xong, không còn trở lại trạng thái này nữa.’”",
      { h: "Kết thúc" },
      "Đức Phật nói như vậy. Nhóm năm vị tỳ-kheo hoan hỷ và tán thán lời dạy của Ngài. Và trong lúc bài pháp này đang được nói, tâm của nhóm năm vị tỳ-kheo được giải thoát khỏi các lậu hoặc, không còn bám chấp.",
    ],
    hint: "Gợi ý của game: khi nỗi sợ hay cơn buồn ngủ kéo đến giữa đêm, thử hỏi: cái này đang đến rồi đi, vậy nó có phải là mình không?",
  },
  {
    id: "k_satipatthana", title: "Tứ Niệm Xứ", source: "Trung Bộ, MN 10 (Satipaṭṭhāna Sutta). Đây là bản chuyển ngữ rút gọn đủ cấu trúc, không lặp từng đoạn.",
    body: [
      { h: "Mở đầu" },
      "Một thời, Đức Phật ngụ trong xứ Kuru, gần thị trấn Kammāsadamma của người Kuru. Tại đó Ngài nói với các tỳ-kheo:",
      "“Này các tỳ-kheo, đây là con đường độc nhất để thanh lọc chúng sinh, để vượt qua sầu và bi, để chấm dứt khổ và ưu, để đạt được chánh đạo, để chứng ngộ Niết-bàn. Đó là bốn niệm xứ. Bốn ấy là gì? Ở đây, vị tỳ-kheo sống quán thân trên thân, nhiệt tâm, tỉnh giác, chánh niệm, nhiếp phục tham ưu đối với thế gian. Vị ấy sống quán thọ trên các thọ, quán tâm trên tâm, quán pháp trên các pháp, cũng nhiệt tâm, tỉnh giác, chánh niệm, nhiếp phục tham ưu đối với thế gian.”",
      { h: "Quán thân: hơi thở" },
      "Vị tỳ-kheo đi vào rừng, hay đến gốc cây, hay vào một căn phòng trống, ngồi kiết già, giữ thân thẳng, đặt niệm trước mặt. Chánh niệm, vị ấy thở vào; chánh niệm, vị ấy thở ra. Thở vào dài, vị ấy biết: ‘Tôi thở vào dài.’ Thở ra dài, biết: ‘Tôi thở ra dài.’ Thở vào ngắn, thở ra ngắn, cũng biết như vậy. Vị ấy tập: ‘Tôi sẽ thở vào, cảm nhận toàn thân.’ ‘Tôi sẽ thở ra, cảm nhận toàn thân.’ ‘Tôi sẽ thở vào, làm cho thân hành được an tịnh.’ ‘Tôi sẽ thở ra, làm cho thân hành được an tịnh.’",
      "Như người thợ tiện khéo, khi kéo dài một đường thì biết ‘tôi kéo dài’, khi kéo ngắn thì biết ‘tôi kéo ngắn’; cũng vậy, vị tỳ-kheo biết hơi thở dài ngắn của mình.",
      { h: "Quán thân: oai nghi và tỉnh giác" },
      "Khi đi, vị ấy biết: ‘Tôi đang đi.’ Khi đứng, biết: ‘Tôi đang đứng.’ Khi ngồi, biết: ‘Tôi đang ngồi.’ Khi nằm, biết: ‘Tôi đang nằm.’ Thân đang ở tư thế nào, vị ấy biết thân ở tư thế ấy.",
      "Vị ấy tỉnh giác khi đi tới, khi đi lui; tỉnh giác khi nhìn thẳng, khi nhìn quanh; tỉnh giác khi co tay chân, khi duỗi ra; tỉnh giác khi mang y và bát; tỉnh giác khi ăn, uống, nhai, nếm; tỉnh giác khi đại tiểu tiện; tỉnh giác khi đi, đứng, ngồi, ngủ, thức, nói, và im lặng.",
      { h: "Quán thân: các phần của thân" },
      "Vị ấy quán chính thân này, từ lòng bàn chân trở lên, từ đỉnh tóc trở xuống, được da bao bọc và đầy những thứ bất tịnh: ‘Trong thân này có tóc, lông, móng, răng, da, thịt, gân, xương, tủy, thận, tim, gan, hoành cách mô, lá lách, phổi, ruột, màng ruột, vật thực chưa tiêu, phân, mật, đàm, mủ, máu, mồ hôi, mỡ, nước mắt, mỡ da, nước miếng, nước mũi, nước khớp, nước tiểu.’",
      "Như một cái túi hai đầu mở, đựng đầy các loại hạt, có người mắt sáng đổ ra mà quán sát: ‘Đây là gạo, đây là đậu, đây là mè.’ Cũng vậy, vị ấy quán thân này.",
      { h: "Quán thân: bốn yếu tố" },
      "Vị ấy quán chính thân này, dù đặt ở đâu hay sắp đặt thế nào, là do các yếu tố tạo thành: ‘Trong thân này có đất, nước, lửa, gió.’ Như người đồ tể khéo hay người học việc của người đồ tể, giết một con bò rồi ngồi ở ngã tư đường, chia thịt ra từng phần; cũng vậy, vị ấy quán thân này theo các yếu tố.",
      { h: "Quán thân: chín giai đoạn nghĩa địa" },
      "Lại nữa, như thấy một thi thể bị vứt bỏ trong nghĩa địa, đã chết một ngày, hai ngày, ba ngày, sình trương, tím bầm, rữa nát, vị ấy so sánh với chính thân này: ‘Thân này cũng có bản chất như vậy, sẽ trở thành như vậy, không vượt qua được điều ấy.’",
      "Lại nữa, như thấy thi thể bị quạ ăn, diều hâu ăn, kền kền ăn, chim diệc ăn, chó ăn, hổ ăn, báo ăn, chó rừng ăn, hay bị nhiều loại sinh vật nhỏ rúc rỉa; vị ấy so sánh với chính thân này như trên.",
      "Lại nữa, như thấy một bộ xương còn dính thịt và máu, được các gân buộc lại; hay một bộ xương dính máu, không còn thịt, còn gân; hay một bộ xương không thịt không máu, chỉ còn gân buộc; vị ấy so sánh với chính thân này như trên.",
      "Lại nữa, như thấy các khúc xương rời rạc, vung vãi khắp nơi: đây là xương bàn tay, đây là xương bàn chân, đây là xương ống chân, đây là xương đùi, đây là xương hông, đây là xương sườn, đây là xương sống, đây là xương cổ, đây là xương hàm, đây là xương răng, đây là sọ; vị ấy so sánh với chính thân này như trên.",
      "Lại nữa, như thấy xương trắng màu vỏ ốc; xương chất thành đống đã qua nhiều năm; xương mục nát vụn thành bột; vị ấy so sánh với chính thân này: ‘Thân này cũng có bản chất như vậy, sẽ trở thành như vậy, không vượt qua được điều ấy.’",
      "Như vậy, vị ấy sống quán thân trên thân ở bên trong, hoặc bên ngoài, hoặc cả hai; quán sự sinh khởi, quán sự hoại diệt, quán cả sinh khởi lẫn hoại diệt của thân. Niệm ‘có thân’ được an lập nơi vị ấy, chỉ để có trí biết và có chánh niệm. Vị ấy sống không nương tựa, không chấp thủ bất cứ điều gì trên đời.",
      { h: "Quán thọ" },
      "Khi cảm nhận một lạc thọ, vị ấy biết: ‘Tôi đang cảm nhận lạc thọ.’ Khi cảm nhận khổ thọ, biết: ‘Tôi đang cảm nhận khổ thọ.’ Khi cảm nhận thọ không khổ không lạc, biết như vậy. Vị ấy cũng biết rõ thọ ấy thuộc về vật chất hay không thuộc về vật chất. Vị ấy sống quán thọ ở bên trong, bên ngoài, hay cả hai; quán sự sinh khởi và sự hoại diệt của các thọ, rồi sống không nương tựa, không chấp thủ điều gì trên đời.",
      { h: "Quán tâm" },
      "Tâm có tham, vị ấy biết: ‘Tâm có tham.’ Tâm không tham, biết: ‘Tâm không tham.’ Tâm có sân, không sân; tâm có si, không si; tâm co rút, tâm tán loạn; tâm rộng lớn, tâm không rộng lớn; tâm còn có tâm cao hơn, tâm vô thượng; tâm định, tâm không định; tâm giải thoát, tâm chưa giải thoát; vị ấy đều biết đúng như vậy. Rồi vị ấy quán tâm ở bên trong, bên ngoài, hay cả hai, quán sinh khởi và hoại diệt, sống không nương tựa, không chấp thủ điều gì trên đời.",
      { h: "Quán pháp: năm triền cái" },
      "Ở đây, khi có tham dục trong mình, vị ấy biết: ‘Trong tôi có tham dục.’ Khi không có, biết: ‘Trong tôi không có tham dục.’ Vị ấy biết tham dục chưa sinh sẽ sinh khởi thế nào, tham dục đã sinh được đoạn trừ thế nào, và tham dục đã đoạn trừ sẽ không sinh lại thế nào. Vị ấy quán như vậy đối với sân, hôn trầm thụy miên, trạo hối, và nghi.",
      { h: "Quán pháp: năm thủ uẩn" },
      "Vị ấy quán: ‘Đây là sắc, đây là sự sinh khởi của sắc, đây là sự biến mất của sắc. Đây là thọ, đây là sự sinh khởi của thọ, đây là sự biến mất của thọ.’ Tưởng, hành, thức cũng vậy.",
      { h: "Quán pháp: sáu căn và sáu cảnh" },
      "Vị ấy biết con mắt, biết các hình sắc, và biết sự trói buộc khởi lên do cả hai: sự trói buộc chưa sinh sẽ sinh khởi thế nào, sự trói buộc đã sinh được đoạn trừ thế nào, và sự trói buộc đã đoạn trừ sẽ không sinh lại thế nào. Tai và âm thanh, mũi và mùi, lưỡi và vị, thân và xúc, ý và các pháp, vị ấy cũng biết như vậy.",
      { h: "Quán pháp: bảy giác chi" },
      "Khi niệm giác chi có trong mình, vị ấy biết: ‘Trong tôi có niệm giác chi.’ Khi không có, biết là không có. Vị ấy biết niệm giác chi chưa sinh sẽ sinh thế nào, đã sinh được tu tập viên mãn thế nào. Vị ấy cũng biết như vậy về trạch pháp, tinh tấn, hỷ, khinh an, định, xả giác chi.",
      { h: "Quán pháp: Bốn Sự Thật cao quý" },
      "Vị ấy biết đúng như thật: ‘Đây là khổ. Đây là nguồn gốc của khổ. Đây là sự chấm dứt khổ. Đây là con đường đưa đến chấm dứt khổ.’ Rồi vị ấy quán pháp trên các pháp ở bên trong, bên ngoài, hay cả hai, quán sinh khởi và hoại diệt, sống không nương tựa, không chấp thủ điều gì trên đời.",
      { h: "Lời kết" },
      "“Này các tỳ-kheo, bất cứ ai tu tập bốn niệm xứ này trong bảy năm, người ấy có thể mong đợi một trong hai quả: ngay trong đời này được trí tuệ tối thượng, hoặc nếu còn dư sót, thì chứng quả Bất lai. Không cần bảy năm. Sáu năm, năm năm, bốn năm, ba năm, hai năm, một năm... cũng vậy. Không cần một năm: bảy tháng, sáu tháng, cho đến một tháng, nửa tháng... cũng vậy. Không cần nửa tháng: chỉ trong bảy ngày, người ấy có thể mong đợi một trong hai quả ấy.",
      "Chính vì vậy Ta đã nói: đây là con đường độc nhất để thanh lọc chúng sinh, để vượt qua sầu và bi, để chấm dứt khổ và ưu, để đạt chánh đạo, để chứng ngộ Niết-bàn: đó là bốn niệm xứ.”",
      "Đức Phật nói như vậy. Các vị tỳ-kheo hoan hỷ và tán thán lời dạy của Ngài.",
    ],
    hint: "Gợi ý của game: phần quán thi thể ở nghĩa địa là một lý do các thầy đầu đà chọn những nơi như chỗ thầy Tịnh đang ngồi.",
  },
  {
    id: "k_metta", title: "Kinh Từ Bi", source: "Kinh Tập, Sn 1.8 (Karaṇīya Mettā Sutta)",
    body: [
      { verse: ["Người khéo léo trong điều lợi ích,", "muốn đạt trạng thái an tịnh,", "nên sống như sau:", "có năng lực, ngay thẳng, rất ngay thẳng,", "dễ nghe lời, hiền hòa, khiêm tốn;"] },
      { verse: ["biết đủ, dễ nuôi,", "ít việc, sống nhẹ nhàng,", "các căn an tịnh, trầm tĩnh,", "thận trọng, không dính mắc với gia đình."] },
      { verse: ["Đừng làm điều gì dù nhỏ nhất", "mà bậc trí có thể chê trách.", "Mong tất cả được an vui, được yên ổn,", "mong tất cả chúng sinh được hạnh phúc."] },
      { verse: ["Bất cứ loài sinh vật nào,", "không sót một ai:", "yếu hay mạnh, dài hay to,", "vừa, nhỏ, mảnh hay tròn,"] },
      { verse: ["thấy được hay không thấy được,", "sống xa hay sống gần,", "đã sinh hay sắp sinh,", "mong tất cả chúng sinh được hạnh phúc."] },
      { verse: ["Đừng ai lừa dối ai,", "đừng khinh miệt ai ở bất cứ đâu.", "Dù tức giận hay bất bình,", "cũng đừng mong người khác đau khổ."] },
      { verse: ["Như người mẹ lấy chính mạng sống mình", "che chở đứa con, đứa con duy nhất,", "cũng vậy, đối với tất cả sinh vật,", "hãy tu tập tâm vô lượng."] },
      { verse: ["Với tình thương đối với cả thế gian,", "hãy tu tập tâm vô lượng:", "phía trên, phía dưới, bốn phương,", "không chướng ngại, không oán thù, không kẻ địch."] },
      { verse: ["Khi đứng, khi đi, khi ngồi,", "hay khi nằm, miễn là chưa mỏi mệt,", "hãy luôn giữ niệm này.", "Đó, người ta nói, là sống như bậc Phạm thiên ngay trong đời này."] },
      { verse: ["Không rơi vào tà kiến,", "có giới hạnh, đầy đủ trí tuệ,", "đã nhiếp phục dục vọng nơi các dục,", "người ấy không còn trở lại thai tạng nữa."] },
    ],
    hint: "Gợi ý của game: đây là bài mà thầy Tịnh tụng cho những người nằm dưới đất, và cho cả người đã đuổi thầy sáng nay.",
  },
  {
    id: "k_kalama", title: "Kinh Kālāma", source: "Tăng Chi Bộ, AN 3.65 (Kesamutti, còn gọi là Kālāma Sutta)",
    body: [
      { h: "Dân Kālāma đến hỏi" },
      "Tôi nghe như vầy. Một thời, Đức Phật đi trong xứ Kosala cùng một Tăng đoàn lớn, và đến một thị trấn của người Kālāma tên là Kesamutta. Dân Kālāma ở Kesamutta nghe tin: “Sa-môn Gotama, con trai dòng Sakya, đã xuất gia từ một gia đình Sakya, nay đã đến Kesamutta. Ngài có tiếng tốt như sau: ‘Vị Thế Tôn ấy là bậc A-la-hán, bậc Chánh Đẳng Giác...’ Được gặp những bậc như vậy là điều tốt lành.”",
      "Rồi dân Kālāma đến chỗ Đức Phật. Có người đảnh lễ rồi ngồi xuống một bên, có người chào hỏi thân mật rồi ngồi, có người chắp tay hướng về Ngài, có người xưng tên và dòng họ, có người ngồi im lặng. Ngồi xuống một bên, họ thưa:",
      "“Bạch Thế Tôn, có một số sa-môn và bà-la-môn đến Kesamutta. Họ chỉ giảng và đề cao giáo lý của mình, còn giáo lý của người khác thì họ công kích, nói xấu, miệt thị, bôi nhọ. Rồi lại có sa-môn và bà-la-môn khác đến, cũng chỉ giảng và đề cao giáo lý của mình, còn giáo lý của người khác thì công kích, nói xấu, miệt thị, bôi nhọ. Bạch Thế Tôn, chúng con nghi ngờ và phân vân: ‘Không biết trong các vị sa-môn, bà-la-môn đáng kính này, ai nói thật, ai nói dối?’”",
      { h: "Lời đáp của Đức Phật" },
      "“Này các Kālāma, các ông nghi ngờ, các ông phân vân là phải. Nghi ngờ đã khởi lên nơi các ông về một điều đáng nghi.",
      "Này các Kālāma, chớ vội tin vì nghe truyền miệng, chớ tin vì theo truyền thống dòng họ, chớ tin vì tin đồn, chớ tin vì có trong kinh điển, chớ tin vì suy luận, chớ tin vì suy diễn, chớ tin vì thấy điều ấy hợp lý, chớ tin vì chấp nhận một quan điểm sau khi cân nhắc, chớ tin vì vẻ ngoài có tài năng, và chớ nghĩ rằng ‘vị sa-môn này là bậc thầy đáng kính của chúng ta’. Nhưng khi tự mình biết rằng: ‘Những điều này là bất thiện, đáng bị chê trách, bị bậc trí chỉ trích, và nếu thực hành thì đưa đến hại và khổ’, thì này các Kālāma, hãy từ bỏ chúng.",
      "Các ông nghĩ thế nào, này các Kālāma? Tham khởi lên trong một người là vì lợi ích hay vì tổn hại của người ấy?” “Bạch Thế Tôn, vì tổn hại.” “Một người tham, bị tham chi phối, tâm bị tham che lấp, sẽ sát sinh, trộm cắp, tà dâm, nói dối, và khuyến khích người khác làm như vậy. Điều ấy có đưa đến hại và khổ lâu dài cho người ấy không?” “Bạch Thế Tôn, có.”",
      "“Sân khởi lên trong một người là vì lợi ích hay vì tổn hại?” “Vì tổn hại.” “Một người sân, bị sân chi phối, cũng sát sinh, trộm cắp, tà dâm, nói dối, và khuyến khích người khác làm như vậy. Điều ấy có đưa đến hại và khổ lâu dài không?” “Bạch Thế Tôn, có.” “Si khởi lên trong một người là vì lợi ích hay vì tổn hại?” “Vì tổn hại.” “Một người si, bị si chi phối, cũng làm các điều ấy và khuyến khích người khác làm theo. Điều ấy có đưa đến hại và khổ lâu dài không?” “Bạch Thế Tôn, có.”",
      "“Các ông nghĩ thế nào, này các Kālāma? Những điều ấy là thiện hay bất thiện?” “Bất thiện.” “Đáng chê trách hay không đáng chê trách?” “Đáng chê trách.” “Bị bậc trí chỉ trích hay khen ngợi?” “Bị bậc trí chỉ trích.” “Nếu thực hành, chúng đưa đến hại và khổ, hay không? Hay các ông thấy thế nào?” “Nếu thực hành, chúng đưa đến hại và khổ. Chúng con thấy như vậy.”",
      "“Vì thế, này các Kālāma, điều Ta đã nói: ‘Chớ vội tin vì nghe truyền miệng... Nhưng khi tự mình biết rằng những điều này là bất thiện, đáng chê trách, bị bậc trí chỉ trích, nếu thực hành thì đưa đến hại và khổ, thì hãy từ bỏ chúng’, Ta đã nói như vậy chính vì lý do này.",
      { h: "Điều thiện thì nên giữ" },
      "Này các Kālāma, chớ vội tin vì nghe truyền miệng... Nhưng khi tự mình biết rằng: ‘Những điều này là thiện, không đáng chê trách, được bậc trí khen ngợi, và nếu thực hành thì đưa đến lợi ích và hạnh phúc’, thì này các Kālāma, hãy thành tựu và sống trong những điều ấy.",
      "Các ông nghĩ thế nào? Không tham khởi lên trong một người là vì lợi ích hay vì tổn hại?” “Vì lợi ích.” “Một người không tham, không bị tham chi phối, thì không sát sinh, không trộm cắp, không tà dâm, không nói dối, và không khuyến khích người khác làm như vậy. Điều ấy có đưa đến lợi ích và hạnh phúc lâu dài không?” “Bạch Thế Tôn, có.” Với không sân và không si, Ngài hỏi cũng như vậy, và các vị đều đáp: “Vì lợi ích. Có.”",
      "“Những điều ấy là thiện hay bất thiện?” “Thiện.” “Đáng chê trách hay không?” “Không đáng chê trách.” “Bậc trí khen hay chê?” “Bậc trí khen ngợi.” “Nếu thực hành, chúng đưa đến lợi ích và hạnh phúc, hay không?” “Nếu thực hành, chúng đưa đến lợi ích và hạnh phúc. Chúng con thấy như vậy.” “Ta đã nói như vậy chính vì lý do này.",
      { h: "Bốn phạm trú" },
      "Rồi vị đệ tử thánh ấy, không tham, không sân, không mê lầm, tỉnh giác và chánh niệm, sống với tâm tràn đầy từ hướng đến một phương, rồi phương thứ hai, thứ ba, thứ tư; cũng vậy phía trên, phía dưới, bề ngang, khắp nơi, khắp cùng, vị ấy sống với tâm tràn đầy từ hướng đến toàn thế gian, rộng lớn, bao la, vô lượng, không oán thù, không ác ý.",
      "Vị ấy sống với tâm tràn đầy bi, với tâm tràn đầy hỷ, và với tâm tràn đầy xả theo cùng một cách, hướng đến toàn thế gian, rộng lớn, bao la, vô lượng, không oán thù, không ác ý.",
      { h: "Bốn niềm an ủi ngay trong đời này" },
      "Này các Kālāma, khi vị đệ tử thánh ấy có tâm không oán thù, không ác ý, không ô nhiễm, được thanh tịnh như vậy, vị ấy đạt được bốn niềm an ủi ngay trong đời này.",
      "‘Nếu quả có đời sau, và nếu các nghiệp lành dữ có quả báo, thì khi thân hoại mạng chung, tôi sẽ sinh vào một nơi tốt đẹp, một cõi trời.’ Đó là niềm an ủi thứ nhất.",
      "‘Nếu quả không có đời sau, và các nghiệp lành dữ không có quả báo, thì ngay trong đời này tôi vẫn sống không oán thù, không ác ý, không phiền não, an lạc.’ Đó là niềm an ủi thứ hai.",
      "‘Nếu quả có điều xấu xảy đến cho người làm điều xấu, thì tôi không có ác ý và không làm điều xấu, làm sao khổ có thể chạm đến tôi?’ Đó là niềm an ủi thứ ba.",
      "‘Nếu quả không có điều xấu xảy đến cho người làm điều xấu, thì tôi vẫn thấy mình thanh tịnh về cả hai phía.’ Đó là niềm an ủi thứ tư.",
      "Này các Kālāma, khi vị đệ tử thánh có tâm không oán thù, không ác ý, không ô nhiễm, thanh tịnh như vậy, vị ấy đạt được bốn niềm an ủi này ngay trong đời này.”",
      { h: "Kết thúc" },
      "“Thật đúng như vậy, bạch Thế Tôn! Thật đúng như vậy, bạch Thiện Thệ! Thật tuyệt diệu, bạch Thế Tôn! Chúng con xin quy y Đức Phật, quy y Pháp, và quy y Tăng. Từ nay cho đến trọn đời, xin Thế Tôn nhớ đến chúng con là những cư sĩ đã quy y.”",
    ],
    hint: "Gợi ý của game: ông Tư vội tin lời đồn rằng thầy là sư giả. Kinh này khuyên nhìn vào việc làm, không phải lời đồn.",
  },
  {
    id: "k_dhutanga", title: "Mười Ba Hạnh Đầu Đà", source: "Luận Thanh Tịnh Đạo (Visuddhimagga), chương 2 (Dhutaṅga niddesa). Đây là chú giải của các luận sư sau thời Đức Phật, không phải lời kinh.",
    body: [
      { h: "Đầu đà là gì" },
      "Chữ “dhutaṅga” có thể hiểu là “chi phần của sự rũ bỏ”. Đó là những hạnh tu giản dị mà một vị tỳ-kheo tự nguyện nhận thêm, ngoài giới luật vốn đã có, để rũ bỏ phiền não và mài bớt tham muốn, dính mắc.",
      "Đầu đà không phải giới bắt buộc. Một người có thể giữ một hạnh, vài hạnh, hay nhiều hạnh. Luận nhấn mạnh: giữ hạnh đầu đà không phải để khoe với người khác, cũng không phải để hơn thua. Hạnh chỉ có ý nghĩa khi nó giúp bớt tham muốn và biết đủ.",
      { h: "Mười ba hạnh" },
      "1. Hạnh phấn tảo y (pāṃsukūlikaṅga): chỉ mặc y may từ những mảnh vải người ta đã bỏ đi.",
      "2. Hạnh chỉ giữ ba y (tecīvarikaṅga): chỉ giữ ba tấm y, không thêm.",
      "3. Hạnh khất thực (piṇḍapātikaṅga): chỉ sống bằng thức ăn khất thực, không nhận lời mời ăn riêng.",
      "4. Hạnh khất thực tuần tự (sapadānacārikaṅga): đi khất thực lần lượt từng nhà, không chọn nhà giàu bỏ nhà nghèo.",
      "5. Hạnh ăn một chỗ (ekāsanikaṅga): ăn một lần trong ngày, ngồi một chỗ, không đứng dậy khi chưa ăn xong.",
      "6. Hạnh ăn trong bát (pattapiṇḍikaṅga): chỉ ăn thức ăn đựng trong bát của mình.",
      "7. Hạnh không ăn thêm (khalupacchābhattikaṅga): khi đã dừng ăn, hay đã nhận đủ phần, thì không ăn thêm nữa.",
      "8. Hạnh ở rừng (āraññikaṅga): sống ở nơi xa làng, trong rừng.",
      "9. Hạnh ở gốc cây (rukkhamūlikaṅga): ở dưới gốc cây, không ở trong nhà.",
      "10. Hạnh ở ngoài trời (abbhokāsikaṅga): ở nơi không có mái che, không ở dưới cây hay trong nhà.",
      "11. Hạnh ở nghĩa địa (sosānikaṅga): ở gần nghĩa địa, nơi người ta đem người chết đến. Luận nói hạnh này giúp nhớ đến cái chết và thấy rõ thân này vô thường.",
      "12. Hạnh ở nơi được chỉ (yathāsanthatikaṅga): được chỉ cho chỗ nào thì ở chỗ ấy, không kén chọn nơi ở.",
      "13. Hạnh ngồi không nằm (nesajjikaṅga): chỉ ngồi, đứng hay đi, suốt đêm không nằm xuống.",
      { h: "Hai hạnh đêm nay" },
      "Hạnh ở nghĩa địa và hạnh ngồi không nằm chính là hai hạnh thầy Tịnh giữ đêm nay.",
    ],
    hint: "Gợi ý của game: không ai buộc thầy ngồi giữa nghĩa địa. Thầy chọn.",
  },
];
