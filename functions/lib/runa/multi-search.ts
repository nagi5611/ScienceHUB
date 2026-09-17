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

export type MultiSearchTaskStatus =
  | "pending"
  | "running"
  | "done"
  | "error"
  | "skipped";

export interface MultiSearchTaskCell {
  query: string;
  queryIndex: number;
  provider: MultiSearchProvider;
  status: MultiSearchTaskStatus;
  hitCount?: number;
}

const MULTI_SEARCH_PROVIDER_LABEL: Record<MultiSearchProvider, string> = {
  serpbase: "SerpBase",
  serper: "Serper",
  brave: "Brave",
  exa: "Exa",
};

function taskStatusGlyph(
  status: MultiSearchTaskStatus,
  hitCount?: number
): string {
  switch (status) {
    case "pending":
      return "○";
    case "running":
      return "▶";
    case "done":
      return hitCount !== undefined && hitCount > 0 ? `✓${hitCount}` : "✓";
    case "error":
      return "✗";
    case "skipped":
      return "−";
    default:
      return "?";
  }
}

/** ワーキング UI 向け: クエリ×プロバイダの状態一覧 */
export function formatMultiSearchWorkingDetail(
  header: string,
  queries: string[],
  cells: MultiSearchTaskCell[]
): string {
  const finished = cells.filter(
    (c) =>
      c.status === "done" ||
      c.status === "error" ||
      c.status === "skipped"
  ).length;
  const total = cells.length;
  const lines: string[] = [header, `進捗 ${finished}/${total}`, ""];

  for (let qi = 0; qi < queries.length; qi += 1) {
    const q = queries[qi] ?? "";
    const shortQ = q.length > 56 ? `${q.slice(0, 56)}…` : q;
    lines.push(`Q${qi + 1}: ${shortQ}`);
    const row = cells
      .filter((c) => c.queryIndex === qi)
      .map(
        (c) =>
          `${MULTI_SEARCH_PROVIDER_LABEL[c.provider]} ${taskStatusGlyph(c.status, c.hitCount)}`
      )
      .join("  ");
    lines.push(`  ${row}`);
  }

  return lines.join("\n");
}

function providerConfigured(
  env: Env,
  provider: MultiSearchProvider
): boolean {
  switch (provider) {
    case "serpbase":
      return isSerpBaseConfigured(env);
    case "serper":
      return isSerperConfigured(env);
    case "brave":
      return isBraveSearchConfigured(env);
    case "exa":
      return isExaConfigured(env);
    default:
      return false;
  }
}

function buildMultiSearchTaskCells(
  env: Env,
  queries: string[]
): MultiSearchTaskCell[] {
  const providers: MultiSearchProvider[] = [
    "serpbase",
    "serper",
    "brave",
    "exa",
  ];
  const cells: MultiSearchTaskCell[] = [];
  for (let qi = 0; qi < queries.length; qi += 1) {
    const query = queries[qi] ?? "";
    for (const provider of providers) {
      cells.push({
        query,
        queryIndex: qi,
        provider,
        status: providerConfigured(env, provider) ? "pending" : "skipped",
      });
    }
  }
  return cells;
}

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

export interface ExecuteMultiSearchBatchOptions {
  onProgress?: (cells: MultiSearchTaskCell[], queries: string[]) => void;
  throwIfAborted?: () => void;
}

/** 5 クエリ × 設定済み 4 プロバイダを並列実行 */
export async function executeMultiSearchBatch(
  env: Env,
  queries: string[],
  options?: ExecuteMultiSearchBatchOptions
): Promise<MultiSearchHit[]> {
  if (!hasAnyMultiSearchProvider(env)) {
    throw new Error(
      "マルチ検索 API キーが未設定です（SERPBASE / SERPER / BRAVESEARCH / EXA のいずれか）"
    );
  }

  const cells = buildMultiSearchTaskCells(env, queries);
  const notify = (): void => {
    options?.onProgress?.(cells, queries);
  };
  notify();

  const runCell = async (cell: MultiSearchTaskCell): Promise<MultiSearchHit[]> => {
    options?.throwIfAborted?.();
    cell.status = "running";
    notify();
    try {
      const hits = await fetchProviderHits(env, cell.query, cell.provider);
      cell.status = "done";
      cell.hitCount = hits.length;
      notify();
      return hits;
    } catch {
      cell.status = "error";
      cell.hitCount = 0;
      notify();
      return [];
    }
  };

  const batches = await Promise.all(
    cells.filter((c) => c.status === "pending").map((c) => runCell(c))
  );
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
  /** Runa ワーキング行の detail を逐次更新 */
  onWorkingDetail?: (detail: string) => void;
  throwIfAborted?: () => void;
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
  options?.throwIfAborted?.();
  options?.onWorkingDetail?.(
    `マルチ検索「${trimmedTopic}」\n\n検索クエリ ${MULTI_SEARCH_QUERY_COUNT} 件を計画中…`
  );
  const planOpts: PlanMultiSearchOptions = {
    ...options?.planOptions,
    focus: options?.focus ?? options?.planOptions?.focus,
  };
  const queries = await planMultiSearchQueries(env, trimmedTopic, planOpts);
  options?.throwIfAborted?.();

  const searchHeader = `マルチ検索「${trimmedTopic}」\n5 クエリ × 4 プロバイダを並列実行`;
  emit(
    "search",
    `5 クエリ × 検索プロバイダを並列実行中… (${queries.join(" / ")})`
  );
  const hits = await executeMultiSearchBatch(env, queries, {
    throwIfAborted: options?.throwIfAborted,
    onProgress: (cells, qs) => {
      options?.onWorkingDetail?.(
        formatMultiSearchWorkingDetail(searchHeader, qs, cells)
      );
    },
  });

  if (options?.skipSynthesize) {
    return { message: "", hits, queries };
  }

  emit("synthesize", "検索結果を統合して回答を作成中…");
  const message = await synthesizeMultiSearchAnswer(env, trimmedTopic, hits);
  return { message, hits, queries };
}

/** Hub ツール向け: 検索結果 digest（統合 LLM はエージェント側で 1 回） */
export function formatMultiSearchHitsForTool(
  topic: string,
  queries: string[],
  hits: MultiSearchHit[]
): string {
  const lines: string[] = [
    `マルチ検索「${topic}」`,
    `\n実行クエリ（${queries.length} 件）:`,
    ...queries.map((q, i) => `${i + 1}. ${q}`),
    `\n収集結果（${hits.length} 件）:`,
    multiSearchHitsDigest(hits, 120),
    "\n上記を踏まえ、ユーザーへの最終回答を Markdown で書いてください（出典 URL をリンクで示す）。",
  ];
  return lines.join("\n");
}
