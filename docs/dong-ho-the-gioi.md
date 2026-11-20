# Đồng hồ thế giới — ngày và đêm liền nhau cho từng nhân vật v0.1

> **Status:** Proposed (chờ chủ project duyệt)
> **Scope:** world / UX / narrative pacing
> **Owner doc:** [kich-ban-vong-ngay.md](kich-ban-vong-ngay.md) (vòng ngày)
> **Related:** [Human World Story Bible](human-world-story-bible.md) §3 (thời tiết dùng chung theo `gameDay`), [Kế hoạch bảy đêm cho PC người dân](human-world-villager-night-plan.md), [Ket noi nguoi choi](ket-noi-nguoi-choi.md)
> **Code status:** Design-only. Đã đối chiếu `develop` ngày 2026-11-10.
> **Last reviewed:** 2026-11-10

## 1. Hiện trạng

Trời hiện do **nhãn giờ của cảnh truyện** quyết định (`scene.time` → bảng `CLOCK` / `DARKNESS` trong `public/app.js`). Không có đồng hồ riêng. Hệ quả:

- Cảnh kết của chương "đến nơi" là "Rạng sáng": hết đêm là mờ sáng, không có sáng rõ, trưa, chiều; bảng giờ chưa có Trưa và Chiều.
- Ở **đêm tự do** (người chơi đi dạo sau lựa chọn đầu, chưa bấm Kết thúc đêm), trời vẫn lấy từ cảnh kết, nên đi dạo dưới trời "rạng sáng" dù chuyện đang chạng vạng.
- Mỗi người chơi có trời riêng; hai người cùng làng có thể thấy hai giờ khác nhau.

## 2. Quyết định (chủ project, 2026-11-10)

1. Sau khi kết thúc đêm, trời **sáng dần và nắng lên**, người chơi tiếp tục đi dạo khám phá. Ban ngày để làm việc rảnh (hái cây thuốc, giúp người này người kia, may y của nhà sư…), ban đêm giữ cho chuyện huyền bí và thiền.
2. **Làm đồng hồ riêng cho từng nhân vật trước (M0).** Đồng hồ chung giữa các người chơi để sau, quyết khi có số liệu thật.

## 3. M0 — đồng hồ riêng mỗi nhân vật

Một module thuần (`Clock`), tách khỏi cảnh truyện:

- Giờ game `h` chạy liên tục trên thang 24 giờ nối qua nửa đêm (như bảng `CLOCK` hiện có): chiều tàn 17,2 → … → rạng sáng 29,7 → sáng sớm 30,4 → trưa → chiều → chiều tàn hôm sau 41,2.
- Tiến theo **thời gian chơi thật** (tab đang hiện): mặc định **1 giờ game = 60 giây thật**, hằng số chỉnh được. Một đêm (chiều tàn → gà gáy) khoảng 11 phút; một ngày (rạng sáng → chiều tàn) khoảng 11–12 phút.
- Cảnh truyện **ghim** giờ khi mở (cảnh đầu của đêm đặt giờ về pha của nó); chỉ có hai trần chặn: trong đêm chưa kết thúc, giờ không vượt "Gà gáy"; sau khi kết thúc đêm, giờ chạy tiếp từ "Rạng sáng" tới trần "Chiều tàn".
- Bấm **Kết thúc đêm** → ghim "Rạng sáng"; quán xét có thể bỏ qua; người chơi tiếp tục dạo và trời sáng dần.
- **Sang đêm mới** → ghim chiều tàn của đêm mới. Nếu tải lại trang khi ngày đang trôi, nhân vật bắt đầu đêm mới (chưa có trạng thái "đang giữa ban ngày" lưu riêng; ghi vào backlog).
- **Sáng đầu của người dân** (chốt 2026-11-15, nút nghỉ chốt 2026-11-20): vào game ở Sáng tinh mơ (`h` 6,2). "Kết thúc đêm" chỉ hiện từ Đầu hôm (`h` 20). Chiều tàn và chạng vạng vẫn là lúc việc tối mở, chưa phải lúc nghỉ. Đêm sau vẫn mở ở chạng vạng.
- Chỉ áp dụng cho nhân vật ở chế độ `arrival`; nhân vật legacy giữ trời theo cảnh như cũ.
- Lưu `clockH` trong checkpoint để tải lại không nhảy giờ.

### Bảng pha

| Pha | `h` | Độ tối | Gợi ý hiển thị |
|---|---|---|---|
| Sáng tinh mơ | 6,2 | 0,28 | trời vừa sáng |
| Buổi sáng | 8,5 | 0,10 | buổi sáng |
| Giữa ngày | 12 | 0,05 | giữa ngày |
| Xế chiều | 15,2 | 0,16 | nắng đã nghiêng |
| Chiều tàn | 17,2 | 0,42 | khoảng 17 giờ |
| Chạng vạng | 18,4 | 0,55 | mặt trời vừa lặn |
| Đầu hôm | 20 | 0,60 | khoảng 19 giờ |
| Canh hai | 22 | 0,66 | khoảng 21 đến 23 giờ |
| Canh ba | 24,6 | 0,70 | quanh nửa đêm |
| Canh tư | 26,6 | 0,64 | khoảng 1 đến 3 giờ sáng |
| Gà gáy | 28,6 | 0,55 | gần sáng |
| Rạng sáng | 29,7 | 0,45 | trời hửng sáng |
| Sáng sớm | 30,4 | 0,10 | khoảng 6 giờ sáng |
| Sáng | 32,5 | 0,08 | buổi sáng |
| **Trưa** (mới) | 36 | 0,05 | giữa trưa |
| **Chiều** (mới) | 39 | 0,10 | buổi chiều |
| Chiều tàn | 41,2 | 0,42 | khoảng 17 giờ |

Độ tối nội suy giữa hai pha liền nhau để trời đổi mượt.

## 4. Đường tới đồng hồ chung (để sau)

Module chỉ lấy "bây giờ là mấy giờ" từ **một nguồn**. Đổi nguồn là đổi một chỗ:

| Mô hình | Nguồn giờ | Ghi chú |
|---|---|---|
| **M0** (làm trước) | giờ chơi của từng nhân vật | không cần máy chủ |
| M1 | giờ thật quy đổi chu kỳ ngắn (ví dụ một ngày game bằng 45–60 phút thật), tính từ mốc cố định | mọi người cùng pha; cần gợi ý chờ pha; rủi ro người mới vào đúng ban ngày bỏ lỡ đêm huyền bí |
| M2 | giờ thật bằng giờ game | người chơi một khung giờ không bao giờ thấy pha kia |

Chỉ chuyển sang M1/M2 khi có người chơi thật cho thấy nhiều người cùng online. Thời tiết đã được thiết kế dùng chung theo `gameDay` ([Story Bible §3.3](human-world-story-bible.md)).

## 5. Việc theo pha (định hướng, chưa chia nội dung)

- **Ban ngày:** việc rảnh ([kich-ban-vong-ngay.md](kich-ban-vong-ngay.md) §8), HG01/HG22 quét sân, HG05/HG25, HG07, HG13, HG19, HG20, may y của nhà sư, hái cây thuốc.
- **Chạng vạng và đêm:** chuyện huyền bí (Thọ thần, ngạ quỷ), ngồi thiền, ánh đèn, nghĩa địa.
- Mỗi tình huống có thể khai báo `when: [pha…]`; không có thì mở mọi lúc.

## 6. Tiêu chí nghiệm thu M0

- [ ] Đêm tự do: chiều tàn → đêm tối dần, không còn "rạng sáng" ngay sau lựa chọn đầu.
- [ ] Kết thúc đêm → rạng sáng → sáng → trưa → chiều → chiều tàn; mặt trời đi trên cung trời.
- [ ] Sang đêm mới đặt lại chiều tàn.
- [ ] Tải lại giữa đêm không nhảy giờ.
- [ ] Nhân vật legacy không đổi.
- [ ] Đồng hồ chỉ chạy khi tab hiện và đang có nhân vật.

## 7. Câu hỏi mở

1. Tốc độ 1 giờ game = 60 giây thật có hợp không, hay chậm/nhanh hơn?
2. Tải lại trang giữa ban ngày hiện bắt đầu đêm mới; có cần lưu trạng thái "đang ban ngày" ở PR sau không?
3. Mốc nào để chuyển sang M1 (số người online cùng lúc)?
