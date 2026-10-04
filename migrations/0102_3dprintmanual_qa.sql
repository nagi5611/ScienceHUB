-- 3Dプリンター利用ガイド Q&A

CREATE TABLE IF NOT EXISTS manual_qa_questions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  machine TEXT NOT NULL CHECK (machine IN ('ke', 'cc', 'both')),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  pinned INTEGER NOT NULL DEFAULT 0,
  resolved INTEGER NOT NULL DEFAULT 0,
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    moderation_status IN ('pending', 'approved', 'rejected')
  ),
  moderation_detail TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_manual_qa_questions_created
  ON manual_qa_questions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_manual_qa_questions_category
  ON manual_qa_questions (category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_manual_qa_questions_moderation
  ON manual_qa_questions (moderation_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_manual_qa_questions_resolved
  ON manual_qa_questions (resolved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_manual_qa_questions_user
  ON manual_qa_questions (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS manual_qa_posts (
  id TEXT PRIMARY KEY NOT NULL,
  question_id TEXT NOT NULL REFERENCES manual_qa_questions (id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('staff', 'asker')),
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_manual_qa_posts_question
  ON manual_qa_posts (question_id, created_at ASC);

CREATE TABLE IF NOT EXISTS manual_qa_attachments (
  id TEXT PRIMARY KEY NOT NULL,
  question_id TEXT NOT NULL REFERENCES manual_qa_questions (id) ON DELETE CASCADE,
  r2_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_manual_qa_attachments_question
  ON manual_qa_attachments (question_id, created_at ASC);

INSERT OR IGNORE INTO hub_apps (
  id, slug, display_name, description, href, icon_emoji, color, position, is_default, created_at, updated_at
) VALUES (
  'app_3dprint_manual_qa_admin',
  '3dprintmanual-qa-admin',
  '利用ガイド Q&A 管理',
  '3Dプリンター利用ガイドの質問への回答・解決管理',
  '/apps/3dprintmanual-qa-admin/',
  '💬',
  '#F6821F',
  11,
  0,
  0,
  0
);

INSERT OR IGNORE INTO app_group_settings (app_id, group_id, enabled)
SELECT 'app_3dprint_manual_qa_admin', group_id, enabled
FROM app_group_settings
WHERE app_id = 'app_3dprint_management';

INSERT OR IGNORE INTO app_group_role_access (app_id, group_id, group_role_id)
SELECT 'app_3dprint_manual_qa_admin', group_id, group_role_id
FROM app_group_role_access
WHERE app_id = 'app_3dprint_management';
