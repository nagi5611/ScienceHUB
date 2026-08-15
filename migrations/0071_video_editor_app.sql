-- 動画編集アプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_video_editor',
  'video-editor',
  '動画編集',
  '動画のトリミング・クロップ・回転・テキスト追加。ブラウザ内 ffmpeg で処理',
  '/apps/video-editor/',
  '✂️',
  '#EF4444',
  20,
  0,
  0
);

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_video_editor', id, 1 FROM hub_groups WHERE is_root = 1 LIMIT 1;
