-- 3D印刷: 時間枠ベースの予約・依頼（handoff モデル）

ALTER TABLE print_reservations ADD COLUMN booking_kind TEXT
  CHECK (booking_kind IS NULL OR booking_kind IN ('reserve', 'request'));
ALTER TABLE print_reservations ADD COLUMN start_minute INTEGER;
ALTER TABLE print_reservations ADD COLUMN end_minute INTEGER;

-- プリンター ↔ 機種レーン (ke / cc)
ALTER TABLE print_printers ADD COLUMN machine_lane TEXT
  CHECK (machine_lane IS NULL OR machine_lane IN ('ke', 'cc'));

CREATE INDEX IF NOT EXISTS idx_print_reservations_desired_date_printer
  ON print_reservations (desired_date, printer_id);
