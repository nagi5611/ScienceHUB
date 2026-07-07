-- 予定の詳細・時間・Google カレンダー連携用カラム

ALTER TABLE hub_schedule_events ADD COLUMN description TEXT;
ALTER TABLE hub_schedule_events ADD COLUMN is_all_day INTEGER NOT NULL DEFAULT 1;
ALTER TABLE hub_schedule_events ADD COLUMN start_time TEXT;
ALTER TABLE hub_schedule_events ADD COLUMN end_time TEXT;
ALTER TABLE hub_schedule_events ADD COLUMN google_event_id_all TEXT;
ALTER TABLE hub_schedule_events ADD COLUMN google_event_id_group TEXT;

ALTER TABLE hub_groups ADD COLUMN google_calendar_id TEXT;

CREATE TABLE IF NOT EXISTS hub_calendar_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO hub_calendar_settings (key, value, updated_at)
VALUES ('all_groups_calendar_name', '自然科学部', 0);
