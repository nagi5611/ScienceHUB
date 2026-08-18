/**
 * サードパーティ — Ask モード（コード編集なしの Q&A）
 */

import type { Env } from "../types";
import { geminiGenerateTextStream } from "../gemini/generate";
import {
  ARTIFACT_INDEX,
  ARTIFACT_PLAN,
  ARTIFACT_REQUIREMENTS,
  getArtifact,
} from "./artifacts";
import { TP_ASK_SYSTEM } from "./prompts";
import { tpAgentGeminiOptions } from "./agent-registry";
import { withTpUsageRecording } from "./gemini-usage";
import { formatNumberedLines } from "./workspace-edits";

export interface AskTurnProjectContext {
  id: string;
  owner_user_id: string;
  workflow_phase: string;
  title: string;
  dir_name: string;
  context_summary: string | null;
}

const MAX_INDEX_LINES = 80;
const MAX_DOC_CHARS = 3500;

function recentChatBlock(
  messages: Array<{ role: string; content: string }>,
  max = 12
): string {
  const slice = messages.slice(-max);
  return slice
    .map((m) => `${m.role === "user" ? "ユーザー" : "アシスタント"}: ${m.content}`)
    .join("\n");
}

function truncateDoc(text: string, label: string): string {
  const t = text.trim();
  if (!t) return `（${label} なし）`;
  if (t.length <= MAX_DOC_CHARS) return t;
  return `${t.slice(0, MAX_DOC_CHARS)}…（${label} は省略）`;
}

function buildAskPrompt(
  project: AskTurnProjectContext,
  userInput: string,
  messages: Array<{ role: string; content: string }>,
  requirements: string,
  plan: string,
  indexContext: string
): string {
  return `ワークフロー phase: ${project.workflow_phase}
アプリ名: ${project.title}

これまでの要点:
${project.context_summary || "（未整理）"}

--- 要件定義書（抜粋） ---
${truncateDoc(requirements, "要件定義書")}

--- 実装計画書（抜粋） ---
${truncateDoc(plan, "実装計画書")}

--- index.html（行番号付き・参照のみ） ---
${indexContext}

直近の会話:
${recentChatBlock(messages)}

ユーザーの質問:
${userInput}`;
}

async function loadAskIndexContext(
  bucket: R2Bucket,
  dirName: string
): Promise<string> {
  const html = (await getArtifact(bucket, dirName, ARTIFACT_INDEX)) ?? "";
  if (!html.trim()) return "（index.html 未作成）";
  const lines = html.split("\n");
  const head = lines.slice(0, MAX_INDEX_LINES).join("\n");
  const numbered = formatNumberedLines(head);
  const omitted =
    lines.length > MAX_INDEX_LINES
      ? `\n… 全 ${lines.length} 行（先頭 ${MAX_INDEX_LINES} 行のみ）`
      : "";
  return `${numbered}${omitted}`;
}

/** Ask モード 1 ターン（ストリーミング） */
export async function runTpAskTurnStream(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: AskTurnProjectContext,
  userInput: string,
  messages: Array<{ role: string; content: string }>,
  onDelta?: (text: string) => void
): Promise<string> {
  const requirements =
    (await getArtifact(bucket, project.dir_name, ARTIFACT_REQUIREMENTS)) ?? "";
  const plan =
    (await getArtifact(bucket, project.dir_name, ARTIFACT_PLAN)) ?? "";
  const indexContext = await loadAskIndexContext(bucket, project.dir_name);
  const prompt = buildAskPrompt(
    project,
    userInput,
    messages,
    requirements,
    plan,
    indexContext
  );

  const result = await geminiGenerateTextStream(
    env,
    withTpUsageRecording(db, {
      projectId: project.id,
      ownerUserId: project.owner_user_id,
    }, {
      systemInstruction: TP_ASK_SYSTEM,
      prompt,
      maxOutputTokens: 4096,
      responseMimeType: "text/plain",
      ...tpAgentGeminiOptions(env, "ask"),
    }),
    (delta) => onDelta?.(delta)
  );

  const msg = result.text.trim();
  if (!msg) {
    return "回答を生成できませんでした。もう一度質問を送ってください。";
  }
  return msg;
}

/** Ask モード 1 ターン（非ストリーム互換） */
export async function runTpAskTurn(
  env: Env,
  db: D1Database,
  bucket: R2Bucket,
  project: AskTurnProjectContext,
  userInput: string,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  return await runTpAskTurnStream(
    env,
    db,
    bucket,
    project,
    userInput,
    messages
  );
}
