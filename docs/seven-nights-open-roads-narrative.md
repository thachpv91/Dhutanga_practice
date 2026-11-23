# Những con đường chưa khép — Kịch bản Bảy Đêm v0.3

> **Status:** Proposed — chờ duyệt nội dung, **design-only/chưa code**  
> **Scope:** Narrative, PC sư/ma/dân, storylets, event state, acceptance  
> **Owner docs:** [Game Design Principles](game-design-principles.md), [Ghost Campaign Bible](ghost-playable-campaign-bible.md), [Player-Centric Narrative Model](player-character-narrative-model.md)  
> **Related:** [Ghost Episode Pack 01](ghost-episode-pack-01.md), [Ghost Episode Pack 02](ghost-episode-pack-02.md), [Human World Playable Scenarios](human-world-playable-scenarios.md), [Journey Memory & Return UX](journey-memory-and-return-ux.md), [Role Transition & Spoiler Isolation](role-transition-and-spoiler-isolation.md)  
> **Last reviewed:** 2026-11-22  
> **Quy tắc ưu tiên đề xuất:** G07 trong tài liệu này là **khép chương mở đầu, không khép kiếp ma**; E01 vẫn là **ending terminal riêng**. Đây là thay đổi so với G07 ở Ghost Episode Pack 02, cần duyệt trước khi code.

## 1. Tinh thần và nguyên tắc

**Bảy đêm là bảy khoảng thời gian gợi ý, không phải bảy nhiệm vụ buộc hoàn thành.** Người chơi có thể bỏ một mạch, vào Bờ Chìm ngay đêm đầu, hoặc sau bảy đêm mới tìm chiếc túi của bà cụ. Thế giới tiếp tục chuyển động: ông Tư thắp đèn; bà cụ sinh hoạt; sư già kinh hành; thời tiết thay đổi. Không ép một NPC đứng đợi mãi tại marker quest.

Game trước, Phật pháp tạo chiều sâu sau: hù vui, đứng ngắm trăng, nghe nước cũng là hoạt động đáng chơi. Thẻ tâm sở là trải nghiệm minh họa **động cơ/hệ quả của PC**, không suy từ nỗi sợ NPC, không farm được. PC ma không luyện thiền hay nhận Niệm/Định chỉ vì nghe tiếng động, kinh/hồi hướng hoặc giải đố. Mô phỏng ma/giấc mơ/cõi giới là **fiction/game_interpretation**, không phải khẳng định Phật học.

- Ambient 1–2 câu xuất hiện trong thế giới; chỉ mở lựa chọn khi **tương tác chủ động**; thường 1–3 lượt thoại và 2–4 nút cho mobile.
- Mỗi sự kiện có thể **bỏ qua, quay lại, hoặc gặp biến thể**; không ép nhận quest, không pop-up khi đi ngang.
- Cảnh có kết quả cụ thể trong animation, hội thoại NPC, vật thể, Sổ Hành Trình hoặc đường khám phá; không phải mọi cảnh có item/thẻ.
- PC do người chơi tạo, không tự biến thành Sư Tịnh, Ông Tư, Bà Sáu, Hạnh, hay bà ngoại ngạ quỷ.
- Có NPC fallback; không cần PC sư/dân/ma khác online. Người chơi thật bị hù phải opt-in riêng.
- **Một Sổ Hành Trình per-character**; lời kể, quan sát và điều đã xác nhận khác nhau. Không tạo thêm sổ hay đồng bộ spoiler giữa PC cùng account.

## 2. Nhịp gợi ý bảy đêm

| Nhịp | Mạch | Hấp dẫn chính | Nếu bỏ qua |
|---|---|---|---|
| G-N1 | G01 — Bàn tay xuyên qua cỏ, ông Tư/con Vàng | Khám phá năng lực, tinh nghịch có hệ quả | Đèn cuối ngõ vẫn sáng; G01 còn cơ hội |
| G-N2 | G02 + G03 — Hương cơm, túi kim chỉ | Cảm nhận đời người sống; giúp khi không cầm đồ | Hương cơm đổi theo bếp; bà cụ có thể tự tìm |
| G-N3 | G04 — Suối rừng tre, Bờ Chìm | Một vùng kỳ ảo và bí ẩn âm thanh | Lối nước vẫn ở đó, không cần thẻ |
| G-N4 | G05 — Bà Sáu nhớ một nửa | Manh mối chưa chắc là sự thật | Bà vẫn có lịch riêng, không đòi PC giải hết |
| G-N5 | G06-S01 / MN06 — Hù hay ngồi cạnh sư | Nghịch ngợm, phản ứng và quan sát | Sư tiếp tục thời tu |
| G-N6 | G06-S02 — Một lời hồi hướng | Ký ức riêng, khoảnh khắc lắng lại | Không nghe vẫn có cơ hội khác |
| G-N7 | G07 — Bình minh trên tán gạo | Xem lại hành trình, **khép chương** tùy chọn | Tiếp tục toàn bộ thế giới |

**Không dùng số đêm như điều kiện cứng.** World/scene scheduler chọn theo vai + địa điểm + thời gian trong game + quest state + recent storylets; không trùng cảnh liên tiếp. Bất kỳ PC ma nào cũng có thể đi G04 mà chưa G01/G03. Nhánh G05 có thể mở từ gốc gạo mà không cần tới bến.

## 3. PC Sư — Bảy ngày ở nghĩa địa

### MN01 — Chiều xuống ở nghĩa địa

> Tiếng chim cuối ngày vọng từ xa.  
> Chiếc lá khô mắc vào mép y. Trên lối nhỏ, cỏ đã ướt sương.

- **Tìm một chỗ thích hợp để ngồi:** mở hoạt động thực hành có sẵn, không auto phát Định.
- **Kinh hành dọc những ngôi mộ:** nhận cảnh/âm thanh; có cơ hội gặp MN06.
- **Nhìn ngọn đèn cuối làng:** discover hướng đầu ngõ, không ép quest.
- **Trở về tịnh thất:** kết buổi, không phạt.

Trời quang/đêm trăng là nền; mưa đổi âm thanh và ánh sáng. Nghĩa địa không liên tục có jumpscare. PC sư mới spawn chiều muộn với bát rỗng/sạch; **không gợi ăn đêm**.

### MN02 — Bà cụ bên giếng (liên hệ HG05 nhưng không thay HG05)

> Bà cụ đang ngồi trên bậc đá, một tay xoa đầu gối.  
> **Bà:** “Định kiếm ít rau má nấu canh mà chân đau quá.”

- **Hỏi thăm chân bà:** nghe vài câu sinh hoạt, không tự nhận nhiệm vụ.
- **Nhắc bà có thể nhờ người làng giúp:** lời hỗ trợ hợp ngữ cảnh, **không phải sai bảo hái**.
- **Ghé báo có người đang cần giúp ở giếng:** để cư sĩ tự quyết định có giúp bà.
- **Chào bà rồi đi:** không lưu lời hứa.

PC dân vẫn nhận HG05, tự hái đúng rau ở gốc mít và **trực tiếp trao cho bà**, mới ghi hoàn thành. PC ma chỉ quan sát/tạo dấu gợi người sống; không có nút Hái rau, Nhặt rau hay inventory rau_ma. Nếu chưa ai giúp, NPC theo lịch có thể tự xử lý, không bắt người chơi khác online. Xác thực cách nói và việc giúp cư sĩ với giáo thọ (đặc biệt Pācittiya 11) trước triển khai.

### MN06 — Tiếng động bên ngôi mộ (góc nhìn PC Sư)

> Một vệt tối lướt qua hàng cỏ. Tim bạn chợt đập mạnh.  
> Phía sau không có ai.

- **Quay lại quan sát:** thấy lá/bóng thay đổi; chưa biết ai gây tiếng động.
- **Nhận biết cảm giác vừa xuất hiện:** hoạt động quan sát tâm tự chọn; không auto nhận Niệm.
- **Đứng dậy kinh hành:** đổi hoạt động.
- **Trở về tịnh thất:** rời cảnh.

NPC sư có thể sợ thoáng qua và bình tĩnh theo tính cách/bối cảnh; không coi sư là người hoàn toàn không biết sợ, cũng không ép thuyết pháp. PC Sư chủ động chọn hồi hướng sau một thời tu phù hợp mới tạo dedication event; không tự hồi hướng từ chat thông thường.

### MN07 — Đường chưa đi hết

Sau khoảng bảy ngày trong game, khi PC sư **chủ động** đến gặp sư già:

> **Sư già:** “Ở đây cũng đã mấy hôm rồi. Con thấy thế nào?”  
> *Ông đặt chiếc chổi tre xuống cạnh gốc cây.*  
> **Sư già:** “Nếu muốn, con cứ ở lại. Những con đường khác cũng không chạy đi đâu.”

- **Con muốn tiếp tục ở nghĩa địa:** biến thể MN01/MN06; không tự tăng cấp.
- **Con muốn về tịnh thất học thêm:** ưu tiên tuyến y phấn tảo, học kinh, việc thường ngày.
- **Con muốn đi xem những nơi khác:** gợi rừng tre/suối/cửa Hang Vọng Tâm; chỉ vùng sâu mới có điều kiện theo vai, không dùng điểm tâm để chặn khám phá ngoài.
- **Con chưa quyết định:** đi dạo tự do.

> Trời đã sáng. Những việc chưa xong vẫn ở đó. Không ai giục.

Không có màn chấm điểm bảy ngày tu tập. Y phấn tảo, Pācittiya 11, lời hồi hướng và chi tiết thọ thực cần người am hiểu giới luật duyệt.

## 4. PC Ma — Cảnh chi tiết theo nhịp gợi ý

### G-N1 / G01 — Bàn tay xuyên qua cỏ, đầu ngõ ông Tư

> Một giọt sương đọng trên ngọn cỏ. Bạn đưa tay chạm vào.  
> Bàn tay xuyên qua, giọt nước vẫn nằm nguyên.  
> Cuối đường, con Vàng bỗng ngẩng đầu.

- **Thử chạm bia đá:** có lực cản mờ; gợi rằng ma không xuyên được mọi thứ.
- **Theo ánh đèn đầu ngõ:** mở G01 gặp ông Tư.
- **Theo tiếng nước rừng tre:** có thể tìm đường G04 ngay.
- **Ở lại ngắm trăng:** dấu cảnh tĩnh, không quest/thẻ.

**Ông Tư và con Vàng:**

> **Ông Tư:** “Vàng! Nửa đêm rồi còn sủa cái gì?”  
> *Con Vàng vẫn nhìn chằm chằm vào bụi tre.*

- **Làm cửa kêu:** ông giật mình, nhìn quanh.
- **Cho bóng lướt qua tường:** ông hoảng thật, lùi về hiên, con Vàng sủa.
- **Thì thầm “Đèn gần khăn kìa”:** ông có thể chú ý và **tự dời đèn**.
- **Đi vòng ra sau nhà:** khám phá; không bắt hù.

Nếu bị hù rõ:

> **Ông Tư:** “Ai đó? Có giỏi thì ra đây!”  
> *Ông lùi thêm hai bước.*  
> **Ông Tư:** “Vàng... vào nhà!”

Sau đó có thể hỏi PC một động cơ **đã được diễn tả trong truyện**: thích thấy người khác cuống lên (cơ hội minh họa Tham), trả đũa vì giận (cơ hội minh họa Sân), chỉ trêu hoặc dừng. Không suy tâm sở từ việc NPC sợ; không farm thẻ khi hù lặp.

Ngày sau, một hậu cảnh dí dỏm:

> **Ông Tư:** “Ma cỏ gì! Tui có sợ đâu.”  
> *Con Vàng nằm dưới chân ông. Nghe tiếng lá, nó lại dựng tai.*

**G01.lampSecured** chỉ ghi khi hành động dời đèn đã được server xác nhận, không vì lời thì thầm hoặc animation chưa hoàn tất. Ma không tự cầm đèn, kéo khăn hay tạo tai nạn. Nhà bỏ trống vẫn là điểm khám phá/nghỉ **tùy chọn**, không phải nhà mặc định của mọi PC ma.

### G-N2 / G02 — Hương cơm chiều

> Một làn khói mỏng bay lên từ mái bếp. Trong gió thoảng mùi cơm mới.  
> Qua khung cửa, có người đang xới cơm cho cả nhà.

- **Đứng nhìn qua cửa:** thấy sinh hoạt gia đình.
- **Thử chạm chiếc bát:** bàn tay đi qua, không loot.
- **Nghe họ trò chuyện:** mẩu chuyện ấm áp, có khi nhắc người thân đã khuất.
- **Đi tiếp:** không bắt nhiệm vụ.

Biến thể:

> **Đứa bé:** “Sao hôm nay mẹ để thêm một cái chén?”  
> **Người mẹ:** “Mẹ nhớ bà ngoại thôi.”

Không gán bà ngoại đó là PC ma hay HG27. Mùi cơm chiều là **cảnh người dân**, không mô tả vị sư ăn chiều. Nếu có cảnh cư sĩ cúng dường thức ăn cho sư, đặt trước ngọ theo giới luật được duyệt.

G02 có thể dẫn đến **một lời hồi hướng sớm khác** và ghi đã nghe, nhưng không tự đánh dấu cao trào G06.

### G-N2 / G03 — Chiếc túi kim chỉ

> Dưới bậc thềm nhà bỏ trống có chiếc túi vải nhỏ.  
> Một sợi chỉ xanh lộ ra, mắc vào mép gạch.

- **Thử nhặt túi:** ngón tay xuyên qua; túi vẫn ở đó.
- **Nhìn kỹ:** nhớ vị trí/đặc điểm vào Sổ.
- **Theo tiếng gọi phía giếng:** gặp bà cụ tìm túi.
- **Rời đi:** không khóa tuyến.

> **Bà cụ:** “Lạ thật. Rõ ràng hồi chiều còn cầm trên tay.”

- **Thì thầm “Ở bậc thềm…”:** bà thoáng nghe, có thể tự nhớ.
- **Làm lá rung gần chỗ túi:** bà chú ý nếu có mặt trong vùng.
- **Gợi giấc mơ nhỏ:** chỉ mở nếu đã có dreamAnchor từ ký ức bà từng kể, không điều khiển tâm trí người sống tùy ý.
- **Để bà tự tìm:** NPC schedule tiếp diễn, không giữ quest chờ vô hạn.

**Khi bà thật sự tìm được túi:**

> Bà cúi xuống, kéo chiếc túi ra khỏi bậc gạch.  
> **Bà:** “Đây rồi! Cứ tưởng mất đâu.”  
> *Bà phủi bụi, nhét cây kim vào trong rồi cười một mình.*

- **Ở lại nhìn bà một lát:** ghi khoảnh khắc, không tự thưởng Bi/Tùy hỷ.
- **Theo bà về giếng:** hậu cảnh bà vá quai thúng.
- **Đi tiếp:** quest hoàn thành nếu kết quả đã được server ghi.

G03 độc lập với HG05 rau má và bí mật Hạnh; bà cụ này **là người còn sống**, khác NPC bà ngoại ngạ quỷ và bà Sáu. Nếu NPC tự tìm túi không nhờ hint của PC, ghi **kết quả thế giới**, không tự nhận PC đã giúp.

### G-N3 / G04 — Bến Không Tiếng

> Nước chảy qua những hòn đá phủ rêu.  
> Bạn men theo dòng suối.  
> Bỗng tiếng nước nhỏ dần, rồi im hẳn.  
> Thay vào đó là tiếng mái chèo từ rất xa.

- **Ngồi xuống nghe:** mở phân biệt ba âm thanh.
- **Nhìn khe đá:** vệt sáng bạc trên mặt nước.
- **Men bờ suối:** một góc gần ao sen.
- **Quay về rừng tre:** không khóa đường.

**Puzzle ngắn, không tính điểm:**

- **Tiếng lá tre cọ nhau:** thấy bờ cỏ, quay lại được.
- **Tiếng sỏi trong nước:** một vũng nước trong.
- **Tiếng mái chèo:** lối khuất qua khe đá tới **Bờ Chìm**; sau một lần chọn khác có gợi ý nhẹ.

Suối vẫn chảy xuôi như tự nhiên. Điều kỳ ảo là PC ma nhìn thấy **lối bên kia lớp bóng nước**; không dùng vết nước chảy ngược. Không tặng thẻ Niệm/Định vì chọn đúng.

**Ba nơi ở Bờ Chìm:**

1. **Giếng cạn:** nhìn xuống thấy bầu trời đầy sao; ngẩng lên chỉ một vầng trăng — dấu khám phá.
2. **Xóm không khói:** có tiếng người từ căn nhà sáng đèn; vòng ra cửa sau tiếng nói ngừng; không ép giải ngay.
3. **Ba cột đá:** mặt sau có dấu khắc, gợi còn một phía mà PC sống có thể nhìn thấy từ **Bờ Nổi**.

> Tiếng mái chèo xa dần. Con đường về rừng tre vẫn ở đó.

Không bắt gặp thần/ma mới liên tục; người giữ bến chỉ xuất hiện theo lịch/cửa sổ storylet. Không tiết lộ ngay kết cục Hạnh.

### G-N4 / G05 — Bà Sáu nhớ một nửa

> Dưới gốc gạo có bóng người đứng nhìn về làng.  
> Một tiếng guốc vang lên. Bà quay lại rất nhanh, rồi đứng im.

- **Đến hỏi chuyện:** mở G05.
- **Quan sát từ xa:** dấu cảnh.
- **Đi qua:** tự do.

> **PC:** “Bà đang đợi ai vậy?”  
> **Bà Sáu:** “Một người lâu rồi chưa thấy.”  
> **PC:** “Bà còn nhớ người ấy đi đâu không?”  
> **Bà Sáu:** “Nhớ tiếng nước. Mấy chuyện khác cứ lẫn vào nhau.”

- **Hỏi về tiếng nước:** lời kể chưa đủ chứng cứ.
- **Kể chuyện ở bến:** chỉ khi PC đã tới G04.
- **Ngồi cạnh bà:** cảnh tĩnh, không cấp thẻ.
- **Chào bà:** đi tiếp.

**Người giữ đò ở Bờ Chìm** (nếu gặp):

> **Người giữ đò:** “Đêm ấy có tiếng trẻ con khóc.”  
> **PC:** “Ông có thấy đứa trẻ không?”  
> **Người giữ đò:** “Không rõ. Mưa lớn quá.”

Gặp lại bà Sáu:

> **Bà:** “Có phải đứa trẻ đã qua được bờ không?”

- **Cháu chưa biết:** ghi câu trả lời chân thực, NPC phản ứng tin cậy.
- **Kể đúng lời đã nghe:** Sổ ghi *lời kể*, không phải sự thật xác nhận.
- **Để cháu tìm hiểu thêm:** chỉ ghi lời hứa nếu người chơi thực sự chọn cam kết.
- **Ở lại với bà:** khoảnh khắc ấm áp.

Không có nút “Giải thoát bà Sáu”. G05 có thể gặp từ gốc gạo mà không vào G04; thiếu bến chỉ thiếu một lựa chọn thoại. Twist Hạnh và mối liên hệ ông Tư chỉ mở khi PC thu đủ chứng cứ ở tuyến phù hợp; không truyền spoiler từ PC khác.

### G-N5 / G06-S01 — Hù hay ngồi cạnh

> Một vị sư ngồi gần ngôi mộ thấp.  
> Ông sửa lại mép y rồi ngồi yên.  
> Gió thổi qua ngọn cỏ; ông chưa nhìn thấy bạn.

- **Làm lá chạy quanh tọa cụ:** sư giật mình, mở mắt tìm tiếng.
- **Cho bóng lướt qua mép trăng:** sư khựng, có thể sợ nhẹ rồi bình tĩnh.
- **Ngồi cách ông một ngôi mộ:** nghe gió và tiếng thở; không tự nhận thiện/thẻ.
- **Đi hù người khác:** rời tự do; anti-spam và phạm vi an toàn vẫn áp dụng.

> **Sư:** “Có gì vừa đi qua đó?”  
> *Ông nhìn quanh. Chỉ thấy lá tre rung trên nền đất.*

Không biến phản ứng sợ thành lời phán xét. Nếu PC Ma quay lại, sư có thể phản ứng khác theo bối cảnh. Hù PC thật **chỉ khi bên nhận opt-in**, có mute/block/report và hiệu ứng nhẹ.

### G-N6 / G06-S02 — Một lời không gọi tên ai

**Trigger:** NPC sư theo lịch hoặc PC sư/dân đã thực sự chọn hồi hướng hợp lệ; PC ma chủ động nghe. Không tự sinh từ chat tự do.

> Bên kia bức tường có tiếng chuông nhỏ.  
> Một vị sư đang hồi hướng sau thời tu tập.  
> **Sư:** “Xin chia sẻ phước lành này đến những chúng sinh đang chịu khổ. Mong tất cả được an vui.”  
> Gió vẫn thổi qua những ngôi mộ cũ.  
> **Đêm không sáng lên. Chỉ bớt lạnh một chút.**

- **Ở lại nghe hết:** ghi mốc đã nghe lời hồi hướng; không auto kết truyện.
- **Thầm hoan hỷ với việc thiện ấy:** phản ứng nội tâm game mô phỏng, không tự kết luận công đức/đắc quả, chưa tặng thẻ.
- **Nghĩ về một người từng gặp:** hồi tưởng đúng event đã xảy ra.
- **Đi tiếp:** không phạt.

**Hồi tưởng theo sự thật riêng của PC:**

- Đã giúp **ông Tư**: “Ngọn đèn đã được dời xa chiếc khăn. Ông Tư chẳng biết ai nhắc.”
- Đã giúp **bà cụ**: “Chiếc túi kim chỉ nằm trong tay bà; bà vá lại quai thúng.”
- Đã gặp **bà Sáu**: “Bà vẫn nhìn về con đường. Có những câu hỏi bạn chưa biết trả lời.”
- Chưa có dữ liệu: “Một chiếc lá rơi ngoài tường. Bạn đứng nghe tiếng gió thêm một lúc.”

**Nghe hồi hướng khác với tùy hỷ theo giáo lý;** cơ chế này là story fiction/game_interpretation, cần giáo thọ duyệt lời và cách diễn đạt. Không bảo mọi ma nghe hồi hướng chắc chắn được giải thoát, không tạo Niệm/Định cho ma.

**Shared event:** server xác nhận eventId, actor, vị trí/vùng nghe, thời gian, opt-in, receiverCharacterId và idempotency. Không lộ người nghe vô hình/địa điểm ẩn. NPC fallback luôn có.

### G-N7 / G07 — Bình minh trên tán gạo (khép **chương**, không khép **kiếp**)

> Phía trên tán gạo, trời bắt đầu sáng.  
> Những mái nhà hiện dần sau màn sương.  
> Con đường về phía rừng tre vẫn còn đó.  
> Hôm nay bạn muốn đi đâu?

- **Mình còn muốn khám phá:** tiếp tục gameplay.
- **Nhìn lại những gì đã trải qua:** xem tối đa ba ký ức xác nhận theo nhân vật.
- **Khép chương bảy đêm:** ghi G07.chapterClosed; tiếp tục gameplay và các mạch chưa xong, không khóa thế giới.
- **Chưa chọn, đi dạo đã:** trở lại map.

**Mở cảnh tổng kết:** khi đã có vài khoảnh khắc khác nhau của chương giới thiệu (quan sát/giúp người/khám phá/nghe chuyện), **không buộc đủ bảy đêm hay nghe G06**. Đây là một lời mời, không là bài kiểm tra đạo đức. Nếu người chơi chỉ đi dạo, có thể tự chọn xem cảnh sau một thời gian khám phá đủ gợi ý; không cần hoàn thành G01/G03. Đã khép vẫn còn các tuyến G01–G06.

Hồi tưởng lấy từ 3 event thực sự xảy ra, không bịa chuyện đã hồi hướng/đã giúp:

> Có những con đường bạn đã đi qua.  
> Có những câu chuyện mới chỉ nghe một nửa.  
> Và vẫn còn những nơi chưa từng đặt chân tới.  
> Trời sáng rồi.

Không có “chưa đủ thiện”, “thiếu điểm nghiệp” hoặc auto-kết-kiếp.

### E01 — Kết thúc kiếp ma (ending **riêng, sau này**)

**E01 không phải G07.** Đây mới là tùy chọn **terminal** khi đã có nhân duyên/sự kiện đủ ý nghĩa theo kịch bản được duyệt (không phải công thức cộng điểm thiện, không buộc làm đúng hai quest G01 hoặc G03). Không khẳng định tái sinh cõi nào, không đồng nhất tái sinh với Niết-bàn.

Hai bước xác nhận hậu quả thật: tiếp tục hành trình, hoặc khép lại hành trình nhân vật. Sau E01: status story_completed, nhật ký/album còn, chỉ vào **Chế độ đi dạo** ở nơi đã khám phá, không sinh quest/thẻ/landmark/event mới, không tự thành PC người/deva/thọ thần. Đây là trạng thái theo [Journey Memory §0.5](journey-memory-and-return-ux.md) và [Role Transition §3](role-transition-and-spoiler-isolation.md).

## 5. Kho cảnh nhỏ — thế giới không chỉ có quest

| Cảnh | Tín hiệu | Tương tác tùy chọn | Kết quả |
|---|---|---|---|
| Con Vàng trong đêm | nhìn khoảng trống | Làm lá rung / Đứng yên | sủa hoặc nằm xuống |
| Đom đóm bên suối | đốm sáng trôi gần nước | Đi theo / Ngồi xem | mở góc cảnh |
| Nhà hoang ngày mưa | giọt nước qua mái thủng | Đứng nghe / Đi vòng hiên | âm thanh/hình theo thời tiết |
| Lá bên bia đá | lá khô mắc cạnh bia | Làm lá lay / Nhìn kỹ | dấu âm thanh/cảnh |
| Bếp ông Tư | tìm que nhóm lửa | Quan sát / Gây tiếng nhỏ | biến thể thoại |
| Chuông đầu ngày | vọng từ tịnh thất | Nghe / Đi tiếp | cảnh hoặc manh mối |
| Bậc giếng | bà cụ vá quai thúng | Đứng xem / Đi tiếp | hậu cảnh nếu G03 đã xong |

Một storylet không được lặp hai lượt liên tiếp; khi NPC world state thay đổi, sử dụng hậu cảnh tương ứng, không phát lại cảnh “chưa từng gặp”.

## 6. Event và state contract tối thiểu

> Design-only. Event log theo characterId/storyInstanceId là nguồn bền, checkpoint/projection dẫn xuất. Không dùng Save.history (giới hạn dòng UI) làm nguồn sự thật.

~~~js
{
  MN02: {
    grannyMessage: "none|heard|relayed",
    herbsDeliveredEventId: null
  },
  MN06: { dedicationEventId: null },

  G01: { lampSecuredEventId: null, scareEventIds: [] },
  G02: { scentEncountered: false, earlyDedicationEventId: null },
  G03: { bagLocationDiscovered: false, bagReturnedEventId: null },
  G04: { shadowPierArrivedEventId: null },
  G05: { heardReportIds: [], meaningfulEncounterEventId: null },
  G06: { fullDedicationHeardEventId: null, reflectionSeen: false },
  G07: { chapterClosedEventId: null },
  E01: { endingEventId: null }
}
~~~

1. **NPC outcome vs PC credit:** NPC/túi/đèn thuộc world/story instance; PC chỉ được ghi là người giúp khi có **causal hint/event** hợp lệ dẫn đến outcome. NPC tự tìm được túi thì thế giới thay đổi, nhưng không auto G03.helpedGranny.
2. **Commit trước, trình diễn sau:** server xác nhận outcome (và event) bằng transaction/idempotent action; animation được render từ outcome. Nếu người chơi thoát giữa cảnh, reload không ghi thiếu hoặc nhân reward.
3. **Tách G02/G06:** lời hồi hướng sớm ở G02 không mặc định hoàn thành full dedication G06.
4. **Phân biệt story scope:** Với MVP solo, NPC outcome gắn với story instance của PC. Với multiplayer/shared-world phải định nghĩa shared instance, đồng bộ hậu quả và phân bổ credit trước khi code; không trộn hai mô hình.
5. **Idempotency:** key ít nhất theo actorCharacterId, storyInstanceId, actionId, eventId; server kiểm sự kiện nguồn. Mỗi dedicationEventId/receiverCharacterId chỉ ghi một lần.
6. **Spoiler isolation:** PC khác cùng account không copy thẻ, lời hứa, điều đã xác nhận hoặc hồi tưởng; sự thật canon của NPC không bị thay tùy PC.
7. **G07 khác E01:** G07.chapterClosed không cấm gameplay; E01.story_completed cấm sự kiện mới và chỉ cho đi dạo.
8. **Không thêm sổ:** dùng Sổ Hành Trình đã quyết định, cùng sourceType observation/report/evidence và loreBasis canonical/commentary/game_interpretation/fiction.

## 7. Lát cắt và acceptance

### Slice A — Ma đáng chơi: G-N1, G-N2, G-N5

- [ ] Spawn nghĩa địa, tự do đi lại, thử cỏ/bia/đèn có phản hồi nhất quán.
- [ ] Ông Tư **sợ thật** khi bị hù rõ; có hậu cảnh dí dỏm và chống spam.
- [ ] Thẻ theo động cơ đã kể, không từ fearState.
- [ ] Túi kim chỉ chỉ người sống nhặt; có thì thầm/anchor giấc mơ, không cầm item.
- [ ] Bà tự tìm được túi qua NPC schedule nếu không có PC khác; credit PC chỉ khi có causal hint.
- [ ] Hù sư hoặc ngồi cạnh đều hợp lệ, không ép người chơi làm thiện.

### Slice B — Sư: MN01, MN02, MN06

- [ ] Spawn chiều muộn, bát sạch/rỗng, không gợi ăn đêm.
- [ ] Sư không có nút hái rau hay sai bảo trái quy định; PC dân vẫn làm HG05, **trả cho đúng bà**.
- [ ] Sư bị hù phản ứng thân thể ngắn và tự chọn tiếp tục/rời đi.
- [ ] Hồi hướng phải là hành động phù hợp, không từ chat tự do.
- [ ] Không nhận Niệm/Định tự động vì ngồi một buổi hoặc bị hù.

### Slice C — Bờ Chìm: G-N3, G-N4

- [ ] Suối chảy xuôi; lối ma qua khe đá rừng tre, không cần qua nhà hoang.
- [ ] Puzzle tiếng nước ngắn, không phạt nặng, không tự cấp Niệm/Định.
- [ ] Ba marker đáng khám phá, không dồn NPC ma xuất hiện liên tục.
- [ ] Người giữ đò không tự reveal Hạnh; lời kể chưa xác minh không thành canon.
- [ ] Không lộ manh mối sang PC khác.

### Slice D — Hồi hướng và khép chương: G-N6, G-N7

- [ ] NPC fallback; nghe lời hồi hướng chủ động, server xác minh nếu là shared event.
- [ ] Không auto nhận thẻ hoặc kết thúc kiếp.
- [ ] Hồi tưởng chỉ dùng event đã xảy ra; không thêm Sổ khác.
- [ ] G07.chapterClosed cho phép chơi tiếp; E01.story_completed chỉ đi dạo ở vùng đã mở.
- [ ] Save/reload mỗi bước không nhân event, không bỏ mất trạng thái; 2 thiết bị không double claim.

## 8. Cần duyệt và đồng bộ trước code

- [ ] Chủ project duyệt quyết định **G07 = chapter close; E01 = terminal ending**. Sau khi được duyệt, cập nhật chi tiết G07 trong [Ghost Episode Pack 02](ghost-episode-pack-02.md), [Ghost Campaign Bible](ghost-playable-campaign-bible.md), và entry index. Trong PR này ghi rõ xung đột, không âm thầm coi nội dung cũ đã được thay.
- [ ] Giáo thọ Theravāda duyệt cách nói về Pācittiya 11, giờ thọ thực, y phấn tảo, hồi hướng và tùy hỷ; từ ngữ giả tưởng phải có nhãn phù hợp.
- [ ] Art/gameplay review tính khả thi của animation sợ, bóng lướt, nghe tiếng nước, hiệu ứng mưa, phản hồi ít chữ trên mobile.
- [ ] Chốt mô hình NPC instance cho solo và shared-world trước khi triển khai multiplayer.
- [ ] Không sửa code/asset trong PR tài liệu; không chạm branch experiment/qls-ideas.

## 9. Câu kết của chương mở đầu

> Đêm qua đã có những chuyện xảy ra.  
> Sáng nay, ngõ làng vẫn có tiếng người.  
> Bên rừng tre, nước vẫn chảy.  
> Có những câu chuyện chưa có lời kết.  
> Cũng chẳng sao.  
> **Con đường vẫn còn đó.**
