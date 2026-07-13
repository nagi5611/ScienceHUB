/**
 * クラウドストレージ フォルダショートカットリンク（閲覧権限があるユーザーのみ）
 */

import type { Env } from "../types";
import type { SessionUser } from "../types";
import { buildLogicalPath, parseLogicalPath } from "./keys";
import { authorizeStoragePath } from "./permissions";

interface ShortcutLinkRow {
  id: string;
  token: string;
  storage_path: string;
  label: string | null;
  revoked_at: number | null;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/** ショートカット用の URL セーフなトークンを生成 */
function generateShortcutToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

/** ショートカットリンクの公開 URL を組み立て */
export function buildShortcutPageUrl(request: Request, token: string): string {
  const origin = new URL(request.url).origin;
  return `${origin}/storage-shortcut/?t=${encodeURIComponent(token)}`;
}

/** 論理パスを正規化（末尾スラッシュ除去） */
export function normalizeShortcutPath(path: string): string | null {
  const trimmed = path.trim().replace(/^\/+|\/+$/g, "");
  if (!trimmed) return null;
  const parsed = parseLogicalPath(trimmed);
  if (!parsed) return null;
  return buildLogicalPath(parsed.rootType, parsed.rootKey, parsed.relativePath);
}

/** ショートカットリンクを作成 */
export async function createStorageShortcutLink(
  env: Env,
  db: D1Database,
  user: SessionUser,
  storagePathInput: string,
  labelInput: string | undefined,
  request: Request
): Promise<{
  token: string;
  url: string;
  storage_path: string;
  label: string;
}> {
  const storagePath = normalizeShortcutPath(storagePathInput);
  if (!storagePath) {
    throw new Error("無効なフォルダパスです");
  }

  const authorized = await authorizeStoragePath(
    env,
    db,
    user,
    storagePath,
    "read",
    true
  );
  if (typeof authorized === "string") {
    throw new Error(authorized);
  }

  const parsed = authorized.parsed;
  const defaultLabel =
    parsed.relativePath.split("/").filter(Boolean).pop() ??
    (parsed.rootType === "group" ? parsed.rootKey : parsed.rootKey);
  const label = (labelInput?.trim() || defaultLabel).slice(0, 200);

  const id = crypto.randomUUID();
  const token = generateShortcutToken();
  const now = Date.now();

  await db
    .prepare(
      `INSERT INTO storage_shortcut_links (
        id, token, storage_path, label, created_by_user_id, revoked_at, created_at
      ) VALUES (?, ?, ?, ?, ?, NULL, ?)`
    )
    .bind(id, token, storagePath, label, user.id, now)
    .run();

  return {
    token,
    url: buildShortcutPageUrl(request, token),
    storage_path: storagePath,
    label,
  };
}

/** ショートカットを解決（認証済みユーザー向け・閲覧権限を検証） */
export async function resolveStorageShortcutLink(
  env: Env,
  db: D1Database,
  user: SessionUser,
  tokenInput: string
): Promise<{ storage_path: string; label: string } | null> {
  const token = tokenInput.trim();
  if (!token) return null;

  const link = await db
    .prepare(
      `SELECT id, storage_path, label, revoked_at
       FROM storage_shortcut_links
       WHERE token = ?`
    )
    .bind(token)
    .first<ShortcutLinkRow>();

  if (!link || link.revoked_at) return null;

  const storagePath = normalizeShortcutPath(link.storage_path);
  if (!storagePath) return null;

  const authorized = await authorizeStoragePath(
    env,
    db,
    user,
    storagePath,
    "read",
    true
  );
  if (typeof authorized === "string") {
    throw new Error(authorized);
  }

  const parsed = authorized.parsed;
  const fallbackLabel =
    parsed.relativePath.split("/").filter(Boolean).pop() ??
    (parsed.rootType === "group" ? parsed.rootKey : parsed.rootKey);

  return {
    storage_path: storagePath,
    label: link.label?.trim() || fallbackLabel,
  };
}
