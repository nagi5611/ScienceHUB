/**
 * Gemini generateContent 共通クライアント
 */

import type { Env } from "../types";

export interface GeminiGenerateOptions {
  model: string;
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: "application/json" | "text/plain";
  responseSchema?: Record<string, unknown>;
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
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
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON object not found");
    return JSON.parse(jsonMatch[0]);
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

  const generationConfig: Record<string, unknown> = {
    temperature: options.temperature ?? 0.3,
    maxOutputTokens: options.maxOutputTokens ?? 8192,
  };
  if (options.responseMimeType) {
    generationConfig.responseMimeType = options.responseMimeType;
  }
  if (options.responseSchema) {
    generationConfig.responseSchema = options.responseSchema;
  }

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: options.prompt }] }],
    generationConfig,
  };
  if (options.systemInstruction?.trim()) {
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
        `AI モデル "${options.model}" が使えません。GEMINI_TP_LITE_MODEL / GEMINI_TP_FLASH_MODEL を確認してください`
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
  const blockReason = data.promptFeedback?.blockReason;
  if (blockReason) {
    throw new Error("AI が入力をブロックしました。内容を見直してください");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
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
