/**
 * Runa 添付画像をストレージから読み込み vision 用 data URL に変換
 */

import type { Env, SessionUser } from "../types";
import { readStorageFileForRuna } from "./storage-io";
export interface RunaAttachmentImageSource {
  imagePaths?: string[];
}

const MAX_VISION_IMAGES = 10;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const IMAGE_MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  avif: "image/avif",
};

function guessImageMime(path: string, fromMeta: string | null): string {
  if (fromMeta?.startsWith("image/")) return fromMeta;
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_MIME_BY_EXT[ext] ?? "image/jpeg";
}

function toDataUrl(mime: string, base64: string): string {
  return `data:${mime};base64,${base64}`;
}

/** 添付の imagePaths を data URL 配列に変換（上限あり） */
export async function loadAttachmentImageDataUrls(
  env: Env,
  db: D1Database,
  user: SessionUser,
  attachments: RunaAttachmentImageSource[]
): Promise<string[]> {
  const paths: string[] = [];
  for (const attachment of attachments) {
    for (const imagePath of attachment.imagePaths ?? []) {
      if (paths.length >= MAX_VISION_IMAGES) break;
      if (imagePath && !paths.includes(imagePath)) {
        paths.push(imagePath);
      }
    }
  }

  const urls: string[] = [];
  for (const path of paths.slice(0, MAX_VISION_IMAGES)) {
    try {
      const file = await readStorageFileForRuna(
        env,
        db,
        user,
        path,
        MAX_IMAGE_BYTES
      );
      if (file.encoding !== "base64") continue;
      const mime = guessImageMime(path, file.mimeType);
      if (!mime.startsWith("image/")) continue;
      urls.push(toDataUrl(mime, file.content));
    } catch {
      /* skip unreadable images */
    }
  }
  return urls;
}
