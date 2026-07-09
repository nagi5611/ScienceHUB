-- プロジェクト管理アプリ: 管理者資格設定 + アプリ登録

CREATE TABLE IF NOT EXISTS pm_admin_settings (
  group_id TEXT PRIMARY KEY NOT NULL,
  min_eligible_weight INTEGER NOT NULL DEFAULT 0,
  updated_by TEXT,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (group_id) REFERENCES hub_groups (id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_project_management',
  'project-management',
  'プロジェクト管理',
  'グループごとのタスク・スケジュール・プロジェクト進捗を管理',
  '/apps/project-management/',
  '📋',
  '#F38020',
  7,
  0,
  0
);
