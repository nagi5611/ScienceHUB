/**
 * フォルダアイコン内へのメディアプレビュー（段階的ロード + キャッシュ）
 */

import { apiRequest } from "./api.js";
import { resolveMediaThumbBlob } from "./media-thumb.js";
import { findFileEntryByPath } from "./list-dom.js";
import { createThumbnailTask, isActiveThumbnailGeneration } from "./thumbnail-session.js";

const FOLDER_FETCH_CONCURRENCY = 3;

const objectUrlByElement = new WeakMap();

/** 表示中フォルダ行のプレビューを段階的に読み込む */
export function scheduleFolderThumbnails(folderItems, generation, options = {}) {
  if (!folderItems?.length || generation == null) return;

  const token = generation;
  const queue = [...folderItems];
  let active = 0;

  const pump = () => {
    if (!isActiveThumbnailGeneration(token)) return;
    while (active < FOLDER_FETCH_CONCURRENCY && queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      active += 1;
      loadFolderPreview(item, token, options)
        .catch(() => {})
        .finally(() => {
          active -= 1;
          pump();
        });
    }
  };

  pump();
}

async function loadFolderPreview(folderItem, generation, options = {}) {
  const scope = createThumbnailTask(generation);
  if (!scope) return;

  const { signal, isStale, dispose } = scope;

  try {
    const row = findFileEntryByPath(folderItem.path);
    if (!row || isStale()) return;

    const icon = row.querySelector(".cs-type-icon--folder[data-folder-preview]");
    if (!icon) return;

    let data;
    try {
      data = await apiRequest(`folder-preview?path=${encodeURIComponent(folderItem.path)}&limit=4`);
    } catch {
      return;
    }

    if (isStale()) return;

    const items = data.items ?? [];
    if (items.length === 0) return;

    icon.classList.add("cs-type-icon--folder-has-preview");
    const grid = icon.querySelector(".cs-folder-preview-grid");
    if (!grid) return;

    for (const previewItem of items) {
      if (isStale() || !document.contains(icon)) return;

      const thumbBlob = await resolveMediaThumbBlob(previewItem, {
        signal,
        isStale,
        maxEdge: options.maxEdge,
      });
      if (!thumbBlob || isStale()) continue;

      appendThumbToGrid(grid, thumbBlob);
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
  } finally {
    dispose();
  }
}

function appendThumbToGrid(grid, blob) {
  const cell = document.createElement("span");
  cell.className = "cs-folder-preview-cell";

  const img = document.createElement("img");
  img.className = "cs-folder-preview-thumb";
  img.alt = "";
  img.decoding = "async";
  img.loading = "lazy";

  const url = URL.createObjectURL(blob);
  objectUrlByElement.set(img, url);
  img.src = url;

  cell.appendChild(img);
  grid.appendChild(cell);

  const count = grid.querySelectorAll(".cs-folder-preview-cell").length;
  grid.dataset.count = String(count);
  grid.classList.toggle("cs-folder-preview-grid--multi", count > 1);
}
