# Nhân gian — Playable Narrative Scenarios v0.4 · PC tự tạo

> **Đang viết kịch bản trước khi dựng:** tài liệu dành cho narrative designer, developer và artist; **CHƯA có các scene này trong gameplay**. Phần đã có trong code `develop` là tuyến mở đầu ba vai, đêm tiếp theo/trăng/mưa phùn, thọ thần, bé Na, bà Sáu, ông Tư, chó cắn, giếng, may y 5 ngày... Đừng diễn đạt storylet đề xuất bên dưới là đã code.
>
> Đọc [Human World Story Bible](human-world-story-bible.md), [Game Design Principles](game-design-principles.md), [Kịch bản vòng ngày](kich-ban-vong-ngay.md). Thời tiết **đẹp là chủ đạo** (mục tiêu thử 85–90%+ thời gian chơi); mưa nhẹ đôi khi là một cảnh thưởng ngoạn; **bão chỉ là chương truyện tự chọn**, không phải thời tiết ngẫu nhiên. Mọi sự kiện cần đúng vai nhân vật, không tự popup khi đến gần; giáo lý phân loại `canonical | commentary | game_interpretation | fiction`.

> **QUYẾT ĐỊNH THAY THẾ (08-11-2026):** [Player-centric Narrative Model](player-character-narrative-model.md) là chuẩn mới. **PC là nhân vật do người chơi đặt tên**, chọn `monk | villager | ghost`; **Sư Tịnh, Ông Tư, Bà Sáu đều là NPC độc lập**. Định nghĩa cũ “role = NPC” bên `develop` là nợ chuyển đổi, tuyệt đối không kế thừa khi viết kịch bản mới. Đã viết lại [Episode Pack 01](human-world-episode-pack-01.md) và [Narrative Review](human-world-narrative-review.md) theo quyết định này; **chưa sửa code**.

> **Đặc biệt ưu tiên:** [HG27 — Bà ngoại ngạ quỷ](human-world-early-mysteries-and-peta-quest.md#3-hg27--bà-ngoại-bên-ngôi-mộ-thấp-early-game-signature-quest) là nhiệm vụ kỳ ảo sớm, **giữ cảnh bà được hồi hướng rồi sáng và biến mất**. Ba thẻ theo đúng ba khoảnh khắc: **Bi** khi nghe và quyết giúp → **Không tham** khi thực sự bố thí để hồi hướng → **Tùy hỷ** sau khi hồi hướng và vui vì bà rời cảnh khổ. Không tự popup, chỉ một màn tổng kết thẻ sau cảnh kết; không nhầm với bà Sáu.

## 0. Kế hoạch nội dung: giàu sinh hoạt trước, bí ẩn sau

**Nguyên tắc kịch bản:** người chơi được đi dạo; một cảnh đáng ngắm đã là phần thưởng. Chỉ khi họ tự bấm **Quan sát / Nghe chuyện / Nhận việc**, truyện mới bắt đầu. Không ép ai thực hành thiền để đi quanh làng. Việc đã nhận và lời hứa phải được nhớ.

Ba nhịp đan xen:
- **Mỗi lần đi dạo (30–90 giây):** 1 điểm nhìn, âm thanh hoặc dấu tích; không luôn là việc phải làm.
- **Sinh hoạt theo ngày (3–7 phút hoặc giao việc rồi thoát):** chuẩn bị đồ, nghe kinh, vá y, nấu cơm, giúp người, quan sát kết quả lần sau.
- **Tuyến câu chuyện nhiều ngày (3–6 ngày chơi, không ép đăng nhập):** lời hứa, quan hệ, nhân quả nho nhỏ; cuối cung để lại dấu vết trong thế giới và mở một liên hệ mới.

**Giữ các NPC arcs, không áp lên PC:** Sư Tịnh khất thực/tu nghĩa địa; Ông Tư nghi ngờ rồi thay đổi; Bà Sáu–Hạnh–nước lớn. PC có thể **nghe, gặp, chứng kiến và lựa chọn phản hồi**, không tự có quá khứ những nhân vật ấy. Tuyến y màu đất trở thành hoạt động của **PC sư** với người hướng dẫn, khác tiểu sử Sư Tịnh.

> **Tuyến hồn ma không được gói vào một dòng HG18:** xem [Ghost Campaign Bible](ghost-playable-campaign-bible.md) với các cảnh G01–G07 (nhà hoang/hù người, hương cơm cúng, giúp người qua mộng, lối Bờ Chìm, bà Sáu, nghe hồi hướng, ending tùy chọn). Đây là campaign **độc lập** với 27 mạch HG ở Nhân gian, không gán PC ma thành bà Sáu. Mối giao với người sống qua Hang/Bến và quy tắc tránh spoil giữa nhiều nhân vật nằm trong [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md).

## 1. Bảng nội dung để viết và chơi dần

| ID | Tên câu chuyện | Vai | Vùng | Thời lượng / kiểu | Kiến thức, vật liệu hoặc mở đường | Trạng thái |
|---|---|---|---|---|---|---|
| HG01 | Tiếng chổi buổi sớm | sư, dân | tịnh thất | storylet ngắn | sân thay đổi, lời sư về công việc thường | đề xuất |
| HG02 | Bảy ngôi nhà — một chiếc bát | PC sư chứng kiến / nghe Sư Tịnh | làng | cung 3 ngày | quan hệ với dân, lời giải thích khất thực có nguồn | đề xuất, nối truyện sẵn |
| HG03 | Một trang kinh còn mở | sư, dân | tịnh thất | cung 3 lần chơi/async | Sổ kiến thức, 1 đối thoại sâu với sư | đề xuất |
| HG04 | Mũi khâu dưới hiên | sư | tịnh thất/giếng | cung nối `robe` | vải hiện diện trong cảnh, lựa chọn quay lại | đề xuất, nâng cấp tuyến y đã có |
| HG05 | Nắm rau và lời đã hứa | PC dân gặp bà cụ, có thể gặp Ông Tư | giếng/gốc mít/làng | cung 2 ngày | trả đúng bà cụ, sau đó nhánh ông Tư | đề xuất, sửa lỗi hiện hữu |
| HG06 | Ba bát xôi chưa trả | PC mọi vai theo góc nhìn; Ông Tư là chủ truyện | làng/nghĩa địa | cung 4 ngày | quan hệ, lựa chọn hồi hướng/nhớ người cũ | đề xuất, tiếp nối |
| HG07 | Chiếc giỏ bên đường | dân | làng | storylet ngắn 2 lượt | giữ lời/trả đồ, lời cảm ơn | đề xuất |
| HG08 | Chuyện bên gốc gạo | sư, dân, ma theo cách riêng | gốc gạo | khám phá tự do | một ký ức, dấu cây thay đổi | đề xuất |
| HG09 | Chị Ba và bức tranh của bé Na | dân, sư quan sát | làng/bụi tre | cung 2 ngày | một bức tranh, quan hệ với chị Ba | đề xuất, nối nhiệm vụ bé Na |
| HG10 | Tiếng chuông không vội | sư, dân, ma nghe bên ngoài | tịnh thất | storylet theo đêm | kiến thức ngắn hoặc ký ức; không tự mở Định | đề xuất |
| HG11 | Trăng trên những bia đá | mọi vai | nghĩa địa/gốc gạo | ngắm cảnh | dấu khám phá và biến thể truyện | đề xuất, không áp lực |
| HG12 | Ao sen thay áo | mọi vai | ao | quan sát 2 thời điểm | Sổ khám phá, nhánh học vô thường | đề xuất |
| HG13 | Người lái xe và chiếc bánh mắc | dân; sư chỉ quan sát phù hợp | đường làng | storylet 2 lượt | tin đồn địa danh, lời hẹn | nối với xe ngựa đã có |
| HG14 | Một đốm đèn nơi xa | mọi vai theo góc nhìn | cổng nghĩa địa | khám phá 2 lượt | gợi mở tảng đá/hang, không ép vào ngay | đề xuất |
| HG15 | Mưa nhẹ trên mái tịnh thất | sư/dân; ma đứng nghe bên ngoài | tịnh thất | **thỉnh thoảng** | cảnh thưởng ngoạn, trang kinh khi vắng | đề xuất |
| HG16 | Sau mưa, mặt ao như mới | mọi vai | ao/bụi tre | **thỉnh thoảng** | dấu cảnh, phản chiếu/câu hỏi mới | đề xuất |
| HG17 | Một con đường chậm hơn | sư/dân | đường tịnh thất | thực hành tự chọn | kinh hành đơn giản, nhật ký thực hành | đề xuất |
| HG18 | Bà Sáu nghe tiếng xôi | PC ma quan sát bà Sáu; người sống nghe dấu tích | gốc gạo/giếng/nghĩa địa | cung 3 đêm | ký ức–hiểu lầm–nghe kinh | đề xuất, tiếp nối `ghost_memory` |
| HG19 | Người khách không xin gì | dân, sư | cổng làng | cung 3 ngày | nhân vật hành hương, lời hẹn nhỏ | đề xuất |
| HG20 | Buổi sáng vẫn đến | mọi vai | nhân gian | micro story hậu cung | cảnh hồi phục, ghi nhận đã quay lại | đề xuất |
| HG21 | Ngọn đèn dành cho người về muộn | PC dân phụ Ông Tư; sư/ma quan sát | ngõ làng/bụi tre | 2 lượt | đèn ấm đổi cảnh, dấu khám phá, người qua đường an toàn | chi tiết trong Episode Pack 01 |
| HG22 | Tiếng chổi và chiếc lá trở lại | PC sư phụ quét cùng Sư Tịnh; dân/ma góc nhìn riêng | tịnh thất | 2 lượt | sân đổi hình, lời sư già, dẫn sang kinh hành | chi tiết trong Episode Pack 01 |
| HG23 | Con Vàng và khoảng sân trước nhà | PC gặp Ông Tư và con Vàng | ngõ làng | 2 ngày | chó được trông nom, ngõ an toàn, lời xin lỗi phù hợp | **sửa nhập vai** trong Episode Pack 01 |
| HG24 | Bóng gốc gạo qua ba buổi | PC mọi vai; bà Sáu là NPC theo duyên | gốc gạo/nghĩa địa | khám phá 3 thời điểm | dấu khung cảnh, câu chuyện thay theo ký ức | chi tiết trong Episode Pack 01 |
| HG25 | Hai chiếc gáo bên giếng | PC dân giúp bà; sư/ma theo vai | giếng làng | 2 lượt | sửa gáo, bà cụ nhớ, giếng đổi cảnh | chi tiết trong Episode Pack 01 |
| HG26 | Nghe chuông, không cần làm gì | PC mọi vai; Sư Tịnh là NPC nếu hiện diện | tịnh thất | ambient-only | dấu cảnh nghe chuông, không cần quest/thẻ | chi tiết trong Episode Pack 01 |
| HG27 | **Bà ngoại bên ngôi mộ thấp** | PC sư/dân giúp vật chất theo vai; PC ma quan sát theo nhánh riêng chưa chốt | nghĩa địa → giếng → vị sư già → mộ | **signature quest đầu game, một lần** | **Bi** (nghe & quyết giúp) → **Không tham** (bố thí hồi hướng) → **Tùy hỷ** (vui sau khi bà được an, rời cảnh khổ); giữ cinematic tan vào ánh trăng | **đã có quest cơ bản trong code, mở rộng thẻ/chủ động tương tác là đề xuất** |

**Không tăng tải màn hình:** tại một thời điểm chỉ 1 truyện đang theo, 0–2 chuyện sẵn để nhận, 1–2 dấu khám phá. Các khoảnh khắc cảnh vật không tiêu thụ slot quest.

## 2. Ba cung truyện nhân gian cần làm trước (đủ lời thoại và trạng thái)

### HG03 — Một trang kinh còn mở (chỉ gợi mở khi PC gặp khó khăn thực tế; học khi vắng có kết quả)

**Vai:** PC sư hoặc PC dân tới tịnh thất. **Khung cảnh:** nắng chiều, bụi nhẹ trước kệ, quyển kinh khép hờ. **Điều kiện học chủ động:** sau một vài lần PC tự thử thiền/kinh hành mà khó chú tâm, buồn ngủ, lười khởi sự hoặc sợ trong hang, **PC chủ động hỏi sư già**; sư gợi ý đi kinh hành hoặc tìm một đoạn kinh cụ thể ở tịnh thất. Kệ sách luôn có thể ngắm/tra cứu, nhưng **không phải một bảng nhiệm vụ ép đọc kinh để lấy thẻ**. Xem quy tắc trong [Early Mysteries and Peta Quest](human-world-early-mysteries-and-peta-quest.md#1-người-chơi-đến-để-khám-phá-không-đến-để-được-giao-học-kinh).

**Cảnh 1 — Nhìn thấy:**

> Một cuốn sách nằm hơi lệch trong kệ. Trên gáy đã phai, có dấu tay của người từng mở.

- **`Đọc một đoạn ngắn`** → vào bản tóm ý có nguồn về *năm triền cái*; trạng thái `knowledge:five_hindrances_01=heard`. Không tự trao thẻ Hôn trầm.
- **`Nhờ thầy gợi ý đoạn phù hợp`** → sư hỏi "Con đang gặp điều gì khi ngồi?"; trả lời về mệt mỏi/khó tập trung/đang tò mò. Chọn bài tương ứng; không chẩn đoán tâm người thật.
- **`Để sách ở đó, đi dạo`** → đi tự do, `discovered:shelf_book` vẫn được nhớ.

**Cảnh 2 — Giao việc khi vắng:** người chơi chọn `Học một đoạn về năm triền cái`, game lưu `jobId`, `lessonId`, `status=running`. Rời game. Quay lại sớm thấy "đã đọc tới đoạn giữa"; quay lại khi đủ tiến trình thấy **"Đã nghe về năm triền cái"**, một mục Sổ kiến thức có giải thích và nguồn, **nhận một lần**. Chưa có backend idempotency nên đây chỉ là yêu cầu thiết kế.

**Cảnh 3 — Dùng kiến thức:** hôm sau đến gặp sư:
> "Trang kinh hôm qua có điều gì khiến con nhớ lâu nhất?"

- **`Con muốn biết khi buồn ngủ lúc ngồi phải làm gì`** (mở thêm khi đã học) → gợi ý thực hành kinh hành ngắn, có thể mở `HG17`.
- **`Con muốn nghe một câu chuyện`** → sư kể một ví dụ giản dị về người ngồi dưới cây rồi nhận ra tâm đang chạy đi, nhãn *diễn giải trong game*.
- **`Chào thầy rồi đi tiếp`** → không phạt.

**Kết quả thế giới:** lần quay lại cuốn sách được đặt đúng vào kệ; trong hồ sơ có `Sổ kiến thức`. Câu hỏi của sư thay đổi theo `heard/reviewed/applied`. Người không học vẫn nghe chuyện được, chỉ thiếu lựa chọn mở rộng.

### HG05 — Nắm rau và lời đã hứa (PC dân là người được nhờ)

**Chủ truyện:** bà cụ ở giếng (`npc.granny`). **Vai:** PC dân có thể tự hái rau; PC sư có thể hỏi thăm/chỉ cách giúp phù hợp giới luật sau khi giáo thọ duyệt; PC ma chỉ quan sát, không bứt cây. **Ông Tư là NPC ở đầu ngõ**, không phải nhân vật điều khiển.

**Ambient:** bà cụ ngồi gần chiếc thúng trống. Người chơi đi ngang không tự nhận quest.

**Chạm `Hỏi bà đang làm gì`:**

> **Bà cụ:** “Bà tính nấu chút canh rau má, mà chân lại đau.”
>
> **PC dân:** “Bà muốn con hái giúp một nắm không?”

- `Để con giúp bà` → `grannyHerbs=accepted`; người nhận là bà cụ.
- `Để hôm khác con ghé` → chỉ ghi lời hứa nếu đã thực sự nhận lời.
- `Hỏi rau má mọc ở đâu` → bà chỉ gốc mít, không ép nhận nhiệm vụ.

**Bên gốc mít:** PC dân chủ động hái đúng loại rau (minigame nhẹ), vật phẩm `rau_ma_for_granny` được gắn với lời hứa, không chuyển ngay sang Ông Tư. **Trở lại giếng:** bà nhận rau, nồi canh xuất hiện, lần sau lời bà thay đổi. Nếu có nhu cầu giúp ông Tư, phải có **nắm rau mới** được bà cho phép hoặc một nhiệm vụ khác, tuyệt đối không coi mang nắm đã hứa cho người khác là hoàn thành.

**Hậu quả:** `accepted→picked→delivered` hoặc `unfulfilled→repair` nếu quyết định có nhánh xin lỗi; bỏ qua ngay từ đầu không bị phạt. **Văn phong:** gần gũi, không kết luận “PC được Không tham” chỉ vì hái rau. **Nợ code:** `mind.js` còn tự bật việc khi đến gần và cho nhánh mang rau sang ông Tư; cần xử lý trong PR code.

### HG18 — Bà Sáu nghe tiếng xôi (truyện của NPC, người chơi có góc nhìn riêng)

**Chủ truyện:** `npc.ba_sau`. **Góc nhìn:** PC ma có thể quan sát/nghe/trao đổi khi đủ duyên; PC dân/sư tìm manh mối ở làng hoặc nghe chuyện do người sống kể. **Không cho PC ma mặc định là bà Sáu hoặc biết Hạnh là con mình.**

**Cảnh 1 — Gốc gạo:** một bóng người già đứng nghe tiếng rao xôi; nếu PC chủ động tới gần:

> **PC:** “Bà đứng đây lâu chưa?”
>
> **Bà Sáu:** “Lâu lắm rồi. Có khi bà cũng không nhớ rõ.”

- `Hỏi bà đang đợi ai` → bà nói chưa rõ, mở `metBaSau`.
- `Lặng lẽ quan sát` → ghi dấu cảnh, không thưởng thẻ tâm.
- `Đi tiếp` → vẫn còn cơ hội gặp lại.

**Cảnh 2 — Quanh giếng:** thấy một người bán xôi chia phần cho hàng xóm; ký ức **của bà Sáu** xuất hiện như lời kể hoặc một hồi tưởng có nhãn, PC **không thực hiện** những lựa chọn trong quá khứ của bà. Chỉ khi người chơi đã tìm được đồ vật liên quan Hạnh, bà mới có lời thoại sâu hơn.

**Cảnh 3 — Ngoài tịnh thất:** bà Sáu nghe tiếng kinh. PC ma có thể chọn đứng nghe cùng hoặc rời đi; PC người sống có thể hỏi Sư Tịnh về một chuyện được kể ở nghĩa địa. Phần thưởng: `lore:ba_sau_memory_fragment`, quan hệ với NPC hoặc gợi ý vùng dưới. **Không đảm bảo bà siêu thoát; không tự tăng Niệm/Định cho PC vì đã xem hồi tưởng.**

## 3. Ba storylet khám phá hoàn chỉnh, không bắt quest

### HG11 — Trăng trên những bia đá

**Trigger:** trời đẹp, đêm trăng, `graves`, bất kỳ vai. Cảnh âm thanh và ánh sáng tự hiện; người chơi không cần bấm gì.

Nếu người chơi tự chọn `Ngắm mặt trăng trên ngôi mộ cũ`:
> "Bóng tre đổ dài qua bia đá. Đốm đom đóm lơ lửng như một chiếc đèn nhỏ không người cầm."

- PC sư: có thể thử đứng yên một lúc, không tự rơi thẻ.
- PC dân: có thể chọn ngắm hoặc hỏi người làng về ngôi mộ, không mặc định mình đã từng sợ nơi này.
- PC ma: quan sát bóng cây và một dấu vết lạ, không tự có ký ức của bà Sáu.

**Kết quả:** `discovery:moon_graves` — một cảnh đẹp được ghi vào Sổ, ẩn câu chuyện tùy người đã gặp.

### HG12 — Ao sen thay áo

**Trigger:** `ao`, sáng, trời đẹp; hình sen mở, chuồn chuồn đi qua. Không có NPC chờ giao việc.

Bấm `Ngắm bông sen` → lần 1 thấy bông đang nở; lần 2 ngày khác thấy một cánh đã rụng; lần 3 có thể thấy nụ mới.

- Có `knowledge:impermanence_intro`: gợi thêm câu hỏi "Cảnh này đã khác hôm trước ở đâu?".
- Chưa học: vẫn có ghi nhận cảnh `lotus_cycle`. Không tự tuyên bố đã thấy rõ pháp vô thường.

**Kết quả:** bộ ba hình/vết mốc cảnh (có thể dùng một sprite đổi trạng thái sau này), một lời hẹn ngắm ngày khác.

### HG14 — Một đốm đèn nơi xa

**Trigger:** ngõ gần nghĩa địa, chiều tà, trời đẹp; có ánh đèn rất nhỏ phía sau tảng đá lớn. Chỉ hiện **một dấu tò mò** trong cảnh, không nổ popup.

Người chơi có thể đi tìm nguồn, hoặc đi nơi khác. Khi chủ động quan sát sẽ nghe gió từ khe đá. `discovery:cave_draft` được ghi. NPC nếu được hỏi sẽ kể về người từng đứng trước hang sợ hãi; vẫn được tự khám phá cảnh ngoài của hang, không bắt có thẻ trước khi được vào ngắm.

**Kết quả:** đích đến cho người Explorer, móc nối sang `Hang Vọng Tâm`, không tự khởi động nhiệm vụ dài.

## 4. Storylet ngắn sinh hoạt để bổ sung dần (đúng vai, không lặp)

| ID | Khung cảnh | Người chơi có thể chọn | Thế giới nhớ | Nếu bỏ qua |
|---|---|---|---|---|
| HG01 | nắng sớm, sân tịnh thất phủ lá | quét một đoạn / ngồi nhìn bóng lá | `courtyardSwept`, sư nói khác | sân có thể được NPC quét sau đó |
| HG02 | cổng nhà thứ bảy, sáng, Sư Tịnh đi khất thực | PC sư quan sát/học; PC dân có thể hỏi chuyện; Ông Tư là NPC | `house7Attitude` | không chặn tuyến chính |
| HG04 | một mép y sắp khâu ở hiên | chỉnh đường kim / chuẩn bị đồ khi vắng | `robe.sewingPrepared`, hình vải đổi | hôm sau còn vật liệu |
| HG07 | giỏ trái cây đặt cạnh hàng rào | quan sát dấu tên / hỏi người bán | `basketReturned` và lời cảm ơn | người khác đến nhận sau vài ngày |
| HG08 | bóng gốc gạo đổi theo giờ | PC đứng nhìn / hỏi về gốc cây nếu đủ duyên | `gaoSeen`, mảnh ký ức | không bị bắt tìm bé Na |
| HG09 | bé Na vẽ bức tranh ở sân | xem tranh / hỏi chị Ba về tranh | `naDrawingSeen`, thái độ chị Ba | mẹ con vẫn sinh hoạt |
| HG10 | chuông chiều tịnh thất | đứng nghe / hỏi một câu ngắn | dấu âm thanh, knowledge nếu chủ động học | chuông vẫn vang |
| HG13 | bánh xe mắc bên ngõ, xe hàng ghé | dân hỏi có cần giúp; sư có thể đứng nghe lời đồn | `cartHelped` / `rumourHeard` | người lái tự xoay xở rồi đi |
| HG17 | lối dọc hiên tịnh thất | tự kinh hành vài vòng / đứng ngắm | nhật ký active, không auto rơi thẻ | không có cảnh thất bại |
| HG19 | khách lạ chỉ xin nước và chỉ đường | dân chỉ/đưa nước; sư chỉ nơi phù hợp | `travelerHelped`, lời hẹn | khách tự đi tiếp |
| HG20 | một sáng rất bình thường | ngồi nghe chim, gặp người quen | một dòng nhật ký tùy chọn | không cần gì khác |

**Nên bổ sung các mẫu biến thể** theo lịch sử đã làm: PC sư từng may y → lời Sư Tịnh về đường khâu mới; bà cụ đã nhận rau do PC giao → có nồi canh; Ông Tư treo đèn (có hoặc không có PC giúp) → ngõ sáng; PC đã học kinh → lời sư già có thêm lớp nghĩa.

## 5. Thời tiết nhẹ là gia vị, bão chỉ là truyện tùy chọn

- **Nắng sớm/trăng/sương/gió** là mặc định để giữ cảm giác chữa lành. Mục tiêu thử nghiệm **85–90%+ lượt dạo** đẹp/dễ chịu, không tính như cam kết xác suất tuyệt đối.
- **HG15 mưa nhẹ**: khi đến tịnh thất, có giọt mưa và âm thanh hiên; có thể học/đọc đoạn kinh hoặc ngồi nghe; mưa tạnh đưa cảnh về trạng thái sáng, **không** làm chậm quest.
- **HG16 sau mưa**: ao sen, vệt nước, một góc nhìn mới; Sổ khám phá ghi được mà không cần nhận quest.
- **Bão** trong [Human World Story Bible](human-world-story-bible.md) là **chương truyện ký ức tự chọn** (mà người chơi có thể xem tóm tắt, bỏ qua). Không bốc thăm khiến người vào ngắm cảnh phải đối diện map u ám; không có vật phẩm/chìa khóa độc quyền từ bão.

## 6. Cấu trúc dữ liệu kịch bản để developer dùng về sau

```js
// Pseudocode thiết kế; chưa tích hợp API
const storylet = {
  id: "HG12",
  role: ["monk", "villager", "ghost"],
  place: "ao",
  timeBand: ["dawn", "day"],
  weather: ["clear", "cloudy"],
  prerequisite: [],
  surface: {
    ambient: "lotus_blossom_open",
    hint: "Ngắm bông sen",
    trigger: "explicit_interact"
  },
  state: {
    scope: "character",
    key: "lotus_cycle",
    stage: "seen_bud",
    cooldownDays: 1
  },
  choices: ["observe", "leave"],
  result: {
    record: "discovery:lotus_cycle",
    followUp: "HG12_next"
  },
  loreBasis: "game_interpretation",
  sourceRefs: [],
  reviewed: false
};
```

**Quest trạng thái:** `unknown → available → accepted → in_progress → completed`; `snoozed` chỉ là tạm ẩn gợi ý; không mất. **Ambient/discovery** không ép người chơi nhận, vì bản thân cảnh đã là phần thưởng. **Một ý nghĩa giáo lý** nếu có phải được ghi nguồn và nhãn riêng, không biến thơ kể thành "trích kinh".

**Dữ liệu dùng chung:** NPC `memory`, hành vi theo giờ, `discoveryJournal`, `knowledgeBook`, `inventory`, `awayJob`, `storyletHistory`, `worldEffects`. Kết quả server phải nhận đúng một lần khi có nhiều thiết bị.

## 7. Lộ trình biên kịch trước khi code/asset

**Đợt 1 — cần viết thành playable script đủ chi tiết (ưu tiên, có mạch kỳ ảo sớm):**

> Bản review mới đã bổ sung sáu kịch bản **HG21–HG26** có trạng thái, lời thoại và chi tiết quay lại. Khi bắt đầu code, chọn một vài kịch bản nhẹ từ [Episode Pack 01](human-world-episode-pack-01.md) thay vì triển khai cả 26 ý tưởng. Ưu tiên sửa lỗi nhập vai con Vàng/ông Tư trong HG05/HG23.
1. **HG27 bà ngoại ngạ quỷ:** dễ gặp đầu game, chủ động giúp, hồi hướng, giữ cinematic, ba thẻ theo đúng thời điểm; không popup/thưởng lặp.
2. HG03: PC tự gặp khó khăn khi thiền/khám phá → hỏi sư → có thể đọc kinh khi vắng → vận dụng; không phát quest học giáo lý sẵn.
3. HG05 lời nhờ rau má của bà → trả đúng người → mở việc giúp ông Tư.
4. HG11/HG12/HG14: ba cảnh khám phá đẹp, không popup và không quest bắt buộc.
5. HG18 ký ức bà Sáu theo vai ngạ quỷ, nối xuyên các đêm.
6. HG01/HG04: sinh hoạt quét sân và tiến trình may y như một phần đời sống.

**Đợt 2 — bổ sung lời thoại theo nhánh và môi trường:**
HG02, HG06, HG07, HG08, HG09, HG10, HG13, HG17, HG19 và HG20. Các cung HG02/HG06 phải đối chiếu truyện hiện có để tránh viết trùng hoặc phá tiếp nối. Bổ sung câu chuyện gắn thời tiết đẹp và mưa nhẹ.

**Đợt 3 — sau khi thử vòng chơi Nhân gian:**
Đọc log thử nghiệm/nhật ký lựa chọn, thêm 2–3 biến thể cho các địa điểm người chơi quay lại nhiều nhất, rồi mới thiết kế những map sâu. Bão để backlog sau khi người dùng thật mong có chương riêng.

## 8. Tiêu chí nghiệm thu tài liệu trước khi giao dev

- [ ] Mỗi cảnh viết rõ **vai, nơi, thời điểm, trigger chủ động, hình/âm báo từ xa, lời thoại, lựa chọn, hệ quả, phần thưởng, trạng thái save, skip/revisit**.
- [ ] Người chơi mới có thể dạo 5–10 phút quanh làng/ao/tịnh thất mà không bị popup.
- [ ] Mỗi vai có ít nhất 2 cảnh độc lập không buộc nói chuyện với NPC.
- [ ] Một chuyện đã nhận lời phải có cách thực hiện hoặc thừa nhận chưa làm, NPC nhớ đúng.
- [ ] Học khi vắng trả kiến thức lưu một lần; không có thẻ tu chứng từ timer.
- [ ] Vật phẩm có chủ, không tự nhân đôi/đem cho người khác để nhận thưởng thiện.
- [ ] Truyện bà Sáu không cho ma chạm, hái, đưa đồ hoặc dắt người sống.
- [ ] Nếu xuất hiện bài học giáo lý, ghi `loreBasis`, nguồn, nội dung nào cần thầy duyệt.
- [ ] Phần lớn Nhân gian nắng dịu/trăng/sương; mưa nhẹ đôi khi thêm nét đẹp; bão không random.
- [ ] Không cần vẽ map/asset mới để hiểu logic và thứ tự câu chuyện; tài liệu đủ để mock bằng các marker tạm.
