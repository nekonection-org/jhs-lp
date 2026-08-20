import { expect, test, type Locator } from "@playwright/test";

async function expectControlsToMatch(dropdown: Locator, toggle: Locator) {
  const [dropdownBox, toggleBox] = await Promise.all([
    dropdown.boundingBox(),
    toggle.boundingBox(),
  ]);

  expect(dropdownBox).not.toBeNull();
  expect(toggleBox).not.toBeNull();
  expect(
    Math.abs((dropdownBox?.y ?? 0) - (toggleBox?.y ?? 0)),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs((dropdownBox?.height ?? 0) - (toggleBox?.height ?? 0)),
  ).toBeLessThanOrEqual(1);
}

test.describe("managed section administration", () => {
  test.skip(
    process.env.E2E_ADMIN_ENABLED !== "true",
    "Set E2E_ADMIN_ENABLED=true with a migrated test database.",
  );

  test("updates VIP content, public display, and audit log", async ({
    page,
  }) => {
    const marker = `VIP E2E ${Date.now()}`;

    await page.goto("/admin/vip");
    await expect(page.getByRole("heading", { name: "VIP管理" })).toBeVisible();
    await expectControlsToMatch(
      page.getByLabel("内容の確認状態"),
      page.getByTestId("vip-purchase-toggle"),
    );
    const japaneseTitle = page.getByLabel("状態の見出し");
    const englishTitle = page.getByLabel("Status title");
    const originalJapaneseTitle = await japaneseTitle.inputValue();
    const originalEnglishTitle = await englishTitle.inputValue();

    try {
      await japaneseTitle.fill(marker);
      await englishTitle.fill(`${marker} English`);
      await page.getByRole("button", { name: "VIP内容を保存" }).click();
      await expect(page).toHaveURL("/admin/vip?saved=1");
      await expect(page.getByText("VIP内容を更新しました。")).toBeVisible();

      await page.goto("/#vip");
      await expect(
        page.locator("#vip").getByText(marker, { exact: true }),
      ).toBeVisible();

      await page.goto("/admin/audit");
      await expect(page.getByText("VIP: vip").first()).toBeVisible();
    } finally {
      await page.goto("/admin/vip");
      await page.getByLabel("状態の見出し").fill(originalJapaneseTitle);
      await page.getByLabel("Status title").fill(originalEnglishTitle);
      await page.getByRole("button", { name: "VIP内容を保存" }).click();
      await expect(page).toHaveURL("/admin/vip?saved=1");
    }
  });

  test("updates moderator content, public display, and audit log", async ({
    page,
  }) => {
    const marker = `Moderator E2E ${Date.now()}`;

    await page.goto("/admin/moderator");
    await expect(
      page.getByRole("heading", { name: "モデレーター募集管理" }),
    ).toBeVisible();
    await expectControlsToMatch(
      page.getByLabel("募集内容の確認状態"),
      page.getByTestId("moderator-application-toggle"),
    );
    const japaneseTitle = page.getByLabel("募集状態の見出し");
    const englishTitle = page.getByLabel("Recruitment status title");
    const originalJapaneseTitle = await japaneseTitle.inputValue();
    const originalEnglishTitle = await englishTitle.inputValue();

    try {
      await japaneseTitle.fill(marker);
      await englishTitle.fill(`${marker} English`);
      await page.getByRole("button", { name: "募集内容を保存" }).click();
      await expect(page).toHaveURL("/admin/moderator?saved=1");
      await expect(
        page.getByText("モデレーター募集内容を更新しました。"),
      ).toBeVisible();

      await page.goto("/#moderator");
      await expect(
        page.locator("#moderator").getByText(marker, { exact: true }),
      ).toBeVisible();

      await page.goto("/admin/audit");
      await expect(
        page.getByText("モデレーター募集: moderator").first(),
      ).toBeVisible();
    } finally {
      await page.goto("/admin/moderator");
      await page.getByLabel("募集状態の見出し").fill(originalJapaneseTitle);
      await page
        .getByLabel("Recruitment status title")
        .fill(originalEnglishTitle);
      await page.getByRole("button", { name: "募集内容を保存" }).click();
      await expect(page).toHaveURL("/admin/moderator?saved=1");
    }
  });
});
