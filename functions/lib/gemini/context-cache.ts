/**
 * Gemini 明示コンテキストキャッシュ（Paid）
 * @see https://ai.google.dev/gemini-api/docs/generate-content/caching
 */

import type { Env } from "../types";
import { getGeminiApiKey } from "./generate";

/** 明示キャッシュ作成の目安（要件+計画がこれ未満なら作成しない） */
const MIN_DOCS_CHARS_FOR_EXPLICIT_CACHE = 3_000;

const DEFAULT_CACHE_TTL_SECONDS = 3600;

interface CachedContentResponse {
  name?: string;
}

/** 実装フェーズ用: 要件・計画・システム指示をキャッシュ（タスクループで再利用） */
export async function createTpImplementDocsCache(
  env: Env,
  model: string,
  systemInstruction: string,
  requirements: string,
  plan: string
): Promise<string | null> {
  const req = requirements.trim();
  const pl = plan.trim();
  const combined = `${req}\n\n--- 実装計画書 ---\n\n${pl}`;
  if (combined.length < MIN_DOCS_CHARS_FOR_EXPLICIT_CACHE) {
    return null;
  }

  const apiKey = getGeminiApiKey(env);
  const url = `https://generativelanguage.googleapis.com/v1beta/cachedContents?key=${encodeURIComponent(apiKey)}`;

  const body = {
    model: model.startsWith("models/") ? model : `models/${model}`,
    systemInstruction: {
      parts: [{ text: systemInstruction.trim() }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `以下は実装の参照ドキュメントです。以降のリクエストでは番号付き index.html とタスク指示が続きます。\n\n--- 要件定義書 ---\n\n${req}\n\n--- 実装計画書 ---\n\n${pl}`,
          },
        ],
      },
    ],
    ttl: `${DEFAULT_CACHE_TTL_SECONDS}s`,
    displayName: "sciencehub-tp-implement-docs",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(
        "Gemini explicit cache create skipped:",
        res.status,
        errText.slice(0, 300)
      );
      return null;
    }
    const data = (await res.json()) as CachedContentResponse;
    return data.name?.trim() || null;
  } catch (error) {
    console.warn(
      "Gemini explicit cache create failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
