// public/apps/contest-entry/js/gallery.js
import { apiRequest } from './api.js';
import {
  ensureModelBlobType,
  mountModel3dPreview,
  unmountModel3dPreview,
} from '../../cloud-storage/js/preview-model3d.js';

const API_BASE = '/api/contest';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function modelDownloadUrl(entryId) {
  return `${API_BASE}/gallery/${encodeURIComponent(entryId)}/model`;
}

async function loadPreviewIntoCard(cardEl, entry) {
  const previewHost = cardEl.querySelector('.contest-gallery-preview-host');
  if (!previewHost) return;

  unmountModel3dPreview(previewHost);
  previewHost.innerHTML =
    '<p class="contest-gallery-preview-loading hint">3D プレビューを読み込み中…</p>';

  const url = modelDownloadUrl(entry.id);
  try {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) {
      throw new Error(`プレビュー取得に失敗しました (${res.status})`);
    }
    const rawBlob = await res.blob();
    const blob = ensureModelBlobType(rawBlob, entry.model_filename);
    const objectUrl = URL.createObjectURL(blob);
    await mountModel3dPreview(previewHost, objectUrl, entry.model_filename);
  } catch (err) {
    previewHost.innerHTML = `<p class="hint contest-gallery-preview-error">${escapeHtml(
      err.message || 'プレビューを表示できません'
    )}</p>`;
  }
}

function renderGallery(entries) {
  const grid = document.getElementById('contest-gallery-grid');
  const empty = document.getElementById('contest-gallery-empty');
  const section = document.getElementById('contest-public-gallery');
  if (!grid || !empty || !section) return;

  grid.innerHTML = '';
  empty.classList.toggle('hidden', entries.length > 0);
  section.classList.remove('hidden');

  for (const entry of entries) {
    const card = document.createElement('article');
    card.className = 'contest-gallery-card';
    card.dataset.entryId = entry.id;

    const downloadUrl = modelDownloadUrl(entry.id);
    const sizeLabel = formatFileSize(entry.model_size_bytes);

    card.innerHTML = `
      <div class="contest-gallery-preview-wrap">
        <div class="contest-gallery-preview-host" aria-label="${escapeHtml(entry.title)} の3Dプレビュー"></div>
      </div>
      <div class="contest-gallery-card-body">
        <h3 class="contest-gallery-card-title">${escapeHtml(entry.title)}</h3>
        <p class="hint contest-gallery-file-meta">${escapeHtml(entry.model_filename)}${sizeLabel ? ` · ${escapeHtml(sizeLabel)}` : ''}</p>
        <a class="btn btn-secondary btn-sm contest-gallery-download" href="${escapeHtml(downloadUrl)}" download="${escapeHtml(entry.model_filename)}">モデルをダウンロード</a>
      </div>
    `;

    grid.appendChild(card);
    loadPreviewIntoCard(card, entry);
  }
}

/** Loads and renders the public participant gallery (title + model only). */
export async function initContestPublicGallery() {
  const section = document.getElementById('contest-public-gallery');
  if (!section) return;

  try {
    const data = await apiRequest('gallery');
    const entries = data.entries ?? [];
    renderGallery(entries);
  } catch {
    const empty = document.getElementById('contest-gallery-empty');
    if (empty) {
      empty.classList.remove('hidden');
      empty.textContent = '作品一覧を読み込めませんでした';
    }
  }
}
