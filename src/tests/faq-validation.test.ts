import { describe, expect, it } from "vitest";

import { validateFaqForm } from "@/lib/faqs/validation";

function validFormData() {
  const formData = new FormData();
  formData.set("status", "published");
  formData.set("contentStatus", "confirmed");
  formData.set("sortOrder", "20");
  formData.set("questionJa", "参加方法を教えてください。");
  formData.set("answerJa", "Discordでサーバー情報をご確認ください。");
  formData.set("questionEn", "How can I join?");
  formData.set("answerEn", "See the server information on Discord.");
  return formData;
}

describe("FAQ validation", () => {
  it("parses a complete published FAQ", () => {
    expect(validateFaqForm(validFormData())).toEqual({
      success: true,
      data: {
        status: "published",
        contentStatus: "confirmed",
        sortOrder: 20,
        translations: {
          ja: {
            question: "参加方法を教えてください。",
            answer: "Discordでサーバー情報をご確認ください。",
          },
          en: {
            question: "How can I join?",
            answer: "See the server information on Discord.",
          },
        },
      },
    });
  });

  it("allows an English translation to be omitted from a draft", () => {
    const formData = validFormData();
    formData.set("status", "draft");
    formData.set("questionEn", "");
    formData.set("answerEn", "");

    const result = validateFaqForm(formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.translations.en).toBeNull();
    }
  });

  it("requires English content for publication and a bounded integer order", () => {
    const formData = validFormData();
    formData.set("sortOrder", "1.5");
    formData.set("answerEn", "");

    const result = validateFaqForm(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.sortOrder).toBeDefined();
      expect(result.errors.answerEn).toBeDefined();
    }
  });
});
