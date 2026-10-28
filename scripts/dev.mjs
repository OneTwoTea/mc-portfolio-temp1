/* ============================================================================
 *  DEV.MJS — server xem thử dist/ (node:http, không thư viện)
 *    npm run dev                  build (CSS không nén) + theo dõi thay đổi + tự tải lại trang
 *    npm run preview              chỉ phục vụ dist/ đang có (--no-watch)
 *    node scripts/dev.mjs --base=/mc-portfolio/   giả lập GitHub Pages dạng project
 *    PORT=3000 npm run dev        đổi cổng (mặc định 5173)
 * ========================================================================== */

import { createReadStream, existsSync, watch } from "node:fs";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { build, color, DIST, ROOT } from "./build.mjs";

const argv = process.argv.slice(2);
const WATCH = !argv.includes("--no-watch");
const PORT = Number(process.env.PORT) || 5173;
let BASE = (argv.find((a) => a.startsWith("--base=")) || "--base=/").slice(7);
if (!BASE.startsWith("/")) BASE = `/${BASE}`;
if (!BASE.endsWith("/")) BASE += "/";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

/* ---- Tự tải lại trình duyệt khi build xong (chỉ chế độ dev) ---- */
const clients = new Set();
const RELOAD_SNIPPET = `<script>new EventSource("${BASE}__reload").onmessage=()=>location.reload()</script>`;
const notifyReload = () => clients.forEach((res) => res.write("data: reload\n\n"));

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === `${BASE}__reload` && WATCH) {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
    res.write("\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  if (!pathname.startsWith(BASE)) {
    if (`${pathname}/` === BASE) {
      res.writeHead(301, { Location: BASE });
      return res.end();
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(`Không tìm thấy. Trang nằm ở ${BASE}`);
  }

  pathname = pathname.slice(BASE.length);
  let file = path.normalize(path.join(DIST, pathname));
  if (!file.startsWith(DIST)) {
    res.writeHead(403);
    return res.end();
  }
  try {
    const stat = await fs.stat(file);
    if (stat.isDirectory()) file = path.join(file, "index.html");
  } catch {
    /* xử lý 404 bên dưới */
  }
  if (!existsSync(file)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("404 — Không tìm thấy file");
  }

  const ext = path.extname(file).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  if (ext === ".html" && WATCH) {
    const html = (await fs.readFile(file, "utf8")).replace("</body>", `${RELOAD_SNIPPET}</body>`);
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    return res.end(html);
  }
  res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
  createReadStream(file).pipe(res);
});

/* ---- Khởi động ---- */
if (WATCH) {
  await build({ minify: false });

  let timer = null;
  let building = false;
  let queued = false;
  const rebuild = (reason) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (building) return void (queued = true);
      building = true;
      console.log(color.cyan(`\n↻ Thay đổi: ${reason}`));
      await build({ minify: false });
      process.exitCode = 0; // lỗi build khi dev không làm tắt server
      building = false;
      notifyReload();
      if (queued) {
        queued = false;
        rebuild("thay đổi trong lúc build");
      }
    }, 150);
  };

  const targets = ["index.html", "site.config.js", "src", "public"];
  for (const t of targets) {
    const full = path.join(ROOT, t);
    if (!existsSync(full)) continue;
    const isDir = (await fs.stat(full)).isDirectory();
    watch(full, { recursive: isDir }, (_event, name) => rebuild(isDir ? `${t}/${name ?? ""}` : t));
  }
} else if (!existsSync(path.join(DIST, "index.html"))) {
  console.error(color.red("✖ Chưa có dist/. Hãy chạy `npm run build` trước khi preview."));
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(color.bold(`\n${WATCH ? "Dev server" : "Preview"} đang chạy: `) + color.green(`http://localhost:${PORT}${BASE}`));
  if (WATCH) console.log(color.dim("Đang theo dõi index.html, site.config.js, src/, public/ — Ctrl+C để dừng."));
});
