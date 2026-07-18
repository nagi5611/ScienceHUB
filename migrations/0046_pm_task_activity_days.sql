-- タスクごとの活動日（発行時にカレンダーで選択）

CREATE TABLE IF NOT EXISTS pm_task_activity_days (
  task_id TEXT NOT NULL REFERENCES pm_tasks (id) ON DELETE CASCADE,
  activity_date TEXT NOT NULL,
  PRIMARY KEY (task_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_pm_task_activity_days_task
  ON pm_task_activity_days (task_id);
