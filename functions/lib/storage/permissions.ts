/**
 * クラウドストレージ権限チェック
 */

import type { SessionUser } from "../types";
import type { StorageAction } from "./meta";
import { resolveEffectivePermissions } from "./meta";
import type { ParsedStoragePath, StorageRootType } from "./keys";
import { parseLogicalPath } from "./keys";
import type { Env } from "../types";
import { getUserGroupMemberships } from "../groups";

export interface StorageAuthContext {
  user: SessionUser;
  parsed: ParsedStoragePath;
  groupSlug?: string;
}

/** 論理パスに対する操作権限を検証 */
export async function authorizeStoragePath(
  env: Env,
  db: D1Database,
  user: SessionUser,
  logicalPath: string,
  action: StorageAction,
  isDirectory: boolean
): Promise<StorageAuthContext | string> {
  const parsed = parseLogicalPath(logicalPath);
  if (!parsed) return "パスが不正です";

  if (user.is_admin) {
    const groupSlug =
      parsed.rootType === "group" ? parsed.rootKey : undefined;
    return { user, parsed, groupSlug };
  }

  const allowed = await checkPermission(
    env,
    db,
    user,
    parsed,
    action,
    isDirectory
  );
  if (!allowed) {
    return "この操作を行う権限がありません";
  }

  const groupSlug = parsed.rootType === "group" ? parsed.rootKey : undefined;
  return { user, parsed, groupSlug };
}

/** ルート一覧用: 個人ルートへのアクセス可否 */
export function canAccessUserRoot(user: SessionUser, username: string): boolean {
  if (user.is_admin) return true;
  return user.username === username;
}

/** ルート一覧用: グループルートへのアクセス可否 */
export async function canAccessGroupRoot(
  db: D1Database,
  userId: string,
  groupSlug: string,
  isAdmin: boolean
): Promise<boolean> {
  if (isAdmin) return true;
  const memberships = await getUserGroupMemberships(db, userId);
  return memberships.some((m) => m.group_slug === groupSlug);
}

async function checkPermission(
  env: Env,
  db: D1Database,
  user: SessionUser,
  parsed: ParsedStoragePath,
  action: StorageAction,
  isDirectory: boolean
): Promise<boolean> {
  if (parsed.rootType === "user") {
    if (user.username !== parsed.rootKey) {
      return false;
    }
    const perms = await resolveEffectivePermissions(
      env,
      parsed.rootType,
      parsed.rootKey,
      parsed.relativePath,
      isDirectory
    );
    return matchesRule(user, parsed, perms[action], false);
  }

  const memberships = await getUserGroupMemberships(db, user.id);
  const isMember = memberships.some((m) => m.group_slug === parsed.rootKey);
  const perms = await resolveEffectivePermissions(
    env,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath,
    isDirectory
  );
  return matchesRule(user, parsed, perms[action], isMember);
}

function matchesRule(
  user: SessionUser,
  parsed: ParsedStoragePath,
  rule: { hubRoles: string[]; groupMembers: boolean },
  isGroupMember: boolean
): boolean {
  if (parsed.rootType === "user" && user.username === parsed.rootKey) {
    return true;
  }

  if (rule.groupMembers && isGroupMember) {
    return true;
  }

  if (rule.hubRoles.includes(user.role_slug)) {
    return true;
  }

  return false;
}

/** 書き込み先ディレクトリの権限チェック */
export async function authorizeWriteDir(
  env: Env,
  db: D1Database,
  user: SessionUser,
  rootType: StorageRootType,
  rootKey: string,
  relativeDir: string
): Promise<boolean> {
  const logical = relativeDir
    ? `${rootType === "user" ? "u" : "g"}/${rootKey}/${relativeDir}`
    : `${rootType === "user" ? "u" : "g"}/${rootKey}`;
  const result = await authorizeStoragePath(
    env,
    db,
    user,
    logical,
    "write",
    true
  );
  return typeof result !== "string";
}
