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

/** Notifies staff via Discord when an FDS request enters secondary review (pending_approval). */
export async function notifyFdsSecondaryReviewPending(
  webhookUrl: string | undefined,
  adminUrl: string,
  mentionUserIds: string[],
  request: {
    id: string;
    title: string;
    input_filename: string;
    mpi_processes: number;
    max_runtime_hours: number;
    desired_date: string | null;
    primary_review_forced: boolean;
    primary_review_issues: string[];
  }
): Promise<void> {
  if (!webhookUrl) return;

  const mentionParts = mentionUserIds.map((id) => `<@${id}>`);
  const headline = request.primary_review_forced
    ? 'FDS 依頼が二次審査待ちです（一次審査を経た強制申請）'
    : 'FDS 依頼が二次審査待ちです（一次審査通過）';

  const issueFields =
    request.primary_review_forced && request.primary_review_issues.length
      ? [
          {
            name: '一次審査の指摘（抜粋）',
            value: request.primary_review_issues.slice(0, 5).join('\n').slice(0, 1000),
            inline: false,
          },
        ]
      : [];

  const payload = {
    content: [...mentionParts, headline, adminUrl].filter(Boolean).join('\n'),
    allowed_mentions: { users: mentionUserIds },
    embeds: [
      {
        title: 'FDS シミュレーション依頼 — 二次審査',
        color: request.primary_review_forced ? 0xf59e0b : 0x22c55e,
        fields: [
          { name: 'タイトル', value: request.title, inline: true },
          { name: 'ファイル', value: request.input_filename, inline: true },
          { name: 'MPI', value: String(request.mpi_processes), inline: true },
          {
            name: '最大実行時間',
            value: `${request.max_runtime_hours} 時間`,
            inline: true,
          },
          ...(request.desired_date
            ? [{ name: '希望日', value: request.desired_date, inline: true }]
            : []),
          { name: '依頼 ID', value: request.id, inline: false },
          ...issueFields,
        ],
        footer: { text: '管理画面の FDS タブで認可してください' },
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
      console.error('FDS Discord webhook failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('FDS Discord webhook error:', err);
  }
}

/** Notifies staff via Discord when an OpenFOAM request enters secondary review. */
export async function notifyOpenfoamSecondaryReviewPending(
  webhookUrl: string | undefined,
  adminUrl: string,
  mentionUserIds: string[],
  request: {
    id: string;
    title: string;
    input_filename: string;
    mpi_processes: number;
    max_runtime_hours: number;
    desired_date: string | null;
    primary_review_forced: boolean;
    primary_review_issues: string[];
  }
): Promise<void> {
  if (!webhookUrl) return;

  const mentionParts = mentionUserIds.map((id) => `<@${id}>`);
  const headline = request.primary_review_forced
    ? 'OpenFOAM 依頼が二次審査待ちです（一次審査を経た強制申請）'
    : 'OpenFOAM 依頼が二次審査待ちです（一次審査通過）';

  const issueFields =
    request.primary_review_forced && request.primary_review_issues.length
      ? [
          {
            name: '一次審査の指摘（抜粋）',
            value: request.primary_review_issues.slice(0, 5).join('\n').slice(0, 1000),
            inline: false,
          },
        ]
      : [];

  const payload = {
    content: [...mentionParts, headline, adminUrl].filter(Boolean).join('\n'),
    allowed_mentions: { users: mentionUserIds },
    embeds: [
      {
        title: 'OpenFOAM シミュレーション依頼 — 二次審査',
        color: request.primary_review_forced ? 0xf59e0b : 0x22c55e,
        fields: [
          { name: 'タイトル', value: request.title, inline: true },
          { name: 'ファイル', value: request.input_filename, inline: true },
          { name: 'MPI', value: String(request.mpi_processes), inline: true },
          {
            name: '最大実行時間',
            value: `${request.max_runtime_hours} 時間`,
            inline: true,
          },
          ...(request.desired_date
            ? [{ name: '希望日', value: request.desired_date, inline: true }]
            : []),
          { name: '依頼 ID', value: request.id, inline: false },
          ...issueFields,
        ],
        footer: { text: '管理画面の OpenFOAM タブで認可してください' },
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
      console.error('OpenFOAM Discord webhook failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('OpenFOAM Discord webhook error:', err);
  }
}
