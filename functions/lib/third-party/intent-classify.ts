/**
 * サードパーティ — 実装後フェーズのユーザー意図分類（Lite）
 */

import type { Env } from "../types";
import { geminiGenerateJson } from "../gemini/generate";
import { LITE_INTENT_SYSTEM } from "./prompts";
import {
  INTENT_CLASSIFY_SCHEMA,
  type IntentClassifyResult,
  type TpChatMode,
  type TpUserIntent,
} from "./schemas";
import { tpAgentGeminiOptions } from "./agent-registry";
import { withTpUsageRecording, type TpGeminiUsageContext } from "./gemini-usage";

const VALID_INTENTS: TpUserIntent[] = [
  "maintain",
  "ask",
  "gate_build",
  "gate_deepen",
  "general_chat",
  "implement_start",
];

function isValidIntent(value: string): TpUserIntent | null {
  return VALID_INTENTS.includes(value as TpUserIntent)
    ? (value as TpUserIntent)
    : null;
}

/** ルールベースの意図判定（LLM 不要・フォールバック） */
export function classifyIntentByRules(
  userText: string,
  phase: string
): TpUserIntent | null {
  const t = userText.trim();
  if (!t) return null;
  if (t.startsWith("【フォーム回答】")) return null;
  if (phase === "app_maintain") return "maintain";
  if (t === "実装開始" || t === "implement_now") return "implement_start";
  if (t.includes("実装に進む") || t === "write_docs") return "gate_build";
  if (t.includes("要件を深掘り") || t === "deepen") return "gate_deepen";

  const maintainHints = [
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
  if (maintainHints.some((h) => t.includes(h))) return "maintain";

  const askHints = ["?", "？", "どう", "なぜ", "教えて", "説明"];
  if (askHints.some((h) => t.includes(h))) return "ask";

  return null;
}

/** Lite モデルで意図分類 */
export async function runTpIntentClassify(
  env: Env,
  db: D1Database | null,
  input: {
    phase: string;
    userText: string;
    chatMode: TpChatMode;
    contextSummary?: string | null;
    usage?: TpGeminiUsageContext;
  }
): Promise<IntentClassifyResult> {
  const rule = classifyIntentByRules(input.userText, input.phase);
  if (rule) {
    return { intent: rule, confidence: 1, reason: "rule" };
  }

  const userBlock = [
    `workflow_phase: ${input.phase}`,
    `chat_mode: ${input.chatMode}`,
    input.contextSummary
      ? `context_summary: ${input.contextSummary.slice(0, 800)}`
      : "",
    `user_message: ${input.userText}`,
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await geminiGenerateJson<IntentClassifyResult>(
    env,
    withTpUsageRecording(db, input.usage ?? {}, {
      systemInstruction: LITE_INTENT_SYSTEM,
      prompt: userBlock,
      responseSchema: INTENT_CLASSIFY_SCHEMA,
      ...tpAgentGeminiOptions(env, "intent_classifier"),
    })
  );

  const intent = isValidIntent(raw.intent) ?? "general_chat";
  return {
    intent,
    confidence: Math.min(1, Math.max(0, Number(raw.confidence) || 0.5)),
    reason: raw.reason?.slice(0, 200) ?? "",
  };
}
