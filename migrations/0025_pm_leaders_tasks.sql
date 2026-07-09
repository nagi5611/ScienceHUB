-- 親プロジェクトのリーダー + リーダーが振るタスク

ALTER TABLE pm_projects ADD COLUMN leader_user_id TEXT REFERENCES users (id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS pm_tasks (
  id TEXT PRIMARY KEY NOT NULL,
  group_id TEXT NOT NULL,
  parent_project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  due_date TEXT,
  assignee_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (group_id) REFERENCES hub_groups (id) ON DELETE CASCADE,
  FOREIGN KEY (parent_project_id) REFERENCES pm_projects (id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pm_tasks_assignee
  ON pm_tasks (assignee_id, completed_at, due_date);

CREATE INDEX IF NOT EXISTS idx_pm_tasks_parent
  ON pm_tasks (parent_project_id, created_at);

CREATE INDEX IF NOT EXISTS idx_pm_projects_leader
  ON pm_projects (leader_user_id);
