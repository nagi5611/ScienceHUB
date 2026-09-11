/**
 * Runa チャット添付用ストレージパス
 */

import { parseLogicalPath } from "../storage/keys";

export const RUNA_ATTACHMENTS_DIR = ".runa-attachments";

/** 論理パスが自分の Runa 添付ディレクトリか */
export function isRunaAttachmentStoragePath(
  path: string,
  username: string
): boolean {
  const parsed = parseLogicalPath(path);
  if (!parsed || parsed.rootType !== "user" || parsed.rootKey !== username) {
    return false;
  }
  const rel = parsed.relativePath.replace(/\/+$/g, "");
  if (!rel) return false;
  return (
    rel === RUNA_ATTACHMENTS_DIR || rel.startsWith(`${RUNA_ATTACHMENTS_DIR}/`)
  );
}
