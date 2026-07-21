// functions/lib/simulation/result-video.ts
import type { Env, SessionUser } from '../types';
import { getPrintVideoStoragePath } from './sim-app-settings';
import { parseLogicalPath } from '../storage/keys';
import { initiateStorageUpload, simpleStorageUpload } from '../storage/upload';
import { deleteStoragePath } from '../storage/operations';
import { parseSimulatorCapabilities } from './simulator-capabilities';
import { getSimulatorById } from './simulators';
import type { Reservation } from './reservations';

export const PRINT_VIDEO_MAX_BYTES = 500 * 1024 * 1024;

const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'webm', 'mkv', 'm4v']);

/** 結果動画の希望フラグを検証して正規化 */
export async function resolveRequestPrintVideo(
  db: D1Database,
  simulatorId: string,
  requested: unknown
): Promise<{ ok: true; value: boolean } | { ok: false; error: string }> {
  const wantsVideo = Boolean(requested);
  if (!wantsVideo) return { ok: true, value: false };

  const simulator = await getSimulatorById(db, simulatorId);
  if (!simulator) {
    return { ok: false, error: '指定されたシミュレーターが見つかりません' };
  }

  const caps = parseSimulatorCapabilities(simulator.capabilities_json);
  if (!caps.can_record_result_video) {
    return { ok: false, error: '選択したシミュレーターは実行中の動画撮影に対応していません' };
  }

  return { ok: true, value: true };
}

/** 動画ファイル名を検証 */
export function validatePrintVideoFilename(filename: string): string | null {
  const name = filename.trim();
  if (!name) return 'ファイル名が必要です';

  const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() : '';
  if (!ext || !VIDEO_EXTENSIONS.has(ext)) {
    return '対応形式: mp4, mov, webm, mkv, m4v';
  }

  if (name.length > 200) return 'ファイル名が長すぎます';
  return null;
}

/** 予約用のストレージ相対ディレクトリを組み立て */
export function buildPrintVideoRelativeDir(
  basePath: string,
  reservationId: string
): { rootType: 'group'; rootKey: string; relativeDir: string } | null {
  const parsed = parseLogicalPath(basePath);
  if (!parsed || parsed.rootType !== 'group') return null;

  const relativeDir = parsed.relativePath
    ? `${parsed.relativePath}/${reservationId}`
    : reservationId;

  return {
    rootType: 'group',
    rootKey: parsed.rootKey,
    relativeDir,
  };
}

/** 管理画面から結果動画をクラウドストレージへアップロード */
export async function uploadPrintVideoToStorage(
  env: Env,
  db: D1Database,
  user: SessionUser,
  reservation: Reservation,
  filename: string,
  body: ArrayBuffer
): Promise<{ path: string; filename: string; size: number }> {
  if (body.byteLength <= 0) throw new Error('ファイルが空です');
  if (body.byteLength > PRINT_VIDEO_MAX_BYTES) {
    throw new Error(`動画は ${Math.floor(PRINT_VIDEO_MAX_BYTES / (1024 * 1024))} MB 以下にしてください`);
  }

  const nameError = validatePrintVideoFilename(filename);
  if (nameError) throw new Error(nameError);

  const basePath = await getPrintVideoStoragePath(db);
  if (!basePath) {
    throw new Error('結果動画の保存先が設定されていません。管理画面の設定から指定してください');
  }

  const target = buildPrintVideoRelativeDir(basePath, reservation.id);
  if (!target) {
    throw new Error('結果動画の保存先パスが不正です');
  }

  const initiated = await initiateStorageUpload(
    env,
    db,
    user,
    target.rootType,
    target.rootKey,
    target.relativeDir,
    filename,
    body.byteLength
  );

  if (initiated.mode !== 'simple') {
    throw new Error('このサイズの動画は現在の設定ではアップロードできません');
  }

  const uploaded = await simpleStorageUpload(env, db, user, initiated.sessionId, body);
  const logicalPath = uploaded.path;

  return {
    path: logicalPath,
    filename: initiated.resolvedFilename,
    size: uploaded.size,
  };
}

/** 既存の結果動画ファイルをストレージから削除（失敗は無視） */
export async function deletePrintVideoFile(
  env: Env,
  db: D1Database,
  storagePath: string | null | undefined
): Promise<void> {
  if (!storagePath) return;

  const parsed = parseLogicalPath(storagePath);
  if (!parsed?.relativePath) return;

  try {
    await deleteStoragePath(env, db, parsed, false);
  } catch {
    // 既に削除済みなどは無視
  }
}
