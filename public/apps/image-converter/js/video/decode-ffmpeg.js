/**
 * ffmpeg.wasm + WORKERFS — WebM / AVI および MP4 フォールバック
 * 入力 File をメモリに丸ごと載せず、1 フレームずつ OPFS へ書き出す
 */

import { FFMPEG_CORE_JS_BASE } from "./constants.js";
import { buildFrameFilename } from "./probe.js";
import { resolveFfmpegWasmUrl } from "../../../../js/ffmpeg-wasm-url.js";

/** @typedef {import('./probe.js').VideoProbe} VideoProbe */

/** @type {import('@ffmpeg/ffmpeg').FFmpeg | null} */
let ffmpegInstance = null;
/** @type {Promise<import('@ffmpeg/ffmpeg').FFmpeg> | null} */
let ffmpegLoadPromise = null;

/** ffmpeg をシングルトンでロード */
async function getFfmpeg() {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (ffmpegLoadPromise) return ffmpegLoadPromise;

  ffmpegLoadPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");
    const ffmpeg = new FFmpeg();
    const jsBase = FFMPEG_CORE_JS_BASE;
    const workerBase = "/apps/image-converter/vendor/ffmpeg-js";
    const wasmUrl = await resolveFfmpegWasmUrl();
    await ffmpeg.load({
      coreURL: await toBlobURL(`${jsBase}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(wasmUrl, "application/wasm"),
      workerURL: await toBlobURL(`${workerBase}/worker.js`, "text/javascript"),
    });
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return ffmpegLoadPromise;
}

/**
 * ffmpeg ログから fps / duration を解析
 * @param {string} message
 * @param {VideoProbe} probe
 */
function parseFfmpegLog(message, probe) {
  const fpsMatch = message.match(/(\d+(?:\.\d+)?)\s*fps/);
  if (fpsMatch) probe.fps = parseFloat(fpsMatch[1]);

  const durationMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (durationMatch) {
    const h = Number(durationMatch[1]);
    const m = Number(durationMatch[2]);
    const s = Number(durationMatch[3]);
    probe.duration = h * 3600 + m * 60 + s;
  }
}

/**
 * ffmpeg で全フレームを OPFS に抽出
 * @param {File} file
 * @param {Awaited<ReturnType<import('./opfs-session.js').createOpfsSession>>} session
 * @param {{ format: 'png' | 'jpeg' | 'gif', quality: number, baseName: string }} options
 * @param {VideoProbe} initialProbe
 * @param {{ onProgress?: (p: { done: number, total: number }) => void }} [callbacks]
 */
export async function decodeFfmpegToOpfs(file, session, options, initialProbe, callbacks = {}) {
  const ffmpeg = await getFfmpeg();
  const mountPoint = "/icv-input";

  /** @type {VideoProbe} */
  const probe = { ...initialProbe };

  await ffmpeg.mount("WORKERFS", { files: [file] }, mountPoint);
  const inputPath = `${mountPoint}/${file.name}`;

  const logs = [];
  const onLog = ({ message }) => {
    logs.push(message);
    parseFfmpegLog(message, probe);
  };
  ffmpeg.on("log", onLog);

  try {
    await ffmpeg.exec(["-hide_banner", "-i", inputPath, "-f", "null", "-"]);
  } catch {
    // -f null は非ゼロ終了することがあるがログは取れる
  }

  ffmpeg.off("log", onLog);

  if (probe.duration <= 0) {
    await ffmpeg.unmount(mountPoint);
    throw new Error("動画の長さを取得できませんでした");
  }

  const fps = probe.fps > 0 ? probe.fps : 30;
  const totalFrames = Math.max(1, Math.round(probe.duration * fps));
  probe.frameCount = totalFrames;
  probe.fps = fps;

  session.setMeta({
    format: options.format,
    width: probe.width,
    height: probe.height,
    fps,
  });

  const ext = options.format === "jpeg" ? "jpg" : options.format;

  for (let i = 0; i < totalFrames; i += 1) {
    const outName = `frame.${ext}`;
    const args = [
      "-hide_banner",
      "-i",
      inputPath,
      "-vf",
      `select='eq(n\\,${i})'`,
      "-vsync",
      "0",
      "-frames:v",
      "1",
    ];

    if (options.format === "jpeg") {
      args.push("-q:v", String(Math.max(2, Math.round((100 - options.quality) / 3 + 2))));
    }

    args.push("-y", outName);

    await ffmpeg.exec(args);

    let data;
    try {
      data = await ffmpeg.readFile(outName);
    } catch {
      break;
    }

    const mime =
      options.format === "jpeg"
        ? "image/jpeg"
        : options.format === "gif"
          ? "image/gif"
          : "image/png";

    const blob = new Blob([data], { type: mime });
    const name = buildFrameFilename(options.baseName, i, options.format);
    await session.writeFrame(i, name, blob);
    await ffmpeg.deleteFile(outName);

    if (callbacks.onProgress) {
      callbacks.onProgress({ done: i + 1, total: totalFrames });
    }
  }

  await ffmpeg.unmount(mountPoint);
  return { probe, frameCount: totalFrames };
}
