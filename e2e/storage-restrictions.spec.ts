import { expect, test } from "@playwright/test";

for (const width of [360, 1440]) {
  test.describe(`${width}px: ストレージが制限された環境`, () => {
    test.use({ viewport: { height: 900, width } });

    test("本文を表示し、言語切替とナビゲーションを利用できる", async ({
      page,
    }) => {
      const errors: Error[] = [];
      page.on("pageerror", (error) => errors.push(error));
      await page.addInitScript(() => {
        Object.defineProperty(window, "localStorage", {
          configurable: true,
          get() {
            throw new DOMException("Storage is blocked", "SecurityError");
          },
        });
      });
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", "ja");
      await expect(page.locator("#hero-title")).toBeVisible();

      const menuButton = page.locator(
        'button[aria-controls="mobile-navigation"]',
      );
      if (width === 360) {
        await menuButton.click();
      }

      await page.getByRole("button", { name: /English|英語/i }).click();
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(
        page.getByRole("button", { name: "English", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");

      await page.getByRole("button", { name: /日本語|Japanese/i }).click();
      await expect(page.locator("html")).toHaveAttribute("lang", "ja");

      if (width === 360) {
        await page.keyboard.press("Escape");
      }
      await page.locator('#top a[href="#rules"]').click();
      await expect(page).toHaveURL(/#rules$/);
      expect(errors).toEqual([]);
    });
  });
}
