/**
 * 動画エディタ用波形 peaks 生成・描画
 */

/** @typedef {{ peaks: number[], duration: number }} WaveformData */

/**
 * AudioBuffer から正規化ピーク配列を生成
 * @param {AudioBuffer} buffer
 * @param {number} sampleCount
 */
export function peaksFromAudioBuffer(buffer, sampleCount = 1200) {
  const channel = buffer.getChannelData(0);
  const blockSize = Math.max(1, Math.floor(channel.length / sampleCount));
  /** @type {number[]} */
  const peaks = [];

  for (let i = 0; i < sampleCount; i += 1) {
    const start = i * blockSize;
    const end = Math.min(channel.length, start + blockSize);
    let max = 0;
    for (let j = start; j < end; j += 1) {
      const v = Math.abs(channel[j]);
      if (v > max) max = v;
    }
    peaks.push(max);
  }

  const peakMax = Math.max(...peaks, 0.001);
  return peaks.map((v) => v / peakMax);
}

/**
 * @param {File} file
 * @param {number} [sampleCount]
 * @returns {Promise<WaveformData>}
 */
export async function generateWaveformPeaks(file, sampleCount = 1200) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const context = new AudioContext();
    try {
      const buffer = await context.decodeAudioData(arrayBuffer.slice(0));
      return {
        peaks: peaksFromAudioBuffer(buffer, sampleCount),
        duration: buffer.duration,
      };
    } finally {
      await context.close();
    }
  } catch {
    /** @type {number[]} */
    const peaks = Array.from({ length: sampleCount }, (_, i) => {
      const t = i / sampleCount;
      return 0.12 + Math.abs(Math.sin(t * Math.PI * 6)) * 0.3;
    });
    return { peaks, duration: 0 };
  }
}

/**
 * 波形 canvas 描画（Resolve 風ダークテーマ）
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} peaks
 * @param {{ startRatio?: number, endRatio?: number, playheadRatio?: number, audioStartRatio?: number, audioEndRatio?: number }} [options]
 */
export function drawWaveform(canvas, peaks, options = {}) {
  const {
    startRatio = 0,
    endRatio = 1,
    playheadRatio = 0,
    audioStartRatio = startRatio,
    audioEndRatio = endRatio,
  } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx || !peaks.length) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width <= 0 || height <= 0) return;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, width, height);

  const mid = height / 2;
  const barWidth = width / peaks.length;

  for (let i = 0; i < peaks.length; i += 1) {
    const x = i * barWidth;
    const ratio = i / peaks.length;
    const amp = peaks[i] * (height * 0.42);
    const inVideo = ratio >= startRatio && ratio <= endRatio;
    const inAudio = ratio >= audioStartRatio && ratio <= audioEndRatio;

    if (inAudio) {
      ctx.fillStyle = inVideo ? "#00e0ff" : "#00ff7f";
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.15)";
    }
    ctx.fillRect(x, mid - amp, Math.max(1, barWidth * 0.88), amp * 2);
  }

  const playX = playheadRatio * width;
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(playX, 0);
  ctx.lineTo(playX, height);
  ctx.stroke();
}
