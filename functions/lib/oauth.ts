/**
 * OAuth 2.0 ヘルパー（Google / Microsoft）
 */

import type { Env } from "./types";
import {
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_TTL_SEC,
  SESSION_TTL_MS,
  clearOAuthStateCookie,
  createId,
  setOAuthStateCookie,
  setSessionCookie,
} from "./types";
import { createSession } from "./auth";
import { getDb } from "./db";
import {
  createOAuthPendingToken,
  setOAuthPendingCookie,
} from "./oauth-pending";
import { findExistingOAuthUser, type OAuthProvider } from "./oauth-users";

export type { OAuthProvider };

interface OAuthState {
  state: string;
  provider: OAuthProvider;
  next: string;
}

interface TokenResponse {
  access_token: string;
  id_token?: string;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
}

interface MicrosoftUserInfo {
  id: string;
  mail?: string | null;
  userPrincipalName?: string;
  displayName?: string;
}

/** リダイレクトベース URL を取得する */
export function getOAuthRedirectBase(request: Request, env: Env): string {
  const configured = env.OAUTH_REDIRECT_BASE?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  return new URL(request.url).origin;
}

/** callback URL を組み立てる */
export function getOAuthCallbackUrl(
  request: Request,
  env: Env,
  provider: OAuthProvider
): string {
  return `${getOAuthRedirectBase(request, env)}/api/auth/oauth/${provider}/callback`;
}

/** ログイン後リダイレクト先を検証する */
export function sanitizeOAuthNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/";
}

/** HTTPS リクエストか判定する */
export function isSecureRequest(request: Request): boolean {
  const url = new URL(request.url);
  if (url.protocol === "https:") return true;
  return request.headers.get("X-Forwarded-Proto") === "https";
}

/** OAuth state Cookie を読み取る */
export function readOAuthState(request: Request): OAuthState | null {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${OAUTH_STATE_COOKIE}=([^;]+)`)
  );
  if (!match?.[1]) return null;

  try {
    const decoded = decodeURIComponent(match[1]);
    const payload = JSON.parse(decoded) as OAuthState;
    if (!payload.state || !payload.provider) return null;
    return payload;
  } catch {
    return null;
  }
}

/** OAuth 開始レスポンス（IdP へリダイレクト） */
export function buildOAuthStartResponse(
  request: Request,
  _env: Env,
  provider: OAuthProvider,
  authorizeUrl: string
): Response {
  const url = new URL(request.url);
  const next = sanitizeOAuthNext(url.searchParams.get("next"));
  const state = createId("oauth");

  const payload: OAuthState = { state, provider, next };
  const stateCookie = setOAuthStateCookie(
    JSON.stringify(payload),
    OAUTH_STATE_TTL_SEC,
    isSecureRequest(request)
  );

  const authUrl = new URL(authorizeUrl);
  authUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      "Set-Cookie": stateCookie,
    },
  });
}

/** OAuth エラー時にログインページへリダイレクトする */
export function oauthLoginErrorRedirect(
  request: Request,
  env: Env,
  message: string
): Response {
  const loginUrl = new URL("/login/", getOAuthRedirectBase(request, env));
  loginUrl.searchParams.set("error", message);
  const headers = new Headers({
    Location: loginUrl.toString(),
    "Set-Cookie": clearOAuthStateCookie(isSecureRequest(request)),
  });
  return new Response(null, { status: 302, headers });
}

/** OAuth ログイン完了（セッション発行） */
export async function completeOAuthLogin(
  request: Request,
  env: Env,
  userId: string,
  next: string
): Promise<Response> {
  const db = getDb(env);
  const sessionId = await createSession(db, userId);
  const maxAgeSec = Math.floor(SESSION_TTL_MS / 1000);
  const secure = isSecureRequest(request);

  const headers = new Headers({
    Location: sanitizeOAuthNext(next),
  });
  headers.append("Set-Cookie", setSessionCookie(sessionId, maxAgeSec, secure));
  headers.append("Set-Cookie", clearOAuthStateCookie(secure));

  return new Response(null, { status: 302, headers });
}

/** state を検証する */
export function validateOAuthState(
  request: Request,
  provider: OAuthProvider,
  returnedState: string | null
): { ok: true; next: string } | { ok: false; error: string } {
  const stored = readOAuthState(request);
  if (!stored) {
    return { ok: false, error: "OAuth セッションが無効です。もう一度お試しください。" };
  }
  if (stored.provider !== provider) {
    return { ok: false, error: "OAuth プロバイダが一致しません。" };
  }
  if (!returnedState || returnedState !== stored.state) {
    return { ok: false, error: "OAuth 状態の検証に失敗しました。" };
  }
  return { ok: true, next: stored.next };
}

/** OAuth 認証後のユーザー処理（既存ログイン or プロフィール入力へ） */
async function handleOAuthUserResolution(
  request: Request,
  env: Env,
  next: string,
  profile: {
    provider: OAuthProvider;
    subject: string;
    email: string;
    nameHint: string;
  }
): Promise<Response> {
  const db = getDb(env);
  const existing = await findExistingOAuthUser(db, {
    provider: profile.provider,
    subject: profile.subject,
    email: profile.email,
  });

  if (existing) {
    return completeOAuthLogin(request, env, existing.id, next);
  }

  const token = await createOAuthPendingToken(
    {
      provider: profile.provider,
      subject: profile.subject,
      email: profile.email,
      nameHint: profile.nameHint,
      next,
    },
    env
  );

  if (!token) {
    return oauthLoginErrorRedirect(
      request,
      env,
      "新規登録の準備に失敗しました"
    );
  }

  const secure = isSecureRequest(request);
  const profileUrl = new URL("/login/profile.html", getOAuthRedirectBase(request, env));

  const headers = new Headers({
    Location: profileUrl.toString(),
  });
  headers.append("Set-Cookie", setOAuthPendingCookie(token, secure));
  headers.append("Set-Cookie", clearOAuthStateCookie(secure));

  return new Response(null, { status: 302, headers });
}

/** Google 認可 URL を組み立てる */
export function buildGoogleAuthorizeUrl(
  request: Request,
  env: Env
): string | Response {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return oauthLoginErrorRedirect(
      request,
      env,
      "Google ログインが設定されていません"
    );
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", getOAuthCallbackUrl(request, env, "google"));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

/** Microsoft 認可 URL を組み立てる */
export function buildMicrosoftAuthorizeUrl(
  request: Request,
  env: Env
): string | Response {
  const clientId = env.MICROSOFT_CLIENT_ID?.trim();
  const tenant = env.MICROSOFT_TENANT_ID?.trim() || "common";
  if (!clientId) {
    return oauthLoginErrorRedirect(
      request,
      env,
      "Microsoft ログインが設定されていません"
    );
  }

  const url = new URL(
    `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/authorize`
  );
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", getOAuthCallbackUrl(request, env, "microsoft"));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile User.Read");
  url.searchParams.set("response_mode", "query");
  return url.toString();
}

/** Google code をトークンに交換しユーザーを確定する */
export async function handleGoogleCallback(
  request: Request,
  env: Env,
  code: string,
  next: string
): Promise<Response> {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return oauthLoginErrorRedirect(
      request,
      env,
      "Google ログインが設定されていません"
    );
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getOAuthCallbackUrl(request, env, "google"),
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    console.error("Google token exchange failed:", await tokenRes.text());
    return oauthLoginErrorRedirect(
      request,
      env,
      "Google 認証に失敗しました"
    );
  }

  const tokens = await tokenRes.json<TokenResponse>();
  const profileRes = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }
  );

  if (!profileRes.ok) {
    console.error("Google userinfo failed:", await profileRes.text());
    return oauthLoginErrorRedirect(
      request,
      env,
      "Google プロフィールの取得に失敗しました"
    );
  }

  const profile = await profileRes.json<GoogleUserInfo>();
  if (!profile.sub) {
    return oauthLoginErrorRedirect(request, env, "Google アカウント情報が不正です");
  }
  if (!profile.email) {
    return oauthLoginErrorRedirect(
      request,
      env,
      "Google アカウントにメールアドレスがありません"
    );
  }

  const email = profile.email.trim().toLowerCase();
  const nameHint =
    profile.name?.trim() || email.split("@")[0] || "User";

  return handleOAuthUserResolution(request, env, next, {
    provider: "google",
    subject: profile.sub,
    email,
    nameHint,
  });
}

/** Microsoft code をトークンに交換しユーザーを確定する */
export async function handleMicrosoftCallback(
  request: Request,
  env: Env,
  code: string,
  next: string
): Promise<Response> {
  const clientId = env.MICROSOFT_CLIENT_ID?.trim();
  const clientSecret = env.MICROSOFT_CLIENT_SECRET?.trim();
  const tenant = env.MICROSOFT_TENANT_ID?.trim() || "common";
  if (!clientId || !clientSecret) {
    return oauthLoginErrorRedirect(
      request,
      env,
      "Microsoft ログインが設定されていません"
    );
  }

  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: getOAuthCallbackUrl(request, env, "microsoft"),
        grant_type: "authorization_code",
      }),
    }
  );

  if (!tokenRes.ok) {
    console.error("Microsoft token exchange failed:", await tokenRes.text());
    return oauthLoginErrorRedirect(
      request,
      env,
      "Microsoft 認証に失敗しました"
    );
  }

  const tokens = await tokenRes.json<TokenResponse>();
  const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!profileRes.ok) {
    console.error("Microsoft Graph /me failed:", await profileRes.text());
    return oauthLoginErrorRedirect(
      request,
      env,
      "Microsoft プロフィールの取得に失敗しました"
    );
  }

  const profile = await profileRes.json<MicrosoftUserInfo>();
  const email = (profile.mail ?? profile.userPrincipalName ?? "").trim().toLowerCase();
  if (!profile.id || !email) {
    return oauthLoginErrorRedirect(
      request,
      env,
      "Microsoft アカウントにメールアドレスがありません"
    );
  }

  const nameHint =
    profile.displayName?.trim() || email.split("@")[0] || "User";

  return handleOAuthUserResolution(request, env, next, {
    provider: "microsoft",
    subject: profile.id,
    email,
    nameHint,
  });
}

/** OAuth callback 共通処理 */
export async function handleOAuthCallback(
  request: Request,
  env: Env,
  provider: OAuthProvider
): Promise<Response> {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  if (error) {
    const description = url.searchParams.get("error_description") ?? error;
    return oauthLoginErrorRedirect(request, env, description);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCheck = validateOAuthState(request, provider, state);
  if (!stateCheck.ok) {
    return oauthLoginErrorRedirect(request, env, stateCheck.error);
  }

  if (!code) {
    return oauthLoginErrorRedirect(request, env, "認可コードがありません");
  }

  if (provider === "google") {
    return handleGoogleCallback(request, env, code, stateCheck.next);
  }
  return handleMicrosoftCallback(request, env, code, stateCheck.next);
}
