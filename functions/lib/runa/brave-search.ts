/**
 * Runa — Brave Search Web Search API クライアント
 * @see https://api-dashboard.search.brave.com/api-reference/web/search/get
 */

import type { Env } from "../types";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";
const DEFAULT_RESULT_COUNT = 8;
const MAX_RESULT_COUNT = 10;

export interface BraveSearchResult {
  title: string;
  url: string;
  snippet: string;
  position: number;
}

export interface BraveSearchResponse {
  query: string;
  results: BraveSearchResult[];
  infoboxSummary?: string;
}

interface BraveWebResultRow {
  title?: string;
  url?: string;
  description?: string;
}

interface BraveInfoboxResult {
  title?: string;
  description?: string;
}

interface BraveApiResponse {
  query?: { original?: string; altered?: string };
  web?: { results?: BraveWebResultRow[] };
  infobox?: { results?: BraveInfoboxResult | BraveInfoboxResult[] };
}

/** Serper tbs → Brave freshness（ツール enum 互換） */
export function mapTbsToBraveFreshness(tbs: string): string | undefined {
  switch (tbs.trim()) {
    case "qdr:h":
    case "qdr:d":
      return "pd";
    case "qdr:w":
      return "pw";
    case "qdr:m":
      return "pm";
    case "qdr:y":
      return "py";
    default:
      return undefined;
  }
}

/** 本番で設定された BRAVESEARCH_APIKEY を返す */
export function braveSearchApiKey(env: Env): string | null {
  const key = env.BRAVESEARCH_APIKEY?.trim();
  return key || null;
}

/** Brave Search が利用可能か */
export function isBraveSearchConfigured(env: Env): boolean {
  return Boolean(braveSearchApiKey(env));
}

function extractInfoboxSummary(data: BraveApiResponse): string | undefined {
  const raw = data.infobox?.results;
  if (!raw) return undefined;
  const rows = Array.isArray(raw) ? raw : [raw];
  for (const row of rows) {
    const text = row.description?.trim() || row.title?.trim();
    if (text) return text;
  }
  return undefined;
}

/** Brave Web 検索 */
export async function searchWebWithBrave(
  env: Env,
  options: {
    query: string;
    num?: number;
    country?: string;
    searchLang?: string;
    freshness?: string;
    tbs?: string;
  }
): Promise<BraveSearchResponse> {
  const apiKey = braveSearchApiKey(env);
  if (!apiKey) {
    throw new Error("Web 検索 API が未設定です（BRAVESEARCH_APIKEY）");
  }

  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const num = Math.min(
    MAX_RESULT_COUNT,
    Math.max(1, options.num ?? DEFAULT_RESULT_COUNT)
  );

  const freshness =
    options.freshness?.trim() ||
    (options.tbs ? mapTbsToBraveFreshness(options.tbs) : undefined);

  const params = new URLSearchParams({
    q: query,
    count: String(num),
    country: options.country ?? "jp",
    search_lang: options.searchLang ?? "ja",
    spellcheck: "true",
  });
  if (freshness) params.set("freshness", freshness);

  const url = `${BRAVE_WEB_SEARCH_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": apiKey,
    },
  });

  const raw = await response.text();
  let data: BraveApiResponse;
  try {
    data = JSON.parse(raw) as BraveApiResponse;
  } catch {
    throw new Error(
      `Brave Search API の応答が不正です（HTTP ${response.status}）`
    );
  }

  if (!response.ok) {
    const message =
      typeof (data as { message?: string }).message === "string"
        ? (data as { message: string }).message
        : raw.slice(0, 200);
    throw new Error(
      `Brave Search API エラー（HTTP ${response.status}）: ${message}`
    );
  }

  const resolvedQuery =
    data.query?.altered?.trim() ||
    data.query?.original?.trim() ||
    query;

  const results: BraveSearchResult[] = (data.web?.results ?? [])
    .filter((row) => row.title && row.url)
    .map((row, index) => ({
      title: row.title ?? "",
      url: row.url ?? "",
      snippet: row.description ?? "",
      position: index + 1,
    }));

  return {
    query: resolvedQuery,
    results,
    infoboxSummary: extractInfoboxSummary(data),
  };
}

/** Runa ツール向けのテキスト整形 */
export function formatBraveResultsForRuna(
  payload: BraveSearchResponse
): string {
  const lines: string[] = [`Web 検索「${payload.query}」`];

  if (payload.infoboxSummary) {
    lines.push(`\n要約: ${payload.infoboxSummary}`);
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
