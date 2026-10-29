import type { Application } from './types';

const API_BASE = '/api/3dprint';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
    ...options,
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new ApiError(data.error || `HTTP ${res.status}`, res.status);
  return data as T;
}

export interface PrinterRow {
  id: string;
  name: string;
  machine_lane: 'ke' | 'cc' | null;
  bookable: boolean;
}

export async function fetchPrinters(): Promise<PrinterRow[]> {
  const data = await apiRequest<{ printers: PrinterRow[] }>('printers');
  return data.printers;
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

export async function createTimeSlotReservation(body: {
  title: string;
  printer_id: string;
  desired_date: string;
  booking_kind: 'reserve' | 'request';
  start_minute?: number;
  end_minute?: number;
  stl_r2_key: string;
  stl_filename: string;
  stl_size_bytes: number;
  print_notes?: string;
}): Promise<{ id: string }> {
  return apiRequest('reservations', { method: 'POST', body: JSON.stringify(body) });
}

export async function cancelReservation(id: string): Promise<void> {
  await apiRequest(`reservations/${id}/cancel`, { method: 'POST', body: '{}' });
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
