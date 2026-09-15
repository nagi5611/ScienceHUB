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
  formatThinkingSummary,
  isOpenDirectoryQuery,
  isRecentFilesQuery,
  RunaActivityLog,
  summarizeToolArgs,
} from "./activity";
import { formatFileItemsMarkdown } from "./storage-links";
import { loadAttachmentImageDataUrls } from "./attachment-images";
import {
  formatFileProbeForRuna,
  probeStorageFileForRuna,
} from "./storage-io";
import {
  compactInMemoryMessagesIfNeeded,
  compactRunaDbHistoryIfNeeded,
} from "./context-summarize";
import { computeContextUsage, type ContextUsageInfo } from "./context-usage";
import {
  advanceRunaTaskPlan,
  formatTasksForSystemPrompt,
  planRunaTasks,
  shouldPlanRunaTasks,
  toTasksSsePayload,
  type RunaTaskPlan,
} from "./task-plan";

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
  storage_probe_file: "ファイル概要を確認しています…",
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
  storage_create_share_link: "共有リンクを作成しています…",
  hub_list_apps: "アプリ一覧を取得しています…",
  hub_list_announcements: "お知らせを取得しています…",
  web_search: "Web を検索しています…",
  hub_list_schedule: "予定を取得しています…",
  hub_create_schedule: "予定を作成しています…",
  pm_list_tasks: "タスクを取得しています…",
  pm_create_task: "タスクを作成しています…",
  pm_complete_task: "タスクを完了にしています…",
  print_list_reservations: "3D印刷予約を取得しています…",
  sim_list_jobs: "シミュレーション依頼を取得しています…",
  tp_list_projects: "サードパーティを取得しています…",
  web_list_sites: "公開サイトを取得しています…",
  web_create_site: "公開サイトを作成しています…",
  web_write_file: "サイトファイルを保存しています…",
  web_list_site_files: "サイト内ファイルを取得しています…",
  web_import_from_storage: "ストレージからサイトへ取り込んでいます…",
  excalidraw_list_notes: "ホワイトボードを取得しています…",
  design_list_projects: "設計プロジェクトを取得しています…",
  image_convert_storage: "画像を変換しています…",
  image_generate: "Runaが画像を生成しています…",
};

const THINKING_STATUS = "thinking..";
const WORKING_STATUS = "working..";
const WRITING_STATUS = "writing..";

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

export interface RunaChatContext {
  storagePath?: string | null;
  trashView?: boolean;
  searchActive?: boolean;
  editImagePath?: string | null;
  editIntent?: boolean;
}

export interface RunaChatAttachment {
  path: string;
  name: string;
  extractedText?: string;
  imagePaths?: string[];
  storageRef?: boolean;
  sizeBytes?: number | null;
}

interface EnrichedRunaAttachment extends RunaChatAttachment {
  probeText?: string;
}

const MAX_EXTRACTED_TEXT_CHARS = 24 * 1024;

function truncateExtractedText(text: string): string {
  if (text.length <= MAX_EXTRACTED_TEXT_CHARS) return text;
  return `${text.slice(0, MAX_EXTRACTED_TEXT_CHARS)}\n\n…（${MAX_EXTRACTED_TEXT_CHARS} 文字で切り詰め）`;
}

function buildUserMessageText(
  trimmed: string,
  attachments: EnrichedRunaAttachment[]
): string {
  const parts: string[] = [];
  if (trimmed) parts.push(trimmed);

  if (attachments.length) {
    parts.push("", "[添付ファイル]");
    for (const attachment of attachments) {
      parts.push(`- \`${attachment.path}\`（${attachment.name}）`);
      if (attachment.storageRef && attachment.probeText) {
        parts.push(
          "",
          `[参照: ${attachment.name}]`,
          attachment.probeText
        );
      } else {
        const extracted = attachment.extractedText?.trim();
        if (extracted) {
          parts.push(
            "",
            `[添付: ${attachment.name} の抽出内容]`,
            "```",
            truncateExtractedText(extracted),
            "```"
          );
        }
      }
      if (attachment.imagePaths?.length) {
        parts.push(
          "",
          `[添付: ${attachment.name} の画像]（${attachment.imagePaths.length} 枚。vision で渡されます）`
        );
        for (const imagePath of attachment.imagePaths) {
          parts.push(`- \`${imagePath}\``);
        }
      }
    }
  }

  return parts.join("\n").trim();
}

async function enrichAttachmentsForRuna(
  env: Env,
  db: D1Database,
  user: SessionUser,
  attachments: RunaChatAttachment[]
): Promise<EnrichedRunaAttachment[]> {
  const out: EnrichedRunaAttachment[] = [];
  for (const attachment of attachments) {
    if (!attachment.storageRef) {
      out.push(attachment);
      continue;
    }
    try {
      const probe = await probeStorageFileForRuna(env, db, user, attachment.path);
      out.push({
        ...attachment,
        probeText: formatFileProbeForRuna(probe),
        imagePaths:
          probe.kind === "image"
            ? [attachment.path]
            : attachment.imagePaths,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "ファイル概要の取得に失敗";
      out.push({
        ...attachment,
        probeText: `ファイル: \`${attachment.path}\`\n（概要取得失敗: ${message}）`,
      });
    }
  }
  return out;
}

function buildContextSystemHint(context?: RunaChatContext): string {
  if (!context) return "";

  const parts: string[] = [];

  const editPath = context.editImagePath?.trim();
  if (editPath) {
    parts.push(
      `\n\n## 画像編集コンテキスト\nユーザーは \`${editPath}\` の**追加編集**を意図しています。\n` +
        `- 修正指示が来たら必ず image_generate を mode=edit、source_path=\`${editPath}\` で呼ぶ\n` +
        `- draft や新規 final は使わない\n` +
        `- プロンプトは変更点1つに絞り、それ以外は維持すると明示する（例: 背景のみ夕焼けに。人物・構図・照明はそのまま）\n` +
        `- aspect_ratio は auto を使う\n` +
        `- 編集結果は別ファイルとして保存される。続けて編集する場合は**最新の結果 path** を source_path に使う\n` +
        `- 複数の変更を一度に求められたら、1回の edit にまとめるか、段階的に最新結果へ chain することをユーザーに短く案内してよい`
    );
  }

  if (context.trashView) {
    parts.push(
      `\n\n## 現在の画面\nユーザーはクラウドストレージの**ごみ箱**を見ています。`
    );
  } else if (context.searchActive) {
    parts.push(
      `\n\n## 現在の画面\nユーザーはクラウドストレージで**検索結果**を見ています。フォルダ直下の一覧とは限りません。`
    );
  } else {
    const path = context.storagePath?.trim();
    if (path) {
      parts.push(
        `\n\n## 現在の画面\nユーザーはクラウドストレージで \`${path}\` を開いています。「ここ」「このフォルダ」「表示中」はこのパスを指します。内容確認は storage_list で path=${path} を使ってください。`
      );
    }
  }

  return parts.join("");
}

/** システムプロンプト本文（ルート一覧付き） */
export async function buildRunaSystemMessageContent(
  _env: Env,
  db: D1Database,
  user: SessionUser,
  context?: RunaChatContext
): Promise<string> {
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

  return `${RUNA_SYSTEM_PROMPT}${buildContextSystemHint(context)}\n\n## このユーザーがアクセスできるルート\n${rootsHint}\n\n個人ルートは u/${user.username} です。`;
}

function attachVisionToLastUserMessage(
  messages: ChatMessage[],
  imageDataUrls: string[]
): void {
  if (!imageDataUrls.length) return;
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === "user") {
      messages[index] = { ...messages[index], images: imageDataUrls };
      return;
    }
  }
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
    WORKING_STATUS,
    "最近更新されたファイルを検索しています…\nR2 ストレージを全ルート並列検索（.meta 読み込みなし）"
  );

  const files = await listRecentFilesForUser(env, db, user, 20);
  activity.finish(workId, "working", `${files.length} 件ヒット`);

  const reply = formatRecentFilesReply(files);
  const writeId = activity.start("writing", WRITING_STATUS, "結果を表示しています…");
  streamTextDeltas(send, reply);
  activity.finish(writeId, "writing");

  if (files.length) send("files", { items: files });
  await insertRunaMessage(db, user.id, "assistant", reply, files);
  return { message: reply, files };
}

/** クラウドストレージで開いているフォルダの内容質問を即答 */
async function tryOpenDirectoryFastPath(
  env: Env,
  db: D1Database,
  user: SessionUser,
  message: string,
  context: RunaChatContext | undefined,
  send: RunaSseSend
): Promise<RunaChatResult | null> {
  const path = context?.storagePath?.trim();
  if (!path || context?.trashView || context?.searchActive) return null;
  if (!isOpenDirectoryQuery(message)) return null;

  const activity = new RunaActivityLog(send);
  const workId = activity.start(
    "working",
    WORKING_STATUS,
    `フォルダの内容を取得しています…\npath: ${path}`
  );

  const result = await executeRunaTool(
    env,
    db,
    user,
    "storage_list",
    JSON.stringify({ path, limit: 50 })
  );
  activity.finish(workId, "working", `${result.files.length} 件`);

  const reply =
    result.files.length > 0
      ? formatFileItemsMarkdown(`**${path}** の内容`, result.files)
      : `\`${path}\` にはファイルがありません（空のフォルダです）。`;

  const writeId = activity.start("writing", WRITING_STATUS, "結果を表示しています…");
  streamTextDeltas(send, reply);
  activity.finish(writeId, "writing");

  if (result.files.length) send("files", { items: result.files });
  await insertRunaMessage(db, user.id, "assistant", reply, result.files);
  return { message: reply, files: result.files };
}

/** ユーザーメッセージを処理してアシスタント応答を返す */
export async function runRunaChat(
  env: Env,
  db: D1Database,
  user: SessionUser,
  message: string,
  send: RunaSseSend,
  attachments: RunaChatAttachment[] = [],
  context?: RunaChatContext
): Promise<RunaChatResult> {
  const trimmed = message.trim();
  if (!trimmed && !attachments.length) {
    throw new Error("メッセージを入力してください");
  }

  const enrichedAttachments = await enrichAttachmentsForRuna(
    env,
    db,
    user,
    attachments
  );
  const userText = buildUserMessageText(trimmed, enrichedAttachments);
  const userFiles = attachments.length
    ? attachmentsToFileItems(attachments)
    : null;

  await assertRunaDailyTurnLimit(db, user.id, env);
  await insertRunaMessage(db, user.id, "user", userText, userFiles);
  await incrementRunaDailyTurn(db, user.id);

  const fastRecent = await tryRecentFilesFastPath(
    env,
    db,
    user,
    trimmed || userText,
    send
  );
  if (fastRecent) return fastRecent;

  const fastDir = await tryOpenDirectoryFastPath(
    env,
    db,
    user,
    trimmed || userText,
    context,
    send
  );
  if (fastDir) return fastDir;

  const activity = new RunaActivityLog(send);
  const history = await buildRunaChatHistory(db, user.id, 20);
  const systemContent = await buildRunaSystemMessageContent(
    env,
    db,
    user,
    context
  );

  let taskPlan: RunaTaskPlan | null = null;
  if (shouldPlanRunaTasks(trimmed || userText, attachments, context)) {
    const planId = activity.start(
      "thinking",
      THINKING_STATUS,
      "タスクを整理しています…"
    );
    try {
      taskPlan = await planRunaTasks(env, trimmed || userText, attachments);
      send("tasks", toTasksSsePayload(taskPlan));
      activity.finish(
        planId,
        "thinking",
        taskPlan.tasks.map((t) => t.title).join(" → ")
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "タスク計画に失敗";
      activity.finish(planId, "thinking", message);
      taskPlan = null;
    }
  }

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: taskPlan
        ? `${systemContent}${formatTasksForSystemPrompt(taskPlan)}`
        : systemContent,
    },
    ...history.map((h) => ({
      role: h.role,
      content: h.content,
    })),
  ];

  const imageDataUrls = await loadAttachmentImageDataUrls(
    env,
    db,
    user,
    enrichedAttachments
  );
  attachVisionToLastUserMessage(messages, imageDataUrls);

  let usage = computeContextUsage(messages, ALL_RUNA_TOOLS, env);
  send("context_usage", usage);
  if (usage.shouldSummarize) {
    const dbCompacted = await compactRunaDbHistoryIfNeeded(
      env,
      db,
      user.id,
      send
    );
    if (dbCompacted) {
      const refreshedHistory = await buildRunaChatHistory(db, user.id, 20);
      messages.splice(
        1,
        messages.length - 1,
        ...refreshedHistory.map((h) => ({
          role: h.role,
          content: h.content,
        }))
      );
      attachVisionToLastUserMessage(messages, imageDataUrls);
      usage = computeContextUsage(messages, ALL_RUNA_TOOLS, env);
      send("context_usage", usage);
    } else {
      await compactInMemoryMessagesIfNeeded(
        env,
        messages,
        ALL_RUNA_TOOLS,
        send
      );
      usage = computeContextUsage(messages, ALL_RUNA_TOOLS, env);
      send("context_usage", usage);
    }
  }

  const collectedFiles: RunaFileItem[] = [];
  const maxRounds = resolveMaxToolRounds(env);

  let writingActivityId: string | null = null;
  /** ツール完了直後に先行開始した thinking（無音ギャップ防止） */
  let prefetchedThinkId: string | null = null;
  for (let round = 0; round < maxRounds; round++) {
    let streamedReply = false;
    let thinkId: string | null = prefetchedThinkId;
    prefetchedThinkId = null;

    if (!thinkId) {
      thinkId = activity.start(
        "thinking",
        THINKING_STATUS,
        `ラウンド ${round + 1}/${maxRounds}`
      );
    } else {
      send("status", { label: THINKING_STATUS, phase: "thinking" });
    }
    let reasoningBuffer = "";

    const finishThinking = (completion: Awaited<
      ReturnType<typeof runaChatCompletion>
    >) => {
      if (!thinkId) return;
      const summary = formatThinkingSummary({
        round: round + 1,
        maxRounds,
        reasoning: reasoningBuffer || completion.reasoning,
        content: completion.content,
        toolPlans: completion.toolCalls.map((call) => ({
          name: call.function.name,
          label: TOOL_STATUS_LABELS[call.function.name] ?? call.function.name,
          argsSummary: summarizeToolArgs(
            call.function.name,
            call.function.arguments
          ),
        })),
      });
      activity.finish(thinkId, "thinking", summary);
      thinkId = null;
    };

    const completion = await runaChatCompletion(env, messages, ALL_RUNA_TOOLS, {
      onReasoningDelta: (text) => {
        reasoningBuffer += text;
        if (thinkId) {
          activity.update(thinkId, "thinking", reasoningBuffer);
        }
      },
      onTextDelta: (text) => {
        if (!writingActivityId) {
          if (thinkId) {
            activity.finish(
              thinkId,
              "thinking",
              formatThinkingSummary({
                round: round + 1,
                maxRounds,
                reasoning: reasoningBuffer || null,
                content: "（回答をストリーミング中）",
                toolPlans: [],
              })
            );
            thinkId = null;
          }
          writingActivityId = activity.start(
            "writing",
            WRITING_STATUS,
            "回答を書いています…"
          );
        }
        streamedReply = true;
        send("delta", { text });
      },
    });

    if (!streamedReply && thinkId) {
      finishThinking(completion);
    }

    if (completion.toolCalls.length > 0) {
      if (thinkId) finishThinking(completion);
      messages.push({
        role: "assistant",
        content: completion.content,
        tool_calls: completion.toolCalls,
      });

      for (const call of completion.toolCalls) {
        await handleToolCall(
          env,
          db,
          user,
          call,
          messages,
          collectedFiles,
          send,
          activity
        );
      }

      if (taskPlan) {
        taskPlan = advanceRunaTaskPlan(taskPlan);
        send("tasks", toTasksSsePayload(taskPlan));
        const systemMessage = messages[0];
        if (systemMessage?.role === "system") {
          systemMessage.content = `${systemContent}${formatTasksForSystemPrompt(taskPlan)}`;
        }
      }

      // 検索・ツール完了直後に次フェーズを表示（AWS AGENTPERF02-BP04 / 72Tech 推奨）
      if (round + 1 < maxRounds) {
        prefetchedThinkId = activity.start(
          "thinking",
          THINKING_STATUS,
          `ラウンド ${round + 2}/${maxRounds}`
        );
        send("status", { label: THINKING_STATUS, phase: "thinking" });
      }

      usage = computeContextUsage(messages, ALL_RUNA_TOOLS, env);
      send("context_usage", usage);
      if (usage.shouldSummarize) {
        await compactInMemoryMessagesIfNeeded(
          env,
          messages,
          ALL_RUNA_TOOLS,
          send
        );
        usage = computeContextUsage(messages, ALL_RUNA_TOOLS, env);
        send("context_usage", usage);
      }
      continue;
    }

    const reply =
      completion.content?.trim() ||
      "申し訳ありません。応答を生成できませんでした。";

    if (taskPlan) {
      taskPlan = advanceRunaTaskPlan(taskPlan, { finalize: true });
      send("tasks", toTasksSsePayload(taskPlan));
    }

    if (!streamedReply) {
      if (!writingActivityId) {
        writingActivityId = activity.start(
          "writing",
          WRITING_STATUS,
          "回答を書いています…"
        );
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
  const writeId = activity.start(
    "writing",
    WRITING_STATUS,
    "回答を書いています…"
  );
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
  send: RunaSseSend,
  activity: RunaActivityLog
): Promise<void> {
  const name = call.function.name;
  const actionLabel = TOOL_STATUS_LABELS[name] ?? `${name} を実行中…`;
  const argDetail = summarizeToolArgs(name, call.function.arguments);
  const detail = argDetail ? `${actionLabel}\n${argDetail}` : actionLabel;
  send("status", {
    label: WORKING_STATUS,
    tool: name,
    detail: actionLabel,
    phase: "working",
  });
  const workId = activity.start("working", WORKING_STATUS, detail);

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

/** 現在の推定コンテキスト使用量 */
export async function estimateRunaContextUsage(
  env: Env,
  db: D1Database,
  user: SessionUser,
  context?: RunaChatContext
): Promise<ContextUsageInfo> {
  const systemContent = await buildRunaSystemMessageContent(
    env,
    db,
    user,
    context
  );
  const history = await buildRunaChatHistory(db, user.id, 20);
  const messages: ChatMessage[] = [
    { role: "system", content: systemContent },
    ...history.map((row) => ({
      role: row.role,
      content: row.content,
    })),
  ];
  return computeContextUsage(messages, ALL_RUNA_TOOLS, env);
}
