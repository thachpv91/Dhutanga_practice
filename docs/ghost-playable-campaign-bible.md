# Ghost Campaign Bible v0.3 — Hồn ma: vui tinh nghịch, khám phá cõi khuất và một cuộc đời riêng

> **Thiết kế trước coding, KHÔNG triển khai gameplay.** Người chơi tự tạo tên và chọn `ghost` — **KHÔNG phải bà Sáu**. `npc.ba_sau` và `npc.peta_grandmother` là hai NPC khác nhau, giữ nội dung đã có trong `story.js` và `encounters.js`. Chưa khẳng định hồn ma có thân thể thật, phép thuật hay khả năng tái sinh chủ động theo giáo lý; các cơ chế thì thầm/giấc mơ/đi xuyên ranh giới là **fiction/game_interpretation**, phải có chú thích nguồn nếu đưa vào game.
>
> **Bản có thể đọc và review theo cảnh:** [Ghost Episode Pack 01 — G01/G03/G04](ghost-episode-pack-01.md) và [Ghost Episode Pack 02 — G02/G05/G06/G07](ghost-episode-pack-02.md). Tài liệu này là **khung campaign và năng lực**, còn hai pack là **lời thoại, lựa chọn, hậu quả**. Bổ sung: [điểm nghỉ linh hoạt và Sổ Hành Trình](journey-memory-and-return-ux.md) · [hù dọa có tác động, thẻ tâm, hồi hướng giữa người chơi](ghost-mischief-cards-and-shared-dedication.md). Cùng chuẩn [Player-centric Narrative Model](player-character-narrative-model.md), [World Exploration Bible](world-exploration-bible.md), [Early Mysteries & HG27](human-world-early-mysteries-and-peta-quest.md). Thiết kế vai dân → xuất gia và ending vai ma nằm ở [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md).
>
> **Ranh giới game:** Nhân gian vẫn là nơi bình yên, phần cõi khuất **hơi kỳ ảo và man mác**, không làm thành game kinh dị. Cho phép chơi ngắn, tự do đi dạo và không bị khóa vì thiếu thẻ/tổng điểm tâm. Cảnh đáng nhìn hoặc pha hù người vô hại cũng là phần thưởng.

## 1. Những gì đã có / chưa có trên `develop`

| Hiện có trong code | Điều cần bổ sung hoặc thay |
|---|---|
| `story.js`, `story-nights.js`: cảnh ma từ góc nhìn **bà Sáu** với Hạnh, mẹt xôi, chiếc nón và đêm mưa/trăng | giữ các scene **làm NPC flashback**; viết mới cuộc đời của PC ma, không biến PC thành bà Sáu |
| `encounters.js` `ghost_memory`: bà Sáu nghe guốc, Hạnh và tiếng kinh, popup theo vùng `near()` | PC ma **chủ động tìm hiểu** chuyện bà Sáu; thay `auto popup` thành ambient + tap |
| `encounters.js`: đa số quest `tree/peta/cave/palace` gated qua `villageRole() = monk/villager` | tạo **ghost-only route**/storylets thay vì copy permission của người sống |
| `encounters.js`: hang modal đòi đèn, `Q('cave')` | PC ma được qua khe/vách mỏng mà **không cần đèn/đủ Niệm**, nhưng có khó khăn **khác** khi đi sâu |
| `save.js`: `dhutanga.memory/runs/completed` thuộc account; `mind/progress/history` per-character | **cô lập tiết lộ, checkpoint, lore và ending mỗi character**, legacy compatibility |
| `world-exploration-bible.md`: Hang Vọng Tâm → Bến Không Tiếng là lối người sống trong bản đồ đề xuất | thêm **lối hồn ma** từ nhà hoang/đường khuất; cùng một landmark nhưng trải nghiệm khác |

**Không mô tả** các cơ chế mới như đã chơi được. Existing NPC quest HG27 bà ngoại ngạ quỷ phục vụ người sống, có cinematic và ba milestone thẻ theo spec; PC ma không tự làm nhiệm vụ cúng cơm đó bằng cách chạm vật, nên cần độc lập.

## 2. Fantasy & hành vi riêng của PC ma

### 2.1. Quyền năng nhỏ, có vui và hậu quả

| Năng lực | Được làm trong game | Giới hạn giữ logic | Tình huống dùng |
|---|---|---|---|
| **Lượn qua bóng** | bước qua khe hẹp, lối bị che, một số cửa nhà hoang; nhìn lớp dấu vết khuất | không đi xuyên mọi map/teleport khắp thế giới; ranh giới cõi có ngưỡng riêng | `G01` nhà hoang, `G04` bến |
| **Thì thầm** | NPC người sống thoáng nghe 1–2 từ, quay đầu, thắc mắc hoặc nhớ việc đã nói | **không điều khiển ý nghĩ**, không đảm bảo NPC tin | chỉ người đi tìm vật nhớ nhìn chỗ rơi |
| **Tiếng động/đốm lạnh** | lá xào xạc, tiếng gõ cửa, ngọn đèn lay, bóng vụt qua | không cầm, dời, ném, mở khóa hoặc gây thương tích vật lý; NPC có thể **sợ thật**, nhưng không gây tai nạn nguy hiểm hay quấy rối người chơi thật | hù Ông Tư, đánh lạc hướng người tìm đồ |
| **Báo mộng** | gặp người đang ngủ trong một **scene mộng ngắn**, gợi hình một vật/địa điểm có liên hệ | hiếm, cần `dreamAnchor` (người đó có ký ức/dấu vết về đồ bị mất); không cho tự viết mộng toàn năng hoặc ép NPC làm việc | hoàn thành truyện “Vật ở dưới gốc tre” |
| **Nghe lời hồi hướng** | nghe lời sư tụng sau một đêm tu, thấy cảnh đổi và được hỏi liệu có sẵn lòng khép lại hành trình | không mặc định mọi lời tụng đều giải thoát tất cả hồn ma; phải có hoàn cảnh truyện và lựa chọn PC | `G06`, ending |
| **Dõi theo hương cơm cúng** | phát hiện cảnh có phẩm vật dâng/câu chuyện hồi hướng; tìm nơi người sống còn nhớ tới chúng sinh đã khuất | không `pickUp(food)`, không tự đi ăn cơm vật chất như item; khả năng hưởng phước tùy kịch bản được duyệt | `G02` |
| **Nghe lời của cõi khuất** | nói với một số vong linh/NPC chỉ hiện trong `ghostLayer`, thấy dấu chân ký ức | các NPC ngạ quỷ không vô hạn kiến thức, không biết toàn bộ mạch bà Sáu | `G04`, `G05` |

**Năng lực KHÔNG phải skill tree dựa vào điểm "thiện".** Thời điểm mở cần thỏa story condition ngắn, minh chứng tương tác (ví dụ thử thì thầm, biết NPC đang tìm), không yêu cầu farm thẻ/tâm.

### 2.2. Cơ chế hù dọa: NPC sợ thật, PC khám phá được tâm

**Hù là một hoạt động giải trí hợp lệ của vai ma.** Ông Tư/người đi đường khi bị hù rõ **phải có biểu hiện sợ thật**: run giọng, chạy về vùng sáng, đóng cửa, kể chuyện cho người khác nghe. Hù nhẹ khiến họ giật mình và cảnh giác. **Sư Tịnh/sư già** có thể ít sợ hơn hoặc bình tĩnh nhanh hơn (không tuyên bố mọi vị sư đều miễn nhiễm). Xem [spec hù NPC & thẻ](ghost-mischief-cards-and-shared-dedication.md).

**Phân biệt quan trọng:** `npc.fearState` là phản ứng của người **bị hù**; thẻ bất thiện của **PC hồn ma** chỉ xét từ **động cơ và lựa chọn riêng**: `tham` nếu thích thú với cảm giác áp đảo, `san` nếu có câu chuyện trả đũa/giận dữ, `hoi_han` nếu chọn ray rứt sau đó. Không phát thẻ `san` chỉ vì NPC sợ; không hù lặp để farm thẻ hoặc khuyến khích làm hại.

**Sau khi hù:** việc giúp bà cụ tìm túi (G03), tình cờ nghe kinh/hồi hướng từ NPC sư hoặc PC sư/dân khác (G02/G06) là các **móc khám phá tự nhiên**, không phải bài phạt “phải tu để chuộc lỗi”. Hồn ma vẫn được tự do vào Bờ Chìm ngay từ đầu. Với **người chơi thật**, mọi hiệu ứng hù phải **opt-in**, tắt/mute/block được; không có quấy rối vô hạn.

## 2.3. Thẻ tâm của PC ma — cơ hội thiện hiếm, không trao Niệm từ giải đố

> **Quyết định biên kịch 09-11-2026, design-only:** PC ma thuộc nhóm chúng sinh đang sống trong cảnh khổ, **không có con đường luyện thiền, rèn Niệm/Định như nhân vật người hoặc sư**. Lắng nghe, nhận ra tiếng mái chèo, nhớ lại ký ức và giải puzzle **chỉ là khả năng quan sát/ghi nhớ trong gameplay**; **không phát thẻ Niệm (`sati`) hay Định**. Không lấy điều này làm khẳng định giáo lý rằng *mọi* loài ngạ quỷ tuyệt đối không thể sinh tâm thiện.

**Tách rõ ba loại phần thưởng:**
1. **Khám phá thế giới:** `discovery`, `clue`, `journal`, `storyThread` và phản hồi NPC. Đây là phần thưởng chủ đạo khi PC ma tìm đường, nhìn thấy thứ người sống không thấy.
2. **Thẻ bất thiện được nhận diện:** `tham`, `san`, `hoi_han`… chỉ khi **động cơ và sự kiện của chính PC** thể hiện rõ, không phát vì NPC sợ hoặc vì click hù lặp.
3. **Khoảnh khắc thiện hiếm:** khi PC ma thật sự muốn một người bớt khổ, giúp mà không đòi nhận lại, hoặc chân thành tùy hỷ với điều lành của người khác. **Có thể** mở một thẻ thiện rất hiếm **nếu kịch bản viết đủ bối cảnh và được duyệt**; không có quest `G03` tự tặng cả Bi + Tùy hỷ theo mặc định. Nghe kinh/hồi hướng giúp mở **câu chuyện, lòng tin, nhân duyên với ending**, **không** tự cấp Niệm/Định hay bảo đảm thẻ thiện.

| Tình huống PC ma | Kết quả mặc định | Khả năng thẻ (không tự động) |
|---|---|---|
| **G01 hù Ông Tư** | NPC sợ thật, lần sau thay lời thoại/hành vi | **Tham** nếu PC thích áp đảo, **Sân** nếu có ý trả đũa, **Hối** nếu có diễn biến ray rứt |
| **G04 nhận ra tiếng mái chèo, đi qua khe đá** | **Manh mối + mở Bờ Chìm**, Sổ ghi điều đã thấy | **Không có thẻ Niệm/Định**; nghe phân biệt âm thanh không phải `sati` |
| **G03 thấy túi kim chỉ và tìm được bà cụ** | Ghi `discovery` / hành trình giúp người gián tiếp | **Có thể cân nhắc một thẻ Bi hiếm**, chỉ nếu PC nghe chuyện bà khổ, tự nguyện quyết giúp và hành động thật sự mang hiệu quả; không cấp vì thấy túi |
| **G03 thấy bà cụ vui sau khi tìm được túi** | Ghi `sharedJoy` / hồi tưởng, không nhất thiết phát thẻ | **Tùy hỷ** chỉ xem xét trong **mạch cảm xúc sâu hơn**, không nhận tự động từ nút “Thấy vui cho bà” |
| **G02/G06 nghe kinh hoặc hồi hướng** | `heardDhamma`/`heardDedication`, thêm lore và mở lựa chọn truyện | Không phát **Niệm**, **Định**, **Hỷ** chỉ vì nghe; nếu có đoạn **chủ động tùy hỷ với phước thiện** được viết riêng, có thể xem xét **Tùy hỷ hiếm** |
| **PC buông một luyến tiếc lớn** (tuyến về sau) | Một thay đổi trong ký ức/cảnh và lựa chọn ending | Có thể xem xét **Không tham** qua cao trào thực sự, không tự tặng vì ghost không nhặt được đồ |

**Cân bằng vai:** không ép album của ma phải thu thập đủ các thẻ thiện giống PC dân/sư. Người chơi ma có nhiều **thẻ bất thiện để nhận diện và khám phá tâm**, nhiều ký ức và thế giới cõi khuất, rất ít thẻ thiện có ý nghĩa. Không dùng tổng số thẻ thiện hay chỉ số Niệm/Định để chặn G04/Bờ Chìm hoặc lựa chọn kết thúc G07.

**Phân biệt giáo lý:** trong Vi Diệu Pháp Theravāda, `sati` thuộc nhóm **tâm sở tịnh hảo**, khác khả năng chú ý/ghi nhớ thông thường; có thể tham khảo `Abhidhamma Studies` (Buddhist Publication Society) và `A Comprehensive Manual of Abhidhamma`. Việc **giới hạn tu tập của PC ma** là quyết định thiết kế dành cho tuyến nhân vật này, **không phải tuyên bố mọi chúng sinh thuộc cảnh giới peta tuyệt đối không thể có tâm thiện**. Các truyện `Petavatthu` có yếu tố tùy hỷ với phước hồi hướng. Phân loại `commentary` và `game_interpretation`, duyệt nội dung với người am hiểu Theravāda trước khi code/phát hành. Tài liệu tham khảo: https://www.bps.lk/olib/bp/bp439s_Karunadasa_Theravada-Abhidharma.pdf ; https://www.dhammatalks.org/suttas/KN/Khp/khp7.html .

## 3. Ghost-only map: “Lối nước khuất” và Bến Không Tiếng

**Đề xuất đồ thị theo góc nhìn (địa hình chi tiết chờ art/graybox):**

```text
PC người sống: Làng → Hang Vọng Tâm → ngưỡng sâu → Bến Không Tiếng — BỜ NỔI
                                                            ⇅ (chỉ vài landmark giao)
PC hồn ma: Rừng tre → SUỐI NHỎ → KHE ĐÁ KHUẤT → Bến Không Tiếng — BỜ CHÌM
                                                          ├─ giếng cạn
                                                          ├─ xóm không khói
                                                          └─ ba cột đá cũ
Nhà hoang → G01/G03 (khám phá, giúp bà cụ, **nghỉ tùy chọn**)
Gốc gạo / mộ cũ / bờ suối / Bờ Chìm → các điểm nghỉ khác theo sở thích
```

**Suối thật chảy xuôi** qua rễ tre, đá rêu, liên hệ hệ ao sen/bến sông cũ nếu địa hình hợp lý; kỳ ảo là **lối chỉ ma thấy ở khe đá**, không phải vết nước ngược. **G04 không yêu cầu vào nhà hoang trước**. Bất cứ PC ma nào cũng có thể chọn nghỉ ở nhiều điểm, không có default ghost house.

**Lưu ý:** đây là **logic truyện và hình ảnh, không phải tuyên bố địa lý giữa các cõi Phật giáo**. "Cùng một bến" là fantasy thiết kế; con người có thể tới qua hang, PC ma qua đường khuất mà không cần đèn. Về nguyên tắc, **chỉ khoảng 20–30% landmark/tên địa điểm chung**, còn phần trải nghiệm, câu chuyện, màu/âm thanh/đường đi **70–80% khác nhau** (tỷ lệ thiết kế thử, không áp đặt content).

| Góc nhìn | PC sống nhìn thấy | PC ma nhìn thấy |
|---|---|---|
| **Cửa vào** | khe đá, hồ hang, ngưỡng sâu, cần nguồn sáng hoặc cách đi riêng | khe suối rừng tre/đường bóng phía sau khe đá, theo tiếng mái chèo, không cần ngọn đèn người sống |
| **Bến** | bờ đá ẩm, thuyền mục, dấu bước và người đứng xa | cùng ba cột đá nhưng bến ngập ánh trăng lạnh, nhà không có bóng người sống, lời thì thầm của các vong |
| **Cột đá cũ** | thấy một vết khắc chưa hiểu | thấy dấu chữ/chuyện từ phía đối diện nhưng **thiếu văn cảnh của người sống** |
| **Nhà/bến phía xa** | chưa vào được do lối/hang | có thể tới giếng cạn hoặc xóm không khói qua đường khuất, cần tìm lời hẹn/nhân chứng |
| **Trở lại sau manh mối** | các ký hiệu trở nên hiểu được | một NPC vong kể thêm ý nghĩa của điều nghe được |

**Quan trọng:** PC ma **không được mở sẵn toàn bộ sự thật Hạnh → vợ Ông Tư** chỉ vì tới bến trước người sống. Ở Bến Không Tiếng, chỉ nghe chuyện về trận nước lớn, một chiếc thuyền, một đứa trẻ được chở qua hoặc sự có mặt của một người khác — **mảnh đúng nhưng chưa giải được kết**. Truyện bà Sáu phải giữ cú reveal có điều kiện ở mạch riêng. Sau đó nếu account có nhân vật sư/dân, **chính nhân vật ấy vẫn phải tự tìm chứng cứ**; người chơi ngoài đời có thể nhận ra landmark, nhưng hệ thống không tự ghi vào journal PC khác.

### 3.1. Đường vào hang cho PC ma

- Ghost có thể khám phá **cửa hang** và đi qua một số khe khuất **ngay từ đầu**, **không cần `den_nho`/Niệm/Định**.
- Ngưỡng sâu của ghost không phải bài test `sợ hãi + nguồn sáng` của người; thay bằng **"đường vang sai"**: lạc hướng do tiếng vọng ký ức hoặc tên người khác, cần nghe phân biệt âm thanh hoặc hỏi một vong dẫn đường.
- Có tối thiểu 2 lựa chọn qua ngưỡng: `Theo tiếng mái chèo` (nghe được tại khe suối rừng tre) hoặc `Nhờ người đưa đường` (đã gặp vong già ở bến). Một người thích đi dạo có thể thấy bờ ngoài ngay, không phải "xong 5 quest" mới được vào.
- Lối hồn ma và lối người chỉ giao ở khu **Cột đá cũ**, không copy nguyên map. Các vật phẩm người sống nhặt không tạo bản thể vật chất tương đương cho ghost; họ chỉ có thể ghi **dấu vị trí/ký ức**.

## 4. Playable story arcs và các quest cụ thể (mẫu để review)

### G01 — Đêm đầu, nhà không có ai (10 phút mở đầu; solo ghost)

**Nơi:** nghĩa địa → nhà hoang → cổng. **Ambient:** người làng truyền miệng nhà bỏ không đêm hay có tiếng gõ, khung cửa khép hờ. PC ma mới đặt tên dạo tự do, thử một cách hù nhẹ (tùy chọn) và nhận ra cửa nhà hoang không cản mình.

**Cảnh A:** PC đi ngang ngõ, Ông Tư treo đèn, con Vàng sủa. Bấm `Thử làm lá tre xào xạc` → Ông Tư: “Nó rụng lá thôi. Làm gì mà dữ vậy, Vàng?” Có dấu `ability:echo`, không phát thẻ thiện/bất thiện theo click.

**Cảnh B:** PC ma đến nhà hoang, bức tường có mảng sơn tróc; **đi xuyên qua vết nứt** tới sân sau. Tại đó có `vệt dấu bàn tay` chỉ PC ma thấy; ghi Sổ `discovery:abandoned_house_backroom`.

**Cảnh C (đã chốt trong Episode Pack 01):** thấy **chiếc túi kim chỉ của bà cụ giếng** kẹt dưới bậc thềm nhà bỏ trống, PC biết vị trí nhưng **không nhặt**. Bà cụ tự đi qua đó, từng đặt túi xuống lúc sửa quai thúng. Gợi `G03 — Chiếc túi kim chỉ của bà cụ`.

**Bỏ qua:** vẫn thoải mái đi ngắm gốc gạo và bến, không ép thử hù, không ép quest bắt buộc.

### G02 — Hương cơm chiều và tiếng hồi hướng (1–2 lần ghé)

**Nơi:** nghĩa địa/hiên tịnh thất. **Lời mở:** có mùi cơm nếp thoáng qua trong gió, nhưng PC ma không cầm được thứ gì. Chọn `Theo hương cơm` → thấy người sống đặt đồ cúng, sư già nhận cúng dường rồi hồi hướng khi phù hợp chuyện. PC ma chọn `Đứng nghe` hoặc `Bỏ đi`. Cảnh nghe có ánh ấm và câu nói từ sư: “Mong những ai hữu duyên được an.”

**Kết quả:** `ghost.heardDedication=true`, khám phá **việc bố thí/hồi hướng từ phía chúng sinh đang khổ**; không tự đạt Niết-bàn, không auto tái sinh. Nếu PC quay lại, sư có thể tụng thời kinh khác nhưng không spawn vô hạn vật phẩm/thẻ.

**Nhu cầu “kiếm cơm cúng”:** thiết kế thành mini route `nghe tin → tới mộ có dấu mới → nhận ra ai còn nhớ mình → nghe/dự phần hồi hướng`. **Không biến cơm vật chất thành item nhặt được**. Trò chơi có thể diễn tả “hương cơm, sự ấm áp” như hình tượng, phải gắn là giả tưởng, không khẳng định peta nào cũng nhận được lợi ích từ mọi đồ cúng.

### G03 — Chiếc túi kim chỉ của bà cụ: giúp người mà không chạm được (2–3 lần ghé)

**Chủ:** **bà cụ ở giếng** (`npc.granny`, người sống; **không phải** bà ngoại ngạ quỷ HG27 hay bà Sáu). **Mục tiêu:** bà tìm **chiếc túi kim chỉ** để vá lại quai thúng; PC ma thấy túi ở dưới bậc thềm nhà hoang nhưng không thể nhặt. Đây là câu chuyện đời thường trọn vẹn, **không bắt nối với bí mật Hạnh**.

1. **Thấy mà không thể lấy:** `discovery:lost_item_location` và `ghostKnowsItemSpot`. Không cần quest marker to; PC tự nghe bà cụ lẩm bẩm tìm túi.
2. **Thử thì thầm:** khi NPC đi qua, PC chọn `Lá dưới bậc…`; người nghe chỉ cảm thấy “Có ai nói gì không nhỉ?”, `npc.noticedHint`. Chọn hù quá mạnh có thể khiến NPC đi xa tạm thời, nhưng không khóa vĩnh viễn, có cách khắc phục.
3. **Báo mộng nếu không được nghe:** sau khi PC đã **biết vật gì đang mất và gặp người tìm vật**, đến lúc NPC ngủ có dấu `dreamAnchor`. PC chọn hình ảnh **bậc thềm với một chiếc lá** để hiện trong mộng, không gửi nguyên text giải đố. Sáng hôm sau NPC kiểm tra chỗ ấy.
4. **Thế giới đổi:** NPC nhặt lại vật, nói “Hóa ra nó nằm ở đây!”; PC ma thấy cảnh người đó giúp được người khác. Nếu chọn khiến NPC hoảng, hôm sau có đoạn xin lỗi gián tiếp hoặc chỉ dẫn lại, **không khóa**.
5. **Thưởng chính:** `discovery:unseen_help`, hậu cảnh bà cụ và mảnh chuyện nhân gian. **Thẻ thiện của PC ma là ngoại lệ rất hiếm**, chỉ xét một thẻ **Bi** nếu có đầy đủ câu chuyện về lòng muốn giúp và một lựa chọn có hệ quả; không tặng Bi/Không tham/Tùy hỷ hàng loạt, không auto rơi thẻ vì click gió.

**Đường bỏ qua:** sau vài ngày NPC hoặc người khác tự tìm ra; PC vẫn có thể nghe hậu chuyện. Truyện không cần thần linh xuất hiện để chỉ từng bước.

### G04 — Lối nước khuất (khám phá ghost-only, không yêu cầu xong G01)

**Nơi:** rừng tre → khe suối tự nhiên → khe đá khuất → **Bến Không Tiếng — Bờ Chìm**. Nước chảy xuôi; có đoạn nước vẫn chảy mà mất tiếng róc rách, chỉ PC ma nghe **tiếng mái chèo** ở khe đá. PC chủ động `Nhìn khe đá` / `Theo tiếng mái chèo` / `Đi tiếp`. **Không cần** nhà hoang, đèn hoặc thẻ của người sống.

- Có ba landmark để dạo: **giếng cạn**, **xóm không khói**, **ba cột đá cũ**. Không đứng ngay giữa nơi nguy hiểm hoặc bắt gặp NPC liên tục.
- Một người đưa đò (vong NPC mới, chưa đặt tên canon) đôi khi xuất hiện theo story state, không làm NPC luôn đứng đó. Hỏi: “Có hôm nước lớn, tôi chở nhiều người. Chẳng nhớ mặt, chỉ nhớ có đứa trẻ ôm chiếc nón.”
- Người chơi chọn **`Hỏi thêm về ngày nước lớn`** → lore fragment `flood_ferry_passenger`, nhưng chưa biết Hạnh là ai, ai còn sống, ai vợ Ông Tư.
- Tại cột đá cũ, thấy vết khắc bên mặt sau mà người sống không nhìn rõ. Ghi `discovery:three_pillars_ghostside`.

**Quay lại:** mặt nước thay ánh sáng hoặc người đưa đò chưa tới; một dấu nhắc nhỏ “có thể trở lại lúc nước lặng”, không random hiếm vô lý.

### G05 — Người chỉ nhớ một nửa (gợi bà Sáu; độc lập tuyến bà Sáu)

**Nơi:** gốc gạo → bến. **Chủ:** `npc.ba_sau`. Bà có ký ức riêng về Hạnh; PC ma không thành bà. Sau G04 PC thấy dấu đò, có thể tới gốc gạo và chủ động hỏi bà:

> **PC:** “Bà có nghe về bến nước năm lũ không?”
>
> **Bà Sáu:** “Có chứ. Nhưng từ hôm đó, bà chỉ nhớ tiếng nước. Không nhớ ai đưa ai qua.”

- `Kể bà nghe chuyện người đưa đò` → bà lắng nghe, thêm **một câu hỏi** về bến; bà không lập tức “siêu thoát”, không tiết lộ Hạnh là vợ Ông Tư.
- `Giữ lại chuyện này` → PC chỉ ghi vào Sổ, không bắt tiết lộ.
- `Đi tiếp` → được quay lại.

**Điều tiết spoiler:** ghost có thể biết *đã có đứa trẻ qua bến*, nhưng **không biết cô bé giờ là ai**. Mảnh nhân gian của ông Tư/mộ/hàng xóm mới đủ ghép khác biệt. Kết nối không bắt mọi vong bến là họ hàng hoặc tiền kiếp bà Sáu.

### G06 — Đêm sư tu bên mộ, lời hồi hướng (mạch ngắn có thể dẫn ending)

**Nơi:** nghĩa địa → tịnh thất nghe từ ngoài. **Chủ:** Sư Tịnh hoặc sư già theo lịch đã duyệt; không bắt PC ma có quan hệ cũ với nhà sư.

**Ambient:** đêm trăng, một sư đang ngồi tu yên giữa mộ. PC ma có thể `Làm lá xào xạc để thử hù` → sư chỉ liếc, lại tiếp tục ngồi; `Ngồi nghe` → tiếng tụng/lời hồi hướng về cuối đêm; `Đi chơi tiếp` → không bị phạt.

**Cảnh chủ động:** khi sư hồi hướng cho các chúng sinh hữu duyên, PC có thể chọn `Nghe hết` / `Nhớ một điều mình chưa làm` / `Để đêm khác`. Một NPC vong khác có thể chỉ: “Có khi có người nhớ, nhưng mình chưa dám tin.” Đây là **thoại sáng tác**, không phải trích kinh.

**Phần thưởng:** một tín hiệu về **ending tự chọn**, `receivedDedicationStory=true`, một dấu Sổ. **Không tự động kết thúc nhân vật** chỉ vì sư tụng kinh, đếm ngày, hay vì PC đạt điểm tâm. Khi người chơi muốn kết thúc, mở `G07 — Đêm cuối`.

### G07 — Đêm cuối của một bóng người (ending **tự nguyện, có thể sớm**)

**Điều kiện truyện nhẹ:** PC đã (a) chủ động ở lại nghe một lần hồi hướng của NPC sư (MVP; hồi hướng từ PC thật là mở rộng sau), và (b) trải qua **một việc giúp người có hệ quả thực**: **G01 giúp ông Tư nhận ra/di chuyển chiếc đèn nguy hiểm** *hoặc* **G03 giúp bà cụ tìm túi**. Về sau G05 hoặc một hành động có nghĩa/ký ức riêng đủ chiều sâu có thể mở thêm đường tương đương. **Không bắt làm G03, không bắt hoàn thành G01 hù người, không yêu cầu bến hay cày điểm tâm**. Cho `Tiếp tục khám phá` bất cứ lúc nào; hồi hướng chỉ mở **cơ hội chọn ending**, không tự bảo đảm tái sinh.

Khi muốn kết, PC thấy ánh sáng đầu sáng, nghe một câu: “Con đường phía trước có thể không còn là con đường này.” PC chọn **`Khép lại hành trình`** hoặc **`Tôi vẫn muốn đi thêm`**.

**Ending candidates (là 3 kết truyện hư cấu, không phải PC chọn cõi như mua hàng):**

1. **G07-H — Một mùa sáng ở làng:** đoạn hồi tưởng ánh ban mai, một gia đình chào đón một đứa trẻ. Chỉ nói **hành trình PC ma khép và câu chuyện gợi tái sinh về người**; không tiếp tục chơi ngay thành người đó, không xác nhận đồng nhất với NPC hiện có.
2. **G07-T — Lá sáng trên cây gạo:** một vị thiên nương cây cất lời trong cảnh kết, không phải PC được điều khiển `treegod`. Nêu rõ đây là **kết tái sinh vào hàng chư thiên/thọ thần trong hư cấu**, không phải upgrade kỹ năng avatar.
3. **G07-D — Phía trời có tiếng chuông:** ánh mây, tiếng chuông xa, một cảnh trời thoáng hiện; kết gợi tái sinh cõi chư thiên. **Không mở gameplay Thiên giới ở phiên bản này.**

**Không có công thức:** `thẻ tâm X >= 70 → deva` là sai tinh thần. Ending căn cứ các **mảnh chuyện của chính PC**, lựa chọn khám phá/chăm sóc và cách kể đã được biên tập; một kết chung “được an và bước sang một cuộc đời khác” là phương án nếu chưa đủ chất liệu để viết ba ending sâu. *Không khẳng định làm một việc tốt hoặc nghe một lần hồi hướng bảo đảm tái sinh cõi nào theo Phật học.*

**Archive:** sau khi người chơi xác nhận ending, `character.status=story_completed`, lưu journal/thẻ/ảnh cảnh và `endingId`. Avatar này **không tiếp tục chương ma** (không nhiệm vụ, thẻ, mốc hay khám phá mới) nhưng **vẫn đi dạo được ở những nơi đã khám phá** ([Journey Memory §0.5](journey-memory-and-return-ux.md)); người chơi có thể xem Sổ, đọc lại cảnh và tạo PC mới. Không delete nhân vật hoặc thay `role=ghost` thành `role=monk/deva` trong save. **Cảnh xác nhận hai bước** vì đây là ending không thể rollback tùy tiện.

## 5. Một vòng chơi mẫu 20–30 phút cho PC ma

| Giai đoạn | Người chơi làm được | Kết quả làm họ muốn quay lại |
|---|---|---|
| 0–5 phút | tự đặt tên; nghe tiếng lá gạo; thử hù Ông Tư/con Vàng hoặc ngắm cảnh | biết mình **khác người sống** |
| 5–10 phút | vào nhà hoang qua lối khuất, nhìn thấy món đồ người sống bỏ quên | có một **vấn đề chỉ mình nhìn thấy** |
| 10–15 phút | thì thầm/báo mộng để người sống tìm đồ | thấy việc tốt thật sự xảy ra dù không cầm được đồ |
| 15–20 phút | theo tiếng mái chèo ở khe suối rừng tre tới Bờ Chìm | **thế giới ma lớn hơn nghĩa địa**, không cần đi nhà hoang |
| 20–30 phút | gặp dấu chuyện năm lũ, thấy người sư ngồi tu đêm, nghe một đoạn hồi hướng | có bí ẩn bà Sáu và **cách kết nhân vật về sau** |

**Đây là nhịp cơ hội, không bắt buộc thứ tự/tốc độ.** Nếu người chơi chỉ muốn ngắm nghĩa địa, họ có thể nghe tiếng chuông, nhìn trăng, dạo bờ bến, không popup.

## 6. Art direction và asset MVP

- **Hai lớp cùng thế giới:** Nhân gian ngày êm/ánh vàng; PC ma có vùng mát xanh bạc, nhưng không làm toàn bộ map u ám. Ban đầu chỉ dùng shader/overlay/sprite/âm thanh nhẹ trên nền Canvas có sẵn.
- **Hù NPC có hiệu quả thật:** ông Tư hoặc người đi đường có thể run giọng/chạy về hiên và nhớ chuyện; sư có thể sợ ít hơn. **Không jumpscare mạnh**: đom đóm, bụi trăng, bóng nước, tiếng gõ/đốm lạnh đủ để tạo không khí; không dùng flash/âm lượng gây khó chịu.
- **Ghost UI:** icon `Lắng nghe`, `Thì thầm`, `Tạo dấu hiệu`, `Mộng`, `Theo dấu`, `Đi tiếp`; không có `Nhặt vật`/inventory vật chất hoặc `Dâng cơm` như người sống.
- **MVP map:** dùng lại các địa điểm và cảnh sẵn có làm lối dẫn, nhưng **nhà bỏ trống chưa phải khu đi lại trong `World.PLACES` của `develop`** (đừng nhầm các ô `ruin` với một nhà hoang có interior). Khi coding cần **graybox một gian nhà nhỏ** và một **Bờ Chìm** mới; 1 cột đá giao giữa các góc nhìn; **bà cụ giếng hiện có** là NPC tìm túi, nên không cần thêm một NPC người sống chỉ cho G03. Chưa cần dựng cả cõi dưới.
- **Một hành động ma chỉ tác động qua tín hiệu:** âm thanh/lời nhắc/mộng; NPC **có thể sợ thật và tự thay đổi hành vi**, nhưng PC ma không kéo người, mở cửa hay nhặt đồ. **Nghỉ tùy chọn** ở nhà hoang, mộ, gốc gạo, khe suối hoặc Bờ Chìm; dùng Sổ Hành Trình/hồi tưởng từ sự kiện đã xảy ra.

## 7. Ranh giới Phật học và nguồn cần duyệt

- `Khp 7 / Petavatthu 1.5 (Tirokuḍḍa)` có nội dung về cúng dường/hồi hướng và lợi ích cho chúng sinh đã khuất trong bối cảnh tương ứng; **không khẳng định mọi peta đều ăn cơm cúng trực tiếp hoặc chỉ cần nghe một câu là siêu thoát**. Tham khảo: https://www.dhammatalks.org/suttas/KN/Khp/khp7.html
- Cảnh **ma thì thầm trong mơ, xuyên khe, thấy bờ chìm** là **giả tưởng tự định nghĩa**, không phải quyền năng phổ quát của ngạ quỷ trong kinh Nikāya.
- **Rời cảnh ngạ quỷ/tái sinh** không đồng nhất với **đắc giải thoát/Niết-bàn**. Dùng “khép một kiếp sống”, “được an và tái sinh” trong ending, có chú thích nguồn/cảnh giả tưởng.
- **Thọ thần** trong một số chuyện/chú giải là một loại `rukkhadevatā` (thiên ở cây); kết thọ thần là một dạng tái sinh làm deva trong hư cấu, **không phải một “loài thứ ba” cộng ngang mọi deva**. Duyệt giáo thọ trước.
- Không dùng thang điểm `good/bad karma` có vẻ như mô hình nghiệp báo chính xác hoặc đảm bảo kết quả tái sinh dựa trên lựa chọn nhỏ.

## 8. Kiểm thử khi chuyển thành PR code sau

- [ ] PC ma tạo tên riêng, không bị gọi là “bà Sáu”, không tự có con Hạnh/tiền kiếp NPC.
- [ ] Có hù NPC khiến họ **sợ thật**, nhà sư có phản ứng khác; không ép hù, không tự gán thẻ Sân cho ma chỉ vì NPC sợ.
- [ ] PC ma không nhặt, cầm hoặc dâng vật chất; chỉ **thấy vị trí**, khiến NPC người sống tự quyết định nhặt đồ.
- [ ] Thì thầm có phản ứng khác báo mộng, không điều khiển NPC bất hợp lý; hint đủ để hoàn thành, không random 1% xác suất.
- [ ] Ghost có thể **tùy chọn vào/nghỉ ở nhà hoang**, hoặc độc lập tìm **khe suối rừng tre để tới Bờ Chìm** mà không cần điều kiện `cave` của người sống; không gating quá sâu.
- [ ] Có ít nhất một cảnh chung `Cột đá cũ` giữa human route và ghost route, nhưng nội dung/ánh sáng/đường đi khác biệt.
- [ ] Bà Sáu vẫn có cốt truyện riêng; ghost nghe manh mối về nước lớn, không được tiết lộ tự động Hạnh là vợ ông Tư.
- [ ] Ma có thể nghe hồi hướng từ **NPC sư hoặc PC sư/dân khác có sự kiện hợp lệ**, NPC fallback; không auto ending, không spam phần thưởng.
- [ ] Đã đủ mạch truyện nhẹ thì **có ending tự nguyện sớm**, archive đọc lại, không xóa thẻ/progress và không thể dùng save cũ để farm phần thưởng.
- [ ] Người có nhiều PC không bị auto bật lore/codex/quest/reveal của PC này sang PC khác.
- [ ] Có ít nhất 5–10 phút chỉ đi dạo ngắm trăng/gió/nước, không tự mở sheet; Sổ Hành Trình/hồi tưởng có thể xem chủ động, không bắt về nhà hoang để nghỉ hoặc save.
- [ ] Cơ chế nào gắn từ kinh phải có `loreBasis/sourceRefs`; giấc mơ/thì thầm/tái sinh ấn định là fictional.

## 9. Thứ tự triển khai MVP vai ma (Approved design, 09-11-2026)

| Thứ tự | Nội dung | Mục tiêu |
|---|---|---|
| 1 | G01 hù Ông Tư, NPC sợ thật, thẻ bất thiện theo động cơ | Chứng minh vai ma vui và độc lập |
| 2 | G03 giúp bà cụ tìm túi bằng thì thầm hoặc giấc mơ | Ma giúp người theo cách riêng |
| 3 | Một cảnh ngắn **NPC sư hồi hướng** + G07 kết thúc tùy chọn, archive nhân vật | Một câu chuyện ngắn nhưng trọn vẹn |
| 4 | G04 Bờ Chìm, người giữ bến, G05 bà Sáu (sau lát cắt hang) | Mở rộng không gian và bí ẩn |
| 5 | Nghe hồi hướng từ PC sư/dân thật, tương tác ma với người chơi thật (cần đồng ý riêng) | Giao thoa khi multiplayer đủ ổn định |

- **G07 có hai đường ngay trong MVP:** `G01.helpedWithLamp` **hoặc** `G03.helpedGranny`, **và** một lần chủ động nghe hồi hướng NPC (nhánh G06-short). `helpedWithLamp` chỉ ghi khi **Ông Tư thật sự nhận và dời đèn**, không chỉ vì PC bấm một câu. **Không cần G03**, hù NPC không bắt buộc và người chơi vẫn được đi khám phá. Không phải tính toán nghiệp báo hay đảm bảo tái sinh.
- **Bờ Chìm không bị khóa bằng kết quả tu tập.** Dời sang sau chỉ vì khối lượng map và asset.
- Nhân vật đã kết thúc: truyện read-only nhưng còn **Chế độ đi dạo** ở nơi đã khám phá, không có phía xã hội (xem [Journey Memory §0.5](journey-memory-and-return-ux.md)).
- Mọi sự kiện của G0x dùng chung **event log và projection/checkpoint** của [Sổ Hành Trình](journey-memory-and-return-ux.md); có thể dùng `G01.helpedWithLamp`/`G03.helpedGranny` như **state dẫn xuất**, không tạo nguồn sự thật thứ hai hoặc event store riêng.
