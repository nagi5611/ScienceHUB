/**
 * Runa — エージェントループ（ツール呼び出し + SSE）
 */

import type { Env, SessionUser } from "../types";
import { buildVisibleRoots } from "../storage/list";
import type { StorageRootType } from "../storage/keys";
import {
  isRootIndexReady,
  queryRecentFilesAcrossRoots,
} from "../storage/file-index";
import { listRecentFilesInRoot } from "../storage/recent";
import { resolveRootForPath } from "../storage/roots";
import { runaMaxToolRounds } from "./env";
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
import {
  isRecentFilesQuery,
  RunaActivityLog,
  summarizeToolArgs,
} from "./activity";
import { formatFileItemsMarkdown } from "./storage-links";

const ALL_RUNA_TOOLS = [...RUNA_TOOL_DEFINITIONS, ...HUB_TOOL_DEFINITIONS];

const DEFAULT_MAX_TOOL_ROUNDS = 12;

export type RunaSseSend = (event: string, data: unknown) => void;

export interface RunaChatResult {
  message: string;
  files: RunaFileItem[];
}

function resolveMaxToolRounds(env: Env): number {
  const parsed = Number.parseInt(runaMaxToolRounds(env) ?? "", 10);
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
  storage_files_by_user: "ユーザーのファイルを検索しています…",
  storage_search_all: "全ストレージを検索しています…",
  storage_recent: "最近のファイルを取得しています…",
  hub_search_users: "ユーザーを検索しています…",
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
  const chunkSize = 8;
  for (let i = 0; i < text.length; i += chunkSize) {
    send("delta", { text: text.slice(i, i + chunkSize) });
  }
}

function formatRecentFilesReply(files: RunaFileItem[]): string {
  if (!files.length) {
    return "過去30日以内に更新されたファイルは見つかりませんでした。";
  }
  return `${formatFileItemsMarkdown("過去30日で更新されたファイル（全ユーザー・操作者問わず）", files)}\n\n※ 特定ユーザーのファイルは storage_files_by_user を使います。`;
}

export interface RunaChatAttachment {
  path: string;
  name: string;
}

function buildUserMessageText(
  trimmed: string,
  attachments: RunaChatAttachment[]
): string {
  if (!attachments.length) return trimmed;
  const lines = attachments.map((a) => `- \`${a.path}\`（${a.name}）`);
  return `${trimmed}\n\n[添付ファイル]\n${lines.join("\n")}`;
}

function attachmentsToFileItems(
  attachments: RunaChatAttachment[]
): RunaFileItem[] {
  return attachments.map((a) => ({
    name: a.name,
    path: a.path,
    type: "file" as const,
    sizeBytes: null,
    updatedAt: null,
  }));
}

/** 最近更新ファイルの質問は AI を使わず即答する */
async function tryRecentFilesFastPath(
  env: Env,
  db: D1Database,
  user: SessionUser,
  message: string,
  send: RunaSseSend
): Promise<RunaChatResult | null> {
  if (!isRecentFilesQuery(message)) return null;

  const activity = new RunaActivityLog(send);
  const workId = activity.start(
    "working",
    "最近更新されたファイルを検索しています…",
    "R2 ストレージを全ルート並列検索（.meta 読み込みなし）"
  );

  const files = await listRecentFilesForUser(env, db, user, 20);
  activity.finish(workId, "working", `${files.length} 件ヒット`);

  const reply = formatRecentFilesReply(files);
  const writeId = activity.start("writing", "結果を表示しています…");
  streamTextDeltas(send, reply);
  activity.finish(writeId, "writing");

  if (files.length) send("files", { items: files });
  await insertRunaMessage(db, user.id, "assistant", reply, files);
  return { message: reply, files };
}

/** ユーザーメッセージを処理してアシスタント応答を返す */
export async function runRunaChat(
  env: Env,
  db: D1Database,
  user: SessionUser,
  message: string,
  send: RunaSseSend,
  attachments: RunaChatAttachment[] = []
): Promise<RunaChatResult> {
  const trimmed = message.trim();
  if (!trimmed && !attachments.length) {
    throw new Error("メッセージを入力してください");
  }

  const userText = buildUserMessageText(trimmed, attachments);
  const userFiles = attachments.length
    ? attachmentsToFileItems(attachments)
    : null;

  await assertRunaDailyTurnLimit(db, user.id, env);
  await insertRunaMessage(db, user.id, "user", userText, userFiles);
  await incrementRunaDailyTurn(db, user.id);

  const fast = await tryRecentFilesFastPath(env, db, user, trimmed || userText, send);
  if (fast) return fast;

  const activity = new RunaActivityLog(send);
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

  let writingActivityId: string | null = null;

  for (let round = 0; round < maxRounds; round++) {
    let streamedReply = false;
    const thinkId = activity.start(
      "thinking",
      round === 0 ? "応答を考えています…" : "次の操作を考えています…",
      `ラウンド ${round + 1}/${maxRounds}`
    );

    const completion = await runaChatCompletion(env, messages, ALL_RUNA_TOOLS, {
      onTextDelta: (text) => {
        if (!writingActivityId) {
          activity.finish(thinkId, "thinking");
          writingActivityId = activity.start("writing", "回答を書いています…");
        }
        streamedReply = true;
        send("delta", { text });
      },
    });

    if (!streamedReply) {
      activity.finish(thinkId, "thinking");
    }

    if (completion.toolCalls.length > 0) {
      activity.finish(thinkId, "thinking");
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

    if (!streamedReply) {
      if (!writingActivityId) {
        writingActivityId = activity.start("writing", "回答を書いています…");
      }
      streamTextDeltas(send, reply);
    }
    if (writingActivityId) {
      activity.finish(writingActivityId, "writing");
      writingActivityId = null;
    }

    const uniqueFiles = dedupeFiles(collectedFiles);
    if (uniqueFiles.length) {
      send("files", { items: uniqueFiles });
    }

    await insertRunaMessage(db, user.id, "assistant", reply, uniqueFiles);

    return { message: reply, files: uniqueFiles };
  }

  const fallback =
    "ツール呼び出しの上限に達しました。もう少し具体的な指示をお試しください。";
  const writeId = activity.start("writing", "回答を書いています…");
  streamTextDeltas(send, fallback);
  activity.finish(writeId, "writing");
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
  const argDetail = summarizeToolArgs(name, call.function.arguments);
  send("status", { label, tool: name, detail: argDetail });
  const activity = new RunaActivityLog(send);
  const workId = activity.start("working", label, argDetail);

  const result = isHubTool(name)
    ? await executeHubTool(env, db, user, name, call.function.arguments)
    : await executeRunaTool(
        env,
        db,
        user,
        name,
        call.function.arguments
      );

  const resultDetail =
    result.files.length > 0
      ? `${result.files.length} 件 · ${result.text.slice(0, 120)}`
      : result.text.slice(0, 200);
  activity.finish(workId, "working", resultDetail);

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

  const resolvedRoots = await Promise.all(
    roots.map(async (root) => {
      const rootType: StorageRootType = root.type === "user" ? "user" : "group";
      const row = await resolveRootForPath(db, rootType, root.key);
      if (!row) return null;
      const indexed = await isRootIndexReady(db, row.id);
      return { root, rootType, rootId: row.id, indexed };
    })
  );

  const indexedRoots = resolvedRoots.filter(
    (entry): entry is NonNullable<typeof entry> => Boolean(entry?.indexed)
  );
  const fallbackRoots = resolvedRoots.filter(
    (entry): entry is NonNullable<typeof entry> => Boolean(entry && !entry.indexed)
  );

  const indexedItems =
    indexedRoots.length > 0
      ? await queryRecentFilesAcrossRoots(
          db,
          indexedRoots.map((entry) => ({
            id: entry.rootId,
            type: entry.rootType,
            key: entry.root.key,
          })),
          { updatedFrom, limit: capped }
        )
      : [];

  const fallbackItems = (
    await Promise.all(
      fallbackRoots.map(async (entry) => {
        try {
          return await listRecentFilesInRoot(
            env,
            db,
            entry.rootType,
            entry.root.key,
            { updatedFrom, limit: capped }
          );
        } catch {
          return [];
        }
      })
    )
  ).flat();

  const all: RunaFileItem[] = [
    ...indexedItems.map((item) => ({
      name: item.name,
      path: item.path,
      type: "file" as const,
      sizeBytes: item.sizeBytes,
      updatedAt: item.updatedAt,
      location: item.location,
      createdAt: item.createdAt,
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
    })),
    ...fallbackItems.map((item) => ({
      name: item.name,
      path: item.path,
      type: "file" as const,
      sizeBytes: item.sizeBytes,
      updatedAt: item.updatedAt,
      location: item.location,
    })),
  ];

  all.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  return dedupeFiles(all).slice(0, capped);
}
