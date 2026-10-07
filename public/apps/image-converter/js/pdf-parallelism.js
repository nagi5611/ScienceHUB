/**
 * PDF 変換の並列度（端末メモリ予算ベース）
 */

import {
  CLIENT_MEMORY_BASE_RESERVED_BYTES,
  PDF_PAGE_RENDER_MEMORY_OVERHEAD,
  computeParallelismFromBudget,
  estimateRgbaCanvasBytes,
  getClientMemoryBudgetBytes,
} from "../../../js/shared/client-memory-budget.js";
import {
  getPdfPageCanvasDimensions,
  resolvePdfRenderScale,
} from "../../../js/shared/pdf-import.js";

/**
 * バッチ内の最大ページ作業セット（バイト）
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdf
 * @param {number[]} pageNumbers
 * @param {number} maxEdge
 * @param {number} renderScale
 */
export async function estimateMaxPdfPageWorkingSetBytes(pdf, pageNumbers, maxEdge, renderScale) {
  let maxBytes = 0;
  for (const pageNum of pageNumbers) {
    const { width, height } = await getPdfPageCanvasDimensions(pdf, pageNum, maxEdge, renderScale);
    const bytes = estimateRgbaCanvasBytes(width, height, PDF_PAGE_RENDER_MEMORY_OVERHEAD);
    if (bytes > maxBytes) maxBytes = bytes;
  }
  return maxBytes;
}

/**
 * PDF ページ変換の推奨並列数
 * @param {{
 *   pdfFileSize: number,
 *   pdf: import('pdfjs-dist').PDFDocumentProxy,
 *   pageNumbers: number[],
 *   maxEdge: number,
 *   pdfQuality?: import('../../../js/shared/pdf-import.js').PdfRenderQuality,
 *   maxConcurrency: number,
 * }} params
 */
export async function computePdfRenderConcurrency(params) {
  const renderScale = resolvePdfRenderScale(params.pdfQuality);
  const maxPageBytes = await estimateMaxPdfPageWorkingSetBytes(
    params.pdf,
    params.pageNumbers,
    params.maxEdge,
    renderScale,
  );
  const budgetBytes = getClientMemoryBudgetBytes();
  const reservedBytes = Math.max(0, params.pdfFileSize) + CLIENT_MEMORY_BASE_RESERVED_BYTES;

  return computeParallelismFromBudget({
    budgetBytes,
    reservedBytes,
    maxPageWorkingSetBytes: maxPageBytes,
    maxConcurrency: params.maxConcurrency,
  });
}
