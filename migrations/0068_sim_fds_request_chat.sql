-- FDS 依頼チャット（依頼者 ↔ 担当者）

CREATE TABLE sim_fds_request_messages (
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
  FOREIGN KEY (request_id) REFERENCES sim_fds_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES users(id)
);

CREATE INDEX idx_sim_fds_msg_request_created
  ON sim_fds_request_messages(request_id, created_at);
