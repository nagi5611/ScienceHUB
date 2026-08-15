/**
 * ウェブサイト公開 — ZIP 展開
 */

import { unzipSync } from "fflate";
import { MAX_ZIP_BYTES } from "./constants";
import { siteObjectKey } from "./keys";
import { addSiteUsedBytes, canAllocateSiteBytes, type WebSiteRow } from "./quota";
import { contentTypeForPath } from "./r2-ops";
import { isAllowedStaticFile } from "./static-policy";

export interface ZipExtractResult {
  uploaded: string[];
  skipped: string[];
  total_bytes: number;
  warnings: string[];
}

/** ZIP を展開して R2 に配置 */
export async function extractZipToSite(
  bucket: R2Bucket,
  db: D1Database,
  site: WebSiteRow,
  zipBytes: Uint8Array
): Promise<ZipExtractResult> {
  if (zipBytes.byteLength > MAX_ZIP_BYTES) {
    throw new Error(`ZIP は ${MAX_ZIP_BYTES / (1024 * 1024)}MB 以下にしてください`);
  }

  let archive: Record<string, Uint8Array>;
  try {
    archive = unzipSync(zipBytes);
  } catch {
    throw new Error("ZIP ファイルの展開に失敗しました");
  }

  const uploaded: string[] = [];
  const skipped: string[] = [];
  const warnings: string[] = [];
  let totalNewBytes = 0;

  const entries = Object.entries(archive).filter(([name]) => !name.endsWith("/"));

  for (const [rawName, data] of entries) {
    const normalized = rawName.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!normalized || normalized.includes("__MACOSX")) {
      skipped.push(rawName);
      continue;
    }
    if (!isAllowedStaticFile(normalized)) {
      skipped.push(normalized);
      continue;
    }

    const r2Key = siteObjectKey(site.dir_name, normalized);
    const existing = await bucket.head(r2Key);
    const delta = data.byteLength - (existing?.size ?? 0);
    totalNewBytes += delta;
  }

  if (!canAllocateSiteBytes(site, totalNewBytes)) {
    throw new Error("サイトの容量上限（5GB）を超えるため ZIP を展開できません");
  }

  for (const [rawName, data] of entries) {
    const normalized = rawName.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!normalized || normalized.includes("__MACOSX")) continue;
    if (!isAllowedStaticFile(normalized)) continue;

    const r2Key = siteObjectKey(site.dir_name, normalized);
    await bucket.put(r2Key, data, {
      httpMetadata: { contentType: contentTypeForPath(normalized) },
    });
    uploaded.push(normalized);
  }

  if (uploaded.length === 0) {
    throw new Error("ZIP 内にアップロード可能なファイルがありません");
  }

  if (totalNewBytes > 0) {
    await addSiteUsedBytes(db, site.id, totalNewBytes);
  }

  const hasIndex = uploaded.some(
    (p) => p === "index.html" || p.endsWith("/index.html")
  );
  if (!hasIndex) {
    warnings.push("index.html が含まれていません。ルート URL で表示できない可能性があります");
  }

  return {
    uploaded,
    skipped,
    total_bytes: totalNewBytes,
    warnings,
  };
}
