/**
 * クラウドストレージ R2 キー・論理パス
 */

import { FOLDER_META_NAME, STORAGE_PREFIX } from "./constants";

export type StorageRootType = "user" | "group";

export interface ParsedStoragePath {
  rootType: StorageRootType;
  rootKey: string;
  relativePath: string;
}

/** 論理パス文字列をパースする（例: u/alice/docs/file.txt） */
export function parseLogicalPath(path: string): ParsedStoragePath | null {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (!normalized) return null;

  const segments = normalized.split("/").filter(Boolean);
  if (segments.length < 2) return null;

  const typeSeg = segments[0];
  const rootKey = segments[1];
  if (!rootKey) return null;

  if (typeSeg === "u") {
    return {
      rootType: "user",
      rootKey,
      relativePath: segments.slice(2).join("/"),
    };
  }

  if (typeSeg === "g") {
    return {
      rootType: "group",
      rootKey,
      relativePath: segments.slice(2).join("/"),
    };
  }

  return null;
}

/** 論理パスを組み立てる */
export function buildLogicalPath(
  rootType: StorageRootType,
  rootKey: string,
  relativePath = ""
): string {
  const prefix = rootType === "user" ? "u" : "g";
  const rel = relativePath.replace(/^\/+|\/+$/g, "");
  return rel ? `${prefix}/${rootKey}/${rel}` : `${prefix}/${rootKey}`;
}

/** ユーザー個人ルートの R2 プレフィックス */
export function userRootPrefix(username: string): string {
  return `${STORAGE_PREFIX}/u/${username}/`;
}

/** グループルートの R2 プレフィックス */
export function groupRootPrefix(groupSlug: string): string {
  return `${STORAGE_PREFIX}/g/${groupSlug}/`;
}

/** ルート種別に応じた R2 プレフィックス */
export function rootPrefix(rootType: StorageRootType, rootKey: string): string {
  return rootType === "user" ? userRootPrefix(rootKey) : groupRootPrefix(rootKey);
}

/** 相対パスから R2 キーを生成 */
export function toR2Key(
  rootType: StorageRootType,
  rootKey: string,
  relativePath: string
): string {
  const prefix = rootPrefix(rootType, rootKey);
  const rel = relativePath.replace(/^\/+/g, "");
  return `${prefix}${rel}`;
}

/** ファイルのサイドカー .meta キー */
export function fileMetaKey(
  rootType: StorageRootType,
  rootKey: string,
  relativeFilePath: string
): string {
  return `${toR2Key(rootType, rootKey, relativeFilePath)}.meta`;
}

/** フォルダの __folder.meta キー */
export function folderMetaKey(
  rootType: StorageRootType,
  rootKey: string,
  relativeDirPath: string
): string {
  const dir = relativeDirPath.replace(/^\/+|\/+$/g, "");
  if (!dir) {
    return `${rootPrefix(rootType, rootKey)}${FOLDER_META_NAME}`;
  }
  return `${toR2Key(rootType, rootKey, dir)}/${FOLDER_META_NAME}`;
}

/** ディレクトリの R2 リスト用プレフィックス（末尾スラッシュ付き） */
export function dirListPrefix(
  rootType: StorageRootType,
  rootKey: string,
  relativeDirPath: string
): string {
  const base = rootPrefix(rootType, rootKey);
  const dir = relativeDirPath.replace(/^\/+|\/+$/g, "");
  return dir ? `${base}${dir}/` : base;
}

/** ファイル名をサニタイズ */
export function sanitizeFilename(name: string): string {
  const trimmed = name.trim().replace(/[/\\]/g, "_");
  if (!trimmed || trimmed === "." || trimmed === "..") {
    throw new Error("無効なファイル名です");
  }
  return trimmed.slice(0, 255);
}

/** パスセグメントを検証 */
export function validatePathSegment(segment: string): boolean {
  if (!segment || segment === "." || segment === "..") return false;
  if (segment.includes("/") || segment.includes("\\")) return false;
  return true;
}

/** 同名回避のためのファイル名を決定 */
export function buildAutoRenameName(filename: string, index: number): string {
  const dot = filename.lastIndexOf(".");
  if (dot <= 0) {
    return `${filename} (${index})`;
  }
  const base = filename.slice(0, dot);
  const ext = filename.slice(dot);
  return `${base} (${index})${ext}`;
}
