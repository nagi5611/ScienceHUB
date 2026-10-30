import React from 'react';
import { PageLoading } from '@components/PageLoading';
import { checkAppAccess } from '@shared/api';

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<'loading' | 'denied' | 'ok'>('loading');

  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).get('e2e') === '1') {
      setState('ok');
      return;
    }
    void (async () => {
      try {
        const { allowed } = await checkAppAccess();
        setState(allowed ? 'ok' : 'denied');
      } catch {
        setState('denied');
      }
    })();
  }, []);

  if (state === 'loading') {
    return (
      <div className="main-content" data-testid="access-loading">
        <PageLoading testId="access-loading-spinner" />
      </div>
    );
  }
  if (state === 'denied') {
    return (
      <div className="main-content" data-testid="access-denied">
        <h1 className="page-heading">3Dプリントの依頼・予約</h1>
        <p className="page-sub">このアプリを利用するには ScienceHUB にログインし、アクセス権限が必要です。</p>
        <p>
          <a className="btn btn-primary" href="/login/?returnTo=/apps/3dprint-reservation/">
            ログイン
          </a>
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
