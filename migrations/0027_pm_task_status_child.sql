-- タスク: 状態（未進行/進行中）+ 子プロジェクト紐づけ、親プロジェクトは任意

ALTER TABLE pm_tasks ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE pm_tasks ADD COLUMN child_project_id TEXT REFERENCES pm_projects (id) ON DELETE SET NULL;

PRAGMA foreign_keys=OFF;

CREATE TABLE pm_tasks_new (
  id TEXT PRIMARY KEY NOT NULL,
  group_id TEXT NOT NULL,
  parent_project_id TEXT,
  child_project_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  assignee_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (group_id) REFERENCES hub_groups (id) ON DELETE CASCADE,
  FOREIGN KEY (parent_project_id) REFERENCES pm_projects (id) ON DELETE CASCADE,
  FOREIGN KEY (child_project_id) REFERENCES pm_projects (id) ON DELETE SET NULL,
  FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
);

INSERT INTO pm_tasks_new (
  id, group_id, parent_project_id, child_project_id, title, description,
  due_date, status, assignee_id, created_by, completed_at, created_at, updated_at
)
SELECT
  id, group_id, parent_project_id, child_project_id, title, description,
  due_date, status, assignee_id, created_by, completed_at, created_at, updated_at
FROM pm_tasks;

DROP TABLE pm_tasks;
ALTER TABLE pm_tasks_new RENAME TO pm_tasks;

CREATE INDEX IF NOT EXISTS idx_pm_tasks_assignee
  ON pm_tasks (assignee_id, completed_at, due_date);

CREATE INDEX IF NOT EXISTS idx_pm_tasks_parent
  ON pm_tasks (parent_project_id, created_at);

CREATE INDEX IF NOT EXISTS idx_pm_tasks_group_open
  ON pm_tasks (group_id, completed_at, status);

PRAGMA foreign_keys=ON;
