/**
 * クラウドストレージ D1 ファイルインデックス
 */

import { now } from "../types";
import {
  buildLogicalPath,
  toR2Key,
  type StorageRootType,
} from "./keys";
import type { FileMetaDocument } from "./meta";
import type { StorageSortField, StorageSortOrder } from "./list";

export type FileIndexSearchScope = "folder" | "subtree" | "root";

export interface FileIndexRow {
  root_id: string;
  relative_path: string;
  name: string;
  name_lower: string;
  parent_path: string;
  size_bytes: number;
  r2_key: string;
  created_by: string | null;
  updated_by: string | null;
  created_at: number;
  updated_at: number;
  indexed_at: number;
}

export interface FileIndexEntry {
  relativePath: string;
  name: string;
  parentPath: string;
  sizeBytes: number;
  r2Key: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface IndexBackfillRow {
  root_id: string;
  status: "pending" | "running" | "complete" | "failed";
  r2_cursor: string | null;
  files_indexed: number;
  last_error: string | null;
  updated_at: number;
}

function parentPathFromRelative(relativePath: string): string {
  const parts = relativePath.split("/").filter(Boolean);
  if (parts.length <= 1) return "";
  return parts.slice(0, -1).join("/");
}

function fileNameFromRelative(relativePath: string): string {
  const parts = relativePath.split("/").filter(Boolean);
  return parts.pop() ?? relativePath;
}

/** .meta からインデックス行を構築 */
export function buildFileIndexEntry(
  rootType: StorageRootType,
  rootKey: string,
  relativePath: string,
  meta: FileMetaDocument
): FileIndexEntry {
  const rel = relativePath.replace(/^\/+|\/+$/g, "");
  const name = fileNameFromRelative(rel);
  return {
    relativePath: rel,
    name,
    parentPath: parentPathFromRelative(rel),
    sizeBytes: meta.sizeBytes,
    r2Key: toR2Key(rootType, rootKey, rel),
    createdBy: meta.createdBy,
    updatedBy: meta.updatedBy,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
  };
}

/** R2 list の結果からインデックス行を構築（.meta なし時のフォールバック） */
export function buildFileIndexEntryFromR2(
  rootType: StorageRootType,
  rootKey: string,
  relativePath: string,
  sizeBytes: number,
  updatedAt: number,
  createdBy: string | null = null
): FileIndexEntry {
  const rel = relativePath.replace(/^\/+|\/+$/g, "");
  const name = fileNameFromRelative(rel);
  const ts = updatedAt;
  return {
    relativePath: rel,
    name,
    parentPath: parentPathFromRelative(rel),
    sizeBytes,
    r2Key: toR2Key(rootType, rootKey, rel),
    createdBy,
    updatedBy: createdBy,
    createdAt: ts,
    updatedAt: ts,
  };
}

/** インデックス行を upsert */
export async function upsertFileIndex(
  db: D1Database,
  rootId: string,
  entry: FileIndexEntry
): Promise<void> {
  const indexedAt = now();
  await db
    .prepare(
      `INSERT INTO storage_file_index (
         root_id, relative_path, name, name_lower, parent_path,
         size_bytes, r2_key, created_by, updated_by, created_at, updated_at, indexed_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (root_id, relative_path) DO UPDATE SET
         name = excluded.name,
         name_lower = excluded.name_lower,
         parent_path = excluded.parent_path,
         size_bytes = excluded.size_bytes,
         r2_key = excluded.r2_key,
         created_by = excluded.created_by,
         updated_by = excluded.updated_by,
         created_at = excluded.created_at,
         updated_at = excluded.updated_at,
         indexed_at = excluded.indexed_at`
    )
    .bind(
      rootId,
      entry.relativePath,
      entry.name,
      entry.name.toLowerCase(),
      entry.parentPath,
      entry.sizeBytes,
      entry.r2Key,
      entry.createdBy,
      entry.updatedBy,
      entry.createdAt,
      entry.updatedAt,
      indexedAt
    )
    .run();
}

/** 複数行をバッチ upsert */
export async function upsertFileIndexBatch(
  db: D1Database,
  rootId: string,
  entries: FileIndexEntry[]
): Promise<void> {
  if (!entries.length) return;
  const indexedAt = now();
  const stmt = db.prepare(
    `INSERT INTO storage_file_index (
       root_id, relative_path, name, name_lower, parent_path,
       size_bytes, r2_key, created_by, updated_by, created_at, updated_at, indexed_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (root_id, relative_path) DO UPDATE SET
       name = excluded.name,
       name_lower = excluded.name_lower,
       parent_path = excluded.parent_path,
       size_bytes = excluded.size_bytes,
       r2_key = excluded.r2_key,
       created_by = excluded.created_by,
       updated_by = excluded.updated_by,
       created_at = excluded.created_at,
       updated_at = excluded.updated_at,
       indexed_at = excluded.indexed_at`
  );

  const batch: D1PreparedStatement[] = entries.map((entry) =>
    stmt.bind(
      rootId,
      entry.relativePath,
      entry.name,
      entry.name.toLowerCase(),
      entry.parentPath,
      entry.sizeBytes,
      entry.r2Key,
      entry.createdBy,
      entry.updatedBy,
      entry.createdAt,
      entry.updatedAt,
      indexedAt
    )
  );

  await db.batch(batch);
}

/** 1 ファイルをインデックスから削除 */
export async function deleteFileIndex(
  db: D1Database,
  rootId: string,
  relativePath: string
): Promise<void> {
  const rel = relativePath.replace(/^\/+|\/+$/g, "");
  await db
    .prepare(
      `DELETE FROM storage_file_index WHERE root_id = ? AND relative_path = ?`
    )
    .bind(rootId, rel)
    .run();
}

/** プレフィックス配下のファイルをインデックスから削除 */
export async function deleteFileIndexByPrefix(
  db: D1Database,
  rootId: string,
  relativePrefix: string
): Promise<void> {
  const prefix = relativePrefix.replace(/^\/+|\/+$/g, "");
  if (!prefix) {
    await db
      .prepare(`DELETE FROM storage_file_index WHERE root_id = ?`)
      .bind(rootId)
      .run();
    return;
  }

  await db
    .prepare(
      `DELETE FROM storage_file_index
       WHERE root_id = ? AND (relative_path = ? OR relative_path LIKE ?)`
    )
    .bind(rootId, prefix, `${prefix}/%`)
    .run();
}

function remapRelativePath(
  relativePath: string,
  oldPrefix: string,
  newPrefix: string
): string {
  const oldP = oldPrefix.replace(/^\/+|\/+$/g, "");
  const newP = newPrefix.replace(/^\/+|\/+$/g, "");
  if (!oldP) return relativePath;
  if (relativePath === oldP) return newP;
  if (relativePath.startsWith(`${oldP}/`)) {
    return `${newP}${relativePath.slice(oldP.length)}`;
  }
  return relativePath;
}

function remapParentPath(
  parentPath: string,
  oldPrefix: string,
  newPrefix: string
): string {
  const oldP = oldPrefix.replace(/^\/+|\/+$/g, "");
  const newP = newPrefix.replace(/^\/+|\/+$/g, "");
  if (!oldP) return parentPath;
  if (!parentPath) return parentPath;
  if (parentPath === oldP) return newP;
  if (parentPath.startsWith(`${oldP}/`)) {
    return `${newP}${parentPath.slice(oldP.length)}`;
  }
  return parentPath;
}

/** フォルダ rename/move 時にインデックスのパスを一括更新 */
export async function moveFileIndexPrefix(
  db: D1Database,
  rootId: string,
  rootType: StorageRootType,
  rootKey: string,
  oldPrefix: string,
  newPrefix: string
): Promise<void> {
  const oldP = oldPrefix.replace(/^\/+|\/+$/g, "");
  const pattern = oldP ? `${oldP}/%` : "%";

  const rows = await db
    .prepare(
      `SELECT * FROM storage_file_index
       WHERE root_id = ? AND relative_path LIKE ?`
    )
    .bind(rootId, pattern)
    .all<FileIndexRow>();

  const updates: FileIndexEntry[] = [];
  for (const row of rows.results ?? []) {
    const newRelative = remapRelativePath(row.relative_path, oldP, newPrefix);
    updates.push({
      relativePath: newRelative,
      name: fileNameFromRelative(newRelative),
      parentPath: remapParentPath(row.parent_path, oldP, newPrefix),
      sizeBytes: row.size_bytes,
      r2Key: toR2Key(rootType, rootKey, newRelative),
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  if (!updates.length) return;

  const deleteStmts = (rows.results ?? []).map((row) =>
    db
      .prepare(
        `DELETE FROM storage_file_index WHERE root_id = ? AND relative_path = ?`
      )
      .bind(rootId, row.relative_path)
  );

  await db.batch(deleteStmts);
  await upsertFileIndexBatch(db, rootId, updates);
}

/** ルートのバックフィル状態を取得 */
export async function getIndexBackfillRow(
  db: D1Database,
  rootId: string
): Promise<IndexBackfillRow | null> {
  return db
    .prepare(`SELECT * FROM storage_index_backfill WHERE root_id = ?`)
    .bind(rootId)
    .first<IndexBackfillRow>();
}

/** ルートのインデックスが読み取り可能か（バックフィル完了時のみ D1 インデックスを使う） */
export async function isRootIndexReady(
  db: D1Database,
  rootId: string
): Promise<boolean> {
  const backfill = await getIndexBackfillRow(db, rootId);
  return backfill?.status === "complete";
}

export interface IndexedRecentFile {
  name: string;
  path: string;
  type: "file";
  sizeBytes: number;
  updatedAt: number;
  location: string;
  createdAt: number | null;
  createdBy: string | null;
  updatedBy: string | null;
}

function parentLocation(parentPath: string): string {
  if (!parentPath) return "/";
  return parentPath;
}

function rowToRecentFile(
  row: FileIndexRow,
  rootType: StorageRootType,
  rootKey: string
): IndexedRecentFile {
  return {
    name: row.name,
    path: buildLogicalPath(rootType, rootKey, row.relative_path),
    type: "file",
    sizeBytes: row.size_bytes,
    updatedAt: row.updated_at,
    location: parentLocation(row.parent_path),
    createdAt: row.created_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
  };
}

/** 1 ルート内の最近更新ファイル */
export async function queryRecentFilesInRoot(
  db: D1Database,
  rootId: string,
  rootType: StorageRootType,
  rootKey: string,
  options: { updatedFrom: number; limit: number }
): Promise<IndexedRecentFile[]> {
  const rows = await db
    .prepare(
      `SELECT * FROM storage_file_index
       WHERE root_id = ? AND updated_at >= ?
       ORDER BY updated_at DESC
       LIMIT ?`
    )
    .bind(rootId, options.updatedFrom, options.limit)
    .all<FileIndexRow>();

  return (rows.results ?? []).map((row) =>
    rowToRecentFile(row, rootType, rootKey)
  );
}

/** 複数ルート横断の最近更新ファイル */
export async function queryRecentFilesAcrossRoots(
  db: D1Database,
  roots: Array<{ id: string; type: StorageRootType; key: string }>,
  options: { updatedFrom: number; limit: number }
): Promise<IndexedRecentFile[]> {
  if (!roots.length) return [];

  const placeholders = roots.map(() => "?").join(", ");
  const rows = await db
    .prepare(
      `SELECT * FROM storage_file_index
       WHERE root_id IN (${placeholders}) AND updated_at >= ?
       ORDER BY updated_at DESC
       LIMIT ?`
    )
    .bind(...roots.map((r) => r.id), options.updatedFrom, options.limit)
    .all<FileIndexRow>();

  const rootMap = new Map(roots.map((r) => [r.id, r]));
  return (rows.results ?? []).map((row) => {
    const root = rootMap.get(row.root_id);
    return rowToRecentFile(
      row,
      root?.type ?? "user",
      root?.key ?? ""
    );
  });
}

function sortSqlColumn(field: StorageSortField): string {
  switch (field) {
    case "name":
      return "name_lower";
    case "updatedAt":
      return "updated_at";
    case "createdAt":
      return "created_at";
    case "createdBy":
      return "created_by";
    case "updatedBy":
      return "updated_by";
    case "size":
      return "size_bytes";
    default:
      return "name_lower";
  }
}

/** インデックスからファイル検索 */
export async function querySearchFiles(
  db: D1Database,
  rootId: string,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string,
  options: {
    query: string;
    scope: FileIndexSearchScope;
    updatedFrom: number | null;
    updatedTo: number | null;
    updatedBy?: string | null;
    createdBy?: string | null;
    sortField: StorageSortField;
    sortOrder: StorageSortOrder;
    offset: number;
    limit: number | undefined;
  }
): Promise<{ items: IndexedRecentFile[]; total: number }> {
  const conditions: string[] = ["root_id = ?"];
  const binds: Array<string | number> = [rootId];

  const dir = relativeDir.replace(/^\/+|\/+$/g, "");
  if (options.scope === "folder") {
    conditions.push("parent_path = ?");
    binds.push(dir);
  } else if (options.scope === "subtree" && dir) {
    conditions.push("(relative_path = ? OR relative_path LIKE ?)");
    binds.push(dir, `${dir}/%`);
  }

  const q = options.query.trim().toLowerCase();
  if (q) {
    conditions.push("name_lower LIKE ?");
    binds.push(`%${q}%`);
  }

  if (options.updatedFrom !== null) {
    conditions.push("updated_at >= ?");
    binds.push(options.updatedFrom);
  }
  if (options.updatedTo !== null) {
    conditions.push("updated_at <= ?");
    binds.push(options.updatedTo);
  }

  const updatedBy = options.updatedBy?.trim();
  if (updatedBy) {
    conditions.push("updated_by = ?");
    binds.push(updatedBy);
  }

  const createdBy = options.createdBy?.trim();
  if (createdBy) {
    conditions.push("created_by = ?");
    binds.push(createdBy);
  }

  const where = conditions.join(" AND ");
  const orderCol = sortSqlColumn(options.sortField);
  const orderDir = options.sortOrder === "desc" ? "DESC" : "ASC";

  const countRow = await db
    .prepare(`SELECT COUNT(*) AS c FROM storage_file_index WHERE ${where}`)
    .bind(...binds)
    .first<{ c: number }>();
  const total = countRow?.c ?? 0;

  let sql = `SELECT * FROM storage_file_index WHERE ${where} ORDER BY ${orderCol} ${orderDir}`;
  const queryBinds = [...binds];

  if (options.limit !== undefined) {
    sql += " LIMIT ? OFFSET ?";
    queryBinds.push(options.limit, options.offset);
  }

  const rows = await db.prepare(sql).bind(...queryBinds).all<FileIndexRow>();
  const items = (rows.results ?? []).map((row) =>
    rowToRecentFile(row, rootType, rootKey)
  );

  return { items, total };
}

/** 複数ルート横断で操作者（username）に一致するファイルを検索 */
export async function queryFilesByOperatorAcrossRoots(
  db: D1Database,
  roots: Array<{ id: string; type: StorageRootType; key: string }>,
  options: {
    username: string;
    field: "updated" | "created" | "either";
    updatedFrom: number | null;
    limit: number;
  }
): Promise<IndexedRecentFile[]> {
  const username = options.username.trim();
  if (!username || !roots.length) return [];

  const placeholders = roots.map(() => "?").join(", ");
  const conditions = [`root_id IN (${placeholders})`];
  const binds: Array<string | number> = roots.map((r) => r.id);

  if (options.field === "updated") {
    conditions.push("updated_by = ?");
    binds.push(username);
  } else if (options.field === "created") {
    conditions.push("created_by = ?");
    binds.push(username);
  } else {
    conditions.push("(updated_by = ? OR created_by = ?)");
    binds.push(username, username);
  }

  if (options.updatedFrom !== null) {
    conditions.push("updated_at >= ?");
    binds.push(options.updatedFrom);
  }

  const sql = `SELECT * FROM storage_file_index
    WHERE ${conditions.join(" AND ")}
    ORDER BY updated_at DESC
    LIMIT ?`;

  binds.push(options.limit);

  const rows = await db.prepare(sql).bind(...binds).all<FileIndexRow>();
  const rootMap = new Map(roots.map((r) => [r.id, r]));

  return (rows.results ?? []).map((row) => {
    const root = rootMap.get(row.root_id);
    return rowToRecentFile(
      row,
      root?.type ?? "user",
      root?.key ?? ""
    );
  });
}

/** バックフィル行を upsert */
export async function upsertIndexBackfillRow(
  db: D1Database,
  rootId: string,
  patch: Partial<
    Pick<
      IndexBackfillRow,
      "status" | "r2_cursor" | "files_indexed" | "last_error"
    >
  >
): Promise<void> {
  const existing = await getIndexBackfillRow(db, rootId);
  const ts = now();
  if (!existing) {
    await db
      .prepare(
        `INSERT INTO storage_index_backfill (
           root_id, status, r2_cursor, files_indexed, last_error, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        rootId,
        patch.status ?? "pending",
        patch.r2_cursor ?? null,
        patch.files_indexed ?? 0,
        patch.last_error ?? null,
        ts
      )
      .run();
    return;
  }

  await db
    .prepare(
      `UPDATE storage_index_backfill SET
         status = ?,
         r2_cursor = ?,
         files_indexed = ?,
         last_error = ?,
         updated_at = ?
       WHERE root_id = ?`
    )
    .bind(
      patch.status ?? existing.status,
      patch.r2_cursor !== undefined ? patch.r2_cursor : existing.r2_cursor,
      patch.files_indexed ?? existing.files_indexed,
      patch.last_error !== undefined ? patch.last_error : existing.last_error,
      ts,
      rootId
    )
    .run();
}
