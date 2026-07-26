-- FDS 依頼: 一次審査パイプライン用ステータスとエラー文言

PRAGMA foreign_keys=OFF;

CREATE TABLE sim_fds_requests_new (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  desired_date TEXT,
  max_runtime_hours INTEGER NOT NULL,
  mpi_processes INTEGER NOT NULL,
  ec2_instance_type TEXT NOT NULL,
  input_r2_key TEXT NOT NULL,
  input_filename TEXT NOT NULL,
  input_size_bytes INTEGER NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (
    status IN (
      'primary_reviewing',
      'primary_failed',
      'primary_error',
      'pending_approval',
      'approved',
      'rejected',
      'cancelled'
    )
  ),
  fds_job_id TEXT,
  reviewed_by_user_id TEXT,
  reviewed_at TEXT,
  review_message TEXT,
  created_at TEXT NOT NULL,
  primary_review_passed INTEGER NOT NULL DEFAULT 1,
  primary_review_forced INTEGER NOT NULL DEFAULT 0,
  primary_review_issues TEXT,
  primary_review_error TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (fds_job_id) REFERENCES sim_fds_jobs (id) ON DELETE SET NULL
);

INSERT INTO sim_fds_requests_new (
  id, user_id, title, desired_date, max_runtime_hours, mpi_processes,
  ec2_instance_type, input_r2_key, input_filename, input_size_bytes,
  notes, status, fds_job_id, reviewed_by_user_id, reviewed_at, review_message,
  created_at, primary_review_passed, primary_review_forced, primary_review_issues,
  primary_review_error
)
SELECT
  id, user_id, title, desired_date, max_runtime_hours, mpi_processes,
  ec2_instance_type, input_r2_key, input_filename, input_size_bytes,
  notes, status, fds_job_id, reviewed_by_user_id, reviewed_at, review_message,
  created_at, primary_review_passed, primary_review_forced, primary_review_issues,
  NULL
FROM sim_fds_requests;

DROP TABLE sim_fds_requests;
ALTER TABLE sim_fds_requests_new RENAME TO sim_fds_requests;

CREATE INDEX IF NOT EXISTS idx_sim_fds_requests_status ON sim_fds_requests (status);
CREATE INDEX IF NOT EXISTS idx_sim_fds_requests_user_id ON sim_fds_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_sim_fds_requests_created_at ON sim_fds_requests (created_at);

PRAGMA foreign_keys=ON;
