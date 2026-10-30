// functions/api/lib/discord.ts
import type { PrintActorContext, PrintActorNoticeExtra } from './print-actor';
import { formatPrintActorNoticeLines } from './print-actor';

const ADMIN_PATH = '/apps/3dprint-management/';

function actorDiscordBlock(
  actor?: PrintActorContext | null,
  extra?: PrintActorNoticeExtra
): string {
  if (!actor) return '';
  const lines = formatPrintActorNoticeLines(actor, extra);
  return `\n\n**操作者情報**\n${lines.map((l) => `• ${l}`).join('\n')}`;
}

/** Builds the full 3D print management app URL from the site base URL. */
export function build3dPrintAdminUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  return `${base}${ADMIN_PATH}`;
}

export type DiscordMentionTestMember = {
  member_id: string;
  name: string;
  homeroom: string;
  discord_user_id: string;
};

export type DiscordMentionTestSkip = {
  member_id: string;
  name: string;
  reason: string;
};

/** Sends a test Discord mention to selected print staff (management UI). */
export async function sendDiscordStaffMentionTest(
  webhookUrl: string | undefined,
  members: { id: string; name: string; homeroom: string; discord_user_id: string | null }[],
  memberIds: string[]
): Promise<
  | { ok: true; sent: DiscordMentionTestMember[]; skipped: DiscordMentionTestSkip[]; content: string }
  | { ok: false; error: string; status?: number }
> {
  if (!webhookUrl?.trim()) {
    return { ok: false, error: 'Discord Webhook がサーバーに設定されていません' };
  }

  const byId = new Map(members.map((m) => [m.id, m]));
  const uniqueIds = [...new Set(memberIds.map((id) => id.trim()).filter(Boolean))];
  if (!uniqueIds.length) {
    return { ok: false, error: 'メンションする担当者を1人以上選んでください' };
  }

  const sent: DiscordMentionTestMember[] = [];
  const skipped: DiscordMentionTestSkip[] = [];

  for (const memberId of uniqueIds) {
    const member = byId.get(memberId);
    if (!member) {
      skipped.push({ member_id: memberId, name: memberId, reason: '担当者が見つかりません' });
      continue;
    }
    const discordId = member.discord_user_id?.trim() ?? '';
    if (!discordId) {
      skipped.push({ member_id: memberId, name: member.name, reason: 'Discord ユーザーIDが未設定です' });
      continue;
    }
    if (!/^\d{15,25}$/.test(discordId)) {
      skipped.push({
        member_id: memberId,
        name: member.name,
        reason: 'Discord ユーザーIDの形式が不正です',
      });
      continue;
    }
    sent.push({
      member_id: memberId,
      name: member.name,
      homeroom: member.homeroom,
      discord_user_id: discordId,
    });
  }

  if (!sent.length) {
    return {
      ok: false,
      error: skipped.length
        ? '選択した担当者にメンション可能な Discord ID がありません'
        : 'メンションする担当者を1人以上選んでください',
    };
  }

  const mentionParts = sent.map((m) => `<@${m.discord_user_id}>`);
  const mentionUserIds = sent.map((m) => m.discord_user_id);
  const lines = [
    '**ScienceHUB 3Dプリント — Discord メンションのテスト**',
    '担当者設定の確認用です。通知が届き、名前が青くメンション表示されていれば成功です。',
    '',
    ...sent.map(
      (m) => `• ${m.name}（${m.homeroom}） — ID \`${m.discord_user_id}\``
    ),
  ];
  const content = [...mentionParts, ...lines].join('\n');

  const payload = {
    content,
    username: 'ScienceHUB 3Dプリント',
    allowed_mentions: { users: mentionUserIds },
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return {
        ok: false,
        error: `Discord 送信に失敗しました（HTTP ${res.status}）${detail ? `: ${detail.slice(0, 200)}` : ''}`,
        status: res.status,
      };
    }
    return { ok: true, sent, skipped, content };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Discord 送信に失敗しました',
    };
  }
}

/** Sends daily Discord mentions to assigned print staff (6:00 JST). */
export async function sendDailyStaffMentions(
  webhookUrl: string | undefined,
  db: D1Database,
  todayJst: string
): Promise<void> {
  if (!webhookUrl) return;

  const { getAssignedReservationsByDate, getAllMembers } = await import('./reservations');
  const reservations = await getAssignedReservationsByDate(db, todayJst);
  if (!reservations.length) return;

  const members = await getAllMembers(db);
  const memberById = new Map(members.map((m) => [m.id, m]));

  const byStaff = new Map<string, typeof reservations>();
  for (const r of reservations) {
    if (!r.print_staff_member_id) continue;
    const list = byStaff.get(r.print_staff_member_id) ?? [];
    list.push(r);
    byStaff.set(r.print_staff_member_id, list);
  }

  const mentionParts: string[] = [];
  const mentionUserIds: string[] = [];
  const lines: string[] = [`**${todayJst} の印刷予約**`];

  for (const [staffId, staffReservations] of byStaff) {
    const member = memberById.get(staffId);
    if (member?.discord_user_id) {
      mentionParts.push(`<@${member.discord_user_id}>`);
      mentionUserIds.push(member.discord_user_id);
    }

    const staffName = member ? `${member.name}（${member.homeroom}）` : '担当者';
    lines.push(`\n**${staffName}**`);
    for (const r of staffReservations) {
      lines.push(`• ${r.title}`);
    }
  }

  if (!mentionParts.length) {
    console.warn('Daily staff mentions skipped: no Discord user IDs configured');
    return;
  }

  const payload = {
    content: [...mentionParts, ...lines].join('\n'),
    allowed_mentions: { users: mentionUserIds },
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('Daily Discord mention failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Daily Discord mention error:', err);
  }
}

/** Sends a Discord webhook notification for a modified reservation. */
export async function notifyReservationModified(
  webhookUrl: string | undefined,
  adminUrl: string,
  _reservation: { title: string; desired_date: string },
  actor?: PrintActorContext | null,
  actorExtra?: PrintActorNoticeExtra
): Promise<void> {
  if (!webhookUrl) return;

  const actorBlock = actorDiscordBlock(actor, { ...actorExtra, action_label: actorExtra?.action_label ?? '予約内容の修正' });

  const payload = {
    content: `予約内容が修正されました。再承認が必要です。\n${adminUrl}${actorBlock}`,
    embeds: [
      {
        title: '3D印刷 予約修正',
        color: 0xf59e0b,
        description: '詳細は管理画面の申請書を確認してください。',
        footer: { text: '管理画面で印刷担当を選び「予約を受領」してください' },
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Discord webhook failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Discord webhook error:', err);
  }
}

export type DiscordApplicationNotice = {
  applicationFormText?: string;
  adminDeepLink: string;
  /** Applicant (ScienceHUB user) — shown when the action is user-initiated. */
  applicantLabel?: string | null;
};

/** Discord notice when a time-slot「予約のみ」is auto-confirmed (空き枠). */
export async function notifyReservationBooked(
  webhookUrl: string | undefined,
  notice: DiscordApplicationNotice
): Promise<void> {
  if (!webhookUrl) return;

  const formSnippet = notice.applicationFormText?.trim()
    ? `\n\`\`\`\n${notice.applicationFormText.trim().slice(0, 1800)}\n\`\`\``
    : '';
  const applicantLine = notice.applicantLabel?.trim()
    ? `\n\n**予約者（ScienceHUB）:** ${notice.applicantLabel.trim()}`
    : '';

  const payload = {
    content: `予約されました（空き枠の自動確定）。\n${notice.adminDeepLink}${applicantLine}${formSnippet}`,
    embeds: [
      {
        title: '3D印刷 予約確定',
        color: 0x22c55e,
        description: '申請書の内容をご確認ください。',
        footer: { text: '時間枠の予約のみ自動確定。依頼（STL）は従来どおり担当者が受領します' },
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('Discord booked webhook failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Discord booked webhook error:', err);
  }
}

/** Sends a Discord webhook notification for a new reservation application. */
export async function notifyReservationApplication(
  webhookUrl: string | undefined,
  notice: DiscordApplicationNotice
): Promise<void> {
  if (!webhookUrl) return;

  const formText = notice.applicationFormText?.trim().slice(0, 1800) ?? '';
  const applicantLine = notice.applicantLabel?.trim()
    ? `\n\n申請者: ${notice.applicantLabel.trim()}`
    : '';
  const formBlock = formText ? `\n\n${formText}` : '';

  const payload = {
    content: `新しい予約申請があります。\n${notice.adminDeepLink}${applicantLine}${formBlock}`,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('Discord webhook failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Discord webhook error:', err);
  }
}

export type PrintAdminDiscordNotice = {
  title: string;
  color: number;
  summary: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  adminDeepLink?: string;
  actor: PrintActorContext;
  actorExtra?: PrintActorNoticeExtra;
};

export type DiscordStaffAssignedNotice = {
  staffMember: { name: string; homeroom: string; discord_user_id?: string | null };
  applicationFormText?: string;
  adminDeepLink?: string;
};

/** Discord notice when print staff is assigned on approval (with mention when configured). */
export async function notifyReservationStaffAssigned(
  webhookUrl: string | undefined,
  notice: DiscordStaffAssignedNotice
): Promise<void> {
  if (!webhookUrl) return;

  const discordId = notice.staffMember.discord_user_id?.trim();
  const staffLabel = `${notice.staffMember.name}（${notice.staffMember.homeroom}）`;
  const mentionLine = discordId ? `<@${discordId}>` : staffLabel;
  const formText = notice.applicationFormText?.trim().slice(0, 1800) ?? '';
  const formBlock = formText ? `\n\n${formText}` : '';
  const link = notice.adminDeepLink ? `\n${notice.adminDeepLink}` : '';

  const payload: {
    content: string;
    allowed_mentions?: { users: string[] };
  } = {
    content: `担当者が確定しました。\n${mentionLine}${link}${formBlock}`,
  };
  if (discordId) {
    payload.allowed_mentions = { users: [discordId] };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('Discord staff-assigned webhook failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Discord staff-assigned webhook error:', err);
  }
}

/** Management action notice (accept, cancel, reschedule, restore, etc.). */
export async function notifyPrintAdminOperation(
  webhookUrl: string | undefined,
  notice: PrintAdminDiscordNotice
): Promise<void> {
  if (!webhookUrl) return;

  const actorBlock = actorDiscordBlock(notice.actor, notice.actorExtra);
  const link = notice.adminDeepLink ? `\n${notice.adminDeepLink}` : '';
  const payload = {
    content: `${notice.summary}${link}${actorBlock}`,
    embeds: [
      {
        title: notice.title,
        color: notice.color,
        fields: notice.fields ?? [],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('Discord admin operation webhook failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Discord admin operation webhook error:', err);
  }
}
