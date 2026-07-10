/**
 * Excalidraw ノート・共有リンク
 */

import type { SessionUser } from "./types";
import { createId, now } from "./types";

const APP_SLUG = "excalidraw";

export interface ExcalidrawScene {
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
}

export interface ExcalidrawNoteSummary {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
  share_url: string | null;
  share_token: string | null;
  scene: ExcalidrawScene;
}

export interface ExcalidrawNoteDetail extends ExcalidrawNoteSummary {
  scene: ExcalidrawScene;
  owner_user_id: string;
  group_id: string | null;
  /** グループ共有ノートで編集可能 */
  can_edit: boolean;
}

interface NoteRow {
  id: string;
  owner_user_id: string;
  group_id: string | null;
  title: string;
  scene_json: string;
  created_at: number;
  updated_at: number;
}

interface ShareRow {
  id: string;
  note_id: string;
  token: string;
  revoked_at: number | null;
  created_at: number;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/** 共有トークンを生成 */
function generateShareToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

/** 空のシーン */
export function emptyScene(): ExcalidrawScene {
  return { elements: [], appState: {}, files: {} };
}

/** scene_json をパース */
export function parseScene(raw: string): ExcalidrawScene {
  try {
    const data = JSON.parse(raw) as Partial<ExcalidrawScene>;
    return {
      elements: Array.isArray(data.elements) ? data.elements : [],
      appState:
        data.appState && typeof data.appState === "object" ? data.appState : {},
      files: data.files && typeof data.files === "object" ? data.files : {},
    };
  } catch {
    return emptyScene();
  }
}

/** シーンを正規化して JSON 文字列化 */
export function serializeScene(input: unknown): string {
  const scene = normalizeScene(input);
  return JSON.stringify(scene);
}

/** クライアント入力をシーンに正規化 */
export function normalizeScene(input: unknown): ExcalidrawScene {
  if (!input || typeof input !== "object") return emptyScene();
  const data = input as Partial<ExcalidrawScene>;
  return {
    elements: Array.isArray(data.elements) ? data.elements : [],
    appState:
      data.appState && typeof data.appState === "object"
        ? (data.appState as Record<string, unknown>)
        : {},
    files:
      data.files && typeof data.files === "object"
        ? (data.files as Record<string, unknown>)
        : {},
  };
}

/** 共有ページ URL */
export function buildExcalidrawShareUrl(request: Request, token: string): string {
  const origin = new URL(request.url).origin;
  return `${origin}/excalidraw-share/?t=${encodeURIComponent(token)}`;
}

const NOTE_SELECT =
  "id, owner_user_id, group_id, title, scene_json, created_at, updated_at";

/** グループメンバーか */
async function isGroupMember(
  db: D1Database,
  userId: string,
  groupId: string
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1 AS ok FROM user_group_memberships
       WHERE user_id = ? AND group_id = ?`
    )
    .bind(userId, groupId)
    .first<{ ok: number }>();
  return row != null;
}

/** ノートへのアクセス権（所有者またはグループ共有） */
async function userCanAccessNote(
  db: D1Database,
  userId: string,
  row: NoteRow
): Promise<boolean> {
  if (row.owner_user_id === userId) return true;
  if (!row.group_id) return false;
  return isGroupMember(db, userId, row.group_id);
}

/** ノートの編集権（アクセス権と同じ — グループメンバーは共同編集可） */
async function userCanEditNote(
  db: D1Database,
  userId: string,
  row: NoteRow
): Promise<boolean> {
  return userCanAccessNote(db, userId, row);
}

function toDetail(
  row: NoteRow,
  request: Request,
  share: ShareRow | null,
  canEdit: boolean
): ExcalidrawNoteDetail {
  return {
    ...toSummary(row, request, share),
    scene: parseScene(row.scene_json),
    owner_user_id: row.owner_user_id,
    group_id: row.group_id ?? null,
    can_edit: canEdit,
  };
}

/** ノートの有効な共有リンクを取得 */
async function getActiveShare(
  db: D1Database,
  noteId: string
): Promise<ShareRow | null> {
  return (
    (await db
      .prepare(
        `SELECT id, note_id, token, revoked_at, created_at
         FROM excalidraw_share_links
         WHERE note_id = ? AND revoked_at IS NULL
         ORDER BY created_at DESC
         LIMIT 1`
      )
      .bind(noteId)
      .first<ShareRow>()) ?? null
  );
}

function toSummary(
  row: NoteRow,
  request: Request,
  share: ShareRow | null
): ExcalidrawNoteSummary {
  return {
    id: row.id,
    title: row.title,
    created_at: row.created_at,
    updated_at: row.updated_at,
    share_token: share?.token ?? null,
    share_url: share ? buildExcalidrawShareUrl(request, share.token) : null,
    scene: parseScene(row.scene_json),
  };
}

/** 自分のノート一覧 */
export async function listNotes(
  db: D1Database,
  userId: string,
  request: Request
): Promise<ExcalidrawNoteSummary[]> {
  const result = await db
    .prepare(
      `SELECT ${NOTE_SELECT}
       FROM excalidraw_notes
       WHERE owner_user_id = ?
       ORDER BY updated_at DESC`
    )
    .bind(userId)
    .all<NoteRow>();

  const rows = result.results ?? [];
  const summaries: ExcalidrawNoteSummary[] = [];
  for (const row of rows) {
    const share = await getActiveShare(db, row.id);
    summaries.push(toSummary(row, request, share));
  }
  return summaries;
}

/** ノート詳細（所有者のみ） */
export async function getOwnedNote(
  db: D1Database,
  userId: string,
  noteId: string,
  request: Request
): Promise<ExcalidrawNoteDetail | null> {
  const row = await db
    .prepare(
      `SELECT ${NOTE_SELECT}
       FROM excalidraw_notes
       WHERE id = ? AND owner_user_id = ?`
    )
    .bind(noteId, userId)
    .first<NoteRow>();
  if (!row) return null;
  const share = await getActiveShare(db, row.id);
  return toDetail(row, request, share, true);
}

/** ノート詳細（所有者またはグループメンバー） */
export async function getAccessibleNote(
  db: D1Database,
  userId: string,
  noteId: string,
  request: Request
): Promise<ExcalidrawNoteDetail | null> {
  const row = await db
    .prepare(`SELECT ${NOTE_SELECT} FROM excalidraw_notes WHERE id = ?`)
    .bind(noteId)
    .first<NoteRow>();
  if (!row) return null;
  const canAccess = await userCanAccessNote(db, userId, row);
  if (!canAccess) return null;
  const canEdit = await userCanEditNote(db, userId, row);
  const share = await getActiveShare(db, row.id);
  return toDetail(row, request, share, canEdit);
}

/** ノート作成 */
export async function createNote(
  db: D1Database,
  user: SessionUser,
  titleInput: unknown,
  _request: Request
): Promise<ExcalidrawNoteDetail> {
  const title =
    typeof titleInput === "string" && titleInput.trim()
      ? titleInput.trim().slice(0, 120)
      : "無題のノート";
  const id = createId("exn");
  const ts = now();
  const scene = emptyScene();

  await db
    .prepare(
      `INSERT INTO excalidraw_notes
         (id, owner_user_id, group_id, title, scene_json, created_at, updated_at)
       VALUES (?, ?, NULL, ?, ?, ?, ?)`
    )
    .bind(id, user.id, title, JSON.stringify(scene), ts, ts)
    .run();

  return {
    id,
    title,
    created_at: ts,
    updated_at: ts,
    share_token: null,
    share_url: null,
    scene,
    owner_user_id: user.id,
    group_id: null,
    can_edit: true,
  };
}

/** グループ共有ノートを作成（プロジェクトノート用） */
export async function createGroupNote(
  db: D1Database,
  userId: string,
  groupId: string,
  titleInput: string
): Promise<string> {
  const title =
    typeof titleInput === "string" && titleInput.trim()
      ? titleInput.trim().slice(0, 120)
      : "無題のノート";
  const id = createId("exn");
  const ts = now();
  const scene = emptyScene();

  await db
    .prepare(
      `INSERT INTO excalidraw_notes
         (id, owner_user_id, group_id, title, scene_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, userId, groupId, title, JSON.stringify(scene), ts, ts)
    .run();

  return id;
}

/** タイトル更新 */
export async function updateNoteTitle(
  db: D1Database,
  userId: string,
  noteId: string,
  titleInput: unknown,
  request: Request
): Promise<ExcalidrawNoteDetail | null> {
  const title =
    typeof titleInput === "string" && titleInput.trim()
      ? titleInput.trim().slice(0, 120)
      : null;
  if (!title) throw new Error("タイトルを入力してください");

  const ts = now();
  const row = await db
    .prepare(`SELECT ${NOTE_SELECT} FROM excalidraw_notes WHERE id = ?`)
    .bind(noteId)
    .first<NoteRow>();
  if (!row) return null;
  const canEdit = await userCanEditNote(db, userId, row);
  if (!canEdit) return null;

  await db
    .prepare(
      `UPDATE excalidraw_notes
       SET title = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(title, ts, noteId)
    .run();

  return getAccessibleNote(db, userId, noteId, request);
}

/** シーン保存（所有者） */
export async function saveOwnedNoteScene(
  db: D1Database,
  userId: string,
  noteId: string,
  sceneInput: unknown,
  request: Request
): Promise<ExcalidrawNoteDetail | null> {
  return saveAccessibleNoteScene(db, userId, noteId, sceneInput, request);
}

/** シーン保存（所有者またはグループメンバー） */
export async function saveAccessibleNoteScene(
  db: D1Database,
  userId: string,
  noteId: string,
  sceneInput: unknown,
  request: Request
): Promise<ExcalidrawNoteDetail | null> {
  const row = await db
    .prepare(`SELECT ${NOTE_SELECT} FROM excalidraw_notes WHERE id = ?`)
    .bind(noteId)
    .first<NoteRow>();
  if (!row) return null;
  const canEdit = await userCanEditNote(db, userId, row);
  if (!canEdit) return null;

  const sceneJson = serializeScene(sceneInput);
  const ts = now();
  await db
    .prepare(
      `UPDATE excalidraw_notes
       SET scene_json = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(sceneJson, ts, noteId)
    .run();
  return getAccessibleNote(db, userId, noteId, request);
}

/** 共有トークン経由でシーン保存 */
export async function saveSharedNoteScene(
  db: D1Database,
  token: string,
  sceneInput: unknown
): Promise<{ note_id: string } | null> {
  const share = await getShareByToken(db, token);
  if (!share) return null;
  const sceneJson = serializeScene(sceneInput);
  const ts = now();
  await db
    .prepare(
      `UPDATE excalidraw_notes
       SET scene_json = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(sceneJson, ts, share.note_id)
    .run();
  return { note_id: share.note_id };
}

/** ノート削除 */
export async function deleteNote(
  db: D1Database,
  userId: string,
  noteId: string
): Promise<boolean> {
  const result = await db
    .prepare(`DELETE FROM excalidraw_notes WHERE id = ? AND owner_user_id = ?`)
    .bind(noteId, userId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

/** 共有リンク作成（既存があれば返す） */
export async function createOrGetShareLink(
  db: D1Database,
  user: SessionUser,
  noteId: string,
  request: Request
): Promise<{ token: string; url: string }> {
  const note = await getOwnedNote(db, user.id, noteId, request);
  if (!note) throw new Error("ノートが見つかりません");

  const existing = await getActiveShare(db, noteId);
  if (existing) {
    return {
      token: existing.token,
      url: buildExcalidrawShareUrl(request, existing.token),
    };
  }

  const id = createId("exs");
  const token = generateShareToken();
  const ts = now();
  await db
    .prepare(
      `INSERT INTO excalidraw_share_links
         (id, note_id, token, created_by_user_id, revoked_at, created_at)
       VALUES (?, ?, ?, ?, NULL, ?)`
    )
    .bind(id, noteId, token, user.id, ts)
    .run();

  return { token, url: buildExcalidrawShareUrl(request, token) };
}

/** 共有リンク無効化 */
export async function revokeShareLink(
  db: D1Database,
  userId: string,
  noteId: string
): Promise<boolean> {
  const owned = await db
    .prepare(
      `SELECT id FROM excalidraw_notes WHERE id = ? AND owner_user_id = ?`
    )
    .bind(noteId, userId)
    .first<{ id: string }>();
  if (!owned) return false;

  const ts = now();
  const result = await db
    .prepare(
      `UPDATE excalidraw_share_links
       SET revoked_at = ?
       WHERE note_id = ? AND revoked_at IS NULL`
    )
    .bind(ts, noteId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

/** トークンから共有情報 */
export async function getShareByToken(
  db: D1Database,
  token: string
): Promise<(ShareRow & { title: string; scene_json: string }) | null> {
  return (
    (await db
      .prepare(
        `SELECT s.id, s.note_id, s.token, s.revoked_at, s.created_at,
                n.title, n.scene_json
         FROM excalidraw_share_links s
         JOIN excalidraw_notes n ON n.id = s.note_id
         WHERE s.token = ? AND s.revoked_at IS NULL`
      )
      .bind(token)
      .first<ShareRow & { title: string; scene_json: string }>()) ?? null
  );
}

/** 公開共有情報 */
export async function getPublicShareInfo(
  db: D1Database,
  token: string,
  request: Request
): Promise<{
  note_id: string;
  title: string;
  scene: ExcalidrawScene;
  share_url: string;
} | null> {
  const share = await getShareByToken(db, token);
  if (!share) return null;
  return {
    note_id: share.note_id,
    title: share.title,
    scene: parseScene(share.scene_json),
    share_url: buildExcalidrawShareUrl(request, token),
  };
}

export { APP_SLUG as EXCALIDRAW_APP_SLUG };
