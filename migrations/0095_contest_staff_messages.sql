-- 造形物コンテスト: 担当者から依頼者へのメッセージ（UI・メール連携）

CREATE TABLE IF NOT EXISTS contest_staff_messages (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  contest_application_id TEXT NOT NULL,
  print_reservation_id TEXT REFERENCES print_reservations (id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (
    kind IN ('print_rejected', 'accepted', 'decided', 'status_changed', 'custom')
  ),
  body TEXT NOT NULL,
  staff_display_name TEXT NOT NULL,
  created_by_user_id TEXT REFERENCES users (id) ON DELETE SET NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (contest_application_id) REFERENCES contest_applications (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_contest_staff_messages_user_created
  ON contest_staff_messages (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contest_staff_messages_application_created
  ON contest_staff_messages (contest_application_id, created_at DESC);
