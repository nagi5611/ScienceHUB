-- AI エージェント用 Personal Access Token

CREATE TABLE IF NOT EXISTS agent_tokens (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  token_prefix TEXT NOT NULL,
  scopes TEXT NOT NULL DEFAULT 'storage:read,storage:write',
  last_used_at INTEGER,
  expires_at INTEGER,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_tokens_user ON agent_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_agent_tokens_hash ON agent_tokens (token_hash);
