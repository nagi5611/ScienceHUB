-- 造形物コンテスト: 複数パーツ（複数 STL）の参加申請

ALTER TABLE contest_applications ADD COLUMN uses_multiple_parts INTEGER NOT NULL DEFAULT 0 CHECK (uses_multiple_parts IN (0, 1));
ALTER TABLE contest_applications ADD COLUMN part_count INTEGER CHECK (part_count IS NULL OR (part_count >= 2 AND part_count <= 20));

CREATE TABLE IF NOT EXISTS contest_application_stl_parts (
  id TEXT PRIMARY KEY NOT NULL,
  application_id TEXT NOT NULL,
  part_index INTEGER NOT NULL,
  stl_r2_key TEXT NOT NULL,
  stl_filename TEXT NOT NULL,
  stl_size_bytes INTEGER NOT NULL,
  contest_storage_path TEXT,
  contest_storage_filename TEXT,
  FOREIGN KEY (application_id) REFERENCES contest_applications (id) ON DELETE CASCADE,
  UNIQUE (application_id, part_index)
);

CREATE INDEX IF NOT EXISTS idx_contest_application_stl_parts_application_id
  ON contest_application_stl_parts (application_id);
