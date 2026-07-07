/**

 * 選択項目の順次ダウンロード（ブラウザで個別に保存）

 */



import { apiRequest, fetchDownloadBlob, fetchDownloadInfo } from "./api.js";



const DOWNLOAD_GAP_MS = 250;



function sleep(ms) {

  return new Promise((resolve) => setTimeout(resolve, ms));

}



/** フォルダ内のファイルを再帰的に収集 */

async function collectFilesRecursive(dirPath, namePrefix) {

  const data = await apiRequest(`list?path=${encodeURIComponent(dirPath)}`);

  const results = [];



  for (const item of data.items ?? []) {

    const entryName = namePrefix ? `${namePrefix}/${item.name}` : item.name;

    if (item.type === "folder") {

      results.push(...(await collectFilesRecursive(item.path, entryName)));

    } else {

      results.push({ storagePath: item.path, filename: entryName });

    }

  }



  return results;

}



/** 選択パスからダウンロード対象ファイル一覧を構築 */

export async function collectDownloadEntries(items) {

  const entries = [];

  const seen = new Set();



  for (const item of items) {

    if (item.type === "file") {

      if (!seen.has(item.path)) {

        seen.add(item.path);

        entries.push({ storagePath: item.path, filename: item.name });

      }

      continue;

    }



    const nested = await collectFilesRecursive(item.path, item.name);

    for (const entry of nested) {

      if (seen.has(entry.storagePath)) continue;

      seen.add(entry.storagePath);

      entries.push(entry);

    }

  }



  return entries;

}



/** 認証付きでファイル Blob を取得 */

async function fetchFileBlob(storagePath) {
  return fetchDownloadBlob(storagePath);
}



/** Blob をローカルに保存 */

export function saveBlob(blob, filename) {

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = filename;

  a.click();

  URL.revokeObjectURL(url);

}



function toDownloadFilename(name) {

  return name.replace(/\//g, " - ");

}



/** 単一ファイルをダウンロード */

export async function downloadSingleFile(storagePath, filename) {

  const name = filename ?? storagePath.split("/").pop() ?? "download";

  try {

    const info = await fetchDownloadInfo(storagePath);

    if (info.mode === "direct" && info.url) {

      const a = document.createElement("a");

      a.href = info.url;

      a.download = name;

      a.rel = "noopener";

      document.body.appendChild(a);

      a.click();

      a.remove();

      return;

    }

  } catch {

    // presigned 未設定時はプロキシへフォールバック

  }

  const blob = await fetchFileBlob(storagePath);

  saveBlob(blob, name);

}



/** 選択項目を1件ずつ順番にダウンロード */

export async function downloadItemsSequentially(items, options = {}) {

  const { onProgress } = options;

  const entries = await collectDownloadEntries(items);



  if (entries.length === 0) {

    throw new Error("ダウンロードできるファイルがありません");

  }



  for (let i = 0; i < entries.length; i++) {

    const entry = entries[i];

    await downloadSingleFile(entry.storagePath, toDownloadFilename(entry.filename));

    onProgress?.(i + 1, entries.length, entry.filename);

    if (i < entries.length - 1) {

      await sleep(DOWNLOAD_GAP_MS);

    }

  }



  return { count: entries.length };

}


