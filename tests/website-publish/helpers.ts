import type { APIRequestContext } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES_DIR = path.join(__dirname, "fixtures");

/** 管理者でログイン */
export async function loginAsAdmin(request: APIRequestContext) {
  const response = await request.post("/api/auth/login", {
    data: {
      username: "admin",
      password: "mmh@2048@5431",
    },
  });
  if (!response.ok()) {
    throw new Error(`ログイン失敗: ${response.status()}`);
  }
}

/** 一意な path_slug を生成 */
export function uniquePathSlug(prefix = "e2e") {
  return `${prefix}-${Date.now().toString(36)}`;
}

/** テスト用 index.html を作成 */
export function buildIndexHtml(title = "E2E Test Site") {
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>${title}</title></head><body><h1>${title}</h1></body></html>`;
}
