/**
 * ブラウザ端末の利用可能メモリ予算（概算）
 */

/** deviceMemory 不明時に仮定する端末 RAM（GB） */
export const DEFAULT_ASSUMED_DEVICE_MEMORY_GB = 4;

/** 変換以外のアプリ・PDF.js 等の固定予約（バイト） */
export const CLIENT_MEMORY_BASE_RESERVED_BYTES = 48 * 1024 * 1024;

/** 1 ページの canvas 描画＋エンコード中の上乗せ係数 */
export const PDF_PAGE_RENDER_MEMORY_OVERHEAD = 2.5;

/**
 * 端末 RAM の半分を利用上限とみなす（navigator.deviceMemory ベース）
 * @param {number} [deviceMemoryGb]
 */
export function getClientMemoryBudgetBytes(deviceMemoryGb = readDeviceMemoryGb()) {
  const gb =
    typeof deviceMemoryGb === "number" && deviceMemoryGb > 0
      ? deviceMemoryGb
      : DEFAULT_ASSUMED_DEVICE_MEMORY_GB;
  return Math.floor(gb * 0.5 * 1024 ** 3);
}

/** @returns {number | undefined} */
export function readDeviceMemoryGb() {
  if (typeof navigator === "undefined") return undefined;
  const value = navigator.deviceMemory;
  return typeof value === "number" && value > 0 ? value : undefined;
}

/**
 * RGBA キャンバス相当のバイト数（概算）
 * @param {number} width
 * @param {number} height
 * @param {number} [overhead]
 */
export function estimateRgbaCanvasBytes(width, height, overhead = 1) {
  const w = Math.max(1, Math.ceil(width));
  const h = Math.max(1, Math.ceil(height));
  return Math.ceil(w * h * 4 * overhead);
}

/**
 * 予算内に収める PDF ページ並列数
 * @param {{
 *   budgetBytes: number,
 *   reservedBytes: number,
 *   maxPageWorkingSetBytes: number,
 *   maxConcurrency: number,
 * }} params
 */
export function computeParallelismFromBudget(params) {
  const { budgetBytes, reservedBytes, maxPageWorkingSetBytes, maxConcurrency } = params;
  const cap = Math.max(1, maxConcurrency);
  if (maxPageWorkingSetBytes <= 0) return 1;

  const available = Math.max(0, budgetBytes - reservedBytes);
  const byMemory = Math.floor(available / maxPageWorkingSetBytes);
  return Math.max(1, Math.min(cap, byMemory));
}
