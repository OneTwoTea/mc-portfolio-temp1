/* ============================================================================
 *  TEMPLATES.JS — bộ render: biến dữ liệu trong site.config.js thành HTML.
 *  Không cần sửa file này khi chỉ muốn đổi nội dung.
 * ========================================================================== */

/* ---------- 1. Tiện ích chung ---------- */

const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape HTML để chèn an toàn vào nội dung và thuộc tính. */
export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESC_MAP[c]);

/** true nếu giá trị rỗng hoặc còn chứa placeholder dạng [TEN_IN_HOA]. */
export const isPlaceholder = (value) =>
  value == null || String(value).trim() === "" || /\[[A-Z0-9_]+\]/.test(String(value));

/** Lấy giá trị theo đường dẫn "a.b.c". */
export const getPath = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

/* ---------- 2. Icon SVG inline (viewBox 24×24, nét theo currentColor) ---------- */

export const ICONS = {
  phone:
    '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  zalo:
    '<path d="M21 11.5a8.5 8.5 0 0 1-9 8.4 9.3 9.3 0 0 1-3.6-.7L3 21l1.6-4.2A8 8 0 0 1 3 11.5 8.6 8.6 0 0 1 12 3a8.6 8.6 0 0 1 9 8.5z"/><path d="M9 9h5l-5 6h5"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  youtube:
    '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  tiktok: '<path d="M15.5 3c.4 2.3 2 4 4.5 4.3v3.2a7.5 7.5 0 0 1-4.5-1.4V15a6 6 0 1 1-6-6v3.3a2.7 2.7 0 1 0 2.7 2.7V3z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  quote:
    '<path d="M10 8H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a3 3 0 0 1-3 3M20 8h-4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a3 3 0 0 1-3 3"/>',
  "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1z"/>',
  heart:
    '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  sparkles:
    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  gift:
    '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
};

/** Trả về SVG inline của icon `name`, ẩn khỏi trình đọc màn hình. */
export const icon = (name, cls = "size-5") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.star}</svg>`;

/**
 * Ảnh responsive dùng <picture>. Luôn có width/height (tránh nhảy layout) và alt.
 * - mobile: ảnh riêng cho màn hình < 768px (bố cục khác hẳn desktop).
 * - eager: ảnh ở màn hình đầu tiên → không lazy, fetchpriority="high".
 * Nếu file ảnh chưa tồn tại, script nhỏ trong <head> gắn class .img-missing
 * và khung chứa (.media-frame) hiện nền thay thế.
 */
export function media({ src, mobile, alt = "", width = 1200, height = 900, mobileWidth, mobileHeight, eager = false, cls = "" }) {
  const source = mobile
    ? `<source media="(max-width: 767px)" srcset="${esc(mobile)}" width="${mobileWidth || width}" height="${mobileHeight || height}">`
    : "";
  const loading = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<picture>${source}<img src="${esc(src)}" alt="${esc(alt)}" width="${width}" height="${height}" ${loading} class="${cls}"></picture>`;
}

/* ---------- 3. Link liên hệ (tel / Zalo / mailto / mạng xã hội) ---------- */

export function createHelpers(config) {
  const contact = config.contact || {};
  const digits = (v) => String(v).replace(/[^\d+]/g, "");

  const telHref = (v = contact.phone) => (isPlaceholder(v) ? "#contact" : `tel:${digits(v)}`);
  const zaloHref = (v = contact.zalo) =>
    isPlaceholder(v) ? "#contact" : `https://zalo.me/${digits(v).replace(/^\+?84/, "0")}`;
  const mailHref = (v = contact.email) => (isPlaceholder(v) ? "#contact" : `mailto:${String(v).trim()}`);
  const urlHref = (v) => (isPlaceholder(v) ? "#contact" : String(v).trim());

  /** action: "zalo" | "phone" | "email" | "#id" | "https://..." */
  const actionHref = (action) => {
    if (action === "zalo") return zaloHref();
    if (action === "phone") return telHref();
    if (action === "email") return mailHref();
    return urlHref(action);
  };

  /** Thuộc tính mở tab mới cho link ra ngoài (Zalo, Facebook…). */
  const externalAttrs = (href) => (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "");

  return { telHref, zaloHref, mailHref, urlHref, actionHref, externalAttrs };
}

/* ---------- 4. Các hàm render cho từng khu vực ---------- */

const BTN_PRIMARY =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-medium text-ink transition hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
const BTN_GHOST =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-cream/30 px-6 py-3 font-medium text-cream transition hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

/** Nút viền đặt trên ảnh tối (hero) — luôn chữ sáng */
const BTN_GHOST_ON_PHOTO = BTN_GHOST.replace("border-cream/30", "border-snow/40").replace("text-cream", "text-snow").replace("hover:border-gold hover:text-gold", "hover:border-brass hover:text-brass");

/** Nút cỡ nhỏ: THAY class kích thước gốc (thêm class cùng loại sẽ không có tác dụng vì
 *  Tailwind xếp px-6 sau px-3 trong CSS → px-6 luôn thắng). */
const compactBtn = (cls, size) => cls.replace("min-h-12", "").replace("px-6 py-3", size);

export function createRenderers(config) {
  const h = createHelpers(config);
  const { seo = {}, brand = {}, contact = {} } = config;

  const link = (action, label, cls, iconName) => {
    const href = h.actionHref(action);
    return `<a href="${esc(href)}" class="${cls}"${h.externalAttrs(href)}>${iconName ? icon(iconName) : ""}<span>${esc(label)}</span></a>`;
  };

  const absUrl = (p) => (isPlaceholder(seo.siteUrl) ? p : new URL(p, seo.siteUrl).href);

  const socials = [
    { key: "facebook", label: "Facebook", icon: "facebook" },
    { key: "youtube", label: "YouTube", icon: "youtube" },
    { key: "tiktok", label: "TikTok", icon: "tiktok" },
  ].filter((s) => !isPlaceholder(contact[s.key]));

  const initials = (name) =>
    isPlaceholder(name)
      ? "★"
      : String(name).trim().split(/\s+/).slice(-2).map((w) => w[0]).join("").toUpperCase();

  return {
    /* SEO: canonical, og:url, ảnh chia sẻ tuyệt đối, dữ liệu có cấu trúc */
    seoHead() {
      const tags = [];
      if (!isPlaceholder(seo.siteUrl)) {
        tags.push(`<link rel="canonical" href="${esc(seo.siteUrl)}">`);
        tags.push(`<meta property="og:url" content="${esc(seo.siteUrl)}">`);
      }
      const img = absUrl(seo.ogImage);
      tags.push(`<meta property="og:image" content="${esc(img)}">`);
      tags.push('<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">');
      tags.push(`<meta property="og:image:alt" content="${esc(seo.ogImageAlt)}">`);
      tags.push(`<meta name="twitter:image" content="${esc(img)}">`);

      const ld = { "@context": "https://schema.org", "@type": "Person", name: brand.name, jobTitle: brand.role, description: seo.description };
      if (!isPlaceholder(seo.siteUrl)) ld.url = seo.siteUrl;
      if (!isPlaceholder(contact.phone)) ld.telephone = contact.phone;
      if (!isPlaceholder(contact.email)) ld.email = contact.email;
      if (!isPlaceholder(contact.area)) ld.areaServed = contact.area;
      const sameAs = socials.map((s) => contact[s.key]);
      if (sameAs.length) ld.sameAs = sameAs;
      tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`);
      return tags.join("\n    ");
    },

    /* Ảnh nền cả trang: ghi đè nền body::before trong input.css.
     * Phải ghi thẳng thuộc tính background (không qua biến CSS): url() trong biến được tính
     * theo thư mục của file CSS dùng biến (assets/css/) → sai đường dẫn ảnh. */
    pageBackground() {
      const bg = config.background || {};
      if (isPlaceholder(bg.image)) return "";
      // Trong <style> không dùng được &quot; nên bỏ hẳn các ký tự có thể phá chuỗi CSS
      const cssUrl = (p) => `url("${String(p).trim().replace(/["\\<>\n\r]/g, "")}")`;
      const a = Math.min(1, Math.max(0, Number(bg.overlay ?? 0.35) || 0));
      const rule = (p) =>
        `body::before{background:linear-gradient(rgb(255 255 255 / ${a}), rgb(255 255 255 / ${a})), ${cssUrl(p)} center / cover no-repeat}`;
      const mobile = isPlaceholder(bg.imageMobile) ? "" : `@media (max-width: 767px){${rule(bg.imageMobile)}}`;
      return `<style>${rule(bg.image)}${mobile}</style>`;
    },

    brandLogo() {
      if (!isPlaceholder(brand.logo)) {
        return `<img src="${esc(brand.logo)}" alt="${esc(brand.name)}" width="160" height="40" class="h-10 w-auto">`;
      }
      return `<span class="font-display text-xl font-semibold tracking-wide text-gold sm:text-2xl">${esc(brand.name)}</span>`;
    },

    navLinks() {
      return (config.nav || [])
        .map(
          (n) =>
            `<li><a href="${esc(n.href)}" data-nav-link class="inline-flex min-h-11 items-center px-3 text-[0.95rem] text-cream/80 transition hover:text-gold aria-[current=true]:text-gold">${esc(n.label)}</a></li>`,
        )
        .join("");
    },

    mobileNavLinks() {
      return (config.nav || [])
        .map(
          (n) =>
            `<li><a href="${esc(n.href)}" data-menu-link class="flex min-h-14 items-center border-b border-cream/10 font-display text-2xl text-cream transition hover:text-gold">${esc(n.label)}</a></li>`,
        )
        .join("");
    },

    headerCta() {
      const cta = config.header?.cta || { label: "Đặt lịch", action: "zalo" };
      // Mobile đã có thanh Gọi / Zalo ở đáy nên nút này chỉ hiện từ 640px
      const cls = compactBtn(BTN_PRIMARY, "min-h-11 px-5 py-2").replace("inline-flex ", "hidden whitespace-nowrap ");
      return link(cta.action, cta.label, `${cls} text-sm sm:inline-flex`);
    },

    mobileMenuContacts() {
      return [
        link("phone", "Gọi điện", `${BTN_GHOST} w-full`, "phone"),
        link("zalo", "Nhắn Zalo", `${BTN_PRIMARY} w-full`, "zalo"),
      ].join("");
    },

    /* Hero: các ảnh banner xếp chồng, ảnh đang hiện có class is-active (xem main.js) */
    heroSlides() {
      const slides = config.hero?.slides || [];
      return slides
        .map(
          (s, i) => `<div class="hero-slide media-frame absolute inset-0${i === 0 ? " is-active" : ""}" data-hero-slide role="group" aria-roledescription="slide" aria-label="${i + 1} / ${slides.length}"${i === 0 ? "" : ' aria-hidden="true"'}>
            ${media({
              src: s.desktop,
              mobile: s.mobile,
              alt: s.alt,
              width: 1920,
              height: 1080,
              mobileWidth: 1080,
              mobileHeight: 1920,
              eager: i === 0,
              cls: "size-full object-cover object-center",
            })}
          </div>`,
        )
        .join("");
    },

    /* Lớp tối giúp chữ dễ đọc: mobile tối dần từ dưới, desktop tối dần từ trái */
    heroShade() {
      const cls =
        config.hero?.showText === false
          ? "bg-gradient-to-t from-night/80 via-transparent to-transparent"
          : "bg-gradient-to-t from-night via-night/60 to-night/10 lg:bg-gradient-to-r lg:from-night/90 lg:via-night/45 lg:to-transparent";
      return `<div class="pointer-events-none absolute inset-0 ${cls}" aria-hidden="true"></div>`;
    },

    /* Khối chữ: MC → TÊN → EVENT | GALA (ẩn khỏi màn hình nếu banner đã có chữ) */
    heroContent() {
      const hero = config.hero || {};
      const sep = icon("mic", "size-4 shrink-0 text-brass");
      const tagline = (hero.tagline || []).map((t) => `<span>${esc(t)}</span>`).join(sep);
      const rule = '<span class="hidden h-px w-12 shrink-0 bg-brass/70 sm:block" aria-hidden="true"></span>';
      return `<div class="${hero.showText === false ? "sr-only" : "hero-intro"}">
        <h1 id="hero-title" class="flex flex-col items-center">
          <span class="font-display text-[clamp(2rem,1.3rem+3.2vw,4.25rem)] font-medium leading-none text-snow">${esc(hero.kicker)}</span>
          <span class="hero-name mt-2 sm:mt-3">${esc(hero.name)}</span>
        </h1>
        ${tagline ? `<p class="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-medium tracking-[0.2em] text-snow/90 uppercase sm:mt-5 sm:gap-x-3 sm:text-base sm:tracking-[0.3em]">${rule}${tagline}${rule}</p>` : ""}
        ${isPlaceholder(hero.subtitle) ? "" : `<p class="mx-auto mt-5 max-w-md text-base text-snow/85 sm:text-lg">${esc(hero.subtitle)}</p>`}
      </div>`;
    },

    /* Mũi tên trái/phải, chấm chỉ vị trí và nút tạm dừng (chỉ khi có từ 2 ảnh) */
    heroControls() {
      const hero = config.hero || {};
      const n = (hero.slides || []).length;
      if (n < 2) return "";
      // Desktop/tablet: mũi tên lớn ở giữa hai bên. Mobile: mũi tên nhỏ nằm cùng hàng chấm ở đáy
      const arrow =
        "absolute top-1/2 z-10 hidden size-16 -translate-y-1/2 place-items-center rounded-full text-snow transition hover:bg-night/40 hover:text-brass md:grid";
      const arrowIcon = "size-10 stroke-[2.5] drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)]";
      const small = "grid size-11 place-items-center rounded-full text-snow md:hidden";
      const dots = Array.from(
        { length: n },
        (_, i) =>
          `<li><button type="button" data-hero-dot="${i}" aria-label="Xem ảnh ${i + 1}" aria-current="${i === 0}" class="group grid size-11 place-items-center"><span class="block h-1 w-5 rounded-full bg-snow/40 transition-all group-aria-[current=true]:w-9 group-aria-[current=true]:bg-brass"></span></button></li>`,
      ).join("");
      const pause =
        hero.autoplay > 0
          ? `<button type="button" data-hero-pause aria-pressed="false" aria-label="Tạm dừng tự chuyển ảnh" class="grid size-11 place-items-center rounded-full text-snow/80 transition hover:text-brass"><span data-icon-pause>${icon("pause", "size-4")}</span><span data-icon-play class="hidden">${icon("play", "size-4")}</span></button>`
          : "";
      return `<button type="button" data-hero-prev class="${arrow} left-[max(0.25rem,env(safe-area-inset-left))] md:left-6" aria-label="Ảnh trước">${icon("chevron-left", arrowIcon)}</button>
        <button type="button" data-hero-next class="${arrow} right-[max(0.25rem,env(safe-area-inset-right))] md:right-6" aria-label="Ảnh tiếp theo">${icon("chevron-right", arrowIcon)}</button>
        <div class="absolute inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-10 flex items-center justify-center md:bottom-6">
          <button type="button" data-hero-prev class="${small}" aria-label="Ảnh trước">${icon("chevron-left", "size-6 stroke-2")}</button>
          <ul class="flex" aria-label="Chọn ảnh banner">${dots}</ul>${pause}
          <button type="button" data-hero-next class="${small}" aria-label="Ảnh tiếp theo">${icon("chevron-right", "size-6 stroke-2")}</button>
        </div>`;
    },

    heroActions() {
      const { primaryCta, secondaryCta } = config.hero || {};
      const buttons = [
        primaryCta && link(primaryCta.action, primaryCta.label, BTN_PRIMARY, "zalo"),
        secondaryCta && link(secondaryCta.action, secondaryCta.label, BTN_GHOST_ON_PHOTO, "play"),
      ]
        .filter(Boolean)
        .join("");
      // Không có nút nào thì bỏ luôn khung chứa
      return buttons ? `<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">${buttons}</div>` : "";
    },

    aboutMedia() {
      const img = config.about?.image || {};
      return media({ src: img.src, alt: img.alt, width: 1200, height: 1500, cls: "size-full object-cover" });
    },

    aboutParagraphs() {
      return (config.about?.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("");
    },

    aboutStats() {
      return (config.about?.stats || [])
        .map(
          (s) => `<div class="rounded-2xl border border-cream/10 bg-ink-2 p-4 sm:p-5">
            <dt class="text-sm text-muted">${esc(s.label)}</dt>
            <dd class="mt-1 font-display text-3xl font-semibold text-gold break-words sm:text-4xl">${esc(s.value)}</dd>
          </div>`,
        )
        .join("");
    },

    servicesList() {
      return (config.services?.items || [])
        .map(
          (s) => `<li class="reveal group flex flex-col overflow-hidden rounded-2xl border border-cream/10 bg-ink-2 transition hover:border-gold/50">
            <div class="media-frame relative aspect-[4/3] overflow-hidden">
              ${media({ src: s.image, alt: s.title, width: 1200, height: 900, cls: "size-full object-cover transition duration-500 group-hover:scale-105" })}
              <span class="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-night/75 text-brass">${icon(s.icon, "size-5")}</span>
            </div>
            <div class="flex flex-1 flex-col p-5 sm:p-6">
              <h3 class="font-display text-xl font-semibold text-cream text-balance">${esc(s.title)}</h3>
              <p class="mt-2 text-muted">${esc(s.description)}</p>
            </div>
          </li>`,
        )
        .join("");
    },

    videoFeatured() {
      const v = config.videos?.featured;
      return v ? videoCard(v, { featured: true }) : "";
    },

    videoList() {
      return (config.videos?.items || []).map((v) => `<li class="reveal">${videoCard(v)}</li>`).join("");
    },

    galleryFilters() {
      const cats = [{ id: "all", label: "Tất cả" }, ...(config.gallery?.categories || [])];
      return cats
        .map(
          (c, i) =>
            `<li><button type="button" data-filter="${esc(c.id)}" aria-pressed="${i === 0}" class="min-h-11 rounded-full border border-cream/20 px-5 text-cream/85 transition hover:border-gold hover:text-gold aria-pressed:border-gold aria-pressed:bg-gold aria-pressed:text-ink">${esc(c.label)}</button></li>`,
        )
        .join("");
    },

    galleryList() {
      return (config.gallery?.items || [])
        .map(
          (g, i) => `<li data-category="${esc(g.category)}" class="reveal">
            <button type="button" data-lightbox-index="${i}" data-full="${esc(g.src)}" data-caption="${esc(g.alt)}" class="media-frame group relative block aspect-[4/5] w-full overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" aria-label="Phóng to ảnh: ${esc(g.alt)}">
              ${media({ src: g.src, alt: g.alt, width: 1280, height: 1600, cls: "size-full object-cover transition duration-500 group-hover:scale-105" })}
            </button>
          </li>`,
        )
        .join("");
    },

    clientsList() {
      return (config.clients?.items || [])
        .map(
          (c) => `<li class="relative grid h-20 place-items-center overflow-hidden rounded-xl border border-cream/10 bg-ink-2 px-4 text-center sm:h-24">
            ${
              isPlaceholder(c.logo)
                ? ""
                : `<img src="${esc(c.logo)}" alt="${esc(c.name)}" width="320" height="160" loading="lazy" decoding="async" class="absolute inset-0 m-auto h-3/5 w-4/5 object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0">`
            }
            <span class="logo-fallback text-sm font-medium text-muted break-words">${esc(c.name)}</span>
          </li>`,
        )
        .join("");
    },

    testimonialsList() {
      return (config.testimonials?.items || [])
        .map(
          (t, i, arr) => `<li class="w-full shrink-0 snap-start px-2 md:w-1/2 lg:w-1/3" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${arr.length}">
            <figure class="flex h-full flex-col rounded-2xl border border-cream/10 bg-ink-2 p-6 sm:p-8">
              ${icon("quote", "size-8 text-gold")}
              <blockquote class="mt-4 flex-1 text-cream/90"><p>${esc(t.quote)}</p></blockquote>
              <figcaption class="mt-6 flex items-center gap-4">
                <span class="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-ink-3 font-display text-gold">
                  ${esc(initials(t.name))}
                  ${isPlaceholder(t.avatar) ? "" : `<img src="${esc(t.avatar)}" alt="" width="200" height="200" loading="lazy" decoding="async" class="absolute inset-0 size-full object-cover">`}
                </span>
                <span class="min-w-0">
                  <span class="block font-medium text-cream break-words">${esc(t.name)}</span>
                  <span class="block text-sm text-muted break-words">${esc(t.role)}</span>
                </span>
              </figcaption>
            </figure>
          </li>`,
        )
        .join("");
    },

    testimonialDots() {
      return (config.testimonials?.items || [])
        .map(
          (_, i) =>
            `<li><button type="button" data-slide-dot="${i}" aria-label="Xem cảm nhận ${i + 1}" class="group grid size-11 place-items-center"><span class="block size-2.5 rounded-full bg-cream/30 transition group-aria-[current=true]:w-6 group-aria-[current=true]:bg-gold"></span></button></li>`,
        )
        .join("");
    },

    contactList() {
      const rows = [
        { icon: "phone", label: "Điện thoại", value: contact.phone, href: h.telHref() },
        { icon: "zalo", label: "Zalo", value: contact.zalo, href: h.zaloHref() },
        { icon: "mail", label: "Email", value: contact.email, href: h.mailHref() },
        { icon: "facebook", label: "Facebook", value: "Trang Facebook", href: h.urlHref(contact.facebook), hide: isPlaceholder(contact.facebook) },
        { icon: "map-pin", label: "Khu vực", value: contact.area },
        { icon: "clock", label: "Giờ nhận lịch", value: contact.hours },
      ];
      return rows
        .filter((r) => !r.hide)
        .map((r) => {
          const inner = `<span class="grid size-11 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">${icon(r.icon)}</span>
            <span class="min-w-0"><span class="block text-sm text-muted">${esc(r.label)}</span><span class="block font-medium text-cream break-words">${esc(r.value)}</span></span>`;
          const cls = "flex min-h-16 items-center gap-4 rounded-xl border border-cream/10 bg-ink-2 p-3 sm:p-4";
          return r.href
            ? `<li><a href="${esc(r.href)}" class="${cls} transition hover:border-gold/60"${h.externalAttrs(r.href)}>${inner}</a></li>`
            : `<li><div class="${cls}">${inner}</div></li>`;
        })
        .join("");
    },

    contactForm() {
      const f = contact.form || {};
      if (!f.enabled) return "";
      const field =
        "mt-2 block w-full min-h-12 rounded-xl border border-cream/15 bg-ink px-4 py-3 text-base text-cream placeholder:text-cream/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";
      const label = "block text-sm font-medium text-cream/85";
      const options = (f.eventTypes || []).map((t) => `<option>${esc(t)}</option>`).join("");
      const endpoint = isPlaceholder(f.endpoint) ? "" : f.endpoint;
      const email = isPlaceholder(contact.email) ? "" : contact.email;
      return `<form id="contact-form" class="rounded-2xl border border-cream/10 bg-ink-2 p-5 sm:p-8" data-endpoint="${esc(endpoint)}" data-email="${esc(email)}" data-success="${esc(f.successMessage)}" novalidate>
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2"><label for="f-name" class="${label}">Họ và tên *</label><input id="f-name" name="name" type="text" autocomplete="name" required class="${field}" placeholder="Nguyễn Văn A"></div>
          <div><label for="f-phone" class="${label}">Số điện thoại *</label><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9 +.\\-]{9,15}" class="${field}" placeholder="0901 234 567"></div>
          <div><label for="f-email" class="${label}">Email</label><input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" class="${field}" placeholder="ban@email.com"></div>
          <div><label for="f-date" class="${label}">Ngày sự kiện</label><input id="f-date" name="date" type="date" class="${field}"></div>
          <div><label for="f-type" class="${label}">Loại sự kiện</label><select id="f-type" name="type" class="${field}">${options}</select></div>
          <div class="sm:col-span-2"><label for="f-message" class="${label}">Lời nhắn</label><textarea id="f-message" name="message" rows="4" class="${field}" placeholder="Địa điểm, số khách, yêu cầu đặc biệt…"></textarea></div>
        </div>
        <button type="submit" class="${BTN_PRIMARY} mt-6 w-full sm:w-auto">${icon("send")}<span>${esc(f.submitLabel || "Gửi")}</span></button>
        <p data-form-status class="mt-4 text-cream/85" role="status" aria-live="polite"></p>
      </form>`;
    },

    footerNav() {
      return (config.nav || [])
        .map((n) => `<li><a href="${esc(n.href)}" class="inline-flex min-h-11 min-w-11 items-center text-cream/90 transition hover:text-gold">${esc(n.label)}</a></li>`)
        .join("");
    },

    footerSocial() {
      return socials
        .map(
          (s) =>
            `<li><a href="${esc(contact[s.key])}" target="_blank" rel="noopener" aria-label="${s.label}" class="grid size-11 place-items-center rounded-full border border-cream/25 text-cream/90 transition hover:border-gold hover:text-gold">${icon(s.icon)}</a></li>`,
        )
        .join("");
    },

    copyright() {
      return esc(String(config.footer?.copyright || "").replace("{year}", new Date().getFullYear()));
    },

    floatingContact() {
      const f = config.floating || {};
      if (!f.enabled) return "";
      const tel = h.telHref();
      const zalo = h.zaloHref();
      return `<div class="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-40 hidden flex-col gap-3 md:flex">
          <a href="${esc(zalo)}"${h.externalAttrs(zalo)} aria-label="${esc(f.zaloLabel)}" class="grid size-14 place-items-center rounded-full bg-gold text-ink shadow-lg shadow-black/40 transition hover:scale-105">${icon("zalo", "size-6")}</a>
          <a href="${esc(tel)}" aria-label="${esc(f.callLabel)}" class="grid size-14 place-items-center rounded-full border border-gold/60 bg-ink-2 text-gold shadow-lg shadow-black/40 transition hover:scale-105">${icon("phone", "size-6")}</a>
        </div>
        <nav aria-label="Liên hệ nhanh" class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-cream/10 bg-ink/95 px-[max(0.75rem,env(safe-area-inset-left))] pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden">
          <a href="${esc(tel)}" class="${compactBtn(BTN_GHOST, "min-h-12 px-3 py-2")} whitespace-nowrap">${icon("phone")}<span>${esc(f.callLabel)}</span></a>
          <a href="${esc(zalo)}"${h.externalAttrs(zalo)} class="${compactBtn(BTN_PRIMARY, "min-h-12 px-3 py-2")} whitespace-nowrap">${icon("zalo")}<span>${esc(f.zaloLabel)}</span></a>
        </nav>`;
    },
  };
}

/** Thẻ video: hiện poster + nút play; video/iframe chỉ được tải khi bấm (xem main.js). */
function videoCard(v, { featured = false } = {}) {
  const youtube = isPlaceholder(v.youtube) ? "" : v.youtube;
  const src = isPlaceholder(v.src) ? "" : v.src;
  const size = featured ? { width: 1920, height: 1080 } : { width: 1280, height: 720 };
  return `<div class="flex flex-col gap-3">
    <div class="media-frame relative aspect-video overflow-hidden rounded-2xl border border-cream/10" data-video data-youtube="${esc(youtube)}" data-src="${esc(src)}" data-title="${esc(v.title)}">
      ${media({ src: v.poster, alt: `Ảnh bìa video: ${v.title}`, ...size, cls: "size-full object-cover" })}
      <button type="button" class="group absolute inset-0 grid place-items-center bg-night/30 transition hover:bg-night/10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold" aria-label="Phát video: ${esc(v.title)}">
        <span class="grid ${featured ? "size-20 sm:size-24" : "size-14"} place-items-center rounded-full bg-gold text-ink shadow-xl shadow-black/40 transition group-hover:scale-110">${icon("play", featured ? "size-8 translate-x-0.5" : "size-6 translate-x-0.5")}</span>
      </button>
    </div>
    <p class="${featured ? "font-display text-xl text-cream sm:text-2xl" : "font-medium text-cream/90"} text-balance">${esc(v.title)}</p>
  </div>`;
}

/* ---------- 5. Ghép template ---------- */

/**
 * Ghép config vào khung HTML.
 *  - {{{ @tenRenderer }}} → HTML do renderer sinh ra
 *  - {{ duong.dan }}      → giá trị trong config, đã escape
 * Trả về { html, missing } — missing là danh sách key/renderer không tìm thấy.
 */
export function renderPage(template, config) {
  const missing = [];
  const renderers = createRenderers(config);

  let html = template.replace(/<!--\s*ĐÂY LÀ FILE KHUNG[\s\S]*?-->\s*/, "");

  html = html.replace(/\{\{\{\s*@([\w-]+)\s*\}\}\}/g, (_, name) => {
    if (typeof renderers[name] !== "function") {
      missing.push(`@${name}`);
      return "";
    }
    return renderers[name]();
  });

  html = html.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, path) => {
    const value = getPath(config, path);
    if (value === undefined || value === null || typeof value === "object") {
      missing.push(path);
      return "";
    }
    return esc(value);
  });

  return { html, missing };
}
