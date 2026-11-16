import { expect, test } from "@playwright/test";

import { ja } from "../src/content";
import { e2eEnvironment } from "./environment";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("現地の日付と時刻をキーボードで確認できる", async ({ page }) => {
  const date = page.getByLabel("確認する日付");
  const time = page.getByLabel(/確認する時刻/);
  await date.fill("2026-11-16");
  await time.fill("17:59");
  await expect(page.locator(".raid-check-result")).toHaveAttribute(
    "data-allowed",
    "false",
  );
  await time.focus();
  await page.keyboard.press("Tab");
  await expect(date).toBeEnabled();
  await time.fill("18:00");
  await expect(page.locator(".raid-check-result")).toHaveAttribute(
    "data-allowed",
    "true",
  );
});

test("接続コマンドを実際にコピーし、完了表示を返す", async ({
  context,
  page,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page
    .getByRole("button", { name: ja.hero.connection.copyLabel, exact: true })
    .click();
  await expect(page.locator(".connection-command")).toHaveAttribute(
    "data-copy-state",
    "copied",
  );
  await expect(
    page.getByRole("button", {
      name: ja.hero.connection.copiedLabel,
      exact: true,
    }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(`client.connect ${e2eEnvironment.rustServerAddress}`);
});

test("コピーが拒否された場合は手動コピーの案内を読み続けられる", async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => {
        throw new DOMException("Denied", "NotAllowedError");
      },
    });
  });
  await page
    .getByRole("button", { name: ja.hero.connection.copyLabel, exact: true })
    .click();
  const hint = page.locator("#top").getByRole("alert");
  await expect(hint).toHaveText(ja.hero.connection.copyErrorHelp, {
    useInnerText: true,
  });
  await page.waitForTimeout(2100);
  await expect(hint).toBeVisible();
  await expect(page.locator(".connection-command")).toHaveAttribute(
    "data-copy-state",
    "error",
  );
});

test.describe("モバイルの参加導線", () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test("スクロール位置に応じて参加ボタンを表示し、メニューと最終CTAでは隠す", async ({
    page,
  }) => {
    const bar = page.locator(".mobile-join-bar");
    await expect(bar).toHaveCount(0);
    await page
      .locator("#server h2")
      .evaluate((heading) =>
        heading.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link")).toHaveAttribute(
      "href",
      e2eEnvironment.discordUrl,
    );
    const menu = page.locator('button[aria-controls="mobile-navigation"]');
    await menu.click();
    await expect(bar).not.toBeVisible();
    await page.keyboard.press("Escape");
    await expect(bar).toBeVisible();
    await menu.click();
    await page.locator('#mobile-navigation a[href="#rules"]').click();
    await expect(page.locator("#rules h2")).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await page.locator(".join-section").scrollIntoViewIfNeeded();
    await expect(bar).toHaveCount(0);
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(bar).toHaveCount(0);
    await page
      .locator("#server h2")
      .evaluate((heading) =>
        heading.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await expect(bar).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
  });
});

test("Reduced Motionでも日時の切替が機能し、ボタンを拡縮しない", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByLabel("確認する日付").fill("2026-11-16");
  await page.getByLabel(/確認する時刻/).fill("00:00");
  await expect(page.locator(".raid-check-result")).toHaveAttribute(
    "data-allowed",
    "false",
  );
  await expect(page.locator(".scroll-progress")).toHaveCount(0);
  const action = page.locator('#hero-actions a[href="#rules"]');
  await action.scrollIntoViewIfNeeded();
  await action.hover();
  await page.mouse.down();
  try {
    await expect(action).toHaveCSS("transform", "none");
    await expect(action.locator("svg")).toHaveCSS("transform", "none");
  } finally {
    await page.mouse.up();
  }
});
