-- Link print staff roster to ScienceHUB users; enrich admin audit log.

ALTER TABLE print_members ADD COLUMN user_id TEXT REFERENCES users(id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_print_members_user_id
  ON print_members (user_id)
  WHERE user_id IS NOT NULL;

ALTER TABLE print_admin_log ADD COLUMN actor_user_id TEXT;
ALTER TABLE print_admin_log ADD COLUMN actor_member_id TEXT;
