-- 認証・ロール管理スキーマ（既存 users テーブルを拡張）

CREATE TABLE IF NOT EXISTS roles (
  slug TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO roles (slug, display_name, is_admin, created_at) VALUES
  ('admin', '管理者', 1, 0),
  ('member', 'メンバー', 0, 0),
  ('guest', 'ゲスト', 0, 0);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at);

ALTER TABLE users ADD COLUMN username TEXT;
ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN role_slug TEXT NOT NULL DEFAULT 'member';

UPDATE users
SET
  username = CASE id
    WHEN 'demo-admin' THEN 'admin'
    WHEN 'demo-member' THEN 'member'
    ELSE lower(replace(id, '-', '_'))
  END,
  role_slug = role;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role_slug);

-- admin ユーザー（username: admin / pass: mmh@2048@5431）
UPDATE users
SET
  username = 'admin',
  email = 'admin@sciencehub.local',
  display_name = '管理者',
  role_slug = 'admin',
  role = 'admin',
  password_hash = '$pbkdf2-sha256$600000$VlFE7laN3Nc-nefs6ASJSA$n6_Qsw93jQwRttqJUA3fRVTfHfmifEYKvMeSNfk_YR0',
  updated_at = 0
WHERE id = 'demo-admin';
