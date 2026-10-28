# mc-portfolio — Website MC sự kiện

Website tĩnh một trang cho MC sự kiện / đám cưới / doanh nghiệp.
HTML + Tailwind CSS v4 + JavaScript thuần — không framework, không bundler.

## 1. Cài đặt

Yêu cầu: **Node.js ≥ 20**.

```bash
npm install
npm run dev        # http://localhost:5173 — tự build lại và tải lại trang khi sửa file
```

| Lệnh | Tác dụng |
| --- | --- |
| `npm run dev` | Build (CSS không nén), theo dõi `index.html`, `site.config.js`, `src/`, `public/` |
| `npm run build` | Build bản chính thức vào `dist/` (CSS đã minify) |
| `npm run preview` | Chỉ phục vụ `dist/` đang có, không build lại |
| `node scripts/dev.mjs --base=/mc-portfolio/` | Giả lập GitHub Pages dạng `ten.github.io/mc-portfolio/` |
| `node scripts/build.mjs --html-only` | Chỉ dựng lại `dist/index.html` |
| `PORT=3000 npm run dev` | Đổi cổng (PowerShell: `$env:PORT=3000; npm run dev`) |

## 2. Sửa nội dung

**Chỉ sửa `site.config.js`.** Mọi chữ, ảnh, video, link, SEO đều nằm trong file này, có comment đánh số cho từng khu vực.

- Chỗ dạng `[TEN_IN_HOA]` là placeholder chưa điền. Mỗi lần build, terminal liệt kê tất cả placeholder còn sót.
- Số điện thoại / Zalo / email còn là placeholder thì nút tương ứng tự trỏ về khu vực Liên hệ, không tạo link hỏng.
- Danh sách (dịch vụ, video, ảnh, đối tác, cảm nhận) là mảng: chép thêm một khối `{ ... }` để thêm, xóa khối để bớt.
- Đường dẫn ảnh/video viết dạng `public/...`, **không** có dấu `/` ở đầu.
- Nội dung phần **Cảm nhận khách hàng** chỉ là mẫu — hãy thay bằng cảm nhận thật.
- Form liên hệ: điền `contact.form.endpoint` (Formspree, Google Apps Script…) để nhận form; để trống thì nút gửi mở ứng dụng email với nội dung điền sẵn.

Không sửa tay thư mục `dist/` — nó được tạo lại mỗi lần build.

### Cấu trúc

```
site.config.js        DỮ LIỆU — chỉ cần sửa file này
index.html            khung HTML ({{ duong.dan }} và {{{ @tenRenderer }}})
src/templates.js      render config → HTML
src/input.css         Tailwind v4 — màu & font khai báo trong @theme
src/js/main.js        menu, video, gallery/lightbox, slider, form
scripts/build.mjs     build ra dist/
scripts/dev.mjs       server xem thử
public/               ảnh, video, icon (chép nguyên vào dist/public/)
```

## 3. Ảnh & video cần chuẩn bị

Ưu tiên `.webp`, tên kebab-case có số thứ tự. Chưa có ảnh thì trang hiện khung nền thay thế, build in cảnh báo.

| File | Kích thước khuyến nghị |
| --- | --- |
| `public/images/hero/hero-01…03-desktop.webp` | 1920×1080 (ngang 16:9), < 350 KB — tránh để chi tiết quan trọng sát đáy (chỗ chấm chuyển ảnh) |
| `public/images/hero/hero-01…03-mobile.webp` | 1080×1920 (dọc 9:16), < 250 KB — tránh để chi tiết quan trọng sát đáy (chỗ chấm chuyển ảnh) |
| `public/images/background/bg.webp` | (không bắt buộc) 1920×1080, < 300 KB — ảnh nền cả trang; thêm bản dọc 1080×1920 cho điện thoại nếu muốn |
| `public/images/about/portrait-01.webp` | 1200×1500 (4:5), dùng chung mobile |
| `public/images/services/service-01…06.webp` | 1200×900 (4:3), < 150 KB, dùng chung mobile |
| `public/images/videos/showreel-poster.webp` | 1920×1080 (16:9) |
| `public/images/videos/video-01…04-poster.webp` | 1280×720 (16:9) |
| `public/videos/showreel.mp4`, `video-01…04.mp4` | H.264 1080p, < 20 MB — hoặc dùng YouTube ID (khuyên dùng) |
| `public/images/gallery/gallery-01…08.webp` | 1280×1600 (4:5), < 250 KB, dùng chung mobile |
| `public/images/clients/client-01…06.webp` | 320×160, nền trong suốt (.svg/.webp/.png) |
| `public/images/testimonials/avatar-01…03.webp` | 200×200 (vuông) |
| `public/images/og/og-image.png` | 1200×630 — ảnh khi chia sẻ link (hiện là ảnh tạm) |
| `public/icons/*` | Đã có sẵn (favicon.svg, favicon-32.png, apple-touch-icon.png, icon-512.png), thay nếu có logo riêng |

> Muốn đổi nền cả trang bằng ảnh: chép ảnh vào `public/images/background/`, điền `background.image` trong `site.config.js`; `background.overlay` (0–1) chỉnh độ phủ trắng mờ để chữ dễ đọc. Để trống thì dùng nền gradient mặc định.

> Hero là banner trượt và đang **tắt chữ và nút CTA trên ảnh** (`hero.showText: false`, `hero.primaryCta`/`secondaryCta: null`): tự thiết kế tên/slogan vào ảnh. Các bước thay ảnh, thêm/bớt banner có ghi chú ngay trên mục `hero` trong `site.config.js`. Muốn hiện lại chữ: `hero.showText: true`. `hero.autoplay: 0` để tắt tự chuyển.

## 4. Đưa lên GitHub Pages

1. Tạo repo `mc-portfolio` trên GitHub, push code lên nhánh `main`.
2. Vào **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Mỗi lần push lên `main`, workflow `.github/workflows/deploy.yml` tự build và deploy. Có thể chạy tay ở tab **Actions → Deploy GitHub Pages → Run workflow**.
4. Điền `seo.siteUrl` = `https://<ten-tai-khoan>.github.io/mc-portfolio/` để có canonical và ảnh chia sẻ đúng.

Dùng hosting tĩnh khác (Netlify, Vercel, Cloudflare Pages…): lệnh build `npm run build`, thư mục xuất `dist`.
