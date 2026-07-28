-- サードパーティ hub アプリのカラーをトップ（オレンジ）に合わせる

UPDATE hub_apps
SET color = '#F38020', updated_at = 0
WHERE slug = 'third-party' AND color = '#6366F1';
