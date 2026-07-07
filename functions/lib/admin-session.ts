/**
 * 管理者セッション（署名付き Cookie）
 */

import type { Env } from "./types";
import { getAdminBasicCredentials, verifyAdminCredentials } from "./basic-auth";

export const ADMIN_SESSION_COOKIE = "sciencehub_admin_session";
export const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24;

interface AdminSessionPayload {
  u: string;
  exp: number;
}

/** 署名用シークレットを取得する */
function getAdminSessionSecret(env: Env): string | null {
  return getAdminBasicCredentials(env)?.password ?? null;
}

/** HMAC キーをインポートする */
async function importSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** バイト列を 16 進文字列に変換する */
function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

/** 16 進文字列をバイト列に変換する */
function hexToBytes(hex: string): Uint8Array {
  const pairs = hex.match(/.{2}/g);
  if (!pairs) {
    return new Uint8Array();
  }
  return Uint8Array.from(pairs.map((h) => parseInt(h, 16)));
}

/** 管理者セッショントークンを発行する */
export async function createAdminSessionToken(
  username: string,
  env: Env
): Promise<string | null> {
  const secret = getAdminSessionSecret(env);
  if (!secret) {
    return null;
  }

  const payload: AdminSessionPayload = {
    u: username,
    exp: Date.now() + ADMIN_SESSION_TTL_MS,
  };
  const payloadB64 = btoa(JSON.stringify(payload));
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );

  return `${payloadB64}.${bytesToHex(signature)}`;
}

/** 管理者セッショントークンを検証する */
export async function verifyAdminSessionToken(
  token: string,
  env: Env
): Promise<string | null> {
  const secret = getAdminSessionSecret(env);
  if (!secret) {
    return null;
  }

  const dot = token.indexOf(".");
  if (dot < 0) {
    return null;
  }

  const payloadB64 = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);
  if (!payloadB64 || !sigHex) {
    return null;
  }

  const key = await importSigningKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    hexToBytes(sigHex),
    new TextEncoder().encode(payloadB64)
  );
  if (!valid) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(payloadB64)) as AdminSessionPayload;
    if (!payload.u || payload.exp < Date.now()) {
      return null;
    }
    return payload.u;
  } catch {
    return null;
  }
}

/** Cookie から管理者ユーザー名を取得する */
export async function getAdminSessionUser(
  request: Request,
  env: Env
): Promise<string | null> {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${ADMIN_SESSION_COOKIE}=([^;]+)`)
  );
  if (!match?.[1]) {
    return null;
  }

  return verifyAdminSessionToken(decodeURIComponent(match[1]), env);
}

/** 管理者セッション Cookie をセットする */
export function setAdminSessionCookie(
  token: string,
  maxAgeSec: number,
  secure = false
): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secureFlag}`;
}

/** 管理者セッション Cookie を削除する */
export function clearAdminSessionCookie(secure = false): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}

/** HTTPS リクエストか判定する */
export function isSecureRequest(request: Request): boolean {
  const url = new URL(request.url);
  if (url.protocol === "https:") return true;
  return request.headers.get("X-Forwarded-Proto") === "https";
}

/** 管理者ログイン資格情報を検証する */
export function checkAdminLogin(
  username: string,
  password: string,
  env: Env
): boolean {
  return verifyAdminCredentials(username, password, env);
}

/** 管理者 API 用の 401 レスポンス */
export function adminSessionUnauthorized(): Response {
  return Response.json({ error: "管理者ログインが必要です" }, { status: 401 });
}

/** 管理者セッションを要求する */
export async function requireAdminSession(
  request: Request,
  env: Env
): Promise<string | Response> {
  if (!getAdminSessionSecret(env)) {
    return new Response("管理者認証が設定されていません", { status: 503 });
  }

  const username = await getAdminSessionUser(request, env);
  if (!username) {
    return adminSessionUnauthorized();
  }

  return username;
}

/** 管理者ログインページのパスか判定する */
export function isAdminLoginPath(path: string): boolean {
  return path === "/admin/login.html" || path === "/admin/login";
}

/** 管理者パネル HTML パスか判定する */
export function isAdminPanelPath(path: string): boolean {
  return path === "/admin/panel.html" || path === "/admin/panel";
}

/** 管理者 API で認証不要なパスか判定する */
export function isPublicAdminApiPath(pathname: string, method: string): boolean {
  if (pathname === "/api/admin/login" && method === "POST") {
    return true;
  }
  if (pathname === "/api/admin/logout" && method === "POST") {
    return true;
  }
  if (pathname === "/api/admin/me" && method === "GET") {
    return true;
  }
  return false;
}
