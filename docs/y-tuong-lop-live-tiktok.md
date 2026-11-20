# Ý tưởng lớp trình diễn TikTok cho Một Đêm Đầu Đà

Ngày ghi: 2026-11-05. Trạng thái: đề xuất sản phẩm, chưa triển khai. Đọc cùng `he-thong-tam.md` và `review-game-2026-11-05.md`.

## Mục tiêu

Người chơi tham gia qua domain của game. Một trang `/live` riêng để người dẫn đưa vào phần mềm phát TikTok, trình diễn cộng đồng và các hành trình cá nhân. Người chơi có thể tặng quà TikTok để yêu cầu xuất hiện hoặc khoe một chuyện vừa trải qua. Ưu tiên hiện tại vẫn là cải thiện game trước khi xây lớp live.

Giá trị chính: chuyện của người chơi được cộng đồng chứng kiến. Quà mua thời lượng và hình thức trình diễn, không mua tiến độ, thẻ, chỉ số tâm, công đức hoặc cơ hội gặp chư thiên.

## Hai góc nhìn

| Góc nhìn | Trình diễn |
|---|---|
| Toàn cảnh cộng đồng | Vị trí người đang hoạt động trên bản đồ; giờ chung của chương trình chỉ phục vụ trình diễn |
| Ghé hành trình | Theo nhân vật được chọn; ánh sáng, NPC và sự kiện lấy theo đúng trạng thái riêng của người đó |

Ghi rõ khi ghé: “Góc nhìn của Minh · Ngày 3 · Canh hai”. Chuyển sang Lan có thể là “Ngày 1 · Rạng sáng”. Không ép thời gian nhiệm vụ của tất cả người chơi đồng bộ theo live.

Chung không gian không đồng nghĩa chung trạng thái truyện. Vị trí, chào hỏi và dấu vết có thể chia sẻ; NPC và vật nhiệm vụ thuộc hành trình cá nhân. Chỉ trình diễn người đứng gần như người tham gia cùng sự kiện nếu game thật sự xác nhận điều đó. Nhiệm vụ hợp tác tương lai cần phiên chung với trạng thái và thời gian được thống nhất.

## Hai yêu cầu lên sóng

- **Xem tôi:** theo vị trí và hành động hiện tại trong một lượt ngắn.
- **Khoe khoảnh khắc:** dựng lại sự kiện vừa xảy ra, ghi rõ “Khoảnh khắc vừa rồi”.

Không dùng vị trí hiện tại thay cho khoảnh khắc đã qua. Một gói khoảnh khắc nên có: mã sự kiện duy nhất, chủ nhân vật, phiên, thời điểm thật, thời gian truyện, địa điểm, phiên bản nội dung, lựa chọn, kết quả, trạng thái cảnh cần thiết và quyền chia sẻ. Bản đầu có thể là ảnh cảnh và lời dẫn; replay diễn biến cần chuỗi sự kiện, không chỉ snapshot cuối.

## Nhịp phát sóng

Mặc định toàn cảnh; yêu cầu quà vào hàng đợi, mỗi lượt thử nghiệm 15–25 giây. Không ngắt một chuyện giữa chừng, không để một người chiếm nhiều lượt liên tiếp. Người dẫn có nút bỏ qua, dừng và quay về toàn cảnh. Hiện trạng thái yêu cầu rõ ràng; quy định trước cách xử lý khi người chơi rời game hoặc hết thời lượng live.

Xen kẽ khoảnh khắc miễn phí được chọn tự nhiên để live có nội dung khi ít quà và người mới hiểu trải nghiệm. TTS kể ngắn về sự việc và lựa chọn; tránh đọc cảm ơn liên tục. Khung dọc cần kiểm thử với vùng giao diện TikTok thực tế trước khi chốt bố cục.

## Danh tính và quyền chia sẻ

Ghép tài khoản game với định danh TikTok đã xác nhận bằng mã liên kết; không dựa vào tên hiển thị trùng nhau. Việc xác minh danh tính TikTok phải dựa trên khả năng tích hợp thực tế, chưa coi là đã giải quyết. Quà chỉ tạo yêu cầu sau khi xác nhận sự kiện và khử trùng lặp; không tin thông báo do client tự khai.

Người chơi bật/tắt xuất hiện, chọn loại khoảnh khắc được phát. Bảng tâm, lựa chọn riêng và nội dung chat không tự động đưa lên sóng. Lớp live chỉ nhận dữ liệu được phép công khai, không nhận toàn bộ dữ liệu tài khoản.

## Hiện trạng và thử nghiệm đầu tiên

Server hiện có SSE presence và moment. Presence có vị trí, vai, tên, scene, pose, mood nhưng chưa đủ để dựng hành trình riêng; moment chưa phải nhật ký replay. Trong `mind.js` đã có lưu ảnh khoảnh khắc gặp chư thiên trên thiết bị, có thể tận dụng cách bố cục ảnh.

1. Cải thiện lưu/tiếp tục và vòng chơi cốt lõi.
2. Thử một buổi xem nhóm nhỏ, người dẫn chọn thủ công ba loại khoảnh khắc: đoàn tụ, lựa chọn làm lành, khám phá.
3. Đo người xem có hiểu câu chuyện và chờ kết quả không; người chơi có chủ động muốn chia sẻ không.
4. Khi có tín hiệu tốt mới làm `/live`, hàng đợi, quyền chia sẻ và liên kết danh tính; sau đó mới tích hợp quà thật.

Chưa tích hợp TikTok, chưa kiểm chứng hiệu quả kinh doanh và chưa chốt cơ chế quà. Không thay đổi game trong bước lưu ý tưởng này.
