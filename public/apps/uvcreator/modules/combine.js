/**
 * 画像結合モジュール（フォトコンバイン相当の仕組み）
 */

import { bindSortableList } from "./sortable-list.js";

const MAX_PREVIEW_LONG_EDGE = 2048;

let nextId = 1;

/**
 * @typedef {{ id: number, name: string, img: HTMLImageElement, url: string }} CombineImage
 */

/** @param {number} n @param {number} min @param {number} max */
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** @param {string} hex */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

/** @param {{ r: number, g: number, b: number, a: number }} c */
function toRgbaString(c) {
  const a = Math.round(c.a * 1000) / 1000;
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
}

/** @param {string} input */
function parseRgba(input) {
  const s = input.trim();
  const m = s.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i
  );
  if (m) {
    return {
      r: clamp(Math.round(Number(m[1])), 0, 255),
      g: clamp(Math.round(Number(m[2])), 0, 255),
      b: clamp(Math.round(Number(m[3])), 0, 255),
      a: clamp(m[4] !== undefined ? Number(m[4]) : 1, 0, 1),
    };
  }
  if (/^#[0-9a-f]{3,8}$/i.test(s)) {
    const { r, g, b } = hexToRgb(s);
    return { r, g, b, a: 1 };
  }
  return null;
}

/**
 * @param {object} els
 */
export function createCombineEditor(els) {
  /** @type {CombineImage[]} */
  let images = [];
  /** @type {HTMLCanvasElement | null} */
  let fullResultCanvas = null;

  /** @type {{ list: HTMLElement, reorder: boolean }[]} */
  const listTargets = [{ list: els.list, reorder: true }];
  if (els.extraLists) {
    for (const list of els.extraLists) {
      listTargets.push({ list, reorder: true });
    }
  }

  function getBackgroundColor() {
    const parsed = parseRgba(els.bgInput.value);
    if (parsed) return toRgbaString(parsed);
    return "rgba(255, 255, 255, 1)";
  }

  function syncBgControlsFromRgba(rgbaStr) {
    const parsed = parseRgba(rgbaStr);
    if (!parsed) return;
    const hex =
      "#" +
      [parsed.r, parsed.g, parsed.b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");
    els.bgPicker.value = hex;
    els.bgAlpha.value = String(Math.round(parsed.a * 100));
    els.bgAlphaValue.textContent = `${Math.round(parsed.a * 100)}%`;
    els.bgInput.value = toRgbaString(parsed);
  }

  function syncBgFromPicker() {
    const { r, g, b } = hexToRgb(els.bgPicker.value);
    const a = clamp(Number(els.bgAlpha.value) / 100, 0, 1);
    els.bgInput.value = toRgbaString({ r, g, b, a });
    els.bgAlphaValue.textContent = `${Math.round(a * 100)}%`;
  }

  function updateListEmptyState() {
    const empty = images.length === 0;
    for (const { list } of listTargets) {
      list.classList.toggle("is-empty", empty);
    }
    els.saveBtn.disabled = empty;
    els.previewPlaceholder.hidden = !empty;
    if (els.queueCount) {
      els.queueCount.textContent = String(images.length);
    }
    if (els.queueCard) {
      els.queueCard.hidden = false;
    }
  }

  function removeImage(id) {
    const item = images.find((i) => i.id === id);
    if (item) URL.revokeObjectURL(item.url);
    images = images.filter((i) => i.id !== id);
    renderAllLists();
    renderPreview();
  }

  function reorderFromIds(ids) {
    const map = new Map(images.map((i) => [i.id, i]));
    const next = ids.map((id) => map.get(id)).filter(Boolean);
    if (next.length !== images.length) return;
    images = next;
    renderAllLists();
    renderPreview();
  }

  function buildListItem(item) {
    const li = document.createElement("li");
    li.className = "uv-img-item";
    li.dataset.id = String(item.id);

    const thumb = document.createElement("img");
    thumb.src = item.url;
    thumb.alt = item.name;
    thumb.draggable = false;

    const name = document.createElement("span");
    name.className = "uv-img-item-name";
    name.textContent = item.name;
    name.title = item.name;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "uv-img-item-remove";
    remove.textContent = "削除";
    remove.addEventListener("click", () => removeImage(item.id));

    li.appendChild(thumb);
    li.appendChild(name);
    li.appendChild(remove);

    return li;
  }

  function renderAllLists() {
    for (const { list } of listTargets) {
      list.replaceChildren();
      for (const item of images) {
        list.appendChild(buildListItem(item));
      }
    }
    updateListEmptyState();
  }

  /** レイアウトの行列数を計算 */
  function getLayout(count, pattern) {
    if (count === 0) return { cols: 0, rows: 0 };
    switch (pattern) {
      case "row":
        return { cols: count, rows: 1 };
      case "col":
        return { cols: 1, rows: count };
      case "grid": {
        const cols = Math.ceil(Math.sqrt(count));
        return { cols, rows: Math.ceil(count / cols) };
      }
      case "cols-2":
        return { cols: 2, rows: Math.ceil(count / 2) };
      case "cols-3":
        return { cols: 3, rows: Math.ceil(count / 3) };
      case "cols-4":
        return { cols: 4, rows: Math.ceil(count / 4) };
      default:
        return { cols: count, rows: 1 };
    }
  }

  function fitSize(imgW, imgH, cellW, cellH) {
    const scale = Math.min(cellW / imgW, cellH / imgH, 1);
    return { w: Math.floor(imgW * scale), h: Math.floor(imgH * scale) };
  }

  /** 結合画像を描画してキャンバスを返す */
  function buildComposite(scale) {
    const pattern = els.patternSelect.value;
    const padding = Math.max(0, Number(els.paddingInput.value) || 0);
    const gap = Math.max(0, Number(els.gapInput.value) || 0);
    const bg = getBackgroundColor();
    const bgParsed = parseRgba(bg) ?? { r: 255, g: 255, b: 255, a: 1 };

    const { cols, rows } = getLayout(images.length, pattern);

    const cellWidths = new Array(cols).fill(0);
    const cellHeights = new Array(rows).fill(0);

    for (let i = 0; i < images.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const img = images[i].img;
      cellWidths[col] = Math.max(cellWidths[col], img.naturalWidth);
      cellHeights[row] = Math.max(cellHeights[row], img.naturalHeight);
    }

    const contentW = cellWidths.reduce((a, b) => a + b, 0) + gap * (cols - 1);
    const contentH = cellHeights.reduce((a, b) => a + b, 0) + gap * (rows - 1);
    const totalW = Math.max(1, Math.floor((contentW + padding * 2) * scale));
    const totalH = Math.max(1, Math.floor((contentH + padding * 2) * scale));

    const canvas = document.createElement("canvas");
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, totalW, totalH);
    if (bgParsed.a > 0) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, totalW, totalH);
    }

    const scaledPadding = padding * scale;
    const scaledGap = gap * scale;
    const scaledCellW = cellWidths.map((w) => w * scale);
    const scaledCellH = cellHeights.map((h) => h * scale);

    const colOffsets = [];
    let xOff = scaledPadding;
    for (let c = 0; c < cols; c++) {
      colOffsets.push(xOff);
      xOff += scaledCellW[c] + (c < cols - 1 ? scaledGap : 0);
    }

    const rowOffsets = [];
    let yOff = scaledPadding;
    for (let r = 0; r < rows; r++) {
      rowOffsets.push(yOff);
      yOff += scaledCellH[r] + (r < rows - 1 ? scaledGap : 0);
    }

    for (let i = 0; i < images.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const img = images[i].img;
      const cellW = scaledCellW[col];
      const cellH = scaledCellH[row];
      const { w, h } = fitSize(img.naturalWidth * scale, img.naturalHeight * scale, cellW, cellH);
      const dx = colOffsets[col] + (cellW - w) / 2;
      const dy = rowOffsets[row] + (cellH - h) / 2;
      ctx.drawImage(img, dx, dy, w, h);
    }

    return canvas;
  }

  function getResolutionScale() {
    if (images.length === 0) return 1;

    const pattern = els.patternSelect.value;
    const padding = Math.max(0, Number(els.paddingInput.value) || 0);
    const gap = Math.max(0, Number(els.gapInput.value) || 0);
    const { cols, rows } = getLayout(images.length, pattern);

    const cellWidths = new Array(cols).fill(0);
    const cellHeights = new Array(rows).fill(0);
    for (let i = 0; i < images.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const img = images[i].img;
      cellWidths[col] = Math.max(cellWidths[col], img.naturalWidth);
      cellHeights[row] = Math.max(cellHeights[row], img.naturalHeight);
    }
    const contentW = cellWidths.reduce((a, b) => a + b, 0) + gap * (cols - 1);
    const contentH = cellHeights.reduce((a, b) => a + b, 0) + gap * (rows - 1);
    const naturalW = contentW + padding * 2;
    const naturalH = contentH + padding * 2;
    const long = Math.max(naturalW, naturalH);

    const resolution = els.resolutionSelect.value;
    if (resolution === "long-1200") return Math.min(1, 1200 / long);
    if (resolution === "long-2000") return Math.min(1, 2000 / long);
    return 1;
  }

  function renderPreview() {
    if (images.length === 0) {
      els.previewCanvas.width = 0;
      els.previewCanvas.height = 0;
      fullResultCanvas = null;
      els.previewMeta.textContent = "";
      updateListEmptyState();
      return;
    }

    const resolutionScale = getResolutionScale();
    fullResultCanvas = buildComposite(resolutionScale);

    const fullW = fullResultCanvas.width;
    const fullH = fullResultCanvas.height;
    const previewScale = Math.min(1, MAX_PREVIEW_LONG_EDGE / Math.max(fullW, fullH));
    const displayW = Math.max(1, Math.floor(fullW * previewScale));
    const displayH = Math.max(1, Math.floor(fullH * previewScale));

    const canvas = els.previewCanvas;
    canvas.width = displayW;
    canvas.height = displayH;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, displayW, displayH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(fullResultCanvas, 0, 0, displayW, displayH);

    const sizeNote =
      previewScale < 1
        ? `${fullW} × ${fullH} px（プレビュー ${displayW} × ${displayH} px）`
        : `${fullW} × ${fullH} px`;
    els.previewMeta.textContent = `${sizeNote} · ${images.length} 枚`;
    els.saveBtn.disabled = false;
    els.previewPlaceholder.hidden = true;
  }

  function loadFiles(files) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;

    let pending = list.length;
    for (const file of list) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        images.push({ id: nextId++, name: file.name, img, url });
        pending -= 1;
        if (pending === 0) {
          renderAllLists();
          renderPreview();
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        pending -= 1;
      };
      img.src = url;
    }
  }

  function addFromBlob(blob, name) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        images.push({ id: nextId++, name, img, url });
        renderAllLists();
        renderPreview();
        resolve(images.length);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
      img.src = url;
    });
  }

  function clearAll() {
    for (const item of images) URL.revokeObjectURL(item.url);
    images = [];
    fullResultCanvas = null;
    renderAllLists();
    renderPreview();
  }

  function getImageCount() {
    return images.length;
  }

  function getOutputBlob() {
    return new Promise((resolve) => {
      if (!fullResultCanvas?.width) {
        resolve(null);
        return;
      }
      fullResultCanvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  els.addBtn.addEventListener("click", () => els.fileInput.click());
  els.fileInput.addEventListener("change", (e) => {
    loadFiles(e.target.files);
    e.target.value = "";
  });
  els.clearBtn.addEventListener("click", clearAll);

  els.bgPicker.addEventListener("input", () => {
    syncBgFromPicker();
    renderPreview();
  });
  els.bgAlpha.addEventListener("input", () => {
    syncBgFromPicker();
    renderPreview();
  });
  els.bgInput.addEventListener("change", () => {
    syncBgControlsFromRgba(els.bgInput.value);
    renderPreview();
  });

  for (const el of [
    els.patternSelect,
    els.resolutionSelect,
    els.paddingInput,
    els.gapInput,
  ]) {
    el.addEventListener("input", renderPreview);
    el.addEventListener("change", renderPreview);
  }

  for (const { list, reorder } of listTargets) {
    list.addEventListener("dragover", (e) => e.preventDefault());
    list.addEventListener("drop", (e) => {
      e.preventDefault();
      if (e.dataTransfer?.files?.length) {
        loadFiles(e.dataTransfer.files);
      }
    });
    if (reorder) {
      bindSortableList(list, {
        onReorder: reorderFromIds,
      });
    }
  }

  syncBgControlsFromRgba(els.bgInput.value);
  updateListEmptyState();

  return { addFromBlob, loadFiles, renderPreview, getImageCount, getOutputBlob };
}
