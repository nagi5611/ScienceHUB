-- 3D印刷: 利用可能プリンター機種 + 予約への紐付け

CREATE TABLE IF NOT EXISTS print_printers (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  image_r2_key TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_print_printers_position ON print_printers (position);

ALTER TABLE print_reservations ADD COLUMN printer_id TEXT REFERENCES print_printers (id);

CREATE INDEX IF NOT EXISTS idx_print_reservations_printer_id ON print_reservations (printer_id);
