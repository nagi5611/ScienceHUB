/**
 * ウェブサイト公開 — R2 操作
 */

import { getExtension } from "./static-policy";

export interface WebFileEntry {
  path: string;
  size: number;
  updated: number | null;
}

const MIME_BY_EXT: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

/** 拡張子から Content-Type を推定 */
export function contentTypeForPath(relativePath: string): string {
  const ext = getExtension(relativePath);
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

/** プレフィックス配下のファイル一覧 */
export async function listSiteFiles(
  bucket: R2Bucket,
  r2Prefix: string
): Promise<WebFileEntry[]> {
  const files: WebFileEntry[] = [];
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix: r2Prefix, cursor });
    for (const obj of listed.objects) {
      if (!obj.key.startsWith(r2Prefix)) continue;
      const rel = obj.key.slice(r2Prefix.length);
      if (!rel || rel.endsWith("/")) continue;
      files.push({
        path: rel,
        size: obj.size,
        updated: obj.uploaded ? new Date(obj.uploaded).getTime() : null,
      });
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  files.sort((a, b) => a.path.localeCompare(b.path));
  return files;
}

/** プレフィックス配下を一括削除 */
export async function deleteSitePrefix(
  bucket: R2Bucket,
  r2Prefix: string
): Promise<void> {
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix: r2Prefix, cursor });
    for (const obj of listed.objects) {
      await bucket.delete(obj.key);
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);
}

/** 単一ファイル削除 */
export async function deleteSiteFile(
  bucket: R2Bucket,
  r2Key: string
): Promise<number> {
  const head = await bucket.head(r2Key);
  if (!head) return 0;
  await bucket.delete(r2Key);
  return head.size;
}
