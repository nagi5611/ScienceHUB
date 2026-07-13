-- 親プロジェクトの担当者（リーダーがグループメンバーから追加）

CREATE TABLE IF NOT EXISTS pm_parent_members (
  parent_project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  assigned_at INTEGER NOT NULL,
  PRIMARY KEY (parent_project_id, user_id),
  FOREIGN KEY (parent_project_id) REFERENCES pm_projects (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pm_parent_members_user
  ON pm_parent_members (user_id);

-- 既存の子プロジェクト担当者を親担当者へ移行
INSERT OR IGNORE INTO pm_parent_members (parent_project_id, user_id, assigned_at)
SELECT DISTINCT c.parent_id, a.user_id, a.assigned_at
FROM pm_project_assignees a
JOIN pm_projects c ON c.id = a.project_id
WHERE c.parent_id IS NOT NULL;
