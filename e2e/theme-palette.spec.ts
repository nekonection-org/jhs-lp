import { expect, test } from "@playwright/test";

test("背景とパネルは両テーマでニュートラルにし、ブランドの緑を維持する", async ({
  page,
}) => {
  await page.goto("/");
  for (const theme of ["dark", "light"]) {
    if (theme === "light") {
      await page
        .getByRole("button", { name: "ライトテーマに切り替える" })
        .click();
    }
    await expect(page.locator("html")).toHaveClass(new RegExp(theme));
    const palette = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        accent: styles.getPropertyValue("--accent").trim(),
        colors: [
          "--background",
          "--surface",
          "--surface-secondary",
          "--border",
        ].map((name) => styles.getPropertyValue(name).trim()),
      };
    });
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      theme === "dark" ? "#0c0d0f" : "#f5f5f6",
    );
    expect(palette.accent).toBe(theme === "dark" ? "#8fbd78" : "#527d43");
    for (const value of palette.colors) {
      const hex =
        value.length === 4
          ? `#${value
              .slice(1)
              .split("")
              .map((digit) => digit + digit)
              .join("")}`
          : value;
      const channels = [1, 3, 5].map((index) =>
        parseInt(hex.slice(index, index + 2), 16),
      );
      expect(Math.max(...channels) - Math.min(...channels)).toBeLessThanOrEqual(
        10,
      );
    }
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      theme === "dark" ? "rgb(12, 13, 15)" : "rgb(245, 245, 246)",
    );
  }
});
