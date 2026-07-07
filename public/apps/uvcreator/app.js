/**
 * UVcreator — 台形補正 + 画像結合
 */

import { createTidyEditor } from "./modules/tidy.js";
import { createCombineEditor } from "./modules/combine.js";

const APP_SLUG = "uvcreator";

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href = `/login/?next=${encodeURIComponent("/apps/uvcreator/")}`;
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  document.getElementById("app-main").hidden = false;
  return true;
}

/** タブ切替 */
function initTabs() {
  const tabs = document.querySelectorAll(".uv-tab");
  const panels = {
    tidy: document.getElementById("panel-tidy"),
    combine: document.getElementById("panel-combine"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      Object.entries(panels).forEach(([key, panel]) => {
        const active = key === id;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });

  return {
    openCombine() {
      document.querySelector('.uv-tab[data-tab="combine"]')?.click();
    },
  };
}

const allowed = await checkAccess();
if (!allowed) {
  // アクセス拒否時は初期化しない
} else {
  const tabs = initTabs();

  const combine = createCombineEditor({
    list: document.getElementById("combine-img-list"),
    extraLists: [document.getElementById("tidy-queue-list")],
    queueCount: document.getElementById("tidy-queue-count"),
    queueCard: document.getElementById("tidy-queue-card"),
    addBtn: document.getElementById("combine-add"),
    clearBtn: document.getElementById("combine-clear"),
    fileInput: document.getElementById("combine-file-input"),
    patternSelect: document.getElementById("combine-pattern"),
    resolutionSelect: document.getElementById("combine-resolution"),
    paddingInput: document.getElementById("combine-padding"),
    gapInput: document.getElementById("combine-gap"),
    bgInput: document.getElementById("combine-bg"),
    bgPicker: document.getElementById("combine-bg-picker"),
    bgAlpha: document.getElementById("combine-bg-alpha"),
    bgAlphaValue: document.getElementById("combine-bg-alpha-value"),
    previewCanvas: document.getElementById("combine-preview-canvas"),
    previewPlaceholder: document.getElementById("combine-preview-placeholder"),
    previewMeta: document.getElementById("combine-preview-meta"),
    filenameInput: document.getElementById("combine-filename"),
    saveBtn: document.getElementById("combine-save"),
  });

  createTidyEditor({
    loadInput: document.getElementById("tidy-load"),
    inputWrap: document.getElementById("tidy-input-wrap"),
    dropZone: document.getElementById("tidy-drop-zone"),
    inputCanvas: document.getElementById("tidy-input-canvas"),
    outputCanvas: document.getElementById("tidy-output-canvas"),
    inputPlaceholder: document.getElementById("tidy-input-placeholder"),
    outputPlaceholder: document.getElementById("tidy-output-placeholder"),
    filenameInput: document.getElementById("tidy-filename"),
    ccwBtn: document.getElementById("tidy-ccw"),
    cwBtn: document.getElementById("tidy-cw"),
    saveBtn: document.getElementById("tidy-save"),
    sendCombineBtn: document.getElementById("tidy-add-combine"),
  });

  const feedbackEl = document.getElementById("tidy-add-feedback");
  let feedbackTimer = null;

  function showAddFeedback(count) {
    feedbackEl.textContent = `結合リストに追加しました（合計 ${count} 枚）`;
    feedbackEl.hidden = false;
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      feedbackEl.hidden = true;
    }, 3000);
  }

  document.getElementById("tidy-add-combine").addEventListener("click", async () => {
    const outputCanvas = document.getElementById("tidy-output-canvas");
    if (!outputCanvas.width) return;

    const blob = await new Promise((resolve) => {
      outputCanvas.toBlob((b) => resolve(b), "image/jpeg", 0.92);
    });
    if (!blob) return;

    const name = `${document.getElementById("tidy-filename").value || "corrected"}.jpg`;
    const count = await combine.addFromBlob(blob, name);
    if (count > 0) showAddFeedback(count);
  });

  document.getElementById("tidy-goto-combine").addEventListener("click", () => {
    tabs.openCombine();
  });
}
