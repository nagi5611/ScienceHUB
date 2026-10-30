import type { Reservation } from './reservations';
import type { Printer } from './printers';
import { inferMachineLane } from './printers';
import { spanOfReservation } from './time-slots';
import { getAvailableMemberIdsOnDate, getAllMembers } from './reservations';

const WD = ['日', '月', '火', '水', '木', '金', '土'] as const;

const KIND_LABEL = { reserve: '予約', request: '依頼' } as const;

const MACHINE_META: Record<'ke' | 'cc', { name: string; maker: string }> = {
  ke: { name: 'Ender-3 V3 KE', maker: 'Creality' },
  cc: { name: 'Centauri Carbon', maker: 'Elegoo' },
};

function parseYmd(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function minsLabel(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

function durationLabel(spanMins: number): string {
  if (spanMins < 60) return `${spanMins}分`;
  const h = Math.floor(spanMins / 60);
  const m = spanMins % 60;
  return m ? `${h}時間${m}分` : `${h}時間`;
}

function hrLabel(hr: string): string {
  if (!hr || hr.length < 3) return hr;
  return `${hr[0]}-${hr.slice(1)}`;
}

function mapUiStatus(status: Reservation['status']): string {
  switch (status) {
    case 'accepted':
    case 'printing':
      return '確定';
    case 'delivered':
      return '完了';
    case 'cancelled':
    case 'failed':
      return '取り消し';
    default:
      return '申請中';
  }
}

/** Builds the plain-text「申請書」body (matches management UI export). */
export async function buildPrintApplicationFormText(
  db: D1Database,
  reservation: Reservation,
  printer: Printer | undefined,
  options: { adminNote?: string | null } = {}
): Promise<string> {
  const lane =
    printer?.machine_lane === 'ke' || printer?.machine_lane === 'cc'
      ? printer.machine_lane
      : inferMachineLane(printer?.name ?? '');
  const machine = lane === 'ke' || lane === 'cc' ? MACHINE_META[lane] : { name: printer?.name ?? '—', maker: '—' };
  const kind = reservation.booking_kind === 'request' ? 'request' : 'reserve';
  const span = spanOfReservation({
    booking_kind: reservation.booking_kind,
    start_minute: reservation.start_minute,
    end_minute: reservation.end_minute,
  });
  const d = parseYmd(reservation.desired_date);
  const staffIds = await getAvailableMemberIdsOnDate(db, reservation.desired_date);
  const members = await getAllMembers(db);
  const staffNames = staffIds
    .map((id) => members.find((m) => m.id === id))
    .filter(Boolean)
    .map((m) => m!.name);

  const kindLine =
    kind === 'request'
      ? `${KIND_LABEL.request}（依頼枠を丸ごと占有）`
      : `${KIND_LABEL.reserve}（時間指定）`;

  return [
    'ScienceHUB 3Dプリント 申請書',
    '=============================',
    `作品名      : ${reservation.title}`,
    `日付        : ${reservation.desired_date}（${WD[d.getDay()]}）`,
    `時間        : ${minsLabel(span.start)}〜${minsLabel(span.end)}（${durationLabel(span.end - span.start)}）`,
    `機種        : ${machine.name}（${machine.maker}）`,
    `種別        : ${kindLine}`,
    `状態        : ${mapUiStatus(reservation.status)}`,
    `担当        : ${staffNames.length ? staffNames.join(' / ') : '休み'}`,
    `申請者      : ${reservation.student_name}（${hrLabel(reservation.homeroom)}・${reservation.student_number}番）`,
    `印刷データ  : ${reservation.stl_filename || '—'}${reservation.stl_size_bytes ? `（${(reservation.stl_size_bytes / 1048576).toFixed(2)} MB）` : ''}`,
    `備考        : ${reservation.print_notes ?? reservation.summary ?? '—'}`,
    `担当者メモ  : ${options.adminNote ?? reservation.status_comment ?? '—'}`,
    '',
    `予約ID      : ${reservation.id}`,
    '出力: ScienceHUB 3Dプリント',
  ].join('\n');
}

export function build3dPrintAdminDeepLink(
  baseUrl: string,
  params: { date: string; appId?: string }
): string {
  const base = baseUrl.replace(/\/$/, '');
  const qs = new URLSearchParams({ selected: params.date });
  if (params.appId) qs.set('app', params.appId);
  return `${base}/apps/3dprint-management/?${qs.toString()}`;
}
