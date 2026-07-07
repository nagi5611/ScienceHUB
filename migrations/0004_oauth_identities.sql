-- OAuth 外部アカウント連携（Google / Microsoft）

CREATE TABLE IF NOT EXISTS oauth_identities (
  provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft')),
  subject TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  linked_at INTEGER NOT NULL,
  PRIMARY KEY (provider, subject)
);

CREATE INDEX IF NOT EXISTS idx_oauth_identities_user ON oauth_identities (user_id);
