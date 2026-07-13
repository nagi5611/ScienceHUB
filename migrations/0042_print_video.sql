-- 3D印刷: 印刷動画の希望・保存先設定

CREATE TABLE IF NOT EXISTS print_app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

ALTER TABLE print_reservations ADD COLUMN request_print_video INTEGER NOT NULL DEFAULT 0;
ALTER TABLE print_reservations ADD COLUMN print_video_storage_path TEXT;
ALTER TABLE print_reservations ADD COLUMN print_video_filename TEXT;
ALTER TABLE print_reservations ADD COLUMN print_video_size_bytes INTEGER;
