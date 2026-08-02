import { describe, expect, it } from "vitest";

import {
  contentByLocale,
  defaultLocale,
  en,
  faqItemIds,
  getContent,
  isLocale,
  ja,
  navigationItemIds,
  sectionIds,
} from "@/content";
import { getMatchingItem } from "@/lib/content";

const getLocalizedContent = () => [getContent("ja"), getContent("en")] as const;

describe("localized content", () => {
  it("uses Japanese as the default locale and narrows supported values", () => {
    expect(defaultLocale).toBe("ja");
    expect(isLocale("ja")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it("maps each supported locale to the matching content", () => {
    expect(getContent("ja")).toBe(ja);
    expect(getContent("en")).toBe(en);
    expect(Object.keys(contentByLocale)).toEqual(["ja", "en"]);
    expect(ja.locale).toBe("ja");
    expect(en.locale).toBe("en");
  });

  it("keeps navigation and section identifiers aligned in both languages", () => {
    const expectedNavigationIds = sectionIds.filter((id) => id !== "top");

    expect(navigationItemIds).toEqual(expectedNavigationIds);
    expect(ja.navigation.items.map(({ id }) => id)).toEqual(
      expectedNavigationIds,
    );
    expect(en.navigation.items.map(({ id }) => id)).toEqual(
      expectedNavigationIds,
    );

    for (const content of getLocalizedContent()) {
      expect([
        content.hero.id,
        content.server.id,
        content.rules.id,
        content.vip.id,
        content.faq.id,
        content.moderator.id,
        content.news.id,
      ]).toEqual(sectionIds);
    }
  });

  it("keeps FAQ entries complete and structurally equivalent", () => {
    expect(ja.faq.items.map(({ id }) => id)).toEqual(faqItemIds);
    expect(en.faq.items.map(({ id }) => id)).toEqual(faqItemIds);

    for (const content of getLocalizedContent()) {
      for (const item of content.faq.items) {
        expect(item.question.trim()).not.toBe("");
        expect(item.answer.trim()).not.toBe("");
      }
    }
  });

  it("publishes the confirmed server schedule and enforcement rules", () => {
    expect(ja.server.items.every(({ status }) => status === "confirmed")).toBe(
      true,
    );
    expect(en.server.items.every(({ status }) => status === "confirmed")).toBe(
      true,
    );
    expect(ja.rules.items.every(({ status }) => status === "confirmed")).toBe(
      true,
    );
    expect(en.rules.items.every(({ status }) => status === "confirmed")).toBe(
      true,
    );

    expect(ja.server.items[3].description).toContain("毎週金曜日");
    expect(ja.server.items[3].description).toContain("最大4人");
    expect(ja.server.items[3].description).toContain("3500");
    expect(ja.rules.items[0].description).toContain("平日18:00〜24:00");
    expect(ja.rules.items[0].description).toContain("土・日12:00〜24:00");
    expect(ja.rules.items[0].description).toContain("自動的に処罰");
    expect(ja.rules.items[1].description).toContain("最大4人");
    expect(ja.rules.items[2].description).toContain("永久BAN");
    expect(ja.rules.items[2].description).toContain("#claim-ticket");
    expect(ja.rules.items[4].description).toContain("F7レポート");

    expect(en.server.items[3].description).toContain("every Friday at 18:00");
    expect(en.rules.items[0].description).toContain("weekdays");
    expect(en.rules.items[0].description).toContain("penalized automatically");
    expect(en.rules.items[1].description).toContain("four players");
    expect(en.rules.items[2].description).toContain("permanent ban");
    expect(en.rules.items[4].description).toContain("F7 report");
  });

  it("limits news to the LP range and requires valid ISO calendar dates", () => {
    for (const content of getLocalizedContent()) {
      expect(content.news.items.length).toBeLessThanOrEqual(5);

      for (const item of content.news.items) {
        expect(item.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const parsedDate = new Date(`${item.publishedAt}T00:00:00Z`);
        expect(Number.isNaN(parsedDate.getTime())).toBe(false);
        expect(parsedDate.toISOString().slice(0, 10)).toBe(item.publishedAt);
      }
    }
  });

  it("finds corresponding localized items and reports missing IDs", () => {
    expect(getMatchingItem(ja.navigation.items, "rules").label).toBe("ルール");
    expect(() => getMatchingItem(ja.navigation.items, "missing")).toThrow(
      "Localized content item is missing: missing",
    );
  });
});
