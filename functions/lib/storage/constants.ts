/**
 * クラウドストレージ定数
 */

export const STORAGE_APP_SLUG = "cloud-storage";

export const QUOTA_GUEST = 10 * 1024 ** 3;
export const QUOTA_MEMBER = 100 * 1024 ** 3;
export const QUOTA_GROUP = 100 * 1024 ** 3;
/** 管理者が設定できる割り当て上限（10 TiB） */
export const QUOTA_ADMIN_MAX = 10 * 1024 ** 4;

/** このサイズ超でマルチパート（Worker Free の 100MB リクエスト上限を考慮） */
export const MULTIPART_THRESHOLD = 30 * 1024 * 1024;
export const MULTIPART_LARGE_THRESHOLD = 300 * 1024 ** 2;

export const PART_SIZE_STANDARD = 32 * 1024 * 1024;
/** Free/Pro のリクエストボディ上限 100MB 未満に収める */
export const PART_SIZE_LARGE = 32 * 1024 * 1024;

export const PARALLEL_STANDARD = 8;
export const PARALLEL_LARGE = 10;

/** presigned URL の有効期限（秒） */
export const PRESIGN_EXPIRES_SEC = 3600;

/** Office Online プレビュー用 presigned / トークン有効期限（秒） */
export const OFFICE_PRESIGN_EXPIRES_SEC = 3600;

/** Office Online プレビューの推奨上限（Microsoft 側の制限に合わせる） */
export const OFFICE_PREVIEW_MAX_BYTES = 50 * 1024 * 1024;

/** Office プレビュー時に表示が遅くなる可能性があるサイズ */
export const OFFICE_PREVIEW_WARN_BYTES = 20 * 1024 * 1024;

export const FOLDER_META_NAME = "__folder.meta";
export const STORAGE_PREFIX = "storage";

/** ごみ箱の保持期間（90日） */
export const TRASH_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
/** ごみ箱の容量上限（50GB / ルート） */
export const TRASH_QUOTA_BYTES = 50 * 1024 ** 3;

/** 共有リンクのダウンロード回数上限（デフォルト / 最大 / 最小） */
export const SHARE_DOWNLOAD_DEFAULT = 10;
export const SHARE_DOWNLOAD_MAX = 1000;
export const SHARE_DOWNLOAD_MIN = 1;
