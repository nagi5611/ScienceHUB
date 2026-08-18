/**
 * Gemini generateContent 共通クライアント
 */

import type { Env } from "../types";

/** @see https://ai.google.dev/api/generate-content#ThinkingLevel */
export type GeminiThinkingLevel =
  | "MINIMAL"
  | "LOW"
  | "MEDIUM"
  | "HIGH";

/** @see https://ai.google.dev/api/generate-content#ServiceTier */
export type GeminiServiceTier = "STANDARD" | "FLEX" | "PRIORITY";

export interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  cachedContentTokenCount?: number;
  thoughtsTokenCount?: number;
  totalTokenCount?: number;
}

export interface GeminiGenerateOptions {
  model: string;
  prompt: string;
  systemInstruction?: string;
  /** Gemini 2.x 向け。Gemini 3 では未指定推奨（API 既定） */
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: "application/json" | "text/plain";
  responseSchema?: Record<string, unknown>;
  /** Gemini 3+ のみ。2.x では送らない */
  thinkingLevel?: GeminiThinkingLevel;
  /** Paid: 明示キャッシュ名 cachedContents/... */
  cachedContent?: string;
  serviceTier?: GeminiServiceTier;
  /** Cloudflare ログ用ラベル */
  usageLabel?: string;
  /** 呼び出し成功後の使用量記録（サードパーティ D1 等） */
  usageRecorder?: (record: {
    model: string;
    usageLabel?: string;
    serviceTier?: GeminiServiceTier;
    usage: GeminiUsageMetadata;
  }) => void | Promise<void>;
}

function isGemini3Model(model: string): boolean {
  return /gemini-3/i.test(model);
}

function buildGenerationConfig(
  options: GeminiGenerateOptions
): Record<string, unknown> {
  const config: Record<string, unknown> = {
    maxOutputTokens: options.maxOutputTokens ?? 8192,
  };

  const gemini3 = isGemini3Model(options.model);
  if (!gemini3) {
    config.temperature = options.temperature ?? 0.3;
  } else if (options.temperature !== undefined) {
    config.temperature = options.temperature;
  }

  if (gemini3 && options.thinkingLevel) {
    config.thinkingConfig = {
      thinkingLevel: options.thinkingLevel,
      includeThoughts: false,
    };
  }

  if (options.responseMimeType) {
    config.responseMimeType = options.responseMimeType;
  }
  if (options.responseSchema) {
    config.responseSchema = options.responseSchema;
  }

  return config;
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  usageMetadata?: GeminiUsageMetadata;
}

function serviceTierToApi(tier: GeminiServiceTier): string | null {
  switch (tier) {
    case "FLEX":
      return "flex";
    case "PRIORITY":
      return "priority";
    default:
      // Standard はフィールド省略（公式: omit = standard）
      return null;
  }
}

function logGeminiUsage(
  label: string | undefined,
  model: string,
  usage: GeminiUsageMetadata | undefined
): void {
  if (!usage) return;
  console.log(
    JSON.stringify({
      type: "gemini_usage",
      label: label ?? "unknown",
      model,
      prompt: usage.promptTokenCount,
      output: usage.candidatesTokenCount,
      cached: usage.cachedContentTokenCount,
      thoughts: usage.thoughtsTokenCount,
      total: usage.totalTokenCount,
    })
  );
}

/** API キーを取得 */
export function getGeminiApiKey(env: Env): string {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "AI が設定されていません。管理者に GEMINI_API_KEY を設定してください"
    );
  }
  return apiKey;
}

/** JSON テキストをパース（markdown fence 除去） */
export function parseJsonFromModelText(text: string): unknown {
  let trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    trimmed = trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }
  try {
    return JSON.parse(trimmed);
  } catch (firstError) {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      const hint =
        firstError instanceof Error && firstError.message.includes("Unterminated")
          ? "AI の JSON が途中で切れています（出力が長すぎる可能性があります）"
          : "AI の JSON を解釈できませんでした";
      throw new Error(hint);
    }
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error(
        "AI の JSON が途中で切れています（出力が長すぎる可能性があります）"
      );
    }
  }
}

/** Gemini generateContent を呼び出しテキストを返す */
export async function geminiGenerateText(
  env: Env,
  options: GeminiGenerateOptions
): Promise<string> {
  const apiKey = getGeminiApiKey(env);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    options.model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const generationConfig = buildGenerationConfig(options);

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: options.prompt }] }],
    generationConfig,
  };
  if (options.cachedContent?.trim()) {
    body.cachedContent = options.cachedContent.trim();
  }
  if (options.serviceTier) {
    const tier = serviceTierToApi(options.serviceTier);
    if (tier) {
      body.serviceTier = tier;
    }
  }
  if (options.systemInstruction?.trim() && !options.cachedContent?.trim()) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction.trim() }],
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("Gemini generate failed:", res.status, errText.slice(0, 800));
    if (res.status === 404) {
      throw new Error(
        `AI モデル "${options.model}" が使えません。GEMINI_TP_LITE_MODEL / GEMINI_TP_FLASH_MODEL / GEMINI_TP_HIGH_MODEL を確認してください`
      );
    }
    let detail = "";
    try {
      const parsed = JSON.parse(errText) as {
        error?: { message?: string; status?: string };
      };
      const msg = parsed.error?.message?.trim();
      if (msg) detail = `: ${msg.slice(0, 180)}`;
    } catch {
      /* ignore */
    }
    throw new Error(
      `AI の呼び出しに失敗しました。しばらくしてから再度お試しください${detail}`
    );
  }

  const data = (await res.json()) as GeminiGenerateResponse;
  logGeminiUsage(options.usageLabel, options.model, data.usageMetadata);
  if (options.usageRecorder && data.usageMetadata) {
    try {
      await options.usageRecorder({
        model: options.model,
        usageLabel: options.usageLabel,
        serviceTier: options.serviceTier,
        usage: data.usageMetadata,
      });
    } catch (error) {
      console.warn(
        "Gemini usageRecorder failed:",
        error instanceof Error ? error.message : error
      );
    }
  }
  const blockReason = data.promptFeedback?.blockReason;
  if (blockReason) {
    throw new Error("AI が入力をブロックしました。内容を見直してください");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const finishReason = data.candidates?.[0]?.finishReason;
  if (finishReason === "MAX_TOKENS") {
    throw new Error(
      "AI の応答が長すぎて途中で切れました。もう一度お試しください"
    );
  }
  if (!text?.trim()) {
    throw new Error("AI からの応答が空でした");
  }
  return text;
}

/** JSON スキーマ付きで Gemini を呼び出す */
export async function geminiGenerateJson<T>(
  env: Env,
  options: GeminiGenerateOptions
): Promise<T> {
  const text = await geminiGenerateText(env, {
    ...options,
    responseMimeType: "application/json",
    responseSchema: options.responseSchema,
  });
  return parseJsonFromModelText(text) as T;
}
