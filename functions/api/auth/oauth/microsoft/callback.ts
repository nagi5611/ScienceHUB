/**
 * Microsoft OAuth コールバック
 */

import type { Env } from "../../../../lib/types";
import {
  handleOAuthCallback,
  oauthLoginErrorRedirect,
} from "../../../../lib/oauth";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    return await handleOAuthCallback(context.request, context.env, "microsoft");
  } catch (error) {
    console.error("Microsoft OAuth callback failed:", error);
    return oauthLoginErrorRedirect(
      context.request,
      context.env,
      "Microsoft ログイン処理でエラーが発生しました"
    );
  }
};
