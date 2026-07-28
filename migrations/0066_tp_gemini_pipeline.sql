-- サードパーティ Gemini パイプライン用カラム

ALTER TABLE tp_projects ADD COLUMN workflow_phase TEXT NOT NULL DEFAULT 'discovery';
ALTER TABLE tp_projects ADD COLUMN dir_name TEXT;
ALTER TABLE tp_projects ADD COLUMN context_summary TEXT;
ALTER TABLE tp_projects ADD COLUMN pending_form_json TEXT;
ALTER TABLE tp_projects ADD COLUMN review_passed INTEGER;
ALTER TABLE tp_projects ADD COLUMN implement_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tp_projects ADD COLUMN review_loop_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE tp_projects ADD COLUMN awaiting_implement_confirm INTEGER NOT NULL DEFAULT 0;

UPDATE tp_projects
SET dir_name = CASE
  WHEN slug LIKE 'tp_%' THEN SUBSTR(slug, 4)
  ELSE slug
END
WHERE dir_name IS NULL;

UPDATE tp_projects
SET dir_name = 'app_' || SUBSTR(id, 4, 12)
WHERE dir_name IS NULL OR dir_name = '';

UPDATE tp_projects
SET r2_prefix = 'third-party/' || dir_name || '/'
WHERE dir_name IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tp_projects_dir_name ON tp_projects (dir_name);
