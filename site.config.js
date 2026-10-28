/* ============================================================================
 *  SITE.CONFIG.JS — TOÀN BỘ NỘI DUNG CỦA WEBSITE NẰM Ở ĐÂY
 * ============================================================================
 *  Cách dùng:
 *  - Muốn đổi chữ, ảnh, video, link, SEO… chỉ cần sửa file này, KHÔNG sửa index.html.
 *  - Chạy `npm run dev` để xem thay đổi ngay; chạy `npm run build` để xuất ra dist/.
 *  - Chỗ nào còn dạng [TEN_IN_HOA] là PLACEHOLDER chưa điền. Lệnh build sẽ liệt kê
 *    tất cả placeholder còn sót để bạn không bỏ quên.
 *  - Đường dẫn ảnh/video luôn viết dạng "public/..." (KHÔNG có dấu "/" ở đầu)
 *    để trang chạy được cả trên tên miền riêng lẫn GitHub Pages dạng /ten-repo/.
 *  - Ảnh nên dùng định dạng .webp, đặt tên kebab-case có số thứ tự: service-01.webp
 *  - Các khu vực dạng danh sách (dịch vụ, video, ảnh, đối tác, cảm nhận) là MẢNG:
 *    muốn thêm thì chép thêm một khối { ... }, muốn bớt thì xóa khối đó.
 *  - Ảnh chưa có vẫn build được: trang sẽ hiện khung nền thay thế, build in cảnh báo.
 * ========================================================================== */

export const SITE_CONFIG = {
  /* 1. SEO — tiêu đề tab, mô tả trên Google, ảnh khi chia sẻ Facebook/Zalo
   *    Ảnh OG: 1200×630 px (.jpg hoặc .png, < 300 KB) — dùng chung cho mọi thiết bị. */
  seo: {
    title: "[TEN_THUONG_HIEU] — MC sự kiện, đám cưới & doanh nghiệp",
    description:
      "MC chuyên nghiệp cho đám cưới, hội nghị, gala dinner và sự kiện doanh nghiệp. Dẫn dắt tự tin, duyên dáng, song ngữ Việt – Anh. Đặt lịch nhanh qua Zalo.",
    keywords: "MC sự kiện, MC đám cưới, MC hội nghị, MC gala dinner, MC song ngữ",
    siteUrl: "[URL_WEBSITE]", // VD: https://ten-ban.github.io/mc-portfolio/ (có dấu / ở cuối)
    ogImage: "public/images/og/og-image.png",
    ogImageAlt: "[TEN_THUONG_HIEU] — MC sự kiện",
    locale: "vi_VN",
    lang: "vi",
    themeColor: "#E9B2F6",
  },

  /* 2. THƯƠNG HIỆU — tên hiển thị ở logo, footer
   *    Logo ảnh (không bắt buộc): SVG hoặc PNG nền trong suốt, cao 80 px. Để "" thì dùng chữ. */
  brand: {
    name: "[TEN_THUONG_HIEU]",
    role: "MC sự kiện",
    tagline: "Giọng dẫn chạm cảm xúc — sự kiện trọn vẹn",
    logo: "",
  },

  /* 2b. NỀN TRANG — ảnh nền cho cả trang web (cố định khi cuộn)
   *    Để image: "" thì dùng nền gradient mặc định (hồng → xanh ngọc).
   *    CÁCH THAY: chép ảnh vào public/images/background/, rồi điền đường dẫn vào image.
   *      - image      : ảnh cho máy tính, 1920×1080 px (ngang), < 300 KB, ưu tiên .webp
   *      - imageMobile: (không bắt buộc) ảnh dọc riêng cho điện thoại, 1080×1920 px, < 200 KB.
   *                     Để "" thì điện thoại dùng chung ảnh trên (bị cắt bớt hai bên).
   *      - overlay    : độ phủ lớp trắng mờ trên ảnh để chữ dễ đọc, từ 0 (không phủ) đến 1 (trắng hẳn).
   *                     Ảnh càng nhiều chi tiết/màu đậm thì nên để cao hơn (0.4 – 0.6).
   *    Nên chọn ảnh nhạt, ít chi tiết (vải, giấy, hoa văn mờ, sân khấu bokeh…). */
  background: {
    image: "public/images/background/Hunniepop.jpg", // VD: "public/images/background/bg.webp"
    imageMobile: "public/images/background/Hunniepop.jpg",
    overlay: 0.35,
  },

  /* 3. MENU — label hiển thị và id khu vực (#about, #services…) */
  nav: [
    { label: "Giới thiệu", href: "#about" },
    { label: "Dịch vụ", href: "#services" },
    { label: "Video", href: "#video" },
    { label: "Hình ảnh", href: "#gallery" },
    { label: "Cảm nhận", href: "#testimonials" },
    { label: "Liên hệ", href: "#contact" },
  ],

  /* 4. HEADER — nút "Đặt lịch" (action: "zalo" | "phone" | "email" | "#id-khu-vuc") */
  header: {
    cta: { label: "Đặt lịch", action: "zalo" },
  },

  /* 5. HERO — banner trượt toàn màn hình (mũi tên trái/phải, vuốt trên điện thoại)
   *    Đang tắt chữ và nút CTA trên ảnh: banner chỉ hiện ảnh, nên tự thiết kế
   *    tên/slogan thẳng vào ảnh (Canva/Photoshop). kicker/name/tagline/subtitle bên dưới vẫn cần
   *    điền — Google và trình đọc màn hình dùng chúng. Muốn hiện lại chữ: showText: true.
   *
   *    CÁCH THAY ẢNH BANNER
   *    1. Chuẩn bị mỗi banner 2 bản (ưu tiên .webp):
   *         - Desktop: 1920×1080 px (ngang 16:9), < 350 KB
   *         - Mobile : 1080×1920 px (dọc 9:16),  < 250 KB
   *       Chỉ có 1 bản ngang? Điền cùng đường dẫn cho cả desktop và mobile — trên điện thoại
   *       ảnh sẽ bị cắt mất hai bên, chỉ còn phần giữa.
   *    2. Chép ảnh vào thư mục public/images/hero/, đặt tên dạng hero-01-desktop.webp, hero-01-mobile.webp…
   *    3. Sửa đường dẫn desktop/mobile trong "slides" bên dưới cho khớp tên file, viết lại "alt"
   *       (mô tả ngắn nội dung ảnh).
   *    4. Thêm banner: chép nguyên một khối { desktop, mobile, alt }, dán tiếp sau khối cuối.
   *       Bớt banner: xoá khối đó. Nên dùng tối đa 5 ảnh để hàng chấm trên điện thoại không tràn.
   *    5. Chạy "npm run dev" để xem thử; terminal báo nếu đường dẫn ảnh sai.
   *
   *    Bố cục ảnh khi thiết kế:
   *      - Đáy ảnh hơi tối dần và có hàng chấm/mũi tên chuyển ảnh → đừng đặt mặt người/chữ
   *        quan trọng sát đáy. (Nếu bật lại nút CTA: nút nằm phía dưới trên mobile, giữa nửa trái trên desktop.)
   *      - Màn hình có thể cắt ~10% mỗi cạnh ảnh, đừng để chi tiết quan trọng sát mép.
   *    autoplay: số mili-giây giữa 2 ảnh (6000 = 6 giây), 0 = không tự chuyển. */
  hero: {
    kicker: "MC",
    name: "[TEN_THUONG_HIEU]", // thường trùng brand.name, VD: "Hoàng Lâm"
    tagline: ["Event", "Gala", "Wedding"],
    subtitle: "Giọng dẫn chạm cảm xúc cho đám cưới, hội nghị và gala dinner.",
    showText: false,
    autoplay: 6000,
    slides: [
      {
        desktop: "public/images/hero/hero-01-desktop.webp",
        mobile: "public/images/hero/hero-01-mobile.webp",
        alt: "[TEN_THUONG_HIEU] cầm micro dẫn chương trình trên sân khấu gala",
      },
      {
        desktop: "public/images/hero/hero-02-desktop.webp",
        mobile: "public/images/hero/hero-02-mobile.webp",
        alt: "[TEN_THUONG_HIEU] dẫn lễ cưới",
      },
      {
        desktop: "public/images/hero/hero-03-desktop.webp",
        mobile: "public/images/hero/hero-03-mobile.webp",
        alt: "[TEN_THUONG_HIEU] dẫn hội nghị doanh nghiệp",
      },
    ],
    // Nút trên banner — đang tắt (null). Muốn hiện lại, thay null bằng:
    //   primaryCta: { label: "Đặt lịch qua Zalo", action: "zalo" },
    //   secondaryCta: { label: "Xem showreel", action: "#video" },
    primaryCta: null,
    secondaryCta: null,
  },

  /* 6. GIỚI THIỆU
   *    Ảnh chân dung: 1200×1500 px (dọc 4:5) — dùng chung desktop & mobile */
  about: {
    eyebrow: "Về tôi",
    heading: "Dẫn dắt bằng sự chân thành, chuẩn bị bằng sự chỉn chu",
    paragraphs: [
      "Hơn [SO_NAM] năm đứng trên sân khấu, tôi đã đồng hành cùng hàng trăm cặp đôi và doanh nghiệp trong những ngày quan trọng nhất của họ.",
      "Với tôi, một MC giỏi không chỉ nói hay mà còn phải lắng nghe: hiểu câu chuyện của bạn, nắm chắc kịch bản và xử lý linh hoạt mọi tình huống phát sinh để chương trình luôn liền mạch.",
    ],
    image: {
      src: "public/images/about/portrait-01.webp",
      alt: "Chân dung [TEN_THUONG_HIEU]",
    },
    stats: [
      { value: "[SO_NAM]+", label: "Năm kinh nghiệm" },
      { value: "[SO_SU_KIEN]+", label: "Sự kiện đã dẫn" },
      { value: "[SO_CAP_DOI]+", label: "Đám cưới" },
      { value: "[SO_DOANH_NGHIEP]+", label: "Doanh nghiệp tin chọn" },
    ],
  },

  /* 7. DỊCH VỤ — mảng thẻ, nên giữ 3 hoặc 6 thẻ cho lưới đẹp
   *    Ảnh mỗi thẻ: 1200×900 px (ngang 4:3), < 150 KB — dùng chung desktop & mobile
   *    icon: heart | briefcase | sparkles | globe | gift | users | mic | star */
  services: {
    eyebrow: "Dịch vụ",
    heading: "Một giọng dẫn cho mọi khoảnh khắc",
    intro: "Kịch bản riêng cho từng chương trình, tư vấn miễn phí trước sự kiện.",
    items: [
      {
        icon: "heart",
        title: "MC đám cưới",
        description: "Lễ gia tiên, lễ thành hôn và tiệc cưới ấm áp, trang trọng, đúng phong tục từng vùng miền.",
        image: "public/images/services/service-01.webp",
      },
      {
        icon: "briefcase",
        title: "MC hội nghị & doanh nghiệp",
        description: "Hội nghị khách hàng, khai trương, ra mắt sản phẩm — chuyên nghiệp, đúng giờ, đúng thông điệp.",
        image: "public/images/services/service-02.webp",
      },
      {
        icon: "sparkles",
        title: "MC gala dinner & year-end party",
        description: "Giữ năng lượng cả đêm tiệc với phần kết nối khán giả, mini game và bốc thăm trúng thưởng.",
        image: "public/images/services/service-03.webp",
      },
      {
        icon: "globe",
        title: "MC song ngữ Việt – Anh",
        description: "Phù hợp sự kiện có khách quốc tế, đối tác nước ngoài hoặc đám cưới đa văn hóa.",
        image: "public/images/services/service-04.webp",
      },
      {
        icon: "gift",
        title: "MC sinh nhật & kỷ niệm",
        description: "Tiệc thôi nôi, sinh nhật, kỷ niệm ngày cưới — gần gũi, vui vẻ, nhiều tương tác.",
        image: "public/images/services/service-05.webp",
      },
      {
        icon: "users",
        title: "MC team building & hoạt náo",
        description: "Dẫn dắt trò chơi tập thể, hoạt náo sân khấu, gắn kết tinh thần đội nhóm.",
        image: "public/images/services/service-06.webp",
      },
    ],
  },

  /* 8. VIDEO — 1 showreel nổi bật + các video nhỏ
   *    Video chỉ tải khi người xem bấm vào. Mỗi video dùng MỘT trong hai cách:
   *      - youtube: "ID" (phần sau ?v= trong link YouTube) — khuyên dùng, nhẹ hosting
   *      - src: "public/videos/ten-file.mp4" (H.264, 1080p, < 20 MB) — dùng khi youtube để ""
   *    Poster showreel: 1920×1080 px (16:9). Poster video nhỏ: 1280×720 px (16:9). */
  videos: {
    eyebrow: "Video",
    heading: "Xem tôi trên sân khấu",
    featured: {
      title: "Showreel [NAM_SHOWREEL]",
      youtube: "",
      src: "public/videos/showreel.mp4",
      poster: "public/images/videos/showreel-poster.webp",
    },
    items: [
      { title: "Lễ cưới tại [DIA_DIEM_1]", youtube: "", src: "public/videos/video-01.mp4", poster: "public/images/videos/video-01-poster.webp" },
      { title: "Hội nghị khách hàng [TEN_DOANH_NGHIEP_1]", youtube: "", src: "public/videos/video-02.mp4", poster: "public/images/videos/video-02-poster.webp" },
      { title: "Gala dinner cuối năm", youtube: "", src: "public/videos/video-03.mp4", poster: "public/images/videos/video-03-poster.webp" },
      { title: "MC song ngữ — sự kiện quốc tế", youtube: "", src: "public/videos/video-04.mp4", poster: "public/images/videos/video-04-poster.webp" },
    ],
  },

  /* 9. GALLERY — ảnh thực tế, lọc theo danh mục, bấm để phóng to
   *    Ảnh: cạnh dài 1600 px (dọc 4:5 = 1280×1600 là đẹp nhất), < 250 KB.
   *    Lưới tự cắt vuông/4:5 nên mobile & desktop dùng chung một ảnh.
   *    category phải trùng với một id trong categories. */
  gallery: {
    eyebrow: "Hình ảnh",
    heading: "Khoảnh khắc thực tế",
    categories: [
      { id: "wedding", label: "Đám cưới" },
      { id: "corporate", label: "Doanh nghiệp" },
      { id: "gala", label: "Gala & tiệc" },
    ],
    items: [
      { src: "public/images/gallery/gallery-01.webp", alt: "MC dẫn lễ thành hôn ngoài trời", category: "wedding" },
      { src: "public/images/gallery/gallery-02.webp", alt: "MC trên sân khấu hội nghị khách hàng", category: "corporate" },
      { src: "public/images/gallery/gallery-03.webp", alt: "MC giao lưu cùng khách mời tại gala dinner", category: "gala" },
      { src: "public/images/gallery/gallery-04.webp", alt: "Cô dâu chú rể và MC trong nghi thức rót rượu", category: "wedding" },
      { src: "public/images/gallery/gallery-05.webp", alt: "MC công bố ra mắt sản phẩm mới", category: "corporate" },
      { src: "public/images/gallery/gallery-06.webp", alt: "MC dẫn phần bốc thăm trúng thưởng year-end party", category: "gala" },
      { src: "public/images/gallery/gallery-07.webp", alt: "MC dẫn lễ gia tiên truyền thống", category: "wedding" },
      { src: "public/images/gallery/gallery-08.webp", alt: "MC điều phối hội thảo doanh nghiệp", category: "corporate" },
    ],
  },

  /* 10. KHÁCH HÀNG / ĐỐI TÁC — dải logo
   *     Logo: 320×160 px, nền trong suốt (.svg / .webp / .png). Chưa có logo thì hiện tên. */
  clients: {
    eyebrow: "Đối tác",
    heading: "Đã đồng hành cùng",
    items: [
      { name: "[TEN_DOI_TAC_1]", logo: "public/images/clients/client-01.webp" },
      { name: "[TEN_DOI_TAC_2]", logo: "public/images/clients/client-02.webp" },
      { name: "[TEN_DOI_TAC_3]", logo: "public/images/clients/client-03.webp" },
      { name: "[TEN_DOI_TAC_4]", logo: "public/images/clients/client-04.webp" },
      { name: "[TEN_DOI_TAC_5]", logo: "public/images/clients/client-05.webp" },
      { name: "[TEN_DOI_TAC_6]", logo: "public/images/clients/client-06.webp" },
    ],
  },

  /* 11. CẢM NHẬN KHÁCH HÀNG — slider, vuốt được trên điện thoại
   *     Ảnh đại diện: 200×200 px (vuông). Chưa có ảnh thì hiện chữ cái đầu.
   *     LƯU Ý: thay bằng cảm nhận THẬT của khách — nội dung dưới đây chỉ là mẫu. */
  testimonials: {
    eyebrow: "Cảm nhận",
    heading: "Khách hàng nói gì",
    items: [
      {
        quote: "[CAM_NHAN_1] Cả hai gia đình đều khen MC dẫn ấm áp, đúng phong tục mà vẫn vui. Cảm ơn vì đã giữ nhịp cho ngày cưới của chúng mình thật trọn vẹn.",
        name: "[TEN_KHACH_HANG_1]",
        role: "Cặp đôi cưới",
        avatar: "public/images/testimonials/avatar-01.webp",
      },
      {
        quote: "[CAM_NHAN_2] Chương trình hội nghị chạy đúng từng phút, xử lý rất khéo khi có thay đổi phút chót. Chắc chắn sẽ hợp tác lại.",
        name: "[TEN_KHACH_HANG_2]",
        role: "[CHUC_VU] — [TEN_CONG_TY]",
        avatar: "public/images/testimonials/avatar-02.webp",
      },
      {
        quote: "[CAM_NHAN_3] Đêm gala năm nay sôi động nhất từ trước tới giờ, nhân viên vẫn còn nhắc mãi phần mini game.",
        name: "[TEN_KHACH_HANG_3]",
        role: "Trưởng phòng nhân sự",
        avatar: "public/images/testimonials/avatar-03.webp",
      },
    ],
  },

  /* 12. LIÊN HỆ — số điện thoại / Zalo viết kiểu nào cũng được (0901 234 567)
   *     Còn là placeholder thì nút tương ứng tự trỏ về khu vực #contact, không tạo link hỏng.
   *     form.endpoint: link nhận form (Formspree, Google Apps Script…). Để "" thì khi gửi,
   *     trang mở ứng dụng email với nội dung đã điền sẵn. */
  contact: {
    eyebrow: "Liên hệ",
    heading: "Giữ lịch cho ngày quan trọng của bạn",
    intro: "Lịch cuối tuần và mùa cưới thường kín sớm. Nhắn Zalo để được báo giá và kiểm tra lịch trống trong 30 phút.",
    phone: "[SO_DIEN_THOAI]",
    zalo: "[SO_ZALO]",
    email: "[EMAIL]",
    facebook: "[LINK_FACEBOOK]",
    youtube: "[LINK_YOUTUBE]",
    tiktok: "[LINK_TIKTOK]",
    area: "[KHU_VUC_HOAT_DONG]",
    hours: "8:00 – 21:00, tất cả các ngày",
    form: {
      enabled: true,
      endpoint: "",
      eventTypes: ["Đám cưới", "Hội nghị / doanh nghiệp", "Gala / year-end party", "Sinh nhật / kỷ niệm", "Khác"],
      submitLabel: "Gửi yêu cầu",
      successMessage: "Cảm ơn bạn! Tôi sẽ liên hệ lại trong thời gian sớm nhất.",
    },
  },

  /* 13. NÚT LIÊN HỆ NỔI — desktop: nút tròn góc phải; mobile: thanh Gọi / Zalo ở đáy */
  floating: {
    enabled: true,
    callLabel: "Gọi ngay",
    zaloLabel: "Nhắn Zalo",
  },

  /* 14. FOOTER — {year} sẽ tự thay bằng năm hiện tại khi build */
  footer: {
    copyright: "© {year} [TEN_THUONG_HIEU]. Bảo lưu mọi quyền.",
    note: "MC sự kiện · Đám cưới · Doanh nghiệp",
  },
};
