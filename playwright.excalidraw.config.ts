import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.ICV_TEST_PORT ?? 8788);
const BASE_URL = `http://127.0.0.1:${PORT}`;

/** Excalidraw 共同編集 DO をローカルに載せる Playwright 設定 */
export default defineConfig({
  testDir: "tests/excalidraw",
  testMatch: ["**/*.spec.ts"],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 90_000,
  use: {
    baseURL: BASE_URL,
    trace: process.env.CI ? "retain-on-failure" : "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `npx wrangler pages dev public --ip 127.0.0.1 --port ${PORT} --d1 sciencehub_db=sciencehub-db --r2 sciencehub_files=sciencehub-files --do EXCALIDRAW_COLLAB=ExcalidrawCollabRoom@excalidraw-collab`,
    url: `${BASE_URL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
