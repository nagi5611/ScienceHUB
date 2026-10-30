import React from 'react';
import { stlAdminUrl } from '../admin-api';
import { agoLabel } from './AdminUi';
import { StlPreview } from './StlPreview';

type StlApp = {
  id: string;
  kind: string;
  file?: string | null;
  fileSize?: number | null;
  createdAt?: string;
};

export function StlBlock({ app }: { app: StlApp }) {
  const name = app.file || 'データなし（予約のみ）';
  const size = app.fileSize ? (app.fileSize / 1048576).toFixed(2) + ' MB' : null;
  const stlUrl = app.file ? stlAdminUrl(app.id) : null;

  return (
    <div className="stl">
      <div className="stl-canvas">
        {stlUrl ? (
          <StlPreview src={stlUrl} />
        ) : (
          <>
            <span className="stl-tag">{app.kind === 'request' ? 'STL' : 'RESERVE'}</span>
            <span className="stl-note">{app.kind === 'request' ? 'サムネイル未生成' : 'データ提出なし'}</span>
          </>
        )}
      </div>
      <div className="stl-meta">
        <span className="stl-ext">{app.file ? app.file.split('.').pop()!.toUpperCase() : '—'}</span>
        <span className="stl-name">
          <b className="num">{name}</b>
          <span>{size ? `${size} ・ 更新 ${agoLabel(app.createdAt ?? '')}` : '予約枠のみの申請'}</span>
        </span>
        <span className="stl-actions">
          <a
            className="mini"
            href={stlUrl ?? undefined}
            download={app.file || undefined}
            style={{ textDecoration: 'none', pointerEvents: stlUrl ? 'auto' : 'none', opacity: stlUrl ? 1 : 0.45 }}
          >
            DL
          </a>
          <a
            className="mini"
            href={stlUrl ?? undefined}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', pointerEvents: stlUrl ? 'auto' : 'none', opacity: stlUrl ? 1 : 0.45 }}
          >
            開く
          </a>
        </span>
      </div>
    </div>
  );
}
