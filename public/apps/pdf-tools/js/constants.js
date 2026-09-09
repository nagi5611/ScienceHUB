/** PDF結合・分割アプリ定数 */

export const APP_SLUG = "pdf-tools";

/** @typedef {'merge' | 'split'} AppTab */
/** @typedef {'all-pages' | 'ranges' | 'fixed'} SplitMode */

export const SPLIT_MODES = {
  "all-pages": { id: "all-pages", label: "全ページを個別PDF" },
  ranges: { id: "ranges", label: "ページ範囲で分割" },
  fixed: { id: "fixed", label: "N ページごと" },
};
