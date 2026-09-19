-- 造形物コンテスト（依頼・管理）— print_* インフラ共有

ALTER TABLE print_reservations ADD COLUMN source TEXT NOT NULL DEFAULT 'standard'
  CHECK (source IN ('standard', 'contest'));

ALTER TABLE print_reservations ADD COLUMN schedule_type TEXT
  CHECK (schedule_type IS NULL OR schedule_type IN ('full_time', 'part_time'));

CREATE INDEX IF NOT EXISTS idx_print_reservations_source ON print_reservations (source);
CREATE INDEX IF NOT EXISTS idx_print_reservations_source_date
  ON print_reservations (source, desired_date);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_contest_entry',
  'contest-entry',
  '造形物コンテスト',
  '造形物コンテストへの作品登録',
  '/apps/contest-entry/',
  '🏆',
  '#EAB308',
  12,
  0,
  0
);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_contest_management',
  'contest-management',
  '造形物コンテスト管理',
  '造形物コンテストの印刷スケジュール・ステータス管理',
  '/apps/contest-management/',
  '📋',
  '#CA8A04',
  13,
  0,
  0
);
