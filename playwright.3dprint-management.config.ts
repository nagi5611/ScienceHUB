import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.ICV_TEST_PORT ?? 8788);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "tests/3dprint-management",
  testMatch: ["**/*.spec.ts"],
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `npm run build:3dprint-ui && npm run db:migrate:local && npx wrangler pages dev public --port ${PORT} --d1 sciencehub_db=sciencehub-db --r2 sciencehub_files=sciencehub-files`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
