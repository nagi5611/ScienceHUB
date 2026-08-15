/**
 * Cloudflare Images 経由のサーバー変換（HEIC / TIFF / RAW 等）
 */

/**
 * サーバーで画像を変換
 * @param {File} file
 * @param {{
 *   format: import('./convert-core.js').RasterFormat,
 *   quality: number,
 *   maxEdge: number,
 * }} options
 * @returns {Promise<Array<{ blob: Blob }>>}
 */
export async function convertServerImage(file, options) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", options.format);
  formData.append("quality", String(options.quality));
  formData.append("maxEdge", String(options.maxEdge || 0));

  const response = await fetch("/api/image-converter/convert", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  if (!response.ok) {
    let message = "サーバー変換に失敗しました";
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  if (!blob.size) {
    throw new Error("変換結果が空です");
  }

  return [{ blob }];
}
