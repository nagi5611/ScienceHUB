/**
 * ラスタ画像変換 Worker（OffscreenCanvas）
 */

/** @param {number} width @param {number} height @param {number} maxEdge */
function fitDimensions(width, height, maxEdge) {
  if (!maxEdge || maxEdge <= 0) return { width, height };
  const longest = Math.max(width, height);
  if (longest <= maxEdge) return { width, height };
  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

self.addEventListener("message", async (event) => {
  const { jobId, buffer, mime, outputMime, format, lossy, quality, maxEdge } = event.data ?? {};

  try {
    const blob = new Blob([buffer], { type: mime || "application/octet-stream" });
    const bitmap = await createImageBitmap(blob);
    const { width, height } = fitDimensions(bitmap.width, bitmap.height, maxEdge || 0);

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas を初期化できません");

    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const resultBlob = await canvas.convertToBlob({
      type: outputMime,
      quality: lossy ? quality : undefined,
    });
    const resultBuffer = await resultBlob.arrayBuffer();
    self.postMessage({ jobId, buffer: resultBuffer, mime: outputMime }, [resultBuffer]);
  } catch (error) {
    self.postMessage({
      jobId,
      error: error instanceof Error ? error.message : "変換に失敗しました",
    });
  }
});
