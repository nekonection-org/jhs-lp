import "server-only";

import {
  AuditAction,
  ManagedSectionLocale as DatabaseLocale,
} from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import type { AdminIdentity } from "@/lib/auth/cloudflare-access";
import { getPrismaClient } from "@/lib/database/client";
import {
  managedSectionWithTranslations,
  mapManagedSectionRecord,
  type DatabaseManagedSectionWithTranslations,
} from "@/lib/managed-sections/repository";
import type { ManagedSectionId } from "@/lib/managed-sections/types";

export class ManagedSectionNotFoundError extends Error {
  constructor() {
    super("Managed section not found.");
    this.name = "ManagedSectionNotFoundError";
  }
}

export class ManagedSectionConflictError extends Error {
  constructor() {
    super("Managed section was changed by another administrator.");
    this.name = "ManagedSectionConflictError";
  }
}

export interface ManagedSectionUpdateInput {
  ja: Prisma.InputJsonObject;
  en: Prisma.InputJsonObject;
}

function createSnapshot(
  section: DatabaseManagedSectionWithTranslations,
): Prisma.InputJsonObject {
  return {
    id: section.id,
    version: section.version,
    translations: section.translations.map((translation) => ({
      locale: translation.locale,
      content: translation.content,
    })),
  };
}

async function getExistingSection(
  transaction: Prisma.TransactionClient,
  id: ManagedSectionId,
) {
  const section = await transaction.managedSection.findUnique({
    where: { id },
    include: managedSectionWithTranslations,
  });

  if (!section) {
    throw new ManagedSectionNotFoundError();
  }

  return section;
}

export async function updateManagedSection(
  id: ManagedSectionId,
  version: number,
  input: ManagedSectionUpdateInput,
  identity: AdminIdentity,
) {
  const updated = await getPrismaClient().$transaction(async (transaction) => {
    const existing = await getExistingSection(transaction, id);
    const writeResult = await transaction.managedSection.updateMany({
      where: { id, version },
      data: { version: { increment: 1 } },
    });

    if (writeResult.count !== 1) {
      throw new ManagedSectionConflictError();
    }

    for (const translation of [
      { locale: DatabaseLocale.JA, content: input.ja },
      { locale: DatabaseLocale.EN, content: input.en },
    ]) {
      await transaction.managedSectionTranslation.upsert({
        where: {
          managedSectionId_locale: {
            managedSectionId: id,
            locale: translation.locale,
          },
        },
        create: { managedSectionId: id, ...translation },
        update: { content: translation.content },
      });
    }

    const section = await getExistingSection(transaction, id);
    await transaction.auditLog.create({
      data: {
        actorSub: identity.sub,
        actorEmail: identity.email,
        requestId: identity.requestId,
        action: AuditAction.UPDATE,
        managedSectionId: id,
        beforeData: createSnapshot(existing),
        afterData: createSnapshot(section),
      },
    });

    return section;
  });

  return mapManagedSectionRecord(updated);
}
