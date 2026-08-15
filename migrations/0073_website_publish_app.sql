-- ウェブサイト公開（静的ホスティング）

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, is_default, created_at, updated_at
) VALUES (
  'app_website_publish',
  'website-publish',
  'ウェブサイト公開',
  '静的ファイルをアップロードして /web/ 配下で公開（最大3サイト・各5GB）',
  '/apps/website-publish/',
  '🌐',
  '#10B981',
  20,
  0,
  0,
  0
);

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_website_publish', id, 1 FROM hub_groups WHERE is_root = 1 LIMIT 1;

CREATE TABLE IF NOT EXISTS web_sites (
  id TEXT PRIMARY KEY NOT NULL,
  owner_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  path_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  dir_name TEXT NOT NULL UNIQUE,
  r2_prefix TEXT NOT NULL,
  used_bytes INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'disabled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_web_sites_owner
  ON web_sites (owner_user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS web_upload_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  site_id TEXT NOT NULL REFERENCES web_sites (id) ON DELETE CASCADE,
  r2_key TEXT NOT NULL,
  upload_id TEXT,
  filename TEXT NOT NULL,
  resolved_path TEXT NOT NULL,
  relative_dir TEXT NOT NULL DEFAULT '',
  replaced_size INTEGER NOT NULL DEFAULT 0,
  total_size INTEGER NOT NULL,
  part_size INTEGER,
  parts_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (
    status IN ('in_progress', 'completed', 'aborted')
  ),
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_web_upload_sessions_user
  ON web_upload_sessions (user_id, status);

CREATE INDEX IF NOT EXISTS idx_web_upload_sessions_site
  ON web_upload_sessions (site_id, status);
