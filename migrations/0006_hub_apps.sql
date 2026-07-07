-- グループ・グループロール連動のアプリ管理

CREATE TABLE IF NOT EXISTS hub_apps (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  href TEXT NOT NULL,
  icon_emoji TEXT,
  color TEXT NOT NULL DEFAULT '#F38020',
  position INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hub_apps_position ON hub_apps (position ASC, slug ASC);

-- グループごとにアプリを表示するか（enabled=1 で表示）
CREATE TABLE IF NOT EXISTS app_group_settings (
  app_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (app_id, group_id),
  FOREIGN KEY (app_id) REFERENCES hub_apps(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES hub_groups(id) ON DELETE CASCADE
);

-- 特定ロールのみアクセス可（行が無ければグループ内全ロール可）
CREATE TABLE IF NOT EXISTS app_group_role_access (
  app_id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  group_role_id TEXT NOT NULL,
  PRIMARY KEY (app_id, group_id, group_role_id),
  FOREIGN KEY (app_id) REFERENCES hub_apps(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES hub_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (group_role_id) REFERENCES group_roles(id) ON DELETE CASCADE
);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, created_at, updated_at
) VALUES (
  'app_image_editor',
  'image-editor',
  '画像編集アプリ',
  'サンプル画像編集ツール（明るさ・回転・グレースケール）',
  '/apps/image-editor/',
  '🖼',
  '#7C3AED',
  0,
  0,
  0
);
