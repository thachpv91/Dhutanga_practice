# Kịch bản bảy ngày đêm cho PC người dân — lời thoại, lời kể, biến thể theo tính cách v0.2

> **Status:** Proposed (chờ chủ project duyệt câu chữ; chờ giáo thọ Theravāda duyệt các chỗ có nhãn ⚠)
> **Scope:** narrative (lời thoại, lời kể, nhãn lựa chọn, câu trên thẻ) + review thiết kế
> **Owner doc:** [Kế hoạch bảy đêm cho PC người dân v0.2](human-world-villager-night-plan.md) (bảng đêm, luật thẻ R1–R13) và [kich-ban-vong-ngay.md](kich-ban-vong-ngay.md) (vòng ngày)
> **Related:** [Player-Centric Narrative Model](player-character-narrative-model.md), [Playable Scenarios HG01–HG27](human-world-playable-scenarios.md), [Episode Pack 01](human-world-episode-pack-01.md), [Early Mysteries & HG27](human-world-early-mysteries-and-peta-quest.md), [Human World Story Bible](human-world-story-bible.md), [Hệ thống tâm](he-thong-tam.md), [Đồng hồ thế giới v0.1](dong-ho-the-gioi.md)
> **Code status:** Lát cắt tuần đầu triển khai trong PR #46. `public/villager-week.js` thêm cảnh nối, rau má, cán gáo, con Vàng, treo đèn, tuyến xôi và lời đồn về hang/tháp. `public/encounters.js` giữ các cuộc gặp Thọ thần và HG27. Phần review cuối tài liệu ghi các phương án từ bản thiết kế trước.
> **Last reviewed:** 2026-11-21

Tài liệu này **không tạo lore mới** và không đổi thứ tự đêm. Nó viết **chữ thật** cho bảng đêm 1–7 của [kế hoạch bảy đêm v0.2](human-world-villager-night-plan.md), để thay các bản tạm trong `public/story-arrival.js` và `public/storylets.js`. Phần cuối là [Review thiết kế](#9-review-thiết-kế): những chỗ người viết thấy chưa ổn, nói thẳng.

## 1. Mục tiêu và trải nghiệm

Một người mới dọn về làng. Bảy đêm đầu, họ quen dần cái giếng, khúc quanh đầu ngõ, con chó vàng, một ông già cộc tính, và hai chuyện lạ ngoài rìa làng. Không ai giao bài. Không ai chấm điểm.

Người chơi đọc ít, chọn ít, đi nhiều. Mỗi lượt chữ **tối đa 1–2 câu**. Thứ ở lại sau mỗi đêm là: một người nhớ mặt mình, một chỗ trong làng đổi khác, một câu hỏi còn treo.

## 2. Ràng buộc đã chốt (không bàn lại ở đây)

| # | Ràng buộc | Nguồn |
|---|---|---|
| C1 | PC là người do người chơi đặt tên. Sư Tịnh, Ông Tư, Bà Sáu là NPC. Không gán ký ức, vợ, con, món nợ của họ cho PC | [model PC](player-character-narrative-model.md) |
| C2 | Không có bước hỏi cảm xúc người chơi. **Nhãn lựa chọn phải mang sẵn động cơ** | kế hoạch v0.2, quyết định 7, R13 |
| C3 | Thẻ thiện chỉ khi động cơ nằm trong lựa chọn (R3–R5). Thẻ bất thiện đến từ **lời kể theo tính cách** hoặc từ một nhãn nói rõ động cơ; không do người chơi tự báo | kế hoạch v0.2 §5 |
| C4 | Mô tả tâm và câu trên thẻ dùng **"Người này"**. Cảnh mở đầu được dùng "bạn" | luật giọng kể |
| C5 | Truyện chỉ mở khi người chơi bấm. Cảnh nào cũng có lối bỏ qua, không phạt | [game-design-principles.md](game-design-principles.md) |
| C6 | HG27: ba mốc Bi → Không tham → Tùy hỷ; giữ cảnh bà sáng lên rồi tan vào ánh trăng; không nói "siêu thoát", không khẳng định giải thoát tối hậu | [HG27](human-world-early-mysteries-and-peta-quest.md) |
| C7 | Mọi câu chạm tới giáo lý mang nhãn **⚠ cần giáo thọ Theravāda duyệt** | [AGENTS.md](AGENTS.md) §4 |

## 3. Quy ước đọc kịch bản

- **Lời kể** in nghiêng trong khung trích. **Thoại** ghi tên người nói. **Lựa chọn** viết trong `ngoặc mã`, đúng chữ sẽ hiện trên nút.
- `{tên}` là tên nhân vật người chơi đặt.
- **[BT-n]** đánh dấu cảnh có biến thể theo tính cách; bảng biến thể nằm ở [§6](#6-biến-thể-lời-kể-theo-tính-cách). Câu biến thể **thay** đúng một câu kể được đánh dấu ◆ trong cảnh.
- **Nhịp thẻ:** ghi tên thẻ + luật áp dụng + câu "lúc nãy" trên thẻ. Không ghi gì nghĩa là **không có thẻ**.
- **Lần sau:** điều NPC hoặc cảnh vật nhớ.
- Mỗi cảnh có một **khóa trạng thái đề xuất** để dev nối vào; đây là gợi ý, không phải API.

**Xưng hô (đề xuất, cần chủ project chốt — xem câu hỏi mở 1):** PC chưa có tuổi, chưa có giới tính, nên NPC **tránh đại từ ngôi hai** khi được. Bà cụ ở giếng gọi "con" (bà gọi ai cũng vậy). Ông Tư nói trống không, xưng "tôi". Chị Ba gọi bằng `{tên}`. Bé Na không gọi, chỉ nói. Nhãn lựa chọn của PC tránh tự xưng; khi buộc phải xưng với bà cụ thì dùng "con".

## 4. Cảnh mở đầu `pa` / `pb` và dòng kết đêm

Thay nội dung `STORY.villager.scenes` trong `public/story-arrival.js`. Vai sư và ma không thuộc phạm vi tài liệu này.

### 4.1. `pa_0` — sáng đầu tiên

**Đã chốt khi chơi thử, 2026-11-15.** Vừa vào là **sáng tinh mơ**, không phải chiều tà. Câu "ra giếng gặp cả làng" là sai: ngoài giếng chỉ có bà cụ. Nút ấy cũng không được nhảy thẳng sang "kết thúc đêm".

**Giờ:** Sáng tinh mơ. **Nơi:** `village`.

> *Bạn tới làng lúc trời vừa sáng. Sương còn trên lá, nắng mới vàng ở đầu ngõ.*
>
> *Nhà bên nói nhỏ: "Giếng ở đầu ngõ. Sáng nào bà cụ cũng múc nước ở đó."*

- `Ra giếng lấy nước` → cảnh ở `well` (mục 1.1), người chơi phải đi tới giếng
- `Đi một vòng xem làng trước` → ngõ còn vắng, rồi mới chọn ra giếng hoặc đi dạo

Đi dạo sau đó **chưa** hiện "Kết thúc đêm". Chiều tàn và chạng vạng là lúc lá gạo có thể sáng, người chơi còn đang làm việc. Nút ấy chỉ hiện từ **Đầu hôm**. Bản tạm có câu "ngoài nghĩa địa có vị sư ở lại" — **bỏ**, vì móc của đêm 1 là lá gạo, và câu ấy làm lẫn hai vị sư (xem review, mục R-14).

### 4.2. `pb_0` — câu mở cho từng đêm 2–7

Bản tạm chỉ có **một** câu mở cho mọi đêm sau. Đề xuất: câu mở theo số đêm trong bảy đêm đầu, sau đó quay vòng kho câu thường ở §4.3. (Cần engine chọn câu theo đêm; xem review R-9.)

| Đêm | Lời kể mở (dùng "bạn") | Lựa chọn nhỏ |
|---|---|---|
| 2 | *Cơm chiều xong, bạn nghe mấy người ngoài ngõ nói nhỏ với nhau.* / *"Mộ thấp bên nghĩa địa dạo này có tiếng khẽ lắm. Như ai kêu đói."* | `Ra nghĩa địa xem có ai cần gì không` · `Ra giếng hỏi bà cụ trước` · `Tối nay chỉ đi dạo` |
| 3 | *Chiều xuống. Ngoài giếng có tiếng gáo khua vào thành, lóc cóc mãi không thôi.* | `Ra giếng xem bà cụ làm gì` · `Đi dạo quanh làng` |
| 4 | *Hôm nay bạn về muộn. Tới khúc quanh đầu ngõ thì chẳng thấy bậc đá đâu nữa.* | `Dò từng bước qua khúc tối` · `Đứng chờ cho mắt quen bóng tối` |
| 5 | *Chiều nay cả ngõ thơm mùi nếp. Nhà ai đó đang đồ xôi.* | `Lần theo mùi xôi xem nhà ai` · `Ra giếng trước` |
| 6 | *Từ sáng, bên nhà ông Tư có tiếng chặt lá chuối.* / *Giờ lá đã xếp thành chồng ngoài hiên.* | `Ghé qua xem ông có cần gì không` · `Đi dạo` |
| 7 | *Bảy đêm rồi. Bạn đã thuộc khúc quanh đầu ngõ, kể cả lúc trời tối.* | `Ghé hiên nhà ông Tư` · `Ra ngõ ngắm trời` |

Câu mở đêm 7 cố ý **không** nhắc đèn, gáo hay bé Na, vì người chơi có thể đã bỏ qua hết. Nếu có `helpedLamp`, thêm một câu: *Ngọn đèn bạn góp tay treo vẫn sáng ở đó.*

### 4.3. Kho câu mở cho đêm thường (sau đêm 7, quay vòng, không lặp hai đêm liền)

1. *Cơm xong, bạn ra hiên. Trăng lên sau rặng tre.*
2. *Trời trong. Ngoài ngõ có tiếng ai gọi con về ăn cơm.*
3. *Gió đổi hướng. Mùi khói bếp nhà bên bay sang, thơm như cơm mới.*
4. *Tối nay làng im sớm. Chỉ còn tiếng gàu chạm nước ngoài giếng.*
5. *Con Vàng nằm giữa ngõ, thấy bạn thì vẫy đuôi một cái rồi nằm tiếp.* (chỉ khi `dogMeeting=calm`)

Lựa chọn dùng chung: `Đi dạo một vòng` · `Ngồi hiên thêm chút nữa`.

### 4.4. Dòng kết đêm

Hiện khi người chơi bấm **Kết thúc đêm**. Một dòng, không khen chê. Dòng được chọn theo **việc đã xảy ra**, không theo thanh "Lòng tin" (bản tạm chọn theo thanh; xem review R-10).

| Đêm | Nếu việc chính đã xong | Nếu còn dở hoặc chưa đụng tới |
|---|---|---|
| 1 | *Trời hửng. Ở gốc gạo, mấy chiếc lá vẫn còn sáng, nhạt dần theo nắng.* | *Đêm đầu ở làng mới. Lá cây gạo đằng kia có vẻ sáng hơn trăng, hay là bạn nhìn nhầm?* |
| 2 | *Gà gáy. Lời đã hứa bên mộ thấp còn chờ một buổi sáng.* (nếu đã nhận lời HG27) | *Gà gáy. Lối ra nghĩa địa vẫn ở đó; đêm khác có thể ghé.* |
| 3 | *Bếp bà cụ còn đỏ lửa. Mùi canh rau má bay ra tận giếng.* | *Rau má ngoài gốc mít đêm nay lại mọc thêm một ít.* |
| 4 | *Ngõ có đèn. Người đi chợ sớm bước qua bậc đá mà không phải dò.* | *Khúc quanh đầu ngõ vẫn tối. Sáng ra mới thấy bậc đá nằm ở đâu.* |
| 5 | *Nồi xôi nhà ông Tư nguội rồi. Ông vẫn chưa xới.* | *Mùi nếp còn vương trong ngõ tới gần sáng.* |
| 6 | *Mười hai gói xôi đã tới mười hai nhà. Lá chuối thừa còn xếp ngoài hiên.* | *Sáng ra, ông Tư tự gánh xôi đi. Ông đi chậm, nhưng đi hết xóm.* |
| 7 | *Bảy đêm ở làng. Sáng nay có người chào bạn bằng tên.* | *Bảy đêm ở làng. Vẫn còn mấy cánh cửa bạn chưa gõ, và không ai giục.* |

**Khi dựng tuần đầu:** Đêm 6 ghi “Xôi đã đến tay người nhận” theo việc thực sự diễn ra. Mười hai là số **gói**, một nhà có thể nhận nhiều gói. Tách việc phụ gói, trực tiếp mang xôi và nghe người khác kể. Kết đêm 7 dùng câu “Mai ghé” nếu Ông Tư thực sự đã mời.

Mầm cho đêm sau **không** phụ thuộc việc người chơi đang đứng ở đâu khi bấm nút: mầm đêm 2 nằm trong câu mở đêm 2 (§4.2). Bà cụ ở giếng nói thêm câu ấy nếu được hỏi, nhưng không bắt buộc.

Nếu engine tạm thời chỉ có ba mức theo thanh, dùng ba câu trung tính này cho mọi đêm:

- *Một đêm nữa ở làng. Mai trời vẫn sáng như mọi hôm.*
- *Đêm êm. Chẳng có gì to tát, và thế là đủ.*
- *Gà gáy. Ngoài ngõ đã có tiếng chổi tre.*

## 5. Kịch bản từng đêm

### Đêm 1 — Lá gạo sáng

**Việc trong đêm (tab Việc đang chờ):**

| Loại | Tiêu đề | Dòng mô tả |
|---|---|---|
| Chính | Lá cây gạo sáng | Chạng vạng, lá cây gạo đầu làng sáng lên dù không có gió. |
| Phụ | Tiếng chuông chiều | Có tiếng chuông nhỏ từ tịnh thất. (§7.1) |
| Tự chọn | Ra giếng | Sáng tinh mơ. Chỉ có bà cụ múc nước. |

#### 1.1. Giếng làng — làm quen bà cụ

**Bối cảnh:** sáng tinh mơ, `well`. Bà cụ (`npc.granny`) múc nước, xoay mãi cái cán gáo lỏng. Cảnh mở khi người chơi đi tới giếng, không phải một nút kết đêm.

> **Bà cụ:** "Nhà mới dọn về hả con? Uống ngụm nước đã. Giếng này ngọt lắm."

- `Hỏi bà chuyện trong làng`
- `Nhìn cái gáo trên tay bà`
- `Uống nước, cảm ơn rồi đi`

**Hỏi chuyện:**

> **Bà cụ:** "Làng nhỏ, chuyện cũng nhỏ. À, cây gạo ngoài kia, chạng vạng lá nó có khi sáng lên."
>
> **Bà cụ:** "Thấy thì đừng sợ. Bà thấy từ hồi còn con gái."

**Nhìn cái gáo:**

> **Bà cụ:** "Nó lỏng cán mấy bữa nay. Kệ, còn múc được."

(Mầm cho đêm 3. Không nhận việc ở đây.)

**Hệ quả:** `metGranny`, `rumour:gao_leaves` nếu đã hỏi. **Bỏ qua:** đi ngang, bà vẫn múc nước. **Lần sau:** bà gọi "con nhà mới dọn" thay cho câu chào đầu.

#### 1.2. Đóm vàng — cái nồi cũ (`fv_pot`)

> *Một cái nồi đất úp bên bờ rào, đáy đen bóng. Ai đó từng nấu cơm bằng nó rất nhiều năm.*

- `Lật lên xem` → *Trong nồi không có gì. Chỉ có một con dế, nó nhảy ra, bực bội.*
- `Để yên`

Không thẻ, không việc. Ghi một dòng Sổ. (Câu chữ hiện có của `fv_pot` trong code chưa được đối chiếu; nếu đã có chữ hay hơn thì giữ.)

#### 1.3. Gốc gạo — gặp Thọ thần

**Bối cảnh:** chạng vạng, `gao`. Từ xa đã thấy lá sáng từng chiếc. Người chơi bấm `Lại gần gốc gạo`.

> *Lá cây gạo sáng lên, từng chiếc một, dù trời không có gió.*
>
> *Một bà cụ hiền bước ra từ sau thân cây, như đã đứng đó từ lâu.*
>
Lần gặp đầu **chưa** giao việc. Người chơi được xem vị ấy và hỏi bà là ai, rồi mới bấm tiếp.

- `Xem tâm vị ấy`
- `Hỏi: bà là ai?`
- `Nghe tiếp`
- `Để sau` → *"Ừ. Ta ở cây này. Khi nào muốn nghe thì lại."*

**Hỏi bà là ai:**

> **Thọ thần:** "Ta ở cây này lâu rồi. Lâu hơn cái giếng."
>
> **Thọ thần:** "Lá sáng là ta đang thức. Người đừng sợ."

**Nghe tiếp** mới tới lời nhờ:

> **Thọ thần:** "Có đứa bé lạc trong bụi tre, khóc từ chiều. Ta gọi mà nó không nghe được."
>
> **Thọ thần:** "Người thì nó nghe. Đưa nó về giúp ta nhé?"

- `Đi tìm đứa bé, kẻo trời tối hẳn`
- `Xem tâm vị ấy` (vẫn mở được, kể cả khi đã bấm tiếp)
- `Để sau` → *"Ừ. Ta trông chừng nó từ đây."*

(Không dùng câu gây áy náy kiểu "nó sợ tối lắm". Người chơi được quyền hoãn.)

**Hệ quả:** vừa gặp thì `tree.met`, Sổ ghi *Thọ thần ở gốc gạo* và dấu mốc mở lại được hình cùng tâm của vị ấy. Ô ấy ghi *Đọc thêm*: dưới bảng tâm là vài chuyện đã dẫn nguồn (Jātaka 74 và Tương Ưng Rừng cho thọ thần; Chuyện Thiên Cung và Tăng Chi 3.37 cho chư thiên; Kinh Ngoài Bức Tường cho ngạ quỷ). Lần gặp đầu và *Xem tâm* vẫn một hai câu, không đọc các chuyện ấy. `Đi tìm đứa bé` mới đặt `tree=child`. ⚠ **Cần giáo thọ Theravāda duyệt:** cách gọi "thọ thần", việc vị ấy hiện ra nhờ người, câu một dòng trong thẻ tâm, và lời kể rút gọn trong mục Đọc thêm.

#### 1.4. Lần theo tiếng khóc (M1)

Code hiện có (PR #30) đã có trò này với ba dòng báo "Tiếng khóc còn xa…", "Tiếng khóc gần hơn…", "Rất gần rồi…" và một vòng sáng quanh người chơi. Đề xuất thay ba dòng ấy bằng ba câu dưới, có hình ảnh hơn:

> *Tiếng khóc lúc gần lúc xa, lẫn trong tiếng tre cọ nhau.*
>
> *Gần hơn rồi. Có tiếng nấc sau khóm tre to.*
>
> *Ngay đây. Lá tre dưới đất bị ai ngồi đè lên.*

**Lối bỏ qua (code chưa có):** `Đứng yên nghe cho kỹ` → đốm sáng hiện đúng chỗ bé, không cần dò. Không có thua.

#### 1.5. Bụi tre — gặp bé Na **[BT-1]**

> *Một bé gái ngồi thu lu sau bụi tre, khóc nấc. Hai bàn tay lấm đất.*
>
> ◆ *Bé khóc đã lâu, giọng khản đi.*

- `Ngồi xuống ngang tầm, cho bé bớt sợ`
- `Quát cho nó nín: "Về nhà ngay!"`
- `Đứng xa một chút, chờ bé tự nín`

**Ngồi xuống:**

> *Bé nấc thêm mấy cái rồi ngẩng lên nhìn.*
>
> **Bé Na:** "Con tên Na. Con đi theo đom đóm, rồi trời tối mất."

Bé nắm tay, đi theo.

**Quát:**

> *Bé khóc to hơn. Nhưng khi Người này quay đi, bé lẽo đẽo theo sau, cách ba bước.*

**Đứng xa chờ:**

> *Một lúc sau tiếng khóc nhỏ dần. Bé ló đầu ra, nhìn, rồi rón rén lại gần.*

**Nhịp thẻ:**

| Lựa chọn | Thẻ | Luật | Câu trên thẻ |
|---|---|---|---|
| Ngồi xuống | **Bi** | R3: chủ ý hướng về người đang khổ | *Lúc nãy, Người này thấy bé khóc, ngồi xuống, muốn bé bớt sợ.* |
| Quát | **Sân** | động cơ nằm trong nhãn | *Lúc nãy, Người này nghe bé khóc mãi mà bực, và quát lên.* |
| Đứng xa chờ | không | việc tử tế thường ngày | — |

⚠ **Cần giáo thọ Theravāda duyệt:** việc gắn Bi vào khoảnh khắc "ngồi xuống cho bé bớt sợ". Xem thêm review R-1: người viết đề nghị **cân nhắc không cấp Bi ở đêm 1**.

#### 1.6. Ngõ làng — chị Ba

**Nếu bé đi về vui vẻ (đã dỗ hoặc đã chờ):**

> *Chị Ba chạy ra ôm chầm lấy con, vừa khóc vừa cười.*
>
> **Chị Ba:** "Na! Mẹ tìm con khắp nơi."
>
> **Chị Ba:** "Cảm ơn nhiều lắm. Nhà mới dọn về đầu ngõ, tên `{tên}` phải không?"

- `Đứng lại nhìn hai mẹ con một lát, mừng cho họ`
- `Gật đầu chào rồi đi`

**Nếu đã quát:**

> *Chị Ba ôm lấy con. Bé Na úp mặt vào vai mẹ, không nhìn lại.*
>
> **Chị Ba:** "…Cảm ơn đã đưa cháu về."

- `Nói nhỏ: lúc nãy lỡ to tiếng với bé`
- `Gật đầu rồi đi`

**Nói nhỏ:**

> **Chị Ba:** "Ừ. Nó khóc dai lắm, tôi biết. Về được là mừng rồi."

**Nhịp thẻ:** `Đứng lại nhìn… mừng cho họ` → **Tùy hỷ** (R3), chỉ ở nhánh không quát. Câu thẻ: *Lúc nãy, Người này đứng lại nhìn hai mẹ con gặp nhau và mừng cho họ.* Nhánh quát: **không thẻ**, kể cả khi nhận lỗi (nhận lỗi là việc tốt thường ngày; R8 không cho cặp đối nghịch rơi sát nhau).

**Lần sau:** bé Na vẫy tay khi thấy `{tên}` (nhánh vui), hoặc nấp sau chân mẹ rồi mới ló ra (nhánh quát; hết sau khi gặp ở đêm 6).

#### 1.7. Quay lại gốc gạo

> **Thọ thần:** "Nó về rồi. Ta nghe tiếng cửa đóng."
>
> **Thọ thần:** "Giữ chiếc lá này. Có những thứ, trời tối mới thấy."

- `Nhận chiếc lá`
- `Xin để lá lại trên cây cho nó sáng tiếp`

Cả hai đều được. Nhận thì có vật `la_gao`. Để lại thì chiếc lá ấy sáng lâu hơn các lá khác những đêm sau. Không thẻ.

**Thế giới đổi:** lá gạo sáng lúc chạng vạng những đêm sau.

---

### Đêm 2 — Bà ngoại bên mộ thấp (HG27)

Chuyện này **có thể kéo qua nhiều đêm**. Người chơi dừng ở mốc nào, bà vẫn chờ ở mốc ấy.

**Ưu tiên bản đang triển khai:** các đoạn §2.3–§2.5 bên dưới còn ghi luồng cũ “xới cơm rồi dâng ban đêm” để review câu chữ. Khi dựng nội dung mới, dùng **hai nhịp** ở §2.4 và cảnh nối ngày 3 (§5.8): gặp/nhận lời ban đêm, đặt cơm vào bát sáng hôm sau, trở lại mộ chạng vạng. Câu thẻ Không tham phải nói **phần cơm sáng** nếu người chơi thực sự chia phần của mình. Không dùng luồng cũ cho PC có đồng hồ.

**Việc trong đêm:**

| Loại | Tiêu đề | Dòng mô tả |
|---|---|---|
| Chính | Tiếng khẽ bên mộ thấp | Trời tối, bên ngôi mộ thấp có tiếng ai rất khẽ. |
| Tự chọn | Hỏi bà cụ ở giếng | Bà sống ở làng lâu nhất. |

#### 2.1. Mộ thấp — thấy bà

**Bối cảnh:** trời đã tối, `graves`. Một bóng gầy đứng bên mộ thấp, có tiếng rất khẽ. **Không tự mở.** Người chơi bấm `Đến gần`.

> *Một bóng người gầy đứng bên ngôi mộ thấp. Sương đọng quanh chân bà mà cỏ không ướt.*
>
> **Bà ngoại:** "Có ai còn nhớ đến bà không?"

- `Lại gần hỏi bà cần gì`
- `Đứng yên nghe bà nói`
- `Lùi lại, để hôm khác`

`Lùi lại` không trừ gì, không có câu chê. Đêm sau bóng bà vẫn ở đó.

#### 2.2. Nghe bà kể **[BT-2]**

> **Bà ngoại:** "Bà là bà ngoại của một nhà trong làng. Lâu lắm rồi."
>
> **Bà ngoại:** "Bà đói. Mà cơm người ta để đó, bà không ăn được."
>
> ◆ *Giọng bà nhỏ, đều, như đã nói câu ấy nhiều đêm.*

- `Chưa biết làm sao, nhưng muốn bà bớt đói — nói với bà: "Để con đi hỏi."`
- `Hỏi: ai cho thì bà mới ăn được?`
- `Nghe xong, cúi chào rồi đi`

**Hỏi ai cho:**

> **Bà ngoại:** "Bà không biết. Bà chỉ biết đói."

(Quay lại ba lựa chọn. Bà **không** tự giải thích cách giúp mình; người chơi phải đi hỏi. Xem review R-5.)

**Nhận lời đi hỏi:**

> **Bà ngoại:** "Ừ… Bà chờ. Bà chờ quen rồi."

**Nhịp thẻ:** **Bi** ở `…muốn bà bớt đói…` (R3; mốc 1 của HG27). Câu thẻ: *Lúc nãy, Người này nghe bà kể mình đói và muốn bà bớt khổ.* `Cúi chào rồi đi` → không thẻ; bà vẫn chờ.

**Chuyện đời trước của bà (mở sau, không bắt buộc):** nếu người chơi quay lại mộ khi chưa xong việc, bà nói thêm:

> **Bà ngoại:** "Hồi còn sống, bà giữ gạo kỹ lắm. Ai xin cũng bảo hết rồi."

Đây là **lời NPC tự kể về mình**. PC không nhận thẻ Lận (đã sửa trong code, B1). ⚠ **Cần giáo thọ Theravāda duyệt:** việc nối "tiếc của lúc sống" với "đói lúc này"; câu chữ không được thành lời phán về nghiệp.

#### 2.3. Giếng — hỏi bà cụ, xới cơm

> **Bà cụ:** "Mộ thấp hả… Bà ấy mất lâu rồi. Con cháu đi xa cả."
>
> **Bà cụ:** "Người khuất thì mình đâu đưa cơm tận tay được. Xưa giờ ông bà mình làm vầy: dâng cơm cho một vị sư, rồi gửi phần phước cho người đã mất."
>
> **Bà cụ:** "Bà có nồi cơm mới chín. Con xới một bát đi."

⚠ **Cần giáo thọ Theravāda duyệt:** câu bà cụ giải thích việc cúng dường rồi hồi hướng (nguồn tham chiếu Khp 7 / Pv 1.5 đã ghi ở [HG27 §3.5](human-world-early-mysteries-and-peta-quest.md)). Bà nói như người làng nói, không phải trích kinh.

**Xới cơm:** ba chạm, mỗi chạm một muỗng. Không điểm, không thua.

> *Cơm đầy bát, còn bốc khói.*
>
> *Trong túi Người này còn nắm cơm để dành cho bữa tối.*

- `Mang bát cơm của bà cụ đi`
- `Sẵn lòng để phần cơm tối của mình vào bát, không giữ riêng` (buổi sáng trên đồng hồ: `Sẵn lòng để phần cơm sáng của mình vào bát, không giữ riêng`)

**Nếu sớt phần mình:**

> **Bà cụ:** "Ơ, vậy tối con ăn gì?"
>
> **Bà cụ:** "…Ừ. Vậy bát cơm này có hai nhà góp."

Bà **không** bù lại bằng củ khoai hay bát canh. Cái giá phải có thật thì lựa chọn mới có nghĩa (R5; xem review R-6). Về sau trong đêm, một câu kể nhẹ: *Bụng Người này réo một tiếng. Cũng không sao.*

**Lối bỏ qua:** `Để sau` ở mọi bước; bát cơm (nếu đã nhận) vẫn trong túi.

#### 2.4. Giữa các ngôi mộ — vị sư già

> *Vị sư già ngồi yên giữa các ngôi mộ, như đã ngồi đó từ trước khi trời tối.*

- `Dâng bát cơm, kể chuyện bà bên mộ thấp`
- `Đứng chờ sư mở mắt`
- `Để sau`

> **Sư già:** "Sư nhận."
>
> **Sư già:** "Phước này là của con. Con muốn gửi cho ai?"

- `Cùng hồi hướng: mong bà được no, được yên`

Ba nhịp thở chậm (không bấm liên tục).

> **Sư già:** "Phần phước này, xin gửi tới bà ngoại bên mộ thấp. Mong bà được no, được an."

⚠ **Cần giáo thọ Theravāda duyệt — điểm nặng nhất của cả kịch bản:**

1. Câu hồi hướng ở trên.
2. **Dâng cơm cho sư vào ban đêm.** Người viết e rằng việc này không hợp giờ thọ thực và việc không cất giữ vật thực qua đêm của tỳ-khưu Theravāda. Code hiện có cũng đang để sư nhận cơm ban đêm. Xem review **R-2** và **bản hai nhịp** ngay dưới.

**Bản hai nhịp (chủ project đã chọn ngày 2026-11-12; đã vào `develop` tại `5e8ea9a`):**

- *Đêm:* gặp bà, nhận lời (Bi). Bà cụ ở giếng: "Giờ này sư không nhận cơm đâu con. Sáng mai sư đi ngang ngõ, con đặt vào bát."
- *Sáng hôm sau (ban ngày):* sư già ôm bát đi ngang ngõ. `Đặt cơm vào bát, sớt cả phần sáng của mình` (Không tham) → sư dừng lại, hồi hướng.
- *Chạng vạng hôm ấy:* người chơi ra mộ thấp; cảnh bà sáng lên (2.5) diễn ra ở đây.

Nhân vật legacy chưa có đồng hồ tạm giữ luồng một đêm. Câu chữ và việc dâng cơm vẫn chờ giáo thọ Theravāda duyệt.

Bản này cho ban ngày một việc **có nghĩa**, và đúng với ý "HG27 có thể trải qua hơn một đêm".

#### 2.5. Bà sáng lên

Không hộp thẻ nào che cảnh này.

> *Bà ngoại ngẩng lên. Lần đầu tiên, mặt bà có nét yên.*
>
> **Bà ngoại:** "Bà nhận được rồi… Cảm ơn con."
>
> *Cái bóng gầy sáng dần, rồi tan vào ánh trăng.*

- `Đứng lại nhìn cho tới khi ánh trăng tan, mừng cho bà`
- `Chắp tay rồi đi`

Sau một khoảng lặng:

> *Bà không còn ở đó nữa. Chỗ bà đứng chỉ còn gió và một chiếc lá.*

⚠ **Cần giáo thọ Theravāda duyệt:** lời kể chỉ nói "bà được yên", "bà không còn ở đó". **Không** nói bà đi đâu, không nói siêu thoát, không nói giải thoát. Câu "Lành thay, lành thay…" bà nói trong code hiện có: đề nghị đổi thành câu cảm ơn ở trên; nếu giữ "Lành thay" thì cần thầy duyệt.

**Nhịp thẻ (ghi đúng mốc, tổng kết một màn sau khoảng lặng):**

| Mốc | Điều kiện | Câu trên thẻ |
|---|---|---|
| **Bi** | đã chọn đi hỏi cách giúp (2.2) | *Lúc nãy, Người này nghe bà kể mình đói và muốn bà bớt khổ.* |
| **Không tham** | đã sớt phần cơm của **mình** và đã hồi hướng (R5) | *Lúc nãy, Người này sớt phần cơm sáng của mình vào bát để gửi phước cho bà.* (luồng có đồng hồ) |
| **Tùy hỷ** | đã chọn đứng lại nhìn (R3) | *Lúc nãy, Người này đứng lại nhìn bà được yên và mừng cho bà.* |

Chỉ mang bát cơm của bà cụ đi: **không** có Không tham. Chắp tay rồi đi: **không** có Tùy hỷ. Thẻ đã có từ đêm 1 thì chỉ hiện "gặp lại" (R11).

**Lần sau / thế giới đổi:** mộ thấp yên, không còn bóng bà. Khi quay lại:

> *Mộ thấp yên. Cỏ quanh đó đã ướt sương, như mọi chỗ khác.*

- `Đứng lặng một lát` · `Đi tiếp`

Bà cụ ở giếng, lần gặp sau: "Đêm qua bà ngủ ngon lạ. Chắc tại hết nghe tiếng đó."

---

### Đêm 3 — Nắm rau má và chiếc gáo

**Việc trong đêm:**

| Loại | Tiêu đề | Dòng mô tả |
|---|---|---|
| Chính | Nồi canh của bà cụ | Bà cụ ngồi bên cái thúng trống ngoài giếng. |
| Phụ | Cái gáo lỏng cán | Nước cứ đổ ra mép thùng. |
| Tự chọn | Chiếc xe mắc bánh | Có xe hàng dừng mãi ngoài đường làng. |

#### 3.1. Giếng — bà cụ nhờ (HG05)

Bấm `Hỏi bà đang làm gì`.

> **Bà cụ:** "Bà tính nấu nồi canh rau má, mà cái chân lại đau."

- `Chân bà đang đau — để con hái giúp một nắm`
- `Hỏi rau má mọc ở đâu`
- `Chúc bà mau hết đau chân, rồi đi`

> **Bà cụ:** "Vậy thì quý quá. Một nắm vừa tay là đủ nồi."

`Hỏi rau má mọc ở đâu` → "Gốc mít cuối làng. Mọc dày như thảm." (không tính là nhận lời). `Chúc bà… rồi đi` → không có lời hứa nào được ghi.

**Hệ quả:** `grannyHerbs=accepted` chỉ khi chọn nhãn đầu.

#### 3.2. Gốc mít — hái rau **[BT-3]**

> *Rau má mọc quanh gốc mít, lá tròn như đồng xu.*

(Hái: mini game có sẵn.)

> *Được một nắm rau má xanh mướt, còn dính sương.*
>
> ◆ *Nắm rau vừa một bàn tay, đúng như bà dặn.*

- `Mang trọn nắm rau về cho bà, như đã nhận lời`
- `Bớt lại một nửa cho nồi nhà mình, đưa bà phần còn lại`
- `Cất rau vào túi, đi dạo một vòng rồi mang về sau`

**Không có** lựa chọn mang rau sang ông Tư.

**Nhịp thẻ:**

| Lựa chọn | Thẻ | Câu trên thẻ |
|---|---|---|
| Mang trọn | không (giữ lời là việc tốt thường ngày) | — |
| Bớt một nửa | **Tham** | *Lúc nãy, Người này thấy rau non, tiếc, và giữ lại một nửa cho mình.* |
| Cất, đi dạo | không | — |

⚠ **Cần giáo thọ Theravāda duyệt:** kế hoạch ghi "Lận hoặc Tham". Người viết chọn **Tham**: nắm rau chưa phải của Người này để mà "tiếc không chia", và Lận trong bảng tâm sở thuộc nhóm sân phần. Xin thầy quyết.

#### 3.3. Trả rau

**Mang trọn:**

> **Bà cụ:** "Chà, non quá. Nồi canh hôm nay ngọt phải biết."

**Chỉ một nửa:**

> *Bà nhìn nắm rau, rồi cười.*
>
> **Bà cụ:** "Ừ, chừng này cũng được một bát."

Bà **không** trách, không hỏi. Lần gặp sau có thêm lựa chọn `Đưa nốt phần rau đã giữ` → "Bà đâu có đếm. Mà thôi, bỏ vô nồi cho ngọt." Không thẻ.

**Thế giới đổi:** nồi canh trên bếp bà; khói bếp có ở những đêm sau. **Lần sau:** "Canh hôm bữa còn nhắc tới giờ."

#### 3.4. Cái gáo (HG25, M2)

Bấm `Hỏi bà có cần giúp không`.

> **Bà cụ:** "Cái gáo theo bà bao năm rồi. Nay nó lỏng cán, múc là nghiêng."

- `Chêm lại cái cán cho bà đỡ đổ nước`
- `Ngồi nghe tiếng nước một lát`
- `Để hôm khác`

**M2 (đặt nêm vào đúng chỗ, kéo thả, không canh giờ):**

> *Cán gáo hết lắc. Bà múc thử một gáo, nước không sánh giọt nào.*
>
> **Bà cụ:** "Nhẹ hẳn. Tay con khéo đó."

Không thẻ. `Để hôm khác` chỉ thành lời hứa nếu người chơi chọn thêm `Hứa mai quay lại`; không thì bà tự nhờ người khác sau hai đêm.

**Lần sau:** "Cái gáo con sửa, bà dùng tới giờ." Ông Tư có thể nhắc: "Gáo ngoài giếng ai sửa mà chắc vậy?"

#### 3.5. Chiếc xe mắc bánh (HG13, tự chọn)

> **Ông lái buôn:** "Bánh xe sụp ổ gà rồi. Một mình tôi đẩy không nổi."

- `Thấy ông loay hoay, ghé vai đẩy giúp`
- `Chỉ ông lối vòng khô hơn`
- `Đi tiếp`

> *Xe nhích lên, rồi lăn khỏi ổ gà.*
>
> **Ông lái buôn:** "Đội ơn. Tôi đi nhiều làng, làng nào cũng có một người chịu ghé vai."
>
> **Ông lái buôn:** "À, chiều qua ngang cổng nghĩa địa, tôi thấy đốm đèn sau tảng đá lớn. Không phải đèn nhà ai đâu."

(Mầm cho HG14.) Ông mời một cái bánh đa: `Nhận, cảm ơn` · `Xin thôi`. **Không thẻ** ở cả hai (B4).

#### 3.6. Khám phá

- **Đóm vàng — khăn cũ (`fv_scarf`):** *Một chiếc khăn vắt trên cọc rào, bạc màu nắng. Ai đó quên nó đã mấy mùa.* → `Vuốt lại cho ngay` · `Để yên`.
- **Đóm xanh — trăng trên bia đá (HG11):** *Bóng tre đổ dài qua bia đá. Một con đom đóm bay lơ lửng, như chiếc đèn nhỏ không ai cầm.* Nếu HG27 đã xong, thêm: *Nó đậu xuống ngôi mộ thấp, rồi tắt.*

---

### Đêm 4 — Ngõ có đèn và con Vàng

**Việc trong đêm:**

| Loại | Tiêu đề | Dòng mô tả |
|---|---|---|
| Chính | Khúc quanh tối | Ông Tư đứng nhìn mãi một cái cọc ở đầu ngõ. |
| Phụ | Con chó vàng | Có con chó sủa người lạ sau hàng rào. |
| Tự chọn | Nhìn làng từ bụi tre | Từ xa, làng trông ra sao lúc lên đèn? |

#### 4.1. Con Vàng (HG23) **[BT-4]**

**Bối cảnh:** `village`, đầu hôm. Chó sủa là âm thanh nền; **không cắn, không chặn đường**. Bấm `Nhìn con chó` mới mở.

> *Một con chó vàng lao ra sát hàng rào, sủa dồn.*
>
> **Ông Tư:** "Vàng! Vô hiên!"
>
> **Ông Tư:** "Nó gặp người lạ là làm ầm lên. Đừng lo, tôi giữ rồi."
>
> ◆ *Con Vàng vẫn gừ nhỏ sau chân ông, mắt không rời Người này.*

- `Ngồi thấp xuống, chờ cho nó quen hơi`
- `Quát cho nó im: "Đi chỗ khác!"`
- `Hỏi ông Tư về con Vàng`
- `Đi vòng lối khác cho yên chuyện`

**Ngồi thấp (tương tác: chờ, rồi chìa tay):**

> *Con Vàng thôi sủa. Nó vươn cổ ngửi bàn tay, rồi hắt hơi một cái.*
>
> **Ông Tư:** "Hừ. Nó chịu rồi đó. Hiếm à nghe."

**Quát:**

> *Con Vàng lùi một bước, sủa to hơn.*
>
> **Ông Tư:** "Thôi. Nó là chó mà. Vô hiên, Vàng."

Ông không giảng, không giận. Ông chỉ dắt chó vào.

**Hỏi về con Vàng:**

> **Ông Tư:** "Nó tự tới hồi còn bằng nắm tay. Đuổi không đi, thì nuôi."

**Nhịp thẻ:**

| Lựa chọn | Thẻ | Câu trên thẻ |
|---|---|---|
| Quát | **Sân** | *Lúc nãy, Người này bị chó sủa, nóng mặt, và quát nó.* |
| Ngồi thấp (lần đầu) | không | — |
| Lần gặp **sau**, khi lần trước đã quát: `Lần trước lỡ quát nó — lần này ngồi xuống, chờ nó lại gần` | **Không sân** (R8: hai khoảnh khắc khác nhau, khác đêm) | *Lúc nãy, Người này nhớ lần trước đã quát con Vàng, và lần này ngồi xuống chờ nó.* |

⚠ **Cần giáo thọ Theravāda duyệt:** điều kiện của Không sân ở trên. Xem review R-4 (thẻ thiện này **chỉ** tới tay người đã chọn quát trước đó).

**Lần sau:** `dogMeeting=calm` → con Vàng nằm yên, vẫy đuôi. Ông Tư: "Hôm nay nó hiền hơn bữa trước rồi."

#### 4.2. Ngọn đèn (HG21, M2)

**Bối cảnh:** ông Tư đứng xem cái cọc cũ ở khúc quanh, tay cầm chiếc đèn. Bấm `Hỏi ông về ngọn đèn`.

> **Ông Tư:** "Khúc này tối. Người về muộn khó thấy bậc đá."

(Nếu đêm nay người chơi chọn `Dò từng bước qua khúc tối` ở cảnh mở: "Thấy chưa. Khúc này phải có cái đèn.")

> **Ông Tư:** "Tính treo, mà chưa biết chỗ nào khỏi chói nhà bên."

- `Phụ ông treo đèn, cho người về muộn thấy đường`
- `Chỉ ông chỗ treo khuất mắt nhà bên`
- `Ngắm lối nhỏ một lát rồi đi`

**M2 (hai cái móc; đặt đèn lên móc nào cũng được, mỗi móc sáng một kiểu):**

> *Đèn lên. Bậc đá hiện ra, từng bậc một.*
>
> **Ông Tư:** "Được rồi. May có người góp tay."
>
> *Con Vàng ra nằm ngay giữa vòng sáng, như thể đèn treo cho nó.*

Không thẻ. Đèn là của ông; không có gì vào túi PC.

**Bỏ qua:** ông tự treo sau hai đêm. **Lần sau:** "Hôm qua có người gánh hàng về khuya, khen cái đèn. Tôi nói có người phụ treo."

#### 4.3. Từ bụi tre nhìn lại (tự chọn)

> *Từ bụi tre nhìn lại, cả ngõ chỉ còn một đốm vàng nhỏ.*
>
> *Nhỏ vậy thôi, mà biết đường về.*

- `Đứng nhìn thêm một lát` · `Về`

Một dòng Sổ. Đóm vàng **đèn cũ (`fv_lamp`)** gần đó: *Một chiếc đèn bão han gỉ nằm trong bụi. Bấc đã mục, nhưng bầu đèn còn nguyên.* → `Lau bụi trên bầu đèn` · `Để yên`.

---

### Đêm 5 — Ba bát xôi (1)

**Việc trong đêm:**

| Loại | Tiêu đề | Dòng mô tả |
|---|---|---|
| Chính | Mùi nếp trong ngõ | Nhà ông Tư đồ xôi, mà ông ngồi im bên nồi. |
| Phụ | Cái giỏ bên rào | Một giỏ ổi chín, không thấy chủ. |
| Tự chọn | Bóng cây gạo | Chiều tàn, bóng cây kéo dài về phía nghĩa địa. |
| Khám phá | Chuyện hoa trời ở Tháp Cổ | Lên đồi xem tháp và nghe lời đồn về lối lên mây (§5.9). |

#### 5.1. Giếng — bà cụ nhắc người bán xôi (HG06 lượt 1)

Bấm `Chào bà`.

> **Bà cụ:** "Mùi nếp này làm bà nhớ bà bán xôi năm trước. Xôi bà ấy, nửa làng ăn chịu."

- `Hỏi thêm về người bán xôi`
- `Nghe vậy rồi để đó`

> **Bà cụ:** "Bà ấy không còn nữa, từ mùa nước lớn. Nhiều người chưa kịp trả tiền xôi."

Bà **không** nêu tên, không kể chuyện con cái của người bán xôi (đó là mạch khác, người chơi tự lần ra sau).

#### 5.2. Hiên nhà ông Tư (HG06 lượt 2)

> *Ông Tư ngồi bên nồi xôi mới đồ. Đũa cầm trên tay mà không xới.*

Bấm `Chào ông`.

> **Ông Tư:** "Gì đó? Nồi xôi thôi, có gì mà nhìn."

(Nếu `helpedLamp`: "À, người treo đèn. …Nồi xôi thôi, có gì mà nhìn.")

- `Ngồi xuống bậc thềm, không hỏi gì — cho ông đỡ ngồi một mình`
- `Hỏi thẳng: ông nấu cho ai mà nhiều vậy?`
- `Xin lỗi đã làm phiền, rồi đi`

**Ngồi xuống:**

> *Một lúc lâu. Con Vàng ra nằm giữa hai người.*
>
> **Ông Tư:** "…Tôi còn nợ người ta ba bát xôi."
>
> **Ông Tư:** "Mà người ta không còn để tôi trả."

**Hỏi thẳng:**

> **Ông Tư:** "Hỏi chi lắm."
>
> *Rồi ông nói nhỏ hơn:* "Nấu cho người tôi còn nợ."

**Sau cả hai nhánh, thêm một lựa chọn:** `Hỏi: rồi ông định làm gì với nồi xôi?`

> **Ông Tư:** "Chưa biết. Chắc phải bắt đầu từ việc nhớ cho rõ."

**Hệ quả:** `ongTu.xoi=heard`, kèm cách đáp `sat | asked | left`. Không thẻ: PC đang nghe chuyện của NPC. **Lần sau:** `sat` → ông chỉ bậc thềm: "Ngồi đi." `asked` → "Lại hỏi nữa hả?" (nhưng vẫn kể). `left` → ông gật đầu, không nói; lượt 3 vẫn mở.

#### 5.3. Cái giỏ bên rào (HG07)

> *Một giỏ ổi chín để cạnh hàng rào, không ai trông. Quai giỏ buộc một sợi lạt nhuộm đỏ.*
>
> *Người này đi từ chiều chưa ăn gì, bụng đang cồn cào.*

- `Giỏ đầy thế kia, chắc không ai biết — lấy một trái ăn đỡ đói`
- `Đói thì đói, không lấy của không phải của mình — xách giỏ đi tìm chủ`
- `Để giỏ nguyên đó, đi tiếp`

**Lấy một trái:**

> *Ổi giòn, ngọt. Cái giỏ vẫn đầy như chưa mất gì.*

**Xách đi tìm chủ:** sợi lạt đỏ dẫn tới người bán trái cây ở cổng làng.

> **Người bán trái cây:** "Trời, tôi để quên từ trưa! Cầm hai trái đi, đừng từ chối."

- `Nhận, cảm ơn` · `Xin thôi, tiện đường thì mang giúp`

**Nhịp thẻ:**

| Lựa chọn | Thẻ | Luật | Câu trên thẻ |
|---|---|---|---|
| Lấy một trái | **Tham** | động cơ trong nhãn | *Lúc nãy, Người này đang đói, thấy giỏ ổi không ai trông, và lấy một trái.* |
| Xách đi tìm chủ | **Chánh nghiệp** (thẻ mới) | R4: có cơ hội lấy thật, và đã kiêng | *Lúc nãy, Người này đang đói mà không lấy trái ổi không phải của mình.* |
| Để nguyên, đi tiếp | không | không lấy nhưng nhãn không mang ý kiêng | — |

Thẻ ghi **lúc kiêng**, không phải lúc được cảm ơn. Nhận hay từ chối hai trái ổi đều không đổi gì.

⚠ **Cần giáo thọ Theravāda duyệt:** thẻ Chánh nghiệp và điều kiện R4; nhất là nhánh `Để giỏ nguyên đó` (cũng là không lấy) có nên được coi là kiêng hay không.

**Nếu đã lấy một trái**, lần gặp người bán sau đó:

> **Người bán trái cây:** "Hình như thiếu một trái. Chắc chim ăn."

- `Nói thật: trái đó là mình ăn` → "Có trái ổi mà cũng nói. Ăn thêm trái nữa đi." (không thẻ)
- `Im lặng`

#### 5.4. Bóng cây gạo — lượt 1 (HG24, tự chọn)

> *Bóng cây gạo kéo dài tới con đường men nghĩa địa.*
>
> *Đứng trong bóng cây, thấy mát hơn chỗ khác một chút.*

- `Đi theo bóng cây một đoạn` · `Về`

#### 5.5. Đốm đèn nơi xa (HG14, đóm xanh)

> *Sau tảng đá lớn có một đốm sáng rất nhỏ. Không lay, không tắt.*

- `Đứng nhìn cho rõ` → *Lại gần thì không thấy đèn. Chỉ có gió lạnh thổi ra từ khe đá.*
- `Để lúc khác`

---

### Đêm 6 — Ba bát xôi (2)

**Việc trong đêm:**

| Loại | Tiêu đề | Dòng mô tả |
|---|---|---|
| Chính | Lá chuối ngoài hiên | Ông Tư gói xôi. Nhiều hơn một nhà ăn. |
| Phụ | Bức tranh của bé Na | Bé Na vẽ gì đó trên sân từ chiều. |
| Phụ (cần duyệt) | Chuyện ngoài giếng | Có người hỏi về ông Tư. |

#### 6.1. Gói xôi (HG06 lượt 3, M3)

Bấm `Hỏi ông gói xôi cho ai`.

Nếu PC **chưa** nghe lượt 2 ở §5.2, ông chỉ nói câu đầu về các nhà đang khó; câu "trả không được cho người cũ" đợi một lần ông tự kể sau. Không lấy lịch đêm làm bằng chứng PC đã biết món nợ.

> **Ông Tư:** "Đem cho mấy nhà đang khó. Trả không được cho người cũ thì trả cho người khác."

- `Phụ ông gói, cho xôi còn nóng khi tới tay người ta`
- `Hỏi ông đem cho những nhà nào`
- `Chúc ông gói xong sớm, rồi đi`

**M3 (gấp lá, đặt xôi, buộc lạt; không tính giờ):**

> **Ông Tư:** "Gói lỏng tay thôi. Xôi cũng cần thở."
>
> *Ba gói đầu hơi méo. Tới gói thứ tư thì ra dáng.*
>
> **Ông Tư:** "Mười hai gói. Ba gói này cho nhà cuối xóm, nhà đó đông con."

Sau đó, tự chọn: `Xách giúp ông một nửa, đi giao cùng` · `Để ông đi một mình`.

Không thẻ ở bước gói (xôi là của ông; R5). **Bỏ qua:** ông tự gói, tự đi; đêm sau ông vẫn kể lượt 4.

**Hệ quả:** `ongTu.xoi=shared`, `pc.helpedWrap`. **Lần sau:** "Nhà cuối xóm hỏi ai gói mà đẹp vậy. Tôi nói có người phụ."

#### 6.2. Giếng — bà cụ khen nồi xôi **[BT-5]**

**Bối cảnh:** sau khi xôi được chia. Bấm `Chào bà`.

> **Bà cụ:** "Xôi nhà ông Tư năm nay dẻo thiệt. Cả xóm khen ổng mát tay."
>
> ◆ *Bà nói rồi cười, gói xôi còn ấm trên tay.*

- `Nói thật lòng: mừng cho ông Tư, ông làm được việc ông muốn làm`
- `Nhắc khéo: con cũng có phụ gói đó bà` (chỉ hiện khi `pc.helpedWrap`)
- `Im lặng nghe bà nói`

**Mừng cho ông:**

> **Bà cụ:** "Ừ. Lâu rồi mới thấy ổng nhẹ mặt vậy."

**Nhắc khéo:**

> **Bà cụ:** "Vậy hả! Hèn chi gói đẹp."

(Nói thật một điều có thật. Không thẻ, không chê.)

**Nhịp thẻ:**

| Nguồn | Thẻ | Điều kiện |
|---|---|---|
| Lời kể ◆ (xem BT-5) | **Tật** (thẻ mới) | `carita` tham hoặc sân |
| Lời kể ◆ (xem BT-5) | **Ngã mạn** (thẻ mới) | `carita` tầm |
| `Nói thật lòng: mừng cho ông Tư…` | **Tùy hỷ** (R3) | mọi `carita`; ghi **sau** nhịp lời kể, là khoảnh khắc khác (R8) |

Câu trên thẻ:
- Tật: *Lúc nãy, Người này nghe ông Tư được khen và thấy chạnh lòng.*
- Ngã mạn: *Lúc nãy, Người này nghe khen xôi và nghĩ: dẻo là nhờ tay mình.*
- Tùy hỷ: *Lúc nãy, Người này nói lời mừng cho ông Tư, thật lòng.*

Thẻ bất thiện từ lời kể hiện **nhẹ, sau khi cảnh đóng**, không chặn lựa chọn.

⚠ **Cần giáo thọ Theravāda duyệt:** Tật và Ngã mạn (đặc tính, phân biệt với Tham); việc Tật rồi Tùy hỷ nối nhau trong cùng một cảnh; việc gán Tật cho tính tham. Xem review R-3.

#### 6.3. Chuyện ngoài giếng (storylet mới — chờ chủ project quyết có làm không)

**Điều kiện:** đã nghe lượt 2 (`ongTu.xoi=heard`). **Bối cảnh:** một người gánh nước, không tên, đang chờ tới lượt múc.

> **Người gánh nước:** "Nghe nói ông Tư nấu xôi đem cho là để chuộc lỗi gì đó. Hồi xưa ổng quỵt nợ ai phải không?"
>
> *Người này biết một chút: ông có nhắc ba bát xôi. Chỉ vậy.*

- `Thêm thắt cho câu chuyện rôm rả: "Nghe đâu nợ nhiều lắm…"`
- `Chỉ nói điều mình thấy: ông gói xôi đem cho mấy nhà khó, vậy thôi`
- `Cười trừ, xách nước đi`

**Thêm thắt:**

> **Người gánh nước:** "Thiệt hả! Hèn chi…"

Hai đêm sau, ông Tư: "Ngoài giếng người ta nói tôi nợ cả làng." Ông nhìn một cái, rồi thôi. (Không thẻ ở kế hoạch v0.2; hệ quả là quan hệ.)

**Chỉ nói điều mình thấy:**

> **Người gánh nước:** "Ờ. Vậy thì có gì đâu mà đồn."

**Nhịp thẻ:** `Chỉ nói điều mình thấy…` → **Chánh ngữ** (thẻ mới, R4: có cơ hội nói thêm, và đã kiêng). Câu thẻ: *Lúc nãy, Người này có dịp kể thêm chuyện ông Tư, và chỉ nói điều mình thấy.* `Cười trừ` → không thẻ.

⚠ **Cần giáo thọ Theravāda duyệt:** thẻ Chánh ngữ và điều kiện. ⚠ Lore: chữ "quỵt nợ" là lời đồn của người làng, **không** phải sự thật về ông Tư; cần chủ project duyệt vì đây là chuyện mới.

#### 6.4. Bức tranh của bé Na (HG09)

> *Bé Na ngồi bệt trên sân, vẽ bằng than lên tấm mo cau.*

Bấm `Xem tranh`.

> **Bé Na:** "Con vẽ cây gạo. Mấy cái này là lá sáng."

Bé chỉ một hình người nhỏ dưới gốc cây:

- nhánh đã dỗ / đã chờ: **Bé Na:** "Còn đây là người dắt con về."
- nhánh đã quát: **Bé Na:** "Còn đây là người la con. Mà cũng dắt con về."
- chưa từng tìm bé: **Bé Na:** "Còn đây là bà ở trong cây. Mẹ nói con tưởng tượng."

> **Chị Ba:** "Nó vẽ suốt từ bữa đó. Tôi tính treo lên vách."

- `Khen tranh, hỏi bé còn vẽ gì nữa`
- `Xin ngồi xem bé vẽ một lát`
- `Đi tiếp`

Không thẻ. **Thế giới đổi:** tranh treo trên vách nhà chị Ba. Ở nhánh đã quát, sau cảnh này bé Na thôi nấp sau chân mẹ.

---

### Đêm 7 — Điều chưa nói

**Việc trong đêm:**

| Loại | Tiêu đề | Dòng mô tả |
|---|---|---|
| Chính | Hiên nhà ông Tư | Nồi xôi đã rửa. Ông vẫn ngồi ngoài hiên. |
| Phụ | Một trang kinh còn mở | Chỉ hiện nếu Người này đã thử ngồi yên và thấy khó. |
| Tự chọn | Bóng cây gạo, đêm trăng | Lần này là ban đêm. |

#### 7.1. Điều chưa nói (HG06 lượt 4) **[BT-6]**

Nếu PC chưa từng nghe ông Tư nhắc ba bát xôi, cảnh này là một lời chào bên hiên; đoạn kể dưới đây giữ lại cho lần gặp sau khi ông đã tự mở chuyện. Không bắt người chơi hoàn tất tuyến xôi để qua ngày 7.

> *Ông Tư ngồi ngoài hiên. Nồi xôi đã rửa, úp bên cạnh.*

Bấm `Ngồi xuống bậc thềm`.

> **Ông Tư:** "Hồi nhỏ nhà tôi đói. Có người bán xôi cho tôi ăn chịu, ba lần."
>
> **Ông Tư:** "Tôi chưa kịp trả. Cũng chưa kịp nói cảm ơn."
>
> ◆ *Ông nói xong thì nhìn ra ngõ, chỗ ngọn đèn.*

- `Ngồi im với ông — ông vừa nói được một điều khó nói`
- `Hỏi nhẹ: người bán xôi đó là ai vậy ông?`
- `Chào ông, ra ngõ ngắm đèn`

**Ngồi im:**

> **Ông Tư:** "Ừ. Vậy thôi."
>
> **Ông Tư:** "…Mai ghé. Tôi còn ít nếp."

**Hỏi nhẹ:**

> **Ông Tư:** "Để bữa khác. Nói một lần chừng này là nhiều rồi."

**Không thẻ ở bất kỳ nhánh nào.** Đây là chuyện của ông Tư. Phần thưởng là ông mời ghé.

**Lần sau:** ông để sẵn một chén xôi nhỏ ngoài bậc thềm những đêm PC đi ngang. Câu hỏi "người bán xôi là ai" vẫn treo; nó thuộc mạch bà Sáu, **không** giải ở bảy đêm này.

#### 7.2. Một trang kinh còn mở (HG03)

**Điều kiện:** PC đã tự thử ngồi (hoạt động `sit`) ít nhất một lần và bị gián đoạn. Không đủ điều kiện thì cảnh này **không hiện**; kệ sách vẫn ngắm được.

**Bối cảnh:** vị sư già (cùng vị ở đêm 2). Bấm `Chào sư`.

> **Sư già:** "Ngồi mới một lát mà đã nghĩ tới chuyện khác rồi à?"

- `Hỏi: lúc ngồi cứ buồn ngủ, nghĩ lung tung, thì làm sao?`
- `Cười, ngồi thêm với sư một lát`
- `Chào sư rồi đi`

> **Sư già:** "Ai ngồi cũng gặp. Người xưa có đặt tên cho từng thứ cản đường như vậy."
>
> **Sư già:** "Trong tịnh thất có một trang nói về nó. Muốn thì đọc. Không thì đi vài bước cho tỉnh."

- `Đọc một đoạn bây giờ`
- `Nhờ ghi lại để đọc lúc vắng`
- `Đi vài bước cho tỉnh`

**Hệ quả:** chỉ ghi `knowledge:five_hindrances_01=heard` vào khu **Đã học** của Sổ Hành Trình. **Không thẻ tâm.** ⚠ **Cần giáo thọ Theravāda duyệt:** lời sư già (là lời đời thường do game viết, không phải trích kinh) và bản tóm ý năm triền cái trong Sổ.

#### 7.3. Bóng cây gạo — đêm trăng (HG24 lượt 3, tự chọn)

> *Đom đóm thấp thoáng giữa các rễ cây. Lá vẫn rơi rất khẽ.*
>
> *Chiếc lá sáng lâu nhất đêm nay nằm ở cành thấp, vừa tầm tay.* (chỉ khi đã `Xin để lá lại trên cây` ở đêm 1)

- `Ngồi dưới gốc cây một lát` · `Về`

#### 7.4. Dòng Sổ "Bảy đêm ở làng"

Không huy hiệu, không điểm. Mỗi dòng chỉ hiện nếu việc ấy có thật:

> *Một đứa bé về được nhà.* · *Mộ thấp đã yên.* · *Bà cụ có nồi canh và cái gáo chắc cán.* · *Ngõ có đèn.* · *Mười hai gói xôi tới mười hai nhà.* · *Ông Tư nói được một điều chưa nói.*

Nếu không có dòng nào: *Bảy đêm đi dạo. Làng vẫn ở đó, không vội.*

### 5.8. Bảy ngày nối giữa bảy đêm

**Phạm vi:** PC người dân, `player_arrival`; đây là các **cảnh nối** của HG05, HG06, HG12, HG20, HG21, HG23, HG24, HG25, HG26, HG27, không mở quest mới. Ngày 1 là buổi sáng vừa tới làng; ngày 2–7 bắt đầu sau lần bấm **Kết thúc đêm** tương ứng. Nếu người chơi kết đêm sớm, đi vắng hoặc bỏ qua truyện, cảnh nối vẫn có chữ phù hợp. Không ghim một nhiệm vụ vào đúng ngày lịch: HG27 có thể đi chậm hơn, và các việc khác không đợi PC để NPC được sống.

**Luật dựng:** từ xa chỉ thấy/sờ được dấu cảnh; bấm vào nơi hoặc người mới mở thoại. Mỗi khung tối đa hai câu. Mỗi cảnh có `Đi tiếp`/`Để sau`; không tự bật popup, không có thẻ tâm từ nghe kể, ngắm cảnh, thời gian trôi hoặc làm việc đúng cách. Ký ức và mốc xem lại thuộc **một Sổ Hành Trình theo `characterId`**. Các khóa dưới đây là gợi ý thiết kế, không phải API đã có.

**Phạm vi bản chơi trong PR #46.** Ngày sau khi kết đêm lấy theo ngày trong truyện. Ở ngày đầu, người chơi có thể chọn ngồi dưới gốc gạo đến chiều tàn. Cán gáo và treo đèn dùng lựa chọn trên từng màn. Gói xôi có ba thao tác, sau đó người chơi có thể mang xôi đến hai điểm hoặc để Ông Tư đi giao. Biến thể tính cách, thẻ mới, chuyện đồn ở giếng và giao đọc kinh khi vắng vẫn là nội dung mở rộng. Phần tóm ý HG03 trong bản chơi tham chiếu [AN 5.51](https://www.dhammatalks.org/suttas/AN/AN5_51.html).

| Ngày | Dấu sáng, không thành popup | Cảnh người chơi có thể mở | Trả về đêm |
|---|---|---|---|
| 1 | Sương đầu ngõ, tiếng gàu ở giếng | chào bà cụ; xem bóng gốc gạo lúc sáng (HG24 lượt 1) | lá gạo sáng khi chạng vạng, bé Na trong tre |
| 2 | chị Ba quét sân; con Vàng nằm xa dưới hiên | hỏi thăm bé Na nếu đã gặp, hoặc xem ngõ làng (HG20) | tiếng khẽ ở mộ thấp, HG27 |
| 3 | bát của sư già đi ngang ngõ **nếu đã tới mốc HG27** | dâng cơm vào buổi sáng; bà cụ bên giếng, rau má (HG05) | bà ngoại ở mộ khi chạng vạng; gáo lỏng cán |
| 4 | giếng có nồi canh hoặc thúng rau trống | bà nhớ việc đã làm/chưa làm; xem chiếc gáo (HG25) | khúc quanh tối, con Vàng, đèn (HG21/HG23) |
| 5 | bậc đá lộ rõ nếu có đèn | xem ngõ sau một đêm; hỏi bà cụ chuyện xôi nếu muốn (HG06 lượt 1) | nồi xôi nhà ông Tư, lời ông chưa nói |
| 6 | lá chuối xếp ngoài hiên, người đi chợ ngang ngõ | ông Tư đang chuẩn bị, người chơi có thể hỏi hoặc đi | cùng ông gói/chia xôi nếu nhận lời (HG06 lượt 3) |
| 7 | dấu gói xôi đã tới nhà hoặc ông tự đi phát | một lời nhận ra từ người làng, ngắm gốc gạo (HG24 lượt 2) | hiên ông Tư và câu chuyện còn mở |

#### Ngày 1 — Người mới và bóng cây lúc sáng

**Nơi:** `village → well → gao`; sau `pa_0`. Giếng chỉ có bà cụ, không có đám đông đón người mới. Nếu PC không tới giếng, ngày vẫn tiếp tục; lời chào đầu giữ lại cho lần gặp sau.

> *Ngoài giếng, tiếng gàu chạm thành nghe rõ trong buổi sớm. Bà cụ đặt thùng nước xuống, nghỉ tay một lát.*

- `Chào bà và hỏi lối ra gốc gạo` → **Bà cụ:** "Cứ theo con đường có bóng tre. Cây cao nhất đầu làng đó."
- `Xin một gáo nước rồi đi` → **Bà cụ:** "Uống đi. Sáng ra nước mát lắm."
- `Đi tiếp` → không ghi đã gặp bà.

Ở gốc gạo, bấm `Ngước nhìn tán cây`: *Bóng lá in xuống đất, loang theo nắng. Một chiếc lá rơi chậm hơn những chiếc khác.* `Nhặt xem` / `Để lá nằm đó` / `Đi tiếp` đều chỉ ghi `HG24:seen_morning`; không nhận lá thần hay thẻ. **Lần sau:** nếu đã xem, đêm 1 có thể nhận ra chính chiếc lá ấy khi lá sáng; nếu chưa xem, đêm 1 vẫn hiểu được cảnh.

#### Ngày 2 — Ngõ làng sau chuyện bé Na

**Nơi:** `village`; HG20/HG09, không thêm một việc chính. Nếu đêm 1 đã đưa bé về, chị Ba đang giũ chiếc áo nhỏ trước cửa. Bấm `Chào chị Ba`:

> **Chị Ba:** "Na ngủ một giấc tới sáng. Sáng nay còn kể chuyện đom đóm."

- `Hỏi bé còn sợ bụi tre không` → **Chị Ba:** "Nó bảo ban ngày bụi tre trông khác hẳn."
- `Cười chào rồi đi` → kết cảnh.

Nếu chưa gặp bé Na: *Chị Ba vừa quét sân vừa ngó về phía bụi tre. Thấy người qua, chị gật đầu chào.* `Chào lại` / `Đi tiếp`; không ghi PC đã cứu bé, không ép tuyến đêm 1 phải hoàn thành. Cuối buổi, một người gánh củi đi qua cổng nghĩa địa và nói với người đi cùng: "Tối qua lại có tiếng ở mộ thấp." Đây là **âm thanh môi trường**, không tự nhận HG27 và không khẳng định lời đồn đúng. **Lần sau:** chị Ba chỉ gọi `{tên}` nếu hai người đã thật sự làm quen.

#### Ngày 3 — Bát cơm đi qua ngõ, hai mạch được đi song song

**Nơi:** `village → well → graves`; sáng sau đêm 2. Đây là lượt sáng của **HG27 đã có trong code** nếu `peta.step=offer`; vị sư già đi ngang ngõ vào **Sáng sớm/Sáng**, không nhận vật thực ban đêm. Bấm `Đến bên vị sư` mới mở. Lời nhắc khi chưa tới giờ: *"Sư đi ngang ngõ buổi sáng."* Không tự tua thời gian, không tự hoàn tất lời hứa.

> *Bát của vị sư già còn trống. Bà cụ đứng cạnh giếng, tay giữ bát cơm đã chuẩn bị.*

- `Đặt cơm vào bát, xin hồi hướng cho bà bên mộ` → đi theo nhánh HG27; điều kiện **Không tham** vẫn cần phần cơm **của PC**, không do lấy bát bà cụ.
- `Để sau, ghé giếng trước` → sư đi theo lịch; việc còn ở mốc chờ sáng hôm sau, không mất quest.

Sau lượt dâng, lúc **chạng vạng** người chơi có thể tự trở lại mộ để xem cảnh bà sáng rồi tan. Nếu chưa tới mốc `offer`, ngày 3 chỉ có giếng và bà cụ; không vẽ sư cầm bát chờ PC vô hạn. Nếu HG27 đã hoàn tất sớm ở luồng legacy, mộ yên và bà không xuất hiện lại. **Không dùng** câu kết đêm 2 "mộ đã yên" trước khi cảnh chạng vạng thực sự xảy ra.

Ngay tại giếng, nhịp HG05 bắt đầu bằng dấu thúng rau trống. Bấm `Hỏi bà đang làm gì` mới nhận lời hái rau như §3.1; không dùng bát cơm HG27 làm vật liệu cho nồi canh. **Lần sau:** bà cụ có thể nhắc riêng từng chuyện theo thứ tự người chơi đã trải qua, không coi HG27 và HG05 là một quest.

#### Ngày 4 — Chiếc gáo và một lời hứa còn để mở

**Nơi:** `well`; dựa trên HG05/HG25. Nếu PC đã mang rau: *Khói bếp bay ngang miệng giếng. Bà cụ úp chiếc thúng ráo nước bên chân.* Nếu chưa mang: *Chiếc thúng vẫn để cạnh giếng. Bà cụ đang tự lựa mấy lá rau nhỏ.* Bà vẫn có canh nhờ sinh hoạt của mình; nhánh hoàn thành của PC chỉ đổi câu bà nhớ.

> **Bà cụ:** "Cái gáo lại lỏng cán. Múc nửa thùng, đổ mất mấy gáo."

- `Hỏi xem cán lỏng ở đâu` → dẫn tới tương tác HG25 ở §3.4.
- `Hôm nay bận, để bà tự xoay xở` → **Bà cụ:** "Ừ, bà nhờ người khác cũng được." Không tạo lời hứa.
- `Đi tiếp` → cảnh vẫn có thể mở sau.

Nếu đã chọn **hứa quay lại** trước đó, bà chỉ nói: "Cái nêm bà để sẵn cạnh thùng." Không hỏi tại sao PC đến muộn. Nếu PC vẫn không sửa sau hai ngày, bà nhờ người khác và gáo được sửa; Sổ ghi `nghe kể`, không ghi PC làm. **Lần sau:** cán gáo chắc nếu được sửa bởi bất kỳ ai, nhưng lời cảm ơn dành cho PC chỉ khi PC đã sửa.

#### Ngày 5 — Bậc đá trong nắng

**Nơi:** `village`; nhịp trả về của HG21/HG23. Nếu PC phụ treo đèn: *Đèn đã tắt, nhưng móc còn trên cọc. Ban ngày mới thấy bậc đá nằm sát lối đi.* **Ông Tư:** "Tối qua có người gánh hàng về muộn, khỏi vấp." Nếu PC không phụ, ông tự treo sau thời gian đã nêu ở §4.2; không dùng câu "may có người góp tay". Nếu đèn chưa treo, bậc đá vẫn ở đó và NPC đi đường tránh được.

- `Nhìn xem đèn treo có chói nhà bên không` → nếu chói, ông dịch móc vào trong; không có mini game/thẻ.
- `Chào con Vàng` → chó chỉ vẫy đuôi nếu đã quen; nếu từng quát, nó đứng sau ông. Không tự bắt PC xin lỗi.
- `Đi tiếp`.

Ở giếng, bà cụ đang lựa nếp; **chỉ khi bấm hỏi** mới mở câu HG06 lượt 1 ở §5.1. Câu bà kể là lời nhớ của bà, chưa xác nhận người bán xôi là ai. **Lần sau:** nếu đã nghe, có thể hỏi ông Tư về nồi xôi; nếu chưa nghe, cảnh nhà ông vẫn tự đủ nghĩa.

#### Ngày 6 — Lá chuối trên hiên

**Nơi:** `village`, hiên ông Tư; HG06 lượt 3. Từ xa nghe tiếng dao chặt lá, thấy con Vàng nằm giữ mép chiếu. Bấm `Ghé hiên`:

> **Ông Tư:** "Mười hai nhà. Tôi gói xong chắc trời cũng tối."

- `Hỏi ông định chia cho những ai` → **Ông Tư:** "Nhà nào thiếu bữa thì mang qua. Không cần biết chuyện cũ của tôi."
- `Nhận lời phụ xếp lá chiều nay` → ghi lời hẹn, không tự hoàn thành; tới tối mới mở phần gói xôi ở §6.1 của tuyến đêm 6.
- `Chúc ông làm xong, rồi đi` → ông tự làm và tự mang đi; không mất nhánh đêm 7.

Nếu chưa nghe chuyện ba bát xôi ở đêm 5, ông chỉ nói việc đang làm, không nhắc món nợ như PC đã biết. Nếu đã nghe, thêm một câu sau khi hỏi: "Nợ cũ thì cũ. Xôi mới còn nóng." **Lần sau:** sân có lá chuối thừa hoặc đã được quét; Sổ chỉ ghi PC phụ khi người chơi đã thực sự phụ.

#### Ngày 7 — Một lời chào đủ để thấy mình thuộc đường

**Nơi:** `village → gao`; HG20/HG24. Nếu PC đã cùng chia xôi: một người gánh hàng đặt chiếc gói rỗng vào giỏ và nói: "Ông Tư gói khéo. Cảm ơn người phụ ông." Nếu ông tự chia: "Ông Tư đi từ sớm. Chắc ghé hết mấy nhà rồi." Nếu việc còn dở: chỉ thấy lá chuối và nồi xôi ở hiên, không tuyên bố đã tới mười hai nhà.

> *Con đường qua giếng giờ đã quen chân. Vẫn có những lối nhỏ chưa bước tới.*

- `Ra gốc gạo ngắm bóng cây lúc chiều` → HG24 lượt 2; chỉ ghi điều đã tận mắt thấy.
- `Ghé hiên ông Tư` → mạch đêm 7 ở §7.1 chỉ mở khi ông sẵn lòng kể; nếu chưa có các lượt trước, dùng lời chào trung tính và để ông kể ở một ngày khác.
- `Đi dạo thêm` → không ép một cảnh tổng kết.

**Nhịp cuối:** đây là điểm nghỉ giữa chặng, không giải bí mật người bán xôi hay mạch bà Sáu. Nếu bảy ngày chỉ đi dạo, dòng Sổ ghi đúng bảy ngày đi dạo; nếu đã gặp vài người, chỉ hiện những dấu đó. Sau ngày 7, các cảnh chưa làm vẫn tồn tại theo điều kiện riêng; không tua NPC về trạng thái ngày 1 để phát lại thẻ hoặc thoại đầu.

#### Điều kiện, nguồn và kiểm tra khi đưa vào code

| Cảnh nối | `ownerNpcId` / nơi | Tiền đề | Dấu nhớ bền và quay lại | `loreBasis` |
|---|---|---|---|---|
| Ngày 1, HG24 | `environment:gao`, `npc.granny` ở giếng | PC dân vừa tới; sáng | đã thấy bóng cây; lời chào bà chỉ sau tương tác | `fiction` |
| Ngày 2, HG20/HG09 | `npc.chi_ba`, `village` | đã/ chưa gặp bé Na là hai nhánh | chị Ba nhớ đúng người đã giúp; lời đồn mộ là `report` | `fiction` |
| Ngày 3, HG27/HG05 | `npc.ba_ngoai`, `npc.granny`, sư già | HG27 ở mốc `offer` mới có lượt dâng sáng | `dedicated` chỉ sau dâng/hồi hướng; bà chỉ rời cảnh sau lượt mộ | `game_interpretation` ⚠ |
| Ngày 4, HG05/HG25 | `npc.granny`, `well` | nhánh rau và gáo độc lập | sửa bởi PC khác với được NPC sửa; không nhận thẻ từ sửa | `fiction` |
| Ngày 5, HG21/HG23/HG06 | `npc.ong_tu`, `village`, `well` | đèn/chó/xôi có thể chưa gặp | ông chỉ cảm ơn việc PC thật sự làm | `fiction` |
| Ngày 6, HG06 | `npc.ong_tu`, hiên nhà | không cần hoàn tất đêm 5 | lời hẹn khác việc đã phụ; ông tự chia nếu bỏ qua | `fiction` |
| Ngày 7, HG20/HG24/HG06 | `environment:gao`, `npc.ong_tu` | không khóa theo số quest hoàn tất | Sổ chỉ hiện sự kiện có thật; lore người bán xôi còn giấu | `fiction` |

**Kiểm tra nhất quán:** PC không mang tiểu sử Ông Tư/Bà Sáu; bà ngoại HG27 không phải Bà Sáu. Không trao thẻ khi đọc lời đồn, xem bóng cây, sửa đồ, nghe chuyện NPC. Không viết `confirmed` cho lời gánh hàng, lời đồn mộ hoặc chuyện nợ chưa xác minh. Nếu tải lại giữa ban ngày, giữ ngày và mốc HG27; mỗi tương tác nhận một lần, không nhân đôi cơm/thẻ. Hai PC cùng account có ký ức và nhánh độc lập. Toàn bộ lời thoại dâng cơm/hồi hướng và cảnh bà rời đi vẫn cần giáo thọ Theravāda duyệt trước phát hành.

### 5.9. Hoa mạn-đà-la và lối lên cõi trời

Đặt lời đồn ở **đêm 5**, khi người chơi bắt đầu dạo xa khỏi ngõ làng. Đây là mạch khám phá tự chọn, nằm cạnh chuyện ba bát xôi. Đốm đèn sau tảng đá (HG14) vẫn dẫn sự tò mò về phía hang. Ánh sáng quanh Tháp Cổ là một manh mối khác.

| Nhịp | Cảnh và lựa chọn | Khi người chơi quay lại |
|---|---|---|
| **Đêm 5 trở đi · Nghe chuyện trên đồi** | Bấm `Xem tháp cổ`. *Gạch tháp đã sẫm màu. Người làng kể rằng ban đêm, ai đem hoa trời tới sẽ thấy lối lên.* | Sổ ghi lời đồn nếu PC đã đọc. Đồi và sân tháp mở cho người đi dạo. |
| **Khi tới cuộc gặp trao hoa · Chư thiên ghé** | Giữ cảnh ánh sáng rọi xuống và hoa rơi sau buổi ngồi với sư già giữa các mộ. Chọn `Chắp tay` để nhận **hoa mạn-đà-la** (`mandarava`). | Hoa ở trong túi của PC đã nhận. Cuộc gặp ngẫu nhiên chỉ ghi dấu gặp chư thiên. Nhịp nhận hoa theo tiến trình của PC và có thể đến trước đêm 5 hoặc sau đêm 7. |
| **Một đêm sau khi có hoa · Trở lại Tháp Cổ** | Bấm `Xem tháp cổ`. *Bông hoa trong túi sáng lên. Một lối sáng hiện quanh tháp, dẫn lên mây.* Chọn `Bước vào` hoặc `Để lúc khác`. | Hoa được giữ lại. Khi cõi trời mở rộng, lối này dẫn ra tiền đình để tự đi dạo và khám phá, xem [World Exploration Bible](world-exploration-bible.md). |

**Hiện trạng trên `develop` (`5e8ea9a`).** `public/mind.js` trao hoa qua cuộc gặp của chuỗi ngồi với sư già. `public/encounters.js` đã kiểm tra có hoa và trời tối khi xem Tháp Cổ, rồi mở cảnh Thiên Cung qua `public/palace.js`. Cảnh tiền đình và các đường dạo trong cõi trời thuộc thiết kế mở rộng. Hoa mạn-đà-la là vật dẫn của lối này. Đóa sen trắng bên ao là vật phẩm dâng ở tịnh thất.

**Ký ức và quay lại.** Sổ của từng PC ghi riêng lời đồn về tháp, lần gặp chư thiên và lần thật sự bước vào. Nếu bỏ qua cảnh hoặc tới tháp lúc sáng, PC vẫn có thể quay lại. Việc nhận hoa và mở lối là `game_interpretation` của thế giới game.

## 6. Biến thể lời kể theo tính cách

Sáu cảnh có biến thể: **BT-1** bé Na trong bụi tre, **BT-2** nghe bà ngoại kể, **BT-3** nắm rau trên tay, **BT-4** con Vàng sủa, **BT-5** bà cụ khen xôi, **BT-6** điều chưa nói.

Luật chung:

- Câu biến thể **thay** câu ◆, dài tối đa hai câu, luôn dùng "Người này".
- Biến thể chỉ **kể một nét**; nó không khóa hay mở lựa chọn nào. Mọi `carita` thấy cùng bộ nút.
- **Trung tính** dùng cho người chưa khảo sát (`carita = null`) và không bao giờ kèm thẻ.
- Không biến thể nào bịa quá khứ cho PC (không "ở quê cũ…", không "hồi nhỏ…").
- Cột *Nhịp thẻ* ghi thẻ **do lời kể** mang lại. Trống là không có.

### BT-1 — Bé Na trong bụi tre (đêm 1)

| Tính | Câu thay ◆ | Nhịp thẻ |
|---|---|---|
| trung tính | *Bé khóc đã lâu, giọng khản đi.* | — |
| tham | *Người này thoáng tiếc buổi tối đầu tiên ở làng, đáng lẽ được thong thả.* | — |
| sân | *Tiếng khóc xoáy vào tai. Người này thấy bực, dù chưa biết bực ai.* | — (Sân chỉ ghi nếu chọn `Quát`) |
| si | *Người này đứng ngẩn ra một lúc, quên mất mình định làm gì.* | — |
| tầm | *Đầu Người này chạy đủ thứ: nhà bé ở đâu, sao lại ra đây, lỡ người ta tưởng mình dọa nó.* | — |
| tín | *Người này nhớ lời vị ở gốc gạo, và tin là mình tìm đúng chỗ.* | — |
| trí | *Người này để ý: đất trên tay bé còn ướt. Bé mới ngã đâu đây thôi.* | — |

### BT-2 — Nghe bà ngoại kể (đêm 2)

| Tính | Câu thay ◆ | Nhịp thẻ |
|---|---|---|
| trung tính | *Giọng bà nhỏ, đều, như đã nói câu ấy nhiều đêm.* | — |
| tham | *Người này chợt nghĩ tới nắm cơm trong túi, và thấy nó nặng hơn lúc nãy.* | — |
| sân | *Người này thấy khó chịu: cả làng nghe tiếng mà không ai ra xem.* | — |
| si | *Người này nghe mà chưa hiểu hết. Chỉ biết là bà đói thật.* | — |
| tầm | *Người này nghĩ dồn: bà là ai, sao còn ở đây, mình thì giúp được gì.* | — |
| tín | *Mắt Người này cay cay, chưa kịp hiểu vì sao.* | — |
| trí | *Người này để ý: sương đọng quanh chân bà mà cỏ không ướt. Bà với bát cơm không ở cùng một chỗ.* | — |

Đêm 2 **không** có thẻ bất thiện từ lời kể: cảnh này dành cho ba mốc của HG27.

### BT-3 — Nắm rau trên tay (đêm 3)

| Tính | Câu thay ◆ | Nhịp thẻ |
|---|---|---|
| trung tính | *Nắm rau vừa một bàn tay, đúng như bà dặn.* | — |
| tham | *Rau non quá, thơm quá. Người này thấy tiếc: đưa hết thì nồi nhà mình chẳng có gì.* | — (Tham chỉ ghi nếu chọn `Bớt lại một nửa`) |
| sân | *Lưng mỏi, tay lấm. Người này hơi bực: mới về làng đã bị nhờ việc.* | — |
| si | *Hái xong, Người này đứng một lúc, suýt quên là hái cho ai.* | — |
| tầm | *Người này cứ nghĩ: chừng này đủ chưa, hái thêm có thừa không, bà có chê không.* | — |
| tín | *Người này nghĩ tới nồi canh của bà, thấy việc nhỏ này cũng đáng.* | — |
| trí | *Người này chừa lại mấy cụm non, để lần sau còn có mà hái.* | — |

### BT-4 — Con Vàng sủa (đêm 4)

| Tính | Câu thay ◆ | Nhịp thẻ |
|---|---|---|
| trung tính | *Con Vàng vẫn gừ nhỏ sau chân ông, mắt không rời Người này.* | — |
| tham | *Người này chỉ mong về tới nhà cho yên, chẳng muốn dính vào chuyện gì.* | — |
| sân | *Tim còn đập thình thịch. Người này thấy nóng mặt: chó nhà ai mà để vậy.* | — (Sân chỉ ghi nếu chọn `Quát`) |
| si | *Người này giật mình, đứng chết trân, chưa biết nên lùi hay nên đi.* | — |
| tầm | *Người này nghĩ ngay: nó có cắn không, mai đi lối này nữa thì sao.* | — |
| tín | *Nghe giọng ông chủ, Người này yên bụng ngay.* | — |
| trí | *Người này để ý: nó sủa to nhưng đuôi cụp. Nó sợ nhiều hơn dữ.* | — |

### BT-5 — Bà cụ khen xôi (đêm 6)

Hai bộ, tùy PC có phụ gói hay không.

**Đã phụ gói (`pc.helpedWrap`):**

| Tính | Câu thay ◆ | Nhịp thẻ |
|---|---|---|
| trung tính | *Bà nói rồi cười, gói xôi còn ấm trên tay.* | — |
| tham | *Bà không nhắc gì tới người phụ gói. Người này thấy hơi chạnh lòng.* | **Tật** ⚠ |
| sân | *Người này thấy hơi khó chịu: mười hai gói đó, mình gói hết sáu.* | **Tật** ⚠ |
| si | *Người này gật gù theo, một lúc mới nhớ ra mình cũng có gói.* | — |
| tầm | *Người này nghĩ: xôi dẻo là nhờ buộc khéo, mà buộc là tay mình.* | **Ngã mạn** ⚠ |
| tín | *Nghe bà khen, Người này thấy ấm bụng như chính mình được khen.* | — |
| trí | *Người này để ý: bà khen xôi, nhưng mắt bà nhìn về phía nhà ông, như mừng cho ông.* | — |

**Không phụ gói:**

| Tính | Câu thay ◆ | Nhịp thẻ |
|---|---|---|
| trung tính | *Bà nói rồi cười, gói xôi còn ấm trên tay.* | — |
| tham / sân | *Người này thấy hơi chạnh: ở đây mấy bữa rồi, chưa nghe ai khen mình câu nào.* | **Tật** ⚠ |
| si | *Người này gật gù theo, chưa rõ xôi nào, nhà nào.* | — |
| tầm | *Người này nghĩ: gói xôi thôi mà, mình làm chắc cũng được vậy.* | **Ngã mạn** ⚠ |
| tín | *Người này thấy vui theo, dù chưa ăn miếng xôi nào.* | — |
| trí | *Người này để ý: bà khen xôi, nhưng mắt bà nhìn về phía nhà ông, như mừng cho ông.* | — |

### BT-6 — Điều chưa nói (đêm 7)

| Tính | Câu thay ◆ | Nhịp thẻ |
|---|---|---|
| trung tính | *Ông nói xong thì nhìn ra ngõ, chỗ ngọn đèn.* | — |
| tham | *Người này muốn ông kể nữa, kể mãi, chưa muốn buổi tối này hết.* | — |
| sân | *Người này thấy tức giùm ông: hồi đó sao không ai nhắc ông một câu.* | — |
| si | *Người này nghe mà chưa nối được hết: ba bát xôi, mùa nước lớn, nồi xôi hôm qua.* | — |
| tầm | *Người này muốn hỏi dồn: người đó là ai, giờ ở đâu. Nhưng thấy ông chưa muốn nói hơn.* | — |
| tín | *Người này thấy thương ông, và tin là mấy gói xôi hôm qua đã tới đúng chỗ.* | — |
| trí | *Người này để ý: ông kể chuyện nợ, nhưng điều ông tiếc là câu cảm ơn.* | — |

Đêm 7 không có thẻ nào từ lời kể. Kết bảy đêm bằng một khoảng yên, không bằng một nhãn.

## 7. Ba tình huống mẫu theo giờ (thay bản nháp trong `public/storylets.js`)

Giữ nguyên `id`, `place`, `phases`, `cooldownDays` đang có. Chỉ thay chữ, thêm biến thể và thêm chữ cho **lần gặp lại** (engine hiện chưa đọc số lần; xem review R-8). Trong ba tình huống này, lời kể **không dùng chủ ngữ** khi được; khi cần thì dùng "Người này".

### 7.1. `chuong_chieu` — Nghe chuông, không cần làm gì (HG26)

**Giờ:** Chiều tàn, Chạng vạng, Đầu hôm. **Nơi:** `hermitage`. **Tab:** *Tiếng chuông chiều* — *Có tiếng chuông nhỏ từ tịnh thất.*

| Lần | Tính | Lời kể |
|---|---|---|
| 1 | mặc định | *Chuông chiều từ tịnh thất vọng ra, chậm và thưa.* / *Chim bay về tổ. Không có việc gì phải làm.* |
| 1 | tham | *Chuông chiều vọng ra, chậm và thưa.* / *Người này muốn tiếng ấy kéo dài thêm, chưa muốn đi đâu.* |
| 1 | sân | *Chuông chiều vọng ra, chậm và thưa.* / *Cái bực dọc trong ngày lắng xuống một chút.* |
| 1 | si | *Chuông chiều vọng ra.* / *Người này nghe mà không đếm, không biết đã mấy tiếng rồi.* |
| 1 | tầm | *Chuông chiều vọng ra, chậm và thưa.* / *Giữa hai tiếng chuông, đầu Người này vẫn kịp nghĩ ba chuyện.* |
| 1 | tín | *Chuông chiều vọng ra, chậm và thưa.* / *Người này thấy yên, như có ai vừa khép cửa giùm.* |
| 1 | trí | *Chuông chiều vọng ra.* / *Người này để ý: tiếng sau nhỏ hơn tiếng trước, rồi tới lúc không rõ còn hay hết.* |
| 2 | mọi tính | *Hôm nay chuông vẫn vậy. Chỉ có tiếng dế vào sớm hơn.* |
| 3+ | mọi tính | *Chuông chiều. Tới tiếng cuối, cả cánh đồng như cùng nghe.* |

Nếu Sư Tịnh đang ở sân: **Sư Tịnh:** "Nghe được tiếng cuối không?" (không cần trả lời).

- `Đứng nghe cho tới tiếng cuối` → Sổ: *Đã đứng nghe chuông chiều ở tịnh thất.*
- `Đi tiếp`

Không thẻ. Không việc.

### 7.2. `ao_sen` — Ao sen thay áo (HG12)

**Giờ:** Sáng sớm, Sáng, Trưa, Chiều. **Nơi:** `ao`. **Tab:** *Ao sen* — *Sen trong ao hôm nay khác hôm qua.*

| Lần | Tính | Lời kể |
|---|---|---|
| 1 | mặc định | *Mặt ao phẳng. Một bông sen vừa nở, mấy bông khác còn búp.* / *Chuồn chuồn đậu lên búp sen, rồi bay.* |
| 1 | tham | *Một bông sen vừa nở, hồng như mới nhuộm.* / *Người này muốn hái, rồi thôi. Để đó thì mai còn ngắm.* |
| 1 | sân | *Một bông sen vừa nở.* / *Nắng chói, nhưng đứng bên ao thì dịu. Người này thôi nhăn mặt.* |
| 1 | si | *Mặt ao phẳng. Bóng mây trôi dưới nước.* / *Người này nhìn mãi, quên mất mình ra đây làm gì.* |
| 1 | tầm | *Một bông sen vừa nở, mấy bông khác còn búp.* / *Người này tự hỏi: búp nào nở trước, và ai quyết chuyện đó.* |
| 1 | tín | *Một bông sen vừa nở.* / *Người này thấy vui không lý do, và không cần lý do.* |
| 1 | trí | *Một bông sen vừa nở.* / *Người này để ý: lá sen nào cũng có một giọt nước tròn, lăn mà không thấm.* |
| 2 | mọi tính | *Bông sen hôm trước đã rụng một cánh. Cánh hoa nằm trên lá, như chiếc thuyền nhỏ.* |
| 3 | mọi tính | *Đài sen đã trơ. Sát bên, một cái búp mới nhô lên khỏi mặt nước.* |
| 4+ | mọi tính | *Ao sen. Hôm nay không đếm được bông nào giống hôm qua.* |

- `Ngắm một lúc` → Sổ: *Đã ngắm ao sen.* (lần 3: *Đã thấy sen nở, tàn, rồi lên búp mới.*)
- `Đi tiếp`

Không nói chữ "vô thường". Người chơi tự thấy. ⚠ Nếu sau này thêm lựa chọn `Tìm hiểu thêm` nối sang kiến thức về vô thường thì **cần giáo thọ Theravāda duyệt**.

### 7.3. `sang_thuong` — Buổi sáng vẫn đến (HG20)

**Giờ:** Sáng sớm, Sáng. **Nơi:** `village`. **Tab:** *Một buổi sáng bình thường* — *Khói bếp lên từ nhà ai đó.*

| Lần | Tính | Lời kể |
|---|---|---|
| 1 | mặc định | *Gà nhà ai gáy muộn. Khói bếp lên thẳng, trời không gió.* / *Không có gì đặc biệt, và thế là đủ.* |
| 1 | tham | *Mùi cơm mới bay ra ngõ.* / *Người này hít một hơi dài, thấy sáng nay mình giàu.* |
| 1 | sân | *Gà gáy muộn, chổi tre quét sân loẹt xoẹt.* / *Sáng nay chưa có gì làm Người này bực. Kể cũng lạ.* |
| 1 | si | *Khói bếp lên thẳng.* / *Người này đứng giữa ngõ, chưa nhớ ra hôm nay định làm gì. Cũng chẳng sao.* |
| 1 | tầm | *Gà gáy muộn. Khói bếp lên thẳng.* / *Đầu Người này sáng nay chưa kịp nghĩ gì, và ngạc nhiên vì điều đó.* |
| 1 | tín | *Chị Ba quét sân, ngẩng lên gật đầu chào.* / *Người này thấy mình có một chỗ ở cái làng này.* |
| 1 | trí | *Khói bếp lên thẳng, trời không gió.* / *Người này để ý: sáng nào cũng giống nhau, mà không sáng nào lặp lại.* |
| 2 | mọi tính | *Lại một buổi sáng. Con Vàng ngáp ở đầu ngõ, không buồn sủa.* |
| 3+ | mọi tính | *Sáng. Có người đi chợ ngang qua, hỏi: "Ăn sáng chưa?"* |

- `Ngồi nghe chim một lát` → Sổ: *Đã có một buổi sáng bình thường ở làng.*
- `Đi tiếp`

Nếu đêm trước vừa xong HG27, lần 1 thêm một câu: *Phía nghĩa địa sáng nay chỉ có tiếng chim.*

### 7.4. Dạng dữ liệu để dán (chỉ là gợi ý cho PR code sau; **tài liệu này không sửa code**)

```js
// Đề xuất: lines theo carita như hiện có; thêm "again" cho lần gặp lại (engine chưa hỗ trợ).
{
  id: "ao_sen",
  scene: {
    label: "Ao sen",
    lines: {
      default: ["Mặt ao phẳng. Một bông sen vừa nở, mấy bông khác còn búp.", "Chuồn chuồn đậu lên búp sen, rồi bay."],
      tham: ["Một bông sen vừa nở, hồng như mới nhuộm.", "Người này muốn hái, rồi thôi. Để đó thì mai còn ngắm."],
      // san, si, tam, tin, tri: xem bảng 7.2
    },
    again: [
      ["Bông sen hôm trước đã rụng một cánh. Cánh hoa nằm trên lá, như chiếc thuyền nhỏ."],
      ["Đài sen đã trơ. Sát bên, một cái búp mới nhô lên khỏi mặt nước."],
      ["Ao sen. Hôm nay không đếm được bông nào giống hôm qua."],
    ],
    choices: [
      { label: "Ngắm một lúc", log: "Đã ngắm ao sen." },
      { label: "Đi tiếp", snooze: true },
    ],
  },
}
```

## 8. Trạng thái, hệ quả và kiểm tra

### 8.1. Bảng thẻ trong bảy đêm

| Đêm | Thẻ thiện có thể có | Thẻ bất thiện có thể có | Thẻ mới cần làm |
|---|---|---|---|
| 1 | Bi, Tùy hỷ | Sân (chọn quát) | — |
| 2 | Bi, Không tham, Tùy hỷ | — | — |
| 3 | — | Tham (chọn bớt rau) | — |
| 4 | Không sân (lần gặp sau, có điều kiện) | Sân (chọn quát) | — |
| 5 | Chánh nghiệp | Tham (chọn lấy ổi) | Chánh nghiệp |
| 6 | Tùy hỷ, Chánh ngữ | Tật, Ngã mạn (lời kể theo tính) | Tật, Ngã mạn, Chánh ngữ |
| 7 | — | — | — |

Không đêm nào bắt buộc có thẻ. Một người chỉ đi dạo bảy đêm sẽ không có thẻ nào, và vẫn có dòng Sổ.

### 8.2. Khóa trạng thái đề xuất (theo `characterId`)

`metGranny`, `rumour:gao_leaves`, `tree` (đang có), `naMood = comforted | waited | shouted | repaired`, `leafKept | leafLeft`, `peta` (đang có) + `peta.shared`, `grannyHerbs = accepted | picked | delivered_full | delivered_half | repaired`, `ladleStage`, `dogMeeting = calm | shouted`, `laneLamp`, `pc.helpedLamp`, `ongTu.xoi = heard | shared | told` + `ongTu.reply = sat | asked | left`, `basket = taken | returned | left` + `basket.confessed`, `pc.helpedWrap`, `gossip = added | plain | none`, `naDrawingSeen`.

Mỗi thẻ ghi một lần theo `(characterId, storyId, cardId)`. Tải lại trang không nhân đôi.

### 8.3. Chữ cần tránh (đã rà trong tài liệu này)

Không dùng: "công đức vô lượng", "nghiệp báo", "siêu thoát", "giác ngộ", "bạn đã làm điều tốt", "bạn chưa đủ…", "bài học là…". Không có câu nào NPC khen PC "có tâm", "có đức". NPC cảm ơn như người làng cảm ơn.

## 9. Review thiết kế

Phần này là ý của người viết kịch bản sau khi đặt chữ thật vào khung. Xếp theo ưu tiên. **P0** = nên sửa trước khi dựng; **P1** = nên sửa trong đợt dựng; **P2** = để ý.

### P0 — sẽ gây sai hoặc làm hỏng điểm mạnh nhất

**R-1. Đêm 1 tiêu trước hai trong ba thẻ của HG27.**
Đêm 1 cho Bi (dỗ bé Na) và Tùy hỷ (mẹ con gặp nhau). Đêm 2, chuyện "signature" cho Bi → Không tham → Tùy hỷ. Theo R11, hai trong ba mốc của đêm 2 chỉ còn là "đã có — gặp lại". Màn tổng kết ba thẻ, chỗ được thiết kế kỹ nhất, mất hai phần ba sức nặng với đúng người chơi chăm nhất.
*Đề xuất:* đêm 1 **không cấp thẻ thiện**. Dỗ bé Na được thưởng bằng bé nắm tay, chị Ba nhớ tên, bức tranh ở đêm 6. Thẻ Bi và Tùy hỷ đầu tiên đến ở mộ thấp. Sân ở đêm 1 (nếu quát) có thể giữ. Nếu chủ project muốn giữ thẻ ở đêm 1, thì ít nhất bỏ Tùy hỷ.

**R-2. Dâng cơm cho sư vào ban đêm.**
Kế hoạch (và code `offerRice`) để PC mang bát cơm tới vị sư già lúc trời tối. Người viết không đủ thẩm quyền, nhưng e rằng việc nhận vật thực sau giờ ngọ và giữ qua đêm không hợp giới luật tỳ-khưu Theravāda. Với một game lấy sự cẩn trọng giáo lý làm nền, đây là rủi ro lớn nhất, và nó nằm ngay ở chuyện quan trọng nhất. **⚠ Cần giáo thọ Theravāda duyệt trước mọi thứ khác.**
*Đề xuất:* "bản hai nhịp" ở §2.4: đêm nhận lời, **sáng** đặt cơm vào bát lúc sư đi khất thực, **chạng vạng** bà sáng lên. Bản này còn giải luôn R-7 (ban ngày chưa có việc gì đáng làm).

**R-3. Thẻ bất thiện "do lời kể" là game nói thay người chơi rằng họ ganh tị.**
Luật C3 cấm hỏi cảm xúc, nên kế hoạch để lời kể *tuyên bố* cảm xúc: "Người này thấy chạnh lòng" → thẻ Tật. Người chơi không làm gì, không chọn gì, và nhận một thẻ có tên "ganh tị". Đây là nhãn phán xét đi cửa sau, dù câu chữ có nhẹ đến đâu. Thêm ba vấn đề:
- Tính cách đến từ khảo sát **quét lá chấm theo tốc độ chạm** (B7, chưa sửa trong code). Tức là thẻ "ganh tị" có thể rơi vì người chơi quét lá nhanh.
- Chỉ ba tính (tham, sân, tầm) có thẻ ở đêm 6; si, tín, trí và người chưa khảo sát **không bao giờ** gặp Tật/Ngã mạn. Hai thẻ mới tốn công vẽ mà hơn nửa người chơi không thấy.
- Kế hoạch gán Tật cho tính **tham**, trong khi Tật thuộc nhóm sân phần. ⚠ cần thầy duyệt.

*Đề xuất (chọn một):* (a) Thẻ bất thiện chỉ rơi từ **nhãn lựa chọn có động cơ** (như `Quát`, `Bớt lại một nửa`); lời kể theo tính chỉ tô màu, không bao giờ cấp thẻ. Khi đó Tật cần một nút, ví dụ `Nói lảng sang chuyện khác — nghe khen người ta hoài cũng chạnh`. (b) Giữ thẻ từ lời kể, nhưng đổi tên hiển thị thành "Một thoáng…" và cho người chơi nút `Không hẳn vậy` để gạt thẻ đi mà không bị hỏi gì thêm. Người viết nghiêng về (a). Kịch bản ở §5–§6 viết theo kế hoạch (thẻ từ lời kể chỉ ở BT-5) để chủ project so được.

**R-4. Luật "nhãn mang động cơ" tạo ra đáp án đạo đức lộ liễu, và thưởng ngược.**
Khi nút ghi `Quát cho nó nín` bên cạnh `Ngồi xuống cho bé bớt sợ`, không ai phân vân. Lựa chọn thành bài trắc nghiệm có đáp án. Tệ hơn: thẻ bất thiện "cũng là thẻ" (R10), nên người thích sưu tầm sẽ **cố ý quát đứa bé** để lấy Sân; và Không sân ở đêm 4 **chỉ** tới tay người đã quát con chó trước. Người hiền từ đầu nhận ít thẻ hơn người quát rồi sửa.
*Đề xuất:* (1) Mỗi cảnh chính có ít nhất một lựa chọn thứ ba **tử tế mà không thẻ** (đã thêm: `Đứng xa chờ bé tự nín`, `Để giỏ nguyên đó`), để hai nút còn lại bớt là "tốt/xấu". (2) Lựa chọn bất thiện phải **hấp dẫn thật**: có lý do đời thường và một cái lợi nhỏ (đã viết giỏ ổi theo hướng này: đang đói, giỏ đầy). `Quát` ở bé Na và con Vàng hiện chưa có cái lợi nào; cân nhắc bỏ hẳn hai nút ấy. (3) Album không đếm thẻ bất thiện vào "bộ sưu tập". (4) Không sân có đường khác không cần phạm trước, hoặc hoãn thẻ này. Nhánh `feature/monk-ghost-week` đã mở Không sân khi ngồi thấp và mong con Vàng bớt sợ ngay lần đầu; ngồi chờ mà không nói thiện ý thì không mở thẻ. Xem [Hệ thống tâm §17.9](he-thong-tam.md#179-sổ-đăng-ký-mạch-nhiệm-vụ-thẻ-đang-triển-khai).

**R-5. Bà ngoại tự giải thích cách cứu mình.**
Code hiện có: "Nếu có ai làm phước rồi hồi hướng, bà mới được no." Một ngạ quỷ đọc hướng dẫn nhiệm vụ. Nó xóa bước "tự tìm cách giúp" mà [HG27 §3.2](human-world-early-mysteries-and-peta-quest.md) coi là lời hứa trải nghiệm, và đặt một khẳng định giáo lý vào miệng nhân vật đang khổ. Nút `Xem tâm bà` còn hiện "Bỏn xẻn 86" kèm câu "Theo kinh điển, người nặng tham và bỏn xẻn có thể sinh vào cõi ngạ quỷ": đó là nhãn phán xét cộng một câu nhân quả chưa duyệt. ⚠ cần giáo thọ.
*Đề xuất:* dùng lời ở §2.2–§2.3 (bà chỉ biết đói; bà cụ ở giếng mới là người chỉ cách). Bỏ hoặc viết lại nút `Xem tâm bà` cho PC người dân.

### P1 — nhịp và độ hấp dẫn

**R-6. Không tham ở HG27 không có cái giá.**
`Nhận, và đặt thêm phần cơm tối của mình` hiện là nút "tốt hơn" miễn phí; không ai không bấm. R5 đòi "cho đi phần của mình", nhưng nếu phần ấy không được cảm thấy thì nó chỉ là một ô đánh dấu.
*Đề xuất:* nhãn nói rõ cái giá (`tối nay nhịn một bữa cũng được`), bà cụ **không** bù, và một câu kể nhẹ về sau. Không phạt chỉ số.

**R-7. Sau hai đêm huyền bí là năm đêm việc nhà. Dễ rơi người ở đêm 3.**
Đêm 1–2: thần cây, ngạ quỷ, ánh trăng. Đêm 3: hái rau, sửa gáo. Người vừa thấy một bà cụ tan vào trăng sẽ hỏi "rồi sao nữa?" và nhận được một nắm rau má. Kế hoạch tự nói đêm 1–2 huyền bí là để "thấy còn nhiều điều chưa khám phá", nhưng đêm 3–7 không trả lời hứa đó: chiếc lá của Thọ thần ("có những dấu vết chỉ hiện cho người có lòng") không được dùng lần nào; đốm đèn HG14 tới đêm 5 mới xuất hiện và là việc tự chọn.
*Đề xuất:* mỗi đêm 3–7 có **một sợi chỉ lạ, 20 giây, không cần làm gì**: đêm 3 ông lái buôn nhắc đốm đèn (đã viết); đêm 4 chiếc lá gạo trong túi sáng lên khi đi ngang một chỗ; đêm 5 đốm đèn thấy được từ ngõ; đêm 6 bé Na vẽ "bà ở trong cây" (đã viết); đêm 7 một bóng người đứng dưới gốc gạo quay mặt về làng (mầm bà Sáu, không mở truyện). Và đưa HG14 lên đêm 3 hoặc 4.

**R-8. Bộ chọn tình huống trong `storylets.js` chưa đỡ nổi kịch bản này.** Đã đọc code:
- **Tự bật khi lại gần.** `loop()` gọi `show()` ngay khi `K.near(...)`. Trái C5 ("chỉ mở khi người chơi bấm"). `petaMeet` và các cuộc gặp trong `encounters.js` cũng tự mở theo khoảng cách. Hoãn (`snooze`) chỉ giữ 60 giây trong bộ nhớ: đứng ngắm ao một phút là bị hỏi lại.
- **Việc chính ăn mất suất việc phụ.** `complete()` ghi mọi `id` vào `tonight.ids`, còn `offered()` tính `quota` bằng `t.ids.length`. Xong một việc chính và một việc phụ là hết suất phụ thứ hai.
- **Không có khái niệm "đêm thứ mấy".** Điều kiện chỉ có `roles`, `phases`, `once`, `cooldownDays`, `needs` (chỉ nhìn `done` của chính storylets). Không gắn được "đêm 5", không đọc được trạng thái bên `encounters.js`/`mind.js` (`Q("tree")`, `Q("peta")`, `S.quest`). Bảy đêm có thứ tự không biểu diễn được bằng dữ liệu hiện tại.
- **Biến thể chỉ đổi `lines`.** Không đổi được lựa chọn, không gắn được "nhịp thẻ theo tính" (`beats` trong pseudocode của kế hoạch), không có chữ cho lần gặp lại (`rec.n` có lưu nhưng `lines()` không đọc).
- **Sắp xếp cố định theo `runId`** thì ổn, nhưng `weight` bằng nhau nên thứ tự do hash; không có "không lặp hai đêm liền" ngoài `cooldownDays`.

*Đề xuất:* PR 3 của lộ trình thêm: `trigger: "explicit"` (hiện dấu, chờ bấm), `quota` chỉ đếm việc phụ, điều kiện `night`/`minDay` và `needsFlag` đọc trạng thái chung, `again[]` cho lần gặp lại, `beats` theo `carita`. Có test cho từng cái.

**R-9. Đồng hồ và khung đêm kéo nhau.**
- Một đêm theo đồng hồ dài khoảng 11 phút thật rồi **đứng ở Gà gáy**. Đêm 1 theo kịch bản cần 10–15 phút. Người chơi chậm sẽ làm nửa sau của đêm dưới một bầu trời đứng im.
- `chuong_chieu` chỉ mở từ Chiều tàn tới Đầu hôm, tức khoảng **5 phút thật đầu tiên**. Ở đêm 1 đó cũng là lúc Thọ thần hiện. Việc phụ "nghe chuông" gần như chắc chắn hết giờ trước khi người chơi rảnh.
- Kế hoạch đêm 1 ghi "ao sen buổi chiều (đóm xanh)", nhưng `ao_sen` chỉ có pha ban ngày và đêm bắt đầu ở Chiều tàn: **không bao giờ gặp được trong đêm 1**. HG12 trong danh mục lại ghi trigger "sáng". Ba chỗ nói ba kiểu.
- HG24 cần sáng, chiều, đêm. Kế hoạch xếp lượt 1 ở đêm 5, lượt 3 ở đêm 7, **không xếp lượt 2**; và lượt "sáng" chỉ có sau khi bấm Kết thúc đêm.
- HG27 cần trời tối hẳn; đêm 2 mở ở Chạng vạng. Người đi thẳng ra mộ sẽ đứng chờ vài phút mà không có gì báo "bà chỉ hiện khi tối".
- Tài liệu đồng hồ không nói **ai bấm "sang đêm mới"** khi ngày chạm trần Chiều tàn, và tải lại trang giữa ban ngày thì nhảy sang đêm mới: nội dung ban ngày dễ mất nhất lại là thứ vừa được thêm.
- Một vòng ngày đêm đầy đủ là 22–23 phút thật. Lời hứa "chơi 2–3 phút vẫn không hụt" ở [vòng ngày §1](kich-ban-vong-ngay.md) cần một câu nói rõ nó còn đúng không.

*Đề xuất:* cho việc chính **ghim giờ** khi đang mở (đồng hồ đã có cơ chế ghim theo cảnh); nới pha của `chuong_chieu` tới Canh hai; quyết một lần HG12 là sáng hay chiều; thêm dòng gợi ý trong tab ("Bà chỉ hiện khi trời tối hẳn"); lưu trạng thái "đang ban ngày" trước khi viết thêm nội dung ngày.

**R-10. Dòng kết đêm đang chấm điểm ngầm.**
`pa_end`/`pb_end` chọn câu theo thanh "Lòng tin" (≤4, ≤6, ≤10). Câu mức thấp ("Một đêm nhiều nghĩ ngợi") là một lời nhận xét về người chơi, sinh ra từ một con số họ không thấy. Và mọi đêm sau đêm 1 dùng chung ba câu.
*Đề xuất:* chọn câu theo **việc đã xảy ra** (§4.4). Cần engine hỗ trợ; nếu chưa có, dùng ba câu trung tính.

**R-11. Hồi hướng mỗi đêm làm nhạt hồi hướng ở HG27.**
Khung đêm vẫn mở "quán xét và hồi hướng" sau mỗi lần Kết thúc đêm (bỏ qua được). Nếu người dân hồi hướng như thủ tục từ đêm 1, thì "Cùng hồi hướng" ở mộ thấp chỉ là lần thứ hai bấm cùng một nút.
*Đề xuất:* với PC người dân, **không có bước hồi hướng cuối đêm cho tới khi xong HG27**; trước đó chỉ có quán xét (bỏ qua được). Sau HG27, bước ấy xuất hiện như một điều người chơi vừa học được từ vị sư già. ⚠ cần thầy duyệt câu chữ.

**R-12. Ông Tư lùi quan hệ giữa đêm 4 và đêm 5.**
Đêm 4 PC cùng ông treo đèn, ông nói "may có người góp tay". Đêm 5 ông "nói gắt vì lo" như gặp người lạ. Đã vá bằng một câu nối ("À, người treo đèn…"), nhưng thứ tự vẫn ngược: lượt 1–2 của HG06 (làm quen, ông còn dè) hợp đứng **trước** HG21 hơn.
*Đề xuất:* đổi chỗ: đêm 4 = con Vàng + HG06 lượt 1–2; đêm 5 = treo đèn + giỏ ổi; đêm 6–7 giữ nguyên. Hoặc giữ thứ tự và nhận câu nối.

**R-13. Tuyến ông Tư không có đích trong bảy đêm.**
"Ba bát xôi" chỉ trọn nghĩa khi biết người bán xôi là bà Sáu, mà mạch bà Sáu (HG18) nằm ngoài bảy đêm. Đêm 7 vì thế kết bằng một câu hỏi. Điều đó có thể là chủ ý, nhưng kế hoạch đang gọi đêm 7 là điểm kết của giai đoạn. Người chơi cần **một** thứ khép lại.
*Đề xuất:* để ông Tư khép chuyện *của ông với PC* ("Mai ghé. Tôi còn ít nếp" — đã viết), và đêm 7 có bóng người dưới gốc gạo làm móc cho đợt sau. Nói rõ trong kế hoạch rằng đêm 7 là **nghỉ giữa chặng**, không phải kết.

### P2 — mâu thuẫn giữa các tài liệu và chi tiết

**R-14. Hai vị sư, chưa rõ ai ở đâu.** Bản tạm `pa_0` nói "ngoài nghĩa địa có vị sư ở lại"; code có "vị sư già ngồi giữa các ngôi mộ"; model PC nói Sư Tịnh "tu nghĩa địa"; Episode Pack đặt Sư Tịnh quét sân tịnh thất; HG03 để "sư già" ở tịnh thất. Kịch bản này dùng **sư già** cho đêm 2 và đêm 7, **Sư Tịnh** chỉ thoáng ở tình huống chuông. Cần owner doc nói rõ hai vị là hai người và mỗi vị thường ở đâu.

**R-15. Câu trên thẻ: "Bạn" hay "Người này".** [HG27 §3.3](human-world-early-mysteries-and-peta-quest.md) ghi ý nghĩa thẻ bằng "bạn" ("Nghe bà kể, bạn muốn giúp…"). Luật giọng kể và code dùng "Người này". Cần sửa bảng ở HG27 cho khớp. Ngoài ra, việc đổi "bạn" (cảnh mở) sang "Người này" (lời kể trong đêm) ngay trong một buổi chơi **nghe gượng** khi đọc liền. Đề nghị: lời kể hành động và cảnh vật **bỏ chủ ngữ** khi được; "Người này" chỉ dùng cho câu nói về tâm và câu trên thẻ.

**R-16. Một Sổ hay nhiều Sổ.** [AGENTS.md](AGENTS.md) §3 chốt "chỉ một Sổ Hành Trình", không Sổ kiến thức riêng. Kế hoạch bảy đêm §4 lại viết "Sổ loài và cõi giới", "Sổ khám phá có đếm"; danh mục HG03 còn chữ "Sổ kiến thức". Nên gọi thống nhất là các **khu** trong Sổ Hành Trình.

**R-17. "Một buổi tối đa một thẻ chính".** [Vòng ngày §7](kich-ban-vong-ngay.md) ghi luật này; HG27 cho ba thẻ một đêm; đêm 6 theo kế hoạch có thể cho Tật + Tùy hỷ + Chánh ngữ. Cần nói rõ luật ấy chỉ áp cho buổi **thực hành**, hoặc bỏ.

**R-18. Người chưa khảo sát bị thiệt.** Luật "`null` không có nhịp tâm riêng" nghĩa là bỏ qua khảo sát = ít nội dung hơn. Việc "tùy chọn" thành việc nên làm. Nếu theo đề xuất R-3(a) thì điểm này tự hết.

**R-19. Biến thể tính "si" dễ thành chê.** "Quên", "ngẩn ra", "chưa hiểu" lặp sáu lần sẽ đọc như game bảo người chơi chậm. Đã cố viết nhẹ và không kèm thẻ, nhưng cần người thật đọc thử. [Vòng ngày §7](kich-ban-vong-ngay.md) cũng dặn "Si không phải nhãn cho người học chưa giỏi".

**R-20. M2 nói hai kiểu.** Kế hoạch ghi "đóng nêm cán gáo"; [Episode Pack 01](human-world-episode-pack-01.md) HG25 ghi "buộc lại cán gáo". Kịch bản dùng "chêm lại cái cán". Chọn một.

**R-21. Tuyến rau má trong code còn dính chuyện chó cắn.** `mind.js` `atWell` vẫn có câu "Bà cụ múc nước, rửa vết cắn giúp bạn", và nhãn `Giữ lại nấu canh`. Chưa kiểm được nhân vật "đến nơi" có đi qua nhánh này không; nếu có thì trái HG23 (không cắn tự động) và B5. Câu "Lành thay, con" của bà cụ khi nhận rau cũng nên đổi thành lời người làng.

**R-22. Chuyện đồn ở giếng (6.3) là lore mới.** Kế hoạch tự đánh dấu "cần duyệt". Nó buộc phải thêm một người làng hay đồn, và đặt chữ "quỵt nợ" cạnh tên ông Tư. Nếu chưa chắc, **hoãn Chánh ngữ** sang đợt sau; bảy đêm không thiếu nó.

**R-23. Đêm 1 quá đầy.** Mở đầu + giếng + hai đóm + việc chính có mini game + chuông + quay lại gốc gạo. Ước chừng 15–20 phút nếu làm hết, trong khi đêm 1 là lúc người chơi còn học cách đi. Đề nghị dời đóm nồi cũ và ao sen sang đêm 2–3.

**R-24. Chỉ mục docs.** [AGENTS.md](AGENTS.md) §5 còn ghi "19 docs chuyên môn"; con số đã cũ. Kế hoạch bảy đêm và đồng hồ vừa vào `develop` (PR #22, #24) với trạng thái **Proposed**, trong khi code đồng hồ, khung đêm, storylets, HG27 và đêm 1 **đã dựng theo chúng**: code đang chạy trước việc duyệt thiết kế. Nên có một lượt chủ project chốt hai tài liệu ấy (đổi sang Approved hoặc ghi rõ phần nào còn treo) trước khi dựng đêm 3–7.

### Điều người viết thấy ổn (ngắn)

Khung "việc trong đêm + nút Kết thúc đêm" đúng tinh thần không ép. R1–R13 là bộ luật thẻ chặt nhất từ trước tới giờ. HG27 vẫn là cảnh hay nhất của game và nên được bảo vệ khỏi mọi thứ làm nhạt nó (R-1, R-2, R-5, R-11 đều vì thế).

## 10. Câu hỏi mở

1. **Xưng hô:** NPC gọi PC thế nào khi chưa biết tuổi, giới? Có hỏi người chơi một lần lúc tạo nhân vật ("mọi người gọi bạn là…") không? Kịch bản đang né bằng cách tránh đại từ.
2. Đêm 1 có cấp Bi / Tùy hỷ không (R-1)?
3. HG27 dâng cơm ban đêm (như code) hay bản hai nhịp qua sáng hôm sau (R-2)? **Đã chốt 2026-11-12: bản hai nhịp.**
4. Thẻ bất thiện từ lời kể: giữ, bỏ, hay cho gạt đi (R-3)?
5. Có giữ nút `Quát` ở bé Na và con Vàng không (R-4)?
6. Có làm chuyện đồn ở giếng (6.3) trong bảy đêm đầu không (R-22)?
7. Thứ tự đêm 4–5 có đổi không (R-12)?
8. Chị Ba là mẹ bé Na: kịch bản dựa theo chú thích trong `encounters.js` và HG09. Xin xác nhận.
9. Bà cụ ở giếng có được nói "bà bán xôi… không còn nữa, từ mùa nước lớn" ở đêm 5 không, hay như vậy là lộ sớm mạch bà Sáu?

## 11. Danh sách cần giáo thọ Theravāda duyệt (gom lại)

| # | Chỗ | Nội dung |
|---|---|---|
| G1 | §2.4, R-2 | Dâng cơm cho sư ban đêm; cách cúng dường rồi hồi hướng trong truyện |
| G2 | §2.3, §2.4 | Lời bà cụ ("gửi phần phước cho người đã mất") và câu hồi hướng của sư già |
| G3 | §2.5 | Lời kể cảnh bà sáng lên; ranh giới "được yên" và mọi khẳng định xa hơn; câu "Lành thay" |
| G4 | §2.2 | Nối "tiếc của lúc sống" với cảnh đói; nút `Xem tâm bà` và câu "Theo kinh điển…" trong code |
| G5 | §1.3 | Thọ thần: cách gọi, cách hiện, câu "Theo kinh điển…" trong code |
| G6 | §1.5, §1.6, §6.2 | Điều kiện Bi và Tùy hỷ (R3) ở từng cảnh |
| G7 | §2.3–§2.5 | Điều kiện Không tham (R5) |
| G8 | §3.2 | Tham hay Lận cho việc bớt rau |
| G9 | §4.1 | Điều kiện Không sân |
| G10 | §5.3 | Chánh nghiệp và R4; nhánh "để nguyên" |
| G11 | §6.2, BT-5 | Tật, Ngã mạn; nối tiếp Tật → Tùy hỷ; Tật với tính tham |
| G12 | §6.3 | Chánh ngữ và R4 |
| G13 | §7.2 | Lời sư già về "những thứ cản đường"; bản tóm ý năm triền cái |
| G14 | R-11 | Bước hồi hướng cuối mỗi đêm của người dân |

## 12. Tiêu chí nghiệm thu

- [ ] Mỗi lượt chữ trên màn hình không quá hai câu.
- [ ] Không có câu nào hỏi người chơi đang cảm thấy gì.
- [ ] Mọi nút dẫn tới thẻ đều mang sẵn động cơ trong nhãn.
- [ ] Mọi câu trên thẻ dùng "Người này" và tả đúng điều vừa xảy ra.
- [ ] Không câu nào cho PC một quá khứ, người thân hay món nợ.
- [ ] Mỗi cảnh có lối bỏ qua; bỏ qua không bị NPC trách.
- [ ] Mỗi cảnh có một điều "lần sau" nhìn hoặc nghe được.
- [ ] Người chưa khảo sát chơi trọn bảy đêm bằng lời kể trung tính.
- [ ] Các mục G1–G14 đã có ý kiến giáo thọ trước khi phát hành.
- [ ] Chủ project đã duyệt câu chữ; trạng thái tài liệu đổi từ Proposed.
- [ ] Không có chữ "siêu thoát", "giải thoát", "chứng" trong lời kể và lời thoại.
