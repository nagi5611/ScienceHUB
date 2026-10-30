import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  spanOfReservation,
  hasTimeSlotOverlap,
  isRequestDateBookable,
  validateTimeSlotInput,
  canUserRestoreCancelledReservation,
  SHIFT_START,
  SHIFT_END,
} from './time-slots';
import { addDays } from './slots';

describe('time-slots', () => {
  it('spanOfReservation request uses shift band', () => {
    const span = spanOfReservation({ booking_kind: 'request' });
    assert.equal(span.start, SHIFT_START);
    assert.equal(span.end, SHIFT_END);
  });

  it('hasTimeSlotOverlap detects overlap', () => {
    const existing = [
      {
        id: 'a',
        desired_date: '2026-11-10',
        printer_id: 'p1',
        booking_kind: 'reserve' as const,
        start_minute: 600,
        end_minute: 660,
        status: 'applied',
      },
    ];
    const cand = {
      id: 'b',
      desired_date: '2026-11-10',
      printer_id: 'p1',
      booking_kind: 'reserve' as const,
      start_minute: 630,
      end_minute: 690,
      status: 'applied',
    };
    assert.equal(hasTimeSlotOverlap(existing, cand), true);
  });

  it('validateTimeSlotInput accepts request without times', () => {
    assert.equal(validateTimeSlotInput({ booking_kind: 'request' }), null);
  });

  it('isRequestDateBookable requires future day', () => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(
      new Date()
    );
    assert.equal(isRequestDateBookable(today), false);
  });

  it('canUserRestoreCancelledReservation requires print date after today', () => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(
      new Date()
    );
    const tomorrow = addDays(today, 1);
    assert.equal(canUserRestoreCancelledReservation('request', today), false);
    assert.equal(canUserRestoreCancelledReservation('request', tomorrow), true);
    assert.equal(canUserRestoreCancelledReservation('reserve', today), false);
    assert.equal(canUserRestoreCancelledReservation('reserve', tomorrow), true);
  });
});
