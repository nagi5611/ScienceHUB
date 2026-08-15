/**
 * GIF / ICO / SVG エンコード
 */

import { canvasToBlob, fitDimensions } from "./convert-core.js";

/** @typedef {import('./convert-core.js').OutputFormat} OutputFormat */

/** @type {Promise<typeof import('gifenc')> | null} */
let gifencPromise = null;

function loadGifenc() {
  if (!gifencPromise) {
    gifencPromise = import("gifenc");
  }
  return gifencPromise;
}

/** Canvas を静止画 GIF にエンコード */
export async function encodeGifFromCanvas(canvas) {
  const { GIFEncoder, quantize, applyPalette } = await loadGifenc();
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas を初期化できません");

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const palette = quantize(imageData.data, 256);
  const index = applyPalette(imageData.data, palette);

  const gif = GIFEncoder();
  gif.writeFrame(index, width, height, { palette, delay: 0 });
  gif.finish();

  return new Blob([gif.bytes()], { type: "image/gif" });
}

/**
 * PNG 埋め込み ICO を生成
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {number[]} sizes px（例: [16, 32, 48]）
 */
export async function encodeIcoFromCanvas(sourceCanvas, sizes) {
  const uniqueSizes = [...new Set(sizes.filter((size) => size >= 16 && size <= 256))].sort(
    (a, b) => a - b,
  );
  if (uniqueSizes.length === 0) {
    throw new Error("ICO サイズを1つ以上選択してください");
  }

  /** @type {Array<{ size: number, data: Uint8Array }>} */
  const images = [];

  for (const size of uniqueSizes) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas を初期化できません");

    ctx.clearRect(0, 0, size, size);
    const scale = Math.min(size / sourceCanvas.width, size / sourceCanvas.height);
    const drawW = Math.max(1, Math.round(sourceCanvas.width * scale));
    const drawH = Math.max(1, Math.round(sourceCanvas.height * scale));
    const offsetX = Math.floor((size - drawW) / 2);
    const offsetY = Math.floor((size - drawH) / 2);
    ctx.drawImage(sourceCanvas, offsetX, offsetY, drawW, drawH);

    const pngBlob = await canvasToBlob(canvas, "image/png");
    if (!pngBlob) throw new Error("ICO 用 PNG の生成に失敗しました");
    images.push({ size, data: new Uint8Array(await pngBlob.arrayBuffer()) });
  }

  return new Blob([buildIcoBuffer(images)], { type: "image/x-icon" });
}

/**
 * ラスタを SVG に埋め込み（ベクター化ではない）
 * @param {HTMLCanvasElement} canvas
 */
export async function encodeSvgFromCanvas(canvas) {
  const pngBlob = await canvasToBlob(canvas, "image/png");
  if (!pngBlob) throw new Error("SVG 用 PNG の生成に失敗しました");

  const base64 = await blobToBase64(pngBlob);
  const { width, height } = canvas;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" href="data:image/png;base64,${base64}"/>
</svg>`;

  return new Blob([svg], { type: "image/svg+xml" });
}

/**
 * Canvas を指定形式にエンコード
 * @param {HTMLCanvasElement} canvas
 * @param {OutputFormat} format
 * @param {{ quality?: number, lossy?: boolean, mime?: string, icoSizes?: number[] }} options
 */
export async function encodeCanvasToFormat(canvas, format, options = {}) {
  if (format === "gif") {
    return encodeGifFromCanvas(canvas);
  }
  if (format === "ico") {
    return encodeIcoFromCanvas(canvas, options.icoSizes ?? [16, 32, 48]);
  }
  if (format === "svg") {
    return encodeSvgFromCanvas(canvas);
  }

  const quality = options.quality;
  const mime = options.mime ?? "image/png";
  const blob = await canvasToBlob(canvas, mime, options.lossy ? quality : undefined);
  if (!blob) {
    throw new Error(`${format.toUpperCase()} への変換に失敗しました`);
  }
  return blob;
}

/**
 * 画像ソースを Canvas に描画
 * @param {CanvasImageSource} source
 * @param {number} srcW
 * @param {number} srcH
 * @param {number} maxEdge
 * @param {boolean} whiteBackground
 */
export function drawSourceToCanvas(source, srcW, srcH, maxEdge, whiteBackground = false) {
  const { width, height } = fitDimensions(srcW, srcH, maxEdge);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas を初期化できません");

  if (whiteBackground) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

/** @param {Blob} blob */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Base64 変換に失敗しました"));
    reader.readAsDataURL(blob);
  });
}

/**
 * ICO バイナリを組み立て（各画像は PNG）
 * @param {Array<{ size: number, data: Uint8Array }>} images
 */
function buildIcoBuffer(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * count;
  let offset = headerSize + dirSize;
  const totalSize = offset + images.reduce((sum, image) => sum + image.data.byteLength, 0);
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, count, true);

  images.forEach((image, index) => {
    const entryOffset = headerSize + index * dirEntrySize;
    const sizeByte = image.size >= 256 ? 0 : image.size;
    buffer[entryOffset] = sizeByte;
    buffer[entryOffset + 1] = sizeByte;
    buffer[entryOffset + 2] = 0;
    buffer[entryOffset + 3] = 0;
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, image.data.byteLength, true);
    view.setUint32(entryOffset + 12, offset, true);
    buffer.set(image.data, offset);
    offset += image.data.byteLength;
  });

  return buffer;
}
