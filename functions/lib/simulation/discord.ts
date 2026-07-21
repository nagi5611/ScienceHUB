// functions/api/lib/discord.ts
import type { SimScale } from './slots';

const SCALE_LABELS: Record<SimScale, string> = {
  small: 'スモール',
  medium: 'ミディアム',
  large: 'ラージ',
};

const ADMIN_PATH = '/apps/simulation-management/';

/** Builds the full 3D print management app URL from the site base URL. */
export function buildSimulationAdminUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  return `${base}${ADMIN_PATH}`;
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
    if (!r.sim_staff_member_id) continue;
    const list = byStaff.get(r.sim_staff_member_id) ?? [];
    list.push(r);
    byStaff.set(r.sim_staff_member_id, list);
  }

  const mentionParts: string[] = [];
  const mentionUserIds: string[] = [];
  const lines: string[] = [`**${todayJst} のシミュレーション依頼**`];

  for (const [staffId, staffReservations] of byStaff) {
    const member = memberById.get(staffId);
    if (member?.discord_user_id) {
      mentionParts.push(`<@${member.discord_user_id}>`);
      mentionUserIds.push(member.discord_user_id);
    }

    const staffName = member ? `${member.name}（${member.homeroom}）` : '担当者';
    lines.push(`\n**${staffName}**`);
    for (const r of staffReservations) {
      const scale = SCALE_SHORT[r.sim_scale as keyof typeof SCALE_SHORT] ?? r.sim_scale;
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
  reservation: { title: string; desired_date: string; sim_scale: SimScale }
): Promise<void> {
  if (!webhookUrl) return;

  const scaleLabel = SCALE_LABELS[reservation.sim_scale] ?? reservation.sim_scale;

  const payload = {
    content: `予約内容が修正されました。再承認が必要です。\n${adminUrl}`,
    embeds: [
      {
        title: 'シミュレーション 予約修正',
        color: 0xf59e0b,
        fields: [
          { name: 'タイトル', value: reservation.title, inline: true },
          { name: '希望実施日', value: reservation.desired_date, inline: true },
          { name: 'シミュレーション規模', value: scaleLabel, inline: true },
        ],
        footer: { text: '管理画面で実行担当を選び「予約を受領」してください' },
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

/** Sends a Discord webhook notification for a new reservation application. */
export async function notifyReservationApplication(
  webhookUrl: string | undefined,
  adminUrl: string,
  reservation: { title: string; desired_date: string; sim_scale: SimScale }
): Promise<void> {
  if (!webhookUrl) return;

  const scaleLabel = SCALE_LABELS[reservation.sim_scale] ?? reservation.sim_scale;

  const payload = {
    content: `新しい予約申請があります。\n${adminUrl}`,
    embeds: [
      {
        title: 'シミュレーション 予約申請',
        color: 0xf6821f,
        fields: [
          { name: 'タイトル', value: reservation.title, inline: true },
          { name: '希望実施日', value: reservation.desired_date, inline: true },
          { name: 'シミュレーション規模', value: scaleLabel, inline: true },
        ],
        footer: { text: '管理画面で実行担当を選び「予約を受領」してください' },
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
