import type { APIRequestContext, Browser, BrowserContext } from "@playwright/test";
import { loginAsAdmin as loginAsAdminShared } from "../website-publish/helpers";

/** ローカル D1 の管理者セッション */
export async function loginAsAdmin(request: APIRequestContext) {
  await loginAsAdminShared(request);
}

/** 他テストと Cookie を共有しない Playwright コンテキスト */
export async function isolatedContext(browser: Browser): Promise<BrowserContext> {
  return browser.newContext();
}

export interface GuestCredentials {
  username: string;
  email: string;
  password: string;
}

/** ゲストユーザーを API サインアップで作成（セッション Cookie 付与） */
export async function signupGuest(
  request: APIRequestContext,
  tag = "guest"
): Promise<GuestCredentials> {
  const suffix = `${tag}-${Date.now().toString(36)}`;
  const username = `e2e_${suffix}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 32);
  const email = `${username}@example.test`;
  const password = "E2eTestPass1!";
  const response = await request.post("/api/auth/signup", {
    data: {
      username,
      display_name: `E2E ${suffix}`,
      email,
      password,
    },
  });
  if (!response.ok()) {
    throw new Error(`ゲストサインアップ失敗: ${response.status()} ${await response.text()}`);
  }
  return { username, email, password };
}

