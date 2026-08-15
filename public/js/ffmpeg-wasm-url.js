/**
 * ffmpeg-core.wasm の URL を解決（R2 API → public 静的ファイルの順で試行）
 */

const WASM_MAGIC = [0x00, 0x61, 0x73, 0x6d];

/** @ffmpeg/core のバージョン（package.json と一致させる） */
const FFMPEG_CORE_VERSION = "0.12.6";

const WASM_URL_CANDIDATES = [
  "/api/image-converter/assets/ffmpeg-core.wasm",
  "/apps/image-converter/vendor/ffmpeg/ffmpeg-core.wasm",
  `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd/ffmpeg-core.wasm`,
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

/** 利用可能な ffmpeg-core.wasm URL を返す */
export async function resolveFfmpegWasmUrl() {
  for (const url of WASM_URL_CANDIDATES) {
    if (await probeWasmUrl(url)) return url;
  }

  throw new Error(
    "ffmpeg-core.wasm が見つかりません。ネットワーク接続を確認するか、ページを再読み込みしてください。管理者は npm run assets:upload-ffmpeg を実行してください。",
  );
}
