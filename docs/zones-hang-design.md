# Hệ vùng và Hang Vọng Tâm — thiết kế map đi được v0.1

> **Status:** Approved design (hướng thiết kế, 2026-11-12); nội dung giáo lý vẫn chờ duyệt
> **Scope:** world / UX / save
> **Owner doc:** [map-brief-hang-va-coi-gioi.md](map-brief-hang-va-coi-gioi.md) (bố cục, nghiệm thu map) · [world-exploration-bible.md](world-exploration-bible.md) (mô hình cõi giới)
> **Related:** [Exploration UX & Gating](exploration-ux-and-gating.md), [Game Design Principles](game-design-principles.md), [Player-Centric Narrative Model](player-character-narrative-model.md), [Journey Memory](journey-memory-and-return-ux.md), [Đồng hồ thế giới](dong-ho-the-gioi.md), [Kế hoạch bảy đêm cho PC người dân](human-world-villager-night-plan.md)
> **Code status:** Design-only; chưa sửa code. Đã đối chiếu `develop` (`b584d18`) ngày 2026-11-12: `public/world.js`, `public/app.js`, `public/encounters.js`, `public/palace.js`, `public/mind.js`, `public/clock.js`, `public/save.js`, `public/event-catalog.js`.
> **Last reviewed:** 2026-11-12
> **Quyết định của chủ project:** xem [§9](#9-quyết-định-của-chủ-project-2026-11-12). Gộp tài liệu này **không** có nghĩa là nội dung giáo lý đã được duyệt.

> **Nhãn duyệt giáo lý:** mọi đoạn đánh dấu **〔cần giáo thọ Theravāda duyệt〕** chỉ là cảnh vật và gợi mở trong mô phỏng (`game_interpretation` hoặc `fiction`), không khẳng định giáo lý. **Việc gộp tài liệu này vào `develop` chỉ duyệt hướng thiết kế map, KHÔNG duyệt nội dung giáo lý;** mọi nhãn bên dưới vẫn phải được giáo thọ duyệt trước khi phát hành. Không gọi mọi yakkha là ngạ quỷ, không coi lối đi giữa các cảnh là địa lý thật của các cõi, không có cơ chế bắt người chơi tạo tâm bất thiện.

## 0. Tóm tắt một trang

- **Vấn đề:** hiện chỉ có một bản đồ nhân gian (`World`, 640 × 2000 đơn vị, canvas thủ tục). Hang là chuỗi popup (`boulderVisit` → `caveEnter`), tháp là lớp phủ thoại (`Palace`). Không có nơi nào khác để *đi*.
- **Đề xuất:** một module mới `public/zones.js` (`window.Zones`) dựng **vùng** (zone): bản đồ nhỏ đi được, mở bằng lớp phủ canvas riêng phía trên bản đồ nhân gian, giống cách `Palace` đang làm. Bản đồ nhân gian không phải sửa; `app.js` chỉ thêm vài dòng nối.
- **Vùng đầu tiên:** **Hang Vọng Tâm** cho PC người dân (và sư): cửa hang, sảnh gió (hub), hồ tĩnh, vách khắc, hốc trú, đài ngắm, khe sáng; hai vòng đi khép kín; ngưỡng sâu chỉ được *nhìn thấy* trong lát cắt đầu.
- **Sau đó:** Bến Không Tiếng (Bờ Nổi) và đồi tháp/vườn mây dùng lại đúng hệ này, chỉ thay dữ liệu vùng và bảng màu.
- **Lưu:** thêm một khóa `zones` vào dữ liệu tâm của nhân vật (`dhutanga.mind`, đã là khóa theo nhân vật). Thêm vào, không đổi phiên bản save, save cũ không cần chuyển đổi.

## 1. Goal & player experience

**Mục tiêu:** bản đồ như một bức tranh sống, để đi dạo, ngắm cảnh, khám phá bí ẩn; không dungeon nhiệm vụ, không giải đố bắt buộc, không farm thẻ.

Người chơi bước qua khe đá sau tảng đá lớn và thấy mình **đang đứng trong một nơi khác**, không phải đang đọc một tờ giấy. Họ đi chậm, nghe nước nhỏ giọt, thấy ánh sáng đổi theo giờ bên ngoài, ngồi xuống bên hồ, nhìn từ đài đá xuống một lối sâu có ngọn đèn nghiêng trong gió. Không ai giao việc. Chỉ khi người chơi bấm vào một thứ mới có vài dòng chuyện.

Thước đo: một người thích ngắm cảnh có **5–10 phút trong hang mà không gặp popup nào họ không bấm**, rời hang bằng một lối khác lối vào, và có lý do muốn quay lại (đèn ở ngưỡng sâu, đốm sáng dưới hồ đổi khác lúc đêm).

## 2. Constraints / decisions already approved

Lấy từ tài liệu nguồn, không bàn lại ở đây:

1. **Khám phá trước, chuyện theo yêu cầu** ([Game Design Principles §3](game-design-principles.md)): đi ngang không mở popup, bấm mới mở ([Exploration UX §3](exploration-ux-and-gating.md)).
2. **Mỗi map tối thiểu** một hub, ba hướng nhìn thấy, một đường vòng về, hai điểm thưởng ngoạn không nhiệm vụ, một dấu tích Sổ, một biến thể khi quay lại, một cửa sâu có tiền cảnh ([Map Brief §1](map-brief-hang-va-coi-gioi.md)). Mỗi zone cần `id, connections, walkableAreas, landmarks, ambientVariants, discoveryRewards, storySlots, futureSlots, loreBasis` ([Map Brief §5](map-brief-hang-va-coi-gioi.md)).
3. **Cổng theo bối cảnh, nhiều lối** thay vì cộng điểm; điều kiện *khám phá* một cổng (đã tới đầu cổng) được giữ mãi, còn điều kiện *đi qua* cổng ánh sáng được kiểm tra theo vật đang có mỗi lần ([Exploration UX §4](exploration-ux-and-gating.md); xem §4.1 và Q5).
4. **PC tự đặt tên**; Sư Tịnh, Ông Tư, Bà Sáu là NPC. Tiến trình, ký ức, spoiler **theo từng nhân vật** ([Player-Centric](player-character-narrative-model.md)).
5. **Một Sổ Hành Trình** theo nhân vật; không tạo sổ, icon HUD hay kho riêng cho map ([Journey Memory §0](journey-memory-and-return-ux.md)).
6. **Đồng hồ riêng mỗi nhân vật** (`Clock`, M0) quyết định trời; nhân vật legacy vẫn theo giờ cảnh ([Đồng hồ thế giới](dong-ho-the-gioi.md)).
7. **DNA hình ảnh:** canvas vẽ tay, nhân vật nhỏ, màu tiết chế, **đèn ấm làm trọng tâm trên nền lạnh**, không kinh dị nặng, không photoreal ([World Bible §9](world-exploration-bible.md)).
8. Người dân **chơi theo đêm**; hang, tháp và các tuyến cõi giới là **chiều sâu từ đêm 7 trở đi**, không ép ([Kế hoạch bảy đêm](human-world-villager-night-plan.md)). Bản thiết kế này không đổi thứ tự đó; xem Q1 (hang mở theo `q.cave.found`, không khóa theo đêm).

## 3. Hiện trạng code (đã đọc trên `develop`)

| Chỗ | Hiện có | Ý nghĩa cho thiết kế |
|---|---|---|
| `public/world.js` | `World` một bản đồ dọc 640 × 2000, `PLACES` gồm `hang` (440, 760, "Tảng đá lớn" → "Hang đá") và `thap` (350, 440). Camera dọc theo người chơi (`view.anchor`), kéo để nhìn (`lookAt`, `lookRange`), chụm để zoom, `BASE_VIEW_W = 400`. Vòng `frame()` vẽ mọi khung hình; ánh sáng bằng lớp `shade` khoét gradient. `setFx(fn)` cho phép module ngoài vẽ thêm. | Bản đồ nhân gian làm tốt việc của nó; **không nên nhét vùng thứ hai vào đây** (đổi `W/H`, `PLACES`, decor, pick sẽ đụng mọi PR khác). Học lại cách camera, ánh sáng, tỉ lệ 400 đơn vị cho màn dọc. |
| `public/encounters.js` | Nhiệm vụ `cave`: `boulderVisit()` (ngồi tựa đá → `q.cave.found = true`), `caveEnter()` (cần `den_nho`, ba bước popup với hai bóng đói và mảnh giấy của Hạnh, thẻ Bi). Gọi tự động khi `near(place("hang"), 50)` trong `loop()` (`encounters.js:600`). `Discover.ENTRIES` có `hang` và `day_hang`. | Giữ `q.cave.found` làm **cửa vào** vùng (đã có, không phải thêm). Popup `caveEnter` là nội dung legacy (bí mật Hạnh, ngạ quỷ ngay trong hang) lệch với hướng mới (hang = nỗi sợ; ngạ quỷ ở Bến Không Tiếng). **Có đúng hai chỗ gọi `caveEnter`:** `encounters.js:382` (nút "Lại gần miệng hang" cuối `boulderVisit`, định nghĩa ở `:364`) và `encounters.js:600` (`K.offer("cave", "Vào hang đá", caveEnter)` trong `loop()`); định nghĩa ở `:395`. Không có chỗ gọi nào ngoài `encounters.js` và `test/`. Xem Q2. |
| `public/palace.js` | Lớp phủ DOM + canvas 400 × 720, tự vẽ, có nút "Rời đi", `Palace.open/isOpen/close`. | **Mẫu tích hợp tốt nhất:** lớp phủ tự chứa, không đụng `World`. Vùng làm giống vậy nhưng có đi lại. |
| `public/app.js` | `onWorldTap` → `World.pick` → thẻ thông tin nơi chốn (`infoContent`), `uiBusy()` chặn nhịp truyện khi có màn khác mở. Truyền cho `Mind` `darkness()`, `phase()`. | Ba chỗ nối nhỏ: nút "Bước vào hang" trong thẻ nơi chốn, chặn chạm/phím khi vùng mở, thêm `Zones.isOpen()` vào `uiBusy()`. |
| `public/mind.js` | Dữ liệu theo nhân vật trong `S` (khóa `dhutanga.mind`), `Mind.kit` cho module ngoài: `S`, `save`, `api()`. `loop()` chạy các module proximity. | Lưu vùng vào `S.zones` qua `Mind.kit`. **Đã đối chiếu:** `step()` (`public/mind.js:791`) thoát sớm nếu `api.busy()`, và `tapPrompt()` (`:781`) cũng vậy, trước khi chạy các module proximity (kể cả `encounters.js:600`). `api.busy` là `uiBusy()` của `app.js` (`public/app.js:1831`, `:1836`). Vì vậy chỉ cần `Zones.isOpen()` trong `uiBusy()` là chặn được `boulderVisit/caveEnter` khi đang trong hang (xem §8.4 R2). |
| `public/clock.js` | `Clock.at(h)` trả `name`, `dark`. | Ambient của vùng đọc `api().darkness()` và `api().phase()` (đã có trong `Mind.init`), nên chạy đúng cho cả nhân vật có đồng hồ và legacy. |
| `public/event-catalog.js` | `DISCOVER_IDS` cố định 12 mục, test giữ khớp với `Discover.ENTRIES`. | Thêm mục Sổ cho hang phải sửa cả hai file cùng lúc (PR riêng, sau các PR đêm). |

## 4. Hệ vùng (zone system)

### 4.1. Mô hình dữ liệu

Mỗi vùng là **dữ liệu thuần** (không hàm vẽ trong dữ liệu), để test được bằng Node như `clock.js`:

```js
// Design-only, chưa phải API thật
{
  id: "hang_vong_tam",
  name: "Hang Vọng Tâm",
  realm: "nhan_gian",            // narrativeRealm, khác physicalZone (World Bible §2)
  size: { w: 400, h: 1500 },     // đơn vị vùng; rộng 400 = rộng màn dọc ở zoom 1
  palette: "hang",               // khóa vào bảng màu riêng của vùng
  loreBasis: "fiction",
  entries: { world_hang: "cua" },   // vào từ đâu → đứng ở nút nào
  nodes: {                       // các "scene chunk" người chơi đứng được
    cua:  { x: 200, y: 1400, r: 70, name: "Cửa hang", kind: "entry" },
    sanh: { x: 200, y: 1150, r: 90, name: "Sảnh Gió", kind: "hub" },
    // ...
  },
  edges: [                       // lối đi giữa các nút; đi được = dải quanh đoạn thẳng/đường cong
    { a: "cua", b: "sanh", w: 46, via: [[190, 1290]] },
    { a: "sanh", b: "vach", w: 34, gate: null },
    { a: "dai", b: "hanh_lang", w: 28, gate: "hang.light" },   // đầu cổng = nút "hanh_lang"; qua cổng cần nguồn sáng MỖI lần
    // ...
  ],
  exits: [                       // ra khỏi vùng
    { at: "cua", to: { world: "hang", dx: 0, dy: 30 } },
    { at: "khe_sang", to: { world: "hang", dx: 70, dy: -80 } },  // lối vòng về, ra chỗ khác
  ],
  landmarks: [                   // thứ để nhìn và bấm
    { id: "ho_dom_sang", node: "ho", x: 120, y: 900, tier: "discoverable", look: "Mặt hồ lặng. Dưới nước có vài đốm sáng nhỏ.", story: "hang.ho.dom_sang", disc: "hang_ho" },
    { id: "dai_tang_da", node: "dai", tier: "ambient", vista: { toY: 380, hold: 3 } },
    // ...
  ],
  gates: {
    // Hai khái niệm tách bạch:
    //  - discovered: đã tới đầu cổng (lưu mãi trong S.zones.seenGates, không bao giờ mất);
    //  - passWhen: điều kiện đi QUA cổng, kiểm tra theo vật đang có MỖI lần đi qua (không persist).
    "hang.light": { previewOpen: true, passWhen: { anyOf: [["item:den_nho"], ["story:guide_cave"]] }, notReady: "hang.hanh_lang.chua_den" },
  },
  ambient: { day: {...}, dusk: {...}, night: {...} },   // xem §4.4
  storySlots: ["hang.nguong.first", "hang.hoc.su_gia"],
  futureSlots: ["hang.ben_xa", "hang.ghost_corner"],
}
```

**Quy ước:**
- `nodes` là nơi dừng (có bán kính đứng được), `edges` là hành lang có bề rộng `w`. **Vùng đi được = hợp các hình tròn nút và các dải hành lang.** Không cần lưới ô hay mặt nạ ảnh.
- `gate` trên cạnh: người chơi **luôn đi tới đầu cạnh** và nhìn vào (preview); lần đầu tới là `discovered` (ghi vào `S.zones.seenGates`, giữ mãi). **Đi qua** cần `passWhen` đúng *tại thời điểm đó* (ví dụ đang có `den_nho`); không có thì dừng ở đầu cổng, bấm vào mới hiện gợi ý (`notReady`). Bỏ đèn đi thì lần sau qua cổng phải có đèn lại; cái đã *khám phá* và đã *thấy* thì không mất.
- `tier` của landmark theo [Exploration UX §3](exploration-ux-and-gating.md): `ambient` (không bấm được, chỉ đẹp), `discoverable` (hiện chấm nhỏ khi vào tầm, bấm để xem), `interactable` (có chuyện). Không có mức nào tự mở sheet.
- `vista`: khi đứng yên ở nút đó vài giây, camera **tự trôi nhẹ** về hướng cảnh xa rồi trôi lại. Đây là cách "cảnh ngắm không popup". Chạm màn hình là dừng ngay.
- Mỗi id (`node`, `landmark`, `gate`, `story`) có tiền tố vùng để không trùng giữa các vùng.

### 4.2. Đi lại

- **Chạm để đi**, như bản đồ nhân gian: điểm chạm được **kéo về điểm đi được gần nhất** (`nearestWalkable`), rồi tìm đường trên đồ thị nút–cạnh (BFS/Dijkstra trên ≤ 20 nút, chi phí rất nhỏ). Nhân vật đi theo chuỗi điểm `via` của cạnh, không đi xuyên vách.
- Chạm vào landmark `discoverable`/`interactable`: đi tới cạnh nó rồi **hiện thẻ nhỏ** (1–3 dòng, nút `Xem kỹ` / `Đi tiếp`). Thẻ nằm trong lớp phủ của vùng, không dùng `#sheet` của `Mind` để khỏi chồng lớp và khỏi lẫn với truyện đêm.
- Bàn phím (desktop): mũi tên đi theo hướng, bị chặn trong vùng đi được.
- Tốc độ đi chậm hơn bản đồ nhân gian một chút (trong hang người ta đi dè dặt); không chạy.
- **Không có rơi, ngã, chết, hết giờ.** Ra khỏi hang luôn bấm được (nút `Ra khỏi hang` góc trên trái, như "Rời đi" của `Palace`).

### 4.3. Camera và chuyển vùng

- Màn dọc, rộng vùng 400 đơn vị = rộng màn ở zoom 1 (giống `BASE_VIEW_W`). Ở 375px tỉ lệ ≈ 0,94 px/đơn vị, nét vẽ vẫn đọc được.
- Camera theo người chơi theo trục dọc với cùng neo như `World` (`anchor` ≈ 0,62: người chơi hơi dưới giữa, thấy nhiều phía trước mặt); trục ngang chỉ trượt khi vùng rộng hơn màn.
- Kéo một ngón để nhìn quanh trong giới hạn `lookRange` (như `World`), 12 giây không chạm thì trôi về. Zoom chụm: **không có trong lát cắt đầu** (đỡ việc, đỡ lỗi); để sau.
- **Chuyển vùng:** mờ tối 350 ms → đổi vùng → sáng dần 450 ms. Vào hang: tối hơn một nhịp (mắt chưa quen), rồi sáng lên trong ~3 giây ("mắt quen dần với bóng tối"). `prefers-reduced-motion`: bỏ trôi camera và chỉ cắt mờ ngắn.
- Ra hang qua `cua`: về đúng cửa hang trên bản đồ nhân gian (`World.setPlayer(hang.x, hang.y + 30)`). Ra qua `khe_sang`: về một chỗ khác trên sườn đá (`hang.x + 70, hang.y - 80`), để vòng về không phải đi ngược.

### 4.4. Ambient theo pha trời

Vùng **không có đồng hồ riêng**. Đọc `Mind.kit.api().darkness()` (0–1) và `phase()` (tên pha của `Clock`, `null` với nhân vật legacy), chia ba nhóm:

| Nhóm | Điều kiện | Dùng cho |
|---|---|---|
| `day` | `darkness < 0.3` | ánh trời xiên vào cửa hang và khe sáng, bụi lơ lửng trong vệt nắng |
| `dusk` | `0.3 ≤ darkness < 0.55`, hoặc pha "Chiều tàn", "Chạng vạng", "Gà gáy", "Rạng sáng" | ánh cam nhạt ở cửa, dơi bay ra (chạng vạng) / bay về (rạng sáng) |
| `night` | `darkness ≥ 0.55` | cửa hang chỉ còn ánh trăng xanh xám; trong hang chỉ đèn người chơi, đốm sáng hồ, tàn than hốc trú |

Bên trong sâu (từ sảnh trở vào) độ tối gần như cố định; pha trời chỉ đổi **chỗ có lỗ thông ra ngoài** (cửa, khe sáng, giếng trời trên đài ngắm). Như vậy hang có cảm giác thật mà không phải vẽ lại cả vùng mỗi pha. Thời tiết chưa có (Weather Engine chưa code); để chỗ `ambient.rain` trong dữ liệu.

### 4.5. Cách vẽ (canvas thủ tục, nhẹ trên mobile)

Một canvas riêng của lớp phủ, ba lớp:

1. **Nền tĩnh** vẽ một lần vào canvas ẩn (offscreen) khi mở vùng, khi đổi kích thước màn và khi đổi nhóm ambient: vách đá, sàn, nhũ đá, hồ, cầu, chữ khắc. Hình khối bằng `ellipse`, `quadraticCurveTo`, gradient như `drawHang`/`drawBoulder` trong `world.js`. Chỉ vẽ dải đang thấy cộng một màn trên dưới; vùng 1500 đơn vị chia 3 khúc cache.
2. **Lớp động** mỗi khung hình: nhân vật, ánh lăn tăn mặt hồ (vài đường sin), giọt nước, bụi/đom đóm (≤ 24 hạt), lửa đèn rung, dơi (≤ 6).
3. **Lớp sáng** như `shade` của `World`: tô tối cả màn theo độ tối vùng, rồi khoét gradient tròn quanh từng nguồn sáng (`destination-out`), sau đó cộng một gradient ấm (`lighter`) cho đèn. Tối đa 6 nguồn sáng cùng lúc.

**Ngân sách:** `devicePixelRatio` chặn ở 2 (như `World`); không `getImageData`, không blur filter, không ảnh bitmap ngoài. **Hiện `World.frame` không có nút dừng, nên bản đồ nhân gian vẫn vẽ bên dưới lớp phủ.** Hướng đã chọn: **tạm dừng vẽ bản đồ nhân gian khi vùng mở** bằng một hook nhỏ `World.setPaused(bool)` (vài dòng, đặt trong Z2 hoặc một PR cực nhỏ ngay trước Z2; xem §8.2). Bắt buộc **đo FPS trên mobile 375px** (xem §8.3, R1).

### 4.6. Lưu "đã tới đâu" theo nhân vật

Thêm vào dữ liệu tâm của nhân vật (`Mind.kit.S`, khóa `dhutanga.mind`, đã nằm trong `CHAR_KEYS` của `Save` nên guest lưu ở máy, tài khoản lưu theo nhân vật):

```js
// Cổng ánh sáng không lưu "đã mở": passWhen luôn tính lại theo vật đang có.
S.zones = {
  v: 1,
  nodes:     { "hang_vong_tam:cua": 1731400000000, ... },   // đã đứng ở nút nào, lần đầu lúc nào
  marks:     { "hang_vong_tam:ho_dom_sang": 1731400100000 }, // đã bấm xem landmark nào
  seenGates: { "hang.light": 1731400200000 },                // đã tới đầu cổng (discovered); KHÔNG nói gì về việc có được đi qua
  visits:    { "hang_vong_tam": 2 },                         // số lần vào vùng, cho biến thể quay lại
  stones:    { "hang_vong_tam": 1 },                         // hòn đá người chơi tự xếp (§5.6)
}
```

- **Chỉ thêm khóa mới**, không đổi khóa có sẵn. Save cũ không có `S.zones` thì coi là rỗng; tạo lười khi cần. **Không cần bước `Migrate` mới**, không đổi `dhutanga.v`. Một test khẳng định: nạp save cũ → mở và đóng vùng không đụng khóa nào khác; save mới đọc bằng client cũ thì client cũ chỉ bỏ qua `zones` (`load()` hiện trải `{...fresh(), ...s}` nên giữ nguyên khóa lạ).
- **Không lưu vị trí trong hang.** Tải lại trang khi đang ở trong hang → về cửa hang trên bản đồ nhân gian. Đơn giản, an toàn, không có trạng thái treo.
- Ghi lần đầu mỗi id một lần (idempotent), thời gian là `Date.now()`; không thưởng lặp.
- Theo nhân vật nên **hai PC cùng tài khoản không thấy chung** cổng đã mở hay dấu tích. Đúng luật tách spoiler.
- Sổ Hành Trình: vài dấu tích chính đi vào `Discover.ENTRIES` (cùng một Sổ, không sổ riêng) và `Journey.discovery` như các mục hiện có. Phần `S.zones.marks` là chi tiết nhỏ hơn, không hiện thành mục Sổ riêng.

### 4.7. Gắn vào game ít nhất có thể

| File | Thay đổi | Ghi chú đụng độ |
|---|---|---|
| `public/zones.js` (mới) | lõi thuần: dữ liệu vùng, đồ thị, `nearestWalkable`, `route`, `gateOpen`, `S.zones` | không ai đang sửa |
| `public/zones-view.js` (mới) + `public/zones.css` (mới) | lớp phủ, canvas, vẽ, chạm, thẻ nhỏ, âm thanh | không ai đang sửa |
| `public/index.html` | thêm 3 dòng (`zones.css`, `zones.js`, `zones-view.js`), sau `encounters.js`, trước `app.js` | nhỏ; dễ gộp |
| `public/app.js` | ≈ 10 dòng: nút "Bước vào hang" trong thẻ nơi chốn `hang` khi `Zones.canEnter("hang")`; `onWorldTap` trả sớm khi `Zones.isOpen()`; `uiBusy()` thêm `Zones.isOpen()` (đủ để chặn nhịp truyện và proximity của `Mind`); truyền `goTo/setPlayer` khi ra vùng; cờ `zones` bật thì nối cả hai đường gọi `caveEnter` (xem Z2) | các PR đêm sửa `app.js` nhẹ; giữ thay đổi ở ba điểm riêng, rebase sau cùng |
| `test/client-zones.test.js` (mới) | test thuần cho đồ thị và save | không ai đang sửa |
| `public/world.js` | hook `World.setPaused(bool)` vài dòng (Z2 hoặc PR cực nhỏ ngay trước Z2) | cần cho §4.5 |
| `public/encounters.js` | **chỉ trong Z2**, tối thiểu: khi cờ `zones` bật, hai chỗ gọi `caveEnter` (`:382`, `:600`) đều dẫn vào cùng một lối vào vùng | cần review gameplay + tương thích `caveEnter` kỹ trước khi gộp |
| **Không sửa** | `public/mind.js`, `public/storylets.js` | `Mind` đã tôn trọng `api.busy()` |

**Bật/tắt:** cờ `APP_CONFIG.zones` (mặc định tắt) và `?zones` khi `dev`. Tắt cờ thì game y như hôm nay.

### 4.8. Mobile 375px

- Lớp phủ `position: fixed; inset: 0`, tôn trọng `env(safe-area-inset-*)`.
- Nút `Ra khỏi hang` 44 × 44 px tối thiểu, góc trên trái; tên nơi đang đứng và pha trời góc trên phải, chữ 13–14px.
- Thẻ landmark ở đáy, cao tối đa 38% màn, có thể vuốt xuống để đóng; luôn còn thấy cảnh phía trên.
- Vùng chạm của landmark ≥ 44px dù hình vẽ nhỏ hơn.
- Không có chữ trên canvas ngoài tên nơi khi mới tới (mờ dần sau 2 giây).

### 4.9. Vai, đa người chơi, an toàn

- Lát cắt đầu: **PC người dân và PC sư** (`villageRole()`), giống điều kiện cửa hang hiện tại. PC ma có góc riêng ở hang theo [World Bible §1](world-exploration-bible.md) nhưng **không phải lối tới bến**; để `futureSlots.ghost_corner`.
- Trong lát cắt đầu vùng là **một người chơi (MVP solo)**; thiết kế để sau hỗ trợ presence theo `zoneId`. **Quyết định cho Z2:** người đang ở trong hang **không** được hiển thị như đang đứng ngoài cửa hang cho người khác; MVP ẩn họ khỏi bản đồ nhân gian hoặc gắn trạng thái "trong hang" (chọn một khi làm Z2, ghi lại trong PR). Thấy nhau trong vùng để sau (Q6).
- Không có thẻ tâm nào được trao trong hang ở lát cắt đầu. Ngồi ngắm, nghỉ, quan sát: **không thẻ, không tăng chỉ số tâm, không `swingMood`** trong MVP (Q4).

## 5. Hang Vọng Tâm — bố cục chi tiết

> Mood: **đẹp nhưng bất an**; chủ đề **nhận ra nỗi sợ**, chánh niệm và tỉnh giác ([World Bible §3](world-exploration-bible.md)). Tiếng vọng không hoàn toàn đáng tin. Không có quỷ hiện ra dọa trong lát cắt đầu. `loreBasis: fiction`, các gợi ý về sợ hãi và kinh hành dẫn **MN 4 Bhayabherava** ở mức gợi mở 〔cần giáo thọ Theravāda duyệt〕.

### 5.1. Đồ thị cảnh

```text
                       [giếng trời]
                            :
     (vực)  ...  [H6 Hành lang Tiếng Vọng] ── [H7 Ngưỡng Sâu]  ...  (xa: ánh xanh của bến)
                    ║ cổng: nguồn sáng / người dẫn     ║ (lát cắt 1: chỉ nhìn)
                    ║                                  
   [H8 Khe Sáng] ─ [H5 Đài Ngắm] ═══════ Gờ Rêu ═══════ [H3 Vách Khắc]
        │  ra ngoài     │                                   │
        │ (lối vòng về) │ cầu đá                       ▲    │ hành lang hẹp
        ▼               │                                   │
   bản đồ nhân gian  [H2 Hồ Tĩnh] ──── bậc nước ──── [H4 Hốc Trú]
                        \                                /
                         \                              /
                          `──────── [H1 Sảnh Gió] ─────'     ← hub, thấy ba hướng
                                         ╲__ bậc đá thẳng lên Vách Khắc (cạnh sanh–vach, mũi ▲ ở trên)
                                         │
                                    [H0 Cửa Hang]
                                         │
                            tảng đá lớn trên bản đồ nhân gian
```

- **Hub:** `H1 Sảnh Gió`. Từ đây có **ba hướng khám phá thật, không tính lối về Cửa Hang**: trái xuống Hồ Tĩnh (ánh lăn tăn), phải sang Hốc Trú (đốm than đỏ), thẳng lên Vách Khắc bằng **bậc đá thẳng** (cạnh `sanh`–`vach`; vết khắc bắt ánh đèn). Cạnh về `cua` là cạnh thứ tư, không được đếm.
- **Vòng A (vòng hồ):** Sảnh → Hồ Tĩnh → bậc nước → Hốc Trú → Sảnh.
- **Vòng B (vòng cao):** Sảnh → Hồ → cầu đá → Đài Ngắm → Gờ Rêu → Vách Khắc → hành lang hẹp → Hốc Trú → Sảnh. (Vẫn khép kín: đi lên bằng Hồ, xuống bằng hành lang hẹp.)
- **Vòng C (đường tắt, tùy chọn):** Sảnh → bậc đá thẳng → Vách Khắc → hành lang hẹp → Hốc Trú → Sảnh. Cạnh mới tạo thêm vòng, vòng A và B vẫn hợp lệ.
- **Lối vòng về:** Đài Ngắm → Khe Sáng → ra sườn đá trên bản đồ nhân gian. Không phải đi lại đường cũ.
- **Cửa sâu:** Hành lang Tiếng Vọng → Ngưỡng Sâu, **nhìn thấy trước từ Đài Ngắm** (ngọn đèn nghiêng trong gió ở cuối hành lang).

Kích thước gợi ý (đơn vị vùng, rộng 400): Cửa y≈1420, Sảnh y≈1180, Hồ (trái) và Hốc (phải) y≈900–950, Đài (trái trên) và Vách (phải trên) y≈560–620, Khe Sáng y≈480 cạnh trái, Hành lang y≈380→220, Ngưỡng y≈160. Cả vòng cao đi chậm ≈ 90 giây; một vòng hồ ≈ 40 giây.

### 5.2. Từng cảnh

Mỗi cảnh ghi: phác bố cục (nhìn từ trên xuống, chéo 3/4 như bản đồ nhân gian), mốc, ánh sáng, âm thanh, hướng vẽ, chuyện khi bấm.

#### H0 — Cửa Hang

```text
   ▒▒▒▒ rễ cây, dây leo rủ (tiền cảnh, che mép trên) ▒▒▒▒
  ███                                              ███
  ██   nhũ đá ngắn ▾ ▾  ▾                           ██
  █     .  bóng tối sâu dần lên phía trên  .         █
  █              ( Sảnh Gió, mờ )                     █
  ██        ░ vệt sáng trời đổ vào sàn ░              ██
  ███   đá   ░░░░  [bạn]  ░░░░   bậc đá   ███
      ~~~ rêu, lá khô gió thổi vào ~~~
```

- **Mốc:** bậc đá mòn (`ambient`); dây leo ở mép (`ambient`, đung đưa khi có gió); dấu chân cũ trên đất ẩm (`discoverable`: "Có dấu chân người, đã cũ, đi vào mà không thấy đi ra. Hay họ ra lối khác?" — gợi lối vòng về).
- **Ánh sáng:** theo nhóm ambient. Ngày: vệt nắng xiên vàng nhạt, bụi bay. Chạng vạng: cam, dơi bay ra. Đêm: ánh trăng xanh xám mờ, người chơi chỉ còn ánh đèn mình (nếu có) hoặc bóng tối dịu cho tới khi mắt quen.
- **Âm thanh:** gió thổi vào miệng hang (ù nhỏ), tiếng côn trùng bên ngoài nhỏ dần khi đi vào.
- **Hướng vẽ:** đá xám lục như `drawHang` (`#2f3432`, `#3b403e`, rêu `#26402c`), nhưng nhìn từ trong ra; tiền cảnh dây leo tối gần đen, vẽ đè lên nhân vật để có chiều sâu.

#### H1 — Sảnh Gió (hub)

```text
                 ┌──── vách cao, vết khắc lấp lánh ────┐
                 │          (Vách Khắc ↑)               │
     ≈ ánh nước ≈│                                      │ ● than đỏ
     (Hồ ↖)      │      ○ đá tròn ngồi được             │ (Hốc ↗)
                 │   gió lùa, bụi xoáy  [bạn]           │
                 └───────────── lối ra ↓ ───────────────┘
```

- **Mốc:** hòn đá tròn (`interactable`: "Ngồi nghỉ" → nhân vật ngồi, camera lùi ra một chút cho thấy cả ba hướng; đứng lên khi chạm); vết gió trên cát mịn chỉ về phía khe sáng (`ambient`, nhìn kỹ mới thấy); **chỗ xếp đá** (§5.6).
- **Ánh sáng:** tối đều; ba nguồn ở ba hướng là thứ dẫn mắt: xanh lạnh lăn tăn bên trái, đỏ cam bên phải, vàng nhạt trên vách. Đèn người chơi là vòng ấm nhỏ ở giữa.
- **Âm thanh:** gió trầm, thỉnh thoảng một tiếng vọng không rõ từ trên cao (là tiếng gió qua hành lang; người chơi chưa biết).
- **Thiết kế:** đây là chỗ người chơi **thấy ba lựa chọn cùng lúc** (Hồ, Hốc, bậc đá lên Vách; lối về Cửa là thứ tư); không có chữ chỉ đường.

#### H2 — Hồ Tĩnh (điểm thưởng ngoạn 1)

```text
        ┌─ cầu đá vòng lên Đài Ngắm ─┐
        │      ╭────────────╮        │
   nhũ  │  ~~~ │  · ✦  ·    │ ~~~    │  nhũ đá phản chiếu
   đá ▾ │  ~~~ │   ✦   ·  ✦ │ ~~~    │  ngược dưới nước
        │      ╰────────────╯        │
        │  bãi sỏi sáng   [đá ngồi]  │ ── bậc nước → Hốc Trú
        └────────── ↓ Sảnh ──────────┘
```

- **Mốc:** đốm sáng dưới mặt nước (`discoverable` → dấu tích **`hang_ho`**: "Dưới nước có những đốm sáng nhỏ. Không phải sao, cũng không phải đèn."); đá ngồi ven hồ (`interactable`: **ngắm hồ**: nhân vật ngồi, camera hạ xuống sát mặt nước, nhũ đá in ngược, giọt nước rơi tạo vòng tròn; không chữ, không câu hỏi; đứng dậy khi chạm); cầu đá (`ambient`, đi qua được, dẫn lên Đài Ngắm).
- **Ánh sáng:** mặt hồ phát sáng nhạt xanh ngọc (`#9fd2c1` là màu `jade` có sẵn, giảm độ đậm), đốm sáng nhấp nháy chậm; đèn người chơi phản chiếu thành vệt ấm dài trên nước. Đây là tương phản ấm–lạnh đẹp nhất của hang.
- **Âm thanh:** nước nhỏ giọt có tiếng vọng (một delay ngắn), mỗi 2–5 giây một giọt; khi ngồi thì gió nhỏ đi.
- **Biến thể quay lại:** sau khi đã xem vết khắc ở Vách Khắc, đốm sáng dưới hồ **xếp thành hình giống một ký hiệu trên vách** khi đêm xuống (đúng [Map Brief §4](map-brief-hang-va-coi-gioi.md): "ánh sáng hiện khác khi biết chữ trên vách"). Không giải thích; Sổ chỉ ghi "Đốm sáng dưới hồ giống vết khắc trên vách." `fiction`.

#### H3 — Vách Khắc

```text
   ┌──────── vách đá phẳng, cao ────────┐
   │  ⌒  ☸?  ≋   │││   ⌒   (vết khắc)    │
   │    ≋   ⌒   ⊙      │││              │
   │ ─── Gờ Rêu ← Đài Ngắm               │
   │          [bạn]                      │
   └──── hành lang hẹp ↓ Hốc Trú ────────┘
```

- **Mốc:** vết khắc (`discoverable` → dấu tích **`hang_vach`**: "Ai đó khắc những vạch ngắn, xếp từng nhóm. Như người đếm ngày, hay đếm bước."); một vết khắc khác thấp hơn, mới hơn (`interactable`, lần quay lại thứ hai trở đi: "Nét này còn mới. Có người vẫn hay ghé đây." — mở sợi dây tới sư già / người từng trú ở Hốc).
- **Manh mối của Hạnh (landmark để tự tìm; chưa chốt vị trí, đề xuất Hốc Trú hoặc chân Ngưỡng Sâu):** mảnh ký ức của Hạnh (legacy `manh_ky_uc`, xem Q2) chuyển thành một landmark trong hang để người chơi *tự tìm*, không tự trao. Nhân vật **đã có** `manh_ky_uc` thì landmark chỉ hiện dấu vết (ví dụ một mẩu giấy cũ trong khe đá), **không trao lại** vật. Không thẻ Bi/Niệm nào được tự trao khi chỉ quan sát, di chuyển hay xong một cảnh.
- **Nội dung khắc:** **không dùng chữ Pāli, không dùng biểu tượng tôn giáo thật làm câu đố** trong lát cắt đầu. Chỉ là vạch đếm và vài hình đơn giản (bàn chân, ngọn đèn). Nếu sau này muốn khắc một câu kinh, phải có nguồn và duyệt 〔cần giáo thọ Theravāda duyệt〕.
- **Ánh sáng:** đèn người chơi lia ngang làm vết khắc lóe lên (vẽ bằng nét sáng hơn theo khoảng cách tới đèn). Không có đèn: vết khắc mờ, vẫn thấy hình khối vách.
- **Âm thanh:** im hơn các chỗ khác; tiếng bước chân vọng rõ.

#### H4 — Hốc Trú

```text
        ┌─ mái đá thấp ─┐
        │  ▓ ổ rơm cũ   │
        │  ● tàn than   │   ← đèn ấm trọng tâm của vòng dưới
        │  ⌂ bình nước  │
        │  [chỗ ngồi]   │
        └── ↙ Sảnh  ↖ hành lang hẹp (Vách) ── bậc nước → Hồ
```

- **Mốc:** tàn tro còn hơi ấm (`discoverable` → dấu tích **`hang_hoc_tru`**: "Tro còn ấm. Ai đó vừa ngồi đây, rồi đi."); ổ rơm và bình nước đất (`ambient`); chỗ ngồi tựa vách (`interactable`, lặng ngồi; không trao thẻ).
- **Chuyện khi bấm (story slot `hang.hoc.su_gia`):** nếu PC đã gặp vị sư già ở nghĩa địa (`Discover` `su_gia` đã thấy), thêm một dòng: "Cạnh tro có một chiếc lá bồ đề kẹp trong khe đá. Giống chiếc lá ở chỗ thầy ngồi." Đúng [Map Brief §4](map-brief-hang-va-coi-gioi.md) "nghe thêm một đoạn nếu từng gặp sư". Người trú là **một người hành hương vô danh** (không phải quá khứ của PC; có thể nối với vị sư già ở chương sau, chưa xác nhận); chỉ qua dấu tích môi trường: **một người hành hương vô danh** (Q3).
- **Ánh sáng:** than đỏ thở chậm (độ sáng dao động 0,8–1,0 chu kỳ 4 giây), ấm hơn đèn người chơi; bóng người chơi đổ dài ra phía hồ.
- **Âm thanh:** lách tách rất nhỏ của than; gió tắt hẳn trong hốc. Đây là chỗ **yên nhất** của hang.

#### H5 — Đài Ngắm (điểm thưởng ngoạn 2, tiền cảnh cửa sâu)

```text
   ☁ giếng trời: trăng / nắng rọi một cột sáng ☁
                    ▼
   ~~~~~~~~~~ VỰC TỐI ~~~~~~~~~~      xa: · · ánh xanh rất nhỏ (bến?)
        ╲  Hành lang Tiếng Vọng  ╲
         ╲    ...  ...   🔥 đèn nghiêng (Ngưỡng Sâu)
   ┌─ lan đá tự nhiên ─┐
   │  [bạn]  đứng nhìn  │ ── Gờ Rêu → Vách Khắc
   │  Khe Sáng ←        │
   └── cầu đá ↓ Hồ ─────┘
```

- **Mốc:** **vista** (`ambient`): đứng yên 3 giây ở mép đài, camera trôi lên chậm cho thấy vực, hành lang, ngọn đèn nghiêng ở Ngưỡng Sâu, và rất xa một vài chấm sáng xanh lạnh (bến xa; người chơi chưa biết là gì) rồi trôi về. Không chữ. Lần đầu ghi vào `S.zones.marks` là `dai_vista`.
- **Ngọn đèn nghiêng** (`discoverable` từ xa): bấm khi đứng ở đài → "Ở cuối lối hẹp kia có một ngọn đèn ai để lại. Lửa nghiêng hẳn về một phía, như có gió từ dưới sâu thổi lên." Không mở cổng, không giao việc.
- **Ánh sáng:** cột sáng từ giếng trời đổi theo pha (ngày: trắng ấm; đêm: xanh bạc; đêm không trăng sau này khi có lịch trăng). Ngọn đèn nghiêng là chấm ấm duy nhất ở phía trước, đúng "đèn ấm làm trọng tâm trên nền sâu lạnh".
- **Âm thanh:** gió từ vực lên, có tiếng vọng lời không rõ (một lần mỗi lần tới, không lặp liên tục). Đây là chỗ tên hang ("Vọng Tâm") được cảm nhận: tiếng vọng như tiếng của chính mình.

#### H6 — Hành lang Tiếng Vọng (cổng ánh sáng `hang.light`)

```text
   ┌─────────── vách ép sát ───────────┐
   │ ░ [đầu hành lang: luôn tới được]   │
   │ ▓▓▓ tối đặc ▓▓▓▓▓▓▓▓▓▓▓▓▓ 🔥 ▓▓▓▓▓ │  → Ngưỡng Sâu
   └────────────────────────────────────┘
```

- **Preview luôn mở; `discovered` khác `passWhen`:** đi tới đầu hành lang là *đã khám phá* cổng (ghi `seenGates`, giữ mãi). Chỉ đoạn thực sự tối bên trong mới cần nguồn sáng, và **mỗi lần đi qua** đều kiểm tra lại theo vật đang có. Đi tới đầu hành lang, nghe tiếng bước chân của mình vọng lại lệch nhịp (vọng trễ hơn thật một chút, cảm giác như có người đi theo; thật ra là tiếng vọng).
- **Bấm khi chưa có nguồn sáng:** "Trong kia tối đặc. Không có đèn thì không thấy lối. Người làng nói địa thần ở cổng làng có đèn cho người ngay thẳng." (gợi ý, không giao việc; người dẫn đường là lối thay thế). Nguồn sáng của MVP là **`den_nho`** (đèn của địa thần, đã có trong game): đang có `den_nho` thì đi qua được; không có thì dừng ở đầu hành lang. Đèn dầu của Ông Tư là tùy chọn ở giai đoạn sau (Q5); không thêm vật mới trong MVP.
- **Lát cắt đầu dừng ở đây:** có đèn (vào lúc đó) thì đi hết hành lang tới chân Ngưỡng Sâu.

#### H7 — Ngưỡng Sâu (lát cắt đầu: chỉ nhìn)

- Ngọn đèn nghiêng đặt trên một phiến đá; phía sau là bậc đá đi xuống bóng tối, gió lạnh thổi lên. 
- **Lát cắt đầu:** bấm vào ngưỡng → "Nhìn xuống, tim đập nhanh hơn. Người này lùi lại một bước, rồi thấy mình đang lùi." Hai nút: `Đứng yên, thở một hơi` / `Quay ra`. Cả hai đều **không thất bại**, không trừ gì; "Đứng yên" chỉ ghi `S.zones.marks.nguong_first`. Sổ: "Có một lối đi xuống. Chưa xuống." Nỗi sợ là trạng thái tạm thời của nhân vật, không phải điểm yếu của người chơi ([World Bible §4.1](world-exploration-bible.md)).
- **Sau này (không thuộc lát cắt):** cổng đi xuống theo [Exploration UX §4](exploration-ux-and-gating.md): `anyOf` (đã nhận ra nỗi sợ + có đèn) / (đã kinh hành cùng sư + sư chỉ lối) / (đã học bài về sợ hãi + một lần đứng yên ở ngưỡng + có đèn). Gợi ý khi chưa đủ: "Ở nghĩa địa, một vị sư già thường đi kinh hành khi trời tối. Có lẽ thầy biết cách đi tiếp." 〔cần giáo thọ Theravāda duyệt: cách diễn đạt sợ hãi và kinh hành〕

#### H8 — Khe Sáng (lối vòng về)

- Khe nứt hẹp, đi nghiêng người; cuối khe là ánh trời. Ngày: nắng vàng, lá rung. Đêm: trăng, tiếng dế ùa vào.
- Ra ngoài là một gờ đá trên sườn tảng đá lớn, nhìn xuống nghĩa địa từ một góc chưa từng thấy (lần đầu: camera bản đồ nhân gian `lookAt` nhẹ về phía làng 2 giây). **Lần đầu ra lối này ghi dấu chân "đi vào mà không thấy đi ra" ở H0 thành có lời giải** trong Sổ.

### 5.3. Danh sách mốc

| id | Cảnh | Tầng | Có chuyện? | Ghi Sổ | Biến thể |
|---|---|---|---|---|---|
| `cua_dau_chan` | H0 | discoverable | 1 dòng | marks | có lời giải sau khi ra Khe Sáng |
| `sanh_da_ngoi` | H1 | interactable | ngồi nghỉ | — | — |
| `sanh_xep_da` | H1 | interactable | xếp một hòn đá | marks | số đá tăng mỗi lần quay lại |
| `ho_dom_sang` | H2 | discoverable | 1 dòng | **`hang_ho`** | xếp thành hình vết khắc (đêm, sau `hang_vach`) |
| `ho_da_ngoi` | H2 | interactable | ngắm hồ (không chữ) | marks | đêm/ngày khác nhau |
| `vach_khac` | H3 | discoverable | 1–2 dòng | **`hang_vach`** | — |
| `vach_net_moi` | H3 | interactable | 1 dòng | marks | chỉ từ lần thứ hai |
| `hoc_tro_am` | H4 | discoverable | 1–2 dòng | **`hang_hoc_tru`** | thêm dòng lá bồ đề nếu đã gặp sư già |
| `hoc_cho_ngoi` | H4 | interactable | lặng ngồi | — | — |
| `dai_vista` | H5 | ambient (vista) | không | marks | cột sáng theo pha |
| `dai_den_nghieng` | H5 | discoverable | 1–2 dòng | marks | — |
| `hanh_lang_dau` | H6 | threshold | gợi ý đèn | seenGates | qua được khi đang có đèn (kiểm tra mỗi lần) |
| `nguong_nhin` | H7 | threshold | 2 lựa chọn, không thất bại | marks | sau này mở lối xuống |
| `khe_sang_ra` | H8 | ambient | không | marks | ngày/đêm |

**Dấu tích Sổ khám phá:** ba mục **`hang_ho`, `hang_vach`, `hang_hoc_tru`** (cần thêm vào `Discover.ENTRIES` và `DISCOVER_IDS`, PR Z3). Mục `hang` hiện có ("Hang bí mật") vẫn là mục mở cửa. Mục `day_hang` và `hang` legacy giữ nguyên (Q2): nhân vật đã có thì không mất, không ghi lại.

### 5.4. Ánh sáng tổng thể và bảng màu

- **Nền:** đá xám lục lạnh, tối (`#1a1e1c` → `#3b403e`), rêu lục tối (`#26402c`). Ban ngày chỉ sáng ở cửa và khe, không "bật sáng" cả hang như bản đồ nhân gian.
- **Lạnh:** nước và đốm sáng xanh ngọc nhạt (`#9fd2c1` giảm độ đậm), trăng xanh bạc.
- **Ấm (trọng tâm):** đèn người chơi (`lantern` `#e6c56f`), than hốc trú (`ember` `#e09050`), ngọn đèn nghiêng ở ngưỡng. **Mỗi khung hình tối đa một nguồn ấm lớn ngoài đèn người chơi**, để mắt luôn biết nhìn đâu.
- **Người chơi không có đèn:** một vòng sáng rất nhỏ, lạnh, quanh nhân vật ("mắt quen bóng tối") để không bao giờ tối đen khó chịu; các chỗ cần đèn (Vách Khắc lóe sáng, Hành lang) thì kém đi rõ.
- **Ngày đổi theo `Clock`:** chỉ đổi cửa hang, Khe Sáng, cột sáng giếng trời, dơi.

### 5.5. Âm thanh

Dùng lại `NightAudio` có sẵn (`sigh` cho gió ngưỡng sâu, `bell` không dùng trong hang). Thêm trong `zones-view.js`, cùng công tắc âm thanh của game:
- giọt nước: tổng hợp sine ngắn + delay vọng (rẻ, không cần file);
- gió trầm: noise lọc thấp, âm lượng theo cảnh (to ở sảnh và đài, tắt trong hốc);
- tiếng vọng bước chân ở hành lang: lặp lại tiếng bước với trễ 180–260 ms.
Không nhạc nền trong lát cắt đầu; không âm thanh dọa (tiếng hét, cười).

### 5.6. Biến thể khi quay lại

1. **Hòn đá xếp ở Sảnh Gió:** mỗi lần vào hang có thể xếp thêm một hòn (tối đa 7). Hòn đá của chính người chơi, theo nhân vật. Dấu vết nhỏ "mình đã ở đây".
2. **Đốm sáng hồ** xếp thành hình vết khắc (đêm, sau khi đã thấy `hang_vach`).
3. **Nét khắc mới** ở Vách Khắc từ lần thứ hai.
4. **Lá bồ đề** ở Hốc Trú nếu đã gặp sư già.
5. **Dơi** bay ra lúc chạng vạng, bay về lúc rạng sáng; ban ngày treo im trên trần sảnh.
6. **Dấu chân ở cửa** có lời giải sau khi đi Khe Sáng.

### 5.7. Tương tác: cảnh ngắm không popup

- Đi ngang mọi mốc: **không** mở gì. Mốc `discoverable` chỉ hiện một chấm sáng nhỏ khi người chơi ở trong 80 đơn vị và mốc chưa xem.
- Ba chỗ ngồi (Sảnh, Hồ, Hốc) và vista Đài Ngắm là **thưởng ngoạn thuần**: không câu hỏi, không chữ (trừ tên nơi lúc mới tới), không thẻ.
- Thẻ landmark luôn có `Đi tiếp`; thẻ nào cũng ≤ 3 dòng.

## 6. Sơ bộ: Bến Không Tiếng và đồi tháp / vườn mây

Dùng **đúng hệ vùng** ở §4: dữ liệu mới, bảng màu mới, cùng lớp phủ. Mức sơ đồ; chưa chi tiết, chưa vào giai đoạn 2.

### 6.1. Bến Không Tiếng — Bờ Nổi (lối người sống)

> Cảm giác **trống, xót thương**, không kinh dị. Người chơi **được đi dạo trước, chưa có chuyện**. Cảnh giới ngạ quỷ (peta) chỉ được gợi qua cảnh vật và câu chuyện có nguồn `Petavatthu` sau khi biên tập 〔cần giáo thọ Theravāda duyệt〕. Không có cơ chế bắt PC làm điều keo kiệt hay tham để nhận thẻ.

```text
      sông lặng, sương thấp, không một tiếng nước vỗ
   ══════════════════════════════════════════════
     [Bến đò] ─ chiếc thuyền cũ buộc dây mục
        │
   [Bậc đá từ hang] ── [Bãi cột đá]  ‖  (ba cột: thấy từ hai phía; Bờ Chìm của PC ma ở bên kia)
        │                 │
     [Xóm hoang] ─────── [Giếng cạn]
     nhà không khói bếp,   gầu khô, dây đứt
     hũ gạo vỡ              
        └────── lối vòng về hang ──────┘
```

- **Hub:** bậc đá đổ xuống từ hang. **Ba hướng:** bến đò (trái), xóm hoang (giữa), bãi cột đá (phải). **Vòng:** xóm hoang ↔ giếng cạn ↔ bãi cột ↔ bậc đá.
- **Thưởng ngoạn:** mép nước nhìn sương; bậc thềm nhà hoang nhìn xuống xóm.
- **Dấu tích:** hũ gạo vỡ có tiếng gạo rơi mà không thấy gạo; vệt chân trên bùn chỉ đi một chiều.
- **Ánh sáng:** xanh xám lạnh, không có nguồn ấm nào **trừ đèn người chơi mang theo**. Chính điều đó kể chuyện: ở đây thiếu hơi ấm. Không màu đỏ máu, không mặt người méo.
- **Vào:** từ Ngưỡng Sâu của hang (sau cổng ở §5.2 H7). **Ra:** lối bậc đá lên hang, hoặc (sau này) lối nhỏ ra bờ suối rừng tre trên bản đồ nhân gian.
- **Mở theo brief, ưu tiên ngắm trước:** đi dạo cả Bờ Nổi không cần điều kiện thêm. **Chiều sâu** (nghe chuyện một sinh linh, vùng sâu) cần dấu vết truyện và hiểu biết về tâm bất thiện (đã nghe/đã học), **không** cần đã có tâm bất thiện. Thẻ bất thiện, nếu có, chỉ là **hiểu một hiện tượng khi quan sát có ngữ cảnh** ([World Bible §4.2](world-exploration-bible.md)).
- **PC ma** đi Bờ Chìm qua khe suối rừng tre (đã chốt, [Ghost Episode Pack 01](ghost-episode-pack-01.md)); hai bờ chỉ chung landmark ba cột đá, dữ liệu theo nhân vật nên không chia manh mối.

### 6.2. Đồi tháp và tiền đình mây

> Cảm giác **rộng, thong dong, trang nghiêm nhẹ**. Gợi mở duyên thiện, không phải "đủ công đức thì lên trời". Biên cảnh Tứ Đại Thiên Vương (Cātummahārājika) và các loài trong DN 20, DN 32 chỉ ở **cảnh và lời kể đã duyệt**; không phải mọi yakkha là ngạ quỷ, không phải quỷ thần nào cũng ác, không biến các vị vua thành boss 〔cần giáo thọ Theravāda duyệt〕.

```text
   tầng 3 (sau)     · · · [Vườn Mây Hoan Hỷ: hồ sen, đình hoa, cầu mây] · · ·  (chỉ nhìn qua lan can)
                                     ▲
   tầng 2 (sau)  [Tiền đình bốn hướng] ── [Ban công mây]
                                     ▲  ngưỡng: ánh sáng trong tháp đổi
   tầng 1 (ngắm ngay)
        [Bậc rêu] ── [Sân đồi] ── [Chân tháp: gạch rêu, đá khắc chuyện cũ]
            │            │                 │
      lối từ nghĩa địa  [Gốc cây ngắm mây]  [Lối vòng sau tháp → xuống tịnh thất]
```

- **Tầng 1 (ngắm ngay, không điều kiện):** sân đồi, chân tháp, gốc cây ngắm mây, lối vòng sau tháp. Ba hướng: tháp, mây phía xa, lối xuống tịnh thất. Rêu phát sáng nhẹ khi đêm xuống ([Map Brief §4](map-brief-hang-va-coi-gioi.md)).
- **Ánh sáng:** vàng đất ong ấm của tháp (`drawThap`), mây hồng–tím lúc chạng vạng, sao nhiều về đêm; tầng mây trên (sau này) sáng dịu, ít bóng.
- **Vào:** từ `PLACES.thap` trên bản đồ nhân gian, cùng kiểu nút "Lên đồi tháp" ở thẻ nơi chốn; **không** thay `Palace` ngay. `Palace` hiện có có thể trở thành "căn phòng" ở tầng 2 khi người chơi chủ động gặp vị thiên.
- **Điều kiện mở chiều sâu** (tầng 2): vật dẫn + một việc lành đã thật sự làm trong game + biết chuyện về tháp, **hoặc** một nhánh duyên tương đương; **không đòi điểm công đức**. Một lựa chọn thiếu thiện tâm chỉ khép cuộc gặp, người chơi vẫn đứng ở nơi an toàn, cảnh không sập, quyền đã mở không mất ([World Bible §5 Mạch C](world-exploration-bible.md)).

## 7. Conditions, state changes & consequences (lát cắt hang)

| Hành động | Điều kiện | Thay đổi | Hậu quả |
|---|---|---|---|
| Thấy nút "Bước vào hang" | `villageRole()` và `q.cave.found` (đã có) và cờ `zones` bật | — | — |
| Vào vùng (cả hai đường `caveEnter`, `encounters.js:382` và `:600`) | như trên; nhân vật đã `q.cave.step === "done"` vẫn vào được | `S.zones.visits.hang_vong_tam += 1`, `nodes["…:cua"]`; không đụng `q.cave`, vật, thẻ, discovery | lớp phủ mở; `uiBusy()` đúng |
| Đứng ở một nút | — | `nodes[...]` lần đầu | không thông báo |
| Bấm mốc discoverable | — | `marks[...]` lần đầu; nếu có `disc` → mục Sổ | toast nhỏ "Sổ Hành Trình: …" như `Discover.track` |
| Tới đầu Hành lang | — | `seenGates["hang.light"]` lần đầu | đã khám phá, giữ mãi |
| Đi qua Hành lang | đang có `den_nho` (hoặc người dẫn, sau này); kiểm tra **mỗi lần** | — | không có đèn thì dừng ở đầu hành lang, không mất gì |
| Ngưỡng: "Đứng yên, thở một hơi" | đã tới H7 | `marks.nguong_first` | không thẻ ở lát cắt; dùng sau cho cổng sâu |
| Rời hang | bất cứ lúc nào | — | về cửa hang hoặc sườn đá; không mất gì |
| Tải lại trang trong hang | — | — | về bản đồ nhân gian ở cửa hang |

Không có điểm số, không thất bại, không mất vật phẩm, không thẻ tâm trong lát cắt.

## 8. Kế hoạch giai đoạn 2 (chỉ khi được duyệt)

### 8.1. Lát cắt chơi được

Cho PC người dân (và sư): **Cửa hang, Sảnh Gió, Hồ Tĩnh, Hốc Trú, Đài Ngắm (vista), Vách Khắc, Khe Sáng; hai vòng A và B; đầu Hành lang Tiếng Vọng (preview + gợi ý đèn); ba dấu tích Sổ.** Ngưỡng Sâu và đi qua hành lang có thể vào PR Z4 nếu kịp. Chưa có Bến, tháp, PC ma, nhiều người trong vùng, zoom.

### 8.2. Chia PR nhỏ (đều vào `develop` của `thachpv91/Dhutanga_practice`)

> **Tình trạng:** PR #35 và #37 đã nằm trong `develop` qua #40, nên Z3 **không còn phải chờ** chúng (vẫn phải rebase trên `develop` mới nhất ngay trước khi mở). Z2 cần review gameplay và tương thích `caveEnter` cẩn thận trước khi gộp.

| PR | Nội dung | File | Kiểm thử |
|---|---|---|---|
| **Z1 — lõi vùng** | dữ liệu Hang Vọng Tâm, đồ thị, `nearestWalkable`, `route`, `gateOpen`, đọc/ghi `S.zones`; chưa nạp vào trang | `public/zones.js`, `test/client-zones.test.js` | `npm test` |
| **Z2 — lớp phủ, vẽ và hợp nhất lối vào** | lớp phủ, canvas 3 lớp, đi lại, camera, chuyển vùng, thẻ mốc, nút ra; `World.setPaused` (hoặc PR cực nhỏ ngay trước Z2); khi cờ `zones` bật, **cả hai đường gọi `caveEnter` (`encounters.js:382` từ `boulderVisit`, `:600` từ `K.offer`) đều vào cùng một lối vào vùng**, popup cũ không còn hiện; cờ tắt thì legacy nguyên vẹn | `public/zones-view.js`, `public/zones.css`, `public/index.html` (3 dòng), `public/app.js` (≈10 dòng), `public/world.js` (`setPaused`), `public/encounters.js` (tối thiểu, 2 điểm gọi) | `npm test` + trình duyệt desktop và 375px + **đo FPS trên mobile 375px** + test tương thích `caveEnter` (§8.3) |
| **Z3 — Sổ Hành Trình** | thêm `hang_ho`, `hang_vach`, `hang_hoc_tru` vào `Discover.ENTRIES` và `DISCOVER_IDS` (+ server dùng cùng catalog). Chỉ dùng Sổ Hành Trình hiện có, **không tạo sổ riêng** | `public/encounters.js`, `public/event-catalog.js`, test catalog có sẵn | không phải chờ #35/#37 nữa; **rebase trên `develop` mới nhất** ngay trước khi mở |
| **Z4 — biến thể và âm thanh** | đá xếp, đốm sáng hồ đổi, nét khắc mới, lá bồ đề, dơi, giọt nước, gió, vọng; cổng hành lang và Ngưỡng Sâu nhìn | `public/zones.js`, `public/zones-view.js` | test thuần cho điều kiện biến thể + trình duyệt |
| **(tùy) W1** | nếu muốn tách `World.setPaused` ra khỏi Z2: PR cực nhỏ ngay trước Z2 | `public/world.js` (vài dòng) | trình duyệt mobile |

**Phạm vi file:** Z1, Z4 không sửa `encounters.js`, `mind.js`, `storylets.js`. Z2 chỉ sửa `encounters.js` ở hai điểm gọi `caveEnter` và `world.js` ở `setPaused`; `mind.js` không phải sửa (đã có `api.busy()`; không cần PR M1). `app.js` chỉ ba điểm nối riêng biệt, rebase trước khi mở.

### 8.3. Kiểm thử

**Test thuần (`node --test`, nạp bằng `client-harness` như `client-clock.test.js`):**
- đồ thị liên thông; từ mọi nút về được `cua` **không qua cổng**;
- **hub có ≥ 3 cạnh tới nút khác nhau, không tính cạnh về nút entry** (`cua`); riêng Sảnh Gió có cạnh tới `ho`, `hoc` và `vach`;
- có ít nhất **2 chu trình** không qua cổng (vòng A, vòng B);
- hub có ≥ 3 cạnh tới nút khác nhau; có ≥ 2 nút có mốc thưởng ngoạn không chuyện; ≥ 1 mốc có `disc`; ≥ 1 cổng có `previewOpen: true` và nút preview nhìn thấy được từ một nút khác (`visibleFrom`); ≥ 1 lối ra khác `cua` (đúng checklist [Map Brief §1](map-brief-hang-va-coi-gioi.md), viết thành test để vùng sau cũng phải qua);
- `nearestWalkable` luôn trả điểm trong vùng đi được; `route` không đi qua cạnh có cổng đóng; khi cổng mở thì đi được;
- `passWhen` với `anyOf` các nhóm, **kiểm tra theo vật đang có mỗi lần**: có `den_nho` thì qua, bỏ `den_nho` thì không qua nữa; còn `seenGates` (đã tới đầu cổng) **vẫn giữ** dù bỏ vật;
- **tương thích `caveEnter`:** cờ `zones` tắt → hai đường gọi `caveEnter` (`boulderVisit` và `K.offer`) chạy y như cũ; cờ bật → cả hai dẫn vào cùng một lối vào vùng, không hiện popup cũ; nhân vật `q.cave.step === "done"` vẫn vào được map mới và `manh_ky_uc`, thẻ, `Discover` `hang`/`day_hang`, `q.cave.step` không đổi;
- **`Zones.isOpen()` trong `uiBusy()`:** khi vùng mở, `api.busy()` trả true nên `Mind.step()` không chạy proximity (không bật `boulderVisit/caveEnter`);
- save: không có `S.zones` → rỗng, không ghi gì cho tới khi có hành động; ghi id lần hai không đổi thời gian; không đụng khóa nào khác của `S`; hai nhân vật khác nhau không thấy dữ liệu của nhau (hai `S` riêng); dùng `seenGates` (không còn `gates`);
- **kích thước save:** test cho cả **guest (localStorage)** và **nhân vật đăng nhập (PUT `/api/characters/:id`, giới hạn thân 96 KiB)**: dữ liệu nhân vật đầy đủ cùng `S.zones` ở mức tối đa (7 hòn đá, mọi nút/mốc/cổng) vẫn nằm dưới giới hạn, lưu và nạp lại đúng ở cả hai đường;
- mọi id trong một vùng không trùng; mọi `disc` có trong `DISCOVER_IDS` (sau Z3).

**Trình duyệt (cần ô Browser đang hiển thị để chụp):** desktop và 375 × 812; vào bằng nút ở thẻ nơi chốn, đi hết hai vòng, ra bằng Khe Sáng, tải lại trang, đổi pha trời (dùng `devTime` có sẵn) xem cửa hang và khe đổi, bật/tắt âm thanh, đo khung hình bằng `performance.now()` trong 30 giây đi lại, **bắt buộc đo FPS trên mobile 375px khi `World.setPaused` đang bật**; kiểm tra không có popup nào tự mở khi đi ngang; kiểm tra nhịp truyện đêm không chen vào khi đang trong hang. Báo rõ phần nào chưa kiểm được (máy thật, Safari iOS).

### 8.4. Rủi ro

| | Rủi ro | Cách giảm |
|---|---|---|
| R1 | Hai canvas cùng vẽ mỗi khung hình (bản đồ nhân gian dưới lớp phủ) tụt khung hình trên máy yếu | tạm dừng vẽ bản đồ nhân gian khi vùng mở (`World.setPaused`, trong Z2 hoặc PR cực nhỏ ngay trước); cache nền tĩnh; **đo FPS trên mobile 375px** |
| R2 | `Mind.loop` bật `boulderVisit/caveEnter` vì vị trí nhân gian vẫn ở cửa hang | không di chuyển người chơi nhân gian. `Zones.isOpen()` nằm trong `uiBusy()`; `Mind.step()` (`mind.js:791`) và `tapPrompt()` (`:781`) đã thoát sớm khi `api.busy()` (đã đối chiếu), nên không cần sửa `mind.js`. Có test (§8.3) |
| R3 | Popup legacy `caveEnter` (ngạ quỷ, bí mật Hạnh) mâu thuẫn hang mới | cờ bật: mọi đường `caveEnter` thay bằng trải nghiệm vùng (Z2); cờ tắt: legacy nguyên vẹn. Bảo toàn save cũ (Q2) |
| R4 | Nhịp truyện đêm (`storylets`, `Mind`) chen vào khi đang trong hang | `uiBusy()` có `Zones.isOpen()` (cùng cơ chế R2); test + kiểm tra trên trình duyệt |
| R5 | Đồng hồ đêm tiếp tục chạy trong hang, người chơi ra thì đã gà gáy | chấp nhận (trời thật vẫn trôi); hiện tên pha trời góc màn hình để người chơi biết |
| R6 | Sổ Hành Trình bị phình mục nhỏ | chỉ 3 mục cho cả hang; chi tiết nằm trong `S.zones.marks` |
| R7 | Kích thước dữ liệu tâm gửi server lớn lên | **Giới hạn thật:** `PUT /api/characters/:id` đọc thân tối đa `MAX_DATA = 96 * 1024` (`auth.js:11`, `readBody` ở `:33`, dùng tại `:168`); quá thì từ chối "too large". Đây là giới hạn cho *toàn bộ* dữ liệu một nhân vật, không riêng `S.zones`. `S.zones` < 2 KB cho một vùng. Phải có test cho guest (localStorage) và nhân vật đăng nhập (§8.3) |
| R8 | Lời gợi ý về sợ hãi / kinh hành / ngạ quỷ bị hiểu như giáo lý | nhãn `loreBasis`, lời ngắn, chờ giáo thọ duyệt trước phát hành |

## 9. Quyết định của chủ project (2026-11-12)

| # | Quyết định |
|---|---|
| Q1 | Giữ `q.cave.found` làm điều kiện khám phá ban đầu, **không khóa tới đêm 7**; chiều sâu và chuyện quan trọng mở dần. |
| Q2 | Cờ `zones` bật: map mới thay hoàn toàn popup cũ (mọi đường gọi `caveEnter` đều dẫn vào cùng một trải nghiệm vùng); cờ tắt: legacy nguyên vẹn. Bảo toàn save cũ, `q.cave.step`, vật `manh_ky_uc` (mảnh ký ức Hạnh), discovery `hang`/`day_hang`. Manh mối Hạnh chuyển thành một landmark trong hang để người chơi tự tìm (đề xuất: Hốc Trú hoặc chân Ngưỡng Sâu; nhân vật đã có `manh_ky_uc` thì landmark chỉ hiện dấu vết, không trao lại). Không tự trao thẻ Bi/Niệm khi chỉ quan sát, di chuyển hay xong một cảnh. |
| Q3 | Người từng trú ở Hốc Trú: một người hành hương vô danh, chỉ qua dấu tích môi trường; có thể nối với vị sư già ở chương sau, chưa xác nhận. |
| Q4 | Ngồi ngắm / nghỉ / quan sát: không thẻ, không tăng chỉ số tâm, không `swingMood` trong MVP. |
| Q5 | Dùng `den_nho`; đèn dầu Ông Tư là tùy chọn giai đoạn sau. Chỉ giới hạn đoạn thực sự tối. Tách hai khái niệm: `discovered` (đã tới đầu cổng, lưu mãi trong `seenGates`) và `passWhen` (cần nguồn sáng mỗi lần đi qua, kiểm tra theo vật đang có). |
| Q6 | MVP solo; thiết kế để sau hỗ trợ presence theo `zoneId`; không hiển thị người đang trong hang như đang đứng ngoài cửa (MVP: ẩn hoặc gắn trạng thái "trong hang"; quyết định cụ thể ở Z2). |
| Q7 | Chấp nhận tám tên cảnh (Sảnh Gió, Hồ Tĩnh, Vách Khắc, Hốc Trú, Đài Ngắm, Khe Sáng, Hành lang Tiếng Vọng, Ngưỡng Sâu). |
| Q8 | Giữ overlay độc lập, tái sử dụng; không refactor `World`. |

**Không có sổ riêng:** hang không có sổ, icon HUD hay kho riêng. Chỉ dùng Sổ Hành Trình hiện có (các mục `Discover`) theo nhân vật.

**Nhắc lại:** các quyết định trên duyệt *hướng thiết kế*. Mọi đoạn có nhãn **〔cần giáo thọ Theravāda duyệt〕** vẫn chờ giáo thọ; gộp tài liệu này không duyệt nội dung giáo lý.

## 10. Acceptance checklist (cho lát cắt hang, giai đoạn 2)

- [ ] Cờ `zones` tắt: game không đổi gì; toàn bộ test cũ qua.
- [ ] Vào hang bằng một chạm chủ động; không có popup tự mở khi đi ngang bất kỳ mốc nào.
- [ ] Từ Sảnh Gió thấy ba hướng; đi được hai vòng A, B; ra được bằng Khe Sáng.
- [ ] Hồ Tĩnh và Đài Ngắm cho ngắm không chữ, không nhiệm vụ.
- [ ] Ba dấu tích vào Sổ Hành Trình một lần mỗi cái, theo nhân vật.
- [ ] Đầu Hành lang Tiếng Vọng tới được khi chưa có đèn; gợi ý nhẹ, không thất bại.
- [ ] Ánh sáng cửa hang và Khe Sáng đổi theo pha trời của nhân vật (và theo giờ cảnh với nhân vật legacy).
- [ ] 375px: nút ra 44px, thẻ mốc ≤ 38% màn, không tràn ngang; khung hình ổn định khi đi lại.
- [ ] Save cũ mở bình thường; save có `zones` không làm hỏng client cũ; nhân vật đã xong popup cũ (`q.cave.step === "done"`) vẫn vào được map mới, đồ/thẻ/discovery không đổi.
- [ ] Cờ `zones` bật: cả hai đường `caveEnter` (`encounters.js:382`, `:600`) vào cùng một trải nghiệm vùng; cờ tắt: legacy nguyên vẹn.
- [ ] Sảnh Gió có ≥ 3 hướng khám phá không tính lối về Cửa; qua Hành lang cần đèn mỗi lần, `seenGates` giữ mãi.
- [ ] Save dưới giới hạn 96 KiB cho cả guest và nhân vật đăng nhập; FPS ổn trên mobile 375px khi bản đồ nhân gian tạm dừng.
- [ ] Không thẻ tâm nào được trao trong hang; mọi lời về sợ hãi / kinh hành có nhãn chờ duyệt.
