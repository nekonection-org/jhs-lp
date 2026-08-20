import type { AuditLogAction } from "@/lib/audit/types";

export const auditActionLabels: Readonly<
  Record<AuditLogAction, { code: string; label: string }>
> = {
  create: { code: "CREATE", label: "作成" },
  update: { code: "UPDATE", label: "更新" },
  archive: { code: "ARCHIVE", label: "アーカイブ" },
};

const auditDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: "Asia/Tokyo",
});

export function formatAuditDate(date: Date) {
  return `${auditDateFormatter.format(date)} JST`;
}

export function formatAuditSnapshot(value: unknown | null) {
  if (value === null) {
    return null;
  }

  return JSON.stringify(value, null, 2) ?? null;
}

export function getAuditTarget({
  announcementId,
  faqItemId,
  managedSectionId = null,
}: {
  announcementId: string | null;
  faqItemId: string | null;
  managedSectionId?: string | null;
}) {
  if (announcementId) {
    return { label: "お知らせ", id: announcementId };
  }
  if (faqItemId) {
    return { label: "FAQ", id: faqItemId };
  }
  if (managedSectionId === "vip") {
    return { label: "VIP", id: managedSectionId };
  }
  if (managedSectionId === "moderator") {
    return { label: "モデレーター募集", id: managedSectionId };
  }
  return { label: "対象なし", id: null };
}
