/**
 * 造形コンテスト展示カードのテンプレート SVG を正とし、必要なら PNG を再生成する。
 * オーバーレイ座標は public/apps/contest-entry/js/display-card-preview.js の DISPLAY_CARD_LAYOUT。
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, "..", "public", "apps", "contest-entry", "images");
const svgPath = join(imagesDir, "display-card-template.svg");
const pngPath = join(imagesDir, "display-card-template.png");

const writePng = process.argv.includes("--png");

async function main() {
  const svg = await readFile(svgPath, "utf8");
  if (!svg.includes("<svg")) {
    throw new Error(`Invalid SVG: ${svgPath}`);
  }

  if (!writePng) {
    console.log(`OK: ${svgPath} (PNG は未更新。再生成する場合は --png)`);
    return;
  }

  await sharp(Buffer.from(svg))
    .resize(800, 450)
    .png()
    .toFile(pngPath);
  console.log(`Wrote ${pngPath} from SVG (日本語は環境のフォント依存。崩れる場合は PNG を手動で差し替え)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
