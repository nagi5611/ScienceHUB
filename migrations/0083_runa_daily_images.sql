-- Runa 画像生成の日次上限カウンタ

CREATE TABLE IF NOT EXISTS runa_daily_images (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  image_date TEXT NOT NULL,
  image_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, image_date)
);
