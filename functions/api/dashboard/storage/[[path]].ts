/**
 * ダッシュボード用: 1 ストレージルートの使用量
 * path: user/{username} または group/{groupSlug}
 */

import type { Env } from "../../../lib/types";
import { jsonError } from "../../../lib/types";
import { getDb } from "../../../lib/db";
import { requireUser } from "../../../lib/auth";
import { getStorageOverviewRowForDashboard } from "../../../lib/storage/overview";

function pathSegments(path: string | string[] | undefined): string[] {
  if (!path) return [];
  const raw = Array.isArray(path) ? path : [path];
  return raw
    .flatMap((p) => String(p).split("/"))
    .filter(Boolean);
}

function parseRootPath(path: string | string[] | undefined): {
  type: "user" | "group";
  key: string;
} | null {
  const segments = pathSegments(path);
  if (segments.length < 2) return null;
  const type = segments[0];
  if (type !== "user" && type !== "group") return null;
  const key = segments
    .slice(1)
    .map((part) => decodeURIComponent(part))
    .join("/");
  if (!key) return null;
  return { type, key };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parsed = parseRootPath(context.params.path);
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
