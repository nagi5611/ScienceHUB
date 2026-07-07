/**
 * グループ一覧・作成 API（管理者）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getDb } from "../../lib/db";
import { createGroup, listGroupsWithDetails } from "../../lib/groups";
import { ensureGroupStorageRoot } from "../../lib/storage/roots";

interface CreateGroupBody {
  display_name?: string;
  slug?: string;
  description?: string;
  color?: string;
  is_root?: boolean;
  google_calendar_id?: string | null;
  overall_calendar_name?: string | null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = getDb(context.env);
  const groups = await listGroupsWithDetails(db);
  return Response.json({ groups });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: CreateGroupBody;
  try {
    body = await context.request.json<CreateGroupBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const displayName = body.display_name?.trim() ?? "";
  if (!displayName) {
    return jsonError("グループ名を入力してください", 400);
  }

  try {
    const group = await createGroup(getDb(context.env), {
      display_name: displayName,
      slug: body.slug,
      description: body.description,
      color: body.color,
      is_root: body.is_root === true,
      google_calendar_id: body.google_calendar_id,
      overall_calendar_name: body.overall_calendar_name,
    });

    if (!group) {
      return jsonError("グループの作成に失敗しました", 500);
    }

    await ensureGroupStorageRoot(
      context.env,
      getDb(context.env),
      group.id,
      group.slug,
      "admin"
    );

    return Response.json({ group }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "グループの作成に失敗しました";
    return jsonError(message, 400);
  }
};
