-- ScienceHUB D1 初期スキーマ
-- ユーザー管理・ディレクトリ管理・ファイルメタデータ

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
  avatar_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS directories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT REFERENCES directories (id) ON DELETE CASCADE,
  owner_id TEXT NOT NULL REFERENCES users (id),
  description TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_directories_parent ON directories (parent_id);
CREATE INDEX IF NOT EXISTS idx_directories_owner ON directories (owner_id);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  directory_id TEXT NOT NULL REFERENCES directories (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT,
  uploaded_by TEXT NOT NULL REFERENCES users (id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_files_directory ON files (directory_id);
CREATE INDEX IF NOT EXISTS idx_files_r2_key ON files (r2_key);

-- デモ用シード（開発・プレビュー向け）
INSERT OR IGNORE INTO users (id, email, display_name, role, created_at, updated_at)
VALUES
  ('demo-admin', 'admin@sciencehub.local', '管理者', 'admin', 0, 0),
  ('demo-member', 'member@sciencehub.local', '研究者', 'member', 0, 0);

INSERT OR IGNORE INTO directories (id, name, parent_id, owner_id, description, created_at, updated_at)
VALUES
  ('dir-root', '共有プロジェクト', NULL, 'demo-admin', 'チーム共有の研究プロジェクト', 0, 0),
  ('dir-sim', 'シミュレーション', 'dir-root', 'demo-admin', '数値計算・シミュレーション成果物', 0, 0);
