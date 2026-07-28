-- サードパーティ メンテナンス試行回数

ALTER TABLE tp_projects ADD COLUMN maintain_attempts INTEGER NOT NULL DEFAULT 0;
