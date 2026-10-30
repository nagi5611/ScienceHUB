// functions/api/lib/discord.ts
import type { PrintScale } from './slots';

const SCALE_LABELS: Record<PrintScale, string> = {
  small: 'スモール',
  medium: 'ミディアム',
  large: 'ラージ',
};

const ADMIN_PATH = '/apps/3dprint-management/';

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

  const SCALE_SHORT = { small: 'S', medium: 'M', large: 'L' } as const;

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
      const scale = SCALE_SHORT[r.print_scale as keyof typeof SCALE_SHORT] ?? r.print_scale;
      lines.push(`• ${scale} ${r.title}`);
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
  reservation: { title: string; desired_date: string; print_scale: PrintScale }
): Promise<void> {
  if (!webhookUrl) return;

  const scaleLabel = SCALE_LABELS[reservation.print_scale] ?? reservation.print_scale;

  const payload = {
    content: `予約内容が修正されました。再承認が必要です。\n${adminUrl}`,
    embeds: [
      {
        title: '3D印刷 予約修正',
        color: 0xf59e0b,
        fields: [
          { name: 'タイトル', value: reservation.title, inline: true },
          { name: '希望印刷日', value: reservation.desired_date, inline: true },
          { name: '印刷規模', value: scaleLabel, inline: true },
        ],
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
  title: string;
  desired_date: string;
  print_scale: PrintScale;
  applicationFormText?: string;
  adminDeepLink: string;
};

/** Sends a Discord webhook notification for a new reservation application. */
export async function notifyReservationApplication(
  webhookUrl: string | undefined,
  adminUrlOrNotice: string | DiscordApplicationNotice,
  legacy?: { title: string; desired_date: string; print_scale: PrintScale }
): Promise<void> {
  if (!webhookUrl) return;

  const notice: DiscordApplicationNotice =
    typeof adminUrlOrNotice === 'string' && legacy
      ? { ...legacy, adminDeepLink: adminUrlOrNotice }
      : (adminUrlOrNotice as DiscordApplicationNotice);

  const scaleLabel = SCALE_LABELS[notice.print_scale] ?? notice.print_scale;
  const formSnippet = notice.applicationFormText?.trim()
    ? `\n\`\`\`\n${notice.applicationFormText.trim().slice(0, 1800)}\n\`\`\``
    : '';

  const payload = {
    content: `新しい予約申請があります。\n${notice.adminDeepLink}${formSnippet}`,
    embeds: [
      {
        title: '3D印刷 予約申請',
        color: 0xf6821f,
        fields: [
          { name: 'タイトル', value: notice.title, inline: true },
          { name: '希望印刷日', value: notice.desired_date, inline: true },
          { name: '印刷規模', value: scaleLabel, inline: true },
        ],
        footer: { text: 'リンク先で該当日付が選択されます。担当者を選び「予約を受領」してください' },
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
