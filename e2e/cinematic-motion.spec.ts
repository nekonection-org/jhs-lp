import { expect, test } from "@playwright/test";

test("Heroの文字は鮮明になり、風景の描画・追加の光演出を表示しない", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator(".hero-rhythm");
  await expect(scene).toHaveAttribute("data-active", "true");
  await expect(
    scene.locator(
      "[data-scene-draw], .rhythm-daylight, .rhythm-moonlight, .rhythm-roof-light",
    ),
  ).toHaveCount(0);
  await expect(page.locator(".hero-layout")).toHaveAttribute(
    "data-motion-profile",
    "hero-focus",
  );
  const lines = page.locator(".hero-headline-line:visible");
  for (const line of await lines.all()) {
    // Motion can retain an explicit zero-blur end frame; both values are sharp.
    await expect(line).toHaveCSS("filter", /^(none|blur\(0px\))$/);
    await expect(line).toHaveCSS("opacity", "1");
    await expect(line).toHaveCSS("transform", "none");
  }
  await expect(scene.locator(".rhythm-shelter")).toHaveCSS("transform", "none");
  await page
    .locator("#server h2")
    .evaluate((element) =>
      element.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  await expect(scene).toHaveAttribute("data-active", "false");
  await expect(scene.locator(".rhythm-sun-orbit")).toHaveCSS(
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
  await expect(scene.locator(".rhythm-sun")).toHaveCSS("opacity", "0");
  await expect(scene.locator(".rhythm-moon")).toHaveCSS("opacity", "1");
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
