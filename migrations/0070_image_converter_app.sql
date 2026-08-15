-- 画像変換アプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_image_converter',
  'image-converter',
  '画像変換',
  '各種画像・PDFを指定形式に変換。HEIC / TIFF / RAW は Cloudflare Images で変換',
  '/apps/image-converter/',
  '🔄',
  '#0EA5E9',
  19,
  0,
  0
);
