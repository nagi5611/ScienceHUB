-- 設計アプリ登録 + プロジェクト・バージョン管理

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_design',
  'design',
  '設計',
  'シンプルな図面・設計ツール（線・図形をドラッグで描画、バージョン管理）',
  '/apps/design/',
  '📐',
  '#0EA5E9',
  16,
  0,
  0
);

CREATE TABLE IF NOT EXISTS design_projects (
  id TEXT PRIMARY KEY NOT NULL,
  owner_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '無題の設計',
  current_version_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_design_projects_owner
  ON design_projects (owner_user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS design_versions (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL REFERENCES design_projects (id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  scene_json TEXT NOT NULL,
  thumbnail_data TEXT,
  change_log_json TEXT NOT NULL DEFAULT '[]',
  is_autosave INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_design_versions_project
  ON design_versions (project_id, version_number DESC);

CREATE INDEX IF NOT EXISTS idx_design_versions_project_created
  ON design_versions (project_id, created_at DESC);
