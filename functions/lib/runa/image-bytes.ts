/**
 * Runa 画像 API 向けバイト列ユーティリティ（マジックバイト検出・base64）
 */

export type SupportedImageMime = "image/png" | "image/jpeg";

/** 編集 API 入力を圧縮する閾値（超えたら JPEG 化を試行） */
export const EDIT_IMAGE_COMPRESS_THRESHOLD_BYTES = 2 * 1024 * 1024;
/** 編集 API 入力の最大辺（px） */
export const EDIT_IMAGE_MAX_EDGE_PX = 2048;

/** PNG / JPEG のみ API 入力として許可 */
export function detectImageMimeFromBytes(
  bytes: Uint8Array
): SupportedImageMime | null {
  if (bytes.length >= 8) {
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      return "image/png";
    }
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  return null;
}

/** Workers 上で大きいバイナリも安全に base64 化 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  const chunkSize = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const end = Math.min(i + chunkSize, bytes.length);
    for (let j = i; j < end; j++) {
      binary += String.fromCharCode(bytes[j]!);
    }
  }
  return btoa(binary);
}

export function imageBytesToDataUri(bytes: Uint8Array, mime: SupportedImageMime): string {
  return `data:${mime};base64,${uint8ArrayToBase64(bytes)}`;
}

/** data URI がデコード可能で PNG/JPEG マジックバイトを持つか */
export function validateImageDataUri(dataUri: string): boolean {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUri.trim());
  if (!match) return false;
  try {
    const binary = atob(match[2]!);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return detectImageMimeFromBytes(bytes) !== null;
  } catch {
    return false;
  }
}
