/**
 * Runa — Serper（Google 検索）API クライアント
 */

import type { Env } from "../types";
import type { RunaFileItem } from "./tools";

const SERPER_SEARCH_URL = "https://google.serper.dev/search";
const SERPER_IMAGES_URL = "https://google.serper.dev/images";
const DEFAULT_RESULT_COUNT = 8;
const MAX_RESULT_COUNT = 10;
const DEFAULT_IMAGE_COUNT = 8;
const MAX_IMAGE_COUNT = 12;

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

export interface SerperImageResult {
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  sourcePageUrl: string;
  domain?: string;
  position: number;
}

export interface SerperImageSearchResponse {
  query: string;
  results: SerperImageResult[];
}

interface SerperOrganicRow {
  title?: string;
  link?: string;
  snippet?: string;
  position?: number;
}

interface SerperImageRow {
  title?: string;
  imageUrl?: string;
  link?: string;
  thumbnailUrl?: string;
  source?: string;
  domain?: string;
  position?: number;
}

interface SerperApiResponse {
  organic?: SerperOrganicRow[];
  images?: SerperImageRow[];
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

async function postSerper<T>(
  env: Env,
  url: string,
  body: Record<string, string | number>
): Promise<T> {
  const apiKey = serperApiKey(env);
  if (!apiKey) {
    throw new Error("Web 検索 API が未設定です（SERPER_APIKEY）");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  const raw = await response.text();
  let data: T & { message?: string };
  try {
    data = JSON.parse(raw) as T & { message?: string };
  } catch {
    throw new Error(`Serper API の応答が不正です（HTTP ${response.status}）`);
  }

  if (!response.ok) {
    const message =
      typeof data.message === "string" ? data.message : raw.slice(0, 200);
    throw new Error(`Serper API エラー（HTTP ${response.status}）: ${message}`);
  }

  return data;
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
  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const num = Math.min(
    MAX_RESULT_COUNT,
    Math.max(1, options.num ?? DEFAULT_RESULT_COUNT)
  );

  const body: Record<string, string | number> = {
    q: query,
    num,
    gl: options.gl ?? "jp",
    hl: options.hl ?? "ja",
  };
  if (options.tbs) body.tbs = options.tbs;

  const data = await postSerper<SerperApiResponse>(env, SERPER_SEARCH_URL, body);

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

/** Google 画像検索（Serper） */
export async function searchImagesWithSerper(
  env: Env,
  options: {
    query: string;
    num?: number;
    gl?: string;
    hl?: string;
  }
): Promise<SerperImageSearchResponse> {
  const query = options.query.trim();
  if (!query) {
    throw new Error("検索語を指定してください");
  }

  const num = Math.min(
    MAX_IMAGE_COUNT,
    Math.max(1, options.num ?? DEFAULT_IMAGE_COUNT)
  );

  const data = await postSerper<SerperApiResponse>(env, SERPER_IMAGES_URL, {
    q: query,
    num,
    gl: options.gl ?? "jp",
    hl: options.hl ?? "ja",
  });

  const results: SerperImageResult[] = [];
  for (const [index, row] of (data.images ?? []).entries()) {
    if (results.length >= num) break;
    const imageUrl = row.imageUrl?.trim();
    if (!imageUrl) continue;
    const thumbnailUrl = row.thumbnailUrl?.trim() || imageUrl;
    const sourcePageUrl = row.link?.trim() || imageUrl;
    const title =
      row.title?.trim() ||
      row.source?.trim() ||
      row.domain?.trim() ||
      `画像 ${index + 1}`;
    results.push({
      title,
      imageUrl,
      thumbnailUrl,
      sourcePageUrl,
      domain: row.domain?.trim() || undefined,
      position: row.position ?? index + 1,
    });
  }

  return { query, results };
}

/** 画像検索結果をチャット表示用 RunaFileItem に変換 */
export function serperImagesToRunaFiles(
  query: string,
  images: SerperImageResult[]
): RunaFileItem[] {
  const slug = encodeURIComponent(query.slice(0, 80));
  return images.map((img, index) => ({
    name: img.title,
    path: `runa:serper-image/${slug}/${index}`,
    type: "file" as const,
    sizeBytes: null,
    updatedAt: null,
    previewUrl: img.thumbnailUrl,
    imageUrl: img.imageUrl,
    sourcePageUrl: img.sourcePageUrl,
  }));
}

/** Runa ツール向けのテキスト整形（Web） */
export function formatSerperResultsForRuna(
  payload: SerperSearchResponse
): string {
  const lines: string[] = [`Web 検索（Serper）「${payload.query}」`];

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

/** Runa ツール向けのテキスト整形（画像） */
export function formatSerperImageResultsForRuna(
  payload: SerperImageSearchResponse
): string {
  const lines: string[] = [`画像検索（Serper）「${payload.query}」`];

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
