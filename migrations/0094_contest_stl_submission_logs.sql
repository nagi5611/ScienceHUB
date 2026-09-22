-- 造形物コンテスト: STL 提出ログ（管理画面の提出履歴表示用）

CREATE TABLE IF NOT EXISTS contest_stl_submission_logs (
  id TEXT PRIMARY KEY NOT NULL,
  contest_application_id TEXT REFERENCES contest_applications (id) ON DELETE SET NULL,
  print_reservation_id TEXT REFERENCES print_reservations (id) ON DELETE SET NULL,
  sequence_number INTEGER NOT NULL,
  submission_kind TEXT NOT NULL CHECK (submission_kind IN ('initial', 'replacement')),
  stl_r2_key TEXT NOT NULL,
  stl_filename TEXT NOT NULL,
  stl_size_bytes INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL,
  uploaded_by_user_id TEXT NOT NULL,
  uploader_role TEXT NOT NULL CHECK (uploader_role IN ('user', 'admin')),
  FOREIGN KEY (uploaded_by_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_contest_stl_logs_application_seq
  ON contest_stl_submission_logs (contest_application_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_contest_stl_logs_reservation
  ON contest_stl_submission_logs (print_reservation_id);
CREATE INDEX IF NOT EXISTS idx_contest_stl_logs_uploaded_at
  ON contest_stl_submission_logs (uploaded_at DESC);

-- 既存データのバックフィル（自己印刷）
INSERT INTO contest_stl_submission_logs (
  id, contest_application_id, print_reservation_id, sequence_number, submission_kind,
  stl_r2_key, stl_filename, stl_size_bytes, uploaded_at, uploaded_by_user_id, uploader_role
)
SELECT
  'backfill-app-' || ca.id,
  ca.id,
  NULL,
  1,
  'initial',
  ca.stl_r2_key,
  ca.stl_filename,
  ca.stl_size_bytes,
  ca.stl_submitted_at,
  ca.user_id,
  'user'
FROM contest_applications ca
WHERE ca.stl_submitted_at IS NOT NULL
  AND ca.stl_r2_key IS NOT NULL
  AND ca.stl_filename IS NOT NULL
  AND ca.stl_size_bytes IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM contest_stl_submission_logs l WHERE l.id = 'backfill-app-' || ca.id
  );

-- 既存 contest 予約（参加申請に紐づくもの）
INSERT INTO contest_stl_submission_logs (
  id, contest_application_id, print_reservation_id, sequence_number, submission_kind,
  stl_r2_key, stl_filename, stl_size_bytes, uploaded_at, uploaded_by_user_id, uploader_role
)
SELECT
  'backfill-res-' || numbered.id,
  numbered.contest_application_id,
  numbered.id,
  numbered.prior_count + numbered.rn,
  CASE WHEN numbered.prior_count + numbered.rn = 1 THEN 'initial' ELSE 'replacement' END,
  numbered.stl_r2_key,
  numbered.stl_filename,
  numbered.stl_size_bytes,
  numbered.created_at,
  numbered.user_id,
  'user'
FROM (
  SELECT
    pr.*,
    ROW_NUMBER() OVER (
      PARTITION BY pr.contest_application_id
      ORDER BY pr.created_at ASC, pr.id ASC
    ) AS rn,
    (SELECT COUNT(*) FROM contest_stl_submission_logs l
     WHERE l.contest_application_id = pr.contest_application_id) AS prior_count
  FROM print_reservations pr
  WHERE pr.source = 'contest'
    AND pr.contest_application_id IS NOT NULL
) AS numbered
WHERE NOT EXISTS (
  SELECT 1 FROM contest_stl_submission_logs l WHERE l.id = 'backfill-res-' || numbered.id
);

-- 参加申請なしの contest 予約
INSERT INTO contest_stl_submission_logs (
  id, contest_application_id, print_reservation_id, sequence_number, submission_kind,
  stl_r2_key, stl_filename, stl_size_bytes, uploaded_at, uploaded_by_user_id, uploader_role
)
SELECT
  'backfill-res-' || pr.id,
  NULL,
  pr.id,
  1,
  'initial',
  pr.stl_r2_key,
  pr.stl_filename,
  pr.stl_size_bytes,
  pr.created_at,
  pr.user_id,
  'user'
FROM print_reservations pr
WHERE pr.source = 'contest'
  AND pr.contest_application_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM contest_stl_submission_logs l WHERE l.id = 'backfill-res-' || pr.id
  );
