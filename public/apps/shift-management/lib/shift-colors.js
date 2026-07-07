/**
 * シフト管理 — 8色パレット（3dprinterman 互換）
 */

export const SHIFT_COLORS = [
  { index: 0, bg: "#fef3c7", border: "#f59e0b" },
  { index: 1, bg: "#dbeafe", border: "#3b82f6" },
  { index: 2, bg: "#dcfce7", border: "#22c55e" },
  { index: 3, bg: "#fce7f3", border: "#ec4899" },
  { index: 4, bg: "#ede9fe", border: "#8b5cf6" },
  { index: 5, bg: "#ffedd5", border: "#f97316" },
  { index: 6, bg: "#ccfbf1", border: "#14b8a6" },
  { index: 7, bg: "#fee2e2", border: "#ef4444" },
];

/** 色インデックスからインラインスタイル文字列を返す */
export function shiftColorStyle(index) {
  const c = SHIFT_COLORS[index] ?? SHIFT_COLORS[0];
  return `background:${c.bg};border-color:${c.border}`;
}

/** 色インデックスが有効か */
export function isValidColorIndex(index) {
  return Number.isInteger(index) && index >= 0 && index < SHIFT_COLORS.length;
}
