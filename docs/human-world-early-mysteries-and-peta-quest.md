# Nhân gian — Những điều kỳ ảo đầu game & nhiệm vụ Bà ngoại ngạ quỷ

> **Quyết định biên kịch 08-11-2026 — design-only, CHƯA sửa code/gameplay.** Đọc [Player-centric Narrative Model](player-character-narrative-model.md), [Human World Playable Scenarios](human-world-playable-scenarios.md), [Game Design Principles](game-design-principles.md). Người chơi là nhân vật tự đặt tên/chọn vai; Sư Tịnh, ông Tư, bà Sáu là **NPC riêng**. Giữ vibe chữa lành; trời đẹp làm chủ đạo. 
>
> **Ưu tiên rất cao:** **giữ nhiệm vụ bà ngoại ngạ quỷ đã có** trong `public/encounters.js` như *signature quest* kỳ ảo đầu game. Giữ **cảnh bố thí/hồi hướng → bà sáng lên và tan vào ánh trăng** mà người chơi đã thích. Mở rộng phần thưởng theo **thứ tự cảm xúc/hành động: Bi → Không tham → Tùy hỷ**, với **một màn tổng kết thẻ gọn**, tránh biến nó thành 3 popup liên tiếp. Không nhân nhầm bà ngoại này với **NPC bà Sáu**.

## 1. Người chơi đến để khám phá, không đến để được giao học kinh

**Công thức cho các mạch mới:**

`thấy một điều lạ/khó khăn → thử một cách giải quyết → muốn hiểu thêm → tự hỏi NPC/tìm một nguồn → áp dụng → có cảnh/thẻ/đường mới`.

- **HG03 học kinh:** không tự đứng ở kệ phát quest “Đọc kinh nhận kiến thức”. Sau vài lần PC **tự ngồi thiền** mà mất tập trung, buồn ngủ, lười khởi sự, hoặc tò mò về nỗi sợ trong hang, **PC có quyền hỏi sư già**. Sư gợi ý kinh hành, nghỉ phù hợp, hoặc chỉ chỗ đọc/nghe một đoạn cụ thể ở tịnh thất. PC chọn cách nào đều được.
- **Kinh khi vắng:** có thể giao đọc/nghe khi PC đã muốn tìm hiểu vấn đề. Lần sau nhận **kiến thức** và tùy chọn áp dụng; **không tự nhận thẻ tâm tu chứng** từ đồng hồ. Có cách tiếp cận không cần đọc để người thích cảnh vẫn chơi tiếp.
- **Cần nguồn:** khi viết một đoạn giải thích đúng kinh/luận, tách `sourceRefs` và phần `game_interpretation`. Lời sư đời thường không được gắn như trích lời Phật.

## 2. Tiết lộ thế giới kỳ ảo sớm, nhưng các vị không ở đó 24/7

| Mạch | Người chơi nghe sớm | Dấu hiệu trước cuộc gặp | Cuộc gặp đầu, dễ đạt | Sau lần gặp |
|---|---|---|---|---|
| **HG27 — Bà ngoại ngạ quỷ** | có người thì thầm rằng đêm gần mộ cũ nghe tiếng xin ăn | bóng gầy xuất hiện khi trời vừa tối; không popup | PC người sống chủ động đến hỏi, mở quest bố thí/hồi hướng | kết thúc một lần, bà không còn đứng chờ; mộ yên, âm thanh thay đổi |
| **Thọ thần gốc gạo** | chuyện truyền miệng lá gạo đôi khi sáng không có gió | bóng lá/gió/đốm sáng lúc chạng vạng | quan sát đúng lúc hoặc sau một dấu việc rất nhỏ; không cần cày thẻ | không luôn hiện hình; gặp lại khi có **mạch truyện** |
| **Chư thiên/tháp cổ** | lời đồn ánh đèn và tiếng chuông trên tháp | vệt sáng từ xa/âm thanh lạ | cơ hội quan sát hoặc **một cuộc gặp ngắn đầu game** ở thời điểm hợp cảnh | gặp hiếm, có câu chuyện riêng dẫn lên các tầng cảnh; không có NPC đứng canh để farm |

- **Thứ tự đề xuất (không ép tuyến tính):** người chơi có thể sớm thấy dấu gốc gạo, ngạ quỷ và tháp; **HG27 là cuộc gặp có kết trọn vẹn đầu tiên** để khơi gợi động lực khám phá. Không yêu cầu đủ điểm thiện/chỉ số tâm.
- **Hiếm không đồng nghĩa khó chịu:** dùng `discoverySeen`, `episodeStage`, khung giờ rộng và hint dễ hiểu; nếu bỏ lỡ có thể quay lại một đêm khác, không đợi random 1% hay phải login đúng giờ.
- Sau khi gặp, vị thần có thể chỉ để lại lá sáng, tiếng chuông hoặc thay đổi cảnh; các cuộc gặp trực tiếp xảy ra **theo tình huống**. Không để NPC tiên/ma hiện mãi trước mặt người chơi.
- Mọi người chơi đều có **quyền đi dạo** mà không bị popup khi bước gần.

## 3. HG27 — Bà ngoại bên ngôi mộ thấp (EARLY-GAME SIGNATURE QUEST)

**Nguồn gốc:** nâng cấp nội dung đang có `Q("peta")`, `petaMeet()`, `grannyRice()`, `offerRice()` trong `public/encounters.js`. **Không phải nội dung mới tạo từ đầu**. Trong code hiện tại, `petaMeet` có thẻ `bon_xen` khi nghe kể; `offerRice` có cảnh bà tan và thưởng `khong_tham`; **chưa có phần thưởng hợp nhất ba thẻ**. Các bước dưới đây là **thiết kế sẽ sửa sau**, không phải code đã chạy.

### 3.1. Lời hứa trải nghiệm

Người chơi **gặp một chúng sinh khổ rất sớm**, tự tìm cách giúp, làm một việc tốt thật sự trong thế giới game, chứng kiến bà ngoại có được sự an ổn và tan vào ánh sáng. **Thế giới thay đổi vĩnh viễn**; ba thẻ ghi ba mốc riêng: **Bi khi nghe chuyện và chọn giúp, Không tham trong lúc thực sự bố thí để hồi hướng, Tùy hỷ sau hồi hướng khi vui vì bà được thoát cảnh khổ**. Tất cả vẫn vui, dịu, bí ẩn, không mang cảm giác giáo huấn.

**Phân biệt nhân vật:** `npc.peta_grandmother` là **bà ngoại ngạ quỷ** trong nhiệm vụ này; `npc.ba_sau` là bà Sáu bán xôi có mạch Hạnh riêng. Bà cụ `npc.granny` ở giếng là người sống hỗ trợ chuẩn bị cơm, không phải bà ngoại ma.

### 3.2. Tiến trình trải nghiệm

> **Cập nhật 12-11-2026:** chủ project đã chọn "bản hai nhịp" cho nhân vật có đồng hồ thế giới. (1) Đêm: gặp bà ngoại, chọn giúp (Bi); hỏi bà cụ ở giếng, sáng mai quay lại. (2) Sáng: xới cơm ở giếng, có thể sớt phần cơm sáng của mình vào bát khi sư già đi ngang ngõ (Không tham chỉ khi đã sớt). (3) Chạng vạng trở đi: quay lại mộ thấp, bà sáng lên rồi tan vào ánh trăng (Tùy hỷ chỉ khi đứng lại nhìn).
>
> Bảng dưới mô tả luồng một đêm cũ; các ô nói về dâng cơm cho sư ban đêm được thay bằng bản hai nhịp cho nhân vật có đồng hồ. Nhân vật legacy giữ luồng cũ tạm thời. Câu chữ và việc dâng cơm còn chờ giáo thọ Theravāda duyệt; lời thoại xem [kịch bản bảy đêm §5, đêm 2](human-world-villager-night-script.md).

| Chặng | Cảnh/tín hiệu | Chủ động tương tác và lời thoại mẫu | Phản hồi và dữ liệu |
|---|---|---|---|
| **0 — Lời đồn (tự chọn)** | Người làng bảo có tiếng “đói quá” ở mộ thấp | PC hỏi tại giếng hoặc chỉ đi ngắm nghĩa địa | `rumour:peta_grandmother` nếu nghe; **không bắt phải có** |
| **1 — Gặp sớm** | Trời chạng vạng, dưới gốc mộ có một bóng gầy; chỉ có tiếng gọi rất khẽ | Bấm `Đến gần`. Bà: “Có ai còn nhớ đến bà không?” → `Bà có cần giúp gì không?` / `Đứng nghe` / `Đi tiếp` | `peta=met`; lần đầu hiện vừa đủ bất ngờ, không tự popup |
| **2 — Thấy cái khổ** | Bà kể mình đói, đã lâu không được ai nhớ; chuyện tiếc của đời trước có thể khai mở sau | PC: “Con không có gì đưa cho bà. Con nên làm sao?” → gợi ý hỏi người ở giếng/tịnh thất | `peta=needs_help`; **chỉ khi nghe chuyện và chủ động chọn giúp**, ghi mốc nhận diện **Bi**; chỉ nghe rồi bỏ đi không nhận |
| **3 — Làm việc tốt** | Bếp bà cụ có cơm nóng; có người cần bát cơm | PC người dân có thể giúp chuẩn bị và trao cơm; PC sư chỉ tiếp nhận/vận hành đúng vai, không tự hái cây/cầm tiền; nghe sư già hướng dẫn nếu cần | `peta=offering_prepared`; **mới chuẩn bị cơm, chưa nhận Không tham**; mốc này xảy ra lúc thực sự bố thí để hồi hướng ở chặng 4 |
| **4 — Hồi hướng** | Sư già nhận vật cúng phù hợp; âm thanh nhẹ dần | PC chọn `Cùng hồi hướng` (không bấm hàng chục lần) | `peta=dedication_done`; ghi mốc **Không tham** khi thực sự bố thí/cúng dường để hồi hướng; chỉ chốt hoàn thành quest sau cảnh kết |
| **5 — Kết thúc kỳ ảo** | Bà ngẩng đầu, lần đầu có nét yên trên mặt; sáng dần rồi **tan vào ánh trăng** | Một câu ngắn, chẳng hạn: “Bà nhận được rồi… Cảm ơn con.” | **Giữ cinematic cũ** (sáng, biến mất), không hiện hộp thưởng phủ che khoảnh khắc; khi PC vui vì bà được an, rời cảnh khổ, ghi mốc **Tùy hỷ** |
| **6 — Phần thưởng** | Sau cảnh kết, người chơi có một hơi thở trống để ngắm mộ | Một màn **tổng kết ba mốc**: **Bi → Không tham → Tùy hỷ**. Giải thích bằng 1 câu/thẻ, không 3 popup; từng thẻ đã được ghi nhận đúng thời điểm | `rewardBundleId=peta_grandmother_first_release` **chỉ tổng kết những thẻ đã ghi đúng mốc, không cấp thêm ba thẻ lần nữa**; `worldEffect=quiet_grave` |
| **7 — Trở lại** | Mộ cũ giờ yên, còn ngọn gió/chiếc lá, không còn bà đứng chờ | `Đứng lặng` / `Ngắm` / `Đi tiếp` | Có dấu Sổ: “Một lần giúp được người đang khổ”; không spawn lại bà để farm |

**Giọng kể mẫu:** tối đa 1–2 câu/lượt, không bắt PC đọc giải thích “bố thí là pháp gì” trong lúc đang hành động. Toàn bộ nguồn giáo lý có thể mở trong **Nguồn và ghi chú** của Sổ.

### 3.3. Ba thẻ trong cùng một câu chuyện

| Thẻ ghi trong album | Khoảnh khắc trong **mô phỏng** | Ý nghĩa nên hiển thị |
|---|---|---|
| **Bi — `bi`** | **Nghe bà kể nỗi khổ và chủ động chọn sẽ giúp** | “Người này nghe bà kể mình đói và muốn bà bớt khổ.” |
| **Không tham — `khong_tham`** | **Thực sự bố thí/cúng dường để hồi hướng cho bà**, không chỉ chuẩn bị bát cơm | “Người này sớt phần cơm của mình vào bát để gửi phước cho bà.” |
| **Tùy hỷ — `tuy_hy`** | **Sau hồi hướng, chứng kiến bà sáng lên, rời cảnh khổ và vui vì bà được an** | “Người này đứng lại nhìn bà được yên và mừng cho bà.” |

**Đặt tên:** người chơi có thể gọi thông thường “thẻ Hỷ”, nhưng trong album **nên dùng `Tùy hỷ (muditā)`** cho ý vui với hạnh phúc người khác; **không đánh đồng với hỷ `pīti`** trong bối cảnh thiền. Cần rà `public/cetasika.js` và luật thẻ trước khi code.

**Luật thưởng thiết kế:** ba mốc được ghi đúng lúc: `heard_story_and_committed_help → bi`, `actual_dana_for_dedication → khong_tham`, `dedication_complete_and_witnessed_relief_with_joy → tuy_hy`. Thẻ có thể báo nhẹ ngay khi đạt, không cắt câu chuyện; **sau cinematic mới hiện một bảng tổng kết ba thẻ**. Nếu rời nhiệm vụ giữa chừng, giữ thẻ đã thực sự đạt và không cấp trước thẻ chưa đủ điều kiện. Không cấp khi chỉ đi ngang, chỉ nghe mà không chọn giúp, chuẩn bị cơm nhưng chưa bố thí, hoặc chỉ xem hồi tưởng. Nếu đã sở hữu một thẻ từ quest khác, hiển thị “Đã có — gặp lại” và chỉ cấp thẻ còn thiếu. Không ép ba popup nhận liên tiếp hoặc ba phép cộng điểm đạo hạnh. **Bỏ qua quest** không bị phạt; có thể quay lại hoàn thành.

**Đa vai:** bản nhiệm vụ trong `develop` được dành cho `monk/villager`; giai đoạn đầu **giữ luồng bố thí vật chất cho PC sống** và viết lại người nhận/người cho theo giới luật. **PC ghost** có thể quan sát, tìm hiểu một góc chuyện bà ngoại khác; **không cho hồn ma nhặt, nấu hoặc đưa bát cơm**, và không tự cấp bundle ba thẻ chỉ vì xem; muốn cho ghost hoàn tất thì phải có một cách tham gia hợp logic, viết riêng và duyệt trước. Phải thống nhất reward parity về lâu dài, không cho avatar ma bị loại khỏi toàn bộ phép màu đầu game.

### 3.4. Trạng thái và hậu quả

```js
// Spec data-only; chưa phải API. Tên biến đề xuất để dev map sang Q('peta') cũ.
const episode = {
  id: "HG27", npcOwnerId: "npc.peta_grandmother",
  roles: ["monk", "villager"],  // ghost observation variant cần thiết kế riêng
  start: { place: "graves", time: ["dusk", "night"], trigger: "explicit_interact" },
  steps: ["unseen", "met", "needs_help", "offering_prepared",
          "dedication_done", "completed"],
  rewardBundleId: "peta_grandmother_first_release",
  cards: ["bi", "khong_tham", "tuy_hy"],
  milestones: {
    bi: "heard_story_and_committed_help",
    khong_tham: "actual_dana_for_dedication",
    tuy_hy: "dedication_complete_and_witnessed_relief_with_joy"
  },
  oncePerCharacter: true,
  onComplete: ["world:quiet_grave", "journal:peta_helped"],
  loreBasis: "game_interpretation",
  sourceRefs: ["Khp 7 / Pv 1.5"],
  endVisual: "peta_glows_and_dissolves_into_moonlight"
};
```

**Idempotency:** mỗi mốc **Bi / Không tham / Tùy hỷ** phải lưu đúng một lần theo khóa `(characterId, questId, cardId)` cùng điều kiện mở mốc đã được xác nhận phía server; hoàn thành quest dùng khóa duy nhất `(characterId, questId, rewardBundleId)` và ghi kết quả thế giới trong transaction phù hợp. Hai thiết bị cùng bấm không được sinh hai thẻ/hai phần thưởng. **Màn tổng kết không cấp lại thẻ** mà chỉ hiển thị những mốc đã nhận. Nếu PC dừng sau khi quyết giúp hoặc sau khi bố thí, thẻ của mốc đã hoàn thành vẫn được giữ; sau đó tiếp tục mới có thẻ của mốc sau. UI xem lại cảnh kết không phát lại vật/thẻ. Chưa thiết kế API cụ thể và chưa code.

### 3.5. Giữ cảm giác “siêu thoát” của cảnh, tách khỏi khẳng định giáo lý

- **Giữ nguyên hiệu ứng hình ảnh:** bà sáng dần, mỉm cười, tan vào ánh trăng, không còn chịu cảnh đói bên ngôi mộ. Người chơi cảm nhận **đã giúp một chúng sinh khổ**.
- **Trong lời kể** có thể dùng “Bà đã được an, không còn ở đó nữa”; **không đồng nhất “tan vào ánh sáng” với chứng Niết-bàn hay giải thoát tối hậu**. Nếu người chơi gọi cảm xúc ấy là “siêu thoát” thì tôn trọng cảm nhận; phần *Nguồn và ghi chú* làm rõ đâu là hư cấu.
- **Khp 7 / Pv 1.5** (Tirokuḍḍa) là nguồn tham chiếu về bố thí, hồi hướng và các loài đã khuất được lợi ích trong một bối cảnh cụ thể; không nói kinh mô tả chính xác cinematic “phát sáng rồi biến mất”. Duyệt giáo lý phần cúng dường, hồi hướng, kết quả trước phát hành.
- Nguồn tham khảo: https://www.dhammatalks.org/suttas/KN/Khp/khp7.html và https://www.accesstoinsight.org/tipitaka/kn/khp/khp.7.nara.html (cần kiểm tra link thứ hai trước khi gắn UI). Phân loại **lời kinh được dẫn** là `canonical`, **nhiệm vụ và cảnh kết** là `fiction/game_interpretation`.

## 4. Đối chiếu với code cũ để bảo toàn thứ người chơi thích

| Trong `public/encounters.js` | Hướng xử lý sau khi duyệt |
|---|---|
| `petaMeet()` mở khi `near()` vào đêm | đổi thành bóng ambient + `explicit_interact`; vẫn dễ bắt gặp trong lần đi dạo đầu |
| Gặp bà có `K.award("bon_xen")` | có thể giữ làm **thẻ quan sát qua câu chuyện** tùy thiết kế nhưng không tự thưởng vì chỉ hỏi tên; ưu tiên không làm loãng phần thưởng cuối |
| `grannyRice()` lấy bát cơm từ bà ở giếng | giữ sinh hoạt đời thường, phân biệt `npc.granny` với `npc.peta_grandmother` |
| `offerRice()` hồi hướng + `fx.peta` sáng/biến mất | **GIỮ TRỌN CẢNH**; chỉnh đồng bộ thưởng sau cảnh, không chèn popups trong lúc cinematic |
| `K.award("khong_tham")` hiện tại | nâng thành **bundle 3 thẻ** theo các hành động đã tham gia và kịch bản |
| `Q("peta").step="done"` không còn spawn bà | giữ, thêm **quiet grave** và dấu Sổ; chống nhận thưởng lặp server |

**Không vứt quest hiện tại hoặc thay bằng một câu chuyện hoàn toàn mới.** Đây là *nâng nhịp khám phá và phần thưởng*, không viết lại bản sắc của quest.

## 5. Cầu nối tới bí ẩn bà Sáu — không ép quan hệ hai hồn ma

Sau khi HG27 hoàn tất, PC sẽ có ký ức: “Mình từng giúp một bà ngoại đang khổ.” Khi sau đó gặp **NPC Bà Sáu**, người chơi có thể tự hỏi:

> “Lần trước mình giúp được một bà. Vì sao bà Sáu vẫn đợi dưới gốc gạo?”

- Câu hỏi là **động lực tò mò**, không phải một công thức gameplay `dâng cơm lần 2 → bà Sáu tan biến`.
- Bà Sáu có tuyến **Hạnh sống sót, vợ Ông Tư, bí mật ngày nước lớn** trong `story.js` cần chuyển thành bí ẩn PC khám phá. Những mảnh ký ức mở qua NPC/người sống/hang/bến nước, có bất ngờ nhưng giữ logic.
- Nếu sau này có mối liên hệ với Bến Không Tiếng hoặc một kiếp khác, phải có **manh mối từ trước**, sự hợp lý của nhân duyên và câu chuyện riêng tự đứng được. **Không bắt buộc hai bà có quan hệ hay cùng nguyên nhân đau khổ.**
- Nếu HG27 chưa làm, người chơi **vẫn gặp bà Sáu được** và theo được cốt truyện; khác biệt có thể là một lựa chọn đối thoại tham chiếu nhiệm vụ cũ.

## 6. Sinh hoạt và kết nối các mạch khác (gói nguyên tắc đã chốt)

- **Thu thập có ích:** rau rừng, măng, nguyên liệu làm đồ hoặc thức ăn để **tự nguyện** giúp người, cúng dường/chia sẻ, mở đường vào truyện. Giữ `role` đúng: PC dân có thể hái cây; sư phải theo giới luật liên quan cây sống/tiếp nhận vật phẩm; ma không thao tác vật chất.
- **Không đưa mẹo trị bệnh chưa kiểm chứng thành công thức có hiệu quả:** lá trầu/măng có thể là **chi tiết tập quán** nếu kiểm duyệt; không lập recipe uống nước măng nướng chữa sốt, hoặc khẳng định khỏi cảm. Tình huống chăm người bệnh nên ưu tiên nước ấm/nghỉ/người có chuyên môn.
- **Kết nối kiểu truyện nhiều lớp, không gượng ép:** từ nón/sợi chỉ → Hạnh → Ông Tư → trận nước lớn → bến cũ → có thể là hang/Bến Không Tiếng. Không biến mọi NPC thành họ hàng một kiếp trước.
- **Tránh moral quest hub:** tình huống đời thường/mystery là chính, học kinh chỉ xuất hiện khi PC gặp khó khăn và muốn giải quyết, không phải quảng cáo “đọc kinh để lấy thẻ”.

## 7. Acceptance & checklist triển khai sau

- [ ] HG27 có tín hiệu **sớm và dễ gặp**, nhưng không tự mở sheet khi tới gần.
- [ ] Mỗi character hoàn thành HG27 tối đa một lần; bà ngoại biến mất khỏi map và mộ yên, không biến trở lại do chuyển ngày/reload.
- [ ] Giữ cinematic bà sáng rồi tan, không chặn bởi màn thưởng.
- [ ] **Bi:** nghe bà ngoại kể và **chủ động quyết định giúp**; chỉ nghe/xem rồi đi chưa nhận.
- [ ] **Không tham:** thực sự **bố thí để hồi hướng**; chuẩn bị hay cầm bát cơm chưa nhận.
- [ ] **Tùy hỷ:** **sau khi hồi hướng, thấy bà được an và rời cảnh khổ, vui với kết quả ấy**; không nhận ngay khi mới bấm nút hồi hướng.
- [ ] Ba thẻ lưu đúng các mốc, UI chỉ **một màn tổng kết sau cảnh kết**; rời giữa chừng giữ mốc đã đạt nhưng không thưởng trước.
- [ ] Thẻ đã có chỉ “gặp lại”, không cấp lặp.
- [ ] Không nhầm `tuy_hy/muditā` với `pīti`, không bảo đảm PC thật có tâm sở ấy ngoài đời.
- [ ] Bát cơm chỉ được sử dụng một lần và đúng người/đúng điều kiện; xem lại cảnh không cấp thêm vật phẩm.
- [ ] Hai thiết bị claim đồng thời chỉ ghi một lần tại server.
- [ ] PC dân và PC sư có bước hợp vai; PC ghost có dấu hiệu khám phá sớm riêng, không tự cầm cơm hoặc nhận thẻ do quan sát.
- [ ] HG27 và mạch bà Sáu là **hai nhân vật/quest khác nhau**; gặp bà Sáu không phụ thuộc hoàn thành HG27.
- [ ] Nguồn Khp 7/Pv 1.5 ghi như **cảm hứng giáo lý**, cinematic không mạo nhận là mô tả kinh điển; duyệt thầy trước ship.
- [ ] Thế giới thời tiết đẹp chủ đạo; không cần bão/mưa hay chỉ số Niệm cao mới gặp bà ngoại.
