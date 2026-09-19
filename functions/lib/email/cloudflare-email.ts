// functions/lib/email/cloudflare-email.ts
/**
 * Cloudflare Email Service — Pages Functions 向け REST API 送信
 * @see https://developers.cloudflare.com/email-service/api/send-emails/rest-api/
 */

import type { Env } from "../types";

const EMAIL_SEND_URL = (accountId: string) =>
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`;

export interface TransactionalEmailMessage {
  to: string;
  from: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

interface CloudflareEmailSendResult {
  delivered?: string[];
  permanent_bounces?: string[];
  queued?: string[];
}

interface CloudflareApiResponse {
  success: boolean;
  errors?: Array<{ code: number; message: string }>;
  result: CloudflareEmailSendResult | null;
}

function resolveApiToken(env: Env): string | undefined {
  return env.CLOUDFLARE_API_TOKEN?.trim();
}

function resolveAccountId(env: Env): string | undefined {
  return env.CLOUDFLARE_ACCOUNT_ID?.trim();
}

/** Returns true when REST send credentials and from address are set. */
export function isEmailSendingConfigured(
  env: Env,
  fromAddress: string | undefined
): boolean {
  return Boolean(
    resolveAccountId(env) && resolveApiToken(env) && fromAddress?.trim()
  );
}

function restFromField(from: { email: string; name?: string }): string | {
  address: string;
  name: string;
} {
  const email = from.email.trim();
  const name = from.name?.trim();
  if (name) return { address: email, name };
  return email;
}

/** Sends a transactional email via Email Service REST API; logs errors and returns false on failure. */
export async function sendTransactionalEmail(
  env: Env,
  message: TransactionalEmailMessage
): Promise<boolean> {
  const accountId = resolveAccountId(env);
  const token = resolveApiToken(env);
  if (!accountId || !token) {
    console.warn("Email send skipped: CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN missing");
    return false;
  }

  const payload: Record<string, unknown> = {
    to: message.to,
    from: restFromField(message.from),
    subject: message.subject,
    html: message.html,
    text: message.text,
  };
  if (message.replyTo?.trim()) {
    payload.reply_to = message.replyTo.trim();
  }

  try {
    const res = await fetch(EMAIL_SEND_URL(accountId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as CloudflareApiResponse;

    if (!res.ok || !data.success) {
      const detail =
        data.errors?.map((e) => `${e.code}: ${e.message}`).join("; ") ||
        res.statusText;
      console.error("Email REST send failed:", res.status, detail);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Email REST send error:", err);
    return false;
  }
}
