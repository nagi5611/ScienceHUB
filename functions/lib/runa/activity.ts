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

/** 最近更新ファイルの質問かどうか（AI を迂回する高速パス用） */
export function isRecentFilesQuery(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
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
  if (typeof args.folder_name === "string") {
    parts.push(`folder: ${args.folder_name}`);
  }
  if (!parts.length) {
    const compact = JSON.stringify(args);
    return compact === "{}" ? toolName : compact.slice(0, 240);
  }
  return parts.join(" · ");
}
