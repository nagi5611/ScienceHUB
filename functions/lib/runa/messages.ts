/**
 * Runa — チャット履歴・日次制限
 */

import { createId, now, type Env } from "../types";
import { runaMaxDailyTurns } from "./env";
import {
  ensureActiveRunaConversation,
  startNewRunaConversation,
  touchRunaConversation,
} from "./conversations";
import type { RunaFileItem } from "./tools";

const DEFAULT_MAX_DAILY_TURNS = 50;

export interface RunaMessageRow {
  id: string;
  role: "user" | "assistant";
  content: string;
  files: RunaFileItem[] | null;
  created_at: number;
}

function todayJstDateString(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

function resolveMaxDailyTurns(env: Env): number {
  const parsed = Number.parseInt(runaMaxDailyTurns(env) ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_DAILY_TURNS;
}

/** 本日のユーザーメッセージ上限を検証 */
export async function assertRunaDailyTurnLimit(
  db: D1Database,
  userId: string,
  env: Env
): Promise<void> {
  const maxTurns = resolveMaxDailyTurns(env);
  const turnDate = todayJstDateString();
  const row = await db
    .prepare(
      `SELECT turn_count FROM runa_daily_turns WHERE user_id = ? AND turn_date = ?`
    )
    .bind(userId, turnDate)
    .first<{ turn_count: number }>();

  if ((row?.turn_count ?? 0) >= maxTurns) {
    throw new Error("本日の Runa 利用上限に達しました。明日またお試しください。");
  }
}

/** ユーザーターンをカウント */
export async function incrementRunaDailyTurn(
  db: D1Database,
  userId: string
): Promise<void> {
  const turnDate = todayJstDateString();
  await db
    .prepare(
      `INSERT INTO runa_daily_turns (user_id, turn_date, turn_count)
       VALUES (?, ?, 1)
       ON CONFLICT(user_id, turn_date) DO UPDATE SET
         turn_count = turn_count + 1`
    )
    .bind(userId, turnDate)
    .run();
}

/** 直近メッセージを取得（アクティブ会話・時系列昇順） */
export async function listRunaMessages(
  db: D1Database,
  userId: string,
  limit = 50,
  conversationId?: string
): Promise<RunaMessageRow[]> {
  const capped = Math.min(100, Math.max(1, limit));
  const convId =
    conversationId ?? (await ensureActiveRunaConversation(db, userId));
  const result = await db
    .prepare(
      `SELECT id, role, content, files_json, created_at FROM (
         SELECT id, role, content, files_json, created_at
         FROM runa_messages
         WHERE user_id = ? AND conversation_id = ?
         ORDER BY created_at DESC
         LIMIT ?
       ) ORDER BY created_at ASC`
    )
    .bind(userId, convId, capped)
    .all<{
      id: string;
      role: string;
      content: string;
      files_json: string | null;
      created_at: number;
    }>();

  return (result.results ?? []).map((row) => ({
    id: row.id,
    role: row.role === "assistant" ? "assistant" : "user",
    content: row.content,
    files: row.files_json ? (JSON.parse(row.files_json) as RunaFileItem[]) : null,
    created_at: row.created_at,
  }));
}

/** 管理画面: 指定会話のメッセージ */
export async function listRunaMessagesForConversation(
  db: D1Database,
  conversationId: string,
  limit = 200
): Promise<RunaMessageRow[]> {
  const capped = Math.min(500, Math.max(1, limit));
  const result = await db
    .prepare(
      `SELECT id, role, content, files_json, created_at FROM (
         SELECT id, role, content, files_json, created_at
         FROM runa_messages
         WHERE conversation_id = ?
         ORDER BY created_at DESC
         LIMIT ?
       ) ORDER BY created_at ASC`
    )
    .bind(conversationId, capped)
    .all<{
      id: string;
      role: string;
      content: string;
      files_json: string | null;
      created_at: number;
    }>();

  return (result.results ?? []).map((row) => ({
    id: row.id,
    role: row.role === "assistant" ? "assistant" : "user",
    content: row.content,
    files: row.files_json ? (JSON.parse(row.files_json) as RunaFileItem[]) : null,
    created_at: row.created_at,
  }));
}

/** メッセージを保存（アクティブ会話） */
export async function insertRunaMessage(
  db: D1Database,
  userId: string,
  role: "user" | "assistant",
  content: string,
  files: RunaFileItem[] | null = null,
  createdAt?: number,
  conversationId?: string
): Promise<string> {
  const convId =
    conversationId ?? (await ensureActiveRunaConversation(db, userId));
  const id = createId("runa");
  await db
    .prepare(
      `INSERT INTO runa_messages (id, user_id, conversation_id, role, content, files_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      userId,
      convId,
      role,
      content,
      files?.length ? JSON.stringify(files) : null,
      createdAt ?? now()
    )
    .run();
  await touchRunaConversation(db, convId, {
    userMessage: role === "user" ? content : undefined,
  });
  return id;
}

/** 指定 ID のメッセージを削除 */
export async function deleteRunaMessagesByIds(
  db: D1Database,
  userId: string,
  ids: string[]
): Promise<void> {
  if (!ids.length) return;
  const placeholders = ids.map(() => "?").join(", ");
  await db
    .prepare(
      `DELETE FROM runa_messages WHERE user_id = ? AND id IN (${placeholders})`
    )
    .bind(userId, ...ids)
    .run();
}

/** 新規チャット（履歴は会話タブとして D1 に残す） */
export async function clearRunaMessages(
  db: D1Database,
  userId: string
): Promise<void> {
  await startNewRunaConversation(db, userId);
}

/** 会話履歴を OpenAI メッセージ形式に変換（直近 N 件） */
export async function buildRunaChatHistory(
  db: D1Database,
  userId: string,
  maxMessages = 20
): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
  const rows = await listRunaMessages(db, userId, maxMessages);
  return rows.map((row) => ({
    role: row.role,
    content: row.content,
  }));
}
