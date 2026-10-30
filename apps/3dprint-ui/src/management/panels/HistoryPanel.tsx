import React from 'react';
import type { AdminReservation } from '../admin-api';
import { downloadPrintHistoryCsv } from './history-csv';

const STATUS: Record<string, string> = {
  applied: '申請中',
  accepted: '受領済み',
  printing: '印刷中',
  delivered: '印刷済み',
  failed: '印刷失敗',
  cancelled: 'キャンセル',
};

export function HistoryPanel({
  reservations,
  onOpen,
}: {
  reservations: AdminReservation[];
  onOpen: (r: AdminReservation) => void;
}) {
  const sorted = [...reservations].sort((a, b) => {
    const d = b.desired_date.localeCompare(a.desired_date);
    return d !== 0 ? d : b.created_at.localeCompare(a.created_at);
  });

  if (!sorted.length) {
    return <p className="hint admin-list-empty">履歴がありません</p>;
  }

  return (
    <div className="card legacy-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '0 0 10px', flexWrap: 'wrap' }}>
        <p className="hint" style={{ margin: 0 }}>
          全 {sorted.length} 件
        </p>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={!sorted.length}
          onClick={() => downloadPrintHistoryCsv(sorted)}
        >
          CSVエクスポート
        </button>
      </div>
      <div className="table-wrap admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>希望日</th>
              <th>HR</th>
              <th>タイトル</th>
              <th>パーツ</th>
              <th>ステータス</th>
              <th>担当</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{r.desired_date}</td>
                <td>{r.homeroom}</td>
                <td>{r.title}</td>
                <td>{r.part_count && r.part_count > 1 ? r.part_count : '—'}</td>
                <td>
                  <span className={`status-badge status-${r.status}`}>{STATUS[r.status] ?? r.status}</span>
                </td>
                <td>{r.print_staff_label ? `担当: ${r.print_staff_label}` : '—'}</td>
                <td>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => onOpen(r)}>
                    詳細
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
