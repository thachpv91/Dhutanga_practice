# Kết nối người chơi: thiết kế và checklist

> **Status:** Implemented (giai đoạn 1–3 trên `develop`) · **Scope:** multiplayer / UX · **Owner doc:** [game-design-principles.md](game-design-principles.md) · **Related:** [Journey Memory](journey-memory-and-return-ux.md), [Ghost Mischief](ghost-mischief-cards-and-shared-dedication.md) · **Code status:** có test; phần SQL Postgres chưa chạy thử trên cơ sở dữ liệu thật · **Last reviewed:** 2026-11-09

Mục tiêu: chạm vào người, địa điểm, đồ vật trên bản đồ để xem thông tin. Người chơi có thể giữ kết nối với nhau (kiểu danh bạ Messenger, nhưng nhẹ), thấy người quen đang chơi hay không, và đi tới chỗ họ. Chưa có chat riêng.

## Quyết định đã chốt
- Người chơi thử (guest, chưa đăng nhập): xem được hồ sơ công khai, KHÔNG giữ kết nối được, KHÔNG được ghi vào "Từng gặp" của ai.
- Liên kết theo NHÂN VẬT (không theo tài khoản). Hiện đúng nhân vật đang chơi.
- Ba mức, một danh sách, mỗi dòng có nhãn:
  - **Từng gặp**: tự ghi, riêng của mình, không thấy online.
  - **Đã lưu**: mình bấm "Giữ kết nối". Bên kia nhận một dòng thông báo nhẹ.
  - **Quen**: cả hai cùng bấm. Thấy "đang chơi / chơi lần cuối …" của nhau và có nút "Đi tới chỗ bạn".
- Trạng thái online: chỉ "đang chơi" hoặc "chơi lần cuối …", không hiện vị trí. Mặc định chỉ hiện cho "Quen". Có công tắc "Ẩn trạng thái của tôi".
- Hồ sơ công khai gồm: tên, vai, ngày bắt đầu chơi, thiên hướng (carita), màu tâm lúc này, tư thế, vài vật phẩm / việc thiện đã làm. KHÔNG công khai: chỉ số tâm, nhật ký, thẻ chưa lộ. Có công tắc ẩn hồ sơ.
- Thông báo "có người giữ kết nối" chỉ hiện bằng một chấm nhỏ cạnh tên nhân vật trong danh sách nhân vật của Hồ sơ. Không đẩy thông báo ngoài app, không chuỗi ngày chơi.
- Xóa nhân vật thì kết nối của nó mất; bên kia thấy "Người này đã rời đi" rồi dòng biến mất.
- Hiển thị: Hồ sơ nhân vật có mục "Người quen" (đủ thao tác). Màn chat có hai thẻ: "Quanh đây" (chat gần như cũ) và "Người quen" (danh sách + trạng thái + "Đi tới chỗ bạn"). Trên bản đồ, người quen đang online ở gần có chấm vàng nhỏ cạnh tên.
- "Gặp" = cùng cảnh, cách nhau dưới khoảng 150 đơn vị thế giới, cộng dồn khoảng 20 giây, hoặc chạm xem thông tin người đó. Mỗi người một dòng, cập nhật lần gặp cuối. Giữ tối đa khoảng 50 người, xóa cũ nhất.
- An toàn: chặn và báo cáo tính theo TÀI KHOẢN chủ (người dùng không thấy điều này). Cấm hai nhân vật cùng một chủ kết nối với nhau. Máy khác chỉ nhận mã công khai ngẫu nhiên của nhân vật, không phải ID cơ sở dữ liệu.

## Ràng buộc kỹ thuật cần nhớ
- Client là JS thuần trong `public/`, không bundler. Máy chủ `server.js` + `auth.js` + `store.js`. Store có hai bản: Postgres và file JSON (`data/accounts.json`). Mọi thay đổi dữ liệu phải làm cho CẢ HAI.
- Danh sách người online nằm trong bộ nhớ (`peers` trong `server.js`); `sid` đổi mỗi lần kết nối nên không dùng làm danh tính.
- Chạm bản đồ hiện gọi `onWorldTap` trong `app.js` (đi tới điểm chạm). `world.js` đã phân biệt chạm và kéo.
- Giọng văn tiếng Việt gần gũi, mind/temperament nói "Người này". Không dùng "lạc" chung chung (xem mục Từ ngữ nếu có).
- Test: `node --test` (thư mục `test/`). Thêm test cho logic thuần mới.
- Không sửa `data/accounts.json`.

## Checklist

### Giai đoạn 1: thẻ thông tin khi chạm (chỉ client)
- [x] `world.js`: hàm dò chạm trúng gì, ưu tiên người > NPC > địa điểm > đồ vật > đất. Vùng chạm rộng hơn hình vẽ (tối thiểu ~28px màn hình).
- [x] `world.js`: export hàm `pick(wx, wy)` trả về `{kind, id, ...}` hoặc null; không đổi hành vi kéo/pinch.
- [x] `app.js`: khi chạm trúng thứ có thông tin thì mở thẻ; chạm đất thì đi như cũ. Thẻ có nút "Đi tới" (đi lại gần) và "Đóng".
- [x] Thẻ người chơi khác: tên, vai, tư thế, màu tâm + nhãn (dùng `moodLabel`), chưa hiện hồ sơ.
- [x] Thẻ địa điểm / đồ vật / NPC: tên + mô tả ngắn từ dữ liệu có sẵn (`PLACES`, `disc`, hint của gặp gỡ). Không lộ thứ người chơi chưa khám phá.
- [x] Thẻ hợp màn hình điện thoại 375px, không che HUD, đóng bằng chạm ngoài.
- [x] Test logic `pick` (hàm thuần nếu tách được).

### Giai đoạn 2: danh tính, hồ sơ công khai, Từng gặp
- [x] `store.js` (cả hai bản): bảng/mục `encounters`, `blocks`, `reports`; cột `characters.last_seen_at`, `characters.public_handle` (mã ngẫu nhiên), cờ `hide_profile`, `hide_status`.
- [x] `server.js`: presence nhận thêm `characterId` (đã xác thực qua phiên), gửi cho client `handle` công khai thay vì ID thật. Guest không có handle.
- [x] `GET /api/public/:handle`: hồ sơ công khai theo danh sách đã chốt; tôn trọng `hide_profile`; 404 nếu bị chặn hai chiều.
- [x] Ghi "Từng gặp" phía máy chủ theo luật gặp (khoảng cách + thời gian cộng dồn), giới hạn ~50, bỏ qua guest và hai nhân vật cùng chủ.
- [x] Client: thẻ người chơi mở hồ sơ công khai (nhân vật đăng nhập), guest chỉ thấy thông tin nhanh.
- [x] Hồ sơ: mục "Người quen" (phần Từng gặp), công tắc ẩn hồ sơ và ẩn trạng thái.
- [x] Chặn và báo cáo (máy chủ ánh xạ sang tài khoản chủ).
- [x] Test: luật gặp, giới hạn 50, chặn, cùng chủ bị từ chối, hồ sơ ẩn.

### Giai đoạn 3: Giữ kết nối, Quen, online, dấu bản đồ
- [x] `store.js` (cả hai bản): `connections` một dòng mỗi hướng; xóa nhân vật thì xóa kết nối.
- [x] API: giữ kết nối, bỏ kết nối, danh sách người quen kèm mức và trạng thái; từ chối khi guest, khi chặn, khi cùng chủ.
- [x] Trạng thái online theo nhân vật: cập nhật `last_seen_at`, "đang chơi" khi có kết nối SSE của nhân vật đó; tôn trọng `hide_status`; chỉ trả cho mức "Quen".
- [x] Chấm nhỏ "có tin mới" cạnh nhân vật trong danh sách nhân vật của Hồ sơ.
- [x] Hồ sơ: đủ ba mức, nút Giữ / Bỏ kết nối, Chặn, Báo cáo.
- [x] Màn chat: hai thẻ "Quanh đây" và "Người quen"; thẻ Người quen có trạng thái và "Đi tới chỗ bạn" (chỉ khi cùng thế giới đang online).
- [x] Bản đồ: chấm vàng nhỏ cạnh tên người quen đang online ở gần.
- [x] Test: lên mức Quen khi cả hai bấm, xuống khi một bên bỏ, xóa nhân vật, ẩn trạng thái.

### Rà soát cuối
- [ ] `node --test` qua hết.
- [ ] Thử tay trên khung 375px: chạm trúng từng loại, thẻ không che HUD, chat hai thẻ, dấu bản đồ.
- [ ] Hai trình duyệt đăng nhập hai tài khoản: gặp, giữ kết nối hai bên, thấy online, chặn.
- [ ] Không thấy chỉ số / nhật ký của người khác trong bất kỳ phản hồi API công khai nào.

## Điều chỉnh theo thiết kế mới (09-11-2026, chưa code)
- **Nhân vật đã khép** (ma kết thúc kiếp, `story_completed`: truyện read-only nhưng vẫn **đi dạo được ở nơi đã khám phá**, chỉ phía xã hội đóng; trạng thái và phần ép phía máy chủ nằm ở một PR riêng, chưa có cảnh kết thúc và chưa có giao diện cho chính nhân vật đã khép): không presence, không hiện online, không ghi "Từng gặp" mới, không giữ kết nối mới. Máy chủ từ chối, không chỉ ẩn giao diện. Hồ sơ cũ vẫn đọc lại được.
- **Hồ sơ công khai** giữ như hiện tại (quyết định 09-11-2026, chủ project): tên, vai, ngày tạo, thiên hướng, tối đa 6 vật phẩm, có công tắc ẩn. Thêm trường mới chỉ khi đã rà spoiler.
- **Hù và nghe hồi hướng giữa người chơi thật** cần cờ đồng ý riêng, mặc định tắt, đặt cạnh các cờ ẩn hồ sơ / ẩn trạng thái; có chặn và báo cáo như hiện nay. NPC luôn là phương án mặc định.
- Chỉ khi vai ma và sự kiện hồi hướng được code mới đưa vào bảng "Thứ tự MVP" của [Ghost Campaign](ghost-playable-campaign-bible.md).
- **Kiểm tra Postgres thật:** có `test/pg-smoke.test.js` (chạy khi đặt `TEST_DATABASE_URL`, hướng dẫn Docker trong đầu file). Chưa chạy trên Neon.
- **Quy mô máy chủ:** quyết định 09-11-2026: không dùng Colyseus, giữ Node + SSE + REST; tiến trình cá nhân do client báo, máy chủ chỉ kiểm vừa phải (đúng chủ, danh mục sự kiện cho phép, chống lặp, giới hạn tần suất, đồng ý cho tương tác xã hội). Chỉ mở lại khi có cảnh dùng chung thời gian thực hoặc hàng trăm người cùng lúc.
