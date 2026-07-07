-- クラウドストレージ: ルート・クォータ・アップロードセッション + アプリ登録

CREATE TABLE IF NOT EXISTS storage_roots (
  id TEXT PRIMARY KEY NOT NULL,
  root_type TEXT NOT NULL CHECK (root_type IN ('user', 'group')),
  user_id TEXT REFERENCES users (id) ON DELETE CASCADE,
  group_id TEXT REFERENCES hub_groups (id) ON DELETE CASCADE,
  quota_bytes INTEGER NOT NULL,
  used_bytes INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CHECK (
    (root_type = 'user' AND user_id IS NOT NULL AND group_id IS NULL)
    OR (root_type = 'group' AND group_id IS NOT NULL AND user_id IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_storage_roots_user
  ON storage_roots (user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_storage_roots_group
  ON storage_roots (group_id)
  WHERE group_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS storage_upload_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  root_id TEXT NOT NULL REFERENCES storage_roots (id) ON DELETE CASCADE,
  r2_key TEXT NOT NULL,
  upload_id TEXT,
  filename TEXT NOT NULL,
  resolved_filename TEXT NOT NULL,
  logical_dir TEXT NOT NULL DEFAULT '',
  total_size INTEGER NOT NULL,
  part_size INTEGER,
  parts_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (
    status IN ('in_progress', 'completed', 'aborted')
  ),
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_storage_upload_sessions_user
  ON storage_upload_sessions (user_id, status);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_cloud_storage',
  'cloud-storage',
  'クラウドストレージ',
  '個人・グループ向けクラウドファイルストレージ',
  '/apps/cloud-storage/',
  '☁️',
  '#0EA5E9',
  12,
  0,
  0
);
