/**
 * 変換オーケストレーション
 */

import {
  OUTPUT_FORMATS,
  CANVAS_RASTER_FORMATS,
  convertRasterImage,
  detectInputKind,
  inspectInputFile,
  isCanvasRasterFormat,
  isSpecialRasterFormat,
} from "./convert-core.js";
import { convertPdfToImages } from "./pdf-import.js";
import { convertImageToPdf } from "./pdf-export.js";
import { convertServerImage } from "./convert-server.js";
import { convertRasterInWorker } from "./convert-raster-pool.js";
import { convertImageToRaster } from "./convert-special.js";

export {
  OUTPUT_FORMATS,
  RASTER_FORMATS,
  CANVAS_RASTER_FORMATS,
  SPECIAL_RASTER_FORMATS,
  buildOutputFilename,
  detectInputKind,
  detectSupportedOutputFormats,
  detectSupportedRasterFormats,
  probeCanvasRasterFormats,
  isCanvasRasterFormat,
  isSpecialRasterFormat,
  downloadBlob,
  formatBytes,
  formatInputKindLabel,
  getFileExtension,
  inspectInputFile,
  isServerConvertFile,
  loadImageFromFile,
  loadImageSource,
} from "./convert-core.js";

export { createPdfPreviewBlob } from "./pdf-import.js";

/**
 * @param {import('./convert-core.js').OutputFormat} format
 */
function serverRasterFormat(format) {
  if (isCanvasRasterFormat(format)) {
    return format;
  }
  return "png";
}

/**
 * ファイルを変換
 * @param {File} file
 * @param {{
 *   format: import('./convert-core.js').OutputFormat,
 *   quality: number,
 *   maxEdge: number,
 *   pdfPages: 'all' | 'first',
 *   icoSizes?: number[],
 * }} options
 * @param {{ onProgress?: (items: Array<{ blob: Blob, pageNum?: number }>, meta?: { done: number, total: number }) => void | Promise<void> }} [callbacks]
 * @returns {Promise<Array<{ blob: Blob, pageNum?: number }>>}
 */
export async function convertFile(file, options, callbacks = {}) {
  const { onProgress } = callbacks;
  const inspection = inspectInputFile(file);
  if (!inspection.ok) {
    throw new Error(inspection.reason);
  }

  const inputKind = detectInputKind(file);
  const formatSpec = OUTPUT_FORMATS[options.format];
  if (!formatSpec) {
    throw new Error("出力形式が不正です");
  }

  if (inputKind === "pdf") {
    if (options.format === "pdf") {
      throw new Error("PDF から PDF への変換はできません");
    }

    const quality = Math.min(1, Math.max(0.05, options.quality / 100));
    /** @type {Array<{ blob: Blob, pageNum?: number }>} */
    const accumulated = [];

    const pages = await convertPdfToImages(
      file,
      {
        outputFormat: options.format,
        quality,
        maxEdge: options.maxEdge,
        pdfPages: options.pdfPages,
        icoSizes: options.icoSizes,
      },
      {
        onPage: async (page, progress) => {
          accumulated.push({ blob: page.blob, pageNum: page.pageNum });
          if (onProgress) await onProgress([...accumulated], progress);
        },
      },
    );
    return pages.map((page) => ({ blob: page.blob, pageNum: page.pageNum }));
  }

  if (inputKind === "server-image") {
    if (options.format === "pdf") {
      throw new Error("HEIC / TIFF / RAW から PDF への変換には未対応です");
    }

    const remoteFormat = serverRasterFormat(options.format);
    const results = await convertServerImage(file, {
      format: remoteFormat,
      quality: options.quality,
      maxEdge: options.maxEdge,
    });

    if (options.format === remoteFormat) {
      if (onProgress) await onProgress(results);
      return results;
    }

    const encoded = await convertImageToRaster(
      new Blob([results[0].blob], { type: "image/png" }),
      { ...options, maxEdge: 0 },
    );
    const finalResults = [{ blob: encoded }];
    if (onProgress) await onProgress(finalResults);
    return finalResults;
  }

  if (options.format === "pdf") {
    const blob = await convertImageToPdf(file, {
      quality: options.quality,
      maxEdge: options.maxEdge,
    });
    const results = [{ blob }];
    if (onProgress) await onProgress(results);
    return results;
  }

  if (isSpecialRasterFormat(options.format)) {
    const blob = await convertImageToRaster(file, options);
    const results = [{ blob }];
    if (onProgress) await onProgress(results);
    return results;
  }

  let blob;
  try {
    blob = await convertRasterInWorker(file, {
      format: /** @type {import('./convert-core.js').CanvasRasterFormat} */ (options.format),
      quality: options.quality,
      maxEdge: options.maxEdge,
    });
  } catch {
    blob = await convertRasterImage(file, {
      format: /** @type {import('./convert-core.js').CanvasRasterFormat} */ (options.format),
      quality: options.quality,
      maxEdge: options.maxEdge,
    });
  }

  if (blob.type !== formatSpec.mime) {
    blob = await convertImageToRaster(
      new Blob([blob], { type: blob.type || "image/png" }),
      options,
    );
  }

  const results = [{ blob }];
  if (onProgress) await onProgress(results);
  return results;
}
