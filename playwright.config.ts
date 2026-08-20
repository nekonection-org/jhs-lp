import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

import { e2eEnvironment } from "./e2e/environment";

const adminE2eEnvironment: Record<string, string> =
  process.env.E2E_ADMIN_ENABLED === "true"
    ? {
        ADMIN_ALLOWED_EMAILS: "e2e-admin@example.com",
        ADMIN_DEV_BYPASS: "true",
        ADMIN_DEV_EMAIL: "e2e-admin@example.com",
        DATABASE_HOST: process.env.DATABASE_HOST ?? "",
        DATABASE_NAME: process.env.DATABASE_NAME ?? "",
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? "",
        DATABASE_PORT: process.env.DATABASE_PORT ?? "3306",
        DATABASE_USER: process.env.DATABASE_USER ?? "",
      }
    : {};
const nextCliPath = fileURLToPath(import.meta.resolve("next/dist/bin/next"));
const webServerCommand = `"${process.execPath}" "${nextCliPath}" dev --hostname 127.0.0.1 --port 3100`;
const manageWebServer = process.env.PLAYWRIGHT_SKIP_WEB_SERVER !== "true";

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
  webServer: manageWebServer
    ? {
        command: webServerCommand,
        env: {
          ...adminE2eEnvironment,
          NEXT_PUBLIC_DISCORD_INVITE_URL: e2eEnvironment.discordUrl,
          NEXT_PUBLIC_MODERATOR_APPLICATION_URL:
            e2eEnvironment.moderatorApplicationUrl,
          NEXT_PUBLIC_RUST_SERVER_ADDRESS: e2eEnvironment.rustServerAddress,
          NEXT_PUBLIC_SITE_URL: e2eEnvironment.siteUrl,
          NEXT_PUBLIC_TEBEX_URL: e2eEnvironment.tebexUrl,
        },
        reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "true",
        timeout: 120_000,
        url: e2eEnvironment.siteUrl,
      }
    : undefined,
});
