# Human World Episode Pack 01 — Sáu kịch bản PC-centric v0.3

> **Design-only; chưa sửa gameplay.** **PC** là nhân vật do người chơi đặt tên và chọn vai `monk | villager | ghost`. **Sư Tịnh, Ông Tư, Bà Sáu là NPC**, không phải PC. Tham chiếu bắt buộc: [Player-centric Narrative Model](player-character-narrative-model.md). **Không gán ký ức/vợ/con/món nợ của NPC cho PC.**
>
> Chỉ dùng địa danh có trong `World.PLACES`. Nhịp kể gần gũi, câu ngắn, cho phép bỏ qua. Trời đẹp chủ đạo; mưa nhẹ là biến thể hiếm; bão không random. Tất cả các lựa chọn và state bên dưới là **đề xuất**, không tương ứng API hiện có.

## Cách ghi mỗi episode

- **Chủ câu chuyện** là NPC hoặc `environment`; **góc nhìn** là PC gặp/giúp/quan sát/nghe kể.
- **Tín hiệu ambient** xuất hiện khi đi ngang; **hội thoại chỉ mở khi nhấn**.
- Mỗi scene có **kết quả ngay**, **kết quả trở lại**, **lối bỏ qua** và **điều kiện theo vai**.
- Gắn `loreBasis=fiction` cho truyện sáng tác; cơ chế thẻ/tâm là `game_interpretation`. Nếu dẫn lời kinh phải tách trang kiến thức và ghi nguồn.
- Không tự cấp thẻ tâm chỉ vì PC xem một ký ức của NPC; việc khi vắng chỉ cho kiến thức/vật liệu được giao hợp lệ.

---

## HG21 — Ngọn đèn cho người về muộn

**Nơi:** `village ↔ bamboo ↔ gate`. **Chủ chuyện:** `npc.ong_tu`. **Vai:** dân chủ động hỗ trợ; sư/dân xem ánh đèn; ma có thể nhìn ánh sáng từ xa. **Nhịp:** 2 lần ghé, không ép.

**Ambient:** góc ngõ hơi tối. Ông Tư đứng xem vị trí chiếc đèn cũ. Con Vàng ngủ trên thềm.

**Chạm `Hỏi ông Tư về ngọn đèn`:**

> **Ông Tư:** “Đường này tối thật. Người về muộn chắc khó thấy bậc đá.”
>
> **PC dân:** “Ông định treo đèn ở đây ạ?”
>
> **Ông Tư:** “Ừ. Đang nghĩ treo chỗ nào khỏi chói nhà hàng xóm.”

- `Chỉ ông chỗ treo` → cùng xem hai vị trí, `laneLamp=planning`; lần sau thấy đèn đã treo.
- `Phụ ông treo đèn` (dân, khi ông đồng ý) → `laneLamp=installed`, vệt sáng xuất hiện ngay, ghi `helpedLamp` cho PC; vật liệu của ông không tự chuyển thành túi PC.
- `Ngắm lối nhỏ / Đi tiếp` → một mốc cảnh hoặc không nhận gì, không ép quest.

**Vai sư:** nếu chủ động hỏi, chỉ nghe ông Tư kể; không bắt sư tự mua/bán đèn hoặc nhận công đức. **Vai ma:** đứng nhìn đèn sáng, nghe tiếng chân người về muộn, không chạm đồ.

**Lần sau:** ông Tư đang chỉnh bấc, khách đi qua con đường sáng. Nếu PC phụ treo, ông nói “May có người góp tay, đỡ lo.” Nếu PC không tham gia, ông vẫn có thể tự treo đèn sau vài ngày. **Lưu:** `npc.ong_tu.lampStage` theo character/world policy, `pc.helpedLamp`, `discovery:lane_lamp`; thưởng một lần. **Art:** 1 đèn, một vòng sáng, 1 pose ông Tư.

## HG22 — Tiếng chổi và chiếc lá

**Nơi:** `hermitage`. **Chủ chuyện:** môi trường tịnh thất; Sư Tịnh có thể là NPC gần đó. **Vai:** sư chủ động quét, dân chỉ phụ nếu thích hợp và được mời, ma quan sát từ ngoài.

**Ambient:** nắng sớm, vài chiếc lá rơi. Sư Tịnh đã quét một góc sân; người chơi không mặc định đã quét hôm qua.

**Chạm `Quan sát sân`:**

> Lá lại rơi. Phần sân vừa quét sáng màu đất ướt.
>
> **Sư Tịnh:** “Mới quét xong mà lá rơi tiếp rồi.”

- `Con phụ quét một đoạn nhé` (PC sư; dân hỏi phép trước) → tương tác 3–4 nhịp, một phần sân sạch **ngay**, `courtyard=partly_swept`.
- `Đứng nhìn chiếc lá` → `discovery:falling_leaf`, không tự thêm thẻ Niệm/Vô thường.
- `Đi tiếp` → không nhận lời hứa; sư Tịnh có lịch dọn sân của NPC.

**Lần sau:** lại có chiếc lá mới, nhưng sư Tịnh có thể nói “Hôm nay bạn tới sớm hơn tôi.” hoặc hỏi PC có muốn kinh hành không. Sân không biến thành công trình xây dựng vĩnh viễn; **dấu đã giúp** lưu vào nhật ký. PC ma không cầm chổi; có thể nghe tiếng chổi gợi ký ức **riêng của PC nếu đã chủ động xây** (không tự viết tiểu sử). **State:** `courtyardSeen`, `helpedSweep`, `fallingLeafSeen`.

## HG23 — Con Vàng và khoảng sân đầu ngõ

**Nơi:** `village` ↔ `gate`. **Chủ chuyện:** Ông Tư và chó của ông. **Vai:** dân/sư gặp trực tiếp; ma quan sát một cách phù hợp. **Sửa logic cũ:** PC dân **không phải Ông Tư**, không sở hữu con Vàng, không mặc định từng bị chó cắn.

**Ambient:** con Vàng sủa khi có người lạ. Ông Tư cất tiếng gọi nó vào hiên. Không có va chạm/chó cắn tự động khi đi ngang.

**Chạm `Nhìn con Vàng`**:

> **Ông Tư:** “Nó gặp người lạ là làm ầm lên. Đừng lo, tôi giữ nó lại.”
>
> **PC:** “Chắc nó chưa quen con thôi.”

- `Đứng xa cho Vàng quen mặt` → chó nhìn rồi nằm xuống; `dogMeeting=calm`.
- `Hỏi ông Tư về Vàng` → ông kể chuyện ngắn về lúc chó mới đến nhà; thêm một mối quan hệ/đối thoại, không gắn sẵn tâm Sân.
- `Đi vòng qua đường khác` → lối an toàn, không bị phạt hay trừ thẻ.
- `Nhờ ông giữ chó khi người qua` → ông đồng ý, con Vàng chuyển vào sân; không bắt người chơi gánh trách nhiệm chăm sóc chó của ông.

**Lần sau:** người đi ngang không còn bị sủa; ông Tư nhận ra PC đã gặp, có thể nói “Hôm nay nó hiền hơn hôm trước rồi.” Nếu không tương tác, ông Tư vẫn chăm chó theo lịch. **State:** `npc.ong_tu.dogCare`, `pc.metConVang`, `pc.askedForSafeLane`. **Không** cho cố chọc chó cắn để farm Sân; không tạo cảnh mất an toàn với người chơi chỉ muốn đi dạo.

## HG24 — Bóng gốc gạo qua ba buổi

**Nơi:** `gao ↔ graves`. **Chủ chuyện:** môi trường; bà Sáu là một NPC có thể được thấy **nếu tình huống của bà đã mở**. **Vai:** mọi PC được ngắm sáng/chiều/đêm; câu chuyện NPC là lớp tùy chọn.

- **Sáng, chạm `Ngắm bóng lá`:** “Ánh nắng xuyên qua tán gạo. Một chiếc lá rơi đúng chỗ sáng.” → `gao.morningSeen`.
- **Chiều, chạm `Theo bóng cây`:** “Bóng cây kéo dài tới con đường men nghĩa địa.” → `gao.afternoonSeen`, thấy lối phụ.
- **Đêm trăng, chạm `Nghe tiếng gió`:** “Đom đóm thấp thoáng giữa các rễ cây. Lá vẫn rơi rất khẽ.” → `gao.nightSeen`.

**Nếu từng gặp bà Sáu**, đêm có một bóng đứng nhìn đường. PC có thể hỏi hoặc chỉ đứng xem:

> **Bà Sáu:** “Bà đợi một người. Lâu rồi.”
>
> **PC:** “Bà có muốn kể cho con nghe không?”

Bà chưa kể ngay tên Hạnh nếu người chơi chưa có manh mối. **PC ma** không tự có ký ức về Hạnh; có thể nghe hoặc thấy một ký ức thuộc về bà. Nếu PC đã tìm được mảnh chuyện về Hạnh, lời bà sâu hơn một chút.

**Kết quả:** `discovery:gao_three_lights` khi nhìn đủ ba biến thể; từng buổi đều có cảnh đẹp riêng. Không cần đi đủ ba lần mới được tới hang. Không biến PC thành bà Sáu để giải khóa. **Art:** cùng cây và ba lớp sáng.

## HG25 — Hai chiếc gáo bên giếng

**Nơi:** `well ↔ village`. **Chủ chuyện:** `npc.granny`. **Vai:** PC dân sửa được chiếc gáo khi bà đồng ý; PC sư có thể hỏi thăm/nghe và chỉ giúp trong việc phù hợp; PC ma chỉ quan sát cảnh sinh hoạt.

**Ambient:** bà cụ xoay mãi chiếc cán gáo lỏng. Nước đổ ra mép thùng.

**Chạm `Hỏi bà có cần giúp không`:**

> **Bà cụ:** “Cái gáo dùng bao năm rồi. Nay nó lỏng cán, cứ nghiêng một bên.”
>
> **PC:** “Để con xem thử.”

- `Buộc lại cán gáo` (dân) → thao tác ngắn, cảnh gáo ngay ngắn, `ladleStage=fixed`, `pc.helpedGranny`.
- `Nghe tiếng nước` → `discovery:well_echo`, không tự cấp thẻ Niệm.
- `Để hôm khác` → **chỉ ghi lời hứa nếu PC chủ động nói sẽ trở lại**; bà cụ có thể tự nhờ người khác sửa.

**Lần sau:** bà kéo nước dễ hơn; nếu PC giúp, bà cảm ơn. **Không nhập nhằng với HG05**: rau má là vật khác, lời nhờ khác; NPC chỉ có một tín hiệu “Có chuyện muốn kể”, khi chọn mới thấy hai chuyện nếu đồng thời có. PC có thể được Ông Tư (NPC) nhắc “Chiếc gáo sửa rồi à?” mà không tự gặp chính mình.

## HG26 — Nghe chuông, chẳng cần làm gì

**Nơi:** `hermitage`, chiều hoặc đêm trăng. **Chủ chuyện:** môi trường. **Vai:** mọi PC; PC ghost ở phía ngoài bức tường, không chạm chuông.

**Ambient:** tiếng chuông nhỏ, nắng cuối ngày, chim bay về; không có icon quest bắt buộc.

**Chạm `Đứng nghe chuông`:**

> Tiếng chuông chậm dần. Một lúc sau, chỉ còn tiếng dế.
>
> **Sư Tịnh (nếu đang ở đó):** “Nghe được tiếng cuối không?”

- `Ở lại thêm một lát` → ghi `discovery:evening_bell` một lần.
- `Hỏi về tiếng chuông` (PC sống nếu sư ở gần) → lời đáp ngắn đời thường, lựa chọn `Tìm hiểu thêm` mở Sổ, không thuyết pháp nhiều màn.
- `Đi tiếp` → không có cảnh thất bại.

**Lần sau:** âm thanh/ánh sáng thay đôi chút, ghi dấu đã nghe; không nhận lại thẻ. **PC ma** chỉ nghe từ xa, không mặc định nhớ một bữa cơm, người nhà hoặc quá khứ cụ thể.

## Kết nối nội dung, tránh NPC trùng và ký ức sai

| Trường hợp | Đúng | Sai |
|---|---|---|
| PC chọn dân | gặp Ông Tư đầu ngõ; có thể phụ treo đèn hoặc giúp bà | PC tự là ông Tư, tự về nhà ông Tư |
| PC chọn sư | gặp Sư Tịnh đang quét sân; có thể học hoặc phụ cùng | PC tự có quá khứ Sư Tịnh bị xua đuổi |
| PC chọn ma | có trải nghiệm riêng; nghe bà Sáu kể khi đủ duyên | PC mặc định bà Sáu/Hạnh là mẹ con của mình |
| PC chỉ xem chuyện NPC | mở lore/codex/manh mối nếu phù hợp | cộng thẻ tâm như thể PC tự thực hiện hành động trong hồi tưởng |
| PC bỏ qua | NPC vẫn làm việc và thế giới thay đổi theo lịch | các nhân vật đứng im chờ vô hạn |
| PC quay lại | NPC nhớ đã gặp, cảnh đổi, không nhận lại reward | kể lại lời giới thiệu và phát thẻ lần hai |

**State gợi ý:** `characterId` sở hữu `metNpc`, `interactedEpisodeIds`, `knowledge`, `inventory`; `world/npcStory` mô tả sự tiến triển của NPC theo timeline đã chọn. Không giả định trạng thái của PC A chia sẻ ngay cho PC B. `npcId` phải ổn định, không dùng `roleId` làm chủ sở hữu một câu chuyện.

**Bản kiểm nghiệm trước khi bàn giao developer:**
1. Có thể dùng tên PC bất kỳ cho 3 vai, NPC độc lập không có nhân vật trùng.
2. Mỗi episode xuất hiện bằng ambient; chỉ mở khi chủ động chạm.
3. Vai ma không nhặt/treo/sửa đồ; vai sư không tự làm việc phạm giới.
4. Có kết quả ngay hoặc dấu ngắm cảnh, có biến thể lần sau.
5. Người chơi bỏ qua vẫn có thể đi dạo, không mất lối chính.
6. Lời thoại đủ ngắn để đọc trên điện thoại, không auto-giảng.
7. Bầu trời đẹp chủ đạo, không ép bão/mưa để mở 6 episode.
8. Save cũ được giữ nguyên khi chuyển code sau này: tài liệu này **chưa cung cấp migration đã triển khai**.
