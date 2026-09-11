/**
 * PDF → 画像変換（image-converter 向けラッパー）
 */

import {
  loadPdfDocument,
  renderPdfPageToCanvas,
  createPdfPreviewBlob,
} from "../../../js/shared/pdf-import.js";
import { OUTPUT_FORMATS } from "./convert-core.js";
import { encodeCanvasToFormat } from "./encode-output.js";
import { mapPool, yieldToMain } from "./async-pool.js";
import { WORKER_POOL_SIZE } from "./worker-pool.js";

export { loadPdfDocument, renderPdfPageToCanvas, createPdfPreviewBlob };

/** 全ページ変換時、一度に処理するページ数（メモリ負荷軽減） */
export const PDF_PAGE_BATCH_SIZE = 100;

/** 変換対象のページ番号一覧 */
function getPdfPageNumbers(numPages, pdfPages) {
  if (pdfPages === "first") {
    return [1];
  }
  return Array.from({ length: numPages }, (_, index) => index + 1);
}

/** 配列を固定サイズのチャンクに分割 */
function chunkPageNumbers(pageNumbers, batchSize) {
  const chunks = [];
  for (let offset = 0; offset < pageNumbers.length; offset += batchSize) {
    chunks.push(pageNumbers.slice(offset, offset + batchSize));
  }
  return chunks;
}

/**
 * PDF を画像 Blob 配列に変換（ページ並列・進捗コールバック対応）
 * @param {File} file
 * @param {{
 *   outputFormat: import('./convert-core.js').OutputFormat,
 *   quality: number,
 *   maxEdge: number,
 *   pdfPages: 'all' | 'first',
 *   icoSizes?: number[],
 * }} options
 * @param {{ onPage?: (page: { blob: Blob, pageNum: number }, progress: { done: number, total: number }) => void | Promise<void> }} [callbacks]
 */
export async function convertPdfToImages(file, options, callbacks = {}) {
  const pdf = await loadPdfDocument(file);
  const pageNumbers = getPdfPageNumbers(pdf.numPages, options.pdfPages);
  const total = pageNumbers.length;
  let doneCount = 0;
  const quality = Math.min(1, Math.max(0.05, options.quality));

  const batches =
    options.pdfPages === "all" && pageNumbers.length > PDF_PAGE_BATCH_SIZE
      ? chunkPageNumbers(pageNumbers, PDF_PAGE_BATCH_SIZE)
      : [pageNumbers];

  /** @type {Array<{ blob: Blob, pageNum: number }>} */
  const pageResults = [];

  for (const batch of batches) {
    const batchResults = await mapPool(batch, WORKER_POOL_SIZE, async (pageNum) => {
      const canvas = await renderPdfPageToCanvas(
        pdf,
        pageNum,
        options.maxEdge,
        options.outputFormat === "jpeg" ? "jpeg" : "none",
      );
      const formatSpec = OUTPUT_FORMATS[options.outputFormat];
      const blob = await encodeCanvasToFormat(canvas, options.outputFormat, {
        quality,
        lossy: formatSpec.lossy,
        mime: formatSpec.mime,
        icoSizes: options.icoSizes,
      });
      if (!blob) {
        throw new Error(`ページ ${pageNum} の変換に失敗しました`);
      }

      doneCount += 1;
      if (callbacks.onPage) {
        await callbacks.onPage({ blob, pageNum }, { done: doneCount, total });
      }
      await yieldToMain();
      return { blob, pageNum };
    });

    pageResults.push(...batchResults);
  }

  return pageResults.sort((a, b) => a.pageNum - b.pageNum);
}
