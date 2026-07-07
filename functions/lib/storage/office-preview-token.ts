/**
 * Office プレビュー用の短期署名トークン（Microsoft が取得する公開 URL 用）
 */

import type { Env } from "../types";
import { OFFICE_PRESIGN_EXPIRES_SEC } from "./constants";

interface OfficePreviewPayload {
  p: string;
  exp: number;
}

function getSigningSecret(env: Env): string | null {
  return (
    env.R2_SECRET_ACCESS_KEY?.trim() ||
    env.ADMIN_BASIC_PASSWORD?.trim() ||
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

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padLen);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Office プレビュー用トークンを発行 */
export async function createOfficePreviewToken(
  env: Env,
  storagePath: string
): Promise<string> {
  const secret = getSigningSecret(env);
  if (!secret) {
    throw new Error("Office プレビューの署名設定がありません");
  }

  const payload: OfficePreviewPayload = {
    p: storagePath,
    exp: Math.floor(Date.now() / 1000) + OFFICE_PRESIGN_EXPIRES_SEC,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadBytes = new TextEncoder().encode(payloadJson);
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, payloadBytes);
  return `${bytesToBase64Url(payloadBytes)}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

/** トークンを検証してストレージパスを返す */
export async function verifyOfficePreviewToken(
  env: Env,
  token: string
): Promise<string | null> {
  const secret = getSigningSecret(env);
  if (!secret) return null;

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;

  let payloadBytes: Uint8Array;
  let signatureBytes: Uint8Array;
  try {
    payloadBytes = base64UrlToBytes(payloadPart);
    signatureBytes = base64UrlToBytes(signaturePart);
  } catch {
    return null;
  }

  const key = await importSigningKey(secret);
  const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, payloadBytes);
  if (!valid) return null;

  let payload: OfficePreviewPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as OfficePreviewPayload;
  } catch {
    return null;
  }

  if (!payload.p || typeof payload.p !== "string") return null;
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload.p;
}
