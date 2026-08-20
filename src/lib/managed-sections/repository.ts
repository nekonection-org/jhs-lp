import "server-only";

import { ManagedSectionLocale as DatabaseLocale } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import { getPrismaClient } from "@/lib/database/client";
import type {
  ManagedSectionId,
  ManagedSectionLocale,
  ManagedSectionRecord,
} from "@/lib/managed-sections/types";

export const managedSectionWithTranslations = {
  translations: { orderBy: { locale: "asc" } },
} satisfies Prisma.ManagedSectionInclude;

export type DatabaseManagedSectionWithTranslations =
  Prisma.ManagedSectionGetPayload<{
    include: typeof managedSectionWithTranslations;
  }>;

const localeFromDatabase: Readonly<
  Record<DatabaseLocale, ManagedSectionLocale>
> = {
  JA: "ja",
  EN: "en",
};

export function mapManagedSectionRecord(
  section: DatabaseManagedSectionWithTranslations,
): ManagedSectionRecord {
  return {
    id: section.id as ManagedSectionId,
    version: section.version,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
    translations: section.translations.map((translation) => ({
      locale: localeFromDatabase[translation.locale],
      content: translation.content,
    })),
  };
}

export async function findManagedSection(id: ManagedSectionId) {
  const section = await getPrismaClient().managedSection.findUnique({
    where: { id },
    include: managedSectionWithTranslations,
  });

  return section ? mapManagedSectionRecord(section) : null;
}
