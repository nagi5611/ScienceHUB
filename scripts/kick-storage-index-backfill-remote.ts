/**
 * 本番 D1/R2 向けストレージインデックスバックフィル（1 チャンクのみ・predeploy 用）
 * Usage: npx tsx scripts/kick-storage-index-backfill-remote.ts
 */

import { getPlatformProxy } from "wrangler";
import { processPendingStorageIndexBackfillChunks } from "../functions/lib/storage/file-index-backfill";
import type { Env } from "../functions/lib/types";

async function main(): Promise<void> {
  const { env, dispose } = await getPlatformProxy<Env>({
    configPath: "./wrangler.jsonc",
    remoteBindings: true,
  });

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

  await dispose();
}

main().catch((err) => {
  console.warn("[storage-index-backfill:kick] skipped:", err instanceof Error ? err.message : err);
});
