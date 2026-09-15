/**
 * Runa — クラウドストレージ → ウェブサイト公開の橋渡し
 */

import { getFiles } from "../r2";
import type { Env, SessionUser } from "../types";
import { parseLogicalPath, toR2Key } from "../storage/keys";
import { authorizeStoragePath } from "../storage/permissions";
import { searchStorageFiles } from "../storage/search";
import {
  addSiteUsedBytes,
  canAllocateSiteBytes,
  type WebSiteRow,
} from "../website-publish/quota";
import { siteObjectKey } from "../website-publish/keys";
import { contentTypeForPath } from "../website-publish/r2-ops";
import {
  isAllowedStaticFile,
  sanitizeRelativeDir,
  sanitizeRelativePath,
} from "../website-publish/static-policy";

export interface ImportedWebFile {
  storage_path: string;
  site_path: string;
  size: number;
}

export interface ImportStorageToWebSiteResult {
  imported: ImportedWebFile[];
  public_url: string;
  skipped: string[];
}

interface ResolvedImportFile {
  storagePath: string;
  sitePath: string;
  size: number;
}

/** サイト内の配置パスを組み立て */
export function buildSiteDestPath(
  destPrefix: string,
  _storagePath: string,
  storageRelativePath: string
): string {
  const fileName = storageRelativePath.split("/").pop() ?? "file";
  const joined = destPrefix ? `${destPrefix}/${fileName}` : fileName;
  return sanitizeRelativePath(joined.replace(/\\/g, "/"));
}

/** ストレージの論理パスをサイト公開用ファイルへ取り込む */
export async function importStorageFilesToWebSite(
  env: Env,
  db: D1Database,
  user: SessionUser,
  site: WebSiteRow,
  storagePaths: string[],
  destPrefixRaw = ""
): Promise<ImportStorageToWebSiteResult> {
  const destPrefix = sanitizeRelativeDir(destPrefixRaw);
  const uniquePaths = [...new Set(storagePaths.map((p) => p.trim()).filter(Boolean))];
  if (!uniquePaths.length) {
    throw new Error("storage_paths を指定してください");
  }

  const bucket = getFiles(env);
  const resolved: ResolvedImportFile[] = [];
  const skipped: string[] = [];

  for (const storagePath of uniquePaths) {
    const expanded = await expandStoragePathsForImport(
      env,
      db,
      user,
      storagePath,
      destPrefix
    );
    for (const entry of expanded) {
      if (!isAllowedStaticFile(entry.sitePath)) {
        skipped.push(`${entry.storagePath}（許可されていない形式）`);
        continue;
      }
      resolved.push(entry);
    }
  }

  if (!resolved.length) {
    throw new Error("取り込めるファイルがありません");
  }

  const totalBytes = resolved.reduce((sum, item) => sum + item.size, 0);
  if (!(await canAllocateSiteBytes(db, site, totalBytes))) {
    throw new Error(
      "ストレージ上限（個人ファイルと公開サイトの合計）を超えるため取り込めません"
    );
  }

  const imported: ImportedWebFile[] = [];

  for (const item of resolved) {
    const parsed = parseLogicalPath(item.storagePath);
    if (!parsed?.relativePath) {
      skipped.push(`${item.storagePath}（パス不正）`);
      continue;
    }

    const auth = await authorizeStoragePath(
      env,
      db,
      user,
      item.storagePath,
      "read",
      false
    );
    if (typeof auth === "string") {
      skipped.push(`${item.storagePath}（${auth}）`);
      continue;
    }

    const sourceKey = toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath);
    const obj = await bucket.get(sourceKey);
    if (!obj) {
      skipped.push(`${item.storagePath}（ファイルが見つかりません）`);
      continue;
    }

    const body = await obj.arrayBuffer();
    const destKey = siteObjectKey(site.dir_name, item.sitePath);
    await bucket.put(destKey, body, {
      httpMetadata: { contentType: contentTypeForPath(item.sitePath) },
    });

    imported.push({
      storage_path: item.storagePath,
      site_path: item.sitePath,
      size: body.byteLength,
    });
  }

  if (!imported.length) {
    throw new Error("取り込みに成功したファイルがありません");
  }

  const importedBytes = imported.reduce((sum, item) => sum + item.size, 0);
  await addSiteUsedBytes(db, site.id, importedBytes);

  return {
    imported,
    public_url: `/web/${site.path_slug}/`,
    skipped,
  };
}

async function expandStoragePathsForImport(
  env: Env,
  db: D1Database,
  user: SessionUser,
  storagePath: string,
  destPrefix = ""
): Promise<ResolvedImportFile[]> {
  const parsed = parseLogicalPath(storagePath);
  if (!parsed) {
    throw new Error(`無効なパスです: ${storagePath}`);
  }

  const bucket = getFiles(env);
  const fileKey = parsed.relativePath
    ? toR2Key(parsed.rootType, parsed.rootKey, parsed.relativePath)
    : null;
  const fileHead = fileKey ? await bucket.head(fileKey) : null;

  if (fileHead) {
    const fileAuth = await authorizeStoragePath(
      env,
      db,
      user,
      storagePath,
      "read",
      false
    );
    if (typeof fileAuth === "string") {
      throw new Error(fileAuth);
    }

    const sitePath = buildSiteDestPath(
      destPrefix,
      storagePath,
      parsed.relativePath ?? ""
    );
    return [{ storagePath, sitePath, size: fileHead.size }];
  }

  const folderAuth = await authorizeStoragePath(
    env,
    db,
    user,
    storagePath,
    "read",
    true
  );
  if (typeof folderAuth === "string") {
    throw new Error(folderAuth);
  }

  const search = await searchStorageFiles(
    env,
    db,
    parsed.rootType,
    parsed.rootKey,
    parsed.relativePath,
    {
      query: "",
      scope: "subtree",
      limit: 200,
    }
  );

  const base = storagePath.replace(/\/+$/, "");
  const out: ResolvedImportFile[] = [];
  for (const item of search.items) {
    if (item.type !== "file") continue;
    const relative = item.path.startsWith(`${base}/`)
      ? item.path.slice(base.length + 1)
      : item.name;
    const joined = destPrefix ? `${destPrefix}/${relative}` : relative;
    try {
      const sitePath = sanitizeRelativePath(joined.replace(/\\/g, "/"));
      out.push({
        storagePath: item.path,
        sitePath,
        size: item.sizeBytes ?? 0,
      });
    } catch {
      /* skip disallowed extensions */
    }
  }

  return out;
}
