-- 3D印刷: 管理操作ログ + タイムスロット分割グループ

CREATE TABLE IF NOT EXISTS print_admin_log (
  id TEXT PRIMARY KEY NOT NULL,
  at TEXT NOT NULL,
  actor TEXT NOT NULL,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  app_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_print_admin_log_at ON print_admin_log (at DESC);

ALTER TABLE print_reservations ADD COLUMN slot_group_id TEXT;
CREATE INDEX IF NOT EXISTS idx_print_reservations_slot_group ON print_reservations (slot_group_id);
