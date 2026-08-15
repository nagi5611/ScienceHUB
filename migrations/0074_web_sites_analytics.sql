-- ウェブサイト公開 — 訪問数

ALTER TABLE web_sites ADD COLUMN visit_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE web_sites ADD COLUMN last_visit_at INTEGER;
