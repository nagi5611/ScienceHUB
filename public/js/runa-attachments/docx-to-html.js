/**
 * DOCX → HTML（mammoth）
 */

import mammoth from "mammoth";

/**
 * DOCX を HTML 文字列に変換
 * @param {File} file
 */
export async function docxFileToHtml(file) {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  const html = result.value?.trim() ?? "";
  if (!html) {
    throw new Error("Word 文書からテキストを抽出できませんでした");
  }
  if (result.messages?.length) {
    const warnings = result.messages
      .filter((m) => m.type === "warning")
      .map((m) => m.message)
      .slice(0, 3);
    if (warnings.length) {
      return `${html}\n\n<!-- 変換警告: ${warnings.join("; ")} -->`;
    }
  }
  return html;
}
