-- 造形物コンテストアプリ — 3D印刷と同じルートグループアクセス

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_contest_entry', group_id, enabled
FROM app_group_settings
WHERE app_id = 'app_3dprint_reservation';

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_contest_management', group_id, enabled
FROM app_group_settings
WHERE app_id = 'app_3dprint_management';

INSERT OR IGNORE INTO app_group_role_access (app_id, group_id, group_role_id)
SELECT 'app_contest_entry', group_id, group_role_id
FROM app_group_role_access
WHERE app_id = 'app_3dprint_reservation';

INSERT OR IGNORE INTO app_group_role_access (app_id, group_id, group_role_id)
SELECT 'app_contest_management', group_id, group_role_id
FROM app_group_role_access
WHERE app_id = 'app_3dprint_management';
