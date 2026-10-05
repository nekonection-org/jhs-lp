import { expect, test, type Page } from "@playwright/test";

const sectionIds = [
  "top",
  "server",
  "rules",
  "vip",
  "faq",
  "moderator",
  "news",
] as const;

async function expectReadableContent(page: Page) {
  for (const id of sectionIds) {
    const heading = page.locator(`#${id}`).getByRole("heading").first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();

    // Playwright's visibility check does not consider opacity.
    await expect
      .poll(() =>
        heading.evaluate((element) => {
          let opacity = 1;
          for (
            let ancestor: Element | null = element;
            ancestor;
            ancestor = ancestor.parentElement
          ) {
            opacity *= Number(getComputedStyle(ancestor).opacity);
          }
          return opacity;
        }),
      )
      .toBe(1);
  }

  await expect(page.locator('#top a[href="#rules"]')).toBeVisible();
}

for (const width of [360, 1440]) {
  test.describe(`${width}px: JavaScriptを実行できない環境`, () => {
    test.use({ javaScriptEnabled: false, viewport: { height: 900, width } });

    test("本文とアンカーリンクが初期HTMLだけで表示される", async ({ page }) => {
      await page.goto("/");
      await expectReadableContent(page);
      await page.locator('#top a[href="#rules"]').click();
      await expect(page).toHaveURL(/#rules$/);
    });
  });
}

test("JavaScriptの配信失敗時も本文が表示される", async ({ page }) => {
  await page.route("**/_next/**/*.js*", (route) => route.abort());
  await page.goto("/");
  await expectReadableContent(page);
});

test("IntersectionObserverが利用できなくても本文が表示される", async ({
  page,
}) => {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  await page.addInitScript(() => {
    Reflect.deleteProperty(window, "IntersectionObserver");
  });
  await page.goto("/");
  await expectReadableContent(page);
  await page.getByRole("button", { name: /English|英語/i }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(errors).toEqual([]);
});

test("動きを減らす設定でも本文が表示される", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (/hydration|hydrated/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expectReadableContent(page);
  await page.getByRole("button", { name: /English|英語/i }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(hydrationErrors).toEqual([]);
});
