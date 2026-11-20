# Player-centric Narrative Model — Nhân vật người chơi, NPC và giọng kể v1.0

> **Quyết định thiết kế 08-11-2026, áp dụng ưu tiên cho mọi kịch bản mới. Chỉ sửa tài liệu, CHƯA đổi code hoặc di chuyển dữ liệu.**
>
> Nguồn chuẩn: [Game Design Principles](game-design-principles.md), [Human World Story Bible](human-world-story-bible.md), [Narrative Review](human-world-narrative-review.md), [Episode Pack 01](human-world-episode-pack-01.md). Nếu tài liệu cũ nói `monk = Sư Tịnh`, `villager = Ông Tư`, `ghost = Bà Sáu`, xem đó là **thiết kế cũ cần chuyển đổi**, không phải chuẩn mới.

## 1. Quyết định kiến trúc cốt truyện

**Người chơi tạo nhân vật của riêng mình, chọn tên và một vai `monk | villager | ghost`. Vai là lớp khả năng và góc nhìn, KHÔNG phải tên hoặc tiểu sử cố định.** Nhân vật chính không mặc định có vợ, con tên Hạnh, món nợ ba bát xôi, lời buộc tội sư giả, hoặc đã tu một đêm ở nghĩa địa.

| Chủ thể | ID ổn định đề xuất | Ai sở hữu câu chuyện? | Vai trò |
|---|---|---|---|
| Player Character (PC) | `character.id`, `playerName`, `roleId` | mỗi save nhân vật | đi dạo, chủ động lựa chọn, nhận việc, học/tu, nhớ sự kiện đã trải qua |
| Sư Tịnh (NPC) | `npc.su_tinh` | NPC/nhân gian | nhà sư đang tu, có trải nghiệm về sợ hãi, khất thực và y; có thể gặp, nghe kể, đi kinh hành cùng |
| Ông Tư (NPC) | `npc.ong_tu` | NPC/nhân gian | người dân có con Vàng, từng nghi ngờ sư, có chuyện ba bát xôi; có thể đổi cách nhìn tùy diễn biến |
| Bà Sáu (NPC, peta trong mô phỏng) | `npc.ba_sau` | NPC/nhân gian/cõi dưới | ký ức về Hạnh và tiếng rao xôi; người chơi vai ma có thể quan sát/nghe/tìm hiểu, **không** mặc định mình là bà |
| Hạnh / chị Ba / bé Na / sư già / bà cụ | `npc.*` riêng | NPC | quan hệ, lời hẹn và câu chuyện có nguồn gốc riêng |

**Không được đồng nhất** `roleId` với `npcId`; `villager` có thể giúp Ông Tư sửa hàng rào; `monk` có thể nghe Sư Tịnh kể việc tu; `ghost` có thể quan sát ký ức của bà Sáu.

**Có thể giữ tuyến truyện cũ** như chương *Nghe chuyện một đêm ở nghĩa địa* (góc nhìn khách quan, hồi tưởng, hoặc ba nhân chứng). Chương này là **truyện của NPC**, không được ghi thành tiểu sử bắt buộc của PC hay tự tăng/giảm thẻ tâm của PC nếu người chơi chỉ đang nghe kể.

## 2. Bộ dữ liệu phân tầng để sau này code (schema gợi ý)

```js
const character = {
  id: "char_123", displayName: "Mây Nhỏ", roleId: "monk",
  eventLogRef: "character-owned", // event history bền theo characterId (design-only)
  progress: {}, observedCards: {}, inventory: [], checkpoint: {},
  visitedPlaces: {}, relationships: {}, questStates: {} // các projection, không phải nguồn lore riêng
};
const actor = {
  id: "npc.ong_tu", kind: "npc", name: "Ông Tư",
  facts: { dog: "npc.con_vang", relationship: "npc.ba_sau" }
};
const episode = {
  id: "HG23", ownerNpcId: "npc.ong_tu",
  eligibleRoles: ["monk", "villager", "ghost"],
  perspective: "player_observes", // hoặc player_participates, hears_story, npc_flashback
  trigger: "explicit_interact",
  variantsByRole: {}, prerequisiteEvents: [],
  consequences: [{ scope: "character", key: "dog_meeting" }],
  loreBasis: "fiction"
};
```

Mô hình phân quyền tiến trình:

- **Per character:** **một event log bền** làm lịch sử cho sự kiện truyện/khám phá/kiến thức của PC; `questStates`, `npcRelationships`, `personalKnowledge`, `visitedPlaces` là **projection hoặc checkpoint dẫn xuất**, không là các Sổ/nguồn sự thật độc lập. `observedCards`, `inventory` vẫn thuộc hệ thống riêng; kết quả khi vắng phải nhận đúng một lần ở server. Xem [Sổ Hành Trình — hợp đồng event/projection](journey-memory-and-return-ux.md).
- **Per account:** đăng nhập, lựa chọn chung trung tính và **legacy archive** khi migration (nếu cần). **Không có Codex cấp tài khoản/`codexRead` trong MVP**, không tự đồng bộ manh mối, bài học hay lời hứa giữa các nhân vật. Đề xuất Codex ngoài gameplay chỉ xét riêng ở giai đoạn sau với consent và chống spoiler.
- **Per world/shared:** thời gian/ngày, thay đổi môi trường chung nếu đã có luật cộng đồng và đồng bộ; tách khỏi lựa chọn riêng của các player. Một chiếc đèn Ông Tư treo trong timeline của nhân vật A **không tự xuất hiện** ở timeline của nhân vật B trừ khi gameplay đã chủ ý định nghĩa world event chung.
- **NPC facts:** Sư Tịnh, Ông Tư, Bà Sáu có tiểu sử canonical *trong thế giới game*, không thay đổi theo tên người chơi.

**Hiện trạng code cần chuyển đổi:** `public/story.js` `ROLE_INFO.who` và `STORY[role]` đồng nhất role với NPC; `public/story-nights.js` tiếp tục các tiểu sử; `public/chapters.js` ghép chương chỉ theo role; `public/app.js` chọn vai có `rc-who` và flow một đêm; `public/save.js` lưu `dhutanga.memory/runs/completed` ở tài khoản, còn mind/progress/history theo nhân vật. Đây là **nợ chuyển đổi có thật**, KHÔNG âm thầm đổi hết nội dung/ID rồi phá save.

## 3. Cách chuyển nội dung cũ, tránh xóa truyện có giá trị

| Nội dung trước | Nội dung sau |
|---|---|
| "Bạn là Sư Tịnh" | "Bạn là một vị sư tự đặt tên; Sư Tịnh là người bạn có thể gặp" |
| "Bạn là Ông Tư, có con Vàng" | "Bạn là một người dân; ông Tư và con Vàng sống ở đầu ngõ" |
| "Bạn là Bà Sáu chờ Hạnh" | "Bạn là một hồn ma với hành trình chưa định sẵn; bà Sáu có ký ức riêng về Hạnh" |
| `STORY.monk.scenes.a0...` | chia thành **sự kiện PC chứng kiến** + **NPC arc Sư Tịnh** + **truyện hồi tưởng**; không chỉ thay chuỗi tên |
| `STORY.villager...` / `STORY.ghost...` | giữ nhân quả Ông Tư/Bà Sáu, đổi `ownerNpcId` và vai PC thành người nghe/chứng kiến/chủ động hỗ trợ |
| Bản `TRUE_ENDING` ghép ba vai | giữ thành **bí mật nhân gian nhiều góc nhìn** mở từ manh mối, không yêu cầu PC phải đóng ba nhân vật cũ |
| Hồi tưởng 3 đêm | có thể xem như `hears_story` hoặc `npc_flashback`; lựa chọn không tự thay đổi tâm của PC như chính PC đã làm |

**Kế hoạch dữ liệu (chưa code):**
1. Sao lưu và định nghĩa `saveVersion`; giữ checkpoint và ID story gốc cho người chơi cũ.
2. Với save mới: start chapter `player_arrival`, không ép `a0/v0/g0` thuộc NPC. Role chỉ ảnh hưởng lựa chọn, giới luật, môi trường.
3. Save cũ: hiện lựa chọn **Tiếp tục chương cũ (hồi tưởng)** hoặc **Bắt đầu hành trình cá nhân**, giữ thẻ, vật phẩm, điểm khám phá, lịch sử; không biến kỷ niệm bà Sáu/Ông Tư thành quá khứ PC mới.
4. **Chỉ migrate event được xác định rõ**; account `memory` và `runs/completed` của ba góc nhìn cũ có thể lưu thành `legacyStoryArchive`/meta, không sao chép thành `character.questStates`.
5. Cần fixture cho `guest → signed-in`, save 1/3 vai cũ, tài khoản nhiều nhân vật và resume giữa chương; không xóa dữ liệu do đổi tên NPC.
6. Không code migration trước khi duyệt chương mẫu và mapping từng legacy `sceneId`, `questId`, `clueId`.

## 4. Quy tắc thoại, phù hợp người chơi trẻ nhưng không cố dùng tiếng lóng

**Giọng mục tiêu:** dịu, tự nhiên, có duyên, tinh tế, đôi khi hài hước từ hoàn cảnh, không giả vờ "bắt trend". Nhân vật nói theo **tuổi, vai, mối quan hệ**; người mới không bị bắt xưng `con` với mọi người. Xưng hô phải dựa vào NPC đang nói với ai, không cố nhét tên vào mọi câu.

- **Mở cảnh:** tối đa **1–2 câu ngắn** để gợi tò mò trong UI, không tả phong cảnh quá dài; cảnh đẹp nên thể hiện qua ánh sáng/âm thanh/sprite.
- **Lời thoại lượt đầu:** thường **1–3 lượt trao đổi**, mỗi lượt một ý; cho **Nghe tiếp / Tìm hiểu / Đi dạo tiếp**. Giới hạn là mục tiêu biên tập, không cắt những truyện cần cảm xúc.
- **Dạy thông qua tình huống:** Sư già có thể nói "Ngồi một lát mà nghĩ đủ thứ rồi à?" hơn là giảng ngay định nghĩa phóng tâm; nguồn Pāli/luận đặt trong khu **Đã học** của **Sổ Hành Trình**, không gắn nhãn 'trích kinh' cho lời thoại tự sáng tác.
- **Tự nhiên, không giáo điều:** không giải thích bài học cuối mỗi quest, không đánh giá "bạn tu tốt/chưa đủ thiện", không đổi thanh tâm thành phán xét người thật.
- **Dễ cười nhưng tôn trọng:** chó nằm lười, ông Tư cộc nhưng tốt bụng, trẻ tự nhiên, sư nói ngắn và ấm; tránh mỉa mai người khổ/niềm tin, không biến ngạ quỷ thành trò đùa.
- **Lời dẫn:** ưu tiên "Bạn thấy…" / mô tả trực tiếp, **không kể PC có ký ức chưa trải qua**; nếu NPC nói thì dùng "Ông Tư nhớ…" với `perspective=hears_story` hoặc phân cảnh rõ.
- **Không Gen Z hóa nhân vật cổ** bằng "flex, chill, healing, vibe" liên tục. Trẻ trung là nhịp tương tác, sự gần gũi của mối quan hệ và quyền lựa chọn.

**Ví dụ sửa văn:**

| Trước / vấn đề | Sau / có thể chơi |
|---|---|
| "Khi tâm phóng dật, người tu cần phát triển chánh niệm để trở về đề mục…" | Sư: "Ngồi mới một lát mà đã nghĩ tới chuyện khác rồi à?" → `Thử đi vài bước` / `Hỏi về phóng tâm` |
| "Ông Tư thấy lòng từ bi nảy nở sau khi giúp bà…" | Bà cụ: "Hôm nay kéo nước nhẹ hẳn. Cảm ơn con nhé." → chiếc gáo được sửa hiện trong scene |
| "Ngạ quỷ chấp thủ đau khổ về vô thường" | Bà Sáu: "Bà vẫn đợi. Có lúc chính bà cũng không nhớ mình đợi từ bao giờ." → `Nghe tiếp` / `Đi dạo` |
| "Bạn nhớ con gái tên Hạnh" (PC ghost) | "Bà Sáu lại gọi tên Hạnh. Bạn chưa biết Hạnh là ai." → `Đến gần nghe` |

## 5. Khuôn episode nghiệm thu trước khi dựng

Mỗi storylet phải có: `storyId`, `npcOwner` (hoặc `environment`), `eligibleRoles`, `perspective`, `startCue`, `trigger`, `choices`, `immediatePayoff`, `returnPayoff`, `stateScope`, `loreBasis`, `sourceRefs`, `skip/revisit`. Những câu chuyện không có NPC chủ sở hữu phải nói rõ là **environmental discovery**, không bắt buộc lời thoại.

**Các kiểm thử bắt buộc:**
- [ ] Đặt tên PC bất kỳ, chọn vai sư/dân/ma, UI và truyện không tự gọi mình Sư Tịnh/Ông Tư/Bà Sáu.
- [ ] PC dân có thể nói chuyện với Ông Tư như một **NPC khác**, không có lỗi "tự gặp mình".
- [ ] PC ma không tự biết Hạnh là con mình; được thấy ký ức bà Sáu nhưng không đóng vai bà hoặc cầm vật.
- [ ] PC sư không mặc định đã bị Ông Tư xua đuổi/đã khất thực bảy nhà trước khi đến.
- [ ] Người chơi bỏ qua cảnh NPC vẫn tiếp tục sinh hoạt, không nhận lời hứa/điểm thưởng không có căn cứ.
- [ ] Xem hồi tưởng NPC không cộng thẻ tâm vào PC như đã tự thực hành.
- [ ] Save guest, đổi tên, reload, hai nhân vật cùng account không trộn ký ức NPC và nhân vật.
- [ ] Cảnh chào, hội thoại thường ngày đủ ngắn để đọc trên mobile; Sổ chứa phần kiến thức dài.
- [ ] Sư/ma/dân có xưng hô và hành động phù hợp bối cảnh, luật giới và quan hệ.
- [ ] Người mới đi dạo 5–10 phút không bị popup quest và không cần biết truyện cũ.

> **Sổ Hành Trình / hồi tưởng theo từng character (design-only):** [Journey Memory & Return UX](journey-memory-and-return-ux.md). Ma có thể nghỉ ở nhiều nơi (nhà hoang chỉ một lựa chọn), save không buộc về hub; lịch sử, manh mối và recap theo `characterId` chứ không chia spoiler theo account. Các lần gặp PC khác chỉ lưu event có thật, không lấy chat tự do để hoàn thành hồi hướng.

> **Quy tắc mở rộng vai để chốt trước coding:** [Ghost Campaign Bible](ghost-playable-campaign-bible.md) và [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md). `villager → monastic_aspirant/novice` là tiến trình tự nguyện, giữ characterId và memory đúng vai; `ghost → story_completed` là **ending**, không phải đổi role sang deva/thọ thần. Các PC trên cùng account giữ **story spoilers, manh mối và lối khám phá riêng**; phần giao bến chỉ là landmark, không chia sẻ quest flag. **Chưa code.**

## 6. Thứ tự chuyển đổi an toàn

**P0 — Chốt tài liệu:** chuẩn PC/NPC, giọng kể, chuyển 6 episode và HG01–HG26 về góc nhìn PC; review việc lưu ký ức.
**P1 — Chuẩn code riêng PR:** role picker bỏ `ROLE_INFO.who` là nhân vật chính; PC luôn có identity riêng; xây `StoryContext { player, npc, perspective }` và các scene đầu tiên.
**P2 — Kịch bản NPC:** cắt chương đêm cũ ra NPC arcs/hồi tưởng, nối quan hệ và lời hứa; migration legacy và tests.
**P3 — Mở rộng:** NPC schedule, nội dung học khi vắng, Nhân gian storylets, hang/cõi giới.
**Chưa làm:** mọi thay đổi trên đều là plan, không phải commit code trong PR tài liệu.
