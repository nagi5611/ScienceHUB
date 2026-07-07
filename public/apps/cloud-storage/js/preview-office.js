/**
 * Microsoft Office Online 埋め込みプレビュー
 */

import { apiRequest } from "./api.js";

/** Office プレビュー情報を取得 */
export async function fetchOfficePreviewInfo(storagePath) {
  return apiRequest(`preview/office?path=${encodeURIComponent(storagePath)}`);
}

/** プレビューダイアログに Office iframe を表示 */
export function renderOfficePreview(body, info, itemName) {
  const notice = info.privacyNotice ?? "Microsoft Office Online で表示しています。";
  const warning = info.sizeWarning
    ? `<p class="cs-preview-office-warning">ファイルサイズが大きいため、表示に失敗する場合があります。</p>`
    : "";

  body.classList.add("cs-preview-body--office");
  body.innerHTML = `
    <div class="cs-office-preview-wrap">
      ${warning}
      <iframe
        class="cs-office-preview"
        src="${escapeAttr(info.embedUrl)}"
        title="${escapeAttr(itemName)}"
        loading="lazy"
        allowfullscreen
      ></iframe>
      <p class="cs-preview-office-notice">${escapeHtml(notice)}</p>
    </div>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

/** Office プレビュー用の DOM / クラスを片付け */
export function clearOfficePreview(body) {
  body?.classList.remove("cs-preview-body--office");
}
