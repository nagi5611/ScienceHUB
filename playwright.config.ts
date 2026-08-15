import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.ICV_TEST_PORT ?? 8788);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "tests",
  testMatch: ["**/*.spec.ts"],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `node scripts/upload-ffmpeg-core.mjs --local && npx wrangler pages dev public -c wrangler.jsonc -c workers/image-converter/wrangler.jsonc --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
