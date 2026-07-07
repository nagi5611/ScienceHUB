/**
 * メディアサムネイルの IndexedDB キャッシュ（path + updatedAt 秒）
 */

const DB_NAME = "sciencehub-cloud-storage";
const DB_VERSION = 3;
const STORE_NAME = "mediaThumbnails";
const PREVIEW_STORE_NAME = "previewBlobs";
const MAX_ENTRIES = 400;
const MAX_PREVIEW_ENTRIES = 60;

let dbPromise = null;

/** キャッシュキー（論理パス + 更新日時秒。ファイル名ではなく path で一意） */
export function buildMediaCacheKey(path, updatedAt) {
  const updatedAtSec = normalizeUpdatedAtSec(updatedAt);
  return `${path}\x1e${updatedAtSec}`;
}

/** 更新日時を秒単位に正規化 */
export function normalizeUpdatedAtSec(updatedAt) {
  const value =
    typeof updatedAt === "string" && updatedAt.trim() !== ""
      ? Number(updatedAt)
      : updatedAt;
  if (value == null || !Number.isFinite(value)) return 0;
  if (value > 1_000_000_000_000) {
    return Math.floor(value / 1000);
  }
  return Math.floor(value);
}

function upgradeSchema(db) {
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    const store = db.createObjectStore(STORE_NAME, { keyPath: "cacheKey" });
    store.createIndex("byPath", "path", { unique: false });
  }
  if (!db.objectStoreNames.contains(PREVIEW_STORE_NAME)) {
    const previewStore = db.createObjectStore(PREVIEW_STORE_NAME, { keyPath: "cacheKey" });
    previewStore.createIndex("byPath", "path", { unique: false });
  }
}

function openDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      upgradeSchema(request.result);
    };

    request.onblocked = () => {
      console.warn("IndexedDB のアップグレードがブロックされています。他のタブを閉じてください。");
    };

    request.onsuccess = () => {
      const db = request.result;
      if (
        !db.objectStoreNames.contains(STORE_NAME) ||
        !db.objectStoreNames.contains(PREVIEW_STORE_NAME)
      ) {
        const nextVersion = db.version + 1;
        db.close();
        dbPromise = null;
        const retry = indexedDB.open(DB_NAME, nextVersion);
        retry.onupgradeneeded = () => upgradeSchema(retry.result);
        retry.onblocked = request.onblocked;
        retry.onsuccess = () => resolve(retry.result);
        retry.onerror = () => reject(retry.error ?? new Error("IndexedDB を開けませんでした"));
        return;
      }
      resolve(db);
    };
    request.onerror = () => reject(request.error ?? new Error("IndexedDB を開けませんでした"));
  });

  return dbPromise;
}

function runTransaction(mode, fn) {
  return openDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        Promise.resolve(fn(store))
          .then((result) => {
            tx.oncomplete = () => resolve(result);
            tx.onerror = () => reject(tx.error ?? new Error("IndexedDB トランザクションに失敗しました"));
            tx.onabort = () => reject(tx.error ?? new Error("IndexedDB トランザクションが中断されました"));
          })
          .catch(reject);
      })
  );
}

/** キャッシュ済みサムネイル Blob を取得 */
export async function getCachedMediaThumb(path, updatedAt) {
  const cacheKey = buildMediaCacheKey(path, updatedAt);
  const updatedAtSec = normalizeUpdatedAtSec(updatedAt);

  return runTransaction("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.get(cacheKey);
      request.onsuccess = () => {
        const entry = request.result;
        if (!entry || entry.updatedAtSec !== updatedAtSec) {
          resolve(null);
          return;
        }
        resolve(entry.blob ?? null);
      };
      request.onerror = () => reject(request.error);
    });
  });
}

/** サムネイル Blob をキャッシュ */
export async function putCachedMediaThumb(path, updatedAt, blob, kind) {
  const cacheKey = buildMediaCacheKey(path, updatedAt);
  const updatedAtSec = normalizeUpdatedAtSec(updatedAt);
  const mimeType = blob.type || "image/jpeg";

  await runTransaction("readwrite", async (store) => {
    await deleteOtherVersions(store, path, cacheKey);
    await putEntry(store, {
      cacheKey,
      path,
      updatedAtSec,
      kind,
      mimeType,
      blob,
      savedAt: Date.now(),
    });
    await trimCacheSize(store);
  });
}

function runPreviewTransaction(mode, fn) {
  return openDatabase().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(PREVIEW_STORE_NAME, mode);
        const store = tx.objectStore(PREVIEW_STORE_NAME);
        Promise.resolve(fn(store))
          .then((result) => {
            tx.oncomplete = () => resolve(result);
            tx.onerror = () => reject(tx.error ?? new Error("IndexedDB トランザクションに失敗しました"));
            tx.onabort = () => reject(tx.error ?? new Error("IndexedDB トランザクションが中断されました"));
          })
          .catch(reject);
      })
  );
}

/** キャッシュ済みプレビュー Blob を取得 */
export async function getCachedPreviewBlob(path, updatedAt) {
  const cacheKey = buildMediaCacheKey(path, updatedAt);
  const updatedAtSec = normalizeUpdatedAtSec(updatedAt);

  return runPreviewTransaction("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const request = store.get(cacheKey);
      request.onsuccess = () => {
        const entry = request.result;
        if (!entry || entry.updatedAtSec !== updatedAtSec) {
          resolve(null);
          return;
        }
        resolve(entry.blob ?? null);
      };
      request.onerror = () => reject(request.error);
    });
  });
}

/** プレビュー Blob を IndexedDB にキャッシュ */
export async function putCachedPreviewBlob(path, updatedAt, blob, kind) {
  const cacheKey = buildMediaCacheKey(path, updatedAt);
  const updatedAtSec = normalizeUpdatedAtSec(updatedAt);
  const mimeType = blob.type || "application/octet-stream";

  await runPreviewTransaction("readwrite", async (store) => {
    await deleteOtherVersions(store, path, cacheKey);
    await putEntry(store, {
      cacheKey,
      path,
      updatedAtSec,
      kind,
      mimeType,
      blob,
      savedAt: Date.now(),
    });
    await trimPreviewCacheSize(store);
  });
}

function trimPreviewCacheSize(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const entries = request.result ?? [];
      if (entries.length <= MAX_PREVIEW_ENTRIES) {
        resolve();
        return;
      }
      entries.sort((a, b) => (a.savedAt ?? 0) - (b.savedAt ?? 0));
      const removeCount = entries.length - MAX_PREVIEW_ENTRIES;
      let pending = removeCount;
      if (pending === 0) {
        resolve();
        return;
      }
      for (let i = 0; i < removeCount; i += 1) {
        const del = store.delete(entries[i].cacheKey);
        del.onsuccess = () => {
          pending -= 1;
          if (pending === 0) resolve();
        };
        del.onerror = () => reject(del.error);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

function putEntry(store, entry) {
  return new Promise((resolve, reject) => {
    const request = store.put(entry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function deleteOtherVersions(store, path, keepKey) {
  return new Promise((resolve, reject) => {
    const index = store.index("byPath");
    const request = index.openCursor(IDBKeyRange.only(path));
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) {
        resolve();
        return;
      }
      if (cursor.value.cacheKey !== keepKey) {
        cursor.delete();
      }
      cursor.continue();
    };
    request.onerror = () => reject(request.error);
  });
}

function trimCacheSize(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const entries = request.result ?? [];
      if (entries.length <= MAX_ENTRIES) {
        resolve();
        return;
      }
      entries.sort((a, b) => (a.savedAt ?? 0) - (b.savedAt ?? 0));
      const removeCount = entries.length - MAX_ENTRIES;
      let pending = removeCount;
      if (pending === 0) {
        resolve();
        return;
      }
      for (let i = 0; i < removeCount; i += 1) {
        const del = store.delete(entries[i].cacheKey);
        del.onsuccess = () => {
          pending -= 1;
          if (pending === 0) resolve();
        };
        del.onerror = () => reject(del.error);
      }
    };
    request.onerror = () => reject(request.error);
  });
}
