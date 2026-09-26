import type { APIRequestContext } from "@playwright/test";
import { loginAsAdmin as loginAsAdminShared } from "../website-publish/helpers";

export async function loginAsAdmin(request: APIRequestContext) {
  await loginAsAdminShared(request);
}
