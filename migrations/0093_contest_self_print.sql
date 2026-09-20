-- 造形物コンテスト: 自己印刷（印刷予約なしで STL 提出）

ALTER TABLE contest_applications ADD COLUMN self_print INTEGER NOT NULL DEFAULT 0 CHECK (self_print IN (0, 1));
ALTER TABLE contest_applications ADD COLUMN stl_r2_key TEXT;
ALTER TABLE contest_applications ADD COLUMN stl_filename TEXT;
ALTER TABLE contest_applications ADD COLUMN stl_size_bytes INTEGER;
ALTER TABLE contest_applications ADD COLUMN stl_print_notes TEXT;
ALTER TABLE contest_applications ADD COLUMN stl_submitted_at TEXT;
ALTER TABLE contest_applications ADD COLUMN contest_storage_path TEXT;
ALTER TABLE contest_applications ADD COLUMN contest_storage_filename TEXT;
