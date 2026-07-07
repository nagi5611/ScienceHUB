/**
 * ストレージディレクトリ一覧
 */

import { getFiles } from "../r2";
import type { Env } from "../types";
import { FOLDER_META_NAME } from "./constants";
import {
  buildLogicalPath,
  dirListPrefix,
  type StorageRootType,
} from "./keys";
import { getFileMeta, getFolderMeta } from "./meta";

export interface StorageListItem {
  name: string;
  path: string;
  type: "file" | "folder";
  sizeBytes: number | null;
  createdAt: number | null;
  createdBy: string | null;
  updatedAt: number | null;
  updatedBy: string | null;
}

export type StorageSortField =
  | "name"
  | "updatedAt"
  | "createdAt"
  | "createdBy"
  | "updatedBy"
  | "size";

export type StorageSortOrder = "asc" | "desc";

export const STORAGE_SORT_FIELDS: StorageSortField[] = [
  "name",
  "updatedAt",
  "createdAt",
  "createdBy",
  "updatedBy",
  "size",
];

export function parseStorageSortField(value: string | null): StorageSortField {
  if (value && STORAGE_SORT_FIELDS.includes(value as StorageSortField)) {
    return value as StorageSortField;
  }
  return "name";
}

export function parseStorageSortOrder(value: string | null): StorageSortOrder {
  return value === "desc" ? "desc" : "asc";
}

export interface StorageListResult {
  path: string;
  items: StorageListItem[];
  total: number;
  hasMore: boolean;
}

export interface ListDirectoryOptions {
  offset?: number;
  limit?: number;
  sortField?: StorageSortField;
  sortOrder?: StorageSortOrder;
}

interface DirectoryEntry {
  name: string;
  relativePath: string;
  type: "file" | "folder";
  objectSize: number | null;
}

export function compareStorageItems(
  a: StorageListItem,
  b: StorageListItem,
  field: StorageSortField,
  order: StorageSortOrder
): number {
  if (field === "name" && a.type !== b.type) {
    return a.type === "folder" ? -1 : 1;
  }

  let result = 0;

  switch (field) {
    case "name":
      result = a.name.localeCompare(b.name, "ja");
      break;
    case "size":
      result = (a.sizeBytes ?? -1) - (b.sizeBytes ?? -1);
      break;
    case "updatedAt":
      result = (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
      break;
    case "createdAt":
      result = (a.createdAt ?? 0) - (b.createdAt ?? 0);
      break;
    case "createdBy":
      result = (a.createdBy ?? "").localeCompare(b.createdBy ?? "", "ja");
      break;
    case "updatedBy":
      result = (a.updatedBy ?? "").localeCompare(b.updatedBy ?? "", "ja");
      break;
    default:
      result = a.name.localeCompare(b.name, "ja");
  }

  if (result === 0) {
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }
    result = a.name.localeCompare(b.name, "ja");
  }

  return order === "desc" ? -result : result;
}

function sortStorageItems(
  items: StorageListItem[],
  field: StorageSortField,
  order: StorageSortOrder
): StorageListItem[] {
  return [...items].sort((a, b) => compareStorageItems(a, b, field, order));
}

function sortDirectoryEntriesByName(
  entries: DirectoryEntry[],
  order: StorageSortOrder
): DirectoryEntry[] {
  const compareByName = (a: DirectoryEntry, b: DirectoryEntry): number => {
    const result = a.name.localeCompare(b.name, "ja");
    return order === "desc" ? -result : result;
  };

  const folders = entries.filter((entry) => entry.type === "folder").sort(compareByName);
  const files = entries.filter((entry) => entry.type === "file").sort(compareByName);
  return [...folders, ...files];
}

/** R2 からメタ取得前のエントリ一覧 */
export async function listDirectoryEntries(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string
): Promise<DirectoryEntry[]> {
  const bucket = getFiles(env);
  const prefix = dirListPrefix(rootType, rootKey, relativeDir);
  const listed = await bucket.list({ prefix, delimiter: "/" });
  const entries: DirectoryEntry[] = [];
  const seenNames = new Set<string>();

  for (const cp of listed.delimitedPrefixes ?? []) {
    const name = cp.slice(prefix.length).replace(/\/$/, "");
    if (!name || seenNames.has(name)) continue;
    seenNames.add(name);

    const childDir = relativeDir ? `${relativeDir}/${name}` : name;
    entries.push({
      name,
      relativePath: childDir,
      type: "folder",
      objectSize: null,
    });
  }

  for (const obj of listed.objects) {
    const keySuffix = obj.key.slice(prefix.length);
    if (!keySuffix || keySuffix.includes("/")) continue;
    if (keySuffix === FOLDER_META_NAME || keySuffix.endsWith(".meta")) continue;
    if (seenNames.has(keySuffix)) continue;
    seenNames.add(keySuffix);

    entries.push({
      name: keySuffix,
      relativePath: relativeDir ? `${relativeDir}/${keySuffix}` : keySuffix,
      type: "file",
      objectSize: obj.size,
    });
  }

  return entries;
}

/** エントリに .meta を付与して一覧項目に変換 */
async function enrichDirectoryEntry(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  entry: DirectoryEntry
): Promise<StorageListItem> {
  if (entry.type === "folder") {
    const folderMeta = await getFolderMeta(env, rootType, rootKey, entry.relativePath);
    return {
      name: entry.name,
      path: buildLogicalPath(rootType, rootKey, entry.relativePath),
      type: "folder",
      sizeBytes: null,
      createdAt: folderMeta?.createdAt ?? null,
      createdBy: folderMeta?.createdBy ?? null,
      updatedAt: folderMeta?.updatedAt ?? null,
      updatedBy: folderMeta?.updatedBy ?? null,
    };
  }

  const fileMeta = await getFileMeta(env, rootType, rootKey, entry.relativePath);
  return {
    name: entry.name,
    path: buildLogicalPath(rootType, rootKey, entry.relativePath),
    type: "file",
    sizeBytes: fileMeta?.sizeBytes ?? entry.objectSize,
    createdAt: fileMeta?.createdAt ?? null,
    createdBy: fileMeta?.createdBy ?? null,
    updatedAt: fileMeta?.updatedAt ?? null,
    updatedBy: fileMeta?.updatedBy ?? null,
  };
}

/** ディレクトリ内のエントリ一覧 */
export async function listDirectory(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string,
  options: ListDirectoryOptions = {}
): Promise<StorageListResult> {
  const logicalBase = buildLogicalPath(rootType, rootKey, relativeDir);
  const offset = Math.max(0, options.offset ?? 0);
  const limit = options.limit;
  const sortField = options.sortField ?? "name";
  const sortOrder = options.sortOrder ?? "asc";

  const entries = await listDirectoryEntries(env, rootType, rootKey, relativeDir);
  let items: StorageListItem[];

  if (sortField === "name") {
    const sortedEntries = sortDirectoryEntriesByName(entries, sortOrder);
    const pageEntries =
      limit === undefined
        ? sortedEntries.slice(offset)
        : sortedEntries.slice(offset, offset + limit);
    items = await Promise.all(
      pageEntries.map((entry) => enrichDirectoryEntry(env, rootType, rootKey, entry))
    );
  } else {
    const allItems = await Promise.all(
      entries.map((entry) => enrichDirectoryEntry(env, rootType, rootKey, entry))
    );
    const sortedItems = sortStorageItems(allItems, sortField, sortOrder);
    items =
      limit === undefined
        ? sortedItems.slice(offset)
        : sortedItems.slice(offset, offset + limit);
  }

  const total = entries.length;
  const hasMore = limit === undefined ? false : offset + items.length < total;

  return { path: logicalBase, items, total, hasMore };
}

/** ルート一覧レスポンス用エントリ */
export interface StorageRootEntry {
  path: string;
  type: "user" | "group";
  label: string;
  key: string;
}

/** ユーザーが閲覧可能なルート一覧を組み立て */
export async function buildVisibleRoots(
  db: D1Database,
  userId: string,
  username: string,
  isAdmin: boolean
): Promise<StorageRootEntry[]> {
  const roots: StorageRootEntry[] = [];

  roots.push({
    path: buildLogicalPath("user", username),
    type: "user",
    label: username,
    key: username,
  });

  const memberships = await db
    .prepare(
      `SELECT hg.slug, hg.display_name
       FROM user_group_memberships ugm
       JOIN hub_groups hg ON hg.id = ugm.group_id
       WHERE ugm.user_id = ?
       ORDER BY hg.position ASC, hg.display_name ASC`
    )
    .bind(userId)
    .all<{ slug: string; display_name: string }>();

  for (const m of memberships.results ?? []) {
    roots.push({
      path: buildLogicalPath("group", m.slug),
      type: "group",
      label: m.display_name,
      key: m.slug,
    });
  }

  if (isAdmin) {
    const allGroups = await db
      .prepare(
        `SELECT slug, display_name FROM hub_groups ORDER BY position ASC, display_name ASC`
      )
      .all<{ slug: string; display_name: string }>();

    for (const g of allGroups.results ?? []) {
      if (!roots.some((r) => r.type === "group" && r.key === g.slug)) {
        roots.push({
          path: buildLogicalPath("group", g.slug),
          type: "group",
          label: g.display_name,
          key: g.slug,
        });
      }
    }

    const allUsers = await db
      .prepare(`SELECT username FROM users WHERE username != ? ORDER BY username ASC`)
      .bind(username)
      .all<{ username: string }>();

    for (const u of allUsers.results ?? []) {
      if (!roots.some((r) => r.type === "user" && r.key === u.username)) {
        roots.push({
          path: buildLogicalPath("user", u.username),
          type: "user",
          label: u.username,
          key: u.username,
        });
      }
    }
  }

  return roots;
}
