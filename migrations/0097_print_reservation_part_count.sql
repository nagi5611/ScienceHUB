-- Multi-part print jobs: part_count drives consecutive calendar days and derived scale.

ALTER TABLE print_reservations ADD COLUMN part_count INTEGER NOT NULL DEFAULT 1
  CHECK (part_count >= 1 AND part_count <= 99);

ALTER TABLE print_reservations ADD COLUMN calendar_end_date TEXT NOT NULL DEFAULT '';

UPDATE print_reservations SET calendar_end_date = desired_date WHERE calendar_end_date = '';

CREATE INDEX IF NOT EXISTS idx_print_reservations_calendar_range
  ON print_reservations (desired_date, calendar_end_date);
