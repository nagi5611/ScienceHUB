-- プロジェクト管理: 親/子プロジェクト + グループ別活動可能日

CREATE TABLE IF NOT EXISTS pm_projects (
  id TEXT PRIMARY KEY NOT NULL,
  group_id TEXT NOT NULL,
  parent_id TEXT,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (group_id) REFERENCES hub_groups (id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES pm_projects (id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pm_projects_group
  ON pm_projects (group_id, parent_id, position);

CREATE TABLE IF NOT EXISTS pm_availability (
  id TEXT PRIMARY KEY NOT NULL,
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  avail_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'unavailable')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (group_id, user_id, avail_date),
  FOREIGN KEY (group_id) REFERENCES hub_groups (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pm_availability_group_user_date
  ON pm_availability (group_id, user_id, avail_date);
