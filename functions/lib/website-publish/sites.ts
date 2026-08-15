/**
 * ウェブサイト公開 — サイト CRUD
 */

import { normalizeSlug } from "../auth";
import { createId, now } from "../types";
import {
  MAX_SITES_PER_USER,
  WEBSITE_PUBLISH_APP_SLUG,
} from "./constants";
import { siteR2Prefix } from "./keys";
import type { WebSiteRow } from "./quota";
import { deleteSitePrefix } from "./r2-ops";

const RESERVED_PATH_SLUGS = new Set([
  "api",
  "apps",
  "admin",
  "login",
  "web",
  "join",
  "css",
  "js",
  "icons",
  "privacy",
  "manifest",
  "third-party",
  "design",
  "image-editor",
  "image-converter",
  "cloud-storage",
  "video-editor",
  "video-converter",
  "audio-converter",
  "audio-editor",
  "website-publish",
  "excalidraw",
  "uvcreator",
  "project-management",
  "simulation-request",
  "tennis-motion",
  "3dprint",
]);

const SITE_SELECT =
  "id, owner_user_id, path_slug, title, dir_name, r2_prefix, used_bytes, status, visit_count, last_visit_at, created_at, updated_at";

export interface WebSiteSummary {
  id: string;
  path_slug: string;
  title: string;
  used_bytes: number;
  max_bytes: number;
  status: string;
  public_url: string;
  created_at: number;
  updated_at: number;
  has_index: boolean;
  visit_count: number;
  last_visit_at: number | null;
}

/** path_slug を正規化・検証 */
export function normalizeWebPathSlug(raw: string): string {
  const slug = normalizeSlug(raw);
  if (!slug || slug.length < 2) {
    throw new Error("パスは2文字以上の英数字で指定してください");
  }
  if (RESERVED_PATH_SLUGS.has(slug)) {
    throw new Error("このパスは使用できません");
  }
  return slug;
}

/** ランダム dir_name を生成 */
async function allocateDirName(db: D1Database): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const name = createId("wsd").slice(4, 20);
    const dup = await db
      .prepare("SELECT id FROM web_sites WHERE dir_name = ?")
      .bind(name)
      .first();
    if (!dup) return name;
  }
  return createId("wsd").slice(4);
}

function toSummary(row: WebSiteRow, hasIndex = false): WebSiteSummary {
  return {
    id: row.id,
    path_slug: row.path_slug,
    title: row.title,
    used_bytes: row.used_bytes,
    max_bytes: 5 * 1024 ** 3,
    status: row.status,
    public_url: `/web/${row.path_slug}/`,
    created_at: row.created_at,
    updated_at: row.updated_at,
    has_index: hasIndex,
    visit_count: row.visit_count ?? 0,
    last_visit_at: row.last_visit_at,
  };
}

/** ユーザーのサイト一覧 */
export async function listUserWebSites(
  db: D1Database,
  bucket: R2Bucket,
  userId: string
): Promise<WebSiteSummary[]> {
  const rows = await db
    .prepare(
      `SELECT ${SITE_SELECT} FROM web_sites WHERE owner_user_id = ? ORDER BY updated_at DESC`
    )
    .bind(userId)
    .all<WebSiteRow>();

  const sites = rows.results ?? [];
  const summaries: WebSiteSummary[] = [];

  for (const row of sites) {
    const indexHead = await bucket.head(`${row.r2_prefix}index.html`);
    summaries.push(toSummary(row, indexHead !== null));
  }

  return summaries;
}

/** 所有者のサイトを取得 */
export async function getOwnedWebSite(
  db: D1Database,
  userId: string,
  siteId: string
): Promise<WebSiteRow | null> {
  return db
    .prepare(`SELECT ${SITE_SELECT} FROM web_sites WHERE id = ? AND owner_user_id = ?`)
    .bind(siteId, userId)
    .first<WebSiteRow>();
}

/** path_slug で公開サイトを取得 */
export async function getActiveWebSiteByPathSlug(
  db: D1Database,
  pathSlug: string
): Promise<WebSiteRow | null> {
  return db
    .prepare(
      `SELECT ${SITE_SELECT} FROM web_sites WHERE path_slug = ? AND status = 'active'`
    )
    .bind(pathSlug)
    .first<WebSiteRow>();
}

/** サイト作成 */
export async function createWebSite(
  db: D1Database,
  userId: string,
  title: string,
  pathSlugRaw: string
): Promise<WebSiteRow> {
  const count = await db
    .prepare("SELECT COUNT(*) AS n FROM web_sites WHERE owner_user_id = ?")
    .bind(userId)
    .first<{ n: number }>();

  if ((count?.n ?? 0) >= MAX_SITES_PER_USER) {
    throw new Error(`サイトは最大 ${MAX_SITES_PER_USER} 件まで作成できます`);
  }

  const pathSlug = normalizeWebPathSlug(pathSlugRaw);
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error("タイトルを入力してください");
  }

  const existing = await db
    .prepare("SELECT id FROM web_sites WHERE path_slug = ?")
    .bind(pathSlug)
    .first();
  if (existing) {
    throw new Error("このパスは既に使用されています");
  }

  const dirName = await allocateDirName(db);
  const r2Prefix = siteR2Prefix(dirName);
  const id = createId("wsite");
  const ts = now();

  await db
    .prepare(
      `INSERT INTO web_sites
       (id, owner_user_id, path_slug, title, dir_name, r2_prefix, used_bytes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 0, 'active', ?, ?)`
    )
    .bind(id, userId, pathSlug, trimmedTitle.slice(0, 120), dirName, r2Prefix, ts, ts)
    .run();

  const site = await db
    .prepare(`SELECT ${SITE_SELECT} FROM web_sites WHERE id = ?`)
    .bind(id)
    .first<WebSiteRow>();

  if (!site) throw new Error("サイトの作成に失敗しました");
  return site;
}

/** タイトル更新 */
export async function updateWebSiteTitle(
  db: D1Database,
  userId: string,
  siteId: string,
  title: string
): Promise<WebSiteRow> {
  const trimmed = title.trim();
  if (!trimmed) throw new Error("タイトルを入力してください");

  const site = await getOwnedWebSite(db, userId, siteId);
  if (!site) throw new Error("サイトが見つかりません");

  const ts = now();
  await db
    .prepare(`UPDATE web_sites SET title = ?, updated_at = ? WHERE id = ?`)
    .bind(trimmed.slice(0, 120), ts, siteId)
    .run();

  return { ...site, title: trimmed.slice(0, 120), updated_at: ts };
}

/** サイト削除 */
export async function deleteWebSite(
  db: D1Database,
  bucket: R2Bucket,
  userId: string,
  siteId: string
): Promise<void> {
  const site = await getOwnedWebSite(db, userId, siteId);
  if (!site) throw new Error("サイトが見つかりません");

  await deleteSitePrefix(bucket, site.r2_prefix);
  await db.prepare("DELETE FROM web_sites WHERE id = ?").bind(siteId).run();
}

export const WEB_APP_SLUG = WEBSITE_PUBLISH_APP_SLUG;
