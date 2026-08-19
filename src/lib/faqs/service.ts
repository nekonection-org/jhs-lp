import "server-only";

import {
  AuditAction,
  FaqContentStatus as DatabaseContentStatus,
  FaqLocale as DatabaseLocale,
  FaqStatus as DatabaseStatus,
} from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import type { AdminIdentity } from "@/lib/auth/cloudflare-access";
import { getPrismaClient } from "@/lib/database/client";
import {
  faqWithTranslations,
  mapFaqRecord,
  type DatabaseFaqWithTranslations,
} from "@/lib/faqs/repository";
import type { FaqContentStatus, FaqInput } from "@/lib/faqs/types";

export class FaqNotFoundError extends Error {
  constructor() {
    super("FAQ not found.");
    this.name = "FaqNotFoundError";
  }
}

export class FaqConflictError extends Error {
  constructor() {
    super("FAQ was changed by another administrator.");
    this.name = "FaqConflictError";
  }
}

const contentStatusToDatabase: Readonly<
  Record<FaqContentStatus, DatabaseContentStatus>
> = {
  confirmed: DatabaseContentStatus.CONFIRMED,
  pending: DatabaseContentStatus.PENDING,
};

function statusToDatabase(status: FaqInput["status"]) {
  return status === "published"
    ? DatabaseStatus.PUBLISHED
    : DatabaseStatus.DRAFT;
}

function getTranslationWrites(input: FaqInput) {
  return [
    {
      locale: DatabaseLocale.JA,
      question: input.translations.ja.question,
      answer: input.translations.ja.answer,
    },
    ...(input.translations.en
      ? [
          {
            locale: DatabaseLocale.EN,
            question: input.translations.en.question,
            answer: input.translations.en.answer,
          },
        ]
      : []),
  ];
}

function getFaqWrite(input: FaqInput) {
  if (input.status === "published" && !input.translations.en) {
    throw new Error("Published FAQs require both translations.");
  }

  return {
    status: statusToDatabase(input.status),
    contentStatus: contentStatusToDatabase[input.contentStatus],
    sortOrder: input.sortOrder,
  };
}

function createSnapshot(
  faq: DatabaseFaqWithTranslations,
): Prisma.InputJsonObject {
  return {
    id: faq.id,
    status: faq.status,
    contentStatus: faq.contentStatus,
    sortOrder: faq.sortOrder,
    version: faq.version,
    translations: faq.translations.map((translation) => ({
      locale: translation.locale,
      question: translation.question,
      answer: translation.answer,
    })),
  };
}

function getAuditActor(identity: AdminIdentity) {
  return {
    actorSub: identity.sub,
    actorEmail: identity.email,
    requestId: identity.requestId,
  };
}

export async function createFaq(input: FaqInput, identity: AdminIdentity) {
  const created = await getPrismaClient().$transaction(async (transaction) => {
    const faq = await transaction.faqItem.create({
      data: {
        ...getFaqWrite(input),
        translations: { create: getTranslationWrites(input) },
      },
      include: faqWithTranslations,
    });

    await transaction.auditLog.create({
      data: {
        ...getAuditActor(identity),
        action: AuditAction.CREATE,
        faqItemId: faq.id,
        afterData: createSnapshot(faq),
      },
    });

    return faq;
  });

  return mapFaqRecord(created);
}

async function getExistingFaq(
  transaction: Prisma.TransactionClient,
  id: string,
) {
  const faq = await transaction.faqItem.findUnique({
    where: { id },
    include: faqWithTranslations,
  });

  if (!faq) {
    throw new FaqNotFoundError();
  }

  return faq;
}

export async function updateFaq(
  id: string,
  version: number,
  input: FaqInput,
  identity: AdminIdentity,
) {
  const updated = await getPrismaClient().$transaction(async (transaction) => {
    const existing = await getExistingFaq(transaction, id);
    const writeResult = await transaction.faqItem.updateMany({
      where: { id, version },
      data: { ...getFaqWrite(input), version: { increment: 1 } },
    });

    if (writeResult.count !== 1) {
      throw new FaqConflictError();
    }

    for (const translation of getTranslationWrites(input)) {
      await transaction.faqTranslation.upsert({
        where: {
          faqItemId_locale: { faqItemId: id, locale: translation.locale },
        },
        create: { faqItemId: id, ...translation },
        update: { question: translation.question, answer: translation.answer },
      });
    }

    if (!input.translations.en) {
      await transaction.faqTranslation.deleteMany({
        where: { faqItemId: id, locale: DatabaseLocale.EN },
      });
    }

    const faq = await getExistingFaq(transaction, id);
    await transaction.auditLog.create({
      data: {
        ...getAuditActor(identity),
        action: AuditAction.UPDATE,
        faqItemId: id,
        beforeData: createSnapshot(existing),
        afterData: createSnapshot(faq),
      },
    });

    return faq;
  });

  return mapFaqRecord(updated);
}

export async function archiveFaq(
  id: string,
  version: number,
  identity: AdminIdentity,
) {
  const archived = await getPrismaClient().$transaction(async (transaction) => {
    const existing = await getExistingFaq(transaction, id);
    const writeResult = await transaction.faqItem.updateMany({
      where: { id, version },
      data: { status: DatabaseStatus.ARCHIVED, version: { increment: 1 } },
    });

    if (writeResult.count !== 1) {
      throw new FaqConflictError();
    }

    const faq = await getExistingFaq(transaction, id);
    await transaction.auditLog.create({
      data: {
        ...getAuditActor(identity),
        action: AuditAction.ARCHIVE,
        faqItemId: id,
        beforeData: createSnapshot(existing),
        afterData: createSnapshot(faq),
      },
    });

    return faq;
  });

  return mapFaqRecord(archived);
}
