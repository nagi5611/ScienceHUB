/**
 * ウェブサイト公開アプリ
 */

import { createExplorer } from "./js/explorer.js";
import { hideContextMenu, showContextMenu } from "./js/context-menu.js";

const APP_SLUG = "website-publish";
const API_BASE = "/api/website-publish";
const MAX_SITES = 3;

const EDITABLE_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".svg",
  ".txt",
  ".xml",
  ".webmanifest",
  ".map",
]);

const accessDenied = document.getElementById("access-denied");
const appMain = document.getElementById("app-main");
const sitesPanel = document.getElementById("sites-panel");
const filesPanel = document.getElementById("files-panel");
const siteList = document.getElementById("site-list");
const siteEmpty = document.getElementById("site-empty");
const createSiteBtn = document.getElementById("create-site-btn");
const createDialog = /** @type {HTMLDialogElement} */ (document.getElementById("create-dialog"));
const createForm = document.getElementById("create-form");
const createTitle = /** @type {HTMLInputElement} */ (document.getElementById("create-title"));
const createPath = /** @type {HTMLInputElement} */ (document.getElementById("create-path"));
const createCancel = document.getElementById("create-cancel");
const backToSites = document.getElementById("back-to-sites");
const currentSiteTitle = document.getElementById("current-site-title");
const currentSiteUrl = /** @type {HTMLAnchorElement} */ (document.getElementById("current-site-url"));
const siteQuota = document.getElementById("site-quota");
const siteStats = document.getElementById("site-stats");
const deleteSiteBtn = document.getElementById("delete-site-btn");
const fileInput = /** @type {HTMLInputElement} */ (document.getElementById("file-input"));
const folderInput = /** @type {HTMLInputElement} */ (document.getElementById("folder-input"));
const zipInput = /** @type {HTMLInputElement} */ (document.getElementById("zip-input"));
const statusEl = document.getElementById("status");
const contextMenu = document.getElementById("wsp-context-menu");
const contextMenuTitle = document.getElementById("wsp-context-menu-title");
const contextMenuItems = document.getElementById("wsp-context-menu-items");
const editDialog = /** @type {HTMLDialogElement} */ (document.getElementById("edit-dialog"));
const editForm = document.getElementById("edit-form");
const editPathLabel = document.getElementById("edit-path-label");
const editContent = /** @type {HTMLTextAreaElement} */ (document.getElementById("edit-content"));
const editCancel = document.getElementById("edit-cancel");

/** @type {string | null} */
let editingPath = null;

/** @type {Array<{ id: string; title: string; path_slug: string; used_bytes: number; max_bytes: number; public_url: string; has_index: boolean; visit_count: number; last_visit_at: number | null }>} */
let sites = [];

/** @type {{ id: string; title: string; path_slug: string; used_bytes: number; max_bytes: number; public_url: string; visit_count: number; last_visit_at: number | null } | null} */
let currentSite = null;

const explorer = createExplorer({
  elements: {
    dropZone: document.getElementById("explorer-drop-zone"),
    breadcrumb: document.getElementById("explorer-breadcrumb"),
    fileList: document.getElementById("file-list"),
    fileEmpty: document.getElementById("file-empty"),
    fileTable: document.getElementById("file-table"),
    uploadBtn: document.getElementById("explorer-upload-btn"),
    folderBtn: document.getElementById("explorer-folder-btn"),
    folderInput,
    fileInput,
    deleteBtn: document.getElementById("explorer-delete-btn"),
    currentDirLabel: document.getElementById("explorer-current-dir"),
  },
  formatBytes,
  escapeHtml,
  onUploadFiles: async (files, baseDir) => {
    await uploadFilesFromList(files, baseDir);
  },
  onDeletePaths: async (paths) => {
    await deleteExpandedPaths(paths);
  },
  onContextMenu: (clientX, clientY, item) => {
    handleExplorerContextMenu(clientX, clientY, item);
  },
});

document.getElementById("explorer-zip-btn")?.addEventListener("click", () => {
  zipInput.click();
});

/** 拡張子がテキスト編集可能か */
function isEditablePath(path) {
  const base = path.split("/").pop() ?? path;
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return false;
  return EDITABLE_EXTENSIONS.has(base.slice(dot).toLowerCase());
}

/** パス一覧をファイルパスに展開（フォルダ配下を含む） */
function expandPathsToFiles(paths, files) {
  const filePaths = paths.filter((p) => files.some((f) => f.path === p));
  const folderPrefixes = paths.filter((p) => !filePaths.includes(p));
  const toDelete = [...filePaths];
  for (const folder of folderPrefixes) {
    const prefix = `${folder}/`;
    for (const f of files) {
      if (f.path.startsWith(prefix) || f.path === folder) {
        toDelete.push(f.path);
      }
    }
  }
  return toDelete;
}

/** ファイル削除（フォルダは配下を展開） */
async function deleteExpandedPaths(paths) {
  if (!currentSite || paths.length === 0) return;
  const data = await api(`sites/${currentSite.id}/files`);
  const files = data.files ?? [];
  const toDelete = expandPathsToFiles(paths, files);
  if (toDelete.length === 0) return;
  if (!confirm(`${toDelete.length} 件を削除しますか？`)) return;

  setStatus(`削除中（${toDelete.length} 件）…`);
  for (const path of toDelete) {
    await api(`sites/${currentSite.id}/files?path=${encodeURIComponent(path)}`, {
      method: "DELETE",
    });
  }
  await refreshCurrentSite();
  await loadFiles();
  setStatus(`${toDelete.length} 件を削除しました`);
}

/** 単一ファイルをダウンロード */
function downloadFile(path) {
  if (!currentSite) return;
  const url = `${API_BASE}/sites/${currentSite.id}/files/download?path=${encodeURIComponent(path)}`;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = path.split("/").pop() ?? "download";
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/** 名称変更 */
async function renamePath(path, kind, currentName) {
  if (!currentSite) return;
  const newName = prompt("新しい名前", currentName);
  if (!newName || newName.trim() === currentName) return;

  setStatus("名称を変更中…");
  await api(`sites/${currentSite.id}/files/rename`, {
    method: "PATCH",
    body: JSON.stringify({
      path,
      new_name: newName.trim(),
      kind,
    }),
  });
  await loadFiles();
  setStatus("名称を変更しました");
}

/** テキストファイルをエディタで開く */
async function openTextEditor(path) {
  if (!currentSite) return;
  setStatus("ファイルを読み込み中…");
  const data = await api(
    `sites/${currentSite.id}/files/content?path=${encodeURIComponent(path)}`
  );
  editingPath = path;
  editPathLabel.textContent = path;
  editContent.value = data.content ?? "";
  editDialog.showModal();
  setStatus("");
}

/** テキストファイルを保存 */
async function saveTextEditor(event) {
  event.preventDefault();
  if (!currentSite || !editingPath) return;

  setStatus("保存中…");
  await api(`sites/${currentSite.id}/files/content`, {
    method: "PUT",
    body: JSON.stringify({
      path: editingPath,
      content: editContent.value,
    }),
  });
  editingPath = null;
  editDialog.close();
  await refreshCurrentSite();
  await loadFiles();
  setStatus("保存しました");
}

/** コンテキストメニュー（単一項目） */
function handleExplorerContextMenu(clientX, clientY, item) {
  if (item.kind === "multi") {
    handleMultiContextMenu(clientX, clientY, item.paths ?? []);
    return;
  }

  const actions = [];
  if (item.kind === "folder") {
    actions.push({ id: "open", label: "開く" });
  } else {
    if (isEditablePath(item.path)) {
      actions.push({ id: "edit", label: "編集" });
    }
    actions.push({ id: "download", label: "ダウンロード" });
  }
  actions.push({ id: "rename", label: "名称変更" });
  actions.push({ id: "sep" });
  actions.push({ id: "delete", label: "削除", danger: true });

  showContextMenu({
    menu: contextMenu,
    titleEl: contextMenuTitle,
    itemsEl: contextMenuItems,
    clientX,
    clientY,
    title: item.name,
    actions,
    escapeHtml,
    onAction: (action) => handleContextAction(action, item),
  });
}

/** コンテキストメニュー（複数選択） */
function handleMultiContextMenu(clientX, clientY, paths) {
  const count = paths.length;
  const actions = [
    { id: "download-selected", label: "選択項目をダウンロード" },
    { id: "sep" },
    { id: "delete-selected", label: "選択項目を削除", danger: true },
  ];

  showContextMenu({
    menu: contextMenu,
    titleEl: contextMenuTitle,
    itemsEl: contextMenuItems,
    clientX,
    clientY,
    title: `${count} 件を選択中`,
    actions,
    escapeHtml,
    onAction: async (action) => {
      if (action === "delete-selected") {
        await deleteExpandedPaths(paths);
        return;
      }
      if (action === "download-selected") {
        const data = await api(`sites/${currentSite?.id}/files`);
        const files = data.files ?? [];
        const filePaths = expandPathsToFiles(paths, files).filter((p) =>
          files.some((f) => f.path === p)
        );
        for (const path of filePaths) {
          downloadFile(path);
        }
      }
    },
  });
}

/** コンテキストメニュー操作 */
async function handleContextAction(action, item) {
  switch (action) {
    case "open":
      if (item.kind === "folder") explorer.navigateToDir(item.path);
      break;
    case "edit":
      await openTextEditor(item.path);
      break;
    case "download":
      downloadFile(item.path);
      break;
    case "rename":
      await renamePath(item.path, item.kind, item.name).catch((err) => {
        setStatus(err instanceof Error ? err.message : "名称変更に失敗しました", true);
      });
      break;
    case "delete":
      await deleteExpandedPaths([item.path]);
      break;
    default:
      break;
  }
}

document.addEventListener("click", () => hideContextMenu(contextMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideContextMenu(contextMenu);
});
editCancel?.addEventListener("click", () => {
  editingPath = null;
  editDialog.close();
});
editForm?.addEventListener("submit", (e) => {
  saveTextEditor(e).catch((err) => {
    setStatus(err instanceof Error ? err.message : "保存に失敗しました", true);
  });
});

/** バイト数を表示用に整形 */
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

/** 日時表示 */
function formatDateTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("ja-JP");
}

/** API 呼び出し */
async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}/${path.replace(/^\//, "")}`, {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body instanceof ArrayBuffer
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401) {
    window.location.href = `/login/?next=${encodeURIComponent(`/apps/${APP_SLUG}/`)}`;
    throw new Error("ログインが必要です");
  }

  if (response.headers.get("Content-Type")?.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "リクエストに失敗しました");
    }
    return data;
  }

  if (!response.ok) {
    throw new Error("リクエストに失敗しました");
  }

  return response;
}

/** アクセス確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });
  if (response.status === 401) {
    window.location.href = `/login/?next=${encodeURIComponent(`/apps/${APP_SLUG}/`)}`;
    return false;
  }
  if (!response.ok) {
    accessDenied.hidden = false;
    return false;
  }
  appMain.hidden = false;
  return true;
}

/** ステータス表示 */
function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("wsp-status--error", isError);
}

/** HTML エスケープ */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** サイト一覧を描画 */
function renderSiteList() {
  siteList.replaceChildren();
  siteEmpty.hidden = sites.length > 0;
  createSiteBtn.disabled = sites.length >= MAX_SITES;

  for (const site of sites) {
    const li = document.createElement("li");
    li.className = "wsp-site-card";
    const pct = site.max_bytes > 0 ? (site.used_bytes / site.max_bytes) * 100 : 0;
    li.innerHTML = `
      <div class="wsp-site-card-main">
        <h3 class="wsp-site-card-title">${escapeHtml(site.title)}</h3>
        <p class="wsp-site-card-url"><a href="${escapeHtml(site.public_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(site.public_url)}</a></p>
        <div class="wsp-site-card-stats">
          <span>訪問 ${site.visit_count ?? 0} 回</span>
          <span>${formatBytes(site.used_bytes)} / ${formatBytes(site.max_bytes)}</span>
          ${site.has_index ? "" : '<span class="wsp-warn">index.html 未設定</span>'}
        </div>
        <div class="wsp-quota-bar" aria-hidden="true"><span style="width:${Math.min(100, pct)}%"></span></div>
      </div>
      <button type="button" class="wsp-btn wsp-btn--secondary" data-site-id="${escapeHtml(site.id)}">管理</button>
    `;
    li.querySelector("button")?.addEventListener("click", () => openSite(site.id));
    siteList.appendChild(li);
  }
}

/** サイト一覧を取得 */
async function loadSites() {
  const data = await api("sites");
  sites = data.sites ?? [];
  renderSiteList();
}

/** サイト詳細を開く */
async function openSite(siteId) {
  const site = sites.find((s) => s.id === siteId);
  if (!site) return;

  currentSite = site;
  sitesPanel.hidden = true;
  filesPanel.hidden = false;
  currentSiteTitle.textContent = site.title;
  currentSiteUrl.href = site.public_url;
  currentSiteUrl.textContent = site.public_url;
  updateQuotaDisplay(site);
  updateStatsDisplay(site);
  explorer.resetDir();
  await loadFiles();
}

/** 統計表示 */
function updateStatsDisplay(site) {
  siteStats.innerHTML = `
    <div class="wsp-stat">
      <span class="wsp-stat-label">ページ訪問数</span>
      <strong class="wsp-stat-value">${site.visit_count ?? 0}</strong>
    </div>
    <div class="wsp-stat">
      <span class="wsp-stat-label">最終訪問</span>
      <strong class="wsp-stat-value">${escapeHtml(formatDateTime(site.last_visit_at))}</strong>
    </div>
    <div class="wsp-stat">
      <span class="wsp-stat-label">公開パス</span>
      <strong class="wsp-stat-value wsp-stat-value--mono">${escapeHtml(site.path_slug)}</strong>
    </div>
  `;
}

/** 使用量表示 */
function updateQuotaDisplay(site) {
  const pct = site.max_bytes > 0 ? (site.used_bytes / site.max_bytes) * 100 : 0;
  siteQuota.innerHTML = `
    <span class="wsp-quota-label">使用量 ${formatBytes(site.used_bytes)} / ${formatBytes(site.max_bytes)}</span>
    <div class="wsp-quota-bar" aria-hidden="true"><span style="width:${Math.min(100, pct)}%"></span></div>
  `;
}

/** ファイル一覧 */
async function loadFiles() {
  if (!currentSite) return;
  const data = await api(`sites/${currentSite.id}/files`);
  explorer.setFiles(data.files ?? []);
}

/** 現在サイト情報を再取得 */
async function refreshCurrentSite() {
  await loadSites();
  if (!currentSite) return;
  const updated = sites.find((s) => s.id === currentSite.id);
  if (updated) {
    currentSite = updated;
    updateQuotaDisplay(updated);
    updateStatsDisplay(updated);
  }
}

/** 相対ディレクトリを結合 */
function joinRelativeDir(baseDir, relativePath) {
  const rel = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!baseDir) return rel;
  if (!rel) return baseDir;
  return `${baseDir}/${rel}`;
}

/** 単一ファイルアップロード */
async function uploadFile(file, relativeDir) {
  if (!currentSite) return;

  const init = await api(`sites/${currentSite.id}/upload/init`, {
    method: "POST",
    body: JSON.stringify({
      filename: file.name,
      size: file.size,
      relative_dir: relativeDir,
    }),
  });

  if (init.mode === "simple" && init.directUpload) {
    const urlData = await api(`sites/${currentSite.id}/upload/url`, {
      method: "POST",
      body: JSON.stringify({ session_id: init.sessionId }),
    });
    const putRes = await fetch(urlData.url, {
      method: "PUT",
      body: file,
    });
    if (!putRes.ok) throw new Error("アップロードに失敗しました");
    await api(`sites/${currentSite.id}/upload/complete`, {
      method: "POST",
      body: JSON.stringify({
        session_id: init.sessionId,
        direct_upload: true,
      }),
    });
    return;
  }

  if (init.mode === "simple") {
    const buffer = await file.arrayBuffer();
    const res = await fetch(`${API_BASE}/sites/${currentSite.id}/upload/simple`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "X-Upload-Session": init.sessionId },
      body: buffer,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error ?? "アップロードに失敗しました");
    }
    return;
  }

  throw new Error("大容量ファイルは現在 Worker 経由のみ対応しています");
}

/** 複数ファイルアップロード（フォルダ構造対応） */
async function uploadFilesFromList(fileList, baseDir) {
  const files = [...fileList];
  if (files.length === 0) return;
  setStatus(`アップロード中（${files.length} 件）…`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const webkitPath = file.webkitRelativePath || file.name;
    const segments = webkitPath.split("/");
    segments.pop();
    const innerDir = segments.join("/");
    const targetDir = joinRelativeDir(baseDir, innerDir);

    setStatus(`アップロード中 ${i + 1}/${files.length}: ${webkitPath}`);
    await uploadFile(file, targetDir);
  }

  await refreshCurrentSite();
  await loadFiles();
  setStatus(`${files.length} 件のアップロードが完了しました`);
}

/** ZIP アップロード */
async function handleZipSelected(file) {
  if (!currentSite || !file) return;
  setStatus("ZIP を展開中…");
  const buffer = await file.arrayBuffer();
  const response = await fetch(`${API_BASE}/sites/${currentSite.id}/upload/zip`, {
    method: "POST",
    credentials: "same-origin",
    body: buffer,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "ZIP のアップロードに失敗しました");
  }
  await refreshCurrentSite();
  await loadFiles();
  const skipped = data.skipped?.length ?? 0;
  setStatus(
    `${data.uploaded?.length ?? 0} 件を配置しました${skipped > 0 ? `（${skipped} 件スキップ）` : ""}`
  );
}

/** サイト作成 */
async function handleCreateSite(event) {
  event.preventDefault();
  const title = createTitle.value.trim();
  const pathSlug = createPath.value.trim().toLowerCase();
  if (!title || !pathSlug) return;

  setStatus("サイトを作成中…");
  await api("sites", {
    method: "POST",
    body: JSON.stringify({ title, path_slug: pathSlug }),
  });
  createDialog.close();
  createTitle.value = "";
  createPath.value = "";
  await loadSites();
  setStatus("サイトを作成しました");
}

/** サイト削除 */
async function handleDeleteSite() {
  if (!currentSite) return;
  if (!confirm(`「${currentSite.title}」を削除しますか？公開ファイルもすべて削除されます。`)) return;

  await api(`sites/${currentSite.id}`, { method: "DELETE" });
  currentSite = null;
  filesPanel.hidden = true;
  sitesPanel.hidden = false;
  await loadSites();
  setStatus("サイトを削除しました");
}

createSiteBtn.addEventListener("click", () => createDialog.showModal());
createCancel.addEventListener("click", () => createDialog.close());
createForm.addEventListener("submit", handleCreateSite);
backToSites.addEventListener("click", () => {
  currentSite = null;
  filesPanel.hidden = true;
  sitesPanel.hidden = false;
  setStatus("");
});
deleteSiteBtn.addEventListener("click", () => handleDeleteSite());
zipInput.addEventListener("change", () => {
  const file = zipInput.files?.[0];
  if (!file) return;
  handleZipSelected(file).catch((err) => {
    setStatus(err instanceof Error ? err.message : "ZIP アップロードに失敗しました", true);
  });
  zipInput.value = "";
});

async function init() {
  const ok = await checkAccess();
  if (!ok) return;
  await loadSites();
}

init().catch((err) => {
  setStatus(err instanceof Error ? err.message : "初期化に失敗しました", true);
});
