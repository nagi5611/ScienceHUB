// functions/lib/contest/contest-email.ts
import type { Reservation } from '../3dprint/reservations';
import type { Env } from '../types';
import { isEmailSendingConfigured, sendTransactionalEmail } from '../email/cloudflare-email';
import { getUserEmailById } from '../3dprint/reservation-email';

const DEFAULT_FROM_NAME = 'ScienceHUB 造形物コンテスト';

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
  accepted: '承認済み',
  printing: '印刷中',
  delivered: '印刷済み',
  failed: '印刷失敗',
  cancelled: 'キャンセル',
};

interface ContestEmailContext {
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statusLabel(status: ContestReservationStatus | undefined): string {
  if (!status) return '—';
  return STATUS_LABELS[status] ?? status;
}

function buildMessage(kind: ContestEmailKind, ctx: ContestEmailContext): {
  subject: string;
  html: string;
  text: string;
} {
  const base = `作品: ${ctx.reservation.title}
印刷予定日: ${ctx.reservation.desired_date}
${ctx.printerName ? `プリンター: ${ctx.printerName}\n` : ''}${ctx.printStaffLabel ? `印刷担当: ${ctx.printStaffLabel}\n` : ''}依頼ID: ${ctx.reservation.id}
`;

  switch (kind) {
    case 'submitted': {
      const subject = '【ScienceHUB】印刷依頼を受け付けました';
      const text = `${subject}

印刷依頼を受け付けました。印刷予定日は自動で ${ctx.reservation.desired_date} に設定されています。
担当者の承認後、別途メールでご連絡します。承認までお待ちください。

${base}
詳細: ${ctx.entryAppUrl}`;
      const html = `<p>印刷依頼を受け付けました。印刷予定日は自動で <strong>${escapeHtml(ctx.reservation.desired_date)}</strong> に設定されています。</p>
<p>担当者の<strong>承認後</strong>、別途メールでご連絡します。それまでお待ちください。</p>
<ul>
<li>作品: ${escapeHtml(ctx.reservation.title)}</li>
<li>印刷予定日: ${escapeHtml(ctx.reservation.desired_date)}</li>
${ctx.printerName ? `<li>プリンター: ${escapeHtml(ctx.printerName)}</li>` : ''}
<li>依頼ID: ${escapeHtml(ctx.reservation.id)}</li>
</ul>
<p><a href="${escapeHtml(ctx.entryAppUrl)}">造形物コンテスト</a></p>`;
      return { subject, html, text };
    }
    case 'accepted': {
      const subject = '【ScienceHUB】印刷依頼が承認されました（担当者が決まりました）';
      const staffLine = ctx.printStaffLabel
        ? `印刷担当: ${ctx.printStaffLabel} が承認され、担当者が決まりました。`
        : '印刷依頼が承認されました。';
      const text = `${subject}

${staffLine}
印刷完了までお待ちください。

${base}`;
      const html = `<p>印刷依頼が<strong>承認</strong>され、<strong>担当者が決まりました</strong>。</p>
${ctx.printStaffLabel ? `<p>印刷担当: <strong>${escapeHtml(ctx.printStaffLabel)}</strong></p>` : ''}
<p>印刷が完了するまでお待ちください。進捗はメールでお知らせします。</p>
<ul>
<li>作品: ${escapeHtml(ctx.reservation.title)}</li>
<li>印刷予定日: ${escapeHtml(ctx.reservation.desired_date)}</li>
<li>依頼ID: ${escapeHtml(ctx.reservation.id)}</li>
</ul>
<p><a href="${escapeHtml(ctx.entryAppUrl)}">造形物コンテスト</a></p>`;
      return { subject, html, text };
    }
    case 'status_changed': {
      const prev = statusLabel(ctx.previousStatus);
      const next = statusLabel(ctx.newStatus);
      const subject = '【ScienceHUB】印刷依頼のステータスが更新されました';
      const comment = ctx.statusComment?.trim();
      const text = `${subject}

ステータス: ${prev} → ${next}

${base}${comment ? `コメント: ${comment}\n` : ''}`;
      const html = `<p>印刷依頼の<strong>ステータスが更新</strong>されました。</p>
<p>${escapeHtml(prev)} → <strong>${escapeHtml(next)}</strong></p>
<ul>
<li>作品: ${escapeHtml(ctx.reservation.title)}</li>
<li>印刷予定日: ${escapeHtml(ctx.reservation.desired_date)}</li>
<li>依頼ID: ${escapeHtml(ctx.reservation.id)}</li>
</ul>
${comment ? `<p>コメント: ${escapeHtml(comment)}</p>` : ''}
<p><a href="${escapeHtml(ctx.entryAppUrl)}">造形物コンテスト</a></p>`;
      return { subject, html, text };
    }
    case 'rescheduled': {
      const subject = '【ScienceHUB】印刷依頼の印刷日が変更されました';
      const prev = ctx.previousDate ?? '—';
      const text = `${subject}

印刷予定日が変更されました。
変更前: ${prev}
変更後: ${ctx.reservation.desired_date}

${base}`;
      const html = `<p>印刷依頼の<strong>印刷予定日が変更</strong>されました。</p>
<p>変更前: ${escapeHtml(prev)} → 変更後: ${escapeHtml(ctx.reservation.desired_date)}</p>
<ul>
<li>作品: ${escapeHtml(ctx.reservation.title)}</li>
<li>依頼ID: ${escapeHtml(ctx.reservation.id)}</li>
</ul>
<p><a href="${escapeHtml(ctx.entryAppUrl)}">造形物コンテスト</a></p>`;
      return { subject, html, text };
    }
  }
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

  const { subject, html, text } = buildMessage(kind, ctx);
  await sendTransactionalEmail(env, {
    to,
    from: { email: from!, name: getFromName(env) },
    subject,
    html,
    text,
    replyTo: env.PRINT_3D_EMAIL_REPLY_TO?.trim() || undefined,
  });
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

  const sent = await sendTransactionalEmail(env, {
    to: recipient,
    from: { email: from!, name: getFromName(env) },
    subject: '【ScienceHUB】造形物コンテスト メール テスト送信',
    text: '造形物コンテスト管理画面からのテスト送信です。',
    html: '<p>造形物コンテスト<strong>管理画面</strong>からのテスト送信です。</p>',
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
