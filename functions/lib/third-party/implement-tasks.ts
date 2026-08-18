/**
 * サードパーティ — 段階実装タスク（implementation-tasks.json）
 */

import type { Env } from "../types";
import {
  geminiGenerateJson,
  geminiGenerateJsonAllowTruncated,
  geminiGenerateText,
} from "../gemini/generate";
import { createTpImplementDocsCache } from "../gemini/context-cache";
import { ARTIFACT_TASKS, getArtifact, putArtifact } from "./artifacts";
import {
  FLASH_IMPLEMENT_TASK_EDIT_SYSTEM,
  FLASH_MAINTAIN_EDIT_SYSTEM,
  FLASH_MAINTAIN_PATCH_SYSTEM,
} from "./prompts";
import {
  IMPLEMENTATION_TASKS_PLAN_SCHEMA,
  IMPLEMENT_EDIT_PLAN_SCHEMA,
  MAINTAIN_EDIT_PLAN_SCHEMA,
  type ImplementationTask,
  type ImplementationTasksFile,
  type ImplementationTasksPlanResult,
  type MaintainEditPlanResult,
} from "./schemas";
import {
  applyWorkspaceEdits,
  formatNumberedLines,
  normalizeWorkspaceEdits,
  summarizeEdits,
} from "./workspace-edits";
import { EMPTY_PLACEHOLDER_HTML } from "./stub-chat";
import {
  describeImplementEditScopes,
  extractNumberedHtmlForTask,
  IMPLEMENT_EDIT_TARGET_PATH,
  isFullHtmlEditTarget,
  MAX_EDIT_PLAN_TOKENS_DEFAULT,
  MAX_EDIT_PLAN_TOKENS_FULL_HTML,
  MAX_TASK_EDIT_RETRIES_DEFAULT,
  resolveMaxEditPlanTokens,
  resolveMaxTaskEditRetries,
  validateImplementEdits,
} from "./implement-edit-scope";
import { salvageEditsFromTruncatedJson } from "./implement-edit-recovery";

import {
  tpAgentGeminiOptions,
  resolveTpImplementCacheModel,
  resolveEditPlanAgentId,
} from "./agent-registry";
import {
  withTpUsageRecording,
  type TpGeminiUsageContext,
} from "./gemini-usage";

const EMPTY_SKELETON = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>App</title>
</head>
<body>
</body>
</html>`;

const MAX_TASKS = 5;

function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 骨格タスク用の決定的な HTML（LLM 不要） */
export function buildProjectSkeleton(title: string): string {
  const safeTitle = escapeHtmlText(title.trim() || "App");
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    :root { --accent: #f38020; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #fafafa; color: #1c1917; }
    main { max-width: 40rem; margin: 0 auto; padding: 1rem; }
  </style>
</head>
<body>
  <main id="app"></main>
  <script></script>
</body>
</html>`;
}

export function isBareOrDefaultSkeleton(html: string): boolean {
  const t = html.trim();
  if (!t) return true;
  if (t === EMPTY_SKELETON.trim()) return true;
  if (isScienceHubPlaceholderHtml(t)) return true;
  return (
    t.length < 500 &&
    t.includes("<body") &&
    !t.includes('id="app"') &&
    !t.includes("<main")
  );
}

/** ScienceHUB 初期プレースホルダー（style/script なし） */
export function isScienceHubPlaceholderHtml(html: string): boolean {
  const a = html.trim();
  if (a === EMPTY_PLACEHOLDER_HTML.trim()) return true;
  return (
    a.includes("左のチャットで") &&
    a.includes("ランディングページ") &&
    !/<style\b/i.test(a) &&
    !/<script\b/i.test(a)
  );
}

/** 実装開始前: プレースホルダーを骨格化し、既存マークアップは main に退避 */
export function normalizeImplementBaseHtml(
  html: string,
  title: string
): string {
  const t = html.trim();
  if (!t || isScienceHubPlaceholderHtml(t)) {
    return buildProjectSkeleton(title);
  }
  if (!/<style\b/i.test(t) || !/<script\b/i.test(t)) {
    const skeleton = buildProjectSkeleton(title);
    const bodyMatch = t.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let inner = bodyMatch?.[1]?.trim() ?? "";
    inner = inner.replace(
      /<p[^>]*>[\s\S]*?左のチャットで[\s\S]*?<\/p>/i,
      ""
    ).trim();
    if (!inner) {
      return skeleton;
    }
    return skeleton.replace(
      /<main id="app"><\/main>/i,
      `<main id="app">\n${inner}\n</main>`
    );
  }
  return stripScienceHubPlaceholderParagraph(t);
}

export function stripScienceHubPlaceholderParagraph(html: string): string {
  return html.replace(
    /<p[^>]*>[\s\S]*?左のチャットで[\s\S]*?<\/p>\s*/i,
    ""
  );
}

/** タスク名・target から骨格タスクか判定 */
export function isSkeletonLikeTask(task: ImplementationTask): boolean {
  if (task.target === "skeleton") return true;
  return /骨格|スケルトン|基本構造|skeleton|DOCTYPE/i.test(task.title);
}

export function isCompleteIndexHtml(html: string): boolean {
  const t = html.trim();
  return (
    (t.includes("<!DOCTYPE") || t.includes("<html")) && t.includes("</html>")
  );
}

/** R2 からタスクファイルを読む */
export async function loadImplementationTasks(
  bucket: R2Bucket,
  dirName: string
): Promise<ImplementationTasksFile | null> {
  const raw = await getArtifact(bucket, dirName, ARTIFACT_TASKS);
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as ImplementationTasksFile;
    if (parsed.version !== 1 || !Array.isArray(parsed.tasks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** タスクファイルを保存 */
export async function saveImplementationTasks(
  bucket: R2Bucket,
  dirName: string,
  file: ImplementationTasksFile
): Promise<void> {
  await putArtifact(
    bucket,
    dirName,
    ARTIFACT_TASKS,
    JSON.stringify(file, null, 2),
    "application/json; charset=utf-8"
  );
}

/** 実装計画からタスク一覧を生成 */
export async function planImplementationTasks(
  env: Env,
  requirements: string,
  plan: string,
  title: string,
  options?: {
    background?: boolean;
    db?: D1Database | null;
    usage?: TpGeminiUsageContext;
  }
): Promise<ImplementationTasksFile> {
  const prompt = `アプリ名: ${title}

--- 要件定義書 ---
${requirements}

--- 実装計画書 ---
${plan}

実装順序に沿い、5〜${MAX_TASKS} 個のタスクに分割してください。
例: skeleton → レイアウト markup → UI → styles → script → polish`;

  const result = await geminiGenerateJson<ImplementationTasksPlanResult>(
    env,
    withTpUsageRecording(options?.db, options?.usage ?? {}, {
      systemInstruction: `ScienceHUB サードパーティの実装タスク分解担当。
各タスクは index.html への局所 edits で完了できる粒度にする。
target は skeleton | markup | styles | script | polish のいずれか。
id は英小文字とハイフン（例: task-skeleton）。depends_on は先行タスク id の配列。`,
      prompt,
      maxOutputTokens: 4096,
      ...tpAgentGeminiOptions(env, "task_planner", {
        background: options?.background,
      }),
      responseSchema: IMPLEMENTATION_TASKS_PLAN_SCHEMA as unknown as Record<
        string,
        unknown
      >,
    })
  );

  const tasks: ImplementationTask[] = (result.tasks ?? [])
    .slice(0, MAX_TASKS)
    .map((t) => ({
      id: t.id,
      title: t.title,
      depends_on: t.depends_on ?? [],
      target: normalizeTaskTarget(t.target),
      acceptance_hint: t.acceptance_hint,
      status: "pending" as const,
    }));

  if (!tasks.length) {
    throw new Error("実装タスクを生成できませんでした");
  }

  if (tasks[0].target !== "skeleton") {
    tasks[0].target = "skeleton";
  }

  return {
    version: 1,
    current_task_index: 0,
    tasks,
  };
}

function normalizeTaskTarget(value: string): ImplementationTask["target"] {
  const allowed: ImplementationTask["target"][] = [
    "skeleton",
    "markup",
    "styles",
    "script",
    "polish",
  ];
  return allowed.includes(value as ImplementationTask["target"])
    ? (value as ImplementationTask["target"])
    : "markup";
}

export interface EditPlanGeminiContext {
  /** createTpImplementDocsCache の戻り値 */
  docsCacheName?: string;
}

/** 実装フェーズ開始時: 要件・計画の明示キャッシュ（Paid） */
export async function prepareImplementGeminiContext(
  env: Env,
  requirements: string,
  plan: string
): Promise<EditPlanGeminiContext> {
  const model = resolveTpImplementCacheModel(env);
  const name = await createTpImplementDocsCache(
    env,
    model,
    FLASH_IMPLEMENT_TASK_EDIT_SYSTEM,
    requirements,
    plan
  );
  return { docsCacheName: name ?? undefined };
}

/** 行編集プランを Gemini で生成（メンテ・実装タスク共通） */
export async function generateEditPlan(
  env: Env,
  systemInstruction: string,
  prompt: string,
  options?: {
    attempt?: number;
    docsCacheName?: string;
    planKind?: "maintain" | "implement";
    taskTarget?: ImplementationTask["target"];
    background?: boolean;
    maxAttempts?: number;
    db?: D1Database | null;
    usage?: TpGeminiUsageContext;
  }
): Promise<MaintainEditPlanResult> {
  const attempt = options?.attempt ?? 0;
  const maxAttempts =
    options?.maxAttempts ??
    (options?.taskTarget
      ? resolveMaxTaskEditRetries(options.taskTarget)
      : MAX_TASK_EDIT_RETRIES_DEFAULT);
  const agentId = resolveEditPlanAgentId(attempt, maxAttempts);
  const schema =
    options?.planKind === "implement"
      ? IMPLEMENT_EDIT_PLAN_SCHEMA
      : MAINTAIN_EDIT_PLAN_SCHEMA;
  const maxOutputTokens =
    options?.planKind === "implement" && options?.taskTarget
      ? resolveMaxEditPlanTokens(options.taskTarget)
      : MAX_EDIT_PLAN_TOKENS_DEFAULT;

  if (options?.planKind === "implement") {
    return await fetchImplementEditPlan(
      env,
      systemInstruction,
      prompt,
      {
        attempt,
        docsCacheName: options?.docsCacheName,
        taskTarget: options?.taskTarget ?? "markup",
        background: options?.background,
        maxAttempts,
        db: options?.db,
        usage: options?.usage,
      }
    );
  }

  return await geminiGenerateJson<MaintainEditPlanResult>(
    env,
    withTpUsageRecording(options?.db, options?.usage ?? {}, {
      systemInstruction: options?.docsCacheName
        ? undefined
        : systemInstruction,
      prompt,
      maxOutputTokens,
      cachedContent: options?.docsCacheName,
      ...tpAgentGeminiOptions(env, agentId, {
        background: options?.background,
      }),
      responseSchema: schema as unknown as Record<string, unknown>,
    })
  );
}

interface ImplementEditPlanFetchOptions {
  attempt?: number;
  docsCacheName?: string;
  taskTarget: ImplementationTask["target"];
  background?: boolean;
  maxAttempts?: number;
  db?: D1Database | null;
  usage?: TpGeminiUsageContext;
}

/** 実装タスク用: salvage → 続き → patch フォールバック前のプラン取得 */
async function fetchImplementEditPlan(
  env: Env,
  systemInstruction: string,
  prompt: string,
  options: ImplementEditPlanFetchOptions
): Promise<MaintainEditPlanResult> {
  const attempt = options.attempt ?? 0;
  const maxAttempts =
    options.maxAttempts ?? resolveMaxTaskEditRetries(options.taskTarget);
  const agentId = resolveEditPlanAgentId(attempt, maxAttempts);
  const maxOutputTokens = resolveMaxEditPlanTokens(options.taskTarget);

  const geminiOpts = withTpUsageRecording(options.db, options.usage ?? {}, {
    systemInstruction: options.docsCacheName ? undefined : systemInstruction,
    prompt,
    maxOutputTokens,
    cachedContent: options.docsCacheName,
    ...tpAgentGeminiOptions(env, agentId, {
      background: options.background,
    }),
    responseSchema: IMPLEMENT_EDIT_PLAN_SCHEMA as unknown as Record<
      string,
      unknown
    >,
  });

  const first = await geminiGenerateJsonAllowTruncated<MaintainEditPlanResult>(
    env,
    geminiOpts
  );
  if (first.parsed?.edits?.length) {
    return first.parsed;
  }

  const salvaged = salvageEditsFromTruncatedJson(first.raw);
  if (salvaged?.edits?.length) {
    return salvaged;
  }

  if (first.raw.trim()) {
    const continuePrompt = `前回の JSON 応答（途中まで）:
${first.raw.slice(-6000)}

上記の続きから完全な JSON を出力してください。
edits 配列を必ず閉じ、target_path は "${IMPLEMENT_EDIT_TARGET_PATH}"。`;
    const second = await geminiGenerateJsonAllowTruncated<MaintainEditPlanResult>(
      env,
      { ...geminiOpts, prompt: continuePrompt }
    );
    if (second.parsed?.edits?.length) {
      return second.parsed;
    }
    const salvaged2 = salvageEditsFromTruncatedJson(second.raw || first.raw);
    if (salvaged2?.edits?.length) {
      return salvaged2;
    }
  }

  if (first.truncated || isFullHtmlEditTarget(options.taskTarget)) {
    throw new Error("EDIT_PLAN_TRUNCATED");
  }

  throw new Error("編集プランを生成できませんでした");
}

/** skeleton / polish 向け全文 HTML 生成（patch フォールバック） */
export async function generateImplementPatchHtml(
  env: Env,
  currentHtml: string,
  task: ImplementationTask,
  title: string,
  requirements: string,
  plan: string,
  options?: {
    background?: boolean;
    db?: D1Database | null;
    usage?: TpGeminiUsageContext;
  }
): Promise<string> {
  const prompt = `--- 現在の index.html ---
${currentHtml}

--- タスク ---
アプリ名: ${title}
target: ${task.target}
タイトル: ${task.title}
完了条件: ${task.acceptance_hint}

--- 要件（抜粋） ---
${requirements.slice(0, 3000)}

--- 実装計画（抜粋） ---
${plan.slice(0, 3000)}

上記に基づき、このタスクを反映した完全な HTML ドキュメントのみを出力してください。`;

  let text = await geminiGenerateText(
    env,
    withTpUsageRecording(options?.db, options?.usage ?? {}, {
      systemInstruction: FLASH_MAINTAIN_PATCH_SYSTEM,
      prompt,
      maxOutputTokens: MAX_EDIT_PLAN_TOKENS_FULL_HTML,
      responseMimeType: "text/plain",
      ...tpAgentGeminiOptions(env, "code_patch", {
        background: options?.background,
      }),
    })
  );
  text = text.trim();
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:html)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }
  if (!isCompleteIndexHtml(text)) {
    throw new Error("生成された index.html が不完全です");
  }
  return text;
}

function isTokenLimitError(message: string): boolean {
  return (
    message.includes("長すぎて") ||
    message.includes("MAX_TOKENS") ||
    message.includes("途中で切れ")
  );
}

function buildImplementTaskEditPrompt(
  currentHtml: string,
  task: ImplementationTask,
  title: string,
  requirements: string,
  plan: string,
  docsCache: boolean,
  retryNote?: string
): string {
  const { snippet, isPartial } = extractNumberedHtmlForTask(
    currentHtml,
    task.target
  );
  const scope = describeImplementEditScopes(currentHtml, task.target);
  const taskBlock = `--- タスク ---
アプリ名: ${title}
id=${task.id}, target=${task.target}
タイトル: ${task.title}
完了条件: ${task.acceptance_hint}`;

  const docsBlock = docsCache
    ? `${taskBlock}

上記の全文とキャッシュ済み要件・計画に基づき、このタスクだけを満たす edits を返してください。
target_path は必ず "${IMPLEMENT_EDIT_TARGET_PATH}"。`
    : `--- 要件（抜粋） ---
${requirements.slice(0, 4000)}

--- 実装計画（抜粋） ---
${plan.slice(0, 4000)}

${taskBlock}

上記の全文と文書に基づき、このタスクだけを満たす edits を返してください。
target_path は必ず "${IMPLEMENT_EDIT_TARGET_PATH}"。`;

  const retry = retryNote ? `\n\n${retryNote}` : "";

  return `--- 編集対象と許可範囲 ---
${scope}

--- ${IMPLEMENT_EDIT_TARGET_PATH} ${isPartial ? "抜粋" : "全文"}（行番号付き） ---
${snippet}

${docsBlock}${retry}`;
}

export interface TaskEditCallbacks {
  onActivity?: (label: string) => void;
  gemini?: EditPlanGeminiContext;
  /** 実装 Worker 内（Flex tier） */
  background?: boolean;
  db?: D1Database | null;
  usage?: TpGeminiUsageContext;
}

/** 1 タスク分の edits を生成して適用 */
export async function applyImplementationTask(
  env: Env,
  currentHtml: string,
  task: ImplementationTask,
  requirements: string,
  plan: string,
  title: string,
  callbacks?: TaskEditCallbacks
): Promise<{ html: string; assistantMessage: string }> {
  if (
    isSkeletonLikeTask(task) &&
    (isBareOrDefaultSkeleton(currentHtml) ||
      isScienceHubPlaceholderHtml(currentHtml))
  ) {
    callbacks?.onActivity?.(`${task.title}…`);
    return {
      html: buildProjectSkeleton(title),
      assistantMessage: `${task.title} を反映しました。`,
    };
  }

  currentHtml = normalizeImplementBaseHtml(currentHtml, title);

  const docsCache = callbacks?.gemini?.docsCacheName;
  callbacks?.onActivity?.(`編集先: ${IMPLEMENT_EDIT_TARGET_PATH}`);

  let lastError = "編集に失敗しました";
  const maxAttempts = resolveMaxTaskEditRetries(task.target);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    callbacks?.onActivity?.(
      attempt === 0
        ? `${task.title}…`
        : `${task.title}（再試行 ${attempt + 1}）…`
    );

    const retryNote =
      attempt === 0
        ? undefined
        : `前回のエラー: ${lastError}
前回まで適用済みの HTML を基に、</html> まで edits で補完してください。
edits は最大2件、各 content は短く分割。JSON は必ず閉じた完全なオブジェクトで返す。
target_path は "${IMPLEMENT_EDIT_TARGET_PATH}"。行番号は上記全文の L001 と一致させる。`;

    const prompt = buildImplementTaskEditPrompt(
      currentHtml,
      task,
      title,
      requirements,
      plan,
      Boolean(docsCache),
      retryNote
    );

    let planResult: MaintainEditPlanResult | null = null;
    try {
      planResult = await generateEditPlan(
        env,
        FLASH_IMPLEMENT_TASK_EDIT_SYSTEM,
        prompt,
        {
          attempt,
          docsCacheName: docsCache,
          planKind: "implement",
          taskTarget: task.target,
          background: callbacks?.background,
          maxAttempts,
          db: callbacks?.db,
          usage: callbacks?.usage,
        }
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (isTokenLimitError(msg) && isSkeletonLikeTask(task)) {
        return {
          html: buildProjectSkeleton(title),
          assistantMessage: `${task.title} を反映しました。`,
        };
      }
      if (
        msg === "EDIT_PLAN_TRUNCATED" ||
        (isTokenLimitError(msg) && isFullHtmlEditTarget(task.target))
      ) {
        try {
          callbacks?.onActivity?.(`${task.title}（全文再生成）…`);
          const patched = await generateImplementPatchHtml(
            env,
            currentHtml,
            task,
            title,
            requirements,
            plan,
            {
              background: callbacks?.background,
              db: callbacks?.db,
              usage: callbacks?.usage,
            }
          );
          return {
            html: stripScienceHubPlaceholderParagraph(patched),
            assistantMessage: `${task.title} を反映しました。`,
          };
        } catch (patchError) {
          lastError =
            patchError instanceof Error ? patchError.message : String(patchError);
          continue;
        }
      }
      lastError = isTokenLimitError(msg)
        ? `${msg}（全文を見た上で edits のみ返し、スニペット単体出力はしない）`
        : msg;
      continue;
    }

    if (!planResult) {
      lastError = "編集プランを取得できませんでした";
      continue;
    }

    const targetPath = planResult.target_path?.trim();
    if (targetPath && targetPath !== IMPLEMENT_EDIT_TARGET_PATH) {
      lastError = `target_path が不正です: ${targetPath}`;
      continue;
    }

    const edits = normalizeWorkspaceEdits(planResult.edits);
    if (!edits?.length) {
      lastError = "edits が空です";
      continue;
    }

    const scopeError = validateImplementEdits(currentHtml, edits, task.target);
    if (scopeError) {
      lastError = scopeError;
      continue;
    }

    callbacks?.onActivity?.(summarizeEdits(edits));
    const applied = applyWorkspaceEdits(currentHtml, edits);
    if (!applied.ok) {
      lastError = applied.error;
      continue;
    }

    if (!isCompleteIndexHtml(applied.text)) {
      lastError = "HTML が不完全です（</html> まで必要）";
      currentHtml = applied.text;
      continue;
    }

    return {
      html: stripScienceHubPlaceholderParagraph(applied.text),
      assistantMessage:
        planResult.assistant_message?.trim() || `${task.title} を反映しました。`,
    };
  }

  throw new Error(lastError);
}

/** タスクの編集プランのみ生成（並列バッチ用） */
export async function planImplementationTaskEdits(
  env: Env,
  currentHtml: string,
  task: ImplementationTask,
  requirements: string,
  plan: string,
  title: string,
  gemini?: EditPlanGeminiContext,
  options?: {
    background?: boolean;
    db?: D1Database | null;
    usage?: TpGeminiUsageContext;
  }
): Promise<MaintainEditPlanResult> {
  currentHtml = normalizeImplementBaseHtml(currentHtml, title);
  const prompt = buildImplementTaskEditPrompt(
    currentHtml,
    task,
    title,
    requirements,
    plan,
    Boolean(gemini?.docsCacheName)
  );
  return await generateEditPlan(
    env,
    FLASH_IMPLEMENT_TASK_EDIT_SYSTEM,
    prompt,
    {
      docsCacheName: gemini?.docsCacheName,
      planKind: "implement",
      taskTarget: task.target,
      background: options?.background,
      db: options?.db,
      usage: options?.usage,
    }
  );
}

/** プラン済み edits を適用 */
export function applyPlannedTaskEdits(
  currentHtml: string,
  task: ImplementationTask,
  planResult: MaintainEditPlanResult,
  _title: string
): { html: string; assistantMessage: string } {
  const edits = normalizeWorkspaceEdits(planResult.edits);
  if (!edits?.length) {
    throw new Error("edits が空です");
  }
  const scopeError = validateImplementEdits(currentHtml, edits, task.target);
  if (scopeError) throw new Error(scopeError);

  const applied = applyWorkspaceEdits(currentHtml, edits);
  if (!applied.ok) throw new Error(applied.error);
  if (!isCompleteIndexHtml(applied.text)) {
    throw new Error("HTML が不完全です");
  }

  return {
    html: stripScienceHubPlaceholderParagraph(applied.text),
    assistantMessage:
      planResult.assistant_message?.trim() || `${task.title} を反映しました。`,
  };
}

/** メンテ用: 番号付き全文から edits を生成 */
export async function planMaintainEdits(
  env: Env,
  db: D1Database | null,
  usage: TpGeminiUsageContext,
  numberedHtml: string,
  userReport: string,
  toolLog: string[],
  changeSummary: string,
  title: string
): Promise<MaintainEditPlanResult> {
  const prompt = `--- index.html（行番号付き） ---
${numberedHtml}

--- ユーザー要望 ---
${userReport}

変更の意図: ${changeSummary || "ユーザー要望どおり修正"}

調査ログ:
${toolLog.length ? toolLog.join("\n\n") : "（なし）"}

--- 指示 ---
アプリ名: ${title}
上記の index.html と要望に基づき、必要な edits を返してください。`;

  return await generateEditPlan(env, FLASH_MAINTAIN_EDIT_SYSTEM, prompt, {
    db,
    usage,
  });
}

export { EMPTY_SKELETON };
