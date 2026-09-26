import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.ICV_TEST_PORT ?? 8788);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "tests/3dprint-reservation",
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
    command: `npm run db:migrate:local && npx wrangler pages dev public --port ${PORT} --d1 sciencehub_db=sciencehub-db --r2 sciencehub_files=sciencehub-files`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
