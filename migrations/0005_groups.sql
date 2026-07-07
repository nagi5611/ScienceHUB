-- グループ・グループロール・ユーザー所属

CREATE TABLE IF NOT EXISTS hub_groups (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#F38020',
  position INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hub_groups_position ON hub_groups (position);

CREATE TABLE IF NOT EXISTS group_roles (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES hub_groups (id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#2C7CB0',
  position INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  UNIQUE (group_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_group_roles_group ON group_roles (group_id);

CREATE TABLE IF NOT EXISTS user_group_memberships (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  group_id TEXT NOT NULL REFERENCES hub_groups (id) ON DELETE CASCADE,
  group_role_id TEXT NOT NULL REFERENCES group_roles (id) ON DELETE CASCADE,
  assigned_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, group_id)
);

CREATE INDEX IF NOT EXISTS idx_user_group_memberships_user ON user_group_memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_user_group_memberships_group ON user_group_memberships (group_id);
