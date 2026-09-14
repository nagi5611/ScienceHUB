/**
 * Runa — コンテキスト超過時の会話履歴サマリー圧縮
 */

import type { Env } from "../types";
import { runaChatCompletion, type ChatMessage } from "./openai";
import {
  deleteRunaMessagesByIds,
  insertRunaMessage,
  listRunaMessages,
  type RunaMessageRow,
} from "./messages";
import type { RunaSseSend } from "./chat-sse";

const SUMMARY_PREFIX = "[Runa 会話サマリー — 自動生成]";
const DB_KEEP_RECENT_MESSAGES = 4;
const MEMORY_KEEP_RECENT_MESSAGES = 6;

const SUMMARIZE_SYSTEM_PROMPT = `あなたは Runa チャット履歴の要約担当です。
与えられた会話ログを日本語で要約し、以降の Runa が作業を続けられるようにしてください。

必ず含める:
- ユーザーの主な依頼・目的
- 確定した事実・決定事項
- 触れたファイル/フォルダの論理パス（バッククォート付き）
- 未完了タスクや次にやるべきこと

形式: 箇条書き中心、800〜1800 文字、見出し不要、前置き不要。`;

function isAutoSummaryMessage(content: string): boolean {
  return content.startsWith(SUMMARY_PREFIX);
}

function formatRowsForSummary(rows: RunaMessageRow[]): string {
  return rows
    .map((row) => `${row.role === "user" ? "ユーザー" : "Runa"}: ${row.content}`)
    .join("\n\n");
}

function formatMessagesForSummary(messages: ChatMessage[]): string {
  return messages
    .map((message) => {
      const role =
        message.role === "user"
          ? "ユーザー"
          : message.role === "assistant"
            ? "Runa"
            : message.role === "tool"
              ? "ツール結果"
              : message.role;
      const parts: string[] = [];
      if (message.content) parts.push(message.content);
      if (message.tool_calls?.length) {
        parts.push(
          message.tool_calls
            .map((call) => `[tool] ${call.function.name}(${call.function.arguments})`)
            .join("\n")
        );
      }
      return `${role}: ${parts.join("\n")}`;
    })
    .join("\n\n");
}

/** 会話ログを LLM で要約 */
async function summarizeTranscript(
  env: Env,
  transcript: string
): Promise<string | null> {
  if (!transcript.trim()) return null;

  const messages: ChatMessage[] = [
    { role: "system", content: SUMMARIZE_SYSTEM_PROMPT },
    {
      role: "user",
      content: `以下の会話を要約してください:\n\n${transcript.slice(0, 48_000)}`,
    },
  ];

  const completion = await runaChatCompletion(env, messages, []);
  const summary = completion.content?.trim();
  return summary || null;
}

export interface HistoryCompactResult {
  compacted: boolean;
  removed: number;
  kept: number;
  summaryPreview?: string;
}

/** DB 上の古い履歴を要約メッセージ1件に圧縮（手動・自動共通） */
export async function compactRunaDbHistory(
  env: Env,
  db: D1Database,
  userId: string,
  send?: RunaSseSend
): Promise<HistoryCompactResult> {
  const notify: RunaSseSend = send ?? (() => {});

  const rows = await listRunaMessages(db, userId, 100);
  if (rows.length <= DB_KEEP_RECENT_MESSAGES + 2) {
    return { compacted: false, removed: 0, kept: rows.length };
  }

  const existingSummary = rows.find(
    (row) => row.role === "assistant" && isAutoSummaryMessage(row.content)
  );
  const summarizable = rows.filter(
    (row) =>
      row.id !== existingSummary?.id &&
      rows.indexOf(row) < rows.length - DB_KEEP_RECENT_MESSAGES
  );
  if (summarizable.length < 1) {
    return { compacted: false, removed: 0, kept: rows.length };
  }

  const transcript = formatRowsForSummary(summarizable);
  notify("status", { label: "会話履歴を要約しています…" });
  const summaryBody = await summarizeTranscript(env, transcript);
  if (!summaryBody) {
    return { compacted: false, removed: 0, kept: rows.length };
  }

  const summaryContent = `${SUMMARY_PREFIX}\n${summaryBody}`;
  const keepRows = rows.slice(-DB_KEEP_RECENT_MESSAGES);
  const deleteIds = summarizable.map((row) => row.id);
  if (existingSummary) deleteIds.push(existingSummary.id);

  await deleteRunaMessagesByIds(db, userId, deleteIds);

  const anchorCreatedAt = keepRows[0]?.created_at ?? Date.now();
  await insertRunaMessage(
    db,
    userId,
    "assistant",
    summaryContent,
    null,
    anchorCreatedAt - 1
  );

  const result: HistoryCompactResult = {
    compacted: true,
    removed: deleteIds.length,
    kept: keepRows.length,
    summaryPreview: summaryBody.slice(0, 240),
  };

  notify("history_compact", result);
  return result;
}

/** 使用率超過時のみ DB 履歴を圧縮 */
export async function compactRunaDbHistoryIfNeeded(
  env: Env,
  db: D1Database,
  userId: string,
  send: RunaSseSend
): Promise<boolean> {
  const result = await compactRunaDbHistory(env, db, userId, send);
  return result.compacted;
}

/** エージェントループ中の in-memory messages を圧縮 */
export async function compactInMemoryMessagesIfNeeded(
  env: Env,
  messages: ChatMessage[],
  _tools: unknown,
  send: RunaSseSend
): Promise<boolean> {
  if (messages.length <= MEMORY_KEEP_RECENT_MESSAGES + 2) return false;

  const systemMessage = messages[0];
  if (!systemMessage || systemMessage.role !== "system") return false;

  const tail = messages.slice(-MEMORY_KEEP_RECENT_MESSAGES);
  const head = messages.slice(1, messages.length - MEMORY_KEEP_RECENT_MESSAGES);
  const summarizable = head.filter(
    (message) =>
      !(
        message.role === "assistant" &&
        typeof message.content === "string" &&
        isAutoSummaryMessage(message.content)
      )
  );
  if (summarizable.length < 1) return false;

  send("status", { label: "コンテキストを要約しています…" });
  const summaryBody = await summarizeTranscript(
    env,
    formatMessagesForSummary(summarizable)
  );
  if (!summaryBody) return false;

  messages.splice(1, messages.length - 1 - tail.length, {
    role: "assistant",
    content: `${SUMMARY_PREFIX}\n${summaryBody}`,
  });
  return true;
}
