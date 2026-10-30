import type { Reservation } from './reservations';
import type { Printer } from './printers';
import { inferMachineLane } from './printers';
import { spanOfReservation } from './time-slots';

export type UiApplicationStatus = 'pending' | 'approved' | 'rejected' | 'done';

export function mapReservationStatusToUi(status: Reservation['status']): UiApplicationStatus {
  switch (status) {
    case 'accepted':
    case 'printing':
      return 'approved';
    case 'delivered':
      return 'done';
    case 'failed':
    case 'cancelled':
      return 'rejected';
    default:
      return 'pending';
  }
}

export function mapUiStatusToDb(status: UiApplicationStatus): Reservation['status'] | null {
  switch (status) {
    case 'pending':
      return 'applied';
    case 'approved':
      return 'accepted';
    case 'done':
      return 'delivered';
    case 'rejected':
      return 'cancelled';
    default:
      return null;
  }
}

export interface ApplicationApiModel {
  id: string;
  date: string;
  machine: 'ke' | 'cc';
  machine_name: string;
  printer_id: string;
  kind: 'request' | 'reserve';
  start: number;
  end: number;
  title: string;
  file: string;
  file_size?: number;
  note: string;
  who: { name: string; hr: string; num: string };
  status: UiApplicationStatus;
  mine?: boolean;
  created_at?: string;
}

export function reservationToApplication(
  r: Reservation,
  printerMap: Map<string, Printer>,
  options: { userId?: string; viewerId?: string } = {}
): ApplicationApiModel | null {
  if (!r.printer_id) return null;
  const printer = printerMap.get(r.printer_id);
  const lane = printer?.machine_lane ?? inferMachineLane(printer?.name ?? '');
  if (lane !== 'ke' && lane !== 'cc') return null;

  const kind = r.booking_kind === 'request' ? 'request' : 'reserve';
  const span = spanOfReservation({
    booking_kind: r.booking_kind,
    start_minute: r.start_minute,
    end_minute: r.end_minute,
  });

  return {
    id: r.id,
    date: r.desired_date,
    machine: lane,
    machine_name: printer?.name ?? lane,
    printer_id: r.printer_id,
    kind,
    start: span.start,
    end: span.end,
    title: r.title,
    file: r.stl_filename,
    file_size: r.stl_size_bytes,
    note: r.print_notes ?? r.summary ?? '',
    who: {
      name: r.student_name,
      hr: r.homeroom,
      num: String(r.student_number),
    },
    status: mapReservationStatusToUi(r.status),
    mine: options.viewerId ? r.user_id === options.viewerId : options.userId === r.user_id,
    created_at: r.created_at,
  };
}
