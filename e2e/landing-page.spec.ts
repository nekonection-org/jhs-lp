import { expect, test } from "@playwright/test";

import { en } from "../src/content";
import { e2eEnvironment } from "./environment";

const sectionIds = [
  "top",
  "server",
  "rules",
  "vip",
  "faq",
  "moderator",
  "news",
] as const;
const requiredViewportWidths = [360, 375, 390, 768, 1024, 1280, 1440] as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("トップページに必須セクションと単一の見出しが表示される", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { level: 1, name: "Japan Hideaway Server" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator('header img[src*="icon.png"]')).toBeVisible();
  await expect(page.locator('#top img[src*="main-image.png"]')).toHaveCount(1);
  await expect(page.locator('#top img[src*="icon.png"]')).toHaveCount(1);
  await expect(page.getByText("確認済み", { exact: true })).toHaveCount(0);

  for (const id of sectionIds) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("初期テーマはダークで、変更内容が再読み込み後も保持される", async ({
  page,
}) => {
  const root = page.locator("html");
  await expect(root).toHaveClass(/\bdark\b/);

  await page
    .getByRole("button", { name: /ライト(?:テーマ|モード)に切り替える/i })
    .click();
  await expect(root).toHaveClass(/\blight\b/);

  await page.reload();
  await expect(root).toHaveClass(/\blight\b/);
});

test("初期言語は日本語で、英語の選択が再読み込み後も保持される", async ({
  page,
}) => {
  const root = page.locator("html");
  await expect(root).toHaveAttribute("lang", "ja");

  await page.getByRole("button", { name: /English|英語/i }).click();
  await expect(root).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(en.metadata.title);
  await expect(
    page.getByRole("heading", { level: 1, name: "Japan Hideaway Server" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Server Information" }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("jhs-locale")))
    .toBe("en");

  await page.reload();
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("jhs-locale")))
    .toBe("en");
  await expect(root).toHaveAttribute("lang", "en");
});

test("モバイルメニュー表示中にデスクトップ幅へ変更すると安全に閉じる", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1024 });
  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.setViewportSize({ height: 900, width: 1280 });
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("ナビゲーションは JavaScript に依存しないアンカーリンクを持つ", async ({
  page,
}) => {
  for (const id of sectionIds.slice(1)) {
    const link = page.locator(`a[href="#${id}"]`).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", `#${id}`);
  }

  await page.locator('a[href="#rules"]').first().click();
  await expect(page).toHaveURL(/#rules$/);
  await expect(page.locator("#rules")).toBeVisible();
});

test("FAQ はネイティブ details 要素で開閉できる", async ({ page }) => {
  const firstFaq = page.locator("#faq details").first();
  const summary = firstFaq.locator("summary");

  await expect(firstFaq).not.toHaveAttribute("open", "");
  await summary.click();
  await expect(firstFaq).toHaveAttribute("open", "");
  await summary.click();
  await expect(firstFaq).not.toHaveAttribute("open", "");
});

test("利用規約はモーダルで表示され、Escキーで閉じられる", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "利用規約を表示" });
  await trigger.click();

  const dialog = page.getByRole("dialog", {
    name: "Japan Hideaway Server 利用規約",
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "第1条（適用範囲）" }),
  ).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.keyboard.press("Escape");

  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("Discord の外部リンクは安全な属性と設定 URL を使う", async ({ page }) => {
  const links = page.locator(`a[href="${e2eEnvironment.discordUrl}"]`);

  await expect(links.first()).toBeVisible();
  await expect.poll(() => links.count()).toBeGreaterThanOrEqual(2);

  const linkCount = await links.count();
  for (let index = 0; index < linkCount; index += 1) {
    const link = links.nth(index);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
    await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
  }
});

test("HeroからF1接続コマンドとSteam起動リンクを利用できる", async ({
  page,
}) => {
  const command = `client.connect ${e2eEnvironment.rustServerAddress}`;
  const steamUrl = `steam://run/252490//+connect%20${e2eEnvironment.rustServerAddress}`;

  await expect(page.locator("#top code")).toHaveText(command);
  await expect(
    page.getByRole("button", { name: "コマンドをコピー" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Steamを起動してJapan Hideaway Serverへ接続する",
    }),
  ).toHaveAttribute("href", steamUrl);
});

test("指定された全幅で主要コンテンツを表示し、横スクロールを発生させない", async ({
  page,
}) => {
  for (const width of requiredViewportWidths) {
    await page.setViewportSize({ height: 900, width });
    await page.goto(`/?viewport=${width}`);

    await expect(
      page.getByRole("heading", { level: 1, name: "Japan Hideaway Server" }),
    ).toBeVisible();
    await expect(
      page.locator(`#top a[href="${e2eEnvironment.discordUrl}"]`).first(),
    ).toBeVisible();

    const documentWidth = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(
      documentWidth.scrollWidth,
      `${width}px viewport must not overflow horizontally`,
    ).toBeLessThanOrEqual(documentWidth.innerWidth + 1);
  }
});

test.describe("360px のモバイル表示", () => {
  test.use({ viewport: { height: 800, width: 360 } });

  test("メニューをキーボードで開閉でき、横スクロールが発生しない", async ({
    page,
  }) => {
    const menuButton = page.getByRole("button", { name: /メニュー/i });

    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await menuButton.focus();
    await page.keyboard.press("Enter");
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.locator('#mobile-navigation a[href="#rules"]'),
    ).toBeVisible();

    const openMenuOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(openMenuOverflow).toBeLessThanOrEqual(1);

    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menuButton).toBeFocused();

    const closedMenuOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(closedMenuOverflow).toBeLessThanOrEqual(1);
  });
});
