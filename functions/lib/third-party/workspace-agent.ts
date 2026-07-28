/**
 * サードパーティ — 実装後ワークスペースエージェント（Flash ツールループ）
 */

import type { Env } from "../types";
import { createId, now } from "../types";
import { geminiGenerateJson } from "../gemini/generate";
import { ARTIFACT_INDEX, getArtifact } from "./artifacts";
import { FLASH_MAINTAIN_SYSTEM } from "./prompts";
import {
  MAINTAIN_AGENT_STEP_SCHEMA,
  type MaintainAgentStep,
  type MaintainAgentAction,
} from "./schemas";
import { analyzeIndexHtml, formatAnalyzeReport } from "./static-analyze";
import {
  grepWorkspace,
  listWorkspaceFiles,
  readWorkspaceFile,
  writeWorkspaceIndexHtml,
} from "./workspace";

const MAX_MAINTAIN_TOOL_ROUNDS = 6;
const MAX_MAINTAIN_ATTEMPTS = 10;

const DEFAULT_FLASH_MODEL = "gemini-2.5-flash";

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

function flashModel(env: Env): string {
  return env.GEMINI_TP_FLASH_MODEL?.trim() || DEFAULT_FLASH_MODEL;
}

function isMaintainAction(value: string): MaintainAgentAction | null {
  const actions: MaintainAgentAction[] = [
    "list",
    "read",
    "grep",
    "analyze",
    "patch_html",
    "reply",
  ];
  return actions.includes(value as MaintainAgentAction)
    ? (value as MaintainAgentAction)
    : null;
}

async function recordRevision(
  db: D1Database,
  projectId: string,
  summary: string
): Promise<void> {
  const max = await db
    .prepare(
      "SELECT COALESCE(MAX(revision_number), 0) AS n FROM tp_revisions WHERE project_id = ?"
    )
    .bind(projectId)
    .first<{ n: number }>();
  const num = (max?.n ?? 0) + 1;
  await db
    .prepare(
      `INSERT INTO tp_revisions (id, project_id, revision_number, summary, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(createId("tpver"), projectId, num, summary.slice(0, 200), now())
    .run();
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
    case "patch_html": {
      if (project.maintain_attempts >= MAX_MAINTAIN_ATTEMPTS) {
        return { result: "メンテナンス修正の上限に達しました" };
      }
      const html = step.index_html?.trim();
      if (!html) return { result: "index_html が空です" };
      await writeWorkspaceIndexHtml(
        bucket,
        project.dir_name,
        project.r2_prefix,
        html
      );
      await recordRevision(
        db,
        project.id,
        step.assistant_message.slice(0, 200) || "メンテ修正"
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

/** Flash ワークスペースエージェント 1 ターン */
export async function runMaintainAgentTurn(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: MaintainProjectContext,
  userReport: string,
  recentChat: string
): Promise<MaintainTurnResult> {
  const toolLog: string[] = [];
  let htmlUpdated = false;
  let finalPhase: "draft_ready" | "app_maintain" = "app_maintain";
  let lastAssistant = "";

  for (let round = 0; round < MAX_MAINTAIN_TOOL_ROUNDS; round++) {
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

    const step = await geminiGenerateJson<MaintainAgentStep>(env, {
      model: flashModel(env),
      systemInstruction: FLASH_MAINTAIN_SYSTEM,
      prompt,
      temperature: 0.2,
      maxOutputTokens: 16384,
      responseSchema: MAINTAIN_AGENT_STEP_SCHEMA as unknown as Record<
        string,
        unknown
      >,
    });

    lastAssistant = step.assistant_message?.trim() || "対応しました。";
    const action = isMaintainAction(step.action);

    if (action === "reply") {
      finalPhase = "app_maintain";
      break;
    }

    if (action === "patch_html") {
      const exec = await executeMaintainAction(db, bucket, project, step);
      toolLog.push(`[patch_html] ${exec.result}`);
      if (exec.htmlUpdated) {
        htmlUpdated = true;
        finalPhase = "draft_ready";
        await db
          .prepare(
            "UPDATE tp_projects SET maintain_attempts = maintain_attempts + 1 WHERE id = ?"
          )
          .bind(project.id)
          .run();
      }
      break;
    }

    if (!action) {
      toolLog.push(`[error] 不明な action ${step.action}`);
      break;
    }

    const exec = await executeMaintainAction(db, bucket, project, step);
    toolLog.push(`[${action}] ${exec.result}`);

    if (round === MAX_MAINTAIN_TOOL_ROUNDS - 1) {
      lastAssistant =
        `${lastAssistant}\n\n（自動調査の上限に達しました。引き続き状況を教えてください。）`;
    }
  }

  return {
    assistantMessage: lastAssistant,
    htmlUpdated,
    workflowPhase: finalPhase,
  };
}