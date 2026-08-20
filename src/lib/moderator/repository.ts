import "server-only";

import { findManagedSection } from "@/lib/managed-sections/repository";
import { getManagedSectionTranslation } from "@/lib/managed-sections/types";
import { parseStoredModeratorContent } from "@/lib/moderator/stored-content";
import type { ManagedModeratorContent } from "@/lib/moderator/types";

export async function findModeratorContent(): Promise<ManagedModeratorContent | null> {
  const section = await findManagedSection("moderator");
  if (!section) return null;

  const japanese = parseStoredModeratorContent(
    getManagedSectionTranslation(section, "ja")?.content,
  );
  const english = parseStoredModeratorContent(
    getManagedSectionTranslation(section, "en")?.content,
  );

  if (!japanese || !english) return null;
  return {
    version: section.version,
    translations: { ja: japanese, en: english },
  };
}
