import { expect, test } from "@playwright/test";

for (const width of [360, 768, 1024, 1440]) {
  test(`${width}px: Heroの文章・ビジュアル・設定の順序と配置を保つ`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const copy = page.locator(".hero-copy");
    const visual = page.locator("a.hero-preview");
    const facts = page.locator(".hero-facts");
    await expect
      .poll(() =>
        page
          .locator(".hero-layout [data-reveal-item]")
          .evaluateAll((items) =>
            items.every((item) => getComputedStyle(item).opacity === "1"),
          ),
      )
      .toBe(true);
    await expect(visual).toHaveAttribute("href", "#server");
    const copyBounds = await copy.boundingBox();
    const visualBounds = await visual.boundingBox();
    const factsBounds = await facts.boundingBox();
    if (!copyBounds || !visualBounds || !factsBounds)
      throw new Error("Hero content must have visible bounds");
    if (width >= 1024) {
      expect(visualBounds.x).toBeGreaterThan(copyBounds.x + copyBounds.width);
    } else {
      expect(visualBounds.y).toBeGreaterThanOrEqual(
        copyBounds.y + copyBounds.height,
      );
    }
    expect(factsBounds.y).toBeGreaterThanOrEqual(
      Math.max(
        copyBounds.y + copyBounds.height,
        visualBounds.y + visualBounds.height,
      ),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await visual.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#server$/);
  });
}

test("表示中にReduced Motionへ切り替えても本文を表示し、再表示で動きを繰り返さない", async ({
  page,
}) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await page.goto("/");
  const hero = page.locator(".hero-layout");
  await expect(hero).toHaveAttribute("data-reveal-state", "entered");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const settled = () =>
    hero.locator("[data-reveal-item]").evaluateAll((items) =>
      items.every((item) => {
        const style = getComputedStyle(item);
        return style.opacity === "1" && style.transform === "none";
      }),
    );
  await expect.poll(settled).toBe(true);
  await page.locator("#server h2").scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#hero-title").scrollIntoViewIfNeeded();
  await expect.poll(settled).toBe(true);
  expect(runtimeErrors).toEqual([]);
});
