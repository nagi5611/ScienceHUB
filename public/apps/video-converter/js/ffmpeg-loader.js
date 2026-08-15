/**
 * ffmpeg.wasm シングルトンローダー
 */

import { FFMPEG_CORE_JS_BASE } from "./constants.js";
import { resolveFfmpegWasmUrl } from "../../../js/ffmpeg-wasm-url.js";

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
    const workerBase = "/apps/image-converter/vendor/ffmpeg-js";
    const wasmUrl = await resolveFfmpegWasmUrl();
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${FFMPEG_CORE_JS_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(wasmUrl, "application/wasm"),
        workerURL: await toBlobURL(`${workerBase}/worker.js`, "text/javascript"),
      });
    } catch (error) {
      ffmpegLoadPromise = null;
      const message = error instanceof Error ? error.message : String(error);
      if (/magic word|CompileError|Aborted/i.test(message)) {
        throw new Error(
          "ffmpeg の読み込みに失敗しました（wasm が正しく配信されていません）。npm run dev を再起動するか、npm run assets:upload-ffmpeg:local を実行してください",
        );
      }
      if (/404|not found/i.test(message)) {
        throw new Error(
          "ffmpeg の読み込みに失敗しました（wasm が見つかりません）。ローカルでは npm run assets:upload-ffmpeg:local を実行してください",
        );
      }
      throw new Error(`ffmpeg の読み込みに失敗しました: ${message}`);
    }
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return ffmpegLoadPromise;
}
