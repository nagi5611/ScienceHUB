-- Luna エージェント: チャット履歴・日次ターン制限

CREATE TABLE IF NOT EXISTS luna_messages (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  files_json TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_luna_messages_user_created
  ON luna_messages (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS luna_daily_turns (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  turn_date TEXT NOT NULL,
  turn_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, turn_date)
);
