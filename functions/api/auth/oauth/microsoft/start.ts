/**
 * Microsoft OAuth 開始
 */

import type { Env } from "../../../../lib/types";
import {
  buildMicrosoftAuthorizeUrl,
  buildOAuthStartResponse,
} from "../../../../lib/oauth";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const authorizeUrl = buildMicrosoftAuthorizeUrl(context.request, context.env);
  if (authorizeUrl instanceof Response) {
    return authorizeUrl;
  }
  return buildOAuthStartResponse(
    context.request,
    context.env,
    "microsoft",
    authorizeUrl
  );
};
