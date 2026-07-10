-- ヘッダー Default App メニュー用フラグ

ALTER TABLE hub_apps ADD COLUMN is_default INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_hub_apps_default
  ON hub_apps (is_default, position ASC);
