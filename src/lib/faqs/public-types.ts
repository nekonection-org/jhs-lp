import type { FaqContentStatus, FaqRecord } from "@/lib/faqs/types";
import { getFaqTranslation } from "@/lib/faqs/types";

export interface PublicFaq {
  id: string;
  contentStatus: FaqContentStatus;
  translations: {
    ja: { question: string; answer: string };
    en: { question: string; answer: string };
  };
}

export type PublicFaqsResult =
  | { status: "ready"; items: readonly PublicFaq[] }
  | { status: "unavailable"; items: readonly [] };

export function toPublicFaq(faq: FaqRecord): PublicFaq | null {
  const japanese = getFaqTranslation(faq, "ja");
  const english = getFaqTranslation(faq, "en");

  if (!japanese || !english) {
    return null;
  }

  return {
    id: faq.id,
    contentStatus: faq.contentStatus,
    translations: {
      ja: { question: japanese.question, answer: japanese.answer },
      en: { question: english.question, answer: english.answer },
    },
  };
}
