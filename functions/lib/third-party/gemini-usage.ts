/**
 * サードパーティ — Gemini 使用量 D1 記録・集計
 */

import { createId, now } from "../types";
import type {
  GeminiGenerateOptions,
  GeminiServiceTier,
  GeminiUsageMetadata,
} from "../gemini/generate";

export interface TpGeminiUsageContext {
  projectId?: string;
  ownerUserId?: string;
}

export interface TpGeminiUsageRecordInput extends TpGeminiUsageContext {
  model: string;
  usageLabel: string;
  serviceTier?: GeminiServiceTier;
  usage: GeminiUsageMetadata;
}

export interface TpGeminiUsageLabelRow {
  usage_label: string;
  model: string;
  call_count: number;
  prompt_tokens: number;
  output_tokens: number;
  cached_tokens: number;
  thoughts_tokens: number;
  total_tokens: number;
}

export interface TpGeminiUsageSummary {
  project_id: string;
  call_count: number;
  prompt_tokens: number;
  output_tokens: number;
  cached_tokens: number;
  thoughts_tokens: number;
  total_tokens: number;
  by_label: TpGeminiUsageLabelRow[];
}

/** D1 に 1 回分の Gemini 使用量を記録（失敗しても本処理は継続） */
export async function recordTpGeminiUsage(
  db: D1Database,
  input: TpGeminiUsageRecordInput
): Promise<void> {
  const usage = input.usage;
  const prompt = usage.promptTokenCount ?? 0;
  const output = usage.candidatesTokenCount ?? 0;
  const cached = usage.cachedContentTokenCount ?? 0;
  const thoughts = usage.thoughtsTokenCount ?? 0;
  const total = usage.totalTokenCount ?? prompt + output + thoughts;

  try {
    await db
      .prepare(
        `INSERT INTO tp_gemini_usage (
          id, project_id, owner_user_id, model, usage_label, service_tier,
          prompt_tokens, output_tokens, cached_tokens, thoughts_tokens,
          total_tokens, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        createId("tpuse"),
        input.projectId ?? null,
        input.ownerUserId ?? null,
        input.model,
        input.usageLabel,
        input.serviceTier ?? null,
        prompt,
        output,
        cached,
        thoughts,
        total,
        now()
      )
      .run();
  } catch (error) {
    console.warn(
      "tp_gemini_usage insert failed:",
      error instanceof Error ? error.message : error
    );
  }
}

/** Gemini 呼び出しオプションに D1 記録フックを付与 */
export function withTpUsageRecording(
  db: D1Database | null | undefined,
  ctx: TpGeminiUsageContext,
  options: GeminiGenerateOptions
): GeminiGenerateOptions {
  if (!db) return options;
  return {
    ...options,
    usageRecorder: async (record) => {
      await recordTpGeminiUsage(db, {
        ...ctx,
        model: record.model,
        usageLabel: record.usageLabel ?? options.usageLabel ?? "unknown",
        serviceTier: record.serviceTier ?? options.serviceTier,
        usage: record.usage,
      });
    },
  };
}

/** プロジェクト単位の使用量サマリ */
export async function getTpGeminiUsageSummary(
  db: D1Database,
  projectId: string
): Promise<TpGeminiUsageSummary | null> {
  const totals = await db
    .prepare(
      `SELECT
        COUNT(*) AS call_count,
        COALESCE(SUM(prompt_tokens), 0) AS prompt_tokens,
        COALESCE(SUM(output_tokens), 0) AS output_tokens,
        COALESCE(SUM(cached_tokens), 0) AS cached_tokens,
        COALESCE(SUM(thoughts_tokens), 0) AS thoughts_tokens,
        COALESCE(SUM(total_tokens), 0) AS total_tokens
       FROM tp_gemini_usage
       WHERE project_id = ?`
    )
    .bind(projectId)
    .first<{
      call_count: number;
      prompt_tokens: number;
      output_tokens: number;
      cached_tokens: number;
      thoughts_tokens: number;
      total_tokens: number;
    }>();

  if (!totals) return null;

  const byLabel = await db
    .prepare(
      `SELECT
        usage_label,
        model,
        COUNT(*) AS call_count,
        COALESCE(SUM(prompt_tokens), 0) AS prompt_tokens,
        COALESCE(SUM(output_tokens), 0) AS output_tokens,
        COALESCE(SUM(cached_tokens), 0) AS cached_tokens,
        COALESCE(SUM(thoughts_tokens), 0) AS thoughts_tokens,
        COALESCE(SUM(total_tokens), 0) AS total_tokens
       FROM tp_gemini_usage
       WHERE project_id = ?
       GROUP BY usage_label, model
       ORDER BY total_tokens DESC`
    )
    .bind(projectId)
    .all<TpGeminiUsageLabelRow>();

  return {
    project_id: projectId,
    call_count: totals.call_count,
    prompt_tokens: totals.prompt_tokens,
    output_tokens: totals.output_tokens,
    cached_tokens: totals.cached_tokens,
    thoughts_tokens: totals.thoughts_tokens,
    total_tokens: totals.total_tokens,
    by_label: byLabel.results ?? [],
  };
}

/** 所有者チェック付きサマリ */
export async function getOwnedTpGeminiUsageSummary(
  db: D1Database,
  ownerUserId: string,
  projectId: string
): Promise<TpGeminiUsageSummary | null> {
  const owned = await db
    .prepare("SELECT id FROM tp_projects WHERE id = ? AND owner_user_id = ?")
    .bind(projectId, ownerUserId)
    .first<{ id: string }>();
  if (!owned) return null;
  return await getTpGeminiUsageSummary(db, projectId);
}
