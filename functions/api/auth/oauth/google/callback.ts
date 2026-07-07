/**
 * Google OAuth コールバック
 */

import type { Env } from "../../../../lib/types";
import {
  handleOAuthCallback,
  oauthLoginErrorRedirect,
} from "../../../../lib/oauth";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    return await handleOAuthCallback(context.request, context.env, "google");
  } catch (error) {
    console.error("Google OAuth callback failed:", error);
    return oauthLoginErrorRedirect(
      context.request,
      context.env,
      "Google ログイン処理でエラーが発生しました"
    );
  }
};
