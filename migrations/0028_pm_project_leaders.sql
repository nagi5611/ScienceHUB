-- 親プロジェクトのリーダーを複数人に対応

CREATE TABLE IF NOT EXISTS pm_project_leaders (
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES pm_projects (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pm_project_leaders_user
  ON pm_project_leaders (user_id);

-- 既存の単一リーダーを移行
INSERT OR IGNORE INTO pm_project_leaders (project_id, user_id)
SELECT id, leader_user_id
FROM pm_projects
WHERE leader_user_id IS NOT NULL AND parent_id IS NULL;
