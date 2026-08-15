/**
 * ファイル先頭バイトから実体形式を判定
 */

/** @typedef {'audio' | 'video' | 'image' | 'unknown'} SniffKind */

function isImageHeader(header) {
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return true;
  }
  if (
    header.length >= 8 &&
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47
  ) {
    return true;
  }
  if (
    header.length >= 6 &&
    header[0] === 0x47 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x38
  ) {
    return true;
  }
  if (header.length >= 4 && header[0] === 0x42 && header[1] === 0x4d) {
    return true;
  }
  return false;
}

function isAudioHeader(header) {
  if (header.length >= 3 && header[0] === 0x49 && header[1] === 0x44 && header[2] === 0x33) {
    return true;
  }
  if (header.length >= 4 && header[0] === 0x4f && header[1] === 0x67 && header[2] === 0x67 && header[3] === 0x53) {
    return true;
  }
  if (header.length >= 4 && header[0] === 0x66 && header[1] === 0x4c && header[2] === 0x61 && header[3] === 0x43) {
    return true;
  }
  if (header.length >= 12) {
    const riff = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46;
    const tag = String.fromCharCode(header[8], header[9], header[10], header[11]);
    if (riff && tag === "WAVE") return true;
  }
  return false;
}

function isVideoHeader(header) {
  if (header.length >= 12) {
    const riff = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46;
    const tag = String.fromCharCode(header[8], header[9], header[10], header[11]);
    if (riff && tag === "AVI ") return true;
  }
  if (header.length >= 8) {
    const box = String.fromCharCode(header[4], header[5], header[6], header[7]);
    if (box === "ftyp") return true;
  }
  if (header.length >= 4 && header[0] === 0x1a && header[1] === 0x45 && header[2] === 0xdf && header[3] === 0xa3) {
    return true;
  }
  return false;
}

/**
 * @param {File} file
 * @returns {Promise<SniffKind>}
 */
export async function sniffFileKind(file) {
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (isImageHeader(header)) return "image";
  if (isAudioHeader(header)) return "audio";
  if (isVideoHeader(header)) return "video";
  return "unknown";
}

/** @param {File} file */
export async function detectImageLabel(file) {
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8) return "JPEG";
  if (header.length >= 8 && header[0] === 0x89 && header[1] === 0x50) return "PNG";
  if (file.type.startsWith("image/")) return file.type.replace("image/", "").toUpperCase() || "画像";
  return "画像";
}
