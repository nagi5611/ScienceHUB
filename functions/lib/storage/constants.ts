/**
 * クラウドストレージ定数
 */

export const STORAGE_APP_SLUG = "cloud-storage";

export const QUOTA_GUEST = 10 * 1024 ** 3;
export const QUOTA_MEMBER = 100 * 1024 ** 3;
export const QUOTA_GROUP = 100 * 1024 ** 3;
export const QUOTA_ADMIN_MAX = 1024 ** 4;

/** このサイズ超でマルチパート（Worker Free の 100MB リクエスト上限を考慮） */
export const MULTIPART_THRESHOLD = 30 * 1024 * 1024;
export const MULTIPART_LARGE_THRESHOLD = 300 * 1024 ** 2;

export const PART_SIZE_STANDARD = 32 * 1024 * 1024;
/** Free/Pro のリクエストボディ上限 100MB 未満に収める */
export const PART_SIZE_LARGE = 64 * 1024 * 1024;

export const PARALLEL_STANDARD = 8;
export const PARALLEL_LARGE = 10;

/** presigned URL の有効期限（秒） */
export const PRESIGN_EXPIRES_SEC = 3600;

/** Office Online プレビュー用 presigned / トークン有効期限（秒） */
export const OFFICE_PRESIGN_EXPIRES_SEC = 3600;

/** Office Online プレビューの推奨上限（Microsoft 側の制限に合わせる） */
export const OFFICE_PREVIEW_MAX_BYTES = 10 * 1024 * 1024;

export const FOLDER_META_NAME = "__folder.meta";
export const STORAGE_PREFIX = "storage";
