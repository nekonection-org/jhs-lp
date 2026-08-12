export const announcementCategories = [
  "notice",
  "maintenance",
  "update",
  "event",
  "important",
  "incident",
] as const;

export const editableAnnouncementStatuses = ["draft", "published"] as const;
export const announcementStatuses = [
  ...editableAnnouncementStatuses,
  "archived",
] as const;

export type AnnouncementCategory = (typeof announcementCategories)[number];
export type EditableAnnouncementStatus =
  (typeof editableAnnouncementStatuses)[number];
export type AnnouncementStatus = (typeof announcementStatuses)[number];
export type AnnouncementLocale = "ja" | "en";

export interface AnnouncementTranslationInput {
  title: string;
  description: string;
}

export interface AnnouncementInput {
  category: AnnouncementCategory;
  status: EditableAnnouncementStatus;
  publishedAt: Date | null;
  externalUrl: string | null;
  translations: {
    ja: AnnouncementTranslationInput;
    en: AnnouncementTranslationInput | null;
  };
}

export interface AnnouncementTranslationRecord {
  locale: AnnouncementLocale;
  title: string;
  description: string;
}

export interface AnnouncementRecord {
  id: string;
  category: AnnouncementCategory;
  status: AnnouncementStatus;
  publishedAt: Date | null;
  externalUrl: string | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  translations: readonly AnnouncementTranslationRecord[];
}

export function getTranslation(
  announcement: AnnouncementRecord,
  locale: AnnouncementLocale,
) {
  return (
    announcement.translations.find(
      (translation) => translation.locale === locale,
    ) ?? null
  );
}

export function getOperationalStatus(
  announcement: Pick<AnnouncementRecord, "status" | "publishedAt">,
  now = new Date(),
) {
  if (announcement.status !== "published") {
    return announcement.status;
  }

  return announcement.publishedAt && announcement.publishedAt > now
    ? "scheduled"
    : "published";
}
