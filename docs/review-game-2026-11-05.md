# Review Một Đêm Đầu Đà — 2026-11-05

## Phạm vi và kết luận

Review mã nguồn local tại `Dhutanga_practice`, README và `docs/he-thong-tam.md`. Không sửa gameplay, không chạy thao tác trên tài khoản thật, không triển khai production. Chưa chơi kiểm thử giao diện trình duyệt trong đợt này; nhận định về độ vui, khó và giữ chân là giả thuyết cần người chơi kiểm chứng. Lần đọc URL Render trước không tải được, không kết luận deployment hỏng từ đó.

Game có bản sắc: ba góc nhìn cùng một đêm, dấu vết người trước ảnh hưởng truyện người sau, khám phá chậm và học qua tình huống. Hiện có thêm tài khoản, nhiều nhân vật, thẻ, vật phẩm, phòng và các chuỗi gặp gỡ. Việc quan trọng nhất là làm những hệ này thành một hành trình đáng tin và dễ hiểu, trước khi thêm nhiều bản đồ hoặc thương mại hóa live.

## Những gì đã có và nên giữ

- Ba vai cho phép nhìn lại cùng chuyện từ phía người khác; đây là lý do chơi lại có ý nghĩa.
- SSE presence và dấu vết lưu lại giúp thế giới có người mà không bắt người chơi cùng online.
- Có nút về nhiệm vụ, tự đi tới nơi và sổ khám phá; không phải xây lại hệ chỉ đường từ đầu.
- Có chuỗi bé Na, ngạ quỷ, vật phẩm làm manh mối, thẻ có bối cảnh và mở thêm mặt khi gặp lại.
- Có âm thanh theo ngày/đêm, canvas thế giới và ảnh khoảnh khắc chư thiên.
- Đã có lưu theo tài khoản/nhân vật và phương án Postgres; không nên đánh giá như prototype chỉ có localStorage.

## Phát hiện cần ưu tiên

### P1 — Mở lại nhân vật chưa tiếp tục đúng đoạn truyện

`public/app.js:515` mở nhân vật rồi gọi `startRole`; `startRole` đặt lại scene về `STORY[role].start`, meter, vị trí spawn và các biến trong đêm. `public/save.js` chỉ ánh xạ mind/history vào dữ liệu nhân vật. Vì vậy thẻ và nhánh phụ có thể còn trong khi truyện chính bắt đầu lại. Đây là hành vi xác nhận từ code, chưa phải kết quả thao tác trình duyệt.

Đề xuất lưu checkpoint có phiên bản: role, sceneId, meter, biến phiên, vật đã xem, vị trí hợp lệ và ID lượt chơi. Phân biệt “Tiếp tục” với “Bắt đầu đêm mới”; có fallback khi phiên bản nội dung thay đổi. Kiểm tra bằng tải lại trang giữa truyện và đăng nhập lại trên thiết bị khác.

### P1 — Lưu lỗi không giữ trạng thái cần thử lại

`public/save.js:64–65`: push đặt timer về null trước request và chỉ console.warn khi thất bại. `flush` chỉ xử lý timer còn chờ. Chỉnh sửa trong bộ nhớ có thể chưa lên server sau lỗi mạng; đóng trang sau đó có nguy cơ mất phần vừa chơi. Chưa kiểm thử mất mạng thực tế.

Đề xuất giữ dirty flag/revision đến khi server xác nhận, có bản nháp local theo tài khoản và nhân vật, thử lại khi online, hiện “Đang lưu / Đã lưu / Chưa đồng bộ”. Tránh phản hồi cũ ghi đè bản mới và xác định cách xử lý nhiều tab.

### P1 — Kết thúc truyện đang ghi tiến độ bên trong hàm render

`public/app.js:906`, `renderEnding` tăng runs, ghi history và để trace mỗi lần được gọi. `openScene` gọi lại render; chưa có chốt ghi nhận kết thúc theo lượt. Nguy cơ: vào lại cảnh kết thúc tính thêm một đêm dù không hoàn thành lượt mới. Cần tái hiện đường thao tác cụ thể trên trình duyệt trước khi kết luận tần suất xảy ra.

Đề xuất tách completeRun khỏi render, ghi nhận một lần theo runId. Render chỉ đọc trạng thái. Kiểm thử mở lại cảnh cuối không tăng runs hoặc nhân đôi dấu vết.

### P2 — Thế giới đông người sẽ phát quá nhiều bản tin

`sendPresence` giới hạn gửi di chuyển khoảng 350 ms; `handlePresence` broadcast toàn bộ danh sách peers cho mọi kết nối mỗi request. Với N người liên tục di chuyển, số dữ liệu nhân vật truyền có thể tăng theo bậc ba nếu kích thước bản tin tăng tuyến tính và phát ngay mọi lần cập nhật. Chưa benchmark; không đưa ra con số sức chứa.

Đề xuất gom cập nhật theo nhịp cố định, gửi delta theo vùng/phòng, nội suy ở client, giới hạn tần suất phía server và xử lý kết nối chậm. Peers đang nằm trong bộ nhớ process nên nhiều instance cần cơ chế chia sẻ hoặc phân phòng rõ ràng.

### P2 — Thời gian riêng và tác động cộng đồng chưa có hợp đồng rõ

Giờ truyện lấy từ scene của mỗi người. `flags()` gom dấu vết trong 12 giờ thật; moment phát toàn cục. Hai người đứng cạnh nhau có thể khác thời gian và tiến độ. Điều này phù hợp truyện bất đồng bộ nhưng cần phân biệt “chuyện đang xảy ra”, “dấu vết người trước” và sự kiện cùng tham gia.

Đề xuất gắn phạm vi, tác giả và thời điểm cho sự kiện; chỉ âm thanh/sự kiện gần người mới phát trực tiếp khi phù hợp. Nhiệm vụ phối hợp dùng phiên chung. Không ép đồng bộ toàn thế giới chỉ để làm live.

### P2 — Tài liệu trạng thái không còn phản ánh đầy đủ code

README nói chỉ chọn câu có sẵn, nhưng đã có chat tự do; mô tả dự án không phụ thuộc gói ngoài trong khi package có pg. `he-thong-tam.md` ghi bản thiết kế chưa code nhưng nhiều hệ đã được triển khai một phần. Cần bảng “đã có / một phần / đề xuất” theo tính năng, không đổi toàn bộ thiết kế thành “đã hoàn thành”.

`store.js` có fallback file; `render.yaml` cấu hình Postgres qua DATABASE_URL. Không đọc .env nên chưa xác nhận production dùng kiểu lưu nào. Dấu vết ở `server.js` vẫn ghi file riêng; cần quyết định chúng có được phép mất sau restart/deploy hay chuyển sang DB.

## Cải thiện trải nghiệm và phát triển nội dung

### 1. Ba phút đầu có một chuyện trọn vẹn

Thử luồng “gặp một người → làm một lựa chọn → thấy hậu quả → nhận một gợi mở”. Tận dụng nút nhiệm vụ và dẫn đường hiện có. Đánh giá việc khảo sát tính khí xuất hiện ngay đầu ở `Mind.onRoleStart` có làm chậm trải nghiệm không; thử dời phần giải thích sâu đến sau tình huống đầu. Không mặc định người mới muốn đọc hệ thống tâm.

### 2. Hậu quả đáng nhớ thay cho lựa chọn đúng quá rõ

Chuỗi bé Na đã khác phản ứng khi quát và dỗ. Phát triển tiếp bằng ký ức quan hệ: NPC nhớ cách mình đối xử, lời thoại đổi ở lần sau, người chơi nhìn thấy hậu quả trước khi đọc tên thẻ. Thêm lựa chọn có đánh đổi về thời gian hoặc thông tin nhưng vẫn có kết thú vị; tránh chỉ cần chọn câu “hiền” để nhận phần thưởng.

### 3. Hoàn thiện một vòng ngày nhỏ trước

Mục 16 đã có thiết kế vòng ngày 15–20 phút. Chưa cần làm đủ năm buổi cho ba vai. Sau khi sửa checkpoint, thử một vai với ba chặng: việc thường ngày, một chuyện tình cờ, quán xét cuối ngày. Kết thúc bằng chuyện đã khép và một câu hẹn cho lần sau; không dùng phạt vắng hay điểm danh.

### 4. Cộng đồng qua việc giúp nhau có kết quả nhìn thấy

Ưu tiên dấu vết có tác giả và tác động cụ thể: ai để đèn, ai giúp tìm bé, ai chuẩn bị chỗ ngồi. Cho người nhận gửi một lời cảm ơn nhẹ. Người chơi có thể góp vào một công việc chung tự nguyện; phần thưởng là cảnh/đối thoại và kết quả chung, không bảng xếp hạng tu tập. Kiểm tra trước thiết kế khi người còn lại offline.

### 5. Khám phá có gợi ý, không thành chờ may mắn

Nâng sổ khám phá sẵn có bằng lời đồn về nơi, giờ và điều kiện; ghi rõ cần quay lại vào buổi nào. Dùng lịch sử sự kiện để giảm lặp và có nội dung thay thế khi chưa gặp điều hiếm. Không khóa truyện chính sau xác suất gặp hiếm.

### 6. Nhật ký kể lại chuyện của chính mình

Hiện history chủ yếu là câu log nhận thẻ/vật phẩm và xong đêm. Đổi thành các mẩu “đã gặp ai, chọn gì, chuyện đổi ra sao”; giữ lời người chơi dễ hiểu. Tạo thiệp khoảnh khắc tùy chọn từ những chuyện thường ngày, không chỉ chư thiên. Đây cũng là nền dữ liệu cho live sau này.

### 7. Giảm ngợp và tránh cảm giác chấm điểm con người

HUD đã có bản đồ, dấu vết, tâm, nhiệm vụ, thẻ, chat. Cần chơi thử màn hình nhỏ để quyết định nút nào mở dần; chưa kết luận chồng lấn khi chưa xem UI. Các chỉ số tâm và màu công khai dễ bị đọc thành tốt/xấu của người chơi; giữ lời nhắc mô phỏng, cho phép ẩn, không dùng bảng tâm làm thành tích so sánh. Nội dung giáo lý theo chính tài liệu cần được thầy duyệt; review này không xác nhận tính đúng của giáo lý.

## Thứ tự thực hiện đề xuất

| Giai đoạn | Việc | Dấu hiệu hoàn thành |
|---|---|---|
| A | Checkpoint, lưu lỗi, kết thúc đúng một lần, cập nhật trạng thái tài liệu | Reload/đổi thiết bị tiếp tục được; mất mạng không âm thầm mất tiến độ; mở lại kết thúc không tăng lượt |
| B | Trải nghiệm ba phút đầu, hậu quả một chuỗi nhiệm vụ, nhật ký | Người mới biết mình đang làm gì và kể lại được chuyện vừa trải qua |
| C | Một vòng ngày cho một vai, một tương tác giúp nhau | Có điểm nghỉ tự nhiên và lý do tự nguyện quay lại |
| D | Chạy nhóm nhỏ, đo hiệu năng SSE và sửa theo quan sát | Không kẹt nhiệm vụ; biết đoạn nào người chơi bỏ và giới hạn tải thực tế |
| E | Thử chương trình live chọn khoảnh khắc thủ công | Người xem hiểu chuyện, người chơi chủ động muốn chia sẻ |

Thử 5–10 người trong vài ngày như đề xuất sẵn ở tài liệu: quan sát thời gian tới lựa chọn đầu, nơi bỏ cuộc, có tiếp tục sau khi nghỉ không, câu chuyện nhớ nhất và nhu cầu chơi cùng. Chưa có dữ liệu để khẳng định retention, định giá hay tiềm năng doanh thu.

## Kiểm tra đã làm

- Kiểm tra cú pháp Node cho app.js, mind.js, save.js, server.js và store.js: đạt.
- Nạp dữ liệu story.js bằng Node VM với window global tương đương trình duyệt: nhà sư 16 cảnh, hồn ma 6, người dân 6; không có choice.next trỏ tới scene không tồn tại. Đây là số cảnh của STORY chính, không gồm chuỗi phụ.
- Chưa kiểm thử hành vi trình duyệt, OAuth, mất mạng, Postgres, mobile và tải nhiều người. Không có test script sẵn trong package.json.

Ý tưởng live được lưu riêng ở `y-tuong-lop-live-tiktok.md`. Bước tiếp theo được đề xuất là giai đoạn A; chưa thực hiện sửa code trong review này.
