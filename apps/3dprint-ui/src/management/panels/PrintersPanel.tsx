import React from 'react';
import { MACHINES } from '@shared/domain';
import { DndPickGrid, DndPickTile } from '@components/DndPickTile';
import { ImageDropzone } from '@components/ImageDropzone';
import {
  createPrinter,
  deletePrinter,
  fetchAdminPrinters,
  getPrintVideoSettings,
  listStorageFolders,
  patchPrintVideoSettings,
  patchPrinter,
  uploadPrinterImage,
} from '../admin-api';

type Printer = Awaited<ReturnType<typeof fetchAdminPrinters>>['printers'][number];

export function PrintersPanel({ onToast, onReload }: { onToast: (m: string) => void; onReload?: () => void }) {
  const [printers, setPrinters] = React.useState<
    Awaited<ReturnType<typeof fetchAdminPrinters>>['printers']
  >([]);
  const [name, setName] = React.useState('');
  const [lane, setLane] = React.useState<'ke' | 'cc' | null>(null);
  const [image, setImage] = React.useState<File | null>(null);
  const [videoPath, setVideoPath] = React.useState('');
  const [edit, setEdit] = React.useState<Printer | null>(null);
  const [picker, setPicker] = React.useState(false);
  const [roots, setRoots] = React.useState<{ path: string; label: string }[]>([]);
  const [browsePath, setBrowsePath] = React.useState('');
  const [folders, setFolders] = React.useState<{ path: string; name: string }[]>([]);

  const load = React.useCallback(async () => {
    const [pr, vid] = await Promise.all([fetchAdminPrinters(), getPrintVideoSettings()]);
    setPrinters(pr.printers);
    setVideoPath(vid.storage_path ?? '');
    setRoots(vid.group_roots ?? []);
  }, []);

  React.useEffect(() => {
    void load().catch((e) => onToast(e instanceof Error ? e.message : '読み込み失敗'));
  }, [load, onToast]);

  const add = async () => {
    if (!lane) {
      onToast('機種（KE / CC）を選んでください');
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await createPrinter(trimmed, image ?? undefined);
      setName('');
      setLane(null);
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
    if (!edit) return;
    const nozzles = (edit.capabilities?.nozzle_sizes_mm ?? ['0.4']).map(String).filter(Boolean);
    try {
      await patchPrinter(edit.id, {
        name: edit.name.trim(),
        status: edit.status,
        capabilities: {
          can_record_print_video: !!edit.capabilities?.can_record_print_video,
          nozzle_sizes_mm: nozzles,
        },
        daily_capacity: edit.daily_capacity,
      });
      setEdit(null);
      await load();
      onToast('更新しました');
    } catch (e) {
      onToast(e instanceof Error ? e.message : '更新失敗');
    }
  };

  const openPicker = async () => {
    setPicker(true);
    setBrowsePath('');
    setFolders([]);
  };

  const loadFolders = async (path: string) => {
    setBrowsePath(path);
    if (!path) {
      setFolders([]);
      return;
    }
    const data = await listStorageFolders(path);
    setFolders(data.items.map((i) => ({ path: i.path, name: i.name })));
  };

  const STATUS_OPTS = [
    { id: 'available', label: '稼働', desc: '予約・依頼を受け付ける', accent: 'var(--color-success)' },
    { id: 'maintenance', label: 'メンテ', desc: '一時停止（再配置あり）', accent: 'var(--color-warn-ink)' },
    { id: 'unavailable', label: '印刷不能', desc: '予約不可', accent: 'var(--color-text-muted)' },
  ] as const;

  return (
    <div className="legacy-panel ops-printers">
      <section className="card ops-card" id="print-video-settings-section">
        <h2 className="section-heading">印刷動画の保存先</h2>
        <p className="hint">管理画面からアップロードする印刷動画のクラウドストレージフォルダ（legacy 同等）。</p>
        <div className="form-group">
          <label htmlFor="print-video-storage-path">保存先フォルダ</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="print-video-storage-path"
              className="input"
              value={videoPath}
              readOnly
              placeholder="未設定（参照から選択）"
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => void openPicker()}>
              参照…
            </button>
          </div>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => void saveVideoPath()}>
          保存先を保存
        </button>
      </section>

      <section className="card ops-card">
        <h2 className="section-heading">プリンター管理</h2>
        <p className="hint ops-lead">登録済みプリンターの編集・削除、および新規追加ができます。</p>
        <div className="printer-admin-grid">
          {printers.map((p) => (
            <article key={p.id} className="printer-admin-card">
              {p.image_url ? (
                <img className="printer-admin-image" src={p.image_url} alt="" />
              ) : (
                <div className="printer-admin-image printer-admin-image-placeholder">🖨️</div>
              )}
              <div className="printer-admin-body">
                  <>
                    <h3 className="printer-admin-title">{p.name}</h3>
                    <p className="hint printer-admin-cap-summary">
                      {p.status ?? 'available'} / ノズル {(p.capabilities?.nozzle_sizes_mm ?? []).join(', ') || '—'} /{' '}
                      {p.capabilities?.can_record_print_video ? '動画撮影可' : '動画撮影不可'}
                    </p>
                    <div className="printer-admin-actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setEdit(p)}>
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
              </div>
            </article>
          ))}
        </div>
        <div className="printer-add-card" data-testid="printer-add-form">
          <div className="printer-add-head">
            <h3>プリンターを追加</h3>
            <p className="hint">機種を選び、表示名と画像（任意）を設定してから追加します。</p>
          </div>

          <div className="printer-add-block">
            <span className="printer-add-label">機種（どの枠に割り当てるか）</span>
            <DndPickGrid>
              {MACHINES.map((m) => (
                <DndPickTile
                  key={m.id}
                  selected={lane === m.id}
                  badge={m.short}
                  accent={m.id === 'ke' ? 'var(--color-primary)' : 'var(--color-tip)'}
                  title={m.name}
                  description={`${m.maker} ・ ${m.hint}`}
                  onSelect={() => {
                    setLane(m.id);
                    if (!name.trim()) setName(`${m.short} `);
                  }}
                />
              ))}
            </DndPickGrid>
          </div>

          <div className="printer-add-block">
            <label className="printer-add-label" htmlFor="printer-add-name">
              表示名
            </label>
            <input
              id="printer-add-name"
              className="input printer-add-name"
              placeholder={lane ? `${MACHINES.find((x) => x.id === lane)?.short ?? ''} 3号機` : '例: KE 3号機'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="printer-add-block">
            <ImageDropzone file={image} onFile={setImage} />
          </div>

          <div className="printer-add-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!lane || !name.trim()}
              onClick={() => void add()}
            >
              プリンターを追加
            </button>
          </div>
        </div>
      </section>

      {edit && (
        <div className="legacy-modal open" role="dialog" aria-modal="true">
          <div className="legacy-modal-scrim" onClick={() => setEdit(null)} />
          <div className="legacy-modal-body card">
            <h2>{edit.name} を編集</h2>
            <label className="form-group">
              名前
              <input className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </label>
            <div className="form-group">
              <span className="printer-add-label">ステータス</span>
              <DndPickGrid columns={3}>
                {STATUS_OPTS.map((opt) => (
                  <DndPickTile
                    key={opt.id}
                    selected={(edit.status ?? 'available') === opt.id}
                    title={opt.label}
                    description={opt.desc}
                    accent={opt.accent}
                    onSelect={() => setEdit({ ...edit, status: opt.id })}
                  />
                ))}
              </DndPickGrid>
            </div>
            <label className="form-group">
              ノズル径（カンマ区切り）
              <input
                className="input"
                value={(edit.capabilities?.nozzle_sizes_mm ?? []).join(', ')}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    capabilities: {
                      ...edit.capabilities,
                      nozzle_sizes_mm: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    },
                  })
                }
              />
            </label>
            <label className="chk">
              <input
                type="checkbox"
                checked={!!edit.capabilities?.can_record_print_video}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    capabilities: { ...edit.capabilities, can_record_print_video: e.target.checked },
                  })
                }
              />
              動画撮影可
            </label>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 8 }}>
              {(['max_small', 'max_small_with_main', 'max_medium', 'max_large'] as const).map((key) => (
                <label key={key}>
                  {key}
                  <input
                    className="input"
                    type="number"
                    value={edit.daily_capacity?.[key] ?? 0}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        daily_capacity: { ...edit.daily_capacity, [key]: Number(e.target.value) },
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <div className="legacy-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setEdit(null)}>
                キャンセル
              </button>
              <button type="button" className="btn btn-primary" onClick={() => void saveEdit()}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {picker && (
        <div className="legacy-modal open" role="dialog" aria-modal="true">
          <div className="legacy-modal-scrim" onClick={() => setPicker(false)} />
          <div className="legacy-modal-body card">
            <h2>保存先フォルダ</h2>
            <p className="hint">{browsePath || 'チームを選んでください'}</p>
            <div style={{ display: 'grid', gap: 6, maxHeight: 280, overflow: 'auto' }}>
              {!browsePath &&
                roots.map((r) => (
                  <button key={r.path} type="button" className="btn btn-secondary" onClick={() => void loadFolders(r.path)}>
                    {r.label}
                  </button>
                ))}
              {browsePath && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => void loadFolders('')}>
                  チームへ戻る
                </button>
              )}
              {folders.map((f) => (
                <button key={f.path} type="button" className="btn btn-secondary" onClick={() => void loadFolders(f.path)}>
                  {f.name}
                </button>
              ))}
            </div>
            <div className="legacy-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setPicker(false)}>
                閉じる
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!browsePath}
                onClick={() => {
                  setVideoPath(browsePath);
                  setPicker(false);
                }}
              >
                このフォルダを選択
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
