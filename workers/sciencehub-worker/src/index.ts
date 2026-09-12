/**
 * workers/sciencehub-worker/src/index.ts
 * Scheduled jobs (Discord mentions, FDS chat attachment cleanup, storage index backfill)
 */

import { sendDailyStaffMentions } from "../../../functions/lib/3dprint/discord";
import { purgeExpiredFdsChatAttachments } from "../../../functions/lib/simulation/fds-request-chat";
import { processPendingStorageIndexBackfillChunks } from "../../../functions/lib/storage/file-index-backfill";

interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  DISCORD_WEBHOOK_URL?: string;
}

const STORAGE_INDEX_BACKFILL_CRON = "*/15 * * * *";

/** Returns today's date string in Asia/Tokyo (YYYY-MM-DD). */
function todayJstDateString(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());
}

/** ストレージインデックスバックフィルの cron 実行結果をログ出力 */
function logStorageIndexBackfillResult(
  result: Awaited<ReturnType<typeof processPendingStorageIndexBackfillChunks>>
): void {
  if (!result.chunksProcessed && !result.pendingRemaining) {
    console.log("[storage-index-backfill] no pending roots");
    return;
  }

  const last = result.results[result.results.length - 1];
  console.log(
    `[storage-index-backfill] chunks=${result.chunksProcessed} pending=${result.pendingRemaining} stoppedOnError=${result.stoppedOnError}` +
      (last
        ? ` lastRoot=${last.rootId} status=${last.status} chunk=${last.processedThisChunk} total=${last.filesIndexed} complete=${last.complete}`
        : "")
  );

  if (last?.error) {
    console.error(`[storage-index-backfill] error: ${last.error}`);
  }
}

export default {
  async scheduled(controller: ScheduledController, env: Env): Promise<void> {
    if (controller.cron === STORAGE_INDEX_BACKFILL_CRON) {
      const result = await processPendingStorageIndexBackfillChunks(env, env.DB);
      logStorageIndexBackfillResult(result);
      return;
    }

    await sendDailyStaffMentions(env.DISCORD_WEBHOOK_URL, env.DB, todayJstDateString());
    await purgeExpiredFdsChatAttachments(env, env.DB);
  },
};
