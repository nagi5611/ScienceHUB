/**
 * 一覧 / 大アイコン表示の DOM ヘルパー
 */

function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** 現在表示中のファイル一覧ルート（tbody または icon grid） */
export function getActiveFileListRoot() {
  const grid = document.getElementById("cs-icon-grid");
  if (grid && !grid.hidden) return grid;
  return document.getElementById("cs-files-body");
}

/** 大アイコン表示が有効か */
export function isIconGridActive() {
  const grid = document.getElementById("cs-icon-grid");
  return Boolean(grid && !grid.hidden);
}

/** 表示中の一覧からパスに一致するエントリを取得 */
export function findFileEntryByPath(path) {
  const root = getActiveFileListRoot();
  if (!root || !path) return null;
  return root.querySelector(`.cs-file-entry[data-path="${cssEscape(path)}"]`);
}

/** 非表示側の一覧 DOM をクリア */
export function clearInactiveFileListRoot() {
  const grid = document.getElementById("cs-icon-grid");
  const tbody = document.getElementById("cs-files-body");
  if (grid && !grid.hidden) {
    if (tbody) tbody.innerHTML = "";
    return;
  }
  if (grid) grid.innerHTML = "";
}
