/**
 * Q&A 意味検索（FTS/LIKE 候補 + Gemini ランキング）
 */

import type { Env } from "../types";
import { getDb } from "../db";
import { geminiGenerateJson } from "../gemini/generate";
import { resolveTpLiteModel } from "../third-party/tp-flash";
import { QA_SEARCH_CANDIDATES } from "./constants";

export interface QaSearchHit {
  id: string;
  title: string;
  snippet: string;
}

const RANK_SCHEMA = {
  type: "object",
  properties: {
    ids: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["ids"],
};

/** 公開済み質問をキーワードで候補取得する */
export async function fetchQaSearchCandidates(
  db: D1Database,
  query: string,
  limit = QA_SEARCH_CANDIDATES
): Promise<QaSearchHit[]> {
  const q = query.trim();
  if (!q) return [];

  const pattern = `%${q.replace(/[%_]/g, "")}%`;
  const { results } = await db
    .prepare(
      `SELECT q.id, q.title, q.body
       FROM manual_qa_questions q
       WHERE q.moderation_status = 'approved'
         AND (
           q.title LIKE ?1
           OR q.body LIKE ?1
           OR EXISTS (
             SELECT 1 FROM manual_qa_posts p
             WHERE p.question_id = q.id AND p.body LIKE ?1
           )
         )
       ORDER BY q.pinned DESC, q.created_at DESC
       LIMIT ?2`
    )
    .bind(pattern, limit)
    .all<{ id: string; title: string; body: string }>();

  return (results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    snippet: (row.body || "").slice(0, 240),
  }));
}

/** 意味検索で関連度順の ID 一覧を返す */
export async function searchManualQa(
  env: Env,
  query: string
): Promise<{ ids: string[]; candidates: QaSearchHit[] }> {
  const db = getDb(env);
  const candidates = await fetchQaSearchCandidates(db, query);
  if (!candidates.length) {
    return { ids: [], candidates: [] };
  }

  if (!env.GEMINI_API_KEY?.trim()) {
    return { ids: candidates.map((c) => c.id), candidates };
  }

  const payload = {
    query: query.trim().slice(0, 300),
    candidates: candidates.map((c) => ({
      id: c.id,
      title: c.title.slice(0, 200),
      snippet: c.snippet.slice(0, 200),
    })),
  };

  try {
    const raw = await geminiGenerateJson<{ ids?: string[] }>(env, {
      model: resolveTpLiteModel(env),
      systemInstruction:
        "ユーザーの検索クエリに最も関連する Q&A の id を、関連度の高い順に ids 配列で返してください。候補に無い id は含めないでください。該当が無ければ空配列。",
      prompt: JSON.stringify(payload),
      responseMimeType: "application/json",
      responseSchema: RANK_SCHEMA,
      temperature: 0.1,
      maxOutputTokens: 1024,
      usageLabel: "manual_qa_search",
    });

    const allowed = new Set(candidates.map((c) => c.id));
    const ids = (raw.ids ?? []).filter((id) => typeof id === "string" && allowed.has(id));
    if (ids.length) {
      return { ids, candidates };
    }
  } catch (error) {
    console.warn("manual_qa_search gemini failed", error);
  }

  return { ids: candidates.map((c) => c.id), candidates };
}
