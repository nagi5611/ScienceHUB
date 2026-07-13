/**
 * 全 HTML に PWA head タグと SW 登録スクリプトを挿入する
 */
import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { join } from "node:path";

const publicDir = join(import.meta.dirname, "..", "public");

const PWA_HEAD = `
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" href="/icons/favicon-32.png" sizes="32x32" type="image/png">
  <meta name="theme-color" content="#f38020">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="ScienceHUB">
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`;

const PWA_SCRIPT = `  <script src="/js/pwa-register.js" type="module"></script>\n`;

const VIEWPORT_PATTERN =
  /<meta name="viewport" content="width=device-width, initial-scale=1\.0"\s*\/?>/;

async function patchHtml(filePath) {
  let html = await readFile(filePath, "utf8");
  let changed = false;

  if (!html.includes('rel="manifest"')) {
    if (!VIEWPORT_PATTERN.test(html)) {
      throw new Error(`viewport meta not found in ${filePath}`);
    }
    html = html.replace(VIEWPORT_PATTERN, (match) => `${match}${PWA_HEAD}`);
    changed = true;
  }

  if (!html.includes("pwa-register.js")) {
    html = html.replace("</body>", `${PWA_SCRIPT}</body>`);
    changed = true;
  }

  if (changed) {
    await writeFile(filePath, html, "utf8");
    console.log(`Patched ${filePath}`);
  }
}

const files = await Array.fromAsync(
  glob("**/*.html", { cwd: publicDir }),
);

for (const relativePath of files.sort()) {
  await patchHtml(join(publicDir, relativePath));
}
