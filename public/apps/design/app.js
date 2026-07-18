/**
 * 設計アプリ — シンプルな図面エディタ
 */

import { createCloudSaveModal } from "../../js/cloud-save-modal.js";
import { apiRequest, fetchDownloadBlob } from "../cloud-storage/js/api.js";

const APP_SLUG = "design";
const AUTOSAVE_MS = 1500;
const GRID_SIZE = 20;
const ANGLE_SNAP = Math.PI / 4; // 45°
/** 角度スナップの許容範囲（±度） */
const ANGLE_SNAP_TOLERANCE_DEG = 3;
const ANGLE_SNAP_TOLERANCE = (ANGLE_SNAP_TOLERANCE_DEG * Math.PI) / 180;
const SQUARE_TOLERANCE = 0.2;
const RATIO_12_MIN = 1.6;
const RATIO_12_MAX = 2.4;
/** 画面上の線の太さ（px）— ズームしても一定 */
const STROKE_SCREEN_PX = 1.5;
const HIT_SCREEN_PX = 10;
/** 端点スナップの許容距離（画面上の px） */
const ENDPOINT_SNAP_SCREEN_PX = 12;
/** 画面上の文字サイズ（px）— ズームしても一定 */
const TEXT_SCREEN_PX = 14;
const TEXT_SIZE_MIN = 8;
const TEXT_SIZE_MAX = 48;
const MIN_VIEW_SCALE = 0.1;
const MAX_VIEW_SCALE = 20;

const constraintHintEl = document.getElementById("constraint-hint");
const zoomLabelEl = document.getElementById("zoom-label");

/** ビュー変換（図面座標 ↔ 画面） */
let viewScale = 1;
let viewPanX = 0;
let viewPanY = 0;
let panDrag = null;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("design-canvas");
const ctx = canvas.getContext("2d");

const loadingEl = document.getElementById("app-loading");
const deniedEl = document.getElementById("access-denied");
const listView = document.getElementById("list-view");
const editorView = document.getElementById("editor-view");
const projectListEl = document.getElementById("project-list");
const listEmptyEl = document.getElementById("list-empty");
const titleInput = document.getElementById("project-title");
const saveStatusEl = document.getElementById("save-status");
const versionsPanel = document.getElementById("versions-panel");
const versionListEl = document.getElementById("version-list");
const propertiesPanel = document.getElementById("properties-panel");
const propertiesBody = document.getElementById("properties-body");
const cloudDestLabelEl = document.getElementById("cloud-dest-label");
const textInputEl = document.getElementById("design-text-input");

/** @type {{ id: string, title: string, scene: object, current_version_id: string | null } | null} */
let currentProject = null;
/** @type {Array<object>} */
let elements = [];
let selectedIds = new Set();
let currentTool = "select";
let isDirty = false;
let autosaveTimer = null;
let isSaving = false;

let dragState = null;
const MAX_UNDO = 60;
/** @type {Array<object[]>} */
let undoStack = [];
/** @type {Array<object[]>} */
let redoStack = [];
let historySuspended = false;
/** @type {{ x: number, y: number } | null} */
let hoverSnap = null;
/** @type {{ elementId: string | null, x: number, y: number, isNew: boolean } | null} */
let textEditState = null;
let suppressTextBlurCommit = false;

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });
  if (response.status === 401) {
    window.location.href =
      "/login/?next=" + encodeURIComponent(`/apps/${APP_SLUG}/`);
    return false;
  }
  if (!response.ok) {
    deniedEl.hidden = false;
    loadingEl.hidden = true;
    return false;
  }
  return true;
}

/** API リクエスト */
async function api(path, options = {}) {
  const response = await fetch(`/api/design${path}`, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "リクエストに失敗しました");
  }
  return data;
}

/** 一意 ID を生成 */
function uid() {
  return `el_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** 日時を表示用に整形 */
function formatDate(ts) {
  return new Date(ts).toLocaleString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** 現在のシーンオブジェクト */
function getScene() {
  return {
    version: 2,
    width: canvas.width,
    height: canvas.height,
    view: { scale: viewScale, panX: viewPanX, panY: viewPanY },
    elements: structuredClone(elements),
  };
}

/** ビューを読み込む */
function loadView(view) {
  if (!view || typeof view !== "object") {
    resetView();
    return;
  }
  viewScale = clampViewScale(Number(view.scale) || 1);
  viewPanX = Number(view.panX) || 0;
  viewPanY = Number(view.panY) || 0;
}

function clampViewScale(scale) {
  return Math.min(MAX_VIEW_SCALE, Math.max(MIN_VIEW_SCALE, scale));
}

/** ビューを全体表示にリセット */
function resetView() {
  viewScale = 1;
  viewPanX = 0;
  viewPanY = 0;
}

/** ズーム表示を更新 */
function updateZoomUI() {
  if (zoomLabelEl) {
    zoomLabelEl.textContent = `${Math.round(viewScale * 100)}%`;
  }
}

/** 画面上の1px相当の図面単位 */
function screenPxToWorld(px = 1) {
  return px / viewScale;
}

/** ビュー変換を適用 */
function applyViewTransform(c = ctx) {
  c.setTransform(viewScale, 0, 0, viewScale, viewPanX, viewPanY);
}

/** 画面座標 → 図面座標 */
function screenToWorld(screenX, screenY) {
  return {
    x: (screenX - viewPanX) / viewScale,
    y: (screenY - viewPanY) / viewScale,
  };
}

/** カーソル位置の画面座標 */
function screenPoint(evt) {
  return screenPointFromClient(evt.clientX, evt.clientY);
}

/** client 座標からキャンバス上の画面座標へ */
function screenPointFromClient(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 0, y: 0 };
  }
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

/** 中ボタンドラッグでビューを移動 */
function onPanMove(evt) {
  if (!panDrag) return;
  const screen = screenPointFromClient(evt.clientX, evt.clientY);
  viewPanX = panDrag.panX + (screen.x - panDrag.startX);
  viewPanY = panDrag.panY + (screen.y - panDrag.startY);
  render();
}

/** 中ボタンパンを終了 */
function endPanDrag() {
  if (!panDrag) return;
  panDrag = null;
  document.removeEventListener("mousemove", onPanMove);
  document.removeEventListener("mouseup", onPanUp);
  canvas.classList.remove("design-canvas--panning");
}

/** 中ボタンを離したとき */
function onPanUp(evt) {
  if (evt.button !== 1) return;
  endPanDrag();
}

/** 中ボタン押下でパン開始 */
function startPanDrag(evt) {
  evt.preventDefault();
  const screen = screenPoint(evt);
  panDrag = { startX: screen.x, startY: screen.y, panX: viewPanX, panY: viewPanY };
  canvas.classList.add("design-canvas--panning");
  document.addEventListener("mousemove", onPanMove);
  document.addEventListener("mouseup", onPanUp);
}

/** カーソル位置でズーム */
function zoomAt(screenX, screenY, factor) {
  const world = screenToWorld(screenX, screenY);
  viewScale = clampViewScale(viewScale * factor);
  viewPanX = screenX - world.x * viewScale;
  viewPanY = screenY - world.y * viewScale;
  render();
}

/** 表示中キャンバスの中心（画面座標） */
function canvasCenterScreenPoint() {
  const rect = canvas.getBoundingClientRect();
  return screenPointFromClient(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

/** ホイールでズーム（カーソル位置を基準） */
function handleWheelZoom(evt) {
  if (editorView?.hidden) return;

  const rect = canvas.getBoundingClientRect();
  if (
    evt.clientX < rect.left ||
    evt.clientX > rect.right ||
    evt.clientY < rect.top ||
    evt.clientY > rect.bottom
  ) {
    return;
  }

  evt.preventDefault();
  evt.stopPropagation();

  let delta = evt.deltaY;
  if (evt.deltaMode === 1) delta *= 16;
  else if (evt.deltaMode === 2) delta *= 100;

  const factor = Math.exp(-delta * 0.0015);
  const screen = screenPointFromClient(evt.clientX, evt.clientY);
  zoomAt(screen.x, screen.y, factor);
}

/** シーンを読み込む */
function loadScene(scene, { silent = false } = {}) {
  const raw = Array.isArray(scene?.elements) ? scene.elements : [];
  elements = raw.map(normalizeLegacyElement);
  loadView(scene?.view);
  clearSelection();
  closeTextEditor(false);
  undoStack = [];
  redoStack = [];
  updateDeleteBtn();
  render();
  if (!silent) markDirty();
}

/** 要素から描画用プロパティを正規化（線幅は保存しない） */
function stripStrokeWidth(el) {
  if (!el || typeof el !== "object") return el;
  const next = { ...el };
  delete next.strokeWidth;
  return next;
}

/** 旧形式の要素を線分ベースに正規化 */
function normalizeLegacyElement(el) {
  if (!el || typeof el !== "object") return stripStrokeWidth(el);
  if (el.type === "polyline" && Array.isArray(el.points)) {
    return stripStrokeWidth(el);
  }
  if (el.type === "line") return stripStrokeWidth(el);
  if (el.type === "text") {
    const next = stripStrokeWidth(el);
    if (!next.writingMode) next.writingMode = "horizontal";
    return next;
  }

  if (el.type === "rect") {
    const x = el.x ?? 0;
    const y = el.y ?? 0;
    const w = el.width ?? 0;
    const h = el.height ?? 0;
    return stripStrokeWidth({
      id: el.id,
      type: "polyline",
      stroke: el.stroke,
      closed: true,
      points: [
        { x, y },
        { x: x + w, y },
        { x: x + w, y: y + h },
        { x, y: y + h },
      ],
    });
  }

  if (el.type === "ellipse") {
    const cx = el.cx ?? 0;
    const cy = el.cy ?? 0;
    const rx = Math.abs(el.rx ?? 0);
    const ry = Math.abs(el.ry ?? 0);
    const pts = [];
    const steps = 24;
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
    }
    return stripStrokeWidth({
      id: el.id,
      type: "polyline",
      stroke: el.stroke,
      closed: true,
      points: pts,
    });
  }

  return stripStrokeWidth(el);
}

/** 直線の終点を 0°/45°/90°… にスナップ（±3°以内のみ） */
function snapLineEnd(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return { x: x2, y: y2 };
  const angle = Math.atan2(dy, dx);
  const nearest = Math.round(angle / ANGLE_SNAP) * ANGLE_SNAP;
  let diff = angle - nearest;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  if (Math.abs(diff) > ANGLE_SNAP_TOLERANCE) {
    return { x: x2, y: y2 };
  }
  return {
    x: x1 + Math.cos(nearest) * len,
    y: y1 + Math.sin(nearest) * len,
  };
}

/** 軸平行四角形の4頂点 */
function rectPoints(x1, y1, w, h) {
  return [
    { x: x1, y: y1 },
    { x: x1 + w, y: y1 },
    { x: x1 + w, y: y1 + h },
    { x: x1, y: y1 + h },
  ];
}

/** 四角形を正方形 / 1:2 / 通常に補正 */
function constrainRectCorners(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const absW = Math.abs(dx);
  const absH = Math.abs(dy);
  const signX = Math.sign(dx) || 1;
  const signY = Math.sign(dy) || 1;
  let w = dx;
  let h = dy;

  if (absW > 4 && absH > 4) {
    const diff = Math.abs(absW - absH) / Math.max(absW, absH);
    if (diff < SQUARE_TOLERANCE) {
      const side = Math.max(absW, absH);
      w = side * signX;
      h = side * signY;
      return { points: rectPoints(x1, y1, w, h), mode: "正方形" };
    }

    const ratio = absW / absH;
    if (ratio >= RATIO_12_MIN && ratio <= RATIO_12_MAX) {
      h = (absW / 2) * signY;
      return { points: rectPoints(x1, y1, w, h), mode: "1:2 長方形" };
    }
    const invRatio = absH / absW;
    if (invRatio >= RATIO_12_MIN && invRatio <= RATIO_12_MAX) {
      w = (absH / 2) * signX;
      return { points: rectPoints(x1, y1, w, h), mode: "1:2 長方形" };
    }
  }

  return { points: rectPoints(x1, y1, w, h), mode: "四角形" };
}

/** 補正ヒントを更新 */
function updateConstraintHint(shiftKey, mode = "") {
  if (!constraintHintEl) return;
  if (shiftKey) {
    constraintHintEl.textContent = "Shift: 補正なし（自由描画）";
    constraintHintEl.classList.add("design-constraint-hint--free");
    return;
  }
  constraintHintEl.classList.remove("design-constraint-hint--free");
  if (mode) {
    constraintHintEl.textContent = `補正: ${mode}`;
    return;
  }
  const hints = {
    line: "直線: 端点スナップ · 0°/45°/90°（±3°）",
    rect: "四角: 正方形 / 1:2 長方形を自動判定",
    text: "クリックで文字を配置 · 既存テキストをクリックで編集",
    select: "クリックで選択 · ドラッグで範囲選択 · Shiftで複数選択",
  };
  constraintHintEl.textContent = hints[currentTool] || hints.select;
}

/** 履歴用スナップショット */
function snapshotElements() {
  return structuredClone(elements);
}

/** 操作前に履歴を記録 */
function pushHistory() {
  if (historySuspended) return;
  undoStack.push(snapshotElements());
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack = [];
}

/** 元に戻す */
function undo() {
  if (!undoStack.length) return;
  historySuspended = true;
  redoStack.push(snapshotElements());
  elements = undoStack.pop();
  clearSelection();
  render();
  historySuspended = false;
  markDirty();
  saveStatusEl.textContent = "元に戻しました";
}

/** やり直す */
function redo() {
  if (!redoStack.length) return;
  historySuspended = true;
  undoStack.push(snapshotElements());
  elements = redoStack.pop();
  clearSelection();
  render();
  historySuspended = false;
  markDirty();
  saveStatusEl.textContent = "やり直しました";
}

/** 選択をクリア */
function clearSelection() {
  selectedIds.clear();
  updateDeleteBtn();
  updatePropertiesPanel();
}

/** 選択を設定 */
function setSelection(ids) {
  selectedIds = new Set(ids);
  updateDeleteBtn();
  updatePropertiesPanel();
}

/** 選択をトグル */
function toggleSelection(id) {
  if (selectedIds.has(id)) selectedIds.delete(id);
  else selectedIds.add(id);
  updateDeleteBtn();
  updatePropertiesPanel();
}

/** 範囲内の要素 ID を取得 */
function elementsInBox(x1, y1, x2, y2) {
  const left = Math.min(x1, x2);
  const right = Math.max(x1, x2);
  const top = Math.min(y1, y2);
  const bottom = Math.max(y1, y2);

  return elements
    .filter((el) => {
      const b = getElementBounds(el);
      if (!b) return false;
      const bw = Math.max(b.w, screenPxToWorld(1));
      const bh = Math.max(b.h, screenPxToWorld(1));
      return !(b.x + bw < left || b.x > right || b.y + bh < top || b.y > bottom);
    })
    .map((el) => el.id);
}

/** 要素を平行移動（ベース状態から） */
function translateElementFromBase(el, base, dx, dy) {
  if (el.type === "line" && base.type === "line") {
    el.x1 = base.x1 + dx;
    el.y1 = base.y1 + dy;
    el.x2 = base.x2 + dx;
    el.y2 = base.y2 + dy;
  } else if (el.type === "polyline" && Array.isArray(base.points)) {
    el.points = base.points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
  } else if (el.type === "rect") {
    el.x = base.x + dx;
    el.y = base.y + dy;
  } else if (el.type === "text" && base.type === "text") {
    el.x = base.x + dx;
    el.y = base.y + dy;
  }
}

/** 範囲選択ボックスを描画 */
function drawSelectionBox(x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = "#0ea5e9";
  ctx.fillStyle = "rgba(14, 165, 233, 0.08)";
  ctx.lineWidth = screenPxToWorld(1);
  ctx.setLineDash([screenPxToWorld(4), screenPxToWorld(3)]);
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.restore();
}

/** 選択中の要素を削除 */
function deleteSelected() {
  if (!selectedIds.size) return;
  pushHistory();
  elements = elements.filter((el) => !selectedIds.has(el.id));
  clearSelection();
  render();
  markDirty();
}

/** Ctrl+S 保存 */
async function handleSaveShortcut() {
  if (!currentProject) return;
  if (currentProject.cloud_storage_path) {
    await saveToCloud();
    return;
  }
  await saveVersion(false);
}

/** キーボード入力がエディタ向けか */
function isEditorShortcutTarget(target) {
  if (!editorView || editorView.hidden) return false;
  if (!(target instanceof HTMLElement)) return true;
  if (target === titleInput || target === textInputEl) return false;
  const tag = target.tagName;
  return tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT";
}

/** グリッドを描画（図面座標、線幅は画面一定） */
function drawGrid() {
  ctx.save();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = screenPxToWorld(1);
  for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

/** 要素を描画（CAD風: 線分のみ・ヘアライン） */
function getTextFontSize(el) {
  const size = Number(el.fontSize) || TEXT_SCREEN_PX;
  return Math.min(TEXT_SIZE_MAX, Math.max(TEXT_SIZE_MIN, size));
}

/** テキストの書字方向 */
function getTextWritingMode(el) {
  return el.writingMode === "vertical" ? "vertical" : "horizontal";
}

/** テキスト要素のフォントを設定 */
function applyTextFont(el, c = ctx) {
  const fontSizeWorld = screenPxToWorld(getTextFontSize(el));
  c.font = `${fontSizeWorld}px Inter, system-ui, sans-serif`;
  c.textBaseline = "top";
  c.textAlign = "left";
}

/** テキストを描画 */
function drawTextContent(c, el, viewScaleForStroke = viewScale) {
  applyTextFont(el, c);
  c.fillStyle = el.stroke || "#1e293b";
  const fontSizeWorld =
    viewScaleForStroke === viewScale
      ? screenPxToWorld(getTextFontSize(el))
      : getTextFontSize(el) / viewScaleForStroke;
  const lineHeight = fontSizeWorld * 1.25;
  const charAdvance = fontSizeWorld * 1.1;
  const text = String(el.text || "");

  if (getTextWritingMode(el) === "vertical") {
    const columns = text.split("\n");
    columns.forEach((column, colIndex) => {
      const colX = el.x - colIndex * charAdvance;
      let y = el.y;
      for (const char of column) {
        c.fillText(char, colX, y);
        y += lineHeight;
      }
    });
    return;
  }

  text.split("\n").forEach((line, i) => {
    c.fillText(line, el.x, el.y + i * lineHeight);
  });
}

/** テキスト要素のバウンディングボックス */
function getTextElementBounds(el) {
  ctx.save();
  applyViewTransform(ctx);
  applyTextFont(el);
  const fontSizeWorld = screenPxToWorld(getTextFontSize(el));
  const lineHeight = fontSizeWorld * 1.25;
  const charAdvance = fontSizeWorld * 1.1;
  const text = String(el.text || " ");

  if (getTextWritingMode(el) === "vertical") {
    const columns = text.split("\n");
    const colCount = Math.max(1, columns.length);
    let maxLen = 1;
    for (const col of columns) {
      maxLen = Math.max(maxLen, col.length || 1);
    }
    const w = colCount * charAdvance;
    const h = maxLen * lineHeight;
    ctx.restore();
    return {
      x: el.x - (colCount - 1) * charAdvance,
      y: el.y,
      w,
      h,
    };
  }

  const lines = text.split("\n");
  let maxWidth = screenPxToWorld(8);
  for (const line of lines) {
    maxWidth = Math.max(maxWidth, ctx.measureText(line || " ").width);
  }
  const h = Math.max(lineHeight, lines.length * lineHeight);
  ctx.restore();
  return { x: el.x, y: el.y, w: maxWidth, h };
}

/** 編集中テキストのプレビュー用オブジェクト */
function getTextDraftElement() {
  if (!textEditState || !textInputEl || textInputEl.hidden) return null;
  const text = textInputEl.value;
  if (!text) return null;
  const existing = textEditState.elementId
    ? elements.find((e) => e.id === textEditState.elementId)
    : null;
  return {
    type: "text",
    x: textEditState.x,
    y: textEditState.y,
    text,
    stroke: existing?.stroke || document.getElementById("stroke-color").value,
    fontSize: existing ? getTextFontSize(existing) : TEXT_SCREEN_PX,
    writingMode: existing ? getTextWritingMode(existing) : "horizontal",
  };
}

/** 図面座標を画面上の client 座標へ */
function worldToClient(x, y) {
  const rect = canvas.getBoundingClientRect();
  const screenX = x * viewScale + viewPanX;
  const screenY = y * viewScale + viewPanY;
  return {
    left: rect.left + (screenX / canvas.width) * rect.width,
    top: rect.top + (screenY / canvas.height) * rect.height,
  };
}

/** キャンバス表示に合わせた CSS フォントサイズ */
function textCssFontSize() {
  const rect = canvas.getBoundingClientRect();
  return getTextFontSize({}) * (rect.height / canvas.height);
}

/** テキスト入力欄のサイズを内容に合わせる */
function autoResizeTextInput() {
  if (!textInputEl) return;
  textInputEl.style.height = "auto";
  textInputEl.style.width = "auto";
  textInputEl.style.height = `${textInputEl.scrollHeight}px`;
  textInputEl.style.width = `${Math.max(80, textInputEl.scrollWidth + 4)}px`;
}

/** テキスト入力欄の位置を更新 */
function updateTextInputPosition() {
  if (!textEditState || !textInputEl || textInputEl.hidden) return;
  const stroke =
    (textEditState.elementId &&
      elements.find((e) => e.id === textEditState.elementId)?.stroke) ||
    document.getElementById("stroke-color").value;
  const pos = worldToClient(textEditState.x, textEditState.y);
  textInputEl.style.left = `${pos.left}px`;
  textInputEl.style.top = `${pos.top}px`;
  textInputEl.style.fontSize = `${textCssFontSize()}px`;
  textInputEl.style.lineHeight = "1.25";
  textInputEl.style.color = stroke;
  autoResizeTextInput();
}

/** テキスト編集を確定 */
function commitTextEditor() {
  if (!textEditState || !textInputEl) return;

  const value = textInputEl.value;
  const state = textEditState;
  textEditState = null;
  textInputEl.hidden = true;
  textInputEl.value = "";

  if (!value.trim()) {
    if (!state.isNew && state.elementId) {
      pushHistory();
      elements = elements.filter((el) => el.id !== state.elementId);
      clearSelection();
      markDirty();
    }
    render();
    return;
  }

  const stroke = document.getElementById("stroke-color").value;
  pushHistory();

  if (state.isNew) {
    const el = {
      id: uid(),
      type: "text",
      x: state.x,
      y: state.y,
      text: value,
      stroke,
      fontSize: TEXT_SCREEN_PX,
      writingMode: "horizontal",
    };
    elements.push(el);
    setSelection([el.id]);
  } else {
    const el = elements.find((e) => e.id === state.elementId);
    if (el) {
      el.text = value;
      el.stroke = stroke;
    }
  }

  markDirty();
  render();
}

/** テキスト編集を閉じる */
function closeTextEditor(commit = true) {
  if (!textEditState) {
    if (textInputEl) {
      textInputEl.hidden = true;
      textInputEl.value = "";
    }
    return;
  }
  if (commit) commitTextEditor();
  else {
    textEditState = null;
    textInputEl.hidden = true;
    textInputEl.value = "";
    render();
  }
}

/** クリック位置でテキスト編集を開始 */
function openTextEditorAt(x, y, existingEl = null) {
  if (!textInputEl) return;
  textEditState = {
    elementId: existingEl?.id ?? null,
    x: existingEl?.x ?? x,
    y: existingEl?.y ?? y,
    isNew: !existingEl,
  };
  textInputEl.hidden = false;
  textInputEl.value = existingEl?.text ?? "";
  if (existingEl?.stroke) {
    document.getElementById("stroke-color").value = existingEl.stroke;
  }
  updateTextInputPosition();
  textInputEl.focus();
  if (existingEl?.text) {
    textInputEl.select();
  }
  render();
}

/** 既存編集を確定してから新しいテキスト編集を開始 */
function startTextEditAt(x, y, existingEl = null) {
  if (textEditState) commitTextEditor();
  openTextEditorAt(x, y, existingEl);
}

/** テキスト要素の当たり判定 */
function hitTestTextElement(el, x, y) {
  if (el.type !== "text") return false;
  const b = getTextElementBounds(el);
  const pad = screenPxToWorld(4);
  return x >= b.x - pad && x <= b.x + b.w + pad && y >= b.y - pad && y <= b.y + b.h + pad;
}

function drawElement(el, highlight = false) {
  if (el.type === "text" && textEditState?.elementId === el.id) return;

  ctx.save();
  if (el.type === "text") {
    drawTextContent(ctx, el);
  } else {
  ctx.strokeStyle = el.stroke || "#1e293b";
  ctx.lineWidth = screenPxToWorld(STROKE_SCREEN_PX);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (el.type === "line") {
    ctx.beginPath();
    ctx.moveTo(el.x1, el.y1);
    ctx.lineTo(el.x2, el.y2);
    ctx.stroke();
  } else if (el.type === "polyline" && Array.isArray(el.points) && el.points.length >= 2) {
    ctx.beginPath();
    ctx.moveTo(el.points[0].x, el.points[0].y);
    for (let i = 1; i < el.points.length; i++) {
      ctx.lineTo(el.points[i].x, el.points[i].y);
    }
    if (el.closed) ctx.closePath();
    ctx.stroke();
  } else if (el.type === "rect") {
    const pts = rectPoints(el.x ?? 0, el.y ?? 0, el.width ?? 0, el.height ?? 0);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.stroke();
  }
  }

  if (highlight) {
    const bounds = getElementBounds(el);
    if (bounds) {
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = screenPxToWorld(1);
      const pad = screenPxToWorld(4);
      ctx.setLineDash([screenPxToWorld(4), screenPxToWorld(4)]);
      ctx.strokeRect(bounds.x - pad, bounds.y - pad, bounds.w + pad * 2, bounds.h + pad * 2);
      ctx.setLineDash([]);
    }
  }
  ctx.restore();
}

/** 要素のバウンディングボックス */
function getElementBounds(el) {
  if (el.type === "text") return getTextElementBounds(el);
  if (el.type === "line") {
    const x = Math.min(el.x1, el.x2);
    const y = Math.min(el.y1, el.y2);
    return { x, y, w: Math.abs(el.x2 - el.x1), h: Math.abs(el.y2 - el.y1) };
  }
  if (el.type === "polyline" && Array.isArray(el.points) && el.points.length) {
    const xs = el.points.map((p) => p.x);
    const ys = el.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
  }
  if (el.type === "rect") {
    const w = el.width;
    const h = el.height;
    return {
      x: w < 0 ? el.x + w : el.x,
      y: h < 0 ? el.y + h : el.y,
      w: Math.abs(w),
      h: Math.abs(h),
    };
  }
  return null;
}

/** 点と線分の距離 */
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-6) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/** 要素の線分リストを取得 */
function getElementSegments(el) {
  if (el.type === "line") {
    return [[el.x1, el.y1, el.x2, el.y2]];
  }
  if (el.type === "polyline" && Array.isArray(el.points) && el.points.length >= 2) {
    const segs = [];
    for (let i = 0; i < el.points.length - 1; i++) {
      const a = el.points[i];
      const b = el.points[i + 1];
      segs.push([a.x, a.y, b.x, b.y]);
    }
    if (el.closed && el.points.length > 2) {
      const a = el.points[el.points.length - 1];
      const b = el.points[0];
      segs.push([a.x, a.y, b.x, b.y]);
    }
    return segs;
  }
  if (el.type === "rect") {
    const pts = rectPoints(el.x ?? 0, el.y ?? 0, el.width ?? 0, el.height ?? 0);
    return [
      [pts[0].x, pts[0].y, pts[1].x, pts[1].y],
      [pts[1].x, pts[1].y, pts[2].x, pts[2].y],
      [pts[2].x, pts[2].y, pts[3].x, pts[3].y],
      [pts[3].x, pts[3].y, pts[0].x, pts[0].y],
    ];
  }
  return [];
}

/** キャンバス全体を再描画 */
function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  applyViewTransform();
  drawGrid();
  for (const el of elements) {
    drawElement(el, selectedIds.has(el.id));
  }
  const textDraft = getTextDraftElement();
  if (textDraft) drawTextContent(ctx, textDraft);
  if (dragState?.type === "boxSelect") {
    drawSelectionBox(
      dragState.startX,
      dragState.startY,
      dragState.currentX ?? dragState.startX,
      dragState.currentY ?? dragState.startY
    );
  }
  if (hoverSnap) drawEndpointSnapMarker(hoverSnap.x, hoverSnap.y);
  ctx.restore();

  updateTextInputPosition();
  updateZoomUI();
}

/** サムネイル用 data URL を生成 */
function generateThumbnail() {
  const thumbW = 320;
  const thumbH = 240;
  const off = document.createElement("canvas");
  off.width = thumbW;
  off.height = thumbH;
  const tctx = off.getContext("2d");
  const scale = Math.min(thumbW / canvas.width, thumbH / canvas.height);
  tctx.fillStyle = "#fff";
  tctx.fillRect(0, 0, thumbW, thumbH);
  tctx.save();
  tctx.scale(scale, scale);
  for (const el of elements) {
    drawElementOn(tctx, el, scale);
  }
  tctx.restore();
  return off.toDataURL("image/png", 0.85);
}

/** 指定コンテキストに要素を描画 */
function drawElementOn(c, el, viewScaleForStroke = 1) {
  c.save();
  c.strokeStyle = el.stroke || "#1e293b";
  c.lineWidth = STROKE_SCREEN_PX / viewScaleForStroke;
  c.lineCap = "round";
  c.lineJoin = "round";

  if (el.type === "line") {
    c.beginPath();
    c.moveTo(el.x1, el.y1);
    c.lineTo(el.x2, el.y2);
    c.stroke();
  } else if (el.type === "polyline" && Array.isArray(el.points) && el.points.length >= 2) {
    c.beginPath();
    c.moveTo(el.points[0].x, el.points[0].y);
    for (let i = 1; i < el.points.length; i++) {
      c.lineTo(el.points[i].x, el.points[i].y);
    }
    if (el.closed) c.closePath();
    c.stroke();
  } else if (el.type === "rect") {
    const pts = rectPoints(el.x ?? 0, el.y ?? 0, el.width ?? 0, el.height ?? 0);
    c.beginPath();
    c.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
    c.closePath();
    c.stroke();
  } else if (el.type === "text") {
    drawTextContent(c, el, viewScaleForStroke);
  }
  c.restore();
}

/** キャンバス座標（図面座標）を取得 */
function canvasPoint(evt) {
  const screen = screenPoint(evt);
  return screenToWorld(screen.x, screen.y);
}

/** 要素の端点（頂点）を列挙 */
function getElementEndpoints(el) {
  if (el.type === "line") {
    return [
      { x: el.x1, y: el.y1 },
      { x: el.x2, y: el.y2 },
    ];
  }
  if (el.type === "polyline" && Array.isArray(el.points)) {
    return el.points.map((p) => ({ x: p.x, y: p.y }));
  }
  if (el.type === "rect") {
    return rectPoints(el.x ?? 0, el.y ?? 0, el.width ?? 0, el.height ?? 0);
  }
  return [];
}

/** 近くの既存端点にスナップ（なければそのまま） */
function snapToEndpoint(x, y) {
  const threshold = screenPxToWorld(ENDPOINT_SNAP_SCREEN_PX);
  let best = null;
  let bestDist = threshold;

  for (const el of elements) {
    for (const p of getElementEndpoints(el)) {
      const d = Math.hypot(x - p.x, y - p.y);
      if (d <= bestDist) {
        bestDist = d;
        best = p;
      }
    }
  }

  if (best) return { x: best.x, y: best.y, snapped: true };
  return { x, y, snapped: false };
}

/** 端点スナップ位置のマーカー */
function drawEndpointSnapMarker(x, y) {
  ctx.save();
  ctx.strokeStyle = "#f59e0b";
  ctx.fillStyle = "rgba(245, 158, 11, 0.22)";
  const r = screenPxToWorld(5);
  ctx.lineWidth = screenPxToWorld(1.5);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** 点が要素の線分上か判定 */
function hitTest(x, y) {
  const threshold = screenPxToWorld(HIT_SCREEN_PX);
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (el.type === "text" && hitTestTextElement(el, x, y)) {
      return el.id;
    }
  }
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (el.type === "text") continue;
    const segs = getElementSegments(el);
    for (const [x1, y1, x2, y2] of segs) {
      if (distToSegment(x, y, x1, y1, x2, y2) <= threshold) {
        return el.id;
      }
    }
  }
  return null;
}

/** ツール設定を取得 */
function getToolStyle() {
  return {
    stroke: document.getElementById("stroke-color").value,
  };
}

/** ドラッグからプレビュー要素を生成 */
function buildShapePreview(tool, startX, startY, endX, endY, style, shiftKey) {
  if (tool === "line") {
    const ep = snapToEndpoint(endX, endY);
    const end = shiftKey
      ? { x: ep.x, y: ep.y }
      : snapLineEnd(startX, startY, ep.x, ep.y);
    updateConstraintHint(shiftKey, shiftKey ? "" : "端点スナップ · 0°/45°/90°（±3°）");
    return { type: "line", ...style, x1: startX, y1: startY, x2: end.x, y2: end.y };
  }

  if (tool === "rect") {
    if (shiftKey) {
      updateConstraintHint(true);
      const pts = rectPoints(startX, startY, endX - startX, endY - startY);
      return { type: "polyline", ...style, closed: true, points: pts };
    }
    const { points, mode } = constrainRectCorners(startX, startY, endX, endY);
    updateConstraintHint(false, mode);
    return { type: "polyline", ...style, closed: true, points };
  }

  return null;
}

/** プレビューから確定要素を生成 */
function buildShapeElement(preview) {
  if (!preview) return null;
  return { id: uid(), ...structuredClone(preview) };
}

/** 描画プレビュー */
function drawPreview(preview) {
  render();
  if (!preview) return;
  ctx.save();
  applyViewTransform();
  drawElement(preview);
  ctx.restore();
}

/** 変更をマークして自動保存をスケジュール */
function markDirty() {
  isDirty = true;
  saveStatusEl.textContent = "未保存";
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    autosaveTimer = null;
    if (isDirty) void saveVersion(true);
  }, AUTOSAVE_MS);
}

/** バージョンをサーバーに保存 */
async function saveVersion(isAutosave = true) {
  if (!currentProject || isSaving) return;
  isSaving = true;
  saveStatusEl.textContent = "保存中…";

  try {
    const thumbnail = generateThumbnail();
    const { version } = await api(`/projects/${currentProject.id}/versions`, {
      method: "POST",
      body: JSON.stringify({
        scene: getScene(),
        thumbnail_data: thumbnail,
        is_autosave: isAutosave,
      }),
    });
    currentProject.current_version_id = version.id;
    isDirty = false;
    saveStatusEl.textContent = isAutosave
      ? `自動保存 v${version.version_number}`
      : `保存済 v${version.version_number}`;
    if (versionsPanel && !versionsPanel.hidden) {
      await loadVersionList();
    }
  } catch (err) {
    saveStatusEl.textContent = "保存失敗";
    console.error(err);
  } finally {
    isSaving = false;
  }
}

/** プロジェクト一覧を描画 */
function renderProjectList(projects) {
  projectListEl.innerHTML = "";

  if (!projects.length) {
    listEmptyEl.hidden = false;
    return;
  }
  listEmptyEl.hidden = true;

  for (const p of projects) {
    const li = document.createElement("li");
    li.className = "design-project-card";
    li.innerHTML = `
      <div class="design-project-thumb">
        ${
          p.thumbnail_data
            ? `<img src="${p.thumbnail_data}" alt="">`
            : `<span class="design-project-thumb-placeholder">📐</span>`
        }
      </div>
      <div class="design-project-meta">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${formatDate(p.updated_at)} · ${p.version_count} 版</p>
        <button type="button" class="design-project-delete" data-id="${p.id}">削除</button>
      </div>
    `;
    li.addEventListener("click", (e) => {
      if (e.target.closest(".design-project-delete")) return;
      void openProject(p.id);
    });
    li.querySelector(".design-project-delete")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!confirm(`「${p.title}」を削除しますか？`)) return;
      await api(`/projects/${p.id}`, { method: "DELETE" });
      await loadProjectList();
    });
    projectListEl.appendChild(li);
  }
}

/** プロジェクト一覧を取得して描画 */
async function loadProjectList() {
  const { projects } = await api("/projects");
  renderProjectList(projects);
  return projects;
}

/** プロジェクトを開く */
async function openProject(projectId) {
  const { project } = await api(`/projects/${projectId}`);
  currentProject = project;
  titleInput.value = project.title;
  loadScene(project.scene, { silent: true });
  isDirty = false;
  saveStatusEl.textContent = "";
  listView.hidden = true;
  editorView.hidden = false;
  versionsPanel.hidden = true;
  updateCloudDestUI();
  document.title = `${project.title} — 設計 — ScienceHUB`;
  requestAnimationFrame(() => render());
}

/** 一覧に戻る */
function backToList() {
  if (autosaveTimer) {
    clearTimeout(autosaveTimer);
    autosaveTimer = null;
  }
  if (isDirty && currentProject) {
    void saveVersion(true);
  }
  currentProject = null;
  elements = [];
  clearSelection();
  undoStack = [];
  redoStack = [];
  closeTextEditor(false);
  editorView.hidden = true;
  versionsPanel.hidden = true;
  listView.hidden = false;
  document.title = "設計 — ScienceHUB";
  void loadProjectList();
}

/** 新規プロジェクト */
async function createProject() {
  const { project } = await api("/projects", {
    method: "POST",
    body: JSON.stringify({ title: "無題の設計" }),
  });
  await openProject(project.id);
}

/** バージョン一覧を読み込み */
async function loadVersionList() {
  if (!currentProject) return;
  const { versions } = await api(`/projects/${currentProject.id}/versions`);
  versionListEl.innerHTML = "";

  for (const v of versions) {
    const li = document.createElement("li");
    const isCurrent = v.id === currentProject.current_version_id;
    li.className = `design-version-item${isCurrent ? " design-version-item--current" : ""}`;
    const changeText = formatChangeLog(v.change_log);
    li.innerHTML = `
      <div class="design-version-thumb">
        ${
          v.thumbnail_data
            ? `<img src="${v.thumbnail_data}" alt="">`
            : `<span>📐</span>`
        }
      </div>
      <div class="design-version-info">
        <strong>v${v.version_number}
          <span class="design-version-badge${v.is_autosave ? "" : " design-version-badge--checkpoint"}">
            ${v.is_autosave ? "自動保存" : "確定版"}
          </span>
        </strong>
        <span>${formatDate(v.created_at)}</span>
        <p class="design-version-changes">${escapeHtml(changeText)}</p>
        ${isCurrent ? "" : `<button type="button" class="design-btn" style="margin-top:0.35rem;width:100%" data-restore="${v.id}">この版に復元</button>`}
      </div>
    `;
    if (!isCurrent) {
      li.querySelector("[data-restore]")?.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm(`v${v.version_number} に復元しますか？（新しい版として保存されます）`)) return;
        const thumbnail = generateThumbnail();
        const { project } = await api(
          `/projects/${currentProject.id}/restore/${v.id}`,
          {
            method: "POST",
            body: JSON.stringify({ thumbnail_data: thumbnail }),
          }
        );
        loadScene(project.scene, { silent: true });
        currentProject.current_version_id = project.current_version_id;
        isDirty = false;
        saveStatusEl.textContent = `v${v.version_number} から復元`;
        await loadVersionList();
      });
    }
    versionListEl.appendChild(li);
  }
}

/** 変更ログを表示用文字列に */
function formatChangeLog(log) {
  if (!Array.isArray(log) || !log.length) return "変更なし";
  const parts = [];
  for (const e of log.slice(0, 4)) {
    if (e.action === "add") parts.push(`+${e.elementType || "要素"}`);
    else if (e.action === "remove") parts.push(`-${e.elementType || "要素"}`);
    else if (e.action === "modify") parts.push("編集");
    else if (e.action === "restore") parts.push("復元");
    else if (e.action === "import") parts.push("インポート");
    else if (e.detail) parts.push(e.detail);
  }
  return parts.join(", ") || "変更";
}

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** .design.json のデフォルトファイル名 */
function getDefaultCloudFilename() {
  const base =
    (titleInput?.value || currentProject?.title || "設計")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "_") || "設計";
  return base.toLowerCase().endsWith(".design.json") ? base : `${base}.design.json`;
}

/** ストレージパスを結合 */
function joinStoragePath(folderPath, filename) {
  const folder = String(folderPath ?? "").replace(/\/+$/g, "");
  const name = String(filename ?? "").replace(/^\/+/g, "");
  return folder ? `${folder}/${name}` : name;
}

/** ストレージパスをフォルダとファイル名に分割 */
function splitStoragePath(fullPath) {
  const normalized = String(fullPath ?? "").replace(/\/+$/g, "");
  const idx = normalized.lastIndexOf("/");
  if (idx < 0) {
    return { folderPath: "", filename: normalized };
  }
  return {
    folderPath: normalized.slice(0, idx),
    filename: normalized.slice(idx + 1),
  };
}

/** 保存先表示用ラベル */
function formatCloudDestLabel(fullPath) {
  if (!fullPath) return "";
  const parts = fullPath.split("/").filter(Boolean);
  if (parts.length <= 2) return parts[parts.length - 1] ?? fullPath;
  return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
}

/** クラウド保存先表示を更新 */
function updateCloudDestUI() {
  if (!cloudDestLabelEl) return;
  const path = currentProject?.cloud_storage_path ?? null;
  if (!path) {
    cloudDestLabelEl.hidden = true;
    cloudDestLabelEl.textContent = "";
    cloudDestLabelEl.classList.remove("is-set");
    return;
  }
  cloudDestLabelEl.hidden = false;
  cloudDestLabelEl.textContent = formatCloudDestLabel(path);
  cloudDestLabelEl.title = path;
  cloudDestLabelEl.classList.add("is-set");
}

/** クラウド保存先をプロジェクトに紐付け */
async function applyCloudDestination(folderPath, filename) {
  if (!currentProject) return;
  const cloudPath = joinStoragePath(folderPath, filename);
  const result = await api(`/projects/${currentProject.id}`, {
    method: "PATCH",
    body: JSON.stringify({ cloud_storage_path: cloudPath }),
  });
  currentProject.cloud_storage_path = result.cloud_storage_path ?? cloudPath;
  updateCloudDestUI();
  saveStatusEl.textContent = "保存先を設定しました";
}

/** 保存先指定ダイアログを開く */
function openCloudDestinationPicker({ saveAfter = false } = {}) {
  if (!cloudSaveModal || !currentProject) return;
  cloudSaveModal.open({
    blob: buildDesignBlob(),
    filename: getDefaultCloudFilename(),
    mode: "pick",
    onDestinationPicked: async ({ folderPath, filename }) => {
      try {
        await applyCloudDestination(folderPath, filename);
        if (saveAfter) await saveToCloud();
      } catch (err) {
        alert(err instanceof Error ? err.message : "保存先の設定に失敗しました");
      }
    },
  });
}

/** クラウドへ直接保存（保存先が設定済みならワンクリック） */
async function saveToCloud() {
  if (!currentProject || !cloudSaveModal) return;

  if (!currentProject.cloud_storage_path) {
    openCloudDestinationPicker({ saveAfter: true });
    return;
  }

  const { folderPath, filename } = splitStoragePath(
    currentProject.cloud_storage_path
  );
  if (!folderPath || !filename) {
    openCloudDestinationPicker({ saveAfter: true });
    return;
  }

  saveStatusEl.textContent = "クラウド保存中…";
  const saveBtn = document.getElementById("cloud-save-btn");
  if (saveBtn) saveBtn.disabled = true;

  try {
    await apiRequest("delete", {
      method: "DELETE",
      body: JSON.stringify({ path: currentProject.cloud_storage_path }),
    }).catch(() => {});

    const result = await cloudSaveModal.uploadTo(
      folderPath,
      buildDesignBlob(),
      filename,
      {
        onProgress: (detail) => {
          saveStatusEl.textContent = `クラウド保存中… ${detail.percent ?? 0}%`;
        },
      }
    );

    if (result?.path && result.path !== currentProject.cloud_storage_path) {
      await api(`/projects/${currentProject.id}`, {
        method: "PATCH",
        body: JSON.stringify({ cloud_storage_path: result.path }),
      });
      currentProject.cloud_storage_path = result.path;
      updateCloudDestUI();
    }

    saveStatusEl.textContent = "クラウドに保存しました";
  } catch (err) {
    saveStatusEl.textContent = "クラウド保存失敗";
    alert(err instanceof Error ? err.message : "クラウド保存に失敗しました");
  } finally {
    if (saveBtn) saveBtn.disabled = false;
  }
}

/** .design.json Blob を生成 */
function buildDesignBlob() {
  const payload = {
    type: "sciencehub-design",
    version: 1,
    title: titleInput.value || currentProject?.title || "設計",
    scene: getScene(),
    exported_at: Date.now(),
  };
  return new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
}

/** ローカルにダウンロード */
function downloadLocal() {
  const filename = getDefaultCloudFilename();
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(buildDesignBlob());
  link.click();
  URL.revokeObjectURL(link.href);
  saveStatusEl.textContent = "ローカルに保存しました";
}

/** ローカルファイルを開く */
async function importLocalFile(file) {
  const text = await file.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    alert("JSON ファイルの形式が不正です");
    return;
  }
  const scene = data.scene || data;
  const title = data.title || file.name.replace(/\.design\.json$/i, "") || "無題の設計";

  const { project } = await api("/projects", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  await api(`/projects/${project.id}/versions`, {
    method: "POST",
    body: JSON.stringify({
      scene,
      thumbnail_data: null,
      is_autosave: false,
      change_action: "import",
    }),
  });
  await openProject(project.id);
  saveStatusEl.textContent = "ローカルファイルから読み込み";
}

/** クラウドから開く（URL パラメータ） */
async function openFromStoragePath(storagePath) {
  const blob = await fetchDownloadBlob(storagePath);
  const text = await blob.text();
  const data = JSON.parse(text);
  const scene = data.scene || data;
  const rawName = storagePath.split("/").pop()?.replace(/\.design\.json$/i, "") || "設計";
  const { project } = await api("/projects", {
    method: "POST",
    body: JSON.stringify({ title: rawName }),
  });
  await api(`/projects/${project.id}/versions`, {
    method: "POST",
    body: JSON.stringify({
      scene,
      is_autosave: false,
      change_action: "import",
    }),
  });
  await api(`/projects/${project.id}`, {
    method: "PATCH",
    body: JSON.stringify({ cloud_storage_path: storagePath }),
  });
  await openProject(project.id);
}

function updateDeleteBtn() {
  const btn = document.getElementById("delete-btn");
  if (btn) btn.disabled = selectedIds.size === 0;
}

/** 選択中の要素を取得 */
function getSelectedElements() {
  return elements.filter((el) => selectedIds.has(el.id));
}

/** 要素種別の表示名 */
function getElementTypeLabel(el) {
  if (el.type === "text") return "テキスト";
  if (el.type === "line") return "直線";
  if (el.type === "polyline") return "図形";
  if (el.type === "rect") return "四角形";
  return "要素";
}

/** 選択要素の共通色（異なれば null） */
function getCommonStrokeColor(selected) {
  const colors = new Set(selected.map((el) => el.stroke || "#1e293b"));
  return colors.size === 1 ? [...colors][0] : null;
}

/** プロパティ変更を履歴付きで適用 */
function applyPropertyChange(mutator) {
  pushHistory();
  mutator();
  markDirty();
  render();
  updatePropertiesPanel();
}

/** プロパティパネルを更新 */
function updatePropertiesPanel() {
  if (!propertiesPanel || !propertiesBody) return;

  const versionsOpen = versionsPanel && !versionsPanel.hidden;
  const selected = getSelectedElements();

  if (versionsOpen || selected.length === 0) {
    propertiesPanel.hidden = true;
    propertiesBody.innerHTML = "";
    return;
  }

  propertiesPanel.hidden = false;
  propertiesBody.innerHTML = buildPropertiesPanelHtml(selected);
}

/** プロパティパネルの HTML を生成 */
function buildPropertiesPanelHtml(selected) {
  if (selected.length > 1) {
    const color = getCommonStrokeColor(selected) || "#1e293b";
    return `
      <div class="design-prop-section">
        <p class="design-prop-label">選択</p>
        <p class="design-prop-type">${selected.length} 個の要素</p>
        <p class="design-prop-hint">色を変更すると選択中のすべての要素に適用されます。</p>
      </div>
      <label class="design-prop-field">
        <span>色</span>
        <input type="color" id="prop-stroke-color" value="${escapeHtml(color)}">
      </label>
    `;
  }

  const el = selected[0];
  const color = el.stroke || "#1e293b";
  let html = `
    <div class="design-prop-section">
      <p class="design-prop-label">種類</p>
      <p class="design-prop-type">${escapeHtml(getElementTypeLabel(el))}</p>
    </div>
    <label class="design-prop-field">
      <span>色</span>
      <input type="color" id="prop-stroke-color" value="${escapeHtml(color)}">
    </label>
  `;

  if (el.type === "text") {
    const fontSize = getTextFontSize(el);
    const mode = getTextWritingMode(el);
    html += `
      <div class="design-prop-section">
        <p class="design-prop-label">文字サイズ</p>
        <input type="range" id="prop-font-size" min="${TEXT_SIZE_MIN}" max="${TEXT_SIZE_MAX}" step="1" value="${fontSize}">
        <span class="design-prop-range-value" id="prop-font-size-label">${fontSize}px</span>
      </div>
      <div class="design-prop-section">
        <p class="design-prop-label">書字方向</p>
        <div class="design-segmented" role="group" aria-label="書字方向">
          <button type="button" class="design-segmented-btn${mode === "horizontal" ? " design-segmented-btn--active" : ""}" data-writing-mode="horizontal">横書き</button>
          <button type="button" class="design-segmented-btn${mode === "vertical" ? " design-segmented-btn--active" : ""}" data-writing-mode="vertical">縦書き</button>
        </div>
      </div>
    `;
  }

  return html;
}

function setTool(tool) {
  if (tool !== currentTool) closeTextEditor(true);
  currentTool = tool;
  hoverSnap = null;
  document.querySelectorAll(".design-tool-btn").forEach((btn) => {
    btn.classList.toggle("design-tool-btn--active", btn.dataset.tool === tool);
  });
  canvas.classList.toggle("design-canvas--select", tool === "select");
  canvas.classList.toggle("design-canvas--text", tool === "text");
  updateConstraintHint(false);
}

// --- マウスイベント ---
canvas.addEventListener("mousedown", (evt) => {
  if (evt.button === 1) {
    startPanDrag(evt);
    return;
  }

  const pt = canvasPoint(evt);
  const style = getToolStyle();

  if (currentTool === "select") {
    const hit = hitTest(pt.x, pt.y);
    if (hit) {
      if (evt.shiftKey) {
        toggleSelection(hit);
      } else if (!selectedIds.has(hit)) {
        setSelection([hit]);
      }
      const bases = {};
      for (const id of selectedIds) {
        const el = elements.find((e) => e.id === id);
        if (el) bases[id] = structuredClone(el);
      }
      pushHistory();
      dragState = {
        type: "move",
        startX: pt.x,
        startY: pt.y,
        bases,
        moved: false,
      };
    } else {
      if (!evt.shiftKey) clearSelection();
      dragState = {
        type: "boxSelect",
        startX: pt.x,
        startY: pt.y,
        currentX: pt.x,
        currentY: pt.y,
        shiftKey: evt.shiftKey,
      };
    }
    render();
    return;
  }

  if (currentTool === "text") {
    if (evt.button !== 0) return;
    evt.preventDefault();
    suppressTextBlurCommit = true;
    const existing = elements.find(
      (el) => el.type === "text" && hitTestTextElement(el, pt.x, pt.y)
    );
    startTextEditAt(pt.x, pt.y, existing ?? undefined);
    requestAnimationFrame(() => {
      suppressTextBlurCommit = false;
    });
    return;
  }

  let startX = pt.x;
  let startY = pt.y;
  if (currentTool === "line") {
    const snapped = snapToEndpoint(pt.x, pt.y);
    startX = snapped.x;
    startY = snapped.y;
    hoverSnap = null;
  }

  dragState = {
    type: "draw",
    tool: currentTool,
    startX,
    startY,
    style,
    shiftKey: evt.shiftKey,
  };
});

canvas.addEventListener("mousemove", (evt) => {
  if (panDrag) return;

  const pt = canvasPoint(evt);

  if (!dragState) {
    if (currentTool === "line") {
      const snapped = snapToEndpoint(pt.x, pt.y);
      const next = snapped.snapped ? { x: snapped.x, y: snapped.y } : null;
      if (hoverSnap?.x !== next?.x || hoverSnap?.y !== next?.y) {
        hoverSnap = next;
        render();
      }
    } else if (hoverSnap) {
      hoverSnap = null;
      render();
    }
    return;
  }

  const shiftKey = evt.shiftKey;

  if (dragState.type === "boxSelect") {
    dragState.currentX = pt.x;
    dragState.currentY = pt.y;
    render();
    return;
  }

  if (dragState.type === "move" && dragState.bases) {
    const dx = pt.x - dragState.startX;
    const dy = pt.y - dragState.startY;
    if (Math.hypot(dx, dy) > screenPxToWorld(1)) dragState.moved = true;
    for (const [id, base] of Object.entries(dragState.bases)) {
      const el = elements.find((e) => e.id === id);
      if (!el) continue;
      translateElementFromBase(el, base, dx, dy);
    }
    render();
    return;
  }

  if (dragState.type === "draw") {
    const preview = buildShapePreview(
      dragState.tool,
      dragState.startX,
      dragState.startY,
      pt.x,
      pt.y,
      dragState.style,
      shiftKey
    );
    drawPreview(preview);
  }
});

function finishDrag(evt) {
  if (!dragState) return;
  const pt = canvasPoint(evt);
  const shiftKey = evt.shiftKey;

  if (dragState.type === "boxSelect") {
    const ids = elementsInBox(
      dragState.startX,
      dragState.startY,
      dragState.currentX ?? pt.x,
      dragState.currentY ?? pt.y
    );
    if (ids.length) {
      if (dragState.shiftKey) {
        for (const id of ids) selectedIds.add(id);
        updateDeleteBtn();
        updatePropertiesPanel();
      } else {
        setSelection(ids);
      }
    }
    dragState = null;
    render();
    return;
  }

  if (dragState.type === "move") {
    if (!dragState.moved && undoStack.length) {
      undoStack.pop();
    } else if (dragState.moved) {
      markDirty();
    }
    dragState = null;
    render();
    return;
  }

  if (dragState.type === "draw") {
    const { startX, startY, tool, style } = dragState;
    if (Math.hypot(pt.x - startX, pt.y - startY) < screenPxToWorld(4)) {
      dragState = null;
      render();
      return;
    }

    const preview = buildShapePreview(tool, startX, startY, pt.x, pt.y, style, shiftKey);
    const el = buildShapeElement(preview);
    if (el) {
      pushHistory();
      elements.push(el);
      setSelection([el.id]);
    }
    dragState = null;
    render();
    markDirty();
  }
}

canvas.addEventListener("mouseup", (evt) => {
  if (evt.button === 1) return;
  finishDrag(evt);
});
canvas.addEventListener("mouseleave", (evt) => {
  if (hoverSnap) {
    hoverSnap = null;
    render();
  }
  if (dragState) finishDrag(evt);
});

const canvasScrollEl = document.getElementById("canvas-scroll");
const canvasWrapEl = document.querySelector(".design-canvas-wrap");
canvasScrollEl?.addEventListener("mousedown", (evt) => {
  if (evt.button !== 1 || evt.target === canvas) return;
  startPanDrag(evt);
});

canvas.addEventListener("auxclick", (evt) => {
  if (evt.button === 1) evt.preventDefault();
});

for (const el of [canvas, canvasScrollEl, canvasWrapEl]) {
  el?.addEventListener("wheel", handleWheelZoom, { passive: false, capture: true });
}

canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());

// --- テキスト入力 ---
textInputEl?.addEventListener("mousedown", (evt) => {
  evt.stopPropagation();
});
textInputEl?.addEventListener("input", () => {
  autoResizeTextInput();
  render();
});
textInputEl?.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    evt.preventDefault();
    closeTextEditor(false);
  } else if (evt.key === "Enter" && !evt.shiftKey && !evt.isComposing) {
    evt.preventDefault();
    commitTextEditor();
  }
});
textInputEl?.addEventListener("blur", () => {
  if (suppressTextBlurCommit || !textEditState) return;
  commitTextEditor();
});

// --- UI イベント ---
document.querySelectorAll(".design-tool-btn").forEach((btn) => {
  btn.addEventListener("click", () => setTool(btn.dataset.tool));
});

document.getElementById("zoom-in-btn")?.addEventListener("click", () => {
  const center = canvasCenterScreenPoint();
  zoomAt(center.x, center.y, 1.2);
});
document.getElementById("zoom-out-btn")?.addEventListener("click", () => {
  const center = canvasCenterScreenPoint();
  zoomAt(center.x, center.y, 1 / 1.2);
});
document.getElementById("zoom-reset-btn")?.addEventListener("click", () => {
  resetView();
  render();
});

document.getElementById("delete-btn").addEventListener("click", () => {
  deleteSelected();
});

document.getElementById("clear-btn").addEventListener("click", () => {
  if (!elements.length) return;
  if (!confirm("すべての図形を消去しますか？")) return;
  pushHistory();
  elements = [];
  clearSelection();
  render();
  markDirty();
});

document.addEventListener("keydown", (evt) => {
  if (!isEditorShortcutTarget(evt.target)) return;

  const mod = evt.ctrlKey || evt.metaKey;
  if (mod && evt.key.toLowerCase() === "z" && !evt.shiftKey) {
    evt.preventDefault();
    undo();
    return;
  }
  if (mod && (evt.key.toLowerCase() === "y" || (evt.key.toLowerCase() === "z" && evt.shiftKey))) {
    evt.preventDefault();
    redo();
    return;
  }
  if (mod && evt.key.toLowerCase() === "s") {
    evt.preventDefault();
    void handleSaveShortcut();
    return;
  }
  if (evt.key === "Delete" || evt.key === "Backspace") {
    evt.preventDefault();
    deleteSelected();
  }
});

document.getElementById("new-project-btn").addEventListener("click", () => void createProject());
document.getElementById("empty-new-btn").addEventListener("click", () => void createProject());
document.getElementById("back-to-list").addEventListener("click", backToList);

document.getElementById("local-save-btn").addEventListener("click", downloadLocal);

document.getElementById("import-local-btn").addEventListener("click", () => {
  document.getElementById("import-local-input").click();
});
document.getElementById("import-local-input").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (file) void importLocalFile(file);
  e.target.value = "";
});

document.getElementById("checkpoint-btn").addEventListener("click", () => void saveVersion(false));

document.getElementById("versions-btn").addEventListener("click", async () => {
  versionsPanel.hidden = !versionsPanel.hidden;
  if (!versionsPanel.hidden) await loadVersionList();
  updatePropertiesPanel();
});
document.getElementById("close-versions-btn").addEventListener("click", () => {
  versionsPanel.hidden = true;
  updatePropertiesPanel();
});

propertiesBody?.addEventListener("input", (evt) => {
  const target = evt.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.id === "prop-font-size") {
    const label = document.getElementById("prop-font-size-label");
    if (label) label.textContent = `${target.value}px`;
  }
});

propertiesBody?.addEventListener("change", (evt) => {
  const target = evt.target;
  if (!(target instanceof HTMLInputElement)) return;
  const selected = getSelectedElements();
  if (!selected.length) return;

  if (target.id === "prop-stroke-color") {
    const color = target.value;
    applyPropertyChange(() => {
      for (const el of selected) el.stroke = color;
      document.getElementById("stroke-color").value = color;
    });
    return;
  }

  if (target.id === "prop-font-size" && selected.length === 1 && selected[0].type === "text") {
    applyPropertyChange(() => {
      selected[0].fontSize = Number(target.value);
    });
  }
});

propertiesBody?.addEventListener("click", (evt) => {
  const btn = evt.target.closest("[data-writing-mode]");
  if (!(btn instanceof HTMLButtonElement)) return;
  const selected = getSelectedElements();
  if (selected.length !== 1 || selected[0].type !== "text") return;
  const mode = btn.dataset.writingMode;
  if (mode !== "horizontal" && mode !== "vertical") return;
  applyPropertyChange(() => {
    selected[0].writingMode = mode;
  });
});

let titleSaveTimer = null;
titleInput.addEventListener("input", () => {
  if (!currentProject) return;
  if (titleSaveTimer) clearTimeout(titleSaveTimer);
  titleSaveTimer = setTimeout(async () => {
    try {
      await api(`/projects/${currentProject.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: titleInput.value }),
      });
      currentProject.title = titleInput.value;
    } catch (err) {
      console.error(err);
    }
  }, 600);
});

// クラウド保存モーダル
const cloudDialog = document.getElementById("design-cloud-save-dialog");
/** @type {ReturnType<typeof createCloudSaveModal> | null} */
let cloudSaveModal = null;
if (cloudDialog) {
  cloudSaveModal = createCloudSaveModal(cloudDialog, {
    idPrefix: "design-cloud-save",
    loginNext: `/apps/${APP_SLUG}/`,
  });
}
document.getElementById("cloud-save-btn").addEventListener("click", () => {
  void saveToCloud();
});
document.getElementById("cloud-dest-btn").addEventListener("click", () => {
  openCloudDestinationPicker();
});

// --- 初期化 ---
async function initApp() {
  try {
    const allowed = await checkAccess();
    if (!allowed) return;

    if (canvasWrapEl) {
      new ResizeObserver(() => {
        if (!editorView.hidden) render();
      }).observe(canvasWrapEl);
    }

    const storagePath = new URLSearchParams(location.search).get("storagePath");
    if (storagePath) {
      try {
        await openFromStoragePath(storagePath);
        history.replaceState(null, "", location.pathname);
        return;
      } catch (err) {
        console.error(err);
        alert("クラウドファイルの読み込みに失敗しました");
      }
    }

    let projects = [];
    try {
      projects = await loadProjectList();
    } catch (err) {
      console.error(err);
    }

    if (!projects.length) {
      await createProject();
      return;
    }

    listView.hidden = false;
    editorView.hidden = true;
    updateConstraintHint(false);
    render();
  } catch (err) {
    console.error(err);
    listView.hidden = false;
    listEmptyEl.hidden = false;
    alert("設計アプリの起動に失敗しました。ページを再読み込みしてください。");
  } finally {
    loadingEl.hidden = true;
  }
}

void initApp();
