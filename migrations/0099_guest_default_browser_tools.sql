-- ブラウザ内完結ツール: ログイン済みゲストも Default App として利用可（#172, #173 等）

UPDATE hub_apps
SET is_default = 1, updated_at = CAST(strftime('%s', 'now') AS INTEGER)
WHERE slug IN (
  'pdf-tools',
  'audio-editor',
  'audio-converter',
  'image-converter',
  'video-converter'
);
