/**
 * クラウドストレージアップロード
 */

import { createId, now } from "../types";
import { getFiles } from "../r2";
import { isR2PresignConfigured, presignGetObject, presignPutObject, completeMultipartUploadViaS3 } from "../r2-presign";
import type { Env } from "../types";
import {
  MULTIPART_LARGE_THRESHOLD,
  MULTIPART_THRESHOLD,
  PART_SIZE_LARGE,
  PART_SIZE_STANDARD,
  PARALLEL_LARGE,
  PARALLEL_STANDARD,
  PRESIGN_EXPIRES_SEC,
} from "./constants";
import {
  buildAutoRenameName,
  dirListPrefix,
  fileMetaKey,
  sanitizeFilename,
  toR2Key,
  type StorageRootType,
} from "./keys";
import {
  createFileMeta,
  resolveEffectivePermissions,
  writeMetaJson,
} from "./meta";
import {
  addUsedBytes,
  canAllocateBytes,
  type StorageRootRow,
} from "./quota";
import { resolveRootForPath } from "./roots";
import { authorizeWriteDir } from "./permissions";
import type { SessionUser } from "../types";

export interface UploadedPart {
  partNumber: number;
  etag: string;
}

export interface StorageUploadSession {
  id: string;
  user_id: string;
  root_id: string;
  r2_key: string;
  upload_id: string | null;
  filename: string;
  resolved_filename: string;
  logical_dir: string;
  total_size: number;
  part_size: number | null;
  parts_json: string;
  status: string;
  created_at: number;
}

export interface UploadPlan {
  partSize: number;
  parallel: number;
  totalParts: number;
  mode: "simple" | "multipart";
  directUpload: boolean;
}

/** ファイルサイズに応じたアップロード計画 */
export function getUploadPlan(env: Env, size: number): UploadPlan {
  const directUpload = isR2PresignConfigured(env);

  if (size <= MULTIPART_THRESHOLD) {
    return {
      partSize: size,
      parallel: 1,
      totalParts: 1,
      mode: "simple",
      directUpload,
    };
  }

  if (size <= MULTIPART_LARGE_THRESHOLD) {
    const partSize = PART_SIZE_STANDARD;
    return {
      partSize,
      parallel: PARALLEL_STANDARD,
      totalParts: Math.ceil(size / partSize),
      mode: "multipart",
      directUpload,
    };
  }

  const partSize = PART_SIZE_LARGE;
  return {
    partSize,
    parallel: PARALLEL_LARGE,
    totalParts: Math.ceil(size / partSize),
    mode: "multipart",
    directUpload,
  };
}

async function getUploadSession(
  db: D1Database,
  sessionId: string
): Promise<StorageUploadSession | null> {
  return db
    .prepare("SELECT * FROM storage_upload_sessions WHERE id = ?")
    .bind(sessionId)
    .first<StorageUploadSession>();
}

async function updateUploadSession(
  db: D1Database,
  sessionId: string,
  partsJson: string,
  status: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE storage_upload_sessions SET parts_json = ?, status = ? WHERE id = ?`
    )
    .bind(partsJson, status, sessionId)
    .run();
}

/** ディレクトリ内の既存ファイル名一覧 */
async function listExistingFilenames(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string
): Promise<Set<string>> {
  const bucket = getFiles(env);
  const prefix = dirListPrefix(rootType, rootKey, relativeDir);
  const listed = await bucket.list({ prefix, delimiter: "/" });
  const names = new Set<string>();

  for (const obj of listed.objects) {
    const suffix = obj.key.slice(prefix.length);
    if (!suffix || suffix.includes("/")) continue;
    if (suffix.endsWith(".meta") || suffix === "__folder.meta") continue;
    names.add(suffix);
  }

  return names;
}

/** 自動リネーム後のファイル名を決定 */
export async function resolveUniqueFilename(
  env: Env,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string,
  filename: string
): Promise<string> {
  const safe = sanitizeFilename(filename);
  const existing = await listExistingFilenames(env, rootType, rootKey, relativeDir);
  if (!existing.has(safe)) return safe;

  let index = 1;
  while (index < 10000) {
    const candidate = buildAutoRenameName(safe, index);
    if (!existing.has(candidate)) return candidate;
    index++;
  }

  throw new Error("同名ファイルが多すぎます");
}

/** アップロードを初期化 */
export async function initiateStorageUpload(
  env: Env,
  db: D1Database,
  user: SessionUser,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string,
  filename: string,
  size: number
): Promise<
  | {
      mode: "simple";
      sessionId: string;
      resolvedFilename: string;
      r2Key: string;
      directUpload: boolean;
    }
  | {
      mode: "multipart";
      sessionId: string;
      resolvedFilename: string;
      r2Key: string;
      partSize: number;
      totalParts: number;
      parallel: number;
      directUpload: boolean;
    }
> {
  if (size <= 0) throw new Error("ファイルサイズが不正です");

  const canWrite = await authorizeWriteDir(
    env,
    db,
    user,
    rootType,
    rootKey,
    relativeDir
  );
  if (!canWrite) throw new Error("アップロードする権限がありません");

  const root = await resolveRootForPath(db, rootType, rootKey);
  if (!root) throw new Error("ストレージルートが見つかりません");

  if (!canAllocateBytes(root, size)) {
    throw new Error("割り当て領域を超えるためアップロードできません");
  }

  const resolvedFilename = await resolveUniqueFilename(
    env,
    rootType,
    rootKey,
    relativeDir,
    filename
  );

  const relativeFilePath = relativeDir
    ? `${relativeDir}/${resolvedFilename}`
    : resolvedFilename;
  const r2Key = toR2Key(rootType, rootKey, relativeFilePath);
  const plan = getUploadPlan(env, size);
  const sessionId = createId("supl");
  const ts = now();

  if (plan.mode === "simple") {
    await db
      .prepare(
        `INSERT INTO storage_upload_sessions
         (id, user_id, root_id, r2_key, upload_id, filename, resolved_filename, logical_dir, total_size, part_size, parts_json, status, created_at)
         VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, NULL, '[]', 'in_progress', ?)`
      )
      .bind(
        sessionId,
        user.id,
        root.id,
        r2Key,
        filename,
        resolvedFilename,
        relativeDir,
        size,
        ts
      )
      .run();

    return {
      mode: "simple",
      sessionId,
      resolvedFilename,
      r2Key,
      directUpload: plan.directUpload,
    };
  }

  const bucket = getFiles(env);
  const multipart = await bucket.createMultipartUpload(r2Key, {
    httpMetadata: { contentType: "application/octet-stream" },
  });

  await db
    .prepare(
      `INSERT INTO storage_upload_sessions
       (id, user_id, root_id, r2_key, upload_id, filename, resolved_filename, logical_dir, total_size, part_size, parts_json, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', 'in_progress', ?)`
    )
    .bind(
      sessionId,
      user.id,
      root.id,
      r2Key,
      multipart.uploadId,
      filename,
      resolvedFilename,
      relativeDir,
      size,
      plan.partSize,
      ts
    )
    .run();

  return {
    mode: "multipart",
    sessionId,
    resolvedFilename,
    r2Key,
    partSize: plan.partSize,
    totalParts: plan.totalParts,
    parallel: plan.parallel,
    directUpload: plan.directUpload,
  };
}

/** 単発アップロード用 presigned PUT URL */
export async function getSimpleUploadPresignedUrl(
  env: Env,
  db: D1Database,
  userId: string,
  sessionId: string
): Promise<{ url: string; expiresIn: number }> {
  const session = await getUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress") {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.user_id !== userId) {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.upload_id) {
    throw new Error("このセッションはマルチパート用です");
  }

  const url = await presignPutObject(env, session.r2_key);
  return { url, expiresIn: PRESIGN_EXPIRES_SEC };
}

/** マルチパートのパート用 presigned PUT URL */
export async function getPartUploadPresignedUrl(
  env: Env,
  db: D1Database,
  userId: string,
  sessionId: string,
  partNumber: number
): Promise<{ url: string; expiresIn: number }> {
  const session = await getUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress") {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.user_id !== userId) {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (!session.upload_id || !session.part_size) {
    throw new Error("このセッションはマルチパートではありません");
  }

  const expectedParts = Math.ceil(session.total_size / session.part_size);
  if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > expectedParts) {
    throw new Error("partNumber が不正です");
  }

  const url = await presignPutObject(env, session.r2_key, {
    query: {
      partNumber: String(partNumber),
      uploadId: session.upload_id,
    },
  });
  return { url, expiresIn: PRESIGN_EXPIRES_SEC };
}

/** ダウンロード用 presigned GET URL */
export async function getStorageDownloadPresignedUrl(
  env: Env,
  r2Key: string,
  filename: string
): Promise<{ url: string; filename: string; expiresIn: number }> {
  const url = await presignGetObject(env, r2Key);
  return { url, filename, expiresIn: PRESIGN_EXPIRES_SEC };
}

/** マルチパートのパートをアップロード（Worker プロキシ・フォールバック） */
export async function uploadStoragePart(
  env: Env,
  _db: D1Database,
  userId: string,
  sessionId: string,
  partNumber: number,
  body: ArrayBuffer | ReadableStream
): Promise<UploadedPart> {
  const session = await getUploadSession(_db, sessionId);
  if (!session || session.status !== "in_progress") {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.user_id !== userId) {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (!session.upload_id) {
    throw new Error("このセッションはマルチパートではありません");
  }

  const bucket = getFiles(env);
  const multipart = bucket.resumeMultipartUpload(session.r2_key, session.upload_id);
  const uploaded = await multipart.uploadPart(partNumber, body);

  return { partNumber: uploaded.partNumber, etag: uploaded.etag };
}

/** 単発アップロード（Worker プロキシ・フォールバック） */
export async function simpleStorageUpload(
  env: Env,
  db: D1Database,
  user: SessionUser,
  sessionId: string,
  body: ArrayBuffer | ReadableStream
): Promise<{ path: string; size: number }> {
  const session = await getUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress") {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.user_id !== user.id) {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.upload_id) {
    throw new Error("このセッションはマルチパート用です");
  }
  if (body instanceof ArrayBuffer && body.byteLength !== session.total_size) {
    throw new Error("ファイルサイズが一致しません");
  }

  const bucket = getFiles(env);
  await bucket.put(session.r2_key, body, {
    httpMetadata: { contentType: "application/octet-stream" },
  });

  if (!(body instanceof ArrayBuffer)) {
    const head = await bucket.head(session.r2_key);
    if (!head || head.size !== session.total_size) {
      throw new Error("ファイルサイズが一致しません");
    }
  }

  return finalizeUpload(env, db, user, session, session.total_size);
}

/** マルチパート完了（直アップロード時はクライアントから parts を受け取る） */
export async function completeStorageUpload(
  env: Env,
  db: D1Database,
  user: SessionUser,
  sessionId: string,
  partsFromClient?: UploadedPart[],
  directUpload = false
): Promise<{ path: string; size: number }> {
  const session = await getUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress") {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.user_id !== user.id) {
    throw new Error("アップロードセッションが見つかりません");
  }

  if (!session.upload_id || !session.part_size) {
    const bucket = getFiles(env);
    const head = await bucket.head(session.r2_key);
    if (!head) {
      throw new Error("アップロードされたファイルが見つかりません");
    }
    if (head.size !== session.total_size) {
      throw new Error("ファイルサイズが一致しません");
    }
    return finalizeUpload(env, db, user, session, session.total_size);
  }

  const expectedParts = Math.ceil(session.total_size / session.part_size);
  let parts: UploadedPart[];

  if (partsFromClient && partsFromClient.length > 0) {
    parts = [...partsFromClient].sort((a, b) => a.partNumber - b.partNumber);
  } else {
    parts = JSON.parse(session.parts_json) as UploadedPart[];
    parts.sort((a, b) => a.partNumber - b.partNumber);
  }

  if (parts.length !== expectedParts) {
    throw new Error(`パート数が不足しています（${parts.length}/${expectedParts}）`);
  }

  for (let i = 0; i < parts.length; i++) {
    if (parts[i]?.partNumber !== i + 1) {
      throw new Error("パート番号が不正です");
    }
  }

  const bucket = getFiles(env);

  if (directUpload && isR2PresignConfigured(env)) {
    await completeMultipartUploadViaS3(
      env,
      session.r2_key,
      session.upload_id,
      parts
    );
  } else {
    const multipart = bucket.resumeMultipartUpload(session.r2_key, session.upload_id);
    await multipart.complete(parts);
  }

  return finalizeUpload(env, db, user, session, session.total_size, parts);
}

/** アップロード中止 */
export async function abortStorageUpload(
  env: Env,
  db: D1Database,
  userId: string,
  sessionId: string
): Promise<void> {
  const session = await getUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress") return;
  if (session.user_id !== userId) return;

  const bucket = getFiles(env);
  if (session.upload_id) {
    const multipart = bucket.resumeMultipartUpload(session.r2_key, session.upload_id);
    await multipart.abort();
  } else {
    await bucket.delete(session.r2_key);
  }

  await updateUploadSession(db, sessionId, session.parts_json, "aborted");
}

async function finalizeUpload(
  env: Env,
  db: D1Database,
  user: SessionUser,
  session: StorageUploadSession,
  size: number,
  partsJson?: UploadedPart[]
): Promise<{ path: string; size: number }> {
  const root = await db
    .prepare("SELECT * FROM storage_roots WHERE id = ?")
    .bind(session.root_id)
    .first<StorageRootRow>();
  if (!root) throw new Error("ストレージルートが見つかりません");

  const rootRow = await db
    .prepare(
      root.root_type === "user"
        ? `SELECT u.username AS key FROM users u WHERE u.id = ?`
        : `SELECT hg.slug AS key FROM hub_groups hg WHERE hg.id = ?`
    )
    .bind(root.root_type === "user" ? root.user_id : root.group_id)
    .first<{ key: string }>();

  if (!rootRow) throw new Error("ストレージルートが見つかりません");

  const rootType = root.root_type;
  const rootKey = rootRow.key;
  const relativeFilePath = session.logical_dir
    ? `${session.logical_dir}/${session.resolved_filename}`
    : session.resolved_filename;

  const perms = await resolveEffectivePermissions(
    env,
    rootType,
    rootKey,
    relativeFilePath,
    false
  );

  const meta = createFileMeta(user.username, size, perms);
  const bucket = getFiles(env);
  await writeMetaJson(
    bucket,
    fileMetaKey(rootType, rootKey, relativeFilePath),
    meta
  );

  await addUsedBytes(db, root.id, size);
  const partsStored = partsJson
    ? JSON.stringify(partsJson)
    : session.parts_json;
  await updateUploadSession(db, session.id, partsStored, "completed");

  const prefix = rootType === "user" ? "u" : "g";
  const path = session.logical_dir
    ? `${prefix}/${rootKey}/${relativeFilePath}`
    : `${prefix}/${rootKey}/${session.resolved_filename}`;

  return { path, size };
}
