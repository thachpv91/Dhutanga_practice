# Map Brief — Hang Vọng Tâm, Cõi Dưới, Tháp Cổ, Vườn Mây

> **Story-first design · chỉ là tài liệu, chưa vẽ map hoặc triển khai gameplay.** Luôn theo [Game Design Principles](game-design-principles.md), [World Exploration Bible](world-exploration-bible.md), [Exploration UX & Gating](exploration-ux-and-gating.md). Concept art dọc mà nhóm đang xem dùng để tham khảo cảm giác, **không áp dụng như bản đồ có bốn checkpoint bắt buộc**.

> **Cập nhật identity (08-11-2026):** [Player-centric Narrative Model](player-character-narrative-model.md). Map mở theo kiến thức/việc làm của **PC tự đặt tên**, không mở bằng cách chơi xong quá khứ Sư Tịnh/Ông Tư/Bà Sáu như bản ngã của PC. Các nhân vật có tên là NPC có thể dẫn chuyện, cho lời khuyên, hoặc xuất hiện qua manh mối; lời thoại ngắn, trải nghiệm nhìn/nghe ưu tiên hơn popup.

## 1. Map được phép tồn tại khi có gì?

Mỗi map tối thiểu có **một hub**, **ba hướng/nhánh nhìn thấy**, **một đường vòng về**, **hai điểm thưởng ngoạn không nhiệm vụ**, **một dấu tích cho Sổ khám phá**, **một biến thể khi quay lại** và **ít nhất một cửa đi sâu có tiền cảnh quan sát trước**. Phải có chỗ giữ cho các câu chuyện/nhánh mở rộng sau này. Không biến map thành màn truyện bấm nút tuyến tính.

| Vùng | Vai trò chính | Cảnh được ngắm ngay | Điều kiện mở **chiều sâu**, không chặn đi dạo |
|---|---|---|---|
| Hang Vọng Tâm | cảm giác bất an, nhận diện sợ hãi | cửa hang, hồ, đài ngắm, hốc trú, vách ký hiệu | nguồn sáng + minh chứng thực hành/đã học + lựa chọn bình tĩnh ở ngưỡng; nhiều đường thay thế |
| Bến Không Tiếng | gặp cảnh giới ngạ quỷ qua câu chuyện | bến đò, xóm hoang, bãi cột đá, giếng cạn | dấu vết truyện + hiểu biết về tâm bất thiện; không bắt cố tạo tâm bất thiện |
| Bảo tháp | gợi mở duyên thiện | tháp rêu, ban công, sân đồi và ánh mây | vật dẫn + sự kiện việc lành + thông tin về tháp; không đòi điểm công đức |
| Biên cảnh Tứ Đại Thiên Vương | gặp loài phi nhân đa dạng, hiểu sự hộ trì | tiền đình, bốn hướng cảnh, sảnh đón | truyện/duyên gắn với nơi đang đứng; không gọi mọi yakkha là ngạ quỷ |
| Vườn Mây Hoan Hỷ | thưởng ngoạn vẻ đẹp, hiểu tùy hỷ/thiện duyên | hồ sen, đình hoa, tháp gió, cầu mây | tiếp cận sâu một NPC/truyện cần mối duyên, còn đa số cảnh được ngắm |

## 2. Đồ thị không gian đề xuất

```text
                       NHÂN GIAN
                     /           \
           Cửa Hang Vọng Tâm     Bảo Tháp
             /       \              |
         Hồ tĩnh     Vách khắc     Ngưỡng mây
          |   \       /              |
       Đài ngắm -- Hốc trú      Tiền đình bốn hướng
          \        /             /        \
           Ngưỡng sâu           Sân gặp gỡ — Ban công
             /     \                 |
         Lối vòng  Bến Không Tiếng   Vườn Mây Hoan Hỷ
                    /   |   \        /      |       \
                Xóm hoang Cột đá Bến đò  Hồ sen Đình hoa Tháp gió
                    \   |   /                      |
                    Vùng sâu               Đảo mây chưa tới
```

Sơ đồ là **liên kết scene trong game**, không phải bản đồ địa lý/tái sinh của Phật giáo. Map trong từng vùng cần chia `scene chunks` và điểm kết nối thực có thể di chuyển.

## 3. Kịch bản khám phá mẫu

**Hang:** người chơi tò mò thấy gió chui ra từ tảng đá → tự chọn xem → vào cảnh hồ/cầu đá rồi có thể ngắm mà không bị popup → thấy cửa sâu khiến nhân vật sợ → chủ động hỏi Sư Tịnh hoặc sư già (NPC) để học kinh hành/ngồi thiền, hoặc giao học một đoạn về sợ hãi khi vắng → quay lại đối diện cửa với một cách ứng phó mới → mở Bến Không Tiếng. Khi chưa đủ điều kiện vẫn được xem tiền cảnh, có lối vòng quay về.

**Cõi dưới:** người chơi nhìn thấy thuyền cũ và nhà không khói bếp → tự khám phá hũ gạo không đáy → chủ động nghe chuyện một peta về lòng bỏn xẻn (lấy cảm hứng từ `Petavatthu`, cần biên tập và dẫn nguồn) → Sổ loài và Sổ kiến thức có thông tin riêng → có thể về làng làm điều thiện/hồi hướng phù hợp truyện. Không phải bắt người chơi làm ác để nhận thẻ Bỏn xẻn.

**Tháp/Vườn Mây:** người chơi luôn được lên đồi ngắm tháp → việc thiện, lời hẹn, vật dẫn và câu chuyện về tháp có thể mở cửa trong → đi vào **tiền đình rộng với nhiều hướng**, không bật popup thiên cung ngay → thấy các loài được kể trong DN 20/DN 32 qua những cảnh đã duyệt → tự do ngắm vườn mây, khi muốn mới chọn gặp vị thiên để nghe chuyện lấy cảm hứng từ `Vimānavatthu`. Mood thay đổi không khiến toàn map sụp hoặc khóa vĩnh viễn.

## 4. Móc khám phá, thay cho chấm 1–4 trong ảnh

| Vùng | Dấu hiệu kéo người chơi tới | Mở gì khi tương tác | Sau khi quay lại |
|---|---|---|---|
| Hồ hang | đốm sáng dưới mặt nước | dấu vết/mẩu ký ức | ánh sáng hiện khác khi biết chữ trên vách |
| Hốc trú | tàn tro cạnh chỗ ngồi | chuyện người từng trú rừng | nghe thêm một đoạn nếu từng gặp sư |
| Ngưỡng sâu | ngọn đèn nghiêng trong gió | cảnh sợ hãi, gợi ý kinh hành | lối sâu mở, không cần popup cũ |
| Xóm hoang | tiếng gạo rơi từ hũ vỡ | chuyện keo tiếc | NPC hoặc đồ vật đổi sau lời hẹn ở làng |
| Bãi cột đá | bóng dáng xa chỉ hiện theo thời điểm | Sổ loài/Sổ khám phá | nhìn thấy lối phía sau cột |
| Bảo tháp | rêu phát sáng khi đêm xuống | lore người từng dâng đèn | mở bậc thềm mây |
| Vườn hoa | tiếng cười và cánh hoa rơi chậm | chuyện người làm vườn | mọc thêm hoa/đường vào đình |

## 5. Art direction bám game hiện tại

Không dùng trực tiếp tranh tham khảo có chữ lớn/chấm mốc vì chúng là **concept art**, không phải bản đồ playable. Giữ DNA hiện tại: **Canvas/SVG vẽ tay, nhân vật nhỏ và dễ thương, nét giản dị, màu tiết chế, cảnh mơ màng; ánh đèn ấm làm trọng tâm trên nền sâu lạnh**. Đừng biến map thành tranh photoreal hay cảnh kinh dị nặng. Tạo không gian bằng lớp đi được → vật cùng tầng → foreground → cảnh xa/parallax; tỉ lệ sprite, độ dày nét và ánh sáng thống nhất. Chỉ thay độ tối/sáng, mật độ đá, mây, cây, kiến trúc theo cõi.

Chưa đặt UI hội thoại khổng lồ lên một cảnh ngắm. **Đi ngang không mở popup; bấm xem mới hiện câu chuyện**. Người thích dạo phải có 5–10 phút chỉ ngắm, đi, phát hiện mà không bị giao nhiệm vụ. Mỗi zone cần `id, connections, walkableAreas, landmarks, ambientVariants, discoveryRewards, storySlots, futureSlots, loreBasis`.

## 6. Vertical slice và nghiệm thu

**Thứ tự làm:** (1) Hang H0/Hồ/Hốc/Cổng và đường vòng; (2) xử lý di chuyển/chuyển chunk, camera và Sổ khám phá; (3) một thử thách sợ → gặp sư → quay lại; (4) mở Bến Không Tiếng ngoài; (5) một câu chuyện peta có nguồn; (6) mở đồi tháp và tiền đình mây; (7) mới vẽ và viết nhiều map hơn.

**Nghiệm thu:** di chuyển tự do; ít nhất 2 đường vòng; cảnh xa có thể nhìn trước khi tới; đủ phần thưởng khám phá không cần quest; cổng không chặn toàn map; kiến thức/thực hành mở lựa chọn chứ không là điểm nghiệp; role hồn ma không làm việc vật lý; thẻ không chứng nhận tu chứng; mọi lore phân loại `canonical/commentary/game_interpretation/fiction`.
