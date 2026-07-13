-- 3D印刷: プリンター稼働日（シフト）と日次キャパ設定

CREATE TABLE IF NOT EXISTS print_printer_availability (
  printer_id TEXT NOT NULL,
  date TEXT NOT NULL,
  PRIMARY KEY (printer_id, date),
  FOREIGN KEY (printer_id) REFERENCES print_printers (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_print_printer_availability_date
  ON print_printer_availability (date);

ALTER TABLE print_printers ADD COLUMN daily_capacity_json TEXT NOT NULL DEFAULT '{}';
