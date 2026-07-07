/**
 * OAuth ユーザー検索・作成・メール連携
 */

import { createId, now } from "./types";
import type { UserRow } from "./types";
import { usernameExists } from "./auth";
import { setUserRoles } from "./roles";

export type OAuthProvider = "google" | "microsoft";

export interface OAuthProfileInput {
  provider: OAuthProvider;
  subject: string;
  email: string;
  displayName: string;
}

const USER_SELECT = `SELECT id, username, email, display_name, role_slug, password_hash, avatar_url, created_at, updated_at
  FROM users`;

/** OAuth 連携済みユーザーを provider + subject で検索する */
async function findUserByOAuthIdentity(
  db: D1Database,
  provider: OAuthProvider,
  subject: string
): Promise<UserRow | null> {
  return db
    .prepare(
      `${USER_SELECT}
       WHERE id = (
         SELECT user_id FROM oauth_identities WHERE provider = ? AND subject = ?
       )`
    )
    .bind(provider, subject)
    .first<UserRow>();
}

/** メールアドレスでユーザーを検索する（大文字小文字無視） */
async function findUserByEmail(
  db: D1Database,
  email: string
): Promise<UserRow | null> {
  return db
    .prepare(`${USER_SELECT} WHERE lower(email) = lower(?)`)
    .bind(email.trim())
    .first<UserRow>();
}

/** OAuth 連携を記録する */
async function linkOAuthIdentity(
  db: D1Database,
  userId: string,
  provider: OAuthProvider,
  subject: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO oauth_identities (provider, subject, user_id, linked_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(provider, subject) DO UPDATE SET
         user_id = excluded.user_id,
         linked_at = excluded.linked_at`
    )
    .bind(provider, subject, userId, now())
    .run();
}

/** メールのローカル部からユーザー名候補を生成する */
function usernameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "user";
  const sanitized = local
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 32);

  if (sanitized.length >= 2) return sanitized;
  return `user_${local.replace(/\W/g, "").slice(0, 8) || "oauth"}`;
}

/** 一意なユーザー名を生成する */
async function generateUniqueUsername(
  db: D1Database,
  email: string
): Promise<string> {
  const base = usernameFromEmail(email);
  let candidate = base;
  let attempt = 0;

  while (await usernameExists(db, candidate)) {
    attempt += 1;
    const suffix = `_${attempt}`;
    candidate = `${base.slice(0, Math.max(2, 32 - suffix.length))}${suffix}`;
    if (attempt > 100) {
      candidate = `user_${createId("u").slice(-8)}`;
      break;
    }
  }

  return candidate;
}

/** 既存 OAuth / メール連携ユーザーを検索する */
export async function findExistingOAuthUser(
  db: D1Database,
  input: Pick<OAuthProfileInput, "provider" | "subject" | "email">
): Promise<UserRow | null> {
  const byOAuth = await findUserByOAuthIdentity(
    db,
    input.provider,
    input.subject
  );
  if (byOAuth) {
    return byOAuth;
  }

  const byEmail = await findUserByEmail(db, input.email);
  if (byEmail) {
    await linkOAuthIdentity(db, byEmail.id, input.provider, input.subject);
    return byEmail;
  }

  return null;
}

/** OAuth 新規ユーザーを作成する */
export async function createOAuthUser(
  db: D1Database,
  input: OAuthProfileInput
): Promise<UserRow> {
  const email = input.email.trim();
  const displayName = input.displayName.trim() || email.split("@")[0] || "User";

  const existing = await findExistingOAuthUser(db, input);
  if (existing) {
    return existing;
  }

  const id = createId("user");
  const timestamp = now();
  const username = await generateUniqueUsername(db, email);

  await db
    .prepare(
      `INSERT INTO users (id, username, email, display_name, role_slug, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'guest', '', ?, ?)`
    )
    .bind(id, username, email, displayName, timestamp, timestamp)
    .run();

  await setUserRoles(db, id, ["guest"]);
  await linkOAuthIdentity(db, id, input.provider, input.subject);

  const user = await db
    .prepare(`${USER_SELECT} WHERE id = ?`)
    .bind(id)
    .first<UserRow>();

  if (!user) {
    throw new Error("OAuth ユーザーの作成に失敗しました");
  }

  return user;
}
