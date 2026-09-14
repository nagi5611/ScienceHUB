/**
 * Runa — コンテキスト使用量の推定
 */

import type { Env } from "../types";
import type { ChatMessage, ToolDefinition } from "./openai";

const DEFAULT_CONTEXT_WINDOW_TOKENS = 128_000;
const DEFAULT_SUMMARIZE_THRESHOLD_PERCENT = 85;
const DEFAULT_ACCURACY_WARNING_PERCENT = 50;

export interface ContextUsageInfo {
  usedTokens: number;
  limitTokens: number;
  percent: number;
  accuracyWarningPercent: number;
  isAccuracyDegrading: boolean;
  summarizeThresholdPercent: number;
  shouldSummarize: boolean;
}

/** モデルコンテキスト上限（トークン） */
export function resolveContextWindowTokens(env: Env): number {
  const parsed = Number.parseInt(env.RUNA_CONTEXT_WINDOW_TOKENS?.trim() ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_CONTEXT_WINDOW_TOKENS;
}

/** 自動サマリー開始しきい値（%） */
export function resolveSummarizeThresholdPercent(env: Env): number {
  const parsed = Number.parseInt(
    env.RUNA_CONTEXT_SUMMARIZE_THRESHOLD?.trim() ?? "",
    10
  );
  if (!Number.isFinite(parsed) || parsed < 50 || parsed > 98) {
    return DEFAULT_SUMMARIZE_THRESHOLD_PERCENT;
  }
  return parsed;
}

/** 精度低下警告しきい値（%） */
export function resolveAccuracyWarningPercent(env: Env): number {
  const parsed = Number.parseInt(
    env.RUNA_CONTEXT_ACCURACY_WARNING?.trim() ?? "",
    10
  );
  if (!Number.isFinite(parsed) || parsed < 20 || parsed > 80) {
    return DEFAULT_ACCURACY_WARNING_PERCENT;
  }
  return parsed;
}

/** テキストのトークン数を粗推定（日英混在向け） */
export function estimateTextTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 2.5);
}

/** メッセージ配列のトークン数を粗推定 */
export function estimateChatMessagesTokens(messages: ChatMessage[]): number {
  let total = 0;
  for (const message of messages) {
    total += 4;
    total += estimateTextTokens(message.content ?? "");
    if (message.images?.length) {
      total += message.images.length * 800;
    }
    if (message.tool_calls?.length) {
      for (const call of message.tool_calls) {
        total += estimateTextTokens(
          `${call.function.name}\n${call.function.arguments}`
        );
      }
    }
    if (message.tool_call_id) total += 8;
  }
  return total;
}

/** ツール定義 JSON のトークン数を粗推定 */
export function estimateToolsTokens(tools: ToolDefinition[]): number {
  if (!tools.length) return 0;
  return estimateTextTokens(JSON.stringify(tools));
}

/** コンテキスト使用量を算出 */
export function computeContextUsage(
  messages: ChatMessage[],
  tools: ToolDefinition[],
  env: Env
): ContextUsageInfo {
  const limitTokens = resolveContextWindowTokens(env);
  const summarizeThresholdPercent = resolveSummarizeThresholdPercent(env);
  const accuracyWarningPercent = resolveAccuracyWarningPercent(env);
  const usedTokens =
    estimateChatMessagesTokens(messages) + estimateToolsTokens(tools);
  const percent =
    limitTokens > 0
      ? Math.min(100, Math.round((usedTokens / limitTokens) * 1000) / 10)
      : 0;
  const isAccuracyDegrading = percent >= accuracyWarningPercent;
  return {
    usedTokens,
    limitTokens,
    percent,
    accuracyWarningPercent,
    isAccuracyDegrading,
    summarizeThresholdPercent,
    shouldSummarize: percent >= summarizeThresholdPercent,
  };
}
