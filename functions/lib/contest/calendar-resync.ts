import {
  getAllMembers,
  getAllReservations,
  setGoogleEventId,
  type Member,
  type Reservation,
} from '../3dprint/reservations';
import { resolveReservationCalendarEndDate } from '../3dprint/calendar-span';
import {
  calendarEventExclusiveEndDate,
  createCalendarEventForReservation,
  deleteCalendarEvent,
  getCalendarEventDates,
  isGoogleCalendarConfigured,
  type GoogleCalendarEnv,
} from '../3dprint/google-calendar';

const CALENDAR_ACTIVE_STATUSES = new Set<Reservation['status']>(['accepted', 'printing']);

export interface ContestCalendarResyncSummary {
  ok: boolean;
  configured: boolean;
  scanned: number;
  unchanged: number;
  created: number;
  updated: number;
  deleted: number;
  errors: Array<{ reservationId: string; message: string }>;
  error?: string;
}

function reservationNeedsCalendarEvent(r: Reservation): boolean {
  return CALENDAR_ACTIVE_STATUSES.has(r.status) && !!r.print_staff_member_id;
}

function expectedEventDates(r: Reservation): { startDate: string; endDate: string } {
  const endInclusive = resolveReservationCalendarEndDate(r);
  return {
    startDate: r.desired_date,
    endDate: calendarEventExclusiveEndDate(endInclusive),
  };
}

function datesMatch(
  expected: { startDate: string; endDate: string },
  actual: { startDate: string; endDate: string }
): boolean {
  return expected.startDate === actual.startDate && expected.endDate === actual.endDate;
}

async function loadMemberMap(db: D1Database): Promise<Map<string, Member>> {
  const members = await getAllMembers(db);
  return new Map(members.map((m) => [m.id, m]));
}

async function recreateCalendarEvent(
  env: GoogleCalendarEnv,
  db: D1Database,
  reservation: Reservation,
  memberMap: Map<string, Member>,
  existingEventId: string | null | undefined
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (existingEventId) {
    await deleteCalendarEvent(env, existingEventId);
    await setGoogleEventId(db, reservation.id, null);
  }

  const calendarResult = await createCalendarEventForReservation(env, reservation, memberMap);
  if (calendarResult.ok && calendarResult.eventId) {
    await setGoogleEventId(db, reservation.id, calendarResult.eventId);
    return { ok: true };
  }

  return {
    ok: false,
    message: calendarResult.error ?? 'カレンダーへの追加に失敗しました',
  };
}

/** Reconciles Google Calendar events with contest print reservations in D1. */
export async function resyncContestCalendar(
  env: GoogleCalendarEnv & { DB: D1Database }
): Promise<ContestCalendarResyncSummary> {
  const summary: ContestCalendarResyncSummary = {
    ok: false,
    configured: isGoogleCalendarConfigured(env),
    scanned: 0,
    unchanged: 0,
    created: 0,
    updated: 0,
    deleted: 0,
    errors: [],
  };

  if (!summary.configured) {
    return { ...summary, error: 'Google Calendar のシークレットが未設定です' };
  }

  const reservations = await getAllReservations(env.DB, 'contest');
  summary.scanned = reservations.length;
  const memberMap = await loadMemberMap(env.DB);

  for (const reservation of reservations) {
    try {
      if (reservationNeedsCalendarEvent(reservation)) {
        const expected = expectedEventDates(reservation);

        if (!reservation.google_event_id) {
          const result = await recreateCalendarEvent(env, env.DB, reservation, memberMap, null);
          if (result.ok) {
            summary.created += 1;
          } else {
            summary.errors.push({ reservationId: reservation.id, message: result.message });
          }
          continue;
        }

        const fetched = await getCalendarEventDates(env, reservation.google_event_id);
        if (!fetched.ok) {
          if (fetched.missing) {
            const result = await recreateCalendarEvent(
              env,
              env.DB,
              reservation,
              memberMap,
              reservation.google_event_id
            );
            if (result.ok) {
              summary.updated += 1;
            } else {
              summary.errors.push({ reservationId: reservation.id, message: result.message });
            }
            continue;
          }
          summary.errors.push({
            reservationId: reservation.id,
            message: fetched.error ?? 'カレンダーイベントの取得に失敗しました',
          });
          continue;
        }

        if (datesMatch(expected, fetched.dates)) {
          summary.unchanged += 1;
          continue;
        }

        const result = await recreateCalendarEvent(
          env,
          env.DB,
          reservation,
          memberMap,
          reservation.google_event_id
        );
        if (result.ok) {
          summary.updated += 1;
        } else {
          summary.errors.push({ reservationId: reservation.id, message: result.message });
        }
        continue;
      }

      if (reservation.google_event_id) {
        await deleteCalendarEvent(env, reservation.google_event_id);
        await setGoogleEventId(env.DB, reservation.id, null);
        summary.deleted += 1;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '再同期に失敗しました';
      summary.errors.push({ reservationId: reservation.id, message });
    }
  }

  summary.ok = summary.errors.length === 0;
  return summary;
}
