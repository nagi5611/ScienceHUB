// public/apps/contest-management/js/display-card-pdf-export.js
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { zipSync } from 'fflate';
import {
  buildDisplayCardPreviewState,
  renderDisplayCardPreview,
  DISPLAY_CARD_WIDTH_PX,
  DISPLAY_CARD_HEIGHT_PX,
  DISPLAY_CARD_LAYOUT,
  mountDisplayCardPreviewCaptureHost,
  prepareDisplayCardElementForRasterCapture,
  waitForDisplayCardPreviewAssets,
} from '../../contest-entry/js/display-card-preview.js';

const SCHEDULE_FILENAME_LABELS = {
  full_time: '全日制',
  part_time: '定時制',
};

/** Raster capture scale (2× → PDF page is still 800×450 px). */
const DISPLAY_CARD_CAPTURE_SCALE = 2;

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

/**
 * Renders the same DOM as the entry preview, then captures it as a canvas bitmap.
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

    const card = mount.host.querySelector('.contest-display-card');
    if (!(card instanceof HTMLElement)) {
      throw new Error('展示カードの描画に失敗しました');
    }
    prepareDisplayCardElementForRasterCapture(card);

    const canvas = await html2canvas(card, {
      scale: DISPLAY_CARD_CAPTURE_SCALE,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: DISPLAY_CARD_WIDTH_PX,
      height: DISPLAY_CARD_HEIGHT_PX,
      windowWidth: DISPLAY_CARD_WIDTH_PX,
      windowHeight: DISPLAY_CARD_HEIGHT_PX,
    });
    assertCanvasHasPixels(canvas);
    return canvas;
  } finally {
    mount.dispose();
  }
}

/**
 * Wraps a preview bitmap in a single-page PDF (image only, no text layer).
 * @param {HTMLCanvasElement} canvas
 */
export function displayCardCanvasToPdfBlob(canvas) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [DISPLAY_CARD_WIDTH_PX, DISPLAY_CARD_HEIGHT_PX],
    compress: true,
  });
  const dataUrl = canvas.toDataURL('image/png');
  pdf.addImage(
    dataUrl,
    'PNG',
    0,
    0,
    DISPLAY_CARD_WIDTH_PX,
    DISPLAY_CARD_HEIGHT_PX,
    undefined,
    'FAST'
  );
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
