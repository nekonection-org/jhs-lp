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
  test(`${viewport.width}×${viewport.height}: 価値を伝える見出しと参加導線が収まり、レイド時間を確認できる`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".hero-layout")).toHaveAttribute(
      "data-reveal-state",
      "entered",
    );
    await expect
      .poll(() =>
        page
          .locator(".hero-layout [data-reveal-item]")
          .evaluateAll((items) =>
            items.every((item) => getComputedStyle(item).opacity === "1"),
          ),
      )
      .toBe(true);
    const headline = await page.locator("#hero-title").boundingBox();
    const intro = await page.locator(".hero-introduction").boundingBox();
    const actions = await page.locator("#hero-actions").boundingBox();
    const media = await page.locator("#server .server-planner").boundingBox();
    if (!headline || !intro || !actions || !media)
      throw new Error(
        "Brand, introduction, actions and server planner must be rendered",
      );
    for (const bounds of [headline, intro, actions, media]) {
      expect(bounds.x).toBeGreaterThanOrEqual(20);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width - 19);
    }
    expect(actions.y + actions.height).toBeLessThanOrEqual(viewport.height);
    expect(intro.y).toBeGreaterThanOrEqual(headline.y + headline.height);
    expect(media.y).toBeGreaterThanOrEqual(intro.y + intro.height);
    await expect(page.locator("#top .server-planner")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    const explore = page.locator("a.hero-explore");
    if (viewport.width === 1440) {
      await explore.click();
    } else {
      await explore.focus();
      await page.keyboard.press("Enter");
    }
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

test("レイド時間の背景画像を使わず、紹介・参加・ルールへの導線を表示する", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-cover-image, .hero-scrim")).toHaveCount(0);
  await expect(page.locator("#server .server-planner")).toHaveCSS(
    "background-image",
    "none",
  );
  await expect(
    page.getByRole("heading", { level: 1, name: ja.hero.headline.join(" ") }),
  ).toBeVisible();
  await expect(
    page.locator("#hero-actions").getByRole("link", { name: /Discordに参加/ }),
  ).toHaveAttribute("href", e2eEnvironment.discordUrl);
  await expect(page.locator("#server .raid-schedule")).toHaveCount(0);
  await page.locator('#hero-actions a[href="#rules"]').click();
  await expect(page).toHaveURL(/#rules$/);
});

test("FAQの見出しと質問を読みやすく表示し、重複した参加ボタンを置かない", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator("#faq").scrollIntoViewIfNeeded();
    await expect(page.locator("#faq h2")).toBeVisible();
    await expect(page.locator(".faq-heading .interactive-button")).toHaveCount(
      0,
    );
    const firstQuestion = page.locator("#faq details summary").first();
    if (await firstQuestion.count()) {
      const size = await firstQuestion.evaluate((el) =>
        parseFloat(getComputedStyle(el).fontSize),
      );
      expect(size).toBeGreaterThanOrEqual(18);
      await firstQuestion.focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#faq details").first()).toHaveAttribute(
        "open",
        "",
      );
    }
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
        return (
          style.opacity === "1" && new DOMMatrix(style.transform).isIdentity
        );
      }),
    );
  await expect.poll(settled).toBe(true);
  await page.locator("#server h2").scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#hero-title").scrollIntoViewIfNeeded();
  await expect.poll(settled).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test("進捗ラインを設けず、スクロール先の情報と日時操作を表示する", async ({
  page,
}) => {
  await page.goto("/");
  const progress = page.locator(".scroll-progress");
  await expect(progress).toHaveCount(0);
  await page.locator("#server h2").scrollIntoViewIfNeeded();
  await expect(page.locator(".server-introduction")).toHaveAttribute(
    "data-reveal-state",
    "entered",
  );
  await page.locator(".server-planner").scrollIntoViewIfNeeded();
  await expect(page.locator(".server-planner-reveal")).toHaveAttribute(
    "data-reveal-state",
    "entered",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(progress).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator(".server-planner [data-reveal-item]")
        .evaluateAll((items) =>
          items.every(
            (item) =>
              getComputedStyle(item).opacity === "1" &&
              new DOMMatrix(getComputedStyle(item).transform).isIdentity,
          ),
        ),
    )
    .toBe(true);
});

test("補足情報は初期状態で閉じ、キーボードで開閉でき、英語でも内容を読める", async ({
  page,
}) => {
  await page.goto("/");
  for (const selector of [
    ".rules-additional",
    ".vip-details",
    ".moderator-details",
  ]) {
    const details = page.locator(selector);
    const summary = details.locator(":scope > summary");
    await expect(details).not.toHaveAttribute("open", "");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(summary).toBeFocused();
  }
  await page.getByRole("button", { name: /English|英語/, exact: true }).click();
  await expect(
    page
      .locator(".connection-guide")
      .getByRole("heading", { level: 2, name: "Connect to the Server" }),
  ).toBeVisible();
  await expect(page.locator(".connection-command")).toBeVisible();
});

test("通常のスクロールにHeroが反応し、項目は見えたときに表示、Reduced Motionで停止する", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-layout")).toHaveAttribute(
    "data-reveal-state",
    "entered",
  );
  const scene = page.locator(".hero-scroll-scene");
  await page.evaluate(() => window.scrollTo({ top: 240, behavior: "instant" }));
  await expect
    .poll(() =>
      scene.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42),
    )
    .toBeLessThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(240);
  await expect
    .poll(() =>
      scene.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42),
    )
    .toBeGreaterThanOrEqual(-20);
  const setting = page.locator(".server-specification").last();
  await expect(setting).not.toHaveAttribute("data-reveal-state", "entered");
  await setting.scrollIntoViewIfNeeded();
  await expect(setting).toHaveAttribute("data-reveal-state", "entered");
  await expect(setting).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scene).toHaveCSS("transform", "none");
  await expect(setting).toHaveCSS("transform", "none");
});
