// functions/api/lib/reschedule.ts
import { syncReservationCalendarAfterScheduleChange } from './admin-calendar-sync';
import { getReservationById, updateReservationDesiredDate, type Reservation } from './reservations';
import type { GoogleCalendarEnv } from './google-calendar';
import { isAdminDateBookable } from './slots';
import { validateReservationSlot } from './reservation-edit';
import { normalizePartCount } from './calendar-span';

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
    reservation.id,
    reservation.printer_id ?? undefined,
    {
      isAdmin: true,
      partCount: normalizePartCount(reservation.part_count ?? 1),
    }
  );
  if (slotError) {
    throw new Error(slotError);
  }

  await updateReservationDesiredDate(env.DB, reservation.id, desiredDate);

  let updated = await getReservationById(env.DB, reservation.id);
  if (!updated) {
    throw new Error('予約の更新に失敗しました');
  }

  await syncReservationCalendarAfterScheduleChange(env, reservation, updated);

  updated = await getReservationById(env.DB, reservation.id);
  if (!updated) {
    throw new Error('予約の取得に失敗しました');
  }
  return updated;
}
