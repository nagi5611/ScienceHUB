import React from 'react';
import { checkManagementAccess } from './admin-api';
import { AdminDesignApp } from './design/AdminDesignApp';

export function AdminApp() {
  const [ready, setReady] = React.useState(false);
  const [denied, setDenied] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      const access = await checkManagementAccess();
      if (access === 'login') {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login/?next=${next}`;
        return;
      }
      if (access === 'denied') {
        setDenied(true);
        return;
      }
      setReady(true);
    })();
  }, []);

  if (denied) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <h1>アクセス拒否</h1>
        <p>3D印刷管理アプリを利用する権限がありません。</p>
        <p>
          <a href="/">ダッシュボードに戻る</a>
        </p>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="main-content" style={{ padding: '2rem' }}>
        <p>読み込み中…</p>
      </main>
    );
  }

  return <AdminDesignApp />;
}
