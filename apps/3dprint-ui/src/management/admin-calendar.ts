/** Sun-first month grid (legacy print-reservation-calendar-ui). */
export function buildCalendarMonthGridDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();
  const startWeekday = firstDay.getDay();
  const days: { dayNum: number; otherMonth: boolean; dateStr: string }[] = [];

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthLast = new Date(year, month - 1, 0).getDate();

  for (let i = 0; i < startWeekday; i++) {
    const dayNum = prevMonthLast - startWeekday + 1 + i;
    days.push({
      dayNum,
      otherMonth: true,
      dateStr: `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
    });
  }

  for (let day = 1; day <= lastDay; day++) {
    days.push({
      dayNum: day,
      otherMonth: false,
      dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  const totalCells = startWeekday + lastDay;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  for (let day = 1; day <= remaining; day++) {
    days.push({
      dayNum: day,
      otherMonth: true,
      dateStr: `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  return days;
}

export function todayJst(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
}
