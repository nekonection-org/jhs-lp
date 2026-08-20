import type { VipContent } from "@/content";

export interface ManagedVipContent {
  version: number;
  translations: {
    ja: VipContent;
    en: VipContent;
  };
}
