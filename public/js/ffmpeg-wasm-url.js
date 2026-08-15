/**
 * ffmpeg-core の URL を解決（R2 API → public 静的 → unpkg の順）
 */

const WASM_MAGIC = [0x00, 0x61, 0x73, 0x6d];

/** @ffmpeg/core / @ffmpeg/core-mt のバージョン（package.json と一致） */
export const FFMPEG_CORE_VERSION = "0.12.6";

const ST_WASM_URL_CANDIDATES = [
  "/api/image-converter/assets/ffmpeg-core.wasm",
  "/apps/image-converter/vendor/ffmpeg/ffmpeg-core.wasm",
  `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd/ffmpeg-core.wasm`,
];

const MT_WASM_URL_CANDIDATES = [
  "/api/image-converter/assets/ffmpeg-core-mt.wasm",
  `https://unpkg.com/@ffmpeg/core-mt@${FFMPEG_CORE_VERSION}/dist/umd/ffmpeg-core.wasm`,
];

/**
 * レスポンス先頭が WASM マジックか確認
 * @param {Response} response
 */
async function responseLooksLikeWasm(response) {
  if (!response.ok) return false;
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength < 4) return false;
  const bytes = new Uint8Array(buffer);
  return WASM_MAGIC.every((value, index) => bytes[index] === value);
}

/**
 * @param {string} url
 */
async function probeWasmUrl(url) {
  try {
    const ranged = await fetch(url, { headers: { Range: "bytes=0-3" } });
    if (await responseLooksLikeWasm(ranged)) return true;

    const full = await fetch(url);
    return await responseLooksLikeWasm(full);
  } catch {
    return false;
  }
}

/**
 * @param {string[]} candidates
 */
async function resolveFirstWasm(candidates) {
  for (const url of candidates) {
    if (await probeWasmUrl(url)) return url;
  }
  return null;
}

/** 利用可能な ffmpeg-core.wasm URL を返す（シングルスレッド） */
export async function resolveFfmpegWasmUrl() {
  const url = await resolveFirstWasm(ST_WASM_URL_CANDIDATES);
  if (url) return url;

  throw new Error(
    "ffmpeg-core.wasm が見つかりません。ネットワーク接続を確認するか、ページを再読み込みしてください。管理者は npm run assets:upload-ffmpeg を実行してください。",
  );
}

/**
 * ffmpeg-core のロード用 URL 一式
 * @param {{ multithread?: boolean }} [options]
 */
export async function getFfmpegCoreUrls(options = {}) {
  const multithread = options.multithread === true;

  if (multithread) {
    const wasm = await resolveFirstWasm(MT_WASM_URL_CANDIDATES);
    if (!wasm) {
      throw new Error(
        "ffmpeg-core-mt.wasm が見つかりません。ネットワーク接続を確認するか、CPU モードで再試行してください。",
      );
    }
    const base = `https://unpkg.com/@ffmpeg/core-mt@${FFMPEG_CORE_VERSION}/dist/umd`;
    return {
      multithread: true,
      coreJs: `${base}/ffmpeg-core.js`,
      coreWorkerJs: `${base}/ffmpeg-core.worker.js`,
      wasm,
    };
  }

  return {
    multithread: false,
    coreJs: "/apps/image-converter/vendor/ffmpeg/ffmpeg-core.js",
    coreWorkerJs: null,
    wasm: await resolveFfmpegWasmUrl(),
  };
}
