/**
 * Q&A 投稿の Gemini 精査
 */

import type { Env } from "../types";
import { geminiGenerateJson } from "../gemini/generate";
import { resolveTpLiteModel } from "../third-party/tp-flash";

export interface QaModerationResult {
  approved: boolean;
  userMessage: string;
}

const MODERATION_SCHEMA = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    userMessage: { type: "string" },
  },
  required: ["approved", "userMessage"],
};

const SYSTEM = `あなたは高校の3Dプリンター利用ガイド Q&A の投稿審査担当です。
質問や追記が次のいずれかに該当する場合は approved を false にし、丁寧な日本語で userMessage に理由を書いてください。
- 誹謗中傷・暴言・いじめ
- 個人の連絡先・住所などの個人情報の投稿
- 学校・部活と無関係なスパム・広告
- 危険行為の助長（無理な改造の推奨など）

該当しなければ approved を true、userMessage は空文字にしてください。`;

/** 質問・追記本文を精査する */
export async function moderateQaContent(
  env: Env,
  input: { title?: string; body: string }
): Promise<QaModerationResult> {
  if (!env.GEMINI_API_KEY?.trim()) {
    return { approved: true, userMessage: "" };
  }

  const titlePart = input.title?.trim()
    ? `title: ${input.title.trim().slice(0, 500)}`
    : "";
  const prompt = [titlePart, `body: ${input.body.trim().slice(0, 4000)}`]
    .filter(Boolean)
    .join("\n");

  const raw = await geminiGenerateJson<{ approved?: boolean; userMessage?: string }>(
    env,
    {
      model: resolveTpLiteModel(env),
      systemInstruction: SYSTEM,
      prompt,
      responseMimeType: "application/json",
      responseSchema: MODERATION_SCHEMA,
      temperature: 0.1,
      maxOutputTokens: 512,
      usageLabel: "manual_qa_moderation",
    }
  );

  if (raw.approved === false) {
    const msg =
      typeof raw.userMessage === "string" && raw.userMessage.trim()
        ? raw.userMessage.trim().slice(0, 500)
        : "内容を確認できませんでした。表現を見直して再度お試しください。";
    return { approved: false, userMessage: msg };
  }

  return { approved: true, userMessage: "" };
}
