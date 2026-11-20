import { expect, test } from "@playwright/test";

import { en, ja } from "../src/content";
import { e2eEnvironment } from "./environment";

const sectionIds = [
  "top",
  "server",
  "rules",
  "vip",
  "faq",
  "moderator",
  "news",
] as const;
const requiredViewportWidths = [360, 375, 390, 768, 1024, 1280, 1440] as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("トップページに必須セクションと単一の見出しが表示される", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { level: 1, name: ja.hero.headline.join(" ") }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const headerIcon = page.locator('header img[src*="icon.png"]');
  await expect(headerIcon).toBeVisible();
  await expect
    .poll(() =>
      headerIcon.evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(page.locator('#top img[src*="main-image.png"]')).toHaveCount(0);
  await expect(page.locator(".connection-guide h2")).toBeVisible();
  await expect(page.locator("#top details, #server details")).toHaveCount(0);
  await expect(page.getByText("確認済み", { exact: true })).toHaveCount(0);

  for (const id of sectionIds) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("初期テーマはダークで、変更内容が再読み込み後も保持される", async ({
  page,
}) => {
  const root = page.locator("html");
  await expect(root).toHaveClass(/\bdark\b/);

  await page
    .getByRole("button", { name: /ライト(?:テーマ|モード)に切り替える/i })
    .click();
  await expect(root).toHaveClass(/\blight\b/);

  await page.reload();
  await expect(root).toHaveClass(/\blight\b/);
});

test("初期言語は日本語で、英語の選択が再読み込み後も保持される", async ({
  page,
}) => {
  const root = page.locator("html");
  await expect(root).toHaveAttribute("lang", "ja");

  await page.getByRole("button", { name: /English|英語/i }).click();
  await expect(root).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(en.metadata.title);
  await expect(
    page.getByRole("heading", { level: 1, name: en.hero.headline.join(" ") }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Server Information" }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("jhs-locale")))
    .toBe("en");

  await page.reload();
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("jhs-locale")))
    .toBe("en");
  await expect(root).toHaveAttribute("lang", "en");
});

test("モバイルメニュー表示中にデスクトップ幅へ変更すると安全に閉じる", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1024 });
  const menuButton = page.locator('button[aria-controls="mobile-navigation"]');

  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.setViewportSize({ height: 900, width: 1280 });
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("ナビゲーションは JavaScript に依存しないアンカーリンクを持つ", async ({
  page,
}) => {
  for (const id of sectionIds.slice(1)) {
    const link = page.locator(`a[href="#${id}"]`).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", `#${id}`);
  }

  await page.locator('a[href="#rules"]').first().click();
  await expect(page).toHaveURL(/#rules$/);
  await expect(page.locator("#rules")).toBeVisible();
  await expect(
    page.locator('header[data-menu-open] a[href="#rules"]'),
  ).toHaveAttribute("aria-current", "location");

  await page.locator('header[data-menu-open] a[href="#top"]').click();
  await expect(page).toHaveURL(/#top$/);
  await expect(
    page.locator('header[data-menu-open] a[aria-current="location"]'),
  ).toHaveCount(0);
});

test("FAQ はDB状態を明示し、取得時はネイティブ details で開閉できる", async ({
  page,
}) => {
  const firstFaq = page.locator("#faq details").first();
  if ((await firstFaq.count()) === 0) {
    await expect(page.getByText("FAQを取得できません")).toBeVisible();
    return;
  }

  const summary = firstFaq.locator("summary");

  await expect(firstFaq).not.toHaveAttribute("open", "");
  await summary.click();
  await expect(firstFaq).toHaveAttribute("open", "");
  await summary.click();
  await expect(firstFaq).not.toHaveAttribute("open", "");
});

test("サーバールール全文をWebサイト上で開閉して確認できる", async ({
  page,
}) => {
  const rulebook = page.locator("#rules details.rulebook");
  const summary = rulebook.locator("summary");

  await expect(rulebook).not.toHaveAttribute("open", "");
  await summary.click();
  await expect(rulebook).toHaveAttribute("open", "");
  await expect(
    rulebook.getByRole("heading", {
      name: "JapanHideaway.com サーバールール",
    }),
  ).toBeVisible();
  await expect(rulebook.getByText("永久BAN", { exact: true })).toBeVisible();
  await expect(rulebook.getByText(/パスコードレイド/)).toBeVisible();
  await expect(rulebook.getByText(/最新のサーバールール/)).toBeVisible();

  await summary.click();
  await expect(rulebook).not.toHaveAttribute("open", "");
});

test("利用規約はフッターから開き、日英・PC・モバイルで閉じた後にフォーカスが戻る", async ({
  page,
}) => {
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
      const trigger = page
        .getByRole("contentinfo")
        .getByRole("button", { name: content.terms.openLabel });
      await expect(
        page.getByRole("button", { name: content.terms.openLabel }),
      ).toHaveCount(1);
      await trigger.click();
      const dialog = page.getByRole("dialog", {
        name: content.terms.dialogLabel,
      });
      await expect(dialog).toBeVisible();
      const article = content.terms.articles[0];
      if (!article) throw new Error("The first terms article must be present");
      await expect(
        dialog.getByRole("heading", { name: article.title }),
      ).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    }
  }
});

test("Discord の外部リンクは安全な属性と設定 URL を使う", async ({ page }) => {
  const links = page.locator(`a[href="${e2eEnvironment.discordUrl}"]`);

  await expect(links.first()).toBeVisible();
  await expect.poll(() => links.count()).toBeGreaterThanOrEqual(2);

  const linkCount = await links.count();
  for (let index = 0; index < linkCount; index += 1) {
    const link = links.nth(index);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
    await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
  }
});

test("HeroからF1接続コマンドとSteam起動リンクを利用できる", async ({
  page,
}) => {
  const command = `client.connect ${e2eEnvironment.rustServerAddress}`;
  const steamUrl = `steam://run/252490//+connect%20${e2eEnvironment.rustServerAddress}`;

  await expect(page.locator("#top code")).toHaveText(command);
  await expect(page.getByRole("button", { name: "コピー" })).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Steamを起動してJapanHideaway.comへ接続する",
    }),
  ).toHaveAttribute("href", steamUrl);
});

test("指定された全幅で主要コンテンツを表示し、横スクロールを発生させない", async ({
  page,
}) => {
  for (const width of requiredViewportWidths) {
    await page.setViewportSize({ height: 900, width });
    await page.goto(`/?viewport=${width}`);

    await expect(
      page.getByRole("heading", { level: 1, name: ja.hero.headline.join(" ") }),
    ).toBeVisible();
    await expect(
      page.locator(`#top a[href="${e2eEnvironment.discordUrl}"]`).first(),
    ).toBeVisible();

    const documentWidth = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(
      documentWidth.scrollWidth,
      `${width}px viewport must not overflow horizontally`,
    ).toBeLessThanOrEqual(documentWidth.innerWidth + 1);
  }
});

test.describe("360px のモバイル表示", () => {
  test.use({ viewport: { height: 800, width: 360 } });

  test("メニューをキーボードで開閉でき、横スクロールが発生しない", async ({
    page,
  }) => {
    const menuButton = page.getByRole("button", { name: /メニュー/i });

    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await menuButton.focus();
    await page.keyboard.press("Enter");
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.locator('#mobile-navigation a[href="#rules"]'),
    ).toBeVisible();

    const openMenuOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(openMenuOverflow).toBeLessThanOrEqual(1);

    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menuButton).toBeFocused();

    const closedMenuOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(closedMenuOverflow).toBeLessThanOrEqual(1);
  });
});

test("お知らせをページ遷移せず全画面で開き、閉じると一覧へ戻れる", async ({
  page,
}) => {
  const link = page.locator("#news .news-item .news-summary").first();
  if (await link.count()) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("#raid-time-zone")).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);
    await link.focus();
    const url = page.url();
    const title = await link.locator(".news-title").innerText();
    const scrollY = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(title);
    await expect(page).toHaveURL(url);
    await expect(dialog.locator(".news-article-body")).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await expect(dialog.getByRole("heading", { level: 1 })).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(link).toBeFocused();
    await expect(page).toHaveURL(url);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  } else {
    await expect(
      page
        .locator("#news")
        .getByText(
          /現在、掲載中のお知らせはありません|お知らせを取得できません/,
        ),
    ).toBeVisible();
  }
});

test("存在しないお知らせには404と一覧へのリンクを表示する", async ({
  page,
}) => {
  const response = await page.goto("/news/nonexistent-announcement");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: ja.news.notFoundTitle }),
  ).toBeVisible();
  await page.getByRole("link", { name: ja.news.backToList }).click();
  await expect(page).toHaveURL(/\/#news$/);
});

test("最終CTAと独立した利用規約セクションを置かず、お知らせの後にフッターを表示する", async ({
  page,
}) => {
  await expect(
    page.locator(".join-section, #join-title, #terms-section-title"),
  ).toHaveCount(0);
  await expect(page.locator("main > section:last-child")).toHaveAttribute(
    "id",
    "news",
  );
  await expect(
    page.locator("main").getByRole("button", { name: ja.terms.openLabel }),
  ).toHaveCount(0);
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await expect(
    footer.getByRole("button", { name: ja.terms.openLabel }),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: ja.footer.backToTopLabel }),
  ).toHaveAttribute("href", "#top");
});

test("不要なレイド時間表とHero背景を表示せず、設定と日時確認を残す", async ({
  page,
}) => {
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".raid-upcoming, .raid-schedule")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "レイド時間を、ひと目で。" }),
    ).toHaveCount(0);
    await expect(page.locator(".settings-panel")).toBeVisible();
    await expect(page.locator(".raid-checker")).toBeVisible();
    for (const pseudo of ["::before", "::after"]) {
      const style = await page.locator(".hero-section").evaluate(
        (el, pseudo) => ({
          content: getComputedStyle(el, pseudo).content,
          image: getComputedStyle(el, pseudo).backgroundImage,
        }),
        pseudo,
      );
      expect(style.content).toBe("none");
      expect(style.image).toBe("none");
    }
  }
});
