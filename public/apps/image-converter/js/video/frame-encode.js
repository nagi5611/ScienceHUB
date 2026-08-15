/**
 * VideoFrame / Canvas を PNG / JPEG / GIF にエンコード
 */

import { canvasToBlob } from "../convert-core.js";
import { encodeGifFromCanvas } from "../encode-output.js";

/**
 * VideoFrame を Canvas に描画
 * @param {VideoFrame} frame
 */
function videoFrameToCanvas(frame) {
  const canvas = document.createElement("canvas");
  canvas.width = frame.displayWidth;
  canvas.height = frame.displayHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas を初期化できません");
  ctx.drawImage(frame, 0, 0);
  return canvas;
}

/**
 * 1 フレームを指定形式の Blob に変換
 * @param {VideoFrame} frame
 * @param {'png' | 'jpeg' | 'gif'} format
 * @param {number} quality 0–100
 */
export async function encodeVideoFrame(frame, format, quality = 85) {
  const canvas = videoFrameToCanvas(frame);
  const q = Math.min(1, Math.max(0.05, quality / 100));

  if (format === "gif") {
    return encodeGifFromCanvas(canvas);
  }
  if (format === "jpeg") {
    const blob = await canvasToBlob(canvas, "image/jpeg", q);
    if (!blob) throw new Error("JPEG エンコードに失敗しました");
    return blob;
  }

  const blob = await canvasToBlob(canvas, "image/png");
  if (!blob) throw new Error("PNG エンコードに失敗しました");
  return blob;
}
