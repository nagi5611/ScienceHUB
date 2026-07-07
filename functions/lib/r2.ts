/**
 * R2 バインディング取得
 */

import type { Env } from "./types";

/** 利用可能な R2 バインディングを返す */
export function getFiles(env: Env): R2Bucket {
  const bucket = env.FILES ?? env.sciencehub_files;
  if (!bucket) {
    throw new Error("R2 binding is not configured (FILES)");
  }
  return bucket;
}
