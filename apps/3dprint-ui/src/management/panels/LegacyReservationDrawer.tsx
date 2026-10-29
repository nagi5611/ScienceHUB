import React from 'react';
import type { AdminReservation } from '../admin-api';
import {
  deletePrintVideo,
  printVideoDownloadUrl,
  uploadPrintVideo,
  patchReservation,
} from '../admin-api';
import { Drawer } from '../components/AdminUi';

const STATUS: Record<string, string> = {
  applied: '申請中',
  accepted: '受領済み',
  printing: '印刷中',
  delivered: '印刷済み',
  failed: '印刷失敗',
  cancelled: 'キャンセル',
};

export function LegacyReservationDrawer({
  reservation,
  onClose,
  onToast,
  onUpdated,
}: {
  reservation: AdminReservation | null;
  onClose: () => void;
  onToast: (m: string) => void;
  onUpdated: () => void;
}) {
  const [hasVideo, setHasVideo] = React.useState(false);

  React.useEffect(() => {
    setHasVideo(!!reservation?.has_print_video);
  }, [reservation]);

  if (!reservation) return null;

  const upload = async (file: File) => {
    try {
      await uploadPrintVideo(reservation.id, file);
      setHasVideo(true);
      onToast('印刷動画をアップロードしました');
      onUpdated();
    } catch (e) {
      onToast(e instanceof Error ? e.message : 'アップロード失敗');
    }
  };

  const removeVideo = async () => {
    try {
      await deletePrintVideo(reservation.id);
      setHasVideo(false);
      onToast('印刷動画を削除しました');
      onUpdated();
    } catch (e) {
      onToast(e instanceof Error ? e.message : '削除失敗');
    }
  };

  return (
    <Drawer
      open={!!reservation}
      title={reservation.title}
      sub={`${reservation.desired_date} · ${reservation.printer_name ?? ''}`}
      onClose={onClose}
      footer={
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          閉じる
        </button>
      }
    >
      <dl className="kv">
        <div>
          <dt>ステータス</dt>
          <dd>{STATUS[reservation.status] ?? reservation.status}</dd>
        </div>
        <div>
          <dt>申請者</dt>
          <dd>
            {reservation.student_name}（{reservation.homeroom} · {reservation.student_number}）
          </dd>
        </div>
        <div>
          <dt>担当</dt>
          <dd>{reservation.print_staff_label ?? '—'}</dd>
        </div>
        <div>
          <dt>規模</dt>
          <dd>{reservation.print_scale}</dd>
        </div>
      </dl>

      <div className="ftitle">印刷動画</div>
      {hasVideo ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a className="btn btn-secondary btn-sm" href={printVideoDownloadUrl(reservation.id)} download>
            動画をダウンロード
          </a>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => void removeVideo()}>
            動画を削除
          </button>
        </div>
      ) : (
        <p className="hint">未アップロード</p>
      )}
      <input type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }} />

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() =>
            void patchReservation(reservation.id, { status: 'delivered' })
              .then(onUpdated)
              .then(() => onToast('完了にしました'))
              .catch((e) => onToast(e instanceof Error ? e.message : '更新失敗'))
          }
        >
          完了にする
        </button>
      </div>
    </Drawer>
  );
}
