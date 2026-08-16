/**
 * 書き出し進捗・残り時間推定
 */

/**
 * 残り秒数を表示用に整形
 * @param {number} seconds
 * @returns {string}
 */
export function formatEtaRemaining(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  if (seconds < 5) return "残り約数秒";
  if (seconds < 60) return `残り約 ${Math.ceil(seconds)} 秒`;

  const totalSeconds = Math.ceil(seconds);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);

  if (h > 0) {
    return s > 0 ? `残り約 ${h} 時間 ${m} 分 ${s} 秒` : `残り約 ${h} 時間 ${m} 分`;
  }
  return s > 0 ? `残り約 ${m} 分 ${s} 秒` : `残り約 ${m} 分`;
}

/**
 * 書き出し全体（準備・エンコード・音声合成・読み込み）の進捗トラッカー
 */
export function createExportProgressTracker() {
  const startedAt = performance.now();
  /** @type {number | null} */
  let smoothedRemainingSec = null;

  return {
    /**
     * @param {number} ratio 0〜1（書き出し全体の進捗）
     * @param {string} [message]
     */
    report(ratio, message) {
      const elapsedSec = (performance.now() - startedAt) / 1000;
      const clamped = Math.max(0, Math.min(1, ratio));
      const percentLabel = `${Math.round(clamped * 100)}%`;
      let etaText = "";

      if (clamped >= 0.995) {
        etaText = "完了まであと少し…";
      } else if (clamped >= 0.02) {
        const rawRemaining = elapsedSec * (1 - clamped) / clamped;
        if (Number.isFinite(rawRemaining) && rawRemaining > 0) {
          smoothedRemainingSec =
            smoothedRemainingSec === null
              ? rawRemaining
              : smoothedRemainingSec * 0.7 + rawRemaining * 0.3;
          etaText = formatEtaRemaining(smoothedRemainingSec);
        }
      }

      return {
        ratio: clamped,
        message: message ?? "",
        percentLabel,
        etaText,
        elapsedSec,
      };
    },
  };
}
