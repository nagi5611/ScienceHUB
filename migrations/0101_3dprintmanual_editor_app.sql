-- 3Dプリンター利用ガイド編集アプリ（管理者向け）

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, is_default, created_at, updated_at
) VALUES (
  'app_3dprint_manual_editor',
  '3dprintmanual-editor',
  '利用ガイド編集',
  '3Dプリンター利用ガイドの本文・画像・動画を編集',
  '/apps/3dprintmanual-editor/',
  '✏️',
  '#F6821F',
  10,
  0,
  0,
  0
);

-- 3D印刷管理と同じグループ・ロールで利用可（管理者は全アプリ可）
INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_3dprint_manual_editor', group_id, enabled
FROM app_group_settings
WHERE app_id = 'app_3dprint_management';

INSERT OR IGNORE INTO app_group_role_access (app_id, group_id, group_role_id)
SELECT 'app_3dprint_manual_editor', group_id, group_role_id
FROM app_group_role_access
WHERE app_id = 'app_3dprint_management';
