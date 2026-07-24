-- 親/子プロジェクト階層を廃止（pm_availability は変更しない）
-- 子プロジェクトの担当者を親行へ移してから子行を削除する

INSERT OR IGNORE INTO pm_project_assignees (project_id, user_id, assigned_at)
SELECT c.parent_id, a.user_id, a.assigned_at
FROM pm_project_assignees a
JOIN pm_projects c ON c.id = a.project_id
WHERE c.parent_id IS NOT NULL;

UPDATE pm_tasks SET child_project_id = NULL WHERE child_project_id IS NOT NULL;

DELETE FROM pm_projects WHERE parent_id IS NOT NULL;
