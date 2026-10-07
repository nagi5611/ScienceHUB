// public/apps/contest-management/js/display-card-pdf-export.js
import { jsPDF } from 'jspdf';
import { zipSync } from 'fflate';
import {
  buildDisplayCardPreviewState,
  renderDisplayCardPreview,
  fitDisplayCardPreviewToHost,
  bindDisplayCardPreviewHostResize,
  DISPLAY_CARD_WIDTH_PX,
  DISPLAY_CARD_HEIGHT_PX,
  DISPLAY_CARD_LAYOUT,
  DISPLAY_CARD_CAPTURE_SCALE,
  mountDisplayCardPreviewCaptureHost,
  captureDisplayCardForExport,
  waitForDisplayCardPreviewAssets,
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
 * html2canvas on the `.contest-display-card` inside a preview host (modal or off-screen).
 * Restores fitted preview styling after capture.
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
  const mount = mountDisplayCardPreviewCaptureHost(DISPLAY_CARD_WIDTH_PX);
  try {
    renderDisplayCardPreview(mount.host, state, { layout });
    await waitForDisplayCardPreviewAssets(mount.host, layout);
    return await renderDisplayCardPreviewCanvasFromHost(mount.host, layout);
  } finally {
    mount.dispose();
  }
}

/**
 * Wraps a preview bitmap in a single-page PDF (image only, no text layer).
 * @param {HTMLCanvasElement} canvas
 */
export function displayCardCanvasToPdfBlob(canvas) {
  const pageW = DISPLAY_CARD_WIDTH_PX;
  const pageH = DISPLAY_CARD_HEIGHT_PX;
  const pdf = new jsPDF({
    unit: 'px',
    format: [pageW, pageH],
    // [800,450] must stay width×height; default portrait treats 800 as height → 450×800 page.
    orientation: pageW >= pageH ? 'landscape' : 'portrait',
    compress: true,
  });
  const dataUrl = canvas.toDataURL('image/png');
  pdf.addImage(dataUrl, 'PNG', 0, 0, DISPLAY_CARD_WIDTH_PX, DISPLAY_CARD_HEIGHT_PX);
  const out = pdf.output('blob');
  if (out instanceof Blob) {
    return out.type ? out : new Blob([out], { type: 'application/pdf' });
  }
  return new Blob([out], { type: 'application/pdf' });
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
    const blob = displayCardCanvasToPdfBlob(canvas);
    downloadBlob(blob, filename);
  });
}

/**
 * On-screen preview and PDF both rasterize the same fitted DOM in the modal host.
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

  renderDisplayCardPreview(host, opts.previewState, { layout: opts.layout });
  fitDisplayCardPreviewToHost(host);
  bindDisplayCardPreviewHostResize(host, () => fitDisplayCardPreviewToHost(host));
  await waitForDisplayCardPreviewAssets(host, opts.layout);
  fitDisplayCardPreviewToHost(host);

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
  const used = new Set();
  const files = {};
  const total = apps.length;

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    let name = buildDisplayCardPdfFilename(app);
    if (used.has(name)) {
      const stem = name.replace(/\.pdf$/i, '');
      let n = 2;
      while (used.has(`${stem}_${n}.pdf`)) n += 1;
      name = `${stem}_${n}.pdf`;
    }
    used.add(name);
    const blob = await renderDisplayCardPdfBlob(app, layout);
    files[name] = new Uint8Array(await blob.arrayBuffer());
    onProgress?.(i + 1, total);
  }

  const zipped = zipSync(files);
  downloadBlob(new Blob([zipped], { type: 'application/zip' }), 'contest-display-cards.zip');
}
