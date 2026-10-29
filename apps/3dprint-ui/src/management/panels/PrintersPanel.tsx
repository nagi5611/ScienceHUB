import React from 'react';
import {
  createPrinter,
  deletePrinter,
  fetchAdminPrinters,
  getPrintVideoSettings,
  patchPrintVideoSettings,
  patchPrinter,
  uploadPrinterImage,
} from '../admin-api';

export function PrintersPanel({ onToast, onReload }: { onToast: (m: string) => void; onReload?: () => void }) {
  const [printers, setPrinters] = React.useState<
    Awaited<ReturnType<typeof fetchAdminPrinters>>['printers']
  >([]);
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState<File | null>(null);
  const [videoPath, setVideoPath] = React.useState('');
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');

  const load = React.useCallback(async () => {
    const [pr, vid] = await Promise.all([fetchAdminPrinters(), getPrintVideoSettings()]);
    setPrinters(pr.printers);
    setVideoPath(vid.storage_path ?? '');
  }, []);

  React.useEffect(() => {
    void load().catch((e) => onToast(e instanceof Error ? e.message : '読み込み失敗'));
  }, [load, onToast]);

  const add = async () => {
    if (!name.trim()) return;
    try {
      await createPrinter(name.trim(), image ?? undefined);
      setName('');
      setImage(null);
      await load();
      onReload?.();
      onToast('プリンターを追加しました');
    } catch (e) {
      onToast(e instanceof Error ? e.message : '追加失敗');
    }
  };

  const saveVideoPath = async () => {
    try {
      await patchPrintVideoSettings(videoPath.trim());
      onToast('印刷動画の保存先を更新しました');
    } catch (e) {
      onToast(e instanceof Error ? e.message : '保存失敗');
    }
  };

  const saveEdit = async () => {
    if (!editId || !editName.trim()) return;
    try {
      await patchPrinter(editId, { name: editName.trim() });
      setEditId(null);
      await load();
      onToast('更新しました');
    } catch (e) {
      onToast(e instanceof Error ? e.message : '更新失敗');
    }
  };

  return (
    <div className="legacy-panel">
      <section className="card" id="print-video-settings-section">
        <h2 className="section-heading">印刷動画の保存先</h2>
        <p className="hint">管理画面からアップロードする印刷動画のクラウドストレージフォルダ（legacy 同等）。</p>
        <div className="form-group">
          <label htmlFor="print-video-storage-path">保存先フォルダ</label>
          <input
            id="print-video-storage-path"
            className="input"
            value={videoPath}
            onChange={(e) => setVideoPath(e.target.value)}
            placeholder="グループ/フォルダ/パス"
          />
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => void saveVideoPath()}>
          保存先を保存
        </button>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2 className="section-heading">プリンター管理</h2>
        <div className="printer-admin-grid">
          {printers.map((p) => (
            <article key={p.id} className="printer-admin-card">
              {p.image_url ? (
                <img className="printer-admin-image" src={p.image_url} alt="" />
              ) : (
                <div className="printer-admin-image printer-admin-image-placeholder">🖨️</div>
              )}
              <div className="printer-admin-body">
                {editId === p.id ? (
                  <>
                    <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <div className="printer-admin-actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => void saveEdit()}>
                        保存
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>
                        取消
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="printer-admin-title">{p.name}</h3>
                    <p className="hint printer-admin-cap-summary">
                      {p.capabilities?.can_record_print_video ? '動画撮影可' : '動画撮影不可'}
                    </p>
                    <div className="printer-admin-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setEditId(p.id);
                          setEditName(p.name);
                        }}
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          if (confirm(`「${p.name}」を削除しますか？`)) {
                            void deletePrinter(p.id)
                              .then(load)
                              .then(() => onToast('削除しました'))
                              .catch((e) => onToast(e instanceof Error ? e.message : '削除失敗'));
                          }
                        }}
                      >
                        削除
                      </button>
                      <label className="btn btn-secondary btn-sm">
                        画像
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              void uploadPrinterImage(p.id, f)
                                .then(load)
                                .catch((err) => onToast(err instanceof Error ? err.message : '画像失敗'));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="mem-add" style={{ marginTop: 16 }}>
          <input className="input" placeholder="新しいプリンター名" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          <button type="button" className="btn btn-primary" onClick={() => void add()}>
            追加
          </button>
        </div>
      </section>
    </div>
  );
}
