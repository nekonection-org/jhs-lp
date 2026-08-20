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

test.describe("news administration", () => {
  test.skip(
    process.env.E2E_ADMIN_ENABLED !== "true",
    "Set E2E_ADMIN_ENABLED=true with a migrated test database.",
  );

  test("keeps announcement creation controls aligned with hints and validation errors", async ({
    page,
  }) => {
    await page.goto("/admin/news/new");

    await expectControlsToAlign(
      page.getByLabel("カテゴリ"),
      page.getByLabel("公開状態"),
    );
    await expectControlsToAlign(
      page.getByLabel("公開日時（日本時間）"),
      page.getByLabel("外部リンク（任意）"),
    );
    await expectControlsToAlign(
      page.getByLabel("タイトル"),
      page.getByLabel("Title"),
    );

    await page.getByRole("button", { name: "お知らせを保存" }).click();
    await expect(
      page.getByText("日本語タイトルを入力してください。"),
    ).toBeVisible();
    await expectControlsToAlign(
      page.getByLabel("概要"),
      page.getByLabel("Description"),
    );
  });

  test("creates, previews, schedules, and audits an announcement", async ({
    page,
  }) => {
    const marker = `E2E ${Date.now()}`;

    await page.goto("/admin/news");
    await expect(
      page.getByRole("heading", { name: "お知らせ管理" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "新しいお知らせ" }).click();
    await page.getByLabel("タイトル").fill(marker);
    await page
      .getByLabel("概要")
      .fill("管理画面のE2Eテストで作成した下書きです。");
    await page.getByRole("button", { name: "お知らせを保存" }).click();

    await expect(page).toHaveURL(/\/admin\/news\/[^/]+\/edit\?saved=created$/);
    await page.getByRole("link", { name: "プレビュー" }).click();
    await expect(page.getByRole("heading", { name: marker })).toBeVisible();
    await expect(
      page.getByText("English content has not been entered yet."),
    ).toBeVisible();

    await page.getByRole("link", { name: "編集する" }).click();
    await page.getByLabel("公開状態").selectOption("published");
    await page.getByLabel("公開日時（日本時間）").fill("2099-08-13T18:30");
    await page.getByLabel("Title").fill(`${marker} English`);
    await page
      .getByLabel("Description")
      .fill("Scheduled by the administration end-to-end test.");
    await page.getByRole("button", { name: "変更を保存" }).click();

    await expect(page).toHaveURL(/\?saved=updated$/);
    await expect(page.getByText("予約公開", { exact: true })).toBeVisible();

    await page.goto("/admin/audit");
    await expect(page.getByText("e2e-admin@example.com").first()).toBeVisible();
    await expect(page.getByText("更新", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("作成", { exact: true }).first()).toBeVisible();
  });
});
