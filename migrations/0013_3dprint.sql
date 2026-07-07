-- 3D印刷アプリ: ユーザープロフィール拡張 + 予約・メンバー・シフト・アップロード

ALTER TABLE users ADD COLUMN homeroom TEXT;
ALTER TABLE users ADD COLUMN student_number INTEGER;
ALTER TABLE users ADD COLUMN student_name TEXT;

CREATE TABLE IF NOT EXISTS print_reservations (
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
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_print_reservations_desired_date ON print_reservations (desired_date);
CREATE INDEX IF NOT EXISTS idx_print_reservations_status ON print_reservations (status);
CREATE INDEX IF NOT EXISTS idx_print_reservations_user_id ON print_reservations (user_id);

CREATE TABLE IF NOT EXISTS print_members (
  id TEXT PRIMARY KEY NOT NULL,
  homeroom TEXT NOT NULL,
  student_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  color_index INTEGER NOT NULL DEFAULT 0,
  discord_user_id TEXT,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_print_members_homeroom_number
  ON print_members (homeroom, student_number);

CREATE TABLE IF NOT EXISTS print_member_availability (
  member_id TEXT NOT NULL,
  date TEXT NOT NULL,
  PRIMARY KEY (member_id, date),
  FOREIGN KEY (member_id) REFERENCES print_members (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_print_member_availability_date
  ON print_member_availability (date);

CREATE TABLE IF NOT EXISTS print_upload_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  upload_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  total_size INTEGER NOT NULL,
  part_size INTEGER NOT NULL,
  parts_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (
    status IN ('in_progress', 'completed', 'aborted')
  ),
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_3dprint_reservation',
  '3dprint-reservation',
  '3D印刷予約',
  '3Dプリンタの印刷予約を申請・管理',
  '/apps/3dprint-reservation/',
  '🖨️',
  '#F6821F',
  10,
  0,
  0
);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_3dprint_management',
  '3dprint-management',
  '3D印刷管理',
  '印刷予約の受領・ステータス管理・担当シフト',
  '/apps/3dprint-management/',
  '⚙️',
  '#7C3AED',
  11,
  0,
  0
);
