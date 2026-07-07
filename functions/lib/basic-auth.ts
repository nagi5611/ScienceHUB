/**
 * 管理者パネル用認証資格情報
 */

import type { Env } from "./types";

/** 定数時間で文字列を比較する */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** 管理者認証の期待値を取得する */
export function getAdminBasicCredentials(env: Env): {
  username: string;
  password: string;
} | null {
  const password = env.ADMIN_BASIC_PASSWORD?.trim();
  if (!password) {
    return null;
  }
  return {
    username: env.ADMIN_BASIC_USER?.trim() || "admin",
    password,
  };
}

/** 管理者資格情報を検証する */
export function verifyAdminCredentials(
  username: string,
  password: string,
  env: Env
): boolean {
  const expected = getAdminBasicCredentials(env);
  if (!expected) {
    return false;
  }

  return (
    safeEqual(username.trim(), expected.username) &&
    safeEqual(password, expected.password)
  );
}
