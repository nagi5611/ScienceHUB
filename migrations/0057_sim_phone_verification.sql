-- シミュレーション依頼者向け電話番号認証（Firebase Identity Platform 連携）

ALTER TABLE users ADD COLUMN phone_e164 TEXT;
ALTER TABLE users ADD COLUMN sim_phone_verified_at TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_e164 ON users (phone_e164)
  WHERE phone_e164 IS NOT NULL;

CREATE TABLE IF NOT EXISTS sim_phone_verification_logs (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  event TEXT NOT NULL CHECK (event IN ('consent', 'verify_success', 'verify_failed')),
  consent_text_version TEXT,
  phone_e164_hash TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT,
  firebase_uid TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sim_phone_verification_logs_user_id
  ON sim_phone_verification_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_sim_phone_verification_logs_created_at
  ON sim_phone_verification_logs (created_at);

CREATE TABLE IF NOT EXISTS sim_phone_verification_rate (
  user_id TEXT PRIMARY KEY NOT NULL,
  window_start TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
