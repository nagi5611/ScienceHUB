import type { Application } from './types';

const API_BASE = '/api/3dprint';

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
    ...options,
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
  if (!res.ok) throw new ApiError(data.error || `HTTP ${res.status}`, res.status, data.code);
  return data as T;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface PrinterRow {
  id: string;
  name: string;
  machine_lane: 'ke' | 'cc' | null;
  bookable: boolean;
  status: 'available' | 'unavailable' | 'maintenance' | string;
  status_label: string;
  shift_available?: boolean;
}

/** Label shown on the timeline when a lane printer cannot accept bookings. */
export function timelinePrinterUnusableLabel(printer: Pick<PrinterRow, 'bookable' | 'status'>): string | null {
  if (printer.bookable) return null;
  return '使用不可';
}

export type LanePrinterMeta = {
  printerId: string;
  bookable: boolean;
  status: string;
  status_label: string;
  unusableLabel: string | null;
};

export async function fetchPrinters(date?: string): Promise<PrinterRow[]> {
  const qs = date ? `?date=${encodeURIComponent(date)}` : '';
  const data = await apiRequest<{ printers: PrinterRow[] }>(`printers${qs}`);
  return data.printers;
}

/** Maps API printers to ke/cc lanes (first printer per lane). */
export function mapPrintersToLanes(printers: PrinterRow[]): {
  printerByMachine: Record<'ke' | 'cc', string>;
  laneMeta: Record<'ke' | 'cc', LanePrinterMeta | null>;
} {
  const printerByMachine = { ke: '', cc: '' } as Record<'ke' | 'cc', string>;
  const laneMeta = { ke: null, cc: null } as Record<'ke' | 'cc', LanePrinterMeta | null>;

  const toMeta = (p: PrinterRow): LanePrinterMeta => ({
    printerId: p.id,
    bookable: p.bookable,
    status: p.status,
    status_label: p.status_label,
    unusableLabel: timelinePrinterUnusableLabel(p),
  });

  for (const p of printers) {
    if (p.machine_lane === 'ke' && !printerByMachine.ke) {
      printerByMachine.ke = p.id;
      laneMeta.ke = toMeta(p);
    }
    if (p.machine_lane === 'cc' && !printerByMachine.cc) {
      printerByMachine.cc = p.id;
      laneMeta.cc = toMeta(p);
    }
  }
  if (!printerByMachine.ke && printers[0]) {
    printerByMachine.ke = printers[0].id;
    laneMeta.ke = toMeta(printers[0]);
  }
  if (!printerByMachine.cc && printers[1]) {
    printerByMachine.cc = printers[1].id;
    laneMeta.cc = toMeta(printers[1]);
  }
  return { printerByMachine, laneMeta };
}

export async function fetchApplications(from: string, to: string): Promise<{
  applications: Application[];
  staff_dates: Record<string, boolean>;
}> {
  const qs = new URLSearchParams({ from, to });
  const data = await apiRequest<{
    applications: Application[];
    staff_dates: Record<string, boolean>;
  }>(`calendar/applications?${qs}`);
  return data;
}

export async function createTimeSlotReservation(
  body: {
    title: string;
    printer_id: string;
    desired_date: string;
    booking_kind: 'reserve' | 'request';
    start_minute?: number;
    end_minute?: number;
    stl_r2_key: string;
    stl_filename: string;
    stl_size_bytes: number;
    print_files?: Array<{ r2_key: string; filename: string; size_bytes: number }>;
    print_notes?: string;
  },
  idempotencyKey: string
): Promise<{ id: string; message?: string; auto_confirmed?: boolean; booking_kind?: string }> {
  const headers: Record<string, string> = { 'Idempotency-Key': idempotencyKey };
  const deadline = Date.now() + 120_000;
  while (true) {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      code?: string;
      id?: string;
      message?: string;
      auto_confirmed?: boolean;
      booking_kind?: string;
    };
    if (res.ok) return data as { id: string; message?: string; auto_confirmed?: boolean; booking_kind?: string };
    if (
      res.status === 409 &&
      data.code === 'idempotency_in_progress' &&
      Date.now() < deadline
    ) {
      await sleep(400);
      continue;
    }
    throw new ApiError(data.error || `HTTP ${res.status}`, res.status, data.code);
  }
}

export async function cancelReservation(id: string): Promise<void> {
  await apiRequest(`reservations/${id}/cancel`, { method: 'POST', body: '{}' });
}

export async function restoreReservation(id: string): Promise<{ application: Application }> {
  return apiRequest(`reservations/${id}/restore`, { method: 'POST', body: '{}' });
}

export async function fetchCancelledApplications(from: string, to: string): Promise<{
  applications: Application[];
}> {
  const qs = new URLSearchParams({ from, to });
  return apiRequest(`calendar/cancelled-applications?${qs}`);
}

export async function checkAppAccess(): Promise<{ allowed: boolean }> {
  const res = await fetch('/api/apps/3dprint-reservation/access', { credentials: 'include' });
  if (res.status === 403) return { allowed: false };
  if (!res.ok) throw new ApiError('access check failed', res.status);
  return { allowed: true };
}

export async function fetchAuthProfile(): Promise<{
  homeroom?: string;
  student_number?: number;
  student_name?: string;
}> {
  const res = await fetch('/api/auth/profile', { credentials: 'include' });
  if (!res.ok) return {};
  return res.json();
}
