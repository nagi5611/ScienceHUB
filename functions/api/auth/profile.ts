/**
 * プロフィール API（取得・更新）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getSessionUser, requireUser } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { updateUserProfile, type ProfileUpdateInput } from "../../lib/profile";
import { resolveUserAvatarUrl } from "../../lib/user-icons";

async function buildPublicUser(
  env: Env,
  user: {
    id: string;
    username: string;
    email: string;
    display_name: string;
    role_slug: string;
    avatar_url: string | null;
    updated_at: number;
  },
  sessionExtras: { roles: unknown[]; is_admin: boolean }
) {
  const avatarUrl = await resolveUserAvatarUrl(env, user);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    display_name: user.display_name,
    role_slug: user.role_slug,
    avatar_url: avatarUrl,
    roles: sessionExtras.roles,
    is_admin: sessionExtras.is_admin,
  };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const session = await getSessionUser(context.request, context.env);
  if (!session) {
    return Response.json({ user: null }, { status: 401 });
  }

  const db = getDb(context.env);
  const row = await db
    .prepare(
      "SELECT avatar_url, updated_at FROM users WHERE id = ?"
    )
    .bind(session.id)
    .first<{ avatar_url: string | null; updated_at: number }>();

  return Response.json({
    user: await buildPublicUser(
      context.env,
      {
        ...session,
        avatar_url: row?.avatar_url ?? session.avatar_url,
        updated_at: row?.updated_at ?? 0,
      },
      { roles: session.roles, is_admin: session.is_admin }
    ),
  });
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const auth = await requireUser(context.request, context.env);
  if (auth instanceof Response) return auth;

  let body: ProfileUpdateInput;
  try {
    body = await context.request.json<ProfileUpdateInput>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  if (body.display_name === undefined && body.email === undefined) {
    return jsonError("更新する項目を指定してください", 400);
  }

  const result = await updateUserProfile(context.env, auth.id, body);
  if (result instanceof Response) return result;

  return Response.json({
    user: await buildPublicUser(
      context.env,
      {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        display_name: result.user.display_name,
        role_slug: result.user.role_slug,
        avatar_url: result.avatar_url,
        updated_at: result.user.updated_at,
      },
      { roles: auth.roles, is_admin: auth.is_admin }
    ),
  });
};
