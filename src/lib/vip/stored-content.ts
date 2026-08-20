import type { ContentIcon, ContentStatus, VipContent } from "@/content";
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasString(value: Record<string, unknown>, key: string) {
  return typeof value[key] === "string";
}

function isContentStatus(value: unknown): value is ContentStatus {
  return value === "confirmed" || value === "pending";
}

function isVipDetail(value: unknown) {
  return (
    isRecord(value) &&
    hasString(value, "id") &&
    hasString(value, "label") &&
    hasString(value, "value") &&
    isContentStatus(value.status)
  );
}

function isVipBenefit(value: unknown) {
  return (
    isRecord(value) &&
    hasString(value, "id") &&
    hasString(value, "title") &&
    hasString(value, "description") &&
    (value.icon === undefined || contentIcons.has(value.icon as ContentIcon))
  );
}

function isPurchaseAction(value: unknown) {
  return (
    value === null ||
    (isRecord(value) &&
      hasString(value, "id") &&
      hasString(value, "label") &&
      hasString(value, "ariaLabel") &&
      value.destination === "tebex")
  );
}

export function parseStoredVipContent(value: unknown): VipContent | null {
  if (
    !isRecord(value) ||
    value.id !== "vip" ||
    !hasString(value, "eyebrow") ||
    !hasString(value, "title") ||
    !hasString(value, "description") ||
    !isContentStatus(value.status) ||
    !hasString(value, "statusTitle") ||
    !hasString(value, "statusDescription") ||
    !Array.isArray(value.details) ||
    value.details.length !== 4 ||
    !value.details.every(isVipDetail) ||
    !hasString(value, "benefitsTitle") ||
    !Array.isArray(value.benefits) ||
    !value.benefits.every(isVipBenefit) ||
    !hasString(value, "emptyBenefitsTitle") ||
    !hasString(value, "emptyBenefitsDescription") ||
    !isPurchaseAction(value.purchaseAction) ||
    !hasString(value, "purchaseUnavailableMessage") ||
    !hasString(value, "notice")
  ) {
    return null;
  }

  const detailIds = value.details.map((detail) => detail.id);
  if (detailIds.join(",") !== "price,duration,purchase-method,refund-policy") {
    return null;
  }

  return value as unknown as VipContent;
}

export function vipContentToJson(content: VipContent) {
  return JSON.parse(JSON.stringify(content)) as Prisma.InputJsonObject;
}
