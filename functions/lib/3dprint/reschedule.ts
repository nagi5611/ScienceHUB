// functions/api/lib/reschedule.ts
import {
  getAllMembers,
  getReservationById,
  setGoogleEventId,
  updateReservationDesiredDate,
  type Member,
  type Reservation,
} from './reservations';
import {
  createCalendarEventForReservation,
  deleteCalendarEvent,
  type GoogleCalendarEnv,
} from './google-calendar';
import { isAdminDateBookable } from './slots';
import { validateReservationSlot } from './reservation-edit';

/** Reschedules a reservation to a new date (admin). Updates Google Calendar when accepted. */
export async function adminRescheduleReservation(
  env: GoogleCalendarEnv & { DB: D1Database },
  reservationId: string,
  desiredDate: string
): Promise<Reservation> {
  const reservation = await getReservationById(env.DB, reservationId);
  if (!reservation) {
    throw new Error('予約が見つかりません');
  }
  if (reservation.status === 'cancelled') {
    throw new Error('キャンセル済みの予約はリスケできません');
  }
  if (!isAdminDateBookable(desiredDate)) {
    throw new Error('希望印刷日は当日以降を選択してください');
  }
  if (reservation.desired_date === desiredDate) {
    return reservation;
  }

  const slotError = await validateReservationSlot(
    env.DB,
    desiredDate,
    reservation.print_scale,
    reservation.id
  );
  if (slotError) {
    throw new Error(slotError);
  }

  const hadCalendarEvent =
    (reservation.status === 'accepted' || reservation.status === 'printing') &&
    !!reservation.google_event_id;

  if (hadCalendarEvent) {
    await deleteCalendarEvent(env, reservation.google_event_id);
    await setGoogleEventId(env.DB, reservation.id, null);
  }

  await updateReservationDesiredDate(env.DB, reservation.id, desiredDate);

  let updated = await getReservationById(env.DB, reservation.id);
  if (!updated) {
    throw new Error('予約の更新に失敗しました');
  }

  if (
    (updated.status === 'accepted' || updated.status === 'printing') &&
    updated.print_staff_member_id
  ) {
    const memberMap = await loadMemberMap(env.DB);
    const calendarResult = await createCalendarEventForReservation(env, updated, memberMap);
    if (calendarResult.ok && calendarResult.eventId) {
      await setGoogleEventId(env.DB, updated.id, calendarResult.eventId);
    }
  }

  updated = await getReservationById(env.DB, reservation.id);
  if (!updated) {
    throw new Error('予約の取得に失敗しました');
  }
  return updated;
}

/** Loads members as an ID map. */
async function loadMemberMap(db: D1Database): Promise<Map<string, Member>> {
  const members = await getAllMembers(db);
  return new Map(members.map((m) => [m.id, m]));
}
