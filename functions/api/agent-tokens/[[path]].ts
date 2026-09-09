/**
 * AI エージェント用トークン API（Cookie セッション必須）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import {
  createAgentToken,
  listAgentTokens,
  revokeAgentToken,
} from "../../lib/agent-tokens";

function parseRoute(path: string | string[] | undefined): string[] {
  if (Array.isArray(path)) return path.filter(Boolean);
  return (path ?? "").split("/").filter(Boolean);
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method.toUpperCase();
  const segments = parseRoute(context.params.path);
  const tokenId = segments[0] ?? "";

  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;

  const db = getDb(env);

  try {
    if (method === "GET" && segments.length === 0) {
      const tokens = await listAgentTokens(db, auth.id);
      return Response.json({ tokens });
    }

    if (method === "POST" && segments.length === 0) {
      const body = await request.json<{ name?: string; scopes?: string[] }>();
      const name = body.name?.trim() ?? "";
      if (!name) return jsonError("トークン名が必要です", 400);

      const result = await createAgentToken(db, auth.id, name, body.scopes);
      return Response.json(result, { status: 201 });
    }

    if (method === "DELETE" && segments.length === 1) {
      const revoked = await revokeAgentToken(db, auth.id, tokenId);
      if (!revoked) return jsonError("トークンが見つかりません", 404);
      return Response.json({ ok: true });
    }

    return jsonError("Not Found", 404);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "リクエストに失敗しました";
    return jsonError(message, 400);
  }
};
