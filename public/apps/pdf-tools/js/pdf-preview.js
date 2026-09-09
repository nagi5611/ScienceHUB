/**
 * PDF プレビュー（pdfjs-dist）— ページ数・サムネイル
 */

import * as pdfjs from "pdfjs-dist";

const PDFJS_VERSION = "4.10.38";
const PDF_WORKER_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
const THUMB_SCALE = 0.35;

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
export async function loadPdfPreview(file) {
  ensurePdfWorker();
  const data = await file.arrayBuffer();
  return pdfjs.getDocument({ data }).promise;
}

/**
 * 1 ページを canvas に描画して data URL を返す
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdf
 * @param {number} pageNum 1-based
 */
export async function renderPageThumbnail(pdf, pageNum) {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: THUMB_SCALE });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("canvas を初期化できませんでした");
  }
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/jpeg", 0.82);
}

/**
 * 全ページのサムネイルを生成
 * @param {import('pdfjs-dist').PDFDocumentProxy} pdf
 * @param {(progress: { current: number, total: number }) => void} [onProgress]
 */
export async function renderAllThumbnails(pdf, onProgress) {
  const total = pdf.numPages;
  /** @type {string[]} */
  const thumbnails = [];

  for (let pageNum = 1; pageNum <= total; pageNum += 1) {
    thumbnails.push(await renderPageThumbnail(pdf, pageNum));
    onProgress?.({ current: pageNum, total });
  }

  return thumbnails;
}
