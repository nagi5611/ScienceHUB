-- アプリごとのチュートリアル動画（R2 保存）

CREATE TABLE IF NOT EXISTS hub_app_tutorial_videos (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL,
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (app_id) REFERENCES hub_apps(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hub_app_tutorial_videos_app
  ON hub_app_tutorial_videos (app_id, position ASC, created_at ASC);
