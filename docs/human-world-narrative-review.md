# Narrative Review — Nhân gian v0.3 · PC riêng, NPC riêng

> **Review thiết kế, chưa sửa code.** Nguồn chuẩn: [Player-centric Narrative Model](player-character-narrative-model.md), [Game Design Principles](game-design-principles.md). Kịch bản đã chỉnh theo chuẩn mới trong [Human World Playable Scenarios](human-world-playable-scenarios.md) và [Episode Pack 01](human-world-episode-pack-01.md).
>
> **Quyết định thay thế v0.2:** Role `monk/villager/ghost` là **vai do PC chọn**, không phải Sư Tịnh/Ông Tư/Bà Sáu. Review cũ nói `villager = ông Tư` chỉ mô tả **lỗi thiết kế legacy code**, tuyệt đối không áp dụng cho kịch bản tiếp theo.

## 1. Kết luận review

**Giữ ba tuyến truyện có sẵn như truyện NPC**, không vứt chất liệu cũ, nhưng người chơi phải có tên, quá khứ và lựa chọn riêng. Lời thoại nên gần gũi, ngắn, bớt giải thích. Nhân gian cần trở nên sống động qua cảnh, NPC có lịch sinh hoạt và hậu quả nhỏ khi quay lại; **không cần thêm hàng chục nhiệm vụ bắt buộc**.

| Hiện trạng trên `develop` | Vấn đề | Quyết định cho kịch bản mới |
|---|---|---|
| `app.js` đã lấy tên PC từ `Save.character().name` khi tạo nhân vật | Picker vẫn hiện `ROLE_INFO.who` và tiểu sử một trong ba người có sẵn | Giữ tên PC; role card là phong cách sống/chơi, không phải chọn người nổi tiếng trong truyện |
| `story.js`: `ROLE_INFO.who = Thầy Tịnh / Ông Tư / Bà Sáu` | Người chơi đóng vai NPC cố định | Chuyển ba người thành `npc.su_tinh / npc.ong_tu / npc.ba_sau` |
| `story-nights.js` | Các chương đêm hai/ba tiếp tục quá khứ ba NPC | Lưu làm NPC arcs/hồi tưởng, viết đoạn PC gặp hoặc nghe/quan sát |
| `chapters.js` + `progress.js` | Chương/scene phụ thuộc role và checkpoint cũ | Cần migration/version, không thay ID đột ngột |
| `mind.js` chó cắn → rau má → mang sang Ông Tư | Cùng `villager` đã được code hiểu là ông Tư, gây tự gặp mình; còn lời hứa rau | Với PC dân mới, Ông Tư là NPC; phải trả rau đúng bà rồi mới mở nhánh khác |
| `save.js`: `dhutanga.memory/runs/completed` cấp account | Ký ức chung có thể biến thành ký ức của nhiều PC | Tách event cá nhân khỏi codex meta; migrate từng loại với test |
| Truyện hiện tại khá dài/giải thích nhiều | Mất nhịp dạo chơi, người trẻ dễ bỏ qua | Giọng tươi, câu ngắn, điều muốn học sâu nằm trong Sổ |

## 2. Ma trận chuyển các nhân vật legacy thành NPC

| Truyện/chi tiết | Cốt lõi nên giữ | PC tương tác với truyện như thế nào |
|---|---|---|
| Sư Tịnh đi khất thực bảy nhà | sự kiên nhẫn, bị hiểu lầm, con chó vàng | PC sư hỏi hoặc đi cùng khi phù hợp; PC dân có thể quan sát/giúp; PC không tự đã bị đuổi |
| Ông Tư và con Vàng | người dân cộc nhưng có khả năng thay đổi | PC gặp ông và con chó ở ngõ, có thể nói chuyện/hỗ trợ/lặng lẽ đi |
| Món nợ ba bát xôi | một việc cũ còn giữ trong lòng | PC tìm manh mối, nghe chuyện ông Tư, tùy chọn giúp người sống làm điều thiện |
| Bà Sáu–Hạnh–nước lớn | bí ẩn nhiều góc nhìn, lòng thương và ký ức | PC gặp bà hoặc dấu tích, ghép manh mối; PC ma không thành bà Sáu |
| Kết ba đôi mắt, reveal Hạnh | sự thật chỉ mở khi ghép đủ các mảnh | người chơi tìm hiểu NPC theo nhiều điểm nhìn, không ép chơi đủ ba role trong cùng tài khoản |
| Tuyến y phấn tảo | hoạt động và câu chuyện của nhà sư có thể tiếp tục | **PC sư** thực hành với hướng dẫn của Sư Tịnh/sư già; không gán y đã có trong truyện NPC cho PC |
| Cảnh đêm trăng/mưa phùn | bầu không khí | sự kiện môi trường/đối thoại theo vai PC, không tự thêm tiểu sử NPC |

**Lưu ý:** không sửa đơn thuần `Thầy Tịnh` → `{playerName}`; nhiều đoạn chứa vợ, con, năm tháng cũ, lời nợ, đã xin lỗi, đã ngồi ở nghĩa địa. Đó là **tiểu sử NPC**, cần chuyển thành **hears_story / player_observes / npc_flashback**. Hồi tưởng không cộng thanh tâm và thẻ PC như thể PC thực hiện hành động.

## 3. Tiêu chuẩn kịch bản (9 điểm)

1. **Người sở hữu câu chuyện:** `ownerNpcId` hoặc `environment`; không dùng role để làm ID NPC.
2. **Góc nhìn:** PC gặp/chứng kiến/tham gia, nghe kể hay xem hồi tưởng; người kể không lẫn.
3. **Vai hợp lệ:** sư/dân/ma có hành động và xưng hô phù hợp; không tự nhặt vải, hái hoa cho ma hoặc sư tự bứt cây sống.
4. **Tín hiệu ambient:** thấy/nghe được từ xa mà không bật popup.
5. **Tương tác chủ động:** `explicit_interact` mới mở hội thoại; có nút `Đi tiếp`.
6. **Lựa chọn có ý nghĩa:** thay đổi lời thoại, vật thể, quan hệ, ký ức, manh mối hoặc đường mới; không biến tất cả thành bài quiz.
7. **Kết quả tức thì:** được nghe, thấy, ghi vào Sổ hoặc thay đổi hình; quest không cần luôn rơi thẻ.
8. **Kết quả khi quay lại:** NPC nhớ, cảnh biến đổi, chống nhận lại reward; nếu không chọn thì NPC vẫn có lịch sinh hoạt riêng.
9. **Giọng/nguồn:** thoại tự nhiên 1–3 lượt, không giáo điều; `canonical|commentary|game_interpretation|fiction`, lời kinh có nguồn, lời tự viết không mạo nhận trích kinh.

## 4. Nhịp sống có sẵn ở 11 địa điểm — thiết kế không cần quest

| Giờ | Làng, giếng, gốc mít | Ao, bụi tre, cổng nghĩa địa | Tịnh thất, gốc gạo, nghĩa địa, tháp |
|---|---|---|---|
| Sớm | Ông Tư nhóm bếp, bà cụ kéo nước; PC mới có thể chỉ đi ngang | sen mở, chim hót, sương trên tre | Sư Tịnh quét sân, kệ sách yên, bóng gạo ngắn |
| Trưa | chị Ba phơi đồ, bé Na vẽ **nếu đã về nhà** | chuồn chuồn, cá khẽ nổi | y đang phơi nếu đúng tiến trình của **PC sư** |
| Chiều | ông Tư sửa hàng rào, con Vàng nằm dưới hiên | nắng xiên, tiếng bánh xe nhỏ | tiếng chuông, Sư Tịnh gặp khách, tháp chuyển sắc |
| Chạng vạng | đèn ngõ, người về sau buổi làm | đom đóm, gió qua tre | gốc gạo xa, nghĩa địa đổi bóng |
| Đêm trăng | hiên sáng, tiếng dế | bóng trăng trên ao, tre chuyển động | bà Sáu có thể hiện ở gốc gạo khi story đã mở; sư già ngồi ở tịnh thất |

**Không ép một NPC ở nhiều nơi cùng lúc**. Cảnh thời tiết đẹp (nắng dịu, trăng, sương) là trải nghiệm chủ đạo; mưa nhẹ đôi khi thêm biến thể, **bão chỉ chương truyện tự chọn**. Để tiết kiệm asset, có thể đổi pose/ánh sáng/âm thanh trước khi lập AI schedule thật.

## 5. Kiến trúc kết quả và hồi tưởng

- `ambient`: ánh sáng, tiếng dế, lá rơi, vị trí NPC theo thời gian, không cần lưu từng giọt mưa.
- `personal`: PC đã gặp Sư Tịnh/Ông Tư/Bà Sáu, biết điều gì, nhận lời gì, thẻ tâm trải nghiệm nào; **per-character**.
- `npcStory`: ông Tư đã treo đèn/đã biết chuyện cũ, bà Sáu đã kể ký ức nào; có thể được phản ánh trong timeline của từng character cho MVP, về sau có sync chung nếu chốt luật.
- `worldEffect`: đèn sáng, sân sạch, gáo đã sửa, lối hiện; theo timeline có nguồn `sourceEpisode`, tránh tự chuyển effect giữa các save.
- `accountMeta`: người chơi đã *xem* một truyện như tư liệu, không mặc định nhân vật thứ hai đã gặp NPC ấy.

**Ví dụ Giếng làng:** lần đầu PC thấy bà cụ và gáo lỏng; PC dân sửa → lần sau bà cảm ơn và gáo đúng chỗ; PC không sửa → một NPC khác có thể giúp và bà kể về việc ấy. Nếu PC nhận lời rau má → chỉ hoàn thành khi trả đúng bà, không được chuyển nguyên đồ đã hứa sang Ông Tư. Nếu vai ma, chỉ quan sát, không múc nước.

**Ví dụ Gốc gạo:** trước khi biết chuyện, chỉ có bóng cây đẹp. Sau khi có `metBaSau`, bà có một lời thoại ngắn. Khi tìm ra mảnh chuyện Hạnh, bà mới kể sâu hơn. Người chơi ma không tự hồi tưởng tuổi thơ của Hạnh.

## 6. Quy tắc văn phong: đời thường, nhẹ, có khoảng trống

- Câu kể ngắn, một ý một lượt; không giải thích từ `Niệm`, `Định`, `Vô thường` ngay khi nhìn thấy lá.
- Nhân vật cũ giữ tiếng nói riêng: Ông Tư hơi cộc, duyên; Sư Tịnh bình thản mà không thuyết pháp liên tục; bà Sáu giàu cảm xúc nhưng không kể lể mọi cảnh.
- Người chơi được quyết định sự tò mò; gợi ý `Nghe thêm`, `Hỏi thầy`, `Để sau` thay cho màn đọc bắt buộc.
- Không cố nhồi slang Gen Z. Tính trẻ trung đến từ nhịp nhanh, sự thân thiện và các lựa chọn có tính đời sống.
- Phật pháp: xuất hiện qua hành động rồi mới có thể học trong Sổ. Mô phỏng và giáo lý được phân loại rõ.

## 7. Việc ưu tiên trước code

**P0 (docs):** chốt PC/NPC, viết lại Episode Pack 01, cập nhật HG03/HG05/HG18 và catalog, thống nhất các file world/day/game rules. **Chưa code**.

**P1 (PR kỹ thuật riêng):** chuẩn role picker; thêm `StoryContext`, `npcId` và các cảnh PC mới tới làng; giữ legacy scene dưới dạng hồi tưởng; phải có migration/compat để không mất thẻ/vật phẩm.

**P2 (content prototype):** HG21 ngọn đèn, HG22 quét sân, HG23 gặp Ông Tư và Vàng, HG25 sửa gáo, HG26 nghe chuông; test không popup.

**P3 (narrative depth):** HG24 gốc gạo theo 3 buổi, HG03 học kinh offline và HG18 bà Sáu, liên kết kiến thức và khám phá.

**P4 (map/cõi giới):** chỉ khi Nhân gian có vòng đi dạo → tò mò → lựa chọn → thay đổi khi trở lại.

## 8. Acceptance checklist

- [ ] Tên PC bất kỳ không bị thay bởi tên NPC trong picker/câu thoại/nhật ký.
- [ ] PC `villager` gặp Ông Tư như một NPC khác; con Vàng thuộc Ông Tư.
- [ ] PC `monk` gặp Sư Tịnh; không tự có tiểu sử thầy từng bị xua đuổi.
- [ ] PC `ghost` gặp hoặc biết chuyện bà Sáu, không tự có con gái Hạnh.
- [ ] Hồi tưởng NPC không tự nhận thẻ tâm hoặc sửa ký ức riêng của PC.
- [ ] Lịch/nhánh NPC trong game không va chạm vai, nơi, giờ hoặc thời tiết.
- [ ] Có thể đi dạo 5–10 phút mà không bị popup và chưa nhận quest.
- [ ] Cảnh bình yên, lời thoại ngắn và không bão ngẫu nhiên.
- [ ] Trả đồ cho đúng người đã nhận lời; NPC nhớ kết quả.
- [ ] Guest, account nhiều nhân vật, save cũ và đổi tên đều không mất tiến trình sau migration khi code.
