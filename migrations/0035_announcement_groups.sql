-- お知らせの表示対象グループ（未設定 = 全員に表示）

CREATE TABLE IF NOT EXISTS announcement_groups (
  announcement_id TEXT NOT NULL REFERENCES announcements (id) ON DELETE CASCADE,
  group_id TEXT NOT NULL REFERENCES hub_groups (id) ON DELETE CASCADE,
  PRIMARY KEY (announcement_id, group_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_groups_group
  ON announcement_groups (group_id, announcement_id);
