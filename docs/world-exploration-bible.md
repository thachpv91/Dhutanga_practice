# World Exploration Bible — Khám phá các cõi giới trong Dhutanga Practice

> **Trạng thái: Design v0.1 — chưa triển khai map/gameplay.** Viết từ nhu cầu người chơi và kịch bản trước khi vẽ bản đồ. Đây là thiết kế **mô phỏng có tham chiếu Phật học**, không khẳng định đường đi giữa các cõi tồn tại theo địa lý vật lý. Cần giáo thọ Theravāda duyệt thuật ngữ, các truyện dựa kinh, cách thể hiện nghiệp/tâm và giới luật.
>
> Tài liệu liên quan: [he-thong-tam.md](he-thong-tam.md) (mục 4a, 15–18), [kich-ban-vong-ngay.md](kich-ban-vong-ngay.md), [exploration-ux-and-gating.md](exploration-ux-and-gating.md), [map-brief-hang-va-coi-gioi.md](map-brief-hang-va-coi-gioi.md).

> **Nguyên tắc bắt buộc mới (07-11-2026):** đọc [Game Design Principles](game-design-principles.md) trước khi sửa map, quest, thẻ hoặc tài liệu giáo lý. **Game trước — Phật pháp tạo chiều sâu — Người chơi chọn cách trải nghiệm — Mô phỏng minh bạch.** Các khu ngoài phải tự do khám phá, truyện chỉ mở khi người chơi chủ động tương tác. Thẻ tâm và các cổng là logic game, không phải phép tính đạo hạnh hoặc đường đi giữa các cõi như giáo lý. Mọi câu chuyện gắn nguồn `canonical/commentary/game_interpretation/fiction` phù hợp. Xem nguyên tắc 2–5 và 9 của tài liệu chuẩn.

## 1. Tuyên ngôn trải nghiệm

**Người chơi đến vì tò mò, ở lại vì hiểu thêm, trở lại vì thế giới có điều mới chờ họ.** Không bắt buộc hoàn thành nhiệm vụ mới được ngắm cảnh. Việc đi xa hơn tạo nhu cầu tự nhiên học kinh, kinh hành, ngồi thiền, giữ lời hứa, làm điều thiện.

Ba vòng lặp **đồng thời, không ép buộc**:

- **Explorer:** thấy cảnh lạ → đến gần/chọn quan sát → phát hiện dấu tích/câu chuyện → mở Sổ khám phá → nhìn thấy nơi xa hơn → trở lại lúc điều kiện thay đổi.
- **Practitioner:** gặp ngưỡng khó → nhận ra cần chuẩn bị → tự nguyện học/phát triển thực hành → trở lại thử lối khác → hiểu sâu hơn về tình huống. Không tính đây là chứng đắc thực.
- **Caregiver / casual:** vào vài phút → giao việc học kinh, chuẩn bị y/nấu cơm → thoát → quay lại có **kiến thức, vật liệu, manh mối** → dùng cho một chuyến đi hoặc đối thoại mới.

**Mức tự do:** người chơi mới tiếp cận được phần lớn đường đi và các điểm ngắm an toàn trong thế giới đầu tiên; điều kiện nâng cao áp dụng cho **nhánh sâu, cảnh hiếm, tương tác sâu, không phải tất cả cửa vào**. Không phạt vì sợ, hỏi lại, rời đi hay nghỉ lâu. Không sinh cơ chế cố làm điều bất thiện để farm thẻ.

> **Cập nhật hướng khám phá riêng cho PC ma (draft):** [Ghost Campaign Bible](ghost-playable-campaign-bible.md) · [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md). Đồ thị dưới đây mô tả **lối người sống**: PC ma có thể khám phá nhà hoang **như một điểm riêng và điểm nghỉ tùy chọn**, đi tới **Bến Không Tiếng — Bờ Chìm** qua **khe suối rừng tre/khe đá khuất** không cần đèn/cổng của người; Hang Vọng Tâm vẫn có góc khám phá cho ma nhưng không phải lối bắt buộc tới bến. Người sống đến **Bờ Nổi** qua hang; hai tuyến chỉ giao một vài landmark (ba cột đá), không tự chia sẻ manh mối giữa các PC. Hồn ma có thể nghe lời hồi hướng, giúp người gián tiếp và chọn ending tái sinh; cư sĩ có thể tự phát nguyện thử đời sống xuất gia. **Chưa code; các quy tắc cũ nếu áp cho PC ma thì đọc theo bổ sung này.**

## 2. Mô hình thế giới: mạng những nơi có quan hệ, không phải một cầu thang thiện/xấu

```text
                              [Nhân gian: làng / tịnh thất / nghĩa địa / rừng]
                                     |                         |
                            khe đá, dấu gió                bảo tháp cổ
                                     |                         |
                             [HANG VỌNG TÂM]             [NGƯỠNG THIÊN LỘ]
                           /    |     \                        |
                hồ âm vang  hốc trú  ngưỡng sâu             [BIÊN CẢNH TỨ ĐẠI THIÊN VƯƠNG]
                            |                               /       |      \
                     [BẾN KHÔNG TIẾNG]               cửa gió  hồ linh  vườn mây
                      /        |       \                             |
                 xóm hoang  bãi cột  bến đò               [VƯỜN MÂY HOAN HỶ]
                      |                       `--- các lối chừa phát triển sau ---
                [VÙNG NGẠ QUỶ SÂU]
```

**Quan trọng về giáo lý:** sơ đồ trên là **logic chuyển cảnh trong tác phẩm**, không phải bản đồ Phật giáo. Cõi ngạ quỷ (**peta**) thuộc nhóm cảnh giới khổ; cõi Tứ Đại Thiên Vương (**Cātummahārājika**) thuộc cõi trời dục giới theo hệ phân loại Theravāda. Không biến "xuống hang → đi tiếp → Tứ Đại Thiên Vương" thành một chuỗi tầng thật. Tứ Đại Thiên Vương và những loài hộ trì đi cùng có thể xuất hiện ở *biên cảnh* hoặc trong lời kể, **không phải mọi yakkha đều là ngạ quỷ**, cũng không phải cứ quỷ thần là ác. Tham chiếu **DN 20, DN 32**.

**Thuật ngữ trong game:** `physicalZone` là khu có thể đi, `narrativeRealm` là cách phân loại cõi trong lore, `threshold` là ngưỡng chuyển cảnh; không đồng nhất ba thứ.

> **Thiết kế chi tiết Nhân gian:** [Human World Story Bible](human-world-story-bible.md). Hệ thời tiết trong game gồm trời quang, mây, mưa nhẹ, mưa lớn, cảnh báo bão, bão và sau bão. Mỗi trạng thái đổi phong cảnh, NPC, hoạt động khi vắng và storylet; bão là chuỗi sự kiện hiếm có trước/sau, không phải hình phạt nghiệp hoặc màn ép làm nhiệm vụ. Tài liệu chỉ mới là kịch bản, chưa có Weather Engine.

> **Nhân gian trước, cõi giới sau:** viết và kiểm nghiệm [20 kịch bản/móc chuyện nhân gian](human-world-playable-scenarios.md) theo ngữ cảnh và các vai trước khi dựng các bản đồ sâu. Không dùng thời tiết xấu ngẫu nhiên để làm khó người chơi tìm sự bình yên.

> **Cụ thể hóa lối PC hồn ma:** [Ghost Episode Pack 01](ghost-episode-pack-01.md) viết cảnh nhà bỏ trống (một điểm nghỉ tùy chọn), túi kim chỉ, khe suối rừng tre và khe đá dẫn tới Bờ Chìm; [Ghost Episode Pack 02](ghost-episode-pack-02.md) viết chuyện người giữ bến/bà Sáu/nghe hồi hướng/đoạn kết. Hai PC có thể thấy **ba cột đá** từ hai phía nhưng lore/journal mỗi PC lưu riêng. **Nhà hoang, khe suối đi được và Bờ Chìm chưa có map hoàn chỉnh trong code, chỉ là brief cần graybox.** Sổ Hành Trình/hồi tưởng theo từng PC: [Journey Memory](journey-memory-and-return-ux.md). Hù người khiến NPC sợ thật, sư có thể bình tĩnh hơn, thẻ phản ánh động cơ PC: [Ghost Mischief](ghost-mischief-cards-and-shared-dedication.md).

## 3. Từng thế giới phải có lý do tồn tại và người chơi thực sự được làm gì

| Cõi / khu | Trục cảm xúc | Chủ đề hiểu thêm | Khám phá không cần quest | Câu chuyện có chiều sâu | Lối phát triển |
|---|---|---|---|---|---|
| **Nhân gian** (hub) | yên, sống động | giữ lời hứa, bố thí, tu tập căn bản | ao sen, gốc gạo, mùa hoa, rừng, nghĩa địa | Hạnh, bà Sáu, ông Tư, y phấn tảo | tịnh thất có lớp học, rừng mới, tháp và hang |
| **Hang Vọng Tâm** | đẹp nhưng bất an | sợ hãi, chánh niệm và tỉnh giác | cửa hang, cầu đá, mặt nước, vệt ánh sáng | tiếng vọng không hoàn toàn đáng tin; người đi sâu phải nhận ra sợ | hốc bí mật, bến dưới, thư khắc trên đá |
| **Bến Không Tiếng** | trống, xót thương | khổ vì thiếu thốn, tham ái và bỏn xẻn | bến thuyền, nhà trống, vệt chân, giếng cạn | những cuộc đời cũ của các peta, lời nhờ và hồi hướng | xóm hoang, bãi cột, vùng sâu |
| **Biên cảnh Tứ Đại Thiên Vương** | rộng, kỳ ảo, trang nghiêm | hộ trì, giữ giới, đa dạng loài | bốn hướng kiến trúc, vườn bậc cao, tiếng nhạc xa | gandhabba, kumbhaṇḍa, nāga, yakkha theo truyện đã duyệt | bốn lối tương ứng bốn hướng, không cần phô trương các vị vua như boss |
| **Vườn Mây Hoan Hỷ** | tươi sáng, thong dong | duyên của thiện nghiệp, tùy hỷ, không chấp đẹp | hồ sen, mây, cầu vòm, vườn hoa, lầu gió | chuyện việc lành nhỏ từ **Vimānavatthu** | đảo xa, đỉnh mây, thiên cung khác |

**Mỗi zone phải có tối thiểu:** một landmark có thể thấy trước, hai điểm dừng để ngắm (không bắt chuyện), một dấu vết mở lore, một đường vòng/quay lại, một biến thể theo thời gian/tâm/trạng thái truyện, một chỗ dành cho cốt truyện tương lai.

## 4. Tâm sáng / định tĩnh / tín: thiết kế như khả năng đối diện, không như số đo đạo đức

### 4.1. Ba nguồn chứng cứ trong game

1. **Hiểu biết có thật trong tiến trình:** kiến thức đã nghe/học/ôn (Sổ kiến thức: ví dụ năm triền cái, lời dạy về sợ hãi, tâm từ); học offline được quyền nhận **thẻ kiến thức**, không tự nhận thẻ Định hay Niệm.
2. **Minh chứng trải nghiệm chủ động:** những buổi kinh hành/ngồi thiền người chơi đã tham gia, tình huống biết tâm xao động/quay về; các **thẻ Niệm/Định** được hệ thống game ghi nhận đúng điều kiện và dưới nhãn mô phỏng.
3. **Duyên/lời hứa/vật dụng:** ngọn đèn, người dẫn đường, hành động thiện đã thực sự chọn và hoàn tất, một câu chuyện đã nghe, mối quan hệ với dân làng/thọ thần, hoa hoặc vật dẫn theo truyện.

**Sợ hãi** trong game nên là **trạng thái tạm thời của nhân vật** khi gặp biến cố, không quy chụp tính cách người chơi. Nó không xóa vĩnh viễn quyền đã mở; khi sợ quá có điểm nghỉ, nút quay về và gợi ý thích hợp.

**Tín (saddhā)** không đơn giản là một đồng hồ thấp/đủ. Nếu nhân vật thiếu vững tin hoặc hoài nghi trong bối cảnh tu tập, sư có thể gợi ý về nghe pháp, học một đoạn kinh, suy xét lại; **không dùng sự hoài nghi tìm hiểu chân thành như một trừng phạt**.

### 4.2. Những ngưỡng khám phá hợp lý (gợi ý chưa cân bằng)

| Ngưỡng | Người chơi có thể thấy trước? | Điều kiện gợi ý để đi tiếp | Khi chưa đủ |
|---|---|---|---|
| Hang ngoài | **Có**, tự do vào và ngắm cảnh | không cần thẻ | có cảnh, tiếng vang, điểm quan sát |
| Hành lang tiếng vọng | **Có** | đã có nguồn sáng **hoặc** có bạn dẫn / học cách đi trong tối (route thay thế) | quan sát ánh đèn, hỏi nơi lấy đèn; không ép mở quest |
| Cổng sợ hãi / đoạn sâu | **Có**, đứng trước được | một **minh chứng thực hành chủ động** (Niệm hoặc một buổi trở lại sau khi nhận diện sợ) + hướng dẫn phù hợp | cảnh sợ được kể ngắn; gợi ý **theo sư kinh hành/thiền**; quay về không mất gì |
| Bến Không Tiếng | thấy bóng dáng từ xa | giữ sự tỉnh táo trong thử thách cửa sâu + có đèn / vật dẫn hay hướng thay thế | lưu Sổ khám phá "Đã thấy bến đò, chưa đến" |
| Vùng ngạ quỷ sâu | thấy đường nứt/bến đò | đã trải qua 2 **loại học** (ví dụ ghi nhận Niệm + hiểu triền cái), có điều kiện câu chuyện / vật dẫn | được gặp sinh linh và đọc lore ở vùng ngoài; **không cần farm thẻ bất thiện** |
| Ngưỡng tháp | **Có**, lên đồi và ngắm tháp | giờ/duyên phù hợp, biết chuyện về tháp | xem ánh sáng trên gạch, ghi chú |
| Biên cảnh Tứ Đại Thiên Vương | có tiền cảnh ở phía xa | đã hoàn thành việc thiện có ý nghĩa + vật dẫn + câu chuyện tháp + thẻ/điều kiện tâm thiện *trong game*, hoặc nhánh duyên khác tương đương | có tiền đình, chỗ nhìn xuyên mây, lời gợi ý quay lại |
| Vườn Mây Hoan Hỷ | thấy cảnh đẹp qua lan can | đã khám phá biên cảnh, hiểu chuyện một vị thiên và một duyên thiện; không phải "đắc thiền" | ngắm được vườn từ xa; không có màn chơi thất bại |

**Không đếm kiểu "Niệm 3 + Định 2 = qua cửa" như mua chìa.** Nếu cần chỉ số nội bộ để cân bằng, sử dụng *event chứng cứ* và *trạng thái ngắn hạn*, không chuyển thành kết luận giáo lý.

**Cấm vòng lặp xấu:** đi xuống cõi ngạ quỷ có thể **học/nhận thẻ mô tả bất thiện** khi quan sát sự kiện có ngữ cảnh, nhưng không khuyến khích nhân vật chủ ý làm hại hoặc tham lam để tích thẻ. Thẻ bất thiện là **hiểu một hiện tượng**, không phải tài nguyên dùng để mở cửa sâu.

## 5. Mạch truyện: từ tò mò đến thực hành và trở lại

### Mạch A — Tiếng gọi sau vách đá (Hang)

1. Người chơi đi dạo gần tảng đá. Gió đổi chiều; trên mặt đất có hơi sương từ khe nứt. Không popup.
2. Chủ động đến gần xem. Khung tương tác nhỏ: **Quan sát khe đá** / **Đi tiếp**. Người chơi tự chọn.
3. Vào hồ hang, được ngắm cầu đá và một bãi sáng. Nghe lời thì thầm lần đầu, không bị bắt nói chuyện.
4. Tại ngưỡng sâu, bóng mờ đi ngang, ngọn đèn rung. Sợ hãi làm nhân vật lùi lại; vẫn được đứng nhìn và ghi lại bến xa.
5. Một lời gợi ý **"Sư già từng ở lại nghĩa địa giữa đêm. Có lẽ thầy biết cách đối diện nỗi sợ"**. Không tự dịch chuyển hoặc ép làm chuỗi thiền.
6. Người chơi *chọn* gặp sư: kinh hành với thầy, ngồi nhận biết xao lãng, nghe giải thích về sợ hãi. Ghi nhận kiến thức/thực hành.
7. Trở lại ngưỡng; đèn lần này vững hơn. Lối sang Bến Không Tiếng mở; người chơi thấy nơi mới rộng hơn đã tưởng, không chỉ một popup đối thoại.

**Cách kể:** "Bạn có thể thử trở lại khi tâm vững hơn", không phải "Bạn không đủ đạo hạnh/không đủ Tín". Nếu người chơi ít thời gian, có thể giao **học đoạn kinh về sợ hãi khi vắng**, nhận được kiến thức để mở **hướng dẫn và một cách tiếp cận khác**, song các ngưỡng sâu vẫn cần hành động chủ động khi quay lại.

### Mạch B — Sau cổng là một đời sống chưa biết (Ngạ quỷ)

1. Vừa xuống bến, người chơi **được đi dạo, chưa có quest**. Nhìn xóm hoang, bãi đá, sinh linh dưới mái, chiếc thuyền cũ.
2. Tự chọn quan sát một sinh linh. Sổ Loài mở **"Đã nhìn thấy một peta"**; bản tóm ý nói đây là cách kinh miêu tả **một loại chúng sinh** — không lấy một trường hợp suy ra quy luật tuyệt đối cho mọi người.
3. Một cặp câu chuyện đối lập về sự keo tiếc và hành động bố thí (dựa trên **Petavatthu**, chờ biên tập); người chơi có thể rời đi giữa câu chuyện.
4. Một sinh linh nhắc tên nơi ở cũ. Trở về làng, **người còn sống** có thể làm việc thiện và hồi hướng, phù hợp vai; không lấy vật dưới hang để "hối lộ" peta.
5. Khi có thêm kiến thức, các dấu tích ở cùng bến hiện nghĩa khác; mở vùng bên bờ xa. Phần thưởng là hiểu chuyện và cảnh mới, không tăng tài sản siêu nhiên.

### Mạch C — Một việc nhỏ, một khung trời rộng (Bảo tháp)

1. Người mới có thể tới tháp, ngắm rêu và mây, đọc một mẩu chuyện cũ trên đá.
2. Một NPC kể về người từng dâng đèn và giữ lời hứa, không nêu rõ phần thưởng.
3. Khi nhân vật đã có một thiện duyên thực tế, vật dẫn và hiểu biết, **đúng lúc** ánh sáng trong tháp thay đổi.
4. Người chơi chủ động chọn bước vào *ngưỡng thiên lộ*. Cảnh đầu là tiền đình có nhiều lối, không phải phòng thiên cung bật ngay hội thoại.
5. Được thong dong quan sát biên cảnh. Đến khi tự chọn trò chuyện với vị thiên, sẽ nghe một chuyện **Vimānavatthu** được chuyển soạn/ghi chú nguồn; mở lối tới vườn mây hoặc cung khác.
6. Nếu một lựa chọn thiếu thiện tâm làm cuộc gặp khép lại, **nhân vật vẫn ở lại nơi an toàn**, cảnh không sập, không tước quyền đã mở. Lúc sau có dịp làm lành.

### Mạch D — Vào ít phút, trở lại mở lối mới

1. Ở ngưỡng sâu, nhận ra chưa biết rõ về năm triền cái; **giao nhân vật học một đoạn**.
2. Thoát game; khi về thấy đã học xong, mục **Sổ kiến thức** mới và gợi ý nói chuyện với sư.
3. Người chơi gặp sư để **tự thực hành** đi kinh hành vài vòng; có điều kiện mở một cách xử lý sợ hãi.
4. Quay lại hang, vùng sâu mở. Kết quả ngoại tuyến thật sự ảnh hưởng thế giới nhưng không tự tu chứng.

## 6. Bộ sưu tập của người tò mò: khác Album thẻ tâm

- **Sổ khám phá:** nơi đã thấy/đi tới, câu chuyện đang dở, manh mối, cảnh đẹp và biến thể thời điểm. Kế thừa `Discover` và nhật ký hiện tại.
- **Sổ loài & cõi giới:** tên thường/Pāli (nếu xác thực), vùng gặp, đời sống/sự khác nhau, nguồn kinh và **dấu "trong mô phỏng"**. Ví dụ `peta`, `yakkha`, `gandhabba`, `nāga`; không đồng nhất loài và cõi.
- **Sổ kiến thức:** `heard` → `reviewed` → `applied`; có cả bài nhận được khi nhân vật học lúc vắng.
- **Album thẻ tâm:** trải nghiệm chủ động nhận diện tâm sở trong game; không nhận tự động khi offline.

Mỗi nơi có **phần thưởng khám phá tối thiểu** dù không gặp quest: ảnh cảnh/tên cảnh, một dấu vết để suy đoán, một mục Sổ khám phá và một đường dẫn đến nơi khác. Không bắt buộc thu thập toàn bộ để qua cốt truyện.

> **Chuẩn nhân vật mới:** xem [Player-centric Narrative Model](player-character-narrative-model.md). Mọi hành trình cõi giới thuộc PC có tên và progress riêng; Sư Tịnh, Ông Tư, Bà Sáu là NPC trong thế giới, không phải ba nhân vật mà player buộc phải hóa thân. Phân biệt **quy tắc hành động của PC `ghost`** với chuyện ký ức **NPC Bà Sáu**.

## 7. Hệ nhân vật và phép hành động theo vai

- **Nhà sư:** tu học, quán sát, nghe pháp, thực hành trong rừng, phù hợp giới luật; cần kiểm tra trước khi cho thao tác nhặt cây/hoa, tiền, đồ vật.
- **Dân làng:** làm việc thiện, giữ lời, chăm sóc người và đồ vật, hỏi chuyện; có thể tự học/thực hành tùy nhân duyên, không buộc xuất gia.
- **PC hồn ma:** có hành trình và trải nghiệm do người chơi tự khám phá, không mặc định có con Hạnh hoặc nhớ việc bán xôi. **Không dắt người sống, cầm nấu vật dụng, mua bán**. **NPC Bà Sáu (peta)** giữ ký ức riêng về Hạnh và có thể trở thành nhân vật người chơi tìm hiểu hoặc nghe chuyện; không nhầm bà với PC.
- **Các loài phi nhân:** không tự động là quái để đánh hoặc vật để farm. Chúng là **chủ thể có cuộc sống, lựa chọn và duyên nghiệp** trong câu chuyện.

## 8. Ranh giới biên tập Phật học

1. **Phân biệt kinh điển / chú giải / sáng tác:** mỗi truyện gắn `loreBasis = canonical | commentary | game_interpretation | fiction` và danh mục nguồn. Không quảng bá phần sáng tác như lời Phật nguyên văn.
2. **Cõi giới không chỉ là mood:** tâm hiện tại có thể thay đổi *trải nghiệm nhìn/đối diện* trong game, nhưng không khẳng định thay đổi tâm trong vài giây làm nhân vật tái sinh/thành một cõi khác. Việc bước vào cảnh là **ẩn dụ narrative**, không diễn đạt thành định luật nghiệp báo.
3. **Tránh quy chụp:** "đã gặp Sân trong truyện" khác với "người chơi là người sân"; không gắn "sợ" = yếu hay "thiếu Tín" = sai.
4. **Hội thoại hồi hướng:** không bảo đảm mọi peta đều lập tức được siêu thoát; dựa truyện cụ thể, có nhãn "phỏng theo" và để thầy duyệt.
5. **Giới luật:** hạnh đầu đà, nhặt vải, hái rau/hoa, khất thực, nhận vật cần rà soát theo vai.
6. **Không ép hành động bất thiện** để mở thẻ/đường mới; luôn có lựa chọn đứng nhìn, hỏi, quay lại, học để hiểu.

## 9. Hướng mỹ thuật: làm game giống một bức tranh có thể bước vào

Các ảnh tham khảo là **concept art** chứ chưa phải playable map: chúng có ánh sáng, chiều sâu và cảm xúc đẹp, nhưng các số 1–4 khiến đường đi như một minh họa tuyến tính, khung chữ che gần hết thế giới và tỉ lệ hình nhân vật/tần suất chi tiết khác với canvas hiện tại.

**Đề xuất giữ DNA game:** tranh vẽ tay bằng Canvas/SVG/vector, hình nhân nhỏ đơn giản, khối hình đọc được khi zoom xa, màu chắt lọc, texture nhẹ, ánh sáng ấm trên nền đêm lạnh; không thay phong cách sang ảnh chi tiết photoreal/concept fantasy. Hình trong tài liệu chỉ dùng để thống nhất mood, **không dùng trực tiếp làm nền map playable**.

**Khi vẽ:** mỗi khu ở dạng `scene chunk` có lối đi và điểm tương tác thực, phân biệt foreground/midground/background/parallax. Distant scenery tạo cảm giác rộng mà không là đường giả. Cảnh đẹp quan trọng hơn số lượng popup. Giữ một hệ art style/tỉ lệ/độ dày nét/màu làm chuẩn giữa nhân gian, cõi dưới, cõi cao; chỉ đổi sắc độ, ánh sáng, mật độ và nhịp chuyển động.

Chi tiết kỹ thuật và cấu trúc từng khu ở [map-brief-hang-va-coi-gioi.md](map-brief-hang-va-coi-gioi.md).

## 10. Nguồn tham khảo / xác minh

**Kinh điển:**

- MN 4, *Bhayabherava Sutta*: https://suttacentral.net/mn4/en/suddhaso
- AN 9.64, *Nīvaraṇa*: https://dhammatalks.net/suttacentral/sc2016/sc/en/an9.64.html
- DN 20, *Mahāsamaya Sutta*: https://www.dhammatalks.org/suttas/DN/DN20.html
- DN 32, *Āṭānāṭiya*: https://suttacentral.net/dn32/en/sujato
- Khuddaka Nikāya, *Vimānavatthu* tuyển tập: https://suttafriends.org/vimana-vatthu/
- *Petavatthu*, ví dụ truyện 1: https://epitaka.org/en/book/Pv/1-abhijjam%C4%81napetavatthu-1260

**Thiết kế game:**

- *Outer Wilds* (GDC): khám phá do tò mò, truyện phi tuyến, không bắt nhiệm vụ https://www.gdcvault.com/play/1027368/Independent-Games-Summit-Sparking-Curiosity
- *Firewatch* (GDC): khám phá tự do không chiến đấu https://www.gdcvault.com/play/1022108/Level-Design-in-a-Day
- *What Happened Here? Environmental Storytelling* (GDC): môi trường kể chuyện, người chơi tự ghép dấu vết https://www.gdcvault.com/play/1012647/What-Happened-Here-Environmental
- *Onboarding for Games* (Apple): học tương tác, cho phép bỏ qua tutorial https://developer.apple.com/app-store/onboarding-for-games/

## 11. Status / chưa triển khai

- **Đã có trong game:** bản đồ nhân gian, địa danh hang/tháp, các popup khám phá đơn lẻ, `Mind` stats/thẻ, `Discover` và hoạt động vắng narrative.
- **Chưa có:** thế giới nhiều map có thể đi, ngưỡng nhiều điều kiện, UX không popup theo chế độ khám phá, Sổ loài dạng đầy đủ, Sổ kiến thức nhận thưởng offline, các vùng dưới/cõi cao. Tất cả chỉ là định hướng, không được ghi là tính năng đã hoạt động.
