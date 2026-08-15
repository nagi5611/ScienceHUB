/**
 * クラウドストレージからファイルを選ぶモーダル（共通）
 */

import { apiRequest, fetchDownloadBlob } from "../apps/cloud-storage/js/api.js";

/** HTML エスケープ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** バイト数を表示用に整形 */
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * クラウド読み込みモーダルを生成
 * @param {HTMLDialogElement} dialogEl
 * @param {{ idPrefix?: string, loginNext?: string }} [options]
 */
export function createCloudOpenModal(dialogEl, options = {}) {
  const idPrefix = options.idPrefix ?? "cloud-open";
  const loginNext = options.loginNext ?? "/apps/cloud-storage/";

  /** @type {Array<{ path: string, type: string, label: string }>} */
  let roots = [];
  let currentPath = "";
  let accessOk = false;
  let loading = false;
  /** @type {Set<string>} */
  let selectedPaths = new Set();
  /** @type {((files: File[]) => void) | null} */
  let onFilesLoaded = null;

  const els = {
    alert: dialogEl.querySelector(`#${idPrefix}-alert`),
    denied: dialogEl.querySelector(`#${idPrefix}-denied`),
    body: dialogEl.querySelector(`#${idPrefix}-body`),
    roots: dialogEl.querySelector(`#${idPrefix}-roots`),
    breadcrumb: dialogEl.querySelector(`#${idPrefix}-breadcrumb`),
    items: dialogEl.querySelector(`#${idPrefix}-items`),
    submit: dialogEl.querySelector(`#${idPrefix}-submit`),
    openStorage: dialogEl.querySelector(`#${idPrefix}-open`),
    closeBtns: dialogEl.querySelectorAll("[data-cloud-open-close]"),
  };

  function setAlert(message, type = "error") {
    if (!els.alert) return;
    if (!message) {
      els.alert.hidden = true;
      els.alert.textContent = "";
      return;
    }
    els.alert.hidden = false;
    els.alert.className = `cloud-save-alert cloud-save-alert--${type}`;
    els.alert.textContent = message;
  }

  function setBusy(busy) {
    loading = busy;
    if (els.submit) els.submit.disabled = busy || !accessOk || selectedPaths.size === 0;
    dialogEl
      .querySelectorAll(".cloud-save-root-btn, .cloud-save-folder-btn, .cloud-save-file-btn")
      .forEach((btn) => {
        btn.disabled = busy;
      });
  }

  function renderBreadcrumb() {
    if (!els.breadcrumb || !currentPath) {
      if (els.breadcrumb) els.breadcrumb.innerHTML = "";
      return;
    }

    const parts = currentPath.split("/").filter(Boolean);
    const crumbs = [];
    let acc = "";

    for (let i = 0; i < parts.length; i++) {
      acc = acc ? `${acc}/${parts[i]}` : parts[i];
      const label =
        i === 0 ? (parts[0] === "u" ? "個人" : "グループ") : i === 1 ? parts[1] : parts[i];
      crumbs.push(
        `<button type="button" class="cloud-save-crumb" data-path="${escapeHtml(acc)}">${escapeHtml(label)}</button>`
      );
    }

    els.breadcrumb.innerHTML = crumbs.join(
      '<span class="cloud-save-crumb-sep">/</span>'
    );

    els.breadcrumb.querySelectorAll(".cloud-save-crumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (loading) return;
        currentPath = btn.dataset.path ?? "";
        selectedPaths = new Set();
        loadItems();
      });
    });
  }

  function renderRoots() {
    if (!els.roots) return;

    els.roots.innerHTML = roots
      .map(
        (root) => `
      <button
        type="button"
        class="cloud-save-root-btn${
          currentPath === root.path || currentPath.startsWith(`${root.path}/`)
            ? " is-active"
            : ""
        }"
        data-path="${escapeHtml(root.path)}"
      >
        <span class="cloud-save-root-icon" aria-hidden="true">${
          root.type === "user" ? "👤" : "👥"
        }</span>
        <span class="cloud-save-root-label">${escapeHtml(root.label)}</span>
      </button>`
      )
      .join("");

    els.roots.querySelectorAll(".cloud-save-root-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (loading) return;
        currentPath = btn.dataset.path ?? "";
        selectedPaths = new Set();
        loadItems();
      });
    });
  }

  async function loadItems() {
    if (!els.items || !currentPath) return;

    renderRoots();
    renderBreadcrumb();
    els.items.innerHTML = `<p class="cloud-save-folders-status">読み込み中…</p>`;

    try {
      const data = await apiRequest(
        `list?path=${encodeURIComponent(currentPath)}&limit=200&sort=name&order=asc`
      );
      const items = data.items ?? [];
      const folders = items.filter((item) => item.type === "folder");
      const files = items.filter((item) => item.type === "file");

      if (folders.length === 0 && files.length === 0) {
        els.items.innerHTML = `<p class="cloud-save-folders-status">このフォルダにファイルはありません。</p>`;
        if (els.submit) els.submit.disabled = true;
        return;
      }

      const folderHtml = folders
        .map(
          (folder) => `
        <button type="button" class="cloud-save-folder-btn" data-path="${escapeHtml(folder.path)}">
          <span class="cloud-save-folder-icon" aria-hidden="true">📁</span>
          <span class="cloud-save-folder-name">${escapeHtml(folder.name)}</span>
        </button>`
        )
        .join("");

      const fileHtml = files
        .map((file) => {
          const checked = selectedPaths.has(file.path) ? " checked" : "";
          return `
        <label class="cloud-save-file-row">
          <input type="checkbox" class="cloud-save-file-check" data-path="${escapeHtml(file.path)}" data-name="${escapeHtml(file.name)}"${checked}>
          <span class="cloud-save-file-icon" aria-hidden="true">📄</span>
          <span class="cloud-save-file-name">${escapeHtml(file.name)}</span>
          <span class="cloud-save-file-size">${formatBytes(file.sizeBytes)}</span>
        </label>`;
        })
        .join("");

      els.items.innerHTML = folderHtml + fileHtml;

      els.items.querySelectorAll(".cloud-save-folder-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (loading) return;
          currentPath = btn.dataset.path ?? currentPath;
          selectedPaths = new Set();
          loadItems();
        });
      });

      els.items.querySelectorAll(".cloud-save-file-check").forEach((input) => {
        input.addEventListener("change", () => {
          const path = input.dataset.path;
          if (!path) return;
          if (input.checked) {
            selectedPaths.add(path);
          } else {
            selectedPaths.delete(path);
          }
          if (els.submit) els.submit.disabled = loading || selectedPaths.size === 0;
        });
      });

      if (els.submit) els.submit.disabled = loading || selectedPaths.size === 0;
    } catch (err) {
      els.items.innerHTML = `<p class="cloud-save-folders-status cloud-save-folders-status--error">${escapeHtml(
        err instanceof Error ? err.message : "読み込みに失敗しました"
      )}</p>`;
    }
  }

  async function ensureAccess() {
    const res = await fetch("/api/storage/access", { credentials: "same-origin" });
    if (res.status === 401) {
      window.location.href = `/login/?next=${encodeURIComponent(loginNext)}`;
      return false;
    }
    if (!res.ok) return false;
    const data = await res.json().catch(() => ({}));
    return Boolean(data.allowed);
  }

  async function prepareStorage() {
    setAlert("");
    if (els.denied) els.denied.hidden = true;
    if (els.body) els.body.hidden = false;

    accessOk = await ensureAccess();
    if (!accessOk) {
      if (els.body) els.body.hidden = true;
      if (els.denied) els.denied.hidden = false;
      if (els.submit) els.submit.disabled = true;
      return;
    }

    const data = await apiRequest("roots");
    roots = data.roots ?? [];
    currentPath = roots[0]?.path ?? "";
    selectedPaths = new Set();
    renderRoots();
    await loadItems();
    if (els.submit) els.submit.disabled = true;
  }

  function close() {
    if (loading) return;
    dialogEl.close();
    selectedPaths = new Set();
    onFilesLoaded = null;
    setAlert("");
  }

  async function open({ onFilesLoaded: onLoaded }) {
    onFilesLoaded = onLoaded ?? null;
    setBusy(false);
    setAlert("");

    if (typeof dialogEl.showModal === "function") {
      dialogEl.showModal();
    } else {
      dialogEl.setAttribute("open", "");
    }

    try {
      await prepareStorage();
    } catch (err) {
      setAlert(err instanceof Error ? err.message : "ストレージの準備に失敗しました");
      if (els.body) els.body.hidden = true;
    }
  }

  async function submit() {
    if (loading || selectedPaths.size === 0) return;

    const paths = [...selectedPaths];
    setAlert("");
    setBusy(true);

    try {
      const files = [];
      for (const storagePath of paths) {
        const name = storagePath.split("/").pop() || "file";
        const blob = await fetchDownloadBlob(storagePath);
        files.push(new File([blob], name, { type: blob.type || "application/octet-stream" }));
      }

      onFilesLoaded?.(files);
      setBusy(false);
      close();
    } catch (err) {
      setAlert(err instanceof Error ? err.message : "ファイルの取得に失敗しました");
      setBusy(false);
    }
  }

  els.submit?.addEventListener("click", () => {
    submit().catch((err) => setAlert(err.message));
  });

  els.closeBtns?.forEach((btn) => {
    btn.addEventListener("click", close);
  });

  dialogEl.addEventListener("cancel", (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    close();
  });

  els.openStorage?.addEventListener("click", () => {
    window.open("/apps/cloud-storage/", "_blank", "noopener,noreferrer");
  });

  return { open, close };
}
