/**
 * ディレクトリごとの表示モード（一覧 / 大アイコン）を localStorage に保存
 */

const VIEW_MODE_STORAGE_KEY = "cs-view-mode-by-path";
const VIEW_MODES = new Set(["list", "icons"]);

/** パスに保存された表示モードを取得 */
export function loadViewModeForPath(path) {
  if (!path) return "list";
  try {
    const raw = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (!raw) return "list";
    const map = JSON.parse(raw);
    const mode = map[path];
    return VIEW_MODES.has(mode) ? mode : "list";
  } catch {
    return "list";
  }
}

/** パスに保存された表示モードがあるか */
export function hasViewModeForPath(path) {
  if (!path) return false;
  try {
    const raw = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw);
    return VIEW_MODES.has(map[path]);
  } catch {
    return false;
  }
}

/** パスごとの表示モードを保存 */
export function saveViewModeForPath(path, mode) {
  if (!path || !VIEW_MODES.has(mode)) return;
  try {
    const raw = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[path] = mode;
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}
