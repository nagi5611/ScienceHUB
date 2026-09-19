/**
 * ローカル開発用: 3D印刷メール送信の疎通テスト（本番では DEV_EMAIL_TEST_SECRET 未設定で 404）
 */

import type { Env } from "../../lib/types";
import { sendTransactionalEmail, isEmailSendingConfigured } from "../../lib/email/cloudflare-email";

interface TestBody {
  to?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const secret = context.env.DEV_EMAIL_TEST_SECRET?.trim();
  if (!secret) {
    return new Response("Not Found", { status: 404 });
  }

  const provided = context.request.headers.get("X-Dev-Email-Test-Secret")?.trim();
  if (provided !== secret) {
    return new Response("Forbidden", { status: 403 });
  }

  let body: TestBody = {};
  try {
    body = await context.request.json<TestBody>();
  } catch {
    body = {};
  }

  const to = (body.to ?? "").trim();
  if (!to) {
    return Response.json({ ok: false, error: "to required" }, { status: 400 });
  }

  const from = context.env.PRINT_3D_EMAIL_FROM?.trim();
  if (!isEmailSendingConfigured(context.env, from)) {
    return Response.json(
      {
        ok: false,
        error:
          "CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, PRINT_3D_EMAIL_FROM が .dev.vars に必要です",
      },
      { status: 503 }
    );
  }

  const fromName =
    context.env.PRINT_3D_EMAIL_FROM_NAME?.trim() || "ScienceHUB 3D印刷";
  const ok = await sendTransactionalEmail(context.env, {
    to,
    from: { email: from!, name: fromName },
    subject: "【ScienceHUB】3D印刷メール ローカルテスト",
    text: "wrangler pages dev からのテスト送信です。",
    html: "<p>wrangler pages dev からの<strong>テスト送信</strong>です。</p>",
    replyTo: context.env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
  });

  return Response.json({ ok, to });
};
