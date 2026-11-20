# Ghost Mischief, Tâm sở & Shared Dedication — hù dọa có hậu quả, học qua thẻ và nghe hồi hướng v0.1

> **Thiết kế game/story, chưa code.** Hướng mới: PC hồn ma **được hù người cho họ sợ thật** (NPC phản ứng rõ, không chỉ “giật mình rồi cười”), nhưng nỗi sợ của **người bị hù** và tâm sở của **PC đi hù** là hai dữ liệu khác nhau. Người chơi có thể khám phá thẻ tâm bất thiện từ **động cơ và lựa chọn cụ thể của PC**, trong khi giúp người, nghe kinh, hồi hướng tạo tuyến truyện sâu hơn. NPC sư có thể ít sợ hơn; không cho phép dùng hiệu ứng này để quấy rối người chơi thật.
>
> Xem [Ghost Campaign Bible](ghost-playable-campaign-bible.md), [Ghost Episode Pack 01](ghost-episode-pack-01.md), [Ghost Episode Pack 02](ghost-episode-pack-02.md), [Journey Memory & Return UX](journey-memory-and-return-ux.md). Những mô tả ma tác động ánh sáng/giấc mơ, sự hưởng hồi hướng là **game fiction**; thẻ tâm là mô phỏng theo hệ thống học hỏi, không kết luận trạng thái tâm của người chơi thật.

## 1. Hù có hiệu quả — người bị hù PHẢI sợ và đổi hành vi

**Nỗi sợ cần được thể hiện thật qua hoạt hình, âm thanh, lời thoại và hành vi, chứ không chỉ dòng text.** Người dân vẫn có cá tính: ông Tư hay mạnh miệng nhưng chân run; người qua đường ôm thúng chạy vội; bà cụ có thể giật mình nhưng không dùng họ để hù ác ý lặp đi lặp lại. Sư già/Sư Tịnh **có thể phản ứng nhẹ hơn** (mở mắt, nhìn về phía phát tiếng, nắm lại mép y, hơi thoáng lo) tùy bối cảnh, **không phải miễn nhiễm siêu nhiên với sợ hãi**. Cả NPC sư chưa vững cũng có thể sợ.

| Người gặp | Hù nhẹ (sợi lá, tiếng “cộc”) | Hù rõ (bóng người/tiếng gọi bất ngờ) | Nhớ về sau |
|---|---|---|---|
| **Ông Tư** | khựng một nhịp, soi đèn, nói cứng | hoảng sợ, ôm đèn chạy về hiên, cửa đóng sầm; con Vàng sủa | hôm sau rủ người kiểm tra, lời đồn ở làng; nếu PC từng giúp, ông bớt nghi |
| **Khách qua đường** | bước chậm, nhìn quanh | run giọng, đi nhanh sang vùng sáng, có thể bỏ dở việc | lần sau đi cùng người khác hoặc ghé đường khác |
| **Bà cụ ở giếng** | quay lại, gọi người nhà | sợ thật, đi về giếng; nếu G03 đang theo, phải có đường sửa lời nhắc | khi PC giúp thấy tốt đẹp, bà bớt cảnh giác |
| **Sư Tịnh** | để ý dấu lạ rồi tiếp tục | giật mình một thoáng hoặc giữ y nhìn kỹ, sau đó bình tĩnh lại | nếu tò mò, có câu hỏi/nhận định khác, không biết chắc ai đã hù |
| **Sư già** | ít phản ứng hơn, quay lại hơi thở | có thể sợ thoáng qua nhưng vẫn ở lại quan sát, không phép thuật bất động | ngôn ngữ dịu, không thuyết pháp ngay |

**Cường độ:** lựa chọn hù nhẹ/hù rõ được mở có kiểm soát theo tình huống, không chế việc hù NPC làm mất an toàn, tự sát, ngã sông, bỏ trẻ, tổn hại người yếu. Nếu NPC đã hoảng đủ, họ rời khu vực hoặc khóa tương tác hù trong một khoảng story clock; người chơi có thể qua chuyện khác hoặc tìm cách sửa. Không có nhiệm vụ “hù người già đủ 10 lần”. **Không jumpscare lớn, flash mạnh hoặc âm thanh cực lớn**; cường độ sợ của NPC có thể rõ dù trải nghiệm nghe/nhìn của người chơi vẫn êm.

**Lựa chọn không bắt buộc:** người chơi ma thích tinh nghịch có thể hù, người chỉ muốn ngắm cảnh/giúp người không phải hù để mở tuyến chính. Hù không nhất thiết “xấu”: ý muốn trêu, ý muốn làm người sợ để thỏa mãn, phản ứng nóng giận, hoặc cố xua ai khỏi nơi nguy hiểm là các **động cơ khác nhau**, nên trả câu chuyện khác.

## 2. Thẻ bất thiện — “người bị sợ” KHÔNG có nghĩa “PC có tâm Sân”

Từ code hiện tại (`public/mind.js`) có `san`, `tham`, `si`, `hoi_han`, `phong_dat`, `bon_xen`, `khong_san`, `bi`, `tuy_hy`, `khong_tham`. **Không thêm thẻ “Sợ” tự động như tâm sở độc lập** chỉ vì NPC bị sợ. NPC có `fearState`; PC có event hành động/động cơ mô phỏng.

| Lựa chọn và diễn biến của **PC hồn ma** | Thẻ có thể học (nếu đủ ngữ cảnh) | Điều kiện tránh phát sai |
|---|---|---|
| `Hù chỉ vì muốn thấy ông Tư cuống lên, thích cảm giác mình có quyền` | **Tham (`tham`)** có thể được gợi từ sự thích thú nắm giữ trải nghiệm/quyền điều khiển trong mô phỏng | không tự cấp Tham vì bấm một chiếc lá rung trung tính |
| `Cố hù người đã xúc phạm mình vì muốn trả đũa` | **Sân (`san`)** nếu diễn tiến truyện thật sự thể hiện tâm chống đối, tức giận | **sợ hãi của NPC không sinh Sân cho PC**; không suy ra từ vẻ mặt của người khác |
| `Tin ngay một lời đồn sai rồi hù nhầm người` | **Si (`si`)** khi PC truyện nhận ra sự lầm lẫn qua chứng cứ | không phán đoán “chưa biết sự thật” = Si ở mọi câu hỏi |
| `Hù xong thấy người bị sợ và ray rứt vì điều mình làm` | **Hối (`hoi_han`)** nếu PC chọn diễn biến hối tiếc | không mặc định mọi hù dọa đều làm PC hối, và không ép popup giáo lý |
| `Ngừng hù khi biết người ta đang sợ, lựa chọn trấn an/giúp` | một **sự kiện giúp người** và thay đổi quan hệ; **Bi chỉ là ngoại lệ hiếm** nếu có mạch truyện đủ sâu | không đổi nút dừng hù thành thẻ thiện, không tặng Bi chỉ vì NPC tự bình tĩnh |
| `Giúp bà cụ tìm túi, sau đó vui với kết quả` | **Sổ Hành Trình + hậu cảnh** là thưởng chính; có thể xét **một Bi hiếm** sau câu chuyện giàu cảm xúc | không trao **Bi + Tùy hỷ** như bundle mặc định; vui với kết quả trước hết là ghi nhận chuyện |

**Đặc thù PC ma (09-11-2026):** **không thiết kế luyện thiền hay phát thẻ Niệm/Định** cho hồn ma. Việc nhìn ra vật thất lạc, nhận biết âm thanh ở G04 và lần theo ký ức là **quan sát/giải đố**, chỉ mở Sổ/địa điểm. Bi hoặc Tùy hỷ là **ngoại lệ hiếm**, cần tuyến truyện có động cơ thiện rõ ràng và hệ quả; không mặc định mỗi việc tốt đều phát thẻ. Nghe kinh/hồi hướng mở tình tiết và cơ hội kết truyện, **không tự nhận thẻ thiện**. Xem [Ghost Campaign Bible §2.3](ghost-playable-campaign-bible.md).

**Quy tắc khóa:** thẻ bất thiện là **khám phá để hiểu**, không phải điểm xấu hay phần thưởng có giá trị đổi lấy hành động gây hại; không có “thu thập đủ 10 người sợ để nhận Sân” hoặc lợi thế mạnh từ hành vi quấy rối. **Card discovery** nên xảy ra một lần sau **một tình huống truyện có nguyên nhân và hệ quả**, các lần sau chỉ làm rõ thêm sắc thái với chống spam. Cần người thẩm định giáo lý kiểm tra mapping tâm sở (đặc biệt các tâm sở đồng sinh) trước code.

### Ví dụ tương tác có kết quả thật (Ông Tư)

> Bạn làm một bóng người lướt qua tường.
>
> Ông Tư quay phắt lại. “Ai… ai đấy?”
>
> Con Vàng dựng lông gáy. Ông lùi hai bước, đánh rơi chiếc đèn. Ông chạy vội về hiên rồi đóng cửa.
>
> **Chọn:** `Thấy khoái vì ông sợ mình` / `Dừng lại, không hù nữa` / `Tìm cách báo ông về chiếc đèn`.

- Chọn thấy khoái: truyện mô phỏng sự **ham thích cảm giác lấn át** → có cơ hội nhận diện `Tham`. Còn ông Tư vẫn sợ dù PC không chọn gì thêm.
- Dừng lại: con Vàng bớt sủa, không tự rơi thẻ thiện.
- Báo chiếc đèn: PC chỉ có thể tạo dấu hiệu, chính ông Tư quyết định ra xem đèn. Kết quả khiến ông thay đổi thái độ về lời đồn **mà không biết ma nào đã giúp**.
- Nếu PC từng chọn **trả đũa do giận**, dùng một đoạn thoại riêng rõ ý chống đối thì có thể nhận diện `Sân`, không phụ thuộc một nút hù trung tính.

## 3. Cách gợi các truyện sâu hơn: làm thiện, nghe kinh, nghe hồi hướng — không bắt học bài

**Hù người có giá trị giải trí và học tâm; nhưng con đường mở rộng thế giới không nên chỉ là “hù càng nhiều càng giỏi”.** Truyện gợi một cảm giác khác bằng hệ quả tự nhiên:

1. PC ma hù Ông Tư, thấy ông sợ chạy về hiên. Vài hôm sau con Vàng vẫn cảnh giác. Một tối PC thấy bà cụ ở giếng tìm túi mà **không thể nhặt giúp** → thử thì thầm.
2. Khi bà cụ tìm được túi, PC thấy **mình có thể tạo một thay đổi tích cực mà không cần thân xác**. Trước hết nhận **ký ức/hậu cảnh**; một **Bi hiếm** chỉ xem xét sau lựa chọn chủ động muốn giúp và hành động có hiệu quả. **Không** tự tặng Tùy hỷ chỉ vì bấm “Thấy vui cho bà”. Không ép “hù → phải chuộc lỗi mới được đi bến”.
3. PC tình cờ nghe sư tụng hoặc được người sống hồi hướng, có thể **chủ động đứng nghe** → một mảnh chuyện về cuộc sống/tâm, lối dẫn tới G06/G07, **không auto kết truyện hoặc phát thẻ Niệm/Định**. Nếu có tình huống tùy hỷ phước lành, phải là **một cảnh độc lập có lựa chọn và thẩm định**.
4. PC vẫn được **đi rừng tre → Bến Không Tiếng Bờ Chìm** sớm dù đã hù, chưa nhận thẻ thiện hay chưa nghe kinh. Những câu chuyện sâu cần manh mối và quan hệ, không cần công thức điểm thiện.
5. `Nhật ký/Sổ Hành Trình` gợi nhẹ: “Bạn từng làm ông Tư sợ. Nhưng hôm qua bạn cũng giúp bà cụ tìm được túi.” Không dùng ngôn ngữ phán xét về phẩm hạnh người chơi ngoài đời.

**Phần thưởng là trải nghiệm, thẻ, ảnh/hiệu ứng nhỏ và những cánh cửa truyện mới**, không phải điểm thiện tuyệt đối. Người chơi chọn tình huống khác vẫn có cơ hội tới vùng mới.

## 4. Người chơi thật gặp nhau tình cờ — lời hồi hướng như sự kiện xã hội

Trong `public/app.js` hiện có **presence, gesture, chat, event emit/SSE**. Chúng là nền kỹ thuật có sẵn, **CHƯA có mô hình hồi hướng giữa PC với PC và phần thưởng/cốt truyện đi kèm**. Cần thiết kế riêng, không ghi như tính năng đã chạy.

### S04 — Một lời được nghe ngoài tường tịnh thất

**Bối cảnh:** PC ma đi ngang tịnh thất/đường mộ, *đúng lúc* một **PC nhà sư** khác vừa chọn `Hồi hướng` sau buổi tu, hoặc một **PC dân** vừa bố thí và chọn `Hồi hướng` trong câu chuyện. Không tự gán cho mọi người chơi lời hồi hướng họ chưa chủ động thực hiện.

**Một ví dụ ngắn:**

> Có tiếng chuông rất nhỏ phía bên kia tường.
>
> Một vị sư đang hồi hướng sau thời ngồi thiền.
>
> Bạn nghe những lời ấy theo gió tới.

**Chọn:** `Đứng lại lắng nghe` / `Nghe một câu rồi đi` / `Đi tiếp`.

- Khi PC ma chủ động **nghe trọn** và server đã xác minh event hồi hướng thật trong ngữ cảnh hợp lệ, ghi `heardDedication(source=player, eventId)` cho PC ma, mở 1 đoạn Sổ/câu thoại riêng; có thể góp một mốc ở G06 nhưng **không cho auto kết kiếp**.
- PC sư/dân thực hiện hồi hướng nhận kết quả của **chính hành động họ**. Không cần biết ai nghe, không tiết lộ tên/vị trí của PC ma hoặc bên gửi nếu họ chưa chủ động công khai.
- **Fallback:** không có người chơi thật thì **NPC sư vẫn có sự kiện hồi hướng** theo story schedule; không khóa bất cứ con đường ending/truyện nào sau lưng chế độ multiplayer.
- Các lời hồi hướng cần theo format hành động game, **không parse chat tùy ý** rồi biến thành thẻ/quest reward. Không tự lấy câu người chơi nói ngoài ngữ cảnh để tính.
- **Idempotent & rate limit:** tối đa một milestone có ý nghĩa cho mỗi `(receiverCharacterId,dedicationEventId)`, chống spam nhiều tài khoản; không có lợi ích farm thẻ từ hai PC spam hồi hướng.
- **Quyền riêng tư/safety:** không cho người chơi ma tự ý hù hoặc báo mộng trực tiếp lên người chơi thật một cách không thể tắt. Ghost effect với người chơi thật **chỉ opt-in**, hiệu ứng nhẹ, tắt được (calm/reduced motion/sound), không gửi thông điệp riêng cưỡng ép, có mute/block/report. Không hiển thị danh tính hay vị trí ẩn của hồn ma cho người không chọn tham gia.
- **Không khẳng định hiệu lực giáo lý:** việc “nghe hồi hướng” là một sự kiện truyện; không tự động chuyển kiếp hoặc chứng Niết-bàn; phần lời kinh nếu có phải trích nguồn và được duyệt.

## 5. Cảnh mở rộng G01 và G06 khi hù NPC sư

- G01 ông Tư: nếu `Hù rõ`, ông **sợ thật** (run giọng, soi đèn, chạy về hiên), vẫn có hành động sửa/giúp sau; con Vàng cảnh giác.
- G06 Sư Tịnh: tiếng gõ khiến sư **khựng lại, mở mắt nhìn**; nếu hù mạnh sư có thể bất an thoáng qua rồi quan sát lại. Không có “sư hoàn hảo không bao giờ sợ” và không cấp thẻ thiện cho người hù chỉ vì đối tượng là sư.
- Khi PC **chủ động ở lại nghe** sau buổi tu, đó là **nhánh khác** với hù sư. Người chơi có thể hù xong rồi rời đi, hoặc tò mò quay lại nghe; không bị ép làm thiện để “xóa điểm tội”.

## 6. State / QA tối thiểu để bảo toàn trải nghiệm

```js
// design-only, không phải API
const scareEvent = {
  id: "G01_scare_001",
  sourceCharacterId: "ghost_pc_1",
  targetActorId: "npc.ong_tu", // NPC; player thật phải opt-in riêng
  intentChoiceId: "enjoy_power", // playful | enjoy_power | retaliate | warn
  intensity: "strong", // soft | strong
  targetReaction: "fear_and_retreat",
  cardMilestone: "tham", // chỉ nếu đã kể đủ ngữ cảnh; null nếu chỉ hù chơi
  oncePerScene: true
};
const dedicationEvent = {
  id: "dedication_003",
  actorKind: "player", // hoặc npc
  actorId: "char_monk_9",
  placeId: "hermitage",
  storyAction: "dedicate_after_practice",
  eligibleListeningZone: "hermitage_outer_wall",
  occurredAt: "server_time"
};
```

- [ ] Ông Tư/khách qua đường khi bị hù **thực sự sợ**, có animation/sound/text và thay đổi hành vi/nói lại lần sau.
- [ ] Sư có thể sợ ít hơn hoặc bình tĩnh sớm hơn, không “miễn nhiễm” mặc định; phản ứng theo NPC.
- [ ] Hồn ma có thể mở **thẻ bất thiện** từ **động cơ/truyện của mình**, không nhận thẻ Sân vì nạn nhân đang sợ.
- [ ] Hù không cho phép quấy rối NPC không giới hạn; không gây hậu quả nguy hiểm, không farm thẻ bằng việc lặp.
- [ ] Hù là nhánh có thể chọn, không bắt làm thiện để chuộc hay để mở Bờ Chìm.
- [ ] G03 giúp người và G06 nghe kinh/hồi hướng có móc truyện tự nhiên, không thành tutorial giáo lý; **không auto phát thẻ thiện, không có thẻ Niệm/Định cho PC ma**.
- [ ] PC ma có thể **tình cờ gặp PC sư/dân** và nghe hồi hướng thật theo phạm vi, không yêu cầu co-op; NPC sư fallback.
- [ ] Không tự áp dụng quyền hù dọa NPC thành cưỡng ép hù người chơi thật; phải opt-in và có controls.
- [ ] Một sự kiện hồi hướng không được claim thưởng nhiều lần; 2 PC trên cùng account không auto chia ký ức.
- [ ] Sổ Hành Trình lưu sự kiện đã **xảy ra thật trong game**, không bịa chuyện “đã được hồi hướng” từ một câu chat.
