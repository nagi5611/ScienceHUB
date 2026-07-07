/**
 * Google OAuth 開始
 */

import type { Env } from "../../../../lib/types";
import {
  buildGoogleAuthorizeUrl,
  buildOAuthStartResponse,
} from "../../../../lib/oauth";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const authorizeUrl = buildGoogleAuthorizeUrl(context.request, context.env);
  if (authorizeUrl instanceof Response) {
    return authorizeUrl;
  }
  return buildOAuthStartResponse(
    context.request,
    context.env,
    "google",
    authorizeUrl
  );
};
