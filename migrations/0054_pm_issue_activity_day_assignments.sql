-- 発行タスクの活動日ごとの担当者割り当て（管理者が設定。pm_availability とは別）

CREATE TABLE IF NOT EXISTS pm_issue_activity_day_overrides (
  issue_batch_id TEXT NOT NULL,
  activity_date TEXT NOT NULL,
  PRIMARY KEY (issue_batch_id, activity_date)
);

CREATE TABLE IF NOT EXISTS pm_issue_activity_day_override_users (
  issue_batch_id TEXT NOT NULL,
  activity_date TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (issue_batch_id, activity_date, user_id)
);

CREATE INDEX IF NOT EXISTS idx_pm_issue_activity_override_batch
  ON pm_issue_activity_day_overrides (issue_batch_id);
