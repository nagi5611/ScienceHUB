/**
 * ファイル行アイコンへのメディアサムネイル（段階的ロード + 中断）
 */

import { classifyFile } from "./file-icons.js";
import { resolveMediaThumbBlob } from "./media-thumb.js";
import { createThumbnailTask, isActiveThumbnailGeneration } from "./thumbnail-session.js";

const FILE_FETCH_CONCURRENCY = 4;
const objectUrlByElement = new WeakMap();

/** 表示中ファイル行のサムネイルを段階的に読み込む */
export function scheduleFileThumbnails(fileItems, generation) {
  if (!fileItems?.length || generation == null) return;

  const targets = fileItems.filter((item) => {
    if (item.type !== "file") return false;
    const kind = classifyFile(item.name).kind;
    return kind === "image" || kind === "video";
  });
  if (targets.length === 0) return;

  const token = generation;
  const queue = [...targets];
  let active = 0;

  const pump = () => {
    if (!isActiveThumbnailGeneration(token)) return;
    while (active < FILE_FETCH_CONCURRENCY && queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      active += 1;
      loadFileThumbnail(item, token)
        .catch(() => {})
        .finally(() => {
          active -= 1;
          pump();
        });
    }
  };

  pump();
}

async function loadFileThumbnail(fileItem, generation) {
  const scope = createThumbnailTask(generation);
  if (!scope) return;

  const { signal, isStale, dispose } = scope;

  try {
    const row = document.querySelector(`.cs-file-row[data-path="${cssEscape(fileItem.path)}"]`);
    if (!row || isStale()) return;

    const icon = row.querySelector("[data-file-thumb]");
    if (!icon || icon.classList.contains("cs-type-icon--has-thumb")) return;

    const kind = classifyFile(fileItem.name).kind;
    const thumbBlob = await resolveMediaThumbBlob(
      { ...fileItem, kind },
      { signal, isStale }
    );

    if (!thumbBlob || isStale() || !document.contains(icon)) return;
    applyThumbToIcon(icon, thumbBlob);
  } catch (error) {
    if (error?.name === "AbortError") return;
  } finally {
    dispose();
  }
}

function applyThumbToIcon(icon, blob) {
  const img = icon.querySelector(".cs-file-thumb");
  if (!img) return;

  const previousUrl = objectUrlByElement.get(img);
  if (previousUrl) URL.revokeObjectURL(previousUrl);

  const url = URL.createObjectURL(blob);
  objectUrlByElement.set(img, url);
  img.src = url;
  img.hidden = false;
  icon.classList.add("cs-type-icon--has-thumb");
}

function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
