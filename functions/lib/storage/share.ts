/**
 * クラウドストレージ共有リンク
 */

import { getFiles } from "../r2";
import type { Env } from "../types";
import type { SessionUser } from "../types";
import {
  SHARE_DOWNLOAD_DEFAULT,
  SHARE_DOWNLOAD_MAX,
  SHARE_DOWNLOAD_MIN,
} from "./constants";
import { parseLogicalPath, toR2Key } from "./keys";
import { getFileMeta } from "./meta";
import { authorizeStoragePath } from "./permissions";
import { streamStorageFile } from "./operations";

interface ShareLinkRow {
  id: string;
  token: string;
  max_downloads: number;
  download_count: number;
  revoked_at: number | null;
  created_at: number;
}

interface ShareFileRow {
  id: string;
  storage_path: string;
  filename: string;
  size_bytes: number;
}

export interface ShareFileInfo {
  id: string;
  filename: string;
  size_bytes: number;
}

export interface ShareLinkInfo {
  files: ShareFileInfo[];
  max_downloads: number;
  download_count: number;
  remaining_downloads: number;
  downloads_exhausted: boolean;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/** 共有リンク用の URL セーフなトークンを生成 */
function generateShareToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

/** ダウンロード回数上限を正規化 */
export function normalizeShareMaxDownloads(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return SHARE_DOWNLOAD_DEFAULT;
  return Math.min(
    SHARE_DOWNLOAD_MAX,
    Math.max(SHARE_DOWNLOAD_MIN, Math.floor(parsed))
  );
}

/** 共有リンクの公開 URL を組み立て */
export function buildSharePageUrl(request: Request, token: string): string {
  const origin = new URL(request.url).origin;
  return `${origin}/share/?t=${encodeURIComponent(token)}`;
}

/** 共有リンクを作成 */
export async function createStorageShareLink(
  env: Env,
  db: D1Database,
  user: SessionUser,
  paths: string[],
  maxDownloadsInput: unknown,
  request: Request
): Promise<{
  token: string;
  url: string;
  max_downloads: number;
  files: ShareFileInfo[];
}> {
  const uniquePaths = [...new Set(paths.map((p) => p.trim()).filter(Boolean))];
  if (uniquePaths.length === 0) {
    throw new Error("共有するファイルを指定してください");
  }

  const maxDownloads = normalizeShareMaxDownloads(maxDownloadsInput);
  const resolvedFiles: Array<{
    storage_path: string;
    filename: string;
    size_bytes: number;
  }> = [];

  for (const path of uniquePaths) {
    const parsed = parseLogicalPath(path);
    if (!parsed?.relativePath) {
      throw new Error(`無効なファイルパスです: ${path}`);
    }

    const authorized = await authorizeStoragePath(
      env,
      db,
      user,
      path,
      "read",
      false
    );
    if (typeof authorized === "string") {
      throw new Error(authorized);
    }

    const bucket = getFiles(env);
    const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
    const head = await bucket.head(r2Key);
    if (!head) {
      throw new Error(`ファイルが見つかりません: ${parsed.relativePath.split("/").pop()}`);
    }

    const meta = await getFileMeta(
      env,
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath
    );
    const filename = parsed.relativePath.split("/").pop() ?? "download";
    resolvedFiles.push({
      storage_path: path,
      filename,
      size_bytes: meta?.sizeBytes ?? head.size,
    });
  }

  const shareId = crypto.randomUUID();
  const token = generateShareToken();
  const now = Date.now();

  const statements = [
    db
      .prepare(
        `INSERT INTO storage_share_links (
          id, token, created_by_user_id, max_downloads, download_count, revoked_at, created_at
        ) VALUES (?, ?, ?, ?, 0, NULL, ?)`
      )
      .bind(shareId, token, user.id, maxDownloads, now),
  ];

  resolvedFiles.forEach((file, index) => {
    statements.push(
      db
        .prepare(
          `INSERT INTO storage_share_link_files (
            id, share_link_id, storage_path, filename, size_bytes, sort_order
          ) VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          crypto.randomUUID(),
          shareId,
          file.storage_path,
          file.filename,
          file.size_bytes,
          index
        )
    );
  });

  await db.batch(statements);

  const inserted = await db
    .prepare(
      `SELECT id, filename, size_bytes
       FROM storage_share_link_files
       WHERE share_link_id = ?
       ORDER BY sort_order ASC`
    )
    .bind(shareId)
    .all<ShareFileRow>();

  return {
    token,
    url: buildSharePageUrl(request, token),
    max_downloads: maxDownloads,
    files: (inserted.results ?? []).map((row) => ({
      id: row.id,
      filename: row.filename,
      size_bytes: row.size_bytes,
    })),
  };
}

/** 共有リンク情報を取得（認証不要） */
export async function getStorageShareInfo(
  db: D1Database,
  token: string
): Promise<ShareLinkInfo | null> {
  const trimmed = token.trim();
  if (!trimmed) return null;

  const link = await db
    .prepare(
      `SELECT id, max_downloads, download_count, revoked_at
       FROM storage_share_links
       WHERE token = ?`
    )
    .bind(trimmed)
    .first<ShareLinkRow>();

  if (!link || link.revoked_at) return null;

  const filesResult = await db
    .prepare(
      `SELECT id, filename, size_bytes
       FROM storage_share_link_files
       WHERE share_link_id = ?
       ORDER BY sort_order ASC`
    )
    .bind(link.id)
    .all<Pick<ShareFileRow, "id" | "filename" | "size_bytes">>();

  const files = filesResult.results ?? [];
  if (files.length === 0) return null;

  const remaining = Math.max(0, link.max_downloads - link.download_count);

  return {
    files,
    max_downloads: link.max_downloads,
    download_count: link.download_count,
    remaining_downloads: remaining,
    downloads_exhausted: remaining <= 0,
  };
}

/** ダウンロード回数を原子的に消費 */
async function consumeShareDownload(
  db: D1Database,
  shareId: string
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE storage_share_links
       SET download_count = download_count + 1
       WHERE id = ?
         AND revoked_at IS NULL
         AND download_count < max_downloads`
    )
    .bind(shareId)
    .run();

  return (result.meta.changes ?? 0) > 0;
}

/** 共有リンク経由でファイルをダウンロード（認証不要） */
export async function downloadStorageShareFile(
  env: Env,
  db: D1Database,
  token: string,
  fileId: string
): Promise<Response> {
  const trimmedToken = token.trim();
  const trimmedFileId = fileId.trim();
  if (!trimmedToken || !trimmedFileId) {
    throw new Error("トークンとファイル ID が必要です");
  }

  const link = await db
    .prepare(
      `SELECT id, max_downloads, download_count, revoked_at
       FROM storage_share_links
       WHERE token = ?`
    )
    .bind(trimmedToken)
    .first<ShareLinkRow>();

  if (!link || link.revoked_at) {
    throw new Error("共有リンクが見つかりません");
  }

  if (link.download_count >= link.max_downloads) {
    throw new Error("ダウンロード回数の上限に達しています");
  }

  const file = await db
    .prepare(
      `SELECT storage_path
       FROM storage_share_link_files
       WHERE id = ? AND share_link_id = ?`
    )
    .bind(trimmedFileId, link.id)
    .first<{ storage_path: string }>();

  if (!file) {
    throw new Error("ファイルが見つかりません");
  }

  const parsed = parseLogicalPath(file.storage_path);
  if (!parsed?.relativePath) {
    throw new Error("ファイルパスが不正です");
  }

  const consumed = await consumeShareDownload(db, link.id);
  if (!consumed) {
    throw new Error("ダウンロード回数の上限に達しています");
  }

  try {
    return await streamStorageFile(env, parsed);
  } catch (error) {
    await db
      .prepare(
        `UPDATE storage_share_links
         SET download_count = CASE
           WHEN download_count > 0 THEN download_count - 1
           ELSE 0
         END
         WHERE id = ?`
      )
      .bind(link.id)
      .run();
    throw error;
  }
}
