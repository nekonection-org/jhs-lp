import { describe, expect, it } from "vitest";

import { en, ja } from "@/content";
import { validateModeratorForm } from "@/lib/moderator/validation";

const localizedFields = [
  "eyebrow",
  "title",
  "description",
  "statusTitle",
  "statusDescription",
  "applicationTitle",
  "applicationDescription",
] as const;

function validFormData() {
  const formData = new FormData();
  formData.set("status", "pending");

  for (const [locale, content] of [
    ["ja", ja.moderator],
    ["en", en.moderator],
  ] as const) {
    for (const field of localizedFields) {
      formData.set(`${field}-${locale}`, content[field]);
    }
    for (const item of content.items) {
      formData.set(`item-${item.id}-title-${locale}`, item.title);
      formData.set(`item-${item.id}-description-${locale}`, item.description);
    }
  }

  for (const item of ja.moderator.items) {
    formData.set(`item-${item.id}-status`, item.status);
  }

  return formData;
}

describe("moderator recruitment validation", () => {
  it("parses complete bilingual recruitment content", () => {
    const result = validateModeratorForm(validFormData());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ja).toEqual(ja.moderator);
      expect(result.data.en).toEqual(en.moderator);
    }
  });

  it("requires bilingual action labels when applications are enabled", () => {
    const formData = validFormData();
    formData.set("applicationEnabled", "on");

    const result = validateModeratorForm(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors["applicationLabel-ja"]).toBeDefined();
      expect(result.errors["applicationAriaLabel-en"]).toBeDefined();
    }
  });

  it("rejects an incomplete recruitment item", () => {
    const formData = validFormData();
    formData.set("item-requirements-description-ja", "");

    const result = validateModeratorForm(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors["item-requirements-description-ja"]).toBeDefined();
    }
  });
});
