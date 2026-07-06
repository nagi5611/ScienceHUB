/**
 * ScienceHUB 共通型・ユーティリティ
 */

export interface Env {
  DB: D1Database;
  FILES: R2Bucket;
}

export interface RoleRow {
  slug: string;
  display_name: string;
  is_admin: number;
  created_at: number;
}

export interface UserRow {
  id: string;
  username: string;
  email: string;
  display_name: string;
  role_slug: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: number;
  updated_at: number;
}

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  display_name: string;
  role_slug: string;
  is_admin: boolean;
}

export const SESSION_COOKIE = "sciencehub_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

/** JSON エラーレスポンスを返す */
export function jsonError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

/** ランダム ID を生成する */
export function createId(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${prefix}_${hex}`;
}

/** クッキー文字列からセッション ID を取得する */
export function getSessionIdFromCookie(request: Request): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/** セッションクッキーをセットする */
export function setSessionCookie(sessionId: string, maxAgeSec: number): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}`;
}

/** セッションクッキーを削除する */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/** 現在時刻（ミリ秒） */
export function now(): number {
  return Date.now();
}
