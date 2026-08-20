import "server-only";

import { unstable_cache } from "next/cache";

import { findModeratorContent } from "@/lib/moderator/repository";
import type { ManagedModeratorContent } from "@/lib/moderator/types";

export type PublicModeratorContentResult =
  | { status: "ready"; item: ManagedModeratorContent }
  | { status: "unavailable"; item: null };

export const moderatorContentCacheTag = "moderator-content";

const getCachedModeratorContent = unstable_cache(
  async (): Promise<PublicModeratorContentResult> => {
    try {
      const item = await findModeratorContent();
      return item
        ? { status: "ready", item }
        : { status: "unavailable", item: null };
    } catch (error) {
      console.error("Public moderator content is unavailable.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      return { status: "unavailable", item: null };
    }
  },
  ["public-moderator-content-v1"],
  { revalidate: 60, tags: [moderatorContentCacheTag] },
);

export async function getPublicModeratorContent() {
  return getCachedModeratorContent();
}
