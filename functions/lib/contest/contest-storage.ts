// functions/lib/contest/contest-storage.ts
import { getSessionUserById } from '../auth';
import type { Env, SessionUser } from '../types';
import type { Reservation } from '../3dprint/reservations';
import { updateReservationContestStorage } from '../3dprint/reservations';
import { getFiles } from '../r2';
import {
  buildLogicalPath,
  buildAutoRenameName,
  folderMetaKey,
  parseLogicalPath,
  sanitizeFilename,
  toR2Key,
} from '../storage/keys';
import { deleteStoragePath } from '../storage/operations';
import { ensureGroupStorageRoot } from '../storage/roots';
import { createFolderMeta, writeMetaJson } from '../storage/meta';
import {
  initiateStorageUpload,
  listExistingFilenames,
  simpleStorageUpload,
} from '../storage/upload';
import { getContestStorageGroupSlug } from './contest-app-settings';

export const CONTEST_STORAGE_ROOT_FOLDER = '.造形物コンテスト';
export const CONTEST_STORAGE_SUBMISSIONS_FOLDER = '提出ファイル';

const INVALID_FILENAME_CHAR = /[\\/:*?"<>|\u0000-\u001f]/g;

/** ファイル名の各パーツから無効文字を除去 */
export function sanitizeContestFilenamePart(part: string): string {
  return part.replace(INVALID_FILENAME_CHAR, '').replace(/\s+/g, ' ').trim();
}

/** 予約日・クラス・出席番号・名前・タイトルから保存ファイル名を生成 */
export function buildContestSubmissionStorageFilename(reservation: Reservation): string {
  const extMatch = reservation.stl_filename.match(/(\.[a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : '.stl';

  const datePart = sanitizeContestFilenamePart(reservation.desired_date);
  return buildContestSubmissionStorageFilenameParts(
    datePart,
    reservation.homeroom,
    reservation.student_number,
    reservation.student_name,
    reservation.title,
    ext
  );
}

export interface ContestSelfPrintStorageSource {
  id: string;
  user_id: string;
  homeroom: string;
  student_number: number;
  student_name: string;
  title: string;
  stl_filename: string;
  stl_r2_key: string;
  stl_submitted_at: string;
  contest_storage_path: string | null;
  contest_storage_filename: string | null;
}

function buildContestSubmissionStorageFilenameParts(
  datePart: string,
  homeroom: string,
  studentNumber: number,
  studentName: string,
  title: string,
  ext: string
): string {
  const classPart = sanitizeContestFilenamePart(homeroom);
  const numberPart = sanitizeContestFilenamePart(String(studentNumber));
  const namePart = sanitizeContestFilenamePart(studentName);
  const titlePart = sanitizeContestFilenamePart(title);
  const safeDate = sanitizeContestFilenamePart(datePart);

  let base = [safeDate, classPart, numberPart, namePart, titlePart].filter(Boolean).join(' ');
  if (!base) base = '提出';
  const maxBaseLen = Math.max(1, 255 - ext.length);
  if (base.length > maxBaseLen) {
    base = base.slice(0, maxBaseLen);
  }

  return sanitizeFilename(`${base}${ext}`);
}

/** 自己印刷の STL を contest ストレージへ同期（print_reservations なし） */
export async function syncContestSelfPrintSubmissionToStorage(
  env: Env,
  db: D1Database,
  app: ContestSelfPrintStorageSource
): Promise<{ path: string; filename: string } | null> {
  const groupSlug = await getContestStorageGroupSlug(db);
  if (!groupSlug) return null;

  const user = await getSessionUserById(env, db, app.user_id);
  if (!user) {
    console.error('contest storage sync: user not found', app.user_id);
    return null;
  }

  await ensureContestStorageDirectories(env, db, user, groupSlug);

  const stlObject = await env.FILES.get(app.stl_r2_key);
  if (!stlObject) {
    console.error('contest storage sync: stl missing', app.stl_r2_key);
    return null;
  }

  const body = await stlObject.arrayBuffer();
  const extMatch = app.stl_filename.match(/(\.[a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : '.stl';
  const datePart = app.stl_submitted_at.slice(0, 10);
  const desiredFilename = buildContestSubmissionStorageFilenameParts(
    datePart,
    app.homeroom,
    app.student_number,
    app.student_name,
    app.title,
    ext
  );
  const resolvedFilename = await resolveContestSubmissionFilename(
    env,
    groupSlug,
    desiredFilename,
    app.contest_storage_path ?? null
  );

  const relativeDir = submissionsRelativeDir();
  const targetLogical = buildLogicalPath(
    'group',
    groupSlug,
    `${relativeDir}/${resolvedFilename}`
  );

  if (app.contest_storage_path && app.contest_storage_path !== targetLogical) {
    await removeStorageFileIfExists(env, db, app.contest_storage_path);
  }

  const targetParsed = parseLogicalPath(targetLogical);
  if (targetParsed) {
    await removeStorageFileIfExists(env, db, targetLogical);
  }

  const initiated = await initiateStorageUpload(
    env,
    db,
    user,
    'group',
    groupSlug,
    relativeDir,
    desiredFilename,
    body.byteLength,
    { forcedResolvedFilename: resolvedFilename, contestGroupSubmissionSync: true }
  );

  if (initiated.mode !== 'simple') {
    throw new Error('提出ファイルのサイズは現在の設定では同期できません');
  }

  const uploaded = await simpleStorageUpload(env, db, user, initiated.sessionId, body);

  return { path: uploaded.path, filename: resolvedFilename };
}

/** グループ配下の提出用ディレクトリ（論理パス） */
export function buildContestSubmissionsLogicalDir(groupSlug: string): string {
  return buildLogicalPath(
    'group',
    groupSlug,
    `${CONTEST_STORAGE_ROOT_FOLDER}/${CONTEST_STORAGE_SUBMISSIONS_FOLDER}`
  );
}

function submissionsRelativeDir(): string {
  return `${CONTEST_STORAGE_ROOT_FOLDER}/${CONTEST_STORAGE_SUBMISSIONS_FOLDER}`;
}

async function folderExists(
  env: Env,
  groupSlug: string,
  relativeDir: string
): Promise<boolean> {
  const bucket = getFiles(env);
  const metaKey = folderMetaKey('group', groupSlug, relativeDir);
  const head = await bucket.head(metaKey);
  return head !== null;
}

async function ensureFolderMeta(
  env: Env,
  groupSlug: string,
  relativeDir: string,
  createdByUsername: string
): Promise<void> {
  if (await folderExists(env, groupSlug, relativeDir)) return;
  const bucket = getFiles(env);
  const meta = createFolderMeta(createdByUsername, 'group');
  await writeMetaJson(bucket, folderMetaKey('group', groupSlug, relativeDir), meta);
}

/** 集約用ディレクトリツリーを作成（既存はスキップ） */
export async function ensureContestStorageDirectories(
  env: Env,
  db: D1Database,
  _user: SessionUser,
  groupSlug: string
): Promise<void> {
  const group = await db
    .prepare('SELECT id, slug FROM hub_groups WHERE slug = ?')
    .bind(groupSlug)
    .first<{ id: string; slug: string }>();
  if (!group) throw new Error('グループが見つかりません');

  const metaUser = _user.username || 'contest-sync';
  await ensureGroupStorageRoot(env, db, group.id, group.slug, metaUser);

  await ensureFolderMeta(env, groupSlug, CONTEST_STORAGE_ROOT_FOLDER, metaUser);
  await ensureFolderMeta(
    env,
    groupSlug,
    `${CONTEST_STORAGE_ROOT_FOLDER}/${CONTEST_STORAGE_SUBMISSIONS_FOLDER}`,
    metaUser
  );
}

/** 上書きまたは (1)(2) 付きで保存ファイル名を決定 */
export async function resolveContestSubmissionFilename(
  env: Env,
  groupSlug: string,
  desiredFilename: string,
  previousStoragePath: string | null
): Promise<string> {
  const relativeDir = submissionsRelativeDir();
  const safeDesired = sanitizeFilename(desiredFilename);
  const existing = await listExistingFilenames(env, 'group', groupSlug, relativeDir);

  let previousBasename: string | null = null;
  if (previousStoragePath) {
    const prev = parseLogicalPath(previousStoragePath);
    if (
      prev &&
      prev.rootType === 'group' &&
      prev.rootKey === groupSlug &&
      prev.relativePath.startsWith(`${relativeDir}/`)
    ) {
      const name = prev.relativePath.slice(relativeDir.length + 1);
      if (name && !name.includes('/')) {
        previousBasename = name;
      }
    }
  }

  if (!existing.has(safeDesired)) {
    return safeDesired;
  }

  if (previousBasename === safeDesired) {
    return safeDesired;
  }

  let index = 1;
  while (index < 10000) {
    const candidate = buildAutoRenameName(safeDesired, index);
    if (!existing.has(candidate)) return candidate;
    index++;
  }

  throw new Error('同名ファイルが多すぎます');
}

/** Deletes self-print upload R2 object and synced contest storage file for an application. */
export async function cleanupContestApplicationSubmissionFiles(
  env: Env,
  db: D1Database,
  app: {
    stl_r2_key: string | null;
    contest_storage_path: string | null;
  }
): Promise<void> {
  const stlKey = app.stl_r2_key?.trim();
  if (stlKey) {
    try {
      await env.FILES.delete(stlKey);
    } catch (err) {
      console.error('contest withdraw: failed to delete self-print stl', err);
    }
  }
  if (app.contest_storage_path) {
    try {
      await removeStorageFileIfExists(env, db, app.contest_storage_path);
    } catch (err) {
      console.error('contest withdraw: failed to delete contest storage file', err);
    }
  }
}

async function removeStorageFileIfExists(
  env: Env,
  db: D1Database,
  logicalPath: string
): Promise<void> {
  const parsed = parseLogicalPath(logicalPath);
  if (!parsed || !parsed.relativePath) return;
  const bucket = getFiles(env);
  const r2Key = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
  const head = await bucket.head(r2Key);
  if (!head) return;
  await deleteStoragePath(env, db, parsed, false);
}

/** 設定済みなら R2 の提出 STL をグループクラウドストレージへ同期 */
export async function syncContestSubmissionToStorage(
  env: Env,
  db: D1Database,
  reservation: Reservation
): Promise<{ path: string; filename: string } | null> {
  const groupSlug = await getContestStorageGroupSlug(db);
  if (!groupSlug) return null;

  const user = await getSessionUserById(env, db, reservation.user_id);
  if (!user) {
    console.error('contest storage sync: user not found', reservation.user_id);
    return null;
  }

  await ensureContestStorageDirectories(env, db, user, groupSlug);

  const stlObject = await env.FILES.get(reservation.stl_r2_key);
  if (!stlObject) {
    console.error('contest storage sync: stl missing', reservation.stl_r2_key);
    return null;
  }

  const body = await stlObject.arrayBuffer();
  const desiredFilename = buildContestSubmissionStorageFilename(reservation);
  const resolvedFilename = await resolveContestSubmissionFilename(
    env,
    groupSlug,
    desiredFilename,
    reservation.contest_storage_path ?? null
  );

  const relativeDir = submissionsRelativeDir();
  const targetLogical = buildLogicalPath(
    'group',
    groupSlug,
    `${relativeDir}/${resolvedFilename}`
  );

  if (
    reservation.contest_storage_path &&
    reservation.contest_storage_path !== targetLogical
  ) {
    await removeStorageFileIfExists(env, db, reservation.contest_storage_path);
  }

  const targetParsed = parseLogicalPath(targetLogical);
  if (targetParsed) {
    await removeStorageFileIfExists(env, db, targetLogical);
  }

  const initiated = await initiateStorageUpload(
    env,
    db,
    user,
    'group',
    groupSlug,
    relativeDir,
    desiredFilename,
    body.byteLength,
    { forcedResolvedFilename: resolvedFilename, contestGroupSubmissionSync: true }
  );

  if (initiated.mode !== 'simple') {
    throw new Error('提出ファイルのサイズは現在の設定では同期できません');
  }

  const uploaded = await simpleStorageUpload(env, db, user, initiated.sessionId, body);

  await updateReservationContestStorage(db, reservation.id, {
    contest_storage_path: uploaded.path,
    contest_storage_filename: resolvedFilename,
  });

  return { path: uploaded.path, filename: resolvedFilename };
}
