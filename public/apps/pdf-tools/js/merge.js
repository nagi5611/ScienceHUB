/**
 * PDF 結合（pdf-lib）
 */

import { PDFDocument } from "pdf-lib";

/**
 * 複数 PDF を順番に結合
 * @param {File[]} files
 * @param {(progress: { current: number, total: number, name: string }) => void} [onProgress]
 * @returns {Promise<Uint8Array>}
 */
export async function mergePdfFiles(files, onProgress) {
  if (files.length === 0) {
    throw new Error("結合する PDF を追加してください");
  }
  if (files.length === 1) {
    throw new Error("結合には 2 件以上の PDF が必要です");
  }

  const merged = await PDFDocument.create();

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    onProgress?.({ current: index + 1, total: files.length, name: file.name });

    let bytes;
    try {
      bytes = await file.arrayBuffer();
    } catch {
      throw new Error(`「${file.name}」を読み込めませんでした`);
    }

    let source;
    try {
      source = await PDFDocument.load(bytes, { ignoreEncryption: false });
    } catch {
      throw new Error(
        `「${file.name}」を開けませんでした。破損しているか、パスワード保護されている可能性があります`
      );
    }

    const pageCount = source.getPageCount();
    if (pageCount === 0) {
      throw new Error(`「${file.name}」にページがありません`);
    }

    const pageIndices = Array.from({ length: pageCount }, (_, pageIndex) => pageIndex);
    const copiedPages = await merged.copyPages(source, pageIndices);
    for (const page of copiedPages) {
      merged.addPage(page);
    }
  }

  return merged.save();
}

/** 結合結果のファイル名を生成 */
export function buildMergedFilename() {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `merged-${stamp}.pdf`;
}
