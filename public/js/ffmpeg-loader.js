/**
 * ffmpeg.wasm シングルトンローダー（動画/音声エディタ共通）
 * crossOriginIsolated 時は @ffmpeg/core-mt で CPU 全コアを使用
 */

import { canUseFfmpegMultithread, setFfmpegMultithreadLoaded } from "./ffmpeg-capabilities.js";
import { getFfmpegCoreUrls } from "./ffmpeg-wasm-url.js";

const WORKER_BASE = "/apps/image-converter/vendor/ffmpeg-js";

/** @type {import('@ffmpeg/ffmpeg').FFmpeg | null} */
let ffmpegInstance = null;
/** @type {Promise<import('@ffmpeg/ffmpeg').FFmpeg> | null} */
let ffmpegLoadPromise = null;
/** @type {boolean | null} */
let loadedMultithread = null;

/** ffmpeg をロード（1回のみ） */
export async function getFfmpeg() {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (ffmpegLoadPromise) return ffmpegLoadPromise;

  ffmpegLoadPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");
    const ffmpeg = new FFmpeg();
    const useMt = canUseFfmpegMultithread();

    let urls;
    try {
      urls = await getFfmpegCoreUrls({ multithread: useMt });
    } catch (error) {
      if (useMt) {
        urls = await getFfmpegCoreUrls({ multithread: false });
        loadedMultithread = false;
        setFfmpegMultithreadLoaded(false);
      } else {
        ffmpegLoadPromise = null;
        throw error;
      }
    }

    if (loadedMultithread === null) {
      loadedMultithread = urls.multithread === true;
    }
    setFfmpegMultithreadLoaded(loadedMultithread === true);

    try {
      /** @type {Record<string, string>} */
      const loadConfig = {
        classWorkerURL: await toBlobURL(`${WORKER_BASE}/worker.js`, "text/javascript"),
        coreURL: await toBlobURL(urls.coreJs, "text/javascript"),
        wasmURL: await toBlobURL(urls.wasm, "application/wasm"),
      };
      if (urls.coreWorkerJs) {
        loadConfig.workerURL = await toBlobURL(urls.coreWorkerJs, "text/javascript");
      }

      await ffmpeg.load(loadConfig);
    } catch (error) {
      ffmpegLoadPromise = null;
      loadedMultithread = null;
      setFfmpegMultithreadLoaded(false);

      if (useMt) {
        try {
          const stUrls = await getFfmpegCoreUrls({ multithread: false });
          await ffmpeg.load({
            classWorkerURL: await toBlobURL(`${WORKER_BASE}/worker.js`, "text/javascript"),
            coreURL: await toBlobURL(stUrls.coreJs, "text/javascript"),
            wasmURL: await toBlobURL(stUrls.wasm, "application/wasm"),
          });
          loadedMultithread = false;
          setFfmpegMultithreadLoaded(false);
        } catch (fallbackError) {
          const message =
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
          throw new Error(`ffmpeg の読み込みに失敗しました: ${message}`);
        }
      } else {
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
    }

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return ffmpegLoadPromise;
}
