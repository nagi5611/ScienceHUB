-- FDS 依頼: 一次審査（AI）結果の記録

ALTER TABLE sim_fds_requests ADD COLUMN primary_review_passed INTEGER NOT NULL DEFAULT 1;
ALTER TABLE sim_fds_requests ADD COLUMN primary_review_forced INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sim_fds_requests ADD COLUMN primary_review_issues TEXT;
