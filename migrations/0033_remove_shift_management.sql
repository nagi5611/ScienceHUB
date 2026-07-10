-- シフト管理アプリを削除（プロジェクト管理の pm_availability に機能を集約）

DELETE FROM hub_apps WHERE slug = 'shift-management';

DROP TABLE IF EXISTS shift_availability;
