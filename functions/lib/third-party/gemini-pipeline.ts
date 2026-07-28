/**
 * サードパーティ — Gemini チャットパイプライン
 */

import type { Env } from "../types";
import { createId, now } from "../types";
import { geminiGenerateJson } from "../gemini/generate";
import {
  ARTIFACT_INDEX,
  ARTIFACT_PLAN,
  ARTIFACT_REQUIREMENTS,
  ARTIFACT_REVIEW,
  getArtifact,
  putArtifact,
} from "./artifacts";
import {
  FLASH_IMPLEMENT_SCHEMA,
  LITE_DOCS_SCHEMA,
  LITE_TURN_SCHEMA,
  PLAN_REVIEW_SCHEMA,
  type LiteDocsResult,
  type LiteTurnResult,
  type PlanReviewResult,
  type StructuredForm,
  type TpWorkflowPhase,
  isTpWorkflowPhase,
} from "./schemas";
import {
  FLASH_IMPLEMENT_SYSTEM,
  FLASH_REVIEW_SYSTEM,
  LITE_DOCS_SYSTEM,
  LITE_SYSTEM,
  REVIEW_CHECKLIST_HINT,
} from "./prompts";
import { EMPTY_PLACEHOLDER_HTML } from "./stub-chat";

const MAX_DAILY_TURNS = 30;
const MAX_REVIEW_LOOPS = 2;
const MAX_IMPLEMENT_ATTEMPTS = 3;

const DEFAULT_LITE_MODEL = "gemini-2.5-flash-lite";
const DEFAULT_FLASH_MODEL = "gemini-2.5-flash";

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
}

function liteModel(env: Env): string {
  return env.GEMINI_TP_LITE_MODEL?.trim() || DEFAULT_LITE_MODEL;
}

function flashModel(env: Env): string {
  return env.GEMINI_TP_FLASH_MODEL?.trim() || DEFAULT_FLASH_MODEL;
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
async function assertDailyTurnLimit(db: D1Database, userId: string): Promise<void> {
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
  if ((row?.c ?? 0) >= MAX_DAILY_TURNS) {
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
              implement_attempts, review_loop_count, awaiting_implement_confirm
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

async function runLiteTurn(
  env: Env,
  project: TpProjectPipelineRow,
  userInput: string,
  messages: Array<{ role: string; content: string }>
): Promise<LiteTurnResult> {
  const prompt = `現在フェーズ: ${project.workflow_phase}
アプリ名: ${project.title}
これまでの要点:
${project.context_summary || "（未整理）"}

直近の会話:
${recentChatBlock(messages)}

ユーザーの入力:
${userInput}

next_phase は discovery, clarify, structured_form, gate_deepen_or_build, deepen_requirements のいずれか。
structured_form に進むときは pending_form に質問（2〜5問、選択肢付き）を入れる。
gate_deepen_or_build では gate_choice_ids に deepen と implement_now を含める。`;

  return await geminiGenerateJson<LiteTurnResult>(env, {
    model: liteModel(env),
    systemInstruction: LITE_SYSTEM,
    prompt,
    temperature: 0.4,
    maxOutputTokens: 4096,
    responseSchema: LITE_TURN_SCHEMA as unknown as Record<string, unknown>,
  });
}

async function runLiteDocs(
  env: Env,
  project: TpProjectPipelineRow
): Promise<LiteDocsResult> {
  const prompt = `アプリ名: ${project.title}
要点:
${project.context_summary || ""}

要件定義書と実装計画書を生成してください。`;

  return await geminiGenerateJson<LiteDocsResult>(env, {
    model: liteModel(env),
    systemInstruction: LITE_DOCS_SYSTEM,
    prompt,
    temperature: 0.3,
    maxOutputTokens: 8192,
    responseSchema: LITE_DOCS_SCHEMA as unknown as Record<string, unknown>,
  });
}

async function runFlashReview(
  env: Env,
  requirements: string,
  plan: string
): Promise<PlanReviewResult> {
  const prompt = `${REVIEW_CHECKLIST_HINT}

--- 要件定義書 ---
${requirements}

--- 実装計画書 ---
${plan}`;

  return await geminiGenerateJson<PlanReviewResult>(env, {
    model: flashModel(env),
    systemInstruction: FLASH_REVIEW_SYSTEM,
    prompt,
    temperature: 0.2,
    maxOutputTokens: 8192,
    responseSchema: PLAN_REVIEW_SCHEMA as unknown as Record<string, unknown>,
  });
}

async function runFlashImplement(
  env: Env,
  requirements: string,
  plan: string,
  title: string
): Promise<{ index_html: string; assistant_message: string }> {
  const prompt = `アプリ名: ${title}

--- 要件定義書 ---
${requirements}

--- 実装計画書 ---
${plan}`;

  return await geminiGenerateJson(env, {
    model: flashModel(env),
    systemInstruction: FLASH_IMPLEMENT_SYSTEM,
    prompt,
    temperature: 0.25,
    maxOutputTokens: 16384,
    responseSchema: FLASH_IMPLEMENT_SCHEMA as unknown as Record<string, unknown>,
  });
}

async function writeDocsPhase(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: TpProjectPipelineRow
): Promise<{ message: string }> {
  const docs = await runLiteDocs(env, project);
  await putArtifact(
    bucket,
    project.dir_name,
    ARTIFACT_REQUIREMENTS,
    docs.requirements_markdown,
    "text/markdown; charset=utf-8"
  );
  await putArtifact(
    bucket,
    project.dir_name,
    ARTIFACT_PLAN,
    docs.plan_markdown,
    "text/markdown; charset=utf-8"
  );
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
  project: TpProjectPipelineRow
): Promise<{ message: string; passed: boolean }> {
  const requirements =
    (await getArtifact(bucket, project.dir_name, ARTIFACT_REQUIREMENTS)) ?? "";
  const plan = (await getArtifact(bucket, project.dir_name, ARTIFACT_PLAN)) ?? "";
  const review = await runFlashReview(env, requirements, plan);
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
  project: TpProjectPipelineRow
): Promise<{ message: string; htmlUpdated: boolean }> {
  if (project.implement_attempts >= MAX_IMPLEMENT_ATTEMPTS) {
    throw new Error("実装の再試行上限に達しました");
  }

  const requirements =
    (await getArtifact(bucket, project.dir_name, ARTIFACT_REQUIREMENTS)) ?? "";
  const plan = (await getArtifact(bucket, project.dir_name, ARTIFACT_PLAN)) ?? "";
  const impl = await runFlashImplement(env, requirements, plan, project.title);

  await putArtifact(
    bucket,
    project.dir_name,
    ARTIFACT_INDEX,
    impl.index_html,
    "text/html; charset=utf-8"
  );
  await bucket.put(
    `${project.r2_prefix}index.html`,
    impl.index_html,
    { httpMetadata: { contentType: "text/html; charset=utf-8" } }
  );

  await insertMessage(db, project.id, "assistant", impl.assistant_message);
  await patchProject(db, project.id, {
    workflow_phase: "draft_ready",
    implement_attempts: project.implement_attempts + 1,
    awaiting_implement_confirm: 0,
  });

  return { message: impl.assistant_message, htmlUpdated: true };
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
  }
): Promise<GeminiChatResult | null> {
  const project = await loadPipelineProject(db, userId, projectId);
  if (!project) return null;

  let userText = (input.message ?? "").trim();
  const pendingForm = parsePendingForm(project.pending_form_json);

  if (input.form_responses && pendingForm) {
    userText = formatFormResponses(pendingForm, input.form_responses);
  }

  let current = await loadPipelineProject(db, userId, projectId);
  if (!current) return null;

  const implementStartTrigger =
    userText === "実装開始" ||
    (current.awaiting_implement_confirm === 1 &&
      (userText === "実装開始" ||
        userText === "implement_now" ||
        userText.includes("実装して") ||
        userText.trim() === "実装"));

  const gateBuildTrigger = wantsGateBuildDocs(
    userText,
    current.workflow_phase
  );

  if (userText && !implementStartTrigger) {
    await assertDailyTurnLimit(db, userId);
    await insertMessage(db, projectId, "user", userText);
  }

  let htmlUpdated = false;
  let reviewSummary: string | null = null;

  // 実装確認トリガー（ゲートの「実装に進む」とは別）
  if (implementStartTrigger) {
    await patchProject(db, projectId, { workflow_phase: "flash_implement" });
    current = (await loadPipelineProject(db, userId, projectId))!;
    const impl = await flashImplementPhase(env, db, bucket, current);
    htmlUpdated = impl.htmlUpdated;
  }

  // ゲート: 深掘り / 実装
  if (wantsDeepenRequirements(userText)) {
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
    await writeDocsPhase(env, db, bucket, current);
  }

  current = (await loadPipelineProject(db, userId, projectId))!;
  const phase = current.workflow_phase;

  // 自動フェーズ処理
  if (phase === "write_req_and_plan") {
    await writeDocsPhase(env, db, bucket, current);
  }

  current = (await loadPipelineProject(db, userId, projectId))!;
  if (current.workflow_phase === "flash_review") {
    const r = await flashReviewPhase(env, db, bucket, current);
    reviewSummary = r.message;
    current = (await loadPipelineProject(db, userId, projectId))!;
    if (r.passed && current.workflow_phase === "flash_implement") {
      const impl = await flashImplementPhase(env, db, bucket, current);
      htmlUpdated = impl.htmlUpdated;
    }
  }

  current = (await loadPipelineProject(db, userId, projectId))!;
  if (current.workflow_phase === "flash_revise_plan") {
    await patchProject(db, projectId, { workflow_phase: "flash_review" });
    current = (await loadPipelineProject(db, userId, projectId))!;
    const r = await flashReviewPhase(env, db, bucket, current);
    reviewSummary = r.message;
  }

  current = (await loadPipelineProject(db, userId, projectId))!;
  if (
    current.workflow_phase === "flash_implement" &&
    !htmlUpdated &&
    userText &&
    !implementStartTrigger
  ) {
    const impl = await flashImplementPhase(env, db, bucket, current);
    htmlUpdated = impl.htmlUpdated;
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
    !wantsGateBuildDocs(userText, current.workflow_phase) &&
    !wantsDeepenRequirements(userText)
  ) {
    const messages = await listMessages(db, projectId);
    const turn = await runLiteTurn(env, current, userText, messages);
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
      await writeDocsPhase(env, db, bucket, current);
    }
  }

  const finalProject = await loadPipelineProject(db, userId, projectId);
  if (!finalProject) return null;

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
