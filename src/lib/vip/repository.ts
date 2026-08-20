import "server-only";

import { findManagedSection } from "@/lib/managed-sections/repository";
import { getManagedSectionTranslation } from "@/lib/managed-sections/types";
import { parseStoredVipContent } from "@/lib/vip/stored-content";
import type { ManagedVipContent } from "@/lib/vip/types";

export async function findVipContent(): Promise<ManagedVipContent | null> {
  const section = await findManagedSection("vip");
  if (!section) {
    return null;
  }

  const japanese = parseStoredVipContent(
    getManagedSectionTranslation(section, "ja")?.content,
  );
  const english = parseStoredVipContent(
    getManagedSectionTranslation(section, "en")?.content,
  );

  if (!japanese || !english) {
    return null;
  }

  return {
    version: section.version,
    translations: { ja: japanese, en: english },
  };
}
