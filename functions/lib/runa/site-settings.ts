/**
 * Runa — 管理サイト向けサイト設定（検索プロバイダ ON/OFF 等）
 */

import { now } from "../types";

export type RunaWebSearchProvider = "serpbase" | "serper" | "brave" | "exa";

export type RunaSearchCategory = "multi_search" | "deep_research";

export type RunaSearchProviderFlags = Record<RunaWebSearchProvider, boolean>;

const SETTINGS_KEY = "search_providers";

const DEFAULT_FLAGS: RunaSearchProviderFlags = {
  serpbase: true,
  serper: true,
  brave: true,
  exa: true,
};

export interface RunaSearchProvidersSettings {
  multi_search: RunaSearchProviderFlags;
  deep_research: RunaSearchProviderFlags;
  /** true: multi_search 後に統合サマリー LLM を実行。false: メイン Runa に検索結果を渡す */
  multi_search_summarize?: boolean;
}

function normalizeFlags(raw: unknown): RunaSearchProviderFlags {
  const base = { ...DEFAULT_FLAGS };
  if (!raw || typeof raw !== "object") return base;
  const record = raw as Record<string, unknown>;
  for (const key of Object.keys(base) as RunaWebSearchProvider[]) {
    if (typeof record[key] === "boolean") base[key] = record[key];
  }
  return base;
}

const DEFAULT_SETTINGS: RunaSearchProvidersSettings = {
  multi_search: { ...DEFAULT_FLAGS },
  deep_research: { ...DEFAULT_FLAGS },
  multi_search_summarize: false,
};

function normalizeSettings(raw: unknown): RunaSearchProvidersSettings {
  if (!raw || typeof raw !== "object") {
    return {
      multi_search: { ...DEFAULT_FLAGS },
      deep_research: { ...DEFAULT_FLAGS },
      multi_search_summarize: false,
    };
  }
  const record = raw as Record<string, unknown>;
  return {
    multi_search: normalizeFlags(record.multi_search),
    deep_research: normalizeFlags(record.deep_research),
    multi_search_summarize:
      typeof record.multi_search_summarize === "boolean"
        ? record.multi_search_summarize
        : false,
  };
}

/** 検索プロバイダ設定を読み込み */
export async function getRunaSearchProvidersSettings(
  db: D1Database
): Promise<RunaSearchProvidersSettings> {
  const row = await db
    .prepare(`SELECT value_json FROM runa_site_settings WHERE key = ?`)
    .bind(SETTINGS_KEY)
    .first<{ value_json: string }>();
  if (!row?.value_json) return { ...DEFAULT_SETTINGS };
  try {
    return normalizeSettings(JSON.parse(row.value_json));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** multi_search 後の統合サマリー（synthesize）を実行するか */
export async function getRunaMultiSearchSummarizeEnabled(
  db: D1Database
): Promise<boolean> {
  const settings = await getRunaSearchProvidersSettings(db);
  return settings.multi_search_summarize === true;
}

/** カテゴリ別フラグ */
export async function getRunaSearchProviderFlags(
  db: D1Database,
  category: RunaSearchCategory
): Promise<RunaSearchProviderFlags> {
  const settings = await getRunaSearchProvidersSettings(db);
  return { ...settings[category] };
}

/** 検索プロバイダ設定を保存 */
export async function saveRunaSearchProvidersSettings(
  db: D1Database,
  settings: RunaSearchProvidersSettings
): Promise<void> {
  const normalized = normalizeSettings(settings);
  await db
    .prepare(
      `INSERT INTO runa_site_settings (key, value_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         value_json = excluded.value_json,
         updated_at = excluded.updated_at`
    )
    .bind(SETTINGS_KEY, JSON.stringify(normalized), now())
    .run();
}

export const RUNA_SEARCH_PROVIDER_LABELS: Record<RunaWebSearchProvider, string> = {
  serpbase: "SerpBase",
  serper: "Serper",
  brave: "Brave",
  exa: "Exa",
};

export const RUNA_SEARCH_PROVIDERS: RunaWebSearchProvider[] = [
  "serpbase",
  "serper",
  "brave",
  "exa",
];
