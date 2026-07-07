/**
 * 3D印刷 Discord 朝メンション（毎日 6:00 JST）
 */

import { sendDailyStaffMentions } from "../../../functions/lib/3dprint/discord";

interface Env {
  DB: D1Database;
  DISCORD_WEBHOOK_URL?: string;
}

/** Returns today's date string in Asia/Tokyo (YYYY-MM-DD). */
function todayJstDateString(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());
}

export default {
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await sendDailyStaffMentions(env.DISCORD_WEBHOOK_URL, env.DB, todayJstDateString());
  },
};
