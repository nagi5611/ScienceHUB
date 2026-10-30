import React from 'react';

type PageLoadingProps = {
  /** Playwright / e2e hook */
  testId?: string;
  /** Centered full-area loader (default) vs compact inline row */
  variant?: 'page' | 'inline';
};

/** Shared initial-load indicator for 3D print reservation and management apps. */
export function PageLoading({ testId, variant = 'page' }: PageLoadingProps) {
  const cls = variant === 'inline' ? 'print3d-loading print3d-loading--inline' : 'print3d-loading';
  return (
    <div className={cls} data-testid={testId} role="status" aria-live="polite" aria-label="読み込み中">
      <div className="print3d-loading-spinner" aria-hidden />
    </div>
  );
}
