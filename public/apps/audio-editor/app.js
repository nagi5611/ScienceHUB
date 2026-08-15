/**
 * 音声編集アプリ — mp3cut.net 相当（ブラウザ内 ffmpeg.wasm）
 */

import { clamp, formatBytes, formatTimePrecise, formatTimeShort, parseTimeInput } from "../video-editor/js/time.js";
import { buildDownloadName, exportAudio, needsReencode } from "./js/export-audio.js";
import { drawWaveform, generateWaveformPeaks } from "./js/waveform.js";
import { createCloudSaveModal } from "../../js/cloud-save-modal.js";
import { createCloudOpenModal } from "../../js/cloud-open-modal.js";
import { fetchDownloadBlob } from "../cloud-storage/js/api.js";

const APP_SLUG = "audio-editor";
const MAX_FILE_BYTES = 500 * 1024 * 1024;
const RINGTONE_MAX_SECONDS = 40;
const NUDGE_SECONDS = 0.1;

const AUDIO_EXT = /\.(mp3|wav|flac|ogg|aac|m4a|wma|opus|m4r)$/i;
const VIDEO_EXT = /\.(mp4|webm|avi|mov|mkv|wmv|mpeg|mpg|3gp|m4v)$/i;

const landingView = document.getElementById("landing-view");
const editorView = document.getElementById("editor-view");
const fileInput = document.getElementById("file-input");
const dropZone = document.getElementById("drop-zone");
const previewAudio = /** @type {HTMLAudioElement} */ (document.getElementById("preview-audio"));
const previewVideo = /** @type {HTMLVideoElement} */ (document.getElementById("preview-video"));
const waveCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("wave-canvas"));
const waveStage = document.getElementById("wave-stage");
const wavePlaceholder = document.getElementById("wave-placeholder");
const waveShadeLeft = document.getElementById("wave-shade-left");
const waveShadeRight = document.getElementById("wave-shade-right");
const waveSelection = document.getElementById("wave-selection");
const wavePlayhead = document.getElementById("wave-playhead");
const fileNameEl = document.getElementById("file-name");
const fileMetaEl = document.getElementById("file-meta");
const playBtn = document.getElementById("play-btn");
const exportBtn = document.getElementById("export-btn");
const cloudSaveBtn = document.getElementById("cloud-save-btn");
const exportOverlay = document.getElementById("export-overlay");
const exportOverlayText = document.getElementById("export-overlay-text");
const exportProgressBar = document.getElementById("export-progress-bar");
const startTimeInput = /** @type {HTMLInputElement} */ (document.getElementById("start-time"));
const endTimeInput = /** @type {HTMLInputElement} */ (document.getElementById("end-time"));
const trimDurationEl = document.getElementById("trim-duration");
const handleStart = document.getElementById("handle-start");
const handleEnd = document.getElementById("handle-end");
const timelineCurrentLabel = document.getElementById("timeline-current-label");
const timelineEndLabel = document.getElementById("timeline-end-label");
const formatSelect = /** @type {HTMLSelectElement} */ (document.getElementById("format-select"));
const noReencodeInput = /** @type {HTMLInputElement} */ (document.getElementById("no-reencode"));
const noReencodeHint = document.getElementById("no-reencode-hint");
const ringtoneHint = document.getElementById("ringtone-hint");
const bitrateField = document.getElementById("bitrate-field");
const bitrateInput = /** @type {HTMLInputElement} */ (document.getElementById("bitrate"));
const bitrateValue = document.getElementById("bitrate-value");
const volumeInput = /** @type {HTMLInputElement} */ (document.getElementById("volume"));
const volumeValue = document.getElementById("volume-value");
const speedInput = /** @type {HTMLInputElement} */ (document.getElementById("speed"));
const speedValue = document.getElementById("speed-value");
const pitchInput = /** @type {HTMLInputElement} */ (document.getElementById("pitch"));
const pitchValue = document.getElementById("pitch-value");
const fadeInInput = /** @type {HTMLInputElement} */ (document.getElementById("fade-in"));
const fadeOutInput = /** @type {HTMLInputElement} */ (document.getElementById("fade-out"));
const fadeInValue = document.getElementById("fade-in-value");
const fadeOutValue = document.getElementById("fade-out-value");
const loopSelectionInput = /** @type {HTMLInputElement | null} */ (document.getElementById("loop-selection"));
const normalizeInput = /** @type {HTMLInputElement | null} */ (document.getElementById("normalize"));
const reverseInput = /** @type {HTMLInputElement | null} */ (document.getElementById("reverse"));
const trimSilenceInput = /** @type {HTMLInputElement | null} */ (document.getElementById("trim-silence"));
const metadataTitleInput = /** @type {HTMLInputElement | null} */ (document.getElementById("metadata-title"));
const exportSummaryEl = document.getElementById("export-summary");
const shortcutsDialog = /** @type {HTMLDialogElement | null} */ (document.getElementById("shortcuts-dialog"));

/** @type {{
 *   file: File | null,
 *   objectUrl: string | null,
 *   duration: number,
 *   peaks: number[],
 *   startTime: number,
 *   endTime: number,
 *   viewStart: number,
 *   viewEnd: number,
 *   volume: number,
 *   speed: number,
 *   pitch: number,
 *   fadeIn: number,
 *   fadeOut: number,
 *   outputFormat: string,
 *   bitrateKbps: number,
 *   noReencode: boolean,
 *   loopSelection: boolean,
 *   normalize: boolean,
 *   reverse: boolean,
 *   trimSilence: boolean,
 *   metadataTitle: string,
 *   isVideoSource: boolean,
 *   lastExportBlob: Blob | null,
 *   lastExportName: string,
 *   exporting: boolean,
 * }} */
const state = {
  file: null,
  objectUrl: null,
  duration: 0,
  peaks: [],
  startTime: 0,
  endTime: 0,
  viewStart: 0,
  viewEnd: 1,
  volume: 100,
  speed: 100,
  pitch: 0,
  fadeIn: 0,
  fadeOut: 0,
  outputFormat: "mp3",
  bitrateKbps: 192,
  noReencode: true,
  loopSelection: false,
  normalize: false,
  reverse: false,
  trimSilence: false,
  metadataTitle: "",
  isVideoSource: false,
  lastExportBlob: null,
  lastExportName: "",
  exporting: false,
};

/** @type {ReturnType<typeof createCloudSaveModal> | null} */
let cloudSaveModal = null;
/** @type {ReturnType<typeof createCloudOpenModal> | null} */
let cloudOpenModal = null;

/** 再生中メディア要素 */
function getMedia() {
  return state.isVideoSource ? previewVideo : previewAudio;
}

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href = `/login/?next=${encodeURIComponent("/apps/audio-editor/")}`;
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  landingView.hidden = false;
  return true;
}

function showLanding() {
  landingView.hidden = false;
  editorView.hidden = true;
}

function showEditor() {
  landingView.hidden = true;
  editorView.hidden = false;
}

function getExportSettings() {
  return {
    start: state.startTime,
    end: state.endTime,
    volume: state.volume,
    speed: state.speed,
    pitch: state.pitch,
    fadeIn: state.fadeIn,
    fadeOut: state.fadeOut,
    format: state.outputFormat,
    bitrateKbps: state.bitrateKbps,
    noReencode: state.noReencode,
    extractAudioFromVideo: state.isVideoSource,
    normalize: state.normalize,
    reverse: state.reverse,
    trimSilence: state.trimSilence,
    metadataTitle: state.metadataTitle,
  };
}

/** 表示中の波形範囲（0〜1） */
function getViewSpan() {
  return Math.max(0.02, state.viewEnd - state.viewStart);
}

/** 全体比率を表示座標（%）へ */
function ratioToVisiblePct(ratio) {
  return ((ratio - state.viewStart) / getViewSpan()) * 100;
}

function resetWaveZoom() {
  state.viewStart = 0;
  state.viewEnd = 1;
}

/** 指定比率を中心にズーム */
function zoomWaveAt(focusRatio, factor) {
  const span = getViewSpan();
  const newSpan = clamp(span * factor, 0.02, 1);
  const focus = state.viewStart + focusRatio * span;
  state.viewStart = clamp(focus - newSpan * focusRatio, 0, 1 - newSpan);
  state.viewEnd = state.viewStart + newSpan;
  updateEditorUi();
}

/** 選択区間に波形を合わせる */
function zoomToSelection() {
  if (state.duration <= 0) return;
  const pad = Math.min(0.05, (state.endTime - state.startTime) / state.duration * 0.15);
  state.viewStart = clamp(state.startTime / state.duration - pad, 0, 1);
  state.viewEnd = clamp(state.endTime / state.duration + pad, 0, 1);
  if (state.viewEnd - state.viewStart < 0.02) {
    state.viewEnd = Math.min(1, state.viewStart + 0.02);
  }
  updateEditorUi();
}

function applyRingtoneLimit() {
  if (state.outputFormat !== "m4r" || state.duration <= 0) return;
  const maxEnd = Math.min(state.duration, state.startTime + RINGTONE_MAX_SECONDS);
  if (state.endTime > maxEnd) state.endTime = maxEnd;
}

function canStreamCopy() {
  if (!state.file || state.isVideoSource) return false;
  const ext = (state.file.name.match(/\.([^.]+)$/)?.[1] || "").toLowerCase();
  if (state.outputFormat === "m4r") return ext === "m4r";
  if (state.outputFormat === "m4a") return ext === "m4a" || ext === "m4r";
  if (state.outputFormat === "flac") return ext === "flac";
  return ext === state.outputFormat;
}

function formatLabel(format) {
  if (format === "m4r") return "M4R（着信音）";
  return format.toUpperCase();
}

function updateExportSummary() {
  if (!exportSummaryEl || !state.file || state.duration <= 0) {
    if (exportSummaryEl) exportSummaryEl.textContent = "—";
    return;
  }
  const settings = getExportSettings();
  const reencode = needsReencode(settings) || !canStreamCopy() || state.outputFormat === "wav";
  const effects = [
    state.normalize ? "正規化" : null,
    state.reverse ? "逆再生" : null,
    state.trimSilence ? "無音削除" : null,
    state.fadeIn > 0 ? `FI ${state.fadeIn}s` : null,
    state.fadeOut > 0 ? `FO ${state.fadeOut}s` : null,
    state.volume !== 100 ? `音量 ${state.volume}%` : null,
    state.speed !== 100 ? `速度 ${state.speed}%` : null,
    state.pitch !== 0 ? `ピッチ ${state.pitch > 0 ? "+" : ""}${state.pitch}` : null,
  ].filter(Boolean);

  const parts = [
    `${formatTimePrecise(state.startTime)} 〜 ${formatTimePrecise(state.endTime)}（${formatTimePrecise(state.endTime - state.startTime)}）`,
    formatLabel(state.outputFormat),
    state.outputFormat !== "wav" && state.outputFormat !== "flac" ? `${state.bitrateKbps} kbps` : null,
    reencode ? "再エンコード" : "再エンコードなし",
    effects.length ? effects.join(" · ") : null,
  ].filter(Boolean);

  exportSummaryEl.textContent = parts.join(" · ");
}

function refreshOutputUi() {
  const settings = getExportSettings();
  const reencodeRequired =
    needsReencode(settings) || !canStreamCopy() || state.outputFormat === "wav" || state.outputFormat === "flac";

  if (noReencodeInput) {
    noReencodeInput.disabled = reencodeRequired;
    if (reencodeRequired) noReencodeInput.checked = false;
  }
  if (noReencodeHint) {
    noReencodeHint.textContent = reencodeRequired
      ? "音量・速度・ピッチ・フェード・正規化・無音削除・形式変換・動画ソース時は再エンコードが必要です。"
      : "トリムのみの場合は再エンコードなしで高速に書き出せます。";
  }
  if (bitrateField) bitrateField.hidden = state.outputFormat === "wav" || state.outputFormat === "flac";
  if (ringtoneHint) ringtoneHint.hidden = state.outputFormat !== "m4r";
  state.noReencode = noReencodeInput?.checked ?? false;
  updateExportSummary();
}

function syncTrimState() {
  if (state.duration <= 0) return;
  applyRingtoneLimit();
  state.startTime = clamp(state.startTime, 0, state.duration);
  state.endTime = clamp(state.endTime, state.startTime + 0.1, state.duration);
  startTimeInput.value = formatTimePrecise(state.startTime);
  endTimeInput.value = formatTimePrecise(state.endTime);
  trimDurationEl.textContent = formatTimePrecise(state.endTime - state.startTime);
  updateEditorUi();
  refreshOutputUi();
}

function updateEditorUi() {
  if (state.duration <= 0) return;
  const media = getMedia();
  const startRatio = state.startTime / state.duration;
  const endRatio = state.endTime / state.duration;
  const currentRatio = media.currentTime / state.duration;

  const startPct = ratioToVisiblePct(startRatio);
  const endPct = ratioToVisiblePct(endRatio);
  const currentPct = ratioToVisiblePct(currentRatio);

  if (waveShadeLeft) {
    waveShadeLeft.style.width = `${clamp(startPct, 0, 100)}%`;
  }
  if (waveShadeRight) {
    const rightWidth = clamp(100 - endPct, 0, 100);
    waveShadeRight.style.width = `${rightWidth}%`;
    waveShadeRight.style.left = `${clamp(endPct, 0, 100)}%`;
  }
  if (waveSelection) {
    waveSelection.style.left = `${clamp(startPct, 0, 100)}%`;
    waveSelection.style.width = `${Math.max(0, clamp(endPct, 0, 100) - clamp(startPct, 0, 100))}%`;
  }
  if (wavePlayhead) {
    wavePlayhead.style.left = `${clamp(currentPct, 0, 100)}%`;
    wavePlayhead.hidden = currentPct < 0 || currentPct > 100;
  }
  if (handleStart) handleStart.style.left = `${clamp(startPct, 0, 100)}%`;
  if (handleEnd) handleEnd.style.left = `${clamp(endPct, 0, 100)}%`;

  timelineEndLabel.textContent = formatTimeShort(state.endTime);
  timelineCurrentLabel.textContent = formatTimeShort(media.currentTime);

  drawWaveform(waveCanvas, state.peaks, {
    startRatio,
    endRatio,
    playheadRatio: currentRatio,
    viewStart: state.viewStart,
    viewEnd: state.viewEnd,
  });
}

function updateFileMeta() {
  if (!state.file) {
    fileNameEl.textContent = "—";
    fileMetaEl.textContent = "—";
    return;
  }
  fileNameEl.textContent = state.file.name;
  fileMetaEl.textContent = [
    formatBytes(state.file.size),
    state.duration > 0 ? formatTimeShort(state.duration) : null,
    state.isVideoSource ? "動画（音声抽出）" : "音声",
  ]
    .filter(Boolean)
    .join(" · ");
}

function isSupportedFile(file) {
  return (
    file.type.startsWith("audio/") ||
    file.type.startsWith("video/") ||
    AUDIO_EXT.test(file.name) ||
    VIDEO_EXT.test(file.name)
  );
}

function clearMediaElements() {
  previewAudio.pause();
  previewVideo.pause();
  previewAudio.removeAttribute("src");
  previewVideo.removeAttribute("src");
  previewAudio.load();
  previewVideo.load();
  previewVideo.hidden = true;
}

function waitForMediaMetadata(media) {
  return new Promise((resolve, reject) => {
    if (Number.isFinite(media.duration) && media.duration > 0) {
      resolve(undefined);
      return;
    }
    media.onloadedmetadata = () => resolve(undefined);
    media.onerror = () => reject(new Error("メディアを読み込めませんでした"));
  });
}

/** ファイル読み込み */
async function loadMediaFile(file) {
  if (!file || !isSupportedFile(file)) {
    alert("音声または動画ファイルを選択してください。");
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    alert("500 MB を超えるファイルはサポートされていません。");
    return;
  }

  resetEditor(false);
  state.file = file;
  state.isVideoSource = file.type.startsWith("video/") || VIDEO_EXT.test(file.name);
  state.objectUrl = URL.createObjectURL(file);

  showEditor();
  wavePlaceholder.hidden = false;
  wavePlaceholder.textContent = "波形を読み込み中…";
  playBtn.disabled = true;
  exportBtn.disabled = true;

  const media = getMedia();
  if (state.isVideoSource) {
    previewVideo.hidden = false;
    previewVideo.src = state.objectUrl;
  } else {
    previewVideo.hidden = true;
    previewAudio.src = state.objectUrl;
  }

  try {
    const [waveform] = await Promise.all([
      generateWaveformPeaks(file),
      waitForMediaMetadata(media),
    ]);

    state.peaks = waveform.peaks;
    state.duration =
      Number.isFinite(media.duration) && media.duration > 0 ? media.duration : waveform.duration;

    if (state.duration <= 0) {
      throw new Error("ファイルの長さを取得できませんでした");
    }

    state.startTime = 0;
    state.endTime = state.duration;
    resetWaveZoom();
    media.currentTime = 0;
    media.volume = Math.min(1, state.volume / 100);
    media.playbackRate = state.speed / 100;

    wavePlaceholder.hidden = true;
    playBtn.disabled = false;
    exportBtn.disabled = false;
    cloudSaveBtn.disabled = true;

    syncTrimState();
    updateFileMeta();
    refreshOutputUi();
  } catch (error) {
    alert(error instanceof Error ? error.message : "ファイルを読み込めませんでした");
    resetEditor(true);
  }
}

function resetEditor(clearFile = true) {
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  clearMediaElements();

  state.file = null;
  state.objectUrl = null;
  state.duration = 0;
  state.peaks = [];
  state.startTime = 0;
  state.endTime = 0;
  state.viewStart = 0;
  state.viewEnd = 1;
  state.volume = 100;
  state.speed = 100;
  state.pitch = 0;
  state.fadeIn = 0;
  state.fadeOut = 0;
  state.loopSelection = false;
  state.normalize = false;
  state.reverse = false;
  state.trimSilence = false;
  state.metadataTitle = "";
  state.isVideoSource = false;
  state.lastExportBlob = null;

  volumeInput.value = "100";
  volumeValue.textContent = "100";
  speedInput.value = "100";
  speedValue.textContent = "100";
  pitchInput.value = "0";
  pitchValue.textContent = "0";
  fadeInInput.value = "0";
  fadeOutInput.value = "0";
  if (fadeInValue) fadeInValue.textContent = "0";
  if (fadeOutValue) fadeOutValue.textContent = "0";
  if (loopSelectionInput) loopSelectionInput.checked = false;
  if (normalizeInput) normalizeInput.checked = false;
  if (reverseInput) reverseInput.checked = false;
  if (trimSilenceInput) trimSilenceInput.checked = false;
  if (metadataTitleInput) metadataTitleInput.value = "";
  noReencodeInput.checked = true;
  playBtn?.classList.remove("ae-play-btn--playing");

  playBtn.disabled = true;
  exportBtn.disabled = true;
  cloudSaveBtn.disabled = true;
  wavePlaceholder.hidden = false;
  wavePlaceholder.textContent = "ファイルを選択してください";

  if (clearFile) {
    fileInput.value = "";
    showLanding();
  }
}

function setPlayUi(playing) {
  playBtn?.classList.toggle("ae-play-btn--playing", playing);
  const icon = playBtn?.querySelector(".ae-play-icon");
  if (icon) icon.textContent = playing ? "❚❚" : "▶";
}

function togglePlay() {
  const media = getMedia();
  if (!state.file) return;
  if (media.paused) {
    if (media.currentTime >= state.endTime - 0.05) {
      media.currentTime = state.startTime;
    }
    media.play().catch(() => {});
  } else {
    media.pause();
  }
}

async function handleExport() {
  if (!state.file || state.exporting) return;

  applyRingtoneLimit();
  syncTrimState();

  state.exporting = true;
  exportBtn.disabled = true;
  exportOverlay.hidden = false;
  exportOverlayText.textContent = "ffmpeg を読み込み中…";
  exportProgressBar.style.width = "0%";

  try {
    const settings = getExportSettings();
    const blob = await exportAudio(state.file, settings, {
      onProgress: (ratio, message) => {
        exportProgressBar.style.width = `${Math.round(ratio * 100)}%`;
        if (message) exportOverlayText.textContent = message;
      },
    });

    state.lastExportBlob = blob;
    state.lastExportName = buildDownloadName(state.file.name, settings.format);
    cloudSaveBtn.disabled = false;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = state.lastExportName;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    alert(error instanceof Error ? error.message : "書き出しに失敗しました");
  } finally {
    state.exporting = false;
    exportOverlay.hidden = true;
    exportBtn.disabled = !state.file;
  }
}

function openCloudSave() {
  if (!cloudSaveModal || !state.lastExportBlob) return;
  cloudSaveModal.open({ blob: state.lastExportBlob, filename: state.lastExportName });
}

function openCloudLoad() {
  if (!cloudOpenModal) return;
  cloudOpenModal.open({
    onFilesLoaded: (files) => {
      const media = files.find((f) => isSupportedFile(f));
      if (media) loadMediaFile(media);
      else alert("音声または動画ファイルを選択してください。");
    },
  });
}

async function openFromStoragePath(storagePath) {
  const blob = await fetchDownloadBlob(storagePath);
  const name = storagePath.split("/").pop() || "audio.mp3";
  await loadMediaFile(new File([blob], name, { type: blob.type || "audio/mpeg" }));
}

function timeFromPointerEvent(event) {
  if (!waveStage || state.duration <= 0) return 0;
  const rect = waveStage.getBoundingClientRect();
  const localRatio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
  const globalRatio = state.viewStart + localRatio * getViewSpan();
  return globalRatio * state.duration;
}

/** 用途プリセットを適用 */
function applyPreset(preset) {
  state.normalize = false;
  state.reverse = false;
  state.trimSilence = false;
  state.pitch = 0;
  state.speed = 100;
  state.volume = 100;

  if (preset === "ringtone") {
    state.fadeIn = 0.5;
    state.fadeOut = 0.5;
    state.outputFormat = "m4r";
    state.bitrateKbps = 192;
  } else if (preset === "podcast") {
    state.fadeIn = 0.3;
    state.fadeOut = 0.3;
    state.outputFormat = "mp3";
    state.bitrateKbps = 128;
    state.normalize = true;
    state.trimSilence = true;
  } else if (preset === "voice") {
    state.fadeIn = 0.1;
    state.fadeOut = 0.1;
    state.outputFormat = "mp3";
    state.bitrateKbps = 96;
    state.normalize = true;
    state.trimSilence = true;
  } else if (preset === "hifi") {
    state.fadeIn = 0;
    state.fadeOut = 0;
    state.outputFormat = "flac";
    state.bitrateKbps = 192;
  }

  fadeInInput.value = String(state.fadeIn);
  fadeOutInput.value = String(state.fadeOut);
  if (fadeInValue) fadeInValue.textContent = String(state.fadeIn);
  if (fadeOutValue) fadeOutValue.textContent = String(state.fadeOut);
  formatSelect.value = state.outputFormat;
  bitrateInput.value = String(state.bitrateKbps);
  bitrateValue.textContent = String(state.bitrateKbps);
  pitchInput.value = "0";
  pitchValue.textContent = "0";
  speedInput.value = "100";
  speedValue.textContent = "100";
  volumeInput.value = "100";
  volumeValue.textContent = "100";
  if (normalizeInput) normalizeInput.checked = state.normalize;
  if (reverseInput) reverseInput.checked = state.reverse;
  if (trimSilenceInput) trimSilenceInput.checked = state.trimSilence;

  const media = getMedia();
  media.volume = 1;
  media.playbackRate = 1;

  if (preset === "ringtone") applyRingtoneLimit();
  syncTrimState();
  refreshOutputUi();
}

/** 波形上のドラッグ操作 */
function initWaveformDrag() {
  /** @type {"start" | "end" | "seek" | null} */
  let dragMode = null;

  function onMove(event) {
    if (!dragMode) return;
    const t = timeFromPointerEvent(event);
    if (dragMode === "start") {
      state.startTime = clamp(t, 0, state.endTime - 0.1);
    } else if (dragMode === "end") {
      state.endTime = clamp(t, state.startTime + 0.1, state.duration);
    } else if (dragMode === "seek") {
      getMedia().currentTime = clamp(t, state.startTime, state.endTime);
    }
    syncTrimState();
  }

  function onUp() {
    dragMode = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }

  handleStart?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragMode = "start";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });

  handleEnd?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragMode = "end";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });

  waveStage?.addEventListener("pointerdown", (event) => {
    if (event.target === handleStart || event.target === handleEnd) return;
    dragMode = "seek";
    onMove(event);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
}

function isFileDrag(event) {
  const types = Array.from(event.dataTransfer?.types ?? []).map((t) => t.toLowerCase());
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
    if (files.length) return files;
  }
  return [...(dataTransfer.files ?? [])];
}

function bindDropZone(el) {
  if (!el) return;
  el.addEventListener("dragenter", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    el.classList.add("ae-drop-zone--active");
  });
  el.addEventListener("dragover", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    el.classList.add("ae-drop-zone--active");
  });
  el.addEventListener("dragleave", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    const related = event.relatedTarget;
    if (related instanceof Node && el.contains(related)) return;
    el.classList.remove("ae-drop-zone--active");
  });
  el.addEventListener("drop", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    el.classList.remove("ae-drop-zone--active");
    const file = filesFromDataTransfer(event.dataTransfer)[0];
    if (file) loadMediaFile(file);
  });
  el.addEventListener("click", () => fileInput?.click());
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput?.click();
    }
  });
}

function bindMediaEvents(media) {
  media.addEventListener("timeupdate", () => {
    if (media.currentTime >= state.endTime && !media.paused) {
      if (state.loopSelection) {
        media.currentTime = state.startTime;
      } else {
        media.pause();
        media.currentTime = state.endTime;
      }
    }
    updateEditorUi();
  });
  media.addEventListener("play", () => setPlayUi(true));
  media.addEventListener("pause", () => setPlayUi(false));
}

function openShortcutsDialog() {
  shortcutsDialog?.showModal();
}

function closeShortcutsDialog() {
  shortcutsDialog?.close();
}

function bindEvents() {
  bindDropZone(dropZone);

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) loadMediaFile(file);
    fileInput.value = "";
  });

  playBtn?.addEventListener("click", togglePlay);

  document.getElementById("nudge-start-minus")?.addEventListener("click", () => {
    state.startTime = clamp(state.startTime - NUDGE_SECONDS, 0, state.endTime - 0.1);
    syncTrimState();
  });
  document.getElementById("nudge-start-plus")?.addEventListener("click", () => {
    state.startTime = clamp(state.startTime + NUDGE_SECONDS, 0, state.endTime - 0.1);
    syncTrimState();
  });
  document.getElementById("nudge-end-minus")?.addEventListener("click", () => {
    state.endTime = clamp(state.endTime - NUDGE_SECONDS, state.startTime + 0.1, state.duration);
    syncTrimState();
  });
  document.getElementById("nudge-end-plus")?.addEventListener("click", () => {
    state.endTime = clamp(state.endTime + NUDGE_SECONDS, state.startTime + 0.1, state.duration);
    syncTrimState();
  });

  startTimeInput?.addEventListener("change", () => {
    const parsed = parseTimeInput(startTimeInput.value);
    if (parsed !== null) state.startTime = parsed;
    syncTrimState();
  });
  endTimeInput?.addEventListener("change", () => {
    const parsed = parseTimeInput(endTimeInput.value);
    if (parsed !== null) state.endTime = parsed;
    syncTrimState();
  });

  bindMediaEvents(previewAudio);
  bindMediaEvents(previewVideo);

  volumeInput?.addEventListener("input", () => {
    state.volume = Number(volumeInput.value);
    volumeValue.textContent = volumeInput.value;
    getMedia().volume = Math.min(1, state.volume / 100);
    refreshOutputUi();
  });
  speedInput?.addEventListener("input", () => {
    state.speed = Number(speedInput.value);
    speedValue.textContent = speedInput.value;
    getMedia().playbackRate = state.speed / 100;
    refreshOutputUi();
  });
  pitchInput?.addEventListener("input", () => {
    state.pitch = Number(pitchInput.value);
    pitchValue.textContent = pitchInput.value;
    refreshOutputUi();
  });
  fadeInInput?.addEventListener("input", () => {
    state.fadeIn = Number(fadeInInput.value) || 0;
    if (fadeInValue) fadeInValue.textContent = fadeInInput.value;
    refreshOutputUi();
  });
  fadeOutInput?.addEventListener("input", () => {
    state.fadeOut = Number(fadeOutInput.value) || 0;
    if (fadeOutValue) fadeOutValue.textContent = fadeOutInput.value;
    refreshOutputUi();
  });

  formatSelect?.addEventListener("change", () => {
    state.outputFormat = formatSelect.value;
    applyRingtoneLimit();
    syncTrimState();
    refreshOutputUi();
  });
  bitrateInput?.addEventListener("input", () => {
    state.bitrateKbps = Number(bitrateInput.value);
    bitrateValue.textContent = bitrateInput.value;
  });
  noReencodeInput?.addEventListener("change", () => {
    state.noReencode = noReencodeInput.checked;
    refreshOutputUi();
  });

  exportBtn?.addEventListener("click", () => {
    handleExport().catch((err) => alert(err instanceof Error ? err.message : "書き出し失敗"));
  });
  document.getElementById("new-file-btn")?.addEventListener("click", () => resetEditor(true));
  document.getElementById("reset-edits-btn")?.addEventListener("click", () => {
    if (!state.file || state.duration <= 0) return;
    state.volume = 100;
    state.speed = 100;
    state.pitch = 0;
    state.fadeIn = 0;
    state.fadeOut = 0;
    state.normalize = false;
    state.reverse = false;
    state.trimSilence = false;
    state.loopSelection = false;
    state.startTime = 0;
    state.endTime = state.duration;
    resetWaveZoom();
    volumeInput.value = "100";
    volumeValue.textContent = "100";
    speedInput.value = "100";
    speedValue.textContent = "100";
    pitchInput.value = "0";
    pitchValue.textContent = "0";
    fadeInInput.value = "0";
    fadeOutInput.value = "0";
    if (fadeInValue) fadeInValue.textContent = "0";
    if (fadeOutValue) fadeOutValue.textContent = "0";
    if (loopSelectionInput) loopSelectionInput.checked = false;
    if (normalizeInput) normalizeInput.checked = false;
    if (reverseInput) reverseInput.checked = false;
    if (trimSilenceInput) trimSilenceInput.checked = false;
    const media = getMedia();
    media.volume = 1;
    media.playbackRate = 1;
    syncTrimState();
    refreshOutputUi();
  });

  loopSelectionInput?.addEventListener("change", () => {
    state.loopSelection = loopSelectionInput.checked;
  });
  normalizeInput?.addEventListener("change", () => {
    state.normalize = normalizeInput.checked;
    refreshOutputUi();
  });
  reverseInput?.addEventListener("change", () => {
    state.reverse = reverseInput.checked;
    refreshOutputUi();
  });
  trimSilenceInput?.addEventListener("change", () => {
    state.trimSilence = trimSilenceInput.checked;
    refreshOutputUi();
  });
  metadataTitleInput?.addEventListener("input", () => {
    state.metadataTitle = metadataTitleInput.value;
    updateExportSummary();
  });

  document.getElementById("preset-ringtone-btn")?.addEventListener("click", () => applyPreset("ringtone"));
  document.getElementById("preset-podcast-btn")?.addEventListener("click", () => applyPreset("podcast"));
  document.getElementById("preset-voice-btn")?.addEventListener("click", () => applyPreset("voice"));
  document.getElementById("preset-hifi-btn")?.addEventListener("click", () => applyPreset("hifi"));

  document.getElementById("zoom-in-btn")?.addEventListener("click", () => zoomWaveAt(0.5, 0.75));
  document.getElementById("zoom-out-btn")?.addEventListener("click", () => zoomWaveAt(0.5, 1.35));
  document.getElementById("zoom-fit-btn")?.addEventListener("click", () => {
    resetWaveZoom();
    updateEditorUi();
  });
  document.getElementById("zoom-selection-btn")?.addEventListener("click", zoomToSelection);

  waveStage?.addEventListener(
    "wheel",
    (event) => {
      if (!state.file || !event.ctrlKey) return;
      event.preventDefault();
      const rect = waveStage.getBoundingClientRect();
      const focusRatio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      zoomWaveAt(focusRatio, event.deltaY > 0 ? 1.2 : 0.833);
    },
    { passive: false }
  );

  document.getElementById("shortcuts-btn")?.addEventListener("click", openShortcutsDialog);
  document.getElementById("shortcuts-close-btn")?.addEventListener("click", closeShortcutsDialog);
  shortcutsDialog?.addEventListener("click", (event) => {
    if (event.target === shortcutsDialog) closeShortcutsDialog();
  });

  document.getElementById("cloud-load-btn")?.addEventListener("click", openCloudLoad);
  document.getElementById("cloud-load-btn-landing")?.addEventListener("click", openCloudLoad);
  cloudSaveBtn?.addEventListener("click", openCloudSave);

  window.addEventListener("resize", () => updateEditorUi());

  document.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    if (event.key === "?" && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      openShortcutsDialog();
      return;
    }
    if (shortcutsDialog?.open) return;
    if (!state.file) return;

    const media = getMedia();
    if (event.code === "Space") {
      event.preventDefault();
      togglePlay();
    } else if (event.key.toLowerCase() === "i" && event.shiftKey) {
      media.currentTime = state.startTime;
      updateEditorUi();
    } else if (event.key.toLowerCase() === "o" && event.shiftKey) {
      media.currentTime = state.endTime;
      updateEditorUi();
    } else if (event.key.toLowerCase() === "i") {
      state.startTime = clamp(media.currentTime, 0, state.endTime - 0.1);
      syncTrimState();
    } else if (event.key.toLowerCase() === "o") {
      state.endTime = clamp(media.currentTime, state.startTime + 0.1, state.duration);
      syncTrimState();
    } else if (event.key === "Home") {
      event.preventDefault();
      media.currentTime = state.startTime;
      updateEditorUi();
    } else if (event.key === "End") {
      event.preventDefault();
      media.currentTime = state.endTime;
      updateEditorUi();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (event.shiftKey) {
        state.endTime = clamp(state.endTime - NUDGE_SECONDS, state.startTime + 0.1, state.duration);
      } else {
        state.startTime = clamp(state.startTime - NUDGE_SECONDS, 0, state.endTime - 0.1);
      }
      syncTrimState();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      if (event.shiftKey) {
        state.endTime = clamp(state.endTime + NUDGE_SECONDS, state.startTime + 0.1, state.duration);
      } else {
        state.startTime = clamp(state.startTime + NUDGE_SECONDS, 0, state.endTime - 0.1);
      }
      syncTrimState();
    }
  });

  for (const eventName of ["dragenter", "dragover", "drop"]) {
    document.addEventListener(eventName, (event) => event.preventDefault());
  }
}

function initCloudModals() {
  const saveDialog = document.getElementById("ae-cloud-save-dialog");
  const openDialog = document.getElementById("ae-cloud-open-dialog");
  if (saveDialog instanceof HTMLDialogElement) {
    cloudSaveModal = createCloudSaveModal(saveDialog, {
      idPrefix: "ae-cloud-save",
      loginNext: "/apps/audio-editor/",
    });
  }
  if (openDialog instanceof HTMLDialogElement) {
    cloudOpenModal = createCloudOpenModal(openDialog, {
      idPrefix: "ae-cloud-open",
      loginNext: "/apps/audio-editor/",
    });
  }
}

initWaveformDrag();
bindEvents();
initCloudModals();
bitrateValue.textContent = bitrateInput.value;

const allowed =
  /** @type {Window & { __AE_E2E__?: boolean }} */ (window).__AE_E2E__ === true ||
  (await checkAccess());

if (allowed) {
  showLanding();
  const storagePath = new URLSearchParams(location.search).get("storagePath")?.trim();
  if (storagePath) {
    openFromStoragePath(storagePath).catch((error) => {
      alert(error instanceof Error ? error.message : "クラウドからの読み込みに失敗しました");
    });
  }
}
