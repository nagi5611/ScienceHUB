/**
 * サードパーティ Gemini モデル・呼び出しプロファイル
 * @see https://ai.google.dev/gemini-api/docs/models
 * @see https://ai.google.dev/gemini-api/docs/optimization
 */

import type { Env } from "../types";
import type {
  GeminiGenerateOptions,
  GeminiServiceTier,
  GeminiThinkingLevel,
} from "../gemini/generate";

/** 未設定時の Lite モデル（GEMINI_TP_LITE_MODEL で上書き可） */
export const DEFAULT_TP_LITE_MODEL = "gemini-2.5-flash-lite";

/** 未設定時の Flash モデル（GEMINI_TP_FLASH_MODEL で上書き可） */
export const DEFAULT_TP_FLASH_MODEL = "gemini-2.5-flash";

/** 未設定時の High モデル（GEMINI_TP_HIGH_MODEL で上書き可） */
export const DEFAULT_TP_HIGH_MODEL = "gemini-3.5-flash";

export function resolveTpLiteModel(env: Env): string {
  return env.GEMINI_TP_LITE_MODEL?.trim() || DEFAULT_TP_LITE_MODEL;
}

export function resolveTpFlashModel(env: Env): string {
  return env.GEMINI_TP_FLASH_MODEL?.trim() || DEFAULT_TP_FLASH_MODEL;
}

export function resolveTpHighModel(env: Env): string {
  return env.GEMINI_TP_HIGH_MODEL?.trim() || DEFAULT_TP_HIGH_MODEL;
}

export function isTpGemini3Model(model: string): boolean {
  return /gemini-3/i.test(model);
}

/** Lite: 既定 minimal（公式） */
export const TP_LITE_THINKING: GeminiThinkingLevel = "MINIMAL";

/** Flash 編集プラン初回: 3.5 の既定 medium / 2.x は API 側 temperature */
export const TP_FLASH_THINKING_EDIT: GeminiThinkingLevel = "MEDIUM";

/** 編集プラン再試行（High ティア・最終試行） */
export const TP_FLASH_THINKING_EDIT_RETRY: GeminiThinkingLevel = "MEDIUM";

/** スニペット生成 */
export const TP_FLASH_THINKING_SNIPPET: GeminiThinkingLevel = "MEDIUM";

/** 全文 patch（High ティア） */
export const TP_FLASH_THINKING_PATCH: GeminiThinkingLevel = "MEDIUM";

/** メンテのツール 1 ステップ（ツール呼び出し抑制） */
export const TP_FLASH_THINKING_AGENT_STEP: GeminiThinkingLevel = "LOW";

/** 計画レビュー・タスク分解 */
export const TP_FLASH_THINKING_STRUCTURED: GeminiThinkingLevel = "LOW";

/** Ask（Lite ティアへ移行） */
export const TP_LITE_THINKING_ASK: GeminiThinkingLevel = "MINIMAL";

/** ユーザー待ちの同期チャット（Paid Standard） */
export const TP_INTERACTIVE_SERVICE_TIER: GeminiServiceTier = "STANDARD";

/** バックグラウンド実装ジョブ（Flex 50% 割引） */
export const TP_BACKGROUND_SERVICE_TIER: GeminiServiceTier = "FLEX";

export type TpGeminiProfile =
  | "lite_turn"
  | "lite_docs"
  | "lite_intent"
  | "lite_ask"
  | "flash_review"
  | "flash_task_plan"
  | "flash_edit_plan"
  | "flash_edit_plan_retry"
  | "flash_snippet"
  | "flash_patch"
  | "flash_agent_step";

export interface TpGeminiProfileOptionsInput {
  /** 実装 Worker 内など遅延許容のバックグラウンド呼び出し */
  background?: boolean;
}

/** プロファイルごとの thinking / tier / ログラベル */
export function tpGeminiProfileOptions(
  profile: TpGeminiProfile,
  input?: TpGeminiProfileOptionsInput
): Pick<
  GeminiGenerateOptions,
  "thinkingLevel" | "serviceTier" | "usageLabel"
> {
  const serviceTier = input?.background
    ? TP_BACKGROUND_SERVICE_TIER
    : TP_INTERACTIVE_SERVICE_TIER;

  switch (profile) {
    case "lite_turn":
    case "lite_docs":
    case "lite_intent":
      return {
        thinkingLevel: TP_LITE_THINKING,
        serviceTier,
        usageLabel: profile,
      };
    case "lite_ask":
      return {
        thinkingLevel: TP_LITE_THINKING_ASK,
        serviceTier,
        usageLabel: profile,
      };
    case "flash_review":
    case "flash_task_plan":
      return {
        thinkingLevel: TP_FLASH_THINKING_STRUCTURED,
        serviceTier,
        usageLabel: profile,
      };
    case "flash_edit_plan":
      return {
        thinkingLevel: TP_FLASH_THINKING_EDIT,
        serviceTier,
        usageLabel: profile,
      };
    case "flash_edit_plan_retry":
      return {
        thinkingLevel: TP_FLASH_THINKING_EDIT_RETRY,
        serviceTier,
        usageLabel: profile,
      };
    case "flash_snippet":
      return {
        thinkingLevel: TP_FLASH_THINKING_SNIPPET,
        serviceTier,
        usageLabel: profile,
      };
    case "flash_patch":
      return {
        thinkingLevel: TP_FLASH_THINKING_PATCH,
        serviceTier,
        usageLabel: profile,
      };
    case "flash_agent_step":
      return {
        thinkingLevel: TP_FLASH_THINKING_AGENT_STEP,
        serviceTier,
        usageLabel: profile,
      };
    default: {
      const _exhaustive: never = profile;
      return _exhaustive;
    }
  }
}
