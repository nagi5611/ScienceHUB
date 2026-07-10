-- Excalidraw アプリの表示名を「ホワイトボード」に変更

UPDATE hub_apps
SET display_name = 'ホワイトボード'
WHERE slug = 'excalidraw';
