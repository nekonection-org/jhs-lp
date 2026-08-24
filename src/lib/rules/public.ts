import "server-only";

import { unstable_cache } from "next/cache";

import { findRulesContent } from "@/lib/rules/repository";
import type { ManagedRulesContent } from "@/lib/rules/types";

export type PublicRulesContentResult =
  | { status: "ready"; item: ManagedRulesContent }
  | { status: "unavailable"; item: null };

export const rulesContentCacheTag = "rules-content";

const getCachedRulesContent = unstable_cache(
  async (): Promise<PublicRulesContentResult> => {
    try {
      const item = await findRulesContent();
      return item
        ? { status: "ready", item }
        : { status: "unavailable", item: null };
    } catch (error) {
      console.error("Public rules content is unavailable.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      return { status: "unavailable", item: null };
    }
  },
  ["public-rules-content-v1"],
  { revalidate: 60, tags: [rulesContentCacheTag] },
);

export async function getPublicRulesContent() {
  return getCachedRulesContent();
}
