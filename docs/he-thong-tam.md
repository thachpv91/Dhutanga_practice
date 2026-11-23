# Hệ thống tâm: học Vi Diệu Pháp qua trải nghiệm

> Trạng thái: **tài liệu thiết kế, một phần đã có trong game** (xem bảng *Trạng thái triển khai* bên dưới). Nội dung giáo lý (nhóm tâm sở, thẻ tâm sở, gợi ý tu tập, cách hiện giác chi) **cần thầy Theravāda duyệt** trước khi đưa vào game.

> **Quyết định về danh tính người chơi (08-11-2026):** [Player-centric Narrative Model](player-character-narrative-model.md). PC tạo tên và chọn vai `monk/villager/ghost` nhưng **không phải Sư Tịnh, Ông Tư, Bà Sáu**. Thẻ/chỉ số và việc tu tập phải gắn với trải nghiệm **của PC**, không cấp khi xem hồi tưởng của NPC. Các dòng dưới đây mô tả phần code legacy ở `develop`, có những quest vẫn dùng vai nhân vật cố định; cần chỉnh trong PR kỹ thuật sau, chưa triển khai ở đây.

## Trạng thái triển khai

| Hạng mục | Mục trong tài liệu | Trạng thái | Ghi chú |
|---|---|---|---|
| Khảo sát tính cách bằng câu chọn tình huống (quét sân, hoa, bát cơm; tùy chọn trong Việc đang chờ), sáu hạng tính | mục 5 | **Đã có** | — |
| Chỉ số tâm ngầm, quả cầu tâm đầy khi ngồi | mục 6 | **Đã có** | — |
| Chuỗi "chó cắn" | mục 7 | **Đã có** | — |
| Thẻ tâm sở, mở mặt khi gặp lại, album | mục 4a | **Một phần** | Có 10 thẻ (Sân, Hối hận, Tham, Không sân, Không tham, Niệm, Hỷ, Bỏn xẻn, Bi, Tùy hỷ); album chưa tự xếp lại theo nhóm |
| Ra thẻ đối trị, cấp thẻ kiểu FIFA | mục 4b | **Đề xuất** | — |
| Bộ bài tâm | mục 4c | **Đề xuất** | — |
| Ngồi thiền và thất giác chi | mục 9 | **Một phần** | Có ngồi và quả cầu, chưa có giác chi |
| Chư thiên, thọ thần, địa thần, ngạ quỷ, người thân | mục 9a | **Một phần** | Có chư thiên, thọ thần (chuỗi bé Na), địa thần, ngạ quỷ bà cụ (hồi hướng); bảng cấu trúc tâm của loài đã có |
| Thiên cung (gò tháp) | mục 9b | **Một phần** | Có cảnh cung điện và luật ở lại/tan |
| Hang đá ẩn sau tảng đá, các buồng trong hang | mục 9b, 15.2 | **Một phần** | Có, nhưng chưa phải thế giới riêng nhiều tầng |
| Ao sen đêm trăng, xe ngựa trên đường, tin đồn | mục 9b | **Đã có** | — |
| Sổ khám phá, dấu hỏi trên bản đồ | — | **Đã có** | — |
| Vật phẩm có hình minh họa, túi đồ | — | **Đã có** | — |
| Tài khoản Google, nhiều nhân vật, hồ sơ nhân vật | — | **Đã có** | Không thuộc tài liệu này, xem README |
| Thẻ bất thiện 3 lần rồi "đã hiểu", album hai phần | mục 15.1 | **Đã có** | 4 thẻ bất thiện; câu đối trị cần thầy duyệt |
| Phận sự tịnh xá, 13 hạnh đầu đà, năm triền cái | mục 15.3–15.5 | **Đề xuất** | — |
| Vòng ngày, quán xét cuối ngày, việc khi vắng, cột mốc | mục 16 | **Một phần** | Có lưu tiến độ, quán xét cuối đêm, hồi hướng, câu hẹn ngày mai, việc khi vắng, "Trong lúc vắng", cột mốc và trang Dấu mốc; chưa có các buổi trong ngày |
| Lời hẹn thành thật, làng có trí nhớ | mục 17.1 | **Đã có** | 12 lời hẹn có kết quả đêm sau; 5 việc làng nhớ (rau cho bà cụ, rau cho ông Tư, ngồi với sư già, dắt bé Na về, dâng cơm bà ngoại); cột mốc ẩn "Lời hẹn đã đến", "Muốn chơi thêm". Lời cần duyệt |
| Triền cái khi ngồi, đêm rằm, bộ đôi thẻ, y phấn tảo, đặt hoa | mục 17.2–17.6 | **Đề xuất** | Thứ tự làm và kiểm chứng ở 17.8 |
| Kết quả khi vắng, khu Đã học (Sổ Hành Trình) và kiến thức mở nhiệm vụ | mục 18; [kịch bản vòng ngày](kich-ban-vong-ngay.md) | **Đề xuất mới, chưa code** | Phần thưởng học và vật liệu thật thay chuyện kể đơn thuần |
| Lời hứa rau má của bà cụ | mục 18.3 | **Cần sửa** | `atMit()/picked2()` cho đổi người nhận bất ngờ |

> **Quyết định thiết kế mới (07-11-2026):** [Game Design Principles](game-design-principles.md) là chuẩn ưu tiên cao hơn các đề xuất cũ về việc bắt buộc khảo sát, thẻ tâm, tăng chỉ số và mở cõi. **Game trước; học thông qua tò mò; tự do đi dạo; phân biệt mô phỏng, kinh điển, chú giải và sáng tác.** Thanh chỉ số tâm là biến nội bộ của game, **không đo tâm sở thực hay nghiệp**. Thẻ là cơ hội tìm hiểu hoặc minh chứng đã tham gia tình huống mô phỏng; không chứng nhận Định/Niệm thực. Không yêu cầu làm bất thiện để lấy thẻ. Cổng cõi không mở bằng cách cộng điểm tâm hay tổng thẻ như công thức giáo lý; dùng sự kiện, vật dẫn, kiến thức và trải nghiệm có bối cảnh. **Không tự popup nhiệm vụ khi đi ngang**, khảo sát đầu game phải có thể bỏ qua. Quy định cụ thể ở tài liệu nguyên tắc.

## 0. Mục đích và tinh thần

**Mục đích:** qua việc chơi, người chơi hiểu dần về tâm, tâm sở và cách tu tập trong Phật giáo. Lộ trình đi từ tổng quan vào chi tiết (gộp → tách → gộp lại), dựa trên Vi Diệu Pháp (Abhidhamma).

**Ba điều luôn giữ:**

1. **Đây là mô phỏng giả định.** Tâm không thể đo bằng con số. Công thức trong game chỉ là cách gần đúng để chơi, có cả yếu tố hên xui để không cứng và máy móc. Game nói rõ điều này với người chơi (mục 2).
2. **Vui trước, sâu sau.** Đa số người chơi chỉ muốn làm nhiệm vụ, khám phá bản đồ, gặp người khác. Họ chơi trọn vẹn mà không cần biết một thuật ngữ nào.
3. **Chiều sâu dành cho người tò mò.** Ai chơi lâu, làm nhiều nhiệm vụ thì **thu thập thêm thẻ tâm sở** và mở dần các bậc kiến thức. Không bắt người chơi đọc sách lý thuyết để mở khóa.

## 1. Nguồn tham khảo

- **Kinh Paṭhama Ānanda** (SN 46.3): chuỗi niệm hơi thở → Tứ niệm xứ → Thất giác chi → Minh và Giải thoát; bảy giác chi sinh theo thứ tự; tu "thường xuyên, liên tục, lặp đi lặp lại".
- Bài giảng của **Thiền sư Kyunpin (U Jaṭila)**, Sư cô Diệu Pháp (Sudhamma) dịch:
  - 2017, bài 1 (kinh văn): https://ngaikyunpin.wordpress.com/2022/09/21/1-phap-2017-thien-vien-kyunpin-bai-1/
  - 2018, bài 6 (lời giảng cùng kinh): https://ngaikyunpin.wordpress.com/2022/09/18/2018-thien-vien-kyunpin-bai-6/
  - Nửa sau bài 2018 mới đọc qua bản tóm tắt, **chưa đối chiếu nguyên văn**.
- **Thanh Tịnh Đạo** (Visuddhimagga): sáu hạng tính (chương III) và đề mục hợp với từng hạng; quân bình ngũ căn.
- **Vi Diệu Pháp Toát Yếu** (Abhidhammattha Saṅgaha), ví dụ bản *A Comprehensive Manual of Abhidhamma* của Bhikkhu Bodhi: 52 tâm sở, 89/121 tâm, 37 phẩm trợ đạo.
- **Trường Bộ, Kinh Phúng Tụng (DN 33)**: ba loại tuệ (văn, tư, tu).
- **Kinh Lửa** (SN 46.53): khi tâm chìm thì nuôi giác chi nào, khi tâm động thì nuôi giác chi nào (dùng cho thẻ đối trị).
- **Tương Ưng Chư Thiên** (SN 1) và **Kinh Ngoài Bức Tường** (Tirokuḍḍa, Tiểu Tụng): chư thiên đến hỏi đạo lúc đêm khuya; ngạ quỷ thân quyến và hồi hướng.
- **Chuyện Thiên Cung** (Vimānavatthu) và **Chuyện Ngạ Quỷ** (Petavatthu), Tiểu Bộ Kinh: nguồn chuyện ngắn về nghiệp và quả cho các cuộc gặp (mục 9b).
- **Tăng Chi, AN 3.37**: Tứ Đại Thiên Vương đi xem xét thế gian vào ngày trai giới (chu kỳ trăng trong game).

Lời giảng 2018 nhấn mạnh và game dùng làm luật chơi:

- giữ **một đề mục chính**, không phân tích, không hỏi vì sao;
- **ghi nhận đã là tâm thiện** ("giận, giận" thì nó tự lắng);
- dấu hiệu niệm giác chi: tâm tự bám đề mục, như *viên đá chìm xuống nước*;
- lỗi thường gặp: chống lại cái khó chịu, phân tích, bám cái dễ chịu, bỏ ngồi khi đau.

## 2. Lời nhắc "đây là mô phỏng"

Hiện ở ba chỗ, ngắn gọn, không giảng giải:

- **Màn đầu**, một dòng: *"Các chỉ số tâm trong game là mô phỏng để chơi, không phải thước đo tâm thật."*
- **Chân mọi thẻ chi tiết:** *"Mô phỏng giản lược. Hãy hỏi thầy để hiểu đúng."*
- **Trang "Về hệ thống tâm"** trong phần giới thiệu: nguồn tham khảo, cách game giản lược, và lời mời đọc kinh sách thật.

## 3. Ba lớp người chơi, ba độ sâu

| Lớp | Ai | Thấy gì | Thuật ngữ |
|---|---|---|---|
| **Dạo chơi** | mới vào, chơi cho vui | vòng màu tâm, quả cầu khi làm nhiệm vụ, câu ngắn kiểu *"Người này thấy nhẹ lòng hơn"* | **không có** |
| **Tò mò** | đã làm vài chuỗi nhiệm vụ | bấm vòng tâm mở bảng chi tiết: 3 gốc xấu, 3 gốc tốt, 5 nhóm Tín Tấn Niệm Định Tuệ, gợi ý nên làm gì | tên Việt quen thuộc |
| **Đi sâu** | chơi lâu, đã có nhiều thẻ | mặt sau của thẻ, Bảng tâm, chuỗi giác chi, màn "gộp lại" | thuật ngữ Việt, Pāli để trong ngoặc |

**Quy tắc chống ngợp:**

- 30 phút đầu (hoặc trước khi xong chuỗi nhiệm vụ đầu tiên): **không có một từ Pāli hay thuật ngữ Hán Việt khó nào** trên màn hình.
- Mỗi lần chỉ mở **một** khái niệm mới, và luôn ngay sau khi người chơi vừa trải qua nó.
- Thuật ngữ mới luôn đi kèm một câu đời thường, ví dụ *"Sân: cái nóng trong lòng khi bị trái ý."*
- Mọi bảng chi tiết đều có thể đóng lại; không bắt buộc đọc để đi tiếp.

## 4. Lộ trình kiến thức: gộp → tách → gộp lại

| Bậc | Mở khi | Người chơi thấy | Bài học |
|---|---|---|---|
| 0 | từ đầu | vòng màu, quả cầu | tâm lúc này dễ chịu hay nặng nề |
| 1 | thẻ đầu tiên (xong nhiệm vụ đầu) | 3 gốc xấu (tham, sân, si), 3 gốc tốt (không tham, không sân, không si) | mọi việc làm đều có gốc |
| 2 | có khoảng 6–8 thẻ | 5 nhóm Tín Tấn Niệm Định Tuệ; 5 chướng ngại | năng lực tu tập và cái cản trở |
| 3 | có khoảng 15 thẻ | album xếp thẻ theo 4 nhóm tâm sở (7 biến hành, 6 biệt cảnh, 14 bất thiện, 25 tịnh hảo) | một tâm gồm nhiều tâm sở cùng sinh |
| 4 | đủ thẻ cho một loại tâm | các tâm xếp theo gốc và thọ | một sát-na tâm cụ thể là gì |
| 5 | có đủ các bộ thẻ liên quan | **gộp lại**: căn, lực, giác chi, đạo chi đều quy về cùng nhóm tâm sở; 37 phẩm trợ đạo quy về khoảng 14 pháp | thấy toàn hệ thống |

Mọi bậc đều mở bằng **thẻ thu được từ nhiệm vụ** (mục 4a), không bằng đọc sách lý thuyết.

### Các màn "à, ra vậy" ở bậc 5

**Ngũ căn và ngũ lực là cùng năm tâm sở:** tín, tinh tấn, niệm, nhất tâm, tuệ. Gọi là *căn* khi nó làm chủ trong phạm vi của mình; gọi là *lực* khi không còn bị cái đối nghịch lay động.

**Thất giác chi quy về tâm sở:**

| Giác chi | Tâm sở |
|---|---|
| Niệm | niệm |
| Trạch pháp | tuệ |
| Tinh tấn | tinh tấn |
| Hỷ | hỷ |
| Khinh an | thân khinh an, tâm khinh an |
| Định | nhất tâm |
| Xả | trung bình (tatramajjhattatā), không phải thọ xả |

## 4a. Thẻ bài tâm sở: phần thưởng của mỗi nhiệm vụ

> **Lưu ý mới (mục 18):** nhiệm vụ **học kinh khi vắng** có thể cho *thẻ kiến thức đã nghe/đọc*, lưu ở **khu Đã học (Sổ Hành Trình)**, không tự tạo *thẻ tâm sở qua trải nghiệm*. Cùng là hình thẻ nhưng hai trạng thái học và thực hành phải phân biệt.

**Xong mỗi nhiệm vụ thì nhận một thẻ**: tâm sở nổi bật nhất trong cách người chơi vừa làm. Thẻ giải thích tâm sở đó **ngay trong tình huống vừa xảy ra**. Thu thập thẻ là cách chính để học tâm và tâm sở.

### Thẻ nào rơi ra

- Game ghi lại các tâm sở ngầm trong suốt nhiệm vụ. Tâm sở mạnh nhất, hoặc mới nhất với người chơi, thành thẻ.
- **Cùng một nhiệm vụ, cách làm khác nhau thì ra thẻ khác nhau.** Chuỗi "chó cắn": nhặt gậy → thẻ *Sân*; rửa vết thương rồi đem rau cho nhà ông Tư → thẻ *Không sân*; ngồi với sư đủ lâu → thẻ *Niệm*.
- **Thẻ bất thiện cũng là thẻ.** Không có thẻ "xấu" để tránh; hiểu Sân cũng quý như hiểu Không sân. Nhưng thẻ bất thiện chỉ để hiểu, không lên cấp, không mở truyện (xem mục 15.1).
- Có hên xui nhẹ: đôi khi rơi ra tâm sở đi kèm (ví dụ *Hối hận* sau khi nhặt gậy).

### Mặt trước (ai cũng đọc được)

- **Tên đời thường** và tên gọi chính (ví dụ *Sân: cái nóng trong lòng*).
- **Một hình minh họa** gắn với tình huống.
- **Câu "lúc nãy"**, 1–2 câu: *"Lúc chó cắn, bạn nóng lên và muốn đánh lại. Đó là Sân."*
- **Một mẹo nhỏ**: *"Khi nóng lên, thử biết 'nóng, nóng' rồi thở một hơi."*

### Mặt sau (mở dần khi gặp lại)

Gặp lại cùng tâm sở ở nhiệm vụ khác thì mở thêm một mặt, theo cách định nghĩa của Chú giải và Thanh Tịnh Đạo:

| Lần gặp | Mở thêm |
|---|---|
| 1 | mặt trước |
| 2 | **đặc tính** (nó là gì) |
| 3 | **phận sự** (nó làm gì) |
| 4 | **biểu hiện** (nhận ra nó thế nào) |
| 5 | **nhân gần** (cái gì làm nó sinh) và tên Pāli |

Mỗi mặt chỉ 1–2 câu, kèm ví dụ từ chính những lần người chơi đã gặp: *"Người này đã gặp Sân 3 lần: chó cắn, bị đồn oan, mất dép ở chùa."*

### Album thẻ

- Xếp thẻ thành các trang. Lúc đầu chỉ có hai trang đơn giản: **Tâm sở tốt** và **Tâm sở xấu**.
- Đủ thẻ thì album **tự xếp lại** theo cách sâu hơn: 3 gốc → 5 nhóm Tín Tấn Niệm Định Tuệ → 4 nhóm tâm sở. Mỗi lần xếp lại là một bài học "gộp, tách".
- Ô trống hiện bóng mờ và gợi ý nhẹ nơi có thể gặp: *"Có lẽ gặp ở gốc gạo, lúc chiều."*
- **Bộ thẻ:** gom đủ một bộ thì mở màn "gộp lại". Ví dụ đủ 5 thẻ Tín, Tinh tấn, Niệm, Nhất tâm, Tuệ thì hiện: *"Năm thẻ này cũng chính là ngũ căn và ngũ lực."*
- Thẻ tâm thiền, tâm siêu thế **không rơi ra từ nhiệm vụ**. Nếu có, chỉ là trang mô tả ghi "đã nghe sư giảng", không bao giờ là "đã đạt".

### Giữ cho thẻ không thành sưu tầm vô nghĩa

- Không có độ hiếm, không mua, không đổi chác, không gacha.
- Không có điểm cho việc đủ album; phần thưởng chỉ là hiểu thêm và mở cảnh mới.
- Trò chơi học (kéo thẻ vào đúng nhóm) là **tùy chọn**, không chặn đường.

## 4b. Dùng thẻ: pháp đối trị

Thẻ không chỉ để sưu tầm; người chơi **ra thẻ trong tình huống** để đối trị tâm xấu đang nổi lên. Nhưng thẻ **không bị tiêu đi** như tiền, vì:

- tiêu thẻ biến thiện thành tiền tệ (chính là "tiền công đức" mà game tránh);
- trong thực tế niệm không bị dùng hết khi đối trị tham; càng dùng càng quen, càng mạnh (huân tập).

### Ra thẻ

- Khi một tâm xấu nổi lên (chó cắn làm Sân bùng lên, mùi cơm làm Tham nổi lên, buồn ngủ khi ngồi), người chơi chọn một thẻ trong tay.
- Thẻ **không mất** khi dùng; mỗi thẻ có thời gian nghỉ ngắn, giống thể lực cầu thủ.
- Không ra thẻ nào thì tình huống diễn ra theo chỉ số ngầm; vẫn có truyện, chỉ là khác đi.

### Đúng cặp thì hiệu quả

| Tâm xấu nổi lên | Thẻ hợp | Thẻ kém hợp |
|---|---|---|
| Sân | Không sân, Từ | Tinh tấn (càng hăng càng nóng) |
| Tham | Không tham, Buông bỏ | Hỷ (dễ bám thêm) |
| Buồn ngủ, uể oải | Tinh tấn, Hỷ | Khinh an (càng chùng) |
| Tâm động, bồn chồn | Khinh an, Định | Tinh tấn |
| Nghi ngờ | Tuệ, Tín | Hỷ |
| **Mọi trường hợp** | **Niệm**: lúc nào cũng có ích, làm thẻ khác mạnh thêm | |

- Nguồn: Kinh Lửa (SN 46.53) và quân bình ngũ căn (Thanh Tịnh Đạo). Niệm luôn hữu ích là đúng lời kinh.
- Ra thẻ sai không bị phạt nặng, chỉ kém hiệu quả; mặt sau thẻ giải thích vì sao.

### Hiệu quả có hên xui

```
hiệu_quả = cấp_thẻ × chỉ_số_nền × (thêm nếu có Niệm) × hên_xui
```

Có lần ra đúng thẻ mà Sân vẫn chưa lắng; game nói thật: *"Lần này chưa được. Cứ biết nó."*

### Nâng cấp kiểu FIFA, bằng luyện tập

| Cách lên cấp | Ý nghĩa |
|---|---|
| **Dùng thẻ đúng lúc và thành công** | cách chính; luyện tập làm quen |
| Nhận lại thẻ trùng từ nhiệm vụ | lên một chút, mở thêm một mặt (hiểu thêm) |
| Không dùng lâu ngày | tụt nhẹ (lâu không luyện thì mòn) |

- **Cấp thẻ 1–5**, khớp năm mặt của thẻ: hiểu càng sâu thì dùng càng tốt.
- **Cấp thẻ đẩy chỉ số nền:** mỗi lần dùng thành công, chỉ số nền của tâm sở đó nhích lên một chút, theo đường cong giảm dần.
- **Không ghép, không đốt thẻ** để lên cấp. Thẻ chỉ mạnh lên khi được dùng.

### Dùng thẻ cũng mở ra truyện

- Ra *Từ* lúc bị chó cắn → con chó dịu lại, ông Tư xin lỗi, mở nhánh làm lành.
- Ra *Niệm* khi ngồi ở nghĩa địa gặp hồn ma → không bỏ chạy, nghe được chuyện của nó.

## 4c. Bộ bài tâm: tâm nào đi với tâm sở nào

Cốt lõi của Vi Diệu Pháp: **tâm sở không đứng riêng, mà luôn sinh cùng một tâm** (tương ưng). Game thể hiện điều này bằng **bộ bài tâm**: mỗi tình huống sinh ra một tâm, hiện như một bộ bài xòe ra, mỗi lá là một tâm sở đi cùng.

### Tình huống tự sinh tâm

Khi chó cắn, game **tự sinh Tâm sân**. Người chơi không chọn được, đúng như thực tế. Xong tình huống, người chơi thu được các lá trong bộ (lần đầu là mặt trước).

**Thành phần Tâm sân** (theo Vi Diệu Pháp Toát Yếu, chương II; con số chính xác từng trường hợp cần thầy kiểm):

| Nhóm | Các lá | Bài học ngầm |
|---|---|---|
| Có trong mọi tâm | Xúc, Thọ (khổ), Tưởng, Tư, Nhất tâm, Mạng quyền, Tác ý | 7 lá này tâm nào cũng có, kể cả tâm thiện |
| Tùy tâm | Tầm, Tứ, Thắng giải, Tinh tấn, Dục | Tinh tấn cũng có trong tâm sân: hăng hái để giận |
| **Ô xám: Hỷ** | không thể có | tâm sân không bao giờ đi cùng hỷ, vì thọ luôn là khổ |
| Có trong mọi tâm xấu | Si, Không biết hổ, Không biết sợ, Phóng dật | 4 lá này tâm xấu nào cũng có |
| Gốc | **Sân** | lá chính |
| Đôi khi, mỗi lần một lá | Ganh tị, Bỏn xẻn, Hối hận | chỉ đi với tâm sân, không bao giờ cùng lúc |
| Khi bị thúc đẩy | Hôn trầm, Thụy miên | chỉ có khi tâm sân sinh do bị xúi, chần chừ |

Ô xám **Hỷ** là chỗ dạy hay: một ô không bao giờ lấp được, khiến người chơi tự hỏi vì sao.

### Học ngầm "họ hàng" qua nhiều tình huống

Không nói thẳng "ganh tị, bỏn xẻn, hối hận thuộc tâm sân". Cho người chơi gặp nhiều tình huống:

| Tình huống | Lá đi kèm rơi ra |
|---|---|
| Hàng xóm được khen, mình thì không | Ganh tị |
| Hồn ma xin cơm, mình giấu nồi cơm | Bỏn xẻn |
| Lỡ đánh con chó rồi hối | Hối hận |

Cả ba lần bộ bài có **cùng một lõi**: lá Sân và ô Hỷ xám. Người chơi tự nhận ra chúng cùng họ. Đủ ba lá thì album mở trang **"Họ hàng của Sân"** để xác nhận điều người chơi đã đoán.

Tương tự cho hai họ còn lại:
- **Tham:** đi với Tà kiến hoặc Ngã mạn; có thể có Hỷ.
- **Si:** đi với Hoài nghi hoặc Phóng dật nổi trội; không có Dục.

### Gặp lại tình huống: đổi bài thành tâm thiện

Lần sau gặp lại con chó, Tâm sân vẫn tự sinh, nhưng người chơi có thể **đổi lá** bằng thẻ đã thu thập:

| Lá xấu | Đổi bằng |
|---|---|
| Sân | Không sân |
| Si | Tuệ (nếu đã có) |
| Không biết hổ, Không biết sợ | Tàm, Quý |
| Phóng dật | Niệm |
| Thọ khổ | Thọ xả hoặc Thọ hỷ |

**Luật tạo tâm thiện** (theo Vi Diệu Pháp):
- 19 tâm sở tịnh hảo **luôn sinh cùng nhau** trong mọi tâm thiện. Tâm thiện chỉ thành khi có đủ bộ lõi: Tín, Niệm, Tàm, Quý, Không tham, Không sân, Trung bình, nhóm Khinh an.
- Thiếu lá thì tâm thiện chưa trọn: chỉ giảm Sân một chút, kèm câu *"Còn thiếu Tín."*
- Sân và Không sân không cùng có mặt: đặt lá này thì lá kia tự bay ra.

**Hiệu quả:** tạo được tâm thiện thì **Sân nền giảm một chút**. Mức giảm phụ thuộc **độ hiểu**, tức số mặt đã mở của thẻ Sân ("biết rõ nó thì nó yếu đi"):

```
giảm_sân_nền = cơ_bản × (1 + số_mặt_đã_mở_của_thẻ_Sân × 0.2) × hên_xui
```

Sân nền không bao giờ về 0.

### Theo lớp người chơi

| Lớp | Thấy gì khi chó cắn |
|---|---|
| Dạo chơi | một lá **Tâm sân** to; lật ra thấy 2–3 lá chính (Sân, Si, Phóng dật). Lần sau có nút **"Gợi ý đổi bài"**, bấm một lần là xong |
| Tò mò | bộ bài đầy đủ, ô Hỷ xám, tự đổi từng lá |
| Đi sâu | tên đúng của tâm (ví dụ *"tâm sân, thọ ưu, vô trợ"*), số tâm sở, các trang họ hàng |

### Quan hệ với mục 4b

- Ra một thẻ đối trị (4b) chính là **đổi một lá** trong bộ bài tâm. Hai mục dùng chung một cơ chế: 4b là cách chơi nhanh, 4c là cách chơi đầy đủ.
- Thẻ **Từ** ở lớp sâu được gộp lại: tâm từ chính là tâm sở **Không sân** khi hướng về chúng sinh.

### Lưu ý mô phỏng

- Thực tế trong một tình huống có vô số sát-na tâm sinh diệt; game chỉ chọn **một tâm đại diện**. Chân bảng ghi rõ.
- Thành phần từng tâm (lá nào có, lá nào không, khi nào thêm Hôn trầm) phải đúng từng chi tiết; đây là phần cần thầy duyệt kỹ nhất.

### Bảng tâm

- Mỗi tâm từng sinh trong game thành một **công thức**: tên tâm và các lá đi kèm.
- 12 tâm bất thiện (8 tham, 2 sân, 2 si) và 8 tâm thiện dục giới là bộ sưu tập chính.
- Tâm thiền, tâm siêu thế chỉ ghi là **"nghe sư kể"**, không bao giờ là "đã đạt".

## 5. Tính cách ban đầu: sáu hạng tính

Thanh Tịnh Đạo (chương III) chia sáu hạng tính: **tham, sân, si, tín, tầm (hay suy tính), trí**. Sách nhận ra từng hạng qua dáng đi, cách ăn, cách làm việc, cách nhìn. Ví dụ quét sân:

- thiên tham: quét cẩn thận, gọn đẹp;
- thiên sân: quét vội, mạnh tay, không đều;
- thiên si: quét lơ đãng, bỏ sót chỗ.

### Khảo sát bằng việc làm, không hỏi đáp

Màn đầu là 3–4 việc nhỏ: **quét sân, nhận bát cơm, đi ngang con chó, nhìn một bông hoa**. Bước quét sân là một câu chọn tình huống (quét kỹ, quét nhanh, quét lơ đãng…), không đo tốc độ chạm; game xem cách người này chọn để xếp nhóm tính. Người chơi không thấy đây là bài kiểm tra.

Sau đó chỉ số được **random trong khung của nhóm**, nên hai người cùng nhóm vẫn khác nhau.

| Nhóm tính | Chỉ số nền thiên về | Tốc độ tăng đặc trưng | Đề mục hợp (Thanh Tịnh Đạo) |
|---|---|---|---|
| Tham | Tín khá, Tham cao | Niệm bình thường | quán bất tịnh, quán thân |
| Sân | Tấn cao, Sân cao | Định chậm | tâm từ, bi, hỷ, xả |
| Si | Si cao, Niệm thấp | Niệm chậm (×0.6) | niệm hơi thở |
| Tầm | Tuệ khá, phóng tâm cao | Định chậm | niệm hơi thở |
| Tín | Tín cao, Tuệ thấp | Tuệ chậm | niệm Phật, Pháp, Tăng |
| Trí | Tuệ cao, Tín thấp | Tín chậm | niệm sự chết, quán bốn đại |

- Tính cách có thể pha, ví dụ "thiên sân, có trí".
- Tên nhóm hiện nhẹ nhàng, ví dụ *"Người này thiên về tính hăng hái"*; không dùng "tính sân" ở lớp Dạo chơi.
- Cho làm lại khảo sát. Tính cách cũng đổi dần theo cách chơi.

**Quyết định 09-11-2026:** khảo sát là nhiệm vụ tùy chọn trong tab Việc đang chờ (khu "Việc nhỏ và chuyện lạ"), mục "Khảo sát tính cách (không bắt buộc)", có thể bỏ qua; không còn chặn lúc bắt đầu chơi. Chưa làm khảo sát thì chỉ số dùng khung trung tính (không có tên tính). Làm khảo sát sau thì chỉ số trộn đều nửa giá trị đang có với nửa giá trị theo khung của nhóm tính; làm lại chỉ đổi nhãn tính, giữ nguyên chỉ số. Sẽ cân nhắc giữ hoặc bỏ cơ chế này sau khi người chơi trải nghiệm.

## 6. Hai loại chỉ số

| | **Thẻ chỉ số** (nền) | **Quả cầu** (nhiệm vụ) |
|---|---|---|
| Là gì | năng lực lâu dài, 1–99, giống thẻ cầu thủ FIFA | tiến độ một buổi, một nhiệm vụ |
| Đổi | rất chậm, qua nhiều ngày chơi | đầy dần trong vài phút |
| Hiện | ẩn; mở ở lớp Tò mò, chi tiết ở lớp Đi sâu | luôn hiện khi làm nhiệm vụ |
| Ý nghĩa | khuynh hướng tâm do huân tập | **chỉ để hoàn thành nhiệm vụ**, không có nghĩa là đã đủ chánh niệm |

### Bên dưới: chỉ số ngầm theo tâm sở

Game tính ngầm theo nhóm tâm sở. Màn hình chỉ hiện bản gộp hợp với lớp của người chơi.

```
tức_thời += (nền − tức_thời)·k_hồi + sự_kiện + nhiễu
nền      += (trung_bình_gần_đây − nền)·k_chậm         // k_chậm rất nhỏ, giảm dần khi nền cao
```

- Tức thời dao động quanh nền: lên xuống, nhưng xoay quanh mốc.
- Giữ đều lâu ngày thì mốc nâng; bỏ lâu thì mốc hạ chậm.

### Tốc độ đầy quả cầu

```
tốc_độ = nền_của_nhóm × hệ_số_tính_cách × (1 − chướng_ngại_lúc_đó) × hệ_số_nơi_chốn × hên_xui
```

- Mỗi lần đầy quả cầu chỉ cộng **một chút** vào thẻ chỉ số, theo đường cong giảm dần (đầu lên nhanh, càng cao càng chậm).
- Ví dụ: người thiên si ngồi ở nghĩa địa thì quả cầu đầy chậm và hay rò.

### Yếu tố hên xui

Để không máy móc, mỗi kết quả là **xác suất nghiêng theo chỉ số**, không phải ngưỡng cứng:

- **nhiễu nhỏ** trong tức thời (±);
- **ngày đẹp, ngày xấu:** mỗi lần vào game random một "khí trời trong lòng" nhẹ, ví dụ *"Hôm nay bạn hơi uể oải"*;
- **sự kiện bất chợt:** mưa, chó sủa, người lạ cho quà, làm lệch kết quả;
- người chỉ số thấp **vẫn có lúc** ngồi rất yên, người chỉ số cao **vẫn có lúc** bị cuốn đi.

## 7. Truyện ngắn: tình huống theo trạng thái

Thay kịch bản dài bằng nhiều **tình huống ngắn** (storylet, như cách các game Fallen London, Disco Elysium kể chuyện). Mỗi tình huống có:

- **điều kiện:** chỉ số, nơi chốn, giờ, nhiệm vụ đang làm, hên xui;
- **1–2 câu**, mỗi câu không quá 12 chữ;
- **hành động trên đồ vật trong thế giới** (hái, đưa, ngồi, đi theo, rửa) thay cho danh sách lựa chọn bằng chữ;
- **kết quả:** đổi chỉ số, mở tình huống khác.

Chỉ số khác nhau thì tình huống mở ra khác nhau, nên mỗi người có câu chuyện riêng.

### Ví dụ chuỗi "chó cắn"

1. *Chó nhà ông Tư cắn vào chân.* Quả cầu đỏ lên, Sân tăng vọt.
2. Hành động mở ra:
   - **nhặt gậy** → Sân tăng, mở "cãi nhau với ông Tư";
   - **bỏ đi** → Sân âm ỉ; đêm đó khó ngủ, đi ngang mộ thì thấy hồn ma;
   - **rửa vết thương ở giếng** → Sân lắng dần, mở bước 3.
3. Ở giếng, bà cụ: *"Gốc mít có rau má, hái giúp bà một nắm."* Đi hái (thu thập).
4. Mang rau cho sư, hoặc cho chính nhà ông Tư. Đây là bố thí: quả cầu chuyển xanh, tâm không tham có mặt. Cho nhà ông Tư thì Sân giảm mạnh hơn và có cảnh làm lành.
5. Đi ngang nghĩa địa, gặp sư: *"Ngồi với thầy một lát?"*
   - Đồng hồ ngồi 2–3 phút thật; quả cầu Niệm đầy dần.
   - Thỉnh thoảng hiện thẻ phóng tâm (*"vết cắn nhức"*, *"nhớ con chó"*); chạm để ghi nhận.
   - Người thiên sân hay thiên si đầy chậm, dễ bỏ ngang; bỏ ngang mở nhánh khác.
6. Kết chuỗi:
   - lớp Dạo chơi: *"Người này thấy nhẹ lòng hơn."*
   - lớp Tò mò trở lên: thẻ **Sân** và thẻ **Không sân** hiện lần đầu, kèm *"vừa rồi trong bạn có…"*.

Cả chuỗi khoảng 10 câu ngắn, 5–6 hành động.

### Các loại nhiệm vụ gợi ý

| Loại | Ví dụ | Tâm sở chính được luyện |
|---|---|---|
| Bố thí | hái rau, dâng cơm, đưa đèn cho người lạc | không tham |
| Giữ giới | trả lại đồ nhặt được, nói thật dù thiệt | tàm quý |
| Tâm từ | dỗ đứa trẻ khóc, cho chó ăn, ngồi cạnh hồn ma | không sân |
| Nghe pháp | ngồi nghe sư ở gốc gạo (đồng hồ) | tín, văn tuệ |
| Ngồi thiền | ngồi ở tịnh thất, nghĩa địa (đồng hồ, quả cầu) | niệm, định |
| Kinh hành | đi chậm theo lối đánh dấu | niệm, tinh tấn |
| Suy xét | so lời đồn với manh mối về Hạnh | tư tuệ |

## 8. Gợi ý tu tập trong bảng chi tiết

Chọn theo chỗ yếu nhất, kèm nơi chốn; bấm vào thì nhân vật tự đi tới.

| Tình trạng | Gợi ý (lớp Tò mò) |
|---|---|
| Tín thấp | Lễ Phật ở tịnh thất, đọc một bài kinh |
| Tín nhiều hơn Tuệ | Thử so lời đồn với manh mối |
| Tuệ nhiều hơn Tín, hay nghi | Nghe sư giảng; ngồi yên, đừng phân tích |
| Tấn thấp, buồn ngủ | Đi kinh hành, rửa mặt ở giếng |
| Tấn nhiều hơn Định, tâm động | Ngồi ở gốc gạo, chỉ theo hơi thở |
| Sân cao | Làm một việc tốt cho người làm bạn giận |
| Tham cao | Đi khất thực, nhận gì ăn nấy |

Cặp tín–tuệ, tấn–định (Thanh Tịnh Đạo) chỉ dùng để chọn gợi ý, không phạt người chơi.

## 9. Ngồi thiền và thất giác chi (lớp Đi sâu, chủ yếu nhà sư)

### Cơ chế

- Giữa màn hình: vòng hơi thở phồng xẹp, một đề mục chính.
- Phóng tâm trôi vào thành **thẻ** (tiếng cú, chó sủa, đau gối, nhớ Hạnh, mùi cơm).
- **Ghi nhận:** chạm vào thẻ, thẻ hiện chữ đơn giản ("nghe", "đau", "nhớ", "giận") rồi tan. Chuỗi niệm tăng.
- **Bỏ mặc:** thẻ kéo khung hình trôi theo, chuỗi niệm hụt.
- **Bẫy** (lấy từ lỗi thường gặp trong bài giảng):

| Bẫy | Hệ quả |
|---|---|
| "Nghĩ xem vì sao" | phân tích, Si tăng |
| "Gạt đi" | chống lại cái khó chịu, Sân tăng |
| "Giữ cảm giác này lại" | bám cái dễ chịu, Tham tăng |
| "Đổi tư thế" khi đau | Tấn hụt nhẹ |

### Giác chi xuất hiện theo chuỗi trong kinh

Giác chi **không mở bằng gom điểm**. Nó sinh ra khi niệm đủ liên tục, và chi trước phải có mặt thì chi sau mới sinh. Vì vậy "đủ niệm nhưng định còn thiếu thì lâu hơn" tự xảy ra.

| # | Giác chi | Điều kiện (mô phỏng) | Đổi trong lối chơi |
|---|---|---|---|
| 1 | Niệm (*viên đá chìm*) | Niệm nền đủ cao và đã giữ đầy quả cầu nhiều buổi | thẻ ghi nhận nhanh hơn, vòng thở tự giữ nhịp |
| 2 | Trạch pháp | niệm giác chi giữ được một lúc | thẻ hiện mờ "sinh… diệt" |
| 3 | Tinh tấn | trạch pháp có mặt | cơn đau không còn làm hụt chuỗi |
| 4 | Hỷ | tinh tấn liên tục | ánh sáng ấm lên; hiện bẫy "giữ lại" |
| 5 | Khinh an | không mắc bẫy hỷ | màn hình mềm đi, thở chậm, âm thanh xa dần |
| 6 | Định | khinh an có mặt | thẻ thưa hẳn |
| 7 | Xả | định có mặt | thẻ dễ chịu và khó chịu cùng màu; nút "gạt đi", "giữ lại" tự biến mất |

- Niệm đứt thì tụt một hai bậc, không về 0.
- Lần đầu lên được Niệm giác chi phải mất **nhiều ngày chơi**; người chơi hiểu vì sao kinh nói "thường xuyên, liên tục".
- Có hên xui: thỉnh thoảng một buổi ngồi đi xa hơn mức thường.

### Bốn đêm theo Tứ niệm xứ (gắn truyện về Hạnh)

| Đêm | Niệm xứ | Nội dung |
|---|---|---|
| 1 | Thân | hơi thở, muỗi, tiếng cú |
| 2 | Thọ | đau gối khi ngồi lâu, gió lạnh |
| 3 | Tâm | giận vì lời đồn, sợ khi ngồi ở nghĩa địa (hạnh đầu đà) |
| 4 | Pháp | buồn ngủ, nghi ngờ; ký ức về Hạnh; hồn ma ngồi gần |

## 9a. Chư thiên và các loài khác

Theo Vi Diệu Pháp, **loài nào sinh vào cõi nào là do tâm tái tục** (sát-na tâm đầu tiên của một đời sống): tâm đó có bao nhiêu gốc thiện thì quyết định cõi. Cho người chơi bấm xem "cấu trúc tâm" của các loài là một bài học thật về 31 cõi: **tâm khác nhau thì cõi khác nhau**.

Đêm trong rừng cũng là bối cảnh đúng kinh: nhiều bài trong Tương Ưng Chư Thiên mở đầu bằng cảnh đêm khuya, một vị thiên tỏa sáng khắp khu rừng rồi đến hỏi đạo.

### Các loài có thể gặp (từ gần đến hiếm)

| Loài | Gặp ở đâu, khi nào | Cấu trúc tâm (mô phỏng) | Vai trò trong game |
|---|---|---|---|
| **Con chó** (súc sinh) | đầu làng | tâm tái tục không gốc thiện; nặng si | xem để hiểu vì sao nó cắn; cho ăn rơi thẻ Từ |
| **Ngạ quỷ** | nghĩa địa, đêm | nặng tham, bỏn xẻn | đã có vai hồn ma; nhiệm vụ hồi hướng |
| **Thọ thần** (thần cây) | gốc gạo, canh khuya | hai hoặc ba gốc thiện; tâm vui | che chở, nhắc nhở, kể chuyện cũ của cây và làng |
| **Địa thần, thần giữ chùa** | cổng làng, tịnh thất | gốc thiện, hay hoan hỷ | xuất hiện khi người chơi giữ giới, rải tâm từ |
| **Chư thiên cõi trời** | rất hiếm, đêm sâu, ánh sáng quanh sư | ba gốc thiện, tâm sáng | đến nghe pháp, hỏi một câu, hoan hỷ "lành thay" rồi đi |
| **Phạm thiên** | không gặp trực tiếp | tâm thiền | chỉ là trang mô tả "nghe sư kể" |

### Bảng "cấu trúc tâm" khi bấm vào một loài

| Lớp | Thấy gì |
|---|---|
| Dạo chơi | một câu: *"Vị này tâm sáng, ít giận, thường vui."* |
| Tò mò | ba gốc thiện, ba gốc xấu dạng thanh; cảm giác thường gặp; cõi đang sống; một dòng vì sao sinh vào cõi đó (*"đời trước hay bố thí, giữ giới"*) |
| Đi sâu | tâm tái tục (không gốc, hai gốc, ba gốc); tâm sở nổi trội; **so với tâm của chính người chơi** (*"Người này và vị thọ thần giống nhau ở Tín; khác ở Sân."*) |

- Bấm vào một loài lần đầu cũng rơi ra một thẻ: *Bỏn xẻn* từ ngạ quỷ (kèm lý do vì sao loài này sinh vào cõi ngạ quỷ), *Hoan hỷ* từ chư thiên.
- Đã xem đủ chó, ngạ quỷ, thọ thần, chư thiên thì người chơi tự thấy một dải liên tục: không gốc thiện → nặng tham → hai gốc → ba gốc. **Cõi là kết quả của tâm**, và tâm mình hôm nay cũng đang nghiêng về một phía. Không cần giảng giải.

### Thân bằng quyến thuộc

Nguồn: **Kinh Ngoài Bức Tường** (Tirokuḍḍa, Tiểu Tụng). Ngạ quỷ là thân quyến đã mất, đứng ngoài tường chờ người nhà làm phước và hồi hướng; khi được hồi hướng thì hoan hỷ và được an vui.

**Ví dụ chuỗi "bà ngoại":**

1. Ở nghĩa địa, một bóng ma đứng mãi gần một ngôi mộ. Bấm vào: Tham và Bỏn xẻn rất cao; dòng *"đời trước là bà của bạn"*.
2. Bà nói một câu: *"Đói lắm… không ai nhớ."*
3. Nhiệm vụ: nấu một bát cơm, dâng cho sư, rồi **hồi hướng** cho bà.
4. Bà hoan hỷ: chỉ số Hoan hỷ tăng vọt, bóng sáng dần rồi tan. Người chơi nhận thẻ *Hoan hỷ* và *Không tham*.

**Biến thể nối với truyện Hạnh:** thọ thần ở gốc gạo là mẹ của Hạnh, đời trước sống ở làng; bà nhận ra người chơi và kể một mảnh chuyện về Hạnh.

### Ranh giới

- **Chư thiên không ban điều ước.** Họ giúp nhỏ (soi đường, xua chó, nhắc nhở), hoan hỷ khi thấy việc thiện, nhưng không cho tiền, may mắn, và không cầu xin được. Chỗ nương tựa là Tam Bảo; game cần làm rõ chỗ khác với tín ngưỡng dân gian.
- **Không bói toán, không xem kiếp trước của người chơi thật.** "Đời trước là bà của bạn" chỉ là nhân vật trong truyện.
- **Không xem chỉ số tâm của người chơi khác.** Người chơi thật chỉ hiện vòng màu; bảng cấu trúc tâm chỉ dành cho nhân vật trong game.
- **Ghi rõ** đây là vũ trụ quan theo kinh điển Phật giáo, trong mô phỏng game, không phải khẳng định khoa học (lời nhắc ở chân bảng).
- **Chư thiên hiếm:** chỉ xuất hiện khi tâm người chơi đủ sáng (Không sân và Tín cao), kèm hên xui; gặp nhiều sẽ mất huyền bí.
- **Cách gọi:** dùng "thọ thần", "địa thần", "chư thiên" theo kinh, tránh pha thần linh dân gian.

## 9b. Khám phá bề mặt: gặp gỡ, hiệu ứng, cõi khác

Phần nền tảng (mục 4–9a) chạy ngầm. Phần bề mặt là thứ **làm người chơi muốn đi tiếp**: khám phá bản đồ, gặp đúng loài vào đúng lúc, có hiệu ứng để khoe, nhận manh mối mở nhiệm vụ mới, và bước vào cõi khác.

**Nguồn chuyện** (Tiểu Bộ Kinh), vừa ngắn vừa đúng kinh, dạy đúng bài nghiệp và quả:
- **Chuyện Thiên Cung** (Vimānavatthu): vị thiên kể *"tôi đã làm việc gì mà được cung điện này"*, thường chỉ một việc nhỏ như dâng đèn, dâng hoa.
- **Chuyện Ngạ Quỷ** (Petavatthu): ngạ quỷ kể *"vì việc gì mà tôi khổ thế này"*, thường là bỏn xẻn, lừa dối, và kết bằng việc người thân hồi hướng.

### Gặp ai, ở đâu, khi nào

Mỗi cuộc gặp phụ thuộc: **nơi chốn × giờ (canh) × ngày trăng × tâm người chơi × hên xui**.

| Điểm | Loài | Khi nào dễ gặp |
|---|---|---|
| Gốc gạo | Thọ thần | canh ba, trời lặng gió |
| Cổng làng | Địa thần | rạng đông, khi người chơi vừa giữ giới |
| Nghĩa địa | Ngạ quỷ | đêm không trăng |
| Tịnh thất | Chư thiên nghe pháp | canh khuya, khi có người tụng kinh |
| *Ao sen (mới)* | Chư thiên tắm hoa | đêm rằm |
| *Gò tháp cổ (mới)* | Lối vào thiên cung | rằm hoặc mùng tám, tâm sáng |
| *Hang đá sau đồi (mới)* | Ngạ quỷ trong hang | đêm tối nhất, mang theo đèn |

- **Chu kỳ trăng trong game.** Theo Tăng Chi (AN 3.37), vào ngày trai giới Tứ Đại Thiên Vương và tùy tùng đi khắp thế gian xem loài người có hiếu với cha mẹ, có giữ trai giới không. Vì vậy vào rằm và mùng tám, cơ hội gặp chư thiên cao hơn hẳn.
- **Mắt tâm.** Vòng tâm sáng (vàng, trắng) thì thấy thêm **lớp ẩn** trên cùng bản đồ: ánh lấp lánh quanh gốc cây, dấu chân sáng ở ao sen, bóng mờ ở cửa hang. Tâm tối thì lớp này mờ hẳn. Bề mặt nối với nền tảng mà không cần giải thích.
- **Hên xui có bảo đảm.** Mỗi lần đến đúng chỗ mà không gặp, cơ hội lần sau tăng dần, đến lúc nào đó chắc chắn gặp.

### Hiệu ứng khi gặp

| Loài | Hình ảnh và âm thanh |
|---|---|
| Chư thiên | ánh sáng tỏa khắp khu rừng (như câu mở đầu nhiều bài kinh); **hoa mạn-đà-la rơi từ trời**; hương thơm thành làn sáng; tiếng chuông xa |
| Thọ thần | lá cây gạo sáng lên từng chiếc, rễ phát sáng dưới đất, gió ngừng hẳn |
| Địa thần | mặt đất ấm lên, đom đóm xếp thành vòng |
| Ngạ quỷ | sương lạnh lan ra, lửa chập chờn, tiếng thở dài, màn hình hơi mất màu |
| Bước vào cõi khác | màn hình gợn như mặt nước rồi mở ra cảnh mới |

### Khoảnh khắc để khoe

- Mỗi cuộc gặp tự tạo một **tấm ảnh khoảnh khắc**: cảnh, loài, giờ, ngày trăng, một câu ngắn của vị đó. Lưu hoặc chia sẻ được.
- **Người chơi ở gần cũng thấy** ánh sáng hoặc sương, và cùng gặp. Có lý do để rủ nhau đi.
- Bảng dấu vết chung hiện một dòng nhẹ: *"Đêm qua có người gặp thọ thần ở gốc gạo."* Không ghi tên, không xếp hạng.

### Nhận được gì

Vật phẩm là **chìa khóa và manh mối**, không phải sức mạnh hay tiền.

| Vật | Từ ai | Dùng để |
|---|---|---|
| Hoa mạn-đà-la | chư thiên | mở lối vào thiên cung; tâm sáng hơn trong một đêm |
| Chiếc lá gạo sáng | thọ thần | soi thấy lớp ẩn ở một chỗ |
| Ngọn đèn nhỏ | địa thần | vào được hang đá |
| Mảnh ký ức | thọ thần, ngạ quỷ | manh mối về Hạnh |
| Lời gợi ý | mọi loài | một câu, mở nhiệm vụ tiếp theo |

**Nhiệm vụ chỉ mở khi gặp**, ví dụ:
- thọ thần nhờ tìm đứa trẻ đi lạc trong rừng tre;
- ngạ quỷ trong hang nhờ tìm người thân ở làng để họ hồi hướng;
- chư thiên hỏi một câu, người chơi phải đi tìm câu trả lời ở tịnh thất.

Mỗi cuộc gặp cũng rơi ra thẻ tâm sở (mục 4a, 9a).

### Chiều sâu: các tầng của bản đồ

Bản đồ vẫn nhỏ gọn như hiện nay, nhưng có thêm tầng:

| Tầng | Là gì | Mở bằng |
|---|---|---|
| 1. Thế giới thường | bản đồ hiện có | từ đầu |
| 2. Lớp ẩn | cùng bản đồ, thấy thêm dấu vết các loài | mắt tâm (vòng tâm sáng) |
| 3. Các cõi | cảnh riêng nhỏ, làm theo kiểu phòng 2.5D như nhà hoang, tịnh thất | vật phẩm và tâm phù hợp |

**Thiên cung** (vào từ gò tháp, cần hoa mạn-đà-la):
- Cung điện sáng. Vị thiên kể **một việc thiện nhỏ** đời trước, kiểu Chuyện Thiên Cung (*"Tôi chỉ dâng một ngọn đèn ở chùa làng."*).
- Bấm xem cấu trúc tâm của vị ấy.
- **Luật ở lại:** nếu Sân của người chơi bùng lên trong một tình huống thử, cung điện tan và người chơi rơi về gò tháp. Bài học "tâm nào cõi nấy", không cần giải thích.

**Hang ngạ quỷ** (vào từ hang đá sau đồi, cần ngọn đèn):
- Hang tối, chỉ thấy quanh ngọn đèn. Càng sâu càng nhiều ngạ quỷ; mỗi vị kể **một việc** đã làm, kiểu Chuyện Ngạ Quỷ (*"Tôi giấu cơm, nói với sư là nhà hết gạo."*).
- **Luật đi sâu:** nỗi sợ làm đèn tối dần; ra thẻ Niệm hoặc Không sân thì đèn sáng lại; sợ quá thì chạy ra ngoài.
- Cuối hang có một ngạ quỷ liên quan đến Hạnh.

**Có thể làm sau:** cõi rồng (nāga) dưới ao sen, thế giới trong lòng cây gạo.

> Hang được mở rộng thành một thế giới riêng ở mục 15.2.

### Ranh giới

- **Cung điện là quả của việc thiện của chính vị ấy**, không phải phần thưởng ban cho người chơi. Người chơi không bao giờ "kiếm được" cung điện.
- Chư thiên không ban điều ước; vật phẩm không tăng chỉ số lâu dài; không mua bán, không gacha.
- **Ngạ quỷ đáng thương, không đáng sợ.** Có sương và bóng tối, nhưng không hù dọa kiểu nhảy bổ ra. Cảm xúc chính là thương, đúng tinh thần Kinh Ngoài Bức Tường.
- Chuyện của từng vị **phỏng theo đúng truyện** trong Chuyện Thiên Cung, Chuyện Ngạ Quỷ rồi rút còn một hai câu; không tự bịa nghiệp quả.
- Thẻ xem lại trong Sổ, sau khi đã gặp, giữ hình và bảng tâm, rồi kể thêm vài chuyện đã dẫn nguồn: Chuyện Thiên Cung (Vv 1.9 đèn, Vv 1.10 nắm mè, Vv 3.10 tràng hoa) và Tăng Chi 3.37 cho chư thiên; Jātaka 74 cùng Tương Ưng Rừng 9.1 cho thọ thần; Kinh Ngoài Bức Tường cho ngạ quỷ. Địa thần ghi rõ là chưa có chuyện một việc làm rồi sinh vào vai ấy. Lời thoại lần gặp đầu vẫn ngắn. ⚠ lời kể rút gọn cần thầy duyệt.

### Thứ tự làm đề xuất

1. Chu kỳ trăng trong game; quy tắc gặp theo nơi chốn, giờ, trăng, tâm, hên xui có bảo đảm.
2. Một cuộc gặp trọn vẹn: thọ thần ở gốc gạo, có hiệu ứng, tấm ảnh khoảnh khắc, người chơi gần cùng thấy, một nhiệm vụ mở ra.
3. Lớp ẩn bằng mắt tâm.
4. Hang ngạ quỷ (cảnh 2.5D đầu tiên), rồi thiên cung.

## 10. Mở khóa kiến thức

- **Kiến thức mở bằng thẻ**, cho mọi vai (mục 4a). Không bắt đọc sách lý thuyết để mở khóa.
- **Nhà sư** có thêm nhiệm vụ riêng (ngồi thiền, kinh hành, khất thực) nên gặp các thẻ Niệm, Định, Tuệ nhiều hơn; người dân gặp nhiều thẻ bố thí, giữ giới; hồn ma gặp nhiều thẻ Sân, Hối hận rồi đến Buông bỏ.
- **Kinh ở tịnh thất vẫn giữ** để ai muốn thì đọc (thêm Tín, văn tuệ), nhưng không phải điều kiện mở bậc.
- **Nghe pháp với sư** là một loại nhiệm vụ có đồng hồ, và cũng rơi ra thẻ.
- **Mở khóa nơi chốn và cảnh:** ngồi ở nghĩa địa, nói chuyện với hồn ma.

## 11. Ranh giới

- Minh và Giải thoát **không bao giờ** là cấp độ hay phần thưởng. Cuối chuỗi giác chi chỉ là một cảnh lặng lúc rạng đông và một câu ngắn, kiểu *"đường còn dài, cứ biết từng hơi thở"*.
- Không tiền công đức, không huy hiệu để so sánh, không bảng xếp hạng, không so sánh người chơi. **Cột mốc riêng tư** thì có (mục 16.5): chỉ chủ nhân vật xem, không cho sức mạnh.
- Quả cầu đầy chỉ có nghĩa là xong nhiệm vụ.
- Xả được thưởng hơn sự hăng hái; không khuyến khích đuổi theo con số.

## 12. Rủi ro

| Rủi ro | Cách giữ |
|---|---|
| Người mới bị ngợp thuật ngữ | ba lớp người chơi; 30 phút đầu không thuật ngữ; mỗi lần một khái niệm |
| Đuổi theo con số | chỉ số ẩn mặc định; quả cầu tách khỏi thẻ chỉ số; hên xui |
| Xếp tính cách bị xem là phán xét | gọi "thiên về"; cho làm lại; tính cách đổi dần |
| Hiểu mô phỏng là thật | lời nhắc ở màn đầu, chân thẻ, trang giới thiệu |
| Giản lược sai giáo lý | một nguồn chuẩn; thầy duyệt từng nhóm thẻ |
| Khối lượng nội dung (52 thẻ × 4 mặt) | làm dần theo nhóm, bắt đầu từ những tâm sở hay gặp nhất |

## 13. Cần thầy duyệt

1. Cách gộp tâm sở vào 5 nhóm thiện và 3 gốc, và nội dung từng thẻ tâm sở.
2. Bảng sáu hạng tính, cách khảo sát bằng việc làm, và đề mục gợi ý.
3. Chữ trên thẻ ghi nhận, mô tả và điều kiện từng giác chi.
4. Câu chữ lời nhắc "đây là mô phỏng".
5. Cảnh kết, để không ngụ ý chứng đắc.
6. Bảng thẻ hợp, kém hợp khi đối trị (mục 4b).
7. Các loài, cấu trúc tâm tái tục của từng loài, cách hiện chư thiên và nhiệm vụ hồi hướng (mục 9a).
8. **Thành phần tâm sở của từng tâm** trong bộ bài tâm, luật tạo tâm thiện và bảng đổi lá (mục 4c).
9. Chuyện của từng vị thiên, ngạ quỷ phỏng theo Chuyện Thiên Cung, Chuyện Ngạ Quỷ; cách hiện thiên cung, hang ngạ quỷ (mục 9b).
10. Cách hiện hình 14 tâm sở bất thiện trong hang, và câu chỉ sang pháp đối trị (mục 15.1, 15.2).
11. Phận sự tịnh xá theo Luật tạng, cách để việc thường ngày không thành cày điểm (mục 15.3).
12. Ba mức của từng hạnh đầu đà, cách phát nguyện và ghi nhận khi phạm (mục 15.4).
13. Cách hiện năm triền cái khi ngồi, cặp triền cái và đối trị, ranh giới không ngụ ý chứng thiền (mục 15.5).

## 14. Bản thử nhỏ nhất (MVP)

1. Khảo sát bằng quét sân và nhận bát → nhóm tính → chỉ số random trong khung.
2. Chuỗi "chó cắn → rửa ở giếng → hái rau → bố thí → ngồi với sư", có 2–3 nhánh.
3. Quả cầu và đồng hồ khi ngồi; tốc độ theo nhóm tính, có hên xui.
4. Thẻ bài sau nhiệm vụ: ba thẻ đầu tiên Sân, Không sân, Niệm (mặt trước và mặt "đặc tính"); album hai trang tốt, xấu; bảng chi tiết lớp Tò mò.
5. Lời nhắc mô phỏng ở màn đầu và chân thẻ.

Nếu vòng này vui thì mới mở rộng sang ngũ căn, giác chi, Bảng tâm. Truyện dài hiện có (m1–m6) sẽ dần chuyển thành các tình huống ngắn.

## 15. Giai đoạn tiếp: thiện mở đường, bất thiện là bài học

Sau bản thử, có hai vấn đề: người chơi đôi khi bị kẹt nhiệm vụ hoặc hết việc để làm, và vai Sư chưa có đời tu đủ sâu. Mục này gom các hướng đã bàn, theo một nguyên tắc chung:

> **Tâm thiện là con đường. Tâm bất thiện là bài học gặp dọc đường.**

Vòng chơi chính:

```
tu tập trên mặt đất (phận sự, hạnh đầu đà, thiền)
   → tâm sáng hơn → nhận và nâng thẻ thiện
   → thẻ thiện mở mạch truyện mới, mở tầng hang sâu hơn
   → trong hang gặp tâm bất thiện, hiểu chúng
   → tâm tối dần, phải lên mặt đất tu tiếp
```

### 15.1. Hai loại thẻ, hai vai trò

| | Thẻ thiện | Thẻ bất thiện |
|---|---|---|
| Nhận được khi | **làm đúng hành vi đó** (bố thí → Không tham, giúp người → Bi, ngồi thiền nhận ra triền cái → Niệm) | **tình cờ gặp** trong khám phá, chủ yếu trong hang |
| Lên cấp | có, cấp 1–5 như mục 4b | **không** |
| Số lần gặp | không giới hạn, càng luyện càng mạnh | khoảng **3 lần**, rồi thành "đã hiểu" và không rơi nữa |
| Mở truyện, mở cửa | **có**, đây là trục tiến lên duy nhất | **không** |
| Mặt cuối | nhân gần, tên Pāli | **chỉ sang pháp đối trị**: *"Từ là đối trị của Sân. Thử giúp bà cụ ở mả."* |

- **Ba lần gặp một thẻ bất thiện:** lần 1 mở mặt trước (chuyện vừa xảy ra); lần 2 mở đặc tính và biểu hiện; lần 3 mở nhân gần và pháp đối trị, rồi thẻ thành **"đã hiểu"**.
- Gom nhiều thẻ bất thiện **không được gì thêm**, nên không ai muốn lao vào cày bất thiện mà bỏ tu tập.
- **Album chia hai phần:** *"Tâm đang tu"* (thiện, có cấp) và *"Tâm đã hiểu"* (bất thiện, có tiến độ hiểu x/14).
- **14 tâm sở bất thiện:** Si, Vô tàm, Vô quý, Trạo cử, Tham, Tà kiến, Mạn, Sân, Tật đố, Xan tham (bỏn xẻn), Hối quá, Hôn trầm, Thụy miên, Hoài nghi.
- **Thẻ thiện là "mắt thấy", không phải sức mạnh.** Thẻ không làm nhân vật mạnh hơn mà cho thấy những gì trước đó không thấy:

| Thẻ thiện | Mở ra |
|---|---|
| Niệm | dấu vết ẩn trên bản đồ (lá gạo sáng), lối đi trong hang |
| Bi | nghe tiếng ngạ quỷ than, mở chuỗi giúp cõi dưới |
| Tùy hỷ | thấy cung điện chư thiên |
| Xả | người thân đã khuất dám đến gần kể chuyện |
| Tàm, Quý | người làng từng làm sai tìm đến xin lời khuyên |

- **"Mắt thấy" theo tâm lúc này.** Thẻ đã có thì giữ, nhưng chỉ hoạt động khi tâm hiện tại đủ sáng. Vừa giận xong thì lá gạo tắt, cung điện mờ. Người chơi tự thấy tâm hiện tại quan trọng hơn bộ sưu tập.
- **Hai nguồn thẻ thiện.** Thiền cho nhóm định và tuệ (Niệm, Tĩnh lặng, Nhu nhuyến, Hỷ). Hành động cho nhóm đức hạnh (Không tham, Bi, Kiên nhẫn). Người không thích ngồi thiền vẫn đi tiếp được.

**Thay đổi so với bản thử:** Sân, Tham, Hối hận hiện lên cấp như thẻ thiện; cần sửa thành 3 lần gặp rồi "đã hiểu".

### 15.2. Hang động: cõi dưới

Tảng đá sau đồi là **cửa vào một thế giới riêng**, không chỉ là một cảnh. Trước mắt làm 1–2 khu; về sau mở thêm tầng.

**Lý do vào hang:** tò mò, và để **hiểu các tâm bất thiện**, vì ở đây chúng hiện thành hình.

| Hiện hình | Tâm sở |
|---|---|
| ngạ quỷ ôm bát rỗng, không chịu chia | Xan tham |
| bóng nhìn trộm ánh đèn người khác | Tật đố |
| tảng đá tự cao chắn lối | Mạn |
| sương mù, ngã ba không biển chỉ | Hoài nghi |
| tiếng vọng nói đi nói lại một lỗi cũ | Hối quá |
| hơi lạnh làm đèn chùng xuống | Hôn trầm, Thụy miên |

**Đi sâu phải có thẻ thiện:**
- Tầng 1, cửa hang: ai cũng vào được.
- Tầng 2: cần Niệm để thấy lối.
- Tầng 3: cần Bi để ngạ quỷ cho đi qua.
- Tầng 4: cần Xả để vượt khu ảo ảnh người thân.

Người chưa tu đủ trên mặt đất chỉ dừng ở cửa hang. Hang là nơi **kiểm tra những gì đã tu**, không thay thế cho tu.

**Bóng tối là tâm:**
- Ánh đèn theo tâm lúc này. Sợ, Sân, Si làm đèn mờ.
- Ngồi yên hoặc ra thẻ Niệm thì đèn sáng lại.
- **Ở lâu trong hang thì tâm tối dần.** Phải lên mặt đất quét sân, ngồi thiền, làm việc thiện để sáng lại. Vòng chơi tự nhiên thành: lên tu, xuống hiểu, lên tu tiếp.

**Người chơi khác** thấy nhau trong hang như đốm đèn từ xa, có thể soi đường cho nhau.

**Nền kỹ thuật cần làm đúng từ đầu:**
- World chở được **nhiều bản đồ** (mặt đất, hang tầng 1, 2…): mỗi bản đồ có địa điểm, nhân vật, bản đồ nhỏ riêng.
- Người chơi chỉ thấy nhau khi cùng bản đồ.
- Điều kiện mở tầng là **điều kiện tâm** (thẻ thiện, việc đã làm), không phải chìa khóa.

**Mở rộng về sau:** hồ ngầm thông xuống cõi long thần (nāga), di tích một vị sư xưa từng ẩn tu trong hang.

**Ranh giới:** giữ giọng "đây là hình tượng biểu đạt tâm". Ngạ quỷ đáng thương, không đáng sợ (mục 9b). Không mô tả cõi giới như một khẳng định.

### 15.3. Phận sự tịnh xá: luôn có việc để làm

Luật tạng (phần Phận sự, *vatta*) có sẵn các việc hằng ngày ở trú xứ: quét sân, gánh nước, lau giảng đường, sắp chỗ ngồi, hầu thầy. Đây là **nền** của game: lúc nào cũng có việc, kể cả khi chuỗi nhiệm vụ đã xong.

**Mỗi vai một kiểu việc:**
- **Sư:** quét sân, gánh nước, hầu thầy, sắp chỗ ngồi.
- **Dân làng:** dâng hoa, nấu cháo, mang nước, lau tượng.
- **Hồn ma:** không làm được việc, chỉ quanh quẩn; có thể làm gió nhẹ giúp hoặc phá.

**Chống nhàm chán:**
- **Phần thưởng giảm dần trong đêm.** Lần đầu được nhiều, lần sau ít. Thông điệp ngầm: quét không phải để lấy thưởng.
- **Biến số nhỏ mỗi lần:** gặp tổ kiến (vòng qua hay quét luôn), nhặt được vật ai đánh rơi (mở một chuyện), gió thổi lá bay lại (thử kiên nhẫn).
- **Tâm ảnh hưởng cách làm.** Quét khi đang Sân thì nhanh nhưng bụi bay, chim hoảng. Quét có niệm thì chậm nhưng thấy được thứ người khác bỏ qua.

**Sự kiện xoay vòng theo canh đêm** vẫn có nhưng **thưa**: con mèo lạc, đứa trẻ khóc, gió tắt đèn chùa, sư kinh hành cần người soi đường. Mỗi sự kiện chỉ hiện khi đúng giờ, đúng nơi, đúng tâm, và không lặp lại trong cùng một đêm.

**Không để kẹt:** nhiệm vụ đứng yên quá vài phút thì một nhân vật đi ngang buông một câu gợi ý. Bước nào cần vật phẩm thì phải có ít nhất một chỗ lấy lại được.

### 15.4. Đời tu của Sư: 13 hạnh đầu đà

Theo Thanh Tịnh Đạo, chương II. Đây là trục chính của vai Sư.

| Nhóm | Hạnh | Gợi ý lối chơi |
|---|---|---|
| Y | y phấn tảo (lượm vải bỏ may y); chỉ giữ ba y | nhặt vải ở bãi tha ma, đống rác; giặt, nhuộm, may thành y **qua nhiều đêm** |
| Ăn | khất thực; khất thực tuần tự từng nhà; ăn một chỗ ngồi; ăn trong bát; không nhận thêm sau khi đã từ chối | đi khất thực theo thứ tự, không chọn nhà giàu; gặp cám dỗ thì từ chối |
| Chỗ ở | ở rừng; gốc cây; ngoài trời; bãi tha ma; chỗ nào được chỉ cũng nhận | chọn chỗ ngồi đêm nay; mỗi chỗ có thử thách riêng: muỗi, mưa, sợ hãi |
| Oai nghi | không nằm (chỉ đi, đứng, ngồi) | cả đêm không nằm; mệt thì hôn trầm kéo tới |

- **Ba mức: nghiêm, vừa, nhẹ**, đúng như Thanh Tịnh Đạo ghi cho từng hạnh. Đầu đêm người chơi **tự phát nguyện** mức nào. Giữ được thì tâm vững hơn và có thẻ thiện; phạm thì chỉ ghi lại, không phạt nặng.
- **Hạnh hợp tính cách:** Thanh Tịnh Đạo nói hạnh đầu đà hợp với người tính tham và tính si. Game đã có hệ tính cách (mục 5), nên có thể gợi ý hạnh hợp từng nhân vật.
- **Bắt đầu bằng y phấn tảo:** chuỗi nhiều đêm, cho người chơi lý do quay lại. Mỗi đêm nhặt được vài mảnh vải; mỗi mảnh có một câu chuyện nhỏ về người từng dùng nó.
- Hạnh đầu đà là **tự nguyện**, không phải điều kiện bắt buộc để chơi vai Sư.

### 15.5. Ngồi thiền sâu hơn: năm triền cái

Thay vì chỉ "ngồi cho đầy quả cầu":

- Khi ngồi, **năm triền cái** lần lượt hiện thành hình ảnh: dục (mùi cơm, hình ảnh đẹp), sân (chuyện chó cắn hiện lại), hôn trầm thụy miên (mí mắt nặng, đèn chùng), trạo cử hối quá (ý nghĩ chạy lung tung, lỗi cũ), nghi (*"ngồi thế này để làm gì?"*).
- Người chơi chỉ cần **nhận ra và gọi tên** đúng thứ đang hiện. Nhận đúng thì nó tan và quả cầu sáng thêm. Nhận sai thì không sao, chỉ chậm hơn.
- **Thẻ đến theo chất lượng, không theo thời lượng:** thẻ Niệm, Tĩnh lặng, Hỷ đến khi nhận ra đúng, không đến vì ngồi lâu.
- **Không đảm bảo:** có đêm ngồi tốt mà không được thẻ, kèm một câu nhẹ: *"Tâm hôm nay động, mai ngồi lại."*
- **Đề mục hợp tính cách** (mục 5) thì triền cái tương ứng dễ nhận ra hơn.
- **Kinh hành** là cách thứ hai: đi chậm, dùng khi hôn trầm nặng.
- **Ranh giới:** không có "chứng thiền", "đắc quả". Chỉ dừng ở mức tâm lắng hơn, thấy rõ hơn (mục 11).

### 15.6. Thứ tự làm đề xuất

1. **Không để kẹt:** câu gợi ý khi nhiệm vụ đứng yên; chỗ lấy lại vật phẩm.
2. **Sửa luật thẻ:** thẻ bất thiện 3 lần rồi "đã hiểu"; album hai phần; mặt cuối chỉ sang đối trị.
3. **Phận sự tịnh xá:** quét sân trước (đã có cơ chế quét lá), phần thưởng giảm dần, biến số nhỏ.
4. **Y phấn tảo:** chuỗi nhiều đêm đầu tiên của vai Sư.
5. **Năm triền cái khi ngồi.**
6. **Nền nhiều bản đồ**, rồi **hang tầng 1–2**.
7. Các hạnh đầu đà còn lại, các tầng hang sâu hơn, sự kiện xoay vòng theo canh.

## 16. Vòng ngày: một đời tu theo từng ngày

Hiện tại game là **"một đêm rồi đổi vai"**: hết đêm thì quay về màn chọn nhân vật. Thiếu vòng lặp nên người chơi không có lý do quay lại với cùng một nhân vật. Mục này đổi thành **"một đời tu theo từng ngày"**: nhân vật sống ở chùa ngày này qua ngày khác, mỗi ngày có việc, có thể dừng ở cuối ngày và quay lại sau.

### 16.1. Một ngày trong game

Mượn nhịp sống ở chùa rừng Theravāda, rút gọn mỗi ngày còn khoảng **15–20 phút chơi**.

| Buổi | Sư | Dân làng | Hồn ma |
|---|---|---|---|
| **Khuya** | ngồi thiền, kinh hành; gặp chư thiên, ngạ quỷ (nội dung hiện có) | ngủ, hoặc thức canh lúa | lang thang, gặp người thức khuya |
| **Rạng sáng** | tụng kinh, đi khất thực | nấu cơm, dâng bát | theo người đi chợ sớm |
| **Sáng** | thọ thực, quét sân, phận sự | làm ruộng, ra chợ | ngồi ngoài tường chùa nghe tụng |
| **Chiều** | học kinh, may y, vào hang | lên chùa nghe pháp, giúp việc chùa | về mả, chờ người hồi hướng |
| **Tối** | tụng kinh chiều, quán xét cuối ngày | thắp đèn, kể chuyện | chờ được hồi hướng |

- Nhân vật có **"Ngày thứ N ở chùa"**. Màn chọn vai chỉ còn dùng để tạo nhân vật mới hoặc đổi nhân vật.
- Mỗi buổi có **1–2 việc chính**, lấy từ phận sự (15.3), hạnh đầu đà (15.4), chuỗi truyện, và **một chuyện tình cờ**. Ngày nào cũng có việc, không ngày nào giống hệt ngày nào.
- Chuyện tình cờ không lặp lại trong vài ngày gần nhau.
- Người chơi **không bắt buộc** làm hết các buổi: có thể bỏ qua một buổi ("để thời gian trôi"). Việc bỏ qua chỉ ghi lại, không bị phạt.

### 16.2. Kết thúc một ngày: quán xét và hồi hướng

Kinh Giáo giới La-hầu-la ở rừng Ambalaṭṭhikā (Trung Bộ 61) dạy soi lại việc mình làm như soi gương: trước, trong và sau khi làm. Đây là cách khép ngày đúng tinh thần, và là nơi tự nhiên để hiện thẻ.

**Màn "Quán xét cuối ngày":**
1. Nhìn lại các việc trong ngày, mỗi việc một dòng kèm thẻ nhận được.
2. Cột mốc mới, nếu có (16.5).
3. **Hồi hướng công đức.** Nghi thức nhỏ để khép ngày; ngạ quỷ ở mả có thể sáng lên.
4. Chọn **"Sang ngày mới"** hoặc **"Nghỉ ở đây"** (16.3).

Đây là **điểm dừng tự nhiên**: người chơi biết lúc nào thoát game là "trọn vẹn", không bỏ dở giữa chừng.

### 16.3. Khi người chơi rời đi

Chọn "Nghỉ ở đây" thì người chơi **giao cho nhân vật một việc**. Mỗi việc **chuẩn bị cho ngày mai**:

| Vai | Việc khi vắng | Ngày mai mở ra |
|---|---|---|
| Sư | ngồi thiền dưới cội cây | một triền cái hiện ra sớm để nhận diện |
| Sư | học một bài kinh (Từ Bi, Hạnh Phúc, Châu Báu…) | thầy hỏi lại bài, có cuộc nói chuyện riêng |
| Sư | may y từ vải phấn tảo | tiến thêm một đoạn trong chuỗi y phấn tảo |
| Sư | giữ hạnh không nằm qua đêm | một thử thách hôn trầm |
| Dân làng | nấu cơm để sáng mai dâng bát | dâng bát cho sư, có cơ hội thẻ Không tham |
| Dân làng | dệt vải | có vải để cúng dường y |
| Dân làng | lên chùa nghe pháp | một tin đồn về nơi chốn (Sổ khám phá) |
| Hồn ma | ngồi ngoài tường nghe tụng kinh | tâm dịu bớt, dễ được người nhìn thấy |

**Khi quay lại:**
- Nhân vật **đang ở đúng chỗ, đúng tư thế** lúc rời đi: đang ngồi dưới cây gạo, đang cầm kinh.
- Một khung ngắn **"Trong lúc vắng"**, chủ yếu là chuyện kể: *"Người này ngồi suốt canh ba. Hôn trầm đến hai lần. Sáng ra có một chiếc lá rơi trên vai."*

**Người chơi khác thấy nhân vật đang vắng:**
- Nhân vật vẫn ngồi ở chỗ cũ, mờ hơn một chút, kèm chữ *"đang ngồi thiền"* hoặc *"đang học kinh"*.
- Người khác có thể **đặt một bông hoa, cúi chào**. Không nhắn tin, không tương tác gì khác.
- Lần sau quay lại: *"Có 2 người dừng lại chắp tay khi người này vắng."*

**Ranh giới:**
- **QUYẾT ĐỊNH MỚI (mục 18, thay dòng cũ):** kết quả khi vắng vẫn nhỏ, có trần, nhưng **phải có thành quả thật** theo loại việc (kiến thức đã đọc/học, vật liệu đã chuẩn bị, manh mối, tương tác mới). **Có thể nhận thẻ kiến thức**, không tự nhận thẻ tâm sở thực hành, không tự lên cấp Niệm/Định. Một lượt giao việc chỉ trả kết quả một lần.
- Vắng không bị phạt: nhân vật không đói, không mất gì.
- **Không quà điểm danh hằng ngày.** Chuỗi ngày chỉ ở dạng "chuỗi mềm", vắng thì tạm nghỉ chứ không mất (16.8).
- Lời văn giữ đúng: *"nhân vật vẫn ngồi"*, không ngụ ý tu thay hay tu tự động có kết quả.

### 16.4. Trạng thái cần lưu cho mỗi nhân vật

- ngày thứ mấy, buổi nào;
- đang ở bản đồ nào, chỗ nào, tư thế gì;
- việc giao khi vắng, thời điểm rời đi;
- việc trong ngày đã làm, chuyện tình cờ đã gặp gần đây (để không lặp);
- cột mốc đã đạt.

Bỏ luồng "hết đêm thì về màn chọn vai". Hồn ma hiện kết thúc bằng việc buông bỏ; với vòng ngày, đó trở thành **một cột mốc lớn** chứ không phải kết thúc nhân vật. Hồn ma buông bỏ xong thì **tái sinh** thành một nhân vật mới có liên hệ (16.8).

### 16.5. Cột mốc

Nhận thẻ, kể cả thẻ bất thiện, là **một cột mốc**. Theo Tứ niệm xứ, biết tâm có sân là "tâm có sân" đã là niệm. Vì vậy cột mốc ghi nhận **việc thấy được**, không khen chê thiện hay bất thiện.

| Cột mốc | Câu hiện ra |
|---|---|
| **Thẻ đầu tiên** (bất kỳ) | *"Lần đầu nhìn thấy tâm mình."* |
| Thẻ bất thiện đầu tiên | *"Thấy được Sân. Biết nó đang có mặt là bước đầu của niệm."* |
| Thẻ thiện đầu tiên | *"Một hạt giống thiện đã nảy mầm."* |
| Hiểu trọn một tâm sở bất thiện (15.1) | *"Đã hiểu Sân: nó là gì, từ đâu đến, cái gì làm nó dịu."* |
| Hiểu đủ ba gốc tham, sân, si | màn "gộp lại": ba gốc của mọi tâm bất thiện |
| Ngày đầu tiên trọn vẹn | *"Một ngày ở chùa."* |
| 7, 30, 100 ngày ở chùa | **cộng dồn, không cần liên tiếp** |
| May xong y phấn tảo | áo y màu đất **thành skin** của nhân vật |
| Hồi hướng cho ngạ quỷ lần đầu | hình ngạ quỷ sáng lên trong sổ |
| Soi đường cho người khác trong hang | cột mốc kết nối |
| **Cột mốc ẩn** | chỉ hiện khi gặp, ví dụ ngồi đủ lâu ở mả mà không sợ |

**Cách hiện:**
- Lúc đạt: một màn nhỏ, có hình minh họa, nhạc chuông nhẹ.
- Trang **"Dấu mốc"** trong hồ sơ nhân vật: hình, ngày đạt, câu chuyện lúc đó.
- Phần thưởng chỉ là **ghi nhớ, hiểu thêm, đôi khi skin**. Không sức mạnh, không chỉ số.
- **Riêng tư.** Người chơi khác chỉ thấy skin (ví dụ y màu đất), không thấy danh sách cột mốc.
- Mật độ: dày ở những ngày đầu (để người mới thấy mình đang tiến), thưa dần về sau.

### 16.6. Thứ tự làm đề xuất

1. Vòng ngày tối giản cho **Sư**: khuya → khất thực → quét sân → tối. Dân làng và hồn ma tạm dùng vòng đơn giản hơn.
2. Quán xét cuối ngày, hồi hướng, chọn "Sang ngày mới" hoặc "Nghỉ ở đây".
3. Việc khi vắng và khung "Trong lúc vắng".
4. Cột mốc, bắt đầu bằng ba cột mốc thẻ đầu tiên và "Một ngày ở chùa".
5. Người khác thấy nhân vật đang vắng, đặt được hoa.

### 16.7. Đánh giá

**Điểm mạnh**
- **Có lý do quay lại với cùng một nhân vật:** việc khi vắng chuẩn bị cho ngày mai, chuỗi nhiều ngày (y phấn tảo), số ngày ở chùa.
- **Có điểm dừng tự nhiên:** cuối ngày là lúc thoát game trọn vẹn, hợp người chơi casual 15–20 phút.
- **Gắn kết với tinh thần game:** quán xét theo kinh, hồi hướng, nhịp sống chùa thật; người chơi học về đời sống tu viện mà không cần giảng.
- **Cột mốc đổi cách nhìn thẻ bất thiện:** "thấy được" là thành tựu, giảm cảm giác bị phán xét.
- **Kết nối xã hội nhẹ nhàng:** đặt hoa cho người đang vắng, không cần chat, ít rủi ro quấy rối.
- **Tận dụng thứ đã có:** thẻ, sổ khám phá, profile, avatar và skin, tài khoản lưu nhân vật.

**Điểm yếu và rủi ro**
- **Khối lượng nội dung lớn nhất từ trước tới giờ:** 5 buổi × 3 vai, cộng chuyện tình cờ. Nếu thiếu nội dung thì ngày thứ 4–5 bắt đầu lặp. Cách giữ: làm vai Sư trước, mỗi buổi chỉ 1–2 việc, ưu tiên các hệ có biến số (phận sự với biến số nhỏ, triền cái ngẫu nhiên).
- **Nhịp chậm có thể không hợp mọi người:** người thích hành động sẽ thấy quét sân, tụng kinh là chậm. Bù lại bằng hang động và chuyện tình cờ để có lúc hồi hộp.
- **Vòng lặp quay lại mỗi ngày là kỹ thuật hai mặt:** dễ trượt sang kiểu game nhàn rỗi gây nghiện. Cách giữ: móc bằng tò mò và tiến bộ thay vì sợ mất, chuỗi mềm, không phạt khi vắng, kết quả khi vắng có trần (16.8).
- **Mất cảm giác "kết thúc trọn":** "một đêm" trước đây có mở và kết rõ. Cần giữ các **cung truyện có kết** (chuỗi Hạnh, y phấn tảo) bên trong vòng ngày.
- **Hồn ma khó khớp vòng ngày:** hồn ma có cung "buông bỏ" mang tính kết thúc. Cần thiết kế riêng (16.4).
- **Cột mốc có thể kéo người chơi về đuổi danh sách:** giữ riêng tư, có cột mốc ẩn, không đếm phần trăm hoàn thành.
- **Kỹ thuật:** lưu trạng thái nhân vật chi tiết hơn; hiển thị nhân vật vắng cho người khác cần server giữ danh sách "nhân vật đang nghỉ", không chỉ người đang online.
- **Kiểm chứng:** chưa biết người chơi thật có quay lại hay không. Nên làm bản tối giản (16.6 bước 1–2) rồi cho vài người chơi thử 3–5 ngày trước khi làm tiếp.

### 16.8. Giữ chân người chơi và phương án cho từng điểm yếu

Game cần **móc giữ chân mạnh**: không quay lại thì không học được. Nhưng game dạy về Tham mà giữ người chơi bằng cách khai thác lòng tham và nỗi sợ mất của họ thì tự mâu thuẫn, và người chơi Phật tử, các chùa sẽ nhận ra.

> **Nguyên tắc:** móc mạnh, nhưng móc bằng **tò mò, chờ đợi, tiến bộ, quan hệ**. Không móc bằng **sợ mất, so bì, trả tiền**.
>
> **Câu kiểm tra mỗi móc trước khi thêm:** *"Cái móc này giữ người chơi bằng tò mò, chờ đợi, tiến bộ, quan hệ, hay bằng sợ mất, so bì?"*

#### Móc nên dùng mạnh tay

| Móc | Cách làm trong game |
|---|---|
| **Tò mò** | dấu "?" trong Sổ khám phá, mặt thẻ chưa mở, tầng hang chưa vào |
| **Hẹn ngày mai** | việc khi vắng chuẩn bị cho mai; *"Hoa sen ở ao sẽ nở sáng mai"*; *"Mai thầy kể tiếp chuyện Hạnh"*. Mỗi ngày kết thúc bằng **một câu treo** |
| **Tiến bộ thấy được** | thẻ thiện lên cấp, y may dần qua từng đêm, số ngày ở chùa |
| **Bất ngờ hiếm** | chư thiên hiếm, cột mốc ẩn, chuyện tình cờ; phần thưởng bất ngờ đến từ việc chơi, không từ tiền |
| **Lịch thật** | ngày rằm, mùng một thật là ngày Bát quan trai trong game; Vesak; mùa an cư 3 tháng là một "mùa" lớn |
| **Quan hệ** | đặt hoa cho người vắng, soi đường trong hang, nhân vật trong làng nhớ việc người chơi đã làm |
| **Bản sắc** | skin kiếm bằng tu tập (y màu đất), nhân vật mang dấu ấn riêng |

#### Vùng xám: dùng có điều kiện

| Móc | Phiên bản dùng trong game |
|---|---|
| Chuỗi ngày liên tiếp | **chuỗi mềm**: có đếm; vắng thì chuỗi "tạm nghỉ", không về 0 |
| Thông báo | người chơi tự bật; nội dung là chuyện trong game (*"Sen đã nở"*), không bao giờ *"Bạn sắp mất chuỗi!"* |
| Quà khi quay lại | **quà chào mừng sau khi vắng** (*"Có người để lại gói xôi ở cổng"*), không phải quà điểm danh mỗi ngày |
| Sự kiện có hạn | sự kiện theo mùa **lặp lại hằng năm**; lỡ năm nay thì năm sau còn |

#### Không dùng

- gacha, mua thẻ, mua công đức;
- phạt khi vắng; thứ quý chỉ có một lần rồi mất vĩnh viễn;
- bảng xếp hạng công đức, so sánh tâm giữa người chơi;
- hệ năng lượng để bán.

#### Biến mâu thuẫn thành nội dung

- Chơi lâu liền mạch thì sư già nhắc: *"Ngồi lâu rồi, nghỉ mắt đi con."*
- Cột mốc ẩn: *"Thấy được mình đang muốn chơi thêm. Đó cũng là Tham."*
- Người chơi học được ngay trên chính trải nghiệm chơi game của mình.

#### Phương án cho từng điểm yếu (16.7)

**Nội dung lặp (rủi ro lớn nhất)**
- **Ghép tình huống từ mảnh:** mẫu tình huống × nơi chốn × loài gặp × giờ, trăng, thời tiết × tâm hiện tại. Ví dụ "chó cắn" + mưa + đang Sân khác hẳn "chó cắn" + nắng + có Niệm. 20 mẫu có thể cho hàng trăm biến thể.
- **Nhân vật trong làng có trí nhớ:** bà cụ nhớ hôm qua được dâng cơm, ông Tư nhớ chuyện con chó. Làng thay đổi theo người chơi.
- **Nhịp tuần, tháng, mùa:** ngày thường, ngày rằm, mùa an cư, lễ dâng y Kathina cuối mùa.
- **Dấu vết người chơi khác** (đã có) làm mỗi ngày khác nhau.
- **Quy trình viết:** mỗi tình huống 3–5 câu ngắn theo mẫu. Có thể dùng AI soạn nháp, nhưng **người duyệt từng câu**, nhất là câu về giáo lý.

**Nhịp chậm**
- Mỗi ngày có **đường cong nhịp**: yên lúc khuya, động lúc khất thực, hồi hộp lúc chiều vào hang, lắng lúc quán xét tối.
- **Việc thuần thục thì làm nhanh:** quét sân đủ nhiều lần thì có nút *"Quét như mọi ngày"*, xong trong vài giây; chỉ khi có biến số mới phải chơi kỹ.
- Phận sự có kỹ năng thật: quét đúng nhịp, gánh nước không đổ.

**Mất cảm giác kết thúc trọn**
- **Cung truyện 3–7 ngày** có mở và kết: y phấn tảo, chuyện Hạnh, một ngạ quỷ được siêu thoát.
- **Mùa là một chương:** mùa an cư có lễ kết thúc (Kathina), tổng kết mùa, rồi sang chương mới.

**Hồn ma khó khớp vòng ngày**
- Vòng ngày của hồn ma là hành trình đến buông bỏ, khoảng 5–10 ngày.
- Buông bỏ xong là cột mốc lớn, rồi **tái sinh**: chọn tái sinh thành một em bé trong làng, một nhân vật mới **có liên hệ** với hồn ma cũ, giữ một phần ký ức và thẻ.
- Đúng với giáo lý tái sinh, và giữ được người chơi.

**Đuổi theo danh sách cột mốc**
- Không hiện phần trăm hoàn thành; phần lớn cột mốc là ẩn; mỗi cột mốc là một câu chuyện, không phải một ô đánh dấu.

**Kỹ thuật**
- Rời game thì lưu ảnh chụp trạng thái nhân vật (16.4).
- Server giữ danh sách "nhân vật đang nghỉ" theo bản đồ, gửi kèm khi có người vào; giới hạn vài chục người cho nhẹ.

**Chưa kiểm chứng**
- Đo vài chỉ số ẩn danh: tỷ lệ quay lại sau 1 ngày, sau 7 ngày; số ngày chơi trọn; độ dài mỗi lần chơi; người chơi bỏ ở buổi nào.
- Cho 5–10 người chơi thử 1 tuần, rồi phỏng vấn ngắn: ngày nào thấy chán, vì sao quay lại.

## 17. Bước tiếp theo: tạo bất ngờ cho người chơi

Game đã có nhiều chỗ **mở chuyện**: thẻ, cột mốc, quán xét cuối đêm, việc khi vắng, chư thiên, hang, thiên cung. Cái còn thiếu là **phần đáp lại**: game hứa thì hôm sau phải xảy ra thật, người chơi làm gì thì thế giới phải nhớ. Bất ngờ cuốn hút nhất đến từ đó, không phải từ thêm nội dung mới.

> Mỗi gói dưới đây vẫn qua câu kiểm tra ở 16.8: móc bằng tò mò, chờ đợi, tiến bộ, quan hệ; không móc bằng sợ mất, so bì.

### 17.1. Lời hẹn thành thật, làng có trí nhớ

*Công sức nhỏ, bất ngờ cao nhất. Làm trước.*

- **Lời hẹn xảy ra thật.** Câu "Ngày mai" cuối đêm hiện chỉ là chữ. Đêm sau phải có đúng việc đó:
  - hẹn *"Sen ở ao sẽ nở"* thì đêm sau ao có sen nở, kèm một khoảnh khắc riêng;
  - hẹn *"Mai thầy kể tiếp"* thì sư già đứng đợi ở am.
- **Người làng nhớ việc đã làm:**
  - bà cụ nhớ hôm qua được dâng cơm: *"Hôm qua thầy cho bà nắm xôi, nay bà để dành quả chuối."*;
  - ông Tư nhớ chuyện con chó;
  - lời nói thay đổi theo việc người chơi đã làm, không lặp một câu.
- **Cột mốc ẩn tự soi** đi kèm: *"Thấy được mình đang muốn chơi thêm. Đó cũng là Tham."*
- **Kỹ thuật:** dùng lại biến `vars` trong tiến độ nhân vật. Chủ yếu là viết lời.
- **Vì sao:** người chơi thấy việc mình làm có hậu quả. Đây là lý do quay lại mạnh nhất mà không cần ép.

### 17.2. Ngồi thiền có triền cái

*Công sức vừa, vừa vui vừa dạy. Đây là bản cụ thể của 15.5.*

- **Khi ngồi, quanh nhân vật hiện các thứ làm xao lãng:**
  - bướm bay: phóng dật;
  - tiếng chó sủa: sân;
  - mùi xôi: tham dục;
  - mí mắt nặng: hôn trầm;
  - ý nghĩ "ngồi vậy có đúng không": hoài nghi.
- **Cách chơi:** người chơi **chạm nhẹ để ghi nhận**, không đuổi đi. Ghi nhận đúng lúc thì quả cầu sáng nhanh hơn và có cơ hội nhận Niệm.
- **Phần thưởng hiếm:** ngồi lâu mà yên thì đôi khi giác chi Hỷ hiện ra, kèm hiệu ứng đẹp (nối với mục 9).
- **Có hên xui:** thứ tự và nhịp xuất hiện ngẫu nhiên, nên mỗi lần ngồi khác nhau.
- **Vì sao:** lúc ngồi đang thụ động trở thành việc có tay nghề. Người chơi tự học được rằng *biết nó đang có mặt là niệm*.

### 17.3. Đêm rằm theo lịch thật

*Công sức nhỏ đến vừa. Tạo hẹn tự nhiên.*

- Ngày rằm, mùng một âm lịch thật là đêm đặc biệt trong game:
  - trăng tròn, ao sen sáng;
  - chư thiên dễ gặp hơn;
  - người làng lên chùa đông;
  - vai dân làng có Bát quan trai.
- Lặp lại mỗi tháng, mỗi năm. Lỡ tháng này thì tháng sau còn, đúng nguyên tắc "không sợ mất".
- **Vì sao:** người chơi có lý do mở game đúng ngày rằm. Đêm rằm sắp tới cũng là dịp thử với người chơi thật.

### 17.4. Bộ đôi thẻ mở cảnh hiếm

*Công sức vừa. Làm thẻ có ý nghĩa hơn.*

- **Có đủ hai thẻ thiện liên quan thì mở một cảnh ẩn.** Ví dụ:
  - Bi + Tùy hỷ: gặp đứa bé lạc;
  - Niệm + Không sân: đi qua con chó dữ mà nó nằm yên;
  - Không tham + Hỷ: được mời vào thiên cung.
- Không báo trước bộ đôi nào mở cảnh gì. Cảnh mở ra như một bất ngờ, kèm hình minh họa của hai thẻ.
- **Chỉ thẻ thiện ghép bộ**, đúng với 15.1: thiện mở đường, bất thiện là bài học.
- **Vì sao:** thêm tò mò; thẻ không chỉ để sưu tầm (mục 4a).

### 17.5. Chuyện y phấn tảo: cung truyện 3–5 đêm của Sư

*Công sức vừa đến lớn. Bản cụ thể của 15.4.*

- **Diễn tiến qua các đêm:** mỗi đêm nhặt một mảnh vải, giặt, nhuộm màu đất, may dần.
- **Tiến bộ nhìn thấy được:** tấm y hiện dần trên nhân vật.
- **Đêm cuối:** lễ nhận y, kèm cột mốc và skin y màu đất.
- **Vì sao:** có cảm giác *kết thúc trọn* bên trong vòng ngày (16.7).

### 17.6. Đặt hoa cho người đang vắng

*Công sức vừa, cần phía server. Bản cụ thể của 16.6 bước 5.*

- Nhân vật đang nghỉ hiện mờ ở chỗ họ dừng lại.
- Người khác đặt được một bông hoa bên cạnh.
- Khi quay lại, khung "Trong lúc vắng" báo: *"Có 3 người đặt hoa cạnh thầy."*
- **Vì sao:** kết nối xã hội ấm, không cần chat, ít rủi ro quấy rối.

### 17.7. Để sau

- **Hang nhiều tầng (15.2):** đáng giá nhưng tốn nhất. Làm sau khi 17.1–17.4 cho thấy người chơi có quay lại.

### 17.8. Thứ tự và kiểm chứng

1. 17.1 và 17.2: cho cảm giác "game này sống" nhanh nhất.
2. 17.3: kịp đêm rằm tới để thử với người chơi thật.
3. Cho 3–5 người chơi thử vài ngày, xem họ có tự quay lại không.
4. Rồi mới làm 17.4, 17.5, 17.6, sau đó tới hang.

**Trước khi mời người chơi:** thử lưu tiến độ một lần trên Render với Postgres thật.

**Cần thầy duyệt:** lời các triền cái, giác chi, câu nói của người làng, và cảnh mở từ bộ đôi thẻ (để không gán sai quan hệ giữa các tâm sở).

### 17.9. Sổ đăng ký mạch nhiệm vụ thẻ đang triển khai

Thẻ chỉ xuất hiện sau một **lựa chọn có ngữ cảnh** của PC. Nhìn NPC sợ, đứng gần một cảnh, chờ đồng hồ hoặc hoàn thành khảo sát không tự cấp thẻ.

| Quest ID | Vai | Mạch truyện / địa điểm | Điều kiện và lựa chọn ghi nhận | Thẻ |
|---|---|---|---|---|
| `G01_REGRET_AFTER_SCARE` | Hồn ma | G01, hiên ông Tư | Đã làm bóng lướt qua vách khiến ông sợ; nghe ông thở dốc và chủ động nhìn nhận sự day dứt | Hối hận |
| `G02_CLING_TO_SCENT` | Hồn ma | G02, ngoài tường tịnh thất | Thấy một bóng đói khác tới gần và chủ động chắn làn hương để giữ riêng | Bỏn xẻn |
| `V04_MAKE_PEACE_WITH_DOG` | Người dân | Con Vàng, ngõ làng | Đã từng quát con Vàng; quay lại ngồi thấp, không quát thêm và chờ nó bớt sợ | Không sân |
| `MN03_RECOGNIZE_CONFUSION` | Nhà sư | Sau tịnh thất | Kiểm tra tiếng gõ, thấy cành cây và nhận ra mình đã kết luận khi chưa nhìn rõ | Si |
| `MN04_RECOGNIZE_AGITATION` | Nhà sư | Bờ ao | Nhận ra tâm đang chạy hết đối tượng này sang đối tượng khác rồi trở lại tiếng nước | Phóng dật |
| `MN05_RECOGNIZE_DULLNESS` | Nhà sư | Mái hiên tịnh thất | Nhận ra sự trì trệ/buồn ngủ và chủ động đổi sang kinh hành | Hôn trầm |
| `MN06_RECOGNIZE_HINDERING_DOUBT` | Nhà sư | Lối kinh hành cạnh mộ | Câu hỏi làm PC không bắt đầu được; ghi câu hỏi để hỏi thầy rồi chọn một việc để thực hành | Hoài nghi |

Các đường nhận đã có trước vẫn giữ: chó cắn (`Sân`, `Hối hận` cho save legacy), G01 PC ma bám thú hù người (`Tham`), HG27 (`Bi`, `Không tham`, `Tùy hỷ`), ngồi chủ động với sư (`Niệm`, sau nhiều buổi đủ điều kiện mới có `Định`), dâng sen/gặp chư thiên (`Hỷ`). Một lựa chọn thiện thông thường không bắt buộc rơi thẻ.

**Kiểm tra nhất quán:**

- Bốn thẻ triền cái của Sư là kết quả **nhận diện đúng tình huống**, không phải chẩn đoán mọi ý nghĩ đời thường.
- PC ma không nhận `Niệm`/`Định` từ G02; `Bỏn xẻn` thuộc động cơ giữ riêng của PC, không phải do bóng khác đói.
- `Không sân` chỉ tới sau nhánh quay lại sửa quan hệ; lần đầu ngồi yên với con Vàng là cách cư xử bình thường, chưa tự phát thẻ.
- Các mạch bị bỏ lỡ vẫn còn ở đêm sau; không khóa G07, bản đồ hoặc ending bằng việc phải đủ thẻ.

## 18. Quyết định mới: hoạt động khi vắng phải tạo kết quả (07-11-2026)

**Đổi hướng thiết kế:** giống trò làm vườn, gieo hạt thì lúc quay lại thấy cây đã lớn và có thứ để thu hoạch. Trong game: `giao việc` → `thấy tiến trình` → `nhận phần thưởng hữu hình` → `lưu vào sổ/túi` → `dùng để mở hành động, đối thoại, nhiệm vụ tiếp theo`. Đặc tả đầy đủ, UI mẫu, schema, ví dụ và tests trong [Kịch bản vòng ngày — mục 9](kich-ban-vong-ngay.md).

### 18.1. Kết quả theo đúng loại công việc

| Công việc khi vắng | Kết quả phải nhận được | Cách sử dụng lần sau |
|---|---|---|
| Học một đoạn kinh/khái niệm | **Thẻ kiến thức** có tên, giải thích, nguồn và ghi chú trong **khu Đã học (Sổ Hành Trình)** | đối thoại sâu hơn với sư, mở nhiệm vụ phụ, gợi ý thực hành |
| Chuẩn bị khâu y, phơi vải | vật liệu đã sẵn sàng, vải đổi hình và trạng thái | người chơi chủ động khâu/nhuộm lần sau |
| Nấu cơm / dệt vải (dân) | bữa cơm đã sẵn / tấm vải dài thêm, có vật dụng khi hoàn tất | mang dâng, giúp người, nối tuyến y |
| Ngồi thiền/kinh hành khi vắng | nhật ký một buổi sinh hoạt và tình huống thực hành chờ sẵn | thực hành **chủ động** để gặp thẻ tâm sở |
| Hồn ma nghe kinh / nhìn lại chuyện cũ | mảnh "đã nghe" hoặc ký ức mới | thêm lựa chọn nhìn lại, không thao tác người sống |

**Mỗi lần quay lại:** dù chưa hoàn tất phải thấy progress, không chỉ ba dòng kể. Khi hoàn tất một công việc, có popup nhận kết quả, cất thật vào dữ liệu nhân vật, mở được chi tiết. Không có cơ chế điểm danh hay tăng tốc trả tiền.

### 18.2. Kiến thức khác thẻ tâm sở đã trải nghiệm

> **Thiết kế hợp nhất:** kiến thức được lưu ở khu **Đã học** của [Sổ Hành Trình](journey-memory-and-return-ux.md), không mở một sổ hoặc Album thẻ kiến thức riêng. `đã ôn` và `đã vận dụng` là thuộc tính bổ sung theo mục, không phải thang khám phá độc lập.

Trong **Sổ Hành Trình**, khu **Đã học** gồm các mục ngắn như *Niệm là gì?*, *Năm triền cái*, *Tâm từ*, *Vô thường*, *Giữ lời hứa*, *Hạnh đầu-đà*. Có tên, nguồn từ kinh hoặc chú giải, câu giải thích đời thường, ví dụ trong làng, nơi dùng về sau. Trạng thái của mỗi mục: **đã nghe/đọc** → **đã ôn** → **đã vận dụng trong câu chuyện**.

Ví dụ người chơi giao nhân vật học về *năm triền cái*, thoát game. Khi quay lại sau khi hoàn tất bài: **"Đã học một đoạn về năm triền cái"**, có nút **Mở Hành trình → Đã học**, và gợi ý đến gặp sư già. Lúc gặp sư, nếu có kiến thức này sẽ xuất hiện thêm lựa chọn **"Con muốn học cách kinh hành khi tâm chìm xuống"**. Nếu chưa có, nhiệm vụ chính vẫn chơi được bằng cách thông thường. Kiến thức tạo lợi thế khám phá, **không phải cộng chỉ số tu chứng**.

**Ranh giới:** *đã nghe/đọc về Định* không đồng nghĩa *đã nhận diện Định trong thực hành*; offline không tự cấp thẻ Niệm, Định, giác chi hay "đã chứng". Nhưng **thẻ kiến thức từ học kinh hoàn toàn có thể nhận được khi vắng**, khác với quy tắc cũ.

**Giới hạn phần thưởng:** một `jobId` chỉ sinh một lần kết quả và được lưu trước khi mở popup; quay lại nhiều lần, đổi thiết bị hay mất kết nối không nhân thưởng. Bài đã học có thể ôn sâu, không tạo thẻ mới vô tận. Vắng một tuần không biến một việc thành bảy buổi tu tập.

### 18.3. Lỗi logic: Bà cụ nhờ hái rau nhưng mang sang nhà ông Tư

Đã xác nhận `public/mind.js`: `atWell()` là bà cụ nhờ hái một nắm rau má. Tại `atMit() → picked2()`, lại có ba lựa chọn **đem cho bà**, **đem cho ông Tư**, **giữ nấu canh**, trong khi nhánh sau không giải quyết lời hứa với bà. Đây là lỗi **nhân quả / chủ sở hữu vật phẩm / trí nhớ của NPC**.

**Luồng đề xuất:**
1. Người chơi **nhận lời** bà, lưu `grannyHerbs.status=accepted`. Hái xong, nhiệm vụ chính là **trả về cho bà**, không tự chuyển nguyên nắm rau đã nhận nhờ sang người khác.
2. **Sau khi trả bà** (lưu `fulfilled`), bà có thể cho một phần hoặc nhờ **hái thêm nắm khác** để đem cho ông Tư. Khi đó mở nhánh làm lành và có thể nhận Không sân/Không tham theo trải nghiệm.
3. Nếu vẫn cho phép đổi ý để tặng người khác trước, phải có ký ức "bà vẫn chờ", thừa nhận đã thất hứa, và lựa chọn xin lỗi/quay lại sửa; **không** âm thầm coi là đã hoàn tất.
4. Không nhân đôi một `rau_ma` thành hai vật phẩm. Cần tests cho save/reload ở từng nhánh và lời thoại bà trong ngày sau.

**Điểm cần thầy Theravāda duyệt:** game hiện cho cả `monk` và `villager` tự hái cây. Tỳ-kheo chủ ý bứt/cắt cây sống có liên quan quy tắc Pācittiya 11; nên ưu tiên **vai dân trực tiếp hái**, sư nhận/quan sát theo nghi thức phù hợp, đồng thời rà lại nhiệm vụ tự hái hoa sen. Nguồn tham khảo để giáo thọ xác nhận: https://www.dhammatalks.org/vinaya/bmc/Section0017.html.

### 18.4. Trạng thái và kế hoạch

**Tất cả nội dung mới thuộc khu Đã học trong Sổ Hành Trình, phần thưởng offline có tác dụng gameplay và sửa rau má ở mục 18 đều CHƯA CODE.** Không nhầm với nhánh PR thử đã có tuyến ma và y phấn tảo.

Ưu tiên triển khai: **(1)** sáu mục trong khu **Đã học** của Sổ Hành Trình; **(2)** hoạt động `study` trả một mục kiến thức và lưu chống lặp; **(3)** kiến thức mở 2–3 hội thoại phụ; **(4)** `weave/cook` có sản phẩm thật; **(5)** sửa chuỗi rau má và các chỗ cần kiểm tra giới luật; **(6)** thêm hoạt động offline theo vai.

Tiêu chí nghiệm thu quan trọng: quay lại sớm có progress, quay lại muộn có thứ thu hoạch, phần thưởng không nhân bản, không tự nhận thẻ tu chứng, kiến thức mở được nhánh thực sự, và lời hứa với bà cụ không thể bị bỏ quên một cách vô lý.

