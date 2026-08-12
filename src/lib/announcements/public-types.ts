import type {
  AnnouncementCategory,
  AnnouncementRecord,
} from "@/lib/announcements/types";
import { getTranslation } from "@/lib/announcements/types";

export interface PublicAnnouncement {
  id: string;
  category: AnnouncementCategory;
  publishedAt: string;
  externalUrl: string | null;
  translations: {
    ja: { title: string; description: string };
    en: { title: string; description: string } | null;
  };
}

export type PublicAnnouncementsResult =
  | { status: "ready"; items: readonly PublicAnnouncement[] }
  | { status: "unavailable"; items: readonly [] };

export function toPublicAnnouncement(
  announcement: AnnouncementRecord,
): PublicAnnouncement | null {
  const japanese = getTranslation(announcement, "ja");

  if (!japanese || !announcement.publishedAt) {
    return null;
  }

  const english = getTranslation(announcement, "en");

  return {
    id: announcement.id,
    category: announcement.category,
    publishedAt: announcement.publishedAt.toISOString(),
    externalUrl: announcement.externalUrl,
    translations: {
      ja: {
        title: japanese.title,
        description: japanese.description,
      },
      en: english
        ? { title: english.title, description: english.description }
        : null,
    },
  };
}
