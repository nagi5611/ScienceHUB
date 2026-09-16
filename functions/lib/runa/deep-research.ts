/**
 * Runa — ディープリサーチ（計画 → 並列 SerpBase 検索 → レポート）
 */

import type { Env, SessionUser } from "../types";
import { RunaActivityLog } from "./activity";
import type { RunaSseSend } from "./chat-sse";
import { runaChatCompletion, type ChatMessage } from "./openai";
import { insertRunaMessage } from "./messages";
import {
  isSerpBaseConfigured,
  searchImagesWithSerpBase,
  searchWebWithSerpBase,
  serpBaseImagesToRunaFiles,
} from "./serpbase";
import type { RunaFileItem } from "./tools";

const MIN_PARALLEL_ROUNDS = 3;
const MAX_PARALLEL_ROUNDS = 5;
const MAX_QUERIES_PER_ROUND = 4;
const WEB_RESULTS_PER_QUERY = 5;
const IMAGE_RESULTS_PER_QUERY = 4;

type QueryType = "web" | "image";

interface PlannedQuery {
  type: QueryType;
  q: string;
  reason: string;
}

interface DeepResearchEvidence {
  round: number;
  type: QueryType;
  query: string;
  title: string;
  url: string;
  snippet: string;
}

interface AssessmentResult {
  sufficient: boolean;
  gaps: string;
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

function emitDeepResearchProgress(
  send: RunaSseSend,
  round: number,
  phase: string,
  message: string
): void {
  send("deep_research", {
    round,
    maxRounds: MAX_PARALLEL_ROUNDS,
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

function normalizePlannedQueries(raw: unknown): PlannedQuery[] {
  if (!Array.isArray(raw)) return [];
  const out: PlannedQuery[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const q = typeof record.q === "string" ? record.q.trim() : "";
    if (!q) continue;
    const type: QueryType = record.type === "image" ? "image" : "web";
    const reason =
      typeof record.reason === "string" ? record.reason.trim().slice(0, 120) : "";
    out.push({ type, q: q.slice(0, 200), reason });
    if (out.length >= MAX_QUERIES_PER_ROUND) break;
  }
  return out;
}

function evidenceDigest(evidence: DeepResearchEvidence[]): string {
  const lines = evidence.slice(-60).map((e) => {
    const snip = e.snippet ? ` — ${e.snippet.slice(0, 120)}` : "";
    return `- [R${e.round}/${e.type}] ${e.query} → ${e.title} (${e.url})${snip}`;
  });
  return lines.join("\n") || "（まだ検索結果がありません）";
}

function dedupeEvidence(items: DeepResearchEvidence[]): DeepResearchEvidence[] {
  const seen = new Set<string>();
  const out: DeepResearchEvidence[] = [];
  for (const item of items) {
    const key = `${item.type}:${item.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function dedupeRunaFiles(files: RunaFileItem[]): RunaFileItem[] {
  const seen = new Set<string>();
  const out: RunaFileItem[] = [];
  for (const f of files) {
    const key = f.previewUrl || f.imageUrl || f.path;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
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

async function planSearchQueries(
  env: Env,
  topic: string,
  round: number,
  evidence: DeepResearchEvidence[],
  assessment?: AssessmentResult
): Promise<PlannedQuery[]> {
  const system = `あなたは Runa のディープリサーチ計画担当です。ユーザーの調査テーマに答えるため、次の並列検索クエリを JSON のみで返してください。

ルール:
- queries は 1〜${MAX_QUERIES_PER_ROUND} 件
- type は "web"（通常）または "image"（ビジュアル参考が必要なときのみ）
- q は Google 向けの短い検索語（日本語可）
- reason は日本語で 1 行
- 出力は JSON のみ

形式:
{"queries":[{"type":"web","q":"...","reason":"..."}]}`;

  const userParts = [
    `調査テーマ: ${topic}`,
    `現在のラウンド: ${round}/${MAX_PARALLEL_ROUNDS}`,
    `\nこれまでの検索結果:\n${evidenceDigest(evidence)}`,
  ];
  if (assessment?.gaps) {
    userParts.push(`\n不足・ギャップ: ${assessment.gaps}`);
  }
  if (assessment?.resolutionNotes) {
    userParts.push(`\n解像度メモ: ${assessment.resolutionNotes}`);
  }

  const data = await llmJsonCompletion(env, system, userParts.join("\n"));
  const queries = normalizePlannedQueries(data?.queries);
  if (queries.length) return queries;

  return [{ type: "web", q: topic, reason: "テーマに基づく初回検索" }];
}

async function executeParallelSearches(
  env: Env,
  queries: PlannedQuery[],
  round: number
): Promise<{ evidence: DeepResearchEvidence[]; imageFiles: RunaFileItem[] }> {
  const evidence: DeepResearchEvidence[] = [];
  const imageFiles: RunaFileItem[] = [];

  await Promise.all(
    queries.map(async (planned) => {
      try {
        if (planned.type === "image") {
          const payload = await searchImagesWithSerpBase(env, {
            query: planned.q,
            num: IMAGE_RESULTS_PER_QUERY,
          });
          imageFiles.push(
            ...serpBaseImagesToRunaFiles(
              `${planned.q}-r${round}`,
              payload.results
            )
          );
          for (const img of payload.results) {
            evidence.push({
              round,
              type: "image",
              query: planned.q,
              title: img.title,
              url: img.sourcePageUrl,
              snippet: img.domain ? `画像 (${img.domain})` : "画像結果",
            });
          }
          return;
        }

        const payload = await searchWebWithSerpBase(env, {
          query: planned.q,
          num: WEB_RESULTS_PER_QUERY,
        });
        for (const row of payload.results) {
          evidence.push({
            round,
            type: "web",
            query: planned.q,
            title: row.title,
            url: row.url,
            snippet: row.snippet,
          });
        }
      } catch {
        /* 個別失敗は握りつぶし */
      }
    })
  );

  return { evidence, imageFiles };
}

async function assessResearchProgress(
  env: Env,
  topic: string,
  evidence: DeepResearchEvidence[],
  round: number
): Promise<AssessmentResult> {
  const system = `あなたは Runa のディープリサーチ評価担当です。収集した情報がユーザーの依頼に十分答えられるか JSON のみで返してください。

形式:
{"sufficient":true|false,"gaps":"不足点（日本語）","resolutionNotes":"次に深掘りすべき観点（日本語）"}

sufficient は、ユーザーの依頼に対して実用的な回答が組み立てられると判断したときのみ true。`;

  const user = `調査テーマ: ${topic}
完了ラウンド: ${round}/${MAX_PARALLEL_ROUNDS}
最低 ${MIN_PARALLEL_ROUNDS} ラウンドは実施済み。

収集結果:
${evidenceDigest(evidence)}`;

  const data = await llmJsonCompletion(env, system, user);
  return {
    sufficient: Boolean(data?.sufficient),
    gaps: typeof data?.gaps === "string" ? data.gaps.trim() : "",
    resolutionNotes:
      typeof data?.resolutionNotes === "string"
        ? data.resolutionNotes.trim()
        : "",
  };
}

async function generateDeepResearchReport(
  env: Env,
  topic: string,
  evidence: DeepResearchEvidence[],
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
- 調査プロセスに実行ラウンド数と主な検索クエリを記載`;

  const user = `調査テーマ: ${topic}
実行ラウンド: ${roundsExecuted}
実行クエリ:
${queryLog.map((q) => `- ${q}`).join("\n")}

収集結果:
${evidenceDigest(evidence)}`;

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  const completion = await runaChatCompletion(env, messages, []);
  const report = completion.content?.trim();
  if (report) return report;

  return `## 結論\n\n調査を完了しましたが、レポート生成に失敗しました。収集件数: ${evidence.length} 件。`;
}

/** ディープリサーチセッション（UI モード / ツール共通） */
export async function runDeepResearchSession(
  env: Env,
  db: D1Database,
  user: SessionUser,
  topic: string,
  send: RunaSseSend,
  options?: { persistAssistantMessage?: boolean }
): Promise<{ message: string; files: RunaFileItem[] }> {
  const trimmedTopic = topic.trim();
  if (!trimmedTopic) {
    throw new Error("調査テーマを入力してください");
  }
  if (!isSerpBaseConfigured(env)) {
    throw new Error("ディープリサーチには SERPBASE_APIKEY の設定が必要です");
  }

  send("status", { label: "ディープリサーチ中…", phase: "working" });

  const activity = new RunaActivityLog(send);
  let evidence: DeepResearchEvidence[] = [];
  let imageFiles: RunaFileItem[] = [];
  const queryLog: string[] = [];
  let roundsExecuted = 0;
  let lastAssessment: AssessmentResult | undefined;

  for (let round = 1; round <= MAX_PARALLEL_ROUNDS; round += 1) {
    roundsExecuted = round;
    emitDeepResearchProgress(
      send,
      round,
      "plan",
      `ラウンド ${round}/${MAX_PARALLEL_ROUNDS}: 調査計画を作成しています…`
    );

    const planId = activity.start(
      "thinking",
      "thinking..",
      `ラウンド ${round}: 検索クエリを計画中`
    );
    const queries = await planSearchQueries(
      env,
      trimmedTopic,
      round,
      evidence,
      lastAssessment
    );
    activity.finish(
      planId,
      "thinking",
      queries.map((q) => `${q.type}:${q.q}`).join(", ")
    );

    for (const q of queries) {
      queryLog.push(`R${round} [${q.type}] ${q.q}`);
    }

    emitDeepResearchProgress(
      send,
      round,
      "search",
      `ラウンド ${round}/${MAX_PARALLEL_ROUNDS}: ${queries.length} 件を並列検索中…`
    );

    const workId = activity.start(
      "working",
      "working..",
      `ラウンド ${round}: 並列検索`
    );
    const batch = await executeParallelSearches(env, queries, round);
    evidence = dedupeEvidence([...evidence, ...batch.evidence]);
    imageFiles = dedupeRunaFiles([...imageFiles, ...batch.imageFiles]);
    activity.finish(workId, "working", `累計 ${evidence.length} 件`);

    if (round >= MIN_PARALLEL_ROUNDS) {
      emitDeepResearchProgress(
        send,
        round,
        "assess",
        `ラウンド ${round}/${MAX_PARALLEL_ROUNDS}: 十分性を評価中…`
      );
      const assessId = activity.start(
        "thinking",
        "thinking..",
        "収集結果を評価中"
      );
      lastAssessment = await assessResearchProgress(
        env,
        trimmedTopic,
        evidence,
        round
      );
      activity.finish(
        assessId,
        "thinking",
        lastAssessment.sufficient ? "十分" : lastAssessment.gaps || "継続"
      );

      if (lastAssessment.sufficient) break;
    }

    if (round >= MAX_PARALLEL_ROUNDS) break;
  }

  emitDeepResearchProgress(
    send,
    roundsExecuted,
    "report",
    "最終レポートを作成しています…"
  );

  const writeId = activity.start("writing", "writing..", "レポート生成中");
  const report = await generateDeepResearchReport(
    env,
    trimmedTopic,
    evidence,
    roundsExecuted,
    queryLog
  );
  activity.finish(writeId, "writing");

  streamTextDeltas(send, report);

  const files = dedupeRunaFiles(imageFiles);
  if (files.length) send("files", { items: files });

  if (options?.persistAssistantMessage !== false) {
    await insertRunaMessage(
      db,
      user.id,
      "assistant",
      report,
      files.length ? files : null
    );
  }

  send("status", { label: "", phase: "idle" });

  return { message: report, files };
}
