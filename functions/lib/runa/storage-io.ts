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
export const RUNA_READ_LINE_LIMIT_DEFAULT = 200;
export const RUNA_READ_LINE_LIMIT_MAX = 500;
export const RUNA_GREP_MAX_MATCHES_DEFAULT = 80;
export const RUNA_GREP_MAX_SCAN_BYTES = 4 * 1024 * 1024;
export const RUNA_PROBE_PREVIEW_LINES = 8;
export const RUNA_PROBE_SAMPLE_BYTES = 64 * 1024;

const READ_CHUNK_BYTES = 64 * 1024;
const SMALL_FILE_BYTES = 512 * 1024;
const SMALL_FILE_LINES = 500;

export interface ReadFileOptions {
  maxBytes?: number;
  offsetBytes?: number;
  lineStart?: number;
  lineLimit?: number;
  grep?: string;
  grepMaxMatches?: number;
  grepMaxScanBytes?: number;
}

export interface ReadFileResult {
  path: string;
  sizeBytes: number;
  truncated: boolean;
  encoding: "utf-8" | "base64";
  content: string;
  mimeType: string | null;
  readMode?: "full" | "lines" | "grep" | "offset";
  lineRange?: { start: number; end: number };
  grepMatchCount?: number;
  scannedBytes?: number;
}

export type FileSizeCategory = "small" | "medium" | "large" | "huge";

export interface FileProbeResult {
  path: string;
  name: string;
  sizeBytes: number;
  kind: "text" | "image" | "binary";
  mimeType: string | null;
  encoding: "utf-8" | "binary";
  estimatedLines: number | null;
  previewLines: string[];
  sizeCategory: FileSizeCategory;
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

function normalizeReadOptions(input?: ReadFileOptions | number): ReadFileOptions {
  if (typeof input === "number") return { maxBytes: input };
  return input ?? {};
}

function isTextLikeFile(mimeType: string | null, filename: string): boolean {
  if (
    mimeType &&
    (mimeType.startsWith("text/") ||
      mimeType.includes("json") ||
      mimeType.includes("xml") ||
      mimeType.includes("javascript"))
  ) {
    return true;
  }
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return [
    "txt",
    "md",
    "markdown",
    "json",
    "csv",
    "tsv",
    "xml",
    "html",
    "htm",
    "css",
    "js",
    "mjs",
    "cjs",
    "ts",
    "tsx",
    "jsx",
    "py",
    "java",
    "go",
    "rs",
    "yaml",
    "yml",
    "toml",
    "ini",
    "log",
    "sql",
    "sh",
    "bat",
    "ps1",
    "env",
    "vue",
    "svelte",
  ].includes(ext);
}

function isImageLikeFile(mimeType: string | null, filename: string): boolean {
  if (mimeType?.startsWith("image/")) return true;
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ["png", "jpg", "jpeg", "gif", "webp", "bmp", "avif", "svg"].includes(ext);
}

function classifyFileSize(sizeBytes: number, estimatedLines: number | null): FileSizeCategory {
  if (sizeBytes <= SMALL_FILE_BYTES && (estimatedLines ?? 0) <= SMALL_FILE_LINES) {
    return "small";
  }
  if (sizeBytes <= 2 * 1024 * 1024 && (estimatedLines ?? 0) <= 2000) {
    return "medium";
  }
  if (sizeBytes <= 10 * 1024 * 1024) return "large";
  return "huge";
}

function estimateLinesFromSample(sampleText: string, sampleBytes: number, totalBytes: number): number | null {
  if (sampleBytes <= 0 || totalBytes <= 0) return null;
  const linesInSample = sampleText.split("\n").length;
  if (linesInSample <= 1 && totalBytes > sampleBytes) return null;
  return Math.max(1, Math.round((linesInSample * totalBytes) / sampleBytes));
}

function splitChunkLines(chunkText: string, isLast: boolean): {
  lines: string[];
  carry: string;
} {
  if (isLast) return { lines: chunkText.split("\n"), carry: "" };
  const lastNl = chunkText.lastIndexOf("\n");
  if (lastNl === -1) return { lines: [], carry: chunkText };
  return {
    lines: chunkText.slice(0, lastNl + 1).split("\n"),
    carry: chunkText.slice(lastNl + 1),
  };
}

async function readR2Range(
  bucket: R2Bucket,
  r2Key: string,
  offset: number,
  length: number
): Promise<ArrayBuffer> {
  if (length <= 0) return new ArrayBuffer(0);
  const obj = await bucket.get(r2Key, { range: { offset, length } });
  if (!obj) throw new Error("ファイルが見つかりません");
  return obj.arrayBuffer();
}

async function readTextLineRange(
  bucket: R2Bucket,
  r2Key: string,
  sizeBytes: number,
  lineStart: number,
  lineLimit: number,
  maxScanBytes: number
): Promise<{
  content: string;
  lineRange: { start: number; end: number };
  scannedBytes: number;
  truncated: boolean;
}> {
  const startLine = Math.max(1, Math.floor(lineStart));
  const limit = Math.min(
    RUNA_READ_LINE_LIMIT_MAX,
    Math.max(1, Math.floor(lineLimit))
  );
  let lineNumber = 0;
  const collected: string[] = [];
  let carry = "";
  let scanned = 0;
  let offset = 0;

  while (offset < sizeBytes && scanned < maxScanBytes) {
    const length = Math.min(READ_CHUNK_BYTES, sizeBytes - offset);
    const buffer = await readR2Range(bucket, r2Key, offset, length);
    scanned += length;
    offset += length;

    const chunkText = carry + new TextDecoder("utf-8").decode(new Uint8Array(buffer));
    const { lines, carry: nextCarry } = splitChunkLines(chunkText, offset >= sizeBytes);
    carry = nextCarry;

    for (const line of lines) {
      lineNumber += 1;
      if (lineNumber < startLine) continue;
      collected.push(line);
      if (collected.length >= limit) {
        return {
          content: collected.join("\n"),
          lineRange: {
            start: startLine,
            end: startLine + collected.length - 1,
          },
          scannedBytes: scanned,
          truncated: offset < sizeBytes,
        };
      }
    }
  }

  if (carry && collected.length < limit) {
    lineNumber += 1;
    if (lineNumber >= startLine) collected.push(carry);
  }

  return {
    content: collected.join("\n"),
    lineRange: {
      start: startLine,
      end: startLine + Math.max(0, collected.length - 1),
    },
    scannedBytes: scanned,
    truncated: offset < sizeBytes || scanned >= maxScanBytes,
  };
}

async function grepTextFile(
  bucket: R2Bucket,
  r2Key: string,
  sizeBytes: number,
  pattern: string,
  maxMatches: number,
  maxScanBytes: number
): Promise<{
  content: string;
  matchCount: number;
  scannedBytes: number;
  truncated: boolean;
}> {
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, "i");
  } catch {
    throw new Error("grep の正規表現が不正です");
  }

  let lineNumber = 0;
  const matches: string[] = [];
  let carry = "";
  let scanned = 0;
  let offset = 0;

  while (offset < sizeBytes && scanned < maxScanBytes && matches.length < maxMatches) {
    const length = Math.min(READ_CHUNK_BYTES, sizeBytes - offset);
    const buffer = await readR2Range(bucket, r2Key, offset, length);
    scanned += length;
    offset += length;

    const chunkText = carry + new TextDecoder("utf-8").decode(new Uint8Array(buffer));
    const { lines, carry: nextCarry } = splitChunkLines(chunkText, offset >= sizeBytes);
    carry = nextCarry;

    for (const line of lines) {
      lineNumber += 1;
      if (!regex.test(line)) continue;
      matches.push(`${lineNumber}: ${line}`);
      if (matches.length >= maxMatches) break;
    }
  }

  if (carry && matches.length < maxMatches) {
    lineNumber += 1;
    if (regex.test(carry)) matches.push(`${lineNumber}: ${carry}`);
  }

  return {
    content: matches.join("\n"),
    matchCount: matches.length,
    scannedBytes: scanned,
    truncated:
      offset < sizeBytes ||
      scanned >= maxScanBytes ||
      matches.length >= maxMatches,
  };
}

/** Runa 向けにファイル概要（Probe）を返す */
export async function probeStorageFileForRuna(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string
): Promise<FileProbeResult> {
  const parsed = parseLogicalPath(logicalPath);
  if (!parsed?.relativePath) throw new Error("ファイルパスが不正です");

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
  const head = await bucket.head(r2Key);
  if (!head) throw new Error("ファイルが見つかりません");

  const meta = await getFileMeta(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath
  );
  const sizeBytes = meta?.sizeBytes ?? head.size;
  const mimeType = head.httpMetadata?.contentType ?? null;
  const name = parsed.relativePath.split("/").pop() ?? logicalPath;

  if (isImageLikeFile(mimeType, name)) {
    return {
      path: logicalPath,
      name,
      sizeBytes,
      kind: "image",
      mimeType,
      encoding: "binary",
      estimatedLines: null,
      previewLines: [],
      sizeCategory: classifyFileSize(sizeBytes, null),
    };
  }

  if (!isTextLikeFile(mimeType, name)) {
    return {
      path: logicalPath,
      name,
      sizeBytes,
      kind: "binary",
      mimeType,
      encoding: "binary",
      estimatedLines: null,
      previewLines: [],
      sizeCategory: classifyFileSize(sizeBytes, null),
    };
  }

  const sampleLen = Math.min(RUNA_PROBE_SAMPLE_BYTES, sizeBytes);
  const sampleBuf =
    sampleLen > 0 ? await readR2Range(bucket, r2Key, 0, sampleLen) : new ArrayBuffer(0);
  const sampleText = new TextDecoder("utf-8").decode(new Uint8Array(sampleBuf));
  const previewLines = sampleText.split("\n").slice(0, RUNA_PROBE_PREVIEW_LINES);
  const estimatedLines = estimateLinesFromSample(sampleText, sampleLen, sizeBytes);

  return {
    path: logicalPath,
    name,
    sizeBytes,
    kind: "text",
    mimeType,
    encoding: "utf-8",
    estimatedLines,
    previewLines,
    sizeCategory: classifyFileSize(sizeBytes, estimatedLines),
  };
}

/** Probe 結果を Runa の tool/user メッセージ向けに整形 */
export function formatFileProbeForRuna(probe: FileProbeResult): string {
  const sizeKb = Math.round(probe.sizeBytes / 1024);
  const linesPart =
    probe.estimatedLines != null
      ? `推定 ${probe.estimatedLines.toLocaleString("ja-JP")} 行`
      : "行数不明";
  const lines: string[] = [
    `ファイル: \`${probe.path}\``,
    `種別: ${probe.kind} / サイズ: ${sizeKb} KB / ${linesPart} / 分類: ${probe.sizeCategory}`,
  ];
  if (probe.mimeType) lines.push(`MIME: ${probe.mimeType}`);
  if (probe.kind === "text" && probe.previewLines.length) {
    lines.push("", "先頭プレビュー:");
    for (let i = 0; i < probe.previewLines.length; i += 1) {
      lines.push(`${i + 1}: ${probe.previewLines[i]}`);
    }
  }
  if (probe.kind === "image") {
    lines.push("画像ファイル（vision 参照可）");
  }
  if (probe.kind === "binary") {
    lines.push("バイナリ（テキスト読み取り不可）");
  }
  return lines.join("\n");
}

/** テキストファイルを読み込む（行範囲・grep 対応） */
export async function readStorageFileForRuna(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  options?: ReadFileOptions | number
): Promise<ReadFileResult> {
  const opts = normalizeReadOptions(options);
  const maxBytes = Math.min(
    1024 * 1024,
    Math.max(1, opts.maxBytes ?? RUNA_MAX_READ_BYTES)
  );
  const offsetBytes = Math.max(0, Math.floor(opts.offsetBytes ?? 0));
  const lineStart = opts.lineStart;
  const lineLimit = Math.min(
    RUNA_READ_LINE_LIMIT_MAX,
    Math.max(1, Math.floor(opts.lineLimit ?? RUNA_READ_LINE_LIMIT_DEFAULT))
  );
  const grepPattern = opts.grep?.trim();
  const grepMaxMatches = Math.min(
    200,
    Math.max(1, Math.floor(opts.grepMaxMatches ?? RUNA_GREP_MAX_MATCHES_DEFAULT))
  );
  const grepMaxScanBytes = Math.min(
    8 * 1024 * 1024,
    Math.max(READ_CHUNK_BYTES, opts.grepMaxScanBytes ?? RUNA_GREP_MAX_SCAN_BYTES)
  );

  const parsed = parseLogicalPath(logicalPath);
  if (!parsed?.relativePath) throw new Error("ファイルパスが不正です");

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
  const head = await bucket.head(r2Key);
  if (!head) throw new Error("ファイルが見つかりません");

  const meta = await getFileMeta(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath
  );
  const sizeBytes = meta?.sizeBytes ?? head.size;
  const mimeType = head.httpMetadata?.contentType ?? null;
  const filename = parsed.relativePath.split("/").pop() ?? logicalPath;
  const isText = isTextLikeFile(mimeType, filename);

  if (grepPattern && isText) {
    const grepResult = await grepTextFile(
      bucket,
      r2Key,
      sizeBytes,
      grepPattern,
      grepMaxMatches,
      grepMaxScanBytes
    );
    return {
      path: logicalPath,
      sizeBytes,
      truncated: grepResult.truncated,
      encoding: "utf-8",
      content: grepResult.content || "（一致なし）",
      mimeType,
      readMode: "grep",
      grepMatchCount: grepResult.matchCount,
      scannedBytes: grepResult.scannedBytes,
    };
  }

  if (lineStart != null && isText) {
    const lineResult = await readTextLineRange(
      bucket,
      r2Key,
      sizeBytes,
      lineStart,
      lineLimit,
      Math.max(maxBytes, grepMaxScanBytes)
    );
    return {
      path: logicalPath,
      sizeBytes,
      truncated: lineResult.truncated,
      encoding: "utf-8",
      content: lineResult.content,
      mimeType,
      readMode: "lines",
      lineRange: lineResult.lineRange,
      scannedBytes: lineResult.scannedBytes,
    };
  }

  const readLength = Math.min(maxBytes, Math.max(0, sizeBytes - offsetBytes));
  const truncated = offsetBytes + readLength < sizeBytes;
  const buffer =
    readLength > 0
      ? await readR2Range(bucket, r2Key, offsetBytes, readLength)
      : new ArrayBuffer(0);

  if (isText) {
    return {
      path: logicalPath,
      sizeBytes,
      truncated,
      encoding: "utf-8",
      content: new TextDecoder("utf-8").decode(new Uint8Array(buffer)),
      mimeType,
      readMode: offsetBytes > 0 ? "offset" : "full",
      scannedBytes: readLength,
    };
  }

  const bytes = new Uint8Array(buffer);
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
    readMode: offsetBytes > 0 ? "offset" : "full",
    scannedBytes: readLength,
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
