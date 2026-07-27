/**
 * 出力の長辺ピクセル上限を UI から解釈する
 */

const MAX_LONG_EDGE = 8192;
const MIN_LONG_EDGE = 64;

/** 解像度モードとカスタム値から長辺上限（px）を返す。制限なしは null */
export function parseLongEdgeLimit(mode, customValue) {
  if (!mode || mode === "original") return null;
  if (mode === "long-1200") return 1200;
  if (mode === "long-2000") return 2000;
  if (mode === "long-2048") return 2048;
  if (mode === "long-custom") {
    const n = Number(customValue);
    if (!Number.isFinite(n) || n < MIN_LONG_EDGE) return null;
    return Math.min(MAX_LONG_EDGE, Math.floor(n));
  }
  return null;
}

/** 「長辺を指定」選択時にカスタム入力欄の表示を切り替える */
export function bindLongEdgeCustomToggle(selectEl, wrapEl) {
  if (!selectEl || !wrapEl) return;

  const sync = () => {
    wrapEl.hidden = selectEl.value !== "long-custom";
  };

  selectEl.addEventListener("change", sync);
  selectEl.addEventListener("input", sync);
  sync();
}
