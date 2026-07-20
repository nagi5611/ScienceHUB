-- 設計アプリ共有リンク

CREATE TABLE IF NOT EXISTS design_share_links (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL REFERENCES design_projects (id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_design_share_token
  ON design_share_links (token);

CREATE INDEX IF NOT EXISTS idx_design_share_project
  ON design_share_links (project_id);
