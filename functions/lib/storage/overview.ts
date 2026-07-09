/**
 * ダッシュボード用クラウドストレージ使用量サマリー
 */

import type { Env, SessionUser } from "../types";
import { canUserAccessApp } from "../apps";
import { getRootGroup } from "../groups";
import { TRASH_QUOTA_BYTES } from "./constants";
import { buildVisibleRoots, type StorageRootEntry } from "./list";
import type { StorageRootRow } from "./quota";
import {
  ensureGroupStorageRoot,
  ensureUserStorageRoot,
  resolveRootForPath,
} from "./roots";

export interface StorageOverviewRow {
  group_label: string;
  path: string;
  type: "user" | "group";
  quota_bytes: number;
  used_bytes: number;
  available_bytes: number;
  usage_ratio: number;
  trash_quota_bytes: number;
  trash_used_bytes: number;
  trash_available_bytes: number;
  trash_usage_ratio: number;
}

export interface StorageOverviewResult {
  enabled: boolean;
  roots: StorageOverviewRow[];
}

function calcRatio(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

/** ルート ID ごとのごみ箱使用量を一括取得 */
async function getTrashBytesByRootId(
  db: D1Database,
  rootIds: string[]
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (rootIds.length === 0) return map;

  const placeholders = rootIds.map(() => "?").join(",");
  const rows = await db
    .prepare(
      `SELECT root_id, COALESCE(SUM(size_bytes), 0) AS total
       FROM storage_trash_items
       WHERE root_id IN (${placeholders})
       GROUP BY root_id`
    )
    .bind(...rootIds)
    .all<{ root_id: string; total: number }>();

  for (const row of rows.results ?? []) {
    map.set(row.root_id, Number(row.total) || 0);
  }
  return map;
}

function sortOverviewEntries(
  a: { entry: StorageRootEntry },
  b: { entry: StorageRootEntry },
  rootGroupSlug: string | null
): number {
  if (a.entry.type === "user" && b.entry.type !== "user") return -1;
  if (b.entry.type === "user" && a.entry.type !== "user") return 1;
  if (rootGroupSlug) {
    if (a.entry.type === "group" && a.entry.key === rootGroupSlug) return -1;
    if (b.entry.type === "group" && b.entry.key === rootGroupSlug) return 1;
  }
  return a.entry.label.localeCompare(b.entry.label, "ja");
}

/** ログインユーザー向けストレージ使用量一覧 */
export async function getStorageOverviewForDashboard(
  env: Env,
  db: D1Database,
  user: SessionUser
): Promise<StorageOverviewResult> {
  const enabled = await canUserAccessApp(db, user.id, "cloud-storage");
  if (!enabled) {
    return { enabled: false, roots: [] };
  }

  await ensureUserStorageRoot(
    env,
    db,
    user.id,
    user.username,
    user.role_slug
  );

  const visibleRoots = await buildVisibleRoots(
    db,
    user.id,
    user.username,
    user.is_admin
  );

  for (const root of visibleRoots) {
    if (root.type !== "group") continue;
    const group = await db
      .prepare("SELECT id, slug FROM hub_groups WHERE slug = ?")
      .bind(root.key)
      .first<{ id: string; slug: string }>();
    if (group) {
      await ensureGroupStorageRoot(
        env,
        db,
        group.id,
        group.slug,
        user.username
      );
    }
  }

  const resolved: Array<{ entry: StorageRootEntry; root: StorageRootRow }> =
    [];
  for (const entry of visibleRoots) {
    const root = await resolveRootForPath(db, entry.type, entry.key);
    if (root) resolved.push({ entry, root });
  }

  const trashMap = await getTrashBytesByRootId(
    db,
    resolved.map((row) => row.root.id)
  );

  const rootGroup = await getRootGroup(db);
  let rootGroupSlug: string | null = null;
  if (rootGroup) {
    const slugRow = await db
      .prepare("SELECT slug FROM hub_groups WHERE id = ?")
      .bind(rootGroup.id)
      .first<{ slug: string }>();
    rootGroupSlug = slugRow?.slug ?? null;
  }
  resolved.sort((a, b) => sortOverviewEntries(a, b, rootGroupSlug));

  const roots: StorageOverviewRow[] = resolved.map(({ entry, root }) => {
    const trashUsed = trashMap.get(root.id) ?? 0;
    const available = Math.max(0, root.quota_bytes - root.used_bytes);
    const trashAvailable = Math.max(0, TRASH_QUOTA_BYTES - trashUsed);

    return {
      group_label: entry.type === "user" ? "個人" : entry.label,
      path: entry.path,
      type: entry.type,
      quota_bytes: root.quota_bytes,
      used_bytes: root.used_bytes,
      available_bytes: available,
      usage_ratio: calcRatio(root.used_bytes, root.quota_bytes),
      trash_quota_bytes: TRASH_QUOTA_BYTES,
      trash_used_bytes: trashUsed,
      trash_available_bytes: trashAvailable,
      trash_usage_ratio: calcRatio(trashUsed, TRASH_QUOTA_BYTES),
    };
  });

  return { enabled: true, roots };
}
