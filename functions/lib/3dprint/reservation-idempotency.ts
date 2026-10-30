export type IdempotencyClaim =
  | { kind: 'new' }
  | { kind: 'completed'; response: Record<string, unknown> }
  | { kind: 'processing' };

export type CompletedReservationResponse = {
  id: string;
  message: string;
  auto_confirmed: boolean;
  booking_kind: string | null;
};

/** Try to claim an idempotency key for this user; returns existing state if already claimed. */
export async function claimReservationIdempotencyKey(
  db: D1Database,
  userId: string,
  idempotencyKey: string
): Promise<IdempotencyClaim> {
  const key = idempotencyKey.trim();
  if (!key || key.length > 128) {
    throw new Error('Idempotency-Key が不正です');
  }

  const now = new Date().toISOString();
  const inserted = await db
    .prepare(
      `INSERT INTO print_reservation_idempotency (idempotency_key, user_id, status, created_at)
       VALUES (?, ?, 'processing', ?)
       ON CONFLICT(idempotency_key) DO NOTHING`
    )
    .bind(key, userId, now)
    .run();

  if ((inserted.meta.changes ?? 0) > 0) {
    return { kind: 'new' };
  }

  const row = await db
    .prepare(
      `SELECT user_id, status, response_json FROM print_reservation_idempotency WHERE idempotency_key = ?`
    )
    .bind(key)
    .first<{ user_id: string; status: string; response_json: string | null }>();

  if (!row) {
    return { kind: 'new' };
  }
  if (row.user_id !== userId) {
    throw new Error('Idempotency-Key は別のユーザーで使用中です');
  }
  if (row.status === 'completed' && row.response_json) {
    try {
      return { kind: 'completed', response: JSON.parse(row.response_json) as Record<string, unknown> };
    } catch {
      return { kind: 'processing' };
    }
  }
  return { kind: 'processing' };
}

/** Marks idempotency row complete with the HTTP JSON body to replay on duplicate requests. */
export async function completeReservationIdempotencyKey(
  db: D1Database,
  idempotencyKey: string,
  reservationId: string,
  response: CompletedReservationResponse
): Promise<void> {
  await db
    .prepare(
      `UPDATE print_reservation_idempotency
       SET status = 'completed', reservation_id = ?, response_json = ?
       WHERE idempotency_key = ?`
    )
    .bind(reservationId, JSON.stringify(response), idempotencyKey.trim())
    .run();
}

/** Removes a processing claim so the client may retry after a failed submission. */
export async function releaseReservationIdempotencyKey(
  db: D1Database,
  idempotencyKey: string
): Promise<void> {
  await db
    .prepare(
      `DELETE FROM print_reservation_idempotency
       WHERE idempotency_key = ? AND status = 'processing'`
    )
    .bind(idempotencyKey.trim())
    .run();
}
