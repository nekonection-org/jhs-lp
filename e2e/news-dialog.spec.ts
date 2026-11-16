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

test("returns to the list and navigates to a section from the article header", async ({
  page,
}) => {
  const trigger = page.locator("#news .news-summary").first();
  const url = page.url();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: ja.news.backToList }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog
    .locator("header")
    .getByRole("navigation")
    .getByRole("link", {
      name: "ルール",
      exact: true,
    })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#rules h2").first()).toBeFocused();
  await expect(page.locator("#rules h2").first()).toBeInViewport();
  await expect(page).toHaveURL(url);
});

test("shares the landing page header and footer, including terms and footer links", async ({
  page,
}) => {
  const typography = (root: Element) =>
    [
      ...root.querySelectorAll<HTMLElement>(
        ".text-sm, .text-xs, .interactive-button",
      ),
    ]
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => {
        const style = getComputedStyle(element);
        return [style.fontSize, style.lineHeight, style.minHeight];
      });
  const headerText = await page
    .locator("header[data-menu-open]")
    .first()
    .innerText();
  const footerText = await page.locator("footer").first().innerText();
  const headerTypography = await page
    .locator("header[data-menu-open]")
    .first()
    .evaluate(typography);
  const footerTypography = await page
    .locator("footer")
    .first()
    .evaluate(typography);
  await page.locator("#news .news-summary").first().click();
  const dialog = page.locator(".news-dialog[open]");
  await expect(dialog.locator("header[data-menu-open]")).toHaveText(
    headerText,
    { useInnerText: true },
  );
  await expect(dialog.locator("footer")).toHaveText(footerText, {
    useInnerText: true,
  });
  expect(
    await dialog.locator("header[data-menu-open]").evaluate(typography),
  ).toEqual(headerTypography);
  expect(await dialog.locator("footer").evaluate(typography)).toEqual(
    footerTypography,
  );
  await expect(dialog.locator(".header-navigation-link").first()).toHaveCSS(
    "font-size",
    "13px",
  );
  const duplicateIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicateIds).toEqual([]);
  const footer = dialog.locator("footer");
  await footer.getByRole("button", { name: ja.terms.openLabel }).click();
  const terms = page.getByRole("dialog", { name: ja.terms.dialogLabel });
  await expect(terms).toBeVisible();
  await page.keyboard.press("Tab");
  expect(
    await terms.evaluate((el) => el.contains(document.activeElement)),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(terms).not.toBeVisible();
  await expect(dialog).toBeVisible();
  await footer.getByRole("link", { name: "ルール", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#rules h2").first()).toBeFocused();
});

test("uses the shared mobile menu without closing the announcement on menu Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#news .news-summary").first().click();
  const dialog = page.locator(".news-dialog[open]");
  const header = dialog.locator("header[data-menu-open]");
  const menuButton = header.getByRole("button", {
    name: ja.navigation.openMenu,
  });
  await menuButton.click();
  const menu = header.getByRole("navigation", {
    name: ja.navigation.mobileMenuLabel,
  });
  await expect(menu.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(header).toHaveAttribute("data-menu-open", "false");
  await expect(dialog).toBeVisible();
  await expect(menuButton).toBeFocused();
  await menuButton.click();
  await header.getByRole("button", { name: ja.language.english }).click();
  await header.getByRole("button", { name: en.theme.switchToLight }).click();
  await expect(page.locator("html")).toHaveClass(/\blight\b/);
  await header
    .getByRole("navigation", { name: en.navigation.mobileMenuLabel })
    .getByRole("link", { name: /Rules/ })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("#rules h2").first()).toBeFocused();
});
