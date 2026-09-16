/**
 * Runa — SerpBase Google Search API クライアント
 * @see https://serpbase.dev/docs
 */

import type { Env } from "../types";

const SERPBASE_SEARCH_URL = "https://api.serpbase.dev/google/search";
const DEFAULT_RESULT_COUNT = 8;
const MAX_RESULT_COUNT = 10;

export interface SerpBaseSearchResult {
  title: string;
  url: string;
  snippet: string;
  position: number;
}

export interface SerpBaseSearchResponse {
  query: string;
  results: SerpBaseSearchResult[];
  summary?: string;
}

interface SerpBaseOrganicRow {
  title?: string;
  url?: string;
  link?: string;
  snippet?: string;
  rank?: number;
  position?: number;
}

interface SerpBaseFeaturedSnippet {
  snippet?: string;
  title?: string;
}

interface SerpBaseKnowledgeGraph {
  title?: string;
  description?: string;
}

interface SerpBaseApiResponse {
  status?: number;
  error?: string;
  request_id?: string;
  query?: string;
  organic?: SerpBaseOrganicRow[];
  featured_snippet?: SerpBaseFeaturedSnippet;
  knowledge_graph?: SerpBaseKnowledgeGraph;
}

/** 本番で設定された SERPBASE_APIKEY を返す */
export function serpBaseApiKey(env: Env): string | null {
  const key = env.SERPBASE_APIKEY?.trim();
  return key || null;
}

/** SerpBase が利用可能か */
export function isSerpBaseConfigured(env: Env): boolean {
  return Boolean(serpBaseApiKey(env));
}

function extractSummary(data: SerpBaseApiResponse): string | undefined {
  const fs = data.featured_snippet?.snippet?.trim();
  if (fs) return fs;
  const kgDesc = data.knowledge_graph?.description?.trim();
  if (kgDesc) return kgDesc;
  return data.knowledge_graph?.title?.trim() || undefined;
}

/** SerpBase Google Web 検索 */
export async function searchWebWithSerpBase(
  env: Env,
  options: {
    query: string;
    num?: number;
  }
): Promise<SerpBaseSearchResponse> {
  const apiKey = serpBaseApiKey(env);
  if (!apiKey) {
    throw new Error("Web 検索 API が未設定です（SERPBASE_APIKEY）");
  }

  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const num = Math.min(
    MAX_RESULT_COUNT,
    Math.max(1, options.num ?? DEFAULT_RESULT_COUNT)
  );

  const response = await fetch(SERPBASE_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      q: query,
      hl: "ja",
      gl: "jp",
      page: 1,
      device: "default",
    }),
  });

  const raw = await response.text();
  let data: SerpBaseApiResponse;
  try {
    data = JSON.parse(raw) as SerpBaseApiResponse;
  } catch {
    throw new Error(
      `SerpBase API の応答が不正です（HTTP ${response.status}）`
    );
  }

  if (!response.ok) {
    const message =
      data.error?.trim() ||
      raw.slice(0, 200) ||
      `HTTP ${response.status}`;
    throw new Error(`SerpBase API エラー（HTTP ${response.status}）: ${message}`);
  }

  if (data.status !== 0) {
    const message = data.error?.trim() || `status ${data.status ?? "unknown"}`;
    const reqId = data.request_id ? ` request_id=${data.request_id}` : "";
    throw new Error(`SerpBase API エラー: ${message}${reqId}`);
  }

  const resolvedQuery = data.query?.trim() || query;

  const results: SerpBaseSearchResult[] = (data.organic ?? [])
    .filter((row) => row.title && (row.url || row.link))
    .slice(0, num)
    .map((row, index) => ({
      title: row.title ?? "",
      url: row.url ?? row.link ?? "",
      snippet: row.snippet ?? "",
      position: row.rank ?? row.position ?? index + 1,
    }));

  return {
    query: resolvedQuery,
    results,
    summary: extractSummary(data),
  };
}

/** Runa ツール向けのテキスト整形 */
export function formatSerpBaseResultsForRuna(
  payload: SerpBaseSearchResponse
): string {
  const lines: string[] = [`Web 検索「${payload.query}」`];

  if (payload.summary) {
    lines.push(`\n要約: ${payload.summary}`);
  }

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
