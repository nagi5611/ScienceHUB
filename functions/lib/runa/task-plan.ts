/**
 * Runa — 複雑依頼向け TODO 計画（推論前にタスク分解）
 */

import type { Env } from "../types";
import { runaChatCompletion, type ChatMessage } from "./openai";

export interface RunaTaskPlanAttachment {
  name: string;
}

export interface RunaTaskPlanContext {
  editIntent?: boolean;
  editImagePath?: string | null;
}

export type RunaTaskStatus = "pending" | "done" | "failed";

export interface RunaTask {
  id: string;
  title: string;
  status: RunaTaskStatus;
}

export interface RunaTaskPlan {
  tasks: RunaTask[];
  current: number;
}

export interface RunaTasksSsePayload {
  tasks: Array<{ id: string; title: string; status: string }>;
  current: number;
}

const MIN_TASKS = 3;
const MAX_TASKS = 6;

const PLAN_SYSTEM_PROMPT = `あなたは Runa（ファイル・HUB 操作アシスタント）のタスク分解担当です。
ユーザーの依頼を実行可能な手順に分割し、JSON だけを返してください。

ルール:
- タスクは ${MIN_TASKS}〜${MAX_TASKS} 個
- 各タスクは 1 つの明確な成果物または確認ステップ
- ストレージ操作・Web 検索・HUB 連携・画像生成など Runa のツールで実行可能な粒度
- タイトルは日本語・短く（40 文字以内）
- id は英小文字とハイフン（例: search-files）
- 出力は JSON オブジェクトのみ（説明文・コードブロック禁止）

形式:
{"tasks":[{"id":"...","title":"..."}]}`;

/** 大きめの依頼かどうか（TODO 計画を挟むか） */
export function shouldPlanRunaTasks(
  message: string,
  attachments: RunaTaskPlanAttachment[] = [],
  context?: RunaTaskPlanContext
): boolean {
  if (context?.editIntent || context?.editImagePath?.trim()) return false;

  const trimmed = message.trim();
  if (!trimmed && attachments.length === 0) return false;

  if (trimmed.length < 40 && attachments.length === 0) return false;

  if (trimmed.length >= 100) return true;
  if (attachments.length >= 2) return true;

  const complexPatterns = [
    /(?:まず|次に|その後|最後に|あわせて|および|さらに)/,
    /(?:手順|ステップ|todo|タスク)/i,
    /^\s*\d+[\.\)、]/m,
    /(?:・|[-*])\s+\S+/m,
    /(?:調べ|検索|作成|編集|削除|移動|まとめ|比較|分析|確認|取得|一覧).*(?:調べ|検索|作成|編集|削除|移動|まとめ|比較|分析|確認|取得|一覧)/,
    /(?:して|ください).*(?:して|ください)/,
  ];

  if (complexPatterns.some((pattern) => pattern.test(trimmed))) return true;

  const sentences = trimmed
    .split(/[。！？\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4);
  if (sentences.length >= 3) return true;

  return false;
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    /* continue */
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim()) as Record<string, unknown>;
    } catch {
      /* continue */
    }
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  return null;
}

function normalizeTaskId(value: string, index: number): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `task-${index + 1}`;
}

function normalizeTasks(raw: unknown): RunaTask[] {
  if (!Array.isArray(raw)) return [];

  const tasks: RunaTask[] = [];
  for (let i = 0; i < raw.length && tasks.length < MAX_TASKS; i++) {
    const item = raw[i];
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const title = typeof record.title === "string" ? record.title.trim() : "";
    if (!title) continue;
    const id =
      typeof record.id === "string"
        ? normalizeTaskId(record.id, i)
        : `task-${i + 1}`;
    tasks.push({ id, title: title.slice(0, 80), status: "pending" });
  }

  return tasks;
}

function buildFallbackTasks(message: string): RunaTask[] {
  const trimmed = message.trim();
  const preview = trimmed.slice(0, 36).replace(/\s+/g, " ");
  return [
    { id: "understand", title: "依頼内容を整理する", status: "pending" },
    {
      id: "execute",
      title: preview ? `「${preview}…」を実行する` : "必要な操作を実行する",
      status: "pending",
    },
    { id: "reply", title: "結果をまとめて回答する", status: "pending" },
  ];
}

/** LLM で TODO 一覧を生成 */
export async function planRunaTasks(
  env: Env,
  message: string,
  attachments: RunaTaskPlanAttachment[] = []
): Promise<RunaTaskPlan> {
  const attachmentHint = attachments.length
    ? `\n添付ファイル: ${attachments.map((a) => a.name).join(", ")}`
    : "";

  const messages: ChatMessage[] = [
    { role: "system", content: PLAN_SYSTEM_PROMPT },
    {
      role: "user",
      content: `以下の依頼をタスクに分解してください:\n\n${message.trim()}${attachmentHint}`,
    },
  ];

  let tasks: RunaTask[] = [];

  try {
    const completion = await runaChatCompletion(env, messages, []);
    const parsed = completion.content
      ? extractJsonObject(completion.content)
      : null;
    tasks = normalizeTasks(parsed?.tasks);
  } catch {
    tasks = [];
  }

  if (tasks.length < MIN_TASKS) {
    tasks = buildFallbackTasks(message);
  }

  return { tasks, current: 0 };
}

export function toTasksSsePayload(plan: RunaTaskPlan): RunaTasksSsePayload {
  return {
    tasks: plan.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
    })),
    current: plan.current,
  };
}

/** システムプロンプトに注入する TODO 文言 */
export function formatTasksForSystemPrompt(plan: RunaTaskPlan): string {
  const lines = plan.tasks.map((task, index) => {
    const marker =
      task.status === "done"
        ? "[完了]"
        : index === plan.current
          ? "[進行中]"
          : "[未着手]";
    return `${index + 1}. ${marker} ${task.title} (id: ${task.id})`;
  });

  return `\n\n## 今回の作業 TODO\nユーザー依頼は複数ステップです。以下の順に進め、完了したステップは次へ進んでください。\n${lines.join("\n")}\n\n- 1 ステップずつ確実に。不要なツール呼び出しは避ける\n- 全 TODO 完了後にユーザーへまとめて回答する`;
}

/** ツールラウンド完了後に current を進める */
export function advanceRunaTaskPlan(
  plan: RunaTaskPlan,
  options?: { failed?: boolean; finalize?: boolean }
): RunaTaskPlan {
  const next: RunaTaskPlan = {
    tasks: plan.tasks.map((task) => ({ ...task })),
    current: plan.current,
  };

  if (options?.finalize) {
    for (const task of next.tasks) {
      if (task.status === "pending") task.status = "done";
    }
    next.current = next.tasks.length;
    return next;
  }

  const index = next.current;
  if (index < 0 || index >= next.tasks.length) return next;

  const current = next.tasks[index];
  if (current.status === "pending") {
    current.status = options?.failed ? "failed" : "done";
  }

  const nextIndex = index + 1;
  next.current = Math.min(nextIndex, next.tasks.length);
  return next;
}
