-- シミュレーション依頼・管理アプリ（3D印刷予約のクローン）

CREATE TABLE IF NOT EXISTS sim_simulators (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  image_r2_key TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  capabilities_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available' CHECK (
    status IN ('available', 'unavailable', 'maintenance')
  ),
  daily_capacity_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sim_simulators_position ON sim_simulators (position);
CREATE INDEX IF NOT EXISTS idx_sim_simulators_status ON sim_simulators (status);

CREATE TABLE IF NOT EXISTS sim_reservations (
  id TEXT PRIMARY KEY NOT NULL,
  grade INTEGER NOT NULL,
  homeroom TEXT NOT NULL,
  student_number INTEGER NOT NULL,
  student_name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '依頼',
  purpose TEXT NOT NULL CHECK (purpose IN ('ss_s_tan', 'club', 'other')),
  purpose_other TEXT,
  summary TEXT,
  sim_notes TEXT,
  sim_scale TEXT NOT NULL CHECK (sim_scale IN ('small', 'medium', 'large')),
  desired_date TEXT NOT NULL,
  stl_r2_key TEXT NOT NULL,
  stl_filename TEXT NOT NULL,
  stl_size_bytes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (
    status IN ('applied', 'accepted', 'running', 'delivered', 'failed', 'cancelled')
  ),
  status_comment TEXT,
  sim_staff TEXT,
  sim_staff_member_id TEXT,
  delivery_staff TEXT,
  google_event_id TEXT,
  simulator_id TEXT REFERENCES sim_simulators (id),
  request_result_video INTEGER NOT NULL DEFAULT 0,
  result_video_storage_path TEXT,
  result_video_filename TEXT,
  result_video_size_bytes INTEGER,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sim_reservations_desired_date ON sim_reservations (desired_date);
CREATE INDEX IF NOT EXISTS idx_sim_reservations_status ON sim_reservations (status);
CREATE INDEX IF NOT EXISTS idx_sim_reservations_user_id ON sim_reservations (user_id);
CREATE INDEX IF NOT EXISTS idx_sim_reservations_simulator_id ON sim_reservations (simulator_id);

CREATE TABLE IF NOT EXISTS sim_members (
  id TEXT PRIMARY KEY NOT NULL,
  homeroom TEXT NOT NULL,
  student_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  color_index INTEGER NOT NULL DEFAULT 0,
  discord_user_id TEXT,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sim_members_homeroom_number
  ON sim_members (homeroom, student_number);

CREATE TABLE IF NOT EXISTS sim_member_availability (
  member_id TEXT NOT NULL,
  date TEXT NOT NULL,
  PRIMARY KEY (member_id, date),
  FOREIGN KEY (member_id) REFERENCES sim_members (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sim_member_availability_date
  ON sim_member_availability (date);

CREATE TABLE IF NOT EXISTS sim_upload_sessions (
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

CREATE TABLE IF NOT EXISTS sim_simulator_availability (
  simulator_id TEXT NOT NULL,
  date TEXT NOT NULL,
  PRIMARY KEY (simulator_id, date),
  FOREIGN KEY (simulator_id) REFERENCES sim_simulators (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sim_simulator_availability_date
  ON sim_simulator_availability (date);

CREATE TABLE IF NOT EXISTS sim_app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_simulation_request',
  'simulation-request',
  'シミュレーション依頼',
  'シミュレーションの依頼を申請・管理',
  '/apps/simulation-request/',
  '🧪',
  '#0EA5E9',
  18,
  0,
  0
);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_simulation_management',
  'simulation-management',
  'シミュレーション管理',
  'シミュレーション依頼の受領・ステータス管理・担当シフト',
  '/apps/simulation-management/',
  '⚗️',
  '#6366F1',
  19,
  0,
  0
);
