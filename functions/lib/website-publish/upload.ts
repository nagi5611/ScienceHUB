/**
 * ウェブサイト公開 — アップロード
 */

import { getFiles } from "../r2";
import {
  completeMultipartUploadViaS3,
  isR2PresignConfigured,
  presignPutObject,
} from "../r2-presign";
import { createId, now, type Env, type SessionUser } from "../types";
import { PRESIGN_EXPIRES_SEC } from "../storage/constants";
import {
  MULTIPART_LARGE_THRESHOLD,
  MULTIPART_THRESHOLD,
  PART_SIZE_LARGE,
  PART_SIZE_STANDARD,
  PARALLEL_LARGE,
  PARALLEL_STANDARD,
} from "./constants";
import { siteObjectKey } from "./keys";
import {
  addSiteUsedBytes,
  canAllocateSiteBytes,
  type WebSiteRow,
} from "./quota";
import { contentTypeForPath } from "./r2-ops";
import { sanitizeRelativeDir, sanitizeRelativePath } from "./static-policy";

export interface WebUploadedPart {
  partNumber: number;
  etag: string;
}

export interface WebUploadSession {
  id: string;
  user_id: string;
  site_id: string;
  r2_key: string;
  upload_id: string | null;
  filename: string;
  resolved_path: string;
  relative_dir: string;
  replaced_size: number;
  total_size: number;
  part_size: number | null;
  parts_json: string;
  status: string;
  created_at: number;
}

export interface WebUploadPlan {
  partSize: number;
  parallel: number;
  totalParts: number;
  mode: "simple" | "multipart";
  directUpload: boolean;
}

function getUploadPlan(env: Env, size: number): WebUploadPlan {
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

async function getWebUploadSession(
  db: D1Database,
  sessionId: string
): Promise<WebUploadSession | null> {
  return db
    .prepare("SELECT * FROM web_upload_sessions WHERE id = ?")
    .bind(sessionId)
    .first<WebUploadSession>();
}

/** 相対パスを解決（ディレクトリ + ファイル名） */
function resolveRelativeFilePath(relativeDir: string, filename: string): string {
  const safeName = filename.replace(/\\/g, "/").split("/").pop() ?? filename;
  const combined = relativeDir ? `${relativeDir}/${safeName}` : safeName;
  return sanitizeRelativePath(combined);
}

/** アップロード完了後の使用量更新 */
async function finalizeWebUpload(
  env: Env,
  db: D1Database,
  site: WebSiteRow,
  session: WebUploadSession
): Promise<{ path: string; size: number }> {
  const bucket = getFiles(env);
  const head = await bucket.head(session.r2_key);
  const newSize = head?.size ?? session.total_size;
  const delta = newSize - session.replaced_size;

  await db
    .prepare(`UPDATE web_upload_sessions SET status = 'completed' WHERE id = ?`)
    .bind(session.id)
    .run();

  if (delta !== 0) {
    await addSiteUsedBytes(db, site.id, delta);
  }

  return { path: session.resolved_path, size: newSize };
}

/** アップロード初期化 */
export async function initiateWebUpload(
  env: Env,
  db: D1Database,
  user: SessionUser,
  site: WebSiteRow,
  relativeDir: string,
  filename: string,
  size: number
): Promise<
  | {
      mode: "simple";
      sessionId: string;
      resolvedPath: string;
      r2Key: string;
      directUpload: boolean;
    }
  | {
      mode: "multipart";
      sessionId: string;
      resolvedPath: string;
      r2Key: string;
      partSize: number;
      totalParts: number;
      parallel: number;
      directUpload: boolean;
    }
> {
  if (size <= 0) throw new Error("ファイルサイズが不正です");

  const normalizedDir = sanitizeRelativeDir(relativeDir);

  const resolvedPath = resolveRelativeFilePath(normalizedDir, filename);
  const bucket = getFiles(env);
  const r2Key = siteObjectKey(site.dir_name, resolvedPath);
  const existing = await bucket.head(r2Key);
  const replacedSize = existing?.size ?? 0;
  const delta = size - replacedSize;

  if (!canAllocateSiteBytes(site, delta)) {
    throw new Error("サイトの容量上限（5GB）を超えるためアップロードできません");
  }

  const plan = getUploadPlan(env, size);
  const sessionId = createId("wupl");
  const ts = now();

  if (plan.mode === "simple") {
    await db
      .prepare(
        `INSERT INTO web_upload_sessions
         (id, user_id, site_id, r2_key, upload_id, filename, resolved_path, relative_dir, replaced_size, total_size, part_size, parts_json, status, created_at)
         VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, NULL, '[]', 'in_progress', ?)`
      )
      .bind(
        sessionId,
        user.id,
        site.id,
        r2Key,
        filename,
        resolvedPath,
        normalizedDir,
        replacedSize,
        size,
        ts
      )
      .run();

    return {
      mode: "simple",
      sessionId,
      resolvedPath,
      r2Key,
      directUpload: plan.directUpload,
    };
  }

  const multipart = await bucket.createMultipartUpload(r2Key, {
    httpMetadata: { contentType: contentTypeForPath(resolvedPath) },
  });

  await db
    .prepare(
      `INSERT INTO web_upload_sessions
       (id, user_id, site_id, r2_key, upload_id, filename, resolved_path, relative_dir, replaced_size, total_size, part_size, parts_json, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', 'in_progress', ?)`
    )
    .bind(
      sessionId,
      user.id,
      site.id,
      r2Key,
      multipart.uploadId,
      filename,
      resolvedPath,
      normalizedDir,
      replacedSize,
      size,
      plan.partSize,
      ts
    )
    .run();

  return {
    mode: "multipart",
    sessionId,
    resolvedPath,
    r2Key,
    partSize: plan.partSize,
    totalParts: plan.totalParts,
    parallel: plan.parallel,
    directUpload: plan.directUpload,
  };
}

/** presigned PUT URL（単発） */
export async function getWebSimpleUploadUrl(
  env: Env,
  db: D1Database,
  userId: string,
  sessionId: string
): Promise<{ url: string; expiresIn: number }> {
  const session = await getWebUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress" || session.user_id !== userId) {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.upload_id) {
    throw new Error("このセッションはマルチパート用です");
  }

  const url = await presignPutObject(env, session.r2_key);
  return { url, expiresIn: PRESIGN_EXPIRES_SEC };
}

/** presigned PUT URL（マルチパートパート） */
export async function getWebPartUploadUrl(
  env: Env,
  db: D1Database,
  userId: string,
  sessionId: string,
  partNumber: number
): Promise<{ url: string; expiresIn: number }> {
  const session = await getWebUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress" || session.user_id !== userId) {
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

/** Worker 経由の単発アップロード */
export async function simpleWebUpload(
  env: Env,
  db: D1Database,
  user: SessionUser,
  site: WebSiteRow,
  sessionId: string,
  body: ArrayBuffer | ReadableStream
): Promise<{ path: string; size: number }> {
  const session = await getWebUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress" || session.user_id !== user.id) {
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
    httpMetadata: { contentType: contentTypeForPath(session.resolved_path) },
  });

  if (!(body instanceof ArrayBuffer)) {
    const head = await bucket.head(session.r2_key);
    if (!head || head.size !== session.total_size) {
      throw new Error("ファイルサイズが一致しません");
    }
  }

  return finalizeWebUpload(env, db, site, session);
}

/** マルチパート完了 */
export async function completeWebUpload(
  env: Env,
  db: D1Database,
  user: SessionUser,
  site: WebSiteRow,
  sessionId: string,
  partsFromClient?: WebUploadedPart[],
  directUpload = false
): Promise<{ path: string; size: number }> {
  const session = await getWebUploadSession(db, sessionId);
  if (!session || session.status !== "in_progress" || session.user_id !== user.id) {
    throw new Error("アップロードセッションが見つかりません");
  }

  if (!session.upload_id || !session.part_size) {
    const bucket = getFiles(env);
    const head = await bucket.head(session.r2_key);
    if (!head) throw new Error("アップロードされたファイルが見つかりません");
    if (head.size !== session.total_size) {
      throw new Error("ファイルサイズが一致しません");
    }
    return finalizeWebUpload(env, db, site, session);
  }

  const expectedParts = Math.ceil(session.total_size / session.part_size);
  let parts: WebUploadedPart[];

  if (partsFromClient && partsFromClient.length > 0) {
    parts = [...partsFromClient].sort((a, b) => a.partNumber - b.partNumber);
  } else {
    parts = JSON.parse(session.parts_json) as WebUploadedPart[];
    parts.sort((a, b) => a.partNumber - b.partNumber);
  }

  if (parts.length !== expectedParts) {
    throw new Error(`パート数が不足しています（${parts.length}/${expectedParts}）`);
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

  return finalizeWebUpload(env, db, site, session);
}

/** アップロード中止 */
export async function abortWebUpload(
  env: Env,
  db: D1Database,
  userId: string,
  sessionId: string
): Promise<void> {
  const session = await getWebUploadSession(db, sessionId);
  if (!session || session.user_id !== userId) {
    throw new Error("アップロードセッションが見つかりません");
  }
  if (session.status !== "in_progress") return;

  const bucket = getFiles(env);
  if (session.upload_id) {
    const multipart = bucket.resumeMultipartUpload(session.r2_key, session.upload_id);
    await multipart.abort();
  } else {
    await bucket.delete(session.r2_key);
  }

  await db
    .prepare(`UPDATE web_upload_sessions SET status = 'aborted' WHERE id = ?`)
    .bind(sessionId)
    .run();
}

/** サイト内ファイル削除 */
export async function deleteWebSiteFile(
  env: Env,
  db: D1Database,
  site: WebSiteRow,
  relativePath: string
): Promise<void> {
  const safePath = sanitizeRelativePath(relativePath);
  const bucket = getFiles(env);
  const r2Key = siteObjectKey(site.dir_name, safePath);
  const head = await bucket.head(r2Key);
  if (!head) throw new Error("ファイルが見つかりません");

  await bucket.delete(r2Key);
  await addSiteUsedBytes(db, site.id, -head.size);
}
