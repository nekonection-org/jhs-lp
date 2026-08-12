import { describe, expect, it } from "vitest";

import {
  formatJapanDateTimeLocal,
  parseJapanDateTimeLocal,
  validateAnnouncementForm,
} from "@/lib/announcements/validation";

function createValidFormData() {
  const formData = new FormData();
  formData.set("category", "notice");
  formData.set("status", "published");
  formData.set("publishedAt", "2026-08-13T18:30");
  formData.set("externalUrl", "https://discord.com/channels/example");
  formData.set("titleJa", "日本語タイトル");
  formData.set("descriptionJa", "日本語の概要です。");
  formData.set("titleEn", "English title");
  formData.set("descriptionEn", "English description.");
  return formData;
}

describe("Japan time announcement dates", () => {
  it("converts a datetime-local value in Japan time to UTC", () => {
    expect(parseJapanDateTimeLocal("2026-08-13T18:30")?.toISOString()).toBe(
      "2026-08-13T09:30:00.000Z",
    );
  });

  it("round trips a UTC date through a Japan time form value", () => {
    expect(formatJapanDateTimeLocal(new Date("2026-08-13T09:30:00Z"))).toBe(
      "2026-08-13T18:30",
    );
  });

  it.each([
    "2026-02-30T12:00",
    "2026-13-01T12:00",
    "2026-08-13 12:00",
    "not-a-date",
  ])("rejects invalid local time: %s", (value) => {
    expect(parseJapanDateTimeLocal(value)).toBeNull();
  });
});

describe("announcement form validation", () => {
  it("accepts a complete bilingual published announcement", () => {
    const result = validateAnnouncementForm(createValidFormData());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe("notice");
      expect(result.data.publishedAt?.toISOString()).toBe(
        "2026-08-13T09:30:00.000Z",
      );
      expect(result.data.externalUrl).toBe(
        "https://discord.com/channels/example",
      );
    }
  });

  it("allows a Japanese-only draft", () => {
    const formData = createValidFormData();
    formData.set("status", "draft");
    formData.set("publishedAt", "");
    formData.set("titleEn", "");
    formData.set("descriptionEn", "");

    expect(validateAnnouncementForm(formData)).toMatchObject({
      success: true,
      data: {
        status: "draft",
        publishedAt: null,
        translations: { en: null },
      },
    });
  });

  it("requires both languages and a publication time when publishing", () => {
    const formData = createValidFormData();
    formData.set("publishedAt", "");
    formData.set("titleEn", "");
    formData.set("descriptionEn", "");

    expect(validateAnnouncementForm(formData)).toEqual({
      success: false,
      errors: {
        titleEn: "英語タイトルを入力してください。",
        descriptionEn: "英語概要を入力してください。",
        publishedAt: "公開日時を入力してください。",
      },
    });
  });

  it.each(["javascript:alert(1)", "data:text/plain,no", "not-a-url"])(
    "rejects an unsafe external URL: %s",
    (url) => {
      const formData = createValidFormData();
      formData.set("externalUrl", url);
      expect(validateAnnouncementForm(formData)).toMatchObject({
        success: false,
        errors: { externalUrl: expect.any(String) },
      });
    },
  );

  it("rejects unknown categories and overlong content", () => {
    const formData = createValidFormData();
    formData.set("category", "unknown");
    formData.set("titleJa", "a".repeat(161));
    formData.set("descriptionJa", "a".repeat(601));

    expect(validateAnnouncementForm(formData)).toMatchObject({
      success: false,
      errors: {
        category: expect.any(String),
        titleJa: expect.any(String),
        descriptionJa: expect.any(String),
      },
    });
  });
});
