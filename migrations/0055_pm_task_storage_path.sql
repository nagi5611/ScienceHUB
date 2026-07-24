-- タスクごとのクラウドストレージ論理パス

ALTER TABLE pm_tasks ADD COLUMN storage_path TEXT;
