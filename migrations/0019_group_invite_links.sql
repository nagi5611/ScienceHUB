-- グループ招待リンク

CREATE TABLE IF NOT EXISTS group_invite_links (
  id TEXT PRIMARY KEY NOT NULL,
  token TEXT NOT NULL UNIQUE,
  group_id TEXT NOT NULL REFERENCES hub_groups (id) ON DELETE CASCADE,
  group_role_id TEXT NOT NULL REFERENCES group_roles (id) ON DELETE CASCADE,
  created_by_admin_username TEXT NOT NULL,
  use_count INTEGER NOT NULL DEFAULT 0,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS group_invite_redemptions (
  id TEXT PRIMARY KEY NOT NULL,
  invite_link_id TEXT NOT NULL REFERENCES group_invite_links (id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  redeemed_at INTEGER NOT NULL,
  UNIQUE (invite_link_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_invite_links_token
  ON group_invite_links (token);

CREATE INDEX IF NOT EXISTS idx_group_invite_links_group
  ON group_invite_links (group_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_group_invite_redemptions_link
  ON group_invite_redemptions (invite_link_id, redeemed_at DESC);
