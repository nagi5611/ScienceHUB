/**
 * Runa 環境変数（LUNA_* からの移行フォールバック付き）
 */

import type { Env } from "../types";

type LegacyRunaEnv = Env & {
  LUNA_OPENAI_API_KEY?: string;
  LUNA_OPENAI_BASE_URL?: string;
  LUNA_MODEL?: string;
  LUNA_AI_GATEWAY_ID?: string;
  LUNA_MAX_DAILY_TURNS?: string;
  LUNA_MAX_TOOL_ROUNDS?: string;
};

function legacy(env: Env): LegacyRunaEnv {
  return env as LegacyRunaEnv;
}

export function runaOpenAiApiKey(env: Env): string | undefined {
  const e = legacy(env);
  return e.RUNA_OPENAI_API_KEY?.trim() || e.LUNA_OPENAI_API_KEY?.trim();
}

export function runaOpenAiBaseUrl(env: Env): string | undefined {
  const e = legacy(env);
  return e.RUNA_OPENAI_BASE_URL?.trim() || e.LUNA_OPENAI_BASE_URL?.trim();
}

export function runaModel(env: Env): string | undefined {
  const e = legacy(env);
  return e.RUNA_MODEL?.trim() || e.LUNA_MODEL?.trim();
}

export function runaAiGatewayId(env: Env): string | undefined {
  const e = legacy(env);
  return e.RUNA_AI_GATEWAY_ID?.trim() || e.LUNA_AI_GATEWAY_ID?.trim();
}

export function runaMaxDailyTurns(env: Env): string | undefined {
  const e = legacy(env);
  return e.RUNA_MAX_DAILY_TURNS?.trim() || e.LUNA_MAX_DAILY_TURNS?.trim();
}

export function runaMaxToolRounds(env: Env): string | undefined {
  const e = legacy(env);
  return e.RUNA_MAX_TOOL_ROUNDS?.trim() || e.LUNA_MAX_TOOL_ROUNDS?.trim();
}

export function runaMaxDailyImages(env: Env): string | undefined {
  return env.RUNA_MAX_DAILY_IMAGES?.trim();
}
