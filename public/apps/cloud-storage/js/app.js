/**
 * クラウドストレージ エクスプローラー
 */

import { apiRequest, fetchDownloadBlob } from "./api.js";
import { resolvePreviewBlob } from "./preview-cache.js";
import {
  clearSessionPreviewCache,
  getSessionPreviewBlob,
  getSessionPreviewObjectUrl,
} from "./preview-session-cache.js";
import { uploadFiles } from "./upload.js";
import { createUploadProgress } from "./upload-progress.js";
import {
  classifyFile,
  getSameCategoryPreviewItems,
  isOfficePreviewableFilename,
  isPreviewableFile,
  needsLargePreviewWarning,
  PREVIEW_LARGE_WARNING_BYTES,
  renderFileTypeIcon,
} from "./file-icons.js";
import { downloadItemsSequentially, downloadSingleFile } from "./download-zip.js";
import { scheduleFolderThumbnails } from "./folder-thumbnails.js";
import { scheduleFileThumbnails } from "./file-thumbnails.js";
import { resetThumbnailLoads } from "./thumbnail-session.js";
import { mountModel3dPreview, unmountModel3dPreview, ensureModelBlobType } from "./preview-model3d.js";
import {
  clearOfficePreview,
  fetchOfficePreviewInfo,
  renderOfficePreview,
} from "./preview-office.js";

let roots = [];
let currentPath = "";
let selectedItems = new Set();
let listItems = [];
let contextMenuItem = null;
let previewPath = null;
let previewQueue = [];
let previewIndex = -1;
let previewLoadToken = 0;
let selectionAnchorIndex = -1;
let suppressRowClick = false;

const MARQUEE_DRAG_THRESHOLD = 4;
const LIST_PAGE_SIZE = 40;
const SORT_STORAGE_KEY = "cs-sort";
const PARALLEL_DELETE = 8;

let listLoadGeneration = 0;
let sortField = "name";
let sortOrder = "asc";

let searchActive = false;
let searchQuery = "";
let searchScope = "folder";
let searchUpdatedFrom = "";
let searchUpdatedTo = "";
let searchStatusText = "";

const SEARCH_SCOPE_LABELS = {
  folder: "このフォルダ内",
  subtree: "サブフォルダを含む",
  root: "ルート全体",
};

const uploadProgress = createUploadProgress();

function getItemByPath(path) {
  return listItems.find((i) => i.path === path);
}

function canPreviewFile(item) {
  return isPreviewableFile(item);
}

function applySelectionToUi() {
  document.querySelectorAll(".cs-file-row").forEach((row) => {
    const selected = selectedItems.has(row.dataset.path);
    row.classList.toggle("is-selected", selected);
    const cb = row.querySelector(".cs-select");
    if (cb) cb.checked = selected;
  });
}

function getItemIndex(path) {
  return listItems.findIndex((i) => i.path === path);
}

function selectRange(fromIndex, toIndex) {
  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);
  selectedItems.clear();
  for (let i = start; i <= end; i++) {
    const item = listItems[i];
    if (item) selectedItems.add(item.path);
  }
  applySelectionToUi();
}

function selectSingleItem(path) {
  selectedItems.clear();
  if (path) selectedItems.add(path);
  selectionAnchorIndex = path ? getItemIndex(path) : -1;
  applySelectionToUi();
}

function getSelectedItems() {
  return [...selectedItems]
    .map((path) => getItemByPath(path))
    .filter(Boolean);
}

function handleItemSelection(path, { shiftKey = false, ctrlKey = false, metaKey = false } = {}) {
  const index = getItemIndex(path);
  if (index < 0) return;

  if (shiftKey && selectionAnchorIndex >= 0) {
    selectRange(selectionAnchorIndex, index);
    return;
  }

  if (ctrlKey || metaKey) {
    if (selectedItems.has(path)) selectedItems.delete(path);
    else selectedItems.add(path);
    selectionAnchorIndex = index;
    applySelectionToUi();
    return;
  }

  if (selectedItems.size === 1 && selectedItems.has(path)) {
    selectedItems.clear();
    selectionAnchorIndex = -1;
    applySelectionToUi();
    return;
  }

  selectSingleItem(path);
}

function rectsIntersect(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function getMarqueeRect(x1, y1, x2, y2) {
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  return { left, top, width, height, right: left + width, bottom: top + height };
}

function getRowsInMarquee(rect) {
  const domRect = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
  const paths = [];
  document.querySelectorAll(".cs-file-row").forEach((row) => {
    if (rectsIntersect(domRect, row.getBoundingClientRect())) {
      paths.push(row.dataset.path);
    }
  });
  return paths;
}

function clearMarqueePreview() {
  document.querySelectorAll(".cs-file-row.is-marquee-preview").forEach((row) => {
    row.classList.remove("is-marquee-preview");
  });
}

function previewMarqueeSelection(rect) {
  const paths = new Set(getRowsInMarquee(rect));
  document.querySelectorAll(".cs-file-row").forEach((row) => {
    row.classList.toggle("is-marquee-preview", paths.has(row.dataset.path));
  });
}

function applyMarqueeSelection(rect, addToSelection) {
  const paths = getRowsInMarquee(rect);
  if (!addToSelection) {
    selectedItems.clear();
  }
  for (const path of paths) {
    selectedItems.add(path);
  }
  if (paths.length > 0) {
    const firstIndex = paths
      .map((path) => getItemIndex(path))
      .filter((index) => index >= 0)
      .sort((a, b) => a - b)[0];
    if (firstIndex !== undefined) selectionAnchorIndex = firstIndex;
  }
  applySelectionToUi();
}

/** マウスドラッグで範囲選択 */
function bindMarqueeSelection() {
  const wrap = document.getElementById("cs-table-wrap");
  const marquee = document.getElementById("cs-marquee");
  if (!wrap || !marquee) return;

  let session = null;

  const endSession = () => {
    if (!session) return;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.classList.remove("cs-marquee-active");
    marquee.setAttribute("hidden", "");
    clearMarqueePreview();
    session = null;
  };

  const onMouseMove = (moveEvent) => {
    if (!session) return;

    const dx = Math.abs(moveEvent.clientX - session.startX);
    const dy = Math.abs(moveEvent.clientY - session.startY);
    if (!session.dragging) {
      if (dx < MARQUEE_DRAG_THRESHOLD && dy < MARQUEE_DRAG_THRESHOLD) return;
      session.dragging = true;
      suppressRowClick = true;
      document.body.classList.add("cs-marquee-active");
      marquee.removeAttribute("hidden");
    }

    const rect = getMarqueeRect(session.startX, session.startY, moveEvent.clientX, moveEvent.clientY);
    marquee.style.left = `${rect.left}px`;
    marquee.style.top = `${rect.top}px`;
    marquee.style.width = `${rect.width}px`;
    marquee.style.height = `${rect.height}px`;
    previewMarqueeSelection(rect);
  };

  const onMouseUp = (upEvent) => {
    if (!session) return;

    if (session.dragging) {
      const rect = getMarqueeRect(session.startX, session.startY, upEvent.clientX, upEvent.clientY);
      applyMarqueeSelection(rect, upEvent.shiftKey);
      window.setTimeout(() => {
        suppressRowClick = false;
      }, 0);
    }

    endSession();
  };

  wrap.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    if (session) return;

    const tbody = document.getElementById("cs-files-body");
    if (!tbody) return;

    const onRow = e.target.closest(".cs-file-row");
    const onStatusRow = e.target.closest(".cs-list-status-row");
    const onHeader = e.target.closest("thead");
    const onCheckbox = e.target.closest(".cs-select");
    const onWrapBackground = e.target === wrap;

    if (onCheckbox || onStatusRow || onHeader) return;
    if (!onRow && !onWrapBackground && !tbody.contains(e.target)) return;

    e.preventDefault();

    session = {
      startX: e.clientX,
      startY: e.clientY,
      dragging: false,
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
}

function hideContextMenu() {
  const menu = document.getElementById("cs-context-menu");
  if (menu) menu.hidden = true;
  contextMenuItem = null;
}

/** 単一項目のコンテキストメニュー */
function showContextMenu(clientX, clientY, item) {
  const menu = document.getElementById("cs-context-menu");
  const title = document.getElementById("cs-context-menu-title");
  const itemsEl = document.getElementById("cs-context-menu-items");
  if (!menu || !title || !itemsEl) return;

  contextMenuItem = item;
  title.textContent = item.name;

  const actions = [];

  if (item.type === "folder") {
    actions.push({ id: "open", label: "開く" });
  } else {
    if (canPreviewFile(item)) {
      actions.push({ id: "preview", label: "プレビュー" });
    }
    actions.push({ id: "download", label: "ダウンロード" });
  }

  actions.push({ id: "rename", label: "名称変更" });
  actions.push({ id: "sep" });
  actions.push({ id: "delete", label: "削除", danger: true });

  renderContextMenu(menu, title, itemsEl, clientX, clientY, actions, (action) => {
    handleContextAction(action, item);
  });
}

/** 複数選択時のコンテキストメニュー */
function showMultiContextMenu(clientX, clientY) {
  const menu = document.getElementById("cs-context-menu");
  const title = document.getElementById("cs-context-menu-title");
  const itemsEl = document.getElementById("cs-context-menu-items");
  if (!menu || !title || !itemsEl) return;

  contextMenuItem = null;
  const count = selectedItems.size;
  title.textContent = `${count} 件を選択中`;

  const actions = [
    { id: "download-selected", label: "選択項目をダウンロード" },
    { id: "sep" },
    { id: "delete-selected", label: "選択項目を削除", danger: true },
  ];

  renderContextMenu(menu, title, itemsEl, clientX, clientY, actions, (action) => {
    handleMultiContextAction(action);
  });
}

function renderContextMenu(menu, _title, itemsEl, clientX, clientY, actions, onAction) {
  itemsEl.innerHTML = actions
    .map((action) => {
      if (action.id === "sep") {
        return '<div class="cs-context-menu-sep" role="separator"></div>';
      }
      return `<button type="button" class="cs-context-menu-item${action.danger ? " is-danger" : ""}" data-action="${action.id}" role="menuitem">${escapeHtml(action.label)}</button>`;
    })
    .join("");

  menu.hidden = false;
  menu.style.visibility = "hidden";
  menu.style.left = "0px";
  menu.style.top = "0px";

  const rect = menu.getBoundingClientRect();
  const padding = 8;
  let left = clientX;
  let top = clientY;
  if (left + rect.width > window.innerWidth - padding) {
    left = window.innerWidth - rect.width - padding;
  }
  if (top + rect.height > window.innerHeight - padding) {
    top = window.innerHeight - rect.height - padding;
  }
  menu.style.left = `${Math.max(padding, left)}px`;
  menu.style.top = `${Math.max(padding, top)}px`;
  menu.style.visibility = "";

  itemsEl.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      onAction(btn.dataset.action);
      hideContextMenu();
    });
  });
}

function handleMultiContextAction(action) {
  switch (action) {
    case "download-selected":
      handleDownloadSelected();
      break;
    case "delete-selected":
      handleDelete();
      break;
    default:
      break;
  }
}

function handleContextAction(action, item) {
  switch (action) {
    case "open":
      openFolderItem(item);
      break;
    case "preview":
      previewFile(item);
      break;
    case "download":
      downloadSingleFile(item.path, item.name);
      break;
    case "rename":
      renameItem(item);
      break;
    case "delete":
      deleteItem(item);
      break;
    default:
      break;
  }
}

function openFolderItem(item) {
  currentPath = item.path;
  selectedItems.clear();
  selectionAnchorIndex = -1;
  refreshListing();
  renderRoots();
}

function closePreview() {
  document.getElementById("cs-preview-dialog")?.close();
}

/** プレビューダイアログ閉鎖時の後片付け（close イベントから1回だけ呼ぶ） */
function cleanupPreview() {
  const body = document.getElementById("cs-preview-body");
  if (body) {
    unmountModel3dPreview(body);
    clearOfficePreview(body);
    body.classList.remove("cs-preview-body--model3d");
    body.innerHTML = "";
  }
  clearSessionPreviewCache();
  previewPath = null;
  previewQueue = [];
  previewIndex = -1;
  previewLoadToken += 1;
  updatePreviewNavUi();
}

function setupPreviewQueue(item) {
  previewQueue = getSameCategoryPreviewItems(listItems, item);
  previewIndex = previewQueue.findIndex((entry) => entry.path === item.path);
  if (previewIndex < 0) {
    previewQueue = [item];
    previewIndex = 0;
  }
}

function updatePreviewNavUi() {
  const prevBtn = document.getElementById("cs-preview-prev");
  const nextBtn = document.getElementById("cs-preview-next");
  const counter = document.getElementById("cs-preview-counter");
  const hasMultiple = previewQueue.length > 1;

  if (prevBtn) {
    prevBtn.hidden = !hasMultiple;
    prevBtn.disabled = previewIndex <= 0;
  }
  if (nextBtn) {
    nextBtn.hidden = !hasMultiple;
    nextBtn.disabled = previewIndex < 0 || previewIndex >= previewQueue.length - 1;
  }
  if (counter) {
    counter.hidden = !hasMultiple;
    counter.textContent = hasMultiple ? `${previewIndex + 1} / ${previewQueue.length}` : "";
  }
}

function shouldWarnLargePreview(item) {
  if (!needsLargePreviewWarning(item)) return false;
  return (item.sizeBytes ?? 0) > PREVIEW_LARGE_WARNING_BYTES;
}

function showLargePreviewWarning(item, loadToken) {
  const body = document.getElementById("cs-preview-body");
  const title = document.getElementById("cs-preview-title");
  if (!body || !title) return;

  title.textContent = item.name;
  body.innerHTML = `
    <div class="cs-preview-warning">
      <p>このファイルは ${escapeHtml(formatBytes(item.sizeBytes))} で、10 MB を超えています。プレビューには時間がかかるか、ブラウザが重くなる場合があります。</p>
      <button type="button" class="cs-btn cs-btn-primary" id="cs-preview-large-continue">プレビューを続行</button>
    </div>`;

  document.getElementById("cs-preview-large-continue")?.addEventListener("click", () => {
    if (loadToken !== previewLoadToken) return;
    loadPreviewContent(item, { acknowledgeLarge: true, loadToken });
  });
}

async function renderPreviewBlob(item, blob, body, options = {}) {
  unmountModel3dPreview(body);
  clearOfficePreview(body);
  body.classList.remove("cs-preview-body--model3d", "cs-preview-body--office");
  const objectUrl = getSessionPreviewObjectUrl(item.path, item.updatedAt, blob);
  const kind = classifyFile(item.name).kind;

  if (kind === "image") {
    body.innerHTML = `<img src="${objectUrl}" alt="${escapeHtml(item.name)}">`;
    return;
  }

  if (kind === "video") {
    body.innerHTML = `<video src="${objectUrl}" controls autoplay playsinline></video>`;
    return;
  }

  if (kind === "audio") {
    body.innerHTML = `<audio src="${objectUrl}" controls autoplay></audio>`;
    return;
  }

  if (kind === "document" && /\.pdf$/i.test(item.name)) {
    body.innerHTML = `<iframe src="${objectUrl}" title="${escapeHtml(item.name)}"></iframe>`;
    return;
  }

  if (kind === "text" || kind === "code") {
    const text = await blob.text();
    const maxLen = 512000;
    const display = text.length > maxLen ? `${text.slice(0, maxLen)}\n\n…（表示を省略）` : text;
    body.innerHTML = `<pre>${escapeHtml(display)}</pre>`;
    return;
  }

  if (kind === "model3d") {
    body.classList.add("cs-preview-body--model3d");
    const modelBlob = ensureModelBlobType(blob, item.name);
    const objectUrl = URL.createObjectURL(modelBlob);
    try {
      await mountModel3dPreview(body, objectUrl, item.name, {
        isStale: () => options.loadToken !== previewLoadToken,
      });
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      throw error;
    }
    return;
  }

  body.innerHTML = '<p class="cs-preview-loading">このファイルはプレビューできません</p>';
}

async function loadPreviewContent(item, options = {}) {
  const { acknowledgeLarge = false, loadToken = previewLoadToken } = options;
  const dialog = document.getElementById("cs-preview-dialog");
  const title = document.getElementById("cs-preview-title");
  const body = document.getElementById("cs-preview-body");
  if (!dialog || !title || !body) return;

  previewPath = item.path;
  title.textContent = item.name;
  updatePreviewNavUi();

  const kind = classifyFile(item.name).kind;

  if (shouldWarnLargePreview(item) && !acknowledgeLarge) {
    showLargePreviewWarning(item, loadToken);
    return;
  }

  if (kind === "model3d") {
    if (!getSessionPreviewBlob(item.path, item.updatedAt) && !body.querySelector(".cs-model3d-viewer")) {
      body.innerHTML = '<p class="cs-preview-loading">読み込み中…</p>';
    }
  } else if (!getSessionPreviewBlob(item.path, item.updatedAt)) {
    body.innerHTML = '<p class="cs-preview-loading">読み込み中…</p>';
  }

  if (isOfficePreviewableFilename(item.name)) {
    try {
      const info = await fetchOfficePreviewInfo(item.path);
      if (loadToken !== previewLoadToken) return;
      renderOfficePreview(body, info, item.name);
    } catch (err) {
      if (loadToken !== previewLoadToken) return;
      body.innerHTML = `<p class="cs-preview-loading">${escapeHtml(err.message)}</p>`;
    }
    return;
  }

  try {
    const { blob } = await resolvePreviewBlob(item, fetchDownloadBlob);
    if (loadToken !== previewLoadToken) return;
    await renderPreviewBlob(item, blob, body, { loadToken });
  } catch (err) {
    if (loadToken !== previewLoadToken) return;
    body.innerHTML = `<p class="cs-preview-loading">${escapeHtml(err.message)}</p>`;
  }
}

function previewAdjacent(delta) {
  if (previewQueue.length <= 1) return;
  const nextIndex = previewIndex + delta;
  if (nextIndex < 0 || nextIndex >= previewQueue.length) return;

  previewIndex = nextIndex;
  previewLoadToken += 1;
  const item = previewQueue[previewIndex];
  const dialog = document.getElementById("cs-preview-dialog");
  dialog?.showModal();
  loadPreviewContent(item, { loadToken: previewLoadToken });
}

/** ファイルをプレビュー */
async function previewFile(item) {
  const dialog = document.getElementById("cs-preview-dialog");
  if (!dialog) return;

  setupPreviewQueue(item);
  previewLoadToken += 1;
  const loadToken = previewLoadToken;
  dialog.showModal();
  await loadPreviewContent(item, { loadToken });
}

async function renameItem(item) {
  const newName = prompt("新しい名前", item.name);
  if (!newName?.trim() || newName === item.name) return;

  try {
    await apiRequest("rename", {
      method: "PATCH",
      body: JSON.stringify({ path: item.path, newName: newName.trim(), type: item.type }),
    });
    selectedItems.clear();
    showToast("名前を変更しました");
    await refreshListing();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function deleteItem(item) {
  if (!confirm(`「${item.name}」を削除しますか？`)) return;

  try {
    await apiRequest("delete", {
      method: "DELETE",
      body: JSON.stringify({ path: item.path, type: item.type }),
    });
    selectedItems.delete(item.path);
    showToast("削除しました");
    await refreshListing();
  } catch (err) {
    showToast(err.message, true);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatBytes(bytes) {
  if (bytes == null) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("ja-JP");
}

function showToast(message, isError = false) {
  const toast = document.getElementById("cs-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.toggle("is-error", isError);
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}

function setLoading(loading) {
  document.getElementById("cs-main")?.classList.toggle("is-loading", loading);
}

function loadSortPreference() {
  try {
    const raw = sessionStorage.getItem(SORT_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const allowedFields = ["name", "updatedAt", "createdAt", "createdBy", "updatedBy", "size"];
    if (allowedFields.includes(parsed.field)) sortField = parsed.field;
    if (parsed.order === "asc" || parsed.order === "desc") sortOrder = parsed.order;
  } catch {
    /* ignore */
  }
}

function saveSortPreference() {
  sessionStorage.setItem(SORT_STORAGE_KEY, JSON.stringify({ field: sortField, order: sortOrder }));
}

function syncSortSelect() {
  const select = document.getElementById("cs-sort-field");
  if (!select) return;
  const option = select.querySelector(`option[value="${sortField}"]`);
  if (option) select.value = sortField;
}

function updateSortUi() {
  syncSortSelect();
  const orderBtn = document.getElementById("cs-sort-order");
  if (orderBtn) orderBtn.textContent = sortOrder === "asc" ? "昇順" : "降順";

  document.querySelectorAll(".cs-sortable-th").forEach((th) => {
    const field = th.dataset.sort;
    const isActive = field === sortField;
    th.classList.toggle("is-sorted", isActive);
    const indicator = th.querySelector(".cs-sort-indicator");
    if (indicator) {
      indicator.textContent = isActive ? (sortOrder === "asc" ? "▲" : "▼") : "";
    }
  });
}

function getTableColSpan() {
  return searchActive ? 6 : 5;
}

function readSearchForm() {
  searchQuery = document.getElementById("cs-search-input")?.value?.trim() ?? "";
  searchScope = document.getElementById("cs-search-scope")?.value ?? "folder";
  searchUpdatedFrom = document.getElementById("cs-search-updated-from")?.value ?? "";
  searchUpdatedTo = document.getElementById("cs-search-updated-to")?.value ?? "";
}

function hasSearchCriteria() {
  return Boolean(searchQuery || searchUpdatedFrom || searchUpdatedTo);
}

function updateSearchUi() {
  const table = document.getElementById("cs-files-table");
  const locationTh = document.getElementById("cs-search-location-th");
  const clearBtn = document.getElementById("cs-search-clear");
  const statusEl = document.getElementById("cs-search-status");

  table?.classList.toggle("is-search-mode", searchActive);
  if (locationTh) locationTh.hidden = !searchActive;
  if (clearBtn) clearBtn.hidden = !searchActive;

  if (statusEl) {
    if (searchActive && searchStatusText) {
      statusEl.hidden = false;
      statusEl.textContent = searchStatusText;
    } else {
      statusEl.hidden = true;
      statusEl.textContent = "";
    }
  }
}

function applySearch() {
  readSearchForm();
  if (!hasSearchCriteria()) {
    showToast("ファイル名または更新日時の範囲を指定してください", true);
    return;
  }
  searchActive = true;
  selectedItems.clear();
  selectionAnchorIndex = -1;
  updateSearchUi();
  loadSearchResults();
}

function clearSearch() {
  searchActive = false;
  searchStatusText = "";
  selectedItems.clear();
  selectionAnchorIndex = -1;
  updateSearchUi();
  loadDirectory();
}

function refreshListing() {
  if (searchActive) loadSearchResults();
  else loadDirectory();
}

function bindSearchControls() {
  document.getElementById("cs-search-btn")?.addEventListener("click", applySearch);
  document.getElementById("cs-search-clear")?.addEventListener("click", () => {
    const input = document.getElementById("cs-search-input");
    const from = document.getElementById("cs-search-updated-from");
    const to = document.getElementById("cs-search-updated-to");
    if (input) input.value = "";
    if (from) from.value = "";
    if (to) to.value = "";
    searchQuery = "";
    searchUpdatedFrom = "";
    searchUpdatedTo = "";
    clearSearch();
  });

  document.getElementById("cs-search-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applySearch();
    }
  });
}

function buildSearchRequestPath(pathSnapshot, offset) {
  const params = new URLSearchParams({
    path: pathSnapshot,
    offset: String(offset),
    limit: String(LIST_PAGE_SIZE),
    sort: sortField,
    order: sortOrder,
    scope: searchScope,
    q: searchQuery,
  });
  if (searchUpdatedFrom) params.set("updatedFrom", searchUpdatedFrom);
  if (searchUpdatedTo) params.set("updatedTo", searchUpdatedTo);
  return `search?${params.toString()}`;
}

async function loadSearchResults() {
  if (!currentPath) return;

  readSearchForm();
  if (!hasSearchCriteria()) {
    clearSearch();
    return;
  }

  const generation = ++listLoadGeneration;
  resetThumbnailLoads(generation);
  const pathSnapshot = currentPath;

  listItems = [];
  renderBreadcrumb();
  setFileListLoading();
  setLoading(true);
  updateSearchUi();

  let offset = 0;
  let total = null;

  try {
    while (true) {
      const data = await apiRequest(buildSearchRequestPath(pathSnapshot, offset));

      if (generation !== listLoadGeneration || currentPath !== pathSnapshot) return;

      if (total === null) {
        total = data.total ?? data.items?.length ?? 0;
        const scopeLabel = SEARCH_SCOPE_LABELS[data.search?.scope ?? searchScope] ?? "";
        const queryLabel = (data.search?.query ?? searchQuery) || "（名前指定なし）";
        searchStatusText = `検索結果: ${total} 件 · ${scopeLabel} · ${queryLabel}`;
        updateSearchUi();

        if (total === 0) {
          setFileListEmpty("該当するファイルがありません");
          break;
        }
        setLoading(false);
      }

      const pageItems = data.items ?? [];
      listItems.push(...pageItems);
      appendFileListRows(pageItems);
      offset += pageItems.length;

      if (!data.hasMore || pageItems.length === 0) {
        clearFileListStatusRows();
        break;
      }

      setFileListLoadingMore(offset, total);
    }

    if (generation === listLoadGeneration) {
      await loadQuota();
    }
  } catch (err) {
    if (generation === listLoadGeneration) {
      showToast(err.message, true);
      setFileListEmpty("検索に失敗しました");
    }
  } finally {
    if (generation === listLoadGeneration) {
      setLoading(false);
      clearFileListStatusRows();
    }
  }
}

function applySort(field, { toggle = false } = {}) {
  if (toggle && sortField === field) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  } else {
    sortField = field;
    if (!toggle) sortOrder = "asc";
  }
  saveSortPreference();
  updateSortUi();
  refreshListing();
}

function buildListRequestPath(pathSnapshot, offset) {
  return `list?path=${encodeURIComponent(pathSnapshot)}&offset=${offset}&limit=${LIST_PAGE_SIZE}&sort=${encodeURIComponent(sortField)}&order=${encodeURIComponent(sortOrder)}`;
}

function bindSortControls() {
  document.getElementById("cs-sort-field")?.addEventListener("change", (e) => {
    applySort(e.target.value);
  });

  document.getElementById("cs-sort-order")?.addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    saveSortPreference();
    updateSortUi();
    refreshListing();
  });

  document.querySelectorAll(".cs-sortable-th").forEach((th) => {
    th.addEventListener("click", () => {
      const field = th.dataset.sort;
      if (!field) return;
      applySort(field, { toggle: true });
    });
  });
}

async function checkAccess() {
  const res = await fetch("/api/apps/cloud-storage/access", {
    credentials: "same-origin",
  });
  if (res.status === 401) {
    window.location.href = "/?next=" + encodeURIComponent(window.location.pathname);
    return false;
  }
  const data = await res.json().catch(() => ({}));
  if (!data.allowed) {
    document.getElementById("cs-denied").hidden = false;
    return false;
  }
  document.getElementById("cs-app").hidden = false;
  return true;
}

function renderRoots() {
  const list = document.getElementById("cs-roots");
  if (!list) return;
  list.innerHTML = roots
    .map(
      (root) => `
    <button type="button" class="cs-root-item${currentPath.startsWith(root.path) ? " is-active" : ""}" data-path="${escapeHtml(root.path)}">
      <span class="cs-root-icon">${root.type === "user" ? "👤" : "👥"}</span>
      <span class="cs-root-label">${escapeHtml(root.label)}</span>
      <span class="cs-root-type">${root.type === "user" ? "個人" : "グループ"}</span>
    </button>`
    )
    .join("");

  list.querySelectorAll(".cs-root-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPath = btn.dataset.path;
      selectedItems.clear();
      selectionAnchorIndex = -1;
      refreshListing();
      renderRoots();
    });
  });
}

function renderBreadcrumb() {
  const el = document.getElementById("cs-breadcrumb");
  if (!el || !currentPath) {
    if (el) el.innerHTML = "";
    return;
  }

  const parts = currentPath.split("/");
  const crumbs = [];
  let acc = "";

  for (let i = 0; i < parts.length; i++) {
    acc = acc ? `${acc}/${parts[i]}` : parts[i];
    const label = i === 0 ? (parts[0] === "u" ? "個人" : "グループ") : i === 1 ? parts[1] : parts[i];
    crumbs.push({ path: acc, label });
  }

  el.innerHTML = crumbs
    .map(
      (c, idx) =>
        `<button type="button" class="cs-crumb${idx === crumbs.length - 1 ? " is-current" : ""}" data-path="${escapeHtml(c.path)}">${escapeHtml(c.label)}</button>`
    )
    .join('<span class="cs-crumb-sep">/</span>');

  el.querySelectorAll(".cs-crumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPath = btn.dataset.path;
      selectedItems.clear();
      selectionAnchorIndex = -1;
      refreshListing();
      renderRoots();
    });
  });
}

function buildFileRowHtml(item) {
  const selected = selectedItems.has(item.path);
  const locationCell = searchActive
    ? `<td class="cs-file-location" title="${escapeHtml(item.location ?? "/")}">${escapeHtml(item.location ?? "/")}</td>`
    : "";
  return `<tr class="cs-file-row cs-file-row--appear${selected ? " is-selected" : ""}" data-path="${escapeHtml(item.path)}" data-type="${item.type}">
    <td><input type="checkbox" class="cs-select" ${selected ? "checked" : ""} aria-label="選択"></td>
    <td><span class="cs-file-name-cell">${renderFileTypeIcon(item)}<span class="cs-file-name">${escapeHtml(item.name)}</span></span></td>
    ${locationCell}
    <td>${item.type === "folder" ? "—" : formatBytes(item.sizeBytes)}</td>
    <td>${formatDate(item.updatedAt)}</td>
    <td>${escapeHtml(item.updatedBy ?? "—")}</td>
  </tr>`;
}

function bindFileRowEvents(row) {
  row.addEventListener("click", (e) => {
    if (e.target.closest(".cs-select")) return;
    if (suppressRowClick) return;

    handleItemSelection(row.dataset.path, {
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
    });
  });

  const checkbox = row.querySelector(".cs-select");
  checkbox?.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const path = row.dataset.path;
    const index = getItemIndex(path);

    if (e.shiftKey && selectionAnchorIndex >= 0) {
      selectRange(selectionAnchorIndex, index);
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      handleItemSelection(path, { ctrlKey: true, metaKey: true });
      return;
    }

    handleItemSelection(path);
  });

  row.addEventListener("dblclick", (e) => {
    const path = row.dataset.path;
    const item = getItemByPath(path);
    if (!item) return;

    if (item.type === "folder") {
      currentPath = path;
      selectedItems.clear();
      selectionAnchorIndex = -1;
      refreshListing();
      renderRoots();
      return;
    }

    if (canPreviewFile(item)) previewFile(item);
    else downloadSingleFile(item.path, item.name);
  });

  row.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const item = getItemByPath(row.dataset.path);
    if (!item) return;

    if (!selectedItems.has(item.path)) {
      selectSingleItem(item.path);
      showContextMenu(e.clientX, e.clientY, item);
      return;
    }

    if (selectedItems.size > 1) {
      showMultiContextMenu(e.clientX, e.clientY);
      return;
    }

    showContextMenu(e.clientX, e.clientY, item);
  });
}

function getFileListBody() {
  return document.getElementById("cs-files-body");
}

function clearFileListStatusRows() {
  getFileListBody()
    ?.querySelectorAll(".cs-list-status-row")
    .forEach((row) => row.remove());
}

function setFileListLoading() {
  const tbody = getFileListBody();
  if (!tbody) return;
  tbody.innerHTML =
    `<tr class="cs-list-status-row"><td colspan="${getTableColSpan()}" class="cs-empty">読み込み中…</td></tr>`;
}

function setFileListEmpty(message = "フォルダは空です") {
  const tbody = getFileListBody();
  if (!tbody) return;
  tbody.innerHTML = `<tr class="cs-list-status-row"><td colspan="${getTableColSpan()}" class="cs-empty">${escapeHtml(message)}</td></tr>`;
}

function setFileListLoadingMore(loaded, total) {
  const tbody = getFileListBody();
  if (!tbody) return;
  clearFileListStatusRows();
  tbody.insertAdjacentHTML(
    "beforeend",
    `<tr class="cs-list-status-row" id="cs-list-loading-more"><td colspan="${getTableColSpan()}" class="cs-empty">さらに読み込み中… (${loaded}/${total})</td></tr>`
  );
}

function enqueueFolderThumbnails(items, generation) {
  if (searchActive) return;
  const folders = items.filter((item) => item.type === "folder");
  if (folders.length === 0) return;
  scheduleFolderThumbnails(folders, generation);
}

function enqueueFileThumbnails(items, generation) {
  if (searchActive) return;
  scheduleFileThumbnails(items, generation);
}

function enqueueListThumbnails(items, generation) {
  enqueueFolderThumbnails(items, generation);
  enqueueFileThumbnails(items, generation);
}

function appendFileListRows(items) {
  const tbody = getFileListBody();
  if (!tbody || items.length === 0) return;

  clearFileListStatusRows();
  const fragment = document.createDocumentFragment();
  const template = document.createElement("template");
  template.innerHTML = items.map((item) => buildFileRowHtml(item)).join("");
  fragment.append(...template.content.children);
  tbody.append(...fragment.children);

  tbody.querySelectorAll(".cs-file-row--appear").forEach((row) => {
    row.classList.remove("cs-file-row--appear");
    bindFileRowEvents(row);
  });

  enqueueListThumbnails(items, listLoadGeneration);
}

function renderFileList() {
  const tbody = getFileListBody();
  if (!tbody) return;

  if (listItems.length === 0) {
    setFileListEmpty();
    return;
  }

  tbody.innerHTML = listItems.map((item) => buildFileRowHtml(item)).join("");
  tbody.querySelectorAll(".cs-file-row").forEach((row) => {
    row.classList.remove("cs-file-row--appear");
    bindFileRowEvents(row);
  });

  enqueueListThumbnails(listItems, listLoadGeneration);
}

async function loadQuota() {
  if (!currentPath) return;
  try {
    const data = await apiRequest(`quota?path=${encodeURIComponent(currentPath)}`);
    const bar = document.getElementById("cs-quota-bar");
    const label = document.getElementById("cs-quota-label");
    const pct = data.quota_bytes > 0 ? (data.used_bytes / data.quota_bytes) * 100 : 0;
    if (bar) bar.style.width = `${Math.min(100, pct)}%`;
    if (label) {
      label.textContent = `${formatBytes(data.used_bytes)} / ${formatBytes(data.quota_bytes)}`;
    }
  } catch {
    /* ignore */
  }
}

async function loadDirectory() {
  if (!currentPath) return;

  const generation = ++listLoadGeneration;
  resetThumbnailLoads(generation);
  const pathSnapshot = currentPath;

  listItems = [];
  renderBreadcrumb();
  setFileListLoading();
  setLoading(true);

  let offset = 0;
  let total = null;

  try {
    while (true) {
      const data = await apiRequest(buildListRequestPath(pathSnapshot, offset));

      if (generation !== listLoadGeneration || currentPath !== pathSnapshot) return;

      if (total === null) {
        total = data.total ?? data.items?.length ?? 0;
        if (total === 0) {
          setFileListEmpty();
          break;
        }
        setLoading(false);
      }

      const pageItems = data.items ?? [];
      listItems.push(...pageItems);
      appendFileListRows(pageItems);
      offset += pageItems.length;

      if (!data.hasMore || pageItems.length === 0) {
        clearFileListStatusRows();
        break;
      }

      setFileListLoadingMore(offset, total);
    }

    if (generation === listLoadGeneration) {
      await loadQuota();
    }
  } catch (err) {
    if (generation === listLoadGeneration) {
      showToast(err.message, true);
      setFileListEmpty("読み込みに失敗しました");
    }
  } finally {
    if (generation === listLoadGeneration) {
      setLoading(false);
      clearFileListStatusRows();
    }
  }
}

async function loadRoots() {
  const data = await apiRequest("roots");
  roots = data.roots ?? [];
  if (!currentPath && roots.length > 0) {
    currentPath = roots[0].path;
  }
  renderRoots();
  await loadDirectory();
}

async function handleDownloadSelected() {
  const items = getSelectedItems();
  if (items.length === 0) {
    showToast("ダウンロードする項目を選択してください", true);
    return;
  }

  const prog = document.getElementById("cs-upload-progress");
  try {
    showToast("ダウンロードを開始します…");
    const result = await downloadItemsSequentially(items, {
      onProgress(done, total, filename) {
        if (!prog) return;
        prog.hidden = false;
        prog.textContent = `ダウンロード中… (${done}/${total}) ${filename}`;
      },
    });
    showToast(`${result.count} 件のダウンロードを開始しました`);
  } catch (err) {
    showToast(err.message, true);
  } finally {
    if (prog) prog.hidden = true;
  }
}

async function downloadFile(path) {
  try {
    const blob = await fetchDownloadBlob(path);
    const name = path.split("/").pop() ?? "download";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    showToast(err.message, true);
  }
}

async function handleUpload(files) {
  if (!currentPath || files.length === 0) return;

  let completed = 0;
  const total = files.length;

  uploadProgress.start(files);
  showToast(`${total} 件をアップロード中…`);

  await uploadFiles(currentPath, files, {
    onBatchStart(info) {
      uploadProgress.setBatch(info);
    },
    onFileStart(file, init) {
      uploadProgress.fileStarted(file, init);
    },
    onFileProgress(file, detail) {
      uploadProgress.fileProgress(file, detail);
    },
    onFileComplete(file, outcome) {
      completed += 1;
      uploadProgress.fileComplete(file, outcome);
      if (outcome.ok) {
        showToast(`${file.name} をアップロードしました`);
      } else {
        showToast(outcome.error?.message ?? `${file.name} のアップロードに失敗しました`, true);
      }
    },
  });

  uploadProgress.finish();
  await refreshListing();
}

async function handleMkdir() {
  const name = prompt("新しいフォルダ名");
  if (!name?.trim() || !currentPath) return;
  try {
    await apiRequest("mkdir", {
      method: "POST",
      body: JSON.stringify({ path: currentPath, name: name.trim() }),
    });
    showToast("フォルダを作成しました");
    await refreshListing();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function handleRename() {
  if (selectedItems.size !== 1) {
    showToast("リネームする項目を1つ選択してください", true);
    return;
  }
  const path = [...selectedItems][0];
  const item = getItemByPath(path);
  if (!item) return;
  await renameItem(item);
}

/** キューから最大 concurrency 件まで並列実行 */
async function runParallelQueue(items, concurrency, worker) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item === undefined) break;
      await worker(item);
    }
  });
  await Promise.all(workers);
}

async function handleDelete() {
  if (selectedItems.size === 0) {
    showToast("削除する項目を選択してください", true);
    return;
  }
  if (!confirm(`${selectedItems.size} 件を削除しますか？`)) return;

  const prog = document.getElementById("cs-delete-progress");
  const tasks = [...selectedItems]
    .map((path) => ({ path, item: getItemByPath(path) }))
    .filter((entry) => entry.item);
  const total = tasks.length;
  if (total === 0) return;

  let done = 0;
  const failures = [];
  const succeededPaths = [];

  const updateDeleteProgress = () => {
    if (!prog) return;
    prog.hidden = false;
    prog.textContent = `選択ファイルを削除中… (${done}/${total})`;
  };

  try {
    updateDeleteProgress();

    await runParallelQueue(tasks, PARALLEL_DELETE, async ({ path, item }) => {
      try {
        await apiRequest("delete", {
          method: "DELETE",
          body: JSON.stringify({ path, type: item.type }),
        });
        succeededPaths.push(path);
      } catch (err) {
        failures.push({ name: item.name, message: err.message });
      } finally {
        done += 1;
        updateDeleteProgress();
      }
    });

    for (const path of succeededPaths) {
      selectedItems.delete(path);
    }

    if (failures.length === 0) {
      showToast("削除しました");
    } else if (succeededPaths.length === 0) {
      showToast(failures[0]?.message ?? "削除に失敗しました", true);
    } else {
      showToast(`${succeededPaths.length} 件削除、${failures.length} 件失敗`, true);
    }

    if (succeededPaths.length > 0) {
      await refreshListing();
    }
  } finally {
    if (prog) prog.hidden = true;
  }
}

function bindEvents() {
  bindMarqueeSelection();
  bindSortControls();
  bindSearchControls();

  document.getElementById("cs-upload-input")?.addEventListener("change", (e) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    if (files.length) handleUpload(files);
  });

  document.getElementById("cs-upload-btn")?.addEventListener("click", () => {
    document.getElementById("cs-upload-input")?.click();
  });

  document.getElementById("cs-mkdir-btn")?.addEventListener("click", handleMkdir);
  document.getElementById("cs-delete-btn")?.addEventListener("click", handleDelete);
  document.getElementById("cs-rename-btn")?.addEventListener("click", handleRename);
  document.getElementById("cs-download-btn")?.addEventListener("click", handleDownloadSelected);

  document.addEventListener("click", (e) => {
    const menu = document.getElementById("cs-context-menu");
    if (!menu || menu.hidden) return;
    if (!menu.contains(e.target)) hideContextMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideContextMenu();
  });

  document.addEventListener("scroll", hideContextMenu, true);
  window.addEventListener("resize", hideContextMenu);

  document.getElementById("cs-preview-close")?.addEventListener("click", closePreview);
  document.getElementById("cs-preview-close-btn")?.addEventListener("click", closePreview);
  document.getElementById("cs-preview-dialog")?.addEventListener("close", cleanupPreview);
  document.getElementById("cs-preview-prev")?.addEventListener("click", () => previewAdjacent(-1));
  document.getElementById("cs-preview-next")?.addEventListener("click", () => previewAdjacent(1));
  document.getElementById("cs-preview-dialog")?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      previewAdjacent(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      previewAdjacent(1);
    }
  });
  document.getElementById("cs-preview-download")?.addEventListener("click", () => {
    if (previewPath) downloadFile(previewPath);
  });

  const dropZone = document.getElementById("cs-drop-zone");
  dropZone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("is-dragover");
  });
  dropZone?.addEventListener("dragleave", () => {
    dropZone.classList.remove("is-dragover");
  });
  dropZone?.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("is-dragover");
    const files = [...(e.dataTransfer?.files ?? [])];
    if (files.length) handleUpload(files);
  });
}

async function init() {
  const ok = await checkAccess();
  if (!ok) return;
  loadSortPreference();
  bindEvents();
  updateSortUi();
  await loadRoots();
}

init();
