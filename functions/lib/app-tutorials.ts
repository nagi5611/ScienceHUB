/**
 * アプリチュートリアル動画（D1 メタデータ + R2 本体）
 */

import { getDb } from "./db";
import { getFiles } from "./r2";
import { createId, now, type Env } from "./types";
import { getAppById, getAppBySlug } from "./apps";

export const TUTORIAL_VIDEO_MAX_BYTES = 80 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
  "video/x-m4v",
]);

export interface TutorialVideoRow {
  id: string;
  app_id: string;
  title: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  r2_key: string;
  position: number;
  created_at: number;
  updated_at: number;
}

export interface PublicTutorialVideo {
  id: string;
  title: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  position: number;
  created_at: number;
  file_url: string;
}

function toPublic(row: TutorialVideoRow, slug: string): PublicTutorialVideo {
  return {
    id: row.id,
    title: row.title,
    filename: row.filename,
    content_type: row.content_type,
    size_bytes: row.size_bytes,
    position: row.position,
    created_at: row.created_at,
    file_url: `/api/apps/${encodeURIComponent(slug)}/tutorials/${encodeURIComponent(row.id)}/file`,
  };
}

/** ファイル名を R2 キー向けに整える */
function sanitizeFilename(filename: string): string {
  const base = filename.replace(/[/\\]/g, "").trim() || "video.mp4";
  return base.slice(0, 180);
}

/** Content-Type と拡張子から許可判定する */
export function resolveTutorialContentType(
  filename: string,
  declaredType: string
): string | null {
  const type = declaredType.toLowerCase().split(";")[0]?.trim() ?? "";
  if (ALLOWED_CONTENT_TYPES.has(type)) {
    return type;
  }

  const lower = filename.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".m4v")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mov")) return "video/quicktime";
  if (lower.endsWith(".mkv")) return "video/x-matroska";
  return null;
}

function tutorialR2Key(appId: string, videoId: string, filename: string): string {
  return `app-tutorials/${appId}/${videoId}/${sanitizeFilename(filename)}`;
}

/** アプリのチュートリアル動画一覧 */
export async function listTutorialVideos(
  db: D1Database,
  appId: string
): Promise<TutorialVideoRow[]> {
  const result = await db
    .prepare(
      `SELECT id, app_id, title, filename, content_type, size_bytes, r2_key, position, created_at, updated_at
       FROM hub_app_tutorial_videos
       WHERE app_id = ?
       ORDER BY position ASC, created_at ASC`
    )
    .bind(appId)
    .all<TutorialVideoRow>();

  return result.results ?? [];
}

/** slug 向けの公開一覧 */
export async function listPublicTutorialVideos(
  db: D1Database,
  slug: string
): Promise<PublicTutorialVideo[] | null> {
  const app = await getAppBySlug(db, slug);
  if (!app) return null;
  const rows = await listTutorialVideos(db, app.id);
  return rows.map((row) => toPublic(row, app.slug));
}

/** 1件取得 */
export async function getTutorialVideo(
  db: D1Database,
  videoId: string
): Promise<TutorialVideoRow | null> {
  const row = await db
    .prepare(
      `SELECT id, app_id, title, filename, content_type, size_bytes, r2_key, position, created_at, updated_at
       FROM hub_app_tutorial_videos WHERE id = ?`
    )
    .bind(videoId)
    .first<TutorialVideoRow>();
  return row ?? null;
}

/** 動画を R2 と D1 に保存する */
export async function createTutorialVideo(
  env: Env,
  appId: string,
  file: File,
  title: string
): Promise<TutorialVideoRow> {
  const db = getDb(env);
  const app = await getAppById(db, appId);
  if (!app) {
    throw new Error("アプリが見つかりません");
  }

  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error("タイトルを入力してください");
  }
  if (trimmedTitle.length > 120) {
    throw new Error("タイトルは120文字以内にしてください");
  }

  const filename = sanitizeFilename(file.name);
  const contentType = resolveTutorialContentType(filename, file.type);
  if (!contentType) {
    throw new Error("対応形式は MP4 / WebM / MOV / MKV です");
  }

  if (file.size <= 0 || file.size > TUTORIAL_VIDEO_MAX_BYTES) {
    throw new Error(`ファイルサイズは 1 バイト以上 ${TUTORIAL_VIDEO_MAX_BYTES / (1024 * 1024)}MB 以下です`);
  }

  const maxPos = await db
    .prepare("SELECT COALESCE(MAX(position), -1) AS max_pos FROM hub_app_tutorial_videos WHERE app_id = ?")
    .bind(appId)
    .first<{ max_pos: number }>();

  const videoId = createId("tutvid");
  const r2Key = tutorialR2Key(appId, videoId, filename);
  const ts = now();

  await getFiles(env).put(r2Key, await file.arrayBuffer(), {
    httpMetadata: { contentType },
  });

  await db
    .prepare(
      `INSERT INTO hub_app_tutorial_videos
        (id, app_id, title, filename, content_type, size_bytes, r2_key, position, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      videoId,
      appId,
      trimmedTitle,
      filename,
      contentType,
      file.size,
      r2Key,
      (maxPos?.max_pos ?? -1) + 1,
      ts,
      ts
    )
    .run();

  const created = await getTutorialVideo(db, videoId);
  if (!created) {
    throw new Error("動画の保存に失敗しました");
  }
  return created;
}

/** タイトルまたは並び順を更新する */
export async function updateTutorialVideo(
  db: D1Database,
  videoId: string,
  patch: { title?: string; position?: number }
): Promise<TutorialVideoRow | null> {
  const existing = await getTutorialVideo(db, videoId);
  if (!existing) return null;

  let title = existing.title;
  if (patch.title !== undefined) {
    const trimmed = patch.title.trim();
    if (!trimmed) throw new Error("タイトルを入力してください");
    if (trimmed.length > 120) throw new Error("タイトルは120文字以内にしてください");
    title = trimmed;
  }

  let position = existing.position;
  if (patch.position !== undefined) {
    if (!Number.isInteger(patch.position) || patch.position < 0) {
      throw new Error("並び順が不正です");
    }
    position = patch.position;
  }

  await db
    .prepare(
      `UPDATE hub_app_tutorial_videos
       SET title = ?, position = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(title, position, now(), videoId)
    .run();

  return getTutorialVideo(db, videoId);
}

/** 隣接と position を入れ替える */
export async function moveTutorialVideo(
  db: D1Database,
  videoId: string,
  direction: "up" | "down"
): Promise<TutorialVideoRow[]> {
  const current = await getTutorialVideo(db, videoId);
  if (!current) {
    throw new Error("動画が見つかりません");
  }

  const videos = await listTutorialVideos(db, current.app_id);
  const index = videos.findIndex((row) => row.id === videoId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  const other = videos[swapIndex];
  if (!other) {
    return videos;
  }

  const ts = now();
  await db.batch([
    db
      .prepare("UPDATE hub_app_tutorial_videos SET position = ?, updated_at = ? WHERE id = ?")
      .bind(other.position, ts, current.id),
    db
      .prepare("UPDATE hub_app_tutorial_videos SET position = ?, updated_at = ? WHERE id = ?")
      .bind(current.position, ts, other.id),
  ]);

  return listTutorialVideos(db, current.app_id);
}

/** 1件削除（R2 含む） */
export async function deleteTutorialVideo(env: Env, videoId: string): Promise<boolean> {
  const db = getDb(env);
  const row = await getTutorialVideo(db, videoId);
  if (!row) return false;

  await getFiles(env).delete(row.r2_key);
  await db.prepare("DELETE FROM hub_app_tutorial_videos WHERE id = ?").bind(videoId).run();
  return true;
}

/** アプリ削除時に R2 オブジェクトを消す */
export async function deleteTutorialObjectsForApp(env: Env, appId: string): Promise<void> {
  const rows = await listTutorialVideos(getDb(env), appId);
  if (rows.length === 0) return;
  await getFiles(env).delete(rows.map((row) => row.r2_key));
}

/** R2 から動画本体を取得する */
export type TutorialByteRange = { offset: number; length?: number } | { suffix: number };

export async function getTutorialVideoObject(
  env: Env,
  row: TutorialVideoRow,
  range?: TutorialByteRange
): Promise<R2ObjectBody | null> {
  const object = range
    ? await getFiles(env).get(row.r2_key, { range })
    : await getFiles(env).get(row.r2_key);
  if (!object || !("body" in object)) {
    return null;
  }
  return object;
}
