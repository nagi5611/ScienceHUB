/**
 * 認証必須ページ用ミドルウェア
 */

import type { Env } from "./lib/types";
import { getSessionUser } from "./lib/auth";
import {
  getAdminSessionUser,
  isAdminLoginPath,
  isAdminPanelPath,
} from "./lib/admin-session";

const PUBLIC_PREFIXES = ["/css/", "/js/", "/login"];

function normalizePath(pathname: string): string {
  if (pathname === "" || pathname === "/index.html") return "/";
  return pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

function isPublicAsset(path: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function isProtectedPage(path: string): boolean {
  return path === "/" || path.startsWith("/apps") || path.startsWith("/join");
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const path = normalizePath(url.pathname);

  if (path.startsWith("/login") || isPublicAsset(path) || isAdminLoginPath(path)) {
    return context.next();
  }

  if (isAdminPanelPath(path)) {
    const adminUser = await getAdminSessionUser(context.request, context.env);
    if (!adminUser) {
      const next = encodeURIComponent(url.pathname + url.search);
      return Response.redirect(`${url.origin}/admin/login.html?next=${next}`, 302);
    }
    return context.next();
  }

  if (!isProtectedPage(path)) {
    return context.next();
  }

  const user = await getSessionUser(context.request, context.env);
  if (!user) {
    const next = encodeURIComponent(url.pathname + url.search);
    return Response.redirect(`${url.origin}/login/?next=${next}`, 302);
  }

  return context.next();
};
