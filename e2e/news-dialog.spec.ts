import { expect, test } from "@playwright/test";

import { en, ja } from "../src/content";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  test.skip(
    !(await page.locator("#news .news-summary").count()),
    "Requires a published announcement.",
  );
});

test("opens repeatedly without an article request, navigation, or browser error", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  const articleRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/news/"))
      articleRequests.push(request.url());
  });
  const trigger = page.locator("#news .news-summary").first();
  await trigger.scrollIntoViewIfNeeded();
  const url = page.url();
  const title = await page.title();
  await context.setOffline(true);
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog.locator(".news-article-body")).toBeVisible();
      await expect(page).toHaveURL(url);
      await expect(page).toHaveTitle(title);
      await dialog.getByRole("button", { name: ja.news.closeLabel }).click();
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
    expect(articleRequests).toEqual([]);
    expect(errors).toEqual([]);
  } finally {
    await context.setOffline(false);
  }
});

for (const viewport of [
  { width: 360, height: 400 },
  { width: 1440, height: 900 },
]) {
  test(`${viewport.width}px: fills the viewport and scrolls the article independently`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const trigger = page.locator("#news .news-summary").first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(
      await dialog.evaluate(
        (element) => getComputedStyle(element, "::backdrop").animationName,
      ),
    ).toBe("none");
    const bounds = await dialog.boundingBox();
    if (!bounds) throw new Error("The announcement must fill the viewport");
    expect(bounds.x).toBe(0);
    expect(bounds.y).toBe(0);
    expect(bounds.width).toBe(viewport.width);
    expect(bounds.height).toBe(viewport.height);
    const panel = await dialog.locator(".news-dialog-panel").boundingBox();
    expect(panel?.width).toBe(viewport.width);
    expect(panel?.height).toBe(viewport.height);
    const pageScroll = await page.evaluate(() => scrollY);
    if (viewport.height === 400) {
      const scroll = dialog.locator(".news-dialog-scroll");
      expect(
        await scroll.evaluate(
          (element) => element.scrollHeight > element.clientHeight,
        ),
      ).toBe(true);
      await scroll.evaluate((element) => {
        element.scrollTop = element.scrollHeight;
      });
      expect(
        await scroll.evaluate((element) => element.scrollTop),
      ).toBeGreaterThan(0);
      expect(await page.evaluate(() => scrollY)).toBe(pageScroll);
    }
    await expect(
      dialog.getByRole("button", { name: ja.news.closeLabel }),
    ).toBeInViewport();
    expect(
      await dialog.evaluate(
        (element) => element.scrollWidth - element.clientWidth,
      ),
    ).toBe(0);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
}

test("keeps keyboard focus inside and supports language and theme controls", async ({
  page,
}) => {
  const trigger = page.locator("#news .news-summary").first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const url = page.url();
  for (let press = 0; press < 8; press++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await dialog.getByRole("button", { name: ja.language.english }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(en.metadata.title);
  await dialog.getByRole("button", { name: en.theme.switchToLight }).click();
  await expect(page.locator("html")).toHaveClass(/\blight\b/);
  await expect(dialog.locator(".news-article-body")).toBeVisible();
  await expect(page).toHaveURL(url);
  await dialog.getByRole("button", { name: en.news.closeLabel }).click();
  await expect(trigger).toBeFocused();
});
