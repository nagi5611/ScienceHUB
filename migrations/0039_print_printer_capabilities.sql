-- 3D印刷: プリンター機種ごとの能力・設定

ALTER TABLE print_printers ADD COLUMN capabilities_json TEXT NOT NULL DEFAULT '{}';
