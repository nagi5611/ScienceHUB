-- 一括発行タスクのグループ ID

ALTER TABLE pm_tasks ADD COLUMN issue_batch_id TEXT;

CREATE INDEX IF NOT EXISTS idx_pm_tasks_issue_batch
  ON pm_tasks (issue_batch_id);

CREATE INDEX IF NOT EXISTS idx_pm_tasks_parent_batch
  ON pm_tasks (parent_project_id, issue_batch_id);

-- 既存タスクは各行を単独バッチとして扱う
UPDATE pm_tasks SET issue_batch_id = id WHERE issue_batch_id IS NULL;
