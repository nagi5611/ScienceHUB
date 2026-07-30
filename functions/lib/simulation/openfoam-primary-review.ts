// functions/lib/simulation/openfoam-primary-review.ts

import type { Env } from "../types";
import {
  OPENFOAM_OFFICIAL_DOCS_URL,
  getOpenfoamSyntaxReferenceForReview,
} from "./openfoam-review-syntax-reference";

export { extractOpenfoamTextForReview } from "./openfoam-zip-extract";

export const OPENFOAM_PRIMARY_REVIEW_FAILED_CODE = "OPENFOAM_PRIMARY_REVIEW_FAILED";

export const DEFAULT_GEMINI_OPENFOAM_REVIEW_MODEL = "gemini-2.5-flash";

const OPENFOAM_REVIEW_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    has_defects: {
      type: "BOOLEAN",
      description:
        "OpenFOAM ケースが実行開始できない、または重大な設定・参照エラーがある場合のみ true。endTime が依頼の最大実行時間より短いだけでは false。",
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

export interface OpenfoamPrimaryReviewResult {
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

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1) return true;
  if (value === "false" || value === 0) return false;
  return undefined;
}

function normalizeIssueList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }
  return value.map((s) => String(s).trim()).filter(Boolean).slice(0, 12);
}

function parseJsonFromModelText(text: string): unknown {
  let trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON object not found");
    return JSON.parse(jsonMatch[0]);
  }
}

export function normalizeOpenfoamReviewPayload(raw: unknown): { passed: boolean; issues: string[] } {
  if (!raw || typeof raw !== "object") throw new Error("invalid payload type");
  const record = raw as Record<string, unknown>;

  if ("has_defects" in record) {
    const hasDefects = toBoolean(record.has_defects);
    if (hasDefects === undefined) throw new Error("invalid has_defects");
    const reasons = normalizeIssueList(record.reasons);
    return hasDefects ? { passed: false, issues: reasons } : { passed: true, issues: [] };
  }

  const passed = toBoolean(record.passed);
  if (passed === undefined) throw new Error("missing has_defects or passed");
  const issues = normalizeIssueList(record.issues);
  if (!passed && issues.length === 0) {
    issues.push("一次審査で問題が検出されました（詳細は担当者が確認します）");
  }
  return { passed, issues: passed ? [] : issues };
}

/** Runs Gemini primary review on extracted OpenFOAM case text. */
export async function reviewOpenfoamInputWithGemini(
  env: Env,
  caseText: string,
  context: { filename: string; mpiProcesses: number; maxRuntimeHours: number }
): Promise<OpenfoamPrimaryReviewResult> {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("一次審査（AI）が設定されていません。管理者に GEMINI_API_KEY を連絡してください");
  }

  const model = env.GEMINI_OPENFOAM_REVIEW_MODEL?.trim() || DEFAULT_GEMINI_OPENFOAM_REVIEW_MODEL;
  const syntaxReference = getOpenfoamSyntaxReferenceForReview(env);

  const prompt = `あなたは OpenFOAM ケースの事前審査担当です。
依頼者がクラウドで実行する前に、明らかな設定ミス・実行不能・重大な参照エラーをチェックしてください。

公式ドキュメント: ${OPENFOAM_OFFICIAL_DOCS_URL}

ファイル名: ${context.filename}
MPI プロセス数（依頼値）: ${context.mpiProcesses}
クラウド実行のウォールクロック上限（時間）: ${context.maxRuntimeHours}
※ 上記はインフラ側の上限であり、controlDict の endTime と一致させる必要はない。

合格基準:
- 抽出された辞書から判断して実行開始可能なら has_defects=false
- 必須ファイル欠落、ソルバー名誤り、明らかな参照エラーのみ true
- 軽微なモデル簡略化や意図的に短い endTime は不合格理由にしない

--- OpenFOAM 構文リファレンス ---
${syntaxReference}

--- ケースから抽出した内容 ---
${caseText}`;

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
        responseSchema: OPENFOAM_REVIEW_RESPONSE_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("Gemini OpenFOAM review failed:", res.status, errText.slice(0, 800));
    throw new Error("一次審査（AI）の呼び出しに失敗しました。しばらくしてから再度お試しください");
  }

  const data = (await res.json()) as GeminiGenerateResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("一次審査（AI）から応答がありませんでした");

  let { passed, issues } = normalizeOpenfoamReviewPayload(parseJsonFromModelText(text));
  if (!passed && issues.length === 0) {
    issues = ["一次審査で問題が検出されました（詳細は担当者が確認します）"];
  }

  return { passed, issues: passed ? [] : issues, model };
}
