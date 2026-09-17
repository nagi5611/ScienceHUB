/**
 * Runa — Brave Search Web / Image Search API クライアント
 * @see https://api-dashboard.search.brave.com/api-reference/web/search/get
 * @see https://api-dashboard.search.brave.com/api-reference/images/image_search
 */

import type { Env } from "../types";
import type { RunaFileItem } from "./tools";

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search";
const BRAVE_IMAGE_SEARCH_URL = "https://api.search.brave.com/res/v1/images/search";
const DEFAULT_RESULT_COUNT = 8;
const MAX_RESULT_COUNT = 10;
const DEFAULT_IMAGE_COUNT = 8;
const MAX_IMAGE_COUNT = 12;

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

export interface BraveImageResult {
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  sourcePageUrl: string;
  domain?: string;
  position: number;
}

export interface BraveImageSearchResponse {
  query: string;
  results: BraveImageResult[];
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

interface BraveWebApiResponse {
  query?: { original?: string; altered?: string };
  web?: { results?: BraveWebResultRow[] };
  infobox?: { results?: BraveInfoboxResult | BraveInfoboxResult[] };
}

interface BraveImageThumbnail {
  src?: string;
}

interface BraveImageProperties {
  url?: string;
}

interface BraveImageResultRow {
  title?: string;
  url?: string;
  page_url?: string;
  source?: string;
  thumbnail?: BraveImageThumbnail;
  properties?: BraveImageProperties;
}

interface BraveImageApiResponse {
  query?: { original?: string; altered?: string };
  results?: BraveImageResultRow[];
}

/** Serper / hub tbs → Brave freshness（ツール enum 互換） */
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

function braveRequestHeaders(apiKey: string): HeadersInit {
  return {
    Accept: "application/json",
    "Accept-Encoding": "gzip",
    "X-Subscription-Token": apiKey,
  };
}

function extractInfoboxSummary(data: BraveWebApiResponse): string | undefined {
  const raw = data.infobox?.results;
  if (!raw) return undefined;
  const rows = Array.isArray(raw) ? raw : [raw];
  for (const row of rows) {
    const text = row.description?.trim() || row.title?.trim();
    if (text) return text;
  }
  return undefined;
}

function parseBraveError(raw: string): string {
  try {
    const data = JSON.parse(raw) as { message?: string };
    if (typeof data.message === "string") return data.message;
  } catch {
    /* fall through */
  }
  return raw.slice(0, 200);
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
    country: options.country ?? "JP",
    search_lang: options.searchLang ?? "ja",
    spellcheck: "true",
  });
  if (freshness) params.set("freshness", freshness);

  const url = `${BRAVE_WEB_SEARCH_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: braveRequestHeaders(apiKey),
  });

  const raw = await response.text();
  let data: BraveWebApiResponse;
  try {
    data = JSON.parse(raw) as BraveWebApiResponse;
  } catch {
    throw new Error(
      `Brave Search API の応答が不正です（HTTP ${response.status}）`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Brave Search API エラー（HTTP ${response.status}）: ${parseBraveError(raw)}`
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

/** Brave 画像検索 */
export async function searchImagesWithBrave(
  env: Env,
  options: {
    query: string;
    num?: number;
    country?: string;
    searchLang?: string;
  }
): Promise<BraveImageSearchResponse> {
  const apiKey = braveSearchApiKey(env);
  if (!apiKey) {
    throw new Error("画像検索 API が未設定です（BRAVESEARCH_APIKEY）");
  }

  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const num = Math.min(
    MAX_IMAGE_COUNT,
    Math.max(1, options.num ?? DEFAULT_IMAGE_COUNT)
  );

  const params = new URLSearchParams({
    q: query,
    count: String(num),
    country: options.country ?? "JP",
    search_lang: options.searchLang ?? "ja",
    safesearch: "strict",
    spellcheck: "true",
  });

  const url = `${BRAVE_IMAGE_SEARCH_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: braveRequestHeaders(apiKey),
  });

  const raw = await response.text();
  let data: BraveImageApiResponse;
  try {
    data = JSON.parse(raw) as BraveImageApiResponse;
  } catch {
    throw new Error(
      `Brave Image Search API の応答が不正です（HTTP ${response.status}）`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Brave Image Search API エラー（HTTP ${response.status}）: ${parseBraveError(raw)}`
    );
  }

  const resolvedQuery =
    data.query?.altered?.trim() ||
    data.query?.original?.trim() ||
    query;

  const results: BraveImageResult[] = [];
  for (const [index, row] of (data.results ?? []).entries()) {
    if (results.length >= num) break;
    const imageUrl =
      row.properties?.url?.trim() ||
      row.thumbnail?.src?.trim();
    if (!imageUrl) continue;
    const thumbnailUrl = row.thumbnail?.src?.trim() || imageUrl;
    const sourcePageUrl =
      row.url?.trim() ||
      row.page_url?.trim() ||
      imageUrl;
    let domain: string | undefined;
    try {
      domain = new URL(sourcePageUrl).hostname.replace(/^www\./, "");
    } catch {
      domain = undefined;
    }
    const title =
      row.title?.trim() ||
      row.source?.trim() ||
      domain ||
      `画像 ${index + 1}`;
    results.push({
      title,
      imageUrl,
      thumbnailUrl,
      sourcePageUrl,
      domain,
      position: index + 1,
    });
  }

  return { query: resolvedQuery, results };
}

/** 画像検索結果をチャット表示用 RunaFileItem に変換 */
export function braveImagesToRunaFiles(
  query: string,
  images: BraveImageResult[]
): RunaFileItem[] {
  const slug = encodeURIComponent(query.slice(0, 80));
  return images.map((img, index) => ({
    name: img.title,
    path: `runa:brave-image/${slug}/${index}`,
    type: "file" as const,
    sizeBytes: null,
    updatedAt: null,
    previewUrl: img.thumbnailUrl,
    imageUrl: img.imageUrl,
    sourcePageUrl: img.sourcePageUrl,
  }));
}

/** Runa ツール向けのテキスト整形（Web） */
export function formatBraveResultsForRuna(
  payload: BraveSearchResponse
): string {
  const lines: string[] = [`Web 検索（Brave）「${payload.query}」`];

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

/** Runa ツール向けのテキスト整形（画像） */
export function formatBraveImageResultsForRuna(
  payload: BraveImageSearchResponse
): string {
  const lines: string[] = [`画像検索（Brave）「${payload.query}」`];

  if (!payload.results.length) {
    lines.push("\n該当する画像は見つかりませんでした。");
    return lines.join("\n");
  }

  lines.push(
    `\n${payload.results.length} 件の画像をチャットに表示しました。各画像の元ページはリンクから開けます。`
  );
  for (const item of payload.results) {
    const domain = item.domain ? ` (${item.domain})` : "";
    lines.push(
      `${item.position}. [${item.title}](${item.sourcePageUrl})${domain}`
    );
  }

  return lines.join("\n");
}
