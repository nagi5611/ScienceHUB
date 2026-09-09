/**
 * PDF 分割（pdf-lib）
 */

import { PDFDocument } from "pdf-lib";
import {
  buildAllPageGroups,
  buildFixedPageGroups,
  parsePageRangeGroups,
} from "./page-ranges.js";

/**
 * PDF を読み込む
 * @param {File} file
 */
async function loadPdfDocument(file) {
  let bytes;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`「${file.name}」を読み込めませんでした`);
  }

  try {
    return await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throw new Error(
      `「${file.name}」を開けませんでした。破損しているか、パスワード保護されている可能性があります`
    );
  }
}

/**
 * ベース名（拡張子なし）を取得
 * @param {string} filename
 */
function getBaseName(filename) {
  const dot = filename.lastIndexOf(".");
  return dot > 0 ? filename.slice(0, dot) : filename;
}

/**
 * ページグループから分割 PDF を生成
 * @param {import('pdf-lib').PDFDocument} source
 * @param {number[][]} groups 0-based page indices per output file
 * @param {string} baseName
 * @param {(progress: { current: number, total: number }) => void} [onProgress]
 * @returns {Promise<Array<{ bytes: Uint8Array, name: string }>>}
 */
async function splitByGroups(source, groups, baseName, onProgress) {
  if (groups.length === 0) {
    throw new Error("分割対象のページがありません");
  }

  /** @type {Array<{ bytes: Uint8Array, name: string }>} */
  const results = [];

  for (let index = 0; index < groups.length; index += 1) {
    const indices = groups[index];
    if (indices.length === 0) {
      throw new Error("空のページ範囲が含まれています");
    }

    onProgress?.({ current: index + 1, total: groups.length });

    const part = await PDFDocument.create();
    const copiedPages = await part.copyPages(source, indices);
    for (const page of copiedPages) {
      part.addPage(page);
    }

    const suffix =
      groups.length === 1
        ? ""
        : indices.length === 1
          ? `_p${indices[0] + 1}`
          : `_p${indices[0] + 1}-${indices[indices.length - 1] + 1}`;

    results.push({
      bytes: await part.save(),
      name: `${baseName}${suffix}.pdf`,
    });
  }

  return results;
}

/**
 * 全ページを個別 PDF に分割
 * @param {File} file
 * @param {(progress: { current: number, total: number }) => void} [onProgress]
 */
export async function splitAllPages(file, onProgress) {
  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  if (pageCount === 0) {
    throw new Error("PDF にページがありません");
  }
  const groups = buildAllPageGroups(pageCount);
  return splitByGroups(source, groups, getBaseName(file.name), onProgress);
}

/**
 * ページ範囲文字列で分割
 * @param {File} file
 * @param {string} rangeInput
 * @param {(progress: { current: number, total: number }) => void} [onProgress]
 */
export async function splitByRanges(file, rangeInput, onProgress) {
  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  if (pageCount === 0) {
    throw new Error("PDF にページがありません");
  }
  const groups = parsePageRangeGroups(rangeInput, pageCount);
  return splitByGroups(source, groups, getBaseName(file.name), onProgress);
}

/**
 * N ページごとに分割
 * @param {File} file
 * @param {number} chunkSize
 * @param {(progress: { current: number, total: number }) => void} [onProgress]
 */
export async function splitByFixedSize(file, chunkSize, onProgress) {
  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  if (pageCount === 0) {
    throw new Error("PDF にページがありません");
  }
  const groups = buildFixedPageGroups(pageCount, chunkSize);
  return splitByGroups(source, groups, getBaseName(file.name), onProgress);
}
