/**
 * 123APPS 風テキストオーバーレイ（動画上 contenteditable + 下部ツールバー）
 */

/** @typedef {{
 *   id: string,
 *   content: string,
 *   x: number,
 *   y: number,
 *   fontSize: number,
 *   color: string,
 *   fontFamily: string,
 *   align: "left" | "center" | "right",
 *   bold: boolean,
 *   italic: boolean,
 *   opacity: number,
 * }} TextItem */

export const FONT_FAMILIES = [
  { id: "arial", label: "Arial", value: "Arial, sans-serif" },
  { id: "helvetica", label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { id: "georgia", label: "Georgia", value: "Georgia, serif" },
  { id: "times", label: "Times New Roman", value: '"Times New Roman", serif' },
  { id: "courier", label: "Courier New", value: '"Courier New", monospace' },
  { id: "opensans", label: "Open Sans", value: '"Open Sans", sans-serif' },
];

export const FONT_SIZES = [
  { id: "s16", label: "16", value: 16 },
  { id: "s18", label: "18", value: 18 },
  { id: "s24", label: "24", value: 24 },
  { id: "s32", label: "32", value: 32 },
  { id: "s48", label: "48", value: 48 },
  { id: "s64", label: "64", value: 64 },
  { id: "s96", label: "96", value: 96 },
];

/** @param {string} [seed] */
function createId(seed = "") {
  return `txt-${Date.now()}-${seed}${Math.random().toString(36).slice(2, 7)}`;
}

/** @returns {TextItem} */
export function createDefaultText(x, y) {
  return {
    id: createId(),
    content: "",
    x,
    y,
    fontSize: FONT_SIZES[3].value,
    color: "#ffffff",
    fontFamily: FONT_FAMILIES[0].value,
    align: "center",
    bold: false,
    italic: false,
    opacity: 100,
  };
}

/**
 * @param {HTMLElement} container
 * @param {TextItem} item
 * @param {(item: TextItem) => void} onChange
 * @param {(item: TextItem) => void} onSelect
 */
function renderTextNode(container, item, onChange, onSelect) {
  let el = container.querySelector(`[data-text-id="${item.id}"]`);
  if (!(el instanceof HTMLElement)) {
    el = document.createElement("div");
    el.className = "ve-txt";
    el.dataset.textId = item.id;
    el.contentEditable = "true";
    el.spellcheck = false;
    el.draggable = false;
    el.addEventListener("input", () => {
      item.content = el.textContent || "";
      onChange(item);
    });
    el.addEventListener("focus", () => onSelect(item));
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      onSelect(item);
      startDrag(event, el, item, container, onChange);
    });
    container.appendChild(el);
  }

  applyTextStyle(el, item);
  if (document.activeElement !== el && el.textContent !== item.content) {
    el.textContent = item.content;
  }
  return el;
}

/** @param {HTMLElement} el @param {TextItem} item */
function applyTextStyle(el, item) {
  el.style.left = `${item.x}px`;
  el.style.top = `${item.y}px`;
  el.style.color = item.color;
  el.style.fontSize = `${item.fontSize}px`;
  el.style.fontFamily = item.fontFamily;
  el.style.fontWeight = item.bold ? "700" : "400";
  el.style.fontStyle = item.italic ? "italic" : "normal";
  el.style.textAlign = item.align;
  el.style.opacity = String(item.opacity / 100);
  el.dataset.align = item.align;
}

/**
 * @param {MouseEvent} event
 * @param {HTMLElement} el
 * @param {TextItem} item
 * @param {HTMLElement} container
 * @param {(item: TextItem) => void} onChange
 */
function startDrag(event, el, item, container, onChange) {
  if (event.button !== 0) return;
  const rect = container.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const originX = item.x;
  const originY = item.y;

  /** @param {PointerEvent} moveEvent */
  function onMove(moveEvent) {
    item.x = Math.round(originX + (moveEvent.clientX - startX));
    item.y = Math.round(originY + (moveEvent.clientY - startY));
    item.x = Math.max(0, Math.min(item.x, rect.width - 20));
    item.y = Math.max(0, Math.min(item.y, rect.height - 20));
    applyTextStyle(el, item);
    onChange(item);
  }

  function onUp() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}

/**
 * @param {HTMLElement} container
 * @param {TextItem[]} texts
 * @param {TextItem | null} activeText
 * @param {(item: TextItem) => void} onChange
 * @param {(item: TextItem) => void} onSelect
 */
export function syncTextOverlay(container, texts, activeText, onChange, onSelect) {
  const ids = new Set(texts.map((t) => t.id));
  container.querySelectorAll(".ve-txt").forEach((node) => {
    if (node instanceof HTMLElement && !ids.has(node.dataset.textId || "")) {
      node.remove();
    }
  });

  for (const item of texts) {
    const el = renderTextNode(container, item, onChange, onSelect);
    el.classList.toggle("is-active", activeText?.id === item.id);
  }

  container.dataset.empty = texts.length === 0 ? "true" : "false";
}

/**
 * @param {HTMLElement} container
 * @param {number} clientX
 * @param {number} clientY
 */
export function pointInContainer(container, clientX, clientY) {
  const rect = container.getBoundingClientRect();
  return {
    x: Math.round(clientX - rect.left),
    y: Math.round(clientY - rect.top),
    rect,
  };
}

/** @param {TextItem[]} texts @param {string | null} id */
export function removeText(texts, id) {
  return texts.filter((t) => t.id !== id);
}

/** @param {HTMLVideoElement} video @param {HTMLElement} container @param {TextItem} item */
export function textToExportCoords(video, container, item) {
  const rect = container.getBoundingClientRect();
  const scaleX = video.videoWidth / Math.max(1, rect.width);
  const scaleY = video.videoHeight / Math.max(1, rect.height);
  const x = Math.round(item.x * scaleX);
  const y = Math.round(item.y * scaleY + item.fontSize * scaleY * 0.85);
  const fontSize = Math.max(12, Math.round(item.fontSize * scaleY));
  return { x, y, fontSize };
}
