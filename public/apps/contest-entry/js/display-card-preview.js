// public/apps/contest-entry/js/display-card-preview.js



/** @typedef {'full_time' | 'part_time' | 'tobe_branch'} MarkKey */

/** @typedef {'full_time' | 'part_time'} ScheduleType */



export const DISPLAY_CARD_TEMPLATE_URL =

  '/apps/contest-entry/images/display-card-template.png';



/** Overlay positions (% of card box). Tuned to display-card-template.{svg,png} 800×450. */

export const DISPLAY_CARD_LAYOUT = {

  marks: {

    full_time: { left: 20.5, top: 20, size: 7.5 },

    part_time: { left: 32, top: 20, size: 7.5 },

    tobe_branch: { left: 42.5, top: 20, size: 7.5 },

  },

  year: { left: 58.5, top: 19.2, width: 4, fontSize: 16 },

  classGroup: { left: 66, top: 19.2, width: 6, fontSize: 16 },

  name: { left: 74, top: 19.2, width: 22, fontSize: 16 },

  title: { left: 22, top: 29.2, width: 74, fontSize: 15, maxLines: 1 },

  comment: { left: 22, top: 37, width: 74, fontSize: 13, lineHeight: 1.52, maxLines: 6 },

};

/** Upper bound for comment.maxLines (editable in layout admin). */
export const DISPLAY_CARD_COMMENT_LINES_CAP = 12;

export const DISPLAY_CARD_WIDTH_PX = 800;

export const DISPLAY_CARD_HEIGHT_PX = 450;

/** html2canvas supersampling at design size 800×450 (bitmap = design × this). */
export const DISPLAY_CARD_CAPTURE_SCALE = 2;

/** @type {WeakMap<HTMLElement, HTMLCanvasElement>} */
const displayCardHostRasterCanvas = new WeakMap();

/** @type {WeakMap<HTMLElement, string>} */
const displayCardHostRasterObjectUrls = new WeakMap();

/** @type {number} */
let displayCardPreviewSyncGeneration = 0;

function cloneDisplayCardCanvas(canvas) {
  const copy = document.createElement('canvas');
  copy.width = canvas.width;
  copy.height = canvas.height;
  const ctx = copy.getContext('2d');
  if (!ctx) throw new Error('展示カード画像の複製に失敗しました');
  ctx.drawImage(canvas, 0, 0);
  return copy;
}

function revokeDisplayCardHostRasterObjectUrl(host) {
  const prev = displayCardHostRasterObjectUrls.get(host);
  if (prev) {
    URL.revokeObjectURL(prev);
    displayCardHostRasterObjectUrls.delete(host);
  }
}

/** Returns the latest html2canvas bitmap shown in the preview host (tests / PDF download). */
export function getDisplayCardRasterCanvas(host) {
  if (!(host instanceof HTMLElement)) return null;
  return displayCardHostRasterCanvas.get(host) ?? null;
}

/** Slight shrink so glyphs stay inside the line box (font metrics vs. 1em estimate). */
const COMMENT_LINE_FIT_MARGIN = 0.97;

/**
 * Preview width (px) for comment wrap — matches the scaled width shown in the aside.
 * @param {HTMLElement | null | undefined} host
 */
export function resolveDisplayCardPreviewWidthPx(host) {
  if (!(host instanceof HTMLElement)) return DISPLAY_CARD_WIDTH_PX;
  const w = host.clientWidth;
  if (Number.isFinite(w) && w >= 80) {
    return Math.min(w, DISPLAY_CARD_WIDTH_PX);
  }
  const card = host.querySelector('.contest-display-card');
  const el = card instanceof HTMLElement ? card : host;
  const measured = el.getBoundingClientRect().width;
  return Number.isFinite(measured) && measured >= 80 ? measured : DISPLAY_CARD_WIDTH_PX;
}

/**
 * Width (px) of the card on screen — use for line-break math (not the 800px template constant).
 * @param {HTMLElement | null | undefined} host
 */
export function measureDisplayCardHostWidthPx(host) {
  return resolveDisplayCardPreviewWidthPx(host);
}

/** @param {HTMLElement} host */
function getDisplayCardFitShell(host) {
  const shell = host.querySelector('.contest-display-card-fit-shell');
  return shell instanceof HTMLElement ? shell : null;
}

/** @param {HTMLElement} host */
function getDisplayCardScaleWrap(host) {
  const wrap = host.querySelector('.contest-display-card-scale-wrap');
  return wrap instanceof HTMLElement ? wrap : null;
}

/** @param {HTMLElement} host */
function forEachDisplayCardCaptureAncestor(host, fn) {
  let el = host.parentElement;
  while (el instanceof HTMLElement) {
    fn(el);
    if (el.classList.contains('modal') || el.id === 'admin-section') break;
    el = el.parentElement;
  }
}

/** Prevents modal preview wrap from clipping the 800×450 card during html2canvas. */
function prepareDisplayCardCaptureAncestors(host) {
  forEachDisplayCardCaptureAncestor(host, (el) => {
    if (el.dataset.displayCardCaptureAncestorOverflow === undefined) {
      el.dataset.displayCardCaptureAncestorOverflow = el.style.overflow;
    }
    el.style.overflow = 'visible';
  });
}

/** @param {HTMLElement} host */
function restoreDisplayCardCaptureAncestors(host) {
  forEachDisplayCardCaptureAncestor(host, (el) => {
    if (el.dataset.displayCardCaptureAncestorOverflow !== undefined) {
      el.style.overflow = el.dataset.displayCardCaptureAncestorOverflow;
      delete el.dataset.displayCardCaptureAncestorOverflow;
    }
  });
}

/** Clears inline fit styles applied by fitDisplayCardPreviewToHost. */
function resetDisplayCardPreviewFit(host) {
  const shell = getDisplayCardFitShell(host);
  if (shell) {
    shell.style.width = '';
    shell.style.height = '';
    shell.style.maxWidth = '';
    shell.style.overflow = '';
  }
  const scaleWrap = getDisplayCardScaleWrap(host);
  if (scaleWrap) {
    scaleWrap.style.width = '';
    scaleWrap.style.height = '';
    scaleWrap.style.maxWidth = '';
    scaleWrap.style.overflow = '';
  }
  const card = host.querySelector('.contest-display-card');
  if (!(card instanceof HTMLElement)) return;
  card.classList.remove('contest-display-card--fitted');
  card.style.width = '';
  card.style.height = '';
  card.style.aspectRatio = '';
  card.style.maxWidth = '';
  card.style.transform = '';
  card.style.transformOrigin = '';
  host.style.height = '';
  host.style.overflow = '';
}

/**
 * Scales the 800×450 design canvas so the full card stays inside the preview host.
 * @param {HTMLElement | null | undefined} host
 */
export function fitDisplayCardPreviewToHost(host) {
  if (!(host instanceof HTMLElement)) return;
  const shell = getDisplayCardFitShell(host);
  const card = host.querySelector('.contest-display-card');
  if (!(card instanceof HTMLElement)) return;
  if (card.classList.contains('contest-display-card--editor')) {
    resetDisplayCardPreviewFit(host);
    return;
  }

  const available = host.clientWidth;
  if (!Number.isFinite(available) || available < 40) return;

  const scale = Math.min(1, available / DISPLAY_CARD_WIDTH_PX);
  const fittedWidth = DISPLAY_CARD_WIDTH_PX * scale;
  const fittedHeight = DISPLAY_CARD_HEIGHT_PX * scale;
  card.classList.add('contest-display-card--fitted');
  card.style.width = `${DISPLAY_CARD_WIDTH_PX}px`;
  card.style.height = `${DISPLAY_CARD_HEIGHT_PX}px`;
  card.style.aspectRatio = 'auto';
  card.style.maxWidth = 'none';
  card.style.transform = scale < 1 ? `scale(${scale})` : 'none';
  card.style.transformOrigin = 'top left';
  const scaleWrap = getDisplayCardScaleWrap(host);
  if (scaleWrap) {
    scaleWrap.style.width = `${fittedWidth}px`;
    scaleWrap.style.maxWidth = '100%';
    scaleWrap.style.height = `${fittedHeight}px`;
    scaleWrap.style.overflow = 'hidden';
  }
  if (shell) {
    shell.style.width = '100%';
    shell.style.maxWidth = '100%';
    shell.style.height = `${fittedHeight}px`;
    shell.style.overflow = 'visible';
    host.style.height = '';
    host.style.overflow = '';
  } else {
    host.style.height = `${fittedHeight}px`;
    host.style.overflow = 'hidden';
  }
}

/** Font stack used on the display card overlay (keep PDF capture in sync). */
export const DISPLAY_CARD_PREVIEW_FONT_FAMILY =
  "'BIZ UDPGothic', 'Yu Gothic UI', 'Yu Gothic', 'Hiragino Sans', Meiryo, sans-serif";

/**
 * Off-screen mount for raster capture (must stay visible to html2canvas; no opacity:0).
 * @param {number} [layoutWidth]
 */
export function mountDisplayCardPreviewCaptureHost(layoutWidth = DISPLAY_CARD_WIDTH_PX) {
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.dataset.displayCardCapture = 'true';
  // Off-screen but painted — visibility:hidden breaks html2canvas text overlay capture.
  container.style.cssText = `position:fixed;left:0;top:0;width:${layoutWidth}px;height:${DISPLAY_CARD_HEIGHT_PX}px;transform:translateX(-120vw);pointer-events:none;z-index:-1;overflow:visible;opacity:1;visibility:visible;`;
  const host = document.createElement('div');
  host.className = 'contest-display-card-host';
  host.style.width = `${layoutWidth}px`;
  container.appendChild(host);
  document.body.appendChild(container);
  return {
    host,
    dispose() {
      container.remove();
    },
  };
}

/** Pins card to design size (800×450) before html2canvas — same geometry as full-size preview. */
export function prepareDisplayCardElementForRasterCapture(card) {
  if (!(card instanceof HTMLElement)) return;
  card.classList.remove('contest-display-card--fitted');
  card.style.width = `${DISPLAY_CARD_WIDTH_PX}px`;
  card.style.height = `${DISPLAY_CARD_HEIGHT_PX}px`;
  card.style.aspectRatio = 'auto';
  card.style.maxWidth = 'none';
  card.style.transform = 'none';
  card.style.transformOrigin = 'top left';
  card.style.boxShadow = 'none';
}

/**
 * Legacy: expands host to 800×450 and clears CSS scale (superseded by WYSIWYG scale-wrap capture).
 * @param {HTMLElement} host
 */
export function prepareDisplayCardHostForRasterCapture(host) {
  if (!(host instanceof HTMLElement)) return;
  const card = host.querySelector('.contest-display-card');
  if (!(card instanceof HTMLElement)) return;

  if (!host.dataset.displayCardCapturePrevOverflow) {
    host.dataset.displayCardCapturePrevOverflow = host.style.overflow;
    host.dataset.displayCardCapturePrevHeight = host.style.height;
  }

  const shell = getDisplayCardFitShell(host);
  if (shell) {
    shell.style.width = `${DISPLAY_CARD_WIDTH_PX}px`;
    shell.style.maxWidth = 'none';
    shell.style.height = `${DISPLAY_CARD_HEIGHT_PX}px`;
    shell.style.overflow = 'visible';
  }
  const scaleWrap = getDisplayCardScaleWrap(host);
  if (scaleWrap) {
    scaleWrap.style.width = `${DISPLAY_CARD_WIDTH_PX}px`;
    scaleWrap.style.maxWidth = 'none';
    scaleWrap.style.height = `${DISPLAY_CARD_HEIGHT_PX}px`;
    scaleWrap.style.overflow = 'visible';
  }
  host.style.height = `${DISPLAY_CARD_HEIGHT_PX}px`;
  host.style.overflow = 'visible';

  prepareDisplayCardElementForRasterCapture(card);
  card.classList.add('contest-display-card--raster');
  prepareDisplayCardCaptureAncestors(host);
}

/** Restores host/card after raster capture (re-applies fitted preview). */
export function restoreDisplayCardHostAfterRasterCapture(host) {
  if (!(host instanceof HTMLElement)) return;
  const card = host.querySelector('.contest-display-card');
  if (card instanceof HTMLElement) {
    card.classList.remove('contest-display-card--raster');
  }
  if (host.dataset.displayCardCapturePrevOverflow !== undefined) {
    host.style.overflow = host.dataset.displayCardCapturePrevOverflow ?? '';
    host.style.height = host.dataset.displayCardCapturePrevHeight ?? '';
    delete host.dataset.displayCardCapturePrevOverflow;
    delete host.dataset.displayCardCapturePrevHeight;
  }
  restoreDisplayCardCaptureAncestors(host);
  resetDisplayCardPreviewFit(host);
  fitDisplayCardPreviewToHost(host);
}

/**
 * Pixel size of the fitted preview box (what the user sees), before html2canvas scale.
 * @param {HTMLElement} host
 */
export function measureDisplayCardVisualCaptureSize(host) {
  if (!(host instanceof HTMLElement)) {
    return { width: DISPLAY_CARD_WIDTH_PX, height: DISPLAY_CARD_HEIGHT_PX };
  }
  fitDisplayCardPreviewToHost(host);
  const scaleWrap = getDisplayCardScaleWrap(host);
  const card = host.querySelector('.contest-display-card');
  const target =
    scaleWrap instanceof HTMLElement
      ? scaleWrap
      : card instanceof HTMLElement
        ? card
        : host;
  const rect = target.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  return { width, height };
}

/**
 * html2canvas on an in-DOM 800×450 card (--raster fill). Caller must prepare/restore host fit state.
 * @param {HTMLElement} host
 * @param {typeof DISPLAY_CARD_LAYOUT} [layout]
 */
async function rasterizeDisplayCardHostDom(host, layout = activeDisplayCardLayout) {
  const card = host.querySelector('.contest-display-card');
  if (!(card instanceof HTMLElement)) {
    throw new Error('展示カードの描画に失敗しました');
  }
  await waitForDisplayCardPreviewAssets(host, layout);
  prepareDisplayCardHostForRasterCapture(host);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const { default: html2canvas } = await import('html2canvas');
  try {
    return await html2canvas(card, {
      scale: DISPLAY_CARD_CAPTURE_SCALE,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: DISPLAY_CARD_WIDTH_PX,
      height: DISPLAY_CARD_HEIGHT_PX,
    });
  } finally {
    restoreDisplayCardHostAfterRasterCapture(host);
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  }
}

/**
 * Off-screen DOM → bitmap at design size (single source for preview, layout editor, PDF).
 * @param {object} state
 * @param {{ layout?: typeof DISPLAY_CARD_LAYOUT; editorLinePlots?: boolean }} [options]
 */
export async function rasterizeDisplayCardState(state, options = {}) {
  const layout = options.layout ?? activeDisplayCardLayout;
  const mount = mountDisplayCardPreviewCaptureHost(DISPLAY_CARD_WIDTH_PX);
  try {
    renderDisplayCardPreview(mount.host, state, { ...options, layout });
    return await rasterizeDisplayCardHostDom(mount.host, layout);
  } finally {
    mount.dispose();
  }
}

/**
 * Replaces preview host contents with the html2canvas bitmap (scaled to fit like before).
 * @param {HTMLElement} host
 * @param {object} state
 * @param {{ layout?: typeof DISPLAY_CARD_LAYOUT; editorLinePlots?: boolean }} [options]
 */
export async function renderDisplayCardRasterPreview(host, state, options = {}) {
  if (!(host instanceof HTMLElement)) return;
  const layout = options.layout ?? activeDisplayCardLayout;
  const canvas = await rasterizeDisplayCardState(state, { ...options, layout });
  displayCardHostRasterCanvas.set(host, canvas);

  revokeDisplayCardHostRasterObjectUrl(host);
  const objectUrl = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('展示カードのプレビュー画像化に失敗しました'));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
  displayCardHostRasterObjectUrls.set(host, objectUrl);

  const editorClass = options.editorLinePlots ? ' contest-display-card--editor' : '';
  const editorOverlay = options.editorLinePlots
    ? '<div class="contest-display-card-overlay contest-display-card-overlay--editor-tools" aria-hidden="true"></div>'
    : '';

  host.innerHTML = `
    <div class="contest-display-card-fit-shell">
    <div class="contest-display-card-scale-wrap">
    <div class="contest-display-card contest-display-card--raster-output${editorClass}" data-testid="display-card-root">
      <img
        class="contest-display-card-raster"
        data-testid="display-card-raster"
        src="${objectUrl}"
        alt="展示カードプレビュー"
        width="${DISPLAY_CARD_WIDTH_PX}"
        height="${DISPLAY_CARD_HEIGHT_PX}"
        decoding="async"
      />
      ${editorOverlay}
    </div>
    </div>
    </div>
  `;

  fitDisplayCardPreviewToHost(host);
}

/**
 * Same bitmap as on-screen raster preview (or re-rasterize legacy DOM host).
 * @param {HTMLElement} host
 * @param {typeof DISPLAY_CARD_LAYOUT} [layout]
 */
export async function captureDisplayCardForExport(host, layout = activeDisplayCardLayout) {
  if (!(host instanceof HTMLElement)) {
    throw new Error('展示カードのプレビュー領域が見つかりません');
  }
  const cached = displayCardHostRasterCanvas.get(host);
  if (cached) {
    return cloneDisplayCardCanvas(cached);
  }
  if (host.querySelector('.contest-display-card-bg')) {
    return rasterizeDisplayCardHostDom(host, layout);
  }
  throw new Error('展示カードのプレビューが未生成です');
}

/**
 * Waits for template image + overlay fonts before capturing preview as bitmap.
 * @param {HTMLElement} host
 * @param {typeof DISPLAY_CARD_LAYOUT} [layout]
 */
export async function waitForDisplayCardPreviewAssets(host, layout = activeDisplayCardLayout) {
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

  const fontSizes = new Set(
    [
      layout.year?.fontSize,
      layout.classGroup?.fontSize,
      layout.name?.fontSize,
      layout.title?.fontSize,
      layout.comment?.fontSize,
    ].filter((n) => Number.isFinite(n))
  );
  for (const size of fontSizes) {
    await document.fonts.load(`${size}px "BIZ UDPGothic"`).catch(() => {});
  }
  await Promise.race([
    document.fonts.ready,
    new Promise((resolve) => {
      setTimeout(resolve, 5000);
    }),
  ]);
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

/** Comment line plot count from layout (＋ / ┃ handle count in admin editor). */

export function getCommentLinePlotCount(commentLayout) {

  const cap = DISPLAY_CARD_COMMENT_LINES_CAP;

  const fallback = DISPLAY_CARD_LAYOUT.comment.maxLines;

  const n = Number(commentLayout?.maxLines);

  if (!Number.isFinite(n)) {

    return Math.min(cap, Math.max(1, Math.round(fallback)));

  }

  return Math.min(cap, Math.max(1, Math.round(n)));

}



/** @type {typeof DISPLAY_CARD_LAYOUT} */

let activeDisplayCardLayout = structuredClone(DISPLAY_CARD_LAYOUT);



/** Returns the layout used for preview rendering. */

export function getDisplayCardLayout() {

  return activeDisplayCardLayout;

}



/**

 * Merges server/admin layout onto defaults and applies it for preview.

 * @param {Partial<typeof DISPLAY_CARD_LAYOUT> | null | undefined} partial

 */

export function setDisplayCardLayout(partial) {

  if (!partial) {

    activeDisplayCardLayout = structuredClone(DISPLAY_CARD_LAYOUT);

    return;

  }

  const merged = structuredClone(DISPLAY_CARD_LAYOUT);

  if (partial.marks) {

    for (const key of Object.keys(merged.marks)) {

      if (partial.marks[key]) Object.assign(merged.marks[key], partial.marks[key]);

    }

  }

  for (const field of ['year', 'classGroup', 'name', 'title', 'comment']) {

    if (partial[field]) Object.assign(merged[field], partial[field]);

  }

  activeDisplayCardLayout = merged;

}



const COMMENT_CHARS_PER_LINE = 38;



/**

 * Splits homeroom into year / class for full-time (e.g. 301 → 3 / 1).

 * @param {ScheduleType} scheduleType

 * @param {string} homeroom

 */

export function parseHomeroomForDisplayCard(scheduleType, homeroom) {

  const trimmed = homeroom.trim();

  if (scheduleType === 'full_time' && /^\d{3}$/.test(trimmed)) {

    const year = trimmed.charAt(0);

    const classGroup = String(parseInt(trimmed.slice(1), 10));

    return { year, classGroup };

  }

  if (scheduleType === 'part_time') {

    const partTimeMatch = trimmed.match(/^(\d)0(\d+)$/);

    if (partTimeMatch) {

      return {

        year: partTimeMatch[1],

        classGroup: String(parseInt(partTimeMatch[2], 10)),

      };

    }

  }

  return { year: '', classGroup: trimmed };

}



/** Whether comment lines use per-line absolute placement. */

export function usesPerLineCommentPlacement(commentLayout) {

  return (

    (commentLayout.lineTops?.length ?? 0) > 0 ||

    (commentLayout.lineLefts?.length ?? 0) > 0 ||

    (commentLayout.lineRights?.length ?? 0) > 0

  );

}



/** Left (% of card) for a comment line index. */

export function commentLineLeftPercent(commentLayout, lineIndex) {

  const lefts = commentLayout.lineLefts ?? [];

  if (lefts[lineIndex] !== undefined && lefts[lineIndex] !== null) {

    return lefts[lineIndex];

  }

  return commentLayout.left;

}



/** Right edge (% of card) for a comment line — controls wrap width. */

export function commentLineRightPercent(commentLayout, lineIndex) {

  const rights = commentLayout.lineRights ?? [];

  if (rights[lineIndex] !== undefined && rights[lineIndex] !== null) {

    return rights[lineIndex];

  }

  return Math.min(100, commentLayout.left + commentLayout.width);

}



/** Width (% of card) for a placed comment line. */

export function commentLineWidthPercent(commentLayout, lineIndex) {

  const left = commentLineLeftPercent(commentLayout, lineIndex);

  const right = commentLineRightPercent(commentLayout, lineIndex);

  return Math.max(1, right - left);

}



/**

 * Approximate character capacity for a comment line slot (overflow moves to the next plot).

 * @param {typeof DISPLAY_CARD_LAYOUT.comment} commentLayout

 * @param {number} lineIndex

 * @param {number} [cardWidthPx]

 */

/** Width units for one glyph (full-width = 1, half-width ≈ 0.5). */

export function displayCardCharWidthUnits(ch) {

  if (!ch) return 0;

  const code = ch.codePointAt(0) ?? 0;

  if (code <= 0x007f) return 0.5;

  if (code >= 0xff61 && code <= 0xff9f) return 0.5;

  return 1;

}



/** Sum of display width units for a string. */

export function displayCardTextWidthUnits(text) {

  let units = 0;

  for (const ch of String(text ?? '')) units += displayCardCharWidthUnits(ch);

  return units;

}



/** Max width units that fit in a comment line plot (matches CSS nowrap at font-size). */

export function commentLineCapacityUnits(commentLayout, lineIndex, cardWidthPx = DISPLAY_CARD_WIDTH_PX) {

  const widthPct = commentLineWidthPercent(commentLayout, lineIndex);

  const widthPx = (widthPct / 100) * cardWidthPx;

  const fontPx = commentLayout.fontSize ?? 13;

  return Math.max(0.5, (widthPx / fontPx) * COMMENT_LINE_FIT_MARGIN);

}



/** @deprecated Use commentLineCapacityUnits; kept for tests comparing full-width char counts. */

export function commentLineCharsCapacity(commentLayout, lineIndex, cardWidthPx = DISPLAY_CARD_WIDTH_PX) {

  return Math.max(1, Math.floor(commentLineCapacityUnits(commentLayout, lineIndex, cardWidthPx)));

}



/**

 * Splits one chunk at width-unit capacity; remainder goes to the next line plot.

 * @param {string} rest

 * @param {number} capUnits

 * @param {boolean} softBreak

 */

function splitCommentChunkAtCapacity(rest, capUnits, softBreak) {

  if (displayCardTextWidthUnits(rest) <= capUnits) {

    return { line: rest, rest: '' };

  }

  let units = 0;

  let breakAt = 0;

  for (let i = 0; i < rest.length; i += 1) {

    const cu = displayCardCharWidthUnits(rest[i]);

    if (units + cu > capUnits && i > 0) {

      breakAt = i;

      break;

    }

    units += cu;

    breakAt = i + 1;

  }

  if (breakAt <= 0) breakAt = 1;

  if (softBreak && breakAt > 1) {

    const slice = rest.slice(0, breakAt);

    const lastSpace = slice.lastIndexOf(' ');

    const lastPunct = Math.max(slice.lastIndexOf('、'), slice.lastIndexOf('。'));

    const minBreak = Math.max(1, Math.floor(breakAt * 0.35));

    if (lastPunct >= minBreak) breakAt = lastPunct + 1;

    else if (lastSpace >= minBreak) breakAt = lastSpace + 1;

  }

  return { line: rest.slice(0, breakAt), rest: rest.slice(breakAt) };

}



/** Legacy fixed character count (no layout / width units). */

function splitCommentChunkAtCharCount(rest, cap, softBreak) {

  if (rest.length <= cap) {

    return { line: rest, rest: '' };

  }

  let breakAt = cap;

  if (softBreak) {

    const slice = rest.slice(0, cap + 1);

    const lastSpace = slice.lastIndexOf(' ');

    const lastPunct = Math.max(slice.lastIndexOf('、'), slice.lastIndexOf('。'));

    if (lastPunct > cap * 0.4) breakAt = lastPunct + 1;

    else if (lastSpace > cap * 0.35) breakAt = lastSpace + 1;

  }

  return { line: rest.slice(0, breakAt), rest: rest.slice(breakAt) };

}



/**

 * Distributes comment text across line plots (right edge sets capacity; overflow goes to the next line).

 * @param {string} text

 * @param {number} maxLines

 * @param {number | typeof DISPLAY_CARD_LAYOUT.comment} [charsPerLineOrLayout]

 * @param {number} [cardWidthPx]

 */

export function wrapDisplayCardComment(
  text,
  maxLines,
  charsPerLineOrLayout = COMMENT_CHARS_PER_LINE,
  cardWidthPx = DISPLAY_CARD_WIDTH_PX
) {

  const normalized = String(text ?? '')

    .replace(/\r\n/g, '\n')

    .trim();

  if (!normalized) return [];



  const useLayout =

    charsPerLineOrLayout !== null &&

    typeof charsPerLineOrLayout === 'object' &&

    !Array.isArray(charsPerLineOrLayout);



  const capacityForIndex = (lineIndex) => {

    if (useLayout) return commentLineCapacityUnits(charsPerLineOrLayout, lineIndex, cardWidthPx);

    const n =

      typeof charsPerLineOrLayout === 'number' ? charsPerLineOrLayout : COMMENT_CHARS_PER_LINE;

    return n;

  };

  const softBreak = !useLayout;



  const lines = [];

  const paragraphs = normalized.split('\n');

  for (const para of paragraphs) {

    let rest = para;

    while (rest.length > 0 && lines.length < maxLines) {

      const cap = capacityForIndex(lines.length);

      const { line, rest: nextRest } = useLayout

        ? splitCommentChunkAtCapacity(rest, cap, softBreak)

        : splitCommentChunkAtCharCount(rest, cap, softBreak);

      if (line.length > 0) lines.push(line);

      rest = nextRest;

    }

    if (lines.length >= maxLines) break;

  }

  if (lines.length > maxLines) lines.length = maxLines;

  const joinedLen = normalized.replace(/\n/g, '').length;

  const used = lines.join('').length;

  if (joinedLen > used && lines.length >= maxLines && lines.length > 0) {

    const last = lines[lines.length - 1];

    const capUnits = capacityForIndex(lines.length - 1);

    const lastUnits = displayCardTextWidthUnits(last);

    lines[lines.length - 1] =

      lastUnits >= capUnits - 0.5 ? `${last.slice(0, -1)}…` : `${last}…`;

  }

  return lines;

}



/**

 * @param {{

 *   scheduleType: ScheduleType;

 *   homeroom: string;

 *   studentName: string;

 *   title: string;

 *   impressions: string;

 * }} input

 * @param {typeof DISPLAY_CARD_LAYOUT | null | undefined} [layoutOverride]

 * @param {{ cardWidthPx?: number }} [options]

 */

export function buildDisplayCardPreviewState(input, layoutOverride, options = {}) {

  const { year, classGroup } = parseHomeroomForDisplayCard(

    input.scheduleType,

    input.homeroom

  );

  const layout = layoutOverride ?? activeDisplayCardLayout;

  const cardWidthPx = options.cardWidthPx ?? DISPLAY_CARD_WIDTH_PX;

  return {

    scheduleType: input.scheduleType,

    year,

    classGroup,

    studentName: input.studentName.trim(),

    title: input.title.trim(),

    commentLines: wrapDisplayCardComment(

      input.impressions,

      getCommentLinePlotCount(layout.comment),

      layout.comment,

      cardWidthPx

    ),

  };

}



function pct(value) {

  return `${value}%`;

}



/**

 * Default top (% of card) for a comment line index when lineTops is not set.

 * @param {typeof DISPLAY_CARD_LAYOUT.comment} commentLayout

 * @param {number} lineIndex

 */

export function defaultCommentLineTopPercent(commentLayout, lineIndex) {

  const lineHeightEm = commentLayout.lineHeight ?? 1.52;

  const fontPx = commentLayout.fontSize ?? 13;

  const cardHeight = 450;

  const lineStepPercent = ((fontPx * lineHeightEm) / cardHeight) * 100;

  return commentLayout.top + lineIndex * lineStepPercent;

}



/**

 * Renders preview markup into host element.

 * @param {HTMLElement | null} host

 * @param {ReturnType<typeof buildDisplayCardPreviewState>} state

 * @param {{ layout?: typeof DISPLAY_CARD_LAYOUT; editorLinePlots?: boolean }} [options]

 */

export function renderDisplayCardPreview(host, state, options = {}) {

  if (!host) return;

  const layout = options.layout ?? activeDisplayCardLayout;

  const plotCount = getCommentLinePlotCount(layout.comment);

  const commentLinesToRender = options.editorLinePlots

    ? Array.from({ length: plotCount }, (_, i) => state.commentLines[i] ?? '')

    : state.commentLines;

  const activeMark =

    state.scheduleType === 'part_time' ? 'part_time' : 'full_time';



  const markHtml = ['full_time', 'part_time', 'tobe_branch']

    .map((key) => {

      const m = layout.marks[key];

      const active = key === activeMark;

      return `<span

        class="contest-display-card-mark${active ? ' is-active' : ''}"

        data-testid="display-card-mark-${key}"

        data-layout-key="marks.${key}"

        style="left:${pct(m.left)};top:${pct(m.top)};width:${pct(m.size)};height:${pct(m.size)}"

        aria-hidden="true"

      ></span>`;

    })

    .join('');



  const fieldStyle = (field) =>

    `left:${pct(field.left)};top:${pct(field.top)};width:${pct(field.width)};font-size:${field.fontSize}px`;



  const lineTops = layout.comment.lineTops ?? [];

  const usePerLineTop =

    Boolean(options.editorLinePlots) || usesPerLineCommentPlacement(layout.comment);



  const commentInnerHtml = commentLinesToRender

    .map((line, i) => {

      const emptyClass = options.editorLinePlots && !line ? ' contest-display-card-comment-line--empty' : '';

      if (usePerLineTop) {

        const absoluteTop = lineTops[i] ?? defaultCommentLineTopPercent(layout.comment, i);

        const absoluteLeft = commentLineLeftPercent(layout.comment, i);

        const widthPct = commentLineWidthPercent(layout.comment, i);

        const lineStyle = `position:absolute;left:${pct(absoluteLeft)};top:${pct(

          absoluteTop

        )};width:${pct(widthPct)};font-size:${layout.comment.fontSize}px;line-height:${layout.comment.lineHeight};white-space:nowrap;overflow:hidden`;

        return `<div class="contest-display-card-comment-line contest-display-card-comment-line--placed${emptyClass}" data-testid="display-card-comment-line-${i}" data-layout-key="comment.line.${i}" style="${lineStyle}">${escapeText(

          line

        )}</div>`;

      }

      return `<div class="contest-display-card-comment-line${emptyClass}" data-testid="display-card-comment-line-${i}" data-layout-key="comment.line.${i}" style="white-space:nowrap;overflow:hidden">${escapeText(

        line

      )}</div>`;

    })

    .join('');



  const commentBlockHtml = usePerLineTop

    ? commentInnerHtml

    : `<div

          class="contest-display-card-comment"

          data-testid="display-card-comment"

          data-layout-key="comment"

          style="left:${pct(layout.comment.left)};top:${pct(

            layout.comment.top

          )};width:${pct(layout.comment.width)};font-size:${layout.comment.fontSize}px;line-height:${layout.comment.lineHeight}"

        >${commentInnerHtml}</div>`;



  host.innerHTML = `

    <div class="contest-display-card-fit-shell">

    <div class="contest-display-card-scale-wrap">

    <div class="contest-display-card" data-testid="display-card-root">

      <img

        class="contest-display-card-bg"

        src="${DISPLAY_CARD_TEMPLATE_URL}"

        alt=""

        width="${DISPLAY_CARD_WIDTH_PX}"

        height="${DISPLAY_CARD_HEIGHT_PX}"

        decoding="async"

      />

      <div class="contest-display-card-overlay">

        ${markHtml}

        <span class="contest-display-card-field contest-display-card-year" data-testid="display-card-year" data-layout-key="year" style="${fieldStyle(

          layout.year

        )}">${escapeText(state.year)}</span>

        <span class="contest-display-card-field contest-display-card-class" data-testid="display-card-class" data-layout-key="classGroup" style="${fieldStyle(

          layout.classGroup

        )}">${escapeText(state.classGroup)}</span>

        <span class="contest-display-card-field contest-display-card-name" data-testid="display-card-name" data-layout-key="name" style="${fieldStyle(

          layout.name

        )}">${escapeText(state.studentName)}</span>

        <span class="contest-display-card-field contest-display-card-title" data-testid="display-card-title" data-layout-key="title" style="${fieldStyle(

          layout.title

        )}">${escapeText(state.title)}</span>

        ${commentBlockHtml}

      </div>

    </div>

    </div>

    </div>

  `;

}



function escapeText(text) {

  return String(text)

    .replace(/&/g, '&amp;')

    .replace(/</g, '&lt;')

    .replace(/>/g, '&gt;');

}



/**

 * Reads the application form and updates the preview host.

 * @param {HTMLElement | null} host

 * @param {HTMLFormElement | null} form

 * @param {ScheduleType} scheduleType

 * @param {{ homeroom: string; student_name: string }[]} participants

 */

export function syncDisplayCardPreviewFromForm(host, form, scheduleType, participants) {

  if (!host || !form) return;

  const primary = participants[0] ?? { homeroom: '', student_name: '' };

  const titleInput = form.querySelector('#title');

  const impressionsInput = form.querySelector('#impressions');

  const state = buildDisplayCardPreviewState(

    {

      scheduleType,

      homeroom: primary.homeroom ?? '',

      studentName: primary.student_name ?? '',

      title: titleInput instanceof HTMLInputElement ? titleInput.value : '',

      impressions:

        impressionsInput instanceof HTMLTextAreaElement ? impressionsInput.value : '',

    },

    undefined,

    { cardWidthPx: DISPLAY_CARD_WIDTH_PX }

  );

  const generation = ++displayCardPreviewSyncGeneration;
  void (async () => {
    try {
      await renderDisplayCardRasterPreview(host, state);
      if (generation !== displayCardPreviewSyncGeneration) return;
      fitDisplayCardPreviewToHost(host);
    } catch (err) {
      console.error('展示カードプレビューの更新に失敗しました', err);
    }
  })();
}

let displayCardPreviewResizeHost = null;

/** Re-fits preview when the aside column is resized. */
export function bindDisplayCardPreviewHostResize(host, onResize) {
  if (!(host instanceof HTMLElement)) return;
  if (displayCardPreviewResizeHost === host) return;
  displayCardPreviewResizeHost = host;
  const observer = new ResizeObserver(() => {
    onResize?.();
  });
  observer.observe(host);
}


