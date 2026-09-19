// functions/lib/3dprint/reservation-email.ts
import type { PrintScale } from "./slots";
import type { Reservation } from "./reservations";
import type { Env } from "../types";
import { isEmailSendingConfigured, sendTransactionalEmail } from "../email/cloudflare-email";

const SCALE_LABELS: Record<PrintScale, string> = {
  small: "スモール",
  medium: "ミディアム",
  large: "ラージ",
};

const DEFAULT_FROM_NAME = "ScienceHUB 3D印刷";

export type PrintReservationEmailKind = "applied" | "accepted";

interface ApplicantEmailPayload {
  kind: PrintReservationEmailKind;
  reservation: Pick<
    Reservation,
    "id" | "title" | "desired_date" | "print_scale"
  >;
  printerName?: string | null;
  printStaffLabel?: string | null;
  reservationAppUrl: string;
}

/** Loads the applicant's email from D1. */
export async function getUserEmailById(
  db: D1Database,
  userId: string
): Promise<string | null> {
  const row = await db
    .prepare("SELECT email FROM users WHERE id = ?")
    .bind(userId)
    .first<{ email: string }>();
  const email = row?.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;
  return email;
}

function getFromAddress(env: Env): string | undefined {
  return env.PRINT_3D_EMAIL_FROM?.trim();
}

function getFromName(env: Env): string {
  return env.PRINT_3D_EMAIL_FROM_NAME?.trim() || DEFAULT_FROM_NAME;
}

function buildApplicantMessage(payload: ApplicantEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const scale =
    SCALE_LABELS[payload.reservation.print_scale] ??
    payload.reservation.print_scale;
  const printerLine = payload.printerName
    ? `プリンター: ${payload.printerName}\n`
    : "";
  const common = `タイトル: ${payload.reservation.title}
希望印刷日: ${payload.reservation.desired_date}
印刷規模: ${scale}
${printerLine}予約ID: ${payload.reservation.id}
`;

  if (payload.kind === "applied") {
    const subject = "【ScienceHUB】3D印刷の予約申請を受け付けました";
    const text = `${subject}

予約申請を受け付けました。担当者が内容を確認し、受領後に確定します。

${common}
予約の確認: ${payload.reservationAppUrl}

※このメールに心当たりがない場合は破棄してください。`;
    const html = `<p>予約申請を受け付けました。担当者が内容を確認し、<strong>受領後に確定</strong>します。</p>
<ul>
<li>タイトル: ${escapeHtml(payload.reservation.title)}</li>
<li>希望印刷日: ${escapeHtml(payload.reservation.desired_date)}</li>
<li>印刷規模: ${escapeHtml(scale)}</li>
${payload.printerName ? `<li>プリンター: ${escapeHtml(payload.printerName)}</li>` : ""}
<li>予約ID: ${escapeHtml(payload.reservation.id)}</li>
</ul>
<p><a href="${escapeHtml(payload.reservationAppUrl)}">予約アプリで確認</a></p>
<p style="color:#666;font-size:12px">このメールに心当たりがない場合は破棄してください。</p>`;
    return { subject, html, text };
  }

  const staff = payload.printStaffLabel ?? "担当者";
  const subject = "【ScienceHUB】3D印刷の予約が確定しました";
  const text = `${subject}

予約が確定しました。

${common}印刷担当: ${staff}

予約の確認: ${payload.reservationAppUrl}`;
  const html = `<p>3D印刷の予約が<strong>確定</strong>しました。</p>
<ul>
<li>タイトル: ${escapeHtml(payload.reservation.title)}</li>
<li>希望印刷日: ${escapeHtml(payload.reservation.desired_date)}</li>
<li>印刷規模: ${escapeHtml(scale)}</li>
${payload.printerName ? `<li>プリンター: ${escapeHtml(payload.printerName)}</li>` : ""}
<li>印刷担当: ${escapeHtml(staff)}</li>
<li>予約ID: ${escapeHtml(payload.reservation.id)}</li>
</ul>
<p><a href="${escapeHtml(payload.reservationAppUrl)}">予約アプリで確認</a></p>`;
  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Sends a transactional email to the user who created the reservation. */
export async function notifyApplicantPrintReservationEmail(
  env: Env,
  db: D1Database,
  userId: string,
  payload: ApplicantEmailPayload
): Promise<void> {
  const from = getFromAddress(env);
  if (!isEmailSendingConfigured(env, from)) {
    return;
  }

  const to = await getUserEmailById(db, userId);
  if (!to) {
    console.warn("3D print applicant email skipped: no user email", userId);
    return;
  }

  const { subject, html, text } = buildApplicantMessage(payload);
  await sendTransactionalEmail(env, {
    to,
    from: { email: from!, name: getFromName(env) },
    subject,
    html,
    text,
    replyTo: env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
  });
}

/** Public path to the 3D print reservation app. */
export function build3dPrintReservationAppUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/apps/3dprint-reservation/`;
}

/** Sends a test email from the admin UI (same transport as reservation notices). */
export async function sendPrintReservationAdminTestEmail(
  env: Env,
  to: string
): Promise<{ ok: boolean; error?: string }> {
  const from = getFromAddress(env);
  if (!isEmailSendingConfigured(env, from)) {
    return {
      ok: false,
      error:
        "メール送信の設定がありません（CLOUDFLARE_ACCOUNT_ID・CLOUDFLARE_API_TOKEN・PRINT_3D_EMAIL_FROM）",
    };
  }

  const recipient = to.trim().toLowerCase();
  if (!recipient || !recipient.includes("@")) {
    return { ok: false, error: "メールアドレスを入力してください" };
  }

  const sent = await sendTransactionalEmail(env, {
    to: recipient,
    from: { email: from!, name: getFromName(env) },
    subject: "【ScienceHUB】3D印刷メール テスト送信",
    text: "3D印刷管理画面からのテスト送信です。予約通知メールと同じ経路で送られています。",
    html:
      "<p>3D印刷<strong>管理画面</strong>からのテスト送信です。予約通知と同じ経路で送られています。</p>",
    replyTo: env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
  });

  if (!sent) {
    return {
      ok: false,
      error:
        "送信に失敗しました。APIトークンの Email Sending 権限と From ドメインを確認してください",
    };
  }

  return { ok: true };
}
