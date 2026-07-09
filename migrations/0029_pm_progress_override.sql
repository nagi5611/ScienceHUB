-- 親プロジェクトの進捗率手動上書き（NULL = 子の達成率から自動算出）

ALTER TABLE pm_projects ADD COLUMN progress_override INTEGER;
