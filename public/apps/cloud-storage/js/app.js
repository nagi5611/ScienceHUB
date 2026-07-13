/**
 * クラウドストレージ エクスプローラー
 */

import { apiRequest, createShareLink, createShortcutLink, fetchDownloadBlob, moveStorageItems } from "./api.js";
import { resolvePreviewBlob } from "./preview-cache.js";
import {
  clearSessionPreviewCache,
  getSessionPreviewBlob,
  getSessionPreviewObjectUrl,
} from "./preview-session-cache.js";
import { uploadFiles } from "./upload.js";
import { collectFilesFromDataTransfer, isFolderUpload } from "./folder-upload.js";
import {
  collectMediaFilesFromClipboard,
  shouldIgnorePasteTarget,
} from "./clipboard-paste.js";
import { loadViewModeForPath, saveViewModeForPath, hasViewModeForPath } from "./view-mode.js";
import { clearInactiveFileListRoot } from "./list-dom.js";
import { ICON_THUMB_MAX_EDGE } from "./media-thumb.js";
import { createUploadProgress } from "./upload-progress.js";
import {
  classifyFile,
  getSameCategoryPreviewItems,
  isExcalidrawFilename,
  isOfficePreviewableFilename,
  isPreviewableFile,
  needsLargePreviewWarning,
  PREVIEW_LARGE_WARNING_BYTES,
  renderFileTypeIcon,
} from "./file-icons.js";
import { downloadItems, downloadSingleFile } from "./download-zip.js";
import { scheduleFolderThumbnails } from "./folder-thumbnails.js";
import { scheduleFileThumbnails } from "./file-thumbnails.js";
import { resetThumbnailLoads } from "./thumbnail-session.js";
import { mountModel3dPreview, unmountModel3dPreview, ensureModelBlobType } from "./preview-model3d.js";
import {
  mountExcalidrawPreview,
  unmountExcalidrawPreview,
} from "./preview-excalidraw.js";
import {
  clearOfficePreview,
  fetchOfficePreviewInfo,
  openOfficeInBrowserTab,
  openOfficeInDesktopApp,
  openOfficeInDesktopAppByPath,
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
let currentOfficePreviewInfo = null;
let selectionAnchorIndex = -1;
let suppressRowClick = false;

const MARQUEE_DRAG_THRESHOLD = 4;
const LIST_PAGE_SIZE = 40;
const SORT_STORAGE_KEY = "cs-sort";
const PARALLEL_DELETE = 8;
const STORAGE_MOVE_MIME = "application/x-sciencehub-storage-move";
let activeDragMoveItems = null;

let listLoadGeneration = 0;
let sortField = "name";
let sortOrder = "asc";

let searchActive = false;
let searchQuery = "";
let searchScope = "folder";
let searchUpdatedFrom = "";
let searchUpdatedTo = "";
let searchStatusText = "";
let trashView = false;
let trashQuota = { totalBytes: 0, quotaBytes: 50 * 1024 ** 3 };
let viewMode = "list";

const SEARCH_SCOPE_LABELS = {
  folder: "このフォルダ内",
  subtree: "サブフォルダを含む",
  root: "ルート全体",
};

const uploadProgress = createUploadProgress();

const MOBILE_MEDIA = "(max-width: 768px)";

function isMobileLayout() {
  return window.matchMedia(MOBILE_MEDIA).matches;
}

function closeSidebarDrawer() {
  const sidebar = document.getElementById("cs-sidebar");
  const backdrop = document.getElementById("cs-drawer-backdrop");
  const toggle = document.getElementById("cs-sidebar-toggle");
  sidebar?.classList.remove("is-open");
  if (backdrop) {
    backdrop.hidden = true;
    backdrop.classList.remove("is-visible");
    backdrop.setAttribute("aria-hidden", "true");
  }
  toggle?.setAttribute("aria-expanded", "false");
}

function openSidebarDrawer() {
  if (!isMobileLayout()) return;
  const sidebar = document.getElementById("cs-sidebar");
  const backdrop = document.getElementById("cs-drawer-backdrop");
  const toggle = document.getElementById("cs-sidebar-toggle");
  sidebar?.classList.add("is-open");
  if (backdrop) {
    backdrop.hidden = false;
    backdrop.classList.add("is-visible");
    backdrop.setAttribute("aria-hidden", "false");
  }
  toggle?.setAttribute("aria-expanded", "true");
}

function toggleSidebarDrawer() {
  const sidebar = document.getElementById("cs-sidebar");
  if (sidebar?.classList.contains("is-open")) closeSidebarDrawer();
  else openSidebarDrawer();
}

function closeToolbarMenu() {
  const menu = document.getElementById("cs-toolbar-menu");
  const more = document.getElementById("cs-toolbar-more");
  const backdrop = document.getElementById("cs-toolbar-menu-backdrop");
  const overflow = document.getElementById("cs-toolbar-overflow");
  if (menu) menu.hidden = true;
  more?.setAttribute("aria-expanded", "false");
  overflow?.classList.remove("is-open");
  if (backdrop) {
    backdrop.hidden = true;
    backdrop.setAttribute("aria-hidden", "true");
  }
}

function openToolbarMenu() {
  if (!isMobileLayout()) return;
  const menu = document.getElementById("cs-toolbar-menu");
  const more = document.getElementById("cs-toolbar-more");
  const backdrop = document.getElementById("cs-toolbar-menu-backdrop");
  const overflow = document.getElementById("cs-toolbar-overflow");
  if (!menu || !more) return;
  menu.hidden = false;
  more.setAttribute("aria-expanded", "true");
  overflow?.classList.add("is-open");
  if (backdrop) {
    backdrop.hidden = false;
    backdrop.setAttribute("aria-hidden", "false");
  }
}

function toggleToolbarMenu() {
  const menu = document.getElementById("cs-toolbar-menu");
  if (!menu) return;
  if (menu.hidden) openToolbarMenu();
  else closeToolbarMenu();
}

function bindMobileShellControls() {
  document.getElementById("cs-sidebar-toggle")?.addEventListener("click", toggleSidebarDrawer);
  document.getElementById("cs-drawer-backdrop")?.addEventListener("click", closeSidebarDrawer);
  document.getElementById("cs-toolbar-menu-backdrop")?.addEventListener("click", closeToolbarMenu);
  document.getElementById("cs-toolbar-more")?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleToolbarMenu();
  });

  document.addEventListener("click", (e) => {
    if (!isMobileLayout()) return;
    const menu = document.getElementById("cs-toolbar-menu");
    const overflow = document.getElementById("cs-toolbar-overflow");
    if (!menu || menu.hidden) return;
    if (overflow?.contains(e.target)) return;
    closeToolbarMenu();
  });

  document.getElementById("cs-toolbar-menu")?.addEventListener("click", (e) => {
    if (e.target.closest(".cs-btn")) {
      closeToolbarMenu();
    }
  });

  document.getElementById("cs-sort-field")?.addEventListener("change", () => {
    if (isMobileLayout()) closeToolbarMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeSidebarDrawer();
    closeToolbarMenu();
  });

  window.matchMedia(MOBILE_MEDIA).addEventListener("change", () => {
    closeSidebarDrawer();
    closeToolbarMenu();
  });
}

function resolveViewModeForPath(path) {
  if (hasViewModeForPath(path)) {
    return loadViewModeForPath(path);
  }
  if (isMobileLayout()) {
    return "icons";
  }
  return "list";
}

function isIconViewMode() {
  return viewMode === "icons" && !trashView;
}

function syncViewModeForCurrentPath() {
  if (trashView) {
    viewMode = "list";
  } else if (currentPath) {
    viewMode = resolveViewModeForPath(currentPath);
  } else {
    viewMode = "list";
  }
  updateViewModeUi();
}

function updateViewModeUi() {
  const table = document.getElementById("cs-files-table");
  const grid = document.getElementById("cs-icon-grid");
  const viewModeBar = document.getElementById("cs-view-mode");
  const icons = isIconViewMode();

  if (table) table.hidden = icons;
  if (grid) grid.hidden = !icons;
  if (viewModeBar) viewModeBar.hidden = trashView;

  document.querySelectorAll(".cs-view-mode-btn").forEach((btn) => {
    const active = btn.dataset.viewMode === viewMode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function handleViewModeChange(mode) {
  if (trashView || !currentPath || mode === viewMode) return;
  if (mode !== "list" && mode !== "icons") return;

  viewMode = mode;
  saveViewModeForPath(currentPath, mode);
  updateViewModeUi();

  if (listItems.length === 0) {
    setFileListEmpty();
    return;
  }
  renderFileList();
}

function bindViewModeControls() {
  document.querySelectorAll(".cs-view-mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleViewModeChange(btn.dataset.viewMode ?? "list");
    });
  });
}

function getRootPath(path) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length < 2) return path;
  return `${parts[0]}/${parts[1]}`;
}

function updateToolbarForView() {
  const explorerIds = [
    "cs-upload-btn",
    "cs-upload-folder-btn",
    "cs-mkdir-btn",
    "cs-download-btn",
    "cs-shortcut-btn",
    "cs-rename-btn",
    "cs-delete-btn",
    "cs-sort-field",
    "cs-sort-order",
    "cs-search-panel",
  ];
  const trashIds = [
    "cs-trash-back-btn",
    "cs-trash-restore-btn",
    "cs-trash-purge-btn",
    "cs-trash-empty-btn",
  ];

  for (const id of explorerIds) {
    const el = document.getElementById(id);
    if (el) el.hidden = trashView;
  }
  for (const id of trashIds) {
    const el = document.getElementById(id);
    if (el) el.hidden = !trashView;
  }

  const status = document.getElementById("cs-trash-status");
  if (status) status.hidden = !trashView;

  const sortControls = document.querySelector(".cs-sort-controls");
  if (sortControls) sortControls.hidden = trashView;
}

function enterTrashView(rootPath = null) {
  const target = rootPath ?? getRootPath(currentPath);
  if (!target) return;
  currentPath = target;
  trashView = true;
  searchActive = false;
  selectedItems.clear();
  selectionAnchorIndex = -1;
  updateSearchUi();
  updateToolbarForView();
  updateViewModeUi();
  renderRoots();
  refreshListing();
}

function exitTrashView() {
  trashView = false;
  selectedItems.clear();
  selectionAnchorIndex = -1;
  updateToolbarForView();
  updateViewModeUi();
  renderRoots();
  refreshListing();
}

function updateTrashStatus() {
  const bar = document.getElementById("cs-trash-quota-bar");
  const label = document.getElementById("cs-trash-quota-label");
  const headerBar = document.getElementById("cs-quota-bar");
  const headerLabel = document.getElementById("cs-quota-label");
  const pct =
    trashQuota.quotaBytes > 0
      ? Math.min(100, (trashQuota.totalBytes / trashQuota.quotaBytes) * 100)
      : 0;
  const text = `${formatBytes(trashQuota.totalBytes)} / ${formatBytes(trashQuota.quotaBytes)}`;

  for (const el of [bar, headerBar]) {
    if (!el) continue;
    el.style.width = `${pct}%`;
    el.classList.toggle("is-warning", pct >= 80 && pct < 95);
    el.classList.toggle("is-danger", pct >= 95);
  }

  if (label) label.textContent = text;
  if (headerLabel) headerLabel.textContent = `ごみ箱 ${text}`;
}

function applyQuotaBar(bar, usedBytes, quotaBytes) {
  if (!bar) return;
  const pct = quotaBytes > 0 ? Math.min(100, (usedBytes / quotaBytes) * 100) : 0;
  bar.style.width = `${pct}%`;
  bar.classList.toggle("is-warning", pct >= 80 && pct < 95);
  bar.classList.toggle("is-danger", pct >= 95);
}

function canDragMove() {
  return !trashView && !searchActive;
}

function getParentLogicalPath(path) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 2) return parts.join("/");
  return parts.slice(0, -1).join("/");
}

function isInvalidMoveTarget(sourcePath, sourceType, destPath) {
  if (!sourcePath || !destPath) return true;
  if (sourcePath === destPath) return true;
  if (getParentLogicalPath(sourcePath) === destPath) return true;
  if (sourceType === "folder") {
    if (destPath === sourcePath || destPath.startsWith(`${sourcePath}/`)) return true;
  }
  return false;
}

function getDragMoveItems(item) {
  const items = selectedItems.has(item.path)
    ? getSelectedItems().filter((entry) => entry.type === "file" || entry.type === "folder")
    : [item];
  return filterRedundantMoveItems(items);
}

function filterRedundantMoveItems(items) {
  const folderPaths = items
    .filter((entry) => entry.type === "folder")
    .map((entry) => entry.path);

  return items.filter((entry) => {
    const enclosed = folderPaths.some(
      (folderPath) => folderPath !== entry.path && entry.path.startsWith(`${folderPath}/`)
    );
    return !enclosed;
  });
}

function readDragMoveItems(dataTransfer) {
  const raw = dataTransfer.getData(STORAGE_MOVE_MIME);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function clearDropTargetHighlight() {
  document
    .querySelectorAll(".is-drop-target")
    .forEach((el) => el.classList.remove("is-drop-target"));
}

function bindStorageDropTarget(el, destPath) {
  if (!el || el.dataset.dropBound === "1") return;
  el.dataset.dropBound = "1";

  el.addEventListener("dragenter", (e) => {
    if (!activeDragMoveItems?.length) return;
    e.preventDefault();
  });

  el.addEventListener("dragover", (e) => {
    if (!activeDragMoveItems?.length) return;
    const blocked = activeDragMoveItems.some((item) =>
      isInvalidMoveTarget(item.path, item.type, destPath)
    );
    if (blocked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    clearDropTargetHighlight();
    el.classList.add("is-drop-target");
  });

  el.addEventListener("dragleave", (e) => {
    if (!el.contains(e.relatedTarget)) {
      el.classList.remove("is-drop-target");
    }
  });

  el.addEventListener("drop", async (e) => {
    const items = readDragMoveItems(e.dataTransfer) ?? activeDragMoveItems;
    if (!items?.length) return;
    e.preventDefault();
    e.stopPropagation();
    clearDropTargetHighlight();
    await handleStorageMoveDrop(items, destPath);
  });
}

async function handleStorageMoveDrop(items, destPath) {
  if (!canDragMove()) return;

  const movable = items.filter(
    (item) => !isInvalidMoveTarget(item.path, item.type, destPath)
  );
  if (!movable.length) return;

  try {
    const result = await moveStorageItems(
      movable.map((item) => ({ path: item.path, type: item.type })),
      destPath
    );
    const renamedCount = (result.moved ?? []).filter((entry) => entry.renamed).length;
    selectedItems.clear();
    selectionAnchorIndex = -1;
    if (renamedCount > 0) {
      showToast(
        `${result.moved.length} 件を移動しました（${renamedCount} 件は同名のため (1) 等を付与）`
      );
    } else {
      showToast(`${result.moved.length} 件を移動しました`);
    }
    await refreshListing();
  } catch (err) {
    showToast(err.message, true);
  }
}

function syncEntryDragState() {
  const draggable = canDragMove();
  document.querySelectorAll(".cs-file-entry").forEach((entry) => {
    const isSelected = selectedItems.has(entry.dataset.path);
    entry.draggable = draggable && isSelected;
    entry.classList.toggle("is-draggable", draggable && isSelected);
  });
}

function bindRowMoveDrag(row, item) {
  if (!item || row.dataset.moveDragBound === "1") return;
  row.dataset.moveDragBound = "1";

  row.addEventListener("dragstart", (e) => {
    if (!canDragMove() || !selectedItems.has(item.path)) {
      e.preventDefault();
      return;
    }

    const payload = getDragMoveItems(item).map((entry) => ({
      path: entry.path,
      type: entry.type,
    }));
    if (!payload.length) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData(STORAGE_MOVE_MIME, JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
    activeDragMoveItems = payload;
    row.classList.add("is-dragging");
  });

  row.addEventListener("dragend", () => {
    row.classList.remove("is-dragging");
    activeDragMoveItems = null;
    clearDropTargetHighlight();
  });
}

function getItemByPath(path) {
  return listItems.find((i) => i.path === path);
}

function canPreviewFile(item) {
  return isPreviewableFile(item);
}

function applySelectionToUi() {
  document.querySelectorAll(".cs-file-entry").forEach((entry) => {
    const selected = selectedItems.has(entry.dataset.path);
    entry.classList.toggle("is-selected", selected);
    const cb = entry.querySelector(".cs-select");
    if (cb) cb.checked = selected;
  });
  syncEntryDragState();
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

/** チェックボックス用: 他の選択を維持したまま1件だけ切り替え */
function toggleItemSelection(path) {
  const index = getItemIndex(path);
  if (index < 0) return;

  if (selectedItems.has(path)) {
    selectedItems.delete(path);
    if (selectedItems.size === 0) {
      selectionAnchorIndex = -1;
    }
  } else {
    selectedItems.add(path);
    selectionAnchorIndex = index;
  }
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

function getEntriesInMarquee(rect) {
  const domRect = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
  const paths = [];
  document.querySelectorAll(".cs-file-entry").forEach((entry) => {
    if (rectsIntersect(domRect, entry.getBoundingClientRect())) {
      paths.push(entry.dataset.path);
    }
  });
  return paths;
}

function clearMarqueePreview() {
  document.querySelectorAll(".cs-file-entry.is-marquee-preview").forEach((entry) => {
    entry.classList.remove("is-marquee-preview");
  });
}

function previewMarqueeSelection(rect) {
  const paths = new Set(getEntriesInMarquee(rect));
  document.querySelectorAll(".cs-file-entry").forEach((entry) => {
    entry.classList.toggle("is-marquee-preview", paths.has(entry.dataset.path));
  });
}

function applyMarqueeSelection(rect, addToSelection) {
  const paths = getEntriesInMarquee(rect);
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
    const iconGrid = document.getElementById("cs-icon-grid");
    if (!tbody && !iconGrid) return;

    const onEntry = e.target.closest(".cs-file-entry");
    const onStatusRow = e.target.closest(".cs-list-status-row, .cs-icon-grid-status");
    const onHeader = e.target.closest("thead");
    const onCheckbox = e.target.closest(".cs-select");
    const onWrapBackground = e.target === wrap;
    const onGridBackground = iconGrid && e.target === iconGrid;

    if (onCheckbox || onStatusRow || onHeader) return;
    if (onEntry && canDragMove() && selectedItems.has(onEntry.dataset.path)) return;
    if (!onEntry && !onWrapBackground && !onGridBackground) {
      const inListArea =
        (tbody && tbody.contains(e.target)) || (iconGrid && iconGrid.contains(e.target));
      if (!inListArea) return;
    }

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
  if (trashView || item.isTrash) {
    showTrashContextMenu(clientX, clientY, item);
    return;
  }

  const menu = document.getElementById("cs-context-menu");
  const title = document.getElementById("cs-context-menu-title");
  const itemsEl = document.getElementById("cs-context-menu-items");
  if (!menu || !title || !itemsEl) return;

  contextMenuItem = item;
  title.textContent = item.name;

  const actions = [];

  if (item.type === "folder") {
    actions.push({ id: "open", label: "開く" });
    actions.push({ id: "shortcut", label: "ショートカットリンクを取得" });
  } else {
    if (canPreviewFile(item)) {
      if (isOfficePreviewableFilename(item.name)) {
        actions.push({
          id: "preview-submenu",
          label: "プレビュー",
          children: [
            { id: "preview-browser", label: "ブラウザで表示" },
            { id: "preview-app", label: "アプリで表示" },
          ],
        });
      } else {
        actions.push({ id: "preview", label: "プレビュー" });
      }
    }
    actions.push({ id: "download", label: "ダウンロード" });
    actions.push({ id: "share", label: "共有リンクを作成" });
    actions.push({ id: "shortcut", label: "ショートカットリンクを取得" });
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
  if (trashView) {
    showTrashMultiContextMenu(clientX, clientY);
    return;
  }

  const menu = document.getElementById("cs-context-menu");
  const title = document.getElementById("cs-context-menu-title");
  const itemsEl = document.getElementById("cs-context-menu-items");
  if (!menu || !title || !itemsEl) return;

  contextMenuItem = null;
  const count = selectedItems.size;
  title.textContent = `${count} 件を選択中`;

  const actions = [];
  const fileCount = getSelectedFileItems().length;
  if (fileCount > 0) {
    actions.push({ id: "share-selected", label: "共有リンクを作成" });
  }
  actions.push({ id: "shortcut-selected", label: "ショートカットリンクを取得" });
  actions.push({ id: "download-selected", label: "選択項目をダウンロード" });
  actions.push({ id: "sep" });
  actions.push({ id: "delete-selected", label: "選択項目を削除", danger: true });

  renderContextMenu(menu, title, itemsEl, clientX, clientY, actions, (action) => {
    handleMultiContextAction(action);
  });
}

/** ごみ箱: 単一項目のコンテキストメニュー */
function showTrashContextMenu(clientX, clientY, item) {
  const menu = document.getElementById("cs-context-menu");
  const title = document.getElementById("cs-context-menu-title");
  const itemsEl = document.getElementById("cs-context-menu-items");
  if (!menu || !title || !itemsEl) return;

  contextMenuItem = item;
  title.textContent = item.name;

  const actions = [
    { id: "trash-restore", label: "復元" },
    { id: "sep" },
    { id: "trash-purge", label: "完全に削除", danger: true },
  ];

  renderContextMenu(menu, title, itemsEl, clientX, clientY, actions, (action) => {
    handleTrashContextAction(action, item);
  });
}

/** ごみ箱: 複数選択時のコンテキストメニュー */
function showTrashMultiContextMenu(clientX, clientY) {
  const menu = document.getElementById("cs-context-menu");
  const title = document.getElementById("cs-context-menu-title");
  const itemsEl = document.getElementById("cs-context-menu-items");
  if (!menu || !title || !itemsEl) return;

  contextMenuItem = null;
  title.textContent = `${selectedItems.size} 件を選択中`;

  const actions = [
    { id: "trash-restore-selected", label: "選択項目を復元" },
    { id: "sep" },
    { id: "trash-purge-selected", label: "選択項目を完全に削除", danger: true },
  ];

  renderContextMenu(menu, title, itemsEl, clientX, clientY, actions, (action) => {
    handleTrashMultiContextAction(action);
  });
}

function handleTrashContextAction(action, item) {
  switch (action) {
    case "trash-restore":
      handleTrashRestore([item]);
      break;
    case "trash-purge":
      handleTrashPurge([item]);
      break;
    default:
      break;
  }
}

function handleTrashMultiContextAction(action) {
  switch (action) {
    case "trash-restore-selected":
      handleTrashRestore();
      break;
    case "trash-purge-selected":
      handleTrashPurge();
      break;
    default:
      break;
  }
}

function renderContextMenuAction(action) {
  if (action.id === "sep") {
    return '<div class="cs-context-menu-sep" role="separator"></div>';
  }

  if (action.children?.length) {
    const childButtons = action.children
      .map(
        (child) =>
          `<button type="button" class="cs-context-menu-item" data-action="${child.id}" role="menuitem">${escapeHtml(child.label)}</button>`
      )
      .join("");
    return `<div class="cs-context-menu-item has-submenu" role="none">
      <button type="button" class="cs-context-menu-submenu-trigger" aria-haspopup="true" aria-expanded="false">
        <span>${escapeHtml(action.label)}</span>
        <span class="cs-context-menu-chevron" aria-hidden="true">›</span>
      </button>
      <div class="cs-context-submenu" role="menu">${childButtons}</div>
    </div>`;
  }

  return `<button type="button" class="cs-context-menu-item${action.danger ? " is-danger" : ""}" data-action="${action.id}" role="menuitem">${escapeHtml(action.label)}</button>`;
}

function bindContextSubmenus(itemsEl) {
  const mobile = isMobileLayout();
  itemsEl.querySelectorAll(".cs-context-menu-item.has-submenu").forEach((item) => {
    const trigger = item.querySelector(".cs-context-menu-submenu-trigger");
    const submenu = item.querySelector(".cs-context-submenu");
    if (!trigger) return;

    const positionSubmenu = () => {
      if (!submenu || mobile) return;
      submenu.style.left = "";
      submenu.style.right = "";
      submenu.style.top = "";
      const submenuRect = submenu.getBoundingClientRect();
      const padding = 8;
      if (submenuRect.right > window.innerWidth - padding) {
        submenu.style.left = "auto";
        submenu.style.right = "calc(100% - 2px)";
      }
      if (submenuRect.bottom > window.innerHeight - padding) {
        submenu.style.top = "auto";
        submenu.style.bottom = "0";
      }
    };

    const open = () => {
      itemsEl.querySelectorAll(".cs-context-menu-item.has-submenu.is-open").forEach((other) => {
        if (other !== item) other.classList.remove("is-open");
      });
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      requestAnimationFrame(positionSubmenu);
    };

    const close = () => {
      item.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      if (submenu) {
        submenu.style.left = "";
        submenu.style.right = "";
        submenu.style.top = "";
        submenu.style.bottom = "";
      }
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (item.classList.contains("is-open")) close();
      else open();
    });

    if (!mobile) {
      item.addEventListener("mouseenter", open);
      item.addEventListener("mouseleave", close);
    }
  });
}

function renderContextMenu(menu, _title, itemsEl, clientX, clientY, actions, onAction) {
  itemsEl.innerHTML = actions.map((action) => renderContextMenuAction(action)).join("");

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

  bindContextSubmenus(itemsEl);

  itemsEl.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      onAction(btn.dataset.action);
      hideContextMenu();
    });
  });
}

function handleMultiContextAction(action) {
  switch (action) {
    case "share-selected":
      openShareDialog(getSelectedFileItems());
      break;
    case "shortcut-selected":
      openShortcutDialogFromSelection();
      break;
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
    case "preview-browser":
      previewFile(item);
      break;
    case "preview-app":
      openOfficeInDesktopAppByPath(item.path).catch((err) => {
        showToast(err.message ?? "アプリで開けませんでした", true);
      });
      break;
    case "download":
      downloadSingleFile(item.path, item.name);
      break;
    case "share":
      openShareDialog([item]);
      break;
    case "shortcut":
      openShortcutDialogForItem(item);
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

function updateOfficePreviewFooter(info) {
  currentOfficePreviewInfo = info;
  const browserBtn = document.getElementById("cs-preview-office-browser");
  const appBtn = document.getElementById("cs-preview-office-app");
  const isOffice = Boolean(info);
  if (browserBtn) browserBtn.hidden = !isOffice;
  if (appBtn) appBtn.hidden = !isOffice || !info?.desktopScheme;
}

function updateExcalidrawPreviewFooter(item) {
  const editBtn = document.getElementById("cs-preview-excalidraw-edit");
  if (!editBtn) return;
  const show = Boolean(item && isExcalidrawFilename(item.name));
  editBtn.hidden = !show;
  if (show) editBtn.dataset.path = item.path;
}

function closePreview() {
  document.getElementById("cs-preview-dialog")?.close();
}

/** プレビューダイアログ閉鎖時の後片付け（close イベントから1回だけ呼ぶ） */
function cleanupPreview() {
  const body = document.getElementById("cs-preview-body");
  if (body) {
    unmountModel3dPreview(body);
    unmountExcalidrawPreview(body);
    clearOfficePreview(body);
    body.classList.remove("cs-preview-body--model3d", "cs-preview-body--excalidraw");
    body.innerHTML = "";
  }
  clearSessionPreviewCache();
  updateOfficePreviewFooter(null);
  updateExcalidrawPreviewFooter(null);
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
  unmountExcalidrawPreview(body);
  clearOfficePreview(body);
  body.classList.remove(
    "cs-preview-body--model3d",
    "cs-preview-body--office",
    "cs-preview-body--excalidraw"
  );
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

  if (kind === "excalidraw" || isExcalidrawFilename(item.name)) {
    await mountExcalidrawPreview(body, blob, item.name);
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
      updateOfficePreviewFooter(info);
      updateExcalidrawPreviewFooter(null);
    } catch (err) {
      if (loadToken !== previewLoadToken) return;
      updateOfficePreviewFooter(null);
      updateExcalidrawPreviewFooter(null);
      body.innerHTML = `<p class="cs-preview-loading">${escapeHtml(err.message)}</p>`;
    }
    return;
  }

  updateOfficePreviewFooter(null);
  updateExcalidrawPreviewFooter(
    isExcalidrawFilename(item.name) ? item : null
  );

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
  if (!confirm(`「${item.name}」をごみ箱に移動しますか？`)) return;

  try {
    await apiRequest("delete", {
      method: "DELETE",
      body: JSON.stringify({ path: item.path, type: item.type }),
    });
    selectedItems.delete(item.path);
    showTrashMovedToast();
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

function showToast(message, isError = false, action = null) {
  const toast = document.getElementById("cs-toast");
  if (!toast) return;

  clearTimeout(showToast._timer);
  toast.classList.toggle("is-error", isError);
  toast.classList.toggle("has-action", Boolean(action));

  if (action) {
    toast.innerHTML = `
      <p class="cs-toast-message">${escapeHtml(message)}</p>
      <button type="button" class="cs-toast-action">${escapeHtml(action.label)}</button>`;
    toast.querySelector(".cs-toast-action")?.addEventListener("click", () => {
      toast.hidden = true;
      action.onClick();
    });
  } else {
    toast.textContent = message;
  }

  toast.hidden = false;
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, action ? 8000 : 3500);
}

/** ごみ箱へ移動したあとのトースト（ごみ箱を開くボタン付き） */
function showTrashMovedToast(message = "ごみ箱に移動しました") {
  showToast(message, false, {
    label: "ごみ箱に移動",
    onClick: () => enterTrashView(),
  });
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
  if (trashView) return 6;
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
  syncViewModeForCurrentPath();
  if (trashView) loadTrash();
  else if (searchActive) loadSearchResults();
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

  syncViewModeForCurrentPath();
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
    .map((root) => {
      const isInRoot = currentPath.startsWith(root.path);
      const isTrashForRoot = trashView && getRootPath(currentPath) === root.path;
      return `
    <div class="cs-root-group">
      <button type="button" class="cs-root-item${!trashView && isInRoot ? " is-active" : ""}" data-path="${escapeHtml(root.path)}">
        <span class="cs-root-icon">${root.type === "user" ? "👤" : "👥"}</span>
        <span class="cs-root-label">${escapeHtml(root.label)}</span>
        <span class="cs-root-type">${root.type === "user" ? "個人" : "グループ"}</span>
      </button>
      ${
        isInRoot || isTrashForRoot
          ? `<button type="button" class="cs-root-trash${isTrashForRoot ? " is-active" : ""}" data-root-path="${escapeHtml(root.path)}" aria-label="${escapeHtml(root.label)}のごみ箱">
        <span class="cs-root-icon">🗑️</span>
        <span class="cs-root-label">ごみ箱</span>
      </button>`
          : ""
      }
    </div>`;
    })
    .join("");

  list.querySelectorAll(".cs-root-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      trashView = false;
      currentPath = btn.dataset.path;
      selectedItems.clear();
      selectionAnchorIndex = -1;
      updateToolbarForView();
      refreshListing();
      renderRoots();
      closeSidebarDrawer();
    });
  });

  list.querySelectorAll(".cs-root-trash").forEach((btn) => {
    btn.addEventListener("click", () => {
      enterTrashView(btn.dataset.rootPath);
      closeSidebarDrawer();
    });
  });
}

function renderBreadcrumb() {
  const el = document.getElementById("cs-breadcrumb");
  if (!el) return;

  if (trashView) {
    const rootPath = getRootPath(currentPath);
    const root = roots.find((r) => r.path === rootPath);
    const label = root?.label ?? rootPath;
    el.innerHTML = `<span class="cs-crumb is-current">ごみ箱 · ${escapeHtml(label)}</span>`;
    return;
  }

  if (!currentPath) {
    el.innerHTML = "";
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
    if (canDragMove()) {
      bindStorageDropTarget(btn, btn.dataset.path);
    }
  });
}

function buildFileRowHtml(item) {
  const selected = selectedItems.has(item.path);
  const locationCell = searchActive
    ? `<td class="cs-file-location" title="${escapeHtml(item.location ?? "/")}">${escapeHtml(item.location ?? "/")}</td>`
    : "";
  return `<tr class="cs-file-entry cs-file-row cs-file-row--appear${selected ? " is-selected" : ""}" data-path="${escapeHtml(item.path)}" data-type="${item.type}">
    <td><input type="checkbox" class="cs-select" ${selected ? "checked" : ""} aria-label="選択"></td>
    <td><span class="cs-file-name-cell">${renderFileTypeIcon(item)}<span class="cs-file-name">${escapeHtml(item.name)}</span></span></td>
    ${locationCell}
    <td>${item.type === "folder" ? "—" : formatBytes(item.sizeBytes)}</td>
    <td>${formatDate(item.updatedAt)}</td>
    <td>${escapeHtml(item.updatedBy ?? "—")}</td>
  </tr>`;
}

function buildFileIconTileHtml(item) {
  const selected = selectedItems.has(item.path);
  const locationMeta =
    searchActive && item.location
      ? `<p class="cs-icon-tile-meta" title="${escapeHtml(item.location)}">${escapeHtml(item.location)}</p>`
      : "";
  return `<div class="cs-file-entry cs-icon-tile cs-icon-tile--appear${selected ? " is-selected" : ""}" data-path="${escapeHtml(item.path)}" data-type="${item.type}" role="button" tabindex="0">
    <label class="cs-icon-tile-check">
      <input type="checkbox" class="cs-select" ${selected ? "checked" : ""} aria-label="${escapeHtml(item.name)} を選択">
    </label>
    <div class="cs-icon-tile-preview">${renderFileTypeIcon(item)}</div>
    <p class="cs-icon-tile-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</p>
    ${locationMeta}
  </div>`;
}

function bindFileEntryEvents(entry) {
  const item = getItemByPath(entry.dataset.path);

  entry.addEventListener("click", (e) => {
    if (e.target.closest(".cs-select, .cs-icon-tile-check")) return;
    if (suppressRowClick) return;

    handleItemSelection(entry.dataset.path, {
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
    });
  });

  const checkbox = entry.querySelector(".cs-select");
  checkbox?.addEventListener("click", (e) => {
    e.stopPropagation();
    const path = entry.dataset.path;
    const index = getItemIndex(path);

    if (e.shiftKey && selectionAnchorIndex >= 0) {
      e.preventDefault();
      selectRange(selectionAnchorIndex, index);
      return;
    }

    e.preventDefault();
    toggleItemSelection(path);
  });

  entry.addEventListener("dblclick", (e) => {
    const path = entry.dataset.path;
    const item = getItemByPath(path);
    if (!item) return;

    if (item.isTrash || trashView) return;

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

  entry.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.target.closest(".cs-select")) return;
    e.preventDefault();
    const path = entry.dataset.path;
    const item = getItemByPath(path);
    if (!item || item.isTrash || trashView) return;
    if (item.type === "folder") {
      currentPath = path;
      selectedItems.clear();
      selectionAnchorIndex = -1;
      refreshListing();
      renderRoots();
      return;
    }
    if (canPreviewFile(item)) previewFile(item);
  });

  entry.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const item = getItemByPath(entry.dataset.path);
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

  if (item && canDragMove()) bindRowMoveDrag(entry, item);

  if (item?.type === "folder" && canDragMove()) {
    bindStorageDropTarget(entry, item.path);
  }
}

function getIconGrid() {
  return document.getElementById("cs-icon-grid");
}

function getFileListBody() {
  return document.getElementById("cs-files-body");
}

function clearFileListStatusRows() {
  getFileListBody()
    ?.querySelectorAll(".cs-list-status-row")
    .forEach((row) => row.remove());
  getIconGrid()
    ?.querySelectorAll(".cs-icon-grid-status")
    .forEach((node) => node.remove());
}

function setFileListLoading() {
  clearInactiveFileListRoot();

  if (isIconViewMode()) {
    const grid = getIconGrid();
    if (!grid) return;
    grid.innerHTML = `<p class="cs-icon-grid-status">読み込み中…</p>`;
    return;
  }

  const tbody = getFileListBody();
  if (!tbody) return;
  tbody.innerHTML =
    `<tr class="cs-list-status-row"><td colspan="${getTableColSpan()}" class="cs-empty">読み込み中…</td></tr>`;
}

function setFileListEmpty(message = "フォルダは空です") {
  if (isIconViewMode()) {
    const grid = getIconGrid();
    if (!grid) return;
    grid.innerHTML = `<p class="cs-icon-grid-status cs-empty">${escapeHtml(message)}</p>`;
    return;
  }

  const tbody = getFileListBody();
  if (!tbody) return;
  tbody.innerHTML = `<tr class="cs-list-status-row"><td colspan="${getTableColSpan()}" class="cs-empty">${escapeHtml(message)}</td></tr>`;
}

function setFileListLoadingMore(loaded, total) {
  clearFileListStatusRows();
  if (isIconViewMode()) {
    getIconGrid()?.insertAdjacentHTML(
      "beforeend",
      `<p class="cs-icon-grid-status" id="cs-list-loading-more">さらに読み込み中… (${loaded}/${total})</p>`
    );
    return;
  }

  const tbody = getFileListBody();
  if (!tbody) return;
  tbody.insertAdjacentHTML(
    "beforeend",
    `<tr class="cs-list-status-row" id="cs-list-loading-more"><td colspan="${getTableColSpan()}" class="cs-empty">さらに読み込み中… (${loaded}/${total})</td></tr>`
  );
}

function getThumbnailOptions() {
  return isIconViewMode() ? { maxEdge: ICON_THUMB_MAX_EDGE } : {};
}

function enqueueFolderThumbnails(items, generation) {
  if (searchActive) return;
  const folders = items.filter((item) => item.type === "folder");
  if (folders.length === 0) return;
  scheduleFolderThumbnails(folders, generation, getThumbnailOptions());
}

function enqueueFileThumbnails(items, generation) {
  if (searchActive) return;
  scheduleFileThumbnails(items, generation, getThumbnailOptions());
}

function enqueueListThumbnails(items, generation) {
  enqueueFolderThumbnails(items, generation);
  enqueueFileThumbnails(items, generation);
}

function appendFileListRows(items) {
  if (items.length === 0) return;

  clearFileListStatusRows();

  if (isIconViewMode()) {
    const grid = getIconGrid();
    if (!grid) return;
    const template = document.createElement("template");
    template.innerHTML = items.map((item) => buildFileIconTileHtml(item)).join("");
    grid.append(...template.content.children);
    grid.querySelectorAll(".cs-icon-tile--appear").forEach((tile) => {
      tile.classList.remove("cs-icon-tile--appear");
      bindFileEntryEvents(tile);
    });
  } else {
    const tbody = getFileListBody();
    if (!tbody) return;
    const fragment = document.createDocumentFragment();
    const template = document.createElement("template");
    template.innerHTML = items.map((item) => buildFileRowHtml(item)).join("");
    fragment.append(...template.content.children);
    tbody.append(...fragment.children);
    tbody.querySelectorAll(".cs-file-row--appear").forEach((row) => {
      row.classList.remove("cs-file-row--appear");
      bindFileEntryEvents(row);
    });
  }

  enqueueListThumbnails(items, listLoadGeneration);
  syncEntryDragState();
}

function renderFileList() {
  clearInactiveFileListRoot();

  if (listItems.length === 0) {
    setFileListEmpty();
    return;
  }

  if (isIconViewMode()) {
    const grid = getIconGrid();
    if (!grid) return;
    grid.innerHTML = listItems.map((item) => buildFileIconTileHtml(item)).join("");
    grid.querySelectorAll(".cs-icon-tile").forEach((tile) => {
      tile.classList.remove("cs-icon-tile--appear");
      bindFileEntryEvents(tile);
    });
  } else {
    const tbody = getFileListBody();
    if (!tbody) return;
    tbody.innerHTML = listItems.map((item) => buildFileRowHtml(item)).join("");
    tbody.querySelectorAll(".cs-file-row").forEach((row) => {
      row.classList.remove("cs-file-row--appear");
      bindFileEntryEvents(row);
    });
  }

  enqueueListThumbnails(listItems, listLoadGeneration);
  syncEntryDragState();
}

async function loadQuota() {
  if (!currentPath || trashView) return;
  try {
    const data = await apiRequest(`quota?path=${encodeURIComponent(currentPath)}`);
    const bar = document.getElementById("cs-quota-bar");
    const label = document.getElementById("cs-quota-label");
    applyQuotaBar(bar, data.used_bytes, data.quota_bytes);
    if (label) {
      label.textContent = `${formatBytes(data.used_bytes)} / ${formatBytes(data.quota_bytes)}`;
    }
  } catch {
    /* ignore */
  }
}

async function loadTrash() {
  if (!currentPath) return;

  const generation = ++listLoadGeneration;
  const rootPath = getRootPath(currentPath);

  listItems = [];
  renderBreadcrumb();
  setFileListLoading();
  setLoading(true);

  try {
    const data = await apiRequest(`trash/list?path=${encodeURIComponent(rootPath)}`);
    if (generation !== listLoadGeneration || !trashView) return;

    trashQuota = {
      totalBytes: data.totalBytes ?? 0,
      quotaBytes: data.quotaBytes ?? trashQuota.quotaBytes,
    };
    updateTrashStatus();

    listItems = (data.items ?? []).map((item) => ({
      id: item.id,
      path: `trash:${item.id}`,
      name: item.originalName,
      type: item.itemType,
      sizeBytes: item.sizeBytes,
      deletedAt: item.deletedAt,
      daysRemaining: item.daysRemaining,
      originalLogicalPath: item.originalLogicalPath,
      isTrash: true,
    }));

    if (listItems.length === 0) {
      setFileListEmpty("ごみ箱は空です");
    } else {
      setLoading(false);
      renderTrashFileList();
    }
  } catch (err) {
    if (generation === listLoadGeneration) {
      showToast(err.message, true);
      setFileListEmpty("ごみ箱の読み込みに失敗しました");
    }
  } finally {
    if (generation === listLoadGeneration) {
      setLoading(false);
      clearFileListStatusRows();
    }
  }
}

function buildTrashRowHtml(item) {
  const selected = selectedItems.has(item.path);
  return `<tr class="cs-file-entry cs-file-row cs-file-row--appear${selected ? " is-selected" : ""}" data-path="${escapeHtml(item.path)}" data-type="${item.type}">
    <td><input type="checkbox" class="cs-select" ${selected ? "checked" : ""} aria-label="選択"></td>
    <td><span class="cs-file-name-cell">${renderFileTypeIcon(item)}<span class="cs-file-name">${escapeHtml(item.name)}</span></span></td>
    <td>${item.type === "folder" ? "—" : formatBytes(item.sizeBytes)}</td>
    <td>${formatDate(item.deletedAt)}</td>
    <td>${item.daysRemaining}日</td>
    <td title="${escapeHtml(item.originalLogicalPath)}">${escapeHtml(item.originalLogicalPath)}</td>
  </tr>`;
}

function renderTrashFileList() {
  const tbody = getFileListBody();
  const thead = document.querySelector("#cs-files-table thead tr");
  if (thead) {
    thead.innerHTML = `
      <th scope="col" aria-label="選択"></th>
      <th scope="col">名前</th>
      <th scope="col">サイズ</th>
      <th scope="col">削除日時</th>
      <th scope="col">残り日数</th>
      <th scope="col">元の場所</th>`;
  }

  if (!tbody) return;
  if (listItems.length === 0) {
    setFileListEmpty("ごみ箱は空です");
    return;
  }

  tbody.innerHTML = listItems.map((item) => buildTrashRowHtml(item)).join("");
  tbody.querySelectorAll(".cs-file-row").forEach((row) => {
    row.classList.remove("cs-file-row--appear");
    bindFileEntryEvents(row);
  });
}

async function handleTrashRestore(explicitItems = null) {
  const items = (explicitItems ?? getSelectedItems()).filter((item) => item.isTrash);
  if (items.length === 0) {
    showToast("復元する項目を選択してください", true);
    return;
  }
  if (!confirm(`${items.length} 件を復元しますか？`)) return;

  let renamedCount = 0;
  for (const item of items) {
    try {
      const result = await apiRequest("trash/restore", {
        method: "POST",
        body: JSON.stringify({ id: item.id }),
      });
      if (result.renamed) renamedCount += 1;
    } catch (err) {
      showToast(err.message, true);
      await loadTrash();
      return;
    }
  }

  selectedItems.clear();
  if (renamedCount > 0) {
    showToast(`${items.length} 件を復元しました（${renamedCount} 件は同名のため (1) 等を付与）`);
  } else {
    showToast(`${items.length} 件を復元しました`);
  }
  await loadTrash();
}

async function handleTrashPurge(explicitItems = null) {
  const items = (explicitItems ?? getSelectedItems()).filter((item) => item.isTrash);
  if (items.length === 0) {
    showToast("完全削除する項目を選択してください", true);
    return;
  }
  if (!confirm(`${items.length} 件を完全に削除しますか？この操作は取り消せません。`)) return;

  for (const item of items) {
    try {
      await apiRequest("trash/purge", {
        method: "DELETE",
        body: JSON.stringify({ id: item.id }),
      });
    } catch (err) {
      showToast(err.message, true);
      await loadTrash();
      return;
    }
  }

  selectedItems.clear();
  showToast("完全に削除しました");
  await loadTrash();
  await loadQuota();
}

async function handleTrashEmpty() {
  const rootPath = getRootPath(currentPath);
  if (!confirm("ごみ箱を空にしますか？すべての項目が完全に削除されます。")) return;

  try {
    const result = await apiRequest("trash/empty", {
      method: "DELETE",
      body: JSON.stringify({ path: rootPath }),
    });
    selectedItems.clear();
    showToast(`${result.purgedCount ?? 0} 件を完全に削除しました`);
    await loadTrash();
    await loadQuota();
  } catch (err) {
    showToast(err.message, true);
  }
}

function restoreExplorerTableHeader() {
  const thead = document.querySelector("#cs-files-table thead tr");
  if (!thead) return;
  thead.innerHTML = `
    <th scope="col" aria-label="選択"></th>
    <th scope="col" class="cs-sortable-th" data-sort="name">名前 <span class="cs-sort-indicator" aria-hidden="true"></span></th>
    <th scope="col" class="cs-search-location-th" id="cs-search-location-th" hidden>場所</th>
    <th scope="col" class="cs-sortable-th" data-sort="size">サイズ <span class="cs-sort-indicator" aria-hidden="true"></span></th>
    <th scope="col" class="cs-sortable-th" data-sort="updatedAt">更新日時 <span class="cs-sort-indicator" aria-hidden="true"></span></th>
    <th scope="col" class="cs-sortable-th" data-sort="updatedBy">更新者 <span class="cs-sort-indicator" aria-hidden="true"></span></th>`;
  updateSortUi();
  updateSearchUi();
}

async function loadDirectory() {
  if (!currentPath) return;

  syncViewModeForCurrentPath();
  restoreExplorerTableHeader();

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

  // ?path= ディープリンク（プロジェクト管理などから）
  if (!currentPath) {
    const initialPath = new URLSearchParams(location.search).get("path")?.trim() ?? "";
    if (initialPath) {
      const rootOfInitial = getRootPath(initialPath);
      const allowed = roots.some((r) => r.path === rootOfInitial || initialPath === r.path);
      if (allowed) {
        currentPath = initialPath;
      }
    }
  }

  if (!currentPath && roots.length > 0) {
    currentPath = roots[0].path;
  }
  syncViewModeForCurrentPath();
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
    const result = await downloadItems(items, {
      onProgress(done, total, filename) {
        if (!prog) return;
        prog.hidden = false;
        prog.textContent = `ダウンロード中… (${done}/${total}) ${filename}`;
      },
    });
    if (result.mode === "zip") {
      showToast(`${result.count} 件を ZIP でダウンロードしました`);
    } else if (result.mode === "single") {
      showToast("ダウンロードを開始しました");
    } else {
      showToast(`${result.count} 件のダウンロードを開始しました`);
    }
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

  let failed = 0;
  const total = files.length;
  const folderMode = isFolderUpload(files);

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
      uploadProgress.fileComplete(file, outcome);
      if (outcome.ok) {
        if (!folderMode) {
          showToast(`${file.name} をアップロードしました`);
        }
      } else {
        failed += 1;
        if (!folderMode) {
          showToast(outcome.error?.message ?? `${file.name} のアップロードに失敗しました`, true);
        }
      }
    },
  });

  uploadProgress.finish();
  if (folderMode) {
    if (failed === 0) {
      showToast(`${total} 件のアップロードが完了しました`);
    } else {
      showToast(`${total - failed} 件成功、${failed} 件失敗`, failed > 0);
    }
  }
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

/** 選択中のファイル項目のみ取得 */
function getSelectedFileItems() {
  return [...selectedItems]
    .map((path) => getItemByPath(path))
    .filter((item) => item && item.type !== "folder");
}

let shareDialogFiles = [];

function closeShareDialog() {
  document.getElementById("cs-share-dialog")?.close();
  shareDialogFiles = [];
}

function renderShareDialogForm(files) {
  const body = document.getElementById("cs-share-dialog-body");
  const footer = document.getElementById("cs-share-dialog-footer");
  const title = document.getElementById("cs-share-dialog-title");
  if (!body || !footer || !title) return;

  title.textContent = "共有リンクを作成";
  footer.innerHTML = `
    <button type="button" class="cs-btn" id="cs-share-dialog-cancel">キャンセル</button>
    <button type="button" class="cs-btn cs-btn-primary" id="cs-share-dialog-create">リンクを作成</button>
  `;

  body.innerHTML = `
    <p class="cs-share-dialog-lead">${files.length} 件のファイルを共有します。リンクは ScienceHUB アカウントなしで開けます。</p>
    <ul class="cs-share-file-list">
      ${files
        .map(
          (file) => `<li class="cs-share-file-item">
            <span class="cs-share-file-name">${escapeHtml(file.name)}</span>
            <span class="cs-share-file-size">${escapeHtml(formatBytes(file.sizeBytes))}</span>
          </li>`
        )
        .join("")}
    </ul>
    <label class="cs-share-limit-label" for="cs-share-max-downloads">ダウンロード回数上限</label>
    <div class="cs-share-limit-control">
      <input
        type="range"
        id="cs-share-max-downloads"
        class="cs-share-limit-slider"
        min="1"
        max="1000"
        step="1"
        value="10"
        aria-valuemin="1"
        aria-valuemax="1000"
        aria-valuenow="10"
      >
      <output class="cs-share-limit-value" id="cs-share-max-downloads-value" for="cs-share-max-downloads">10 回</output>
    </div>
    <p class="cs-share-limit-note">1〜1000 回（デフォルト 10 回）</p>
  `;

  const slider = document.getElementById("cs-share-max-downloads");
  const valueEl = document.getElementById("cs-share-max-downloads-value");
  const syncShareLimitValue = () => {
    if (!slider || !valueEl) return;
    valueEl.textContent = `${slider.value} 回`;
    slider.setAttribute("aria-valuenow", slider.value);
  };
  slider?.addEventListener("input", syncShareLimitValue);
  syncShareLimitValue();

  document.getElementById("cs-share-dialog-cancel")?.addEventListener("click", closeShareDialog);
  document.getElementById("cs-share-dialog-create")?.addEventListener("click", () => {
    handleShareCreate().catch((err) => showToast(err.message, true));
  });
}

function renderShareDialogResult(result) {
  const body = document.getElementById("cs-share-dialog-body");
  const footer = document.getElementById("cs-share-dialog-footer");
  const title = document.getElementById("cs-share-dialog-title");
  if (!body || !footer || !title) return;

  title.textContent = "共有リンクを作成しました";
  footer.innerHTML = `
    <button type="button" class="cs-btn cs-btn-primary" id="cs-share-dialog-done">閉じる</button>
  `;

  body.innerHTML = `
    <p class="cs-share-dialog-lead">以下のリンクを共有してください。残りダウンロード回数は ${escapeHtml(String(result.max_downloads))} 回です。</p>
    <div class="cs-share-result-row">
      <input type="text" class="cs-share-result-input" id="cs-share-result-url" readonly value="${escapeHtml(result.url)}">
      <button type="button" class="cs-btn" id="cs-share-copy-btn">コピー</button>
    </div>
  `;

  document.getElementById("cs-share-dialog-done")?.addEventListener("click", closeShareDialog);
  document.getElementById("cs-share-copy-btn")?.addEventListener("click", async () => {
    const input = document.getElementById("cs-share-result-url");
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input.value);
      showToast("リンクをコピーしました");
    } catch {
      input.select();
      document.execCommand("copy");
      showToast("リンクをコピーしました");
    }
  });
}

function openShareDialog(files) {
  const dialog = document.getElementById("cs-share-dialog");
  if (!dialog || files.length === 0) {
    showToast("共有するファイルを選択してください", true);
    return;
  }

  shareDialogFiles = files;
  renderShareDialogForm(files);
  if (!dialog.open) dialog.showModal();
}

async function handleShareCreate() {
  if (shareDialogFiles.length === 0) {
    showToast("共有するファイルがありません", true);
    return;
  }

  const input = document.getElementById("cs-share-max-downloads");
  const createBtn = document.getElementById("cs-share-dialog-create");
  const maxDownloads = Number(input?.value ?? 10);

  if (!Number.isFinite(maxDownloads) || maxDownloads < 1 || maxDownloads > 1000) {
    showToast("ダウンロード回数は 1〜1000 の範囲で指定してください", true);
    return;
  }

  if (createBtn) {
    createBtn.disabled = true;
    createBtn.textContent = "作成中…";
  }

  try {
    const result = await createShareLink(
      shareDialogFiles.map((file) => file.path),
      maxDownloads
    );
    renderShareDialogResult(result);
    showToast("共有リンクを作成しました");
  } finally {
    if (createBtn) {
      createBtn.disabled = false;
      createBtn.textContent = "リンクを作成";
    }
  }
}

/** 選択項目からショートカット先のフォルダパスを決定 */
function resolveShortcutTargetPath(items, fallbackPath = currentPath) {
  if (!items.length) {
    return fallbackPath?.trim() ?? "";
  }

  const folderPaths = items.map((item) => {
    if (item.type === "folder") return item.path;
    const parts = item.path.split("/").filter(Boolean);
    parts.pop();
    if (parts.length < 2) return getRootPath(item.path);
    return parts.join("/");
  });

  const uniquePaths = [...new Set(folderPaths.filter(Boolean))];
  if (uniquePaths.length === 1) return uniquePaths[0];
  return fallbackPath?.trim() ?? uniquePaths[0] ?? "";
}

function getShortcutLabelForPath(storagePath) {
  const parts = storagePath.split("/").filter(Boolean);
  if (parts.length <= 2) return parts[1] ?? storagePath;
  return parts[parts.length - 1] ?? storagePath;
}

let shortcutDialogPath = "";
let shortcutDialogLabel = "";

function closeShortcutDialog() {
  document.getElementById("cs-shortcut-dialog")?.close();
  shortcutDialogPath = "";
  shortcutDialogLabel = "";
}

function renderShortcutDialogForm(storagePath, label) {
  const body = document.getElementById("cs-shortcut-dialog-body");
  const footer = document.getElementById("cs-shortcut-dialog-footer");
  const title = document.getElementById("cs-shortcut-dialog-title");
  if (!body || !footer || !title) return;

  title.textContent = "ショートカットリンクを作成";
  footer.innerHTML = `
    <button type="button" class="cs-btn" id="cs-shortcut-dialog-cancel">キャンセル</button>
    <button type="button" class="cs-btn cs-btn-primary" id="cs-shortcut-dialog-create">リンクを作成</button>
  `;

  body.innerHTML = `
    <p class="cs-share-dialog-lead">このリンクを開くには ScienceHUB へのログインと、フォルダの閲覧権限が必要です。</p>
    <p class="cs-shortcut-path"><span class="cs-shortcut-path-label">フォルダ</span> ${escapeHtml(label)}</p>
    <p class="cs-shortcut-path-note">${escapeHtml(storagePath)}</p>
  `;

  document.getElementById("cs-shortcut-dialog-cancel")?.addEventListener("click", closeShortcutDialog);
  document.getElementById("cs-shortcut-dialog-create")?.addEventListener("click", () => {
    handleShortcutCreate().catch((err) => showToast(err.message, true));
  });
}

function renderShortcutDialogResult(result) {
  const body = document.getElementById("cs-shortcut-dialog-body");
  const footer = document.getElementById("cs-shortcut-dialog-footer");
  const title = document.getElementById("cs-shortcut-dialog-title");
  if (!body || !footer || !title) return;

  title.textContent = "ショートカットリンクを作成しました";
  footer.innerHTML = `
    <button type="button" class="cs-btn cs-btn-primary" id="cs-shortcut-dialog-done">閉じる</button>
  `;

  body.innerHTML = `
    <p class="cs-share-dialog-lead">以下のリンクを共有してください。閲覧権限のあるユーザーのみ開けます。</p>
    <label class="cs-share-limit-label" for="cs-shortcut-url">ショートカット URL</label>
    <div class="cs-share-result-row">
      <input type="text" class="cs-share-result-input" id="cs-shortcut-url" readonly value="${escapeHtml(result.url)}">
      <button type="button" class="cs-btn" id="cs-shortcut-copy">コピー</button>
    </div>
  `;

  document.getElementById("cs-shortcut-dialog-done")?.addEventListener("click", closeShortcutDialog);
  document.getElementById("cs-shortcut-copy")?.addEventListener("click", async () => {
    const input = document.getElementById("cs-shortcut-url");
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input.value);
      showToast("リンクをコピーしました");
    } catch {
      input.select();
      document.execCommand("copy");
      showToast("リンクをコピーしました");
    }
  });
}

function openShortcutDialog(storagePath, label) {
  const dialog = document.getElementById("cs-shortcut-dialog");
  const trimmedPath = storagePath?.trim() ?? "";
  if (!dialog || !trimmedPath) {
    showToast("ショートカットを作成するフォルダを選択してください", true);
    return;
  }

  shortcutDialogPath = trimmedPath;
  shortcutDialogLabel = label?.trim() || getShortcutLabelForPath(trimmedPath);
  renderShortcutDialogForm(shortcutDialogPath, shortcutDialogLabel);
  if (!dialog.open) dialog.showModal();
}

function openShortcutDialogForItem(item) {
  const storagePath = resolveShortcutTargetPath([item], currentPath);
  const label =
    item.type === "folder"
      ? item.name
      : getShortcutLabelForPath(storagePath);
  openShortcutDialog(storagePath, label);
}

function openShortcutDialogFromSelection() {
  const items = getSelectedItems();
  if (items.length === 0) {
    showToast("ショートカットを作成する項目を選択してください", true);
    return;
  }

  const storagePath = resolveShortcutTargetPath(items, currentPath);
  if (!storagePath) {
    showToast("ショートカット先のフォルダを特定できません", true);
    return;
  }

  const label = getShortcutLabelForPath(storagePath);
  openShortcutDialog(storagePath, label);
}

async function handleShortcutCreate() {
  if (!shortcutDialogPath) {
    showToast("ショートカット先のフォルダがありません", true);
    return;
  }

  const createBtn = document.getElementById("cs-shortcut-dialog-create");
  if (createBtn) {
    createBtn.disabled = true;
    createBtn.textContent = "作成中…";
  }

  try {
    const result = await createShortcutLink(shortcutDialogPath, shortcutDialogLabel);
    renderShortcutDialogResult(result);
    showToast("ショートカットリンクを作成しました");
  } finally {
    if (createBtn) {
      createBtn.disabled = false;
      createBtn.textContent = "リンクを作成";
    }
  }
}

async function handleDelete() {
  if (selectedItems.size === 0) {
    showToast("削除する項目を選択してください", true);
    return;
  }
  if (!confirm(`${selectedItems.size} 件をごみ箱に移動しますか？`)) return;

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
      showTrashMovedToast();
    } else if (succeededPaths.length === 0) {
      showToast(failures[0]?.message ?? "削除に失敗しました", true);
    } else {
      showTrashMovedToast(`${succeededPaths.length} 件をごみ箱に移動、${failures.length} 件失敗`);
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
  bindViewModeControls();
  bindMobileShellControls();

  document.getElementById("cs-upload-input")?.addEventListener("change", (e) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    if (files.length) handleUpload(files);
  });

  document.getElementById("cs-upload-folder-input")?.addEventListener("change", (e) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    if (files.length) handleUpload(files);
  });

  document.getElementById("cs-upload-btn")?.addEventListener("click", () => {
    document.getElementById("cs-upload-input")?.click();
  });

  document.getElementById("cs-upload-folder-btn")?.addEventListener("click", () => {
    document.getElementById("cs-upload-folder-input")?.click();
  });

  document.getElementById("cs-mkdir-btn")?.addEventListener("click", handleMkdir);
  document.getElementById("cs-delete-btn")?.addEventListener("click", handleDelete);
  document.getElementById("cs-rename-btn")?.addEventListener("click", handleRename);
  document.getElementById("cs-download-btn")?.addEventListener("click", handleDownloadSelected);
  document.getElementById("cs-shortcut-btn")?.addEventListener("click", openShortcutDialogFromSelection);
  document.getElementById("cs-trash-back-btn")?.addEventListener("click", exitTrashView);
  document.getElementById("cs-trash-restore-btn")?.addEventListener("click", handleTrashRestore);
  document.getElementById("cs-trash-purge-btn")?.addEventListener("click", handleTrashPurge);
  document.getElementById("cs-trash-empty-btn")?.addEventListener("click", handleTrashEmpty);

  document.addEventListener("click", (e) => {
    const menu = document.getElementById("cs-context-menu");
    if (!menu || menu.hidden) return;
    if (!menu.contains(e.target)) hideContextMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideContextMenu();
  });

  document.addEventListener("paste", (e) => {
    if (shouldIgnorePasteTarget(e.target)) return;
    if (trashView || !currentPath) return;

    const files = collectMediaFilesFromClipboard(e.clipboardData);
    if (files.length === 0) return;

    e.preventDefault();
    handleUpload(files).catch((err) => {
      showToast(err?.message ?? "貼り付けのアップロードに失敗しました", true);
    });
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
  document.getElementById("cs-preview-office-browser")?.addEventListener("click", () => {
    if (!currentOfficePreviewInfo) return;
    try {
      openOfficeInBrowserTab(currentOfficePreviewInfo);
    } catch (err) {
      showToast(err.message ?? "ブラウザで開けませんでした", true);
    }
  });
  document.getElementById("cs-preview-office-app")?.addEventListener("click", () => {
    if (!currentOfficePreviewInfo) return;
    try {
      openOfficeInDesktopApp(currentOfficePreviewInfo);
    } catch (err) {
      showToast(err.message ?? "アプリで開けませんでした", true);
    }
  });
  document.getElementById("cs-preview-excalidraw-edit")?.addEventListener("click", () => {
    const btn = document.getElementById("cs-preview-excalidraw-edit");
    const path = btn?.dataset.path || previewPath;
    if (!path) return;
    const url = `/apps/excalidraw/?storagePath=${encodeURIComponent(path)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  document.getElementById("cs-share-dialog-close")?.addEventListener("click", closeShareDialog);
  document.getElementById("cs-share-dialog")?.addEventListener("cancel", closeShareDialog);

  document.getElementById("cs-shortcut-dialog-close")?.addEventListener("click", closeShortcutDialog);
  document.getElementById("cs-shortcut-dialog")?.addEventListener("cancel", closeShortcutDialog);

  const dropZone = document.getElementById("cs-drop-zone");
  dropZone?.addEventListener("dragover", (e) => {
    if (activeDragMoveItems?.length) return;
    e.preventDefault();
    dropZone.classList.add("is-dragover");
  });
  dropZone?.addEventListener("dragleave", () => {
    dropZone.classList.remove("is-dragover");
  });
  dropZone?.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropZone.classList.remove("is-dragover");
    if (trashView || activeDragMoveItems?.length) return;
    try {
      const files = await collectFilesFromDataTransfer(e.dataTransfer);
      if (files.length) handleUpload(files);
    } catch (err) {
      showToast(err?.message ?? "ファイルの読み込みに失敗しました", true);
    }
  });
}

async function init() {
  const ok = await checkAccess();
  if (!ok) return;
  loadSortPreference();
  bindEvents();
  updateSortUi();
  updateToolbarForView();
  updateViewModeUi();
  await loadRoots();
}

init();
