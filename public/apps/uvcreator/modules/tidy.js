/**
 * 台形補正モジュール（Algo Zoo Tidy 相当の仕組み）
 * glfx.js の perspective 変換を使用
 */

const MAX_INPUT_LONG_EDGE = 2048;
const MAX_OUTPUT_LONG_EDGE = 2048;
const MAGNIFIER_SIZE = 140;
const MAGNIFIER_ZOOM = 5;

const COLORS = {
  black: "rgb(0,0,0)",
  white: "rgb(255,255,255)",
  lightGray: "rgb(180,180,180)",
  red: "rgb(230,46,46)",
};

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

/** 透視変換（glfx）— 頂点順: TL, TR, BR, BL */
function perspectiveTransform(sourceCanvas, corners) {
  const [tl, tr, br, bl] = corners;
  const outW = Math.max(dist(tl, tr), dist(bl, br));
  const outH = Math.max(dist(tl, bl), dist(tr, br));

  const fxCanvas = window.fx.canvas();
  const texture = fxCanvas.texture(sourceCanvas);
  fxCanvas
    .draw(texture)
    .perspective(
      [tl[0], tl[1], tr[0], tr[1], br[0], br[1], bl[0], bl[1]],
      [0, 0, outW, 0, outW, outH, 0, outH]
    )
    .update();

  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.floor(outW));
  out.height = Math.max(1, Math.floor(outH));
  out.getContext("2d").drawImage(fxCanvas, 0, 0);
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
    corners: [[0, 0], [0, 0], [0, 0], [0, 0]],
    cursor: [-1, -1],
    editIndex: null,
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

  function setCorners(corners) {
    state.corners = corners.map((c) => [c[0], c[1]]);
    invalidateSourceCache();
    drawInput();
    drawOutput();
  }

  function nearestCornerIndex(point) {
    const distances = state.corners.map((c) => dist(point, c));
    const min = Math.min(...distances);
    return distances.indexOf(min);
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

  function getActiveCorners() {
    let [tl, tr, br, bl] = state.corners;
    if (state.editIndex !== null) {
      const cur = state.cursor;
      if (state.editIndex === 0) tl = cur;
      else if (state.editIndex === 1) tr = cur;
      else if (state.editIndex === 2) br = cur;
      else bl = cur;
    }
    return [tl, tr, br, bl];
  }

  /** 頂点移動時のズーム拡大鏡 */
  function updateMagnifier(clientX, clientY) {
    if (state.editIndex === null) {
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

  function drawInput() {
    if (!state.squareCanvas || !state.imageCanvas) return;

    const canvas = els.inputCanvas;
    const size = state.squareCanvas.width;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const src = buildSourceCanvas();
    ctx.drawImage(src, 0, 0);

    const [tl, tr, br, bl] = getActiveCorners();

    const lw = Math.min(3, Math.max(2, scaleDrawSize(canvas, 2)));
    ctx.strokeStyle = COLORS.red;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(tr[0], tr[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.closePath();
    ctx.stroke();

    const r = Math.min(9, Math.max(6, scaleDrawSize(canvas, 6)));
    for (const [x, y] of [tl, tr, br, bl]) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.red;
      ctx.fill();
      ctx.strokeStyle = COLORS.white;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    els.inputPlaceholder.hidden = true;
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
      let result = perspectiveTransform(src, state.corners);
      result = limitCanvasLongEdge(result, MAX_OUTPUT_LONG_EDGE);

      const out = els.outputCanvas;
      out.width = result.width;
      out.height = result.height;
      out.getContext("2d").drawImage(result, 0, 0);
      els.outputPlaceholder.hidden = true;
      els.saveBtn.disabled = false;
      els.sendCombineBtn.disabled = false;
    } catch (err) {
      console.error("Perspective transform failed:", err);
      els.outputPlaceholder.textContent = "変換に失敗しました。四隅の位置を調整してください。";
      els.outputPlaceholder.hidden = false;
    }
  }

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
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

        setCorners(getImageCorners());

        state.filename = `corrected_${getBasename(file)}`;
        els.filenameInput.value = state.filename;
        hasImage = true;
        state.editIndex = null;
        magnifier.hidden = true;
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
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

  function rotatePoint(point, center, dir) {
    const [x, y] = point;
    const [cx, cy] = center;
    const rx = x - cx;
    const ry = y - cy;
    let nx;
    let ny;
    if (dir === "CCW") {
      nx = ry;
      ny = -rx;
    } else {
      nx = -ry;
      ny = rx;
    }
    return [nx + cx, ny + cy];
  }

  function rotate(dir) {
    if (!state.imageCanvas || !state.squareCanvas) return;
    const angle = dir === "CCW" ? -Math.PI / 2 : Math.PI / 2;
    state.imageCanvas = rotateCanvas(state.imageCanvas, angle);
    invalidateSourceCache();
    setCorners(getImageCorners());
    state.editIndex = null;
    magnifier.hidden = true;
  }

  function handleMouseMove(offsetX, offsetY, clientX, clientY) {
    if (!hasImage) return;
    const pt = scalePoint(els.inputCanvas, [offsetX, offsetY]);
    state.cursor = pt;
    if (state.editIndex !== null) {
      drawInput();
      updateMagnifier(clientX, clientY);
    }
  }

  function handleClick(offsetX, offsetY, clientX, clientY) {
    if (!hasImage) return;
    const pt = scalePoint(els.inputCanvas, [offsetX, offsetY]);
    state.cursor = pt;

    if (state.editIndex === null) {
      state.editIndex = nearestCornerIndex(pt);
      drawInput();
      updateMagnifier(clientX, clientY);
      return;
    }

    const idx = state.editIndex;
    const next = state.corners.map((c, i) => (i === idx ? pt : c));
    state.editIndex = null;
    magnifier.hidden = true;
    setCorners(next);
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

  els.loadInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  });

  els.inputCanvas.addEventListener("mousemove", (e) => {
    handleMouseMove(e.offsetX, e.offsetY, e.clientX, e.clientY);
  });

  els.inputCanvas.addEventListener("mouseleave", () => {
    if (state.editIndex !== null) {
      magnifier.hidden = true;
    }
  });

  els.inputCanvas.addEventListener("click", (e) => {
    handleClick(e.offsetX, e.offsetY, e.clientX, e.clientY);
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

  return { getOutputBlob, loadFile };
}
