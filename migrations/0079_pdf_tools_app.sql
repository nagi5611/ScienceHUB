-- PDF結合・分割アプリ登録

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_pdf_tools',
  'pdf-tools',
  'PDF結合・分割',
  'PDFをブラウザ内で結合・分割。ファイルは端末外に送信しません',
  '/apps/pdf-tools/',
  '📄',
  '#f38020',
  24,
  0,
  0
);

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_pdf_tools', id, 1 FROM hub_groups WHERE is_root = 1 LIMIT 1;
