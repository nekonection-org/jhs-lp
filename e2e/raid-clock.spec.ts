import { expect, test } from "@playwright/test";

const mondayBeforeOpen = new Date("2026-11-16T08:59:59Z");

test("日本時間の開始・終了の境界で現在の可否と次の時刻が切り替わる", async ({
  page,
}) => {
  await page.clock.install({ time: mondayBeforeOpen });
  await page.clock.pauseAt(mondayBeforeOpen);
  await page.goto("/");
  const status = page.locator(".raid-live-status");
  await expect(status).toHaveAttribute("data-allowed", "false");
  await expect(page.locator(".raid-next-transition time")).toHaveAttribute(
    "datetime",
    "2026-11-16T09:00:00.000Z",
  );
  await page.clock.runFor(1_000);
  await expect(status).toHaveAttribute("data-allowed", "true");
  await expect(page.locator(".raid-next-transition time")).toHaveAttribute(
    "datetime",
    "2026-11-16T15:00:00.000Z",
  );
  await page.clock.fastForward(6 * 60 * 60 * 1_000);
  await expect(status).toHaveAttribute("data-allowed", "false");
  await expect(page.locator(".raid-next-transition time")).toHaveAttribute(
    "datetime",
    "2026-11-17T09:00:00.000Z",
  );
});

test("タイムゾーン・言語を切り替えても判定は同じで、日付をまたぐ時間と選択を保持する", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-16T10:00:00Z") });
  await page.goto("/");
  const zone = page.getByLabel("表示タイムゾーン");
  await zone.selectOption("Australia/Sydney");
  await expect(page.locator(".raid-live-status")).toHaveAttribute(
    "data-allowed",
    "true",
  );
  await expect(page.locator(".raid-next-transition time")).toContainText(
    "11月17日",
  );
  await expect(page.locator(".raid-next-transition time")).toContainText(
    "02:00",
  );
  await page.locator(".raid-upcoming summary").click();
  await expect(page.locator(".raid-upcoming li")).toHaveCount(7);
  await expect(page.locator(".raid-upcoming li").first()).toContainText(
    "2026-11-16",
  );
  await page.getByRole("button", { name: /English|英語/, exact: true }).click();
  await expect(page.getByLabel("Display time zone")).toHaveValue(
    "Australia/Sydney",
  );
  await expect(page.locator(".raid-live-status")).toHaveText("Raiding allowed");
  await expect(page.locator(".raid-next-transition time")).toContainText(
    "17 Nov",
  );
  await page.reload();
  await expect(page.getByLabel("Display time zone")).toHaveValue(
    "Australia/Sydney",
  );
});

test("夏時間の切替を含む週はそれぞれの日付のオフセットで変換する", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-31T00:00:00Z") });
  await page.goto("/");
  await page.getByLabel("表示タイムゾーン").selectOption("America/New_York");
  await page.locator(".raid-upcoming summary").click();
  const rows = page.locator(".raid-upcoming li");
  await expect(rows.nth(0).locator(".raid-upcoming-times")).toContainText(
    "23:00",
  );
  await expect(rows.nth(0).locator(".raid-upcoming-times")).toContainText(
    "11:00",
  );
  await expect(rows.nth(1).locator(".raid-upcoming-times")).toContainText(
    "10:00",
  );
});

test("保存不可でも切替でき、端末のタイムゾーンも選べる", async ({
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
  await page.clock.install({ time: new Date("2026-11-16T00:00:00Z") });
  await page.goto("/");
  const deviceZone = await page.evaluate(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  await page.getByLabel("表示タイムゾーン").selectOption(deviceZone);
  await expect(page.locator(".raid-next-transition time")).toContainText(
    "14:45",
  );
  await expect(page.getByLabel("表示タイムゾーン")).toHaveValue(deviceZone);
  await context.close();
});

test("JavaScriptが無効でも日本時間の基準表を読める", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".hero-window-times")).toContainText("18:00");
  await expect(page.locator(".hero-window-times")).toContainText("12:00");
  await expect(page.getByLabel("表示タイムゾーン")).toBeDisabled();
  await context.close();
});

test("不正な保存値は日本時間に戻し、タブ復帰時には現在時刻から再計算する", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("jhs-raid-time-zone", "Invalid/Zone"),
  );
  await page.clock.install({ time: new Date("2026-11-16T08:00:00Z") });
  await page.goto("/");
  await expect(page.getByLabel("表示タイムゾーン")).toHaveValue("Asia/Tokyo");
  await expect(page.locator(".raid-live-status")).toHaveAttribute(
    "data-allowed",
    "false",
  );
  await page.clock.setSystemTime(new Date("2026-11-16T10:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.locator(".raid-live-status")).toHaveAttribute(
    "data-allowed",
    "true",
  );
  await expect(page.locator(".raid-next-transition time")).toHaveAttribute(
    "datetime",
    "2026-11-16T15:00:00.000Z",
  );
});

test("次回ワイプまでの残り時間を表示し、金曜18時に翌週へ更新する", async ({
  page,
}) => {
  const beforeWipe = new Date("2026-11-20T08:59:59Z");
  await page.clock.install({ time: beforeWipe });
  await page.clock.pauseAt(beforeWipe);
  await page.goto("/");
  const wipe = page.locator(".wipe-countdown-block");
  await expect(wipe.locator("time")).toHaveAttribute(
    "datetime",
    "2026-11-20T09:00:00.000Z",
  );
  await expect(wipe.locator(".wipe-countdown")).toContainText("0日 00:00:01");
  await page.getByLabel("表示タイムゾーン").selectOption("America/Los_Angeles");
  await expect(wipe.locator("time")).toContainText("01:00");
  await expect(wipe.locator(".wipe-reference")).toContainText("18:00 JST");
  await page.clock.runFor(1_000);
  await expect(wipe.locator("time")).toHaveAttribute(
    "datetime",
    "2026-11-27T09:00:00.000Z",
  );
  await expect(wipe.locator(".wipe-countdown")).toContainText("7日 00:00:00");
  await page.getByRole("button", { name: /English|英語/, exact: true }).click();
  await expect(wipe.locator("h3")).toHaveText("Next map & BP wipe (scheduled)");
  await expect(wipe.locator(".wipe-countdown")).toContainText("7d 00:00:00");
});
