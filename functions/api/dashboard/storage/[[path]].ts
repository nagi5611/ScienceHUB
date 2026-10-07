/**
 * ダッシュボード用: 1 ストレージルートの使用量
 * path: user/{username} または group/{groupSlug}
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import { requireUser } from "../../../lib/auth";
import { getStorageOverviewRowForDashboard } from "../../../lib/storage/overview";

function parseRootPath(path: string | undefined): {
  type: "user" | "group";
  key: string;
} | null {
  if (!path) return null;
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  const type = segments[0];
  if (type !== "user" && type !== "group") return null;
  const key = decodeURIComponent(segments.slice(1).join("/"));
  if (!key) return null;
  return { type, key };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parsed = parseRootPath(context.params.path as string | undefined);
  if (!parsed) {
    return jsonError("ストレージルートの指定が不正です", 400);
  }

  const db = getDb(context.env);
  const row = await getStorageOverviewRowForDashboard(
    context.env,
    db,
    auth,
    parsed.type,
    parsed.key
  );
  if (!row) {
    return jsonError("ストレージルートが見つからないか、アクセス権がありません", 404);
  }

  return Response.json({ root: row });
};
