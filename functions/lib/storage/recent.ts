/**
 * 最近更新ファイルの高速一覧（R2 list の uploaded を使用、.meta 読み込みなし）
 */

import { getFiles } from "../r2";
import type { Env } from "../types";
import { FOLDER_META_NAME } from "./constants";
import { buildLogicalPath, rootPrefix, type StorageRootType } from "./keys";

export interface RecentFileEntry {
  name: string;
  path: string;
  type: "file";
  sizeBytes: number | null;
  updatedAt: number | null;
  location: string;
}

const DEFAULT_MAX_SCANNED_PER_ROOT = 1200;

function isFileObjectKey(keySuffix: string): boolean {
  if (!keySuffix || keySuffix.endsWith("/")) return false;
  if (keySuffix.endsWith(".meta")) return false;
  if (
    keySuffix === FOLDER_META_NAME ||
    keySuffix.endsWith(`/${FOLDER_META_NAME}`)
  ) {
    return false;
  }
  return true;
}

function parentLocation(relativeFilePath: string): string {
  const parts = relativeFilePath.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  return parts.slice(0, -1).join("/");
}

function uploadedMs(uploaded: Date | null | undefined): number | null {
  if (!uploaded) return null;
  const ms = new Date(uploaded).getTime();
  return Number.isFinite(ms) ? ms : null;
}

/** 1 ルート内の最近更新ファイル（R2 の uploaded ベース、上限付きスキャン） */
export async function listRecentFilesInRoot(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  options: {
    updatedFrom: number;
    limit: number;
    maxScanned?: number;
  }
): Promise<RecentFileEntry[]> {
  const bucket = getFiles(env);
  const prefix = rootPrefix(rootType, rootKey);
  const maxScanned = options.maxScanned ?? DEFAULT_MAX_SCANNED_PER_ROOT;
  const matches: RecentFileEntry[] = [];
  let scanned = 0;
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix, cursor, limit: 1000 });
    for (const obj of listed.objects) {
      scanned += 1;
      if (scanned > maxScanned) break;

      const keySuffix = obj.key.slice(prefix.length);
      if (!isFileObjectKey(keySuffix)) continue;

      const relativePath = keySuffix.replace(/^\/+/, "");
      if (!relativePath) continue;

      const updatedAt = uploadedMs(obj.uploaded);
      if (updatedAt === null || updatedAt < options.updatedFrom) continue;

      matches.push({
        name: relativePath.split("/").pop() ?? relativePath,
        path: buildLogicalPath(rootType, rootKey, relativePath),
        type: "file",
        sizeBytes: obj.size,
        updatedAt,
        location: parentLocation(relativePath),
      });
    }

    if (scanned > maxScanned) break;
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  matches.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  return matches.slice(0, options.limit);
}

/** ルート配列を並列度制限で処理（R2 レート制限対策） */
export async function mapRootsWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const batchSize = Math.max(1, concurrency);
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    results.push(...(await Promise.all(batch.map(fn))));
  }
  return results;
}
