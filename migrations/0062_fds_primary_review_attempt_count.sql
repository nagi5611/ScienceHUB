-- FDS 依頼: 一次審査の実施回数（再審上限用）

ALTER TABLE sim_fds_requests ADD COLUMN primary_review_attempt_count INTEGER NOT NULL DEFAULT 0;
