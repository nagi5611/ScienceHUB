// public/apps/contest-management/js/display-card-layout-editor.js
import { apiRequest } from './api.js';
import {
  DISPLAY_CARD_LAYOUT,
  buildDisplayCardPreviewState,
  defaultCommentLineTopPercent,
  renderDisplayCardPreview,
  setDisplayCardLayout,
} from '../../contest-entry/js/display-card-preview.js';

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
    bindDragHandles(previewHost, propsMount, statusEl);
  });

  for (const input of root.querySelectorAll('[data-sample-field]')) {
    input.addEventListener('input', () => {
      renderEditorPreview(previewHost);
      bindDragHandles(previewHost, propsMount, statusEl);
    });
  }

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
    setDisplayCardLayout(editorLayout);
    statusEl.textContent = '';
    renderEditorPreview(previewHost);
    renderPropsPanel(propsMount);
    bindDragHandles(previewHost, propsMount, statusEl);
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
  renderDisplayCardPreview(previewHost, state, { layout: editorLayout });
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

  const root = host?.closest('#panel-display-card-layout');
  const sample = root ? readSampleFromDom(root) : SAMPLE;
  const state = buildDisplayCardPreviewState({
    scheduleType: sample.scheduleType,
    homeroom: sample.homeroom,
    studentName: sample.studentName,
    title: sample.title,
    impressions: sample.impressions,
  });
  const lineCount = Math.min(c.maxLines, Math.max(state.commentLines.length, 3));
  const lineTops = c.lineTops ?? [];
  for (let i = 0; i < lineCount; i += 1) {
    const top = lineTops[i] ?? defaultCommentLineTopPercent(c, i);
    handles.push({
      key: `comment.line.${i}`,
      label: `コメント${i + 1}行`,
      left: c.left,
      top,
      kind: 'commentLine',
      lineIndex: i,
    });
  }

  for (const h of handles) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `display-card-layout-handle${selectedKey === h.key ? ' is-selected' : ''}`;
    el.dataset.layoutKey = h.key;
    el.style.left = `${h.left}%`;
    el.style.top = `${h.top}%`;
    el.title = h.label;
    el.setAttribute('aria-label', h.label);
    el.textContent = h.kind === 'mark' ? '●' : '＋';
    overlay.appendChild(el);
  }
}

function bindDragHandles(previewHost, propsMount, statusEl) {
  if (!previewHost) return;
  const card = previewHost.querySelector('.contest-display-card');
  if (!card) return;

  previewHost.querySelectorAll('.display-card-layout-handle').forEach((handle) => {
    handle.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      const key = handle.dataset.layoutKey;
      if (!key || !editorLayout) return;
      selectedKey = key;
      statusEl.textContent = '';
      renderPropsPanel(propsMount);
      injectEditorHandles(previewHost);

      const rect = card.getBoundingClientRect();
      const onMove = (moveEv) => {
        const left = ((moveEv.clientX - rect.left) / rect.width) * 100;
        const top = ((moveEv.clientY - rect.top) / rect.height) * 100;
        applyLayoutPosition(key, left, top);
        renderEditorPreview(previewHost);
        renderPropsPanel(propsMount);
        const overlay = previewHost.querySelector('.contest-display-card-overlay');
        const active = overlay?.querySelector(`[data-layout-key="${key}"]`);
        if (active instanceof HTMLElement) active.classList.add('is-selected');
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      onMove(ev);
    });

    handle.addEventListener('click', () => {
      selectedKey = handle.dataset.layoutKey ?? 'name';
      renderPropsPanel(propsMount);
      injectEditorHandles(previewHost);
    });
  });
}

function applyLayoutPosition(key, left, top) {
  if (!editorLayout) return;
  const clamp = (v) => Math.min(100, Math.max(0, Math.round(v * 100) / 100));

  if (key.startsWith('marks.')) {
    const markKey = key.slice('marks.'.length);
    if (editorLayout.marks[markKey]) {
      editorLayout.marks[markKey].left = clamp(left);
      editorLayout.marks[markKey].top = clamp(top);
    }
    return;
  }

  if (key.startsWith('comment.line.')) {
    const index = parseInt(key.slice('comment.line.'.length), 10);
    if (!Number.isFinite(index)) return;
    if (!editorLayout.comment.lineTops) {
      editorLayout.comment.lineTops = [];
    }
    editorLayout.comment.lineTops[index] = clamp(top);
    editorLayout.comment.left = clamp(left);
    return;
  }

  if (key === 'comment') {
    editorLayout.comment.left = clamp(left);
    editorLayout.comment.top = clamp(top);
    return;
  }

  if (editorLayout[key]) {
    editorLayout[key].left = clamp(left);
    editorLayout[key].top = clamp(top);
  }
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
  } else if (key.startsWith('comment.line.')) {
    const index = parseInt(key.slice('comment.line.'.length), 10);
    const tops = editorLayout.comment.lineTops ?? [];
    const top =
      tops[index] ?? defaultCommentLineTopPercent(editorLayout.comment, index);
    html += numberFields(
      [
        ['left', '左 (%)', editorLayout.comment.left],
        ['lineTop', '行の上 (%)', top],
      ],
      key,
      { lineIndex: index }
    );
    html += `<p class="hint">行位置を動かすと行ごとの上位置（lineTops）が保存されます。</p>`;
  } else if (key === 'comment') {
    const c = editorLayout.comment;
    html += numberFields(
      [
        ['left', '左 (%)', c.left],
        ['top', '上 (%)', c.top],
        ['width', '幅 (%)', c.width],
        ['fontSize', '文字 (px)', c.fontSize],
        ['lineHeight', '行間', c.lineHeight],
        ['maxLines', '最大行数', c.maxLines],
      ],
      key
    );
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
  mount.querySelectorAll('[data-prop-input]').forEach((input) => {
    input.addEventListener('change', () => {
      applyPropFromInput(key, input.dataset.propInput, input.value, input.dataset.lineIndex);
      const root = mount.closest('#panel-display-card-layout');
      const previewHost = root?.querySelector('#display-card-layout-preview');
      renderEditorPreview(previewHost);
      bindDragHandles(previewHost, mount, root?.querySelector('#display-card-layout-status'));
      renderPropsPanel(mount);
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
      <input type="number" step="0.1" data-prop-input="${prop}" data-layout-key="${escapeHtml(layoutKey)}"${lineAttr} value="${escapeHtml(String(value))}" />
    </label>`
    )
    .join('')}</div>`;
}

function applyPropFromInput(key, prop, rawValue, lineIndexAttr) {
  if (!editorLayout) return;
  const value = parseFloat(rawValue);
  if (!Number.isFinite(value)) return;

  if (key.startsWith('marks.')) {
    const markKey = key.slice('marks.'.length);
    if (editorLayout.marks[markKey] && prop in editorLayout.marks[markKey]) {
      editorLayout.marks[markKey][prop] = value;
    }
    return;
  }

  if (key.startsWith('comment.line.')) {
    const index = parseInt(lineIndexAttr ?? key.slice('comment.line.'.length), 10);
    if (prop === 'left') editorLayout.comment.left = value;
    if (prop === 'lineTop') {
      if (!editorLayout.comment.lineTops) editorLayout.comment.lineTops = [];
      editorLayout.comment.lineTops[index] = value;
    }
    return;
  }

  if (editorLayout[key] && prop in editorLayout[key]) {
    editorLayout[key][prop] = value;
  }
}

function labelForKey(key) {
  if (key.startsWith('marks.')) return MARK_LABELS[key.slice('marks.'.length)] ?? key;
  if (key.startsWith('comment.line.')) {
    const i = parseInt(key.slice('comment.line.'.length), 10);
    return `コメント${i + 1}行`;
  }
  return FIELD_LABELS[key] ?? key;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
