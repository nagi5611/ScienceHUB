-- プロジェクト管理: アクティビティログ（最近の変更 / タイムライン）

CREATE TABLE IF NOT EXISTS pm_activity (
  id TEXT PRIMARY KEY NOT NULL,
  group_id TEXT NOT NULL,
  parent_project_id TEXT,
  actor_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('parent', 'child', 'task')),
  target_id TEXT,
  target_name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (group_id) REFERENCES hub_groups (id) ON DELETE CASCADE,
  FOREIGN KEY (parent_project_id) REFERENCES pm_projects (id) ON DELETE SET NULL,
  FOREIGN KEY (actor_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pm_activity_group_created
  ON pm_activity (group_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pm_activity_parent_created
  ON pm_activity (parent_project_id, created_at DESC);
