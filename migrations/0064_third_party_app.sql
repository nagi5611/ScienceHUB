-- サードパーティ（ユーザー作成アプリ）MVP

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, is_default, created_at, updated_at
) VALUES (
  'app_third_party',
  'third-party',
  'サードパーティ',
  'ユーザーがチャットで作ったアプリを一覧・公開・利用できます',
  '/apps/third-party/',
  '🧩',
  '#F38020',
  18,
  0,
  0,
  0
);

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_third_party', id, 1 FROM hub_groups WHERE is_root = 1 LIMIT 1;

CREATE TABLE IF NOT EXISTS tp_projects (
  id TEXT PRIMARY KEY NOT NULL,
  owner_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '無題のアプリ',
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_emoji TEXT,
  color TEXT NOT NULL DEFAULT '#F38020',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  visibility_group_id TEXT REFERENCES hub_groups (id) ON DELETE SET NULL,
  hub_app_id TEXT REFERENCES hub_apps (id) ON DELETE SET NULL,
  r2_prefix TEXT NOT NULL,
  published_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tp_projects_owner
  ON tp_projects (owner_user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_tp_projects_published
  ON tp_projects (status, published_at DESC);

CREATE TABLE IF NOT EXISTS tp_chat_messages (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL REFERENCES tp_projects (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tp_chat_messages_project
  ON tp_chat_messages (project_id, created_at ASC);

CREATE TABLE IF NOT EXISTS tp_revisions (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL REFERENCES tp_projects (id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  summary TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tp_revisions_project
  ON tp_revisions (project_id, revision_number DESC);
