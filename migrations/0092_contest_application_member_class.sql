-- 参加申請メンバー: クラス・出席番号を保持

ALTER TABLE contest_application_members ADD COLUMN homeroom TEXT;
ALTER TABLE contest_application_members ADD COLUMN student_number INTEGER;
