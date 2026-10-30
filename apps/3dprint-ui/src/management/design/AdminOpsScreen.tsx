import React from 'react';
import { HistoryPanel } from '../panels/HistoryPanel';
import { PrintersPanel } from '../panels/PrintersPanel';
import { LegacyReservationDrawer } from '../panels/LegacyReservationDrawer';
import { fetchAdminReservations, type AdminReservation } from '../admin-api';

export function AdminOpsScreen({
  showToast,
}: {
  showToast: (text: string, mark?: string) => void;
}) {
  const [tab, setTab] = React.useState<'printers' | 'history'>('printers');
  const [legacy, setLegacy] = React.useState<AdminReservation | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [reservations, setReservations] = React.useState<AdminReservation[]>([]);

  React.useEffect(() => {
    void fetchAdminReservations().then(setReservations);
  }, [reloadKey]);

  const toast = (m: string) => showToast(m);

  return (
    <div className="set-wrap">
      <div className="set-tabs" role="tablist">
        <button type="button" role="tab" className={tab === 'printers' ? 'on' : ''} onClick={() => setTab('printers')}>
          プリンター
        </button>
        <button type="button" role="tab" className={tab === 'history' ? 'on' : ''} onClick={() => setTab('history')}>
          印刷履歴
        </button>
      </div>

      {tab === 'printers' ? (
        <PrintersPanel key={reloadKey} onToast={toast} onReload={() => setReloadKey((k) => k + 1)} />
      ) : (
        <HistoryPanel reservations={reservations} onOpen={(r) => setLegacy(r)} />
      )}

      <LegacyReservationDrawer
        reservation={legacy}
        onClose={() => setLegacy(null)}
        onToast={toast}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
