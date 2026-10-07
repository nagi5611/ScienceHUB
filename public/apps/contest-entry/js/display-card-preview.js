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

export function commentLineCharsCapacity(commentLayout, lineIndex, cardWidthPx = DISPLAY_CARD_WIDTH_PX) {

  const widthPct = commentLineWidthPercent(commentLayout, lineIndex);

  const widthPx = (widthPct / 100) * cardWidthPx;

  const fontPx = commentLayout.fontSize ?? 13;

  return Math.max(1, Math.floor(widthPx / (fontPx * 0.52)));

}



/**

 * Splits one chunk at capacity; remainder is kept for the next line plot (no in-line wrap).

 * @param {string} rest

 * @param {number} cap

 * @param {boolean} softBreak

 */

function splitCommentChunkAtCapacity(rest, cap, softBreak) {

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

 */

export function wrapDisplayCardComment(text, maxLines, charsPerLineOrLayout = COMMENT_CHARS_PER_LINE) {

  const normalized = String(text ?? '')

    .replace(/\r\n/g, '\n')

    .trim();

  if (!normalized) return [];



  const useLayout =

    charsPerLineOrLayout !== null &&

    typeof charsPerLineOrLayout === 'object' &&

    !Array.isArray(charsPerLineOrLayout);



  const capacityForIndex = (lineIndex) => {

    if (useLayout) return commentLineCharsCapacity(charsPerLineOrLayout, lineIndex);

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

      const { line, rest: nextRest } = splitCommentChunkAtCapacity(rest, cap, softBreak);

      if (line.length > 0) lines.push(line);

      rest = nextRest;

    }

    if (lines.length >= maxLines) break;

  }

  if (lines.length > maxLines) lines.length = maxLines;

  const joinedLen = normalized.replace(/\n/g, '').length;

  const used = lines.join('').length;

  if (joinedLen > used && lines.length > 0) {

    const last = lines[lines.length - 1];

    const cap = capacityForIndex(lines.length - 1);

    lines[lines.length - 1] = last.length >= cap - 1 ? `${last.slice(0, -1)}…` : `${last}…`;

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

 */

export function buildDisplayCardPreviewState(input) {

  const { year, classGroup } = parseHomeroomForDisplayCard(

    input.scheduleType,

    input.homeroom

  );

  const layout = activeDisplayCardLayout;

  return {

    scheduleType: input.scheduleType,

    year,

    classGroup,

    studentName: input.studentName.trim(),

    title: input.title.trim(),

    commentLines: wrapDisplayCardComment(

      input.impressions,

      layout.comment.maxLines,

      layout.comment

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

    <div class="contest-display-card" data-testid="display-card-root">

      <img

        class="contest-display-card-bg"

        src="${DISPLAY_CARD_TEMPLATE_URL}"

        width="800"

        height="450"

        alt=""

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

  const state = buildDisplayCardPreviewState({

    scheduleType,

    homeroom: primary.homeroom ?? '',

    studentName: primary.student_name ?? '',

    title: titleInput instanceof HTMLInputElement ? titleInput.value : '',

    impressions:

      impressionsInput instanceof HTMLTextAreaElement ? impressionsInput.value : '',

  });

  renderDisplayCardPreview(host, state);

}


