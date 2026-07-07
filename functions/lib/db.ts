/**
 * D1 バインディング取得
 */

import type { Env } from "./types";

/** 利用可能な D1 バインディングを返す */
export function getDb(env: Env): D1Database {
  const db = env.DB ?? env.sciencehub_db;
  if (!db) {
    throw new Error("D1 binding is not configured (DB)");
  }
  return db;
}
