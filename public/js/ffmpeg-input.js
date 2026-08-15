/**
 * ffmpeg.wasm への入力ファイル配置（WORKERFS が使えない環境では MEMFS に書き込み）
 */

/** デフォルト: 256MB まで MEMFS、超過時のみ WORKERFS を試行 */
export const DEFAULT_MEMFS_MAX_BYTES = 256 * 1024 * 1024;

/**
 * ファイル名を MEMFS 用にサニタイズ
 * @param {string} name
 */
export function sanitizeFfmpegFileName(name) {
  const base = String(name).split(/[/\\]/).pop() ?? "input.bin";
  const safe = base.replace(/[^\w.\-()+]/g, "_");
  return safe || "input.bin";
}

/**
 * ffmpeg に入力ファイルを載せる
 * @param {import('@ffmpeg/ffmpeg').FFmpeg} ffmpeg
 * @param {File} file
 * @param {string} mountPoint WORKERFS 用マウントポイント
 * @param {number} [maxMemfsBytes]
 */
export async function prepareFfmpegInput(
  ffmpeg,
  file,
  mountPoint,
  maxMemfsBytes = DEFAULT_MEMFS_MAX_BYTES,
) {
  const memfsName = sanitizeFfmpegFileName(file.name);

  if (file.size <= maxMemfsBytes) {
    const data = new Uint8Array(await file.arrayBuffer());
    await ffmpeg.writeFile(memfsName, data);
    return {
      inputPath: memfsName,
      mode: "memfs",
      cleanup: async () => {
        try {
          await ffmpeg.deleteFile(memfsName);
        } catch {
          /* ignore */
        }
      },
    };
  }

  try {
    try {
      await ffmpeg.unmount(mountPoint);
    } catch {
      /* not mounted */
    }
    await ffmpeg.mount("WORKERFS", { files: [file] }, mountPoint);
    return {
      inputPath: `${mountPoint}/${file.name}`,
      mode: "workerfs",
      cleanup: async () => {
        try {
          await ffmpeg.unmount(mountPoint);
        } catch {
          /* ignore */
        }
      },
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `大きな動画の読み込みに失敗しました（${detail}）。ファイルサイズを小さくするか、Chrome / Edge をお試しください。`,
    );
  }
}

/**
 * ffmpeg exec — 非ゼロ終了時は例外
 * @param {import('@ffmpeg/ffmpeg').FFmpeg} ffmpeg
 * @param {string[]} args
 */
export async function execFfmpegOrThrow(ffmpeg, args) {
  const code = await ffmpeg.exec(args);
  if (code !== 0) {
    throw new Error(`ffmpeg の処理に失敗しました（終了コード ${code}）`);
  }
}
