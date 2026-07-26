// functions/lib/simulation/firebase-id-token.ts
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export interface FirebaseIdTokenClaims extends JWTPayload {
  sub: string;
  phone_number?: string;
}

/** Verifies a Firebase Auth ID token and returns claims. */
export async function verifyFirebaseIdToken(
  idToken: string,
  projectId: string
): Promise<FirebaseIdTokenClaims> {
  const trimmed = idToken.trim();
  if (!trimmed) {
    throw new Error("ID トークンが空です");
  }

  const { payload } = await jwtVerify(trimmed, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  if (!payload.sub || typeof payload.sub !== "string") {
    throw new Error("ID トークンにユーザー ID がありません");
  }

  return payload as FirebaseIdTokenClaims;
}

/** Normalizes Japanese domestic input to E.164 (+81...). */
export function normalizeJapanPhoneToE164(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;

  let national = digits;
  if (national.startsWith("81")) {
    national = national.slice(2);
  }
  if (national.startsWith("0")) {
    national = national.slice(1);
  }

  if (!/^[789]0\d{8}$/.test(national)) {
    return null;
  }

  return `+81${national}`;
}

/** Asserts phone is Japan E.164 from Firebase token. */
export function assertJapanPhoneFromToken(phoneNumber: string | undefined): string {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    throw new Error("電話番号がトークンに含まれていません");
  }

  const trimmed = phoneNumber.trim();
  if (!trimmed.startsWith("+81")) {
    throw new Error("日本国内の携帯電話番号のみ登録できます");
  }

  const national = trimmed.slice(3);
  if (!/^[789]0\d{8}$/.test(national)) {
    throw new Error("電話番号の形式が正しくありません");
  }

  return trimmed;
}

/** Masks E.164 for display (e.g. +81******1234). */
export function maskPhoneE164(phoneE164: string): string {
  if (phoneE164.length < 8) return "****";
  const last4 = phoneE164.slice(-4);
  return `${phoneE164.slice(0, 3)}******${last4}`;
}
