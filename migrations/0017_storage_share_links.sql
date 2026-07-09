-- クラウドストレージ: 共有リンク

CREATE TABLE IF NOT EXISTS storage_share_links (
  id TEXT PRIMARY KEY NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  max_downloads INTEGER NOT NULL DEFAULT 10,
  download_count INTEGER NOT NULL DEFAULT 0,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL,
  CHECK (max_downloads >= 1 AND max_downloads <= 1000)
);

CREATE TABLE IF NOT EXISTS storage_share_link_files (
  id TEXT PRIMARY KEY NOT NULL,
  share_link_id TEXT NOT NULL REFERENCES storage_share_links (id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_storage_share_links_token
  ON storage_share_links (token);

CREATE INDEX IF NOT EXISTS idx_storage_share_link_files_share
  ON storage_share_link_files (share_link_id, sort_order);
