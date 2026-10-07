// public/apps/contest-management/js/display-card-layout-editor.js
import { apiRequest } from './api.js';
import {
  DISPLAY_CARD_LAYOUT,
  DISPLAY_CARD_COMMENT_LINES_CAP,
  buildDisplayCardPreviewState,
  commentLineLeftPercent,
  commentLineRightPercent,
  commentLineWidthPercent,
  defaultCommentLineTopPercent,
  getCommentLinePlotCount,
  renderDisplayCardPreview,
  setDisplayCardLayout,
} from '../../contest-entry/js/display-card-preview.js';
import { snapLayoutX, snapLayoutY } from '../../contest-entry/js/display-card-layout-snap.js';

const SAMPLE = {
  scheduleType: 'full_time',
  homeroom: '101',
  studentName: '山田太郎',
  title: 'テストタイトル',
  impressions:
    'テストコメント。造形にこだわって作りました。細部まで丁寧に仕上げています。ぜひご覧ください。',
};

const MARK_LABELS = {
  full_time: '全日制マーク',
  part_time: '定時制マーク',
  tobe_branch: 'TOBEマーク',
};

const FIELD_LABELS = {
  year: '学年',
  classGroup: '組',
  name: '氏名',
  title: '作品名',
  comment: 'コメント枠',
};

/** @type {typeof DISPLAY_CARD_LAYOUT | null} */
let editorLayout = null;
/** @type {typeof DISPLAY_CARD_LAYOUT | null} */
let defaultLayout = null;
let selectedKey = 'name';
let editorBound = false;

/** @returns {{ index: number; part: 'position' | 'right' } | null} */
function parseCommentLineKey(key) {
  const match = key.match(/^comment\.line\.(\d+)(?:\.(right))?$/);
  if (!match) return null;
  return {
    index: parseInt(match[1], 10),
    part: match[2] === 'right' ? 'right' : 'position',
  };
}

/**
 * Initializes the display card layout editor panel.
 * @param {HTMLElement | null} root
 */
export function initDisplayCardLayoutEditor(root) {
  if (!root || editorBound) return;
  editorBound = true;

  const previewHost = root.querySelector('#display-card-layout-preview');
  const propsMount = root.querySelector('#display-card-layout-props');
  const statusEl = root.querySelector('#display-card-layout-status');
  const sampleSchedule = root.querySelector('#display-card-sample-schedule');

  root.querySelector('#display-card-layout-save')?.addEventListener('click', async () => {
    if (!editorLayout) return;
    statusEl.textContent = '保存中…';
    try {
      const data = await apiRequest('admin/settings/display-card-layout', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout: editorLayout }),
      });
      editorLayout = structuredClone(data.layout);
      setDisplayCardLayout(editorLayout);
      statusEl.textContent = '保存しました';
      renderEditorPreview(previewHost);
      renderPropsPanel(propsMount);
    } catch (err) {
      statusEl.textContent = err instanceof Error ? err.message : '保存に失敗しました';
    }
  });

  root.querySelector('#display-card-layout-reset')?.addEventListener('click', () => {
    if (!defaultLayout) return;
    editorLayout = structuredClone(defaultLayout);
    setDisplayCardLayout(editorLayout);
    statusEl.textContent = '初期値に戻しました（未保存）';
    renderEditorPreview(previewHost);
    renderPropsPanel(propsMount);
  });

  root.querySelector('#display-card-layout-reload')?.addEventListener('click', () => {
    loadDisplayCardLayoutEditor(root);
  });

  sampleSchedule?.addEventListener('change', () => {
    renderEditorPreview(previewHost);
  });

  for (const input of root.querySelectorAll('[data-sample-field]')) {
    input.addEventListener('input', () => {
      renderEditorPreview(previewHost);
    });
  }

  ensureLayoutDragBinding(previewHost, () => ({
    propsMount: root.querySelector('#display-card-layout-props'),
    statusEl: root.querySelector('#display-card-layout-status'),
  }));

  loadDisplayCardLayoutEditor(root);
}

/** Loads layout from API and renders editor. */
export async function loadDisplayCardLayoutEditor(root) {
  const previewHost = root.querySelector('#display-card-layout-preview');
  const propsMount = root.querySelector('#display-card-layout-props');
  const statusEl = root.querySelector('#display-card-layout-status');
  statusEl.textContent = '読み込み中…';
  try {
    const data = await apiRequest('admin/settings/display-card-layout');
    defaultLayout = structuredClone(data.defaults ?? DISPLAY_CARD_LAYOUT);
    editorLayout = structuredClone(data.layout ?? defaultLayout);
    editorLayout.comment.maxLines = getCommentLinePlotCount(editorLayout.comment);
    setDisplayCardLayout(editorLayout);
    statusEl.textContent = '';
    renderEditorPreview(previewHost);
    renderPropsPanel(propsMount);
  } catch (err) {
    statusEl.textContent = err instanceof Error ? err.message : '読み込みに失敗しました';
  }
}

function readSampleFromDom(root) {
  const scheduleEl = root.querySelector('#display-card-sample-schedule');
  const scheduleType = scheduleEl?.value === 'part_time' ? 'part_time' : 'full_time';
  return {
    scheduleType,
    homeroom: root.querySelector('#display-card-sample-homeroom')?.value ?? SAMPLE.homeroom,
    studentName: root.querySelector('#display-card-sample-name')?.value ?? SAMPLE.studentName,
    title: root.querySelector('#display-card-sample-title')?.value ?? SAMPLE.title,
    impressions:
      root.querySelector('#display-card-sample-comment')?.value ?? SAMPLE.impressions,
  };
}

function renderEditorPreview(previewHost) {
  if (!previewHost || !editorLayout) return;
  const root = previewHost.closest('#panel-display-card-layout');
  const sample = root ? readSampleFromDom(root) : SAMPLE;
  const state = buildDisplayCardPreviewState({
    scheduleType: sample.scheduleType,
    homeroom: sample.homeroom,
    studentName: sample.studentName,
    title: sample.title,
    impressions: sample.impressions,
  });
  renderDisplayCardPreview(previewHost, state, { layout: editorLayout, editorLinePlots: true });
  const card = previewHost.querySelector('.contest-display-card');
  if (card) card.classList.add('contest-display-card--editor');
  injectEditorHandles(previewHost);
}

function injectEditorHandles(host) {
  const overlay = host.querySelector('.contest-display-card-overlay');
  if (!overlay || !editorLayout) return;
  overlay.querySelectorAll('.display-card-layout-handle').forEach((el) => el.remove());

  const handles = [];

  for (const key of ['full_time', 'part_time', 'tobe_branch']) {
    const m = editorLayout.marks[key];
    handles.push({
      key: `marks.${key}`,
      label: MARK_LABELS[key],
      left: m.left,
      top: m.top,
      kind: 'mark',
    });
  }

  for (const field of ['year', 'classGroup', 'name', 'title']) {
    const f = editorLayout[field];
    handles.push({
      key: field,
      label: FIELD_LABELS[field],
      left: f.left,
      top: f.top,
      kind: 'field',
    });
  }

  const c = editorLayout.comment;
  handles.push({
    key: 'comment',
    label: FIELD_LABELS.comment,
    left: c.left,
    top: c.top,
    kind: 'comment',
  });

  const lineCount = getCommentLinePlotCount(c);
  const lineTops = c.lineTops ?? [];
  for (let i = 0; i < lineCount; i += 1) {
    const top = lineTops[i] ?? defaultCommentLineTopPercent(c, i);
    const left = commentLineLeftPercent(c, i);
    const right = commentLineRightPercent(c, i);
    handles.push({
      key: `comment.line.${i}`,
      label: `コメント${i + 1}行`,
      left,
      top,
      kind: 'commentLine',
      lineIndex: i,
    });
    handles.push({
      key: `comment.line.${i}.right`,
      label: `コメント${i + 1}行 右端（次行へ送る位置）`,
      left: right,
      top,
      kind: 'commentLineRight',
      lineIndex: i,
    });
  }

  for (const h of handles) {
    const el = document.createElement('button');
    el.type = 'button';
    const isRight = h.kind === 'commentLineRight';
    el.className = `display-card-layout-handle${isRight ? ' display-card-layout-handle--right' : ''}${
      selectedKey === h.key ? ' is-selected' : ''
    }`;
    el.dataset.layoutKey = h.key;
    el.style.left = `${h.left}%`;
    el.style.top = `${h.top}%`;
    el.title = h.label;
    el.setAttribute('aria-label', h.label);
    el.textContent = h.kind === 'mark' ? '●' : isRight ? '┃' : '＋';
    overlay.appendChild(el);
  }
}

/** Updates overlay/handle positions during drag without rebuilding preview HTML. */
function syncLayoutVisualFromEditor(previewHost) {
  if (!previewHost || !editorLayout) return;
  const overlay = previewHost.querySelector('.contest-display-card-overlay');
  if (!overlay) return;
  const layout = editorLayout;
  const pct = (v) => `${v}%`;

  for (const markKey of ['full_time', 'part_time', 'tobe_branch']) {
    const m = layout.marks[markKey];
    const el = overlay.querySelector(`[data-layout-key="marks.${markKey}"]`);
    if (el instanceof HTMLElement) {
      el.style.left = pct(m.left);
      el.style.top = pct(m.top);
      el.style.width = pct(m.size);
      el.style.height = pct(m.size);
    }
  }

  for (const fieldKey of ['year', 'classGroup', 'name', 'title']) {
    const f = layout[fieldKey];
    const el = overlay.querySelector(`[data-layout-key="${fieldKey}"]`);
    if (el instanceof HTMLElement) {
      el.style.left = pct(f.left);
      el.style.top = pct(f.top);
      el.style.width = pct(f.width);
    }
  }

  const c = layout.comment;
  const commentEl = overlay.querySelector('[data-layout-key="comment"]');
  if (commentEl instanceof HTMLElement) {
    commentEl.style.left = pct(c.left);
    commentEl.style.top = pct(c.top);
    commentEl.style.width = pct(c.width);
  }

  const lineTops = c.lineTops ?? [];
  for (const el of overlay.querySelectorAll('[data-layout-key^="comment.line."]')) {
    if (!(el instanceof HTMLElement)) continue;
    const parsed = parseCommentLineKey(el.dataset.layoutKey ?? '');
    if (!parsed || parsed.part !== 'position') continue;
    const idx = parsed.index;
    const top = lineTops[idx] ?? defaultCommentLineTopPercent(c, idx);
    const left = commentLineLeftPercent(c, idx);
    el.style.left = pct(left);
    el.style.top = pct(top);
    el.style.width = pct(commentLineWidthPercent(c, idx));
  }

  updateHandlePositions(previewHost);
}

function trimCommentLineArraysToMaxLines() {
  if (!editorLayout) return;
  const c = editorLayout.comment;
  const n = Math.min(DISPLAY_CARD_COMMENT_LINES_CAP, Math.max(1, Math.round(c.maxLines)));
  c.maxLines = n;
  for (const key of ['lineTops', 'lineLefts', 'lineRights']) {
    if (Array.isArray(c[key]) && c[key].length > n) {
      c[key].length = n;
    }
  }
}

function ensureCommentLineSlots(lineIndex) {
  if (!editorLayout) return;
  const c = editorLayout.comment;
  if (!c.lineTops) c.lineTops = [];
  if (!c.lineLefts) c.lineLefts = [];
  if (!c.lineRights) c.lineRights = [];
  const slotCount = Math.max(
    lineIndex + 1,
    c.maxLines,
    c.lineTops.length,
    c.lineLefts.length,
    c.lineRights.length
  );
  for (let i = 0; i < slotCount; i += 1) {
    if (c.lineTops[i] === undefined) {
      c.lineTops[i] = defaultCommentLineTopPercent(c, i);
    }
    if (c.lineLefts[i] === undefined) {
      c.lineLefts[i] = c.left;
    }
    if (c.lineRights[i] === undefined) {
      c.lineRights[i] = Math.min(100, c.left + c.width);
    }
  }
}

function layoutPointForKey(key) {
  if (!editorLayout) return null;
  if (key.startsWith('marks.')) {
    const markKey = key.slice('marks.'.length);
    const m = editorLayout.marks[markKey];
    return m ? { left: m.left, top: m.top } : null;
  }
  const commentLine = parseCommentLineKey(key);
  if (commentLine) {
    const tops = editorLayout.comment.lineTops ?? [];
    const top =
      tops[commentLine.index] ??
      defaultCommentLineTopPercent(editorLayout.comment, commentLine.index);
    if (commentLine.part === 'right') {
      return { left: commentLineRightPercent(editorLayout.comment, commentLine.index), top };
    }
    return {
      left: commentLineLeftPercent(editorLayout.comment, commentLine.index),
      top,
    };
  }
  if (key === 'comment') {
    return { left: editorLayout.comment.left, top: editorLayout.comment.top };
  }
  const field = editorLayout[key];
  return field ? { left: field.left, top: field.top } : null;
}

function updateHandlePositions(previewHost) {
  if (!previewHost) return;
  previewHost.querySelectorAll('.display-card-layout-handle').forEach((btn) => {
    const key = btn.dataset.layoutKey;
    if (!key) return;
    const pos = layoutPointForKey(key);
    if (!pos) return;
    btn.style.left = `${pos.left}%`;
    btn.style.top = `${pos.top}%`;
  });
}

/** @param {HTMLElement | null} previewHost */
function ensureLayoutDragBinding(previewHost, getContext) {
  if (!previewHost || previewHost.dataset.layoutDragBound === '1') return;
  previewHost.dataset.layoutDragBound = '1';

  previewHost.addEventListener('pointerdown', (ev) => {
    if (!editorLayout) return;
    const card = previewHost.querySelector('.contest-display-card--editor');
    if (!card) return;

    const target = ev.target.closest('.display-card-layout-handle, [data-layout-key]');
    if (!target || !card.contains(target)) return;

    ev.preventDefault();
    const key = target.dataset.layoutKey;
    if (!key) return;

    if (target instanceof Element && 'setPointerCapture' in target) {
      try {
        target.setPointerCapture(ev.pointerId);
      } catch {
        /* ignore */
      }
    }

    const { propsMount, statusEl } = getContext();
    const parsedSelect = parseCommentLineKey(key);
    selectedKey =
      parsedSelect?.part === 'right'
        ? `comment.line.${parsedSelect.index}`
        : key;
    if (statusEl) statusEl.textContent = '';
    renderPropsPanel(propsMount);
    injectEditorHandles(previewHost);

    const rect = card.getBoundingClientRect();
    const targetEl = target instanceof HTMLElement ? target : null;
    const isCenteredHandle =
      target instanceof Element && target.classList.contains('display-card-layout-handle');
    const anchor = targetEl?.getBoundingClientRect();
    const offsetX = isCenteredHandle || !anchor ? 0 : ev.clientX - anchor.left;
    const offsetY = isCenteredHandle || !anchor ? 0 : ev.clientY - anchor.top;

    const onMove = (moveEv) => {
      const left = ((moveEv.clientX - rect.left - offsetX) / rect.width) * 100;
      const top = ((moveEv.clientY - rect.top - offsetY) / rect.height) * 100;
      const parsedLine = parseCommentLineKey(key);
      if (parsedLine?.part === 'right') {
        applyCommentLineRight(parsedLine.index, left);
      } else {
        applyLayoutPosition(key, left, top);
      }
      syncLayoutVisualFromEditor(previewHost);
      renderPropsPanel(propsMount);
      const overlay = previewHost.querySelector('.contest-display-card-overlay');
      const active = overlay?.querySelector(`[data-layout-key="${CSS.escape(key)}"]`);
      if (active instanceof HTMLElement) active.classList.add('is-layout-selected');
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (target instanceof Element && 'releasePointerCapture' in target) {
        try {
          target.releasePointerCapture(ev.pointerId);
        } catch {
          /* ignore */
        }
      }
      renderEditorPreview(previewHost);
      renderPropsPanel(propsMount);
      previewHost.querySelectorAll('.is-layout-selected').forEach((el) => {
        el.classList.remove('is-layout-selected');
      });
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    onMove(ev);
  });

  previewHost.addEventListener('click', (ev) => {
    const target = ev.target.closest('[data-layout-key], .display-card-layout-handle');
    if (!target || !previewHost.querySelector('.contest-display-card--editor')?.contains(target)) {
      return;
    }
    const key = target.dataset.layoutKey;
    if (!key) return;
    const { propsMount } = getContext();
    const parsedSelect = parseCommentLineKey(key);
    selectedKey =
      parsedSelect?.part === 'right'
        ? `comment.line.${parsedSelect.index}`
        : key;
    renderPropsPanel(propsMount);
    injectEditorHandles(previewHost);
  });
}

function applyLayoutPosition(key, left, top) {
  if (!editorLayout) return;
  const clamp = (v) => Math.min(100, Math.max(0, Math.round(v * 100) / 100));

  if (key.startsWith('marks.')) {
    const markKey = key.slice('marks.'.length);
    if (editorLayout.marks[markKey]) {
      editorLayout.marks[markKey].left = clamp(left);
      editorLayout.marks[markKey].top = snapLayoutY(editorLayout, clamp(top));
    }
    return;
  }

  const commentLine = parseCommentLineKey(key);
  if (commentLine?.part === 'position') {
    const index = commentLine.index;
    ensureCommentLineSlots(index);
    editorLayout.comment.lineTops[index] = snapLayoutY(editorLayout, clamp(top));
    editorLayout.comment.lineLefts[index] = snapLayoutX(editorLayout, clamp(left));
    return;
  }

  if (key === 'comment') {
    editorLayout.comment.left = snapLayoutX(editorLayout, clamp(left));
    editorLayout.comment.top = snapLayoutY(editorLayout, clamp(top));
    return;
  }

  if (editorLayout[key]) {
    const ySnappedFields = ['year', 'classGroup', 'name'];
    editorLayout[key].left = clamp(left);
    editorLayout[key].top = ySnappedFields.includes(key)
      ? snapLayoutY(editorLayout, clamp(top))
      : clamp(top);
  }
}

function applyCommentLineRight(lineIndex, rightPercent) {
  if (!editorLayout) return;
  const clamp = (v) => Math.min(100, Math.max(0, Math.round(v * 100) / 100));
  ensureCommentLineSlots(lineIndex);
  const minRight = commentLineLeftPercent(editorLayout.comment, lineIndex) + 2;
  const snapped = snapLayoutX(editorLayout, clamp(rightPercent));
  editorLayout.comment.lineRights[lineIndex] = Math.max(minRight, snapped);
}

function renderPropsPanel(mount) {
  if (!mount || !editorLayout) return;
  const key = selectedKey;
  let html = `<p class="hint">選択: <strong>${escapeHtml(labelForKey(key))}</strong> — ドラッグまたは数値で調整</p>`;

  if (key.startsWith('marks.')) {
    const markKey = key.slice('marks.'.length);
    const m = editorLayout.marks[markKey];
    html += numberFields([
      ['left', '左 (%)', m.left],
      ['top', '上 (%)', m.top],
      ['size', 'サイズ (%)', m.size],
    ], key);
  } else if (parseCommentLineKey(key)) {
    const { index, part } = parseCommentLineKey(key);
    const tops = editorLayout.comment.lineTops ?? [];
    const top =
      tops[index] ?? defaultCommentLineTopPercent(editorLayout.comment, index);
    const lineLeft = commentLineLeftPercent(editorLayout.comment, index);
    const lineRight = commentLineRightPercent(editorLayout.comment, index);
    const baseKey = `comment.line.${index}`;
    html += numberFields(
      [
        ['left', '左 (%)', lineLeft],
        ['lineTop', '行の上 (%)', top],
        ['lineRight', '右端・次行へ送る位置 (%)', lineRight],
      ],
      baseKey,
      { lineIndex: index }
    );
    html += `<label class="display-card-layout-prop display-card-layout-range">
      <span>次行へ送る位置（右端）スライダー</span>
      <input type="range" min="${lineLeft + 2}" max="100" step="0.1" data-range-input="lineRight" data-layout-key="${escapeHtml(baseKey)}" data-line-index="${index}" value="${lineRight}" />
    </label>`;
    html += `<p class="hint">行ごとに left / 上 / 右端（lineRights）を保存します。右端より先の文字は次の行プロットへ送り、行内では折り返しません。近い座標は自動で揃います。</p>`;
  } else if (key === 'comment') {
    const c = editorLayout.comment;
    html += numberFields(
      [
        ['left', '左 (%)', c.left],
        ['top', '上 (%)', c.top],
        ['width', '幅 (%)', c.width],
        ['fontSize', '文字 (px)', c.fontSize],
        ['lineHeight', '行間', c.lineHeight],
        ['maxLines', '行数（プロット数）', c.maxLines],
      ],
      key
    );
    html += `<p class="hint">行数は 1〜${DISPLAY_CARD_COMMENT_LINES_CAP}。行数に応じてコメント行のハンドル数が変わります。</p>`;
  } else if (editorLayout[key]) {
    const f = editorLayout[key];
    const fields = [
      ['left', '左 (%)', f.left],
      ['top', '上 (%)', f.top],
      ['width', '幅 (%)', f.width],
      ['fontSize', '文字 (px)', f.fontSize],
    ];
    if (f.maxLines !== undefined) fields.push(['maxLines', '最大行数', f.maxLines]);
    html += numberFields(fields, key);
  }

  mount.innerHTML = html;
  const syncFromPanel = () => {
    const root = mount.closest('#panel-display-card-layout');
    const previewHost = root?.querySelector('#display-card-layout-preview');
    renderEditorPreview(previewHost);
    renderPropsPanel(mount);
  };
  const applyFromPropInput = (input) => {
    const propKey = input.dataset.layoutKey ?? key;
    applyPropFromInput(propKey, input.dataset.propInput, input.value, input.dataset.lineIndex);
    syncFromPanel();
  };
  mount.querySelectorAll('[data-prop-input]').forEach((input) => {
    input.addEventListener('change', () => applyFromPropInput(input));
    if (input.dataset.propInput === 'maxLines') {
      input.addEventListener('input', () => applyFromPropInput(input));
    }
  });
  mount.querySelectorAll('[data-range-input]').forEach((input) => {
    input.addEventListener('input', () => {
      const propKey = input.dataset.layoutKey ?? key;
      applyPropFromInput(propKey, input.dataset.rangeInput, input.value, input.dataset.lineIndex);
      syncFromPanel();
    });
  });
}

function numberFields(rows, layoutKey, extra = {}) {
  const lineAttr = extra.lineIndex !== undefined ? ` data-line-index="${extra.lineIndex}"` : '';
  return `<div class="display-card-layout-prop-grid">${rows
    .map(
      ([prop, label, value]) => `
    <label class="display-card-layout-prop">
      <span>${escapeHtml(label)}</span>
      <input type="number" step="${prop === 'maxLines' ? '1' : '0.1'}" data-prop-input="${prop}" data-layout-key="${escapeHtml(layoutKey)}"${lineAttr} value="${escapeHtml(String(value))}" />
    </label>`
    )
    .join('')}</div>`;
}

function applyPropFromInput(key, prop, rawValue, lineIndexAttr) {
  if (!editorLayout) return;

  if (key === 'comment' && prop === 'maxLines') {
    const value = Math.round(parseFloat(rawValue));
    if (!Number.isFinite(value)) return;
    editorLayout.comment.maxLines = Math.min(
      DISPLAY_CARD_COMMENT_LINES_CAP,
      Math.max(1, value)
    );
    trimCommentLineArraysToMaxLines();
    for (let i = 0; i < editorLayout.comment.maxLines; i += 1) {
      ensureCommentLineSlots(i);
    }
    return;
  }

  const value = parseFloat(rawValue);
  if (!Number.isFinite(value)) return;

  if (key.startsWith('marks.')) {
    const markKey = key.slice('marks.'.length);
    if (editorLayout.marks[markKey] && prop in editorLayout.marks[markKey]) {
      editorLayout.marks[markKey][prop] = value;
    }
    return;
  }

  const commentLine = parseCommentLineKey(key);
  if (commentLine?.part === 'position') {
    const index = commentLine.index;
    ensureCommentLineSlots(index);
    if (prop === 'left') {
      editorLayout.comment.lineLefts[index] = snapLayoutX(editorLayout, value);
    }
    if (prop === 'lineTop') {
      editorLayout.comment.lineTops[index] = snapLayoutY(editorLayout, value);
    }
    if (prop === 'lineRight') {
      applyCommentLineRight(index, value);
    }
    return;
  }

  if (editorLayout[key] && prop in editorLayout[key]) {
    editorLayout[key][prop] = value;
  }
}

function labelForKey(key) {
  if (key.startsWith('marks.')) return MARK_LABELS[key.slice('marks.'.length)] ?? key;
  const commentLine = parseCommentLineKey(key);
  if (commentLine) {
    if (commentLine.part === 'right') {
      return `コメント${commentLine.index + 1}行 右端`;
    }
    return `コメント${commentLine.index + 1}行`;
  }
  return FIELD_LABELS[key] ?? key;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
