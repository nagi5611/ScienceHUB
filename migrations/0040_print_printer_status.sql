-- 3D印刷: プリンター機種の稼働ステータス

ALTER TABLE print_printers ADD COLUMN status TEXT NOT NULL DEFAULT 'available' CHECK (
  status IN ('available', 'unavailable', 'maintenance')
);

CREATE INDEX IF NOT EXISTS idx_print_printers_status ON print_printers (status);
