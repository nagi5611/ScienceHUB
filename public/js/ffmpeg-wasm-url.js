/**
 * ffmpeg-core.wasm の URL を解決（R2 API → public 静的ファイルの順で試行）
 */

const WASM_MAGIC = [0x00, 0x61, 0x73, 0x6d];

const WASM_URL_CANDIDATES = [
  "/api/image-converter/assets/ffmpeg-core.wasm",
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
    "ffmpeg-core.wasm が見つかりません。npm run dev を再起動するか、npm run assets:upload-ffmpeg:local を実行してください。",
  );
}
