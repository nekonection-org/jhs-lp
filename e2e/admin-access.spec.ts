import { expect, test } from "@playwright/test";

test.describe("development admin access", () => {
  test.skip(
    process.env.E2E_ADMIN_ENABLED !== "true",
    "Requires the explicitly configured development identity and database.",
  );

  test("opens /admin and redirects to the announcement manager", async ({
    page,
  }) => {
    const response = await page.goto("/admin");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/admin\/news$/);
    await expect(
      page.getByRole("heading", { name: "お知らせ管理", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "管理メニュー" }),
    ).toBeVisible();
  });

  for (const [path, title] of [
    ["news", "お知らせ管理"],
    ["faqs", "FAQ管理"],
    ["rules", "サーバールール管理"],
    ["vip", "VIP管理"],
    ["moderator", "モデレーター募集管理"],
    ["audit", "操作ログ"],
  ] as const) {
    test(`allows the configured identity to read /admin/${path}`, async ({
      page,
    }) => {
      const response = await page.goto(`/admin/${path}`);
      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole("heading", { name: title, level: 1 }),
      ).toBeVisible();
      await expect(
        page.getByText("管理画面の認証を現在確認できません。"),
      ).toHaveCount(0);
    });
  }
});
