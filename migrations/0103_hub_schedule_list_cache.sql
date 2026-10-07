-- ダッシュボードスケジュール一覧のユーザー別一時キャッシュ（Google マージ結果含む）

CREATE TABLE IF NOT EXISTS hub_schedule_list_cache (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, cache_key)
);

CREATE INDEX IF NOT EXISTS idx_hub_schedule_list_cache_user_updated
  ON hub_schedule_list_cache (user_id, updated_at);
