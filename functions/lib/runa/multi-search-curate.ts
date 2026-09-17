/**
 * Runa — マルチ検索後の Qwen キュレーション（重複・無関係除去）
 */

import type { Env } from "../types";
import { runaMultiSearchSummarizeModel } from "./env";
import type { MultiSearchHit } from "./multi-search";
import { runaChatCompletion, type ChatMessage } from "./openai";

const MAX_HITS_FOR_CURATOR = 100;
const MAX_CURATED_FOR_TOOL = 48;

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

function normalizeKeepIndices(raw: unknown, maxIndex: number): number[] {
  if (!Array.isArray(raw)) return [];
  const out: number[] = [];
  for (const item of raw) {
    const n =
      typeof item === "number"
        ? item
        : typeof item === "string"
          ? Number.parseInt(item, 10)
          : NaN;
    if (!Number.isFinite(n)) continue;
    const idx = Math.floor(n);
    if (idx >= 1 && idx <= maxIndex && !out.includes(idx)) out.push(idx);
  }
  return out;
}

function formatHitsNumbered(hits: MultiSearchHit[]): string {
  return hits
    .map((h, i) => {
      const snip = h.snippet ? ` | ${h.snippet.slice(0, 160)}` : "";
      return `${i + 1}. [${h.provider}] Q:${h.query} | ${h.title} | ${h.url}${snip}`;
    })
    .join("\n");
}

export interface CurateMultiSearchResult {
  hits: MultiSearchHit[];
  inputCount: number;
  outputCount: number;
  usedLlm: boolean;
}

/**
 * URL 重複除去後、Workers AI で同一内容・無関係ヒットを落とし、メイン Runa 用に絞る。
 */
export async function curateMultiSearchHitsForRuna(
  env: Env,
  topic: string,
  informationNeeds: string[],
  hits: MultiSearchHit[]
): Promise<CurateMultiSearchResult> {
  const inputCount = hits.length;
  if (inputCount === 0) {
    return { hits: [], inputCount: 0, outputCount: 0, usedLlm: false };
  }

  const slice = hits.slice(0, MAX_HITS_FOR_CURATOR);
  const needsBlock =
    informationNeeds.length > 0
      ? informationNeeds.map((n, i) => `${i + 1}. ${n}`).join("\n")
      : "1. ユーザーの質問に直接答える事実\n2. 信頼できる一次・準一次情報\n3. 矛盾や不確かさの手がかり";

  const system = `あなたは Runa の検索結果キュレーション担当です。並列 Web 検索で集めたヒット一覧から、**メインの Runa が最終回答を書くために必要な行だけ**を選びます。

優先:
- 同一 URL・同一記事の重複は 1 件に
- タイトル/スニペットが同じ話題の重複も 1 件に
- 調査テーマと informationNeeds に無関係な行は除外
- 残す行は多様な観点をカバー（最大 ${MAX_CURATED_FOR_TOOL} 件）

出力は JSON のみ:
{"keep_indices":[1,3,5]}
keep_indices は上記リストの行番号（1 始まり）の配列。`;

  const user = `調査テーマ: ${topic.trim()}

必要な情報の観点:
${needsBlock}

検索ヒット（${slice.length} 件）:
${formatHitsNumbered(slice)}`;

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];

  const model = runaMultiSearchSummarizeModel(env);
  try {
    const completion = await runaChatCompletion(env, messages, [], { model });
    const raw = completion.content?.trim();
    const data = raw ? extractJsonObject(raw) : null;
    const indices = normalizeKeepIndices(data?.keep_indices, slice.length);
    if (indices.length > 0) {
      const curated = indices
        .map((idx) => slice[idx - 1])
        .filter((h): h is MultiSearchHit => Boolean(h))
        .slice(0, MAX_CURATED_FOR_TOOL);
      return {
        hits: curated,
        inputCount,
        outputCount: curated.length,
        usedLlm: true,
      };
    }
  } catch {
    /* fallback below */
  }

  const fallback = slice.slice(0, MAX_CURATED_FOR_TOOL);
  return {
    hits: fallback,
    inputCount,
    outputCount: fallback.length,
    usedLlm: false,
  };
}

/** キュレーション済みヒットの短い digest（ツール結果用） */
export function curatedMultiSearchDigest(hits: MultiSearchHit[]): string {
  const lines = hits.slice(0, MAX_CURATED_FOR_TOOL).map((h) => {
    const snip = h.snippet ? ` — ${h.snippet.slice(0, 120)}` : "";
    return `- [${h.provider}] ${h.query} → ${h.title} (${h.url})${snip}`;
  });
  return lines.join("\n") || "（キュレーション後の結果がありません）";
}
