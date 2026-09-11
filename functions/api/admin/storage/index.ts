/**
 * 管理者向けストレージファイルインデックス API
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import {
  backfillStorageIndexChunk,
  listPendingBackfillRootIds,
} from "../../../lib/storage/file-index-backfill";
import { getIndexBackfillRow } from "../../../lib/storage/file-index";

/** バックフィル進捗の取得 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);
  const url = new URL(context.request.url);
  const rootId = url.searchParams.get("root_id")?.trim();

  if (!rootId) {
    const pending = await listPendingBackfillRootIds(db);
    return Response.json({ pending_root_ids: pending });
  }

  const backfill = await getIndexBackfillRow(db, rootId);
  return Response.json({ root_id: rootId, backfill });
};

interface PostBody {
  root_id?: string;
  all?: boolean;
}

/** バックフィルの次チャンクを実行 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: PostBody = {};
  try {
    body = await context.request.json<PostBody>();
  } catch {
    /* empty body ok */
  }

  const db = getDb(context.env);
  let rootId = body.root_id?.trim();

  if (!rootId && body.all) {
    const pending = await listPendingBackfillRootIds(db);
    rootId = pending[0] ?? undefined;
  }

  if (!rootId) {
    return jsonError("root_id が必要です（all=true で未完了ルートを自動選択可）", 400);
  }

  const result = await backfillStorageIndexChunk(context.env, db, rootId);
  return Response.json({ backfill: result });
};
