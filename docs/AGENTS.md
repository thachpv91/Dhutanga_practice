# Agent Guide — làm việc có hệ thống với tài liệu Dhutanga Practice

> **Scope: `docs/**` trên branch/PR đang làm.** Hướng dẫn này dành cho AI coding agents và developer khi đọc, chỉnh, thêm tài liệu. Điểm vào cho mọi người: **[README.md](README.md)**. **Đây là luật làm việc trên tài liệu**, không phải bằng chứng rằng kịch bản đã triển khai thành code.
>
> Mục tiêu: tìm đúng nguồn chuẩn nhanh, không viết trùng, không sửa lộn lore, không làm hỏng liên kết, không lộ bí mật giữa các nhân vật, và không biến thiết kế thành thông tin “đã code”.

## 0. First steps — trước khi trả lời hoặc sửa

1. Mở [README.md](README.md) để hiểu **game vision**, thứ tự đọc và index **tất cả** tài liệu.
2. Xác định việc cần làm thuộc domain nào trong [Source Map](#1-source-map-owner-cho-mỗi-miền). Mở **canonical/owner doc** của domain trước, chỉ sau đó mở episode/spec liên quan. Ví dụ người dùng hỏi `G04` thì mở Ghost Episode Pack 01 + World Exploration; hỏi thẻ của ma thì mở Ghost Mischief + Hệ thống tâm; hỏi nhiều nhân vật thì mở Player-Centric + Role Transition.
3. **Đối chiếu yêu cầu mới của người dùng** và **code thực tế** nếu đang mô tả “hiện tại game làm gì”; đừng suy từ kịch bản design-only rằng chức năng đã có.
4. Nếu chỉ được yêu cầu review/thảo luận/chưa sửa, **không commit, không mở PR hay thay file**. Nếu được yêu cầu viết docs, **không sửa gameplay**. Không tự merge PR.
5. Giữ nhánh **`experiment/qls-ideas` đang deploy nguyên vẹn**; tạo PR target `develop` hoặc update đúng PR docs đã được đồng ý.

## 1. Source Map — owner cho mỗi miền

| Query / từ khóa | Tài liệu ưu tiên | Khi cần chi tiết hơn |
|---|---|---|
| Tinh thần game, không ép làm quest, tự do khám phá | [game-design-principles.md](game-design-principles.md) | [exploration-ux-and-gating.md](exploration-ux-and-gating.md) |
| PC tự đặt tên, vai sư/dân/ma, Sư Tịnh/Ông Tư/Bà Sáu là NPC | [player-character-narrative-model.md](player-character-narrative-model.md) | [role-transition-and-spoiler-isolation.md](role-transition-and-spoiler-isolation.md) |
| Map, cõi giới, thọ thần, chư thiên, Bến Không Tiếng | [world-exploration-bible.md](world-exploration-bible.md) | [map-brief-hang-va-coi-gioi.md](map-brief-hang-va-coi-gioi.md) |
| Nhân gian, thời tiết, NPC theo ngày | [human-world-story-bible.md](human-world-story-bible.md) | [kich-ban-vong-ngay.md](kich-ban-vong-ngay.md) |
| Danh mục `HG01–HG27` và scripts | [human-world-playable-scenarios.md](human-world-playable-scenarios.md) | [human-world-episode-pack-01.md](human-world-episode-pack-01.md) |
| HG27 bà ngoại ngạ quỷ, Bi/Không tham/Tùy hỷ | [human-world-early-mysteries-and-peta-quest.md](human-world-early-mysteries-and-peta-quest.md) | [he-thong-tam.md](he-thong-tam.md) |
| G01–G07 hồn ma | [ghost-playable-campaign-bible.md](ghost-playable-campaign-bible.md) | [ghost-episode-pack-01.md](ghost-episode-pack-01.md), [ghost-episode-pack-02.md](ghost-episode-pack-02.md) |
| Hù NPC, thẻ bất thiện, PvP nghe hồi hướng | [ghost-mischief-cards-and-shared-dedication.md](ghost-mischief-cards-and-shared-dedication.md) | [ghost-episode-pack-01.md](ghost-episode-pack-01.md) |
| Điểm nghỉ, Sổ Hành Trình, hồi tưởng sau lúc vắng | [journey-memory-and-return-ux.md](journey-memory-and-return-ux.md) | [role-transition-and-spoiler-isolation.md](role-transition-and-spoiler-isolation.md) |
| Phát tâm xuất gia, tái sinh ending, tránh spoiler nhiều PC | [role-transition-and-spoiler-isolation.md](role-transition-and-spoiler-isolation.md) | [player-character-narrative-model.md](player-character-narrative-model.md) |
| Tâm sở, nhận thẻ, luận/kinh | [he-thong-tam.md](he-thong-tam.md) | [game-design-principles.md](game-design-principles.md), `public/mind.js`, `public/cetasika.js` |
| Social, presence, friends | [ket-noi-nguoi-choi.md](ket-noi-nguoi-choi.md) | `public/app.js`, `server.js`, `social.js` |
| “Đã code chưa?”, save, profile, lúc vắng | **Code trên `develop` là bằng chứng**; dùng [README.md](README.md#6-trạng-thái-thiết-kế-so-với-code) để route | `public/save.js`, `public/profile.js`, `public/reflect.js`, `public/encounters.js` |

**Ưu tiên khi mâu thuẫn:** yêu cầu **mới nhất được chủ project chốt** > quyết định cập nhật trong owner doc > spec episode mới nhất > tài liệu historical/prototype. Tuy nhiên **KHÔNG âm thầm ghi đè lore cũ**; đánh dấu xung đột để review, sửa chỗ owner và cập nhật các file phụ thuộc **trong cùng PR**. Code `develop` là sự thật về **trạng thái triển khai**, không mặc định là game design mới.

## 2. Gắn trạng thái và metadata khi thêm tài liệu

Tài liệu mới nên đặt vào đúng nhóm trong [README.md](README.md#4-danh-mục-tài-liệu-theo-nhóm), tránh tạo file nếu có owner doc đúng chủ đề. Dùng tên file ổn định và `kebab-case`: `<domain>-<topic>-<type>.md`, ví dụ `ghost-episode-pack-03.md`, `narrative-event-contract.md`. **Không tạo file kiểu `final-v2-real.md`**.

**Template tối thiểu:**

```md
# <Title> — <short scope> v0.1

> **Status:** Proposed / Approved design / Implemented / Legacy reference
> **Scope:** narrative / world / UX / save / multiplayer
> **Owner doc:** [game-design-principles.md](game-design-principles.md)
> **Related:** [Player-Centric Narrative Model](player-character-narrative-model.md) (thay bằng tài liệu thật tương ứng)
> **Code status:** Design-only; chưa sửa code (hoặc dẫn commit/test kiểm chứng)
> **Last reviewed:** YYYY-MM-DD

## Goal & player experience
...
## Constraints / decisions already approved
...
## Story flow / rules / scenes
...
## Conditions, state changes & consequences
...
## Open questions for review
...
## Acceptance checklist
...
```

**Không buộc di chuyển toàn bộ tài liệu cũ** chỉ để phù hợp template. Khi sửa một tài liệu cũ, có thể bổ sung header metadata dần mà không xóa nội dung.

## 3. Quy trình agent khi nhận một task

1. **Classify:** `review-only`, `docs-edit`, hay `code`. Chỉ hành động đúng phạm vi user cho phép.
2. **Retrieve:** đọc README, Source Map và owner doc; tìm bằng **ID** (ví dụ `G04`, `HG27`, `npc.ba_sau`, `tuy_hy`), không chỉ tìm một từ chung.
3. **Check status:** nếu spec nói `design-only`, không được viết “game hiện đã có”. Muốn nói implemented phải kiểm chứng code/test ở đúng nhánh.
4. **Check consistency:** các quy tắc hiện hành:
   - PC không phải Sư Tịnh/Ông Tư/Bà Sáu.
   - HG27 bà ngoại khác bà Sáu, thẻ **Bi → Không tham → Tùy hỷ** đúng ba mốc.
   - PC ma hù người khiến NPC **sợ thật**; người sợ có `fearState`, thẻ tâm bất thiện của PC chỉ theo **động cơ/diễn tiến** của PC.
   - PC ma **có nhiều điểm nghỉ**; nhà hoang chỉ là một lựa chọn. G04 đến Bờ Chìm qua **khe suối rừng tre/khe đá**, không qua vết nước ngược ở nhà hoang.
   - **Không trao thẻ Niệm/Định cho PC ma** từ quan sát, nghe tiếng vọng, tìm đường hoặc nghe kinh/hồi hướng. Giải đố cho manh mối; thẻ bất thiện theo động cơ ma; thẻ thiện cực hiếm và cần nội dung được duyệt. [Ghost Campaign](ghost-playable-campaign-bible.md).
   - PC ma gặp NPC/PC làm hồi hướng theo story event có thật; multiplayer real-player scare cần opt-in và không spam.
   - Sổ/story spoilers **per-character**, không tự chia knowledge giữa hai nhân vật một account.
   - **Chỉ một Sổ Hành Trình** theo `characterId`: Nơi chốn & nhân vật / Đang theo / Đã học / Dòng thời gian. Hồ sơ 3 tab và bảng Nhiệm vụ **dùng lại cùng thành phần**, không tạo icon HUD, Sổ kiến thức, Nhật ký hay `recapSnapshots` riêng. `sourceType` là nguồn của từng sự kiện; thang khám phá `unknown/heard/seen/confirmed` không dùng để xếp độ tin cậy của lời đồn. Event log bền + quest projection/checkpoint hợp lệ, không buộc cấm mọi cờ quest. **Không có Codex cấp tài khoản ở MVP.** [Journey Memory](journey-memory-and-return-ux.md).
5. **Choose edit location:** luật chung → owner; một episode → episode pack; định dạng dữ liệu → contract spec; không copy-paste cả đoạn vào 5 file nếu chỉ cần link tóm tắt.
6. **Write and link:** thay/chèn đúng mục; dùng relative Markdown links khi cùng `docs/`; liên kết hai chiều (owner/index ↔ detail) khi hợp lý.
7. **Update index in same PR:** [README.md](README.md) nhóm tương ứng, các “quick paths” và bảng status nếu thay đổi quyết định nền.
8. **Verify:** kiểm tra toàn bộ internal links, sự tồn tại của filename, heading IDs, duplicate story IDs, thẻ tâm/logic hành động theo vai, tình huống offline, replay/reward idempotency, không lộ spoiler.
9. **Report:** tóm tắt những file đổi, PR target/branch, trạng thái **chưa code** nếu design-only; **không tự merge**.

## 4. Viết storylet/episode không làm mâu thuẫn thế giới

**Định danh tối thiểu:** `storyId`, `ownerNpcId|environment`, `eligibleRoles`, `perspective`, `startCue`, `trigger`, `choices`, `immediatePayoff`, `returnPayoff`, `stateScope`, `loreBasis`, `sourceRefs`, `skip/revisit`.

- Ambient trước, **explicit interaction** sau. Lời thoại ngắn, thân thiện, có `Đi tiếp/Để sau`. Dễ thấy thế giới kỳ ảo sớm, nhưng NPC thần/ma không đứng spawn liên tục.
- Người thích dạo chơi **không bị ép học**, không có ngưỡng điểm đạo đức để vào phần lớn map.
- Mỗi NPC có lịch, tiểu sử và ký ức của **NPC**, không giả thành quá khứ của PC.
- Những câu chuyện riêng như túi kim chỉ G03 không bắt nối vào bí mật Hạnh. Mỗi liên kết phải hợp lý và gợi sớm vừa đủ.
- Không suy rằng “đã nghe một lần hồi hướng” = chắc chắn tái sinh/Niết-bàn, hoặc một lần hù = PC có tâm Sân. Phần tái sinh/ma/thần/giấc mơ là `fiction/game_interpretation` khi không có nguồn.
- Nội dung Phật học cần phân loại `canonical | commentary | game_interpretation | fiction`, có source và duyệt từ người am hiểu Theravāda trước phát hành.

## 5. Đặt nhóm tài liệu và kế hoạch tổ chức dài hạn

Hiện có **19 docs chuyên môn + `README.md` + `AGENTS.md`** cùng cấp. **Đừng move file ngay** vì nhiều relative links đang trỏ tới nhau. Phân nhóm trong README trước; nếu cần chia thư mục thật, làm PR **chỉ cấu trúc** riêng và sửa toàn bộ backlinks + test links.

**Cấu trúc đề xuất về sau (không hiện hữu):**

```text
docs/
  README.md                    # entrypoint, map, index
  AGENTS.md                    # agent workflow
  core/                        # identity, principles, version decisions
  world/                       # map, time/weather, realms
  narrative/
    human-world/               # HG catalog, episode packs
    ghost/                     # G campaigns, episodes
  systems/                     # mind cards, save/recap, role transition, social
  reference/                   # research & legacy archive
```

**Khi nào nên thêm tài liệu?**
- Nếu tạo chủ đề mới có **owner riêng và cần truy cập lại lâu dài**, thêm spec dưới nhóm hợp lý.
- Nếu chỉ thêm cảnh G08 hoặc HG28 thì **ưu tiên episode pack kế tiếp**; update danh mục và owner doc.
- Nếu thay một quyết định nền, **cập nhật chính source owner**, rồi cập nhật links và những chỗ mô tả trạng thái cũ, không tạo tài liệu chồng lấn.
- Nếu cần phân biệt “truyện được duyệt” và “đang thảo luận”, dùng status, không nhân bản hai file nội dung gần giống.

## 6. Bắt buộc báo rõ các giới hạn triển khai

- **Không đụng `experiment/qls-ideas`**. PR docs vào `develop` và không tự merge.
- **Không tự đổi source code nếu user chỉ yêu cầu tài liệu**; nếu được phép code thì đọc lại API/schema, bảo toàn guest/signed-in, save version, character history và có tests.
- **Không xóa/move file đã có chỉ để dọn docs** nếu chưa có mapping backlinks, người dùng duyệt và test links.
- **Không biến tài liệu dự thảo thành khẳng định sự thật**: từ “đề xuất”, “có thể”, “sẽ có” phải giữ khi chưa implement.
- **Không tự suy diễn ký ức từ account**, không lộ bí mật/story reveal giữa nhiều PC.
