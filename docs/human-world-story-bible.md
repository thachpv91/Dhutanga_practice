# Human World Story Bible — Nhân gian có đời sống, thời tiết và câu chuyện

> **Tài liệu thiết kế kịch bản trước khi dựng (2026-11-08). Chưa triển khai hệ thời tiết và các storylet bên dưới vào gameplay.**
>
> **Nguồn chuẩn:** [Game Design Principles](game-design-principles.md), [Kịch bản vòng ngày](kich-ban-vong-ngay.md), [World Exploration Bible](world-exploration-bible.md). Giữ nguyên hướng: *game trước, Phật pháp tạo chiều sâu, người chơi chọn cách trải nghiệm, mô phỏng minh bạch*. Bối cảnh hư cấu không phải mô tả giáo lý chính thống.
>
> **Ghi chú đối chiếu `develop`:** `public/world.js` đã có 11 địa danh, chu kỳ sáng tối và sương mù; `public/story-nights.js` đã có các cảnh **trăng** và **mưa phùn** cho một số vai; `public/reflect.js` có lời hẹn và việc khi vắng. **Chưa có một hệ thời tiết cấp thế giới** đồng bộ hình ảnh, NPC, nhiệm vụ, storylet, hành động offline và hậu quả sau bão. Không được ghi các thiết kế bên dưới là đã code.

## 0. Quyết định thiết kế: thời tiết đẹp là mặc định (08-11-2026)

**Nhân gian là thế giới chữa lành.** Ưu tiên giữ nguyên khí trời quang, nắng dịu, trăng, sương và gió của game hiện tại. Thời tiết là **gia vị kể chuyện** chứ không phải biến số liên tục phá tâm trạng. **Viết kịch bản Nhân gian trước**, không bắt tay dựng Weather Engine hoặc map mới khi câu chuyện chưa duyệt.

- **Mục tiêu cân bằng thử nghiệm:** ít nhất **85–90% thời gian dạo chơi** có thời tiết đẹp/dễ chịu (quang, mây sáng, trăng, sương); mưa nhẹ chỉ đôi khi xuất hiện để thưởng ngoạn; mưa lớn cực hiếm. Không dùng xác suất này như lời hứa sản phẩm hay áp dụng cứng cho từng phiên.
- **Bão KHÔNG xuất hiện ngẫu nhiên** trong map sinh hoạt. Chỉ là **chương truyện tùy chọn**, người chơi chủ động tham gia từ Sổ hoặc NPC, có thể xem tóm tắt/bỏ qua cảnh bão, lập tức trở về bầu trời yên bình. Không có phần thưởng độc quyền bắt buộc từ bão.
- **Mỗi lần vào chơi mặc định dễ chịu**, kể cả sau khi vắng lâu. Không ép người chơi login để gặp đổ nát/cơn bão kéo dài. Thời tiết không làm mất vật phẩm hoặc giảm chỉ số tâm.
- **Cảnh đẹp cũng là nội dung:** nên ưu tiên viết kịch bản nắng sớm, chiều vàng, trăng sáng, đom đóm, sen nở, hiên tịnh thất, bóng tre. Mưa thêm cảm giác mới chứ không thay thế những cảnh này.
- **Ưu tiên triển khai:** đọc [Human World Playable Scenarios](human-world-playable-scenarios.md) để viết/nối các tình huống thực sự chơi được; thời tiết động để sau, chỉ giữ script mưa phùn đã có và viết thêm lời thoại khi phù hợp.

> **Ưu tiên hiện tại:** hoàn thiện [26 playable scenarios](human-world-playable-scenarios.md), 6 episode chi tiết trong [Episode Pack 01](human-world-episode-pack-01.md) và các tình huống khám phá không quest. Bầu trời đẹp chủ đạo; thời tiết chỉ điểm xuyết.

> **QUYẾT ĐỊNH CHUYỂN ĐỔI (08-11-2026):** [Player-centric Narrative Model](player-character-narrative-model.md) là chuẩn chính. **PC có tên riêng, vai chỉ là sư/dân/ma; Sư Tịnh, Ông Tư, Bà Sáu đều là NPC.** `develop` vẫn có thiết kế cũ gắn role với NPC; đây là lỗi legacy cần xử lý trong PR code sau, không phải quy tắc khi viết thêm. Xem [Narrative Review v0.3](human-world-narrative-review.md). Lời thoại viết ngắn, ấm, tự nhiên, bớt giáo điều; khung cảnh kể phần lớn câu chuyện.

> **Signature quest mở thế giới kỳ ảo sớm:** [HG27 — Bà ngoại ngạ quỷ](human-world-early-mysteries-and-peta-quest.md) giữ cảnh giúp bà hồi hướng, bà sáng rồi tan vào ánh trăng. Bộ ba thẻ là **Bi** khi nghe bà kể và chọn giúp → **Không tham** lúc thực sự bố thí để hồi hướng → **Tùy hỷ** sau hồi hướng khi vui vì bà được an/rời cảnh khổ. Phân biệt bà ngoại với **NPC Bà Sáu**. Cùng hệ thống, thọ thần và chư thiên có lời đồn/dấu hiệu sớm nhưng không đứng xuất hiện thường xuyên; xem tài liệu HG27.

> **PC hồn ma có campaign độc lập:** [Ghost Campaign Bible](ghost-playable-campaign-bible.md). Có thể hù người một cách vui, nghe lời hồi hướng, theo vệt hương cơm, vào nhà hoang, giúp người qua thì thầm/báo mộng, và tìm Bến Không Tiếng theo lối khác người sống. NPC bà Sáu **không** là tiểu sử của PC ma. Người dân có thể tự nguyện tìm hiểu xuất gia, PC ma có thể **chọn kết thúc sớm** và lưu lại một ending — xem [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md). Các mạch này **đang đề xuất để duyệt, chưa code**.

> **Kịch bản hồn ma đã được viết thành các cảnh:** [Episode Pack 01](ghost-episode-pack-01.md) và [Episode Pack 02](ghost-episode-pack-02.md). **G04 lối ma tới bến qua khe suối rừng tre, không còn vết nước ngược trong nhà hoang; nhà hoang chỉ là một điểm nghỉ tùy chọn**, xem [Journey Memory](journey-memory-and-return-ux.md). Nhiệm vụ giúp bà cụ giếng **tìm túi kim chỉ** là truyện riêng, không gượng nối với Hạnh; ở Bến Không Tiếng chỉ nghe mảnh chuyện nước lớn, không tự biết Hạnh sống và là vợ Ông Tư. Vai ma có cốt truyện giúp người, **hù NPC khiến họ sợ thật**, có cơ hội học thẻ bất thiện từ **động cơ riêng**; thỉnh thoảng có thể nghe PC sư/dân khác hồi hướng theo sự kiện hợp lệ, NPC fallback, ending tự chọn. Xem [Ghost Mischief](ghost-mischief-cards-and-shared-dedication.md); **design-only**.

## 1. Vai trò của Nhân gian

Nhân gian là nơi người chơi **muốn trở về**, dù họ đã đi tới hang, cõi dưới hoặc biên cảnh cõi trời. Không chỉ là nơi nhận nhiệm vụ và học thẻ.

- **Explorer:** dạo làng, rừng, giếng, ao, nghĩa địa, nghe âm thanh, gặp cảnh lạ, khám phá thay đổi theo mùa/ngày/đêm/thời tiết mà không phải bấm quest.
- **Story seeker:** PC gặp Sư Tịnh, Ông Tư, Bà Sáu, Hạnh, chị Ba, bé Na như những NPC riêng, lần theo chuyện của họ và lựa chọn tác động của **chính PC**; NPC nhớ lời hẹn đã nhận.
- **Learner / Practitioner:** ngồi thiền mô phỏng, kinh hành, học kinh, xem Sổ kiến thức, dùng điều đã học trong tình huống sau.
- **Casual / Busy:** giao một việc có thể làm khi vắng, quay lại thấy tiến triển và kết quả lưu thật; không tăng thẻ chứng đắc do đồng hồ.

**Luật bất di bất dịch:** đi ngang không tự bật popup. Thời tiết, sự cố và cảnh đẹp trước hết xuất hiện bằng **biến đổi trong thế giới**, khi người chơi chủ động chạm vào dấu tương tác mới mở truyện. Chỉ sự kiện liên quan an toàn nhân vật mới được chủ động chuyển sang nơi trú phù hợp, không dùng bão để ép người chơi nhận quest.

## 2. Các địa điểm nhân gian hiện có và khoảng trống kịch bản

| Địa điểm hiện hữu | Trải nghiệm nền cần có dù không nhận quest | Câu chuyện theo nhân vật | Thời tiết tạo khác biệt |
|---|---|---|---|
| Ngõ làng (`village`) | tiếng chổi, gánh hàng, chó nằm dưới hiên | ông Tư thay đổi thái độ, tin đồn | mưa đẩy hoạt động vào hiên; sau bão có mái cần sửa |
| Cổng nghĩa địa (`gate`) | vết bánh xe, nến tàn, chân mộ phủ rêu | nhà sư đi qua, người hành hương | nước đọng, cành rơi, lối vòng |
| Bụi tre (`bamboo`) | gió đung đưa, tiếng tre cọ | ông Tư và con Vàng, ký ức | mưa trên lá, gió mạnh nhưng không jump-scare |
| Giữa mộ (`graves`) | mùi cỏ, bia cũ, đom đóm | bà Sáu, lời hẹn, hồi hướng | mưa xóa dấu chân, gió làm nhang tắt; người sống trú an toàn |
| Gốc gạo (`gao`) | hoa, lá rơi, bóng cây dài | bà Sáu, thọ thần | lá rơi sau mưa, cành gãy sau bão |
| Tịnh thất (`hermitage`) | chuông, kệ kinh, hiên vắng | học kinh, may y, hỏi sư | mưa nghe trên mái; khi bão trú và chăm sóc chỗ ở |
| Giếng (`well`) | gầu, sợi dây, bóng nước | bà cụ, rau má (cần sửa lời hứa) | nước đục sau mưa; chuẩn bị nước sạch sau bão |
| Gốc mít (`mit`) | mùi lá, kiến, bóng râm | hái rau (vai dân), giữ lời với bà | đất ướt, rễ trơn; không tự hái lúc bão |
| Ao sen (`ao`) | sen nở/khép, chuồn chuồn | ngắm sự thay đổi, chuyện vô thường | vòng nước, sen cụp khi mưa; sáng sau phản chiếu |
| Tảng đá lớn (`hang`) | khe gió, âm vọng, dấu rêu | mở đường tới Hang Vọng Tâm | mưa làm nước rỉ; khi bão cửa sâu có thể tạm không an toàn |
| Tháp cổ (`thap`) | rêu, tiếng chuông xa, ánh đèn | chuyện thiện duyên, dấu vật dẫn | tháp sau mưa có màu khác; cầu thang ướt có lối an toàn |

**Chừa slot mở rộng:** hiên nhà ông Tư, vườn rau bên giếng, mái trú trong tịnh thất, con đường mòn sau rừng, bờ ao phía xa; chưa cần vẽ mới ngay.

## 3. Hệ thời tiết: không chỉ hiệu ứng hình ảnh

### 3.1. Thời tiết theo chu kỳ và câu chuyện

| `weatherId` | Cảm giác thị giác/âm thanh | Sinh hoạt & khám phá | Câu chuyện hợp cảnh |
|---|---|---|---|
| `clear` — trời quang | nắng ngà, bóng cây êm, dế/chim | làm việc ngoài trời, ngắm sen, đi dạo | những ngày bình thường có chuyện nhỏ |
| `cloudy` — nhiều mây | ánh sáng dịu, gió, mây thấp | chuẩn bị phơi vải, đóng cửa sổ | dấu hiệu thời tiết thay đổi, NPC nhắc chuyện |
| `drizzle` — mưa nhẹ | mưa li ti, giọt lá, mặt ao gợn | ngồi dưới hiên, nghe mưa, kiểm tra vải phơi | chuyện nhẹ nhàng, câu kinh, lời hẹn, ký ức |
| `rain` — mưa lớn | mưa rõ, tiếng mái, nước chảy rãnh | tìm chỗ trú, che đồ phơi, một số lối ngập tạm | giúp nhau che mái, đưa đồ khỏi ướt (vai phù hợp) |
| `storm_warning` — sắp bão | mây vần, gió mạnh dần, NPC thu đồ | người dân chuẩn bị, đường nguy hiểm có cảnh báo | chuỗi nhiều ngày: trước bão |
| `storm` — bão | gió rít **dịu có kiểm soát**, chớp xa, mái rung, giảm âm lượng nền | **chuyển sang không gian trú an toàn**; khám phá ngoài trời hạn chế tạm thời | tương tác trong nhà/tịnh thất, lắng nghe, tìm cách giúp sau bão |
| `after_storm` — sau bão | mây tản, nắng ló, lá rụng, vũng nước | lối mới được nhìn thấy, vật cần sửa, người trở lại ngoài trời | thăm hỏi, sửa đồ, những việc tốt nhỏ và hậu quả có thể nhìn thấy |

**Bão chỉ là episode tự chọn**, không chạy trong lịch thời tiết mặc định; khi chọn sẽ có trước/sau, có thể bỏ qua cảnh bão và không lưu map chính ở trạng thái u ám. Không gắn bão với nghiệp xấu hoặc hình phạt đạo đức. Không dùng thiên tai thật đang diễn ra để quảng bá một sự kiện game.

**Lịch thử nghiệm (không phải luật cố định):** trạng thái đẹp và ấm chiếm **85–90% trở lên**; phần còn lại chủ yếu mưa nhẹ, ít mưa vừa. **Xác suất bão ngẫu nhiên = 0**. Chỉ khi người chơi tự mở chapter bão mới mô phỏng `storm_warning → storm → after_storm`, và có nút bỏ qua. Không dùng thời tiết địa phương thật; chọn weather nhất quán theo một lượt/chương, không bốc lại mỗi lần mở game.

### 3.2. Thế giới nhớ ảnh hưởng của thời tiết

- Mưa: mặt ao gợn, áo/đất ẩm, NPC che vải, vệt nước ở giếng; mưa tạnh vẫn còn dấu một thời gian.
- Trước bão: người làng cất thúng, ông Tư kiểm tra hàng rào, người ở tịnh thất giữ sách khô; **được nhìn thấy** trước khi người chơi nhận quest.
- Trong bão: mái rung, tiếng nước chảy, trú dưới mái; NPC **không đi lại như trời quang**. Không yêu cầu người chơi đi ra giữa bão để cứu đồ thưởng cao.
- Sau bão: cành cây rụng, nước đọng, mái cần sửa, có thể xuất hiện lối mòn mới, vật trôi dạt và NPC nói lời mới. **Việc đã giúp** thay đổi sprite/trang trí hoặc tuyến hội thoại.
- Sau một vài ngày: vũng nước khô, sân sạch, dân trở lại sinh hoạt; không để map hỏng mãi nếu người chơi không nhận quest.

### 3.3. Quy tắc thời tiết trong gameplay

1. Thời tiết thuộc `worldState` dùng chung cho mọi cảnh ở cùng một `gameDay`, không phải mỗi NPC hoặc scene tự bốc thăm; tránh từ làng mưa sang tịnh thất nắng trong một thời điểm vô lý.
2. Có `weatherEpisodeId`, `phase`, `forecast`, `effects`, `storyProgress` và ngày dự kiến chuyển trạng thái. Một chuỗi bão có **sự chuẩn bị, thời điểm trú, hậu quả**.
3. **Mọi weather storylet cần điều kiện vai × vị trí × thời gian × thời tiết × lịch sử đã làm**, có cooldown và ít nhất một nhánh không ép nhiệm vụ. Không hiển thị cảnh đang phơi y ngoài nắng khi trời mưa lớn; không làm quest giúp dọn sân trong lúc bão ngoài trời.
4. Các hoạt động khi vắng **không bị phạt** vì trời mưa: phơi vải có thể chuyển thành cất vào hiên, thông báo tình trạng chuẩn bị; học kinh, làm việc trong nhà vẫn tiến triển.
5. **Đường đi thiết yếu không bị khóa lâu** bởi bão: cho chọn trú/an toàn/chuyển thời gian hư cấu nếu cần, tránh ngăn người chỉ muốn khám phá. Những bí mật đặc biệt chỉ xuất hiện sau mưa/bão được coi là **thưởng tò mò**, không khóa tuyến chính.
6. Bão không phải mini-game phản xạ căng thẳng, không jump-scare và không gây tổn thương thực tế/đạo đức; cho phép `reduceWeatherEffects` và `calmMode`.

## 4. Ba kịch bản thời tiết mẫu có thể chơi

### W01 — "Mưa trên mái tịnh thất" (mưa nhẹ, 10 phút hoặc 2 lần vào)

**Điều kiện:** `drizzle`, đang ở gần tịnh thất, bất kỳ vai phù hợp; NPC chỉ có tín hiệu nhỏ.

- **Khám phá tự do:** mưa chạm lá, hiên có tiếng nhỏ giọt. Người chơi có thể đứng ngắm; Sổ khám phá thêm `scene:rain_hermitage` nếu chủ động nhìn.
- **Người chơi muốn học:** bấm **Nghe mưa cùng sư**. Sư hỏi "Cơn mưa đến, âm thanh nào đã đổi?". Nếu có kiến thức Niệm, xuất hiện thêm một câu hỏi về ghi nhận âm thanh; **không tự rơi thẻ Niệm**.
- **Người bận:** chọn **Học một đoạn kinh bên hiên**, rời game. Lần sau nhận `knowledge:mindful_listening_01` ở mức `heard`, không tự tăng Định.
- **Sau mưa:** trên hiên còn bình đựng nước mưa. Một câu chuyện mới có thể xuất hiện tùy người chơi đã nghe sư hay chưa.

**Phần thưởng:** một khung cảnh đáng nhớ, kiến thức có nguồn được duyệt, nhánh nói chuyện mới; không bắt làm tất cả.

### W02 — "Bão qua làng" (**chương truyện tự chọn**, không phải event ngẫu nhiên)

**Mở chương:** NPC/Sổ gợi ý rất nhẹ "Nghe chuyện năm làng có bão". Người chơi chọn **Nghe chuyện** / **Để sau** / **Chỉ xem cảnh sau bão**. Đây là chuyện được kể lại hoặc episode riêng, **không ép map đang dạo đổi sang bão**. Không khóa tuyến chính hoặc vật phẩm cần thiết sau chương này.

**Cảnh 1 — Trước bão:** trời đổi màu, gió mạnh. Ông Tư buộc lại hàng rào, bà cụ cất giỏ, sư già đóng cửa kệ kinh. Người chơi có thể đi dạo xem chuẩn bị hoặc **tự chọn** giúp một việc an toàn theo vai.

**Cảnh 2 — Bão (có thể bỏ qua):** phần ngoài trời không khuyến khích đi lại. PC người sống ở nơi trú an toàn, có thể nghe tiếng mưa, học kinh, nghe truyện cũ về mùa nước lớn hoặc giúp việc trong nhà. Không yêu cầu ra ngoài làm việc nguy hiểm. **PC ma** có thể quan sát ký ức của **NPC bà Sáu** (không phải ký ức của chính PC), không nhặt đồ hay cứu người sống bằng sức ma.

**Cảnh 3 — Sau bão:** một cành cây chắn một lối **phụ**, mái bếp ông Tư dột. Khi người chơi tự chọn xem, có chuỗi **hỏi thăm → nhờ người phù hợp sửa → thấy thay đổi**. Cùng lúc lối men bờ ao xuất hiện vệt đá cũ, mở một manh mối Sổ khám phá.

**Cảnh 4 — Hồi phục:** người làng sửa xong, nước rút, sân sạch. Nếu người chơi đã giúp, NPC nhớ và cảnh vật thay đổi; nếu không, người làng vẫn chủ động sửa chữa theo tiến trình bình thường (không trừng phạt nghỉ game). Nhiệm vụ chính và các lối đi thiết yếu không kẹt.

**Phần thưởng hợp lý:** `discovery:old_stone_path`, một lời cảm ơn, vật liệu sửa đã hoàn thành, kiến thức về hỗ trợ người khác; không "bão đến do nghiệp xấu" và không thưởng công đức theo điểm.

### W03 — "Sau cơn mưa, ao sen" (khám phá nhẹ, không cần quest)

- Lần đầu người chơi thấy mưa lất phất trên mặt ao, sen cụp nhẹ, có một vệt sáng rất nhỏ.
- Lần sau mưa tạnh, vệt nước trên lá sen phản chiếu cây gạo; **người chơi tự chọn quan sát** sẽ mở `discovery:lotus_after_rain`.
- Nếu đã học kiến thức vô thường: Sổ có thêm lời giải thích về sự đổi thay và gợi ý nghe sư, **không** tuyên bố đã chứng vô thường.
- Nếu chưa học, người chơi vẫn thấy cảnh đẹp và nhận dấu Sổ khám phá. Không gắn thưởng vào đúng một đáp án đạo đức.

## 5. Kho 12 móc tình huống thời tiết (ưu tiên viết trước khi vẽ)

| ID | Vai | Điều kiện | Dấu hiệu (không popup) | Nếu người chơi chủ động làm | Kết quả bền vững |
|---|---|---|---|---|---|
| WX01 | mọi vai | `drizzle`, ao | vòng nước lăn trên lá sen | quan sát | Sổ cảnh `lotus_rain` |
| WX02 | sư/dân | `drizzle`, tịnh thất | mái nhỏ giọt | ngồi nghe mưa/học một đoạn | kiến thức/nhật ký |
| WX03 | dân | `rain`, giếng | gầu nước đục, giỏ ướt | giúp bà cất giỏ/kiểm tra nước | NPC nhớ, không nhầm rau đã hứa |
| WX04 | sư | `rain`, đã giặt vải | vải trên dây phơi ẩm | cất vào hiên | `robe.materialProtected` |
| WX05 | dân | `cloudy` hoặc `storm_warning`, ngõ | ông Tư buộc hàng rào | giúp buộc lại (nếu muốn) | hàng rào đổi hình |
| WX06 | sư | `storm_warning`, tịnh thất | sư già cất sách khỏi cửa sổ | giúp cất đúng chỗ | sách khô sau bão |
| WX07 | PC ma | `storm_warning`, gốc gạo | tiếng lá gợi câu chuyện mùa lũ của bà Sáu | nghe/quan sát khi đã gặp bà | mảnh lore **về NPC bà Sáu**, không phải ký ức PC |
| WX08 | người sống | `storm`, nơi trú | tiếng mưa dội mái | tự chọn nghe chuyện/đọc kinh | sổ hoặc câu chuyện, không ra bão |
| WX09 | PC ma | `storm`, nghĩa địa | cảnh xưa trong lời kể của bà Sáu | quan sát NPC, không tương tác vật lý | lore về bà Sáu, không tự tăng thẻ tâm PC |
| WX10 | dân | `after_storm`, làng | mái bếp có vệt hở | hỏi thăm, sửa với NPC khác | cảnh nhà thay đổi |
| WX11 | explorer | `after_storm`, ao | lộ vệt đá cũ | quan sát, men theo lối an toàn | mốc mới, lối phụ |
| WX12 | sư/dân | `after_storm`, đường mòn | cành cây nằm ngang | tìm lối vòng hoặc nhờ người phù hợp dọn | đường phụ phục hồi, không khóa chính |

## 6. Các lớp câu chuyện Nhân gian ngoài thời tiết

- **Sinh hoạt nền:** NPC hoạt động có lịch trình, vật dụng thay đổi, cảnh không đợi người chơi bấm nhiệm vụ.
- **Storylet ngắn:** các tình huống nhỏ theo địa điểm × thời gian × vai × thời tiết × việc đã làm, tránh xuất hiện một mẫu liên tục.
- **Tuyến nhiều ngày:** PC sư tự chuẩn bị y màu đất; PC dân giữ lời với bà; chuyện riêng Ông Tư–Bà Sáu–Hạnh là **tuyến NPC** mà PC có thể dõi theo. Thời tiết làm đổi **hành động và lời thoại**, không ngắt tiến trình vô lý.
- **Bí mật môi trường:** ao sen, cây gạo, một lối mòn sau mưa, khe hang, bảo tháp, lời đồn khi trời sắp bão.
- **Phần thưởng khi vắng:** kiến thức, vật liệu, manh mối và thay đổi cảnh có lưu; không tự thưởng thẻ Niệm/Định chỉ từ thời gian offline.

## 7. Đề xuất schema và logic chọn storylet — chưa code

```js
// Mô hình minh họa; không phải API hiện tại
worldWeather = {
  weatherEpisodeId: "ep_42",
  day: 9,
  phase: "after_storm",
  intensity: 0.2,             // dùng hiệu ứng đồ họa, KHÔNG đại diện cho tâm
  upcomingPhase: "clear",
  seenForecast: true
};
storylet = {
  id: "WX10",
  roles: ["villager"],
  place: "village",
  weather: ["after_storm"],
  requires: ["weather:ep_42:storm_finished"],
  reward: "world:roof_repaired",
  trigger: "explicit_interact",
  oncePerEpisode: true,
  cooldownDays: 2,
  loreBasis: "fiction"
};
```

**Chọn sự kiện:** thời tiết được tính một lần theo `gameDay` hoặc `episode` và lưu; storylet chọn trong nhóm tương thích rồi theo độ ưu tiên *đang dở → lời hẹn → phản ứng thời tiết → ngẫu nhiên*. Đối với thời tiết đặc biệt, mỗi lần vào game tối đa một gợi ý nhẹ; không xếp hàng popup. Nếu người chơi vừa trở lại sau nhiều ngày thì hiển thị một bản tóm tắt ngắn về bão đã qua, không ép xem liên tiếp các cảnh lỡ.

**Server / đồng bộ:** nếu có nhiều thiết bị, `weatherEpisodeId + storyletId` phải nhận kết quả một lần ở phía server. Nếu game độc lập theo từng nhân vật, thời tiết theo `runId` của nhân vật; nếu có người chơi khác cùng một thế giới, cần quyết định weather scope riêng trước khi code (tránh client và server tính khác nhau). Weather không phụ thuộc internet hay thời tiết thật để chơi được offline.

## 8. Nghệ thuật, âm thanh và khả năng truy cập

- Bám phong cách **Canvas/SVG vẽ tay dịu, nhẹ, mơ màng** đang có. Mưa là đường mảnh trong không gian, mặt nước gợn, vùng đất ẩm, mây mềm; bão dùng chuyển động lớn hơn có kiểm soát chứ không thay sang phong cách kinh dị/phim thảm họa.
- Layer: mây/nắng ở hậu cảnh, giọt mưa giữa cảnh, vũng nước/nhánh lá ở nền đi được, splash nhẹ ở gần camera. Tránh che NPC/vật tương tác.
- Âm thanh: mưa lá, mái tranh, gió, sấm xa; hạn chế tiếng sấm bất ngờ lớn và flash chớp. Có `reduceMotion`, `muteWeather`, `disableLightningFlash`, `calmMode`.
- Khi bão, UI không phủ lên hình thông báo nguy hiểm liên tục; dùng thay đổi cảnh và lời nhân vật tinh tế. Thiên tai không để lại sự sợ hãi đột ngột có thể ảnh hưởng người nhạy cảm.

## 9. Thứ tự viết → thử → dựng

1. **Ưu tiên mở rộng playable scenarios Nhân gian trong [tài liệu kịch bản](human-world-playable-scenarios.md)**; sau đó chốt W01 (mưa nhẹ) và W03 (sau mưa) nếu chúng phục vụ một câu chuyện đã duyệt. W02 (bão) để backlog tùy chọn. Duyệt tính nhất quán vai, lời hứa, nguồn giáo lý trước khi viết UI.
2. **Thử không cần asset:** dựng state `clear/drizzle/after_storm` với 2–3 sprite/hạt mưa tối giản, 1 địa điểm ao và 1 địa điểm tịnh thất; kiểm tra cùng thời tiết khi chuyển cảnh.
3. **Tạo một mini-episode có hậu quả:** trước bão → trú bão → sau bão; lần vào khác nhau cho thấy NPC và vật thể đổi trạng thái.
4. **Kết nối offline:** học kinh khi mưa, cất vải khi trời chuyển, lúc trở lại nhận kết quả ở Sổ/túi và thấy hiện trạng trong map.
5. **Sau khi người thật thử**, mới mở rộng mùa, nhiều storylet và asset tiết trời.

## 10. Kiểm thử chấp nhận

- [ ] Cùng `gameDay`, chuyển từ giếng qua tịnh thất vẫn thống nhất trời mưa hoặc đang bão.
- [ ] Đi ngang NPC, đứng ngắm trời mưa hoặc đi vào vùng bão: **không tự bật quest popup**.
- [ ] Trước bão có dấu hiệu và lựa chọn trú; không bắt đi ra trời bão để kiếm thưởng.
- [ ] Sau bão cảnh vật, NPC và lối phụ đổi có lý do; vài ngày sau có thể hồi phục kể cả không nhận quest.
- [ ] Cảnh mưa đẹp và có phần thưởng khám phá cho người không làm nhiệm vụ.
- [ ] Cảnh bão và sau bão có ít nhất một truyện riêng hợp ba vai, ma không thực hiện việc vật lý.
- [ ] Không sinh nhiều lần vật liệu/kiến thức/thẻ chỉ do reload, vắng lâu hoặc nhiều thiết bị.
- [ ] Không có lời thoại xem bão là hình phạt nghiệp hoặc đổ lỗi người chịu thiên tai.
- [ ] Cảnh bão vẫn đọc được đường đi, có chế độ giảm hiệu ứng/chớp/sấm.
- [ ] Script đã duyệt trước khi asset được vẽ; tính năng chưa có không bị ghi là đã chạy.
