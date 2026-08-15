/**
 * ブラウザの Audio 要素で再生可能か検証
 */

/**
 * @param {File} file
 */
export async function probePlayableAudio(file) {
  const url = URL.createObjectURL(file);
  try {
    const audio = document.createElement("audio");
    audio.preload = "metadata";

    await new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error("音声の読み込みがタイムアウトしました"));
      }, 15000);

      audio.onloadedmetadata = () => {
        window.clearTimeout(timer);
        resolve(undefined);
      };
      audio.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error("音声として再生できません"));
      };
      audio.src = url;
    });

    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    if (duration <= 0) {
      throw new Error("音声の長さを取得できませんでした");
    }

    return { duration };
  } finally {
    URL.revokeObjectURL(url);
  }
}
