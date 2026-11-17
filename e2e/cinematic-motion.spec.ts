import { expect, test } from "@playwright/test";

test("Heroの登場が完了すると文字と拠点が鮮明になり、再スクロールで再生し直さない", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator(".hero-rhythm");
  await expect(scene).toHaveAttribute("data-intro-state", "entered");
  await expect(page.locator(".hero-layout")).toHaveAttribute(
    "data-motion-profile",
    "hero-focus",
  );
  const lines = page.locator(".hero-headline-line:visible");
  for (const line of await lines.all()) {
    await expect(line).toHaveCSS("filter", "none");
    await expect(line).toHaveCSS("opacity", "1");
    await expect(line).toHaveCSS("transform", "none");
  }
  await expect(scene.locator(".rhythm-shelter")).toHaveCSS("transform", "none");
  await expect
    .poll(() =>
      scene
        .locator("[data-scene-draw]")
        .evaluateAll((paths) =>
          paths.every(
            (path) =>
              path.getAttribute("style") === "" ||
              path.getAttribute("style") === null,
          ),
        ),
    )
    .toBe(true);
  await page
    .locator("#server h2")
    .evaluate((element) =>
      element.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  await expect(scene).toHaveAttribute("data-active", "false");
  await expect(scene.locator(".rhythm-daylight")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await expect(scene.locator(".rhythm-stars circle").first()).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(scene).toHaveAttribute("data-active", "true");
  await expect(scene.locator(".rhythm-shelter")).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scene.locator(".rhythm-daylight")).toHaveCSS("opacity", "0");
  await expect(scene.locator(".rhythm-moonlight")).toHaveCSS("opacity", "1");
  await expect(scene.locator(".rhythm-stars circle").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(lines.first()).toHaveCSS("filter", "none");
  expect(errors).toEqual([]);
});

test("設定行の罫線は一度だけ描画され、動きを減らす設定では静止する", async ({
  page,
}) => {
  await page.goto("/");
  const row = page.locator(".server-specification").first();
  await row.scrollIntoViewIfNeeded();
  await expect(row).toHaveAttribute("data-reveal-state", "entered");
  await expect
    .poll(() =>
      row.evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .find(
              (animation) =>
                animation instanceof CSSAnimation &&
                animation.animationName === "section-rule-draw",
            )?.startTime ?? null,
      ),
    )
    .toEqual(expect.any(Number));
  const startedAt = await row.evaluate(
    (element) =>
      element
        .getAnimations({ subtree: true })
        .find(
          (animation) =>
            animation instanceof CSSAnimation &&
            animation.animationName === "section-rule-draw",
        )?.startTime,
  );
  expect(startedAt).toBeDefined();
  await expect
    .poll(() =>
      row.evaluate((element) => getComputedStyle(element, "::after").opacity),
    )
    .toBe("0");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await row.scrollIntoViewIfNeeded();
  const replayStart = await row.evaluate(
    (element) =>
      element
        .getAnimations({ subtree: true })
        .find(
          (animation) =>
            animation instanceof CSSAnimation &&
            animation.animationName === "section-rule-draw",
        )?.startTime,
  );
  expect(replayStart).toBe(startedAt);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      row.evaluate(
        (element) => getComputedStyle(element, "::after").animationName,
      ),
    )
    .toBe("none");
  await expect(row).toHaveCSS("opacity", "1");
  await expect(row).toHaveCSS("transform", "none");
});
