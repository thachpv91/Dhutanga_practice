// Vật phẩm: chìa khóa và manh mối, không phải sức mạnh hay tiền. Không mua bán, không phân hạng.
// Mỗi vật có một hình minh họa SVG nhỏ (nét tay, ấm), dùng chung cho túi đồ, chi tiết và hộp "nhận được".
window.Items = (() => {
  let uid = 0;
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const FOOT = "Vật phẩm không mua bán được.";

  // Mỗi hàm vẽ nhận một tiền tố id duy nhất (để nhiều hình cùng trang không trùng id gradient).
  const ART = {
    mandarava: (u) => {
      const petals = [0, 72, 144, 216, 288].map((a) =>
        `<path transform="rotate(${a} 50 50)" d="M50 50 C38 40 39 20 50 14 C61 20 62 40 50 50 Z" fill="url(#${u}p)" stroke="#e6c56f" stroke-width="1.3" stroke-linejoin="round"/>` +
        `<path transform="rotate(${a} 50 50)" d="M50 46 L50 24" stroke="#e6c56f" stroke-opacity=".45" stroke-width=".8" stroke-linecap="round"/>`).join("");
      const dots = [20, 90, 160, 230, 300].map((a) =>
        `<circle transform="rotate(${a} 50 50)" cx="50" cy="40" r="1.6" fill="#d08a4d"/>`).join("");
      return `<defs><radialGradient id="${u}g"><stop offset="0" stop-color="#fff3c4" stop-opacity=".75"/><stop offset="1" stop-color="#e6c56f" stop-opacity="0"/></radialGradient>` +
        `<radialGradient id="${u}p" cx="50%" cy="85%" r="90%"><stop offset="0" stop-color="#f3d78a"/><stop offset=".55" stop-color="#fff6dc"/><stop offset="1" stop-color="#fffdf5"/></radialGradient></defs>` +
        `<circle cx="50" cy="50" r="47" fill="url(#${u}g)"/>${petals}` +
        `<circle cx="50" cy="50" r="7" fill="#e6c56f" stroke="#d08a4d" stroke-width="1"/>${dots}<circle cx="50" cy="50" r="2.4" fill="#fff3c4"/>`;
    },
    bat_com: (u) =>
      `<defs><linearGradient id="${u}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c98a56"/><stop offset="1" stop-color="#7d4b25"/></linearGradient>` +
      `<radialGradient id="${u}r" cx="50%" cy="80%" r="80%"><stop offset="0" stop-color="#fffdf5"/><stop offset="1" stop-color="#ece3cc"/></radialGradient></defs>` +
      `<path d="M40 30 C36 24 44 20 40 13 M52 32 C48 25 57 20 52 12 M63 30 C59 24 66 21 63 15" fill="none" stroke="#dcd5c5" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M20 52 C22 34 36 30 50 30 C64 30 78 34 80 52 Z" fill="url(#${u}r)" stroke="#bfb393" stroke-width="1.2"/>` +
      [[34,42],[46,38],[58,39],[69,44],[40,47],[53,46],[63,49],[28,48]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="1.7" fill="#fff" stroke="#d6cdb0" stroke-width=".6" transform="rotate(${x*7%40-20} ${x} ${y})"/>`).join("") +
      `<path d="M16 52 L84 52 C84 74 68 86 50 86 C32 86 16 74 16 52 Z" fill="url(#${u}c)" stroke="#5a3418" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M30 64 C34 74 42 79 50 79" fill="none" stroke="#f0b88a" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/>` +
      `<path d="M38 86 L62 86 L60 91 L40 91 Z" fill="#7d4b25" stroke="#5a3418" stroke-width="1"/>` +
      `<path d="M62 18 L80 50 M68 16 L87 47" stroke="#b8894a" stroke-width="2" stroke-linecap="round" opacity=".85"/>`,
    hoa_sen: (u) =>
      `<defs><radialGradient id="${u}g"><stop offset="0" stop-color="#dff0ff" stop-opacity=".6"/><stop offset="1" stop-color="#dff0ff" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="${u}p" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f6d9e0"/><stop offset=".5" stop-color="#fffafc"/><stop offset="1" stop-color="#ffffff"/></linearGradient>` +
      `<linearGradient id="${u}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fcf8f"/><stop offset="1" stop-color="#3f8a52"/></linearGradient></defs>` +
      `<circle cx="50" cy="44" r="46" fill="url(#${u}g)"/>` +
      `<ellipse cx="50" cy="82" rx="38" ry="10" fill="url(#${u}l)" stroke="#2f6a3f" stroke-width="1.2"/>` +
      `<path d="M50 82 L22 80 M50 82 L78 80 M50 82 L36 90 M50 82 L64 90" stroke="#d6f0b8" stroke-opacity=".55" stroke-width=".9" stroke-linecap="round"/>` +
      `<path d="M50 82 C48 70 52 62 50 54" stroke="#4f9a54" stroke-width="2.6" fill="none" stroke-linecap="round"/>` +
      `<path d="M50 56 C28 54 22 36 30 26 C40 30 46 40 50 56 Z M50 56 C72 54 78 36 70 26 C60 30 54 40 50 56 Z" fill="url(#${u}p)" stroke="#e0b8c4" stroke-width="1.1" stroke-linejoin="round"/>` +
      `<path d="M50 58 C38 50 36 28 50 14 C64 28 62 50 50 58 Z" fill="url(#${u}p)" stroke="#e6c0cc" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="M50 54 L50 24" stroke="#e8c9d2" stroke-width=".9" stroke-linecap="round"/>` +
      `<circle cx="50" cy="12" r="1.6" fill="#fff3c4"/>`,
    khan_ran: (u) =>
      `<defs><clipPath id="${u}k"><path d="M14 34 L78 24 L88 62 L26 76 Z"/></clipPath></defs>` +
      `<path d="M20 44 L84 34 L90 72 L28 84 Z" fill="#b8b0a0" stroke="#4a4238" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="M14 34 L78 24 L88 62 L26 76 Z" fill="#f4efe2" stroke="#2a2622" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<g clip-path="url(#${u}k)" stroke="#2a2622" stroke-width="5" opacity=".85">` +
      [0,1,2,3,4,5,6,7].map((i) => `<path d="M${10 + i*12} 20 L${22 + i*12} 80"/>`).join("") +
      [0,1,2,3,4].map((i) => `<path d="M10 ${34 + i*11} L95 ${24 + i*11}" stroke-width="3.5"/>`).join("") + `</g>` +
      `<path d="M14 34 L78 24 L88 62 L26 76 Z" fill="none" stroke="#2a2622" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M26 76 L24 88 M32 75 L31 87 M38 74 L38 86 M44 73 L45 85" stroke="#2a2622" stroke-width="1.4" stroke-linecap="round"/>`,
    banh_da: (u) =>
      `<defs><radialGradient id="${u}b" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#f3d9a0"/><stop offset=".7" stop-color="#d9a860"/><stop offset="1" stop-color="#b57a38"/></radialGradient></defs>` +
      `<circle cx="50" cy="52" r="38" fill="url(#${u}b)" stroke="#8a5a26" stroke-width="1.5"/>` +
      `<circle cx="50" cy="52" r="31" fill="none" stroke="#fff3c4" stroke-opacity=".4" stroke-width="1" stroke-dasharray="3 3"/>` +
      [[34,38],[48,32],[62,40],[40,50],[56,52],[70,56],[30,62],[46,66],[62,70],[52,44],[38,74],[72,42],[24,50]].map(([x,y],i) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.2" fill="#2a1d14" transform="rotate(${i*37%180} ${x} ${y})"/>`).join("") +
      `<path d="M20 40 C24 28 34 22 44 20" fill="none" stroke="#fff3c4" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>`,
    rau_ma: (u) => {
      const leaf = (cx, cy, r, rot) =>
        `<g transform="rotate(${rot} ${cx} ${cy})"><path d="M${cx} ${cy + r * 0.2} L${cx - r * 0.35} ${cy - r * 0.95} A${r} ${r} 0 1 0 ${cx + r * 0.35} ${cy - r * 0.95} Z" fill="url(#${u}l)" stroke="#2f6a3f" stroke-width="1.2" stroke-linejoin="round"/>` +
        `<path d="M${cx} ${cy} L${cx} ${cy - r * 1.2} M${cx} ${cy - r * 0.2} L${cx - r * 0.7} ${cy - r * 0.8} M${cx} ${cy - r * 0.2} L${cx + r * 0.7} ${cy - r * 0.8}" stroke="#d6f0b8" stroke-opacity=".55" stroke-width=".8" fill="none" stroke-linecap="round"/></g>`;
      const stems = [-24, -12, 0, 12, 24].map((a) => `<path d="M50 80 L${50 + a * 1.1} 46" stroke="#4f9a54" stroke-width="2" stroke-linecap="round"/>`).join("");
      return `<defs><radialGradient id="${u}l" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#b6e08a"/><stop offset="1" stop-color="#5aa557"/></radialGradient></defs>` +
        stems + leaf(24, 42, 15, -28) + leaf(76, 42, 15, 28) + leaf(36, 30, 16, -10) + leaf(64, 30, 16, 10) + leaf(50, 40, 17, 0) +
        `<path d="M43 76 L57 76 L59 84 L41 84 Z" fill="#c9a24e" stroke="#8a6a2a" stroke-width="1"/>` +
        `<path d="M42 78 L58 82 M42 82 L58 78" stroke="#8a6a2a" stroke-width=".9" stroke-linecap="round"/>` +
        `<path d="M41 84 L36 92 M45 84 L44 93 M55 84 L56 93 M59 84 L64 92" stroke="#c9a24e" stroke-width="1.6" stroke-linecap="round"/>`;
    },
    la_gao: (u) =>
      `<defs><radialGradient id="${u}g"><stop offset="0" stop-color="#9fd2c1" stop-opacity=".55"/><stop offset="1" stop-color="#9fd2c1" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="${u}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe8a8"/><stop offset="1" stop-color="#6fae7a"/></linearGradient></defs>` +
      `<circle cx="50" cy="50" r="47" fill="url(#${u}g)"/>` +
      `<path d="M50 90 C20 70 18 34 50 10 C82 34 80 70 50 90 Z" fill="url(#${u}l)" stroke="#e6c56f" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M50 90 L50 16 M50 70 L32 54 M50 70 L68 54 M50 52 L36 38 M50 52 L64 38 M50 36 L42 27 M50 36 L58 27" stroke="#fff3c4" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    den_nho: (u) =>
      `<defs><radialGradient id="${u}g" cx="50%" cy="38%"><stop offset="0" stop-color="#ffd98a" stop-opacity=".7"/><stop offset="1" stop-color="#e6c56f" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="${u}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9915a"/><stop offset="1" stop-color="#8a5326"/></linearGradient></defs>` +
      `<circle cx="50" cy="42" r="42" fill="url(#${u}g)"/>` +
      `<path d="M50 14 C41 26 41 34 50 40 C59 34 59 26 50 14 Z" fill="#ffd98a" stroke="#e6c56f" stroke-width="1"/>` +
      `<path d="M50 24 C47 29 47 33 50 36 C53 33 53 29 50 24 Z" fill="#fff6dc"/>` +
      `<path d="M50 40 L50 48" stroke="#4a3320" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M26 56 C26 50 74 50 74 56 C74 78 62 86 50 86 C38 86 26 78 26 56 Z" fill="url(#${u}c)" stroke="#6a3f1c" stroke-width="1.4" stroke-linejoin="round"/>` +
      `<path d="M74 55 C84 54 88 58 90 62 C84 62 78 62 73 64" fill="url(#${u}c)" stroke="#6a3f1c" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="M26 56 C14 54 12 68 24 70" fill="none" stroke="#6a3f1c" stroke-width="2.4" stroke-linecap="round"/>` +
      `<ellipse cx="50" cy="52" rx="19" ry="3.4" fill="#4a3320" stroke="#6a3f1c" stroke-width="1"/>` +
      `<path d="M34 64 C36 74 44 79 50 79" fill="none" stroke="#f0b88a" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>`,
    y_mau_dat: (u) =>
      `<defs><linearGradient id="${u}cloth" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bca47e"/><stop offset="1" stop-color="#796247"/></linearGradient></defs>` +
      `<path d="M27 16 L70 20 L83 42 L71 51 L79 85 L25 90 L20 56 L14 39 Z" fill="url(#${u}cloth)" stroke="#5a4834" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<path d="M26 21 L70 79 M17 44 L78 54 M24 70 L75 67 M47 20 L42 87" stroke="#ddc6a0" stroke-width="1.8" stroke-dasharray="3 3" fill="none"/>` +
      `<path d="M26 16 L70 20 L83 42" fill="none" stroke="#e2c9a1" stroke-width="2"/>`,
    manh_vai_cu: (u) =>
      `<defs><linearGradient id="${u}raw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cdbf9f"/><stop offset="1" stop-color="#8f8061"/></linearGradient></defs>` +
      `<path d="M22 30 C34 22 44 34 56 26 C68 20 78 30 82 40 L76 58 C80 68 72 80 60 78 C50 84 36 80 28 74 C18 66 24 52 18 44 Z" fill="url(#${u}raw)" stroke="#5f523b" stroke-width="1.5" stroke-linejoin="round"/>` +
      `<path d="M30 40 L66 36 M26 54 L72 52 M34 66 L64 64" stroke="#e3d6b4" stroke-width="1.4" stroke-dasharray="3 3" fill="none" stroke-opacity=".8"/>` +
      `<path d="M62 24 L66 14 M66 14 L70 21 M66 14 L61 17" stroke="#5a4a2e" stroke-width="1.6" stroke-linecap="round" fill="none"/>` +
      `<ellipse cx="36" cy="60" rx="6" ry="3.4" fill="#6f5a3a" fill-opacity=".35"/>`,
    manh_ky_uc: (u) =>
      `<defs><linearGradient id="${u}p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe3c4"/><stop offset="1" stop-color="#c9b88e"/></linearGradient></defs>` +
      `<g transform="rotate(-6 50 50)"><path d="M22 18 L58 14 L64 24 L60 34 L70 44 L66 58 L74 70 L70 84 L26 86 Z" fill="url(#${u}p)" stroke="#8d7a4e" stroke-width="1.3" stroke-linejoin="round"/>` +
      `<path d="M58 14 L64 24 L60 34 L70 44 L66 58 L74 70 L70 84" fill="none" stroke="#fff8e0" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="3 2.5"/>` +
      `<rect x="30" y="24" width="30" height="34" rx="2" fill="#a89a74" fill-opacity=".45"/>` +
      `<circle cx="45" cy="37" r="6" fill="#6c6044" fill-opacity=".7"/><path d="M34 58 C34 47 56 47 56 58 Z" fill="#6c6044" fill-opacity=".7"/>` +
      `<path d="M30 68 L58 67 M30 74 L50 73.5" stroke="#8d7a4e" stroke-width="1.3" stroke-linecap="round" stroke-opacity=".7"/></g>`,
  };

  // glow: vật quý từ cõi trời hoặc thần linh có quầng sáng nhẹ (không phải hạng hiếm).
  const DEFS = {
    mandarava: {
      name: "Hoa mạn-đà-la", glow: true,
      desc: "Một bông hoa năm cánh, trắng ngà viền vàng, vẫn còn thơm và tỏa chút ánh sáng. Hoa này chỉ có ở cõi trời.",
      from: "Chư thiên để lại sau khi người này làm việc thiện.",
      use: "Chưa dùng được, có lẽ sau này sẽ mở đường vào một cung điện trên trời. Giữ hoa trong người, lòng người này sáng hơn một đêm.",
    },
    bat_com: {
      name: "Bát cơm",
      desc: "Một bát đất nung đầy cơm trắng, hơi nóng còn bốc lên nhẹ. Thơm mùi gạo mới.",
      from: "Bà cụ ở giếng làng nấu cho.",
      use: "Đem dâng sư rồi hồi hướng cho người đã khuất.",
    },
    hoa_sen: {
      name: "Đóa sen trắng", glow: true,
      desc: "Một đóa sen trắng còn khép nụ, kèm chiếc lá xanh. Cánh hoa phảng phất ánh trăng.",
      from: "Hái nhẹ bên ao sen lúc trăng lên.",
      use: "Dâng lên bàn thờ ở tịnh thất.",
    },
    khan_ran: {
      name: "Khăn rằn",
      desc: "Một chiếc khăn rằn sọc đen trắng, gấp gọn, vải mềm đã sờn nhẹ và còn mùi nắng.",
      from: "Ông lái buôn trên xe ngựa tặng, sau khi người này giúp đẩy bánh xe sa lầy.",
      use: "Một món trang phục. Sau này có thể dùng để thay đổi dáng vẻ nhân vật.",
    },
    banh_da: {
      name: "Bánh đa mè",
      desc: "Một chiếc bánh đa tròn nướng giòn, rắc đầy mè đen, thơm mùi gạo nướng.",
      from: "Ông lái buôn đổi cho, khi người này tặng ông nắm rau má.",
      use: "Có thể đem chia cho ai đó đang đói.",
    },
    rau_ma: {
      name: "Nắm rau má",
      desc: "Một nắm rau má xanh mướt, buộc bằng sợi rơm. Còn thơm mùi đất ẩm.",
      from: "Người này hái ở gốc cây mít, sau khi bị chó cắn.",
      use: "Đem cho người khác, hoặc giữ lại nấu canh.",
    },
    la_gao: {
      name: "Chiếc lá gạo sáng", glow: true,
      desc: "Một chiếc lá xanh dịu, gân lá sáng lên như có ai thắp từ bên trong.",
      from: "Thọ thần ở gốc gạo tặng, sau khi người này đưa bé Na về nhà.",
      use: "Soi thấy những dấu vết ẩn quanh gốc gạo.",
    },
    den_nho: {
      name: "Ngọn đèn nhỏ", glow: true,
      desc: "Một chiếc đèn dầu bằng đất nung, ngọn lửa nhỏ nhưng không tắt.",
      from: "Địa thần ở cổng làng trao lúc rạng đông.",
      use: "Mang vào hang đá sau đồi; đèn sáng khi lòng không sợ.",
    },
    y_mau_dat: {
      name: "Tấm y màu đất",
      desc: "Tấm y đã được nhặt vải, giặt, nhuộm và khâu qua nhiều ngày.",
      from: "Tự hoàn thành chuỗi công việc y phấn tảo trong game.",
      use: "Kỷ vật của hành trình học việc. Hiện chưa thay đổi trang phục nhân vật trên bản đồ.",
    },
    manh_vai_cu: {
      name: "Mảnh vải cũ",
      desc: "Một mảnh vải bạc màu, còn dính gai và vết bùn. Không thấy ai nhận.",
      from: "Nhặt ở bên đường, gần cổng nghĩa địa.",
      use: "Mang ra giếng giặt, rồi nhuộm và khâu thành tấm y.",
    },
    manh_ky_uc: {
      name: "Mảnh ký ức",
      desc: "Một mảnh giấy ảnh cũ bị xé dở. Thấy mờ mờ một bóng người.",
      from: "Một hồn đói sâu trong hang đá đưa cho.",
      use: "Một mảnh về cô bé Hạnh. Gom đủ để hiểu chuyện xưa.",
    },
  };

  const def = (id) => (DEFS[id] ? Object.assign({ id }, DEFS[id]) : null);
  const ids = () => Object.keys(DEFS);

  function svg(id, size = 64) {
    const draw = ART[id];
    if (!draw) return "";
    const u = "it" + (++uid) + id.replace(/\W/g, "") + "_";
    return `<svg class="item-svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${DEFS[id].name}" xmlns="http://www.w3.org/2000/svg">${draw(u)}</svg>`;
  }
  function art(id, size, cls) {
    const w = el("span", "item-art" + (DEFS[id] && DEFS[id].glow ? " glow" : "") + (cls ? " " + cls : ""));
    w.innerHTML = svg(id, size);
    return w;
  }

  // Lưới các ô vật phẩm. onPick(id) khi bấm một ô.
  function renderBag(container, owned, onPick) {
    container.replaceChildren();
    const list = (owned || []).filter((id) => DEFS[id]);
    if (!list.length) {
      container.appendChild(el("p", "bag-empty", "Túi còn trống. Vật nhận được trong đêm sẽ nằm ở đây."));
      return;
    }
    const grid = el("div", "bag-grid");
    for (const id of list) {
      const b = el("button", "bag-tile" + (DEFS[id].glow ? " glow" : ""));
      b.type = "button";
      b.appendChild(art(id, 56));
      b.appendChild(el("b", null, DEFS[id].name));
      b.addEventListener("click", () => onPick && onPick(id));
      grid.appendChild(b);
    }
    container.appendChild(grid);
    container.appendChild(el("p", "bag-foot", FOOT));
  }

  // Khung chi tiết một vật (trả về node). Dùng trong lớp phủ.
  function detailNode(id) {
    const d = def(id);
    const c = el("div", "item-card" + (d.glow ? " glow" : ""));
    c.appendChild(art(id, 150, "big"));
    c.appendChild(el("h3", "item-name", d.name));
    c.appendChild(el("p", "item-desc", d.desc));
    const dl = el("dl", "item-facts");
    [["Từ đâu", d.from], ["Để làm gì", d.use]].forEach(([k, v]) => { dl.appendChild(el("dt", null, k)); dl.appendChild(el("dd", null, v)); });
    c.appendChild(dl);
    c.appendChild(el("p", "item-foot", FOOT));
    return c;
  }

  // Lớp phủ tự dựng trong #app (hoặc body). Một lớp dùng chung.
  function overlay() {
    let o = document.getElementById("item-overlay");
    if (!o) {
      o = el("div", "item-overlay"); o.id = "item-overlay"; o.hidden = true;
      o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
      (document.querySelector(".app") || document.body).appendChild(o);
    }
    return o;
  }
  function close(o, then) { o.hidden = true; o.replaceChildren(); if (then) then(); }

  function showDetail(id, then) {
    if (!DEFS[id]) { if (then) then(); return; }
    const o = overlay(); o.replaceChildren(); o.hidden = false;
    o.appendChild(detailNode(id));
    const ok = el("button", "pill item-ok", "Cất lại"); ok.type = "button";
    ok.addEventListener("click", () => close(o, then));
    o.appendChild(ok);
    ok.focus();
  }

  // Hộp "nhận được": hình hiện dần với quầng sáng, tên và một dòng.
  function showReceived(id, then) {
    if (!DEFS[id]) { if (then) then(); return; }
    const d = def(id);
    const o = overlay(); o.replaceChildren(); o.hidden = false;
    const c = el("div", "item-got" + (d.glow ? " glow" : ""));
    c.appendChild(el("p", "item-got-label", "Nhận được"));
    c.appendChild(art(id, 130, "pop"));
    c.appendChild(el("h3", "item-name", d.name));
    c.appendChild(el("p", "item-got-line", d.desc.split(/(?<=\.)\s/)[0]));
    o.appendChild(c);
    const ok = el("button", "pill item-ok", "Cất vào túi"); ok.type = "button";
    ok.addEventListener("click", () => close(o, then));
    o.appendChild(ok);
    ok.focus();
  }

  return { def, ids, svg, art, renderBag, detailNode, showDetail, showReceived, FOOT };
})();
