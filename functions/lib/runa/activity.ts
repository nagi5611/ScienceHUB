/**
 * Runa — SSE アクティビティ（thinking / working / writing）
 */

import type { RunaSseSend } from "./chat-sse";

export type RunaActivityPhase = "thinking" | "working" | "writing";

export interface RunaActivityPayload {
  id: string;
  phase: RunaActivityPhase;
  label: string;
  detail?: string;
  state: "start" | "done" | "error";
}

/** アクティビティイベントを送信するヘルパー */
export class RunaActivityLog {
  private seq = 0;

  constructor(private readonly send: RunaSseSend) {}

  start(
    phase: RunaActivityPhase,
    label: string,
    detail?: string
  ): string {
    const id = `${phase}-${++this.seq}`;
    this.emit({ id, phase, label, detail, state: "start" });
    return id;
  }

  finish(id: string, phase: RunaActivityPhase, detail?: string): void {
    this.emit({ id, phase, label: "", detail, state: "done" });
  }

  private emit(payload: RunaActivityPayload): void {
    this.send("activity", payload);
  }
}

/** 特定ユーザーに紐づくファイル質問か（高速パスを使わない） */
export function isUserScopedFilesQuery(message: string): boolean {
  const text = message.trim();
  if (!text) return false;

  if (
    /操作したユーザー|操作したユーザ|ファイル操作した|誰が操作|誰が触|誰が更新|誰が編集/.test(
      text
    )
  ) {
    return true;
  }

  if (
    /(の|が)(直近|最近).*(操作|触|更新|編集|アップロード)/.test(text) ||
    /(操作|触|更新|編集|アップロード)したファイル/.test(text)
  ) {
    return true;
  }

  if (
    /[ぁ-んァ-ヶーa-zA-Z0-9]{2,}.*(の|が).*(操作|触った|更新|編集)/.test(text)
  ) {
    return true;
  }

  if (/ユーザー.*(検索|一覧|探)/.test(text)) return true;

  return false;
}

/** 最近更新ファイルの質問かどうか（AI を迂回する高速パス用） */
export function isRecentFilesQuery(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  if (isUserScopedFilesQuery(text)) return false;
  const asksRecent =
    /最近|直近|新しい|更新された|更新されて|触った|変更された|編集された/.test(
      text
    );
  const asksFiles = /ファイル|file|ドキュメント|資料/.test(text);
  return asksRecent && asksFiles;
}

/** ツール引数を人が読める1行に要約 */
export function summarizeToolArgs(
  toolName: string,
  rawArgs: string
): string {
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(rawArgs || "{}") as Record<string, unknown>;
  } catch {
    return rawArgs ? rawArgs.slice(0, 200) : "";
  }

  const parts: string[] = [];
  const path =
    args.path ?? args.parent_path ?? args.source_path ?? args.storage_path;
  if (typeof path === "string" && path) parts.push(`path: ${path}`);
  if (typeof args.query === "string" && args.query) {
    parts.push(`query: ${args.query}`);
  }
  if (typeof args.days === "number") parts.push(`days: ${args.days}`);
  if (typeof args.limit === "number") parts.push(`limit: ${args.limit}`);
  if (typeof args.username === "string" && args.username) {
    parts.push(`user: ${args.username}`);
  }
  if (typeof args.folder_name === "string") {
    parts.push(`folder: ${args.folder_name}`);
  }
  if (typeof args.prompt === "string" && args.prompt) {
    parts.push(`prompt: ${args.prompt.slice(0, 80)}`);
  }
  if (typeof args.mode === "string" && args.mode) {
    parts.push(`mode: ${args.mode}`);
  }
  if (typeof args.dest_path === "string" && args.dest_path) {
    parts.push(`dest: ${args.dest_path}`);
  }
  if (!parts.length) {
    const compact = JSON.stringify(args);
    return compact === "{}" ? toolName : compact.slice(0, 240);
  }
  return parts.join(" · ");
}
