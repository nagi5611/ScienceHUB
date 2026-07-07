/**
 * シフト表示色（サーバー側検証用）
 */

export const SHIFT_COLOR_COUNT = 8;

/** 色インデックスが有効か */
export function isValidShiftColorIndex(index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < SHIFT_COLOR_COUNT;
}
