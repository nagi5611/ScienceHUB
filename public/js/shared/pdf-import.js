/**
 * PDF → 画像（PDF.js 共有コア）
 */

import * as pdfjs from "pdfjs-dist";

const PDFJS_VERSION = "4.10.38";
const PDF_WORKER_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
const DEFAULT_RENDER_SCALE = 2;

let workerReady = false;

/** PDF.js ワーカーを初期化 */
export function ensurePdfWorker() {
  if (workerReady) return;
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
  workerReady = true;
}

/** 最大辺に収まるサイズを計算 */
export function fitDimensions(width, height, maxEdge) {
  if (!maxEdge || maxEdge <= 0) {
    return { width, height };
  }
  const longest = Math.max(width, height);
  if (longest <= maxEdge) {
    return { width, height };
  }
  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** canvas.toBlob の Promise ラッパー */
export function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mime, quality);
  });
}

/**
 * PDF ドキュメントを読み込む
 * @param {File | ArrayBuffer} source
 */
export async function loadPdfDocument(source) {
  ensurePdfWorker();
  const data = source instanceof ArrayBuffer ? source : await source.arrayBuffer();
  return pdfjs.getDocument({ data }).promise;
}

/**
 * PDF 1ページを canvas に描画
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdf
 * @param {number} pageNum 1-based
 * @param {number} maxEdge
 * @param {'jpeg' | 'none'} [background]
 */
export async function renderPdfPageToCanvas(pdf, pageNum, maxEdge, background = "jpeg") {
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

  if (background === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

/**
 * PDF を JPEG Blob 配列に変換
 * @param {File} file
 * @param {{
 *   maxPages?: number,
 *   maxEdge?: number,
 *   quality?: number,
 *   pdfPages?: 'all' | 'first',
 * }} [options]
 * @param {{ onPage?: (info: { blob: Blob, pageNum: number }, progress: { done: number, total: number }) => void }} [callbacks]
 */
export async function convertPdfToJpegPages(file, options = {}, callbacks = {}) {
  const maxPages = Math.max(1, options.maxPages ?? 10);
  const maxEdge = options.maxEdge ?? 1600;
  const quality = Math.min(1, Math.max(0.05, options.quality ?? 0.85));
  const pdfPages = options.pdfPages ?? "all";

  const pdf = await loadPdfDocument(file);
  const totalPages = pdf.numPages;
  let pageNumbers;
  if (pdfPages === "first") {
    pageNumbers = [1];
  } else {
    const limit = Math.min(totalPages, maxPages);
    pageNumbers = Array.from({ length: limit }, (_, index) => index + 1);
  }

  const total = pageNumbers.length;
  /** @type {Array<{ blob: Blob, pageNum: number }>} */
  const results = [];

  for (let index = 0; index < pageNumbers.length; index += 1) {
    const pageNum = pageNumbers[index];
    const canvas = await renderPdfPageToCanvas(pdf, pageNum, maxEdge, "jpeg");
    const blob = await canvasToBlob(canvas, "image/jpeg", quality);
    if (!blob) {
      throw new Error(`ページ ${pageNum} の変換に失敗しました`);
    }
    results.push({ blob, pageNum });
    if (callbacks.onPage) {
      await callbacks.onPage({ blob, pageNum }, { done: index + 1, total });
    }
  }

  return results;
}

/**
 * PDF 先頭ページのプレビュー Blob
 * @param {File} file
 * @param {number} [maxEdge=120]
 */
export async function createPdfPreviewBlob(file, maxEdge = 120) {
  const pdf = await loadPdfDocument(file);
  const canvas = await renderPdfPageToCanvas(pdf, 1, maxEdge, "none");
  const blob = await canvasToBlob(canvas, "image/png");
  if (!blob) {
    throw new Error("PDF プレビューを生成できません");
  }
  return blob;
}
