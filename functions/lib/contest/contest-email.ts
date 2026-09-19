// functions/lib/contest/contest-email.ts
import type { Reservation } from '../3dprint/reservations';
import type { Env } from '../types';
import { isEmailSendingConfigured, sendTransactionalEmail } from '../email/cloudflare-email';
import { getUserEmailById } from '../3dprint/reservation-email';

const DEFAULT_FROM_NAME = 'ScienceHUB 造形物コンテスト';

export type ContestEmailKind =
  | 'submitted'
  | 'rescheduled'
  | 'delivered'
  | 'failed';

interface ContestEmailContext {
  reservation: Pick<Reservation, 'id' | 'title' | 'desired_date' | 'print_scale'>;
  printerName?: string | null;
  printStaffLabel?: string | null;
  previousDate?: string;
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

function buildMessage(kind: ContestEmailKind, ctx: ContestEmailContext): {
  subject: string;
  html: string;
  text: string;
} {
  const base = `作品: ${ctx.reservation.title}
印刷予定日: ${ctx.reservation.desired_date}
${ctx.printerName ? `プリンター: ${ctx.printerName}\n` : ''}${ctx.printStaffLabel ? `印刷担当: ${ctx.printStaffLabel}\n` : ''}登録ID: ${ctx.reservation.id}
`;

  switch (kind) {
    case 'submitted': {
      const subject = '【ScienceHUB】造形物コンテストの登録を受け付けました';
      const text = `${subject}

造形物コンテストへの登録を受け付け、印刷日を確定しました。

${base}
詳細: ${ctx.entryAppUrl}`;
      const html = `<p>造形物コンテストへの登録を受け付け、<strong>印刷日を確定</strong>しました。</p>
<ul>
<li>作品: ${escapeHtml(ctx.reservation.title)}</li>
<li>印刷予定日: ${escapeHtml(ctx.reservation.desired_date)}</li>
${ctx.printerName ? `<li>プリンター: ${escapeHtml(ctx.printerName)}</li>` : ''}
${ctx.printStaffLabel ? `<li>印刷担当: ${escapeHtml(ctx.printStaffLabel)}</li>` : ''}
<li>登録ID: ${escapeHtml(ctx.reservation.id)}</li>
</ul>
<p><a href="${escapeHtml(ctx.entryAppUrl)}">造形物コンテスト</a></p>`;
      return { subject, html, text };
    }
    case 'rescheduled': {
      const subject = '【ScienceHUB】造形物コンテストの印刷日が変更されました';
      const prev = ctx.previousDate ?? '—';
      const text = `${subject}

印刷予定日が変更されました。
変更前: ${prev}
変更後: ${ctx.reservation.desired_date}

${base}`;
      const html = `<p>造形物コンテストの<strong>印刷予定日が変更</strong>されました。</p>
<p>変更前: ${escapeHtml(prev)} → 変更後: ${escapeHtml(ctx.reservation.desired_date)}</p>
<ul>
<li>作品: ${escapeHtml(ctx.reservation.title)}</li>
<li>登録ID: ${escapeHtml(ctx.reservation.id)}</li>
</ul>`;
      return { subject, html, text };
    }
    case 'delivered': {
      const subject = '【ScienceHUB】造形物コンテストの印刷が完了しました';
      const text = `${subject}

${base}`;
      const html = `<p>造形物コンテストの作品の<strong>印刷が完了</strong>しました。</p>
<ul>
<li>作品: ${escapeHtml(ctx.reservation.title)}</li>
<li>印刷予定日: ${escapeHtml(ctx.reservation.desired_date)}</li>
</ul>`;
      return { subject, html, text };
    }
    case 'failed': {
      const subject = '【ScienceHUB】造形物コンテストの印刷に失敗しました';
      const comment = ctx.statusComment?.trim();
      const text = `${subject}

${base}${comment ? `コメント: ${comment}\n` : ''}`;
      const html = `<p>造形物コンテストの作品の<strong>印刷に失敗</strong>しました。担当者にお問い合わせください。</p>
<ul>
<li>作品: ${escapeHtml(ctx.reservation.title)}</li>
</ul>
${comment ? `<p>コメント: ${escapeHtml(comment)}</p>` : ''}`;
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
