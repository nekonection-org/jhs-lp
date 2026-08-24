import "server-only";

import { findManagedSection } from "@/lib/managed-sections/repository";
import { getManagedSectionTranslation } from "@/lib/managed-sections/types";
import {
  areRuleStructuresAligned,
  parseStoredRulesContent,
} from "@/lib/rules/stored-content";
import type { ManagedRulesContent } from "@/lib/rules/types";

export async function findRulesContent(): Promise<ManagedRulesContent | null> {
  const section = await findManagedSection("rules");
  if (!section) return null;

  const japanese = parseStoredRulesContent(
    getManagedSectionTranslation(section, "ja")?.content,
  );
  const english = parseStoredRulesContent(
    getManagedSectionTranslation(section, "en")?.content,
  );

  if (!japanese || !english || !areRuleStructuresAligned(japanese, english)) {
    return null;
  }

  return {
    version: section.version,
    translations: { ja: japanese, en: english },
  };
}
