import { expect, test, type Locator } from "@playwright/test";

async function expectControlsToAlign(...controls: Locator[]) {
  const positions = await Promise.all(
    controls.map(async (control) => {
      const box = await control.boundingBox();
      expect(box).not.toBeNull();
      return box?.y ?? 0;
    }),
  );
  const [firstPosition, ...remainingPositions] = positions;

  if (firstPosition === undefined) {
    throw new Error("At least one control is required for alignment checks.");
  }

  for (const position of remainingPositions) {
    expect(Math.abs(position - firstPosition)).toBeLessThanOrEqual(1);
  }
}

test.describe("FAQ administration", () => {
  test.skip(
    process.env.E2E_ADMIN_ENABLED !== "true",
    "Set E2E_ADMIN_ENABLED=true with a migrated test database.",
  );

  test("keeps FAQ creation controls aligned with hints and validation errors", async ({
    page,
  }) => {
    await page.goto("/admin/faqs/new");

    await expectControlsToAlign(
      page.getByLabel("公開状態"),
      page.getByLabel("内容の確認状態"),
      page.getByLabel("表示順"),
    );
    await expectControlsToAlign(
      page.getByLabel("質問"),
      page.getByLabel("Question"),
    );

    await page.getByRole("button", { name: "FAQを保存" }).click();
    await expect(
      page.getByText("日本語の質問を入力してください。"),
    ).toBeVisible();
    await expectControlsToAlign(
      page.getByLabel("回答"),
      page.getByLabel("Answer"),
    );
  });

  test("creates, publishes, displays, audits, and archives an FAQ", async ({
    page,
  }) => {
    const marker = `FAQ E2E ${Date.now()}`;

    await page.goto("/admin/faqs");
    await expect(page.getByRole("heading", { name: "FAQ管理" })).toBeVisible();

    await page.getByRole("link", { name: "新しいFAQ" }).click();
    await page.getByLabel("質問").fill(marker);
    await page
      .getByLabel("回答")
      .fill("管理画面のE2Eテストで作成した回答です。");
    await page.getByRole("button", { name: "FAQを保存" }).click();

    await expect(page).toHaveURL(/\/admin\/faqs\/[^/]+\/edit\?saved=created$/);
    await page.getByLabel("公開状態").selectOption("published");
    await page.getByLabel("内容の確認状態").selectOption("confirmed");
    await page.getByLabel("表示順").fill("1");
    await page.getByLabel("Question").fill(`${marker} English`);
    await page
      .getByLabel("Answer")
      .fill("Created by the FAQ administration test.");
    await page.getByRole("button", { name: "変更を保存" }).click();

    await expect(page).toHaveURL(/\?saved=updated$/);
    await expect(
      page.locator("span").filter({ hasText: /^公開$/ }),
    ).toBeVisible();

    await page.goto("/#faq");
    const summary = page.locator("#faq summary").filter({ hasText: marker });
    await expect(summary).toBeVisible();
    await summary.click();
    await expect(
      summary
        .locator("..")
        .getByText("管理画面のE2Eテストで作成した回答です。"),
    ).toBeVisible();

    await page.goto("/admin/audit");
    await expect(page.getByText("e2e-admin@example.com").first()).toBeVisible();
    await expect(page.getByText(/FAQ:/).first()).toBeVisible();

    await page.goto("/admin/faqs");
    await page
      .getByRole("article")
      .filter({ hasText: marker })
      .getByRole("link", { name: "編集" })
      .click();
    await page.getByText("アーカイブ操作").click();
    await page.getByRole("button", { name: "アーカイブする" }).click();
    await expect(page).toHaveURL("/admin/faqs?archived=1");
    await expect(page.getByText("FAQをアーカイブしました。")).toBeVisible();
  });
});
