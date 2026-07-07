-- UVcreator アプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_uvcreator',
  'uvcreator',
  'UVcreator',
  '撮影画像の台形補正と複数画像の結合',
  '/apps/uvcreator/',
  '📐',
  '#F38020',
  1,
  0,
  0
);
