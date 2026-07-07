/**
 * フォルダアイコン用プレビュー候補の収集
 */

import type { Env } from "../types";
import { buildLogicalPath, type StorageRootType } from "./keys";
import { getFileMeta } from "./meta";
import { listDirectoryEntries } from "./list";
import { classifyStorageMedia, type StorageMediaKind } from "./media-kind";

export interface FolderPreviewItem {
  name: string;
  path: string;
  kind: StorageMediaKind;
  updatedAt: number | null;
  sizeBytes: number | null;
}

export interface FolderPreviewResult {
  path: string;
  items: FolderPreviewItem[];
}

const DEFAULT_PREVIEW_LIMIT = 4;
const DEFAULT_MAX_DEPTH = 4;
const MAX_FOLDER_SCANS = 24;

interface ScanFolder {
  relativePath: string;
  depth: number;
}

/** フォルダ内の画像・動画を浅い深さ優先で収集 */
export async function listFolderPreviewItems(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string,
  options: { limit?: number; maxDepth?: number } = {}
): Promise<FolderPreviewResult> {
  const limit = Math.min(8, Math.max(1, options.limit ?? DEFAULT_PREVIEW_LIMIT));
  const maxDepth = Math.min(6, Math.max(0, options.maxDepth ?? DEFAULT_MAX_DEPTH));
  const logicalPath = buildLogicalPath(rootType, rootKey, relativeDir);
  const items: FolderPreviewItem[] = [];
  const queue: ScanFolder[] = [{ relativePath: relativeDir, depth: 0 }];
  let scans = 0;

  while (queue.length > 0 && items.length < limit && scans < MAX_FOLDER_SCANS) {
    const current = queue.shift()!;
    scans += 1;

    const entries = await listDirectoryEntries(env, rootType, rootKey, current.relativePath);
    const files = entries.filter((entry) => entry.type === "file");
    const folders = entries.filter((entry) => entry.type === "folder");

    for (const file of files) {
      const kind = classifyStorageMedia(file.name);
      if (!kind) continue;

      const fileMeta = await getFileMeta(env, rootType, rootKey, file.relativePath);
      items.push({
        name: file.name,
        path: buildLogicalPath(rootType, rootKey, file.relativePath),
        kind,
        updatedAt: fileMeta?.updatedAt ?? null,
        sizeBytes: fileMeta?.sizeBytes ?? file.objectSize,
      });

      if (items.length >= limit) break;
    }

    if (items.length >= limit || current.depth >= maxDepth) continue;

    for (const folder of folders) {
      queue.push({ relativePath: folder.relativePath, depth: current.depth + 1 });
    }
  }

  return { path: logicalPath, items };
}
