/**
 * Runa — 会話タブ（セッション）
 */

import { createId, now } from "../types";

export interface RunaConversationRow {
  id: string;
  user_id: string;
  title: string;
  created_at: number;
  updated_at: number;
  is_active: number;
  message_count?: number;
}

function conversationTitleFromMessage(text: string): string {
  const line = text.replace(/\s+/g, " ").trim();
  if (!line) return "新規チャット";
  return line.length > 48 ? `${line.slice(0, 48)}…` : line;
}

/** アクティブな会話 ID（なければ作成） */
export async function ensureActiveRunaConversation(
  db: D1Database,
  userId: string
): Promise<string> {
  const active = await db
    .prepare(
      `SELECT id FROM runa_conversations
       WHERE user_id = ? AND is_active = 1
       LIMIT 1`
    )
    .bind(userId)
    .first<{ id: string }>();

  if (active?.id) return active.id;

  const id = createId("runa_conv");
  const ts = now();
  await db
    .prepare(
      `INSERT INTO runa_conversations (id, user_id, title, created_at, updated_at, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`
    )
    .bind(id, userId, "新規チャット", ts, ts)
    .run();
  return id;
}

/** 新規チャット（旧タブを保持し、アクティブ会話を切り替え） */
export async function startNewRunaConversation(
  db: D1Database,
  userId: string
): Promise<string> {
  await db
    .prepare(
      `UPDATE runa_conversations SET is_active = 0, updated_at = ?
       WHERE user_id = ? AND is_active = 1`
    )
    .bind(now(), userId)
    .run();

  const id = createId("runa_conv");
  const ts = now();
  await db
    .prepare(
      `INSERT INTO runa_conversations (id, user_id, title, created_at, updated_at, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`
    )
    .bind(id, userId, "新規チャット", ts, ts)
    .run();
  return id;
}

/** 会話の updated_at を更新（初回ユーザーメッセージでタイトルも設定） */
export async function touchRunaConversation(
  db: D1Database,
  conversationId: string,
  options?: { userMessage?: string }
): Promise<void> {
  const ts = now();
  if (options?.userMessage?.trim()) {
    const conv = await db
      .prepare(`SELECT title FROM runa_conversations WHERE id = ?`)
      .bind(conversationId)
      .first<{ title: string }>();
    const title = conv?.title === "新規チャット"
      ? conversationTitleFromMessage(options.userMessage)
      : conv?.title ?? "チャット";
    await db
      .prepare(
        `UPDATE runa_conversations SET updated_at = ?, title = ? WHERE id = ?`
      )
      .bind(ts, title, conversationId)
      .run();
    return;
  }
  await db
    .prepare(`UPDATE runa_conversations SET updated_at = ? WHERE id = ?`)
    .bind(ts, conversationId)
    .run();
}

/** ユーザーの会話一覧（管理画面用） */
export async function listRunaConversationsForUser(
  db: D1Database,
  userId: string,
  limit = 50
): Promise<RunaConversationRow[]> {
  const capped = Math.min(100, Math.max(1, limit));
  const result = await db
    .prepare(
      `SELECT c.id, c.user_id, c.title, c.created_at, c.updated_at, c.is_active,
              (SELECT COUNT(*) FROM runa_messages m WHERE m.conversation_id = c.id) AS message_count
       FROM runa_conversations c
       WHERE c.user_id = ?
       ORDER BY c.updated_at DESC
       LIMIT ?`
    )
    .bind(userId, capped)
    .all<RunaConversationRow>();
  return result.results ?? [];
}

/** 全会話の概要（ユーザー名付き・管理画面） */
export async function listRunaConversationsAdmin(
  db: D1Database,
  options?: { userId?: string; limit?: number }
): Promise<
  Array<
    RunaConversationRow & {
      username: string | null;
      display_name: string | null;
      email: string | null;
    }
  >
> {
  const capped = Math.min(200, Math.max(1, options?.limit ?? 80));
  const userId = options?.userId?.trim();
  const sql = userId
    ? `SELECT c.id, c.user_id, c.title, c.created_at, c.updated_at, c.is_active,
              u.username, u.display_name, u.email,
              (SELECT COUNT(*) FROM runa_messages m WHERE m.conversation_id = c.id) AS message_count
       FROM runa_conversations c
       JOIN users u ON u.id = c.user_id
       WHERE c.user_id = ?
       ORDER BY c.updated_at DESC
       LIMIT ?`
    : `SELECT c.id, c.user_id, c.title, c.created_at, c.updated_at, c.is_active,
              u.username, u.display_name, u.email,
              (SELECT COUNT(*) FROM runa_messages m WHERE m.conversation_id = c.id) AS message_count
       FROM runa_conversations c
       JOIN users u ON u.id = c.user_id
       ORDER BY c.updated_at DESC
       LIMIT ?`;

  const result = userId
    ? await db.prepare(sql).bind(userId, capped).all()
    : await db.prepare(sql).bind(capped).all();

  return (result.results ?? []) as unknown as Array<
    RunaConversationRow & {
      username: string | null;
      display_name: string | null;
      email: string | null;
    }
  >;
}
