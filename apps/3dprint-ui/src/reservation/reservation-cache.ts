import type { Application } from '@shared/types';
import { readJSON, writeJSON } from '@shared/domain';

const STORE_KEY = '3dprint_reservation_range_v1';
const MAX_ENTRIES = 8;

export type ReservationRangeSnapshot = {
  from: string;
  to: string;
  savedAt: number;
  applications: Application[];
  staff_dates: Record<string, boolean>;
  cancelled: Application[];
};

type Store = Record<string, ReservationRangeSnapshot>;

function rangeKey(from: string, to: string): string {
  return `${from}|${to}`;
}

export function readReservationRangeCache(from: string, to: string): ReservationRangeSnapshot | null {
  const store = readJSON<Store>(STORE_KEY, {});
  const entry = store[rangeKey(from, to)];
  if (!entry || entry.from !== from || entry.to !== to) return null;
  return entry;
}

export function writeReservationRangeCache(
  snapshot: Omit<ReservationRangeSnapshot, 'savedAt'> & { savedAt?: number }
): void {
  const store = readJSON<Store>(STORE_KEY, {});
  const key = rangeKey(snapshot.from, snapshot.to);
  store[key] = { ...snapshot, savedAt: snapshot.savedAt ?? Date.now() };
  const keys = Object.keys(store).sort((a, b) => store[b].savedAt - store[a].savedAt);
  for (const k of keys.slice(MAX_ENTRIES)) delete store[k];
  writeJSON(STORE_KEY, store);
}
