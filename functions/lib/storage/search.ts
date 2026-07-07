/**
 * ストレージファイル名検索
 */

import { getFiles } from "../r2";
import type { Env } from "../types";
import { FOLDER_META_NAME } from "./constants";
import { buildLogicalPath, dirListPrefix, rootPrefix, type StorageRootType } from "./keys";
import { getFileMeta } from "./meta";
import {
  compareStorageItems,
  type ListDirectoryOptions,
  type StorageListItem,
  type StorageSortField,
  type StorageSortOrder,
} from "./list";

export type StorageSearchScope = "folder" | "subtree" | "root";

export const STORAGE_SEARCH_SCOPES: StorageSearchScope[] = ["folder", "subtree", "root"];

export interface StorageSearchOptions extends ListDirectoryOptions {
  query: string;
  scope: StorageSearchScope;
  updatedFrom?: number | null;
  updatedTo?: number | null;
}

export interface StorageSearchItem extends StorageListItem {
  /** ルートからの親フォルダ相対パス（表示用） */
  location: string;
}

export interface StorageSearchResult {
  path: string;
  items: StorageSearchItem[];
  total: number;
  hasMore: boolean;
  search: {
    query: string;
    scope: StorageSearchScope;
    updatedFrom: number | null;
    updatedTo: number | null;
  };
}

export function parseStorageSearchScope(value: string | null): StorageSearchScope {
  if (value && STORAGE_SEARCH_SCOPES.includes(value as StorageSearchScope)) {
    return value as StorageSearchScope;
  }
  return "folder";
}

const SEARCH_DATE_TZ = "+09:00";

/** 検索用日時パラメータ（開始・日付のみは JST の 0:00） */
export function parseSearchDateFrom(value: string | null): number | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return Date.parse(`${trimmed}T00:00:00.000${SEARCH_DATE_TZ}`);
  }
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

/** 検索用日時パラメータ（終了・日付のみは JST の 23:59:59.999） */
export function parseSearchDateTo(value: string | null): number | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return Date.parse(`${trimmed}T23:59:59.999${SEARCH_DATE_TZ}`);
  }
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function matchesFilename(name: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return name.toLowerCase().includes(q);
}

function isFileObjectKey(keySuffix: string): boolean {
  if (!keySuffix || keySuffix.endsWith("/")) return false;
  if (keySuffix.endsWith(".meta")) return false;
  if (keySuffix === FOLDER_META_NAME || keySuffix.endsWith(`/${FOLDER_META_NAME}`)) {
    return false;
  }
  return true;
}

function parentLocation(relativeFilePath: string): string {
  const parts = relativeFilePath.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  return parts.slice(0, -1).join("/");
}

interface FileCandidate {
  relativePath: string;
  objectSize: number | null;
}

/** R2 プレフィックス配下のファイル候補を列挙 */
async function listFileCandidates(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  listPrefix: string,
  scope: StorageSearchScope,
  relativeDir: string
): Promise<FileCandidate[]> {
  if (scope === "folder") {
    const bucket = getFiles(env);
    const prefix = dirListPrefix(rootType, rootKey, relativeDir);
    const listed = await bucket.list({ prefix, delimiter: "/" });
    const candidates: FileCandidate[] = [];

    for (const obj of listed.objects) {
      const keySuffix = obj.key.slice(prefix.length);
      if (!isFileObjectKey(keySuffix) || keySuffix.includes("/")) continue;
      const relativePath = relativeDir ? `${relativeDir}/${keySuffix}` : keySuffix;
      candidates.push({ relativePath, objectSize: obj.size });
    }

    return candidates;
  }

  const bucket = getFiles(env);
  const candidates: FileCandidate[] = [];
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix: listPrefix, cursor });
    for (const obj of listed.objects) {
      const keySuffix = obj.key.slice(listPrefix.length);
      if (!isFileObjectKey(keySuffix)) continue;

      const relativePath = keySuffix.replace(/^\/+/, "");
      if (!relativePath) continue;

      if (scope === "subtree" && relativeDir) {
        const dirPrefix = `${relativeDir}/`;
        if (relativePath !== relativeDir && !relativePath.startsWith(dirPrefix)) {
          continue;
        }
      }

      candidates.push({ relativePath, objectSize: obj.size });
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  return candidates;
}

async function enrichSearchCandidate(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  candidate: FileCandidate
): Promise<StorageSearchItem> {
  const name = candidate.relativePath.split("/").pop() ?? candidate.relativePath;
  const fileMeta = await getFileMeta(env, rootType, rootKey, candidate.relativePath);

  return {
    name,
    path: buildLogicalPath(rootType, rootKey, candidate.relativePath),
    type: "file",
    sizeBytes: fileMeta?.sizeBytes ?? candidate.objectSize,
    createdAt: fileMeta?.createdAt ?? null,
    createdBy: fileMeta?.createdBy ?? null,
    updatedAt: fileMeta?.updatedAt ?? null,
    updatedBy: fileMeta?.updatedBy ?? null,
    location: parentLocation(candidate.relativePath),
  };
}

function matchesUpdatedRange(
  updatedAt: number | null,
  updatedFrom: number | null,
  updatedTo: number | null
): boolean {
  if (updatedFrom === null && updatedTo === null) return true;
  if (updatedAt === null) return false;
  if (updatedFrom !== null && updatedAt < updatedFrom) return false;
  if (updatedTo !== null && updatedAt > updatedTo) return false;
  return true;
}

function sortSearchItems(
  items: StorageSearchItem[],
  field: StorageSortField,
  order: StorageSortOrder
): StorageSearchItem[] {
  return [...items].sort((a, b) => compareStorageItems(a, b, field, order));
}

/** ファイル名・更新日時で検索 */
export async function searchStorageFiles(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string,
  options: StorageSearchOptions
): Promise<StorageSearchResult> {
  const scope = options.scope;
  const query = options.query.trim();
  const updatedFrom = options.updatedFrom ?? null;
  const updatedTo = options.updatedTo ?? null;
  const offset = Math.max(0, options.offset ?? 0);
  const limit = options.limit;
  const sortField = options.sortField ?? "name";
  const sortOrder = options.sortOrder ?? "asc";

  if (!query && updatedFrom === null && updatedTo === null) {
    throw new Error("検索語または更新日時の範囲を指定してください");
  }

  const listPrefix =
    scope === "root"
      ? rootPrefix(rootType, rootKey)
      : dirListPrefix(rootType, rootKey, relativeDir);

  const candidates = await listFileCandidates(
    env,
    rootType,
    rootKey,
    listPrefix,
    scope,
    relativeDir
  );

  const nameFiltered = candidates.filter((candidate) => {
    const name = candidate.relativePath.split("/").pop() ?? "";
    return matchesFilename(name, query);
  });

  const enriched = await Promise.all(
    nameFiltered.map((candidate) => enrichSearchCandidate(env, rootType, rootKey, candidate))
  );

  const filtered = enriched.filter((item) =>
    matchesUpdatedRange(item.updatedAt, updatedFrom, updatedTo)
  );

  const sorted = sortSearchItems(filtered, sortField, sortOrder);
  const items =
    limit === undefined ? sorted.slice(offset) : sorted.slice(offset, offset + limit);
  const total = sorted.length;
  const hasMore = limit === undefined ? false : offset + items.length < total;

  return {
    path: buildLogicalPath(rootType, rootKey, relativeDir),
    items,
    total,
    hasMore,
    search: {
      query,
      scope,
      updatedFrom,
      updatedTo,
    },
  };
}
