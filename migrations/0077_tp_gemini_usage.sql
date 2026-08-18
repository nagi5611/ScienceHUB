-- サードパーティ Gemini 呼び出しトークン記録（コスト観測用）

CREATE TABLE IF NOT EXISTS tp_gemini_usage (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES tp_projects (id) ON DELETE SET NULL,
  owner_user_id TEXT,
  model TEXT NOT NULL,
  usage_label TEXT NOT NULL,
  service_tier TEXT,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cached_tokens INTEGER NOT NULL DEFAULT 0,
  thoughts_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tp_gemini_usage_project
  ON tp_gemini_usage (project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tp_gemini_usage_owner
  ON tp_gemini_usage (owner_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tp_gemini_usage_label
  ON tp_gemini_usage (usage_label, created_at DESC);
