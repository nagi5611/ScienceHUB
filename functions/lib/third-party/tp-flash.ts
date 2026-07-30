/**
 * サードパーティ Gemini モデル・呼び出しプロファイル
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash
 * @see https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.5
 */

import type { Env } from "../types";
import type {
  GeminiGenerateOptions,
  GeminiServiceTier,
  GeminiThinkingLevel,
} from "../gemini/generate";

/** 未設定時の Lite モデル（GEMINI_TP_LITE_MODEL で上書き可） */
export const DEFAULT_TP_LITE_MODEL = "gemini-3.1-flash-lite";

/** 未設定時の Flash モデル（GEMINI_TP_FLASH_MODEL で上書き可） */
export const DEFAULT_TP_FLASH_MODEL = "gemini-3.5-flash";

export function resolveTpLiteModel(env: Env): string {
  return env.GEMINI_TP_LITE_MODEL?.trim() || DEFAULT_TP_LITE_MODEL;
}

export function resolveTpFlashModel(env: Env): string {
  return env.GEMINI_TP_FLASH_MODEL?.trim() || DEFAULT_TP_FLASH_MODEL;
}

export function isTpGemini3Model(model: string): boolean {
  return /gemini-3/i.test(model);
}

/** Lite: 既定 minimal（公式） */
export const TP_LITE_THINKING: GeminiThinkingLevel = "MINIMAL";

/** Flash 編集プラン初回: 3.5 の既定 medium */
export const TP_FLASH_THINKING_EDIT: GeminiThinkingLevel = "MEDIUM";

/** 編集プラン再試行 */
export const TP_FLASH_THINKING_EDIT_RETRY: GeminiThinkingLevel = "HIGH";

/** スニペット生成 */
export const TP_FLASH_THINKING_SNIPPET: GeminiThinkingLevel = "MEDIUM";

/** 全文 patch */
export const TP_FLASH_THINKING_PATCH: GeminiThinkingLevel = "HIGH";

/** メンテのツール 1 ステップ（ツール呼び出し抑制） */
export const TP_FLASH_THINKING_AGENT_STEP: GeminiThinkingLevel = "LOW";

/** 計画レビュー・タスク分解 */
export const TP_FLASH_THINKING_STRUCTURED: GeminiThinkingLevel = "LOW";

/** Ask */
export const TP_FLASH_THINKING_ASK: GeminiThinkingLevel = "LOW";

/** ユーザー待ちの同期チャット（Paid Standard） */
export const TP_INTERACTIVE_SERVICE_TIER: GeminiServiceTier = "STANDARD";

export type TpGeminiProfile =
  | "lite_turn"
  | "lite_docs"
  | "flash_review"
  | "flash_task_plan"
  | "flash_edit_plan"
  | "flash_edit_plan_retry"
  | "flash_snippet"
  | "flash_patch"
  | "flash_agent_step"
  | "flash_ask";

/** プロファイルごとの thinking / tier / ログラベル */
export function tpGeminiProfileOptions(
  profile: TpGeminiProfile
): Pick<
  GeminiGenerateOptions,
  "thinkingLevel" | "serviceTier" | "usageLabel"
> {
  switch (profile) {
    case "lite_turn":
    case "lite_docs":
      return {
        thinkingLevel: TP_LITE_THINKING,
        serviceTier: TP_INTERACTIVE_SERVICE_TIER,
        usageLabel: profile,
      };
    case "flash_review":
    case "flash_task_plan":
      return {
        thinkingLevel: TP_FLASH_THINKING_STRUCTURED,
        serviceTier: TP_INTERACTIVE_SERVICE_TIER,
        usageLabel: profile,
      };
    case "flash_edit_plan":
      return {
        thinkingLevel: TP_FLASH_THINKING_EDIT,
        serviceTier: TP_INTERACTIVE_SERVICE_TIER,
        usageLabel: profile,
      };
    case "flash_edit_plan_retry":
      return {
        thinkingLevel: TP_FLASH_THINKING_EDIT_RETRY,
        serviceTier: TP_INTERACTIVE_SERVICE_TIER,
        usageLabel: profile,
      };
    case "flash_snippet":
      return {
        thinkingLevel: TP_FLASH_THINKING_SNIPPET,
        serviceTier: TP_INTERACTIVE_SERVICE_TIER,
        usageLabel: profile,
      };
    case "flash_patch":
      return {
        thinkingLevel: TP_FLASH_THINKING_PATCH,
        serviceTier: TP_INTERACTIVE_SERVICE_TIER,
        usageLabel: profile,
      };
    case "flash_agent_step":
      return {
        thinkingLevel: TP_FLASH_THINKING_AGENT_STEP,
        serviceTier: TP_INTERACTIVE_SERVICE_TIER,
        usageLabel: profile,
      };
    case "flash_ask":
      return {
        thinkingLevel: TP_FLASH_THINKING_ASK,
        serviceTier: TP_INTERACTIVE_SERVICE_TIER,
        usageLabel: profile,
      };
    default: {
      const _exhaustive: never = profile;
      return _exhaustive;
    }
  }
}
