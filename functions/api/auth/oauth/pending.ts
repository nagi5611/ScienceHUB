/**
 * OAuth 新規登録待ち情報 API
 */

import type { Env } from "../../../lib/types";
import { maskEmail, readOAuthPending } from "../../../lib/oauth-pending";

const PROVIDER_LABELS = {
  google: "Google",
  microsoft: "Microsoft",
} as const;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const pending = await readOAuthPending(context.request, context.env);
  if (!pending) {
    return Response.json({ pending: null }, { status: 404 });
  }

  return Response.json({
    pending: {
      provider: pending.provider,
      provider_label: PROVIDER_LABELS[pending.provider as keyof typeof PROVIDER_LABELS],
      email_masked: maskEmail(pending.email),
      name_hint: pending.nameHint,
      next: pending.next,
    },
  });
};
