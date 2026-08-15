/**
 * 画像変換アプリ — クライアントサイドのみ
 */

import {
  OUTPUT_FORMATS,
  buildOutputFilename,
  convertFile,
  createPdfPreviewBlob,
  detectInputKind,
  detectSupportedOutputFormats,
  downloadBlob,
  formatBytes,
  formatInputKindLabel,
  getFileExtension,
  inspectInputFile,
} from "./js/convert.js";
import { assignUniqueNames, downloadResultBundle, downloadOpfsFrameBundle, buildResultZipBlob, buildOpfsZipBlob, buildZipFilename } from "./js/download-bundle.js";
import { mapPool } from "./js/async-pool.js";
import { WORKER_POOL_SIZE } from "./js/worker-pool.js";
import { createCloudSaveModal } from "../../js/cloud-save-modal.js";
import { createCloudOpenModal } from "../../js/cloud-open-modal.js";
import { fetchDownloadBlob } from "../cloud-storage/js/api.js";
import {
  convertVideoToFrames,
  readFramePreview,
  inspectVideoFile,
} from "./js/video/convert-video.js";
import { VIDEO_OUTPUT_FORMATS } from "./js/video/constants.js";

const APP_SLUG = "image-converter";
const RESULT_PREVIEW_COUNT = 3;

/** @type {Record<string, string>} */
const FORMAT_HINTS = {
  jpeg: "写真・共有向け",
  png: "透過・高品質",
  webp: "軽量・Web向け",
  avif: "最新・高圧縮",
  gif: "256色・静止画",
  ico: "アイコン・複数サイズ",
  svg: "画像埋め込み",
  pdf: "文書・印刷向け",
};

/** 出力形式の optgroup 定義 */
const FORMAT_GROUPS = [
  { label: "よく使う", formats: ["jpeg", "png", "webp"] },
  { label: "その他の画像", formats: ["avif", "gif", "ico", "svg"] },
  { label: "文書", formats: ["pdf"] },
];

/** 動画フレーム抽出時の出力形式 */
const VIDEO_FORMAT_GROUPS = [{ label: "フレーム連番", formats: ["png", "jpeg", "gif"] }];

const fileInput = document.getElementById("file-input");
const dropZone = document.getElementById("drop-zone");
const formatSelect = document.getElementById("format-select");
const formatDesc = document.getElementById("format-desc");
const formatContext = document.getElementById("format-context");
const qualityInput = document.getElementById("quality");
const qualityValue = document.getElementById("quality-value");
const qualityField = document.getElementById("quality-field");
const maxEdgeInput = document.getElementById("max-edge");
const pdfPagesField = document.getElementById("pdf-pages-field");
const pdfPagesSelect = document.getElementById("pdf-pages");
const icoSizesField = document.getElementById("ico-sizes-field");
const icoSizesGrid = document.getElementById("ico-sizes-grid");
const svgNoteField = document.getElementById("svg-note-field");
const convertBtn = document.getElementById("convert-btn");
const clearBtn = document.getElementById("clear-btn");
const downloadZipBtn = document.getElementById("download-zip-btn");
const fileList = document.getElementById("file-list");
const fileEmpty = document.getElementById("file-empty");
const statusEl = document.getElementById("status");
const convertOverlay = document.getElementById("convert-overlay");
const convertOverlayText = document.getElementById("convert-overlay-text");
const convertProgressBar = document.getElementById("convert-progress-bar");
const cloudLoadBtn = document.getElementById("cloud-load-btn");
const cloudSaveBtn = document.getElementById("cloud-save-btn");
const cloudSaveDialog = document.getElementById("icv-cloud-save-dialog");
const cloudOpenDialog = document.getElementById("icv-cloud-open-dialog");

const cloudSaveModal = cloudSaveDialog
  ? createCloudSaveModal(cloudSaveDialog, {
      idPrefix: "icv-cloud-save",
      loginNext: `/apps/${APP_SLUG}/`,
    })
  : null;

const cloudOpenModal = cloudOpenDialog
  ? createCloudOpenModal(cloudOpenDialog, {
      idPrefix: "icv-cloud-open",
      loginNext: `/apps/${APP_SLUG}/`,
    })
  : null;

/** @type {import('./js/convert-core.js').OutputFormat[]} */
let supportedFormats = ["png"];
/** @type {import('./js/convert-core.js').OutputFormat} */
let selectedFormat = "png";
/** @type {Map<string, FileEntry>} */
const entries = new Map();
let entryCounter = 0;
let isBatchConverting = false;
let renderScheduled = false;

/**
 * @typedef {'pending' | 'converting' | 'done' | 'error'} EntryStatus
 * @typedef {import('./js/convert-core.js').OutputFormat} OutputFormat
 * @typedef {import('./js/convert-core.js').InputKind} InputKind
 * @typedef {{ blob: Blob, name: string }} ConvertResult
 * @typedef {{
 *   id: string,
 *   file: File,
 *   inputKind: InputKind,
 *   status: EntryStatus,
 *   error?: string,
 *   results?: ConvertResult[],
 *   resultsExpanded?: boolean,
 *   previewUrl?: string,
 *   convertProgress?: { done: number, total: number },
 *   videoSession?: Awaited<ReturnType<import('./js/video/opfs-session.js').createOpfsSession>>,
 *   frameCount?: number,
 *   videoWarnings?: string[],
 * }} FileEntry
 */

/** rAF で DOM 更新をまとめる */
function scheduleRender() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    renderFileList();
  });
}

/** 変換オーバーレイを表示（無効化） */
function showConvertOverlay(_text, _progress = 0) {}

/** 変換オーバーレイを非表示（無効化） */
function hideConvertOverlay() {}

/** 変換中は操作を制限 */
function setBatchConverting(active) {
  isBatchConverting = active;
  convertBtn.disabled = active || entries.size === 0;
  clearBtn.disabled = active || entries.size === 0;
  if (formatSelect) formatSelect.disabled = active;
  icoSizesGrid?.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.disabled = active;
  });
  if (active) {
    downloadZipBtn.disabled = true;
    if (cloudSaveBtn) cloudSaveBtn.disabled = true;
    if (cloudLoadBtn) cloudLoadBtn.disabled = true;
  }
}

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href = `/login/?next=${encodeURIComponent(`/apps/${APP_SLUG}/`)}`;
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  document.getElementById("app-main").hidden = false;
  return true;
}

/** キューに動画が含まれるか */
function queueHasVideo() {
  return [...entries.values()].some((entry) => entry.inputKind === "video");
}

/** キューに PDF が含まれるか */
function queueHasPdf() {
  return [...entries.values()].some((entry) => entry.inputKind === "pdf");
}

/** キューにサーバー変換対象が含まれるか */
function queueHasServerImage() {
  return [...entries.values()].some((entry) => entry.inputKind === "server-image");
}

/** 要素の表示/非表示を切り替え */
function setFieldHidden(element, hidden) {
  if (!element) return;
  element.hidden = hidden;
}

/** 選択中の出力形式を設定 */
function setOutputFormat(formatId) {
  if (!supportedFormats.includes(formatId)) return;
  selectedFormat = formatId;
  if (formatSelect && formatSelect.value !== formatId) {
    formatSelect.value = formatId;
  }
  const hint = FORMAT_HINTS[formatId] ?? "";
  if (formatDesc) {
    formatDesc.textContent = hint;
    formatDesc.hidden = !hint;
  }
  refreshOptionVisibility();
}

/** 出力形式セレクトを初期化 */
function refreshOutputFormats() {
  const allFormats = detectSupportedOutputFormats();
  const hidePdf = queueHasPdf() || queueHasServerImage() || queueHasVideo();
  const hasVideo = queueHasVideo();

  if (hasVideo) {
    supportedFormats = ["png", "jpeg", "gif"].filter((format) =>
      VIDEO_OUTPUT_FORMATS.has(format),
    );
  } else {
    supportedFormats = hidePdf ? allFormats.filter((format) => format !== "pdf") : allFormats;
  }

  const previous = selectedFormat;
  if (formatSelect) {
    formatSelect.replaceChildren();
    const groups = hasVideo ? VIDEO_FORMAT_GROUPS : FORMAT_GROUPS;
    for (const group of groups) {
      const formats = group.formats.filter((formatId) => supportedFormats.includes(formatId));
      if (formats.length === 0) continue;

      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      for (const formatId of formats) {
        const spec = OUTPUT_FORMATS[formatId];
        const option = document.createElement("option");
        option.value = formatId;
        option.textContent = spec.label.replace(/\s*\([^)]+\)/, "");
        optgroup.appendChild(option);
      }
      formatSelect.appendChild(optgroup);
    }
  }

  if (supportedFormats.includes(previous)) {
    setOutputFormat(previous);
  } else if (supportedFormats.includes("png")) {
    setOutputFormat("png");
  } else if (supportedFormats.length > 0) {
    setOutputFormat(supportedFormats[0]);
  }
}

/** 出力形式に応じて UI を切り替え */
function refreshOptionVisibility() {
  const format = selectedFormat;
  const spec = OUTPUT_FORMATS[format];
  const isPdfOutput = format === "pdf";
  const showQuality = spec?.lossy === true;
  const showPdfPages = queueHasPdf() && !isPdfOutput;
  const showIcoSizes = format === "ico";
  const showSvgNote = format === "svg";
  const hideMaxEdge = queueHasVideo();

  setFieldHidden(qualityField, !showQuality);
  setFieldHidden(pdfPagesField, !showPdfPages);
  setFieldHidden(icoSizesField, !showIcoSizes);
  setFieldHidden(svgNoteField, !showSvgNote);
  setFieldHidden(maxEdgeInput?.closest(".icv-field") ?? null, hideMaxEdge);

  const hasContextOptions = showQuality || showPdfPages || showIcoSizes || showSvgNote;
  setFieldHidden(formatContext, !hasContextOptions);
}

/** 選択中の ICO サイズ（px）を取得 */
function getSelectedIcoSizes() {
  if (!icoSizesGrid) return [16, 32, 48];
  const sizes = [...icoSizesGrid.querySelectorAll("input[type='checkbox']:checked")]
    .map((input) => Number(input.value))
    .filter((size) => size >= 16 && size <= 256);
  return sizes.length > 0 ? sizes : [16, 32, 48];
}

/** ステータスメッセージを表示 */
function setStatus(message, tone = "info") {
  statusEl.textContent = message;
  statusEl.dataset.tone = tone;
}

/** 変換結果の合計サイズ */
function totalResultBytes(results) {
  return results.reduce((sum, item) => sum + item.blob.size, 0);
}

/** エントリ一覧の表示を更新 */
function renderFileList() {
  const items = [...entries.values()];
  fileEmpty.hidden = items.length > 0;

  const existingIds = new Set(items.map((item) => item.id));
  for (const child of [...fileList.children]) {
    if (child instanceof HTMLElement && child.dataset.id && !existingIds.has(child.dataset.id)) {
      child.remove();
    }
  }

  for (const entry of items) {
    const existing = fileList.querySelector(`[data-id="${entry.id}"]`);
    const row = createFileRow(entry);
    if (existing) {
      existing.replaceWith(row);
    } else {
      fileList.appendChild(row);
    }
  }

  const hasFiles = items.length > 0;
  const hasDone = items.some((item) => item.status === "done" && (item.results?.length || item.videoSession));
  if (!isBatchConverting) {
    convertBtn.disabled = !hasFiles;
    clearBtn.disabled = !hasFiles;
    downloadZipBtn.disabled = !hasDone;
    if (cloudSaveBtn) cloudSaveBtn.disabled = !hasDone;
  }
  downloadZipBtn.textContent =
    countDoneResults() > 1 ? `ZIPでまとめて保存（${countDoneResults()}件）` : "ZIPでまとめて保存";
}

/** 変換済み結果の件数 */
function countDoneResults() {
  return [...entries.values()].reduce((sum, entry) => sum + (entry.results?.length ?? 0), 0);
}

/** 全エントリの結果名をユニーク化 */
function dedupeAllResultNames() {
  const allResults = [...entries.values()].flatMap((entry) => entry.results ?? []);
  if (allResults.length > 0) {
    assignUniqueNames(allResults);
  }
}

/** 1件分の行 DOM を生成 */
function createFileRow(entry) {
  const row = document.createElement("li");
  row.className = "icv-file";
  row.dataset.id = entry.id;

  const thumb = document.createElement("div");
  thumb.className = "icv-file-thumb";
  if (entry.status === "converting") {
    thumb.classList.add("icv-file-thumb--loading");
    const spinner = document.createElement("span");
    spinner.className = "icv-spinner";
    spinner.setAttribute("aria-hidden", "true");
    thumb.appendChild(spinner);
  } else if (entry.previewUrl) {
    const img = document.createElement("img");
    img.src = entry.previewUrl;
    img.alt = "";
    thumb.appendChild(img);
  } else {
    thumb.textContent =
      entry.inputKind === "pdf"
        ? "PDF"
        : entry.inputKind === "server-image"
          ? "CF"
          : entry.inputKind === "video"
            ? "VID"
            : "IMG";
  }

  const body = document.createElement("div");
  body.className = "icv-file-body";

  const name = document.createElement("div");
  name.className = "icv-file-name";
  name.textContent = entry.file.name;

  const meta = document.createElement("div");
  meta.className = "icv-file-meta";
  const ext = getFileExtension(entry.file.name).toUpperCase() || entry.file.type || "不明";
  meta.textContent = `${formatInputKindLabel(entry.inputKind)} · ${ext} · ${formatBytes(entry.file.size)}`;

  const state = document.createElement("div");
  state.className = `icv-file-state icv-file-state--${entry.status}`;
  state.textContent = formatEntryStatus(entry);

  body.append(name, meta, state);

  if (entry.status === "converting" && entry.convertProgress) {
    const progress = document.createElement("div");
    progress.className = "icv-file-progress";
    const unit = entry.inputKind === "video" ? "フレーム" : "ページ";
    progress.textContent = `${unit} ${entry.convertProgress.done} / ${entry.convertProgress.total}`;
    body.appendChild(progress);
  }

  if (entry.videoWarnings?.length) {
    const warn = document.createElement("div");
    warn.className = "icv-file-warn";
    warn.textContent = entry.videoWarnings.join(" · ");
    body.appendChild(warn);
  }

  if (entry.results?.length) {
    body.appendChild(createResultList(entry));
  }

  const actions = document.createElement("div");
  actions.className = "icv-file-actions";

  if (entry.status === "done" || entry.status === "error") {
    const reconvertBtn = document.createElement("button");
    reconvertBtn.type = "button";
    reconvertBtn.className = "icv-btn icv-btn--small icv-btn--reconvert";
    reconvertBtn.textContent = "再変換";
    reconvertBtn.addEventListener("click", () => {
      reconvertEntry(entry.id).catch((error) => {
        setStatus(error instanceof Error ? error.message : "再変換に失敗しました", "error");
      });
    });
    actions.appendChild(reconvertBtn);
  }

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "icv-btn icv-btn--ghost";
  removeBtn.textContent = "削除";
  removeBtn.addEventListener("click", () => removeEntry(entry.id));
  actions.appendChild(removeBtn);

  row.append(thumb, body, actions);
  return row;
}

/** 変換結果リスト（先頭3件 + 展開） */
function createResultList(entry) {
  const wrap = document.createElement("div");
  wrap.className = "icv-result-wrap";

  const resultList = document.createElement("ul");
  resultList.className = "icv-result-list";

  const results = entry.results ?? [];
  const expanded = entry.resultsExpanded === true;
  const visible = expanded ? results : results.slice(0, RESULT_PREVIEW_COUNT);
  const hiddenCount = results.length - visible.length;

  for (const result of visible) {
    resultList.appendChild(createResultItem(result));
  }
  wrap.appendChild(resultList);

  if (hiddenCount > 0) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "icv-btn icv-btn--expand";
    toggle.textContent = `以下 ${hiddenCount} 件を表示`;
    toggle.addEventListener("click", () => {
      entry.resultsExpanded = true;
      scheduleRender();
    });
    wrap.appendChild(toggle);
  } else if (expanded && results.length > RESULT_PREVIEW_COUNT) {
    const collapse = document.createElement("button");
    collapse.type = "button";
    collapse.className = "icv-btn icv-btn--expand";
    collapse.textContent = "折りたたむ";
    collapse.addEventListener("click", () => {
      entry.resultsExpanded = false;
      scheduleRender();
    });
    wrap.appendChild(collapse);
  }

  return wrap;
}

/** 変換結果1行 */
function createResultItem(result) {
  const resultItem = document.createElement("li");
  resultItem.className = "icv-result-item";

  const resultLabel = document.createElement("span");
  resultLabel.className = "icv-result-name";
  resultLabel.textContent = `${result.name} (${formatBytes(result.blob.size)})`;

  const dlBtn = document.createElement("button");
  dlBtn.type = "button";
  dlBtn.className = "icv-btn icv-btn--small";
  dlBtn.textContent = "保存";
  dlBtn.addEventListener("click", () => downloadBlob(result.blob, result.name));

  resultItem.append(resultLabel, dlBtn);
  return resultItem;
}

/** エントリ状態の表示文言 */
function formatEntryStatus(entry) {
  if (entry.status === "pending") return "待機中";
  if (entry.status === "converting") {
    if (entry.convertProgress) {
      return `変換中… ${entry.convertProgress.done}/${entry.convertProgress.total}`;
    }
    return "変換中…";
  }
  if (entry.status === "done" && entry.results?.length) {
    const count = entry.frameCount ?? entry.results.length;
    const size = formatBytes(totalResultBytes(entry.results));
    if (entry.inputKind === "video" && entry.frameCount) {
      return `完了 · ${count.toLocaleString()} フレーム · プレビュー ${entry.results.length} 件`;
    }
    return count > 1 ? `完了 · ${count} ファイル · ${size}` : `完了 · ${size}`;
  }
  if (entry.status === "error") return entry.error ?? "変換失敗";
  return "—";
}

/** 動画 OPFS セッションを解放 */
async function disposeVideoSession(entry) {
  if (!entry.videoSession) return;
  try {
    await entry.videoSession.dispose();
  } catch {
    // 失敗しても続行
  }
  entry.videoSession = undefined;
}

/** プレビュー URL を解放 */
function revokePreview(entry) {
  if (entry.previewUrl) {
    URL.revokeObjectURL(entry.previewUrl);
    entry.previewUrl = undefined;
  }
}

/** エントリを削除 */
async function removeEntry(id) {
  const entry = entries.get(id);
  if (!entry) return;
  revokePreview(entry);
  await disposeVideoSession(entry);
  entries.delete(id);
  refreshOutputFormats();
  renderFileList();
  if (entries.size === 0) {
    setStatus("ファイルを追加してください");
  }
}

/** プレビューを非同期生成 */
async function attachPreview(entry) {
  if (entry.inputKind === "server-image") {
    return;
  }

  try {
    if (entry.inputKind === "pdf") {
      const blob = await createPdfPreviewBlob(entry.file, 120);
      if (!entries.has(entry.id)) return;
      revokePreview(entry);
      entry.previewUrl = URL.createObjectURL(blob);
    } else if (entry.inputKind === "video") {
      revokePreview(entry);
      entry.previewUrl = URL.createObjectURL(entry.file);
    } else {
      entry.previewUrl = URL.createObjectURL(entry.file);
    }
    renderFileList();
  } catch {
    /* プレビュー失敗は無視 */
  }
}

/** 動画追加時の警告を非同期で付与 */
async function attachVideoWarnings(entry) {
  if (entry.inputKind !== "video") return;
  const inspection = await inspectVideoFile(entry.file, "png");
  if (!entries.has(entry.id)) return;
  if (!inspection.ok) {
    entry.status = "error";
    entry.error = inspection.reason;
    scheduleRender();
    return;
  }
  entry.videoWarnings = inspection.warnings;
  scheduleRender();
}

/** ファイルをキューに追加 */
function addFiles(fileListLike) {
  const files = [...fileListLike].filter((file) => file instanceof File);
  if (files.length === 0) return;

  let added = 0;
  let skipped = 0;

  for (const file of files) {
    const inspection = inspectInputFile(file);
    if (!inspection.ok) {
      skipped += 1;
      continue;
    }

    const id = `f_${++entryCounter}`;
    const entry = {
      id,
      file,
      inputKind: detectInputKind(file),
      status: "pending",
    };
    entries.set(id, entry);
    attachPreview(entry);
    if (entry.inputKind === "video") {
      attachVideoWarnings(entry);
    }
    added += 1;
  }

  refreshOutputFormats();
  renderFileList();

  if (added > 0 && skipped > 0) {
    setStatus(`${added} 件追加、${skipped} 件は非対応形式のためスキップしました`, "warn");
  } else if (added > 0) {
    const hasGif = files.some((file) => getFileExtension(file.name) === "gif");
    setStatus(
      hasGif ? `${added} 件追加（GIF は先頭フレームのみ変換）` : `${added} 件追加しました`,
      hasGif ? "warn" : "info",
    );
  } else {
    setStatus("対応していない形式のファイルです", "error");
  }
}

/** 変換オプションを取得 */
function getConvertOptions() {
  return {
    format: selectedFormat,
    quality: Number(qualityInput.value),
    maxEdge: Number(maxEdgeInput.value) || 0,
    pdfPages: /** @type {'all' | 'first'} */ (pdfPagesSelect.value),
    icoSizes: getSelectedIcoSizes(),
  };
}

/** 1件の変換を実行 */
async function runConvertEntry(entry, options) {
  entry.status = "converting";
  entry.error = undefined;
  entry.results = undefined;
  entry.resultsExpanded = false;
  entry.convertProgress = undefined;
  entry.frameCount = undefined;
  await disposeVideoSession(entry);
  scheduleRender();

  if (entry.inputKind === "video") {
    const format = /** @type {'png' | 'jpeg' | 'gif'} */ (
      VIDEO_OUTPUT_FORMATS.has(options.format) ? options.format : "png"
    );
    const videoOptions = { format, quality: options.quality };

    const converted = await convertVideoToFrames(entry.file, videoOptions, {
      onProgress: (meta) => {
        entry.convertProgress = meta;
        scheduleRender();
      },
    });

    entry.videoSession = converted.session;
    entry.frameCount = converted.frameCount;
    entry.videoWarnings = [...(entry.videoWarnings ?? []), ...converted.warnings];
    entry.results = await readFramePreview(converted.session, RESULT_PREVIEW_COUNT);
    entry.status = "done";
    entry.convertProgress = undefined;
    return;
  }

  const converted = await convertFile(entry.file, options, {
    onProgress: async (items, meta) => {
      entry.results = items.map((item) => ({
        blob: item.blob,
        name: buildOutputFilename(entry.file.name, options.format, item.pageNum),
      }));
      if (meta) {
        entry.convertProgress = meta;
      }
      scheduleRender();
    },
  });

  entry.status = "done";
  entry.results = converted.map((item) => ({
    blob: item.blob,
    name: buildOutputFilename(entry.file.name, options.format, item.pageNum),
  }));
  entry.convertProgress = undefined;
}

/** 1件だけ再変換 */
async function reconvertEntry(id) {
  const entry = entries.get(id);
  if (!entry || isBatchConverting) return;

  setBatchConverting(true);
  showConvertOverlay(`「${entry.file.name}」を変換中…`, 30);
  const options = getConvertOptions();

  try {
    await runConvertEntry(entry, options);
    dedupeAllResultNames();
    setStatus(`「${entry.file.name}」の再変換が完了しました`, "success");
  } catch (error) {
    entry.status = "error";
    entry.error = error instanceof Error ? error.message : "変換に失敗しました";
    entry.convertProgress = undefined;
    setStatus(entry.error, "error");
  } finally {
    setBatchConverting(false);
    hideConvertOverlay();
    scheduleRender();
  }
}

/** 全ファイルを変換（動画は直列、画像は並行） */
async function convertAll() {
  const options = getConvertOptions();
  const targets = [...entries.values()].filter((entry) => entry.status !== "converting");
  if (targets.length === 0) return;

  setBatchConverting(true);
  showConvertOverlay("変換を準備中…", 0);
  setStatus("変換中…");

  let doneCount = 0;
  let errorCount = 0;
  const total = targets.length;
  const videoTargets = targets.filter((entry) => entry.inputKind === "video");
  const imageTargets = targets.filter((entry) => entry.inputKind !== "video");

  const reportProgress = () => {
    showConvertOverlay(
      `変換中… ${doneCount + errorCount}/${total}`,
      ((doneCount + errorCount) / total) * 100,
    );
    scheduleRender();
  };

  for (const entry of videoTargets) {
    reportProgress();
    try {
      await runConvertEntry(entry, options);
      doneCount += 1;
    } catch (error) {
      entry.status = "error";
      entry.error = error instanceof Error ? error.message : "変換に失敗しました";
      entry.convertProgress = undefined;
      await disposeVideoSession(entry);
      errorCount += 1;
    }
    reportProgress();
  }

  await mapPool(imageTargets, WORKER_POOL_SIZE, async (entry) => {
    reportProgress();
    try {
      await runConvertEntry(entry, options);
      doneCount += 1;
    } catch (error) {
      entry.status = "error";
      entry.error = error instanceof Error ? error.message : "変換に失敗しました";
      entry.convertProgress = undefined;
      errorCount += 1;
    }
    reportProgress();
  });

  dedupeAllResultNames();
  setBatchConverting(false);
  hideConvertOverlay();
  scheduleRender();

  if (errorCount === 0) {
    setStatus(`${doneCount} 件の変換が完了しました`, "success");
  } else {
    setStatus(`${doneCount} 件成功、${errorCount} 件失敗`, "warn");
  }
}

/** 変換済みのエクスポート用 Blob を組み立てる */
async function buildCloudSavePayload(options = {}) {
  const imageResults = [];
  const videoEntries = [];

  for (const entry of entries.values()) {
    if (entry.status !== "done") continue;
    if (entry.videoSession) {
      videoEntries.push(entry);
    } else if (entry.results?.length) {
      imageResults.push(...entry.results);
    }
  }

  if (imageResults.length === 0 && videoEntries.length === 0) {
    throw new Error("保存できる変換結果がありません");
  }

  const payloads = [];

  if (imageResults.length > 0) {
    payloads.push(await buildResultZipBlob(imageResults));
  }

  for (const entry of videoEntries) {
    if (!entry.videoSession) continue;
    payloads.push(
      await buildOpfsZipBlob(entry.videoSession, {
        onProgress: options.onProgress,
      })
    );
  }

  if (payloads.length === 1) {
    return payloads[0];
  }

  const files = {};
  const used = new Set();
  for (const payload of payloads) {
    const name = ensureUniqueExportName(used, payload.filename);
    files[name] = new Uint8Array(await payload.blob.arrayBuffer());
  }

  const { zip } = await import("fflate");
  const data = await new Promise((resolve, reject) => {
    zip(files, { level: 0 }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  return {
    blob: new Blob([data], { type: "application/zip" }),
    filename: buildZipFilename(),
    mode: "zip",
    count: payloads.reduce((sum, item) => sum + item.count, 0),
  };
}

/** エクスポート ZIP 内のファイル名重複を避ける */
function ensureUniqueExportName(usedNames, desired) {
  const key = desired.toLowerCase();
  if (!usedNames.has(key)) {
    usedNames.add(key);
    return desired;
  }

  const dot = desired.lastIndexOf(".");
  const base = dot > 0 ? desired.slice(0, dot) : desired;
  const ext = dot > 0 ? desired.slice(dot) : "";
  let index = 2;

  while (usedNames.has(`${base} (${index})${ext}`.toLowerCase())) {
    index += 1;
  }

  const unique = `${base} (${index})${ext}`;
  usedNames.add(unique.toLowerCase());
  return unique;
}

/** クラウド保存ダイアログを開く */
async function openCloudSave() {
  if (!cloudSaveModal) {
    setStatus("保存ダイアログを初期化できませんでした", "error");
    return;
  }

  if (isBatchConverting) return;

  cloudSaveBtn.disabled = true;
  setStatus("保存用ファイルを準備中…");

  try {
    const payload = await buildCloudSavePayload({
      onProgress: ({ done, total }) => {
        setStatus(`保存用 ZIP を作成中… ${done}/${total} フレーム`);
      },
    });

    cloudSaveModal.open({
      blob: payload.blob,
      filename: payload.filename,
    });
    setStatus("クラウド保存先を選択してください");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "保存の準備に失敗しました", "error");
  } finally {
    const hasDone = [...entries.values()].some(
      (item) => item.status === "done" && (item.results?.length || item.videoSession)
    );
    cloudSaveBtn.disabled = !hasDone || isBatchConverting;
  }
}

/** クラウド読み込みダイアログを開く */
function openCloudLoad() {
  if (!cloudOpenModal) {
    setStatus("読み込みダイアログを初期化できませんでした", "error");
    return;
  }

  cloudOpenModal.open({
    onFilesLoaded: (files) => {
      addFiles(files);
    },
  });
}

/** URL パラメータ storagePath からファイルを読み込む */
async function openFromStoragePath(storagePath) {
  setStatus("クラウドから読み込み中…");
  const blob = await fetchDownloadBlob(storagePath);
  const name = storagePath.split("/").pop() || "file";
  addFiles([new File([blob], name, { type: blob.type || "application/octet-stream" })]);
  setStatus("クラウドからファイルを読み込みました", "success");
}

/** 変換済みを ZIP（複数）または直接（1件）でダウンロード */
async function downloadAllAsZip() {
  const imageResults = [];
  const videoEntries = [];

  for (const entry of entries.values()) {
    if (entry.status !== "done") continue;
    if (entry.videoSession) {
      videoEntries.push(entry);
    } else if (entry.results?.length) {
      imageResults.push(...entry.results);
    }
  }

  if (imageResults.length === 0 && videoEntries.length === 0) return;

  downloadZipBtn.disabled = true;
  setStatus("ZIP を作成中…");
  try {
    if (imageResults.length > 0) {
      const result = await downloadResultBundle(imageResults);
      if (result.mode === "zip") {
        setStatus(`${result.count} 件を ZIP でダウンロードしました`, "success");
      } else {
        setStatus("ファイルをダウンロードしました", "success");
      }
    }

    for (const entry of videoEntries) {
      if (!entry.videoSession) continue;
      const result = await downloadOpfsFrameBundle(entry.videoSession, {
        onProgress: ({ done, total }) => {
          setStatus(`ZIP を作成中… ${done}/${total} フレーム`);
        },
      });
      setStatus(`「${entry.file.name}」${result.count} フレームを ZIP で保存しました`, "success");
    }
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "ダウンロードに失敗しました", "error");
  } finally {
    downloadZipBtn.disabled = countDoneResults() === 0 && !hasDoneVideoFrames();
  }
}

/** 動画フレームが OPFS にある完了エントリがあるか */
function hasDoneVideoFrames() {
  return [...entries.values()].some((entry) => entry.status === "done" && entry.videoSession);
}

/** すべてクリア */
async function clearAll() {
  for (const entry of entries.values()) {
    revokePreview(entry);
    await disposeVideoSession(entry);
  }
  entries.clear();
  fileInput.value = "";
  refreshOutputFormats();
  renderFileList();
  setStatus("ファイルを追加してください");
}

/** ドロップ対象か */
function isFileDrag(event) {
  const types = Array.from(event.dataTransfer?.types ?? []).map((type) => type.toLowerCase());
  return types.includes("files") || types.includes("application/x-moz-file");
}

/** DataTransfer から File 一覧を取得 */
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
    if (files.length > 0) return files;
  }
  return [...(dataTransfer.files ?? [])];
}

/** D&D のデフォルト操作を抑止 */
function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

/** ページ全体でブラウザのファイル開きを抑止 */
for (const eventName of ["dragenter", "dragover", "drop"]) {
  document.addEventListener(eventName, (event) => {
    event.preventDefault();
  });
}

dropZone.addEventListener("dragenter", (event) => {
  if (!isFileDrag(event)) return;
  preventDefaults(event);
  dropZone.classList.add("icv-drop-zone--active");
});

dropZone.addEventListener("dragover", (event) => {
  if (!isFileDrag(event)) return;
  preventDefaults(event);
  event.dataTransfer.dropEffect = "copy";
  dropZone.classList.add("icv-drop-zone--active");
});

dropZone.addEventListener("dragleave", (event) => {
  if (!isFileDrag(event)) return;
  preventDefaults(event);
  const related = event.relatedTarget;
  if (related instanceof Node && dropZone.contains(related)) {
    return;
  }
  dropZone.classList.remove("icv-drop-zone--active");
});

dropZone.addEventListener("drop", (event) => {
  if (!isFileDrag(event)) return;
  preventDefaults(event);
  dropZone.classList.remove("icv-drop-zone--active");
  addFiles(filesFromDataTransfer(event.dataTransfer));
});

dropZone.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  addFiles(fileInput.files ?? []);
  fileInput.value = "";
});

qualityInput.addEventListener("input", () => {
  qualityValue.textContent = qualityInput.value;
});

formatSelect?.addEventListener("change", () => {
  setOutputFormat(formatSelect.value);
});

convertBtn.addEventListener("click", () => {
  convertAll().catch((error) => {
    setStatus(error instanceof Error ? error.message : "変換に失敗しました", "error");
  });
});

downloadZipBtn.addEventListener("click", () => {
  downloadAllAsZip().catch((error) => {
    setStatus(error instanceof Error ? error.message : "ダウンロードに失敗しました", "error");
  });
});
clearBtn.addEventListener("click", clearAll);

cloudLoadBtn?.addEventListener("click", () => {
  openCloudLoad();
});

cloudSaveBtn?.addEventListener("click", () => {
  openCloudSave().catch((error) => {
    setStatus(error instanceof Error ? error.message : "クラウド保存に失敗しました", "error");
  });
});

document.addEventListener("paste", (event) => {
  const items = event.clipboardData?.items;
  if (!items?.length) return;
  const files = [];
  for (const item of items) {
    if (item.kind !== "file") continue;
    const file = item.getAsFile();
    if (!file) continue;
    const name = file.name && file.name !== "image.png" ? file.name : `clipboard-${Date.now()}.png`;
    files.push(new File([file], name, { type: file.type || "image/png" }));
  }
  if (files.length > 0) {
    event.preventDefault();
    addFiles(files);
  }
});

const allowed =
  /** @type {Window & { __ICV_E2E__?: boolean }} */ (window).__ICV_E2E__ === true ||
  (await checkAccess());
if (allowed) {
  refreshOutputFormats();
  qualityValue.textContent = qualityInput.value;
  renderFileList();
  setStatus("ファイルを追加してください");

  const storagePath = new URLSearchParams(location.search).get("storagePath")?.trim();
  if (storagePath) {
    openFromStoragePath(storagePath).catch((error) => {
      setStatus(error instanceof Error ? error.message : "クラウドからの読み込みに失敗しました", "error");
    });
  }
}
