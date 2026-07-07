-- シフト表示用のユーザー色（0〜7）

ALTER TABLE users ADD COLUMN shift_color_index INTEGER NOT NULL DEFAULT 0;
