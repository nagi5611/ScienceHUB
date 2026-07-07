-- メインロール・グループロールに重み（整数、大きいほど権限が高い）

ALTER TABLE roles ADD COLUMN weight INTEGER NOT NULL DEFAULT 1;
UPDATE roles SET weight = 100 WHERE slug = 'admin';
UPDATE roles SET weight = 50 WHERE slug = 'member';
UPDATE roles SET weight = 10 WHERE slug = 'guest';

ALTER TABLE group_roles ADD COLUMN weight INTEGER NOT NULL DEFAULT 1;
UPDATE group_roles SET weight = 10 WHERE slug = 'teacher';
UPDATE group_roles SET weight = 5 WHERE slug = 'student';
UPDATE group_roles SET weight = 1 WHERE slug = 'guest';
