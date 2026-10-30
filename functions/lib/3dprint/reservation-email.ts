// functions/lib/3dprint/reservation-email.ts
import type { Reservation } from "./reservations";
import type { Env } from "../types";
import { isEmailSendingConfigured, sendTransactionalEmail } from "../email/cloudflare-email";

const DEFAULT_FROM_NAME = "ScienceHUB 3D印刷";

export type PrintReservationEmailKind =
  | "applied"
  | "accepted"
  | "cancelled"
  | "rescheduled"
  | "modified";

const PURPOSE_LABELS: Record<Reservation["purpose"], string> = {
  ss_s_tan: "SS・S探",
  club: "部活",
  other: "その他",
};

export type ReservationEmailDetailSnapshot = {
  purposeLabel: string;
  summary: string | null;
  printNotes: string | null;
  partCount: number;
  stlFilename: string | null;
};

interface ApplicantEmailPayload {
  kind: PrintReservationEmailKind;
  reservation: Pick<
    Reservation,
    "id" | "title" | "desired_date"
  >;
  printerName?: string | null;
  printStaffLabel?: string | null;
  statusComment?: string | null;
  reservationAppUrl: string;
  applicationFormText?: string | null;
  applicationFormPdfUrl?: string | null;
  previousDate?: string | null;
  /** Who performed the action (ScienceHUB user + linked print staff). */
  operatorSummary?: string | null;
  /** Single-line operator for applicant-facing emails. */
  operatorDisplay?: string | null;
  /** Admin free-text reason (取り消し理由 / 変更理由). */
  notifyReason?: string | null;
  /** cancelled: admin vs applicant self-service. */
  cancelledBy?: "admin" | "user";
  /** modified: human-readable change lines (field: before → after). */
  modificationLines?: string[];
  /** Extended reservation fields for email body. */
  details?: ReservationEmailDetailSnapshot | null;
}

/** Builds purpose / notes snapshot for applicant emails. */
export function buildReservationEmailDetailSnapshot(
  reservation: Reservation,
  _printerName?: string | null
): ReservationEmailDetailSnapshot {
  let purposeLabel = PURPOSE_LABELS[reservation.purpose];
  if (reservation.purpose === "other" && reservation.purpose_other?.trim()) {
    purposeLabel = `${purposeLabel}（${reservation.purpose_other.trim()}）`;
  }
  return {
    purposeLabel,
    summary: reservation.summary?.trim() || null,
    printNotes: reservation.print_notes?.trim() || null,
    partCount: reservation.part_count ?? 1,
    stlFilename: reservation.stl_filename?.trim() || null,
  };
}

/** Builds change summary lines for content-edit applicant emails. */
export function buildReservationContentChangeSummary(
  before: Reservation,
  after: Reservation,
  printerLabelBefore: string | null,
  printerLabelAfter: string | null
): string[] {
  const lines: string[] = [];
  if (before.title !== after.title) {
    lines.push(`作品名: 「${before.title}」→「${after.title}」`);
  }
  if (before.desired_date !== after.desired_date) {
    lines.push(`希望印刷日: ${before.desired_date} → ${after.desired_date}`);
  }
  if (before.printer_id !== after.printer_id) {
    lines.push(`機種: ${printerLabelBefore ?? "—"} → ${printerLabelAfter ?? "—"}`);
  }
  if (before.purpose !== after.purpose) {
    lines.push(
      `利用目的: ${PURPOSE_LABELS[before.purpose]} → ${PURPOSE_LABELS[after.purpose]}`
    );
  }
  if (before.purpose_other !== after.purpose_other) {
    const b = before.purpose_other?.trim() || "—";
    const a = after.purpose_other?.trim() || "—";
    if (b !== a) lines.push(`利用目的（その他）: ${b} → ${a}`);
  }
  if ((before.summary ?? "") !== (after.summary ?? "")) {
    lines.push("概要・説明が更新されました");
  }
  if ((before.print_notes ?? "") !== (after.print_notes ?? "")) {
    lines.push("備考が更新されました");
  }
  if (before.part_count !== after.part_count) {
    lines.push(`パーツ数: ${before.part_count} → ${after.part_count}`);
  }
  if (before.stl_r2_key !== after.stl_r2_key || before.stl_filename !== after.stl_filename) {
    const b = before.stl_filename ?? "—";
    const a = after.stl_filename ?? "—";
    lines.push(`印刷データ: ${b} → ${a}`);
  }
  if (before.request_print_video !== after.request_print_video) {
    const b = before.request_print_video === 1 ? "希望する" : "希望しない";
    const a = after.request_print_video === 1 ? "希望する" : "希望しない";
    lines.push(`印刷動画: ${b} → ${a}`);
  }
  if (
    before.student_name !== after.student_name ||
    before.homeroom !== after.homeroom ||
    before.student_number !== after.student_number
  ) {
    lines.push(
      `申請者: ${before.student_name}（${before.homeroom}・${before.student_number}番）→ ${after.student_name}（${after.homeroom}・${after.student_number}番）`
    );
  }
  return lines;
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

const EMAIL_STYLES = {
  body: "margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,'Hiragino Sans','Meiryo',sans-serif;color:#18181b;line-height:1.55;",
  wrap: "max-width:560px;margin:24px auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;",
  header: "background:linear-gradient(135deg,#1c1917 0%,#44403c 100%);color:#fafafa;padding:20px 24px;",
  headerTitle: "margin:0;font-size:18px;font-weight:700;letter-spacing:.02em;",
  headerSub: "margin:6px 0 0;font-size:12px;color:#d6d3d1;",
  content: "padding:22px 24px 8px;",
  lead: "margin:0 0 16px;font-size:14px;",
  sectionTitle:
    "margin:18px 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#71717a;",
  table: "width:100%;border-collapse:collapse;font-size:13px;",
  th: "text-align:left;padding:8px 10px;background:#fafafa;border:1px solid #e4e4e7;color:#52525b;font-weight:600;width:36%;vertical-align:top;",
  td: "padding:8px 10px;border:1px solid #e4e4e7;vertical-align:top;",
  callout:
    "margin:16px 0;padding:12px 14px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:13px;",
  calloutTitle: "margin:0 0 6px;font-size:12px;font-weight:700;color:#9a3412;",
  list: "margin:8px 0 0;padding-left:18px;font-size:13px;",
  btnWrap: "padding:8px 24px 24px;text-align:center;",
  btn: "display:inline-block;background:#ea580c;color:#ffffff!important;text-decoration:none;font-weight:700;font-size:13px;padding:12px 22px;border-radius:8px;",
  foot: "padding:0 24px 20px;font-size:11px;color:#a1a1aa;",
  pre: "white-space:pre-wrap;font-size:11px;background:#fafafa;border:1px solid #e4e4e7;padding:12px;border-radius:8px;margin:8px 0 0;",
};

function detailRows(payload: ApplicantEmailPayload): Array<{ label: string; value: string }> {
  const d = payload.details;
  const rows: Array<{ label: string; value: string }> = [
    { label: "作品名", value: payload.reservation.title },
    { label: "希望印刷日", value: payload.reservation.desired_date },
  ];
  if (payload.printerName) rows.push({ label: "機種", value: payload.printerName });
  if (d) {
    rows.push({ label: "利用目的", value: d.purposeLabel });
    rows.push({ label: "パーツ数", value: String(d.partCount) });
    if (d.stlFilename) rows.push({ label: "印刷データ", value: d.stlFilename });
    if (d.summary) rows.push({ label: "概要・説明", value: d.summary });
    if (d.printNotes) rows.push({ label: "備考", value: d.printNotes });
  }
  rows.push({ label: "予約ID", value: payload.reservation.id });
  return rows;
}

function detailRowsText(payload: ApplicantEmailPayload): string {
  return detailRows(payload)
    .map((r) => `${r.label}: ${r.value}`)
    .join("\n");
}

function detailTableHtml(payload: ApplicantEmailPayload): string {
  const rows = detailRows(payload)
    .map(
      (r) =>
        `<tr><th style="${EMAIL_STYLES.th}">${escapeHtml(r.label)}</th><td style="${EMAIL_STYLES.td}">${escapeHtml(r.value)}</td></tr>`
    )
    .join("");
  return `<table role="presentation" style="${EMAIL_STYLES.table}">${rows}</table>`;
}

function reasonSectionHtml(title: string, body: string): string {
  return `<div style="${EMAIL_STYLES.callout}"><p style="${EMAIL_STYLES.calloutTitle}">${escapeHtml(title)}</p><p style="margin:0;white-space:pre-wrap">${escapeHtml(body)}</p></div>`;
}

function reasonSectionText(title: string, body: string): string {
  return `\n${title}:\n${body}\n`;
}

function operatorSectionHtml(operatorDisplay: string | null | undefined): string {
  if (!operatorDisplay?.trim()) return "";
  return `<p style="${EMAIL_STYLES.lead}"><strong>操作者:</strong> ${escapeHtml(operatorDisplay.trim())}</p>`;
}

function operatorSectionText(operatorDisplay: string | null | undefined): string {
  if (!operatorDisplay?.trim()) return "";
  return `\n操作者: ${operatorDisplay.trim()}\n`;
}

function wrapEmailHtml(title: string, subtitle: string, inner: string): string {
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="${EMAIL_STYLES.body}"><div style="${EMAIL_STYLES.wrap}"><div style="${EMAIL_STYLES.header}"><h1 style="${EMAIL_STYLES.headerTitle}">${escapeHtml(title)}</h1><p style="${EMAIL_STYLES.headerSub}">${escapeHtml(subtitle)}</p></div><div style="${EMAIL_STYLES.content}">${inner}</div></div></body></html>`;
}

function ctaBlock(payload: ApplicantEmailPayload): { html: string; text: string } {
  const url = payload.reservationAppUrl;
  return {
    html: `<div style="${EMAIL_STYLES.btnWrap}"><a href="${escapeHtml(url)}" style="${EMAIL_STYLES.btn}">予約アプリで確認</a></div><p style="${EMAIL_STYLES.foot}">このメールに心当たりがない場合は破棄してください。</p>`,
    text: `\n予約の確認: ${url}\n\n※このメールに心当たりがない場合は破棄してください。`,
  };
}

function buildApplicantMessage(payload: ApplicantEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const formBlock = payload.applicationFormText?.trim()
    ? `\n\n--- 申請書 ---\n${payload.applicationFormText.trim()}\n`
    : "";
  const pdfBlock = payload.applicationFormPdfUrl?.trim()
    ? `\n\n--- 申請PDF ---\n${payload.applicationFormPdfUrl.trim()}\n`
    : "";
  const cta = ctaBlock(payload);
  const detailsText = detailRowsText(payload);
  const detailsHtml = `<p style="${EMAIL_STYLES.sectionTitle}">予約内容</p>${detailTableHtml(payload)}`;

  if (payload.kind === "rescheduled") {
    const prev = payload.previousDate ?? "—";
    const subject = "【ScienceHUB】3D印刷の予約日が変更されました";
    const reason = payload.notifyReason?.trim();
    const text = `${subject}

印刷日が変更されました。

変更前: ${prev}
変更後: ${payload.reservation.desired_date}
${reason ? reasonSectionText("変更理由", reason) : ""}${operatorSectionText(payload.operatorDisplay)}
${detailsText}${formBlock}${pdfBlock}${cta.text}`;
    const inner = `<p style="${EMAIL_STYLES.lead}">3D印刷の<strong>予約日が変更</strong>されました。</p>
<p style="margin:0 0 12px;font-size:13px;">変更前: <strong>${escapeHtml(prev)}</strong> → 変更後: <strong>${escapeHtml(payload.reservation.desired_date)}</strong></p>
${reason ? reasonSectionHtml("変更理由", reason) : ""}
${operatorSectionHtml(payload.operatorDisplay)}
${detailsHtml}
${payload.applicationFormText ? `<p style="${EMAIL_STYLES.sectionTitle}">申請書</p><pre style="${EMAIL_STYLES.pre}">${escapeHtml(payload.applicationFormText)}</pre>` : ""}
${cta.html}`;
    return { subject, text, html: wrapEmailHtml("予約日の変更", "ScienceHUB 3D印刷", inner) };
  }

  if (payload.kind === "cancelled") {
    const subject = "【ScienceHUB】3D印刷の予約が取り消されました";
    const byUser = payload.cancelledBy === "user";
    const reason =
      payload.notifyReason?.trim() ||
      payload.statusComment?.trim() ||
      null;
    const lead = byUser
      ? "ご自身の操作により、予約・依頼が取り消されました。"
      : "担当者により予約が取り消されました。";
    const reasonTitle = byUser ? "取り消しメモ" : "取り消し理由";
    const text = `${subject}

${lead}
${reason ? reasonSectionText(reasonTitle, reason) : ""}${operatorSectionText(payload.operatorDisplay)}
${detailsText}${formBlock}${pdfBlock}${cta.text}`;
    const inner = `<p style="${EMAIL_STYLES.lead}">${byUser ? "ご自身の操作により、予約・依頼が<strong>取り消され</strong>ました。" : "担当者により予約が<strong>取り消され</strong>ました。"}</p>
${reason ? reasonSectionHtml(reasonTitle, reason) : ""}
${operatorSectionHtml(payload.operatorDisplay)}
${detailsHtml}
${cta.html}`;
    return { subject, text, html: wrapEmailHtml("予約の取り消し", "ScienceHUB 3D印刷", inner) };
  }

  if (payload.kind === "modified") {
    const subject = "【ScienceHUB】3D印刷の予約内容が変更されました";
    const changeLines = payload.modificationLines?.length
      ? payload.modificationLines
      : ["内容が更新されました（詳細は予約アプリでご確認ください）"];
    const reason = payload.notifyReason?.trim();
    const changesText = changeLines.map((l) => `・${l}`).join("\n");
    const changesHtml = changeLines.map((l) => `<li>${escapeHtml(l)}</li>`).join("");
    const text = `${subject}

予約・依頼の内容が変更されました。
${reason ? reasonSectionText("変更理由", reason) : ""}${operatorSectionText(payload.operatorDisplay)}
${detailsText}

変更内容:
${changesText}
${cta.text}`;
    const inner = `<p style="${EMAIL_STYLES.lead}">予約・依頼の<strong>内容が変更</strong>されました。</p>
${reason ? reasonSectionHtml("変更理由", reason) : ""}
${operatorSectionHtml(payload.operatorDisplay)}
${detailsHtml}
<p style="${EMAIL_STYLES.sectionTitle}">変更内容（変更前 → 変更後）</p>
<ul style="${EMAIL_STYLES.list}">${changesHtml}</ul>
${cta.html}`;
    return { subject, text, html: wrapEmailHtml("予約内容の変更", "ScienceHUB 3D印刷", inner) };
  }

  if (payload.kind === "applied") {
    const subject = "【ScienceHUB】3D印刷の予約申請を受け付けました";
    const text = `${subject}

予約申請を受け付けました。担当者が内容を確認し、受領後に確定します。

${detailsText}${formBlock}${pdfBlock}${cta.text}`;
    const inner = `<p style="${EMAIL_STYLES.lead}">予約申請を受け付けました。担当者が内容を確認し、<strong>受領後に確定</strong>します。</p>
${detailsHtml}
${payload.applicationFormText ? `<p style="${EMAIL_STYLES.sectionTitle}">申請書</p><pre style="${EMAIL_STYLES.pre}">${escapeHtml(payload.applicationFormText)}</pre>` : ""}
${cta.html}`;
    return { subject, text, html: wrapEmailHtml("予約申請受付", "ScienceHUB 3D印刷", inner) };
  }

  const staff = payload.printStaffLabel ?? "担当者";
  const subject = "【ScienceHUB】印刷担当者が決まりました";
  const text = `${subject}

担当者 ${staff} が印刷を担当します。

${detailsText}
${operatorSectionText(payload.operatorDisplay)}${formBlock}${pdfBlock}${cta.text}`;
  const inner = `<p style="${EMAIL_STYLES.lead}">印刷担当者が決まりました。<strong>${escapeHtml(staff)}</strong> が印刷を担当します。</p>
${operatorSectionHtml(payload.operatorDisplay)}
${detailsHtml}
${cta.html}`;
  return { subject, text, html: wrapEmailHtml("印刷担当者の決定", "ScienceHUB 3D印刷", inner) };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function redactEmailForLog(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at);
  if (local.length <= 1) return `*${domain}`;
  return `${local[0]}***${domain}`;
}

/** Sends a transactional email to the user who created the reservation. */
export async function notifyApplicantPrintReservationEmail(
  env: Env,
  db: D1Database,
  userId: string,
  payload: ApplicantEmailPayload
): Promise<void> {
  const reservationId = payload.reservation.id;
  const kind = payload.kind;
  const from = getFromAddress(env);
  const configured = isEmailSendingConfigured(env, from);
  if (!configured) {
    console.warn("3D print applicant email skipped: not configured", {
      kind,
      reservationId,
      configured: false,
    });
    return;
  }

  const to = await getUserEmailById(db, userId);
  if (!to) {
    console.warn("3D print applicant email skipped: no user email", {
      kind,
      reservationId,
      userId,
    });
    return;
  }

  const { subject, html, text } = buildApplicantMessage(payload);
  const sent = await sendTransactionalEmail(env, {
    to,
    from: { email: from!, name: getFromName(env) },
    subject,
    html,
    text,
    replyTo: env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
  });
  if (sent) {
    console.log("3D print applicant email sent", {
      kind,
      reservationId,
      to: redactEmailForLog(to),
      configured: true,
    });
  } else {
    console.warn("3D print applicant email REST send failed", {
      kind,
      reservationId,
      to: redactEmailForLog(to),
      configured: true,
    });
  }
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
