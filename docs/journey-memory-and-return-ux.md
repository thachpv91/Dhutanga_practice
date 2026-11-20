# Sổ Hành Trình & Hồi tưởng khi quay lại — Journey Memory UX v0.2

> **Design-only, CHƯA triển khai code/UI/save.** Người chơi tự tạo nhân vật có tên và vai riêng. Tài liệu này quy định ký ức, tổng hợp mạch truyện, tóm tắt khi trở lại sau lúc vắng, nơi nghỉ linh hoạt. Đọc kèm [Player-Centric Narrative Model](player-character-narrative-model.md), [Ghost Campaign Bible](ghost-playable-campaign-bible.md), [Ghost Episode Pack 01](ghost-episode-pack-01.md), [Ghost Episode Pack 02](ghost-episode-pack-02.md), [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md).
>
> **Điều chỉnh bắt buộc:** **Nhà hoang chỉ là MỘT địa điểm nghỉ tùy chọn của PC hồn ma**, không phải nhà/chỗ ở mặc định, không phải tất cả hồn ma cùng sống tại đó, không phải checkpoint cố định, không yêu cầu về nhà mới được save/thoát/nhận hồi tưởng. PC hồn ma có thể tự chọn hoặc thay đổi địa điểm nghỉ tùy câu chuyện và sở thích.

## 0. Quyết định hợp nhất: MỘT Sổ Hành Trình duy nhất (Approved design, 09-11-2026)

> **Status:** Approved design · **Code status:** chưa code · **Last reviewed:** 2026-11-09. **Toàn bộ §0–§8 đã được đồng bộ theo quyết định một Sổ**, không còn các hướng dẫn cũ mâu thuẫn. Sổ khám phá, kiến thức, loài/cõi, Dấu mốc, Nhật ký là các cách xem của cùng dữ liệu; Hồi tưởng là cách trình bày trong màn **Trong lúc vắng**, không có sổ hoặc popup độc lập.

**Ba nguyên tắc chốt:**
1. **Một hệ thống ký ức cho mỗi nhân vật**, nhiều cách xem cùng dữ liệu.
2. **Tận dụng màn đã có**, không thêm popup, nút HUD hay hệ nhiệm vụ riêng.
3. **Khám phá thế giới và hiểu câu chuyện quan trọng hơn số mục hoàn thành.** Không ép mọi mục lên "Xác nhận".

**Tên:** **Sổ Hành Trình** (nhãn ngắn trong giao diện: **Hành trình**). Không dùng "Sổ khám phá" làm tên tổng vì nội dung đã gồm chuyện đời nhân vật, kiến thức và dấu mốc.

### 0.1. Cái gì gộp vào đâu

| Đang có hoặc đề xuất trước | Sau khi hợp nhất |
|---|---|
| Sổ khám phá (`Discover`, tab trong bảng Nhiệm vụ) | Mục **Nơi chốn và nhân vật** của Sổ Hành Trình (cùng thành phần giao diện) |
| Sổ loài và cõi giới, Bản đồ hành trình | Cũng là mục **Nơi chốn và nhân vật** (loại mục: loài, cõi) |
| Sổ kiến thức (`knowledgeBook`) | Mục **Đã học**: mỗi bài là một mục, `đã ôn` và `đã vận dụng` là thuộc tính bổ sung |
| Nhật ký (Hồ sơ và tab trong Album), Dấu mốc, Nhật ký thời gian | Mục **Dòng thời gian**; dấu mốc là sự kiện được ghim |
| Mạch truyện, manh mối (`storyThreads`, `clues`) | Mục **Đang theo** |
| Hồi tưởng khi quay lại (ý tưởng cũ `recapSnapshots`) | **Không tạo kho `recapSnapshots` riêng**; mở rộng màn **Trong lúc vắng** đang có (`reflect.js`) từ sự kiện thật: một đoạn đã làm, một mạch đang theo, một manh mối; không popup mới |
| Việc có thể làm | Mục đầu của bảng **Nhiệm vụ** (trạng thái: Có thể nhận / Đang làm / Để sau / Đã xong); là trạng thái nhiệm vụ, **không trộn** với thang khám phá |
| Codex cấp tài khoản (`accountMeta`) | **Bỏ ở MVP**; mọi manh mối thuộc nhân vật |

**Giữ riêng:** **Album thẻ** (bộ sưu tập) và **Túi đồ** (inventory); Album chỉ liên kết tới sự kiện trong Sổ khi cần.

### 0.2. Giao diện (dùng lại màn có sẵn)
- **Bảng Nhiệm vụ:** hai khu **Việc có thể làm** và **Sổ Hành Trình**.
- **Hồ sơ nhân vật:** **Tổng quan · Hành trình · Người quen**. Hai tab Nhật ký và Dấu mốc biến mất; tab Nhật ký trong Album chuyển về Sổ. **Guest** thấy Tổng quan và Hành trình, không có Người quen.
- Bên trong Sổ: **Nơi chốn và nhân vật · Đang theo · Đã học · Dòng thời gian**. Một thành phần giao diện dùng lại ở cả hai chỗ, không có hai hệ riêng.
- Không thêm icon quyển sổ mới ở HUD.

### 0.3. Thang khám phá và nguồn thông tin
- **Tiến độ hiển thị:** **Chưa biết → Nghe kể → Tận mắt → Xác nhận (khi cần)**. "Xác nhận" dành cho bí ẩn, lời đồn và mối liên hệ cần chứng cứ; **không ép** địa điểm hay NPC phải lên mức này (đến ao sen và nhìn tận mắt là đủ hoàn thành mục).
- **Mỗi thông tin có thêm `sourceType`** (`observation | report | evidence`) vì "tận mắt" không đồng nghĩa "đáng tin hơn lời kể". Ví dụ: nhân vật đã tận mắt gặp người giữ bến (quan sát), còn chuyện tiếng trẻ khóc đêm lũ vẫn là lời kể chưa xác minh.
- **Kiến thức:** `đã ôn`, `đã vận dụng` là thuộc tính bổ sung của mục, không phải thang thứ hai.
- **"Tôi đang nghi"** là ghi chú tự chọn của người chơi, có thể bỏ khỏi MVP mà không đổi cấu trúc.
- `loreBasis` dùng một enum `canonical | commentary | game_interpretation | fiction`; `inspired` chỉ là cách diễn đạt, không phải giá trị thứ năm.

### 0.4. Dữ liệu
- **Một nguồn sự kiện bền theo nhân vật** (`characterId`), máy chủ kiểm và ghi idempotent. **Không dùng `Save.history()` (giới hạn 200 dòng) làm nguồn sự thật**; màn Dòng thời gian chỉ nạp một phần.
- Trạng thái dẫn xuất (ví dụ `G03.itemReturned`, mạch truyện đang ở bước nào, bà cụ đã lấy túi) **được phép lưu dưới dạng projection/cache và checkpoint**, phục vụ gameplay và UI nhanh; phải được cập nhật nhất quán từ **event hợp lệ** hoặc giao dịch lưu state kèm event. Không có **nguồn sự thật thứ hai độc lập** cho cùng một kết quả.
- **Migration từng loại**, giữ nguyên save legacy tới khi kiểm đầy đủ. `backfillMilestones()` chỉ khôi phục dấu mốc từ thẻ, **không** phải công cụ chuyển cả lịch sử thành sự kiện có cấu trúc.
- Các episode HG/G/T **có thể dùng cờ/state nhiệm vụ hoặc trạng thái kiến thức dẫn xuất** để kiểm tra điều kiện; **không tự tạo thêm event store, sổ, hệ kiến thức hoặc cờ tách rời không thể đối soát**. Ưu tiên hợp đồng event/projection chung trước các kịch bản lớn; trạng thái nhiệm vụ `Có thể nhận / Đang làm / Để sau / Đã xong` **khác** thang khám phá.

### 0.5. Nhân vật đã khép (ma kết thúc kiếp)
**Khép là kết thúc câu chuyện, không phải đóng cửa nhân vật** (quyết định 09-11-2026). Trạng thái `story_completed`:
- **Chương truyện read-only:** không nhiệm vụ, không thẻ, không dấu mốc, không khám phá hay sự kiện truyện mới, không đổi vai. Sổ, Album và Túi đồ vẫn mở xem được.
- **Vẫn có Chế độ đi dạo:** người chơi mở nhân vật và đi dạo ở **những nơi đã khám phá** (ngắm cảnh, nghe âm thanh, đọc lại Sổ). Không mở nơi chưa đến, không nhận tương tác sinh sự kiện mới.
- **Phía xã hội:** không gắn `handle`, không vào danh sách online, không ghi "Từng gặp" mới, không giữ kết nối mới. Máy chủ phải từ chối ở tầng dữ liệu, không chỉ ẩn trên giao diện. Mặc định không hiện với người chơi khác; có hiện như khách vãng lai không tương tác hay không là câu hỏi mở.
- Người chơi luôn có thể tạo nhân vật mới.

## 1. Mục tiêu trải nghiệm

- **Trở lại là nhớ được câu chuyện đang tới đâu**, không phải học lại đoạn thoại hàng chục dòng.
- **Làm một việc xong, thế giới nhớ**: gặp ai, hứa gì, đã giúp chưa, nhân chứng nói gì, địa điểm đổi ra sao.
- **Bí ẩn có tầng thông tin**: tách rõ những gì **PC tự thấy**, **nghe NPC kể**, **đang suy đoán** và **đã có chứng cứ xác nhận**; không tiết lộ Hạnh/bà Sáu trước khi PC đi đúng tuyến.
- **Hồi tưởng dịu, ngắn, có quyền bỏ qua**. Đọc sâu tự chọn trong Sổ, không auto-popup khi mới rời game vài phút hoặc cứ vào map.
- **Tách nhân vật:** PC ma và PC sống cùng account vẫn có `characterId`, hành trình, manh mối, kết quả NPC và checkpoint độc lập. Người chơi ngoài đời có thể nhận ra một landmark, nhưng Sổ PC mới không tự biết điều PC kia thấy.

## 2. Điểm nghỉ tự do theo vai — không mặc định “ma ở nhà hoang”

| Vai | Ví dụ địa điểm nghỉ (chọn lựa, không ràng buộc nơi ở) | Không gian hồi tưởng |
|---|---|---|
| **PC hồn ma** | nhà hoang, bên mộ cũ, dưới gốc gạo, bờ khe suối rừng tre, Bến Không Tiếng — Bờ Chìm, mái hiên bỏ trống, một gốc cây yên tĩnh | ánh trăng, gió, sóng nước, tiếng dế; lời hồi tưởng theo nơi chọn |
| **PC người dân** | hiên nhà, nhà người thân phù hợp truyện tự tạo, bến giếng, ghế dưới cây, nơi được người ta cho trú | tiếng bếp, tiếng người, chuyện bên đường |
| **PC nhà sư** | tịnh thất, gốc cây, chỗ thiền hành/nơi nghỉ phù hợp giới luật và cảnh đã được duyệt | tiếng chuông, sương sáng, bước chân kinh hành |

**Mọi điểm nghỉ đều tùy chọn**, không cưỡng chế về một hub. Một PC ma có thể quay về mộ thường xuyên, PC khác thích ngắm suối, PC khác thích nhà hoang. Không có địa chỉ thường trú ngầm định khi chọn `role=ghost`, không chuyển hết các vong NPC vào cùng nhà.

**Gợi ý hành động tại bất kỳ điểm nghỉ hợp vai:**
- `Nghỉ một lát` hoặc `Lắng lại một đêm`: chọn hoạt động khi vắng, không đồng nghĩa chết/tái sinh.
- `Nhớ lại hành trình`: mở Sổ tại **mạch đang theo** hoặc Hồi tưởng gần nhất.
- `Lắng nghe chuyện quanh đây`: chỉ các hint dựa trên NPC/sự kiện có thật đã hiện diện, không sinh bí mật vô cớ.
- `Tiếp tục khám phá`: đóng nhẹ, về map.
- **Không bấm nghỉ cũng luôn lưu progress** ở thời điểm an toàn, save khi rời/đổi nhân vật; không bắt PC hoàn thành đêm mới có thể thoát.

**Nhà hoang trong G01/G03** còn có chức năng riêng (hù vui, phát hiện túi kim chỉ, ngắm cảnh). Chọn nghỉ ở đó chỉ là **một lựa chọn thêm**, không là tuyến duy nhất hoặc một nơi chứa mọi hồn ma.

## 3. Bốn cách xem của một Sổ Hành Trình

| Khu trong Sổ | Dữ liệu hiển thị | Ví dụ |
|---|---|---|
| **Nơi chốn và nhân vật** | địa danh, NPC, loài, cõi; `Chưa biết / Nghe kể / Tận mắt / Xác nhận` khi có lý do | đã đến ao sen, nghe đồn về khe suối |
| **Đang theo** | mạch truyện đang mở, sự kiện liên quan, bước tiếp theo nếu người chơi muốn theo | G03: thấy túi → biết bà cụ tìm → đã giúp tìm |
| **Đã học** | kiến thức đã gặp/nghe, nguồn; `đã ôn`, `đã vận dụng` là thuộc tính | đã nghe một đoạn về năm triền cái |
| **Dòng thời gian** | sự kiện đã xảy ra theo thời gian, gồm các Dấu mốc đáng nhớ được ghim | đã hù ông Tư, đã thấy bà tìm túi |

**Cả bốn chỉ là các góc nhìn/truy vấn**, không tạo bốn kho dữ liệu. Dấu mốc không mất: lấy từ event/thẻ cũ đã được migration rồi ghim trong Dòng thời gian. Những chuyện **đã khép** có thể lọc trong **Đang theo** mà không cần tab thứ năm.

**Album thẻ tâm** và **Túi đồ** vẫn là phần riêng của hệ thống nhân vật, không nhập vào Sổ; Album có thể dẫn đến sự kiện liên quan nhưng **không có tab Nhật ký bản sao**.

Một mục có thể có nhiều sự kiện khác nhau: PC **đã thấy người giữ bến** (mức Tận mắt đối với NPC) nhưng **chỉ nghe kể** về tiếng trẻ đêm lũ (mức Nghe kể đối với lời đồn). `sourceType` là nguồn của **từng thông tin**, không tự nâng mức tin cậy của một tin đồn vì nhân vật trực tiếp gặp người kể.

**Không dùng suy đoán để tự lộ bí mật**. “Tôi đang nghi” là ghi chú tùy chọn trên mục; không là mức khám phá thứ năm và có thể chưa làm ở MVP.

## 4. UX — tái sử dụng bảng Nhiệm vụ, Hồ sơ và màn Trong lúc vắng

**Không thêm icon trên HUD, không thêm panel hoặc popup mới:**
- **Bảng Nhiệm vụ** giữ hai khu **Việc có thể làm** và **Sổ Hành Trình**. Mục Việc có thể làm dùng trạng thái nhiệm vụ riêng; không trộn vào thang `Nghe kể/Tận mắt`.
- **Hồ sơ** dùng **Tổng quan · Hành trình · Người quen** (guest: Tổng quan · Hành trình); Hành trình là **cùng thành phần Sổ** đã dùng trong bảng Nhiệm vụ. Hai tab Nhật ký/Dấu mốc cũ chuyển vào **Dòng thời gian**; tab Nhật ký bên trong Album cũng bỏ.
- **Sổ** có bốn khu theo §3, không mở “Sổ manh mối”, “Sổ kiến thức” hoặc “Nhật ký thời gian” độc lập.

**Mục Đang theo:** mỗi mạch 1–2 câu tóm tắt **chỉ từ việc nhân vật thực biết**, thêm đường đi tiếp nếu có, `Nhớ lại`/lọc Đã khép nếu muốn. Không ép nhận nhiệm vụ chỉ vì đi ngang NPC; không biến Sổ thành checklist cày điểm.

**Mục Nơi chốn và nhân vật:** giữ `?` và tính khám phá từ `Discover` hiện có; có thể chỉ hướng đến nơi đã nghe đồn. Thông tin do NPC kể phải có nhãn nguồn nhỏ nếu cần, không biến lời đồn thành sự thật.

**Màn Trong lúc vắng:** **mở rộng chính `reflect.js` đã có**, khi có dữ liệu đáng kể và người chơi quay lại sau khoảng vắng phù hợp. Tối đa **1 đoạn hoạt động lúc vắng**, **1 chuyện đang theo**, **1 manh mối đáng nhớ** cùng `Mở Hành trình` / `Tiếp tục khám phá`; nếu không có gì mới thì vào game bình thường. Có quyền bỏ qua và đọc lại trong Sổ, **không tạo `recapSnapshots` store/popup khác**. Những câu kể phải dựa trên sự kiện đã được ghi, không tự dựng việc NPC làm khi offline.

**Không claim lại:** mở Sổ, xem hồi tưởng, đổi nhân vật hoặc tải lại không tạo thẻ/mốc mới.

## 5. Ví dụ hồi tưởng cho PC ma (có thể nghỉ ở bất kỳ nơi nào)

### Sau khi nghỉ dưới gốc gạo

> **Một đêm đã qua.** Gió lùa qua những bông gạo cuối mùa.
>
> **Chiếc túi kim chỉ:** Bạn từng thấy nó ở bậc thềm nhà hoang. Bà cụ vẫn đang tìm.
>
> **Điều còn thắc mắc:** Ở khe suối rừng tre, có tiếng mái chèo vọng lại dù chẳng thấy con thuyền.
>
> `Xem lại hành trình` / `Tiếp tục khám phá`.

### Sau khi nghỉ trong nhà hoang

> **Đêm bên mái cũ.** Bụi trăng rơi qua cửa sổ không còn cánh.
>
> **Chuyện đã đổi:** Bà cụ trở lại bậc thềm và tìm được chiếc túi. Lần sau bạn thấy bà ngồi vá quai thúng.
>
> **Mạch khác:** Bà Sáu vẫn chờ dưới gốc gạo. Bạn chưa biết bà đang đợi ai.
>
> `Xem lại hành trình` / `Tiếp tục khám phá`.

### Sau khi nghỉ trên Bờ Chìm

> **Đêm gần Bến Không Tiếng.** Dòng nước phẳng như gương.
>
> **Điều đã nghe kể:** Người giữ bến nhớ tiếng trẻ con khóc trong một đêm lũ, **không chắc** ai đã qua được bờ.
>
> **Điều cần tự tìm hiểu:** Có mối liên quan nào với lời bà Sáu hay không?
>
> `Xem manh mối` / `Tiếp tục dạo bến`.

**Những câu trên chỉ được render khi các event tương ứng thật sự có trong save của PC.** Khi không có đủ dữ liệu, thay bằng đoạn cảnh đẹp ngắn, không bịa sự kiện/NPC.

## 6. Hợp đồng event và projection — mô tả trước code, không phải API

**Một nguồn sự kiện đã xác thực theo `characterId`**; các màn chỉ đọc **projection** của sự kiện. Cờ nhiệm vụ dùng để kiểm tra nhanh **không phải** một sổ mới. Ví dụ minh họa (không tự động suy diễn thành cấu trúc database):

```js
const memoryEvent = {
  id: "char123:g03:item_seen:v1",  // duy nhất/idempotent theo nhân vật + hành động
  characterId: "char123",
  storyId: "G03",
  type: "discovery",               // action | discovery | report | world_change | milestone
  subjectId: "item.sewing_pouch",
  sourceType: "observation",       // observation | report | evidence
  sourceActorId: null,            // người kể nếu type=report
  placeId: "abandoned_house",
  at: "server_timestamp",
  payload: { where: "under_step" } // server kiểm tra, không tin input client
};
// Đây là dữ liệu HIỂN THỊ/TỐI ƯU, dẫn xuất từ các event đã xác nhận
const discoveryView = {
  characterId: "char123",
  subjectId: "item.sewing_pouch",
  level: "seen",                   // unknown | heard | seen | confirmed
  relatedStoryId: "G03",
  latestEventId: "char123:g03:item_seen:v1"
};
const questProjection = {
  characterId: "char123",
  storyId: "G03",
  stage: "owner_known",            // cho phép lưu checkpoint khi cần gameplay
  updatedByEventId: "char123:g03:owner_known:v1"
};
```

- **Chỉ event log là lịch sử bền vững của các thay đổi mang ý nghĩa chuyện**. Projection như `storyState`, `discoveryView`, `knowledgeProgress` được phép lưu/cache, nhưng phải **có thể đối chiếu với event** và không tự tạo phần thưởng/spoiler độc lập. Có thể commit cả event và projection trong cùng giao dịch hợp lệ; không buộc mỗi lần mở Sổ replay toàn bộ log.
- **Hai chiều khác nhau:** `level` là tiến độ khám phá **từng subject/claim**; `sourceType` cho biết căn cứ của **từng event**. Lời đồn ferryman không thành đã xác nhận chỉ vì người chơi đã tận mắt gặp ông. `đã ôn/đã vận dụng` là thuộc tính của mục Đã học, không là một thang khám phá thứ hai.
- **Nghỉ ở đâu:** chỉ lưu `chosenPlaceId` cùng hoạt động lúc vắng trong **checkpoint/away state hiện có**, không tạo kho `restChoice` mới; nhà hoang chỉ là một trong nhiều điểm nghỉ của PC ma.
- **Hồi tưởng:** tạo từ các event mới và checkpoint trạng thái trong `reflect.js` bằng template theo tình huống, không cần AI thời gian thực hoặc `recapSnapshots` store.
- **Máy chủ kiểm quyền và chống lặp:** phân quyền nhân vật, tính hợp lệ của NPC/vật/thời điểm, chống nhận lại thẻ, kiểm `story_completed` read-only; không tin client để gán `evidence` hay mở spoiler.
- **Legacy migration từng loại:** `dhutanga.history` hiện tối đa 200 dòng chỉ phục vụ nhật ký cũ, không thể khôi phục chi tiết trước đó; `backfillMilestones()` chỉ lấy dấu mốc từ thẻ, **không** tự suy ra toàn bộ truyện. Giữ save cũ và checkpoint, `saveVersion`, ghi lại các nguồn legacy có thể xác minh; không bịa ký ức hay chuyển `dhutanga.memory` cấp account thành sự thật của PC mới.
- **Nhiều nhân vật:** event/subject/quest/spoiler gắn `characterId`. Đổi dân sang sư giữ cùng nhân vật; ghost `story_completed` vào archive read-only. Không thêm Codex cấp account trong MVP, không sync manh mối giữa nhân vật.
- **NPC tự làm việc lúc vắng:** chỉ ghi `npc_finds_item` nếu một lịch trình/kết quả đã thực sự được giải quyết và persist; chưa có event thì Sổ không nói “bà đã tìm được”.

### 6.1. Hợp đồng kỹ thuật MVP của event log (Approved design, 09-11-2026)

> **Phạm vi:** đủ để làm B1–B3 (saveVersion, event log, thành phần Sổ). **Mức kiểm tra phía máy chủ được chọn ở mức vừa phải** vì đây là game chữa lành, tiến trình cá nhân do client báo; không dùng máy chủ có thẩm quyền (không Colyseus). Máy chủ không chống được người cố tình tự gửi sự kiện giả cho chính nhân vật của mình, và điều đó được chấp nhận. Sự kiện **không bao giờ** tạo phần thưởng có giá trị cho người khác hay lộ ra ở API công khai.

**Lưu trữ** (cả Postgres và file store; Postgres phải qua `test/pg-smoke.test.js`):

| Trường | Ý nghĩa |
|---|---|
| `seq` | số thứ tự tăng dần toàn cục (dùng để phân trang) |
| `character_id` | chủ sự kiện; xóa nhân vật thì xóa sự kiện (cascade) |
| `event_id` | id do client đặt, **duy nhất theo nhân vật** (`unique(character_id, event_id)`), dạng `^[a-z0-9_.:-]{3,80}$`, ví dụ `disc:be_na:seen`, `ms:first_card`, `char:G03:item_seen:v1` |
| `type` | `discovery`, `report`, `milestone`, `action`, `world_change` (xem catalog) |
| `subject_id` | mục bị tác động (`disc:cho`, `milestone:first_card`…), có trong catalog |
| `source_type` | `observation` / `report` / `evidence` |
| `source_actor_id`, `place_id`, `story_id` | tùy chọn, mỗi trường tối đa 60 ký tự |
| `level` | chỉ cho `discovery`: `heard` / `seen` / `confirmed` |
| `at` | **giờ máy chủ** (mili giây); `client_at` chỉ để tham khảo, không dùng để sắp xếp |
| `payload` | JSON tối đa 2 KB, không chứa văn bản tự do dài |
| `save_version` | phiên bản dữ liệu nhân vật lúc ghi (B1) |

**Catalog sự kiện được phép** (`public/event-catalog.js`, file dùng chung: trình duyệt nạp bằng thẻ script, máy chủ `require`; có test bảo đảm hai bên cùng một danh sách): mỗi mục có `type`, mẫu `subjectId`, `sourceType`/`level` hợp lệ, vai được phép (nếu có), và `title`/`text` để hiển thị **từ catalog**, không từ văn bản client gửi. MVP chỉ gồm: 12 mục khám phá của `Discover` (heard/seen), toàn bộ `Milestones.defs`, và vài sự kiện `action` có tên cố định (đã làm một việc trong tuyến). Sự kiện không có trong catalog bị từ chối.

**API** (đăng nhập, JSON, chỉ chủ nhân vật; khách chơi thử không dùng event log mà giữ nguyên nhật ký cục bộ):
- `POST /api/characters/:id/events` với `{ events: [...] }`, tối đa 20 sự kiện mỗi lần. Trả về từng sự kiện `created` / `duplicate` / `rejected` kèm lý do. **Idempotent:** gửi lại cùng `event_id` là `duplicate`, không ghi thêm và không báo lỗi.
- `GET /api/characters/:id/events?after=<seq>&limit=<n>&type=<type>` theo thứ tự `seq`, tối đa 200 mỗi trang.
- Nhân vật **đã khép** (`story_completed`): POST bị từ chối (403), GET vẫn đọc được.

**Giới hạn:** tối đa 60 sự kiện mỗi phút mỗi nhân vật (bộ đếm trong bộ nhớ); tối đa 3 000 sự kiện mỗi nhân vật, khi vượt thì xóa sự kiện `action` cũ nhất trước, **không bao giờ xóa `milestone` và `discovery`**. Dữ liệu nhân vật (`data`, tối đa 96 KB) vẫn tách riêng, nên event log không làm nó phình.

**Projection phía client:** `level` của từng mục khám phá = mức cao nhất trong các sự kiện của mục đó (`heard` < `seen` < `confirmed`); các khu của Sổ được tính từ sự kiện cộng catalog và có thể lưu cache. Projection **không** là nguồn sự thật.

**Dữ liệu cũ (không mất gì):** lần đầu mở một nhân vật ở `saveVersion` mới, client gửi **một đợt sự kiện suy ra từ dữ liệu cũ có thể xác minh** (`Discover` đã gặp/đã nghe, `Milestones` đã đạt), id tất định kiểu `legacy:disc:<id>:seen` nên gửi lại không nhân đôi. `Save.history` (200 dòng tự do) **không** chuyển thành sự kiện; Dòng thời gian hiển thị nó như phần "trước đây" cho tới khi hết. Không bịa ký ức.

**Riêng tư và spoiler:** sự kiện thuộc `characterId`, không có endpoint của người khác đọc được, không đưa vào hồ sơ công khai, không đồng bộ giữa các nhân vật cùng tài khoản.

## 7. Giao tiếp người chơi thật — lưu ký ức sự kiện, không auto đọc suy nghĩ

Nếu PC ma gặp player sư/dân và nghe lời hồi hướng/thấy gesture đã được **server phát trong thế giới**:
- Hồn ma có thể tự chọn `Lắng nghe` và lưu event “Tôi đã nghe lời hồi hướng gần tịnh thất”, chỉ khi có sự kiện thực, trong vị trí và điều kiện hợp lệ.
- **Không giả định** lời hồi hướng có hiệu lực tái sinh tự động hoặc lời player thật đương nhiên làm quest hoàn thành. Phân biệt `dedication_npc` với `dedication_player`, cần consent/rate limit/test trước khi code.
- Không auto lưu nguyên văn chat riêng, tên/ID người chơi khác trong Sổ nếu không có lý do rõ; ưu tiên lưu event mô tả chung, tôn trọng chặn/ẩn hồ sơ.

## 8. Checklist trước coding

- [ ] PC ma nghỉ ở **nhiều nơi**; nhà hoang là một lựa chọn, không bắt buộc, không có `ghost.home = ruin` mặc định.
- [ ] Có `Tiếp tục khám phá` khi đứng gần điểm nghỉ; save khi rời game không phụ thuộc địa điểm.
- [ ] Tab Hành trình và khu Sổ ở bảng Nhiệm vụ dùng **cùng thành phần**, đủ bốn mục §3, không có menu HUD mới; không là bảng bắt làm quest.
- [ ] G03: PC chỉ thấy túi thì Sổ ghi vị trí; chỉ sau khi chủ động biết bà tìm thì ghi bà là chủ; nếu bà tự tìm không ghi PC đã giúp.
- [ ] Bến: lời ferryman có `sourceType=report` về **một lời đồn**, không biến thành chứng cứ Hạnh là ai chỉ vì PC đã gặp ông.
- [ ] **Chỉ dùng màn `Trong lúc vắng` hiện có**, không tạo popup/`recapSnapshots` riêng; không spam session ngắn, có skip và cách xem lại; hồi tưởng không phát thẻ.
- [ ] PC có thể chuyển dân → sư giữ Sổ; PC ma ending vẫn đọc được Sổ ở archive.
- [ ] Guest, signed-in, nhiều PC cùng account không lộ spoiler; giữ được save cũ sau migrate; `Save.history()` chỉ là log legacy 200 dòng, không giả là event store bền.
- [ ] Recap render từ event có thật, không bịa sự kiện khi vắng, không lộ bí mật chưa khám phá.
- [ ] Người chơi thật khác không bị lưu chat riêng/danh tính vào hồ sơ game ngoài mục đích hợp lệ.
