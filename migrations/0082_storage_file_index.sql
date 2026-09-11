-- クラウドストレージ: ファイルインデックス（D1）とバックフィル進捗

CREATE TABLE IF NOT EXISTS storage_file_index (
  root_id TEXT NOT NULL REFERENCES storage_roots (id) ON DELETE CASCADE,
  relative_path TEXT NOT NULL,
  name TEXT NOT NULL,
  name_lower TEXT NOT NULL,
  parent_path TEXT NOT NULL DEFAULT '',
  size_bytes INTEGER NOT NULL DEFAULT 0,
  r2_key TEXT NOT NULL,
  created_by TEXT,
  updated_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  indexed_at INTEGER NOT NULL,
  PRIMARY KEY (root_id, relative_path)
);

CREATE INDEX IF NOT EXISTS idx_storage_file_index_root_updated
  ON storage_file_index (root_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_storage_file_index_root_name
  ON storage_file_index (root_id, name_lower);

CREATE TABLE IF NOT EXISTS storage_index_backfill (
  root_id TEXT PRIMARY KEY NOT NULL REFERENCES storage_roots (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'running', 'complete', 'failed')
  ),
  r2_cursor TEXT,
  files_indexed INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  updated_at INTEGER NOT NULL
);
