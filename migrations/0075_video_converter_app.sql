-- 動画変換アプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_video_converter',
  'video-converter',
  '動画変換',
  '各種動画を MP4 / WebM に変換。大きなファイルはパート分割してブラウザ内で処理',
  '/apps/video-converter/',
  '🎬',
  '#2563EB',
  22,
  0,
  0
);

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_video_converter', id, 1 FROM hub_groups WHERE is_root = 1 LIMIT 1;
