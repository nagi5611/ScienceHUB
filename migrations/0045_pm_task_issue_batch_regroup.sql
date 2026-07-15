-- 同一発行（親・タイトル・子・納期・作成者・作成時刻が同じ）を1つの issue_batch_id に統合

UPDATE pm_tasks
SET issue_batch_id = (
  SELECT MIN(t2.id)
  FROM pm_tasks t2
  WHERE t2.parent_project_id = pm_tasks.parent_project_id
    AND t2.title = pm_tasks.title
    AND IFNULL(t2.child_project_id, '') = IFNULL(pm_tasks.child_project_id, '')
    AND IFNULL(t2.due_date, '') = IFNULL(pm_tasks.due_date, '')
    AND t2.created_by = pm_tasks.created_by
    AND t2.created_at = pm_tasks.created_at
)
WHERE parent_project_id IS NOT NULL;
