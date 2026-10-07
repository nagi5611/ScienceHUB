/**
 * ダッシュボード用クラウドストレージ使用量サマリー
 */

import type { Env, SessionUser } from "../types";
import { canUserAccessApp } from "../apps";
import { getRootGroup } from "../groups";
import { TRASH_QUOTA_BYTES } from "./constants";
import { buildVisibleRoots, type StorageRootEntry } from "./list";
import type { StorageRootRow } from "./quota";
import { getUserWebSitesUsedBytes } from "./user-combined-quota";
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

export interface StorageRootManifestRow {
  type: "user" | "group";
  key: string;
  path: string;
  group_label: string;
}

export interface StorageManifestResult {
  enabled: boolean;
  roots: StorageRootManifestRow[];
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

function manifestLabel(entry: StorageRootEntry): string {
  return entry.type === "user" ? "個人" : entry.label;
}

async function sortVisibleRootEntries(
  db: D1Database,
  visibleRoots: StorageRootEntry[]
): Promise<StorageRootEntry[]> {
  const rootGroup = await getRootGroup(db);
  let rootGroupSlug: string | null = null;
  if (rootGroup) {
    const slugRow = await db
      .prepare("SELECT slug FROM hub_groups WHERE id = ?")
      .bind(rootGroup.id)
      .first<{ slug: string }>();
    rootGroupSlug = slugRow?.slug ?? null;
  }
  const sorted = [...visibleRoots];
  sorted.sort((a, b) =>
    sortOverviewEntries({ entry: a }, { entry: b }, rootGroupSlug)
  );
  return sorted;
}

function buildOverviewRow(
  entry: StorageRootEntry,
  root: StorageRootRow,
  trashUsed: number,
  websiteUsed: number
): StorageOverviewRow {
  const usedBytes =
    entry.type === "user" ? root.used_bytes + websiteUsed : root.used_bytes;
  const available = Math.max(0, root.quota_bytes - usedBytes);
  const trashAvailable = Math.max(0, TRASH_QUOTA_BYTES - trashUsed);

  return {
    group_label: manifestLabel(entry),
    path: entry.path,
    type: entry.type,
    quota_bytes: root.quota_bytes,
    used_bytes: usedBytes,
    available_bytes: available,
    usage_ratio: calcRatio(usedBytes, root.quota_bytes),
    trash_quota_bytes: TRASH_QUOTA_BYTES,
    trash_used_bytes: trashUsed,
    trash_available_bytes: trashAvailable,
    trash_usage_ratio: calcRatio(trashUsed, TRASH_QUOTA_BYTES),
  };
}

/** ダッシュボード用: ルート一覧のみ（使用量は別 API） */
export async function getStorageManifestForDashboard(
  db: D1Database,
  user: SessionUser
): Promise<StorageManifestResult> {
  const enabled = await canUserAccessApp(db, user.id, "cloud-storage");
  if (!enabled) {
    return { enabled: false, roots: [] };
  }

  const visibleRoots = await buildVisibleRoots(
    db,
    user.id,
    user.username,
    user.is_admin
  );
  const sorted = await sortVisibleRootEntries(db, visibleRoots);

  return {
    enabled: true,
    roots: sorted.map((entry) => ({
      type: entry.type,
      key: entry.key,
      path: entry.path,
      group_label: manifestLabel(entry),
    })),
  };
}

/** ダッシュボード用: 1 ルートの使用量 */
export async function getStorageOverviewRowForDashboard(
  env: Env,
  db: D1Database,
  user: SessionUser,
  rootType: "user" | "group",
  rootKey: string
): Promise<StorageOverviewRow | null> {
  const enabled = await canUserAccessApp(db, user.id, "cloud-storage");
  if (!enabled) return null;

  const visibleRoots = await buildVisibleRoots(
    db,
    user.id,
    user.username,
    user.is_admin
  );
  const entry = visibleRoots.find((r) => r.type === rootType && r.key === rootKey);
  if (!entry) return null;

  if (rootType === "user") {
    await ensureUserStorageRoot(
      env,
      db,
      user.id,
      user.username,
      user.role_slug
    );
  } else {
    const group = await db
      .prepare("SELECT id, slug FROM hub_groups WHERE slug = ?")
      .bind(rootKey)
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

  const root = await resolveRootForPath(db, entry.type, entry.key);
  if (!root) return null;

  const trashMap = await getTrashBytesByRootId(db, [root.id]);
  const trashUsed = trashMap.get(root.id) ?? 0;

  let websiteUsed = 0;
  if (entry.type === "user" && root.user_id) {
    websiteUsed = await getUserWebSitesUsedBytes(db, root.user_id);
  }

  return buildOverviewRow(entry, root, trashUsed, websiteUsed);
}

/** ログインユーザー向けストレージ使用量一覧 */
export async function getStorageOverviewForDashboard(
  env: Env,
  db: D1Database,
  user: SessionUser
): Promise<StorageOverviewResult> {
  const manifest = await getStorageManifestForDashboard(db, user);
  if (!manifest.enabled) {
    return { enabled: false, roots: [] };
  }

  const roots: StorageOverviewRow[] = [];
  for (const row of manifest.roots) {
    const overview = await getStorageOverviewRowForDashboard(
      env,
      db,
      user,
      row.type,
      row.key
    );
    if (overview) roots.push(overview);
  }

  return { enabled: true, roots };
}
