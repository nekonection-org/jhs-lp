import { describe, expect, it } from "vitest";

import { en, ja } from "@/content";
import { validateVipForm } from "@/lib/vip/validation";

const localizedFields = [
  "eyebrow",
  "title",
  "description",
  "statusTitle",
  "statusDescription",
  "benefitsTitle",
  "emptyBenefitsTitle",
  "emptyBenefitsDescription",
  "purchaseUnavailableMessage",
  "notice",
] as const;

function validFormData() {
  const formData = new FormData();
  formData.set("status", "pending");
  formData.set("benefitCount", "0");

  for (const [locale, content] of [
    ["ja", ja.vip],
    ["en", en.vip],
  ] as const) {
    for (const field of localizedFields) {
      formData.set(`${field}-${locale}`, content[field]);
    }
    for (const detail of content.details) {
      formData.set(`detail-${detail.id}-label-${locale}`, detail.label);
      formData.set(`detail-${detail.id}-value-${locale}`, detail.value);
    }
  }

  for (const detail of ja.vip.details) {
    formData.set(`detail-${detail.id}-status`, detail.status);
  }

  return formData;
}

describe("VIP validation", () => {
  it("parses complete bilingual VIP content", () => {
    const result = validateVipForm(validFormData());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ja).toEqual(ja.vip);
      expect(result.data.en).toEqual(en.vip);
    }
  });

  it("requires bilingual button labels when the Tebex action is enabled", () => {
    const formData = validFormData();
    formData.set("purchaseEnabled", "on");

    const result = validateVipForm(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors["purchaseLabel-ja"]).toBeDefined();
      expect(result.errors["purchaseAriaLabel-en"]).toBeDefined();
    }
  });

  it("validates and aligns bilingual benefit entries", () => {
    const formData = validFormData();
    formData.set("benefitCount", "1");
    formData.set("benefit-0-id", "queue-skip");
    formData.set("benefit-0-icon", "badge");
    formData.set("benefit-0-title-ja", "待機列優先");
    formData.set("benefit-0-description-ja", "混雑時の待機列を優先します。");
    formData.set("benefit-0-title-en", "Queue priority");
    formData.set(
      "benefit-0-description-en",
      "Provides priority in the queue during busy periods.",
    );

    const result = validateVipForm(formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ja.benefits[0]).toMatchObject({
        id: "queue-skip",
        title: "待機列優先",
      });
      expect(result.data.en.benefits[0]).toMatchObject({
        id: "queue-skip",
        title: "Queue priority",
      });
    }
  });
});
