/**
 * GIF / ICO / SVG および汎用 Canvas 変換
 */

import {
  CANVAS_RASTER_FORMATS,
  canvasToBlob,
  isCanvasRasterFormat,
  isSpecialRasterFormat,
  loadImageSource,
} from "./convert-core.js";
import { drawSourceToCanvas, encodeCanvasToFormat } from "./encode-output.js";

/**
 * 画像を GIF / ICO / SVG に変換
 * @param {File} file
 * @param {{
 *   format: import('./convert-core.js').OutputFormat,
 *   quality: number,
 *   maxEdge: number,
 *   icoSizes?: number[],
 * }} options
 */
export async function convertSpecialRasterImage(file, options) {
  if (!isSpecialRasterFormat(options.format)) {
    throw new Error("特殊形式への変換指定が不正です");
  }

  const { source, width, height } = await loadImageSource(file);
  const whiteBg = false;
  const canvas = drawSourceToCanvas(source, width, height, options.maxEdge, whiteBg);
  source.close?.();

  const quality = Math.min(1, Math.max(0.05, options.quality / 100));
  return encodeCanvasToFormat(canvas, options.format, {
    quality,
    icoSizes: options.icoSizes,
  });
}

/**
 * File または Blob から任意のラスタ形式へ（Canvas 系 + 特殊形式）
 * @param {File | Blob} file
 * @param {string} filename
 * @param {{
 *   format: import('./convert-core.js').OutputFormat,
 *   quality: number,
 *   maxEdge: number,
 *   icoSizes?: number[],
 * }} options
 */
export async function convertImageToRaster(file, options) {
  if (isSpecialRasterFormat(options.format)) {
    const asFile = file instanceof File ? file : new File([file], "image.png", { type: file.type || "image/png" });
    return convertSpecialRasterImage(asFile, options);
  }

  if (!isCanvasRasterFormat(options.format)) {
    throw new Error("出力形式が不正です");
  }

  const asFile = file instanceof File ? file : new File([file], "image.png", { type: file.type || "image/png" });
  const { source, width, height } = await loadImageSource(asFile);
  const canvas = drawSourceToCanvas(
    source,
    width,
    height,
    options.maxEdge,
    options.format === "jpeg",
  );
  source.close?.();

  const spec = CANVAS_RASTER_FORMATS[options.format];
  const quality = Math.min(1, Math.max(0.05, options.quality / 100));
  return encodeCanvasToFormat(canvas, options.format, {
    quality,
    lossy: spec.lossy,
    mime: spec.mime,
  });
}
