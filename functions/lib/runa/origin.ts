/**
 * Runa — 公開 URL のオリジン（ユーザー向けリンク用）
 */

import type { Env } from "../types";

export const RUNA_PUBLIC_ORIGIN_DEFAULT = "https://s.mmh-virtual.jp";

/** ユーザーに返す公開サイトのベース URL（末尾スラッシュなし） */
export function resolveRunaPublicOrigin(env: Env): string {
  const raw = env.OAUTH_REDIRECT_BASE?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return RUNA_PUBLIC_ORIGIN_DEFAULT;
}

/** ウェブサイト公開の完全 URL */
export function buildRunaPublicWebUrl(
  env: Env,
  pathSlug: string,
  relativePath = ""
): string {
  const origin = resolveRunaPublicOrigin(env);
  const trimmed = relativePath.replace(/^\/+/, "");
  if (!trimmed || trimmed === "index.html") {
    return `${origin}/web/${pathSlug}/`;
  }
  return `${origin}/web/${pathSlug}/${trimmed}`;
}

/** 共有リンク等で Request.origin が必要なとき */
export function buildRunaOriginRequest(env: Env): Request {
  return new Request(`${resolveRunaPublicOrigin(env)}/`);
}
