-- テニスボール運動解析アプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_tennis_motion',
  'tennis-motion',
  'テニスボール運動解析',
  '動画からボール軌道を追跡し、速度・加速度・投射角を解析（端末内完結）',
  '/apps/tennis-motion/',
  '🎾',
  '#F38020',
  17,
  0,
  0
);
