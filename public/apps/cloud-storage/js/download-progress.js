/**
 * ファイル一覧上のダウンロード進捗（円形インジケータ）
 */

import { findFileEntryByPath } from "./list-dom.js";

const RING_RADIUS = 10;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function createRingElement() {
  const wrap = document.createElement("span");
  wrap.className = "cs-download-ring";
  wrap.setAttribute("role", "progressbar");
  wrap.setAttribute("aria-valuemin", "0");
  wrap.setAttribute("aria-valuemax", "100");
  wrap.setAttribute("aria-valuenow", "0");
  wrap.setAttribute("aria-label", "ダウンロード中");
  wrap.innerHTML = `
    <svg class="cs-download-ring-svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle class="cs-download-ring-bg" cx="12" cy="12" r="${RING_RADIUS}" fill="none" stroke-width="2.5"></circle>
      <circle class="cs-download-ring-fg" cx="12" cy="12" r="${RING_RADIUS}" fill="none" stroke-width="2.5"
        stroke-dasharray="${CIRCUMFERENCE}" stroke-dashoffset="${CIRCUMFERENCE}"
        transform="rotate(-90 12 12)"></circle>
    </svg>`;
  return wrap;
}

function mountRing(entry) {
  let ring = entry.querySelector(".cs-download-ring");
  if (ring) return ring;

  ring = createRingElement();
  const nameCell = entry.querySelector(".cs-file-name-cell");
  if (nameCell) {
    nameCell.appendChild(ring);
    return ring;
  }

  if (entry.classList.contains("cs-icon-tile")) {
    entry.appendChild(ring);
    return ring;
  }

  return null;
}

function updateRingVisual(ring, entry, state) {
  const fg = ring.querySelector(".cs-download-ring-fg");
  if (!fg) return;

  entry.classList.add("is-downloading");

  if (state.indeterminate || state.percent == null) {
    ring.classList.add("is-indeterminate");
    ring.removeAttribute("aria-valuenow");
    return;
  }

  ring.classList.remove("is-indeterminate");
  const pct = Math.min(100, Math.max(0, state.percent));
  ring.setAttribute("aria-valuenow", String(Math.round(pct)));
  fg.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - pct / 100));
}

function detachRing(entry) {
  entry.classList.remove("is-downloading");
  entry.querySelector(".cs-download-ring")?.remove();
}

/** 一覧の各行にダウンロード進捗リングを表示 */
export function createDownloadProgress() {
  /** @type {Map<string, { status: string, percent: number | null, indeterminate: boolean, hideTimer?: ReturnType<typeof setTimeout> }>} */
  const active = new Map();

  function syncEntry(path) {
    const state = active.get(path);
    const entry = findFileEntryByPath(path);
    if (!entry) return;

    if (!state || state.status === "idle") {
      detachRing(entry);
      return;
    }

    const ring = mountRing(entry);
    if (!ring) return;

    if (state.status === "done") {
      updateRingVisual(ring, entry, { percent: 100, indeterminate: false });
      ring.classList.add("is-complete");
      return;
    }

    if (state.status === "error") {
      ring.classList.add("is-error");
      ring.classList.remove("is-indeterminate");
      updateRingVisual(ring, entry, { percent: state.percent ?? 0, indeterminate: false });
      return;
    }

    ring.classList.remove("is-error", "is-complete");
    updateRingVisual(ring, entry, state);
  }

  function syncAll() {
    for (const path of active.keys()) {
      syncEntry(path);
    }
  }

  function scheduleHide(path, delayMs = 700) {
    const state = active.get(path);
    if (!state) return;
    if (state.hideTimer) clearTimeout(state.hideTimer);
    state.hideTimer = setTimeout(() => {
      active.delete(path);
      const entry = findFileEntryByPath(path);
      if (entry) detachRing(entry);
    }, delayMs);
  }

  const api = {
    syncAll,

    fileStart(storagePath, detail = {}) {
      const knownTotal =
        typeof detail.totalBytes === "number" && detail.totalBytes > 0
          ? detail.totalBytes
          : null;
      active.set(storagePath, {
        status: "downloading",
        percent: 0,
        indeterminate: knownTotal == null,
      });
      syncEntry(storagePath);
    },

    fileProgress(storagePath, detail = {}) {
      const state = active.get(storagePath);
      if (!state) return;

      const total =
        typeof detail.total === "number" && detail.total > 0 ? detail.total : null;
      const loaded = typeof detail.loaded === "number" ? detail.loaded : 0;

      if (typeof detail.percent === "number") {
        state.percent = detail.percent;
        state.indeterminate = false;
      } else if (total != null) {
        state.percent = Math.round((loaded / total) * 100);
        state.indeterminate = false;
      } else {
        state.indeterminate = true;
        state.percent = null;
      }

      state.status = "downloading";
      syncEntry(storagePath);
    },

    fileComplete(storagePath, outcome = {}) {
      const state = active.get(storagePath);
      if (!state) return;

      if (state.hideTimer) clearTimeout(state.hideTimer);

      if (outcome.ok) {
        state.status = "done";
        state.percent = 100;
        state.indeterminate = false;
        syncEntry(storagePath);
        scheduleHide(storagePath);
        return;
      }

      state.status = "error";
      syncEntry(storagePath);
      scheduleHide(storagePath, 2000);
    },

    /** downloadItems / downloadSingleFile 用コールバック */
    hooks() {
      return {
        onFileStart: (storagePath, detail) => api.fileStart(storagePath, detail),
        onFileProgress: (storagePath, detail) => api.fileProgress(storagePath, detail),
        onFileComplete: (storagePath, outcome) => api.fileComplete(storagePath, outcome),
      };
    },
  };

  return api;
}
