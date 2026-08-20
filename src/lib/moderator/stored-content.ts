import type { ContentStatus, ModeratorContent } from "@/content";
import type { Prisma } from "@/generated/prisma/client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasString(value: Record<string, unknown>, key: string) {
  return typeof value[key] === "string";
}

function isContentStatus(value: unknown): value is ContentStatus {
  return value === "confirmed" || value === "pending";
}

function isModeratorItem(value: unknown) {
  return (
    isRecord(value) &&
    hasString(value, "id") &&
    hasString(value, "title") &&
    hasString(value, "description") &&
    hasString(value, "icon") &&
    isContentStatus(value.status)
  );
}

function isApplicationAction(value: unknown) {
  return (
    value === null ||
    (isRecord(value) &&
      hasString(value, "id") &&
      hasString(value, "label") &&
      hasString(value, "ariaLabel") &&
      value.destination === "moderatorApplication")
  );
}

export function parseStoredModeratorContent(
  value: unknown,
): ModeratorContent | null {
  if (
    !isRecord(value) ||
    value.id !== "moderator" ||
    !hasString(value, "eyebrow") ||
    !hasString(value, "title") ||
    !hasString(value, "description") ||
    !isContentStatus(value.status) ||
    !hasString(value, "statusTitle") ||
    !hasString(value, "statusDescription") ||
    !Array.isArray(value.items) ||
    value.items.length !== 3 ||
    !value.items.every(isModeratorItem) ||
    !hasString(value, "applicationTitle") ||
    !hasString(value, "applicationDescription") ||
    !isApplicationAction(value.applicationAction)
  ) {
    return null;
  }

  if (
    value.items.map((item) => item.id).join(",") !==
    "responsibilities,requirements,ideal-candidate"
  ) {
    return null;
  }

  return value as unknown as ModeratorContent;
}

export function moderatorContentToJson(content: ModeratorContent) {
  return JSON.parse(JSON.stringify(content)) as Prisma.InputJsonObject;
}
