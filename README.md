# Một Đêm Đầu Đà

> **Tài liệu định hướng mới:** xem **[docs/README.md](docs/README.md)** để hiểu nhanh game, vai chơi, thế giới, các mạch truyện, hệ thống tâm và trạng thái đã/chưa triển khai. **Agent:** xem [docs/AGENTS.md](docs/AGENTS.md) trước khi thêm/sửa tài liệu. Phần README bên dưới mô tả **prototype legacy đang có trong code**; riêng cách đồng nhất vai chơi với **Sư Tịnh/Ông Tư/Bà Sáu** đã được thay bằng thiết kế **PC tự đặt tên, NPC độc lập**, nhưng code chưa chuyển hết. Các tài liệu thiết kế mới **không đồng nghĩa tính năng đã chạy**.

Prototype web nhiều người chơi: một đêm ở nghĩa địa đầu làng, nhìn qua ba đôi mắt.

- **Nhà sư** (thầy Tịnh): bị xua đuổi lúc khất thực, đêm ngồi giữa nghĩa địa, không nằm. Thang đo: *Tâm an*.
- **Hồn ma** (bà Sáu bán xôi): vất vưởng, đói, vẫn chờ con gái. Thang đo: *Chấp*, càng thấp càng nhẹ.
- **Người dân** (ông Tư đầu xóm): người đã đuổi nhà sư, lén theo ra xem thực hư. Thang đo: *Lòng tin*.

Chơi đủ ba vai sẽ mở đoạn kết thật.

## Cách chơi

Màn hình dọc, nghĩa địa nhìn chéo từ trên xuống. Chạm vào đâu thì nhân vật đi tới đó (hoặc bấm **Đi tới**). Tới đúng địa điểm thì khung truyện kéo lên. Chạm vào cảnh khi đang đọc để thu khung truyện lại.

Địa điểm (`World.PLACES` trong `world.js`): `gate` cổng nghĩa địa, `bamboo` bụi tre, `graves` giữa các ngôi mộ, `gao` gốc cây gạo. Mỗi cảnh trong `story.js` có `place`, cảnh ngồi thiền có `pose: "sit"`.

## Chạy

Cần Node 18 trở lên. Chạy `npm install` một lần để có gói `pg` (dùng cho Postgres).

```bash
npm start          # http://localhost:3000
PORT=8080 npm start
```

Muốn chơi cùng nhau: mở nhiều tab, hoặc cho máy khác trong cùng mạng LAN vào `http://<IP-máy-bạn>:3000`.

## Kiểm thử

```bash
npm test
```

Chạy bằng test runner có sẵn của Node. Các file test nằm trong `test/`.

## Nhiều người chơi hoạt động thế nào

| Thứ | Cách đồng bộ | Lưu lại? |
|---|---|---|
| Ai đang ở nghĩa địa, vai gì | `presence` qua SSE (`/events`) | Không, rời trang là mất |
| Khoảnh khắc: chuông, thở dài, đèn lồng | `moment`, gửi `/api/emit` | Không |
| Dấu vết: thí thực, tụng kinh, thắp nhang… | `trace`, gửi `/api/trace` | Có, trong Postgres khi có `DATABASE_URL`, không thì `data/traces.json` (giữ 500 cái gần nhất) |

Khi có `DATABASE_URL` thì tài khoản, nhân vật và dấu vết nằm trong Postgres. Không có thì chúng nằm trong file ở `data/`, và Render sẽ xóa các file này mỗi lần deploy hoặc khởi động lại.

Việc người khác làm trong 12 giờ gần nhất sẽ thành *flag* và đổi câu chuyện của bạn. Ví dụ:

- Nhà sư đặt cơm thí thực (`offering`), thì hồn ma thấy có vắt cơm trên mộ mình, còn người dân nhận ra mộ bà Sáu.
- Hồn ma thở dài (`sigh`), thì nhà sư nghe tiếng thở dài thật, người dân thấy vệt sáng.
- Nhà sư tụng kinh hồi hướng (`chant`), thì hồn ma có lựa chọn ngồi nghe kinh để buông.

Ngoài các câu có sẵn, người chơi có thể gõ **chat** tự do. Chat chỉ tới những người chơi ở gần trong thế giới (`CHAT_RANGE` trong `server.js`, hiện 260 đơn vị), tối đa 80 ký tự, và không lưu lại ở đâu. Trước khi gửi, server có một bộ lọc nhẹ: chặn link, dãy số dài như số điện thoại, lặp ký tự kiểu spam, và một danh sách từ tục, xúc phạm (`chatRejected` trong `server.js`). Mỗi người chỉ gửi được một tin sau khoảng 1,5 giây. Đây là bộ lọc cơ bản, không phải kiểm duyệt đầy đủ: các từ bị chặn vẫn có thể bị lách.

## Cấu trúc

```
server.js          # static + SSE + API + chat gần
auth.js            # đăng nhập Google, phiên, API tài khoản và nhân vật
store.js           # Postgres (DATABASE_URL) hoặc file JSON trong data/
public/index.html  # khung trang
public/style.css   # giao diện dọc cho điện thoại
public/world.js    # thế giới 2D vẽ bằng canvas: đường, mộ, tre, cây gạo, ánh sáng, sương
public/story.js    # TOÀN BỘ kịch bản: sửa lời văn ở đây
public/audio.js    # âm thanh tạo bằng Web Audio: gió, dế, chuông, tiếng thở dài
public/app.js      # engine truyện + kết nối realtime
data/traces.json   # dấu vết đã lưu
```

### Viết thêm cảnh

Trong `story.js`, mỗi cảnh có dạng:

```js
m4: {
  time: "Canh hai",
  lines: [
    "Câu luôn hiện.",
    { if: "sigh", text: "Chỉ hiện nếu đêm nay có hồn ma thở dài." },
    { unless: "sigh", text: "Hiện khi chưa có." },
  ],
  choices: [
    { label: "…", delta: 1, next: "m5" },
    { label: "…", delta: 0, next: "m5", emit: "chime" },                     // người khác nghe thấy ngay
    { label: "…", delta: 1, next: "m5", trace: { kind: "offering", variant: 0 } }, // để lại dấu vết
  ],
},
```

Thêm loại dấu vết mới thì sửa ở hai chỗ: `TRACE_TEXT` trong `story.js` và `TRACE_KINDS` trong `server.js`.

## Hướng phát triển

- Thêm ngày khất thực (đi từng nhà) và cảnh nhà hoang.
- Phòng riêng theo mã, để một nhóm bạn chơi cùng một đêm.
- Deploy lên Render / Fly / VPS. SSE chạy ổn sau Nginx nếu tắt buffering (`proxy_buffering off`).
- Nhờ một vị thầy duyệt lời văn về hạnh đầu đà.


## Thêm trên branch `experiment/qls-ideas`

- **Nhìn quanh và bản đồ:** kéo màn hình để nhìn chỗ khác, nút *Bản đồ* để chạm xem một vùng. Tầm nhìn khác nhau theo vai (`LOOK_RANGE` trong `app.js`).
- **Vật bị bỏ quên** (`FINDS` trong `story.js`): đốm sáng nhỏ trên đất, chạm để đi tới và mở một thẻ ngắn. Một số mảnh là manh mối về cô bé Hạnh, giữ lại qua các đêm (`localStorage`). Ghép đủ 5 mảnh thì mở thêm đoạn kết.
- **Ký ức qua các đêm:** lựa chọn có `remember: "khóa"` được nhớ lại, và dòng truyện có `ifv` / `unlessv` đọc lại nó ở đêm sau.
- **Buổi sáng khất thực** (nhà sư), **nhà hoang** ở rìa nghĩa địa, ma ngẫu nhiên ban đêm, cú, quạ, chó sủa xa.
- Dấu vết mới giữa người chơi: `keepsake` (món đồ cũ), `lamp` (đèn nhỏ), `bowl`. Thêm loại mới thì sửa `TRACE_TEXT` và `TRACE_KINDS`.

### Chế độ phát triển

Mở `http://localhost:3000/?dev` sẽ có nút **DEV** ở góc dưới trái: ép giờ trong ngày (sáng sớm, chiều tàn, canh ba...), đổi vai, nhảy tới một cảnh bất kỳ, mở khóa hết vai và manh mối, hiện hết vật bị bỏ quên, gọi thử cú, quạ, chó, gà và cảnh nhà hoang. Không có `?dev` thì panel không xuất hiện.

### Tịnh thất và kinh

Gõ cửa tịnh thất (đốm sáng ở sân) rồi bước vào: kệ sách có 6 cuốn (`HERMIT_BOOKS` trong `story.js`): Chuyển Pháp Luân, Vô Ngã Tướng, Tứ Niệm Xứ, Kinh Từ Bi, Kinh Kālāma, Mười Ba Hạnh Đầu Đà. Đọc mỗi cuốn làm lòng lắng xuống một lần mỗi đêm, và game nhớ cuốn nào đã đọc.

Nội dung là **tóm lược theo ý kinh bằng lời của game, không phải bản dịch**, vì các bản dịch hiện đại có bản quyền. **Chưa được vị thầy Theravāda duyệt**, cần duyệt trước khi phát hành rộng.

### Màu tâm

Vòng tròn cạnh tên vai ở góc trên trái thể hiện tâm trạng: đen (sân) → đỏ (tham, chấp) → xám cam (mê mờ) → vàng (tín, hoan hỷ) → trắng như ánh trăng (sáng, thấy rõ). Nhà sư bắt đầu ở màu vàng, hồn ma ở màu đỏ (hồn ma càng buông, màu càng sáng). Lựa chọn xấu làm màu tối đi tạm thời, đọc kinh, đảnh lễ, ngồi quan sát làm màu sáng lên rồi dần trở về mức nền. Người khác thấy màu này như một quầng sáng quanh nhân vật. Ý tưởng mượn từ cách Thanh Tịnh Đạo ví màu máu ở tim của người nặng về tham, sân, si, tín, tuệ. Chưa được thầy Theravāda duyệt.

### Hình ảnh

`public/images/buddha.webp` là hình tượng Đức Phật do người làm game cung cấp (nền trong suốt, đã đổi cỡ 900px). **Cần xác nhận quyền sử dụng hình này trước khi phát hành công khai.** Nếu không dùng được, game tự quay về hình vẽ bằng code trong `public/buddha.js`.

### Khám phá tự do

Bấm *Đi dạo* trong khung truyện, hoặc thu khung truyện rồi chạm xuống đất, để đi tự do. Nút *Nhiệm vụ* cho biết việc đang chờ và đưa nhân vật về đó. Trên *Bản đồ*, chạm một chỗ để chọn rồi *Nhìn sang đó* hoặc *Đi tới đó*. Nhà sư khi tâm xao động sẽ được gợi ý về tịnh thất đọc kinh rồi quay lại.

### Hệ thống tâm (MVP)

Thiết kế đầy đủ ở [docs/he-thong-tam.md](docs/he-thong-tam.md). Bản MVP trong `public/mind.js` gồm:

- **Khảo sát tính cách** lần đầu chơi (quét lá, bông hoa, bát cơm) theo sáu hạng tính của Thanh Tịnh Đạo, rồi random chỉ số ngầm trong khung của nhóm.
- **Chuỗi nhiệm vụ chó cắn** cho nhà sư và người dân: chó cắn ở ngõ làng → giếng làng (bà cụ) → hái rau má ở gốc mít → đem cho bà cụ hoặc nhà ông Tư → ngồi với sư già ở nghĩa địa (quả cầu đầy dần theo chỉ số, có hên xui) → chư thiên ghé thăm.
- **Thẻ tâm sở** rơi sau mỗi bước (Sân, Hối hận, Tham, Không sân, Không tham, Niệm, Hỷ); gặp lại thì mở thêm mặt (đặc tính, phận sự, biểu hiện, nhân gần). Album ở nút **Thẻ**.
- **Bảng chi tiết** khi bấm vòng tâm: 5 nhóm thiện, 3 gốc xấu, gợi ý tu tập.
- **Chư thiên:** cột sáng, hoa mạn-đà-la rơi, xem tâm vị ấy, lưu ảnh khoảnh khắc. Người chơi khác thấy ánh sáng ở chỗ đó. Ngoài chuỗi nhiệm vụ, chư thiên thỉnh thoảng ghé tịnh thất hoặc gốc gạo vào ban đêm khi tâm sáng.
- Dev (`?dev`): mục "Tâm và thẻ" để khảo sát lại, nhảy tới chỗ chó hoặc chỗ sư, gọi chư thiên, xóa dữ liệu tâm.

Mọi chỉ số là mô phỏng để chơi. Nội dung thẻ và cấu trúc tâm của chư thiên cần thầy Theravāda duyệt.

### Tài khoản và nhân vật

- Vào game là **chơi ngay**, không cần đăng nhập. Tiến trình của khách nằm trong trình duyệt (localStorage).
- Khi **đăng nhập bằng Google**, người chơi có thể:
  - lưu lần chơi thử trên máy thành một nhân vật;
  - tạo tối đa 12 nhân vật, mỗi nhân vật một vai và mang tâm, thẻ, vật phẩm, nhật ký riêng;
  - quay lại bất kỳ nhân vật nào để chơi tiếp.
- Ký ức câu chuyện (manh mối, sách đã đọc), số đêm đã qua và các vai đã đi qua đêm là **chung cho cả tài khoản**.
- Nút "Đăng nhập để lưu" nằm trong bảng Nhiệm vụ khi đang chơi thử.

Code: `auth.js` (đăng nhập Google qua OAuth, phiên đăng nhập bằng cookie HttpOnly, API `/api/me`, `/api/account`, `/api/characters`), `store.js` (Postgres khi có `DATABASE_URL`, không thì file JSON trong `data/`), `public/save.js` (lớp lưu phía trình duyệt).

**Cấu hình trên Render** (biến môi trường của web service):

1. **Neon:** tạo project miễn phí tại neon.tech, copy connection string (dạng `postgresql://…?sslmode=require`) vào `DATABASE_URL`. Bảng được tạo tự động khi server khởi động.
2. **Google Cloud Console:** APIs & Services → Credentials → Create OAuth client ID → Web application.
   - Authorized redirect URI: `https://<tên-app>.onrender.com/auth/google/callback`.
   - Đặt `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET`.
   - Màn hình OAuth consent: chọn External, thêm email của bạn làm test user, hoặc publish app.
3. Build command phải là `npm install` (đã có thư viện `pg`). Nếu service tạo từ dashboard với "echo no build step" thì sửa lại.
4. Tùy chọn `PUBLIC_URL=https://<tên-app>.onrender.com` nếu redirect URI tự suy ra bị sai.
5. Health check: `GET /healthz` trả về `ok`, không đụng tới đĩa hay database. Render và các dịch vụ ping uptime dùng endpoint này để kiểm tra server còn chạy.

**Chạy trên máy:** không cần cấu hình gì. Tài khoản lưu vào `data/accounts.json`, và màn chọn vai có nút "Đăng nhập thử" (tắt khi `NODE_ENV=production`).

**Màn "Nhân vật của tôi"** (`public/profile.js`): khi đã đăng nhập, bấm vào tên một nhân vật ở màn chọn vai, hoặc bấm nút "Nhân vật của tôi", sẽ thấy tính cách, chỉ số tâm, thẻ tâm sở, túi đồ và nhật ký của nhân vật đó. Từ đây có thể chơi tiếp hoặc xóa nhân vật. Sau này phần trang phục (quần áo, tóc…) sẽ nằm ở màn này.

### Thêm nơi chốn, loài và nhiệm vụ (`public/encounters.js`, `public/palace.js`)

- **Thọ thần ở gốc gạo** (từ chạng vạng): nhờ tìm bé Na lạc trong bụi tre. Dỗ dành rồi dẫn bé về ngõ làng gặp mẹ, quay lại nhận **chiếc lá gạo sáng**. Thẻ: Bi, Tùy hỷ.
- **Bà ngoại ngạ quỷ ở nghĩa địa** (đêm, nhà sư và người dân): xin bát cơm ở giếng, dâng sư già, hồi hướng; bà sáng dần rồi tan. Thẻ: Bỏn xẻn, Không tham.
- **Địa thần ở cổng làng** (sau khi đã làm một việc thiện, từ chạng vạng, tâm sáng): trao **ngọn đèn nhỏ**.
- **Tảng đá lớn phía đông:** ngồi xuống nghỉ thì phát hiện **hang đá bí mật**. Có đèn thì vào được; nỗi sợ làm đèn tối dần. Cuối hang nhận **mảnh ký ức** về Hạnh.
- **Ao sen** ở đầu làng: ngồi ngắm trăng, hái sen dâng ở tịnh thất. Đôi khi có chư thiên ghé.
- **Tháp cổ trên đồi:** ban đêm, có hoa mạn-đà-la thì vào được **thiên cung**. Nổi giận thì cung tan; cười xòa thì nhận thẻ Tùy hỷ.
- **Xe ngựa của ông lái buôn** chạy dọc đường chính: bắt chuyện để nghe tin đồn, đẩy giúp xe sa lầy (tặng **khăn rằn**), hoặc tặng rau má để đổi **bánh đa mè**. Không mua bán.
- Bảng **Nhiệm vụ** liệt kê mọi việc đang mở và các chuyện lạ, mỗi mục có nút "Đưa tôi tới đó".
- Dev (`?dev`): mục "Chuyện lạ, nơi chốn" để nhảy tới từng nơi, gọi xe ngựa và thêm vật phẩm.

Các câu chuyện chỉ phỏng theo tinh thần Chuyện Thiên Cung và Chuyện Ngạ Quỷ, cần thầy duyệt.

### Thử nghiệm mở rộng vòng ngày và các vai (nhánh tính năng)

Đặc tả đầy đủ: [Kịch bản vòng ngày](docs/kich-ban-vong-ngay.md). Bản tính năng đầu tiên (chưa merge vào nhánh gốc):

- **Vai hồn ma:** không nhận chuỗi tìm/dỗ/dắt bé Na, không đẩy xe ngựa, nhặt hoa hoặc làm những việc thể chất của người sống. Thay bằng cung ngắn **Tiếng guốc trong sương** ở gốc gạo → bụi tre → tường tịnh thất → mộ cũ. Trạng thái lưu theo nhân vật.
- **Vai nhà sư:** nhiệm vụ **Tấm y màu đất** qua 5 ngày chơi: quan sát và nhặt mảnh vải bỏ đi → giặt → nhuộm → may → hoàn thiện; cất kỷ vật có hình minh họa vào túi. **Chưa** có skin thay trực tiếp trên avatar hay mini-game may y chuyên sâu.
- **Ngồi thiền:** thẻ Niệm không còn tự động xuất hiện chỉ vì quả cầu đầy; thẻ Định cần ít nhất 2 buổi có ghi nhận chủ động và một khoảng chú ý ổn định (ngưỡng mô phỏng). Có thêm dữ liệu thẻ Si, Phóng dật, Hôn trầm, Hoài nghi để gắn với tình huống có nhận diện ở những đợt sau; **chưa có storylet cấp các thẻ bất thiện mới**. Định chỉ là thẻ học về sự chú tâm, không phải chứng đắc.
- **Kiểm thử bổ sung:** `test/client-practice-rules.test.js`, `test/client-robe.test.js`. Chạy `npm test` trước khi merge; chưa có kết quả CI được xác nhận từ bản thử nghiệm này.

