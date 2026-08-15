/**
 * ffmpeg ログから音声メタデータを取得
 */

/**
 * @typedef {Object} AudioProbe
 * @property {number} duration 秒
 * @property {boolean} hasVideo
 */

/**
 * @param {import('@ffmpeg/ffmpeg').FFmpeg} ffmpeg
 * @param {string} inputPath
 * @returns {Promise<AudioProbe>}
 */
export async function probeAudio(ffmpeg, inputPath) {
  /** @type {AudioProbe} */
  const probe = { duration: 0, hasVideo: false };

  const onLog = ({ message }) => {
    const durationMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    if (durationMatch) {
      const h = Number(durationMatch[1]);
      const m = Number(durationMatch[2]);
      const s = Number(durationMatch[3]);
      probe.duration = h * 3600 + m * 60 + s;
    }
    if (/Video:/i.test(message)) {
      probe.hasVideo = true;
    }
  };

  ffmpeg.on("log", onLog);
  try {
    await ffmpeg.exec(["-hide_banner", "-i", inputPath, "-f", "null", "-"]);
  } catch {
    // ログ取得目的
  }
  ffmpeg.off("log", onLog);

  if (probe.duration <= 0) {
    throw new Error("音声の長さを取得できませんでした");
  }

  return probe;
}
