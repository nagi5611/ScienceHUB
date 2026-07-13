// public/apps/3dprint-management/js/print-video-folder-picker.js
import { apiRequest } from '../../3dprint-reservation/js/api.js';

/** @typedef {{ path: string; label: string }} GroupRoot */

let modalEl = null;
let listEl = null;
let breadcrumbEl = null;
let hintEl = null;
let confirmBtn = null;
let onSelectCallback = null;
let getGroupRoots = () => [];
let currentPath = '';
let pendingSelectPath = '';

/** フォルダ選択モーダルを初期化 */
export function initPrintVideoFolderPicker(options) {
  modalEl = document.getElementById('print-video-folder-modal');
  listEl = document.getElementById('print-video-folder-list');
  breadcrumbEl = document.getElementById('print-video-folder-breadcrumb');
  hintEl = document.getElementById('print-video-folder-hint');
  confirmBtn = document.getElementById('print-video-folder-confirm');

  onSelectCallback = options.onSelect;
  getGroupRoots = options.getGroupRoots;

  document.getElementById('print-video-folder-modal-close')?.addEventListener('click', closePicker);
  document.getElementById('print-video-folder-cancel')?.addEventListener('click', closePicker);
  modalEl?.addEventListener('click', (e) => {
    if (e.target === modalEl) closePicker();
  });
  confirmBtn?.addEventListener('click', confirmSelection);
}

/** フォルダ選択モーダルを開く */
export async function openPrintVideoFolderPicker(initialPath = '') {
  if (!modalEl) return;

  pendingSelectPath = initialPath?.trim() ?? '';
  currentPath = pendingSelectPath;
  modalEl.classList.add('open');
  confirmBtn.disabled = !currentPath;
  await renderPickerView();
}

/** モーダルを閉じる */
function closePicker() {
  modalEl?.classList.remove('open');
}

/** 選択を確定してコールバックを呼ぶ */
function confirmSelection() {
  if (!currentPath) return;
  onSelectCallback?.(currentPath);
  closePicker();
}

/** 現在のパスで一覧を描画 */
async function renderPickerView() {
  renderBreadcrumb();
  if (!listEl) return;

  listEl.innerHTML = '<p class="hint">読み込み中...</p>';
  if (hintEl) hintEl.textContent = currentPath ? 'フォルダを開くには行をクリックしてください。' : 'チームを選んでください。';

  try {
    if (!currentPath) {
      renderTeamRoots();
      confirmBtn.disabled = true;
      return;
    }

    confirmBtn.disabled = false;
    pendingSelectPath = currentPath;

    const data = await apiRequest(
      `admin/settings/storage-list?path=${encodeURIComponent(currentPath)}`
    );
    const folders = data.items ?? [];

    if (!folders.length) {
      listEl.innerHTML = '<p class="storage-folder-empty hint">このフォルダにサブフォルダはありません（このフォルダ自体は選択できます）</p>';
      return;
    }

    listEl.innerHTML = folders
      .map(
        (item) => `<button type="button" class="storage-folder-item" data-path="${escapeAttr(item.path)}">
        <span class="storage-folder-icon" aria-hidden="true">📁</span>
        <span class="storage-folder-name">${escapeHtml(item.name)}</span>
      </button>`
      )
      .join('');

    listEl.querySelectorAll('.storage-folder-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentPath = btn.dataset.path ?? '';
        pendingSelectPath = currentPath;
        confirmBtn.disabled = !currentPath;
        renderPickerView();
      });
    });
  } catch (err) {
    listEl.innerHTML = `<p class="alert alert-error">${escapeHtml(err.message)}</p>`;
  }
}

/** チームルート一覧を描画 */
function renderTeamRoots() {
  const roots = getGroupRoots();
  if (!roots.length) {
    listEl.innerHTML = '<p class="hint">利用可能なチームのストレージがありません。</p>';
    return;
  }

  listEl.innerHTML = roots
    .map(
      (root) => `<button type="button" class="storage-folder-item storage-folder-item--root" data-path="${escapeAttr(root.path)}">
      <span class="storage-folder-icon" aria-hidden="true">🗂️</span>
      <span class="storage-folder-name">${escapeHtml(root.label)}</span>
      <span class="storage-folder-meta">${escapeHtml(root.path)}</span>
    </button>`
    )
    .join('');

  listEl.querySelectorAll('.storage-folder-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentPath = btn.dataset.path ?? '';
      pendingSelectPath = currentPath;
      confirmBtn.disabled = !currentPath;
      renderPickerView();
    });
  });
}

/** パンくずを描画 */
function renderBreadcrumb() {
  if (!breadcrumbEl) return;

  const parts = [];
  parts.push(
    `<button type="button" class="storage-folder-crumb" data-path="">チーム</button>`
  );

  if (currentPath) {
    const roots = getGroupRoots();
    const matchedRoot = roots.find(
      (root) => currentPath === root.path || currentPath.startsWith(`${root.path}/`)
    );

    if (matchedRoot) {
      parts.push(
        `<button type="button" class="storage-folder-crumb" data-path="${escapeAttr(matchedRoot.path)}">${escapeHtml(matchedRoot.label)}</button>`
      );

      const prefix = `${matchedRoot.path}/`;
      if (currentPath.startsWith(prefix)) {
        const rest = currentPath.slice(prefix.length).split('/').filter(Boolean);
        let built = matchedRoot.path;
        for (const segment of rest) {
          built = `${built}/${segment}`;
          parts.push(
            `<button type="button" class="storage-folder-crumb" data-path="${escapeAttr(built)}">${escapeHtml(segment)}</button>`
          );
        }
      }
    } else {
      parts.push(`<span class="storage-folder-crumb storage-folder-crumb--current">${escapeHtml(currentPath)}</span>`);
    }
  }

  breadcrumbEl.innerHTML = parts.join('<span class="storage-folder-crumb-sep">/</span>');

  breadcrumbEl.querySelectorAll('.storage-folder-crumb[data-path]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentPath = btn.dataset.path ?? '';
      pendingSelectPath = currentPath;
      confirmBtn.disabled = !currentPath;
      renderPickerView();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
