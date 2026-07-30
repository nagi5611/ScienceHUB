-- OpenFOAM シミュレーション依頼・ジョブ（FDS と同構造）

CREATE TABLE IF NOT EXISTS sim_openfoam_jobs (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  input_r2_key TEXT NOT NULL,
  input_filename TEXT NOT NULL,
  input_size_bytes INTEGER NOT NULL,
  output_r2_key TEXT,
  output_filename TEXT,
  output_size_bytes INTEGER,
  log_r2_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'launching', 'running', 'succeeded', 'failed', 'cancelled', 'timed_out')
  ),
  status_message TEXT,
  ec2_instance_id TEXT,
  ec2_instance_type TEXT NOT NULL DEFAULT 't3.micro',
  max_runtime_hours INTEGER NOT NULL DEFAULT 10,
  mpi_processes INTEGER NOT NULL DEFAULT 1,
  launched_at TEXT,
  finished_at TEXT,
  created_by_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  input_sha256 TEXT,
  output_sha256 TEXT,
  openfoam_ami_id TEXT,
  openfoam_solver_version TEXT,
  failure_category TEXT,
  FOREIGN KEY (created_by_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sim_openfoam_jobs_status ON sim_openfoam_jobs (status);
CREATE INDEX IF NOT EXISTS idx_sim_openfoam_jobs_created_at ON sim_openfoam_jobs (created_at);

CREATE TABLE IF NOT EXISTS sim_openfoam_requests (
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
  status TEXT NOT NULL DEFAULT 'primary_reviewing' CHECK (
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
  openfoam_job_id TEXT,
  reviewed_by_user_id TEXT,
  reviewed_at TEXT,
  review_message TEXT,
  created_at TEXT NOT NULL,
  primary_review_passed INTEGER NOT NULL DEFAULT 0,
  primary_review_forced INTEGER NOT NULL DEFAULT 0,
  primary_review_issues TEXT,
  primary_review_error TEXT,
  primary_review_attempt_count INTEGER NOT NULL DEFAULT 0,
  input_sha256 TEXT,
  primary_review_model TEXT,
  primary_review_history TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (openfoam_job_id) REFERENCES sim_openfoam_jobs (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_sim_openfoam_requests_status ON sim_openfoam_requests (status);
CREATE INDEX IF NOT EXISTS idx_sim_openfoam_requests_user_id ON sim_openfoam_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_sim_openfoam_requests_created_at ON sim_openfoam_requests (created_at);

CREATE TABLE IF NOT EXISTS sim_openfoam_request_messages (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  sender_user_id TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  attachment_r2_key TEXT,
  attachment_filename TEXT,
  attachment_size_bytes INTEGER,
  attachment_content_type TEXT,
  attachment_expires_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES sim_openfoam_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES users(id)
);

CREATE INDEX idx_sim_openfoam_msg_request_created
  ON sim_openfoam_request_messages(request_id, created_at);
