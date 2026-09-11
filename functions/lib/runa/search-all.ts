/**
 * Runa — 全ルート横断検索
 */

import type { Env, SessionUser } from "../types";
import { buildVisibleRoots } from "../storage/list";
import { searchStorageFiles } from "../storage/search";
import type { RunaFileItem } from "./tools";

export interface SearchAllOptions {
  query: string;
  days?: number;
  limitPerRoot?: number;
  totalLimit?: number;
}

/** アクセス可能な全ルートを横断検索 */
export async function searchAllRootsForRuna(
  env: Env,
  db: D1Database,
  user: SessionUser,
  options: SearchAllOptions
): Promise<{ items: RunaFileItem[]; total: number }> {
  const query = options.query.trim();
  const days = Math.min(365, Math.max(1, options.days ?? 0));
  const limitPerRoot = Math.min(30, Math.max(1, options.limitPerRoot ?? 15));
  const totalLimit = Math.min(80, Math.max(1, options.totalLimit ?? 40));

  const updatedFrom =
    days > 0 ? Date.now() - days * 24 * 60 * 60 * 1000 : null;

  if (!query && updatedFrom === null) {
    throw new Error("検索語または days（更新日数）を指定してください");
  }

  const roots = await buildVisibleRoots(
    db,
    user.id,
    user.username,
    user.is_admin
  );

  const all: RunaFileItem[] = [];

  for (const root of roots) {
    const rootType = root.type === "user" ? "user" : "group";
    try {
      const result = await searchStorageFiles(env, rootType, root.key, "", {
        query,
        scope: "root",
        updatedFrom,
        limit: limitPerRoot,
        sortField: "updatedAt",
        sortOrder: "desc",
      });
      for (const item of result.items) {
        all.push({
          name: item.name,
          path: item.path,
          type: "file",
          sizeBytes: item.sizeBytes,
          updatedAt: item.updatedAt,
          location: item.location,
        });
      }
    } catch {
      /* skip */
    }
  }

  all.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

  const seen = new Set<string>();
  const deduped: RunaFileItem[] = [];
  for (const item of all) {
    if (seen.has(item.path)) continue;
    seen.add(item.path);
    deduped.push(item);
    if (deduped.length >= totalLimit) break;
  }

  return { items: deduped, total: deduped.length };
}
