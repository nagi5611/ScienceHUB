/**
 * Runa — エージェントループ（ツール呼び出し + SSE）
 */

import type { Env, SessionUser } from "../types";
import { buildVisibleRoots } from "../storage/list";
import { searchStorageFiles } from "../storage/search";
import { RUNA_SYSTEM_PROMPT } from "./prompts";
import {
  runaChatCompletion,
  type ChatMessage,
  type ToolCall,
} from "./openai";
import {
  executeRunaTool,
  RUNA_TOOL_DEFINITIONS,
  type RunaFileItem,
} from "./tools";
import { executeHubTool, HUB_TOOL_DEFINITIONS, isHubTool } from "./hub-tools";
import {
  assertRunaDailyTurnLimit,
  buildRunaChatHistory,
  incrementRunaDailyTurn,
  insertRunaMessage,
} from "./messages";

const ALL_RUNA_TOOLS = [...RUNA_TOOL_DEFINITIONS, ...HUB_TOOL_DEFINITIONS];

const DEFAULT_MAX_TOOL_ROUNDS = 12;

export type RunaSseSend = (event: string, data: unknown) => void;

export interface RunaChatResult {
  message: string;
  files: RunaFileItem[];
}

function resolveMaxToolRounds(env: Env): number {
  const parsed = Number.parseInt(env.RUNA_MAX_TOOL_ROUNDS ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_MAX_TOOL_ROUNDS;
  return Math.min(16, parsed);
}

const TOOL_STATUS_LABELS: Record<string, string> = {
  storage_list_roots: "ストレージルートを取得しています…",
  storage_list: "フォルダを一覧しています…",
  storage_stat: "ファイル情報を取得しています…",
  storage_read_file: "ファイルを読み込んでいます…",
  storage_write_file: "ファイルを書き込んでいます…",
  storage_search: "ファイルを検索しています…",
  storage_search_all: "全ストレージを検索しています…",
  storage_recent: "最近のファイルを取得しています…",
  storage_mkdir: "フォルダを作成しています…",
  storage_move: "ファイルを移動しています…",
  storage_rename: "名前を変更しています…",
  storage_delete: "ごみ箱へ移動しています…",
  hub_list_apps: "アプリ一覧を取得しています…",
  hub_list_announcements: "お知らせを取得しています…",
  hub_list_schedule: "予定を取得しています…",
  hub_create_schedule: "予定を作成しています…",
  pm_list_tasks: "タスクを取得しています…",
  pm_create_task: "タスクを作成しています…",
  pm_complete_task: "タスクを完了にしています…",
  print_list_reservations: "3D印刷予約を取得しています…",
  sim_list_jobs: "シミュレーション依頼を取得しています…",
  tp_list_projects: "サードパーティを取得しています…",
  web_list_sites: "公開サイトを取得しています…",
  excalidraw_list_notes: "ホワイトボードを取得しています…",
  design_list_projects: "設計プロジェクトを取得しています…",
  image_convert_storage: "画像を変換しています…",
};

function streamTextDeltas(send: RunaSseSend, text: string): void {
  const chunkSize = 24;
  for (let i = 0; i < text.length; i += chunkSize) {
    send("delta", { text: text.slice(i, i + chunkSize) });
  }
}

/** ユーザーメッセージを処理してアシスタント応答を返す */
export async function runRunaChat(
  env: Env,
  db: D1Database,
  user: SessionUser,
  message: string,
  send: RunaSseSend
): Promise<RunaChatResult> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error("メッセージを入力してください");
  }

  await assertRunaDailyTurnLimit(db, user.id, env);
  await insertRunaMessage(db, user.id, "user", trimmed);
  await incrementRunaDailyTurn(db, user.id);

  const history = await buildRunaChatHistory(db, user.id, 20);
  let rootsHint = "（ストレージ未初期化の可能性があります）";
  try {
    const roots = await buildVisibleRoots(
      db,
      user.id,
      user.username,
      user.is_admin
    );
    rootsHint = roots
      .map((r) => `${r.path} (${r.type}: ${r.label})`)
      .join(", ");
  } catch {
    /* skip */
  }

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `${RUNA_SYSTEM_PROMPT}\n\n## このユーザーがアクセスできるルート\n${rootsHint}\n\n個人ルートは u/${user.username} です。`,
    },
    ...history.map((h) => ({
      role: h.role,
      content: h.content,
    })),
  ];

  const collectedFiles: RunaFileItem[] = [];
  const maxRounds = resolveMaxToolRounds(env);

  for (let round = 0; round < maxRounds; round++) {
    const completion = await runaChatCompletion(
      env,
      messages,
      ALL_RUNA_TOOLS
    );

    if (completion.toolCalls.length > 0) {
      messages.push({
        role: "assistant",
        content: completion.content,
        tool_calls: completion.toolCalls,
      });

      for (const call of completion.toolCalls) {
        await handleToolCall(env, db, user, call, messages, collectedFiles, send);
      }
      continue;
    }

    const reply =
      completion.content?.trim() ||
      "申し訳ありません。応答を生成できませんでした。";

    streamTextDeltas(send, reply);

    const uniqueFiles = dedupeFiles(collectedFiles);
    if (uniqueFiles.length) {
      send("files", { items: uniqueFiles });
    }

    await insertRunaMessage(db, user.id, "assistant", reply, uniqueFiles);

    return { message: reply, files: uniqueFiles };
  }

  const fallback =
    "ツール呼び出しの上限に達しました。もう少し具体的な指示をお試しください。";
  streamTextDeltas(send, fallback);
  await insertRunaMessage(db, user.id, "assistant", fallback, collectedFiles);
  return { message: fallback, files: collectedFiles };
}

async function handleToolCall(
  env: Env,
  db: D1Database,
  user: SessionUser,
  call: ToolCall,
  messages: ChatMessage[],
  collectedFiles: RunaFileItem[],
  send: RunaSseSend
): Promise<void> {
  const name = call.function.name;
  const label = TOOL_STATUS_LABELS[name] ?? `${name} を実行中…`;
  send("status", { label, tool: name });

  const result = isHubTool(name)
    ? await executeHubTool(env, db, user, name, call.function.arguments)
    : await executeRunaTool(
        env,
        db,
        user,
        name,
        call.function.arguments
      );

  for (const file of result.files) {
    collectedFiles.push(file);
  }

  if (result.files.length) {
    send("files", { items: result.files });
  }

  messages.push({
    role: "tool",
    tool_call_id: call.id,
    content: result.text,
  });
}

function dedupeFiles(files: RunaFileItem[]): RunaFileItem[] {
  const seen = new Set<string>();
  const out: RunaFileItem[] = [];
  for (const f of files) {
    if (seen.has(f.path)) continue;
    seen.add(f.path);
    out.push(f);
  }
  return out;
}

/** 全ルートから最近更新されたファイルを集約 */
export async function listRecentFilesForUser(
  env: Env,
  db: D1Database,
  user: SessionUser,
  limit = 20
): Promise<RunaFileItem[]> {
  const roots = await buildVisibleRoots(
    db,
    user.id,
    user.username,
    user.is_admin
  );
  const capped = Math.min(50, Math.max(1, limit));
  const updatedFrom = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const all: RunaFileItem[] = [];

  for (const root of roots) {
    const rootType = root.type === "user" ? "user" : "group";
    try {
      const result = await searchStorageFiles(
        env,
        rootType,
        root.key,
        "",
        {
          query: "",
          scope: "root",
          updatedFrom,
          limit: capped,
          sortField: "updatedAt",
          sortOrder: "desc",
        }
      );
      for (const item of result.items) {
        all.push({
          name: item.name,
          path: item.path,
          type: "file",
          sizeBytes: item.sizeBytes,
          updatedAt: item.updatedAt,
          location: item.location,
        });
      }
    } catch {
      /* ルート単位の失敗はスキップ */
    }
  }

  all.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  return dedupeFiles(all).slice(0, capped);
}
