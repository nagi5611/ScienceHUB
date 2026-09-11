/**
 * Excel → CSV（SheetJS）
 */

import * as XLSX from "xlsx";

/**
 * ワークブックを CSV 文字列に変換
 * @param {File} file
 */
export async function excelFileToCsvText(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  const parts = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
    if (!csv.trim()) continue;
    parts.push(`--- sheet:${sheetName} ---\n${csv.trim()}`);
  }

  if (!parts.length) {
    throw new Error("スプレッドシートにデータがありません");
  }
  return parts.join("\n\n");
}
