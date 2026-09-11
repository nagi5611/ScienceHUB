-- Runa エージェント: luna_* テーブル名のリネーム（既存環境向け）

ALTER TABLE luna_messages RENAME TO runa_messages;
ALTER TABLE luna_daily_turns RENAME TO runa_daily_turns;
