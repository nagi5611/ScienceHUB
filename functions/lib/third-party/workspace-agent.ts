/**
 * サードパーティ — 実装後ワークスペースエージェント（Flash ツールループ）
 */

import type { Env } from "../types";
import { geminiGenerateJson, geminiGenerateText } from "../gemini/generate";
import { ARTIFACT_INDEX, getArtifact } from "./artifacts";
import { FLASH_MAINTAIN_PATCH_SYSTEM, FLASH_MAINTAIN_SYSTEM } from "./prompts";
import {
  MAINTAIN_AGENT_STEP_SCHEMA,
  type MaintainAgentStep,
  type MaintainAgentAction,
} from "./schemas";
import { analyzeIndexHtml, formatAnalyzeReport } from "./static-analyze";
import {
  applyWorkspaceEdits,
  formatNumberedLines,
  normalizeWorkspaceEdits,
  previewEditContext,
  summarizeEdits,
} from "./workspace-edits";
import { planMaintainEdits, isCompleteIndexHtml } from "./implement-tasks";
import { tpAgentGeminiOptions } from "./agent-registry";
import {
  grepWorkspace,
  listWorkspaceFiles,
  readWorkspaceFile,
  writeWorkspaceIndexHtml,
} from "./workspace";
import { recordHtmlRevision } from "./revisions";

const DEFAULT_MAX_MAINTAIN_TOOL_ROUNDS = 6;
const MAX_MAINTAIN_ATTEMPTS = 10;
const MAX_PATCH_OUTPUT_TOKENS = 24576;

function resolveMaxMaintainToolRounds(env: Env): number {
  const parsed = Number.parseInt(env.TP_MAX_MAINTAIN_TOOL_ROUNDS ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_MAX_MAINTAIN_TOOL_ROUNDS;
  }
  return Math.min(12, parsed);
}

export interface MaintainProjectContext {
  id: string;
  title: string;
  r2_prefix: string;
  dir_name: string;
  context_summary: string | null;
  maintain_attempts: number;
}

export interface MaintainTurnResult {
  assistantMessage: string;
  htmlUpdated: boolean;
  workflowPhase: "draft_ready" | "app_maintain";
}

export interface MaintainAgentCallbacks {
  onActivity?: (label: string) => void;
}

const MAX_EDIT_FAILURES_BEFORE_PATCH = 2;

function isMaintainAction(value: string): MaintainAgentAction | null {
  const actions: MaintainAgentAction[] = [
    "list",
    "read",
    "grep",
    "analyze",
    "apply_edits",
    "patch_html",
    "reply",
  ];
  return actions.includes(value as MaintainAgentAction)
    ? (value as MaintainAgentAction)
    : null;
}

async function recordMaintainRevision(
  db: D1Database,
  bucket: R2Bucket,
  project: MaintainProjectContext,
  html: string,
  summary: string
): Promise<void> {
  await recordHtmlRevision(
    db,
    bucket,
    {
      id: project.id,
      dir_name: project.dir_name,
      r2_prefix: project.r2_prefix,
    },
    html,
    summary.slice(0, 200) || "メンテ修正"
  );
}

/** ツール実行結果をテキスト化 */
async function executeMaintainAction(
  db: D1Database,
  bucket: R2Bucket,
  project: MaintainProjectContext,
  step: MaintainAgentStep
): Promise<{ result: string; htmlUpdated?: boolean; phase?: "draft_ready" }> {
  const action = isMaintainAction(step.action);
  if (!action) {
    return { result: `不明な action: ${step.action}` };
  }

  switch (action) {
    case "list": {
      const files = await listWorkspaceFiles(bucket, project.dir_name);
      const lines = files.map(
        (f) =>
          `${f.path}: ${f.exists ? `${f.size_bytes ?? 0} bytes` : "なし"}`
      );
      return { result: lines.join("\n") };
    }
    case "read": {
      if (!step.path) return { result: "path が必要です" };
      const out = await readWorkspaceFile(bucket, project.dir_name, step.path, {
        startLine: step.line_start,
        endLine: step.line_end,
      });
      if ("error" in out) return { result: out.error };
      return {
        result: `行 ${out.start_line}-${out.end_line} / 全 ${out.total_lines} 行${
          out.truncated ? "（truncated）" : ""
        }\n${out.content}`,
      };
    }
    case "grep": {
      if (!step.pattern?.trim()) return { result: "pattern が必要です" };
      const out = await grepWorkspace(
        bucket,
        project.dir_name,
        step.pattern,
        { paths: step.path ? [step.path] : undefined }
      );
      if (out.error) return { result: out.error };
      if (!out.matches.length) return { result: "一致なし" };
      return {
        result: out.matches
          .map((m) => `${m.path}:${m.line_number} ${m.line_text}`)
          .join("\n"),
      };
    }
    case "analyze": {
      const html =
        (await getArtifact(bucket, project.dir_name, ARTIFACT_INDEX)) ?? "";
      if (!html.trim()) return { result: "index.html が空です" };
      const report = analyzeIndexHtml(html);
      return { result: formatAnalyzeReport(report) };
    }
    case "apply_edits": {
      if (project.maintain_attempts >= MAX_MAINTAIN_ATTEMPTS) {
        return { result: "メンテナンス修正の上限に達しました" };
      }
      const rawEdits = step.edits;
      const edits =
        rawEdits && rawEdits.length > 0
          ? normalizeWorkspaceEdits(rawEdits)
          : null;
      if (!edits?.length) {
        return { result: "apply_edits には edits が必要です（空の場合はサーバー側で計画生成）" };
      }
      const current =
        (await getArtifact(bucket, project.dir_name, ARTIFACT_INDEX)) ?? "";
      if (!current.trim()) {
        return { result: "index.html が空です" };
      }
      const applied = applyWorkspaceEdits(current, edits);
      if (!applied.ok) {
        return { result: applied.error };
      }
      if (!isCompleteIndexHtml(applied.text)) {
        return {
          result:
            "編集後の HTML が不完全です。行番号と範囲を見直してください。",
        };
      }
      await writeWorkspaceIndexHtml(
        bucket,
        project.dir_name,
        project.r2_prefix,
        applied.text
      );
      await recordMaintainRevision(
        db,
        bucket,
        project,
        applied.text,
        step.assistant_message.slice(0, 200) || summarizeEdits(edits)
      );
      return {
        result: `index.html を更新しました（${summarizeEdits(edits)}）`,
        htmlUpdated: true,
        phase: "draft_ready",
      };
    }
    case "patch_html": {
      if (project.maintain_attempts >= MAX_MAINTAIN_ATTEMPTS) {
        return { result: "メンテナンス修正の上限に達しました" };
      }
      const html = step.index_html?.trim();
      if (!html) return { result: "index_html が空です" };
      if (!isCompleteIndexHtml(html)) {
        return {
          result:
            "index.html が不完全です。apply_edits で行単位修正を試してください。",
        };
      }
      await writeWorkspaceIndexHtml(
        bucket,
        project.dir_name,
        project.r2_prefix,
        html
      );
      await recordMaintainRevision(
        db,
        bucket,
        project,
        html,
        step.assistant_message.slice(0, 200) || "HTML 全文更新"
      );
      return {
        result: "index.html を更新しました",
        htmlUpdated: true,
        phase: "draft_ready",
      };
    }
    case "reply":
      return { result: "ユーザーへ説明を返しました" };
    default:
      return { result: "未対応の action" };
  }
}

/** 実装後の不具合・要望メッセージか */
export function wantsMaintainUserReport(text: string, phase: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.startsWith("【フォーム回答】")) return false;
  if (phase === "app_maintain") return true;
  if (phase !== "draft_ready" && phase !== "app_maintain_done") return false;
  if (
    wantsGateBuildPhrase(t) ||
    t === "実装開始" ||
    t.includes("要件を深掘り")
  ) {
    return false;
  }
  const hints = [
    "動かない",
    "動作しない",
    "バグ",
    "直して",
    "修正",
    "おかしい",
    "エラー",
    "表示されない",
    "消えない",
    "クリア",
    "できない",
    "不具合",
    "要望",
    "追加して",
    "改善",
  ];
  return hints.some((h) => t.includes(h)) || t.length >= 4;
}

function wantsGateBuildPhrase(t: string): boolean {
  return t.includes("実装に進む") || t === "write_docs";
}

/** チャットに HTML 全文が流れないよう assistant_message を整形 */
function sanitizeMaintainAssistantMessage(
  message: string,
  htmlUpdated: boolean
): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return htmlUpdated
      ? "index.html を更新しました。プレビューまたは Files で確認してください。"
      : "対応しました。";
  }
  if (
    /<!DOCTYPE\s+html/i.test(trimmed) ||
    /修正後の\s*index\.html/i.test(trimmed) ||
    (trimmed.includes("<html") && trimmed.includes("</style>"))
  ) {
    return htmlUpdated
      ? "index.html を更新しました。プレビューまたは Files タブで内容を確認してください。"
      : "調査を進めました。続きの修正が必要な場合は、もう一度短く指示を送ってください。";
  }
  if (trimmed.length > 2400) {
    return `${trimmed.slice(0, 600)}…\n\n（説明を省略しました。変更はプレビュー / Files の index.html で確認できます。）`;
  }
  return trimmed;
}

/** patch_html 用: 巨大 HTML は JSON ではなくプレーンテキストで生成 */
async function generatePatchedIndexHtml(
  env: Env,
  bucket: R2Bucket,
  project: MaintainProjectContext,
  userReport: string,
  toolLog: string[],
  changeSummary: string
): Promise<string> {
  const currentHtml =
    (await getArtifact(bucket, project.dir_name, ARTIFACT_INDEX)) ?? "";

  const prompt = `--- 現在の index.html ---
${currentHtml}

--- 指示 ---
アプリ名: ${project.title}
ユーザー要望: ${userReport}
変更の意図: ${changeSummary || "ユーザー要望どおり修正"}

調査ログ:
${toolLog.length ? toolLog.join("\n\n") : "（なし）"}

上記に基づき、修正後の完全な HTML ドキュメントのみを出力してください。`;

  let text = await geminiGenerateText(env, {
    systemInstruction: FLASH_MAINTAIN_PATCH_SYSTEM,
    prompt,
    maxOutputTokens: MAX_PATCH_OUTPUT_TOKENS,
    responseMimeType: "text/plain",
    ...tpAgentGeminiOptions(env, "code_patch", { background: true }),
  });
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

/** Flash ワークスペースエージェント 1 ターン */
export async function runMaintainAgentTurn(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: MaintainProjectContext,
  userReport: string,
  recentChat: string,
  callbacks?: MaintainAgentCallbacks
): Promise<MaintainTurnResult> {
  const toolLog: string[] = [];
  let htmlUpdated = false;
  let finalPhase: "draft_ready" | "app_maintain" = "app_maintain";
  let lastAssistant = "";
  let editFailures = 0;
  const maxToolRounds = resolveMaxMaintainToolRounds(env);

  for (let round = 0; round < maxToolRounds; round++) {
    const prompt = `アプリ名: ${project.title}
ユーザー報告:
${userReport}

要点:
${project.context_summary || "（なし）"}

直近の会話:
${recentChat}

ツール実行履歴:
${toolLog.length ? toolLog.join("\n\n") : "（まだなし）"}

次の 1 ステップの action を JSON で返してください。`;

    let step: MaintainAgentStep;
    try {
      step = await geminiGenerateJson<MaintainAgentStep>(env, {
        systemInstruction: FLASH_MAINTAIN_SYSTEM,
        prompt,
        maxOutputTokens: 4096,
        ...tpAgentGeminiOptions(env, "maintain_step"),
        responseSchema: MAINTAIN_AGENT_STEP_SCHEMA as unknown as Record<
          string,
          unknown
        >,
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "AI の応答を解釈できませんでした";
      lastAssistant = `申し訳ありません。${msg} もう一度短い文で指示を送ってください。`;
      break;
    }

    lastAssistant = step.assistant_message?.trim() || "対応しました。";
    const action = isMaintainAction(step.action);

    if (action === "reply") {
      finalPhase = "app_maintain";
      lastAssistant = sanitizeMaintainAssistantMessage(lastAssistant, htmlUpdated);
      break;
    }

    if (action === "apply_edits") {
      callbacks?.onActivity?.("行単位で index.html を修正中…");
      let edits = normalizeWorkspaceEdits(step.edits);
      let assistantMsg =
        step.assistant_message?.trim() || "index.html を更新しました。";

      if (!edits?.length) {
        const current =
          (await getArtifact(bucket, project.dir_name, ARTIFACT_INDEX)) ?? "";
        if (!current.trim()) {
          toolLog.push("[apply_edits] index.html が空です");
          lastAssistant = "index.html が見つかりません。";
          continue;
        }
        callbacks?.onActivity?.("編集プランを作成中…");
        try {
          const plan = await planMaintainEdits(
            env,
            formatNumberedLines(current),
            userReport,
            toolLog,
            step.assistant_message,
            project.title
          );
          edits = normalizeWorkspaceEdits(plan.edits);
          assistantMsg =
            plan.assistant_message?.trim() || assistantMsg;
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : "編集プランの生成に失敗";
          toolLog.push(`[apply_edits plan] ${msg}`);
          editFailures++;
          lastAssistant = `編集プランの作成に失敗しました（${msg}）。`;
          continue;
        }
      }

      if (!edits?.length) {
        editFailures++;
        toolLog.push("[apply_edits] edits が空です");
        continue;
      }

      callbacks?.onActivity?.(summarizeEdits(edits));
      const editStep: MaintainAgentStep = {
        ...step,
        action: "apply_edits",
        edits: edits as MaintainAgentStep["edits"],
        assistant_message: assistantMsg,
      };
      const exec = await executeMaintainAction(
        db,
        bucket,
        project,
        editStep
      );
      toolLog.push(`[apply_edits] ${exec.result}`);

      if (exec.htmlUpdated) {
        htmlUpdated = true;
        finalPhase = "draft_ready";
        lastAssistant = sanitizeMaintainAssistantMessage(assistantMsg, true);
        await db
          .prepare(
            "UPDATE tp_projects SET maintain_attempts = maintain_attempts + 1 WHERE id = ?"
          )
          .bind(project.id)
          .run();
        break;
      }

      editFailures++;
      const current =
        (await getArtifact(bucket, project.dir_name, ARTIFACT_INDEX)) ?? "";
      if (edits[0] && "start_line" in edits[0]) {
        const first = edits[0];
        if (first.op === "replace_lines" || first.op === "delete_lines") {
          toolLog.push(
            `[apply_edits context]\n${previewEditContext(
              current,
              first.start_line,
              first.end_line
            )}`
          );
        }
      }
      continue;
    }

    if (action === "patch_html") {
      if (editFailures < MAX_EDIT_FAILURES_BEFORE_PATCH) {
        toolLog.push(
          "[patch_html] apply_edits を優先してください（行単位修正）"
        );
        continue;
      }
      callbacks?.onActivity?.("全文再生成（フォールバック）…");
      let patchStep = step;
      try {
        const html = await generatePatchedIndexHtml(
          env,
          bucket,
          project,
          userReport,
          toolLog,
          step.assistant_message
        );
        patchStep = { ...step, index_html: html };
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : "HTML の生成に失敗しました";
        toolLog.push(`[patch_html generate] ${msg}`);
        lastAssistant = `修正用 HTML の生成に失敗しました（${msg}）。もう一度お試しください。`;
        continue;
      }
      const exec = await executeMaintainAction(db, bucket, project, patchStep);
      toolLog.push(`[patch_html] ${exec.result}`);
      if (exec.htmlUpdated) {
        htmlUpdated = true;
        finalPhase = "draft_ready";
        lastAssistant = sanitizeMaintainAssistantMessage(
          step.assistant_message || "index.html を更新しました。",
          true
        );
        await db
          .prepare(
            "UPDATE tp_projects SET maintain_attempts = maintain_attempts + 1 WHERE id = ?"
          )
          .bind(project.id)
          .run();
      } else if (!exec.result.includes("更新しました")) {
        toolLog.push(`[patch_html retry hint] ${exec.result}`);
      }
      if (htmlUpdated) break;
      continue;
    }

    if (!action) {
      toolLog.push(`[error] 不明な action ${step.action}`);
      break;
    }

    const exec = await executeMaintainAction(db, bucket, project, step);
    toolLog.push(`[${action}] ${exec.result}`);

    if (round === maxToolRounds - 1) {
      lastAssistant = sanitizeMaintainAssistantMessage(lastAssistant, htmlUpdated);
      lastAssistant = `${lastAssistant}\n\n（自動調査の上限に達しました。「バックスペースで一桁削除」「Cキーでクリア」のように、やりたいことを1文で送ると修正しやすいです。）`;
    }
  }

  return {
    assistantMessage: sanitizeMaintainAssistantMessage(lastAssistant, htmlUpdated),
    htmlUpdated,
    workflowPhase: finalPhase,
  };
}