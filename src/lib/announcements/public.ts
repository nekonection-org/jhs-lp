import "server-only";

import { unstable_cache } from "next/cache";

import { listPublishedAnnouncements } from "@/lib/announcements/repository";
import {
  type PublicAnnouncement,
  type PublicAnnouncementsResult,
  toPublicAnnouncement,
} from "@/lib/announcements/public-types";

export type {
  PublicAnnouncement,
  PublicAnnouncementsResult,
} from "@/lib/announcements/public-types";

export const announcementsCacheTag = "announcements";
export const publicAnnouncementsPageSize = 5;

const getCachedPublishedAnnouncements = unstable_cache(
  async (page: number): Promise<PublicAnnouncementsResult> => {
    try {
      const result = await listPublishedAnnouncements({
        page,
        pageSize: publicAnnouncementsPageSize,
      });
      const items = result.items
        .map(toPublicAnnouncement)
        .filter(
          (announcement): announcement is PublicAnnouncement =>
            announcement !== null,
        );
      return {
        status: "ready",
        items,
        pagination: {
          page: result.page,
          pageSize: result.pageSize,
          totalItems: result.totalItems,
          totalPages: result.totalPages,
        },
      };
    } catch (error) {
      console.error("Public announcements are unavailable.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      return { status: "unavailable", items: [] };
    }
  },
  ["public-announcements-v2"],
  { revalidate: 60, tags: [announcementsCacheTag] },
);

export async function getPublicAnnouncements(
  page = 1,
): Promise<PublicAnnouncementsResult> {
  return getCachedPublishedAnnouncements(page);
}
