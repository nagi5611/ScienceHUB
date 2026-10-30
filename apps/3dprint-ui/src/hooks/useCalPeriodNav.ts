import React from 'react';

export type CalPeriodNavDir = 'prev' | 'next' | null;

/** Tracks slide direction for calendar period changes (prev/next month or 4-week block). */
export function useCalPeriodNav() {
  const [dir, setDir] = React.useState<CalPeriodNavDir>(null);

  const run = React.useCallback((delta: number, action: () => void) => {
    if (delta < 0) setDir('prev');
    else if (delta > 0) setDir('next');
    else setDir(null);
    action();
  }, []);

  const enterClass =
    dir === 'prev'
      ? 'cal-period-enter cal-period-enter--prev'
      : dir === 'next'
        ? 'cal-period-enter cal-period-enter--next'
        : 'cal-period-enter';

  React.useEffect(() => {
    if (!dir) return;
    const id = window.setTimeout(() => setDir(null), 360);
    return () => window.clearTimeout(id);
  }, [dir]);

  return { run, enterClass, dir };
}
