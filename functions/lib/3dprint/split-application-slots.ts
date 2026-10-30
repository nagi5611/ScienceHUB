import type { Reservation } from './reservations';
import {
  createReservation,
  getReservationById,
  getReservationsInRange,
  updateReservationAdmin,
} from './reservations';
import type { Printer } from './printers';
import { reservationToApplication } from './applications-api';
import {
  DAY_START,
  SLOT_MIN,
  slotIndexFromMinute,
  spanOfReservation,
  hasTimeSlotOverlap,
} from './time-slots';

export type DesignTargetStatus = 'pending' | 'approved' | 'done' | 'cancelled';

function designStatusToDb(status: DesignTargetStatus): Reservation['status'] {
  switch (status) {
    case 'pending':
      return 'applied';
    case 'approved':
      return 'accepted';
    case 'done':
      return 'delivered';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'applied';
  }
}

function slotIndexesOf(r: Reservation): number[] {
  const sp = spanOfReservation(r);
  const s = slotIndexFromMinute(sp.start);
  const e = slotIndexFromMinute(sp.end);
  const out: number[] = [];
  for (let i = s; i < e; i++) out.push(i);
  return out;
}

function minuteRangeFromSlotIndexes(slots: number[]): { start_minute: number; end_minute: number } {
  const sorted = [...slots].sort((a, b) => a - b);
  const start = DAY_START + sorted[0] * SLOT_MIN;
  const end = DAY_START + (sorted[sorted.length - 1] + 1) * SLOT_MIN;
  return { start_minute: start, end_minute: end };
}

function groupContiguous(slots: number[]): number[][] {
  const sorted = [...slots].sort((a, b) => a - b);
  const groups: number[][] = [];
  for (const i of sorted) {
    const g = groups[groups.length - 1];
    if (g && g[g.length - 1] + 1 === i) g.push(i);
    else groups.push([i]);
  }
  return groups;
}

function cloneReservationBase(r: Reservation, id: string): Reservation {
  return {
    ...r,
    id,
    slot_group_id: r.slot_group_id ?? r.id,
    google_event_id: null,
    created_at: new Date().toISOString(),
  };
}

/** Split a time-slot reservation and apply status to selected 30-min slots. */
export async function splitApplicationSlots(
  db: D1Database,
  reservationId: string,
  slotIndexes: number[],
  targetStatus: DesignTargetStatus,
  printerMap: Map<string, Printer>
): Promise<ReturnType<typeof reservationToApplication>[]> {
  const original = await getReservationById(db, reservationId);
  if (!original) throw new Error('予約が見つかりません');
  if (original.booking_kind === 'request') {
    throw new Error('依頼は部分枠操作できません');
  }
  if (original.start_minute == null || original.end_minute == null) {
    throw new Error('タイムスロット予約のみ部分枠操作できます');
  }

  const all = slotIndexesOf(original);
  const hit = slotIndexes.filter((i) => all.includes(i));
  if (!hit.length) throw new Error('対象の時間枠がありません');
  if (hit.length === all.length) {
    await updateReservationAdmin(db, reservationId, { status: designStatusToDb(targetStatus) });
    const updated = await getReservationById(db, reservationId);
    if (!updated) throw new Error('更新に失敗しました');
    const app = reservationToApplication(updated, printerMap);
    return app ? [app] : [];
  }

  const rest = all.filter((i) => !hit.includes(i));
  const dbTarget = designStatusToDb(targetStatus);
  const groupId = original.slot_group_id ?? original.id;

  const dayRows = await getReservationsInRange(db, original.desired_date, original.desired_date, 'standard');

  const makeRow = async (slots: number[], status: Reservation['status'], keepId?: string) => {
    const range = minuteRangeFromSlotIndexes(slots);
    const cand = {
      ...original,
      id: keepId ?? crypto.randomUUID(),
      start_minute: range.start_minute,
      end_minute: range.end_minute,
      status,
      slot_group_id: groupId,
    };
    if (
      hasTimeSlotOverlap(dayRows.filter((r) => r.id !== reservationId), {
        id: cand.id,
        desired_date: cand.desired_date,
        printer_id: cand.printer_id,
        booking_kind: 'reserve',
        start_minute: range.start_minute,
        end_minute: range.end_minute,
        status: cand.status,
      })
    ) {
      throw new Error('分割後の時間帯が他の予約と重なります');
    }
    if (keepId) {
      await updateReservationAdmin(db, keepId, {
        status,
        start_minute: range.start_minute,
        end_minute: range.end_minute,
        slot_group_id: groupId,
      });
      return await getReservationById(db, keepId);
    }
    const row = cloneReservationBase(cand, cand.id);
    row.start_minute = range.start_minute;
    row.end_minute = range.end_minute;
    row.status = status;
    await createReservation(db, row);
    return await getReservationById(db, row.id);
  };

  const hitGroups = groupContiguous(hit);
  const restGroups = groupContiguous(rest);
  const results: Reservation[] = [];

  for (let gi = 0; gi < hitGroups.length; gi++) {
    const row = await makeRow(hitGroups[gi], dbTarget, gi === 0 ? reservationId : undefined);
    if (row) results.push(row);
  }
  for (const g of restGroups) {
    const row = await makeRow(g, original.status);
    if (row) results.push(row);
  }

  return results
    .map((r) => reservationToApplication(r, printerMap))
    .filter((a): a is NonNullable<typeof a> => a !== null);
}
