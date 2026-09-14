/**
 * Runa — 画像生成の日次上限
 */

import type { Env } from "../types";
import { runaMaxDailyImages } from "./env";

const DEFAULT_MAX_DAILY_IMAGES = 15;

function todayJstDateString(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

function resolveMaxDailyImages(env: Env): number {
  const parsed = Number.parseInt(runaMaxDailyImages(env) ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_MAX_DAILY_IMAGES;
}

/** 本日の画像生成上限を検証 */
export async function assertRunaDailyImageLimit(
  db: D1Database,
  userId: string,
  env: Env,
  requestedCount = 1
): Promise<void> {
  const maxImages = resolveMaxDailyImages(env);
  const imageDate = todayJstDateString();
  const row = await db
    .prepare(
      `SELECT image_count FROM runa_daily_images WHERE user_id = ? AND image_date = ?`
    )
    .bind(userId, imageDate)
    .first<{ image_count: number }>();

  if ((row?.image_count ?? 0) + requestedCount > maxImages) {
    throw new Error(
      `Runaの画像生成は1日${maxImages}枚までです。本日の上限に達したため、明日またお試しください。`
    );
  }
}

/** 画像生成枚数をカウント */
export async function incrementRunaDailyImages(
  db: D1Database,
  userId: string,
  count = 1
): Promise<void> {
  if (count <= 0) return;
  const imageDate = todayJstDateString();
  await db
    .prepare(
      `INSERT INTO runa_daily_images (user_id, image_date, image_count)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, image_date) DO UPDATE SET
         image_count = image_count + excluded.image_count`
    )
    .bind(userId, imageDate, count)
    .run();
}
