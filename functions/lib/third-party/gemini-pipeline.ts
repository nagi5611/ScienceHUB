/**
 * サードパーティ — Gemini チャットパイプライン
 */

import type { Env } from "../types";
import { createId, now } from "../types";
import { geminiGenerateJson, geminiGenerateTextStream } from "../gemini/generate";
import {
  ARTIFACT_INDEX,
  ARTIFACT_PLAN,
  ARTIFACT_REQUIREMENTS,
  ARTIFACT_REVIEW,
  getArtifact,
  putArtifact,
} from "./artifacts";
import {
  LITE_DOCS_SCHEMA,
  LITE_TURN_META_SCHEMA,
  PLAN_REVIEW_SCHEMA,
  type LiteDocsResult,
  type LiteTurnMetaResult,
  type LiteTurnResult,
  type PlanReviewResult,
  type StructuredForm,
  type TpWorkflowPhase,
  isPostBuildPhase,
  isTpWorkflowPhase,
  parseTpChatMode,
  type TpChatMode,
} from "./schemas";
import {
  FLASH_REVIEW_SYSTEM,
  LITE_DOCS_SYSTEM,
  LITE_CHAT_STREAM_SYSTEM,
  LITE_TURN_META_SYSTEM,
  REVIEW_CHECKLIST_HINT,
} from "./prompts";
import { EMPTY_PLACEHOLDER_HTML } from "./stub-chat";
import { runTpAskTurnStream } from "./ask-chat";
import {
  runMaintainAgentTurn,
  wantsMaintainUserReport,
  type MaintainProjectContext,
} from "./workspace-agent";
import { tpAgentGeminiOptions } from "./agent-registry";
import { withTpUsageRecording } from "./gemini-usage";
import { runTpIntentClassify, classifyIntentByRules } from "./intent-classify";
import { createTpJob, jobProgress, getActiveJobForProject, type TpJobProgress } from "./jobs";
import {
  isTpPipelineWorkerConfigured,
  triggerImplementJobOnWorker,
} from "./pipeline-client";
import { runImplementJob } from "./implement-runner";
import { verifyProjectHtml } from "./browser-verify";

const DEFAULT_MAX_DAILY_TURNS = 30;
const MAX_REVIEW_LOOPS = 2;
const MAX_IMPLEMENT_ATTEMPTS = 3;

function tpUsageContext(
  project: Pick<TpProjectPipelineRow, "id" | "owner_user_id">
) {
  return { projectId: project.id, ownerUserId: project.owner_user_id };
}

function wrapTpGemini(
  db: D1Database,
  project: Pick<TpProjectPipelineRow, "id" | "owner_user_id">,
  options: Parameters<typeof withTpUsageRecording>[2]
) {
  return withTpUsageRecording(db, tpUsageContext(project), options);
}

export interface TpProjectPipelineRow {
  id: string;
  owner_user_id: string;
  title: string;
  slug: string;
  status: string;
  r2_prefix: string;
  dir_name: string;
  workflow_phase: string;
  context_summary: string | null;
  pending_form_json: string | null;
  review_passed: number | null;
  implement_attempts: number;
  review_loop_count: number;
  awaiting_implement_confirm: number;
  maintain_attempts: number;
}

export interface GeminiChatResult {
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    created_at: number;
  }>;
  phase: TpWorkflowPhase;
  pending_form: StructuredForm | null;
  review_summary: string | null;
  htmlUpdated: boolean;
  dir_name: string;
  active_job?: {
    jobId: string;
    status: string;
    progress?: {
      current?: number;
      total?: number;
      label?: string;
      phase?: string;
    } | null;
  } | null;
}

export interface TpChatCallbacks {
  onActivity?: (label: string, phase?: string) => void;
  onDelta?: (text: string) => void;
  onArtifact?: (path: string) => void;
  onTasks?: (payload: {
    tasks: Array<{ id: string; title: string; status: string }>;
    current: number;
  }) => void;
  onJob?: (payload: {
    jobId: string;
    status: string;
    progress?: {
      current?: number;
      total?: number;
      label?: string;
      phase?: string;
    } | null;
  }) => void;
  onVerify?: (payload: {
    passed: boolean;
    errors: string[];
    warnings: string[];
  }) => void;
}

function emitActivity(
  callbacks: TpChatCallbacks | undefined,
  label: string,
  phase?: string
): void {
  callbacks?.onActivity?.(label, phase);
}

function emitArtifact(
  callbacks: TpChatCallbacks | undefined,
  path: string
): void {
  callbacks?.onArtifact?.(path);
}

function emitTasks(
  callbacks: TpChatCallbacks | undefined,
  tasksFile: {
    tasks: Array<{ id: string; title: string; status: string }>;
    current_task_index: number;
  }
): void {
  callbacks?.onTasks?.({
    tasks: tasksFile.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
    })),
    current: tasksFile.current_task_index,
  });
}

async function insertMessage(
  db: D1Database,
  projectId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO tp_chat_messages (id, project_id, role, content, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(createId("tpmsg"), projectId, role, content, now())
    .run();
}

async function listMessages(db: D1Database, projectId: string) {
  const result = await db
    .prepare(
      `SELECT id, role, content, created_at FROM tp_chat_messages
       WHERE project_id = ? ORDER BY created_at ASC`
    )
    .bind(projectId)
    .all<{
      id: string;
      role: string;
      content: string;
      created_at: number;
    }>();
  return (result.results ?? []).map((r) => ({
    id: r.id,
    role: r.role === "assistant" ? "assistant" as const : "user" as const,
    content: r.content,
    created_at: r.created_at,
  }));
}

/** 本日のユーザーメッセージ数でレート制限 */
async function assertDailyTurnLimit(
  db: D1Database,
  userId: string,
  env?: Env
): Promise<void> {
  const maxTurns =
    Number.parseInt(env?.TP_MAX_DAILY_TURNS ?? "", 10) || DEFAULT_MAX_DAILY_TURNS;
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const since = start.getTime();
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS c FROM tp_chat_messages m
       JOIN tp_projects p ON p.id = m.project_id
       WHERE p.owner_user_id = ? AND m.role = 'user' AND m.created_at >= ?`
    )
    .bind(userId, since)
    .first<{ c: number }>();
  if ((row?.c ?? 0) >= maxTurns) {
    throw new Error("本日の AI 利用上限に達しました。明日またお試しください。");
  }
}

async function loadPipelineProject(
  db: D1Database,
  userId: string,
  projectId: string
): Promise<TpProjectPipelineRow | null> {
  const row = await db
    .prepare(
      `SELECT id, owner_user_id, title, slug, status, r2_prefix, dir_name,
              workflow_phase, context_summary, pending_form_json, review_passed,
              implement_attempts, review_loop_count, awaiting_implement_confirm,
              COALESCE(maintain_attempts, 0) AS maintain_attempts
       FROM tp_projects WHERE id = ? AND owner_user_id = ?`
    )
    .bind(projectId, userId)
    .first<TpProjectPipelineRow>();
  return row ?? null;
}

async function patchProject(
  db: D1Database,
  projectId: string,
  fields: Partial<{
    workflow_phase: string;
    context_summary: string;
    pending_form_json: string | null;
    review_passed: number | null;
    implement_attempts: number;
    review_loop_count: number;
    awaiting_implement_confirm: number;
    maintain_attempts: number;
  }>
): Promise<void> {
  const updates: string[] = ["updated_at = ?"];
  const values: (string | number | null)[] = [now()];

  if (fields.workflow_phase !== undefined) {
    updates.push("workflow_phase = ?");
    values.push(fields.workflow_phase);
  }
  if (fields.context_summary !== undefined) {
    updates.push("context_summary = ?");
    values.push(fields.context_summary);
  }
  if (fields.pending_form_json !== undefined) {
    updates.push("pending_form_json = ?");
    values.push(fields.pending_form_json);
  }
  if (fields.review_passed !== undefined) {
    updates.push("review_passed = ?");
    values.push(fields.review_passed);
  }
  if (fields.implement_attempts !== undefined) {
    updates.push("implement_attempts = ?");
    values.push(fields.implement_attempts);
  }
  if (fields.review_loop_count !== undefined) {
    updates.push("review_loop_count = ?");
    values.push(fields.review_loop_count);
  }
  if (fields.awaiting_implement_confirm !== undefined) {
    updates.push("awaiting_implement_confirm = ?");
    values.push(fields.awaiting_implement_confirm);
  }
  if (fields.maintain_attempts !== undefined) {
    updates.push("maintain_attempts = ?");
    values.push(fields.maintain_attempts);
  }

  values.push(projectId);
  await db
    .prepare(`UPDATE tp_projects SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();
}

function recentChatBlock(
  messages: Array<{ role: string; content: string }>,
  limit = 6
): string {
  const tail = messages.slice(-limit);
  return tail.map((m) => `${m.role}: ${m.content}`).join("\n");
}

function parsePendingForm(json: string | null): StructuredForm | null {
  if (!json?.trim()) return null;
  try {
    return JSON.parse(json) as StructuredForm;
  } catch {
    return null;
  }
}

function formatFormResponses(
  form: StructuredForm,
  responses: Record<string, string | string[]>
): string {
  const lines: string[] = ["【フォーム回答】"];
  for (const q of form.questions) {
    const raw = responses[q.id];
    let text = "";
    if (Array.isArray(raw)) text = raw.join(", ");
    else if (typeof raw === "string") text = raw;
    lines.push(`${q.prompt}: ${text}`);
  }
  return lines.join("\n");
}

/** ゲートで要件深掘りを選んだ意図 */
function wantsDeepenRequirements(text: string): boolean {
  const t = text.trim();
  return (
    text.includes("要件を深掘り") ||
    text.includes("深掘り") ||
    t === "deepen" ||
    t === "deepen_requirements"
  );
}

/** 要件・計画ドキュメント作成へ進む意図（ゲートの「実装に進む」相当） */
function wantsGateBuildDocs(text: string, phase: string): boolean {
  if (isPostBuildPhase(phase)) return false;
  if (wantsDeepenRequirements(text)) return false;
  const t = text.trim();
  if (text.includes("実装に進む") || t === "write_docs") return true;
  if (t === "implement_now" && phase === "gate_deepen_or_build") return true;
  if (phase !== "gate_deepen_or_build") return false;
  if (
    t === "実装して" ||
    t === "実装" ||
    t === "作って" ||
    /実装して|実装を進|実装に進|計画を作|計画作成|このまま|進めて/.test(t)
  ) {
    return true;
  }
  return false;
}

async function runLiteChatStream(
  env: Env,
  db: D1Database,
  project: TpProjectPipelineRow,
  userInput: string,
  messages: Array<{ role: string; content: string }>,
  onDelta?: (text: string) => void
): Promise<string> {
  const prompt = `現在フェーズ: ${project.workflow_phase}
アプリ名: ${project.title}
これまでの要点:
${project.context_summary || "（未整理）"}

直近の会話:
${recentChatBlock(messages)}

ユーザーの入力:
${userInput}`;

  const result = await geminiGenerateTextStream(
    env,
    wrapTpGemini(db, project, {
      systemInstruction: LITE_CHAT_STREAM_SYSTEM,
      prompt,
      maxOutputTokens: 4096,
      responseMimeType: "text/plain",
      ...tpAgentGeminiOptions(env, "discovery"),
    }),
    (delta) => onDelta?.(delta)
  );

  const msg = result.text.trim();
  if (!msg) {
    return "もう少し詳しく教えてください。";
  }
  return msg;
}

async function runLiteTurnMeta(
  env: Env,
  db: D1Database,
  project: TpProjectPipelineRow,
  userInput: string,
  assistantMessage: string,
  messages: Array<{ role: string; content: string }>
): Promise<LiteTurnMetaResult> {
  const prompt = `現在フェーズ: ${project.workflow_phase}
アプリ名: ${project.title}
これまでの要点:
${project.context_summary || "（未整理）"}

直近の会話:
${recentChatBlock(messages)}

ユーザーの入力:
${userInput}

今回のアシスタント応答（確定）:
${assistantMessage}`;

  return await geminiGenerateJson<LiteTurnMetaResult>(
    env,
    wrapTpGemini(db, project, {
      systemInstruction: LITE_TURN_META_SYSTEM,
      prompt,
      maxOutputTokens: 2048,
      ...tpAgentGeminiOptions(env, "intent_classifier"),
      responseSchema: LITE_TURN_META_SCHEMA as unknown as Record<string, unknown>,
    })
  );
}

async function runLiteTurn(
  env: Env,
  db: D1Database,
  project: TpProjectPipelineRow,
  userInput: string,
  messages: Array<{ role: string; content: string }>,
  onDelta?: (text: string) => void
): Promise<LiteTurnResult> {
  const assistant_message = await runLiteChatStream(
    env,
    db,
    project,
    userInput,
    messages,
    onDelta
  );
  const meta = await runLiteTurnMeta(
    env,
    db,
    project,
    userInput,
    assistant_message,
    messages
  );
  return {
    assistant_message,
    context_summary: meta.context_summary,
    next_phase: isTpWorkflowPhase(meta.next_phase)
      ? meta.next_phase
      : (project.workflow_phase as TpWorkflowPhase),
    pending_form: meta.pending_form,
    gate_choice_ids: meta.gate_choice_ids,
  };
}

async function runLiteDocs(
  env: Env,
  db: D1Database,
  project: TpProjectPipelineRow
): Promise<LiteDocsResult> {
  const prompt = `アプリ名: ${project.title}
要点:
${project.context_summary || ""}

要件定義書と実装計画書を生成してください。`;

  return await geminiGenerateJson<LiteDocsResult>(
    env,
    wrapTpGemini(db, project, {
      systemInstruction: LITE_DOCS_SYSTEM,
      prompt,
      maxOutputTokens: 8192,
      ...tpAgentGeminiOptions(env, "docs_writer"),
      responseSchema: LITE_DOCS_SCHEMA as unknown as Record<string, unknown>,
    })
  );
}

async function runFlashReview(
  env: Env,
  db: D1Database,
  project: TpProjectPipelineRow,
  requirements: string,
  plan: string
): Promise<PlanReviewResult> {
  const prompt = `${REVIEW_CHECKLIST_HINT}

--- 要件定義書 ---
${requirements}

--- 実装計画書 ---
${plan}`;

  return await geminiGenerateJson<PlanReviewResult>(
    env,
    wrapTpGemini(db, project, {
      systemInstruction: FLASH_REVIEW_SYSTEM,
      prompt,
      maxOutputTokens: 8192,
      ...tpAgentGeminiOptions(env, "plan_reviewer"),
      responseSchema: PLAN_REVIEW_SCHEMA as unknown as Record<string, unknown>,
    })
  );
}

async function writeDocsPhase(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: TpProjectPipelineRow,
  callbacks?: TpChatCallbacks
): Promise<{ message: string }> {
  emitActivity(callbacks, "要件定義書を作成中…", "write_req_and_plan");
  const docs = await runLiteDocs(env, db, project);
  await putArtifact(
    bucket,
    project.dir_name,
    ARTIFACT_REQUIREMENTS,
    docs.requirements_markdown,
    "text/markdown; charset=utf-8"
  );
  emitArtifact(callbacks, ARTIFACT_REQUIREMENTS);
  emitActivity(callbacks, "実装計画を作成中…", "write_req_and_plan");
  await putArtifact(
    bucket,
    project.dir_name,
    ARTIFACT_PLAN,
    docs.plan_markdown,
    "text/markdown; charset=utf-8"
  );
  emitArtifact(callbacks, ARTIFACT_PLAN);
  await insertMessage(db, project.id, "assistant", docs.assistant_message);
  await patchProject(db, project.id, {
    workflow_phase: "flash_review",
    pending_form_json: null,
  });
  return { message: docs.assistant_message };
}

async function flashReviewPhase(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: TpProjectPipelineRow,
  callbacks?: TpChatCallbacks
): Promise<{ message: string; passed: boolean }> {
  emitActivity(callbacks, "実装計画をレビュー中…", "flash_review");
  const requirements =
    (await getArtifact(bucket, project.dir_name, ARTIFACT_REQUIREMENTS)) ?? "";
  const plan = (await getArtifact(bucket, project.dir_name, ARTIFACT_PLAN)) ?? "";
  const review = await runFlashReview(env, db, project, requirements, plan);
  await putArtifact(
    bucket,
    project.dir_name,
    ARTIFACT_REVIEW,
    JSON.stringify(review),
    "application/json; charset=utf-8"
  );

  if (review.revised_plan_markdown?.trim() && !review.passed) {
    await putArtifact(
      bucket,
      project.dir_name,
      ARTIFACT_PLAN,
      review.revised_plan_markdown,
      "text/markdown; charset=utf-8"
    );
  }

  const msg = review.summary;
  await insertMessage(db, project.id, "assistant", msg);

  if (review.passed) {
    await patchProject(db, project.id, {
      workflow_phase: "flash_implement",
      review_passed: 1,
      awaiting_implement_confirm: 0,
    });
    return { message: msg, passed: true };
  }

  const loops = project.review_loop_count + 1;
  if (loops < MAX_REVIEW_LOOPS) {
    await patchProject(db, project.id, {
      workflow_phase: "flash_revise_plan",
      review_passed: 0,
      review_loop_count: loops,
      awaiting_implement_confirm: 1,
    });
    await insertMessage(
      db,
      project.id,
      "assistant",
      "計画を修正しました。「実装開始」と送ると実装に進みます。"
    );
    return { message: msg, passed: false };
  }

  await patchProject(db, project.id, {
    workflow_phase: "await_implement_confirm",
    review_passed: 0,
    awaiting_implement_confirm: 1,
  });
  await insertMessage(
    db,
    project.id,
    "assistant",
    "レビューで懸念が残っています。「実装開始」と送るか、チャットで要件を修正してください。"
  );
  return { message: msg, passed: false };
}

async function flashImplementPhase(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: TpProjectPipelineRow,
  callbacks?: TpChatCallbacks
): Promise<{
  message: string;
  htmlUpdated: boolean;
  backgroundJob?: {
    jobId: string;
    status: string;
    progress?: TpJobProgress | null;
  };
}> {
  if (project.implement_attempts >= MAX_IMPLEMENT_ATTEMPTS) {
    throw new Error("実装の再試行上限に達しました");
  }

  const runnerCallbacks = {
    onActivity: (label: string, phase?: string) =>
      emitActivity(callbacks, label, phase),
    onArtifact: (path: string) => emitArtifact(callbacks, path),
    onTasks: (payload: {
      tasks: Array<{ id: string; title: string; status: string }>;
      current: number;
    }) => emitTasks(callbacks, {
      tasks: payload.tasks,
      current_task_index: payload.current,
    }),
    onVerify: (result: {
      passed: boolean;
      errors: string[];
      warnings: string[];
    }) => callbacks?.onVerify?.(result),
  };

  if (isTpPipelineWorkerConfigured(env)) {
    const job = await createTpJob(
      db,
      project.id,
      project.owner_user_id,
      "implement"
    );
    callbacks?.onJob?.({
      jobId: job.id,
      status: job.status,
      progress: jobProgress(job),
    });

    await triggerImplementJobOnWorker(env, job.id, project.id);

    const bgMessage =
      "実装ジョブをバックグラウンドで開始しました。完了までしばらくお待ちください。";
    await insertMessage(db, project.id, "assistant", bgMessage);

    return {
      message: bgMessage,
      htmlUpdated: false,
      backgroundJob: {
        jobId: job.id,
        status: "running",
        progress: jobProgress(job),
      },
    };
  }

  const job = await createTpJob(
    db,
    project.id,
    project.owner_user_id,
    "implement"
  );
  callbacks?.onJob?.({
    jobId: job.id,
    status: "running",
    progress: null,
  });

  try {
    const result = await runImplementJob(
      env,
      db,
      bucket,
      project,
      job.id,
      runnerCallbacks
    );
    callbacks?.onJob?.({ jobId: job.id, status: "succeeded", progress: null });
    return { message: result.assistantMessage, htmlUpdated: result.htmlUpdated };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "実装に失敗しました";
    const { failImplementJob } = await import("./implement-runner");
    await failImplementJob(db, job.id, project.id, msg);
    throw error;
  }
}

/** Gemini パイプライン 1 ターン */
export async function runTpGeminiChat(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  userId: string,
  projectId: string,
  input: {
    message?: string;
    form_responses?: Record<string, string | string[]>;
    chat_mode?: TpChatMode | string;
  },
  callbacks?: TpChatCallbacks
): Promise<GeminiChatResult | null> {
  const project = await loadPipelineProject(db, userId, projectId);
  if (!project) return null;

  const chatMode = parseTpChatMode(input.chat_mode);

  emitActivity(callbacks, "Working…", project.workflow_phase);

  let userText = (input.message ?? "").trim();
  const pendingForm = parsePendingForm(project.pending_form_json);

  if (input.form_responses && pendingForm) {
    userText = formatFormResponses(pendingForm, input.form_responses);
  }

  let current = await loadPipelineProject(db, userId, projectId);
  if (!current) return null;

  const implementStartTrigger =
    !isPostBuildPhase(current.workflow_phase) &&
    (userText === "実装開始" ||
      (current.awaiting_implement_confirm === 1 &&
        (userText === "実装開始" ||
          userText === "implement_now" ||
          userText.includes("実装して") ||
          userText.trim() === "実装")));

  const gateBuildTrigger = wantsGateBuildDocs(
    userText,
    current.workflow_phase
  );

  if (userText && !implementStartTrigger) {
    await assertDailyTurnLimit(db, userId, env);
    await insertMessage(db, projectId, "user", userText);
  }

  if (chatMode === "ask" && userText) {
    emitActivity(callbacks, "質問に回答中…", current.workflow_phase);
    const messages = await listMessages(db, projectId);
    const reply = await runTpAskTurnStream(
      env,
      db,
      bucket,
      current,
      userText,
      messages,
      (delta) => callbacks?.onDelta?.(delta)
    );
    await insertMessage(db, projectId, "assistant", reply);
    const finalProject = await loadPipelineProject(db, userId, projectId);
    if (!finalProject) return null;
    const outMessages = await listMessages(db, projectId);
    const phaseOut = isTpWorkflowPhase(finalProject.workflow_phase)
      ? finalProject.workflow_phase
      : "discovery";
    return {
      messages: outMessages,
      phase: phaseOut,
      pending_form: parsePendingForm(finalProject.pending_form_json),
      review_summary: null,
      htmlUpdated: false,
      dir_name: finalProject.dir_name,
    };
  }

  let htmlUpdated = false;
  let reviewSummary: string | null = null;
  let activeJob: GeminiChatResult["active_job"] = null;

  const applyImplementResult = (impl: Awaited<ReturnType<typeof flashImplementPhase>>) => {
    if (impl.backgroundJob) {
      activeJob = {
        jobId: impl.backgroundJob.jobId,
        status: impl.backgroundJob.status,
        progress: impl.backgroundJob.progress ?? null,
      };
      return;
    }
    if (impl.htmlUpdated) htmlUpdated = true;
  };

  // 実装確認トリガー（ゲートの「実装に進む」とは別）
  if (implementStartTrigger) {
    await patchProject(db, projectId, { workflow_phase: "flash_implement" });
    current = (await loadPipelineProject(db, userId, projectId))!;
    applyImplementResult(
      await flashImplementPhase(env, db, bucket, current, callbacks)
    );
  }

  // ゲート: 深掘り / 実装
  if (!isPostBuildPhase(current.workflow_phase) && wantsDeepenRequirements(userText)) {
    await patchProject(db, projectId, {
      workflow_phase: "deepen_requirements",
      pending_form_json: null,
    });
    await insertMessage(
      db,
      projectId,
      "assistant",
      "要件をさらに固めましょう。追加で知りたいことを教えてください。"
    );
  } else if (gateBuildTrigger) {
    await patchProject(db, projectId, { workflow_phase: "write_req_and_plan" });
    current = (await loadPipelineProject(db, userId, projectId))!;
    await writeDocsPhase(env, db, bucket, current, callbacks);
  }

  current = (await loadPipelineProject(db, userId, projectId))!;
  const phase = current.workflow_phase;

  // 自動フェーズ処理
  if (phase === "write_req_and_plan") {
    await writeDocsPhase(env, db, bucket, current, callbacks);
  }

  current = (await loadPipelineProject(db, userId, projectId))!;
  if (current.workflow_phase === "flash_review") {
    const r = await flashReviewPhase(env, db, bucket, current, callbacks);
    reviewSummary = r.message;
    current = (await loadPipelineProject(db, userId, projectId))!;
    if (r.passed && current.workflow_phase === "flash_implement") {
      applyImplementResult(
        await flashImplementPhase(env, db, bucket, current, callbacks)
      );
    }
  }

  current = (await loadPipelineProject(db, userId, projectId))!;
  if (current.workflow_phase === "flash_revise_plan") {
    await patchProject(db, projectId, { workflow_phase: "flash_review" });
    current = (await loadPipelineProject(db, userId, projectId))!;
    const r = await flashReviewPhase(env, db, bucket, current, callbacks);
    reviewSummary = r.message;
  }

  current = (await loadPipelineProject(db, userId, projectId))!;
  if (
    (current.workflow_phase === "flash_implement" ||
      current.workflow_phase === "flash_implement_tasks") &&
    !htmlUpdated &&
    userText &&
    !implementStartTrigger
  ) {
    applyImplementResult(
      await flashImplementPhase(env, db, bucket, current, callbacks)
    );
  }
  current = (await loadPipelineProject(db, userId, projectId))!;
  const maintainPhases = ["draft_ready", "app_maintain", "app_maintain_done"];
  if (userText && maintainPhases.includes(current.workflow_phase)) {
    let intent: string | null = null;
    try {
      const classified = await runTpIntentClassify(env, db, {
        phase: current.workflow_phase,
        userText,
        chatMode,
        contextSummary: current.context_summary,
        usage: tpUsageContext(current),
      });
      intent = classified.intent;
    } catch {
      intent =
        classifyIntentByRules(userText, current.workflow_phase) ??
        (wantsMaintainUserReport(userText, current.workflow_phase)
          ? "maintain"
          : null);
    }

    if (intent === "ask" || intent === "general_chat") {
      emitActivity(callbacks, "質問に回答中…", current.workflow_phase);
      const messages = await listMessages(db, projectId);
      const reply = await runTpAskTurnStream(
        env,
        db,
        bucket,
        current,
        userText,
        messages,
        (delta) => callbacks?.onDelta?.(delta)
      );
      await insertMessage(db, projectId, "assistant", reply);
    } else if (intent === "gate_build") {
      await patchProject(db, projectId, {
        workflow_phase: "write_req_and_plan",
        pending_form_json: null,
      });
      current = (await loadPipelineProject(db, userId, projectId))!;
      await writeDocsPhase(env, db, bucket, current, callbacks);
    } else if (intent === "gate_deepen") {
      await patchProject(db, projectId, {
        workflow_phase: "deepen_requirements",
        pending_form_json: null,
      });
      await insertMessage(
        db,
        projectId,
        "assistant",
        "要件をさらに固めましょう。追加で知りたいことを教えてください。"
      );
    } else if (intent === "implement_start") {
      await patchProject(db, projectId, { workflow_phase: "flash_implement" });
      current = (await loadPipelineProject(db, userId, projectId))!;
      applyImplementResult(
        await flashImplementPhase(env, db, bucket, current, callbacks)
      );
    } else if (
      intent === "maintain" ||
      wantsMaintainUserReport(userText, current.workflow_phase)
    ) {
      await patchProject(db, projectId, {
        workflow_phase: "app_maintain",
        pending_form_json: null,
      });
      current = (await loadPipelineProject(db, userId, projectId))!;
      emitActivity(callbacks, "不具合を調査中…", "app_maintain");
      const messages = await listMessages(db, projectId);
      const maintainCtx: MaintainProjectContext = {
        id: current.id,
        owner_user_id: current.owner_user_id,
        title: current.title,
        r2_prefix: current.r2_prefix,
        dir_name: current.dir_name,
        context_summary: current.context_summary,
        maintain_attempts: current.maintain_attempts ?? 0,
      };
      const maintainResult = await runMaintainAgentTurn(
        env,
        db,
        bucket,
        maintainCtx,
        userText,
        recentChatBlock(messages),
        {
          onActivity: (label) =>
            emitActivity(callbacks, label, "app_maintain"),
        }
      );
      await insertMessage(
        db,
        projectId,
        "assistant",
        maintainResult.assistantMessage
      );
      await patchProject(db, projectId, {
        workflow_phase: maintainResult.workflowPhase,
        pending_form_json: null,
      });
      if (maintainResult.htmlUpdated) {
        htmlUpdated = true;
        const verifyResult = await verifyProjectHtml(
          env,
          bucket,
          current.id,
          current.dir_name
        );
        callbacks?.onVerify?.({
          passed: verifyResult.passed,
          errors: verifyResult.errors,
          warnings: verifyResult.warnings,
        });
      }
    }
  }

  // Lite 対話フェーズ
  const litePhases = [
    "discovery",
    "clarify",
    "structured_form",
    "gate_deepen_or_build",
    "deepen_requirements",
  ];
  current = (await loadPipelineProject(db, userId, projectId))!;
  if (
    userText &&
    litePhases.includes(current.workflow_phase) &&
    !isPostBuildPhase(current.workflow_phase) &&
    !wantsGateBuildDocs(userText, current.workflow_phase) &&
    !wantsDeepenRequirements(userText)
  ) {
    emitActivity(callbacks, "応答を作成中…", current.workflow_phase);
    const messages = await listMessages(db, projectId);
    const turn = await runLiteTurn(
      env,
      db,
      current,
      userText,
      messages,
      (delta) => callbacks?.onDelta?.(delta)
    );
    await insertMessage(db, projectId, "assistant", turn.assistant_message);

    let nextPhase: TpWorkflowPhase = isTpWorkflowPhase(turn.next_phase)
      ? turn.next_phase
      : (current.workflow_phase as TpWorkflowPhase);

    let pendingJson: string | null = null;
    if (turn.pending_form?.questions?.length) {
      pendingJson = JSON.stringify(turn.pending_form);
      nextPhase = "structured_form";
    }

    if (nextPhase === "gate_deepen_or_build") {
      pendingJson = null;
    }

    await patchProject(db, projectId, {
      workflow_phase: nextPhase,
      context_summary: turn.context_summary.slice(0, 4000),
      pending_form_json: pendingJson,
    });

    if (nextPhase === "write_req_and_plan") {
      current = (await loadPipelineProject(db, userId, projectId))!;
      await writeDocsPhase(env, db, bucket, current, callbacks);
    }
  }

  const finalProject = await loadPipelineProject(db, userId, projectId);
  if (!finalProject) return null;

  if (!activeJob) {
    const runningJob = await getActiveJobForProject(db, projectId);
    if (runningJob) {
      activeJob = {
        jobId: runningJob.id,
        status: runningJob.status,
        progress: jobProgress(runningJob),
      };
    }
  }

  const messages = await listMessages(db, projectId);
  const phaseOut = isTpWorkflowPhase(finalProject.workflow_phase)
    ? finalProject.workflow_phase
    : "discovery";

  return {
    messages,
    phase: phaseOut,
    pending_form: parsePendingForm(finalProject.pending_form_json),
    review_summary: reviewSummary,
    htmlUpdated,
    dir_name: finalProject.dir_name,
    active_job: activeJob,
  };
}

/** GEMINI 未設定時スタブ */
export async function runTpStubFallback(
  db: D1Database,
  bucket: R2Bucket,
  userId: string,
  projectId: string,
  message: string
): Promise<GeminiChatResult | null> {
  const { runStubChatLogic } = await import("./stub-chat");
  const trimmed = message.trim();
  if (!trimmed) throw new Error("メッセージを入力してください");

  const row = await db
    .prepare("SELECT r2_prefix, dir_name FROM tp_projects WHERE id = ? AND owner_user_id = ?")
    .bind(projectId, userId)
    .first<{ r2_prefix: string; dir_name: string }>();
  if (!row) return null;

  await insertMessage(db, projectId, "user", trimmed);
  let html =
    (await getArtifact(bucket, row.dir_name, ARTIFACT_INDEX)) ??
    EMPTY_PLACEHOLDER_HTML;
  const obj = await bucket.get(`${row.r2_prefix}index.html`);
  if (obj) {
    html = await obj.text();
  }
  const result = runStubChatLogic(trimmed, html, "");
  await insertMessage(db, projectId, "assistant", result.assistantMessage);
  let htmlUpdated = false;
  if (result.html) {
    await bucket.put(
      `${row.r2_prefix}index.html`,
      result.html,
      { httpMetadata: { contentType: "text/html; charset=utf-8" } }
    );
    await putArtifact(
      bucket,
      row.dir_name,
      ARTIFACT_INDEX,
      result.html,
      "text/html; charset=utf-8"
    );
    htmlUpdated = true;
  }
  const messages = await listMessages(db, projectId);
  return {
    messages,
    phase: "discovery",
    pending_form: null,
    review_summary: null,
    htmlUpdated,
    dir_name: row.dir_name,
  };
}
