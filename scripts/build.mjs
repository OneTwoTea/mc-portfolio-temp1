/* ============================================================================
 *  BUILD.MJS — ghép site.config.js + index.html → dist/ (Node thuần)
 *    node scripts/build.mjs              build đầy đủ (CSS đã minify)
 *    node scripts/build.mjs --html-only  chỉ dựng lại dist/index.html
 *    node scripts/build.mjs --no-minify  CSS không nén (dùng khi dev)
 * ========================================================================== */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DIST = path.join(ROOT, "dist");

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : String(s));
export const color = { red: paint(31), green: paint(32), yellow: paint(33), cyan: paint(36), dim: paint(2), bold: paint(1) };

/** Bước 2: chép public/ → dist/public/, main.js → dist/assets/js/, tạo .nojekyll */
export async function copyAssets() {
  await fs.mkdir(path.join(DIST, "assets", "js"), { recursive: true });
  const publicDir = path.join(ROOT, "public");
  if (existsSync(publicDir)) {
    await fs.cp(publicDir, path.join(DIST, "public"), {
      recursive: true,
      filter: (src) => path.basename(src) !== ".gitkeep",
    });
  }
  await fs.copyFile(path.join(ROOT, "src", "js", "main.js"), path.join(DIST, "assets", "js", "main.js"));
  await fs.writeFile(path.join(DIST, ".nojekyll"), "");
}

/** Bước 3: import config + templates (kèm ?t= để luôn lấy bản mới), ghép vào index.html */
export async function buildHtml() {
  const t = Date.now();
  const { SITE_CONFIG } = await import(`${pathToFileURL(path.join(ROOT, "site.config.js")).href}?t=${t}`);
  const { renderPage } = await import(`${pathToFileURL(path.join(ROOT, "src", "templates.js")).href}?t=${t}`);
  const template = await fs.readFile(path.join(ROOT, "index.html"), "utf8");
  const { html, missing } = renderPage(template, SITE_CONFIG);
  await fs.mkdir(DIST, { recursive: true });
  await fs.writeFile(path.join(DIST, "index.html"), html);
  return { html, missing, config: SITE_CONFIG };
}

/** Bước 4: gọi Tailwind CLI → dist/assets/css/style.css */
export function buildCss({ minify = true } = {}) {
  const pkgPath = require.resolve("@tailwindcss/cli/package.json");
  const pkg = require(pkgPath);
  const binRel = typeof pkg.bin === "string" ? pkg.bin : pkg.bin.tailwindcss;
  const bin = path.join(path.dirname(pkgPath), binRel);
  const args = [bin, "-i", path.join("src", "input.css"), "-o", path.join("dist", "assets", "css", "style.css")];
  if (minify) args.push("--minify");

  const res = spawnSync(process.execPath, args, { cwd: ROOT, encoding: "utf8" });
  if (res.status !== 0) {
    console.error(color.red("✖ Tailwind build lỗi:"));
    console.error(res.stderr || res.stdout || res.error);
    return false;
  }
  return true;
}

/** Bước 5: kiểm tra file thiếu, placeholder còn sót, key template không có trong config */
export function report(html, missing, config = {}) {
  let ok = true;

  const refs = [...new Set(html.match(/public\/[A-Za-z0-9_\-./]+/g) || [])].map((p) => p.replace(/[.]+$/, ""));
  const missingFiles = refs.filter((p) => !existsSync(path.join(ROOT, p)));
  if (missingFiles.length) {
    console.log(color.yellow(`⚠ ${missingFiles.length} file được tham chiếu nhưng chưa có trong public/ (trang vẫn hiện khung thay thế):`));
    missingFiles.forEach((f) => console.log(color.dim(`   - ${f}`)));
  }

  // Quét cả HTML lẫn config (một số giá trị như link mạng xã hội bị ẩn khi còn placeholder)
  const placeholders = [...new Set(`${html}${JSON.stringify(config)}`.match(/\[[A-Z0-9_]*[A-Z][A-Z0-9_]*\]/g) || [])];
  if (placeholders.length) {
    console.log(color.yellow(`⚠ ${placeholders.length} placeholder chưa điền trong site.config.js:`));
    console.log(color.dim(`   ${placeholders.join("  ")}`));
  }

  if (missing.length) {
    ok = false;
    console.log(color.red(`✖ ${missing.length} key trong index.html không có trong config / templates.js:`));
    missing.forEach((k) => console.log(color.red(`   - {{ ${k} }}`)));
    process.exitCode = 1;
  }
  return ok;
}

/** Build toàn bộ. Trả về true nếu thành công. */
export async function build({ htmlOnly = false, minify = true } = {}) {
  const started = Date.now();
  try {
    if (!htmlOnly) {
      await fs.rm(DIST, { recursive: true, force: true });
      await copyAssets();
    }
    const { html, missing, config } = await buildHtml();
    const cssOk = htmlOnly ? true : buildCss({ minify });
    const ok = report(html, missing, config) && cssOk;
    if (!cssOk) process.exitCode = 1;
    const ms = Date.now() - started;
    console.log(ok ? color.green(`✔ Build xong sau ${ms} ms → dist/`) : color.red(`✖ Build có lỗi (${ms} ms)`));
    return ok;
  } catch (err) {
    console.error(color.red("✖ Build thất bại:"), err);
    process.exitCode = 1;
    return false;
  }
}

// Chạy trực tiếp: node scripts/build.mjs [--html-only] [--no-minify]
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const argv = process.argv.slice(2);
  await build({ htmlOnly: argv.includes("--html-only"), minify: !argv.includes("--no-minify") });
}
