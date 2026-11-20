# Kế hoạch đêm cho PC người dân — bảy đêm đầu, mini game, thẻ tâm sở v0.2

> **Status:** Proposed (chờ chủ project duyệt, chưa tới mức Approved). v0.2 sửa theo review ngày 2026-11-10.
> **Scope:** narrative / UX / thẻ tâm sở
> **Owner doc:** [kich-ban-vong-ngay.md](kich-ban-vong-ngay.md) (vòng ngày) và [he-thong-tam.md](he-thong-tam.md) (thẻ)
> **Related:** [Player-Centric Narrative Model](player-character-narrative-model.md), [Human World Playable Scenarios](human-world-playable-scenarios.md), [Episode Pack 01](human-world-episode-pack-01.md), [Early Mysteries & HG27](human-world-early-mysteries-and-peta-quest.md), [World Exploration Bible](world-exploration-bible.md)
> **Code status:** Một phần đã có trong `develop`, dựng khi tài liệu còn ở trạng thái Proposed: khung đêm và nút Kết thúc đêm (PR 1), sửa logic thẻ B1–B4 và B6–B9 (PR 2; B5 nhãn "Giữ lại nấu canh" còn), bộ chọn tình huống cơ bản (PR 3), đêm 1 với M1 và ba mốc HG27 (PR 4). Chưa có: đêm 3–7, M2, M3, bốn thẻ mới, lớp đóm sáng. Đối chiếu ngày 2026-11-11; chi tiết còn thiếu ở [review của kịch bản bảy đêm](human-world-villager-night-script.md#9-review-thiết-kế).
> **Last reviewed:** 2026-11-10

Tài liệu này **không tạo lore mới**. Nó chọn, sắp thứ tự và nối các kịch bản đã soạn (HG05, HG06, HG07, HG09, HG12, HG14, HG20–HG27, HG03) thành bảy đêm đầu cho **PC người dân**. Vai nhà sư và hồn ma làm sau, dựa trên những gì học được khi người thật chơi vai dân.

**Tinh thần của bản v0.2:** đây là tài liệu về *bảy đêm sống trong làng và khám phá tâm qua các câu chuyện*, không phải kế hoạch rải thẻ hay rải mini game. Thẻ là một kết quả *có thể có*; phần thưởng thường xuyên là phản ứng của NPC, cảnh vật đổi, manh mối và Sổ Hành Trình.

## 1. Vì sao viết tài liệu này

Nhân vật tạo mới chơi theo chương "đến nơi" (`pa` / `pb`, xem [Player-Centric Narrative Model](player-character-narrative-model.md)). Hiện mỗi đêm của chế độ này chỉ có một cảnh ngắn với một lựa chọn, rồi tự mở quán xét và hồi hướng. Các nhiệm vụ phụ có trong tab Việc đang chờ nhưng đêm không chờ người chơi làm chúng. Kết quả: một đêm chỉ kéo dài vài phút, trong khi [Kịch bản vòng ngày](kich-ban-vong-ngay.md) §1 nhắm tới 10–15 phút.

### Quyết định đã chốt (chủ project)

1. **Quán xét và hồi hướng chỉ mở khi người chơi bấm "Kết thúc đêm"**, và là cơ hội chiêm nghiệm **có thể bỏ qua**, không phải thao tác hành chính mỗi tối.
2. **Bỏ nút "Chọn một vai khác"** ở màn kết đêm và màn quán xét. Một nhân vật gắn với một vai và đi tiếp nhiều đêm.
3. **Làm vai người dân trước**, thử với người chơi thật, rồi mới viết vai nhà sư và hồn ma.
4. **Đêm 1 và đêm 2 có chuyện huyền bí** (Thọ thần, bà ngoại ngạ quỷ) để người chơi thấy còn nhiều điều chưa khám phá.
5. **Mini game ít nhưng thú vị**, tái sử dụng cơ chế, không ép chơi, không tự thưởng thẻ.
6. **Thẻ phải hợp Vi Diệu Pháp** (§5).
7. **Không có khảo sát trong lúc chơi.** Game không hỏi người chơi cảm thấy gì, không có "chọn điều thấy trong lòng", không bảng tâm trạng. **Khảo sát duy nhất** là khảo sát tính cách **một lần, tùy chọn**, ở tab Việc đang chờ; mục đích của nó là làm kịch bản mỗi người **khác nhau** (§3).
8. **Đêm không phải cấp độ bắt buộc.** Việc dở dang chuyển sang đêm sau; một chuyện lớn (HG27) có thể trải qua hơn một đêm.

## 2. Khung một đêm

Phần này chỉ gom lại các luật đã có trong docs.

| Thành phần | Nội dung | Nguồn |
|---|---|---|
| Cảnh mở đầu | 1–2 câu, một lựa chọn nhỏ, rồi người chơi được đi tự do. Câu chữ **do chủ project viết lại**; bản hiện có chỉ để dựng luồng | model PC |
| Việc trong đêm | một danh sách ngắn trong tab Việc đang chờ: **1 việc chính, tối đa 2 tình huống sinh hoạt, 1 việc tự chọn** | [kich-ban-vong-ngay.md](kich-ban-vong-ngay.md) §2 |
| Hạn mức hiển thị | tại một lúc: 1 truyện đang theo, 0–2 chuyện sẵn để nhận, 1–2 dấu khám phá | [Playable Scenarios](human-world-playable-scenarios.md) §1 |
| Mở truyện | chỉ khi người chơi bấm (`explicit_interact`); không popup tự bật | [game-design-principles.md](game-design-principles.md) |
| Kết thúc | nút **Kết thúc đêm** luôn có; xong hết việc thì chỉ nhắc nhẹ một dòng, không chặn | này |
| Quán xét | mở sau nút Kết thúc đêm, **có nút bỏ qua** (bỏ qua vẫn ghi một dòng tối giản vào Sổ) | này |
| Chống lặp | mỗi mẫu `cooldownDays = 2` hoặc `once`; không mẫu nào lặp hai đêm liền | [kich-ban-vong-ngay.md](kich-ban-vong-ngay.md) §2 |
| Bỏ qua | bỏ qua việc nào cũng không phạt; việc dở dang vẫn còn hôm sau | tiêu chí 7 §10 vòng ngày |

**Thời lượng mục tiêu:** khoảng 8–15 phút mỗi đêm, **chỉ là mục tiêu để cân nhịp**, không phải đồng hồ ép người chơi.

**Cần kiểm trong code trước khi chốt:** đồng hồ trời của game có đi hết một đêm (chiều tàn, khuya, rạng sáng) hay không. HG24 (bóng gốc gạo ba buổi) cần biết điều này.

## 3. Tính cách làm kịch bản mỗi người khác nhau

Khảo sát tính cách (đã là việc tùy chọn trong tab Việc đang chờ) cho ra một `carita` (tham, sân, si, tầm, tín, trí) hoặc `null` nếu người chơi chưa làm. Trong bảy đêm, `carita` được dùng **để chọn biến thể câu chuyện**, tuyệt đối không dùng để hỏi thêm người chơi điều gì:

| `carita` | Điều kịch bản cho thấy ở Người này (ví dụ) |
|---|---|
| tham | tiếc nắm rau, tiếc phần xôi, ngắm mãi chiếc đèn đẹp |
| sân | bực khi bị chó sủa, bực khi phải đi tìm bé |
| si | lơ đãng, quên lời hẹn nhỏ, làm sót việc |
| tầm | nghĩ ngợi nhiều, hay đặt câu hỏi về mọi chuyện |
| tín | dễ xúc động trước chuyện bà ngoại, trước ánh đèn |
| trí | muốn hiểu vì sao, hay thử cách khác |
| `null` | lời kể trung tính, **không** có nhịp tâm bất thiện riêng |

Quy tắc:
- Chỉ **một số cảnh chính** (khoảng 4–6 trong bảy đêm) có biến thể theo `carita`; còn lại dùng chung để khỏi viết lại nhiều lần.
- Biến thể là **lời kể và một nhịp tâm đã được viết sẵn** (ví dụ "Người này thấy hơi chạnh lòng khi bà khen nhà bên"), do game kể, không do người chơi tự báo.
- Người chưa làm khảo sát vẫn chơi trọn truyện; họ chỉ không nhận các nhịp riêng đó. Khi làm khảo sát sau, các cảnh *chưa xảy ra* mới đổi theo.
- Tính cách có thể đổi dần (đã nêu ở [he-thong-tam.md](he-thong-tam.md) §5), nên biến thể không được ghi như một nhãn cố định.

## 4. Khám phá và đóm sáng

Hiện người dân có **5 đóm sáng** (3 riêng cho vai: nồi cũ `fv_pot`, khăn cũ `fv_scarf`, đèn cũ `fv_lamp`; 2 chung: tịnh thất, phế tích), mở dần theo số đêm đã chơi. Chừng đó chưa đủ để đi dạo thành thói quen.

Hướng thống nhất với [World Exploration Bible](world-exploration-bible.md) §6 ("Bộ sưu tập của người tò mò"):

| Loại | Ý nghĩa | Khi chạm | Ghi vào |
|---|---|---|---|
| **Đóm vàng** (đang có) | kỷ vật, vật bị bỏ quên; gợi một mảnh chuyện nhỏ | một cảnh ngắn, có thể một lựa chọn | Sổ Hành Trình, phần Nơi chốn và nhân vật |
| **Đóm xanh** (mới) | dấu cảnh đẹp: trăng trên bia đá (HG11), ao sen (HG12), đốm đèn nơi xa (HG14), bóng gốc gạo (HG24) | ngắm là đủ; không nhận quest | một dòng Sổ + gợi ý đường tới nơi khác |
| **Dấu truyện** (đang có, qua tab nhiệm vụ) | chuyện lạ cần bấm vào mới bắt đầu (Thọ thần, mộ thấp) | bắt đầu truyện | tab Việc đang chờ |

Quy tắc: mỗi nơi có phần thưởng khám phá tối thiểu; mỗi đêm chỉ hiện vài đóm gần người chơi; Sổ có thể đếm nhưng **không bắt đủ**, không đổi thẻ hay vật phẩm để cày; chuyện huyền bí được ghi vào Sổ loài và cõi giới với nhãn "trong mô phỏng".

## 5. Thẻ tâm sở: tặng khi nào và vì sao hợp Vi Diệu Pháp

> **Lưu ý duyệt:** phần này dựa trên bảng 52 tâm sở trong `public/cetasika.js` và [he-thong-tam.md](he-thong-tam.md) §4a–§4c (theo Vi Diệu Pháp Toát Yếu). Mọi chi tiết về tâm sở nào đi với tâm nào, tên thường gọi và mặt thẻ **phải được thầy Theravāda duyệt trước khi triển khai**. Đây là mô phỏng để học, không phải thước đo tâm thật.

### 5.1. Nguyên tắc thiết kế

Trong Abhidhamma, một tâm sở được xác định theo đặc tính và điều kiện đi kèm tâm, **không thể suy chắc chỉ từ hành động bên ngoài**. Vì vậy:

- **Làm đúng việc không tự động là có thẻ thiện.** Giữ lời hứa, sửa đồ, trả đúng người là *việc tốt thường ngày*, thưởng bằng phản ứng NPC và cảnh đổi, **không** bằng thẻ.
- **Thẻ thiện chỉ dành cho khoảnh khắc thiện tâm được dựng rõ**: có hoàn cảnh, có điều kiện, và động cơ nằm sẵn trong lời kể hoặc trong nhãn lựa chọn.
- **Thẻ bất thiện được xuất hiện tự nhiên trong đời sống** (ghen tị, tự ái, tiếc của, khó chịu, phóng tâm). Có cơ hội nhận diện tâm bất thiện *không* đồng nghĩa người chơi phải làm việc xấu: nhịp tâm đó do **lời kể** mang lại (§3), sau đó người chơi vẫn có thể chọn hành động tốt. Hai diễn biến tâm khác nhau nối tiếp, không cùng một khoảnh khắc.
- **Không bao giờ hỏi người chơi cảm xúc** để quyết định thẻ (xem §1, quyết định 7).
- **Không có chỉ tiêu** "mỗi đêm một thẻ" hay "bảy đêm đủ N thẻ".

### 5.2. Luật tặng thẻ

| # | Luật | Lý do |
|---|---|---|
| R1 | Thẻ ghi **tâm sở nổi bật** trong khoảnh khắc đã dựng, không phải toàn bộ tâm | một tâm có nhiều tâm sở sinh cùng nhau |
| R2 | Thẻ thiện có **bộ lõi**: 19 tâm sở tịnh hảo đi chung trong mọi tâm thiện; câu chữ không nói "chỉ có" lá ấy | [he-thong-tam.md](he-thong-tam.md) §4c |
| R3 | **Bi, Tùy hỷ** chỉ khi người chơi chủ ý hướng về chúng sinh đang khổ / đang vui (ví dụ ở lại bên họ, chia sẻ, chúc mừng); không cấp chỉ vì bấm "Tiếp" sau một cảnh | đối tượng của hai tâm sở là chúng sinh |
| R4 | **Giới phần** (Chánh ngữ, Chánh nghiệp, Chánh mạng) chỉ khi **cơ hội làm sai có thật trong cảnh** (có thể lấy, có thể nói thêm) và người chơi chọn tránh | giới phần sinh riêng từng lần, đúng lúc kiêng cữ |
| R5 | **Không tham** chỉ khi người chơi **cho đi phần của mình** (không phải chuyển đồ của người khác, không phải trao đổi có đền đáp) | bố thí là cho mà không mong đền |
| R6 | **Hành xả khác Thọ xả**; **Hỷ khác Tùy hỷ**; không dùng tên lẫn lộn | các cặp dễ nhầm |
| R7 | **Tinh tấn có cả trong tâm thiện lẫn bất thiện** (hăng hái để giận cũng có tinh tấn). Chưa cấp thẻ này cho tới khi có mạch học/thực hành phù hợp | danh mục biệt cảnh |
| R8 | Các cặp đối nghịch (sân / không sân, tham / không tham) **không** rơi cùng một khoảnh khắc | không sinh chung |
| R9 | Thẻ **không** rơi từ hồi tưởng NPC, thời gian trôi, việc làm khi vắng, hay vì thắng một mini game | [kich-ban-vong-ngay.md](kich-ban-vong-ngay.md) §9 |
| R10 | Thẻ bất thiện cũng là thẻ, chỉ để hiểu, không lên cấp | [he-thong-tam.md](he-thong-tam.md) §4a |
| R11 | Gặp lại thẻ đã có thì mở mặt sau, không tạo thẻ trùng | he-thong-tam §4a |
| R12 | Câu "lúc nãy" trên thẻ mô tả **đúng điều vừa xảy ra** và dùng ngôi "Người này" | luật giọng kể đã chốt |
| R13 | **Không có bước hỏi tâm trạng** nào trong lúc chơi | quyết định 7 |

### 5.3. Thẻ hiện có và thẻ mới

**Hiện có (15):** Tham, Sân, Si, Hôn trầm, Hoài nghi, Phóng dật, Hối, Lận, Không tham, Không sân, Niệm, Nhất hành (`dinh`), Hỷ, Bi, Tùy hỷ.

**Ưu tiên thêm cho vai dân (theo thứ tự):**

| Thẻ | Nhóm | Vì sao ưu tiên | Khoảnh khắc nhận (phải dựng đủ bối cảnh) |
|---|---|---|---|
| **Tật** (ganh tị, issā) | sân phần | tình huống đời thường rất tự nhiên (người khác được khen, được tặng, làm giỏi hơn mình) | nhịp tâm do lời kể mang lại cho `carita` tham/sân (đêm 6, xem bên dưới); phân biệt với Tham và Ngã mạn |
| **Ngã mạn** (māna) | tham phần | hợp tuyến ông Tư và chuyện chia xôi: sau khi giúp người, muốn được khen hay thấy mình hơn | nhịp tâm do lời kể cho `carita` tham hoặc tầm (đêm 6) |
| **Chánh nghiệp** | giới phần | rõ ràng khi có cám dỗ thật | HG07 giỏ trái cây: cảnh ghi rõ người đang đói và không ai trông, hai lựa chọn "lấy một trái" và "mang đi tìm chủ" cùng hiện (đêm 5) |
| **Chánh ngữ** | giới phần | cần cơ hội nói lời sai và chủ động tránh | storylet mới ở giếng: có chuyện đồn về ông Tư, lựa chọn "kể thêm cho vui" hoặc "chỉ nói điều mình thấy" (đêm 6; chuyện mới, cần duyệt) |

**Hoãn:** Tinh tấn, Hành xả (chờ mạch học/thực hành), Tàm, Quý, Tín (chờ thầy duyệt phân biệt và cảnh phù hợp).

**Không** dự kiến cho vai dân giai đoạn này: Tầm, Tứ, các khinh an, tịnh, Trí tuệ, Dục, Thắng giải.

Mỗi thẻ mới cần hình trong `cetasika-art.js`, mặt sau theo Chú giải/Thanh Tịnh Đạo (xem [he-thong-tam.md](he-thong-tam.md) mục "Mặt sau"), và cập nhật test catalog.

### 5.4. Việc sửa logic tặng thẻ đang có trong code (backlog)

Các điểm này đã đối chiếu với `develop` và cần sửa **trước hoặc cùng** lúc dựng bảy đêm, vì kịch bản dùng lại các tuyến này:

| # | Vị trí | Vấn đề | Hướng sửa |
|---|---|---|---|
| B1 | `encounters.js` `petaMeet` | nghe bà ngoại kể mình từng tiếc của → nhận **Lận** | PC đang nghe chuyện của NPC, không phải tự trải nghiệm. Bỏ thẻ ở bước này (HG27 chỉ định Bi, Không tham, Tùy hỷ) |
| B2 | `encounters.js` `childHome` | mẹ bé Na đoàn tụ → nhận **Tùy hỷ** khi bấm "Tiếp", kể cả khi trước đó đã quát bé | Tùy hỷ chỉ khi người chơi đã chọn ở lại/dỗ dành (R3); nhánh quát thì không thẻ |
| B3 | `mind.js` trả rau má | trả bà cụ → nhận **Không tham** | giữ lời hứa không phải bố thí; bỏ thẻ (R5), thưởng bằng nồi canh và lời bà |
| B4 | `encounters.js` ông lái buôn | tặng rau đổi bánh đa → nhận **Không tham** | có trao đổi lợi ích; bỏ thẻ |
| B5 | `mind.js` "Giữ lại nấu canh" | nhận **Tham** với lý do "muốn giữ cho mình" nhưng nhãn lại nói về nấu canh | tách hai nhãn rõ động cơ, hoặc bỏ thẻ ở nhãn trung tính |
| B6 | `mind.js` mang rau sang ông Tư | nhận **Không sân**, và cho phép thay lời hứa với bà cụ | bỏ nhánh (đã yêu cầu ở HG05) |
| B7 | `mind.js` `survey` quét 9 lá | tốc độ chạm quyết định Tham/Sân/Si | thay bằng câu chọn tình huống hoặc đổi cách chấm; kết quả vốn chỉ là gợi ý |
| B8 | `app.js` màn kết đêm | còn nút "Chọn một vai khác" | bỏ (quyết định 2) |
| B9 | `reflect.js` | quán xét chưa bỏ qua được | thêm lối bỏ qua |

## 6. Mini game

### Nguyên tắc

1. **Ít mà thú vị:** chỉ giữ trò có cảm giác khám phá, tác động vào thế giới và muốn chơi lại. Việc nào không cần trò thì thành **tương tác trong truyện** (vài thao tác kèm hiệu ứng đẹp).
2. **Tái sử dụng cơ chế:** vài cơ chế dễ học (đặt vật vào vị trí, dò theo âm thanh, gói/sắp xếp) cho nhiều câu chuyện.
3. **Không có thất bại, không bắt chơi**, luôn có lối "để lúc khác".
4. **Không thưởng thẻ** theo điểm số hay tốc độ (R9).
5. **Truy cập được:** mọi tín hiệu âm thanh có kèm tín hiệu hình; không thao tác theo phản xạ.
6. Dùng lại khung bảng chọn sẵn có trong `mind.js`.

### Kiểm kê hiện có (đã sửa)

| Mini game | Nơi trong code | Trạng thái |
|---|---|---|
| Hái rau má | `mind.js` | có, chơi được |
| Quét lá | `mind.js` (khảo sát) | có, chơi được |
| Ngồi giữ quả cầu | `mind.js` (sit) | có, chơi được |
| Đẩy xe ngựa | `encounters.js` | **chưa phải mini game**: chỉ là lựa chọn "Ghé vai đẩy giúp" |

### Giữ ba mini game mới

| # | Tên | Gắn với | Vì sao đáng chơi | Dùng chung cơ chế |
|---|---|---|---|---|
| M1 | **Lần theo tiếng khóc** | bé Na lạc (đêm 1) | khám phá bụi tre, âm thanh to dần khi lại gần; thêm gợi ý hình (đốm nhấp nháy) cho người không nghe âm thanh | dò theo tín hiệu |
| M2 | **Đặt vật vào chỗ** | treo đèn ngõ (đêm 4), đóng nêm gáo (đêm 3) | phản hồi rõ: treo xong ngõ sáng lên; kéo thả, không canh thời điểm | đặt vật |
| M3 | **Gói xôi lá chuối** | chia xôi (đêm 6) | gấp lá, đặt phần, buộc gói; hoạt ảnh và âm thanh dễ chịu; biến thể theo tuyến ông Tư | gói / sắp xếp |

### Chuyển thành tương tác trong truyện

- Xới cơm cho bà ngoại: vài chạm kèm hiệu ứng, không có màn riêng.
- Bưng bát đi qua nghĩa địa: bỏ (trùng việc xới cơm).
- Làm quen con Vàng: chọn ngồi thấp, chờ nó lại gần, đưa tay cho nó ngửi; điều quan trọng là biểu cảm của con Vàng.

### Có thể bổ sung về sau (khi vai khác và đêm thường đã có)

Xếp đá dẫn dòng suối; tiếng chuông trong gió (tìm dấu ở tháp, có chế độ gợi ý hình); thắp sáng nhiều đoạn ngõ theo bố cục tự do (cùng cơ chế M2).

## 7. Kịch bản từng đêm (PC người dân)

Quy ước: **Chính** là việc chính; **Phụ** là tình huống sinh hoạt (tối đa 2); **Tự chọn** là việc người chơi chọn làm hay không; **Cơ hội tâm** là chỗ truyện có thể đưa ra nhịp tâm (có thể là thẻ, theo §5); **Thế giới đổi** là hệ quả nhìn thấy. Lời thoại dưới đây là gợi ý, chủ project sẽ viết lại. Cảnh mở đầu dùng "bạn"; mô tả tâm và thẻ dùng "Người này". Số đêm chỉ để sắp thứ tự, không phải cấp độ.

### Đêm 1 — Lá gạo sáng (huyền bí: Thọ thần)

Nền: chuyện cây gạo và bé Na lạc đã có trong `encounters.js`.

| Nhịp | Nội dung |
|---|---|
| Mở đầu | cảnh `pa` (tới làng, hàng xóm chỉ giếng) — **viết lại** |
| Giếng | gặp bà cụ; nghe lời đồn "lá cây gạo có khi sáng lên lúc chạng vạng"; bà đang xoay mãi cán gáo lỏng (mầm cho đêm 3) |
| Dạo | đóm vàng nồi cũ; ao sen buổi chiều (đóm xanh) |
| **Chính** | chạng vạng, lá gạo sáng, Thọ thần xin đưa đứa bé lạc về nhà |
| Mini game | **M1** lần theo tiếng khóc |
| Cơ hội tâm | gặp bé: *quát* (tâm sân, `carita` sân càng rõ trong lời kể) hoặc *ngồi xuống dỗ dành* (**Bi**). **Không** có Tùy hỷ tự động: chỉ khi người chơi chọn ở lại thấy hai mẹ con đoàn tụ sau khi dỗ dành |
| Hệ quả | bé về nhà; lá cây gạo sáng lại. Nếu đã quát, mẹ bé chỉ nhìn Người này hơi dè; **không** thẻ ở bước này |
| Phụ | HG26 nghe chuông chiều (không thẻ, không việc) |
| Kết đêm | bà cụ nói: "Mộ thấp bên nghĩa địa dạo này có tiếng khẽ, như ai kêu đói." (mầm đêm 2) |
| Khám phá | gốc gạo, **Thọ thần** vào Sổ loài và cõi giới, ngõ làng, bụi tre, giếng, ao |
| Thế giới đổi | lá cây gạo sáng lúc chạng vạng những đêm sau; bé Na nhận ra Người này |

### Đêm 2 — Bà ngoại bên mộ thấp (huyền bí: ngạ quỷ, HG27)

Nền: HG27 là "signature quest đầu game", nâng cấp chuỗi `Q("peta")`. **Có thể trải qua hơn một đêm**, người chơi dừng giữa chừng được (bà vẫn chờ).

| Nhịp | Nội dung |
|---|---|
| Mở đầu | chạng vạng, bà cụ nhắc "tiếng đói" |
| Gặp | bóng gầy dưới gốc mộ: "Có ai còn nhớ đến bà không?" → Đến gần / Đứng nghe / Đi tiếp |
| **Chính** | bà kể mình đói đã lâu; Người này chọn giúp. Hỏi bà cụ giếng |
| Cơ hội tâm | **Bi**: ở lại nghe và chọn giúp. Bà **không** cấp thẻ Lận ở bước nghe kể (sửa B1) |
| Chuẩn bị | bà cụ cho cơm nóng; xới cơm (tương tác ngắn) |
| Cho đi | người chơi có thể **chia phần cơm của chính mình** thêm vào bát; chọn này (và hồi hướng) mới là **Không tham** (R5). Chỉ chuyển đồ của bà cụ thì không thẻ |
| Hồi hướng | trao cho **vị sư già** ngồi giữa mộ; "Cùng hồi hướng" (ba nhịp thở, không bấm hàng chục lần) |
| Kết | **cinematic** bà sáng dần, mỉm cười, tan vào ánh trăng. **Tùy hỷ** chỉ khi người chơi chọn ở lại nhìn cho tới khi ánh trăng tan |
| Khám phá | **Ngạ quỷ (peta)** vào Sổ loài, nhãn "trong mô phỏng" (nguồn Khp 7 / Pv 1.5 cần thầy duyệt); mục Sổ "Một lần giúp được người đang khổ" |
| Thế giới đổi | mộ thấp yên, chỉ còn gió và chiếc lá; **không spawn lại** bà |
| Lưu ý | không hộp thưởng che cảnh kết; ba mốc ghi đúng lúc, tổng kết nhẹ sau khoảng lặng; không bắt xong trong một đêm |

### Đêm 3 — Nắm rau má và chiếc gáo

| Nhịp | Nội dung |
|---|---|
| **Chính** | **HG05** bà cụ nhờ hái rau má cho canh; nhận lời, ra gốc mít |
| Tương tác | hái rau (mini game có sẵn); mang về giếng |
| Cơ hội tâm | lời kể theo `carita`: với `carita` tham, nắm rau thơm non và Người này **tiếc**. Hai nhãn rõ động cơ: "Giấu bớt một phần cho mình" (**Lận** hoặc **Tham**, theo lời kể) và "Đưa trọn cho bà". Đưa trọn cho bà **không** có thẻ (giữ lời hứa); thưởng bằng nồi canh. **Không** cho đem sang ông Tư thay lời hứa |
| Phụ | **HG25** hai chiếc gáo: dùng **M2** đóng nêm cán gáo; thưởng là gáo mới, bà kéo nước dễ hơn. **Không** thẻ (Tinh tấn, Hành xả hoãn) |
| Tự chọn | HG13 ông lái buôn: lựa chọn "Ghé vai đẩy giúp" (chưa phải mini game) |
| Khám phá | đóm vàng khăn cũ; HG11 trăng trên bia đá (đóm xanh) |
| Thế giới đổi | nồi canh bà nấu; gáo mới |

### Đêm 4 — Ngõ có đèn

| Nhịp | Nội dung |
|---|---|
| **Chính** | **HG21** ngọn đèn: phụ ông Tư treo đèn — **M2** (đặt đèn lên đúng chỗ) |
| Phụ | **HG23** con Vàng sủa người lạ; ông Tư gọi nó vào hiên. **Không** cắn tự động. Người chơi ngồi thấp chờ nó lại gần |
| Cơ hội tâm | với `carita` sân, lời kể cho Người này **bực** khi chó sủa; có nhãn "Quát đuổi nó" (**Sân**). Chuyển biến làm hòa ở lần gặp sau mới có thể là **Không sân**: chỉ khi trước đó đã bực và chọn ngồi xuống chờ (R8) |
| Tự chọn | dạo ra bụi tre ngắm đèn từ xa |
| Khám phá | đóm vàng đèn cũ |
| Thế giới đổi | ngõ sáng; con Vàng hiền hơn ở lần sau |

### Đêm 5 — Ba bát xôi (1)

| Nhịp | Nội dung |
|---|---|
| **Chính** | **HG06 lượt 1–2.** Lượt 1: bà cụ nhắc người bán xôi năm trước. Lượt 2: ông Tư bên hiên, nhìn nồi xôi và lặng một lát; ông nói gắt vì lo. Người chơi chọn nghe, hỏi thêm, hoặc đi tiếp; ông nhớ cách Người này đáp |
| Phụ | **HG07** chiếc giỏ bên đường: lời kể nói rõ Người này đang đói, không ai trông. Hai lựa chọn hiện cùng lúc: "Lấy một trái" (**Tham**, nếu chọn) và "Mang đi tìm chủ" (**Chánh nghiệp**, R4) |
| Tự chọn | **HG24** gốc gạo, lượt 1 |
| Khám phá | HG14 đốm đèn nơi xa (đóm xanh) |

### Đêm 6 — Ba bát xôi (2)

| Nhịp | Nội dung |
|---|---|
| **Chính** | **HG06 lượt 3**: người chơi tự chọn phụ gói xôi chia cho người khó khăn; nếu không tham gia, ông Tư vẫn tự làm |
| Mini game | **M3** gói xôi lá chuối |
| Phụ | **HG09** bé Na vẽ tranh, chị Ba kể; hoặc buổi giếng có chuyện đồn về ông Tư (chuyện mới) |
| Cơ hội tâm | (a) bà cụ khen nồi xôi nhà ông Tư: với `carita` tham/sân, lời kể cho nhịp **Tật** ("hơi chạnh lòng"); với `carita` tầm, nhịp **Ngã mạn** ("nghĩ mình cũng làm được thế"). Sau đó người chơi vẫn chọn "Chúc mừng ông" (chủ ý vui theo, **Tùy hỷ** theo R3) hoặc im lặng. (b) chuyện đồn: "Kể thêm cho vui" hoặc "Chỉ nói điều mình thấy" (**Chánh ngữ** nếu chọn nhãn sau) |
| Thế giới đổi | những phần xôi được chia; tranh bé Na treo ở nhà chị Ba |

### Đêm 7 — Điều chưa nói

| Nhịp | Nội dung |
|---|---|
| **Chính** | **HG06 lượt 4**: ông Tư kể một câu ngắn về chuyện được ăn chịu hồi nhỏ; Người này nghe, hỏi thêm, hoặc ra ngõ ngắm đèn |
| Phụ | **HG03** trang kinh: gặp khó khăn thật rồi **chủ động hỏi sư già** về triền cái; có thể giao "học một đoạn" khi vắng. Chỉ cấp **kiến thức đã nghe** ở khu Đã học |
| Tự chọn | HG24 lượt 3; HG20 một buổi sáng bình thường |
| Thế giới đổi | dòng thời gian "Bảy đêm ở làng" trong Sổ; không huy hiệu hay điểm |

Đêm 7 trở đi mở **chiều sâu khác**: học pháp, tu tập tự chọn, hang, tháp, các tuyến cõi giới. Không ép người dân phải chọn tu.

### Đêm thường

Mỗi đêm bốc 1–2 mẫu từ kho, có `cooldown`, `once`, điều kiện vai, nơi, giờ: HG07, HG13, HG19, HG20, HG11/12/14, HG15/16 (mưa nhẹ, sau mưa, thỉnh thoảng), HG17 (kinh hành), chuyện hoa sen, hang, tháp, địa thần, chư thiên (mở theo điều kiện thẻ như hiện tại).

## 8. Đánh giá độ hấp dẫn

**Đủ để thử nghiệm:** khoảng bảy đêm chính, hai chuyện huyền bí ở hai đêm đầu, một câu chuyện cảm xúc chính (HG27), một tuyến nhân vật dài (ông Tư), kịch bản khác nhau theo tính cách, và đóm khám phá.

| Điểm mạnh | Rủi ro | Cách xử lý |
|---|---|---|
| HG27 và Thọ thần ở hai đêm đầu | nhiều tình huống chỉ là đọc rồi chọn | tương tác nhỏ trong truyện + 3 mini game thú vị |
| NPC nhớ việc người chơi làm | kho chỉ còn ~12 mẫu sau bảy đêm | viết đợt 2 theo số liệu thử |
| Thế giới đổi nhìn thấy được | phần thưởng thẻ ít | phản ứng NPC, cảnh đổi, manh mối, Sổ là phần thưởng chính |
| Biến thể theo tính cách làm người chơi khác nhau | chi phí viết biến thể | chỉ 4–6 cảnh chính có biến thể |

**Cần đo khi người thật chơi:** thời lượng thật mỗi đêm; bao nhiêu người kết thúc đêm sớm; đêm nào họ dừng; mini game nào bị bỏ qua nhiều; thẻ nào hay rơi, thẻ nào không ai thấy; người làm khảo sát có thấy kịch bản khác không.

## 9. Dữ liệu đề xuất (chưa code)

Mỗi tình huống là dữ liệu theo khuôn ở [Playable Scenarios](human-world-playable-scenarios.md) §6, thêm trường `variants` theo `carita` cho các cảnh có biến thể:

```js
// Pseudocode, chưa phải API.
const scene = {
  id: "HG06_L2", role: ["villager"], once: true,
  variants: { default: "...", tham: "...", san: "...", tam: "..." }, // lời kể; null/chưa khảo sát => default
  beats: { tham: { card: "tat", when: "after_praise" } },           // nhịp tâm do truyện kể, không do người chơi tự báo
};
```

- Tiến độ đêm lưu **theo nhân vật** (`characterId`); đăng nhập lại giữa đêm thì tiếp tục đúng chỗ.
- Mỗi tình huống hoàn thành ghi một sự kiện vào Sổ Hành Trình với **id cố định** (không nhân đôi), theo [journey-memory-and-return-ux.md](journey-memory-and-return-ux.md) §6.1.

## 10. Lộ trình PR và tiêu chí nghiệm thu

| PR | Nội dung |
|---|---|
| 0 | **PR tài liệu này** (chờ duyệt) |
| 1 | Khung đêm: bỏ tự đóng đêm, "Việc trong đêm", nút "Kết thúc đêm", quán xét bỏ qua được, bỏ "Chọn một vai khác" (B8, B9) |
| 2 | **Sửa logic tặng thẻ cũ** (B1–B6) và bỏ bước chấm theo tốc độ trong khảo sát (B7) |
| 3 | Bộ chọn tình huống theo dữ liệu (`cooldown`, `once`, biến thể theo `carita`), lưu tiến độ, ghi Sổ |
| 4 | Đêm 1 (M1) và đêm 2 (HG27) |
| 5 | Đêm 3–4 (HG05 sửa, HG25, HG21, HG23, M2) |
| 6 | Đêm 5–7 (HG06, HG07, HG09, HG24, HG03, M3) và thẻ Tật, Ngã mạn, Chánh nghiệp, Chánh ngữ |
| 7 | Lớp đóm sáng mới và Sổ khám phá có đếm |
| 8 | Đêm thường |

**Tiêu chí nghiệm thu giai đoạn người dân:**
- [ ] Đêm 1 và đêm 2 có chuyện huyền bí chơi được trọn vẹn.
- [ ] Quán xét chỉ mở khi bấm Kết thúc đêm, bỏ qua được; không còn nút chọn vai khác.
- [ ] **Không có màn hỏi tâm trạng nào** trong lúc chơi; chỉ có khảo sát tính cách một lần, tùy chọn.
- [ ] Kịch bản khác nhau giữa người đã và chưa khảo sát, và giữa các `carita`, ở 4–6 cảnh chính.
- [ ] Không thẻ nào rơi vì làm đúng việc, vì xem cảnh, hay vì thắng mini game.
- [ ] Mỗi thẻ thiện có hoàn cảnh và điều kiện (R3–R5) ghi rõ.
- [ ] Mỗi mini game bỏ qua được, không có thất bại.
- [ ] Bà cụ nhờ hái rau thì không thể đưa nắm rau sang ông Tư mà vẫn tính hoàn thành lời hứa; con Vàng không cắn tự động.
- [ ] PC người dân không có ký ức hay món nợ của ông Tư.
- [ ] Save cũ không đổi; reload không nhân đôi phần thưởng.

## 11. Câu hỏi mở

1. Đồng hồ trời có đi trọn một đêm không (ảnh hưởng HG24)?
2. Có làm chuyện đồn về ông Tư ở đêm 6 (storylet mới) không, hay để Chánh ngữ ở đợt sau?
3. Bao nhiêu cảnh nên có biến thể theo `carita`: 4–6 như đề xuất, hay ít hơn cho bản thử đầu?
4. Biến thể cho người chưa làm khảo sát: dùng lời kể trung tính (như đề xuất) hay chọn ngẫu nhiên một biến thể?
5. Cảnh mở đầu `pa` / `pb`: chủ project sẽ viết lại; trong lúc chờ có dùng bản tạm hiện có không?
6. Thầy duyệt phần nào trước: hồi hướng ở HG27, nguồn Khp 7 / Pv 1.5, hay bảng thẻ mới?

## 12. Việc cần giáo thọ duyệt (gom lại)

- Thành phần tâm và danh sách tâm sở đi cùng ở các thẻ mới (Tật, Ngã mạn, Chánh nghiệp, Chánh ngữ).
- Mặt sau của bốn thẻ mới.
- Phân biệt Hành xả với Thọ xả; Hỷ với Tùy hỷ; Tàm với Quý (khi mở lại).
- Câu chữ về hồi hướng và ngạ quỷ ở HG27; ranh giới "đã được an" với "giải thoát tối hậu".
- Việc giới phần chỉ sinh khi có cơ hội và kiêng cữ (R4).
