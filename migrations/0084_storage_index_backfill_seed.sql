-- 既存ストレージルートにバックフィル進捗行を追加（未作成のみ）
-- バックフィル完了前は検索・最近のファイル一覧が R2 フォールバックを使う

INSERT INTO storage_index_backfill (
  root_id,
  status,
  r2_cursor,
  files_indexed,
  last_error,
  updated_at
)
SELECT
  id,
  'pending',
  NULL,
  0,
  NULL,
  CAST(unixepoch('subsecond') * 1000 AS INTEGER)
FROM storage_roots
WHERE id NOT IN (SELECT root_id FROM storage_index_backfill);
