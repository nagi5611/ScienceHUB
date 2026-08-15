/**
 * ウェブサイト公開 — ファイル操作（取得・保存・リネーム・ダウンロード）
 */

import { getFiles } from "../r2";
import type { Env } from "../types";
import { siteObjectKey } from "./keys";
import {
  addSiteUsedBytes,
  canAllocateSiteBytes,
  type WebSiteRow,
} from "./quota";
import { contentTypeForPath, listSiteFiles } from "./r2-ops";
import {
  getExtension,
  isAllowedStaticFile,
  isEditableTextFile,
  sanitizeRelativeDir,
  sanitizeRelativePath,
  sanitizeSingleName,
} from "./static-policy";

export const MAX_TEXT_EDIT_BYTES = 2 * 1024 * 1024;

/** テキストファイルを読み取り */
export async function readSiteFileText(
  env: Env,
  site: WebSiteRow,
  relativePath: string
): Promise<{ path: string; content: string; size: number }> {
  const safePath = sanitizeRelativePath(relativePath);
  if (!isEditableTextFile(safePath)) {
    throw new Error("このファイル形式はテキスト編集できません");
  }

  const bucket = getFiles(env);
  const r2Key = siteObjectKey(site.dir_name, safePath);
  const obj = await bucket.get(r2Key);
  if (!obj) throw new Error("ファイルが見つかりません");

  if (obj.size > MAX_TEXT_EDIT_BYTES) {
    throw new Error("ファイルが大きすぎるためエディタで開けません（2MB 以下）");
  }

  const content = await obj.text();
  return { path: safePath, content, size: obj.size };
}

/** テキストファイルを保存 */
export async function writeSiteFileText(
  env: Env,
  db: D1Database,
  site: WebSiteRow,
  relativePath: string,
  content: string
): Promise<{ path: string; size: number }> {
  const safePath = sanitizeRelativePath(relativePath);
  if (!isEditableTextFile(safePath)) {
    throw new Error("このファイル形式はテキスト編集できません");
  }

  const bytes = new TextEncoder().encode(content);
  if (bytes.byteLength > MAX_TEXT_EDIT_BYTES) {
    throw new Error("ファイルが大きすぎます（2MB 以下）");
  }

  const bucket = getFiles(env);
  const r2Key = siteObjectKey(site.dir_name, safePath);
  const head = await bucket.head(r2Key);
  const oldSize = head?.size ?? 0;
  const delta = bytes.byteLength - oldSize;

  if (!canAllocateSiteBytes(site, delta)) {
    throw new Error("サイトの容量上限（5GB）を超えるため保存できません");
  }

  await bucket.put(r2Key, content, {
    httpMetadata: { contentType: contentTypeForPath(safePath) },
  });

  if (delta !== 0) {
    await addSiteUsedBytes(db, site.id, delta);
  }

  return { path: safePath, size: bytes.byteLength };
}

/** ファイルまたはフォルダをリネーム */
export async function renameSitePath(
  env: Env,
  site: WebSiteRow,
  fromPath: string,
  newName: string,
  kind: "file" | "folder"
): Promise<{ renamed: string[] }> {
  const safeName = sanitizeSingleName(newName);
  if (!safeName) throw new Error("新しい名前を入力してください");

  const bucket = getFiles(env);
  const allFiles = await listSiteFiles(bucket, site.r2_prefix);
  const renamed: string[] = [];

  if (kind === "file") {
    const from = sanitizeRelativePath(fromPath);
    const parent = from.includes("/") ? from.slice(0, from.lastIndexOf("/")) : "";
    const ext = getExtension(from);
    const newExt = getExtension(safeName);
    if (ext && newExt && ext !== newExt) {
      throw new Error("拡張子は変更できません");
    }
    if (!newExt && ext) {
      throw new Error("拡張子を削除できません");
    }

    const toPath = parent ? `${parent}/${safeName}` : safeName;
    if (toPath === from) return { renamed: [from] };

    if (!isAllowedStaticFile(toPath)) {
      throw new Error("許可されていないファイル形式です");
    }

    const fromKey = siteObjectKey(site.dir_name, from);
    const toKey = siteObjectKey(site.dir_name, toPath);
    if (await bucket.head(toKey)) {
      throw new Error("同名のファイルが既に存在します");
    }

    const obj = await bucket.get(fromKey);
    if (!obj) throw new Error("ファイルが見つかりません");

    await bucket.put(toKey, obj.body, {
      httpMetadata: {
        contentType:
          obj.httpMetadata?.contentType ?? contentTypeForPath(toPath),
      },
    });
    await bucket.delete(fromKey);
    renamed.push(toPath);
    return { renamed };
  }

  const folderPath = sanitizeRelativeDir(fromPath);
  const parent = folderPath.includes("/")
    ? folderPath.slice(0, folderPath.lastIndexOf("/"))
    : "";
  const toFolder = parent ? `${parent}/${safeName}` : safeName;

  if (toFolder === folderPath) return { renamed: [] };

  const fromPrefix = `${folderPath}/`;
  const toPrefix = `${toFolder}/`;

  const affected = allFiles.filter((f) => f.path.startsWith(fromPrefix));

  if (affected.length === 0) {
    throw new Error("フォルダが見つかりません");
  }

  for (const file of affected) {
    const suffix = file.path.slice(fromPrefix.length);
    const newPath = `${toPrefix}${suffix}`;
    if (!isAllowedStaticFile(newPath)) {
      throw new Error(`リネーム後のパスが不正です: ${newPath}`);
    }
    const fromKey = siteObjectKey(site.dir_name, file.path);
    const toKey = siteObjectKey(site.dir_name, newPath);
    if (await bucket.head(toKey)) {
      throw new Error("移動先に同名のファイルが既に存在します");
    }
    const obj = await bucket.get(fromKey);
    if (!obj) continue;
    await bucket.put(toKey, obj.body, {
      httpMetadata: {
        contentType:
          obj.httpMetadata?.contentType ?? contentTypeForPath(newPath),
      },
    });
    await bucket.delete(fromKey);
    renamed.push(newPath);
  }

  return { renamed };
}

/** ダウンロード用 R2 オブジェクトを取得 */
export async function getSiteFileForDownload(
  env: Env,
  site: WebSiteRow,
  relativePath: string
): Promise<{ obj: R2ObjectBody; filename: string }> {
  const safePath = sanitizeRelativePath(relativePath);
  const bucket = getFiles(env);
  const r2Key = siteObjectKey(site.dir_name, safePath);
  const obj = await bucket.get(r2Key);
  if (!obj) throw new Error("ファイルが見つかりません");
  const filename = safePath.split("/").pop() ?? safePath;
  return { obj, filename };
}
