-- サブプロジェクト: 納期 + 担当メンバー

ALTER TABLE pm_projects ADD COLUMN due_date TEXT;

CREATE TABLE IF NOT EXISTS pm_project_assignees (
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  assigned_at INTEGER NOT NULL,
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES pm_projects (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pm_project_assignees_user
  ON pm_project_assignees (user_id);
