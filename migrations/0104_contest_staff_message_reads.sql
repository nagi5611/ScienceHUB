-- 造形物コンテスト: 担当者メッセージの既読（ユーザーごと）

CREATE TABLE IF NOT EXISTS contest_staff_message_reads (
  user_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  read_at TEXT NOT NULL,
  PRIMARY KEY (user_id, message_id),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES contest_staff_messages (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_contest_staff_message_reads_user
  ON contest_staff_message_reads (user_id);
