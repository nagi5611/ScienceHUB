/**
 * Runa — マルチプロバイダ並列 Web 検索（SerpBase / Serper / Brave / Exa）
 */

import type { Env } from "../types";
import { searchWebWithBrave, isBraveSearchConfigured } from "./brave-search";
import { searchWebWithExa, isExaConfigured } from "./exa";
import { runaChatCompletion, type ChatMessage } from "./openai";
import {
  isSerpBaseConfigured,
  searchWebWithSerpBase,
} from "./serpbase";
import { searchWebWithSerper, isSerperConfigured } from "./serper";
import type { RunaSseSend } from "./chat-sse";

export const MULTI_SEARCH_QUERY_COUNT = 5;
export const MULTI_SEARCH_RESULTS_PER_PROVIDER = 5;

export type MultiSearchProvider = "serpbase" | "serper" | "brave" | "exa";

export interface MultiSearchHit {
  query: string;
  provider: MultiSearchProvider;
  title: string;
  url: string;
  snippet: string;
}

export interface MultiSearchAssessmentInput {
  gaps?: string;
  nextQueryDirections?: string;
  resolutionNotes?: string;
}

export interface PlanMultiSearchOptions {
  focus?: string;
  assessment?: MultiSearchAssessmentInput;
  evidenceDigest?: string;
  /** deep 用: 前ラウンドまでのクエリを避けるヒント */
  round?: number;
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

async function llmJsonCompletion(
  env: Env,
  system: string,
  user: string
): Promise<Record<string, unknown> | null> {
  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  const completion = await runaChatCompletion(env, messages, []);
  const raw = completion.content?.trim();
  if (!raw) return null;
  return extractJsonObject(raw);
}

/** いずれかの Web 検索プロバイダが利用可能か */
export function hasAnyMultiSearchProvider(env: Env): boolean {
  return (
    isSerpBaseConfigured(env) ||
    isSerperConfigured(env) ||
    isBraveSearchConfigured(env) ||
    isExaConfigured(env)
  );
}

function normalizeQueryStrings(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const q = item.trim();
      if (q) out.push(q.slice(0, 200));
    } else if (item && typeof item === "object") {
      const q = typeof (item as { q?: string }).q === "string"
        ? (item as { q: string }).q.trim()
        : "";
      if (q) out.push(q.slice(0, 200));
    }
    if (out.length >= MULTI_SEARCH_QUERY_COUNT) break;
  }
  return out;
}

function padQueriesToFive(topic: string, queries: string[]): string[] {
  const base = topic.trim().slice(0, 200);
  const out = [...queries];
  const suffixes = [" 概要", " 最新", " 詳細", " 問題点", " 事例"];
  let i = 0;
  while (out.length < MULTI_SEARCH_QUERY_COUNT && i < suffixes.length + 3) {
    const candidate =
      i === 0 && !out.includes(base)
        ? base
        : `${base}${suffixes[i] ?? ` ${i + 1}`}`.trim();
    if (!out.includes(candidate)) out.push(candidate.slice(0, 200));
    i += 1;
  }
  return out.slice(0, MULTI_SEARCH_QUERY_COUNT);
}

/** LLM で 5 件の検索クエリを計画 */
export async function planMultiSearchQueries(
  env: Env,
  topic: string,
  options?: PlanMultiSearchOptions
): Promise<string[]> {
  const trimmedTopic = topic.trim();
  const system = `あなたは Runa のマルチ検索計画担当です。ユーザーの調査テーマに答えるため、**同時に並列実行する Web 検索クエリをちょうど ${MULTI_SEARCH_QUERY_COUNT} 件** JSON のみで返してください。

ルール:
- queries は必ず ${MULTI_SEARCH_QUERY_COUNT} 件（観点・キーワードを分ける。互いに重複しすぎない）
- 各要素は短い Google/Brave 向け検索語（日本語可）
- 出力は JSON のみ

形式:
{"queries":["...","...","...","...","..."]}`;

  const userParts = [`調査テーマ: ${trimmedTopic}`];
  if (options?.focus?.trim()) {
    userParts.push(`追加指示: ${options.focus.trim()}`);
  }
  if (options?.round) {
    userParts.push(`ラウンド: ${options.round}`);
  }
  if (options?.evidenceDigest) {
    userParts.push(`\nこれまでの検索結果:\n${options.evidenceDigest}`);
  }
  if (options?.assessment?.gaps) {
    userParts.push(`\n不足・ギャップ: ${options.assessment.gaps}`);
  }
  if (options?.assessment?.nextQueryDirections) {
    userParts.push(
      `\n次に調べる方向: ${options.assessment.nextQueryDirections}`
    );
  }
  if (options?.assessment?.resolutionNotes) {
    userParts.push(`\n解像度メモ: ${options.assessment.resolutionNotes}`);
  }

  const data = await llmJsonCompletion(env, system, userParts.join("\n"));
  let queries = normalizeQueryStrings(data?.queries);
  queries = padQueriesToFive(trimmedTopic, queries);
  return queries;
}

async function fetchProviderHits(
  env: Env,
  query: string,
  provider: MultiSearchProvider
): Promise<MultiSearchHit[]> {
  const num = MULTI_SEARCH_RESULTS_PER_PROVIDER;
  switch (provider) {
    case "serpbase": {
      if (!isSerpBaseConfigured(env)) return [];
      const payload = await searchWebWithSerpBase(env, { query, num });
      return payload.results.map((row) => ({
        query,
        provider,
        title: row.title,
        url: row.url,
        snippet: row.snippet,
      }));
    }
    case "serper": {
      if (!isSerperConfigured(env)) return [];
      const payload = await searchWebWithSerper(env, { query, num });
      return payload.results.map((row) => ({
        query,
        provider,
        title: row.title,
        url: row.url,
        snippet: row.snippet,
      }));
    }
    case "brave": {
      if (!isBraveSearchConfigured(env)) return [];
      const payload = await searchWebWithBrave(env, { query, num });
      return payload.results.map((row) => ({
        query,
        provider,
        title: row.title,
        url: row.url,
        snippet: row.snippet,
      }));
    }
    case "exa": {
      if (!isExaConfigured(env)) return [];
      const payload = await searchWebWithExa(env, { query, num });
      return payload.results.map((row) => ({
        query,
        provider,
        title: row.title,
        url: row.url,
        snippet: row.snippet,
      }));
    }
    default:
      return [];
  }
}

/** 5 クエリ × 設定済み 4 プロバイダを並列実行 */
export async function executeMultiSearchBatch(
  env: Env,
  queries: string[]
): Promise<MultiSearchHit[]> {
  if (!hasAnyMultiSearchProvider(env)) {
    throw new Error(
      "マルチ検索 API キーが未設定です（SERPBASE / SERPER / BRAVESEARCH / EXA のいずれか）"
    );
  }

  const providers: MultiSearchProvider[] = [
    "serpbase",
    "serper",
    "brave",
    "exa",
  ];

  const tasks: Promise<MultiSearchHit[]>[] = [];
  for (const query of queries) {
    for (const provider of providers) {
      tasks.push(
        fetchProviderHits(env, query, provider).catch(() => [] as MultiSearchHit[])
      );
    }
  }

  const batches = await Promise.all(tasks);
  const hits = batches.flat();
  if (!hits.length) {
    throw new Error("マルチ検索で結果を取得できませんでした");
  }
  return hits;
}

export function multiSearchHitsDigest(
  hits: MultiSearchHit[],
  maxLines = 80
): string {
  const lines = hits.slice(-maxLines).map((h) => {
    const snip = h.snippet ? ` — ${h.snippet.slice(0, 120)}` : "";
    return `- [${h.provider}] ${h.query} → ${h.title} (${h.url})${snip}`;
  });
  return lines.join("\n") || "（まだ検索結果がありません）";
}

export function dedupeMultiSearchHits(hits: MultiSearchHit[]): MultiSearchHit[] {
  const seen = new Set<string>();
  const out: MultiSearchHit[] = [];
  for (const hit of hits) {
    const key = `${hit.provider}:${hit.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(hit);
  }
  return out;
}

/** 全ヒットから統合回答を生成 */
export async function synthesizeMultiSearchAnswer(
  env: Env,
  topic: string,
  hits: MultiSearchHit[]
): Promise<string> {
  const system = `あなたは Runa です。複数の検索エンジン（SerpBase / Serper / Brave / Exa）から集めた結果を踏まえ、ユーザーの質問に日本語 Markdown で答えてください。

- 出典 URL は Markdown リンク [タイトル](URL) で示す
- 推測と事実を区別する
- 矛盾する情報があれば簡潔に触れる`;

  const user = `テーマ: ${topic}

検索結果:
${multiSearchHitsDigest(hits, 100)}`;

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  const completion = await runaChatCompletion(env, messages, []);
  const text = completion.content?.trim();
  if (text) return text;
  return "検索は完了しましたが、回答の生成に失敗しました。";
}

export interface RunMultiSearchSessionOptions {
  focus?: string;
  planOptions?: PlanMultiSearchOptions;
  skipSynthesize?: boolean;
}

/** 1 回の multi_search（計画 → 並列検索 → 統合回答） */
export async function runMultiSearchSession(
  env: Env,
  topic: string,
  send?: RunaSseSend,
  options?: RunMultiSearchSessionOptions
): Promise<{ message: string; hits: MultiSearchHit[]; queries: string[] }> {
  const trimmedTopic = topic.trim();
  if (!trimmedTopic) {
    throw new Error("調査テーマを入力してください");
  }
  if (!hasAnyMultiSearchProvider(env)) {
    throw new Error(
      "マルチ検索 API キーが未設定です（SERPBASE / SERPER / BRAVESEARCH / EXA のいずれか）"
    );
  }

  const emit = (phase: string, message: string) => {
    send?.("multi_search", { phase, message });
  };

  emit("plan", "検索クエリを 5 件計画中…");
  const planOpts: PlanMultiSearchOptions = {
    ...options?.planOptions,
    focus: options?.focus ?? options?.planOptions?.focus,
  };
  const queries = await planMultiSearchQueries(env, trimmedTopic, planOpts);

  emit(
    "search",
    `5 クエリ × 検索プロバイダを並列実行中… (${queries.join(" / ")})`
  );
  const hits = await executeMultiSearchBatch(env, queries);

  if (options?.skipSynthesize) {
    return { message: "", hits, queries };
  }

  emit("synthesize", "検索結果を統合して回答を作成中…");
  const message = await synthesizeMultiSearchAnswer(env, trimmedTopic, hits);
  return { message, hits, queries };
}
