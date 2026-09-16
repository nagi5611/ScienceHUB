/**
 * Runa — SerpBase Google Search / Images API クライアント
 * @see https://serpbase.dev/docs
 */

import type { Env } from "../types";
import type { RunaFileItem } from "./tools";

const SERPBASE_BASE_URL = "https://api.serpbase.dev";
const SERPBASE_SEARCH_PATH = "/google/search";
const SERPBASE_IMAGES_PATH = "/google/images";
const DEFAULT_RESULT_COUNT = 8;
const MAX_RESULT_COUNT = 10;
const DEFAULT_IMAGE_COUNT = 8;
const MAX_IMAGE_COUNT = 12;

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

export interface SerpBaseImageResult {
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  sourcePageUrl: string;
  domain?: string;
  position: number;
}

export interface SerpBaseImageSearchResponse {
  query: string;
  results: SerpBaseImageResult[];
}

interface SerpBaseOrganicRow {
  title?: string;
  url?: string;
  link?: string;
  snippet?: string;
  rank?: number;
  position?: number;
}

interface SerpBaseImageRow {
  title?: string;
  url?: string;
  link?: string;
  image_url?: string;
  thumbnail_url?: string;
  thumb_url?: string;
  domain?: string;
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

interface SerpBaseSearchApiResponse {
  status?: number;
  error?: string;
  request_id?: string;
  query?: string;
  organic?: SerpBaseOrganicRow[];
  featured_snippet?: SerpBaseFeaturedSnippet;
  knowledge_graph?: SerpBaseKnowledgeGraph;
}

interface SerpBaseImagesApiResponse {
  status?: number;
  error?: string;
  request_id?: string;
  query?: string;
  images?: SerpBaseImageRow[];
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

function extractSummary(data: SerpBaseSearchApiResponse): string | undefined {
  const fs = data.featured_snippet?.snippet?.trim();
  if (fs) return fs;
  const kgDesc = data.knowledge_graph?.description?.trim();
  if (kgDesc) return kgDesc;
  return data.knowledge_graph?.title?.trim() || undefined;
}

async function postSerpBase<T extends { status?: number; error?: string; request_id?: string }>(
  env: Env,
  path: string,
  body: Record<string, string | number>
): Promise<T> {
  const apiKey = serpBaseApiKey(env);
  if (!apiKey) {
    throw new Error("Web 検索 API が未設定です（SERPBASE_APIKEY）");
  }

  const response = await fetch(`${SERPBASE_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const raw = await response.text();
  let data: T;
  try {
    data = JSON.parse(raw) as T;
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

  return data;
}

/** SerpBase Google Web 検索 */
export async function searchWebWithSerpBase(
  env: Env,
  options: {
    query: string;
    num?: number;
  }
): Promise<SerpBaseSearchResponse> {
  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const num = Math.min(
    MAX_RESULT_COUNT,
    Math.max(1, options.num ?? DEFAULT_RESULT_COUNT)
  );

  const data = await postSerpBase<SerpBaseSearchApiResponse>(
    env,
    SERPBASE_SEARCH_PATH,
    {
      q: query,
      hl: "ja",
      gl: "jp",
      page: 1,
      device: "default",
    }
  );

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

/** SerpBase Google 画像検索 */
export async function searchImagesWithSerpBase(
  env: Env,
  options: {
    query: string;
    num?: number;
  }
): Promise<SerpBaseImageSearchResponse> {
  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const num = Math.min(
    MAX_IMAGE_COUNT,
    Math.max(1, options.num ?? DEFAULT_IMAGE_COUNT)
  );

  const data = await postSerpBase<SerpBaseImagesApiResponse>(
    env,
    SERPBASE_IMAGES_PATH,
    {
      q: query,
      hl: "ja",
      gl: "jp",
      page: 1,
    }
  );

  const resolvedQuery = data.query?.trim() || query;

  const results: SerpBaseImageResult[] = [];
  for (const [index, row] of (data.images ?? []).entries()) {
    if (results.length >= num) break;
    const imageUrl = row.image_url?.trim();
    if (!imageUrl) continue;
    const thumbnailUrl =
      row.thumbnail_url?.trim() ||
      row.thumb_url?.trim() ||
      imageUrl;
    const sourcePageUrl = row.url?.trim() || row.link?.trim() || imageUrl;
    const title =
      row.title?.trim() || row.domain?.trim() || `画像 ${index + 1}`;
    results.push({
      title,
      imageUrl,
      thumbnailUrl,
      sourcePageUrl,
      domain: row.domain?.trim() || undefined,
      position: row.rank ?? row.position ?? index + 1,
    });
  }

  return {
    query: resolvedQuery,
    results,
  };
}

/** 画像検索結果をチャット表示用 RunaFileItem に変換 */
export function serpBaseImagesToRunaFiles(
  query: string,
  images: SerpBaseImageResult[]
): RunaFileItem[] {
  const slug = encodeURIComponent(query.slice(0, 80));
  return images.map((img, index) => ({
    name: img.title,
    path: `runa:web-image/${slug}/${index}`,
    type: "file" as const,
    sizeBytes: null,
    updatedAt: null,
    previewUrl: img.thumbnailUrl,
    imageUrl: img.imageUrl,
    sourcePageUrl: img.sourcePageUrl,
  }));
}

/** Runa ツール向けのテキスト整形（Web） */
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

/** Runa ツール向けのテキスト整形（画像） */
export function formatSerpBaseImageResultsForRuna(
  payload: SerpBaseImageSearchResponse
): string {
  const lines: string[] = [`画像検索「${payload.query}」`];

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
