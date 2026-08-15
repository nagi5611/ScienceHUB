-- 音声編集アプリ登録



INSERT OR IGNORE INTO hub_apps (

  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at

) VALUES (

  'app_audio_editor',

  'audio-editor',

  '音声編集',

  'MP3 等のトリミング・フェード・着信音作成。動画から音声抽出にも対応（ブラウザ内 ffmpeg）',

  '/apps/audio-editor/',

  '🎵',

  '#8B5CF6',

  21,

  0,

  0

);



INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)

SELECT 'app_audio_editor', id, 1 FROM hub_groups WHERE is_root = 1 LIMIT 1;

