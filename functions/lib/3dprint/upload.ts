// functions/api/lib/upload.ts
import { MAX_FILE_SIZE, MULTIPART_THRESHOLD, PART_SIZE } from './constants';
import {
  createUploadSession,
  getUploadSession,
  updateUploadSession,
  type UploadedPart,
} from './reservations';

const ALLOWED_EXTENSIONS = ['.stl', '.gcode', '.gco', '.nc'];

/** Sanitizes a filename for safe R2 storage. */
export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

/** Returns the file extension in lowercase. */
export function getFileExtension(filename: string): string {
  const lower = filename.toLowerCase();
  for (const ext of ALLOWED_EXTENSIONS) {
    if (lower.endsWith(ext)) return ext;
  }
  return '';
}

/** Validates STL or G-code file metadata. */
export function validatePrintFile(filename: string, size: number): string | null {
  if (!getFileExtension(filename)) {
    return 'STL（.stl）またはGコード（.gcode / .gco / .nc）のみアップロードできます';
  }
  if (size <= 0 || size > MAX_FILE_SIZE) {
    return `ファイルサイズは1バイト以上${MAX_FILE_SIZE / (1024 * 1024)}MB以下である必要があります`;
  }
  return null;
}

/** Returns Content-Type for a print file. */
export function getFileContentType(filename: string): string {
  const ext = getFileExtension(filename);
  if (ext === '.stl') return 'model/stl';
  return 'text/plain';
}

/** Generates a unique R2 key for a print file. */
export function generateR2Key(filename: string): string {
  return `3dprint/${crypto.randomUUID()}/${sanitizeFilename(filename)}`;
}

/** Calculates total number of parts for multipart upload. */
export function calculateTotalParts(totalSize: number): number {
  return Math.ceil(totalSize / PART_SIZE);
}

interface UploadEnv {
  DB: D1Database;
  FILES: R2Bucket;
}

/** Initiates upload — returns multipart session info or simple upload key. */
export async function initiateUpload(
  env: UploadEnv,
  filename: string,
  size: number
): Promise<
  | { mode: 'simple'; r2Key: string }
  | { mode: 'multipart'; sessionId: string; r2Key: string; partSize: number; totalParts: number }
> {
  const error = validatePrintFile(filename, size);
  if (error) throw new Error(error);

  const r2Key = generateR2Key(filename);
  const contentType = getFileContentType(filename);

  if (size < MULTIPART_THRESHOLD) {
    return { mode: 'simple', r2Key };
  }

  const multipart = await env.FILES.createMultipartUpload(r2Key, {
    httpMetadata: { contentType },
  });

  const sessionId = crypto.randomUUID();
  await createUploadSession(env.DB, {
    id: sessionId,
    upload_id: multipart.uploadId,
    r2_key: r2Key,
    filename,
    total_size: size,
    part_size: PART_SIZE,
    parts_json: '[]',
    status: 'in_progress',
    created_at: new Date().toISOString(),
  });

  return {
    mode: 'multipart',
    sessionId,
    r2Key,
    partSize: PART_SIZE,
    totalParts: calculateTotalParts(size),
  };
}

/** Uploads a single multipart part. */
export async function uploadPart(
  env: UploadEnv,
  sessionId: string,
  partNumber: number,
  body: ArrayBuffer
): Promise<UploadedPart> {
  const session = await getUploadSession(env.DB, sessionId);
  if (!session || session.status !== 'in_progress') {
    throw new Error('アップロードセッションが見つかりません');
  }

  const multipart = env.FILES.resumeMultipartUpload(session.r2_key, session.upload_id);
  const uploaded = await multipart.uploadPart(partNumber, body);

  const parts: UploadedPart[] = JSON.parse(session.parts_json);
  const filtered = parts.filter((p) => p.partNumber !== partNumber);
  filtered.push({ partNumber: uploaded.partNumber, etag: uploaded.etag });
  filtered.sort((a, b) => a.partNumber - b.partNumber);

  await updateUploadSession(env.DB, sessionId, JSON.stringify(filtered), 'in_progress');

  return { partNumber: uploaded.partNumber, etag: uploaded.etag };
}

/** Completes a multipart upload. */
export async function completeUpload(
  env: UploadEnv,
  sessionId: string
): Promise<{ r2Key: string; filename: string; size: number }> {
  const session = await getUploadSession(env.DB, sessionId);
  if (!session || session.status !== 'in_progress') {
    throw new Error('アップロードセッションが見つかりません');
  }

  const parts: UploadedPart[] = JSON.parse(session.parts_json);
  const expectedParts = calculateTotalParts(session.total_size);
  if (parts.length !== expectedParts) {
    throw new Error(`パート数が不足しています（${parts.length}/${expectedParts}）`);
  }

  const multipart = env.FILES.resumeMultipartUpload(session.r2_key, session.upload_id);
  await multipart.complete(parts);

  await updateUploadSession(env.DB, sessionId, session.parts_json, 'completed');

  return { r2Key: session.r2_key, filename: session.filename, size: session.total_size };
}

/** Aborts a multipart upload. */
export async function abortUpload(env: UploadEnv, sessionId: string): Promise<void> {
  const session = await getUploadSession(env.DB, sessionId);
  if (!session || session.status !== 'in_progress') return;

  const multipart = env.FILES.resumeMultipartUpload(session.r2_key, session.upload_id);
  await multipart.abort();
  await updateUploadSession(env.DB, sessionId, session.parts_json, 'aborted');
}

/** Performs a simple (single-request) upload to R2. */
export async function simpleUpload(
  env: UploadEnv,
  r2Key: string,
  body: ArrayBuffer,
  filename: string
): Promise<{ r2Key: string; filename: string; size: number }> {
  const error = validatePrintFile(filename, body.byteLength);
  if (error) throw new Error(error);

  if (body.byteLength >= MULTIPART_THRESHOLD) {
    throw new Error('20MB以上のファイルはマルチパートアップロードを使用してください');
  }

  await env.FILES.put(r2Key, body, {
    httpMetadata: { contentType: getFileContentType(filename) },
  });

  return { r2Key, filename, size: body.byteLength };
}

/** Verifies that an R2 key exists (for reservation validation). */
export async function verifyR2Key(bucket: R2Bucket, key: string): Promise<boolean> {
  const obj = await bucket.head(key);
  return obj !== null;
}

/** Copies a print file in R2 so a retry reservation owns its own object. */
export async function duplicatePrintFile(
  bucket: R2Bucket,
  sourceKey: string,
  filename: string
): Promise<{ r2Key: string; filename: string; size: number }> {
  const object = await bucket.get(sourceKey);
  if (!object) {
    throw new Error('元のファイルが見つかりません');
  }

  const r2Key = generateR2Key(filename);
  await bucket.put(r2Key, object.body, {
    httpMetadata: object.httpMetadata ?? { contentType: getFileContentType(filename) },
  });

  return { r2Key, filename, size: object.size };
}

/** Streams a print file from R2. */
export async function streamPrintFile(
  bucket: R2Bucket,
  r2Key: string,
  filename: string
): Promise<Response> {
  const obj = await bucket.get(r2Key);
  if (!obj) throw new Error('ファイルが見つかりません');

  return new Response(obj.body, {
    headers: {
      'Content-Type': getFileContentType(filename),
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
