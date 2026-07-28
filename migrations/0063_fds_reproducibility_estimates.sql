-- FDS: 再現性メタデータ・失敗分類・一次審査履歴

ALTER TABLE sim_fds_requests ADD COLUMN input_sha256 TEXT;
ALTER TABLE sim_fds_requests ADD COLUMN primary_review_model TEXT;
ALTER TABLE sim_fds_requests ADD COLUMN primary_review_history TEXT;

ALTER TABLE sim_fds_jobs ADD COLUMN input_sha256 TEXT;
ALTER TABLE sim_fds_jobs ADD COLUMN output_sha256 TEXT;
ALTER TABLE sim_fds_jobs ADD COLUMN fds_ami_id TEXT;
ALTER TABLE sim_fds_jobs ADD COLUMN fds_solver_version TEXT;
ALTER TABLE sim_fds_jobs ADD COLUMN failure_category TEXT;
