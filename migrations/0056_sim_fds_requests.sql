-- FDS シミュレーション依頼（承認キュー）とジョブ実行パラメータ

ALTER TABLE sim_fds_jobs ADD COLUMN max_runtime_hours INTEGER NOT NULL DEFAULT 10;
ALTER TABLE sim_fds_jobs ADD COLUMN mpi_processes INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS sim_fds_requests (
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
    status IN ('pending_approval', 'approved', 'rejected', 'cancelled')
  ),
  fds_job_id TEXT,
  reviewed_by_user_id TEXT,
  reviewed_at TEXT,
  review_message TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (fds_job_id) REFERENCES sim_fds_jobs (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_sim_fds_requests_status ON sim_fds_requests (status);
CREATE INDEX IF NOT EXISTS idx_sim_fds_requests_user_id ON sim_fds_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_sim_fds_requests_created_at ON sim_fds_requests (created_at);
