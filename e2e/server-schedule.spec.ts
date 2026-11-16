import { expect, test } from "@playwright/test";

const monday = new Date("2026-11-16T08:00:00Z");

test("Heroにはレイド案内を置かず、スクロール先のサーバー情報に集約する", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(
      "#top .server-planner, #top .raid-checker, #top .wipe-countdown-block",
    ),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "いま、レイドできる？" }),
  ).toHaveCount(0);
  await page.locator("a.hero-explore").click();
  await expect(page).toHaveURL(/#server$/);
  await expect(page.locator("#server .wipe-countdown-block")).toBeVisible();
  await expect(page.locator("#server .raid-checker")).toBeVisible();
});

test("選択した現地日時を日本時間へ変換し、週末の境界で判定する", async ({
  page,
}) => {
  await page.clock.install({ time: monday });
  await page.goto("/");
  await page.getByLabel("表示タイムゾーン").selectOption("America/New_York");
  await page.getByLabel("確認する日付").fill("2026-11-20");
  await page.getByLabel(/確認する時刻/).fill("21:59");
  await expect(page.locator(".raid-check-result")).toHaveAttribute(
    "data-allowed",
    "false",
  );
  await page.getByLabel(/確認する時刻/).fill("22:00");
  await expect(page.locator(".raid-check-result")).toHaveAttribute(
    "data-allowed",
    "true",
  );
  await expect(page.locator(".raid-japan-equivalent")).toContainText(
    "11月21日(土) 12:00",
  );
  await page.getByRole("button", { name: /English|英語/, exact: true }).click();
  await expect(page.getByLabel("Choose a date")).toHaveValue("2026-11-20");
  await expect(page.getByLabel(/Choose a time/)).toHaveValue("22:00");
  await expect(page.locator(".raid-check-result")).toContainText(
    "Raiding allowed",
  );
  await page.reload();
  await expect(page.getByLabel("Display time zone")).toHaveValue(
    "America/New_York",
  );
});

test("夏時間で存在しない時刻と2回現れる時刻を区別する", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("表示タイムゾーン").selectOption("America/New_York");
  await page.getByLabel("確認する日付").fill("2026-03-08");
  await page.getByLabel(/確認する時刻/).fill("02:30");
  await expect(page.locator(".raid-check-result")).toHaveAttribute(
    "data-allowed",
    "unknown",
  );
  await expect(page.locator(".raid-check-result")).toContainText(
    "この日時は存在しません",
  );
  await page.getByLabel("確認する日付").fill("2026-11-01");
  await page.getByLabel(/確認する時刻/).fill("01:30");
  const occurrence = page.getByLabel(
    "同じ時刻が2回あります。UTCオフセットを選択",
  );
  await expect(occurrence.locator("option")).toHaveCount(2);
  await occurrence.selectOption(String(Date.parse("2026-11-01T06:30:00Z")));
  await expect(page.locator(".raid-selected-instant time")).toHaveAttribute(
    "datetime",
    "2026-11-01T06:30:00.000Z",
  );
});

test("保存不可でも端末の45分オフセットの地域で確認できる", async ({
  browser,
}) => {
  const context = await browser.newContext({ timezoneId: "Asia/Kathmandu" });
  await context.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("blocked");
    };
  });
  const page = await context.newPage();
  await page.goto("/");
  const deviceZone = await page.evaluate(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  await page.getByLabel("表示タイムゾーン").selectOption(deviceZone);
  await page.getByLabel("確認する日付").fill("2026-11-16");
  await page.getByLabel(/確認する時刻/).fill("14:45");
  await expect(page.locator(".raid-check-result")).toHaveAttribute(
    "data-allowed",
    "true",
  );
  await expect(page.locator(".raid-japan-equivalent")).toContainText("18:00");
  await context.close();
});

test("JavaScriptなしでも接続方法・サーバー設定・ワイプ周期を展開せず読める", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".connection-command")).toBeVisible();
  await expect(page.locator("#server .settings-panel")).toBeVisible();
  await expect(page.locator("#top details, #server details")).toHaveCount(0);
  await expect(page.locator("#server .raid-schedule")).toHaveCount(0);
  await expect(page.locator(".settings-panel")).toContainText(
    "18:00〜24:00 JST",
  );
  await expect(page.locator("#server .wipe-reference")).toContainText(
    "毎週金曜日 18:00 JST",
  );
  await expect(page.getByLabel("表示タイムゾーン")).toBeDisabled();
  await expect(page.getByLabel("確認する日付")).toBeDisabled();
  await context.close();
});

test("不正な保存値は日本時間へ戻し、タブ復帰時にワイプ予定を同期する", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("jhs-raid-time-zone", "Invalid/Zone"),
  );
  await page.clock.install({ time: monday });
  await page.goto("/");
  await expect(page.getByLabel("表示タイムゾーン")).toHaveValue("Asia/Tokyo");
  await expect(page.locator(".wipe-countdown-block time")).toHaveAttribute(
    "datetime",
    "2026-11-20T09:00:00.000Z",
  );
  await page.clock.setSystemTime(new Date("2026-11-21T00:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.locator(".wipe-countdown-block time")).toHaveAttribute(
    "datetime",
    "2026-11-27T09:00:00.000Z",
  );
});

test("ワイプの日時と残り時間をタイムゾーンへ変換し、予定時刻に翌週へ更新する", async ({
  page,
}) => {
  const beforeWipe = new Date("2026-11-20T08:59:59Z");
  await page.clock.install({ time: beforeWipe });
  await page.clock.pauseAt(beforeWipe);
  await page.goto("/");
  const wipe = page.locator("#server .wipe-countdown-block");
  await expect(wipe.locator("time")).toHaveAttribute(
    "datetime",
    "2026-11-20T09:00:00.000Z",
  );
  await expect(wipe.locator(".wipe-countdown")).toContainText("0日 00:00:01");
  await page.getByLabel("表示タイムゾーン").selectOption("America/Los_Angeles");
  await expect(wipe.locator("time")).toContainText("01:00");
  await page.clock.runFor(1_000);
  await expect(wipe.locator("time")).toHaveAttribute(
    "datetime",
    "2026-11-27T09:00:00.000Z",
  );
  await expect(wipe.locator(".wipe-countdown")).toContainText("7日 00:00:00");
});

test("次回ワイプと現地日時の確認だけを残し、重複する時間表を表示しない", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".raid-upcoming, .raid-schedule")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "これから7日間のレイド時間" }),
  ).toHaveCount(0);
  await expect(page.locator(".wipe-countdown-block")).toBeVisible();
  await expect(page.getByLabel("表示タイムゾーン")).toBeEnabled();
  await expect(page.getByLabel("確認する日付")).toBeEnabled();
});
