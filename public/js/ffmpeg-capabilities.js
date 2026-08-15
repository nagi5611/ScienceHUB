/**
 * ffmpeg / WebCodecs のエンコード能力を検出
 */

/** Cross-Origin Isolation（SharedArrayBuffer 用） */
export function isCrossOriginIsolated() {
  return typeof crossOriginIsolated !== "undefined" && crossOriginIsolated;
}

/** ffmpeg.wasm マルチスレッド（@ffmpeg/core-mt）が使えるか */
export function canUseFfmpegMultithread() {
  return isCrossOriginIsolated() && typeof SharedArrayBuffer !== "undefined";
}

/** @type {boolean} */
let ffmpegMultithreadActive = false;

/** ffmpeg-loader が core-mt でロード完了したか（capabilities 経由で参照） */
export function isFfmpegMultithreadLoaded() {
  return ffmpegMultithreadActive;
}

/** @param {boolean} active */
export function setFfmpegMultithreadLoaded(active) {
  ffmpegMultithreadActive = active;
}

/**
 * H.264 ハードウェア VideoEncoder をプローブ
 * @param {number} width
 * @param {number} height
 */
export async function probeHardwareVideoEncoder(width, height) {
  if (typeof VideoEncoder === "undefined") {
    return { supported: false, reason: "VideoEncoder 非対応" };
  }

  const evenW = Math.max(2, width % 2 === 0 ? width : width - 1);
  const evenH = Math.max(2, height % 2 === 0 ? height : height - 1);

  /** @type {VideoEncoderConfig[]} */
  const candidates = [
    { codec: "avc1.640028", width: evenW, height: evenH, hardwareAcceleration: "prefer-hardware" },
    { codec: "avc1.4D401E", width: evenW, height: evenH, hardwareAcceleration: "prefer-hardware" },
    { codec: "avc1.42E01E", width: evenW, height: evenH, hardwareAcceleration: "prefer-hardware" },
    { codec: "avc1.640028", width: evenW, height: evenH, hardwareAcceleration: "no-preference" },
  ];

  for (const config of candidates) {
    try {
      const result = await VideoEncoder.isConfigSupported(config);
      if (result.supported) {
        const resolved = result.config ?? config;
        const hw =
          resolved.hardwareAcceleration === "prefer-hardware" ||
          resolved.hardwareAcceleration === "require-hardware";
        return { supported: true, config: resolved, preferHardware: hw };
      }
    } catch {
      /* try next */
    }
  }

  return { supported: false, reason: "H.264 エンコーダが見つかりません" };
}

/**
 * エンコード能力の概要
 * @param {number} [videoWidth]
 * @param {number} [videoHeight]
 */
export async function getEncodeCapabilities(videoWidth = 1920, videoHeight = 1080) {
  const gpu = await probeHardwareVideoEncoder(videoWidth, videoHeight);
  return {
    crossOriginIsolated: isCrossOriginIsolated(),
    ffmpegMultithread: canUseFfmpegMultithread(),
    hardwareVideoEncoder: gpu.supported,
    hardwareEncoderConfig: gpu.config ?? null,
    cpuCores: typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? 4 : 4,
  };
}

/** 加速モードの表示ラベル */
export function describeAccelerationMode(mode, caps) {
  switch (mode) {
    case "cpu-max":
      return caps.ffmpegMultithread
        ? `CPU 全コア（${caps.cpuCores} スレッド）`
        : "CPU 最大（マルチスレッドにはページ再読込が必要）";
    case "gpu":
      return caps.hardwareVideoEncoder ? "GPU 優先（WebCodecs）" : "GPU 非対応 — CPU にフォールバック";
  }
  if (caps.hardwareVideoEncoder && caps.ffmpegMultithread) {
    return `自動（GPU / CPU ${caps.cpuCores} コア）`;
  }
  if (caps.ffmpegMultithread) {
    return `自動（CPU ${caps.cpuCores} コア）`;
  }
  return "自動（シングルスレッド CPU）";
}
