import React from 'react';
import { SiteHeader, SiteFooter, Toast } from '@components/Chrome';
import { Calendar } from '@components/Calendar';
import { ymd, startOfDay, todayStrOf } from '@shared/domain';
import type { Application } from '@shared/types';

const API = '/api/3dprint';

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}/${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string>) },
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export function AdminApp() {
  const [apps, setApps] = React.useState<Application[]>([]);
  const [selected, setSelected] = React.useState(todayStrOf());
  const [detail, setDetail] = React.useState<Application | null>(null);
  const [toast, setToast] = React.useState<{ text: string } | null>(null);
  const todayStr = ymd(startOfDay(new Date()));

  const load = React.useCallback(async () => {
    const from = selected;
    const to = selected;
    const data = await adminFetch<{ applications: Application[] }>(
      `calendar/applications?from=${from}&to=${to}`
    );
    setApps(data.applications);
  }, [selected]);

  React.useEffect(() => {
    void load().catch((e) => setToast({ text: e instanceof Error ? e.message : '読み込み失敗' }));
  }, [load]);

  const accept = async (id: string) => {
    await adminFetch(`admin/reservations/${id}/accept`, { method: 'POST', body: '{}' });
    setToast({ text: '受領しました' });
    await load();
    setDetail(null);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="site-title">
            ScienceHUB <span>3D印刷 管理</span>
          </a>
        </div>
      </header>
      <div className="main-content" data-testid="management-app">
        <h1 className="page-heading">3D印刷 管理</h1>
        <Calendar selected={selected} onPick={setSelected} apps={apps} todayStr={todayStr} />
        {detail && (
          <div className="card" data-testid="admin-detail">
            <h2>{detail.title}</h2>
            <p>{detail.date} / {detail.kind}</p>
            {detail.status === 'pending' && (
              <button type="button" className="btn btn-primary" data-testid="btn-accept" onClick={() => void accept(detail.id)}>
                受領
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={() => setDetail(null)}>閉じる</button>
          </div>
        )}
        <ul className="admin-res-list">
          {apps.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => setDetail(a)} data-testid={`admin-row-${a.id}`}>
                {a.date} {a.title} ({a.status})
              </button>
            </li>
          ))}
        </ul>
      </div>
      <SiteFooter />
      <Toast toast={toast} />
    </>
  );
}
