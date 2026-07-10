-- プロジェクト管理: Excalidraw ノート紐付け + グループ共有ノート

ALTER TABLE pm_projects ADD COLUMN excalidraw_note_id TEXT REFERENCES excalidraw_notes (id);

ALTER TABLE excalidraw_notes ADD COLUMN group_id TEXT REFERENCES hub_groups (id);

CREATE INDEX IF NOT EXISTS idx_excalidraw_notes_group
  ON excalidraw_notes (group_id, updated_at DESC);
