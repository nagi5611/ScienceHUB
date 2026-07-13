/**
 * PWA アイコンを SVG ソースから PNG 各サイズに生成する
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");
const sourceSvg = join(iconsDir, "icon.svg");

/** maskable 用にロゴをセーフゾーン内へ縮小した SVG を返す */
function buildMaskableSvg(svgContent) {
  return svgContent.replace(
    'transform="translate(80 80) scale(10.5)"',
    'transform="translate(130 130) scale(7.5)"',
  );
}

/** SVG を指定サイズの PNG に変換して保存する */
async function renderPng(svg, size, outputPath) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
}

async function main() {
  await mkdir(iconsDir, { recursive: true });

  const svg = await readFile(sourceSvg, "utf8");
  const maskableSvg = buildMaskableSvg(svg);

  const outputs = [
    { svg, size: 32, file: "favicon-32.png" },
    { svg, size: 180, file: "apple-touch-icon.png" },
    { svg, size: 192, file: "icon-192.png" },
    { svg, size: 512, file: "icon-512.png" },
    { svg: maskableSvg, size: 512, file: "icon-512-maskable.png" },
  ];

  for (const { svg: input, size, file } of outputs) {
    const outputPath = join(iconsDir, file);
    await renderPng(input, size, outputPath);
    console.log(`Generated ${file} (${size}x${size})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
