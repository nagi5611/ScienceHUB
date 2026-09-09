/**
 * AI エージェント用 Personal Access Token
 */

import type { Env, SessionUser } from "./types";
import { createId, now } from "./types";
import { getUserRoles, userHasAdminRole } from "./roles";
import { resolveUserAvatarUrl } from "./user-icons";

export const AGENT_TOKEN_PREFIX = "shat_";
export const AGENT_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 90;
export const AGENT_TOKEN_SCOPES = ["storage:read", "storage:write"] as const;
export type AgentTokenScope = (typeof AGENT_TOKEN_SCOPES)[number];

export interface AgentTokenListItem {
  id: string;
  name: string;
  token_prefix: string;
  scopes: string[];
  last_used_at: number | null;
  expires_at: number | null;
  revoked_at: number | null;
  created_at: number;
}

export interface CreateAgentTokenResult {
  token: AgentTokenListItem & { token: string };
}

interface AgentTokenRow {
  id: string;
  user_id: string;
  name: string;
  token_hash: string;
  token_prefix: string;
  scopes: string;
  last_used_at: number | null;
  expires_at: number | null;
  revoked_at: number | null;
  created_at: number;
}

interface UserRow {
  id: string;
  username: string;
  email: string;
  display_name: string;
  role_slug: string;
  avatar_url: string | null;
  updated_at: number;
}

/** base64url エンコード */
function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/** 平文トークンを SHA-256 ハッシュ（hex）に変換 */
async function hashAgentToken(rawToken: string): Promise<string> {
  const data = new TextEncoder().encode(rawToken);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

/** ランダムなエージェントトークンを生成 */
function generateRawAgentToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `${AGENT_TOKEN_PREFIX}${bytesToBase64Url(bytes)}`;
}

/** スコープ配列を正規化 */
export function normalizeAgentTokenScopes(scopes: unknown): AgentTokenScope[] {
  if (!Array.isArray(scopes) || scopes.length === 0) {
    return [...AGENT_TOKEN_SCOPES];
  }

  const allowed = new Set<string>(AGENT_TOKEN_SCOPES);
  const normalized: AgentTokenScope[] = [];
  for (const scope of scopes) {
    if (typeof scope !== "string") continue;
    if (!allowed.has(scope)) continue;
    if (!normalized.includes(scope as AgentTokenScope)) {
      normalized.push(scope as AgentTokenScope);
    }
  }

  return normalized.length > 0 ? normalized : [...AGENT_TOKEN_SCOPES];
}

function rowToListItem(row: AgentTokenRow): AgentTokenListItem {
  return {
    id: row.id,
    name: row.name,
    token_prefix: row.token_prefix,
    scopes: row.scopes.split(",").filter(Boolean),
    last_used_at: row.last_used_at,
    expires_at: row.expires_at,
    revoked_at: row.revoked_at,
    created_at: row.created_at,
  };
}

/** ユーザー行から SessionUser を構築 */
async function buildSessionUser(env: Env, db: D1Database, row: UserRow): Promise<SessionUser> {
  const roles = await getUserRoles(db, row.id);
  const isAdmin = await userHasAdminRole(db, row.id);
  const avatar_url = await resolveUserAvatarUrl(env, {
    username: row.username,
    avatar_url: row.avatar_url,
    updated_at: row.updated_at,
  });

  return {
    id: row.id,
    username: row.username,
    email: row.email,
    display_name: row.display_name,
    role_slug: row.role_slug,
    avatar_url,
    roles: roles.map((role) => ({
      slug: role.slug,
      display_name: role.display_name,
      color: role.color,
      is_admin: role.is_admin,
    })),
    is_admin: isAdmin,
  };
}

/** エージェントトークンを作成（平文は一度だけ返す） */
export async function createAgentToken(
  db: D1Database,
  userId: string,
  name: string,
  scopesInput?: unknown
): Promise<CreateAgentTokenResult> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("トークン名が必要です");
  }
  if (trimmedName.length > 64) {
    throw new Error("トークン名は 64 文字以内にしてください");
  }

  const scopes = normalizeAgentTokenScopes(scopesInput);
  const rawToken = generateRawAgentToken();
  const tokenHash = await hashAgentToken(rawToken);
  const tokenPrefix = rawToken.slice(0, AGENT_TOKEN_PREFIX.length + 8);
  const id = createId("atok");
  const createdAt = now();
  const expiresAt = createdAt + AGENT_TOKEN_TTL_MS;

  await db
    .prepare(
      `INSERT INTO agent_tokens (
        id, user_id, name, token_hash, token_prefix, scopes,
        expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      userId,
      trimmedName,
      tokenHash,
      tokenPrefix,
      scopes.join(","),
      expiresAt,
      createdAt
    )
    .run();

  const item = rowToListItem({
    id,
    user_id: userId,
    name: trimmedName,
    token_hash: tokenHash,
    token_prefix: tokenPrefix,
    scopes: scopes.join(","),
    last_used_at: null,
    expires_at: expiresAt,
    revoked_at: null,
    created_at: createdAt,
  });

  return {
    token: {
      ...item,
      token: rawToken,
    },
  };
}

/** ユーザーのエージェントトークン一覧 */
export async function listAgentTokens(
  db: D1Database,
  userId: string
): Promise<AgentTokenListItem[]> {
  const rows = await db
    .prepare(
      `SELECT id, user_id, name, token_hash, token_prefix, scopes,
              last_used_at, expires_at, revoked_at, created_at
       FROM agent_tokens
       WHERE user_id = ?
       ORDER BY created_at DESC`
    )
    .bind(userId)
    .all<AgentTokenRow>();

  return (rows.results ?? []).map(rowToListItem);
}

/** エージェントトークンを失効 */
export async function revokeAgentToken(
  db: D1Database,
  userId: string,
  tokenId: string
): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE agent_tokens
       SET revoked_at = ?
       WHERE id = ? AND user_id = ? AND revoked_at IS NULL`
    )
    .bind(now(), tokenId, userId)
    .run();

  return (result.meta.changes ?? 0) > 0;
}

export interface ResolvedAgentToken {
  user: SessionUser;
  scopes: string[];
  tokenId: string;
}

/** Bearer トークンからユーザーを解決 */
export async function resolveUserFromAgentToken(
  env: Env,
  db: D1Database,
  rawToken: string
): Promise<ResolvedAgentToken | null> {
  if (!rawToken.startsWith(AGENT_TOKEN_PREFIX)) {
    return null;
  }

  const tokenHash = await hashAgentToken(rawToken);
  const row = await db
    .prepare(
      `SELECT t.id, t.user_id, t.scopes, t.expires_at, t.revoked_at,
              u.username, u.email, u.display_name, u.role_slug, u.avatar_url, u.updated_at
       FROM agent_tokens t
       JOIN users u ON u.id = t.user_id
       WHERE t.token_hash = ?`
    )
    .bind(tokenHash)
    .first<{
      id: string;
      user_id: string;
      scopes: string;
      expires_at: number | null;
      revoked_at: number | null;
      username: string;
      email: string;
      display_name: string;
      role_slug: string;
      avatar_url: string | null;
      updated_at: number;
    }>();

  if (!row) return null;
  if (row.revoked_at !== null) return null;
  if (row.expires_at !== null && row.expires_at <= now()) return null;

  const usedAt = now();
  await db
    .prepare("UPDATE agent_tokens SET last_used_at = ? WHERE id = ?")
    .bind(usedAt, row.id)
    .run();

  const user = await buildSessionUser(env, db, {
    id: row.user_id,
    username: row.username,
    email: row.email,
    display_name: row.display_name,
    role_slug: row.role_slug,
    avatar_url: row.avatar_url,
    updated_at: row.updated_at,
  });

  return {
    user,
    scopes: row.scopes.split(",").filter(Boolean),
    tokenId: row.id,
  };
}

/** トークンスコープを検証 */
export function hasAgentTokenScope(
  scopes: string[],
  required: AgentTokenScope
): boolean {
  return scopes.includes(required);
}
