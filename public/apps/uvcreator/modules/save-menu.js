/**
 * 保存ボタン + ドロップダウン（ローカル / クラウド）
 */

/** 開いている保存メニューをすべて閉じる */
export function closeAllSaveMenus() {
  document.querySelectorAll(".uv-save-menu-popover").forEach((el) => {
    el.hidden = true;
  });
  document.querySelectorAll(".uv-save-menu").forEach((el) => {
    el.classList.remove("is-open");
  });
}

/** Blob をローカルにダウンロード */
export function saveBlobLocally(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * 保存メニューを登録
 * @param {{ menuEl: HTMLElement, triggerEl: HTMLButtonElement, getBlob: () => Promise<Blob|null>, getFilename: () => string, onCloudSave: (ctx: { blob: Blob, filename: string }) => void }} options
 */
export function bindSaveMenu({ menuEl, triggerEl, getBlob, getFilename, onCloudSave }) {
  const popover = menuEl.querySelector(".uv-save-menu-popover");
  const localBtn = menuEl.querySelector('[data-save-action="local"]');
  const cloudBtn = menuEl.querySelector('[data-save-action="cloud"]');

  if (!popover || !localBtn || !cloudBtn) return;

  triggerEl.addEventListener("click", (e) => {
    if (triggerEl.disabled) return;
    e.stopPropagation();
    const willOpen = popover.hidden;
    closeAllSaveMenus();
    if (willOpen) {
      popover.hidden = false;
      menuEl.classList.add("is-open");
    }
  });

  popover.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  localBtn.addEventListener("click", async () => {
    closeAllSaveMenus();
    const blob = await getBlob();
    if (!blob) return;
    saveBlobLocally(blob, getFilename());
  });

  cloudBtn.addEventListener("click", async () => {
    closeAllSaveMenus();
    const blob = await getBlob();
    if (!blob) return;
    onCloudSave({ blob, filename: getFilename() });
  });
}

if (!document.documentElement.dataset.uvSaveMenuBound) {
  document.documentElement.dataset.uvSaveMenuBound = "1";
  document.addEventListener("click", closeAllSaveMenus);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllSaveMenus();
  });
}
