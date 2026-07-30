/**
 * サードパーティ — ブラウザ検証（Browser Run / 静的フォールバック）
 */

import type { Env } from "../types";
import {
  ARTIFACT_INDEX,
  ARTIFACT_VERIFY_JSON,
  ARTIFACT_VERIFY_PNG,
  getArtifact,
  putArtifact,
} from "./artifacts";
import { analyzeIndexHtml, formatAnalyzeReport } from "./static-analyze";
import { triggerVerifyOnWorker, isTpPipelineWorkerConfigured } from "./pipeline-client";

export interface BrowserVerifyResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  title?: string;
  bodyLength?: number;
  screenshotStored?: boolean;
  source: "browser" | "static" | "worker";
}

const VERIFY_JSON_SCHEMA_VERSION = 1;

/** R2 に保存する検証レポート */
export async function storeVerifyReport(
  bucket: R2Bucket,
  dirName: string,
  result: BrowserVerifyResult
): Promise<void> {
  const payload = {
    version: VERIFY_JSON_SCHEMA_VERSION,
    at: Date.now(),
    passed: result.passed,
    errors: result.errors,
    warnings: result.warnings,
    title: result.title,
    bodyLength: result.bodyLength,
    screenshotStored: result.screenshotStored ?? false,
    source: result.source,
  };
  await putArtifact(
    bucket,
    dirName,
    ARTIFACT_VERIFY_JSON,
    JSON.stringify(payload, null, 2),
    "application/json; charset=utf-8"
  );
}

/** 静的解析のみの検証（フォールバック） */
export function verifyHtmlStatic(html: string): BrowserVerifyResult {
  const report = analyzeIndexHtml(html);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (report.brace_balance_warning) {
    errors.push("波括弧のバランスが不正の可能性があります");
  }
  if (report.quote_balance_warning) {
    errors.push("引用符のバランスが不正の可能性があります");
  }
  if (!/<html\b/i.test(html) || !/<\/html>/i.test(html)) {
    errors.push("HTML ドキュメント構造が不完全です");
  }

  warnings.push(report.summary);
  if (formatAnalyzeReport(report).includes("clear")) {
    warnings.push("クリア関連のコードを検出しました（動作確認推奨）");
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    source: "static",
  };
}

/** プロジェクト HTML を検証（Worker 優先、未設定時は静的） */
export async function verifyProjectHtml(
  env: Env,
  bucket: R2Bucket,
  projectId: string,
  dirName: string,
  options?: { autoRepair?: boolean; userReport?: string }
): Promise<BrowserVerifyResult> {
  const html = await getArtifact(bucket, dirName, ARTIFACT_INDEX);
  if (!html?.trim()) {
    return {
      passed: false,
      errors: ["index.html が空です"],
      warnings: [],
      source: "static",
    };
  }

  if (isTpPipelineWorkerConfigured(env)) {
    const workerResult = await triggerVerifyOnWorker(env, projectId, dirName, {
      autoRepair: options?.autoRepair,
      userReport: options?.userReport,
    });
    if (workerResult.ok && workerResult.body && typeof workerResult.body === "object") {
      const b = workerResult.body as Record<string, unknown>;
      const result: BrowserVerifyResult = {
        passed: Boolean(b.passed),
        errors: Array.isArray(b.errors) ? (b.errors as string[]) : [],
        warnings: Array.isArray(b.warnings) ? (b.warnings as string[]) : [],
        title: typeof b.title === "string" ? b.title : undefined,
        bodyLength: typeof b.bodyLength === "number" ? b.bodyLength : undefined,
        screenshotStored: Boolean(b.screenshotStored),
        source: "worker",
      };
      await storeVerifyReport(bucket, dirName, result);
      return result;
    }
  }

  const staticResult = verifyHtmlStatic(html);
  await storeVerifyReport(bucket, dirName, staticResult);
  return staticResult;
}

/** 検証レポート JSON を読む */
export async function loadVerifyReport(
  bucket: R2Bucket,
  dirName: string
): Promise<BrowserVerifyResult | null> {
  const raw = await getArtifact(bucket, dirName, ARTIFACT_VERIFY_JSON);
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as Record<string, unknown>;
    return {
      passed: Boolean(j.passed),
      errors: Array.isArray(j.errors) ? (j.errors as string[]) : [],
      warnings: Array.isArray(j.warnings) ? (j.warnings as string[]) : [],
      title: typeof j.title === "string" ? j.title : undefined,
      bodyLength: typeof j.bodyLength === "number" ? j.bodyLength : undefined,
      screenshotStored: Boolean(j.screenshotStored),
      source:
        j.source === "browser" || j.source === "worker" || j.source === "static"
          ? j.source
          : "static",
    };
  } catch {
    return null;
  }
}

export { ARTIFACT_VERIFY_PNG };
