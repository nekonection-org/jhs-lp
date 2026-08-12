import "server-only";

import {
  AnnouncementCategory as DatabaseCategory,
  AnnouncementLocale as DatabaseLocale,
  AnnouncementStatus as DatabaseStatus,
  AuditAction,
} from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import type { AdminIdentity } from "@/lib/auth/cloudflare-access";
import {
  announcementWithTranslations,
  mapAnnouncementRecord,
  type DatabaseAnnouncementWithTranslations,
} from "@/lib/announcements/repository";
import type {
  AnnouncementCategory,
  AnnouncementInput,
} from "@/lib/announcements/types";
import { getPrismaClient } from "@/lib/database/client";

export class AnnouncementNotFoundError extends Error {
  constructor() {
    super("Announcement not found.");
    this.name = "AnnouncementNotFoundError";
  }
}

export class AnnouncementConflictError extends Error {
  constructor() {
    super("Announcement was changed by another administrator.");
    this.name = "AnnouncementConflictError";
  }
}

const categoryToDatabase: Readonly<
  Record<AnnouncementCategory, DatabaseCategory>
> = {
  notice: DatabaseCategory.NOTICE,
  maintenance: DatabaseCategory.MAINTENANCE,
  update: DatabaseCategory.UPDATE,
  event: DatabaseCategory.EVENT,
  important: DatabaseCategory.IMPORTANT,
  incident: DatabaseCategory.INCIDENT,
};

function statusToDatabase(status: AnnouncementInput["status"]) {
  return status === "published"
    ? DatabaseStatus.PUBLISHED
    : DatabaseStatus.DRAFT;
}

function getTranslationWrites(input: AnnouncementInput) {
  return [
    {
      locale: DatabaseLocale.JA,
      title: input.translations.ja.title,
      description: input.translations.ja.description,
    },
    ...(input.translations.en
      ? [
          {
            locale: DatabaseLocale.EN,
            title: input.translations.en.title,
            description: input.translations.en.description,
          },
        ]
      : []),
  ];
}

function createSnapshot(
  announcement: DatabaseAnnouncementWithTranslations,
): Prisma.InputJsonObject {
  return {
    id: announcement.id,
    category: announcement.category,
    status: announcement.status,
    publishedAt: announcement.publishedAt?.toISOString() ?? null,
    externalUrl: announcement.externalUrl,
    version: announcement.version,
    translations: announcement.translations.map((translation) => ({
      locale: translation.locale,
      title: translation.title,
      description: translation.description,
    })),
  };
}

function getAnnouncementWrite(input: AnnouncementInput) {
  if (input.status === "published" && !input.publishedAt) {
    throw new Error("Published announcements require a publication date.");
  }

  return {
    category: categoryToDatabase[input.category],
    status: statusToDatabase(input.status),
    publishedAt: input.publishedAt,
    externalUrl: input.externalUrl,
  };
}

function getAuditActor(identity: AdminIdentity) {
  return {
    actorSub: identity.sub,
    actorEmail: identity.email,
    requestId: identity.requestId,
  };
}

export async function createAnnouncement(
  input: AnnouncementInput,
  identity: AdminIdentity,
) {
  const created = await getPrismaClient().$transaction(async (transaction) => {
    const announcement = await transaction.announcement.create({
      data: {
        ...getAnnouncementWrite(input),
        translations: {
          create: getTranslationWrites(input),
        },
      },
      include: announcementWithTranslations,
    });

    await transaction.auditLog.create({
      data: {
        ...getAuditActor(identity),
        action: AuditAction.CREATE,
        announcementId: announcement.id,
        afterData: createSnapshot(announcement),
      },
    });

    return announcement;
  });

  return mapAnnouncementRecord(created);
}

async function getExistingAnnouncement(
  transaction: Prisma.TransactionClient,
  id: string,
) {
  const announcement = await transaction.announcement.findUnique({
    where: { id },
    include: announcementWithTranslations,
  });

  if (!announcement) {
    throw new AnnouncementNotFoundError();
  }

  return announcement;
}

export async function updateAnnouncement(
  id: string,
  version: number,
  input: AnnouncementInput,
  identity: AdminIdentity,
) {
  const updated = await getPrismaClient().$transaction(async (transaction) => {
    const existing = await getExistingAnnouncement(transaction, id);
    const writeResult = await transaction.announcement.updateMany({
      where: { id, version },
      data: {
        ...getAnnouncementWrite(input),
        version: { increment: 1 },
      },
    });

    if (writeResult.count !== 1) {
      throw new AnnouncementConflictError();
    }

    for (const translation of getTranslationWrites(input)) {
      await transaction.announcementTranslation.upsert({
        where: {
          announcementId_locale: {
            announcementId: id,
            locale: translation.locale,
          },
        },
        create: { announcementId: id, ...translation },
        update: {
          title: translation.title,
          description: translation.description,
        },
      });
    }

    if (!input.translations.en) {
      await transaction.announcementTranslation.deleteMany({
        where: { announcementId: id, locale: DatabaseLocale.EN },
      });
    }

    const announcement = await getExistingAnnouncement(transaction, id);

    await transaction.auditLog.create({
      data: {
        ...getAuditActor(identity),
        action: AuditAction.UPDATE,
        announcementId: id,
        beforeData: createSnapshot(existing),
        afterData: createSnapshot(announcement),
      },
    });

    return announcement;
  });

  return mapAnnouncementRecord(updated);
}

export async function archiveAnnouncement(
  id: string,
  version: number,
  identity: AdminIdentity,
) {
  const archived = await getPrismaClient().$transaction(async (transaction) => {
    const existing = await getExistingAnnouncement(transaction, id);
    const writeResult = await transaction.announcement.updateMany({
      where: { id, version },
      data: {
        status: DatabaseStatus.ARCHIVED,
        version: { increment: 1 },
      },
    });

    if (writeResult.count !== 1) {
      throw new AnnouncementConflictError();
    }

    const announcement = await getExistingAnnouncement(transaction, id);

    await transaction.auditLog.create({
      data: {
        ...getAuditActor(identity),
        action: AuditAction.ARCHIVE,
        announcementId: id,
        beforeData: createSnapshot(existing),
        afterData: createSnapshot(announcement),
      },
    });

    return announcement;
  });

  return mapAnnouncementRecord(archived);
}
