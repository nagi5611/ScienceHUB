/**
 * Runa 添付ファイルのクライアント変換オーケストレータ
 */

import { convertPdfToJpegPages } from "../shared/pdf-import.js";
import { resizeImageToPng } from "../image-resize.js";
import {
  MAX_EXTRACTED_TEXT_CHARS,
  MAX_IMAGE_EDGE,
  MAX_PDF_PAGES,
  PDF_JPEG_QUALITY,
} from "./constants.js";
import { detectAttachmentKind, unsupportedMessage } from "./detect.js";
import { docxFileToHtml } from "./docx-to-html.js";
import { excelFileToCsvText } from "./excel-to-csv.js";
import { pptxFileToText } from "./pptx-to-text.js";

/**
 * @typedef {Object} PreparedBlob
 * @property {Blob} blob
 * @property {string} filename
 * @property {'derived-image' | 'original'} role
 */

/**
 * @typedef {Object} PrepareFileResult
 * @property {'ready' | 'unsupported' | 'error'} status
 * @property {string} [error]
 * @property {string} [label]
 * @property {string} [extractedText]
 * @property {PreparedBlob[]} blobs
 * @property {number} [imageCount]
 */

/** 抽出テキストを上限で切り詰め */
export function truncateExtractedText(text) {
  if (!text || text.length <= MAX_EXTRACTED_TEXT_CHARS) return text;
  return `${text.slice(0, MAX_EXTRACTED_TEXT_CHARS)}\n\n…（${MAX_EXTRACTED_TEXT_CHARS} 文字で切り詰め）`;
}

/** 派生ファイル名を生成 */
function derivedFilename(originalName, suffix, ext) {
  const base = originalName.replace(/\.[^.]+$/, "");
  return `${base}${suffix}.${ext}`;
}

/**
 * ファイルを変換（アップロード前）
 * @param {File} file
 * @param {{ onProgress?: (label: string) => void }} [callbacks]
 * @returns {Promise<PrepareFileResult>}
 */
export async function prepareAttachmentFile(file, callbacks = {}) {
  const kind = detectAttachmentKind(file);
  const onProgress = callbacks.onProgress ?? (() => {});

  if (kind === "unsupported") {
    return {
      status: "unsupported",
      error: unsupportedMessage(file),
      blobs: [{ blob: file, filename: file.name, role: "original" }],
    };
  }

  /** @type {PreparedBlob[]} */
  const blobs = [{ blob: file, filename: file.name, role: "original" }];
  let extractedText;
  let label;
  let imageCount = 0;

  try {
    if (kind === "pdf") {
      onProgress("PDF を画像に変換中…");
      const pages = await convertPdfToJpegPages(
        file,
        {
          maxPages: MAX_PDF_PAGES,
          maxEdge: MAX_IMAGE_EDGE,
          quality: PDF_JPEG_QUALITY,
        },
        {
          onPage: (_page, progress) => {
            onProgress(`PDF 変換中… ${progress.done}/${progress.total}`);
          },
        }
      );
      for (const { blob, pageNum } of pages) {
        blobs.push({
          blob,
          filename: derivedFilename(file.name, `-p${pageNum}`, "jpg"),
          role: "derived-image",
        });
      }
      imageCount = pages.length;
      label = `PDF→${pages.length}枚`;
    } else if (kind === "excel") {
      onProgress("Excel を CSV に変換中…");
      const csv = await excelFileToCsvText(file);
      extractedText = truncateExtractedText(csv);
      label = "Excel→CSV";
    } else if (kind === "docx") {
      onProgress("Word を HTML に変換中…");
      const html = await docxFileToHtml(file);
      extractedText = truncateExtractedText(html);
      label = "Word→HTML";
    } else if (kind === "pptx") {
      onProgress("PowerPoint をテキストに変換中…");
      const text = await pptxFileToText(file);
      extractedText = truncateExtractedText(text);
      label = "PPTX→テキスト";
    } else if (kind === "text") {
      onProgress("テキストを読み込み中…");
      const text = await file.text();
      extractedText = truncateExtractedText(text);
      label = "テキスト";
    } else if (kind === "image") {
      onProgress("画像を準備中…");
      const resized = await resizeImageToPng(file, MAX_IMAGE_EDGE);
      blobs.push({
        blob: resized,
        filename: derivedFilename(file.name, "-runa", "png"),
        role: "derived-image",
      });
      imageCount = 1;
      label = "画像";
    } else {
      label = file.name;
    }

    return {
      status: "ready",
      label,
      extractedText,
      blobs,
      imageCount,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "変換に失敗しました",
      blobs,
    };
  }
}
