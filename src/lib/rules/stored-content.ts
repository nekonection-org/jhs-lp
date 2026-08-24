import type {
  ContentIcon,
  ContentStatus,
  RulebookBlockContent,
  RulesContent,
} from "@/content";
import type { Prisma } from "@/generated/prisma/client";

const contentIcons = new Set<ContentIcon>([
  "users",
  "community",
  "clock",
  "settings",
  "shield",
  "message",
  "report",
  "refresh",
  "calendar",
  "credit-card",
  "badge",
  "clipboard",
  "user-check",
]);

const expectedRuleItemIds = [
  "raid-window",
  "team-size",
  "fair-play",
  "community-conduct",
  "reporting",
  "rule-updates",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasString(value: Record<string, unknown>, key: string) {
  return typeof value[key] === "string" && value[key].length > 0;
}

function isContentStatus(value: unknown): value is ContentStatus {
  return value === "confirmed" || value === "pending";
}

function hasUniqueIds(items: readonly { id: string }[]) {
  return new Set(items.map(({ id }) => id)).size === items.length;
}

function isRuleItem(value: unknown) {
  return (
    isRecord(value) &&
    hasString(value, "id") &&
    hasString(value, "title") &&
    hasString(value, "description") &&
    contentIcons.has(value.icon as ContentIcon) &&
    isContentStatus(value.status) &&
    (value.important === undefined || typeof value.important === "boolean")
  );
}

function isRulebookListItem(value: unknown) {
  return (
    isRecord(value) &&
    hasString(value, "id") &&
    hasString(value, "description") &&
    (value.label === undefined || typeof value.label === "string")
  );
}

function isRulebookBlock(value: unknown): value is RulebookBlockContent {
  return (
    isRecord(value) &&
    hasString(value, "id") &&
    hasString(value, "title") &&
    (value.penalty === undefined || typeof value.penalty === "string") &&
    Array.isArray(value.paragraphs) &&
    value.paragraphs.length > 0 &&
    value.paragraphs.every(
      (paragraph) => typeof paragraph === "string" && paragraph.length > 0,
    ) &&
    (value.items === undefined ||
      (Array.isArray(value.items) &&
        value.items.every(isRulebookListItem) &&
        hasUniqueIds(value.items)))
  );
}

function isRulebook(value: unknown) {
  return (
    isRecord(value) &&
    hasString(value, "title") &&
    hasString(value, "openLabel") &&
    hasString(value, "closeLabel") &&
    Array.isArray(value.blocks) &&
    value.blocks.length > 0 &&
    value.blocks.every(isRulebookBlock) &&
    hasUniqueIds(value.blocks) &&
    hasString(value, "supplementaryNote") &&
    hasString(value, "lastUpdatedLabel") &&
    hasString(value, "lastUpdated")
  );
}

export function parseStoredRulesContent(value: unknown): RulesContent | null {
  if (
    !isRecord(value) ||
    value.id !== "rules" ||
    !hasString(value, "eyebrow") ||
    !hasString(value, "title") ||
    !hasString(value, "description") ||
    !hasString(value, "noticeTitle") ||
    !hasString(value, "notice") ||
    !Array.isArray(value.items) ||
    value.items.length !== expectedRuleItemIds.length ||
    !value.items.every(isRuleItem) ||
    value.items.map((item) => item.id).join(",") !==
      expectedRuleItemIds.join(",") ||
    !isRulebook(value.rulebook)
  ) {
    return null;
  }

  return value as unknown as RulesContent;
}

export function areRuleStructuresAligned(
  japanese: RulesContent,
  english: RulesContent,
) {
  if (
    japanese.rulebook.blocks.map(({ id }) => id).join(",") !==
    english.rulebook.blocks.map(({ id }) => id).join(",")
  ) {
    return false;
  }

  return japanese.rulebook.blocks.every((block, index) => {
    const englishBlock = english.rulebook.blocks[index];
    return (
      englishBlock !== undefined &&
      block.paragraphs.length === englishBlock.paragraphs.length &&
      (block.items ?? []).map(({ id }) => id).join(",") ===
        (englishBlock.items ?? []).map(({ id }) => id).join(",") &&
      Boolean(block.penalty) === Boolean(englishBlock.penalty)
    );
  });
}

export function rulesContentToJson(content: RulesContent) {
  return JSON.parse(JSON.stringify(content)) as Prisma.InputJsonObject;
}
