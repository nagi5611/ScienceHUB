/**
 * 波形データ生成（Web Audio API / HTMLMediaElement フォールバック）
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
 * Web Audio でデコード
 * @param {File} file
 */
async function decodeWithWebAudio(file) {
  const arrayBuffer = await file.arrayBuffer();
  const context = new AudioContext();
  try {
    return await context.decodeAudioData(arrayBuffer.slice(0));
  } finally {
    await context.close();
  }
}

/**
 * メディア要素から長さだけ取得（デコード不可時）
 * @param {File} file
 */
function probeDurationWithMedia(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const media = document.createElement(file.type.startsWith("video/") ? "video" : "audio");
    media.preload = "metadata";
    media.src = url;
    media.onloadedmetadata = () => {
      const duration = Number.isFinite(media.duration) ? media.duration : 0;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    media.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("メディアの長さを取得できませんでした"));
    };
  });
}

/**
 * ファイルから波形ピークを生成
 * @param {File} file
 * @param {number} [sampleCount]
 * @returns {Promise<WaveformData>}
 */
export async function generateWaveformPeaks(file, sampleCount = 1200) {
  try {
    const buffer = await decodeWithWebAudio(file);
    return {
      peaks: peaksFromAudioBuffer(buffer, sampleCount),
      duration: buffer.duration,
    };
  } catch {
    const duration = await probeDurationWithMedia(file);
    /** @type {number[]} */
    const peaks = Array.from({ length: sampleCount }, (_, i) => {
      const t = i / sampleCount;
      return 0.15 + Math.abs(Math.sin(t * Math.PI * 8)) * 0.35;
    });
    return { peaks, duration };
  }
}

/**
 * 波形を canvas に描画
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} peaks
 * @param {{ startRatio?: number, endRatio?: number, playheadRatio?: number, viewStart?: number, viewEnd?: number }} [options]
 */
export function drawWaveform(canvas, peaks, options = {}) {
  const {
    startRatio = 0,
    endRatio = 1,
    playheadRatio = 0,
    viewStart = 0,
    viewEnd = 1,
  } = options;
  const ctx = canvas.getContext("2d");
  if (!ctx || !peaks.length) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width <= 0 || height <= 0) return;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const viewSpan = Math.max(0.001, viewEnd - viewStart);
  const startIdx = Math.max(0, Math.floor(viewStart * peaks.length));
  const endIdx = Math.min(peaks.length, Math.ceil(viewEnd * peaks.length));
  const visiblePeaks = peaks.slice(startIdx, endIdx);
  if (!visiblePeaks.length) return;

  const mid = height / 2;
  const barWidth = width / visiblePeaks.length;

  for (let i = 0; i < visiblePeaks.length; i += 1) {
    const x = i * barWidth;
    const ratio = viewStart + (i / visiblePeaks.length) * viewSpan;
    const amp = visiblePeaks[i] * (height * 0.44);
    const inSelection = ratio >= startRatio && ratio <= endRatio;

    ctx.fillStyle = inSelection ? "#f38020" : "#c5cdd8";
    ctx.fillRect(x, mid - amp, Math.max(1, barWidth * 0.9), amp * 2);
  }

  const visiblePlayhead = (playheadRatio - viewStart) / viewSpan;
  if (visiblePlayhead >= 0 && visiblePlayhead <= 1) {
    const playX = visiblePlayhead * width;
    ctx.strokeStyle = "#1d2433";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playX, 4);
    ctx.lineTo(playX, height - 4);
    ctx.stroke();
  }
}
