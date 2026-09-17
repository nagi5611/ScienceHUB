/**
 * Runa — Exa Search API クライアント
 * @see https://docs.exa.ai/reference/search-api-guide-for-coding-agents
 */

import type { Env } from "../types";

const EXA_SEARCH_URL = "https://api.exa.ai/search";
const DEFAULT_NUM_RESULTS = 8;
const MAX_NUM_RESULTS = 10;
const EXA_SEARCH_TYPE = "fast";

export interface ExaSearchResult {
  title: string;
  url: string;
  snippet: string;
  position: number;
}

export interface ExaSearchResponse {
  query: string;
  results: ExaSearchResult[];
}

interface ExaSearchApiResultRow {
  title?: string;
  url?: string;
  highlights?: string | string[];
}

interface ExaSearchApiResponse {
  results?: ExaSearchApiResultRow[];
  error?: string;
  message?: string;
}

/** 本番で設定された EXA_API_KEY を返す */
export function exaApiKey(env: Env): string | null {
  const key = env.EXA_API_KEY?.trim();
  return key || null;
}

/** Exa が利用可能か */
export function isExaConfigured(env: Env): boolean {
  return Boolean(exaApiKey(env));
}

function highlightsToSnippet(highlights: string | string[] | undefined): string {
  if (!highlights) return "";
  if (typeof highlights === "string") {
    return highlights.replace(/\s+/g, " ").trim().slice(0, 400);
  }
  if (!Array.isArray(highlights) || highlights.length === 0) return "";
  return highlights
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

async function postExaSearch(
  env: Env,
  body: Record<string, unknown>
): Promise<ExaSearchApiResponse> {
  const apiKey = exaApiKey(env);
  if (!apiKey) {
    throw new Error("Exa 検索 API が未設定です（EXA_API_KEY）");
  }

  const response = await fetch(EXA_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const raw = await response.text();
  let data: ExaSearchApiResponse;
  try {
    data = JSON.parse(raw) as ExaSearchApiResponse;
  } catch {
    throw new Error(
      `Exa API の応答が不正です（HTTP ${response.status}）`
    );
  }

  if (!response.ok) {
    const message =
      data.error?.trim() ||
      data.message?.trim() ||
      raw.slice(0, 200) ||
      `HTTP ${response.status}`;
    throw new Error(`Exa API エラー（HTTP ${response.status}）: ${message}`);
  }

  return data;
}

/** Exa Web 検索（raw retrieval + highlights） */
export async function searchWebWithExa(
  env: Env,
  options: {
    query: string;
    num?: number;
  }
): Promise<ExaSearchResponse> {
  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const numResults = Math.min(
    MAX_NUM_RESULTS,
    Math.max(1, options.num ?? DEFAULT_NUM_RESULTS)
  );

  const data = await postExaSearch(env, {
    query,
    type: EXA_SEARCH_TYPE,
    numResults,
    contents: { highlights: true },
  });

  const results: ExaSearchResult[] = (data.results ?? [])
    .filter((row) => row.title && row.url)
    .slice(0, numResults)
    .map((row, index) => ({
      title: row.title ?? "",
      url: row.url ?? "",
      snippet: highlightsToSnippet(row.highlights),
      position: index + 1,
    }));

  return { query, results };
}

/** Runa ツール向けのテキスト整形 */
export function formatExaResultsForRuna(payload: ExaSearchResponse): string {
  const lines: string[] = [`Exa 検索「${payload.query}」`];

  if (!payload.results.length) {
    lines.push("\n該当する結果は見つかりませんでした。");
    return lines.join("\n");
  }

  lines.push(`\n結果（${payload.results.length} 件）:`);
  for (const item of payload.results) {
    const snippet = item.snippet ? ` — ${item.snippet}` : "";
    lines.push(
      `${item.position}. [${item.title}](${item.url})${snippet}`
    );
  }

  return lines.join("\n");
}
