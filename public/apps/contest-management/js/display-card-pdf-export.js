// public/apps/contest-management/js/display-card-pdf-export.js
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { zipSync } from 'fflate';
import {
  buildDisplayCardPreviewState,
  renderDisplayCardPreview,
  DISPLAY_CARD_WIDTH_PX,
  DISPLAY_CARD_LAYOUT,
} from '../../contest-entry/js/display-card-preview.js';

const SCHEDULE_FILENAME_LABELS = {
  full_time: '全日制',
  part_time: '定時制',
};

const CARD_HEIGHT_PX = 450;

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

async function waitForDisplayCardReady(host) {
  const img = host.querySelector('.contest-display-card-bg');
  if (img instanceof HTMLImageElement) {
    if (!img.complete) {
      await new Promise((resolve, reject) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', reject, { once: true });
      }).catch(() => {});
    } else {
      await img.decode?.().catch(() => {});
    }
  }
  await document.fonts.ready;
}

/**
 * Renders one application display card to a PDF blob (800×450 px page).
 * @param {object} app
 * @param {typeof DISPLAY_CARD_LAYOUT} layout
 */
export async function renderDisplayCardPdfBlob(app, layout) {
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText =
    'position:fixed;left:-10000px;top:0;width:800px;pointer-events:none;opacity:0;';

  const host = document.createElement('div');
  host.className = 'contest-display-card-host';
  host.style.width = `${DISPLAY_CARD_WIDTH_PX}px`;
  container.appendChild(host);
  document.body.appendChild(container);

  try {
    const input = applicationToDisplayCardInput(app);
    const state = buildDisplayCardPreviewState(input, layout, {
      cardWidthPx: DISPLAY_CARD_WIDTH_PX,
    });
    renderDisplayCardPreview(host, state, { layout });
    await waitForDisplayCardReady(host);

    const card = host.querySelector('.contest-display-card');
    if (!(card instanceof HTMLElement)) {
      throw new Error('展示カードの描画に失敗しました');
    }

    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: DISPLAY_CARD_WIDTH_PX,
      height: CARD_HEIGHT_PX,
      windowWidth: DISPLAY_CARD_WIDTH_PX,
      windowHeight: CARD_HEIGHT_PX,
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [DISPLAY_CARD_WIDTH_PX, CARD_HEIGHT_PX],
      compress: true,
    });
    const dataUrl = canvas.toDataURL('image/png');
    pdf.addImage(dataUrl, 'PNG', 0, 0, DISPLAY_CARD_WIDTH_PX, CARD_HEIGHT_PX);

    return pdf.output('blob');
  } finally {
    container.remove();
  }
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
