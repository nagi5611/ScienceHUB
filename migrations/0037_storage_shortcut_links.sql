-- クラウドストレージ: フォルダショートカットリンク（認証・閲覧権限必須）

CREATE TABLE IF NOT EXISTS storage_shortcut_links (
  id TEXT PRIMARY KEY NOT NULL,
  token TEXT NOT NULL UNIQUE,
  storage_path TEXT NOT NULL,
  label TEXT,
  created_by_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_storage_shortcut_links_token
  ON storage_shortcut_links (token);

CREATE INDEX IF NOT EXISTS idx_storage_shortcut_links_path
  ON storage_shortcut_links (storage_path);
