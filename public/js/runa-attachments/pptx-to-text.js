/**
 * PPTX → スライド単位プレーンテキスト（JSZip + XML）
 */

import JSZip from "jszip";

const TEXT_NODE_RE = /<a:t[^>]*>([^<]*)<\/a:t>/g;

/** slide XML からテキストを抽出 */
function extractTextFromSlideXml(xml) {
  const lines = [];
  for (const match of xml.matchAll(TEXT_NODE_RE)) {
    const text = match[1]?.trim();
    if (text) lines.push(text);
  }
  return lines.join("\n");
}

/**
 * PPTX をスライド単位テキストに変換
 * @param {File} file
 */
export async function pptxFileToText(file) {
  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort((a, b) => {
      const numA = Number.parseInt(a.match(/slide(\d+)/i)?.[1] ?? "0", 10);
      const numB = Number.parseInt(b.match(/slide(\d+)/i)?.[1] ?? "0", 10);
      return numA - numB;
    });

  if (!slideNames.length) {
    throw new Error("PowerPoint にスライドが見つかりませんでした");
  }

  const parts = [];
  for (let index = 0; index < slideNames.length; index += 1) {
    const name = slideNames[index];
    const xml = await zip.file(name)?.async("string");
    if (!xml) continue;
    const text = extractTextFromSlideXml(xml);
    parts.push(`--- slide ${index + 1} ---\n${text || "（テキストなし）"}`);
  }

  return parts.join("\n\n");
}
