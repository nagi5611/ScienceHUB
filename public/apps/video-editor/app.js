/**
 * 動画編集アプリ — online-video-cutter 相当（ブラウザ内 ffmpeg.wasm）
 */

import { clamp, formatBytes, formatTimePrecise, formatTimeShort, parseTimeInput } from "./js/time.js";
import { buildDownloadName, exportVideo, getExportTrimRange, needsReencode } from "./js/export-video.js";
import {
  createDefaultText,
  FONT_FAMILIES,
  FONT_SIZES,
  pointInContainer,
  removeText,
  syncTextOverlay,
  textToExportCoords,
} from "./js/text-tool.js";
import { createDualTimeline, getEffectiveRange, handleJklTransport } from "./js/timeline.js";
import { generateWaveformPeaks } from "./js/waveform.js";
import { initCropOverlay } from "./js/crop-tool.js";
import {
  createTimelineFromFile,
  createEmptyTimeline,
  syncSingleClipToTimeline,
  addMediaToBin,
  addAudioMedia,
  appendBgmClip,
  placeVideoClip,
  placeOnTop,
  hasVideoClips,
  isMultiClipTimeline,
  findClipAtTime,
  clipDuration,
  trimClipStart,
  trimClipEnd,
  setClipEffects,
  getClipColorEffects,
  getClipPipEffects,
} from "./js/timeline-model.js";
import { createTimelineView } from "./js/timeline-view.js";
import { createPreviewEngine } from "./js/preview-engine.js";
import { createEditHistory } from "./js/edit-history.js";
import { createCloudSaveModal } from "../../js/cloud-save-modal.js";
import { createCloudOpenModal } from "../../js/cloud-open-modal.js";
import { fetchDownloadBlob } from "../cloud-storage/js/api.js";

const APP_SLUG = "video-editor";
const MAX_VIDEO_BYTES = 4 * 1024 * 1024 * 1024;

const ASPECT_PRESETS = [
  { value: "free", label: "自由" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16（縦）" },
  { value: "4:3", label: "4:3" },
  { value: "1:1", label: "1:1" },
];

/** @type {HTMLElement | null} */
const landingView = document.getElementById("landing-view");
/** @type {HTMLElement | null} */
const editorView = document.getElementById("editor-view");
const fileInput = document.getElementById("file-input");
const audioFileInput = document.getElementById("audio-file-input");
const dropZone = document.getElementById("drop-zone");
const preview = /** @type {HTMLVideoElement} */ (document.getElementById("preview"));
const previewB = /** @type {HTMLVideoElement | null} */ (document.getElementById("preview-b"));
const previewCanvas = /** @type {HTMLCanvasElement | null} */ (document.getElementById("preview-canvas"));
const bgmPreview = /** @type {HTMLAudioElement | null} */ (document.getElementById("bgm-preview"));

const previewWrap = document.getElementById("preview-wrap");
const textsContainer = document.getElementById("texts-container");
const mainToolbar = document.getElementById("main-toolbar");
const toolAddText = document.getElementById("tool-add-text");
const addTextBtn = document.getElementById("add-text-btn");
const addTextControls = document.getElementById("add-text-controls");
const textFontMenu = document.getElementById("text-font-menu");
const textSizeMenu = document.getElementById("text-size-menu");
const textFontLabel = document.getElementById("text-font-label");
const textSizeLabel = document.getElementById("text-size-label");
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
const timelineTrack = document.getElementById("timeline-track");
const timelinePlayhead = document.getElementById("timeline-playhead");
const handleStart = document.getElementById("handle-start");
const handleEnd = document.getElementById("handle-end");
const maskLeft = document.getElementById("mask-left");
const maskRight = document.getElementById("mask-right");
const storyboardFrames = document.getElementById("storyboard-frames");
const trimZoomTrack = document.getElementById("trim-zoom-track");
const trimZoomFrames = document.getElementById("trim-zoom-frames");
const trimZoomPlayhead = document.getElementById("trim-playhead");
const trimMaskLeft = document.getElementById("trim-mask-left");
const trimMaskRight = document.getElementById("trim-mask-right");
const trimHandleStart = document.getElementById("trim-handle-start");
const trimHandleEnd = document.getElementById("trim-handle-end");
const waveformCanvas = document.getElementById("waveform-canvas");
const trimEditor = document.getElementById("trim-editor");
const trimEditorStrip = document.getElementById("trim-editor-strip");
const trimModeHint = document.getElementById("trim-mode-hint");
const trimModeBtn = document.getElementById("trim-mode-btn");
const editorSidebar = document.getElementById("editor-sidebar");
const mediaBinEl = document.getElementById("media-bin");
const multiTrackEl = document.getElementById("multi-track");
const toolPopover = document.getElementById("tool-popover");
const toolsCenter = document.getElementById("tools-center");
const formatPickerBtn = document.getElementById("format-picker-btn");
const formatDropdown = document.getElementById("format-dropdown");
const formatPickerLabel = document.getElementById("format-picker-label");
const inverseToggle = /** @type {HTMLInputElement | null} */ (document.getElementById("inverse-toggle"));
const previewPlaceholder = document.getElementById("preview-placeholder");
const textColorInput = /** @type {HTMLInputElement | null} */ (document.getElementById("text-color"));
const textOpacityInput = /** @type {HTMLInputElement | null} */ (document.getElementById("text-opacity"));
const textOpacityValue = document.getElementById("text-opacity-value");
const aspectSelect = /** @type {HTMLSelectElement} */ (document.getElementById("aspect-select"));
const formatSelect = /** @type {HTMLSelectElement} */ (document.getElementById("format-select"));
const textPositionSelect = null;
const noReencodeInput = /** @type {HTMLInputElement} */ (document.getElementById("no-reencode"));
const noReencodeWrap = document.getElementById("no-reencode-wrap");
const noReencodeHint = document.getElementById("no-reencode-hint");
const qualityField = document.getElementById("quality-field");
const qualityInput = /** @type {HTMLInputElement} */ (document.getElementById("quality"));
const qualityValue = document.getElementById("quality-value");
const volumeInput = /** @type {HTMLInputElement} */ (document.getElementById("volume"));
const volumeValue = document.getElementById("volume-value");
const speedInput = /** @type {HTMLInputElement} */ (document.getElementById("speed"));
const speedValue = document.getElementById("speed-value");
const bgmVolumeInput = /** @type {HTMLInputElement | null} */ (document.getElementById("bgm-volume"));
const bgmVolumeValue = document.getElementById("bgm-volume-value");
const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");
const pipInspector = document.getElementById("pip-inspector");
const colorBrightnessInput = /** @type {HTMLInputElement | null} */ (document.getElementById("color-brightness"));
const colorContrastInput = /** @type {HTMLInputElement | null} */ (document.getElementById("color-contrast"));
const colorSaturationInput = /** @type {HTMLInputElement | null} */ (document.getElementById("color-saturation"));
const colorBrightnessValue = document.getElementById("color-brightness-value");
const colorContrastValue = document.getElementById("color-contrast-value");
const colorSaturationValue = document.getElementById("color-saturation-value");
const colorClipHint = document.getElementById("color-clip-hint");
const pipXInput = /** @type {HTMLInputElement | null} */ (document.getElementById("pip-x"));
const pipYInput = /** @type {HTMLInputElement | null} */ (document.getElementById("pip-y"));
const pipScaleInput = /** @type {HTMLInputElement | null} */ (document.getElementById("pip-scale"));
const pipOpacityInput = /** @type {HTMLInputElement | null} */ (document.getElementById("pip-opacity"));
const pipXValue = document.getElementById("pip-x-value");
const pipYValue = document.getElementById("pip-y-value");
const pipScaleValue = document.getElementById("pip-scale-value");
const pipOpacityValue = document.getElementById("pip-opacity-value");

/** @type {{
 *   file: File | null,
 *   objectUrl: string | null,
 *   duration: number,
 *   startTime: number,
 *   endTime: number,
 *   rotation: number,
 *   flipH: boolean,
 *   flipV: boolean,
 *   volume: number,
 *   speed: number,
 *   bgmVolume: number,
 *   fadeIn: number,
 *   fadeOut: number,
 *   cropEnabled: boolean,
 *   crop: { x: number, y: number, w: number, h: number },
 *   aspectRatio: string,
 *   texts: import("./js/text-tool.js").TextItem[],
 *   activeTextId: string | null,
 *   outputFormat: string,
 *   quality: number,
 *   noReencode: boolean,
 *   inverse: boolean,
 *   activeTool: string,
 *   videoWidth: number,
 *   videoHeight: number,
 *   lastExportBlob: Blob | null,
 *   lastExportName: string,
 *   exporting: boolean,
 *   slipOffset: number,
 *   audioStart: number,
 *   audioEnd: number,
 *   audioLinked: boolean,
 *   trimMode: boolean,
 *   waveformPeaks: number[],
 *   fps: number,
 *   jklSpeed: number,
 *   timeline: import("./js/timeline-model.js").TimelineModel | null,
 *   selectedClipId: string | null,
 *   timelinePlayhead: number,
 * }} */
const state = {
  file: null,
  objectUrl: null,
  duration: 0,
  startTime: 0,
  endTime: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  volume: 100,
  speed: 100,
  bgmVolume: 80,
  fadeIn: 0,
  fadeOut: 0,
  cropEnabled: false,
  crop: { x: 0, y: 0, w: 1, h: 1 },
  aspectRatio: "free",
  texts: [],
  activeTextId: null,
  outputFormat: "mp4",
  quality: 23,
  noReencode: true,
  inverse: false,
  activeTool: "cut",
  videoWidth: 0,
  videoHeight: 0,
  lastExportBlob: null,
  lastExportName: "",
  exporting: false,
  slipOffset: 0,
  audioStart: 0,
  audioEnd: 0,
  audioLinked: true,
  trimMode: false,
  waveformPeaks: [],
  fps: 30,
  jklSpeed: 0,
  timeline: null,
  selectedClipId: null,
  selectedClipTrackId: null,
  timelinePlayhead: 0,
  timelineViewStart: 0,
  timelineViewEnd: 0,
};

/** @type {ReturnType<typeof createCloudSaveModal> | null} */
let cloudSaveModal = null;
/** @type {ReturnType<typeof createCloudOpenModal> | null} */
let cloudOpenModal = null;
/** @type {ReturnType<typeof createDualTimeline> | null} */
let dualTimeline = null;
/** @type {ReturnType<typeof createTimelineView> | null} */
let timelineView = null;
/** @type {ReturnType<typeof createPreviewEngine> | null} */
let previewEngine = null;
/** @type {ReturnType<typeof createEditHistory> | null} */
let editHistory = null;
let isPlaying = false;
/** @type {ReturnType<typeof initCropOverlay> | null} */
let cropOverlay = null;

/** 選択中クリップ情報 */
function getSelectedClipInfo() {
  if (!state.timeline || !state.selectedClipId) return null;
  for (const track of state.timeline.tracks) {
    const clip = track.clips.find((c) => c.id === state.selectedClipId);
    if (clip) return { track, clip };
  }
  return null;
}

/** タイムライン表示ウィンドウ（秒） */
function getTimelineViewWindow() {
  const duration = state.timeline?.duration ?? state.duration ?? 1;
  if (duration <= 0) return { start: 0, end: 1 };
  const start = state.timelineViewStart ?? 0;
  const end = state.timelineViewEnd > start ? state.timelineViewEnd : duration;
  return {
    start: Math.max(0, start),
    end: Math.min(duration, end),
  };
}

/** タイムラインズームをリセット */
function resetTimelineZoom() {
  const duration = state.timeline?.duration ?? state.duration ?? 0;
  state.timelineViewStart = 0;
  state.timelineViewEnd = duration;
}

/** 指定比率を中心にタイムラインズーム */
function zoomTimelineAt(focusRatio, factor) {
  const duration = state.timeline?.duration ?? 0;
  if (duration <= 0) return;
  const view = getTimelineViewWindow();
  const span = Math.max(0.1, view.end - view.start);
  const newSpan = clamp(span * factor, 0.1, duration);
  const focus = view.start + focusRatio * span;
  const newStart = clamp(focus - newSpan * focusRatio, 0, duration - newSpan);
  state.timelineViewStart = newStart;
  state.timelineViewEnd = newStart + newSpan;
  timelineView?.render();
}

/** カラースライダーを選択クリップに同期 */
function syncColorSliders() {
  const info = getSelectedClipInfo();
  const fx = info ? getClipColorEffects(info.clip) : { brightness: 0, contrast: 0, saturation: 0 };
  if (colorBrightnessInput) colorBrightnessInput.value = String(fx.brightness);
  if (colorContrastInput) colorContrastInput.value = String(fx.contrast);
  if (colorSaturationInput) colorSaturationInput.value = String(fx.saturation);
  if (colorBrightnessValue) colorBrightnessValue.textContent = String(fx.brightness);
  if (colorContrastValue) colorContrastValue.textContent = String(fx.contrast);
  if (colorSaturationValue) colorSaturationValue.textContent = String(fx.saturation);
  if (colorClipHint) {
    colorClipHint.textContent = info
      ? `${info.track.id.toUpperCase()} クリップを調整中`
      : "クリップを選択して調整";
  }
}

/** PiP スライダーを選択クリップに同期 */
function syncPipSliders() {
  const info = getSelectedClipInfo();
  const showPip = info?.track.id === "v2";
  if (pipInspector instanceof HTMLElement) pipInspector.hidden = !showPip;
  if (!showPip || !info) return;
  const pip = getClipPipEffects(info.clip);
  if (pipXInput) pipXInput.value = String(Math.round(pip.x * 100));
  if (pipYInput) pipYInput.value = String(Math.round(pip.y * 100));
  if (pipScaleInput) pipScaleInput.value = String(Math.round(pip.scale * 100));
  if (pipOpacityInput) pipOpacityInput.value = String(Math.round((pip.opacity ?? 1) * 100));
  if (pipXValue) pipXValue.textContent = String(Math.round(pip.x * 100));
  if (pipYValue) pipYValue.textContent = String(Math.round(pip.y * 100));
  if (pipScaleValue) pipScaleValue.textContent = String(Math.round(pip.scale * 100));
  if (pipOpacityValue) pipOpacityValue.textContent = String(Math.round((pip.opacity ?? 1) * 100));
}

/** プレビューエンジンをアタッチ */
function attachPreviewEngine() {
  if (previewB && previewCanvas) {
    previewEngine?.attach(preview, bgmPreview, previewB, previewCanvas);
  } else {
    previewEngine?.attach(preview, bgmPreview);
  }
}

function patchState(partial) {
  Object.assign(state, partial);
}

function updateUndoRedoUi() {
  if (undoBtn instanceof HTMLButtonElement) undoBtn.disabled = !editHistory?.canUndo();
  if (redoBtn instanceof HTMLButtonElement) redoBtn.disabled = !editHistory?.canRedo();
}

/** 編集操作を履歴付きで実行 */
function commitEdit(fn) {
  if (state.timeline) editHistory?.push(state.timeline, state);
  fn();
  refreshAfterEdit();
}

function refreshAfterEdit() {
  syncTrimState();
  applyPreviewTransform();
  renderTexts();
  updateCropOverlay();
  updateFileMeta();
  refreshReencodeUi();
  updateInspectorForSelection();
  timelineView?.render();
  previewEngine?.seekToTimelineTime(state.timelinePlayhead).catch(() => {});
  updateUndoRedoUi();
}

/** 選択クリップに応じてインスペクタを更新 */
function updateInspectorForSelection() {
  syncColorSliders();
  syncPipSliders();
  if (!state.timeline || !isMultiClipTimeline(state.timeline)) return;
  const info = getSelectedClipInfo();
  if (!info || info.track.id !== "v1") return;
  const { clip } = info;
  startTimeInput.value = formatTimePrecise(clip.sourceIn);
  endTimeInput.value = formatTimePrecise(clip.sourceOut);
  trimDurationEl.textContent = formatTimePrecise(clipDuration(clip));
}

function syncTimelineModel() {
  if (!state.timeline || !projectHasVideo() || isMultiClipTimeline(state.timeline)) return;
  syncSingleClipToTimeline(state.timeline, {
    startTime: state.startTime,
    endTime: state.endTime,
    slipOffset: state.slipOffset,
    duration: state.duration,
  });
  timelineView?.render();
}

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href = `/login/?next=${encodeURIComponent("/apps/video-editor/")}`;
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  landingView.hidden = true;
  return true;
}

/** 画面モード切替 */
function showLanding() {
  showEditor();
}

function showEditor() {
  landingView.hidden = true;
  editorView.hidden = false;
  document.body.classList.remove("ve-app--landing", "cc-app--landing");
  document.body.classList.add("ve-app--editing", "cc-app--editing");
}

/** 空の編集画面を表示 */
function showEmptyEditor() {
  showEditor();
  if (!state.timeline) {
    state.timeline = createEmptyTimeline();
  }
  resetTimelineZoom();
  if (editorSidebar instanceof HTMLElement) editorSidebar.hidden = false;
  if (trimEditor instanceof HTMLElement) trimEditor.hidden = true;
  fileNameEl.textContent = "新規プロジェクト";
  fileMetaEl.textContent = "動画または音楽を追加";
  previewPlaceholder.hidden = false;
  previewPlaceholder.textContent = "「動画を追加」からメディアを読み込んでください";
  timelineView?.render();
  updateUndoRedoUi();
}

/** 左パネル表示 */
function syncSidebarPanel(toolName) {
  const panel = toolName === "text" ? "text" : "cut";
  document.querySelectorAll(".cc-panel-section").forEach((section) => {
    if (!(section instanceof HTMLElement)) return;
    section.hidden = section.dataset.panel !== panel;
  });
}

/** 現在の編集設定を取得 */
function getExportSettings() {
  const trimRange = getExportTrimRange({
    start: state.startTime,
    end: state.endTime,
    slipOffset: state.slipOffset,
    audioStart: state.audioStart,
    audioEnd: state.audioEnd,
    audioLinked: state.audioLinked,
    duration: state.duration,
    rotation: state.rotation,
    flipH: state.flipH,
    flipV: state.flipV,
    volume: state.volume,
    speed: state.speed,
    fadeIn: state.fadeIn,
    fadeOut: state.fadeOut,
    cropEnabled: state.cropEnabled,
    textEnabled: state.texts.some((t) => t.content.trim()),
    format: state.outputFormat,
    inverse: state.inverse,
    timeline: state.timeline,
  });

  return {
    start: state.startTime,
    end: state.endTime,
    slipOffset: state.slipOffset,
    audioStart: trimRange.audioStart,
    audioEnd: trimRange.audioEnd,
    audioLinked: state.audioLinked,
    rotation: state.rotation,
    flipH: state.flipH,
    flipV: state.flipV,
    volume: state.volume,
    speed: state.speed,
    fadeIn: state.fadeIn,
    fadeOut: state.fadeOut,
    cropEnabled: state.cropEnabled,
    crop: { ...state.crop },
    texts: state.texts.map((t) => ({ ...t })),
    textEnabled: state.texts.some((t) => t.content.trim()),
    textOverlays:
      previewWrap instanceof HTMLElement
        ? state.texts
            .filter((t) => t.content.trim())
            .map((t) => {
              const coords = textToExportCoords(preview, previewWrap, t);
              const rect = previewWrap.getBoundingClientRect();
              const scaleX = preview.videoWidth / Math.max(1, rect.width);
              const el = textsContainer?.querySelector(`[data-text-id="${t.id}"]`);
              const boxWidth =
                el instanceof HTMLElement ? Math.round(el.offsetWidth * scaleX) : undefined;
              return {
                content: t.content,
                x: coords.x,
                y: coords.y,
                fontSize: coords.fontSize,
                color: t.color,
                opacity: t.opacity,
                fontFamily: t.fontFamily,
                bold: t.bold,
                italic: t.italic,
                align: t.align,
                boxWidth,
              };
            })
        : [],
    format: state.outputFormat,
    quality: state.quality,
    noReencode: state.noReencode,
    inverse: state.inverse,
    duration: state.duration,
    videoWidth: state.videoWidth,
    videoHeight: state.videoHeight,
    timeline: state.timeline,
    colorEffects: (() => {
      const info = getSelectedClipInfo();
      if (info) return getClipColorEffects(info.clip);
      const vTrack = state.timeline?.tracks.find((t) => t.id === "v1");
      if (vTrack?.clips[0]) return getClipColorEffects(vTrack.clips[0]);
      return { brightness: 0, contrast: 0, saturation: 0 };
    })(),
  };
}

/** 再エンコードオプションの表示更新 */
function refreshReencodeUi() {
  const settings = getExportSettings();
  const reencodeRequired = needsReencode(settings) || settings.inverse;
  if (noReencodeInput) {
    noReencodeInput.disabled = reencodeRequired;
    if (reencodeRequired) noReencodeInput.checked = false;
    state.noReencode = noReencodeInput.checked;
  }
  if (noReencodeWrap) noReencodeWrap.hidden = state.outputFormat === "webm";
  if (noReencodeHint) {
    noReencodeHint.textContent = reencodeRequired
      ? "回転・クロップ・テキスト・カラー・音量/速度/フェード・WebM 出力時は再エンコードが必要です。"
      : "トリムのみの場合は再エンコードなしで高速に書き出せます。";
  }
  if (qualityField) qualityField.hidden = state.noReencode && !reencodeRequired;
}

/** インスペクタ見出し */
const INSPECTOR_TITLES = {
  cut: "トリム",
  text: "テキスト",
  crop: "クロップ",
  rotate: "回転",
  volume: "音量",
  speed: "速度",
  flip: "反転",
  color: "カラー",
};

function updateInspectorTitle(toolName) {
  const el = document.getElementById("inspector-title");
  if (el) el.textContent = INSPECTOR_TITLES[toolName] ?? "プロパティ";
}

/** タイムライン上のタイムコード表示 */
function updateTimecode() {
  const el = document.getElementById("timeline-timecode");
  if (!el) return;
  if (state.duration <= 0) {
    el.textContent = "0:00.0 / 0:00.0";
    return;
  }
  const cur = formatTimePrecise(state.timelinePlayhead ?? preview.currentTime ?? 0);
  const total = formatTimePrecise(state.duration);
  el.textContent = `${cur} / ${total}`;
}

/** トリム区間を同期 */
function syncTrimState() {
  if (state.duration <= 0) return;
  state.startTime = clamp(state.startTime, 0, state.duration);
  state.endTime = clamp(state.endTime, state.startTime + 0.1, state.duration);
  if (state.audioLinked) {
    const { effectiveStart, effectiveEnd } = getEffectiveRange(state);
    state.audioStart = effectiveStart;
    state.audioEnd = effectiveEnd;
  } else {
    state.audioStart = clamp(state.audioStart, 0, state.duration);
    state.audioEnd = clamp(state.audioEnd, state.audioStart + 0.1, state.duration);
  }
  startTimeInput.value = formatTimePrecise(state.startTime);
  endTimeInput.value = formatTimePrecise(state.endTime);
  trimDurationEl.textContent = formatTimePrecise(state.endTime - state.startTime);
  dualTimeline?.update();
  syncTimelineModel();
  refreshReencodeUi();
  updateTimecode();
}

/** タイムライン UI 更新 */
function updateTimelineUi() {
  dualTimeline?.update();
  updateTimecode();
}

/** プレビュー変形（回転・反転） */
function applyPreviewTransform() {
  const transforms = [];
  if (state.rotation) transforms.push(`rotate(${state.rotation}deg)`);
  if (state.flipH) transforms.push("scaleX(-1)");
  if (state.flipV) transforms.push("scaleY(-1)");
  preview.style.transform = transforms.length ? transforms.join(" ") : "";
}

/** @returns {import("./js/text-tool.js").TextItem | null} */
function getActiveText() {
  return state.texts.find((t) => t.id === state.activeTextId) ?? state.texts[0] ?? null;
}

/** テキストオーバーレイ描画 */
function renderTexts() {
  if (!(textsContainer instanceof HTMLElement)) return;
  syncTextOverlay(
    textsContainer,
    state.texts,
    getActiveText(),
    (item) => {
      const idx = state.texts.findIndex((t) => t.id === item.id);
      if (idx >= 0) state.texts[idx] = { ...item };
      refreshReencodeUi();
    },
    (item) => {
      state.activeTextId = item.id;
      updateTextToolbar();
      renderTexts();
    }
  );
  updateTextToolbar();
  refreshReencodeUi();
}

/** テキストツールバー UI 更新 */
function updateTextToolbar() {
  const active = getActiveText();
  const hasText = state.texts.length > 0;

  addTextBtn?.classList.toggle("hide-label", hasText);
  if (addTextControls instanceof HTMLElement) addTextControls.hidden = !hasText;

  if (!active) {
    if (textFontLabel) textFontLabel.textContent = FONT_FAMILIES[0].label;
    if (textSizeLabel) textSizeLabel.textContent = String(FONT_SIZES[3].value);
    return;
  }

  const font = FONT_FAMILIES.find((f) => f.value === active.fontFamily) ?? FONT_FAMILIES[0];
  if (textFontLabel) textFontLabel.textContent = font.label;
  if (textSizeLabel) textSizeLabel.textContent = String(active.fontSize);
  if (textColorInput) textColorInput.value = active.color;
  if (textOpacityInput) textOpacityInput.value = String(active.opacity);
  if (textOpacityValue) textOpacityValue.textContent = String(active.opacity);

  document.getElementById("text-bold-btn")?.classList.toggle("is-active", active.bold);
  document.getElementById("text-italic-btn")?.classList.toggle("is-active", active.italic);
  document.querySelectorAll(".ve-add-text-align-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-align") === active.align);
  });
}

/** 動画上にテキストを追加 */
function addTextAt(x, y) {
  if (!(previewWrap instanceof HTMLElement)) return;
  const rect = previewWrap.getBoundingClientRect();
  const item = createDefaultText(
    Math.max(8, Math.min(x, rect.width - 80)),
    Math.max(8, Math.min(y, rect.height - 40))
  );
  state.texts.push(item);
  state.activeTextId = item.id;
  renderTexts();
  requestAnimationFrame(() => {
    const el = textsContainer?.querySelector(`[data-text-id="${item.id}"]`);
    if (el instanceof HTMLElement) {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  });
}

/** テキストツール初期化 */
function initTextTool() {
  if (textFontMenu instanceof HTMLElement) {
    for (const font of FONT_FAMILIES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = font.label;
      btn.dataset.fontValue = font.value;
      btn.addEventListener("click", () => {
        const active = getActiveText();
        if (!active) return;
        active.fontFamily = font.value;
        textFontMenu.hidden = true;
        renderTexts();
      });
      textFontMenu.appendChild(btn);
    }
  }

  if (textSizeMenu instanceof HTMLElement) {
    for (const size of FONT_SIZES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = size.label;
      btn.addEventListener("click", () => {
        const active = getActiveText();
        if (!active) return;
        active.fontSize = size.value;
        textSizeMenu.hidden = true;
        renderTexts();
      });
      textSizeMenu.appendChild(btn);
    }
  }

  addTextBtn?.addEventListener("click", () => {
    if (!(previewWrap instanceof HTMLElement)) return;
    const rect = previewWrap.getBoundingClientRect();
    addTextAt(rect.width / 2 - 40, rect.height / 2 - 20);
  });

  previewWrap?.addEventListener("mousedown", (event) => {
    if (state.activeTool !== "text") return;
    if (event.target instanceof HTMLElement && event.target.closest(".ve-txt")) return;
    const point = pointInContainer(previewWrap, event.clientX, event.clientY);
    addTextAt(point.x, point.y);
    event.preventDefault();
  });

  document.getElementById("text-font-btn")?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (textFontMenu instanceof HTMLElement) textFontMenu.hidden = !textFontMenu.hidden;
    if (textSizeMenu instanceof HTMLElement) textSizeMenu.hidden = true;
  });

  document.getElementById("text-size-btn")?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (textSizeMenu instanceof HTMLElement) textSizeMenu.hidden = !textSizeMenu.hidden;
    if (textFontMenu instanceof HTMLElement) textFontMenu.hidden = true;
  });

  textColorInput?.addEventListener("input", () => {
    const active = getActiveText();
    if (!active || !textColorInput) return;
    active.color = textColorInput.value;
    renderTexts();
  });

  document.getElementById("text-bold-btn")?.addEventListener("click", () => {
    const active = getActiveText();
    if (!active) return;
    active.bold = !active.bold;
    renderTexts();
  });

  document.getElementById("text-italic-btn")?.addEventListener("click", () => {
    const active = getActiveText();
    if (!active) return;
    active.italic = !active.italic;
    renderTexts();
  });

  document.querySelectorAll(".ve-add-text-align-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const active = getActiveText();
      const align = btn.getAttribute("data-align");
      if (!active || !align) return;
      active.align = /** @type {"left" | "center" | "right"} */ (align);
      renderTexts();
    });
  });

  textOpacityInput?.addEventListener("input", () => {
    const active = getActiveText();
    if (!active || !textOpacityInput) return;
    active.opacity = Number(textOpacityInput.value);
    if (textOpacityValue) textOpacityValue.textContent = textOpacityInput.value;
    renderTexts();
  });

  document.getElementById("text-delete-btn")?.addEventListener("click", () => {
    const active = getActiveText();
    if (!active) return;
    state.texts = removeText(state.texts, active.id);
    state.activeTextId = state.texts[0]?.id ?? null;
    renderTexts();
  });

  document.addEventListener("click", (event) => {
    if (textFontMenu instanceof HTMLElement && !textFontMenu.hidden) {
      if (!(event.target instanceof Node) || !event.target.closest(".ve-add-text-block--fonts")) {
        textFontMenu.hidden = true;
      }
    }
    if (textSizeMenu instanceof HTMLElement && !textSizeMenu.hidden) {
      if (!(event.target instanceof Node) || !event.target.closest(".ve-add-text-block--size")) {
        textSizeMenu.hidden = true;
      }
    }
  });
}

/** クロップオーバーレイ更新 */
function updateCropOverlay() {
  cropOverlay?.update();
}

/** メタ情報表示 */
function updateFileMeta() {
  if (!projectHasVideo()) {
    const binCount = state.timeline?.mediaBin.length ?? 0;
    if (binCount === 0) {
      fileNameEl.textContent = "新規プロジェクト";
      fileMetaEl.textContent = "動画または音楽を追加";
    } else {
      const videos = state.timeline.mediaBin.filter((m) => m.kind === "video").length;
      const audios = state.timeline.mediaBin.filter((m) => m.kind === "audio").length;
      fileNameEl.textContent = "新規プロジェクト";
      fileMetaEl.textContent = `動画 ${videos} · 音楽 ${audios}`;
    }
    return;
  }

  const primary = state.file ?? getPrimaryExportFile();
  if (!primary) {
    fileNameEl.textContent = "新規プロジェクト";
    fileMetaEl.textContent = "—";
    return;
  }

  fileNameEl.textContent = primary.name;
  const videoCount = state.timeline?.mediaBin.filter((m) => m.kind === "video").length ?? 1;
  const parts = [
    formatBytes(primary.size),
    state.duration > 0 ? formatTimeShort(state.timeline?.duration ?? state.duration) : null,
    state.videoWidth && state.videoHeight ? `${state.videoWidth}×${state.videoHeight}` : null,
    videoCount > 1 ? `クリップ ${state.timeline?.tracks.find((t) => t.id === "v1")?.clips.length ?? 0}` : null,
  ].filter(Boolean);
  fileMetaEl.textContent = parts.join(" · ");
}

/** プロジェクトに動画があるか */
function projectHasVideo() {
  return state.timeline ? hasVideoClips(state.timeline) : false;
}

/** 書き出し用の代表動画ファイル */
function getPrimaryExportFile() {
  if (state.file) return state.file;
  const vTrack = state.timeline?.tracks.find((t) => t.id === "v1");
  const clip = vTrack?.clips[0];
  if (!clip || !state.timeline) return null;
  const media = state.timeline.mediaBin.find((m) => m.id === clip.mediaId);
  return media?.file ?? null;
}

/** 動画のメタデータを取得 */
async function probeVideoFile(file, objectUrl) {
  const probe = document.createElement("video");
  probe.src = objectUrl;
  await new Promise((resolve, reject) => {
    probe.onloadedmetadata = () => resolve(undefined);
    probe.onerror = () => reject(new Error("動画を読み込めませんでした"));
  });
  const meta = {
    duration: probe.duration,
    videoWidth: probe.videoWidth,
    videoHeight: probe.videoHeight,
  };
  probe.removeAttribute("src");
  probe.load();
  return meta;
}

/** 最初の動画でプロジェクトを初期化 */
async function bootstrapProjectWithVideo(file, duration, objectUrl, meta) {
  state.file = file;
  state.objectUrl = objectUrl;
  preview.src = objectUrl;
  state.duration = duration;
  state.startTime = 0;
  state.endTime = duration;
  state.slipOffset = 0;
  state.audioStart = 0;
  state.audioEnd = duration;
  state.audioLinked = true;
  state.timelinePlayhead = 0;
  state.selectedClipId = null;
  state.fps = 30;
  state.videoWidth = meta.videoWidth;
  state.videoHeight = meta.videoHeight;
  preview.currentTime = 0;
  preview.muted = false;
  preview.volume = Math.min(1, state.volume / 100);
  previewPlaceholder.hidden = true;
  playBtn.disabled = false;
  exportBtn.disabled = false;
  cloudSaveBtn.disabled = true;
  if (editorSidebar instanceof HTMLElement) editorSidebar.hidden = false;
  if (trimEditor instanceof HTMLElement) trimEditor.hidden = false;

  state.timeline = createTimelineFromFile(file, duration, objectUrl);
  resetTimelineZoom();
  timelineView?.render();

  syncTrimState();
  applyPreviewTransform();
  renderTexts();
  updateCropOverlay();
  updateFileMeta();
  refreshReencodeUi();

  generateWaveformPeaks(file)
    .then(({ peaks }) => {
      state.waveformPeaks = peaks;
      dualTimeline?.updateWaveform();
    })
    .catch(() => {});

  dualTimeline?.buildFilmstrip().catch(() => {});
  dualTimeline?.buildTrimEditorStrip().catch(() => {});

  editHistory?.clear();
  attachPreviewEngine();
  await previewEngine?.seekToTimelineTime(0);
  updateUndoRedoUi();
}

/** 動画をプロジェクトに追加（空なら初期化、既存なら再生位置に配置） */
async function importVideoFile(file) {
  if (!file) return;
  if (file.size > MAX_VIDEO_BYTES) {
    alert("4 GB を超えるファイルはサポートされていません。");
    return;
  }

  if (!state.timeline) {
    state.timeline = createEmptyTimeline();
  }

  const objectUrl = URL.createObjectURL(file);
  previewPlaceholder.hidden = false;
  previewPlaceholder.textContent = "プレビューを読み込み中…";
  showEditor();

  let meta;
  try {
    meta = await probeVideoFile(file, objectUrl);
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    previewPlaceholder.hidden = false;
    previewPlaceholder.textContent = "動画を選択してください";
    alert(error instanceof Error ? error.message : "動画を読み込めませんでした");
    return;
  }

  if (!projectHasVideo()) {
    await bootstrapProjectWithVideo(file, meta.duration, objectUrl, meta);
    return;
  }

  commitEdit(() => {
    const mediaId = addMediaToBin(state.timeline, file, meta.duration, objectUrl, "video");
    placeVideoClip(state.timeline, mediaId, state.timelinePlayhead, 0, meta.duration);
  });
  previewPlaceholder.hidden = true;
  timelineView?.render();
  syncTimelineModel();
  updateFileMeta();
  refreshReencodeUi();
  await previewEngine?.seekToTimelineTime(state.timelinePlayhead);
}

/** 動画ファイルを読み込む（プロジェクトを置き換え） */
async function loadVideoFile(file) {
  resetEditor(false);
  await importVideoFile(file);
}

/** 音声ファイルを BGM として読み込む */
async function loadAudioFile(file) {
  if (!file) return;
  if (!state.timeline) {
    state.timeline = createEmptyTimeline();
  }

  const objectUrl = URL.createObjectURL(file);
  const probe = document.createElement("audio");
  probe.src = objectUrl;

  await new Promise((resolve, reject) => {
    probe.onloadedmetadata = () => resolve(undefined);
    probe.onerror = () => reject(new Error("音声を読み込めませんでした"));
  });

  const duration = probe.duration;
  probe.removeAttribute("src");

  commitEdit(() => {
    const mediaId = addAudioMedia(state.timeline, file, duration, objectUrl);
    appendBgmClip(state.timeline, mediaId, state.timelinePlayhead, 0, duration);
  });
  timelineView?.render();
  syncTimelineModel();
  await previewEngine?.seekToTimelineTime(state.timelinePlayhead);
}

/** 編集状態をリセット */
function resetEditor(clearFile = true) {
  if (state.objectUrl) {
    URL.revokeObjectURL(state.objectUrl);
  }
  if (state.timeline) {
    for (const media of state.timeline.mediaBin) {
      if (media.objectUrl && media.objectUrl !== state.objectUrl) {
        URL.revokeObjectURL(media.objectUrl);
      }
    }
  }
  preview.pause();
  bgmPreview?.pause();
  if (bgmPreview) {
    bgmPreview.removeAttribute("src");
    bgmPreview.load();
  }
  preview.removeAttribute("src");
  preview.load();

  state.file = null;
  state.objectUrl = null;
  state.duration = 0;
  state.startTime = 0;
  state.endTime = 0;
  state.rotation = 0;
  state.flipH = false;
  state.flipV = false;
  state.volume = 100;
  state.speed = 100;
  state.bgmVolume = 80;
  state.fadeIn = 0;
  state.fadeOut = 0;
  state.cropEnabled = false;
  state.crop = { x: 0, y: 0, w: 1, h: 1 };
  state.texts = [];
  state.activeTextId = null;
  state.lastExportBlob = null;
  state.videoWidth = 0;
  state.videoHeight = 0;
  state.inverse = false;
  state.activeTool = "cut";
  state.slipOffset = 0;
  state.audioLinked = true;
  state.trimMode = false;
  state.waveformPeaks = [];
  state.jklSpeed = 0;
  state.timeline = null;
  state.selectedClipId = null;
  state.selectedClipTrackId = null;
  state.timelinePlayhead = 0;
  state.timelineViewStart = 0;
  state.timelineViewEnd = 0;
  editHistory?.clear();
  previewEngine?.detach();

  document.querySelectorAll(".ve-rotate-btn").forEach((btn) => {
    btn.classList.toggle("ve-rotate-btn--active", btn.getAttribute("data-rotation") === "0");
  });
  document.getElementById("crop-enabled").checked = false;
  document.getElementById("flip-h").checked = false;
  document.getElementById("flip-v").checked = false;
  volumeInput.value = "100";
  volumeValue.textContent = "100";
  speedInput.value = "100";
  speedValue.textContent = "100";
  if (bgmVolumeInput) bgmVolumeInput.value = "80";
  if (bgmVolumeValue) bgmVolumeValue.textContent = "80";
  document.getElementById("fade-in").value = "0";
  document.getElementById("fade-out").value = "0";
  noReencodeInput.checked = true;
  if (inverseToggle) inverseToggle.checked = false;
  if (storyboardFrames) storyboardFrames.innerHTML = "";
  if (trimZoomFrames) trimZoomFrames.innerHTML = "";
  if (trimEditorStrip) trimEditorStrip.innerHTML = "";
  if (editorSidebar instanceof HTMLElement) editorSidebar.hidden = true;
  if (trimEditor instanceof HTMLElement) trimEditor.hidden = true;
  trimModeBtn?.classList.remove("is-active");
  setActiveTool("cut");

  applyPreviewTransform();
  renderTexts();
  updateCropOverlay();
  playBtn.disabled = true;
  exportBtn.disabled = true;
  cloudSaveBtn.disabled = true;
  previewPlaceholder.hidden = false;
  previewPlaceholder.textContent = "動画を選択してください";

  if (clearFile) {
    fileInput.value = "";
    showEmptyEditor();
  }
}

/** 再生/停止 */
function togglePlay() {
  if (!projectHasVideo()) return;
  previewEngine?.togglePlay().catch(() => {});
}

function handleUndo() {
  if (!state.timeline || !editHistory) return;
  const snap = editHistory.undo(state.timeline, state);
  if (!snap) return;
  refreshAfterEdit();
}

function handleRedo() {
  if (!state.timeline || !editHistory) return;
  const snap = editHistory.redo(state.timeline, state);
  if (!snap) return;
  refreshAfterEdit();
}

/** 書き出し */
async function handleExport() {
  const exportFile = getPrimaryExportFile();
  if (!exportFile || !projectHasVideo() || state.exporting) return;

  state.exporting = true;
  exportBtn.disabled = true;
  exportOverlay.hidden = false;
  exportOverlayText.textContent = "ffmpeg を読み込み中…";
  exportProgressBar.style.width = "0%";

  try {
    const settings = getExportSettings();
    const blob = await exportVideo(exportFile, settings, {
      onProgress: (ratio, message) => {
        exportProgressBar.style.width = `${Math.round(ratio * 100)}%`;
        if (message) exportOverlayText.textContent = message;
      },
    });

    state.lastExportBlob = blob;
    state.lastExportName = buildDownloadName(exportFile.name, settings.format);
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
    exportBtn.disabled = !projectHasVideo();
  }
}

/** クラウド保存 */
function openCloudSave() {
  if (!cloudSaveModal || !state.lastExportBlob) return;
  cloudSaveModal.open({
    blob: state.lastExportBlob,
    filename: state.lastExportName,
  });
}

/** クラウド読み込み */
function openCloudLoad() {
  if (!cloudOpenModal) return;
  cloudOpenModal.open({
    onFilesLoaded: (files) => {
      const video = files.find((f) => f.type.startsWith("video/") || /\.(mp4|webm|avi|mov|mkv|wmv|mpeg|mpg|3gp|m4v)$/i.test(f.name));
      if (video) loadVideoFile(video);
      else alert("動画ファイルを選択してください。");
    },
  });
}

/** URL パラメータから読み込み */
async function openFromStoragePath(storagePath) {
  const blob = await fetchDownloadBlob(storagePath);
  const name = storagePath.split("/").pop() || "video.mp4";
  await loadVideoFile(new File([blob], name, { type: blob.type || "video/mp4" }));
}

/** セレクト初期化 */
function initSelects() {
  for (const preset of ASPECT_PRESETS) {
    const opt = document.createElement("option");
    opt.value = preset.value;
    opt.textContent = preset.label;
    aspectSelect.appendChild(opt);
  }
}

/** ツールバー切替 */
function setActiveTool(toolName) {
  if (toolName === "trim") {
    state.trimMode = !state.trimMode;
    trimModeBtn?.classList.toggle("is-active", state.trimMode);
    document.body.classList.toggle("ve-trim-mode", state.trimMode);
    dualTimeline?.update();
    return;
  }

  state.activeTool = toolName;
  updateInspectorTitle(toolName);
  const isText = toolName === "text";

  document.querySelectorAll(".ve-tool-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-tool") === toolName);
  });

  syncSidebarPanel(toolName);

  if (toolAddText instanceof HTMLElement) toolAddText.hidden = !isText;
  if (textsContainer instanceof HTMLElement) textsContainer.hidden = !isText;
  previewWrap?.classList.toggle("is-text-tool", isText);

  if (toolPopover instanceof HTMLElement) {
    if (toolName === "cut" || isText) {
      toolPopover.hidden = true;
    } else {
      toolPopover.hidden = false;
      toolPopover.querySelectorAll(".ve-pop-inner").forEach((panel) => {
        panel.hidden = panel.getAttribute("data-pop") !== toolName;
      });
    }
  }

  if (toolsCenter instanceof HTMLElement) {
    toolsCenter.hidden = toolName !== "cut";
  }

  if (isText) {
    renderTexts();
  }

  if (toolName === "crop" && !state.cropEnabled) {
    const cropInput = document.getElementById("crop-enabled");
    if (cropInput instanceof HTMLInputElement) {
      cropInput.checked = true;
      state.cropEnabled = true;
      updateCropOverlay();
      refreshReencodeUi();
    }
  }
}

function initToolbar() {
  document.querySelectorAll(".ve-tool-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tool = btn.getAttribute("data-tool") || "cut";
      setActiveTool(tool);
    });
  });
}

/** 形式ピッカー */
function initFormatPicker() {
  formatPickerBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!(formatDropdown instanceof HTMLElement)) return;
    const open = formatDropdown.hidden;
    formatDropdown.hidden = !open;
    formatPickerBtn?.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.querySelectorAll(".ve-format-option").forEach((option) => {
    option.addEventListener("click", () => {
      const format = option.getAttribute("data-format") || "mp4";
      state.outputFormat = format;
      if (formatSelect instanceof HTMLSelectElement) formatSelect.value = format;
      if (formatPickerLabel) formatPickerLabel.textContent = format === "webm" ? "WebM" : "MP4";
      document.querySelectorAll(".ve-format-option").forEach((o) => {
        o.classList.toggle("is-active", o === option);
      });
      if (formatDropdown instanceof HTMLElement) formatDropdown.hidden = true;
      formatPickerBtn?.setAttribute("aria-expanded", "false");
      refreshReencodeUi();
    });
  });

  document.addEventListener("click", (event) => {
    if (!(formatDropdown instanceof HTMLElement) || formatDropdown.hidden) return;
    if (event.target instanceof Node && document.getElementById("format-picker")?.contains(event.target)) return;
    formatDropdown.hidden = true;
    formatPickerBtn?.setAttribute("aria-expanded", "false");
  });
}

/** タイムステッパー */
function initTimeSteppers() {
  const stepSec = 0.1;

  document.querySelectorAll(".ve-stepper-arrow").forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const target = arrow.getAttribute("data-target");
      const dir = Number(arrow.getAttribute("data-dir")) || 1;
      const delta = stepSec * dir;
      if (target === "start") {
        state.startTime = clamp(state.startTime + delta, 0, state.endTime - 0.1);
      } else if (target === "end") {
        state.endTime = clamp(state.endTime + delta, state.startTime + 0.1, state.duration);
      }
      syncTrimState();
    });
  });
}

/** タイムラインドラッグ — timeline.js に委譲 */
function initTimelineDrag() {
  dualTimeline?.initDrag();
}

function initDualTimeline() {
  dualTimeline = createDualTimeline({
    preview,
    overviewFrames: storyboardFrames,
    overviewStoryboard: document.getElementById("storyboard"),
    overviewTrack: timelineTrack,
    overviewPlayhead: timelinePlayhead,
    overviewMaskLeft: maskLeft,
    overviewMaskRight: maskRight,
    overviewHandleStart: handleStart,
    overviewHandleEnd: handleEnd,
    trimZoomTrack,
    trimZoomFrames,
    trimZoomPlayhead,
    trimZoomMaskLeft: trimMaskLeft,
    trimZoomMaskRight: trimMaskRight,
    trimZoomHandleStart: trimHandleStart,
    trimZoomHandleEnd: trimHandleEnd,
    waveformCanvas,
    trimEditorStrip,
    trimModeHint,
    getState: () => state,
    patchState,
    onSync: () => {
      if (state.duration <= 0) return;
      startTimeInput.value = formatTimePrecise(state.startTime);
      endTimeInput.value = formatTimePrecise(state.endTime);
      trimDurationEl.textContent = formatTimePrecise(state.endTime - state.startTime);
      refreshReencodeUi();
      syncTimelineModel();
    },
  });
  dualTimeline.initDrag();
}

function initTimelineView() {
  timelineView = createTimelineView({
    mediaBinEl,
    multiTrackEl,
    getTimeline: () => state.timeline ?? createEmptyTimeline(),
    getPlayhead: () => state.timelinePlayhead,
    getViewWindow: () => getTimelineViewWindow(),
    setPlayhead: (t) => {
      state.timelinePlayhead = t;
      dualTimeline?.update();
      updateTimecode();
    },
    onChange: () => {
      const duration = state.timeline?.duration ?? 0;
      if (duration > 0 && (state.timelineViewEnd <= 0 || state.timelineViewEnd > duration)) {
        state.timelineViewEnd = duration;
      }
      syncTimelineModel();
      updateUndoRedoUi();
    },
    getSelectedClipId: () => state.selectedClipId,
    setSelectedClipId: (id) => {
      state.selectedClipId = id;
    },
    onClipSelect: (trackId) => {
      state.selectedClipTrackId = trackId;
      setActiveTool("cut");
      updateInspectorForSelection();
    },
    onBeforeEdit: () => {
      if (state.timeline) editHistory?.push(state.timeline, state);
    },
    onSeekPreview: (t) => {
      previewEngine?.seekToTimelineTime(t).catch(() => {});
    },
    onPlaceOnTop: (mediaId, time, sourceIn, sourceOut) => {
      commitEdit(() => {
        const clipId = placeOnTop(state.timeline, mediaId, time, sourceIn, sourceOut);
        state.selectedClipId = clipId;
        state.selectedClipTrackId = "v2";
      });
    },
  });
}

function initPreviewEngine() {
  editHistory = createEditHistory();
  previewEngine = createPreviewEngine({
    getTimeline: () => state.timeline,
    getPlayhead: () => state.timelinePlayhead,
    setPlayhead: (t) => {
      state.timelinePlayhead = t;
      dualTimeline?.update();
      updateTimecode();
    },
    getTrimState: () => ({
      startTime: state.startTime,
      endTime: state.endTime,
      slipOffset: state.slipOffset,
      duration: state.duration,
      speed: state.speed,
      volume: state.volume,
      bgmVolume: state.bgmVolume,
    }),
    isPlaying: () => isPlaying,
    setPlaying: (playing) => {
      isPlaying = playing;
    },
  });
}

function initNleButtons() {
  document.getElementById("blade-btn")?.addEventListener("click", () => timelineView?.handleBlade());
  document.getElementById("timeline-split-btn")?.addEventListener("click", () => timelineView?.handleBlade());
  document.getElementById("timeline-play-btn")?.addEventListener("click", togglePlay);
  document.getElementById("ripple-delete-btn")?.addEventListener("click", () => timelineView?.handleRippleDelete());
  document.getElementById("roll-left-btn")?.addEventListener("click", () => timelineView?.handleRoll(-0.25));
  document.getElementById("roll-right-btn")?.addEventListener("click", () => timelineView?.handleRoll(0.25));
  document.getElementById("slide-left-btn")?.addEventListener("click", () => timelineView?.handleSlide(-0.25));
  document.getElementById("slide-right-btn")?.addEventListener("click", () => timelineView?.handleSlide(0.25));
  document.getElementById("transition-btn")?.addEventListener("click", () => timelineView?.handleTransition(0.5));
}

/** カラー調整 UI */
function initColorControls() {
  const applyColor = (partial) => {
    const info = getSelectedClipInfo();
    if (!info || !state.timeline) return;
    setClipEffects(state.timeline, info.clip.id, partial);
    syncColorSliders();
    previewEngine?.seekToTimelineTime(state.timelinePlayhead).catch(() => {});
    refreshReencodeUi();
  };

  const bindSlider = (input, valueEl, key) => {
    input?.addEventListener("input", () => {
      if (valueEl) valueEl.textContent = input.value;
      applyColor({ [key]: Number(input.value) });
    });
  };

  bindSlider(colorBrightnessInput, colorBrightnessValue, "brightness");
  bindSlider(colorContrastInput, colorContrastValue, "contrast");
  bindSlider(colorSaturationInput, colorSaturationValue, "saturation");

  document.getElementById("color-preset-reset")?.addEventListener("click", () => {
    applyColor({ brightness: 0, contrast: 0, saturation: 0 });
  });
  document.getElementById("color-preset-vivid")?.addEventListener("click", () => {
    applyColor({ brightness: 5, contrast: 10, saturation: 35 });
  });
  document.getElementById("color-preset-muted")?.addEventListener("click", () => {
    applyColor({ brightness: -5, contrast: -10, saturation: -25 });
  });
}

/** PiP インスペクター */
function initPipControls() {
  const applyPip = (partial) => {
    const info = getSelectedClipInfo();
    if (!info || info.track.id !== "v2" || !state.timeline) return;
    setClipEffects(state.timeline, info.clip.id, { pip: partial });
    syncPipSliders();
    previewEngine?.seekToTimelineTime(state.timelinePlayhead).catch(() => {});
    refreshReencodeUi();
  };

  pipXInput?.addEventListener("input", () => {
    if (pipXValue) pipXValue.textContent = pipXInput.value;
    applyPip({ x: Number(pipXInput.value) / 100 });
  });
  pipYInput?.addEventListener("input", () => {
    if (pipYValue) pipYValue.textContent = pipYInput.value;
    applyPip({ y: Number(pipYInput.value) / 100 });
  });
  pipScaleInput?.addEventListener("input", () => {
    if (pipScaleValue) pipScaleValue.textContent = pipScaleInput.value;
    applyPip({ scale: Number(pipScaleInput.value) / 100 });
  });
  pipOpacityInput?.addEventListener("input", () => {
    if (pipOpacityValue) pipOpacityValue.textContent = pipOpacityInput.value;
    applyPip({ opacity: Number(pipOpacityInput.value) / 100 });
  });
}

/** タイムラインズーム */
function initTimelineZoom() {
  document.getElementById("timeline-zoom-in")?.addEventListener("click", () => zoomTimelineAt(0.5, 0.75));
  document.getElementById("timeline-zoom-out")?.addEventListener("click", () => zoomTimelineAt(0.5, 1.35));
  document.getElementById("timeline-zoom-fit")?.addEventListener("click", () => {
    resetTimelineZoom();
    timelineView?.render();
  });
  multiTrackEl?.addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = multiTrackEl.getBoundingClientRect();
      const focusRatio = clamp((event.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
      zoomTimelineAt(focusRatio, event.deltaY > 0 ? 1.2 : 0.833);
    },
    { passive: false }
  );
}

/** D&D ヘルパー */
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
    el.classList.add("ve-drop-zone--active");
  });
  el.addEventListener("dragover", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    el.classList.add("ve-drop-zone--active");
  });
  el.addEventListener("dragleave", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    const related = event.relatedTarget;
    if (related instanceof Node && el.contains(related)) return;
    el.classList.remove("ve-drop-zone--active");
  });
  el.addEventListener("drop", (event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    el.classList.remove("ve-drop-zone--active");
    const file = filesFromDataTransfer(event.dataTransfer)[0];
    if (!file) return;
    if (file.type.startsWith("video/") || /\.(mp4|webm|avi|mov|mkv|wmv|mpeg|mpg|3gp|m4v)$/i.test(file.name)) {
      importVideoFile(file).catch((err) => alert(err instanceof Error ? err.message : "動画の読み込みに失敗しました"));
      return;
    }
    if (file.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file.name)) {
      loadAudioFile(file).catch((err) => alert(err instanceof Error ? err.message : "音声の読み込みに失敗しました"));
    }
  });
  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInput?.click();
    }
  });

  document.getElementById("select-file-btn")?.addEventListener("click", (event) => {
    event.stopPropagation();
    fileInput?.click();
  });
}

/** イベント登録 */
function bindEvents() {
  bindDropZone(dropZone);
  bindDropZone(editorView);

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (file) importVideoFile(file).catch((err) => alert(err instanceof Error ? err.message : "動画の読み込みに失敗しました"));
    fileInput.value = "";
  });

  document.getElementById("add-video-btn")?.addEventListener("click", () => {
    fileInput?.click();
  });

  playBtn?.addEventListener("click", togglePlay);
  document.getElementById("exit-btn")?.addEventListener("click", () => resetEditor(true));

  inverseToggle?.addEventListener("change", () => {
    state.inverse = inverseToggle.checked;
    refreshReencodeUi();
  });

  startTimeInput?.addEventListener("change", () => {
    const parsed = parseTimeInput(startTimeInput.value);
    if (parsed === null) return;
    if (state.timeline && isMultiClipTimeline(state.timeline) && state.selectedClipId) {
      commitEdit(() => {
        const vTrack = state.timeline.tracks.find((t) => t.id === "v1");
        const clip = vTrack?.clips.find((c) => c.id === state.selectedClipId);
        if (!clip) return;
        const delta = parsed - clip.sourceIn;
        trimClipStart(state.timeline, "v1", clip.id, delta);
      });
      return;
    }
    state.startTime = parsed;
    syncTrimState();
  });
  endTimeInput?.addEventListener("change", () => {
    const parsed = parseTimeInput(endTimeInput.value);
    if (parsed === null) return;
    if (state.timeline && isMultiClipTimeline(state.timeline) && state.selectedClipId) {
      commitEdit(() => {
        const vTrack = state.timeline.tracks.find((t) => t.id === "v1");
        const clip = vTrack?.clips.find((c) => c.id === state.selectedClipId);
        if (!clip) return;
        const delta = parsed - clip.sourceOut;
        trimClipEnd(state.timeline, "v1", clip.id, delta);
      });
      return;
    }
    state.endTime = parsed;
    syncTrimState();
  });

  preview?.addEventListener("timeupdate", () => {
    if (isPlaying) return;
    previewEngine?.onVideoTimeUpdate();
    updateTimelineUi();
  });
  preview?.addEventListener("play", () => {
    isPlaying = true;
    playBtn?.classList.add("is-playing");
    playBtn?.querySelector(".ve-play-icon")?.setAttribute("hidden", "");
    playBtn?.querySelector(".ve-pause-icon")?.removeAttribute("hidden");
  });
  preview?.addEventListener("pause", () => {
    if (!bgmPreview || bgmPreview.paused) isPlaying = false;
    playBtn?.classList.remove("is-playing");
    playBtn?.querySelector(".ve-play-icon")?.removeAttribute("hidden");
    playBtn?.querySelector(".ve-pause-icon")?.setAttribute("hidden", "");
  });

  window.addEventListener("resize", () => {
    previewEngine?.resize();
  });

  document.querySelectorAll(".ve-rotate-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.rotation = Number(btn.getAttribute("data-rotation")) || 0;
      document.querySelectorAll(".ve-rotate-btn").forEach((b) => {
        b.classList.toggle("ve-rotate-btn--active", b === btn);
      });
      applyPreviewTransform();
      refreshReencodeUi();
    });
  });

  document.getElementById("flip-h")?.addEventListener("change", (e) => {
    state.flipH = /** @type {HTMLInputElement} */ (e.target).checked;
    applyPreviewTransform();
    refreshReencodeUi();
  });
  document.getElementById("flip-v")?.addEventListener("change", (e) => {
    state.flipV = /** @type {HTMLInputElement} */ (e.target).checked;
    applyPreviewTransform();
    refreshReencodeUi();
  });

  document.getElementById("crop-enabled")?.addEventListener("change", (e) => {
    state.cropEnabled = /** @type {HTMLInputElement} */ (e.target).checked;
    updateCropOverlay();
    refreshReencodeUi();
  });
  aspectSelect?.addEventListener("change", () => {
    state.aspectRatio = aspectSelect.value;
    if (state.aspectRatio !== "free" && state.videoWidth && state.videoHeight) {
      const [aw, ah] = state.aspectRatio.split(":").map(Number);
      const targetRatio = aw / ah;
      const videoRatio = state.videoWidth / state.videoHeight;
      let w = 1;
      let h = 1;
      if (videoRatio > targetRatio) {
        w = targetRatio / videoRatio;
        h = 1;
      } else {
        w = 1;
        h = videoRatio / targetRatio;
      }
      state.crop = { x: (1 - w) / 2, y: (1 - h) / 2, w, h };
    }
    updateCropOverlay();
  });

  volumeInput?.addEventListener("input", () => {
    state.volume = Number(volumeInput.value);
    volumeValue.textContent = volumeInput.value;
    preview.volume = Math.min(1, state.volume / 100);
    refreshReencodeUi();
  });
  speedInput?.addEventListener("input", () => {
    state.speed = Number(speedInput.value);
    speedValue.textContent = speedInput.value;
    preview.playbackRate = state.speed / 100;
    refreshReencodeUi();
  });
  document.getElementById("fade-in")?.addEventListener("change", (e) => {
    state.fadeIn = Number(/** @type {HTMLInputElement} */ (e.target).value) || 0;
    refreshReencodeUi();
  });
  document.getElementById("fade-out")?.addEventListener("change", (e) => {
    state.fadeOut = Number(/** @type {HTMLInputElement} */ (e.target).value) || 0;
    refreshReencodeUi();
  });

  formatSelect?.addEventListener("change", () => {
    state.outputFormat = formatSelect.value;
    if (formatPickerLabel) {
      formatPickerLabel.textContent = formatSelect.value === "webm" ? "WebM" : "MP4";
    }
    refreshReencodeUi();
  });
  qualityInput?.addEventListener("input", () => {
    state.quality = Number(qualityInput.value);
    qualityValue.textContent = qualityInput.value;
  });
  noReencodeInput?.addEventListener("change", () => {
    state.noReencode = noReencodeInput.checked;
    refreshReencodeUi();
  });

  exportBtn?.addEventListener("click", () => {
    handleExport().catch((err) => alert(err instanceof Error ? err.message : "書き出し失敗"));
  });
  document.getElementById("reset-edits-btn")?.addEventListener("click", () => {
    if (!projectHasVideo() || state.duration <= 0) return;
    state.rotation = 0;
    state.flipH = false;
    state.flipV = false;
    state.cropEnabled = false;
    state.texts = [];
    state.activeTextId = null;
    state.volume = 100;
    state.speed = 100;
    state.fadeIn = 0;
    state.fadeOut = 0;
    state.crop = { x: 0, y: 0, w: 1, h: 1 };
    state.startTime = 0;
    state.endTime = state.duration;
    state.slipOffset = 0;
    state.audioLinked = true;
    state.inverse = false;
    if (inverseToggle) inverseToggle.checked = false;
    document.querySelectorAll(".ve-rotate-btn").forEach((btn) => {
      btn.classList.toggle("ve-rotate-btn--active", btn.getAttribute("data-rotation") === "0");
    });
    document.getElementById("crop-enabled").checked = false;
    document.getElementById("flip-h").checked = false;
    document.getElementById("flip-v").checked = false;
    volumeInput.value = "100";
    volumeValue.textContent = "100";
    speedInput.value = "100";
    speedValue.textContent = "100";
    preview.volume = 1;
    preview.playbackRate = 1;
    applyPreviewTransform();
    renderTexts();
    updateCropOverlay();
    syncTrimState();
  });

  document.getElementById("cloud-load-btn")?.addEventListener("click", openCloudLoad);
  document.getElementById("cloud-load-btn-landing")?.addEventListener("click", openCloudLoad);
  cloudSaveBtn?.addEventListener("click", openCloudSave);

  undoBtn?.addEventListener("click", handleUndo);
  redoBtn?.addEventListener("click", handleRedo);

  document.getElementById("add-audio-btn")?.addEventListener("click", () => {
    audioFileInput?.click();
  });
  audioFileInput?.addEventListener("change", () => {
    const file = audioFileInput.files?.[0];
    if (file) loadAudioFile(file).catch((err) => alert(err instanceof Error ? err.message : "音声の読み込みに失敗しました"));
    audioFileInput.value = "";
  });

  bgmVolumeInput?.addEventListener("input", () => {
    state.bgmVolume = Number(bgmVolumeInput.value);
    if (bgmVolumeValue) bgmVolumeValue.textContent = bgmVolumeInput.value;
    if (bgmPreview) bgmPreview.volume = Math.min(1, state.bgmVolume / 100);
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }
    if (!projectHasVideo()) return;

    const mod = event.ctrlKey || event.metaKey;
    if (mod && event.key.toLowerCase() === "z" && !event.shiftKey) {
      event.preventDefault();
      handleUndo();
      return;
    }
    if (mod && (event.key.toLowerCase() === "z" && event.shiftKey || event.key.toLowerCase() === "y")) {
      event.preventDefault();
      handleRedo();
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      togglePlay();
    } else if (event.key.toLowerCase() === "t") {
      setActiveTool("trim");
    } else if (event.key.toLowerCase() === "b") {
      event.preventDefault();
      timelineView?.handleBlade();
    } else if (event.key.toLowerCase() === "i") {
      if (state.timeline && isMultiClipTimeline(state.timeline)) return;
      state.startTime = clamp(preview.currentTime, 0, state.endTime - 0.1);
      syncTrimState();
    } else if (event.key.toLowerCase() === "o") {
      if (state.timeline && isMultiClipTimeline(state.timeline)) return;
      state.endTime = clamp(preview.currentTime, state.startTime + 0.1, state.duration);
      syncTrimState();
    } else if (["j", "k", "l", "J", "K", "L", ",", "."].includes(event.key)) {
      event.preventDefault();
      handleJklTransport(preview, state, event.key, patchState);
      updateTimelineUi();
    }
  });

  for (const eventName of ["dragenter", "dragover", "drop"]) {
    document.addEventListener(eventName, (event) => event.preventDefault());
  }
}

/** クラウドモーダル初期化 */
function initCloudModals() {
  const saveDialog = document.getElementById("ve-cloud-save-dialog");
  const openDialog = document.getElementById("ve-cloud-open-dialog");
  if (saveDialog instanceof HTMLDialogElement) {
    cloudSaveModal = createCloudSaveModal(saveDialog, {
      idPrefix: "ve-cloud-save",
      loginNext: "/apps/video-editor/",
    });
  }
  if (openDialog instanceof HTMLDialogElement) {
    cloudOpenModal = createCloudOpenModal(openDialog, {
      idPrefix: "ve-cloud-open",
      loginNext: "/apps/video-editor/",
    });
  }
}

/** 起動 */
initSelects();
initToolbar();
initTextTool();
initFormatPicker();
initTimeSteppers();
initDualTimeline();
initPreviewEngine();
initTimelineView();
initNleButtons();
initColorControls();
initPipControls();
initTimelineZoom();
bindEvents();
initCloudModals();

if (previewWrap instanceof HTMLElement) {
  cropOverlay = initCropOverlay(
    previewWrap,
    () => state.crop,
    (crop) => {
      state.crop = crop;
      refreshReencodeUi();
    },
    () => state.cropEnabled && projectHasVideo()
  );
}
qualityValue.textContent = qualityInput.value;
setActiveTool("cut");

const allowed =
  /** @type {Window & { __VE_E2E__?: boolean }} */ (window).__VE_E2E__ === true ||
  (await checkAccess());

if (allowed) {
  showEmptyEditor();
  const storagePath = new URLSearchParams(location.search).get("storagePath")?.trim();
  if (storagePath) {
    openFromStoragePath(storagePath).catch((error) => {
      alert(error instanceof Error ? error.message : "クラウドからの読み込みに失敗しました");
    });
  }
}
