import { showHubAppAccessDenied } from "/js/hub-app-access-ui.js";
/**
 * PDF結合・分割アプリ — クライアントサイド
 */

import { APP_SLUG } from "./js/constants.js";
import { downloadBlob, downloadPdfResults, formatBytes } from "./js/download.js";
import { buildMergedFilename, mergePdfFiles } from "./js/merge.js";
import { loadPdfPreview, renderAllThumbnails } from "./js/pdf-preview.js";
import { splitAllPages, splitByFixedSize, splitByRanges } from "./js/split.js";

/** @typedef {{ id: string, file: File, pageCount: number | null, thumbnails: string[] | null, previewLoading: boolean, previewError: string | null }} MergeEntry */
/** @typedef {{ bytes: Uint8Array, name: string }} PdfResult */

const mergeFileInput = document.getElementById("merge-file-input");
const splitFileInput = document.getElementById("split-file-input");
const mergeDropZone = document.getElementById("merge-drop-zone");
const splitDropZone = document.getElementById("split-drop-zone");
const mergeFileList = document.getElementById("merge-file-list");
const mergeEmpty = document.getElementById("merge-empty");
const mergeStatus = document.getElementById("merge-status");
const mergeBtn = document.getElementById("merge-btn");
const mergeClearBtn = document.getElementById("merge-clear-btn");
const mergeDownloadBtn = document.getElementById("merge-download-btn");
const splitStatus = document.getElementById("split-status");
const splitEmpty = document.getElementById("split-empty");
const splitPreviewMeta = document.getElementById("split-preview-meta");
const splitThumbGrid = document.getElementById("split-thumb-grid");
const splitModeSelect = document.getElementById("split-mode");
const splitRangesField = document.getElementById("split-ranges-field");
const splitRangesInput = document.getElementById("split-ranges");
const splitFixedField = document.getElementById("split-fixed-field");
const splitFixedSizeInput = document.getElementById("split-fixed-size");
const splitBtn = document.getElementById("split-btn");
const splitClearBtn = document.getElementById("split-clear-btn");
const splitDownloadBtn = document.getElementById("split-download-btn");
const tabMerge = document.getElementById("tab-merge");
const tabSplit = document.getElementById("tab-split");
const panelMerge = document.getElementById("panel-merge");
const panelSplit = document.getElementById("panel-split");
const processingOverlay = document.getElementById("processing-overlay");
const processingTitle = document.getElementById("processing-title");
const processingSub = document.getElementById("processing-sub");

/** @type {MergeEntry[]} */
let mergeEntries = [];
let mergeEntryCounter = 0;
/** @type {Uint8Array | null} */
let mergedBytes = null;

/** @type {File | null} */
let splitFile = null;
let splitPageCount = 0;
/** @type {PdfResult[] | null} */
let splitResults = null;
let isBusy = false;

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href = `/login/?next=${encodeURIComponent(`/apps/${APP_SLUG}/`)}`;
    return false;
  }

  if (response.status === 404) {
    showHubAppAccessDenied();
    const denied = document.getElementById("access-denied");
    if (denied) {
      const p = denied.querySelector("p");
      if (p) {
        p.textContent =
          "PDF結合・分割アプリが登録されていないか、見つかりません。管理者にマイグレーション（0079_pdf_tools_app.sql）の適用を確認してください。";
      }
    }
    return false;
  }

  if (!response.ok) {
    showHubAppAccessDenied();
    return false;
  }

  document.getElementById("app-main").hidden = false;
  return true;
}

/** ステータス表示を更新 */
function setStatus(el, message, tone = "default") {
  if (!el) return;
  el.textContent = message;
  if (tone === "default") {
    el.removeAttribute("data-tone");
  } else {
    el.setAttribute("data-tone", tone);
  }
}

/** 処理中オーバーレイ */
function showProcessing(title, sub = "") {
  if (processingTitle) processingTitle.textContent = title;
  if (processingSub) processingSub.textContent = sub;
  if (processingOverlay) processingOverlay.hidden = false;
}

function hideProcessing() {
  if (processingOverlay) processingOverlay.hidden = true;
}

/** PDF ファイルか判定 */
function isPdfFile(file) {
  const name = file.name.toLowerCase();
  return file.type === "application/pdf" || name.endsWith(".pdf");
}

/** dataTransfer からファイル一覧 */
function filesFromDataTransfer(dataTransfer) {
  if (!dataTransfer) return [];
  const items = dataTransfer.items;
  if (items?.length) {
    const files = [];
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length) return files;
  }
  return [...(dataTransfer.files ?? [])];
}

/** ドロップゾーン共通 */
function bindDropZone(zone, input, onFiles) {
  if (!zone || !input) return;

  zone.addEventListener("click", () => input.click());
  zone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      input.click();
    }
  });

  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("pdf-drop-zone--active");
    event.dataTransfer.dropEffect = "copy";
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("pdf-drop-zone--active");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("pdf-drop-zone--active");
    onFiles(filesFromDataTransfer(event.dataTransfer));
  });

  input.addEventListener("change", () => {
    onFiles([...(input.files ?? [])]);
    input.value = "";
  });
}

/** タブ切り替え */
function switchTab(tab) {
  if (isBusy) return;
  const isMerge = tab === "merge";
  if (tabMerge) {
    tabMerge.setAttribute("aria-selected", isMerge ? "true" : "false");
  }
  if (tabSplit) {
    tabSplit.setAttribute("aria-selected", isMerge ? "false" : "true");
  }
  if (panelMerge) panelMerge.hidden = !isMerge;
  if (panelSplit) panelSplit.hidden = isMerge;
}

tabMerge?.addEventListener("click", () => switchTab("merge"));
tabSplit?.addEventListener("click", () => switchTab("split"));

const pdfTablist = document.querySelector('[role="tablist"]');
pdfTablist?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  const tabs = [tabMerge, tabSplit].filter(Boolean);
  const idx = tabs.findIndex((el) => el.getAttribute("aria-selected") === "true");
  const next = event.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
  switchTab(next === 0 ? "merge" : "split");
  tabs[next]?.focus();
});

/** pdf-lib でページ数取得 */
async function countPdfPages(file) {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
  return doc.getPageCount();
}

/** 結合エントリのページプレビューを読み込む */
async function loadMergeEntryPreview(entry) {
  entry.previewLoading = true;
  entry.previewError = null;
  renderMergeList();

  try {
    const pdf = await loadPdfPreview(entry.file);
    entry.pageCount = pdf.numPages;
    entry.thumbnails = await renderAllThumbnails(pdf);
    entry.previewLoading = false;
  } catch (error) {
    entry.previewLoading = false;
    entry.thumbnails = null;
    entry.previewError =
      error instanceof Error ? error.message : "プレビューの読み込みに失敗しました";
    if (entry.pageCount == null) {
      try {
        entry.pageCount = await countPdfPages(entry.file);
      } catch {
        entry.pageCount = null;
      }
    }
  }

  renderMergeList();
}

/** ページサムネイル列 HTML */
function buildMergePagesHtml(entry) {
  if (entry.previewLoading) {
    return `
      <div class="pdf-file-pages pdf-file-pages--loading" aria-label="ページプレビュー読み込み中">
        <span class="pdf-spinner pdf-spinner--inline" aria-hidden="true"></span>
        <span>ページプレビューを生成しています…</span>
      </div>
    `;
  }

  if (entry.previewError) {
    return `<p class="pdf-file-pages-error" role="alert">${escapeHtml(entry.previewError)}</p>`;
  }

  if (!entry.thumbnails?.length) {
    return `<p class="pdf-file-pages-empty">ページプレビューがありません</p>`;
  }

  const cells = entry.thumbnails
    .map(
      (src, index) => `
        <figure class="pdf-file-page">
          <img src="${src}" alt="${escapeHtml(entry.file.name)} ${index + 1} ページ目" width="72" height="96" loading="lazy">
          <figcaption>${index + 1}</figcaption>
        </figure>
      `
    )
    .join("");

  return `<div class="pdf-file-pages" aria-label="ページプレビュー">${cells}</div>`;
}

/** 結合一覧を描画 */
function updateMergeEntryPreviewDom(entry) {
  const item = mergeFileList?.querySelector(`[data-id="${entry.id}"]`);
  if (!item) return;
  const pages = item.querySelector(".pdf-file-pages");
  if (pages) pages.outerHTML = buildMergePagesHtml(entry);
}

function renderMergeList() {
  if (!mergeFileList || !mergeEmpty) return;

  mergeFileList.replaceChildren();
  mergeEmpty.hidden = mergeEntries.length > 0;

  for (const entry of mergeEntries) {
    const item = document.createElement("li");
    item.className = "pdf-file pdf-file--sortable";
    item.dataset.id = entry.id;

    item.innerHTML = `
      <div class="pdf-file-head">
        <span class="pdf-file-drag" draggable="true" aria-hidden="true" title="ドラッグで並べ替え">⋮⋮</span>
        <div class="pdf-file-body">
          <div class="pdf-file-name">${escapeHtml(entry.file.name)}</div>
          <div class="pdf-file-meta">${formatBytes(entry.file.size)}${
            entry.pageCount != null ? ` · ${entry.pageCount} ページ` : " · ページ数取得中…"
          }</div>
        </div>
        <div class="pdf-file-actions">
          <button type="button" class="pdf-btn pdf-btn--ghost pdf-btn--small" data-action="up" aria-label="上へ">↑</button>
          <button type="button" class="pdf-btn pdf-btn--ghost pdf-btn--small" data-action="down" aria-label="下へ">↓</button>
          <button type="button" class="pdf-btn pdf-btn--ghost pdf-btn--small" data-action="remove">削除</button>
        </div>
      </div>
      ${buildMergePagesHtml(entry)}
    `;

    item.querySelector('[data-action="remove"]')?.addEventListener("click", () => {
      removeMergeEntry(entry.id);
    });
    item.querySelector('[data-action="up"]')?.addEventListener("click", () => {
      moveMergeEntry(entry.id, -1);
    });
    item.querySelector('[data-action="down"]')?.addEventListener("click", () => {
      moveMergeEntry(entry.id, 1);
    });

    bindSortableItem(item);
    mergeFileList.appendChild(item);
  }

  updateMergeControls();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 結合エントリ追加 */
async function addMergeFiles(files) {
  const pdfs = files.filter(isPdfFile);
  if (pdfs.length === 0) {
    setStatus(mergeStatus, "PDF ファイルのみ追加できます", "warn");
    return;
  }
  if (pdfs.length < files.length) {
    setStatus(mergeStatus, "PDF 以外のファイルはスキップしました", "warn");
  }

  mergedBytes = null;
  mergeDownloadBtn.disabled = true;

  for (const file of pdfs) {
    const entry = {
      id: `merge-${++mergeEntryCounter}`,
      file,
      pageCount: null,
      thumbnails: null,
      previewLoading: true,
      previewError: null,
    };
    mergeEntries.push(entry);
    loadMergeEntryPreview(entry).catch(() => {
      entry.previewLoading = false;
      entry.previewError = "プレビューの読み込みに失敗しました";
      updateMergeEntryPreviewDom(entry);
    });
  }

  renderMergeList();
  setStatus(mergeStatus, `${mergeEntries.length} 件の PDF を追加しました`);
}

function removeMergeEntry(id) {
  mergeEntries = mergeEntries.filter((entry) => entry.id !== id);
  mergedBytes = null;
  mergeDownloadBtn.disabled = true;
  renderMergeList();
}

function moveMergeEntry(id, delta) {
  const index = mergeEntries.findIndex((entry) => entry.id === id);
  if (index < 0) return;
  const next = index + delta;
  if (next < 0 || next >= mergeEntries.length) return;
  const [entry] = mergeEntries.splice(index, 1);
  mergeEntries.splice(next, 0, entry);
  mergedBytes = null;
  mergeDownloadBtn.disabled = true;
  renderMergeList();
}

function updateMergeControls() {
  const count = mergeEntries.length;
  mergeBtn.disabled = isBusy || count < 2;
  mergeClearBtn.disabled = isBusy || count === 0;
  if (count === 0) {
    setStatus(mergeStatus, "PDF を 2 件以上追加してください");
  } else if (count === 1) {
    setStatus(mergeStatus, "あと 1 件以上 PDF を追加してください", "warn");
  } else if (!mergedBytes) {
    setStatus(mergeStatus, `${count} 件の PDF を結合できます`);
  }
}

/** ドラッグ並べ替え（ハンドルのみ） */
function bindSortableItem(item) {
  const handle = item.querySelector(".pdf-file-drag");
  if (!handle) return;

  handle.addEventListener("dragstart", (event) => {
    item.classList.add("pdf-file--dragging");
    event.dataTransfer?.setData("text/plain", item.dataset.id ?? "");
    event.dataTransfer.effectAllowed = "move";
  });

  handle.addEventListener("dragend", () => {
    item.classList.remove("pdf-file--dragging");
    mergeFileList?.querySelectorAll(".pdf-file--drop-target").forEach((el) => {
      el.classList.remove("pdf-file--drop-target");
    });
  });

  item.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    item.classList.add("pdf-file--drop-target");
  });

  item.addEventListener("dragleave", (event) => {
    if (event.currentTarget === event.target || !item.contains(/** @type {Node} */ (event.relatedTarget))) {
      item.classList.remove("pdf-file--drop-target");
    }
  });

  item.addEventListener("drop", (event) => {
    event.preventDefault();
    item.classList.remove("pdf-file--drop-target");
    const draggedId = event.dataTransfer?.getData("text/plain");
    const targetId = item.dataset.id;
    if (!draggedId || !targetId || draggedId === targetId) return;

    const from = mergeEntries.findIndex((entry) => entry.id === draggedId);
    const to = mergeEntries.findIndex((entry) => entry.id === targetId);
    if (from < 0 || to < 0) return;

    const [moved] = mergeEntries.splice(from, 1);
    mergeEntries.splice(to, 0, moved);
    mergedBytes = null;
    mergeDownloadBtn.disabled = true;
    renderMergeList();
  });
}

/** 結合実行 */
async function handleMerge() {
  if (isBusy || mergeEntries.length < 2) return;

  isBusy = true;
  mergeBtn.disabled = true;
  showProcessing("PDF を結合しています…");

  try {
    const files = mergeEntries.map((entry) => entry.file);
    mergedBytes = await mergePdfFiles(files, ({ current, total, name }) => {
      showProcessing("PDF を結合しています…", `${current} / ${total}: ${name}`);
    });
    mergeDownloadBtn.disabled = false;
    setStatus(
      mergeStatus,
      `結合完了（${formatBytes(mergedBytes.byteLength)}）— ダウンロードできます`,
      "success"
    );
  } catch (error) {
    mergedBytes = null;
    mergeDownloadBtn.disabled = true;
    setStatus(
      mergeStatus,
      error instanceof Error ? error.message : "結合に失敗しました",
      "error"
    );
  } finally {
    isBusy = false;
    hideProcessing();
    updateMergeControls();
  }
}

function handleMergeDownload() {
  if (!mergedBytes) return;
  const blob = new Blob([mergedBytes], { type: "application/pdf" });
  downloadBlob(blob, buildMergedFilename());
}

function clearMerge() {
  mergeEntries = [];
  mergedBytes = null;
  mergeDownloadBtn.disabled = true;
  renderMergeList();
}

/** 分割モード UI と分割ボタン有効状態 */
function updateSplitModeFields() {
  const mode = splitModeSelect?.value ?? "all-pages";
  if (splitRangesField) splitRangesField.hidden = mode !== "ranges";
  if (splitFixedField) splitFixedField.hidden = mode !== "fixed";

  if (!splitBtn || !splitFile || isBusy) return;

  if (mode === "ranges") {
    splitBtn.disabled = !(splitRangesInput?.value ?? "").trim();
  } else {
    splitBtn.disabled = false;
  }
}

splitModeSelect?.addEventListener("change", updateSplitModeFields);
splitRangesInput?.addEventListener("input", updateSplitModeFields);

/** 分割プレビュー描画 */
async function loadSplitPreview(file) {
  splitFile = file;
  splitResults = null;
  splitDownloadBtn.disabled = true;
  splitThumbGrid.replaceChildren("");
  splitPreviewMeta.hidden = true;
  splitEmpty.hidden = true;
  splitBtn.disabled = true;

  setStatus(splitStatus, "プレビューを読み込んでいます…");

  try {
    const pdf = await loadPdfPreview(file);
    splitPageCount = pdf.numPages;
    splitPreviewMeta.hidden = false;
    splitPreviewMeta.textContent = `${file.name} · ${formatBytes(file.size)} · ${splitPageCount} ページ`;
    updateSplitModeFields();

    showProcessing("サムネイルを生成しています…", `0 / ${splitPageCount}`);
    const thumbnails = await renderAllThumbnails(pdf, ({ current, total }) => {
      showProcessing("サムネイルを生成しています…", `${current} / ${total}`);
    });
    hideProcessing();

    splitThumbGrid.replaceChildren();
    thumbnails.forEach((src, index) => {
      const cell = document.createElement("figure");
      cell.className = "pdf-thumb";
      cell.innerHTML = `
        <img src="${src}" alt="ページ ${index + 1}" width="120" height="160" loading="lazy">
        <figcaption>${index + 1}</figcaption>
      `;
      splitThumbGrid.appendChild(cell);
    });

    setStatus(splitStatus, `${splitPageCount} ページ — 分割モードを選んで実行してください`);
    splitClearBtn.disabled = false;
  } catch (error) {
    hideProcessing();
    splitFile = null;
    splitPageCount = 0;
    splitEmpty.hidden = false;
    splitPreviewMeta.hidden = true;
    splitThumbGrid.replaceChildren("");
    splitClearBtn.disabled = true;
    setStatus(
      splitStatus,
      error instanceof Error ? error.message : "プレビューの読み込みに失敗しました",
      "error"
    );
  }
}

async function addSplitFile(files) {
  const pdfs = files.filter(isPdfFile);
  if (pdfs.length === 0) {
    setStatus(splitStatus, "PDF ファイルのみ選択できます", "warn");
    return;
  }

  if (pdfs.length > 1) {
    setStatus(splitStatus, "最初の 1 件のみ使用します", "warn");
  }

  await loadSplitPreview(pdfs[0]);
}

function clearSplit() {
  splitFile = null;
  splitPageCount = 0;
  splitResults = null;
  splitDownloadBtn.disabled = true;
  splitBtn.disabled = true;
  splitClearBtn.disabled = true;
  splitThumbGrid.replaceChildren("");
  splitPreviewMeta.hidden = true;
  splitEmpty.hidden = false;
  setStatus(splitStatus, "PDF を 1 件選択してください");
}

/** 分割実行 */
async function handleSplit() {
  if (isBusy || !splitFile) return;

  const mode = splitModeSelect?.value ?? "all-pages";
  isBusy = true;
  splitBtn.disabled = true;
  showProcessing("PDF を分割しています…");

  try {
    /** @type {PdfResult[]} */
    let results;

    if (mode === "all-pages") {
      results = await splitAllPages(splitFile, ({ current, total }) => {
        showProcessing("PDF を分割しています…", `${current} / ${total}`);
      });
    } else if (mode === "ranges") {
      const input = splitRangesInput?.value ?? "";
      results = await splitByRanges(splitFile, input, ({ current, total }) => {
        showProcessing("PDF を分割しています…", `${current} / ${total}`);
      });
    } else {
      const chunkSize = Number(splitFixedSizeInput?.value ?? 0);
      results = await splitByFixedSize(splitFile, chunkSize, ({ current, total }) => {
        showProcessing("PDF を分割しています…", `${current} / ${total}`);
      });
    }

    splitResults = results;
    splitDownloadBtn.disabled = false;
    setStatus(
      splitStatus,
      `分割完了（${results.length} ファイル）— ダウンロードできます`,
      "success"
    );
  } catch (error) {
    splitResults = null;
    splitDownloadBtn.disabled = true;
    setStatus(
      splitStatus,
      error instanceof Error ? error.message : "分割に失敗しました",
      "error"
    );
  } finally {
    isBusy = false;
    hideProcessing();
    updateSplitModeFields();
  }
}

async function handleSplitDownload() {
  if (!splitResults?.length) return;
  try {
    const { mode, count } = await downloadPdfResults(splitResults);
    setStatus(
      splitStatus,
      mode === "zip" ? `${count} 件を ZIP でダウンロードしました` : "PDF をダウンロードしました",
      "success"
    );
  } catch (error) {
    setStatus(
      splitStatus,
      error instanceof Error ? error.message : "ダウンロードに失敗しました",
      "error"
    );
  }
}

bindDropZone(mergeDropZone, mergeFileInput, (files) => {
  addMergeFiles(files).catch((error) => {
    setStatus(mergeStatus, error instanceof Error ? error.message : "ファイル追加に失敗しました", "error");
  });
});

bindDropZone(splitDropZone, splitFileInput, (files) => {
  addSplitFile(files).catch((error) => {
    setStatus(splitStatus, error instanceof Error ? error.message : "ファイル追加に失敗しました", "error");
  });
});

mergeBtn?.addEventListener("click", () => {
  handleMerge().catch((error) => {
    setStatus(mergeStatus, error instanceof Error ? error.message : "結合に失敗しました", "error");
  });
});
mergeDownloadBtn?.addEventListener("click", handleMergeDownload);
mergeClearBtn?.addEventListener("click", clearMerge);

splitBtn?.addEventListener("click", () => {
  handleSplit().catch((error) => {
    setStatus(splitStatus, error instanceof Error ? error.message : "分割に失敗しました", "error");
  });
});
splitDownloadBtn?.addEventListener("click", () => {
  handleSplitDownload().catch((error) => {
    setStatus(splitStatus, error instanceof Error ? error.message : "ダウンロードに失敗しました", "error");
  });
});
splitClearBtn?.addEventListener("click", clearSplit);

updateSplitModeFields();
switchTab("merge");

const allowed = await checkAccess();
if (allowed) {
  renderMergeList();
}
