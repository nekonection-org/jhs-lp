import "server-only";

import { unstable_cache } from "next/cache";

import { listPublishedFaqs } from "@/lib/faqs/repository";
import {
  type PublicFaq,
  type PublicFaqsResult,
  toPublicFaq,
} from "@/lib/faqs/public-types";

export type { PublicFaq, PublicFaqsResult } from "@/lib/faqs/public-types";

export const faqsCacheTag = "faqs";

const getCachedPublishedFaqs = unstable_cache(
  async (): Promise<PublicFaqsResult> => {
    try {
      const items = (await listPublishedFaqs())
        .map(toPublicFaq)
        .filter((faq): faq is PublicFaq => faq !== null);
      return { status: "ready", items };
    } catch (error) {
      console.error("Public FAQs are unavailable.", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      return { status: "unavailable", items: [] };
    }
  },
  ["public-faqs-v1"],
  { revalidate: 60, tags: [faqsCacheTag] },
);

export async function getPublicFaqs(): Promise<PublicFaqsResult> {
  return getCachedPublishedFaqs();
}
