/**
 * ウェブサイト公開 — R2 キー
 */

import { R2_ROOT_PREFIX } from "./constants";

/** サイトの R2 プレフィックス */
export function siteR2Prefix(dirName: string): string {
  return `${R2_ROOT_PREFIX}/${dirName}/`;
}

/** サイト内オブジェクトの R2 キー */
export function siteObjectKey(dirName: string, relativePath: string): string {
  return `${siteR2Prefix(dirName)}${relativePath}`;
}
