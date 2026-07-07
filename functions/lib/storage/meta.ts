/**
 * クラウドストレージ .meta 読み書き
 */

import type { StorageRootType } from "./keys";
import { fileMetaKey, folderMetaKey } from "./keys";
import { getFiles } from "../r2";
import type { Env } from "../types";

export type StorageAction = "read" | "write" | "delete";

export interface PermissionRule {
  hubRoles: string[];
  groupMembers: boolean;
}

export interface StoragePermissions {
  read: PermissionRule;
  write: PermissionRule;
  delete: PermissionRule;
}

export interface FileMetaDocument {
  version: 1;
  sizeBytes: number;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  permissions: StoragePermissions;
}

export interface FolderMetaDocument {
  version: 1;
  type: "folder";
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  permissions: StoragePermissions;
}

/** 個人ルートのデフォルト権限（本人 + admin は permissions.ts で判定） */
export function defaultUserRootPermissions(): StoragePermissions {
  return {
    read: { hubRoles: [], groupMembers: false },
    write: { hubRoles: [], groupMembers: false },
    delete: { hubRoles: [], groupMembers: false },
  };
}

/** グループルートのデフォルト権限 */
export function defaultGroupRootPermissions(): StoragePermissions {
  return {
    read: { hubRoles: ["guest", "member", "admin"], groupMembers: true },
    write: { hubRoles: ["member", "admin"], groupMembers: true },
    delete: { hubRoles: ["member", "admin"], groupMembers: true },
  };
}

/** 親から継承する空の上書き（全フィールド継承） */
export function inheritPermissions(parent: StoragePermissions): StoragePermissions {
  return {
    read: { ...parent.read, hubRoles: [...parent.read.hubRoles] },
    write: { ...parent.write, hubRoles: [...parent.write.hubRoles] },
    delete: { ...parent.delete, hubRoles: [...parent.delete.hubRoles] },
  };
}

/** アクション単位で子が定義されていれば上書き */
export function mergePermissions(
  parent: StoragePermissions,
  child?: Partial<StoragePermissions>
): StoragePermissions {
  if (!child) return inheritPermissions(parent);
  const result = inheritPermissions(parent);
  for (const action of ["read", "write", "delete"] as const) {
    if (child[action]) {
      result[action] = {
        hubRoles: [...child[action].hubRoles],
        groupMembers: child[action].groupMembers,
      };
    }
  }
  return result;
}

/** R2 から JSON メタを読む */
export async function readMetaJson<T>(bucket: R2Bucket, key: string): Promise<T | null> {
  const obj = await bucket.get(key);
  if (!obj) return null;
  try {
    return (await obj.json()) as T;
  } catch {
    return null;
  }
}

/** R2 に JSON メタを書く */
export async function writeMetaJson(
  bucket: R2Bucket,
  key: string,
  data: FileMetaDocument | FolderMetaDocument
): Promise<void> {
  await bucket.put(key, JSON.stringify(data, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
}

/** フォルダメタを取得（なければ null） */
export async function getFolderMeta(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativeDirPath: string
): Promise<FolderMetaDocument | null> {
  const bucket = getFiles(env);
  const key = folderMetaKey(rootType, rootKey, relativeDirPath);
  return readMetaJson<FolderMetaDocument>(bucket, key);
}

/** ファイルメタを取得 */
export async function getFileMeta(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativeFilePath: string
): Promise<FileMetaDocument | null> {
  const bucket = getFiles(env);
  const key = fileMetaKey(rootType, rootKey, relativeFilePath);
  return readMetaJson<FileMetaDocument>(bucket, key);
}

/** ルートから対象までのディレクトリパス一覧（ルート含む） */
export function ancestorDirs(relativePath: string): string[] {
  const normalized = relativePath.replace(/^\/+|\/+$/g, "");
  const dirs: string[] = [""];
  if (!normalized) return dirs;

  const parts = normalized.split("/");
  if (parts.length > 1) {
    for (let i = 0; i < parts.length - 1; i++) {
      dirs.push(parts.slice(0, i + 1).join("/"));
    }
  }
  return dirs;
}

/** ルートから対象パスまでの実効権限を解決 */
export async function resolveEffectivePermissions(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativePath: string,
  isDirectory: boolean
): Promise<StoragePermissions> {
  const base =
    rootType === "user"
      ? defaultUserRootPermissions()
      : defaultGroupRootPermissions();

  const targetDirs = isDirectory
    ? ancestorDirs(relativePath)
    : ancestorDirs(relativePath);

  let effective = inheritPermissions(base);

  for (const dir of targetDirs) {
    const folderMeta = await getFolderMeta(env, rootType, rootKey, dir);
    if (folderMeta?.permissions) {
      effective = mergePermissions(effective, folderMeta.permissions);
    }
  }

  if (!isDirectory) {
    const fileMeta = await getFileMeta(env, rootType, rootKey, relativePath);
    if (fileMeta?.permissions) {
      effective = mergePermissions(effective, fileMeta.permissions);
    }
  }

  return effective;
}

/** 新規フォルダメタを作成 */
export function createFolderMeta(
  username: string,
  rootType: StorageRootType,
  permissions?: Partial<StoragePermissions>
): FolderMetaDocument {
  const ts = Date.now();
  const base =
    rootType === "user"
      ? defaultUserRootPermissions()
      : defaultGroupRootPermissions();
  return {
    version: 1,
    type: "folder",
    createdBy: username,
    updatedBy: username,
    createdAt: ts,
    updatedAt: ts,
    permissions: mergePermissions(base, permissions),
  };
}

/** 新規ファイルメタを作成 */
export function createFileMeta(
  username: string,
  sizeBytes: number,
  permissions: StoragePermissions
): FileMetaDocument {
  const ts = Date.now();
  return {
    version: 1,
    sizeBytes,
    createdBy: username,
    updatedBy: username,
    createdAt: ts,
    updatedAt: ts,
    permissions: inheritPermissions(permissions),
  };
}
