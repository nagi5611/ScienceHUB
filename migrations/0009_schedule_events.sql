-- グループスケジュール（ダッシュボードカレンダー）

CREATE TABLE IF NOT EXISTS hub_schedule_events (
  id TEXT PRIMARY KEY NOT NULL,
  group_id TEXT NOT NULL REFERENCES hub_groups (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hub_schedule_events_date
  ON hub_schedule_events (event_date);

CREATE INDEX IF NOT EXISTS idx_hub_schedule_events_group
  ON hub_schedule_events (group_id);
