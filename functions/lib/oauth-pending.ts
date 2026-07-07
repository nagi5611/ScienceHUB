/**
 * OAuth 新規登録待ち（署名付き Cookie）
 */

import type { Env } from "./types";
import type { OAuthProvider } from "./oauth-users";

export const OAUTH_PENDING_COOKIE = "sciencehub_oauth_pending";
export const OAUTH_PENDING_TTL_MS = 1000 * 60 * 15;

export interface OAuthPendingPayload {
  provider: OAuthProvider;
  subject: string;
  email: string;
  nameHint: string;
  next: string;
  exp: number;
}

/** 署名用シークレットを取得する */
function getSigningSecret(env: Env): string | null {
  return (
    env.GOOGLE_CLIENT_SECRET?.trim() ||
    env.MICROSOFT_CLIENT_SECRET?.trim() ||
    null
  );
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const pairs = hex.match(/.{2}/g);
  if (!pairs) return new Uint8Array();
  return Uint8Array.from(pairs.map((h) => parseInt(h, 16)));
}

/** UTF-8 文字列を Base64 エンコードする（btoa は Latin1 のみ対応） */
function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/** Base64 文字列を UTF-8 テキストにデコードする */
function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** 新規 OAuth 登録待ちトークンを発行する */
export async function createOAuthPendingToken(
  payload: Omit<OAuthPendingPayload, "exp">,
  env: Env
): Promise<string | null> {
  const secret = getSigningSecret(env);
  if (!secret) return null;

  const full: OAuthPendingPayload = {
    ...payload,
    exp: Date.now() + OAUTH_PENDING_TTL_MS,
  };

  try {
    const payloadB64 = encodeBase64Utf8(JSON.stringify(full));
    const key = await importSigningKey(secret);
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payloadB64)
    );
    return `${payloadB64}.${bytesToHex(signature)}`;
  } catch (error) {
    console.error("createOAuthPendingToken failed:", error);
    return null;
  }
}

/** 新規 OAuth 登録待ちトークンを検証する */
export async function verifyOAuthPendingToken(
  token: string,
  env: Env
): Promise<OAuthPendingPayload | null> {
  const secret = getSigningSecret(env);
  if (!secret) return null;

  const dot = token.indexOf(".");
  if (dot < 0) return null;

  const payloadB64 = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);

  const key = await importSigningKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    hexToBytes(sigHex),
    new TextEncoder().encode(payloadB64)
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(decodeBase64Utf8(payloadB64)) as OAuthPendingPayload;
    if (!payload.provider || !payload.subject || !payload.email) return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Cookie から新規 OAuth 登録待ち情報を取得する */
export async function readOAuthPending(
  request: Request,
  env: Env
): Promise<OAuthPendingPayload | null> {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${OAUTH_PENDING_COOKIE}=([^;]+)`)
  );
  if (!match?.[1]) return null;
  return verifyOAuthPendingToken(decodeURIComponent(match[1]), env);
}

export function setOAuthPendingCookie(
  token: string,
  secure = false
): string {
  const maxAgeSec = Math.floor(OAUTH_PENDING_TTL_MS / 1000);
  const secureFlag = secure ? "; Secure" : "";
  return `${OAUTH_PENDING_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secureFlag}`;
}

export function clearOAuthPendingCookie(secure = false): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${OAUTH_PENDING_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}

/** 公開用にマスクしたメールを返す */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) {
    return `${local[0] ?? "*"}***@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
}
