-- 造形物コンテスト（依頼・管理）を HUB から無効化（コード・DB データは保持）

DELETE FROM hub_apps WHERE slug IN ('contest-entry', 'contest-management');
