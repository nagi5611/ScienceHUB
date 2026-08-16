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
 * エンコード用の偶数ピクセル寸法（0 のときは 1920x1080 にフォールバック）
 * @param {number} width
 * @param {number} height
 */
export function normalizeEncodeDimensions(width, height) {
  const rawW = width > 0 ? width : 1920;
  const rawH = height > 0 ? height : 1080;
  const evenW = Math.max(64, rawW % 2 === 0 ? rawW : rawW - 1);
  const evenH = Math.max(64, rawH % 2 === 0 ? rawH : rawH - 1);
  return { width: evenW, height: evenH };
}

/**
 * @typedef {Object} HardwareEncoderStatus
 * @property {boolean} supported
 * @property {string} [reason]
 * @property {VideoEncoderConfig} [config]
 */

/** @type {HardwareEncoderStatus | null} */
let hardwareEncoderCache = null;

/** キャッシュ済み GPU エンコーダ状態（未プローブ時は null） */
export function getCachedHardwareVideoEncoderStatus() {
  return hardwareEncoderCache;
}

/** セッション内の GPU プローブ結果をリセット */
export function resetHardwareVideoEncoderCache() {
  hardwareEncoderCache = null;
}

/** GPU エンコーダを利用不可として記録（以降のエクスポートで再試行しない） */
export function markHardwareVideoEncoderUnavailable(reason) {
  hardwareEncoderCache = {
    supported: false,
    reason: reason || "GPU エンコーダが利用できません",
  };
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ve:encode-capabilities-changed"));
  }
}

/**
 * H.264 ハードウェア VideoEncoder をプローブ
 * @param {number} width
 * @param {number} height
 */
export async function probeHardwareVideoEncoder(width, height) {
  if (typeof VideoEncoder === "undefined") {
    return { supported: false, reason: "このブラウザは WebCodecs VideoEncoder 非対応です（Chrome / Edge 推奨）" };
  }

  const { width: evenW, height: evenH } = normalizeEncodeDimensions(width, height);

  /** @type {VideoEncoderConfig[]} */
  const candidates = [
    { codec: "avc1.640028", width: evenW, height: evenH, hardwareAcceleration: "prefer-hardware" },
    { codec: "avc1.4D401E", width: evenW, height: evenH, hardwareAcceleration: "prefer-hardware" },
    { codec: "avc1.42E01E", width: evenW, height: evenH, hardwareAcceleration: "prefer-hardware" },
    { codec: "avc1.640028", width: evenW, height: evenH, hardwareAcceleration: "no-preference" },
    { codec: "avc1.4D401E", width: evenW, height: evenH, hardwareAcceleration: "no-preference" },
  ];

  for (const config of candidates) {
    try {
      const result = await VideoEncoder.isConfigSupported(config);
      if (result.supported) {
        const resolved = result.config ?? config;
        return { supported: true, config: resolved, reason: undefined };
      }
    } catch {
      /* try next */
    }
  }

  return {
    supported: false,
    reason:
      "H.264 ハードウェアエンコーダが見つかりません（Firefox 非対応・Linux ではソフトウェアのみのことがあります）",
  };
}

/**
 * GPU エンコーダ可否（セッション内キャッシュあり）
 * @param {number} width
 * @param {number} height
 */
export async function getHardwareVideoEncoderStatus(width, height) {
  if (hardwareEncoderCache !== null) {
    return hardwareEncoderCache;
  }

  const result = await probeHardwareVideoEncoder(width, height);
  hardwareEncoderCache = {
    supported: result.supported,
    reason: result.reason,
    config: result.config ?? undefined,
  };
  return hardwareEncoderCache;
}

/**
 * エンコード能力の概要
 * @param {number} [videoWidth]
 * @param {number} [videoHeight]
 */
export async function getEncodeCapabilities(videoWidth = 1920, videoHeight = 1080) {
  const dims = normalizeEncodeDimensions(videoWidth, videoHeight);
  const gpu = await getHardwareVideoEncoderStatus(dims.width, dims.height);
  return {
    crossOriginIsolated: isCrossOriginIsolated(),
    ffmpegMultithread: canUseFfmpegMultithread(),
    hardwareVideoEncoder: gpu.supported,
    hardwareEncoderConfig: gpu.config ?? null,
    hardwareVideoEncoderReason: gpu.reason ?? null,
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
      return caps.hardwareVideoEncoder
        ? "GPU 優先（WebCodecs）"
        : caps.hardwareVideoEncoderReason || "GPU 非対応 — CPU にフォールバック";
  }
  if (caps.hardwareVideoEncoder && caps.ffmpegMultithread) {
    return `自動（GPU / CPU ${caps.cpuCores} コア）`;
  }
  if (caps.ffmpegMultithread) {
    return `自動（CPU ${caps.cpuCores} コア）`;
  }
  if (caps.hardwareVideoEncoder) {
    return `自動（GPU / CPU）`;
  }
  return "自動（CPU エンコード）";
}
