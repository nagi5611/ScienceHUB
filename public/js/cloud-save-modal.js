/**
 * クラウドストレージへ保存するモーダル（共通）
 * dialog 内の要素は `${idPrefix}-*` の ID を持つこと
 */

import { apiRequest } from "../apps/cloud-storage/js/api.js";
import { uploadFile } from "../apps/cloud-storage/js/upload.js";

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
 * クラウド保存モーダルを生成
 * @param {HTMLDialogElement} dialogEl
 * @param {{ idPrefix?: string, loginNext?: string }} [options]
 */
export function createCloudSaveModal(dialogEl, options = {}) {
  const idPrefix = options.idPrefix ?? "uv-cloud-save";
  const loginNext = options.loginNext ?? "/apps/cloud-storage/";

  /** @type {{ blob: Blob, filename: string } | null} */
  let pending = null;
  /** @type {Array<{ path: string, type: string, label: string }>} */
  let roots = [];
  let currentPath = "";
  let accessOk = false;
  let uploading = false;
  let pickMode = false;
  /** @type {((dest: { folderPath: string, filename: string }) => void) | null} */
  let onDestinationPicked = null;
  const submitLabelSave = options.submitLabelSave ?? "保存する";
  const submitLabelPick = options.submitLabelPick ?? "この保存先を使う";

  const els = {
    alert: dialogEl.querySelector(`#${idPrefix}-alert`),
    denied: dialogEl.querySelector(`#${idPrefix}-denied`),
    body: dialogEl.querySelector(`#${idPrefix}-body`),
    roots: dialogEl.querySelector(`#${idPrefix}-roots`),
    breadcrumb: dialogEl.querySelector(`#${idPrefix}-breadcrumb`),
    folders: dialogEl.querySelector(`#${idPrefix}-folders`),
    filename: dialogEl.querySelector(`#${idPrefix}-filename`),
    progress: dialogEl.querySelector(`#${idPrefix}-progress`),
    progressBar: dialogEl.querySelector(`#${idPrefix}-progress-bar`),
    progressLabel: dialogEl.querySelector(`#${idPrefix}-progress-label`),
    submit: dialogEl.querySelector(`#${idPrefix}-submit`),
    openStorage: dialogEl.querySelector(`#${idPrefix}-open`),
    closeBtns: dialogEl.querySelectorAll("[data-cloud-save-close]"),
  };

  function setAlert(message, type = "error") {
    if (!els.alert) return;
    if (!message) {
      els.alert.hidden = true;
      els.alert.innerHTML = "";
      return;
    }
    els.alert.hidden = false;
    els.alert.className = `cloud-save-alert cloud-save-alert--${type}`;
    els.alert.textContent = message;
  }

  function setProgress(visible, percent = 0, label = "") {
    if (els.progress) els.progress.hidden = !visible;
    if (els.progressBar) {
      els.progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }
    if (els.progressLabel) els.progressLabel.textContent = label;
  }

  function setBusy(busy) {
    uploading = busy;
    if (els.submit) els.submit.disabled = busy || !accessOk || !currentPath;
    dialogEl
      .querySelectorAll(".cloud-save-root-btn, .cloud-save-folder-btn, .cloud-save-crumb")
      .forEach((btn) => {
        btn.disabled = busy;
      });
    if (els.filename) els.filename.disabled = busy;
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
        if (uploading) return;
        currentPath = btn.dataset.path ?? "";
        loadFolders();
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
        if (uploading) return;
        currentPath = btn.dataset.path ?? "";
        loadFolders();
      });
    });
  }

  async function loadFolders() {
    if (!els.folders || !currentPath) return;

    renderRoots();
    renderBreadcrumb();
    els.folders.innerHTML = `<p class="cloud-save-folders-status">読み込み中…</p>`;

    try {
      const data = await apiRequest(
        `list?path=${encodeURIComponent(currentPath)}&limit=200&sort=name&order=asc`
      );
      const folders = (data.items ?? []).filter((item) => item.type === "folder");

      if (folders.length === 0) {
        els.folders.innerHTML = `<p class="cloud-save-folders-status">このフォルダにサブフォルダはありません。ここに保存できます。</p>`;
        return;
      }

      els.folders.innerHTML = folders
        .map(
          (folder) => `
        <button type="button" class="cloud-save-folder-btn" data-path="${escapeHtml(folder.path)}">
          <span class="cloud-save-folder-icon" aria-hidden="true">📁</span>
          <span class="cloud-save-folder-name">${escapeHtml(folder.name)}</span>
        </button>`
        )
        .join("");

      els.folders.querySelectorAll(".cloud-save-folder-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (uploading) return;
          currentPath = btn.dataset.path ?? currentPath;
          loadFolders();
        });
      });
    } catch (err) {
      els.folders.innerHTML = `<p class="cloud-save-folders-status cloud-save-folders-status--error">${escapeHtml(
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
    renderRoots();
    await loadFolders();
    if (els.submit) els.submit.disabled = !currentPath;
  }

  function close() {
    if (uploading) return;
    dialogEl.close();
    pending = null;
    pickMode = false;
    onDestinationPicked = null;
    setProgress(false);
    setAlert("");
  }

  async function open({ blob, filename, mode = "save", onDestinationPicked: onPick }) {
    pickMode = mode === "pick";
    onDestinationPicked = onPick ?? null;
    pending = { blob, filename };
    if (els.filename) els.filename.value = filename;
    if (els.submit) {
      els.submit.textContent = pickMode ? submitLabelPick : submitLabelSave;
      els.submit.disabled = false;
    }
    setProgress(false);
    setBusy(false);

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
    if (!currentPath || uploading) return;

    const name = els.filename?.value?.trim() || pending?.filename;
    if (!name) {
      setAlert("ファイル名を入力してください");
      return;
    }

    if (pickMode) {
      onDestinationPicked?.({ folderPath: currentPath, filename: name });
      close();
      return;
    }

    if (!pending) return;

    const file = new File([pending.blob], name, {
      type: pending.blob.type || "application/octet-stream",
    });

    setAlert("");
    setBusy(true);
    setProgress(true, 0, "アップロードを開始しています…");

    try {
      await uploadFile(currentPath, file, {
        onProgress: (detail) => {
          const speed =
            detail.speedBps > 0 ? ` — ${formatBytes(detail.speedBps)}/s` : "";
          setProgress(
            true,
            detail.percent ?? 0,
            `${detail.percent ?? 0}%（${formatBytes(detail.bytesUploaded)} / ${formatBytes(
              detail.totalBytes
            )}）${speed}`
          );
        },
      });

      setProgress(true, 100, "保存が完了しました");
      setAlert(`「${name}」をクラウドストレージに保存しました。`, "success");
      pending = null;
      if (els.submit) els.submit.disabled = true;
    } catch (err) {
      setAlert(err instanceof Error ? err.message : "保存に失敗しました");
      setProgress(false);
    } finally {
      setBusy(false);
    }
  }

  /**
   * 保存先フォルダに直接アップロード
   * @param {string} folderPath
   * @param {Blob} blob
   * @param {string} filename
   * @param {{ onProgress?: (detail: object) => void }} [callbacks]
   */
  async function uploadTo(folderPath, blob, filename, callbacks = {}) {
    const file = new File([blob], filename, {
      type: blob.type || "application/octet-stream",
    });
    return uploadFile(folderPath, file, {
      filename,
      onProgress: callbacks.onProgress,
    });
  }

  els.submit?.addEventListener("click", () => {
    submit().catch((err) => setAlert(err.message));
  });

  els.closeBtns?.forEach((btn) => {
    btn.addEventListener("click", close);
  });

  dialogEl.addEventListener("cancel", (e) => {
    if (uploading) {
      e.preventDefault();
      return;
    }
    close();
  });

  els.openStorage?.addEventListener("click", () => {
    window.open("/apps/cloud-storage/", "_blank", "noopener,noreferrer");
  });

  return { open, close, uploadTo };
}
