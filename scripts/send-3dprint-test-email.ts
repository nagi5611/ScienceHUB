/**
 * 3D印刷メール疎通テスト（.dev.vars の REST 設定を使用）
 * Usage: npx tsx scripts/send-3dprint-test-email.ts [recipient@example.com]
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  isEmailSendingConfigured,
  sendTransactionalEmail,
} from "../functions/lib/email/cloudflare-email.ts";
import type { Env } from "../functions/lib/types.ts";

function loadDevVars(): Partial<Env> {
  const path = resolve(process.cwd(), ".dev.vars");
  const text = readFileSync(path, "utf8");
  const env: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env as Partial<Env>;
}

const to = process.argv[2]?.trim() || "harumacci94@gmail.com";
const env = loadDevVars() as Env;

const from = env.PRINT_3D_EMAIL_FROM?.trim();
if (!isEmailSendingConfigured(env, from)) {
  console.error(
    "Missing CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, or PRINT_3D_EMAIL_FROM in .dev.vars"
  );
  process.exit(1);
}

const fromName = env.PRINT_3D_EMAIL_FROM_NAME?.trim() || "ScienceHUB 3D印刷";

const ok = await sendTransactionalEmail(env, {
  to,
  from: { email: from!, name: fromName },
  subject: "【ScienceHUB】3D印刷メール ローカルテスト",
  text: "ローカル環境からのテスト送信です（pages dev と同じ REST API）。",
  html: "<p>ローカル環境からの<strong>テスト送信</strong>です（pages dev と同じ REST API）。</p>",
  replyTo: env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
});

if (!ok) {
  console.error("Send failed — check token permissions and PRINT_3D_EMAIL_FROM domain.");
  process.exit(1);
}

console.log(`OK: test email sent to ${to}`);
