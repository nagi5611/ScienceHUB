-- クラウドストレージ: ごみ箱（ユーザー/グループごと、90日・50GB 上限はアプリ側で管理）

CREATE TABLE IF NOT EXISTS storage_trash_items (
  id TEXT PRIMARY KEY NOT NULL,
  root_id TEXT NOT NULL REFERENCES storage_roots (id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('file', 'folder')),
  original_logical_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  trash_r2_prefix TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  deleted_by TEXT NOT NULL REFERENCES users (id),
  deleted_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_storage_trash_root_deleted
  ON storage_trash_items (root_id, deleted_at);

CREATE INDEX IF NOT EXISTS idx_storage_trash_root_expires
  ON storage_trash_items (root_id, expires_at);
