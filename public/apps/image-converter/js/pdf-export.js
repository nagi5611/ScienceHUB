/**
 * 画像 → PDF 変換（jsPDF）
 */

import { jsPDF } from "jspdf";
import { fitDimensions, loadImageFromFile } from "./convert-core.js";

/**
 * 画像を 1 ページ PDF に変換
 * @param {File} file
 * @param {{ quality: number, maxEdge: number }} options
 */
export async function convertImageToPdf(file, options) {
  const img = await loadImageFromFile(file);
  const { width, height } = fitDimensions(img.naturalWidth, img.naturalHeight, options.maxEdge);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas を初期化できません");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const quality = Math.min(1, Math.max(0.05, options.quality / 100));
  const imageType = "JPEG";
  const dataUrl = canvas.toDataURL("image/jpeg", quality);

  const orientation = width >= height ? "landscape" : "portrait";
  const pdf = new jsPDF({
    orientation,
    unit: "px",
    format: [width, height],
    hotfixes: ["px_scaling"],
  });

  pdf.addImage(dataUrl, imageType, 0, 0, width, height);
  return pdf.output("blob");
}
