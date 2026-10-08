// public/apps/contest-management/js/display-card-pdf-export.js
import { jsPDF } from 'jspdf';
import { zipSync } from 'fflate';
import {
  buildDisplayCardPreviewState,
  fitDisplayCardPreviewToHost,
  bindDisplayCardPreviewHostResize,
  DISPLAY_CARD_WIDTH_PX,
  DISPLAY_CARD_HEIGHT_PX,
  DISPLAY_CARD_LAYOUT,
  DISPLAY_CARD_CAPTURE_SCALE,
  captureDisplayCardForExport,
  renderDisplayCardRasterPreview,
  rasterizeDisplayCardState,
} from '../../contest-entry/js/display-card-preview.js';

const SCHEDULE_FILENAME_LABELS = {
  full_time: '全日制',
  part_time: '定時制',
};

/** Removes characters illegal in Windows file names. */
export function sanitizeDisplayCardPdfFilenamePart(text) {
  return String(text ?? '')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds PDF filename: 在籍区分_クラス_番号_名前_タイトル.pdf
 * @param {object} app
 */
export function buildDisplayCardPdfFilename(app) {
  const input = applicationToDisplayCardInput(app);
  const schedule =
    SCHEDULE_FILENAME_LABELS[app.schedule_type] ?? app.schedule_type ?? '';
  const parts = [
    schedule,
    input.homeroom,
    String(app.student_number ?? ''),
    input.studentName,
    input.title,
  ].map(sanitizeDisplayCardPdfFilenamePart);
  const base = parts.filter((p) => p.length > 0).join('_') || 'display-card';
  return `${base}.pdf`;
}

/** Same stem as PDF download; suffix marks html2canvas bitmap used for jsPDF. */
export function buildDisplayCardPngCaptureFilename(pdfFilename) {
  const base = String(pdfFilename ?? '').replace(/\.pdf$/i, '') || 'display-card';
  return `${base}_pre-pdf.png`;
}

/**
 * @param {{
 *   schedule_type: string;
 *   homeroom: string;
 *   student_number: number;
 *   student_name: string;
 *   title: string;
 *   impressions?: string | null;
 *   members?: Array<{ homeroom?: string | null; member_name: string }>;
 * }} app
 */
export function applicationToDisplayCardInput(app) {
  const primary = app.members?.[0];
  const homeroom = (primary?.homeroom ?? app.homeroom ?? '').trim();
  const studentName = (primary?.member_name ?? app.student_name ?? '').trim();
  return {
    scheduleType: app.schedule_type === 'part_time' ? 'part_time' : 'full_time',
    homeroom,
    studentName,
    title: (app.title ?? '').trim(),
    impressions: (app.impressions ?? '').trim(),
  };
}

function assertCanvasHasPixels(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('展示カード画像の生成に失敗しました');
  const sample = ctx.getImageData(0, 0, Math.min(8, canvas.width), Math.min(8, canvas.height));
  let opaque = 0;
  for (let i = 3; i < sample.data.length; i += 4) {
    if (sample.data[i] > 0) opaque += 1;
  }
  if (opaque === 0) {
    throw new Error('展示カードのキャプチャが空です。ページを再読み込みして再度お試しください。');
  }
}

/** Ensures overlay text (title band) was rasterized, not just the template image. */
export function assertDisplayCardCanvasHasOverlayInk(canvas, layout = DISPLAY_CARD_LAYOUT) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('展示カード画像の生成に失敗しました');
  const scale = canvas.width / DISPLAY_CARD_WIDTH_PX;
  const left = Math.floor((layout.title.left / 100) * DISPLAY_CARD_WIDTH_PX * scale);
  const top = Math.floor((layout.title.top / 100) * DISPLAY_CARD_HEIGHT_PX * scale);
  const width = Math.max(
    8,
    Math.floor((layout.title.width / 100) * DISPLAY_CARD_WIDTH_PX * scale)
  );
  const height = Math.max(8, Math.ceil(layout.title.fontSize * scale * 1.4));
  const region = ctx.getImageData(
    Math.min(left, canvas.width - 1),
    Math.min(top, canvas.height - 1),
    Math.min(width, canvas.width - left),
    Math.min(height, canvas.height - top)
  );
  let darkPixels = 0;
  for (let i = 0; i < region.data.length; i += 4) {
    const alpha = region.data[i + 3];
    const lum = region.data[i] + region.data[i + 1] + region.data[i + 2];
    if (alpha > 16 && lum < 720) darkPixels += 1;
  }
  if (darkPixels < 8) {
    throw new Error(
      '展示カードの文字がキャプチャされていません。ページを再読み込みして再度お試しください。'
    );
  }
}

/**
 * Returns the cached html2canvas bitmap from `renderDisplayCardRasterPreview` (800×450 design).
 * @param {HTMLElement} host
 * @param {typeof DISPLAY_CARD_LAYOUT} layout
 */
export async function renderDisplayCardPreviewCanvasFromHost(host, layout) {
  const canvas = await captureDisplayCardForExport(host, layout);
  assertCanvasHasPixels(canvas);
  assertDisplayCardCanvasHasOverlayInk(canvas, layout);
  return canvas;
}

/**
 * Off-screen batch capture (ZIP bulk export). Same raster path as modal after DOM render.
 * @param {object} app
 * @param {typeof DISPLAY_CARD_LAYOUT} layout
 */
export async function renderDisplayCardPreviewCanvas(app, layout) {
  const input = applicationToDisplayCardInput(app);
  const state = buildDisplayCardPreviewState(input, layout, {
    cardWidthPx: DISPLAY_CARD_WIDTH_PX,
  });
  const canvas = await rasterizeDisplayCardState(state, { layout });
  assertCanvasHasPixels(canvas);
  assertDisplayCardCanvasHasOverlayInk(canvas, layout);
  return canvas;
}

/**
 * Wraps a preview bitmap in a single-page PDF (image only, no text layer).
 * @param {HTMLCanvasElement} canvas
 */
/** Portrait print layout: two 800×450 cards stacked (matches bulk ZIP export). */
export const DISPLAY_CARD_2UP_PAGE_MARGIN_X_PX = 0;
export const DISPLAY_CARD_2UP_PAGE_MARGIN_Y_PX = 40;
export const DISPLAY_CARD_2UP_GUTTER_PX = 32;

/** @returns {{ pageW: number; pageH: number }} */
export function getDisplayCardTwoUpPageSizePx() {
  const pageW = DISPLAY_CARD_WIDTH_PX + DISPLAY_CARD_2UP_PAGE_MARGIN_X_PX * 2;
  const pageH =
    DISPLAY_CARD_HEIGHT_PX * 2 +
    DISPLAY_CARD_2UP_GUTTER_PX +
    DISPLAY_CARD_2UP_PAGE_MARGIN_Y_PX * 2;
  return { pageW, pageH };
}

/** @param {number} cardCount */
export function getDisplayCardTwoUpPageCount(cardCount) {
  if (!Number.isFinite(cardCount) || cardCount <= 0) return 0;
  return Math.ceil(cardCount / 2);
}

function pdfBlobFromJsPdf(pdf) {
  const out = pdf.output('blob');
  if (out instanceof Blob) {
    return out.type ? out : new Blob([out], { type: 'application/pdf' });
  }
  return new Blob([out], { type: 'application/pdf' });
}

/**
 * @param {import('jspdf').jsPDF} pdf
 * @param {HTMLCanvasElement} canvas
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function addDisplayCardCanvasToPdfPage(pdf, canvas, x, y, w, h) {
  const dataUrl = canvas.toDataURL('image/png');
  pdf.addImage(dataUrl, 'PNG', x, y, w, h);
}

export function displayCardCanvasToPdfBlob(canvas) {
  const pageW = canvas.width / DISPLAY_CARD_CAPTURE_SCALE;
  const pageH = canvas.height / DISPLAY_CARD_CAPTURE_SCALE;
  const pdf = new jsPDF({
    unit: 'px',
    format: [pageW, pageH],
    orientation: pageW >= pageH ? 'landscape' : 'portrait',
    compress: true,
  });
  addDisplayCardCanvasToPdfPage(pdf, canvas, 0, 0, pageW, pageH);
  return pdfBlobFromJsPdf(pdf);
}

/**
 * One portrait page per pair: card bitmaps stacked top / bottom (print-ready).
 * @param {HTMLCanvasElement[]} canvases
 */
export function displayCardCanvasesToTwoUpPdfBlob(canvases) {
  if (!canvases.length) {
    throw new Error('展示カードがありません');
  }
  const { pageW, pageH } = getDisplayCardTwoUpPageSizePx();
  const marginX = DISPLAY_CARD_2UP_PAGE_MARGIN_X_PX;
  const marginY = DISPLAY_CARD_2UP_PAGE_MARGIN_Y_PX;
  const gutter = DISPLAY_CARD_2UP_GUTTER_PX;
  const cardW = DISPLAY_CARD_WIDTH_PX;
  const cardH = DISPLAY_CARD_HEIGHT_PX;

  const pdf = new jsPDF({
    unit: 'px',
    format: [pageW, pageH],
    orientation: 'portrait',
    compress: true,
  });

  for (let i = 0; i < canvases.length; i += 2) {
    if (i > 0) {
      pdf.addPage([pageW, pageH], 'portrait');
    }
    addDisplayCardCanvasToPdfPage(pdf, canvases[i], marginX, marginY, cardW, cardH);
    const bottom = canvases[i + 1];
    if (bottom) {
      addDisplayCardCanvasToPdfPage(
        pdf,
        bottom,
        marginX,
        marginY + cardH + gutter,
        cardW,
        cardH
      );
    }
  }

  return pdfBlobFromJsPdf(pdf);
}

/**
 * Preview DOM → PNG bitmap → single-page PDF.
 * @param {object} app
 * @param {typeof DISPLAY_CARD_LAYOUT} layout
 */
export async function renderDisplayCardPdfBlob(app, layout) {
  const canvas = await renderDisplayCardPreviewCanvas(app, layout);
  return displayCardCanvasToPdfBlob(canvas);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Downloads the same PNG bitmap passed to displayCardCanvasToPdfBlob. */
function downloadDisplayCardCapturePng(canvas, pdfFilename) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('展示カードのPNG生成に失敗しました'));
        return;
      }
      downloadBlob(blob, buildDisplayCardPngCaptureFilename(pdfFilename));
      resolve();
    }, 'image/png');
  });
}

const DISPLAY_CARD_PDF_MODAL_ID = 'contest-display-card-pdf-modal';

/** @type {string[]} */
let displayCardPdfPreviewObjectUrls = [];

/** @type {{ layout: typeof DISPLAY_CARD_LAYOUT; filename: string } | null} */
let displayCardPdfModalContext = null;

function revokeDisplayCardPdfPreviewObjectUrls() {
  for (const url of displayCardPdfPreviewObjectUrls) {
    URL.revokeObjectURL(url);
  }
  displayCardPdfPreviewObjectUrls = [];
}

/** Wires close/download handlers for the display card PDF preview modal (once). */
export function setupDisplayCardPdfPreviewModal() {
  const modal = document.getElementById(DISPLAY_CARD_PDF_MODAL_ID);
  if (!(modal instanceof HTMLElement) || modal.dataset.bound === 'true') return;
  modal.dataset.bound = 'true';

  const closeModal = () => {
    modal.classList.remove('open');
    revokeDisplayCardPdfPreviewObjectUrls();
    displayCardPdfModalContext = null;
    const host = modal.querySelector('[data-display-card-pdf-preview-host]');
    if (host instanceof HTMLElement) {
      host.replaceChildren();
    }
    delete modal.dataset.downloadUrl;
    delete modal.dataset.downloadFilename;
  };

  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal.querySelector('[data-display-card-pdf-dismiss]')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  modal.querySelector('[data-display-card-pdf-download]')?.addEventListener('click', async () => {
    const filename = modal.dataset.downloadFilename;
    const ctx = displayCardPdfModalContext;
    const host = modal.querySelector('[data-display-card-pdf-preview-host]');
    if (!filename || !ctx?.layout || !(host instanceof HTMLElement)) return;
    const canvas = await renderDisplayCardPreviewCanvasFromHost(host, ctx.layout);
    await downloadDisplayCardCapturePng(canvas, filename);
    const blob = displayCardCanvasToPdfBlob(canvas);
    downloadBlob(blob, filename);
  });
}

/**
 * On-screen preview and PDF share the same html2canvas bitmap (800×450 design).
 * @param {{
 *   filename: string;
 *   title?: string;
 *   previewState: ReturnType<typeof buildDisplayCardPreviewState>;
 *   layout: typeof DISPLAY_CARD_LAYOUT;
 * }} opts
 */
export async function openDisplayCardPdfPreviewModal(opts) {
  setupDisplayCardPdfPreviewModal();
  const modal = document.getElementById(DISPLAY_CARD_PDF_MODAL_ID);
  if (!(modal instanceof HTMLElement)) {
    throw new Error('展示カードPDFプレビュー用のモーダルが見つかりません');
  }

  revokeDisplayCardPdfPreviewObjectUrls();
  displayCardPdfModalContext = { layout: opts.layout, filename: opts.filename };

  const titleEl = modal.querySelector('[data-display-card-pdf-title]');
  if (titleEl) {
    titleEl.textContent = opts.title?.trim() || '展示カード PDF';
  }

  const host = modal.querySelector('[data-display-card-pdf-preview-host]');
  if (!(host instanceof HTMLElement)) {
    throw new Error('展示カードのプレビュー領域が見つかりません');
  }

  bindDisplayCardPreviewHostResize(host, () => fitDisplayCardPreviewToHost(host));
  await renderDisplayCardRasterPreview(host, opts.previewState, { layout: opts.layout });

  modal.classList.add('open');
  await new Promise((resolve) => requestAnimationFrame(() => resolve()));
  fitDisplayCardPreviewToHost(host);

  const canvas = await renderDisplayCardPreviewCanvasFromHost(host, opts.layout);
  const pdfBlob = displayCardCanvasToPdfBlob(canvas);
  const pdfUrl = URL.createObjectURL(pdfBlob);
  displayCardPdfPreviewObjectUrls.push(pdfUrl);
  modal.dataset.downloadUrl = pdfUrl;
  modal.dataset.downloadFilename = opts.filename;
}

/** Renders PDF from modal preview DOM + opens modal (matches entry fit). */
export async function previewDisplayCardPdfForApplication(app, layout) {
  const input = applicationToDisplayCardInput(app);
  const previewState = buildDisplayCardPreviewState(input, layout, {
    cardWidthPx: DISPLAY_CARD_WIDTH_PX,
  });
  await openDisplayCardPdfPreviewModal({
    filename: buildDisplayCardPdfFilename(app),
    title: (app.title ?? '').trim() || '展示カード',
    previewState,
    layout,
  });
}

/** @param {object} app @param {typeof DISPLAY_CARD_LAYOUT} layout */
export async function downloadDisplayCardPdfForApplication(app, layout) {
  const blob = await renderDisplayCardPdfBlob(app, layout);
  downloadBlob(blob, buildDisplayCardPdfFilename(app));
}

/**
 * @param {object[]} apps
 * @param {typeof DISPLAY_CARD_LAYOUT} layout
 * @param {(done: number, total: number) => void} [onProgress]
 */
export async function downloadDisplayCardPdfsZip(apps, layout, onProgress) {
  const total = apps.length;
  const canvases = [];

  for (let i = 0; i < apps.length; i++) {
    canvases.push(await renderDisplayCardPreviewCanvas(apps[i], layout));
    onProgress?.(i + 1, total);
  }

  const pdfBlob = displayCardCanvasesToTwoUpPdfBlob(canvases);
  const files = {
    'contest-display-cards-2up.pdf': new Uint8Array(await pdfBlob.arrayBuffer()),
  };
  const zipped = zipSync(files);
  downloadBlob(new Blob([zipped], { type: 'application/zip' }), 'contest-display-cards.zip');
}
