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
 * 複数ファイルを ffmpeg に載せる（MEMFS 優先、WORKERFS は大容量のみ）
 * @param {import('@ffmpeg/ffmpeg').FFmpeg} ffmpeg
 * @param {File[]} files
 * @param {string} mountPoint WORKERFS 用マウントポイント
 * @param {number} [maxMemfsBytes]
 * @returns {Promise<{ pathByFile: Map<File, string>, cleanup: () => Promise<void> }>}
 */
export async function prepareFfmpegInputs(
  ffmpeg,
  files,
  mountPoint,
  maxMemfsBytes = DEFAULT_MEMFS_MAX_BYTES,
) {
  /** @type {Map<File, string>} */
  const pathByFile = new Map();
  /** @type {string[]} */
  const memfsPaths = [];
  /** @type {Set<string>} */
  const usedNames = new Set();
  /** @type {File[]} */
  const workerfsFiles = [];

  for (const file of files) {
    if (file.size <= maxMemfsBytes) {
      let name = sanitizeFfmpegFileName(file.name);
      let suffix = 1;
      while (usedNames.has(name)) {
        const dot = name.lastIndexOf(".");
        const stem = dot > 0 ? name.slice(0, dot) : name;
        const ext = dot > 0 ? name.slice(dot) : "";
        name = `${stem}_${suffix}${ext}`;
        suffix += 1;
      }
      usedNames.add(name);
      const data = new Uint8Array(await file.arrayBuffer());
      await ffmpeg.writeFile(name, data);
      memfsPaths.push(name);
      pathByFile.set(file, name);
      continue;
    }
    workerfsFiles.push(file);
  }

  if (workerfsFiles.length > 0) {
    try {
      try {
        await ffmpeg.unmount(mountPoint);
      } catch {
        /* not mounted */
      }
      await ffmpeg.mount("WORKERFS", { files: workerfsFiles }, mountPoint);
      for (const file of workerfsFiles) {
        pathByFile.set(file, `${mountPoint}/${file.name}`);
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      const mib = (workerfsFiles[0].size / (1024 * 1024)).toFixed(0);
      throw new Error(
        `大きな動画の読み込みに失敗しました（${detail}）。${mib}MB 超のファイルは Chrome / Edge でお試しください。`,
      );
    }
  }

  const mountedWorkerfs = workerfsFiles.length > 0;

  return {
    pathByFile,
    cleanup: async () => {
      for (const path of memfsPaths) {
        try {
          await ffmpeg.deleteFile(path);
        } catch {
          /* ignore */
        }
      }
      if (mountedWorkerfs) {
        try {
          await ffmpeg.unmount(mountPoint);
        } catch {
          /* ignore */
        }
      }
    },
  };
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
