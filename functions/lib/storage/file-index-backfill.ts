/**
 * ストレージファイルインデックスの R2 → D1 バックフィル
 */

import { getFiles } from "../r2";
import type { Env } from "../types";
import { FOLDER_META_NAME } from "./constants";
import {
  buildFileIndexEntry,
  buildFileIndexEntryFromR2,
  getIndexBackfillRow,
  upsertFileIndexBatch,
  upsertIndexBackfillRow,
  type IndexBackfillRow,
} from "./file-index";
import { rootPrefix, type StorageRootType } from "./keys";
import { getFileMeta } from "./meta";
import type { StorageRootRow } from "./quota";

const CHUNK_SIZE = 500;

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

function uploadedMs(uploaded: Date | null | undefined): number {
  if (!uploaded) return Date.now();
  const ms = new Date(uploaded).getTime();
  return Number.isFinite(ms) ? ms : Date.now();
}

export interface BackfillRootContext {
  rootId: string;
  rootType: StorageRootType;
  rootKey: string;
}

/** storage_roots 行からバックフィル用コンテキストを解決 */
export async function resolveBackfillRootContext(
  db: D1Database,
  rootId: string
): Promise<BackfillRootContext | null> {
  const root = await db
    .prepare("SELECT * FROM storage_roots WHERE id = ?")
    .bind(rootId)
    .first<StorageRootRow>();
  if (!root) return null;

  const keyRow = await db
    .prepare(
      root.root_type === "user"
        ? `SELECT u.username AS key FROM users u WHERE u.id = ?`
        : `SELECT hg.slug AS key FROM hub_groups hg WHERE hg.id = ?`
    )
    .bind(root.root_type === "user" ? root.user_id : root.group_id)
    .first<{ key: string }>();

  if (!keyRow) return null;

  return {
    rootId,
    rootType: root.root_type,
    rootKey: keyRow.key,
  };
}

export interface BackfillChunkResult {
  rootId: string;
  status: IndexBackfillRow["status"];
  filesIndexed: number;
  processedThisChunk: number;
  complete: boolean;
  cursor: string | null;
  error: string | null;
}

/** 1 ルートの次のバックフィルチャンクを処理 */
export async function backfillStorageIndexChunk(
  env: Env,
  db: D1Database,
  rootId: string
): Promise<BackfillChunkResult> {
  const ctx = await resolveBackfillRootContext(db, rootId);
  if (!ctx) {
    return {
      rootId,
      status: "failed",
      filesIndexed: 0,
      processedThisChunk: 0,
      complete: false,
      cursor: null,
      error: "ストレージルートが見つかりません",
    };
  }

  const existing = await getIndexBackfillRow(db, rootId);
  if (existing?.status === "complete") {
    return {
      rootId,
      status: "complete",
      filesIndexed: existing.files_indexed,
      processedThisChunk: 0,
      complete: true,
      cursor: null,
      error: null,
    };
  }

  const cursor = existing?.r2_cursor ?? undefined;
  let filesIndexed = existing?.files_indexed ?? 0;

  await upsertIndexBackfillRow(db, rootId, {
    status: "running",
    r2_cursor: cursor ?? null,
    files_indexed: filesIndexed,
    last_error: null,
  });

  try {
    const bucket = getFiles(env);
    const prefix = rootPrefix(ctx.rootType, ctx.rootKey);
    const listed = await bucket.list({ prefix, cursor, limit: CHUNK_SIZE });

    const entries = [];
    for (const obj of listed.objects) {
      const keySuffix = obj.key.slice(prefix.length);
      if (!isFileObjectKey(keySuffix)) continue;

      const relativePath = keySuffix.replace(/^\/+/, "");
      if (!relativePath) continue;

      const meta = await getFileMeta(
        env,
        ctx.rootType,
        ctx.rootKey,
        relativePath
      );

      if (meta) {
        entries.push(
          buildFileIndexEntry(
            ctx.rootType,
            ctx.rootKey,
            relativePath,
            meta
          )
        );
      } else {
        entries.push(
          buildFileIndexEntryFromR2(
            ctx.rootType,
            ctx.rootKey,
            relativePath,
            obj.size,
            uploadedMs(obj.uploaded)
          )
        );
      }
    }

    await upsertFileIndexBatch(db, ctx.rootId, entries);
    filesIndexed += entries.length;

    const complete = !listed.truncated;
    const nextCursor = listed.truncated ? listed.cursor : null;

    await upsertIndexBackfillRow(db, rootId, {
      status: complete ? "complete" : "running",
      r2_cursor: nextCursor,
      files_indexed: filesIndexed,
      last_error: null,
    });

    return {
      rootId,
      status: complete ? "complete" : "running",
      filesIndexed,
      processedThisChunk: entries.length,
      complete,
      cursor: nextCursor,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "バックフィルに失敗しました";
    await upsertIndexBackfillRow(db, rootId, {
      status: "failed",
      files_indexed: filesIndexed,
      last_error: message,
    });
    return {
      rootId,
      status: "failed",
      filesIndexed,
      processedThisChunk: 0,
      complete: false,
      cursor: existing?.r2_cursor ?? null,
      error: message,
    };
  }
}

/** 指定プレフィックス配下のファイルをインデックスに再登録 */
export async function reindexFilesUnderPrefix(
  env: Env,
  db: D1Database,
  ctx: BackfillRootContext,
  relativePrefix: string
): Promise<number> {
  const bucket = getFiles(env);
  const basePrefix = rootPrefix(ctx.rootType, ctx.rootKey);
  const rel = relativePrefix.replace(/^\/+|\/+$/g, "");
  const listPrefix = rel ? `${basePrefix}${rel}/` : basePrefix;

  let cursor: string | undefined;
  let indexed = 0;

  do {
    const listed = await bucket.list({ prefix: listPrefix, cursor, limit: 500 });
    const entries = [];

    for (const obj of listed.objects) {
      const keySuffix = obj.key.slice(basePrefix.length);
      if (!isFileObjectKey(keySuffix)) continue;
      const relativePath = keySuffix.replace(/^\/+/, "");
      if (!relativePath) continue;
      if (rel && !relativePath.startsWith(`${rel}/`) && relativePath !== rel) {
        continue;
      }

      const meta = await getFileMeta(
        env,
        ctx.rootType,
        ctx.rootKey,
        relativePath
      );
      if (meta) {
        entries.push(
          buildFileIndexEntry(ctx.rootType, ctx.rootKey, relativePath, meta)
        );
      } else {
        entries.push(
          buildFileIndexEntryFromR2(
            ctx.rootType,
            ctx.rootKey,
            relativePath,
            obj.size,
            uploadedMs(obj.uploaded)
          )
        );
      }
    }

    await upsertFileIndexBatch(db, ctx.rootId, entries);
    indexed += entries.length;
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  return indexed;
}

/** 未完了ルートの ID 一覧 */
export async function listPendingBackfillRootIds(
  db: D1Database
): Promise<string[]> {
  const roots = await db
    .prepare(`SELECT id FROM storage_roots ORDER BY created_at ASC`)
    .all<{ id: string }>();

  const pending: string[] = [];
  for (const row of roots.results ?? []) {
    const backfill = await getIndexBackfillRow(db, row.id);
    if (!backfill || backfill.status !== "complete") {
      pending.push(row.id);
    }
  }
  return pending;
}

/** 1 回のスケジュール実行で処理するバックフィルチャンク数の上限 */
export const DEFAULT_BACKFILL_CHUNKS_PER_RUN = 10;

export interface ProcessPendingBackfillResult {
  chunksProcessed: number;
  results: BackfillChunkResult[];
  pendingRemaining: number;
  stoppedOnError: boolean;
}

/** 未完了ルートのバックフィルをチャンク単位で進める（cron / predeploy キック用） */
export async function processPendingStorageIndexBackfillChunks(
  env: Env,
  db: D1Database,
  options: { maxChunksPerRun?: number } = {}
): Promise<ProcessPendingBackfillResult> {
  const maxChunksPerRun = options.maxChunksPerRun ?? DEFAULT_BACKFILL_CHUNKS_PER_RUN;
  const results: BackfillChunkResult[] = [];
  let chunksProcessed = 0;
  let stoppedOnError = false;

  while (chunksProcessed < maxChunksPerRun) {
    const pending = await listPendingBackfillRootIds(db);
    if (!pending.length) break;

    const rootId = pending[0];
    const result = await backfillStorageIndexChunk(env, db, rootId);
    results.push(result);
    chunksProcessed += 1;

    if (result.error) {
      stoppedOnError = true;
      break;
    }
  }

  const pendingRemaining = (await listPendingBackfillRootIds(db)).length;

  return {
    chunksProcessed,
    results,
    pendingRemaining,
    stoppedOnError,
  };
}
