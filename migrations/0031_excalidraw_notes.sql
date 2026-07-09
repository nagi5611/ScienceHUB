-- Excalidraw ノート + 共有リンク

CREATE TABLE IF NOT EXISTS excalidraw_notes (
  id TEXT PRIMARY KEY NOT NULL,
  owner_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '無題のノート',
  scene_json TEXT NOT NULL DEFAULT '{"elements":[],"appState":{},"files":{}}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_excalidraw_notes_owner
  ON excalidraw_notes (owner_user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS excalidraw_share_links (
  id TEXT PRIMARY KEY NOT NULL,
  note_id TEXT NOT NULL REFERENCES excalidraw_notes (id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_excalidraw_share_token
  ON excalidraw_share_links (token);

CREATE INDEX IF NOT EXISTS idx_excalidraw_share_note
  ON excalidraw_share_links (note_id);
