/**
 * ffmpeg.wasm シングルトンローダー（動画/音声エディタ共通）
 */

import { resolveFfmpegWasmUrl } from "./ffmpeg-wasm-url.js";

const FFMPEG_CORE_JS_BASE = "/apps/image-converter/vendor/ffmpeg";
const WORKER_BASE = "/apps/image-converter/vendor/ffmpeg-js";

/** @type {import('@ffmpeg/ffmpeg').FFmpeg | null} */
let ffmpegInstance = null;
/** @type {Promise<import('@ffmpeg/ffmpeg').FFmpeg> | null} */
let ffmpegLoadPromise = null;

/** ffmpeg をロード（1回のみ） */
export async function getFfmpeg() {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (ffmpegLoadPromise) return ffmpegLoadPromise;

  ffmpegLoadPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");
    const ffmpeg = new FFmpeg();
    let wasmUrl;
    try {
      wasmUrl = await resolveFfmpegWasmUrl();
    } catch (error) {
      ffmpegLoadPromise = null;
      throw error;
    }

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${FFMPEG_CORE_JS_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(wasmUrl, "application/wasm"),
        workerURL: await toBlobURL(`${WORKER_BASE}/worker.js`, "text/javascript"),
      });
    } catch (error) {
      ffmpegLoadPromise = null;
      const message = error instanceof Error ? error.message : String(error);
      if (/magic word|CompileError|Aborted|incorrect response/i.test(message)) {
        throw new Error(
          "ffmpeg の読み込みに失敗しました（wasm が正しく配信されていません）。ページを再読み込みするか、しばらく待ってから再度お試しください。",
        );
      }
      if (/404|not found|見つかりません/i.test(message)) {
        throw new Error(
          "ffmpeg-core.wasm が見つかりません。管理者は npm run assets:upload-ffmpeg を実行してください。",
        );
      }
      throw new Error(`ffmpeg の読み込みに失敗しました: ${message}`);
    }

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return ffmpegLoadPromise;
}
