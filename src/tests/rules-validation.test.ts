import { describe, expect, it } from "vitest";

import { en, ja, type RulesContent } from "@/content";
import {
  areRuleStructuresAligned,
  parseStoredRulesContent,
} from "@/lib/rules/stored-content";
import { validateRulesForm } from "@/lib/rules/validation";

const sectionFields = [
  "eyebrow",
  "title",
  "description",
  "noticeTitle",
  "notice",
] as const;
const rulebookFields = [
  "title",
  "openLabel",
  "closeLabel",
  "supplementaryNote",
  "lastUpdatedLabel",
  "lastUpdated",
] as const;

function validFormData() {
  const formData = new FormData();
  formData.set("blockCount", String(ja.rules.rulebook.blocks.length));

  for (const [locale, content] of [
    ["ja", ja.rules],
    ["en", en.rules],
  ] as const) {
    for (const field of sectionFields) {
      formData.set(`${field}-${locale}`, content[field]);
    }
    for (const field of rulebookFields) {
      formData.set(`rulebook-${field}-${locale}`, content.rulebook[field]);
    }
    for (const item of content.items) {
      formData.set(`item-${item.id}-title-${locale}`, item.title);
      formData.set(`item-${item.id}-description-${locale}`, item.description);
    }
    for (const [blockIndex, block] of content.rulebook.blocks.entries()) {
      formData.set(`block-${blockIndex}-title-${locale}`, block.title);
      formData.set(
        `block-${blockIndex}-penalty-${locale}`,
        block.penalty ?? "",
      );
      formData.set(
        `block-${blockIndex}-paragraphs-${locale}`,
        block.paragraphs.join("\n\n"),
      );
      for (const [itemIndex, item] of (block.items ?? []).entries()) {
        const label =
          "label" in item && typeof item.label === "string" ? item.label : "";
        formData.set(
          `block-${blockIndex}-item-${itemIndex}-label-${locale}`,
          label,
        );
        formData.set(
          `block-${blockIndex}-item-${itemIndex}-description-${locale}`,
          item.description,
        );
      }
    }
  }

  for (const item of ja.rules.items) {
    formData.set(`item-${item.id}-status`, item.status);
    if ("important" in item && item.important) {
      formData.set(`item-${item.id}-important`, "on");
    }
  }
  for (const [blockIndex, block] of ja.rules.rulebook.blocks.entries()) {
    formData.set(`block-${blockIndex}-id`, block.id);
    formData.set(
      `block-${blockIndex}-itemCount`,
      String(block.items?.length ?? 0),
    );
    for (const [itemIndex, item] of (block.items ?? []).entries()) {
      formData.set(`block-${blockIndex}-item-${itemIndex}-id`, item.id);
    }
  }

  return formData;
}

describe("rules validation", () => {
  it("parses complete bilingual rules content", () => {
    const result = validateRulesForm(validFormData());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ja).toEqual(ja.rules);
      expect(result.data.en).toEqual(en.rules);
    }
  });

  it("requires aligned bilingual paragraphs and labels", () => {
    const formData = validFormData();
    formData.set(
      "block-0-paragraphs-en",
      `${en.rules.rulebook.blocks[0]?.paragraphs[0]}\n\nExtra paragraph`,
    );
    formData.set("block-0-item-0-label-en", "");

    const result = validateRulesForm(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors["block-0-paragraphs-en"]).toBeDefined();
      expect(result.errors["block-0-item-0-label-ja"]).toBeDefined();
    }
  });

  it("rejects duplicate block identifiers", () => {
    const formData = validFormData();
    formData.set("block-1-id", "raid-rules");

    const result = validateRulesForm(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors["block-1-id"]).toBeDefined();
    }
  });

  it("rejects corrupt or structurally mismatched stored content", () => {
    expect(parseStoredRulesContent(ja.rules)).toEqual(ja.rules);
    expect(parseStoredRulesContent({ ...ja.rules, rulebook: null })).toBeNull();

    const mismatchedEnglish = structuredClone(en.rules) as RulesContent;
    const firstBlock = mismatchedEnglish.rulebook.blocks[0];
    if (!firstBlock) throw new Error("A seeded rules block is required.");
    const changedEnglish = {
      ...mismatchedEnglish,
      rulebook: {
        ...mismatchedEnglish.rulebook,
        blocks: [
          { ...firstBlock, id: "different-id" },
          ...mismatchedEnglish.rulebook.blocks.slice(1),
        ],
      },
    };
    expect(areRuleStructuresAligned(ja.rules, changedEnglish)).toBe(false);
  });
});
