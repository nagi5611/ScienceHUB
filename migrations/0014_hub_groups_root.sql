-- 組織ルートグループ（全体カレンダー等の基準となる1グループ）
ALTER TABLE hub_groups ADD COLUMN is_root INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_hub_groups_single_root
  ON hub_groups (is_root)
  WHERE is_root = 1;
