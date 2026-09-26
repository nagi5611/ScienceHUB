-- プロジェクト管理: ルートグループで有効化（ローカル migrate 直後から利用可能に）

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_project_management', id, 1 FROM hub_groups WHERE is_root = 1 LIMIT 1;
