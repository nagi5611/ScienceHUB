/**
 * Runa — ストレージファイル読み書き（テキスト）
 */

import { getFiles } from "../r2";
import type { Env, SessionUser } from "../types";
import {
  buildLogicalPath,
  fileMetaKey,
  parseLogicalPath,
  sanitizeFilename,
  toR2Key,
  validatePathSegment,
} from "../storage/keys";
import {
  createFileMeta,
  getFileMeta,
  resolveEffectivePermissions,
  writeMetaJson,
} from "../storage/meta";
import { authorizeStoragePath } from "../storage/permissions";
import {
  buildFileIndexEntry,
  upsertFileIndex,
} from "../storage/file-index";
import {
  addUsedBytes,
  canAllocateBytes,
  subtractUsedBytes,
} from "../storage/quota";
import { resolveRootForPath } from "../storage/roots";
import {
  initiateStorageUpload,
  simpleStorageUpload,
} from "../storage/upload";

/** エージェントが一度に読める最大バイト数 */
export const RUNA_MAX_READ_BYTES = 512 * 1024;
/** エージェントが一度に書ける最大バイト数 */
export const RUNA_MAX_WRITE_BYTES = 512 * 1024;

export interface ReadFileResult {
  path: string;
  sizeBytes: number;
  truncated: boolean;
  encoding: "utf-8" | "base64";
  content: string;
  mimeType: string | null;
}

export interface WriteFileResult {
  path: string;
  sizeBytes: number;
  created: boolean;
}

function parentDirFromFilePath(relativePath: string): {
  dir: string;
  filename: string;
} {
  const normalized = relativePath.replace(/^\/+|\/+$/g, "");
  const parts = normalized.split("/").filter(Boolean);
  if (!parts.length) {
    throw new Error("ファイル名が不正です");
  }
  const filename = parts.pop()!;
  const dir = parts.join("/");
  return { dir, filename };
}

/** テキストファイルを読み込む */
export async function readStorageFileForRuna(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  maxBytes = RUNA_MAX_READ_BYTES
): Promise<ReadFileResult> {
  const parsed = parseLogicalPath(logicalPath);
  if (!parsed || !parsed.relativePath) {
    throw new Error("ファイルパスが不正です");
  }

  const auth = await authorizeStoragePath(
    env,
    db,
    user,
    logicalPath,
    "read",
    false
  );
  if (typeof auth === "string") throw new Error(auth);

  const bucket = getFiles(env);
  const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const obj = await bucket.get(r2Key);
  if (!obj) throw new Error("ファイルが見つかりません");

  const meta = await getFileMeta(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath
  );
  const sizeBytes = meta?.sizeBytes ?? obj.size;
  const truncated = sizeBytes > maxBytes;

  const buffer = await obj.arrayBuffer();
  const slice = truncated ? buffer.slice(0, maxBytes) : buffer;

  const mimeType = obj.httpMetadata?.contentType ?? null;
  const isText =
    !mimeType ||
    mimeType.startsWith("text/") ||
    mimeType.includes("json") ||
    mimeType.includes("xml") ||
    mimeType.includes("javascript");

  if (isText) {
    const decoder = new TextDecoder("utf-8");
    return {
      path: logicalPath,
      sizeBytes,
      truncated,
      encoding: "utf-8",
      content: decoder.decode(slice),
      mimeType,
    };
  }

  const bytes = new Uint8Array(slice);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return {
    path: logicalPath,
    sizeBytes,
    truncated,
    encoding: "base64",
    content: btoa(binary),
    mimeType,
  };
}

/** テキストをファイルに書き込む（新規作成または上書き） */
export async function writeStorageFileForRuna(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  content: string,
  overwrite = false
): Promise<WriteFileResult> {
  const parsed = parseLogicalPath(logicalPath);
  if (!parsed || !parsed.relativePath) {
    throw new Error("ファイルパスが不正です");
  }

  const { dir, filename } = parentDirFromFilePath(parsed.relativePath);
  if (!validatePathSegment(filename)) {
    throw new Error("無効なファイル名です");
  }

  const encoder = new TextEncoder();
  const bytes = encoder.encode(content);
  if (bytes.byteLength > RUNA_MAX_WRITE_BYTES) {
    throw new Error(
      `書き込み上限（${Math.round(RUNA_MAX_WRITE_BYTES / 1024)}KB）を超えています`
    );
  }
  if (bytes.byteLength === 0) {
    throw new Error("空の内容は書き込めません");
  }

  const bucket = getFiles(env);
  const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const existingMeta = await getFileMeta(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath
  );
  const existingHead = await bucket.head(r2Key);
  const fileExists = Boolean(existingMeta || existingHead);

  if (fileExists && !overwrite) {
    throw new Error(
      "ファイルが既に存在します。上書きする場合は overwrite=true を指定してください"
    );
  }

  if (fileExists) {
    const auth = await authorizeStoragePath(
      env,
      db,
      user,
      logicalPath,
      "write",
      false
    );
    if (typeof auth === "string") throw new Error(auth);

    const root = await resolveRootForPath(db, parsed.rootType, parsed.rootKey);
    if (!root) throw new Error("ストレージルートが見つかりません");

    const oldSize = existingMeta?.sizeBytes ?? existingHead?.size ?? 0;
    const delta = bytes.byteLength - oldSize;
    if (delta > 0 && !canAllocateBytes(root, delta)) {
      throw new Error("割り当て領域を超えるため書き込めません");
    }

    await bucket.put(r2Key, bytes, {
      httpMetadata: { contentType: "text/plain; charset=utf-8" },
    });

    const perms =
      existingMeta?.permissions ??
      (await resolveEffectivePermissions(
        env,
        parsed.rootType,
        parsed.rootKey,
        parsed.relativePath,
        false
      ));

    const ts = Date.now();
    const meta = existingMeta
      ? {
          ...existingMeta,
          sizeBytes: bytes.byteLength,
          updatedBy: user.username,
          updatedAt: ts,
        }
      : createFileMeta(user.username, bytes.byteLength, perms);

    await writeMetaJson(
      bucket,
      fileMetaKey(parsed.rootType, parsed.rootKey, parsed.relativePath),
      meta
    );

    if (delta > 0) {
      await addUsedBytes(db, root.id, delta);
    } else if (delta < 0) {
      await subtractUsedBytes(db, root.id, -delta);
    }

    try {
      await upsertFileIndex(
        db,
        root.id,
        buildFileIndexEntry(
          parsed.rootType,
          parsed.rootKey,
          parsed.relativePath,
          meta
        )
      );
    } catch (err) {
      console.error("storage file index upsert failed:", err);
    }

    return {
      path: logicalPath,
      sizeBytes: bytes.byteLength,
      created: false,
    };
  }

  const parentPath = buildLogicalPath(parsed.rootType, parsed.rootKey, dir);
  const parentAuth = await authorizeStoragePath(
    env,
    db,
    user,
    parentPath,
    "write",
    true
  );
  if (typeof parentAuth === "string") throw new Error(parentAuth);

  const safeName = sanitizeFilename(filename);
  const init = await initiateStorageUpload(
    env,
    db,
    user,
    parsed.rootType,
    parsed.rootKey,
    dir,
    safeName,
    bytes.byteLength
  );

  if (init.mode !== "simple") {
    throw new Error("大きなファイルは Runa からは書き込めません");
  }

  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
  const result = await simpleStorageUpload(
    env,
    db,
    user,
    init.sessionId,
    arrayBuffer
  );

  return {
    path: result.path,
    sizeBytes: result.size,
    created: true,
  };
}
