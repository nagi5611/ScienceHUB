-- プロジェクト管理: グループ別 Discord Webhook（タスク発行通知）

ALTER TABLE pm_admin_settings ADD COLUMN discord_webhook_url TEXT;
