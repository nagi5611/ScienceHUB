-- FDS テスト実行ジョブ（AWS EC2 連携）

CREATE TABLE IF NOT EXISTS sim_fds_jobs (
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
  launched_at TEXT,
  finished_at TEXT,
  created_by_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (created_by_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sim_fds_jobs_status ON sim_fds_jobs (status);
CREATE INDEX IF NOT EXISTS idx_sim_fds_jobs_created_at ON sim_fds_jobs (created_at);
