-- Runa: 会話タブ（セッション）とサイト全体設定

CREATE TABLE IF NOT EXISTS runa_conversations (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'チャット',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0 CHECK (is_active IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_runa_conversations_user_updated
  ON runa_conversations (user_id, updated_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_runa_conversations_user_active
  ON runa_conversations (user_id)
  WHERE is_active = 1;

ALTER TABLE runa_messages ADD COLUMN conversation_id TEXT REFERENCES runa_conversations (id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_runa_messages_conversation_created
  ON runa_messages (conversation_id, created_at ASC);

CREATE TABLE IF NOT EXISTS runa_site_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 既存メッセージをユーザーごとに 1 会話へ移行
INSERT INTO runa_conversations (id, user_id, title, created_at, updated_at, is_active)
SELECT
  'runa_conv_' || user_id,
  user_id,
  '履歴',
  MIN(created_at),
  MAX(created_at),
  1
FROM runa_messages
GROUP BY user_id;

UPDATE runa_messages
SET conversation_id = 'runa_conv_' || user_id
WHERE conversation_id IS NULL
  AND user_id IN (SELECT user_id FROM runa_conversations);
