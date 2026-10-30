-- Idempotent POST /api/3dprint/reservations (avoid duplicate rows on double-submit).
CREATE TABLE IF NOT EXISTS print_reservation_idempotency (
  idempotency_key TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  reservation_id TEXT REFERENCES print_reservations (id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed')),
  response_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_print_reservation_idempotency_user
  ON print_reservation_idempotency (user_id, created_at);
