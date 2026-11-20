# Hệ vùng và Hang Vọng Tâm — thiết kế map đi được v0.1

> **Status:** Proposed (chờ chủ project duyệt; giai đoạn 2 chỉ bắt đầu sau khi duyệt)
> **Scope:** world / UX / save
> **Owner doc:** [map-brief-hang-va-coi-gioi.md](map-brief-hang-va-coi-gioi.md) (bố cục, nghiệm thu map) · [world-exploration-bible.md](world-exploration-bible.md) (mô hình cõi giới)
> **Related:** [Exploration UX & Gating](exploration-ux-and-gating.md), [Game Design Principles](game-design-principles.md), [Player-Centric Narrative Model](player-character-narrative-model.md), [Journey Memory](journey-memory-and-return-ux.md), [Đồng hồ thế giới](dong-ho-the-gioi.md), [Kế hoạch bảy đêm cho PC người dân](human-world-villager-night-plan.md)
> **Code status:** Design-only; chưa sửa code. Đã đối chiếu `develop` (`b584d18`) ngày 2026-11-12: `public/world.js`, `public/app.js`, `public/encounters.js`, `public/palace.js`, `public/mind.js`, `public/clock.js`, `public/save.js`, `public/event-catalog.js`.
> **Last reviewed:** 2026-11-12

> **Nhãn duyệt giáo lý:** mọi đoạn đánh dấu **〔cần giáo thọ Theravāda duyệt〕** chỉ là cảnh vật và gợi mở trong mô phỏng (`game_interpretation` hoặc `fiction`), không khẳng định giáo lý. Không gọi mọi yakkha là ngạ quỷ, không coi lối đi giữa các cảnh là địa lý thật của các cõi, không có cơ chế bắt người chơi tạo tâm bất thiện.

## 0. Tóm tắt một trang

- **Vấn đề:** hiện chỉ có một bản đồ nhân gian (`World`, 640 × 2000 đơn vị, canvas thủ tục). Hang là chuỗi popup (`boulderVisit` → `caveEnter`), tháp là lớp phủ thoại (`Palace`). Không có nơi nào khác để *đi*.
- **Đề xuất:** một module mới `public/zones.js` (`window.Zones`) dựng **vùng** (zone): bản đồ nhỏ đi được, mở bằng lớp phủ canvas riêng phía trên bản đồ nhân gian, giống cách `Palace` đang làm. Bản đồ nhân gian không phải sửa; `app.js` chỉ thêm vài dòng nối.
- **Vùng đầu tiên:** **Hang Vọng Tâm** cho PC người dân (và sư): cửa hang, sảnh gió (hub), hồ tĩnh, vách khắc, hốc trú, đài ngắm, khe sáng; hai vòng đi khép kín; ngưỡng sâu chỉ được *nhìn thấy* trong lát cắt đầu.
- **Sau đó:** Bến Không Tiếng (Bờ Nổi) và đồi tháp/vườn mây dùng lại đúng hệ này, chỉ thay dữ liệu vùng và bảng màu.
- **Lưu:** thêm một khóa `zones` vào dữ liệu tâm của nhân vật (`dhutanga.mind`, đã là khóa theo nhân vật). Thêm vào, không đổi phiên bản save, save cũ không cần chuyển đổi.

## 1. Goal & player experience

Người chơi bước qua khe đá sau tảng đá lớn và thấy mình **đang đứng trong một nơi khác**, không phải đang đọc một tờ giấy. Họ đi chậm, nghe nước nhỏ giọt, thấy ánh sáng đổi theo giờ bên ngoài, ngồi xuống bên hồ, nhìn từ đài đá xuống một lối sâu có ngọn đèn nghiêng trong gió. Không ai giao việc. Chỉ khi người chơi bấm vào một thứ mới có vài dòng chuyện.

Thước đo: một người thích ngắm cảnh có **5–10 phút trong hang mà không gặp popup nào họ không bấm**, rời hang bằng một lối khác lối vào, và có lý do muốn quay lại (đèn ở ngưỡng sâu, đốm sáng dưới hồ đổi khác lúc đêm).

## 2. Constraints / decisions already approved

Lấy từ tài liệu nguồn, không bàn lại ở đây:

1. **Khám phá trước, chuyện theo yêu cầu** ([Game Design Principles §3](game-design-principles.md)): đi ngang không mở popup, bấm mới mở ([Exploration UX §3](exploration-ux-and-gating.md)).
2. **Mỗi map tối thiểu** một hub, ba hướng nhìn thấy, một đường vòng về, hai điểm thưởng ngoạn không nhiệm vụ, một dấu tích Sổ, một biến thể khi quay lại, một cửa sâu có tiền cảnh ([Map Brief §1](map-brief-hang-va-coi-gioi.md)). Mỗi zone cần `id, connections, walkableAreas, landmarks, ambientVariants, discoveryRewards, storySlots, futureSlots, loreBasis` ([Map Brief §5](map-brief-hang-va-coi-gioi.md)).
3. **Cổng theo bối cảnh, nhiều lối** thay vì cộng điểm; mở rồi thì giữ (`onceOpened: "persist"`) ([Exploration UX §4](exploration-ux-and-gating.md)).
4. **PC tự đặt tên**; Sư Tịnh, Ông Tư, Bà Sáu là NPC. Tiến trình, ký ức, spoiler **theo từng nhân vật** ([Player-Centric](player-character-narrative-model.md)).
5. **Một Sổ Hành Trình** theo nhân vật; không tạo sổ, icon HUD hay kho riêng cho map ([Journey Memory §0](journey-memory-and-return-ux.md)).
6. **Đồng hồ riêng mỗi nhân vật** (`Clock`, M0) quyết định trời; nhân vật legacy vẫn theo giờ cảnh ([Đồng hồ thế giới](dong-ho-the-gioi.md)).
7. **DNA hình ảnh:** canvas vẽ tay, nhân vật nhỏ, màu tiết chế, **đèn ấm làm trọng tâm trên nền lạnh**, không kinh dị nặng, không photoreal ([World Bible §9](world-exploration-bible.md)).
8. Người dân **chơi theo đêm**; hang, tháp và các tuyến cõi giới là **chiều sâu từ đêm 7 trở đi**, không ép ([Kế hoạch bảy đêm](human-world-villager-night-plan.md)). Bản thiết kế này không đổi thứ tự đó; xem câu hỏi Q1.

## 3. Hiện trạng code (đã đọc trên `develop`)

| Chỗ | Hiện có | Ý nghĩa cho thiết kế |
|---|---|---|
| `public/world.js` | `World` một bản đồ dọc 640 × 2000, `PLACES` gồm `hang` (440, 760, "Tảng đá lớn" → "Hang đá") và `thap` (350, 440). Camera dọc theo người chơi (`view.anchor`), kéo để nhìn (`lookAt`, `lookRange`), chụm để zoom, `BASE_VIEW_W = 400`. Vòng `frame()` vẽ mọi khung hình; ánh sáng bằng lớp `shade` khoét gradient. `setFx(fn)` cho phép module ngoài vẽ thêm. | Bản đồ nhân gian làm tốt việc của nó; **không nên nhét vùng thứ hai vào đây** (đổi `W/H`, `PLACES`, decor, pick sẽ đụng mọi PR khác). Học lại cách camera, ánh sáng, tỉ lệ 400 đơn vị cho màn dọc. |
| `public/encounters.js` | Nhiệm vụ `cave`: `boulderVisit()` (ngồi tựa đá → `q.cave.found = true`), `caveEnter()` (cần `den_nho`, ba bước popup với hai bóng đói và mảnh giấy của Hạnh, thẻ Bi). Gọi tự động khi `near(place("hang"), 50)` trong `loop()`. `Discover.ENTRIES` có `hang` và `day_hang`. | Giữ `q.cave.found` làm **cửa vào** vùng (đã có, không phải thêm). Popup `caveEnter` là nội dung legacy (bí mật Hạnh, ngạ quỷ ngay trong hang) lệch với hướng mới (hang = nỗi sợ; ngạ quỷ ở Bến Không Tiếng). Xem Q2. |
| `public/palace.js` | Lớp phủ DOM + canvas 400 × 720, tự vẽ, có nút "Rời đi", `Palace.open/isOpen/close`. | **Mẫu tích hợp tốt nhất:** lớp phủ tự chứa, không đụng `World`. Vùng làm giống vậy nhưng có đi lại. |
| `public/app.js` | `onWorldTap` → `World.pick` → thẻ thông tin nơi chốn (`infoContent`), `uiBusy()` chặn nhịp truyện khi có màn khác mở. Truyền cho `Mind` `darkness()`, `phase()`. | Ba chỗ nối nhỏ: nút "Bước vào hang" trong thẻ nơi chốn, chặn chạm/phím khi vùng mở, thêm `Zones.isOpen()` vào `uiBusy()`. |
| `public/mind.js` | Dữ liệu theo nhân vật trong `S` (khóa `dhutanga.mind`), `Mind.kit` cho module ngoài: `S`, `save`, `api()`. `loop()` chạy các module proximity. | Lưu vùng vào `S.zones` qua `Mind.kit`. **Rủi ro:** khi đang trong hang, vị trí trên bản đồ nhân gian vẫn ở cửa hang nên `loop()` có thể bật `boulderVisit/caveEnter`. Cần `busy()` chặn (xem §8.4). |
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
    { a: "dai", b: "hanh_lang", w: 28, gate: "hang.light" },
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
    "hang.light": { previewOpen: true, enterWhen: { anyOf: [["item:den_nho"], ["item:den_dau"], ["story:guide_cave"]] }, notReady: "hang.hanh_lang.chua_den", persist: true },
  },
  ambient: { day: {...}, dusk: {...}, night: {...} },   // xem §4.4
  storySlots: ["hang.nguong.first", "hang.hoc.su_gia"],
  futureSlots: ["hang.ben_xa", "hang.ghost_corner"],
}
```

**Quy ước:**
- `nodes` là nơi dừng (có bán kính đứng được), `edges` là hành lang có bề rộng `w`. **Vùng đi được = hợp các hình tròn nút và các dải hành lang.** Không cần lưới ô hay mặt nạ ảnh.
- `gate` trên cạnh: khi chưa mở, người chơi **vẫn đi tới đầu cạnh** và nhìn vào (preview), chỉ không đi qua. Khi bấm vào chỗ đó mới hiện gợi ý (`notReady`).
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

**Ngân sách:** `devicePixelRatio` chặn ở 2 (như `World`); không `getImageData`, không blur filter, không ảnh bitmap ngoài. **Khi vùng mở, bản đồ nhân gian vẫn chạy bên dưới** (`World.frame` không có nút dừng). Lát cắt đầu chấp nhận điều đó và đo trên máy thật; nếu tụt khung hình, thêm một hàm `World.setPaused(bool)` vài dòng trong một PR riêng nhỏ (xem rủi ro R1).

### 4.6. Lưu "đã tới đâu" theo nhân vật

Thêm vào dữ liệu tâm của nhân vật (`Mind.kit.S`, khóa `dhutanga.mind`, đã nằm trong `CHAR_KEYS` của `Save` nên guest lưu ở máy, tài khoản lưu theo nhân vật):

```js
S.zones = {
  v: 1,
  nodes:     { "hang_vong_tam:cua": 1731400000000, ... },   // đã đứng ở nút nào, lần đầu lúc nào
  marks:     { "hang_vong_tam:ho_dom_sang": 1731400100000 }, // đã bấm xem landmark nào
  gates:     { "hang.light": 1731400200000 },                // cổng đã mở (persist)
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
| `public/app.js` | ≈ 10 dòng: nút "Bước vào hang" trong thẻ nơi chốn `hang` khi `Zones.canEnter("hang")`; `onWorldTap` trả sớm khi `Zones.isOpen()`; `uiBusy()` thêm `Zones.isOpen()`; truyền `goTo/setPlayer` khi ra vùng | các PR đêm sửa `app.js` nhẹ; giữ thay đổi ở ba điểm riêng, rebase sau cùng |
| `test/client-zones.test.js` (mới) | test thuần cho đồ thị và save | không ai đang sửa |
| **Không sửa** | `public/world.js`, `public/encounters.js`, `public/mind.js`, `public/storylets.js` trong PR đầu | các PR đêm 1–7 đang sửa ba file sau |

**Bật/tắt:** cờ `APP_CONFIG.zones` (mặc định tắt) và `?zones` khi `dev`. Tắt cờ thì game y như hôm nay.

### 4.8. Mobile 375px

- Lớp phủ `position: fixed; inset: 0`, tôn trọng `env(safe-area-inset-*)`.
- Nút `Ra khỏi hang` 44 × 44 px tối thiểu, góc trên trái; tên nơi đang đứng và pha trời góc trên phải, chữ 13–14px.
- Thẻ landmark ở đáy, cao tối đa 38% màn, có thể vuốt xuống để đóng; luôn còn thấy cảnh phía trên.
- Vùng chạm của landmark ≥ 44px dù hình vẽ nhỏ hơn.
- Không có chữ trên canvas ngoài tên nơi khi mới tới (mờ dần sau 2 giây).

### 4.9. Vai, đa người chơi, an toàn

- Lát cắt đầu: **PC người dân và PC sư** (`villageRole()`), giống điều kiện cửa hang hiện tại. PC ma có góc riêng ở hang theo [World Bible §1](world-exploration-bible.md) nhưng **không phải lối tới bến**; để `futureSlots.ghost_corner`.
- Trong lát cắt đầu vùng là **một người chơi**: presence vẫn báo vị trí cửa hang trên bản đồ nhân gian; người khác không thấy ai trong hang. Thấy nhau trong vùng để sau (Q6).
- Không có thẻ tâm nào được trao trong hang ở lát cắt đầu. Việc ngồi bên hồ chỉ đổi màu tâm rất nhẹ (`swingMood`) như ngồi ở ao sen, hoặc không đổi gì (Q4).

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
        │ (lối vòng về) │ cầu đá                            │ hành lang hẹp
        ▼               │                                   │
   bản đồ nhân gian  [H2 Hồ Tĩnh] ──── bậc nước ──── [H4 Hốc Trú]
                        \                                /
                         \                              /
                          `──────── [H1 Sảnh Gió] ─────'     ← hub, thấy ba hướng
                                         │
                                    [H0 Cửa Hang]
                                         │
                            tảng đá lớn trên bản đồ nhân gian
```

- **Hub:** `H1 Sảnh Gió`. Từ đây thấy rõ **ba hướng**: trái xuống ánh lăn tăn của hồ, phải là đốm than đỏ của hốc trú, thẳng lên là vách đá có vết khắc bắt ánh đèn.
- **Vòng A (vòng hồ):** Sảnh → Hồ Tĩnh → bậc nước → Hốc Trú → Sảnh.
- **Vòng B (vòng cao):** Sảnh → Hồ → cầu đá → Đài Ngắm → Gờ Rêu → Vách Khắc → hành lang hẹp → Hốc Trú → Sảnh.
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
- **Thiết kế:** đây là chỗ người chơi **thấy ba lựa chọn cùng lúc**; không có chữ chỉ đường.

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
- **Chuyện khi bấm (story slot `hang.hoc.su_gia`):** nếu PC đã gặp vị sư già ở nghĩa địa (`Discover` `su_gia` đã thấy), thêm một dòng: "Cạnh tro có một chiếc lá bồ đề kẹp trong khe đá. Giống chiếc lá ở chỗ thầy ngồi." Đúng [Map Brief §4](map-brief-hang-va-coi-gioi.md) "nghe thêm một đoạn nếu từng gặp sư". Người trú là **NPC** (không phải quá khứ của PC); danh tính để mở (Q3).
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

#### H6 — Hành lang Tiếng Vọng (cổng `hang.light`)

```text
   ┌─────────── vách ép sát ───────────┐
   │ ░ [đầu hành lang: luôn tới được]   │
   │ ▓▓▓ tối đặc ▓▓▓▓▓▓▓▓▓▓▓▓▓ 🔥 ▓▓▓▓▓ │  → Ngưỡng Sâu
   └────────────────────────────────────┘
```

- **Preview luôn mở:** đi tới đầu hành lang, nghe tiếng bước chân của mình vọng lại lệch nhịp (vọng trễ hơn thật một chút, cảm giác như có người đi theo; thật ra là tiếng vọng).
- **Bấm khi chưa có nguồn sáng:** "Trong kia tối đặc. Không có đèn thì không thấy lối. Ông Tư hay đi rẫy đêm, có lẽ có đèn dầu cho mượn." (gợi ý, không giao việc; người dẫn đường là lối thay thế). Với `den_nho` (đèn của địa thần, đã có trong game) hoặc đèn dầu mượn (vật mới, Q5) thì đi qua được.
- **Lát cắt đầu dừng ở đây:** có đèn thì đi hết hành lang tới chân Ngưỡng Sâu.

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
| `hanh_lang_dau` | H6 | threshold | gợi ý đèn | gates | mở khi có đèn |
| `nguong_nhin` | H7 | threshold | 2 lựa chọn, không thất bại | marks | sau này mở lối xuống |
| `khe_sang_ra` | H8 | ambient | không | marks | ngày/đêm |

**Dấu tích Sổ khám phá:** ba mục **`hang_ho`, `hang_vach`, `hang_hoc_tru`** (cần thêm vào `Discover.ENTRIES` và `DISCOVER_IDS`, PR Z3). Mục `hang` hiện có ("Hang bí mật") vẫn là mục mở cửa. Mục `day_hang` legacy giữ nguyên tới khi chốt Q2.

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
| Vào vùng | như trên | `S.zones.visits.hang_vong_tam += 1`, `nodes["…:cua"]` | lớp phủ mở; `uiBusy()` đúng |
| Đứng ở một nút | — | `nodes[...]` lần đầu | không thông báo |
| Bấm mốc discoverable | — | `marks[...]` lần đầu; nếu có `disc` → mục Sổ | toast nhỏ "Sổ Hành Trình: …" như `Discover.track` |
| Đi qua Hành lang | `den_nho` **hoặc** đèn mượn **hoặc** người dẫn | `gates["hang.light"]` | cổng mở mãi cho nhân vật này |
| Ngưỡng: "Đứng yên, thở một hơi" | đã tới H7 | `marks.nguong_first` | không thẻ ở lát cắt; dùng sau cho cổng sâu |
| Rời hang | bất cứ lúc nào | — | về cửa hang hoặc sườn đá; không mất gì |
| Tải lại trang trong hang | — | — | về bản đồ nhân gian ở cửa hang |

Không có điểm số, không thất bại, không mất vật phẩm, không thẻ tâm trong lát cắt.

## 8. Kế hoạch giai đoạn 2 (chỉ khi được duyệt)

### 8.1. Lát cắt chơi được

Cho PC người dân (và sư): **Cửa hang, Sảnh Gió, Hồ Tĩnh, Hốc Trú, Đài Ngắm (vista), Vách Khắc, Khe Sáng; hai vòng A và B; đầu Hành lang Tiếng Vọng (preview + gợi ý đèn); ba dấu tích Sổ.** Ngưỡng Sâu và đi qua hành lang có thể vào PR Z4 nếu kịp. Chưa có Bến, tháp, PC ma, nhiều người trong vùng, zoom.

### 8.2. Chia PR nhỏ (đều vào `develop` của `thachpv91/Dhutanga_practice`)

| PR | Nội dung | File | Kiểm thử |
|---|---|---|---|
| **Z1 — lõi vùng** | dữ liệu Hang Vọng Tâm, đồ thị, `nearestWalkable`, `route`, `gateOpen`, đọc/ghi `S.zones`; chưa nạp vào trang | `public/zones.js`, `test/client-zones.test.js` | `npm test` |
| **Z2 — lớp phủ và vẽ** | lớp phủ, canvas 3 lớp, đi lại, camera, chuyển vùng, thẻ mốc, nút ra; sau cờ `zones` | `public/zones-view.js`, `public/zones.css`, `public/index.html` (3 dòng), `public/app.js` (≈10 dòng) | `npm test` + trình duyệt desktop và 375px |
| **Z3 — Sổ Hành Trình** | thêm `hang_ho`, `hang_vach`, `hang_hoc_tru` vào `Discover.ENTRIES` và `DISCOVER_IDS` (+ server dùng cùng catalog) | `public/encounters.js`, `public/event-catalog.js`, test catalog có sẵn | **làm sau khi các PR đêm 1–7 đã merge** hoặc rebase ngay trước khi mở |
| **Z4 — biến thể và âm thanh** | đá xếp, đốm sáng hồ đổi, nét khắc mới, lá bồ đề, dơi, giọt nước, gió, vọng; cổng hành lang và Ngưỡng Sâu nhìn | `public/zones.js`, `public/zones-view.js` | test thuần cho điều kiện biến thể + trình duyệt |
| **(nếu cần) W1** | `World.setPaused` khi lớp phủ mở, nếu đo thấy tụt khung hình | `public/world.js` (vài dòng) | trình duyệt mobile |
| **(nếu cần) M1** | `Mind.loop` bỏ qua module proximity khi `api.busy()` | `public/mind.js` (1–2 dòng) | test có sẵn của mind |

**Tránh đụng PR đêm 1–7:** Z1, Z2, Z4 không sửa `encounters.js`, `mind.js`, `storylets.js`. `app.js` chỉ ba điểm nối riêng biệt, rebase trước khi mở. Z3 và M1 chờ các PR đêm.

### 8.3. Kiểm thử

**Test thuần (`node --test`, nạp bằng `client-harness` như `client-clock.test.js`):**
- đồ thị liên thông; từ mọi nút về được `cua` **không qua cổng**;
- có ít nhất **2 chu trình** không qua cổng (vòng A, vòng B);
- hub có ≥ 3 cạnh tới nút khác nhau; có ≥ 2 nút có mốc thưởng ngoạn không chuyện; ≥ 1 mốc có `disc`; ≥ 1 cổng có `previewOpen: true` và nút preview nhìn thấy được từ một nút khác (`visibleFrom`); ≥ 1 lối ra khác `cua` (đúng checklist [Map Brief §1](map-brief-hang-va-coi-gioi.md), viết thành test để vùng sau cũng phải qua);
- `nearestWalkable` luôn trả điểm trong vùng đi được; `route` không đi qua cạnh có cổng đóng; khi cổng mở thì đi được;
- `gateOpen` với `anyOf` các nhóm; mở rồi giữ dù vật phẩm sau đó bị bỏ;
- save: không có `S.zones` → rỗng, không ghi gì cho tới khi có hành động; ghi id lần hai không đổi thời gian; không đụng khóa nào khác của `S`; hai nhân vật khác nhau không thấy dữ liệu của nhau (hai `S` riêng);
- mọi id trong một vùng không trùng; mọi `disc` có trong `DISCOVER_IDS` (sau Z3).

**Trình duyệt (cần ô Browser đang hiển thị để chụp):** desktop và 375 × 812; vào bằng nút ở thẻ nơi chốn, đi hết hai vòng, ra bằng Khe Sáng, tải lại trang, đổi pha trời (dùng `devTime` có sẵn) xem cửa hang và khe đổi, bật/tắt âm thanh, đo khung hình bằng `performance.now()` trong 30 giây đi lại; kiểm tra không có popup nào tự mở khi đi ngang; kiểm tra nhịp truyện đêm không chen vào khi đang trong hang. Báo rõ phần nào chưa kiểm được (máy thật, Safari iOS).

### 8.4. Rủi ro

| | Rủi ro | Cách giảm |
|---|---|---|
| R1 | Hai canvas cùng vẽ mỗi khung hình (bản đồ nhân gian dưới lớp phủ) tụt khung hình trên máy yếu | cache nền tĩnh; đo; nếu cần PR W1 `World.setPaused` |
| R2 | `Mind.loop` bật `boulderVisit/caveEnter` vì vị trí nhân gian vẫn ở cửa hang | khi vào vùng đặt người chơi nhân gian lùi 70 đơn vị khỏi `hang` (ngoài bán kính 50) và khôi phục khi ra; lâu dài là PR M1 |
| R3 | Popup legacy `caveEnter` (ngạ quỷ, bí mật Hạnh) mâu thuẫn hang mới | giữ nguyên tới khi chủ project chốt Q2; cờ `zones` tắt thì không đổi gì |
| R4 | Nhịp truyện đêm (`storylets`, `Mind`) chen vào khi đang trong hang | `uiBusy()` có `Zones.isOpen()`; kiểm tra trên trình duyệt |
| R5 | Đồng hồ đêm tiếp tục chạy trong hang, người chơi ra thì đã gà gáy | chấp nhận (trời thật vẫn trôi); hiện tên pha trời góc màn hình để người chơi biết |
| R6 | Sổ Hành Trình bị phình mục nhỏ | chỉ 3 mục cho cả hang; chi tiết nằm trong `S.zones.marks` |
| R7 | Kích thước dữ liệu tâm gửi server lớn lên | `S.zones` < 2 KB cho một vùng; kiểm tra giới hạn body của server trước Z2 |
| R8 | Lời gợi ý về sợ hãi / kinh hành / ngạ quỷ bị hiểu như giáo lý | nhãn `loreBasis`, lời ngắn, chờ giáo thọ duyệt trước phát hành |

## 9. Open questions for review

| # | Câu hỏi | Đề xuất của bản thiết kế |
|---|---|---|
| Q1 | Hang mở **khi nào** cho PC người dân? Kế hoạch bảy đêm để hang là chiều sâu từ đêm 7. | Cửa hang vẫn mở bằng `q.cave.found` như hiện tại (ngồi tựa đá); không khóa theo số đêm. Người không tìm thì không thấy. |
| Q2 | Popup legacy `caveEnter` (hai bóng đói, mảnh giấy của Hạnh, thẻ Bi) làm gì khi có vùng? | Giữ nguyên khi cờ tắt. Khi cờ bật: nút "Bước vào hang" thay cho popup; nội dung bóng đói chuyển dần sang Bến Không Tiếng sau khi viết lại theo `Petavatthu`; mảnh giấy của Hạnh là lore legacy cần chủ project quyết. |
| Q3 | Người từng trú ở Hốc Trú là ai? | Một NPC mới, vô danh trong lát cắt (chỉ dấu vết). Có thể sau này là vị sư già nghĩa địa (NPC), không phải quá khứ PC. |
| Q4 | Ngồi ngắm trong hang có đổi màu tâm / thẻ không? | Lát cắt: không thẻ, có thể `swingMood` rất nhẹ như ao sen. Thẻ Niệm chỉ ở ngưỡng sâu sau này, khi có tình huống chủ động. |
| Q5 | Nguồn sáng thứ hai ngoài `den_nho`? | Đèn dầu mượn của Ông Tư (NPC) như một việc nhỏ ban ngày, khớp kế hoạch bảy đêm; cần thêm vật phẩm `den_dau` (sau). |
| Q6 | Người chơi khác có thấy nhau trong hang? | Chưa, ở lát cắt. Sau này dùng presence với `zoneId`. |
| Q7 | Tên các cảnh (Sảnh Gió, Hồ Tĩnh, Vách Khắc, Hốc Trú, Đài Ngắm, Khe Sáng, Hành lang Tiếng Vọng, Ngưỡng Sâu) có ổn? | Giữ, dễ nhớ, không thuật ngữ Pāli. |
| Q8 | Lớp phủ riêng hay sửa `World` thành nhiều bản đồ? | Lớp phủ riêng (ít đụng, giống `Palace`). Gộp vào `World` khi có nhiều vùng ổn định và các PR đêm đã xong. |

## 10. Acceptance checklist (cho lát cắt hang, giai đoạn 2)

- [ ] Cờ `zones` tắt: game không đổi gì; toàn bộ test cũ qua.
- [ ] Vào hang bằng một chạm chủ động; không có popup tự mở khi đi ngang bất kỳ mốc nào.
- [ ] Từ Sảnh Gió thấy ba hướng; đi được hai vòng A, B; ra được bằng Khe Sáng.
- [ ] Hồ Tĩnh và Đài Ngắm cho ngắm không chữ, không nhiệm vụ.
- [ ] Ba dấu tích vào Sổ Hành Trình một lần mỗi cái, theo nhân vật.
- [ ] Đầu Hành lang Tiếng Vọng tới được khi chưa có đèn; gợi ý nhẹ, không thất bại.
- [ ] Ánh sáng cửa hang và Khe Sáng đổi theo pha trời của nhân vật (và theo giờ cảnh với nhân vật legacy).
- [ ] 375px: nút ra 44px, thẻ mốc ≤ 38% màn, không tràn ngang; khung hình ổn định khi đi lại.
- [ ] Save cũ mở bình thường; save có `zones` không làm hỏng client cũ.
- [ ] Không thẻ tâm nào được trao trong hang; mọi lời về sợ hãi / kinh hành có nhãn chờ duyệt.
