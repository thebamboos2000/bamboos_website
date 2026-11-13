import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // Many parallel WebKit instances crash on Windows, so keep this modest.
  workers: 3,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mobile-small",
      use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 800 }, hasTouch: true },
    },
    { name: "mobile-ios", use: { ...devices["iPhone 14"] } },
    {
      name: "tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    // Tests check the public site, whatever a local .env.local is previewing.
    env: { BAMBOOS_VENUE_PHOTO_PREVIEW: "0" },
    timeout: 240_000,
  },
});
