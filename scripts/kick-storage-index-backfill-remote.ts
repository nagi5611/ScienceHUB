/**
 * 本番 D1/R2 向けストレージインデックスバックフィル（1 チャンクのみ・predeploy 用）
 * Usage: npx tsx scripts/kick-storage-index-backfill-remote.ts
 *
 * 未処理ルートがなければ wrangler d1 のみで判定し、getPlatformProxy（R2 リモート）を開かない。
 * これにより predeploy 時の Wrangler internal error ログを避ける。
 */

import { spawnSync } from "node:child_process";
import { getPlatformProxy } from "wrangler";
import { processPendingStorageIndexBackfillChunks } from "../functions/lib/storage/file-index-backfill";
import type { Env } from "../functions/lib/types";

const PENDING_CHECK_SQL =
  "SELECT COUNT(*) AS cnt FROM storage_roots sr LEFT JOIN storage_index_backfill ib ON ib.root_id = sr.id WHERE ib.root_id IS NULL OR ib.status != 'complete'";

/** wrangler の進捗行を除き stdout から JSON 配列を取り出す */
function extractWranglerJson(stdout: string): unknown {
  const start = stdout.indexOf("[");
  const end = stdout.lastIndexOf("]");
  if (start < 0 || end <= start) {
    throw new Error("no JSON array in wrangler output");
  }
  return JSON.parse(stdout.slice(start, end + 1));
}

/** リモート D1 に未完了バックフィルがあるか（wrangler d1 execute のみ） */
function hasPendingBackfillRemote(): boolean | null {
  // --file + --remote は結果行ではなくサマリー統計だけ返すため --command を使う（Windows は 1 文字列で spawn）
  const escapedSql = PENDING_CHECK_SQL.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute sciencehub-db --remote --json -y --command "${escapedSql}"`;
  const result = spawnSync(cmd, { encoding: "utf8", shell: true });

  if (result.status !== 0) {
    console.warn(
      "[storage-index-backfill:kick] remote D1 check failed — skipping kick:",
      (result.stderr || result.stdout || "").trim().split("\n")[0] ?? "unknown error"
    );
    return null;
  }

  try {
    const parsed = extractWranglerJson(result.stdout ?? "") as Array<{
      results?: Array<{ cnt?: number }>;
    }>;
    const cnt = parsed[0]?.results?.[0]?.cnt;
    if (typeof cnt !== "number") {
      console.warn("[storage-index-backfill:kick] unexpected D1 check shape — skipping kick");
      return null;
    }
    return cnt > 0;
  } catch {
    console.warn("[storage-index-backfill:kick] could not parse D1 check output — skipping kick");
    return null;
  }
}

async function runBackfillKick(): Promise<void> {
  const { env, dispose } = await getPlatformProxy<Env>({
    configPath: "./wrangler.jsonc",
    remoteBindings: true,
  });

  try {
    const db = env.sciencehub_db ?? env.DB;
    const files = env.sciencehub_files ?? env.FILES;
    if (!db || !files) {
      throw new Error("D1/R2 bindings not available");
    }

    const remoteEnv: Env = {
      ...env,
      DB: db,
      sciencehub_db: db,
      FILES: files,
      sciencehub_files: files,
    };

    const result = await processPendingStorageIndexBackfillChunks(remoteEnv, db, {
      maxChunksPerRun: 1,
    });

    if (!result.chunksProcessed) {
      console.log("[storage-index-backfill:kick] no pending roots");
    } else {
      const chunk = result.results[0];
      console.log(
        `[storage-index-backfill:kick] root=${chunk?.rootId} status=${chunk?.status} chunk=${chunk?.processedThisChunk} total=${chunk?.filesIndexed} complete=${chunk?.complete} pending=${result.pendingRemaining}`
      );
      if (chunk?.error) {
        console.warn(`[storage-index-backfill:kick] error (non-fatal): ${chunk.error}`);
      }
    }
  } finally {
    await dispose();
  }
}

async function main(): Promise<void> {
  const pending = hasPendingBackfillRemote();

  if (pending === false) {
    console.log("[storage-index-backfill:kick] no pending roots");
    return;
  }

  if (pending === null) {
    return;
  }

  console.log("[storage-index-backfill:kick] pending roots found — processing one chunk…");
  await runBackfillKick();
}

main().catch((err) => {
  console.warn("[storage-index-backfill:kick] skipped:", err instanceof Error ? err.message : err);
});
