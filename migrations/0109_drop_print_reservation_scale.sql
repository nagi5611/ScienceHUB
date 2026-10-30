-- Remove print_scale (S/M/L) from print_reservations; capacity uses reservation counts / time slots.

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
    schedule_type IS NULL OR schedule_type IN ('full_time', 'part_time', 'hekibunko', 'towa_branch')
  ),
  contest_storage_path TEXT,
  contest_storage_filename TEXT,
  contest_application_id TEXT REFERENCES contest_applications (id),
  part_count INTEGER NOT NULL DEFAULT 1 CHECK (part_count >= 1 AND part_count <= 99),
  calendar_end_date TEXT NOT NULL DEFAULT '',
  booking_kind TEXT CHECK (booking_kind IS NULL OR booking_kind IN ('reserve', 'request')),
  start_minute INTEGER,
  end_minute INTEGER,
  slot_group_id TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

INSERT INTO print_reservations_new (
  id, grade, homeroom, student_number, student_name, title,
  purpose, purpose_other, summary, print_notes, desired_date,
  stl_r2_key, stl_filename, stl_size_bytes, status, status_comment,
  print_staff, print_staff_member_id, delivery_staff, google_event_id,
  user_id, created_at, printer_id, request_print_video,
  print_video_storage_path, print_video_filename, print_video_size_bytes,
  source, schedule_type, contest_storage_path, contest_storage_filename,
  contest_application_id, part_count, calendar_end_date,
  booking_kind, start_minute, end_minute, slot_group_id
)
SELECT
  id, grade, homeroom, student_number, student_name, title,
  purpose, purpose_other, summary, print_notes, desired_date,
  stl_r2_key, stl_filename, stl_size_bytes, status, status_comment,
  print_staff, print_staff_member_id, delivery_staff, google_event_id,
  user_id, created_at, printer_id, request_print_video,
  print_video_storage_path, print_video_filename, print_video_size_bytes,
  source, schedule_type, contest_storage_path, contest_storage_filename,
  contest_application_id, part_count, calendar_end_date,
  booking_kind, start_minute, end_minute, slot_group_id
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
CREATE INDEX IF NOT EXISTS idx_print_reservations_contest_application_id
  ON print_reservations (contest_application_id);
CREATE INDEX IF NOT EXISTS idx_print_reservations_calendar_range
  ON print_reservations (desired_date, calendar_end_date);
CREATE INDEX IF NOT EXISTS idx_print_reservations_desired_date_printer
  ON print_reservations (desired_date, printer_id);
CREATE INDEX IF NOT EXISTS idx_print_reservations_slot_group ON print_reservations (slot_group_id);

PRAGMA foreign_keys=ON;
