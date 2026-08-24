import type { RulesContent } from "@/content";

export interface ManagedRulesContent {
  version: number;
  translations: {
    ja: RulesContent;
    en: RulesContent;
  };
}
