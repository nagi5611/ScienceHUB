/**
 * 管理者向けストレージクォータ API
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import {
  listAllStorageRoots,
  updateRootQuota,
} from "../../../lib/storage/quota";
import { backfillStorageRoots } from "../../../lib/storage/roots";

/** ストレージルート一覧 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);
  const url = new URL(context.request.url);

  if (url.searchParams.get("backfill") === "1") {
    const result = await backfillStorageRoots(context.env, db);
    return Response.json({ backfill: result });
  }

  const roots = await listAllStorageRoots(db);
  return Response.json({
    roots: roots.map((r: Awaited<ReturnType<typeof listAllStorageRoots>>[number]) => ({
      id: r.id,
      root_type: r.root_type,
      quota_bytes: r.quota_bytes,
      used_bytes: r.used_bytes,
      username: r.username,
      user_display_name: r.user_display_name,
      group_slug: r.group_slug,
      group_display_name: r.group_display_name,
    })),
  });
};

interface PatchBody {
  root_id?: string;
  quota_bytes?: number;
}

/** クォータ更新 */
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  let body: PatchBody;
  try {
    body = await context.request.json<PatchBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const rootId = body.root_id?.trim();
  const quotaBytes = Number(body.quota_bytes);
  if (!rootId || !Number.isFinite(quotaBytes)) {
    return jsonError("root_id と quota_bytes が必要です", 400);
  }

  const db = getDb(context.env);
  const error = await updateRootQuota(db, rootId, quotaBytes);
  if (error) return jsonError(error, 400);

  return Response.json({ ok: true });
};
