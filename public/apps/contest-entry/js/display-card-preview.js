// public/apps/contest-entry/js/display-card-preview.js

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
  return { year: '', classGroup: trimmed };
}

/**
 * Wraps text into lines for the comment ruled area.
 * @param {string} text
 * @param {number} maxLines
 * @param {number} charsPerLine
 */
export function wrapDisplayCardComment(text, maxLines, charsPerLine = COMMENT_CHARS_PER_LINE) {
  const normalized = String(text ?? '')
    .replace(/\r\n/g, '\n')
    .trim();
  if (!normalized) return [];

  const lines = [];
  const paragraphs = normalized.split('\n');
  for (const para of paragraphs) {
    let rest = para;
    while (rest.length > 0 && lines.length < maxLines) {
      if (rest.length <= charsPerLine) {
        lines.push(rest);
        rest = '';
        break;
      }
      let breakAt = charsPerLine;
      const slice = rest.slice(0, charsPerLine + 1);
      const lastSpace = slice.lastIndexOf(' ');
      const lastPunct = Math.max(slice.lastIndexOf('、'), slice.lastIndexOf('。'));
      if (lastPunct > charsPerLine * 0.4) breakAt = lastPunct + 1;
      else if (lastSpace > charsPerLine * 0.35) breakAt = lastSpace + 1;
      lines.push(rest.slice(0, breakAt).trimEnd());
      rest = rest.slice(breakAt).trimStart();
    }
    if (lines.length >= maxLines) break;
  }
  if (lines.length > maxLines) lines.length = maxLines;
  const joinedLen = normalized.replace(/\n/g, '').length;
  const used = lines.join('').length;
  if (joinedLen > used && lines.length > 0) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length >= charsPerLine - 1 ? `${last.slice(0, -1)}…` : `${last}…`;
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
  const layout = DISPLAY_CARD_LAYOUT;
  return {
    scheduleType: input.scheduleType,
    year,
    classGroup,
    studentName: input.studentName.trim(),
    title: input.title.trim(),
    commentLines: wrapDisplayCardComment(
      input.impressions,
      layout.comment.maxLines
    ),
  };
}

function pct(value) {
  return `${value}%`;
}

/**
 * Renders preview markup into host element.
 * @param {HTMLElement | null} host
 * @param {ReturnType<typeof buildDisplayCardPreviewState>} state
 */
export function renderDisplayCardPreview(host, state) {
  if (!host) return;
  const layout = DISPLAY_CARD_LAYOUT;
  const activeMark =
    state.scheduleType === 'part_time' ? 'part_time' : 'full_time';

  const markHtml = ['full_time', 'part_time', 'tobe_branch']
    .map((key) => {
      const m = layout.marks[key];
      const active = key === activeMark;
      return `<span
        class="contest-display-card-mark${active ? ' is-active' : ''}"
        data-testid="display-card-mark-${key}"
        style="left:${pct(m.left)};top:${pct(m.top)};width:${pct(m.size)};height:${pct(m.size)}"
        aria-hidden="true"
      ></span>`;
    })
    .join('');

  const fieldStyle = (field) =>
    `left:${pct(field.left)};top:${pct(field.top)};width:${pct(field.width)};font-size:${field.fontSize}px`;

  const commentHtml = state.commentLines
    .map(
      (line, i) =>
        `<div class="contest-display-card-comment-line" data-testid="display-card-comment-line-${i}">${escapeText(
          line
        )}</div>`
    )
    .join('');

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
        <span class="contest-display-card-field contest-display-card-year" data-testid="display-card-year" style="${fieldStyle(
          layout.year
        )}">${escapeText(state.year)}</span>
        <span class="contest-display-card-field contest-display-card-class" data-testid="display-card-class" style="${fieldStyle(
          layout.classGroup
        )}">${escapeText(state.classGroup)}</span>
        <span class="contest-display-card-field contest-display-card-name" data-testid="display-card-name" style="${fieldStyle(
          layout.name
        )}">${escapeText(state.studentName)}</span>
        <span class="contest-display-card-field contest-display-card-title" data-testid="display-card-title" style="${fieldStyle(
          layout.title
        )}">${escapeText(state.title)}</span>
        <div
          class="contest-display-card-comment"
          data-testid="display-card-comment"
          style="left:${pct(layout.comment.left)};top:${pct(
            layout.comment.top
          )};width:${pct(layout.comment.width)};font-size:${layout.comment.fontSize}px;line-height:${layout.comment.lineHeight}"
        >${commentHtml}</div>
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
