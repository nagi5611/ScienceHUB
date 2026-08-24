-- FDS 形式審査 (T_END) とジョブ進捗

ALTER TABLE sim_fds_requests ADD COLUMN t_end_seconds REAL;
ALTER TABLE sim_fds_requests ADD COLUMN format_review_issues TEXT;

ALTER TABLE sim_fds_jobs ADD COLUMN t_end_seconds REAL;
ALTER TABLE sim_fds_jobs ADD COLUMN simulation_time_seconds REAL;
ALTER TABLE sim_fds_jobs ADD COLUMN progress_pct REAL;
ALTER TABLE sim_fds_jobs ADD COLUMN progress_phase TEXT;
ALTER TABLE sim_fds_jobs ADD COLUMN progress_updated_at TEXT;
