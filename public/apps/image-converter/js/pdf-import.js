/**
 * PDF → 画像変換（PDF.js）
 */

import * as pdfjs from "pdfjs-dist";
import { canvasToBlob, OUTPUT_FORMATS, fitDimensions } from "./convert-core.js";
import { encodeCanvasToFormat } from "./encode-output.js";
import { mapPool, yieldToMain } from "./async-pool.js";
import { WORKER_POOL_SIZE } from "./worker-pool.js";

const PDFJS_VERSION = "4.10.38";
const PDF_WORKER_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
/** 全ページ変換時、一度に処理するページ数（メモリ負荷軽減） */
export const PDF_PAGE_BATCH_SIZE = 100;
const DEFAULT_RENDER_SCALE = 2;

let workerReady = false;

/** PDF.js ワーカーを初期化 */
function ensurePdfWorker() {
  if (workerReady) return;
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
  workerReady = true;
}

/**
 * PDF ドキュメントを読み込む
 * @param {File} file
 */
export async function loadPdfDocument(file) {
  ensurePdfWorker();
  const data = await file.arrayBuffer();
  return pdfjs.getDocument({ data }).promise;
}

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
 * PDF 1ページを canvas に描画
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdf
 * @param {number} pageNum
 * @param {number} maxEdge
 * @param {import('./convert-core.js').RasterFormat | undefined} outputFormat
 */
export async function renderPdfPageToCanvas(pdf, pageNum, maxEdge, outputFormat) {
  const page = await pdf.getPage(pageNum);
  const baseViewport = page.getViewport({ scale: DEFAULT_RENDER_SCALE });
  const { width, height } = fitDimensions(baseViewport.width, baseViewport.height, maxEdge);
  const scale = width / baseViewport.width;
  const viewport = page.getViewport({ scale: DEFAULT_RENDER_SCALE * scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas を初期化できません");
  }

  if (outputFormat === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

/**
 * PDF 先頭ページのプレビュー Blob を生成
 * @param {File} file
 * @param {number} maxEdge
 */
export async function createPdfPreviewBlob(file, maxEdge = 120) {
  const pdf = await loadPdfDocument(file);
  const canvas = await renderPdfPageToCanvas(pdf, 1, maxEdge);
  const blob = await canvasToBlob(canvas, "image/png");
  if (!blob) {
    throw new Error("PDF プレビューを生成できません");
  }
  return blob;
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
        options.outputFormat === "jpeg" ? "jpeg" : undefined,
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
