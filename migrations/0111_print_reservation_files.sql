-- Multiple print data files per reservation (up to 10); primary file remains on print_reservations.stl_*.
CREATE TABLE print_reservation_files (
  id TEXT PRIMARY KEY,
  reservation_id TEXT NOT NULL,
  file_index INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (reservation_id) REFERENCES print_reservations(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_print_reservation_files_res_index
  ON print_reservation_files (reservation_id, file_index);
CREATE INDEX idx_print_reservation_files_reservation
  ON print_reservation_files (reservation_id);

INSERT INTO print_reservation_files (id, reservation_id, file_index, r2_key, filename, size_bytes, created_at)
SELECT
  lower(hex(randomblob(16))),
  id,
  0,
  stl_r2_key,
  stl_filename,
  stl_size_bytes,
  created_at
FROM print_reservations
WHERE stl_r2_key IS NOT NULL AND TRIM(stl_r2_key) != '';
