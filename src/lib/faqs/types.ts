export const editableFaqStatuses = ["draft", "published"] as const;
export const faqStatuses = [...editableFaqStatuses, "archived"] as const;
export const faqContentStatuses = ["confirmed", "pending"] as const;

export type EditableFaqStatus = (typeof editableFaqStatuses)[number];
export type FaqStatus = (typeof faqStatuses)[number];
export type FaqContentStatus = (typeof faqContentStatuses)[number];
export type FaqLocale = "ja" | "en";

export interface FaqTranslationInput {
  question: string;
  answer: string;
}

export interface FaqInput {
  status: EditableFaqStatus;
  contentStatus: FaqContentStatus;
  sortOrder: number;
  translations: {
    ja: FaqTranslationInput;
    en: FaqTranslationInput | null;
  };
}

export interface FaqTranslationRecord {
  locale: FaqLocale;
  question: string;
  answer: string;
}

export interface FaqRecord {
  id: string;
  status: FaqStatus;
  contentStatus: FaqContentStatus;
  sortOrder: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  translations: readonly FaqTranslationRecord[];
}

export function getFaqTranslation(faq: FaqRecord, locale: FaqLocale) {
  return (
    faq.translations.find((translation) => translation.locale === locale) ??
    null
  );
}
