-- 造形物コンテスト: 提出 STL のクラウドストレージ集約先

ALTER TABLE print_reservations ADD COLUMN contest_storage_path TEXT;
ALTER TABLE print_reservations ADD COLUMN contest_storage_filename TEXT;
