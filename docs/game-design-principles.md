# Game Design Principles — Game khám phá lấy cảm hứng từ Phật pháp

> **Quyết định thiết kế 07-11-2026 | Trạng thái: tài liệu định hướng, chưa phải tính năng đã triển khai.**
>
> Tài liệu này là **nguồn chuẩn để ra quyết định** khi viết quest, thẻ tâm sở, Sổ kiến thức, map, cõi giới, UI và hoạt động khi vắng. Đối chiếu [World Exploration Bible](world-exploration-bible.md), [Hệ thống tâm](he-thong-tam.md), [Kịch bản vòng ngày](kich-ban-vong-ngay.md). Nếu tài liệu cũ mô tả việc học/khảo sát hoặc popup là bắt buộc, ưu tiên nguyên tắc mới ở đây và ghi lại chỗ cần sửa.

## 1. Định vị và lời hứa với người chơi

**Đây là một trò chơi khám phá, kể chuyện, sinh hoạt và tu tập *mô phỏng* lấy cảm hứng từ Phật pháp, không phải ứng dụng giảng dạy giáo lý, công cụ chẩn đoán tâm hay hệ thống đo chứng đắc.**

> **Game trước — Phật pháp tạo chiều sâu — Người chơi chọn cách trải nghiệm — Mô phỏng minh bạch.**

- Người chơi **vào vì thích chơi**: cảnh đẹp, nơi lạ, sinh linh, chuyện đời, âm thanh, sự thay đổi của thế giới và điều bí ẩn phía xa.
- Người chơi **ở lại vì tò mò và có tiến triển**: manh mối, địa danh, mối quan hệ, vật dụng, kiến thức, thẻ và các tương tác mới. Không chỉ là nhiệm vụ đi từ A tới B.
- Người chơi **hiểu thêm về Phật pháp** khi việc đã thấy gợi câu hỏi: tại sao một sinh linh khổ, vì sao tâm dao động, làm thế nào để nhận diện sân/sợ hãi, vì sao giữ lời hứa quan trọng.
- Người chơi **quay lại vì một kết quả cụ thể**, kể cả sau lượt giao việc 1–2 phút: trang kinh đã học, vật liệu đã chuẩn bị, đoạn ký ức mới, cảnh vật đã đổi.
- Không ép chơi đủ một đêm, không ép đọc kinh, không streak/phạt nghỉ, không biến nghiệp/công đức thành điểm số có thể mua bán.

## 1a. Nhân vật của người chơi phải độc lập với NPC (quyết định mới 08-11-2026)

**PC do người chơi đặt tên và chọn vai sư/dân/ma; tên gọi chỉ là của PC, không phải danh tính Sư Tịnh, Ông Tư hoặc Bà Sáu.** Ba người có tên là **NPC** mang quá khứ, ký ức, lời hẹn riêng. Tham khảo bắt buộc [Player-centric Narrative Model](player-character-narrative-model.md) trước mọi kịch bản mới.

- Vai xác định cách hành động/tương tác và bối cảnh, **không** tự thêm vợ/con/món nợ/đêm đã tu/ký ức của NPC vào PC.
- Truyện cũ về ba nhân vật cần chuyển thành `NPC story` / `hears_story` / `npc_flashback` hoặc cảnh PC chủ động tham gia; không chỉ tìm/thay tên bằng `playerName`.
- Ký ức và lời hứa trải nghiệm thuộc **character**; tư liệu đã xem trong tài khoản không tự coi như nhân vật khác đã trải qua. Save legacy cần migration và test.
- **Giọng văn:** nhẹ, gần người trẻ bằng câu ngắn, sinh hoạt và hài hước tự nhiên; không giáo điều, không ép trendy slang. Mặc định 1–3 lượt thoại/scene nhỏ, có `Nghe thêm`, `Đi tiếp`, phần kinh/luận dài ở Sổ.
- Mẫu kiểm tra: PC dân nói chuyện với Ông Tư mà không gặp chính mình; PC ma thấy câu chuyện Bà Sáu mà không tự có con Hạnh; PC sư gặp Sư Tịnh mà không mặc định đã bị xua đuổi.

> **Quy tắc thiết kế thẻ cho PC hồn ma (09-11-2026):** hồn ma không có tuyến tu tập thiền/niệm giống PC người và nhà sư; giải đố, quan sát, nghe âm thanh ở Bến Không Tiếng **không mở thẻ Niệm (sati) hoặc Định**. Thẻ bất thiện xuất hiện theo động cơ trong câu chuyện (Tham/Sân/Hối...), thẻ thiện chỉ là **khoảnh khắc rất hiếm có kịch bản riêng**, không mặc định vì giúp ai đó hoặc nghe hồi hướng. Đây là giới hạn tuyến nhân vật của **game**, không phải khẳng định tất cả chúng sinh peta trong giáo lý tuyệt đối không thể phát sinh tâm thiện; xem [Ghost Campaign Bible §2.3](ghost-playable-campaign-bible.md).

> **Trí nhớ hành trình:** [Journey Memory & Return UX](journey-memory-and-return-ux.md) đề xuất Sổ Hành Trình theo character, tách lời NPC kể và sự thật được xác nhận, hồi tưởng ngắn tùy chọn; điểm nghỉ tự do, **không** có nơi nghỉ mặc định cho mọi hồn ma. [Ghost Mischief](ghost-mischief-cards-and-shared-dedication.md) làm rõ NPC dân có thể **sợ thật** khi bị ma hù, sư thường bình tĩnh hơn; thẻ bất thiện của PC ma chỉ xét theo **động cơ PC**, không theo nỗi sợ của NPC, hù người chơi thật cần opt-in.

> **Một vai, một trải nghiệm đáng chơi:** [Ghost Campaign Bible](ghost-playable-campaign-bible.md) quy định PC ma phải có **cơ chế khác** thay vì chỉ bị cấm làm việc của người sống: hù nhẹ/âm thanh/giấc mơ, giúp người dù không nhặt đồ, khám phá cõi khuất và nghe hồi hướng. [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md) quy định **dân phát nguyện xuất gia không chỉ vì đạt điểm tâm**, kết hồn ma tái sinh là **ending chứ không phải đổi sang avatar trời**, và manh mối phải **per-character** khi cùng account tạo nhiều nhân vật. **Cần review trước code.**

## 2. Nhiều động cơ, cùng một thế giới

| Phong cách (không bắt chọn persona) | Động lực chính | Một phiên chơi có giá trị khi… | Không được ép |
|---|---|---|---|
| **Explorer** | đi dạo, ngắm cảnh đẹp/lạ, tìm đường mới | phát hiện landmark, lớp cảnh, âm thanh, dấu tích hoặc đường chưa tới | nhận nhiệm vụ, khảo sát tâm hoặc đọc kinh trước khi được đi |
| **Story seeker** | theo dấu ký ức, NPC, kết quả lựa chọn | nghe thêm chuyện, thấy lời hẹn được nhớ, gặp nhân vật biến đổi | hoàn thành toàn bộ thẻ |
| **Learner** | biết tâm sở, cõi giới, loài và kiến thức | nhận một đoạn hiểu biết có nguồn, xem Sổ, dùng kiến thức mở lời thoại | làm quiz mọi lần đi qua |
| **Contemplative** | thư giãn, kinh hành, ngồi yên, ngắm sen | có vài phút bình an, được chủ động dừng và quay lại | tối ưu hóa tâm thiện hoặc thanh định |
| **Casual/Busy** | vào ít phút rồi trở lại | giao việc, quan sát tiến trình, nhận kết quả có thật và dùng được | liên tục online hoặc mở game đúng giờ |

**Không có persona lock:** một nhân vật có thể chơi đủ năm phong cách; UI chỉ gợi ý hành động theo việc họ đang làm.

## 3. Luật "khám phá trước — nhiệm vụ theo yêu cầu"

1. **Khi mới vào game**, cho phép ngay **Đi dạo tự do**; giới thiệu ngắn về nhiệm vụ/khảo sát tâm bằng gợi ý nhẹ. Nếu vẫn có hướng dẫn ban đầu, phải có **Bỏ qua / Để sau**, không bắt hoàn thành mới được di chuyển. Người chơi có thể tự tìm lại phần **Nhiệm vụ** hoặc **Khảo sát tâm** bất kỳ lúc.
2. **Chỉ đi ngang qua** cây, mộ, sư già, tháp, cửa hang, vật lạ: có tín hiệu trong thế giới (âm thanh, ánh đèn, lời thoại thoáng, chấm tương tác nhỏ), **không tự mở popup**, không dừng chân nhân vật, không giật camera.
3. **Tự chọn tương tác** (`explicit_interact`) mới mở hội thoại/khảo sát/mini-game/quest. Nơi quan trọng có thể báo **Có chuyện để nghe**, nhưng không auto-accept. Một cảnh hiếm cũng không được cắt ngang nếu người chơi đang dạo.
4. **Nhiệm vụ nhận rồi mới là active.** Có thể để dở, bỏ qua, quay lại; `available` và `active` khác nhau. Lời hẹn có hậu quả kể chuyện nếu đã chủ động nhận lời.
5. **Sổ khám phá và cảnh đẹp là phần thưởng tự thân.** Không phải mọi nơi đều phải giao một nhiệm vụ. Map ngoài được ngắm phần lớn; chỗ khó chỉ khóa **chiều sâu/cảnh hiếm** và luôn có tiền cảnh để người chơi nhìn thấy.
6. **Gợi ý ngắn theo ngữ cảnh, không spam.** Một nơi chưa vượt được chỉ gợi *một hành động phù hợp* (gặp sư, học kinh, kiếm nguồn sáng). Gợi ý tiếp theo ở sổ khi người chơi chủ động mở.

**Mẫu nhập game:**

> Một đêm yên tĩnh. Bạn có thể đi dạo, nghe chuyện hoặc chọn một việc để làm. Không có gì cần vội.

Hành động: `Bắt đầu đi dạo` (mặc định), `Xem việc có thể làm`, `Tìm hiểu khảo sát tâm`. Nếu không dùng màn chào, hiển thị hint nhỏ một lần; không chiếm toàn màn hình.

**Mẫu cảnh cửa hang:** lửa đèn lay khi tới gần, một `[Quan sát khe đá]` nhỏ hiện bên cạnh. Bấm mới mở lựa chọn `Lắng nghe` / `Đi tiếp`. Khi muốn rời, đi được ngay.

## 4. Tâm và thẻ là cơ chế hỗ trợ câu chuyện, không phải thước đo nghiệp hay chứng đắc

- **Thanh tâm `tin, niem, dinh, si, san…` là các biến số gameplay mô phỏng trạng thái/nghiêng hướng trong câu chuyện**, không phải cách tính Vi Diệu Pháp. Tránh mô tả "Định 80/100 = đã đắc thiền" hoặc "Si 60 = người chơi ngu si".
- Thẻ **tâm sở qua trải nghiệm** ghi nhận *người chơi đã gặp một tình huống minh họa và thực hành nhận diện* trong game, không xác quyết tâm sở thật của người ngoài đời. Mặt thẻ có thể chứa tên Pāli, tính chất/phận sự theo nguồn, nhưng **nhãn nhận được không xác nhận chứng ngộ**.
- Thẻ **kiến thức** nhận qua đọc/nghe kể cả khi nhân vật học trong lúc vắng; ghi rõ **Đã nghe / đã đọc** thay vì **đã tu thành**. Album thẻ tâm và Sổ kiến thức có thể chung ngôn ngữ thẻ, nhưng khác trạng thái và logic thưởng.
- **Bất thiện không phải vật liệu để farm.** Có thể học về Tham, Sân, Si, Phóng dật, Hôn trầm, Hoài nghi qua việc quan sát người/câu chuyện hoặc nhận diện lựa chọn trong mô phỏng. **Không** bắt người chơi cố làm ác để có thẻ hay mở cõi.
- **Không công thức đạo hạnh:** tránh `3 Niệm + 2 Định → cõi trời` hay `10 Bất thiện → xuống ngạ quỷ`. Khi cần chốt điều kiện kỹ thuật, dùng minh chứng cụ thể (**đã nghe một lời dạy, đã tự tập, có người dẫn, có vật dẫn, đang có trạng thái tỉnh táo trong tình huống**) chứ không biến giáo lý thành bảng điểm nghiệp.

### 4.1. Ví dụ "ngưỡng hang sâu" dùng kiến thức/thực hành đúng vai trò

Trường hợp tốt:
- Cổng đá có thể nhìn thấy/đứng trước ngay lần đầu, nhưng gió lùa làm nhân vật ngần ngại.
- Người chơi chủ động xem: `Đã học cách quan sát nỗi sợ` (Sổ kiến thức) hoặc `đã tham gia một buổi kinh hành/ngồi có ghi nhận` (minh chứng game) giúp mở **cách ứng phó mới**. Có đèn / người dẫn / sự kiện cho phép tiếp cận sâu hơn.
- Chưa chuẩn bị: người chơi **vẫn có cảnh đẹp để ngắm**, một dấu vết lưu trong Sổ và đường vòng quay về. Gợi ý "Thử gặp sư già để học cách đối diện sợ hãi".
- Trở lại: được một scene mới để đi và một sự khác biệt trong cảnh, không phải popup tuyên bố **đã đắc định**.

Trường hợp không được dùng:
- `Niệm 80 + Định 70 = Được vào`, **hoặc** `Định thấp ⇒ bạn tu chưa tốt`, **hoặc** tự thưởng thẻ Định chỉ vì nhân vật được giao "ngồi thiền" offline.

### 4.2. Công bằng giữa các lối chơi

- Đường chính cho phép **ít nhất một cách đi tiếp không phụ thuộc vào việc sưu tập toàn bộ thẻ**. Điều kiện sâu có thể có nhiều route: vật dẫn + học hiểu; tự thực hành + người dẫn; làm thiện + lời hẹn. Giữ một số bí mật dành cho người thực sự thích học/tu, nhưng không nhốt toàn bộ cảnh đẹp sau đó.
- Cổng đã mở **không khóa vĩnh viễn** vì mood thay đổi; trạng thái sợ hãi chỉ có thể thay đổi cách tương tác *lúc đó*, với chỗ nghỉ/lùi về an toàn.
- Không dùng `Tín` như cổng chặn người ham đặt câu hỏi; đặt câu hỏi chân thành khác với loại hoài nghi bất thiện trong bối cảnh thực hành.

## 5. Nguyên tắc trình bày nguồn: không giảng đạo liên tục, nhưng không đánh tráo mô phỏng với kinh điển

### 5.1. Bốn phân loại *trong dữ liệu*, ba nhãn *ngắn gọn trong giao diện*

| `loreBasis` | Nội dung | Nhãn hiển thị khuyến nghị | Ví dụ |
|---|---|---|---|
| `canonical` | có kinh/luật được dẫn chính xác, tóm đúng bối cảnh | **Tham chiếu kinh điển** | khái niệm năm triền cái được dẫn nguồn |
| `commentary` | giải thích theo chú giải, Vi Diệu Pháp/Thanh Tịnh Đạo, cần ghi nguồn hệ truyền thống | **Giải thích theo luận/chú giải** | chi tiết đặc tính/phận sự/biểu hiện/nhân gần của tâm sở |
| `game_interpretation` | cơ chế trò chơi **lấy cảm hứng**, không được xem như giáo lý | **Mô phỏng trong game** | thanh Niệm/Định, điều kiện cổng từ thẻ |
| `fiction` | nhân vật, địa điểm, phép nối cõi, câu chuyện sáng tác | **Câu chuyện hư cấu** | Hang Vọng Tâm, Bến Không Tiếng, đường từ bảo tháp tới vườn mây |

Hai loại đầu đều có thể nằm trong trang **Nguồn Phật học**, nhưng giữ rõ kinh và chú giải là khác nguồn. Với `fiction` có thể thêm `inspiredBy` để dẫn kinh chỉ như **cảm hứng**, không như nguồn xác minh chi tiết hư cấu.

**Dữ liệu cơ bản:** `id, title, loreBasis, sourceRefs[], summary, gameRule?, inspiredBy[], reviewerStatus`. Thiếu nguồn thì **không** gắn `canonical`. Mọi câu khẳng định mạnh về nghiệp, tâm tái tục/cõi giới, 13 hạnh đầu đà và chứng đắc cần thầy Theravāda duyệt.

### 5.2. Khi nào nhắc "đây là mô phỏng"?

**Nhắc một lần đầu game**, ngắn và dễ hiểu:

> Đây là một thế giới hư cấu lấy cảm hứng từ Phật học. Các thẻ, thanh tâm và lối vào cõi giới là cơ chế trò chơi. Nội dung tham khảo có ghi nguồn riêng trong Sổ.

Không cần popup ấy ở mọi khu. Thay vào đó:

- Trên thanh/chỉ số tâm: biểu tượng `ⓘ` → **"Chỉ số dùng cho trò chơi, không đo tâm thật."**
- Trên thẻ Niệm/Định: nhãn **"Gặp trong tình huống mô phỏng"**; trên Sổ kiến thức: **"Đã nghe/đọc"**, kèm nguồn.
- Trong Sổ khám phá một cõi: chia hai tiểu mục **"Trong thế giới game"** và **"Trong tài liệu Phật học"**. Ví dụ cổng vào "Bến Không Tiếng" do game sáng tác; cõi ngạ quỷ được mô tả trong các truyền thống Phật học.
- Khi câu chuyện có nguy cơ bị hiểu thành giáo lý (*dùng đèn và tâm định mở cửa sang cõi trời/ngạ quỷ*), chèn **một dòng bối cảnh tại lần đầu tìm hiểu**, không lặp lại trong từng bước.
- Luôn có nút **"Nguồn và ghi chú"** trong Sổ, không đặt disclaimer lên nền cảnh làm mất cảm xúc.

**Văn phong:** gần gũi, không lên lớp, không phán xét người chơi. Tránh "tâm bạn yếu", "bạn chưa đủ thiện", "bạn đã đắc định", "ma xấu cần giải thoát". Ưu tiên "nhân vật còn sợ", "cần biết thêm điều gì đó", "lần này bạn nhận ra…", "vị ấy đang khổ vì nhớ thương".

> **Trường hợp mẫu HG27:** [Bà ngoại ngạ quỷ — giúp, hồi hướng, được an lành](human-world-early-mysteries-and-peta-quest.md). Đây là **cốt truyện gameplay khiến người chơi muốn làm thiện**, không giao một bài học đạo lý. Thẻ tâm mô phỏng được nhận ở **những quyết định/diễn biến có bối cảnh**: **Bi** (nghe nỗi khổ và quyết giúp) → **Không tham** (bố thí để hồi hướng) → **Tùy hỷ** (sau khi hồi hướng, vui vì bà thoát cảnh khổ trong truyện). Giữ cinematic bà tan vào ánh trăng; việc này không được trình bày như chứng Niết-bàn. Một màn tổng kết thẻ sau cảnh kết, không ba popup cắt nhịp.

## 6. Thiết kế học tập gắn với khám phá

**Ba lớp giá trị của mỗi nội dung:**

1. **Cảnh/trải nghiệm:** trước hết người chơi thấy gì và cảm thấy thế nào?
2. **Phát hiện:** người chơi đã thấy mối liên hệ hoặc một câu hỏi nào?
3. **Học thêm (tự chọn):** mở thẻ kiến thức/Sổ loài/nguồn chính xác để hiểu đúng hơn.

Ví dụ xuống Bến Không Tiếng: trước hết thấy căn nhà không có khói bếp, nghe tiếng hũ gạo, quan sát một sinh linh; sau đó nếu chủ động nói chuyện mới thấy câu chuyện về chấp giữ. Sổ có mục "Lòng bỏn xẻn — minh họa trong câu chuyện" và đường dẫn nguồn *Petavatthu* được kiểm duyệt. **Không** vì muốn người chơi học bỏn xẻn mà buộc họ phải chọn hành vi keo kiệt.

**Điều kiện tốt để học sâu:** người chơi có thể **tự nguyện** hỏi sư ở tịnh thất, học kinh lúc vắng, nhận kiến thức và quay lại gặp câu chuyện cũ có lựa chọn mở rộng. Không chặn tuyến chính vì người chơi không học.

## 7. Phần thưởng, tiến triển và trở lại

Kết quả thành công khi người chơi **có thứ được lưu**:

- **Explorer:** tên cảnh/vùng phát hiện, ảnh/kỷ niệm, đường mới hoặc manh mối.
- **Learner:** kiến thức/nguồn lưu trong Sổ, thêm cách hiểu và lời thoại.
- **Practitioner:** nhật ký buổi tự tập, nhận diện chủ động trong tình huống, khả năng thử cách ứng phó mới. Không tích chứng đắc.
- **Casual:** công việc giao khi vắng có progress; khi hoàn thành nhận vật liệu, kiến thức, dấu tích hoặc chuyện mới, lưu một lần, dùng lần sau.
- **Story seeker:** lựa chọn có hậu quả nhân quả hợp lý, NPC nhớ lời hứa, kết quả thay đổi môi trường.

**Tiêu chuẩn:** mỗi vòng chơi dài phải có ít nhất một `visible change`, `persistent record` hoặc `future affordance`. Không bắt quest nào cũng phải rơi thẻ. Không dựng phần thưởng giả kiểu một popup "đã thiền 8 giờ" nhưng không có gì để làm khi quay lại.

## 8. Những rủi ro lớn và phương án

| Rủi ro | Dấu hiệu nhận biết | Phương án |
|---|---|---|
| RPG khoác áo Phật pháp | tu tập chỉ để cộng chỉ số và vượt cổng | ngưỡng theo **bối cảnh + minh chứng + nhiều cách xử lý**, không cộng điểm công đức |
| Quest đứt quãng khám phá | cứ đi gần NPC lại bật `showSheet` | `discoverable` / `interactable` / `active` tách riêng; `explicit_interact` mới popup |
| Dạy giáo lý quá nhiều | tường chữ và quiz bắt buộc | ngắn, đúng ngữ cảnh, tự mở Sổ; 80% cảm giác phát hiện, 20% lựa chọn học sâu là **nguyên tắc thiết kế thử nghiệm**, không phải số liệu nghiên cứu |
| Diễn giải sai | một cơ chế "tâm đủ sáng sinh thiên" | phân loại nguồn rõ, chú thích tinh tế, duyệt giáo lý |
| Cày tâm bất thiện | phải cố tham/sân/si để mở cửa | học qua quan sát truyện, không thưởng hành động có hại |
| Map rộng nhưng rỗng | đi 5 phút không có chi tiết nào đáng nhớ | làm vertical slice 1 khu phong phú trước, có nhánh ngắm, ngõ cụt gợi tò mò và biến thể khi quay lại |
| Một kiểu người chơi bị bỏ rơi | người thích dạo bị bắt làm quest, người bận không có phần thưởng | nghiệm thu theo năm phong cách ở mục 2 |

## 9. Phép thử MVP trước khi mở nhiều cõi

**Làm một phần nhỏ:** nhân gian (tịnh thất) + 5 zone Hang Vọng Tâm + 1 ngưỡng sâu + 1 kết quả học kinh offline. Chưa cần toàn bộ cõi ngạ quỷ hoặc vườn mây.

Kiểm thử với người chơi các phong cách, có và không có nền tảng Phật học:

1. Người mới **đi được tự do trong 5–10 phút mà không bị popup nhiệm vụ ép**, chỉ thấy tín hiệu cảnh.
2. Không muốn học kinh vẫn được ngắm phần lớn map, gặp cảnh, thấy các lối sâu còn bí ẩn.
3. Người muốn xuống sâu gặp thử thách sợ, tự chọn học/kinh hành, quay lại có **chuyển biến cảnh và đường mới**.
4. Người chỉ giao `study` một lượt, quay lại nhận **một mục Sổ kiến thức**; từ đó thêm được lời thoại; không được thẻ Định offline.
5. Người thích truyện có ít nhất một lời hứa được thế giới/NPC nhớ đúng, không chuyển đồ của người đã nhờ cho người khác rồi ghi là hoàn tất.
6. Người hiểu Phật học xem Sổ phân biệt được kinh điển, chú giải, diễn giải game và sáng tác; không hiểu nhầm thẻ/chỉ số tâm là cách tính nghiệp.
7. Người không quan tâm Phật học vẫn muốn trở lại vì một cảnh xa, manh mối hoặc câu chuyện chưa kể.
8. Không nội dung nào dùng "chứng đắc", "siêu thoát" như phần thưởng tự động của thanh hoặc đồng hồ.

**Quy tắc quyết định:** chỉ mở nhiều map, nhân vật và kỹ năng sau khi vòng `khám phá → tò mò → học/tập (tự chọn) → trở lại → thấy thay đổi` vận hành tốt với người chơi thật.

## 10. Cần điều chỉnh trong code sau khi chốt tài liệu (CHƯA THỰC HIỆN)

- `public/mind.js`: `onRoleStart → survey(done)` hiện đang chặn đầu trải nghiệm; chuyển sang giới thiệu mềm, hỏi sau hoặc vào bảng công việc.
- `public/mind.js`: `loop()` tự kích hoạt chuỗi chó cắn, NPC, vùng lân cận; `public/encounters.js` cũng tự gọi popup khi `near()`. Thay bằng `interest signal + explicit interaction` để không ngắt dạo chơi.
- `public/app.js`: mục quest có sẵn, bổ sung bảng "Việc có thể làm" và nhãn `available/accepted/paused/completed`; tutorial/survey có thể mở lại.
- `public/encounters.js` (`caveEnter()`, `stupaVisit()`): hiện chủ yếu tuyến popup; tách thành map zone có đường đi, điều kiện khám phá và lore.
- `public/reflect.js`: biến công việc khi vắng thành kết quả **có thật**, đưa vào Sổ kiến thức/kho vật liệu, chống nhận trùng.
- Tách các nhóm dữ liệu `gameMoodStats`, `observedCards`, `knowledgeBook`, `explorationJournal`, `realmAccess` để UI không đánh đồng mức thành tựu.
- Thêm `loreBasis` + `sourceRefs` cho bản ghi kinh, truyện, loài, giải thích thẻ.

**Chưa merge/cập nhật gameplay trong lượt tài liệu này.**
