/**
 * Microsoft Office Online 埋め込みプレビュー
 */

import { apiRequest } from "./api.js";

/** Office プレビュー情報を取得 */
export async function fetchOfficePreviewInfo(storagePath) {
  return apiRequest(`preview/office?path=${encodeURIComponent(storagePath)}`);
}

/** ブラウザの新しいタブで Office Online を開く（Teams のブラウザ表示に相当） */
export function openOfficeInBrowserTab(info) {
  if (!info?.viewUrl) {
    throw new Error("ブラウザで開く URL を取得できませんでした");
  }
  window.open(info.viewUrl, "_blank", "noopener,noreferrer");
}

/** デスクトップ Office アプリで開く（Teams のアプリで表示に相当） */
export function openOfficeInDesktopApp(info) {
  if (!info?.desktopScheme || !info?.fileUrl) {
    throw new Error("この形式はデスクトップアプリで開けません");
  }
  window.location.href = `${info.desktopScheme}:ofv|u|${info.fileUrl}`;
}

/** パス指定でデスクトップ Office を起動 */
export async function openOfficeInDesktopAppByPath(storagePath) {
  const info = await fetchOfficePreviewInfo(storagePath);
  openOfficeInDesktopApp(info);
  return info;
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
