-- 造形物コンテスト: 在籍区分に壁文庫を追加（schedule_type CHECK 拡張）

PRAGMA foreign_keys=OFF;

CREATE TABLE print_reservations_new (
  id TEXT PRIMARY KEY NOT NULL,
  grade INTEGER NOT NULL,
  homeroom TEXT NOT NULL,
  student_number INTEGER NOT NULL,
  student_name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '予約',
  purpose TEXT NOT NULL CHECK (purpose IN ('ss_s_tan', 'club', 'other')),
  purpose_other TEXT,
  summary TEXT,
  print_notes TEXT,
  print_scale TEXT NOT NULL CHECK (print_scale IN ('small', 'medium', 'large')),
  desired_date TEXT NOT NULL,
  stl_r2_key TEXT NOT NULL,
  stl_filename TEXT NOT NULL,
  stl_size_bytes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (
    status IN ('applied', 'accepted', 'printing', 'delivered', 'failed', 'cancelled')
  ),
  status_comment TEXT,
  print_staff TEXT,
  print_staff_member_id TEXT,
  delivery_staff TEXT,
  google_event_id TEXT,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  printer_id TEXT REFERENCES print_printers (id),
  request_print_video INTEGER NOT NULL DEFAULT 0,
  print_video_storage_path TEXT,
  print_video_filename TEXT,
  print_video_size_bytes INTEGER,
  source TEXT NOT NULL DEFAULT 'standard'
    CHECK (source IN ('standard', 'contest')),
  schedule_type TEXT CHECK (
    schedule_type IS NULL OR schedule_type IN ('full_time', 'part_time', 'hekibunko')
  ),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

INSERT INTO print_reservations_new (
  id, grade, homeroom, student_number, student_name, title,
  purpose, purpose_other, summary, print_notes, print_scale, desired_date,
  stl_r2_key, stl_filename, stl_size_bytes, status, status_comment,
  print_staff, print_staff_member_id, delivery_staff, google_event_id,
  user_id, created_at, printer_id, request_print_video,
  print_video_storage_path, print_video_filename, print_video_size_bytes,
  source, schedule_type
)
SELECT
  id, grade, homeroom, student_number, student_name, title,
  purpose, purpose_other, summary, print_notes, print_scale, desired_date,
  stl_r2_key, stl_filename, stl_size_bytes, status, status_comment,
  print_staff, print_staff_member_id, delivery_staff, google_event_id,
  user_id, created_at, printer_id, request_print_video,
  print_video_storage_path, print_video_filename, print_video_size_bytes,
  source, schedule_type
FROM print_reservations;

DROP TABLE print_reservations;
ALTER TABLE print_reservations_new RENAME TO print_reservations;

CREATE INDEX IF NOT EXISTS idx_print_reservations_desired_date ON print_reservations (desired_date);
CREATE INDEX IF NOT EXISTS idx_print_reservations_status ON print_reservations (status);
CREATE INDEX IF NOT EXISTS idx_print_reservations_user_id ON print_reservations (user_id);
CREATE INDEX IF NOT EXISTS idx_print_reservations_printer_id ON print_reservations (printer_id);
CREATE INDEX IF NOT EXISTS idx_print_reservations_source ON print_reservations (source);
CREATE INDEX IF NOT EXISTS idx_print_reservations_source_date
  ON print_reservations (source, desired_date);

PRAGMA foreign_keys=ON;
