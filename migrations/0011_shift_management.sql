-- シフト管理アプリ: 出勤可能日 + アプリ登録

CREATE TABLE IF NOT EXISTS shift_availability (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  avail_date TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (user_id, avail_date),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shift_availability_user_date
  ON shift_availability (user_id, avail_date);

CREATE INDEX IF NOT EXISTS idx_shift_availability_date
  ON shift_availability (avail_date);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_shift_management',
  'shift-management',
  'シフト管理',
  '出勤可能日をカレンダーで管理し、メンバーの予定を確認',
  '/apps/shift-management/',
  '📅',
  '#059669',
  2,
  0,
  0
);
