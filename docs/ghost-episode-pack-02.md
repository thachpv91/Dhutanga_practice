# Ghost Episode Pack 02 — Hương cơm, lời hẹn và đêm cuối (G02, G05, G06, G07)

> **Story design v0.1, CHƯA code.** Tiếp nối [Ghost Episode Pack 01](ghost-episode-pack-01.md) và các quyết định [hù dọa/thẻ tâm/hồi hướng giữa người chơi](ghost-mischief-cards-and-shared-dedication.md), [Sổ Hành Trình/hồi tưởng](journey-memory-and-return-ux.md). Các tình tiết có tính siêu nhiên là **game fiction**. Phân biệt PC ma, NPC bà ngoại ngạ quỷ (HG27), NPC bà Sáu bán xôi và bà cụ ở giếng người sống. Không biến **nghe hồi hướng một lần → chắc chắn tái sinh** thành khẳng định Phật học.
>
> **Giọng kể:** những câu ngắn vừa đủ để người chơi tò mò, khoảng lặng và cảnh đẹp tự kể. Ba mạch Bến Không Tiếng/Hạnh/HG27 có quan hệ chủ đề, **không buộc cùng một nhân vật hoặc cùng nguyên nhân**.

## 0. Xương sống “Hai điều hồn ma không làm được”

1. **Không thể cầm vật** → G03 giúp người bằng lời thì thầm/giấc mơ, nhận ra mình vẫn có ích.
2. **Không thể bảo người sống nghe mình theo ý muốn** → G05 chỉ có thể mang theo manh mối, không tự sửa quá khứ của bà Sáu.
3. **Không thể quyết định số phận bằng một nút phép thuật** → G06 được nghe hồi hướng và G07 lựa chọn khép lại câu chuyện **trong hệ game**, không phải cam kết nghiệp báo hay đắc quả.

Từ cảm giác nghịch ngợm G01 tới cảm xúc ấm của G07, PC ma **không nhất thiết càng chơi càng buồn**. Người chơi được đi ngắm trăng, vui khi NPC tìm đồ, nghe chuyện, thích thú khám phá thế giới khuất.

## 1. G02 — Hương cơm chiều

**Tình huống:** ở nghĩa địa hoặc ngoài tịnh thất, PC ma thấy một làn khói thơm và ánh đèn nhỏ dù không ai nấu ngay cạnh mình. Chỗ người sống cúng dường có dấu hiệu nhưng **không có đồ ăn để PC cầm vào inventory**.

### G02-S01 — Hương ở đâu?

> Có mùi cơm mới chín. Bạn đi theo mùi ấy.
>
> Ở phía kia bức tường, một người đang đặt bát cơm xuống trước vị sư.

- `Nhìn người mang cơm` → thấy sự chăm sóc của người sống; `discovery:offering_seen_from_shadow`.
- `Thử cầm bát` → chỉ một lần phản hồi ngắn: “Bàn tay đi xuyên qua hơi ấm.”; từ đó UI đổi thành `Quan sát`/ `Lắng nghe`.
- `Đi tiếp` → không bị phạt hoặc ghi chuyện chưa bắt đầu.

**Điều không nên kể:** “Bà ngoại HG27 đã siêu thoát nên PC ma cũng sẽ được như thế.” Cảnh G02 là trải nghiệm riêng, không spam reward.

### G02-S02 — Người sống vẫn nhớ

Đến lúc vị sư nói lời hồi hướng theo diễn tiến câu chuyện, tiếng côn trùng im đi một chút. PC ma không cần tu tập để có quyền nghe.

> **Sư:** “Nguyện điều lành này đến được những ai hữu duyên.”
>
> **PC nghĩ:** “Hóa ra có những lời dành cho người không đứng ở đây.”

- `Ở lại nghe hết` → `dedicationHeardOnce=true`, **chỉ lưu việc đã nghe và manh mối**, không nhận Niệm/Định hay thẻ thiện mặc định.
- `Tự hỏi ai đang được nhớ đến` → mở một mục Sổ về hồi hướng, không bật bài giảng; **chưa khẳng định chính PC được lợi ích cụ thể**.
- `Đi sang gốc gạo` → PC tự do khám phá.

**Sau đó:** nếu PC đã gặp một vong khác, có thể thấy họ lắng nghe, nhưng **không tự tan biến mọi bóng ma**. G06 là sự kiện hồi hướng có chiều sâu hơn sau một đêm tu của sư.

## 2. G05 — Bà Sáu chỉ nhớ một nửa

**Vai trò:** một tuyến NPC mở từ G04 Bờ Chìm hoặc từ gốc gạo nếu người chơi chưa vào bến. Bà Sáu **không phải PC**, PC không biết ngay bà có con Hạnh hoặc Hạnh lớn lên thành ai.

### G05-S01 — Người đứng nhìn con đường

**Ambient:** đêm trăng, bóng người đứng dưới cây gạo. Từ xa có tiếng guốc người sống đi qua, bà Sáu quay lại rồi ngừng.

**Chạm `Đến hỏi chuyện`:**

> **PC:** “Bà đang chờ ai ạ?”
>
> **Bà Sáu:** “Một người lâu lắm rồi chưa thấy.”
>
> **PC:** “Bà còn nhớ người ấy đi hướng nào không?”
>
> **Bà Sáu:** “Bà nhớ tiếng nước. Mấy chuyện khác cứ lẫn đi.”

- `Hỏi về tiếng nước` → `baSau.knowsWaterQuestion=true`; bà kể một cảnh ngắn, không có tên Hạnh trong lượt đầu.
- `Kể bà nghe mình đã thấy bến` (chỉ khi PC đã ở G04) → bà ngạc nhiên, nói “Vẫn còn bến ấy sao?”, không tự giải toàn bộ câu chuyện.
- `Đi tiếp` → một lúc sau bà quay lại nhìn đường; không bám PC như NPC quest companion.

### G05-S02 — Một lời kể có thể sai

PC quay lại **G04 cột đá** và hỏi người giữ bến về đêm nước lớn. Ông nói đã nghe **tiếng trẻ con khóc**, nhưng không nhìn rõ mặt người lên thuyền. PC có thể ghi:

- `Chỉ ghi điều ông thật sự thấy` → Sổ ghi “Ông nghe tiếng trẻ, không thấy rõ ai qua bờ.”
- `Thử hỏi lại về điều ông không nhớ` → ông nói “Đêm ấy ai cũng la. Tôi không dám chắc lời mình.”
- `Tin ngay rằng đó là người bà Sáu chờ` → game cho phép người chơi **nghi ngờ như một giả thuyết** trong Sổ, nhưng **không biến thành factual quest state**.

**Twist mềm:** “Một mảnh ký ức rất cảm động vẫn có thể thiếu hoặc sai.” Đây không phải lừa người chơi vô cớ, mà là động lực tìm chứng cứ từ **phía người sống** khi chơi nhân vật khác.

### G05-S03 — Bà Sáu phản ứng với mảnh manh mối

> **PC:** “Có người nói từng nghe tiếng một đứa trẻ ở bến.”
>
> Bà Sáu im lặng, rồi hỏi:
>
> “Đứa trẻ có lên được bờ không?”

- `Cháu chưa biết` → **lời đáp chuẩn, có ý nghĩa**, bà nói “Ừ. Vậy đừng vội bảo bà.”; `baSau.trustsPCQuestion=true`.
- `Kể đúng điều mình nghe` → bà có thêm một góc nhìn, nhưng không tự nhận đó là Hạnh.
- `Ở lại cạnh bà một lát` → cảnh ấm, không có thưởng thẻ bắt buộc.

**Kết quả bền:** bà Sáu trong lần sau có một câu nói khác về bến; PC biết mình chưa có đủ thông tin. Tại một thời điểm khác, `story.js` reveal về **Hạnh sống sót và trở thành vợ ông Tư** mới được mở bằng một tuyến chứng cứ của PC, **không phải tự nhận nhờ vào G04**.

## 3. G06 — Đêm sư ngồi bên ngôi mộ

**Vai trò:** vừa cho phép tinh nghịch, vừa có cơ hội chạm một cảm xúc thật. Không sử dụng lời kinh như “điều kiện học bài”.

### G06-S01 — Thử xem sư có sợ không?

**Ambient:** sư đang ngồi yên gần mộ dưới ánh trăng; là Sư Tịnh hoặc sư già theo lịch, **không tự gán mọi sư thành cùng một NPC**.

> Gió luồn qua hàng cỏ. Vị sư sửa lại mép y, rồi ngồi yên.
>
> Bạn đứng ngay cạnh. Ông không nhìn thấy bạn.

- `Làm lá xào xạc` → sư hơi giật mình, mở mắt và nhìn về phía tiếng động, rồi trở về tư thế. “Gió mạnh thật.” **Có phản ứng sợ thật nhưng nhẹ** hơn ông Tư; không coi mọi vị sư miễn nhiễm với sợ.
- `Cho một bóng người lướt qua` → sư có thể khựng lại một lúc, một tay giữ mép y, rồi quan sát và bình tĩnh lại; không làm sư đứng im như tượng hoặc biến thành cutscene dạy đạo lý. **Hù người chơi thật cần opt-in riêng**, không tự gán thẻ bất thiện chỉ vì sư giật mình.
- `Đứng nghe tiếng thở` → cảnh tĩnh, không thẻ tự động.
- `Đi chơi chỗ khác` → sư vẫn tiếp tục đêm tu.

### G06-S02 — Một lời hồi hướng không dành riêng ai

Sau đêm tu, nếu PC chủ động quay về hoặc tình cờ ở gần, sư nói một lời hồi hướng ngắn. **Không bắt PC đứng chờ 30 phút thật.**

> **Sư:** “Xin chia sẻ điều lành này đến những ai còn đang chịu khổ.”
>
> Bạn nghe một lúc. Tiếng gió ngoài cổng nghĩa địa vẫn vậy, nhưng đêm bớt lạnh.

- `Nghe đến cuối` → `G06.heardFullDedication=true`, mở một câu trong Sổ `Lời hồi hướng bên mộ`; **nghe không tự phát thẻ Niệm/Định hoặc chứng nhận đã tu tập**.
- `Nghĩ về bà Sáu / bà ngoại` → nếu PC từng gặp NPC đó, mở **một câu nhớ chuyện**. Không biến PC thành họ, không làm bà Sáu tự rời cảnh giới.
- `Ở lại nghe tiếng dế` → ambient có thưởng khung cảnh.
- `Đi tiếp` → không mất đường khám phá.

**Sự kiện hồi hướng** được ghi lại dù PC không chọn kết thúc kiếp ma; nó **không auto giải thoát**. Khi PC đã có một mối duyên riêng hoặc từng giúp người, G07 có thể hiển thị một lời mời **tự chọn**, không phải màn ép đi.

**Nhánh gặp người chơi khác (thiết kế tương lai, không phải code đã chạy):** nếu PC ma tình cờ ở gần một **PC sư** vừa tự nguyện chọn `Hồi hướng` sau thiền, hoặc **PC người dân** sau khi bố thí, hiện một ambient nhỏ: “Ngoài tường có người đang hồi hướng.” PC ma chọn `Đứng nghe` → lưu `heardDedication(source=player,eventId)` khi server xác nhận sự kiện; `Đi tiếp` → bỏ qua. **Không parse chat tự do, không tự nhận thẻ hoặc tái sinh**, không tiết lộ danh tính/địa điểm người nghe; nếu không có người chơi thật thì lịch NPC sư vẫn cho truyện tiếp tục. Chi tiết consent/rate-limit trong [Shared Dedication](ghost-mischief-cards-and-shared-dedication.md).

## 4. G07 — Đêm cuối của một bóng người (kết sớm hoặc tiếp tục)

### G07-S01 — Một cơ hội được an, không phải phán xét điểm tâm

**Điều kiện MVP:** PC đã **chủ động ở lại nghe** một lần hồi hướng của NPC sư (`G06.heardFullDedication`) **và** có một hành động giúp người thật sự có kết quả: **`G01.helpedWithLamp`** (PC gợi ý, chính ông Tư xử lý đèn) **hoặc** **`G03.helpedGranny`** (PC gợi, bà cụ tự tìm được túi). Lựa chọn G01 **không đòi phải hù trước**, và hành động G03 không bắt buộc nếu đã giúp ông Tư. Sau MVP có thể thay bằng một nhánh giúp người có ý nghĩa khác; `G05.metBaSauMeaningfully` chỉ nên xét sau khi G05 có câu chuyện/hệ quả đủ sâu, không nhận tự động vì đã gặp bà. Nếu thiếu điều kiện, vẫn thấy ánh sáng sớm và có thể tiếp tục khám phá; **không auto ending**, không bắt tới Bến Không Tiếng, không tích điểm thiện.

> Phía trên tán gạo, trời bắt đầu sáng.
>
> Có một khoảng lặng rất dễ chịu. Bạn nghĩ: “Mình còn muốn đi đâu nữa không?”

- `Mình vẫn còn muốn khám phá` → quay lại map, tiếp tục toàn bộ G01–G06; có thể khép vào một lần khác, không phạt.
- `Mình đã sẵn sàng khép chuyện này` → màn xác nhận **có nói rõ câu chuyện của PC này sẽ khép lại** (vẫn đi dạo được ở nơi đã khám phá, không nhận nhiệm vụ hay thẻ mới).

### G07-S02 — Ending chung MVP, ba gợi ý epilogue cho tương lai

**Ưu tiên viết trọn vẹn một ending chung trước**, không giả vờ người chơi chọn cõi tái sinh từ menu:

> Bóng bạn mỏng dần giữa nắng sớm.
>
> Một tiếng chuông từ tịnh thất vọng tới. Phía trước là một điều chưa biết.
>
> Đêm cũ đã khép. Lời đã nghe và việc đã làm vẫn được giữ trong câu chuyện này.

**Epilogue biến thể (chỉ khi có kịch bản đủ hợp lý và được duyệt):**
- **Người:** cảnh một gia đình đón em bé mới sinh ở làng, không gán em bé là NPC trẻ nào đang có.
- **Thọ thần:** gốc gạo đón một điểm sáng mới; không tự khẳng định PC là **thọ thần đang có**.
- **Chư thiên:** xa xa có mây sáng và tiếng chuông; không có gameplay avatar trời.

Các ending **không dựa công thức** “thẻ tâm X → được chọn deva”, không bảo đảm tái sinh thật theo Phật học và không đồng nghĩa Niết-bàn. Nếu chưa duyệt được các biến thể, ending chung là lựa chọn an toàn và vẫn trọn cảm xúc.

### G07-S03 — Kết thúc không đồng nghĩa mất nhân vật

**Sau xác nhận:** status nhân vật chuyển `story_completed`; vẫn giữ hồ sơ, ảnh cảnh, thẻ, Sổ, dấu đã giúp. Không xóa để tạo lại một avatar ma rồi farm thẻ. Màn chọn nhân vật thể hiện **“Chuyện đã khép”**, có thể mở nhật ký, không vào map như đang chơi. PC khác trên cùng account không được tự nhận lore hoặc thẻ từ PC này.

**Không phải tính năng đã code:** cần migration và transaction an toàn trước khi cho người chơi kết thúc nhân vật thật.

## 5. Chúng ta tạo bất ngờ bằng những chi tiết nhỏ, không phải mọi người đều có bí mật lớn

| Chi tiết xuất hiện sớm | Có ý nghĩa ngay | Có thể trở lại về sau | Không nên ép |
|---|---|---|---|
| Con Vàng sủa khi PC ma làm lá rung | một trò nghịch vui | Ông Tư kể lời đồn ở ngõ trong PC dân | con Vàng là “sứ giả cõi dưới” |
| Túi kim chỉ bà cụ | một việc tốt trọn vẹn | bà ngồi vá quai thúng; có câu chuyện mới | túi là chìa khóa giải cứu Hạnh |
| Khe suối rừng tre và tiếng mái chèo | một nơi đẹp để dừng nghe, chỉ ma thấy lối khuất sau khe đá | dẫn tới Bờ Chìm, trong khi PC sống có lối Bờ Nổi qua hang | nhà hoang bắt buộc là cửa xuống âm giới hoặc tất cả NPC từng sống ở đó |
| Ba cột đá | điểm giao thị giác | PC sống bất ngờ nhìn thấy từ phía khác | mọi manh mối của ghost tự chuyển account |
| Tiếng trẻ trên bến năm lũ | câu hỏi bí ẩn | một mảnh khi tìm Hạnh/bà Sáu | người giữ đò lập tức kể Hạnh là vợ Ông Tư |
| Lời sư hồi hướng | người chơi ma có một đêm ấm | mở cơ hội kết truyện hoặc một câu Sổ | buộc mọi ma cùng lúc siêu thoát |
| Gốc gạo | luôn có cảnh đẹp | bà Sáu/thọ thần/ending kết nối theo duyên | mọi câu chuyện đều phải xuất phát từ gốc cây |

## 6. Bản đồ thông tin bí mật — tác giả biết, người chơi chưa biết

**Bí mật CANON đã có trong `public/story.js`:** Hạnh sống sót, lớn lên nhờ dân làng, trở thành vợ ông Tư; mỗi năm mang xôi về tưởng nhớ mẹ bà Sáu. Trong kịch bản PC-centric, không phát sẵn toàn bộ qua lời người giữ đò hoặc một postcard của PC ma.

| Tình huống | PC ma có thể biết | PC sống có thể biết | Chỉ tiết lộ khi chủ động ghép đủ |
|---|---|---|---|
| G01 | ngõ làng có Ông Tư/con Vàng và nhà hoang | có ông Tư và một ngôi nhà cũ | không có bí mật bà Sáu |
| G03 | bà cụ làm rơi túi và tự tìm được | bà cụ từng nhờ người giúp, có thúng được vá | không cố dán vào tuyến Hạnh |
| G04 | có tiếng trẻ ở bến năm lũ; mặt sau cột đá | mặt trước cột đá, chuyện người từng đi qua hang | danh tính/số phận người ở bến |
| G05 | bà Sáu nhớ tiếng nước nhưng thiếu chứng cứ | người sống có thể hỏi chuyện hàng xóm và đồ vật | Hạnh là ai hiện nay |
| G06 | sư hồi hướng, PC ma có lựa chọn phản ứng riêng | sư tu đêm, người dân có thể dâng vật đúng vai | hồi hướng không phải bật tất cả spoiler |
| G07 | PC ma chọn khép đời mình | PC sống có hành trình mới | không tự nhập ký ức của ending vào PC khác |

**Không cần bảo đảm người chơi thật không đoán được bí mật**; nhiệm vụ là khiến từng vai vẫn hấp dẫn, có sự thật chưa được ghép hoàn chỉnh và không đưa reveal từ save A sang B.

## 7. Các kiểm thử biên kịch trước khi code

- [ ] G02 xem cảnh cúng dường **không cho ghost nhặt/ăn đồ vật vật lý**, cũng không auto được an/tái sinh.
- [ ] G05 ghép Hạnh không lộ danh tính chỉ bằng một đoạn nghe ferryman; lời kể cũ có thể không chắc và được ghi như giả thuyết.
- [ ] G06 NPC sư phản ứng tự nhiên khi bị hù (thường ít sợ hơn người dân), không biến thành tượng hoặc bài giảng; hù NPC có thể gợi thẻ bất thiện **theo ý PC**, không theo nỗi sợ của NPC.
- [ ] G07 có nút ở lại khám phá, không ép ending; **G01 giúp ông Tư xử lý đèn hoặc G03 giúp bà** là hai đường MVP; sau khi chủ động nghe hồi hướng NPC vẫn được chọn `Tiếp tục`; không yêu cầu G04/G05.
- [ ] Ending đã xác nhận không xóa nhân vật/thẻ/Sổ, không biến PC ma thành PC trẻ hay thọ thần để tiếp tục gameplay.
- [ ] Ma có thể **tình cờ nghe hồi hướng từ PC sư/dân khác** theo event đã xác thực và có NPC fallback, không auto ending hoặc farm thẻ.
- [ ] Mạch G04 và ký ức liên quan đến **suối rừng tre**, không dùng vết nước ngược nhà hoang. Nhà hoang chỉ là điểm nghỉ tùy chọn.
- [ ] Ở mỗi episode có cảnh đẹp hoặc một câu thoại đáng nhớ ngay cả khi người chơi không nhận nhiệm vụ.
- [ ] Người chơi nhiều PC không có Sổ/quest được tự điền từ PC khác.
- [ ] Các kết tái sinh/mộng/hồn ma qua vách là nội dung sáng tác có nhãn, không khẳng định pháp lý/tôn giáo hoặc nghiệp báo máy móc.
