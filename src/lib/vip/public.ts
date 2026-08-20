import "server-only";

import { unstable_cache } from "next/cache";

import { findVipContent } from "@/lib/vip/repository";
import type { ManagedVipContent } from "@/lib/vip/types";

export type PublicVipContentResult =
  | { status: "ready"; item: ManagedVipContent }
  | { status: "unavailable"; item: null };

export const vipContentCacheTag = "vip-content";

const getCachedVipContent = unstable_cache(
  async (): Promise<PublicVipContentResult> => {
    try {
      const item = await findVipContent();
      return item
        ? { status: "ready", item }
        : { status: "unavailable", item: null };
    } catch (error) {
      console.error("Public VIP content is unavailable.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      return { status: "unavailable", item: null };
    }
  },
  ["public-vip-content-v1"],
  { revalidate: 60, tags: [vipContentCacheTag] },
);

export async function getPublicVipContent() {
  return getCachedVipContent();
}
