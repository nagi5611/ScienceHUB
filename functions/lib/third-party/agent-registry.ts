/**
 * サードパーティ — エージェント定義・三層モデルルーティング
 *
 * Lite  → 分類・対話・軽量 JSON（低コスト）
 * Flash → 構造化レビュー・計画・通常のコード編集（中コスト）
 * High  → リトライ編集・全文 patch（高品質・高コストは最小利用）
 */

import type { Env } from "../types";
import type { GeminiGenerateOptions } from "../gemini/generate";
import {
  resolveTpFlashModel,
  resolveTpHighModel,
  resolveTpLiteModel,
  tpGeminiProfileOptions,
  type TpGeminiProfile,
} from "./tp-flash";

export type TpAgentTier = "lite" | "flash" | "high";

/** 登録エージェント ID */
export type TpAgentId =
  | "discovery"
  | "docs_writer"
  | "plan_reviewer"
  | "task_planner"
  | "code_editor"
  | "code_editor_retry"
  | "code_snippet"
  | "code_patch"
  | "maintain_step"
  | "ask"
  | "intent_classifier";

export interface TpAgentDefinition {
  id: TpAgentId;
  tier: TpAgentTier;
  profile: TpGeminiProfile;
  /** 人間可読な説明（ログ・ドキュメント用） */
  description: string;
  maxOutputTokens?: number;
  /** バックグラウンドジョブ向け Flex 課金（実装 Worker 内） */
  allowFlexTier?: boolean;
}

/** エージェントカタログ（単一ソース） */
export const TP_AGENT_REGISTRY: Record<TpAgentId, TpAgentDefinition> = {
  discovery: {
    id: "discovery",
    tier: "lite",
    profile: "lite_turn",
    description: "ヒアリング・フォーム・ゲート対話",
  },
  docs_writer: {
    id: "docs_writer",
    tier: "lite",
    profile: "lite_docs",
    description: "要件定義・実装計画 Markdown 生成",
  },
  intent_classifier: {
    id: "intent_classifier",
    tier: "lite",
    profile: "lite_intent",
    description: "実装後ユーザー意図の分類",
  },
  ask: {
    id: "ask",
    tier: "lite",
    profile: "lite_ask",
    description: "Ask モード（コード変更なしの Q&A）",
  },
  plan_reviewer: {
    id: "plan_reviewer",
    tier: "flash",
    profile: "flash_review",
    description: "実装計画のレビュー",
  },
  task_planner: {
    id: "task_planner",
    tier: "flash",
    profile: "flash_task_plan",
    description: "実装タスク分解",
    allowFlexTier: true,
  },
  code_editor: {
    id: "code_editor",
    tier: "flash",
    profile: "flash_edit_plan",
    description: "HTML 行編集プラン（初回）",
    maxOutputTokens: 8192,
    allowFlexTier: true,
  },
  code_editor_retry: {
    id: "code_editor_retry",
    tier: "high",
    profile: "flash_edit_plan_retry",
    description: "HTML 行編集プラン（リトライ・高品質）",
    maxOutputTokens: 8192,
    allowFlexTier: true,
  },
  code_snippet: {
    id: "code_snippet",
    tier: "flash",
    profile: "flash_snippet",
    description: "スニペット挿入",
    allowFlexTier: true,
  },
  code_patch: {
    id: "code_patch",
    tier: "high",
    profile: "flash_patch",
    description: "全文 HTML patch（メンテ最終手段）",
    allowFlexTier: true,
  },
  maintain_step: {
    id: "maintain_step",
    tier: "flash",
    profile: "flash_agent_step",
    description: "メンテエージェント 1 ステップ",
  },
};

export function getTpAgent(id: TpAgentId): TpAgentDefinition {
  return TP_AGENT_REGISTRY[id];
}

export function listTpAgents(): TpAgentDefinition[] {
  return Object.values(TP_AGENT_REGISTRY);
}

/** ティアに応じたモデル名 */
export function resolveTpTierModel(env: Env, tier: TpAgentTier): string {
  switch (tier) {
    case "lite":
      return resolveTpLiteModel(env);
    case "flash":
      return resolveTpFlashModel(env);
    case "high":
      return resolveTpHighModel(env);
  }
}

/** エージェント向け Gemini 呼び出しオプション */
export function tpAgentGeminiOptions(
  env: Env,
  agentId: TpAgentId,
  options?: { background?: boolean }
): Pick<
  GeminiGenerateOptions,
  "model" | "thinkingLevel" | "serviceTier" | "usageLabel" | "maxOutputTokens"
> {
  const agent = getTpAgent(agentId);
  const profileOpts = tpGeminiProfileOptions(agent.profile, {
    background: options?.background && agent.allowFlexTier,
  });
  return {
    model: resolveTpTierModel(env, agent.tier),
    ...profileOpts,
    maxOutputTokens: agent.maxOutputTokens,
  };
}

/** 実装ドキュメントキャッシュ用モデル（Flash ティアに合わせる） */
export function resolveTpImplementCacheModel(env: Env): string {
  return resolveTpFlashModel(env);
}
