import { expect, test } from "@playwright/test";
import { ja } from "../src/content";
import { e2eEnvironment } from "./environment";

for (const viewport of [
  { width: 360, height: 640 },
  { width: 360, height: 900 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
]) {
  test(`${viewport.width}×${viewport.height}: カバー画像と文章・操作領域が収まり、設定はカバーの後に並ぶ`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        page
          .locator(".hero-layout [data-reveal-item]")
          .evaluateAll((items) =>
            items.every((item) => getComputedStyle(item).opacity === "1"),
          ),
      )
      .toBe(true);
    const cover = await page.locator(".hero-cover").boundingBox();
    const media = await page.locator(".hero-media").boundingBox();
    const copy = await page.locator(".hero-copy").boundingBox();
    const intro = await page.locator(".hero-introduction").boundingBox();
    const actions = await page.locator("#hero-actions").boundingBox();
    const facts = await page.locator(".hero-facts").boundingBox();
    if (!cover || !media || !copy || !intro || !actions || !facts)
      throw new Error(
        "The cover and all essential content must have visible bounds",
      );
    expect(media.width).toBeCloseTo(viewport.width, 0);
    expect(media.height).toBeCloseTo(cover.height, 0);
    for (const bounds of [copy, intro, actions]) {
      expect(bounds.x).toBeGreaterThanOrEqual(cover.x);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(
        cover.x + cover.width + 1,
      );
      expect(bounds.y).toBeGreaterThanOrEqual(cover.y);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(
        cover.y + cover.height + 1,
      );
    }
    if (viewport.width >= 1024)
      expect(intro.x).toBeGreaterThan(copy.x + copy.width);
    else expect(intro.y).toBeGreaterThanOrEqual(copy.y + copy.height);
    expect(facts.y).toBeGreaterThanOrEqual(cover.y + cover.height);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    const explore = page.locator("a.hero-explore");
    await explore.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#server$/);
    await expect
      .poll(() =>
        page
          .locator("#server h2")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeGreaterThanOrEqual(76);
  });
}

test("背景画像の読み込みに失敗しても紹介文と参加・ルールの導線を利用できる", async ({
  page,
}) => {
  await page.route("**/_next/image*", (route) =>
    route.request().url().includes("main-image")
      ? route.abort()
      : route.continue(),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: ja.hero.headline.join(" ") }),
  ).toBeVisible();
  await expect(
    page.locator("#hero-actions").getByRole("link", { name: /Discordに参加/ }),
  ).toHaveAttribute("href", e2eEnvironment.discordUrl);
  await page.locator('#hero-actions a[href="#rules"]').click();
  await expect(page).toHaveURL(/#rules$/);
});

test("FAQはデスクトップでは説明と回答を分け、モバイルでは読み順に並ぶ", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator("#faq").scrollIntoViewIfNeeded();
    const heading = await page.locator(".faq-heading").boundingBox();
    const answers = await page.locator(".faq-answers").boundingBox();
    if (!heading || !answers)
      throw new Error("FAQ introduction and answers must be rendered");
    if (width >= 1024)
      expect(answers.x).toBeGreaterThan(heading.x + heading.width);
    else expect(answers.y).toBeGreaterThanOrEqual(heading.y + heading.height);
    await expect(
      page.locator(".faq-heading").getByRole("link", { name: /Discordに参加/ }),
    ).toHaveAttribute("href", e2eEnvironment.discordUrl);
  }
});

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
  await expect(page.locator(".hero-cover-image")).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.locator("#server h2").scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#hero-title").scrollIntoViewIfNeeded();
  await expect.poll(settled).toBe(true);
  expect(runtimeErrors).toEqual([]);
});
