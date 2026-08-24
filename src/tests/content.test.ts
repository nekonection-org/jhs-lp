import { describe, expect, it } from "vitest";

import {
  contentByLocale,
  defaultLocale,
  en,
  getContent,
  isLocale,
  ja,
  navigationItemIds,
  sectionIds,
  serverSettingIds,
  vipDetailIds,
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

  it("keeps database-backed FAQ fallback messages complete", () => {
    for (const content of getLocalizedContent()) {
      expect(content.faq.emptyTitle.trim()).not.toBe("");
      expect(content.faq.emptyDescription.trim()).not.toBe("");
      expect(content.faq.unavailableTitle.trim()).not.toBe("");
      expect(content.faq.unavailableDescription.trim()).not.toBe("");
    }
  });

  it("keeps VIP detail identifiers aligned in both languages", () => {
    expect(ja.vip.details.map(({ id }) => id)).toEqual(vipDetailIds);
    expect(en.vip.details.map(({ id }) => id)).toEqual(vipDetailIds);
  });

  it("keeps terms articles structurally aligned in both languages", () => {
    expect(en.terms.introduction).toHaveLength(ja.terms.introduction.length);
    expect(en.terms.articles.map(({ id }) => id)).toEqual(
      ja.terms.articles.map(({ id }) => id),
    );

    for (const article of ja.terms.articles) {
      const englishArticle = getMatchingItem(en.terms.articles, article.id);
      expect(englishArticle.paragraphs).toHaveLength(article.paragraphs.length);
      expect(englishArticle.items ?? []).toHaveLength(
        (article.items ?? []).length,
      );
    }
  });

  it("keeps the complete server rulebook structurally aligned", () => {
    expect(en.rules.rulebook.blocks.map(({ id }) => id)).toEqual(
      ja.rules.rulebook.blocks.map(({ id }) => id),
    );

    for (const block of ja.rules.rulebook.blocks) {
      const englishBlock = getMatchingItem(en.rules.rulebook.blocks, block.id);
      expect(englishBlock.paragraphs).toHaveLength(block.paragraphs.length);
      expect(englishBlock.items?.map(({ id }) => id) ?? []).toEqual(
        block.items?.map(({ id }) => id) ?? [],
      );
      expect(Boolean(englishBlock.penalty)).toBe(Boolean(block.penalty));
    }
  });

  it("publishes the confirmed server schedule and enforcement rules", () => {
    expect(
      ja.server.highlights.every(({ status }) => status === "confirmed"),
    ).toBe(true);
    expect(
      en.server.highlights.every(({ status }) => status === "confirmed"),
    ).toBe(true);
    expect(ja.server.settings.map(({ id }) => id)).toEqual(serverSettingIds);
    expect(en.server.settings.map(({ id }) => id)).toEqual(serverSettingIds);
    expect(ja.rules.items.every(({ status }) => status === "confirmed")).toBe(
      true,
    );
    expect(en.rules.items.every(({ status }) => status === "confirmed")).toBe(
      true,
    );

    expect(getMatchingItem(ja.server.settings, "team-limit").value).toBe(
      "最大4人（Solo / Duo / Trio / Quad）",
    );
    expect(getMatchingItem(ja.server.settings, "map-size").value).toBe("3500");
    expect(getMatchingItem(ja.server.settings, "map-bp-wipe").value).toBe(
      "毎週金曜日 18:00 JST",
    );
    expect(getMatchingItem(ja.server.settings, "daily-restart").value).toBe(
      "毎日 04:00 JST",
    );
    expect(ja.server.welcomeDescription).toContain("初心者から上級者まで");
    expect(ja.server.welcomeDescription).toContain("プレイスタイルを尊重");
    expect(ja.server.welcomeDescription).toContain("公平で快適な環境");
    expect(ja.rules.items[0].description).toContain("平日18:00〜24:00");
    expect(ja.rules.items[0].description).toContain("土・日12:00〜24:00");
    expect(ja.rules.items[0].description).toContain("次回ワイプまで自動BAN");
    expect(ja.rules.items[1].description).toContain("最大4人");
    expect(ja.rules.items[2].description).toContain("永久BAN");
    expect(ja.rules.items[2].description).toContain("#claim-ticket");
    expect(ja.rules.items[2].description).toContain("DMでは対応しません");
    expect(ja.rules.items[4].description).toContain("F7レポート");

    const raidRules = getMatchingItem(ja.rules.rulebook.blocks, "raid-rules");
    expect(raidRules.items?.map(({ id }) => id)).toEqual([
      "weekdays",
      "weekends",
      "prohibited-scope",
      "exemptions",
      "attack-enforcement",
      "destruction-enforcement",
      "accident",
    ]);
    expect(
      raidRules.items?.find(({ id }) => id === "attack-enforcement")
        ?.description,
    ).toContain("1回目は警告、2回目はサーバーキック");
    expect(
      raidRules.items?.find(({ id }) => id === "destruction-enforcement")
        ?.description,
    ).toContain("違反回数にかかわらず");
    expect(getMatchingItem(ja.rules.rulebook.blocks, "cheating").penalty).toBe(
      "永久BAN",
    );
    expect(
      getMatchingItem(ja.rules.rulebook.blocks, "cheating").items?.find(
        ({ id }) => id === "appeal",
      )?.description,
    ).toContain("Discord の #claim-ticket");
    expect(
      raidRules.items?.find(({ id }) => id === "exemptions")?.description,
    ).toContain("パスコードレイド");
    expect(
      ja.rules.rulebook.blocks.some(({ id }) => id === "server-specifications"),
    ).toBe(false);
    expect(ja.rules.rulebook.supplementaryNote).toContain(
      "最新のサーバールール",
    );

    expect(getMatchingItem(en.server.settings, "map-bp-wipe").value).toBe(
      "Every Friday at 18:00 JST",
    );
    expect(getMatchingItem(en.server.settings, "daily-restart").value).toBe(
      "Daily at 04:00 JST",
    );
    expect(en.server.welcomeDescription).toContain("beginners to veterans");
    expect(en.server.welcomeDescription).toContain("fair and comfortable");
    expect(en.rules.items[0].description).toContain("weekdays");
    expect(en.rules.items[0].description).toContain("automatic ban");
    expect(en.rules.items[1].description).toContain("four players");
    expect(en.rules.items[2].description).toContain("permanent ban");
    expect(en.rules.items[4].description).toContain("F7 report");
    expect(en.rules.rulebook.supplementaryNote).toContain("authoritative");
  });

  it("keeps database-backed news labels and fallback messages complete", () => {
    for (const content of getLocalizedContent()) {
      expect(Object.keys(content.news.categoryLabels)).toEqual([
        "notice",
        "maintenance",
        "update",
        "event",
        "important",
        "incident",
      ]);
      expect(content.news.emptyTitle.trim()).not.toBe("");
      expect(content.news.emptyDescription.trim()).not.toBe("");
      expect(content.news.unavailableTitle.trim()).not.toBe("");
      expect(content.news.unavailableDescription.trim()).not.toBe("");
      expect(content.news.translationPendingTitle.trim()).not.toBe("");
      expect(content.news.translationPendingDescription.trim()).not.toBe("");
    }
  });

  it("finds corresponding localized items and reports missing IDs", () => {
    expect(getMatchingItem(ja.navigation.items, "rules").label).toBe("ルール");
    expect(() => getMatchingItem(ja.navigation.items, "missing")).toThrow(
      "Localized content item is missing: missing",
    );
  });
});
