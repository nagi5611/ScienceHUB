/**
 * クラウドストレージごみ箱（ソフトデリート・復元・自動パージ）
 */

import { getFiles } from "../r2";
import type { Env } from "../types";
import { createId, now, type SessionUser } from "../types";
import {
  TRASH_QUOTA_BYTES,
  TRASH_RETENTION_MS,
  FOLDER_META_NAME,
} from "./constants";
import {
  buildAutoRenameName,
  buildLogicalPath,
  dirListPrefix,
  fileMetaKey,
  folderMetaKey,
  parseLogicalPath,
  rootLogicalPath,
  sanitizeFilename,
  toR2Key,
  trashR2Prefix,
  type ParsedStoragePath,
} from "./keys";
import { getFileMeta } from "./meta";
import { authorizeStoragePath } from "./permissions";
import type { StorageAction } from "./meta";
import { subtractUsedBytes } from "./quota";
import { resolveRootForPath } from "./roots";
import { listExistingFilenames } from "./upload";

export interface StorageTrashItem {
  id: string;
  itemType: "file" | "folder";
  originalLogicalPath: string;
  originalName: string;
  sizeBytes: number;
  deletedBy: string;
  deletedAt: number;
  expiresAt: number;
  daysRemaining: number;
}

interface TrashItemRow {
  id: string;
  root_id: string;
  item_type: "file" | "folder";
  original_logical_path: string;
  original_name: string;
  trash_r2_prefix: string;
  size_bytes: number;
  deleted_by: string;
  deleted_at: number;
  expires_at: number;
}

function rowToTrashItem(row: TrashItemRow): StorageTrashItem {
  const ts = now();
  const daysRemaining = Math.max(
    0,
    Math.ceil((row.expires_at - ts) / (24 * 60 * 60 * 1000))
  );
  return {
    id: row.id,
    itemType: row.item_type,
    originalLogicalPath: row.original_logical_path,
    originalName: row.original_name,
    sizeBytes: row.size_bytes,
    deletedBy: row.deleted_by,
    deletedAt: row.deleted_at,
    expiresAt: row.expires_at,
    daysRemaining,
  };
}

/** パス配下のストレージ使用量を計算 */
async function computeStoragePathSize(
  env: Env,
  parsed: ParsedStoragePath,
  isDirectory: boolean
): Promise<number> {
  const bucket = getFiles(env);
  let totalBytes = 0;

  if (!isDirectory) {
    const meta = await getFileMeta(
      env,
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath
    );
    return meta?.sizeBytes ?? 0;
  }

  const prefix = dirListPrefix(
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath
  );
  const rootListPrefix = dirListPrefix(parsed.rootType, parsed.rootKey, "");
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix, cursor });
    for (const obj of listed.objects) {
      const rel = obj.key.slice(rootListPrefix.length);
      if (!rel.endsWith(".meta") && rel !== FOLDER_META_NAME && !rel.endsWith("/")) {
        const meta = await getFileMeta(env, parsed.rootType, parsed.rootKey, rel);
        totalBytes += meta?.sizeBytes ?? obj.size;
      }
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  return totalBytes;
}

/** R2 プレフィックス配下を別プレフィックスへ移動 */
async function moveR2Prefix(
  bucket: R2Bucket,
  fromPrefix: string,
  toPrefix: string
): Promise<void> {
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix: fromPrefix, cursor });
    for (const obj of listed.objects) {
      const suffix = obj.key.slice(fromPrefix.length);
      const destKey = `${toPrefix}${suffix}`;
      const got = await bucket.get(obj.key);
      if (!got) continue;
      await bucket.put(destKey, got.body, { httpMetadata: got.httpMetadata });
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  cursor = undefined;
  do {
    const listed = await bucket.list({ prefix: fromPrefix, cursor });
    for (const obj of listed.objects) {
      await bucket.delete(obj.key);
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);
}

/** R2 プレフィックス配下を完全削除 */
async function deleteR2Prefix(bucket: R2Bucket, prefix: string): Promise<void> {
  let cursor: string | undefined;
  do {
    const listed = await bucket.list({ prefix, cursor });
    for (const obj of listed.objects) {
      await bucket.delete(obj.key);
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);
}

/** ごみ箱アイテムを完全削除し使用量を減算 */
async function purgeTrashItemRow(
  env: Env,
  db: D1Database,
  row: TrashItemRow
): Promise<void> {
  const bucket = getFiles(env);
  await deleteR2Prefix(bucket, row.trash_r2_prefix);
  await db
    .prepare("DELETE FROM storage_trash_items WHERE id = ?")
    .bind(row.id)
    .run();

  if (row.size_bytes > 0) {
    await subtractUsedBytes(db, row.root_id, row.size_bytes);
  }
}

/** 期限切れ・容量超過のごみ箱アイテムを古い順に削除 */
export async function enforceTrashLimits(
  env: Env,
  db: D1Database,
  rootId: string
): Promise<void> {
  const ts = now();
  const rows = await db
    .prepare(
      `SELECT * FROM storage_trash_items
       WHERE root_id = ?
       ORDER BY deleted_at ASC`
    )
    .bind(rootId)
    .all<TrashItemRow>();

  const items = rows.results ?? [];
  let totalBytes = items.reduce((sum, row) => sum + row.size_bytes, 0);

  for (const row of items) {
    const expired = row.expires_at <= ts;
    const overQuota = totalBytes > TRASH_QUOTA_BYTES;
    if (!expired && !overQuota) break;

    await purgeTrashItemRow(env, db, row);
    totalBytes -= row.size_bytes;
  }
}

/** ファイルまたはフォルダをごみ箱へ移動 */
export async function moveStoragePathToTrash(
  env: Env,
  db: D1Database,
  user: SessionUser,
  parsed: ParsedStoragePath,
  isDirectory: boolean
): Promise<{ trashId: string; sizeBytes: number }> {
  const root = await resolveRootForPath(db, parsed.rootType, parsed.rootKey);
  if (!root) throw new Error("ストレージルートが見つかりません");

  const sizeBytes = await computeStoragePathSize(env, parsed, isDirectory);
  const trashId = createId("strash");
  const trashPrefix = trashR2Prefix(root.id, trashId);
  const bucket = getFiles(env);

  if (!isDirectory) {
    const srcKey = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
    const destKey = `${trashPrefix}${parsed.relativePath}`;
    const obj = await bucket.get(srcKey);
    if (!obj) throw new Error("ファイルが見つかりません");

    await bucket.put(destKey, obj.body, { httpMetadata: obj.httpMetadata });
    await bucket.delete(srcKey);

    const srcMetaKey = fileMetaKey(
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath
    );
    const metaObj = await bucket.get(srcMetaKey);
    if (metaObj) {
      await bucket.put(`${destKey}.meta`, metaObj.body, {
        httpMetadata: metaObj.httpMetadata,
      });
      await bucket.delete(srcMetaKey);
    }
  } else {
    const srcPrefix = dirListPrefix(
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath
    );
    const destPrefix = `${trashPrefix}${parsed.relativePath ? `${parsed.relativePath}/` : ""}`;
    await moveR2Prefix(bucket, srcPrefix, destPrefix);
  }

  const originalLogicalPath = buildLogicalPath(
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath
  );
  const originalName =
    parsed.relativePath.split("/").pop() ?? parsed.rootKey;
  const deletedAt = now();

  await db
    .prepare(
      `INSERT INTO storage_trash_items (
         id, root_id, item_type, original_logical_path, original_name,
         trash_r2_prefix, size_bytes, deleted_by, deleted_at, expires_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      trashId,
      root.id,
      isDirectory ? "folder" : "file",
      originalLogicalPath,
      originalName,
      trashPrefix,
      sizeBytes,
      user.id,
      deletedAt,
      deletedAt + TRASH_RETENTION_MS
    )
    .run();

  await enforceTrashLimits(env, db, root.id);

  return { trashId, sizeBytes };
}

/** 認証付きでごみ箱へ移動 */
export async function moveToTrashWithAuth(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  isDirectory: boolean
): Promise<{ trashId: string; trashed: true }> {
  const auth = await authorizeStoragePath(
    env,
    db,
    user,
    logicalPath,
    "delete",
    isDirectory
  );
  if (typeof auth === "string") throw new Error(auth);

  const result = await moveStoragePathToTrash(
    env,
    db,
    user,
    auth.parsed,
    isDirectory
  );
  return { trashId: result.trashId, trashed: true };
}

/** ルートのごみ箱一覧 */
export async function listTrashForRoot(
  env: Env,
  db: D1Database,
  rootLogical: string
): Promise<{
  rootPath: string;
  items: StorageTrashItem[];
  totalBytes: number;
  quotaBytes: number;
}> {
  const parsed = parseLogicalPath(rootLogical);
  if (!parsed || parsed.relativePath) {
    throw new Error("ルートパスを指定してください");
  }

  const root = await resolveRootForPath(db, parsed.rootType, parsed.rootKey);
  if (!root) throw new Error("ストレージルートが見つかりません");

  await enforceTrashLimits(env, db, root.id);

  const rows = await db
    .prepare(
      `SELECT * FROM storage_trash_items
       WHERE root_id = ?
       ORDER BY deleted_at DESC`
    )
    .bind(root.id)
    .all<TrashItemRow>();

  const items = (rows.results ?? []).map(rowToTrashItem);
  const totalBytes = items.reduce((sum, item) => sum + item.sizeBytes, 0);

  return {
    rootPath: rootLogicalPath(parsed.rootType, parsed.rootKey),
    items,
    totalBytes,
    quotaBytes: TRASH_QUOTA_BYTES,
  };
}

async function resolveUniqueFolderName(
  env: Env,
  rootType: ParsedStoragePath["rootType"],
  rootKey: string,
  parentDir: string,
  folderName: string
): Promise<string> {
  const bucket = getFiles(env);
  const safe = sanitizeFilename(folderName);
  let candidate = safe;
  let index = 1;

  while (index < 10000) {
    const relative = parentDir ? `${parentDir}/${candidate}` : candidate;
    const metaKey = folderMetaKey(rootType, rootKey, relative);
    const exists = await bucket.head(metaKey);
    if (!exists) return candidate;
    candidate = buildAutoRenameName(safe, index);
    index++;
  }

  throw new Error("同名フォルダが多すぎます");
}

async function pathExists(
  env: Env,
  parsed: ParsedStoragePath,
  isDirectory: boolean
): Promise<boolean> {
  const bucket = getFiles(env);
  if (isDirectory) {
    const metaKey = folderMetaKey(
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath
    );
    const head = await bucket.head(metaKey);
    return !!head;
  }

  const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const head = await bucket.head(r2Key);
  return !!head;
}

/** ごみ箱アイテムを復元 */
export async function restoreTrashItem(
  env: Env,
  db: D1Database,
  trashId: string
): Promise<{ path: string; renamed: boolean }> {
  const row = await db
    .prepare("SELECT * FROM storage_trash_items WHERE id = ?")
    .bind(trashId)
    .first<TrashItemRow>();
  if (!row) throw new Error("ごみ箱のアイテムが見つかりません");

  const parsed = parseLogicalPath(row.original_logical_path);
  if (!parsed) throw new Error("元のパスが不正です");

  const bucket = getFiles(env);
  const parts = parsed.relativePath.split("/");
  const originalName = parts.pop() ?? "";
  const parentDir = parts.join("/");

  let targetRelative = parsed.relativePath;
  let renamed = false;

  if (row.item_type === "file") {
    const existing = await listExistingFilenames(
      env,
      parsed.rootType,
      parsed.rootKey,
      parentDir
    );
    let resolvedName = originalName;
    if (existing.has(resolvedName)) {
      let index = 1;
      while (index < 10000) {
        const candidate = buildAutoRenameName(originalName, index);
        if (!existing.has(candidate)) {
          resolvedName = candidate;
          renamed = true;
          break;
        }
        index++;
      }
      if (!renamed) throw new Error("復元先に同名ファイルが多すぎます");
    }
    targetRelative = parentDir ? `${parentDir}/${resolvedName}` : resolvedName;
  } else {
    const exists = await pathExists(env, parsed, true);
    if (exists) {
      const resolvedName = await resolveUniqueFolderName(
        env,
        parsed.rootType,
        parsed.rootKey,
        parentDir,
        originalName
      );
      targetRelative = parentDir
        ? `${parentDir}/${resolvedName}`
        : resolvedName;
      renamed = true;
    }
  }

  if (row.item_type === "file") {
    const srcKey = `${row.trash_r2_prefix}${parsed.relativePath}`;
    const destKey = toR2Key(parsed.rootType, parsed.rootKey, targetRelative);
    const obj = await bucket.get(srcKey);
    if (!obj) throw new Error("ごみ箱内のファイルが見つかりません");

    await bucket.put(destKey, obj.body, { httpMetadata: obj.httpMetadata });
    await bucket.delete(srcKey);

    const srcMetaKey = `${srcKey}.meta`;
    const metaObj = await bucket.get(srcMetaKey);
    if (metaObj) {
      await bucket.put(
        fileMetaKey(parsed.rootType, parsed.rootKey, targetRelative),
        metaObj.body,
        { httpMetadata: metaObj.httpMetadata }
      );
      await bucket.delete(srcMetaKey);
    }
  } else {
    const srcPrefix = `${row.trash_r2_prefix}${parsed.relativePath}/`;
    const destDirPrefix = dirListPrefix(
      parsed.rootType,
      parsed.rootKey,
      targetRelative
    );
    await moveR2Prefix(bucket, srcPrefix, destDirPrefix);
  }

  await db
    .prepare("DELETE FROM storage_trash_items WHERE id = ?")
    .bind(trashId)
    .run();

  const restoredPath = buildLogicalPath(
    parsed.rootType,
    parsed.rootKey,
    targetRelative
  );
  return { path: restoredPath, renamed };
}

/** ごみ箱アイテムを完全削除 */
export async function purgeTrashItemById(
  env: Env,
  db: D1Database,
  trashId: string
): Promise<void> {
  const row = await db
    .prepare("SELECT * FROM storage_trash_items WHERE id = ?")
    .bind(trashId)
    .first<TrashItemRow>();
  if (!row) throw new Error("ごみ箱のアイテムが見つかりません");

  await purgeTrashItemRow(env, db, row);
}

/** ルートのごみ箱を空にする */
export async function emptyTrashForRoot(
  env: Env,
  db: D1Database,
  rootLogical: string
): Promise<{ purgedCount: number; freedBytes: number }> {
  const parsed = parseLogicalPath(rootLogical);
  if (!parsed || parsed.relativePath) {
    throw new Error("ルートパスを指定してください");
  }

  const root = await resolveRootForPath(db, parsed.rootType, parsed.rootKey);
  if (!root) throw new Error("ストレージルートが見つかりません");

  const rows = await db
    .prepare("SELECT * FROM storage_trash_items WHERE root_id = ?")
    .bind(root.id)
    .all<TrashItemRow>();

  const items = rows.results ?? [];
  let freedBytes = 0;

  for (const row of items) {
    freedBytes += row.size_bytes;
    await purgeTrashItemRow(env, db, row);
  }

  return { purgedCount: items.length, freedBytes };
}

/** ごみ箱操作のルートアクセス権を検証 */
export async function authorizeTrashRootAccess(
  env: Env,
  db: D1Database,
  user: SessionUser,
  rootLogical: string,
  action: StorageAction = "read"
): Promise<ParsedStoragePath | string> {
  const parsed = parseLogicalPath(rootLogical);
  if (!parsed || parsed.relativePath) {
    return "ルートパスを指定してください";
  }

  const logical = rootLogicalPath(parsed.rootType, parsed.rootKey);
  const auth = await authorizeStoragePath(
    env,
    db,
    user,
    logical,
    action,
    true
  );
  if (typeof auth === "string") return auth;
  return parsed;
}

/** ごみ箱アイテムのルートアクセス権を検証 */
export async function authorizeTrashItemAccess(
  env: Env,
  db: D1Database,
  user: SessionUser,
  trashId: string,
  action: StorageAction
): Promise<TrashItemRow | string> {
  const row = await db
    .prepare("SELECT * FROM storage_trash_items WHERE id = ?")
    .bind(trashId)
    .first<TrashItemRow>();
  if (!row) return "ごみ箱のアイテムが見つかりません";

  const parsed = parseLogicalPath(row.original_logical_path);
  if (!parsed) return "元のパスが不正です";

  const rootLogical = rootLogicalPath(parsed.rootType, parsed.rootKey);
  const allowed = await authorizeTrashRootAccess(
    env,
    db,
    user,
    rootLogical,
    action
  );
  if (typeof allowed === "string") return allowed;

  return row;
}
