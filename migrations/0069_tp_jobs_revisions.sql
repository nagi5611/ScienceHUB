-- サードパーティ: バックグラウンドジョブ + リビジョンスナップショット

CREATE TABLE IF NOT EXISTS tp_jobs (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL REFERENCES tp_projects (id) ON DELETE CASCADE,
  owner_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('implement', 'verify')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'running', 'succeeded', 'failed', 'cancelled')
  ),
  progress_json TEXT,
  error_message TEXT,
  result_json TEXT,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  finished_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_tp_jobs_project ON tp_jobs (project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tp_jobs_status ON tp_jobs (status, created_at DESC);

ALTER TABLE tp_revisions ADD COLUMN r2_snapshot_key TEXT;
ALTER TABLE tp_revisions ADD COLUMN job_id TEXT;

ALTER TABLE tp_projects ADD COLUMN active_job_id TEXT;
