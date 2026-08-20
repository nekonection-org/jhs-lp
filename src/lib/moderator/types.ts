import type { ModeratorContent } from "@/content";

export interface ManagedModeratorContent {
  version: number;
  translations: {
    ja: ModeratorContent;
    en: ModeratorContent;
  };
}
