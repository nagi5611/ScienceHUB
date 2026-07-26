// functions/lib/simulation/fds-primary-review.ts

import type { Env } from "../types";
import {
  FDS_OFFICIAL_MANUALS_URL,
  getFdsSyntaxReferenceForReview,
} from "./fds-review-syntax-reference";

export const FDS_PRIMARY_REVIEW_FAILED_CODE = "FDS_PRIMARY_REVIEW_FAILED";

/** Default model; override with GEMINI_FDS_REVIEW_MODEL. Structured output works best on 2.5+. */
export const DEFAULT_GEMINI_FDS_REVIEW_MODEL = "gemini-2.5-flash";

const MAX_FDS_LINES_FOR_REVIEW = 500;
const MAX_FDS_CHARS_FOR_REVIEW = 20_000;

const FDS_REVIEW_TRUNCATION_NOTE =
  "...（以下、ファイルは続きます。一次審査では先頭500行・20000文字までを渡しています）";

/** Gemini controlled generation schema (has_defects + reasons). */
const FDS_REVIEW_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    has_defects: {
      type: "BOOLEAN",
      description:
        "FDS入力が実行開始できない、または重大な構文・参照エラー・安全上の問題がある場合のみ true。T_END が依頼の最大実行時間より短いだけでは false。",
    },
    reasons: {
      type: "ARRAY",
      items: { type: "STRING" },
      description:
        "has_defects が true のとき、実行不能に直結する指摘のみ日本語で最大8件。false のときは空配列。",
    },
  },
  required: ["has_defects", "reasons"],
} as const;

export interface FdsPrimaryReviewResult {
  passed: boolean;
  issues: string[];
  model: string;
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
}

/** Reads FDS as UTF-8; truncates to at most 500 lines and 20000 characters for primary review. */
export function extractFdsTextForReview(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder("utf-8");
  const full = decoder.decode(buffer);
  const lineCount = full === "" ? 0 : full.split(/\r?\n/).length;
  const withinLimits =
    lineCount <= MAX_FDS_LINES_FOR_REVIEW && full.length <= MAX_FDS_CHARS_FOR_REVIEW;
  if (withinLimits) return full;

  const lines = full.split(/\r?\n/);
  let truncated = lines.slice(0, MAX_FDS_LINES_FOR_REVIEW).join("\n");
  if (truncated.length > MAX_FDS_CHARS_FOR_REVIEW) {
    truncated = truncated.slice(0, MAX_FDS_CHARS_FOR_REVIEW);
  }
  return `${truncated}\n\n${FDS_REVIEW_TRUNCATION_NOTE}`;
}

/** Coerces API / model boolean fields. */
function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1) return true;
  if (value === "false" || value === 0) return false;
  return undefined;
}

/** Normalizes issue strings from model output. */
function normalizeIssueList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }
  return value.map((s) => String(s).trim()).filter(Boolean).slice(0, 12);
}

/** Parses JSON text from Gemini (strips optional markdown fences). */
function parseJsonFromModelText(text: string): unknown {
  let trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON object not found");
    }
    return JSON.parse(jsonMatch[0]);
  }
}

/** Maps structured review JSON to passed / issues (supports legacy passed/issues). */
export function normalizeFdsReviewPayload(raw: unknown): { passed: boolean; issues: string[] } {
  if (!raw || typeof raw !== "object") {
    throw new Error("invalid payload type");
  }
  const record = raw as Record<string, unknown>;

  if ("has_defects" in record) {
    const hasDefects = toBoolean(record.has_defects);
    if (hasDefects === undefined) {
      throw new Error("invalid has_defects");
    }
    const reasons = normalizeIssueList(record.reasons);
    if (hasDefects) {
      return { passed: false, issues: reasons };
    }
    return { passed: true, issues: [] };
  }

  const passed = toBoolean(record.passed);
  if (passed === undefined) {
    throw new Error("missing has_defects or passed");
  }
  const issues = normalizeIssueList(record.issues);
  if (!passed && issues.length === 0) {
    issues.push("一次審査で問題が検出されました（詳細は担当者が確認します）");
  }
  return { passed, issues: passed ? [] : issues };
}

/**
 * Removes known false positives (e.g. T_END shorter than platform max-runtime quota).
 * Max runtime hours is an EC2 wall-clock cap, not required simulation duration.
 */
export function filterFdsPrimaryReviewFalsePositives(issues: string[]): string[] {
  return issues.filter((issue) => !isTEndVsMaxRuntimeQuotaMismatchIssue(issue));
}

function isTEndVsMaxRuntimeQuotaMismatchIssue(issue: string): boolean {
  if (!/T_END|&TIME/i.test(issue)) return false;
  if (!/最大実行時間|実行時間.*時間|依頼.*時間|ウォール|上限/.test(issue)) return false;
  return /乖離|不一致|すぐに終了|終了してしま|短い|長い|満たしていない|合っていない/.test(issue);
}

/** Runs Gemini primary review on FDS input text. */
export async function reviewFdsInputWithGemini(
  env: Env,
  fdsText: string,
  context: { filename: string; mpiProcesses: number; maxRuntimeHours: number }
): Promise<FdsPrimaryReviewResult> {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("一次審査（AI）が設定されていません。管理者に GEMINI_API_KEY を連絡してください");
  }

  const model = env.GEMINI_FDS_REVIEW_MODEL?.trim() || DEFAULT_GEMINI_FDS_REVIEW_MODEL;
  const syntaxReference = getFdsSyntaxReferenceForReview(env);

  const prompt = `あなたは FDS（Fire Dynamics Simulator）入力ファイルの事前審査担当です。
依頼者がクラウドで実行する前に、明らかな設定ミス・実行不能・安全上問題になりうる記述をチェックしてください。

公式マニュアル（人間向け）: ${FDS_OFFICIAL_MANUALS_URL}
審査では、下記「FDS 構文リファレンス」を FDS User's Guide に基づく正とみなし、キーワード・namelist 名・参照関係の妥当性をそれに照らして判断してください。

ファイル名: ${context.filename}
MPI プロセス数（依頼値）: ${context.mpiProcesses}
クラウド実行のウォールクロック上限（時間・依頼値）: ${context.maxRuntimeHours}
※ 上記はインフラ側の「長く走りすぎないための上限」であり、&TIME の T_END（シミュレーション終了時刻・秒）と一致させる必要はない。T_END=10秒など短いケースは正常。

合格基準（重要）:
- 実行可能な最低要件を満たせば has_defects=false とする
- 必須 namelist の欠落、参照 ID の不存在、メッシュ定義の破綻、明らかな構文エラーなど「FDS が起動・計算開始できない」類のみ true
- T_END が上限時間より短い・長いこと自体、依頼者の意図と異なる計画時間、軽微なモデル簡略化は不合格理由にしない
- T_END やメッシュが極端で、見積もりが上限を確実に超え計算が途中打ち切られる恐れがある場合のみ、負荷面の指摘をしてよい（それでも構文だけ正しければ任意）

次の観点で確認してください（軽微な文体やコメントの有無は指摘不要）:
- &HEAD / &MESH / &TIME など必須 namelist の欠落や矛盾
- メッシュ・時間ステップが非現実的で実行開始前に明らかに破綻する場合（極端な DT 等）
- MPI 数とメッシュ分割の明らかな不整合（OPENMP/MPI 関連の記述がある場合）
- 境界条件・換気・火源の欠落や明らかな誤り
- 単位系やキーワードの誤記で実行が失敗しそうな箇所

出力はスキーマどおり:
- has_defects: 欠陥がなければ false、あれば true
- reasons: has_defects が true のときだけ日本語で具体的な指摘を最大8件。false のときは []

ファイル末尾に「以下、ファイルは続きます」とある場合は先頭500行・20000文字の抜粋です。抜粋内で判断できる範囲のみ審査し、見えない後半だけを理由に has_defects=true にしないでください。

--- FDS 構文リファレンス（一次審査用要約） ---
${syntaxReference}

--- FDS ファイル内容 ---
${fdsText}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: FDS_REVIEW_RESPONSE_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("Gemini FDS review failed:", res.status, errText.slice(0, 800));
    if (res.status === 404) {
      throw new Error(
        `一次審査（AI）のモデル "${model}" が使えません。GEMINI_FDS_REVIEW_MODEL を gemini-2.5-flash 等に設定してください`
      );
    }
    throw new Error("一次審査（AI）の呼び出しに失敗しました。しばらくしてから再度お試しください");
  }

  const data = (await res.json()) as GeminiGenerateResponse;

  const blockReason = data.promptFeedback?.blockReason;
  if (blockReason) {
    console.error("Gemini FDS review blocked:", blockReason);
    throw new Error("一次審査（AI）が入力をブロックしました。ファイル内容を確認してください");
  }

  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) {
    console.error(
      "Gemini FDS review empty candidate:",
      candidate?.finishReason ?? "no finishReason"
    );
    throw new Error("一次審査（AI）から応答がありませんでした");
  }

  let normalized: { passed: boolean; issues: string[] };
  try {
    const raw = parseJsonFromModelText(text);
    normalized = normalizeFdsReviewPayload(raw);
  } catch (parseErr) {
    console.error(
      "Gemini FDS review parse failed:",
      parseErr instanceof Error ? parseErr.message : parseErr,
      text.slice(0, 400)
    );
    throw new Error("一次審査（AI）の結果を解釈できませんでした");
  }

  let { passed, issues } = normalized;
  const beforeFilterCount = issues.length;
  issues = filterFdsPrimaryReviewFalsePositives(issues);
  if (!passed && beforeFilterCount > 0 && issues.length === 0) {
    passed = true;
  }
  if (!passed && issues.length === 0) {
    issues = ["一次審査で問題が検出されました（詳細は担当者が確認します）"];
  }

  return {
    passed,
    issues: passed ? [] : issues,
    model,
  };
}
