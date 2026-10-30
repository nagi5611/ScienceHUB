import { deleteCalendarEvent, type GoogleCalendarEnv } from './google-calendar';
import {
  getReservationById,
  getReservationsByDateAndPrinter,
  updateReservationAdmin,
  type Reservation,
} from './reservations';
import { hasTimeSlotOverlap } from './time-slots';

/** Soft-cancel a reservation (keeps STL in R2 for possible restore). */
export async function softCancelReservation(
  env: GoogleCalendarEnv,
  db: D1Database,
  reservationId: string,
  options: { byUser?: boolean; statusComment?: string | null } = {}
): Promise<Reservation> {
  const reservation = await getReservationById(db, reservationId);
  if (!reservation) {
    throw new Error('予約が見つかりません');
  }
  if (reservation.status === 'cancelled') {
    throw new Error('すでに取り消されています');
  }

  await deleteCalendarEvent(env, reservation.google_event_id);
  await updateReservationAdmin(db, reservationId, {
    status: 'cancelled',
    status_comment:
      options.statusComment ??
      (options.byUser ? '利用者による取り消し' : reservation.status_comment),
  });

  const updated = await getReservationById(db, reservationId);
  if (!updated) throw new Error('予約の更新に失敗しました');
  return updated;
}

/** Restores a cancelled reservation back to 申請中 (applied). */
export async function restoreCancelledReservation(
  db: D1Database,
  reservationId: string,
  options: { isAdmin?: boolean } = {}
): Promise<Reservation> {
  const reservation = await getReservationById(db, reservationId);
  if (!reservation) {
    throw new Error('予約が見つかりません');
  }
  if (reservation.status !== 'cancelled') {
    throw new Error('取り消し済みの申請のみ復元できます');
  }
  if (!reservation.printer_id) {
    throw new Error('プリンター情報がありません');
  }

  const sameDay = await getReservationsByDateAndPrinter(
    db,
    reservation.desired_date,
    reservation.printer_id
  );
  const candidate = {
    id: reservation.id,
    desired_date: reservation.desired_date,
    printer_id: reservation.printer_id,
    booking_kind: reservation.booking_kind ?? 'reserve',
    start_minute: reservation.start_minute,
    end_minute: reservation.end_minute,
    status: 'applied',
  };
  if (hasTimeSlotOverlap(sameDay.filter((r) => r.id !== reservation.id), candidate)) {
    throw new Error('同じ時間帯に別の申請があるため、取り消しを元に戻せません');
  }

  await updateReservationAdmin(db, reservationId, {
    status: 'applied',
    status_comment: options.isAdmin ? '担当者により復元' : '利用者により取り消しを取消',
  });

  const updated = await getReservationById(db, reservationId);
  if (!updated) throw new Error('予約の復元に失敗しました');
  return updated;
}
