/**
 * ブラウザの video 要素で再生可能か検証
 */

/**
 * 動画としてメタデータを読めるか確認
 * @param {File} file
 */
export async function probePlayableVideo(file) {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    await new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error("動画の読み込みがタイムアウトしました"));
      }, 15000);

      video.onloadedmetadata = () => {
        window.clearTimeout(timer);
        resolve(undefined);
      };
      video.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error("動画として再生できません"));
      };
      video.src = url;
    });

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (duration <= 0) {
      throw new Error("動画の長さを取得できませんでした");
    }

    return {
      duration,
      width: video.videoWidth,
      height: video.videoHeight,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}
