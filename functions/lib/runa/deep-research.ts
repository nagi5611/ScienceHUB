/**
 * Runa — ディープリサーチ（multi_search を最大 10 ラウンド + 評価ループ）
 */

import type { Env, SessionUser } from "../types";
import { RunaActivityLog } from "./activity";
import type { RunaSseSend } from "./chat-sse";
import { runaChatCompletion, type ChatMessage } from "./openai";
import { insertRunaMessage } from "./messages";
import {
  dedupeMultiSearchHits,
  executeMultiSearchBatch,
  formatMultiSearchWorkingDetail,
  hasAnyMultiSearchProvider,
  multiSearchHitsDigest,
  planMultiSearch,
  buildMultiSearchTaskCells,
  type MultiSearchAssessmentInput,
  type MultiSearchHit,
} from "./multi-search";
import { curateMultiSearchHitsForRuna } from "./multi-search-curate";
import type { RunaFileItem } from "./tools";
import type { RunaRunController } from "./run-control";
import { flushSseYield } from "./sse-flush";

/** 1 セッションあたりの multi_search ラウンド上限 */
export const DEEP_RESEARCH_MAX_MULTI_ROUNDS = 10;

const MIN_ROUNDS_BEFORE_EARLY_STOP = 1;

export interface DeepResearchAssessment {
  sufficient: boolean;
  trustworthyEnough: boolean;
  coversQuestion: boolean;
  shouldContinue: boolean;
  gaps: string;
  nextQueryDirections: string;
  resolutionNotes: string;
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

function emitDeepResearchProgress(
  send: RunaSseSend,
  round: number,
  phase: string,
  message: string,
  roundsCompleted: number
): void {
  send("deep_research", {
    round,
    maxRounds: DEEP_RESEARCH_MAX_MULTI_ROUNDS,
    searchCount: roundsCompleted,
    maxSearches: DEEP_RESEARCH_MAX_MULTI_ROUNDS,
    phase,
    message,
  });
}

function streamTextDeltas(send: RunaSseSend, text: string): void {
  const chunkSize = 12;
  for (let i = 0; i < text.length; i += chunkSize) {
    send("delta", { text: text.slice(i, i + chunkSize) });
  }
}

async function assessDeepResearchProgress(
  env: Env,
  topic: string,
  hits: MultiSearchHit[],
  round: number
): Promise<DeepResearchAssessment> {
  const system = `あなたは Runa のディープリサーチ評価担当です。収集した情報について JSON のみで返してください。

評価観点:
- sufficient: ユーザーの依頼に実用的な回答が組み立てられるか
- trustworthyEnough: 出典・内容から信頼できる情報が足りているか
- coversQuestion: 聞かれている範囲を網羅できているか
- shouldContinue: 続けて検索する価値があるか（上記3つがすべて true なら false でよい）

形式:
{"sufficient":true|false,"trustworthyEnough":true|false,"coversQuestion":true|false,"shouldContinue":true|false,"gaps":"不足（日本語）","nextQueryDirections":"次に調べるクエリの方向（日本語）","resolutionNotes":"深掘りメモ（日本語）"}`;

  const user = `調査テーマ: ${topic}
完了ラウンド: ${round}/${DEEP_RESEARCH_MAX_MULTI_ROUNDS}

収集結果:
${multiSearchHitsDigest(hits, 100)}`;

  const data = await llmJsonCompletion(env, system, user);
  return {
    sufficient: Boolean(data?.sufficient),
    trustworthyEnough: Boolean(data?.trustworthyEnough),
    coversQuestion: Boolean(data?.coversQuestion),
    shouldContinue: data?.shouldContinue !== false,
    gaps: typeof data?.gaps === "string" ? data.gaps.trim() : "",
    nextQueryDirections:
      typeof data?.nextQueryDirections === "string"
        ? data.nextQueryDirections.trim()
        : "",
    resolutionNotes:
      typeof data?.resolutionNotes === "string"
        ? data.resolutionNotes.trim()
        : "",
  };
}

function assessmentToPlanInput(
  assessment: DeepResearchAssessment
): MultiSearchAssessmentInput {
  return {
    gaps: assessment.gaps,
    nextQueryDirections: assessment.nextQueryDirections,
    resolutionNotes: assessment.resolutionNotes,
  };
}

function shouldStopResearch(
  round: number,
  assessment: DeepResearchAssessment
): boolean {
  if (round < MIN_ROUNDS_BEFORE_EARLY_STOP) return false;
  if (
    assessment.sufficient &&
    assessment.trustworthyEnough &&
    assessment.coversQuestion
  ) {
    return true;
  }
  if (!assessment.shouldContinue) return true;
  return false;
}

async function generateDeepResearchReport(
  env: Env,
  topic: string,
  hits: MultiSearchHit[],
  roundsExecuted: number,
  queryLog: string[]
): Promise<string> {
  const system = `あなたは Runa です。ディープリサーチの最終レポートを日本語 Markdown で書いてください。

構成（見出しを含める）:
## 結論
## 詳細
## 調査プロセス
## 出典

- 出典は収集結果の URL を Markdown リンク [タイトル](URL) で列挙
- 推測と事実を区別し、根拠のない断定はしない
- 調査プロセスに multi_search ラウンド数と主な検索クエリを記載`;

  const user = `調査テーマ: ${topic}
実行 multi_search ラウンド: ${roundsExecuted}/${DEEP_RESEARCH_MAX_MULTI_ROUNDS}
実行クエリ:
${queryLog.map((q) => `- ${q}`).join("\n")}

収集結果:
${multiSearchHitsDigest(hits, 120)}`;

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  const completion = await runaChatCompletion(env, messages, []);
  const report = completion.content?.trim();
  if (report) return report;

  return `## 結論\n\n調査を完了しましたが、レポート生成に失敗しました。収集件数: ${hits.length} 件。`;
}

/** ディープリサーチセッション（UI モード / ツール共通） */
export async function runDeepResearchSession(
  env: Env,
  db: D1Database,
  user: SessionUser,
  topic: string,
  send: RunaSseSend,
  options?: {
    persistAssistantMessage?: boolean;
    reportWorkingDetail?: (detail: string) => void;
    throwIfAborted?: () => void;
    control?: RunaRunController;
  }
): Promise<{ message: string; files: RunaFileItem[] }> {
  const throwIfAborted = (): void => {
    options?.throwIfAborted?.();
    options?.control?.throwIfAborted();
  };
  const trimmedTopic = topic.trim();
  if (!trimmedTopic) {
    throw new Error("調査テーマを入力してください");
  }
  if (!hasAnyMultiSearchProvider(env)) {
    throw new Error(
      "ディープリサーチには検索 API キー（SERPBASE / SERPER / BRAVESEARCH / EXA のいずれか）が必要です"
    );
  }

  send("status", { label: "ディープリサーチ中…", phase: "working" });

  const activity = new RunaActivityLog(send);
  let allHits: MultiSearchHit[] = [];
  const queryLog: string[] = [];
  let roundsExecuted = 0;
  let lastAssessment: DeepResearchAssessment | undefined;

  for (let round = 1; round <= DEEP_RESEARCH_MAX_MULTI_ROUNDS; round += 1) {
    throwIfAborted();
    roundsExecuted = round;
    emitDeepResearchProgress(
      send,
      round,
      "plan",
      `ラウンド ${round}/${DEEP_RESEARCH_MAX_MULTI_ROUNDS}: 5 件の検索クエリを計画中…`,
      round - 1
    );

    const planId = activity.start(
      "thinking",
      "thinking..",
      `ラウンド ${round}: 検索クエリを計画中`
    );
    const plan = await planMultiSearch(env, trimmedTopic, {
      round,
      evidenceDigest: multiSearchHitsDigest(allHits, 80),
      assessment: lastAssessment
        ? assessmentToPlanInput(lastAssessment)
        : undefined,
    });
    const queries = plan.queries;
    activity.finish(planId, "thinking", queries.join(", "));

    for (const q of queries) {
      queryLog.push(`R${round} ${q}`);
    }

    emitDeepResearchProgress(
      send,
      round,
      "search",
      `ラウンド ${round}: 5 クエリ × 4 プロバイダを並列検索中…`,
      round - 1
    );

    const workId = activity.start(
      "working",
      "working..",
      `ラウンド ${round}: マルチ検索実行`
    );
    const searchHeader = `ディープリサーチ「${trimmedTopic}」\nラウンド ${round}/${DEEP_RESEARCH_MAX_MULTI_ROUNDS}: 5×4 並列検索`;
    const reportWorking = async (detail: string): Promise<void> => {
      activity.update(workId, "working", detail);
      send("search_progress", { text: detail });
      await options?.reportWorkingDetail?.(detail);
      await flushSseYield();
    };
    const plannedCells = buildMultiSearchTaskCells(env, queries);
    await reportWorking(
      formatMultiSearchWorkingDetail(
        `${searchHeader}\n\nクエリ確定 — 並列検索を開始`,
        queries,
        plannedCells,
        []
      )
    );
    const { hits: batchHits, cells: finalCells } = await executeMultiSearchBatch(
      env,
      queries,
      {
        throwIfAborted,
        onProgress: async (cells, qs, hitsAccum) => {
          await reportWorking(
            formatMultiSearchWorkingDetail(searchHeader, qs, cells, hitsAccum)
          );
        },
      }
    );
    const batchDeduped = dedupeMultiSearchHits(batchHits);
    await reportWorking(
      `${searchHeader}\n\n✓ ラウンド ${round} 検索完了 (${batchDeduped.length} 件)\nキュレーション AI 実行中…`
    );
    throwIfAborted();
    const curatedBatch = await curateMultiSearchHitsForRuna(
      env,
      trimmedTopic,
      plan.informationNeeds,
      batchDeduped
    );
    allHits = dedupeMultiSearchHits([...allHits, ...curatedBatch.hits]);
    await reportWorking(
      formatMultiSearchWorkingDetail(
        `${searchHeader}\n\n✓ ラウンド ${round} キュレーション ${curatedBatch.inputCount} → ${curatedBatch.outputCount} 件 · 累計 ${allHits.length} 件`,
        queries,
        finalCells,
        curatedBatch.hits,
        { maxHitLines: 40 }
      )
    );
    activity.finish(
      workId,
      "working",
      `ラウンド ${round} 完了 · 累計 ${allHits.length} 件`
    );

    emitDeepResearchProgress(
      send,
      round,
      "assess",
      `ラウンド ${round}/${DEEP_RESEARCH_MAX_MULTI_ROUNDS}: 十分性・信頼・網羅を評価中…`,
      round
    );

    const assessId = activity.start(
      "thinking",
      "thinking..",
      "収集結果を評価中"
    );
    lastAssessment = await assessDeepResearchProgress(
      env,
      trimmedTopic,
      allHits,
      round
    );
    activity.finish(
      assessId,
      "thinking",
      lastAssessment.sufficient &&
        lastAssessment.trustworthyEnough &&
        lastAssessment.coversQuestion
        ? "完了可能"
        : lastAssessment.gaps || "継続"
    );

    if (shouldStopResearch(round, lastAssessment)) {
      break;
    }

    if (round >= DEEP_RESEARCH_MAX_MULTI_ROUNDS) break;
  }

  emitDeepResearchProgress(
    send,
    roundsExecuted,
    "report",
    "最終レポートを作成しています…",
    roundsExecuted
  );

  const writeId = activity.start("writing", "writing..", "レポート生成中");
  const report = await generateDeepResearchReport(
    env,
    trimmedTopic,
    allHits,
    roundsExecuted,
    queryLog
  );
  activity.finish(writeId, "writing");

  streamTextDeltas(send, report);

  if (options?.persistAssistantMessage !== false) {
    await insertRunaMessage(db, user.id, "assistant", report, null);
  }

  send("status", { label: "", phase: "idle" });

  return { message: report, files: [] };
}
