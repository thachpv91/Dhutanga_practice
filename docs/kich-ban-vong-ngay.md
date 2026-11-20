# Kịch bản vòng ngày: sống chậm, học tâm, mỗi đêm một chuyện mới

> **Thiết kế mở rộng — không phải toàn bộ đã triển khai.** Đây là bản nội dung để triển khai dần sau khi duyệt PR trên `develop`; **không** merge ngược vào nhánh `experiment/qls-ideas` đang deploy. Tham chiếu [he-thong-tam.md](he-thong-tam.md), nhất là mục 4, 9, 15–17. Nội dung liên quan giáo lý, nghi thức, đầu-đà và tâm sở phải được một vị thầy Theravāda kiểm tra trước khi phát hành.

> **Nguyên tắc mới áp dụng cho mọi nhiệm vụ (07-11-2026):** [Game Design Principles](game-design-principles.md). Người mới được **đi dạo, khám phá trước khi nhận quest/khảo sát tâm**. Sự kiện tại NPC và địa danh cần người chơi chủ động nhấn tương tác, không tự popup khi chỉ đi ngang. Có thể nhận/hoãn/khước từ một nhiệm vụ; nếu đã nhận lời thì NPC ghi nhớ để nhân quả không đứt. Kiến thức, vật liệu, cảnh quan và lời hẹn là phần thưởng hợp lệ, không bắt mọi nhiệm vụ rơi thẻ. Kết quả offline **có thật** nhưng không cấp chứng đắc hay thẻ tu tập từ đồng hồ.

> **Identity & voice mới (08-11-2026):** xem [Player-centric Narrative Model](player-character-narrative-model.md). Nhân vật người chơi (**PC**) do họ đặt tên và chọn `monk/villager/ghost`; **Sư Tịnh, Ông Tư, Bà Sáu là NPC**. Các tuyến B/C bên dưới là chuyện NPC mà PC có thể gặp/nghe/tìm hiểu; tuyến A là **việc của PC sư** được NPC hướng dẫn. Các đoạn cũ viết “người chơi là Ông Tư/Bà Sáu” chỉ thuộc code legacy; không phải hướng mới. **Lời thoại ngắn, gần gũi, không giáo điều**; không bắt xem cả chương để đi dạo. Tài liệu là thiết kế, chưa sửa mã/chuyển save.

## 1. Lời hứa với người chơi

Một ngày không cần làm nhiều; chỉ cần **một việc có ý nghĩa, một điều bất ngờ, một phút nhìn lại**.

- **Chơi 2–3 phút:** xem "Trong lúc vắng", nhận một lời hẹn, giao một việc phù hợp vai; không hụt thưởng.
- **Chơi 10–15 phút:** một nhiệm vụ chính + một việc tự chọn + quán xét.
- **Chơi 20–30 phút:** thêm khám phá, trò chơi tương tác, nghe kinh hoặc kinh hành.
- Không bảng xếp hạng công đức, năng lượng, phạt vắng, ép online, hay thẻ tu chứng. Thẻ chỉ là **dấu đã học/nhận diện trong mô phỏng**, không phải chứng nhận tâm thật.
- **Mỗi vai PC có logic hành động riêng:** PC sư tu học/giữ hạnh; PC dân làm việc thiện; PC hồn ma quan sát, nghe, tìm hiểu trong câu chuyện **riêng của mình**. **NPC Bà Sáu** giữ ký ức chờ Hạnh, không được gán sang PC ma. Hồn ma **không bế trẻ, nhặt vải, nấu cơm, dắt người sống**.

> **Thời tiết cũng là ngữ cảnh kể chuyện:** xem [Human World Story Bible](human-world-story-bible.md) để biết W01 *Mưa trên mái tịnh thất*, W02 *Bão qua làng*, W03 *Sau cơn mưa, ao sen* cùng 12 storylet theo vai × địa điểm × ngày/đêm × thời tiết. Không chỉ thêm animation mưa: khi mưa phải đổi hoạt động và cảnh; trước/sau bão có NPC, hậu quả và cách hồi phục. Không tự popup bắt làm nhiệm vụ, không khuyến khích ra ngoài khi bão, không thưởng bất thiện hay chứng đắc do thời tiết. Đây là **đề xuất chưa code**.

> **Bộ kịch bản Nhân gian mới:** [Human World Playable Scenarios](human-world-playable-scenarios.md). Phần nội dung ưu tiên trước khi mở rộng cõi giới: học kinh lúc vắng có kiến thức thật, lời hứa rau má, ký ức bà Sáu, ao sen/trăng/ánh đèn và các sinh hoạt nhỏ. Bầu trời đẹp được giữ làm cảm giác chủ đạo; bão chỉ là câu chuyện tùy chọn, không tự xảy ra khi người chơi đang dạo.

## 2. Vòng ngày chung, nhưng không bắt buộc chơi đủ một lượt

| Buổi trong game | Cảm giác | PC nhà sư | PC người dân | PC hồn ma |
|---|---|---|---|---|
| Rạng sáng | thanh, có định hướng | kinh hành, khất thực; có thể gặp Sư Tịnh | ra giếng, thấy Ông Tư nhóm bếp | quan sát người qua đường, tìm dấu tích |
| Buổi sáng | có tay nghề | quét sân, giặt vải, nhận bát | giúp bà cụ, dệt vải, trả đồ | quan sát một vật gợi chuyện **của NPC** |
| Chiều | lựa chọn, ngã rẽ | vá y, học với sư già, vào rừng | nghe tin đồn, gặp Ông Tư, giúp việc | thấy tiếng rao xôi gợi chuyện bà Sáu |
| Đêm | tĩnh và bất ngờ | ngồi thiền, nhận diện triền cái | nghe pháp, soi đèn, giữ lời hẹn | nghe tụng kinh, quan sát/đối diện tình huống riêng |
| Cuối đêm | một dấu chấm | quán xét, hồi hướng phù hợp vai | ghi việc đã làm, lời hẹn | ghi dấu đã thấy/nghe; không ép "siêu thoát" |

**Lịch tự do:** người chơi có thể chơi ngay nhiệm vụ đang mở, thực hành riêng, hoặc kết thúc đêm. Việc hoàn tất một `runId` mới chuyển sang ngày/đêm kế tiếp; đăng nhập lại giữa đêm phải tiếp tục đúng chỗ. Phân biệt `gameDay` với ngày thực; ngày rằm ngoài đời là sự kiện trang trí/tùy chọn, không khóa phần thưởng.

**Chống lặp:** mỗi ngày rút 1 nhiệm vụ tuyến chính còn dang dở, tối đa 2 tình huống sinh hoạt, 1 tình huống ngẫu nhiên; cùng một mẫu không xuất hiện 2 ngày liền. Tình huống chọn theo `role + place + phase + questState + recentStorylets + cards + inventory`. Hoàn thành hoặc bỏ qua đều ghi vào lịch sử để thay câu chuyện hôm sau.

## 3. Tuyến A — PC nhà sư: "Tấm y màu đất" (5 ngày, Sư Tịnh/sư già là người hướng dẫn)

Y phấn tảo không phải vật phẩm rơi ngẫu nhiên hay mua bằng điểm. Đây là hành trình **tìm đúng mảnh vải không còn chủ, làm sạch, nhuộm, khâu, rồi học cách dùng**. Các chi tiết thực hành y phấn tảo/hạnh đầu-đà cần kiểm chứng về luật và truyền thống.

| Ngày | Nơi, điều kiện | Cảnh ngắn và hành động trên thế giới | Biến thể/tâm sở | Dấu vết |
|---|---|---|---|---|
| 1 – Nhìn thấy | đường ngoài nghĩa địa, sáng/chiều, vai sư | PC sư nhìn thấy một mảnh vải vướng cành. **Xem kỹ**: đây là vải bị bỏ, không phải áo đang phơi; có thể nhặt hoặc để nguyên. | Vội giật lấy → thấy sự nôn nóng; quan sát rồi nhặt → Niệm/Không tham *nếu đã có minh chứng* | `robe.step=collected`; vải cũ trong túi |
| 2 – Giặt | giếng làng, ngày kế | Nước đục chảy qua mép vải. **Giặt lần lượt**: nhúng, vò, xả, phơi. Có thể nhờ dân làng chỉ chỗ phơi, nhưng không để họ tu hộ. | Làm vội → phải xả lại; kiên nhẫn → Tinh tấn nếu đã mở bài học | `washed`; thay hình vải |
| 3 – Nhuộm | cạnh tịnh thất, sau phơi | Dùng nguyên liệu màu đất được chuẩn bị phù hợp; đun, ngâm, phơi. Màu không đều cũng có câu chuyện. | Bám vào "phải đẹp" → gặp Tham; chấp nhận màu giản dị → Không tham | `dyed`; hình vải màu đất |
| 4 – May | hiên tịnh thất, ngày kế | **Nối các mảnh** bằng thao tác xếp, luồn kim, khâu vài đường. Khi rời game có thể giao "chuẩn bị kim chỉ", nhưng đường may quyết định phải chơi trực tiếp. | Tâm động → có thể nghỉ đi kinh hành; tập trung vào mũi kim → Niệm, có cơ hội Định mức đời thường | `sewing`; hiển thị % tiến độ thủ công |
| 5 – Hoàn thành | tịnh thất, có sư già | Khâu mũi cuối, giũ y, nghe lời nhắc về việc dùng đúng mục đích. **Không có lễ tăng phẩm hay chứng đắc.** | Không tham hoặc Tín tùy trải nghiệm, không tự động | `finished`; mở trang phục y màu đất + cột mốc "Tấm y đầu tiên" |

**Lời thoại mẫu — Ngày 1**

> "Một mảnh vải vướng trên nhánh gai. Mưa đã làm phai màu."

- **Nhìn quanh xem có ai để quên:** "Không thấy người nhận. Bạn đứng chờ thêm một lát." → mở thao tác nhặt.
- **Nhặt vội:** "Gai mắc vào vải. Bạn chậm tay gỡ ra." → tự quan sát sự vội vã, không phạt.
- **Để lại:** "Chưa phải lúc. Mai đi qua vẫn còn con đường này." → nhiệm vụ không mất.

**Lời thoại mẫu — Ngày 4**

> "Kim đi qua hai lớp vải. Một mũi hơi lệch."

- **Tháo khâu lại:** sự cẩn trọng.
- **Giữ đường may giản dị:** chấp nhận điều chưa hoàn hảo.
- **Đứng dậy kinh hành ít phút:** mở hoạt động tùy chọn, rồi quay lại may tiếp.

**Biến thể nhiều lượt:** ngày mưa vải lâu khô, lời nhờ từ ông Tư giúp phơi, thiếu kim có thể hỏi sư già, một mảnh rách phải vá. Đây là thay đổi câu chuyện, **không phải khóa vĩnh viễn**. Khi xong y, nhiệm vụ "vá y sau một mùa mưa" có thể tái xuất (không thưởng lại skin/thẻ theo lối cày).

## 4. Tuyến B — NPC Bà Sáu: "Tiếng guốc trong sương" (5 lần khám phá)

**Chủ truyện là `npc.ba_sau`, không phải PC hồn ma.** Bà có quá khứ với Hạnh và biến cố nước lớn. PC ở cả ba vai có thể tìm manh mối; PC ma có thể nghe hoặc quan sát bà khi phù hợp bối cảnh, nhưng **không nhận ký ức mẹ con của bà làm tiểu sử mình**. Truyện là sáng tác hư cấu có chất liệu Phật học, chưa khẳng định "siêu thoát" hay quả báo nhất định.

| Lượt | Tín hiệu từ xa (không popup) | PC chọn tương tác | Điều được biết / kết quả |
|---|---|---|---|
| 1 — Bóng người dưới gốc gạo | thấy một bà đứng quay mặt về làng | `Đến gần` / `Đứng nhìn` / `Đi tiếp` | bà nói mình chờ một người, `metBaSau` |
| 2 — Tiếng guốc sau bụi tre | dấu chân người sống, tiếng guốc lẫn gió | `Quan sát` / `Hỏi người dân` | biết có người sống đi qua; không được mặc định là Hạnh |
| 3 — Ngoài tịnh thất | tiếng tụng kinh từ xa | `Nghe cùng bà` (ma phù hợp) / `Hỏi sư` (người sống) | câu chuyện bà được hiểu thêm, không cấp Định/Niệm tự động |
| 4 — Trước mộ cũ | đồ vật từng thuộc về gia đình | `Xem dấu khắc` / `Nghe chuyện` | manh mối về Hạnh, không cho ma nhặt đồ vật |
| 5 — Trở lại gốc gạo | bóng đứng khác vị trí một chút | `Hỏi bà về người đang chờ` / `Đi tiếp` | bà có lời thoại mới theo manh mối, lưu `npc.ba_sau.arcStage` trong timeline |

**Đối thoại mẫu, ngắn:**

> **PC:** “Bà đợi ai ở đây ạ?”
>
> **Bà Sáu:** “Bà đợi một người. Có khi lâu quá rồi.”
>
> `Hỏi tiếp` / `Đứng cạnh một lúc` / `Đi tiếp`.

Trường hợp đã tìm ra tên Hạnh có thể mở câu hỏi mới, không ép câu chuyện kết bằng bà rời cõi. **Hồi tưởng NPC không rơi thẻ tâm cho PC**. NPC bà Sáu không bế trẻ/hái sen/giao vật cho người sống.

## 5. Tuyến C — NPC Ông Tư: "Món nợ ba bát xôi" (4 lần gặp)

**Chủ truyện là `npc.ong_tu`.** Ông có con Vàng, vợ và món nợ xôi bà Sáu; **PC người dân không tự có gia đình/món nợ của Ông Tư**. Cả ba vai có thể thấy các dấu tích theo góc nhìn, người sống có thể trò chuyện và giúp đỡ phù hợp.

1. **Lượt 1 — Giếng làng:** bà cụ vô tình nhắc người bán xôi năm trước. PC chọn hỏi bà hoặc đi tiếp. Nếu đã gặp Ông Tư, thêm câu hỏi nhẹ, không "giải mã" hết truyện.
2. **Lượt 2 — Gặp Ông Tư bên hiên:** ông nhìn nồi xôi, lặng một lát. PC dân có thể hỏi thăm, PC sư nghe ông kể, PC ma quan sát cảnh. Ông chưa nhất thiết thừa nhận ngay.
3. **Lượt 3 — Một việc nhỏ:** người sống **tự chọn** phụ gói xôi đem chia cho người khó khăn hoặc góp việc khác; nếu không tham gia, Ông Tư vẫn có thể tự làm và NPC đổi hành vi. Không đưa đồ trực tiếp cho bà Sáu như vật thể.
4. **Lượt 4 — Điều chưa nói:** Ông Tư kể một câu ngắn về việc hồi nhỏ có người cho ăn chịu. PC có thể lắng nghe, hỏi thêm, hoặc ra ngõ ngắm đèn. Lời ông đổi theo lịch sử; người chơi nhận lore, ký ức lần gặp, không cộng thẻ bằng việc nghe.

**Đối thoại mẫu:**

> **Ông Tư:** “Tôi còn nợ người ta ba bát xôi.”
>
> **PC:** “Ông định làm gì?”
>
> **Ông Tư:** “Chưa biết. Nhưng chắc phải bắt đầu từ việc nhớ cho rõ.”

**Payoff:** một chiếc đèn ngõ, nồi xôi chia người khác, lời bà cụ mới và dấu Sổ khám phá; mỗi người có timeline riêng nếu chưa có hệ shared-world sync. Không ép phải nghe đủ bốn lần mới được khám phá làng.

> **Mạch kỳ ảo đầu game ưu tiên HG27:** [Nhiệm vụ bà ngoại ngạ quỷ](human-world-early-mysteries-and-peta-quest.md). Được thấy sớm, chủ động giúp, bố thí/hồi hướng, giữ cảnh bà sáng lên rồi biến mất. Thẻ đúng mốc: **Bi** khi nghe và chọn giúp; **Không tham** trong lúc bố thí để hồi hướng; **Tùy hỷ** sau hồi hướng khi vui vì bà được an/rời cảnh khổ. Không nhận thẻ do chỉ nhìn, cầm cơm hoặc mở popup; không spam ba màn thưởng.

## 6. Kho tình huống ngắn để không lặp nhiệm vụ

| ID | Vai | Điều kiện | Tương tác chính | Kết quả/đường mở |
|---|---|---|---|---|
| M01 | Sư | sáng, gần giếng | xách nước, chia sức | nếu trước đó nóng giận, có câu nhớ lại |
| M02 | Sư | sau buổi ngồi xao động | kinh hành từng đoạn ngắn | lượt tập quan sát, không tự có thẻ |
| M03 | Sư | đêm, trăng mờ | nghe cú, thở, nhận diện sợ | mở một thẻ nếu đủ điều kiện |
| M04 | Sư | đã giặt vải, trời mưa | tìm chỗ phơi, giữ vải sạch | biến thể `robe` |
| M05 | Sư | tịnh thất, đã đọc kinh | sư già hỏi một câu ứng dụng | học thêm mặt sau thẻ nếu trả lời qua tình huống |
| V01 | Dân | sáng, thấy gói đồ | tìm người đánh rơi | bài học thật thà, không chọn đáp án đạo đức sẵn |
| V02 | Dân | chiều, ông lái buôn đến | đẩy bánh xe, nghe một tin | mảnh bản đồ mới |
| V03 | PC dân | đi qua ngõ có con Vàng | gặp Ông Tư đang trông chó, hỏi chuyện nếu muốn | lời Ông Tư đổi, không bị chó cắn tự động |
| V04 | Dân | gần chùa, đêm | đặt đèn cho lối đi | người đi sau thấy dấu vết |
| V05 | Dân | đang dệt vải | chọn giữ một phần hay chia | lời hẹn ngày sau |
| G01 | PC ma | gốc gạo, chạng vạng | quan sát NPC bà Sáu đang nhìn người sống | `lore:ba_sau_01`, không gán ký ức bà cho PC |
| G02 | PC ma | nghĩa địa, đêm trăng | thấy hai mộ có hoa khác nhau | nhìn/chọn nghe chuyện, **không cướp hoa** |
| G03 | Ma | tường chùa, có dấu `chant` | ở lại nghe hoặc quay về | mở hồi tưởng |
| G04 | PC ma | giếng, trời sáng | thấy người bán xôi; hỏi chuyện bà Sáu nếu gặp | phân biệt lore NPC với trải nghiệm PC |
| G05 | PC ma | sương gần tan | chọn đứng nghe bà Sáu kể tiếp hoặc rời đi | thêm một mảnh truyện NPC, không ép tự 'buông' |

**Máy chọn storylet:** gắn `cooldownDays=2` cho mẫu thường, `once=true` cho dấu mốc, `weight` theo giờ/trăng/thẻ/sự kiện cộng đồng. Nếu không có mẫu hợp, cho người chơi **thực hành tự chọn** thay vì ép lặp "đưa rau / ngồi với sư".

## 7. Thẻ tâm: không phải cứ ngồi đủ giờ là được Niệm

Ba lớp cần tách: **chỉ số ngầm** (phục vụ cân bằng game), **trải nghiệm quan sát được** (nhấn/nhận diện/lựa chọn), **thẻ kiến thức** (đã từng gặp một hiện tượng trong game). Không lấy thẻ tâm sở làm bằng chứng một người thật đã có phẩm chất hay chứng đắc.

| Thẻ đề xuất | Khi nào có cơ hội mở (mô phỏng) | Tình huống không nên tự thưởng |
|---|---|---|
| **Niệm** (sati) | người chơi chủ động nhận diện xao lãng và quay lại đề mục nhiều lần | ngồi hết giờ nhưng không tương tác |
| **Định / Nhất tâm** (ekaggatā, samādhi theo ngữ cảnh) | sau nhiều buổi; một buổi thực sự ít gián đoạn, có hành động trở về đề mục | chỉ vì thanh "quả cầu" đầy; tuyệt đối không ghi "đắc định" |
| **Phóng dật** (uddhacca) | ở nhiều tình huống tâm bất thiện xao động; game cho lựa chọn nhận ra tâm lao xao | một ý nghĩ bất chợt trong đời thường chưa đủ kết luận "tâm bất thiện" |
| **Si** (moha) | kịch bản cho thấy nhầm lẫn/không thấy rõ và người chơi tự nhận ra sau khi kiểm chứng | không gán Si chỉ vì chơi kém hoặc bỏ lỡ nút |
| **Hôn trầm / Thụy miên** | khi ngồi, mí nặng, người chơi thử đối trị hoặc không | ngủ gật ngoài đời không phải "tội" |
| **Hoài nghi** (vicikicchā) | phân vân làm gián đoạn thực hành trong tình huống được viết rõ | câu hỏi tìm hiểu pháp chân thành không tự bị coi là hoài nghi bất thiện |
| **Tinh tấn** | chủ động tiếp tục một việc đúng sau khi gián đoạn, nhiều buổi | chỉ đếm số ngày đăng nhập |
| **Tín / Tuệ** | nghe/đọc một đoạn kinh và áp dụng vào hành động phù hợp | bấm "đã đọc" rồi đóng sách |
| **Không tham** | có lựa chọn thật giữa giữ và chia, không phải nhận thẻ tự động | công việc offline xong |

**Đặc biệt:** "Định" ở bài học **không đồng nghĩa thiền-na/đắc thiền**; nhất tâm (`ekaggatā`) là tâm sở biến hành, còn định thiện trong thực hành là phạm trù có bối cảnh. "Phóng dật" không đồng nhất với bất cứ suy nghĩ nào, "Si" không phải nhãn cho người học chưa giỏi. Phần ánh xạ chính xác cần thầy duyệt.

### Ví dụ thuật toán rơi thẻ (giá trị chỉ để prototype, cần thử người chơi)

```js
function candidateCard({ active, notes, missed, stableSeconds, practicedDays, eventTags }) {
  if (!active) return null; // không thưởng khi chỉ treo máy hoặc offline
  if (eventTags.includes('misunderstanding_seen')) return 'si';
  if (eventTags.includes('unwholesome_agitation_seen')) return 'phong_dat';
  if (practicedDays >= 2 && notes >= 3 && missed <= 2 && stableSeconds >= 25) return 'dinh';
  if (notes >= 2) return 'niem';
  return null; // còn lại: nhật ký và gợi ý thực hành, không phạt
}
```

- **Một buổi tối đa một thẻ chính**; không bắt buộc phải rơi thẻ; thẻ đã biết có thể mở mặt hoặc chỉ ghi "gặp lại", tránh spam.
- Vài tình huống có thể mở thẻ bất thiện để *hiểu*, không đồng nghĩa khen thưởng việc bất thiện.
- Chỉ phần việc người chơi **chủ động thực hành** mới có cơ hội mở thẻ. Hoạt động offline không tăng chỉ số tu chứng và không rơi thẻ.
- Sự may rủi nhỏ chỉ ảnh hưởng biến thể câu chuyện, không thay thế điều kiện quan sát được.

## 8. Thực hành tự do: menu "Hôm nay muốn làm gì?"

| Hoạt động | Tương tác thật | Kết quả có ý nghĩa |
|---|---|---|
| Ngồi thiền 2/5/10 phút | nhận diện một số xao lãng; giữ **một đề mục**, không chơi chạm liên tục để ăn điểm | nhật ký: mấy lần quay lại đề mục; thẻ **theo điều kiện** |
| Kinh hành 1–3 vòng | người chơi chọn điểm dừng, chú ý bước; không phạt nếu tạm dừng | tiến trình buổi tập, đôi khi nhiệm vụ gặp người trên đường |
| Học kinh | chọn đoạn ngắn có nguồn, đọc/nghe, chọn cách ứng dụng vào hoàn cảnh trong làng | sư hỏi lại hôm sau, không thưởng do click suông |
| Quét sân / xách nước | thao tác nhẹ, đủ đa dạng theo thời tiết | vật dụng, sự thay đổi của cảnh, quan hệ |
| May y | khâu từng mũi qua câu chuyện nhiều ngày | mảnh vải thay đổi trên hình nhân vật |
| Nghe pháp bên tường (vai ma) | chọn dừng lắng nghe/nhìn ký ức | văn bản hồi tưởng, không có tác động vật lý lên người sống |

Người chơi có thể **dừng giữa chừng, đi dạo, hoặc thoát**; lưu `practice.session` với `startAt, elapsedActiveSeconds, interruptions, notes, stage`. Không cho timer chạy như "đang thực hành" khi tab tắt. Có thể vào lại tiếp tục hoặc kết thúc một buổi chưa trọn mà không bị chê.

## 9. Vòng chơi "gieo — lớn — gặt": đi vắng phải có kết quả thật

> **Quyết định thiết kế mới (07-11-2026):** thay mô hình "việc khi vắng chỉ sinh lời kể" của bản đầu bằng **tiến trình có trạng thái, có kết quả hữu hình và có khả năng mở thêm cách chơi**. Đây là thiết kế **chưa được triển khai trong mã**. Đối chiếu mục 16.3 của [he-thong-tam.md](he-thong-tam.md); mục 18 ở đó đánh dấu thay đổi quyết định.

### 9.1. Tại sao người chơi sẽ muốn quay lại?

Lấy phép so sánh game làm vườn: gieo hạt → thấy mầm → tưới → cây lớn → thu hoạch. Trong game này: **giao việc có chủ đích → thấy việc tiến triển → nhận một kết quả có tên → cất vào sổ/túi → dùng kết quả trong tình huống tương lai**.

Tránh hai cực đoan: (1) chờ 8 giờ rồi chỉ nhận ba dòng chuyện kể; (2) treo game qua đêm rồi tự nhận mọi thẻ tu chứng. Chỉ khoảng vài phút trong game cũng cần được ghi nhận, nhưng không phải lần nào cũng tự sinh kiến thức mới nếu chưa hoàn thành phần học đó.

| Người chơi quay lại | Phản hồi bắt buộc | Kết quả/việc kế tiếp |
|---|---|---|
| Sau một lát | vị trí và tư thế của nhân vật; việc đã tiến tới đâu | một dấu tiến triển nhìn thấy, ví dụ đã mở kinh, đã đọc đến trang 2/4; có thể chuyển sang việc khác |
| Sau khi hoàn thành một **đơn vị công việc** | **màn nhận kết quả riêng**, một nội dung cụ thể | kiến thức đã nghe/đọc, vật liệu đã hoàn thiện, manh mối hoặc quan hệ; lưu vào sổ/túi và có thể sử dụng |
| Quay lại sau nhiều ngày | một kết quả cho **lượt giao việc đó**, không sinh hàng chục lượt giả | không phạt; xem điều đã xảy ra và chọn việc mới |

**Phân biệt:** kết quả có thể chắc chắn khi đủ điều kiện (một mẩu kiến thức/chiếc khăn/đoạn vải), còn sự kiện bất ngờ có thể thêm biến thể để tạo cảm giác sống động. Không dùng xác suất gacha để quyết định có được kiến thức cơ bản hay không. Định mức thời gian chỉ là cân bằng gameplay, không phải chỉ số đo tâm.

### 9.2. Phân biệt thẻ kiến thức minh họa và thẻ tâm sở trải nghiệm

> **Một nơi lưu:** kết quả học được ghi trong khu **Đã học** của [Sổ Hành Trình](journey-memory-and-return-ux.md); chỉ dùng màn **Trong lúc vắng** hiện có để thông báo, không tạo sổ hay popup riêng.

Cần hỗ trợ **nhận thẻ sau việc vắng** mà không ngụ ý nhân vật đã thực tu hay người chơi chứng đắc.

| | **Thẻ kiến thức / Đã học (Sổ Hành Trình)** | **Thẻ tâm sở qua trải nghiệm** |
|---|---|---|
| Nhận bằng | nhân vật **học kinh / nghe pháp / ôn bài** khi vắng hoặc người chơi đọc trong game | người chơi **chủ động đối diện, nhận diện, lựa chọn** trong tình huống/mini-game |
| Ghi nhãn | "Đã nghe về Niệm", "Đã học khái niệm năm triền cái" | "Đã gặp tình huống minh họa về Niệm/Phóng dật…" |
| Ghi vào | **Đã học (Sổ Hành Trình)**: chương, mục, đoạn học, nguồn, thời điểm, ví dụ | **Album thẻ tâm** và nhật ký trải nghiệm |
| Khi có lại | ôn/làm rõ mặt sau, mở ví dụ, kết nối khái niệm; không sinh bản sao vô hạn | theo quy tắc gặp lại của thẻ tâm, không tự lên cấp khi offline |
| Dùng về sau | thêm một lựa chọn đối thoại, biết tên hiện tượng, mở đoạn giảng/sự kiện phụ, gợi ý chính xác hơn | dùng hệ thống thẻ đối trị/nhận diện theo điều kiện active của mục 4b |
| Tuyệt đối không | ghi "đã chứng định", "đã đoạn trừ phiền não" | tự cấp do đồng hồ offline hoặc click nhận thưởng |

**Ba dấu hiệu chiều sâu của mục Đã học** (không phải thang khám phá khác):

1. **Đã nghe/đã đọc:** sự kiện kiến thức đã tiếp xúc được ghi cho nhân vật; hiển thị trên thang khám phá chung. Không tuyên bố đã hiểu sâu.
2. **Đã ôn:** người chơi mở mục kiến thức xem lại hoặc trả lời một câu liên hệ đời thường. Có thể xem không cần câu hỏi bắt buộc.
3. **Đã vận dụng trong truyện:** lựa chọn phù hợp trong một tình huống sau này; mở ghi chú "Bạn từng dùng điều này khi…". Không biến thành phép cộng "công đức".

Một kiến thức có thể chứa một **thẻ minh họa về tâm sở** nhưng đó vẫn là thẻ học, không được tự đặt vào Album thẻ tâm trải nghiệm. UI có thể dùng chung kiểu thẻ, nhưng nhãn và đường phát triển phải phân biệt được.

**Mẫu trang kiến thức:**

> **Năm triền cái — Những điều cản trở việc tu tập**  
> Đã nghe: đoạn giải thích ngắn về tham dục, sân, hôn trầm–thụy miên, trạo cử–hối quá, nghi.  
> Gợi ý: "Buồn ngủ lúc ngồi? Hãy nhận ra tình trạng ấy; có thể thử kinh hành."  
> Lần sau: "Sư già có điều muốn hỏi về một chướng ngại thường gặp."  
> Nguồn: liên kết đến kinh/bài giảng và ghi rõ đây là bản tóm ý của game, cần duyệt.

### 9.3. Kịch bản mẫu A — giao "Học một đoạn kinh", thoát, quay lại nhận thẻ kiến thức

**Lần vào thứ nhất (1–2 phút):**

- Tại kệ kinh hoặc màn **Việc khi vắng**, người chơi chọn *Học về năm triền cái* thay vì một mục mơ hồ như "Học kinh".
- Game hiện mục tiêu rất rõ: "Đọc một đoạn ngắn. Lần sau sẽ ghi vào mục Đã học của Sổ Hành Trình."
- Nhân vật ngồi mở sách. Lưu `activityId=study`, `lessonId=kn_five_hindrances_01`, `startedAt`, `status=running`, `role`. Người chơi thoát.

**Lần vào thứ hai:**

> **Trong lúc vắng**  
> Thầy đã đọc xong một đoạn kinh về những điều cản trở tâm yên. Có lúc mắt mỏi, thầy gấp sách nghỉ, rồi xem lại.  
> **Mở khóa kiến thức: Năm triền cái**  
> Đã lưu vào **Sổ Hành Trình → Đã học**.  
> Gợi ý: *Sư già có thể chỉ cho bạn cách nhận ra cơn buồn ngủ khi ngồi.*

Nút: **Xem kiến thức mới** · **Đến gặp sư già** · **Giao việc khác**. Người chơi chọn đi dạo thì kiến thức vẫn nằm trong sổ, không mất.

**Lần vào kế tiếp / gặp sư:**

- Không có kiến thức: sư nói "Khi mắt nặng, con có thể thay bằng đi kinh hành"; nhiệm vụ vẫn chơi được.
- Có `kn_five_hindrances_01`: sư hỏi "Con đã nghe đến hôn trầm. Lúc nó đến, con muốn thử cách nào?" → hiện thêm lựa chọn **"Xin chỉ cách kinh hành khi tâm chìm xuống"**, mở buổi kinh hành/hội thoại mở rộng.
- Có thêm một buổi tự tập, người chơi nhận diện đúng tình huống: Sổ ghi **Đã vận dụng**; khi đó có thể mở thêm mặt kiến thức hoặc có cơ hội nhận **thẻ tâm sở qua trải nghiệm** theo luật riêng.

**Khác biệt giữa kiến thức và thực hành:** nghe nói về hôn trầm không tự chứng minh rằng người chơi đang có hôn trầm; hiểu khái niệm Định không tương đương đắc định.

**Gợi ý danh sách bài học đầu tiên:** Niệm là gì; năm triền cái; tâm từ; vô thường (ở cấp khái niệm); bố thí và giữ lời hứa; các hạnh đầu-đà; mỗi bài 1 đoạn ngắn gắn với tình huống ở làng, không giả định ai học một đêm là thuộc trọn một bộ kinh.

### 9.4. Kịch bản mẫu B — không chỉ học kinh, việc thường cũng "lớn lên"

| Vai và công việc vắng | Tiến trình nhìn thấy | Thành quả khi quay lại | Cách sử dụng về sau |
|---|---|---|---|
| **Sư: đọc một đoạn kinh** | trang 1/3 → 2/3 → xong đoạn | một mục **Đã học (Sổ Hành Trình)**, một gợi ý mới | thêm nhánh đối thoại với sư, thêm gợi ý khi ngồi/kinh hành |
| **Sư: chuẩn bị may y** | kim chỉ đã chuẩn bị, vải đã phơi | `robe.materialReady`, hình vải đổi | khâu bằng tay ở lần chơi tới; offline **không tự may xong cả bộ** |
| **Sư: ngồi yên / kinh hành** | hoạt ảnh, ước lượng thời gian sinh hoạt | nhật ký sinh hoạt + một tình huống để thực hành **khi quay lại** | không thưởng Niệm, Định hay giác chi chỉ vì vắng |
| **Dân: nấu cơm** | bếp có lửa, cơm đã chín | một phần cơm chuẩn bị để dâng | sáng đến gặp sư/giúp người, **lúc ấy** có cơ hội thẻ Không tham |
| **Dân: dệt vải** | tấm vải dài lên từng đoạn | `cloth_progress`, tấm vải thật nếu hoàn thành | cúng dường hoặc mở nhiệm vụ nối với tuyến làm y |
| **Dân: nghe pháp** | đã nghe tới đoạn nào | kiến thức đã nghe + tin tức có nguồn trong truyện | nhận ra lời đồn nào cần kiểm chứng, hội thoại mới |
| **Ma: đứng ngoài tường nghe kinh** | tiếng tụng kinh thay đổi theo canh, ký ức chuyển nhẹ | mảnh **Đã nghe câu kinh** trong Sổ ký ức (không là thẻ tu chứng) | một lựa chọn mới khi gặp hình bóng Hạnh; không thao tác vật lý |
| **Ma: nhìn lại ký ức cũ** | mảnh ký ức được xâu nối | một mảnh chuyện thật về bà Sáu | thêm nhánh tự nhận biết ở gốc gạo, không tự "siêu thoát" theo timer |

**Tính kế thừa:** công việc vắng chuẩn bị "nguyên liệu / kiến thức / cơ hội", người chơi quay lại có hoạt động **chủ động** để sử dụng kết quả. Nhưng ít nhất **kết quả học và chuẩn bị** phải nhận được thật, không chỉ là lời hứa.

### 9.5. Khi có kiến thức, câu chuyện đổi cách — không chặn người mới

| Điều kiện đã có | Nhiệm vụ cũ vẫn có | Cơ hội bổ sung khi đã học |
|---|---|---|
| `kn_five_hindrances_01` | ngồi yên, nhận diện buồn ngủ | sư già nhắc đến triền cái, mở kinh hành hướng dẫn |
| `kn_metta_01` | làm lành với ông Tư | thêm lời đáp dịu dàng, tình huống rải tâm từ |
| `kn_impermanence_01` | ngắm hoa sen | nhận thấy hoa nở/rụng, mở hội thoại suy xét |
| `kn_generosity_01` | làm việc thiện cho dân làng | nhìn rõ khác biệt giữa việc hứa, giữ lời và chia vật dụng của mình |
| `kn_dhutanga_01` | nhặt và may vải theo tuyến y | có đoạn sư già giải thích lý do sử dụng y giản dị |

**Thiết kế cân bằng:** kiến thức là **chìa khóa mở thêm lựa chọn hoặc cách hiểu**, không phải vật phẩm tăng 50% "hiệu quả thiền" hay bắt buộc để qua cốt truyện. Người không muốn học vẫn có lối chơi phù hợp. Một lựa chọn thêm không nhất thiết là "đáp án đúng" duy nhất.

### 9.6. Điều kiện, phần thưởng, lưu trữ — chống nhận lặp

**Đề xuất tách ba lớp dữ liệu theo nhân vật:**

```js
// MINH HỌA SCHEMA, không phải API hiện hành
knowledge = {
  kn_five_hindrances_01: {
    stage: "heard", // heard | reviewed | applied
    firstLearnedAt: 1790000000000,
    sourceId: "sutta_or_commentary_ref",
    relatedCards: ["hon_tram", "hoai_nghi"],
    unlocks: ["monk_hindrance_dialogue", "walking_instruction"],
    examples: []
  }
}
awayJob = {
  jobId: "job_per_character_unique_id",
  activity: "study",
  lessonId: "kn_five_hindrances_01",
  startedAt: 1790000000000,
  progress: 0,
  status: "running", // running | ready | claimed
  rewardId: "knowledge:kn_five_hindrances_01",
  resolvedAt: null
}
```

- Sau giao việc, **mọi lần quay lại đều thấy trạng thái**: còn đang học / đã sẵn kết quả / đã nhận. Chọn thời gian hợp với thời lượng một *đoạn* ngắn. Không buộc người chơi mở game đúng lúc; không thưởng "điểm danh".
- Hoàn thành công việc = **một phần thưởng hữu hình theo catalog**, xác định trước và hợp vai. Nếu bài học đã có, thưởng mặt giải thích/đoạn ví dụ hoặc cơ hội ôn, không rơi lại thẻ mới vô hạn.
- `jobId` + `rewardId` phải xử lý **idempotent** khi đăng nhập lại/tải lại trang/chuyển thiết bị. Kết quả sẵn sàng thì lưu vào nhân vật **trước** khi hiển thị popup, không phụ thuộc người chơi có bấm "Nhận" hay không.
- Phân biệt **thời gian ngoài game** (mô phỏng việc nhân vật làm và tính tiến trình) với **thời gian chủ động của người chơi** (thực hành để gặp thẻ tâm): timer offline **không** cộng `practiceSessions`, không tăng cấp thiện tâm hoặc chứng đắc.
- Nghỉ một tháng không bị phạt, nhưng một việc không tự sinh ra 30 lần quà. Hoàn thành rồi chuyển `ready`, chờ người chơi vào giao việc tiếp. Không có quá trình lao động vô hạn.
- Cần quyết định sau về storage xuyên thiết bị: hiện `NightReflect` và `Progress` giữ `away`, `returnFrom`, còn `Mind.S` và `Save` lưu trạng thái nhân vật. Nên có **hàm hoàn tất công việc duy nhất**, thay vì mỗi UI tự cấp thẻ/vật phẩm.

### 9.7. Sửa lỗi logic: Bà cụ nhờ hái rau má nhưng người chơi lại đem cho ông Tư

**Đã xác nhận trong mã** `public/mind.js`: `atWell()` cho bà nhờ hái rau; `atMit() → picked2()` ngay lập tức cho chọn `Mang về cho bà cụ`, `Mang sang nhà ông Tư`, hoặc `Giữ lại nấu canh`. Nhánh `deliver()` thưởng khác nhau, nhưng không xử lý **lời nhờ và sự chờ đợi** của bà nếu đem đi nơi khác. Đây là lỗi **nhân quả và nhất quán lời hứa**, không chỉ lỗi diễn đạt.

**Luồng đề xuất:**

1. Bà nhờ: "Hái giúp bà một nắm rau má." Người chơi chọn **Nhận lời**, sinh `grannyHerbs.status=accepted`. Có thể **Từ chối/để sau**, không bị ép và không gắn lời hứa.
2. Sau khi hái: nhiệm vụ chính là **"Mang rau về cho bà"**. Không đưa ra lựa chọn tặng cả nắm rau của bà cho người khác như một hành động thiện mặc định.
3. Trở về giếng: bà nhận rau, cám ơn; ghi `fulfilled`. **Sau đó** mở nhánh tùy chọn: bà chia cho một phần, hoặc nhờ hái thêm nắm riêng để đem cho ông Tư. Như vậy việc hòa giải là **một nhiệm vụ mới có nguồn vật phẩm rõ**, không lấy vật đã hứa.
4. Nếu muốn cho phép người chơi **tự ý đổi ý**, phải kể hậu quả trung thực: bà vẫn chờ; hôm sau hỏi "Hôm qua con định mang rau về mà?" Người chơi có thể xin lỗi, quay lại hái cho bà. **Không** tự thưởng Không tham/Không sân rồi coi như đã hoàn thành lời hứa.
5. Các nhánh phải ghi vào ký ức của làng (bà cụ, ông Tư), nhật ký và `questList`; không được nhân đôi cùng một nắm `rau_ma`.

**Phân vai và giới luật phải duyệt:** hiện chuỗi chó cắn/hái rau chạy cho cả `monk` và `villager`. Với **tỳ-kheo Theravāda**, việc chủ ý cắt/bứt cây sống có quy tắc giới luật liên quan (Pācittiya 11). Cần giáo thọ duyệt lại toàn bộ thao tác hái rau/hoa sen và xác nhận vai. Hướng an toàn để viết: **dân làng hái rau**, còn nhà sư có thể nhận vật được dâng hoặc tham gia một câu chuyện khác phù hợp giới luật, thay vì tự bứt cây. Nguồn rà soát: https://www.dhammatalks.org/vinaya/bmc/Section0017.html và https://dhamma.gift/pli-tv-bu-pm?mode=multi

**Tiêu chí nghiệm thu:** nhận lời bà → hái → đưa ông Tư **không thể hoàn tất êm xuôi** như đã trả bà; nếu trả bà trước mới mở tùy chọn hòa giải; lưu/reload giữa chừng giữ đúng chủ sở hữu và trạng thái lời hứa.

### 9.8. Kế hoạch triển khai phần thưởng lúc vắng (ưu tiên hơn thêm nhiều quest ngẫu nhiên)

1. **Đã học (Sổ Hành Trình) MVP:** định nghĩa khoảng 6 mục kiến thức ngắn có nguồn; ghi sự kiện tiếp xúc với kiến thức trên thang khám phá chung, và lưu `reviewedAt`/`appliedAt` như thuộc tính dẫn xuất **không tạo một thang `heard/reviewed/applied` song song**.
2. **Nâng hoạt động vắng:** `study` và `weave`/`cook` có tiến trình, báo cáo, kết quả `ready` và nhận duy nhất một lần; việc đọc kinh thưởng *kiến thức*, không phải tâm sở thiện đã tu tập.
3. **Kết quả mở chuyện thật:** 2–3 hội thoại phụ có điều kiện `kn_*`, thêm nút **Mở Hành trình → Đã học** ngay trong phần thưởng và trang hồ sơ.
4. **Sửa lời hứa rau má** theo mục 9.7, thêm kiểm tra giới luật/tuyến vai.
5. Trước khi thêm nhiều quest, phải hoàn thiện identity PC/NPC, giữ tên nhân vật riêng và migration; sau khi kiểm thử vòng giao việc → offline → quay lại → nhận → dùng mới mở rộng cho ba vai.

**Tests cần có:** quay lại sớm thấy progress; đủ thời gian có kết quả; reload không nhân thưởng; giao cùng một bài đã học không sinh bản sao; kiến thức mở một nhánh phụ nhưng không chặn nhánh thường; offline không cấp thẻ tâm trải nghiệm; giao việc dệt vải có vật liệu thật; lời nhờ của bà được xử lý nhất quán; vai sư không có thao tác hái cây sống khi chưa duyệt.

> **Review mới của Nhân gian:** [PC-centric & migrate](player-character-narrative-model.md) · [Narrative Review](human-world-narrative-review.md) · [Episode Pack 01](human-world-episode-pack-01.md). **`villager` KHÔNG phải Ông Tư trong hướng thiết kế mới**; đó là cách gán tên sai của code legacy, cần đổi trước khi thêm quest. Ông Tư là NPC có thể gặp, còn PC dân là nhân vật riêng. Chưa sửa code.

## 10. Thứ tự triển khai và tiêu chí nghiệm thu

**Đợt A — sửa sai nhập vai và đa dạng hóa ngay**: giới hạn nhiệm vụ bé Na cho sư/dân; thêm cung ký ức nhỏ cho ma; ma không hái hoa/dâng hoa bằng tay; thêm thẻ Định và Phóng dật theo điều kiện quan sát. Tạo test cho `role` và điều kiện nhận thẻ.

**Đợt B — tuyến y phấn tảo thực sự chơi được**: 5 bước, `robe.step` lưu theo nhân vật, dùng asset vải/y, thao tác nhỏ cho mỗi bước, xuất hiện trong bảng Nhiệm vụ, skin khi xong, không skip bằng offline.

**Đợt C — vòng quay lại có phần thưởng thật (ưu tiên cao)**: Đã học (Sổ Hành Trình), hoạt động khi vắng có tiến trình và phần thưởng, kiến thức mở hội thoại phụ, sửa lỗi lời hẹn rau má; sau đó mở kinh hành/ngồi/học kinh bất kỳ lúc, 10–15 storylet theo trạng thái.

**Đợt D — cân bằng và giáo lý**: giáo thọ duyệt thuật ngữ; kiểm tra 5 người chơi mới qua 3–5 đêm; đo mức lặp nhiệm vụ, số buổi ngồi tự chọn, số người quay lại chỉ để xem "Trong lúc vắng", chỗ người chơi dừng.

**Bài test chấp nhận:**

1. Hồn ma đến gốc gạo: **không bao giờ** nhận "Tìm bé Na / dỗ dành / dẫn bé về"; thay bằng nhớ và quan sát.
2. Dân/sư vẫn đưa bé Na về được như trước; save cũ không mất.
3. Ngồi xong chỉ vì đồng hồ chạy **không bảo đảm** rơi thẻ Niệm, Định.
4. Định chỉ có cơ hội xuất hiện khi đủ minh chứng buổi thực hành chủ động; không hiển thị "đắc thiền".
5. Tuyến y phấn tảo qua ít nhất 3 ngày/đêm, không xong ngay trong 3 phút.
6. Rời game 7 ngày rồi quay lại: **một công việc có một kết quả hữu hình được lưu vào sổ/túi** (kiến thức, vật liệu, manh mối), không nhân thành 7 lượt và không tự cộng 7 ngày tu tập/7 thẻ tâm trải nghiệm.
7. Người chơi bỏ qua việc hôm nay: ngày mai vẫn có thể trở lại, không phạt.
8. Cùng một storylet không tự động lặp hai ngày liên tục; lời hẹn "ngày mai" phải dẫn đến cảnh thực.
9. Học kinh khi vắng → Đã học (Sổ Hành Trình) có mục mới và một hội thoại phụ mở ra; reload không nhân bản phần thưởng.
10. Bà cụ nhờ hái rau → không thể tặng nguyên nắm cho ông Tư mà vẫn tính hoàn thành lời hẹn với bà; cần duyệt vai sư trước khi cho tự hái cây sống.

## 11. Trạng thái hiện tại so với tài liệu

- **Đã có trong code legacy:** truyện một đêm dưới góc nhìn Sư Tịnh/Ông Tư/Bà Sáu, chuỗi chó cắn, album thẻ (đang phát triển thêm), ngồi với sư, nhật ký, lời hẹn, hoạt động khi vắng chủ yếu kể chuyện. **Chưa tách NPC khỏi PC trong code.**
- **Thiết kế ở tài liệu này:** vòng ngày 5 buổi, cung y phấn tảo đủ 5 ngày, tuyến ông Tư 4 ngày, hoạt động tự do, **offline rewards + Đã học (Sổ Hành Trình) + dùng kiến thức mở tương tác**, và sửa logic lời nhờ hái rau má.
- **Bản mã thử của đợt A:** xem mô tả PR; các hạng mục chưa code **không** được ghi là "đã triển khai" trong README hoặc tài liệu hệ thống tâm.
- **Bộ chọn tình huống (storylets.js):** chạy cho nhân vật đến nơi, 3 tình huống mẫu HG26/HG12/HG20, chưa thẻ.
- **HG27 (bà ngoại):** Bi khi chọn giúp, Không tham khi chia phần cơm của mình, Tùy hỷ khi ở lại nhìn; thẻ trao sau cảnh kết.
- **Đêm 1:** bé Na ẩn trong bụi tre, người chơi lần theo tiếng khóc (không thất bại, không hết giờ).

