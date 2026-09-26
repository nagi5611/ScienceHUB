import {
  getAllMembers,
  setGoogleEventId,
  type Member,
  type Reservation,
} from './reservations';
import {
  createCalendarEventForReservation,
  deleteCalendarEvent,
  type GoogleCalendarEnv,
} from './google-calendar';

const CALENDAR_ACTIVE_STATUSES = new Set<Reservation['status']>(['accepted', 'printing']);

/** Recreates Google Calendar events after admin PATCH staff/status changes on active reservations. */
export async function syncReservationCalendarAfterAdminPatch(
  env: GoogleCalendarEnv & { DB: D1Database },
  existing: Reservation,
  updated: Reservation,
  patch: { print_staff_member_id?: string | null; status?: string }
): Promise<{ ok: boolean; error?: string } | null> {
  if (!CALENDAR_ACTIVE_STATUSES.has(updated.status) || !updated.print_staff_member_id) {
    return null;
  }

  const staffChanged =
    patch.print_staff_member_id !== undefined &&
    patch.print_staff_member_id !== existing.print_staff_member_id;
  const statusChanged =
    patch.status !== undefined && patch.status !== existing.status;
  const needsBackfill =
    !existing.google_event_id &&
    CALENDAR_ACTIVE_STATUSES.has(existing.status) &&
    !!existing.print_staff_member_id;

  const needsSync =
    staffChanged ||
    (statusChanged && CALENDAR_ACTIVE_STATUSES.has(updated.status)) ||
    needsBackfill;

  if (!needsSync) {
    return null;
  }

  const eventId = updated.google_event_id ?? existing.google_event_id;
  if (eventId) {
    await deleteCalendarEvent(env, eventId);
    await setGoogleEventId(env.DB, updated.id, null);
  }

  const memberMap = await loadMemberMap(env.DB);
  const calendarResult = await createCalendarEventForReservation(env, updated, memberMap);
  if (calendarResult.ok && calendarResult.eventId) {
    await setGoogleEventId(env.DB, updated.id, calendarResult.eventId);
    return { ok: true };
  }

  return {
    ok: false,
    error: calendarResult.error ?? 'カレンダーへの追加に失敗しました',
  };
}

async function loadMemberMap(db: D1Database): Promise<Map<string, Member>> {
  const members = await getAllMembers(db);
  return new Map(members.map((m) => [m.id, m]));
}
