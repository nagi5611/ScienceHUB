-- 音声変換アプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_audio_converter',
  'audio-converter',
  '音声変換',
  '各種音声・動画の音声トラックを MP3 / M4A / OGG / FLAC / WAV に変換。大きなファイルはパート分割してブラウザ内で処理',
  '/apps/audio-converter/',
  '🎵',
  '#7C3AED',
  23,
  0,
  0
);

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_audio_converter', id, 1 FROM hub_groups WHERE is_root = 1 LIMIT 1;
