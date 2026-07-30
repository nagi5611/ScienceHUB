/**
 * workers/sciencehub-worker/src/index.ts
 * Scheduled jobs (Discord mentions, FDS chat attachment cleanup)
 */

import { sendDailyStaffMentions } from "../../../functions/lib/3dprint/discord";
import { purgeExpiredFdsChatAttachments } from "../../../functions/lib/simulation/fds-request-chat";

interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  DISCORD_WEBHOOK_URL?: string;
}

/** Returns today's date string in Asia/Tokyo (YYYY-MM-DD). */
function todayJstDateString(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());
}

export default {
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await sendDailyStaffMentions(env.DISCORD_WEBHOOK_URL, env.DB, todayJstDateString());
    await purgeExpiredFdsChatAttachments(env, env.DB);
  },
};
