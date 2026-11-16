import { expect, test } from "@playwright/test";
import { en, ja } from "../src/content";
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
    expect(
      await page
        .locator("#hero-title")
        .evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    ).toBeLessThanOrEqual(52);
    const sectionTitles = page.locator("main .section-title");
    expect(
      await sectionTitles.evaluateAll((headings) =>
        headings.every(
          (heading) => parseFloat(getComputedStyle(heading).fontSize) <= 30,
        ),
      ),
    ).toBe(true);
    await expect(sectionTitles.locator(".section-title-icon")).toHaveCount(6);
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
    await expect(explore).toHaveAccessibleName(ja.server.title);
    await expect(explore.locator(".hero-scroll-cue")).toBeVisible();
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

test("追加ルールと募集条件は初期状態で閉じ、キーボードで開閉でき、英語でも内容を読める", async ({
  page,
}) => {
  await page.goto("/");
  for (const selector of [".rules-additional", ".moderator-details"]) {
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

test("接続案内の下に矢印だけのスクロール導線を表示し、Reduced Motionでは静止する", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.locator("a.hero-explore");
  const cue = link.locator(".hero-scroll-cue");
  await expect(link).toHaveAccessibleName(ja.server.title);
  await expect(link.locator(".sr-only")).toHaveCount(1);
  await link.scrollIntoViewIfNeeded();
  const firstFrame = await cue.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await expect
    .poll(() => cue.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(firstFrame);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(cue).toHaveCSS("transform", "none");
  await expect(cue).toHaveCSS("opacity", "1");
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#server$/);
});

test("参加前の注意書きとVIP詳細は、日英・PC・モバイルで展開せずに読める", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const locale of ["ja", "en"] as const) {
    const content = locale === "ja" ? ja : en;
    await page.evaluate(
      (value) => localStorage.setItem("jhs-locale", value),
      locale,
    );
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const notice = page.locator("#rules .rules-introduction .rules-notice");
      await notice.scrollIntoViewIfNeeded();
      await expect(
        notice.getByRole("heading", { name: content.rules.noticeTitle }),
      ).toBeVisible();
      await expect(
        notice.getByText(content.rules.notice, { exact: true }),
      ).toBeVisible();
      await expect(page.locator(".rules-additional")).not.toHaveAttribute(
        "open",
        "",
      );
      await expect(page.locator(".rules-additional .rules-notice")).toHaveCount(
        0,
      );
      await expect(page.locator("#vip details, #vip summary")).toHaveCount(0);
      for (const selector of [".vip-plan", ".vip-benefits"]) {
        const block = page.locator(`#vip ${selector}`);
        await block.scrollIntoViewIfNeeded();
        await expect(block).toBeVisible();
      }
      await expect(page.locator("#vip .vip-plan dl")).toBeVisible();
      const layout = await page.locator("#vip").evaluate((section) => {
        const measure = (selector: string) => {
          const element = section.querySelector(selector);
          if (!element) throw new Error(`${selector} must be rendered`);
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, width, height };
        };
        return {
          heading: measure(".vip-introduction"),
          plan: measure(".vip-plan"),
          benefits: measure(".vip-benefits"),
        };
      });
      expect(layout.plan.x).toBeCloseTo(layout.heading.x, 0);
      expect(layout.plan.y).toBeGreaterThan(
        layout.heading.y + layout.heading.height,
      );
      if (width >= 1024) {
        expect(layout.benefits.y).toBeCloseTo(layout.plan.y, 0);
        expect(layout.benefits.x).toBeGreaterThan(
          layout.plan.x + layout.plan.width,
        );
        expect(layout.benefits.width).toBeCloseTo(layout.plan.width, 0);
      } else {
        expect(layout.benefits.x).toBeCloseTo(layout.plan.x, 0);
        expect(layout.benefits.y).toBeGreaterThan(
          layout.plan.y + layout.plan.height,
        );
      }
    }
  }
});

test("Heroと背景はスクロールでずれず、項目は一度だけ表示される", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-layout")).toHaveAttribute(
    "data-reveal-state",
    "entered",
  );
  const scene = page.locator(".hero-scroll-scene");
  await page.evaluate(() => window.scrollTo({ top: 240, behavior: "instant" }));
  await expect(scene).toHaveCSS("transform", "none");
  await expect(page.locator(".rhythm-landscape")).toHaveCSS(
    "transform",
    "none",
  );
  expect(await page.evaluate(() => window.scrollY)).toBe(240);
  const setting = page.locator(".server-specification").last();
  await expect(setting).not.toHaveAttribute("data-reveal-state", "entered");
  await setting.scrollIntoViewIfNeeded();
  await expect(setting).toHaveAttribute("data-reveal-state", "entered");
  await expect(setting).toHaveCSS("opacity", "1");
  await expect(setting).toHaveCSS("transform", "none");
  await page.locator("#hero-title").scrollIntoViewIfNeeded();
  await setting.scrollIntoViewIfNeeded();
  await expect(setting).toHaveCSS("opacity", "1");
  await expect(setting).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scene).toHaveCSS("transform", "none");
  await expect(setting).toHaveCSS("transform", "none");
});

test("背景は夕暮れから月夜へ移り、停止ボタンを表示せず画面外とReduced Motionに対応する", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const art = page.locator(".hero-rhythm");
  const sun = art.locator(".rhythm-sun");
  const sunOrbit = art.locator(".rhythm-sun-orbit");
  const moonOrbit = art.locator(".rhythm-moon-orbit");
  const moon = art.locator(".rhythm-moon");
  const windows = art.locator(".rhythm-window");
  const stars = art.locator(".rhythm-stars");
  await expect(page.locator(".hero-motion-control")).toHaveCount(0);
  await expect(art.locator(".rhythm-sun-ring, .rhythm-moon-halo")).toHaveCount(
    0,
  );
  await expect(art).toHaveAttribute("aria-hidden", "true");
  await expect(art.locator("svg")).toBeVisible();
  await expect(page.locator(".hero-stage img")).toHaveCount(0);
  await expect(art).toHaveAttribute("data-active", "true");
  await expect(sunOrbit).toHaveCSS("animation-play-state", "running");
  await expect(sunOrbit).toHaveCSS("animation-duration", "24s");
  const firstFrame = await sunOrbit.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await expect
    .poll(() => sunOrbit.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(firstFrame);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  // Inspect actual SVG positions throughout a full turn, including the loop boundary.
  const samples = await art.evaluate((element) => {
    const world = element.querySelector<SVGGElement>(".rhythm-world");
    const rootMatrix = world?.getScreenCTM();
    if (!rootMatrix) throw new Error("The sky must be rendered");
    const toViewBox = rootMatrix.inverse();
    const position = (selector: string) => {
      const disc = element.querySelector<SVGCircleElement>(selector);
      const screenMatrix = disc?.getScreenCTM();
      if (!disc || !screenMatrix)
        throw new Error(`${selector} must be rendered`);
      const matrix = toViewBox.multiply(screenMatrix);
      const point = new DOMPoint(
        disc.cx.baseVal.value,
        disc.cy.baseVal.value,
      ).matrixTransform(matrix);
      return { x: point.x, y: point.y, angle: Math.atan2(matrix.b, matrix.a) };
    };
    return [
      0, 3_000, 6_000, 9_000, 12_000, 15_000, 18_000, 21_000, 23_999, 24_000,
    ].map((time) => {
      for (const layer of element.querySelectorAll(".rhythm-cycle")) {
        for (const animation of layer.getAnimations())
          animation.currentTime = time;
      }
      return {
        sun: position(".rhythm-sun-disc"),
        moon: position(".rhythm-moon-disc"),
      };
    });
  });
  for (const { sun: sunPosition, moon: moonPosition } of samples) {
    for (const body of [sunPosition, moonPosition]) {
      expect(Math.hypot(body.x - 350, body.y - 420)).toBeCloseTo(175, 1);
      expect(body.angle).toBeCloseTo(0, 3);
    }
    expect(sunPosition.x + moonPosition.x).toBeCloseTo(700, 1);
    expect(sunPosition.y + moonPosition.y).toBeCloseTo(840, 1);
  }
  const sampleAt = (index: number) => {
    const sample = samples[index];
    if (!sample) throw new Error(`Missing orbit sample ${index}`);
    return sample;
  };
  const start = sampleAt(0);
  const settingHorizon = sampleAt(2);
  const night = sampleAt(3);
  const risingHorizon = sampleAt(6);
  const cycleEnd = sampleAt(8);
  const nextCycle = sampleAt(9);
  expect(start.sun.y).toBeLessThan(420);
  expect(start.moon.y).toBeGreaterThan(420);
  expect(settingHorizon.sun.x).toBeGreaterThan(350);
  expect(night.sun.y).toBeGreaterThan(420);
  expect(night.moon.y).toBeLessThan(420);
  expect(risingHorizon.sun.x).toBeLessThan(350);
  expect(nextCycle.sun.x).toBeCloseTo(start.sun.x, 1);
  expect(nextCycle.sun.y).toBeCloseTo(start.sun.y, 1);
  expect(cycleEnd.sun.x).toBeCloseTo(nextCycle.sun.x, 0);
  expect(cycleEnd.sun.y).toBeCloseTo(nextCycle.sun.y, 0);
  await art.locator(".rhythm-cycle").evaluateAll((layers) => {
    for (const layer of layers) {
      for (const animation of layer.getAnimations())
        animation.currentTime = 12_000;
    }
  });
  await expect(stars).toHaveCSS("opacity", "1");
  await expect(windows).toHaveCSS("opacity", "1");
  await expect(sun).toHaveCSS("opacity", "1");
  await expect(moon).toHaveCSS("opacity", "1");
  await page
    .locator("#server h2")
    .evaluate((el) =>
      el.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  await expect(art).toHaveAttribute("data-active", "false");
  await expect(sunOrbit).toHaveCSS("animation-play-state", "paused");
  await expect(moonOrbit).toHaveCSS("animation-play-state", "paused");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(art).toHaveAttribute("data-active", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(sunOrbit).toHaveCSS("animation-name", "none");
  await expect(moonOrbit).toHaveCSS("animation-name", "none");
  await expect(sun).toHaveCSS("animation-name", "none");
  await expect(sun).toHaveCSS("transform", "none");
  await expect(art.locator(".rhythm-landscape")).toHaveCSS("transform", "none");
  await expect(moon).toHaveCSS("animation-name", "none");
  await expect(moon).toHaveCSS("transform", "none");
  await expect(moon).toHaveCSS("opacity", "1");
  await expect(sun).toHaveCSS("opacity", "0");
  await expect(art.locator("svg")).toBeVisible();
});

test("日英・各画面幅で背景の右端が区切り線と揃い、拠点が画面内に収まる", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const locale of ["ja", "en"]) {
    await page.evaluate(
      (value) => localStorage.setItem("jhs-locale", value),
      locale,
    );
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    for (const width of [
      360, 375, 390, 640, 767, 768, 1024, 1280, 1440, 1920,
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(async () => {
        // Wait for SVG geometry to settle after switching viewport size or language.
        const { stage, background, divider, shelter, overflow } =
          await page.evaluate(() => {
            const measure = (selector: string) => {
              const element = document.querySelector(selector);
              if (!element) throw new Error(`${selector} must be rendered`);
              const { x, y, width, height } = element.getBoundingClientRect();
              return { x, y, width, height };
            };
            return {
              stage: measure(".hero-stage"),
              background: measure(".hero-rhythm"),
              divider: measure(".hero-utilities"),
              shelter: measure(".rhythm-shelter"),
              overflow: document.documentElement.scrollWidth - innerWidth,
            };
          });
        expect(stage.x).toBe(0);
        expect(stage.width).toBe(width);
        expect(background.x).toBe(stage.x);
        expect(background.y).toBe(stage.y);
        expect(background.height).toBe(stage.height);
        expect(background.x + background.width).toBeCloseTo(
          divider.x + divider.width,
          1,
        );
        await expect(
          page.locator(".rhythm-frame, .rhythm-orbit, .hero-rhythm clipPath"),
        ).toHaveCount(0);
        expect(shelter.x).toBeGreaterThanOrEqual(stage.x - 1);
        expect(shelter.y).toBeGreaterThanOrEqual(stage.y - 1);
        expect(shelter.x + shelter.width).toBeLessThanOrEqual(
          background.x + background.width + 1,
        );
        expect(shelter.y + shelter.height).toBeLessThanOrEqual(
          stage.y + stage.height + 1,
        );
        expect(overflow).toBeLessThanOrEqual(1);
      }).toPass({ timeout: 5_000 });
    }
  }
});

test("サーバー情報の紹介文が見出しの直下に揃い、日英と各画面幅で収まる", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const locale of ["ja", "en"]) {
    await page.evaluate(
      (language) => localStorage.setItem("jhs-locale", language),
      locale,
    );
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      const title = await page.locator("#server h2").boundingBox();
      const description = await page
        .locator(".server-introduction .section-description")
        .boundingBox();
      if (!title || !description)
        throw new Error("Server introduction must be rendered");
      expect(description.x).toBe(title.x);
      expect(description.y).toBeGreaterThanOrEqual(title.y + title.height + 16);
      expect(description.x + description.width).toBeLessThanOrEqual(width - 19);
      await expect(
        page.locator(
          `.server-introduction .section-description [data-locale-content=${locale}]`,
        ),
      ).toBeVisible();
    }
  }
});

test("情報は小さな上下移動とフェードで現れ、横移動や切り抜きで欠けない", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const setting = page.locator(".server-specification").first();
  await expect(setting).not.toHaveAttribute("data-reveal-state", "entered");
  const frames = await setting.evaluate(async (element) => {
    element.scrollIntoView({ block: "center", behavior: "instant" });
    const frames: {
      x: number;
      y: number;
      opacity: number;
      clip: string;
      scale: number;
    }[] = [];
    const start = performance.now();
    await new Promise<void>((resolve) => {
      function sample() {
        const style = getComputedStyle(element);
        const matrix = new DOMMatrix(style.transform);
        frames.push({
          x: matrix.m41,
          y: matrix.m42,
          opacity: Number(style.opacity),
          clip: style.clipPath,
          scale: matrix.m11,
        });
        if (performance.now() - start < 700) requestAnimationFrame(sample);
        else resolve();
      }
      requestAnimationFrame(sample);
    });
    return frames;
  });
  expect(frames.some((frame) => frame.y > 0 && frame.opacity < 1)).toBe(true);
  for (const frame of frames) {
    expect(Math.abs(frame.x)).toBeLessThan(0.01);
    expect(frame.y).toBeGreaterThanOrEqual(-0.01);
    expect(frame.y).toBeLessThanOrEqual(12.01);
    expect(frame.scale).toBeCloseTo(1, 3);
    expect(frame.clip).toBe("none");
  }
  await expect(setting).toHaveCSS("transform", "none");
  await expect(setting).toHaveCSS("opacity", "1");
  await expect(
    page.locator('[data-motion-profile="wipe"], [data-motion-profile="split"]'),
  ).toHaveCount(0);
});
