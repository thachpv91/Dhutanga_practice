# Exploration UX & Gating — Đi dạo tự do, chuyện do người chơi chọn

> **Design-only, chưa code.** Nguồn chuẩn: [Game Design Principles](game-design-principles.md), [World Exploration Bible](world-exploration-bible.md). Áp dụng cho `public/mind.js`, `public/encounters.js`, `public/app.js` và các map mới.

> **Cập nhật PC-centric 08-11-2026:** [Player-centric Narrative Model](player-character-narrative-model.md) là nguồn chuẩn: người chơi **đặt tên nhân vật** và chọn vai sư/dân/ma, **không hóa thân mặc định thành Sư Tịnh/Ông Tư/Bà Sáu**. Marker NPC phải có `npcId` riêng, hội thoại theo `StoryContext(player, npc, perspective)`; không dùng `roleId` làm chủ sở hữu tiểu sử/ký ức NPC. Lời mở cảnh và nhãn tương tác ngắn, tự nhiên, luôn có `Đi tiếp`. Chưa triển khai trong code.

## 1. Vấn đề hiện tại (xác nhận từ code)

- `Mind.onRoleStart()` gọi `survey(done)` ngay nếu chưa có `carita`: khảo sát đầu game chặn việc đi dạo tự do.
- `Mind.loop()` kích hoạt `bite()`, `atWell()`, `atMit()`, `deliver()`, `atMonk()` khi `near()`; các module `Mind.register().loop()` trong `encounters.js` cũng dùng khoảng cách để bật nội dung.
- `caveEnter()` và `stupaVisit()` đang là popup tuyến tính, không phải map có thể đi, chưa có nhiều cổng và nhánh khám phá.

**Phải sửa trước khi dựng nhiều map:** đi gần không đồng nghĩa đồng ý nhận nhiệm vụ.

## 2. Luồng người chơi mới

1. Chọn nhân vật → vào cảnh ngay, hiển thị một hint nhẹ: `Đi dạo`, `Xem việc có thể làm`, `Tìm hiểu khảo sát tâm`. Không cho khảo sát bắt buộc chiếm màn.
2. Ngay khi đi dạo, thế giới có dấu hiệu: ánh sáng, tiếng động, lời gọi xa, NPC, vật thể. Chỉ khi người chơi chủ động nhấn `Tương tác` mới mở sheet.
3. Địa điểm chưa đủ điều kiện vẫn có **phần ngoài đẹp để ngắm** và dấu sổ khám phá; ngưỡng sâu có hint "có thể học thêm" thay vì popup thất bại.
4. Sau vài phút, gợi ý khám phá **một** nhiệm vụ ngắn ở nơi gần nhất, không tự chấp nhận nhiệm vụ.
5. Khảo sát tâm có thể thực hiện hoặc bỏ qua sau đó; trạng thái khởi đầu dùng mặc định trung tính nếu chưa khảo sát (logic cân bằng cần test).

## 3. Các cấp tương tác

| Cấp | Trigger | UI/hành vi | Có dừng nhân vật? |
|---|---|---|---|
| `ambient` | xuất hiện/đi ngang | tiếng chim, ánh đèn, câu thoại thoáng, animation | không |
| `discoverable` | vào tầm quan sát | một chấm/biểu tượng nhỏ, cập nhật Sổ khi quan sát | không |
| `interactable` | người chơi bấm vật/NPC hoặc phím tương tác | sheet hội thoại/câu chuyện ngắn | chỉ lúc người chơi muốn |
| `quest_available` | gặp NPC/địa điểm có nhiệm vụ | nhãn nhỏ "Có chuyện muốn kể"; lưu trong bảng Việc có thể làm | không |
| `quest_active` | người chơi chủ động nhận lời | marker/nhật ký tiến trình có thể mở lại | không, trừ tương tác mini-game đã chọn |
| `threshold` | chủ động quan sát ngưỡng/cổng | hint điều kiện, tùy chọn chuẩn bị/quay lại/vào | chỉ khi mở sheet bằng tay |

**Nguyên tắc ngắt quãng:** không auto-showSheet trong `loop()` dựa riêng trên proximity; ngoài trường hợp tình huống an toàn hoặc sự kiện được người chơi chọn tham gia trước đó. Một sự kiện khẩn cấp trong truyện (như chó chạy ra) có thể kể bằng ambient animation và mở tương tác sau, không tạo sự cố bắt buộc cho người chỉ đi ngắm.

## 4. Gating theo bối cảnh, đa lối thay vì cộng điểm

```js
// Pseudocode design-only, không phải API thực tế
gate = {
  id: "cave.deep_threshold",
  visibleFrom: "cave.overlook",
  previewOpen: true, // được tới, đứng ngắm và ghi sổ
  enterWhen: {
    anyOf: [
      { allOf: ["practice:noticed_fear", "item:light_source"] },
      { allOf: ["practice:walking_with_monk", "story:guide_knows_path"] },
      { allOf: ["knowledge:fear_in_wilderness", "event:active_calm_response", "item:light_source"] }
    ]
  },
  onNotReady: {
    showHintOnExplicitInteraction: "Sư già thường đi trong đêm. Có thể hỏi thầy cách đối diện nỗi sợ.",
    keepDiscovered: true,
    allowReturnRoute: true
  },
  onceOpened: "persist", // không khóa vĩnh viễn khi một mood value giảm
  loreBasis: "game_interpretation"
};
```

**Chú ý:** thẻ Niệm, Định là thẻ học trong mô phỏng; không kết luận người chơi thật đã đạt định. Có thể dùng sự kiện `practice:noticed_fear`, `practice:walking_with_monk` thay cho việc kiểm tra "thẻ Định 80". Nếu cần thẻ vì phong cách game, dùng `cardExperience:niem` như một **dấu đã luyện trong trò chơi**, không như điểm đạo hạnh.

Vào sâu cõi dưới để gặp tình huống minh họa bất thiện; không bắt người chơi tạo nghiệp bất thiện để farm thẻ. Đến cõi cao qua những sự kiện việc lành, hiểu biết, lời hứa và vật dẫn đúng truyện; không dùng công thức "cộng đủ tâm là sinh thiên".

## 5. Gợi ý khi người chơi chậm tiến triển

**Gợi ý là cơ hội, không phải chê trách hoặc bắt học.**

- Gặp nỗi sợ ở cổng: "Ở nghĩa địa, một vị sư già thường đi kinh hành khi trời tối. Có lẽ thầy biết cách đi tiếp."
- Trong buổi ngồi xao động: "Bạn có thể thử kinh hành vài bước, hoặc hỏi thầy về những điều làm tâm khó yên."
- Muốn học mà ít thời gian: "Giao việc đọc một đoạn kinh. Lần sau quay lại sẽ có một mục kiến thức mới."
- Chưa hiểu chuyện ngạ quỷ: "Tịnh thất có một đoạn truyện về bố thí và hồi hướng; đọc để hiểu thêm."

**Tín (saddhā)** không phải công cụ trừng phạt người ham đặt câu hỏi. Có thể ghi sự thiếu vững tin trong bối cảnh nhân vật, không định nghĩa mọi thắc mắc là bất thiện.

## 6. Bốn nhóm kết quả khác nhau

- `discovery`: nơi nhìn thấy, môi trường thay đổi, manh mối, khung cảnh, đường đã mở.
- `knowledge`: bài đã nghe/đọc/ôn, nội dung có nguồn; nhận được khi vắng.
- `observedCard`: tâm sở đã nhận diện trong **tình huống chủ động**; không đồng nghĩa chứng đắc.
- `inventory/story`: vật dụng, lời hứa, quan hệ, ký ức, nhiệm vụ phụ.

Kết quả chỉ lưu một lần per id, không thưởng gacha, không buộc học kinh để có thành quả từ đi dạo.

## 7. Mô phỏng minh bạch, không cắt ngang

- Lần đầu: một lời giới thiệu ngắn **"Đây là thế giới hư cấu lấy cảm hứng từ Phật học; thanh tâm/thẻ/cổng là cơ chế trò chơi."** Có thể xem lại trong Sổ.
- Trong Sổ: bốn `loreBasis` là `canonical`, `commentary`, `game_interpretation`, `fiction`. Hiện nhãn như **Tham chiếu kinh điển / Giải thích theo luận / Mô phỏng trong game / Câu chuyện hư cấu**.
- Đối với cổng và thanh tâm: giải thích rất ngắn trong tooltip/source detail, không phủ disclaimer lên cảnh đẹp.

## 8. Checklist acceptance / test theo 5 nhóm người chơi

- [ ] Vào nhân vật mới, không khảo sát vẫn đi dạo và đến hang/tháp ngoài được.
- [ ] Đi ngang 10 NPC/place khác nhau không tự mở sheet, camera không bị cướp.
- [ ] Bấm tương tác mở nội dung tương ứng; hủy và quay lại được.
- [ ] Nhận nhiệm vụ là hành động chủ động, có tiến trình `available→active→completed`.
- [ ] Người thích phong cảnh đi 5–10 phút có ít nhất 2 điểm nhìn, 1 dấu sổ và 1 lối sâu đáng tò mò.
- [ ] Chưa đủ điều kiện: ngưỡng vẫn thấy được, có đường về và gợi ý phù hợp; không hiển thị điểm "thiếu đạo hạnh".
- [ ] Thực hành/nghe kinh mở nhánh sau, không yêu cầu đắc thiền hoặc đầy thanh.
- [ ] Đi xuống gặp thẻ bất thiện bằng quan sát, không phải làm ác; đi lên không đồng nghĩa tái sinh.
- [ ] Offline học tạo kiến thức lưu một lần, không thẻ thực hành tự sinh.
- [ ] Người có nền tảng Phật học có thể phân biệt được nguồn kinh, luận, mô phỏng game và sáng tác.
