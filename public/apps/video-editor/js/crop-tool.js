/**
 * クロップオーバーレイ — ドラッグ・リサイズ
 */

/** @typedef {{ x: number, y: number, w: number, h: number }} CropRect */

/**
 * @param {HTMLElement} previewWrap
 * @param {() => CropRect} getCrop
 * @param {(crop: CropRect) => void} setCrop
 * @param {() => boolean} isEnabled
 */
export function initCropOverlay(previewWrap, getCrop, setCrop, isEnabled) {
  let overlay = previewWrap.querySelector("#crop-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "crop-overlay";
    overlay.className = "ve-crop-overlay";
    overlay.innerHTML = `
      <div class="ve-crop-box" id="crop-box">
        <span class="ve-crop-handle ve-crop-handle--nw" data-handle="nw"></span>
        <span class="ve-crop-handle ve-crop-handle--ne" data-handle="ne"></span>
        <span class="ve-crop-handle ve-crop-handle--sw" data-handle="sw"></span>
        <span class="ve-crop-handle ve-crop-handle--se" data-handle="se"></span>
        <span class="ve-crop-handle ve-crop-handle--move" data-handle="move"></span>
      </div>`;
    previewWrap.appendChild(overlay);
  }

  const box = overlay.querySelector("#crop-box");
  if (!(box instanceof HTMLElement)) return { update: () => {}, destroy: () => {} };

  /** @type {string | null} */
  let dragHandle = null;
  let startCrop = /** @type {CropRect} */ ({ x: 0, y: 0, w: 1, h: 1 });
  let startX = 0;
  let startY = 0;

  function applyDom(crop) {
    box.style.left = `${crop.x * 100}%`;
    box.style.top = `${crop.y * 100}%`;
    box.style.width = `${crop.w * 100}%`;
    box.style.height = `${crop.h * 100}%`;
  }

  function update() {
    if (!isEnabled()) {
      overlay.hidden = true;
      return;
    }
    overlay.hidden = false;
    applyDom(getCrop());
  }

  function onMove(event) {
    if (!dragHandle) return;
    const rect = previewWrap.getBoundingClientRect();
    const dx = (event.clientX - startX) / rect.width;
    const dy = (event.clientY - startY) / rect.height;
    const min = 0.05;
    let { x, y, w, h } = startCrop;

    if (dragHandle === "move") {
      x = Math.max(0, Math.min(1 - w, startCrop.x + dx));
      y = Math.max(0, Math.min(1 - h, startCrop.y + dy));
    } else if (dragHandle === "se") {
      w = Math.max(min, Math.min(1 - x, startCrop.w + dx));
      h = Math.max(min, Math.min(1 - y, startCrop.h + dy));
    } else if (dragHandle === "sw") {
      const newX = Math.max(0, Math.min(startCrop.x + startCrop.w - min, startCrop.x + dx));
      w = startCrop.x + startCrop.w - newX;
      x = newX;
      h = Math.max(min, Math.min(1 - y, startCrop.h + dy));
    } else if (dragHandle === "ne") {
      w = Math.max(min, Math.min(1 - x, startCrop.w + dx));
      const newY = Math.max(0, Math.min(startCrop.y + startCrop.h - min, startCrop.y + dy));
      h = startCrop.y + startCrop.h - newY;
      y = newY;
    } else if (dragHandle === "nw") {
      const newX = Math.max(0, Math.min(startCrop.x + startCrop.w - min, startCrop.x + dx));
      w = startCrop.x + startCrop.w - newX;
      x = newX;
      const newY = Math.max(0, Math.min(startCrop.y + startCrop.h - min, startCrop.y + dy));
      h = startCrop.y + startCrop.h - newY;
      y = newY;
    }

    setCrop({ x, y, w, h });
    applyDom(getCrop());
  }

  function onUp() {
    dragHandle = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  }

  box.querySelectorAll(".ve-crop-handle").forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      if (!isEnabled()) return;
      event.preventDefault();
      event.stopPropagation();
      dragHandle = handle.getAttribute("data-handle");
      startCrop = { ...getCrop() };
      startX = event.clientX;
      startY = event.clientY;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    });
  });

  return {
    update,
    destroy() {
      overlay?.remove();
    },
  };
}
