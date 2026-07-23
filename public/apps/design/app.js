/**
 * 設計アプリ — シンプルな図面エディタ
 */

import { createCloudSaveModal } from "../../js/cloud-save-modal.js";
import { apiRequest, fetchDownloadBlob } from "../cloud-storage/js/api.js";
import {
  createDesignCollabConnection,
  designSceneFingerprint,
  getElementCollabVersion,
  mergeCollabTombstones,
  pickCollabScene,
  reconcileDesignElements,
} from "../../js/design-collab-utils.js";

const APP_SLUG = "design";
const shareConfig = window.__DESIGN_SHARE__;
const shareToken = shareConfig?.token?.trim() || null;
const isShareMode = Boolean(shareToken);
const AUTOSAVE_MS = 1500;
const RECENT_STROKE_COLOR_LIMIT = 5;
const RECENT_STROKE_COLORS_KEY = "design-recent-stroke-colors";
const GRID_SIZE = 20;
const DEFAULT_STROKE_COLOR = "rgba(30, 41, 59, 1)";
/** 内部座標から表示用長さへの倍率（1グリッド目盛り = GRID_SIZE × この値） */
const LENGTH_DISPLAY_SCALE = 0.5;
/** 寸法表示の刻み（表示長さ） */
const DISPLAY_LENGTH_STEP = 0.1;
/** Alt押下時の寸法刻み（表示長さ） */
const DISPLAY_LENGTH_STEP_ALT = 0.5;
/** 矢印キー移動の刻み（表示長さ） */
const ARROW_NUDGE_DISPLAY = 1.0;
/** 寸法0.1刻みに対応する内部座標の刻み */
const WORLD_LENGTH_STEP = DISPLAY_LENGTH_STEP / LENGTH_DISPLAY_SCALE;
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
/** 選択線の端点ハンドル当たり判定（画面上の px） */
const ENDPOINT_HANDLE_SCREEN_PX = 12;
/** 連結確認の頂点一致許容（内部座標・寸法スナップより十分小さい） */
const CONNECT_VERTEX_EPS = WORLD_LENGTH_STEP * 0.01;
/** 連結確認のハイライト線幅（画面上の px） */
const CONNECT_HIGHLIGHT_STROKE_PX = 3.5;
/** 連結確認の開放端点マーカー（画面上の px） */
const CONNECT_OPEN_ENDPOINT_SCREEN_PX = 7;
/** 画面上の文字サイズ（px）— ズームしても一定 */
const TEXT_SCREEN_PX = 14;
const TEXT_SIZE_MIN = 8;
const TEXT_SIZE_MAX = 48;
const DIMENSION_LABEL_SIZE_MIN = 8;
const DIMENSION_LABEL_SIZE_MAX = 24;
const DIMENSION_LABEL_SIZE_DEFAULT = 11;
const MIN_VIEW_SCALE = 0.1;
const MAX_VIEW_SCALE = 100;

const constraintHintEl = document.getElementById("constraint-hint");
const zoomLabelEl = document.getElementById("zoom-label");

/** ビュー変換（図面座標 ↔ 画面） */
/** ツール切替の数字キー（1:選択, 2:直線, 3:四角, 4:テキスト） */
const TOOL_SHORTCUT_KEYS = {
  1: "select",
  2: "line",
  3: "rect",
  4: "text",
};
/** @type {{ seedLineId: string, lineIds: Set<string>, openEnds: { x: number, y: number }[] } | null} */
let lineConnectionInspect = null;
let viewScale = 1;
let viewPanX = 0;
let viewPanY = 0;
let panDrag = null;

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("design-canvas");
const ctx = canvas.getContext("2d");

const loadingEl = document.getElementById("app-loading");
const deniedEl = document.getElementById("access-denied");
const shareErrorEl = document.getElementById("share-error");
const shareErrorMsgEl = document.getElementById("share-error-msg");
const listView = document.getElementById("list-view");
const editorView = document.getElementById("editor-view");
const projectListEl = document.getElementById("project-list");
const listEmptyEl = document.getElementById("list-empty");
const titleInput = document.getElementById("project-title");

/** プロジェクトタイトルを取得 */
function getProjectTitle() {
  if (!titleInput) return currentProject?.title || "設計";
  if (titleInput instanceof HTMLInputElement) {
    return titleInput.value || currentProject?.title || "設計";
  }
  return titleInput.textContent?.trim() || currentProject?.title || "設計";
}

/** プロジェクトタイトルを表示 */
function setProjectTitle(title) {
  if (!titleInput) return;
  if (titleInput instanceof HTMLInputElement) {
    titleInput.value = title;
    return;
  }
  titleInput.textContent = title;
}
const saveStatusEl = document.getElementById("save-status");
const peersStatusEl = document.getElementById("peers-status");
const versionsPanel = document.getElementById("versions-panel");
const versionListEl = document.getElementById("version-list");
const propertiesPanel = document.getElementById("properties-panel");
const propertiesBody = document.getElementById("properties-body");
const cloudDestLabelEl = document.getElementById("cloud-dest-label");
const textInputEl = document.getElementById("design-text-input");
const measureOverlayEl = document.getElementById("measure-overlay");
const recentColorsEl = document.getElementById("recent-colors");

/** @type {{ id: string, title: string, scene: object, current_version_id: string | null } | null} */
let currentProject = null;
/** @type {Array<object>} */
let elements = [];
let selectedIds = new Set();
/** @type {object[] | null} */
let clipboardElements = null;
let currentTool = "select";
let isDirty = false;
let autosaveTimer = null;
let isSaving = false;

let dragState = null;
let measureOverlayText = "";
let showDimensions = false;
let dimensionLabelSizePx = DIMENSION_LABEL_SIZE_DEFAULT;
/** @type {string[]} */
let recentStrokeColors = [];
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
let fontSizeSliderEditing = false;

/** @type {ReturnType<typeof createDesignCollabConnection> | null} */
let collab = null;
let applyingRemote = false;
let collabBroadcastTimer = null;
/** @type {ReturnType<typeof pickCollabScene> | null} */
let pendingRemoteScene = null;
let lastCollabFingerprint = "";
/** @type {Record<string, number>} */
let collabTombstones = {};
/** @type {Set<string>} */
let pendingLocalDeletions = new Set();
const COLLAB_BROADCAST_MS = 200;
/** 線描画時の端オートパン（画面端からの距離・px） */
const AUTO_PAN_EDGE_PX = 48;
/** 線描画時の端オートパン最大速度（キャンバス座標 / フレーム） */
const AUTO_PAN_MAX_SPEED_PX = 16;
/** @type {{ x: number, y: number } | null} */
let lastDrawPointerClient = null;
/** @type {number | null} */
let lineDrawAutoPanRaf = null;

/** アクセス権を確認 */
async function checkAccess() {
  if (isShareMode) return true;
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

/** 描画内容が画面内に収まるようビューを調整 */
function fitViewToContent(paddingPx = 48) {
  const bounds = getElementsBounds(elements);
  if (!bounds) {
    resetView();
    updateZoomUI();
    return;
  }

  const contentW = Math.max(bounds.w, GRID_SIZE * 2);
  const contentH = Math.max(bounds.h, GRID_SIZE * 2);
  const availW = Math.max(canvas.width - paddingPx * 2, 1);
  const availH = Math.max(canvas.height - paddingPx * 2, 1);
  const fitScale = Math.min(availW / contentW, availH / contentH, 4);

  viewScale = clampViewScale(fitScale);
  viewPanX = canvas.width / 2 - bounds.cx * viewScale;
  viewPanY = canvas.height / 2 - bounds.cy * viewScale;
  updateZoomUI();
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

/** 図面座標 → キャンバス画面座標 */
function worldToScreen(worldX, worldY) {
  return {
    x: viewPanX + worldX * viewScale,
    y: viewPanY + worldY * viewScale,
  };
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

/** client 座標から図面座標へ */
function worldPointFromClient(clientX, clientY) {
  const screen = screenPointFromClient(clientX, clientY);
  return screenToWorld(screen.x, screen.y);
}

/** 画面端付近でのオートパン速度（キャンバス座標） */
function getEdgePanVelocity(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return { vx: 0, vy: 0 };

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  let vx = 0;
  let vy = 0;

  const distLeft = clientX - rect.left;
  const distRight = rect.right - clientX;
  const distTop = clientY - rect.top;
  const distBottom = rect.bottom - clientY;

  if (distLeft < AUTO_PAN_EDGE_PX) {
    vx = -AUTO_PAN_MAX_SPEED_PX * (1 - Math.max(0, distLeft) / AUTO_PAN_EDGE_PX);
  } else if (distRight < AUTO_PAN_EDGE_PX) {
    vx = AUTO_PAN_MAX_SPEED_PX * (1 - Math.max(0, distRight) / AUTO_PAN_EDGE_PX);
  }

  if (distTop < AUTO_PAN_EDGE_PX) {
    vy = AUTO_PAN_MAX_SPEED_PX * (1 - Math.max(0, distTop) / AUTO_PAN_EDGE_PX);
  } else if (distBottom < AUTO_PAN_EDGE_PX) {
    vy = -AUTO_PAN_MAX_SPEED_PX * (1 - Math.max(0, distBottom) / AUTO_PAN_EDGE_PX);
  }

  return { vx: vx * scaleX, vy: vy * scaleY };
}

/** 線描画ドラッグのプレビューを更新 */
function updateLineDrawDragPreview(clientX, clientY, shiftKey, ctrlKey, altKey = false) {
  if (!dragState || dragState.type !== "draw" || dragState.tool !== "line") return;
  const pt = worldPointFromClient(clientX, clientY);
  const preview = buildShapePreview(
    dragState.tool,
    dragState.startX,
    dragState.startY,
    pt.x,
    pt.y,
    dragState.style,
    shiftKey,
    ctrlKey,
    altKey
  );
  drawPreview(preview);
}

/** 線描画時の端オートパンを1フレーム進める */
function tickLineDrawAutoPan() {
  lineDrawAutoPanRaf = null;
  if (
    !dragState ||
    dragState.type !== "draw" ||
    dragState.tool !== "line" ||
    !lastDrawPointerClient
  ) {
    return;
  }

  const { vx, vy } = getEdgePanVelocity(
    lastDrawPointerClient.x,
    lastDrawPointerClient.y
  );
  if (vx === 0 && vy === 0) return;

  viewPanX += vx;
  viewPanY += vy;
  updateLineDrawDragPreview(
    lastDrawPointerClient.x,
    lastDrawPointerClient.y,
    dragState.lastShiftKey ?? false,
    dragState.lastCtrlKey ?? false,
    dragState.lastAltKey ?? false
  );
  lineDrawAutoPanRaf = requestAnimationFrame(tickLineDrawAutoPan);
}

/** 線描画時の端オートパンを開始 */
function scheduleLineDrawAutoPan() {
  if (lineDrawAutoPanRaf == null) {
    lineDrawAutoPanRaf = requestAnimationFrame(tickLineDrawAutoPan);
  }
}

/** 線描画時の端オートパンループを停止 */
function stopLineDrawAutoPanLoop() {
  if (lineDrawAutoPanRaf != null) {
    cancelAnimationFrame(lineDrawAutoPanRaf);
    lineDrawAutoPanRaf = null;
  }
}

/** 線描画時の端オートパンを停止 */
function stopLineDrawAutoPan() {
  stopLineDrawAutoPanLoop();
  lastDrawPointerClient = null;
}

/** 線描画ドラッグ中のポインタ移動 */
function handleLineDrawPointerMove(clientX, clientY, shiftKey, ctrlKey, altKey = false) {
  lastDrawPointerClient = { x: clientX, y: clientY };
  dragState.lastShiftKey = shiftKey;
  dragState.lastCtrlKey = ctrlKey;
  dragState.lastAltKey = altKey;
  updateLineDrawDragPreview(clientX, clientY, shiftKey, ctrlKey, altKey);

  const { vx, vy } = getEdgePanVelocity(clientX, clientY);
  if (vx !== 0 || vy !== 0) scheduleLineDrawAutoPan();
  else stopLineDrawAutoPanLoop();
}

/** カーソル位置の画面座標 */
function screenPoint(evt) {
  return screenPointFromClient(evt.clientX, evt.clientY);
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
  if (next.stroke) next.stroke = resolveStrokeColor(next.stroke);
  if (typeof next.collabVersion !== "number" || next.collabVersion <= 0) {
    next.collabVersion = 1;
  }
  return next;
}

/** 要素の共同編集バージョンを進める */
function bumpElementCollabVersion(el) {
  if (!el) return;
  el.collabVersion = getElementCollabVersion(el) + 1;
}

/** 共同編集の削除トゥームストーンを記録 */
function noteCollabDeletion(id, el) {
  const version = el ? getElementCollabVersion(el) + 1 : 1;
  collabTombstones[id] = Math.max(collabTombstones[id] ?? 0, version);
  pendingLocalDeletions.add(id);
}

/** 共同編集ブロードキャスト用シーン */
function buildCollabBroadcastScene() {
  return {
    ...pickCollabScene(getScene()),
    tombstones: { ...collabTombstones },
  };
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

/** 内部座標を寸法グリッドにスナップ */
function snapToLengthGrid(x, y, displayStep = DISPLAY_LENGTH_STEP) {
  const worldStep = displayStep / LENGTH_DISPLAY_SCALE;
  return {
    x: Math.round(x / worldStep) * worldStep,
    y: Math.round(y / worldStep) * worldStep,
  };
}

/** 内部座標の長さを指定寸法刻みに量子化 */
function quantizeWorldLength(worldLength, displayStep = DISPLAY_LENGTH_STEP) {
  const displayLen = worldLength * LENGTH_DISPLAY_SCALE;
  const quantized =
    Math.round(displayLen / displayStep) * displayStep;
  const worldStep = displayStep / LENGTH_DISPLAY_SCALE;
  if (quantized <= 0) return worldStep;
  return quantized / LENGTH_DISPLAY_SCALE;
}

/** 角度スナップ後に線の長さを寸法刻みに合わせる */
function snapLineEndWithLength(
  x1,
  y1,
  x2,
  y2,
  displayStep = DISPLAY_LENGTH_STEP
) {
  const end = snapLineEnd(x1, y1, x2, y2);
  const dx = end.x - x1;
  const dy = end.y - y1;
  const len = Math.hypot(dx, dy);
  const worldStep = displayStep / LENGTH_DISPLAY_SCALE;
  if (len < worldStep / 2) return end;
  const qLen = quantizeWorldLength(len, displayStep);
  return {
    x: x1 + (dx / len) * qLen,
    y: y1 + (dy / len) * qLen,
  };
}

/** 直線のドラッグ先座標を解決（描画時と同じスナップ） */
function resolveLineDragPoint(
  anchorX,
  anchorY,
  cursorX,
  cursorY,
  shiftKey,
  gridSnap,
  excludeElementId = null,
  altKey = false
) {
  if (gridSnap) {
    return snapToGrid(cursorX, cursorY);
  }
  const ep = snapToEndpoint(cursorX, cursorY, excludeElementId);
  const displayStep = altKey ? DISPLAY_LENGTH_STEP_ALT : DISPLAY_LENGTH_STEP;
  if (shiftKey) return { x: ep.x, y: ep.y };
  return snapLineEndWithLength(anchorX, anchorY, ep.x, ep.y, displayStep);
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
    const text = mode ? `Shift: 補正なし · ${mode}` : "Shift: 補正なし（自由描画）";
    constraintHintEl.textContent = text;
    constraintHintEl.hidden = false;
    constraintHintEl.classList.add("design-constraint-hint--free");
    return;
  }
  constraintHintEl.classList.remove("design-constraint-hint--free");
  const hints = {
    line: "直線: 端点スナップ · 0°/45°/90°（±3°） · 寸法0.1刻み · Altで0.5刻み · Ctrlでグリッド交点",
    rect: "四角: 正方形 / 1:2 長方形を自動判定 · Ctrlでグリッド交点",
    text: "クリックで文字を配置 · 既存テキストをクリックで編集",
    select: "直線: 端点をドラッグして編集 · 移動時に端点同士を自動接続 · 連結確認 · 矢印キーで1.0移動 · Ctrlでグリッド移動",
  };
  const text = mode ? `補正: ${mode}` : hints[currentTool] ?? "";
  constraintHintEl.textContent = text;
  constraintHintEl.hidden = !text;
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
  lineConnectionInspect = null;
  updateDeleteBtn();
  updatePropertiesPanel();
}

/** 選択を設定 */
function setSelection(ids) {
  selectedIds = new Set(ids);
  if (lineConnectionInspect) {
    const selected = [...selectedIds];
    if (selected.length !== 1 || selected[0] !== lineConnectionInspect.seedLineId) {
      lineConnectionInspect = null;
    }
  }
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

/** 選択中の要素を平行移動 */
function nudgeSelectedElements(dx, dy) {
  if (!selectedIds.size) return;
  pushHistory();
  for (const el of getSelectedElements()) {
    const base = structuredClone(el);
    translateElementFromBase(el, base, dx, dy);
  }
  refreshLineConnectionInspect();
  render();
  markDirty();
}

/** 選択中の要素を削除 */
function deleteSelected() {
  if (!selectedIds.size) return;
  pushHistory();
  for (const id of selectedIds) {
    noteCollabDeletion(id, elements.find((el) => el.id === id));
  }
  elements = elements.filter((el) => !selectedIds.has(el.id));
  clearSelection();
  render();
  markDirty();
  broadcastCollabScene();
}

/** 選択中の要素をコピー */
function copySelected() {
  const selected = getSelectedElements();
  if (!selected.length) return;
  clipboardElements = structuredClone(selected);
}

/** 選択中の要素をカット */
function cutSelected() {
  const selected = getSelectedElements();
  if (!selected.length) return;
  clipboardElements = structuredClone(selected);
  deleteSelected();
}

/** クリップボードの要素を画面中央に貼り付け */
function pasteClipboard() {
  if (!clipboardElements?.length) return;
  pushHistory();
  const clones = structuredClone(clipboardElements);
  const newIds = [];
  for (const el of clones) {
    el.id = uid();
    el.collabVersion = 1;
    newIds.push(el.id);
  }
  const bounds = getElementsBounds(clones);
  const center = screenToWorld(canvas.width / 2, canvas.height / 2);
  if (bounds) {
    const dx = center.x - bounds.cx;
    const dy = center.y - bounds.cy;
    for (const el of clones) {
      translateElementFromBase(el, structuredClone(el), dx, dy);
    }
  }
  elements.push(...clones);
  setSelection(newIds);
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

/** 現在見えている図面範囲を取得 */
function getVisibleWorldBounds() {
  const topLeft = screenToWorld(0, 0);
  const bottomRight = screenToWorld(canvas.width, canvas.height);
  return {
    minX: Math.min(topLeft.x, bottomRight.x),
    minY: Math.min(topLeft.y, bottomRight.y),
    maxX: Math.max(topLeft.x, bottomRight.x),
    maxY: Math.max(topLeft.y, bottomRight.y),
  };
}

/** グリッドを描画（表示範囲に合わせて無限に伸ばす） */
function drawGrid() {
  const bounds = getVisibleWorldBounds();
  const pad = GRID_SIZE * 2;
  const minX = Math.floor((bounds.minX - pad) / GRID_SIZE) * GRID_SIZE;
  const maxX = Math.ceil((bounds.maxX + pad) / GRID_SIZE) * GRID_SIZE;
  const minY = Math.floor((bounds.minY - pad) / GRID_SIZE) * GRID_SIZE;
  const maxY = Math.ceil((bounds.maxY + pad) / GRID_SIZE) * GRID_SIZE;

  ctx.save();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = screenPxToWorld(1);

  for (let x = minX; x <= maxX; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, minY);
    ctx.lineTo(x, maxY);
    ctx.stroke();
  }
  for (let y = minY; y <= maxY; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
    ctx.stroke();
  }
  ctx.restore();
}

/** 座標軸を描画（原点 0,0 · X軸=赤 · Y軸=緑） */
function drawAxes() {
  const bounds = getVisibleWorldBounds();
  const pad = GRID_SIZE * 2;
  const minX = bounds.minX - pad;
  const maxX = bounds.maxX + pad;
  const minY = bounds.minY - pad;
  const maxY = bounds.maxY + pad;

  ctx.save();
  ctx.lineWidth = screenPxToWorld(1.5);

  if (minY <= 0 && maxY >= 0) {
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(minX, 0);
    ctx.lineTo(maxX, 0);
    ctx.stroke();
  }

  if (minX <= 0 && maxX >= 0) {
    ctx.strokeStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(0, minY);
    ctx.lineTo(0, maxY);
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
  c.fillStyle = resolveStrokeColor(el.stroke);
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
    stroke: existing?.stroke ? resolveStrokeColor(existing.stroke) : getToolbarStrokeColor(),
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
  const existing = textEditState.elementId
    ? elements.find((e) => e.id === textEditState.elementId)
    : null;
  const stroke = existing?.stroke ? resolveStrokeColor(existing.stroke) : getToolbarStrokeColor();
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
      noteCollabDeletion(
        state.elementId,
        elements.find((el) => el.id === state.elementId)
      );
      elements = elements.filter((el) => el.id !== state.elementId);
      clearSelection();
      markDirty();
      broadcastCollabScene();
    }
    render();
    flushPendingRemoteScene();
    return;
  }

  const stroke = getToolbarStrokeColor();
  pushHistory();

  if (state.isNew) {
    const el = {
      id: uid(),
      collabVersion: 1,
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
      bumpElementCollabVersion(el);
    }
  }

  markDirty();
  render();
  flushPendingRemoteScene();
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
    flushPendingRemoteScene();
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
    setToolbarStrokeColor(existingEl.stroke);
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
  ctx.strokeStyle = resolveStrokeColor(el.stroke);
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

/** 複数要素の結合バウンディングボックス */
function getElementsBounds(els) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const el of els) {
    const b = getElementBounds(el);
    if (!b) continue;
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.w);
    maxY = Math.max(maxY, b.y + b.h);
  }
  if (!Number.isFinite(minX)) return null;
  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
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
  drawAxes();
  for (const el of elements) {
    drawElement(el, selectedIds.has(el.id));
  }
  for (const id of selectedIds) {
    const el = elements.find((e) => e.id === id);
    if (el) drawLineEndpointHandles(el);
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
  else if (dragState?.moveSnapTarget) {
    drawEndpointSnapMarker(dragState.moveSnapTarget.x, dragState.moveSnapTarget.y);
  }
  drawLineConnectionInspect();
  ctx.restore();

  renderDimensionLabels();
  updateTextInputPosition();
  updateZoomUI();
  updateMeasureOverlay(
    dragState?.type === "draw" || dragState?.type === "lineEndpoint"
      ? measureOverlayText
      : ""
  );
}

/** サムネイル用 data URL を生成 */
function generateThumbnail() {
  const thumbW = 320;
  const thumbH = 240;
  const off = document.createElement("canvas");
  off.width = thumbW;
  off.height = thumbH;
  const tctx = off.getContext("2d");
  if (!tctx) return null;

  tctx.fillStyle = "#fff";
  tctx.fillRect(0, 0, thumbW, thumbH);

  if (!elements.length) {
    return off.toDataURL("image/png", 0.85);
  }

  const bounds = getElementsBounds(elements);
  if (!bounds) {
    return off.toDataURL("image/png", 0.85);
  }

  const minSize = screenPxToWorld(24);
  const contentW = Math.max(bounds.w, minSize);
  const contentH = Math.max(bounds.h, minSize);
  const pad = Math.max(contentW, contentH) * 0.12 + screenPxToWorld(12);
  const scale = Math.min(
    (thumbW - 8) / (contentW + pad * 2),
    (thumbH - 8) / (contentH + pad * 2)
  );

  tctx.save();
  tctx.translate(
    thumbW / 2 - bounds.cx * scale,
    thumbH / 2 - bounds.cy * scale
  );
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
  c.strokeStyle = resolveStrokeColor(el.stroke);
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
function snapToEndpoint(x, y, excludeElementId = null) {
  const threshold = screenPxToWorld(ENDPOINT_SNAP_SCREEN_PX);
  let best = null;
  let bestDist = threshold;

  for (const el of elements) {
    if (excludeElementId && el.id === excludeElementId) continue;
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

/** 線移動時に端点同士が近い場合の平行移動補正を求める */
function resolveMoveLineEndpointSnap(dx, dy, bases, excludeIds) {
  const exclude = new Set(excludeIds);
  const threshold = screenPxToWorld(ENDPOINT_SNAP_SCREEN_PX);
  let best = null;

  for (const base of Object.values(bases)) {
    if (base.type !== "line") continue;
    const endpoints = [
      { x: base.x1 + dx, y: base.y1 + dy },
      { x: base.x2 + dx, y: base.y2 + dy },
    ];
    for (const ep of endpoints) {
      for (const el of elements) {
        if (exclude.has(el.id) || el.type !== "line") continue;
        for (const target of getElementEndpoints(el)) {
          const dist = Math.hypot(ep.x - target.x, ep.y - target.y);
          if (dist <= threshold && (!best || dist < best.dist)) {
            best = {
              dx: dx + (target.x - ep.x),
              dy: dy + (target.y - ep.y),
              dist,
              snapTarget: { x: target.x, y: target.y },
            };
          }
        }
      }
    }
  }

  if (best) {
    return {
      dx: best.dx,
      dy: best.dy,
      snapped: true,
      snapTarget: best.snapTarget,
    };
  }
  return { dx, dy, snapped: false, snapTarget: null };
}

/** 最寄りのグリッド交点にスナップ */
function snapToGrid(x, y) {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  };
}

/** 移動量をグリッド1マス単位に丸める */
function quantizeDeltaToGrid(delta) {
  return Math.round(delta / GRID_SIZE) * GRID_SIZE;
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

/** 選択中の直線の端点ハンドルを描画 */
function drawLineEndpointHandles(el) {
  if (el.type !== "line") return;
  const points = [
    { x: el.x1, y: el.y1 },
    { x: el.x2, y: el.y2 },
  ];
  const r = screenPxToWorld(5);
  for (const p of points) {
    ctx.save();
    ctx.strokeStyle = "#2563eb";
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = screenPxToWorld(1.5);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

/** 選択中の直線端点にヒットしたか */
function hitTestLineEndpoint(x, y) {
  const threshold = screenPxToWorld(ENDPOINT_HANDLE_SCREEN_PX);
  let best = null;
  let bestDist = threshold;

  for (const id of selectedIds) {
    const el = elements.find((e) => e.id === id);
    if (!el || el.type !== "line") continue;
    const ends = [
      { endpoint: "start", x: el.x1, y: el.y1 },
      { endpoint: "end", x: el.x2, y: el.y2 },
    ];
    for (const end of ends) {
      const d = Math.hypot(x - end.x, y - end.y);
      if (d <= bestDist) {
        bestDist = d;
        best = { elementId: id, endpoint: end.endpoint };
      }
    }
  }

  return best;
}

/** 2点が連結確認上で同一頂点か */
function connectVerticesEqual(x1, y1, x2, y2, eps = CONNECT_VERTEX_EPS) {
  return Math.hypot(x1 - x2, y1 - y2) <= eps;
}

/** 点が線分上（端点含む）に厳密にあるか */
function pointOnLineSegmentStrict(px, py, x1, y1, x2, y2, eps = CONNECT_VERTEX_EPS) {
  return distToSegment(px, py, x1, y1, x2, y2) <= eps;
}

/** 直線の端点一覧 */
function getLineEndpoints(line) {
  return [
    { x: line.x1, y: line.y1 },
    { x: line.x2, y: line.y2 },
  ];
}

/** 2本の直線が厳密に連結しているか（頂点一致 or 頂点が他線の線分上） */
function linesAreStrictlyConnected(lineA, lineB, eps = CONNECT_VERTEX_EPS) {
  if (lineA.id === lineB.id) return false;

  const aEnds = getLineEndpoints(lineA);
  const bEnds = getLineEndpoints(lineB);

  for (const a of aEnds) {
    for (const b of bEnds) {
      if (connectVerticesEqual(a.x, a.y, b.x, b.y, eps)) return true;
    }
  }

  for (const a of aEnds) {
    if (pointOnLineSegmentStrict(a.x, a.y, lineB.x1, lineB.y1, lineB.x2, lineB.y2, eps)) {
      return true;
    }
  }

  for (const b of bEnds) {
    if (pointOnLineSegmentStrict(b.x, b.y, lineA.x1, lineA.y1, lineA.x2, lineA.y2, eps)) {
      return true;
    }
  }

  return false;
}

/** 端点が他のいずれかの直線と厳密に連結しているか */
function endpointConnectsToOtherLine(x, y, lineId, lines, eps = CONNECT_VERTEX_EPS) {
  for (const other of lines) {
    if (other.id === lineId) continue;

    if (
      connectVerticesEqual(x, y, other.x1, other.y1, eps) ||
      connectVerticesEqual(x, y, other.x2, other.y2, eps)
    ) {
      return true;
    }

    if (pointOnLineSegmentStrict(x, y, other.x1, other.y1, other.x2, other.y2, eps)) {
      return true;
    }
  }
  return false;
}

/** 直線の連結グループを解析 */
function analyzeLineConnection(seedLineId) {
  const lines = elements.filter((el) => el.type === "line");
  const seed = lines.find((el) => el.id === seedLineId);
  if (!seed) return null;

  const adjacency = new Map(lines.map((line) => [line.id, new Set()]));
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      if (!linesAreStrictlyConnected(lines[i], lines[j])) continue;
      adjacency.get(lines[i].id).add(lines[j].id);
      adjacency.get(lines[j].id).add(lines[i].id);
    }
  }

  const lineIds = new Set([seedLineId]);
  const queue = [seedLineId];
  while (queue.length) {
    const id = queue.shift();
    for (const nextId of adjacency.get(id) ?? []) {
      if (lineIds.has(nextId)) continue;
      lineIds.add(nextId);
      queue.push(nextId);
    }
  }

  const openEnds = [];
  for (const id of lineIds) {
    const line = lines.find((item) => item.id === id);
    if (!line) continue;
    for (const ep of getLineEndpoints(line)) {
      if (!endpointConnectsToOtherLine(ep.x, ep.y, line.id, lines)) {
        openEnds.push(ep);
      }
    }
  }

  return { seedLineId, lineIds, openEnds };
}

/** 連結確認表示を更新 */
function refreshLineConnectionInspect() {
  if (!lineConnectionInspect) return;
  lineConnectionInspect = analyzeLineConnection(lineConnectionInspect.seedLineId);
}

/** 連結確認の表示を切り替え */
function toggleLineConnectionInspect(lineId) {
  if (lineConnectionInspect?.seedLineId === lineId) {
    lineConnectionInspect = null;
  } else {
    lineConnectionInspect = analyzeLineConnection(lineId);
  }
  render();
  updatePropertiesPanel();
}

/** 連結確認のハイライトを描画 */
function drawLineConnectionInspect() {
  if (!lineConnectionInspect) return;

  for (const id of lineConnectionInspect.lineIds) {
    const el = elements.find((item) => item.id === id);
    if (!el || el.type !== "line") continue;
    ctx.save();
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = screenPxToWorld(CONNECT_HIGHLIGHT_STROKE_PX);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(el.x1, el.y1);
    ctx.lineTo(el.x2, el.y2);
    ctx.stroke();
    ctx.restore();
  }

  const markerR = screenPxToWorld(CONNECT_OPEN_ENDPOINT_SCREEN_PX);
  for (const point of lineConnectionInspect.openEnds) {
    ctx.save();
    ctx.fillStyle = "#ef4444";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = screenPxToWorld(1.5);
    ctx.beginPath();
    ctx.arc(point.x, point.y, markerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
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

/** 0〜255 に丸める */
function clampColorChannel(value) {
  return Math.min(255, Math.max(0, Math.round(Number(value))));
}

/** 0〜1 に丸める */
function clampAlpha(value) {
  return Math.min(1, Math.max(0, Number(value)));
}

/** RGB を #rrggbb に変換 */
function rgbToHex(r, g, b) {
  const toHex = (n) => clampColorChannel(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** #rrggbb を RGB に変換 */
function parseHexColor(hex) {
  const value = String(hex || "").trim().toLowerCase();
  const match = /^#([0-9a-f]{6})$/.exec(value);
  if (!match) return null;
  const raw = match[1];
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  };
}

/** 16進数入力を RGBA に変換（6桁は alpha=0、8桁は末尾2桁を alpha） */
function parseHexInputColor(value) {
  let text = String(value || "").trim().toLowerCase();
  if (!text) return null;
  if (!text.startsWith("#")) text = `#${text}`;
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(text);
  if (!match) return null;

  let raw = match[1].toLowerCase();
  if (raw.length === 3) {
    raw = raw
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }

  if (raw.length === 6) {
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
      a: 1,
    };
  }

  if (raw.length === 8) {
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
      a: clampAlpha(parseInt(raw.slice(6, 8), 16) / 255),
    };
  }

  return null;
}

/** 16進数入力欄用の文字列を生成 */
function formatHexInputColor(parsed) {
  const base = rgbToHex(parsed.r, parsed.g, parsed.b);
  if (parsed.a <= 0) return base;
  const alphaByte = clampColorChannel(parsed.a * 255).toString(16).padStart(2, "0");
  return `${base}${alphaByte}`;
}

/** 色文字列を RGBA に変換 */
function parseStrokeColor(color) {
  const value = String(color || "").trim();
  if (!value) return null;

  const rgbaMatch = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(
    value
  );
  if (rgbaMatch) {
    return {
      r: clampColorChannel(rgbaMatch[1]),
      g: clampColorChannel(rgbaMatch[2]),
      b: clampColorChannel(rgbaMatch[3]),
      a: clampAlpha(rgbaMatch[4] !== undefined ? rgbaMatch[4] : 1),
    };
  }

  const hexMatch = /^#([0-9a-f]{3,8})$/i.exec(value);
  if (hexMatch) {
    let raw = hexMatch[1].toLowerCase();
    if (raw.length === 3) {
      raw = raw
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    if (raw.length === 6 || raw.length === 8) {
      const parsed = {
        r: parseInt(raw.slice(0, 2), 16),
        g: parseInt(raw.slice(2, 4), 16),
        b: parseInt(raw.slice(4, 6), 16),
        a: 1,
      };
      if (raw.length === 8) {
        parsed.a = clampAlpha(parseInt(raw.slice(6, 8), 16) / 255);
      }
      return parsed;
    }
  }

  return null;
}

/** RGBA 文字列を生成 */
function formatStrokeColor(r, g, b, a) {
  const alpha = Math.round(clampAlpha(a) * 1000) / 1000;
  return `rgba(${clampColorChannel(r)}, ${clampColorChannel(g)}, ${clampColorChannel(b)}, ${alpha})`;
}

/** 色を rgba(...) 形式に正規化 */
function normalizeStrokeColor(color) {
  const parsed = parseStrokeColor(color);
  if (!parsed) return null;
  return formatStrokeColor(parsed.r, parsed.g, parsed.b, parsed.a);
}

/** 描画用の色を取得（未設定・旧形式は rgba に変換） */
function resolveStrokeColor(color) {
  return normalizeStrokeColor(color) || DEFAULT_STROKE_COLOR;
}

/** ツールバーの色入力から RGBA を取得 */
function getToolbarStrokeColor() {
  const hex = document.getElementById("stroke-color")?.value || "#1e293b";
  const opacity = Number(document.getElementById("stroke-opacity")?.value ?? 100);
  const rgb = parseHexColor(hex);
  if (!rgb) return DEFAULT_STROKE_COLOR;
  return formatStrokeColor(rgb.r, rgb.g, rgb.b, opacity / 100);
}

/** プロパティパネルの色入力から RGBA を取得 */
function getPropertyStrokeColor() {
  const hex = document.getElementById("prop-stroke-color")?.value || "#1e293b";
  const opacity = Number(document.getElementById("prop-stroke-opacity")?.value ?? 100);
  const rgb = parseHexColor(hex);
  if (!rgb) return DEFAULT_STROKE_COLOR;
  return formatStrokeColor(rgb.r, rgb.g, rgb.b, opacity / 100);
}

/** 不透明度ラベルを更新 */
function updateStrokeOpacityLabel(opacityId, labelId) {
  const opacity = document.getElementById(opacityId);
  const label = document.getElementById(labelId);
  if (opacity instanceof HTMLInputElement && label) {
    label.textContent = `${opacity.value}%`;
  }
}

/** 色入力 UI を同期 */
function setStrokeColorInputs(parsed, ids) {
  const colorInput = document.getElementById(ids.colorId);
  const opacityInput = document.getElementById(ids.opacityId);
  const hexInput = document.getElementById(ids.hexId);
  if (colorInput) colorInput.value = rgbToHex(parsed.r, parsed.g, parsed.b);
  if (opacityInput) opacityInput.value = String(Math.round(parsed.a * 100));
  if (ids.opacityLabelId) updateStrokeOpacityLabel(ids.opacityId, ids.opacityLabelId);
  if (hexInput) hexInput.value = formatHexInputColor(parsed);
}

const TOOLBAR_STROKE_INPUT_IDS = {
  colorId: "stroke-color",
  opacityId: "stroke-opacity",
  opacityLabelId: "stroke-opacity-label",
  hexId: "stroke-hex",
};

const PROPERTY_STROKE_INPUT_IDS = {
  colorId: "prop-stroke-color",
  opacityId: "prop-stroke-opacity",
  opacityLabelId: "prop-stroke-opacity-label",
  hexId: "prop-stroke-hex",
};

/** 色を各入力欄に反映 */
function applyStrokeColorToInputs(color, inputIdsList) {
  const parsed = parseStrokeColor(resolveStrokeColor(color));
  if (!parsed) return null;
  const rgba = formatStrokeColor(parsed.r, parsed.g, parsed.b, parsed.a);
  for (const ids of inputIdsList) {
    setStrokeColorInputs(parsed, ids);
  }
  return rgba;
}

/** 16進数入力から色を適用 */
function applyStrokeColorFromHexInput(inputIds, { recordRecent = false } = {}) {
  const hexInput = document.getElementById(inputIds.hexId);
  if (!(hexInput instanceof HTMLInputElement)) return null;
  const parsed = parseHexInputColor(hexInput.value);
  if (!parsed) return null;
  const rgba = formatStrokeColor(parsed.r, parsed.g, parsed.b, parsed.a);
  setStrokeColorInputs(parsed, inputIds);
  if (recordRecent) addRecentStrokeColor(rgba);
  return rgba;
}

/** 色・不透明度入力の HTML を生成 */
function buildStrokeColorFieldsHtml(color) {
  const normalized = resolveStrokeColor(color);
  const parsed = parseStrokeColor(normalized);
  if (!parsed) return "";
  const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
  const opacity = Math.round(parsed.a * 100);
  const hexInput = formatHexInputColor(parsed);
  return `
    <label class="design-prop-field">
      <span>色</span>
      <input type="color" id="prop-stroke-color" value="${escapeHtml(hex)}">
    </label>
    <label class="design-prop-field">
      <span>不透明度</span>
      <input type="range" id="prop-stroke-opacity" min="0" max="100" step="1" value="${opacity}">
      <span class="design-prop-range-value" id="prop-stroke-opacity-label">${opacity}%</span>
    </label>
    <label class="design-prop-field">
      <span>16進数</span>
      <input type="text" id="prop-stroke-hex" class="design-stroke-hex-input" value="${escapeHtml(hexInput)}" spellcheck="false" autocomplete="off" maxlength="9" placeholder="#333333">
    </label>
  `;
}

/** ツール設定を取得 */
function getToolStyle() {
  return {
    stroke: getToolbarStrokeColor(),
  };
}

/** 最近使った線の色を読み込む */
function loadRecentStrokeColors() {
  try {
    const raw = localStorage.getItem(RECENT_STROKE_COLORS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeStrokeColor).filter(Boolean).slice(0, RECENT_STROKE_COLOR_LIMIT);
  } catch {
    return [];
  }
}

/** 最近使った線の色を保存 */
function saveRecentStrokeColors() {
  try {
    localStorage.setItem(RECENT_STROKE_COLORS_KEY, JSON.stringify(recentStrokeColors));
  } catch {
    /* localStorage 不可時は無視 */
  }
}

/** 最近使った色の一覧を描画 */
function renderRecentStrokeColors() {
  if (!recentColorsEl) return;
  if (!recentStrokeColors.length) {
    recentColorsEl.hidden = true;
    recentColorsEl.innerHTML = "";
    return;
  }
  recentColorsEl.hidden = false;
  recentColorsEl.innerHTML = recentStrokeColors
    .map(
      (color) =>
        `<button type="button" class="design-recent-color" data-color="${escapeHtml(color)}" title="${escapeHtml(color)}" aria-label="色 ${escapeHtml(color)}"><span class="design-recent-color-swatch" style="background:${escapeHtml(color)}"></span></button>`
    )
    .join("");
}

/** 最近使った色に追加 */
function addRecentStrokeColor(color) {
  const normalized = normalizeStrokeColor(color);
  if (!normalized) return;
  recentStrokeColors = [
    normalized,
    ...recentStrokeColors.filter((item) => item !== normalized),
  ].slice(0, RECENT_STROKE_COLOR_LIMIT);
  saveRecentStrokeColors();
  renderRecentStrokeColors();
}

/** ツールバーの線の色を設定 */
function setToolbarStrokeColor(color, { recordRecent = false } = {}) {
  const rgba = applyStrokeColorToInputs(color, [TOOLBAR_STROKE_INPUT_IDS]);
  if (rgba && recordRecent) addRecentStrokeColor(rgba);
}

/** ドラッグからプレビュー要素を生成 */
function buildShapePreview(tool, startX, startY, endX, endY, style, shiftKey, gridSnap = false, altKey = false) {
  if (tool === "line") {
    if (gridSnap) {
      const end = snapToGrid(endX, endY);
      updateConstraintHint(shiftKey, "グリッド交点");
      return { type: "line", ...style, x1: startX, y1: startY, x2: end.x, y2: end.y };
    }
    const end = resolveLineDragPoint(startX, startY, endX, endY, shiftKey, false, null, altKey);
    const lengthHint = altKey ? "寸法0.5刻み" : "寸法0.1刻み";
    updateConstraintHint(
      shiftKey,
      shiftKey ? "" : `端点スナップ · 0°/45°/90° · ${lengthHint}`
    );
    return { type: "line", ...style, x1: startX, y1: startY, x2: end.x, y2: end.y };
  }

  if (tool === "rect") {
    const end = gridSnap ? snapToGrid(endX, endY) : { x: endX, y: endY };
    if (shiftKey) {
      updateConstraintHint(true, gridSnap ? "グリッド交点" : "");
      const pts = rectPoints(startX, startY, end.x - startX, end.y - startY);
      return { type: "polyline", ...style, closed: true, points: pts };
    }
    const { points, mode } = constrainRectCorners(startX, startY, end.x, end.y);
    updateConstraintHint(false, gridSnap ? `${mode} · グリッド交点` : mode);
    return { type: "polyline", ...style, closed: true, points };
  }

  return null;
}

/** プレビューから確定要素を生成 */
function buildShapeElement(preview) {
  if (!preview) return null;
  return { id: uid(), collabVersion: 1, ...structuredClone(preview) };
}

/** 寸法表示を更新 */
function updateMeasureOverlay(text = measureOverlayText) {
  if (!measureOverlayEl) return;
  if (!text) {
    measureOverlayEl.hidden = true;
    measureOverlayEl.textContent = "";
    return;
  }
  measureOverlayEl.hidden = false;
  measureOverlayEl.textContent = text;
}

/** 内部座標の距離を表示用長さに変換 */
function formatDisplayLength(worldDistance) {
  return (worldDistance * LENGTH_DISPLAY_SCALE).toFixed(1);
}

/** 線分の寸法ラベルを描画 */
function drawSegmentDimensionLabel(x1, y1, x2, y2) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < screenPxToWorld(2)) return;

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const nx = -dy / len;
  const ny = dx / len;
  const offset = screenPxToWorld(10);
  const screen = worldToScreen(mx + nx * offset, my + ny * offset);
  const label = formatDisplayLength(len);

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `600 ${dimensionLabelSizePx}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(label);
  const padX = 3;
  const padY = 2;
  const boxW = metrics.width + padX * 2;
  const boxH = dimensionLabelSizePx + padY * 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillRect(screen.x - boxW / 2, screen.y - boxH / 2, boxW, boxH);
  ctx.fillStyle = "#334155";
  ctx.fillText(label, screen.x, screen.y);
  ctx.restore();
}

/** 要素の各辺に寸法ラベルを描画 */
function drawElementDimensionLabels(el) {
  if (!el || el.type === "text") return;
  for (const [x1, y1, x2, y2] of getElementSegments(el)) {
    drawSegmentDimensionLabel(x1, y1, x2, y2);
  }
}

/** 寸法ラベルをまとめて描画 */
function renderDimensionLabels(extraElements = []) {
  if (!showDimensions) return;
  for (const el of elements) {
    if (textEditState?.elementId === el.id && el.type === "text") continue;
    drawElementDimensionLabels(el);
  }
  for (const el of extraElements) {
    drawElementDimensionLabels(el);
  }
}

/** プレビュー要素から寸法テキストを生成 */
function getPreviewMeasureText(preview) {
  if (!preview) return "";

  if (preview.type === "line") {
    const length = Math.hypot(preview.x2 - preview.x1, preview.y2 - preview.y1);
    return `長さ ${formatDisplayLength(length)}`;
  }

  if (preview.type === "polyline" && preview.closed && Array.isArray(preview.points) && preview.points.length >= 2) {
    const xs = preview.points.map((p) => p.x);
    const ys = preview.points.map((p) => p.y);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    return `幅 ${formatDisplayLength(width)} × 高さ ${formatDisplayLength(height)}`;
  }

  return "";
}

/** 描画プレビュー */
function drawPreview(preview) {
  measureOverlayText = getPreviewMeasureText(preview);
  render();
  if (!preview) return;
  ctx.save();
  applyViewTransform();
  drawElement(preview);
  ctx.restore();
  renderDimensionLabels(preview ? [preview] : []);
}

/** 変更をマークして自動保存をスケジュール */
function markDirty() {
  isDirty = true;
  if (saveStatusEl) saveStatusEl.textContent = "未保存";
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    autosaveTimer = null;
    if (isDirty) void saveVersion(true);
  }, AUTOSAVE_MS);
  scheduleCollabBroadcast();
}

/** 共同編集のリモートシーンをマージ適用（選択・Undoは維持） */
function mergeRemoteCollabScene(scene) {
  const remote = pickCollabScene(scene);
  const remoteTombs = remote.tombstones ?? {};
  collabTombstones = mergeCollabTombstones(collabTombstones, remoteTombs);

  let merged = reconcileDesignElements(elements, remote.elements, {
    localTombstones: collabTombstones,
    remoteTombstones: remoteTombs,
  }).map(normalizeLegacyElement);
  merged = merged.filter((el) => !pendingLocalDeletions.has(el.id));

  for (const id of [...pendingLocalDeletions]) {
    if (!remote.elements.some((el) => el?.id === id)) {
      pendingLocalDeletions.delete(id);
    }
  }

  const nextFingerprint = designSceneFingerprint({
    ...remote,
    elements: merged,
    tombstones: collabTombstones,
  });
  if (nextFingerprint === designSceneFingerprint(pickCollabScene(getScene()))) {
    lastCollabFingerprint = nextFingerprint;
    return false;
  }

  const prevSelected = [...selectedIds];
  const inspectSeed = lineConnectionInspect?.seedLineId;
  const editingId = textEditState?.elementId ?? null;

  elements = merged;
  lastCollabFingerprint = nextFingerprint;

  selectedIds = new Set(
    prevSelected.filter((id) => elements.some((el) => el.id === id))
  );

  if (editingId && !elements.some((el) => el.id === editingId)) {
    closeTextEditor(false);
  }

  if (lineConnectionInspect) {
    if (
      !inspectSeed ||
      !elements.some((el) => el.id === inspectSeed) ||
      !selectedIds.has(inspectSeed)
    ) {
      lineConnectionInspect = null;
    } else {
      refreshLineConnectionInspect();
    }
  }

  updateDeleteBtn();
  updatePropertiesPanel();
  render();
  return true;
}

/** ドラッグ中に保留したリモート更新を適用 */
function flushPendingRemoteScene() {
  if (!pendingRemoteScene || dragState) return;
  const scene = pendingRemoteScene;
  pendingRemoteScene = null;
  applyingRemote = true;
  try {
    const changed = mergeRemoteCollabScene(scene);
    if (changed) {
      isDirty = true;
      if (saveStatusEl) saveStatusEl.textContent = "未保存";
      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(() => {
        autosaveTimer = null;
        if (isDirty) void saveVersion(true);
      }, AUTOSAVE_MS);
    }
  } finally {
    applyingRemote = false;
  }
}

/** 共同編集のリモートシーンを適用 */
function applyCollabRemoteScene(scene) {
  if (dragState || textEditState) {
    pendingRemoteScene = pickCollabScene(scene);
    return;
  }

  applyingRemote = true;
  try {
    const changed = mergeRemoteCollabScene(scene);
    if (!changed) return;
    isDirty = true;
    if (saveStatusEl) saveStatusEl.textContent = "未保存";
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      autosaveTimer = null;
      if (isDirty) void saveVersion(true);
    }, AUTOSAVE_MS);
  } finally {
    applyingRemote = false;
  }
}

/** 参加者表示を更新 */
function updateCollabPeers(peers, clientId) {
  const others = (peers ?? []).filter((p) => p.clientId !== clientId);
  if (!peersStatusEl) return;
  peersStatusEl.textContent =
    others.length === 0
      ? "自分のみ"
      : `共同編集: ${others.map((p) => p.username).join(", ")}`;
}

/** 共同編集 WebSocket を切断 */
function disconnectCollab() {
  if (collab) {
    collab.disconnect();
    collab = null;
  }
  if (collabBroadcastTimer) {
    clearTimeout(collabBroadcastTimer);
    collabBroadcastTimer = null;
  }
  pendingRemoteScene = null;
  collabTombstones = {};
  pendingLocalDeletions = new Set();
  if (peersStatusEl) peersStatusEl.textContent = "";
}

/** 共同編集 WebSocket に接続 */
function connectCollab({ projectId, token } = {}) {
  disconnectCollab();
  const proto = location.protocol === "https:" ? "wss:" : "ws:";

  collab = createDesignCollabConnection({
    buildUrl: () => {
      const params = new URLSearchParams();
      if (token) params.set("token", token);
      else if (projectId) params.set("projectId", projectId);
      const guestName = localStorage.getItem("design-guest-name");
      if (guestName && (token || isShareMode)) params.set("name", guestName);
      return `${proto}//${location.host}/api/design/collab?${params}`;
    },
    setApplyingRemote: (value) => {
      applyingRemote = value;
    },
    onApplyRemoteScene: applyCollabRemoteScene,
    onOpen: () => {
      if (peersStatusEl) peersStatusEl.textContent = "接続中";
    },
    onClose: () => {
      if (peersStatusEl) peersStatusEl.textContent = "再接続中…";
    },
    onError: () => {
      if (peersStatusEl) peersStatusEl.textContent = "接続エラー";
    },
    onPeersChange: updateCollabPeers,
  });
  collab.connect();
}

/** 共同編集へシーンを送信 */
function broadcastCollabScene() {
  if (!collab || applyingRemote) return;
  const scene = buildCollabBroadcastScene();
  const fingerprint = designSceneFingerprint(scene);
  if (fingerprint === lastCollabFingerprint) return;
  lastCollabFingerprint = fingerprint;
  collab.broadcastScene(scene);
}

/** 共同編集ブロードキャストをスケジュール */
function scheduleCollabBroadcast() {
  if (applyingRemote || !collab) return;
  if (collabBroadcastTimer) clearTimeout(collabBroadcastTimer);
  collabBroadcastTimer = setTimeout(() => {
    collabBroadcastTimer = null;
    broadcastCollabScene();
  }, COLLAB_BROADCAST_MS);
}

/** バージョンをサーバーに保存 */
async function saveVersion(isAutosave = true) {
  if (!currentProject || isSaving) return;
  isSaving = true;
  saveStatusEl.textContent = "保存中…";

  try {
    if (isShareMode && shareToken) {
      const response = await fetch("/api/design/share/scene", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: shareToken,
          scene: getScene(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "保存に失敗しました");
      }
      isDirty = false;
      saveStatusEl.textContent = "保存済み";
      return;
    }

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

/** 共有モーダル */
const shareModal = document.getElementById("share-modal");
const shareUrlInput = document.getElementById("share-url");

async function openShareModal() {
  if (!currentProject) return;
  const share = await api(`/projects/${currentProject.id}/share`, { method: "POST" });
  currentProject.share_url = share.url;
  currentProject.share_token = share.token;
  if (shareUrlInput) shareUrlInput.value = share.url;
  if (shareModal) shareModal.hidden = false;
}

function closeShareModal() {
  if (shareModal) shareModal.hidden = true;
}

/** 共有リンクから設計図を開く */
async function openSharedProject() {
  const response = await fetch(
    `/api/design/share/info?token=${encodeURIComponent(shareToken)}`
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "共有リンクが見つかりません");
  }

  currentProject = {
    id: data.project_id,
    title: data.title,
    scene: data.scene,
    current_version_id: null,
    share_url: data.share_url,
    share_token: shareToken,
  };
  if (titleInput) {
    setProjectTitle(data.title || "共有設計");
    if (titleInput instanceof HTMLInputElement) {
      titleInput.readOnly = true;
    }
  }
  loadScene(data.scene, { silent: true });
  fitViewToContent();
  isDirty = false;
  if (saveStatusEl) saveStatusEl.textContent = "";
  if (listView) listView.hidden = true;
  if (editorView) editorView.hidden = false;
  document.title = `${data.title || "共有設計"} — 設計 — ScienceHUB`;
  lastCollabFingerprint = designSceneFingerprint(pickCollabScene(data.scene));
  connectCollab({ token: shareToken });
  requestAnimationFrame(() => render());
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
        <p>${formatDate(p.updated_at)} · ${p.version_count} 版${p.share_url ? " · 共有中" : ""}</p>
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
  setProjectTitle(project.title);
  loadScene(project.scene, { silent: true });
  fitViewToContent();
  isDirty = false;
  saveStatusEl.textContent = "";
  listView.hidden = true;
  editorView.hidden = false;
  closeVersionsPanel();
  updateCloudDestUI();
  document.title = `${project.title} — 設計 — ScienceHUB`;
  lastCollabFingerprint = designSceneFingerprint(pickCollabScene(project.scene));
  connectCollab({ projectId: project.id });
  requestAnimationFrame(() => render());
}

/** 一覧に戻る */
function backToList() {
  disconnectCollab();
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
  closeVersionsPanel();
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
        fitViewToContent();
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
    getProjectTitle()
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
    title: getProjectTitle(),
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
  const colors = new Set(selected.map((el) => resolveStrokeColor(el.stroke)));
  return colors.size === 1 ? [...colors][0] : null;
}

/** プロパティ変更を履歴付きで適用 */
function applyPropertyChange(mutator) {
  pushHistory();
  mutator();
  for (const el of getSelectedElements()) bumpElementCollabVersion(el);
  markDirty();
  render();
  updatePropertiesPanel();
}

/** バージョン履歴パネルを閉じる */
function closeVersionsPanel() {
  if (!versionsPanel) return;
  versionsPanel.hidden = true;
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
    const color = getCommonStrokeColor(selected) || DEFAULT_STROKE_COLOR;
    return `
      <div class="design-prop-section">
        <p class="design-prop-label">選択</p>
        <p class="design-prop-type">${selected.length} 個の要素</p>
        <p class="design-prop-hint">色を変更すると選択中のすべての要素に適用されます。</p>
      </div>
      ${buildStrokeColorFieldsHtml(color)}
    `;
  }

  const el = selected[0];
  const color = resolveStrokeColor(el.stroke);
  let html = `
    <div class="design-prop-section">
      <p class="design-prop-label">種類</p>
      <p class="design-prop-type">${escapeHtml(getElementTypeLabel(el))}</p>
    </div>
    ${buildStrokeColorFieldsHtml(color)}
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

  if (el.type === "line") {
    const inspectActive = lineConnectionInspect?.seedLineId === el.id;
    const connectedCount = inspectActive ? lineConnectionInspect.lineIds.size : 0;
    const openEndCount = inspectActive ? lineConnectionInspect.openEnds.length : 0;
    html += `
      <div class="design-prop-section">
        <button
          type="button"
          class="design-btn${inspectActive ? " design-btn--primary" : ""}"
          id="prop-line-connect-btn"
          style="width:100%"
        >
          ${inspectActive ? "連結確認を終了" : "連結確認"}
        </button>
        ${
          inspectActive
            ? `<p class="design-prop-hint">連結 ${connectedCount} 本 · 開放端点 ${openEndCount} 箇所（黄色=連結線、赤=未接続端）</p>`
            : `<p class="design-prop-hint">頂点一致・線上の頂点（T字）のみ連結とみなします。近いだけでは連結しません。</p>`
        }
      </div>
    `;
  }

  return html;
}

function setTool(tool) {
  if (tool !== currentTool) closeTextEditor(true);
  currentTool = tool;
  hoverSnap = null;
  measureOverlayText = "";
  lineConnectionInspect = null;
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
    const endpointHit = hitTestLineEndpoint(pt.x, pt.y);
    if (endpointHit) {
      if (!selectedIds.has(endpointHit.elementId)) {
        setSelection([endpointHit.elementId]);
      }
      pushHistory();
      dragState = {
        type: "lineEndpoint",
        elementId: endpointHit.elementId,
        endpoint: endpointHit.endpoint,
        moved: false,
      };
      render();
      return;
    }

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
  const gridSnap = evt.ctrlKey;

  if (gridSnap) {
    const snapped = snapToGrid(pt.x, pt.y);
    startX = snapped.x;
    startY = snapped.y;
    hoverSnap = null;
  } else if (currentTool === "line") {
    const lengthStep = evt.altKey ? DISPLAY_LENGTH_STEP_ALT : DISPLAY_LENGTH_STEP;
    const snapped = snapToEndpoint(pt.x, pt.y);
    if (snapped.snapped) {
      startX = snapped.x;
      startY = snapped.y;
    } else {
      const grid = snapToLengthGrid(pt.x, pt.y, lengthStep);
      startX = grid.x;
      startY = grid.y;
    }
    hoverSnap = null;
  }

  dragState = {
    type: "draw",
    tool: currentTool,
    startX,
    startY,
    style,
    shiftKey: evt.shiftKey,
    gridSnap,
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
    } else if (currentTool === "select" && hitTestLineEndpoint(pt.x, pt.y)) {
      canvas.style.cursor = "pointer";
    } else if (currentTool === "select") {
      canvas.style.cursor = "";
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
    let dx = pt.x - dragState.startX;
    let dy = pt.y - dragState.startY;
    if (evt.ctrlKey) {
      dx = quantizeDeltaToGrid(dx);
      dy = quantizeDeltaToGrid(dy);
      dragState.moveSnapTarget = null;
    } else {
      const snap = resolveMoveLineEndpointSnap(
        dx,
        dy,
        dragState.bases,
        Object.keys(dragState.bases)
      );
      dx = snap.dx;
      dy = snap.dy;
      dragState.moveSnapTarget = snap.snapTarget;
    }
    if (Math.hypot(dx, dy) > screenPxToWorld(1)) dragState.moved = true;
    for (const [id, base] of Object.entries(dragState.bases)) {
      const el = elements.find((e) => e.id === id);
      if (!el) continue;
      translateElementFromBase(el, base, dx, dy);
    }
    refreshLineConnectionInspect();
    render();
    return;
  }

  if (dragState.type === "lineEndpoint") {
    const el = elements.find((e) => e.id === dragState.elementId);
    if (!el || el.type !== "line") return;

    const gridSnap = evt.ctrlKey;
    const altKey = evt.altKey;
    let anchorX;
    let anchorY;
    if (dragState.endpoint === "start") {
      anchorX = el.x2;
      anchorY = el.y2;
      const next = resolveLineDragPoint(
        anchorX,
        anchorY,
        pt.x,
        pt.y,
        shiftKey,
        gridSnap,
        el.id,
        altKey
      );
      if (el.x1 !== next.x || el.y1 !== next.y) dragState.moved = true;
      el.x1 = next.x;
      el.y1 = next.y;
    } else {
      anchorX = el.x1;
      anchorY = el.y1;
      const next = resolveLineDragPoint(
        anchorX,
        anchorY,
        pt.x,
        pt.y,
        shiftKey,
        gridSnap,
        el.id,
        altKey
      );
      if (el.x2 !== next.x || el.y2 !== next.y) dragState.moved = true;
      el.x2 = next.x;
      el.y2 = next.y;
    }

    updateConstraintHint(
      shiftKey,
      gridSnap
        ? "グリッド交点"
        : shiftKey
          ? ""
          : altKey
            ? "端点スナップ · 0°/45°/90° · 寸法0.5刻み"
            : "端点スナップ · 0°/45°/90° · 寸法0.1刻み"
    );
    measureOverlayText = getPreviewMeasureText(el);
    refreshLineConnectionInspect();
    render();
    return;
  }

  if (dragState.type === "draw") {
    if (dragState.tool === "line") {
      handleLineDrawPointerMove(
        evt.clientX,
        evt.clientY,
        shiftKey,
        evt.ctrlKey,
        evt.altKey
      );
      return;
    }
    const preview = buildShapePreview(
      dragState.tool,
      dragState.startX,
      dragState.startY,
      pt.x,
      pt.y,
      dragState.style,
      shiftKey,
      evt.ctrlKey
    );
    drawPreview(preview);
  }
});

function finishDrag(evt) {
  if (!dragState) return;
  try {
    stopLineDrawAutoPan();
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
      measureOverlayText = "";
      render();
      return;
    }

    if (dragState.type === "move") {
      dragState.moveSnapTarget = null;
      if (!dragState.moved && undoStack.length) {
        undoStack.pop();
      } else if (dragState.moved) {
        for (const id of selectedIds) {
          bumpElementCollabVersion(elements.find((el) => el.id === id));
        }
        markDirty();
      }
      dragState = null;
      render();
      return;
    }

    if (dragState.type === "lineEndpoint") {
      if (!dragState.moved && undoStack.length) {
        undoStack.pop();
      } else if (dragState.moved) {
        bumpElementCollabVersion(
          elements.find((el) => el.id === dragState.elementId)
        );
        markDirty();
      }
      dragState = null;
      measureOverlayText = "";
      render();
      return;
    }

    if (dragState.type === "draw") {
      const { startX, startY, tool, style } = dragState;
      if (Math.hypot(pt.x - startX, pt.y - startY) < screenPxToWorld(4)) {
        dragState = null;
        measureOverlayText = "";
        render();
        return;
      }

      const preview = buildShapePreview(
        tool,
        startX,
        startY,
        pt.x,
        pt.y,
        style,
        shiftKey,
        evt.ctrlKey,
        evt.altKey
      );
      const el = buildShapeElement(preview);
      if (el) {
        pushHistory();
        elements.push(el);
        setSelection([el.id]);
      }
      dragState = null;
      measureOverlayText = "";
      render();
      markDirty();
      broadcastCollabScene();
    }
  } finally {
    if (!dragState) flushPendingRemoteScene();
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
  fitViewToContent();
  render();
});

document.getElementById("show-dimensions-toggle")?.addEventListener("change", (evt) => {
  showDimensions = evt.target.checked;
  render();
});

document.getElementById("dimension-label-size")?.addEventListener("input", (evt) => {
  const target = evt.target;
  if (!(target instanceof HTMLInputElement)) return;
  dimensionLabelSizePx = Math.min(
    DIMENSION_LABEL_SIZE_MAX,
    Math.max(DIMENSION_LABEL_SIZE_MIN, Number(target.value) || DIMENSION_LABEL_SIZE_DEFAULT)
  );
  const label = document.getElementById("dimension-label-size-label");
  if (label) label.textContent = `${dimensionLabelSizePx}px`;
  if (showDimensions) render();
});

document.getElementById("stroke-color")?.addEventListener("change", () => {
  applyStrokeColorToInputs(getToolbarStrokeColor(), [TOOLBAR_STROKE_INPUT_IDS]);
  addRecentStrokeColor(getToolbarStrokeColor());
});

document.getElementById("stroke-opacity")?.addEventListener("input", () => {
  updateStrokeOpacityLabel("stroke-opacity", "stroke-opacity-label");
  const parsed = parseStrokeColor(getToolbarStrokeColor());
  if (parsed) {
    const hexInput = document.getElementById("stroke-hex");
    if (hexInput instanceof HTMLInputElement) {
      hexInput.value = formatHexInputColor(parsed);
    }
  }
});

document.getElementById("stroke-opacity")?.addEventListener("change", () => {
  applyStrokeColorToInputs(getToolbarStrokeColor(), [TOOLBAR_STROKE_INPUT_IDS]);
  addRecentStrokeColor(getToolbarStrokeColor());
});

document.getElementById("stroke-hex")?.addEventListener("change", () => {
  applyStrokeColorFromHexInput(TOOLBAR_STROKE_INPUT_IDS, { recordRecent: true });
});

recentColorsEl?.addEventListener("click", (evt) => {
  const btn = evt.target.closest("[data-color]");
  if (!(btn instanceof HTMLButtonElement)) return;
  const color = btn.dataset.color;
  if (!color) return;
  setToolbarStrokeColor(color, { recordRecent: true });
});

document.getElementById("delete-btn")?.addEventListener("click", () => {
  deleteSelected();
});

document.getElementById("clear-btn")?.addEventListener("click", () => {
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

  if (evt.key === "Escape" && versionsPanel && !versionsPanel.hidden) {
    evt.preventDefault();
    closeVersionsPanel();
    return;
  }

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
  if (mod && evt.key.toLowerCase() === "c") {
    if (currentTool === "select" && selectedIds.size) {
      evt.preventDefault();
      copySelected();
    }
    return;
  }
  if (mod && evt.key.toLowerCase() === "x") {
    if (currentTool === "select" && selectedIds.size) {
      evt.preventDefault();
      cutSelected();
    }
    return;
  }
  if (mod && evt.key.toLowerCase() === "v") {
    if (clipboardElements?.length) {
      evt.preventDefault();
      pasteClipboard();
    }
    return;
  }
  if (!mod && !evt.altKey) {
    const tool = TOOL_SHORTCUT_KEYS[evt.key];
    if (tool) {
      evt.preventDefault();
      setTool(tool);
      return;
    }
  }
  if (
    currentTool === "select" &&
    selectedIds.size &&
    (evt.key === "ArrowUp" ||
      evt.key === "ArrowDown" ||
      evt.key === "ArrowLeft" ||
      evt.key === "ArrowRight")
  ) {
    evt.preventDefault();
    const step = ARROW_NUDGE_DISPLAY / LENGTH_DISPLAY_SCALE;
    let dx = 0;
    let dy = 0;
    if (evt.key === "ArrowUp") dy = -step;
    else if (evt.key === "ArrowDown") dy = step;
    else if (evt.key === "ArrowLeft") dx = -step;
    else if (evt.key === "ArrowRight") dx = step;
    nudgeSelectedElements(dx, dy);
    return;
  }
  if (evt.key === "Delete" || evt.key === "Backspace") {
    evt.preventDefault();
    deleteSelected();
  }
});

document.getElementById("new-project-btn")?.addEventListener("click", () => void createProject());
document.getElementById("empty-new-btn")?.addEventListener("click", () => void createProject());
document.getElementById("back-to-list")?.addEventListener("click", backToList);

document.getElementById("local-save-btn")?.addEventListener("click", downloadLocal);

document.getElementById("import-local-btn")?.addEventListener("click", () => {
  document.getElementById("import-local-input")?.click();
});
document.getElementById("import-local-input")?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (file) void importLocalFile(file);
  e.target.value = "";
});

document.getElementById("checkpoint-btn")?.addEventListener("click", () => void saveVersion(false));

document.getElementById("versions-btn")?.addEventListener("click", async () => {
  if (!versionsPanel.hidden) {
    closeVersionsPanel();
    return;
  }
  versionsPanel.hidden = false;
  await loadVersionList();
  updatePropertiesPanel();
});
document.getElementById("close-versions-btn")?.addEventListener("click", () => {
  closeVersionsPanel();
});

document.getElementById("share-btn")?.addEventListener("click", () => {
  openShareModal().catch((e) => alert(e.message));
});
document.getElementById("copy-share-btn")?.addEventListener("click", async () => {
  if (!shareUrlInput) return;
  try {
    await navigator.clipboard.writeText(shareUrlInput.value);
    if (saveStatusEl) saveStatusEl.textContent = "リンクをコピーしました";
  } catch {
    shareUrlInput.select();
  }
});
document.getElementById("revoke-share-btn")?.addEventListener("click", async () => {
  if (!currentProject) return;
  if (!window.confirm("共有リンクを無効化しますか？")) return;
  await api(`/projects/${currentProject.id}/share`, { method: "DELETE" });
  currentProject.share_url = null;
  currentProject.share_token = null;
  closeShareModal();
  if (saveStatusEl) saveStatusEl.textContent = "共有を解除しました";
});
shareModal?.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeShareModal);
});

propertiesBody?.addEventListener("click", (evt) => {
  const target = evt.target;
  if (!(target instanceof HTMLElement) || target.id !== "prop-line-connect-btn") return;
  const selected = getSelectedElements();
  if (selected.length !== 1 || selected[0].type !== "line") return;
  toggleLineConnectionInspect(selected[0].id);
});

propertiesBody?.addEventListener("pointerdown", (evt) => {
  const target = evt.target;
  if (!(target instanceof HTMLInputElement) || target.id !== "prop-font-size") return;
  if (!fontSizeSliderEditing) {
    pushHistory();
    fontSizeSliderEditing = true;
  }
});

propertiesBody?.addEventListener("input", (evt) => {
  const target = evt.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.id === "prop-stroke-opacity") {
    updateStrokeOpacityLabel("prop-stroke-opacity", "prop-stroke-opacity-label");
    const parsed = parseStrokeColor(getPropertyStrokeColor());
    const hexInput = document.getElementById("prop-stroke-hex");
    if (parsed && hexInput instanceof HTMLInputElement) {
      hexInput.value = formatHexInputColor(parsed);
    }
  }
  if (target.id === "prop-font-size") {
    const selected = getSelectedElements();
    if (selected.length !== 1 || selected[0].type !== "text") return;
    if (!fontSizeSliderEditing) {
      pushHistory();
      fontSizeSliderEditing = true;
    }
    selected[0].fontSize = Number(target.value);
    const label = document.getElementById("prop-font-size-label");
    if (label) label.textContent = `${target.value}px`;
    markDirty();
    render();
  }
});

propertiesBody?.addEventListener("change", (evt) => {
  const target = evt.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.id === "prop-font-size") {
    fontSizeSliderEditing = false;
    return;
  }
  const selected = getSelectedElements();
  if (!selected.length) return;

  if (target.id === "prop-stroke-color" || target.id === "prop-stroke-opacity") {
    const color = getPropertyStrokeColor();
    applyPropertyChange(() => {
      for (const el of selected) el.stroke = color;
      applyStrokeColorToInputs(color, [TOOLBAR_STROKE_INPUT_IDS, PROPERTY_STROKE_INPUT_IDS]);
    });
    addRecentStrokeColor(color);
    return;
  }

  if (target.id === "prop-stroke-hex") {
    const color = applyStrokeColorFromHexInput(PROPERTY_STROKE_INPUT_IDS);
    if (!color) return;
    applyPropertyChange(() => {
      for (const el of selected) el.stroke = color;
      applyStrokeColorToInputs(color, [TOOLBAR_STROKE_INPUT_IDS, PROPERTY_STROKE_INPUT_IDS]);
    });
    addRecentStrokeColor(color);
    return;
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
titleInput?.addEventListener("input", () => {
  if (!currentProject || isShareMode) return;
  if (titleSaveTimer) clearTimeout(titleSaveTimer);
  titleSaveTimer = setTimeout(async () => {
    try {
      await api(`/projects/${currentProject.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: getProjectTitle() }),
      });
      currentProject.title = getProjectTitle();
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
document.getElementById("cloud-save-btn")?.addEventListener("click", () => {
  void saveToCloud();
});
document.getElementById("cloud-dest-btn")?.addEventListener("click", () => {
  openCloudDestinationPicker();
});

// --- 初期化 ---
async function initApp() {
  try {
    if (isShareMode) {
      if (!shareToken) {
        throw new Error("共有トークンがありません");
      }

      recentStrokeColors = loadRecentStrokeColors();
      renderRecentStrokeColors();

      if (canvasWrapEl) {
        new ResizeObserver(() => {
          if (!editorView.hidden) render();
        }).observe(canvasWrapEl);
      }

      await openSharedProject();
      loadingEl.hidden = true;
      return;
    }

    const allowed = await checkAccess();
    if (!allowed) return;

    recentStrokeColors = loadRecentStrokeColors();
    renderRecentStrokeColors();

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
    if (isShareMode) {
      if (shareErrorEl) shareErrorEl.hidden = false;
      if (shareErrorMsgEl) {
        shareErrorMsgEl.textContent =
          err instanceof Error ? err.message : "共有リンクが無効です";
      }
    } else {
      if (listView) listView.hidden = false;
      if (listEmptyEl) listEmptyEl.hidden = false;
      alert("設計アプリの起動に失敗しました。ページを再読み込みしてください。");
    }
  } finally {
    loadingEl.hidden = true;
  }
}

void initApp();
