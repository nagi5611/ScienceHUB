/**
 * プロフィール API（取得・更新）
 */

import type { Env } from "../../lib/types";
import { jsonError } from "../../lib/types";
import { getSessionUser, requireUser } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { getUserOAuthProviders } from "../../lib/oauth-users";
import { updateUserProfile, type ProfileUpdateInput } from "../../lib/profile";
import { resolveUserAvatarUrl } from "../../lib/user-icons";
import { isPrintProfileComplete } from "../../lib/3dprint/print-profile";

async function buildProfileUser(
  env: Env,
  db: D1Database,
  user: {
    id: string;
    username: string;
    email: string;
    display_name: string;
    role_slug: string;
    avatar_url: string | null;
    homeroom?: string | null;
    student_number?: number | null;
    student_name?: string | null;
    updated_at: number;
  },
  sessionExtras: { roles: unknown[]; is_admin: boolean },
  authMeta?: { password_hash?: string }
) {
  const row =
    authMeta ??
    (await db
      .prepare("SELECT password_hash FROM users WHERE id = ?")
      .bind(user.id)
      .first<{ password_hash: string }>());

  const avatarUrl = await resolveUserAvatarUrl(env, user);
  const oauthProviders = await getUserOAuthProviders(db, user.id);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    display_name: user.display_name,
    role_slug: user.role_slug,
    avatar_url: avatarUrl,
    roles: sessionExtras.roles,
    is_admin: sessionExtras.is_admin,
    has_password: Boolean(row?.password_hash),
    oauth_providers: oauthProviders,
    homeroom: user.homeroom ?? null,
    student_number: user.student_number ?? null,
    student_name: user.student_name ?? null,
    print_profile_complete: isPrintProfileComplete({
      homeroom: user.homeroom ?? null,
      student_number: user.student_number ?? null,
      student_name: user.student_name ?? null,
    }),
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
      "SELECT avatar_url, updated_at, password_hash, homeroom, student_number, student_name FROM users WHERE id = ?"
    )
    .bind(session.id)
    .first<{
      avatar_url: string | null;
      updated_at: number;
      password_hash: string;
      homeroom: string | null;
      student_number: number | null;
      student_name: string | null;
    }>();

  return Response.json({
    user: await buildProfileUser(
      context.env,
      db,
      {
        ...session,
        avatar_url: row?.avatar_url ?? session.avatar_url,
        homeroom: row?.homeroom ?? null,
        student_number: row?.student_number ?? null,
        student_name: row?.student_name ?? null,
        updated_at: row?.updated_at ?? 0,
      },
      { roles: session.roles, is_admin: session.is_admin },
      row ?? undefined
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

  if (
    body.display_name === undefined &&
    body.email === undefined &&
    body.homeroom === undefined &&
    body.student_number === undefined &&
    body.student_name === undefined
  ) {
    return jsonError("更新する項目を指定してください", 400);
  }

  const result = await updateUserProfile(context.env, auth.id, body);
  if (result instanceof Response) return result;

  const db = getDb(context.env);

  return Response.json({
    user: await buildProfileUser(
      context.env,
      db,
      {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        display_name: result.user.display_name,
        role_slug: result.user.role_slug,
        avatar_url: result.avatar_url,
        homeroom: result.user.homeroom,
        student_number: result.user.student_number,
        student_name: result.user.student_name,
        updated_at: result.user.updated_at,
      },
      { roles: auth.roles, is_admin: auth.is_admin }
    ),
  });
};
