import "server-only";

import {
  FaqContentStatus as DatabaseContentStatus,
  FaqLocale as DatabaseLocale,
  FaqStatus as DatabaseStatus,
} from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import { getPrismaClient } from "@/lib/database/client";
import type {
  FaqContentStatus,
  FaqLocale,
  FaqRecord,
  FaqStatus,
} from "@/lib/faqs/types";

export const faqWithTranslations = {
  translations: { orderBy: { locale: "asc" } },
} satisfies Prisma.FaqItemInclude;

export type DatabaseFaqWithTranslations = Prisma.FaqItemGetPayload<{
  include: typeof faqWithTranslations;
}>;

const statusFromDatabase: Readonly<Record<DatabaseStatus, FaqStatus>> = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

const contentStatusFromDatabase: Readonly<
  Record<DatabaseContentStatus, FaqContentStatus>
> = {
  CONFIRMED: "confirmed",
  PENDING: "pending",
};

const localeFromDatabase: Readonly<Record<DatabaseLocale, FaqLocale>> = {
  JA: "ja",
  EN: "en",
};

export function mapFaqRecord(faq: DatabaseFaqWithTranslations): FaqRecord {
  return {
    id: faq.id,
    status: statusFromDatabase[faq.status],
    contentStatus: contentStatusFromDatabase[faq.contentStatus],
    sortOrder: faq.sortOrder,
    version: faq.version,
    createdAt: faq.createdAt,
    updatedAt: faq.updatedAt,
    translations: faq.translations.map((translation) => ({
      locale: localeFromDatabase[translation.locale],
      question: translation.question,
      answer: translation.answer,
    })),
  };
}

export async function listAdminFaqs() {
  const faqs = await getPrismaClient().faqItem.findMany({
    include: faqWithTranslations,
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: 200,
  });

  return faqs.map(mapFaqRecord);
}

export async function findAdminFaq(id: string) {
  const faq = await getPrismaClient().faqItem.findUnique({
    where: { id },
    include: faqWithTranslations,
  });

  return faq ? mapFaqRecord(faq) : null;
}

export async function listPublishedFaqs() {
  const faqs = await getPrismaClient().faqItem.findMany({
    where: { status: DatabaseStatus.PUBLISHED },
    include: faqWithTranslations,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    take: 100,
  });

  return faqs.map(mapFaqRecord);
}
