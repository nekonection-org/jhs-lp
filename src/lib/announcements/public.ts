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

const getCachedPublishedAnnouncements = unstable_cache(
  async () =>
    (await listPublishedAnnouncements())
      .map(toPublicAnnouncement)
      .filter(
        (announcement): announcement is PublicAnnouncement =>
          announcement !== null,
      ),
  ["public-announcements-v1"],
  { revalidate: 60, tags: [announcementsCacheTag] },
);

export async function getPublicAnnouncements(): Promise<PublicAnnouncementsResult> {
  try {
    const items = await getCachedPublishedAnnouncements();
    return { status: "ready", items };
  } catch (error) {
    console.error("Public announcements are unavailable.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return { status: "unavailable", items: [] };
  }
}
