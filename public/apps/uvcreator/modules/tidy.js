/**
 * 台形補正モジュール（Algo Zoo Tidy 相当の仕組み）
 * 四隅＋辺上の頂点で Coons パッチ変形
 */

import { parseLongEdgeLimit } from "./long-edge.js";

const MAX_INPUT_LONG_EDGE = 2048;
const MAGNIFIER_SIZE = 140;
const MAGNIFIER_ZOOM = 5;

const COLORS = {
  black: "rgb(0,0,0)",
  white: "rgb(255,255,255)",
  lightGray: "rgb(180,180,180)",
  red: "rgb(230,46,46)",
  orange: "rgb(255,165,0)",
};

function emptyEdges() {
  return { top: [], right: [], bottom: [], left: [] };
}

/** 2点間の距離 */
function dist(a, b) {
  return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
}

/** キャンバスの表示サイズに合わせて座標をスケール */
function scalePoint(canvas, point) {
  const rect = canvas.getBoundingClientRect();
  const sx = (point[0] * canvas.width) / rect.width;
  const sy = (point[1] * canvas.height) / rect.height;
  return [sx, sy];
}

/** 描画サイズ用スケール係数（画面上の見た目を一定に） */
function scaleDrawSize(canvas, base) {
  const rect = canvas.getBoundingClientRect();
  const maxDim = Math.max(canvas.width, canvas.height);
  const maxCss = Math.max(rect.width, rect.height);
  return base * Math.max(1, maxDim / Math.max(maxCss, 1));
}

/** 長辺を上限にキャンバスを縮小 */
function limitCanvasLongEdge(canvas, maxLongEdge) {
  const longEdge = Math.max(canvas.width, canvas.height);
  if (longEdge <= maxLongEdge) return canvas;

  const scale = maxLongEdge / longEdge;
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.floor(canvas.width * scale));
  out.height = Math.max(1, Math.floor(canvas.height * scale));
  const ctx = out.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  return out;
}

/** チェッカーボード背景 */
function drawCheckerBoard(ctx, width, height, cell = 12) {
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      const isLight = (Math.floor(x / cell) + Math.floor(y / cell)) % 2 === 0;
      ctx.fillStyle = isLight ? COLORS.lightGray : COLORS.white;
      ctx.fillRect(x, y, cell, cell);
    }
  }
}

function polylineLength(points) {
  let sum = 0;
  for (let i = 0; i < points.length - 1; i++) {
    sum += dist(points[i], points[i + 1]);
  }
  return sum;
}

/** 折れ線上の u (0〜1) の位置をサンプル */
function samplePolyline(points, u) {
  if (points.length === 0) return [0, 0];
  if (points.length === 1) return [...points[0]];
  const total = polylineLength(points);
  if (total < 1e-6) return [...points[0]];

  let target = Math.max(0, Math.min(1, u)) * total;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const segLen = dist(a, b);
    if (target <= segLen || i === points.length - 2) {
      const t = segLen < 1e-6 ? 0 : target / segLen;
      return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
    }
    target -= segLen;
  }
  return [...points[points.length - 1]];
}

/** 四辺の折れ線（角を含む） */
function getEdgePolylines(corners, edges) {
  const [tl, tr, br, bl] = corners;
  return {
    top: [tl, ...edges.top, tr],
    right: [tr, ...edges.right, br],
    bottom: [bl, ...edges.bottom, br],
    left: [tl, ...edges.left, bl],
  };
}

/** Coons パッチで (u,v) をソース座標にマップ */
function coonsPoint(u, v, corners, polylines) {
  const [tl, tr, br, bl] = corners;
  const topPt = samplePolyline(polylines.top, u);
  const bottomPt = samplePolyline(polylines.bottom, u);
  const leftPt = samplePolyline(polylines.left, v);
  const rightPt = samplePolyline(polylines.right, v);

  const c00 = tl;
  const c10 = tr;
  const c11 = br;
  const c01 = bl;

  return [
    (1 - v) * topPt[0] +
      v * bottomPt[0] +
      (1 - u) * leftPt[0] +
      u * rightPt[0] -
      ((1 - u) * (1 - v) * c00[0] +
        u * (1 - v) * c10[0] +
        u * v * c11[0] +
        (1 - u) * v * c01[0]),
    (1 - v) * topPt[1] +
      v * bottomPt[1] +
      (1 - u) * leftPt[1] +
      u * rightPt[1] -
      ((1 - u) * (1 - v) * c00[1] +
        u * (1 - v) * c10[1] +
        u * v * c11[1] +
        (1 - u) * v * c01[1]),
  ];
}

function projectPointOnSegment(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-9) return { point: [a[0], a[1]], t: 0 };
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return { point: [a[0] + t * dx, a[1] + t * dy], t };
}

/** 最も近い辺セグメントを検索 */
function findNearestEdgeSegment(point, corners, edges) {
  const names = ["top", "right", "bottom", "left"];
  const polylines = getEdgePolylines(corners, edges);
  let best = null;

  for (const name of names) {
    const pts = polylines[name];
    for (let i = 0; i < pts.length - 1; i++) {
      const proj = projectPointOnSegment(point, pts[i], pts[i + 1]);
      const d = dist(point, proj.point);
      if (!best || d < best.d) {
        best = {
          edge: name,
          segIndex: i,
          point: proj.point,
          d,
        };
      }
    }
  }
  return best;
}

/** 辺上に頂点を挿入（segIndex は getEdgePolylines のセグメント番号） */
function insertPointOnEdge(edges, edgeName, segIndex, point, minSep = 3) {
  const next = {
    top: [...edges.top],
    right: [...edges.right],
    bottom: [...edges.bottom],
    left: [...edges.left],
  };
  const insertAt = Math.max(0, Math.min(segIndex, next[edgeName].length));
  const list = next[edgeName];
  for (const existing of list) {
    if (dist(existing, point) < minSep) return edges;
  }
  list.splice(insertAt, 0, [point[0], point[1]]);
  return next;
}

function sampleSourceBilinear(data, width, height, x, y) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(width - 1, x0 + 1);
  const y1 = Math.min(height - 1, y0 + 1);
  const tx = x - x0;
  const ty = y - y0;

  const idx = (px, py) => (py * width + px) * 4;
  const c00 = idx(x0, y0);
  const c10 = idx(x1, y0);
  const c01 = idx(x0, y1);
  const c11 = idx(x1, y1);

  const out = [0, 0, 0, 0];
  for (let k = 0; k < 4; k++) {
    out[k] =
      data[c00 + k] * (1 - tx) * (1 - ty) +
      data[c10 + k] * tx * (1 - ty) +
      data[c01 + k] * (1 - tx) * ty +
      data[c11 + k] * tx * ty;
  }
  return out;
}

/** Coons メッシュで台形補正 */
function meshWarp(sourceCanvas, corners, edges) {
  const polylines = getEdgePolylines(corners, edges);
  const outW = Math.max(
    1,
    Math.floor(Math.max(polylineLength(polylines.top), polylineLength(polylines.bottom)))
  );
  const outH = Math.max(
    1,
    Math.floor(Math.max(polylineLength(polylines.left), polylineLength(polylines.right)))
  );

  const sw = sourceCanvas.width;
  const sh = sourceCanvas.height;
  const srcCtx = sourceCanvas.getContext("2d");
  const srcData = srcCtx.getImageData(0, 0, sw, sh).data;

  const out = document.createElement("canvas");
  out.width = outW;
  out.height = outH;
  const outCtx = out.getContext("2d");
  const imageData = outCtx.createImageData(outW, outH);
  const outPx = imageData.data;

  for (let j = 0; j < outH; j++) {
    const v = (j + 0.5) / outH;
    for (let i = 0; i < outW; i++) {
      const u = (i + 0.5) / outW;
      const [sx, sy] = coonsPoint(u, v, corners, polylines);
      const o = (j * outW + i) * 4;
      if (sx < 0 || sy < 0 || sx >= sw - 1 || sy >= sh - 1) {
        outPx[o + 3] = 0;
        continue;
      }
      const [r, g, b, a] = sampleSourceBilinear(srcData, sw, sh, sx, sy);
      outPx[o] = r;
      outPx[o + 1] = g;
      outPx[o + 2] = b;
      outPx[o + 3] = a;
    }
  }

  outCtx.putImageData(imageData, 0, 0);
  return out;
}

/**
 * 台形補正エディタを初期化
 * @param {object} els DOM 要素
 */
export function createTidyEditor(els) {
  const state = {
    squareCanvas: null,
    imageCanvas: null,
    corners: [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    edges: emptyEdges(),
    cursor: [-1, -1],
    editTarget: null,
    filename: "",
  };

  let hasImage = false;
  let sourceCache = null;

  const magnifier = document.createElement("div");
  magnifier.className = "uv-tidy-magnifier";
  magnifier.hidden = true;
  const magCanvas = document.createElement("canvas");
  magnifier.appendChild(magCanvas);
  els.inputWrap.appendChild(magnifier);

  function getBasename(file) {
    const dot = file.name.lastIndexOf(".");
    return dot === -1 ? file.name : file.name.substring(0, dot);
  }

  /** 画像の外接矩形を四隅（TL, TR, BR, BL）として返す */
  function getImageCorners() {
    const side = state.squareCanvas.width;
    const w = state.imageCanvas.width;
    const h = state.imageCanvas.height;
    const ox = (side - w) / 2;
    const oy = (side - h) / 2;
    return [
      [ox, oy],
      [ox + w, oy],
      [ox + w, oy + h],
      [ox, oy + h],
    ];
  }

  function invalidateSourceCache() {
    sourceCache = null;
  }

  function applyMesh(corners, edges) {
    state.corners = corners.map((c) => [c[0], c[1]]);
    state.edges = {
      top: edges.top.map((p) => [p[0], p[1]]),
      right: edges.right.map((p) => [p[0], p[1]]),
      bottom: edges.bottom.map((p) => [p[0], p[1]]),
      left: edges.left.map((p) => [p[0], p[1]]),
    };
    invalidateSourceCache();
    drawInput();
    drawOutput();
  }

  function setCorners(corners, resetEdgePoints = false) {
    applyMesh(corners, resetEdgePoints ? emptyEdges() : state.edges);
  }

  function cloneEdges() {
    return {
      top: state.edges.top.map((p) => [p[0], p[1]]),
      right: state.edges.right.map((p) => [p[0], p[1]]),
      bottom: state.edges.bottom.map((p) => [p[0], p[1]]),
      left: state.edges.left.map((p) => [p[0], p[1]]),
    };
  }

  function getCornersAndEdgesForRender() {
    const corners = state.corners.map((c) => [c[0], c[1]]);
    const edges = cloneEdges();

    if (state.editTarget?.type === "corner") {
      corners[state.editTarget.index] = [...state.cursor];
    } else if (state.editTarget?.type === "edge") {
      edges[state.editTarget.edge][state.editTarget.index] = [...state.cursor];
    }

    return { corners, edges };
  }

  /** クリック位置に最も近い制御点 */
  function nearestControlTarget(point, canvas) {
    const hitR = scaleDrawSize(canvas, 14);
    const edgeHitR = scaleDrawSize(canvas, 10);
    let best = null;

    for (let i = 0; i < 4; i++) {
      const d = dist(point, state.corners[i]);
      if (d <= hitR && (!best || d < best.d)) {
        best = { type: "corner", index: i, d };
      }
    }

    for (const edgeName of ["top", "right", "bottom", "left"]) {
      state.edges[edgeName].forEach((p, index) => {
        const d = dist(point, p);
        if (d <= edgeHitR && (!best || d < best.d)) {
          best = { type: "edge", edge: edgeName, index, d };
        }
      });
    }

    return best;
  }

  function drawImageCentered(ctx, img, size) {
    ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);
  }

  function buildSourceCanvas() {
    if (sourceCache) return sourceCache;

    const size = state.squareCanvas.width;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    const cell = Math.max(8, Math.floor(size / 80));
    drawCheckerBoard(ctx, size, size, cell);
    drawImageCentered(ctx, state.imageCanvas, size);
    sourceCache = c;
    return c;
  }

  /** 頂点移動時のズーム拡大鏡 */
  function updateMagnifier(clientX, clientY) {
    if (state.editTarget === null) {
      magnifier.hidden = true;
      return;
    }

    const [cx, cy] = state.cursor;
    const src = buildSourceCanvas();
    const sampleSize = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;
    const half = sampleSize / 2;

    magCanvas.width = MAGNIFIER_SIZE;
    magCanvas.height = MAGNIFIER_SIZE;
    const ctx = magCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      src,
      cx - half,
      cy - half,
      sampleSize,
      sampleSize,
      0,
      0,
      MAGNIFIER_SIZE,
      MAGNIFIER_SIZE
    );

    const center = MAGNIFIER_SIZE / 2;
    ctx.strokeStyle = COLORS.red;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(center, 0);
    ctx.lineTo(center, MAGNIFIER_SIZE);
    ctx.moveTo(0, center);
    ctx.lineTo(MAGNIFIER_SIZE, center);
    ctx.stroke();

    ctx.fillStyle = COLORS.red;
    ctx.beginPath();
    ctx.arc(center, center, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0.5, 0.5, MAGNIFIER_SIZE - 1, MAGNIFIER_SIZE - 1);

    const wrapRect = els.inputWrap.getBoundingClientRect();
    const offset = 18;
    let left = clientX - wrapRect.left + offset;
    let top = clientY - wrapRect.top + offset;

    if (left + MAGNIFIER_SIZE > wrapRect.width - 8) {
      left = clientX - wrapRect.left - MAGNIFIER_SIZE - offset;
    }
    if (top + MAGNIFIER_SIZE > wrapRect.height - 8) {
      top = clientY - wrapRect.top - MAGNIFIER_SIZE - offset;
    }
    left = Math.max(8, left);
    top = Math.max(8, top);

    magnifier.style.left = `${left}px`;
    magnifier.style.top = `${top}px`;
    magnifier.hidden = false;
  }

  function drawControlPoints(ctx, canvas, corners, edges) {
    const polylines = getEdgePolylines(corners, edges);
    const lw = Math.min(3, Math.max(2, scaleDrawSize(canvas, 2)));

    ctx.strokeStyle = COLORS.red;
    ctx.lineWidth = lw;
    for (const name of ["top", "right", "bottom", "left"]) {
      const pts = polylines[name];
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.stroke();
    }

    const cornerR = Math.min(9, Math.max(6, scaleDrawSize(canvas, 6)));
    for (const [x, y] of corners) {
      ctx.beginPath();
      ctx.arc(x, y, cornerR, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.red;
      ctx.fill();
      ctx.strokeStyle = COLORS.white;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const edgeR = Math.min(7, Math.max(4, scaleDrawSize(canvas, 4)));
    for (const name of ["top", "right", "bottom", "left"]) {
      for (const [x, y] of edges[name]) {
        ctx.beginPath();
        ctx.arc(x, y, edgeR, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.orange;
        ctx.fill();
        ctx.strokeStyle = COLORS.white;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }

  function drawInput() {
    if (!state.squareCanvas || !state.imageCanvas) return;

    const canvas = els.inputCanvas;
    const size = state.squareCanvas.width;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const src = buildSourceCanvas();
    ctx.drawImage(src, 0, 0);

    const { corners, edges } = getCornersAndEdgesForRender();
    drawControlPoints(ctx, canvas, corners, edges);

    els.inputPlaceholder.hidden = true;
  }

  function getOutputLongEdgeLimit() {
    return parseLongEdgeLimit(
      els.outputLongEdgeSelect?.value,
      els.outputLongCustomInput?.value
    );
  }

  function drawOutput() {
    if (!state.squareCanvas || !state.imageCanvas) {
      els.outputPlaceholder.hidden = false;
      els.saveBtn.disabled = true;
      els.sendCombineBtn.disabled = true;
      return;
    }

    try {
      const src = buildSourceCanvas();
      let result = meshWarp(src, state.corners, state.edges);
      const longEdgeLimit = getOutputLongEdgeLimit();
      if (longEdgeLimit) {
        result = limitCanvasLongEdge(result, longEdgeLimit);
      }

      const out = els.outputCanvas;
      out.width = result.width;
      out.height = result.height;
      out.getContext("2d").drawImage(result, 0, 0);
      els.outputPlaceholder.hidden = true;
      els.saveBtn.disabled = false;
      els.sendCombineBtn.disabled = false;
    } catch (err) {
      console.error("Mesh warp failed:", err);
      els.outputPlaceholder.textContent = "変換に失敗しました。四隅の位置を調整してください。";
      els.outputPlaceholder.hidden = false;
    }
  }

  /** R キー: 近い辺上に頂点を追加 */
  function addEdgePointAtCursor() {
    if (!hasImage || state.cursor[0] < 0) return;

    const canvas = els.inputCanvas;
    const maxDist = scaleDrawSize(canvas, 24);
    const hit = findNearestEdgeSegment(state.cursor, state.corners, state.edges);
    if (!hit || hit.d > maxDist) return;

    const nextEdges = insertPointOnEdge(
      state.edges,
      hit.edge,
      hit.segIndex,
      hit.point,
      scaleDrawSize(canvas, 6)
    );
    applyMesh(state.corners, nextEdges);
    state.editTarget = null;
    magnifier.hidden = true;
  }

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      loadImageFromDataUrl(reader.result, getBasename(file));
    };
    reader.readAsDataURL(file);
  }

  /** データ URL から台形補正用画像を読み込む */
  function loadImageFromDataUrl(dataUrl, basename) {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (Math.max(w, h) > MAX_INPUT_LONG_EDGE) {
        const t = MAX_INPUT_LONG_EDGE / Math.max(w, h);
        w = Math.floor(w * t);
        h = Math.floor(h * t);
      }

      const imageCanvas = document.createElement("canvas");
      imageCanvas.width = w;
      imageCanvas.height = h;
      imageCanvas.getContext("2d").drawImage(img, 0, 0, w, h);

      const side = Math.max(w, h);
      state.squareCanvas = document.createElement("canvas");
      state.squareCanvas.width = side;
      state.squareCanvas.height = side;
      state.imageCanvas = imageCanvas;

      setCorners(getImageCorners(), true);

      const base = basename?.replace(/\.[^.]+$/i, "") || "image";
      state.filename = `corrected_${base}`;
      els.filenameInput.value = state.filename;
      hasImage = true;
      state.editTarget = null;
      magnifier.hidden = true;
    };
    img.onerror = () => {
      console.error("Failed to load image for tidy editor");
    };
    img.src = dataUrl;
  }

  /** Blob から台形補正用画像を読み込む */
  function loadFromBlob(blob, filename = "image.jpg") {
    if (!blob) return;
    const type = blob.type?.startsWith("image/") ? blob.type : "image/jpeg";
    const name = filename || "image.jpg";
    const file = new File([blob], name, { type });
    loadFile(file);
  }

  function rotateCanvas(canvas, angle) {
    const out = document.createElement("canvas");
    out.width = canvas.height;
    out.height = canvas.width;
    const ctx = out.getContext("2d");
    ctx.translate(out.width / 2, out.height / 2);
    ctx.rotate(angle);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    return out;
  }

  function rotate(dir) {
    if (!state.imageCanvas || !state.squareCanvas) return;
    const angle = dir === "CCW" ? -Math.PI / 2 : Math.PI / 2;
    state.imageCanvas = rotateCanvas(state.imageCanvas, angle);
    invalidateSourceCache();
    setCorners(getImageCorners(), true);
    state.editTarget = null;
    magnifier.hidden = true;
  }

  function handleMouseMove(offsetX, offsetY, clientX, clientY) {
    if (!hasImage) return;
    const pt = scalePoint(els.inputCanvas, [offsetX, offsetY]);
    state.cursor = pt;
    if (state.editTarget !== null) {
      drawInput();
      updateMagnifier(clientX, clientY);
    }
  }

  function handleClick(offsetX, offsetY, clientX, clientY) {
    if (!hasImage) return;
    const pt = scalePoint(els.inputCanvas, [offsetX, offsetY]);
    state.cursor = pt;

    if (state.editTarget === null) {
      const target = nearestControlTarget(pt, els.inputCanvas);
      if (!target) return;
      state.editTarget =
        target.type === "corner"
          ? { type: "corner", index: target.index }
          : { type: "edge", edge: target.edge, index: target.index };
      drawInput();
      updateMagnifier(clientX, clientY);
      return;
    }

    const corners = state.corners.map((c) => [c[0], c[1]]);
    const edges = cloneEdges();

    if (state.editTarget.type === "corner") {
      corners[state.editTarget.index] = [...pt];
    } else {
      edges[state.editTarget.edge][state.editTarget.index] = [...pt];
    }

    state.editTarget = null;
    magnifier.hidden = true;
    applyMesh(corners, edges);
  }

  function getOutputBlob() {
    return new Promise((resolve) => {
      if (!els.outputCanvas.width) {
        resolve(null);
        return;
      }
      els.outputCanvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || el.isContentEditable;
  }

  els.loadInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  });

  els.inputCanvas.addEventListener("mousemove", (e) => {
    handleMouseMove(e.offsetX, e.offsetY, e.clientX, e.clientY);
  });

  els.inputCanvas.addEventListener("mouseleave", () => {
    if (state.editTarget !== null) {
      magnifier.hidden = true;
    }
  });

  els.inputCanvas.addEventListener("click", (e) => {
    handleClick(e.offsetX, e.offsetY, e.clientX, e.clientY);
    els.inputCanvas.focus({ preventScroll: true });
  });

  els.inputCanvas.setAttribute("tabindex", "0");

  els.inputCanvas.addEventListener("keydown", (e) => {
    if (isTypingTarget(e.target) && e.target !== els.inputCanvas) return;
    if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      addEdgePointAtCursor();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (isTypingTarget(document.activeElement)) return;
    if (e.key === "r" || e.key === "R") {
      if (!hasImage) return;
      if (document.activeElement === els.inputCanvas) return;
      e.preventDefault();
      addEdgePointAtCursor();
    }
  });

  els.ccwBtn.addEventListener("click", () => rotate("CCW"));
  els.cwBtn.addEventListener("click", () => rotate("CW"));

  /** ドロップゾーンへ画像をドラッグ＆ドロップ */
  function pickImageFile(dataTransfer) {
    if (!dataTransfer?.files?.length) return null;
    return Array.from(dataTransfer.files).find((f) => f.type.startsWith("image/")) ?? null;
  }

  let dragDepth = 0;

  function bindDropZone(zone) {
    zone.addEventListener("dragenter", (e) => {
      if (!e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      dragDepth += 1;
      zone.classList.add("is-dragover");
    });

    zone.addEventListener("dragover", (e) => {
      if (!e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    });

    zone.addEventListener("dragleave", (e) => {
      if (!e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) zone.classList.remove("is-dragover");
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      dragDepth = 0;
      zone.classList.remove("is-dragover");
      const file = pickImageFile(e.dataTransfer);
      if (file) loadFile(file);
    });
  }

  bindDropZone(els.dropZone);

  for (const el of [els.outputLongEdgeSelect, els.outputLongCustomInput]) {
    el?.addEventListener("input", drawOutput);
    el?.addEventListener("change", drawOutput);
  }

  return { getOutputBlob, loadFile, loadFromBlob };
}
