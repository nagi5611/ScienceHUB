/**
 * Runa 検索プロバイダ — 管理画面用接続テスト
 */

import type { Env } from "../types";
import { isSerpBaseConfigured, searchWebWithSerpBase } from "./serpbase";
import { isSerperConfigured, searchWebWithSerper } from "./serper";
import { isBraveSearchConfigured, searchWebWithBrave } from "./brave-search";
import { isExaConfigured, searchWebWithExa } from "./exa";

export type RunaSearchProviderId = "serpbase" | "serper" | "brave" | "exa";

const PROVIDER_LABELS: Record<RunaSearchProviderId, string> = {
  serpbase: "SerpBase",
  serper: "Serper",
  brave: "Brave Search",
  exa: "Exa",
};

const TEST_QUERY = "connection test";

export interface SearchProviderTestResult {
  ok: boolean;
  provider: RunaSearchProviderId;
  label: string;
  configured: boolean;
  message: string;
  resultCount?: number;
}

function isProviderId(value: string): value is RunaSearchProviderId {
  return value === "serpbase" || value === "serper" || value === "brave" || value === "exa";
}

/** 指定プロバイダの API バックエンド接続を最小検索で確認 */
export async function runSearchProviderTest(
  env: Env,
  provider: RunaSearchProviderId
): Promise<SearchProviderTestResult> {
  const label = PROVIDER_LABELS[provider];

  if (provider === "serpbase") {
    if (!isSerpBaseConfigured(env)) {
      return {
        ok: false,
        provider,
        label,
        configured: false,
        message: "API キーが未設定です（SERPBASE_APIKEY）",
      };
    }
    const payload = await searchWebWithSerpBase(env, { query: TEST_QUERY, num: 1 });
    const count = payload.results.length;
    return {
      ok: true,
      provider,
      label,
      configured: true,
      message: `接続成功（検索結果 ${count} 件）`,
      resultCount: count,
    };
  }

  if (provider === "serper") {
    if (!isSerperConfigured(env)) {
      return {
        ok: false,
        provider,
        label,
        configured: false,
        message: "API キーが未設定です（SERPER_APIKEY）",
      };
    }
    const payload = await searchWebWithSerper(env, { query: TEST_QUERY, num: 1 });
    const count = payload.results.length;
    return {
      ok: true,
      provider,
      label,
      configured: true,
      message: `接続成功（検索結果 ${count} 件）`,
      resultCount: count,
    };
  }

  if (provider === "brave") {
    if (!isBraveSearchConfigured(env)) {
      return {
        ok: false,
        provider,
        label,
        configured: false,
        message: "API キーが未設定です（BRAVESEARCH_APIKEY）",
      };
    }
    const payload = await searchWebWithBrave(env, { query: TEST_QUERY, num: 1 });
    const count = payload.results.length;
    return {
      ok: true,
      provider,
      label,
      configured: true,
      message: `接続成功（検索結果 ${count} 件）`,
      resultCount: count,
    };
  }

  if (!isExaConfigured(env)) {
    return {
      ok: false,
      provider,
      label,
      configured: false,
      message: "API キーが未設定です（EXA_API_KEY）",
    };
  }
  const payload = await searchWebWithExa(env, { query: TEST_QUERY, num: 1 });
  const count = payload.results.length;
  return {
    ok: true,
    provider,
    label,
    configured: true,
    message: `接続成功（検索結果 ${count} 件）`,
    resultCount: count,
  };
}

export function parseSearchProviderId(value: string | undefined): RunaSearchProviderId | null {
  if (!value || !isProviderId(value)) return null;
  return value;
}
