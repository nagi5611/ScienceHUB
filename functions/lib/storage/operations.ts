/**
 * ストレージ操作（mkdir / delete / rename / download）
 */

import { getFiles } from "../r2";
import type { Env } from "../types";
import type { SessionUser } from "../types";
import {
  buildLogicalPath,
  fileMetaKey,
  folderMetaKey,
  parseLogicalPath,
  sanitizeFilename,
  toR2Key,
  validatePathSegment,
  type ParsedStoragePath,
  type StorageRootType,
} from "./keys";
import {
  createFolderMeta,
  getFileMeta,
  writeMetaJson,
} from "./meta";
import { subtractUsedBytes } from "./quota";
import { authorizeStoragePath } from "./permissions";
import { dirListPrefix } from "./keys";
import { resolveUniqueFilename, resolveUniqueFolderName } from "./upload";

/** フォルダを作成 */
export async function createStorageDirectory(
  env: Env,
  _db: D1Database,
  user: SessionUser,
  parsed: ParsedStoragePath,
  folderName: string
): Promise<{ path: string }> {
  if (!validatePathSegment(folderName)) {
    throw new Error("無効なフォルダ名です");
  }

  const safeName = sanitizeFilename(folderName);
  const relativeDir = parsed.relativePath;
  const newDir = relativeDir ? `${relativeDir}/${safeName}` : safeName;

  const bucket = getFiles(env);
  const metaKey = folderMetaKey(parsed.rootType, parsed.rootKey, newDir);
  const existing = await bucket.head(metaKey);
  if (existing) {
    throw new Error("同名のフォルダが既に存在します");
  }

  const meta = createFolderMeta(user.username, parsed.rootType);
  await writeMetaJson(bucket, metaKey, meta);

  return { path: buildLogicalPath(parsed.rootType, parsed.rootKey, newDir) };
}

/** ファイルを認証付きでストリーム */
export async function streamStorageFile(
  env: Env,
  parsed: ParsedStoragePath
): Promise<Response> {
  const bucket = getFiles(env);
  const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const obj = await bucket.get(r2Key);
  if (!obj) throw new Error("ファイルが見つかりません");

  const filename = parsed.relativePath.split("/").pop() ?? "download";
  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    },
  });
}

/** ファイルまたはフォルダを削除 */
export async function deleteStoragePath(
  env: Env,
  db: D1Database,
  parsed: ParsedStoragePath,
  isDirectory: boolean
): Promise<{ freedBytes: number }> {
  const bucket = getFiles(env);
  let freedBytes = 0;

  if (!isDirectory) {
    const meta = await getFileMeta(
      env,
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath
    );
    freedBytes = meta?.sizeBytes ?? 0;

    const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
    await bucket.delete(r2Key);
    await bucket.delete(fileMetaKey(parsed.rootType, parsed.rootKey, parsed.relativePath));
  } else {
    const prefix = dirListPrefix(
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath
    );
    let cursor: string | undefined;

    do {
      const listed = await bucket.list({ prefix, cursor });
      for (const obj of listed.objects) {
        const rel = obj.key.slice(
          dirListPrefix(parsed.rootType, parsed.rootKey, "").length
        );
        if (!rel.endsWith(".meta") && rel !== "__folder.meta" && !rel.endsWith("/")) {
          const meta = await getFileMeta(env, parsed.rootType, parsed.rootKey, rel);
          freedBytes += meta?.sizeBytes ?? obj.size;
        }
        await bucket.delete(obj.key);
      }
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
  }

  const root = await resolveRootFromParsed(db, parsed);
  if (root && freedBytes > 0) {
    await subtractUsedBytes(db, root.id, freedBytes);
  }

  return { freedBytes };
}

/** リネーム */
export async function renameStoragePath(
  env: Env,
  _db: D1Database,
  _user: SessionUser,
  parsed: ParsedStoragePath,
  newName: string,
  isDirectory: boolean
): Promise<{ path: string }> {
  if (!validatePathSegment(newName)) {
    throw new Error("無効な名前です");
  }

  const safeName = sanitizeFilename(newName);
  const parts = parsed.relativePath.split("/");
  parts.pop();
  const parentDir = parts.join("/");
  const newRelative = parentDir ? `${parentDir}/${safeName}` : safeName;

  const bucket = getFiles(env);
  const oldKey = isDirectory
    ? folderMetaKey(parsed.rootType, parsed.rootKey, parsed.relativePath)
    : toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const newKey = isDirectory
    ? folderMetaKey(parsed.rootType, parsed.rootKey, newRelative)
    : toR2Key(parsed.rootType, parsed.rootKey, newRelative);

  if (isDirectory) {
    await renameDirectoryRecursive(
      env,
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath,
      newRelative
    );
    return { path: buildLogicalPath(parsed.rootType, parsed.rootKey, newRelative) };
  }

  const existing = await bucket.head(newKey);
  if (existing) throw new Error("同名のファイルが既に存在します");

  const obj = await bucket.get(oldKey);
  if (!obj) throw new Error("ファイルが見つかりません");

  await bucket.put(newKey, obj.body, { httpMetadata: obj.httpMetadata });
  await bucket.delete(oldKey);

  const oldMetaKey = fileMetaKey(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const newMetaKey = fileMetaKey(parsed.rootType, parsed.rootKey, newRelative);
  const metaObj = await bucket.get(oldMetaKey);
  if (metaObj) {
    await bucket.put(newMetaKey, metaObj.body, { httpMetadata: metaObj.httpMetadata });
    await bucket.delete(oldMetaKey);
  }

  return { path: buildLogicalPath(parsed.rootType, parsed.rootKey, newRelative) };
}

async function renameDirectoryRecursive(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  oldDir: string,
  newDir: string
): Promise<void> {
  const bucket = getFiles(env);
  const oldPrefix = dirListPrefix(rootType, rootKey, oldDir);
  const newPrefix = dirListPrefix(rootType, rootKey, newDir);

  const listed = await bucket.list({ prefix: oldPrefix });
  const keys = listed.objects.map((o) => o.key).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    const suffix = key.slice(oldPrefix.length);
    const destKey = `${newPrefix}${suffix}`;
    const obj = await bucket.get(key);
    if (!obj) continue;
    await bucket.put(destKey, obj.body, { httpMetadata: obj.httpMetadata });
    await bucket.delete(key);
  }
}

function getParentRelativePath(relativePath: string): string {
  const parts = relativePath.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

function isDescendantOrEqual(ancestor: string, target: string): boolean {
  if (!ancestor) return false;
  return target === ancestor || target.startsWith(`${ancestor}/`);
}

/** ファイルまたはフォルダを別ディレクトリへ移動 */
export async function moveStoragePath(
  env: Env,
  _db: D1Database,
  parsed: ParsedStoragePath,
  isDirectory: boolean,
  destDirRelative: string
): Promise<{ path: string; renamed: boolean }> {
  const destRelative = destDirRelative.replace(/^\/+|\/+$/g, "");
  const itemName = parsed.relativePath.split("/").pop() ?? "";
  if (!itemName) throw new Error("移動元が不正です");

  if (isDirectory && isDescendantOrEqual(parsed.relativePath, destRelative)) {
    throw new Error("フォルダを自身の中に移動できません");
  }

  const currentParent = getParentRelativePath(parsed.relativePath);
  if (currentParent === destRelative) {
    throw new Error("同じ場所に移動できません");
  }

  const targetName = isDirectory
    ? await resolveUniqueFolderName(
        env,
        parsed.rootType,
        parsed.rootKey,
        destRelative,
        itemName
      )
    : await resolveUniqueFilename(
        env,
        parsed.rootType,
        parsed.rootKey,
        destRelative,
        itemName
      );
  const renamed = targetName !== itemName;
  const newRelative = destRelative ? `${destRelative}/${targetName}` : targetName;

  if (isDirectory) {
    await renameDirectoryRecursive(
      env,
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath,
      newRelative
    );
    return {
      path: buildLogicalPath(parsed.rootType, parsed.rootKey, newRelative),
      renamed,
    };
  }

  const bucket = getFiles(env);
  const oldKey = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const newKey = toR2Key(parsed.rootType, parsed.rootKey, newRelative);

  const obj = await bucket.get(oldKey);
  if (!obj) throw new Error("ファイルが見つかりません");

  await bucket.put(newKey, obj.body, { httpMetadata: obj.httpMetadata });
  await bucket.delete(oldKey);

  const oldMetaKey = fileMetaKey(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const newMetaKey = fileMetaKey(parsed.rootType, parsed.rootKey, newRelative);
  const metaObj = await bucket.get(oldMetaKey);
  if (metaObj) {
    await bucket.put(newMetaKey, metaObj.body, { httpMetadata: metaObj.httpMetadata });
    await bucket.delete(oldMetaKey);
  }

  return {
    path: buildLogicalPath(parsed.rootType, parsed.rootKey, newRelative),
    renamed,
  };
}

export interface StorageMoveItem {
  path: string;
  type: "file" | "folder";
}

/** 複数項目を認証付きで移動 */
export async function moveItemsWithAuth(
  env: Env,
  db: D1Database,
  user: SessionUser,
  items: StorageMoveItem[],
  destLogicalPath: string
): Promise<{
  moved: Array<{ from: string; to: string; renamed: boolean }>;
}> {
  if (!items.length) throw new Error("移動する項目を指定してください");

  const destParsed = parseLogicalPath(destLogicalPath);
  if (!destParsed) throw new Error("移動先が不正です");

  const destAuth = await authorizeStoragePath(
    env,
    db,
    user,
    destLogicalPath,
    "write",
    true
  );
  if (typeof destAuth === "string") throw new Error(destAuth);

  const destDirRelative = destParsed.relativePath;
  const moved: Array<{ from: string; to: string; renamed: boolean }> = [];

  const folderPaths = items
    .filter((item) => item.type === "folder")
    .map((item) => item.path);
  const filtered = items.filter((item) => {
    return !folderPaths.some(
      (folderPath) => folderPath !== item.path && item.path.startsWith(`${folderPath}/`)
    );
  });

  const sorted = [...filtered].sort((a, b) => b.path.length - a.path.length);

  for (const item of sorted) {
    const isDirectory = item.type === "folder";
    const sourceAuth = await authorizeStoragePath(
      env,
      db,
      user,
      item.path,
      "write",
      isDirectory
    );
    if (typeof sourceAuth === "string") throw new Error(sourceAuth);

    if (
      sourceAuth.parsed.rootType !== destParsed.rootType ||
      sourceAuth.parsed.rootKey !== destParsed.rootKey
    ) {
      throw new Error("別のストレージ間では移動できません");
    }

    try {
      const result = await moveStoragePath(
        env,
        db,
        sourceAuth.parsed,
        isDirectory,
        destDirRelative
      );
      moved.push({ from: item.path, to: result.path, renamed: result.renamed });
    } catch (err) {
      const message = err instanceof Error ? err.message : "移動に失敗しました";
      if (message === "同じ場所に移動できません") continue;
      throw err;
    }
  }

  if (!moved.length) throw new Error("移動できる項目がありません");
  return { moved };
}

async function resolveRootFromParsed(
  db: D1Database,
  parsed: ParsedStoragePath
): Promise<{ id: string } | null> {
  if (parsed.rootType === "user") {
    return db
      .prepare(
        `SELECT sr.id FROM storage_roots sr
         JOIN users u ON u.id = sr.user_id
         WHERE u.username = ?`
      )
      .bind(parsed.rootKey)
      .first<{ id: string }>();
  }

  return db
    .prepare(
      `SELECT sr.id FROM storage_roots sr
       JOIN hub_groups hg ON hg.id = sr.group_id
       WHERE hg.slug = ?`
    )
    .bind(parsed.rootKey)
    .first<{ id: string }>();
}

/** 削除前の認証付き削除エントリポイント（ごみ箱へ移動） */
export async function deleteWithAuth(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  isDirectory: boolean
): Promise<{ trashId: string; trashed: true }> {
  const { moveToTrashWithAuth } = await import("./trash");
  return moveToTrashWithAuth(env, db, user, logicalPath, isDirectory);
}

/** mkdir 認証付き */
export async function mkdirWithAuth(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  folderName: string
): Promise<{ path: string }> {
  const auth = await authorizeStoragePath(
    env,
    db,
    user,
    logicalPath,
    "write",
    true
  );
  if (typeof auth === "string") throw new Error(auth);
  return createStorageDirectory(env, db, user, auth.parsed, folderName);
}

/** rename 認証付き */
export async function renameWithAuth(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  newName: string,
  isDirectory: boolean
): Promise<{ path: string }> {
  const auth = await authorizeStoragePath(
    env,
    db,
    user,
    logicalPath,
    "write",
    isDirectory
  );
  if (typeof auth === "string") throw new Error(auth);
  return renameStoragePath(env, db, user, auth.parsed, newName, isDirectory);
}
