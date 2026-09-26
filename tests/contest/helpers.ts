import type { APIRequestContext, Browser, BrowserContext } from "@playwright/test";
import { loginAsAdmin as loginAsAdminShared } from "../website-publish/helpers";

export async function loginAsAdmin(request: APIRequestContext) {
  await loginAsAdminShared(request);
}

export async function isolatedContext(browser: Browser): Promise<BrowserContext> {
  return browser.newContext();
}

export async function signupGuest(request: APIRequestContext, tag = "guest") {
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
    throw new Error(`ゲストサインアップ失敗: ${response.status()}`);
  }
  return { username, email, password };
}
