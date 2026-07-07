/**
 * 画像を最大 maxSize px にスケールダウンして PNG Blob を返す
 */

const DEFAULT_MAX = 512;

/**
 * ファイルを読み込み、最大辺 maxSize px 以内にリサイズして PNG に変換する
 * @param {File} file
 * @param {number} [maxSize=512]
 * @returns {Promise<Blob>}
 */
export async function resizeImageToPng(file, maxSize = DEFAULT_MAX) {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください");
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let targetW = width;
  let targetH = height;

  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    targetW = Math.max(1, Math.round(width * ratio));
    targetH = Math.max(1, Math.round(height * ratio));
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("画像の処理に失敗しました");
  }

  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("PNG への変換に失敗しました"));
      },
      "image/png",
      0.92
    );
  });

  return blob;
}
