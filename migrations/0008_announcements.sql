-- ダッシュボードお知らせ
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY NOT NULL,
  body TEXT NOT NULL,
  published_at INTEGER NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_announcements_list
  ON announcements (is_published, position DESC, published_at DESC);

-- 既存サンプル相当の初期データ
INSERT INTO announcements (id, body, published_at, position, is_published, created_at, updated_at)
VALUES
  (
    'ann_maint0706',
    'ScienceHUBのメンテナンス 03:00~04:00',
    1783306800000,
    2,
    1,
    1783306800000,
    1783306800000
  ),
  (
    'ann_contest0706',
    'teamA 社会共創コンテスト受賞！',
    1783306800000,
    1,
    1,
    1783306800000,
    1783306800000
  ),
  (
    'ann_orient0704',
    '新メンバー向けオリエンテーション資料を共有しました',
    1783134000000,
    0,
    1,
    1783134000000,
    1783134000000
  );
