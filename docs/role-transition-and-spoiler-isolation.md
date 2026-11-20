# Role Transitions & Spoiler Isolation — Xuất gia, kết thúc kiếp ma, nhiều nhân vật trên cùng tài khoản

> **Spec đề xuất để review trước coding.** Nguồn chuẩn: [Ghost Campaign Bible](ghost-playable-campaign-bible.md), [Player-centric Narrative Model](player-character-narrative-model.md), [Game Design Principles](game-design-principles.md). Không thay đổi schema/code/save ở PR tài liệu này.
>
> **Mục tiêu:** người chơi có thể tạo nhiều PC độc lập; PC dân **có thể phát tâm xuất gia, chuyển hành trình sang nhà sư**; PC ma có thể nhận hồi hướng và **tự chọn khép lại truyện sớm**, với đoạn kết gợi tái sinh làm người/thọ thần/chư thiên nhưng **không trở thành một avatar thiên giới có gameplay**. Không ép người chơi có chỉ số tâm cố định để được "xuất gia" hoặc "siêu thoát".

> **Bổ sung cơ chế nhiều điểm nghỉ tùy chọn, Sổ Hành Trình, hồi tưởng/recap:** [Journey Memory & Return UX](journey-memory-and-return-ux.md). Nhà hoang chỉ là một nơi có thể nghỉ, không mặc định mọi hồn ma về đó. Thẻ tâm/hù dọa và hồi hướng từ PC khác: [Ghost Mischief](ghost-mischief-cards-and-shared-dedication.md).

> **Bản thoại / scene chi tiết cho việc thử nghiệm trước coding:** [Ghost Episode Pack 01 — G01/G03/G04](ghost-episode-pack-01.md) và [Ghost Episode Pack 02 — G02/G05/G06/G07](ghost-episode-pack-02.md). G03 đã chọn **bà cụ giếng + chiếc túi kim chỉ**, G04 dùng **một phần bến giao**, G07 ưu tiên **ending chung** cho MVP; các epilogue tái sinh riêng để duyệt sau. **Chưa đổi schema hoặc code.**

## 1. Năm quyết định an toàn cần chốt

1. **PC là một người duy nhất qua thời gian:** tên/characterId giữ nguyên khi người dân xuất gia; `role` phải có lịch sử và giai đoạn, không đổi `characterId` hoặc xóa quan hệ cũ.
2. **Xuất gia là lựa chọn chủ động qua chương truyện**, không tự bật “Bạn đủ điểm Niệm nên được phong sư”; vai xuất gia có thay đổi hành động, vật dụng, sinh hoạt và trách nhiệm.
3. **Hồn ma tái sinh là ending nhân vật**, không phải nút `role=ghost→deva` để tiếp tục làm quest. Người chơi có thể xem kết quả, journal và album lưu, nhưng chương ma đã khép.
4. **Không lộ lore tự động giữa các nhân vật** cùng account; những điểm chung đáng nhận ra chủ yếu do người chơi **tự nhớ cảnh vật** (ví dụ ba cột đá ở bến).
5. **Không xóa, ghi đè save cũ hoặc retroactively rewrite ba NPC**. Có `saveVersion`, migration test và phương án xem lại chương legacy.

## 2. Người dân có thể phát tâm xuất gia — câu chuyện riêng

### V01 — "Sáng nay tôi muốn sống khác"

**Điều kiện gợi mở (không có điểm chuẩn cứng):**
- PC dân đã từng **tự tham gia ít nhất một việc làm có ý nghĩa** hoặc đã gặp một tình huống khiến họ thắc mắc về cách sống (giúp người, nghe sư, tìm một manh mối, trải qua nỗi buồn, hoặc đơn giản nhiều lần đi dạo tịnh thất).
- PC **chủ động nói chuyện với Sư Tịnh / sư già**, chọn câu `Con muốn tìm hiểu cuộc sống xuất gia`. Không tự mở popup chỉ vì điểm tâm/đạt level.
- **Không yêu cầu PC đạt một công thức tâm sở** như `Niệm>50, Định>30`; các thẻ có thể mở lời thoại/góc nhìn, không đóng vai xác nhận đạo hạnh.

**Playable scenes:**
1. **Nảy ý:** tại tịnh thất người dân thấy một sư quét sân, giữ y khô, đi khất thực và sinh hoạt giản dị. PC có lựa chọn `Hỏi sống ở đây có khó không?`.
2. **Tìm hiểu:** sư nói gần gũi, không tô hồng: “Có ngày yên lắm. Có ngày cũng đầy việc. Tu đâu phải ngồi yên cả ngày.” PC có thể `Thử phụ một ngày`, `Hỏi về giới và nếp sống`, `Đi tiếp`.
3. **Việc còn dang dở:** trước khi chính thức phát nguyện, nếu PC đang giữ lời với bà cụ/Ông Tư, game gợi nhắc `Bạn còn hẹn bà một việc`; PC có thể hoàn tất, nhờ người khác đảm nhận hoặc nói rõ chưa làm, **không xóa quest rồi thưởng như đã xong**.
4. **Tự nguyện lựa chọn:** có màn nói rõ **hành trình sống sẽ đổi**, giới hạn một số hoạt động (tự hái cây sống, sở hữu vật phẩm/kinh tế...), nhưng kiến thức, thẻ, đã giúp người vẫn còn. Nút `Bắt đầu hành trình xuất gia` / `Tiếp tục đời sống cư sĩ` / `Để sau`.
5. **Cảnh chuyển:** một buổi sáng, y được chuẩn bị đúng cách, sư nhận PC vào nếp sống phù hợp; chuyển `lifeStage=novice` (nếu làm chính xác nghi thức sa-di), hoặc `monastic_aspirant` nếu giai đoạn trò chơi chưa mô phỏng nghi thức thật. **Không mặc định ngay là tỳ-kheo thọ giới đầy đủ.**
6. **Hậu truyện:** PC đi kinh hành/tu tập cùng thầy, mang những câu chuyện cư sĩ đã trải qua đến với hoạt động mới; lời NPC thay đổi: Ông Tư “Dạo này ít thấy con đi ngoài ngõ” chứ không coi PC thành người mới.

**Hình mẫu thoại:**
> **PC:** “Thầy ơi, con muốn thử sống ở đây một thời gian.”
>
> **Sư Tịnh:** “Vậy thử một ngày trước đã. Sáng mai nhớ dậy sớm, không phải ngày nào cũng ngồi ngắm mây đâu.”
>
> `Con muốn thử` / `Con muốn hỏi thêm` / `Để hôm khác`

**Lưu ý Phật học:** theo cách giải thích Vinaya Theravāda, `pabbajjā` (xuất gia ban đầu, sa-di) và `upasampadā` (thọ đại giới tỳ-kheo) là những bước khác nhau, yêu cầu điều kiện và nghi thức riêng. Không mô tả chỉ cần đạt thẻ/điểm là thành tỳ-kheo. Tài liệu tham khảo: https://www.dhammatalks.org/vinaya/bmc/Section0054.html ; nội dung nghi thức trong game **cần duyệt thầy**. Đây là kịch bản game, không phải hướng dẫn thọ giới thật.

### Transition data đề xuất

```js
// Khái niệm tương thích, CHƯA dùng thay Save.createCharacter() của code cũ
character = {
  characterId: "char_777", displayName: "Mây",
  originRole: "villager",
  activeRole: "monk", // hoặc lưu originRole và lifeStage, adapter legacy sẽ xét activeRole
  lifeStage: "monastic_aspirant", // novice chỉ khi đủ quy tắc
  roleHistory: [
    { role: "villager", stage: "lay", eventId: "creation" },
    { role: "monk", stage: "monastic_aspirant", eventId: "V01_gone_forth" }
  ],
  inventoryPolicy: "monastic",
  questStates: {},
  cards: {},
  loreJournal: {}
};
```

**Bảo toàn:** giữ ID, tên, thẻ tâm, sổ, việc đã làm, bạn bè, NPC relations và lịch sử; **chỉ** chuyển quyền làm một số hoạt động theo `lifeStage`. Các món vật chất không phù hợp có thể để lại/ủy thác/trưng trong Sổ (theo game) trước khi chuyển, **không tự xóa không báo**.

**Quyết định MVP:** khi đã chọn đi vào đời sống xuất gia, hướng chơi đó **một chiều trong chương hiện tại**, không có nút “đổi lại dân” như đổi skin. Nếu sau này viết hoàn tục, phải là một mạch truyện tự nguyện, không phải toggle để exploit vật phẩm. Người chơi luôn có thể tạo PC dân khác.

## 3. Ghost ending — khép một kiếp sống, không đổi thành lớp nhân vật mới

### E01 — "Đêm cuối, đường mới"

**Tại sao nên cho kết sớm:** vai ma dễ trở nên nặng nề nếu buộc phải rong ruổi khổ đau nhiều đêm mới có cơ hội được an. Người thích khám phá lâu được quyền ở lại; người thích một câu chuyện chữa lành trọn vẹn có thể chọn khép sau vài mốc.

**Mở ending nhẹ:** sau khi PC ma đã (1) chứng kiến/nghe một lời hồi hướng phù hợp hoặc có nhân duyên được hỗ trợ và (2) từng tạo một thay đổi ý nghĩa (ví dụ giúp người tìm đồ bằng mộng, giúp người lạc đường qua tiếng gọi, kết nối một manh mối). **Không cần tất cả bí mật bà Sáu, thọ thần, cõi giới hay số điểm karma.**

**Hai lựa chọn tách rõ:**
- `Tiếp tục khám phá`: giữ vai ma và toàn bộ progress, **không mất cơ hội ending**.
- `Khép lại kiếp sống này`: một màn xác nhận báo nhân vật sẽ chuyển sang trạng thái đã hoàn thành, **không tiếp tục gameplay truyện vai ma** (vẫn đi dạo được ở nơi đã khám phá); cho xem trước cảnh không spoil exact ending, có nút hủy.

**Các kết cuối gợi tái sinh (chưa là canon):**
- **Người trong làng:** epilogue một đứa trẻ ra đời ở một mái nhà, giữ cảm giác dịu nhưng **không tự nhận đứa trẻ là NPC nào đang có**. Không biến PC ma thành PC dân chơi tiếp; người chơi có thể tạo một PC mới riêng nếu thích.
- **Thọ thần:** một chiếc lá gạo sáng, gợi nhân vật tái sinh làm `rukkhadevatā`; cảnh kết, không mở vai chơi thọ thần.
- **Chư thiên:** mây cao và tiếng chuông, gợi nhân vật tái sinh trong một cõi trời; cảnh kết, không mở gameplay chư thiên.

**Không cho người chơi chọn bằng menu “Chọn cõi tái sinh” hoặc công thức điểm thiện.** Có thể thiết kế ending gắn với **động lực/nhân duyên của chính PC** đã gặp trong câu chuyện, nhưng không tuyên bố một hành vi/điểm tâm bảo đảm kết tái sinh thực theo Phật học. Nếu kịch bản chưa đủ sâu, nên **chốt một kết chung “rời cảnh khổ, con đường khác mở ra”** trước khi viết ba kết hoành tráng.

**Quan trọng về chữ “siêu thoát”:** trong lời quảng bá có thể nói “hành trình được an, thoát khỏi cảnh khổ”, nhưng khi tái sinh chưa phải đắc Niết-bàn/giải thoát tối hậu. **Bà ngoại HG27** tan trong ánh sáng là kết của NPC bà ngoại, không trở thành cơ chế NPC ma nào cũng “đủ 3 thẻ là tan”. PC ma có quyền chọn sau khi có kịch bản riêng.

### Lưu và hiển thị

```js
// Spec sau này, không sửa Save hiện có
ghostEnding = {
  characterId: "char_ghost_1",
  status: "story_completed",
  endedAt: "server_timestamp",
  endingId: "E01_moonlit_return",
  endingTheme: "human_or_deva_as_scripted",
  archiveRef: "journal_snapshot",
  rewardIssued: true
};
// character selection: [Mây (nhà sư), Gió (dân), Sương (hồn ma — Chuyện đã khép)]
```

- **Giữ nhân vật** trên màn chọn như một **chương truyện đã hoàn thành**: xem nhật ký, album, screenshot cảnh và lời kết, và **đi dạo ở những nơi đã khám phá** (Chế độ đi dạo, xem [Journey Memory §0.5](journey-memory-and-return-ux.md)); không xóa record.
- Không tiếp tục điều khiển avatar đã tái sinh dưới dạng `deva/treegod` hoặc `villager` tự động. Tạo PC mới dùng flow bình thường, không kế thừa thẻ/quá khứ không hợp logic.
- Không tự khép chỉ vì người dùng lâu không online, gặp sư, chạm ánh sáng hay hoàn thành quest phụ. Nhánh `Continue exploring` có giá trị ngang với `Conclude`.
- Chống tái claim ending: `characterId + endingId` có transaction, một lần ghi; trên nhiều thiết bị không thể vừa end vừa tiếp tục ghi quest ma.

## 4. Nhiều nhân vật: không spoiler bằng đồng bộ save

Hiện tại `public/save.js` khai báo `dhutanga.memory`, `dhutanga.runs`, `dhutanga.completed` là **ACCOUNT_KEYS**, còn `dhutanga.mind/history/progress` là **CHAR_KEYS**. Code legacy `story.js` có `HANH_REVEAL` qua nhiều góc nhìn. Mô hình PC-centric mới **không được mặc định dùng memory account để biết quá khứ NPC hoặc mở cảnh thuộc character khác**.

### 4.1. Ba lớp thông tin

| Scope | Có thể chứa | Không được chứa |
|---|---|---|
| **character-private** | quest PC đã làm, người đã gặp, note manh mối, thẻ, item, khu đã đi, `spoilerFlags`, nhánh ending | ký ức/sự kiện của PC khác |
| **account-meta (tùy chọn)** | đếm achievements không lộ cốt truyện, tên/biểu tượng nhân vật đã hoàn thành, album ảnh do user tự mở từ thư viện | `hanh_is_tu_wife`, `ba_sau_full_memory`, route đã mở ở vai ma khiến PC sống auto tới |
| **world-shared (chỉ khi thiết kế)** | landmark, ngày/tiết trời chung, event social có luật rõ | việc riêng nhân vật A đã làm mà PC B chưa hề biết |

**Không thể ngăn người chơi ngoài đời nhớ plot khi đổi avatar** — nhưng gameplay có thể mang lại khám phá mới do **góc nhìn khác** và không tự đưa spoiler vào journal của PC mới.

### 4.2. Bến Không Tiếng: phần giao và phần riêng

**Giao ở landmark, không giao ở toàn bộ map/plot:**

- PC ma: từ **khe suối rừng tre/khe đá khuất → Bờ Chìm**, thấy mặt sau của ba cột đá và chuyện người đưa đò; **không tự biết** Hạnh là vợ Ông Tư.
- PC sống: từ **Hang Vọng Tâm → Bờ Nổi**, thấy mặt trước ba cột đá và câu chuyện của người sống; **không tự đọc** lời người đưa đò ma đã nghe.
- Khoảng giao **cột đá, tiếng mái chèo, vật thể mái cũ** để người chơi thật nhận ra “mình từng đến đây”, còn nội dung mới mỗi bên.
- Nếu cùng account đã chơi ghost trước, PC sống vẫn phải **thu thập manh mối của chính mình**. **Không triển khai Codex cấp tài khoản trong MVP**, kể cả chế độ chỉ đọc. Đề xuất Codex ngoài gameplay là **deferred**, chỉ được xem xét sau khi có chính sách spoiler/opt-in riêng, không làm nguồn mở khóa. Tham chiếu [quyết định Một Sổ](journey-memory-and-return-ux.md).

### 4.3. Version/migration không phá cũ

1. **Định nghĩa `saveVersion`** cho dữ liệu narrative mới, map `legacyAccountMemory` sang `archive/storySeenMeta`, giữ nguyên checkpoint `c1/m2/g2/v2` để resume được.
2. **Legacy story của bà Sáu/Tịnh/Ông Tư** chỉ được xem như flashback hoặc archived original campaign; không tự gán thành quá khứ của PC mới.
3. **Mỗi character có `characterStoryState` riêng**; `accountMeta` không điều khiển `questPrerequisites` hoặc `revealText` cá nhân.
4. **Role transition cư sĩ → sư** phải migration quyền tương tác vào `activeRole` mà không tạo character mới; cần test trường hợp còn nhiệm vụ dân đang dở.
5. **Ghost ending** đổi trạng thái thành read-only, không xóa thẻ/công việc đã đạt; thiết kế replay theo archive, không reset `ghost.questStates`.
6. **Guest và account** cần đường chuyển progress không vô tình ghi các spoiler character vào global `memory`. Test nhiều character trong cùng account và nhiều tab/device.

### Ví dụ kịch bản test spoiler (bắt buộc)

| Character 1 | Character 2 | Mong đợi |
|---|---|---|
| PC ma đã đến Bờ Chìm, nghe người đưa đò | PC dân lần đầu vào hang | hang/bến phía người dân vẫn lạ, journal không có lời đưa đò |
| PC ma biết chuyện Hạnh ở mức một mảnh | PC sư gặp Ông Tư lần đầu | không tự có NPC relation/mục tiêu “giúp Hạnh” |
| PC dân gặp Ông Tư, giúp con Vàng | PC ma gặp Ông Tư ở đêm khác | PC ma thấy lịch ambient độc lập, không tự nhận công đã làm |
| PC dân đã đổi sang sư | cùng account tạo PC dân khác | PC thứ hai vẫn là dân, các quest cũ không xem như làm rồi |
| PC ma hoàn tất ending | cùng account chơi PC sống | ghost được archive, account không tự mở cổng trời hoặc reveal bí mật |
| PC cũ đang ở `g2b_2` | upgrade code lên schema mới | checkpoint giữ hoặc được chuyển sang archive theo migration có xác nhận; không tự ghi đè |

## 5. Khảo chứng giáo lý / hạn chế tuyên bố

- `pabbajjā` (xuất gia/sa-di) và `upasampadā` (đại giới/tỳ-kheo) khác nhau; không viết biến hình thành tỳ-kheo chỉ vì điểm Niệm. Nguồn: https://www.dhammatalks.org/vinaya/bmc/Section0054.html .
- `Khp 7 Tirokuḍḍa`: hồi hướng và lợi ích của việc cúng dường được mô tả theo bối cảnh nhất định; không kết luận **mọi ngạ quỷ** đều nhờ một lần nghe pháp mà tái sinh. Nguồn: https://www.dhammatalks.org/suttas/KN/Khp/khp7.html .
- `rukkhadevatā`: chuyện thọ thần/thiên nương cây xuất hiện trong các truyện chú giải; ví dụ `Rukkhadhamma Jātaka` thuộc chú giải Jātaka. Nhãn `commentary` cho phần dẫn, `fiction` cho ending nhân vật cụ thể. Không nhầm thọ thần là hạng người chơi riêng đang được hỗ trợ.
- Không viết phương trình **"đủ công đức = thiên giới"**, **"hồi hướng = Niết-bàn"** hoặc **"tâm cao = được xét xuất gia"** như chuẩn tôn giáo. Đây là thiết kế trò chơi cần tham vấn thầy.

## 6. Chốt phạm vi trước coding

**MVP ghost & role transitions:**
- Ghost MVP: G01 (hù Ông Tư, ông sợ thật; có lựa chọn **nhắc ông xử lý chiếc đèn**), G03 (giúp bà cụ bằng thì thầm/báo mộng), **một cảnh NPC sư hồi hướng thuộc G06**, G07 (ending tự chọn + archive). **G01 giúp ông Tư tránh nguy hiểm từ đèn hoặc G03 giúp bà** đều là đường hợp lệ tiến tới G07; không bắt hoàn thành cả hai. G04/Bờ Chìm và G05 để sau lát cắt hang (do khối lượng map, **không phải khóa bởi tu tập**); hồi hướng giữa PC thật để phase cuối.
- Villager: **một câu chuyện quyết định phát tâm** và thử sinh hoạt xuất gia; nếu chưa đủ khả năng đảm bảo save/role migration, đưa **toàn bộ tính năng đổi vai vào Phase 2** nhưng chốt API/save contract từ đầu.
- Spoiler: character-private ngay từ PR đầu, 2 character cùng account kiểm tra không lộ.
- Không đụng tới 27 HG và map lớn ngoài các marker cần để chơi vòng mẫu.
- **Điều kiện trước khi code MVP:** playable script G01/G03/G06-short/G07 có lời thoại/trigger/exit, hợp đồng **event/projection** theo [Sổ Hành Trình](journey-memory-and-return-ux.md) (không tạo event store thứ hai), `roleHistory`, `endingState`, legacy migration plan và danh mục ảnh tối thiểu. Hai scene bến khác góc nhìn là điều kiện **phase G04**, không bắt MVP đầu dựng cả hai bờ.

**Cần review tác giả trước khi viết code** (các vấn đề còn mở):
1. **Đã định hướng MVP:** một hành động giúp người có hệ quả thực (G01 giúp ông Tư xử lý đèn **hoặc** G03 giúp bà cụ) + một lần chủ động nghe hồi hướng từ **NPC sư**; **không yêu cầu Bờ Chìm**. Điều kiện chỉ mở **lựa chọn khép chuyện**, không auto tái sinh, không chấm điểm công đức; về sau có thể có các cách mở bằng truyện khác.
2. Mộng chỉ được gửi khi người sống có `dreamAnchor`, hay PC ma có thể báo mộng cho bất kỳ ai? Đề xuất: có mối liên hệ với vật/người để tránh phép thuật toàn năng.
3. Chọn ending cụ thể (người/thọ thần/chư thiên) nên là **tuyến truyện được viết** từ bối cảnh, không menu chọn cõi. Đề xuất: MVP một kết chung trước.
4. Xuất gia ở phiên bản đầu được hiểu là **đang tìm hiểu/đệ tử tập sự**, hay phải mô tả nghi thức pabbajjā/sa-di? Đề xuất: giai đoạn tìm hiểu, tuyệt đối không tự xưng đã thành tỳ-kheo.
