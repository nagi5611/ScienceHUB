import type { AdminReservation } from '../admin-api';

const STATUS: Record<string, string> = {
  applied: '申請中',
  accepted: '受領済み',
  printing: '印刷中',
  delivered: '印刷済み',
  failed: '印刷失敗',
  cancelled: 'キャンセル',
};

function esc(v: unknown): string {
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** UTF-8 CSV for ops print history (Excel-friendly BOM). */
export function exportPrintHistoryCsv(reservations: AdminReservation[]): string {
  const sorted = [...reservations].sort((a, b) => {
    const d = b.desired_date.localeCompare(a.desired_date);
    return d !== 0 ? d : b.created_at.localeCompare(a.created_at);
  });
  const head = [
    '希望日',
    'HR',
    '番号',
    '氏名',
    'タイトル',
    'パーツ数',
    'ステータス',
    '担当',
    'プリンター',
    'STL',
    '作成日時',
  ];
  const lines = [head.join(',')];
  for (const r of sorted) {
    lines.push(
      [
        r.desired_date,
        r.homeroom,
        r.student_number,
        r.student_name,
        r.title,
        r.part_count ?? 1,
        STATUS[r.status] ?? r.status,
        r.print_staff_label ?? '',
        r.printer_name ?? '',
        r.stl_filename ?? '',
        r.created_at,
      ]
        .map(esc)
        .join(',')
    );
  }
  return '\uFEFF' + lines.join('\n');
}

export function downloadPrintHistoryCsv(reservations: AdminReservation[]): void {
  const text = exportPrintHistoryCsv(reservations);
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `3dprint_history_${stamp}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
