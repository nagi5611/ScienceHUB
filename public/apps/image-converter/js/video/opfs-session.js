/**
 * OPFS へのフレーム一時保存（メモリに全フレームを載せない）
 */

/** @typedef {{ index: number, name: string, size: number }} FrameEntry */
/** @typedef {{ baseName: string, format: string, width: number, height: number, fps: number, frames: FrameEntry[] }} FrameManifest */

let sessionCounter = 0;

/** OPFS が使えるか */
export function isOpfsAvailable() {
  return typeof navigator?.storage?.getDirectory === "function";
}

/** セッション ID を生成 */
function createSessionId() {
  sessionCounter += 1;
  return `icv-vid-${Date.now()}-${sessionCounter}`;
}

/**
 * OPFS フレームセッションを作成
 * @param {string} baseName 元ファイル名（拡張子なし）
 */
export async function createOpfsSession(baseName) {
  if (!isOpfsAvailable()) {
    throw new Error("このブラウザは OPFS（一時ストレージ）に対応していません");
  }

  const sessionId = createSessionId();
  const root = await navigator.storage.getDirectory();
  const sessionDir = await root.getDirectoryHandle(sessionId, { create: true });

  /** @type {FrameManifest} */
  const manifest = {
    baseName,
    format: "png",
    width: 0,
    height: 0,
    fps: 0,
    frames: [],
  };

  return {
    sessionId,
    sessionDir,

    /** @param {Partial<FrameManifest>} meta */
    setMeta(meta) {
      Object.assign(manifest, meta);
    },

    getManifest() {
      return manifest;
    },

    /**
     * フレーム Blob を OPFS に書き込む
     * @param {number} index
     * @param {string} name
     * @param {Blob} blob
     */
    async writeFrame(index, name, blob) {
      const fileHandle = await sessionDir.getFileHandle(`${index}.bin`, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      manifest.frames.push({ index, name, size: blob.size });
    },

    /** @param {number} index */
    async readFrameBlob(index) {
      const fileHandle = await sessionDir.getFileHandle(`${index}.bin`);
      const file = await fileHandle.getFile();
      return file;
    },

    /** セッションを削除 */
    async dispose() {
      try {
        await root.removeEntry(sessionId, { recursive: true });
      } catch {
        // 失敗しても続行
      }
    },
  };
}

/**
 * 推定ディスク使用量とストレージ余裕を確認
 * @param {number} estimatedBytes
 */
export async function checkStorageQuota(estimatedBytes) {
  if (!navigator.storage?.estimate) {
    return { ok: true, quota: null, usage: null, available: null };
  }
  const { quota, usage } = await navigator.storage.estimate();
  const available = quota != null && usage != null ? quota - usage : null;
  if (available != null && estimatedBytes > available * 0.85) {
    return {
      ok: false,
      quota,
      usage,
      available,
      message: "ブラウザのストレージ容量が不足する可能性があります",
    };
  }
  return { ok: true, quota, usage, available };
}
