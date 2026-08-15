/**
 * ffmpeg ログから動画メタデータを取得
 */

/**
 * @typedef {Object} VideoProbe
 * @property {number} duration 秒
 * @property {number} width
 * @property {number} height
 * @property {number} fps
 */

/**
 * ffmpeg で入力を解析
 * @param {import('@ffmpeg/ffmpeg').FFmpeg} ffmpeg
 * @param {string} inputPath
 * @returns {Promise<VideoProbe>}
 */
export async function probeVideo(ffmpeg, inputPath) {
  /** @type {VideoProbe} */
  const probe = { duration: 0, width: 0, height: 0, fps: 0 };

  const onLog = ({ message }) => {
    const fpsMatch = message.match(/(\d+(?:\.\d+)?)\s*fps/);
    if (fpsMatch) probe.fps = parseFloat(fpsMatch[1]);

    const durationMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    if (durationMatch) {
      const h = Number(durationMatch[1]);
      const m = Number(durationMatch[2]);
      const s = Number(durationMatch[3]);
      probe.duration = h * 3600 + m * 60 + s;
    }

    const sizeMatch = message.match(/Video:.*?(\d{2,5})x(\d{2,5})/);
    if (sizeMatch) {
      probe.width = Number(sizeMatch[1]);
      probe.height = Number(sizeMatch[2]);
    }
  };

  ffmpeg.on("log", onLog);
  try {
    await ffmpeg.exec(["-hide_banner", "-i", inputPath, "-f", "null", "-"]);
  } catch {
    // ログ取得目的のため終了コードは無視
  }
  ffmpeg.off("log", onLog);

  if (probe.duration <= 0) {
    throw new Error("動画の長さを取得できませんでした");
  }

  if (probe.fps <= 0) probe.fps = 30;
  return probe;
}
