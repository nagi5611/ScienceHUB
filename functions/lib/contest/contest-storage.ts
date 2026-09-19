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
import { createStorageDirectory, deleteStoragePath } from '../storage/operations';
import { ensureGroupStorageRoot } from '../storage/roots';
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
  const classPart = sanitizeContestFilenamePart(reservation.homeroom);
  const numberPart = sanitizeContestFilenamePart(String(reservation.student_number));
  const namePart = sanitizeContestFilenamePart(reservation.student_name);
  const titlePart = sanitizeContestFilenamePart(reservation.title);

  let base = [datePart, classPart, numberPart, namePart, titlePart].filter(Boolean).join(' ');
  if (!base) base = '提出';
  const maxBaseLen = Math.max(1, 255 - ext.length);
  if (base.length > maxBaseLen) {
    base = base.slice(0, maxBaseLen);
  }

  return sanitizeFilename(`${base}${ext}`);
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

/** 集約用ディレクトリツリーを作成（既存はスキップ） */
export async function ensureContestStorageDirectories(
  env: Env,
  db: D1Database,
  user: SessionUser,
  groupSlug: string
): Promise<void> {
  const group = await db
    .prepare('SELECT id, slug FROM hub_groups WHERE slug = ?')
    .bind(groupSlug)
    .first<{ id: string; slug: string }>();
  if (!group) throw new Error('グループが見つかりません');

  await ensureGroupStorageRoot(env, db, group.id, group.slug, user.username);

  const groupParsed = parseLogicalPath(buildLogicalPath('group', groupSlug));
  if (!groupParsed) throw new Error('パス形式が不正です');

  if (!(await folderExists(env, groupSlug, CONTEST_STORAGE_ROOT_FOLDER))) {
    await createStorageDirectory(env, db, user, groupParsed, CONTEST_STORAGE_ROOT_FOLDER);
  }

  const rootParsed = parseLogicalPath(
    buildLogicalPath('group', groupSlug, CONTEST_STORAGE_ROOT_FOLDER)
  );
  if (!rootParsed) throw new Error('パス形式が不正です');

  const submissionsRel = `${CONTEST_STORAGE_ROOT_FOLDER}/${CONTEST_STORAGE_SUBMISSIONS_FOLDER}`;
  if (!(await folderExists(env, groupSlug, submissionsRel))) {
    await createStorageDirectory(
      env,
      db,
      user,
      rootParsed,
      CONTEST_STORAGE_SUBMISSIONS_FOLDER
    );
  }
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
    { forcedResolvedFilename: resolvedFilename }
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
