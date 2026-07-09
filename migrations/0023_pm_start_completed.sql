-- サブプロジェクト: 開始予定日 + 達成済み

ALTER TABLE pm_projects ADD COLUMN start_date TEXT;
ALTER TABLE pm_projects ADD COLUMN completed_at INTEGER;
