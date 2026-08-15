/**
 * 動画変換アプリ — クライアントサイド（ffmpeg.wasm）
 */

import { APP_SLUG, OUTPUT_FORMATS } from "./js/constants.js";
import { convertVideoFile } from "./js/convert-video.js";
import {
  buildOutputFilename,
  downloadBlob,
  formatBytes,
  getFileExtension,
  inspectVideoInput,
} from "./js/format-utils.js";
import { detectImageLabel, sniffFileKind } from "./js/file-sniff.js";
import { probePlayableVideo } from "./js/video-probe.js";
import { createCloudSaveModal } from "../../js/cloud-save-modal.js";
import { createCloudOpenModal } from "../../js/cloud-open-modal.js";
import { fetchDownloadBlob } from "../cloud-storage/js/api.js";

const fileInput = document.getElementById("file-input");
const dropZone = document.getElementById("drop-zone");
const formatSelect = document.getElementById("format-select");
const qualityInput = document.getElementById("quality");
const qualityValue = document.getElementById("quality-value");
const convertBtn = document.getElementById("convert-btn");
const clearBtn = document.getElementById("clear-btn");
const downloadAllBtn = document.getElementById("download-all-btn");
const cloudLoadBtn = document.getElementById("cloud-load-btn");
const cloudSaveBtn = document.getElementById("cloud-save-btn");
const fileListEl = document.getElementById("file-list");
const fileEmpty = document.getElementById("file-empty");
const statusEl = document.getElementById("status");

const cloudSaveDialog = document.getElementById("vcv-cloud-save-dialog");
const cloudOpenDialog = document.getElementById("vcv-cloud-open-dialog");

const cloudSaveModal = cloudSaveDialog
  ? createCloudSaveModal(cloudSaveDialog, {
      idPrefix: "vcv-cloud-save",
      loginNext: `/apps/${APP_SLUG}/`,
    })
  : null;

const cloudOpenModal = cloudOpenDialog
  ? createCloudOpenModal(cloudOpenDialog, {
      idPrefix: "vcv-cloud-open",
      loginNext: `/apps/${APP_SLUG}/`,
    })
  : null;

/** @typedef {'pending' | 'converting' | 'done' | 'error'} EntryStatus */
/** @typedef {{
 *   id: string,
 *   file: File,
 *   status: EntryStatus,
 *   error?: string,
 *   resultBlob?: Blob,
 *   resultName?: string,
 *   warnings?: string[],
 *   progress?: { message: string, ratio: number, part?: number, totalParts?: number },
 * }} FileEntry */

/** @type {Map<string, FileEntry>} */
const entries = new Map();
let entryCounter = 0;
let isBatchConverting = false;
/** @type {'mp4' | 'webm'} */
let selectedFormat = "mp4";

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
    document.getElementById("access-denied").hidden = false;
    const denied = document.getElementById("access-denied");
    if (denied) {
      const p = denied.querySelector("p");
      if (p) {
        p.textContent =
          "動画変換アプリが登録されていないか、見つかりません。管理者にマイグレーション（0075_video_converter_app.sql）の適用を確認してください。";
      }
    }
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  document.getElementById("app-main").hidden = false;
  return true;
}

/** ステータス表示 */
function setStatus(message, tone = "info") {
  statusEl.textContent = message;
  statusEl.dataset.tone = tone;
}

/** 出力形式セレクトを初期化 */
function initFormatSelect() {
  if (!formatSelect) return;
  formatSelect.replaceChildren();
  for (const spec of Object.values(OUTPUT_FORMATS)) {
    const option = document.createElement("option");
    option.value = spec.id;
    option.textContent = spec.label;
    formatSelect.appendChild(option);
  }
  formatSelect.value = selectedFormat;
}

/** 変換オプション */
function getConvertOptions() {
  return {
    format: selectedFormat,
    crf: Number(qualityInput?.value ?? 23),
  };
}

/** 一覧を再描画 */
function renderFileList() {
  const items = [...entries.values()];
  fileEmpty.hidden = items.length > 0;

  fileListEl.replaceChildren();
  for (const entry of items) {
    fileListEl.appendChild(createFileRow(entry));
  }

  const hasFiles = items.length > 0;
  const hasDone = items.some((item) => item.status === "done" && item.resultBlob);

  if (!isBatchConverting) {
    convertBtn.disabled = !hasFiles;
    clearBtn.disabled = !hasFiles;
    downloadAllBtn.disabled = !hasDone;
    if (cloudSaveBtn) cloudSaveBtn.disabled = !hasDone;
  }
}

/** 1行 DOM */
function createFileRow(entry) {
  const row = document.createElement("li");
  row.className = "vcv-file";
  row.dataset.id = entry.id;

  const thumb = document.createElement("div");
  thumb.className = "vcv-file-thumb";
  if (entry.status === "converting") {
    thumb.classList.add("vcv-file-thumb--loading");
    const spinner = document.createElement("span");
    spinner.className = "vcv-spinner";
    spinner.setAttribute("aria-hidden", "true");
    thumb.appendChild(spinner);
  } else {
    thumb.textContent = "VID";
  }

  const body = document.createElement("div");
  body.className = "vcv-file-body";

  const name = document.createElement("div");
  name.className = "vcv-file-name";
  name.textContent = entry.file.name;

  const meta = document.createElement("div");
  meta.className = "vcv-file-meta";
  const ext = getFileExtension(entry.file.name).toUpperCase() || "動画";
  meta.textContent = `${ext} · ${formatBytes(entry.file.size)}`;

  const state = document.createElement("div");
  state.className = `vcv-file-state vcv-file-state--${entry.status}`;
  state.textContent = formatEntryStatus(entry);

  body.append(name, meta, state);

  if (entry.progress?.message && entry.status === "converting") {
    const progress = document.createElement("div");
    progress.className = "vcv-file-progress";
    progress.textContent = entry.progress.message;
    body.appendChild(progress);
  }

  if (entry.warnings?.length) {
    const warn = document.createElement("div");
    warn.className = "vcv-file-warn";
    warn.textContent = entry.warnings.join(" · ");
    body.appendChild(warn);
  }

  if (entry.status === "done" && entry.resultBlob && entry.resultName) {
    const result = document.createElement("div");
    result.className = "vcv-result";
    result.textContent = `${entry.resultName} (${formatBytes(entry.resultBlob.size)})`;

    const dlBtn = document.createElement("button");
    dlBtn.type = "button";
    dlBtn.className = "vcv-btn vcv-btn--small";
    dlBtn.textContent = "保存";
    dlBtn.addEventListener("click", () => {
      downloadBlob(entry.resultBlob, entry.resultName);
    });

    const resultWrap = document.createElement("div");
    resultWrap.className = "vcv-result-row";
    resultWrap.append(result, dlBtn);
    body.appendChild(resultWrap);
  }

  const actions = document.createElement("div");
  actions.className = "vcv-file-actions";

  if (entry.status === "done" || entry.status === "error") {
    const reconvertBtn = document.createElement("button");
    reconvertBtn.type = "button";
    reconvertBtn.className = "vcv-btn vcv-btn--small";
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
  removeBtn.className = "vcv-btn vcv-btn--ghost";
  removeBtn.textContent = "削除";
  removeBtn.addEventListener("click", () => removeEntry(entry.id));
  actions.appendChild(removeBtn);

  row.append(thumb, body, actions);
  return row;
}

/** 状態ラベル */
function formatEntryStatus(entry) {
  if (entry.status === "pending") return "待機中";
  if (entry.status === "converting") return entry.progress?.message ?? "変換中…";
  if (entry.status === "done") return "完了";
  if (entry.status === "error") return entry.error ?? "変換失敗";
  return "—";
}

/** キューに追加 */
async function addFiles(fileListLike) {
  const files = [...fileListLike].filter((file) => file instanceof File);
  if (files.length === 0) return;

  let added = 0;
  let skipped = 0;

  for (const file of files) {
    const inspection = inspectVideoInput(file);
    if (!inspection.ok) {
      skipped += 1;
      continue;
    }

    const kind = await sniffFileKind(file);
    if (kind === "image") {
      const label = await detectImageLabel(file);
      setStatus(
        `「${file.name}」は拡張子と中身が一致しません（実体は ${label}）。画像変換アプリをご利用ください`,
        "error",
      );
      skipped += 1;
      continue;
    }

    const id = `v_${++entryCounter}`;
    const entry = {
      id,
      file,
      status: "pending",
      warnings: inspection.warnings,
    };
    entries.set(id, entry);
    added += 1;
    validateEntryContent(entry);
  }

  renderFileList();

  if (added > 0 && skipped > 0) {
    setStatus(`${added} 件追加、${skipped} 件はスキップしました`, "warn");
  } else if (added > 0) {
    setStatus(`${added} 件追加しました`);
  } else if (skipped > 0 && entries.size === 0) {
    setStatus("対応していないファイルです", "error");
  }
}

/** 追加後に動画として再生可能か検証 */
async function validateEntryContent(entry) {
  try {
    const meta = await probePlayableVideo(entry.file);
    if (!entries.has(entry.id)) return;

    if (meta.duration > 0 && meta.width === 0 && meta.height === 0) {
      entry.warnings = [...(entry.warnings ?? []), "映像トラックがない可能性があります"];
    }
    renderFileList();
  } catch (error) {
    if (!entries.has(entry.id)) return;

    const kind = await sniffFileKind(entry.file);
    if (kind === "image") {
      const label = await detectImageLabel(entry.file);
      entry.status = "error";
      entry.error = `動画ではなく ${label} ファイルのようです`;
    } else {
      entry.status = "error";
      entry.error =
        error instanceof Error
          ? error.message
          : "動画として読み込めません。ファイルが破損している可能性があります";
    }
    renderFileList();
  }
}

/** エントリ削除 */
function removeEntry(id) {
  entries.delete(id);
  renderFileList();
  if (entries.size === 0) {
    setStatus("動画ファイルを追加してください");
  }
}

/** 1件変換 */
async function runConvertEntry(entry, options) {
  if (entry.status === "error") {
    throw new Error(entry.error ?? "このファイルは変換できません");
  }

  const kind = await sniffFileKind(entry.file);
  if (kind === "image") {
    const label = await detectImageLabel(entry.file);
    throw new Error(`動画ではなく ${label} ファイルです。画像変換アプリをご利用ください`);
  }

  try {
    await probePlayableVideo(entry.file);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `${error.message}（拡張子と中身が一致しない可能性があります）`
        : "動画として読み込めません",
    );
  }

  entry.status = "converting";
  entry.error = undefined;
  entry.resultBlob = undefined;
  entry.resultName = undefined;
  entry.progress = { message: "準備中…", ratio: 0 };
  renderFileList();

  const blob = await convertVideoFile(entry.file, options, {
    onProgress: (detail) => {
      entry.progress = {
        message: detail.message ?? "変換中…",
        ratio: detail.ratio ?? 0,
        part: detail.part,
        totalParts: detail.totalParts,
      };
      renderFileList();
    },
  });

  entry.status = "done";
  entry.resultName = buildOutputFilename(entry.file.name, options.format);
  entry.resultBlob = blob;
  entry.progress = undefined;
}

/** 1件再変換 */
async function reconvertEntry(id) {
  const entry = entries.get(id);
  if (!entry || isBatchConverting) return;

  isBatchConverting = true;
  convertBtn.disabled = true;
  setStatus(`「${entry.file.name}」を変換中…`);

  try {
    await runConvertEntry(entry, getConvertOptions());
    setStatus(`「${entry.file.name}」の変換が完了しました`, "success");
  } catch (error) {
    entry.status = "error";
    entry.error = error instanceof Error ? error.message : "変換に失敗しました";
    entry.progress = undefined;
    setStatus(entry.error, "error");
  } finally {
    isBatchConverting = false;
    renderFileList();
  }
}

/** 全件変換（直列） */
async function convertAll() {
  const options = getConvertOptions();
  const targets = [...entries.values()].filter(
    (entry) => entry.status === "pending" || entry.status === "done",
  );
  if (targets.length === 0) return;

  isBatchConverting = true;
  convertBtn.disabled = true;
  clearBtn.disabled = true;
  if (cloudLoadBtn) cloudLoadBtn.disabled = true;
  setStatus("変換中…");

  let doneCount = 0;
  let errorCount = 0;

  for (const entry of targets) {
    try {
      await runConvertEntry(entry, options);
      doneCount += 1;
      setStatus(`変換中… ${doneCount + errorCount}/${targets.length}`);
    } catch (error) {
      entry.status = "error";
      entry.error = error instanceof Error ? error.message : "変換に失敗しました";
      entry.progress = undefined;
      errorCount += 1;
    }
    renderFileList();
  }

  isBatchConverting = false;
  renderFileList();

  if (errorCount === 0) {
    setStatus(`${doneCount} 件の変換が完了しました`, "success");
  } else {
    setStatus(`${doneCount} 件成功、${errorCount} 件失敗`, "warn");
  }
}

/** 変換済みをまとめてダウンロード */
function downloadAllResults() {
  const done = [...entries.values()].filter((entry) => entry.status === "done" && entry.resultBlob);
  for (const entry of done) {
    downloadBlob(entry.resultBlob, entry.resultName);
  }
  if (done.length > 0) {
    setStatus(`${done.length} 件をダウンロードしました`, "success");
  }
}

/** クラウド保存（完了分を個別に保存ダイアログ） */
async function openCloudSave() {
  const done = [...entries.values()].filter((entry) => entry.status === "done" && entry.resultBlob);
  if (done.length === 0 || !cloudSaveModal) return;

  if (done.length === 1) {
    const entry = done[0];
    cloudSaveModal.open({
      blob: entry.resultBlob,
      filename: entry.resultName,
    });
    return;
  }

  const entry = done[0];
  cloudSaveModal.open({
    blob: entry.resultBlob,
    filename: entry.resultName,
  });
  setStatus("1件ずつクラウドに保存してください（複数ファイル時）", "warn");
}

/** クラウド読み込み */
function openCloudLoad() {
  if (!cloudOpenModal) return;
  cloudOpenModal.open({
    onFilesLoaded: (files) => {
      addFiles(files).catch((error) => {
        setStatus(error instanceof Error ? error.message : "読み込みに失敗しました", "error");
      });
    },
  });
}

/** URL から読み込み */
async function openFromStoragePath(storagePath) {
  setStatus("クラウドから読み込み中…");
  const blob = await fetchDownloadBlob(storagePath);
  const name = storagePath.split("/").pop() || "video.mp4";
  addFiles([new File([blob], name, { type: blob.type || "video/mp4" })]);
  setStatus("クラウドからファイルを読み込みました", "success");
}

/** 全クリア */
function clearAll() {
  entries.clear();
  fileInput.value = "";
  renderFileList();
  setStatus("動画ファイルを追加してください");
}

function isFileDrag(event) {
  const types = Array.from(event.dataTransfer?.types ?? []).map((type) => type.toLowerCase());
  return types.includes("files") || types.includes("application/x-moz-file");
}

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

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

for (const eventName of ["dragenter", "dragover", "drop"]) {
  document.addEventListener(eventName, (event) => {
    event.preventDefault();
  });
}

dropZone?.addEventListener("dragenter", (event) => {
  if (!isFileDrag(event)) return;
  preventDefaults(event);
  dropZone.classList.add("vcv-drop-zone--active");
});

dropZone?.addEventListener("dragover", (event) => {
  if (!isFileDrag(event)) return;
  preventDefaults(event);
  event.dataTransfer.dropEffect = "copy";
  dropZone.classList.add("vcv-drop-zone--active");
});

dropZone?.addEventListener("dragleave", (event) => {
  if (!isFileDrag(event)) return;
  preventDefaults(event);
  const related = event.relatedTarget;
  if (related instanceof Node && dropZone.contains(related)) return;
  dropZone.classList.remove("vcv-drop-zone--active");
});

dropZone?.addEventListener("drop", (event) => {
  if (!isFileDrag(event)) return;
  preventDefaults(event);
  dropZone.classList.remove("vcv-drop-zone--active");
  addFiles(filesFromDataTransfer(event.dataTransfer)).catch((error) => {
    setStatus(error instanceof Error ? error.message : "ファイルの追加に失敗しました", "error");
  });
});

dropZone?.addEventListener("click", () => fileInput?.click());

dropZone?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput?.click();
  }
});

fileInput?.addEventListener("change", () => {
  addFiles(fileInput.files ?? []).catch((error) => {
    setStatus(error instanceof Error ? error.message : "ファイルの追加に失敗しました", "error");
  });
  fileInput.value = "";
});

formatSelect?.addEventListener("change", () => {
  selectedFormat = /** @type {'mp4' | 'webm'} */ (formatSelect.value);
});

qualityInput?.addEventListener("input", () => {
  if (qualityValue) qualityValue.textContent = qualityInput.value;
});

convertBtn?.addEventListener("click", () => {
  convertAll().catch((error) => {
    setStatus(error instanceof Error ? error.message : "変換に失敗しました", "error");
  });
});

clearBtn?.addEventListener("click", clearAll);
downloadAllBtn?.addEventListener("click", downloadAllResults);
cloudLoadBtn?.addEventListener("click", openCloudLoad);
cloudSaveBtn?.addEventListener("click", () => openCloudSave());

const allowed = await checkAccess();
if (allowed) {
  initFormatSelect();
  if (qualityValue && qualityInput) qualityValue.textContent = qualityInput.value;
  renderFileList();
  setStatus("動画ファイルを追加してください");

  const storagePath = new URLSearchParams(location.search).get("storagePath")?.trim();
  if (storagePath) {
    openFromStoragePath(storagePath).catch((error) => {
      setStatus(error instanceof Error ? error.message : "クラウドからの読み込みに失敗しました", "error");
    });
  }
}
