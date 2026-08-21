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

export interface PublicAnnouncementsPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type PublicAnnouncementsResult =
  | {
      status: "ready";
      items: readonly PublicAnnouncement[];
      pagination: PublicAnnouncementsPagination;
    }
  | { status: "unavailable"; items: readonly [] };

export function parsePublicAnnouncementsPage(
  value: string | readonly string[] | undefined,
) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate || !/^\d+$/.test(candidate)) {
    return 1;
  }

  const page = Number(candidate);
  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
}

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
