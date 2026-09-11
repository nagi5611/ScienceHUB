/**
 * 本番 D1/R2 向けストレージファイルインデックスバックフィル
 * Usage: npx tsx scripts/backfill-storage-index-remote.ts
 */

import { getPlatformProxy } from "wrangler";
import {
  backfillStorageIndexChunk,
  listPendingBackfillRootIds,
} from "../functions/lib/storage/file-index-backfill";
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

  let iteration = 0;
  const maxIterations = 50_000;

  while (iteration < maxIterations) {
    const pending = await listPendingBackfillRootIds(db);
    if (!pending.length) {
      console.log("[backfill] complete — all roots indexed");
      break;
    }

    const rootId = pending[0];
    const result = await backfillStorageIndexChunk(remoteEnv, db, rootId);
    console.log(
      `[backfill] #${iteration + 1} root=${rootId} status=${result.status} chunk=${result.processedThisChunk} total=${result.filesIndexed} complete=${result.complete}`
    );

    if (result.error) {
      console.error(result.error);
      await dispose();
      process.exit(1);
    }

    iteration += 1;
  }

  if (iteration >= maxIterations) {
    console.error("[backfill] stopped: max iterations reached");
    await dispose();
    process.exit(1);
  }

  await dispose();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
