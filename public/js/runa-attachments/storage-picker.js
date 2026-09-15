/**
 * Runa — クラウドストレージからファイルを選ぶピッカー
 */

/** HTML 属性用エスケープ */
function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** テキスト用エスケープ */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatBytes(bytes) {
  if (bytes == null || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

/** @type {HTMLDialogElement | null} */
let dialogEl = null;
/** @type {Map<string, { path: string, name: string, sizeBytes: number | null }>} */
let selectedFiles = new Map();
let currentPath = "";
let listOffset = 0;
let listHasMore = false;
/** @type {{ initialPath?: string, maxSelect?: number, excludePaths?: string[], onConfirm?: (files: Array<{ path: string, name: string, sizeBytes: number | null }>) => void } | null} */
let pickerOptions = null;

async function storageApi(path) {
  const response = await fetch(`/api/storage/${path}`, {
    credentials: "same-origin",
  });
  if (response.status === 401) {
    window.location.href = `/?next=${encodeURIComponent(window.location.pathname)}`;
    throw new Error("ログインが必要です");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "ストレージの読み込みに失敗しました");
  }
  return data;
}

function getDialogElements() {
  if (!dialogEl) return null;
  return {
    dialog: dialogEl,
    list: dialogEl.querySelector(".runa-storage-picker-list"),
    crumb: dialogEl.querySelector(".runa-storage-picker-crumb"),
    status: dialogEl.querySelector(".runa-storage-picker-status"),
    selected: dialogEl.querySelector(".runa-storage-picker-selected"),
    confirm: dialogEl.querySelector(".runa-storage-picker-confirm"),
    loadMore: dialogEl.querySelector(".runa-storage-picker-load-more"),
  };
}

function ensureDialog() {
  if (dialogEl) return dialogEl;

  const dialog = document.createElement("dialog");
  dialog.className = "runa-storage-picker";
  dialog.id = "runa-storage-picker";
  dialog.innerHTML = `<form method="dialog" class="runa-storage-picker-form">
  <header class="runa-storage-picker-header">
    <h3 class="runa-storage-picker-title">クラウドストレージから選択</h3>
    <button type="button" class="runa-storage-picker-close" aria-label="閉じる">×</button>
  </header>
  <p class="runa-storage-picker-status" hidden></p>
  <nav class="runa-storage-picker-crumb" aria-label="パス"></nav>
  <div class="runa-storage-picker-list" role="listbox" aria-multiselectable="true"></div>
  <button type="button" class="runa-storage-picker-load-more" hidden>さらに読み込む</button>
  <footer class="runa-storage-picker-footer">
    <p class="runa-storage-picker-selected">選択: 0 件</p>
    <div class="runa-storage-picker-actions">
      <button type="button" class="runa-storage-picker-cancel" value="cancel">キャンセル</button>
      <button type="submit" class="runa-storage-picker-confirm" value="confirm">添付</button>
    </div>
  </footer>
</form>`;

  dialog.querySelector(".runa-storage-picker-close")?.addEventListener("click", () => {
    dialog.close("cancel");
  });
  dialog.querySelector(".runa-storage-picker-cancel")?.addEventListener("click", () => {
    dialog.close("cancel");
  });
  dialog.querySelector(".runa-storage-picker-load-more")?.addEventListener("click", () => {
    void loadDirectoryPage(true);
  });
  dialog.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmSelection();
  });

  document.body.appendChild(dialog);
  dialogEl = dialog;
  return dialog;
}

function updateSelectedSummary() {
  const ui = getDialogElements();
  if (!ui?.selected || !ui.confirm) return;
  const count = selectedFiles.size;
  const max = pickerOptions?.maxSelect ?? 5;
  ui.selected.textContent = `選択: ${count} / ${max} 件`;
  ui.confirm.disabled = count === 0;
}

function setPickerStatus(message, isError = false) {
  const ui = getDialogElements();
  if (!ui?.status) return;
  if (!message) {
    ui.status.hidden = true;
    ui.status.textContent = "";
    ui.status.classList.remove("is-error");
    return;
  }
  ui.status.hidden = false;
  ui.status.textContent = message;
  ui.status.classList.toggle("is-error", isError);
}

function canSelectMore() {
  const max = pickerOptions?.maxSelect ?? 5;
  return selectedFiles.size < max;
}

function isExcludedPath(path) {
  return (pickerOptions?.excludePaths ?? []).includes(path);
}

function toggleFileSelection(item) {
  if (!item?.path || item.type !== "file") return;
  if (isExcludedPath(item.path)) return;
  if (selectedFiles.has(item.path)) {
    selectedFiles.delete(item.path);
    updateSelectedSummary();
    renderRowStates();
    return;
  }
  if (!canSelectMore()) {
    setPickerStatus(`最大 ${pickerOptions?.maxSelect ?? 5} 件まで選択できます`, true);
    return;
  }
  selectedFiles.set(item.path, {
    path: item.path,
    name: item.name,
    sizeBytes: item.sizeBytes ?? null,
  });
  setPickerStatus("");
  updateSelectedSummary();
  renderRowStates();
}

function renderRowStates() {
  const ui = getDialogElements();
  if (!ui?.list) return;
  for (const row of ui.list.querySelectorAll("[data-path]")) {
    const path = row.getAttribute("data-path");
    const selected = path ? selectedFiles.has(path) : false;
    row.classList.toggle("is-selected", selected);
    const check = row.querySelector(".runa-storage-picker-check");
    if (check) check.textContent = selected ? "✓" : "";
  }
}

function renderBreadcrumb(roots) {
  const ui = getDialogElements();
  if (!ui?.crumb) return;

  const parts = currentPath.split("/").filter(Boolean);
  const segments = [];
  let acc = "";
  for (const part of parts) {
    acc = acc ? `${acc}/${part}` : part;
    segments.push({ label: part, path: acc });
  }

  const crumbs = [];
  crumbs.push(
    `<button type="button" class="runa-storage-picker-crumb-btn" data-path="">ルート</button>`
  );
  for (const segment of segments) {
    crumbs.push(
      `<button type="button" class="runa-storage-picker-crumb-btn" data-path="${escapeAttr(segment.path)}">${escapeHtml(segment.label)}</button>`
    );
  }

  const rootOptions = (roots ?? [])
    .map(
      (root) =>
        `<button type="button" class="runa-storage-picker-root" data-path="${escapeAttr(root.path)}">${escapeHtml(root.label)}</button>`
    )
    .join("");

  ui.crumb.innerHTML = `${crumbs.join('<span class="runa-storage-picker-crumb-sep">/</span>')}${
    rootOptions ? `<div class="runa-storage-picker-roots">${rootOptions}</div>` : ""
  }`;

  ui.crumb.querySelectorAll("[data-path]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPath = btn.getAttribute("data-path") || "";
      listOffset = 0;
      void loadDirectoryPage(false);
    });
  });
}

function renderItems(items) {
  const ui = getDialogElements();
  if (!ui?.list) return;

  if (!items.length && listOffset === 0) {
    ui.list.innerHTML = `<p class="runa-storage-picker-empty">このフォルダにファイルはありません</p>`;
    return;
  }

  const rows = items
    .map((item) => {
      if (item.type === "folder") {
        return `<button type="button" class="runa-storage-picker-row runa-storage-picker-row--folder" data-kind="folder" data-path="${escapeAttr(item.path)}">
          <span class="runa-storage-picker-icon" aria-hidden="true">📁</span>
          <span class="runa-storage-picker-name">${escapeHtml(item.name)}</span>
          <span class="runa-storage-picker-meta">フォルダ</span>
        </button>`;
      }
      const excluded = isExcludedPath(item.path);
      const selected = selectedFiles.has(item.path);
      const stateClass = excluded ? " is-disabled" : selected ? " is-selected" : "";
      return `<button type="button" class="runa-storage-picker-row runa-storage-picker-row--file${stateClass}" data-kind="file" data-path="${escapeAttr(item.path)}" data-name="${escapeAttr(item.name)}" data-size-bytes="${item.sizeBytes ?? ""}" ${excluded ? "disabled" : ""}>
        <span class="runa-storage-picker-check" aria-hidden="true">${selected ? "✓" : ""}</span>
        <span class="runa-storage-picker-icon" aria-hidden="true">📄</span>
        <span class="runa-storage-picker-name">${escapeHtml(item.name)}</span>
        <span class="runa-storage-picker-meta">${excluded ? "添付済み" : escapeHtml(formatBytes(item.sizeBytes))}</span>
      </button>`;
    })
    .join("");

  if (listOffset === 0) {
    ui.list.innerHTML = rows;
  } else {
    ui.list.insertAdjacentHTML("beforeend", rows);
  }

  ui.list.querySelectorAll(".runa-storage-picker-row").forEach((row) => {
    row.addEventListener("click", () => {
      const kind = row.getAttribute("data-kind");
      const path = row.getAttribute("data-path") || "";
      if (kind === "folder") {
        currentPath = path;
        listOffset = 0;
        void loadDirectoryPage(false);
        return;
      }
      const name = row.getAttribute("data-name") || path.split("/").pop() || path;
      const sizeRaw = row.getAttribute("data-size-bytes");
      const sizeBytes = sizeRaw ? Number(sizeRaw) : null;
      toggleFileSelection({
        path,
        name,
        type: "file",
        sizeBytes: Number.isFinite(sizeBytes) ? sizeBytes : null,
      });
    });
  });
}

async function loadDirectoryPage(append) {
  const ui = getDialogElements();
  if (!ui?.list) return;

  if (!append) {
    ui.list.innerHTML = `<p class="runa-storage-picker-empty">読み込み中…</p>`;
    if (ui.loadMore) ui.loadMore.hidden = true;
  }

  try {
    const rootsData = await storageApi("roots");
    const roots = rootsData.roots ?? [];

    if (!currentPath) {
      if (roots.length === 1) {
        currentPath = roots[0].path;
      } else {
        renderBreadcrumb(roots);
        ui.list.innerHTML = roots
          .map(
            (root) =>
              `<button type="button" class="runa-storage-picker-row runa-storage-picker-row--folder" data-kind="folder" data-path="${escapeAttr(root.path)}">
                <span class="runa-storage-picker-icon" aria-hidden="true">🗂️</span>
                <span class="runa-storage-picker-name">${escapeHtml(root.label)}</span>
                <span class="runa-storage-picker-meta">${root.type === "user" ? "個人" : "グループ"}</span>
              </button>`
          )
          .join("");
        ui.list.querySelectorAll(".runa-storage-picker-row").forEach((row) => {
          row.addEventListener("click", () => {
            currentPath = row.getAttribute("data-path") || "";
            listOffset = 0;
            void loadDirectoryPage(false);
          });
        });
        listHasMore = false;
        return;
      }
    }

    renderBreadcrumb(roots);

    const limit = 80;
    const data = await storageApi(
      `list?path=${encodeURIComponent(currentPath)}&offset=${listOffset}&limit=${limit}&sort=name&order=asc`
    );
    const items = (data.items ?? []).filter((item) => item.type === "file" || item.type === "folder");
    listHasMore = Boolean(data.hasMore);
    listOffset += items.length;

    renderItems(items);
    if (ui.loadMore) ui.loadMore.hidden = !listHasMore;
    setPickerStatus("");
  } catch (error) {
    const message = error instanceof Error ? error.message : "読み込みに失敗しました";
    ui.list.innerHTML = `<p class="runa-storage-picker-empty is-error">${escapeHtml(message)}</p>`;
    setPickerStatus(message, true);
  }
}

function confirmSelection() {
  const files = Array.from(selectedFiles.values());
  if (!files.length) return;
  const onConfirm = pickerOptions?.onConfirm;
  dialogEl?.close("confirm");
  if (onConfirm) onConfirm(files);
}

/**
 * クラウドストレージファイル選択ダイアログを開く
 * @param {{ initialPath?: string, maxSelect?: number, excludePaths?: string[], onConfirm: (files: Array<{ path: string, name: string, sizeBytes: number | null }>) => void }} options
 */
export function openRunaStoragePicker(options) {
  if (!options?.onConfirm) return;

  const dialog = ensureDialog();
  pickerOptions = options;
  selectedFiles = new Map();
  listOffset = 0;
  listHasMore = false;
  currentPath = options.initialPath?.trim() || "";
  setPickerStatus("");
  updateSelectedSummary();

  void loadDirectoryPage(false);
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}
