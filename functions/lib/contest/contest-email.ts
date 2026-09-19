// functions/lib/contest/contest-email.ts
import type { Reservation } from '../3dprint/reservations';
import type { PrintScale } from '../3dprint/slots';
import type { Env } from '../types';
import { isEmailSendingConfigured, sendTransactionalEmail } from '../email/cloudflare-email';
import { getUserEmailById } from '../3dprint/reservation-email';

const DEFAULT_FROM_NAME = 'ScienceHUB 造形物コンテスト';
const DEFAULT_STAFF_NAME = '造形物コンテスト担当';

const SCALE_LABELS: Record<PrintScale, string> = {
  small: 'スモール',
  medium: 'ミディアム',
  large: 'ラージ',
};

export type ContestEmailKind =
  | 'submitted'
  | 'accepted'
  | 'status_changed'
  | 'rescheduled';

export type ContestReservationStatus =
  | 'applied'
  | 'accepted'
  | 'printing'
  | 'delivered'
  | 'failed'
  | 'cancelled';

const STATUS_LABELS: Record<ContestReservationStatus, string> = {
  applied: '申請中',
  accepted: '受領済み',
  printing: '印刷中',
  delivered: '印刷完了',
  failed: '印刷失敗',
  cancelled: 'キャンセル',
};

const STATUS_BADGE_STYLES: Record<
  ContestReservationStatus,
  { bg: string; color: string }
> = {
  applied: { bg: '#e5e7eb', color: '#374151' },
  accepted: { bg: '#dbeafe', color: '#1d4ed8' },
  printing: { bg: '#fef3c7', color: '#a16207' },
  delivered: { bg: '#dcfce7', color: '#15803d' },
  failed: { bg: '#fee2e2', color: '#b91c1c' },
  cancelled: { bg: '#f3f4f6', color: '#6b7280' },
};

export interface ContestEmailContext {
  reservation: Pick<Reservation, 'id' | 'title' | 'desired_date' | 'print_scale'>;
  printerName?: string | null;
  printStaffLabel?: string | null;
  previousDate?: string;
  previousStatus?: ContestReservationStatus;
  newStatus?: ContestReservationStatus;
  statusComment?: string | null;
  entryAppUrl: string;
}

function getFromAddress(env: Env): string | undefined {
  return env.PRINT_3D_EMAIL_FROM?.trim();
}

function getFromName(env: Env): string {
  return env.PRINT_CONTEST_EMAIL_FROM_NAME?.trim() || DEFAULT_FROM_NAME;
}

/** Fixed staff name shown in admin UI and embedded in applicant emails. */
export function getContestEmailStaffName(env: Env): string {
  return env.PRINT_CONTEST_EMAIL_STAFF_NAME?.trim() || DEFAULT_STAFF_NAME;
}

/** Settings for the admin custom-email compose form. */
export function getContestEmailComposeSettings(env: Env): {
  staff_name: string;
  staff_name_locked: true;
  email_configured: boolean;
} {
  const from = getFromAddress(env);
  return {
    staff_name: getContestEmailStaffName(env),
    staff_name_locked: true,
    email_configured: isEmailSendingConfigured(env, from),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function statusLabel(status: ContestReservationStatus | undefined): string {
  if (!status) return '—';
  return STATUS_LABELS[status] ?? status;
}

function scaleLabel(scale: PrintScale): string {
  return SCALE_LABELS[scale] ?? scale;
}

function statusBadgeHtml(status: ContestReservationStatus): string {
  const label = statusLabel(status);
  const style = STATUS_BADGE_STYLES[status] ?? STATUS_BADGE_STYLES.applied;
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;font-size:13px;font-weight:600;background:${style.bg};color:${style.color}">${escapeHtml(label)}</span>`;
}

function reservationFactsText(ctx: ContestEmailContext): string {
  const lines = [
    `作品: ${ctx.reservation.title}`,
    `印刷予定日: ${ctx.reservation.desired_date}`,
    `印刷規模: ${scaleLabel(ctx.reservation.print_scale)}`,
  ];
  if (ctx.printerName) lines.push(`プリンター: ${ctx.printerName}`);
  if (ctx.printStaffLabel) lines.push(`印刷担当: ${ctx.printStaffLabel}`);
  lines.push(`依頼ID: ${ctx.reservation.id}`);
  return lines.join('\n');
}

function reservationFactsHtml(ctx: ContestEmailContext): string {
  const rows = [
    ['作品', ctx.reservation.title],
    ['印刷予定日', ctx.reservation.desired_date],
    ['印刷規模', scaleLabel(ctx.reservation.print_scale)],
  ];
  if (ctx.printerName) rows.push(['プリンター', ctx.printerName]);
  if (ctx.printStaffLabel) rows.push(['印刷担当', ctx.printStaffLabel]);
  rows.push(['依頼ID', ctx.reservation.id]);

  const cells = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:8px 0;font-size:14px;color:#111827">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:16px 0 0">${cells}</table>`;
}

function wrapContestEmailHtml(options: {
  headline: string;
  leadHtml: string;
  ctx: ContestEmailContext;
  staffName: string;
  extraHtml?: string;
}): string {
  const { headline, leadHtml, ctx, staffName, extraHtml = '' } = options;
  return `<!DOCTYPE html>
<html lang="ja">
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827">
  <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(headline)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <tr><td style="background:linear-gradient(135deg,#f38020 0%,#f59e0b 100%);padding:20px 24px">
          <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.9);letter-spacing:0.02em">ScienceHUB</div>
          <div style="font-size:20px;font-weight:700;color:#ffffff;margin-top:4px">造形物コンテスト</div>
        </td></tr>
        <tr><td style="padding:24px">
          <h1 style="margin:0 0 12px;font-size:18px;line-height:1.4;color:#111827">${escapeHtml(headline)}</h1>
          <div style="font-size:15px;line-height:1.65;color:#374151">${leadHtml}</div>
          ${extraHtml}
          ${reservationFactsHtml(ctx)}
          <p style="margin:20px 0 0"><a href="${escapeHtml(ctx.entryAppUrl)}" style="display:inline-block;padding:10px 18px;background:#f38020;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">造形物コンテストを開く</a></p>
        </td></tr>
        <tr><td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;line-height:1.5;color:#6b7280">
          メール担当: <strong style="color:#374151">${escapeHtml(staffName)}</strong><br />
          心当たりのない場合は破棄してください。
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildMessage(
  kind: ContestEmailKind,
  ctx: ContestEmailContext,
  staffName: string
): { subject: string; html: string; text: string } {
  const facts = reservationFactsText(ctx);
  const footer = `\n\n---\n${facts}\n\n担当: ${staffName}\n${ctx.entryAppUrl}`;

  switch (kind) {
    case 'submitted': {
      const subject = '【ScienceHUB】印刷依頼を受け付けました';
      const text = `${subject}

印刷依頼ありがとうございます。印刷予定日は ${ctx.reservation.desired_date} に自動設定されています。
担当者の受領後、改めてメールでお知らせします。

${facts}${footer}`;
      const leadHtml = `<p style="margin:0 0 12px">印刷依頼を<strong>受け付けました</strong>。ありがとうございます。</p>
<p style="margin:0">印刷予定日は <strong>${escapeHtml(ctx.reservation.desired_date)}</strong> に設定されています。担当者の<strong>受領</strong>後、改めてご連絡します。</p>
<p style="margin:12px 0 0">${statusBadgeHtml('applied')}</p>`;
      const html = wrapContestEmailHtml({
        headline: '印刷依頼を受け付けました',
        leadHtml,
        ctx,
        staffName,
      });
      return { subject, html, text };
    }
    case 'accepted': {
      const subject = '【ScienceHUB】印刷依頼を受領しました（担当者が決まりました）';
      const staffLine = ctx.printStaffLabel
        ? `印刷担当 ${ctx.printStaffLabel} が受領し、印刷準備を進めます。`
        : '印刷依頼を受領しました。';
      const text = `${subject}

${staffLine}

${facts}${footer}`;
      const leadHtml = `<p style="margin:0 0 12px">印刷依頼を<strong>受領</strong>しました。${ctx.printStaffLabel ? `印刷担当は <strong>${escapeHtml(ctx.printStaffLabel)}</strong> です。` : ''}</p>
<p style="margin:0">印刷が完了するまで今しばらくお待ちください。進捗はメールでお知らせします。</p>
<p style="margin:12px 0 0">${statusBadgeHtml('accepted')}</p>`;
      const html = wrapContestEmailHtml({
        headline: '受領済み — 担当者が決まりました',
        leadHtml,
        ctx,
        staffName,
      });
      return { subject, html, text };
    }
    case 'status_changed': {
      const prev = statusLabel(ctx.previousStatus);
      const next = statusLabel(ctx.newStatus);
      const nextKey = ctx.newStatus ?? 'applied';
      const subject = '【ScienceHUB】印刷依頼のステータスが更新されました';
      const comment = ctx.statusComment?.trim();
      const text = `${subject}

ステータス: ${prev} → ${next}
${comment ? `\nコメント:\n${comment}\n` : ''}
${facts}${footer}`;
      const commentHtml = comment
        ? `<div style="margin:16px 0 0;padding:12px 14px;background:#fff7ed;border-left:4px solid #f38020;border-radius:0 8px 8px 0"><div style="font-size:12px;font-weight:600;color:#9a3412;margin-bottom:6px">担当者コメント</div><div style="font-size:14px;line-height:1.6;color:#431407">${nl2br(comment)}</div></div>`
        : '';
      const leadHtml = `<p style="margin:0 0 12px">依頼のステータスが更新されました。</p>
<p style="margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:8px">${statusBadgeHtml(ctx.previousStatus ?? 'applied')} <span style="color:#9ca3af">→</span> ${statusBadgeHtml(nextKey)}</p>`;
      const html = wrapContestEmailHtml({
        headline: 'ステータスが更新されました',
        leadHtml,
        ctx,
        staffName,
        extraHtml: commentHtml,
      });
      return { subject, html, text };
    }
    case 'rescheduled': {
      const subject = '【ScienceHUB】印刷予定日が変更されました';
      const prev = ctx.previousDate ?? '—';
      const text = `${subject}

印刷予定日: ${prev} → ${ctx.reservation.desired_date}

${facts}${footer}`;
      const leadHtml = `<p style="margin:0">印刷予定日が変更されました。</p>
<p style="margin:12px 0 0;padding:12px;background:#f9fafb;border-radius:8px;font-size:14px"><span style="color:#6b7280">変更前</span> <strong>${escapeHtml(prev)}</strong><br /><span style="color:#6b7280">変更後</span> <strong style="color:#f38020">${escapeHtml(ctx.reservation.desired_date)}</strong></p>`;
      const html = wrapContestEmailHtml({
        headline: '印刷予定日が変更されました',
        leadHtml,
        ctx,
        staffName,
      });
      return { subject, html, text };
    }
  }
}

function buildCustomMessage(
  ctx: ContestEmailContext,
  staffName: string,
  messageBody: string
): { subject: string; html: string; text: string } {
  const subject = '【ScienceHUB】造形物コンテストからのお知らせ';
  const facts = reservationFactsText(ctx);
  const text = `${subject}

${staffName} より:

${messageBody}

---
${facts}

${ctx.entryAppUrl}`;

  const leadHtml = `<p style="margin:0 0 8px;font-size:13px;color:#6b7280">担当者</p>
<p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#111827">${escapeHtml(staffName)}</p>
<div style="padding:14px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;font-size:15px;line-height:1.65;color:#422006">${nl2br(messageBody)}</div>`;

  const html = wrapContestEmailHtml({
    headline: '担当者からのお知らせ',
    leadHtml,
    ctx,
    staffName,
  });

  return { subject, html, text };
}

/** Sends a contest notification email to the submitting user. */
export async function notifyContestApplicantEmail(
  env: Env,
  db: D1Database,
  userId: string,
  kind: ContestEmailKind,
  ctx: ContestEmailContext
): Promise<void> {
  const from = getFromAddress(env);
  if (!isEmailSendingConfigured(env, from)) return;

  const to = await getUserEmailById(db, userId);
  if (!to) {
    console.warn('contest email skipped: no user email', userId);
    return;
  }

  const staffName = getContestEmailStaffName(env);
  const { subject, html, text } = buildMessage(kind, ctx, staffName);
  await sendTransactionalEmail(env, {
    to,
    from: { email: from!, name: getFromName(env) },
    subject,
    html,
    text,
    replyTo: env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
  });
}

/** Sends a custom message from contest management to the applicant. */
export async function sendContestCustomEmailToApplicant(
  env: Env,
  db: D1Database,
  userId: string,
  ctx: ContestEmailContext,
  messageBody: string
): Promise<{ ok: boolean; error?: string }> {
  const from = getFromAddress(env);
  if (!isEmailSendingConfigured(env, from)) {
    return {
      ok: false,
      error:
        'メール送信の設定がありません（CLOUDFLARE_ACCOUNT_ID・CLOUDFLARE_API_TOKEN・PRINT_3D_EMAIL_FROM）',
    };
  }

  const trimmed = messageBody.trim();
  if (!trimmed) {
    return { ok: false, error: '送信内容を入力してください' };
  }
  if (trimmed.length > 4000) {
    return { ok: false, error: '送信内容は4000文字以内で入力してください' };
  }

  const to = await getUserEmailById(db, userId);
  if (!to) {
    return { ok: false, error: '依頼者のメールアドレスが登録されていません' };
  }

  const staffName = getContestEmailStaffName(env);
  const { subject, html, text } = buildCustomMessage(ctx, staffName, trimmed);
  const sent = await sendTransactionalEmail(env, {
    to,
    from: { email: from!, name: getFromName(env) },
    subject,
    html,
    text,
    replyTo: env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
  });

  if (!sent) {
    return {
      ok: false,
      error:
        '送信に失敗しました。APIトークンの Email Sending 権限と From ドメインを確認してください',
    };
  }

  return { ok: true };
}

/** Public URL for the contest entry app. */
export function buildContestEntryAppUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  return `${base}/apps/contest-entry/`;
}

/** Sends a test email from contest management (same transport). */
export async function sendContestAdminTestEmail(
  env: Env,
  to: string
): Promise<{ ok: boolean; error?: string }> {
  const from = getFromAddress(env);
  if (!isEmailSendingConfigured(env, from)) {
    return {
      ok: false,
      error:
        'メール送信の設定がありません（CLOUDFLARE_ACCOUNT_ID・CLOUDFLARE_API_TOKEN・PRINT_3D_EMAIL_FROM）',
    };
  }

  const recipient = to.trim().toLowerCase();
  if (!recipient || !recipient.includes('@')) {
    return { ok: false, error: 'メールアドレスを入力してください' };
  }

  const staffName = getContestEmailStaffName(env);
  const sent = await sendTransactionalEmail(env, {
    to: recipient,
    from: { email: from!, name: getFromName(env) },
    subject: '【ScienceHUB】造形物コンテスト メール テスト送信',
    text: `造形物コンテスト管理画面からのテスト送信です。\n担当: ${staffName}`,
    html: wrapContestEmailHtml({
      headline: 'テスト送信',
      leadHtml:
        '<p style="margin:0">管理画面からの<strong>テスト送信</strong>です。依頼者向けメールと同じ経路で配信されています。</p>',
      ctx: {
        reservation: {
          id: 'test',
          title: 'サンプル作品',
          desired_date: '2099-01-01',
          print_scale: 'small',
        },
        entryAppUrl: 'https://example.com/apps/contest-entry/',
      },
      staffName,
    }),
    replyTo: env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
  });

  if (!sent) {
    return {
      ok: false,
      error:
        '送信に失敗しました。APIトークンの Email Sending 権限と From ドメインを確認してください',
    };
  }

  return { ok: true };
}
