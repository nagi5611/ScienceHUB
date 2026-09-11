/**
 * Runa — Serper（Google 検索）API クライアント
 */

import type { Env } from "../types";

const SERPER_SEARCH_URL = "https://google.serper.dev/search";
const DEFAULT_RESULT_COUNT = 8;
const MAX_RESULT_COUNT = 10;

export interface SerperSearchResult {
  title: string;
  url: string;
  snippet: string;
  position: number;
}

export interface SerperSearchResponse {
  query: string;
  results: SerperSearchResult[];
  answerBox?: string;
  knowledgeGraphTitle?: string;
}

interface SerperOrganicRow {
  title?: string;
  link?: string;
  snippet?: string;
  position?: number;
}

interface SerperApiResponse {
  organic?: SerperOrganicRow[];
  answerBox?: { answer?: string; snippet?: string; title?: string };
  knowledgeGraph?: { title?: string; description?: string };
}

/** 本番で設定された SERPER_APIKEY を返す */
export function serperApiKey(env: Env): string | null {
  const key = env.SERPER_APIKEY?.trim();
  return key || null;
}

/** Serper が利用可能か */
export function isSerperConfigured(env: Env): boolean {
  return Boolean(serperApiKey(env));
}

/** Google Web 検索（Serper） */
export async function searchWebWithSerper(
  env: Env,
  options: {
    query: string;
    num?: number;
    gl?: string;
    hl?: string;
    tbs?: string;
  }
): Promise<SerperSearchResponse> {
  const apiKey = serperApiKey(env);
  if (!apiKey) {
    throw new Error("Web 検索 API が未設定です（SERPER_APIKEY）");
  }

  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const num = Math.min(
    MAX_RESULT_COUNT,
    Math.max(1, options.num ?? DEFAULT_RESULT_COUNT)
  );

  const body: Record<string, string | number | boolean> = {
    q: query,
    num,
    gl: options.gl ?? "jp",
    hl: options.hl ?? "ja",
  };
  if (options.tbs) body.tbs = options.tbs;

  const response = await fetch(SERPER_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  const raw = await response.text();
  let data: SerperApiResponse;
  try {
    data = JSON.parse(raw) as SerperApiResponse;
  } catch {
    throw new Error(`Serper API の応答が不正です（HTTP ${response.status}）`);
  }

  if (!response.ok) {
    const message =
      typeof (data as { message?: string }).message === "string"
        ? (data as { message: string }).message
        : raw.slice(0, 200);
    throw new Error(`Serper API エラー（HTTP ${response.status}）: ${message}`);
  }

  const results: SerperSearchResult[] = (data.organic ?? [])
    .filter((row) => row.title && row.link)
    .map((row) => ({
      title: row.title ?? "",
      url: row.link ?? "",
      snippet: row.snippet ?? "",
      position: row.position ?? 0,
    }));

  const answerBox =
    data.answerBox?.answer ??
    data.answerBox?.snippet ??
    data.knowledgeGraph?.description;

  return {
    query,
    results,
    answerBox: answerBox || undefined,
    knowledgeGraphTitle: data.knowledgeGraph?.title,
  };
}

/** Runa ツール向けのテキスト整形 */
export function formatSerperResultsForRuna(
  payload: SerperSearchResponse
): string {
  const lines: string[] = [`Web 検索「${payload.query}」`];

  if (payload.knowledgeGraphTitle) {
    lines.push(`\n**${payload.knowledgeGraphTitle}**`);
  }
  if (payload.answerBox) {
    lines.push(`\n要約: ${payload.answerBox}`);
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
