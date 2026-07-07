-- 複数ロール対応（user_roles 中間テーブル）

ALTER TABLE roles ADD COLUMN color TEXT NOT NULL DEFAULT '#F38020';
ALTER TABLE roles ADD COLUMN position INTEGER NOT NULL DEFAULT 0;

UPDATE roles SET color = '#E31837', position = 0 WHERE slug = 'admin';
UPDATE roles SET color = '#2C7CB0', position = 1 WHERE slug = 'member';
UPDATE roles SET color = '#8B949E', position = 2 WHERE slug = 'guest';

CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL,
  role_slug TEXT NOT NULL,
  assigned_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, role_slug),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (role_slug) REFERENCES roles (slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles (role_slug);

INSERT OR IGNORE INTO user_roles (user_id, role_slug, assigned_at)
SELECT id, role_slug, COALESCE(updated_at, 0)
FROM users
WHERE role_slug IS NOT NULL AND role_slug != '';
