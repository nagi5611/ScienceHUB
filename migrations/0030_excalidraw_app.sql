-- Excalidraw ホワイトボードアプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_excalidraw',
  'excalidraw',
  'ホワイトボード',
  '手書き風ホワイトボード（図形・矢印・テキスト）',
  '/apps/excalidraw/',
  '✏️',
  '#6965DB',
  10,
  0,
  0
);
