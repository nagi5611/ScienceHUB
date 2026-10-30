import React from 'react';
import { HistoryPanel } from '../panels/HistoryPanel';
import { PrintersPanel } from '../panels/PrintersPanel';
import { ForceReservationModal } from '../panels/ForceReservationModal';
import { LegacyReservationDrawer } from '../panels/LegacyReservationDrawer';
import { fetchAdminReservations, type AdminReservation } from '../admin-api';

export function AdminOpsScreen({
  onBack,
  showToast,
}: {
  onBack: () => void;
  showToast: (text: string, mark?: string) => void;
}) {
  const [tab, setTab] = React.useState<'printers' | 'history'>('printers');
  const [forceOpen, setForceOpen] = React.useState(false);
  const [legacy, setLegacy] = React.useState<AdminReservation | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [reservations, setReservations] = React.useState<AdminReservation[]>([]);
  const [forceDate] = React.useState(() => new Date().toISOString().slice(0, 10));

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
        <button type="button" className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={onBack}>
          申請管理へ戻る
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setForceOpen(true)}>
          強制予約
        </button>
      </div>

      {tab === 'printers' ? (
        <PrintersPanel key={reloadKey} onToast={toast} onReload={() => setReloadKey((k) => k + 1)} />
      ) : (
        <HistoryPanel reservations={reservations} onOpen={(r) => setLegacy(r)} />
      )}

      <ForceReservationModal
        open={forceOpen}
        date={forceDate}
        onClose={() => setForceOpen(false)}
        onSaved={() => {
          setForceOpen(false);
          setReloadKey((k) => k + 1);
          showToast('強制予約を作成しました');
        }}
        onToast={toast}
      />

      <LegacyReservationDrawer
        reservation={legacy}
        onClose={() => setLegacy(null)}
        onToast={toast}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
