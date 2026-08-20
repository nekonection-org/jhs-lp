export const managedSectionIds = ["vip", "moderator"] as const;

export type ManagedSectionId = (typeof managedSectionIds)[number];
export type ManagedSectionLocale = "ja" | "en";

export interface ManagedSectionTranslationRecord {
  locale: ManagedSectionLocale;
  content: unknown;
}

export interface ManagedSectionRecord {
  id: ManagedSectionId;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  translations: readonly ManagedSectionTranslationRecord[];
}

export function getManagedSectionTranslation(
  section: ManagedSectionRecord,
  locale: ManagedSectionLocale,
) {
  return (
    section.translations.find((translation) => translation.locale === locale) ??
    null
  );
}
