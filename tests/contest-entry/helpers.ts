import type { APIRequestContext, Page } from "@playwright/test";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "mmh@2048@5431";

/** 管理者セッションで API / ページを利用する */
export async function loginAsAdmin(ctx: Page | APIRequestContext) {
  const response = await ctx.request.post("/api/auth/login", {
    data: {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    },
  });
  if (!response.ok()) {
    throw new Error(`ログイン失敗: ${response.status()}`);
  }
}

/** 参加申請タイトル用の一意文字列 */
export function uniqueContestTitle(prefix = "E2E取消") {
  return `${prefix}-${Date.now().toString(36)}`;
}

export type CreateContestApplicationPayload = {
  schedule_type?: "full_time" | "part_time";
  homeroom?: string;
  student_number?: number;
  student_name?: string;
  title: string;
  impressions?: string | null;
  self_print?: boolean;
};

/** UI 新規作成のフレーク回避のため API で参加申請を作成する */
export async function createContestApplicationViaApi(
  ctx: Page | APIRequestContext,
  payload: CreateContestApplicationPayload
) {
  const response = await ctx.request.post("/api/contest/applications", {
    data: {
      schedule_type: "full_time",
      homeroom: "301",
      student_number: 1,
      student_name: "E2Eテスト",
      self_print: false,
      ...payload,
    },
  });
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`参加申請作成失敗: ${response.status()} ${body}`);
  }
  const data = (await response.json()) as {
    application: { id: string; title: string; can_withdraw?: boolean };
  };
  return data.application;
}
