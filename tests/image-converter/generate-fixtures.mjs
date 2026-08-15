/**
 * E2E 用テスト画像を生成
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.join(__dirname, "fixtures");

const RED_PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function ensureDir() {
  await fs.mkdir(FIXTURES_DIR, { recursive: true });
}

async function writePng(name) {
  await fs.writeFile(path.join(FIXTURES_DIR, name), RED_PIXEL);
}

async function writeJpeg(name) {
  const buf = await sharp(RED_PIXEL).jpeg({ quality: 90 }).toBuffer();
  await fs.writeFile(path.join(FIXTURES_DIR, name), buf);
}

async function writeWebp(name) {
  const buf = await sharp(RED_PIXEL).webp({ quality: 90 }).toBuffer();
  await fs.writeFile(path.join(FIXTURES_DIR, name), buf);
}

async function writeBmp(name) {
  // 1x1 24-bit BMP
  const bmp = Buffer.from(
    "Qk06AAAAAAAAADYAAAAoAAAAAQAAAAEAAAABABgAAAAAAAQAAADEDgAAxA4AAAAAAAAAAAAAAP8A",
    "base64",
  );
  await fs.writeFile(path.join(FIXTURES_DIR, name), bmp);
}

async function writeGif(name) {
  const buf = await sharp(RED_PIXEL).gif().toBuffer();
  await fs.writeFile(path.join(FIXTURES_DIR, name), buf);
}

async function writeSvg(name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="red"/></svg>`;
  await fs.writeFile(path.join(FIXTURES_DIR, name), svg, "utf8");
}

async function writeHeicStub(name) {
  // MIME 空の HEIC 相当（拡張子判定テスト用）
  await fs.writeFile(path.join(FIXTURES_DIR, name), RED_PIXEL);
}

async function writeMinimalPdf(name) {
  const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 32 32]/Parent 2 0 R/Contents 4 0 R>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 10 20 Td (ICV) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
trailer<</Size 5/Root 1 0 R>>
startxref
306
%%EOF`;
  await fs.writeFile(path.join(FIXTURES_DIR, name), pdf, "utf8");
}

async function writeTinyMp4(name) {
  const outPath = path.join(FIXTURES_DIR, name);
  const { spawn } = await import("node:child_process");
  await new Promise((resolve, reject) => {
    const child = spawn(
      "ffmpeg",
      ["-y", "-f", "lavfi", "-i", "color=c=red:s=8x8:d=0.2", "-pix_fmt", "yuv420p", outPath],
      { stdio: "ignore" },
    );
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
  });
}

/** ffmpeg なし環境用 — 8x8・0.2s・5フレームの H.264 MP4 */
const EMBEDDED_SAMPLE_MP4_B64 =
  "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";

async function writeEmbeddedMp4(name) {
  await fs.writeFile(path.join(FIXTURES_DIR, name), Buffer.from(EMBEDDED_SAMPLE_MP4_B64, "base64"));
}

await ensureDir();
await Promise.all([
  writePng("sample.png"),
  writeJpeg("sample.jpg"),
  writeWebp("sample.webp"),
  writeBmp("sample.bmp"),
  writeGif("sample.gif"),
  writeSvg("sample.svg"),
  writeHeicStub("sample.heic"),
  writeMinimalPdf("sample.pdf"),
]);
const jpegUpper = await sharp(RED_PIXEL).jpeg().toBuffer();
await fs.writeFile(path.join(FIXTURES_DIR, "PHOTO.JPEG"), jpegUpper);

try {
  await writeTinyMp4("sample.mp4");
} catch {
  await writeEmbeddedMp4("sample.mp4");
  console.warn("sample.mp4: embedded fallback (ffmpeg unavailable)");
}

console.log("Fixtures written to", FIXTURES_DIR);
