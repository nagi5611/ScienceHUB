// functions/api/lib/google-calendar.ts
import type { Member, Reservation } from './reservations';
import { formatMemberLabel } from './reservations';
import type { PrintScale } from './slots';

export interface GoogleCalendarEnv {
  GOOGLE_3DPRINT_CALENDAR_ID?: string;
  GOOGLE_3DPRINT_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_3DPRINT_PRIVATE_KEY?: string;
}

export interface CalendarSyncResult {
  ok: boolean;
  eventId?: string;
  error?: string;
}

export interface CalendarStatusResult {
  configured: boolean;
  ok: boolean;
  error?: string;
  calendarId?: string;
}

const SCALE_SHORT: Record<PrintScale, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
};

const SCALE_LABELS: Record<PrintScale, string> = {
  small: 'スモール',
  medium: 'ミディアム',
  large: 'ラージ',
};

/** Returns true when Google Calendar integration secrets are configured. */
export function isGoogleCalendarConfigured(env: GoogleCalendarEnv): boolean {
  return !!(
    env.GOOGLE_3DPRINT_CALENDAR_ID?.trim() &&
    env.GOOGLE_3DPRINT_SERVICE_ACCOUNT_EMAIL?.trim() &&
    env.GOOGLE_3DPRINT_PRIVATE_KEY?.trim()
  );
}

/** Verifies Google Calendar credentials and calendar access. */
export async function testGoogleCalendarConnection(
  env: GoogleCalendarEnv
): Promise<CalendarStatusResult> {
  if (!isGoogleCalendarConfigured(env)) {
    return { configured: false, ok: false, error: 'シークレットが未設定です' };
  }

  const calendarId = env.GOOGLE_3DPRINT_CALENDAR_ID!.trim();

  try {
    const token = await getAccessToken(env);
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const detail = await res.text();
      return {
        configured: true,
        ok: false,
        calendarId,
        error: formatGoogleApiError(res.status, detail),
      };
    }

    return { configured: true, ok: true, calendarId };
  } catch (err) {
    return {
      configured: true,
      ok: false,
      calendarId,
      error: err instanceof Error ? err.message : '接続テストに失敗しました',
    };
  }
}

/** Creates an all-day Google Calendar event for an accepted reservation. */
export async function createCalendarEventForReservation(
  env: GoogleCalendarEnv,
  reservation: Reservation,
  memberMap: Map<string, Member>
): Promise<CalendarSyncResult> {
  if (!isGoogleCalendarConfigured(env)) {
    return { ok: false, error: 'Google Calendar のシークレットが未設定です' };
  }

  const staffLabel = reservation.print_staff_member_id
    ? memberMap.get(reservation.print_staff_member_id)
    : null;
  const staffText = staffLabel ? formatMemberLabel(staffLabel) : '未割り当て';

  const summary = `${SCALE_SHORT[reservation.print_scale]} ${reservation.title}`;
  const description = [
    `依頼者: ${reservation.homeroom} ${reservation.student_number}番 ${reservation.student_name}`,
    `印刷規模: ${SCALE_LABELS[reservation.print_scale]}`,
    `印刷担当: ${staffText}`,
    reservation.print_notes ? `注意点:\n${reservation.print_notes}` : null,
    reservation.summary ? `概要:\n${reservation.summary}` : null,
    `予約ID: ${reservation.id}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const token = await getAccessToken(env);
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GOOGLE_3DPRINT_CALENDAR_ID!.trim())}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary,
          description,
          start: { date: reservation.desired_date },
          end: { date: nextIsoDate(reservation.desired_date) },
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error('Google Calendar create failed:', res.status, detail);
      return { ok: false, error: formatGoogleApiError(res.status, detail) };
    }

    const data = (await res.json()) as { id?: string };
    if (!data.id) return { ok: false, error: 'イベントIDを取得できませんでした' };
    return { ok: true, eventId: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'カレンダーへの追加に失敗しました';
    console.error('Google Calendar create error:', err);
    return { ok: false, error: message };
  }
}

/** Deletes a Google Calendar event by ID. */
export async function deleteCalendarEvent(
  env: GoogleCalendarEnv,
  eventId: string | null | undefined
): Promise<void> {
  if (!eventId || !isGoogleCalendarConfigured(env)) return;

  try {
    const token = await getAccessToken(env);
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GOOGLE_3DPRINT_CALENDAR_ID!.trim())}/events/${encodeURIComponent(eventId)}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok && res.status !== 404 && res.status !== 410) {
      console.error('Google Calendar delete failed:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Google Calendar delete error:', err);
  }
}

/** Returns a short user-facing message for Google API errors. */
function formatGoogleApiError(status: number, detail: string): string {
  if (status === 404) {
    return 'カレンダーが見つかりません。GOOGLE_3DPRINT_CALENDAR_ID と共有設定を確認してください';
  }
  if (status === 403) {
    return 'カレンダーへの書き込み権限がありません。サービスアカウントに「予定の変更」権限で共有してください';
  }

  try {
    const parsed = JSON.parse(detail) as { error?: { message?: string } };
    if (parsed.error?.message) return parsed.error.message;
  } catch {
    // use raw detail below
  }

  return detail || `Google API エラー (${status})`;
}

/** Returns the next calendar day as YYYY-MM-DD (for all-day event end). */
function nextIsoDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.toISOString().slice(0, 10);
}

/** Obtains a Google API access token via service account JWT. */
async function getAccessToken(env: GoogleCalendarEnv): Promise<string> {
  const jwt = await createServiceAccountJwt(
    env.GOOGLE_3DPRINT_SERVICE_ACCOUNT_EMAIL!.trim(),
    normalizePrivateKey(env.GOOGLE_3DPRINT_PRIVATE_KEY!)
  );

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`認証トークンの取得に失敗しました: ${formatGoogleApiError(res.status, detail)}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('認証トークンが空です');
  return data.access_token;
}

/** Creates a signed JWT for Google service account auth. */
async function createServiceAccountJwt(email: string, privateKeyPem: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claim))}`;
  const key = await importPrivateKey(privateKeyPem);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned)
  );

  return `${unsigned}.${base64UrlEncode(signature)}`;
}

/** Imports a PEM PKCS#8 private key for RS256 signing. */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemBody = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');

  if (!pemBody) {
    throw new Error('秘密鍵の内容が空です。GOOGLE_3DPRINT_PRIVATE_KEY を確認してください');
  }

  let binary: Uint8Array;
  try {
    binary = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  } catch {
    throw new Error('秘密鍵の形式が不正です。\\n ではなく JSON の private_key をそのまま貼ってください');
  }

  try {
    return await crypto.subtle.importKey(
      'pkcs8',
      binary,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
  } catch {
    throw new Error(
      '秘密鍵を読み込めません。BEGIN/END PRIVATE KEY を含む PKCS#8 形式か確認してください'
    );
  }
}

/** Normalizes a private key secret pasted via wrangler or JSON. */
function normalizePrivateKey(key: string): string {
  let normalized = key.trim();

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }

  if (normalized.includes('\\n')) {
    normalized = normalized.replace(/\\n/g, '\n');
  }

  normalized = normalized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  if (!normalized.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'GOOGLE_3DPRINT_PRIVATE_KEY に -----BEGIN PRIVATE KEY----- が含まれていません。JSON の private_key フィールド全体を貼ってください'
    );
  }

  return normalized;
}

/** Base64url-encodes a string or byte buffer. */
function base64UrlEncode(input: string | ArrayBuffer): string {
  const bytes =
    typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
