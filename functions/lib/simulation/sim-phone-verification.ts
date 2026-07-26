// functions/lib/simulation/sim-phone-verification.ts
import { createId } from "../types";
import type { FirebaseIdTokenClaims } from "./firebase-id-token";
import { assertJapanPhoneFromToken, maskPhoneE164, normalizeJapanPhoneToE164 } from "./firebase-id-token";

export const DEFAULT_SIM_SMS_CONSENT_VERSION = "2026-07-25-ja-v2";

/** 1ユーザーあたり1日（JST）の電話認証試行上限 */
export const SIM_PHONE_DAILY_ATTEMPT_LIMIT = 10;

export const PHONE_ALREADY_REGISTERED_CODE = "PHONE_ALREADY_REGISTERED";

export const SIM_PHONE_DAILY_LIMIT_CODE = "SIM_PHONE_DAILY_LIMIT";

export const SIM_PHONE_NOT_VERIFIED_CODE = "SIM_PHONE_NOT_VERIFIED";

export function simPhoneDailyLimitError(): Error {
  const err = new Error(
    `電話番号認証は1日あたり${SIM_PHONE_DAILY_ATTEMPT_LIMIT}回までです。日本時間で日付が変わってから再度お試しください。`
  );
  (err as Error & { code: string }).code = SIM_PHONE_DAILY_LIMIT_CODE;
  return err;
}

/** 電話認証の有効期間（1年） */
export const SIM_PHONE_VERIFICATION_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export type SimPhoneVerificationEvent = "consent" | "verify_success" | "verify_failed";

export interface SimPhoneAdminUserRow {
  user_id: string;
  username: string;
  display_name: string;
  email: string;
  phone_masked: string | null;
  verified_at: string | null;
  expires_at: string | null;
  verified: boolean;
  expired: boolean;
}

export interface SimPhoneStatus {
  verified: boolean;
  phone_masked: string | null;
  verified_at: string | null;
  expires_at: string | null;
  expired: boolean;
}

export interface SimPhoneUserRow {
  phone_e164: string | null;
  sim_phone_verified_at: string | null;
}

export interface PhoneVerificationAuditMeta {
  ipHash: string | null;
  userAgentHash: string | null;
}

const COMPLETE_RATE_LIMIT = SIM_PHONE_DAILY_ATTEMPT_LIMIT;

/** JST の日付キー (YYYY-MM-DD)。レート制限の「1日」に使用。 */
export function getPhoneVerificationJstDayKey(nowMs = Date.now()): string {
  return new Date(nowMs).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** ScienceHUB 全体で他ユーザーが同じ番号を保持していないか確認。 */
export async function assertSimPhoneE164Available(
  db: D1Database,
  phoneE164: string,
  exceptUserId: string
): Promise<void> {
  const owner = await db
    .prepare(`SELECT id FROM users WHERE phone_e164 = ? AND id != ?`)
    .bind(phoneE164, exceptUserId)
    .first<{ id: string }>();

  if (owner) {
    const err = new Error("この電話番号は既に別の ScienceHUB アカウントで登録されています");
    (err as Error & { code: string }).code = PHONE_ALREADY_REGISTERED_CODE;
    throw err;
  }
}

/** 国内入力を E.164 に正規化（API 入力用）。 */
export function parseJapanPhoneE164Input(input: string): string | null {
  return normalizeJapanPhoneToE164(input);
}

/** SHA-256 hex digest for audit fields. */
export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Returns active consent version from env or default. */
export function getActiveConsentVersion(env: { SIM_SMS_CONSENT_VERSION?: string }): string {
  const fromEnv = env.SIM_SMS_CONSENT_VERSION?.trim();
  return fromEnv || DEFAULT_SIM_SMS_CONSENT_VERSION;
}

/** Returns whether verification timestamp is within the 1-year validity window. */
export function isSimPhoneVerificationCurrent(
  verifiedAt: string | null | undefined,
  nowMs = Date.now()
): boolean {
  if (!verifiedAt) return false;
  const verifiedMs = Date.parse(verifiedAt);
  if (!Number.isFinite(verifiedMs)) return false;
  return nowMs - verifiedMs < SIM_PHONE_VERIFICATION_TTL_MS;
}

/** ISO expiry time from verification timestamp. */
export function getSimPhoneVerificationExpiresAt(verifiedAt: string): string | null {
  const verifiedMs = Date.parse(verifiedAt);
  if (!Number.isFinite(verifiedMs)) return null;
  return new Date(verifiedMs + SIM_PHONE_VERIFICATION_TTL_MS).toISOString();
}

/** Loads phone verification fields for a user. */
export async function getSimPhoneUserRow(
  db: D1Database,
  userId: string
): Promise<SimPhoneUserRow | null> {
  return db
    .prepare(`SELECT phone_e164, sim_phone_verified_at FROM users WHERE id = ?`)
    .bind(userId)
    .first<SimPhoneUserRow>();
}

/** Builds API status from user row. */
export function getSimPhoneStatus(
  row: SimPhoneUserRow | null,
  nowMs = Date.now()
): SimPhoneStatus {
  const verifiedAt = row?.sim_phone_verified_at ?? null;
  const phoneE164 = row?.phone_e164 ?? null;
  const hasRecord = Boolean(verifiedAt && phoneE164);
  const current = hasRecord && isSimPhoneVerificationCurrent(verifiedAt, nowMs);
  const expired = hasRecord && !current;

  return {
    verified: current,
    phone_masked: phoneE164 ? maskPhoneE164(phoneE164) : null,
    verified_at: verifiedAt,
    expires_at: verifiedAt ? getSimPhoneVerificationExpiresAt(verifiedAt) : null,
    expired,
  };
}

/** Throws if user has not completed phone verification. */
export async function requireSimPhoneVerified(db: D1Database, userId: string): Promise<void> {
  const row = await getSimPhoneUserRow(db, userId);
  const status = getSimPhoneStatus(row);
  if (!status.verified) {
    const err = new Error(
      status.expired
        ? "電話番号の認証の有効期限が切れています。再度 SMS 認証してください"
        : "FDS 依頼の前に電話番号の認証が必要です"
    );
    (err as Error & { code: string }).code = SIM_PHONE_NOT_VERIFIED_CODE;
    throw err;
  }
}

/** Appends an audit log row. */
export async function insertPhoneVerificationLog(
  db: D1Database,
  data: {
    userId: string;
    event: SimPhoneVerificationEvent;
    consentVersion?: string | null;
    phoneE164Hash?: string | null;
    ipHash?: string | null;
    userAgentHash?: string | null;
    firebaseUid?: string | null;
    createdAt: string;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO sim_phone_verification_logs (
        id, user_id, event, consent_text_version, phone_e164_hash,
        ip_hash, user_agent_hash, firebase_uid, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      createId("simphlog"),
      data.userId,
      data.event,
      data.consentVersion ?? null,
      data.phoneE164Hash ?? null,
      data.ipHash ?? null,
      data.userAgentHash ?? null,
      data.firebaseUid ?? null,
      data.createdAt
    )
    .run();
}

/** 1日（JST）あたりの試行回数を増やす。上限超過時は false。 */
export async function checkAndIncrementDailyPhoneVerificationAttempt(
  db: D1Database,
  userId: string,
  nowMs = Date.now()
): Promise<boolean> {
  const dayKey = getPhoneVerificationJstDayKey(nowMs);
  const row = await db
    .prepare(`SELECT window_start, attempt_count FROM sim_phone_verification_rate WHERE user_id = ?`)
    .bind(userId)
    .first<{ window_start: string; attempt_count: number }>();

  if (!row || row.window_start !== dayKey) {
    await db
      .prepare(
        `INSERT INTO sim_phone_verification_rate (user_id, window_start, attempt_count)
         VALUES (?, ?, 1)
         ON CONFLICT(user_id) DO UPDATE SET window_start = excluded.window_start, attempt_count = 1`
      )
      .bind(userId, dayKey)
      .run();
    return true;
  }

  if (row.attempt_count >= COMPLETE_RATE_LIMIT) {
    return false;
  }

  await db
    .prepare(
      `UPDATE sim_phone_verification_rate SET attempt_count = attempt_count + 1 WHERE user_id = ?`
    )
    .bind(userId)
    .run();
  return true;
}

/** @deprecated 互換の別名 */
export const checkAndIncrementCompleteRateLimit = checkAndIncrementDailyPhoneVerificationAttempt;

/** Persists verified phone from Firebase token after server-side checks. */
export async function completePhoneVerification(
  db: D1Database,
  userId: string,
  claims: FirebaseIdTokenClaims,
  consentVersion: string,
  audit: PhoneVerificationAuditMeta
): Promise<SimPhoneStatus> {
  const phoneE164 = assertJapanPhoneFromToken(claims.phone_number);
  const phoneHash = await sha256Hex(phoneE164);
  const createdAt = new Date().toISOString();

  const existing = await getSimPhoneUserRow(db, userId);
  const existingStatus = getSimPhoneStatus(existing);
  if (existingStatus.verified) {
    return existingStatus;
  }

  await assertSimPhoneE164Available(db, phoneE164, userId);

  await db
    .prepare(
      `UPDATE users SET phone_e164 = ?, sim_phone_verified_at = ?, updated_at = ? WHERE id = ?`
    )
    .bind(phoneE164, createdAt, Date.now(), userId)
    .run();

  await insertPhoneVerificationLog(db, {
    userId,
    event: "verify_success",
    consentVersion,
    phoneE164Hash: phoneHash,
    ipHash: audit.ipHash,
    userAgentHash: audit.userAgentHash,
    firebaseUid: claims.sub,
    createdAt,
  });

  const updated = await getSimPhoneUserRow(db, userId);
  return getSimPhoneStatus(updated);
}

/** Records consent event (optional, before SMS send on client). */
export async function recordPhoneVerificationConsent(
  db: D1Database,
  userId: string,
  consentVersion: string,
  audit: PhoneVerificationAuditMeta
): Promise<void> {
  await insertPhoneVerificationLog(db, {
    userId,
    event: "consent",
    consentVersion,
    ipHash: audit.ipHash,
    userAgentHash: audit.userAgentHash,
    createdAt: new Date().toISOString(),
  });
}

/** Lists ScienceHUB users with a sim phone verification record (for admin). */
export async function listSimPhoneVerificationUsers(
  db: D1Database,
  nowMs = Date.now()
): Promise<SimPhoneAdminUserRow[]> {
  const result = await db
    .prepare(
      `SELECT id, username, display_name, email, phone_e164, sim_phone_verified_at
       FROM users
       WHERE sim_phone_verified_at IS NOT NULL OR phone_e164 IS NOT NULL
       ORDER BY (sim_phone_verified_at IS NULL), sim_phone_verified_at DESC`
    )
    .all<{
      id: string;
      username: string;
      display_name: string;
      email: string;
      phone_e164: string | null;
      sim_phone_verified_at: string | null;
    }>();

  return (result.results ?? []).map((row) => {
    const status = getSimPhoneStatus(
      {
        phone_e164: row.phone_e164,
        sim_phone_verified_at: row.sim_phone_verified_at,
      },
      nowMs
    );
    return {
      user_id: row.id,
      username: row.username,
      display_name: row.display_name,
      email: row.email,
      phone_masked: status.phone_masked,
      verified_at: status.verified_at,
      expires_at: status.expires_at,
      verified: status.verified,
      expired: status.expired,
    };
  });
}

/** Clears sim phone verification for a user (admin action). */
export async function revokeSimPhoneVerificationForUser(
  db: D1Database,
  targetUserId: string,
  adminUserId: string,
  audit: PhoneVerificationAuditMeta
): Promise<void> {
  const row = await getSimPhoneUserRow(db, targetUserId);
  if (!row?.phone_e164 && !row?.sim_phone_verified_at) {
    const err = new Error("このユーザーに電話認証の記録がありません");
    (err as Error & { code: string }).code = "SIM_PHONE_NOT_FOUND";
    throw err;
  }

  const phoneHash = row.phone_e164 ? await sha256Hex(row.phone_e164) : null;
  const createdAt = new Date().toISOString();

  await db
    .prepare(
      `UPDATE users SET phone_e164 = NULL, sim_phone_verified_at = NULL, updated_at = ? WHERE id = ?`
    )
    .bind(Date.now(), targetUserId)
    .run();

  await insertPhoneVerificationLog(db, {
    userId: targetUserId,
    event: "verify_failed",
    consentVersion: "admin-revoke",
    phoneE164Hash: phoneHash,
    ipHash: audit.ipHash,
    userAgentHash: audit.userAgentHash,
    firebaseUid: `admin:${adminUserId}`,
    createdAt,
  });
}
