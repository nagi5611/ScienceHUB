/**
 * Q&A 用の Runa（GPT 5.6 Luna 等）JSON 補完
 */

import type { Env } from "../types";
import { runaOpenAiApiKey } from "../runa/env";
import { runaChatCompletion, type ChatMessage } from "../runa/openai";

/** Runa の LLM（Luna 等）が呼び出し可能か */
export function isRunaLlmAvailable(env: Env): boolean {
  return Boolean(runaOpenAiApiKey(env) || env.CLOUDFLARE_API_TOKEN?.trim());
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    /* continue */
  }
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim()) as Record<string, unknown>;
    } catch {
      /* continue */
    }
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
}

/** Runa モデルで JSON オブジェクトを得る（未設定・解析失敗時は null） */
export async function runaQaJsonCompletion(
  env: Env,
  system: string,
  user: string
): Promise<Record<string, unknown> | null> {
  if (!isRunaLlmAvailable(env)) return null;

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `${system}\n\n必ず JSON オブジェクトのみを返してください。説明文やマークダウンは付けないでください。`,
    },
    { role: "user", content: user },
  ];

  const completion = await runaChatCompletion(env, messages, []);
  const raw = completion.content?.trim();
  if (!raw) return null;
  return extractJsonObject(raw);
}
