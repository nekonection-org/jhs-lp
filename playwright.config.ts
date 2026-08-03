import { defineConfig, devices } from "@playwright/test";

import { e2eEnvironment } from "./e2e/environment";

export default defineConfig({
  expect: {
    timeout: 5_000,
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  outputDir: "test-results",
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { height: 900, width: 1440 },
      },
    },
  ],
  reporter: process.env.CI ? "github" : "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./e2e",
  use: {
    baseURL: e2eEnvironment.siteUrl,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1 --port 3100",
    env: {
      NEXT_PUBLIC_DISCORD_INVITE_URL: e2eEnvironment.discordUrl,
      NEXT_PUBLIC_MODERATOR_APPLICATION_URL:
        e2eEnvironment.moderatorApplicationUrl,
      NEXT_PUBLIC_RUST_SERVER_ADDRESS: e2eEnvironment.rustServerAddress,
      NEXT_PUBLIC_SITE_URL: e2eEnvironment.siteUrl,
      NEXT_PUBLIC_TEBEX_URL: e2eEnvironment.tebexUrl,
      NEXT_PUBLIC_X_URL: e2eEnvironment.xUrl,
    },
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "true",
    timeout: 120_000,
    url: e2eEnvironment.siteUrl,
  },
});
