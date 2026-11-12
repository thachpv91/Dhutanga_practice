# Dhutanga Practice — Bản đồ tài liệu thiết kế

> **Điểm bắt đầu cho developer, game designer và AI agent.** Tài liệu ở đây mô tả **hướng phát triển đang được thiết kế**, KHÔNG có nghĩa tất cả đã chạy trong game. Nếu một đoạn trong `README.md` gốc hoặc code cũ nói người chơi **chính là** Sư Tịnh/Ông Tư/Bà Sáu thì đó là **prototype legacy**: xem [Player-Centric Narrative Model](player-character-narrative-model.md) để lấy quy tắc mới.
>
> **Quy tắc dành cho agent:** trước khi đọc/sửa/viết tài liệu, xem [AGENTS.md](AGENTS.md) ngay trong thư mục này. **Không tự chuyển nội dung `draft` thành `implemented`, không tự merge PR hoặc sửa nhánh `experiment/qls-ideas` đang deploy.**

## Bản đồ câu chuyện tổng quan

![Bản đồ tổng quan thế giới Dhutanga Practice — Nhân gian, Bến Không Tiếng, Bảo tháp cổ và cõi trời; ba vai hồn ma, người dân, nhà sư](assets/story-map-overview.webp)

*Hình xem trước tối ưu dung lượng. Đây là bản đồ **ý tưởng và kết nối kịch bản**, không phải layout map hoặc các tính năng đã hoàn thiện trong game.*

Bản đồ giúp hình dung nhanh các địa điểm chung, hành trình riêng của **hồn ma / người dân / nhà sư**, hai góc nhìn **Bờ Nổi / Bờ Chìm**, và nhánh **Bảo tháp cổ → Biên cảnh Tứ Đại Thiên Vương → Vườn Mây Hoan Hỷ**. Để hiểu điều kiện khám phá và nội dung đúng theo thiết kế, xem [World Exploration Bible](world-exploration-bible.md), [Ghost Campaign](ghost-playable-campaign-bible.md), [Playable Scenarios Nhân gian](human-world-playable-scenarios.md) và [Map Brief](map-brief-hang-va-coi-gioi.md).

## 1. Game là gì? (đọc 2 phút)

**Dhutanga Practice / Một Đêm Đầu Đà** là game khám phá 2D phong cách tranh vẽ nhẹ nhàng, xây trên web Canvas, lấy cảm hứng từ đời sống làng quê và Phật học Theravāda. Người chơi vào để **đi dạo, ngắm cảnh, gặp nhân vật, khám phá những bí ẩn kỳ ảo, làm những việc nhỏ và thu thập thẻ tâm qua các tình huống** — **không vào để học giáo lý như một môn học**.

### Sáu nguyên tắc nền tảng

1. **Khám phá trước, giáo lý sau:** không ép nhận nhiệm vụ, đọc kinh hay khảo sát khi vừa vào; câu hỏi nảy sinh từ trải nghiệm (khó chú tâm, sợ trong hang, thấy người khổ...) mới dẫn tới học hỏi tự chọn.
2. **Nhân vật người chơi (PC) có danh tính riêng:** tự đặt tên và chọn vai **nhà sư / người dân / hồn ma**. **Sư Tịnh, Ông Tư, Bà Sáu, Hạnh** là NPC với ký ức và quan hệ riêng — không phải tiểu sử bắt buộc của PC.
3. **Mỗi vai có con đường riêng:** người dân sống và giúp trực tiếp; nhà sư tu tập/khất thực phù hợp giới; hồn ma hù vui, nghe chuyện cõi khuất, thì thầm/báo mộng giúp người và khám phá lối tới Bờ Chìm. Người dân có thể tự nguyện tìm hiểu xuất gia; PC ma có ending khép kiếp sống.
4. **Thế giới tự có đời sống:** NPC không đứng đợi nhiệm vụ mãi; hành động nhỏ để lại dấu, lời thoại thay đổi khi trở lại; trời quang/nắng dịu/trăng là nền chính, bão chỉ trong chương truyện người chơi chủ động chọn.
5. **Tâm sở/thẻ là công cụ hiểu tình huống, không chấm điểm đạo đức:** thẻ thiện hoặc bất thiện được nhận theo **hành động và động cơ được kể rõ** của PC, không chỉ qua click, thời gian offline hoặc nỗi sợ của NPC. Cần phân biệt lời kinh/chú giải với mô phỏng và hư cấu.
6. **Nhiều nhân vật, ký ức riêng:** một tài khoản có thể tạo nhiều PC; mỗi người nhớ việc **mình đã thấy, nghe kể, còn nghi vấn hoặc đã xác nhận**. Người chơi ngoài đời có thể nhận ra nơi quen, nhưng không tự đồng bộ spoiler giữa các PC.

**Cảm giác mục tiêu:** *“Thế giới này giống một bức tranh có thể bước vào; càng ở lâu, càng thấy có những cuộc đời và bí mật đáng tìm hiểu.”*

## 2. Bối cảnh và các mạch truyện đáng nhớ

| Trục khám phá | Ý nghĩa đối với người chơi | Tài liệu nên mở |
|---|---|---|
| **Nhân gian / đời sống làng** | giếng, rừng tre, ao sen, nhà cửa, mộ, tịnh thất, gốc gạo; giúp người, giữ lời, gặp sự kiện theo thời tiết | [Human World Story Bible](human-world-story-bible.md), [27 kịch bản HG01–HG27](human-world-playable-scenarios.md) |
| **Ba tuyến NPC** | Sư Tịnh tu hành; Ông Tư với con Vàng và chuyện xôi; Bà Sáu chờ Hạnh và bí ẩn năm lũ | [Narrative Review](human-world-narrative-review.md), [Episode Pack Nhân gian](human-world-episode-pack-01.md) |
| **HG27 — Bà ngoại ngạ quỷ** | gặp sớm; **Bi** khi nghe và chọn giúp → **Không tham** khi bố thí hồi hướng → **Tùy hỷ** sau khi vui vì bà được an/rời cảnh khổ; giữ cảnh bà sáng rồi tan vào trăng | [Early Mysteries / HG27](human-world-early-mysteries-and-peta-quest.md) |
| **Hồn ma G01–G07** | hù người có phản ứng sợ thật; giúp gián tiếp, nghe hồi hướng, khám phá nhà hoang **hoặc** khe suối, tới Bờ Chìm; có thể tự chọn ending | [Ghost Campaign Bible](ghost-playable-campaign-bible.md), [Episode 01](ghost-episode-pack-01.md), [Episode 02](ghost-episode-pack-02.md) |
| **Khe suối → Bến Không Tiếng** | dòng suối tự nhiên qua **rừng tre/khe đá**, gần ao sen, liên hệ bờ sông cũ; hồn ma thấy lối khuất tới **Bờ Chìm**, người sống tới **Bờ Nổi** từ Hang Vọng Tâm | [World Exploration](world-exploration-bible.md), [Ghost Episode 01](ghost-episode-pack-01.md) |
| **Thọ thần, chư thiên và cõi giới** | nghe lời đồn và dấu hiệu sớm, có cuộc gặp ít nhưng có ý nghĩa; cõi giới mở bằng tò mò và manh mối, không chỉ ngưỡng điểm tâm | [World Exploration](world-exploration-bible.md), [Map Brief](map-brief-hang-va-coi-gioi.md) |
| **Sổ Hành Trình (một sổ duy nhất) / lúc trở lại** | gộp Sổ khám phá, Nhật ký, Dấu mốc, Sổ kiến thức thành một Sổ theo nhân vật; thang chưa biết → nghe kể → tận mắt → xác nhận kèm nguồn; hồi tưởng ngắn tùy chọn; nơi nghỉ linh hoạt **không bắt buộc là nhà hoang** | [Journey Memory & Return UX](journey-memory-and-return-ux.md) |
| **Chạm người chơi khác** | thấy người trong thế giới, kết nối/tiếng động/chuyện được hồi hướng; tương tác hợp ngữ cảnh và có quyền riêng tư | [Kết nối người chơi](ket-noi-nguoi-choi.md), [Ghost Mischief & Shared Dedication](ghost-mischief-cards-and-shared-dedication.md) |

**Bí ẩn cần giữ:** trong code legacy `story.js` có reveal lớn về **Hạnh và gia đình Ông Tư**. Không copy sự thật này vào các đoạn đầu truyện của PC ma hoặc Sổ của PC chưa tìm đủ chứng cứ. Chỉ dành spoiler cho tài liệu biên kịch/agent, **không viết ra lời giới thiệu cho người chơi mới**.

## 3. Đọc gì trước? (quick paths)

| Người đọc / mục đích | Thứ tự khuyến nghị |
|---|---|
| **Developer mới (10–15 phút)** | **README này** → [Game Design Principles](game-design-principles.md) → [Player-Centric Narrative Model](player-character-narrative-model.md) → [Exploration UX](exploration-ux-and-gating.md) → [mục 6: trạng thái code](#6-trạng-thái-thiết-kế-so-với-code) |
| **Narrative designer / người viết lời thoại** | [Game Design Principles](game-design-principles.md) → [Player-Centric Narrative Model](player-character-narrative-model.md) → [Human World Story Bible](human-world-story-bible.md) → [Playable Scenarios](human-world-playable-scenarios.md) → [Episode Packs](#4-danh-mục-tài-liệu-theo-nhóm) |
| **Developer vai hồn ma** | [Ghost Campaign Bible](ghost-playable-campaign-bible.md) → [G01/G03/G04](ghost-episode-pack-01.md) → [G02/G05/G06/G07](ghost-episode-pack-02.md) → [Ghost Mischief](ghost-mischief-cards-and-shared-dedication.md) → [Memory UX](journey-memory-and-return-ux.md) |
| **Developer thẻ, save, tiến trình** | [Hệ thống tâm](he-thong-tam.md) → [Player-Centric Model](player-character-narrative-model.md) → [Role Transition & Spoiler](role-transition-and-spoiler-isolation.md) → [Journey Memory](journey-memory-and-return-ux.md) |
| **Map / artist** | [World Exploration](world-exploration-bible.md) → [Map Brief](map-brief-hang-va-coi-gioi.md) → [Human World Story Bible](human-world-story-bible.md) → [Episode Packs](#4-danh-mục-tài-liệu-theo-nhóm) |
| **Agent sắp sửa code hoặc thêm tài liệu** | [AGENTS.md](AGENTS.md) → tìm **nguồn chuẩn** theo ma trận dưới đây → đọc tài liệu chi tiết liên quan → đối chiếu code `develop` → cập nhật docs/tests/PR có ghi rõ trạng thái |

## 4. Danh mục tài liệu theo nhóm

> **Phân nhóm logic**, chưa di chuyển file để giữ tất cả Markdown relative links và PR/history. Tên file đang dùng làm đường dẫn ổn định; muốn chuyển vào thư mục con phải mở PR riêng với link-check/migration.

### A — Nguyên tắc, kiến trúc truyện (nguồn chuẩn)

| Tài liệu | Dùng khi |
|---|---|
| [Game Design Principles](game-design-principles.md) | tranh luận luật chơi: khám phá, học kinh, gợi ý, thẻ, không áp giáo lý máy móc |
| [Player-Centric Narrative Model](player-character-narrative-model.md) | PC/NPC, role, story owner, ký ức per-character, voice, migration |
| [Exploration UX & Gating](exploration-ux-and-gating.md) | việc chạm NPC, tiến trình mở map, hạn chế tự bật popup |
| [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md) | dân tự nguyện xuất gia; ending PC ma; cách tránh lộ bí mật giữa nhiều PC |

### B — Thế giới, bản đồ, nhịp sinh hoạt

| Tài liệu | Dùng khi |
|---|---|
| [World Exploration Bible](world-exploration-bible.md) | mô hình các cõi, Hang Vọng Tâm, Bến Không Tiếng, thọ thần/chư thiên |
| [Human World Story Bible](human-world-story-bible.md) | Nhân gian, NPC, thời tiết, nắng/mưa, các địa danh |
| [Map Brief — Hang và cõi giới](map-brief-hang-va-coi-gioi.md) | bản đồ, khoảng giao, art direction, vertical slice |
| [Kịch bản vòng ngày](kich-ban-vong-ngay.md) | hành trình theo ngày, sinh hoạt, làm việc khi vắng, mạch NPC |
| [Đồng hồ thế giới](dong-ho-the-gioi.md) | ngày đêm liền nhau cho từng nhân vật (M0), đường tới đồng hồ chung (đề xuất) |
| [Hệ vùng và Hang Vọng Tâm](zones-hang-design.md) | hệ vùng (map đi được) dùng lại cho các cõi, bố cục chi tiết Hang Vọng Tâm, sơ bộ Bến Không Tiếng và đồi tháp, kế hoạch lát cắt chơi được (hướng thiết kế đã duyệt 2026-11-12; nội dung giáo lý chờ duyệt) |

### C — Kịch bản và bí ẩn Nhân gian

| Tài liệu | Dùng khi |
|---|---|
| [Playable Scenarios HG01–HG27](human-world-playable-scenarios.md) | danh mục/chọn storylet, chưa phải 27 episode đều viết đầy đủ |
| [Narrative Review](human-world-narrative-review.md) | lỗi logic truyện cũ, chuyển NPC arcs, yêu cầu đổi schema |
| [Episode Pack Nhân gian 01](human-world-episode-pack-01.md) | sáu episode HG21–HG26 có thoại, lựa chọn, hệ quả |
| [Early Mysteries & HG27](human-world-early-mysteries-and-peta-quest.md) | bà ngoại ngạ quỷ, 3 milestone thẻ, thế giới kỳ ảo sớm |
| [Kế hoạch bảy đêm cho PC người dân](human-world-villager-night-plan.md) | khung đêm, kết thúc đêm bằng nút, mini game, thẻ tâm sở mới, kịch bản đêm 1–7 (đề xuất) |
| [Kịch bản bảy đêm cho PC người dân](human-world-villager-night-script.md) | lời thoại/lời kể đêm 1–7, cảnh mở `pa`/`pb`, biến thể theo tính cách, ba tình huống mẫu, review thiết kế (**Proposed**, chưa code) |

### D — Campaign hồn ma (đề xuất, chưa code)

| Tài liệu | Dùng khi |
|---|---|
| [Ghost Campaign Bible](ghost-playable-campaign-bible.md) | toàn cảnh khả năng/tuyến G01–G07, nội dung cần chốt |
| [Ghost Episode Pack 01](ghost-episode-pack-01.md) | G01/G03/G04: hù người, nhà hoang, túi kim chỉ, khe suối, bến |
| [Ghost Episode Pack 02](ghost-episode-pack-02.md) | G02/G05/G06/G07: hương cơm, bà Sáu, sư hồi hướng, ending |
| [Ghost Mischief, Cards & Shared Dedication](ghost-mischief-cards-and-shared-dedication.md) | phản ứng sợ của NPC, thẻ bất thiện theo động cơ PC, nghe hồi hướng từ PC khác |

### E — Game systems, UX và multiplayer

| Tài liệu | Dùng khi |
|---|---|
| [Hệ thống tâm](he-thong-tam.md) | chi tiết mô phỏng tâm, thẻ, các tầng hiểu, phần đã có/chưa có, cần duyệt giáo lý |
| [Journey Memory & Return UX](journey-memory-and-return-ux.md) | **Sổ Hành Trình hợp nhất (§0)**, phân loại manh mối, hồi tưởng, nơi nghỉ tự chọn |
| [Kết nối người chơi](ket-noi-nguoi-choi.md) | hồ sơ, người quen, presence, quyền riêng tư |

**Tổng cộng:** 19 file thiết kế chuyên môn ở cấp `docs/` tại thời điểm tạo README này, cộng README và hướng dẫn agent. Khi thêm tài liệu mới, cập nhật bảng này ngay trong cùng PR.

## 5. Những quyết định không được ghi đè bằng tài liệu cũ

| Chủ đề | Quyết định mới đang được giữ | Điều chưa có trong code hoặc phải kiểm tra |
|---|---|---|
| PC identity | `monk/villager/ghost` **không** đồng nghĩa Sư Tịnh/Ông Tư/Bà Sáu | `public/story.js`, `story-nights.js`, picker còn legacy |
| HG27 | bà ngoại là NPC riêng; **Bi → Không tham → Tùy hỷ** theo ba tình huống; cinematic tan vào trăng | phần thưởng 3 mốc cần code và kiểm duyệt |
| G04 ghost route | **suối nhỏ ở rừng tre + khe đá**, nước chảy xuôi tự nhiên; có liên hệ ao sen/bến sông; **không** còn “vết nước đi ngược trong nhà hoang” | graybox lối Bờ Chìm cần dựng |
| Ghost rest | nhà hoang **chỉ là một trong nhiều điểm nghỉ tùy chọn**: mộ, gốc gạo, bờ suối, Bờ Chìm... | `Reflect` hoạt động khi vắng hiện có nhưng chưa hỗ trợ hệ điểm nghỉ đa dạng |
| Scare mechanic | NPC thường **sợ thật** với hù rõ; sư có thể bình tĩnh hơn; thẻ bất thiện theo **động cơ PC ma**, không theo nỗi sợ NPC | interactions mới/design-only, người chơi thật phải opt-in nếu bị hù |
| Ghost cards | **PC ma không luyện thiền theo lối người/sư**, giải đố G04 không mở **Niệm/Định**; chủ yếu nhận manh mối và thẻ bất thiện theo động cơ, **thẻ thiện hiếm** khi có mạch đủ sâu | luật thẻ vai ma vẫn là design-only; đối chiếu [Ghost Campaign §2.3](ghost-playable-campaign-bible.md) |
| Shared dedication | ma tình cờ nghe **PC sư/dân khác** hồi hướng khi có event hợp lệ; NPC fallback | presence/chat/emit có nhưng chưa có contract event hồi hướng PvP |
| Ghost ending / villager ordination | chọn kết kiếp ma lưu archive; dân chủ động tìm hiểu xuất gia, giữ characterId | role transition/migration chưa code |
| Sổ ghi nhớ | **Một Sổ Hành Trình** theo nhân vật, có bốn khu xem; Album thẻ/Túi đồ riêng, Codex cấp tài khoản **không thuộc MVP**. Hồi tưởng chỉ mở rộng màn **Trong lúc vắng**. [Journey Memory](journey-memory-and-return-ux.md) | một event log bền theo PC và **projection/quest checkpoint** dẫn xuất; hiện `Discover`, `Save.history` (200 dòng), `Milestones` còn tách; **chưa code** |
| Thang khám phá | Chưa biết → Nghe kể → Tận mắt → Xác nhận (khi cần), thêm `sourceType` (quan sát / lời kể / chứng cứ); `đã ôn/đã vận dụng` là thuộc tính | chưa code |
| Hồ sơ nhân vật | Tổng quan · Hành trình · Người quen (guest không có Người quen); Nhật ký và Dấu mốc chuyển vào Sổ | `public/profile.js` còn 4 tab, `mind.js` Album còn tab Nhật ký |
| Thứ tự MVP vai ma | G01 (hù và **có thể giúp ông Tư dời đèn**) → G03 (giúp bà cụ) → hồi hướng NPC/G07; **G01 giúp đèn hoặc G03 giúp bà** là hai đường mở G07, không bắt làm cả hai. Bờ Chìm sau lát cắt hang; hồi hướng PC thật cuối | chưa code; không khóa Bờ Chìm bằng tu tập |
| Nhân vật đã khép | `story_completed`: **truyện read-only nhưng vẫn có Chế độ đi dạo ở nơi đã khám phá** (không nhiệm vụ, thẻ, mốc, khám phá mới); phía xã hội đóng: không presence/online, không gặp hoặc kết nối mới (máy chủ từ chối) | trạng thái và phần ép phía máy chủ ở một PR riêng; chưa có Chế độ đi dạo, cảnh kết thúc, giao diện |
| Hồ sơ công khai | **Công khai là chủ ý** (quyết định 09-11-2026, chủ project): tên, vai, ngày tạo, thiên hướng và tối đa 6 vật phẩm; không có chỉ số, nhật ký hay thẻ. Người chơi vẫn có công tắc ẩn hồ sơ. Chỉ thu hẹp thêm khi có trường mới có thể lộ spoiler | `social.js` `publicProfile` đã đúng như vậy; trường mới phải qua rà soát |
| `loreBasis` | một enum 4 giá trị `canonical/commentary/game_interpretation/fiction` | chưa code |

**Chú ý:** bảng này là *quyết định tài liệu đang được review*; chỉ sau khi PR code và tests được merge mới có thể đổi trạng thái thành **implemented**.

## 6. Trạng thái thiết kế so với code

**Đã tồn tại ở prototype `develop` (phải kiểm chứng khi coding):**
- Node.js web server; client HTML5 Canvas, giao diện web dọc, `public/world.js` quản lý môi trường 2D.
- Nhiều vai và tạo nhân vật có tên, hồ sơ, thẻ tâm, một phần nhật ký và hoạt động khi vắng.
- Cốt truyện cũ ba góc nhìn và nhiều NPC encounters. Nhân vật tạo mới chơi chương "đến nơi" (`public/story-arrival.js`) với khung đêm tự do và nút **Kết thúc đêm**.
- HG27 đã ghi ba mốc theo lựa chọn của người chơi: Bi khi chọn giúp, Không tham khi sớt phần cơm của mình, Tùy hỷ khi đứng lại nhìn (`public/encounters.js`, `test/client-peta.test.js`). Nhịp dâng cơm ban đêm và câu chữ **còn chờ giáo thọ duyệt**.
- Đêm 1 của PC người dân: Thọ thần, lần theo tiếng khóc tìm bé Na (`test/client-night1.test.js`).
- Đồng hồ ngày đêm riêng từng nhân vật (`public/clock.js`) và bộ chọn tình huống theo dữ liệu với ba mẫu (`public/storylets.js`).
- Sổ Hành Trình và event log (`public/journey.js`, `public/book.js`, `events.js`).
- Các điểm còn thiếu so với kịch bản bảy đêm: xem [review thiết kế](human-world-villager-night-script.md#9-review-thiết-kế).
- Multiplayer cơ bản: presence/chat/gesture/emit qua server; đồng bộ hồi hướng giữa các PC là **đề xuất**, chưa có.
- Nhiều tài liệu đề cập những cõi/map chưa dựng (Bờ Chìm, nhà hoang đi vào được, cõi sâu).

**Các module cần mở trước khi sửa:**

| Mục đích | Entry code |
|---|---|
| Sinh môi trường / địa điểm | `public/world.js` |
| Story role picker / màn chơi | `public/app.js`, `public/story.js`, `public/story-nights.js` |
| Chapter / checkpoint | `public/chapters.js`, `public/progress.js` |
| Encounters / ngạ quỷ / thần linh | `public/encounters.js` |
| Đồng hồ ngày đêm / tình huống theo dữ liệu | `public/clock.js`, `public/storylets.js` |
| Sổ Hành Trình / event log | `public/journey.js`, `public/book.js`, `public/event-catalog.js`, `events.js` |
| Thẻ tâm / quest | `public/mind.js`, `public/cetasika.js` |
| Save / character / nhật ký | `public/save.js`, `public/profile.js` |
| Hoạt động lúc vắng / recap | `public/reflect.js` |
| Multiplayer / auth / persistence | `server.js`, `auth.js`, `social.js`, `store.js` |
| Test | `test/`; chạy `npm test` |

**Chạy local:** từ root repository, `npm install` → `npm start` (mặc định `http://localhost:3000`); `npm test`. Xem [README gốc](../README.md) để biết các thiết lập khác, **nhưng không lấy phần định danh ba vai ở README gốc làm thiết kế hiện hành**.

## 7. Agent / developer muốn thêm tài liệu thì làm thế nào?

1. **Tìm trước:** mở file README này → chọn nhóm và tài liệu có quyền quyết định tương ứng → tìm đúng `storyId`/`npcId`/`cardId` (`HG27`, `G03`, `npc.ba_sau` ...).
2. **Xác định loại thay đổi:** luật chơi/identity → sửa nguồn chuẩn; storylet cụ thể → sửa episode pack; chỉ dẫn UX/data → viết spec; không tạo một bản `*-new-final-final.md` khi có tài liệu owner.
3. **Gắn trạng thái rõ:** đầu tài liệu mới phải có **Status: Proposed / Approved design / Implemented / Legacy reference**, **Scope**, **Owner/Canonical reference**, **Related**, **Code status**, **Last reviewed (YYYY-MM-DD)**. Không tự nhận “đã triển khai” từ tài liệu.
4. **Đặt tên theo domain:** `<domain>-<feature>-<type>.md`; ví dụ `ghost-episode-pack-03.md`, `human-world-episode-pack-02.md`, `journey-memory-state-contract.md`. Không dùng `v-final` trong tên file; sửa version trong heading hoặc metadata.
5. **Giữ tương thích:** ưu tiên sửa file có sẵn; nếu tách file lớn thì tạo entry/index và link giữa phần cũ/mới; **không move/delete hàng loạt** khi chưa sửa toàn bộ links và đối chiếu nguồn.
6. **Update index trong cùng PR:** thêm vào nhóm A–E, bổ sung nội dung “đọc gì trước” nếu là entry point, sửa ma trận quyết định nếu có thay đổi, link ngược từ doc owner.
7. **Kiểm tra:** links tương đối, tên nhân vật (PC/NPC), story IDs, logic save, boundary canonical/fiction, thẻ theo động cơ, hành động hợp vai, lời thoại ngắn và không proximity popup.
8. **Không sửa code trái yêu cầu:** PR tài liệu tách PR code, target `develop`, không tự merge/động nhánh deploy. Khi đã được chủ project xác nhận, mới thay tag `Proposed` → `Approved design`.

Quy tắc đầy đủ, template đầu file, quy trình truy vấn và checklist cho agent: **[docs/AGENTS.md](AGENTS.md)**.

## 8. Thuật ngữ / quy ước tra cứu

| Từ khóa | Nghĩa | Hướng tra cứu |
|---|---|---|
| `thẻ` / `tâm sở` / `tâm` (trong giao diện) | **Thẻ** là thứ người chơi thu thập; mỗi thẻ ứng với một **tâm sở** (yếu tố đi cùng tâm). Tiêu đề "Tâm đang tu / Tâm đã hiểu" là cách gọi gọn trong hồ sơ. **Tâm** là sự nhận thức, cái biết. Định nghĩa dài thuộc tịnh thất/thầy giảng, **không** ở popup; cần thầy Theravāda duyệt | `he-thong-tam.md`, `public/cetasika.js` |
| `PC`, `characterId` | nhân vật người chơi tự đặt tên | Player-Centric Model |
| `NPC`, `npcId` | nhân vật độc lập (Sư Tịnh, Ông Tư, Bà Sáu, bà ngoại HG27...) | Player-Centric Model |
| `HG01–HG27` | storylet/episode Nhân gian; có ID không có nghĩa hoàn thiện code | Playable Scenarios |
| `G01–G07` | tuyến khám phá PC hồn ma | Ghost Campaign, Episode Packs |
| `Bi`, `Không tham`, `Tùy hỷ` | thẻ tâm/mốc trải nghiệm; không là đo lường tâm người thật | HG27, Hệ thống tâm |
| `Bờ Nổi` / `Bờ Chìm` | hai mặt kể chuyện của Bến Không Tiếng | World Exploration, Ghost Episode 01 |
| `unknown / heard / seen / confirmed` | một thang **tiến độ khám phá theo mục**; không phải mức đáng tin của mọi lời kể | Journey Memory §0.3 |
| `accountMeta` vs `characterStoryState` | dữ liệu tài khoản legacy/neutral vs ký ức và tiến trình riêng của PC; **không có Codex account ở MVP** | Player-Centric Model, Spoiler Isolation |
| `loreBasis` | `canonical / commentary / game_interpretation / fiction` | Game Design Principles |
| `sourceType` | `observation / report / evidence`: nguồn **từng sự kiện/thông tin** trong Sổ, độc lập với thang tiến độ | Journey Memory §0.3 |
| Sổ Hành Trình / "Hành trình" | một sổ duy nhất cho mỗi nhân vật (thay Sổ khám phá, Nhật ký, Dấu mốc, Sổ kiến thức) | Journey Memory §0 |

**Nguyên tắc kết:** *Một người mới đọc README là hiểu game muốn mang lại cảm giác gì. Một agent mở AGENTS.md là biết tìm nguồn chuẩn, chỗ sửa, cách cập nhật index và giới hạn không được vượt qua.*
