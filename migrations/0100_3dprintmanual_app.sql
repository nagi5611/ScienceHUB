-- 3Dプリンター利用ガイド（静的マニュアル）アプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, is_default, created_at, updated_at
) VALUES (
  'app_3dprint_manual',
  '3dprintmanual',
  '3Dプリンター利用ガイド',
  '本校3Dプリンターの使い方マニュアル（予約前の確認用）',
  '/apps/3dprintmanual/',
  '📖',
  '#F6821F',
  9,
  1,
  0,
  0
);
